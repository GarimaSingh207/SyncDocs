import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import axios from 'axios';
import './RegisterPage.css';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (confirmPassword && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      await register({ name, email, password });
      navigate('/dashboard');
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to register account. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-page-container">
      {/* Left Panel: Collaboration Scene */}
      <section className="register-left-panel">
        <div className="register-glow-primary"></div>
        <div className="register-glow-secondary"></div>

        <div className="register-collaboration-stage">
          <div className="register-floating-element register-glass-surface register-light-leak register-editor-window">
            <div className="register-editor-header">
              <div className="flex items-center gap-sm">
                <div className="register-window-dots">
                  <div className="register-dot register-dot-red"></div>
                  <div className="register-dot register-dot-yellow"></div>
                  <div className="register-dot register-dot-gray"></div>
                </div>
                <span className="register-file-name">workspace-setup.md</span>
              </div>
              <div className="register-avatar-stack">
                <div className="register-avatar-item register-avatar-pink">
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" alt="Sarah" />
                </div>
                <div className="register-avatar-item register-avatar-indigo">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="Alex" />
                </div>
              </div>
            </div>

            <div className="register-editor-content">
              <div className="register-editor-heading"># Welcome to SyncDocs</div>
              <div className="register-editor-paragraph">
                Set up your shared environment in seconds. Every change is synchronized across your team in real-time with enterprise-grade security.
              </div>

              <div className="register-cursor-anim">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#ec4899" style={{ transform: 'rotate(-45deg)' }}>
                  <path d="M3 3l7 18 3-7 7-3L3 3z" />
                </svg>
                <span className="register-cursor-badge">Sarah</span>
              </div>
            </div>

            <div className="register-editor-footer">
              <div className="register-live-status">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span>Environment live</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Right Panel: Auth Register Form */}
      <section className="register-right-panel">
        <div className="register-form-wrapper">
          <div className="register-brand-header">
            <div className="register-brand-logo">SyncDocs</div>
            <h1 className="register-heading">Create your account</h1>
            <p className="register-subheading">Join your team and start building together.</p>
          </div>

          {error && <div className="alert alert-error register-alert">{error}</div>}

          <form onSubmit={handleSubmit} className="register-form">
            {/* Full Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="font-medium text-xs text-[#c7c4d7] uppercase tracking-widest">Full Name</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors group-focus-within:text-[#c0c1ff] text-[#c7c4d7]/40 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">person</span>
                </div>
                <input
                  id="name"
                  type="text"
                  className="w-full h-14 bg-[#131314] border border-white/10 rounded-xl px-6 pl-14 text-[#e5e2e3] placeholder:text-[#c7c4d7]/30 placeholder:font-normal placeholder:text-base focus:outline-none focus:border-[#c0c1ff] focus:ring-4 focus:ring-[#6366f1]/15 transition-all duration-200"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-2">
              <label htmlFor="email" className="font-medium text-xs text-[#c7c4d7] uppercase tracking-widest">Email Address</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors group-focus-within:text-[#c0c1ff] text-[#c7c4d7]/40 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">mail</span>
                </div>
                <input
                  id="email"
                  type="email"
                  className="w-full h-14 bg-[#131314] border border-white/10 rounded-xl px-6 pl-14 text-[#e5e2e3] placeholder:text-[#c7c4d7]/30 placeholder:font-normal placeholder:text-base focus:outline-none focus:border-[#c0c1ff] focus:ring-4 focus:ring-[#6366f1]/15 transition-all duration-200"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="font-medium text-xs text-[#c7c4d7] uppercase tracking-widest">Password</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors group-focus-within:text-[#c0c1ff] text-[#c7c4d7]/40 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">lock</span>
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="w-full h-14 bg-[#131314] border border-white/10 rounded-xl px-6 pl-14 pr-14 text-[#e5e2e3] placeholder:text-[#c7c4d7]/30 placeholder:font-normal placeholder:text-base focus:outline-none focus:border-[#c0c1ff] focus:ring-4 focus:ring-[#6366f1]/15 transition-all duration-200"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength={6}
                  required
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#c7c4d7]/40 hover:text-[#e5e2e3] transition-colors focus:outline-none flex items-center justify-center cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label htmlFor="confirm-password" className="font-medium text-xs text-[#c7c4d7] uppercase tracking-widest">Confirm Password</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors group-focus-within:text-[#c0c1ff] text-[#c7c4d7]/40 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">lock_reset</span>
                </div>
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="w-full h-14 bg-[#131314] border border-white/10 rounded-xl px-6 pl-14 pr-14 text-[#e5e2e3] placeholder:text-[#c7c4d7]/30 placeholder:font-normal placeholder:text-base focus:outline-none focus:border-[#c0c1ff] focus:ring-4 focus:ring-[#6366f1]/15 transition-all duration-200"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength={6}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#c7c4d7]/40 hover:text-[#e5e2e3] transition-colors focus:outline-none flex items-center justify-center cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showConfirmPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>


            {/* Submit Button */}
            <button type="submit" className="register-submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </button>

            {/* Divider */}
            <div className="register-divider-row">
              <div className="register-divider-line"></div>
              <span className="register-divider-text">Or</span>
              <div className="register-divider-line"></div>
            </div>

            {/* Google Signup */}
            <button type="button" className="register-google-btn" onClick={() => alert('Google authentication is not configured.')}>
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </button>
          </form>

          <div className="register-footer">
            <span>Already have an account?</span>
            <Link to="/login" className="login-link">Sign In</Link>
          </div>
        </div>

        <div className="register-version-watermark">
          SyncDocs v2.4.1 — Enterprise Cloud
        </div>
      </section>
    </div>
  );
};

export default RegisterPage;

