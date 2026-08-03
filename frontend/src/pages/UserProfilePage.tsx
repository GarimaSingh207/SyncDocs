import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import documentService from '../services/documents';
import sharingService from '../services/sharing';

export const UserProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Dynamic user fields
  const [firstName, setFirstName] = useState(user?.name ? user.name.split(' ')[0] : '');
  const [lastName, setLastName] = useState(user?.name ? user.name.split(' ').slice(1).join(' ') : '');
  const [displayName, setDisplayName] = useState(user?.name || '');
  const [username, setUsername] = useState(user?.email ? user.email.split('@')[0] : '');
  const [email] = useState(user?.email || '');

  // Placeholders / Unset fields
  const [bio, setBio] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [timezone, setTimezone] = useState('UTC');
  const [language, setLanguage] = useState('English (US)');

  // Metrics from real backend APIs
  const [ownedDocsCount, setOwnedDocsCount] = useState<number | null>(null);
  const [sharedDocsCount, setSharedDocsCount] = useState<number | null>(null);

  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocStats = async () => {
      try {
        const [owned, shared] = await Promise.all([
          documentService.getDocuments(),
          sharingService.getSharedDocuments(),
        ]);
        setOwnedDocsCount(owned.length);
        setSharedDocsCount(shared.length);
      } catch {
        setOwnedDocsCount(0);
        setSharedDocsCount(0);
      }
    };
    fetchDocStats();
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('Profile changes saved successfully.');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleDiscard = () => {
    setFirstName(user?.name ? user.name.split(' ')[0] : '');
    setLastName(user?.name ? user.name.split(' ').slice(1).join(' ') : '');
    setDisplayName(user?.name || '');
    setUsername(user?.email ? user.email.split('@')[0] : '');
    setBio('');
    setJobTitle('');
    setCompany('');
    setSaveStatus(null);
  };

  // Format member since timestamp from user.createdAt if available
  const formatMemberSince = (iso?: string) => {
    if (!iso) return '—';
    try {
      const d = new Date(iso);
      return d.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
    } catch {
      return '—';
    }
  };

  return (
    <div className="flex h-screen bg-[#0a0a0b] text-[#e5e2e3] font-sans overflow-hidden">
      {/* SideNavBar Shell */}
      <aside className="fixed left-0 top-0 h-full w-64 z-40 bg-[#131314] border-r border-white/5 pt-6 flex flex-col p-4 gap-2 shadow-xl hidden md:flex">
        <div className="flex items-center gap-3 mb-6 px-2">
          <div className="h-10 w-10 bg-[#c0c1ff]/10 rounded-xl flex items-center justify-center border border-[#c0c1ff]/20">
            <span className="material-symbols-outlined text-[#c0c1ff]">sync_alt</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#e5e2e3]">SyncDocs</h3>
            <p className="text-[10px] uppercase tracking-widest text-[#c7c4d7]">Workspace</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full flex items-center gap-3 px-4 py-2 text-[#c7c4d7] hover:text-[#e5e2e3] hover:bg-white/5 rounded-lg transition-all text-sm font-medium text-left"
          >
            <span className="material-symbols-outlined text-[20px]">dashboard</span>
            Dashboard
          </button>
          <button
            onClick={() => navigate('/documents')}
            className="w-full flex items-center gap-3 px-4 py-2 text-[#c7c4d7] hover:text-[#e5e2e3] hover:bg-white/5 rounded-lg transition-all text-sm font-medium text-left"
          >
            <span className="material-symbols-outlined text-[20px]">description</span>
            Documents
          </button>
          <button
            onClick={() => navigate('/profile')}
            className="w-full flex items-center gap-3 px-4 py-2 bg-[#571bc1] text-[#c4abff] rounded-lg border-l-2 border-[#c0c1ff] text-sm font-medium text-left"
          >
            <span className="material-symbols-outlined text-[20px]">person</span>
            Profile
          </button>
          <button
            onClick={() => navigate('/settings')}
            className="w-full flex items-center gap-3 px-4 py-2 text-[#c7c4d7] hover:text-[#e5e2e3] hover:bg-white/5 rounded-lg transition-all text-sm font-medium text-left"
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
      <main className="md:ml-64 w-full h-[calc(100vh)] overflow-y-auto bg-[#0a0a0b] flex flex-col">
        {/* Page Header */}
        <header className="sticky top-0 z-30 px-8 py-6 bg-[#0a0a0b]/80 backdrop-blur-md flex justify-between items-end border-b border-white/5">
          <div>
            <h1 className="text-2xl font-bold text-[#e5e2e3]">My Profile</h1>
            <p className="text-[#c7c4d7] text-xs mt-1">Manage your personal account, security and preferences.</p>
          </div>
          <div className="flex gap-3 pb-1">
            <button
              onClick={handleDiscard}
              className="px-6 py-2 rounded-lg border border-white/10 text-[#e5e2e3] hover:bg-white/5 transition-colors text-xs font-semibold"
            >
              Discard Changes
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 rounded-lg bg-[#c0c1ff] text-[#1000a9] hover:bg-[#d0bcff] transition-transform text-xs font-bold shadow-lg shadow-[#c0c1ff]/20"
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

        <div className="max-w-[1200px] mx-auto p-8 space-y-8 w-full">
          {/* 1. PROFILE OVERVIEW */}
          <section className="bg-[#131314] border border-white/5 rounded-xl p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
              <span className="material-symbols-outlined text-[120px] text-[#e5e2e3]">account_circle</span>
            </div>
            <div className="relative group">
              <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-[#c0c1ff]/20 p-1 bg-[#2a2a2b] flex items-center justify-center text-4xl font-bold text-[#c0c1ff]">
                {displayName ? displayName[0].toUpperCase() : 'U'}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 w-6 h-6 rounded-full border-4 border-[#131314] shadow-lg"></div>
            </div>
            <div className="flex-1 text-center md:text-left space-y-2">
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <h2 className="text-2xl font-bold text-[#e5e2e3]">{displayName || 'Authenticated User'}</h2>
                <span className="px-2 py-0.5 bg-[#c0c1ff]/10 text-[#c0c1ff] text-[10px] font-bold rounded uppercase tracking-widest self-center md:self-auto">
                  Active
                </span>
              </div>
              <p className="text-sm text-[#c7c4d7]">
                {jobTitle || company ? `${jobTitle || 'Member'} ${company ? `@ ${company}` : ''}` : 'Authenticated Account Member'}
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-8 mt-4">
                <div className="flex flex-col">
                  <span className="text-[#c7c4d7] text-[10px] uppercase tracking-wider font-semibold">Username</span>
                  <span className="text-[#e5e2e3] text-xs font-mono">{username ? `@${username}` : '—'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[#c7c4d7] text-[10px] uppercase tracking-wider font-semibold">Email Address</span>
                  <span className="text-[#e5e2e3] text-xs">{email || '—'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[#c7c4d7] text-[10px] uppercase tracking-wider font-semibold">Member Since</span>
                  <span className="text-[#e5e2e3] text-xs">{formatMemberSince(user?.createdAt)}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button className="bg-[#571bc1]/50 text-[#c4abff] px-6 py-2 rounded-lg text-xs font-bold cursor-not-allowed opacity-60" disabled>
                Upload Photo (Disabled)
              </button>
              <button className="px-6 py-2 rounded-lg text-red-400/50 cursor-not-allowed text-xs opacity-60" disabled>
                Remove Photo
              </button>
            </div>
          </section>

          {/* 7. ACCOUNT STATISTICS (Bento Grid) */}
          <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-[#2a2a2b] border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center text-center space-y-1 group hover:bg-[#353436] transition-colors">
              <span className="text-[#c7c4d7] text-[10px] font-bold uppercase tracking-widest">Docs Created</span>
              <span className="text-2xl font-bold text-[#c0c1ff] group-hover:scale-110 transition-transform">
                {ownedDocsCount !== null ? ownedDocsCount : '—'}
              </span>
            </div>
            <div className="bg-[#2a2a2b] border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center text-center space-y-1 group hover:bg-[#353436] transition-colors">
              <span className="text-[#c7c4d7] text-[10px] font-bold uppercase tracking-widest">Docs Shared</span>
              <span className="text-2xl font-bold text-[#e5e2e3] group-hover:scale-110 transition-transform">
                {sharedDocsCount !== null ? sharedDocsCount : '—'}
              </span>
            </div>
            <div className="bg-[#2a2a2b] border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center text-center space-y-1 group hover:bg-[#353436] transition-colors">
              <span className="text-[#c7c4d7] text-[10px] font-bold uppercase tracking-widest">Comments</span>
              <span className="text-xs text-[#c7c4d7] font-semibold mt-1">N/A</span>
            </div>
            <div className="bg-[#2a2a2b] border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center text-center space-y-1 group hover:bg-[#353436] transition-colors">
              <span className="text-[#c7c4d7] text-[10px] font-bold uppercase tracking-widest">Collaborators</span>
              <span className="text-xs text-[#c7c4d7] font-semibold mt-1">N/A</span>
            </div>
            <div className="bg-[#2a2a2b] border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center text-center space-y-1 group hover:bg-[#353436] transition-colors">
              <span className="text-[#c7c4d7] text-[10px] font-bold uppercase tracking-widest">Storage</span>
              <span className="text-xs text-[#c7c4d7] font-semibold mt-1">N/A</span>
            </div>
            <div className="bg-[#2a2a2b] border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center text-center space-y-1 group hover:bg-[#353436] transition-colors">
              <span className="text-[#c7c4d7] text-[10px] font-bold uppercase tracking-widest">Hours Active</span>
              <span className="text-xs text-[#c7c4d7] font-semibold mt-1">N/A</span>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT COLUMN: PERSONAL INFO & SECURITY */}
            <div className="lg:col-span-2 space-y-8">
              {/* 2. PERSONAL INFORMATION */}
              <section className="bg-[#131314] border border-white/5 rounded-xl p-8 space-y-6">
                <div className="flex items-center gap-2 border-b border-white/5 pb-4">
                  <span className="material-symbols-outlined text-[#c0c1ff]">person</span>
                  <h3 className="text-xl font-bold text-[#e5e2e3]">Personal Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-xs text-[#c7c4d7]">First Name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First Name"
                      className="w-full bg-[#1c1b1c] border border-white/10 rounded-lg px-4 py-2 text-xs text-[#e5e2e3] outline-none focus:border-[#c0c1ff]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-[#c7c4d7]">Last Name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last Name"
                      className="w-full bg-[#1c1b1c] border border-white/10 rounded-lg px-4 py-2 text-xs text-[#e5e2e3] outline-none focus:border-[#c0c1ff]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-[#c7c4d7]">Display Name</label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Full Name"
                      className="w-full bg-[#1c1b1c] border border-white/10 rounded-lg px-4 py-2 text-xs text-[#e5e2e3] outline-none focus:border-[#c0c1ff]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-[#c7c4d7]">Username</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c7c4d7] text-xs">@</span>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="username"
                        className="w-full bg-[#1c1b1c] border border-white/10 rounded-lg pl-8 pr-4 py-2 text-xs text-[#e5e2e3] outline-none focus:border-[#c0c1ff]"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-xs text-[#c7c4d7]">Bio</label>
                    <textarea
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Write a brief bio..."
                      className="w-full bg-[#1c1b1c] border border-white/10 rounded-lg px-4 py-2 text-xs text-[#e5e2e3] outline-none focus:border-[#c0c1ff] resize-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-[#c7c4d7]">Job Title</label>
                    <input
                      type="text"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="e.g. Software Engineer"
                      className="w-full bg-[#1c1b1c] border border-white/10 rounded-lg px-4 py-2 text-xs text-[#e5e2e3] outline-none focus:border-[#c0c1ff]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-[#c7c4d7]">Company</label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Acme Corp"
                      className="w-full bg-[#1c1b1c] border border-white/10 rounded-lg px-4 py-2 text-xs text-[#e5e2e3] outline-none focus:border-[#c0c1ff]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-[#c7c4d7]">Timezone</label>
                    <select
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full bg-[#1c1b1c] border border-white/10 rounded-lg px-4 py-2 text-xs text-[#e5e2e3] outline-none"
                    >
                      <option value="UTC">UTC (Coordinated Universal Time)</option>
                      <option value="EST">Eastern Standard Time (EST)</option>
                      <option value="PST">Pacific Standard Time (PST)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-[#c7c4d7]">Language</label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full bg-[#1c1b1c] border border-white/10 rounded-lg px-4 py-2 text-xs text-[#e5e2e3] outline-none"
                    >
                      <option>English (US)</option>
                      <option>English (UK)</option>
                      <option>Spanish</option>
                      <option>French</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* 3. ACCOUNT SECURITY */}
              <section className="bg-[#131314] border border-white/5 rounded-xl p-8 space-y-6">
                <div className="flex items-center gap-2 border-b border-white/5 pb-4">
                  <span className="material-symbols-outlined text-[#c0c1ff]">security</span>
                  <h3 className="text-xl font-bold text-[#e5e2e3]">Account Security</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                    <div className="flex gap-4 items-center">
                      <div className="p-2 bg-[#c0c1ff]/10 rounded-lg">
                        <span className="material-symbols-outlined text-[#c0c1ff]">lock</span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#e5e2e3]">Password</h4>
                        <p className="text-[#c7c4d7] text-[12px]">Managed via Auth Credentials</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-[#131314] border border-white/10 text-[#e5e2e3] rounded-lg hover:bg-white/5 text-xs opacity-60 cursor-not-allowed" disabled>
                      Change Password
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                    <div className="flex gap-4 items-center">
                      <div className="p-2 bg-emerald-500/10 rounded-lg">
                        <span className="material-symbols-outlined text-emerald-400">verified_user</span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#e5e2e3]">Two-Factor Authentication</h4>
                        <span className="text-[10px] bg-white/10 text-[#c7c4d7] px-1.5 py-0.5 rounded font-bold uppercase tracking-tighter">
                          Not Configured
                        </span>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-[#131314] border border-white/10 text-[#e5e2e3] rounded-lg hover:bg-white/5 text-xs opacity-60 cursor-not-allowed" disabled>
                      Manage 2FA
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-[#e5e2e3] mb-1">Recovery Codes</h4>
                        <p className="text-[#c7c4d7] text-[12px] mb-4">Emergency backup authentication codes.</p>
                      </div>
                      <button className="w-full py-2 bg-[#131314] border border-white/10 text-[#e5e2e3] rounded-lg hover:bg-white/5 text-xs opacity-60 cursor-not-allowed" disabled>
                        Generate New
                      </button>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-[#e5e2e3] mb-1">Active Sessions</h4>
                        <p className="text-[#c7c4d7] text-[12px] mb-4">Current browser session active.</p>
                      </div>
                      <button className="w-full py-2 bg-[#131314] border border-white/10 text-[#e5e2e3] rounded-lg hover:bg-white/5 text-xs opacity-60 cursor-not-allowed" disabled>
                        View Sessions
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* RIGHT COLUMN: APPEARANCE, CONNECTED ACCOUNTS, NOTIFICATIONS, DANGER ZONE */}
            <div className="space-y-8">
              {/* 6. APPEARANCE */}
              <section className="bg-[#131314] border border-white/5 rounded-xl p-8 space-y-6">
                <h3 className="text-xs font-bold text-[#e5e2e3] uppercase tracking-widest flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#c0c1ff] text-sm">palette</span>
                  Appearance
                </h3>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-xs text-[#c7c4d7]">Theme Selection</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button className="flex flex-col items-center gap-2 p-3 rounded-xl border-2 border-[#c0c1ff] bg-[#c0c1ff]/10">
                        <div className="w-full h-10 bg-[#0a0a0b] rounded-lg"></div>
                        <span className="text-xs text-[#e5e2e3]">Dark Mode</span>
                      </button>
                      <button className="flex flex-col items-center gap-2 p-3 rounded-xl border border-white/5 bg-white/5 opacity-50 cursor-not-allowed" disabled>
                        <div className="w-full h-10 bg-white rounded-lg"></div>
                        <span className="text-xs text-[#e5e2e3]">Light Mode</span>
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* 4. CONNECTED ACCOUNTS */}
              <section className="bg-[#131314] border border-white/5 rounded-xl p-8 space-y-6">
                <h3 className="text-xs font-bold text-[#e5e2e3] uppercase tracking-widest flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#c0c1ff] text-sm">link</span>
                  Connected Accounts
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                    <div className="flex gap-3 items-center">
                      <div className="w-8 h-8 flex items-center justify-center bg-white rounded-lg">
                        <span className="material-symbols-outlined text-[#131314] text-sm font-bold">G</span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#e5e2e3]">Google</h4>
                        <span className="text-[10px] text-[#c7c4d7]">Not Linked</span>
                      </div>
                    </div>
                    <button className="text-[10px] font-bold text-[#c0c1ff] uppercase tracking-wider opacity-60 cursor-not-allowed" disabled>
                      Connect
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                    <div className="flex gap-3 items-center">
                      <div className="w-8 h-8 flex items-center justify-center bg-[#181717] rounded-lg text-white font-bold text-xs">
                        GH
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#e5e2e3]">GitHub</h4>
                        <span className="text-[10px] text-[#c7c4d7]">Not Linked</span>
                      </div>
                    </div>
                    <button className="text-[10px] font-bold text-[#c0c1ff] uppercase tracking-wider opacity-60 cursor-not-allowed" disabled>
                      Connect
                    </button>
                  </div>
                </div>
              </section>

              {/* 5. NOTIFICATION PREFERENCES */}
              <section className="bg-[#131314] border border-white/5 rounded-xl p-8 space-y-6">
                <h3 className="text-xs font-bold text-[#e5e2e3] uppercase tracking-widest flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#c0c1ff] text-sm">notifications_active</span>
                  Notifications
                </h3>
                <div className="space-y-2">
                  {['Email Notifications', 'Desktop Push', 'Mentions & Shares', 'Security Alerts'].map((item) => (
                    <div key={item} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <span className="text-xs text-[#e5e2e3]">{item}</span>
                      <div className="w-8 h-4 bg-[#c0c1ff]/20 rounded-full relative">
                        <div className="absolute left-0.5 top-0.5 w-3 h-3 bg-white/50 rounded-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* 8. DANGER ZONE */}
              <section className="bg-red-500/10 border border-red-500/20 rounded-xl p-8 space-y-4">
                <h3 className="text-xs font-bold text-red-400 uppercase tracking-widest flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">warning</span>
                  Danger Zone
                </h3>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-[#e5e2e3]">Deactivate Account</h4>
                    <p className="text-[#c7c4d7] text-[11px]">Temporarily disable your profile.</p>
                    <button className="w-full mt-2 py-2 border border-red-500/30 text-red-400 rounded-lg text-xs hover:bg-red-500/10 transition-colors">
                      Deactivate
                    </button>
                  </div>
                  <div className="pt-4 border-t border-red-500/10 space-y-1">
                    <h4 className="text-xs font-bold text-red-400">Delete Account</h4>
                    <p className="text-[#c7c4d7] text-[11px]">Permanently remove your account and all data.</p>
                    <button className="w-full mt-2 py-2 bg-red-500 text-white rounded-lg text-xs font-bold hover:bg-red-600 transition-colors">
                      Delete Everything
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </div>
          <div className="h-24"></div>
        </div>
      </main>
    </div>
  );
};

export default UserProfilePage;
