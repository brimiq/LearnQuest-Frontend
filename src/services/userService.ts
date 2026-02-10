import api from './api';
import type { User } from '../types';

export interface UserStats {
    xp: number;
    points: number;
    streak_days: number;
    hours_learned: number;
    badges_count: number;
    paths_completed: number;
    rank: number;
}

export const userService = {
    getUsers: async (): Promise<User[]> => {
        const response = await api.get<{ users: User[] }>('/users');
        return response.data.users;
    },

    getUser: async (id: number): Promise<User> => {
        const response = await api.get<{ user: User }>(`/users/${id}`);
        return response.data.user;
    },

    updateProfile: async (data: Partial<User>): Promise<User> => {
        const response = await api.put<{ user: User; message: string }>('/users/profile', data);
        return response.data.user;
    },

    getUserStats: async (userId: number): Promise<UserStats> => {
        const response = await api.get<UserStats>(`/users/${userId}/stats`);
        return response.data;
    },
};
