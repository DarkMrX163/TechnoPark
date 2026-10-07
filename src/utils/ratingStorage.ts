import { LeaderboardEntry, VkUser, CategoryId, AgeGroup, UserStats } from '../types';
import { INITIAL_LEADERBOARD } from '../data/initialLeaderboard';

const STORAGE_KEYS = {
  LEADERBOARD: 'quantum_leaderboard',
  USER_STATS: 'quantum_user_stats',
  PARTICIPANT_NAME: 'quantum_participant_name',
  PARTICIPANT_SCHOOL: 'quantum_participant_school',
  VK_USER: 'quantum_vk_user',
  ACHIEVEMENTS: 'quantum_achievements',
  RATING_HISTORY: 'quantum_rating_history',
};

export interface RatingHistoryEntry {
  id: string;
  timestamp: number;
  dateStr: string;
  score: number;
  accuracy: number;
  category: CategoryId;
  ageGroup: AgeGroup;
  correctCount: number;
  totalCount: number;
}

export interface PlayerRankInfo {
  rank: number;
  totalPlayers: number;
  bestScore: number;
  totalXp: number;
  gamesPlayed: number;
}

// Helper to safely parse JSON from localStorage
function safeGetJSON<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`Error reading localStorage key "${key}":`, err);
    return defaultValue;
  }
}

// Safe set JSON
function safeSetJSON(key: string, value: any): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error(`Error saving to localStorage key "${key}":`, err);
    return false;
  }
}

/**
 * Load initial user stats
 */
export function loadUserStats(): UserStats {
  const defaultStats: UserStats = {
    totalScore: 0,
    bestStreak: 0,
    correctAnswersTotal: 0,
    questionsAnsweredTotal: 0,
    unlockedAchievementIds: [],
    gamesCompleted: 0,
  };
  return safeGetJSON<UserStats>(STORAGE_KEYS.USER_STATS, defaultStats);
}

/**
 * Save user stats
 */
export function saveUserStats(stats: UserStats): void {
  safeSetJSON(STORAGE_KEYS.USER_STATS, stats);
}

/**
 * Load leaderboard from storage, initializing with defaults if absent
 */
export function loadLeaderboard(): LeaderboardEntry[] {
  const stored = safeGetJSON<LeaderboardEntry[] | null>(STORAGE_KEYS.LEADERBOARD, null);
  if (stored && Array.isArray(stored)) {
    return stored;
  }
  // Initialize with empty array and save
  safeSetJSON(STORAGE_KEYS.LEADERBOARD, []);
  return [];
}

/**
 * Save leaderboard array to localStorage
 */
export function saveLeaderboard(entries: LeaderboardEntry[]): void {
  safeSetJSON(STORAGE_KEYS.LEADERBOARD, entries);
}

/**
 * Load rating history logs
 */
export function loadRatingHistory(): RatingHistoryEntry[] {
  return safeGetJSON<RatingHistoryEntry[]>(STORAGE_KEYS.RATING_HISTORY, []);
}

/**
 * Update or create the player's leaderboard entry based on current profile and stats
 */
export function syncPlayerToLeaderboard(
  participantName: string,
  participantSchool: string,
  user: VkUser | null,
  scoreToAdd: number = 0,
  latestAccuracy: number = 0,
  category: CategoryId = 'all',
  ageGroup: AgeGroup = 'juniors',
  unlockedCount: number = 0
): { updatedList: LeaderboardEntry[]; playerRank: PlayerRankInfo } {
  const list = loadLeaderboard();

  // Determine player ID & display name
  const playerId = user?.id || 'quantum_local_player';
  const displayName = participantName.trim()
    || (user ? `${user.first_name} ${user.last_name}` : 'Резидент Квантума');

  const avatar = user?.photo_200
    || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80';

  const existingIndex = list.findIndex((e) => e.id === playerId || e.isCurrentUser);

  let userEntry: LeaderboardEntry;

  if (existingIndex >= 0) {
    const existing = list[existingIndex];
    const newScore = Math.max(existing.score, scoreToAdd);
    userEntry = {
      ...existing,
      id: playerId,
      name: displayName,
      vkId: user?.isVkConnected ? user.id : existing.vkId,
      avatar: user?.photo_200 || existing.avatar,
      score: newScore,
      accuracy: latestAccuracy > 0 ? latestAccuracy : existing.accuracy,
      category: category !== 'all' ? category : existing.category,
      ageGroup,
      badgesCount: Math.max(existing.badgesCount, unlockedCount),
      date: 'Сегодня',
      isCurrentUser: true,
    };
    list[existingIndex] = userEntry;
  } else {
    userEntry = {
      id: playerId,
      name: displayName,
      vkId: user?.isVkConnected ? user.id : undefined,
      avatar,
      score: scoreToAdd,
      accuracy: latestAccuracy,
      category,
      ageGroup,
      badgesCount: unlockedCount,
      date: 'Сегодня',
      isCurrentUser: true,
    };
    list.push(userEntry);
  }

  // Sort descending by score
  list.sort((a, b) => b.score - a.score);
  saveLeaderboard(list);

  // Compute player rank
  const rankIndex = list.findIndex((e) => e.id === playerId || e.isCurrentUser);
  const userStats = loadUserStats();

  const playerRank: PlayerRankInfo = {
    rank: rankIndex >= 0 ? rankIndex + 1 : list.length,
    totalPlayers: list.length,
    bestScore: userEntry.score,
    totalXp: userStats.totalScore,
    gamesPlayed: userStats.gamesCompleted,
  };

  return { updatedList: list, playerRank };
}

/**
 * Record a finished quiz result into rating storage
 */
export function saveQuizResultToRating(
  stats: {
    score: number;
    correctCount: number;
    totalCount: number;
    bestStreak: number;
    fastestAnswerTime: number;
  },
  category: CategoryId,
  ageGroup: AgeGroup,
  user: VkUser | null,
  participantName: string,
  participantSchool: string,
  unlockedBadgesCount: number
): { updatedList: LeaderboardEntry[]; playerRank: PlayerRankInfo; savedHistory: RatingHistoryEntry[] } {
  const accuracy = Math.round((stats.correctCount / stats.totalCount) * 100);

  // 1. Update User Stats
  const currentStats = loadUserStats();
  const updatedStats: UserStats = {
    totalScore: currentStats.totalScore + stats.score,
    bestStreak: Math.max(currentStats.bestStreak, stats.bestStreak),
    correctAnswersTotal: currentStats.correctAnswersTotal + stats.correctCount,
    questionsAnsweredTotal: currentStats.questionsAnsweredTotal + stats.totalCount,
    unlockedAchievementIds: currentStats.unlockedAchievementIds,
    gamesCompleted: currentStats.gamesCompleted + 1,
    lastPlayedCategory: category,
    lastAgeGroup: ageGroup,
  };
  saveUserStats(updatedStats);

  // 2. Append to Rating History
  const history = loadRatingHistory();
  const now = new Date();
  const dateStr = `${now.toLocaleDateString('ru-RU')} ${now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;

  const historyEntry: RatingHistoryEntry = {
    id: `game_${Date.now()}`,
    timestamp: Date.now(),
    dateStr,
    score: stats.score,
    accuracy,
    category,
    ageGroup,
    correctCount: stats.correctCount,
    totalCount: stats.totalCount,
  };

  const updatedHistory = [historyEntry, ...history].slice(0, 50); // keep last 50 games
  safeSetJSON(STORAGE_KEYS.RATING_HISTORY, updatedHistory);

  // 3. Sync to Leaderboard
  const { updatedList, playerRank } = syncPlayerToLeaderboard(
    participantName,
    participantSchool,
    user,
    stats.score,
    accuracy,
    category,
    ageGroup,
    unlockedBadgesCount
  );

  return { updatedList, playerRank, savedHistory: updatedHistory };
}

/**
 * Reset local player rating and history
 */
export function clearPlayerRating(): { updatedList: LeaderboardEntry[] } {
  try {
    localStorage.removeItem(STORAGE_KEYS.USER_STATS);
    localStorage.removeItem(STORAGE_KEYS.RATING_HISTORY);

    // Remove current user from leaderboard
    const list = loadLeaderboard().filter((e) => !e.isCurrentUser && e.id !== 'quantum_local_player');
    saveLeaderboard(list);
    return { updatedList: list };
  } catch (e) {
    console.error('Failed to clear rating:', e);
    return { updatedList: loadLeaderboard() };
  }
}

/**
 * Wipe all local leaderboard and rating data completely
 */
export function clearEntireLocalLeaderboard(): { updatedList: LeaderboardEntry[] } {
  try {
    localStorage.removeItem(STORAGE_KEYS.LEADERBOARD);
    localStorage.removeItem(STORAGE_KEYS.USER_STATS);
    localStorage.removeItem(STORAGE_KEYS.RATING_HISTORY);
    localStorage.removeItem('quantum_client_id');
    return { updatedList: [] };
  } catch (e) {
    console.error('Failed to wipe local leaderboard:', e);
    return { updatedList: [] };
  }
}
