import React, { useState, useEffect } from 'react';
import { dbService } from '../firebase/dbService';
import { useAuth } from '../context/AuthContext';
import { 
  Briefcase, Building2, DollarSign, Clock, MapPin, Mail, 
  Award, ExternalLink, MessageSquare, CheckCircle2, ChevronRight,
  Download, Sparkles, X, ShieldCheck
} from 'lucide-react';
import CertificateModal from './CertificateModal';

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
    if (!user) return;

    // Real-time Firestore synchronization for certificates & enrolled roles
    const unsubCerts = dbService.subscribeStudentCertificates(user, () => {
      loadJoined();
    });

    const handleSync = () => loadJoined();
    window.addEventListener('skillgrad_application_status_changed', handleSync);
    window.addEventListener('skillgrad_certificate_issued', handleSync);
    return () => {
      if (unsubCerts) unsubCerts();
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
              Active Enrollment & Credentials Hub
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-white">
              <span className="flow-gradient-text">My Joined Roles & Certificates</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Access your enrolled micro-internships, communicate with hiring managers, and download tamper-proof certificates.
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
                <p className="text-[10px] text-emerald-400 font-medium">Verified Active Scholar</p>
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
                    {job.status || 'Enrolled'}
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
                  <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-transparent border border-amber-500/30 mb-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-300">
                        <Award className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">Official Verified Credential</span>
                        <p className="text-xs font-mono font-bold text-white truncate">{job.certificate.serialNumber || job.certificate.serial_number}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setViewingCert(job.certificate)}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer active:scale-95 shadow-md shadow-amber-500/25"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download (1 Page PDF)
                    </button>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-white/[0.06] mb-4 flex items-center gap-2.5 text-xs text-slate-400">
                    <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Certificate in progress. Will be issued by {job.company} upon deliverable milestones.</span>
                  </div>
                )}
              </div>

              {/* Action Strip: Contact HR + Workspace */}
              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2">
                <button
                  type="button"
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
                type="button"
                onClick={() => setSelectedHRJob(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
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

        {/* Modal 2: Official Verified Certificate Modal with Single-Page PDF/PNG Download */}
        {viewingCert && (
          <CertificateModal
            certificate={viewingCert}
            onClose={() => setViewingCert(null)}
          />
        )}

      </div>
    </section>
  );
}
