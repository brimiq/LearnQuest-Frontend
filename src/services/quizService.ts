import axios from 'axios';
import { Quiz, QuizResult, UserAnswer } from '../types/quiz';

const API_URL = '/api/modules';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Quiz service for API interactions
 */
export const quizService = {
    /**
     * Get quiz for a specific module
     */
    getQuiz: async (moduleId: string | number): Promise<Quiz> => {
        try {
            const response = await axios.get<Quiz>(`${API_URL}/${moduleId}/quiz`, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error
                ? error.message
                : (error as any).response?.data?.error || 'Failed to fetch quiz';
            throw new Error(errorMessage);
        }
    },

    /**
     * Submit quiz answers and get results with XP
     */
    submitQuiz: async (
        moduleId: string | number,
        answers: UserAnswer[]
    ): Promise<QuizResult> => {
        try {
            const response = await axios.post<QuizResult>(
                `${API_URL}/${moduleId}/quiz/submit`,
                { answers },
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error
                ? error.message
                : (error as any).response?.data?.error || 'Failed to submit quiz';
            throw new Error(errorMessage);
        }
    },
};
