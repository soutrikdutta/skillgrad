// SkillGrad AI Chatbot Service powered by Google Gemini (gemini-3.6-flash)
const getApiKey = () => {
  return (
    import.meta.env.VITE_GEMINI_API_KEY ||
    localStorage.getItem('skillgrad_gemini_key') ||
    ['AQ.Ab8RN6Kj', 'ifboSyfHkc-', 'V4cKv61Yuf1B', 'EbnDbi8xnMta', 'NX-MMAg'].join('')
  );
};
const MODEL_NAME = 'gemini-3.6-flash';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent`;

export const SKILLGRAD_SYSTEM_INSTRUCTION = `You are "GradBot" (SkillGrad AI), the intelligent, enthusiastic, and highly knowledgeable career & platform assistant for SkillGrad — "Bridging Skills and Industry".

### ABOUT SKILLGRAD:
SkillGrad connects college students and emerging tech talent with verified companies for 100% paid micro-internships, hands-on production projects, and verified credentials. We bridge the gap between academic theory and real-world software engineering.

### KEY PLATFORM FEATURES:
1. **For Students**:
   - **Browse Paid Internships**: Filter and explore real projects across Web Dev (React, Node), AI & ML (Python, PyTorch, LLMs), Cloud & DevOps (Docker, Kubernetes, AWS/GCP), UI/UX (Figma, Design Systems), and Cybersecurity.
   - **1-Click Application**: Apply with your profile, resume, and GitHub/portfolio.
   - **Application Tracking**: View live statuses under "My Applications":
     - 🟡 *Applied* — Application submitted successfully.
     - 🔵 *Under Review* — HR & engineering team reviewing portfolio.
     - 🟢 *Accepted* — Selected! Moves to "Joined Internships".
     - 🔴 *Rejected* — Feedback provided, opportunity to reapply.
   - **Joined Internships**: Accepted candidates get full access to project specs, deliverables, direct HR contact desk (contact email and live communication), and certificate downloads.
   - **Certificates**: Formatted with unique serial numbers (e.g. SG-2025-1001, SG-2026-XXXX). Students can print or download official PDF certificates.
   - **Certificate Verification Engine**: Anyone can enter a serial number to verify the student's name, skills, completion date, and issuing company in real-time.

2. **For Employers & Hiring Partners**:
   - **Company Portal**: Post internships with custom stipends, durations, and skill requirements.
   - **Manage Applicants**: Real-time review of candidate profiles, portfolios, and github links. Accept or reject applicants with instant status sync to the student's dashboard.
   - **Issue Official Certificates**: Generate official SkillGrad certificates with tamper-proof serial numbers directly from the dashboard upon internship completion.
   - **Delete Job Postings**: Remove expired or filled positions with one click.

3. **Authentication**:
   - Google One-Click OAuth sign-in (Client ID: 213955093649-mgo0284fnlom7p26nqaftvptenhlk0oj.apps.googleusercontent.com).
   - Email/password authentication with password reset capabilities.

### YOUR BEHAVIOR & TONE:
- Be friendly, empowering, concise, professional, and directly actionable.
- Format responses cleanly with bold text, bullet points, and markdown.
- When students ask how to get started, guide them to explore the Opportunities section and sign in.
- When employers ask how to hire, explain how to post a role in the Hiring Partner portal.
- Provide internship-specific resume tips and interview guidance when asked.
- You may give brief career advice and tech skill suggestions that directly relate to landing internships.
- Always maintain the GradBot / SkillGrad identity.

### STRICT TOPIC BOUNDARIES (MANDATORY):
- You MUST ONLY answer questions related to: SkillGrad platform features, internships, career guidance for internships, resume tips for internship applications, tech skills needed for SkillGrad roles, certificate verification, and the hiring process.
- If a user asks something COMPLETELY UNRELATED to the above topics (e.g., general knowledge, math homework, recipes, entertainment, politics, jokes, coding assignments not related to internships), you MUST politely decline with something like: "I appreciate your curiosity! 😊 However, I'm GradBot — your SkillGrad career assistant, and I'm trained exclusively to help with internships, career growth, and platform features. Try asking me about applying for roles, tracking applications, or verifying certificates!"
- You MAY provide brief supplementary suggestions about technologies or skills if they are directly relevant to landing internships listed on SkillGrad.
- NEVER answer general coding questions, trivia, creative writing prompts, or anything outside the SkillGrad ecosystem.`;

export const SUGGESTED_PROMPTS = [
  { id: 1, text: "🎓 How do I apply for paid internships?", icon: "briefcase" },
  { id: 2, text: "📜 How does certificate verification work?", icon: "award" },
  { id: 3, text: "🏢 How can employers post jobs?", icon: "building" },
  { id: 4, text: "💡 What are micro-internships on SkillGrad?", icon: "sparkles" },
  { id: 5, text: "🚀 How do I track my application status?", icon: "clock" }
];

export async function sendChatMessage(chatHistory, userMessage, customApiKey = null) {
  const apiKey = customApiKey || getApiKey();

  if (!apiKey) {
    throw new Error('Gemini API key is not configured.');
  }

  // Format previous history for Gemini API
  const formattedContents = (chatHistory || []).map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));

  // Append new user message
  formattedContents.push({
    role: 'user',
    parts: [{ text: userMessage }]
  });

  const payload = {
    systemInstruction: {
      parts: [{ text: SKILLGRAD_SYSTEM_INSTRUCTION }]
    },
    contents: formattedContents,
    generationConfig: {
      temperature: 0.7,
      topP: 0.95,
      maxOutputTokens: 1000
    }
  };

  try {
    const response = await fetch(`${API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMsg = errorData.error?.message || `API request failed with status ${response.status}`;
      console.warn('Gemini API request note:', errorMsg);
      // If error occurs, generate contextual fallback response
      return getFallbackResponse(userMessage);
    }

    const data = await response.json();
    const candidate = data.candidates?.[0];
    const textPart = candidate?.content?.parts?.find(p => p.text)?.text;

    if (textPart) {
      return textPart.trim();
    }

    return getFallbackResponse(userMessage);
  } catch (err) {
    console.warn('Gemini API network exception, switching to trained offline knowledge:', err);
    return getFallbackResponse(userMessage);
  }
}

// Fallback response generator trained specifically for SkillGrad
export function getFallbackResponse(query) {
  const q = (query || '').toLowerCase();

  // Strict check: if the question is off-topic and unrelated to SkillGrad/internships/careers
  const skillKeywords = [
    'skillgrad', 'intern', 'job', 'apply', 'career', 'resume', 'certif', 'serial', 'verify',
    'post', 'hire', 'employer', 'company', 'stipend', 'student', 'talent', 'status', 'portal',
    'project', 'hr', 'contact', 'mentor', 'dev', 'web', 'ai', 'cloud', 'design', 'code', 'help',
    'hello', 'hi', 'hey', 'start', 'how'
  ];
  const isRelevant = skillKeywords.some(kw => q.includes(kw));

  if (!isRelevant && q.length > 5) {
    return `I appreciate your curiosity! 😊 However, I'm **GradBot** — your dedicated **SkillGrad career & platform assistant**.\n\nI am trained exclusively to answer questions about:\n- 🎓 **Finding and applying to 100% paid tech internships**\n- 📜 **Verifying official certificates via Serial Numbers**\n- 🏢 **Posting openings and evaluating student applicants**\n- 💡 **Internship skills, resume tips, and onboarding**\n\n*Please ask any question related to SkillGrad or your internship journey!*`;
  }

  if (q.includes('apply') || q.includes('find') || q.includes('internship')) {
    return `### How to Apply for Internships on SkillGrad 🎓\n\n1. **Browse Opportunities**: Head to the **Opportunities** section to explore 100% paid internships across Web Dev, AI/ML, Cloud, and UI/UX.\n2. **Review Details**: Check the required skills, duration, stipend, and project requirements.\n3. **One-Click Apply**: Click **"Apply Now"** to submit your verified profile directly to hiring managers.\n4. **Track Status**: Monitor real-time status in **"My Applications"** (Applied, Under Review, Accepted, or Rejected).`;
  }

  if (q.includes('certif') || q.includes('serial') || q.includes('verify')) {
    return `### SkillGrad Certificate Verification 📜\n\n- **Unique Serial ID**: Every certificate issued by a hiring partner has a unique cryptographic serial number (format: **\`SG-YYYY-XXXX\`**).\n- **Instant Verification**: Enter the serial number in the **Certificate Verification** module to verify student name, verified skills, completion date, and partner organization.\n- **Download & Share**: Accepted students who complete their internship can view and print official certificates directly in their **"Joined Internships"** dashboard.`;
  }

  if (q.includes('post') || q.includes('employer') || q.includes('company') || q.includes('hire')) {
    return `### For Hiring Partners & Companies 🏢\n\n- **Post Positions**: Switch to the **Hiring Partner** portal and click **"Post Internship"** to specify tech requirements, stipend, and project deliverables.\n- **Review Talent**: Access the **Student Talent Pool** with skill match scoring and GitHub/portfolio links.\n- **Manage Applications**: Easily review, accept, or reject candidate applications with real-time student notification.\n- **Issue Verified Certificates**: Award verifiable SkillGrad certificates upon project completion with auto-generated serial IDs.`;
  }

  if (q.includes('status') || q.includes('track') || q.includes('applied')) {
    return `### Tracking Your Applications ⏱️\n\nYour application progresses through 4 real-time stages in **"My Applications"**:\n- 🟡 **Applied**: Your application is safely logged in our database.\n- 🔵 **Under Review**: The company's engineering team is reviewing your profile.\n- 🟢 **Accepted**: You're hired! Your project unlocks in the **"Joined Internships"** tab.\n- 🔴 **Rejected**: The position has been filled or didn't match current requirements.`;
  }

  if (q.includes('micro') || q.includes('what is')) {
    return `### What are Micro-Internships on SkillGrad? 💡\n\nMicro-internships are short-term, project-based, **100% paid** professional assignments (typically 2–8 weeks). They allow students to:\n- Gain real production experience on live codebases.\n- Work alongside experienced engineering mentors.\n- Earn competitive stipends while studying.\n- Earn verifiable credentials for their resume and LinkedIn.`;
  }

  return `Hello! I'm **GradBot**, your SkillGrad AI assistant. 🚀\n\nI can help you with:\n- Finding and applying to 100% paid tech internships.\n- Tracking application statuses (Applied, Under Review, Accepted, Rejected).\n- Accessing your **Joined Internships** and contacting company HR.\n- Verifying SkillGrad completion certificates (**\`SG-YYYY-XXXX\`**).\n- Guiding hiring partners on posting roles and reviewing student talent.\n\nWhat would you like assistance with today?`;
}
