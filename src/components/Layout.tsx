import React, { useState } from 'react';
import { 
  BookOpen, 
  LayoutDashboard, 
  Trophy, 
  PlusCircle, 
  Settings, 
  Search, 
  Bell, 
  Menu,
  User,
  LogOut,
  ChevronLeft,
<<<<<<< Updated upstream
  ChevronRight
} from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'motion/react';
=======
  ChevronRight,
  LogOut,
} from "lucide-react";
import clsx from "clsx";
import { motion, AnimatePresence } from "motion/react";
import { useAuthStore } from "../stores/authStore";
>>>>>>> Stashed changes

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: 'Learner' | 'Contributor' | 'Admin';
  onOpenAuth: () => void;
  isLoggedIn: boolean;
}

export function Layout({ children, activeTab, setActiveTab, userRole, onOpenAuth, isLoggedIn }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'learning-path', label: 'My Learning', icon: BookOpen },
    { id: 'gamification', label: 'Achievements', icon: Trophy },
  ];

  if (userRole === 'Contributor' || userRole === 'Admin') {
    navItems.push({ id: 'creator', label: 'Creator Studio', icon: PlusCircle });
  }

  const sidebarContent = (
    <div className="flex flex-col h-full bg-card border-r border-border shadow-sm">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white font-bold text-xl">
          L
        </div>
        {(isSidebarOpen || isMobileMenuOpen) && (
          <span className="font-bold text-xl tracking-tight text-foreground">LearnQuest</span>
        )}
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id);
              setIsMobileMenuOpen(false);
            }}
            className={clsx(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium",
              activeTab === item.id 
                ? "bg-primary/20 text-accent-foreground" 
                : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
            )}
          >
            <item.icon size={20} className={activeTab === item.id ? "text-accent" : ""} />
            {(isSidebarOpen || isMobileMenuOpen) && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        {(isSidebarOpen || isMobileMenuOpen) && (
          <div className="mb-4 px-4">
             <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
               Status
             </div>
             <div className="bg-secondary/50 p-3 rounded-lg flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-sm font-medium">Online</span>
             </div>
          </div>
        )}
        
        <button className={clsx(
          "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors text-sm font-medium",
          !isSidebarOpen && "justify-center"
        )}>
          <Settings size={20} />
          {(isSidebarOpen || isMobileMenuOpen) && <span>Settings</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 260 : 80 }}
        className="hidden md:block h-full shrink-0 relative z-20"
      >
<<<<<<< Updated upstream
        <SidebarContent />
        <button 
=======
        {sidebarContent}
        <button
>>>>>>> Stashed changes
          onClick={toggleSidebar}
          className="absolute -right-3 top-8 w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center border-2 border-background shadow-sm hover:scale-110 transition-transform cursor-pointer"
        >
          {isSidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>
      </motion.aside>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
            />
            <motion.div 
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              className="fixed inset-y-0 left-0 w-[280px] z-50 md:hidden"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Header */}
        <header className="h-16 border-b border-border bg-card/80 backdrop-blur-sm flex items-center justify-between px-4 md:px-8 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleMobileMenu}
              className="md:hidden p-2 text-muted-foreground hover:bg-secondary rounded-lg"
            >
              <Menu size={20} />
            </button>
            
            <div className="relative hidden sm:block w-64 md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input 
                type="text" 
                placeholder="Search paths, mentors, quizzes..." 
                className="w-full pl-10 pr-4 py-2 bg-secondary/30 border border-transparent focus:border-accent focus:bg-card focus:ring-2 focus:ring-accent/20 rounded-full text-sm transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button className="relative p-2 text-muted-foreground hover:bg-secondary rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full border border-card"></span>
            </button>
            
            <div className="h-6 w-px bg-border mx-1"></div>
            
            {isLoggedIn ? (
<<<<<<< Updated upstream
              <button className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-secondary/50 transition-colors">
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-semibold text-foreground">Alex Chen</div>
                  <div className="text-xs text-muted-foreground">Level 12 Scholar</div>
                </div>
                <div className="w-8 h-8 rounded-full bg-primary/30 border-2 border-primary flex items-center justify-center overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop" 
                    alt="User" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </button>
=======
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-3 pl-2 pr-1 py-1">
                  <div className="text-right hidden sm:block">
                    <div className="text-sm font-semibold text-foreground">
                      {userName}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {userRole}
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-primary/30 border-2 border-primary flex items-center justify-center overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop"
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <button
                  onClick={() => useAuthStore.getState().logout()}
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                  title="Sign Out"
                >
                  <LogOut size={18} />
                </button>
              </div>
>>>>>>> Stashed changes
            ) : (
              <button 
                onClick={onOpenAuth}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
              >
                <User size={16} />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
