import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';
import './WorkspaceSettingsPage.css';

type SettingsTab = 'general' | 'members' | 'storage' | 'security' | 'integrations' | 'danger';

export const WorkspaceSettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');

  // Form State
  const [workspaceName, setWorkspaceName] = useState(user ? `${user.name}'s Workspace` : 'SyncDocs Workspace');
  const [workspaceSlug, setWorkspaceSlug] = useState('syncdocs-workspace');
  const [description, setDescription] = useState('Centralized document collaboration workspace.');
  const [timezone, setTimezone] = useState('UTC');
  const [visibility, setVisibility] = useState<'private' | 'workspace' | 'public'>('private');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);



  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('Workspace settings saved successfully.');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  return (
    <div className="settings-page-wrapper">
      {/* Top Header */}
      <div className="settings-header">
        <div>
          <h1 className="settings-header-title">Workspace Settings</h1>
          <p className="settings-header-subtitle">Manage organization parameters, permissions, storage and security.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="back-btn" onClick={() => { setWorkspaceName('SyncDocs Enterprise'); setSaveStatus(null); }}>
            Reset
          </button>
          <button className="create-doc-btn" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </div>

      {saveStatus && (
        <div className="alert" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#6ee7b7', marginBottom: '1rem' }}>
          ✓ {saveStatus}
        </div>
      )}

      {/* Main Settings Split Layout */}
      <div className="settings-layout">
        {/* Left Side Tab Navigation */}
        <div className="settings-tabs-panel">
          <button
            className={`settings-tab-btn ${activeTab === 'general' ? 'active' : ''}`}
            onClick={() => setActiveTab('general')}
          >
            ⚙ General
          </button>
          <button
            className={`settings-tab-btn ${activeTab === 'members' ? 'active' : ''}`}
            onClick={() => setActiveTab('members')}
          >
            👥 Members & Roles
          </button>
          <button
            className={`settings-tab-btn ${activeTab === 'storage' ? 'active' : ''}`}
            onClick={() => setActiveTab('storage')}
          >
            📊 Storage & Limits
          </button>
          <button
            className={`settings-tab-btn ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            🛡 Security & Auth
          </button>
          <button
            className={`settings-tab-btn ${activeTab === 'integrations' ? 'active' : ''}`}
            onClick={() => setActiveTab('integrations')}
          >
            🧩 Integrations
          </button>
          <button
            className={`settings-tab-btn danger-tab ${activeTab === 'danger' ? 'active' : ''}`}
            onClick={() => setActiveTab('danger')}
          >
            ⚠ Danger Zone
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="settings-content-body">
          {activeTab === 'general' && (
            <form onSubmit={handleSave} className="settings-section-card">
              <div>
                <h3 className="section-title">General Preferences</h3>
                <p className="section-subtitle">Update workspace identity and discoverability settings.</p>
              </div>

              <div className="settings-form-grid">
                <div className="settings-form-group">
                  <label className="settings-label">Workspace Name</label>
                  <input
                    type="text"
                    className="settings-input"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    required
                  />
                </div>

                <div className="settings-form-group">
                  <label className="settings-label">Workspace Slug</label>
                  <input
                    type="text"
                    className="settings-input"
                    value={workspaceSlug}
                    onChange={(e) => setWorkspaceSlug(e.target.value)}
                    required
                  />
                </div>

                <div className="settings-form-group full-width">
                  <label className="settings-label">Description</label>
                  <textarea
                    className="settings-textarea"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="settings-form-group">
                  <label className="settings-label">Timezone</label>
                  <select className="settings-select" value={timezone} onChange={(e) => setTimezone(e.target.value)}>
                    <option value="GMT-08:00">(GMT-08:00) Pacific Time</option>
                    <option value="GMT+00:00">(GMT+00:00) UTC</option>
                    <option value="GMT+05:30">(GMT+05:30) India Standard Time</option>
                  </select>
                </div>

                <div className="settings-form-group">
                  <label className="settings-label">Visibility</label>
                  <select className="settings-select" value={visibility} onChange={(e) => setVisibility(e.target.value as 'private' | 'workspace' | 'public')}>
                    <option value="private">Private (Restricted)</option>
                    <option value="workspace">Workspace Only</option>
                    <option value="public">Public Discoverable</option>
                  </select>
                </div>
              </div>
            </form>
          )}

          {activeTab === 'members' && (
            <div className="settings-section-card">
              <div>
                <h3 className="section-title">Members & Roles</h3>
                <p className="section-subtitle">Manage organization users and active role assignments.</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(31, 41, 55, 0.4)', padding: '0.75rem 1rem', borderRadius: '8px' }}>
                  <div>
                    <strong style={{ color: '#f3f4f6' }}>{user?.name || 'Workspace Owner'}</strong>
                    <span style={{ color: '#9ca3af', fontSize: '0.85rem', marginLeft: '0.5rem' }}>({user?.email || 'owner@syncdocs.io'})</span>
                  </div>
                  <span className="role-badge role-owner">OWNER</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'storage' && (
            <div className="settings-section-card">
              <div>
                <h3 className="section-title">Storage & Quotas</h3>
                <p className="section-subtitle">Monitor workspace storage consumption across documents and assets.</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: '#9ca3af' }}>Used Space: 4.2 GB of 5.0 GB</span>
                  <span style={{ color: '#818cf8', fontWeight: 700 }}>84%</span>
                </div>
                <div className="storage-meter-bg">
                  <div className="storage-meter-fill" style={{ width: '84%' }}></div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="settings-section-card">
              <div>
                <h3 className="section-title">Security & Encryption</h3>
                <p className="section-subtitle">Workspace authentication rules and session encryption verification.</p>
              </div>
              <div style={{ fontSize: '0.9rem', color: '#9ca3af' }}>
                ✓ End-to-End TLS 1.3 Transmission Verified<br />
                ✓ JWT Stateless Session Authentication Enforced
              </div>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className="settings-section-card">
              <div>
                <h3 className="section-title">Connected Integrations</h3>
                <p className="section-subtitle">Manage third-party connections and webhook channels.</p>
              </div>

              <div className="integrations-grid">
                <div className="integration-card">
                  <strong style={{ color: '#f3f4f6' }}>Slack</strong>
                  <span style={{ fontSize: '0.75rem', color: '#34d399' }}>CONNECTED</span>
                </div>
                <div className="integration-card">
                  <strong style={{ color: '#f3f4f6' }}>GitHub</strong>
                  <span style={{ fontSize: '0.75rem', color: '#34d399' }}>CONNECTED</span>
                </div>
                <div className="integration-card">
                  <strong style={{ color: '#f3f4f6' }}>Google Drive</strong>
                  <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>AVAILABLE</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'danger' && (
            <div className="danger-zone-card">
              <div>
                <h3 className="section-title" style={{ color: '#f87171' }}>Danger Zone</h3>
                <p className="section-subtitle">Irreversible actions regarding workspace ownership and data deletion.</p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ color: '#f87171' }}>Delete Workspace</strong>
                  <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: '#9ca3af' }}>Permanently remove workspace and all associated document data.</p>
                </div>
                <button
                  className="action-btn-danger"
                  onClick={() => alert('Workspace deletion requires root admin confirmation.')}
                >
                  Delete Workspace
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkspaceSettingsPage;
