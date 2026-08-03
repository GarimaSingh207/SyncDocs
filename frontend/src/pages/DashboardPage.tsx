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
    <div className="dashboard-shell-container">
      {/* Left Sidebar Navigation */}
      <aside className="dash-sidebar-left">
        <button className="dash-new-btn" onClick={() => navigate('/documents')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Document
        </button>

        <div className="dash-nav-section">
          <div className="dash-nav-header">Workspace</div>
          <div className="dash-nav-item active">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
            Dashboard
          </div>
          <div className="dash-nav-item" onClick={() => navigate('/documents')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            Documents
          </div>
          <div className="dash-nav-item" onClick={() => navigate('/notifications')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            Notifications
          </div>
        </div>

        <div className="dash-nav-section">
          <div className="dash-nav-header">Account</div>
          <div className="dash-nav-item" onClick={() => navigate('/settings')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            Workspace Settings
          </div>
          <div className="dash-nav-item" onClick={() => navigate('/profile')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            User Profile
          </div>
        </div>
      </aside>

      {/* Main Canvas */}
      <main className="dash-main-canvas">
        <header className="dash-welcome-header">
          <h1 className="dash-welcome-title">Good Evening, {user.name} 👋</h1>
          <p className="dash-welcome-subtitle">{formatDate()} • Real-time workspace overview</p>
        </header>

        {/* Quick Actions Grid */}
        <section className="dash-actions-grid">
          <div className="dash-glass-card dash-action-card" onClick={() => navigate('/documents')}>
            <div className="dash-action-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#6366f1' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </div>
            <div>
              <h4 className="dash-action-title">New Document</h4>
              <div className="dash-action-desc">Blank Canvas</div>
            </div>
          </div>

          <div className="dash-glass-card dash-action-card" onClick={() => navigate('/documents')}>
            <div className="dash-action-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <div>
              <h4 className="dash-action-title">Join Session</h4>
              <div className="dash-action-desc">Live Collab</div>
            </div>
          </div>

          <div className="dash-glass-card dash-action-card" onClick={() => navigate('/documents')}>
            <div className="dash-action-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <div>
              <h4 className="dash-action-title">Import File</h4>
              <div className="dash-action-desc">Markdown & Docs</div>
            </div>
          </div>
        </section>

        {/* Recent Workspace Documents */}
        <section>
          <div className="dash-section-header">
            <h3 className="dash-section-title">Recent Workspace Documents ({totalCount})</h3>
            <button className="dash-view-all-btn" onClick={() => navigate('/documents')}>
              View All →
            </button>
          </div>


          {loading ? (
            <p style={{ color: 'rgba(199, 196, 215, 0.6)' }}>Loading workspace documents...</p>
          ) : recentDocs.length === 0 ? (
            <div className="dash-glass-card" style={{ padding: '32px', textAlign: 'center' }}>
              <p style={{ color: '#c7c4d7', marginBottom: '16px' }}>No documents created in your workspace yet.</p>
              <button className="dash-new-btn" style={{ width: 'auto', display: 'inline-flex', padding: '0 24px' }} onClick={() => navigate('/documents')}>
                Create Your First Document
              </button>
            </div>
          ) : (
            <div className="dash-docs-grid">
              {recentDocs.map((doc) => (
                <div key={doc.id} className="dash-glass-card dash-doc-card" onClick={() => navigate(`/documents/${doc.id}`)}>
                  <div className="dash-doc-preview">
                    <div className="dash-preview-box">
                      <div style={{ height: '10px', width: '70%', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}></div>
                      <div style={{ height: '8px', width: '45%', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}></div>
                    </div>
                  </div>
                  <div className="dash-doc-body">
                    <h4 className="dash-doc-title">{doc.title}</h4>
                    <div className="dash-doc-meta">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      <span>Edited {new Date(doc.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Right Sidebar Workspace Summary */}
      <aside className="dash-sidebar-right">
        <div className="dash-right-title">Workspace Summary</div>

        <div className="dash-activity-item" style={{ flexDirection: 'column', gap: '16px' }}>
          <div className="dash-glass-card" style={{ padding: '16px', borderRadius: '12px', width: '100%' }}>
            <div style={{ fontSize: '11px', color: 'rgba(199, 196, 215, 0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700', marginBottom: '6px' }}>
              Workspace Owner
            </div>
            <div style={{ fontSize: '15px', fontWeight: '700', color: '#e5e2e3' }}>
              {user.name}
            </div>
            <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>
              {user.email}
            </div>
          </div>

          <div className="dash-glass-card" style={{ padding: '16px', borderRadius: '12px', width: '100%' }}>
            <div style={{ fontSize: '11px', color: 'rgba(199, 196, 215, 0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700', marginBottom: '6px' }}>
              Total Documents
            </div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#c0c1ff' }}>
              {totalCount}
            </div>
          </div>

          <div className="dash-glass-card" style={{ padding: '16px', borderRadius: '12px', width: '100%' }}>
            <div style={{ fontSize: '11px', color: 'rgba(199, 196, 215, 0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700', marginBottom: '6px' }}>
              Sync Engine Status
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#34d399', fontWeight: '600', marginTop: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#34d399', display: 'inline-block' }}></span>
              Operational (WebSocket)
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};


export default DashboardPage;
