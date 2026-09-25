import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Question, AgeTierInfo } from '../types';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Clock, Zap, CheckCircle2, XCircle, ArrowRight, Lightbulb, RotateCcw } from 'lucide-react';
import { ConfirmExitModal } from './ConfirmExitModal';

interface QuizScreenProps {
  questions: Question[];
  ageTier: AgeTierInfo;
  onFinishQuiz: (stats: {
    score: number;
    correctCount: number;
    totalCount: number;
    bestStreak: number;
    fastestAnswerTime: number;
  }) => void;
  onExit: () => void;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({
  questions,
  ageTier,
  onFinishQuiz,
  onExit
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [fastestTime, setFastestTime] = useState(999);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Timer states
  const [timeLeft, setTimeLeft] = useState(ageTier.timeLimitSeconds);
  const startTimeRef = useRef<number>(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentQuestion = questions[currentIndex];
  const progressPercent = ((currentIndex + 1) / questions.length) * 100;
  const timePercent = (timeLeft / ageTier.timeLimitSeconds) * 100;

  // Question timer effect
  useEffect(() => {
    if (isAnswered) return;

    setTimeLeft(ageTier.timeLimitSeconds);
    startTimeRef.current = Date.now();

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleTimeOut();
          return 0;
        }
        if (prev <= 4) {
          sounds.playTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isAnswered, ageTier.timeLimitSeconds]);

  const handleTimeOut = () => {
    if (isAnswered) return;
    setIsAnswered(true);
    setSelectedOption(-1); // Timeout indicator
    setStreak(0);
    sounds.playWrong();
  };

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;

    if (timerRef.current) clearInterval(timerRef.current);

    const timeSpent = Math.max(0.5, (Date.now() - startTimeRef.current) / 1000);
    if (timeSpent < fastestTime) {
      setFastestTime(timeSpent);
    }

    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === currentQuestion.correctIndex;

    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) {
        setBestStreak(newStreak);
      }
      setCorrectCount((prev) => prev + 1);

      // Points calculation
      const basePoints = Math.round(100 * ageTier.multiplier);
      const timeBonus = Math.round((timeLeft / ageTier.timeLimitSeconds) * 50 * ageTier.multiplier);
      const streakBonus = newStreak >= 5 ? 100 : newStreak >= 3 ? 50 : 0;
      const earned = basePoints + timeBonus + streakBonus;

      setScore((prev) => prev + earned);

      // Distinct sound effect for correct answer (with harmonic boost on streaks)
      sounds.playCorrect(newStreak);

      if (newStreak >= 3) {
        // Tiny celebratory confetti on streak
        confetti({
          particleCount: 25,
          spread: 45,
          origin: { y: 0.6 }
        });
      }
    } else {
      setStreak(0);
      // Distinct sound effect for wrong answer
      sounds.playWrong();
    }
  };

  const handleNextQuestion = () => {
    sounds.playClick();
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // Quiz complete
      onFinishQuiz({
        score,
        correctCount,
        totalCount: questions.length,
        bestStreak,
        fastestAnswerTime: fastestTime === 999 ? 5 : fastestTime
      });
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'vr':
        return { name: 'VR-квантум', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' };
      case 'robotics':
        return { name: 'Роботоквантум', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40' };
      case 'lego':
        return { name: 'LEGO Education', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
      default:
        return { name: 'Квантум', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40' };
    }
  };

  const catMeta = getCategoryLabel(currentQuestion.category);

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col min-h-[75vh]">
      {/* Top Header Controls & Metrics */}
      <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl p-4 border border-slate-800 shadow-xl mb-4">
        <div className="flex items-center justify-between gap-3 mb-3">
          {/* Back/Exit button */}
          <button
            id="quiz-exit-btn"
            type="button"
            onClick={() => {
              sounds.playClick();
              setShowExitConfirm(true);
            }}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 transition-all rounded-lg px-2.5 py-1.5 active:scale-95 cursor-pointer shadow-sm"
            title="Выйти в меню викторины"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Выйти</span>
          </button>

          {/* Category & Age badges */}
          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${catMeta.color}`}>
              {catMeta.name}
            </span>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {ageTier.ageRange}
            </span>
          </div>

          {/* Current Score & Streak */}
          <div className="flex items-center gap-2.5">
            {streak >= 2 && (
              <span className="animate-bounce inline-flex items-center gap-1 text-xs font-black px-2 py-0.5 rounded-full bg-amber-500 text-slate-950">
                🔥 x{streak}
              </span>
            )}
            <div className="text-right">
              <span className="text-xs text-slate-400 block leading-tight">Счёт</span>
              <span className="text-base sm:text-lg font-black text-amber-400 tabular-nums">
                {score} XP
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar & Question Counter */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
          <span>Вопрос {currentIndex + 1} из {questions.length}</span>
          <span className="text-cyan-400 font-semibold">{Math.round(progressPercent)}%</span>
        </div>
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Countdown Timer Bar */}
        <div className="flex items-center gap-2 text-xs font-medium">
          <Clock className={`w-4 h-4 ${timeLeft <= 5 ? 'text-rose-400 animate-pulse' : 'text-blue-400'}`} />
          <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${
                timeLeft <= 5 ? 'bg-rose-500' : timeLeft <= 10 ? 'bg-amber-400' : 'bg-cyan-400'
              }`}
              style={{ width: `${timePercent}%` }}
            />
          </div>
          <span className={`tabular-nums font-mono font-bold ${timeLeft <= 5 ? 'text-rose-400' : 'text-slate-300'}`}>
            {timeLeft}с
          </span>
        </div>
      </div>

      {/* Main Question Card with Smooth AnimatePresence Transitions */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl flex-1 flex flex-col justify-between mb-4 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id || currentIndex}
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -18, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 flex flex-col justify-between"
          >
            <div>
              {/* Question Image Visual */}
              {currentQuestion.imageUrl ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25 }}
                  className="relative w-full h-36 sm:h-48 md:h-56 mb-4 rounded-2xl overflow-hidden border border-slate-700/60 bg-slate-950/80 shadow-lg group"
                >
                  <img
                    src={currentQuestion.imageUrl}
                    alt={currentQuestion.question}
                    referrerPolicy="no-referrer"
                    loading="eager"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent pointer-events-none" />
                  {currentQuestion.imageHint && (
                    <div className="absolute bottom-2.5 left-3 px-2.5 py-1 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-700/60 text-base sm:text-lg shadow-md flex items-center gap-1.5 pointer-events-none">
                      <span>{currentQuestion.imageHint}</span>
                      <span className="text-xs text-slate-300 font-medium hidden sm:inline">К вопросу</span>
                    </div>
                  )}
                </motion.div>
              ) : currentQuestion.imageHint ? (
                <motion.div
                  initial={{ scale: 0.6, rotate: -8 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  className="mb-3 text-3xl sm:text-4xl inline-block"
                >
                  {currentQuestion.imageHint}
                </motion.div>
              ) : null}

              <motion.h2
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, delay: 0.05 }}
                className="text-lg sm:text-2xl font-bold text-white leading-snug mb-6 tracking-tight"
              >
                {currentQuestion.question}
              </motion.h2>

              {/* Options Grid with Staggered Entrance */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === currentQuestion.correctIndex;

                  let buttonStyle = 'bg-slate-800/80 hover:bg-slate-750 border-slate-700/80 text-slate-100 hover:border-cyan-500/50';

                  if (isAnswered) {
                    if (isCorrect) {
                      buttonStyle = 'bg-emerald-600/30 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/50 font-bold';
                    } else if (isSelected) {
                      buttonStyle = 'bg-rose-600/30 border-rose-500 text-rose-200 ring-2 ring-rose-500/50';
                    } else {
                      buttonStyle = 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-60';
                    }
                  }

                  return (
                    <motion.button
                      key={idx}
                      id={`quiz-option-${idx}`}
                      type="button"
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(idx)}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: isAnswered && isSelected ? (isCorrect ? [1, 1.03, 1] : [1, 0.97, 1]) : 1
                      }}
                      whileHover={!isAnswered ? { scale: 1.015, transition: { duration: 0.15 } } : {}}
                      whileTap={!isAnswered ? { scale: 0.985 } : {}}
                      transition={{
                        opacity: { duration: 0.2, delay: 0.06 * idx },
                        y: { duration: 0.22, delay: 0.06 * idx, ease: [0.22, 1, 0.36, 1] },
                        scale: { duration: 0.25 }
                      }}
                      className={`w-full min-h-[58px] p-4 rounded-2xl border text-left font-medium text-sm sm:text-base flex items-center justify-between gap-3 transition-colors duration-200 cursor-pointer ${buttonStyle}`}
                    >
                      <span className="flex-1">{option}</span>
                      {isAnswered && isCorrect && (
                        <motion.div
                          initial={{ scale: 0, rotate: -45 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                        >
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                        </motion.div>
                      )}
                      {isAnswered && isSelected && !isCorrect && (
                        <motion.div
                          initial={{ scale: 0, rotate: 45 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                        >
                          <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Educational Feedback Section (Revealed after answer with motion) */}
            <AnimatePresence>
              {isAnswered && (
                <motion.div
                  initial={{ opacity: 0, y: 16, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: 10, height: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-4 pt-4 border-t border-slate-800/80 overflow-hidden"
                >
                  <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 mb-4 shadow-lg shadow-cyan-950/30">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 shrink-0">
                        <Lightbulb className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-cyan-300 mb-1 flex items-center gap-1.5">
                          {selectedOption === currentQuestion.correctIndex ? (
                            <span className="text-emerald-400">Правильно! Молодец!</span>
                          ) : selectedOption === -1 ? (
                            <span className="text-amber-400">Время вышло! Разберём ответ:</span>
                          ) : (
                            <span className="text-rose-400">Не совсем верно! Запоминаем:</span>
                          )}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-2">
                          {currentQuestion.explanation}
                        </p>
                        <div className="text-[11px] text-cyan-200/90 font-mono bg-cyan-950/60 p-2 rounded-lg border border-cyan-800/40">
                          💡 <strong>Факт технопарка:</strong> {currentQuestion.fact}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Next Button */}
                  <div className="flex justify-end">
                    <motion.button
                      id="next-question-btn"
                      type="button"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.96 }}
                      transition={{ duration: 0.2 }}
                      onClick={handleNextQuestion}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-cyan-500/20 cursor-pointer"
                    >
                      <span>{currentIndex + 1 < questions.length ? 'Следующий вопрос' : 'Посмотреть результаты'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Confirmation Modal when clicking Exit */}
      <ConfirmExitModal
        isOpen={showExitConfirm}
        onConfirm={() => {
          setShowExitConfirm(false);
          onExit();
        }}
        onCancel={() => {
          setShowExitConfirm(false);
        }}
      />
    </div>
  );
};
