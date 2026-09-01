import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import RoleSelectScreen from './components/RoleSelectScreen';
import LoginPage from './components/LoginPage';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Opportunities from './components/Opportunities';
import StudentTalentPool from './components/StudentTalentPool';
import CompanyDashboard from './components/CompanyDashboard';
import CertificateVerification from './components/CertificateVerification';
import FAQ from './components/FAQ';
import ContactUs from './components/ContactUs';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import ToastContainer from './components/Toast';

function StudentPlatform({ onSwitchRole }) {
  return (
    <div className="min-h-screen bg-[#06090F] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
      <Navbar currentRole="student" onSwitchRole={onSwitchRole} />
      <main className="pt-18">
        <Hero />
        <Features />
        <Opportunities />
        <StudentTalentPool />
        <CertificateVerification />
        <FAQ />
        <ContactUs />
      </main>
      <Footer />
      <AuthModal />
      <ToastContainer />
    </div>
  );
}

function CompanyPlatform({ onSwitchRole }) {
  return (
    <div className="min-h-screen bg-[#06090F] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
      <Navbar currentRole="company" onSwitchRole={onSwitchRole} />
      <main className="pt-18">
        <CompanyDashboard />
        <ContactUs />
      </main>
      <Footer />
      <AuthModal />
      <ToastContainer />
    </div>
  );
}

function AppContent() {
  const { user, loading } = useAuth();
  const [selectedRole, setSelectedRole] = useState(() => {
    return localStorage.getItem('skillgrad_active_role') || null;
  });
  const [isGuest, setIsGuest] = useState(false);

  const handleSelectRole = (role) => {
    setSelectedRole(role);
    localStorage.setItem('skillgrad_active_role', role);
  };

  const handleSwitchRole = () => {
    const nextRole = selectedRole === 'student' ? 'company' : 'student';
    setSelectedRole(nextRole);
    localStorage.setItem('skillgrad_active_role', nextRole);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#06090F] flex items-center justify-center text-white">
        <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // 1. If not authenticated and no role chosen yet, show Role Selection Screen
  if (!user && !isGuest && !selectedRole) {
    return (
      <>
        <RoleSelectScreen 
          onSelectRole={handleSelectRole}
          onContinueAsGuest={() => {
            setIsGuest(true);
            setSelectedRole('student');
          }}
        />
        <ToastContainer />
      </>
    );
  }

  // 2. If not authenticated and role is selected, show tailored Login Page for that role
  if (!user && !isGuest && selectedRole) {
    return (
      <>
        <LoginPage 
          selectedRole={selectedRole}
          onBackToRoles={() => {
            setSelectedRole(null);
            localStorage.removeItem('skillgrad_active_role');
          }}
          onContinueAsGuest={() => setIsGuest(true)}
        />
        <ToastContainer />
      </>
    );
  }

  // 3. Render Tailored Platform based on role
  if (selectedRole === 'company') {
    return <CompanyPlatform onSwitchRole={handleSwitchRole} />;
  }

  return <StudentPlatform onSwitchRole={handleSwitchRole} />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}