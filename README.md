# SkillGrad — Bridging Skills and Industry

A high-performance modern web application connecting students with real-world paid industry projects and internship opportunities.

## Tech Stack
- **Frontend:** React 18, Vite 6, Tailwind CSS, Lucide React, Framer Motion, Canvas Confetti
- **Backend & Auth:** Firebase Authentication (Google & Email/Password), Cloud Firestore
- **Direct Email Dispatch:** Web3Forms API configured to forward Contact Us messages to 2006soutrik@gmail.com

## Getting Started

1. Install dependencies:
   `ash
   npm install
   `

2. Start the development server:
   `ash
   npm run dev
   `

3. Build for production:
   `ash
   npm run build
   `

## Firebase Environment Configuration (Optional)
Create a .env file in the root directory if you want to connect your own Firebase project:
`env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
`
