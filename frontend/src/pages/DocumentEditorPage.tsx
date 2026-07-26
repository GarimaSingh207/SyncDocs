import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Document, Role, Collaborator } from '../types';
import documentService from '../services/documents';
import sharingService from '../services/sharing';
import axios from 'axios';

export const DocumentEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [document, setDocument] = useState<Document | null>(null);
  const [userRole, setUserRole] = useState<Role>('VIEWER');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Sharing state
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [shareEmail, setShareEmail] = useState('');
  const [shareRole, setShareRole] = useState<Role>('VIEWER');
  const [shareLoading, setShareLoading] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);
  const [shareSuccess, setShareSuccess] = useState<string | null>(null);

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

  const handleSave = async () => {
    if (!id || !title.trim() || userRole === 'VIEWER') return;

    setSaving(true);
    setError(null);
    setSaveSuccess(false);

    try {
      const updated = await documentService.updateDocument(id, {
        title: title.trim(),
        content,
      });
      setDocument(updated);
      setTitle(updated.title);
      setContent(updated.content);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to save document.');
      }
    } finally {
      setSaving(false);
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
          <span className={`role-badge role-${userRole.toLowerCase()}`}>{userRole}</span>

          {userRole === 'OWNER' && (
            <button onClick={handleOpenShareModal} className="btn btn-secondary">
              👥 Share
            </button>
          )}

          {saveSuccess && <span className="save-status">✓ Saved</span>}

          {!isReadOnly && (
            <button
              onClick={handleSave}
              className="btn btn-primary"
              disabled={saving || !title.trim()}
            >
              {saving ? 'Saving...' : 'Save Document'}
            </button>
          )}
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {isReadOnly && (
        <div className="alert" style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)', border: '1px solid #3b82f6', color: '#93c5fd' }}>
          ℹ You have read-only (Viewer) access to this document.
        </div>
      )}

      {/* Share / Collaborators Panel */}
      {showShareModal && userRole === 'OWNER' && (
        <div className="share-panel" style={{ backgroundColor: '#111827', padding: '1.5rem', borderRadius: '8px', border: '1px solid #374151', marginBottom: '1.5rem' }}>
          <h3 style={{ marginTop: 0, color: '#f3f4f6' }}>Manage Collaborators</h3>

          {shareError && <div className="alert alert-error">{shareError}</div>}
          {shareSuccess && <div className="alert" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#6ee7b7' }}>{shareSuccess}</div>}

          <form onSubmit={handleShareUser} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <input
              type="email"
              placeholder="User email address..."
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
              required
              style={{ flex: 1, padding: '0.6rem 0.8rem', backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '6px', color: '#fff' }}
              disabled={shareLoading}
            />
            <select
              value={shareRole}
              onChange={(e) => setShareRole(e.target.value as Role)}
              style={{ padding: '0.6rem 0.8rem', backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '6px', color: '#fff' }}
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
                <div key={c.accessId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1f2937', padding: '0.75rem 1rem', borderRadius: '6px', border: '1px solid #374151' }}>
                  <div>
                    <strong style={{ color: '#f9fafb' }}>{c.name}</strong> <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>({c.email})</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <select
                      value={c.role}
                      onChange={(e) => handleUpdateRole(c.accessId, e.target.value as Role)}
                      style={{ padding: '0.4rem 0.6rem', backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '4px', color: '#fff', fontSize: '0.85rem' }}
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
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Document Title"
          disabled={saving || isReadOnly}
        />
      </div>

      <div className="editor-body">
        <textarea
          className="editor-textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={isReadOnly ? 'Read-only document content.' : 'Start typing your document content here...'}
          disabled={saving || isReadOnly}
        />
      </div>
    </div>
  );
};

export default DocumentEditorPage;
