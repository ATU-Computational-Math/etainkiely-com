import { Timestamp } from 'firebase/firestore';

// User Types
export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  photoURL?: string;
  ageGroup?: 'young' | 'mid' | 'elder';
  createdAt: Timestamp;
  lastActive: Timestamp;
  totalPoints: number;
  completedQuizzes: string[];
  badges: string[];
  schoolCode?: string;
}

// Quiz Data Types
export interface QuizQuestion {
  id: string;
  text: string;
  answers: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  explanation?: string;
  image?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  ageGroup: 'young' | 'mid' | 'elder' | 'ultimate';
  category?: string;
}

export interface QuizCategory {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
}

export interface WeeklyTheme {
  id: string;
  title: string;
  description: string;
  startDate: Timestamp;
  endDate: Timestamp;
  imageUrl?: string;
  featuredQuestions?: string[]; // Question IDs
}

// Quiz Attempts and Results
export interface QuizAttempt {
  id: string;
  userId: string;
  quizType: 'standard' | 'ultimate';
  ageGroup: 'young' | 'mid' | 'elder' | 'ultimate';
  score: number;
  totalPossible: number;
  dateCompleted: Timestamp;
  timeSpent: number; // in seconds
  questionsAnswered: QuestionAnswer[];
  theme?: string;
}

export interface QuestionAnswer {
  questionId: string;
  answerId: string;
  isCorrect: boolean;
  timeSpent: number; // in seconds
}

// Leaderboard Types
export interface LeaderboardEntry {
  id: string;
  userId: string;
  displayName: string;
  ageGroup: 'young' | 'mid' | 'elder';
  score: number;
  dateCompleted: Timestamp;
  badges: string[];
  schoolCode?: string;
  weekId?: string;
  monthId?: string;
  rank?: number; // Calculated field, not stored in DB
}

// Badge Types
export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'achievement' | 'streak' | 'mastery' | 'special';
  criteria: {
    type: 'score' | 'completion' | 'streak' | 'time' | 'special';
    target: number;
    conditions?: any;
  };
}

export interface UserBadge {
  id: string;
  userId: string;
  badgeId: string;
  dateEarned: Timestamp | null;
  progress?: {
    current: number;
    target: number;
  };
}

// School/Team Types
export interface School {
  id: string;
  name: string;
  code: string;
  location?: string;
  memberCount: number;
  totalPoints: number;
  createdAt: Timestamp;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Utility Types
export type WithTimestamp<T> = T & {
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type WithoutId<T> = Omit<T, 'id'>;

export type QueryParams = {
  [key: string]: string | number | boolean | undefined;
};

// Type Guards
export const isUserProfile = (obj: any): obj is UserProfile => {
  return obj && 
    typeof obj.id === 'string' &&
    typeof obj.displayName === 'string' &&
    typeof obj.email === 'string' &&
    typeof obj.totalPoints === 'number' &&
    Array.isArray(obj.completedQuizzes);
};

export const isQuizQuestion = (obj: any): obj is QuizQuestion => {
  return obj && 
    typeof obj.id === 'string' &&
    typeof obj.text === 'string' &&
    Array.isArray(obj.answers) &&
    typeof obj.difficulty === 'string' &&
    typeof obj.points === 'number';
};

export const isLeaderboardEntry = (obj: any): obj is LeaderboardEntry => {
  return obj && 
    typeof obj.id === 'string' &&
    typeof obj.userId === 'string' &&
    typeof obj.displayName === 'string' &&
    typeof obj.ageGroup === 'string' &&
    typeof obj.score === 'number';
};

export const isBadge = (obj: any): obj is Badge => {
  return obj && 
    typeof obj.id === 'string' &&
    typeof obj.title === 'string' &&
    typeof obj.description === 'string' &&
    typeof obj.icon === 'string' &&
    typeof obj.category === 'string' &&
    typeof obj.criteria === 'object';
};

export const isUserBadge = (obj: any): obj is UserBadge => {
  return obj && 
    typeof obj.id === 'string' &&
    typeof obj.userId === 'string' &&
    typeof obj.badgeId === 'string';
};

// Helper Functions
export const timestampToDate = (timestamp: Timestamp | null | undefined): Date | null => {
  if (!timestamp) return null;
  return timestamp.toDate();
};

export const dateToTimestamp = (date: Date | null | undefined): Timestamp | null => {
  if (!date) return null;
  return Timestamp.fromDate(date);
};

import { Timestamp } from 'firebase/firestore';

// User Types
export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  photoURL?: string;
  ageGroup?: 'young' | 'mid' | 'elder';
  createdAt: Timestamp;
  lastActive: Timestamp;
  totalPoints: number;
  completedQuizzes: string[];
  badges: string[];
  schoolCode?: string;
}

// Quiz Data Types
export interface QuizQuestion {
  id: string;
  text: string;
  answers: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  explanation?: string;
  image?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  ageGroup: 'young' | 'mid' | 'elder' | 'ultimate';
  category?: string;
}

export interface QuizCategory {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
}

export interface WeeklyTheme {
  id: string;
  title: string;
  description: string;
  startDate: Timestamp;
  endDate: Timestamp;
  imageUrl?: string;
  featuredQuestions?: string[]; // Question IDs
}

// Quiz Attempts and Results
export interface QuizAttempt {
  id: string;
  userId: string;
  quizType: 'standard' | 'ultimate';
  ageGroup: 'young' | 'mid' | 'elder' | 'ultimate';
  score: number;
  totalPossible: number;
  dateCompleted: Timestamp;
  timeSpent: number; // in seconds
  questionsAnswered: QuestionAnswer[];
  theme?: string;
}

export interface QuestionAnswer {
  questionId: string;
  answerId: string;
  isCorrect: boolean;
  timeSpent: number; // in seconds
}

// Leaderboard Types
export interface LeaderboardEntry {
  id: string;
  userId: string;
  displayName: string;
  ageGroup: 'young' | 'mid' | 'elder';
  score: number;
  dateCompleted: Timestamp;
  badges: string[];
  schoolCode?: string;
  weekId?: string;
  monthId?: string;
}

// Badge Types
export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'achievement' | 'streak' | 'mastery' | 'special';
  criteria: {
    type: 'score' | 'completion' | 'streak' | 'time' | 'special';
    target: number;
    conditions?: any;
  };
}

export interface UserBadge {
  id: string;
  userId: string;
  badgeId: string;
  dateEarned: Timestamp;
  progress?: {
    current: number;
    target: number;
  };
}

// School/Team Types
export interface School {
  id: string;
  name: string;
  code: string;
  location?: string;
  memberCount: number;
  totalPoints: number;
}

// Type Guards
export const isUserProfile = (obj: any): obj is UserProfile => {
  return obj && 
    typeof obj.id === 'string' &&
    typeof obj.displayName === 'string' &&
    typeof obj.email === 'string';
};

export const isQuizQuestion = (obj: any): obj is QuizQuestion => {
  return obj && 
    typeof obj.id === 'string' &&
    typeof obj.text === 'string' &&
    Array.isArray(obj.answers);
};

export const isLeaderboardEntry = (obj: any): obj is LeaderboardEntry => {
  return obj && 
    typeof obj.id === 'string' &&
    typeof obj.userId === 'string' &&
    typeof obj.displayName === 'string' &&
    typeof obj.score === 'number';
};

export const isBadge = (obj: any): obj is Badge => {
  return obj && 
    typeof obj.id === 'string' &&
    typeof obj.title === 'string' &&
    typeof obj.description === 'string' &&
    typeof obj.icon === 'string';
};

