/**
 * Quiz Question interface
 */
export interface Question {
    id: string | number;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
}

/**
 * User's answer to a quiz question
 */
export interface UserAnswer {
    questionId: string | number;
    selectedAnswer: number;
    isCorrect: boolean;
}

/**
 * Quiz result after submission
 */
export interface QuizResult {
    score: number;
    totalQuestions: number;
    xpEarned: number;
    passed: boolean;
    answers: UserAnswer[];
}

/**
 * Quiz data from API
 */
export interface Quiz {
    id: string | number;
    moduleId: string | number;
    title: string;
    description?: string;
    questions: Question[];
    passingScore: number;
    timeLimit?: number; // in seconds
}
