import { motion } from 'motion/react';
import { ArrowLeft, FileText, AlertTriangle, Scale, BookOpen, Shield, Ban } from 'lucide-react';

interface TermsPageProps {
  onBack: () => void;
}

export function TermsPage({ onBack }: TermsPageProps) {
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
          <h1 className="text-4xl font-bold text-base-content mb-2">Terms of Service</h1>
          <p className="text-sm text-base-content/60 mb-10">Last updated: February 2026</p>

          <div className="space-y-10 text-base-content/70 leading-relaxed">
            <section>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center"><FileText size={20} className="text-blue-500" /></div>
                <h2 className="text-xl font-bold text-base-content">1. Acceptance of Terms</h2>
              </div>
              <p>
                By accessing or using LearnQuest, you agree to be bound by these Terms of Service. If you do not agree 
                to these terms, please do not use the platform. We reserve the right to modify these terms at any time, 
                and continued use constitutes acceptance of any changes.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center"><BookOpen size={20} className="text-green-500" /></div>
                <h2 className="text-xl font-bold text-base-content">2. Use of the Platform</h2>
              </div>
              <p className="mb-3">You agree to use LearnQuest for lawful educational purposes only. You may:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Create an account with accurate information</li>
                <li>Access and complete learning paths, quizzes, and challenges</li>
                <li>Contribute learning content as a registered contributor</li>
                <li>Participate in discussions and community features</li>
              </ul>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center"><Scale size={20} className="text-purple-500" /></div>
                <h2 className="text-xl font-bold text-base-content">3. User-Generated Content</h2>
              </div>
              <p>
                Users who create learning paths, modules, or resources retain ownership of their original content. 
                By publishing content on LearnQuest, you grant us a non-exclusive, royalty-free license to display 
                and distribute the content within the platform. All content must be original or properly attributed.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center"><Ban size={20} className="text-red-500" /></div>
                <h2 className="text-xl font-bold text-base-content">4. Prohibited Conduct</h2>
              </div>
              <ul className="list-disc pl-6 space-y-1">
                <li>Posting offensive, harmful, or misleading content</li>
                <li>Attempting to access other users' accounts or data</li>
                <li>Manipulating gamification features (XP, badges, leaderboards)</li>
                <li>Using bots, scrapers, or automated tools against the platform</li>
                <li>Violating intellectual property rights of others</li>
              </ul>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center"><Shield size={20} className="text-orange-500" /></div>
                <h2 className="text-xl font-bold text-base-content">5. Account Suspension</h2>
              </div>
              <p>
                We reserve the right to suspend or terminate accounts that violate these terms. Administrators may 
                remove content, issue warnings, or permanently ban users who engage in prohibited conduct. Appeals 
                may be submitted via the contact page.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center"><AlertTriangle size={20} className="text-yellow-500" /></div>
                <h2 className="text-xl font-bold text-base-content">6. Disclaimer</h2>
              </div>
              <p>
                LearnQuest is provided "as is" without warranties of any kind. While we strive to ensure content 
                quality through community moderation and admin review, we do not guarantee the accuracy or completeness 
                of any user-generated learning materials. LearnQuest certificates are not accredited academic credentials.
              </p>
            </section>

            <section className="bg-base-200 p-6 rounded-xl border border-base-300">
              <p className="text-sm">
                For questions about these terms, contact us at{' '}
                <a href="mailto:contact@learnquest.com" className="text-primary font-bold hover:underline">contact@learnquest.com</a>.
              </p>
            </section>
          </div>
        </motion.div>
      </main>

      <footer className="py-8 text-center text-sm text-base-content/60 border-t border-base-300 mt-auto">
        &copy; {new Date().getFullYear()} LearnQuest. All rights reserved.
      </footer>
    </div>
  );
}
