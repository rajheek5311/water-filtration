import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Droplets, Mail, Lock, Eye, EyeOff, Sun, Moon, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useToast } from '@/context/ToastContext';
import Button from '@/components/Button';
import Field from '@/components/Field';

export default function Login() {
  const { signIn, signUp, resetPassword } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (mode === 'forgot') {
      if (!email) {
        showToast('error', 'Enter your email to reset password.');
        return;
      }
      setLoading(true);
      const { error } = await resetPassword(email);
      setLoading(false);
      if (error) showToast('error', error);
      else {
        showToast('success', 'Password reset link sent to your email.');
        setMode('signin');
      }
      return;
    }

    if (!email || !password) {
      showToast('error', 'Please enter email and password.');
      return;
    }
    setLoading(true);
    const fn = mode === 'signup' ? signUp : signIn;
    const { error } = await fn(email, password);
    setLoading(false);
    if (error) {
      showToast('error', error);
    } else {
      if (mode === 'signup') {
        showToast('success', 'Account created. You are signed in.');
      } else {
        showToast('success', 'Welcome back!');
      }
      navigate('/home');
    }
  };

  return (
    <div className="app-bg app-grid min-h-screen flex items-center justify-center p-4">
      <button
        onClick={toggleTheme}
        className="absolute top-5 right-5 p-2.5 rounded-xl glass text-slate-600 dark:text-slate-300 hover:shadow-glow transition-all"
        aria-label="Toggle theme"
      >
        {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
      </button>

      <div className="w-full max-w-md animate-fade-in-scale">
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-brand-500 to-aqua-500 text-white shadow-glow animate-float">
              <Droplets className="h-8 w-8" />
            </div>
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-[#0c1730] animate-pulse" />
          </div>
          <h1 className="font-display text-xl font-bold text-slate-800 dark:text-white text-center">
            Smart Textile Water Filtration
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Monitoring System</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-strong rounded-2xl p-7 space-y-4">
          <div>
            <h2 className="font-display text-lg font-semibold text-slate-800 dark:text-white">
              {mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Reset Password'}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {mode === 'signin'
                ? 'Access the monitoring dashboard.'
                : mode === 'signup'
                ? 'Create an account to get started.'
                : 'We will email you a reset link.'}
            </p>
          </div>

          <Field
            label="Email"
            type="email"
            placeholder="you@institute.edu"
            icon={<Mail className="h-4 w-4" />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />

          {mode !== 'forgot' && (
            <div>
              <label className="block">
                <span className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Password</span>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input
                    type={showPw ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                    className="w-full rounded-xl bg-white/70 dark:bg-white/5 border border-slate-200/70 dark:border-white/10 pl-10 pr-10 py-2.5 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-400/60 focus:border-brand-400 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </label>
            </div>
          )}

          {mode === 'signin' && (
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-400"
                />
                Remember me
              </label>
              <button
                type="button"
                onClick={() => setMode('forgot')}
                className="font-medium text-brand-600 dark:text-brand-300 hover:underline"
              >
                Forgot password?
              </button>
            </div>
          )}

          <Button type="submit" className="w-full" size="lg" loading={loading}>
            {mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'}
          </Button>

          <div className="flex items-center gap-3 my-1">
            <div className="h-px flex-1 bg-slate-200/70 dark:bg-white/10" />
            <span className="text-xs text-slate-400">or</span>
            <div className="h-px flex-1 bg-slate-200/70 dark:bg-white/10" />
          </div>

          <div className="flex justify-between text-sm">
            {mode !== 'signin' && (
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="font-medium text-brand-600 dark:text-brand-300 hover:underline"
              >
                Back to sign in
              </button>
            )}
            {mode === 'signin' && (
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="font-medium text-brand-600 dark:text-brand-300 hover:underline"
              >
                Create new account
              </button>
            )}
          </div>
        </form>

        <p className="text-center text-xs text-slate-400 mt-6">
          Secure access • Supabase Authentication
        </p>
      </div>
    </div>
  );
}
