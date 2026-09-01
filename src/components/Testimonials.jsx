import React from 'react';
import { TESTIMONIALS } from '../data/mockData';
import { Star, MessageSquareQuote } from 'lucide-react';

export default function Testimonials() {
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-xs font-semibold text-primary-400 mb-3">
            <MessageSquareQuote className="w-3.5 h-3.5" />
            Success Stories
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
            Trusted by Learners & Industry Leaders
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Hear from students who launched careers and hiring managers who scaled their teams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="glass-panel p-6 sm:p-7 rounded-2xl flex flex-col justify-between border-slate-800 hover:border-slate-700 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-primary-300 border border-slate-700">
                    {t.tag}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                  "{t.content}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-primary-500/30"
                />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">{t.name}</h4>
                  <p className="text-[11px] text-primary-400 font-medium">{t.role}</p>
                  <p className="text-[10px] text-slate-400">{t.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}