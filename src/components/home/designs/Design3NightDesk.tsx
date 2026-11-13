import React, { useState, useEffect } from 'react';
import {
  SubjectCourse,
  StudyTask,
  Notebook,
  UserProfile,
} from '../../../types';
import {
  Search,
  CheckCircle2,
  Circle,
  Play,
  Pause,
  RotateCcw,
  Flame,
  Calendar as CalendarIcon,
  ExternalLink,
  Maximize2,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface Design3Props {
  userProfile: UserProfile;
  currentSubject: SubjectCourse;
  tasks: StudyTask[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (task: StudyTask) => void;
  notebooks: Notebook[];
  onOpenNotebook: (id: string) => void;
  onOpenStudio: (actionType?: string) => void;
  onOpenRosterModal: () => void;
}

export const Design3NightDesk: React.FC<Design3Props> = ({
  userProfile,
  currentSubject,
  tasks,
  onToggleTask,
  notebooks,
  onOpenNotebook,
  onOpenStudio,
  onOpenRosterModal,
}) => {
  // Anatomy view layer
  const [anatomyLayer, setAnatomyLayer] = useState<'Muscular' | 'Skeletal' | 'Organs' | 'Nervous'>('Muscular');

  // Focus Timer state (25:00)
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const timerProgress = ((25 * 60 - timerSeconds) / (25 * 60)) * 100;

  return (
    <div className="space-y-5 font-sans text-slate-100 bg-[#0d131a] p-4 md:p-6 rounded-3xl border border-slate-800 shadow-2xl">
      {/* Top Cockpit Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Good evening, Future Doctor
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-mono">
              Night Desk
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Small steps today. A healthier tomorrow.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search topics, notes, questions... Ctrl K"
              className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-[#16202c] border border-slate-700 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="hidden sm:block text-right">
            <p className="text-xs italic text-slate-300">
              "Discipline today treats possibilities tomorrow."
            </p>
            <span className="text-[10px] text-slate-500 font-mono">— Ach1ev · Settle Ideas</span>
          </div>
        </div>
      </div>

      {/* Top Row: Medical News + Human Anatomy Centerpiece + Focus Timer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Medical News Card (Span 3) */}
        <div className="lg:col-span-3 p-4 rounded-2xl bg-[#131b24] border border-slate-800 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <h2 className="text-xs font-bold uppercase tracking-wider text-white">
                Medical News
              </h2>
              <span className="text-xs text-cyan-400 hover:underline cursor-pointer flex items-center gap-1">
                See all →
              </span>
            </div>

            {/* News article */}
            <div className="space-y-2">
              <div className="w-full h-32 rounded-xl bg-gradient-to-br from-cyan-950 via-slate-900 to-indigo-950 border border-cyan-500/20 p-3 flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute right-0 top-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl pointer-events-none" />
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold w-fit">
                  RESEARCH · 2h ago
                </span>
                <div className="text-xs font-bold text-white leading-tight">
                  New mRNA platform shows broad protection against multiple coronavirus variants
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed pt-1">
                A global study reports a next-generation mRNA vaccine candidate that induces broader and longer-lasting immunity across variants.
              </p>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Nature Medicine</span>
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
          </div>
        </div>

        {/* Human Anatomy Centerpiece (Span 6) */}
        <div className="lg:col-span-6 p-4 rounded-2xl bg-[#131b24] border border-slate-800 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-800">
              <h2 className="text-xs font-bold uppercase tracking-wider text-white">
                Human Anatomy
              </h2>

              <div className="flex items-center gap-1 bg-[#0a0f16] p-1 rounded-lg border border-slate-800">
                {(['Muscular', 'Skeletal', 'Organs', 'Nervous'] as const).map((layer) => (
                  <button
                    key={layer}
                    onClick={() => setAnatomyLayer(layer)}
                    className={`px-2.5 py-1 text-xs rounded-md font-mono font-medium transition-colors ${
                      anatomyLayer === layer
                        ? 'bg-cyan-600 text-white font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {layer}
                  </button>
                ))}
                <button
                  onClick={() => onOpenStudio('explore-body')}
                  className="p-1 text-slate-400 hover:text-white ml-1"
                  title="Expand to Fullscreen Explorer"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Central Interactive Anatomy Display */}
            <div
              onClick={() => onOpenStudio('explore-body')}
              className="relative w-full h-56 rounded-xl bg-gradient-to-b from-[#0b1017] to-[#151f2b] border border-cyan-500/10 flex items-center justify-center cursor-pointer group overflow-hidden"
            >
              {/* Glowing anatomical figure representation */}
              <div className="relative flex flex-col items-center justify-center">
                <div className="w-20 h-44 bg-gradient-to-b from-cyan-400/80 via-blue-500/60 to-indigo-700/80 rounded-full blur-[2px] opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="absolute text-center">
                  <div className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold mb-1 shadow-lg">
                    {anatomyLayer} Layer
                  </div>
                </div>
              </div>

              {/* Callout Chips on Body */}
              <div className="absolute right-4 top-4 space-y-1.5 text-right">
                {['Head & Neck', 'Thorax', 'Abdomen', 'Upper Limb', 'Lower Limb'].map((part) => (
                  <div
                    key={part}
                    className="px-2 py-0.5 rounded bg-black/50 border border-slate-700 text-[10px] font-mono text-slate-300 hover:text-cyan-300 hover:border-cyan-500 transition-colors cursor-pointer"
                  >
                    {part}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Rotate · Zoom · Explore</span>
            <button
              onClick={() => onOpenStudio('explore-body')}
              className="text-cyan-400 hover:underline flex items-center gap-1 font-bold"
            >
              <span>Full 3D Suite</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Focus Timer (Span 3) */}
        <div className="lg:col-span-3 p-4 rounded-2xl bg-[#131b24] border border-slate-800 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <h2 className="text-xs font-bold uppercase tracking-wider text-white">
                Focus Timer
              </h2>
              <span className="text-[11px] font-mono text-cyan-400">Pomodoro ▾</span>
            </div>

            {/* Circular Ring Gauge */}
            <div className="flex flex-col items-center justify-center my-3">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="transparent"
                    stroke="#1e293b"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="transparent"
                    stroke="#06b6d4"
                    strokeWidth="8"
                    strokeDasharray="264"
                    strokeDashoffset={264 - (264 * timerProgress) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute text-center">
                  <div className="text-2xl font-bold font-mono text-white tracking-wider">
                    {formatTimer(timerSeconds)}
                  </div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-semibold">
                    Focus
                  </div>
                </div>
              </div>

              {/* Start / Pause Button */}
              <div className="flex items-center gap-2 mt-3 w-full">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="flex-1 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md"
                >
                  {isTimerRunning ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Start Focus</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setIsTimerRunning(false);
                    setTimerSeconds(25 * 60);
                  }}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 text-center">
            <p className="text-[10px] italic text-slate-400">
              "A focused mind builds extraordinary results."
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Row: Flashcards + Today's Tasks + Calendar + Study Streak */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
        {/* Flashcards (Span 3) */}
        <div className="lg:col-span-3 p-4 rounded-2xl bg-[#131b24] border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Flashcards
            </h3>
            <span className="text-xs text-cyan-400">→</span>
          </div>

          <div className="my-2">
            <div className="text-3xl font-mono font-bold text-white">42</div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">cards due today</p>
          </div>

          <button
            onClick={() => onOpenStudio('open-cal')}
            className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Play className="w-3 h-3 fill-cyan-400" />
            <span>Review Now</span>
          </button>
        </div>

        {/* Today's Tasks (Span 4) */}
        <div className="lg:col-span-4 p-4 rounded-2xl bg-[#131b24] border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Today's Tasks
              </h3>
              <span className="text-[11px] font-mono text-slate-400">
                {tasks.filter((t) => t.completed).length} / {tasks.length} completed
              </span>
            </div>

            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => onToggleTask(task.id)}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-800/60 cursor-pointer text-xs"
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                  <span className={`truncate ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                    {task.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Calendar (Span 2) */}
        <div className="lg:col-span-2 p-4 rounded-2xl bg-[#131b24] border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Calendar
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Apr 2025</span>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-mono text-slate-400">
            <span>Su</span>
            <span>Mo</span>
            <span>Tu</span>
            <span>We</span>
            <span>Th</span>
            <span>Fr</span>
            <span>Sa</span>
            <span className="col-span-2"></span>
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
            <span>6</span>
            <span>7</span>
            <span>8</span>
            <span>9</span>
            <span>10</span>
            <span>11</span>
            <span>12</span>
            <span>13</span>
            <span>14</span>
            <span className="rounded bg-cyan-600 text-white font-bold">15</span>
            <span>16</span>
            <span>17</span>
            <span>18</span>
            <span>19</span>
          </div>

          <button
            onClick={onOpenRosterModal}
            className="text-[11px] text-cyan-400 hover:underline pt-2 border-t border-slate-800 text-center font-mono"
          >
            Full Schedule
          </button>
        </div>

        {/* Study Streak (Span 3) */}
        <div className="lg:col-span-3 p-4 rounded-2xl bg-[#131b24] border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Study Streak
            </h3>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-mono font-bold text-amber-400">12</span>
              <div>
                <div className="text-sm font-bold text-white leading-tight">days</div>
                <div className="text-[10px] text-amber-300 font-mono">Keep going!</div>
              </div>
            </div>

            {/* Streak bars */}
            <div className="flex items-center gap-1.5 mt-3">
              {['M', 'Tu', 'W', 'Th', 'Fr', 'Sa', 'Su'].map((d, i) => (
                <div key={d} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className={`w-full h-5 rounded-sm ${
                      i < 5 ? 'bg-cyan-500' : 'bg-slate-700'
                    }`}
                  />
                  <span className="text-[9px] font-mono text-slate-500">{d}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 text-right">
            <span className="text-[10px] text-slate-400 italic">
              Better students. Brighter tomorrows.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
