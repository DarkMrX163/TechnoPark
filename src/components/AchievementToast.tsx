import React from 'react';
import { Achievement } from '../types';
import { Award, X } from 'lucide-react';

interface AchievementToastProps {
  achievement: Achievement | null;
  onDismiss: () => void;
}

export const AchievementToast: React.FC<AchievementToastProps> = ({
  achievement,
  onDismiss
}) => {
  if (!achievement) return null;

  return (
    <div className="fixed top-20 right-4 z-50 max-w-sm w-full animate-in slide-in-from-top-4 duration-300">
      <div className="bg-slate-900 border-2 border-amber-400 rounded-2xl p-4 shadow-2xl shadow-amber-500/20 flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-2xl shrink-0">
          {achievement.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-amber-400 text-xs font-black uppercase tracking-wider mb-0.5">
            <Award className="w-3.5 h-3.5" />
            <span>Достижение разблокировано!</span>
          </div>
          <h4 className="text-sm font-bold text-white truncate">
            {achievement.title}
          </h4>
          <p className="text-xs text-slate-300 leading-snug">
            {achievement.description}
          </p>
        </div>
        <button
          onClick={onDismiss}
          className="text-slate-400 hover:text-white p-1 rounded-lg"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
