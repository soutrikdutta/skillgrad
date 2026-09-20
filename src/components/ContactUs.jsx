import React, { useState } from 'react';
import { dbService } from '../firebase/dbService';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import { Mail, Clock, Send, AlertCircle } from 'lucide-react';

export default function ContactUs() {
  const { addToast } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('Student');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  const validate = () => {
    if (!name.trim() || name.trim().length < 2) {
      setFormError('Please enter your full name (minimum 2 characters).');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setFormError('Please enter a valid email address.');
      return false;
    }
    if (!message.trim() || message.trim().length < 10) {
      setFormError('Please write a message with at least 10 characters.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!validate()) {
      addToast('Please complete all required fields correctly.', 'error');
      return;
    }

    setIsSending(true);
    try {
      const res = await dbService.sendContactMessage({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        role,
        subject: subject.trim() || 'General Inquiry',
        message: message.trim()
      });

      if (res.success) {
        setIsSubmitted(true);
        confetti({ particleCount: 70, spread: 60 });
        addToast('Message dispatched directly to 2006soutrik@gmail.com!', 'success');
      }
    } catch (err) {
      addToast('Error sending message. Please try again.', 'error');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Info Column */}
          <div className="lg:col-span-5 space-y-6 animate-slide-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-xs font-semibold text-indigo-300 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              <Mail className="w-3.5 h-3.5 ml-0.5" />
              Get in Touch
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-white">
              Have Questions? <span className="flow-gradient-text">Let's Connect</span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Whether you are an aspiring student, university coordinator, or employer seeking talent, we respond promptly.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-3 p-4 rounded-2xl glass-panel">
                <div className="w-10 h-10 rounded-xl bg-primary-600/20 border border-primary-500/30 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-primary-400" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Direct Support Email</span>
                  <p className="text-xs sm:text-sm font-semibold text-white font-mono">2006soutrik@gmail.com</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-2xl glass-panel">
                <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Response Turnaround</span>
                  <p className="text-xs sm:text-sm font-semibold text-slate-200">Within 24 hours</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Card */}
          <div className="lg:col-span-7">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl">
              
              {isSubmitted ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto text-3xl">
                    ✓
                  </div>
                  <h3 className="text-2xl font-bold font-display text-white">Message Delivered!</h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                    Thank you, <strong className="text-white">{name}</strong>. Your inquiry has been forwarded directly to <strong className="text-white font-mono">2006soutrik@gmail.com</strong>.
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setName('');
                      setEmail('');
                      setPhone('');
                      setSubject('');
                      setMessage('');
                    }}
                    className="px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-semibold"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  
                  {formError && (
                    <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                      <span>{formError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => { setName(e.target.value); setFormError(''); }}
                        placeholder="John Doe"
                        className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setFormError(''); }}
                        placeholder="john@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">I am a</label>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl glass-input text-xs"
                      >
                        <option value="Student" className="bg-slate-900 text-white">Student / Learner</option>
                        <option value="Company Recruiter" className="bg-slate-900 text-white">Company Recruiter</option>
                        <option value="College Representative" className="bg-slate-900 text-white">College Representative</option>
                        <option value="Mentor" className="bg-slate-900 text-white">Industry Mentor</option>
                        <option value="Other" className="bg-slate-900 text-white">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number (Optional)</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 9876543210"
                        className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Subject</label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Question about upcoming AI internships"
                      className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Your Message * (min. 10 characters)</label>
                    <textarea
                      rows="4"
                      required
                      value={message}
                      onChange={(e) => { setMessage(e.target.value); setFormError(''); }}
                      placeholder="Write your message here..."
                      className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs sm:text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSending}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-600 via-indigo-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                  >
                    {isSending ? (
                      <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Direct Message to 2006soutrik@gmail.com
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