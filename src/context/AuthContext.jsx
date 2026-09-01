import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../firebase/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const unsubscribe = authService.subscribe((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const addToast = (message, type = 'success', duration = 4000) => {
    const id = Date.now() + Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const openAuthModal = (mode = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  // Real Google Login
  const loginWithGoogle = async () => {
    try {
      const res = await authService.loginWithGoogle();
      if (res.success) {
        setUser(res.user);
        closeAuthModal();
        addToast(`Welcome, ${res.user.displayName || res.user.email}!`, 'success');
        return { success: true };
      }
    } catch (err) {
      console.error("Google Sign-In error:", err);
      addToast(err.message || 'Google Sign-In failed', 'error');
      return { success: false, error: err.message };
    }
  };

  // Real Email Login
  const loginWithEmail = async (email, password) => {
    try {
      const res = await authService.loginWithEmail(email, password);
      if (res.success) {
        setUser(res.user);
        closeAuthModal();
        addToast(`Welcome back, ${res.user.displayName || email}!`, 'success');
        return { success: true };
      }
    } catch (err) {
      addToast(err.message || 'Login failed', 'error');
      return { success: false, error: err.message };
    }
  };

  // Real Email Signup
  const signupWithEmail = async (email, password, name) => {
    try {
      const res = await authService.signupWithEmail(email, password, name);
      if (res.success) {
        setUser(res.user);
        closeAuthModal();
        addToast(`Account created! Welcome, ${name}!`, 'success');
        return { success: true };
      }
    } catch (err) {
      addToast(err.message || 'Signup failed', 'error');
      return { success: false, error: err.message };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      addToast('Signed out successfully.', 'info');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthModalOpen,
      authModalMode,
      openAuthModal,
      closeAuthModal,
      loginWithGoogle,
      loginWithEmail,
      signupWithEmail,
      logout,
      toasts,
      addToast,
      removeToast
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}