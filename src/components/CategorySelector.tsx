import React from 'react';
import { CategoryId } from '../types';
import { sounds } from '../utils/audio';
import { Glasses, Bot, Boxes, Shuffle, ArrowRight, BookOpen, UserCheck, GraduationCap, Award } from 'lucide-react';
import { VR_QUESTIONS, ROBOTICS_QUESTIONS, LEGO_QUESTIONS } from '../data/questions';

interface CategorySelectorProps {
  selectedCategory: CategoryId;
  onSelectCategory: (cat: CategoryId) => void;
  onStartQuiz: () => void;
  totalQuestionsCount: number;
  roundLength: number;
  onSelectRoundLength: (len: number) => void;
  participantName: string;
  participantSchool: string;
  onUpdateParticipantInfo: (name: string, school: string) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategory,
  onSelectCategory,
  onStartQuiz,
  totalQuestionsCount,
  roundLength,
  onSelectRoundLength,
  participantName,
  participantSchool,
  onUpdateParticipantInfo
}) => {
  const categories: {
    id: CategoryId;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    color: string;
    gradient: string;
    tags: string[];
    poolCount: number;
  }[] = [
    {
      id: 'vr',
      title: 'VR-технологии',
      subtitle: 'Виртуальная и дополненная реальность',
      icon: <Glasses className="w-6 h-6 text-cyan-400" />,
      color: 'border-cyan-500/40 text-cyan-400',
      gradient: 'from-cyan-950/60 to-blue-950/40',
      tags: ['Очки VR', '6DoF', 'Unity & AR', 'Трекинг'],
      poolCount: VR_QUESTIONS.length
    },
    {
      id: 'robotics',
      title: 'Робототехника',
      subtitle: 'Промробоквантум и датчики',
      icon: <Bot className="w-6 h-6 text-purple-400" />,
      color: 'border-purple-500/40 text-purple-400',
      gradient: 'from-purple-950/60 to-indigo-950/40',
      tags: ['Датчики', 'Сервоприводы', 'SLAM', 'Лидар'],
      poolCount: ROBOTICS_QUESTIONS.length
    },
    {
      id: 'lego',
      title: 'Легоконструирование',
      subtitle: 'Механика и роботы LEGO Mindstorms EV3, SPIKE & WeDo',
      icon: <Boxes className="w-6 h-6 text-amber-400" />,
      color: 'border-amber-500/40 text-amber-400',
      gradient: 'from-amber-950/60 to-orange-950/40',
      tags: ['Mindstorms EV3', 'Редукторы', 'SPIKE Prime', 'Датчики и порты'],
      poolCount: LEGO_QUESTIONS.length
    },
    {
      id: 'all',
      title: 'Квантум Микс',
      subtitle: 'Комплексный турнир по всем направлениям',
      icon: <Shuffle className="w-6 h-6 text-emerald-400" />,
      color: 'border-emerald-500/40 text-emerald-400',
      gradient: 'from-emerald-950/60 to-teal-950/40',
      tags: ['Все квантумы', 'Максимум XP', 'Главный зачёт'],
      poolCount: VR_QUESTIONS.length + ROBOTICS_QUESTIONS.length + LEGO_QUESTIONS.length
    }
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <label className="text-xs sm:text-sm font-semibold text-slate-300 uppercase tracking-wider">
          Выбор направления викторины
        </label>
        <span className="text-xs text-slate-400 flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
          В базе темы: <strong className="text-cyan-400">{totalQuestionsCount}</strong> вопросов
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              id={`category-${cat.id}`}
              type="button"
              onClick={() => {
                sounds.playClick();
                onSelectCategory(cat.id);
              }}
              className={`relative flex flex-col p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                isSelected
                  ? `bg-gradient-to-br ${cat.gradient} border-cyan-400/80 ring-2 ring-cyan-500/30 shadow-lg`
                  : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-800/40 hover:border-slate-700'
              } active:scale-[0.99]`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  {cat.icon}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {cat.poolCount} вопросов
                  </span>
                  {isSelected && (
                    <span className="px-2 py-0.5 rounded-full bg-cyan-500 text-slate-950 text-xs font-bold shadow-sm">
                      Выбрано
                    </span>
                  )}
                </div>
              </div>

              <h4 className="text-base font-bold text-white mb-1">
                {cat.title}
              </h4>
              <p className="text-xs text-slate-400 mb-3">
                {cat.subtitle}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-auto pt-2 border-t border-slate-800/50">
                {cat.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800/60 text-slate-300 border border-slate-700/50"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {/* Participant Profile Form for Certificate */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Award className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Данные участника для именного сертификата
          </h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold ml-auto">
            Сертификат по завершении
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="text-xs text-slate-300 font-semibold block mb-1.5 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Имя и Отчество</span>
              <span className="text-rose-400">*</span>
            </label>
            <input
              id="input-participant-name"
              type="text"
              value={participantName}
              onChange={(e) => onUpdateParticipantInfo(e.target.value, participantSchool)}
              placeholder="Например: Алексей Сергеевич"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 focus:border-cyan-400 text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-colors"
            />
          </div>

          <div>
            <label className="text-xs text-slate-300 font-semibold block mb-1.5 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Школа / Класс / Организация</span>
            </label>
            <input
              id="input-participant-school"
              type="text"
              value={participantSchool}
              onChange={(e) => onUpdateParticipantInfo(participantName, e.target.value)}
              placeholder="Например: МБОУ СОШ №10, 7А класс"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 focus:border-cyan-400 text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Round Length Selector & Start Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-300 font-semibold whitespace-nowrap">
            Длина раунда:
          </span>
          <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
            {[
              { label: '8 вопросов', value: 8 },
              { label: '12 вопросов', value: 12 },
              { label: 'Все вопросы', value: 0 }
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  sounds.playClick();
                  onSelectRoundLength(opt.value);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  roundLength === opt.value
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <button
          id="start-quiz-btn"
          type="button"
          onClick={() => {
            sounds.playClick();
            onStartQuiz();
          }}
          className="w-full sm:w-auto min-w-[240px] flex items-center justify-center gap-3 px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-extrabold text-base shadow-xl shadow-cyan-500/25 active:scale-95 transition-all cursor-pointer"
        >
          <span>Начать викторину</span>
          <ArrowRight className="w-5 h-5 animate-pulse" />
        </button>
      </div>
    </div>
  );
};
