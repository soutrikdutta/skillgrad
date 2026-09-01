import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Briefcase, Award } from 'lucide-react';

export default function Hero() {
  const { openAuthModal } = useAuth();

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const topOffset = 80;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - topOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[300px] bg-gradient-to-tr from-primary-600/25 via-indigo-600/20 to-cyan-500/20 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-primary-500/30 text-xs font-semibold text-slate-200 mb-6 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-primary-400" />
          <span>Bridging Skills & Industry</span>
          <span className="text-slate-500">•</span>
          <span className="text-emerald-400 font-medium">100% Paid Projects</span>
        </div>

        {/* Crisp Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold font-display tracking-tight text-white leading-[1.1]">
          Turn Your Skills Into{' '}
          <span className="gradient-text">Paid Experience</span>
        </h1>

        {/* Short Subtitle */}
        <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-xl mx-auto font-normal leading-relaxed">
          Connect with real industry projects, earn verified credentials, and launch your career with top tech companies.
        </p>

        {/* Action CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => scrollTo('opportunities')}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-xl shadow-indigo-600/25 transition-all duration-200 hover:scale-[1.02] flex items-center gap-2"
          >
            Explore Internships
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => scrollTo('portals')}
            className="px-7 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white font-semibold text-sm transition-all"
          >
            Post a Project / Hire
          </button>
        </div>

        {/* Stats Row */}
        <div className="mt-14 pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold font-display text-white">1,200+</div>
            <div className="text-xs text-slate-400 mt-0.5">Internships Funded</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold font-display text-primary-400">3,500+</div>
            <div className="text-xs text-slate-400 mt-0.5">Active Students</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold font-display text-cyan-400">150+</div>
            <div className="text-xs text-slate-400 mt-0.5">Partner Startups</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold font-display text-emerald-400">100%</div>
            <div className="text-xs text-slate-400 mt-0.5">Verified Stipends</div>
          </div>
        </div>

      </div>
    </section>
  );
}