import React, { useState } from 'react';
import { LeaderboardEntry, CategoryId, AgeGroup } from '../types';
import { sounds } from '../utils/audio';
import { Trophy, X, Filter, Medal, Award, CheckCircle2 } from 'lucide-react';

interface LeaderboardModalProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  entries,
  currentUserId,
  onClose
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [selectedAge, setSelectedAge] = useState<AgeGroup | 'all'>('all');

  // Filter entries
  const filtered = entries.filter((entry) => {
    const matchesCat = selectedCategory === 'all' || entry.category === selectedCategory;
    const matchesAge = selectedAge === 'all' || entry.ageGroup === selectedAge;
    return matchesCat && matchesAge;
  }).sort((a, b) => b.score - a.score);

  const getRankBadge = (index: number) => {
    if (index === 0) {
      return (
        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-400 text-slate-950 font-black text-xs shadow-md shadow-amber-400/30">
          🥇
        </span>
      );
    }
    if (index === 1) {
      return (
        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-300 text-slate-950 font-black text-xs shadow-md shadow-slate-300/30">
          🥈
        </span>
      );
    }
    if (index === 2) {
      return (
        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-700 text-white font-black text-xs shadow-md shadow-amber-700/30">
          🥉
        </span>
      );
    }
    return (
      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-800 text-slate-400 font-bold text-xs">
        {index + 1}
      </span>
    );
  };

  const getCategoryName = (cat: CategoryId) => {
    switch (cat) {
      case 'vr': return 'VR';
      case 'robotics': return 'Роботы';
      case 'lego': return 'LEGO';
      default: return 'Микс';
    }
  };

  const getAgeLabel = (age: AgeGroup) => {
    switch (age) {
      case 'kids': return '6-9 лет';
      case 'juniors': return '10-13 лет';
      case 'seniors': return '14+ лет';
      default: return '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white">
                Таблица лидеров технопарка
              </h2>
              <p className="text-xs text-slate-400">
                Рейтинг резидентов «Квантум Добра» с авторизацией через VK
              </p>
            </div>
          </div>
          <button
            id="close-leaderboard-btn"
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="space-y-2 mb-4 bg-slate-950/40 p-3 rounded-2xl border border-slate-800/80">
          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 text-[11px] font-semibold pr-1 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Filter className="w-3 h-3 text-cyan-400" /> Тема:
            </span>
            {[
              { id: 'all', label: 'Все темы' },
              { id: 'vr', label: '🥽 VR' },
              { id: 'robotics', label: '🤖 Роботы' },
              { id: 'lego', label: '🧱 LEGO' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  sounds.playClick();
                  setSelectedCategory(tab.id as CategoryId);
                }}
                className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === tab.id
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Age Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            <span className="text-slate-400 text-[11px] font-semibold pr-1 uppercase tracking-wider shrink-0">
              Возраст:
            </span>
            {[
              { id: 'all', label: 'Все возрасты' },
              { id: 'kids', label: '6–9 лет' },
              { id: 'juniors', label: '10–13 лет' },
              { id: 'seniors', label: '14+ лет' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  sounds.playClick();
                  setSelectedAge(tab.id as AgeGroup | 'all');
                }}
                className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  selectedAge === tab.id
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Leaderboard List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-sm">
              Пока нет участников в этой категории. Будь первым!
            </div>
          ) : (
            filtered.map((item, index) => {
              const isCurrent = item.isCurrentUser || item.id === currentUserId;

              return (
                <div
                  key={item.id}
                  className={`flex items-center justify-between gap-3 p-3 rounded-2xl border transition-all ${
                    isCurrent
                      ? 'bg-cyan-950/50 border-cyan-500/80 ring-1 ring-cyan-500/30'
                      : index < 3
                      ? 'bg-slate-800/60 border-slate-700/80'
                      : 'bg-slate-900/40 border-slate-800/60'
                  }`}
                >
                  {/* Left: Rank & Avatar & Name */}
                  <div className="flex items-center gap-3 min-w-0">
                    {getRankBadge(index)}

                    <div className="relative">
                      <img
                        src={item.avatar}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-700"
                      />
                      {item.vkId && (
                        <div
                          className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#0077FF] rounded-full text-white text-[8px] font-black flex items-center justify-center ring-2 ring-slate-900"
                          title={`VK ID: ${item.vkId}`}
                        >
                          v
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`text-sm font-bold truncate ${isCurrent ? 'text-cyan-300' : 'text-white'}`}>
                          {item.name}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500 text-slate-950 font-bold">
                            Вы
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span className="text-cyan-400">{getCategoryName(item.category)}</span>
                        <span>·</span>
                        <span>{getAgeLabel(item.ageGroup)}</span>
                        <span>·</span>
                        <span className="text-amber-300 flex items-center gap-0.5">
                          <Award className="w-3 h-3 text-amber-400" /> {item.badgesCount}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Score and Accuracy */}
                  <div className="text-right shrink-0">
                    <span className="text-base sm:text-lg font-black text-amber-400 tabular-nums block">
                      {item.score} <span className="text-xs font-normal text-slate-400">XP</span>
                    </span>
                    <span className="text-[11px] text-emerald-400 font-medium flex items-center justify-end gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {item.accuracy}% точность
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
