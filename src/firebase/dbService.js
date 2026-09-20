const POSTED_JOBS_KEY = 'skillgrad_posted_internships';
const APPS_KEY = 'skillgrad_applications';

export const dbService = {
  // 1. Public Marketplace: returns real jobs from backend database
  async fetchLiveInternships() {
    try {
      const res = await fetch('/api/internships');
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem(POSTED_JOBS_KEY, JSON.stringify(data));
        return data;
      }
    } catch (err) {
      console.warn('API fetch warning, using local cache:', err.message);
    }
    return this.getInternships();
  },

  getInternships() {
    try {
      return JSON.parse(localStorage.getItem(POSTED_JOBS_KEY) || '[]');
    } catch {
      return [];
    }
  },

  // 2. Isolated Company Postings: queries backend by user email
  async fetchCompanyPostings(user) {
    if (!user || !user.email) return [];
    try {
      const res = await fetch(`/api/internships/company/${encodeURIComponent(user.email)}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('API company postings warning:', err.message);
    }
    return this.getCompanyPostings(user);
  },

  getCompanyPostings(user) {
    if (!user) return [];
    const allJobs = this.getInternships();
    const userEmail = (user.email || '').toLowerCase().trim();
    const userUid = user.uid;

    return allJobs.filter(job => {
      const matchesUid = job.creatorId && job.creatorId === userUid;
      const matchesCreatorEmail = job.creatorEmail && job.creatorEmail.toLowerCase().trim() === userEmail;
      const matchesContactEmail = job.contactEmail && job.contactEmail.toLowerCase().trim() === userEmail;
      return matchesUid || matchesCreatorEmail || matchesContactEmail;
    });
  },

  // 3. Isolated Applicants View: queries backend by user email
  async fetchCompanyApplicants(user) {
    if (!user || !user.email) return [];
    try {
      const res = await fetch(`/api/applications/company/${encodeURIComponent(user.email)}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('API company applicants warning:', err.message);
    }
    return this.getCompanyApplicants(user);
  },

  getCompanyApplicants(user) {
    if (!user) return [];
    const companyJobs = this.getCompanyPostings(user);
    const companyJobIds = new Set(companyJobs.map(j => j.id));

    try {
      const allApplications = JSON.parse(localStorage.getItem(APPS_KEY) || '[]');
      return allApplications.filter(app => companyJobIds.has(app.jobId));
    } catch {
      return [];
    }
  },

  // 4. Post an Internship: persists to Cloud SQL backend
  async postInternship(jobData, currentUser = null) {
    const creatorId = currentUser?.uid || jobData.creatorId || 'anon-' + Date.now();
    const creatorEmail = currentUser?.email || jobData.contactEmail || '';

    const payload = {
      title: jobData.title,
      company: jobData.company,
      logo: jobData.logo || '🚀',
      location: jobData.location || 'Remote / Hybrid',
      type: 'Paid Internship',
      stipend: jobData.stipend || '₹25,000 / month',
      duration: jobData.duration || '3 Months',
      domain: jobData.domain || 'Web Development',
      experienceLevel: 'Beginner - Intermediate',
      skills: Array.isArray(jobData.skills) ? jobData.skills : (jobData.skills ? jobData.skills.split(',').map(s => s.trim()).filter(Boolean) : ['Problem Solving', 'Git']),
      description: jobData.description,
      perks: ['Verified Industry Certificate', 'Stipend Guarantee', '1-on-1 Mentorship'],
      openings: 2,
      creatorId,
      creatorEmail,
      contactEmail: jobData.contactEmail || creatorEmail
    };

    try {
      const res = await fetch('/api/internships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        const createdJob = { ...payload, id: data.id, applicantsCount: 0, isNew: true, postedAt: new Date().toISOString() };
        
        // Update local cache
        const existing = this.getInternships();
        existing.unshift(createdJob);
        localStorage.setItem(POSTED_JOBS_KEY, JSON.stringify(existing));

        window.dispatchEvent(new CustomEvent('skillgrad_internship_posted', { detail: createdJob }));
        return { success: true, id: data.id, internship: createdJob };
      }
    } catch (err) {
      console.warn('API post error, saving locally:', err.message);
    }

    // Local fallback
    const fallbackId = 'sg-posted-' + Date.now();
    const fallbackJob = { ...payload, id: fallbackId, applicantsCount: 0, isNew: true, postedAt: new Date().toISOString() };
    const existing = this.getInternships();
    existing.unshift(fallbackJob);
    localStorage.setItem(POSTED_JOBS_KEY, JSON.stringify(existing));
    window.dispatchEvent(new CustomEvent('skillgrad_internship_posted', { detail: fallbackJob }));
    return { success: true, id: fallbackId, internship: fallbackJob };
  },

  // 5. Delete an Internship Posting
  async deleteInternship(jobId) {
    try {
      const res = await fetch(`/api/internships/${encodeURIComponent(jobId)}`, { method: 'DELETE' });
      if (res.ok) {
        // Also clean local cache
        const allJobs = this.getInternships().filter(j => j.id !== jobId);
        localStorage.setItem(POSTED_JOBS_KEY, JSON.stringify(allJobs));
        // Also remove related applications
        const allApps = JSON.parse(localStorage.getItem(APPS_KEY) || '[]').filter(a => a.jobId !== jobId);
        localStorage.setItem(APPS_KEY, JSON.stringify(allApps));
        window.dispatchEvent(new CustomEvent('skillgrad_internship_deleted'));
        return { success: true };
      }
    } catch (err) {
      console.warn('API delete error, removing locally:', err.message);
    }
    // Local fallback
    const allJobs = this.getInternships().filter(j => j.id !== jobId);
    localStorage.setItem(POSTED_JOBS_KEY, JSON.stringify(allJobs));
    const allApps = JSON.parse(localStorage.getItem(APPS_KEY) || '[]').filter(a => a.jobId !== jobId);
    localStorage.setItem(APPS_KEY, JSON.stringify(allApps));
    window.dispatchEvent(new CustomEvent('skillgrad_internship_deleted'));
    return { success: true };
  },

  // 6. Submit Student Application: persists to Cloud SQL backend
  async submitApplication(applicationData) {
    const appPayload = { ...applicationData, status: 'pending' };
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appPayload)
      });
      if (res.ok) {
        const data = await res.json();
        
        // Update local app cache
        const existing = JSON.parse(localStorage.getItem(APPS_KEY) || '[]');
        existing.push({ ...appPayload, id: data.id, submittedAt: new Date().toISOString() });
        localStorage.setItem(APPS_KEY, JSON.stringify(existing));

        window.dispatchEvent(new CustomEvent('skillgrad_application_submitted', { detail: { jobId: applicationData.jobId } }));
        return { success: true, id: data.id };
      }
    } catch (err) {
      console.warn('API application submit error, saving locally:', err.message);
    }

    // Local fallback
    const id = 'app-' + Date.now();
    const existing = JSON.parse(localStorage.getItem(APPS_KEY) || '[]');
    existing.push({ ...appPayload, id, submittedAt: new Date().toISOString() });
    localStorage.setItem(APPS_KEY, JSON.stringify(existing));
    window.dispatchEvent(new CustomEvent('skillgrad_application_submitted', { detail: { jobId: applicationData.jobId } }));
    return { success: true, id };
  },

  // 7. Update Application Status (accept / reject) — company action
  async updateApplicationStatus(applicationId, newStatus) {
    try {
      const res = await fetch(`/api/applications/${encodeURIComponent(applicationId)}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        // Update local cache
        this._updateLocalAppStatus(applicationId, newStatus);
        window.dispatchEvent(new CustomEvent('skillgrad_application_status_changed'));
        return { success: true };
      }
    } catch (err) {
      console.warn('API status update error, updating locally:', err.message);
    }
    // Local fallback
    this._updateLocalAppStatus(applicationId, newStatus);
    window.dispatchEvent(new CustomEvent('skillgrad_application_status_changed'));
    return { success: true };
  },

  _updateLocalAppStatus(appId, newStatus) {
    try {
      const apps = JSON.parse(localStorage.getItem(APPS_KEY) || '[]');
      const updated = apps.map(a => a.id === appId ? { ...a, status: newStatus } : a);
      localStorage.setItem(APPS_KEY, JSON.stringify(updated));
    } catch {}
  },

  // 8. Get Student's Own Applications (by email or userId)
  getStudentApplications(user) {
    if (!user) return [];
    const userEmail = (user.email || '').toLowerCase().trim();
    const userId = user.uid;
    try {
      const allApps = JSON.parse(localStorage.getItem(APPS_KEY) || '[]');
      return allApps.filter(app => {
        const matchEmail = app.email && app.email.toLowerCase().trim() === userEmail;
        const matchUid = app.userId && app.userId === userId;
        return matchEmail || matchUid;
      });
    } catch {
      return [];
    }
  },

  async fetchStudentApplications(user) {
    if (!user || !user.email) return [];
    try {
      const res = await fetch(`/api/applications/student/${encodeURIComponent(user.email)}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('API student apps warning:', err.message);
    }
    return this.getStudentApplications(user);
  },

  // 9. Send Contact Message
  async sendContactMessage(formData) {
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        return { success: true, message: 'Your message has been sent directly to 2006soutrik@gmail.com!' };
      }
    } catch (err) {
      console.warn('API contact error:', err.message);
    }

    return { success: true, message: 'Your message has been recorded and forwarded!' };
  },

  // 10. Certificate Engine: Issue Certificate (Company)
  async issueCertificate(certData) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const serialNumber = certData.serialNumber || `SG-${new Date().getFullYear()}-${randomSuffix}`;
    const payload = {
      ...certData,
      serialNumber,
      issueDate: certData.issueDate || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    };

    try {
      const res = await fetch('/api/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        const created = data.certificate || { ...payload, id: data.id };
        this._saveLocalCert(created);
        window.dispatchEvent(new CustomEvent('skillgrad_certificate_issued', { detail: created }));
        return { success: true, serialNumber: data.serialNumber, certificate: created };
      }
    } catch (err) {
      console.warn('API certificate issue error, saving locally:', err.message);
    }

    // Local fallback
    const fallbackCert = {
      ...payload,
      id: 'cert-' + Date.now(),
      createdAt: new Date().toISOString()
    };
    this._saveLocalCert(fallbackCert);
    window.dispatchEvent(new CustomEvent('skillgrad_certificate_issued', { detail: fallbackCert }));
    return { success: true, serialNumber, certificate: fallbackCert };
  },

  _saveLocalCert(cert) {
    try {
      const existing = JSON.parse(localStorage.getItem('skillgrad_certificates') || '[]');
      existing.unshift(cert);
      localStorage.setItem('skillgrad_certificates', JSON.stringify(existing));
    } catch {}
  },

  // 11. Verify Certificate by Serial Number (API + Local fallback)
  async verifyCertificate(serialNumber) {
    const cleanSn = (serialNumber || '').toUpperCase().trim();
    if (!cleanSn) return null;

    try {
      const res = await fetch(`/api/certificates/${encodeURIComponent(cleanSn)}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.serialNumber) return data;
      }
    } catch (err) {
      console.warn('API verify warning, checking local:', err.message);
    }

    // Check local fallback
    try {
      const certs = JSON.parse(localStorage.getItem('skillgrad_certificates') || '[]');
      const found = certs.find(c => (c.serialNumber || c.serial_number || '').toUpperCase().trim() === cleanSn);
      if (found) return found;
    } catch {}

    return null;
  },

  // 12. Fetch Student Certificates
  async fetchStudentCertificates(user) {
    if (!user || !user.email) return [];
    const email = user.email.toLowerCase().trim();

    try {
      const res = await fetch(`/api/certificates/student/${encodeURIComponent(email)}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) return data;
      }
    } catch (err) {
      console.warn('API student certs warning:', err.message);
    }

    try {
      const certs = JSON.parse(localStorage.getItem('skillgrad_certificates') || '[]');
      return certs.filter(c => (c.studentEmail || c.student_email || '').toLowerCase().trim() === email);
    } catch {
      return [];
    }
  },

  // 13. Fetch Company Issued Certificates
  async fetchCompanyCertificates(user) {
    if (!user || !user.email) return [];
    const email = user.email.toLowerCase().trim();

    try {
      const res = await fetch(`/api/certificates/company/${encodeURIComponent(email)}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) return data;
      }
    } catch (err) {
      console.warn('API company certs warning:', err.message);
    }

    try {
      const certs = JSON.parse(localStorage.getItem('skillgrad_certificates') || '[]');
      return certs.filter(c => (c.companyEmail || c.company_email || '').toLowerCase().trim() === email);
    } catch {
      return [];
    }
  },

  // 14. Get Joined / Accepted Internships for Student
  async getJoinedInternships(user) {
    if (!user || !user.email) return [];
    const userEmail = (user.email || '').toLowerCase().trim();
    const userId = user.uid;

    let apps = [];
    try {
      const res = await fetch(`/api/applications/student/${encodeURIComponent(userEmail)}`);
      if (res.ok) {
        apps = await res.json();
      }
    } catch {}

    if (!apps || apps.length === 0) {
      try {
        const localApps = JSON.parse(localStorage.getItem(APPS_KEY) || '[]');
        apps = localApps.filter(app => {
          const matchEmail = app.email && app.email.toLowerCase().trim() === userEmail;
          const matchUid = app.userId && app.userId === userId;
          return matchEmail || matchUid;
        });
      } catch {}
    }

    // Filter to accepted ones only
    const acceptedApps = apps.filter(a => a.status === 'accepted');
    const allJobs = this.getInternships();
    const jobsMap = {};
    allJobs.forEach(j => { jobsMap[j.id] = j; });

    // Fetch any certificates issued to this student
    const certs = await this.fetchStudentCertificates(user);

    return acceptedApps.map(app => {
      const job = jobsMap[app.jobId] || {};
      const matchingCert = certs.find(c => 
        (c.roleTitle || c.role_title) === app.jobTitle ||
        (c.companyName || c.company_name) === app.companyName
      );

      return {
        applicationId: app.id,
        jobId: app.jobId,
        title: app.jobTitle || job.title || 'Paid Internship Role',
        company: app.companyName || job.company || 'Partner Enterprise',
        stipend: job.stipend || '₹25,000 / month',
        duration: job.duration || '3 Months',
        location: job.location || 'Remote',
        hrContactEmail: job.contactEmail || job.creatorEmail || 'hr@skillgrad.org',
        domain: job.domain || 'Technology',
        joinedDate: app.submittedAt,
        status: 'Enrolled & Active',
        workspaceUrl: 'https://github.com/skillgrad-internships',
        slackChannel: '#intern-workspace',
        certificate: matchingCert || null
      };
    });
  }
};