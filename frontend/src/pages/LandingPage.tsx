import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './LandingPage.css';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page-container">
      {/* Top Navigation Bar */}
      <nav className="landing-navbar">
        <div className="landing-nav-inner">
          <div className="landing-brand-logo">
            <div className="landing-logo-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="17 1 21 5 17 9" />
                <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                <polyline points="7 23 3 19 7 15" />
                <path d="M21 13v2a4 4 0 0 1-4 4H3" />
              </svg>
            </div>
            <span>SyncDocs</span>
          </div>

          <div className="landing-nav-links">
            <a href="#features" className="landing-nav-link">Features</a>
            <a href="#security" className="landing-nav-link">Security</a>
            <a href="#pricing" className="landing-nav-link">Pricing</a>
            <a href="#about" className="landing-nav-link">About</a>
            <Link to="/login" className="landing-nav-link">Login</Link>
          </div>

          <button className="landing-nav-btn" onClick={() => navigate('/register')}>
            Get Started
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-32">
        {/* Hero Section */}
        <section className="relative max-w-[1440px] mx-auto px-6 md:px-8 mb-32 min-h-[80vh] flex flex-col justify-center">
          <div className="landing-hero-glow -top-40 -left-40"></div>

          <div className="grid lg:grid-cols-[1fr,1.4fr] gap-8 items-center">
            <div className="z-10 py-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c0c1ff]/10 border border-[#c0c1ff]/20 text-[#c0c1ff] text-xs font-semibold mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c0c1ff] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c0c1ff]"></span>
                </span>
                v2.0 is now live
              </div>

              <h1 className="font-extrabold text-[48px] lg:text-[68px] text-[#e5e2e3] mb-6 leading-[1.05] tracking-tight">
                Collaborate in <br />Real-Time.<br />
                <span className="text-[#c0c1ff]">Work Without Limits.</span>
              </h1>

              <p className="text-lg text-[#c7c4d7] mb-10 max-w-xl leading-relaxed">
                Secure collaborative document editing powered by WebSockets, Role-Based Access Control, PostgreSQL, JWT Authentication, and intelligent autosaving.
              </p>

              <div className="flex flex-col gap-8">
                <div className="flex flex-wrap gap-4">
                  <button className="landing-cta-primary" onClick={() => navigate('/register')}>
                    Get Started Free
                  </button>
                  <button className="landing-cta-secondary" onClick={() => navigate('/login')}>
                    Sign In →
                  </button>
                </div>

                {/* Tech Badges */}
                <div className="flex flex-wrap gap-3 items-center">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/5 bg-white/[0.03] text-sm text-[#c7c4d7]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c0c1ff" strokeWidth="2">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                    WebSocket Powered
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/5 bg-white/[0.03] text-sm text-[#c7c4d7]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c0c1ff" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    JWT Secured
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/5 bg-white/[0.03] text-sm text-[#c7c4d7]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c0c1ff" strokeWidth="2">
                      <ellipse cx="12" cy="5" rx="9" ry="3" />
                      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                    </svg>
                    PostgreSQL
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Mockup Container */}
            <div className="relative lg:h-[700px] flex items-center justify-center mt-8 lg:mt-0">
              <div className="landing-glass-card w-full max-w-2xl rounded-xl overflow-hidden border border-white/10 z-20 p-6">
                {/* Window Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                    </div>
                    <span className="text-xs font-mono text-[#c7c4d7]/70 ml-4">quarterly_report.md</span>
                  </div>
                  <div className="flex -space-x-2">
                    <div className="w-7 h-7 rounded-full bg-[#ec4899] text-white flex items-center justify-center text-xs font-bold border-2 border-[#131314]">S</div>
                    <div className="w-7 h-7 rounded-full bg-[#6366f1] text-white flex items-center justify-center text-xs font-bold border-2 border-[#131314]">A</div>
                  </div>
                </div>

                {/* Simulated Canvas */}
                <div className="relative h-[320px] font-mono text-sm text-[#e5e2e3]/80 p-2 overflow-hidden">
                  <p className="mb-4 text-[#c0c1ff] font-bold text-base"># Q3 Performance Metrics</p>
                  <p className="mb-2 text-[#c7c4d7]">Surpassed 2,000+ active users per workspace...</p>
                  <span className="landing-cursor-blink"></span>

                  {/* Animated Cursors */}
                  <div className="landing-cursor-sarah">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#ec4899" style={{ transform: 'rotate(-45deg)' }}>
                      <path d="M3 3l7 18 3-7 7-3L3 3z" />
                    </svg>
                    <span className="bg-[#ec4899] text-white text-[10px] px-1.5 py-0.5 rounded font-bold">Sarah</span>
                  </div>

                  <div className="landing-cursor-alex">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#3b82f6" style={{ transform: 'rotate(-45deg)' }}>
                      <path d="M3 3l7 18 3-7 7-3L3 3z" />
                    </svg>
                    <span className="bg-[#3b82f6] text-white text-[10px] px-1.5 py-0.5 rounded font-bold">Alex</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="max-w-[1440px] mx-auto px-6 md:px-8 mb-32" id="features">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#e5e2e3] mb-4">Enterprise-grade document infrastructure</h2>
            <p className="text-[#c7c4d7] max-w-2xl mx-auto">Engineered for teams that demand sub-millisecond precision and iron-clad security.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="landing-glass-card p-6 rounded-xl flex flex-col gap-4">
              <div className="w-12 h-12 rounded-lg bg-[#c0c1ff]/10 flex items-center justify-center text-[#c0c1ff]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
              </div>
              <h3 className="text-xl font-bold text-[#e5e2e3]">Real-time Collaboration</h3>
              <p className="text-[#c7c4d7] text-sm leading-relaxed">Seamless multi-user editing with sub-50ms latency using high-performance WebSockets.</p>
            </div>

            <div className="landing-glass-card p-6 rounded-xl flex flex-col gap-4">
              <div className="w-12 h-12 rounded-lg bg-[#c0c1ff]/10 flex items-center justify-center text-[#c0c1ff]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
              </div>
              <h3 className="text-xl font-bold text-[#e5e2e3]">End-to-End Security</h3>
              <p className="text-[#c7c4d7] text-sm leading-relaxed">Enterprise-grade encryption and JWT-based authentication ensures your data remains yours.</p>
            </div>

            <div className="landing-glass-card p-6 rounded-xl flex flex-col gap-4">
              <div className="w-12 h-12 rounded-lg bg-[#c0c1ff]/10 flex items-center justify-center text-[#c0c1ff]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
              </div>
              <h3 className="text-xl font-bold text-[#e5e2e3]">Team Collaboration</h3>
              <p className="text-[#c7c4d7] text-sm leading-relaxed">Advanced RBAC and workspace management tools for complex organizational hierarchies.</p>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="max-w-[1440px] mx-auto px-6 md:px-8 mb-32">
          <div className="landing-glass-card rounded-3xl p-16 text-center border border-white/10">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#e5e2e3] mb-4">Ready to scale your collaboration?</h2>
            <p className="text-[#c7c4d7] text-lg mb-8 max-w-xl mx-auto">Join 10,000+ teams who ship documents faster with SyncDocs. Start for free today.</p>
            <div className="flex justify-center gap-4">
              <button className="landing-cta-primary" onClick={() => navigate('/register')}>Get Started for Free</button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#131314] py-12">
        <div className="max-w-[1440px] mx-auto px-6 md:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="landing-brand-logo">
            <div className="landing-logo-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /></svg>
            </div>
            <span>SyncDocs</span>
          </div>
          <div className="text-[#c7c4d7]/70 text-sm font-mono">
            © 2026 SyncDocs. Built with React, Node.js, PostgreSQL, Socket.IO and AWS.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
