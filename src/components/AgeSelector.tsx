import React from 'react';
import { AgeGroup } from '../types';
import { AGE_TIERS } from '../data/questions';
import { sounds } from '../utils/audio';
import { Clock, Zap } from 'lucide-react';

interface AgeSelectorProps {
  selectedAge: AgeGroup;
  onSelectAge: (age: AgeGroup) => void;
  disabled?: boolean;
}

export const AgeSelector: React.FC<AgeSelectorProps> = ({
  selectedAge,
  onSelectAge,
  disabled = false
}) => {
  const ageKeys: AgeGroup[] = ['kids', 'juniors', 'seniors'];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs sm:text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <span>Возрастная категория</span>
          <span className="text-slate-500 font-normal lowercase">(сложность адаптируется)</span>
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {ageKeys.map((key) => {
          const tier = AGE_TIERS[key];
          const isSelected = selectedAge === key;

          return (
            <button
              key={key}
              id={`age-tier-${key}`}
              type="button"
              disabled={disabled}
              onClick={() => {
                sounds.playClick();
                onSelectAge(key);
              }}
              className={`relative flex flex-col p-3.5 rounded-2xl text-left border transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-slate-800/90 border-cyan-400/80 shadow-lg shadow-cyan-500/10 ring-2 ring-cyan-500/30'
                  : 'bg-slate-900/50 border-slate-800 hover:bg-slate-800/50 hover:border-slate-700 text-slate-400'
              } ${disabled ? 'opacity-60 cursor-not-allowed' : 'active:scale-[0.98]'}`}
            >
              {/* Active Indicator Pip */}
              {isSelected && (
                <div className="absolute top-3 right-3 flex items-center justify-center w-5 h-5 rounded-full bg-cyan-500 text-slate-950 font-bold text-xs">
                  ✓
                </div>
              )}

              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-2xl" role="img" aria-label={tier.title}>
                  {tier.icon}
                </span>
                <div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-cyan-300">
                    {tier.ageRange}
                  </span>
                </div>
              </div>

              <h3 className={`text-sm sm:text-base font-bold mb-1 ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                {tier.title}
              </h3>

              <p className="text-xs text-slate-400 leading-relaxed mb-3 flex-1 line-clamp-2">
                {tier.description}
              </p>

              {/* Badges / Metrics */}
              <div className="flex items-center gap-3 pt-2 border-t border-slate-800/80 text-[11px] font-medium text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  {tier.timeLimitSeconds} сек
                </span>
                <span className="flex items-center gap-1 text-amber-300">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  x{tier.multiplier} XP
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
