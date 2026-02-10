import { create } from 'zustand';
import { learningPathService } from '../services/learningPathService';
import type { LearningPath, UserProgress } from '../types';

interface LearningState {
  paths: LearningPath[];
  myPaths: (LearningPath & { progress: UserProgress })[];
  currentPath: LearningPath | null;
  currentProgress: UserProgress | null;
  isLoading: boolean;
  error: string | null;
  
  fetchPaths: (category?: string) => Promise<void>;
  fetchMyPaths: () => Promise<void>;
  fetchPath: (id: number) => Promise<void>;
  enrollInPath: (pathId: number) => Promise<void>;
  completeResource: (resourceId: number, timeSpent?: number) => Promise<{ xp_earned: number }>;
  completeModule: (moduleId: number) => Promise<{ xp_earned: number }>;
  clearError: () => void;
}

export const useLearningStore = create<LearningState>((set, get) => ({
  paths: [],
  myPaths: [],
  currentPath: null,
  currentProgress: null,
  isLoading: false,
  error: null,

  fetchPaths: async (category?: string) => {
    set({ isLoading: true, error: null });
    try {
      const paths = await learningPathService.getLearningPaths(category);
      set({ paths, isLoading: false });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch paths';
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchMyPaths: async () => {
    set({ isLoading: true, error: null });
    try {
      const myPaths = await learningPathService.getMyPaths();
      set({ myPaths, isLoading: false });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch your paths';
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchPath: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const [path, progressResponse] = await Promise.all([
        learningPathService.getLearningPath(id),
        learningPathService.getPathProgress(id).catch(() => ({ enrolled: false, progress: null }))
      ]);
      set({ 
        currentPath: path, 
        currentProgress: progressResponse.progress,
        isLoading: false 
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch path';
      set({ error: errorMessage, isLoading: false });
    }
  },

  enrollInPath: async (pathId: number) => {
    set({ isLoading: true, error: null });
    try {
      const progress = await learningPathService.enrollInPath(pathId);
      set({ currentProgress: progress, isLoading: false });
      
      // Update the current path's enrolled count
      const currentPath = get().currentPath;
      if (currentPath && currentPath.id === pathId) {
        set({ currentPath: { ...currentPath, enrolled_count: currentPath.enrolled_count + 1 } });
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to enroll';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  completeResource: async (resourceId: number, timeSpent?: number) => {
    try {
      const result = await learningPathService.completeResource(resourceId, timeSpent);
      
      // Update local progress
      const currentProgress = get().currentProgress;
      if (currentProgress) {
        const updatedResources = [...currentProgress.completed_resources, resourceId];
        set({
          currentProgress: {
            ...currentProgress,
            completed_resources: updatedResources,
            xp_earned: currentProgress.xp_earned + result.xp_earned
          }
        });
      }
      
      return result;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to complete resource';
      set({ error: errorMessage });
      throw error;
    }
  },

  completeModule: async (moduleId: number) => {
    try {
      const result = await learningPathService.completeModule(moduleId);
      set({ currentProgress: result.progress });
      return result;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to complete module';
      set({ error: errorMessage });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
