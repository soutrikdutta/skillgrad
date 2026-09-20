import React, { useState } from 'react';
import { dbService } from '../firebase/dbService';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import CollegeSearchInput from './CollegeSearchInput';
import { GraduationCap, UserCheck, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export default function StudentTalentPool() {
  const { user, addToast } = useAuth();
  const [sName, setSName] = useState(user?.displayName || '');
  const [sEmail, setSEmail] = useState(user?.email || '');
  const [sCollege, setSCollege] = useState('');
  const [sDomain, setSDomain] = useState('Web Development');
  const [sSkills, setSSkills] = useState('');
  const [sPortfolio, setSPortfolio] = useState('');
  const [sSubmitting, setSSubmitting] = useState(false);
  const [sDone, setSDone] = useState(false);
  const [sError, setSError] = useState('');

  const validateStudent = () => {
    if (!sName.trim() || sName.trim().length < 2) {
      setSError('Please enter your full name (at least 2 characters).');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!sEmail.trim() || !emailRegex.test(sEmail.trim())) {
      setSError('Please enter a valid email address.');
      return false;
    }
    if (!sCollege.trim()) {
      setSError('Please enter your College or University name.');
      return false;
    }
    if (!sSkills.trim()) {
      setSError('Please list at least one skill.');
      return false;
    }
    return true;
  };

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    setSError('');

    if (!validateStudent()) {
      addToast('Please complete all required fields.', 'error');
      return;
    }

    setSSubmitting(true);
    try {
      await dbService.submitApplication({
        type: 'student_profile',
        name: sName.trim(),
        email: sEmail.trim(),
        college: sCollege.trim(),
        domain: sDomain,
        skills: sSkills.split(',').map(s => s.trim()).filter(Boolean),
        portfolioUrl: sPortfolio.trim()
      });
      setSDone(true);
      confetti({ particleCount: 60, spread: 60 });
      addToast('Profile added to Talent Pool!', 'success');
    } catch {
      addToast('Error saving profile', 'error');
    } finally {
      setSSubmitting(false);
    }
  };

  return (
    <section id="talent-pool" className="py-20 relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary-500/10 border border-primary-500/30 text-xs font-semibold text-primary-400 mb-3 backdrop-blur-md">
            <GraduationCap className="w-3.5 h-3.5" />
            Student Talent Pool
          </div>
          <h2 className="text-3xl font-extrabold font-display text-white">
            Register Your Candidate Profile
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Let hiring startups and verified companies discover your skills and invite you directly for internships.
          </p>
        </div>

        {/* Student Form Box */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl shadow-2xl animate-fadeIn">
          {sDone ? (
            <div className="text-center py-6 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-xl font-bold text-white">Profile Registered!</h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Your profile has been added to our talent matching pipeline. We will notify you when opportunities match your skills.
              </p>
              <button
                onClick={() => setSDone(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white"
              >
                Edit Information
              </button>
            </div>
          ) : (
            <form onSubmit={handleStudentSubmit} className="space-y-4" noValidate>
              {sError && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{sError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={sName}
                    onChange={(e) => { setSName(e.target.value); setSError(''); }}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={sEmail}
                    onChange={(e) => { setSEmail(e.target.value); setSError(''); }}
                    placeholder="aarav@college.edu"
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <CollegeSearchInput
                    value={sCollege}
                    onChange={(val) => { setSCollege(val); setSError(''); }}
                    required
                    error={sError && !sCollege.trim() ? sError : ''}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Preferred Track</label>
                  <select
                    value={sDomain}
                    onChange={(e) => setSDomain(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl glass-input text-xs"
                  >
                    <option value="AI / Machine Learning" className="bg-slate-900 text-white">AI / Machine Learning</option>
                    <option value="Web Development" className="bg-slate-900 text-white">Web Development</option>
                    <option value="UI / UX Design" className="bg-slate-900 text-white">UI / UX Design</option>
                    <option value="Data Science" className="bg-slate-900 text-white">Data Science</option>
                    <option value="Cloud & DevOps" className="bg-slate-900 text-white">Cloud & DevOps</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Key Skills * (comma separated)</label>
                  <input
                    type="text"
                    required
                    value={sSkills}
                    onChange={(e) => { setSSkills(e.target.value); setSError(''); }}
                    placeholder="React, Python, Tailwind, SQL"
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">GitHub / Portfolio URL</label>
                  <input
                    type="url"
                    value={sPortfolio}
                    onChange={(e) => setSPortfolio(e.target.value)}
                    placeholder="https://github.com/yourhandle"
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs sm:text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={sSubmitting}
                className="w-full py-3.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 mt-2 disabled:opacity-60 cursor-pointer"
              >
                <UserCheck className="w-4 h-4" />
                {sSubmitting ? 'Registering...' : 'Join Student Talent Pool'}
              </button>
            </form>
          )}
        </div>

      </div>
    </section>
  );
}