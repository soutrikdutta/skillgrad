import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, UserPlus, ShieldCheck } from 'lucide-react';

export default function GoogleAccountModal({ isOpen, onClose }) {
  const { handleSelectGoogleAccount } = useAuth();
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  if (!isOpen) return null;

  const accounts = [
    {
      name: 'Soutrik Mukherjee',
      email: '2006soutrik@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
    },
    {
      name: 'SkillGrad Scholar',
      email: 'student.scholar@skillgrad.edu',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    }
  ];

  const chooseAccount = (acc) => {
    handleSelectGoogleAccount({
      uid: 'google-' + Math.random().toString(36).substring(2, 9),
      displayName: acc.name,
      email: acc.email,
      photoURL: acc.avatar,
      provider: 'google.com'
    });
    onClose();
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customEmail) return;
    handleSelectGoogleAccount({
      uid: 'google-' + Math.random().toString(36).substring(2, 9),
      displayName: customName || customEmail.split('@')[0],
      email: customEmail,
      photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      provider: 'google.com'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-sm bg-white text-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Google Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.6 3.6 1.7 7.4l3.7 2.9C6.3 7.3 8.9 5 12 5z" />
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
              <path fill="#FBBC05" d="M5.4 14.7c-.2-.7-.4-1.5-.4-2.4s.2-1.7.4-2.4L1.7 7C.6 9.2 0 10.6 0 12.3s.6 3.1 1.7 5.3l3.7-2.9z" />
              <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.7-2.3-6.6-5.3L1.7 16.4C3.6 20.2 7.4 23.5 12 23.5z" />
            </svg>
            <span className="text-sm font-semibold text-slate-700">Sign in with Google</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-4">
          <h4 className="text-base font-bold text-slate-900 mb-1">Choose an account</h4>
          <p className="text-xs text-slate-500 mb-4">to continue to SkillGrad</p>

          {/* Account list */}
          <div className="space-y-2">
            {accounts.map((acc, i) => (
              <button
                key={i}
                onClick={() => chooseAccount(acc)}
                className="w-full flex items-center gap-3 p-3 rounded-2xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all text-left group"
              >
                <img src={acc.avatar} alt={acc.name} className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600 truncate">{acc.name}</div>
                  <div className="text-[11px] text-slate-500 truncate">{acc.email}</div>
                </div>
              </button>
            ))}

            {!showCustom ? (
              <button
                onClick={() => setShowCustom(true)}
                className="w-full flex items-center gap-3 p-3 rounded-2xl border border-dashed border-slate-300 hover:border-slate-400 text-slate-600 hover:text-slate-900 text-xs font-semibold transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                  <UserPlus className="w-4 h-4 text-slate-500" />
                </div>
                Use another Google email
              </button>
            ) : (
              <form onSubmit={handleCustomSubmit} className="pt-2 space-y-2 border-t border-slate-100 mt-2">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500"
                />
                <input
                  type="email"
                  required
                  placeholder="your.google.email@gmail.com"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold"
                >
                  Sign in with this Email
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>SkillGrad uses secure Google Identity Services</span>
        </div>
      </div>
    </div>
  );
}