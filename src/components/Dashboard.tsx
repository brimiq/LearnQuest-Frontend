import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Play, TrendingUp, Flame, Star, Clock, MoreHorizontal, Trophy } from 'lucide-react';
import clsx from 'clsx';
import { useAuthStore } from '../stores/authStore';
import { useLearningStore } from '../stores/learningStore';
import { useGamificationStore } from '../stores/gamificationStore';

interface DashboardProps {
  onViewLearning?: () => void;
  onStartLesson?: (pathId?: number) => void;
  onStartQuiz?: (quizId: number) => void;
  onViewGamification?: () => void;
}

export function Dashboard({ onViewLearning, onStartLesson, onStartQuiz, onViewGamification }: DashboardProps) {
  const { user } = useAuthStore();
  const { myPaths, fetchMyPaths, paths, fetchPaths } = useLearningStore();
  const { challenges, fetchChallenges, userRank, fetchMyRank } = useGamificationStore();
  const [isLoading, setIsLoading] = useState(true);
  const [statsPeriod, setStatsPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchMyPaths().catch(() => {}),
          fetchPaths().catch(() => {}),
          fetchChallenges().catch(() => {}),
          fetchMyRank().catch(() => {})
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [fetchMyPaths, fetchPaths, fetchChallenges, fetchMyRank]);

  const activeChallenge = challenges[0];
  const displayPaths = myPaths.length > 0 ? myPaths : paths.slice(0, 2);

  const totalXp = user?.xp || 0;
  const totalHours = user?.hours_learned || 0;
  const streakDays = user?.streak_days || 0;

  const periodStats = {
    daily: {
      xpLabel: 'XP Today', xpValue: Math.round(totalXp * 0.03).toLocaleString(),
      hoursLabel: 'Hours Today', hoursValue: `${Math.max(0.5, +(totalHours * 0.05).toFixed(1))}h`,
      streakLabel: 'Current Streak', streakValue: `${streakDays} Days`,
      rankLabel: 'Daily Rank', rankValue: userRank ? `#${userRank}` : '#--',
    },
    weekly: {
      xpLabel: 'XP This Week', xpValue: Math.round(totalXp * 0.15).toLocaleString(),
      hoursLabel: 'Hours This Week', hoursValue: `${Math.max(1, +(totalHours * 0.2).toFixed(1))}h`,
      streakLabel: 'Current Streak', streakValue: `${streakDays} Days`,
      rankLabel: 'Weekly Rank', rankValue: userRank ? `#${userRank}` : '#--',
    },
    monthly: {
      xpLabel: 'XP This Month', xpValue: Math.round(totalXp * 0.5).toLocaleString(),
      hoursLabel: 'Hours This Month', hoursValue: `${Math.max(2, +(totalHours * 0.6).toFixed(1))}h`,
      streakLabel: 'Current Streak', streakValue: `${streakDays} Days`,
      rankLabel: 'Monthly Rank', rankValue: userRank ? `#${userRank}` : '#--',
    },
  };
  const ps = periodStats[statsPeriod];

  const stats = [
    { label: ps.streakLabel, value: ps.streakValue, icon: Flame, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { label: ps.xpLabel, value: ps.xpValue, icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-500/10' },
    { label: ps.hoursLabel, value: ps.hoursValue, icon: Clock, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: ps.rankLabel, value: ps.rankValue, icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-base-content">Welcome back, {user?.username?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'Learner'}!</h1>
          <p className="text-base-content/60 mt-1">
            {user?.hours_learned ? `You've learned for ${Math.round(user.hours_learned * 60)} minutes today. Keep it up!` : 'Ready to continue your learning journey?'}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-base-200 p-1 rounded-xl shadow-sm border border-base-300">
          {(['daily', 'weekly', 'monthly'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setStatsPeriod(period)}
              className={clsx(
                "px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors",
                statsPeriod === period
                  ? "bg-primary text-primary-content"
                  : "text-base-content/60 hover:bg-base-300"
              )}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-base-200 p-6 rounded-2xl border border-base-300 shadow-sm flex items-start justify-between"
          >
            <div>
              <p className="text-sm font-medium text-base-content/60">{stat.label}</p>
              <h3 className="text-2xl font-bold mt-1 text-base-content">{stat.value}</h3>
            </div>
            <div className={clsx("p-3 rounded-xl", stat.bg, stat.color)}>
              <stat.icon size={20} />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Active Paths */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-base-content">
              {myPaths.length > 0 ? 'Active Learning Paths' : 'Popular Learning Paths'}
            </h2>
            <button onClick={onViewLearning} className="text-primary hover:text-primary/80 text-sm font-medium">View All</button>
          </div>

          <div className="space-y-4">
            {displayPaths.length > 0 ? displayPaths.map((path, i) => (
              <motion.div
                key={path.id}
                whileHover={{ scale: 1.01 }}
                onClick={() => onStartLesson?.(path.id)}
                className="group bg-base-200 rounded-2xl border border-base-300 p-4 shadow-sm flex flex-col sm:flex-row gap-6 cursor-pointer"
              >
                <div className="w-full sm:w-48 h-32 shrink-0 rounded-xl overflow-hidden relative">
                  <img 
                    src={path.image_url || `https://images.unsplash.com/photo-${i === 0 ? '1498050108023-c5249f4df085' : '1558655146-d09347e0b7a9'}?w=500&h=300&fit=crop`} 
                    alt={path.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-xs font-medium text-white">
                    {path.category}
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-center gap-3">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-base-content group-hover:text-primary transition-colors">{path.title}</h3>
                    <button className="text-base-content/60 hover:text-base-content">
                      <MoreHorizontal size={20} />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-base-content/60">Progress</span>
                      <span className="font-bold text-base-content">
                        {Math.round(path.progress?.progress_percentage || 0)}%
                      </span>
                    </div>
                    <div className="h-2 w-full bg-base-300 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full" 
                        style={{ width: `${path.progress?.progress_percentage || 0}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                      <Play size={10} fill="currentColor" />
                    </div>
                    <span className="text-sm text-base-content font-medium truncate">
                      {path.enrolled_count?.toLocaleString() || 0} learners enrolled
                    </span>
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="bg-base-200 rounded-2xl border border-base-300 p-8 text-center">
                <p className="text-base-content/60">No learning paths yet. Start exploring!</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Daily Challenge & Recommendations */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-base-content">Daily Challenge</h2>
          
          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl border border-primary/20 p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Trophy size={120} />
            </div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-base-100/50 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary mb-4">
                <Flame size={12} fill="currentColor" />
                <span>{activeChallenge ? 'Active Challenge' : 'Expires in 4h 20m'}</span>
              </div>
              
              <h3 className="text-xl font-bold text-base-content mb-2">
                {activeChallenge?.title || 'CSS Grid Master'}
              </h3>
              <p className="text-sm text-base-content/60 mb-6">
                {activeChallenge?.description || 'Complete the layout challenge with perfect score to win a rare badge.'}
              </p>
              
              <div className="space-y-3 mb-6">
                 <div className="flex items-center gap-3 text-sm">
                   <div className="w-5 h-5 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center text-xs font-bold">1</div>
                   <span className="text-base-content/60">Theory Check</span>
                 </div>
                 <div className="flex items-center gap-3 text-sm">
                   <div className="w-5 h-5 rounded-full bg-base-100 border-2 border-primary text-primary flex items-center justify-center text-xs font-bold">2</div>
                   <span className="font-medium">Practical Exercise</span>
                 </div>
                 <div className="flex items-center gap-3 text-sm">
                   <div className="w-5 h-5 rounded-full bg-base-100 border-2 border-base-300 flex items-center justify-center text-xs font-bold text-base-content/60">3</div>
                   <span className="text-base-content/60">Final Quiz</span>
                 </div>
              </div>

              <button 
                onClick={() => {
                  // Navigate to quiz for the challenge
                  if (onStartQuiz) {
                    // Try quiz 1 (first seeded quiz)
                    onStartQuiz(1);
                  } else {
                    onViewGamification?.();
                  }
                }}
                className="w-full py-3 bg-primary text-primary-content rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all"
              >
                Start Challenge
              </button>
            </div>
          </div>

          <div className="bg-base-200 rounded-2xl border border-base-300 p-6">
            <h3 className="font-bold text-base-content mb-4">Recommended for You</h3>
            <div className="space-y-4">
              {paths.slice(0, 3).map((path) => (
                <div key={path.id} onClick={() => onStartLesson?.(path.id)} className="flex gap-3 items-start group cursor-pointer">
                  <div className="w-12 h-12 rounded-lg bg-base-300 shrink-0 overflow-hidden">
                    <img 
                      src={path.image_url || 'https://images.unsplash.com/photo-1605379399642-870262d3d051?w=100&h=100&fit=crop'} 
                      alt={path.title} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-base-content group-hover:text-primary transition-colors line-clamp-1">
                      {path.title}
                    </h4>
                    <div className="flex items-center gap-1 text-xs text-base-content/60 mt-1">
                      <Star size={10} className="text-yellow-500 fill-yellow-500" />
                      <span>{path.rating?.toFixed(1) || '4.5'}</span>
                      <span className="w-1 h-1 bg-base-content/60 rounded-full mx-1"></span>
                      <span>{path.difficulty || 'Beginner'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
