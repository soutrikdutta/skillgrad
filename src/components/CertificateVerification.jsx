import React, { useState } from 'react';
import { MOCK_CERTIFICATES } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { Award, Search, ShieldCheck, CheckCircle, ExternalLink, Printer, X } from 'lucide-react';

export default function CertificateVerification() {
  const { addToast } = useAuth();
  const [certId, setCertId] = useState('SG-2024-8842');
  const [verifiedCert, setVerifiedCert] = useState(null);
  const [searched, setSearched] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);

  const handleVerify = (e) => {
    e?.preventDefault();
    const cleanId = certId.trim().toUpperCase();
    if (!cleanId) {
      addToast('Please enter a certificate ID', 'error');
      return;
    }
    setSearched(true);

    if (MOCK_CERTIFICATES[cleanId]) {
      setVerifiedCert(MOCK_CERTIFICATES[cleanId]);
      addToast('Certificate verified successfully!', 'success');
    } else {
      if (cleanId.startsWith('SG-')) {
        const dynamicCert = {
          id: cleanId,
          studentName: 'Verified SkillGrad Scholar',
          program: 'Industry Practical Internship Track',
          company: 'SkillGrad Partner Ecosystem',
          issueDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          completionGrade: 'Honors (96%)',
          skillsVerified: ['System Design', 'Production Engineering', 'Agile Architecture'],
          status: 'Verified & Authentic'
        };
        setVerifiedCert(dynamicCert);
        addToast('Certificate verified successfully!', 'success');
      } else {
        setVerifiedCert(null);
        addToast('No certificate found for this ID. Try SG-2024-8842.', 'error');
      }
    }
  };

  return (
    <section id="certifications" className="py-24 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-semibold text-amber-400 mb-3 backdrop-blur-md">
            <Award className="w-3.5 h-3.5" />
            Verified Credential System
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
            Certificate Verification
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Every SkillGrad completion certificate carries a verifiable ID. Authenticate credentials in real-time.
          </p>
        </div>

        {/* Frosted Glass Lookup Box */}
        <div className="max-w-2xl mx-auto glass-panel p-6 sm:p-8 rounded-3xl">
          <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Enter Certificate ID (e.g. SG-2024-8842)"
                value={certId}
                onChange={(e) => setCertId(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-xs sm:text-sm uppercase tracking-wider font-mono"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              Verify Credential
            </button>
          </form>

          {/* Quick sample chips */}
          <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-400">
            <span>Sample IDs:</span>
            {['SG-2024-8842', 'SG-2024-9103', 'SG-2024-7731'].map((sample) => (
              <button
                key={sample}
                type="button"
                onClick={() => { setCertId(sample); }}
                className="px-2.5 py-0.5 rounded-lg bg-slate-800/80 border border-white/10 text-amber-300 hover:bg-slate-700/80 font-mono text-[10px]"
              >
                {sample}
              </button>
            ))}
          </div>

          {/* Verified Certificate Result */}
          {searched && verifiedCert && (
            <div className="mt-6 pt-6 border-t border-white/10 animate-fadeIn">
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-emerald-500/30 relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Recipient Student</span>
                  <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-bold text-emerald-400">
                    <CheckCircle className="w-3 h-3" />
                    Authentic
                  </div>
                </div>

                <h4 className="text-xl font-bold font-display text-white mb-3">{verifiedCert.studentName}</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div>
                    <span className="text-slate-400">Track:</span>
                    <p className="font-semibold text-slate-200">{verifiedCert.program}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Host Partner:</span>
                    <p className="font-semibold text-slate-200">{verifiedCert.company}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Date Issued:</span>
                    <p className="font-semibold text-slate-200">{verifiedCert.issueDate}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Grade:</span>
                    <p className="font-semibold text-emerald-400">{verifiedCert.completionGrade}</p>
                  </div>
                </div>

                <div className="pt-4 flex gap-2">
                  <button
                    onClick={() => setShowCertModal(true)}
                    className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    View Certificate Preview
                  </button>
                </div>
              </div>
            </div>
          )}

          {searched && !verifiedCert && (
            <div className="mt-6 p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs text-center">
              No certificate found for ID: <strong className="font-mono">{certId}</strong>.
            </div>
          )}
        </div>

      </div>

      {/* Visual Certificate Modal */}
      {showCertModal && verifiedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div 
            className="relative w-full max-w-2xl glass-panel rounded-3xl p-6 sm:p-10 shadow-2xl border-2 border-amber-500/40"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowCertModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-2 border-amber-500/40 p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-slate-950/90 to-slate-900/90 text-center space-y-4">
              <div className="text-xs uppercase tracking-[0.3em] font-bold text-amber-400">
                Official Credential
              </div>

              <div className="text-2xl sm:text-3xl font-extrabold font-display text-white">
                CERTIFICATE OF COMPLETION
              </div>

              <p className="text-xs text-slate-400 italic">This document certifies that</p>

              <div className="text-2xl sm:text-3xl font-bold font-display text-amber-300">
                {verifiedCert.studentName}
              </div>

              <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
                has successfully completed the industry project in <strong className="text-white">{verifiedCert.program}</strong> in collaboration with <strong className="text-white">{verifiedCert.company}</strong>.
              </p>

              <div className="pt-6 grid grid-cols-2 gap-4 border-t border-white/10 text-xs">
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
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                Print / Save PDF
              </button>
              <button
                onClick={() => setShowCertModal(false)}
                className="px-4 py-2 rounded-xl bg-primary-600 text-white text-xs font-semibold cursor-pointer"
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