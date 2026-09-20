import React, { useState, useEffect } from 'react';
import { DOMAINS_LIST } from '../data/mockData';
import { dbService } from '../firebase/dbService';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import { 
  Search, 
  MapPin, 
  Clock, 
  DollarSign, 
  Briefcase, 
  ArrowRight, 
  X,
  Send,
  Sparkles,
  Users,
  AlertCircle
} from 'lucide-react';

export default function Opportunities() {
  const { user, addToast } = useAuth();
  const [internships, setInternships] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState('All Domains');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalJob, setActiveModalJob] = useState(null);

  // Application Modal state
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantCollege, setApplicantCollege] = useState('');
  const [applicantPortfolio, setApplicantPortfolio] = useState('');
  const [applicantCover, setApplicantCover] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(false);
  const [modalError, setModalError] = useState('');

  // Load active internships on mount & listen for live events
  useEffect(() => {
    setInternships(dbService.getInternships());

    dbService.fetchLiveInternships().then((jobs) => {
      if (jobs && Array.isArray(jobs)) {
        setInternships(jobs);
      }
    });

    const handleNewInternship = (e) => {
      if (e.detail) {
        setInternships((prev) => [e.detail, ...prev.filter(item => item.id !== e.detail.id)]);
      }
    };

    const handleNewApplication = (e) => {
      if (e.detail && e.detail.jobId) {
        setInternships((prev) => prev.map(job => 
          job.id === e.detail.jobId
            ? { ...job, applicantsCount: (job.applicantsCount || 0) + 1 }
            : job
        ));
      }
    };

    window.addEventListener('skillgrad_internship_posted', handleNewInternship);
    window.addEventListener('skillgrad_application_submitted', handleNewApplication);
    return () => {
      window.removeEventListener('skillgrad_internship_posted', handleNewInternship);
      window.removeEventListener('skillgrad_application_submitted', handleNewApplication);
    };
  }, []);

  // Filter logic
  const filteredList = internships.filter((job) => {
    const matchesDomain = selectedDomain === 'All Domains' || job.domain === selectedDomain;
    const matchesSearch = 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.skills && job.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesDomain && matchesSearch;
  });

  const handleOpenApply = (job) => {
    setActiveModalJob(job);
    setApplicationSuccess(false);
    setModalError('');
    if (user) {
      setApplicantName(user.displayName || '');
      setApplicantEmail(user.email || '');
    }
  };

  const handleCloseModal = () => {
    setActiveModalJob(null);
    setApplicationSuccess(false);
    setModalError('');
  };

  const validateApplication = () => {
    if (!applicantName.trim() || applicantName.trim().length < 2) {
      setModalError('Please enter your full name.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!applicantEmail.trim() || !emailRegex.test(applicantEmail.trim())) {
      setModalError('Please enter a valid email address.');
      return false;
    }
    if (!applicantCollege.trim()) {
      setModalError('Please enter your College / University name.');
      return false;
    }
    if (!applicantCover.trim() || applicantCover.trim().length < 10) {
      setModalError('Please write a brief note (min 10 characters) explaining why you are a fit.');
      return false;
    }
    return true;
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setModalError('');

    if (!validateApplication()) {
      addToast('Please fill in all required fields.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await dbService.submitApplication({
        jobId: activeModalJob.id,
        jobTitle: activeModalJob.title,
        companyName: activeModalJob.company,
        name: applicantName.trim(),
        email: applicantEmail.trim(),
        phone: applicantPhone.trim(),
        college: applicantCollege.trim(),
        portfolioUrl: applicantPortfolio.trim(),
        coverNote: applicantCover.trim(),
        userId: user ? user.uid : null
      });

      if (res.success) {
        setInternships(prev => prev.map(job => 
          job.id === activeModalJob.id 
            ? { ...job, applicantsCount: (job.applicantsCount || 0) + 1 }
            : job
        ));

        setApplicationSuccess(true);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
        addToast('Application submitted! Applicant count updated.', 'success');
      }
    } catch (err) {
      addToast('Failed to submit application. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="opportunities" className="py-24 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 animate-slide-up">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-xs font-semibold text-indigo-300 mb-3 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              <Briefcase className="w-3.5 h-3.5 ml-0.5" />
              Live Internship Marketplace
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight">
              <span className="flow-gradient-text">Featured Paid Opportunities</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-xl">
              Active projects from verified startups and hiring companies. Apply in 60 seconds.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by skill, role, company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs sm:text-sm"
            />
          </div>
        </div>

        {/* Domain Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none stagger-children">
          {DOMAINS_LIST.map((domain) => (
            <button
              key={domain}
              onClick={() => setSelectedDomain(domain)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                selectedDomain === domain
                  ? 'bg-primary-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/80 border border-white/10'
              }`}
            >
              {domain}
            </button>
          ))}
        </div>

        {/* Opportunities Grid */}
        {filteredList.length === 0 ? (
          <div className="text-center py-16 glass-panel rounded-3xl space-y-3 animate-scale-in">
            <div className="w-14 h-14 rounded-2xl bg-primary-500/10 border border-primary-500/30 flex items-center justify-center mx-auto text-primary-400">
              <Briefcase className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white">No Active Internships Listed</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              There are currently no internship postings matching your filters in the database. New roles posted by partner companies will appear here instantly.
            </p>
            {searchQuery && (
              <button
                onClick={() => { setSelectedDomain('All Domains'); setSearchQuery(''); }}
                className="mt-2 px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-primary-400 hover:bg-slate-700 cursor-pointer"
              >
                Reset Search Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 stagger-children">
            {filteredList.map((job) => (
              <div
                key={job.id}
                className={`glass-panel-interactive p-6 sm:p-7 rounded-3xl flex flex-col justify-between group relative ${
                  job.isNew ? 'ring-1 ring-emerald-500/40 bg-slate-900/85' : ''
                }`}
              >
                {job.isNew && (
                  <div className="absolute -top-2.5 right-6 px-3 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-extrabold tracking-wider uppercase shadow-lg shadow-emerald-500/20 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Newly Added
                  </div>
                )}

                <div>
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-white/10 flex items-center justify-center text-2xl shrink-0 shadow-md">
                        {job.logo || '🚀'}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">
                          {job.company}
                        </h4>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          <span>{job.location || 'Remote'}</span>
                        </div>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {job.type}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-bold font-display text-white group-hover:text-primary-300 transition-colors line-clamp-1">
                    {job.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>

                  {/* Key Details Strip */}
                  <div className="mt-4 py-2.5 px-3.5 rounded-xl bg-slate-900/70 border border-white/10 flex items-center justify-between text-xs backdrop-blur-md">
                    <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{job.stipend}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{job.duration}</span>
                    </div>
                  </div>

                  {/* Skills Tags */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {job.skills && job.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-0.5 rounded-md bg-slate-800/80 border border-white/10 text-[11px] font-medium text-slate-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Apply Button & Dynamic Applicants Counter */}
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Users className="w-3.5 h-3.5 text-primary-400" />
                    <span>
                      <strong className="text-white font-semibold transition-all">
                        {job.applicantsCount || 0}
                      </strong> applicants
                    </span>
                  </div>

                  <button
                    onClick={() => handleOpenApply(job)}
                    className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    Apply Now
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Frosted Glass Application Modal */}
      {activeModalJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div 
            className="relative w-full max-w-xl glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseModal}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {applicationSuccess ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto text-3xl">
                  ✓
                </div>
                <h3 className="text-2xl font-bold font-display text-white">Application Received!</h3>
                <p className="text-sm text-slate-300 max-w-md mx-auto">
                  Your application for <strong className="text-white">{activeModalJob.title}</strong> at <strong className="text-white">{activeModalJob.company}</strong> has been recorded.
                </p>
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 text-xs text-slate-400 text-left max-w-md mx-auto space-y-1">
                  <p>• Status: <span className="text-emerald-400 font-semibold">Under Review</span></p>
                  <p>• Applicant tally for this role has been incremented.</p>
                  <p>• Updates will be sent to <span className="text-white font-medium">{applicantEmail}</span>.</p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="px-6 py-2.5 rounded-xl bg-primary-600 text-white text-xs font-semibold"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <div className="flex items-center gap-2 text-xs font-semibold text-primary-400 mb-1">
                    <span>{activeModalJob.company}</span>
                    <span>•</span>
                    <span>{activeModalJob.stipend}</span>
                  </div>
                  <h3 className="text-2xl font-bold font-display text-white">
                    Apply for {activeModalJob.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Fill in your details below to submit your application directly to the hiring managers.
                  </p>
                </div>

                {modalError && (
                  <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{modalError}</span>
                  </div>
                )}

                <form onSubmit={handleApplySubmit} className="space-y-4" noValidate>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={applicantName}
                        onChange={(e) => { setApplicantName(e.target.value); setModalError(''); }}
                        placeholder="John Doe"
                        className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={applicantEmail}
                        onChange={(e) => { setApplicantEmail(e.target.value); setModalError(''); }}
                        placeholder="john@college.edu"
                        className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={applicantPhone}
                        onChange={(e) => setApplicantPhone(e.target.value)}
                        placeholder="+91 9876543210"
                        className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">College / University *</label>
                      <input
                        type="text"
                        required
                        value={applicantCollege}
                        onChange={(e) => { setApplicantCollege(e.target.value); setModalError(''); }}
                        placeholder="e.g. IIT Bombay / VIT / DU"
                        className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">GitHub / Portfolio / LinkedIn URL</label>
                    <input
                      type="url"
                      value={applicantPortfolio}
                      onChange={(e) => setApplicantPortfolio(e.target.value)}
                      placeholder="https://github.com/yourhandle"
                      className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Why are you a good fit? * (min. 10 characters)</label>
                    <textarea
                      rows="3"
                      required
                      value={applicantCover}
                      onChange={(e) => { setApplicantCover(e.target.value); setModalError(''); }}
                      placeholder="Briefly highlight your relevant projects or skills..."
                      className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs sm:text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-600 via-indigo-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Submit Internship Application
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

    </section>
  );
}