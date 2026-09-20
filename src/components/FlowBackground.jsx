import React from 'react';

export default function FlowBackground({ theme = 'student' }) {
  const isCompany = theme === 'company';

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 will-change-transform">
      {/* 1. Deep Atmospheric Mesh Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.14]" />

      {/* 2. Primary Massive Flowing Aurora Orb (Top-Center / Left) */}
      <div 
        className={`absolute -top-32 -left-16 w-[450px] h-[450px] sm:w-[750px] sm:h-[750px] rounded-full filter blur-[70px] sm:blur-[130px] opacity-40 mix-blend-screen animate-aurora-1 will-change-transform ${
          isCompany 
            ? 'bg-gradient-to-tr from-cyan-600/30 via-teal-500/20 to-blue-600/30' 
            : 'bg-gradient-to-tr from-indigo-600/35 via-purple-600/25 to-blue-600/30'
        }`} 
        style={{ transform: 'translate3d(0,0,0)' }}
      />

      {/* 3. Secondary Massive Flowing Aurora Orb (Mid-Right) */}
      <div 
        className={`absolute top-1/4 -right-24 w-[400px] h-[400px] sm:w-[650px] sm:h-[650px] rounded-full filter blur-[70px] sm:blur-[130px] opacity-35 mix-blend-screen animate-aurora-2 will-change-transform ${
          isCompany 
            ? 'bg-gradient-to-bl from-blue-500/30 via-cyan-400/20 to-emerald-500/25' 
            : 'bg-gradient-to-bl from-violet-600/35 via-fuchsia-600/20 to-indigo-500/30'
        }`} 
        style={{ transform: 'translate3d(0,0,0)' }}
      />

      {/* 4. Bottom Tertiary Counter-Flowing Orb */}
      <div 
        className={`absolute -bottom-32 left-1/4 w-[420px] h-[420px] sm:w-[700px] sm:h-[700px] rounded-full filter blur-[80px] sm:blur-[140px] opacity-30 mix-blend-screen animate-aurora-3 will-change-transform ${
          isCompany 
            ? 'bg-gradient-to-r from-teal-500/20 via-sky-600/25 to-cyan-500/20' 
            : 'bg-gradient-to-r from-blue-700/25 via-indigo-600/30 to-violet-800/25'
        }`} 
        style={{ transform: 'translate3d(0,0,0)' }}
      />

      {/* 5. Flowing Light Rays / Horizon Glow */}
      <div className="absolute top-0 left-0 right-0 h-[240px] bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />

      {/* 6. Dynamic Floating Stardust Particles */}
      <div className="absolute inset-0 opacity-40">
        <div className="particle particle-1" />
        <div className="particle particle-2" />
        <div className="particle particle-3" />
        <div className="particle particle-4" />
        <div className="particle particle-5" />
      </div>
    </div>
  );
}
