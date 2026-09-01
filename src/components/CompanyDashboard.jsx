import React, { useState, useEffect } from 'react';
import { dbService } from '../firebase/dbService';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import { 
  Building2, 
  PlusCircle, 
  Users, 
  Briefcase, 
  Clock, 
  DollarSign, 
  MapPin, 
  CheckCircle2, 
  ExternalLink, 
  Mail, 
  GraduationCap, 
  Sparkles,
  Filter,
  Eye,
  Lock,
  ShieldCheck
} from 'lucide-react';

export default function CompanyDashboard() {
  const { user, addToast } = useAuth();
  const [activeTab, setActiveTab] = useState('postings'); // 'postings' | 'applicants' | 'create'
  const [myPostings, setMyPostings] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedJobFilter, setSelectedJobFilter] = useState('all');

  // Create Form State
  const [cName, setCName] = useState(user?.displayName || '');
  const [cEmail, setCEmail] = useState(user?.email || '');
  const [cTitle, setCTitle] = useState('');
  const [cDomain, setCDomain] = useState('Web Development');
  const [cStipend, setCStipend] = useState('₹25,000 / month');
  const [cDuration, setCDuration] = useState('3 Months');
  const [cLocation, setCLocation] = useState('Remote');
  const [cSkills, setCSkills] = useState('');
  const [cDesc, setCDesc] = useState('');
  const [cSubmitting, setCSubmitting] = useState(false);
  const [cError, setCError] = useState('');

  const loadDashboardData = () => {
    if (!user) {
      setMyPostings([]);
      setApplications([]);
      return;
    }

    // STRICT PRIVACY: Load ONLY postings created by this company/user
    const isolatedJobs = dbService.getCompanyPostings(user);
    setMyPostings(isolatedJobs);

    // STRICT PRIVACY: Load ONLY applicants for this company's postings
    const isolatedApps = dbService.getCompanyApplicants(user);
    setApplications(isolatedApps);
  };

  useEffect(() => {
    loadDashboardData();

    const handleSync = () => loadDashboardData();
    window.addEventListener('skillgrad_internship_posted', handleSync);
    window.addEventListener('skillgrad_application_submitted', handleSync);
    return () => {
      window.removeEventListener('skillgrad_internship_posted', handleSync);
      window.removeEventListener('skillgrad_application_submitted', handleSync);
    };
  }, [user]);

  const handleCreatePosting = async (e) => {
    e.preventDefault();
    setCError('');

    if (!cName.trim()) { setCError('Company name is required'); return; }
    if (!cEmail.trim() || !cEmail.includes('@')) { setCError('Valid email is required'); return; }
    if (!cTitle.trim() || cTitle.trim().length < 3) { setCError('Internship title is required'); return; }
    if (!cSkills.trim()) { setCError('Please specify required skills'); return; }
    if (!cDesc.trim() || cDesc.trim().length < 10) { setCError('Description must be at least 10 characters'); return; }

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
      }, user);

      confetti({ particleCount: 80, spread: 70 });
      addToast('Internship published successfully! It is now visible to all students on the marketplace.', 'success');
      setCTitle('');
      setCSkills('');
      setCDesc('');
      setActiveTab('postings');
      loadDashboardData();
    } catch (err) {
      addToast('Error publishing role', 'error');
    } finally {
      setCSubmitting(false);
    }
  };

  const filteredApplications = applications.filter(app => {
    if (selectedJobFilter === 'all') return true;
    return app.jobId === selectedJobFilter;
  });

  return (
    <section id="company-dashboard" className="py-16 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Strip */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-semibold text-cyan-400 mb-3 backdrop-blur-md">
              <ShieldCheck className="w-3.5 h-3.5" />
              Private Employer Workspace • {user?.email || 'Logged In'}
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
              My Recruitment Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Private company portal. Only openings and applicants belonging to your account are accessible here.
            </p>
          </div>

          {/* Metrics */}
          <div className="flex items-center gap-3">
            <div className="px-5 py-3 rounded-2xl glass-panel text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Your Openings</span>
              <strong className="text-xl font-bold font-display text-cyan-300">{myPostings.length}</strong>
            </div>
            <div className="px-5 py-3 rounded-2xl glass-panel text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Your Applicants</span>
              <strong className="text-xl font-bold font-display text-emerald-400">{applications.length}</strong>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-8">
          <button
            onClick={() => setActiveTab('postings')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'postings'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                : 'text-slate-400 hover:text-white glass-panel'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            My Published Openings ({myPostings.length})
          </button>

          <button
            onClick={() => setActiveTab('applicants')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'applicants'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                : 'text-slate-400 hover:text-white glass-panel'
            }`}
          >
            <Users className="w-4 h-4" />
            Applicant Tracking ({applications.length})
          </button>

          <button
            onClick={() => setActiveTab('create')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'create'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-600/30'
                : 'text-cyan-400 hover:text-cyan-300 glass-panel'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            + Post New Internship
          </button>
        </div>

        {/* Tab 1: My Published Openings */}
        {activeTab === 'postings' && (
          <div className="space-y-4 animate-fadeIn">
            {myPostings.length === 0 ? (
              <div className="text-center py-16 glass-panel rounded-3xl space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400">
                  <Briefcase className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-white">No Postings Created Yet by Your Account</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  You have not published any internships under <strong className="text-white">{user?.email}</strong>. Create an internship opening to start receiving student applications.
                </p>
                <button
                  onClick={() => setActiveTab('create')}
                  className="mt-2 px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-lg shadow-cyan-600/25 cursor-pointer"
                >
                  Post Your First Internship
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myPostings.map((job) => (
                  <div key={job.id} className="glass-panel p-6 sm:p-7 rounded-3xl flex flex-col justify-between relative group">
                    <div className="absolute -top-2.5 right-6 px-3 py-0.5 rounded-full bg-cyan-500 text-slate-950 text-[10px] font-extrabold tracking-wider uppercase shadow-lg flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Created by You
                    </div>

                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">{job.company}</span>
                          <h3 className="text-lg font-bold font-display text-white mt-0.5">{job.title}</h3>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          Active
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mt-1">
                        {job.description}
                      </p>

                      <div className="mt-4 py-2.5 px-3.5 rounded-xl bg-slate-900/80 border border-white/10 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
                          <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{job.stipend}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          <span>{job.duration}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <MapPin className="w-3.5 h-3.5 text-slate-500" />
                          <span>{job.location}</span>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {job.skills && job.skills.map((skill) => (
                          <span key={skill} className="px-2 py-0.5 rounded-md bg-slate-800/80 border border-white/10 text-[10px] font-medium text-slate-300">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-slate-300">
                        <Users className="w-4 h-4 text-cyan-400" />
                        <span><strong>{job.applicantsCount || 0}</strong> candidates applied</span>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedJobFilter(job.id);
                          setActiveTab('applicants');
                        }}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View Applicants
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Applicant Tracking */}
        {activeTab === 'applicants' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl glass-panel">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-semibold text-slate-300">Filter by Your Opening:</span>
                <select
                  value={selectedJobFilter}
                  onChange={(e) => setSelectedJobFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl glass-input text-xs"
                >
                  <option value="all" className="bg-slate-900 text-white">All Your Openings ({applications.length})</option>
                  {myPostings.map(j => (
                    <option key={j.id} value={j.id} className="bg-slate-900 text-white">{j.title}</option>
                  ))}
                </select>
              </div>

              <span className="text-xs text-slate-400">
                Showing <strong>{filteredApplications.length}</strong> candidate profiles
              </span>
            </div>

            {filteredApplications.length === 0 ? (
              <div className="text-center py-16 glass-panel rounded-3xl">
                <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-base font-semibold text-slate-300">No applicants received yet for your openings</p>
                <p className="text-xs text-slate-500 mt-1">When students apply to your published roles, their profiles will appear here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredApplications.map((app) => (
                  <div key={app.id} className="glass-panel p-5 sm:p-6 rounded-2xl flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <h4 className="text-base font-bold text-white">{app.name}</h4>
                          <p className="text-xs text-cyan-400 font-semibold">{app.jobTitle || 'Applied Role'}</p>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                          {app.status || 'Under Review'}
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-300 mt-3">
                        <div className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-mono text-slate-200">{app.email}</span>
                        </div>
                        {app.phone && (
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400 font-bold">Tel:</span>
                            <span>{app.phone}</span>
                          </div>
                        )}
                        {app.college && (
                          <div className="flex items-center gap-2">
                            <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                            <span>{app.college}</span>
                          </div>
                        )}
                        {app.portfolioUrl && (
                          <div className="flex items-center gap-2">
                            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                            <a href={app.portfolioUrl} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline truncate">
                              {app.portfolioUrl}
                            </a>
                          </div>
                        )}
                      </div>

                      {app.coverNote && (
                        <div className="mt-3 p-3 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-400 italic">
                          "{app.coverNote}"
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Applied: {new Date(app.submittedAt || Date.now()).toLocaleDateString()}</span>
                      <a
                        href={`mailto:${app.email}?subject=SkillGrad Interview Invitation - ${encodeURIComponent(app.jobTitle || 'Internship')}`}
                        className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors flex items-center gap-1"
                      >
                        <Mail className="w-3 h-3" />
                        Contact Candidate
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Create New Posting Form */}
        {activeTab === 'create' && (
          <div className="max-w-3xl mx-auto glass-panel p-6 sm:p-8 rounded-3xl shadow-2xl animate-fadeIn">
            <div className="mb-6">
              <h3 className="text-2xl font-bold font-display text-white">Post a New Paid Internship</h3>
              <p className="text-xs text-slate-400 mt-1">
                Your role will be published to all students across the marketplace under your company account (<strong className="text-white">{user?.email}</strong>).
              </p>
            </div>

            {cError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
                {cError}
              </div>
            )}

            <form onSubmit={handleCreatePosting} className="space-y-4" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Company / Startup Name *</label>
                  <input
                    type="text"
                    required
                    value={cName}
                    onChange={(e) => setCName(e.target.value)}
                    placeholder="e.g. Acme Innovations"
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Work Contact Email *</label>
                  <input
                    type="email"
                    required
                    value={cEmail}
                    onChange={(e) => setCEmail(e.target.value)}
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
                    onChange={(e) => setCTitle(e.target.value)}
                    placeholder="e.g. AI Research Intern / Full Stack Developer"
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
                    onChange={(e) => setCStipend(e.target.value)}
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
                  onChange={(e) => setCSkills(e.target.value)}
                  placeholder="e.g. React, Node.js, Python, PostgreSQL"
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Scope & Responsibilities * (min. 10 characters)</label>
                <textarea
                  rows="4"
                  required
                  value={cDesc}
                  onChange={(e) => setCDesc(e.target.value)}
                  placeholder="Describe key projects, deliverables, and expectations..."
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs sm:text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={cSubmitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs shadow-lg shadow-cyan-600/30 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                {cSubmitting ? 'Publishing...' : 'Publish Internship to All Students'}
              </button>
            </form>
          </div>
        )}

      </div>
    </section>
  );
}