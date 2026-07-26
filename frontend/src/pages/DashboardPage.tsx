import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import type { Document } from '../types';
import documentService from '../services/documents';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [recentDocs, setRecentDocs] = useState<Document[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const docs = await documentService.getDocuments();
        setTotalCount(docs.length);
        setRecentDocs(docs.slice(0, 5));
      } catch (err) {
        console.error('Failed to load dashboard document stats:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (!user) return null;

  return (
    <div className="page-container">
      <h2>Welcome, {user.name}</h2>
      <p>Your SyncDocs overview and document statistics.</p>

      <div className="dashboard-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
        <div className="stat-card" style={{ backgroundColor: '#111827', padding: '1.5rem', borderRadius: '8px', border: '1px solid #374151' }}>
          <h4 style={{ margin: 0, color: '#9ca3af', fontSize: '0.9rem' }}>Total Documents</h4>
          <p style={{ fontSize: '2rem', fontWeight: 700, margin: '0.5rem 0 0 0', color: '#60a5fa' }}>{loading ? '...' : totalCount}</p>
        </div>
        <div className="stat-card" style={{ backgroundColor: '#111827', padding: '1.5rem', borderRadius: '8px', border: '1px solid #374151' }}>
          <h4 style={{ margin: 0, color: '#9ca3af', fontSize: '0.9rem' }}>Member Email</h4>
          <p style={{ fontSize: '1rem', fontWeight: 500, margin: '0.5rem 0 0 0', color: '#f3f4f6' }}>{user.email}</p>
        </div>
      </div>

      <div className="recent-documents" style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3>Recent Documents</h3>
          <button onClick={() => navigate('/documents')} className="btn btn-secondary">
            View All Documents →
          </button>
        </div>

        {loading ? (
          <p>Loading recent documents...</p>
        ) : recentDocs.length === 0 ? (
          <p className="empty-state">No documents yet. Create your first document to see it here.</p>
        ) : (
          <div className="documents-list">
            {recentDocs.map((doc) => (
              <div key={doc.id} className="document-card" style={{ cursor: 'pointer' }} onClick={() => navigate(`/documents/${doc.id}`)}>
                <div className="document-info">
                  <h4 style={{ margin: 0, color: '#f9fafb' }}>{doc.title}</h4>
                  <span className="document-date">Updated: {new Date(doc.updatedAt).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
