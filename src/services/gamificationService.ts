import api from './api';
import type { Badge, UserBadge, Challenge, Achievement, LeaderboardEntry } from '../types';

interface LeaderboardResponse {
  leaderboard: LeaderboardEntry[];
  period: string;
  stats?: {
    total_users: number;
    total_xp: number;
  };
}

interface UserRankResponse {
  user_rank: number;
  user: {
    id: number;
    username: string;
    avatar_url?: string;
    xp: number;
    points: number;
  };
  surrounding_users: LeaderboardEntry[];
  period: string;
  total_users: number;
}

interface StreakResponse {
  streak_days: number;
  message: string;
  total_xp: number;
  bonuses?: { type: string; xp: number }[];
}

export const gamificationService = {
  async getBadges(): Promise<Badge[]> {
    const response = await api.get<{ data: { badges: Badge[] } }>('/gamification/badges');
    return response.data.data?.badges || [];
  },

  async getUserBadges(userId: number): Promise<UserBadge[]> {
    const response = await api.get<{ data: { badges: UserBadge[] } }>(`/gamification/badges/${userId}`);
    return response.data.data?.badges || [];
  },

  async getLeaderboard(period: string = 'all_time', limit: number = 50): Promise<LeaderboardResponse> {
    const response = await api.get<{ data: LeaderboardResponse }>('/gamification/leaderboard', {
      params: { period, limit }
    });
    return response.data.data || { leaderboard: [], period };
  },

  async getMyRank(period: string = 'all_time'): Promise<UserRankResponse> {
    const response = await api.get<{ data: UserRankResponse }>('/gamification/leaderboard/me', {
      params: { period }
    });
    return response.data.data;
  },

  async getChallenges(activeOnly: boolean = true): Promise<Challenge[]> {
    const response = await api.get<{ data: { challenges: Challenge[] } }>('/gamification/challenges', {
      params: { active: activeOnly }
    });
    return response.data.data?.challenges || [];
  },

  async getAchievements(): Promise<Achievement[]> {
    const response = await api.get<{ data: { achievements: Achievement[] } }>('/gamification/achievements');
    return response.data.data?.achievements || [];
  },

  async addXp(xp: number): Promise<{ total_xp: number; xp_added: number }> {
    const response = await api.post<{ data: { total_xp: number; xp_added: number } }>('/gamification/xp/add', { xp });
    return response.data.data;
  },

  async updateStreak(): Promise<StreakResponse> {
    const response = await api.post<{ data: StreakResponse }>('/gamification/streak/update');
    return response.data.data;
  },

  async getStreakStatus(): Promise<{ streak_days: number; status: string; message: string }> {
    const response = await api.get<{ data: { streak_days: number; status: string; message: string } }>('/gamification/streak/status');
    return response.data.data;
  }
};
