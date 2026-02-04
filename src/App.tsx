<<<<<<< Updated upstream
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { LearningPath } from './components/LearningPath';
import { Gamification } from './components/Gamification';
import { CreatorStudio } from './components/CreatorStudio';
import { AuthModal } from './components/AuthModal';
import { LandingPage } from './components/LandingPage';
import { LessonView } from './components/LessonView';
import { ContactUs } from './components/ContactUs';
import { AnimatePresence } from 'motion/react';
=======
import { useState, useEffect } from "react";
import { Layout } from "./components/Layout";
import { Dashboard } from "./components/Dashboard";
import { LearningPath } from "./components/LearningPath";
import { Gamification } from "./components/Gamification";
import { CreatorStudio } from "./components/CreatorStudio";
import { AuthModal } from "./components/AuthModal";
import { LandingPage } from "./components/LandingPage";
import { LessonView } from "./components/LessonView";
import { ContactUs } from "./components/ContactUs";
import { AnimatePresence } from "motion/react";
import { useAuthStore } from "./stores/authStore";
>>>>>>> Stashed changes

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
<<<<<<< Updated upstream
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // New state to track if we are in lesson view or contact view
  const [isInLessonMode, setIsInLessonMode] = useState(false);
  const [showContact, setShowContact] = useState(false);

  // Mock role for wireframe purposes
  const [userRole, setUserRole] = useState<'Learner' | 'Contributor' | 'Admin'>('Contributor');

  const handleLogin = () => {
    setIsLoggedIn(true);
=======
  const [isInLessonMode, setIsInLessonMode] = useState(false);
  const [showContact, setShowContact] = useState(false);

  const { user, isAuthenticated, checkAuth, logout } = useAuthStore();

  // Check auth status on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Listen for auth logout events (from API interceptor)
  useEffect(() => {
    const handleLogout = () => logout();
    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, [logout]);

  // Map backend role to frontend role format
  const getUserRole = (): "Learner" | "Contributor" | "Admin" => {
    if (!user) return "Learner";
    switch (user.role) {
      case 'admin': return "Admin";
      case 'contributor': return "Contributor";
      default: return "Learner";
    }
  };

  const handleLogin = () => {
>>>>>>> Stashed changes
    setIsAuthOpen(false);
  };

  const handleLessonStart = () => {
    setIsInLessonMode(true);
  };

  const handleLessonBack = () => {
    setIsInLessonMode(false);
  };

  const renderContent = () => {
    if (isInLessonMode) {
      return <LessonView onBack={handleLessonBack} />;
    }

    switch (activeTab) {
<<<<<<< Updated upstream
      case 'dashboard':
        return <Dashboard />;
      case 'learning-path':
=======
      case "dashboard":
        return <Dashboard userName={user?.username || 'Learner'} />;
      case "learning-path":
>>>>>>> Stashed changes
        return <LearningPath onStartLesson={handleLessonStart} />;
      case 'gamification':
        return <Gamification />;
      case 'creator':
        return <CreatorStudio />;
      default:
<<<<<<< Updated upstream
        return <Dashboard />;
=======
        return <Dashboard userName={user?.username || 'Learner'} />;
>>>>>>> Stashed changes
    }
  };

  if (showContact) {
    return <ContactUs onBack={() => setShowContact(false)} />;
  }

  if (!isAuthenticated) {
    return (
      <>
        <LandingPage 
          onOpenAuth={() => setIsAuthOpen(true)} 
          onOpenContact={() => setShowContact(true)}
        />
        <AnimatePresence>
          {isAuthOpen && (
            <AuthModal 
              isOpen={isAuthOpen} 
              onClose={() => setIsAuthOpen(false)}
              onLogin={handleLogin}
            />
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <>
<<<<<<< Updated upstream
      <Layout 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        userRole={userRole}
        onOpenAuth={() => setIsAuthOpen(true)}
        isLoggedIn={isLoggedIn}
=======
      <Layout
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={getUserRole()}
        onOpenAuth={() => setIsAuthOpen(true)}
        isLoggedIn={isAuthenticated}
        userName={user?.username || ''}
>>>>>>> Stashed changes
      >
        <AnimatePresence mode="wait">
          <div key={isInLessonMode ? 'lesson' : activeTab} className="h-full">
            {renderContent()}
          </div>
        </AnimatePresence>
      </Layout>

      <AnimatePresence>
        {isAuthOpen && (
          <AuthModal 
            isOpen={isAuthOpen} 
            onClose={() => setIsAuthOpen(false)}
            onLogin={handleLogin}
          />
        )}
      </AnimatePresence>
    </>
  );
}
