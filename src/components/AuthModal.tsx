import { useState } from 'react';
import { motion } from 'motion/react';
import { X, Mail, Lock, Github, User } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '../stores/authStore';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

export function AuthModal({ isOpen, onClose, onLogin }: AuthModalProps) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, register } = useAuthStore();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (isLoginMode) {
        await login(email, password);
        toast.success('Welcome back!');
      } else {
        if (!username.trim()) {
          setError('Username is required');
          setIsSubmitting(false);
          return;
        }
        await register(username, email, password);
        toast.success('Account created! Welcome to LearnQuest!');
      }
      onLogin();
      onClose();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
      if (errorMessage.includes('401') || errorMessage.includes('Invalid')) {
        setError('Invalid email or password');
      } else if (errorMessage.includes('409') || errorMessage.includes('already')) {
        setError('Email or username already exists');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('alex@example.com');
    setPassword('demo123');
    setIsSubmitting(true);
    setError('');
    
    try {
      await login('alex@example.com', 'demo123');
      toast.success('Logged in as Alex Learner (demo)');
      onLogin();
      onClose();
    } catch {
      setError('Demo login failed. Make sure the backend is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative w-full max-w-md bg-base-200 rounded-3xl shadow-2xl overflow-hidden"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-base-content/60 hover:text-base-content hover:bg-base-300 rounded-full transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-base-content mb-2">
              {isLoginMode ? 'Welcome Back!' : 'Join LearnQuest'}
            </h2>
            <p className="text-base-content/60">
              {isLoginMode 
                ? 'Enter your credentials to access your account.' 
                : 'Start your learning journey today.'}
            </p>
          </div>

          <div className="space-y-3">
            <button 
              onClick={handleDemoLogin}
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-accent to-primary text-white rounded-xl font-medium hover:opacity-90 transition-all flex items-center justify-center gap-3 shadow-lg"
            >
              Try Demo Account
            </button>
            <button className="w-full py-3 border border-base-300 rounded-xl font-medium text-base-content hover:bg-base-300/30 transition-colors flex items-center justify-center gap-3">
              <Github size={20} />
              Continue with GitHub
            </button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-base-300"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-base-200 px-2 text-base-content/60">Or continue with email</span>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-lg text-error text-sm text-center">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {!isLoginMode && (
              <div className="space-y-2">
                <label className="text-sm font-bold text-base-content ml-1">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/60" size={18} />
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="johndoe" 
                    className="w-full pl-10 pr-4 py-3 bg-base-300/20 border border-base-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    required={!isLoginMode}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-bold text-base-content ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/60" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com" 
                  className="w-full pl-10 pr-4 py-3 bg-base-300/20 border border-base-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-base-content ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/60" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********" 
                  className="w-full pl-10 pr-4 py-3 bg-base-300/20 border border-base-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-3 bg-primary text-primary-content rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Please wait...' : (isLoginMode ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-base-content/60">
              {isLoginMode ? "Don't have an account? " : "Already have an account? "}
            </span>
            <button 
              onClick={() => {
                setIsLoginMode(!isLoginMode);
                setError('');
              }}
              className="font-bold text-primary hover:underline"
            >
              {isLoginMode ? 'Sign Up' : 'Log In'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
