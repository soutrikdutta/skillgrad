import React from 'react';
import { DollarSign, Cpu, Award } from 'lucide-react';

export default function Features() {
  const pillars = [
    {
      icon: DollarSign,
      title: 'Real Paid Internships',
      desc: 'Gain practical experience with guaranteed monthly stipends on real commercial deliverables.',
      accent: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
    },
    {
      icon: Cpu,
      title: 'AI Skill Matching',
      desc: 'Smart algorithms pair your specific tech stack directly to active startup and enterprise projects.',
      accent: 'border-primary-500/30 text-primary-400 bg-primary-500/10'
    },
    {
      icon: Award,
      title: 'Verified Credentials',
      desc: 'Receive tamper-proof, QR-verifiable certificates with lifetime authenticity for your resume.',
      accent: 'border-amber-500/30 text-amber-400 bg-amber-500/10'
    }
  ];

  return (
    <section id="features" className="py-12 sm:py-16 bg-slate-950/40 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 stagger-children">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="glass-panel-interactive p-6 sm:p-7 rounded-3xl group transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border mb-4 transition-transform duration-300 group-hover:scale-110 ${p.accent}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold font-display text-white mb-2 group-hover:text-indigo-200 transition-colors">{p.title}</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}