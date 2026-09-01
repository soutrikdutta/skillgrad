import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { dbService } from '../firebase/dbService';
import confetti from 'canvas-confetti';
import { GraduationCap, Code, CheckCircle, ArrowRight, UserCheck, Sparkles, BookOpen } from 'lucide-react';

export default function StudentPortal() {
  const { user, openAuthModal, addToast } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [college, setCollege] = useState('');
  const [degree, setDegree] = useState('B.Tech / B.E.');
  const [gradYear, setGradYear] = useState('2025');
  const [skills, setSkills] = useState('');
  const [domain, setDomain] = useState('Full Stack Web Development');
  const [portfolio, setPortfolio] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      addToast('Please provide your name and email', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await dbService.submitApplication({
        type: 'student_profile_registration',
        name,
        email,
        college,
        degree,
        gradYear,
        skills: skills.split(',').map(s => s.trim()).filter(Boolean),
        domain,
        portfolioUrl: portfolio,
        userId: user ? user.uid : null
      });

      if (res.success) {
        setIsRegistered(true);
        confetti({ particleCount: 60, spread: 60 });
        addToast('Student profile registered in SkillGrad Talent Pool!', 'success');
      }
    } catch (err) {
      addToast('Registration error. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="students" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Info Column */}
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 mb-3">
              <GraduationCap className="w-3.5 h-3.5" />
              For Students & Recent Graduates
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight leading-tight">
              Get Discovered by <span className="gradient-text">Top Tech Companies</span>
            </h2>

            <p className="text-sm text-slate-300 mt-4 leading-relaxed">
              Register your student profile once. Our AI matching engine scans your tech stack, projects, and domain preferences to directly recommend you to hiring founders and engineering leaders.
            </p>

            {/* Benefits list */}
            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">✓</div>
                <div>
                  <h4 className="text-sm font-bold text-white">Direct Project Invites</h4>
                  <p className="text-xs text-slate-400">Receive inbound internship offers tailored to your specific skillset.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">✓</div>
                <div>
                  <h4 className="text-sm font-bold text-white">Verified Career Credentials</h4>
                  <p className="text-xs text-slate-400">Earn verifiable certificates upon project delivery that boost your resume.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">✓</div>
                <div>
                  <h4 className="text-sm font-bold text-white">Fair Compensation Always</h4>
                  <p className="text-xs text-slate-400">All matched internships come with transparent, guaranteed stipends.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Card */}
          <div className="lg:col-span-7">
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border-slate-700/80 shadow-2xl relative">
              <div className="flex items-center justify-between pb-5 mb-5 border-b border-slate-800">
                <div>
                  <h3 className="text-xl font-bold font-display text-white">
                    {isRegistered ? 'Profile Registered!' : 'Build Your Student Profile'}
                  </h3>
                  <p className="text-xs text-slate-400">Takes under 2 minutes • 100% Free</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary-500/10 text-primary-400 border border-primary-500/20">
                  Talent Pool 2025/2026
                </span>
              </div>

              {isRegistered ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto text-3xl">
                    ✓
                  </div>
                  <h4 className="text-xl font-bold text-white">You're in the SkillGrad Talent Pool!</h4>
                  <p className="text-xs text-slate-300 max-w-md mx-auto">
                    We've matched your profile with live internships. You will receive notifications at <strong className="text-white">{email}</strong> whenever a matching opportunity opens.
                  </p>
                  <button
                    onClick={() => setIsRegistered(false)}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white"
                  >
                    Edit Profile
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Aarav Sharma"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="aarav@college.edu"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-primary-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-300 mb-1">College / University</label>
                      <input
                        type="text"
                        value={college}
                        onChange={(e) => setCollege(e.target.value)}
                        placeholder="National Institute of Technology"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Graduation Year</label>
                      <select
                        value={gradYear}
                        onChange={(e) => setGradYear(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white text-xs focus:outline-none focus:border-primary-500"
                      >
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                        <option value="2026">2026</option>
                        <option value="2027">2027+</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Preferred Domain</label>
                      <select
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white text-xs focus:outline-none focus:border-primary-500"
                      >
                        <option value="Full Stack Web Development">Full Stack Web Development</option>
                        <option value="AI / Machine Learning">AI / Machine Learning</option>
                        <option value="Data Science & Analytics">Data Science & Analytics</option>
                        <option value="UI/UX Product Design">UI/UX Product Design</option>
                        <option value="Cloud & DevOps">Cloud & DevOps</option>
                        <option value="Mobile App Dev (Flutter/React Native)">Mobile App Dev</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">GitHub / LinkedIn URL</label>
                      <input
                        type="url"
                        value={portfolio}
                        onChange={(e) => setPortfolio(e.target.value)}
                        placeholder="https://github.com/username"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-primary-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Skills (comma separated)</label>
                    <input
                      type="text"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      placeholder="React, Node.js, Python, Tailwind, PostgreSQL, Git"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-primary-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
                  >
                    {isSubmitting ? (
                      <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <UserCheck className="w-4 h-4" />
                        Join SkillGrad Talent Pool
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}