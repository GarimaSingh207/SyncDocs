import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Document, Role, Collaborator, EditEventItem } from '../types';
import documentService from '../services/documents';
import sharingService from '../services/sharing';
import historyService from '../services/history';
import useSocket from '../hooks/useSocket';
import axios from 'axios';

interface RoomUser {
  userId: string;
  name: string;
  role: Role;
}

type SaveStatus = 'saved' | 'saving' | 'unsaved' | 'error';

// Helper function for human-readable timestamps
function formatTimeAgo(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (secondsAgo < 10) return 'Just now';
  if (secondsAgo < 60) return `${secondsAgo} seconds ago`;
  const minutesAgo = Math.floor(secondsAgo / 60);
  if (minutesAgo < 60) return `${minutesAgo} minute${minutesAgo === 1 ? '' : 's'} ago`;
  const hoursAgo = Math.floor(minutesAgo / 60);
  if (hoursAgo < 24) return `${hoursAgo} hour${hoursAgo === 1 ? '' : 's'} ago`;
  const daysAgo = Math.floor(hoursAgo / 24);
  if (daysAgo === 1) return 'Yesterday';
  if (daysAgo < 7) return `${daysAgo} days ago`;

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export const DocumentEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { socket, connected, connecting } = useSocket();

  const [document, setDocument] = useState<Document | null>(null);
  const [userRole, setUserRole] = useState<Role>('VIEWER');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Auto-Save & Debounce State
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const lastSavedRef = useRef<{ title: string; content: string }>({ title: '', content: '' });
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Realtime Editing & Loop Prevention Refs
  const [remoteNotice, setRemoteNotice] = useState<string | null>(null);
  const isRemoteEditRef = useRef<boolean>(false);
  const titleRef = useRef<string>('');
  const contentRef = useRef<string>('');
  const userRoleRef = useRef<Role>('VIEWER');
  const saveStatusRef = useRef<SaveStatus>('saved');

  titleRef.current = title;
  contentRef.current = content;
  userRoleRef.current = userRole;
  saveStatusRef.current = saveStatus;

  // Presence State
  const [activeRoomUsers, setActiveRoomUsers] = useState<RoomUser[]>([]);

  // Sharing State
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [shareEmail, setShareEmail] = useState('');
  const [shareRole, setShareRole] = useState<Role>('VIEWER');
  const [shareLoading, setShareLoading] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);
  const [shareSuccess, setShareSuccess] = useState<string | null>(null);

  // History Drawer State (Lazy Loaded)
  const [showHistoryDrawer, setShowHistoryDrawer] = useState<boolean>(false);
  const [historyEvents, setHistoryEvents] = useState<EditEventItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState<boolean>(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [historyPage, setHistoryPage] = useState<number>(1);
  const [hasMoreHistory, setHasMoreHistory] = useState<boolean>(false);

  // Execute Persistence Request to Backend
  const performSave = useCallback(
    async (titleToSave: string, contentToSave: string) => {
      if (!id || !titleToSave.trim() || userRoleRef.current === 'VIEWER') return;

      if (
        titleToSave === lastSavedRef.current.title &&
        contentToSave === lastSavedRef.current.content
      ) {
        setSaveStatus('saved');
        return;
      }

      setSaveStatus('saving');
      try {
        const updated = await documentService.updateDocument(id, {
          title: titleToSave.trim(),
          content: contentToSave,
        });
        lastSavedRef.current = { title: updated.title, content: updated.content };
        setSaveStatus('saved');
      } catch (err) {
        console.error('Auto-save failed:', err);
        setSaveStatus('error');
      }
    },
    [id]
  );

  // Schedule Debounced Auto-Save (800ms)
  const scheduleAutoSave = useCallback(
    (newTitle: string, newContent: string) => {
      if (userRoleRef.current === 'VIEWER') return;

      if (
        newTitle === lastSavedRef.current.title &&
        newContent === lastSavedRef.current.content
      ) {
        setSaveStatus('saved');
        return;
      }

      setSaveStatus('unsaved');

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        performSave(newTitle, newContent);
      }, 800);
    },
    [performSave]
  );

  // Fetch initial document
  useEffect(() => {
    if (!id) return;

    const fetchDocument = async () => {
      setLoading(true);
      setError(null);
      try {
        const doc = await documentService.getDocumentById(id);
        setDocument(doc);
        setTitle(doc.title);
        setContent(doc.content);
        lastSavedRef.current = { title: doc.title, content: doc.content };
        if (doc.userRole) {
          setUserRole(doc.userRole);
        }
      } catch (err: unknown) {
        if (axios.isAxiosError(err) && err.response?.data?.message) {
          setError(err.response.data.message);
        } else {
          setError('Failed to load document.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id]);

  // Flush unsaved changes on unmount / navigation
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (
        saveStatusRef.current === 'unsaved' &&
        userRoleRef.current !== 'VIEWER' &&
        id &&
        titleRef.current.trim()
      ) {
        documentService
          .updateDocument(id, {
            title: titleRef.current.trim(),
            content: contentRef.current,
          })
          .catch((e) => console.error('Unmount save failed:', e));
      }
    };
  }, [id]);

  // Socket Room & Collaborative Synchronization Effect
  useEffect(() => {
    if (!id || !socket || !connected || !document) return;

    socket.emit('join-document', { documentId: id });
    socket.emit('document-request-sync', { documentId: id });

    const handleRoomUsers = (users: RoomUser[]) => {
      setActiveRoomUsers(users);
    };

    const handleDocumentUpdate = (data: {
      documentId: string;
      title?: string;
      content?: string;
      updatedBy?: string;
    }) => {
      if (data.documentId !== id) return;

      isRemoteEditRef.current = true;
      if (data.title !== undefined) {
        setTitle(data.title);
        lastSavedRef.current.title = data.title;
      }
      if (data.content !== undefined) {
        setContent(data.content);
        lastSavedRef.current.content = data.content;
      }

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      setSaveStatus('saved');

      const updaterName = data.updatedBy ? `by ${data.updatedBy}` : '';
      setRemoteNotice(`Document updated ${updaterName}`);
      setTimeout(() => setRemoteNotice(null), 3000);
    };

    const handleRequestSync = (data: { requesterSocketId: string }) => {
      if (userRoleRef.current === 'OWNER' || userRoleRef.current === 'EDITOR') {
        socket.emit('document-sync', {
          targetSocketId: data.requesterSocketId,
          title: titleRef.current,
          content: contentRef.current,
        });
      }
    };

    const handleDocumentSync = (data: { title: string; content: string }) => {
      isRemoteEditRef.current = true;
      setTitle(data.title);
      setContent(data.content);
      lastSavedRef.current = { title: data.title, content: data.content };
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      setSaveStatus('saved');
    };

    const handleSocketError = (err: { message: string }) => {
      setError(err.message || 'Realtime room connection error');
    };

    socket.on('room-users', handleRoomUsers);
    socket.on('document-update', handleDocumentUpdate);
    socket.on('document-request-sync', handleRequestSync);
    socket.on('document-sync', handleDocumentSync);
    socket.on('error', handleSocketError);

    return () => {
      socket.emit('leave-document', { documentId: id });
      socket.off('room-users', handleRoomUsers);
      socket.off('document-update', handleDocumentUpdate);
      socket.off('document-request-sync', handleRequestSync);
      socket.off('document-sync', handleDocumentSync);
      socket.off('error', handleSocketError);
    };
  }, [id, socket, connected, document]);

  // Lazy Load History on Panel Toggle
  const loadHistory = async (pageNum: number = 1, append: boolean = false) => {
    if (!id) return;

    setHistoryLoading(true);
    setHistoryError(null);

    try {
      const res = await historyService.getDocumentHistory(id, pageNum, 10);
      if (append) {
        setHistoryEvents((prev) => [...prev, ...res.events]);
      } else {
        setHistoryEvents(res.events);
      }
      setHistoryPage(res.pagination.page);
      setHasMoreHistory(res.pagination.page < res.pagination.totalPages);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setHistoryError(err.response.data.message);
      } else {
        setHistoryError('Failed to load history.');
      }
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleToggleHistoryDrawer = () => {
    const nextState = !showHistoryDrawer;
    setShowHistoryDrawer(nextState);
    if (nextState) {
      loadHistory(1, false);
    }
  };

  const handleLoadMoreHistory = () => {
    loadHistory(historyPage + 1, true);
  };

  // Handle Title Change (Local input)
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);

    if (userRole === 'VIEWER') return;

    if (!isRemoteEditRef.current) {
      if (socket && connected && id) {
        socket.emit('document-update', {
          documentId: id,
          title: newTitle,
          content,
        });
      }
      scheduleAutoSave(newTitle, content);
    }
    isRemoteEditRef.current = false;
  };

  // Handle Content Change (Local input)
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);

    if (userRole === 'VIEWER') return;

    if (!isRemoteEditRef.current) {
      if (socket && connected && id) {
        socket.emit('document-update', {
          documentId: id,
          title,
          content: newContent,
        });
      }
      scheduleAutoSave(title, newContent);
    }
    isRemoteEditRef.current = false;
  };

  const loadCollaborators = async () => {
    if (!id || userRole !== 'OWNER') return;
    try {
      const accessList = await sharingService.getDocumentAccess(id);
      setCollaborators(accessList);
    } catch (err) {
      console.error('Failed to load collaborators:', err);
    }
  };

  const handleOpenShareModal = () => {
    setShowShareModal(!showShareModal);
    if (!showShareModal) {
      loadCollaborators();
    }
  };

  const handleShareUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !shareEmail.trim()) return;

    setShareLoading(true);
    setShareError(null);
    setShareSuccess(null);

    try {
      const updatedList = await sharingService.shareDocument(id, {
        email: shareEmail.trim(),
        role: shareRole,
      });
      setCollaborators(updatedList);
      setShareEmail('');
      setShareSuccess('Document shared successfully!');
      setTimeout(() => setShareSuccess(null), 3000);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setShareError(err.response.data.message);
      } else {
        setShareError('Failed to share document.');
      }
    } finally {
      setShareLoading(false);
    }
  };

  const handleUpdateRole = async (accessId: string, newRole: Role) => {
    if (!id) return;
    setShareError(null);
    try {
      const updatedList = await sharingService.updateAccessRole(id, accessId, { role: newRole });
      setCollaborators(updatedList);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setShareError(err.response.data.message);
      } else {
        setShareError('Failed to update collaborator role.');
      }
    }
  };

  const handleRemoveAccess = async (accessId: string, email: string) => {
    if (!id || !window.confirm(`Remove access for ${email}?`)) return;
    setShareError(null);
    try {
      await sharingService.removeAccess(id, accessId);
      setCollaborators((prev) => prev.filter((c) => c.accessId !== accessId));
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setShareError(err.response.data.message);
      } else {
        setShareError('Failed to remove collaborator access.');
      }
    }
  };

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '3rem' }}>
        <p>Loading document editor...</p>
      </div>
    );
  }

  if (error && !document) {
    return (
      <div className="page-container">
        <div className="alert alert-error">{error}</div>
        <button onClick={() => navigate('/documents')} className="btn btn-secondary">
          ← Back to Documents
        </button>
      </div>
    );
  }

  const isReadOnly = userRole === 'VIEWER';

  return (
    <div className="page-container editor-container">
      <div className="editor-header">
        <button onClick={() => navigate('/documents')} className="btn btn-secondary">
          ← Back to Documents
        </button>
        <div className="editor-actions">
          {/* Socket Connection Badge */}
          <span className="socket-status-badge">
            {connected ? '● Live' : connecting ? '🟡 Connecting...' : '🔴 Disconnected'}
          </span>

          <span className={`role-badge role-${userRole.toLowerCase()}`}>{userRole}</span>

          {/* History Drawer Toggle */}
          <button onClick={handleToggleHistoryDrawer} className="btn btn-secondary">
            📜 History
          </button>

          {userRole === 'OWNER' && (
            <button onClick={handleOpenShareModal} className="btn btn-secondary">
              👥 Share
            </button>
          )}

          {/* Auto-Save Status Indicator */}
          {!isReadOnly && (
            <span className={`save-status save-${saveStatus}`}>
              {saveStatus === 'saving' && '● Saving...'}
              {saveStatus === 'saved' && '✓ Saved'}
              {saveStatus === 'unsaved' && '● Unsaved'}
              {saveStatus === 'error' && '⚠ Save failed'}
            </span>
          )}
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Remote Edit Toast Banner */}
      {remoteNotice && (
        <div
          className="alert"
          style={{
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid #10b981',
            color: '#6ee7b7',
            transition: 'all 0.3s ease',
          }}
        >
          ⚡ {remoteNotice}
        </div>
      )}

      {/* History Drawer Panel */}
      {showHistoryDrawer && (
        <div
          className="history-panel"
          style={{
            backgroundColor: '#111827',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid #374151',
            marginBottom: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, color: '#f3f4f6' }}>📜 Edit History & Audit Logs</h3>
            <button onClick={handleToggleHistoryDrawer} className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.85rem' }}>
              Close ✕
            </button>
          </div>

          {historyError && <div className="alert alert-error">{historyError}</div>}

          {historyLoading && historyEvents.length === 0 ? (
            <p style={{ color: '#9ca3af', textAlign: 'center', padding: '1rem 0' }}>Loading edit history...</p>
          ) : historyEvents.length === 0 ? (
            <p style={{ color: '#9ca3af', textAlign: 'center', padding: '1rem 0' }}>No edit history logged yet. Edits will appear here after auto-saving!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {historyEvents.map((evt) => (
                <div
                  key={evt.id}
                  style={{
                    backgroundColor: '#1f2937',
                    padding: '1rem',
                    borderRadius: '6px',
                    border: '1px solid #374151',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <strong style={{ color: '#60a5fa' }}>{evt.userName}</strong>
                    <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>{formatTimeAgo(evt.createdAt)}</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#d1d5db', marginBottom: '0.4rem' }}>
                    <strong>Title:</strong> {evt.title}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#9ca3af', backgroundColor: '#111827', padding: '0.5rem', borderRadius: '4px', fontStyle: 'italic' }}>
                    "{evt.content ? (evt.content.length > 150 ? `${evt.content.substring(0, 150)}...` : evt.content) : 'Empty content'}"
                  </div>
                </div>
              ))}

              {hasMoreHistory && (
                <button
                  onClick={handleLoadMoreHistory}
                  className="btn btn-secondary"
                  style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
                  disabled={historyLoading}
                >
                  {historyLoading ? 'Loading...' : 'Load More History'}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Realtime Active Presence Section */}
      <div
        className="presence-bar"
        style={{
          backgroundColor: '#111827',
          padding: '0.6rem 1rem',
          borderRadius: '6px',
          border: '1px solid #374151',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
        }}
      >
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#9ca3af' }}>Currently viewing:</span>
        {activeRoomUsers.length === 0 ? (
          <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>Only you</span>
        ) : (
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {activeRoomUsers.map((u) => (
              <span key={u.userId} className={`presence-pill presence-${u.role.toLowerCase()}`}>
                {u.name} ({u.role})
              </span>
            ))}
          </div>
        )}
      </div>

      {isReadOnly && (
        <div
          className="alert"
          style={{
            backgroundColor: 'rgba(59, 130, 246, 0.15)',
            border: '1px solid #3b82f6',
            color: '#93c5fd',
          }}
        >
          ℹ You have read-only (Viewer) access to this document.
        </div>
      )}

      {/* Share / Collaborators Panel */}
      {showShareModal && userRole === 'OWNER' && (
        <div
          className="share-panel"
          style={{
            backgroundColor: '#111827',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid #374151',
            marginBottom: '1.5rem',
          }}
        >
          <h3 style={{ marginTop: 0, color: '#f3f4f6' }}>Manage Collaborators</h3>

          {shareError && <div className="alert alert-error">{shareError}</div>}
          {shareSuccess && (
            <div
              className="alert"
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid #10b981',
                color: '#6ee7b7',
              }}
            >
              {shareSuccess}
            </div>
          )}

          <form onSubmit={handleShareUser} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <input
              type="email"
              placeholder="User email address..."
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
              required
              style={{
                flex: 1,
                padding: '0.6rem 0.8rem',
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '6px',
                color: '#fff',
              }}
              disabled={shareLoading}
            />
            <select
              value={shareRole}
              onChange={(e) => setShareRole(e.target.value as Role)}
              style={{
                padding: '0.6rem 0.8rem',
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '6px',
                color: '#fff',
              }}
              disabled={shareLoading}
            >
              <option value="VIEWER">Viewer</option>
              <option value="EDITOR">Editor</option>
            </select>
            <button type="submit" className="btn btn-primary" disabled={shareLoading || !shareEmail.trim()}>
              {shareLoading ? 'Sharing...' : 'Invite'}
            </button>
          </form>

          <h4 style={{ color: '#d1d5db', marginBottom: '0.75rem' }}>Current Collaborators</h4>
          {collaborators.length === 0 ? (
            <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>No collaborators invited yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {collaborators.map((c) => (
                <div
                  key={c.accessId}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: '#1f2937',
                    padding: '0.75rem 1rem',
                    borderRadius: '6px',
                    border: '1px solid #374151',
                  }}
                >
                  <div>
                    <strong style={{ color: '#f9fafb' }}>{c.name}</strong>{' '}
                    <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>({c.email})</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <select
                      value={c.role}
                      onChange={(e) => handleUpdateRole(c.accessId, e.target.value as Role)}
                      style={{
                        padding: '0.4rem 0.6rem',
                        backgroundColor: '#111827',
                        border: '1px solid #374151',
                        borderRadius: '4px',
                        color: '#fff',
                        fontSize: '0.85rem',
                      }}
                    >
                      <option value="VIEWER">Viewer</option>
                      <option value="EDITOR">Editor</option>
                    </select>
                    <button
                      onClick={() => handleRemoveAccess(c.accessId, c.email)}
                      className="btn btn-danger"
                      style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="editor-title-group">
        <input
          type="text"
          className="editor-title-input"
          value={title}
          onChange={handleTitleChange}
          placeholder="Document Title"
          disabled={isReadOnly}
        />
      </div>

      <div className="editor-body">
        <textarea
          className="editor-textarea"
          value={content}
          onChange={handleContentChange}
          placeholder={
            isReadOnly ? 'Read-only document content.' : 'Start typing your document content here...'
          }
          disabled={isReadOnly}
        />
      </div>
    </div>
  );
};

export default DocumentEditorPage;
