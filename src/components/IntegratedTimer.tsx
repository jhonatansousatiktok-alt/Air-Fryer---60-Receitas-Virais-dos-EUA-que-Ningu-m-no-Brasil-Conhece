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
      className={`fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:w-96 z-40 rounded-2xl shadow-2xl transition-all duration-300 border ${
        completed
          ? 'bg-amber-950/95 border-amber-400 text-white animate-bounce'
          : 'bg-neutral-900/95 backdrop-blur-md border-neutral-750 text-neutral-100'
      } p-4`}
      role="region"
      aria-label="Cronômetro de preparo ativo"
    >
      {/* Progress Bar Top */}
      <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden mb-3">
        <div 
          className={`h-full transition-all duration-300 ${
            completed ? 'bg-amber-400' : 'bg-gradient-to-r from-amber-500 to-orange-500'
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 truncate">
            <Flame className="w-3.5 h-3.5 shrink-0" />
            <button
              onClick={() => onSelectRecipe?.(timer.recipeId)}
              className="hover:underline truncate text-left"
              title="Ver detalhes da receita"
            >
              {timer.recipeTitle}
            </button>
          </div>
          <p className="text-xs text-neutral-400 truncate mt-0.5">{timer.label}</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <span className={`text-2xl font-mono font-black tracking-tight ${
              completed ? 'text-amber-300 animate-pulse' : 'text-white'
            }`}>
              {formatTimerDisplay(timer.remainingSeconds)}
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Fechar cronômetro"
            className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Finished alert banner */}
      {completed && (
        <div className="mt-3 py-1.5 px-3 rounded-lg bg-amber-500 text-neutral-950 font-bold text-xs flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Bell className="w-4 h-4 animate-spin" />
            Tempo esgotado! Verifique sua Air Fryer.
          </span>
          <button
            onClick={onReset}
            className="underline text-[11px] hover:text-black font-semibold"
          >
            Reiniciar
          </button>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-neutral-800/80">
        <div className="flex items-center gap-1">
          <button
            onClick={onTogglePlay}
            aria-label={timer.isRunning ? 'Pausar cronômetro' : 'Continuar cronômetro'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition active:scale-95 ${
              timer.isRunning
                ? 'bg-neutral-800 text-amber-400 hover:bg-neutral-750'
                : 'bg-amber-600 text-white hover:bg-amber-500'
            }`}
          >
            {timer.isRunning ? (
              <>
                <Pause className="w-3.5 h-3.5" /> Pausar
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" /> Continuar
              </>
            )}
          </button>

          <button
            onClick={onAddMinute}
            aria-label="Adicionar 1 minuto"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-neutral-800 hover:bg-neutral-750 text-neutral-300 transition"
            title="+1 Minuto"
          >
            <Plus className="w-3.5 h-3.5" /> 1 min
          </button>
        </div>

        <button
          onClick={onReset}
          aria-label="Reiniciar tempo"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-neutral-400 hover:text-neutral-200 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Zerar
        </button>
      </div>
    </div>
  );
};
