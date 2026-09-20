import express from 'express';
import cors from 'cors';
import { initDatabase, dbQuery, getDatabaseStatus } from './db.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Database connection on boot
await initDatabase();

// 1. Health & Database Status
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'SkillGrad Google Cloud SQL Backend',
    database: getDatabaseStatus(),
    timestamp: new Date().toISOString()
  });
});

// 2. Get All Public Internships (with live applicant counts calculated directly from DB)
app.get('/api/internships', async (req, res) => {
  try {
    const jobs = await dbQuery('SELECT * FROM internships ORDER BY posted_at DESC');
    const apps = await dbQuery('SELECT job_id, COUNT(*) as count FROM applications GROUP BY job_id');
    
    const countMap = {};
    apps.forEach(a => {
      countMap[a.job_id] = parseInt(a.count, 10) || 0;
    });

    const formatted = jobs.map(job => ({
      id: job.id,
      title: job.title,
      company: job.company,
      logo: job.logo || '🚀',
      location: job.location,
      type: job.type || 'Paid Internship',
      stipend: job.stipend,
      duration: job.duration,
      domain: job.domain,
      experienceLevel: job.experience_level,
      skills: typeof job.skills === 'string' ? JSON.parse(job.skills || '[]') : (job.skills || []),
      description: job.description,
      perks: typeof job.perks === 'string' ? JSON.parse(job.perks || '[]') : (job.perks || []),
      openings: job.openings || 2,
      applicantsCount: countMap[job.id] || 0,
      creatorId: job.creator_id,
      creatorEmail: job.creator_email,
      contactEmail: job.contact_email,
      status: job.status,
      isNew: Boolean(job.is_new),
      postedAt: job.posted_at
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Error fetching internships:', err);
    res.status(500).json({ error: 'Failed to fetch internships' });
  }
});

// 3. Post a New Internship (Company)
app.post('/api/internships', async (req, res) => {
  try {
    const body = req.body;
    const id = 'sg-db-' + Date.now();
    const postedAt = new Date().toISOString();
    const skillsJson = JSON.stringify(Array.isArray(body.skills) ? body.skills : (body.skills ? body.skills.split(',').map(s => s.trim()) : []));
    const perksJson = JSON.stringify(body.perks || ['Verified Certificate', 'Direct Mentorship', 'Pre-Placement Offer']);

    await dbQuery(`
      INSERT INTO internships (
        id, title, company, logo, location, type, stipend, duration, domain,
        experience_level, skills, description, perks, openings, creator_id,
        creator_email, contact_email, status, is_new, posted_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      body.title,
      body.company,
      body.logo || '🚀',
      body.location || 'Remote',
      body.type || 'Paid Internship',
      body.stipend || '₹25,000 / month',
      body.duration || '3 Months',
      body.domain || 'Web Development',
      body.experienceLevel || 'Beginner - Intermediate',
      skillsJson,
      body.description,
      perksJson,
      body.openings || 2,
      body.creatorId || null,
      body.creatorEmail || body.contactEmail || null,
      body.contactEmail || null,
      'Active',
      1,
      postedAt
    ]);

    // Send email alert to 2006soutrik@gmail.com
    try {
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          access_key: 'b94e3cb2-9386-4f7f-856c-2f9ec6fb4018',
          from_name: 'SkillGrad Cloud SQL Engine',
          subject: `New Internship in Database: ${body.title} at ${body.company}`,
          to_email: '2006soutrik@gmail.com',
          company: body.company,
          title: body.title,
          stipend: body.stipend,
          timestamp: new Date().toLocaleString()
        })
      }).catch(() => {});
    } catch (e) {}

    res.status(201).json({ success: true, id, message: 'Internship recorded in Cloud SQL database.' });
  } catch (err) {
    console.error('Error creating internship in database:', err);
    res.status(500).json({ error: 'Failed to create internship' });
  }
});

// 4. Isolated Company Postings (Strict multi-tenant privacy)
app.get('/api/internships/company/:email', async (req, res) => {
  try {
    const email = (req.params.email || '').toLowerCase().trim();
    const jobs = await dbQuery(
      'SELECT * FROM internships WHERE LOWER(creator_email) = ? OR LOWER(contact_email) = ? ORDER BY posted_at DESC',
      [email, email]
    );

    const apps = await dbQuery('SELECT job_id, COUNT(*) as count FROM applications GROUP BY job_id');
    const countMap = {};
    apps.forEach(a => { countMap[a.job_id] = parseInt(a.count, 10) || 0; });

    const formatted = jobs.map(job => ({
      id: job.id,
      title: job.title,
      company: job.company,
      logo: job.logo || '🚀',
      location: job.location,
      type: job.type || 'Paid Internship',
      stipend: job.stipend,
      duration: job.duration,
      domain: job.domain,
      skills: typeof job.skills === 'string' ? JSON.parse(job.skills || '[]') : (job.skills || []),
      description: job.description,
      applicantsCount: countMap[job.id] || 0,
      creatorEmail: job.creator_email,
      contactEmail: job.contact_email,
      status: job.status,
      postedAt: job.posted_at
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Error fetching company internships:', err);
    res.status(500).json({ error: 'Failed to fetch company jobs' });
  }
});

// 5. Isolated Company Applicants (Strict multi-tenant privacy)
app.get('/api/applications/company/:email', async (req, res) => {
  try {
    const email = (req.params.email || '').toLowerCase().trim();
    // Get all job IDs created by this company
    const jobs = await dbQuery(
      'SELECT id FROM internships WHERE LOWER(creator_email) = ? OR LOWER(contact_email) = ?',
      [email, email]
    );
    const jobIds = jobs.map(j => j.id);

    if (jobIds.length === 0) {
      return res.json([]);
    }

    const apps = await dbQuery('SELECT * FROM applications ORDER BY submitted_at DESC');
    const filtered = apps.filter(a => jobIds.includes(a.job_id));

    res.json(filtered.map(app => ({
      id: app.id,
      jobId: app.job_id,
      jobTitle: app.job_title,
      companyName: app.company_name,
      name: app.name,
      email: app.email,
      phone: app.phone,
      college: app.college,
      portfolioUrl: app.portfolio_url,
      coverNote: app.cover_note,
      status: app.status,
      submittedAt: app.submitted_at
    })));
  } catch (err) {
    console.error('Error fetching company applicants:', err);
    res.status(500).json({ error: 'Failed to fetch applicants' });
  }
});

// 6. Submit Student Application
app.post('/api/applications', async (req, res) => {
  try {
    const body = req.body;
    const id = 'app-db-' + Date.now();
    const submittedAt = new Date().toISOString();

    await dbQuery(`
      INSERT INTO applications (
        id, job_id, job_title, company_name, name, email, phone, college,
        portfolio_url, cover_note, user_id, status, submitted_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      body.jobId,
      body.jobTitle || '',
      body.companyName || '',
      body.name,
      body.email,
      body.phone || '',
      body.college || '',
      body.portfolioUrl || '',
      body.coverNote || '',
      body.userId || null,
      'Under Review',
      submittedAt
    ]);

    // Send email alert to 2006soutrik@gmail.com
    try {
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          access_key: 'b94e3cb2-9386-4f7f-856c-2f9ec6fb4018',
          from_name: 'SkillGrad Database Applicant Alert',
          subject: `New Application for ${body.jobTitle} (${body.companyName})`,
          to_email: '2006soutrik@gmail.com',
          applicantName: body.name,
          applicantEmail: body.email,
          college: body.college,
          timestamp: new Date().toLocaleString()
        })
      }).catch(() => {});
    } catch (e) {}

    res.status(201).json({ success: true, id, message: 'Application stored in Cloud SQL database.' });
  } catch (err) {
    console.error('Error saving application:', err);
    res.status(500).json({ error: 'Failed to submit application' });
  }
});

// 6b. Delete an Internship Posting
app.delete('/api/internships/:id', async (req, res) => {
  try {
    const jobId = req.params.id;
    await dbQuery('DELETE FROM applications WHERE job_id = ?', [jobId]);
    await dbQuery('DELETE FROM internships WHERE id = ?', [jobId]);
    res.json({ success: true, message: 'Internship and related applications deleted.' });
  } catch (err) {
    console.error('Error deleting internship:', err);
    res.status(500).json({ error: 'Failed to delete internship' });
  }
});

// 6c. Update Application Status (accept/reject)
app.patch('/api/applications/:id/status', async (req, res) => {
  try {
    const appId = req.params.id;
    const { status } = req.body; // 'accepted' | 'rejected' | 'pending'
    await dbQuery('UPDATE applications SET status = ? WHERE id = ?', [status, appId]);
    res.json({ success: true, message: `Application status updated to ${status}.` });
  } catch (err) {
    console.error('Error updating application status:', err);
    res.status(500).json({ error: 'Failed to update application status' });
  }
});

// 6d. Get Student's Own Applications
app.get('/api/applications/student/:email', async (req, res) => {
  try {
    const email = (req.params.email || '').toLowerCase().trim();
    const apps = await dbQuery(
      'SELECT * FROM applications WHERE LOWER(email) = ? ORDER BY submitted_at DESC',
      [email]
    );
    res.json(apps.map(app => ({
      id: app.id,
      jobId: app.job_id,
      jobTitle: app.job_title,
      companyName: app.company_name,
      name: app.name,
      email: app.email,
      phone: app.phone,
      college: app.college,
      portfolioUrl: app.portfolio_url,
      coverNote: app.cover_note,
      status: app.status,
      submittedAt: app.submitted_at
    })));
  } catch (err) {
    console.error('Error fetching student applications:', err);
    res.status(500).json({ error: 'Failed to fetch student applications' });
  }
});

// 6e. Issue Certificate (Company)
app.post('/api/certificates', async (req, res) => {
  try {
    const b = req.body;
    const id = 'cert-db-' + Date.now();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const serialNumber = b.serialNumber || `SG-${new Date().getFullYear()}-${randomSuffix}`;
    const createdAt = new Date().toISOString();
    const issueDate = b.issueDate || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    await dbQuery(`
      INSERT INTO certificates (
        id, serial_number, student_name, student_email, company_name,
        company_email, role_title, domain, grade, issue_date, summary, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      serialNumber.toUpperCase().trim(),
      b.studentName.trim(),
      (b.studentEmail || '').toLowerCase().trim(),
      b.companyName.trim(),
      (b.companyEmail || '').toLowerCase().trim(),
      b.roleTitle.trim(),
      b.domain || 'Technology',
      b.grade || 'A+',
      issueDate,
      b.summary || 'Successfully demonstrated core competency and delivered commercial milestone objectives.',
      createdAt
    ]);

    // Send email alert to 2006soutrik@gmail.com
    try {
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          access_key: 'b94e3cb2-9386-4f7f-856c-2f9ec6fb4018',
          from_name: 'SkillGrad Certificate Engine',
          subject: `Certificate Issued: ${serialNumber} to ${b.studentName}`,
          to_email: '2006soutrik@gmail.com',
          serialNumber,
          studentName: b.studentName,
          companyName: b.companyName,
          roleTitle: b.roleTitle,
          timestamp: new Date().toLocaleString()
        })
      }).catch(() => {});
    } catch (e) {}

    res.status(201).json({
      success: true,
      id,
      serialNumber,
      certificate: {
        id,
        serialNumber,
        studentName: b.studentName,
        studentEmail: b.studentEmail,
        companyName: b.companyName,
        roleTitle: b.roleTitle,
        domain: b.domain,
        grade: b.grade || 'A+',
        issueDate,
        summary: b.summary
      },
      message: 'Certificate registered and verified in database.'
    });
  } catch (err) {
    console.error('Error issuing certificate:', err);
    res.status(500).json({ error: 'Failed to issue certificate' });
  }
});

// 6f. Verify Certificate by Serial Number
app.get('/api/certificates/:serialNumber', async (req, res) => {
  try {
    const sn = (req.params.serialNumber || '').toUpperCase().trim();
    const rows = await dbQuery('SELECT * FROM certificates WHERE UPPER(serial_number) = ?', [sn]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Certificate not found' });
    }
    const c = rows[0];
    res.json({
      id: c.id,
      serialNumber: c.serial_number,
      studentName: c.student_name,
      studentEmail: c.student_email,
      companyName: c.company_name,
      roleTitle: c.role_title,
      domain: c.domain,
      grade: c.grade,
      issueDate: c.issue_date,
      summary: c.summary,
      createdAt: c.created_at
    });
  } catch (err) {
    console.error('Error verifying certificate:', err);
    res.status(500).json({ error: 'Verification check failed' });
  }
});

// 6g. Get Certificates for Student
app.get('/api/certificates/student/:email', async (req, res) => {
  try {
    const email = (req.params.email || '').toLowerCase().trim();
    const rows = await dbQuery('SELECT * FROM certificates WHERE LOWER(student_email) = ? ORDER BY created_at DESC', [email]);
    res.json(rows.map(c => ({
      id: c.id,
      serialNumber: c.serial_number,
      studentName: c.student_name,
      studentEmail: c.student_email,
      companyName: c.company_name,
      roleTitle: c.role_title,
      domain: c.domain,
      grade: c.grade,
      issueDate: c.issue_date,
      summary: c.summary,
      createdAt: c.created_at
    })));
  } catch (err) {
    console.error('Error fetching student certificates:', err);
    res.status(500).json({ error: 'Failed to fetch certificates' });
  }
});

// 6h. Get Certificates issued by Company
app.get('/api/certificates/company/:email', async (req, res) => {
  try {
    const email = (req.params.email || '').toLowerCase().trim();
    const rows = await dbQuery('SELECT * FROM certificates WHERE LOWER(company_email) = ? ORDER BY created_at DESC', [email]);
    res.json(rows.map(c => ({
      id: c.id,
      serialNumber: c.serial_number,
      studentName: c.student_name,
      studentEmail: c.student_email,
      companyName: c.company_name,
      roleTitle: c.role_title,
      domain: c.domain,
      grade: c.grade,
      issueDate: c.issue_date,
      summary: c.summary,
      createdAt: c.created_at
    })));
  } catch (err) {
    console.error('Error fetching company certificates:', err);
    res.status(500).json({ error: 'Failed to fetch company certificates' });
  }
});

// 7. Contact Message
app.post('/api/contact', async (req, res) => {
  try {
    const body = req.body;
    const id = 'msg-db-' + Date.now();
    const submittedAt = new Date().toISOString();

    await dbQuery(`
      INSERT INTO contact_messages (
        id, name, email, phone, role, subject, message, submitted_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      body.name,
      body.email,
      body.phone || '',
      body.role || 'Student',
      body.subject || 'General Inquiry',
      body.message,
      submittedAt
    ]);

    // Send direct email via Web3Forms
    try {
      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          access_key: 'b94e3cb2-9386-4f7f-856c-2f9ec6fb4018',
          from_name: body.name || 'SkillGrad Contact Inquiry',
          subject: `SkillGrad Inquiry: ${body.subject || 'General'} from ${body.name}`,
          to_email: '2006soutrik@gmail.com',
          name: body.name,
          email: body.email,
          phone: body.phone || 'N/A',
          role: body.role || 'Student',
          message: body.message,
          timestamp: new Date().toLocaleString()
        })
      });
    } catch (e) {}

    res.status(201).json({ success: true, id, message: 'Message saved in database and forwarded to email.' });
  } catch (err) {
    console.error('Error saving contact message:', err);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// 8. Auth: Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, displayName, role } = req.body;
    const cleanEmail = (email || '').toLowerCase().trim();

    const existing = await dbQuery('SELECT uid FROM users WHERE LOWER(email) = ?', [cleanEmail]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, error: 'An account with this email already exists.' });
    }

    const uid = 'usr-db-' + Date.now();
    const registeredAt = new Date().toISOString();

    await dbQuery(`
      INSERT INTO users (uid, email, password, display_name, role, registered_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [uid, cleanEmail, password, displayName.trim(), role || 'student', registeredAt]);

    res.status(201).json({
      success: true,
      user: { uid, email: cleanEmail, displayName: displayName.trim(), role: role || 'student' }
    });
  } catch (err) {
    console.error('Error in user registration:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// 9. Auth: Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = (email || '').toLowerCase().trim();

    const users = await dbQuery('SELECT * FROM users WHERE LOWER(email) = ?', [cleanEmail]);
    if (users.length === 0) {
      return res.status(404).json({ success: false, error: 'No account found with this email. Please register first.' });
    }

    const user = users[0];
    if (user.password !== password) {
      return res.status(401).json({ success: false, error: 'Incorrect password. Please verify credentials or reset password.' });
    }

    res.json({
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.display_name,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Error in user login:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// 10. Auth: Reset Password
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const cleanEmail = (email || '').toLowerCase().trim();

    const users = await dbQuery('SELECT * FROM users WHERE LOWER(email) = ?', [cleanEmail]);
    if (users.length === 0) {
      return res.status(404).json({ success: false, error: 'No account found with this email address.' });
    }

    await dbQuery('UPDATE users SET password = ? WHERE LOWER(email) = ?', [newPassword, cleanEmail]);
    res.json({ success: true, message: 'Password updated successfully in database.' });
  } catch (err) {
    console.error('Error updating password:', err);
    res.status(500).json({ error: 'Password reset failed' });
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 [SkillGrad Backend] Running on http://localhost:${PORT}`);
  console.log(`  Database Status: http://localhost:${PORT}/api/health\n`);
});
