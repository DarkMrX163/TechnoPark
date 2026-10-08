import React, { useState } from 'react';
import { LeaderboardEntry, CategoryId, AgeGroup } from '../types';
import { sounds } from '../utils/audio';
import { Trophy, X, Filter, Award, CheckCircle2, Save, UserCheck, GraduationCap, History, Trash2, ShieldCheck, Sparkles, Users } from 'lucide-react';

function formatParticipantsCount(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod100 >= 11 && mod100 <= 19) return `${count} участников`;
  if (mod10 === 1) return `${count} участник`;
  if (mod10 >= 2 && mod10 <= 4) return `${count} участника`;
  return `${count} участников`;
}
import { loadRatingHistory, RatingHistoryEntry } from '../utils/ratingStorage';

interface LeaderboardModalProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
  participantName?: string;
  participantSchool?: string;
  onUpdateParticipantInfo?: (name: string, school: string) => void;
  onClearRating?: () => void;
  onClearAllLeaderboard?: () => void;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  entries,
  currentUserId,
  participantName = '',
  participantSchool = '',
  onUpdateParticipantInfo,
  onClearRating,
  onClearAllLeaderboard,
  onClose
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [selectedAge, setSelectedAge] = useState<AgeGroup | 'all'>('all');
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'history'>('leaderboard');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(participantName);
  const [editSchool, setEditSchool] = useState(participantSchool);

  const historyLogs: RatingHistoryEntry[] = loadRatingHistory();

  // Filter entries
  const filtered = entries.filter((entry) => {
    const matchesCat = selectedCategory === 'all' || entry.category === selectedCategory;
    const matchesAge = selectedAge === 'all' || entry.ageGroup === selectedAge;
    return matchesCat && matchesAge;
  }).sort((a, b) => b.score - a.score);

  // Find user's entry
  const userEntry = entries.find((e) => e.isCurrentUser || e.id === currentUserId);
  const userRankIndex = entries.findIndex((e) => e.isCurrentUser || e.id === currentUserId);
  const userRank = userRankIndex >= 0 ? userRankIndex + 1 : entries.length + 1;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateParticipantInfo) {
      onUpdateParticipantInfo(editName, editSchool);
    }
    setIsEditingProfile(false);
    sounds.playAchievement();
  };

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
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white">
                  Таблица лидеров и Рейтинг
                </h2>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Сохранено
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Детский технопарк «Квантум Добра» · Нефтегорский район
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

        {/* Total Quiz Participants Counter Bar */}
        <div className="mb-3.5 p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-blue-950/80 via-indigo-950/60 to-slate-900 border border-blue-500/30 flex items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/20 text-cyan-300 border border-blue-400/40 shrink-0">
              <Users className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
            <div>
              <span className="text-[11px] text-slate-300 font-semibold block uppercase tracking-wider">
                Участников викторины
              </span>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-black text-white tabular-nums">
                  {formatParticipantsCount(entries.length)}
                </span>
                {filtered.length !== entries.length && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium">
                    Показано: {filtered.length}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="text-right hidden xs:block">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Живой рейтинг
            </span>
          </div>
        </div>

        {/* User Status Card */}
        <div className="mb-4 p-3.5 rounded-2xl bg-gradient-to-r from-slate-950 via-cyan-950/40 to-slate-950 border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 font-extrabold text-base shrink-0">
              #{userRank}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">
                  {participantName || userEntry?.name || 'Гость Квантума'}
                </span>
                {participantSchool && (
                  <span className="text-[11px] text-slate-400 truncate max-w-[150px]">
                    ({participantSchool})
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                <span>Рекорд: <strong className="text-amber-400">{userEntry?.score || 0} XP</strong></span>
                <span>·</span>
                <span>Место: <strong className="text-cyan-400">№{userRank}</strong> из {entries.length}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => {
                sounds.playClick();
                setIsEditingProfile(!isEditingProfile);
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isEditingProfile ? 'Скрыть ред.' : 'Имя для сертификата'}</span>
            </button>
          </div>
        </div>

        {/* Profile Inline Editor */}
        {isEditingProfile && (
          <form onSubmit={handleSaveProfile} className="mb-4 p-3.5 rounded-2xl bg-slate-950 border border-cyan-500/50 space-y-3 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-300 font-semibold block mb-1 flex items-center gap-1">
                  <UserCheck className="w-3 h-3 text-cyan-400" /> ФИО участника
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Имя Фамилия"
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-300 font-semibold block mb-1 flex items-center gap-1">
                  <GraduationCap className="w-3 h-3 text-cyan-400" /> Школа / Класс
                </label>
                <input
                  type="text"
                  value={editSchool}
                  onChange={(e) => setEditSchool(e.target.value)}
                  placeholder="МБОУ СОШ №1"
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-md cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" /> Сохранить в рейтинг
              </button>
            </div>
          </form>
        )}

        {/* Navigation Tabs (Leaderboard vs History) */}
        <div className="flex items-center gap-2 mb-3 border-b border-slate-800 pb-2">
          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('leaderboard');
            }}
            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'leaderboard'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-400" /> Общий рейтинг
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('history');
            }}
            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-4 h-4 text-cyan-400" /> Мои заезды ({historyLogs.length})
          </button>

          <div className="ml-auto flex items-center gap-1">
            {onClearAllLeaderboard && (
              <button
                onClick={() => {
                  if (window.confirm('Очистить всю таблицу лидеров и онлайн-рейтинг для всех пользователей?')) {
                    onClearAllLeaderboard();
                    sounds.playClick();
                  }
                }}
                title="Очистить всю таблицу лидеров"
                className="text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 text-xs flex items-center gap-1.5 transition-colors px-2.5 py-1 rounded-xl border border-slate-800 hover:border-rose-500/30 font-semibold cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden sm:inline">Очистить весь рейтинг</span>
              </button>
            )}
            {onClearRating && !onClearAllLeaderboard && (
              <button
                onClick={() => {
                  if (window.confirm('Сбросить ваши индивидуальные результаты в рейтинге?')) {
                    onClearRating();
                    sounds.playClick();
                  }
                }}
                title="Сбросить локальные результаты"
                className="text-slate-500 hover:text-rose-400 text-xs flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-rose-500/10 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Сброс</span>
              </button>
            )}
          </div>
        </div>

        {activeTab === 'leaderboard' && (
          <>
            {/* Filter Tabs */}
            <div className="space-y-2 mb-3 bg-slate-950/40 p-2.5 rounded-2xl border border-slate-800/80">
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
                    className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
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
                    className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
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
                          ? 'bg-cyan-950/50 border-cyan-500/80 ring-1 ring-cyan-500/30 shadow-md'
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
          </>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {historyLogs.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-sm">
                У вас пока нет сыгранных игр. Пройдите первый квиз!
              </div>
            ) : (
              historyLogs.map((log) => (
                <div key={log.id} className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>{getCategoryName(log.category)}</span>
                        <span className="text-slate-500">·</span>
                        <span className="text-slate-400 font-normal">{getAgeLabel(log.ageGroup)}</span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {log.dateStr} · Верно: {log.correctCount}/{log.totalCount} ({log.accuracy}%)
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-black text-amber-400">+{log.score} XP</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

