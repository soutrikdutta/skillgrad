import React from 'react';
import { Target, Compass, Sparkles, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export default function AboutUs() {
  return (
    <section id="about" className="py-24 bg-slate-950/40 relative border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-xs font-semibold text-primary-400">
              <Compass className="w-3.5 h-3.5" />
              About SkillGrad
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-white tracking-tight leading-tight">
              Transforming Ambition into <span className="gradient-text">Industry Impact</span>
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              Traditional college curriculums often stop at theoretical textbooks. SkillGrad was created to bridge this divide by immersing aspiring engineers, designers, and tech innovators directly into high-impact, paid commercial assignments.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                <Target className="w-5 h-5 text-primary-400 mb-2" />
                <h4 className="text-sm font-bold text-white">Our Mission</h4>
                <p className="text-xs text-slate-400 mt-1">To ensure every student earns practical experience and financial compensation before stepping into the job market.</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                <Zap className="w-5 h-5 text-cyan-400 mb-2" />
                <h4 className="text-sm font-bold text-white">Our Vision</h4>
                <p className="text-xs text-slate-400 mt-1">To build the world's most trusted proof-of-work talent pipeline connecting ambitious learners with high-growth companies.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary-600 via-cyan-500 to-purple-600 opacity-30 blur-xl" />
              <div className="relative glass-panel p-6 sm:p-8 rounded-2xl border-slate-700/80 space-y-6">
                <h3 className="text-xl font-bold font-display text-white">The SkillGrad Standard</h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-slate-200">Strict Quality Vetting</h4>
                      <p className="text-xs text-slate-400">Partner companies are vetted to ensure genuine mentorship and productive work assignments.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-slate-200">Zero Unpaid Exploitation</h4>
                      <p className="text-xs text-slate-400">We mandate competitive stipends on commercial project deliverables.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-slate-200">Permanent Proof-of-Skill</h4>
                      <p className="text-xs text-slate-400">Verifiable tamper-proof certificates that give your resume permanent credibility.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}