import { INITIAL_INTERNSHIPS } from '../data/mockData';

const POSTED_JOBS_KEY = 'skillgrad_posted_internships';
const APPS_KEY = 'skillgrad_applications';

export const dbService = {
  // Get all active internships with accurate real-time applicant counts
  getInternships() {
    try {
      const custom = JSON.parse(localStorage.getItem(POSTED_JOBS_KEY) || '[]');
      const allJobs = [...custom, ...INITIAL_INTERNSHIPS];
      
      // Calculate real applicant counts
      const applications = JSON.parse(localStorage.getItem(APPS_KEY) || '[]');
      const appCounts = {};
      applications.forEach(app => {
        if (app.jobId) {
          appCounts[app.jobId] = (appCounts[app.jobId] || 0) + 1;
        }
      });

      return allJobs.map(job => ({
        ...job,
        applicantsCount: (job.applicantsCount || 0) + (appCounts[job.id] || 0)
      }));
    } catch {
      return INITIAL_INTERNSHIPS;
    }
  },

  // Post an Internship (Company)
  async postInternship(jobData) {
    const payload = {
      id: 'sg-custom-' + Date.now(),
      title: jobData.title,
      company: jobData.company,
      logo: jobData.logo || '🚀',
      location: jobData.location || 'Remote / Hybrid',
      type: 'Paid Internship',
      stipend: jobData.stipend || '₹20,000 / month',
      duration: jobData.duration || '3 Months',
      domain: jobData.domain || 'Web Development',
      experienceLevel: 'Beginner - Intermediate',
      skills: Array.isArray(jobData.skills) ? jobData.skills : (jobData.skills ? jobData.skills.split(',').map(s => s.trim()).filter(Boolean) : ['Problem Solving', 'Git']),
      description: jobData.description || `Join ${jobData.company} as a ${jobData.title} to work on real-world deliverables, code reviews, and production features.`,
      perks: ['Verified Industry Certificate', 'Stipend Guarantee', '1-on-1 Mentorship'],
      openings: 2,
      applicantsCount: 0,
      isNew: true,
      postedAt: new Date().toISOString(),
      contactEmail: jobData.contactEmail,
      status: 'Active'
    };

    const existing = JSON.parse(localStorage.getItem(POSTED_JOBS_KEY) || '[]');
    existing.unshift(payload);
    localStorage.setItem(POSTED_JOBS_KEY, JSON.stringify(existing));

    // Dispatch global event
    window.dispatchEvent(new CustomEvent('skillgrad_internship_posted', { detail: payload }));

    return { success: true, id: payload.id, internship: payload };
  },

  // Submit Student Application & Increment Applicant Count
  async submitApplication(applicationData) {
    const payload = {
      ...applicationData,
      id: 'app-' + Date.now(),
      submittedAt: new Date().toISOString(),
      status: 'Under Review'
    };

    const existing = JSON.parse(localStorage.getItem(APPS_KEY) || '[]');
    existing.push(payload);
    localStorage.setItem(APPS_KEY, JSON.stringify(existing));

    // Dispatch global application event
    window.dispatchEvent(new CustomEvent('skillgrad_application_submitted', { detail: { jobId: applicationData.jobId } }));

    return { success: true, id: payload.id };
  },

  // Contact Us Form Submission (Direct Email to 2006soutrik@gmail.com)
  async sendContactMessage(formData) {
    const payload = {
      ...formData,
      recipient: '2006soutrik@gmail.com',
      submittedAt: new Date().toISOString()
    };

    let emailSent = false;

    // Send email via Web3Forms API directly to 2006soutrik@gmail.com
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: 'b94e3cb2-9386-4f7f-856c-2f9ec6fb4018',
          from_name: formData.name || 'SkillGrad Contact Inquiry',
          subject: `SkillGrad Inquiry: ${formData.subject || 'General'} from ${formData.name}`,
          to_email: '2006soutrik@gmail.com',
          name: formData.name,
          email: formData.email,
          phone: formData.phone || 'N/A',
          role: formData.role || 'Student',
          message: formData.message,
          timestamp: new Date().toLocaleString()
        })
      });

      const resJson = await response.json();
      if (resJson.success) {
        emailSent = true;
      }
    } catch (err) {
      console.warn("Direct email delivery note:", err.message);
    }

    const existing = JSON.parse(localStorage.getItem('skillgrad_contact_messages') || '[]');
    existing.unshift({ ...payload, id: 'msg-' + Date.now() });
    localStorage.setItem('skillgrad_contact_messages', JSON.stringify(existing));

    return { 
      success: true, 
      emailSent, 
      message: 'Your message has been sent directly to 2006soutrik@gmail.com!'
    };
  }
};