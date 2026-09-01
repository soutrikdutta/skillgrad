import React, { createContext, useContext, useState, useEffect } from 'react';
import { googleCloudAuth } from '../firebase/googleAuthService';

const AuthContext = createContext(null);
const USERS_STORAGE_KEY = 'skillgrad_registered_users';
const CURRENT_USER_KEY = 'skillgrad_auth_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Toast helper
  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Helper to load registered users
  const getRegisteredUsers = () => {
    try {
      return JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  };

  // Helper to save registered users
  const saveRegisteredUsers = (users) => {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (e) {}
  };

  // Check persisted session on mount safely
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CURRENT_USER_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      } else if (googleCloudAuth && typeof googleCloudAuth.getCurrentUser === 'function') {
        const googleUser = googleCloudAuth.getCurrentUser();
        if (googleUser) setUser(googleUser);
      }
    } catch (err) {
      console.warn('Auth initialization note:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 1. Strict User Signup (Registers new account and stores credentials)
  const signupWithEmail = async (email, password, displayName, role = 'student') => {
    const cleanEmail = email.trim().toLowerCase();
    const users = getRegisteredUsers();

    // Check if account already exists
    const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return { 
        success: false, 
        error: 'An account with this email already exists. Please sign in.' 
      };
    }

    const newUser = {
      uid: 'sg-user-' + Date.now(),
      email: cleanEmail,
      password: password,
      displayName: displayName.trim(),
      role: role,
      registeredAt: new Date().toISOString()
    };

    users.push(newUser);
    saveRegisteredUsers(users);

    const sessionUser = {
      uid: newUser.uid,
      email: newUser.email,
      displayName: newUser.displayName,
      role: newUser.role,
      authProvider: 'email'
    };

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));
    setUser(sessionUser);
    addToast(`Welcome to SkillGrad, ${sessionUser.displayName}!`, 'success');
    return { success: true, user: sessionUser };
  };

  // 2. Strict User Sign In (Requires existing registered account and matching password)
  const loginWithEmail = async (email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    const users = getRegisteredUsers();

    const registeredUser = users.find(u => u.email.toLowerCase() === cleanEmail);
    
    // Check if user is registered
    if (!registeredUser) {
      return { 
        success: false, 
        error: 'No account found with this email. Please register first.' 
      };
    }

    // Check password match
    if (registeredUser.password !== password) {
      return { 
        success: false, 
        error: 'Incorrect password. Please verify your credentials or reset your password.' 
      };
    }

    const sessionUser = {
      uid: registeredUser.uid,
      email: registeredUser.email,
      displayName: registeredUser.displayName,
      role: registeredUser.role || 'student',
      authProvider: 'email'
    };

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));
    setUser(sessionUser);
    addToast(`Welcome back, ${sessionUser.displayName}!`, 'success');
    return { success: true, user: sessionUser };
  };

  // 3. Reset / Update Password Flow
  const resetPassword = async (email, newPassword) => {
    const cleanEmail = email.trim().toLowerCase();
    const users = getRegisteredUsers();

    const userIndex = users.findIndex(u => u.email.toLowerCase() === cleanEmail);
    if (userIndex === -1) {
      return { 
        success: false, 
        error: 'No registered account found with this email address.' 
      };
    }

    // Update password
    users[userIndex].password = newPassword;
    users[userIndex].passwordUpdatedAt = new Date().toISOString();
    saveRegisteredUsers(users);

    // Send confirmation email via Web3Forms
    try {
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          access_key: 'b94e3cb2-9386-4f7f-856c-2f9ec6fb4018',
          from_name: 'SkillGrad Security',
          subject: 'SkillGrad: Password Reset Confirmation',
          to_email: cleanEmail,
          message: `Hello ${users[userIndex].displayName}, your SkillGrad account password was recently reset.`,
          timestamp: new Date().toLocaleString()
        })
      }).catch(() => {});
    } catch (e) {}

    addToast('Password reset successfully! You can now sign in with your new password.', 'success');
    return { success: true };
  };

  // 4. Logout
  const logout = async () => {
    try {
      if (googleCloudAuth && typeof googleCloudAuth.signOut === 'function') {
        googleCloudAuth.signOut();
      }
    } catch (e) {}
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem('skillgrad_active_role');
    setUser(null);
    addToast('You have been signed out.', 'info');
  };

  const value = {
    user,
    loading,
    loginWithEmail,
    signupWithEmail,
    resetPassword,
    logout,
    authModalOpen,
    setAuthModalOpen,
    toasts,
    addToast,
    removeToast
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}