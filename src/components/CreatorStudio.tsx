import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Save, ArrowRight, ArrowLeft, Upload, Plus, Trash2, FileText, Video, CheckCircle2, Link, BarChart3, BookOpen, Users, Eye, Star, Clock, PenTool } from 'lucide-react';
import clsx from 'clsx';
import { toast } from 'sonner';
import api from '../services/api';
import { useAuthStore } from '../stores/authStore';

interface ModuleForm {
  title: string;
  description: string;
  resources: { title: string; type: 'video' | 'article'; url: string }[];
}

interface MyPath {
  id: number;
  title: string;
  category: string;
  difficulty: string;
  is_published: boolean;
  is_approved: boolean;
  enrolled_count: number;
  rating: number;
  total_ratings: number;
  created_at: string;
  modules?: { id: number; title: string; resources?: any[] }[];
}

export function CreatorStudio() {
  const { user } = useAuthStore();
  const [activeView, setActiveView] = useState<'dashboard' | 'create'>('dashboard');
  const [myPaths, setMyPaths] = useState<MyPath[]>([]);
  const [loadingPaths, setLoadingPaths] = useState(true);

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Development');
  const [difficulty, setDifficulty] = useState('beginner');
  const [imageUrl, setImageUrl] = useState('');
  const [modules, setModules] = useState<ModuleForm[]>([
    { title: 'Module 1', description: '', resources: [{ title: '', type: 'video', url: '' }] }
  ]);

  useEffect(() => {
    loadMyPaths();
  }, []);

  const loadMyPaths = async () => {
    setLoadingPaths(true);
    try {
      const res = await api.get('/learning-paths/');
      const allPaths = res.data.learning_paths || [];
      // Filter paths created by the current user
      const mine = allPaths.filter((p: any) => p.creator_id === user?.id);
      setMyPaths(mine);
    } catch {
      // fallback - show all paths for admin
      setMyPaths([]);
    } finally {
      setLoadingPaths(false);
    }
  };

  const steps = [
    { num: 1, label: "Basic Info" },
    { num: 2, label: "Content" },
    { num: 3, label: "Preview" }
  ];

  const addModule = () => {
    setModules([...modules, { title: `Module ${modules.length + 1}`, description: '', resources: [{ title: '', type: 'video', url: '' }] }]);
  };

  const removeModule = (idx: number) => {
    if (modules.length <= 1) return;
    setModules(modules.filter((_, i) => i !== idx));
  };

  const updateModule = (idx: number, field: keyof ModuleForm, value: string) => {
    const updated = [...modules];
    (updated[idx] as any)[field] = value;
    setModules(updated);
  };

  const addResource = (modIdx: number) => {
    const updated = [...modules];
    updated[modIdx].resources.push({ title: '', type: 'article', url: '' });
    setModules(updated);
  };

  const removeResource = (modIdx: number, resIdx: number) => {
    const updated = [...modules];
    if (updated[modIdx].resources.length <= 1) return;
    updated[modIdx].resources = updated[modIdx].resources.filter((_, i) => i !== resIdx);
    setModules(updated);
  };

  const updateResource = (modIdx: number, resIdx: number, field: string, value: string) => {
    const updated = [...modules];
    (updated[modIdx].resources[resIdx] as any)[field] = value;
    setModules(updated);
  };

  const formTotalResources = modules.reduce((sum, m) => sum + m.resources.filter(r => r.title).length, 0);

  const handlePublish = async () => {
    setIsSubmitting(true);
    setError('');
    try {
      // 1. Create the learning path
      const pathRes = await api.post('/learning-paths/', {
        title, description, category, difficulty,
        image_url: imageUrl || `https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop`,
        xp_reward: modules.length * 100
      });
      const pathId = pathRes.data.learning_path.id;

      // 2. Create modules and resources
      for (let i = 0; i < modules.length; i++) {
        const mod = modules[i];
        if (!mod.title) continue;
        const modRes = await api.post(`/learning-paths/${pathId}/modules`, {
          title: mod.title,
          description: mod.description || `Learn about ${mod.title}`,
          order: i,
          xp_reward: 50
        });
        const moduleId = modRes.data.module.id;

        for (let j = 0; j < mod.resources.length; j++) {
          const res = mod.resources[j];
          if (!res.title) continue;
          await api.post(`/learning-paths/modules/${moduleId}/resources`, {
            title: res.title,
            resource_type: res.type,
            url: res.url || '#',
            order: j
          });
        }
      }

      setIsPublished(true);
      toast.success('Learning path published successfully!');
    } catch (e: any) {
      const msg = e.response?.data?.error || 'Failed to publish. Make sure you are logged in as a Contributor or Admin.';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isPublished) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-3xl font-bold text-base-content mb-3">Learning Path Published!</h2>
          <p className="text-base-content/60 mb-8">Your learning path "{title}" has been submitted and is pending admin approval.</p>
          <div className="flex gap-4 justify-center">
            <button onClick={() => { setIsPublished(false); setStep(1); setTitle(''); setDescription(''); setModules([{ title: 'Module 1', description: '', resources: [{ title: '', type: 'video', url: '' }] }]); }}
              className="px-8 py-3 bg-primary text-primary-content rounded-xl font-bold hover:bg-primary/90 transition-colors">
              Create Another
            </button>
            <button onClick={() => { setIsPublished(false); setActiveView('dashboard'); loadMyPaths(); }}
              className="px-8 py-3 border border-base-300 text-base-content rounded-xl font-bold hover:bg-base-300/30 transition-colors">
              View My Content
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const inputClass = "w-full px-4 py-3 bg-base-300/20 border border-base-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all";

  const totalModules = myPaths.reduce((sum, p) => sum + (p.modules?.length || 0), 0);
  const totalResources = myPaths.reduce((sum, p) => sum + (p.modules?.reduce((s, m) => s + (m.resources?.length || 0), 0) || 0), 0);
  const totalEnrolled = myPaths.reduce((sum, p) => sum + (p.enrolled_count || 0), 0);

  // Creator Dashboard view
  if (activeView === 'dashboard') {
    return (
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-base-content flex items-center gap-3">
              <PenTool className="text-primary" /> Creator Studio
            </h1>
            <p className="text-base-content/60 mt-1">Manage your learning paths and track their performance.</p>
          </div>
          <button
            onClick={() => setActiveView('create')}
            className="px-6 py-3 bg-primary text-primary-content rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2"
          >
            <Plus size={18} /> Create New Path
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'My Paths', value: myPaths.length, icon: BookOpen, color: 'text-purple-500', bg: 'bg-purple-500/10' },
            { label: 'Total Modules', value: totalModules, icon: FileText, color: 'text-blue-500', bg: 'bg-blue-500/10' },
            { label: 'Total Learners', value: totalEnrolled, icon: Users, color: 'text-green-500', bg: 'bg-green-500/10' },
            { label: 'Avg Rating', value: myPaths.length > 0 ? (myPaths.reduce((s, p) => s + (p.rating || 0), 0) / myPaths.length).toFixed(1) : '—', icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-base-200 p-6 rounded-2xl border border-base-300 shadow-sm flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-base-content/60">{stat.label}</p>
                <h3 className="text-2xl font-bold mt-1 text-base-content">{stat.value}</h3>
              </div>
              <div className={clsx("p-3 rounded-xl", stat.bg, stat.color)}><stat.icon size={20} /></div>
            </motion.div>
          ))}
        </div>

        {/* My Content */}
        <div className="bg-base-200 rounded-2xl border border-base-300 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-base-300 flex items-center justify-between">
            <h2 className="text-lg font-bold text-base-content flex items-center gap-2">
              <BarChart3 size={20} className="text-primary" /> My Learning Paths
            </h2>
          </div>

          {loadingPaths ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto"></div>
            </div>
          ) : myPaths.length === 0 ? (
            <div className="p-12 text-center">
              <BookOpen size={48} className="mx-auto text-base-content/20 mb-4" />
              <h3 className="font-bold text-base-content mb-2">No learning paths yet</h3>
              <p className="text-base-content/60 mb-6 max-w-sm mx-auto">Share your expertise with the community by creating your first learning path.</p>
              <button onClick={() => setActiveView('create')} className="px-6 py-3 bg-primary text-primary-content rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                Create Your First Path
              </button>
            </div>
          ) : (
            <div className="divide-y divide-base-300">
              {myPaths.map((path) => (
                <div key={path.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:bg-base-300/20 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-base-content truncate">{path.title}</h3>
                      <span className={clsx(
                        "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                        path.is_approved ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                      )}>
                        {path.is_approved ? 'Approved' : 'Pending'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-base-content/60 flex-wrap">
                      <span className="flex items-center gap-1"><BookOpen size={12} /> {path.modules?.length || 0} modules</span>
                      <span className="flex items-center gap-1"><Users size={12} /> {path.enrolled_count} enrolled</span>
                      <span className="flex items-center gap-1"><Star size={12} className="text-yellow-500" /> {path.rating?.toFixed(1) || '—'}</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {new Date(path.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-3 py-1 bg-base-300/50 rounded-full text-xs font-medium text-base-content/60 capitalize">{path.difficulty}</span>
                    <span className="px-3 py-1 bg-base-300/50 rounded-full text-xs font-medium text-base-content/60">{path.category}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Creator Tips */}
        <div className="bg-base-200 rounded-2xl border border-base-300 p-6 shadow-sm">
          <h3 className="font-bold text-base-content mb-4 flex items-center gap-2"><Eye size={18} className="text-primary" /> Tips for Great Content</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: 'Structure clearly', desc: 'Break content into focused modules with 3-5 resources each.' },
              { title: 'Mix resource types', desc: 'Combine videos, articles, and exercises for varied learning.' },
              { title: 'Add real-world examples', desc: 'Include practical projects and hands-on exercises.' },
            ].map((tip, i) => (
              <div key={i} className="p-4 bg-base-300/20 rounded-xl border border-base-300">
                <h4 className="font-bold text-sm text-base-content mb-1">{tip.title}</h4>
                <p className="text-xs text-base-content/60 leading-relaxed">{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Create new path view
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-base-content">Create New Learning Path</h1>
          <p className="text-base-content/60">Share your knowledge with the community.</p>
        </div>
        <button onClick={() => setActiveView('dashboard')} className="px-4 py-2 text-base-content/60 hover:text-base-content hover:bg-base-300 rounded-lg transition-colors text-sm font-medium flex items-center gap-2">
          <ArrowLeft size={16} /> Back to Studio
        </button>
      </div>

      {/* Progress Stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-base-300 -z-10"></div>
          {steps.map((s) => (
            <div key={s.num} className="flex flex-col items-center gap-2 bg-base-100 px-2">
              <div className={clsx(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-300",
                step >= s.num ? "bg-primary text-primary-content" : "bg-base-300 text-base-content/60"
              )}>
                {s.num}
              </div>
              <span className={clsx(
                "text-xs font-medium transition-colors duration-300",
                step >= s.num ? "text-primary" : "text-base-content/60"
              )}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-xl text-error text-sm">{error}</div>
      )}

      {/* Form Container */}
      <div className="bg-base-200 border border-base-300 rounded-2xl p-8 shadow-sm">
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-base-content">Learning Path Title *</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Introduction to React Hooks" className={inputClass} />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-base-content">Description *</label>
              <textarea rows={4} value={description} onChange={e => setDescription(e.target.value)} placeholder="What will students learn?" className={inputClass + " resize-none"} />
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-base-content">Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className={inputClass}>
                  <option value="Development">Development</option>
                  <option value="Design">Design</option>
                  <option value="Data Science">Data Science</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Business">Business</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-base-content">Difficulty Level</label>
                <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className={inputClass}>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
               <label className="text-sm font-bold text-base-content">Cover Image URL (optional)</label>
               <div className="flex gap-3">
                 <input type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://images.unsplash.com/..." className={inputClass} />
               </div>
               {imageUrl && <img src={imageUrl} alt="Preview" className="mt-2 w-full h-40 object-cover rounded-xl border border-base-300" />}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-base-content">Modules & Resources</h3>
              <button onClick={addModule} className="text-primary text-sm font-bold flex items-center gap-1 hover:text-primary/80">
                <Plus size={16} /> Add Module
              </button>
            </div>

            {modules.map((mod, modIdx) => (
              <div key={modIdx} className="border border-base-300 rounded-xl overflow-hidden">
                <div className="bg-base-300/30 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-content flex items-center justify-center text-xs font-bold shrink-0">{modIdx + 1}</div>
                    <input type="text" value={mod.title} onChange={e => updateModule(modIdx, 'title', e.target.value)} className="bg-transparent border-none outline-none font-bold text-base-content flex-1" placeholder="Module title" />
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => addResource(modIdx)} className="p-1.5 text-base-content/60 hover:text-base-content hover:bg-base-300 rounded-lg"><Plus size={16} /></button>
                    {modules.length > 1 && <button onClick={() => removeModule(modIdx)} className="p-1.5 text-base-content/60 hover:text-error hover:bg-error/10 rounded-lg"><Trash2 size={16} /></button>}
                  </div>
                </div>
                
                <div className="p-4 space-y-3 bg-base-200">
                  <input type="text" value={mod.description} onChange={e => updateModule(modIdx, 'description', e.target.value)} placeholder="Module description..." className="w-full px-3 py-2 bg-base-300/10 border border-base-300 rounded-lg text-sm outline-none focus:border-primary" />
                  
                  {mod.resources.map((res, resIdx) => (
                    <div key={resIdx} className="flex items-center gap-3 p-3 border border-base-300 rounded-lg bg-base-300/10">
                      {res.type === 'video' ? <Video size={18} className="text-base-content/60 shrink-0" /> : <FileText size={18} className="text-base-content/60 shrink-0" />}
                      <input type="text" value={res.title} onChange={e => updateResource(modIdx, resIdx, 'title', e.target.value)} placeholder="Resource title" className="bg-transparent border-none outline-none text-sm font-medium flex-1 min-w-0" />
                      <select value={res.type} onChange={e => updateResource(modIdx, resIdx, 'type', e.target.value)} className="text-xs bg-base-300/20 border border-base-300 rounded px-2 py-1 outline-none">
                        <option value="video">Video</option>
                        <option value="article">Article</option>
                      </select>
                      <Link size={14} className="text-base-content/40 shrink-0" />
                      <input type="url" value={res.url} onChange={e => updateResource(modIdx, resIdx, 'url', e.target.value)} placeholder="URL" className="bg-transparent border-none outline-none text-xs text-base-content/60 w-32" />
                      {mod.resources.length > 1 && <button onClick={() => removeResource(modIdx, resIdx)} className="text-error/60 hover:text-error shrink-0"><Trash2 size={14} /></button>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            <button onClick={addModule} className="w-full py-3 border-2 border-dashed border-base-300 rounded-xl text-base-content/60 font-medium hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2">
              <Plus size={18} /> Add Another Module
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 text-center">
             <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
               <Save size={32} />
             </div>
             <h2 className="text-2xl font-bold text-base-content">Ready to Publish?</h2>
             <p className="text-base-content/60">Your learning path will be reviewed by admins before going live.</p>
             
             <div className="bg-base-300/30 p-6 rounded-xl text-left max-w-md mx-auto mt-6">
               <h4 className="font-bold mb-3 text-base-content">Summary</h4>
               <ul className="space-y-2 text-sm text-base-content/60">
                 <li className="flex justify-between"><span>Title:</span> <span className="font-medium text-base-content">{title || 'Untitled'}</span></li>
                 <li className="flex justify-between"><span>Category:</span> <span className="font-medium text-base-content">{category}</span></li>
                 <li className="flex justify-between"><span>Difficulty:</span> <span className="font-medium text-base-content capitalize">{difficulty}</span></li>
                 <li className="flex justify-between"><span>Modules:</span> <span className="font-medium text-base-content">{modules.length}</span></li>
                 <li className="flex justify-between"><span>Resources:</span> <span className="font-medium text-base-content">{formTotalResources}</span></li>
                 <li className="flex justify-between"><span>XP Reward:</span> <span className="font-medium text-base-content">{modules.length * 100}</span></li>
               </ul>
             </div>

             {!title && <p className="text-error text-sm">Please add a title in Step 1</p>}
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-base-300">
           <button 
             onClick={() => setStep(Math.max(1, step - 1))}
             disabled={step === 1}
             className="px-6 py-2 text-base-content/60 font-medium hover:text-base-content disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
           >
             <ArrowLeft size={16} /> Back
           </button>
           
           {step === 3 ? (
             <button 
               onClick={handlePublish}
               disabled={isSubmitting || !title || !description}
               className="px-8 py-3 bg-primary text-primary-content rounded-xl font-bold shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
             >
               {isSubmitting ? 'Publishing...' : <><Upload size={16} /> Publish</>}
             </button>
           ) : (
             <button 
               onClick={() => setStep(Math.min(3, step + 1))}
               className="px-8 py-3 bg-primary text-primary-content rounded-xl font-bold shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-2"
             >
               Next Step <ArrowRight size={16} />
             </button>
           )}
        </div>
      </div>
    </div>
  );
}
