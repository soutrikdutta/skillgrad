import React, { useState, Suspense, Component } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Opportunities from './components/Opportunities';
import ContactUs from './components/ContactUs';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import ToastContainer from './components/Toast';
import FlowBackground from './components/FlowBackground';
import LoginPage from './components/LoginPage';

// Code-splitting for secondary panels
const CompanyDashboard = React.lazy(() => import('./components/CompanyDashboard'));
const StudentTalentPool = React.lazy(() => import('./components/StudentTalentPool'));
const CertificateVerification = React.lazy(() => import('./components/CertificateVerification'));
const FAQ = React.lazy(() => import('./components/FAQ'));
const MyApplications = React.lazy(() => import('./components/MyApplications'));
const JoinedInternships = React.lazy(() => import('./components/JoinedInternships'));

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('SkillGrad UI Catch:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#08090D] flex flex-col items-center justify-center p-6 text-center text-white">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 text-2xl mb-4">
            ⚠️
          </div>
          <h2 className="text-xl font-bold font-display">Something went wrong</h2>
          <p className="text-xs text-slate-400 mt-2 max-w-md">
            {this.state.error?.message || 'An unexpected error occurred while loading this view.'}
          </p>
          <button
            onClick={() => { localStorage.clear(); window.location.reload(); }}
            className="mt-6 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 cursor-pointer"
          >
            Reset Session & Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function PageLoader() {
  return (
    <div className="min-h-[40vh] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function StudentPlatform({ onSwitchRole }) {
  return (
    <div className="min-h-screen bg-[#08090D] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200 relative overflow-x-hidden">
      <FlowBackground theme="student" />
      <div className="relative z-10">
        <Navbar currentRole="student" onSwitchRole={onSwitchRole} />
        <main className="pt-16">
          <Hero />
          <Features />
          <Opportunities />
          <Suspense fallback={<PageLoader />}>
            <JoinedInternships />
            <MyApplications />
            <StudentTalentPool />
            <CertificateVerification />
            <FAQ />
          </Suspense>
          <ContactUs />
        </main>
        <Footer />
        <AuthModal />
        <ToastContainer />
      </div>
    </div>
  );
}

function CompanyPlatform({ onSwitchRole }) {
  return (
    <div className="min-h-screen bg-[#08090D] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-x-hidden">
      <FlowBackground theme="company" />
      <div className="relative z-10">
        <Navbar currentRole="company" onSwitchRole={onSwitchRole} />
        <main className="pt-16">
          <Suspense fallback={<PageLoader />}>
            <CompanyDashboard />
          </Suspense>
          <ContactUs />
        </main>
        <Footer />
        <AuthModal />
        <ToastContainer />
      </div>
    </div>
  );
}

function AppContent() {
  const { user, loading } = useAuth();
  const [selectedRole, setSelectedRole] = useState(() => {
    return localStorage.getItem('skillgrad_active_role') || 'student';
  });

  const handleSwitchRole = () => {
    const nextRole = selectedRole === 'student' ? 'company' : 'student';
    setSelectedRole(nextRole);
    localStorage.setItem('skillgrad_active_role', nextRole);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090A0F] flex items-center justify-center text-white">
        <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // 1. ALWAYS land on Login Page first whenever not authenticated (No guest exploration option)
  if (!user) {
    return (
      <>
        <LoginPage 
          onLoginSuccess={(role) => {
            const finalRole = role || selectedRole || 'student';
            setSelectedRole(finalRole);
            localStorage.setItem('skillgrad_active_role', finalRole);
          }}
        />
        <ToastContainer />
      </>
    );
  }

  // 2. Render Tailored Platform based on authenticated role
  if (selectedRole === 'company') {
    return <CompanyPlatform onSwitchRole={handleSwitchRole} />;
  }

  return <StudentPlatform onSwitchRole={handleSwitchRole} />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}