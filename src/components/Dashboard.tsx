import React from "react";
import { motion } from "motion/react";
import {
  Play,
  TrendingUp,
  Flame,
  Star,
  Clock,
  MoreHorizontal,
  Trophy,
} from "lucide-react";
import clsx from "clsx";

interface DashboardProps {
  userName: string;
}

export function Dashboard({ userName }: DashboardProps) {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {userName}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            You've learned for 42 minutes today. Keep it up!
          </p>
        </div>
        <div className="flex items-center gap-2 bg-card p-1 rounded-xl shadow-sm border border-border">
          <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium">
            Daily
          </button>
          <button className="px-4 py-2 hover:bg-secondary/50 text-muted-foreground rounded-lg text-sm font-medium transition-colors">
            Weekly
          </button>
          <button className="px-4 py-2 hover:bg-secondary/50 text-muted-foreground rounded-lg text-sm font-medium transition-colors">
            Monthly
          </button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Current Streak",
            value: "12 Days",
            icon: Flame,
            color: "text-orange-500",
            bg: "bg-orange-100",
          },
          {
            label: "Total XP",
            value: "12,450",
            icon: Star,
            color: "text-yellow-600",
            bg: "bg-yellow-100",
          },
          {
            label: "Hours Learned",
            value: "48.5h",
            icon: Clock,
            color: "text-blue-500",
            bg: "bg-blue-100",
          },
          {
            label: "Global Rank",
            value: "#402",
            icon: TrendingUp,
            color: "text-emerald-500",
            bg: "bg-emerald-100",
          },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-start justify-between"
          >
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </p>
              <h3 className="text-2xl font-bold mt-1 text-foreground">
                {stat.value}
              </h3>
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
            <h2 className="text-xl font-bold text-foreground">
              Active Learning Paths
            </h2>
            <button className="text-accent hover:text-accent/80 text-sm font-medium">
              View All
            </button>
          </div>

          <div className="space-y-4">
            {[
              {
                title: "Full Stack Web Development",
                progress: 65,
                next: "React Hooks Deep Dive",
                image:
                  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&h=300&fit=crop",
                category: "Development",
              },
              {
                title: "UX Design Principles",
                progress: 32,
                next: "Color Theory & Accessibility",
                image:
                  "https://images.unsplash.com/photo-1558655146-d09347e0b7a9?w=500&h=300&fit=crop",
                category: "Design",
              },
            ].map((path, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.01 }}
                className="group bg-card rounded-2xl border border-border p-4 shadow-sm flex flex-col sm:flex-row gap-6 cursor-pointer"
              >
                <div className="w-full sm:w-48 h-32 shrink-0 rounded-xl overflow-hidden relative">
                  <img
                    src={path.image}
                    alt={path.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-xs font-medium text-white">
                    {path.category}
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-center gap-3">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-foreground group-hover:text-accent transition-colors">
                      {path.title}
                    </h3>
                    <button className="text-muted-foreground hover:text-foreground">
                      <MoreHorizontal size={20} />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-bold text-foreground">
                        {path.progress}%
                      </span>
                    </div>
                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${path.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                      <Play size={10} fill="currentColor" />
                    </div>
                    <span className="text-sm text-foreground font-medium truncate">
                      Up Next: {path.next}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sidebar: Daily Challenge & Recommendations */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-foreground">Daily Challenge</h2>

          <div className="bg-gradient-to-br from-primary/20 to-accent/10 rounded-2xl border border-primary/20 p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Trophy size={120} />
            </div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/50 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-accent mb-4">
                <Flame size={12} fill="currentColor" />
                <span>Expires in 4h 20m</span>
              </div>

              <h3 className="text-xl font-bold text-foreground mb-2">
                CSS Grid Master
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Complete the layout challenge with perfect score to win a rare
                badge.
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold">
                    ✓
                  </div>
                  <span className="line-through text-muted-foreground">
                    Theory Check
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-5 h-5 rounded-full bg-card border-2 border-primary text-primary flex items-center justify-center text-xs font-bold">
                    2
                  </div>
                  <span className="font-medium">Practical Exercise</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-5 h-5 rounded-full bg-card border-2 border-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                    3
                  </div>
                  <span className="text-muted-foreground">Final Quiz</span>
                </div>
              </div>

              <button className="w-full py-3 bg-accent text-white rounded-xl font-bold shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/30 hover:-translate-y-0.5 transition-all">
                Continue Challenge
              </button>
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border p-6">
            <h3 className="font-bold text-foreground mb-4">
              Recommended for You
            </h3>
            <div className="space-y-4">
              {[
                {
                  title: "Advanced React Patterns",
                  rating: 4.9,
                  level: "Intermediate",
                  image:
                    "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=100&h=100&fit=crop",
                },
                {
                  title: "Machine Learning Fundamentals",
                  rating: 4.7,
                  level: "Beginner",
                  image:
                    "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=100&h=100&fit=crop",
                },
                {
                  title: "UI/UX Design Masterclass",
                  rating: 4.8,
                  level: "Advanced",
                  image:
                    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100&h=100&fit=crop",
                },
              ].map((course, i) => (
                <div
                  key={i}
                  className="flex gap-3 items-start group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-lg bg-secondary shrink-0 overflow-hidden">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground group-hover:text-accent transition-colors line-clamp-1">
                      {course.title}
                    </h4>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <Star
                        size={10}
                        className="text-yellow-500 fill-yellow-500"
                      />
                      <span>{course.rating}</span>
                      <span className="w-1 h-1 bg-muted-foreground rounded-full mx-1"></span>
                      <span>{course.level}</span>
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
