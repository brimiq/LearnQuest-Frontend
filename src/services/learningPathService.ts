import api from './api';

export interface Module {
    id: number;
    title: string;
    description: string;
    order: number;
    xp_reward: number;
    learning_path_id: number;
}

export interface LearningPath {
    id: number;
    title: string;
    description: string;
    category: string;
    difficulty: string;
    image_url: string | null;
    xp_reward: number;
    creator_id: number;
    is_published: boolean;
    rating: number;
    enrolled_count: number;
    created_at: string;
    modules?: Module[];
}

export interface CreateLearningPathData {
    title: string;
    description: string;
    category: string;
    difficulty: string;
    image_url?: string;
    xp_reward?: number;
}

export interface CreateModuleData {
    title: string;
    description: string;
    order?: number;
    xp_reward?: number;
}

export const learningPathService = {
    getLearningPaths: async (): Promise<LearningPath[]> => {
        const response = await api.get<{ learning_paths: LearningPath[] }>('/learning-paths');
        return response.data.learning_paths;
    },

    getLearningPath: async (id: number): Promise<LearningPath> => {
        const response = await api.get<{ learning_path: LearningPath }>(`/learning-paths/${id}`);
        return response.data.learning_path;
    },

    createLearningPath: async (data: CreateLearningPathData): Promise<LearningPath> => {
        const response = await api.post<{ learning_path: LearningPath; message: string }>('/learning-paths', data);
        return response.data.learning_path;
    },

    addModule: async (pathId: number, data: CreateModuleData): Promise<Module> => {
        const response = await api.post<{ module: Module; message: string }>(`/learning-paths/${pathId}/modules`, data);
        return response.data.module;
    },

    ratePath: async (pathId: number, rating: number): Promise<number> => {
        const response = await api.post<{ new_rating: number; message: string }>(`/learning-paths/${pathId}/rate`, { rating });
        return response.data.new_rating;
    },
};
