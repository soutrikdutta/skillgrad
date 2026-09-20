import React from 'react';
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Award } from 'lucide-react';

export default function Hero() {
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
    <section className="relative pt-24 pb-14 sm:pt-32 sm:pb-20 md:pt-36 md:pb-24 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Animated Badge with Pulsing Beacon */}
        <div className="animate-bounce-in inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/85 border border-indigo-500/25 text-[13px] sm:text-xs font-semibold text-slate-200 mb-6 shadow-lg shadow-indigo-500/10">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Bridging Skills & Industry</span>
          <span className="text-slate-600">•</span>
          <span className="text-emerald-400 font-medium">100% Paid Stipends</span>
          <span className="hidden sm:inline text-slate-600">•</span>
          <span className="hidden sm:inline text-[11px] text-slate-400 font-mono">made by :- soutrik_2006</span>
        </div>

        {/* Headline with Continuous Flowing Gradient */}
        <h1 className="animate-scale-in text-3xl sm:text-5xl md:text-7xl font-black font-display tracking-tight text-white leading-[1.08]">
          Turn Your Skills Into{' '}
          <span className="flow-gradient-text block sm:inline mt-1 sm:mt-0">
            Paid Experience
          </span>
        </h1>

        {/* Animated Flow Light Beam Under Headline */}
        <div className="w-32 sm:w-48 h-[2px] mx-auto my-5 flow-beam-h" />

        {/* Subtitle */}
        <p className="text-[15px] sm:text-base md:text-lg text-slate-300 max-w-xl mx-auto font-normal leading-relaxed animate-slide-up" style={{ animationDelay: '0.15s' }}>
          Connect with active industry projects, earn tamper-proof verified credentials, and accelerate your tech career.
        </p>

        {/* CTAs */}
        <div className="mt-7 sm:mt-9 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 animate-slide-up" style={{ animationDelay: '0.25s' }}>
          <button
            onClick={() => scrollTo('opportunities')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.97] group"
          >
            <span>Explore Internships</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            onClick={() => scrollTo('my-applications')}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl glass-panel-interactive border border-white/[0.1] hover:border-indigo-500/40 text-slate-200 hover:text-white font-semibold text-sm transition-all duration-300 cursor-pointer active:scale-[0.97]"
          >
            Track My Applications
          </button>
        </div>

        {/* Value Props */}
        <div className="mt-10 sm:mt-14 pt-6 sm:pt-8 border-t border-white/[0.06] stagger-children flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-12 text-[13px] sm:text-xs text-slate-400">
          <div className="flex items-center gap-2 hover:text-white transition-colors duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Guaranteed Stipends</span>
          </div>
          <div className="flex items-center gap-2 hover:text-white transition-colors duration-200">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>Verified Credentials</span>
          </div>
          <div className="flex items-center gap-2 hover:text-white transition-colors duration-200">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Direct PPO Pathways</span>
          </div>
        </div>

      </div>
    </section>
  );
}