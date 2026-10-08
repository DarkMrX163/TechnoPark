import React, { useState, useEffect } from 'react';
import { AgeGroup, CategoryId, VkUser, LeaderboardEntry, Achievement } from './types';
import { AGE_TIERS, QUESTIONS, shuffleQuestionOptions } from './data/questions';
import { ACHIEVEMENTS } from './data/achievements';
import { INITIAL_LEADERBOARD } from './data/initialLeaderboard';
import { sounds } from './utils/audio';
import {
  loadLeaderboard,
  loadUserStats,
  saveQuizResultToRating,
  syncPlayerToLeaderboard,
  clearPlayerRating,
  clearEntireLocalLeaderboard
} from './utils/ratingStorage';
import {
  subscribeToCloudLeaderboard,
  savePlayerToCloud,
  clearCloudLeaderboardAll
} from './utils/cloudLeaderboard';

import { Header } from './components/Header';
import { AgeSelector } from './components/AgeSelector';
import { CategorySelector } from './components/CategorySelector';
import { QuizScreen } from './components/QuizScreen';
import { ResultsModal } from './components/ResultsModal';
import { CertificateModal } from './components/CertificateModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { AchievementsModal } from './components/AchievementsModal';
import { VkAuthModal } from './components/VkAuthModal';
import { AchievementToast } from './components/AchievementToast';

import { Trophy, Award, Sparkles, Compass, Shield, Users } from 'lucide-react';

export default function App() {
  // App state
  const [user, setUser] = useState<VkUser | null>(null);
  const [selectedAge, setSelectedAge] = useState<AgeGroup>('juniors');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'results'>('menu');
  const [isMuted, setIsMuted] = useState(false);

  // Gamification & storage state
  const [unlockedAchievementIds, setUnlockedAchievementIds] = useState<string[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(INITIAL_LEADERBOARD);
  const [activeToast, setActiveToast] = useState<Achievement | null>(null);

  // Active quiz state
  const [activeQuizQuestions, setActiveQuizQuestions] = useState<typeof QUESTIONS>([]);
  const [lastResults, setLastResults] = useState<{
    score: number;
    correctCount: number;
    totalCount: number;
    bestStreak: number;
    fastestAnswerTime: number;
  } | null>(null);
  const [recentlyUnlocked, setRecentlyUnlocked] = useState<Achievement[]>([]);

  // Participant info for Certificate
  const [participantName, setParticipantName] = useState<string>('');
  const [participantSchool, setParticipantSchool] = useState<string>('');

  // Modals state
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showVkAuth, setShowVkAuth] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [roundLength, setRoundLength] = useState<number>(8);

  // Initialize from storage & subscribe to Firestore cloud leaderboard on mount
  useEffect(() => {
    try {
      setIsMuted(sounds.getMuted());

      const savedUser = localStorage.getItem('quantum_vk_user');
      let parsedUser: VkUser | null = null;
      if (savedUser) {
        parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      }

      const savedName = localStorage.getItem('quantum_participant_name') || '';
      const savedSchool = localStorage.getItem('quantum_participant_school') || '';

      setParticipantName(savedName);
      setParticipantSchool(savedSchool);

      const savedAchievements = localStorage.getItem('quantum_achievements');
      if (savedAchievements) {
        setUnlockedAchievementIds(JSON.parse(savedAchievements));
      }

      const loadedList = loadLeaderboard();

      // Sync participant to local leaderboard
      const { updatedList } = syncPlayerToLeaderboard(
        savedName,
        savedSchool,
        parsedUser,
        0,
        0,
        'all',
        'juniors',
        savedAchievements ? JSON.parse(savedAchievements).length : 0
      );

      setLeaderboard(updatedList);

      // Force clear leaderboard as requested
      if (!localStorage.getItem('quantum_leaderboard_reset_v5')) {
        localStorage.setItem('quantum_leaderboard_reset_v5', 'true');
        clearEntireLocalLeaderboard();
        clearCloudLeaderboardAll();
        setLeaderboard([]);
      }

      // Subscribe to shared Cloud Firestore leaderboard
      const currentId = parsedUser?.id || localStorage.getItem('quantum_client_id') || 'guest';
      const unsubscribe = subscribeToCloudLeaderboard(currentId, (cloudEntries) => {
        setLeaderboard(cloudEntries || []);
      });

      return () => unsubscribe();
    } catch (e) {
      console.error('Storage or Cloud sync error:', e);
    }
  }, []);

  const triggerAchievement = (achievementId: string) => {
    if (unlockedAchievementIds.includes(achievementId)) return;

    const ach = ACHIEVEMENTS.find((a) => a.id === achievementId);
    if (!ach) return;

    sounds.playAchievement();
    setActiveToast(ach);
    const updated = [...unlockedAchievementIds, achievementId];
    setUnlockedAchievementIds(updated);
    localStorage.setItem('quantum_achievements', JSON.stringify(updated));

    setTimeout(() => {
      setActiveToast((current) => (current?.id === ach.id ? null : current));
    }, 4500);

    return ach;
  };

  const handleToggleSound = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
  };

  const handleUpdateParticipantInfo = (name: string, school: string) => {
    setParticipantName(name);
    setParticipantSchool(school);
    localStorage.setItem('quantum_participant_name', name);
    localStorage.setItem('quantum_participant_school', school);

    // Sync directly into local & cloud leaderboard
    const { updatedList } = syncPlayerToLeaderboard(
      name,
      school,
      user,
      0,
      0,
      selectedCategory,
      selectedAge,
      unlockedAchievementIds.length
    );
    setLeaderboard(updatedList);

    const userEntry = updatedList.find((e) => e.isCurrentUser || e.id === user?.id);
    if (userEntry) {
      savePlayerToCloud(
        name,
        school,
        user,
        userEntry.score,
        userEntry.accuracy,
        selectedCategory,
        selectedAge,
        unlockedAchievementIds.length
      );
    }
  };

  const handleVkLogin = (loggedInUser: VkUser) => {
    setUser(loggedInUser);
    localStorage.setItem('quantum_vk_user', JSON.stringify(loggedInUser));
    setShowVkAuth(false);

    let effectiveName = participantName;
    if (!participantName) {
      effectiveName = `${loggedInUser.first_name} ${loggedInUser.last_name}`;
      setParticipantName(effectiveName);
      localStorage.setItem('quantum_participant_name', effectiveName);
    }

    // Trigger VK connection achievement
    const ach = triggerAchievement('vk_connected');
    if (ach) {
      setRecentlyUnlocked((prev) => [...prev, ach]);
    }

    // Sync user with VK to local and cloud leaderboard
    const { updatedList } = syncPlayerToLeaderboard(
      effectiveName,
      participantSchool,
      loggedInUser,
      0,
      0,
      selectedCategory,
      selectedAge,
      unlockedAchievementIds.length
    );
    setLeaderboard(updatedList);

    const userEntry = updatedList.find((e) => e.isCurrentUser || e.id === loggedInUser.id);
    savePlayerToCloud(
      effectiveName,
      participantSchool,
      loggedInUser,
      userEntry?.score || 0,
      userEntry?.accuracy || 0,
      selectedCategory,
      selectedAge,
      unlockedAchievementIds.length
    );
  };

  const handleLogout = () => {
    if (window.confirm('Выйти из профиля VK ID?')) {
      setUser(null);
      localStorage.removeItem('quantum_vk_user');
    }
  };

  const handleClearRating = async () => {
    const { updatedList } = clearPlayerRating();
    setLeaderboard(updatedList);
  };

  const handleClearAllLeaderboard = async () => {
    const { updatedList } = clearEntireLocalLeaderboard();
    setLeaderboard(updatedList);
    await clearCloudLeaderboardAll();
  };

  // Filter questions for the selected age group & category
  const filteredQuestions = QUESTIONS.filter((q) => {
    const matchesAge = q.ageGroup === selectedAge;
    const matchesCat = selectedCategory === 'all' || q.category === selectedCategory;
    return matchesAge && matchesCat;
  });

  const handleStartQuiz = () => {
    if (filteredQuestions.length === 0) {
      alert('Нет вопросов для выбранной категории и возраста.');
      return;
    }

    // Shuffle questions and randomize options for each question so correct answer is scattered
    const shuffled = [...filteredQuestions].sort(() => 0.5 - Math.random());
    const selected = (roundLength === 0 ? shuffled : shuffled.slice(0, roundLength))
      .map((q) => shuffleQuestionOptions(q));
    setActiveQuizQuestions(selected);
    setRecentlyUnlocked([]);
    setGameState('playing');
  };

  const handleFinishQuiz = (stats: {
    score: number;
    correctCount: number;
    totalCount: number;
    bestStreak: number;
    fastestAnswerTime: number;
  }) => {
    setLastResults(stats);
    setGameState('results');

    // Evaluate Achievements
    const newEarned: Achievement[] = [];
    const accuracy = Math.round((stats.correctCount / stats.totalCount) * 100);

    // 1. First quiz
    const ach1 = triggerAchievement('first_quiz');
    if (ach1) newEarned.push(ach1);

    // 2. Combo 5
    if (stats.bestStreak >= 5) {
      const ach = triggerAchievement('combo_5');
      if (ach) newEarned.push(ach);
    }

    // 3. Speed demon (< 5s)
    if (stats.fastestAnswerTime < 5) {
      const ach = triggerAchievement('speed_demon');
      if (ach) newEarned.push(ach);
    }

    // 4. VR Adept
    if (selectedCategory === 'vr' && accuracy === 100) {
      const ach = triggerAchievement('vr_adept');
      if (ach) newEarned.push(ach);
    }

    // 5. Robotics Pro
    if (selectedCategory === 'robotics' && accuracy === 100) {
      const ach = triggerAchievement('robotics_pro');
      if (ach) newEarned.push(ach);
    }

    // 6. LEGO Master
    if (selectedCategory === 'lego' && accuracy === 100) {
      const ach = triggerAchievement('lego_master');
      if (ach) newEarned.push(ach);
    }

    // 7. High Scorer
    if (stats.score >= 2000) {
      const ach = triggerAchievement('high_scorer');
      if (ach) newEarned.push(ach);
    }

    // 8. Senior Champion
    if (selectedAge === 'seniors' && accuracy === 100) {
      const ach = triggerAchievement('senior_champion');
      if (ach) newEarned.push(ach);
    }

    setRecentlyUnlocked(newEarned);

    const totalBadges = unlockedAchievementIds.length + newEarned.length;

    // Record result into persistent rating storage
    const { updatedList } = saveQuizResultToRating(
      stats,
      selectedCategory,
      selectedAge,
      user,
      participantName,
      participantSchool,
      totalBadges
    );

    setLeaderboard(updatedList);

    // Save to shared Cloud Firestore
    const userEntry = updatedList.find((e) => e.isCurrentUser || e.id === user?.id);
    savePlayerToCloud(
      participantName,
      participantSchool,
      user,
      userEntry?.score || stats.score,
      accuracy,
      selectedCategory,
      selectedAge,
      totalBadges
    );

    // Update user stats
    const currentStats = loadUserStats();
    if (user) {
      const updatedUser: VkUser = {
        ...user,
        totalXp: currentStats.totalScore,
        gamesPlayed: currentStats.gamesCompleted,
        level: Math.floor(currentStats.totalScore / 1000) + 1
      };
      setUser(updatedUser);
      localStorage.setItem('quantum_vk_user', JSON.stringify(updatedUser));
    }
  };

  const getCategoryTitle = (cat: CategoryId) => {
    switch (cat) {
      case 'vr': return 'VR-технологии';
      case 'robotics': return 'Робототехника';
      case 'lego': return 'Легоконструирование';
      default: return 'Квантум Микс (Все направления)';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-white relative overflow-x-hidden">
      {/* Dynamic Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
      </div>

      {/* Persistent App Header */}
      <Header
        user={user}
        score={user?.totalXp || 0}
        streak={0}
        isMuted={isMuted}
        participantsCount={leaderboard.length}
        onToggleSound={handleToggleSound}
        onOpenLeaderboard={() => setShowLeaderboard(true)}
        onOpenAchievements={() => setShowAchievements(true)}
        onOpenVkAuth={() => setShowVkAuth(true)}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <main className="relative z-10 flex-1 max-w-5xl mx-auto w-full px-3 sm:px-6 py-6 sm:py-8 flex flex-col">
        {gameState === 'menu' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Hero Banner */}
            <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-blue-950/60 border border-slate-800 p-6 sm:p-8 shadow-2xl overflow-hidden">
              <div className="relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Интерактивная научная викторина</span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-3">
                  Технопарк <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">«Квантум Добра»</span>
                </h2>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
                  Проверь свои знания в виртуальной реальности, соревновательной робототехнике и механике LEGO. Уровень сложности и таймер автоматически адаптируются под твой возраст!
                </p>

                {/* Quick Info Badges */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                    <Compass className="w-3.5 h-3.5 text-cyan-400" />
                    3 направления кванторианцев
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                    <Shield className="w-3.5 h-3.5 text-emerald-400" />
                    Адаптивная сложность 6-14+ лет
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                    <Users className="w-3.5 h-3.5 text-blue-400" />
                    Рейтинг с VK ID
                  </span>
                </div>
              </div>

              {/* Decorative Tech Graphic Background */}
              <div className="absolute right-4 bottom-4 opacity-15 hidden sm:block pointer-events-none select-none text-9xl">
                🤖
              </div>
            </div>

            {/* Age Tier Selector */}
            <AgeSelector
              selectedAge={selectedAge}
              onSelectAge={setSelectedAge}
            />

            {/* Category Track Selector & Start Button */}
            <CategorySelector
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              onStartQuiz={handleStartQuiz}
              totalQuestionsCount={filteredQuestions.length}
              roundLength={roundLength}
              onSelectRoundLength={setRoundLength}
              participantName={participantName}
              participantSchool={participantSchool}
              onUpdateParticipantInfo={handleUpdateParticipantInfo}
            />

            {/* Feature Highlights Bento Box */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-4">
              <div
                onClick={() => setShowLeaderboard(true)}
                className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-yellow-500/40 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="p-2 rounded-xl bg-yellow-500/10 text-yellow-400 group-hover:scale-110 transition-transform">
                    <Trophy className="w-5 h-5" />
                  </span>
                  <span className="text-xs text-yellow-400 font-semibold flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-cyan-400" />
                    {leaderboard.length} уч.
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1">Таблица лидеров</h4>
                <p className="text-xs text-slate-400">
                  Соревнуйся с {leaderboard.length > 0 ? `${leaderboard.length} участниками` : 'другими резидентами'} Квантума и бей рекорды.
                </p>
              </div>

              <div
                onClick={() => setShowAchievements(true)}
                className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-amber-500/40 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
                    <Award className="w-5 h-5" />
                  </span>
                  <span className="text-xs text-amber-400 font-semibold">
                    {unlockedAchievementIds.length} / {ACHIEVEMENTS.length}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1">Система наград</h4>
                <p className="text-xs text-slate-400">
                  Открывай уникальные значки за стрики, скорость и точность.
                </p>
              </div>

              <div
                onClick={() => setShowVkAuth(true)}
                className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-blue-500/40 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="p-2 rounded-xl bg-blue-500/10 text-[#0077FF] group-hover:scale-110 transition-transform font-black">
                    K
                  </span>
                  <span className="text-xs text-[#0077FF] font-semibold">
                    {user?.isVkConnected ? 'Подключен' : 'Войти'}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1">Авторизация VK ID</h4>
                <p className="text-xs text-slate-400">
                  Сохраняй опыт и открытые медали под своим аккаунтом.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Active Quiz View */}
        {gameState === 'playing' && (
          <QuizScreen
            questions={activeQuizQuestions}
            ageTier={AGE_TIERS[selectedAge]}
            onFinishQuiz={handleFinishQuiz}
            onExit={() => setGameState('menu')}
          />
        )}
      </main>

      {/* Results Celebration Modal */}
      {gameState === 'results' && lastResults && (
        <ResultsModal
          stats={lastResults}
          categoryTitle={getCategoryTitle(selectedCategory)}
          ageTitle={AGE_TIERS[selectedAge].title}
          unlockedNow={recentlyUnlocked}
          user={user}
          onRestart={() => {
            setGameState('menu');
            handleStartQuiz();
          }}
          onOpenLeaderboard={() => {
            setShowLeaderboard(true);
          }}
          onOpenVkAuth={() => setShowVkAuth(true)}
          onOpenCertificate={() => setShowCertificate(true)}
          onExitToMenu={() => setGameState('menu')}
        />
      )}

      {/* Certificate Modal */}
      {showCertificate && lastResults && (
        <CertificateModal
          initialName={participantName || (user ? `${user.first_name} ${user.last_name}` : '')}
          initialSchool={participantSchool}
          categoryTitle={getCategoryTitle(selectedCategory)}
          ageTitle={AGE_TIERS[selectedAge].title}
          score={lastResults.score}
          accuracy={Math.round((lastResults.correctCount / lastResults.totalCount) * 100)}
          correctCount={lastResults.correctCount}
          totalCount={lastResults.totalCount}
          onClose={() => setShowCertificate(false)}
          onSaveProfileInfo={handleUpdateParticipantInfo}
        />
      )}

      {/* Leaderboard Modal */}
      {showLeaderboard && (
        <LeaderboardModal
          entries={leaderboard}
          currentUserId={user?.id}
          participantName={participantName}
          participantSchool={participantSchool}
          onUpdateParticipantInfo={handleUpdateParticipantInfo}
          onClearRating={handleClearRating}
          onClearAllLeaderboard={handleClearAllLeaderboard}
          onClose={() => setShowLeaderboard(false)}
        />
      )}

      {/* Achievements Modal */}
      {showAchievements && (
        <AchievementsModal
          achievements={ACHIEVEMENTS}
          unlockedIds={unlockedAchievementIds}
          onClose={() => setShowAchievements(false)}
        />
      )}

      {/* VK Auth Modal */}
      {showVkAuth && (
        <VkAuthModal
          onLogin={handleVkLogin}
          onClose={() => setShowVkAuth(false)}
          currentUser={user}
        />
      )}

      {/* Unlocked Achievement Toast Notification */}
      <AchievementToast
        achievement={activeToast}
        onDismiss={() => setActiveToast(null)}
      />

      {/* Footer */}
      <footer className="w-full border-t border-slate-900 bg-slate-950/80 px-4 py-4 text-center text-xs text-slate-400">
        <p>
          Детский технопарк «Квантум Добра» · Интерактивная викторина по VR, Робототехнике и Легоконструированию
        </p>
      </footer>
    </div>
  );
}
