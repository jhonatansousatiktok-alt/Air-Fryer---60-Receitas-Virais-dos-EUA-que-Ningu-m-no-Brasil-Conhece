import React, { useEffect } from 'react';
import { Play, Pause, RotateCcw, X, Bell, Plus, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ActiveTimer } from '../types/recipe';
import { formatTimerDisplay, playChimeSound } from '../utils/recipeUtils';

interface IntegratedTimerProps {
  timer: ActiveTimer | null;
  onUpdateRemaining: (seconds: number) => void;
  onTogglePlay: () => void;
  onAddMinute: () => void;
  onReset: () => void;
  onClose: () => void;
  onSelectRecipe?: (recipeId: number) => void;
}

export const IntegratedTimer: React.FC<IntegratedTimerProps> = ({
  timer,
  onUpdateRemaining,
  onTogglePlay,
  onAddMinute,
  onReset,
  onClose,
  onSelectRecipe,
}) => {
  const [completed, setCompleted] = React.useState(false);

  useEffect(() => {
    if (!timer) return;
    if (timer.remainingSeconds <= 0 && timer.isRunning) {
      setCompleted(true);
      playChimeSound();
      
      // Confetti burst
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.85 },
      });

      // Browser vibration if supported
      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200, 100, 400]);
      }
    } else if (timer.remainingSeconds > 0) {
      setCompleted(false);
    }
  }, [timer?.remainingSeconds, timer?.isRunning]);

  useEffect(() => {
    if (!timer || !timer.isRunning || timer.remainingSeconds <= 0) return;

    const interval = setInterval(() => {
      onUpdateRemaining(timer.remainingSeconds - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer?.isRunning, timer?.remainingSeconds, onUpdateRemaining]);

  if (!timer) return null;

  const percent = Math.min(100, Math.max(0, ((timer.totalSeconds - timer.remainingSeconds) / timer.totalSeconds) * 100));

  return (
    <div 
      className={`fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:w-96 z-40 rounded-3xl shadow-2xl transition-all duration-300 border ${
        completed
          ? 'bg-[#FAF0E6] border-[#C8521A] text-[#0F2942] animate-bounce'
          : 'bg-white/95 backdrop-blur-md border-[#E5DACD] text-[#0F2942]'
      } p-5`}
      role="region"
      aria-label="Cronômetro de preparo ativo"
    >
      {/* Progress Bar Top */}
      <div className="w-full bg-[#F5ECE0] h-2 rounded-full overflow-hidden mb-3.5 border border-[#EADCCE]">
        <div 
          className={`h-full transition-all duration-300 ${
            completed ? 'bg-[#3D5A3C]' : 'bg-gradient-to-r from-[#C8521A] to-[#E2692D]'
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#C8521A] truncate">
            <Flame className="w-4 h-4 shrink-0" />
            <button
              onClick={() => onSelectRecipe?.(timer.recipeId)}
              className="hover:underline truncate text-left font-serif text-sm"
              title="Ver detalhes da receita"
            >
              {timer.recipeTitle}
            </button>
          </div>
          <p className="text-xs text-[#64748B] truncate mt-0.5">{timer.label}</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <span className={`text-2xl font-mono font-black tracking-tight ${
              completed ? 'text-[#C8521A] animate-pulse' : 'text-[#0F2942]'
            }`}>
              {formatTimerDisplay(timer.remainingSeconds)}
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Fechar cronômetro"
            className="p-1.5 rounded-full text-[#94A3B8] hover:text-[#0F2942] hover:bg-[#F5EFE6] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Finished alert banner */}
      {completed && (
        <div className="mt-3 py-2 px-3.5 rounded-xl bg-[#C8521A] text-white font-bold text-xs flex items-center justify-between shadow-sm">
          <span className="flex items-center gap-1.5">
            <Bell className="w-4 h-4 animate-spin" />
            Tempo esgotado! Verifique sua Air Fryer.
          </span>
          <button
            onClick={onReset}
            className="underline text-[11px] hover:text-white/80 font-bold"
          >
            Reiniciar
          </button>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-between mt-3.5 pt-3 border-t border-[#F0E8DD]">
        <div className="flex items-center gap-1.5">
          <button
            onClick={onTogglePlay}
            aria-label={timer.isRunning ? 'Pausar cronômetro' : 'Continuar cronômetro'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 shadow-xs ${
              timer.isRunning
                ? 'bg-[#FAF5EE] hover:bg-[#F2E8DC] text-[#0F2942] border border-[#E5DACD]'
                : 'bg-[#C8521A] hover:bg-[#B34514] text-white'
            }`}
          >
            {timer.isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{timer.isRunning ? 'Pausar' : 'Continuar'}</span>
          </button>

          <button
            onClick={onReset}
            aria-label="Reiniciar cronômetro"
            className="p-1.5 rounded-xl bg-[#FAF5EE] hover:bg-[#F2E8DC] text-[#64748B] hover:text-[#0F2942] border border-[#E5DACD] transition"
            title="Reiniciar"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        <button
          onClick={onAddMinute}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#FAF5EE] hover:bg-[#F2E8DC] text-[#C8521A] border border-[#E9D0C1] transition active:scale-95 shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+1 min</span>
        </button>
      </div>
    </div>
  );
};
