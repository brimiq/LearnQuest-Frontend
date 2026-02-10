export interface User {
  id: number;
  username: string;
  email: string;
  role: 'learner' | 'contributor' | 'admin';
  xp: number;
  points: number;
  streak_days: number;
  hours_learned: number;
  avatar_url?: string;
  bio?: string;
  created_at?: string;
}

export interface LearningPath {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  image_url?: string;
  xp_reward: number;
  creator_id: number;
  is_published: boolean;
  rating: number;
  enrolled_count: number;
  created_at?: string;
  modules?: Module[];
  progress?: UserProgress;
}

export interface Module {
  id: number;
  title: string;
  description: string;
  order: number;
  xp_reward: number;
  learning_path_id: number;
  resources?: Resource[];
}

export interface Resource {
  id: number;
  title: string;
  description?: string;
  resource_type: 'video' | 'article' | 'tutorial' | 'quiz';
  url?: string;
  order: number;
  rating: number;
  module_id: number;
}

export interface UserProgress {
  id: number;
  user_id: number;
  learning_path_id: number;
  learning_path_title?: string;
  current_module_id?: number;
  completed_modules: number[];
  completed_resources: number[];
  progress_percentage: number;
  xp_earned: number;
  time_spent: number;
  status: 'not_started' | 'in_progress' | 'completed';
  enrolled_at?: string;
  last_accessed?: string;
  completed_at?: string;
}

export interface Badge {
  id: number;
  name: string;
  description: string;
  icon_url?: string;
  badge_type: 'bronze' | 'silver' | 'gold' | 'platinum' | 'special';
  is_seasonal: boolean;
}

export interface UserBadge {
  id: number;
  user_id: number;
  badge: Badge;
  earned_at: string;
}

export interface Challenge {
  id: number;
  title: string;
  description: string;
  challenge_type: 'weekly' | 'monthly' | 'seasonal';
  xp_reward: number;
  points_reward: number;
  start_date?: string;
  end_date?: string;
  is_active: boolean;
}

export interface Achievement {
  id: number;
  name: string;
  description: string;
  icon_url?: string;
  xp_reward: number;
  points_reward: number;
}

export interface Quiz {
  id: number;
  title: string;
  description?: string;
  module_id: number;
  passing_score: number;
  xp_reward: number;
  time_limit: number;
  question_count: number;
  questions?: Question[];
}

export interface Question {
  id: number;
  question_text: string;
  question_type: 'multiple_choice' | 'true_false' | 'code';
  options: string[];
  order: number;
  points: number;
  correct_answer?: number;
  explanation?: string;
}

export interface QuizAttempt {
  id: number;
  user_id: number;
  quiz_id: number;
  score: number;
  correct_answers: number;
  total_questions: number;
  passed: boolean;
  xp_earned: number;
  time_taken: number;
  started_at?: string;
  completed_at?: string;
}

export interface QuizResult {
  score: number;
  passed: boolean;
  correct_answers: number;
  total_questions: number;
  xp_earned: number;
  points_earned: number;
  results: {
    question_id: number;
    user_answer: number;
    correct_answer: number;
    is_correct: boolean;
    explanation: string;
    points_earned: number;
  }[];
  attempt_id: number;
}

export interface LeaderboardEntry {
  rank: number;
  user_id: number;
  username: string;
  avatar_url?: string;
  xp: number;
  points: number;
}

export interface Comment {
  id: number;
  content: string;
  user_id: number;
  username?: string;
  avatar_url?: string;
  learning_path_id?: number;
  resource_id?: number;
  parent_id?: number;
  created_at: string;
  updated_at?: string;
  replies?: Comment[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  count?: number;
}
