import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Document } from '../types';
import documentService from '../services/documents';
import axios from 'axios';

export const DocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const navigate = useNavigate();

  const fetchDocuments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await documentService.getDocuments();
      setDocuments(data);
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
    fetchDocuments();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsCreating(true);
    setError(null);
    try {
      const created = await documentService.createDocument({ title: newTitle.trim() });
      setNewTitle('');
      setDocuments((prev) => [created, ...prev]);
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
      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
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
        <h2>My Documents</h2>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleCreate} className="create-document-form">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Enter document title..."
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
      ) : documents.length === 0 ? (
        <div className="empty-state">
          <p>No documents found. Create your first document above!</p>
        </div>
      ) : (
        <div className="documents-list">
          {documents.map((doc) => (
            <div key={doc.id} className="document-card">
              <div className="document-info">
                <h3>{doc.title}</h3>
                <span className="document-date">
                  Updated: {new Date(doc.updatedAt).toLocaleString()}
                </span>
              </div>
              <div className="document-actions">
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
  );
};

export default DocumentsPage;
