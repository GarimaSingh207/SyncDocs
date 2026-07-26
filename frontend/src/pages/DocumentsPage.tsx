import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Document, SharedDocument } from '../types';
import documentService from '../services/documents';
import sharingService from '../services/sharing';
import axios from 'axios';

export const DocumentsPage: React.FC = () => {
  const [myDocuments, setMyDocuments] = useState<Document[]>([]);
  const [sharedDocuments, setSharedDocuments] = useState<SharedDocument[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const navigate = useNavigate();

  const fetchAllDocuments = async () => {
    setLoading(true);
    setError(null);
    try {
      const [owned, shared] = await Promise.all([
        documentService.getDocuments(),
        sharingService.getSharedDocuments(),
      ]);
      setMyDocuments(owned);
      setSharedDocuments(shared);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to fetch documents.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllDocuments();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsCreating(true);
    setError(null);
    try {
      const created = await documentService.createDocument({ title: newTitle.trim() });
      setNewTitle('');
      setMyDocuments((prev) => [created, ...prev]);
      navigate(`/documents/${created.id}`);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to create document.');
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      await documentService.deleteDocument(id);
      setMyDocuments((prev) => prev.filter((doc) => doc.id !== id));
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to delete document.');
      }
    }
  };

  return (
    <div className="page-container">
      <div className="documents-header">
        <h2>Documents Overview</h2>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleCreate} className="create-document-form">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Enter new document title..."
          disabled={isCreating}
          required
        />
        <button type="submit" className="btn btn-primary" disabled={isCreating || !newTitle.trim()}>
          {isCreating ? 'Creating...' : '+ Create Document'}
        </button>
      </form>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Loading documents...</p>
        </div>
      ) : (
        <>
          {/* Section 1: My Documents */}
          <div className="documents-section" style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ borderBottom: '1px solid #374151', paddingBottom: '0.5rem', color: '#f3f4f6' }}>
              My Documents ({myDocuments.length})
            </h3>
            {myDocuments.length === 0 ? (
              <p className="empty-state">No owned documents found. Create your first document above!</p>
            ) : (
              <div className="documents-list">
                {myDocuments.map((doc) => (
                  <div key={doc.id} className="document-card">
                    <div className="document-info">
                      <h3>{doc.title}</h3>
                      <span className="document-date">
                        Updated: {new Date(doc.updatedAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="document-actions">
                      <span className="role-badge role-owner">Owner</span>
                      <button
                        onClick={() => navigate(`/documents/${doc.id}`)}
                        className="btn btn-secondary"
                      >
                        Open
                      </button>
                      <button
                        onClick={() => handleDelete(doc.id, doc.title)}
                        className="btn btn-danger"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Shared With Me */}
          <div className="documents-section">
            <h3 style={{ borderBottom: '1px solid #374151', paddingBottom: '0.5rem', color: '#f3f4f6' }}>
              Shared With Me ({sharedDocuments.length})
            </h3>
            {sharedDocuments.length === 0 ? (
              <p className="empty-state">No documents shared with you yet.</p>
            ) : (
              <div className="documents-list">
                {sharedDocuments.map((doc) => (
                  <div key={doc.id} className="document-card">
                    <div className="document-info">
                      <h3>{doc.title}</h3>
                      <span className="document-date">
                        Owner: {doc.owner?.name} ({doc.owner?.email}) • Updated: {new Date(doc.updatedAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="document-actions">
                      <span className={`role-badge role-${doc.role.toLowerCase()}`}>{doc.role}</span>
                      <button
                        onClick={() => navigate(`/documents/${doc.id}`)}
                        className="btn btn-secondary"
                      >
                        Open
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DocumentsPage;
