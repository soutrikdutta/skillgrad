import { db } from './config';
import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';

const POSTED_JOBS_KEY = 'skillgrad_posted_internships';
const APPS_KEY = 'skillgrad_applications';
const CERTS_KEY = 'skillgrad_certificates';

export const dbService = {
  // ==========================================
  // 1. PUBLIC MARKETPLACE / LIVE INTERNSHIPS
  // ==========================================
  async fetchLiveInternships() {
    try {
      if (db) {
        const colRef = collection(db, 'internships');
        let snap;
        try {
          const q = query(colRef, orderBy('postedAt', 'desc'));
          snap = await getDocs(q);
        } catch {
          // If index not ready, fallback to unsorted query
          snap = await getDocs(colRef);
        }

        const liveList = snap.docs.map(d => ({
          id: d.id,
          ...d.data()
        }));

        // Sort descending by postedAt in case fallback was used
        liveList.sort((a, b) => new Date(b.postedAt || 0) - new Date(a.postedAt || 0));

        localStorage.setItem(POSTED_JOBS_KEY, JSON.stringify(liveList));
        return liveList;
      }
    } catch (err) {
      console.warn('Firestore fetchLiveInternships note, using local cache:', err.message);
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

  // ==========================================
  // 2. COMPANY INTERNSHIP POSTINGS
  // ==========================================
  async fetchCompanyPostings(user) {
    if (!user || !user.email) return [];
    const userEmail = (user.email || '').toLowerCase().trim();
    const userUid = user.uid;

    try {
      if (db) {
        const allJobs = await this.fetchLiveInternships();
        return allJobs.filter(job => {
          const matchesUid = job.creatorId && job.creatorId === userUid;
          const matchesCreatorEmail = job.creatorEmail && job.creatorEmail.toLowerCase().trim() === userEmail;
          const matchesContactEmail = job.contactEmail && job.contactEmail.toLowerCase().trim() === userEmail;
          return matchesUid || matchesCreatorEmail || matchesContactEmail;
        });
      }
    } catch (err) {
      console.warn('Firestore fetchCompanyPostings note:', err.message);
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

  // ==========================================
  // 3. COMPANY APPLICANTS VIEW
  // ==========================================
  async fetchCompanyApplicants(user) {
    if (!user || !user.email) return [];
    try {
      if (db) {
        const companyJobs = await this.fetchCompanyPostings(user);
        const companyJobIds = new Set(companyJobs.map(j => j.id));

        const snap = await getDocs(collection(db, 'applications'));
        const allApps = snap.docs.map(d => ({ id: d.id, ...d.data() }));

        const filtered = allApps.filter(app => companyJobIds.has(app.jobId));
        filtered.sort((a, b) => new Date(b.submittedAt || 0) - new Date(a.submittedAt || 0));

        // Update local cache
        localStorage.setItem(APPS_KEY, JSON.stringify(allApps));
        return filtered;
      }
    } catch (err) {
      console.warn('Firestore fetchCompanyApplicants note:', err.message);
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

  // ==========================================
  // 4. POST AN INTERNSHIP (SHARED FIRESTORE)
  // ==========================================
  async postInternship(jobData, currentUser = null) {
    const creatorId = currentUser?.uid || jobData.creatorId || 'anon-' + Date.now();
    const creatorEmail = (currentUser?.email || jobData.contactEmail || '').toLowerCase().trim();
    const contactEmail = (jobData.contactEmail || creatorEmail).toLowerCase().trim();

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
      contactEmail,
      applicantsCount: 0,
      isNew: true,
      postedAt: new Date().toISOString()
    };

    try {
      if (db) {
        const docRef = await addDoc(collection(db, 'internships'), payload);
        const createdJob = { ...payload, id: docRef.id };

        // Update local cache
        const existing = this.getInternships();
        existing.unshift(createdJob);
        localStorage.setItem(POSTED_JOBS_KEY, JSON.stringify(existing));

        window.dispatchEvent(new CustomEvent('skillgrad_internship_posted', { detail: createdJob }));
        return { success: true, id: docRef.id, internship: createdJob };
      }
    } catch (err) {
      console.warn('Firestore post error, saving locally:', err.message);
    }

    // Local fallback
    const fallbackId = 'sg-posted-' + Date.now();
    const fallbackJob = { ...payload, id: fallbackId };
    const existing = this.getInternships();
    existing.unshift(fallbackJob);
    localStorage.setItem(POSTED_JOBS_KEY, JSON.stringify(existing));
    window.dispatchEvent(new CustomEvent('skillgrad_internship_posted', { detail: fallbackJob }));
    return { success: true, id: fallbackId, internship: fallbackJob };
  },

  // ==========================================
  // 5. DELETE AN INTERNSHIP
  // ==========================================
  async deleteInternship(jobId) {
    try {
      if (db && jobId && !jobId.startsWith('sg-posted-')) {
        await deleteDoc(doc(db, 'internships', jobId));
      }
    } catch (err) {
      console.warn('Firestore delete error:', err.message);
    }

    // Clean local cache
    const allJobs = this.getInternships().filter(j => j.id !== jobId);
    localStorage.setItem(POSTED_JOBS_KEY, JSON.stringify(allJobs));
    const allApps = JSON.parse(localStorage.getItem(APPS_KEY) || '[]').filter(a => a.jobId !== jobId);
    localStorage.setItem(APPS_KEY, JSON.stringify(allApps));
    window.dispatchEvent(new CustomEvent('skillgrad_internship_deleted'));
    return { success: true };
  },

  // ==========================================
  // 6. SUBMIT STUDENT APPLICATION
  // ==========================================
  async submitApplication(applicationData) {
    const appPayload = { 
      ...applicationData, 
      status: 'pending',
      submittedAt: new Date().toISOString()
    };

    try {
      if (db) {
        const docRef = await addDoc(collection(db, 'applications'), appPayload);
        
        // Increment applicant count on the internship in Firestore
        try {
          if (applicationData.jobId) {
            const jobDocRef = doc(db, 'internships', applicationData.jobId);
            const jobSnap = await getDoc(jobDocRef);
            if (jobSnap.exists()) {
              const currentCount = jobSnap.data().applicantsCount || 0;
              await updateDoc(jobDocRef, { applicantsCount: currentCount + 1 });
            }
          }
        } catch (cntErr) {
          console.warn('Could not increment applicant count:', cntErr.message);
        }

        // Update local app cache
        const existing = JSON.parse(localStorage.getItem(APPS_KEY) || '[]');
        existing.push({ ...appPayload, id: docRef.id });
        localStorage.setItem(APPS_KEY, JSON.stringify(existing));

        window.dispatchEvent(new CustomEvent('skillgrad_application_submitted', { detail: { jobId: applicationData.jobId } }));
        return { success: true, id: docRef.id };
      }
    } catch (err) {
      console.warn('Firestore application submit error, saving locally:', err.message);
    }

    // Local fallback
    const id = 'app-' + Date.now();
    const existing = JSON.parse(localStorage.getItem(APPS_KEY) || '[]');
    existing.push({ ...appPayload, id });
    localStorage.setItem(APPS_KEY, JSON.stringify(existing));
    window.dispatchEvent(new CustomEvent('skillgrad_application_submitted', { detail: { jobId: applicationData.jobId } }));
    return { success: true, id };
  },

  // ==========================================
  // 7. UPDATE APPLICATION STATUS (COMPANY ACTION)
  // ==========================================
  async updateApplicationStatus(applicationId, newStatus) {
    try {
      if (db && applicationId && !applicationId.startsWith('app-')) {
        await updateDoc(doc(db, 'applications', applicationId), { status: newStatus });
      }
    } catch (err) {
      console.warn('Firestore status update error:', err.message);
    }

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

  // ==========================================
  // 8. STUDENT APPLICATIONS
  // ==========================================
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
    const userEmail = (user.email || '').toLowerCase().trim();
    const userId = user.uid;

    try {
      if (db) {
        const snap = await getDocs(collection(db, 'applications'));
        const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        const studentApps = all.filter(app => {
          const matchEmail = app.email && app.email.toLowerCase().trim() === userEmail;
          const matchUid = app.userId && app.userId === userId;
          return matchEmail || matchUid;
        });
        studentApps.sort((a, b) => new Date(b.submittedAt || 0) - new Date(a.submittedAt || 0));
        return studentApps;
      }
    } catch (err) {
      console.warn('Firestore student apps warning:', err.message);
    }
    return this.getStudentApplications(user);
  },

  // ==========================================
  // 9. SEND CONTACT / HR MESSAGE (WEB3FORMS API)
  // ==========================================
  async sendContactMessage(formData) {
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: 'b94e3cb2-9386-4f7f-856c-2f9ec6fb4018',
          from_name: formData.name || 'SkillGrad Portal User',
          subject: formData.subject || `SkillGrad Inquiry from ${formData.name || 'User'}`,
          email: formData.email,
          message: formData.message,
          to_email: formData.to_email || '2006soutrik@gmail.com',
          timestamp: new Date().toLocaleString()
        })
      });

      if (res.ok) {
        return { success: true, message: 'Your message has been sent directly!' };
      }
    } catch (err) {
      console.warn('Contact message error:', err.message);
    }

    return { success: true, message: 'Your message has been dispatched!' };
  },

  // ==========================================
  // 10. CERTIFICATE ENGINE: ISSUE CERTIFICATE
  // ==========================================
  async issueCertificate(certData) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const serialNumber = certData.serialNumber || `SG-${new Date().getFullYear()}-${randomSuffix}`;
    const payload = {
      ...certData,
      serialNumber,
      studentEmail: (certData.studentEmail || '').toLowerCase().trim(),
      companyEmail: (certData.companyEmail || '').toLowerCase().trim(),
      issueDate: certData.issueDate || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      createdAt: new Date().toISOString()
    };

    try {
      if (db) {
        const docRef = await addDoc(collection(db, 'certificates'), payload);
        const created = { ...payload, id: docRef.id };
        this._saveLocalCert(created);
        window.dispatchEvent(new CustomEvent('skillgrad_certificate_issued', { detail: created }));
        
        // Notify author of certificate issuance
        this.sendContactMessage({
          name: 'SkillGrad Certificate Mint',
          email: certData.companyEmail || 'certs@skillgrad.org',
          subject: `SkillGrad Credential Issued: ${serialNumber} to ${certData.studentName}`,
          message: `Serial: ${serialNumber}\nRecipient: ${certData.studentName} (${certData.studentEmail})\nRole: ${certData.roleTitle}\nCompany: ${certData.companyName}\nGrade: ${certData.grade}`
        }).catch(() => {});

        return { success: true, serialNumber, certificate: created };
      }
    } catch (err) {
      console.warn('Firestore certificate issue error, saving locally:', err.message);
    }

    // Local fallback
    const fallbackCert = {
      ...payload,
      id: 'cert-' + Date.now()
    };
    this._saveLocalCert(fallbackCert);
    window.dispatchEvent(new CustomEvent('skillgrad_certificate_issued', { detail: fallbackCert }));
    return { success: true, serialNumber, certificate: fallbackCert };
  },

  _saveLocalCert(cert) {
    try {
      const existing = JSON.parse(localStorage.getItem(CERTS_KEY) || '[]');
      existing.unshift(cert);
      localStorage.setItem(CERTS_KEY, JSON.stringify(existing));
    } catch {}
  },

  // ==========================================
  // 11. VERIFY CERTIFICATE BY SERIAL NUMBER
  // ==========================================
  async verifyCertificate(serialNumber) {
    const cleanSn = (serialNumber || '').toUpperCase().trim();
    if (!cleanSn) return null;

    try {
      if (db) {
        const q = query(collection(db, 'certificates'), where('serialNumber', '==', cleanSn));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const docData = snap.docs[0].data();
          return { id: snap.docs[0].id, ...docData };
        }
      }
    } catch (err) {
      console.warn('Firestore verify warning, checking local:', err.message);
    }

    // Check local fallback
    try {
      const certs = JSON.parse(localStorage.getItem(CERTS_KEY) || '[]');
      const found = certs.find(c => (c.serialNumber || c.serial_number || '').toUpperCase().trim() === cleanSn);
      if (found) return found;
    } catch {}

    return null;
  },

  // ==========================================
  // 12. FETCH STUDENT CERTIFICATES
  // ==========================================
  async fetchStudentCertificates(user) {
    if (!user || !user.email) return [];
    const email = user.email.toLowerCase().trim();

    try {
      if (db) {
        const q = query(collection(db, 'certificates'), where('studentEmail', '==', email));
        const snap = await getDocs(q);
        if (!snap.empty) {
          return snap.docs.map(d => ({ id: d.id, ...d.data() }));
        }
      }
    } catch (err) {
      console.warn('Firestore student certs warning:', err.message);
    }

    try {
      const certs = JSON.parse(localStorage.getItem(CERTS_KEY) || '[]');
      return certs.filter(c => (c.studentEmail || c.student_email || '').toLowerCase().trim() === email);
    } catch {
      return [];
    }
  },

  // ==========================================
  // 13. FETCH COMPANY ISSUED CERTIFICATES
  // ==========================================
  async fetchCompanyCertificates(user) {
    if (!user || !user.email) return [];
    const email = user.email.toLowerCase().trim();

    try {
      if (db) {
        const q = query(collection(db, 'certificates'), where('companyEmail', '==', email));
        const snap = await getDocs(q);
        if (!snap.empty) {
          return snap.docs.map(d => ({ id: d.id, ...d.data() }));
        }
      }
    } catch (err) {
      console.warn('Firestore company certs warning:', err.message);
    }

    try {
      const certs = JSON.parse(localStorage.getItem(CERTS_KEY) || '[]');
      return certs.filter(c => (c.companyEmail || c.company_email || '').toLowerCase().trim() === email);
    } catch {
      return [];
    }
  },

  // ==========================================
  // 14. GET JOINED / ACCEPTED INTERNSHIPS
  // ==========================================
  async getJoinedInternships(user) {
    if (!user || !user.email) return [];
    const userEmail = (user.email || '').toLowerCase().trim();
    const userId = user.uid;

    let apps = [];
    try {
      apps = await this.fetchStudentApplications(user);
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
    const allJobs = await this.fetchLiveInternships();
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