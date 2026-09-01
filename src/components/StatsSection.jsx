import React from 'react';
import { STATS_DATA } from '../data/mockData';
import { Briefcase, GraduationCap, Building2, Code2, TrendingUp } from 'lucide-react';

const iconMap = {
  Briefcase,
  GraduationCap,
  Building2,
  Code2
};

export default function StatsSection() {
  return (
    <section className="py-16 bg-slate-950/60 border-y border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-primary-400 mb-3">
            <TrendingUp className="w-3.5 h-3.5" />
            Impact & Growth
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Our Numbers Speak for Themselves
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Bridging talent with real opportunities across India and global remote ecosystems.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {STATS_DATA.map((item, idx) => {
            const Icon = iconMap[item.icon] || Briefcase;
            return (
              <div 
                key={idx}
                className="glass-panel p-6 rounded-2xl border-slate-800 hover:border-slate-700 transition-all duration-300 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Icon className="w-16 h-16 text-primary-400" />
                </div>
                
                <div className="w-10 h-10 rounded-xl bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-primary-400" />
                </div>

                <div className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
                  {item.value}
                </div>

                <div className="text-sm font-semibold text-slate-200 mt-1">
                  {item.label}
                </div>

                <div className="text-[11px] font-medium text-emerald-400 mt-2 flex items-center gap-1">
                  <span>●</span> {item.change}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}