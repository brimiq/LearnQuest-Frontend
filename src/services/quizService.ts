import api from './api';
import type { Quiz, QuizResult, QuizAttempt } from '../types';

interface QuizAnswer {
  question_id: number;
  answer: number;
}

export const quizService = {
  async getModuleQuiz(moduleId: number): Promise<Quiz> {
    const response = await api.get<{ data: { quiz: Quiz } }>(`/quizzes/module/${moduleId}/quiz`);
    return response.data.data?.quiz;
  },

  async getQuiz(quizId: number): Promise<Quiz> {
    const response = await api.get<{ data: { quiz: Quiz } }>(`/quizzes/${quizId}`);
    return response.data.data?.quiz;
  },

  async submitQuiz(quizId: number, answers: QuizAnswer[], timeTaken?: number): Promise<QuizResult> {
    const response = await api.post<{ data: QuizResult }>(`/quizzes/${quizId}/submit`, {
      answers,
      time_taken: timeTaken || 0
    });
    return response.data.data;
  },

  async getQuizAttempts(quizId: number): Promise<QuizAttempt[]> {
    const response = await api.get<{ data: { attempts: QuizAttempt[] } }>(`/quizzes/${quizId}/attempts`);
    return response.data.data?.attempts || [];
  },

  async getMyAttempts(): Promise<QuizAttempt[]> {
    const response = await api.get<{ data: { attempts: QuizAttempt[] } }>('/quizzes/attempts/me');
    return response.data.data?.attempts || [];
  }
};
