import React from 'react';
import SkillGradLogo from './SkillGradLogo';
import { ArrowUp, Github, Twitter, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 pt-16 pb-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/60">
          
          {/* Col 1: Brand */}
          <div className="lg:col-span-2 space-y-4">
            <SkillGradLogo />
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              SkillGrad empowers college students and early-career talent with real-world paid internships, verified credentials, and high-impact industry mentorship.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: For Students */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">For Students</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#opportunities" className="hover:text-primary-400 transition-colors">Browse Internships</a></li>
              <li><a href="#students" className="hover:text-primary-400 transition-colors">Register Profile</a></li>
              <li><a href="#certifications" className="hover:text-primary-400 transition-colors">Verify Certificate</a></li>
              <li><a href="#features" className="hover:text-primary-400 transition-colors">Stipend Guarantee</a></li>
            </ul>
          </div>

          {/* Col 3: For Companies */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">For Companies</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#companies" className="hover:text-cyan-400 transition-colors">Post Internship</a></li>
              <li><a href="#companies" className="hover:text-cyan-400 transition-colors">Talent Sourcing</a></li>
              <li><a href="#about" className="hover:text-cyan-400 transition-colors">Partner Programs</a></li>
              <li><a href="#contact" className="hover:text-cyan-400 transition-colors">Recruiter Support</a></li>
            </ul>
          </div>

          {/* Col 4: Domains */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Top Tracks</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><span className="hover:text-slate-300">AI & Machine Learning</span></li>
              <li><span className="hover:text-slate-300">Full Stack Web Dev</span></li>
              <li><span className="hover:text-slate-300">Cloud & DevOps</span></li>
              <li><span className="hover:text-slate-300">UI / UX Product Design</span></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} SkillGrad. All rights reserved. Bridging Skills and Industry.
          </div>

          <div className="flex items-center gap-4">
            <a href="#about" className="hover:text-slate-400">Privacy Policy</a>
            <span>•</span>
            <a href="#about" className="hover:text-slate-400">Terms of Service</a>
            <span>•</span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Scroll to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}