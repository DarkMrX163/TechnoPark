import React from 'react';
import { Volume2, VolumeX, Trophy, Award, Sparkles, LogOut } from 'lucide-react';
import { VkUser } from '../types';
import { sounds } from '../utils/audio';

interface HeaderProps {
  user: VkUser | null;
  score: number;
  streak: number;
  isMuted: boolean;
  onToggleSound: () => void;
  onOpenLeaderboard: () => void;
  onOpenAchievements: () => void;
  onOpenVkAuth: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  score,
  streak,
  isMuted,
  onToggleSound,
  onOpenLeaderboard,
  onOpenAchievements,
  onOpenVkAuth,
  onLogout
}) => {
  return (
    <header className="w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 px-3 sm:px-6 py-3 transition-colors">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-[2px] shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <span className="text-xl select-none" role="img" aria-label="Quantum">⚛️</span>
            </div>
            {streak >= 3 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 text-[10px] font-bold text-slate-950 items-center justify-center">🔥</span>
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base sm:text-lg font-extrabold tracking-tight bg-gradient-to-r from-cyan-300 via-blue-200 to-indigo-300 bg-clip-text text-transparent">
                Квантум Добра
              </h1>
              <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded bg-cyan-950/80 text-cyan-400 border border-cyan-500/30">
                Технопарк
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden xs:block">
              VR · Робототехника · LEGO
            </p>
          </div>
        </div>

        {/* Action Controls & Navigation */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Live Score Pill */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs sm:text-sm font-semibold text-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="tabular-nums">{score}</span>
            <span className="text-[10px] text-slate-400 font-normal">XP</span>
          </div>

          {/* Sound Toggle Button */}
          <button
            id="sound-toggle-btn"
            onClick={onToggleSound}
            aria-label={isMuted ? 'Включить звук' : 'Выключить звук'}
            title={isMuted ? 'Включить звук' : 'Выключить звук'}
            className="p-2 rounded-lg bg-slate-800/70 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 border border-slate-700/50 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>

          {/* Achievements Button */}
          <button
            id="achievements-nav-btn"
            onClick={() => {
              sounds.playClick();
              onOpenAchievements();
            }}
            title="Достижения"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/70 hover:bg-slate-700 text-slate-300 hover:text-amber-300 border border-slate-700/50 transition-colors text-xs sm:text-sm font-medium"
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span className="hidden md:inline">Награды</span>
          </button>

          {/* Leaderboard Button */}
          <button
            id="leaderboard-nav-btn"
            onClick={() => {
              sounds.playClick();
              onOpenLeaderboard();
            }}
            title="Таблица лидеров"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/70 hover:bg-slate-700 text-slate-300 hover:text-blue-300 border border-slate-700/50 transition-colors text-xs sm:text-sm font-medium"
          >
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span className="hidden md:inline">Лидеры</span>
          </button>

          {/* VK Authorization Pill / Button */}
          {user && user.isVkConnected ? (
            <div className="flex items-center gap-2 pl-1 pr-1.5 py-1 rounded-xl bg-blue-950/60 border border-blue-500/40">
              <img
                src={user.photo_200}
                alt={user.first_name}
                referrerPolicy="no-referrer"
                className="w-7 h-7 rounded-lg object-cover ring-1 ring-blue-400/50"
              />
              <div className="flex flex-col text-left pr-1 hidden sm:flex">
                <span className="text-xs font-semibold text-blue-200 leading-tight flex items-center gap-1">
                  {user.first_name}
                  <span className="w-2.5 h-2.5 bg-blue-500 rounded-full inline-flex items-center justify-center text-[7px] text-white font-black" title="VK ID подключен">
                    v
                  </span>
                </span>
                <span className="text-[10px] text-blue-400 font-mono">VK ID</span>
              </div>
              <button
                id="vk-logout-btn"
                onClick={onLogout}
                title="Сменить профиль"
                className="p-1 text-slate-400 hover:text-rose-400 transition-colors rounded"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              id="vk-login-nav-btn"
              onClick={() => {
                sounds.playClick();
                onOpenVkAuth();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0077FF] hover:bg-[#0066DF] text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-500/20 active:scale-95 transition-all"
            >
              <div className="w-4 h-4 rounded-sm bg-white text-[#0077FF] flex items-center justify-center font-black text-[10px] leading-none">
                K
              </div>
              <span className="font-medium">Войти с VK ID</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
