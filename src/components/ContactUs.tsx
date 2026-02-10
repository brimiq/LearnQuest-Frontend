import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Mail, 
  MapPin, 
  Send, 
  ArrowLeft,
  MessageCircle
} from 'lucide-react';

interface ContactUsProps {
  onBack: () => void;
}

export function ContactUs({ onBack }: ContactUsProps) {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      {/* Header */}
      <nav className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2 cursor-pointer" onClick={onBack}>
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white font-bold text-xl">
            L
          </div>
          <span className="font-bold text-xl tracking-tight text-base-content">LearnQuest</span>
        </div>
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium text-base-content/60 hover:text-base-content transition-colors"
        >
          <ArrowLeft size={16} /> Back to Home
        </button>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 lg:py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-base-content mb-4">Get in Touch</h1>
          <p className="text-lg text-base-content/60 max-w-2xl mx-auto">
            Have questions about our courses or need help with your account? We're here to help!
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">
          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-10"
          >
            <div>
              <h3 className="text-2xl font-bold text-base-content mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-base-content">Email Us</h4>
                    <p className="text-base-content/60 text-sm mb-1">Our friendly team is here to help.</p>
                    <a href="mailto:contact@learnquest.com" className="text-primary font-bold hover:underline">contact@learnquest.com</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                    <MessageCircle size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-base-content">WhatsApp / Call</h4>
                    <p className="text-base-content/60 text-sm mb-1">Mon-Fri from 8am to 5pm.</p>
                    <a href="https://wa.me/254712345678" className="text-primary font-bold hover:underline">+254 712 345 678</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-base-content">Office</h4>
                    <p className="text-base-content/60 text-sm mb-1">Come say hello at our office HQ.</p>
                    <p className="text-base-content font-medium">123 Innovation Drive, Nairobi, Kenya</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-base-200 rounded-3xl border border-base-300 shadow-sm">
              <h3 className="font-bold text-base-content mb-4">Frequently Asked Questions</h3>
              <div className="space-y-4">
                <details className="group">
                  <summary className="flex items-center justify-between font-medium cursor-pointer list-none text-base-content hover:text-primary transition-colors">
                    <span>How do I reset my password?</span>
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                    </span>
                  </summary>
                  <p className="text-base-content/60 text-sm mt-3 leading-relaxed">
                    You can reset your password by clicking "Forgot Password" on the login screen. We'll send you a link to reset it.
                  </p>
                </details>
                <div className="h-px bg-base-300"></div>
                <details className="group">
                  <summary className="flex items-center justify-between font-medium cursor-pointer list-none text-base-content hover:text-primary transition-colors">
                    <span>Are the certificates accredited?</span>
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                    </span>
                  </summary>
                  <p className="text-base-content/60 text-sm mt-3 leading-relaxed">
                    Our certificates are industry-recognized and can be added to your LinkedIn profile, but they are not university accredited degrees.
                  </p>
                </details>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-base-200 p-8 md:p-10 rounded-3xl border border-base-300 shadow-lg"
          >
            {isSent ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
                  <Send size={32} />
                </div>
                <h3 className="text-2xl font-bold text-base-content mb-2">Message Sent!</h3>
                <p className="text-base-content/60 max-w-xs mx-auto mb-8">
                  Thank you for reaching out. We'll get back to you at {formState.email} within 24 hours.
                </p>
                <button 
                  onClick={() => { setIsSent(false); setFormState({ name: '', email: '', subject: '', message: '' }); }}
                  className="px-6 py-2 bg-base-300 text-base-content rounded-xl font-bold hover:bg-base-300/80 transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-bold text-base-content ml-1">Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      required
                      value={formState.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 bg-base-300/20 border border-base-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-bold text-base-content ml-1">Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      required
                      value={formState.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 bg-base-300/20 border border-base-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-bold text-base-content ml-1">Subject</label>
                  <select 
                    id="subject" 
                    name="subject" 
                    value={formState.subject}
                    onChange={(e: any) => handleChange(e)}
                    className="w-full px-4 py-3 bg-base-300/20 border border-base-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  >
                    <option value="">Select a topic...</option>
                    <option value="support">Technical Support</option>
                    <option value="billing">Billing & Subscription</option>
                    <option value="partnership">Partnership Inquiry</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-bold text-base-content ml-1">Message</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    required
                    rows={5}
                    value={formState.message}
                    onChange={handleChange}
                    placeholder="How can we help you?"
                    className="w-full px-4 py-3 bg-base-300/20 border border-base-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-4 bg-primary text-primary-content rounded-xl font-bold text-lg shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-1 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>Sending...</>
                  ) : (
                    <>Send Message <Send size={20} /></>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </main>

      {/* Footer Simple */}
      <footer className="py-8 text-center text-sm text-base-content/60 border-t border-base-300 mt-auto">
        &copy; {new Date().getFullYear()} LearnQuest. All rights reserved.
      </footer>
    </div>
  );
}
