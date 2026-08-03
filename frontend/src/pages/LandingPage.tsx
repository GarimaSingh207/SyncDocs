import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page-container bg-[#131314] text-[#e5e2e3]">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-[#131314]/70 backdrop-blur-xl border-b border-white/10 shadow-xl">
        <div className="max-w-[1440px] mx-auto flex justify-between items-center h-20 px-4 md:px-8">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 bg-[#c0c1ff] rounded flex items-center justify-center">
              <span className="material-symbols-outlined text-[#0d0096]" style={{ fontVariationSettings: "'FILL' 1" }}>
                sync_alt
              </span>
            </div>
            <span className="font-bold text-2xl text-[#e5e2e3] tracking-tight">SyncDocs</span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <a className="text-[#c0c1ff] font-semibold hover:text-[#c0c1ff] transition-colors duration-200 text-base" href="#features">
              Features
            </a>
            <a className="text-[#c7c4d7] hover:text-[#c0c1ff] transition-colors duration-200 text-base" href="#security">
              Security
            </a>
            <a className="text-[#c7c4d7] hover:text-[#c0c1ff] transition-colors duration-200 text-base" href="#pricing">
              Pricing
            </a>
            <a className="text-[#c7c4d7] hover:text-[#c0c1ff] transition-colors duration-200 text-base" href="#about">
              About
            </a>
            <button className="text-[#c7c4d7] hover:text-[#c0c1ff] transition-colors duration-200 text-base bg-transparent border-none cursor-pointer" onClick={() => navigate('/login')}>
              Login
            </button>
          </div>

          <button
            className="bg-[#8083ff] text-[#0d0096] px-6 py-2 rounded-xl font-semibold hover:scale-[0.98] transition-transform duration-200 cursor-pointer"
            onClick={() => navigate('/register')}
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-28">
        {/* Hero Section */}
        <section className="relative max-w-[1440px] mx-auto px-6 md:px-12 mb-36 min-h-[75vh] flex flex-col justify-center">
          <div className="hero-glow -top-40 -left-40"></div>

          <div className="grid lg:grid-cols-[1fr,1.3fr] gap-12 lg:gap-16 items-center">
            <div className="z-10 py-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c0c1ff]/10 border border-[#c0c1ff]/20 text-[#c0c1ff] text-xs font-medium mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c0c1ff] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c0c1ff]"></span>
                </span>
                v2.0 is now live
              </div>

              <h1 className="font-bold text-[46px] lg:text-[60px] text-[#e5e2e3] mb-6 leading-[1.08] tracking-tight">
                Collaborate in <br />
                Real-Time.
                <br />
                <span className="text-[#c0c1ff]">Work Without Limits.</span>
              </h1>

              <p className="text-base lg:text-lg text-[#c7c4d7] mb-8 max-w-lg leading-relaxed">
                Secure collaborative document editing powered by WebSockets, Role-Based Access Control, PostgreSQL, JWT Authentication and intelligent autosaving.
              </p>

              <div className="flex flex-col gap-8">
                <div className="flex flex-wrap gap-4">
                  <button
                    className="bg-[#6366F1] text-white px-10 py-4.5 rounded-xl text-xl font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-2xl shadow-indigo-500/40 ring-2 ring-indigo-400/20 cursor-pointer"
                    onClick={() => navigate('/register')}
                  >
                    Get Started Free
                  </button>
                  <button
                    className="bg-[#353436]/50 backdrop-blur-md border border-white/10 text-[#e5e2e3] px-7 py-4.5 rounded-xl text-lg font-semibold hover:bg-[#353436] transition-all flex items-center gap-2 cursor-pointer"
                    onClick={() => navigate('/login')}
                  >
                    Watch Demo <span className="text-[#c0c1ff]">→</span>
                  </button>
                </div>

                {/* Tech Badges */}
                <div className="flex flex-wrap gap-3.5 items-center">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/5 bg-white/[0.03] text-sm text-[#c7c4d7]">
                    <span className="material-symbols-outlined text-[16px] text-[#c0c1ff]">bolt</span>
                    WebSocket Powered
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/5 bg-white/[0.03] text-sm text-[#c7c4d7]">
                    <span className="material-symbols-outlined text-[16px] text-[#c0c1ff]">verified_user</span>
                    JWT Secured
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/5 bg-white/[0.03] text-sm text-[#c7c4d7]">
                    <span className="material-symbols-outlined text-[16px] text-[#c0c1ff]">database</span>
                    PostgreSQL
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Hero Editor Mockup */}
            <div className="relative lg:h-[680px] flex items-center justify-center mt-12 lg:mt-0">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#c0c1ff]/20 via-[#d0bcff]/10 to-transparent blur-[120px] rounded-full opacity-60"></div>
              <div className="absolute inset-0 mesh-gradient opacity-30 rounded-3xl blur-[80px]"></div>

              {/* Floating Metrics */}
              <div className="absolute -top-10 -left-2 z-30 glass-card px-4 py-2 rounded-full border-[#c0c1ff]/30 flex items-center gap-2.5 animate-bounce shadow-2xl" style={{ animationDuration: '4s' }}>
                <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse"></div>
                <span className="text-xs font-semibold text-[#e5e2e3]">12 collaborators online</span>
              </div>

              <div className="absolute top-20 -right-12 z-30 glass-card px-3.5 py-1.5 rounded-full border-[#c0c1ff]/20 flex items-center gap-2 shadow-2xl">
                <span className="material-symbols-outlined text-[16px] text-green-400">check_circle</span>
                <span className="text-xs text-[#e5e2e3]">Saved just now ✓</span>
              </div>

              <div className="absolute bottom-12 -left-16 z-30 glass-card px-3.5 py-1.5 rounded-full border-[#c0c1ff]/20 flex items-center gap-2 shadow-2xl">
                <span className="material-symbols-outlined text-[15px] text-[#c0c1ff]">wifi</span>
                <span className="text-xs text-[#e5e2e3]">2.3ms Latency</span>
              </div>

              {/* Glassmorphic Editor Mockup */}
              <div className="glass-card w-full lg:scale-[1.15] max-w-xl rounded-xl overflow-hidden shadow-[0_0_120px_rgba(0,0,0,0.7)] border-white/10 z-20 transition-transform duration-700 hover:scale-[1.18]">

                {/* Toolbar */}
                <div className="h-12 border-b border-white/5 bg-white/5 flex items-center justify-between px-4">
                  <div className="flex items-center gap-4">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                    </div>
                    <div className="h-4 w-px bg-white/10 mx-2"></div>
                    <span className="text-sm text-[#c7c4d7] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">description</span>
                      quarterly_report.md
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      <div className="w-7 h-7 rounded-full border-2 border-[#131314] bg-[#c0c1ff]/20 flex items-center justify-center text-[10px] font-bold ring-2 ring-[#c0c1ff]/40">S</div>
                      <div className="w-7 h-7 rounded-full border-2 border-[#131314] bg-[#d0bcff]/20 flex items-center justify-center text-[10px] font-bold ring-2 ring-[#d0bcff]/40">A</div>
                      <div className="relative">
                        <div className="w-7 h-7 rounded-full border-2 border-[#131314] bg-[#c7c6ca]/20 flex items-center justify-center text-[10px] font-bold ring-2 ring-[#c7c6ca]/40">M</div>
                        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-yellow-400 border-2 border-[#131314] rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex h-[440px]">
                  {/* Editor Sidebar */}
                  <div className="w-48 border-r border-white/5 bg-white/[0.02] p-4 hidden md:block">
                    <div className="text-[10px] text-[#c7c4d7] uppercase tracking-wider mb-4 opacity-60">Version History</div>
                    <div className="space-y-3">
                      <div className="p-2 rounded bg-[#c0c1ff]/10 border border-[#c0c1ff]/20">
                        <div className="text-[11px] font-semibold text-[#c0c1ff]">Current Version</div>
                        <div className="text-[9px] text-[#c7c4d7]">Just now by Alex</div>
                      </div>
                      <div className="p-2 opacity-50 border border-transparent">
                        <div className="text-[11px]">V2.4.0</div>
                        <div className="text-[9px]">2h ago by Sarah</div>
                      </div>
                      <div className="p-2 opacity-30 border border-transparent">
                        <div className="text-[11px]">V2.3.9</div>
                        <div className="text-[9px]">Yesterday</div>
                      </div>
                    </div>
                    <div className="mt-auto pt-8">
                      <div className="flex items-center gap-2 text-[10px] text-[#c0c1ff]/80 italic">
                        <span className="flex h-1.5 w-1.5 rounded-full bg-[#c0c1ff] animate-pulse"></span>
                        Sarah is typing...
                      </div>
                    </div>
                  </div>

                  {/* Editor Content */}
                  <div className="flex-1 p-8 relative font-mono text-[#c7c4d7] overflow-hidden">
                    <p className="mb-4 text-[#e5e2e3] text-[15px]"># Q3 Performance Metrics</p>
                    <div className="typing-sim text-[14px]"></div>
                    <span className="cursor-blink"></span>

                    {/* Sarah's Cursor */}
                    <div className="absolute top-32 left-1/2 flex flex-col animate-sarah z-10">
                      <div className="w-[2px] h-6 bg-pink-500"></div>
                      <div className="bg-pink-500 text-white text-[10px] px-2 py-0.5 rounded shadow-lg whitespace-nowrap font-sans font-medium">Sarah</div>
                    </div>

                    {/* Alex's Cursor */}
                    <div className="absolute bottom-24 left-1/4 flex flex-col animate-alex z-10">
                      <div className="w-[2px] h-6 bg-blue-500"></div>
                      <div className="bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded shadow-lg whitespace-nowrap font-sans font-medium">Alex</div>
                    </div>

                    {/* Comment Bubble */}
                    <div className="absolute top-1/2 right-6 glass-card p-4 rounded-xl max-w-[180px] text-[12px] border-[#c0c1ff]/40 shadow-2xl">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-5 h-5 rounded-full bg-[#c7c6ca]/30 border border-[#c7c6ca]/50 flex items-center justify-center text-[8px]">M</div>
                        <div className="font-bold text-[#c0c1ff]">Mark</div>
                      </div>
                      "Should we update the latency metrics here? Looking at sub-50ms targets."
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="max-w-[1440px] mx-auto px-4 md:px-8 mb-32">
          <div className="relative p-1 rounded-[2rem] bg-gradient-to-r from-white/5 via-white/10 to-white/5">
            <div className="glass-card rounded-[1.9rem] grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-white/5 overflow-hidden">
              <div className="p-8 text-center group transition-all duration-300">
                <div className="text-5xl font-bold text-[#c0c1ff] mb-2 group-hover:scale-110 transition-transform">2,000+</div>
                <div className="text-[#c7c4d7] text-xs font-semibold uppercase tracking-widest">Concurrent Users</div>
              </div>
              <div className="p-8 text-center group transition-all duration-300">
                <div className="text-5xl font-bold text-[#c0c1ff] mb-2 group-hover:scale-110 transition-transform">WebSocket</div>
                <div className="text-[#c7c4d7] text-xs font-semibold uppercase tracking-widest">Powered Engine</div>
              </div>
              <div className="p-8 text-center group transition-all duration-300">
                <div className="text-5xl font-bold text-[#c0c1ff] mb-2 group-hover:scale-110 transition-transform">800ms</div>
                <div className="text-[#c7c4d7] text-xs font-semibold uppercase tracking-widest">Optimized Autosave</div>
              </div>
              <div className="p-8 text-center group transition-all duration-300">
                <div className="text-5xl font-bold text-[#c0c1ff] mb-2 group-hover:scale-110 transition-transform">RBAC</div>
                <div className="text-[#c7c4d7] text-xs font-semibold uppercase tracking-widest">Secure Sharing</div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="max-w-[1440px] mx-auto px-4 md:px-8 mb-32" id="features">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-[#e5e2e3] mb-4">Enterprise-grade document infrastructure</h2>
            <p className="text-[#c7c4d7] max-w-2xl mx-auto">Engineered for teams that demand sub-millisecond precision and iron-clad security.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="glass-card p-8 rounded-xl flex flex-col gap-4 border-transparent hover:border-white/10 transition-all">
              <div className="w-12 h-12 rounded-lg bg-[#c0c1ff]/10 flex items-center justify-center text-[#c0c1ff]">
                <span className="material-symbols-outlined text-[32px]">bolt</span>
              </div>
              <h3 className="text-2xl font-semibold text-[#e5e2e3]">Real-time Collaboration</h3>
              <p className="text-[#c7c4d7]">Seamless multi-user editing with sub-50ms latency using high-performance WebSockets.</p>
            </div>
            {/* Card 2 */}
            <div className="glass-card p-8 rounded-xl flex flex-col gap-4 border-transparent hover:border-white/10 transition-all" id="security">
              <div className="w-12 h-12 rounded-lg bg-[#c0c1ff]/10 flex items-center justify-center text-[#c0c1ff]">
                <span className="material-symbols-outlined text-[32px]">lock</span>
              </div>
              <h3 className="text-2xl font-semibold text-[#e5e2e3]">End-to-End Security</h3>
              <p className="text-[#c7c4d7]">Enterprise-grade encryption and JWT-based authentication ensures your data remains yours.</p>
            </div>
            {/* Card 3 */}
            <div className="glass-card p-8 rounded-xl flex flex-col gap-4 border-transparent hover:border-white/10 transition-all">
              <div className="w-12 h-12 rounded-lg bg-[#c0c1ff]/10 flex items-center justify-center text-[#c0c1ff]">
                <span className="material-symbols-outlined text-[32px]">groups</span>
              </div>
              <h3 className="text-2xl font-semibold text-[#e5e2e3]">Team Collaboration</h3>
              <p className="text-[#c7c4d7]">Advanced RBAC and workspace management tools for complex organizational hierarchies.</p>
            </div>
            {/* Card 4 */}
            <div className="glass-card p-8 rounded-xl flex flex-col gap-4 border-transparent hover:border-white/10 transition-all">
              <div className="w-12 h-12 rounded-lg bg-[#c0c1ff]/10 flex items-center justify-center text-[#c0c1ff]">
                <span className="material-symbols-outlined text-[32px]">edit_note</span>
              </div>
              <h3 className="text-2xl font-semibold text-[#e5e2e3]">Rich Text Editing</h3>
              <p className="text-[#c7c4d7]">A powerful markdown-first editing experience designed for developers and content creators.</p>
            </div>
            {/* Card 5 */}
            <div className="glass-card p-8 rounded-xl flex flex-col gap-4 border-transparent hover:border-white/10 transition-all">
              <div className="w-12 h-12 rounded-lg bg-[#c0c1ff]/10 flex items-center justify-center text-[#c0c1ff]">
                <span className="material-symbols-outlined text-[32px]">cloud_sync</span>
              </div>
              <h3 className="text-2xl font-semibold text-[#e5e2e3]">Intelligent Autosave</h3>
              <p className="text-[#c7c4d7]">Never lose a word with persistent background syncing and collision resolution logic.</p>
            </div>
            {/* Card 6 */}
            <div className="glass-card p-8 rounded-xl flex flex-col gap-4 border-transparent hover:border-white/10 transition-all">
              <div className="w-12 h-12 rounded-lg bg-[#c0c1ff]/10 flex items-center justify-center text-[#c0c1ff]">
                <span className="material-symbols-outlined text-[32px]">history</span>
              </div>
              <h3 className="text-2xl font-semibold text-[#e5e2e3]">Version History</h3>
              <p className="text-[#c7c4d7]">Complete audit trails and point-in-time recovery for every document in your workspace.</p>
            </div>
          </div>
        </section>

        {/* Tech Stack Banner */}
        <section className="border-y border-white/5 bg-[#1c1b1c] py-16 mb-32 overflow-hidden">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8">
            <div className="flex flex-col items-center gap-10">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c7c4d7]">Built with industry-leading tech</div>
              <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500 font-mono text-lg font-bold">
                <span>REACT</span>
                <span>NODE.JS</span>
                <span>EXPRESS</span>
                <span>SOCKET.IO</span>
                <span>POSTGRESQL</span>
                <span>DOCKER</span>
                <span>AWS EC2</span>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="max-w-[1440px] mx-auto px-4 md:px-8 mb-32" id="pricing">
          <div className="glass-card rounded-[3rem] p-20 text-center relative overflow-hidden ring-1 ring-white/10">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10"></div>
            <h2 className="text-5xl font-bold text-[#e5e2e3] mb-6 relative z-10">Ready to scale your collaboration?</h2>
            <p className="text-[#c7c4d7] text-lg mb-10 max-w-xl mx-auto relative z-10">Join 10,000+ teams who ship documents faster with SyncDocs. Start for free today.</p>
            <div className="flex justify-center gap-4 relative z-10">
              <button className="bg-[#6366F1] text-white px-12 py-5 rounded-xl font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-indigo-500/30 cursor-pointer" onClick={() => navigate('/register')}>
                Get Started for Free
              </button>
              <button className="border border-white/10 px-12 py-5 rounded-xl font-semibold hover:bg-white/5 transition-colors backdrop-blur-sm cursor-pointer" onClick={() => navigate('/login')}>
                Talk to Sales
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#131314] border-t border-white/5 w-full py-8" id="about">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            <div className="flex flex-col gap-4">
              <div className="font-bold text-[#e5e2e3] mb-2">Product</div>
              <a className="text-sm text-[#c7c4d7] hover:text-[#c0c1ff] transition-colors" href="#features">Features</a>
              <a className="text-sm text-[#c7c4d7] hover:text-[#c0c1ff] transition-colors" href="#security">Security</a>
              <a className="text-sm text-[#c7c4d7] hover:text-[#c0c1ff] transition-colors" href="#pricing">Pricing</a>
            </div>
            <div className="flex flex-col gap-4">
              <div className="font-bold text-[#e5e2e3] mb-2">Resources</div>
              <a className="text-sm text-[#c7c4d7] hover:text-[#c0c1ff] transition-colors" href="#">Documentation</a>
              <a className="text-sm text-[#c7c4d7] hover:text-[#c0c1ff] transition-colors" href="#">API Reference</a>
              <a className="text-sm text-[#c7c4d7] hover:text-[#c0c1ff] transition-colors" href="#">Support</a>
            </div>
            <div className="flex flex-col gap-4">
              <div className="font-bold text-[#e5e2e3] mb-2">Company</div>
              <a className="text-sm text-[#c7c4d7] hover:text-[#c0c1ff] transition-colors" href="#about">About</a>
              <a className="text-sm text-[#c7c4d7] hover:text-[#c0c1ff] transition-colors" href="#">Careers</a>
              <a className="text-sm text-[#c7c4d7] hover:text-[#c0c1ff] transition-colors" href="#">Contact</a>
            </div>
            <div className="flex flex-col gap-4">
              <div className="font-bold text-[#e5e2e3] mb-2">Developers</div>
              <a className="text-sm text-[#c7c4d7] hover:text-[#c0c1ff] transition-colors flex items-center gap-2" href="https://github.com/GarimaSingh207/SyncDocs" target="_blank" rel="noopener noreferrer">
                GitHub <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </a>
              <a className="text-sm text-[#c7c4d7] hover:text-[#c0c1ff] transition-colors" href="#">Status</a>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#c0c1ff] rounded flex items-center justify-center">
                <span className="material-symbols-outlined text-[16px] text-[#0d0096]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  sync_alt
                </span>
              </div>
              <span className="font-bold text-2xl text-[#e5e2e3]">SyncDocs</span>
            </div>
            <div className="text-[#c7c4d7] text-[13px] font-mono text-center md:text-right opacity-70">
              © 2026 SyncDocs. Built with React, Node.js, PostgreSQL, Socket.IO and AWS.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
