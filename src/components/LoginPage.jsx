import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { googleCloudAuth } from '../firebase/googleAuthService';
import SkillGradLogo from './SkillGradLogo';
import { 
  Mail, Lock, User, ArrowRight, ShieldCheck, Eye, EyeOff, 
  GraduationCap, Building2, ChevronLeft, KeyRound, CheckCircle2, AlertCircle
} from 'lucide-react';

export default function LoginPage({ onLoginSuccess }) {
  const { loginWithEmail, signupWithEmail, resetPassword, loginWithGoogle, addToast } = useAuth();
  const [selectedRole, setSelectedRole] = useState(() => localStorage.getItem('skillgrad_active_role') || 'student');
  const [view, setView] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  const isLogin = view === 'login';
  const isSignup = view === 'signup';
  const isForgot = view === 'forgot';
  const isCompany = selectedRole === 'company';

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    localStorage.setItem('skillgrad_active_role', role);
    setError('');
  };

  const checkPasswordStrength = (pwd) => {
    let score = 0;
    const checks = {
      length: pwd.length >= 8,
      hasUpper: /[A-Z]/.test(pwd),
      hasLower: /[a-z]/.test(pwd),
      hasNumber: /[0-9]/.test(pwd),
      hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)
    };
    if (checks.length) score++;
    if (checks.hasUpper && checks.hasLower) score++;
    if (checks.hasNumber) score++;
    if (checks.hasSpecial) score++;
    let label = 'Weak', color = 'bg-rose-500', textColor = 'text-rose-400';
    if (score === 2) { label = 'Fair'; color = 'bg-amber-500'; textColor = 'text-amber-400'; }
    if (score === 3) { label = 'Good'; color = 'bg-indigo-500'; textColor = 'text-indigo-400'; }
    if (score === 4) { label = 'Strong'; color = 'bg-emerald-500'; textColor = 'text-emerald-400'; }
    return { score, label, color, textColor, checks };
  };

  const passwordStrength = checkPasswordStrength(password);

  const validateSignup = () => {
    if (!name.trim() || name.trim().length < 2) { setError('Please provide your full name.'); return false; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) { setError('Please enter a valid email.'); return false; }
    if (!passwordStrength.checks.length) { setError('Password must be at least 8 characters.'); return false; }
    if (!passwordStrength.checks.hasUpper || !passwordStrength.checks.hasLower) { setError('Password needs uppercase and lowercase letters.'); return false; }
    if (!passwordStrength.checks.hasNumber) { setError('Password needs at least one number.'); return false; }
    if (!passwordStrength.checks.hasSpecial) { setError('Password needs a special character (@#$!).'); return false; }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (isLogin) {
      if (!email.trim() || !password) { setError('Enter your email and password.'); return; }
      setIsLoading(true);
      const res = await loginWithEmail(email, password);
      setIsLoading(false);
      if (res.success) { addToast(`Welcome back, ${res.user.displayName || 'User'}!`, 'success'); if (onLoginSuccess) onLoginSuccess(res.user.role || selectedRole); }
      else { setError(res.error || 'Login failed.'); }
    } else if (isSignup) {
      if (!validateSignup()) return;
      setIsLoading(true);
      const res = await signupWithEmail(email, password, name, selectedRole);
      setIsLoading(false);
      if (res.success) { addToast('Account created!', 'success'); if (onLoginSuccess) onLoginSuccess(selectedRole); }
      else { setError(res.error || 'Registration failed.'); }
    } else if (isForgot) {
      if (!email.trim() || !email.includes('@')) { setError('Enter your registered email.'); return; }
      if (passwordStrength.score < 3) { setError('New password must be strong.'); return; }
      if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
      setIsLoading(true);
      const res = await resetPassword(email, password);
      setIsLoading(false);
      if (res.success) { setResetSuccess(true); addToast('Password reset!', 'success'); }
      else { setError(res.error || 'Reset failed.'); }
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      const res = await loginWithGoogle(selectedRole);
      if (res && res.success) {
        if (onLoginSuccess) onLoginSuccess(res.user?.role || selectedRole);
      } else {
        setError(res?.error || 'Google Sign-In failed.');
      }
    } catch (err) {
      setError(err.message || 'Google Sign-In failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-8 sm:p-6 bg-[#090A0F] ambient-radiance overflow-hidden">
      
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
      
      {/* Spinning orbit ring */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] sm:w-[600px] sm:h-[600px] pointer-events-none opacity-[0.07]">
        <div className="absolute inset-0 rounded-full border border-white/20 animate-rotate-shimmer" style={{ animationDuration: '25s' }} />
        <div className="absolute inset-8 rounded-full border border-white/10 animate-rotate-shimmer" style={{ animationDuration: '35s', animationDirection: 'reverse' }} />
        <div className="absolute inset-16 rounded-full border border-white/5 animate-rotate-shimmer" style={{ animationDuration: '50s' }} />
      </div>

      {/* Ambient glow dot */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-indigo-500 animate-glow-pulse pointer-events-none" />

      {/* MAIN LOGIN CARD */}
      <div className="w-full max-w-[420px] relative z-10 animate-scale-in">
        
        {/* Brand Header with bounce-in logo */}
        <div className="text-center mb-5 sm:mb-6 animate-bounce-in">
          <div className="inline-flex items-center justify-center mb-2">
            <SkillGradLogo className="h-8 sm:h-9 w-auto" textClassName="text-xl sm:text-2xl font-bold font-display tracking-tight text-white" />
          </div>
          <p className="text-[13px] sm:text-xs text-slate-400 font-medium tracking-wide">
            Bridging Skills and Industry
          </p>
        </div>

        {/* Card with gradient animated border */}
        <div className="p-[1px] rounded-2xl gradient-border animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="bg-[#0c1018] p-5 sm:p-7 rounded-2xl relative overflow-hidden">
            
            {/* Shimmer line inside card */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

            {/* Role Toggle */}
            <div className="mb-5 p-1 rounded-xl bg-slate-950/90 border border-white/[0.06] flex items-center gap-1 stagger-children">
              <button
                type="button"
                onClick={() => handleRoleChange('student')}
                className={`flex-1 py-2.5 sm:py-2 px-3 rounded-lg text-[13px] sm:text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                  !isCompany
                    ? 'bg-slate-800 text-white shadow-sm border border-white/10'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <GraduationCap className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-indigo-400" />
                <span>Student</span>
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('company')}
                className={`flex-1 py-2.5 sm:py-2 px-3 rounded-lg text-[13px] sm:text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                  isCompany
                    ? 'bg-slate-800 text-white shadow-sm border border-white/10'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Building2 className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-cyan-400" />
                <span>Hiring Partner</span>
              </button>
            </div>

            {/* Title */}
            <div className="mb-4 text-center animate-fadeIn">
              <h2 className="text-lg sm:text-xl font-bold font-display text-white tracking-tight">
                {isLogin && (isCompany ? 'Employer Sign In' : 'Student Sign In')}
                {isSignup && 'Create Account'}
                {isForgot && 'Reset Password'}
              </h2>
              <p className="text-[13px] sm:text-xs text-slate-400 mt-1">
                {isLogin && 'Enter your credentials'}
                {isSignup && 'Register to join SkillGrad'}
                {isForgot && 'Set a new password'}
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-[13px] sm:text-xs flex items-start gap-2 animate-slide-left">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Reset Success */}
            {resetSuccess ? (
              <div className="text-center py-6 space-y-4 animate-bounce-in">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-white">Password Updated</h3>
                <p className="text-[13px] sm:text-xs text-slate-400">Sign in with your new password.</p>
                <button
                  type="button"
                  onClick={() => { setView('login'); setResetSuccess(false); setError(''); }}
                  className="w-full py-3 sm:py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-[13px] sm:text-xs transition-all cursor-pointer border border-white/10"
                >
                  Go to Sign In
                </button>
              </div>
            ) : (
              <div className="stagger-children">
                {/* Google OAuth */}
                {!isForgot && (
                  <div className="mb-3">
                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      disabled={isLoading}
                      className="w-full py-3 sm:py-2.5 px-4 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-white/[0.08] hover:border-white/20 flex items-center justify-center gap-2.5 text-[13px] sm:text-xs font-semibold text-slate-200 hover:text-white transition-all cursor-pointer active:scale-[0.98]"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                      </svg>
                      <span>Continue with Google</span>
                    </button>

                    <div className="relative my-3 sm:my-4">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/[0.06]" />
                      </div>
                      <div className="relative flex justify-center text-[11px] uppercase font-semibold tracking-wider">
                        <span className="bg-[#0c1018] px-3 text-slate-500">Or with email</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-3" noValidate>
                  {isSignup && (
                    <div>
                      <label className="block text-[13px] sm:text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-3.5 sm:top-3 w-4 h-4 text-slate-500" />
                        <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe"
                          className="w-full pl-10 pr-4 py-3 sm:py-2.5 rounded-xl glass-input text-[14px] sm:text-sm" />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-[13px] sm:text-xs font-semibold text-slate-300 mb-1">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3.5 sm:top-3 w-4 h-4 text-slate-500" />
                      <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com"
                        className="w-full pl-10 pr-4 py-3 sm:py-2.5 rounded-xl glass-input text-[14px] sm:text-sm" />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[13px] sm:text-xs font-semibold text-slate-300">
                        {isForgot ? 'New Password' : 'Password'}
                      </label>
                      {isLogin && (
                        <button type="button" onClick={() => { setView('forgot'); setError(''); }}
                          className="text-[12px] sm:text-[11px] text-slate-400 hover:text-white transition-colors cursor-pointer">
                          Forgot?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3.5 sm:top-3 w-4 h-4 text-slate-500" />
                      <input type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••" className="w-full pl-10 pr-10 py-3 sm:py-2.5 rounded-xl glass-input text-[14px] sm:text-sm" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3.5 sm:top-3 text-slate-500 hover:text-slate-300 cursor-pointer">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Strength Meter */}
                    {(isSignup || isForgot) && password && (
                      <div className="mt-2.5 space-y-1.5 animate-slide-up">
                        <div className="flex items-center justify-between text-[12px] sm:text-[11px]">
                          <span className="text-slate-500">Strength:</span>
                          <span className={`font-semibold ${passwordStrength.textColor}`}>{passwordStrength.label}</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden flex gap-1">
                          {[1,2,3,4].map(i => (
                            <div key={i} className={`h-full flex-1 rounded-full transition-all duration-300 ${i <= passwordStrength.score ? passwordStrength.color : 'bg-transparent'}`} />
                          ))}
                        </div>
                        <div className="grid grid-cols-2 gap-1 text-[11px] sm:text-[10px] text-slate-500 pt-0.5">
                          <span className={passwordStrength.checks.length ? 'text-emerald-400' : ''}>✓ 8+ chars</span>
                          <span className={passwordStrength.checks.hasUpper && passwordStrength.checks.hasLower ? 'text-emerald-400' : ''}>✓ A-Z & a-z</span>
                          <span className={passwordStrength.checks.hasNumber ? 'text-emerald-400' : ''}>✓ 0-9</span>
                          <span className={passwordStrength.checks.hasSpecial ? 'text-emerald-400' : ''}>✓ @#$!</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {(isSignup || isForgot) && (
                    <div>
                      <label className="block text-[13px] sm:text-xs font-semibold text-slate-300 mb-1">Confirm Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-3.5 sm:top-3 w-4 h-4 text-slate-500" />
                        <input type={showPassword ? 'text' : 'password'} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••••••" className="w-full pl-10 pr-4 py-3 sm:py-2.5 rounded-xl glass-input text-[14px] sm:text-sm" />
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button type="submit" disabled={isLoading}
                    className="w-full py-3 sm:py-2.5 rounded-xl bg-slate-100 hover:bg-white text-slate-950 font-bold text-[14px] sm:text-xs shadow-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer mt-1 active:scale-[0.97]">
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>{isForgot ? 'Update Password' : isLogin ? 'Sign In' : 'Create Account'}</span>
                        {isForgot ? <KeyRound className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                      </>
                    )}
                  </button>
                </form>

                {/* View Switcher */}
                <div className="mt-4 text-center text-[13px] sm:text-xs text-slate-400">
                  {isLogin && (
                    <>
                      No account?{' '}
                      <button type="button" onClick={() => { setView('signup'); setError(''); }}
                        className="text-slate-200 hover:text-white font-semibold underline underline-offset-2 ml-1 cursor-pointer transition-colors">
                        Register
                      </button>
                    </>
                  )}
                  {isSignup && (
                    <>
                      Have an account?{' '}
                      <button type="button" onClick={() => { setView('login'); setError(''); }}
                        className="text-slate-200 hover:text-white font-semibold underline underline-offset-2 ml-1 cursor-pointer transition-colors">
                        Sign in
                      </button>
                    </>
                  )}
                  {isForgot && (
                    <button type="button" onClick={() => { setView('login'); setError(''); }}
                      className="text-slate-300 hover:text-white font-medium flex items-center justify-center gap-1 mx-auto cursor-pointer transition-colors">
                      <ChevronLeft className="w-3.5 h-3.5" /> Back to Sign In
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Security Footer */}
        <div className="mt-4 text-center text-[12px] sm:text-[11px] text-slate-500 flex flex-col items-center justify-center gap-1.5 animate-fadeIn" style={{ animationDelay: '0.5s' }}>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>Encrypted credential storage</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono tracking-wide">made by :- soutrik_2006</span>
        </div>

      </div>
    </div>
  );
}