import { AgeGroup, AgeTierInfo, Question } from '../types';
import { VR_QUESTIONS } from './questions/vr';
import { ROBOTICS_QUESTIONS } from './questions/robotics';
import { LEGO_QUESTIONS } from './questions/lego';

export const AGE_TIERS: Record<AgeGroup, AgeTierInfo> = {
  kids: {
    id: 'kids',
    title: 'Младшие изобретатели',
    subtitle: 'Базовый уровень с подсказками',
    ageRange: '6–9 лет',
    timeLimitSeconds: 35,
    multiplier: 1.0,
    icon: '🚀',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    accentGradient: 'from-emerald-500 to-teal-600',
    description: 'Наглядные вопросы с яркими примерами, датчиками вокруг нас и основами LEGO WeDo.'
  },
  juniors: {
    id: 'juniors',
    title: 'Юные инженеры',
    subtitle: 'Инженерный уровень',
    ageRange: '10–13 лет',
    timeLimitSeconds: 25,
    multiplier: 1.5,
    icon: '⚡',
    badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    accentGradient: 'from-cyan-500 to-blue-600',
    description: 'Передачи и редукторы, датчики цвета и ультразвука, контроллеры и свобода движений 3DoF/6DoF.'
  },
  seniors: {
    id: 'seniors',
    title: 'Продвинутые резиденты',
    subtitle: 'Профи Квантума',
    ageRange: '14+ лет',
    timeLimitSeconds: 20,
    multiplier: 2.0,
    icon: '🧠',
    badgeColor: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    accentGradient: 'from-indigo-500 to-purple-600',
    description: 'Инверсная кинематика, SLAM-картография, оптический трекинг, частота кадров и крутящий момент.'
  }
};

export const QUESTIONS: Question[] = [
  ...VR_QUESTIONS,
  ...ROBOTICS_QUESTIONS,
  ...LEGO_QUESTIONS
];

/**
 * Shuffles the 4 options of a question randomly and adjusts correctIndex accordingly.
 */
export function shuffleQuestionOptions(q: Question): Question {
  const indexed = q.options.map((opt, idx) => ({
    opt,
    isCorrect: idx === q.correctIndex
  }));

  // Fisher-Yates shuffle
  for (let i = indexed.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indexed[i], indexed[j]] = [indexed[j], indexed[i]];
  }

  return {
    ...q,
    options: indexed.map((item) => item.opt),
    correctIndex: indexed.findIndex((item) => item.isCorrect)
  };
}

export { VR_QUESTIONS, ROBOTICS_QUESTIONS, LEGO_QUESTIONS };
