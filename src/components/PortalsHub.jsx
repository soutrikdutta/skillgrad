import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { dbService } from '../firebase/dbService';
import confetti from 'canvas-confetti';
import { GraduationCap, Building2, UserCheck, PlusCircle, CheckCircle2, ArrowRight, AlertCircle } from 'lucide-react';

export default function PortalsHub() {
  const { user, addToast } = useAuth();
  const [activeTab, setActiveTab] = useState('student'); // 'student' | 'company'

  // Student form state
  const [sName, setSName] = useState('');
  const [sEmail, setSEmail] = useState('');
  const [sCollege, setSCollege] = useState('');
  const [sDomain, setSDomain] = useState('Web Development');
  const [sSkills, setSSkills] = useState('');
  const [sPortfolio, setSPortfolio] = useState('');
  const [sSubmitting, setSSubmitting] = useState(false);
  const [sDone, setSDone] = useState(false);
  const [sError, setSError] = useState('');

  // Company form state
  const [cName, setCName] = useState('');
  const [cEmail, setCEmail] = useState('');
  const [cTitle, setCTitle] = useState('');
  const [cDomain, setCDomain] = useState('Web Development');
  const [cStipend, setCStipend] = useState('₹20,000 / month');
  const [cDuration, setCDuration] = useState('3 Months');
  const [cLocation, setCLocation] = useState('Remote');
  const [cSkills, setCSkills] = useState('');
  const [cDesc, setCDesc] = useState('');
  const [cSubmitting, setCSubmitting] = useState(false);
  const [cDone, setCDone] = useState(false);
  const [cError, setCError] = useState('');

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

  const validateCompany = () => {
    if (!cName.trim() || cName.trim().length < 2) {
      setCError('Please enter your company / startup name.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cEmail.trim() || !emailRegex.test(cEmail.trim())) {
      setCError('Please enter a valid company contact email.');
      return false;
    }
    if (!cTitle.trim() || cTitle.trim().length < 3) {
      setCError('Please enter a valid internship title.');
      return false;
    }
    if (!cStipend.trim()) {
      setCError('Please provide a stipend amount or range.');
      return false;
    }
    if (!cSkills.trim()) {
      setCError('Please specify required skills.');
      return false;
    }
    if (!cDesc.trim() || cDesc.trim().length < 10) {
      setCError('Please provide a brief description (min 10 characters).');
      return false;
    }
    return true;
  };

  const handleCompanySubmit = async (e) => {
    e.preventDefault();
    setCError('');

    if (!validateCompany()) {
      addToast('Please complete all required fields.', 'error');
      return;
    }

    setCSubmitting(true);
    try {
      await dbService.postInternship({
        company: cName.trim(),
        contactEmail: cEmail.trim(),
        title: cTitle.trim(),
        domain: cDomain,
        stipend: cStipend.trim(),
        duration: cDuration,
        location: cLocation.trim(),
        skills: cSkills.split(',').map(s => s.trim()).filter(Boolean),
        description: cDesc.trim()
      });
      setCDone(true);
      confetti({ particleCount: 75, spread: 70 });
      addToast('Internship opening published and added to Featured Opportunities!', 'success');
    } catch {
      addToast('Error publishing role', 'error');
    } finally {
      setCSubmitting(false);
    }
  };

  const scrollToOpportunities = () => {
    const el = document.getElementById('opportunities');
    if (el) {
      const topOffset = 80;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - topOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <section id="portals" className="py-20 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold font-display text-white">
            Join the SkillGrad Ecosystem
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Register your student profile or post an internship for immediate listing.
          </p>

          {/* Segmented Tab Switcher */}
          <div className="inline-flex p-1.5 rounded-2xl glass-panel mt-6">
            <button
              onClick={() => setActiveTab('student')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === 'student'
                  ? 'bg-primary-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              For Students
            </button>
            <button
              onClick={() => setActiveTab('company')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === 'company'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Building2 className="w-4 h-4" />
              For Companies
            </button>
          </div>
        </div>

        {/* Tab 1: For Students */}
        {activeTab === 'student' && (
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
                    <label className="block text-xs font-semibold text-slate-300 mb-1">College / University *</label>
                    <input
                      type="text"
                      required
                      value={sCollege}
                      onChange={(e) => { setSCollege(e.target.value); setSError(''); }}
                      placeholder="e.g. Delhi University / VIT"
                      className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs sm:text-sm"
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
        )}

        {/* Tab 2: For Companies */}
        {activeTab === 'company' && (
          <div className="glass-panel p-6 sm:p-8 rounded-3xl shadow-2xl animate-fadeIn">
            {cDone ? (
              <div className="text-center py-6 space-y-4">
                <CheckCircle2 className="w-12 h-12 text-cyan-400 mx-auto" />
                <h3 className="text-xl font-bold text-white">Opening Published & Live!</h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  Your internship for <strong className="text-white">{cTitle}</strong> at <strong className="text-white">{cName}</strong> is now live at the top of the Opportunities section!
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    onClick={scrollToOpportunities}
                    className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-cyan-600/20"
                  >
                    View Live in Opportunities List
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setCDone(false);
                      setCTitle('');
                      setCDesc('');
                    }}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white"
                  >
                    Post Another Role
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCompanySubmit} className="space-y-4" noValidate>
                {cError && (
                  <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{cError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Company Name *</label>
                    <input
                      type="text"
                      required
                      value={cName}
                      onChange={(e) => { setCName(e.target.value); setCError(''); }}
                      placeholder="e.g. Acme Tech Labs"
                      className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Work Email *</label>
                    <input
                      type="email"
                      required
                      value={cEmail}
                      onChange={(e) => { setCEmail(e.target.value); setCError(''); }}
                      placeholder="hiring@acme.com"
                      className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs sm:text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Internship Title *</label>
                    <input
                      type="text"
                      required
                      value={cTitle}
                      onChange={(e) => { setCTitle(e.target.value); setCError(''); }}
                      placeholder="e.g. Full Stack Web Developer Intern"
                      className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Domain</label>
                    <select
                      value={cDomain}
                      onChange={(e) => setCDomain(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl glass-input text-xs"
                    >
                      <option value="Web Development" className="bg-slate-900 text-white">Web Development</option>
                      <option value="AI / Machine Learning" className="bg-slate-900 text-white">AI / Machine Learning</option>
                      <option value="UI / UX Design" className="bg-slate-900 text-white">UI / UX Design</option>
                      <option value="Data Science" className="bg-slate-900 text-white">Data Science</option>
                      <option value="Cloud & DevOps" className="bg-slate-900 text-white">Cloud & DevOps</option>
                      <option value="Mobile App Dev" className="bg-slate-900 text-white">Mobile App Dev</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Stipend *</label>
                    <input
                      type="text"
                      required
                      value={cStipend}
                      onChange={(e) => { setCStipend(e.target.value); setCError(''); }}
                      placeholder="₹25,000 / month"
                      className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Duration</label>
                    <select
                      value={cDuration}
                      onChange={(e) => setCDuration(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl glass-input text-xs"
                    >
                      <option value="3 Months" className="bg-slate-900 text-white">3 Months</option>
                      <option value="6 Months" className="bg-slate-900 text-white">6 Months</option>
                      <option value="Flexible" className="bg-slate-900 text-white">Flexible</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Location</label>
                    <input
                      type="text"
                      value={cLocation}
                      onChange={(e) => setCLocation(e.target.value)}
                      placeholder="Remote / Bangalore"
                      className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Required Skills * (comma separated)</label>
                  <input
                    type="text"
                    required
                    value={cSkills}
                    onChange={(e) => { setCSkills(e.target.value); setCError(''); }}
                    placeholder="e.g. React, Node.js, PostgreSQL, Tailwind"
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Project Description * (min. 10 characters)</label>
                  <textarea
                    rows="3"
                    required
                    value={cDesc}
                    onChange={(e) => { setCDesc(e.target.value); setCError(''); }}
                    placeholder="Brief description of the project deliverables and scope..."
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs sm:text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={cSubmitting}
                  className="w-full py-3.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shadow-lg shadow-cyan-600/25 flex items-center justify-center gap-2 mt-2 disabled:opacity-60 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  {cSubmitting ? 'Publishing...' : 'Publish Internship & Add to Live Marketplace'}
                </button>
              </form>
            )}
          </div>
        )}

      </div>
    </section>
  );
}