import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './components/LoginPage';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Opportunities from './components/Opportunities';
import PortalsHub from './components/PortalsHub';
import CertificateVerification from './components/CertificateVerification';
import FAQ from './components/FAQ';
import ContactUs from './components/ContactUs';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import ToastContainer from './components/Toast';

function MainPlatform({ onRequireAuth }) {
  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Opportunities />
        <PortalsHub />
        <CertificateVerification />
        <FAQ />
        <ContactUs />
      </main>
      <Footer />
      
      {/* Modals & Toasts */}
      <AuthModal />
      <ToastContainer />
    </div>
  );
}

function AppContent() {
  const { user, loading } = useAuth();
  const [isGuest, setIsGuest] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080C14] flex items-center justify-center text-white">
        <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If not authenticated and not in guest mode, show the initial LoginPage
  if (!user && !isGuest) {
    return (
      <>
        <LoginPage onContinueAsGuest={() => setIsGuest(true)} />
        <ToastContainer />
      </>
    );
  }

  return <MainPlatform onRequireAuth={() => setIsGuest(false)} />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}