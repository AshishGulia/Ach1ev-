import React, { useEffect, useState } from 'react';
import { Eye, Volume2, VolumeX, Check, SlidersHorizontal, X } from 'lucide-react';
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
  const [activeView, setActiveView] = useState<'timer' | 'settings'>('timer');
  const [secondsLeft, setSecondsLeft] = useState<number>(config.breakDurationSeconds);
  const [isBreathingIn, setIsBreathingIn] = useState<boolean>(true);
  const [isDimActive, setIsDimActive] = useState<boolean>(false);
  const [dimSecondsLeft, setDimSecondsLeft] = useState<number>(20);

  // Full Eye Rest Timers settings form (shifted directly inside Dashboard's Eye Timer button)
  const [breakForm, setBreakForm] = useState<BreakTimerConfig>(config);
  const [savedFeedback, setSavedFeedback] = useState<boolean>(false);

  // Sound chime with Web Audio API
  const playGentleChime = (soundOverride?: boolean) => {
    const enabled = soundOverride !== undefined ? soundOverride : config.soundEnabled;
    if (!enabled) return;
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
    } catch {
      // Audio autoplay policy
    }
  };

  useEffect(() => {
    if (isOpen) {
      setActiveView('timer');
      setBreakForm(config);
      setSecondsLeft(config.breakDurationSeconds);
      playGentleChime(config.soundEnabled);
    }
  }, [isOpen]);

  useEffect(() => {
    setBreakForm(config);
  }, [config]);

  useEffect(() => {
    if (!isOpen || activeView === 'settings') return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          playGentleChime();
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
  }, [isOpen, activeView]);

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

  const handleSaveBreak = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig(breakForm);
    setSecondsLeft(breakForm.breakDurationSeconds);
    if (breakForm.soundEnabled) {
      playGentleChime(true);
    }
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  if (!isOpen && !isDimActive) return null;

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="themed-glass-card bg-[#fcfbf8] dark:bg-[#18110c] border border-stone-200/90 dark:border-[#382518] rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 text-stone-900 dark:text-stone-100 relative overflow-hidden transition-colors">
            {/* Ambient background warm glows */}
            <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-[#A47C43]/14 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-[#8a5a3b]/14 blur-3xl pointer-events-none" />

            <button
              type="button"
              onClick={onClose}
              className="absolute right-5 top-5 p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-white transition-colors cursor-pointer"
              title="Dismiss break"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Top Mode Switcher: Live Eye Rest Timer vs Complete Eye Rest Timer Settings */}
            <div className="flex items-center justify-center mb-5 pr-6">
              <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-stone-100 dark:bg-[#120c08] border border-stone-200/80 dark:border-[#382518]">
                <button
                  type="button"
                  onClick={() => setActiveView('timer')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeView === 'timer'
                      ? 'themed-tab-active bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-xs'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Eye Rest Timer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView('settings')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeView === 'settings'
                      ? 'themed-tab-active bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-xs'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Timer Settings</span>
                </button>
              </div>
            </div>

            {activeView === 'timer' ? (
              <div className="text-center">
                {/* 20-20-20 Rule Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#A47C43]/15 text-[#6e4520] dark:text-amber-300 text-xs font-mono font-semibold border border-[#A47C43]/35 mb-4">
                  <Eye className="w-4 h-4 text-[#A47C43] dark:text-amber-400" />
                  <span>20-20-20 Rule · Every {config.intervalMinutes} Min</span>
                </div>

                {/* Breathing Guide Animation Circle */}
                <div className="relative w-40 h-40 mx-auto my-5 flex items-center justify-center">
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
                  Ease photoreceptor fatigue and replenish tear film. Blink naturally and relax ciliary muscles.
                </p>

                {/* Action Buttons */}
                <div className="mt-6 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => onSnooze(5)}
                    className="px-5 py-2.5 rounded-full border border-stone-300 dark:border-[#4b3322] hover:border-amber-600 text-stone-700 dark:text-stone-300 text-sm font-medium transition-colors cursor-pointer"
                  >
                    Snooze 5m
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="themed-accent-btn px-6 py-2.5 rounded-full bg-[#8a5a2b] hover:bg-[#6e4520] text-white text-sm font-medium shadow-md hover:shadow-lg transition-all cursor-pointer"
                  >
                    Dismiss Now
                  </button>
                </div>

                {/* Quick Footer Summary + Jump to Full Settings */}
                <div className="mt-6 pt-4 border-t border-stone-200/80 dark:border-[#352317] flex flex-wrap items-center justify-between gap-2 text-[11px] text-stone-500 dark:text-stone-400">
                  <button
                    type="button"
                    onClick={() => setActiveView('settings')}
                    className="flex items-center gap-1.5 text-amber-700 dark:text-amber-300 font-semibold hover:underline cursor-pointer"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>
                      Configure Interval ({config.intervalMinutes}m) &amp; Duration ({config.breakDurationSeconds}s)
                    </span>
                  </button>

                  <button
                    type="button"
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
            ) : (
              /* Full Eye Rest Timers Settings Layout Shifted Inside Dashboard Eye Button */
              <form onSubmit={handleSaveBreak} className="space-y-4 text-left">
                <div className="pb-2 border-b border-stone-200 dark:border-[#382518] flex items-center justify-between">
                  <h4 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>Eye Rest Timers</span>
                  </h4>
                  {savedFeedback && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                      Saved
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Study Interval Before Eye Rest:
                  </label>
                  <select
                    value={breakForm.intervalMinutes}
                    onChange={(e) =>
                      setBreakForm({ ...breakForm, intervalMinutes: Number(e.target.value) })
                    }
                    className="w-full bg-stone-50 dark:bg-[#140e0a] px-3 py-2.5 rounded-xl border border-stone-200 dark:border-[#382518] text-xs text-stone-800 dark:text-stone-200 outline-none focus:border-amber-500"
                  >
                    <option value={15}>Every 15 Minutes (High Screen Sensitivity)</option>
                    <option value={20}>Every 20 Minutes (Standard 20-20-20 Rule)</option>
                    <option value={30}>Every 30 Minutes</option>
                    <option value={45}>Every 45 Minutes (Extended Deep Work)</option>
                    <option value={60}>Every 60 Minutes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Break Duration:
                  </label>
                  <select
                    value={breakForm.breakDurationSeconds}
                    onChange={(e) =>
                      setBreakForm({ ...breakForm, breakDurationSeconds: Number(e.target.value) })
                    }
                    className="w-full bg-stone-50 dark:bg-[#140e0a] px-3 py-2.5 rounded-xl border border-stone-200 dark:border-[#382518] text-xs text-stone-800 dark:text-stone-200 outline-none focus:border-amber-500"
                  >
                    <option value={20}>20 Seconds (20ft distant focus)</option>
                    <option value={30}>30 Seconds</option>
                    <option value={60}>1 Minute</option>
                    <option value={120}>2 Minutes (Eye stretch + hydration)</option>
                    <option value={300}>5 Minutes</option>
                  </select>
                </div>

                <label className="flex items-center justify-between p-3.5 rounded-xl bg-stone-50 dark:bg-[#140e0a] border border-stone-200 dark:border-[#382518] cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span className="text-xs font-medium text-stone-800 dark:text-stone-200">
                      Tibetan Bowl Chime Sound Alert
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={breakForm.soundEnabled}
                    onChange={(e) =>
                      setBreakForm({ ...breakForm, soundEnabled: e.target.checked })
                    }
                    className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
                  />
                </label>

                <div className="flex items-center justify-between pt-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveView('timer')}
                    className="px-4 py-2 rounded-xl border border-stone-200 dark:border-[#382518] text-xs font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-[#251a12] transition-colors cursor-pointer"
                  >
                    Back to Rest Timer
                  </button>

                  <button
                    type="submit"
                    className="themed-accent-btn px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                  >
                    {savedFeedback && <Check className="w-3.5 h-3.5" />}
                    <span>{savedFeedback ? 'Saved!' : 'Save Timer Config'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 20-Second 50% Interface Dimming Overlay */}
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
