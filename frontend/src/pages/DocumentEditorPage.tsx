import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Document, Role, EditEventItem } from '../types';
import documentService from '../services/documents';
import historyService from '../services/history';
import useSocket from '../hooks/useSocket';
import axios from 'axios';
import ShareModal from '../components/ShareModal';
import './DocumentEditorPage.css';

interface RoomUser {
  userId: string;
  name: string;
  role: Role;
}

type SaveStatus = 'saved' | 'saving' | 'unsaved' | 'error';

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

  const handleOpenShareModal = () => {
    setShowShareModal(!showShareModal);
  };

  // Right Side Panel Tab Selection
  const [activeRightTab, setActiveRightTab] = useState<'comments' | 'activity' | 'outline'>('comments');

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

  // Lazy Load History on Drawer Toggle
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

  if (loading) {
    return (
      <div className="flex h-screen bg-[#0A0A0B] text-[#e5e2e3] items-center justify-center font-sans">
        <p className="text-sm text-[#c7c4d7]">Loading collaborative editor workspace...</p>
      </div>
    );
  }

  if (error && !document) {
    return (
      <div className="flex flex-col h-screen bg-[#0A0A0B] text-[#e5e2e3] p-8 gap-4 font-sans">
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
        <button
          onClick={() => navigate('/documents')}
          className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-bold hover:bg-white/10 transition-all self-start"
        >
          ← Back to Documents
        </button>
      </div>
    );
  }

  const isReadOnly = userRole === 'VIEWER';

  return (
    <div className="flex h-screen bg-[#0A0A0B] text-[#e5e2e3] font-sans overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-[#131314]/80 backdrop-blur-2xl border-b border-white/5 shadow-md shadow-black/20">
        <div className="flex items-center gap-4">
          <span className="text-lg font-bold text-[#c0c1ff] tracking-tight">SyncDocs</span>
          <div className="h-4 w-[1px] bg-white/10 mx-2"></div>
          <span className="text-xs text-[#c7c4d7]/80 truncate max-w-[200px] font-medium">{title || 'Untitled Document'}</span>
        </div>

        <div className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-white/[0.03] rounded-full border border-white/[0.05]">
          <span className="material-symbols-outlined text-[#c0c1ff] text-[16px]">
            {connected ? 'done_all' : connecting ? 'sync' : 'cloud_off'}
          </span>
          <span className="text-[10px] font-semibold text-[#c7c4d7]/70 uppercase tracking-wider">
            {connected ? 'Saved just now' : connecting ? 'Connecting...' : 'Offline'}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Active Collaborators Presences */}
          <div className="flex -space-x-2">
            {activeRoomUsers.map((u, i) => (
              <div
                key={u.userId}
                className="w-8 h-8 rounded-full border-2 border-[#131314] bg-[#571bc1] flex items-center justify-center text-[10px] font-bold text-white uppercase"
                title={`${u.name} (${u.role})`}
                style={{ zIndex: 10 + i }}
              >
                {u.name[0]}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleToggleHistoryDrawer}
              className={`p-2 text-[#c7c4d7] hover:bg-white/10 hover:text-[#e5e2e3] rounded-lg transition-all material-symbols-outlined text-[20px] ${
                showHistoryDrawer ? 'bg-white/10 text-[#c0c1ff]' : ''
              }`}
              title="Version History"
            >
              history
            </button>
            <button
              onClick={() => navigate('/notifications')}
              className="p-2 text-[#c7c4d7] hover:bg-white/10 hover:text-[#e5e2e3] rounded-lg transition-all material-symbols-outlined text-[20px]"
              title="Notifications"
            >
              notifications
            </button>
            <button
              onClick={() => navigate('/settings')}
              className="p-2 text-[#c7c4d7] hover:bg-white/10 hover:text-[#e5e2e3] rounded-lg transition-all material-symbols-outlined text-[20px]"
              title="Workspace Settings"
            >
              settings
            </button>
          </div>

          {userRole === 'OWNER' && (
            <button
              onClick={handleOpenShareModal}
              className="bg-[#c0c1ff] text-[#1000a9] px-4 py-1.5 rounded-lg text-xs font-bold hover:opacity-90 active:scale-95 transition-all ml-2"
            >
              Share
            </button>
          )}
        </div>
      </header>

      {/* Side Navigation (Collapsed State) */}
      <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] z-40 flex flex-col py-6 w-[72px] bg-[#201f20] border-r border-white/5">
        <div className="flex flex-col items-center gap-2 flex-1">
          <button
            onClick={() => navigate('/documents')}
            className="flex items-center justify-center w-12 h-12 bg-white/10 text-[#c0c1ff] border-l-2 border-[#c0c1ff] transition-all"
            title="Documents"
          >
            <span className="material-symbols-outlined">folder</span>
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center justify-center w-12 h-12 text-[#c7c4d7] transition-all hover:bg-white/5 hover:text-[#e5e2e3]"
            title="Dashboard"
          >
            <span className="material-symbols-outlined">dashboard</span>
          </button>
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center justify-center w-12 h-12 text-[#c7c4d7] transition-all hover:bg-white/5 hover:text-[#e5e2e3]"
            title="Profile"
          >
            <span className="material-symbols-outlined">person</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace Canvas */}
      <main className="flex-1 mt-16 ml-[72px] mr-[320px] flex flex-col relative bg-[#0e0e0f] overflow-hidden">
        {/* Save Status & Notices */}
        {remoteNotice && (
          <div className="absolute top-4 left-6 right-6 z-40 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">sync</span>
            {remoteNotice}
          </div>
        )}

        {error && (
          <div className="absolute top-4 left-6 right-6 z-40 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl">
            {error}
          </div>
        )}

        {/* Floating Editor Rich-text Helper Toolbar */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-6 py-2 bg-[#131314]/70 backdrop-blur-md rounded-full border border-white/5 shadow-2xl">
          <button className="p-2 rounded-lg hover:bg-white/10 text-[#e5e2e3]/80 hover:text-[#e5e2e3] transition-all material-symbols-outlined text-[20px]">
            format_bold
          </button>
          <button className="p-2 rounded-lg hover:bg-white/10 text-[#e5e2e3]/80 hover:text-[#e5e2e3] transition-all material-symbols-outlined text-[20px]">
            format_italic
          </button>
          <button className="p-2 rounded-lg hover:bg-white/10 text-[#e5e2e3]/80 hover:text-[#e5e2e3] transition-all material-symbols-outlined text-[20px]">
            link
          </button>
          <div className="w-[1px] h-4 bg-white/10 mx-1"></div>
          <button className="p-2 rounded-lg hover:bg-white/10 text-[#e5e2e3]/80 hover:text-[#e5e2e3] transition-all material-symbols-outlined text-[20px]">
            format_list_bulleted
          </button>
          <button className="p-2 rounded-lg hover:bg-white/10 text-[#e5e2e3]/80 hover:text-[#e5e2e3] transition-all material-symbols-outlined text-[20px]">
            code
          </button>
          <div className="w-[1px] h-4 bg-white/10 mx-1"></div>
          <span className="px-3 py-1 text-xs text-[#c7c4d7] font-semibold">Normal text</span>
        </div>

        {/* Document Text Editor Area */}
        <div className="flex-1 overflow-y-auto pt-28 pb-20 px-[5%]">
          <article className="max-w-[840px] mx-auto bg-white/[0.03] border border-white/[0.02] rounded-xl p-8 shadow-2xl flex flex-col min-h-[500px]">
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="Project Odyssey: Technical Specification"
              disabled={isReadOnly}
              className="bg-transparent border-none outline-none font-bold text-3xl text-[#e5e2e3] placeholder:text-[#c7c4d7]/40 w-full mb-6"
            />
            <textarea
              value={content}
              onChange={handleContentChange}
              placeholder={isReadOnly ? 'Read-only document content.' : 'Start typing your document content here...'}
              disabled={isReadOnly}
              className="bg-transparent border-none outline-none text-[#c7c4d7] placeholder:text-[#c7c4d7]/20 w-full flex-1 resize-none leading-relaxed text-sm"
            />
          </article>
        </div>

        {/* Document Status Footer */}
        <footer className="h-10 bg-[#131314] px-6 border-t border-white/5 flex items-center justify-between z-30">
          <div className="flex items-center gap-6">
            <span className="text-[10px] font-bold text-[#c7c4d7]/60 uppercase tracking-wider">
              {content.trim() ? `${content.trim().split(/\s+/).length} words` : '0 words'}
            </span>
            <span className="text-[10px] font-bold text-[#c7c4d7]/60 uppercase tracking-wider">
              Reading time: {Math.max(1, Math.round(content.trim().split(/\s+/).length / 200))} min
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
              <span className="text-[10px] font-bold text-[#c7c4d7]/80 uppercase tracking-wider">Latency: 12ms</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-[#c0c1ff]">cloud_done</span>
              <span className="text-[10px] font-bold text-[#e5e2e3] uppercase tracking-wider">Autosave: On</span>
            </div>
          </div>
        </footer>
      </main>

      {/* Right Side Comments & Discussions Panel */}
      <aside className="fixed right-0 top-16 h-[calc(100vh-64px)] w-[320px] bg-[#201f20] border-l border-white/5 flex flex-col z-40">
        <div className="flex px-4 border-b border-white/5">
          <button
            onClick={() => setActiveRightTab('comments')}
            className={`flex-1 py-4 text-xs font-bold text-center transition-all ${
              activeRightTab === 'comments' ? 'text-[#c0c1ff] border-b-2 border-[#c0c1ff]' : 'text-[#c7c4d7]/70 hover:text-[#e5e2e3]'
            }`}
          >
            Comments
          </button>
          <button
            onClick={() => setActiveRightTab('activity')}
            className={`flex-1 py-4 text-xs font-bold text-center transition-all ${
              activeRightTab === 'activity' ? 'text-[#c0c1ff] border-b-2 border-[#c0c1ff]' : 'text-[#c7c4d7]/70 hover:text-[#e5e2e3]'
            }`}
          >
            Activity
          </button>
          <button
            onClick={() => setActiveRightTab('outline')}
            className={`flex-1 py-4 text-xs font-bold text-center transition-all ${
              activeRightTab === 'outline' ? 'text-[#c0c1ff] border-b-2 border-[#c0c1ff]' : 'text-[#c7c4d7]/70 hover:text-[#e5e2e3]'
            }`}
          >
            Outline
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar">
          {activeRightTab === 'comments' && (
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <span className="material-symbols-outlined text-[32px] text-[#c7c4d7]/30 mb-2">forum</span>
                <p className="text-xs text-[#c7c4d7]/70">No comments yet</p>
                <p className="text-[10px] text-[#c7c4d7]/40 mt-1">Start a discussion by clicking the button below.</p>
              </div>
            </div>
          )}

          {activeRightTab === 'activity' && (
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold text-[#c7c4d7]/50 uppercase tracking-[0.2em]">Live Session Log</h4>
              <div className="text-xs text-[#c7c4d7] italic">No remote workspace modifications registered yet.</div>
            </div>
          )}

          {activeRightTab === 'outline' && (
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold text-[#c7c4d7]/50 uppercase tracking-[0.2em]">Document Outline</h4>
              <div className="space-y-2">
                <div className="text-xs text-semibold text-[#c0c1ff] truncate">{title || 'Untitled Document'}</div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-white/5 bg-[#2a2a2b]">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold transition-all border border-white/5">
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>New Comment</span>
          </button>
        </div>
      </aside>

      {/* History Drawer Overlay */}
      {showHistoryDrawer && (
        <div className="fixed right-[320px] top-16 h-[calc(100vh-64px)] w-[360px] bg-[#1c1b1c] border-l border-white/5 flex flex-col z-40 p-4 shadow-2xl overflow-y-auto">
          <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-4">
            <h3 className="text-sm font-bold text-[#e5e2e3] flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">history</span> Edit Audit Log
            </h3>
            <button
              onClick={handleToggleHistoryDrawer}
              className="px-2.5 py-1 bg-white/5 rounded-lg text-[10px] font-bold text-[#e5e2e3] hover:bg-white/10"
            >
              Close
            </button>
          </div>

          {historyError && (
            <div className="p-3 mb-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
              {historyError}
            </div>
          )}

          {historyLoading && historyEvents.length === 0 ? (
            <p className="text-xs text-[#c7c4d7] text-center py-8">Loading edit audit logs...</p>
          ) : historyEvents.length === 0 ? (
            <p className="text-xs text-[#c7c4d7] text-center py-8">No edit history logged yet.</p>
          ) : (
            <div className="space-y-4">
              {historyEvents.map((evt) => (
                <div key={evt.id} className="p-3 bg-white/5 border border-white/5 rounded-xl space-y-2">
                  <div className="flex justify-between items-start">
                    <strong className="text-xs text-[#c0c1ff]">{evt.userName}</strong>
                    <span className="text-[10px] text-[#c7c4d7]/60">{formatTimeAgo(evt.createdAt)}</span>
                  </div>
                  <div className="text-xs text-[#e5e2e3]">
                    <strong>Title:</strong> {evt.title}
                  </div>
                </div>
              ))}

              {hasMoreHistory && (
                <button
                  onClick={handleLoadMoreHistory}
                  className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs text-[#c7c4d7]"
                  disabled={historyLoading}
                >
                  {historyLoading ? 'Loading...' : 'Load More'}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Share / Access Modal Component */}
      {showShareModal && userRole === 'OWNER' && (
        <ShareModal documentId={id!} documentTitle={title} onClose={handleOpenShareModal} />
      )}
    </div>
  );
};

export default DocumentEditorPage;
