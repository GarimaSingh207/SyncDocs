import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import axios from 'axios';
import './LoginPage.css';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to log in. Please check your credentials and try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page-container">
      {/* Left Panel: Collaboration Showcase */}
      <section className="login-left-panel">
        <div className="login-glow-primary"></div>
        <div className="login-glow-secondary"></div>

        <div className="collaboration-stage">
          {/* Main Floating Editor Window */}
          <div className="floating-element glass-surface light-leak editor-window">
            {/* Header */}
            <div className="editor-header">
              <div className="editor-header-left">
                <div className="window-dots">
                  <div className="dot dot-red"></div>
                  <div className="dot dot-yellow"></div>
                  <div className="dot dot-green"></div>
                </div>
                <span className="file-name">latency-optimization.md</span>
              </div>
              <div className="avatar-stack">
                <div className="avatar-item avatar-pink">
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" alt="Sarah" />
                </div>
                <div className="avatar-item avatar-indigo">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="Alex" />
                </div>
                <div className="avatar-item avatar-green">
                  <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" alt="Mark" />
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="editor-content">
              <div className="editor-heading"># Latency Metrics 2024</div>
              <div className="editor-paragraph">
                Our primary goal is to reduce the TTFB (Time to First Byte) across all edge nodes. Preliminary data suggests that the new sync engine is 40% faster.
              </div>
              <div className="editor-divider">---</div>
              <div>Current average response time: 42ms</div>
              <div>Projected average response time: 24ms</div>

              {/* Live Cursors */}
              <div className="cursor-anim-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#ec4899" className="cursor-icon">
                  <path d="M3 3l7 18 3-7 7-3L3 3z" />
                </svg>
                <span className="cursor-badge cursor-badge-pink">Sarah</span>
              </div>
              <div className="cursor-anim-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#818cf8" className="cursor-icon">
                  <path d="M3 3l7 18 3-7 7-3L3 3z" />
                </svg>
                <span className="cursor-badge cursor-badge-indigo">Alex</span>
              </div>
            </div>

            {/* Footer */}
            <div className="editor-footer">
              <div className="save-status">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span>Saved just now</span>
              </div>
            </div>
          </div>

          {/* History Floating Card */}
          <div className="floating-element glass-surface light-leak floating-history-card">
            <div className="history-title">Version History</div>
            <div className="history-item">
              <span className="history-ver">V2.1.0</span>
              <span className="history-time">2m ago</span>
            </div>
            <div className="history-item history-dim">
              <span className="history-ver">V2.0.9</span>
              <span className="history-time">1h ago</span>
            </div>
          </div>

          {/* Comment Floating Card */}
          <div className="floating-element glass-surface light-leak floating-comment-card">
            <div className="comment-wrapper">
              <div className="comment-avatar">
                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" alt="Mark" />
              </div>
              <div>
                <div className="comment-author">Mark</div>
                <div className="comment-text">Should we update the latency metrics for the quarterly report?</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Right Panel: Authentication Form */}
      <section className="login-right-panel">
        <div className="login-form-wrapper">
          <div className="brand-header">
            <div className="brand-logo">SyncDocs</div>
            <h1 className="login-heading">Welcome Back</h1>
            <p className="login-subheading">Continue collaborating with your team in real time.</p>
          </div>

          {error && (
            <div className="alert alert-error login-alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-field-group">
              <label htmlFor="email" className="input-label">Email Address</label>
              <div className="input-relative">
                <div className="input-icon-left">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  className="modern-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="input-field-group">
              <div className="input-label-row">
                <label htmlFor="password" className="input-label">Password</label>
                <a href="#" className="forgot-link" onClick={(e) => e.preventDefault()}>Forgot Password?</a>
              </div>
              <div className="input-relative">
                <div className="input-icon-left">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="modern-input modern-input-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="input-icon-right"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="login-submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>

            <div className="divider-row">
              <div className="divider-line"></div>
              <span className="divider-text">Or</span>
              <div className="divider-line"></div>
            </div>

            <button type="button" className="google-btn" onClick={() => alert('Google authentication is not configured.')}>
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </button>
          </form>

          <div className="login-footer">
            <span>Don't have an account?</span>
            <Link to="/register" className="register-link">Create an account</Link>
          </div>
        </div>

        <div className="version-watermark">
          SyncDocs Enterprise Cloud
        </div>
      </section>
    </div>
  );
};

export default LoginPage;

