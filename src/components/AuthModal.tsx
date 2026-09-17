import React, { useEffect, useState } from 'react';
import { X, Bot, MailCheck } from 'lucide-react';
import { api } from '../services/api';
import { User, Workspace } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User, workspace: Workspace) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetSentTo, setResetSentTo] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const switchMode = (next: 'login' | 'signup' | 'forgot') => {
    setError('');
    setResetSentTo('');
    setMode(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        const res = await api.register({
          email,
          name: name || email.split('@')[0],
          businessName: businessName || 'My Business',
        });
        onSuccess(res.user, res.workspace);
        onClose();
      } else if (mode === 'login') {
        const res = await api.login(email, password);
        onSuccess(res.user, res.workspace);
        onClose();
      } else {
        setResetSentTo(email);
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (userEmail: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.login(userEmail);
      onSuccess(res.user, res.workspace);
      onClose();
    } catch (e: any) {
      setError(e?.message || 'Could not sign in to the demo account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/60 backdrop-blur-xs p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ember-600 text-white">
              <Bot className="h-5 w-5" />
            </div>
            <span className="font-display font-semibold text-slate-900 text-base">SupportAI</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="pt-4">
          {mode === 'forgot' && resetSentTo ? (
            <div className="py-2">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-signal-100 text-signal-700 mb-3">
                <MailCheck className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-display font-semibold text-slate-900 text-center">Check your inbox</h2>
              <p className="text-xs text-slate-500 mt-1.5 text-center leading-relaxed">
                If an account exists for <span className="font-semibold text-slate-700">{resetSentTo}</span>, a
                password reset link is on its way.
              </p>
              <button
                onClick={() => switchMode('login')}
                className="w-full mt-5 rounded-xl bg-ember-600 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-ember-700 transition"
              >
                Back to Sign In
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-display font-semibold text-slate-900">
                {mode === 'login' && 'Sign in to your workspace'}
                {mode === 'signup' && 'Create your SupportAI account'}
                {mode === 'forgot' && 'Reset your password'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {mode === 'login' && 'Enter your business credentials or use quick demo sign-in.'}
                {mode === 'signup' && 'Start your 14-day free trial. No credit card required.'}
                {mode === 'forgot' && 'Enter your email to receive recovery instructions.'}
              </p>

              {error && (
                <div className="mt-3 rounded-lg bg-rose-50 border border-rose-200 p-2.5 text-xs text-rose-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
                {mode === 'signup' && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Your Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Alex Vance"
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-ember-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Business / Workspace Name
                      </label>
                      <input
                        type="text"
                        required
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="Acme Store or Tech Corp"
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-ember-500 focus:outline-none"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Work Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@company.com"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-ember-500 focus:outline-none"
                  />
                </div>

                {mode !== 'forgot' && (
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-semibold text-slate-700">Password</label>
                      {mode === 'login' && (
                        <button
                          type="button"
                          onClick={() => switchMode('forgot')}
                          className="text-[11px] text-ember-600 hover:underline"
                        >
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-ember-500 focus:outline-none"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-ember-600 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-ember-700 disabled:opacity-50 transition"
                >
                  {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'}
                </button>
              </form>

              {mode !== 'forgot' && (
                <>
                  {/* Quick Demo Credentials */}
                  <div className="mt-5 pt-4 border-t border-slate-100">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      Instant Demo Access
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleQuickLogin('alex@acmestore.io')}
                        className="text-left p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition text-xs"
                      >
                        <div className="font-semibold text-slate-800">Alex (Owner)</div>
                        <div className="text-[10px] text-slate-500">Acme Store HQ</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickLogin('sarah.support@acmestore.io')}
                        className="text-left p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition text-xs"
                      >
                        <div className="font-semibold text-slate-800">Sarah (Admin)</div>
                        <div className="text-[10px] text-slate-500">Support Desk</div>
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 text-center text-xs text-slate-500">
                    {mode === 'login' ? (
                      <>
                        Don't have an account?{' '}
                        <button
                          type="button"
                          onClick={() => switchMode('signup')}
                          className="text-ember-600 font-semibold hover:underline"
                        >
                          Sign up free
                        </button>
                      </>
                    ) : (
                      <>
                        Already have an account?{' '}
                        <button
                          type="button"
                          onClick={() => switchMode('login')}
                          className="text-ember-600 font-semibold hover:underline"
                        >
                          Sign in
                        </button>
                      </>
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
