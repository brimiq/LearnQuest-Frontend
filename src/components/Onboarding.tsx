import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Trophy, Users, ArrowRight, GraduationCap, Target, Flame, Sparkles } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
  onOpenAuth?: () => void;
  userName?: string;
}

const STEPS = [
  {
    bg: 'bg-primary/10',
    title: 'Welcome to LearnQuest!',
    description: 'Your personalized crowdsourced learning platform. Learn, grow, and earn rewards on your journey.',
    stepIcon: GraduationCap,
    stepIconColor: 'text-primary',
  },
  {
    bg: 'bg-blue-500/10',
    title: 'Explore Learning Paths',
    description: 'Browse curated learning paths created by the community. Each path has modules, resources, and quizzes to guide your learning.',
    stepIcon: BookOpen,
    stepIconColor: 'text-blue-500',
  },
  {
    bg: 'bg-yellow-500/10',
    title: 'Earn Badges & XP',
    description: 'Complete lessons, pass quizzes, and maintain streaks to earn XP, unlock badges, and climb the leaderboard.',
    stepIcon: Trophy,
    stepIconColor: 'text-yellow-500',
  },
  {
    bg: 'bg-green-500/10',
    title: 'Join the Community',
    description: 'Comment on resources, rate learning paths, and participate in challenges with fellow learners.',
    stepIcon: Users,
    stepIconColor: 'text-green-500',
  },
  {
    bg: 'bg-purple-500/10',
    title: 'Daily Challenges',
    description: 'Take on daily and weekly challenges to earn bonus XP and exclusive rewards. Stay consistent to build your streak!',
    stepIcon: Target,
    stepIconColor: 'text-purple-500',
  },
];

export function Onboarding({ onComplete, onOpenAuth, userName }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const step = STEPS[currentStep];
  const isLast = currentStep === STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      localStorage.setItem('learnquest_onboarded', 'true');
      onComplete();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('learnquest_onboarded', 'true');
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-base-100 flex items-center justify-center">
      <div className="max-w-lg w-full px-6">
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentStep ? 'w-8 bg-primary' : i < currentStep ? 'w-2 bg-primary/50' : 'w-2 bg-base-300'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
              className="mb-6"
            >
              <div className={`w-24 h-24 rounded-3xl ${step.bg} flex items-center justify-center mx-auto`}>
                <step.stepIcon size={48} className={step.stepIconColor} />
              </div>
            </motion.div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-base-content mb-3">
              {currentStep === 0 && userName ? `Welcome, ${userName}!` : step.title}
            </h1>

            {/* Description */}
            <p className="text-base-content/60 text-lg leading-relaxed mb-8 max-w-md mx-auto">
              {step.description}
            </p>

            {/* Feature highlights for first step */}
            {currentStep === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-3 gap-4 mb-8"
              >
                {[
                  { icon: BookOpen, label: 'Learn', color: 'text-blue-500' },
                  { icon: Trophy, label: 'Achieve', color: 'text-yellow-500' },
                  { icon: Flame, label: 'Streak', color: 'text-orange-500' },
                ].map((item, i) => (
                  <div key={i} className="bg-base-200 rounded-xl p-4 border border-base-300">
                    <item.icon size={24} className={`${item.color} mx-auto mb-2`} />
                    <span className="text-sm font-medium text-base-content">{item.label}</span>
                  </div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Buttons */}
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={handleSkip}
            className="text-sm text-base-content/40 hover:text-base-content/60 transition-colors"
          >
            Skip tour
          </button>

          <button
            onClick={handleNext}
            className="px-8 py-3 bg-primary text-primary-content rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all flex items-center gap-2"
          >
            {isLast ? (
              <>
                Get Started <Sparkles size={16} />
              </>
            ) : (
              <>
                Next <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
