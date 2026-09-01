import React from 'react';
import SkillGradLogo from './SkillGradLogo';
import { GraduationCap, Building2, ArrowRight, Sparkles, ShieldCheck, CheckCircle2, Users, Briefcase } from 'lucide-react';

export default function RoleSelectScreen({ onSelectRole, onContinueAsGuest }) {
  return (
    <div className="min-h-screen bg-[#06090F] text-slate-100 flex flex-col justify-center items-center px-4 sm:px-6 py-12 relative overflow-hidden selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-gradient-to-tr from-primary-600/20 via-indigo-600/15 to-cyan-500/15 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-2xl text-center">
        
        {/* Brand Header */}
        <div className="mb-10">
          <div className="flex justify-center mb-4">
            <SkillGradLogo className="h-12 w-auto" textClassName="text-2xl font-bold font-display" />
          </div>
          
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-900/80 border border-primary-500/30 text-xs font-semibold text-primary-300 mb-4 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-primary-400" />
            <span>Welcome to SkillGrad</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-white tracking-tight">
            How would you like to continue?
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-md mx-auto">
            Choose your journey to access tailored opportunities, tools, and verification.
          </p>
        </div>

        {/* Two Role Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
          
          {/* Card 1: Student */}
          <div 
            onClick={() => onSelectRole('student')}
            className="glass-panel-interactive p-7 rounded-3xl cursor-pointer group flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <GraduationCap className="w-24 h-24 text-primary-400" />
            </div>

            <div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5 shadow-lg shadow-indigo-600/25 mb-6">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <GraduationCap className="w-7 h-7 text-primary-400 group-hover:scale-110 transition-transform" />
                </div>
              </div>

              <div className="inline-block px-2.5 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-[10px] font-bold text-primary-300 uppercase tracking-wider mb-2">
                For Learners
              </div>

              <h3 className="text-xl font-bold font-display text-white group-hover:text-primary-300 transition-colors">
                I am a Student
              </h3>

              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Discover paid industry internships, work on live projects, and earn tamper-proof credentials.
              </p>

              <div className="mt-4 space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Explore paid openings</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>1-Click fast applications</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-primary-400 group-hover:text-primary-300">
              <span>Continue as Student</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Card 2: Hiring Partner / Company */}
          <div 
            onClick={() => onSelectRole('company')}
            className="glass-panel-interactive p-7 rounded-3xl cursor-pointer group flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <Building2 className="w-24 h-24 text-cyan-400" />
            </div>

            <div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 p-0.5 shadow-lg shadow-cyan-600/25 mb-6">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <Building2 className="w-7 h-7 text-cyan-400 group-hover:scale-110 transition-transform" />
                </div>
              </div>

              <div className="inline-block px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-[10px] font-bold text-cyan-300 uppercase tracking-wider mb-2">
                For Employers
              </div>

              <h3 className="text-xl font-bold font-display text-white group-hover:text-cyan-300 transition-colors">
                I am a Hiring Partner
              </h3>

              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Post paid internship requirements, hire pre-vetted student talent, and evaluate production code.
              </p>

              <div className="mt-4 space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Post roles visible to all students</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Receive student applications</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-cyan-400 group-hover:text-cyan-300">
              <span>Continue as Hiring Partner</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

        </div>

        {/* Guest fallback */}
        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={onContinueAsGuest}
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            Just exploring? Continue as Guest →
          </button>
        </div>

      </div>
    </div>
  );
}