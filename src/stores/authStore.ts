import { create } from 'zustand';
import { authService, User } from '../services/authService';
import { toast } from 'sonner';

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

interface AuthActions {
    login: (email: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    checkAuth: () => Promise<void>;
    clearError: () => void;
}

type AuthStore = AuthState & AuthActions;

/**
 * Zustand store for authentication state management
 */
export const useAuthStore = create<AuthStore>((set) => ({
    // Initial state
    user: authService.getUser(),
    token: authService.getToken(),
    isAuthenticated: authService.isAuthenticated(),
    isLoading: false,
    error: null,

    /**
     * Login user with email and password
     */
    login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
            const response = await authService.login(email, password);

            set({
                user: response.user,
                token: response.access_token,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            });

            toast.success('Login successful!', {
                description: `Welcome back, ${response.user.username}!`,
            });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Login failed';

            set({
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
                error: errorMessage,
            });

            toast.error('Login failed', {
                description: errorMessage,
            });

            throw error;
        }
    },

    /**
     * Register new user
     */
    register: async (username: string, email: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
            const response = await authService.register(username, email, password);

            set({
                user: response.user,
                token: response.access_token,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            });

            toast.success('Registration successful!', {
                description: `Welcome to LearnQuest, ${response.user.username}!`,
            });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Registration failed';

            set({
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
                error: errorMessage,
            });

            toast.error('Registration failed', {
                description: errorMessage,
            });

            throw error;
        }
    },

    /**
     * Logout user
     */
    logout: () => {
        authService.logout();

        set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
        });

        toast.info('Logged out successfully');
    },

    /**
     * Check authentication status on app load
     * Verifies token with backend
     */
    checkAuth: async () => {
        const token = authService.getToken();

        if (!token) {
            set({
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
            });
            return;
        }

        set({ isLoading: true });

        try {
            const user = await authService.verifyToken();

            if (user) {
                set({
                    user,
                    token,
                    isAuthenticated: true,
                    isLoading: false,
                    error: null,
                });
            } else {
                // Token is invalid
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    isLoading: false,
                    error: null,
                });
            }
        } catch {
            set({
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
            });
        }
    },

    /**
     * Clear error state
     */
    clearError: () => {
        set({ error: null });
    },
}));
