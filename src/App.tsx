import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useAuthStore } from './stores/authStore';

// Existing components
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { LearningPath } from './components/LearningPath';
import { Gamification } from './components/Gamification';
import { CreatorStudio } from './components/CreatorStudio';
import { LandingPage } from './components/LandingPage';
import { LessonView } from './components/LessonView';
import { ContactUs } from './components/ContactUs';

// Auth components
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

export default function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    // Check authentication status on app mount
    checkAuth();
  }, [checkAuth]);

  return (
    <>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage onOpenAuth={() => { }} onOpenContact={() => { }} />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/contact" element={<ContactUs onBack={() => window.history.back()} />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <Dashboard userName={useAuthStore.getState().user?.username || 'Learner'} />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/learning-path"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <LearningPath onStartLesson={() => { }} />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/gamification"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <Gamification />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/creator"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <CreatorStudio />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/lesson"
            element={
              <ProtectedRoute>
                <LessonView onBack={() => window.history.back()} />
              </ProtectedRoute>
            }
          />

          {/* Catch all - redirect to landing page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>

      {/* Toast notifications */}
      <Toaster position="top-right" richColors />
    </>
  );
}

/**
 * Layout wrapper for protected routes
 */
interface ProtectedLayoutProps {
  children: React.ReactNode;
}

function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const user = useAuthStore((state) => state.user);
  const [activeTab, setActiveTab] = React.useState(() => {
    // Determine active tab from current path
    const path = window.location.pathname;
    if (path.includes('learning-path')) return 'learning-path';
    if (path.includes('gamification')) return 'gamification';
    if (path.includes('creator')) return 'creator';
    return 'dashboard';
  });

  // Update active tab when navigating
  React.useEffect(() => {
    const path = window.location.pathname;
    if (path.includes('learning-path')) setActiveTab('learning-path');
    else if (path.includes('gamification')) setActiveTab('gamification');
    else if (path.includes('creator')) setActiveTab('creator');
    else if (path.includes('dashboard')) setActiveTab('dashboard');
  }, []);

  return (
    <Layout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      userRole="Contributor"
      onOpenAuth={() => { }}
      isLoggedIn={true}
      userName={user?.username || 'Learner'}
    >
      {children}
    </Layout>
  );
}
