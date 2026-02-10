import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronDown, 
  PlayCircle, 
  CheckCircle2, 
  Lock, 
  MessageSquare, 
  Share2, 
  Bookmark,
  Star,
  Users,
  Clock,
  BookOpen
} from 'lucide-react';
import clsx from 'clsx';
import { toast } from 'sonner';
import { useLearningStore } from '../stores/learningStore';

// High-quality course images
const COURSE_IMAGES = [
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=400&fit=crop',
];

const MENTOR_IMAGES = [
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop',
];

export function LearningPath({ onStartLesson }: { onStartLesson?: (pathId?: number) => void }) {
  const [expandedModule, setExpandedModule] = useState<number | null>(null);
  const [selectedPathIdx, setSelectedPathIdx] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { paths, fetchPaths, currentPath, currentProgress, fetchPath, enrollInPath } = useLearningStore();

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        await fetchPaths();
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [fetchPaths]);

  useEffect(() => {
    if (paths.length > 0 && paths[selectedPathIdx]) {
      fetchPath(paths[selectedPathIdx].id);
    }
  }, [selectedPathIdx, paths, fetchPath]);

  const handleEnroll = async () => {
    if (currentPath) {
      try {
        await enrollInPath(currentPath.id);
        toast.success(`Enrolled in ${currentPath.title}!`);
      } catch {
        toast.info('Already enrolled in this path');
      }
    }
  };

  const activePath = currentPath || paths[selectedPathIdx];
  const modules = currentPath?.modules || [];
  const progress = currentProgress;
  const progressPercent = progress?.progress_percentage || 0;
  const completedModules = progress?.completed_modules?.length || 0;
  const xpEarned = progress?.xp_earned || 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!activePath) {
    return (
      <div className="text-center py-12">
        <BookOpen size={48} className="mx-auto text-base-content/60 mb-4" />
        <h2 className="text-xl font-bold text-base-content mb-2">No Learning Paths Available</h2>
        <p className="text-base-content/60">Check back soon for new courses!</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Course Selector Tabs */}
      {paths.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {paths.map((path, idx) => (
            <button
              key={path.id}
              onClick={() => setSelectedPathIdx(idx)}
              className={clsx(
                "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors shrink-0",
                selectedPathIdx === idx
                  ? "bg-primary text-primary-content shadow-sm"
                  : "bg-base-200 border border-base-300 text-base-content/60 hover:bg-base-300/50"
              )}
            >
              {path.title}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Course Header */}
          <div className="bg-base-200 rounded-2xl border border-base-300 overflow-hidden shadow-sm">
            <div className="h-48 overflow-hidden relative">
              <img 
                src={activePath.image_url || COURSE_IMAGES[selectedPathIdx % COURSE_IMAGES.length]} 
                alt={activePath.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-6 right-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-bold rounded-md uppercase tracking-wide">
                    {activePath.category}
                  </span>
                  <span className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-bold rounded-md capitalize">
                    {activePath.difficulty}
                  </span>
                  <div className="flex items-center gap-1 text-yellow-400 ml-auto">
                    <Star size={14} fill="currentColor" />
                    <span className="text-sm font-bold text-white">{activePath.rating?.toFixed(1) || '4.8'}</span>
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-white">{activePath.title}</h1>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-base-content/60 text-sm mb-4">{activePath.description}</p>
              
              <div className="flex items-center gap-6 text-sm text-base-content/60 mb-6">
                <span className="flex items-center gap-1.5">
                  <Users size={14} />
                  <span className="font-bold text-base-content">{(activePath.enrolled_count || 0).toLocaleString()}</span> enrolled
                </span>
                <span className="flex items-center gap-1.5">
                  <BookOpen size={14} />
                  <span className="font-bold text-base-content">{modules.length}</span> modules
                </span>
                <span className="flex items-center gap-1.5">
                  <Star size={14} className="text-yellow-500" />
                  <span className="font-bold text-base-content">+{activePath.xp_reward || 500}</span> XP
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => onStartLesson?.(activePath?.id)}
                  className="flex-1 bg-primary text-primary-content py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all"
                >
                  {progress ? 'Continue Learning' : 'Start Learning'}
                </button>
                {!progress && (
                  <button 
                    onClick={handleEnroll}
                    className="px-6 py-3 border-2 border-primary text-primary rounded-xl font-bold hover:bg-primary/10 transition-colors"
                  >
                    Enroll
                  </button>
                )}
                <button 
                  onClick={() => setBookmarked(!bookmarked)}
                  className={clsx(
                    "p-3 border rounded-xl transition-colors",
                    bookmarked ? "border-accent bg-accent/10 text-accent" : "border-base-300 text-base-content/60 hover:bg-base-300 hover:text-base-content"
                  )}
                >
                  <Bookmark size={20} />
                </button>
                <button className="p-3 border border-base-300 text-base-content/60 hover:bg-base-300 hover:text-base-content transition-colors">
                  <Share2 size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Modules Accordion */}
          <div className="space-y-4">
            <h3 className="font-bold text-xl text-base-content">Course Content ({modules.length} modules)</h3>
            
            {modules.length > 0 ? modules.map((module, modIdx) => {
              const isCompleted = progress?.completed_modules?.includes(module.id);
              const hasCompletedResources = (module.resources || []).some(r => 
                progress?.completed_resources?.includes(r.id)
              );
              const status = isCompleted ? 'completed' : hasCompletedResources ? 'in-progress' : modIdx === 0 || progress ? 'available' : 'locked';

              return (
                <div 
                  key={module.id} 
                  className={clsx(
                    "bg-base-200 border rounded-2xl overflow-hidden transition-all duration-300",
                    status === 'locked' ? "opacity-60 border-base-300" : "border-base-300 shadow-sm"
                  )}
                >
                  <button 
                    onClick={() => status !== 'locked' && setExpandedModule(expandedModule === module.id ? null : module.id)}
                    className="w-full p-5 flex items-center justify-between hover:bg-base-300/20 transition-colors"
                    disabled={status === 'locked'}
                  >
                    <div className="flex items-center gap-4">
                      <div className={clsx(
                        "w-10 h-10 rounded-full flex items-center justify-center border-2 shrink-0",
                        status === 'completed' ? "bg-success border-success text-success" :
                        status === 'in-progress' ? "bg-primary/10 border-primary text-primary" :
                        status === 'locked' ? "bg-base-300 border-transparent text-base-content/60" :
                        "bg-base-300 border-base-300 text-base-content"
                      )}>
                        {status === 'completed' ? <CheckCircle2 size={20} /> : 
                         status === 'locked' ? <Lock size={20} /> :
                         <span className="font-bold text-sm">{modIdx + 1}</span>}
                      </div>
                      <div className="text-left">
                        <h4 className="font-bold text-base-content">{module.title}</h4>
                        <p className="text-sm text-base-content/60 mt-0.5 line-clamp-1">{module.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 shrink-0">
                      <span className="text-sm font-medium text-base-content/60 hidden sm:block">
                        {(module.resources || []).length} lessons
                      </span>
                      <ChevronDown 
                        size={20} 
                        className={clsx(
                          "text-base-content/60 transition-transform duration-300",
                          expandedModule === module.id && "rotate-180"
                        )} 
                      />
                    </div>
                  </button>

                  <AnimatePresence>
                    {expandedModule === module.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-6 pb-6 pt-2 space-y-2 border-t border-base-300/50 bg-base-300/10">
                          {(module.resources || []).map((resource, idx) => {
                            const resCompleted = progress?.completed_resources?.includes(resource.id);
                            return (
                              <div 
                                key={resource.id || idx} 
                                onClick={() => onStartLesson?.(activePath?.id)}
                                className="flex items-center justify-between p-3 rounded-xl hover:bg-base-200 transition-colors group cursor-pointer"
                              >
                                <div className="flex items-center gap-3">
                                  <div className={clsx(
                                    "w-6 h-6 rounded-full flex items-center justify-center",
                                    resCompleted ? "text-success" : "text-base-content/60"
                                  )}>
                                    {resCompleted ? <CheckCircle2 size={16} /> : <PlayCircle size={16} />}
                                  </div>
                                  <div>
                                    <span className={clsx("text-sm font-medium", resCompleted ? "text-base-content/60" : "text-base-content")}>
                                      {resource.title}
                                    </span>
                                    <span className="text-xs text-base-content/60 ml-2 capitalize">{resource.resource_type}</span>
                                  </div>
                                </div>
                                <span className="text-xs text-base-content/60 group-hover:text-primary transition-colors flex items-center gap-1">
                                  <Clock size={12} />
                                  {resource.resource_type === 'video' ? `${10 + idx * 5}:00` : `${5 + idx * 3}:00`}
                                </span>
                              </div>
                            );
                          })}
                          
                          <div className="mt-4 pt-4 border-t border-base-300/50 flex justify-between items-center">
                            <span className="text-xs text-base-content/60">
                              {(module.resources || []).filter(r => progress?.completed_resources?.includes(r.id)).length}/{(module.resources || []).length} completed
                            </span>
                            <button 
                              onClick={() => onStartLesson?.(activePath?.id)}
                              className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-content rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors"
                            >
                              {status === 'completed' ? 'Review' : 'Start Module'}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }) : (
              <div className="bg-base-200 rounded-2xl border border-base-300 p-8 text-center">
                <p className="text-base-content/60">No modules available for this course yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Area */}
        <div className="space-y-6">
          {/* Mentor Card */}
          <div className="bg-base-200 p-6 rounded-2xl border border-base-300 shadow-sm text-center">
             <div className="w-20 h-20 rounded-full bg-base-300 mx-auto mb-4 overflow-hidden border-4 border-base-100 shadow-sm">
               <img src={MENTOR_IMAGES[selectedPathIdx % MENTOR_IMAGES.length]} alt="Mentor" className="w-full h-full object-cover" />
             </div>
             <h3 className="font-bold text-base-content text-lg">Dr. Sarah Jensen</h3>
             <p className="text-base-content/60 text-sm mb-4">Senior Software Engineer @ TechCorp</p>
             <button className="w-full py-2.5 bg-base-300 text-base-content rounded-lg text-sm font-medium hover:bg-base-300/80 transition-colors">
               View Profile
             </button>
          </div>

          {/* Course Stats */}
          <div className="bg-base-200 p-6 rounded-2xl border border-base-300 shadow-sm space-y-4">
            <h3 className="font-bold text-base-content">Your Progress</h3>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-3xl font-bold text-primary">{Math.round(progressPercent)}%</span>
              <span className="text-sm text-base-content/60 mb-1.5">completed</span>
            </div>
            <div className="h-2.5 w-full bg-base-300 rounded-full overflow-hidden">
               <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${progressPercent}%` }}></div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-4">
               <div className="bg-base-100 p-3 rounded-xl border border-base-300 text-center">
                  <div className="text-lg font-bold text-base-content">{completedModules}/{modules.length}</div>
                  <div className="text-xs text-base-content/60">Modules</div>
               </div>
               <div className="bg-base-100 p-3 rounded-xl border border-base-300 text-center">
                  <div className="text-lg font-bold text-base-content">{xpEarned.toLocaleString()}</div>
                  <div className="text-xs text-base-content/60">XP Earned</div>
               </div>
            </div>
          </div>
          
          {/* Community/Discussions */}
          <div className="bg-base-200 p-6 rounded-2xl border border-base-300 shadow-sm">
             <div className="flex items-center justify-between mb-4">
               <h3 className="font-bold text-base-content">Discussions</h3>
               <button className="text-xs font-bold text-primary uppercase">View All</button>
             </div>
             
             <div className="space-y-4">
               {[
                 { name: 'Michael Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop', text: 'Can someone explain the difference between useEffect and useLayoutEffect?', time: '2h ago', replies: 12 },
                 { name: 'Emily Davis', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop', text: 'Great module on component architecture! The atomic design section was really helpful.', time: '5h ago', replies: 8 },
               ].map((discussion, i) => (
                 <div key={i} className="flex gap-3 cursor-pointer group">
                   <div className="w-8 h-8 rounded-full bg-base-300 shrink-0 overflow-hidden">
                      <img src={discussion.avatar} alt={discussion.name} className="w-full h-full object-cover" />
                   </div>
                   <div>
                     <p className="text-sm text-base-content font-medium line-clamp-2 group-hover:text-primary transition-colors">{discussion.text}</p>
                     <div className="flex items-center gap-3 mt-1">
                       <span className="text-xs text-base-content/60">{discussion.time}</span>
                       <div className="flex items-center gap-1 text-xs text-base-content/60">
                          <MessageSquare size={12} />
                          <span>{discussion.replies}</span>
                       </div>
                     </div>
                   </div>
                 </div>
               ))}
             </div>
             
             <button className="w-full mt-4 py-2.5 border border-base-300 text-base-content/60 rounded-lg text-sm font-medium hover:bg-base-300 hover:text-base-content transition-colors flex items-center justify-center gap-2">
               <MessageSquare size={16} />
               <span>Ask a Question</span>
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
