export type AgeGroup = 'kids' | 'juniors' | 'seniors';

export type CategoryId = 'all' | 'vr' | 'robotics' | 'lego';

export interface AgeTierInfo {
  id: AgeGroup;
  title: string;
  subtitle: string;
  ageRange: string;
  timeLimitSeconds: number;
  multiplier: number;
  icon: string;
  badgeColor: string;
  accentGradient: string;
  description: string;
}

export interface Question {
  id: string;
  category: 'vr' | 'robotics' | 'lego';
  ageGroup: AgeGroup;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  fact: string;
  imageHint?: string; // emoji or visual icon descriptor
  imageUrl?: string; // visual photo or illustration of what is asked in the question
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'general' | 'vr' | 'robotics' | 'lego' | 'streak';
  unlockedAt?: string;
  conditionDescription: string;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  vkId?: string;
  avatar: string;
  score: number;
  accuracy: number;
  category: CategoryId;
  ageGroup: AgeGroup;
  badgesCount: number;
  date: string;
  isCurrentUser?: boolean;
}

export interface VkUser {
  id: string;
  first_name: string;
  last_name: string;
  photo_200: string;
  isVkConnected: boolean;
  registeredDate: string;
  level: number;
  totalXp: number;
  gamesPlayed: number;
  favoriteCategory?: CategoryId;
}

export interface UserStats {
  totalScore: number;
  bestStreak: number;
  correctAnswersTotal: number;
  questionsAnsweredTotal: number;
  unlockedAchievementIds: string[];
  gamesCompleted: number;
  lastPlayedCategory?: CategoryId;
  lastAgeGroup?: AgeGroup;
}
