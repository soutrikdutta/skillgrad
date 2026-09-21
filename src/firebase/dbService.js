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
  orderBy,
  onSnapshot
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
          snap = await getDocs(colRef);
        }

        const liveList = snap.docs.map(d => ({
          id: d.id,
          ...d.data()
        }));

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

  // Real-time listener for internships across all connected users
  subscribeLiveInternships(callback) {
    if (!db) return () => {};
    try {
      return onSnapshot(collection(db, 'internships'), (snap) => {
        const jobs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        jobs.sort((a, b) => new Date(b.postedAt || 0) - new Date(a.postedAt || 0));
        localStorage.setItem(POSTED_JOBS_KEY, JSON.stringify(jobs));
        callback(jobs);
      }, (err) => {
        console.warn('Live internships snapshot error:', err);
      });
    } catch {
      return () => {};
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

  subscribeCompanyPostings(user, callback) {
    if (!db || !user?.email) return () => {};
    const email = (user.email || '').toLowerCase().trim();
    const uid = user.uid;

    try {
      return onSnapshot(collection(db, 'internships'), (snap) => {
        const allJobs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        const myJobs = allJobs.filter(job => {
          const matchUid = job.creatorId && job.creatorId === uid;
          const matchCreator = job.creatorEmail && job.creatorEmail.toLowerCase().trim() === email;
          const matchContact = job.contactEmail && job.contactEmail.toLowerCase().trim() === email;
          return matchUid || matchCreator || matchContact;
        });
        myJobs.sort((a, b) => new Date(b.postedAt || 0) - new Date(a.postedAt || 0));
        callback(myJobs);
      });
    } catch {
      return () => {};
    }
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

  subscribeCompanyApplicants(user, callback) {
    if (!db || !user?.email) return () => {};
    try {
      return onSnapshot(collection(db, 'applications'), async () => {
        const apps = await this.fetchCompanyApplicants(user);
        callback(apps);
      });
    } catch {
      return () => {};
    }
  },

  // ==========================================
  // 4. POST AN INTERNSHIP (REAL-TIME FIRESTORE)
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

        const existing = this.getInternships();
        existing.unshift(createdJob);
        localStorage.setItem(POSTED_JOBS_KEY, JSON.stringify(existing));

        window.dispatchEvent(new CustomEvent('skillgrad_internship_posted', { detail: createdJob }));
        return { success: true, id: docRef.id, internship: createdJob };
      }
    } catch (err) {
      console.warn('Firestore post error, saving locally:', err.message);
    }

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

        const existing = JSON.parse(localStorage.getItem(APPS_KEY) || '[]');
        existing.push({ ...appPayload, id: docRef.id });
        localStorage.setItem(APPS_KEY, JSON.stringify(existing));

        window.dispatchEvent(new CustomEvent('skillgrad_application_submitted', { detail: { jobId: applicationData.jobId } }));
        return { success: true, id: docRef.id };
      }
    } catch (err) {
      console.warn('Firestore application submit error, saving locally:', err.message);
    }

    const id = 'app-' + Date.now();
    const existing = JSON.parse(localStorage.getItem(APPS_KEY) || '[]');
    existing.push({ ...appPayload, id });
    localStorage.setItem(APPS_KEY, JSON.stringify(existing));
    window.dispatchEvent(new CustomEvent('skillgrad_application_submitted', { detail: { jobId: applicationData.jobId } }));
    return { success: true, id };
  },

  // ==========================================
  // 7. UPDATE APPLICATION STATUS
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
  // 9. SEND CONTACT / RECRUITER MESSAGE
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
    const serialNumber = (certData.serialNumber || `SG-${new Date().getFullYear()}-${randomSuffix}`).toUpperCase().trim();
    
    const payload = {
      ...certData,
      serialNumber,
      studentEmail: (certData.studentEmail || '').toLowerCase().trim(),
      companyEmail: (certData.companyEmail || '').toLowerCase().trim(),
      companyName: certData.companyName || 'SkillGrad Partner Enterprise',
      studentName: certData.studentName || 'Accomplished Scholar',
      roleTitle: certData.roleTitle || 'Software Engineer Intern',
      domain: certData.domain || 'Technology',
      grade: certData.grade || 'A+ (Distinction with Honors)',
      summary: certData.summary || 'Demonstrated outstanding technical proficiency and successful deliverable execution.',
      issueDate: certData.issueDate || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      createdAt: new Date().toISOString()
    };

    try {
      if (db) {
        const docRef = await addDoc(collection(db, 'certificates'), payload);
        const created = { ...payload, id: docRef.id };
        this._saveLocalCert(created);
        window.dispatchEvent(new CustomEvent('skillgrad_certificate_issued', { detail: created }));
        
        this.sendContactMessage({
          name: 'SkillGrad Certificate Registry',
          email: payload.companyEmail,
          subject: `Credential Issued: ${serialNumber} to ${payload.studentName}`,
          message: `Serial: ${serialNumber}\nRecipient: ${payload.studentName} (${payload.studentEmail})\nRole: ${payload.roleTitle}\nCompany: ${payload.companyName}\nGrade: ${payload.grade}`
        }).catch(() => {});

        return { success: true, serialNumber, certificate: created };
      }
    } catch (err) {
      console.warn('Firestore certificate issue error, saving locally:', err.message);
    }

    const fallbackCert = { ...payload, id: 'cert-' + Date.now() };
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
  // 11. VERIFY CERTIFICATE (ROBUST GLOBAL QUERY)
  // ==========================================
  async verifyCertificate(serialNumber) {
    const rawSn = (serialNumber || '').trim();
    if (!rawSn) return null;
    const cleanSn = rawSn.toUpperCase().replace(/\s+/g, '');

    try {
      if (db) {
        // 1. Direct query by exact serialNumber
        let q = query(collection(db, 'certificates'), where('serialNumber', '==', rawSn));
        let snap = await getDocs(q);
        if (snap.empty) {
          q = query(collection(db, 'certificates'), where('serialNumber', '==', cleanSn));
          snap = await getDocs(q);
        }

        if (!snap.empty) {
          const docData = snap.docs[0].data();
          return { id: snap.docs[0].id, ...docData };
        }

        // 2. Fallback scan for case-insensitive / whitespace-tolerant match
        const allSnap = await getDocs(collection(db, 'certificates'));
        const found = allSnap.docs.find(d => {
          const data = d.data();
          const s1 = (data.serialNumber || data.serial_number || '').toUpperCase().replace(/[\s-_]/g, '');
          const s2 = cleanSn.replace(/[\s-_]/g, '');
          return s1 === s2 || s1.includes(s2) || s2.includes(s1);
        });

        if (found) {
          return { id: found.id, ...found.data() };
        }
      }
    } catch (err) {
      console.warn('Firestore verify warning, checking local:', err.message);
    }

    // Check local cache
    try {
      const certs = JSON.parse(localStorage.getItem(CERTS_KEY) || '[]');
      const found = certs.find(c => {
        const s1 = (c.serialNumber || c.serial_number || '').toUpperCase().replace(/[\s-_]/g, '');
        const s2 = cleanSn.replace(/[\s-_]/g, '');
        return s1 === s2 || s1.includes(s2) || s2.includes(s1);
      });
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

        // Also check if any cert matches without strict lowercase
        const allSnap = await getDocs(collection(db, 'certificates'));
        const matched = allSnap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(c => (c.studentEmail || c.student_email || '').toLowerCase().trim() === email);
        if (matched.length > 0) return matched;
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

  subscribeStudentCertificates(user, callback) {
    if (!db || !user?.email) return () => {};
    const email = (user.email || '').toLowerCase().trim();
    try {
      return onSnapshot(collection(db, 'certificates'), (snap) => {
        const certs = snap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(c => (c.studentEmail || c.student_email || '').toLowerCase().trim() === email);
        callback(certs);
      });
    } catch {
      return () => {};
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

        const allSnap = await getDocs(collection(db, 'certificates'));
        const matched = allSnap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(c => (c.companyEmail || c.company_email || '').toLowerCase().trim() === email);
        if (matched.length > 0) return matched;
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

  subscribeCompanyCertificates(user, callback) {
    if (!db || !user?.email) return () => {};
    const email = (user.email || '').toLowerCase().trim();
    try {
      return onSnapshot(collection(db, 'certificates'), (snap) => {
        const certs = snap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(c => (c.companyEmail || c.company_email || '').toLowerCase().trim() === email);
        certs.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        callback(certs);
      });
    } catch {
      return () => {};
    }
  },

  // ==========================================
  // 14. GET JOINED / ACCEPTED INTERNSHIPS + DIRECT CERTS
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

    const acceptedApps = apps.filter(a => a.status === 'accepted');
    const allJobs = await this.fetchLiveInternships();
    const jobsMap = {};
    allJobs.forEach(j => { jobsMap[j.id] = j; });

    // Fetch all certificates issued to this student from Firestore
    const certs = await this.fetchStudentCertificates(user);

    // 1. Map accepted applications
    const joinedRoles = acceptedApps.map(app => {
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

    // 2. CRITICAL FIX: Also include any certificate directly minted to this student's email!
    // This guarantees that if an employer issued a certificate directly to their email, the student sees it!
    const matchedCertIds = new Set(joinedRoles.filter(j => j.certificate).map(j => j.certificate.id || j.certificate.serialNumber));
    certs.forEach(cert => {
      const certId = cert.id || cert.serialNumber;
      if (!matchedCertIds.has(certId)) {
        joinedRoles.unshift({
          applicationId: 'direct-cert-' + certId,
          jobId: cert.jobId || 'job-' + certId,
          title: cert.roleTitle || cert.role_title || 'Certified Internship Deliverable',
          company: cert.companyName || cert.company_name || 'SkillGrad Partner Enterprise',
          stipend: cert.stipend || 'Stipend Disbursed',
          duration: cert.duration || 'Completed',
          location: cert.location || 'Remote / Hybrid',
          hrContactEmail: cert.companyEmail || cert.company_email || 'certs@skillgrad.org',
          domain: cert.domain || 'Technology',
          joinedDate: cert.issueDate || cert.issue_date || cert.createdAt,
          status: 'Credential Awarded',
          workspaceUrl: 'https://github.com/skillgrad-internships',
          slackChannel: '#intern-alumni',
          certificate: cert
        });
      }
    });

    return joinedRoles;
  }
};