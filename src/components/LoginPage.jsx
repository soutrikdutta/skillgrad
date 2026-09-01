import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { googleCloudAuth } from '../firebase/googleAuthService';
import SkillGradLogo from './SkillGradLogo';
import { Mail, Lock, User, ArrowRight, Sparkles, ShieldCheck, Eye, EyeOff } from 'lucide-react';

export default function LoginPage({ onContinueAsGuest }) {
  const { loginWithEmail, signupWithEmail, addToast } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const isLogin = mode === 'login';

  const validateForm = () => {
    if (!isLogin && (!name.trim() || name.trim().length < 2)) {
      setError('Please provide your full name (at least 2 characters).');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (isLogin) {
        const res = await loginWithEmail(email.trim(), password);
        if (!res.success) setError(res.error || 'Invalid credentials');
      } else {
        const res = await signupWithEmail(email.trim(), password, name.trim());
        if (!res.success) setError(res.error || 'Signup failed');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError('');
    setIsLoading(true);

    try {
      const res = await googleCloudAuth.signInWithGoogleCloud();
      if (res && res.success) {
        window.location.reload();
      } else if (res && res.error) {
        setError(res.error);
        setIsLoading(false);
      }
    } catch (err) {
      setError(err.message || 'Google authorization failed');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#06090F] text-slate-100 flex flex-col justify-center items-center px-4 sm:px-6 py-12 relative overflow-hidden selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Luminous background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-primary-600/20 via-indigo-600/15 to-cyan-500/15 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-md">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <SkillGradLogo className="h-11 w-auto" textClassName="text-2xl font-bold font-display" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-slate-900/70 border border-primary-500/30 text-[11px] font-semibold text-primary-300 mb-3 backdrop-blur-md">
            <Sparkles className="w-3 h-3 text-primary-400" />
            <span>Bridging Skills and Industry</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {isLogin ? 'Access paid internships and verified industry projects' : 'Join the student & company network on SkillGrad'}
          </p>
        </div>

        {/* Frosted Glass Auth Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl relative">
          
          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 text-white font-medium text-sm transition-all duration-200 hover:border-white/20 shadow-sm disabled:opacity-60"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.6 3.6 1.7 7.4l3.7 2.9C6.3 7.3 8.9 5 12 5z" />
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
              <path fill="#FBBC05" d="M5.4 14.7c-.2-.7-.4-1.5-.4-2.4s.2-1.7.4-2.4L1.7 7C.6 9.2 0 10.6 0 12.3s.6 3.1 1.7 5.3l3.7-2.9z" />
              <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.7-2.3-6.6-5.3L1.7 16.4C3.6 20.2 7.4 23.5 12 23.5z" />
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#0c121e] px-3 text-slate-400">or with email</span>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
              {error}
            </div>
          )}

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={name}
                    onChange={(e) => { setName(e.target.value); setError(''); }}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs sm:text-sm"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address *</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="name@university.edu or email@domain.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password * (min. 6 characters)</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl glass-input text-xs sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-primary-600 via-indigo-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Sign In to SkillGrad' : 'Create SkillGrad Account'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle Login / Signup */}
          <div className="mt-5 text-center text-xs text-slate-400">
            {isLogin ? (
              <>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('signup'); setError(''); }}
                  className="text-primary-400 hover:text-primary-300 font-semibold underline underline-offset-2 ml-1"
                >
                  Sign up free
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(''); }}
                  className="text-primary-400 hover:text-primary-300 font-semibold underline underline-offset-2 ml-1"
                >
                  Sign in
                </button>
              </>
            )}
          </div>

          {/* Guest Link */}
          <div className="mt-6 pt-4 border-t border-white/10 text-center">
            <button
              type="button"
              onClick={onContinueAsGuest}
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              Explore website as Guest →
            </button>
          </div>

        </div>

        {/* Security Note */}
        <div className="mt-6 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Secure Google Cloud & SSL authentication</span>
        </div>

      </div>
    </div>
  );
}