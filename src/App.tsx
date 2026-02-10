import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { LearningPath } from './components/LearningPath';
import { Gamification } from './components/Gamification';
import { CreatorStudio } from './components/CreatorStudio';
import { AuthModal } from './components/AuthModal';
import { LandingPage } from './components/LandingPage';
import { LessonView } from './components/LessonView';
import { ContactUs } from './components/ContactUs';
import { Settings } from './components/Settings';
import { Quiz } from './components/Quiz';
import { AdminDashboard } from './components/AdminDashboard';
import { AnimatePresence } from 'motion/react';
import { Toaster } from 'sonner';
import { useAuthStore } from './stores/authStore';
import './stores/themeStore';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isInLessonMode, setIsInLessonMode] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [activeQuizId, setActiveQuizId] = useState<number | null>(null);
  const [activeLessonPathId, setActiveLessonPathId] = useState<number | undefined>(undefined);

  const { user, isAuthenticated, isLoading, checkAuth, logout } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleLoginSuccess = () => {
    setIsAuthOpen(false);
  };

  const handleLogout = () => {
    logout();
    setActiveTab('dashboard');
    setIsInLessonMode(false);
    setActiveQuizId(null);
  };

  const handleLessonStart = (pathId?: number) => {
    setActiveLessonPathId(pathId);
    setIsInLessonMode(true);
  };

  const handleLessonBack = () => {
    setIsInLessonMode(false);
    setActiveLessonPathId(undefined);
  };

  const handleQuizComplete = (_result: any) => {
    // Quiz completed - could show results or navigate back
  };

  const handleQuizBack = () => {
    setActiveQuizId(null);
  };

  const userRole = (user?.role || 'learner') as 'Learner' | 'Contributor' | 'Admin';

  const renderContent = () => {
    if (activeQuizId) {
      return <Quiz quizId={activeQuizId} onComplete={handleQuizComplete} onBack={handleQuizBack} />;
    }

    if (isInLessonMode) {
      return <LessonView onBack={handleLessonBack} pathId={activeLessonPathId} />;
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onViewLearning={() => setActiveTab('learning-path')} onStartLesson={(pathId) => handleLessonStart(pathId)} />;
      case 'learning-path':
        return <LearningPath onStartLesson={(pathId) => handleLessonStart(pathId)} />;
      case 'gamification':
        return <Gamification />;
      case 'creator':
        return <CreatorStudio />;
      case 'admin':
        return <AdminDashboard />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onViewLearning={() => setActiveTab('learning-path')} onStartLesson={(pathId) => handleLessonStart(pathId)} />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-base-content/60">Loading...</p>
        </div>
      </div>
    );
  }

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
              onLogin={handleLoginSuccess}
            />
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <>
      <Layout 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setIsInLessonMode(false);
          setActiveQuizId(null);
        }} 
        userRole={userRole}
        onOpenAuth={() => setIsAuthOpen(true)}
        isLoggedIn={isAuthenticated}
        onLogout={handleLogout}
        user={user}
      >
        <AnimatePresence mode="wait">
          <div key={activeQuizId ? `quiz-${activeQuizId}` : isInLessonMode ? 'lesson' : activeTab} className="h-full">
            {renderContent()}
          </div>
        </AnimatePresence>
      </Layout>

      <AnimatePresence>
        {isAuthOpen && (
          <AuthModal 
            isOpen={isAuthOpen} 
            onClose={() => setIsAuthOpen(false)}
            onLogin={handleLoginSuccess}
          />
        )}
      </AnimatePresence>
      <Toaster position="top-right" richColors closeButton />
    </>
  );
}
