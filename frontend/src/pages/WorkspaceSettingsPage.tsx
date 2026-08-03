import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

type SettingsTab = 'general' | 'members' | 'roles' | 'notifications' | 'storage' | 'security' | 'integrations' | 'appearance' | 'danger';

export const WorkspaceSettingsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<SettingsTab>('general');

  // Form State initialized with real user context
  const [workspaceName, setWorkspaceName] = useState(user ? `${user.name}'s Workspace` : 'SyncDocs Pro');
  const [workspaceUrl, setWorkspaceUrl] = useState('pro');
  const [description, setDescription] = useState('Enterprise document collaboration workspace for high-performance teams.');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('Settings updated successfully.');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleReset = () => {
    setWorkspaceName(user ? `${user.name}'s Workspace` : 'SyncDocs Pro');
    setWorkspaceUrl('pro');
    setDescription('Enterprise document collaboration workspace for high-performance teams.');
    setSaveStatus(null);
  };

  return (
    <div className="flex h-screen bg-[#0a0a0b] text-[#e5e2e3] font-sans overflow-hidden">
      {/* SideNavBar Shell */}
      <aside className="fixed left-0 top-0 h-screen w-[280px] z-40 bg-[#131314] border-r border-white/5 flex flex-col pt-6 pb-6 px-4 hidden md:flex">
        <div className="flex items-center gap-3 px-3 mb-8">
          <div className="w-10 h-10 rounded-lg bg-[#c0c1ff] flex items-center justify-center">
            <span className="material-symbols-outlined text-[#1000a9]">sync</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#e5e2e3]">SyncDocs</h3>
            <p className="text-[10px] text-[#c7c4d7] uppercase tracking-wider">Enterprise Workspace</p>
          </div>
        </div>
        <nav className="flex-1 flex flex-col gap-1">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-3 px-3 py-3 text-[#c7c4d7] hover:bg-white/5 rounded-lg transition-all text-sm text-left"
          >
            <span className="material-symbols-outlined text-[20px]">dashboard</span>
            Dashboard
          </button>
          <button
            onClick={() => navigate('/documents')}
            className="flex items-center gap-3 px-3 py-3 text-[#c7c4d7] hover:bg-white/5 rounded-lg transition-all text-sm text-left"
          >
            <span className="material-symbols-outlined text-[20px]">description</span>
            Documents
          </button>
          <button
            onClick={() => navigate('/settings')}
            className="flex items-center gap-3 px-3 py-3 bg-[#571bc1] text-[#c4abff] border-l-2 border-[#c0c1ff] rounded-lg text-sm text-left font-medium"
          >
            <span className="material-symbols-outlined text-[20px]">settings</span>
            Settings
          </button>
        </nav>
        <div className="mt-auto pt-4 border-t border-white/5 flex flex-col gap-1">
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-3 px-3 py-2 text-[#c7c4d7] hover:bg-white/5 rounded-lg transition-all text-sm text-left"
          >
            <span className="material-symbols-outlined text-[20px]">person</span>
            Profile
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2 text-[#c7c4d7] hover:bg-white/5 rounded-lg transition-all text-sm text-left"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="md:pl-[280px] w-full h-screen flex flex-col overflow-hidden bg-[#0a0a0b]">
        {/* Header */}
        <div className="px-8 py-5 bg-[#131314]/80 backdrop-blur-md z-30 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5">
          <div>
            <h1 className="text-2xl font-bold text-[#e5e2e3]">Workspace Settings</h1>
            <p className="text-[#c7c4d7] text-xs mt-1">Manage your workspace, members, permissions and preferences.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="px-5 py-2.5 bg-[#131314] border border-white/10 rounded-lg text-[#e5e2e3] text-xs font-semibold hover:bg-white/5 transition-all"
            >
              Reset Changes
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 bg-[#c0c1ff] text-[#1000a9] rounded-lg text-xs font-bold shadow-lg shadow-[#c0c1ff]/20 hover:scale-[1.02] transition-all"
            >
              Save Changes
            </button>
          </div>
        </div>

        {saveStatus && (
          <div className="mx-8 mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl">
            ✓ {saveStatus}
          </div>
        )}

        <div className="flex-1 flex overflow-hidden">
          {/* Settings Sub-Sidebar Navigation */}
          <div className="w-64 border-r border-white/5 overflow-y-auto p-4 hidden lg:block bg-[#0e0e0f]">
            <nav className="flex flex-col gap-1">
              {[
                { id: 'general', label: 'General' },
                { id: 'members', label: 'Members' },
                { id: 'roles', label: 'Roles & Permissions' },
                { id: 'notifications', label: 'Notifications' },
                { id: 'storage', label: 'Storage' },
                { id: 'security', label: 'Security' },
                { id: 'integrations', label: 'Integrations' },
                { id: 'appearance', label: 'Appearance' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as SettingsTab)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-left text-xs font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-[#c0c1ff]/10 text-[#c0c1ff] font-bold'
                      : 'text-[#c7c4d7] hover:bg-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
              <div className="my-2 border-t border-white/5"></div>
              <button
                onClick={() => setActiveTab('danger')}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-left text-xs font-medium transition-all ${
                  activeTab === 'danger'
                    ? 'bg-red-500/10 text-red-400 font-bold'
                    : 'text-red-400 hover:bg-red-500/5'
                }`}
              >
                Danger Zone
              </button>
            </nav>
          </div>

          {/* Scrollable Content Pane */}
          <div className="flex-1 overflow-y-auto px-8 py-8 max-w-5xl space-y-8">
            {/* GENERAL SECTION */}
            {activeTab === 'general' && (
              <section className="space-y-6">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#c0c1ff]">info</span>
                  <h2 className="text-xl font-bold text-[#e5e2e3]">General</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#131314] border border-white/5 p-6 rounded-xl">
                  <div className="space-y-2">
                    <label className="text-xs text-[#c7c4d7] font-semibold uppercase tracking-wider">Workspace Name</label>
                    <input
                      type="text"
                      value={workspaceName}
                      onChange={(e) => setWorkspaceName(e.target.value)}
                      className="w-full bg-[#1c1b1c] border border-white/10 rounded-lg px-4 py-2 text-xs text-[#e5e2e3] outline-none focus:border-[#c0c1ff]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-[#c7c4d7] font-semibold uppercase tracking-wider">Workspace URL</label>
                    <div className="flex items-center">
                      <span className="bg-[#353436] border border-r-0 border-white/10 px-4 py-2 rounded-l-lg text-[#c7c4d7] text-xs">syncdocs.io/</span>
                      <input
                        type="text"
                        value={workspaceUrl}
                        onChange={(e) => setWorkspaceUrl(e.target.value)}
                        className="w-full bg-[#1c1b1c] border border-white/10 rounded-r-lg px-4 py-2 text-xs text-[#e5e2e3] outline-none focus:border-[#c0c1ff]"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs text-[#c7c4d7] font-semibold uppercase tracking-wider">Description</label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-[#1c1b1c] border border-white/10 rounded-lg px-4 py-2 text-xs text-[#e5e2e3] outline-none focus:border-[#c0c1ff] resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-[#c7c4d7] font-semibold uppercase tracking-wider">Timezone</label>
                    <select className="w-full bg-[#1c1b1c] border border-white/10 rounded-lg px-4 py-2 text-xs text-[#e5e2e3] outline-none">
                      <option>(GMT-08:00) Pacific Time</option>
                      <option>(UTC+00:00) UTC</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-[#c7c4d7] font-semibold uppercase tracking-wider">Language</label>
                    <select className="w-full bg-[#1c1b1c] border border-white/10 rounded-lg px-4 py-2 text-xs text-[#e5e2e3] outline-none">
                      <option>English (US)</option>
                    </select>
                  </div>
                  <div className="md:col-span-2 flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <h4 className="text-xs font-bold text-[#e5e2e3]">Workspace Visibility</h4>
                      <p className="text-xs text-[#c7c4d7]">Control who can discover this workspace.</p>
                    </div>
                    <div className="flex bg-[#1c1b1c] p-1 rounded-lg border border-white/5">
                      <button className="px-3 py-1 text-xs font-bold bg-[#c0c1ff] text-[#1000a9] rounded-md shadow-sm">Private</button>
                      <button className="px-3 py-1 text-xs text-[#c7c4d7] hover:text-[#e5e2e3]">Workspace</button>
                      <button className="px-3 py-1 text-xs text-[#c7c4d7] hover:text-[#e5e2e3]">Public</button>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* MEMBERS SECTION */}
            {activeTab === 'members' && (
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#c0c1ff]">groups</span>
                    <h2 className="text-xl font-bold text-[#e5e2e3]">Members</h2>
                  </div>
                  <button className="flex items-center gap-1 px-4 py-2 bg-[#353436] border border-white/10 rounded-lg text-[#e5e2e3] text-xs font-bold hover:bg-white/10 transition-all">
                    <span className="material-symbols-outlined text-[16px]">add</span> Invite Member
                  </button>
                </div>
                <div className="overflow-hidden bg-[#131314] border border-white/5 rounded-xl">
                  <table className="w-full text-left">
                    <thead className="bg-[#1c1b1c] border-b border-white/5">
                      <tr>
                        <th className="px-6 py-4 text-xs font-bold text-[#c7c4d7] uppercase tracking-wider">Member</th>
                        <th className="px-6 py-4 text-xs font-bold text-[#c7c4d7] uppercase tracking-wider">Role</th>
                        <th className="px-6 py-4 text-xs font-bold text-[#c7c4d7] uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-xs font-bold text-[#c7c4d7] uppercase tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      <tr className="hover:bg-white/5 transition-all">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-[#571bc1] flex items-center justify-center text-xs text-[#c4abff] font-bold">
                              {user?.name ? user.name[0].toUpperCase() : 'U'}
                            </div>
                            <div>
                              <p className="text-[#e5e2e3] font-bold text-xs">{user?.name || 'User'}</p>
                              <p className="text-[#c7c4d7] text-[11px]">{user?.email || 'user@syncdocs.io'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-0.5 rounded border border-[#c0c1ff]/30 text-[10px] uppercase font-bold text-[#c0c1ff] bg-[#c0c1ff]/5">Owner</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                            <span className="text-[#c7c4d7] text-xs">Online</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="p-2 text-[#c7c4d7] hover:text-[#e5e2e3]"><span className="material-symbols-outlined text-[18px]">more_horiz</span></button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* ROLES & PERMISSIONS SECTION */}
            {activeTab === 'roles' && (
              <section className="space-y-6">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#c0c1ff]">admin_panel_settings</span>
                  <h2 className="text-xl font-bold text-[#e5e2e3]">Roles & Permissions</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {['Owner', 'Editor', 'Viewer'].map((role) => (
                    <div key={role} className="bg-[#131314] border border-white/5 p-6 rounded-xl space-y-3">
                      <h4 className="font-bold text-[#e5e2e3]">{role}</h4>
                      <p className="text-xs text-[#c7c4d7]">
                        {role === 'Owner'
                          ? 'Full administrative control over workspace, billing, and membership.'
                          : role === 'Editor'
                          ? 'Can create, modify, and manage documents across workspace.'
                          : 'Read-only access to published documents and workspace assets.'}
                      </p>
                      <button className="text-xs font-bold text-[#c0c1ff] hover:underline">Edit Permissions</button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* NOTIFICATIONS PREFERENCES SECTION */}
            {activeTab === 'notifications' && (
              <section className="space-y-6">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#c0c1ff]">notifications</span>
                  <h2 className="text-xl font-bold text-[#e5e2e3]">Notification Preferences</h2>
                </div>
                <div className="bg-[#131314] border border-white/5 p-6 rounded-xl space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-white/5">
                    <div>
                      <h4 className="text-xs font-bold text-[#e5e2e3]">Email Notifications</h4>
                      <p className="text-[11px] text-[#c7c4d7]">Receive email updates for mentions and shared docs.</p>
                    </div>
                    <input type="checkbox" defaultChecked className="toggle-checkbox" />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <h4 className="text-xs font-bold text-[#e5e2e3]">Real-Time Desktop Alerts</h4>
                      <p className="text-[11px] text-[#c7c4d7]">Browser notifications during live editing sessions.</p>
                    </div>
                    <input type="checkbox" defaultChecked className="toggle-checkbox" />
                  </div>
                </div>
              </section>
            )}

            {/* STORAGE SECTION */}
            {activeTab === 'storage' && (
              <section className="space-y-6">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#c0c1ff]">analytics</span>
                  <h2 className="text-xl font-bold text-[#e5e2e3]">Storage</h2>
                </div>
                <div className="bg-[#131314]/70 p-6 rounded-xl border border-white/5 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 space-y-4">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[#c7c4d7] text-xs uppercase tracking-wider font-bold">Workspace Storage</p>
                        <h3 className="text-2xl font-bold text-[#e5e2e3]">4.2GB <span className="text-[#c7c4d7] text-sm font-normal">of 5GB used</span></h3>
                      </div>

                      <span className="text-[#c0c1ff] font-mono text-sm">85%</span>
                    </div>
                    <div className="w-full h-3 bg-[#353436] rounded-full overflow-hidden">
                      <div className="h-full bg-[#c0c1ff] shadow-[0_0_15px_rgba(192,193,255,0.4)]" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center bg-[#c0c1ff]/5 rounded-lg p-6 border border-[#c0c1ff]/20">
                    <span className="material-symbols-outlined text-[#c0c1ff] text-[48px] mb-3">rocket_launch</span>
                    <p className="text-center text-xs text-[#c7c4d7] mb-4">Need more space for your team?</p>
                    <button className="w-full py-2.5 bg-[#c0c1ff] text-[#1000a9] rounded-lg text-xs font-bold">Upgrade Now</button>
                  </div>
                </div>
              </section>
            )}

            {/* SECURITY SECTION */}
            {activeTab === 'security' && (
              <section className="space-y-6">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#c0c1ff]">shield</span>
                  <h2 className="text-xl font-bold text-[#e5e2e3]">Security</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-[#131314] border border-white/5 p-6 rounded-xl flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="material-symbols-outlined text-[#c0c1ff]">passkey</span>
                        <span className="bg-emerald-400/10 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-bold">ENABLED</span>
                      </div>
                      <h4 className="font-bold text-[#e5e2e3]">Two-Factor Auth</h4>
                      <p className="text-xs text-[#c7c4d7]">Add an extra layer of security to account logins.</p>
                    </div>
                    <button className="mt-6 text-xs font-bold text-[#c0c1ff] hover:underline text-left">Manage Settings</button>
                  </div>
                  <div className="bg-[#131314] border border-white/5 p-6 rounded-xl flex flex-col justify-between">
                    <div className="space-y-2">
                      <span className="material-symbols-outlined text-[#c7c4d7]">devices</span>
                      <h4 className="font-bold text-[#e5e2e3]">Active Sessions</h4>
                      <p className="text-xs text-[#c7c4d7]">View and manage all active workspace sessions.</p>
                    </div>
                    <button className="mt-6 text-xs font-bold text-[#c0c1ff] hover:underline text-left">View Sessions</button>
                  </div>
                  <div className="bg-[#131314] border border-white/5 p-6 rounded-xl flex flex-col justify-between">
                    <div className="space-y-2">
                      <span className="material-symbols-outlined text-[#c7c4d7]">api</span>
                      <h4 className="font-bold text-[#e5e2e3]">API Tokens</h4>
                      <p className="text-xs text-[#c7c4d7]">Manage secure tokens for third-party integrations.</p>
                    </div>
                    <button className="mt-6 text-xs font-bold text-[#c0c1ff] hover:underline text-left">Generate Token</button>
                  </div>
                </div>
              </section>
            )}

            {/* INTEGRATIONS SECTION */}
            {activeTab === 'integrations' && (
              <section className="space-y-6">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#c0c1ff]">extension</span>
                  <h2 className="text-xl font-bold text-[#e5e2e3]">Integrations</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { name: 'Slack', desc: 'Sync documents to channels.', connected: true, bg: '#4A154B', icon: 'grid_view' },
                    { name: 'GitHub', desc: 'Link pull requests to docs.', connected: true, bg: '#24292F', icon: 'code' },
                    { name: 'Google Drive', desc: 'Import files & collaborate.', connected: false, bg: '#4285F4', icon: 'cloud' },
                    { name: 'Notion', desc: 'Embed docs in Notion pages.', connected: false, bg: '#000000', icon: 'book' },
                  ].map((item) => (
                    <div key={item.name} className="bg-[#201f20] border border-white/5 p-4 rounded-xl flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: item.bg }}>
                            <span className="material-symbols-outlined text-white">{item.icon}</span>
                          </div>
                          <span className={`text-[10px] font-bold ${item.connected ? 'text-emerald-400' : 'text-[#c7c4d7]'}`}>
                            {item.connected ? 'CONNECTED' : 'AVAILABLE'}
                          </span>
                        </div>
                        <h4 className="font-bold text-xs text-[#e5e2e3] mb-1">{item.name}</h4>
                        <p className="text-[11px] text-[#c7c4d7] mb-4">{item.desc}</p>
                      </div>
                      <button className={`w-full py-1.5 rounded text-xs font-bold ${item.connected ? 'bg-[#131314] border border-white/10 text-[#e5e2e3]' : 'bg-[#c0c1ff] text-[#1000a9]'}`}>
                        {item.connected ? 'Settings' : 'Connect'}
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* APPEARANCE SECTION */}
            {activeTab === 'appearance' && (
              <section className="space-y-6">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#c0c1ff]">palette</span>
                  <h2 className="text-xl font-bold text-[#e5e2e3]">Appearance</h2>
                </div>
                <div className="bg-[#131314] border border-white/5 p-6 rounded-xl space-y-4">
                  <h4 className="text-xs font-bold text-[#e5e2e3]">Theme Selection</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-[#0a0a0b] border-2 border-[#c0c1ff] text-center cursor-pointer">
                      <span className="text-xs font-bold text-[#c0c1ff]">Dark Mode (Default)</span>
                    </div>
                    <div className="p-4 rounded-xl bg-[#1c1b1c] border border-white/10 text-center opacity-50 cursor-not-allowed">
                      <span className="text-xs text-[#c7c4d7]">Light Mode</span>
                    </div>
                    <div className="p-4 rounded-xl bg-[#1c1b1c] border border-white/10 text-center opacity-50 cursor-not-allowed">
                      <span className="text-xs text-[#c7c4d7]">System Preferred</span>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* DANGER ZONE SECTION */}
            {activeTab === 'danger' && (
              <section className="space-y-6 pb-12">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-red-400">warning</span>
                  <h2 className="text-xl font-bold text-red-400">Danger Zone</h2>
                </div>
                <div className="border border-red-500/20 bg-red-500/5 p-6 rounded-xl space-y-6">
                  <div className="flex items-center justify-between gap-6">
                    <div>
                      <h4 className="font-bold text-xs text-[#e5e2e3]">Transfer Ownership</h4>
                      <p className="text-[11px] text-[#c7c4d7]">Transfer this workspace and all its data to another member.</p>
                    </div>
                    <button className="px-4 py-2 bg-[#2a2a2b] border border-white/10 rounded-lg text-[#e5e2e3] text-xs font-bold hover:bg-white/10 transition-all">
                      Transfer
                    </button>
                  </div>
                  <div className="h-px bg-red-500/10"></div>
                  <div className="flex items-center justify-between gap-6">
                    <div>
                      <h4 className="font-bold text-xs text-red-400">Delete Workspace</h4>
                      <p className="text-[11px] text-[#c7c4d7]">Permanently remove this workspace and all its data. This action is irreversible.</p>
                    </div>
                    <button className="px-4 py-2 bg-red-500 text-white rounded-lg text-xs font-bold hover:bg-red-600 transition-all">
                      Delete Workspace
                    </button>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default WorkspaceSettingsPage;
