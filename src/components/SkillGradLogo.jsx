import React, { useState } from 'react';

export default function SkillGradLogo({ className = "h-9 w-auto", showText = true, textClassName = "text-xl font-bold font-display" }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="flex items-center gap-3 select-none">
      {!imgError ? (
        <img
          src="/skillgrad-logo.png"
          alt="SkillGrad Logo"
          className={`${className} object-contain transition-transform duration-300 hover:scale-105`}
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-primary-600 to-purple-600 shadow-lg shadow-indigo-500/25">
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5" />
          </svg>
        </div>
      )}
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`${textClassName} tracking-tight text-white flex items-center gap-1`}>
            Skill<span className="text-primary-400 font-extrabold">Grad</span>
          </span>
          <span className="text-[10px] tracking-widest uppercase font-semibold text-slate-400">
            Skills to Industry
          </span>
        </div>
      )}
    </div>
  );
}