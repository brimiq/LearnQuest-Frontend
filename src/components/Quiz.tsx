import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, CheckCircle2, XCircle, Trophy, RotateCcw } from 'lucide-react';
import clsx from 'clsx';
import type { Quiz as QuizType, QuizResult } from '../types';
import { quizService } from '../services/quizService';

interface QuizProps {
  quizId: number;
  onComplete: (result: QuizResult) => void;
  onBack: () => void;
}

export function Quiz({ quizId, onComplete, onBack }: QuizProps) {
  const [quiz, setQuiz] = useState<QuizType | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<number, number>>(new Map());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [showReview, setShowReview] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const quizData = await quizService.getQuiz(quizId);
        setQuiz(quizData);
      } catch (error) {
        console.error('Failed to load quiz:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadQuiz();
  }, [quizId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!quiz || !quiz.questions?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-base-content/60">No quiz available</p>
        <button onClick={onBack} className="mt-4 text-accent hover:underline">Go back</button>
      </div>
    );
  }

  const questions = quiz.questions;
  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleAnswerSelect = (answerIndex: number) => {
    if (result) return;
    const newAnswers = new Map(answers);
    newAnswers.set(currentQuestion.id, answerIndex);
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const timeTaken = Math.floor((Date.now() - startTime) / 1000);
      const formattedAnswers = Array.from(answers.entries()).map(([questionId, answer]) => ({
        question_id: questionId,
        answer
      }));
      
      const quizResult = await quizService.submitQuiz(quizId, formattedAnswers, timeTaken);
      setResult(quizResult);
      onComplete(quizResult);
    } catch (error) {
      console.error('Failed to submit quiz:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    setAnswers(new Map());
    setCurrentIndex(0);
    setResult(null);
    setShowReview(false);
  };

  if (result && !showReview) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto bg-base-200 rounded-2xl border border-base-300 p-8 text-center"
      >
        <div className={clsx(
          "w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center",
          result.passed ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
        )}>
          {result.passed ? <Trophy size={48} /> : <XCircle size={48} />}
        </div>
        
        <h2 className="text-3xl font-bold mb-2">
          {result.passed ? 'Congratulations!' : 'Keep Learning!'}
        </h2>
        <p className="text-base-content/60 mb-6">
          {result.passed 
            ? 'You passed the quiz and earned XP!' 
            : 'You can try again to improve your score.'}
        </p>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-base-300/30 rounded-xl p-4">
            <div className="text-3xl font-bold text-base-content">{result.score}%</div>
            <div className="text-sm text-base-content/60">Score</div>
          </div>
          <div className="bg-base-300/30 rounded-xl p-4">
            <div className="text-3xl font-bold text-base-content">{result.correct_answers}/{result.total_questions}</div>
            <div className="text-sm text-base-content/60">Correct</div>
          </div>
          <div className="bg-base-300/30 rounded-xl p-4">
            <div className="text-3xl font-bold text-accent">+{result.xp_earned}</div>
            <div className="text-sm text-base-content/60">XP Earned</div>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => setShowReview(true)}
            className="px-6 py-3 border border-base-300 rounded-xl font-medium hover:bg-base-300 transition-colors"
          >
            Review Answers
          </button>
          {!result.passed && (
            <button
              onClick={handleRetry}
              className="px-6 py-3 bg-accent text-white rounded-xl font-bold flex items-center gap-2 hover:bg-accent/90 transition-colors"
            >
              <RotateCcw size={18} />
              Try Again
            </button>
          )}
          {result.passed && (
            <button
              onClick={onBack}
              className="px-6 py-3 bg-primary text-primary-content rounded-xl font-bold hover:bg-primary/90 transition-colors"
            >
              Continue
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  if (showReview && result) {
    return (
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => setShowReview(false)}
          className="flex items-center gap-2 text-base-content/60 hover:text-base-content mb-6"
        >
          <ChevronLeft size={20} />
          Back to Results
        </button>

        <h2 className="text-2xl font-bold mb-6">Answer Review</h2>

        <div className="space-y-4">
          {result.results.map((r, idx) => {
            const question = questions.find(q => q.id === r.question_id);
            if (!question) return null;

            return (
              <div
                key={r.question_id}
                className={clsx(
                  "bg-base-200 rounded-xl border p-6",
                  r.is_correct ? "border-green-200" : "border-red-200"
                )}
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className={clsx(
                    "w-6 h-6 rounded-full flex items-center justify-center shrink-0",
                    r.is_correct ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                  )}>
                    {r.is_correct ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                  </div>
                  <div>
                    <p className="font-medium text-base-content">
                      {idx + 1}. {question.question_text}
                    </p>
                  </div>
                </div>

                <div className="ml-9 space-y-2">
                  {question.options.map((option, optIdx) => (
                    <div
                      key={optIdx}
                      className={clsx(
                        "px-4 py-2 rounded-lg text-sm",
                        optIdx === r.correct_answer && "bg-green-100 text-green-800 font-medium",
                        optIdx === r.user_answer && optIdx !== r.correct_answer && "bg-red-100 text-red-800"
                      )}
                    >
                      {option}
                      {optIdx === r.correct_answer && " (Correct)"}
                      {optIdx === r.user_answer && optIdx !== r.correct_answer && " (Your answer)"}
                    </div>
                  ))}
                </div>

                {r.explanation && (
                  <div className="ml-9 mt-4 p-3 bg-base-300/30 rounded-lg text-sm text-base-content/60">
                    <strong>Explanation:</strong> {r.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={onBack}
            className="px-6 py-3 bg-primary text-primary-content rounded-xl font-bold"
          >
            Continue Learning
          </button>
        </div>
      </div>
    );
  }

  const allAnswered = questions.every(q => answers.has(q.id));

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-base-content/60 hover:text-base-content"
          >
            <ChevronLeft size={20} />
            Exit Quiz
          </button>
          <span className="text-sm font-medium text-base-content/60">
            Question {currentIndex + 1} of {questions.length}
          </span>
        </div>
        <div className="h-2 bg-base-300 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-accent"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <div className="bg-base-200 rounded-2xl border border-base-300 p-8">
        <h3 className="text-xl font-bold mb-2">{quiz.title}</h3>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-lg font-medium text-base-content mb-6">
              {currentQuestion.question_text}
            </p>

            <div className="space-y-3">
              {currentQuestion.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswerSelect(idx)}
                  className={clsx(
                    "w-full text-left p-4 rounded-xl border-2 transition-all",
                    answers.get(currentQuestion.id) === idx
                      ? "border-accent bg-accent/10"
                      : "border-base-300 hover:border-accent/50 hover:bg-base-300/30"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={clsx(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0",
                      answers.get(currentQuestion.id) === idx
                        ? "border-accent bg-accent text-white"
                        : "border-base-content/40"
                    )}>
                      {answers.get(currentQuestion.id) === idx && (
                        <CheckCircle2 size={14} />
                      )}
                    </div>
                    <span className="font-medium">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-base-300">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="flex items-center gap-2 px-4 py-2 text-base-content/60 hover:text-base-content disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={18} />
            Previous
          </button>

          <div className="flex gap-1">
            {questions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={clsx(
                  "w-3 h-3 rounded-full transition-colors",
                  currentIndex === idx
                    ? "bg-accent"
                    : answers.has(questions[idx].id)
                    ? "bg-green-500"
                    : "bg-secondary"
                )}
              />
            ))}
          </div>

          {currentIndex === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={!allAnswered || isSubmitting}
              className="flex items-center gap-2 px-6 py-2 bg-accent text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-4 py-2 text-accent font-medium hover:text-accent/80"
            >
              Next
              <ChevronRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
