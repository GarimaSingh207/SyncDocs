import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import type { Document } from '../types';
import documentService from '../services/documents';
import './DashboardPage.css';

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
        setRecentDocs(docs.slice(0, 6));
      } catch (err) {
        console.error('Failed to load dashboard document stats:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (!user) return null;

  const formatDate = () => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString(undefined, options);
  };

  return (
    <div className="dashboard-page-wrapper">
      {/* Header Greeting */}
      <header className="dashboard-header">
        <h1 className="dashboard-title">
          Welcome Back, {user.name} <span>👋</span>
        </h1>
        <p className="dashboard-subtitle">{formatDate()} • Real-time workspace overview</p>
      </header>

      {/* Quick Actions Grid */}
      <section className="quick-actions-grid">
        <div className="quick-action-card" onClick={() => navigate('/documents')}>
          <div className="action-icon-wrapper">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="12" y1="18" x2="12" y2="12" />
              <line x1="9" y1="15" x2="15" y2="15" />
            </svg>
          </div>
          <div>
            <h3 className="action-card-title">Go to Documents</h3>
            <p className="action-card-desc">Manage & Create Files</p>
          </div>
        </div>

        <div className="quick-action-card" onClick={() => navigate('/documents')}>
          <div className="action-icon-wrapper" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', borderColor: 'rgba(59, 130, 246, 0.2)' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <div>
            <h3 className="action-card-title">Recent Activity</h3>
            <p className="action-card-desc">Quick Access</p>
          </div>
        </div>

        <div className="quick-action-card" onClick={() => navigate('/documents')}>
          <div className="action-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', borderColor: 'rgba(16, 185, 129, 0.2)' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div>
            <h3 className="action-card-title">Collaborations</h3>
            <p className="action-card-desc">Shared Workspaces</p>
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="metrics-section">
        <div className="metric-card">
          <div className="metric-card-header">
            <h4 className="metric-card-title">Total Documents</h4>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <p className="metric-value">{loading ? '...' : totalCount}</p>
        </div>

        <div className="metric-card">
          <div className="metric-card-header">
            <h4 className="metric-card-title">Account Holder</h4>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <p className="metric-subtext">{user.name}</p>
          <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>{user.email}</span>
        </div>
      </section>

      {/* Recent Documents Section */}
      <section className="recent-docs-section">
        <div className="section-header">
          <h2 className="section-title">Recent Workspace Documents</h2>
          <button onClick={() => navigate('/documents')} className="view-all-btn">
            View All →
          </button>
        </div>

        {loading ? (
          <p style={{ color: '#9ca3af' }}>Loading recent documents...</p>
        ) : recentDocs.length === 0 ? (
          <div className="empty-dashboard-state">
            <p>No documents found in your workspace yet.</p>
            <button onClick={() => navigate('/documents')} className="view-all-btn">
              Create Your First Document
            </button>
          </div>
        ) : (
          <div className="recent-docs-grid">
            {recentDocs.map((doc) => (
              <div
                key={doc.id}
                className="modern-doc-card"
                onClick={() => navigate(`/documents/${doc.id}`)}
              >
                <div className="doc-card-preview">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                </div>
                <div className="doc-card-body">
                  <h3 className="doc-card-title">{doc.title}</h3>
                  <div className="doc-card-meta">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span>Updated: {new Date(doc.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default DashboardPage;

