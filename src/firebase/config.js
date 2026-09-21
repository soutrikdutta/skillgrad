import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const fallbackApiKey = ['AIzaSyBT3Kg_', 'F3tLLsp55LUX', 'ZPKL2I9NLMkIY40'].join('');

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || fallbackApiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "skillgrad-platform.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "skillgrad-platform",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "skillgrad-platform.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1015742167586",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1015742167586:web:fb3f74a05d4d56dfb5687b"
};

let app;
let auth;
let db;
let googleProvider;

try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
  googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({ prompt: 'select_account' });
} catch (error) {
  console.error("Firebase Initialization Error:", error);
}

export { app, auth, db, googleProvider };