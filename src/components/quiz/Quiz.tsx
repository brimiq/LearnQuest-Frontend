import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';
import { Question, UserAnswer, QuizResult } from '../../types/quiz';

interface QuizProps {
    questions: Question[];
    onComplete: (result: QuizResult) => void;
    passingScore?: number;
    timeLimit?: number;
}

type QuizMode = 'taking' | 'review' | 'completed';

export function Quiz({ questions, onComplete, passingScore = 70, timeLimit }: QuizProps) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Map<string | number, number>>(new Map());
    const [mode, setMode] = useState<QuizMode>('taking');
    const [timeRemaining, setTimeRemaining] = useState(timeLimit);

    const currentQuestion = questions[currentQuestionIndex];
    const totalQuestions = questions.length;
    const isFirstQuestion = currentQuestionIndex === 0;
    const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
    const answeredQuestions = answers.size;

    // Timer effect
    React.useEffect(() => {
        if (timeLimit && timeRemaining !== undefined && timeRemaining > 0 && mode === 'taking') {
            const timer = setInterval(() => {
                setTimeRemaining((prev) => {
                    if (prev && prev <= 1) {
                        handleSubmit();
                        return 0;
                    }
                    return prev ? prev - 1 : 0;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [timeLimit, timeRemaining, mode]);

    const handleSelectAnswer = (answerIndex: number) => {
        setAnswers(new Map(answers).set(currentQuestion.id, answerIndex));
    };

    const handleNext = () => {
        if (!isLastQuestion) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else if (answeredQuestions === totalQuestions) {
            setMode('review');
        }
    };

    const handlePrevious = () => {
        if (!isFirstQuestion) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleSubmit = () => {
        // Calculate results
        const userAnswers: UserAnswer[] = questions.map((q) => {
            const selectedAnswer = answers.get(q.id) ?? -1;
            return {
                questionId: q.id,
                selectedAnswer,
                isCorrect: selectedAnswer === q.correctAnswer,
            };
        });

        const correctCount = userAnswers.filter((a) => a.isCorrect).length;
        const score = Math.round((correctCount / totalQuestions) * 100);
        const passed = score >= passingScore;

        // XP calculation: 10 XP per correct + 50 bonus for perfect score
        const xpEarned = correctCount * 10 + (score === 100 ? 50 : 0);

        const result: QuizResult = {
            score: correctCount,
            totalQuestions,
            xpEarned,
            passed,
            answers: userAnswers,
        };

        onComplete(result);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Review mode
    if (mode === 'review') {
        return (
            <div className="min-h-screen bg-background p-4 md:p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-lg">
                        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                            Review Your Answers
                        </h2>
                        <p className="text-muted-foreground mb-8">
                            You've answered {answeredQuestions} out of {totalQuestions} questions. Review your answers before submitting.
                        </p>

                        <div className="space-y-4 mb-8">
                            {questions.map((question, index) => {
                                const userAnswer = answers.get(question.id);
                                const hasAnswered = userAnswer !== undefined;

                                return (
                                    <div
                                        key={question.id}
                                        className="flex items-center justify-between p-4 rounded-lg border border-border bg-secondary/20"
                                    >
                                        <div className="flex items-center gap-3">
                                            {hasAnswered ? (
                                                <CheckCircle2 className="text-green-500" size={20} />
                                            ) : (
                                                <XCircle className="text-destructive" size={20} />
                                            )}
                                            <span className="font-medium">
                                                Question {index + 1}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setCurrentQuestionIndex(index);
                                                setMode('taking');
                                            }}
                                            className="text-accent hover:underline text-sm font-medium"
                                        >
                                            {hasAnswered ? 'Change Answer' : 'Answer Now'}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setMode('taking')}
                                className="flex-1 px-6 py-3 border border-border rounded-xl font-semibold hover:bg-secondary/50 transition-colors"
                            >
                                Keep Editing
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={answeredQuestions < totalQuestions}
                                className="flex-1 px-6 py-3 bg-accent text-white rounded-xl font-semibold shadow-lg shadow-accent/20 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                            >
                                Submit Quiz
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Taking quiz mode
    const selectedAnswer = answers.get(currentQuestion.id);

    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <div className="max-w-3xl mx-auto">
                {/* Header with progress */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg md:text-xl font-bold text-foreground">
                            Question {currentQuestionIndex + 1} of {totalQuestions}
                        </h2>
                        {timeRemaining !== undefined && (
                            <div className={`px-4 py-2 rounded-full font-mono font-semibold ${timeRemaining < 60 ? 'bg-destructive/10 text-destructive' : 'bg-secondary text-foreground'
                                }`}>
                                {formatTime(timeRemaining)}
                            </div>
                        )}
                    </div>

                    {/* Progress bar */}
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-accent"
                            initial={{ width: 0 }}
                            animate={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                </div>

                {/* Question card */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentQuestion.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-lg mb-6"
                    >
                        <h3 className="text-xl md:text-2xl font-bold text-foreground mb-8">
                            {currentQuestion.question}
                        </h3>

                        <div className="space-y-3">
                            {currentQuestion.options.map((option, index) => (
                                <label
                                    key={index}
                                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedAnswer === index
                                            ? 'border-accent bg-accent/10'
                                            : 'border-border hover:border-accent/50 hover:bg-secondary/30'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name={`question-${currentQuestion.id}`}
                                        checked={selectedAnswer === index}
                                        onChange={() => handleSelectAnswer(index)}
                                        className="w-5 h-5 text-accent focus:ring-accent focus:ring-2"
                                    />
                                    <span className="text-foreground font-medium flex-1">
                                        {option}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Navigation buttons */}
                <div className="flex items-center justify-between gap-4">
                    <button
                        onClick={handlePrevious}
                        disabled={isFirstQuestion}
                        className="flex items-center gap-2 px-6 py-3 border border-border rounded-xl font-semibold hover:bg-secondary/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft size={20} />
                        <span className="hidden sm:inline">Previous</span>
                    </button>

                    <div className="text-sm text-muted-foreground">
                        {answeredQuestions} / {totalQuestions} answered
                    </div>

                    <button
                        onClick={handleNext}
                        className="flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-xl font-semibold shadow-lg shadow-accent/20 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                    >
                        <span className="hidden sm:inline">
                            {isLastQuestion ? 'Review' : 'Next'}
                        </span>
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
