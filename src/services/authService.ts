import api from './api';

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'contributor' | 'learner';
  xp: number;
  points: number;
  streak_days: number;
  hours_learned: number;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
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

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', { email, password });
    const { access_token, user } = response.data;
    
    // Store token and user in localStorage
    localStorage.setItem('token', access_token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return response.data;
  },

  register: async (username: string, email: string, password: string): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>('/auth/register', { username, email, password });
    const { access_token, user } = response.data;
    
    // Store token and user in localStorage
    localStorage.setItem('token', access_token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return response.data;
  },

  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<{ user: User }>('/auth/me');
    return response.data.user;
  },

  getStoredUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  },

  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },
};
