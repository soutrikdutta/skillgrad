import React, { useRef, useState } from 'react';
import { Download, Printer, Image, X, ShieldCheck, Award, CheckCircle2, Sparkles, ExternalLink } from 'lucide-react';
import { downloadCertificatePDF, downloadCertificatePNG } from '../utils/certificateDownloader';

export default function CertificateModal({ certificate, onClose }) {
  const certRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadType, setDownloadType] = useState('');

  if (!certificate) return null;

  const serial = certificate.serialNumber || certificate.serial_number || certificate.id || 'SG-2026-CERT';
  const student = certificate.studentName || certificate.student_name || 'Accomplished Scholar';
  const company = certificate.companyName || certificate.company_name || certificate.company || 'Partner Enterprise';
  const role = certificate.roleTitle || certificate.role_title || certificate.role || certificate.domain || 'Software Engineering Intern';
  const domain = certificate.domain || certificate.program || 'Technology & Software Development';
  const grade = certificate.grade || certificate.completionGrade || 'A+ (Distinction with Honors)';
  const issueDate = certificate.issueDate || certificate.issue_date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const summary = certificate.summary || 'Demonstrated outstanding software engineering proficiency, rigorous technical milestones delivery, and commendable professional collaboration.';

  const handleDownloadPDF = async () => {
    setDownloading(true);
    setDownloadType('pdf');
    await downloadCertificatePDF(certRef.current, serial);
    setDownloading(false);
    setDownloadType('');
  };

  const handleDownloadPNG = async () => {
    setDownloading(true);
    setDownloadType('png');
    await downloadCertificatePNG(certRef.current, serial);
    setDownloading(false);
    setDownloadType('');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl glass-panel rounded-3xl p-4 sm:p-6 shadow-2xl animate-scale-in my-6 max-h-[95vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar Controls */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-display">Official Verified Credential</h3>
              <p className="text-[11px] text-slate-400 font-mono">Serial No: <span className="text-amber-300 font-bold">{serial}</span></p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Certificate Frame Preview */}
        <div className="overflow-x-auto overflow-y-auto flex-1 p-2 rounded-2xl bg-slate-950/60 border border-white/5 flex items-center justify-center">
          
          {/* THE AUTHENTIC PRINTABLE CERTIFICATE */}
          <div
            id="certificate-print-area"
            ref={certRef}
            className="w-[900px] min-w-[900px] h-[600px] bg-[#fcfbf7] text-slate-900 p-10 relative flex flex-col justify-between shadow-2xl select-none"
            style={{
              fontFamily: "'Georgia', 'Cambria', serif",
              boxSizing: 'border-box'
            }}
          >
            {/* Elegant Outer Border */}
            <div className="absolute inset-3 border-4 border-[#1e3a8a] pointer-events-none" />
            {/* Elegant Inner Gold Border */}
            <div className="absolute inset-5 border-2 border-[#d97706] pointer-events-none" />
            {/* Ornamental Corner Squares */}
            <div className="absolute top-4 left-4 w-4 h-4 bg-[#1e3a8a] rotate-45 pointer-events-none" />
            <div className="absolute top-4 right-4 w-4 h-4 bg-[#1e3a8a] rotate-45 pointer-events-none" />
            <div className="absolute bottom-4 left-4 w-4 h-4 bg-[#1e3a8a] rotate-45 pointer-events-none" />
            <div className="absolute bottom-4 right-4 w-4 h-4 bg-[#1e3a8a] rotate-45 pointer-events-none" />

            {/* Subtle Guilloche Watermark Pattern */}
            <div 
              className="absolute inset-8 pointer-events-none opacity-[0.035]"
              style={{
                backgroundImage: 'radial-gradient(#1e3a8a 1px, transparent 1px)',
                backgroundSize: '16px 16px'
              }}
            />

            {/* HEADER SECTION */}
            <div className="text-center relative z-10 pt-2">
              <div className="inline-flex items-center justify-center gap-2 mb-1">
                <span className="h-[1px] w-12 bg-[#b45309]" />
                <span className="text-[11px] tracking-[0.35em] uppercase font-bold text-[#b45309]" style={{ fontFamily: "sans-serif" }}>
                  SkillGrad National Industry Accreditation
                </span>
                <span className="h-[1px] w-12 bg-[#b45309]" />
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-[#0f172a] uppercase mt-1" style={{ letterSpacing: '2px' }}>
                Certificate of Completion
              </h1>
              <p className="text-[12px] text-slate-500 italic mt-1 font-serif">
                This official credential is proudly awarded to
              </p>
            </div>

            {/* RECIPIENT NAME */}
            <div className="text-center relative z-10 py-1">
              <div className="inline-block border-b-2 border-[#d97706] pb-1 px-8">
                <h2 className="text-3xl font-extrabold text-[#1e3a8a] tracking-wide italic">
                  {student}
                </h2>
              </div>
            </div>

            {/* CITATION STATEMENT */}
            <div className="text-center relative z-10 px-8">
              <p className="text-[13px] text-slate-700 leading-relaxed max-w-2xl mx-auto">
                for successful milestone completion and exemplary technical performance as an
              </p>
              <p className="text-lg font-bold text-[#0f172a] mt-1 tracking-wide">
                {role}
              </p>
              <p className="text-[12px] text-slate-600 mt-0.5">
                in <strong className="text-slate-900">{domain}</strong> hosted by <strong className="text-[#1e3a8a]">{company}</strong>.
              </p>
              <p className="text-[11px] text-slate-500 italic mt-2 max-w-xl mx-auto line-clamp-2">
                "{summary}"
              </p>
            </div>

            {/* CREDENTIAL VERIFICATION METRICS STRIP */}
            <div className="relative z-10 mx-10 py-2.5 px-6 rounded-lg bg-[#f4f0e8] border border-[#e2d9c8] grid grid-cols-4 gap-2 text-center text-[11px]" style={{ fontFamily: "sans-serif" }}>
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-500 block tracking-wider">Credential ID</span>
                <strong className="font-mono text-[#0f172a] text-[11px]">{serial}</strong>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-500 block tracking-wider">Performance Grade</span>
                <strong className="text-[#047857] font-semibold text-[11px]">{grade}</strong>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-500 block tracking-wider">Issue Date</span>
                <strong className="text-slate-800 text-[11px]">{issueDate}</strong>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-500 block tracking-wider">Authentication</span>
                <span className="inline-flex items-center gap-1 text-[#047857] font-bold text-[10px]">
                  <CheckCircle2 className="w-3 h-3" /> Authenticated
                </span>
              </div>
            </div>

            {/* FOOTER & SIGNATURES SECTION */}
            <div className="relative z-10 px-8 pt-1 flex items-end justify-between border-t border-slate-300/80 mt-2">
              
              {/* Left Signatory: Company */}
              <div className="text-center w-48">
                <div className="h-9 flex items-center justify-center">
                  <span className="font-serif italic text-base text-[#1e3a8a] font-bold tracking-wider" style={{ fontFamily: "'Brush Script MT', 'Dancing Script', cursive, serif" }}>
                    {company} Team
                  </span>
                </div>
                <div className="border-t border-slate-400 pt-1">
                  <p className="text-[10px] font-bold text-slate-800 uppercase tracking-wider" style={{ fontFamily: "sans-serif" }}>Authorized Signatory</p>
                  <p className="text-[9px] text-slate-500">{company}</p>
                </div>
              </div>

              {/* Center Official Gold Seal */}
              <div className="text-center flex flex-col items-center justify-center -mb-2">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#f59e0b] via-[#d97706] to-[#b45309] p-1 shadow-md flex items-center justify-center relative">
                  <div className="w-full h-full rounded-full border-2 border-dashed border-[#fef3c7] flex flex-col items-center justify-center text-white text-[8px] font-black uppercase text-center leading-tight">
                    <ShieldCheck className="w-4 h-4 mb-0.5 text-amber-200" />
                    <span>VERIFIED</span>
                    <span className="text-[6px] tracking-widest text-amber-200">OFFICIAL</span>
                  </div>
                </div>
                <span className="text-[8px] text-slate-400 font-mono mt-1 tracking-widest uppercase" style={{ fontFamily: "sans-serif" }}>
                  skillgrad.vercel.app
                </span>
              </div>

              {/* Right Signatory: SkillGrad */}
              <div className="text-center w-48">
                <div className="h-9 flex items-center justify-center">
                  <span className="font-serif italic text-base text-[#1e3a8a] font-bold tracking-wider" style={{ fontFamily: "'Brush Script MT', 'Dancing Script', cursive, serif" }}>
                    Soutrik Dutta
                  </span>
                </div>
                <div className="border-t border-slate-400 pt-1">
                  <p className="text-[10px] font-bold text-slate-800 uppercase tracking-wider" style={{ fontFamily: "sans-serif" }}>Director of Partnerships</p>
                  <p className="text-[9px] text-slate-500">SkillGrad Council</p>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Action Controls Bar */}
        <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Guaranteed 1-page pristine A4 landscape export.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-60 active:scale-95 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              {downloading && downloadType === 'pdf' ? 'Generating 1-Page PDF...' : 'Download PDF (1 Page)'}
            </button>

            <button
              type="button"
              onClick={handleDownloadPNG}
              disabled={downloading}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-60 active:scale-95 transition-all border border-white/10"
              title="Download high-resolution image for LinkedIn"
            >
              <Image className="w-3.5 h-3.5 text-cyan-400" />
              {downloading && downloadType === 'png' ? 'Saving Image...' : 'Save PNG Image'}
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs cursor-pointer border border-white/10"
              title="Browser Print / System Dialog"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-semibold cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
