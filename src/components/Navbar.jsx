import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import SkillGradLogo from './SkillGradLogo';
import { 
  Menu, X, User, LogOut, GraduationCap, Building2, 
  Briefcase, Award, HelpCircle, Mail, ArrowLeftRight, ChevronRight,
  CheckCircle2, ShieldCheck
} from 'lucide-react';

export default function Navbar({ currentRole = 'student', onSwitchRole }) {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const isCompany = currentRole === 'company';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    if (!profileOpen) return;
    const close = () => setProfileOpen(false);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [profileOpen]);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const topOffset = 80;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - topOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const studentLinks = [
    { label: 'Internships', id: 'opportunities', icon: Briefcase },
    { label: 'Joined Roles', id: 'joined-internships', icon: CheckCircle2 },
    { label: 'Applications', id: 'my-applications', icon: Award },
    { label: 'Profile', id: 'talent-pool', icon: User },
    { label: 'Verify', id: 'certifications', icon: ShieldCheck },
    { label: 'FAQ', id: 'faq', icon: HelpCircle },
    { label: 'Contact', id: 'contact', icon: Mail },
  ];

  const companyLinks = [
    { label: 'Dashboard', id: 'company-dashboard', icon: Building2 },
    { label: 'Support', id: 'contact', icon: Mail },
  ];

  const navLinks = isCompany ? companyLinks : studentLinks;

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ease-out ${
        scrolled 
          ? 'bg-[#080a10]/95 backdrop-blur-2xl shadow-lg shadow-black/20 border-b border-white/[0.06]' 
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Brand */}
        <div className="flex items-center gap-3">
          <a href="#" className="flex items-center gap-2 group" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            <SkillGradLogo className="h-8 w-auto transition-transform duration-300 group-hover:scale-105" textClassName="text-lg font-bold font-display tracking-tight text-white" />
          </a>

          {/* Role Badge */}
          <div className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${
            isCompany 
              ? 'bg-cyan-500/10 border border-cyan-500/25 text-cyan-400' 
              : 'bg-indigo-500/10 border border-indigo-500/25 text-indigo-400'
          }`}>
            {isCompany ? <Building2 className="w-3 h-3" /> : <GraduationCap className="w-3 h-3" />}
            <span>{isCompany ? 'Employer' : 'Student'}</span>
          </div>

          <a 
            href="https://www.linkedin.com/in/soutrik-dutta-245b93372"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:inline-block text-[10px] text-slate-400 hover:text-[#0a66c2] font-mono transition-colors hover:underline underline-offset-2"
            title="Soutrik Dutta's LinkedIn Profile"
          >
            made by :- soutrik_2006
          </a>
        </div>

        {/* Center: Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-200 cursor-pointer hover:bg-white/[0.06] ${
                isCompany && link.id === 'company-dashboard'
                  ? 'text-cyan-400 hover:text-cyan-300'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right: Actions */}
        <div className="hidden md:flex items-center gap-2">
          {/* Switch Portal */}
          {onSwitchRole && (
            <button
              onClick={onSwitchRole}
              title="Switch portal"
              className="px-3 py-1.5 rounded-lg text-[12px] font-semibold text-slate-400 hover:text-white hover:bg-white/[0.06] flex items-center gap-1.5 transition-all duration-200 cursor-pointer active:scale-95"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Switch to {isCompany ? 'Student' : 'Employer'}</span>
            </button>
          )}

          {/* User Avatar + Dropdown */}
          {user && (
            <div className="relative">
              <button 
                onClick={(e) => { e.stopPropagation(); setProfileOpen(!profileOpen); }}
                className="flex items-center gap-2 px-1.5 py-1 rounded-full hover:bg-white/[0.06] transition-all duration-200 cursor-pointer"
              >
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={user.displayName || 'Google Profile'} 
                    className="w-8 h-8 rounded-full object-cover border border-indigo-500/50 shadow-sm"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm transition-all duration-300 ${
                    isCompany 
                      ? 'bg-gradient-to-br from-cyan-500 to-blue-600' 
                      : 'bg-gradient-to-br from-indigo-500 to-purple-600'
                  }`}>
                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                  </div>
                )}
                <ChevronRight className={`w-3 h-3 text-slate-500 transition-transform duration-200 ${profileOpen ? 'rotate-90' : ''}`} />
              </button>

              {/* Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 glass-panel rounded-xl p-2.5 shadow-2xl border border-white/[0.08] animate-scale-in z-50" style={{ transformOrigin: 'top right' }}>
                  <div className="flex items-center gap-3 px-2 py-2 border-b border-white/[0.06] mb-1.5">
                    {user.photoURL ? (
                      <img 
                        src={user.photoURL} 
                        alt={user.displayName || 'Google Profile'} 
                        className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500/40 shadow-sm shrink-0"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm shrink-0 ${
                        isCompany ? 'bg-gradient-to-br from-cyan-500 to-blue-600' : 'bg-gradient-to-br from-indigo-500 to-purple-600'
                      }`}>
                        {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-white truncate">{user.displayName || 'User'}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                      {user.photoURL && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-medium mt-0.5">
                          ✓ Google Account
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => { setProfileOpen(false); logout(); }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer active:scale-95"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer — slides down with animation */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
        mobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="glass-panel border-t border-white/[0.06] px-4 py-4 space-y-1">
          {/* Role indicator + switch */}
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-white/[0.06]">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${isCompany ? 'text-cyan-400' : 'text-indigo-400'}`}>
              {isCompany ? '🏢 Employer Portal' : '🎓 Student Portal'}
            </span>
            {onSwitchRole && (
              <button onClick={() => { onSwitchRole(); setMobileMenuOpen(false); }} 
                className="flex items-center gap-1 text-[12px] text-slate-300 font-semibold hover:text-white cursor-pointer">
                <ArrowLeftRight className="w-3 h-3" />
                Switch
              </button>
            )}
          </div>

          {/* Links */}
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-slate-300 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer"
              >
                <Icon className="w-4 h-4 text-slate-500" />
                {link.label}
              </button>
            );
          })}

          {/* User info + logout */}
          {user && (
            <div className="pt-3 mt-2 border-t border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={user.displayName || 'Google Profile'} 
                    className="w-8 h-8 rounded-full object-cover border border-indigo-500/50 shadow-sm"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white ${
                    isCompany ? 'bg-gradient-to-br from-cyan-500 to-blue-600' : 'bg-gradient-to-br from-indigo-500 to-purple-600'
                  }`}>
                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold text-white truncate max-w-[150px]">{user.displayName || 'User'}</p>
                  <p className="text-[10px] text-slate-400 truncate max-w-[150px]">{user.email}</p>
                </div>
              </div>
              <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="text-[12px] text-rose-400 font-semibold hover:text-rose-300 cursor-pointer">
                Sign Out
              </button>
            </div>
          )}

          {/* Attribution Credit */}
          <div className="pt-3 text-center text-[10px] text-slate-500 font-mono">
            <a 
              href="https://www.linkedin.com/in/soutrik-dutta-245b93372"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-[#0a66c2] transition-colors hover:underline underline-offset-2"
              title="Soutrik Dutta's LinkedIn Profile"
            >
              made by :- soutrik_2006
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}