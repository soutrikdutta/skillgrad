import React, { useState, useEffect } from 'react';
import { dbService } from '../firebase/dbService';
import { useAuth } from '../context/AuthContext';
import { 
  Briefcase, Building2, DollarSign, Clock, MapPin, Mail, 
  Award, ExternalLink, MessageSquare, CheckCircle2, ChevronRight,
  Printer, X, ShieldCheck, Download, Sparkles
} from 'lucide-react';

export default function JoinedInternships() {
  const { user, addToast } = useAuth();
  const [joinedList, setJoinedList] = useState([]);
  const [selectedHRJob, setSelectedHRJob] = useState(null);
  const [hrSubject, setHrSubject] = useState('');
  const [hrMessage, setHrMessage] = useState('');
  const [hrSending, setHrSending] = useState(false);
  const [viewingCert, setViewingCert] = useState(null);

  const loadJoined = async () => {
    if (!user) return;
    const list = await dbService.getJoinedInternships(user);
    setJoinedList(list);
  };

  useEffect(() => {
    loadJoined();
    const handleSync = () => loadJoined();
    window.addEventListener('skillgrad_application_status_changed', handleSync);
    window.addEventListener('skillgrad_certificate_issued', handleSync);
    return () => {
      window.removeEventListener('skillgrad_application_status_changed', handleSync);
      window.removeEventListener('skillgrad_certificate_issued', handleSync);
    };
  }, [user]);

  const handleSendHRMessage = async (e) => {
    e.preventDefault();
    if (!hrMessage.trim()) return;
    setHrSending(true);

    try {
      await dbService.sendContactMessage({
        name: user.displayName || user.email,
        email: user.email,
        phone: '',
        role: 'Accepted Intern',
        subject: `[Intern Inquiry] ${selectedHRJob.title}: ${hrSubject || 'General Question'}`,
        message: `Company: ${selectedHRJob.company}\nHR Contact: ${selectedHRJob.hrContactEmail}\n\nStudent Message:\n${hrMessage}`
      });
      addToast(`Message dispatched to HR (${selectedHRJob.hrContactEmail})!`, 'success');
      setSelectedHRJob(null);
      setHrSubject('');
      setHrMessage('');
    } catch {
      addToast('Error sending message to HR', 'error');
    } finally {
      setHrSending(false);
    }
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  if (!user || joinedList.length === 0) return null;

  return (
    <section id="joined-internships" className="py-12 sm:py-16 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-8 animate-slide-up flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-xs font-semibold text-emerald-300 mb-3 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <CheckCircle2 className="w-3.5 h-3.5 ml-0.5" />
              Active Enrollment Hub
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-white">
              <span className="flow-gradient-text">My Joined Internships</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Access your active roles, connect with HR & mentors, and download company-issued credentials.
            </p>
          </div>

          {user && (
            <div className="inline-flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-900/80 border border-white/[0.08] backdrop-blur-md self-start sm:self-auto">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'Google Profile'}
                  className="w-8 h-8 rounded-full object-cover border border-emerald-500/40 shadow-sm"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                  {(user.displayName || user.email || 'U')[0].toUpperCase()}
                </div>
              )}
              <div className="text-left">
                <p className="text-xs font-semibold text-white">{user.displayName || 'Enrolled Student'}</p>
                <p className="text-[10px] text-emerald-400 font-medium">Verified Active Intern</p>
              </div>
            </div>
          )}
        </div>

        {/* Joined Roles Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 stagger-children">
          {joinedList.map((job) => (
            <div 
              key={job.applicationId}
              className="glass-panel-interactive p-5 sm:p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between group transition-all duration-300 border-l-4 border-l-emerald-500"
            >
              {/* Header */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">{job.company}</span>
                    <h3 className="text-lg font-bold font-display text-white mt-0.5 group-hover:text-emerald-200 transition-colors">{job.title}</h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Enrolled
                  </span>
                </div>

                {/* Details Pill Strip */}
                <div className="py-2 px-3 rounded-lg bg-slate-900/80 border border-white/[0.06] flex items-center justify-between text-xs mb-4">
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

                {/* Certificate Status Block */}
                {job.certificate ? (
                  <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/25 mb-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0 text-indigo-400">
                        <Award className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block">Official Certificate Issued</span>
                        <p className="text-xs font-mono font-bold text-white truncate">{job.certificate.serialNumber || job.certificate.serial_number}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setViewingCert(job.certificate)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold flex items-center gap-1 shrink-0 transition-all cursor-pointer active:scale-95 shadow-md shadow-indigo-600/25"
                    >
                      <Download className="w-3 h-3" />
                      Download
                    </button>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-white/[0.06] mb-4 flex items-center gap-2.5 text-xs text-slate-400">
                    <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Certificate in progress. Will be issued by {job.company} upon milestone completion.</span>
                  </div>
                )}
              </div>

              {/* Action Strip: Contact HR + Workspace */}
              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedHRJob(job)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border border-white/[0.08] active:scale-95"
                >
                  <Mail className="w-3.5 h-3.5 text-emerald-400" />
                  Contact HR
                </button>

                <a
                  href={`mailto:${job.hrContactEmail}?subject=${encodeURIComponent(`SkillGrad Intern Inquiry - ${job.title}`)}`}
                  className="text-[11px] text-slate-400 hover:text-cyan-300 transition-colors truncate max-w-[180px] font-mono"
                  title={job.hrContactEmail}
                >
                  {job.hrContactEmail}
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Modal 1: Contact HR Dialog */}
        {selectedHRJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
            <div 
              className="relative w-full max-w-lg glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedHRJob(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-5">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 mb-1">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{selectedHRJob.company} HR Desk</span>
                </div>
                <h3 className="text-xl font-bold font-display text-white">
                  Message Hiring Manager
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Direct inquiry for <strong className="text-white">{selectedHRJob.title}</strong> to <strong className="text-emerald-300 font-mono">{selectedHRJob.hrContactEmail}</strong>.
                </p>
              </div>

              <form onSubmit={handleSendHRMessage} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Topic / Subject</label>
                  <input
                    type="text"
                    value={hrSubject}
                    onChange={(e) => setHrSubject(e.target.value)}
                    placeholder="e.g. Schedule onboarding sync / GitHub access"
                    className="w-full px-3.5 py-2 rounded-xl glass-input text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Message *</label>
                  <textarea
                    rows="4"
                    required
                    value={hrMessage}
                    onChange={(e) => setHrMessage(e.target.value)}
                    placeholder="Write your note or question to the company coordinator..."
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs sm:text-sm"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedHRJob(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={hrSending}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/25 flex items-center gap-1.5 cursor-pointer disabled:opacity-60 active:scale-95"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    {hrSending ? 'Sending...' : 'Send to HR'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal 2: Official Verifiable Certificate Download View */}
        {viewingCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
            <div 
              className="relative w-full max-w-2xl glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl animate-scale-in my-8"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setViewingCert(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Printable Certificate Frame */}
              <div id="certificate-print-area" className="p-6 sm:p-8 rounded-2xl bg-[#0b0e14] border-2 border-amber-500/40 relative overflow-hidden shadow-2xl">
                {/* Certificate Background watermark */}
                <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-amber-500/5 filter blur-3xl pointer-events-none" />

                {/* Certificate Header */}
                <div className="text-center pb-6 border-b border-white/[0.08] relative z-10">
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-[10px] font-bold tracking-widest uppercase text-amber-300 mb-2">
                    <ShieldCheck className="w-3 h-3" /> SkillGrad Verified Credential
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white">
                    Certificate of Completion
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 uppercase tracking-wider">
                    This certifies the professional commercial internship deliverables of
                  </p>
                </div>

                {/* Candidate Name */}
                <div className="text-center py-6 relative z-10">
                  <h2 className="text-2xl sm:text-4xl font-extrabold font-display text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-amber-300">
                    {viewingCert.studentName || viewingCert.student_name}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-md mx-auto">
                    for outstanding performance as a <strong>{viewingCert.roleTitle || viewingCert.role_title}</strong> intern at <strong className="text-white">{viewingCert.companyName || viewingCert.company_name}</strong>.
                  </p>
                </div>

                {/* Certificate Meta Grid */}
                <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-white/[0.06] text-center text-xs relative z-10 my-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Serial Number</span>
                    <strong className="text-amber-300 font-mono text-[11px] sm:text-xs">
                      {viewingCert.serialNumber || viewingCert.serial_number}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Performance Grade</span>
                    <strong className="text-emerald-400 text-[11px] sm:text-xs">
                      {viewingCert.grade || 'A+ (Distinction)'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Date of Issue</span>
                    <strong className="text-slate-200 text-[11px] sm:text-xs">
                      {viewingCert.issueDate || viewingCert.issue_date}
                    </strong>
                  </div>
                </div>

                {/* Footer seal */}
                <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-slate-400 relative z-10">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Tamper-Proof Holographic Record</span>
                  </div>
                  <span className="font-mono text-slate-500">skillgrad.org/verify</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={handlePrintCertificate}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/25 flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print / Save as PDF
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}
