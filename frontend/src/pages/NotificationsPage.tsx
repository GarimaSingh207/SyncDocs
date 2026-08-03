import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface NotificationItem {
  id: string;
  author: string;
  action: string;
  target: string;
  snippet?: string;
  timestamp: string;
  category: 'mention' | 'comment' | 'invitation' | 'document' | 'system';
  unread: boolean;
  timeGroup: 'Today' | 'Yesterday' | 'Older';
}

export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [notifications] = useState<NotificationItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'unread' && !n.unread) return false;
    if (activeFilter === 'mentions' && n.category !== 'mention') return false;
    if (activeFilter === 'comments' && n.category !== 'comment') return false;
    if (activeFilter === 'invitations' && n.category !== 'invitation') return false;
    if (activeFilter === 'documents' && n.category !== 'document') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        n.author.toLowerCase().includes(q) ||
        n.target.toLowerCase().includes(q) ||
        (n.snippet && n.snippet.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const unreadCount = notifications.filter((n) => n.unread).length;
  const mentionsCount = notifications.filter((n) => n.category === 'mention').length;
  const invitesCount = notifications.filter((n) => n.category === 'invitation').length;

  return (
    <div className="flex h-screen bg-[#0a0a0b] text-[#e5e2e3] font-sans overflow-hidden">
      {/* SideNavBar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-[#131314] border-r border-white/5 flex flex-col py-4 gap-2 z-30">
        <div className="px-6 py-4 flex flex-col gap-1">
          <span className="text-xl font-semibold text-[#e5e2e3]">Notifications</span>
          <span className="text-xs text-[#c7c4d7] opacity-70">Workspace Activity</span>
        </div>
        <nav className="flex flex-col gap-1 px-2">
          <button
            onClick={() => setActiveFilter('all')}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-sm text-left transition-all ${
              activeFilter === 'all'
                ? 'bg-[#c0c1ff]/10 text-[#c0c1ff] border-l-2 border-[#c0c1ff]'
                : 'text-[#c7c4d7] hover:bg-white/5 hover:text-[#e5e2e3]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">inbox</span>
            Inbox
          </button>
          <button
            onClick={() => setActiveFilter('unread')}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-sm text-left transition-all ${
              activeFilter === 'unread'
                ? 'bg-[#c0c1ff]/10 text-[#c0c1ff] border-l-2 border-[#c0c1ff]'
                : 'text-[#c7c4d7] hover:bg-white/5 hover:text-[#e5e2e3]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">mark_email_unread</span>
            Unread
          </button>
          <button
            onClick={() => setActiveFilter('mentions')}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-sm text-left transition-all ${
              activeFilter === 'mentions'
                ? 'bg-[#c0c1ff]/10 text-[#c0c1ff] border-l-2 border-[#c0c1ff]'
                : 'text-[#c7c4d7] hover:bg-white/5 hover:text-[#e5e2e3]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">alternate_email</span>
            Mentions
          </button>
          <button
            onClick={() => navigate('/documents')}
            className="flex items-center gap-3 px-4 py-2 text-[#c7c4d7] hover:bg-white/5 hover:text-[#e5e2e3] transition-all rounded-lg text-sm text-left"
          >
            <span className="material-symbols-outlined text-[20px]">description</span>
            Documents
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-3 px-4 py-2 text-[#c7c4d7] hover:bg-white/5 hover:text-[#e5e2e3] transition-all rounded-lg text-sm text-left"
          >
            <span className="material-symbols-outlined text-[20px]">grid_view</span>
            Workspace
          </button>
        </nav>
        <div className="mt-auto px-4 pb-4 border-t border-white/5 pt-4 flex flex-col gap-1">
          <button
            onClick={() => navigate('/settings')}
            className="w-full text-left flex items-center gap-3 px-4 py-2 text-[#c7c4d7] hover:text-[#e5e2e3] transition-colors rounded-lg text-sm"
          >
            <span className="material-symbols-outlined text-[20px]">settings</span>
            Settings
          </button>
          <button
            onClick={() => navigate('/profile')}
            className="w-full text-left flex items-center gap-3 px-4 py-2 text-[#c7c4d7] hover:text-[#e5e2e3] transition-colors rounded-lg text-sm"
          >
            <span className="material-symbols-outlined text-[20px]">person</span>
            Profile
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="ml-64 mr-72 flex-1 overflow-y-auto bg-[#0a0a0b] p-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold text-[#e5e2e3] tracking-tight">Notifications</h1>
            <p className="text-[#c7c4d7] text-sm mt-2">
              Stay updated with document activity, mentions and collaboration events across your entire workspace.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/settings')}
              className="px-4 py-2 text-sm font-medium text-[#1000a9] bg-[#c0c1ff] rounded-lg shadow-lg hover:bg-[#d0bcff] transition-all"
            >
              Notification Settings
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-4 mb-8 bg-[#1c1b1c] p-1.5 rounded-xl border border-white/5">
          <div className="flex flex-1 gap-1 overflow-x-auto">
            {['all', 'unread', 'mentions', 'comments', 'invitations', 'documents'].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-1.5 text-xs rounded-lg font-medium capitalize transition-all ${
                  activeFilter === f
                    ? 'bg-[#353436] text-[#c0c1ff] font-semibold'
                    : 'text-[#c7c4d7] hover:bg-white/5'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="relative w-64 pr-2">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#c7c4d7] text-[18px]">
              search
            </span>
            <input
              className="w-full bg-[#353436] border-none rounded-lg pl-10 pr-3 py-1.5 text-xs focus:ring-1 focus:ring-[#c0c1ff]/50 text-[#e5e2e3] placeholder:text-[#c7c4d7]/40 outline-none"
              placeholder="Search notifications..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Notification Feed & Empty State */}
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 rounded-2xl bg-[#131314]/70 border border-white/5 text-center mt-6">
            <div className="w-14 h-14 rounded-2xl bg-[#c0c1ff]/10 text-[#c0c1ff] flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-3xl">notifications_off</span>
            </div>
            <h3 className="text-lg font-semibold text-[#e5e2e3]">No notifications yet</h3>
            <p className="text-sm text-[#c7c4d7] max-w-sm mt-1">
              You are all caught up! Document mentions, comments, and workspace invitations will appear here when activity occurs.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Real items map here when received */}
          </div>
        )}
      </main>

      {/* Right Sidebar (Insights) */}
      <aside className="fixed right-0 top-0 h-screen w-72 bg-[#131314]/90 backdrop-blur-md border-l border-white/5 flex flex-col p-6 gap-6 z-30">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold uppercase tracking-widest text-[#908fa0]">Insights</span>
          <span className="text-xs text-[#c7c4d7]">Activity Overview</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#201f20] p-4 rounded-xl border border-white/5">
            <span className="text-xs text-[#c7c4d7]">Unread</span>
            <p className="text-2xl font-bold text-[#c0c1ff] mt-1">{unreadCount}</p>
          </div>
          <div className="bg-[#201f20] p-4 rounded-xl border border-white/5">
            <span className="text-xs text-[#c7c4d7]">Mentions</span>
            <p className="text-2xl font-bold text-[#e5e2e3] mt-1">{mentionsCount}</p>
          </div>
          <div className="bg-[#201f20] p-4 rounded-xl border border-white/5 col-span-2">
            <span className="text-xs text-[#c7c4d7]">Pending Invites</span>
            <p className="text-2xl font-bold text-[#e5e2e3] mt-1">{invitesCount}</p>
          </div>
        </div>
        <div className="flex-1 mt-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#908fa0]">Activity Health</span>
          <div className="h-40 mt-4 rounded-xl border border-white/10 bg-[#1c1b1c] flex items-end justify-between p-4 gap-1.5">
            <div className="w-full bg-[#c0c1ff]/20 rounded-t-sm" style={{ height: '30%' }}></div>
            <div className="w-full bg-[#c0c1ff]/20 rounded-t-sm" style={{ height: '50%' }}></div>
            <div className="w-full bg-[#c0c1ff]/20 rounded-t-sm" style={{ height: '25%' }}></div>
            <div className="w-full bg-[#c0c1ff]/20 rounded-t-sm" style={{ height: '70%' }}></div>
            <div className="w-full bg-[#c0c1ff]/20 rounded-t-sm" style={{ height: '45%' }}></div>
            <div className="w-full bg-[#c0c1ff]/20 rounded-t-sm" style={{ height: '80%' }}></div>
            <div className="w-full bg-[#c0c1ff]/60 rounded-t-sm" style={{ height: '55%' }}></div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default NotificationsPage;
