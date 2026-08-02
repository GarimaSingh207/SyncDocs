import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';
import './UserProfilePage.css';

export const UserProfilePage: React.FC = () => {
  const { user } = useAuth();

  // Profile Form State
  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  const [jobTitle, setJobTitle] = useState('Senior Product Engineer');
  const [company, setCompany] = useState('SyncDocs HQ');
  const [bio, setBio] = useState('Building real-time collaborative document synchronization architecture.');
  const [timezone] = useState('GMT-08:00');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('Profile updated successfully.');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const getInitials = (userName: string) => {
    if (!userName) return 'U';
    return userName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="profile-page-wrapper">
      {/* Top Header */}
      <div className="profile-header">
        <div>
          <h1 className="profile-header-title">My Account Profile</h1>
          <p className="profile-header-subtitle">Manage personal information, security preferences, and active credentials.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="back-btn" onClick={() => setName(user?.name || '')}>
            Discard Changes
          </button>
          <button className="create-doc-btn" onClick={handleSave}>
            Save Profile
          </button>
        </div>
      </div>

      {saveStatus && (
        <div className="alert" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#6ee7b7', marginBottom: '1rem' }}>
          ✓ {saveStatus}
        </div>
      )}

      {/* Profile Overview Card */}
      <div className="profile-banner-card">
        <div className="avatar-large-wrapper">
          <div className="avatar-circle-large">{getInitials(name)}</div>
          <div className="status-online-dot" title="Active Account"></div>
        </div>

        <div className="profile-info-block">
          <h2 className="profile-user-name">{name || 'SyncDocs User'}</h2>
          <p className="profile-user-role">{jobTitle} @ {company}</p>

          <div className="profile-meta-row">
            <div className="profile-meta-item">
              <span className="meta-label">Email Address</span>
              <span className="meta-val">{email || 'user@syncdocs.io'}</span>
            </div>
            <div className="profile-meta-item">
              <span className="meta-label">Role</span>
              <span className="meta-val" style={{ color: '#818cf8' }}>MEMBER</span>
            </div>
            <div className="profile-meta-item">
              <span className="meta-label">Timezone</span>
              <span className="meta-val">{timezone}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Account Statistics Bento Grid */}
      <div className="profile-stats-grid">
        <div className="stat-metric-card">
          <span className="stat-number">12</span>
          <span className="stat-label">Documents</span>
        </div>
        <div className="stat-metric-card">
          <span className="stat-number">48</span>
          <span className="stat-label">Edits Sync'd</span>
        </div>
        <div className="stat-metric-card">
          <span className="stat-number">5</span>
          <span className="stat-label">Collaborators</span>
        </div>
        <div className="stat-metric-card">
          <span className="stat-number" style={{ color: '#34d399' }}>Active</span>
          <span className="stat-label">Socket Status</span>
        </div>
      </div>

      {/* Sections Grid */}
      <div className="profile-sections-grid">
        {/* Left Form Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <form onSubmit={handleSave} className="profile-card-section">
            <h3 className="section-title">Personal Information</h3>

            <div className="form-grid-2col">
              <div className="settings-form-group">
                <label className="settings-label">Full Name</label>
                <input
                  type="text"
                  className="settings-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="settings-form-group">
                <label className="settings-label">Email (Read Only)</label>
                <input
                  type="email"
                  className="settings-input"
                  value={email}
                  disabled
                  style={{ opacity: 0.6, cursor: 'not-allowed' }}
                />
              </div>

              <div className="settings-form-group">
                <label className="settings-label">Job Title</label>
                <input
                  type="text"
                  className="settings-input"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
              </div>

              <div className="settings-form-group">
                <label className="settings-label">Organization</label>
                <input
                  type="text"
                  className="settings-input"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>

              <div className="settings-form-group full-width">
                <label className="settings-label">Bio</label>
                <textarea
                  className="settings-textarea"
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>
            </div>
          </form>

          <div className="profile-card-section">
            <h3 className="section-title">Account Security</h3>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(31, 41, 55, 0.4)', padding: '0.85rem 1rem', borderRadius: '8px' }}>
              <div>
                <strong style={{ color: '#f3f4f6', fontSize: '0.9rem' }}>Password Authentication</strong>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: '#9ca3af' }}>Managed securely via hashed session tokens.</p>
              </div>
              <button className="copy-link-btn" onClick={() => alert('Password changes can be performed via standard auth flow.')}>
                Change Password
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="profile-card-section">
            <h3 className="section-title">Appearance & Mode</h3>

            <div className="settings-form-group">
              <label className="settings-label">Theme Mode</label>
              <select className="settings-select" defaultValue="dark">
                <option value="dark">Dark Theme (Default)</option>
                <option value="system">System Preference</option>
              </select>
            </div>

            <div className="settings-form-group">
              <label className="settings-label">Interface Accent</label>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                <span style={{ width: 24, height: 24, borderRadius: '50%', background: '#6366f1', border: '2px solid #fff' }}></span>
                <span style={{ width: 24, height: 24, borderRadius: '50%', background: '#10b981', opacity: 0.5 }}></span>
                <span style={{ width: 24, height: 24, borderRadius: '50%', background: '#f59e0b', opacity: 0.5 }}></span>
              </div>
            </div>
          </div>

          <div className="danger-zone-card">
            <h3 className="section-title" style={{ color: '#f87171' }}>Account Deactivation</h3>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#9ca3af' }}>Temporarily disable or request permanent removal of user profile data.</p>
            <button className="action-btn-danger" onClick={() => alert('Account deactivation requires email verification.')}>
              Deactivate Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
