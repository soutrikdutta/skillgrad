import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { googleCloudAuth } from '../firebase/googleAuthService';
import SkillGradLogo from './SkillGradLogo';
import { 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  GraduationCap, 
  Building2, 
  ChevronLeft,
  KeyRound,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function LoginPage({ selectedRole = 'student', onBackToRoles, onContinueAsGuest }) {
  const { loginWithEmail, signupWithEmail, resetPassword, addToast } = useAuth();
  const [view, setView] = useState('login'); // 'login' | 'signup' | 'forgot'
  
  // Auth state
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

  // Strong Password Evaluation
  const checkPasswordStrength = (pwd) => {
    let score = 0;
    const checks = {
      length: pwd.length >= 8,
      hasUpper: /[A-Z]/.test(pwd),
      hasLower: /[a-z]/.test(pwd),
      hasNumber: /[0-9]/.test(pwd),
      hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)
    };

    if (checks.length) score += 1;
    if (checks.hasUpper && checks.hasLower) score += 1;
    if (checks.hasNumber) score += 1;
    if (checks.hasSpecial) score += 1;

    let label = 'Weak';
    let color = 'bg-rose-500';
    let textColor = 'text-rose-400';

    if (score === 2) { label = 'Fair'; color = 'bg-amber-500'; textColor = 'text-amber-400'; }
    if (score === 3) { label = 'Good'; color = 'bg-indigo-500'; textColor = 'text-indigo-400'; }
    if (score === 4) { label = 'Strong'; color = 'bg-emerald-500'; textColor = 'text-emerald-400'; }

    return { score, label, color, textColor, checks };
  };

  const passwordStrength = checkPasswordStrength(password);

  const validateSignup = () => {
    if (!name.trim() || name.trim().length < 2) {
      setError('Please provide your full name (minimum 2 characters).');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return false;
    }
    
    // Strong password checks
    if (!passwordStrength.checks.length) {
      setError('Password must be at least 8 characters long.');
      return false;
    }
    if (!passwordStrength.checks.hasUpper || !passwordStrength.checks.hasLower) {
      setError('Password must contain both uppercase and lowercase letters.');
      return false;
    }
    if (!passwordStrength.checks.hasNumber) {
      setError('Password must contain at least one number (0-9).');
      return false;
    }
    if (!passwordStrength.checks.hasSpecial) {
      setError('Password must contain at least one special character (e.g. @, #, $, !).');
      return false;
    }
    return true;
  };

  const validateLogin = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setError('Please enter your registered email address.');
      return false;
    }
    if (!password) {
      setError('Please enter your password.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isSignup) {
      if (!validateSignup()) return;
      setIsLoading(true);
      try {
        const res = await signupWithEmail(email.trim(), password, name.trim(), selectedRole);
        if (!res.success) setError(res.error || 'Registration failed');
      } catch (err) {
        setError(err.message || 'An error occurred during registration');
      } finally {
        setIsLoading(false);
      }
    } else if (isLogin) {
      if (!validateLogin()) return;
      setIsLoading(true);
      try {
        const res = await loginWithEmail(email.trim(), password);
        if (!res.success) setError(res.error || 'Authentication failed');
      } catch (err) {
        setError(err.message || 'An error occurred during sign-in');
      } finally {
        setIsLoading(false);
      }
    } else if (isForgot) {
      // Forgot / Reset Password flow
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.trim() || !emailRegex.test(email.trim())) {
        setError('Please enter your registered email address.');
        return;
      }
      if (!passwordStrength.checks.length || !passwordStrength.checks.hasNumber || !passwordStrength.checks.hasSpecial) {
        setError('Please enter a strong new password (min. 8 characters with letters, numbers and special characters).');
        return;
      }
      if (password !== confirmPassword) {
        setError('New password and confirm password do not match.');
        return;
      }

      setIsLoading(true);
      try {
        const res = await resetPassword(email.trim(), password);
        if (res.success) {
          setResetSuccess(true);
        } else {
          setError(res.error || 'Password reset failed.');
        }
      } catch (err) {
        setError(err.message || 'Error resetting password.');
      } finally {
        setIsLoading(false);
      }
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
      
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[620px] h-[360px] bg-gradient-to-tr from-primary-600/20 via-indigo-600/15 to-cyan-500/15 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-md">
        
        {/* Back navigation */}
        {onBackToRoles && (
          <div className="mb-4">
            <button
              onClick={onBackToRoles}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              Change role selection
            </button>
          </div>
        )}

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <SkillGradLogo className="h-10 w-auto" textClassName="text-2xl font-bold font-display" />
          </div>

          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-2 backdrop-blur-md ${
            isCompany 
              ? 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-300' 
              : 'bg-indigo-500/15 border border-indigo-500/30 text-primary-300'
          }`}>
            {isCompany ? <Building2 className="w-3.5 h-3.5" /> : <GraduationCap className="w-3.5 h-3.5" />}
            <span>{isCompany ? 'Hiring Partner Portal' : 'Student & Learner Portal'}</span>
          </div>

          <h2 className="text-2xl font-extrabold font-display text-white">
            {isForgot ? 'Reset Your Password' : (
              isLogin 
                ? (isCompany ? 'Sign in to Employer Account' : 'Sign in to Student Account')
                : (isCompany ? 'Register as Hiring Partner' : 'Create Student Account')
            )}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isForgot ? 'Verify your registered email and create a new secure password' : (
              isLogin 
                ? 'Registered users only. Please sign in with your credentials.' 
                : 'Register a new account to access internships and projects.'
            )}
          </p>
        </div>

        {/* Frosted Glass Auth Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl relative">
          
          {/* Google Sign In (for Login / Signup views) */}
          {!isForgot && (
            <>
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 text-white font-medium text-sm transition-all duration-200 hover:border-white/20 shadow-sm disabled:opacity-60 cursor-pointer"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.6 3.6 1.7 7.4l3.7 2.9C6.3 7.3 8.9 5 12 5z" />
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                  <path fill="#FBBC05" d="M5.4 14.7c-.2-.7-.4-1.5-.4-2.4s.2-1.7.4-2.4L1.7 7C.6 9.2 0 10.6 0 12.3s.6 3.1 1.7 5.3l3.7-2.9z" />
                  <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.7-2.3-6.6-5.3L1.7 16.4C3.6 20.2 7.4 23.5 12 23.5z" />
                </svg>
                Continue with Google
              </button>

              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[#0c121e] px-3 text-slate-400">or with email</span>
                </div>
              </div>
            </>
          )}

          {/* Reset Success Message */}
          {resetSuccess ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto text-2xl">
                ✓
              </div>
              <h3 className="text-xl font-bold text-white">Password Updated!</h3>
              <p className="text-xs text-slate-300">
                Your password has been reset successfully. You can now sign in using your new credentials.
              </p>
              <button
                type="button"
                onClick={() => { setView('login'); setResetSuccess(false); setPassword(''); setConfirmPassword(''); }}
                className="w-full py-3 rounded-xl bg-primary-600 text-white font-semibold text-xs shadow-lg cursor-pointer"
              >
                Return to Sign In
              </button>
            </div>
          ) : (
            <>
              {/* Error Banner */}
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Main Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
                {isSignup && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      {isCompany ? 'Company / Representative Name *' : 'Full Name *'}
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder={isCompany ? "e.g. Acme Tech Labs" : "e.g. John Doe"}
                        value={name}
                        onChange={(e) => { setName(e.target.value); setError(''); }}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs sm:text-sm"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {isCompany ? 'Work Email Address *' : 'Email Address *'}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder={isCompany ? "recruiter@company.com" : "student@university.edu"}
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(''); }}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-300">
                      {isForgot ? 'New Password *' : 'Password *'}
                    </label>
                    {isLogin && (
                      <button
                        type="button"
                        onClick={() => { setView('forgot'); setError(''); }}
                        className="text-[11px] text-primary-400 hover:text-primary-300 font-semibold cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  
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

                  {/* Visual Strong Password Meter for Signup & Forgot Password */}
                  {(isSignup || isForgot) && password.length > 0 && (
                    <div className="mt-2 space-y-1.5 p-3 rounded-xl bg-slate-900/80 border border-white/10">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Password Strength:</span>
                        <strong className={passwordStrength.textColor}>{passwordStrength.label}</strong>
                      </div>
                      
                      {/* Strength Bar */}
                      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                          style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                        />
                      </div>

                      {/* Requirements checklist */}
                      <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-400 pt-1">
                        <span className={passwordStrength.checks.length ? 'text-emerald-400' : ''}>
                          • Min. 8 characters
                        </span>
                        <span className={passwordStrength.checks.hasUpper && passwordStrength.checks.hasLower ? 'text-emerald-400' : ''}>
                          • Upper & lowercase
                        </span>
                        <span className={passwordStrength.checks.hasNumber ? 'text-emerald-400' : ''}>
                          • Number (0-9)
                        </span>
                        <span className={passwordStrength.checks.hasSpecial ? 'text-emerald-400' : ''}>
                          • Special symbol (@, #, $)
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {isForgot && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Confirm New Password *</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs sm:text-sm"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full mt-2 py-3.5 px-4 rounded-xl text-white font-semibold text-xs sm:text-sm shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer ${
                    isCompany 
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-cyan-600/30'
                      : 'bg-gradient-to-r from-primary-600 via-indigo-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 shadow-indigo-600/30'
                  }`}
                >
                  {isLoading ? (
                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      {isForgot ? (
                        <>
                          <KeyRound className="w-4 h-4" />
                          Update & Reset Password
                        </>
                      ) : (
                        isLogin ? (
                          <>
                            Sign In
                            <ArrowRight className="w-4 h-4" />
                          </>
                        ) : (
                          <>
                            {isCompany ? 'Register Employer Account' : 'Register Student Account'}
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )
                      )}
                    </>
                  )}
                </button>
              </form>

              {/* View Switchers */}
              <div className="mt-5 text-center text-xs text-slate-400">
                {isLogin && (
                  <>
                    Don't have a registered account?{' '}
                    <button
                      type="button"
                      onClick={() => { setView('signup'); setError(''); }}
                      className="text-primary-400 hover:text-primary-300 font-semibold underline underline-offset-2 ml-1 cursor-pointer"
                    >
                      Register first
                    </button>
                  </>
                )}

                {isSignup && (
                  <>
                    Already registered?{' '}
                    <button
                      type="button"
                      onClick={() => { setView('login'); setError(''); }}
                      className="text-primary-400 hover:text-primary-300 font-semibold underline underline-offset-2 ml-1 cursor-pointer"
                    >
                      Sign in with your password
                    </button>
                  </>
                )}

                {isForgot && (
                  <button
                    type="button"
                    onClick={() => { setView('login'); setError(''); }}
                    className="text-primary-400 hover:text-primary-300 font-semibold flex items-center justify-center gap-1 mx-auto cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    Back to Sign In
                  </button>
                )}
              </div>
            </>
          )}

          {/* Guest Link */}
          <div className="mt-6 pt-4 border-t border-white/10 text-center">
            <button
              type="button"
              onClick={onContinueAsGuest}
              className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Explore website as Guest →
            </button>
          </div>

        </div>

        {/* Security Note */}
        <div className="mt-6 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Encrypted credential storage & session protection</span>
        </div>

      </div>
    </div>
  );
}