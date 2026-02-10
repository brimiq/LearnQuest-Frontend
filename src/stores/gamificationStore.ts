import { create } from 'zustand';
import { gamificationService } from '../services/gamificationService';
import type { Badge, UserBadge, Challenge, LeaderboardEntry } from '../types';

interface GamificationState {
  badges: Badge[];
  userBadges: UserBadge[];
  leaderboard: LeaderboardEntry[];
  userRank: number | null;
  challenges: Challenge[];
  leaderboardPeriod: string;
  isLoading: boolean;
  error: string | null;
  
  fetchBadges: () => Promise<void>;
  fetchUserBadges: (userId: number) => Promise<void>;
  fetchLeaderboard: (period?: string, limit?: number) => Promise<void>;
  fetchMyRank: (period?: string) => Promise<void>;
  fetchChallenges: () => Promise<void>;
  updateStreak: () => Promise<{ streak_days: number; xp_earned: number }>;
  clearError: () => void;
}

export const useGamificationStore = create<GamificationState>((set) => ({
  badges: [],
  userBadges: [],
  leaderboard: [],
  userRank: null,
  challenges: [],
  leaderboardPeriod: 'weekly',
  isLoading: false,
  error: null,

  fetchBadges: async () => {
    set({ isLoading: true, error: null });
    try {
      const badges = await gamificationService.getBadges();
      set({ badges, isLoading: false });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch badges';
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchUserBadges: async (userId: number) => {
    set({ isLoading: true, error: null });
    try {
      const userBadges = await gamificationService.getUserBadges(userId);
      set({ userBadges, isLoading: false });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch user badges';
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchLeaderboard: async (period: string = 'weekly', limit: number = 50) => {
    set({ isLoading: true, error: null });
    try {
      const response = await gamificationService.getLeaderboard(period, limit);
      set({ 
        leaderboard: response.leaderboard, 
        leaderboardPeriod: period,
        isLoading: false 
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch leaderboard';
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchMyRank: async (period: string = 'all_time') => {
    try {
      const response = await gamificationService.getMyRank(period);
      set({ userRank: response.user_rank });
    } catch (error: unknown) {
      console.error('Failed to fetch rank:', error);
    }
  },

  fetchChallenges: async () => {
    set({ isLoading: true, error: null });
    try {
      const challenges = await gamificationService.getChallenges(true);
      set({ challenges, isLoading: false });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch challenges';
      set({ error: errorMessage, isLoading: false });
    }
  },

  updateStreak: async () => {
    try {
      const response = await gamificationService.updateStreak();
      return { 
        streak_days: response.streak_days, 
        xp_earned: response.bonuses?.reduce((sum, b) => sum + b.xp, 0) || 0 
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update streak';
      set({ error: errorMessage });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
