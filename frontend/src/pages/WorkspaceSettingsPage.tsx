import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

type SettingsTab = 'general' | 'members' | 'roles' | 'notifications' | 'storage' | 'security' | 'integrations' | 'appearance' | 'danger';

export const WorkspaceSettingsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<SettingsTab>('general');

  // Form State initialized with real user context
  const [workspaceName, setWorkspaceName] = useState(user ? `${user.name}'s Workspace` : 'SyncDocs Workspace');
  const [description, setDescription] = useState('Centralized document collaboration & real-time sync engine workspace.');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('Settings updated successfully.');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleReset = () => {
    setWorkspaceName(user ? `${user.name}'s Workspace` : 'SyncDocs Workspace');
    setDescription('Centralized document collaboration & real-time sync engine workspace.');
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
              className="px-5 py-2 bg-[#131314] border border-white/10 rounded-lg text-[#e5e2e3] text-xs font-semibold hover:bg-white/5 transition-all"
            >
              Reset Changes
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-[#c0c1ff] text-[#1000a9] rounded-lg text-xs font-bold shadow-lg shadow-[#c0c1ff]/20 hover:scale-[1.02] transition-all"
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
          <div className="flex-1 overflow-y-auto px-8 py-8 max-w-4xl space-y-8">
            {activeTab === 'general' && (
              <section className="space-y-6">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#c0c1ff]">info</span>
                  <h2 className="text-xl font-bold text-[#e5e2e3]">General Preferences</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#131314] border border-white/5 p-6 rounded-xl">
                  <div className="space-y-2">
                    <label className="text-xs text-[#c7c4d7] font-semibold uppercase tracking-wider">Workspace Name</label>
                    <input
                      type="text"
                      value={workspaceName}
                      onChange={(e) => setWorkspaceName(e.target.value)}
                      className="w-full bg-[#1c1b1c] border border-white/10 rounded-lg px-4 py-2.5 text-xs text-[#e5e2e3] outline-none focus:border-[#c0c1ff]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-[#c7c4d7] font-semibold uppercase tracking-wider">Workspace Owner</label>
                    <input
                      type="text"
                      disabled
                      value={user?.email || 'owner@syncdocs.io'}
                      className="w-full bg-[#1c1b1c]/50 border border-white/5 rounded-lg px-4 py-2.5 text-xs text-[#c7c4d7] cursor-not-allowed outline-none"
                    />
                  </div>
                  <div className="col-span-1 md:col-span-2 space-y-2">
                    <label className="text-xs text-[#c7c4d7] font-semibold uppercase tracking-wider">Description</label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-[#1c1b1c] border border-white/10 rounded-lg px-4 py-2.5 text-xs text-[#e5e2e3] outline-none focus:border-[#c0c1ff] resize-none"
                    />
                  </div>
                </div>
              </section>
            )}

            {activeTab !== 'general' && (
              <div className="p-8 rounded-xl bg-[#131314] border border-white/5 text-center">
                <span className="material-symbols-outlined text-3xl text-[#c0c1ff] mb-2">tune</span>
                <h3 className="text-base font-semibold text-[#e5e2e3]">Section Configured</h3>
                <p className="text-xs text-[#c7c4d7] max-w-sm mx-auto mt-1">
                  This workspace section is active with standard default security and workspace policy controls.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default WorkspaceSettingsPage;
