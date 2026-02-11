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
import { AboutPage } from './components/AboutPage';
import { PrivacyPage } from './components/PrivacyPage';
import { TermsPage } from './components/TermsPage';
import { Settings } from './components/Settings';
import { Quiz } from './components/Quiz';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Onboarding } from './components/Onboarding';
import { AnimatePresence } from 'motion/react';
import { Toaster } from 'sonner';
import { useAuthStore } from './stores/authStore';
import './stores/themeStore';

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isInLessonMode, setIsInLessonMode] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [activeQuizId, setActiveQuizId] = useState<number | null>(null);
  const [activeLessonPathId, setActiveLessonPathId] = useState<number | undefined>(undefined);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const { user, isAuthenticated, isLoading, checkAuth, logout } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleLoginSuccess = () => {
    setIsAuthOpen(false);
    // Show onboarding for first-time users
    const onboarded = localStorage.getItem('learnquest_onboarded');
    if (!onboarded) {
      setShowOnboarding(true);
      return;
    }
    // Auto-route based on role after login
    routeByRole();
  };

  const routeByRole = () => {
    const role = useAuthStore.getState().user?.role?.toLowerCase();
    if (role === 'admin') {
      setActiveTab('admin');
    } else if (role === 'contributor') {
      setActiveTab('creator');
    } else {
      setActiveTab('dashboard');
    }
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

  const rawRole = (user?.role || 'learner').toLowerCase();
  const userRole = (rawRole === 'admin' ? 'Admin' : rawRole === 'contributor' ? 'Contributor' : 'Learner') as 'Learner' | 'Contributor' | 'Admin';

  const renderContent = () => {
    if (activeQuizId) {
      return <Quiz quizId={activeQuizId} onComplete={handleQuizComplete} onBack={handleQuizBack} />;
    }

    if (isInLessonMode) {
      return <LessonView onBack={handleLessonBack} pathId={activeLessonPathId} />;
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onViewLearning={() => setActiveTab('learning-path')} onStartLesson={(pathId) => handleLessonStart(pathId)} onStartQuiz={(quizId) => setActiveQuizId(quizId)} onViewGamification={() => setActiveTab('gamification')} />;
      case 'learning-path':
        return <LearningPath onStartLesson={(pathId) => handleLessonStart(pathId)} />;
      case 'gamification':
        return <Gamification />;
      case "creator":
        return <CreatorStudio />;
      case 'admin':
        return <AdminDashboard />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onViewLearning={() => setActiveTab('learning-path')} onStartLesson={(pathId) => handleLessonStart(pathId)} />;
    }
  };

  if (showOnboarding && isAuthenticated) {
    return (
      <Onboarding
        userName={user?.username?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
        onComplete={() => {
          setShowOnboarding(false);
          routeByRole();
        }}
        onOpenAuth={() => {
          setShowOnboarding(false);
          setIsAuthOpen(true);
        }}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4 animate-pulse">
            L
          </div>
          <h2 className="text-xl font-bold text-base-content mb-2">LearnQuest</h2>
          <div className="flex items-center justify-center gap-1 mt-3">
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (showContact) {
    return <ContactUs onBack={() => setShowContact(false)} />;
  }
  if (showAbout) {
    return <AboutPage onBack={() => setShowAbout(false)} />;
  }
  if (showPrivacy) {
    return <PrivacyPage onBack={() => setShowPrivacy(false)} />;
  }
  if (showTerms) {
    return <TermsPage onBack={() => setShowTerms(false)} />;
  }

  if (!isAuthenticated) {
    return (
      <>
        <LandingPage
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenContact={() => setShowContact(true)}
          onOpenAbout={() => setShowAbout(true)}
          onOpenPrivacy={() => setShowPrivacy(true)}
          onOpenTerms={() => setShowTerms(true)}
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
