import React, { useEffect, useState, useCallback } from 'react';
import type { Collaborator, Role } from '../types';
import sharingService from '../services/sharing';
import axios from 'axios';
import './ShareModal.css';

interface ShareModalProps {
  documentId: string;
  documentTitle: string;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ documentId, documentTitle, onClose }) => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [shareEmail, setShareEmail] = useState('');
  const [shareRole, setShareRole] = useState<Role>('VIEWER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const loadCollaborators = useCallback(async () => {
    try {
      const list = await sharingService.getDocumentAccess(documentId);
      setCollaborators(list);
    } catch (err) {
      console.error('Failed to load collaborators:', err);
    }
  }, [documentId]);

  useEffect(() => {
    loadCollaborators();
  }, [loadCollaborators]);

  const handleShareUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shareEmail.trim()) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const updated = await sharingService.shareDocument(documentId, {
        email: shareEmail.trim(),
        role: shareRole,
      });
      setCollaborators(updated);
      setShareEmail('');
      setSuccess('Access granted successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to share document.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (accessId: string, newRole: Role) => {
    setError(null);
    try {
      const updated = await sharingService.updateAccessRole(documentId, accessId, { role: newRole });
      setCollaborators(updated);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to update collaborator role.');
      }
    }
  };

  const handleRemoveAccess = async (accessId: string, email: string) => {
    if (!window.confirm(`Remove collaborator access for ${email}?`)) return;
    setError(null);
    try {
      await sharingService.removeAccess(documentId, accessId);
      setCollaborators((prev) => prev.filter((c) => c.accessId !== accessId));
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to remove access.');
      }
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="share-modal-overlay" onClick={onClose}>
      <div className="share-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="share-modal-header">
          <div>
            <h2 className="share-modal-title">Share "{documentTitle}"</h2>
            <p className="share-modal-subtitle">Invite team members and manage permissions</p>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="share-modal-body">
          {error && <div className="alert alert-error">{error}</div>}
          {success && (
            <div className="alert" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#6ee7b7' }}>
              {success}
            </div>
          )}

          {/* Invite Form */}
          <form onSubmit={handleShareUser} className="invite-form-group">
            <input
              type="email"
              className="invite-input"
              placeholder="User email address..."
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
              required
              disabled={loading}
            />
            <select
              className="role-select"
              value={shareRole}
              onChange={(e) => setShareRole(e.target.value as Role)}
              disabled={loading}
            >
              <option value="VIEWER">Viewer</option>
              <option value="EDITOR">Editor</option>
            </select>
            <button type="submit" className="invite-btn" disabled={loading || !shareEmail.trim()}>
              {loading ? 'Sharing...' : 'Invite'}
            </button>
          </form>

          {/* Copy Link Section */}
          <div className="copy-link-card">
            <span className="copy-link-text">Share direct document link with team</span>
            <button className="copy-link-btn" onClick={handleCopyLink}>
              {copied ? '✓ Link Copied' : 'Copy Document Link'}
            </button>
          </div>

          {/* Collaborators List */}
          <div className="collaborator-list">
            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Active Collaborators ({collaborators.length})
            </h4>

            {collaborators.length === 0 ? (
              <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>No collaborators invited yet.</p>
            ) : (
              collaborators.map((c) => (
                <div key={c.accessId} className="collaborator-row">
                  <div className="collaborator-info">
                    <span className="collaborator-name">{c.name}</span>
                    <span className="collaborator-email">{c.email}</span>
                  </div>
                  <div className="collaborator-controls">
                    <select
                      className="role-select"
                      style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}
                      value={c.role}
                      onChange={(e) => handleUpdateRole(c.accessId, e.target.value as Role)}
                    >
                      <option value="VIEWER">Viewer</option>
                      <option value="EDITOR">Editor</option>
                    </select>
                    <button
                      className="action-btn-danger"
                      onClick={() => handleRemoveAccess(c.accessId, c.email)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
