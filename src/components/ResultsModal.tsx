import React, { useEffect } from 'react';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Trophy, Award, RotateCcw, Share2, CheckCircle2, Zap, ArrowRight, Home, X } from 'lucide-react';
import { Achievement, VkUser } from '../types';

interface ResultsModalProps {
  stats: {
    score: number;
    correctCount: number;
    totalCount: number;
    bestStreak: number;
    fastestAnswerTime: number;
  };
  categoryTitle: string;
  ageTitle: string;
  unlockedNow: Achievement[];
  user: VkUser | null;
  onRestart: () => void;
  onOpenLeaderboard: () => void;
  onOpenVkAuth: () => void;
  onOpenCertificate: () => void;
  onExitToMenu?: () => void;
}

export const ResultsModal: React.FC<ResultsModalProps> = ({
  stats,
  categoryTitle,
  ageTitle,
  unlockedNow,
  user,
  onRestart,
  onOpenLeaderboard,
  onOpenVkAuth,
  onOpenCertificate,
  onExitToMenu
}) => {
  const accuracy = Math.round((stats.correctCount / stats.totalCount) * 100);

  useEffect(() => {
    // Sound & Confetti celebration
    sounds.playFanfare();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    const timeout = setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });
    }, 400);

    return () => clearTimeout(timeout);
  }, []);

  const handleShare = () => {
    sounds.playClick();
    const text = `Я набрал ${stats.score} очков в викторине технопарка «Квантум Добра» (направление: ${categoryTitle}) с точностью ${accuracy}%! Попробуй обогнать меня! 🚀`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      alert('Результат скопирован в буфер обмена! Поделись им с друзьями в VK или мессенджере.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Close/Exit to Menu in corner */}
        {onExitToMenu && (
          <button
            id="results-exit-corner-btn"
            onClick={() => {
              sounds.playClick();
              onExitToMenu();
            }}
            className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors"
            title="Выйти в меню"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Celebration Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-300 p-1 shadow-lg shadow-amber-500/20 mb-3 animate-bounce">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
              <Trophy className="w-9 h-9 sm:w-11 sm:h-11 text-amber-400" />
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-1">
            {accuracy >= 80 ? 'Великолепный результат!' : accuracy >= 50 ? 'Отличная работа!' : 'Хорошая попытка!'}
          </h2>
          <p className="text-sm text-slate-400">
            {categoryTitle} · {ageTitle}
          </p>
        </div>

        {/* Big Score Callout */}
        <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-blue-950/40 to-indigo-950/40 border border-cyan-500/30 text-center mb-6">
          <span className="text-xs uppercase tracking-wider text-cyan-300 font-bold block mb-1">
            Набранные очки Квантума
          </span>
          <span className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400">
            {stats.score} XP
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6">
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center">
            <span className="text-[11px] text-slate-400 block mb-1">Правильно</span>
            <span className="text-base sm:text-lg font-bold text-emerald-400 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              {stats.correctCount} / {stats.totalCount}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center">
            <span className="text-[11px] text-slate-400 block mb-1">Точность</span>
            <span className="text-base sm:text-lg font-bold text-cyan-400">
              {accuracy}%
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center">
            <span className="text-[11px] text-slate-400 block mb-1">Макс. комбо</span>
            <span className="text-base sm:text-lg font-bold text-amber-400 flex items-center justify-center gap-1">
              <Zap className="w-4 h-4" />
              x{stats.bestStreak}
            </span>
          </div>
        </div>

        {/* Unlocked Achievements Section */}
        {unlockedNow.length > 0 && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-amber-400" />
              Новые достижения разблокированы ({unlockedNow.length})
            </h4>
            <div className="space-y-2">
              {unlockedNow.map((ach) => (
                <div key={ach.id} className="flex items-center gap-3 p-2 rounded-xl bg-slate-900/60 border border-amber-500/20">
                  <span className="text-2xl">{ach.icon}</span>
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-white block">
                      {ach.title}
                    </span>
                    <span className="text-[11px] text-slate-400 block">
                      {ach.description}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VK Login Prompt if not connected */}
        {(!user || !user.isVkConnected) && (
          <div className="mb-6 p-3.5 rounded-2xl bg-blue-950/40 border border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-center sm:text-left">
              <div className="w-8 h-8 rounded-lg bg-[#0077FF] text-white font-black text-sm flex items-center justify-center shrink-0">
                K
              </div>
              <div>
                <p className="text-xs font-bold text-blue-200">
                  Сохрани прогресс в VK ID
                </p>
                <p className="text-[11px] text-slate-400">
                  Займи место в таблице лидеров «Квантум Добра»
                </p>
              </div>
            </div>
            <button
              id="results-vk-login-btn"
              onClick={() => {
                sounds.playClick();
                onOpenVkAuth();
              }}
              className="px-3 py-1.5 rounded-xl bg-[#0077FF] hover:bg-[#0066DF] text-white text-xs font-semibold whitespace-nowrap"
            >
              Войти с VK
            </button>
          </div>
        )}

        {/* Get Certificate Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-cyan-950/60 border border-amber-500/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3.5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 shrink-0">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-sm font-extrabold text-white">
                  Ваш персональный сертификат готов!
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 uppercase">
                  Скачать PNG
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Заберите именной диплом «Квантум Добра» с вашим результатом и школой.
              </p>
            </div>
          </div>

          <button
            id="results-get-certificate-btn"
            onClick={() => {
              sounds.playClick();
              onOpenCertificate();
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/25 active:scale-95 transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-1.5"
          >
            <Award className="w-4 h-4" />
            <span>Получить сертификат</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            id="results-play-again-btn"
            onClick={() => {
              sounds.playClick();
              onRestart();
            }}
            className="flex-1 flex items-center justify-center gap-2 p-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Играть снова</span>
          </button>

          <button
            id="results-leaderboard-btn"
            onClick={() => {
              sounds.playClick();
              onOpenLeaderboard();
            }}
            className="flex-1 flex items-center justify-center gap-2 p-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 active:scale-95 transition-all cursor-pointer"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Таблица лидеров</span>
          </button>

          {onExitToMenu && (
            <button
              id="results-exit-menu-btn"
              onClick={() => {
                sounds.playClick();
                onExitToMenu();
              }}
              title="Выйти в меню"
              className="flex items-center justify-center gap-1.5 p-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 active:scale-95 transition-all cursor-pointer text-sm font-semibold"
            >
              <Home className="w-4 h-4 text-cyan-400" />
              <span className="inline sm:hidden lg:inline">В меню</span>
            </button>
          )}

          <button
            id="results-share-btn"
            onClick={handleShare}
            title="Поделиться рекордом"
            className="p-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 border border-slate-700 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
