import api from './api';
import type { LearningPath, UserProgress } from '../types';

interface LearningPathsResponse {
  learning_paths: LearningPath[];
}

interface LearningPathResponse {
  learning_path: LearningPath;
}

interface ProgressResponse {
  enrolled: boolean;
  progress: UserProgress | null;
}

interface MyPathsResponse {
  paths: (LearningPath & { progress: UserProgress })[];
}

export const learningPathService = {
  async getLearningPaths(category?: string): Promise<LearningPath[]> {
    const params = category ? { category } : {};
    const response = await api.get<LearningPathsResponse>('/learning-paths/', { params });
    return response.data.learning_paths || [];
  },

  async getLearningPath(id: number): Promise<LearningPath> {
    const response = await api.get<LearningPathResponse>(`/learning-paths/${id}`);
    return response.data.learning_path;
  },

  async getMyPaths(): Promise<(LearningPath & { progress: UserProgress })[]> {
    const response = await api.get<{ data: MyPathsResponse }>('/progress/my-paths');
    return response.data.data?.paths || [];
  },

  async getPathProgress(pathId: number): Promise<ProgressResponse> {
    const response = await api.get<{ data: ProgressResponse }>(`/progress/path/${pathId}`);
    return response.data.data || { enrolled: false, progress: null };
  },

  async enrollInPath(pathId: number): Promise<UserProgress> {
    const response = await api.post<{ data: { progress: UserProgress } }>(`/progress/enroll/${pathId}`);
    return response.data.data?.progress;
  },

  async completeResource(resourceId: number, timeSpent?: number): Promise<{ xp_earned: number; total_xp: number }> {
    const response = await api.post<{ data: { xp_earned: number; total_xp: number } }>(
      `/progress/complete-resource/${resourceId}`,
      { time_spent: timeSpent || 0 }
    );
    return response.data.data;
  },

  async completeModule(moduleId: number): Promise<{ xp_earned: number; progress: UserProgress }> {
    const response = await api.post<{ data: { xp_earned: number; progress: UserProgress } }>(
      `/progress/complete-module/${moduleId}`
    );
    return response.data.data;
  },

  async ratePath(pathId: number, rating: number): Promise<void> {
    await api.post(`/learning-paths/${pathId}/rate`, { rating });
  }
};
