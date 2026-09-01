import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { dbService } from '../firebase/dbService';
import confetti from 'canvas-confetti';
import { Building2, PlusCircle, CheckCircle2, Sparkles, Send, Users, ShieldCheck } from 'lucide-react';

export default function CompanyPortal() {
  const { addToast } = useAuth();
  const [companyName, setCompanyName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [domain, setDomain] = useState('Web Development');
  const [stipend, setStipend] = useState('₹20,000 - ₹25,000 / month');
  const [duration, setDuration] = useState('3 Months');
  const [skills, setSkills] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPosted, setIsPosted] = useState(false);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!companyName || !contactEmail || !jobTitle) {
      addToast('Please complete required fields', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await dbService.postInternship({
        company: companyName,
        contactEmail,
        title: jobTitle,
        domain,
        stipend,
        duration,
        skills: skills.split(',').map(s => s.trim()).filter(Boolean),
        description
      });

      if (res.success) {
        setIsPosted(true);
        confetti({ particleCount: 70, spread: 60 });
        addToast('Internship opportunity submitted and listed!', 'success');
      }
    } catch (err) {
      addToast('Failed to post role. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="companies" className="py-24 bg-slate-950/60 relative border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Form Card */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border-slate-700/80 shadow-2xl">
              <div className="flex items-center justify-between pb-5 mb-5 border-b border-slate-800">
                <div>
                  <h3 className="text-xl font-bold font-display text-white">
                    {isPosted ? 'Role Posted Successfully!' : 'Post an Internship Opening'}
                  </h3>
                  <p className="text-xs text-slate-400">Connect with pre-vetted, project-ready talent</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Employer Portal
                </span>
              </div>

              {isPosted ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mx-auto text-3xl">
                    ✓
                  </div>
                  <h4 className="text-xl font-bold text-white">Your Listing is Now Active!</h4>
                  <p className="text-xs text-slate-300 max-w-md mx-auto">
                    We've started matching candidate portfolios for <strong className="text-white">{jobTitle}</strong>. Applicant profiles will be forwarded to <strong className="text-white">{contactEmail}</strong>.
                  </p>
                  <button
                    onClick={() => {
                      setIsPosted(false);
                      setJobTitle('');
                      setDescription('');
                    }}
                    className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold"
                  >
                    Post Another Role
                  </button>
                </div>
              ) : (
                <form onSubmit={handlePost} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Company / Startup Name *</label>
                      <input
                        type="text"
                        required
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Acme Tech Labs"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Hiring Contact Email *</label>
                      <input
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="talent@acmetech.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Internship Title *</label>
                      <input
                        type="text"
                        required
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        placeholder="Frontend React Engineer Intern"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Domain</label>
                      <select
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Monthly Stipend Range</label>
                      <input
                        type="text"
                        value={stipend}
                        onChange={(e) => setStipend(e.target.value)}
                        placeholder="₹20,000 - ₹28,000 / month"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Duration</label>
                      <select
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                      >
                        <option value="3 Months">3 Months</option>
                        <option value="6 Months">6 Months</option>
                        <option value="Flexible / Part-time">Flexible / Part-time</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Required Skills (comma separated)</label>
                    <input
                      type="text"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      placeholder="React, TypeScript, Tailwind, Git"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Project Scope & Deliverables</label>
                    <textarea
                      rows="3"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Briefly describe what the student will work on..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs shadow-lg shadow-cyan-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
                  >
                    {isSubmitting ? (
                      <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <PlusCircle className="w-4 h-4" />
                        Publish Internship Listing
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right Info Column */}
          <div className="lg:col-span-5 order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-400 mb-3">
              <Building2 className="w-3.5 h-3.5" />
              For Companies & Recruiters
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight leading-tight">
              Hire <span className="gradient-text">Pre-Vetted Student Talent</span>
            </h2>

            <p className="text-sm text-slate-300 mt-4 leading-relaxed">
              Stop sifting through hundreds of generic resumes. SkillGrad provides verified engineering and design talent evaluated through actual codebase contributions.
            </p>

            <div className="mt-8 space-y-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Zero Upfront Listing Fee</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Post roles for free and review pre-ranked candidates instantly.</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
                <Users className="w-5 h-5 text-primary-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">High Conversion to Full-Time</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Evaluate intern performance on real sprints before extending full-time PPOs.</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}