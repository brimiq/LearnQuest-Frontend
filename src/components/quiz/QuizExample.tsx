import React, { useState } from 'react';
import { Quiz } from './Quiz';
import { QuizResult } from './QuizResult';
import { Question, QuizResult as QuizResultType } from '../../types/quiz';

/**
 * Example usage of Quiz component system
 * This demonstrates how to integrate the quiz into your learning modules
 */

// Sample quiz data
const sampleQuestions: Question[] = [
    {
        id: 1,
        question: 'What is the capital of France?',
        options: ['London', 'Berlin', 'Paris', 'Madrid'],
        correctAnswer: 2,
        explanation: 'Paris is the capital and largest city of France.',
    },
    {
        id: 2,
        question: 'Which programming language is known as the language of the web?',
        options: ['Python', 'JavaScript', 'Java', 'C++'],
        correctAnswer: 1,
        explanation: 'JavaScript is the primary language for client-side web development.',
    },
    {
        id: 3,
        question: 'What does HTTP stand for?',
        options: [
            'Hyper Text Transfer Protocol',
            'High Transfer Text Protocol',
            'Hyper Transfer Text Protocol',
            'High Text Transfer Protocol',
        ],
        correctAnswer: 0,
        explanation: 'HTTP stands for Hyper Text Transfer Protocol, which is the foundation of data communication on the web.',
    },
];

export function QuizExample() {
    const [quizResult, setQuizResult] = useState<QuizResultType | null>(null);

    const handleComplete = (result: QuizResultType) => {
        console.log('Quiz completed:', result);
        setQuizResult(result);

        // Here you would typically:
        // 1. Save results to backend via quizService.submitQuiz()
        // 2. Update user progress
        // 3. Award XP to user profile
    };

    const handleContinue = () => {
        console.log('Continuing to next module...');
        // Navigate to next module or learning path
        setQuizResult(null); // Reset for demo
    };

    if (quizResult) {
        return (
            <QuizResult
                result={quizResult}
                questions={sampleQuestions}
                onContinue={handleContinue}
                onReview={() => console.log('Review mode - optional callback')}
            />
        );
    }

    return (
        <Quiz
            questions={sampleQuestions}
            onComplete={handleComplete}
            passingScore={70}
            timeLimit={300} // 5 minutes (optional)
        />
    );
}

/**
 * Integration with API:
 * 
 * import { quizService } from '../../services/quizService';
 * 
 * // Fetch quiz for a module
 * const quiz = await quizService.getQuiz(moduleId);
 * 
 * // After quiz completion
 * const handleComplete = async (result) => {
 *   const serverResult = await quizService.submitQuiz(moduleId, result.answers);
 *   // Server returns updated XP and user progress
 *   setQuizResult(serverResult);
 * };
 */
