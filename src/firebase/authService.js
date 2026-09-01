import { googleCloudAuth } from './googleAuthService';

const STORAGE_KEY = 'skillgrad_auth_user';

export const authService = {
  // Google Cloud OAuth Sign-In
  async loginWithGoogle() {
    return await googleCloudAuth.signInWithGoogleCloud();
  },

  // Email / Password Login
  async loginWithEmail(email, password) {
    const userObj = {
      uid: 'user-' + Math.random().toString(36).substring(2, 9),
      displayName: email.split('@')[0],
      email: email,
      photoURL: null,
      provider: 'password'
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userObj));
    return { success: true, user: userObj };
  },

  // Email / Password Signup
  async signupWithEmail(email, password, name) {
    const userObj = {
      uid: 'user-' + Math.random().toString(36).substring(2, 9),
      displayName: name || email.split('@')[0],
      email: email,
      photoURL: null,
      provider: 'password'
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userObj));
    return { success: true, user: userObj };
  },

  // Logout
  async logout() {
    localStorage.removeItem(STORAGE_KEY);
    return { success: true };
  },

  // Subscribe to current auth state
  subscribe(callback) {
    const stored = localStorage.getItem(STORAGE_KEY);
    callback(stored ? JSON.parse(stored) : null);
    return () => {};
  }
};