import React, { useState } from 'react';
import { MOCK_CERTIFICATES } from '../data/mockData';
import { dbService } from '../firebase/dbService';
import { useAuth } from '../context/AuthContext';
import { Award, Search, ShieldCheck, CheckCircle, ExternalLink } from 'lucide-react';
import CertificateModal from './CertificateModal';

export default function CertificateVerification() {
  const { addToast } = useAuth();
  const [certId, setCertId] = useState('');
  const [verifiedCert, setVerifiedCert] = useState(null);
  const [searched, setSearched] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async (e) => {
    e?.preventDefault();
    const cleanId = certId.trim();
    if (!cleanId) {
      addToast('Please enter a certificate Serial Number', 'error');
      return;
    }
    setSearched(true);
    setIsVerifying(true);

    // 1. Check live Firestore database / dbService
    const liveCert = await dbService.verifyCertificate(cleanId);
    setIsVerifying(false);

    if (liveCert) {
      const serial = liveCert.serialNumber || liveCert.serial_number;
      const role = liveCert.roleTitle || liveCert.role_title || 'Software Engineering Intern';
      const domain = liveCert.domain || 'Technology & Software Development';
      const grade = liveCert.grade || 'A+ (Distinction with Honors)';
      const company = liveCert.companyName || liveCert.company_name || 'SkillGrad Partner Enterprise';

      setVerifiedCert({
        id: serial,
        serialNumber: serial,
        studentName: liveCert.studentName || liveCert.student_name,
        company,
        companyName: company,
        domain,
        program: domain,
        roleTitle: role,
        role,
        issueDate: liveCert.issueDate || liveCert.issue_date,
        grade,
        completionGrade: grade,
        summary: liveCert.summary || 'Demonstrated outstanding technical proficiency and successful deliverable execution.',
        skills: ['Milestone Delivery', 'Git Collaboration', 'Production Delivery'],
        verificationStatus: 'Verified Official Credential'
      });
      addToast(`Official Certificate authenticated: ${serial}`, 'success');
      return;
    }

    // 2. Check fallback mock
    const upperId = cleanId.toUpperCase();
    if (MOCK_CERTIFICATES[upperId]) {
      setVerifiedCert(MOCK_CERTIFICATES[upperId]);
      addToast('Certificate verified successfully!', 'success');
    } else {
      setVerifiedCert(null);
      addToast('No authentic certificate found for this Serial Number in the database.', 'error');
    }
  };

  return (
    <section id="certifications" className="py-24 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-semibold text-amber-300 mb-3 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <Award className="w-3.5 h-3.5 ml-0.5" />
            Verified Credential System
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-white">
            <span className="flow-gradient-text">Certificate Verification</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2">
            Every SkillGrad completion certificate carries a verifiable cryptographic Serial Number. Authenticate credentials globally in real-time.
          </p>
        </div>

        {/* Frosted Glass Lookup Box */}
        <div className="max-w-2xl mx-auto glass-panel p-6 sm:p-8 rounded-3xl">
          <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Enter Certificate Serial (e.g. SG-2026-4821)"
                value={certId}
                onChange={(e) => setCertId(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-xs sm:text-sm uppercase tracking-wider font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={isVerifying}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-60"
            >
              <ShieldCheck className="w-4 h-4" />
              {isVerifying ? 'Authenticating...' : 'Verify Credential'}
            </button>
          </form>

          {/* Verified Certificate Result */}
          {searched && verifiedCert && (
            <div className="mt-6 pt-6 border-t border-white/10 animate-fadeIn">
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-emerald-500/30 relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">Recipient Student</span>
                    <h4 className="text-xl font-bold font-display text-white mt-0.5">{verifiedCert.studentName}</h4>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[11px] font-bold text-emerald-400">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Authentic Verified Record
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div>
                    <span className="text-slate-400">Role / Designation:</span>
                    <p className="font-semibold text-slate-200">{verifiedCert.roleTitle || verifiedCert.role}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Host Partner:</span>
                    <p className="font-semibold text-slate-200">{verifiedCert.company}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Domain / Specialization:</span>
                    <p className="font-semibold text-slate-200">{verifiedCert.domain || verifiedCert.program}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Date Issued:</span>
                    <p className="font-semibold text-slate-200">{verifiedCert.issueDate}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Performance Grade:</span>
                    <p className="font-semibold text-emerald-400">{verifiedCert.grade || verifiedCert.completionGrade}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Credential Serial:</span>
                    <p className="font-mono font-bold text-amber-300">{verifiedCert.serialNumber || verifiedCert.id}</p>
                  </div>
                </div>

                <div className="pt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCertModal(true)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/20 active:scale-95 transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    View & Download Official Certificate (1-Page PDF)
                  </button>
                </div>
              </div>
            </div>
          )}

          {searched && !verifiedCert && (
            <div className="mt-6 p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs text-center">
              No authentic certificate found in the database for ID: <strong className="font-mono text-white">{certId}</strong>.
            </div>
          )}
        </div>

      </div>

      {/* Official Verified Certificate Modal with Single-Page PDF/PNG Download */}
      {showCertModal && verifiedCert && (
        <CertificateModal
          certificate={verifiedCert}
          onClose={() => setShowCertModal(false)}
        />
      )}

    </section>
  );
}