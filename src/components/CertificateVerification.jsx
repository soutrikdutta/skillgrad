import React, { useState } from 'react';
import { MOCK_CERTIFICATES } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { Award, Search, ShieldCheck, CheckCircle, ExternalLink, QrCode, Printer, X, Download } from 'lucide-react';

export default function CertificateVerification() {
  const { addToast } = useAuth();
  const [certId, setCertId] = useState('SG-2024-8842');
  const [verifiedCert, setVerifiedCert] = useState(null);
  const [searched, setSearched] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);

  const handleVerify = (e) => {
    e?.preventDefault();
    const cleanId = certId.trim().toUpperCase();
    setSearched(true);

    if (MOCK_CERTIFICATES[cleanId]) {
      setVerifiedCert(MOCK_CERTIFICATES[cleanId]);
      addToast('Certificate verified successfully!', 'success');
    } else {
      // Dynamic certificate fallback for demo
      if (cleanId.startsWith('SG-')) {
        const dynamicCert = {
          id: cleanId,
          studentName: 'Verified SkillGrad Scholar',
          program: 'Industry Practical Internship Program',
          company: 'SkillGrad Enterprise Partner',
          issueDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          completionGrade: 'Honors (96%)',
          skillsVerified: ['System Design', 'Production Coding', 'Agile Workflows', 'Clean Architecture'],
          status: 'Verified & Authentic'
        };
        setVerifiedCert(dynamicCert);
        addToast('Certificate verified successfully!', 'success');
      } else {
        setVerifiedCert(null);
        addToast('No certificate found for this ID. Try SG-2024-8842 or SG-2024-9103.', 'error');
      }
    }
  };

  return (
    <section id="certifications" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-400 mb-3">
            <Award className="w-3.5 h-3.5" />
            Verified Credential System
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
            Certificate & Credential Verification
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Every SkillGrad certificate carries a cryptographically verifiable ID. Authenticate student credentials in real-time.
          </p>
        </div>

        {/* Lookup Box */}
        <div className="max-w-2xl mx-auto glass-panel p-6 sm:p-8 rounded-2xl border-slate-700/80 shadow-2xl">
          <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Enter Certificate ID (e.g. SG-2024-8842)"
                value={certId}
                onChange={(e) => setCertId(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm uppercase tracking-wider focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-mono"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 shrink-0"
            >
              <ShieldCheck className="w-4 h-4" />
              Verify Credential
            </button>
          </form>

          {/* Quick sample chips */}
          <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-400">
            <span>Try sample IDs:</span>
            {['SG-2024-8842', 'SG-2024-9103', 'SG-2024-7731'].map((sample) => (
              <button
                key={sample}
                type="button"
                onClick={() => { setCertId(sample); }}
                className="px-2 py-0.5 rounded bg-slate-800 text-amber-300/90 hover:bg-slate-700 font-mono"
              >
                {sample}
              </button>
            ))}
          </div>

          {/* Verified Certificate Result Card */}
          {searched && verifiedCert && (
            <div className="mt-8 pt-6 border-t border-slate-800 animate-fadeIn">
              <div className="p-5 rounded-xl bg-slate-900/90 border border-emerald-500/30 relative overflow-hidden">
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-bold text-emerald-400">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Authentic Credential
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Recipient Student</span>
                    <h4 className="text-xl font-bold font-display text-white">{verifiedCert.studentName}</h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400">Program / Track:</span>
                      <p className="font-semibold text-slate-200">{verifiedCert.program}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Host Partner:</span>
                      <p className="font-semibold text-slate-200">{verifiedCert.company}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Issued On:</span>
                      <p className="font-semibold text-slate-200">{verifiedCert.issueDate}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Performance Grade:</span>
                      <p className="font-semibold text-emerald-400">{verifiedCert.completionGrade}</p>
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-400 block mb-1">Verified Competencies:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {verifiedCert.skillsVerified.map((s) => (
                        <span key={s} className="px-2 py-0.5 rounded bg-slate-800 text-[11px] font-medium text-slate-300 border border-slate-700">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 flex gap-2">
                    <button
                      onClick={() => setShowCertModal(true)}
                      className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-semibold flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      View Certificate Preview
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {searched && !verifiedCert && (
            <div className="mt-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center">
              No verified certificate found matching ID: <strong className="font-mono">{certId}</strong>.
            </div>
          )}
        </div>

      </div>

      {/* Visual Certificate Modal */}
      {showCertModal && verifiedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div 
            className="relative w-full max-w-2xl bg-slate-900 border-2 border-amber-500/40 rounded-2xl p-6 sm:p-10 shadow-2xl shadow-amber-950/40 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Close */}
            <button
              onClick={() => setShowCertModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Certificate Canvas Mockup */}
            <div className="border-4 border-double border-amber-500/40 p-6 sm:p-8 rounded-xl bg-gradient-to-b from-slate-950 to-slate-900 text-center space-y-4 relative">
              <div className="text-xs uppercase tracking-[0.3em] font-bold text-amber-400">
                Official Credential
              </div>

              <div className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-wide">
                CERTIFICATE OF COMPLETION
              </div>

              <p className="text-xs text-slate-400 italic">
                This document certifies that
              </p>

              <div className="text-2xl sm:text-3xl font-bold font-display text-amber-300 underline decoration-amber-500/50 underline-offset-8">
                {verifiedCert.studentName}
              </div>

              <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed pt-2">
                has successfully completed the intensive industry project in <strong className="text-white">{verifiedCert.program}</strong> in collaboration with <strong className="text-white">{verifiedCert.company}</strong>.
              </p>

              <div className="pt-6 grid grid-cols-2 gap-4 border-t border-slate-800 text-xs">
                <div>
                  <span className="text-[10px] uppercase text-slate-400 block font-mono">Credential ID</span>
                  <strong className="font-mono text-white text-xs">{verifiedCert.id}</strong>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-400 block">Date of Issue</span>
                  <strong className="text-white text-xs">{verifiedCert.issueDate}</strong>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                Print / Save PDF
              </button>
              <button
                onClick={() => setShowCertModal(false)}
                className="px-4 py-2 rounded-xl bg-primary-600 text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}