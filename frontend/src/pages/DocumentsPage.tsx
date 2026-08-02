import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Document, SharedDocument } from '../types';
import documentService from '../services/documents';
import sharingService from '../services/sharing';
import axios from 'axios';
import './DocumentsPage.css';

export const DocumentsPage: React.FC = () => {
  const [myDocuments, setMyDocuments] = useState<Document[]>([]);
  const [sharedDocuments, setSharedDocuments] = useState<SharedDocument[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState<'my' | 'shared'>('my');
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredMyDocs = myDocuments.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSharedDocs = sharedDocuments.filter(
    (doc) =>
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.owner?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.owner?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="documents-page-wrapper">
      {/* Header & Create Document */}
      <div className="documents-header-section">
        <div className="documents-title-row">
          <h1 className="documents-page-title">
            Documents Explorer
            <span className="doc-count-badge">
              {activeTab === 'my' ? myDocuments.length : sharedDocuments.length} files
            </span>
          </h1>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleCreate} className="create-doc-form-wrapper">
          <input
            type="text"
            className="create-doc-input"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Enter document title to create new file..."
            disabled={isCreating}
            required
          />
          <button type="submit" className="create-doc-btn" disabled={isCreating || !newTitle.trim()}>
            {isCreating ? 'Creating...' : '+ New Document'}
          </button>
        </form>
      </div>

      {/* Controls Bar: Tabs & Search */}
      <div className="documents-controls-bar">
        <div className="doc-tabs-group">
          <button
            className={`doc-tab-button ${activeTab === 'my' ? 'active' : ''}`}
            onClick={() => setActiveTab('my')}
          >
            My Documents ({myDocuments.length})
          </button>
          <button
            className={`doc-tab-button ${activeTab === 'shared' ? 'active' : ''}`}
            onClick={() => setActiveTab('shared')}
          >
            Shared With Me ({sharedDocuments.length})
          </button>
        </div>

        <div className="search-box-wrapper">
          <svg
            className="search-icon"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="doc-search-input"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Document List Content */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
          <p>Loading document workspace...</p>
        </div>
      ) : activeTab === 'my' ? (
        <div className="documents-table-container">
          <div className="documents-table-header">
            <div>Document Name</div>
            <div>Last Updated</div>
            <div>Access Level</div>
            <div style={{ textAlign: 'right' }}>Actions</div>
          </div>

          {filteredMyDocs.length === 0 ? (
            <div style={{ padding: '3rem 1.5rem', textAlign: 'center', color: '#9ca3af' }}>
              <p>No owned documents found.</p>
            </div>
          ) : (
            filteredMyDocs.map((doc) => (
              <div key={doc.id} className="document-table-row">
                <div className="doc-name-cell">
                  <svg className="doc-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  <span
                    className="doc-title-text"
                    onClick={() => navigate(`/documents/${doc.id}`)}
                  >
                    {doc.title}
                  </span>
                </div>
                <div className="doc-meta-text">
                  {new Date(doc.updatedAt).toLocaleString()}
                </div>
                <div>
                  <span className="role-badge role-owner">Owner</span>
                </div>
                <div className="doc-actions-cell">
                  <button
                    onClick={() => navigate(`/documents/${doc.id}`)}
                    className="action-btn-secondary"
                  >
                    Open
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id, doc.title)}
                    className="action-btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="documents-table-container">
          <div className="documents-table-header">
            <div>Document Name</div>
            <div>Owner</div>
            <div>Permission Role</div>
            <div style={{ textAlign: 'right' }}>Actions</div>
          </div>

          {filteredSharedDocs.length === 0 ? (
            <div style={{ padding: '3rem 1.5rem', textAlign: 'center', color: '#9ca3af' }}>
              <p>No shared documents found.</p>
            </div>
          ) : (
            filteredSharedDocs.map((doc) => (
              <div key={doc.id} className="document-table-row">
                <div className="doc-name-cell">
                  <svg className="doc-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  <span
                    className="doc-title-text"
                    onClick={() => navigate(`/documents/${doc.id}`)}
                  >
                    {doc.title}
                  </span>
                </div>
                <div className="doc-meta-text">
                  {doc.owner?.name || doc.owner?.email || 'Unknown'}
                </div>
                <div>
                  <span className={`role-badge role-${doc.role.toLowerCase()}`}>
                    {doc.role}
                  </span>
                </div>
                <div className="doc-actions-cell">
                  <button
                    onClick={() => navigate(`/documents/${doc.id}`)}
                    className="action-btn-secondary"
                  >
                    Open
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentsPage;

