<<<<<<< Updated upstream
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, Github, Chrome } from 'lucide-react';
import clsx from 'clsx';
=======
import React, { useState } from "react";
import { motion } from "motion/react";
import { X, Mail, Lock, Github, User, Loader2, AlertCircle } from "lucide-react";
import { useAuthStore } from "../stores/authStore";
>>>>>>> Stashed changes

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

export function AuthModal({ isOpen, onClose, onLogin }: AuthModalProps) {
<<<<<<< Updated upstream
  const [isLogin, setIsLogin] = useState(true);

  if (!isOpen) return null;

=======
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const { login, register, isLoading, error, clearError } = useAuthStore();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!isLoginMode && password !== confirmPassword) {
      return;
    }
    
    let success = false;
    if (isLoginMode) {
      success = await login(email, password);
    } else {
      success = await register(username, email, password);
    }
    
    if (success) {
      onLogin();
      onClose();
    }
  };
  
  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    clearError();
    setEmail("");
    setPassword("");
    setUsername("");
    setConfirmPassword("");
  };

>>>>>>> Stashed changes
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
        className="relative w-full max-w-md bg-card rounded-3xl shadow-2xl overflow-hidden"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">
<<<<<<< Updated upstream
              {isLogin ? 'Welcome Back!' : 'Join LearnQuest'}
            </h2>
            <p className="text-muted-foreground">
              {isLogin 
                ? 'Enter your credentials to access your account.' 
                : 'Start your learning journey today.'}
=======
              {isLoginMode ? "Welcome Back!" : "Join LearnQuest"}
            </h2>
            <p className="text-muted-foreground">
              {isLoginMode
                ? "Enter your credentials to access your account."
                : "Start your learning journey today."}
>>>>>>> Stashed changes
            </p>
          </div>

          <div className="space-y-4">
            <button className="w-full py-3 border border-border rounded-xl font-medium text-foreground hover:bg-secondary/30 transition-colors flex items-center justify-center gap-3">
              <Github size={20} />
              Continue with GitHub
            </button>
            <button className="w-full py-3 border border-border rounded-xl font-medium text-foreground hover:bg-secondary/30 transition-colors flex items-center justify-center gap-3">
              <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-[10px] font-bold">G</div>
              Continue with Google
            </button>
          </div>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
            </div>
          </div>

<<<<<<< Updated upstream
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onLogin(); onClose(); }}>
=======
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm">
                <AlertCircle size={16} />
                {error}
              </div>
            )}
            
            {!isLoginMode && (
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground ml-1">
                  Username
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="johndoe"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-secondary/20 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all"
                    required={!isLoginMode}
                  />
                </div>
              </div>
            )}
            
>>>>>>> Stashed changes
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input 
                  type="email" 
                  placeholder="name@example.com" 
                  className="w-full pl-10 pr-4 py-3 bg-secondary/20 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full pl-10 pr-4 py-3 bg-secondary/20 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all"
                />
              </div>
            </div>

<<<<<<< Updated upstream
            <button type="submit" className="w-full py-3 bg-accent text-white rounded-xl font-bold shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/30 hover:-translate-y-0.5 transition-all mt-6">
              {isLogin ? 'Sign In' : 'Create Account'}
=======
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground ml-1">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={18}
                />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-secondary/20 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all"
                  required
                />
              </div>
            </div>
            
            {!isLoginMode && (
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground ml-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={18}
                  />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-secondary/20 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all"
                    required={!isLoginMode}
                  />
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-xs text-destructive ml-1">Passwords do not match</p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || (!isLoginMode && password !== confirmPassword)}
              className="w-full py-3 bg-accent text-white rounded-xl font-bold shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/30 hover:-translate-y-0.5 transition-all mt-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 size={18} className="animate-spin" />}
              {isLoginMode ? "Sign In" : "Create Account"}
>>>>>>> Stashed changes
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">
<<<<<<< Updated upstream
              {isLogin ? "Don't have an account? " : "Already have an account? "}
            </span>
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="font-bold text-accent hover:underline"
            >
              {isLogin ? 'Sign Up' : 'Log In'}
=======
              {isLoginMode
                ? "Don't have an account? "
                : "Already have an account? "}
            </span>
            <button
              onClick={toggleMode}
              className="font-bold text-accent hover:underline"
            >
              {isLoginMode ? "Sign Up" : "Log In"}
>>>>>>> Stashed changes
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
