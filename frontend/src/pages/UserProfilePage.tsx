import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export const UserProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('Profile changes saved successfully.');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleDiscard = () => {
    setName(user?.name || '');
    setSaveStatus(null);
  };

  return (
    <div className="flex h-screen bg-[#0a0a0b] text-[#e5e2e3] font-sans overflow-hidden">
      {/* SideNavBar Shell */}
      <aside className="fixed left-0 top-0 h-screen w-64 z-40 bg-[#131314] border-r border-white/5 flex flex-col p-4 gap-2">
        <div className="flex items-center gap-3 mb-6 px-2 pt-2">
          <div className="h-10 w-10 bg-[#c0c1ff]/10 rounded-xl flex items-center justify-center border border-[#c0c1ff]/20">
            <span className="material-symbols-outlined text-[#c0c1ff]">sync_alt</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#e5e2e3]">SyncDocs</h3>
            <p className="text-[10px] uppercase tracking-widest text-[#c7c4d7]">Enterprise Pro</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-[#c7c4d7] hover:text-[#e5e2e3] hover:bg-white/5 rounded-lg transition-all text-sm font-medium text-left"
          >
            <span className="material-symbols-outlined text-[20px]">dashboard</span>
            Dashboard
          </button>
          <button
            onClick={() => navigate('/documents')}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-[#c7c4d7] hover:text-[#e5e2e3] hover:bg-white/5 rounded-lg transition-all text-sm font-medium text-left"
          >
            <span className="material-symbols-outlined text-[20px]">description</span>
            Documents
          </button>
          <button
            onClick={() => navigate('/profile')}
            className="w-full flex items-center gap-3 px-4 py-2.5 bg-[#571bc1] text-[#c4abff] rounded-lg border-l-2 border-[#c0c1ff] text-sm font-medium text-left"
          >
            <span className="material-symbols-outlined text-[20px]">person</span>
            Profile
          </button>
          <button
            onClick={() => navigate('/settings')}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-[#c7c4d7] hover:text-[#e5e2e3] hover:bg-white/5 rounded-lg transition-all text-sm font-medium text-left"
          >
            <span className="material-symbols-outlined text-[20px]">settings</span>
            Settings
          </button>
        </nav>
        <button
          onClick={logout}
          className="mt-auto bg-white/5 hover:bg-white/10 text-[#e5e2e3] px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">logout</span>
          Logout
        </button>
      </aside>

      {/* Main Content Canvas */}
      <main className="ml-64 w-full h-screen overflow-y-auto bg-[#0a0a0b] flex flex-col">
        {/* Page Header */}
        <header className="sticky top-0 z-30 px-8 py-5 bg-[#0a0a0b]/80 backdrop-blur-md flex justify-between items-center border-b border-white/5">
          <div>
            <h1 className="text-2xl font-bold text-[#e5e2e3]">My Profile</h1>
            <p className="text-[#c7c4d7] text-xs mt-1">Manage your personal account details and preferences.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleDiscard}
              className="px-4 py-2 rounded-lg border border-white/10 text-[#e5e2e3] hover:bg-white/5 transition-all text-xs font-semibold"
            >
              Discard Changes
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-lg bg-[#c0c1ff] text-[#1000a9] hover:bg-[#d0bcff] transition-all text-xs font-bold shadow-lg shadow-[#c0c1ff]/20"
            >
              Save Changes
            </button>
          </div>
        </header>

        {saveStatus && (
          <div className="mx-8 mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl">
            ✓ {saveStatus}
          </div>
        )}

        <div className="max-w-5xl mx-auto p-8 space-y-8 w-full">
          {/* PROFILE OVERVIEW */}
          <section className="bg-[#131314] border border-white/5 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
            <div className="w-24 h-24 rounded-2xl bg-[#6366f1] text-white text-3xl font-bold flex items-center justify-center border-2 border-[#c0c1ff]/20 shadow-xl">
              {name ? name[0].toUpperCase() : 'U'}
            </div>
            <div className="flex-1 text-center md:text-left space-y-2">
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <h2 className="text-2xl font-bold text-[#e5e2e3]">{name || 'SyncDocs User'}</h2>
                <span className="px-2 py-0.5 bg-[#c0c1ff]/10 text-[#c0c1ff] text-[10px] font-bold rounded uppercase tracking-widest self-center md:self-auto">
                  Active
                </span>
              </div>
              <p className="text-sm text-[#c7c4d7]">Workspace Member</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-8 mt-4">
                <div className="flex flex-col">
                  <span className="text-[#c7c4d7] text-[10px] uppercase font-semibold tracking-wider">Email Address</span>
                  <span className="text-[#e5e2e3] text-xs font-medium">{email}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[#c7c4d7] text-[10px] uppercase font-semibold tracking-wider">Account Role</span>
                  <span className="text-[#c0c1ff] text-xs font-bold uppercase">MEMBER</span>
                </div>
              </div>
            </div>
          </section>

          {/* EDIT FORM */}
          <form onSubmit={handleSave} className="bg-[#131314] border border-white/5 rounded-2xl p-8 space-y-6">
            <h3 className="text-lg font-bold text-[#e5e2e3]">Personal Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs text-[#c7c4d7] font-semibold uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#1c1b1c] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#e5e2e3] outline-none focus:border-[#c0c1ff]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-[#c7c4d7] font-semibold uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full bg-[#1c1b1c]/50 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-[#c7c4d7] cursor-not-allowed outline-none"
                />
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default UserProfilePage;
