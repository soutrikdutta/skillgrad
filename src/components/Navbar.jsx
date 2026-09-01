import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import SkillGradLogo from './SkillGradLogo';
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  GraduationCap, 
  Building2, 
  Briefcase, 
  Award, 
  HelpCircle, 
  Mail,
  RefreshCw
} from 'lucide-react';

export default function Navbar({ currentRole = 'student', onSwitchRole }) {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isCompany = currentRole === 'company';

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

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#06090F]/80 backdrop-blur-2xl border-b border-white/10 transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <a href="#" className="flex items-center gap-2 group">
            <SkillGradLogo className="h-9 w-auto" textClassName="text-xl font-bold font-display tracking-tight" />
          </a>

          {/* Active Role Indicator Pill */}
          <div className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider backdrop-blur-md ${
            isCompany 
              ? 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-300' 
              : 'bg-indigo-500/15 border border-indigo-500/30 text-primary-300'
          }`}>
            {isCompany ? <Building2 className="w-3.5 h-3.5" /> : <GraduationCap className="w-3.5 h-3.5" />}
            <span>{isCompany ? 'Employer Portal' : 'Student Portal'}</span>
          </div>
        </div>

        {/* Role-Specific Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-300">
          {!isCompany ? (
            // Student Navigation Links
            <>
              <button onClick={() => scrollTo('opportunities')} className="hover:text-white transition-colors cursor-pointer">
                Internships
              </button>
              <button onClick={() => scrollTo('talent-pool')} className="hover:text-white transition-colors cursor-pointer">
                Student Profile
              </button>
              <button onClick={() => scrollTo('certifications')} className="hover:text-white transition-colors cursor-pointer">
                Verify Certificate
              </button>
              <button onClick={() => scrollTo('faq')} className="hover:text-white transition-colors cursor-pointer">
                FAQ
              </button>
              <button onClick={() => scrollTo('contact')} className="hover:text-white transition-colors cursor-pointer">
                Contact
              </button>
            </>
          ) : (
            // Company Navigation Links
            <>
              <button onClick={() => scrollTo('company-dashboard')} className="hover:text-white transition-colors cursor-pointer font-semibold text-cyan-300">
                Recruitment Dashboard
              </button>
              <button onClick={() => scrollTo('contact')} className="hover:text-white transition-colors cursor-pointer">
                Support
              </button>
            </>
          )}
        </nav>

        {/* User Account Strip */}
        <div className="hidden md:flex items-center gap-3">
          {/* Switch Role Button */}
          {onSwitchRole && (
            <button
              onClick={onSwitchRole}
              title="Switch between Student and Employer portal"
              className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3 text-slate-400" />
              <span>Switch Portal</span>
            </button>
          )}

          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-white/10">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
              </div>
              <button
                onClick={logout}
                title="Sign Out"
                className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onSwitchRole}
              className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 cursor-pointer"
            >
              Sign In
            </button>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-400 hover:text-white glass-panel"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-t border-white/10 px-4 py-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {isCompany ? 'Employer Portal' : 'Student Portal'}
            </span>
            {onSwitchRole && (
              <button onClick={onSwitchRole} className="text-xs text-primary-400 font-semibold">
                Switch Role →
              </button>
            )}
          </div>

          <div className="flex flex-col space-y-3 text-xs font-semibold">
            {!isCompany ? (
              <>
                <button onClick={() => scrollTo('opportunities')} className="text-left text-slate-200">Internships</button>
                <button onClick={() => scrollTo('talent-pool')} className="text-left text-slate-200">Student Profile</button>
                <button onClick={() => scrollTo('certifications')} className="text-left text-slate-200">Verify Certificate</button>
                <button onClick={() => scrollTo('faq')} className="text-left text-slate-200">FAQ</button>
                <button onClick={() => scrollTo('contact')} className="text-left text-slate-200">Contact</button>
              </>
            ) : (
              <>
                <button onClick={() => scrollTo('company-dashboard')} className="text-left text-cyan-300">Recruitment Dashboard</button>
                <button onClick={() => scrollTo('contact')} className="text-left text-slate-200">Support</button>
              </>
            )}
          </div>

          {user && (
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-slate-300 truncate">{user.email}</span>
              <button onClick={logout} className="text-xs text-rose-400 font-semibold">Sign Out</button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}