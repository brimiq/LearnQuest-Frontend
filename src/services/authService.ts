import axios from 'axios';

const API_URL = '/api/auth';

export interface User {
    id: number;
    username: string;
    email: string;
    avatar_url?: string;
    role?: string;
    created_at?: string;
}

export interface LoginResponse {
    message: string;
    user: User;
    access_token: string;
}

export interface RegisterResponse {
    message: string;
    user: User;
    access_token: string;
}

/**
 * Authentication service for handling user authentication operations
 */
export const authService = {
    /**
     * Login user with email and password
     */
    login: async (email: string, password: string): Promise<LoginResponse> => {
        try {
            const response = await axios.post<LoginResponse>(`${API_URL}/login`, {
                email,
                password,
            });

            // Store token and user data in localStorage
            if (response.data.access_token) {
                localStorage.setItem('token', response.data.access_token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }

            return response.data;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error
                ? error.message
                : (error as any).response?.data?.error || 'Login failed';
            throw new Error(errorMessage);
        }
    },

    /**
     * Register new user
     */
    register: async (username: string, email: string, password: string): Promise<RegisterResponse> => {
        try {
            const response = await axios.post<RegisterResponse>(`${API_URL}/register`, {
                username,
                email,
                password,
            });

            // Store token and user data in localStorage
            if (response.data.access_token) {
                localStorage.setItem('token', response.data.access_token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }

            return response.data;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error
                ? error.message
                : (error as any).response?.data?.error || 'Registration failed';
            throw new Error(errorMessage);
        }
    },

    /**
     * Logout user and clear stored data
     */
    logout: (): void => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    /**
     * Get stored JWT token
     */
    getToken: (): string | null => {
        return localStorage.getItem('token');
    },

    /**
     * Get stored user data
     */
    getUser: (): User | null => {
        const userStr = localStorage.getItem('user');
        if (!userStr) return null;

        try {
            return JSON.parse(userStr);
        } catch {
            return null;
        }
    },

    /**
     * Check if user is authenticated (has valid token)
     */
    isAuthenticated: (): boolean => {
        const token = authService.getToken();
        return !!token;
    },

    /**
     * Verify current token is valid by calling /me endpoint
     */
    verifyToken: async (): Promise<User | null> => {
        const token = authService.getToken();
        if (!token) return null;

        try {
            const response = await axios.get<{ user: User }>(`${API_URL}/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Update stored user data
            localStorage.setItem('user', JSON.stringify(response.data.user));
            return response.data.user;
        } catch {
            // Token is invalid or expired
            authService.logout();
            return null;
        }
    },
};
