import { motion } from 'motion/react';
import { ArrowLeft, BookOpen, Trophy, Users, Target, Zap, Globe } from 'lucide-react';

interface AboutPageProps {
  onBack: () => void;
}

export function AboutPage({ onBack }: AboutPageProps) {
  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      <nav className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2 cursor-pointer" onClick={onBack}>
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white font-bold text-xl">L</div>
          <span className="font-bold text-xl tracking-tight text-base-content">LearnQuest</span>
        </div>
        <button onClick={onBack} className="flex items-center gap-2 text-sm font-medium text-base-content/60 hover:text-base-content transition-colors">
          <ArrowLeft size={16} /> Back to Home
        </button>
      </nav>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-base-content mb-4">About LearnQuest</h1>
          <p className="text-lg text-base-content/60 mb-12 max-w-2xl">
            A crowdsourced learning platform with gamification, built to make education engaging and accessible.
          </p>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-base-content mb-4">Our Mission</h2>
            <p className="text-base-content/70 leading-relaxed mb-4">
              LearnQuest was built on a simple idea: learning should feel like an adventure, not a chore. 
              We combine community-driven content with gamification mechanics to keep learners motivated, 
              engaged, and progressing toward their goals.
            </p>
            <p className="text-base-content/70 leading-relaxed">
              Whether you're picking up your first programming language or deepening your expertise in data science, 
              LearnQuest provides structured learning paths, real-time feedback, and a supportive community to help you succeed.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-base-content mb-6">What Makes Us Different</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { icon: BookOpen, title: 'Curated Learning Paths', desc: 'Structured courses with modules, resources, and quizzes created by the community.', color: 'text-blue-500', bg: 'bg-blue-100' },
                { icon: Trophy, title: 'Gamified Progress', desc: 'Earn XP, unlock badges, and climb leaderboards as you complete lessons.', color: 'text-yellow-500', bg: 'bg-yellow-100' },
                { icon: Users, title: 'Community Driven', desc: 'Learn from peer-created content. Anyone can contribute and share knowledge.', color: 'text-green-500', bg: 'bg-green-100' },
                { icon: Target, title: 'Daily Challenges', desc: 'Stay motivated with daily, weekly, and monthly challenges with bonus rewards.', color: 'text-purple-500', bg: 'bg-purple-100' },
                { icon: Zap, title: 'Streak System', desc: 'Build consistency with learning streaks. The longer your streak, the more you earn.', color: 'text-orange-500', bg: 'bg-orange-100' },
                { icon: Globe, title: 'Open & Accessible', desc: 'Free to use, open to all skill levels, and accessible from any device.', color: 'text-cyan-500', bg: 'bg-cyan-100' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-5 bg-base-200 rounded-xl border border-base-300">
                  <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}>
                    <item.icon size={24} className={item.color} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base-content mb-1">{item.title}</h3>
                    <p className="text-sm text-base-content/60 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-base-content mb-4">The Team</h2>
            <p className="text-base-content/70 leading-relaxed">
              LearnQuest is a final-year university project developed by a passionate team of students who believe 
              in the power of technology to transform education. We designed and built this platform from the ground 
              up using React, Flask, PostgreSQL, and modern web technologies.
            </p>
          </section>
        </motion.div>
      </main>

      <footer className="py-8 text-center text-sm text-base-content/60 border-t border-base-300 mt-auto">
        &copy; {new Date().getFullYear()} LearnQuest. All rights reserved.
      </footer>
    </div>
  );
}
