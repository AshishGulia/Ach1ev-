import React, { useState, useEffect, useRef } from 'react';
import { SubjectCourse, DesignId } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { AchievBrand } from './AchievBrand';
import { subscribePwaInstall, triggerPwaInstall } from '../../utils/pwaInstall';
import {
  Eye,
  Sun,
  Moon,
  X,
  Settings,
  LogOut,
  LogIn,
  Cloud,
  CloudOff,
  HardDrive,
  RefreshCw,
  Sparkles,
  Download,
  Headphones,
  Volume2,
  VolumeX,
  Music,
  Play,
  Square as StopSquare,
  ChevronDown,
  Menu,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from 'lucide-react';

export interface SoothingSoundItem {
  id: string;
  name: string;
  category: 'Nature' | 'Classical' | 'Instruments' | 'Soft Ambient';
  icon: string;
  desc: string;
}

export const SOOTHING_SOUNDS_20: SoothingSoundItem[] = [
  // Category 1: Nature & Rain
  { id: 'pink-rain', name: 'Pink Rain on Leaves', category: 'Nature', icon: '🌧️', desc: 'Gentle continuous rainfall on broad study leaves' },
  { id: 'ocean-surf', name: 'Ocean Wave Breakers', category: 'Nature', icon: '🌊', desc: 'Rhythmic rolling sea foam and distant surf' },
  { id: 'forest-wind', name: 'Forest Canopy Wind', category: 'Nature', icon: '🌲', desc: 'Soft alpine breeze through pine branches' },
  { id: 'mountain-brook', name: 'Mountain Brook', category: 'Nature', icon: '🏞️', desc: 'Crystal stream bubbling over smooth pebbles' },
  { id: 'night-crickets', name: 'Night Crickets & Fireflies', category: 'Nature', icon: '🦗', desc: 'Evening countryside calm under open stars' },

  // Category 2: Classical Strings
  { id: 'cello-suite', name: 'Cello Suite in G', category: 'Classical', icon: '🎻', desc: 'Deep resonant wooden cello sustained drone' },
  { id: 'violin-adagio', name: 'Violin Adagio', category: 'Classical', icon: '🎼', desc: 'Slow, soulful vibrato strings for clinical calm' },
  { id: 'renaissance-lute', name: 'Renaissance Lute', category: 'Classical', icon: '🪕', desc: 'Intimate plucked antique strings in quiet parlor' },
  { id: 'harp-reverie', name: 'Harp Reverie', category: 'Classical', icon: '🪉', desc: 'Ethereal cascading arpeggios that quiet thoughts' },
  { id: 'string-quartet', name: 'String Quartet Flow', category: 'Classical', icon: '🎻', desc: 'Lush 4-part harmonic bed of violas and cellos' },

  // Category 3: Instruments & Keys
  { id: 'felt-piano', name: 'Felt Upright Piano', category: 'Instruments', icon: '🎹', desc: 'Muted acoustic felt hammers playing warm intervals' },
  { id: 'rhodes-chill', name: 'Rhodes Chill Chords', category: 'Instruments', icon: '🎶', desc: 'Velvet electric piano jazz chords with tape warmth' },
  { id: 'acoustic-guitar', name: 'Acoustic Guitar Picking', category: 'Instruments', icon: '🎸', desc: 'Gentle nylon-string meditation cadence' },
  { id: 'bamboo-flute', name: 'Bamboo Shakuhachi Flute', category: 'Instruments', icon: '🎋', desc: 'Breathy meditative Japanese bamboo tones' },
  { id: 'singing-bowl', name: 'Tibetan Singing Bowl', category: 'Instruments', icon: '🥣', desc: '432 Hz pure brass resonance that aligns focus' },

  // Category 4: Soft Slow Ambient
  { id: 'cozy-fireplace', name: 'Cozy Fireside Hearth', category: 'Soft Ambient', icon: '🔥', desc: 'Soft wood crackle and gentle ambient glow' },
  { id: 'soft-pink-noise', name: 'Soft Pink Noise', category: 'Soft Ambient', icon: '📻', desc: 'Scientific 1/f spectral slope for reading retention' },
  { id: 'theta-binaural', name: 'Deep Theta Waves (6 Hz)', category: 'Soft Ambient', icon: '🧠', desc: 'Subtle binaural beat for deep medical focus' },
  { id: 'lofi-vinyl', name: 'Lo-Fi Vinyl Warmth', category: 'Soft Ambient', icon: '💿', desc: 'Analog dust crackle, slow tape wow & flutter' },
  { id: 'zen-bell', name: 'Zen Monastery Bell', category: 'Soft Ambient', icon: '🔔', desc: 'Deep brass temple strike with long serene decay' },
];

interface WindowsHeaderProps {
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
  activeView:
    | 'home'
    | 'read'
    | 'notebooks'
    | 'explore-body'
    | 'library'
    | 'roster'
    | 'recycle-bin'
    | 'mnemonics'
    | 'leisure'
    | 'community'
    | 'make-note'
    | 'talk-to-dev'
    | 'settings';
  currentSubject: SubjectCourse;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  breakTimerCountdown: string;
  onTriggerEyeBreak: () => void;
  onOpenSettings: () => void;
  onOpenCloudSettings?: () => void;
  onLogout: () => void;
  activeDesign?: DesignId;
  onSelectDesign?: (design: DesignId) => void;
  onRevertChanges?: () => void;
  onOpenAskGemini?: () => void;
  onOpenAIStudioModal?: () => void;
}

export const WindowsHeader: React.FC<WindowsHeaderProps> = ({
  isSidebarOpen,
  onToggleSidebar,
  activeView,
  currentSubject,
  isDarkMode,
  onToggleDarkMode,
  breakTimerCountdown,
  onTriggerEyeBreak,
  onOpenSettings,
  onOpenCloudSettings,
  onLogout,
  onOpenAIStudioModal,
}) => {
  const { user, googleUser, syncStatus, lastSyncedAt, driveAccount, openAuthModal } = useAuth();
  const isSignedInAccount = Boolean(user || googleUser);
  const [canInstallApp, setCanInstallApp] = useState(false);

  // Global UI / Font Zoom (85% - 135%) for comfortable reading & mobile readability
  const [uiZoom, setUiZoom] = useState<number>(() => {
    try {
      const saved = parseInt(localStorage.getItem('ach1ev_ui_zoom_pct') || '100', 10);
      if (Number.isFinite(saved) && saved >= 80 && saved <= 135) return saved;
    } catch {}
    return 100;
  });
  const [isZoomMenuOpen, setIsZoomMenuOpen] = useState(false);
  const zoomMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const px = (16 * (uiZoom / 100)).toFixed(2);
      document.documentElement.style.fontSize = `${px}px`;
      localStorage.setItem('ach1ev_ui_zoom_pct', String(uiZoom));
    } catch {}
  }, [uiZoom]);

  useEffect(() => {
    return subscribePwaInstall(setCanInstallApp);
  }, []);
  // 20 Continuous Procedural Soothing Sounds State
  const [activeSoundId, setActiveSoundId] = useState<string | null>(null);
  const [isSoundMenuOpen, setIsSoundMenuOpen] = useState<boolean>(false);
  const [selectedSoundCategory, setSelectedSoundCategory] = useState<'All' | 'Nature' | 'Classical' | 'Instruments' | 'Soft Ambient'>('All');
  const soundMenuRef = useRef<HTMLDivElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const activeCleanupRef = useRef<(() => void) | null>(null);
  const soundSessionRef = useRef<number>(0);

  // Close sound & zoom dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (soundMenuRef.current && !soundMenuRef.current.contains(e.target as Node)) {
        setIsSoundMenuOpen(false);
      }
      if (zoomMenuRef.current && !zoomMenuRef.current.contains(e.target as Node)) {
        setIsZoomMenuOpen(false);
      }
    };
    if (isSoundMenuOpen || isZoomMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSoundMenuOpen, isZoomMenuOpen]);

  // Stop active procedural audio safely (isolated session closure, never races new sound)
  const stopSound = () => {
    soundSessionRef.current += 1;
    const cleanup = activeCleanupRef.current;
    activeCleanupRef.current = null;
    if (cleanup) {
      try {
        cleanup();
      } catch {}
    }
    setActiveSoundId(null);
  };

  useEffect(() => {
    return () => {
      activeCleanupRef.current?.();
      activeCleanupRef.current = null;
    };
  }, []);

  // Play procedural sound (all 20 sounds cleanly synthesized via isolated Web Audio graph)
  const playSound = async (soundId: string) => {
    stopSound();
    const mySession = ++soundSessionRef.current;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }
      if (soundSessionRef.current !== mySession) return;

      const sessionGain = ctx.createGain();
      const now = ctx.currentTime;
      sessionGain.gain.setValueAtTime(0.0005, now);
      sessionGain.gain.linearRampToValueAtTime(0.24, now + 0.65);
      sessionGain.connect(ctx.destination);

      const stoppable: Array<{ stop: () => void }> = [];
      const disconnectable: AudioNode[] = [sessionGain];
      const timers: number[] = [];

      const makePinkNoiseBuffer = (seconds = 5, crackleProb = 0, brownMix = 0) => {
        const len = Math.floor(ctx.sampleRate * seconds);
        const buf = ctx.createBuffer(2, len, ctx.sampleRate);
        const L = buf.getChannelData(0);
        const R = buf.getChannelData(1);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        let br = 0;
        for (let i = 0; i < len; i++) {
          const w1 = Math.random() * 2 - 1;
          const w2 = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + w1 * 0.0555179;
          b1 = 0.99332 * b1 + w1 * 0.0750759;
          b2 = 0.96900 * b2 + w1 * 0.1538520;
          b3 = 0.86650 * b3 + w1 * 0.3104856;
          b4 = 0.55000 * b4 + w1 * 0.5329522;
          b5 = -0.7616 * b5 - w1 * 0.0168980;
          const pink = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w1 * 0.5362) * 0.065;
          b6 = w1 * 0.115926;
          br = (br + 0.02 * w1) / 1.02;
          let crackleL = 0;
          let crackleR = 0;
          if (crackleProb > 0 && Math.random() < crackleProb) {
            crackleL = (Math.random() * 0.35 + 0.12) * (Math.random() > 0.5 ? 1 : -1);
          }
          if (crackleProb > 0 && Math.random() < crackleProb) {
            crackleR = (Math.random() * 0.35 + 0.12) * (Math.random() > 0.5 ? 1 : -1);
          }
          const baseL = pink * (1 - brownMix) + br * 0.25 * brownMix;
          const baseR = (pink + (w2 * 0.018)) * (1 - brownMix) + br * 0.25 * brownMix;
          L[i] = Math.max(-0.9, Math.min(0.9, baseL + crackleL));
          R[i] = Math.max(-0.9, Math.min(0.9, baseR + crackleR));
        }
        return buf;
      };

      const startNoiseBed = (opts: { filterType: BiquadFilterType; freq: number; q?: number; lfoRate?: number; lfoDepth?: number; gainVal?: number; crackleProb?: number; brownMix?: number }) => {
        const src = ctx.createBufferSource();
        src.buffer = makePinkNoiseBuffer(5, opts.crackleProb || 0, opts.brownMix || 0);
        src.loop = true;
        const filt = ctx.createBiquadFilter();
        filt.type = opts.filterType;
        filt.frequency.setValueAtTime(opts.freq, now);
        if (opts.q) filt.Q.setValueAtTime(opts.q, now);
        const subGain = ctx.createGain();
        subGain.gain.setValueAtTime(opts.gainVal ?? 1, now);
        src.connect(filt);
        filt.connect(subGain);
        subGain.connect(sessionGain);
        if (opts.lfoRate && opts.lfoDepth) {
          const lfo = ctx.createOscillator();
          const lg = ctx.createGain();
          lfo.frequency.setValueAtTime(opts.lfoRate, now);
          lg.gain.setValueAtTime(opts.lfoDepth, now);
          lfo.connect(lg);
          lg.connect(filt.frequency);
          lfo.start();
          stoppable.push(lfo);
          disconnectable.push(lfo, lg);
        }
        src.start();
        stoppable.push(src);
        disconnectable.push(src, filt, subGain);
      };

      const triggerNote = (freq: number, dur = 1.6, vol = 0.22, wave: OscillatorType = 'sine', cutoff = 1800) => {
        if (soundSessionRef.current !== mySession) return;
        const t = ctx.currentTime;
        const o = ctx.createOscillator();
        const o2 = ctx.createOscillator();
        const f = ctx.createBiquadFilter();
        const g = ctx.createGain();
        o.type = wave;
        o.frequency.setValueAtTime(freq, t);
        o2.type = 'sine';
        o2.frequency.setValueAtTime(freq * 2, t);
        const g2 = ctx.createGain();
        g2.gain.setValueAtTime(0.18, t);
        f.type = 'lowpass';
        f.frequency.setValueAtTime(cutoff, t);
        g.gain.setValueAtTime(0.0005, t);
        g.gain.linearRampToValueAtTime(vol, t + 0.035);
        g.gain.exponentialRampToValueAtTime(0.0005, t + dur);
        o.connect(f);
        o2.connect(g2);
        g2.connect(f);
        f.connect(g);
        g.connect(sessionGain);
        o.start(t);
        o2.start(t);
        o.stop(t + dur + 0.05);
        o2.stop(t + dur + 0.05);
      };

      switch (soundId) {
        case 'pink-rain':
          startNoiseBed({ filterType: 'lowpass', freq: 1150, lfoRate: 0.08, lfoDepth: 200, gainVal: 0.95 });
          startNoiseBed({ filterType: 'bandpass', freq: 2400, q: 1.4, gainVal: 0.25, crackleProb: 0.00035 });
          break;
        case 'ocean-surf':
          startNoiseBed({ filterType: 'lowpass', freq: 440, lfoRate: 0.11, lfoDepth: 280, gainVal: 1.15, brownMix: 0.55 });
          break;
        case 'forest-wind':
          startNoiseBed({ filterType: 'bandpass', freq: 420, q: 2.0, lfoRate: 0.14, lfoDepth: 190, gainVal: 1.05 });
          break;
        case 'mountain-brook': {
          startNoiseBed({ filterType: 'bandpass', freq: 1450, q: 1.1, lfoRate: 0.28, lfoDepth: 420, gainVal: 0.72 });
          const id = window.setInterval(() => {
            const bf = 600 + Math.random() * 1100;
            triggerNote(bf, 0.24, 0.08, 'sine', 2200);
          }, 260);
          timers.push(id);
          break;
        }
        case 'night-crickets': {
          startNoiseBed({ filterType: 'lowpass', freq: 340, gainVal: 0.45, brownMix: 0.65 });
          const chirp = () => {
            if (soundSessionRef.current !== mySession) return;
            const pulses = 3 + Math.floor(Math.random() * 2);
            for (let k = 0; k < pulses; k++) {
              setTimeout(() => triggerNote(4100 + Math.random() * 160, 0.06, 0.06, 'sine', 5200), k * 75);
            }
          };
          chirp();
          timers.push(window.setInterval(chirp, 1900));
          break;
        }
        case 'cello-suite':
        case 'violin-adagio':
        case 'string-quartet': {
          const freqs =
            soundId === 'cello-suite'
              ? [98.0, 146.83, 196.0]
              : soundId === 'violin-adagio'
              ? [220.0, 277.18, 329.63]
              : [130.81, 196.0, 246.94, 329.63];
          const filt = ctx.createBiquadFilter();
          filt.type = 'lowpass';
          filt.frequency.setValueAtTime(soundId === 'cello-suite' ? 380 : 720, now);
          const lfo = ctx.createOscillator();
          const lg = ctx.createGain();
          lfo.frequency.setValueAtTime(4.2, now);
          lg.gain.setValueAtTime(1.4, now);
          lfo.connect(lg);
          lfo.start();
          stoppable.push(lfo);
          disconnectable.push(filt, lfo, lg);
          freqs.forEach((f, idx) => {
            const osc = ctx.createOscillator();
            osc.type = idx % 2 === 0 ? 'sawtooth' : 'triangle';
            osc.frequency.setValueAtTime(f, now);
            lg.connect(osc.frequency);
            const g = ctx.createGain();
            g.gain.setValueAtTime(0.18 / freqs.length, now);
            osc.connect(g);
            g.connect(filt);
            osc.start();
            stoppable.push(osc);
            disconnectable.push(osc, g);
          });
          filt.connect(sessionGain);
          break;
        }
        case 'renaissance-lute':
        case 'harp-reverie':
        case 'acoustic-guitar':
        case 'felt-piano': {
          const scales: Record<string, number[]> = {
            'renaissance-lute': [220, 261.63, 293.66, 329.63, 392, 440],
            'harp-reverie': [261.63, 293.66, 329.63, 392, 440, 523.25, 587.33],
            'acoustic-guitar': [164.81, 220, 261.63, 329.63, 392, 440],
            'felt-piano': [196, 246.94, 293.66, 329.63, 392, 440, 523.25],
          };
          const notes = scales[soundId] || scales['felt-piano'];
          let step = 0;
          const stepMs = soundId === 'harp-reverie' ? 580 : soundId === 'felt-piano' ? 1450 : 760;
          const wave: OscillatorType = soundId === 'felt-piano' ? 'sine' : 'triangle';
          const cutoff = soundId === 'felt-piano' ? 880 : 1450;
          const playNext = () => {
            const f = notes[(step + Math.floor(Math.random() * 2)) % notes.length];
            step += 1;
            triggerNote(f, stepMs / 650 + 0.8, 0.24, wave, cutoff);
          };
          playNext();
          timers.push(window.setInterval(playNext, stepMs));
          break;
        }
        case 'rhodes-chill': {
          const chord = [174.61, 220.0, 261.63, 329.63]; // Fmaj7
          const filt = ctx.createBiquadFilter();
          filt.type = 'lowpass';
          filt.frequency.setValueAtTime(750, now);
          const trem = ctx.createGain();
          trem.gain.setValueAtTime(0.6, now);
          const lfo = ctx.createOscillator();
          const lg = ctx.createGain();
          lfo.frequency.setValueAtTime(1.8, now);
          lg.gain.setValueAtTime(0.2, now);
          lfo.connect(lg);
          lg.connect(trem.gain);
          lfo.start();
          stoppable.push(lfo);
          disconnectable.push(filt, trem, lfo, lg);
          chord.forEach((f) => {
            const osc = ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, now);
            const g = ctx.createGain();
            g.gain.setValueAtTime(0.14, now);
            osc.connect(g);
            g.connect(filt);
            osc.start();
            stoppable.push(osc);
            disconnectable.push(osc, g);
          });
          filt.connect(trem);
          trem.connect(sessionGain);
          break;
        }
        case 'bamboo-flute': {
          startNoiseBed({ filterType: 'bandpass', freq: 920, q: 6, lfoRate: 0.2, lfoDepth: 160, gainVal: 0.22 });
          const fluteScale = [392.0, 440.0, 493.88, 587.33, 659.25];
          const playPhrase = () => {
            const f = fluteScale[Math.floor(Math.random() * fluteScale.length)];
            triggerNote(f, 2.8, 0.19, 'sine', 1600);
          };
          playPhrase();
          timers.push(window.setInterval(playPhrase, 2400));
          break;
        }
        case 'singing-bowl':
        case 'zen-bell': {
          const base = soundId === 'singing-bowl' ? 432 : 196;
          const strike = () => {
            triggerNote(base, 5.2, 0.22, 'sine', 2400);
            triggerNote(base * 2.008, 4.4, 0.08, 'sine', 2600);
            triggerNote(base * 1.5, 3.8, 0.06, 'sine', 2000);
          };
          strike();
          timers.push(window.setInterval(strike, soundId === 'singing-bowl' ? 4500 : 6000));
          break;
        }
        case 'cozy-fireplace':
          startNoiseBed({ filterType: 'lowpass', freq: 380, lfoRate: 0.35, lfoDepth: 140, gainVal: 0.9, crackleProb: 0.0011, brownMix: 0.7 });
          break;
        case 'soft-pink-noise':
          startNoiseBed({ filterType: 'lowpass', freq: 1100, gainVal: 0.85 });
          break;
        case 'theta-binaural': {
          const merger = ctx.createChannelMerger(2);
          const oscL = ctx.createOscillator();
          const oscR = ctx.createOscillator();
          const gL = ctx.createGain();
          const gR = ctx.createGain();
          oscL.type = 'sine';
          oscR.type = 'sine';
          oscL.frequency.setValueAtTime(200, now);
          oscR.frequency.setValueAtTime(206, now); // True 6 Hz Theta differential
          gL.gain.setValueAtTime(0.32, now);
          gR.gain.setValueAtTime(0.32, now);
          oscL.connect(gL);
          gL.connect(merger, 0, 0);
          oscR.connect(gR);
          gR.connect(merger, 0, 1);
          merger.connect(sessionGain);
          oscL.start();
          oscR.start();
          stoppable.push(oscL, oscR);
          disconnectable.push(merger, oscL, oscR, gL, gR);
          break;
        }
        case 'lofi-vinyl': {
          startNoiseBed({ filterType: 'bandpass', freq: 1400, q: 0.7, gainVal: 0.32, crackleProb: 0.0008, brownMix: 0.35 });
          const loFiNotes = [261.63, 329.63, 392.0, 493.88];
          let li = 0;
          const playChord = () => {
            triggerNote(loFiNotes[li % loFiNotes.length], 2.2, 0.14, 'triangle', 900);
            li += 1;
          };
          playChord();
          timers.push(window.setInterval(playChord, 1650));
          break;
        }
        default:
          startNoiseBed({ filterType: 'lowpass', freq: 850, gainVal: 0.85 });
          break;
      }

      activeCleanupRef.current = () => {
        timers.forEach((id) => window.clearInterval(id));
        try {
          const t = ctx.currentTime;
          sessionGain.gain.cancelScheduledValues(t);
          sessionGain.gain.setValueAtTime(Math.max(0.0005, sessionGain.gain.value), t);
          sessionGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
        } catch {}
        window.setTimeout(() => {
          stoppable.forEach((n) => {
            try { n.stop(); } catch {}
          });
          disconnectable.forEach((n) => {
            try { n.disconnect(); } catch {}
          });
        }, 210);
      };

      setActiveSoundId(soundId);
      setIsSoundMenuOpen(false);
    } catch (e) {
      console.warn('Audio playback fallback', e);
    }
  };

  // Toggle sound button click:
  // If playing -> stops with single click without re-opening menu!
  // If stopped -> opens menu
  const handleMainSoundButtonClick = () => {
    if (activeSoundId) {
      stopSound();
    } else {
      setIsSoundMenuOpen(!isSoundMenuOpen);
    }
  };

  const activeSoundObj = SOOTHING_SOUNDS_20.find((s) => s.id === activeSoundId);

  const getViewTitle = () => {
    switch (activeView) {
      case 'home':
        return 'Cockpit';
      case 'read':
        return 'Read';
      case 'notebooks':
      case 'make-note':
        return 'Create note';
      case 'explore-body':
      case 'library':
        return 'Shelf';
      case 'talk-to-dev':
        return 'Talk to Developer';
      case 'community':
        return 'Community';
      case 'mnemonics':
        return 'Mnemonics';
      case 'leisure':
        return 'Leisure';
      case 'roster':
        return 'Calendar';
      case 'recycle-bin':
        return 'Trash';
      case 'settings':
        return 'Settings';
      default:
        return 'Cockpit';
    }
  };

  return (
    <header className="themed-glass-bar h-12 px-2.5 sm:px-5 flex items-center justify-between gap-2 border-b border-stone-200/80 dark:border-[#342318] bg-[#fdfcfa]/90 dark:bg-[#140e0a]/92 backdrop-blur-md select-none z-20 text-xs transition-colors">
      
      {/* Left: View Breadcrumb & Mobile Menu Toggle */}
      <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 flex-1 overflow-hidden">
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar menu"
            className="p-1.5 rounded-lg hover:bg-stone-200/70 dark:hover:bg-[#261a12] text-stone-700 dark:text-[#d8c7b0] md:hidden transition-colors shrink-0 cursor-pointer"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}
        <div className="flex items-center gap-1.5 sm:gap-2.5 text-stone-500 dark:text-[#a9927b] font-mono text-[11px] min-w-0">
          <AchievBrand
            variant="inline"
            isDarkMode={isDarkMode}
            showTagline={!isSidebarOpen}
            className={isSidebarOpen ? 'md:hidden shrink-0' : 'shrink-0'}
            imgClassName="w-5 h-5"
          />
          {!isSidebarOpen && (
            <span className="hidden sm:inline text-stone-300 dark:text-[#4b3322]">/</span>
          )}
          <span className="text-[12px] sm:text-[13px] font-semibold text-slate-800 dark:text-[#f2e7d6] truncate">
            {getViewTitle()}
          </span>
        </div>
      </div>

      {/* Right Column: Sign In Pill (left of Sounds), Soothing Sounds Icon, UI Zoom, Eye Logo, Dark Mode */}
      <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
        {/* Supabase Realtime Sync + Personal Google Drive Status Pill (left of Sounds per user request) */}
        <button
          type="button"
          onClick={() => {
            if (isSignedInAccount) {
              if (onOpenCloudSettings) onOpenCloudSettings();
              else onOpenSettings();
            } else {
              openAuthModal();
            }
          }}
          title={
            user
              ? `Cloud Account: ${user.email || 'Signed In'}${
                  lastSyncedAt ? ` · Last synced at ${new Date(lastSyncedAt).toLocaleTimeString()}` : ''
                }${driveAccount.connected ? ` · Drive: ${driveAccount.email || 'Connected'}` : ' · Click to configure Drive'}`
              : googleUser
              ? `Google Account: ${googleUser.email}${
                  driveAccount.connected ? ` · Drive: ${driveAccount.folderName || 'Connected'}` : ' · Click to manage Cloud & Drive'
                }`
              : 'Currently in Local Mode · Click to Sign In with Google or Email'
          }
          className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-xl border text-[10.5px] sm:text-[11px] font-medium transition-all cursor-pointer ${
            isSignedInAccount
              ? user && syncStatus === 'error'
                ? 'bg-[#7f1d1d]/15 border-[#962d32]/45 text-[#7f1d1d] dark:text-[#d97074]'
                : 'themed-soft-pill bg-amber-500/10 hover:bg-amber-500/15 border-amber-600/30 text-[#6e4520] dark:text-amber-300'
              : 'bg-stone-100 hover:bg-stone-200/80 dark:bg-[#211711] dark:hover:bg-[#2b1e15] border-stone-200/80 dark:border-[#382518] text-stone-600 dark:text-[#d8c7b0]'
          }`}
        >
          {user ? (
            syncStatus === 'syncing' || syncStatus === 'connecting' ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-500 shrink-0" />
            ) : syncStatus === 'error' ? (
              <CloudOff className="w-3.5 h-3.5 shrink-0" />
            ) : (
              <Cloud className="w-3.5 h-3.5 text-[#A47C43] dark:text-amber-400 shrink-0" />
            )
          ) : googleUser ? (
            <Cloud className="w-3.5 h-3.5 text-[#A47C43] dark:text-amber-400 shrink-0" />
          ) : (
            <CloudOff className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          )}
          <span className="font-mono font-semibold whitespace-nowrap">
            {user
              ? syncStatus === 'syncing'
                ? 'Syncing'
                : syncStatus === 'connecting'
                ? 'Connecting'
                : syncStatus === 'error'
                ? 'Sync Issue'
                : 'Live Sync'
              : googleUser
              ? googleUser.name?.split(' ')[0] || 'Google'
              : 'Sign In'}
          </span>
          {driveAccount.connected && (
            <span
              className="hidden sm:flex ml-0.5 pl-1.5 border-l border-current/25 items-center gap-1 text-[10px] text-amber-700 dark:text-amber-300"
              title={`Personal Google Drive Vault Connected (${driveAccount.folderName || 'Ach1ev Clinical Library'})`}
            >
              <HardDrive className="w-3 h-3" />
              <span className="hidden lg:inline">Drive</span>
            </span>
          )}
        </button>

        {/* 20 Soothing Sounds Mini Player (Icon only per user instruction: click -> opens list -> choose -> minimizes -> active icon -> click again to stop directly) */}
        <div className="relative" ref={soundMenuRef}>
          <div className="flex items-center">
            <button
              onClick={handleMainSoundButtonClick}
              title={
                activeSoundId
                  ? `Playing: ${activeSoundObj?.name} · Click to stop immediately`
                  : 'Soothing Peace Sounds (20 Unlimited Ambient, Classical & Instruments) · Click to choose'
              }
              aria-label="Soothing sounds"
              className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                activeSoundId
                  ? 'bg-amber-500/20 text-amber-600 dark:text-amber-300 border-amber-500/50 shadow-xs animate-pulse ring-2 ring-amber-500/30'
                  : 'text-stone-600 dark:text-[#d8c7b0] hover:text-slate-900 dark:hover:text-[#fff6e8] hover:bg-stone-100 dark:hover:bg-[#241912] border-stone-200/80 dark:border-[#382518]'
              }`}
            >
              {activeSoundId ? (
                /* Animated Equalizer Visualizer Bars */
                <span className="flex items-end gap-0.5 h-3.5 w-3.5 justify-center py-0.5" aria-hidden="true">
                  <span className="w-0.5 bg-amber-500 rounded-full animate-bounce h-2" style={{ animationDelay: '0ms' }} />
                  <span className="w-0.5 bg-amber-500 rounded-full animate-bounce h-3.5" style={{ animationDelay: '150ms' }} />
                  <span className="w-0.5 bg-amber-500 rounded-full animate-bounce h-2.5" style={{ animationDelay: '300ms' }} />
                </span>
              ) : (
                <Headphones className="w-4 h-4" />
              )}
            </button>

            {/* Quick dropdown arrow if playing to switch sound without stopping */}
            {activeSoundId && (
              <button
                onClick={() => setIsSoundMenuOpen(!isSoundMenuOpen)}
                title="Change active sound"
                className="p-1 -ml-1 text-amber-600 dark:text-amber-300 hover:opacity-100 opacity-80 cursor-pointer"
              >
                <ChevronDown className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Flyout List of 20 Sounds */}
          {isSoundMenuOpen && (
            <div className="themed-glass-card fixed sm:absolute right-3 sm:right-0 top-13 sm:top-11 w-[min(19rem,calc(100vw-24px))] sm:w-80 rounded-2xl bg-[#fdfcfa] dark:bg-[#1a120d] border border-stone-200 dark:border-[#3a271a] shadow-2xl p-3 z-50 text-stone-900 dark:text-[#efe4d4] animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-200/80 dark:border-[#352317]">
                <div className="flex items-center gap-1.5">
                  <Headphones className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-bold font-serif">20 Soothing Study Sounds</span>
                </div>
                {activeSoundId && (
                  <button
                    onClick={stopSound}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#7f1d1d]/12 text-[#6e1418] dark:bg-[#6e171b]/30 dark:text-[#d97074] border border-[#7f1d1d]/25 dark:border-[#962d32]/45 font-bold hover:bg-[#7f1d1d]/20 dark:hover:bg-[#6e171b]/45 transition-colors cursor-pointer"
                  >
                    Stop Sound
                  </button>
                )}
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1 pb-2 overflow-x-auto custom-scrollbar text-[10px]">
                {(['All', 'Nature', 'Classical', 'Instruments', 'Soft Ambient'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedSoundCategory(cat)}
                    className={`px-2 py-0.5 rounded-full shrink-0 font-medium transition-colors cursor-pointer ${
                      selectedSoundCategory === cat
                        ? 'bg-amber-500 text-white font-bold shadow-2xs'
                        : 'bg-stone-100 dark:bg-stone-800/80 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* List of Sounds */}
              <div className="space-y-1 max-h-64 overflow-y-auto custom-scrollbar pr-1">
                {SOOTHING_SOUNDS_20
                  .filter((s) => selectedSoundCategory === 'All' || s.category === selectedSoundCategory)
                  .map((sound) => {
                    const isSelected = activeSoundId === sound.id;
                    return (
                      <button
                        key={sound.id}
                        type="button"
                        onClick={() => playSound(sound.id)}
                        className={`w-full text-left p-2 rounded-xl flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500/20 border border-amber-500/50 shadow-2xs'
                            : 'hover:bg-stone-100 dark:hover:bg-[#261a12] border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <span className="text-base shrink-0">{sound.icon}</span>
                          <div className="truncate">
                            <span className={`text-xs block font-medium truncate ${isSelected ? 'font-bold text-amber-700 dark:text-amber-300' : ''}`}>
                              {sound.name}
                            </span>
                            <span className="text-[10px] text-stone-400 dark:text-stone-500 block truncate">
                              {sound.desc}
                            </span>
                          </div>
                        </div>

                        {isSelected ? (
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping shrink-0" />
                        ) : (
                          <Play className="w-3 h-3 text-stone-400 shrink-0 opacity-60" />
                        )}
                      </button>
                    );
                  })}
              </div>
            </div>
          )}
        </div>

        {/* Native PWA Install App Button (shown when browser supports installing Ach1ev as an App) */}
        {canInstallApp && (
          <button
            type="button"
            onClick={() => triggerPwaInstall()}
            title="Install Ach1ev as a desktop/mobile App"
            className="themed-soft-pill hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-800 dark:text-amber-300 border border-amber-500/35 text-[11px] font-semibold transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install App</span>
          </button>
        )}

        {/* Compact UI / Font Size Zoom Control (works smoothly on mobile & desktop) */}
        <div className="relative" ref={zoomMenuRef}>
          <button
            type="button"
            onClick={() => setIsZoomMenuOpen((v) => !v)}
            title={`Text & UI Zoom (${uiZoom}%)`}
            aria-label="Adjust text and interface size"
            className={`px-1.5 sm:px-2 py-1.5 rounded-xl border transition-colors cursor-pointer flex items-center gap-1 text-[10.5px] font-mono font-bold ${
              uiZoom !== 100
                ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/40'
                : 'text-stone-600 dark:text-[#d8c7b0] hover:text-slate-900 dark:hover:text-[#fff6e8] hover:bg-stone-100 dark:hover:bg-[#241912] border-stone-200/80 dark:border-[#382518]'
            }`}
          >
            <span>Aa</span>
            {uiZoom !== 100 && <span className="hidden sm:inline">{uiZoom}%</span>}
          </button>

          {isZoomMenuOpen && (
            <div className="themed-glass-card fixed sm:absolute right-3 sm:right-0 top-13 sm:top-11 w-56 rounded-2xl bg-[#fdfcfa] dark:bg-[#1a120d] border border-stone-200 dark:border-[#3a271a] shadow-2xl p-3 z-50 text-stone-900 dark:text-[#efe4d4] animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-200/80 dark:border-[#352317]">
                <span className="text-[11px] font-bold">Text &amp; UI Zoom</span>
                <span className="text-[10px] font-mono text-amber-700 dark:text-amber-300 font-bold">{uiZoom}%</span>
              </div>
              <div className="flex items-center justify-between gap-1.5">
                <button
                  type="button"
                  onClick={() => setUiZoom((z) => Math.max(80, z - 5))}
                  disabled={uiZoom <= 80}
                  className="flex-1 py-1.5 rounded-lg border border-stone-200 dark:border-[#382518] hover:bg-stone-100 dark:hover:bg-[#261a12] disabled:opacity-40 flex items-center justify-center cursor-pointer"
                  aria-label="Zoom out text"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setUiZoom(100)}
                  className="px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-[#382518] hover:bg-stone-100 dark:hover:bg-[#261a12] text-[10.5px] font-mono font-semibold flex items-center gap-1 cursor-pointer"
                  title="Reset zoom to 100%"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
                <button
                  type="button"
                  onClick={() => setUiZoom((z) => Math.min(135, z + 5))}
                  disabled={uiZoom >= 135}
                  className="flex-1 py-1.5 rounded-lg border border-stone-200 dark:border-[#382518] hover:bg-stone-100 dark:hover:bg-[#261a12] disabled:opacity-40 flex items-center justify-center cursor-pointer"
                  aria-label="Zoom in text"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Prominent Eye Logo Rest Button (Warm Caramel/Amber theme-matched) */}
        <button
          onClick={onTriggerEyeBreak}
          title={`20-20-20 Ocular Rest Timer (${breakTimerCountdown || 'Rest'} remaining) - Click to take eye break`}
          className="themed-soft-pill flex items-center gap-1 sm:gap-2 px-1.5 sm:px-2.5 py-1 sm:py-1.5 rounded-xl bg-[#A47C43]/15 hover:bg-[#A47C43]/25 text-[#6e4520] dark:text-amber-300 border border-[#A47C43]/40 transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-2xs"
        >
          <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-[#A47C43] dark:text-amber-400 animate-pulse stroke-[2.2]" />
          <span className="hidden xs:inline sm:inline text-[10.5px] sm:text-[11px] font-mono font-bold text-[#5c351c] dark:text-amber-200">
            {breakTimerCountdown}
          </span>
        </button>

        {/* Theme Toggle (Light / Dark Mode Button) */}
        <button
          onClick={onToggleDarkMode}
          title={isDarkMode ? 'Switch to Light Theme' : 'Switch to Coal Burnt Wood Dark'}
          className="p-1.5 sm:p-2 rounded-xl text-stone-600 dark:text-[#d8c7b0] hover:text-slate-900 dark:hover:text-[#fff6e8] hover:bg-stone-100 dark:hover:bg-[#241912] border border-stone-200/80 dark:border-[#382518] transition-colors cursor-pointer"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-700" />}
        </button>




      </div>
    </header>
  );
};
