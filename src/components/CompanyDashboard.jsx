import React, { useState, useEffect } from 'react';
import { dbService } from '../firebase/dbService';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import { 
  Building2, PlusCircle, Users, Briefcase, Clock, DollarSign, MapPin,
  CheckCircle2, ExternalLink, Mail, GraduationCap, Sparkles, Filter,
  Eye, ShieldCheck, Trash2, UserCheck, UserX, XCircle, AlertCircle,
  Award, Copy, Check, FileBadge, Send, X
} from 'lucide-react';

export default function CompanyDashboard() {
  const { user, addToast } = useAuth();
  const [activeTab, setActiveTab] = useState('postings');
  const [myPostings, setMyPostings] = useState([]);
  const [applications, setApplications] = useState([]);
  const [issuedCerts, setIssuedCerts] = useState([]);
  const [selectedJobFilter, setSelectedJobFilter] = useState('all');
  const [deletingId, setDeletingId] = useState(null);

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

  // Certificate Issuance State
  const [certStudentName, setCertStudentName] = useState('');
  const [certStudentEmail, setCertStudentEmail] = useState('');
  const [certRoleTitle, setCertRoleTitle] = useState('');
  const [certDomain, setCertDomain] = useState('Web Development');
  const [certGrade, setCertGrade] = useState('A+ (Distinction)');
  const [certSummary, setCertSummary] = useState('');
  const [certSubmitting, setCertSubmitting] = useState(false);
  const [justIssuedSerial, setJustIssuedSerial] = useState(null);
  const [copiedSerial, setCopiedSerial] = useState(false);

  // Email Candidate Modal State
  const [selectedEmailApplicant, setSelectedEmailApplicant] = useState(null);
  const [candidateEmailSubject, setCandidateEmailSubject] = useState('');
  const [candidateEmailMessage, setCandidateEmailMessage] = useState('');
  const [candidateEmailSending, setCandidateEmailSending] = useState(false);

  const loadDashboardData = () => {
    if (!user) {
      setMyPostings([]);
      setApplications([]);
      setIssuedCerts([]);
      return;
    }
    setMyPostings(dbService.getCompanyPostings(user));
    setApplications(dbService.getCompanyApplicants(user));

    dbService.fetchCompanyPostings(user).then((jobs) => {
      if (jobs && Array.isArray(jobs)) setMyPostings(jobs);
    });
    dbService.fetchCompanyApplicants(user).then((apps) => {
      if (apps && Array.isArray(apps)) setApplications(apps);
    });
    dbService.fetchCompanyCertificates(user).then((certs) => {
      if (certs && Array.isArray(certs)) setIssuedCerts(certs);
    });
  };

  useEffect(() => {
    loadDashboardData();
    if (!user) return;

    // Real-time Firestore subscriptions for company data
    const unsubPostings = dbService.subscribeCompanyPostings(user, (jobs) => {
      if (jobs) setMyPostings(jobs);
    });
    const unsubApplicants = dbService.subscribeCompanyApplicants(user, (apps) => {
      if (apps) setApplications(apps);
    });
    const unsubCerts = dbService.subscribeCompanyCertificates(user, (certs) => {
      if (certs) setIssuedCerts(certs);
    });

    const handleSync = () => loadDashboardData();
    window.addEventListener('skillgrad_internship_posted', handleSync);
    window.addEventListener('skillgrad_application_submitted', handleSync);
    window.addEventListener('skillgrad_internship_deleted', handleSync);
    window.addEventListener('skillgrad_application_status_changed', handleSync);
    window.addEventListener('skillgrad_certificate_issued', handleSync);
    return () => {
      if (unsubPostings) unsubPostings();
      if (unsubApplicants) unsubApplicants();
      if (unsubCerts) unsubCerts();
      window.removeEventListener('skillgrad_internship_posted', handleSync);
      window.removeEventListener('skillgrad_application_submitted', handleSync);
      window.removeEventListener('skillgrad_internship_deleted', handleSync);
      window.removeEventListener('skillgrad_application_status_changed', handleSync);
      window.removeEventListener('skillgrad_certificate_issued', handleSync);
    };
  }, [user]);

  const handleDeletePosting = async (jobId) => {
    if (!confirm('Delete this posting? All related applications will also be removed.')) return;
    setDeletingId(jobId);
    await dbService.deleteInternship(jobId);
    addToast('Posting deleted.', 'success');
    setDeletingId(null);
    loadDashboardData();
  };

  const handleStatusChange = async (appId, newStatus) => {
    await dbService.updateApplicationStatus(appId, newStatus);
    addToast(`Applicant ${newStatus === 'accepted' ? 'accepted' : 'rejected'}.`, 'success');
    loadDashboardData();
  };

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
        company: cName.trim(), contactEmail: cEmail.trim(), title: cTitle.trim(),
        domain: cDomain, stipend: cStipend.trim(), duration: cDuration,
        location: cLocation.trim(),
        skills: cSkills.split(',').map(s => s.trim()).filter(Boolean),
        description: cDesc.trim()
      }, user);
      confetti({ particleCount: 80, spread: 70 });
      addToast('Internship published!', 'success');
      setCTitle(''); setCSkills(''); setCDesc('');
      setActiveTab('postings');
      loadDashboardData();
    } catch {
      addToast('Error publishing role', 'error');
    } finally {
      setCSubmitting(false);
    }
  };

  const handleIssueCertificateSubmit = async (e) => {
    e.preventDefault();
    if (!certStudentName.trim() || !certStudentEmail.trim() || !certRoleTitle.trim()) {
      addToast('Please fill all required candidate details.', 'error');
      return;
    }

    setCertSubmitting(true);
    try {
      const res = await dbService.issueCertificate({
        studentName: certStudentName.trim(),
        studentEmail: certStudentEmail.trim(),
        companyName: cName.trim() || user?.displayName || 'SkillGrad Partner',
        companyEmail: user?.email || cEmail.trim(),
        roleTitle: certRoleTitle.trim(),
        domain: certDomain,
        grade: certGrade,
        summary: certSummary.trim() || 'Successfully completed commercial deliverable objectives.'
      });

      if (res.success) {
        setJustIssuedSerial(res.serialNumber);
        confetti({ particleCount: 90, spread: 80 });
        addToast(`Certificate issued! Serial Number: ${res.serialNumber}`, 'success');
        setCertStudentName('');
        setCertStudentEmail('');
        setCertRoleTitle('');
        setCertSummary('');
        loadDashboardData();
      }
    } catch {
      addToast('Failed to issue certificate', 'error');
    } finally {
      setCertSubmitting(false);
    }
  };

  const startIssueForApplicant = (app) => {
    setCertStudentName(app.name);
    setCertStudentEmail(app.email);
    setCertRoleTitle(app.jobTitle || '');
    setActiveTab('certificates');
  };

  const handleCopySerial = (serial) => {
    navigator.clipboard.writeText(serial);
    setCopiedSerial(true);
    addToast('Serial Number copied to clipboard!', 'success');
    setTimeout(() => setCopiedSerial(false), 2000);
  };

  const handleOpenEmailModal = (app) => {
    setSelectedEmailApplicant(app);
    setCandidateEmailSubject(`SkillGrad Update: ${app.jobTitle || 'Internship Application'}`);
    setCandidateEmailMessage(`Hello ${app.name},\n\nWe have reviewed your application for the ${app.jobTitle || 'Internship'} position at ${cName || user?.displayName || 'our organization'} on SkillGrad.\n\nWe are impressed with your profile and would love to connect for the next evaluation step. Please reply to this message with your availability for a brief technical discussion.\n\nBest regards,\n${cName || user?.displayName || 'Hiring Team'}`);
  };

  const handleSendCandidateEmailSubmit = async (e) => {
    e.preventDefault();
    if (!candidateEmailMessage.trim()) {
      addToast('Please write a message to the candidate.', 'error');
      return;
    }
    setCandidateEmailSending(true);
    try {
      await dbService.sendContactMessage({
        name: cName || user?.displayName || 'Company Recruiter',
        email: user?.email || cEmail,
        to_email: selectedEmailApplicant.email,
        subject: candidateEmailSubject.trim(),
        message: `Employer: ${cName || user?.displayName || 'SkillGrad Hiring Partner'}\nCompany Contact: ${user?.email || cEmail}\nCandidate Name: ${selectedEmailApplicant.name}\nCandidate Email: ${selectedEmailApplicant.email}\nRole: ${selectedEmailApplicant.jobTitle || 'Internship'}\n\nMessage Content:\n${candidateEmailMessage.trim()}`
      });
      addToast(`Direct email sent to ${selectedEmailApplicant.name} (${selectedEmailApplicant.email})!`, 'success');
      setSelectedEmailApplicant(null);
      setCandidateEmailSubject('');
      setCandidateEmailMessage('');
    } catch {
      addToast('Error sending message. Please try again.', 'error');
    } finally {
      setCandidateEmailSending(false);
    }
  };

  const filteredApplications = applications.filter(app => {
    if (selectedJobFilter === 'all') return true;
    return app.jobId === selectedJobFilter;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'accepted':
        return { label: 'Accepted', bg: 'bg-emerald-500/10', border: 'border-emerald-500/25', text: 'text-emerald-400', Icon: CheckCircle2 };
      case 'rejected':
        return { label: 'Rejected', bg: 'bg-rose-500/10', border: 'border-rose-500/25', text: 'text-rose-400', Icon: XCircle };
      default:
        return { label: 'Pending', bg: 'bg-amber-500/10', border: 'border-amber-500/25', text: 'text-amber-400', Icon: Clock };
    }
  };

  return (
    <section id="company-dashboard" className="py-12 sm:py-16 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Strip */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 animate-slide-up">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-xs font-semibold text-cyan-400 mb-3 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <ShieldCheck className="w-3.5 h-3.5 ml-0.5" />
              Private Employer Workspace • {user?.email || 'Logged In'}
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight">
              <span className="flow-gradient-cyan">Recruitment Dashboard</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Manage openings, evaluate candidates, and issue verifiable certificates with serial numbers.
            </p>
          </div>

          {/* Metrics with Animated Borders */}
          <div className="flex items-center gap-3 stagger-children">
            <div className="px-5 py-3.5 rounded-2xl glass-panel relative overflow-hidden text-center group hover:border-cyan-500/40 transition-all duration-300">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Openings</span>
              <strong className="text-2xl font-black font-display text-cyan-300">{myPostings.length}</strong>
            </div>
            <div className="px-5 py-3.5 rounded-2xl glass-panel relative overflow-hidden text-center group hover:border-emerald-500/40 transition-all duration-300">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Applicants</span>
              <strong className="text-2xl font-black font-display text-emerald-400">{applications.length}</strong>
            </div>
            <div className="px-5 py-3.5 rounded-2xl glass-panel relative overflow-hidden text-center group hover:border-amber-500/40 transition-all duration-300">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Certificates</span>
              <strong className="text-2xl font-black font-display text-amber-300">{issuedCerts.length}</strong>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-white/[0.06] pb-4 mb-8 overflow-x-auto stagger-children">
          {[
            { key: 'postings', label: `Openings (${myPostings.length})`, icon: Briefcase },
            { key: 'applicants', label: `Applicants (${applications.length})`, icon: Users },
            { key: 'certificates', label: `Issue Certificate (${issuedCerts.length})`, icon: Award },
            { key: 'create', label: '+ New Posting', icon: PlusCircle },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                activeTab === tab.key
                  ? tab.key === 'create' 
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-600/25'
                    : tab.key === 'certificates'
                      ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/25'
                      : 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/25'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ===== Tab 1: My Published Openings ===== */}
        {activeTab === 'postings' && (
          <div className="animate-fadeIn">
            {myPostings.length === 0 ? (
              <div className="text-center py-14 glass-panel rounded-2xl space-y-3 animate-scale-in">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center mx-auto text-cyan-400">
                  <Briefcase className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-white">No Postings Yet</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Create your first internship to start receiving student applications.
                </p>
                <button onClick={() => setActiveTab('create')}
                  className="mt-2 px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-lg shadow-cyan-600/25 cursor-pointer active:scale-95 transition-all">
                  Post Your First Internship
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 stagger-children">
                {myPostings.map((job) => (
                  <div key={job.id} className={`glass-panel-interactive-cyan p-5 sm:p-6 rounded-2xl flex flex-col justify-between relative group transition-all duration-300 ${
                    deletingId === job.id ? 'opacity-40 scale-95' : ''
                  }`}>
                    <div className="absolute -top-3 right-14 px-3 py-0.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 text-[10px] font-extrabold tracking-wider uppercase shadow-lg shadow-cyan-500/25 flex items-center gap-1.5 animate-float-slow">
                      <Sparkles className="w-3 h-3 text-slate-950" /> Your Posting
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeletePosting(job.id)}
                      title="Delete this posting"
                      className="absolute top-3.5 right-3.5 p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/15 opacity-80 group-hover:opacity-100 transition-all cursor-pointer border border-transparent hover:border-rose-500/30 active:scale-90"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2 pr-10">
                        <div>
                          <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">{job.company}</span>
                          <h3 className="text-lg font-bold font-display text-white mt-0.5 group-hover:text-cyan-200 transition-colors">{job.title}</h3>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shrink-0 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                          Active
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{job.description}</p>

                      <div className="mt-3 py-2 px-3 rounded-lg bg-slate-900/80 border border-white/[0.06] flex items-center justify-between text-xs">
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

                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {job.skills && job.skills.map((skill) => (
                          <span key={skill} className="px-2 py-0.5 rounded-md bg-slate-800/80 border border-white/[0.06] text-[10px] font-medium text-slate-300">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-slate-300">
                        <Users className="w-3.5 h-3.5 text-cyan-400" />
                        <span><strong>{job.applicantsCount || 0}</strong> candidates</span>
                      </div>
                      <button
                        onClick={() => { setSelectedJobFilter(job.id); setActiveTab('applicants'); }}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                      >
                        <Eye className="w-3 h-3" />
                        View Applicants
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== Tab 2: Applicant Tracking with Accept/Reject & Award Cert ===== */}
        {activeTab === 'applicants' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl glass-panel">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-semibold text-slate-300">Filter by opening:</span>
                <select
                  value={selectedJobFilter}
                  onChange={(e) => setSelectedJobFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-lg glass-input text-xs"
                >
                  <option value="all" className="bg-slate-900 text-white">All ({applications.length})</option>
                  {myPostings.map(j => (
                    <option key={j.id} value={j.id} className="bg-slate-900 text-white">{j.title}</option>
                  ))}
                </select>
              </div>
              <span className="text-xs text-slate-400">
                <strong>{filteredApplications.length}</strong> candidates
              </span>
            </div>

            {filteredApplications.length === 0 ? (
              <div className="text-center py-14 glass-panel rounded-2xl animate-scale-in">
                <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-base font-semibold text-slate-300">No applicants yet</p>
                <p className="text-xs text-slate-500 mt-1">Applicants will appear here when students apply.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 stagger-children">
                {filteredApplications.map((app) => {
                  const sb = getStatusBadge(app.status);
                  const StatusIcon = sb.Icon;
                  const isAccepted = app.status === 'accepted';

                  return (
                    <div key={app.id} className="glass-panel-interactive-cyan p-5 sm:p-6 rounded-2xl flex flex-col justify-between transition-all duration-300">
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div>
                            <h4 className="text-base font-bold text-white group-hover:text-cyan-200 transition-colors">{app.name}</h4>
                            <p className="text-xs text-cyan-400 font-semibold">{app.jobTitle || 'Applied Role'}</p>
                          </div>
                          <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${sb.bg} ${sb.text} ${sb.border} border shrink-0`}>
                            <StatusIcon className="w-3 h-3" />
                            {sb.label}
                          </span>
                        </div>

                        <div className="space-y-1.5 text-xs text-slate-300 mt-3">
                          <div className="flex items-center gap-2">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            <span className="font-mono text-slate-200">{app.email}</span>
                          </div>
                          {app.phone && (
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 font-bold text-[11px]">Tel:</span>
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
                          <div className="mt-3 p-3 rounded-lg bg-slate-900/80 border border-white/[0.06] text-xs text-slate-400 italic">
                            "{app.coverNote}"
                          </div>
                        )}
                      </div>

                      <div className="mt-4 pt-3 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[11px] text-slate-500">
                          Applied: {new Date(app.submittedAt || Date.now()).toLocaleDateString()}
                        </span>

                        <div className="flex items-center gap-2">
                          {/* Award Certificate shortcut if accepted */}
                          {isAccepted && (
                            <button
                              onClick={() => startIssueForApplicant(app)}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-[11px] font-semibold transition-all cursor-pointer active:scale-95"
                              title="Issue verified completion certificate with serial number"
                            >
                              <Award className="w-3.5 h-3.5" />
                              Award Cert
                            </button>
                          )}

                          {/* Accept / Reject Buttons */}
                          {(!app.status || app.status === 'pending') && (
                            <>
                              <button
                                onClick={() => handleStatusChange(app.id, 'accepted')}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold transition-all cursor-pointer active:scale-95"
                              >
                                <UserCheck className="w-3 h-3" />
                                Accept
                              </button>
                              <button
                                onClick={() => handleStatusChange(app.id, 'rejected')}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 text-[11px] font-semibold transition-all cursor-pointer active:scale-95 border border-white/[0.06]"
                              >
                                <UserX className="w-3 h-3" />
                                Reject
                              </button>
                            </>
                          )}
                          {app.status === 'accepted' && (
                            <button
                              onClick={() => handleStatusChange(app.id, 'rejected')}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 text-[11px] font-semibold transition-all cursor-pointer active:scale-95 border border-white/[0.06]"
                            >
                              <UserX className="w-3 h-3" />
                              Reject
                            </button>
                          )}
                          {app.status === 'rejected' && (
                            <button
                              onClick={() => handleStatusChange(app.id, 'accepted')}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold transition-all cursor-pointer active:scale-95"
                            >
                              <UserCheck className="w-3 h-3" />
                              Accept
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleOpenEmailModal(app)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-cyan-600 hover:text-white text-cyan-300 transition-all cursor-pointer border border-cyan-500/20 active:scale-95 flex items-center justify-center"
                            title="Direct Message / Email Candidate"
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ===== Tab 3: Issue Verifiable Certificate ===== */}
        {activeTab === 'certificates' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Success Celebration Alert if just issued */}
            {justIssuedSerial && (
              <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 animate-bounce-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 shrink-0">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Certificate Generated & Registered</span>
                      <p className="text-base font-bold font-mono text-white mt-0.5">{justIssuedSerial}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopySerial(justIssuedSerial)}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all shadow-md shadow-amber-500/20"
                    >
                      {copiedSerial ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedSerial ? 'Copied' : 'Copy Serial Number'}
                    </button>
                    <button
                      onClick={() => setJustIssuedSerial(null)}
                      className="p-2 rounded-xl text-slate-400 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-300 mt-2">
                  The student can now view and download their certificate directly from the <strong>Joined Internships</strong> section in their portal, and anyone can verify this credential using this Serial Number on the verification page.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Issuance Form */}
              <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-3xl shadow-2xl animate-scale-in">
                <div className="mb-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-xs font-semibold text-amber-300 mb-2">
                    <FileBadge className="w-3.5 h-3.5" />
                    Official Credential Minting
                  </div>
                  <h3 className="text-2xl font-bold font-display text-white">Issue Completion Certificate</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Generates a unique tamper-proof Serial Number verifiable by universities and employers worldwide.
                  </p>
                </div>

                <form onSubmit={handleIssueCertificateSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Student Full Name *</label>
                      <input
                        type="text"
                        required
                        value={certStudentName}
                        onChange={(e) => setCertStudentName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Student Registered Email *</label>
                      <input
                        type="email"
                        required
                        value={certStudentEmail}
                        onChange={(e) => setCertStudentEmail(e.target.value)}
                        placeholder="student@college.edu"
                        className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Internship Title *</label>
                      <input
                        type="text"
                        required
                        value={certRoleTitle}
                        onChange={(e) => setCertRoleTitle(e.target.value)}
                        placeholder="e.g. AI Research Intern"
                        className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Domain</label>
                      <select
                        value={certDomain}
                        onChange={(e) => setCertDomain(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl glass-input text-xs"
                      >
                        <option value="Web Development" className="bg-slate-900">Web Development</option>
                        <option value="AI / Machine Learning" className="bg-slate-900">AI / Machine Learning</option>
                        <option value="UI / UX Design" className="bg-slate-900">UI / UX Design</option>
                        <option value="Data Science" className="bg-slate-900">Data Science</option>
                        <option value="Cloud & DevOps" className="bg-slate-900">Cloud & DevOps</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Performance Grade</label>
                    <select
                      value={certGrade}
                      onChange={(e) => setCertGrade(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl glass-input text-xs"
                    >
                      <option value="A+ (Distinction)" className="bg-slate-900">A+ (Distinction - Outstanding Performance)</option>
                      <option value="A (Excellent)" className="bg-slate-900">A (Excellent - Exceeded Deliverable Goals)</option>
                      <option value="B+ (Very Good)" className="bg-slate-900">B+ (Very Good - Commendable Execution)</option>
                      <option value="Completed with Honors" className="bg-slate-900">Completed with Honors</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Performance Summary & Deliverables</label>
                    <textarea
                      rows="3"
                      value={certSummary}
                      onChange={(e) => setCertSummary(e.target.value)}
                      placeholder="Highlight key project milestones delivered by the student (e.g. Built microservices, optimized SQL queries)..."
                      className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs sm:text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={certSubmitting}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-slate-950 font-bold text-xs shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 active:scale-[0.98] transition-all"
                  >
                    <Award className="w-4 h-4" />
                    {certSubmitting ? 'Generating Verifiable Certificate...' : 'Issue Certificate & Generate Serial Number'}
                  </button>
                </form>
              </div>

              {/* Previously Issued Certificates Registry */}
              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">Issued Credentials Registry</h4>
                  <span className="text-xs text-slate-400">{issuedCerts.length} total</span>
                </div>

                {issuedCerts.length === 0 ? (
                  <div className="p-8 text-center glass-panel rounded-2xl space-y-2">
                    <Award className="w-8 h-8 text-slate-600 mx-auto" />
                    <p className="text-xs text-slate-400">No certificates issued yet by your company account.</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1 stagger-children">
                    {issuedCerts.map((cert) => (
                      <div key={cert.id || cert.serialNumber} className="glass-panel p-4 rounded-xl border border-amber-500/20 hover:border-amber-500/40 transition-all">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h5 className="text-sm font-bold text-white truncate">{cert.studentName || cert.student_name}</h5>
                          <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 font-mono text-[10px] font-bold border border-amber-500/30">
                            {cert.serialNumber || cert.serial_number}
                          </span>
                        </div>
                        <p className="text-xs text-cyan-400 font-medium">{cert.roleTitle || cert.role_title}</p>
                        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-white/[0.06]">
                          <span>Grade: <strong className="text-emerald-400">{cert.grade}</strong></span>
                          <span>Issued: {cert.issueDate || cert.issue_date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===== Tab 4: Create New Posting ===== */}
        {activeTab === 'create' && (
          <div className="max-w-3xl mx-auto glass-panel p-5 sm:p-8 rounded-2xl shadow-2xl animate-scale-in">
            <div className="mb-6">
              <h3 className="text-xl font-bold font-display text-white">Post a New Paid Internship</h3>
              <p className="text-xs text-slate-400 mt-1">
                Published to all students under <strong className="text-white">{user?.email}</strong>.
              </p>
            </div>

            {cError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs flex items-center gap-2 animate-slide-left">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                {cError}
              </div>
            )}

            <form onSubmit={handleCreatePosting} className="space-y-4" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Company Name *</label>
                  <input type="text" required value={cName} onChange={(e) => setCName(e.target.value)}
                    placeholder="e.g. Acme Innovations" className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Email *</label>
                  <input type="email" required value={cEmail} onChange={(e) => setCEmail(e.target.value)}
                    placeholder="hiring@acme.com" className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Internship Title *</label>
                  <input type="text" required value={cTitle} onChange={(e) => setCTitle(e.target.value)}
                    placeholder="e.g. Full Stack Developer Intern" className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Domain</label>
                  <select value={cDomain} onChange={(e) => setCDomain(e.target.value)} className="w-full px-3 py-2.5 rounded-xl glass-input text-xs">
                    <option value="Web Development" className="bg-slate-900">Web Development</option>
                    <option value="AI / Machine Learning" className="bg-slate-900">AI / Machine Learning</option>
                    <option value="UI / UX Design" className="bg-slate-900">UI / UX Design</option>
                    <option value="Data Science" className="bg-slate-900">Data Science</option>
                    <option value="Cloud & DevOps" className="bg-slate-900">Cloud & DevOps</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Stipend *</label>
                  <input type="text" required value={cStipend} onChange={(e) => setCStipend(e.target.value)}
                    placeholder="₹25,000 / month" className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Duration</label>
                  <select value={cDuration} onChange={(e) => setCDuration(e.target.value)} className="w-full px-3 py-2.5 rounded-xl glass-input text-xs">
                    <option value="3 Months" className="bg-slate-900">3 Months</option>
                    <option value="6 Months" className="bg-slate-900">6 Months</option>
                    <option value="Flexible" className="bg-slate-900">Flexible</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Location</label>
                  <input type="text" value={cLocation} onChange={(e) => setCLocation(e.target.value)}
                    placeholder="Remote / Bangalore" className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Required Skills * (comma separated)</label>
                <input type="text" required value={cSkills} onChange={(e) => setCSkills(e.target.value)}
                  placeholder="React, Node.js, Python, PostgreSQL" className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Scope & Responsibilities *</label>
                <textarea rows="4" required value={cDesc} onChange={(e) => setCDesc(e.target.value)}
                  placeholder="Describe key projects, deliverables, and expectations..."
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm" />
              </div>

              <button type="submit" disabled={cSubmitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs shadow-lg shadow-cyan-600/25 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer active:scale-[0.97] transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                {cSubmitting ? 'Publishing...' : 'Publish Internship'}
              </button>
            </form>
          </div>
        )}

        {/* ===== Modal: Direct Message / Email Candidate ===== */}
        {selectedEmailApplicant && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
            <div 
              className="relative w-full max-w-lg glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setSelectedEmailApplicant(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-5">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 mb-1">
                  <Mail className="w-3.5 h-3.5" />
                  <span>Direct Communication Desk</span>
                </div>
                <h3 className="text-xl font-bold font-display text-white">
                  Message {selectedEmailApplicant.name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Sending to <strong className="text-cyan-300 font-mono">{selectedEmailApplicant.email}</strong> regarding <strong className="text-white">{selectedEmailApplicant.jobTitle || 'Internship Application'}</strong>.
                </p>
              </div>

              <form onSubmit={handleSendCandidateEmailSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={candidateEmailSubject}
                    onChange={(e) => setCandidateEmailSubject(e.target.value)}
                    placeholder="Subject line..."
                    className="w-full px-3.5 py-2 rounded-xl glass-input text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Message Body *</label>
                  <textarea
                    rows="5"
                    required
                    value={candidateEmailMessage}
                    onChange={(e) => setCandidateEmailMessage(e.target.value)}
                    placeholder="Write your message or next steps instructions..."
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs sm:text-sm leading-relaxed"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between gap-2">
                  <a
                    href={`mailto:${selectedEmailApplicant.email}?subject=${encodeURIComponent(candidateEmailSubject)}&body=${encodeURIComponent(candidateEmailMessage)}`}
                    className="text-[11px] text-slate-400 hover:text-cyan-300 underline"
                  >
                    Open in default mail client
                  </a>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedEmailApplicant(null)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={candidateEmailSending}
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold shadow-lg shadow-cyan-600/25 flex items-center gap-1.5 cursor-pointer disabled:opacity-60 active:scale-95 transition-all"
                    >
                      <Send className="w-3.5 h-3.5" />
                      {candidateEmailSending ? 'Sending...' : 'Send Message'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}