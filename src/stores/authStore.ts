import { create } from 'zustand';
import { authService, User } from '../services/authService';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: authService.getStoredUser(),
  isAuthenticated: authService.isAuthenticated(),
  isLoading: false,
  error: null,

  login: async (email: string, password: string): Promise<boolean> => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(email, password);
      set({ 
        user: response.user, 
        isAuthenticated: true, 
        isLoading: false 
      });
      return true;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      const errorMessage = err.response?.data?.error || 'Login failed. Please try again.';
      set({ error: errorMessage, isLoading: false });
      return false;
    }
  },

  register: async (username: string, email: string, password: string): Promise<boolean> => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.register(username, email, password);
      set({ 
        user: response.user, 
        isAuthenticated: true, 
        isLoading: false 
      });
      return true;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      const errorMessage = err.response?.data?.error || 'Registration failed. Please try again.';
      set({ error: errorMessage, isLoading: false });
      return false;
    }
  },

  logout: () => {
    authService.logout();
    set({ user: null, isAuthenticated: false, error: null });
  },

  checkAuth: async () => {
    if (!authService.isAuthenticated()) {
      set({ user: null, isAuthenticated: false });
      return;
    }
    
    set({ isLoading: true });
    try {
      const user = await authService.getCurrentUser();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch {
      // Token invalid - clear auth state
      authService.logout();
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
