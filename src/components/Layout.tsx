import { useState, useRef, useEffect } from 'react';
import { 
  BookOpen, 
  LayoutDashboard, 
  Trophy, 
  PlusCircle, 
  Settings, 
  Search, 
  Bell, 
  Menu,
  User as UserIcon,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
  Flame,
  Star,
  CheckCircle2,
  Gift
} from 'lucide-react';
import type { User } from '../types';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'motion/react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: 'Learner' | 'Contributor' | 'Admin';
  onOpenAuth: () => void;
  isLoggedIn: boolean;
  onLogout?: () => void;
  user?: User | null;
}

const NOTIFICATIONS = [
  { id: 1, icon: Flame, color: 'text-orange-500', bg: 'bg-orange-500/10', title: 'Streak milestone!', desc: 'You\'ve maintained your learning streak. Keep going!', time: '2m ago', read: false },
  { id: 2, icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-500/10', title: 'New XP earned', desc: 'You earned XP from completing a resource.', time: '1h ago', read: false },
  { id: 3, icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10', title: 'Quiz passed!', desc: 'Great job on the HTML & CSS Quiz!', time: '3h ago', read: true },
  { id: 4, icon: Gift, color: 'text-purple-500', bg: 'bg-purple-500/10', title: 'New challenge available', desc: 'A weekly challenge is waiting for you.', time: '1d ago', read: true },
];

export function Layout({ children, activeTab, setActiveTab, userRole, onOpenAuth, isLoggedIn, onLogout, user }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;
  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));

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

  if (userRole === 'Admin') {
    navItems.push({ id: 'admin', label: 'Admin Panel', icon: Shield });
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-base-200 border-r border-base-300 shadow-sm">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white font-bold text-xl">
          L
        </div>
        {(isSidebarOpen || isMobileMenuOpen) && (
          <span className="font-bold text-xl tracking-tight text-base-content">LearnQuest</span>
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
                ? "bg-primary text-primary-content" 
                : "text-base-content/60 hover:bg-base-300 hover:text-base-content"
            )}
          >
            <item.icon size={20} className={activeTab === item.id ? "text-primary-content" : ""} />
            {(isSidebarOpen || isMobileMenuOpen) && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-base-300">
        {(isSidebarOpen || isMobileMenuOpen) && (
          <div className="mb-4 px-4">
             <div className="text-xs font-semibold text-base-content/60 mb-2 uppercase tracking-wider">
               Status
             </div>
             <div className="bg-base-300/50 p-3 rounded-lg flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-sm font-medium">Online</span>
             </div>
          </div>
        )}
        
        <button 
          onClick={() => {
            setActiveTab('settings');
            setIsMobileMenuOpen(false);
          }}
          className={clsx(
            "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium",
            activeTab === 'settings' 
              ? "bg-primary text-primary-content" 
              : "text-base-content/60 hover:bg-base-300 hover:text-base-content",
            !isSidebarOpen && !isMobileMenuOpen && "justify-center"
          )}
        >
          <Settings size={20} className={activeTab === 'settings' ? "text-primary-content" : ""} />
          {(isSidebarOpen || isMobileMenuOpen) && <span>Settings</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-base-100 overflow-hidden">
      {/* Desktop Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 260 : 80 }}
        className="hidden md:block h-full shrink-0 relative z-20"
      >
        <SidebarContent />
        <button 
          onClick={toggleSidebar}
          className="absolute -right-3 top-8 w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center border-2 border-base-100 shadow-sm hover:scale-110 transition-transform cursor-pointer"
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
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Header */}
        <header className="h-16 border-b border-base-300 bg-base-200/80 backdrop-blur-sm flex items-center justify-between px-4 md:px-8 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleMobileMenu}
              className="md:hidden p-2 text-base-content/60 hover:bg-base-300 rounded-lg"
            >
              <Menu size={20} />
            </button>
            
            <div className="relative hidden sm:block w-64 md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/60" size={16} />
              <input 
                type="text" 
                placeholder="Search paths, mentors, quizzes..." 
                className="w-full pl-10 pr-4 py-2 bg-base-300/30 border border-transparent focus:border-primary focus:bg-base-100 focus:ring-2 focus:ring-primary/20 rounded-full text-sm transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-base-content/60 hover:bg-base-300 rounded-full transition-colors"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-error rounded-full border-2 border-base-200 text-[9px] font-bold text-white flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-12 w-80 bg-base-200 border border-base-300 rounded-2xl shadow-xl overflow-hidden z-50"
                  >
                    <div className="flex items-center justify-between px-4 py-3 border-b border-base-300">
                      <h3 className="font-bold text-base-content text-sm">Notifications</h3>
                      {unreadCount > 0 && (
                        <button onClick={markAllRead} className="text-xs text-primary font-medium hover:underline">
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto divide-y divide-base-300">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))}
                          className={clsx(
                            "flex gap-3 px-4 py-3 cursor-pointer hover:bg-base-300/30 transition-colors",
                            !n.read && "bg-primary/5"
                          )}
                        >
                          <div className={clsx("w-9 h-9 rounded-full flex items-center justify-center shrink-0", n.bg, n.color)}>
                            <n.icon size={16} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={clsx("text-sm leading-tight", !n.read ? "font-bold text-base-content" : "font-medium text-base-content/80")}>{n.title}</p>
                            <p className="text-xs text-base-content/60 mt-0.5 line-clamp-1">{n.desc}</p>
                            <p className="text-[10px] text-base-content/40 mt-1">{n.time}</p>
                          </div>
                          {!n.read && <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0"></div>}
                        </div>
                      ))}
                    </div>
                    <div className="px-4 py-2.5 border-t border-base-300 text-center">
                      <button className="text-xs text-primary font-medium hover:underline">View all notifications</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="h-6 w-px bg-base-300 mx-1"></div>
            
            {isLoggedIn && user ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-3 pl-2 pr-3 py-1 rounded-full hover:bg-base-300/50 transition-colors">
                  <div className="text-right hidden sm:block">
                    <div className="text-sm font-semibold text-base-content">{user.username?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</div>
                    <div className="text-xs text-base-content/60">
                      {user.xp?.toLocaleString() || 0} XP | {user.streak_days || 0} day streak
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center overflow-hidden">
                    {user.avatar_url ? (
                      <img 
                        src={user.avatar_url} 
                        alt={user.username} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-bold text-primary">
                        {user.username?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
                {onLogout && (
                  <button 
                    onClick={onLogout}
                    className="p-2 text-base-content/60 hover:text-error hover:bg-error/10 rounded-full transition-colors"
                    title="Log out"
                  >
                    <LogOut size={18} />
                  </button>
                )}
              </div>
            ) : (
              <button 
                onClick={onOpenAuth}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-content rounded-full text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
              >
                <UserIcon size={16} />
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
