import { motion } from 'motion/react';
import { ArrowLeft, Shield, Eye, Lock, Server, UserCheck, Trash2 } from 'lucide-react';

interface PrivacyPageProps {
  onBack: () => void;
}

export function PrivacyPage({ onBack }: PrivacyPageProps) {
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
          <h1 className="text-4xl font-bold text-base-content mb-2">Privacy Policy</h1>
          <p className="text-sm text-base-content/60 mb-10">Last updated: February 2026</p>

          <div className="space-y-10 text-base-content/70 leading-relaxed">
            <section>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center"><Eye size={20} className="text-blue-500" /></div>
                <h2 className="text-xl font-bold text-base-content">Information We Collect</h2>
              </div>
              <p className="mb-3">When you create an account on LearnQuest, we collect:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Your username and email address</li>
                <li>Learning progress, quiz scores, and XP data</li>
                <li>Comments and discussions you post on the platform</li>
                <li>Usage data such as pages visited and time spent learning</li>
              </ul>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center"><Shield size={20} className="text-green-500" /></div>
                <h2 className="text-xl font-bold text-base-content">How We Use Your Data</h2>
              </div>
              <ul className="list-disc pl-6 space-y-1">
                <li>To provide and personalize your learning experience</li>
                <li>To track your progress, streaks, and achievements</li>
                <li>To display leaderboards and community features</li>
                <li>To improve the platform based on usage patterns</li>
                <li>To send important account-related notifications</li>
              </ul>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center"><Lock size={20} className="text-purple-500" /></div>
                <h2 className="text-xl font-bold text-base-content">Data Security</h2>
              </div>
              <p>
                We take reasonable measures to protect your personal information. Passwords are hashed using industry-standard algorithms. 
                All data is transmitted over HTTPS with TLS encryption. Access to production databases is restricted to authorized personnel only.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center"><Server size={20} className="text-orange-500" /></div>
                <h2 className="text-xl font-bold text-base-content">Data Storage</h2>
              </div>
              <p>
                Your data is stored on secure servers. We do not sell, rent, or share your personal information with third parties 
                for marketing purposes. Data may be shared with service providers who assist in operating the platform, subject to 
                confidentiality agreements.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center"><UserCheck size={20} className="text-cyan-500" /></div>
                <h2 className="text-xl font-bold text-base-content">Your Rights</h2>
              </div>
              <ul className="list-disc pl-6 space-y-1">
                <li>Access and review your personal data at any time via your profile</li>
                <li>Update or correct your account information</li>
                <li>Request deletion of your account and associated data</li>
                <li>Opt out of non-essential communications</li>
              </ul>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center"><Trash2 size={20} className="text-red-500" /></div>
                <h2 className="text-xl font-bold text-base-content">Account Deletion</h2>
              </div>
              <p>
                You may request account deletion by contacting us at contact@learnquest.com. Upon deletion, your personal data 
                will be permanently removed from our systems within 30 days. Anonymized data may be retained for analytics purposes.
              </p>
            </section>

            <section className="bg-base-200 p-6 rounded-xl border border-base-300">
              <p className="text-sm">
                If you have any questions about this privacy policy, please contact us at{' '}
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
