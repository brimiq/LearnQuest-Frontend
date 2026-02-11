import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Play, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  Download, 
  MoreHorizontal,
  ThumbsUp,
  Share2,
  Bookmark
} from 'lucide-react';
import clsx from 'clsx';
import { toast } from 'sonner';
import { useLearningStore } from '../stores/learningStore';
import { useAuthStore } from '../stores/authStore';
import { commentService, type Comment as ApiComment } from '../services/commentService';

interface LessonItem {
  id: number;
  title: string;
  duration: string;
  completed: boolean;
  current: boolean;
  type: string;
  moduleTitle: string;
  description: string;
  url?: string;
  xpReward: number;
}

interface LessonViewProps {
  onBack: () => void;
  pathId?: number;
  initialLessonIndex?: number;
}

const LESSON_THUMBNAILS = [
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&h=675&fit=crop',
  'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=1200&h=675&fit=crop',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=675&fit=crop',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=675&fit=crop',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=675&fit=crop',
];

export function LessonView({ onBack, pathId, initialLessonIndex = 0 }: LessonViewProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'discussion' | 'notes'>('overview');
  const [currentLessonIdx, setCurrentLessonIdx] = useState(initialLessonIndex);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [notesText, setNotesText] = useState('');
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<ApiComment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  
  const { currentPath, currentProgress, fetchPath, completeResource } = useLearningStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (pathId) {
      fetchPath(pathId);
      // Load comments for this learning path
      setCommentsLoading(true);
      commentService.getComments({ learning_path_id: pathId }).then(data => {
        setComments(data.comments || []);
      }).catch(() => {}).finally(() => setCommentsLoading(false));
    }
  }, [pathId, fetchPath]);

  // Build flat lesson list from modules
  const lessons: LessonItem[] = currentPath?.modules?.flatMap((mod) =>
    (mod.resources || []).map((res, idx) => ({
      id: res.id,
      title: `${idx + 1}. ${res.title}`,
      duration: res.resource_type === 'video' ? `${10 + idx * 5}:00` : `${5 + idx * 3}:00`,
      completed: currentProgress?.completed_resources?.includes(res.id) || false,
      current: false,
      type: res.resource_type || 'video',
      moduleTitle: mod.title,
      description: res.description || 'Explore this lesson to deepen your understanding of the topic.',
      url: res.url,
      xpReward: 50,
    }))
  ) || [
    { id: 1, title: "1. Understanding the Box Model", duration: "10:00", completed: true, current: false, type: 'video', moduleTitle: 'Module 1: Foundations of Modern UI', description: 'Learn the fundamentals of the CSS box model and how elements are sized and spaced on the web.', xpReward: 50 },
    { id: 2, title: "2. Typography Hierarchies", duration: "15:00", completed: true, current: false, type: 'article', moduleTitle: 'Module 1: Foundations of Modern UI', description: 'Discover how to create effective typographic hierarchies that guide users through your content.', xpReward: 50 },
    { id: 3, title: "3. Color Theory Basics", duration: "20:00", completed: false, current: false, type: 'video', moduleTitle: 'Module 1: Foundations of Modern UI', description: 'In this lesson, we dive deep into the 60-30-10 rule, a classic decorating rule that helps create a balanced color palette.', xpReward: 50 },
    { id: 4, title: "4. Flexbox Layouts", duration: "25:00", completed: false, current: false, type: 'video', moduleTitle: 'Module 1: Foundations of Modern UI', description: 'Master CSS Flexbox to create flexible, responsive layouts with ease.', xpReward: 50 },
    { id: 5, title: "5. CSS Grid Fundamentals", duration: "30:00", completed: false, current: false, type: 'video', moduleTitle: 'Module 1: Foundations of Modern UI', description: 'Learn CSS Grid to build complex two-dimensional layouts that were previously impossible.', xpReward: 50 },
  ];

  // Mark current
  const lessonsWithCurrent = lessons.map((l, i) => ({ ...l, current: i === currentLessonIdx }));
  const currentLesson = lessonsWithCurrent[currentLessonIdx];
  const completedCount = lessonsWithCurrent.filter(l => l.completed).length;
  const progressPercent = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;

  const handlePrevious = () => {
    if (currentLessonIdx > 0) {
      setCurrentLessonIdx(currentLessonIdx - 1);
      setActiveTab('overview');
      setLiked(false);
    }
  };

  const handleNext = () => {
    if (currentLessonIdx < lessons.length - 1) {
      setCurrentLessonIdx(currentLessonIdx + 1);
      setActiveTab('overview');
      setLiked(false);
    }
  };

  const handleLessonSelect = (idx: number) => {
    setCurrentLessonIdx(idx);
    setActiveTab('overview');
    setLiked(false);
  };

  const handleMarkComplete = async () => {
    if (currentLesson && !currentLesson.completed) {
      try {
        await completeResource(currentLesson.id, 300);
        toast.success(`Lesson completed! +${currentLesson.xpReward} XP earned`);
      } catch {
        toast.info('Lesson marked complete');
      }
      // Move to next lesson
      if (currentLessonIdx < lessons.length - 1) {
        handleNext();
      }
    }
  };

  const extractYouTubeId = (url: string) => {
    const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?/]+)/);
    return m ? m[1] : null;
  };

  const ytId = currentLesson?.url ? extractYouTubeId(currentLesson.url) : null;
  const thumbnailUrl = ytId
    ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`
    : LESSON_THUMBNAILS[currentLessonIdx % LESSON_THUMBNAILS.length];

  const isYouTube = currentLesson?.url?.includes('youtube') || currentLesson?.url?.includes('youtu.be');
  const [isPlaying, setIsPlaying] = useState(false);

  const getYouTubeEmbedUrl = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?/]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0` : null;
  };

  if (!currentLesson) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-base-content/60 mb-4">No lessons available</p>
          <button onClick={onBack} className="px-4 py-2 bg-accent text-white rounded-lg font-medium">Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] -m-4 md:-m-8">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-base-300 bg-base-200 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-base-300 rounded-lg text-base-content/60 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h2 className="font-bold text-base-content text-lg line-clamp-1">{currentLesson.title}</h2>
            <p className="text-xs text-base-content/60">{currentLesson.moduleTitle}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={handlePrevious}
            disabled={currentLessonIdx === 0}
            className="hidden sm:flex items-center gap-2 px-4 py-2 border border-base-300 rounded-lg text-sm font-medium hover:bg-base-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} /> Previous
          </button>
          <button 
            onClick={handleNext}
            disabled={currentLessonIdx === lessons.length - 1}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-content rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next Lesson <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto bg-base-100 p-4 md:p-8 scroll-smooth">
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Video / Content Player */}
            <div className="aspect-video bg-black rounded-2xl overflow-hidden relative shadow-lg group">
              {isPlaying && isYouTube && currentLesson.url ? (
                <iframe
                  src={getYouTubeEmbedUrl(currentLesson.url) || ''}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={currentLesson.title}
                />
              ) : (
                <>
                  <img 
                    src={thumbnailUrl} 
                    alt={currentLesson.title} 
                    className="w-full h-full object-cover opacity-80" 
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button 
                      onClick={() => setIsPlaying(true)}
                      className="w-20 h-20 bg-primary/90 text-primary-content rounded-full flex items-center justify-center pl-1 shadow-2xl shadow-primary/40 transform transition-transform group-hover:scale-110"
                    >
                      <Play size={32} fill="currentColor" />
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/20">
                    <div className="h-full bg-primary" style={{ width: currentLesson.completed ? '100%' : '33%' }}></div>
                  </div>
                </>
              )}
            </div>

            {/* Title & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-base-300 pb-6">
              <div>
                <h1 className="text-2xl font-bold text-base-content mb-2">{currentLesson.title.replace(/^\d+\.\s*/, '')}</h1>
                <div className="flex items-center gap-4 text-sm text-base-content/60 flex-wrap">
                  <span className="flex items-center gap-1"><Play size={14} /> {currentLesson.duration}</span>
                  <span className="flex items-center gap-1"><FileText size={14} /> Transcript available</span>
                  <span className="text-green-600 font-bold">+{currentLesson.xpReward} XP</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setLiked(!liked)}
                  className={clsx(
                    "p-2.5 border rounded-xl transition-colors",
                    liked ? "border-primary bg-primary/10 text-primary" : "border-base-300 text-base-content/60 hover:bg-base-300 hover:text-base-content"
                  )} 
                  title="Like"
                >
                  <ThumbsUp size={18} />
                </button>
                <button 
                  onClick={() => setBookmarked(!bookmarked)}
                  className={clsx(
                    "p-2.5 border rounded-xl transition-colors",
                    bookmarked ? "border-primary bg-primary/10 text-primary" : "border-base-300 text-base-content/60 hover:bg-base-300 hover:text-base-content"
                  )} 
                  title="Save"
                >
                  <Bookmark size={18} />
                </button>
                <button className="p-2.5 border border-base-300 rounded-xl text-base-content/60 hover:bg-base-300 hover:text-base-content transition-colors" title="Share">
                  <Share2 size={18} />
                </button>
                <button className="p-2.5 border border-base-300 rounded-xl text-base-content/60 hover:bg-base-300 hover:text-base-content transition-colors">
                  <MoreHorizontal size={18} />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div>
              <div className="flex items-center gap-6 border-b border-base-300 mb-6 overflow-x-auto">
                {(['overview', 'discussion', 'notes'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={clsx(
                      "pb-3 text-sm font-medium capitalize transition-colors relative whitespace-nowrap",
                      activeTab === tab ? "text-primary" : "text-base-content/60 hover:text-base-content"
                    )}
                  >
                    {tab}
                    {activeTab === tab && (
                      <motion.div 
                        layoutId="activeTabLesson"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      />
                    )}
                  </button>
                ))}
              </div>

              <div className="min-h-[200px]">
                {activeTab === 'overview' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="text-base-content/90 leading-relaxed">
                      <p className="mb-4">{currentLesson.description}</p>
                      <h3 className="text-lg font-bold text-base-content mt-6 mb-2">Key Takeaways</h3>
                      <ul className="list-disc pl-5 space-y-2 text-base-content/60">
                        <li>Understanding core concepts and best practices.</li>
                        <li>Hands-on techniques you can apply immediately.</li>
                        <li>Industry standards and accessibility considerations.</li>
                      </ul>
                    </div>

                    {/* Mark Complete Button */}
                    {!currentLesson.completed && (
                      <button
                        onClick={handleMarkComplete}
                        className="w-full py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 size={18} />
                        Mark as Complete & Continue
                      </button>
                    )}

                    <div className="bg-base-300/30 rounded-xl p-6 border border-base-300">
                      <h3 className="font-bold text-base-content mb-4 flex items-center gap-2">
                        <Download size={18} /> Lesson Resources
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-base-200 rounded-lg border border-base-300 hover:border-primary/50 cursor-pointer transition-colors group">
                           <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded bg-red-100 text-red-500 flex items-center justify-center">
                               <FileText size={16} />
                             </div>
                             <div>
                               <p className="text-sm font-bold text-base-content group-hover:text-primary">Lesson_Notes.pdf</p>
                               <p className="text-xs text-base-content/60">2.4 MB</p>
                             </div>
                           </div>
                           <Download size={16} className="text-base-content/60 group-hover:text-primary" />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-base-200 rounded-lg border border-base-300 hover:border-primary/50 cursor-pointer transition-colors group">
                           <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded bg-blue-100 text-blue-500 flex items-center justify-center">
                               <FileText size={16} />
                             </div>
                             <div>
                               <p className="text-sm font-bold text-base-content group-hover:text-primary">Starter_Files.zip</p>
                               <p className="text-xs text-base-content/60">156 KB</p>
                             </div>
                           </div>
                           <Download size={16} className="text-base-content/60 group-hover:text-primary" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'discussion' && (
                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                     <div className="flex gap-4 mb-8">
                       <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0">
                         {user?.username?.charAt(0).toUpperCase() || 'U'}
                       </div>
                       <div className="flex-1">
                         <textarea 
                           value={commentText}
                           onChange={(e) => setCommentText(e.target.value)}
                           placeholder="Ask a question or share your thoughts..." 
                           rows={3}
                           className="w-full p-4 bg-base-300/30 border border-base-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                         />
                         <div className="flex justify-end mt-2">
                           <button 
                             onClick={async () => {
                               if (!commentText.trim() || !pathId) return;
                               try {
                                 const newComment = await commentService.createComment({ content: commentText, learning_path_id: pathId });
                                 setComments(prev => [newComment, ...prev]);
                                 setCommentText('');
                                 toast.success('Comment posted!');
                               } catch { toast.error('Failed to post comment'); }
                             }}
                             disabled={!commentText.trim()}
                             className="px-4 py-2 bg-primary text-primary-content rounded-lg text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
                           >
                             Post Comment
                           </button>
                         </div>
                       </div>
                     </div>
                     
                     <div className="space-y-6">
                       {commentsLoading ? (
                         <div className="text-center py-8 text-base-content/60">Loading comments...</div>
                       ) : comments.length > 0 ? comments.map((comment) => (
                         <div key={comment.id} className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-base-300 overflow-hidden shrink-0 flex items-center justify-center text-primary font-bold">
                               {comment.user?.avatar_url ? (
                                 <img src={comment.user.avatar_url} alt={comment.user.username} className="w-full h-full object-cover" />
                               ) : (
                                 comment.user?.username?.charAt(0).toUpperCase() || 'U'
                               )}
                            </div>
                            <div className="flex-1">
                               <div className="flex items-center gap-2 mb-1">
                                 <span className="font-bold text-base-content text-sm">{comment.user?.username || 'User'}</span>
                                 <span className="text-xs text-base-content/60">{comment.created_at ? new Date(comment.created_at).toLocaleDateString() : ''}</span>
                               </div>
                               <p className="text-sm text-base-content/80 leading-relaxed">{comment.content}</p>
                               {comment.replies && comment.replies.length > 0 && (
                                 <div className="mt-3 ml-4 space-y-3 border-l-2 border-base-300 pl-4">
                                   {comment.replies.map(reply => (
                                     <div key={reply.id}>
                                       <div className="flex items-center gap-2 mb-1">
                                         <span className="font-bold text-base-content text-xs">{reply.user?.username || 'User'}</span>
                                         <span className="text-xs text-base-content/60">{reply.created_at ? new Date(reply.created_at).toLocaleDateString() : ''}</span>
                                       </div>
                                       <p className="text-xs text-base-content/80">{reply.content}</p>
                                     </div>
                                   ))}
                                 </div>
                               )}
                            </div>
                         </div>
                       )) : (
                         <div className="text-center py-8 text-base-content/60">No comments yet. Be the first to start a discussion!</div>
                       )}
                     </div>
                   </motion.div>
                )}

                {activeTab === 'notes' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[400px] border border-base-300 rounded-xl overflow-hidden flex flex-col">
                    <div className="bg-base-300/30 p-2 border-b border-base-300 flex items-center gap-2 text-xs text-base-content/60">
                      <button className="p-1 hover:bg-base-300 rounded"><strong className="font-serif font-bold">B</strong></button>
                      <button className="p-1 hover:bg-base-300 rounded"><em className="font-serif italic">I</em></button>
                      <button className="p-1 hover:bg-base-300 rounded"><span className="underline">U</span></button>
                      <div className="w-px h-4 bg-base-300 mx-1"></div>
                      <button className="p-1 hover:bg-base-300 rounded">H1</button>
                      <button className="p-1 hover:bg-base-300 rounded">List</button>
                    </div>
                    <textarea 
                      className="flex-1 p-4 bg-base-200 outline-none resize-none font-mono text-sm leading-relaxed"
                      placeholder="Start typing your notes here..."
                      value={notesText}
                      onChange={(e) => setNotesText(e.target.value)}
                    />
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Course Content Sidebar */}
        <div className="w-80 border-l border-base-300 bg-base-200 overflow-y-auto shrink-0 hidden md:block">
          <div className="p-4 border-b border-base-300 bg-base-300/10">
            <h3 className="font-bold text-base-content">Course Content</h3>
            <div className="mt-2 flex items-center gap-2 text-xs text-base-content/60">
              <div className="flex-1 h-2 bg-base-300 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${progressPercent}%` }}></div>
              </div>
              <span className="font-bold">{progressPercent}%</span>
            </div>
          </div>
          
          <div className="divide-y divide-base-300">
            {lessonsWithCurrent.map((item, idx) => (
              <button 
                key={item.id}
                onClick={() => handleLessonSelect(idx)}
                className={clsx(
                  "w-full p-4 flex items-start gap-3 text-left hover:bg-base-300/30 transition-colors relative",
                  item.current ? "bg-base-300/50" : ""
                )}
              >
                {item.current && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                )}
                
                <div className={clsx(
                  "mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0",
                  item.completed ? "text-green-500 bg-green-100" : 
                  item.current ? "text-primary border-2 border-primary bg-transparent" :
                  "border border-base-content/40 text-transparent"
                )}>
                  {item.completed && <CheckCircle2 size={14} />}
                  {item.current && <div className="w-2 h-2 rounded-full bg-primary"></div>}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className={clsx(
                    "text-sm font-medium leading-tight mb-1",
                    item.current ? "text-base-content font-bold" : item.completed ? "text-base-content" : "text-base-content/60"
                  )}>
                    {item.title}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-base-content/40">
                    <span className="capitalize">{item.type}</span>
                    <span>•</span>
                    <span>{item.duration}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
