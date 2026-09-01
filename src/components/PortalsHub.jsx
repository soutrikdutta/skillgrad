import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { dbService } from '../firebase/dbService';
import confetti from 'canvas-confetti';
import { GraduationCap, Building2, UserCheck, PlusCircle, CheckCircle2, ArrowRight } from 'lucide-react';

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

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    if (!sName || !sEmail) return addToast('Please enter your name and email', 'error');
    setSSubmitting(true);
    try {
      await dbService.submitApplication({
        type: 'student_profile',
        name: sName,
        email: sEmail,
        college: sCollege,
        domain: sDomain,
        skills: sSkills.split(',').map(s => s.trim()).filter(Boolean),
        portfolioUrl: sPortfolio
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

  const handleCompanySubmit = async (e) => {
    e.preventDefault();
    if (!cName || !cEmail || !cTitle) return addToast('Please fill required fields', 'error');
    setCSubmitting(true);
    try {
      await dbService.postInternship({
        company: cName,
        contactEmail: cEmail,
        title: cTitle,
        domain: cDomain,
        stipend: cStipend,
        duration: cDuration,
        location: cLocation,
        skills: cSkills.split(',').map(s => s.trim()).filter(Boolean),
        description: cDesc
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
          <div className="inline-flex p-1.5 rounded-2xl bg-slate-900 border border-slate-800 mt-6 shadow-lg">
            <button
              onClick={() => setActiveTab('student')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
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
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
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
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border-slate-700/80 shadow-2xl animate-fadeIn">
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
              <form onSubmit={handleStudentSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={sName}
                      onChange={(e) => setSName(e.target.value)}
                      placeholder="e.g. Aarav Sharma"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={sEmail}
                      onChange={(e) => setSEmail(e.target.value)}
                      placeholder="aarav@college.edu"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-primary-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">College / University</label>
                    <input
                      type="text"
                      value={sCollege}
                      onChange={(e) => setSCollege(e.target.value)}
                      placeholder="e.g. Delhi University / VIT"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Preferred Track</label>
                    <select
                      value={sDomain}
                      onChange={(e) => setSDomain(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white text-xs focus:outline-none focus:border-primary-500"
                    >
                      <option value="AI / Machine Learning">AI / Machine Learning</option>
                      <option value="Web Development">Web Development</option>
                      <option value="UI / UX Design">UI / UX Design</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Cloud & DevOps">Cloud & DevOps</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Key Skills (comma separated)</label>
                    <input
                      type="text"
                      value={sSkills}
                      onChange={(e) => setSSkills(e.target.value)}
                      placeholder="React, Python, Tailwind, SQL"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">GitHub / Portfolio URL</label>
                    <input
                      type="url"
                      value={sPortfolio}
                      onChange={(e) => setSPortfolio(e.target.value)}
                      placeholder="https://github.com/yourhandle"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-primary-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={sSubmitting}
                  className="w-full py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
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
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border-slate-700/80 shadow-2xl animate-fadeIn">
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
              <form onSubmit={handleCompanySubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Company Name *</label>
                    <input
                      type="text"
                      required
                      value={cName}
                      onChange={(e) => setCName(e.target.value)}
                      placeholder="e.g. Acme Tech Labs"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Work Email *</label>
                    <input
                      type="email"
                      required
                      value={cEmail}
                      onChange={(e) => setCEmail(e.target.value)}
                      placeholder="hiring@acme.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500"
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
                      onChange={(e) => setCTitle(e.target.value)}
                      placeholder="e.g. Full Stack Web Developer Intern"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Domain</label>
                    <select
                      value={cDomain}
                      onChange={(e) => setCDomain(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                    >
                      <option value="Web Development">Web Development</option>
                      <option value="AI / Machine Learning">AI / Machine Learning</option>
                      <option value="UI / UX Design">UI / UX Design</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Cloud & DevOps">Cloud & DevOps</option>
                      <option value="Mobile App Dev">Mobile App Dev</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Stipend</label>
                    <input
                      type="text"
                      value={cStipend}
                      onChange={(e) => setCStipend(e.target.value)}
                      placeholder="₹25,000 / month"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Duration</label>
                    <select
                      value={cDuration}
                      onChange={(e) => setCDuration(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                    >
                      <option value="3 Months">3 Months</option>
                      <option value="6 Months">6 Months</option>
                      <option value="Flexible">Flexible</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Location</label>
                    <input
                      type="text"
                      value={cLocation}
                      onChange={(e) => setCLocation(e.target.value)}
                      placeholder="Remote / Bangalore"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Required Skills (comma separated)</label>
                  <input
                    type="text"
                    value={cSkills}
                    onChange={(e) => setCSkills(e.target.value)}
                    placeholder="e.g. React, Node.js, PostgreSQL, Tailwind"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Project Description</label>
                  <textarea
                    rows="2"
                    value={cDesc}
                    onChange={(e) => setCDesc(e.target.value)}
                    placeholder="Brief description of the project deliverables and scope..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={cSubmitting}
                  className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shadow-lg shadow-cyan-600/25 flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
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