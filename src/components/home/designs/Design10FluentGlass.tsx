import React, { useState } from 'react';
import {
  SubjectCourse,
  StudyTask,
  Notebook,
  UserProfile,
  OptionSlab,
  ClinicalReminder,
} from '../../../types';
import {
  Search,
  CheckCircle2,
  Circle,
  Eye,
  Bell,
  BellRing,
  BellOff,
  CheckSquare,
  ChevronRight,
  Clock,
  Plus,
  MoreHorizontal,
  ExternalLink,
  BookOpen,
  Calendar as CalendarIcon,
  CalendarDays,
  Video,
  FileSpreadsheet,
  Presentation,
  Globe,
  Settings,
  Flame,
  Layers,
  Sparkles,
  Sliders,
  Paperclip,
  Activity,
  Heart,
  Brain,
  Edit2,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Maximize2,
  Minimize2,
  Check,
} from 'lucide-react';
import { EditSlabModal } from '../EditSlabModal';
import { AskGeminiModal } from '../../common/AskGeminiModal';
import { EditReminderModal } from '../EditReminderModal';

interface Design10Props {
  userProfile: UserProfile;
  currentSubject?: SubjectCourse;
  onSelectSubject?: (subject: SubjectCourse) => void;
  tasks: StudyTask[];
  onToggleTask: (taskId: string) => void;
  onAddTask?: (task: StudyTask) => void;
  notebooks: Notebook[];
  onOpenNotebook: (id: string) => void;
  onOpenStudio: (actionType?: string) => void;
  onOpenRosterModal: () => void;
  onTriggerEyeBreak: () => void;
}

export const Design10FluentGlass: React.FC<Design10Props> = ({
  userProfile,
  currentSubject = 'Pharmacology',
  onSelectSubject,
  tasks,
  onToggleTask,
  onAddTask,
  notebooks,
  onOpenNotebook,
  onOpenStudio,
  onOpenRosterModal,
  onTriggerEyeBreak,
}) => {
  // Slabs state
  const [fluentSlabs, setFluentSlabs] = useState<OptionSlab[]>([
    {
      id: 'fs-1',
      title: 'Cardiovascular Pharmacotherapy',
      subtitle: 'ACEi, ARBs, Beta-Blockers & Antiarrhythmics',
      subject: currentSubject,
      iconName: 'Heart',
      badge: 'Core High-Yield',
      accentColor: 'indigo',
      enabled: true,
      linkAction: 'open-book',
      size: 'normal',
    },
    {
      id: 'fs-2',
      title: 'Neuroanatomy & Cranial Nerves',
      subtitle: 'Brainstem syndromes, circle of Willis & sensory tracts',
      subject: currentSubject,
      iconName: 'Brain',
      badge: 'Anatomy Atlas',
      accentColor: 'sky',
      enabled: true,
      linkAction: 'open-book',
      size: 'normal',
    },
    {
      id: 'fs-3',
      title: 'Chemotherapy & Antimicrobials',
      subtitle: 'Cell wall inhibitors, antifungals & antivirals',
      subject: currentSubject,
      iconName: 'Activity',
      badge: 'Board Traps',
      accentColor: 'emerald',
      enabled: true,
      linkAction: 'open-practical',
      size: 'normal',
    },
    {
      id: 'fs-4',
      title: 'Endocrine & Renal Therapeutics',
      subtitle: 'SGLT2 inhibitors, GLP-1 RA & Loop diuretics',
      subject: currentSubject,
      iconName: 'Sparkles',
      badge: 'Guideline Update',
      accentColor: 'amber',
      enabled: true,
      linkAction: 'open-cal',
      size: 'normal',
    },
  ]);

  const [slabSize, setSlabSize] = useState<'compact' | 'normal' | 'expanded'>('normal');
  const [gridDensity, setGridDensity] = useState<'2' | '3' | '4'>('2');
  const [isRearranging, setIsRearranging] = useState(false);
  const [editingSlab, setEditingSlab] = useState<OptionSlab | null>(null);
  const [isAskGeminiOpen, setIsAskGeminiOpen] = useState(false);
  const [geminiTopic, setGeminiTopic] = useState<string>(currentSubject);

  // Fluent task & reminders state
  const [taskFilter, setTaskFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [taskInput, setTaskInput] = useState('');
  const [editingReminder, setEditingReminder] = useState<ClinicalReminder | null>(null);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);

  const [reminders, setReminders] = useState<ClinicalReminder[]>(() => {
    const saved = localStorage.getItem('medden_clinical_reminders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return [
      {
        id: 'rem-1',
        title: 'Pediatric Ward Rounds & Case Presentation',
        dueTime: 'Today, 08:30 AM',
        dueDate: new Date().toISOString().split('T')[0],
        category: 'Ward Rounds',
        priority: 'critical',
        notificationEnabled: true,
        notificationType: 'both',
        alertTiming: '30m-before',
        recurrence: 'daily',
        notes: 'Bed 4: Post-streptococcal glomerulonephritis child follow-up',
      },
      {
        id: 'rem-2',
        title: 'Check Vancomycin Trough & Serum Creatinine',
        dueTime: 'Today, 02:00 PM',
        dueDate: new Date().toISOString().split('T')[0],
        category: 'Drug Review',
        priority: 'critical',
        notificationEnabled: true,
        notificationType: 'both',
        alertTiming: '10m-before',
        recurrence: 'every-4h',
        notes: 'Target trough 15-20 mcg/mL. Hold dose if Cr rises by >0.3 mg/dL.',
      },
      {
        id: 'rem-3',
        title: 'USMLE QBank Block (40 Renal / Cardio MCQs)',
        dueTime: 'Today, 06:00 PM',
        dueDate: new Date().toISOString().split('T')[0],
        category: 'Study Goal',
        priority: 'high',
        notificationEnabled: true,
        notificationType: 'banner',
        alertTiming: 'at-time',
        recurrence: 'daily',
      },
      {
        id: 'rem-4',
        title: '20-20-20 Eye Rest & Hydration Stretch',
        dueTime: 'Every 2 Hours',
        dueDate: new Date().toISOString().split('T')[0],
        category: 'Wellness & Rest',
        priority: 'wellness',
        notificationEnabled: true,
        notificationType: 'sound',
        alertTiming: 'at-time',
        recurrence: 'every-4h',
      },
    ];
  });

  const handleToggleReminderNotification = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const updated = reminders.map((r) =>
      r.id === id ? { ...r, notificationEnabled: !r.notificationEnabled } : r
    );
    setReminders(updated);
    localStorage.setItem('medden_clinical_reminders', JSON.stringify(updated));
  };

  const handleSaveReminder = (updated: ClinicalReminder) => {
    let next: ClinicalReminder[];
    const exists = reminders.some((r) => r.id === updated.id);
    if (exists) {
      next = reminders.map((r) => (r.id === updated.id ? updated : r));
    } else {
      next = [updated, ...reminders];
    }
    setReminders(next);
    localStorage.setItem('medden_clinical_reminders', JSON.stringify(next));
  };

  const handleDeleteReminder = (id: string) => {
    const next = reminders.filter((r) => r.id !== id);
    setReminders(next);
    localStorage.setItem('medden_clinical_reminders', JSON.stringify(next));
  };

  const handleAddNewTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskInput.trim()) return;
    if (onAddTask) {
      onAddTask({
        id: `task-${Date.now()}`,
        title: taskInput.trim(),
        completed: false,
        priority: 'high',
        subject: currentSubject,
        highYield: true,
      });
    }
    setTaskInput('');
  };

  const handleMoveSlab = (id: string, dir: 'left' | 'right') => {
    const idx = fluentSlabs.findIndex((s) => s.id === id);
    if (idx < 0) return;
    const targetIdx = dir === 'left' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= fluentSlabs.length) return;
    const copy = [...fluentSlabs];
    const [moved] = copy.splice(idx, 1);
    copy.splice(targetIdx, 0, moved);
    setFluentSlabs(copy);
  };

  return (
    <div className="space-y-6 font-sans text-stone-900 dark:text-stone-100 p-4 md:p-7 rounded-3xl bg-white/70 dark:bg-[#111418]/80 backdrop-blur-2xl border border-stone-200/90 dark:border-[#222a36] shadow-2xl relative transition-colors">
      
      {/* 1. FLUENT TOP BAR */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-200/80 dark:border-[#202836]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-500 text-white flex items-center justify-center font-bold text-sm shadow-md">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-slate-900 dark:text-white text-lg">
              Mica Fluent Cockpit
            </span>
          </div>
        </div>
      </div>

      {/* 2. TELEMETRY DIALS STRIP */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#161c24]/90 border border-stone-200/80 dark:border-[#242e3b] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider block">Daily Study Target</span>
            <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">3.8 / 5.0h</span>
            <span className="text-[10px] text-sky-600 dark:text-sky-400 font-medium block mt-0.5">76% of clinical goal</span>
          </div>
          <div className="w-10 h-10 rounded-full border-4 border-sky-500/30 border-t-sky-500 flex items-center justify-center font-mono text-[10px] font-bold">
            76%
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#161c24]/90 border border-stone-200/80 dark:border-[#242e3b] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider block">Recall Retention</span>
            <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">89.4%</span>
            <span className="text-[10px] text-sky-600 dark:text-sky-400 font-medium block mt-0.5">Spaced repetition rate</span>
          </div>
          <div className="w-10 h-10 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 flex items-center justify-center font-mono text-[10px] font-bold">
            89%
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#161c24]/90 border border-stone-200/80 dark:border-[#242e3b] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider block">Active Flashcards</span>
            <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">142 Cards</span>
            <span className="text-[10px] text-purple-600 dark:text-purple-400 font-medium block mt-0.5">38 due for ward review</span>
          </div>
          <div className="w-10 h-10 rounded-full border-4 border-purple-500/30 border-t-purple-500 flex items-center justify-center font-mono text-[10px] font-bold">
            142
          </div>
        </div>
      </div>

      {/* 3. FLUENT ACRYLIC TELEMETRY HUB: CALENDAR, SMART TASKS & CLINICAL REMINDERS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 items-stretch">
        
        {/* 1. CALENDAR CARD (With Eye-Catching Logo in Front of Calendar) */}
        <div
          onClick={onOpenRosterModal}
          className="lg:col-span-4 p-4 rounded-3xl bg-white/85 dark:bg-[#151a22]/90 border border-stone-200/90 dark:border-[#242e3d] shadow-sm hover:shadow-md cursor-pointer hover:border-sky-500/50 transition-all flex flex-col justify-between select-none group"
          title="Open Academic Calendar & AI Roster Scanner"
        >
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-200/70 dark:border-[#242e3d] mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform shrink-0">
                  <CalendarDays className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-sky-500 transition-colors">
                    Academic Calendar
                  </h4>
                  <span className="text-[10px] font-mono text-stone-400">
                    {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>
              <div className="w-6 h-6 rounded-lg bg-stone-100 dark:bg-[#1d2430] flex items-center justify-center text-stone-400 group-hover:text-sky-500 transition-colors">
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="p-2 rounded-xl bg-stone-50 dark:bg-[#1a202a] border border-stone-200/60 dark:border-[#273140] flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-slate-800 dark:text-zinc-200 block text-[11px]">Cardiology Ward Rounds</span>
                  <span className="text-[10px] font-mono text-stone-400">08:30 AM · Ward 4B</span>
                </div>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300">
                  Bedside
                </span>
              </div>
              <div className="p-2 rounded-xl bg-stone-50 dark:bg-[#1a202a] border border-stone-200/60 dark:border-[#273140] flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-slate-800 dark:text-zinc-200 block text-[11px]">Pharmacology Lab & OSCE</span>
                  <span className="text-[10px] font-mono text-stone-400">11:00 AM · CAL Lab 2</span>
                </div>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  Practical
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-stone-200/60 dark:border-[#242e3d] flex items-center justify-between text-[10px] font-mono text-sky-600 dark:text-sky-400">
            <span>Tap to open roster scanner</span>
            <span className="font-bold">→</span>
          </div>
        </div>

        {/* 2. SMART RESHAPED TASKS CARD (Circular Completion Ring + Bento Graphics) */}
        <div className="lg:col-span-4 p-4 rounded-3xl bg-white/85 dark:bg-[#151a22]/90 border border-stone-200/90 dark:border-[#242e3d] shadow-sm flex flex-col justify-between">
          <div>
            {/* Header with Circular Completion Meter */}
            <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-stone-200/70 dark:border-[#242e3d]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                  <CheckSquare className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
                    Clinical Tasks
                  </h4>
                  <span className="text-[10px] font-mono text-stone-400">
                    Daily Checklist
                  </span>
                </div>
              </div>

              {/* Circular Radial Completion Ring */}
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <span className="text-xs font-bold font-mono text-slate-900 dark:text-zinc-100 block leading-tight">
                    {tasks.filter((t) => t.completed).length}/{tasks.length}
                  </span>
                  <span className="text-[9px] font-mono text-amber-600 dark:text-amber-400">
                    {tasks.length > 0 ? Math.round((tasks.filter((t) => t.completed).length / tasks.length) * 100) : 0}% Done
                  </span>
                </div>
                <div className="relative w-7 h-7 flex items-center justify-center">
                  <svg className="w-7 h-7 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-stone-200 dark:text-[#252f3d]"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-amber-500 transition-all duration-500"
                      strokeDasharray={`${tasks.length > 0 ? (tasks.filter((t) => t.completed).length / tasks.length) * 100 : 0}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 mb-2 bg-stone-100 dark:bg-[#1c222b] p-0.5 rounded-lg text-[10px] font-semibold">
              {(['all', 'pending', 'completed'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setTaskFilter(f)}
                  className={`flex-1 py-0.5 rounded-md capitalize transition-colors ${
                    taskFilter === f
                      ? 'bg-white dark:bg-[#252f3d] text-stone-900 dark:text-white shadow-2xs font-bold'
                      : 'text-stone-500'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Task Checklist Items */}
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1 custom-scrollbar">
              {tasks
                .filter((t) => {
                  if (taskFilter === 'pending') return !t.completed;
                  if (taskFilter === 'completed') return t.completed;
                  return true;
                })
                .slice(0, 5)
                .map((task) => (
                  <div
                    key={task.id}
                    onClick={() => onToggleTask(task.id)}
                    className={`flex items-start gap-2 p-1.5 rounded-xl border transition-all cursor-pointer group select-none ${
                      task.completed
                        ? 'bg-stone-50/60 dark:bg-[#13171e] border-stone-200/60 dark:border-[#202734] opacity-70'
                        : 'bg-stone-50/80 dark:bg-[#1a202a] border-stone-200/80 dark:border-[#263140] hover:border-amber-400/50'
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        task.completed
                          ? 'bg-sky-600 text-white border-sky-600'
                          : 'border-stone-400 dark:border-stone-600 bg-white dark:bg-black/30 group-hover:border-amber-500'
                      }`}
                    >
                      {task.completed && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span
                        className={`text-[11px] block leading-snug font-medium truncate ${
                          task.completed
                            ? 'line-through text-stone-400 dark:text-stone-500'
                            : 'text-stone-900 dark:text-zinc-100'
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>
                    {task.highYield && (
                      <span className="text-[8.5px] font-mono px-1 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0">
                        HY
                      </span>
                    )}
                  </div>
                ))}
            </div>
          </div>

          {/* Quick Add Task */}
          {onAddTask && (
            <form onSubmit={handleAddNewTask} className="mt-2 pt-2 border-t border-stone-200/70 dark:border-[#242e3d] flex items-center gap-1.5">
              <input
                type="text"
                placeholder="+ Add task..."
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                className="bg-stone-100 dark:bg-[#1c222b] text-[11px] px-2 py-1 rounded-lg border border-stone-200 dark:border-[#2b3542] outline-none flex-1 text-slate-900 dark:text-zinc-100 placeholder-stone-400 focus:border-amber-500"
              />
              <button
                type="submit"
                disabled={!taskInput.trim()}
                className="p-1.5 rounded-lg bg-slate-900 dark:bg-stone-100 text-white dark:text-slate-950 hover:bg-slate-800 disabled:opacity-30 transition-all shrink-0 cursor-pointer shadow-xs"
              >
                <Plus className="w-3 h-3" />
              </button>
            </form>
          )}
        </div>

        {/* 3. SMART RESHAPED REMINDER CARD (Radar Wave Pulse + Notification Toggle + Edit Modal) */}
        <div className="lg:col-span-4 p-4 rounded-3xl bg-white/85 dark:bg-[#151a22]/90 border border-stone-200/90 dark:border-[#242e3d] shadow-sm flex flex-col justify-between">
          <div>
            {/* Header: Bell with Radar Wave + Add Reminder Button */}
            <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-stone-200/70 dark:border-[#242e3d]">
              <div className="flex items-center gap-2">
                <div className="relative w-7 h-7 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold">
                  <Bell className="w-4 h-4" />
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-sky-500 animate-ping" />
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-sky-500" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
                    Clinical Reminders
                  </h4>
                  <span className="text-[10px] font-mono text-stone-400">
                    Alerts & Sound Notifications
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingReminder(null);
                  setIsReminderModalOpen(true);
                }}
                className="px-2 py-0.5 rounded-lg bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 dark:hover:bg-sky-900/60 border border-sky-200 dark:border-sky-900 text-sky-700 dark:text-sky-300 text-[10px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                title="Add new clinical reminder"
              >
                <Plus className="w-3 h-3" />
                <span>New</span>
              </button>
            </div>

            {/* Reminders List */}
            <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1 custom-scrollbar">
              {reminders.slice(0, 4).map((rem) => {
                const isCritical = rem.priority === 'critical';
                const isWellness = rem.priority === 'wellness';
                const isHigh = rem.priority === 'high';

                return (
                  <div
                    key={rem.id}
                    onClick={() => {
                      setEditingReminder(rem);
                      setIsReminderModalOpen(true);
                    }}
                    className={`p-2 rounded-xl border transition-all cursor-pointer group flex items-start justify-between gap-1.5 ${
                      isCritical
                        ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50 hover:border-rose-400'
                        : isWellness
                        ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50 hover:border-amber-400'
                        : isHigh
                        ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50 hover:border-amber-400'
                        : 'bg-stone-50/60 dark:bg-[#191f28] border-stone-200/80 dark:border-[#273240] hover:border-stone-300'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1 mb-0.5">
                        <span
                          className={`text-[8px] font-mono font-bold uppercase px-1.5 py-0.2 rounded ${
                            isCritical
                              ? 'bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300'
                              : isWellness
                              ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300'
                              : isHigh
                              ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300'
                              : 'bg-stone-200 dark:bg-[#252f3d] text-stone-600 dark:text-stone-300'
                          }`}
                        >
                          {rem.category}
                        </span>
                        <span className="text-[9px] text-stone-400 font-mono truncate">
                          {rem.dueTime}
                        </span>
                      </div>
                      <p className="font-semibold text-[11px] text-slate-900 dark:text-zinc-100 leading-snug line-clamp-1">
                        {rem.title}
                      </p>
                    </div>

                    {/* Quick Action Icons: Notification Toggle + Edit Pencil */}
                    <div className="flex items-center gap-0.5 shrink-0 pt-0.5">
                      <button
                        type="button"
                        onClick={(e) => handleToggleReminderNotification(rem.id, e)}
                        className={`p-1 rounded-md transition-colors ${
                          rem.notificationEnabled
                            ? 'text-sky-600 dark:text-sky-400 bg-sky-500/10'
                            : 'text-stone-400 hover:text-stone-600'
                        }`}
                        title={rem.notificationEnabled ? 'Notifications active (click to mute)' : 'Notifications muted'}
                      >
                        {rem.notificationEnabled ? (
                          <BellRing className="w-3 h-3" />
                        ) : (
                          <BellOff className="w-3 h-3" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingReminder(rem);
                          setIsReminderModalOpen(true);
                        }}
                        className="p-1 rounded-md text-stone-400 hover:text-slate-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-[#252f3d] transition-colors"
                        title="Edit reminder & notification options"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-2 mt-2 border-t border-stone-200/60 dark:border-[#242e3d] text-[10px] text-stone-400 font-mono flex items-center justify-between">
            <span>Tibetan bowl audio & toast</span>
            <span className="text-sky-500 font-bold">● Active</span>
          </div>
        </div>

      </div>

      {/* 5. MODULAR RESTRUCTURED SLABS SECTION */}
      <div className="space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-stone-200/80 dark:border-[#202836] gap-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Cockpit Modules & Slabs</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-700 dark:text-sky-300 font-semibold border border-sky-500/20">
                {fluentSlabs.length} Slabs
              </span>
            </h3>

            {/* Slabs Size Switcher */}
            <div className="flex items-center bg-stone-100 dark:bg-[#1a212c] p-0.5 rounded-lg border border-stone-200 dark:border-[#263140] text-[10px] font-semibold">
              {(['compact', 'normal', 'expanded'] as const).map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSlabSize(sz)}
                  className={`px-2 py-0.5 rounded-md capitalize transition-colors ${
                    slabSize === sz
                      ? 'bg-white dark:bg-[#253040] text-sky-600 dark:text-sky-300 shadow-2xs font-bold'
                      : 'text-stone-500'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>

            {/* Grid Density */}
            <div className="flex items-center bg-stone-100 dark:bg-[#1a212c] p-0.5 rounded-lg border border-stone-200 dark:border-[#263140] text-[10px] font-semibold">
              {(['2', '3', '4'] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setGridDensity(d)}
                  className={`px-2 py-0.5 rounded-md transition-colors ${
                    gridDensity === d
                      ? 'bg-white dark:bg-[#253040] text-sky-600 dark:text-sky-300 shadow-2xs font-bold'
                      : 'text-stone-500'
                  }`}
                >
                  {d} Col
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsRearranging(!isRearranging)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                isRearranging
                  ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-200'
                  : 'bg-stone-100 dark:bg-[#1a212c] text-stone-700 dark:text-stone-300 border-stone-200 dark:border-[#293444]'
              }`}
            >
              {isRearranging ? 'Done' : 'Arrange Slabs'}
            </button>
          </div>
        </div>

        {/* Slabs Grid */}
        <div
          className={`grid gap-3.5 ${
            gridDensity === '4'
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
              : gridDensity === '3'
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1 md:grid-cols-2'
          }`}
        >
          {fluentSlabs.map((slab) => (
            <div
              key={slab.id}
              className={`p-4 rounded-2xl bg-white/80 dark:bg-[#161c24]/90 border border-stone-200/90 dark:border-[#263140] shadow-xs flex flex-col justify-between transition-all group ${
                slabSize === 'compact' ? 'py-3' : slabSize === 'expanded' ? 'min-h-[110px]' : ''
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {slab.title}
                    </span>
                    {slab.badge && (
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-stone-100 dark:bg-[#202733] text-stone-600 dark:text-stone-300 shrink-0">
                        {slab.badge}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {isRearranging ? (
                      <>
                        <button
                          onClick={() => handleMoveSlab(slab.id, 'left')}
                          className="p-1 rounded text-stone-500 hover:bg-stone-100 dark:hover:bg-[#232c3a]"
                        >
                          <ArrowLeft className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleMoveSlab(slab.id, 'right')}
                          className="p-1 rounded text-stone-500 hover:bg-stone-100 dark:hover:bg-[#232c3a]"
                        >
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => setEditingSlab(slab)}
                          className="p-1 rounded text-stone-400 hover:text-slate-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-[#232c3a]"
                          title="Edit slab"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => {
                            setGeminiTopic(slab.title);
                            setIsAskGeminiOpen(true);
                          }}
                          className="p-1 rounded text-stone-400 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-stone-100 dark:hover:bg-[#232c3a]"
                          title="Ask Gemini"
                        >
                          <Sparkles className="w-3 h-3" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {slabSize !== 'compact' && (
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-snug">
                    {slab.subtitle}
                  </p>
                )}
              </div>

              {/* File Attachment & Notes in Expanded Mode */}
              {slabSize === 'expanded' && (
                <div className="pt-2 mt-2 border-t border-stone-200/70 dark:border-[#242c38] flex items-center justify-between text-[10px]">
                  {slab.fileAttachmentName ? (
                    <span className="flex items-center gap-1 text-sky-600 dark:text-sky-400 font-mono truncate">
                      <Paperclip className="w-3 h-3 shrink-0" />
                      <span className="truncate">{slab.fileAttachmentName}</span>
                    </span>
                  ) : (
                    <span className="text-stone-400 italic">No files attached</span>
                  )}
                  <button
                    onClick={() => {
                      setGeminiTopic(slab.title);
                      setIsAskGeminiOpen(true);
                    }}
                    className="text-sky-600 dark:text-sky-400 font-semibold hover:underline"
                  >
                    AI Pearl
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 5. FLOATING WINDOWS 11 ACRYLIC DOCK */}
      <div className="max-w-md mx-auto p-2 bg-white/85 dark:bg-[#161d26]/90 backdrop-blur-2xl rounded-2xl border border-stone-200/90 dark:border-[#293444] shadow-xl flex items-center justify-around">
        <button
          onClick={() => notebooks[0] && onOpenNotebook(notebooks[0].id)}
          className="p-2 hover:bg-stone-100 dark:hover:bg-[#242e3c] rounded-xl transition-colors text-sky-600"
          title="Notebooks"
        >
          <BookOpen className="w-4 h-4" />
        </button>
        <button
          onClick={() => onOpenStudio('open-book')}
          className="p-2 hover:bg-stone-100 dark:hover:bg-[#242e3c] rounded-xl transition-colors text-indigo-500"
          title="Open Medical Reader"
        >
          <Sparkles className="w-4 h-4" />
        </button>
        <button
          onClick={onOpenRosterModal}
          className="p-2 hover:bg-stone-100 dark:hover:bg-[#242e3c] rounded-xl transition-colors text-purple-600"
          title="Academic Calendar"
        >
          <CalendarIcon className="w-4 h-4" />
        </button>
        <button
          onClick={onTriggerEyeBreak}
          className="p-2 hover:bg-stone-100 dark:hover:bg-[#242e3c] rounded-xl transition-colors text-amber-600"
          title="Eye Break Rest"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      {/* Edit Slab Modal */}
      <EditSlabModal
        isOpen={!!editingSlab}
        onClose={() => setEditingSlab(null)}
        slab={editingSlab}
        onSaveSlab={(updated) => {
          setFluentSlabs(fluentSlabs.map((s) => (s.id === updated.id ? updated : s)));
        }}
        onAskGeminiAboutSlab={(topic) => {
          setGeminiTopic(topic);
          setIsAskGeminiOpen(true);
        }}
        currentSubject={currentSubject}
      />

      {/* Ask Gemini Modal */}
      <AskGeminiModal
        isOpen={isAskGeminiOpen}
        onClose={() => setIsAskGeminiOpen(false)}
        initialTopic={geminiTopic}
        currentSubject={currentSubject}
        onInsertToNote={(contentHtml) => {
          if (notebooks[0]) {
            onOpenNotebook(notebooks[0].id);
          }
        }}
      />

      {/* Edit Reminder Modal */}
      <EditReminderModal
        isOpen={isReminderModalOpen}
        onClose={() => {
          setIsReminderModalOpen(false);
          setEditingReminder(null);
        }}
        reminder={editingReminder}
        onSaveReminder={handleSaveReminder}
        onDeleteReminder={handleDeleteReminder}
      />
    </div>
  );
};
