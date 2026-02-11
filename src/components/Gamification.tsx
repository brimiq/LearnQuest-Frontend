import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, Medal, Crown, Lock, Flame, Target, Calendar, Zap, CheckCircle2, Sunrise, Sword, Brain, MessageCircle, Monitor, Heart, Rocket, Map, BarChart3, Award, type LucideIcon } from 'lucide-react';
import clsx from 'clsx';
import { useGamificationStore } from '../stores/gamificationStore';
import { useAuthStore } from '../stores/authStore';

export function Gamification() {
  const { user } = useAuthStore();
  const { 
    leaderboard, 
    badges,
    userBadges,
    userRank,
    challenges,
    achievementsProgress,
    fetchLeaderboard, 
    fetchBadges,
    fetchMyRank,
    fetchUserBadges,
    fetchChallenges,
    fetchAchievementsProgress,
    checkBadges
  } = useGamificationStore();
  
  const [isLoading, setIsLoading] = useState(true);
  const [activePeriod, setActivePeriod] = useState<'weekly' | 'all_time'>('weekly');

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchLeaderboard(activePeriod, 10),
          fetchBadges(),
          fetchMyRank(activePeriod),
          fetchChallenges(),
          fetchAchievementsProgress(),
          user?.id ? fetchUserBadges(user.id) : Promise.resolve()
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [activePeriod, fetchLeaderboard, fetchBadges, fetchMyRank, fetchChallenges, fetchAchievementsProgress, fetchUserBadges, user?.id]);

  // Check for new badges on mount
  useEffect(() => {
    checkBadges().then((newBadges) => {
      if (newBadges.length > 0 && user?.id) {
        fetchUserBadges(user.id);
      }
    });
  }, [checkBadges, fetchUserBadges, user?.id]);

  const handlePeriodChange = (period: 'weekly' | 'all_time') => {
    setActivePeriod(period);
  };

  const BADGE_ICONS: Record<string, LucideIcon> = {
    'Early Bird': Sunrise, 'Week Warrior': Sword, 'Quiz Master': Brain,
    'Social Butterfly': MessageCircle, 'Code Ninja': Monitor, 'Mentor': Heart,
    'First Steps': Rocket, 'Path Finder': Map, 'Data Science Month': BarChart3, 'Streak Legend': Flame,
  };
  const BADGE_COLORS: Record<string, { color: string; bg: string }> = {
    bronze: { color: 'text-yellow-600', bg: 'bg-yellow-100' },
    silver: { color: 'text-slate-500', bg: 'bg-slate-100' },
    gold: { color: 'text-yellow-500', bg: 'bg-yellow-100' },
    platinum: { color: 'text-purple-500', bg: 'bg-purple-100' },
    special: { color: 'text-orange-500', bg: 'bg-orange-100' },
  };
  const earnedBadgeIds = new Set(userBadges.map(ub => ub.badge?.id || ub.id));
  const badgesList = badges.map(b => ({
    id: b.id,
    name: b.name,
    description: b.description,
    IconComponent: BADGE_ICONS[b.name] || Award,
    unlocked: earnedBadgeIds.has(b.id),
    color: BADGE_COLORS[b.badge_type]?.color || 'text-gray-400',
    bg: BADGE_COLORS[b.badge_type]?.bg || 'bg-gray-100',
  }));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const totalBadgesUnlocked = badgesList.filter(b => b.unlocked).length;
  const userLevel = Math.floor((user?.xp || 0) / 1000) + 1;

  return (
    <div className="space-y-8">
      {/* Stats Header */}
      <div>
        <h1 className="text-3xl font-bold text-base-content mb-1">Achievements</h1>
        <p className="text-base-content/60">Track your progress, earn badges, and climb the leaderboard.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Level', value: userLevel, icon: Zap, color: 'text-purple-500', bg: 'bg-purple-500/10' },
          { label: 'Total XP', value: (user?.xp || 0).toLocaleString(), icon: Target, color: 'text-accent', bg: 'bg-accent/10' },
          { label: 'Badges Earned', value: `${totalBadgesUnlocked}/${badgesList.length}`, icon: Award, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
          { label: 'Global Rank', value: userRank ? `#${userRank}` : '--', icon: Crown, color: 'text-orange-500', bg: 'bg-orange-500/10' },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="bg-base-200 p-5 rounded-2xl border border-base-300 shadow-sm flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-base-content/60">{stat.label}</p>
              <h3 className="text-2xl font-bold mt-1 text-base-content">{stat.value}</h3>
            </div>
            <div className={clsx("p-3 rounded-xl", stat.bg, stat.color)}><stat.icon size={20} /></div>
          </motion.div>
        ))}
      </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Leaderboard Section */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-center justify-between">
           <h2 className="text-2xl font-bold text-base-content flex items-center gap-2">
             <Trophy className="text-yellow-500" />
             Global Leaderboard
           </h2>
           <div className="flex bg-base-300 p-1 rounded-lg">
             <button 
               onClick={() => handlePeriodChange('weekly')}
               className={clsx(
                 "px-4 py-1.5 rounded-md text-sm font-medium transition-colors",
                 activePeriod === 'weekly' ? "bg-base-200 text-base-content shadow-sm" : "text-base-content/60 hover:text-base-content"
               )}
             >
               Weekly
             </button>
             <button 
               onClick={() => handlePeriodChange('all_time')}
               className={clsx(
                 "px-4 py-1.5 rounded-md text-sm font-medium transition-colors",
                 activePeriod === 'all_time' ? "bg-base-200 text-base-content shadow-sm" : "text-base-content/60 hover:text-base-content"
               )}
             >
               All Time
             </button>
           </div>
        </div>

        <div className="bg-base-200 border border-base-300 rounded-2xl overflow-hidden shadow-sm">
          <div className="grid grid-cols-12 gap-4 p-4 bg-base-300/30 text-xs font-bold text-base-content/60 uppercase tracking-wider">
            <div className="col-span-2 text-center">Rank</div>
            <div className="col-span-6">User</div>
            <div className="col-span-4 text-right">XP Earned</div>
          </div>
          
          <div className="divide-y divide-base-300">
            {leaderboard.length > 0 ? leaderboard.map((entry, i) => (
              <motion.div 
                key={entry.user_id || i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={clsx(
                  "grid grid-cols-12 gap-4 p-4 items-center hover:bg-base-300/20 transition-colors",
                  i === 0 ? "bg-gradient-to-r from-yellow-50 to-transparent dark:from-yellow-900/10" : ""
                )}
              >
                <div className="col-span-2 flex justify-center">
                  {entry.rank <= 3 ? (
                    <div className={clsx(
                      "w-8 h-8 rounded-full flex items-center justify-center text-white font-bold shadow-sm",
                      entry.rank === 1 ? "bg-yellow-400" :
                      entry.rank === 2 ? "bg-slate-400" :
                      "bg-orange-400"
                    )}>
                      {entry.rank}
                    </div>
                  ) : (
                    <span className="font-bold text-base-content/60">#{entry.rank}</span>
                  )}
                </div>
                
                <div className="col-span-6 flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-base-300 overflow-hidden border-2 border-base-200">
                      {entry.avatar_url ? (
                        <img src={entry.avatar_url} alt={entry.username} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-primary font-bold">
                          {entry.username?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    {entry.rank === 1 && (
                      <div className="absolute -top-2 -right-1 text-yellow-500 bg-base-200 rounded-full p-0.5 shadow-sm">
                        <Crown size={12} fill="currentColor" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-base-content">{entry.username?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</h4>
                    <p className="text-xs text-base-content/60">Level {Math.floor((entry.xp || 0) / 1000) + 1}</p>
                  </div>
                </div>
                
                <div className="col-span-4 text-right font-mono font-bold text-accent">
                  {(entry.xp || 0).toLocaleString()}
                </div>
              </motion.div>
            )) : (
              <div className="p-8 text-center text-base-content/60">
                No leaderboard data available
              </div>
            )}
            
            {/* User's Rank Row */}
            {user && (
              <div className="grid grid-cols-12 gap-4 p-4 items-center bg-primary/10 border-t-2 border-primary/20">
                <div className="col-span-2 text-center font-bold text-primary">
                  {userRank ? `#${userRank}` : '#--'}
                </div>
                <div className="col-span-6 flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                      {user.avatar_url ? (
                        <img src={user.avatar_url} alt={user.username} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-primary font-bold">{user.username?.charAt(0).toUpperCase()}</span>
                      )}
                   </div>
                   <h4 className="font-bold text-base-content">You</h4>
                </div>
                <div className="col-span-4 text-right font-mono font-bold text-base-content">
                  {(user.xp || 0).toLocaleString()}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-base-content">Your Achievements</h2>
        
        <div className="grid grid-cols-2 gap-4">
          {badgesList.map((badge) => (
             <motion.div
               key={badge.id}
               whileHover={{ scale: 1.05 }}
               className={clsx(
                 "bg-base-200 p-4 rounded-xl border flex flex-col items-center text-center gap-3 relative overflow-hidden",
                 badge.unlocked ? "border-base-300 shadow-sm" : "border-dashed border-base-300 opacity-70 bg-base-300/20"
               )}
             >
               <div className={clsx(
                 "w-16 h-16 rounded-full flex items-center justify-center mb-1",
                 badge.unlocked ? badge.bg : "bg-gray-100"
               )}>
                 <badge.IconComponent size={28} className={badge.unlocked ? badge.color : "text-gray-400"} />
               </div>
               
               <div>
                 <h4 className="font-bold text-sm text-base-content">{badge.name}</h4>
                 <p className="text-xs text-base-content/60 mt-1 line-clamp-2">{badge.description}</p>
               </div>

               {!badge.unlocked && (
                 <div className="absolute inset-0 bg-base-100/40 backdrop-blur-[1px] flex items-center justify-center">
                   <div className="bg-base-200/90 p-2 rounded-full shadow-sm">
                     <Lock size={16} className="text-base-content/60" />
                   </div>
                 </div>
               )}
             </motion.div>
          ))}
        </div>
        
        <div className="bg-gradient-to-br from-accent to-primary p-6 rounded-2xl text-white shadow-lg shadow-accent/20 relative overflow-hidden">
           <div className="relative z-10">
             <h3 className="font-bold text-lg mb-1">
               Level {Math.floor((user?.xp || 0) / 1000) + 1} Scholar
             </h3>
             <p className="text-white/80 text-sm mb-4">
               {1000 - ((user?.xp || 0) % 1000)} XP to Level {Math.floor((user?.xp || 0) / 1000) + 2}
             </p>
             
             <div className="h-3 bg-black/20 rounded-full overflow-hidden mb-2">
               <div 
                 className="h-full bg-white rounded-full" 
                 style={{ width: `${((user?.xp || 0) % 1000) / 10}%` }}
               ></div>
             </div>
             <p className="text-xs text-white/70 text-right">
               {Math.round(((user?.xp || 0) % 1000) / 10)}% Complete
             </p>
           </div>
           
           <Medal className="absolute -bottom-4 -right-4 text-white/20 w-32 h-32 rotate-12" />
        </div>

        {/* Achievements Progress */}
        {achievementsProgress.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-base-content flex items-center gap-2"><CheckCircle2 size={20} className="text-green-500" />Milestones</h2>
            {achievementsProgress.map((a) => {
              const pct = a.target > 0 ? Math.min(100, Math.round((a.current / a.target) * 100)) : 0;
              return (
                <div key={a.id} className={clsx("bg-base-200 rounded-xl border p-4", a.unlocked ? "border-green-500/30" : "border-base-300")}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-sm text-base-content">{a.name}</h4>
                    {a.unlocked ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700 uppercase">Unlocked</span>
                    ) : (
                      <span className="text-xs text-base-content/60">{a.current}/{a.target}</span>
                    )}
                  </div>
                  <p className="text-xs text-base-content/60 mb-2">{a.description}</p>
                  <div className="h-2 bg-base-300 rounded-full overflow-hidden">
                    <div className={clsx("h-full rounded-full transition-all", a.unlocked ? "bg-green-500" : "bg-primary")} style={{ width: `${pct}%` }}></div>
                  </div>
                  <div className="flex items-center justify-between mt-1 text-[10px] text-base-content/40">
                    <span>{pct}%</span>
                    <span>+{a.xp_reward} XP</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Challenges Section */}
        {challenges.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-base-content flex items-center gap-2"><Target size={20} className="text-accent" />Active Challenges</h2>
            {challenges.map((challenge, i) => {
              const typeIcon = challenge.challenge_type === 'weekly' ? <Flame size={16} /> : challenge.challenge_type === 'monthly' ? <Calendar size={16} /> : <Zap size={16} />;
              const typeColor = challenge.challenge_type === 'weekly' ? 'bg-orange-100 text-orange-600' : challenge.challenge_type === 'monthly' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600';
              const daysLeft = challenge.end_date ? Math.max(0, Math.ceil((new Date(challenge.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : 0;
              return (
                <motion.div key={challenge.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-base-200 rounded-xl border border-base-300 p-4">
                  <div className="flex items-start gap-3">
                    <div className={clsx("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", typeColor)}>{typeIcon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-sm text-base-content truncate">{challenge.title}</h4>
                        <span className={clsx("text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase", typeColor)}>{challenge.challenge_type}</span>
                      </div>
                      <p className="text-xs text-base-content/60 line-clamp-2 mb-2">{challenge.description}</p>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="font-bold text-accent">+{challenge.xp_reward} XP</span>
                        <span className="text-base-content/40">|</span>
                        <span className="text-base-content/60">{daysLeft} days left</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
