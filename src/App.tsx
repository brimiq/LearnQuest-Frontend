import React, { useState } from "react";
import { Layout } from "./components/Layout";
import { Dashboard } from "./components/Dashboard";
import { LearningPath } from "./components/LearningPath";
import { Gamification } from "./components/Gamification";
import { CreatorStudio } from "./components/CreatorStudio";
import { AuthModal } from "./components/AuthModal";
import { LandingPage } from "./components/LandingPage";
import { LessonView } from "./components/LessonView";
import { ContactUs } from "./components/ContactUs";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { AnimatePresence } from "motion/react";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  const [isInLessonMode, setIsInLessonMode] = useState(false);
  const [showContact, setShowContact] = useState(false);

  const [userRole, setUserRole] = useState<"Learner" | "Contributor" | "Admin">(
    "Admin",
  );

  const handleLogin = (username: string) => {
    setIsLoggedIn(true);
    setIsAuthOpen(false);
    setUserName(username);
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
      case "dashboard":
        return <Dashboard userName={userName} />;
      case "learning-path":
        return <LearningPath onStartLesson={handleLessonStart} />;
      case "gamification":
        return <Gamification />;
      case "creator":
        return <CreatorStudio />;
      case "admin":
        return <AdminDashboard />;
      default:
        return <Dashboard userName={userName} />;
    }
  };

  if (showContact) {
    return <ContactUs onBack={() => setShowContact(false)} />;
  }

  if (!isLoggedIn) {
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
      <Layout
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={userRole}
        onOpenAuth={() => setIsAuthOpen(true)}
        isLoggedIn={isLoggedIn}
        userName={userName}
      >
        <AnimatePresence mode="wait">
          <div key={isInLessonMode ? "lesson" : activeTab} className="h-full">
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
