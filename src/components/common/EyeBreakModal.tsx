import React, { useEffect, useState } from 'react';
import { Eye, Clock, Volume2, VolumeX, CheckCircle, RotateCcw, X } from 'lucide-react';
import { BreakTimerConfig } from '../../types';

interface EyeBreakModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: BreakTimerConfig;
  onUpdateConfig: (cfg: BreakTimerConfig) => void;
  onSnooze: (minutes: number) => void;
}

export const EyeBreakModal: React.FC<EyeBreakModalProps> = ({
  isOpen,
  onClose,
  config,
  onUpdateConfig,
  onSnooze,
}) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(config.breakDurationSeconds);
  const [isBreathingIn, setIsBreathingIn] = useState<boolean>(true);
  const [isDimActive, setIsDimActive] = useState<boolean>(false);
  const [dimSecondsLeft, setDimSecondsLeft] = useState<number>(20);

  // Sound chime with Web Audio API
  const playGentleChime = () => {
    if (!config.soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(528, ctx.currentTime); // Solfeggio 528 Hz healing chime
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.5);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 2.6);
    } catch (e) {
      // Audio autoplay policy
    }
  };

  useEffect(() => {
    if (isOpen) {
      setSecondsLeft(config.breakDurationSeconds);
      playGentleChime();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          playGentleChime();
          // Auto dismiss banner when timer finishes per user instruction
          setIsDimActive(false);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const breathInterval = setInterval(() => {
      setIsBreathingIn((prev) => !prev);
    }, 4000);

    return () => {
      clearInterval(timer);
      clearInterval(breathInterval);
    };
  }, [isOpen]);

  // 20-Second 50% Screen Dimming Countdown
  useEffect(() => {
    if (!isDimActive) return;

    const interval = setInterval(() => {
      setDimSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsDimActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isDimActive]);

  if (!isOpen && !isDimActive) return null;

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-[#fcfbf8] dark:bg-[#18110c] border border-stone-200/90 dark:border-[#382518] rounded-3xl shadow-2xl max-w-lg w-full p-8 text-center text-stone-900 dark:text-stone-100 relative overflow-hidden transition-colors">
            {/* Ambient background warm glows */}
            <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-[#A47C43]/14 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-[#8a5a3b]/14 blur-3xl pointer-events-none" />

            <button
              onClick={onClose}
              className="absolute right-5 top-5 p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-white transition-colors cursor-pointer"
              title="Dismiss break"
            >
              <X className="w-5 h-5" />
            </button>

            {/* 20-20-20 Rule Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#A47C43]/15 text-[#6e4520] dark:text-amber-300 text-xs font-mono font-semibold border border-[#A47C43]/35 mb-6">
              <Eye className="w-4 h-4 text-[#A47C43] dark:text-amber-400" />
              <span>20-20-20 Rule · 50% Screen Dimming Active</span>
            </div>

            {/* Breathing Guide Animation Circle */}
            <div className="relative w-44 h-44 mx-auto my-6 flex items-center justify-center">
              <div
                className={`absolute inset-0 rounded-full border-2 transition-all duration-4000 ease-in-out ${
                  isBreathingIn
                    ? 'scale-110 border-[#A47C43]/60 bg-[#A47C43]/12'
                    : 'scale-90 border-[#8a5a3b]/50 bg-[#8a5a3b]/10'
                }`}
              />
              <div className="relative z-10">
                <span className="text-5xl font-extrabold font-mono text-stone-900 dark:text-stone-50 tracking-tight">
                  {secondsLeft}s
                </span>
                <p className="text-xs font-serif text-[#8a5a3b] dark:text-amber-300 font-medium mt-1">
                  {isBreathingIn ? 'Inhale slowly...' : 'Exhale gently...'}
                </p>
              </div>
            </div>

            {/* Clinical Instruction */}
            <h3 className="text-xl font-bold font-serif mb-2 text-stone-900 dark:text-stone-100">
              Look 20 feet away into the distance
            </h3>
            <p className="text-sm text-stone-600 dark:text-stone-400 max-w-sm mx-auto leading-relaxed">
              Screen is dimmed 50% to ease photoreceptor strain. Blink naturally to replenish tear film and relax ciliary muscles.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex items-center justify-center gap-3">
              <button
                onClick={() => onSnooze(5)}
                className="px-5 py-2.5 rounded-full border border-stone-300 dark:border-[#4b3322] hover:border-amber-600 text-stone-700 dark:text-stone-300 text-sm font-medium transition-colors cursor-pointer"
              >
                Snooze 5m
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-full bg-[#8a5a2b] hover:bg-[#6e4520] text-white text-sm font-medium shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                Dismiss Now
              </button>
            </div>

            {/* Quick Settings Bar */}
            <div className="mt-8 pt-5 border-t border-stone-200/80 dark:border-[#352317] flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
              <div className="flex items-center gap-2">
                <span>Interval:</span>
                <select
                  value={config.intervalMinutes}
                  onChange={(e) => onUpdateConfig({ ...config, intervalMinutes: Number(e.target.value) })}
                  className="bg-stone-100 dark:bg-[#231912] text-stone-800 dark:text-stone-200 rounded-lg px-2.5 py-1 border border-stone-200 dark:border-[#382518] outline-none font-medium"
                >
                  <option value={15}>15 Min</option>
                  <option value={20}>20 Min (Standard)</option>
                  <option value={30}>30 Min</option>
                  <option value={45}>45 Min</option>
                </select>
              </div>

              <button
                onClick={() => onUpdateConfig({ ...config, soundEnabled: !config.soundEnabled })}
                className="flex items-center gap-1.5 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                {config.soundEnabled ? (
                  <Volume2 className="w-3.5 h-3.5 text-[#A47C43] dark:text-amber-400" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5 text-stone-400" />
                )}
                <span>Sound {config.soundEnabled ? 'On' : 'Off'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 20-Second 50% Interface Dimming Overlay per User Request */}
      {isDimActive && (
        <div className="fixed inset-0 z-[100] bg-black/50 pointer-events-none transition-opacity duration-700 flex items-start justify-center pt-8">
          <div className="pointer-events-auto bg-stone-900/95 text-stone-100 border border-stone-700/80 px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-3 backdrop-blur-md text-xs animate-in slide-in-from-top-4 duration-300">
            <Eye className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>
              Ocular Relaxation: Interface dimmed 50% for <b>{dimSecondsLeft}s</b>
            </span>
            <button
              type="button"
              onClick={() => setIsDimActive(false)}
              className="text-stone-300 hover:text-white text-[11px] font-semibold cursor-pointer bg-stone-800 hover:bg-stone-700 px-2.5 py-1 rounded-full transition-colors ml-1"
            >
              Restore Brightness ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
};
