import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, XCircle, CheckCircle2, ChevronRight, RotateCcw } from 'lucide-react';
import { QuizResult as QuizResultType, Question, UserAnswer } from '../../types/quiz';

interface QuizResultProps {
    result: QuizResultType;
    questions: Question[];
    onContinue: () => void;
    onReview?: () => void;
}

export function QuizResult({ result, questions, onContinue, onReview }: QuizResultProps) {
    const [showReview, setShowReview] = useState(false);

    const percentage = Math.round((result.score / result.totalQuestions) * 100);
    const isPerfectScore = percentage === 100;
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    // Confetti animation for perfect score
    const confettiParticles = Array.from({ length: 50 });

    if (showReview) {
        return (
            <div className="min-h-screen bg-background p-4 md:p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-lg">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                                Answer Review
                            </h2>
                            <button
                                onClick={() => setShowReview(false)}
                                className="text-accent hover:underline font-medium"
                            >
                                Back to Results
                            </button>
                        </div>

                        <div className="space-y-6">
                            {questions.map((question, index) => {
                                const userAnswer = result.answers[index];
                                const isCorrect = userAnswer.isCorrect;
                                const selectedOption = question.options[userAnswer.selectedAnswer];
                                const correctOption = question.options[question.correctAnswer];

                                return (
                                    <div
                                        key={question.id}
                                        className={`p-6 rounded-xl border-2 ${isCorrect
                                                ? 'border-green-500/30 bg-green-500/5'
                                                : 'border-destructive/30 bg-destructive/5'
                                            }`}
                                    >
                                        <div className="flex items-start gap-3 mb-4">
                                            {isCorrect ? (
                                                <CheckCircle2 className="text-green-500 shrink-0 mt-1" size={24} />
                                            ) : (
                                                <XCircle className="text-destructive shrink-0 mt-1" size={24} />
                                            )}
                                            <div className="flex-1">
                                                <h3 className="text-lg font-bold text-foreground mb-2">
                                                    Question {index + 1}
                                                </h3>
                                                <p className="text-foreground mb-4">{question.question}</p>
                                            </div>
                                        </div>

                                        <div className="ml-9 space-y-3">
                                            {!isCorrect && (
                                                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                                                    <p className="text-sm font-medium text-destructive mb-1">
                                                        Your answer:
                                                    </p>
                                                    <p className="text-foreground">{selectedOption}</p>
                                                </div>
                                            )}

                                            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                                                <p className="text-sm font-medium text-green-600 mb-1">
                                                    Correct answer:
                                                </p>
                                                <p className="text-foreground">{correctOption}</p>
                                            </div>

                                            {question.explanation && (
                                                <div className="p-3 rounded-lg bg-secondary/50 border border-border">
                                                    <p className="text-sm font-medium text-foreground mb-1">
                                                        Explanation:
                                                    </p>
                                                    <p className="text-muted-foreground text-sm">
                                                        {question.explanation}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <button
                            onClick={onContinue}
                            className="w-full mt-8 px-6 py-4 bg-accent text-white rounded-xl font-bold text-lg shadow-lg shadow-accent/20 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                        >
                            Continue Learning
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-4 md:p-8 relative overflow-hidden">
            {/* Confetti animation for perfect score */}
            {isPerfectScore && (
                <div className="absolute inset-0 pointer-events-none">
                    {confettiParticles.map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-2 h-2 rounded-full"
                            style={{
                                left: '50%',
                                top: '20%',
                                backgroundColor: ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'][i % 5],
                            }}
                            initial={{ opacity: 1, scale: 1 }}
                            animate={{
                                x: (Math.random() - 0.5) * 1000,
                                y: Math.random() * 800 + 200,
                                opacity: 0,
                                scale: Math.random() * 2,
                                rotate: Math.random() * 720,
                            }}
                            transition={{
                                duration: 2 + Math.random() * 2,
                                ease: 'easeOut',
                            }}
                        />
                    ))}
                </div>
            )}

            <div className="max-w-2xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-card rounded-2xl border border-border p-8 md:p-12 shadow-2xl text-center"
                >
                    {/* Status icon and heading */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                        className="mb-6"
                    >
                        {result.passed ? (
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 mb-4">
                                <Trophy className="text-green-500" size={40} />
                            </div>
                        ) : (
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-destructive/10 mb-4">
                                <RotateCcw className="text-destructive" size={40} />
                            </div>
                        )}

                        <h2 className={`text-3xl md:text-4xl font-bold mb-2 ${result.passed ? 'text-green-500' : 'text-destructive'
                            }`}>
                            {result.passed ? (isPerfectScore ? 'Perfect Score!' : 'You Passed!') : 'Keep Trying!'}
                        </h2>
                        <p className="text-muted-foreground">
                            {result.passed
                                ? 'Congratulations on completing this quiz!'
                                : "Don't worry, you can retake this quiz anytime."}
                        </p>
                    </motion.div>

                    {/* Circular progress */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.4, type: 'spring' }}
                        className="relative w-48 h-48 mx-auto mb-8"
                    >
                        <svg className="transform -rotate-90 w-48 h-48">
                            {/* Background circle */}
                            <circle
                                cx="96"
                                cy="96"
                                r={radius}
                                stroke="currentColor"
                                strokeWidth="12"
                                fill="none"
                                className="text-secondary"
                            />
                            {/* Progress circle */}
                            <motion.circle
                                cx="96"
                                cy="96"
                                r={radius}
                                stroke="currentColor"
                                strokeWidth="12"
                                fill="none"
                                strokeLinecap="round"
                                className={result.passed ? 'text-green-500' : 'text-destructive'}
                                strokeDasharray={circumference}
                                initial={{ strokeDashoffset: circumference }}
                                animate={{ strokeDashoffset }}
                                transition={{ delay: 0.6, duration: 1, ease: 'easeOut' }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1 }}
                                className="text-4xl font-bold text-foreground"
                            >
                                {percentage}%
                            </motion.span>
                            <span className="text-sm text-muted-foreground">
                                {result.score} / {result.totalQuestions} correct
                            </span>
                        </div>
                    </motion.div>

                    {/* XP earned */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2 }}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-full mb-8"
                    >
                        <Trophy className="text-yellow-500" size={24} />
                        <span className="text-lg font-bold text-foreground">
                            +{result.xpEarned} XP Earned
                        </span>
                        {isPerfectScore && (
                            <span className="text-sm text-yellow-600 font-medium">
                                (Perfect Bonus!)
                            </span>
                        )}
                    </motion.div>

                    {/* Action buttons */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.4 }}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        {onReview && (
                            <button
                                onClick={() => setShowReview(true)}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 border border-border rounded-xl font-semibold hover:bg-secondary/50 transition-colors"
                            >
                                <RotateCcw size={20} />
                                Review Answers
                            </button>
                        )}
                        <button
                            onClick={onContinue}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-accent text-white rounded-xl font-semibold shadow-lg shadow-accent/20 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                        >
                            Continue
                            <ChevronRight size={20} />
                        </button>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
