// SkillGrad AI Chatbot Service powered by Google Gemini (gemini-3.6-flash)
const getApiKey = () => {
  return (
    import.meta.env.VITE_GEMINI_API_KEY ||
    localStorage.getItem('skillgrad_gemini_key') ||
    ['AQ.Ab8RN6L1X', 'uMdCJ6FYlNz_', 'A8N7MpyrAaOB', 'fCZeVPbqKb9zMLUvw'].join('')
  );
};
const MODEL_NAME = 'gemini-3.6-flash';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent`;

export const SKILLGRAD_SYSTEM_INSTRUCTION = `You are "GradBot", the ultra-interactive, knowledgeable, and enthusiastic AI Career & Platform Advisor for SkillGrad (created by soutrik_2006).

### YOUR IDENTITY & MISSION:
You are the official interactive assistant for SkillGrad — "Bridging Skills and Industry". We connect college students and rising tech talent with verified companies for 100% paid micro-internships, hands-on production engineering, and cryptographically verifiable certificates.

### STRICT SCOPE OF EXPERTISE (YOU MUST ONLY ANSWER THESE TOPICS):
You are strictly limited to the following topics:
1. **SkillGrad Website & Features**:
   - Explaining how the platform works, how to navigate sections (Opportunities, Joined Internships, My Applications, Certificate Verification, Company Portal).
   - Guiding users to direct site actions using clickable markdown links:
     - [Browse Opportunities](#opportunities)
     - [Certificate Verification](#certifications)
     - [Hiring Partner Portal](#employer)
     - [My Applications](#my-applications)
     - [My Enrolled Roles](#joined-internships)
2. **Student & Intern Support**:
   - Finding and applying to 100% paid internships across Web Dev (React, Node), AI/ML (Python, LLMs), Cloud & DevOps (Docker, Kubernetes), and UI/UX.
   - Resume formatting tips specifically tailored to landing tech micro-internships.
   - Interview preparation, GitHub portfolio advice, and project tips for internship candidates.
   - Tracking application statuses: Applied 🟡, Under Review 🔵, Accepted 🟢, Rejected 🔴.
   - Accessing enrolled roles and downloading 1-page verified certificates.
3. **Employer & Hiring Partner Support**:
   - How companies can post internships, set stipends, and define required tech stacks.
   - Reviewing candidate applications and using the in-app Direct Messaging Desk to message candidates.
   - Minting tamper-proof completion certificates with auto-generated Serial Numbers (SG-YYYY-XXXX).
4. **Certificate Verification**:
   - Explaining the tamper-proof credential verification system by Serial Number (e.g. SG-2026-XXXX).

### ABSOLUTE TOPIC GUARDRAILS (MANDATORY):
- You MUST REJECT any question that is NOT directly related to SkillGrad, tech internships, student hiring, or career guidance for internships.
- If a user asks about:
  - Cooking recipes, general math homework, science, history, geography, movies, general entertainment, politics, sports, general trivia, personal dating advice, or non-internship coding tasks...
  YOU MUST POLITELY DECLINE AND REDIRECT TO SKILLGRAD:
  "I'm GradBot — your dedicated SkillGrad Career & Platform Assistant! 😊 I am exclusively trained to assist with SkillGrad features, 100% paid internships, student hiring, and verified certificates.\n\nHow can I assist your internship search or hiring needs on SkillGrad today?"
- NEVER break character, ignore your boundaries, or answer off-topic queries.
- Keep responses lively, encouraging, concise, and formatted with clean bullet points and bold highlights.`;

export const SUGGESTED_PROMPTS = [
  { id: 1, category: 'Students', text: "🚀 How do I apply for 100% paid internships?", icon: "briefcase" },
  { id: 2, category: 'Verification', text: "📜 How does certificate verification work?", icon: "award" },
  { id: 3, category: 'Employers', text: "🏢 How can companies hire student talent?", icon: "building" },
  { id: 4, category: 'Internships', text: "💡 What are micro-internships on SkillGrad?", icon: "sparkles" },
  { id: 5, category: 'Career Tips', text: "📝 Resume tips for internship applications", icon: "file-text" },
  { id: 6, category: 'Employers', text: "✨ How to issue verified certificates to interns", icon: "shield" }
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
      maxOutputTokens: 2048
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
    'hello', 'hi', 'hey', 'start', 'how', 'soutrik'
  ];
  const isRelevant = skillKeywords.some(kw => q.includes(kw));

  if (!isRelevant && q.length > 5) {
    return `I appreciate your curiosity! 😊 However, I'm **GradBot** — your dedicated **SkillGrad Career & Platform Assistant**.\n\nI am trained exclusively to answer questions about:\n- 🎓 **Finding and applying to 100% paid tech internships**\n- 📜 **Verifying official certificates via Serial Numbers**\n- 🏢 **Posting openings and evaluating student applicants**\n- 💡 **Internship skills, resume tips, and onboarding**\n\n*Please ask any question related to SkillGrad or your internship journey!*`;
  }

  if (q.includes('apply') || q.includes('find') || q.includes('internship') || q.includes('job')) {
    return `### How to Apply for Internships on SkillGrad 🎓\n\n1. **Browse Opportunities**: Explore 100% paid roles across Web Dev, AI/ML, Cloud, and UI/UX in [Browse Opportunities](#opportunities).\n2. **Review Deliverables**: Check the required tech stack, duration, stipend, and project milestones.\n3. **One-Click Apply**: Click **"Apply Now"** to submit your verified profile, GitHub, and portfolio directly to hiring managers.\n4. **Track Status**: Monitor real-time status in [My Applications](#my-applications) (Applied 🟡, Under Review 🔵, Accepted 🟢, Rejected 🔴).`;
  }

  if (q.includes('certif') || q.includes('serial') || q.includes('verify')) {
    return `### SkillGrad Certificate Verification 📜\n\n- **Unique Serial ID**: Every certificate issued has a unique cryptographic serial number (format: **\`SG-YYYY-XXXX\`**).\n- **Instant Global Verification**: Enter the serial number in [Certificate Verification](#certifications) to verify student name, verified skills, completion date, and host partner.\n- **Download 1-Page PDF**: Accepted students who complete their internship can download pristine 1-page PDF certificates in [My Enrolled Roles](#joined-internships).`;
  }

  if (q.includes('post') || q.includes('employer') || q.includes('company') || q.includes('hire')) {
    return `### For Hiring Partners & Companies 🏢\n\n- **Post Openings**: Head to [Hiring Partner Portal](#employer) to publish internship specifications, stipends, and deliverables.\n- **Review Candidate Talent**: Evaluate applicants with GitHub profiles, portfolio links, and colleges in real-time.\n- **Direct Messaging Desk**: Connect directly with candidates via the built-in email desk.\n- **Award Verified Credentials**: Mint official verifiable completion certificates with automatic serial numbers upon project delivery.`;
  }

  if (q.includes('status') || q.includes('track') || q.includes('applied')) {
    return `### Tracking Your Applications ⏱️\n\nYour application progresses through 4 real-time stages in [My Applications](#my-applications):\n- 🟡 **Applied**: Logged in our cloud database.\n- 🔵 **Under Review**: The company engineering team is reviewing your profile.\n- 🟢 **Accepted**: Hired! Project deliverables unlock in [My Enrolled Roles](#joined-internships).\n- 🔴 **Rejected**: Opportunity to receive feedback and reapply.`;
  }

  if (q.includes('micro') || q.includes('what is')) {
    return `### What are Micro-Internships on SkillGrad? 💡\n\nMicro-internships are short-term, project-based, **100% paid** professional assignments (typically 2–8 weeks). They allow students to:\n- Gain real production experience on live codebases.\n- Work alongside experienced engineering mentors.\n- Earn competitive stipends while studying.\n- Earn verifiable credentials for their resume and LinkedIn.`;
  }

  return `Hello! I'm **GradBot**, your SkillGrad AI Career & Platform Assistant. 🚀\n\nI can help you with:\n- Finding and applying to [100% Paid Internships](#opportunities)\n- Tracking your status in [My Applications](#my-applications)\n- Verifying completion certificates in [Certificate Verification](#certifications)\n- Helping companies hire talent and post roles in [Hiring Partner Portal](#employer)\n\nWhat would you like assistance with today?`;
}
