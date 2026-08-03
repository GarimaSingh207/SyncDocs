import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Document, SharedDocument } from '../types';
import documentService from '../services/documents';
import sharingService from '../services/sharing';
import useAuth from '../hooks/useAuth';
import axios from 'axios';
import './DocumentsPage.css';

export const DocumentsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [myDocuments, setMyDocuments] = useState<Document[]>([]);
  const [sharedDocuments, setSharedDocuments] = useState<SharedDocument[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState<'my' | 'shared'>('my');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const fetchAllDocuments = async () => {
    setLoading(true);
    setError(null);
    try {
      const [owned, shared] = await Promise.all([
        documentService.getDocuments(),
        sharingService.getSharedDocuments(),
      ]);
      setMyDocuments(owned);
      setSharedDocuments(shared);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to fetch documents.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllDocuments();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsCreating(true);
    setError(null);
    try {
      const created = await documentService.createDocument({ title: newTitle.trim() });
      setNewTitle('');
      setMyDocuments((prev) => [created, ...prev]);
      navigate(`/documents/${created.id}`);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to create document.');
      }
    } finally {
      setIsCreating(false);
    }
  };

  const currentDocs: Document[] = activeTab === 'my' ? myDocuments : sharedDocuments;

  const filteredDocs = currentDocs.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[#131314] text-[#e5e2e3] font-sans overflow-hidden">
      {/* SideNavBar */}
      <aside className="hidden lg:flex flex-col py-6 w-[280px] h-screen sticky left-0 top-0 border-r border-white/5 bg-[#131314] z-30">
        <div className="px-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#8083ff] flex items-center justify-center">
              <span className="material-symbols-outlined text-[#0d0096]">sync</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#e5e2e3] tracking-tight">SyncDocs Pro</h1>
              <p className="text-xs text-[#c7c4d7]">Document Explorer</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-[#c7c4d7] hover:text-[#e5e2e3] hover:bg-white/5 transition-all rounded-xl text-sm font-medium text-left"
          >
            <span className="material-symbols-outlined text-[20px]">dashboard</span>
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('my')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-left transition-all ${
              activeTab === 'my'
                ? 'text-[#c0c1ff] font-bold border-l-2 border-[#c0c1ff] bg-white/5'
                : 'text-[#c7c4d7] hover:text-[#e5e2e3] hover:bg-white/5'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">folder_open</span>
            My Files
          </button>
          <button
            onClick={() => setActiveTab('shared')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-left transition-all ${
              activeTab === 'shared'
                ? 'text-[#c0c1ff] font-bold border-l-2 border-[#c0c1ff] bg-white/5'
                : 'text-[#c7c4d7] hover:text-[#e5e2e3] hover:bg-white/5'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">share</span>
            Shared Files
          </button>
        </nav>

        <div className="px-6 mb-4">
          <form onSubmit={handleCreate} className="space-y-2">
            <input
              type="text"
              placeholder="New document title..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-[#201f20] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#e5e2e3] placeholder:text-[#c7c4d7]/40 outline-none focus:border-[#c0c1ff]"
            />
            <button
              type="submit"
              disabled={isCreating || !newTitle.trim()}
              className="w-full py-2.5 px-4 bg-[#c0c1ff] text-[#1000a9] font-bold text-xs rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              {isCreating ? 'Creating...' : 'New Document'}
            </button>
          </form>
        </div>

        <div className="px-3 border-t border-white/5 pt-4">
          <button
            onClick={() => navigate('/notifications')}
            className="w-full flex items-center gap-3 px-4 py-2 text-[#c7c4d7] hover:text-[#e5e2e3] transition-colors rounded-xl text-sm"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            Notifications
          </button>
          <button
            onClick={() => navigate('/settings')}
            className="w-full flex items-center gap-3 px-4 py-2 text-[#c7c4d7] hover:text-[#e5e2e3] transition-colors rounded-xl text-sm"
          >
            <span className="material-symbols-outlined text-[20px]">settings</span>
            Settings
          </button>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#131314] relative overflow-hidden">
        {/* Top Search Toolbar */}
        <header className="flex justify-between items-center h-16 px-6 bg-[#131314]/70 backdrop-blur-xl border-b border-white/5">
          <div className="relative w-80">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#908fa0] text-lg">
              search
            </span>
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#2a2a2b] border-none rounded-xl pl-10 pr-4 py-2 text-xs text-[#e5e2e3] placeholder:text-[#c7c4d7]/40 outline-none focus:ring-1 focus:ring-[#c0c1ff]"
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-xs font-semibold text-[#e5e2e3]"
            >
              <div className="w-6 h-6 rounded-full bg-[#6366f1] flex items-center justify-center text-[10px] text-white font-bold">
                {user?.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <span>{user?.name || 'User'}</span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Folder Tree Sidebar Panel */}
          <nav className="w-64 border-r border-white/5 p-4 flex-shrink-0 overflow-y-auto hidden md:block">
            <div className="space-y-4">
              <div>
                <p className="text-[#908fa0] text-[11px] font-bold uppercase tracking-wider mb-2 px-2">Folders</p>
                <div className="space-y-1">
                  <button className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg bg-white/5 text-[#e5e2e3] text-xs font-medium">
                    <span className="material-symbols-outlined text-lg text-[#c0c1ff]">folder</span>
                    <span>All Workspace Files</span>
                  </button>
                </div>
              </div>
            </div>
          </nav>

          {/* File Explorer Table/Grid View */}
          <section className="flex-1 overflow-y-auto p-6">
            {error && (
              <div className="p-4 mb-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-[#e5e2e3]">
                  {activeTab === 'my' ? 'My Files' : 'Shared With Me'}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] text-[#908fa0] uppercase font-bold">
                  {filteredDocs.length} items
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'grid' ? 'bg-white/10 text-[#c0c1ff]' : 'text-[#c7c4d7] hover:bg-white/5'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">grid_view</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'list' ? 'bg-white/10 text-[#c0c1ff]' : 'text-[#c7c4d7] hover:bg-white/5'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">list</span>
                </button>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12 text-[#c7c4d7] text-sm">Loading documents...</div>
            ) : filteredDocs.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-16 rounded-2xl bg-[#1c1b1c] border border-white/5 text-center mt-4">
                <div className="w-14 h-14 rounded-2xl bg-[#c0c1ff]/10 text-[#c0c1ff] flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-3xl">folder_off</span>
                </div>
                <h3 className="text-lg font-semibold text-[#e5e2e3]">No documents found</h3>
                <p className="text-sm text-[#c7c4d7] max-w-sm mt-1">
                  {searchQuery
                    ? 'No files matched your search query.'
                    : activeTab === 'my'
                    ? 'Create your first document using the sidebar input to start collaborating.'
                    : 'No documents have been shared with you yet.'}
                </p>
              </div>
            ) : viewMode === 'list' ? (
              <div className="border border-white/5 rounded-xl overflow-hidden">
                <div className="grid grid-cols-[1fr_200px_120px] items-center px-4 py-3 bg-white/5 text-[12px] font-bold text-[#908fa0] uppercase tracking-wider">
                  <div>Name</div>
                  <div>Last Modified</div>
                  <div className="text-right">Action</div>
                </div>
                <div className="divide-y divide-white/5">
                  {filteredDocs.map((doc) => (
                    <div
                      key={doc.id}
                      onClick={() => navigate(`/documents/${doc.id}`)}
                      className="grid grid-cols-[1fr_200px_120px] items-center px-4 py-4 hover:bg-white/[0.03] transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="material-symbols-outlined text-[#8083ff]">description</span>
                        <span className="font-medium text-sm text-[#e5e2e3] truncate">{doc.title}</span>
                      </div>
                      <div className="text-xs text-[#c7c4d7]">
                        {new Date(doc.updatedAt).toLocaleDateString()}
                      </div>
                      <div className="text-right flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/documents/${doc.id}`);
                          }}
                          className="px-3 py-1 bg-white/5 hover:bg-[#c0c1ff]/20 text-[#c0c1ff] text-xs font-semibold rounded-lg transition-all"
                        >
                          Open
                        </button>
                        {activeTab === 'my' && (
                          <button
                            onClick={async (e) => {
                              e.stopPropagation();
                              if (window.confirm(`Are you sure you want to delete "${doc.title}"?`)) {
                                try {
                                  await documentService.deleteDocument(doc.id);
                                  setMyDocuments((prev) => prev.filter((d) => d.id !== doc.id));
                                } catch {
                                  alert('Failed to delete document.');
                                }
                              }
                            }}
                            className="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold rounded-lg transition-all"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredDocs.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => navigate(`/documents/${doc.id}`)}
                    className="p-4 rounded-xl bg-[#201f20] border border-white/5 hover:border-[#c0c1ff]/30 transition-all cursor-pointer flex flex-col justify-between h-36"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-2 text-[#8083ff]">
                        <span className="material-symbols-outlined text-xl">description</span>
                      </div>
                      <h4 className="font-semibold text-sm text-[#e5e2e3] truncate">{doc.title}</h4>
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="text-[11px] text-[#c7c4d7]">
                        {new Date(doc.updatedAt).toLocaleDateString()}
                      </div>
                      {activeTab === 'my' && (
                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            if (window.confirm(`Are you sure you want to delete "${doc.title}"?`)) {
                              try {
                                await documentService.deleteDocument(doc.id);
                                setMyDocuments((prev) => prev.filter((d) => d.id !== doc.id));
                              } catch {
                                alert('Failed to delete document.');
                              }
                            }
                          }}
                          className="px-2 py-0.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[10px] font-semibold rounded transition-all"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default DocumentsPage;
