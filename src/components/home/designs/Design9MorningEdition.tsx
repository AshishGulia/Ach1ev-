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
  CheckCircle2,
  Circle,
  Lightbulb,
  ArrowRight,
  BookOpen,
  Sparkles,
  Paperclip,
  Edit2,
  Trash2,
  ArrowLeft,
  Sliders,
  Plus,
  Bookmark,
  Activity,
  Award,
  CalendarDays,
  Bell,
  BellRing,
  BellOff,
  CheckSquare,
  Check,
  ChevronRight,
  Clock,
} from 'lucide-react';
import { EditSlabModal } from '../EditSlabModal';
import { AskGeminiModal } from '../../common/AskGeminiModal';
import { EditReminderModal } from '../EditReminderModal';

interface Design9Props {
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
}

export const Design9MorningEdition: React.FC<Design9Props> = ({
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
}) => {
  // Editorial Modular Slabs
  const [editorialSlabs, setEditorialSlabs] = useState<OptionSlab[]>([
    {
      id: 'es-1',
      title: 'Cardiovascular Landmark Trials',
      subtitle: 'PARADIGM-HF (Sacubitril/Valsartan) & EMPA-REG (Empagliflozin)',
      subject: currentSubject,
      iconName: 'BookOpen',
      badge: 'Landmark Trial',
      accentColor: 'indigo',
      enabled: true,
      linkAction: 'open-book',
      size: 'normal',
    },
    {
      id: 'es-2',
      title: 'Antimicrobial Resistance & Stewardship',
      subtitle: 'MRSA, VRE, ESBL & Carbapenemase-producing Enterobacteriaceae',
      subject: currentSubject,
      iconName: 'Activity',
      badge: 'Microbiology',
      accentColor: 'emerald',
      enabled: true,
      linkAction: 'open-practical',
      size: 'normal',
    },
    {
      id: 'es-3',
      title: 'Endocrine & Metabolic Disorders',
      subtitle: 'Diabetic ketoacidosis algorithms, GLP-1 RA & thyroid storm',
      subject: currentSubject,
      iconName: 'Sparkles',
      badge: 'High-Yield Board',
      accentColor: 'amber',
      enabled: true,
      linkAction: 'open-cal',
      size: 'normal',
    },
    {
      id: 'es-4',
      title: 'Renal & Electrolyte Physiology',
      subtitle: 'Hyponatremia workup, loop diuretics & acute kidney injury',
      subject: currentSubject,
      iconName: 'Award',
      badge: 'Clinical Rounds',
      accentColor: 'sky',
      enabled: true,
      linkAction: 'open-subject',
      size: 'normal',
    },
  ]);

  const [slabSize, setSlabSize] = useState<'compact' | 'normal' | 'expanded'>('normal');
  const [gridDensity, setGridDensity] = useState<'2' | '3' | '4'>('2');
  const [isRearranging, setIsRearranging] = useState(false);
  const [editingSlab, setEditingSlab] = useState<OptionSlab | null>(null);
  const [isAskGeminiOpen, setIsAskGeminiOpen] = useState(false);
  const [geminiTopic, setGeminiTopic] = useState<string>(currentSubject);

  // Broadsheet task filter & reminders state
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
    const idx = editorialSlabs.findIndex((s) => s.id === id);
    if (idx < 0) return;
    const targetIdx = dir === 'left' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= editorialSlabs.length) return;
    const copy = [...editorialSlabs];
    const [moved] = copy.splice(idx, 1);
    copy.splice(targetIdx, 0, moved);
    setEditorialSlabs(copy);
  };

  return (
    <div className="font-sans text-stone-900 dark:text-stone-100 bg-[#fbfaf6] dark:bg-[#14171b] p-4 sm:p-7 rounded-3xl border-2 border-stone-800 dark:border-stone-700 shadow-2xl space-y-6 transition-colors">
      
      {/* Newspaper Top Masthead */}
      <div className="border-b-4 border-double border-stone-900 dark:border-stone-600 pb-3">
        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono uppercase tracking-widest text-stone-600 dark:text-stone-400 pb-2">
          <div className="text-left">
            <span>Learn · Revise · Become a Better Physician</span>
          </div>
          <div className="text-center font-bold text-stone-900 dark:text-stone-100">
            Morning Edition · {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
          <div className="text-right">
            <span className="px-2 py-0.5 rounded bg-stone-200 dark:bg-stone-800 font-bold">
              Edition 3 · Editorial Atelier
            </span>
          </div>
        </div>

        {/* Newspaper Title */}
        <div className="text-center py-2">
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight font-sans uppercase text-stone-950 dark:text-white">
            The Ach1ev Daily
          </h1>
          <p className="text-[10px] font-mono tracking-[0.28em] uppercase text-stone-600 dark:text-stone-400 mt-1">
            Settle Ideas
          </p>
        </div>

        {/* Sub-banner ribbon */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono uppercase tracking-widest text-stone-700 dark:text-stone-400 pt-2 border-t border-stone-900 dark:border-stone-700">
          <span>EVIDENCE-BASED CLINICAL MEDICINE</span>
          <span>KNOWLEDGE | CLINICAL TRIALS | DIAGNOSTIC WISDOM</span>
        </div>
      </div>

      {/* 4-Column Broadsheet Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 items-start divide-y lg:divide-y-0 lg:divide-x divide-stone-300 dark:divide-stone-800">
        
        {/* Column 1 (Span 4): COVER STORY: Study Plan & Textbook Stack */}
        <div className="lg:col-span-4 space-y-4 pr-0 lg:pr-4">
          <div className="border-b border-stone-400 dark:border-stone-700 pb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500 dark:text-stone-400 font-bold block">
              COVER STORY
            </span>
            <h2 className="text-3xl font-black tracking-tight text-stone-950 dark:text-stone-100 mt-0.5">
              Today's Clinical Rounds
            </h2>
            <p className="text-xs italic text-stone-600 dark:text-stone-400">
              Dr. {userProfile.name.split(' ')[0] || 'Ashish'} · {userProfile.institution}
            </p>
          </div>

          {/* Book stack tactile flat-lay */}
          <div className="p-3 bg-[#f0ebd9] dark:bg-[#1a2028] border border-stone-300 dark:border-stone-700 rounded-xl text-center space-y-1.5 shadow-xs">
            <div className="py-2 px-3 bg-[#1e2836] text-white text-[11px] font-mono rounded-lg font-bold shadow-2xs">
              Harrison's Principles of Internal Medicine
            </div>
            <div className="py-1 px-3 bg-[#522521] text-white text-[10px] font-mono rounded-lg font-semibold shadow-2xs">
              Robbins Pathologic Basis of Disease
            </div>
            <div className="py-1 px-3 bg-[#4b2f1d] text-white text-[10px] font-mono rounded-lg font-semibold shadow-2xs">
              Goodman & Gilman's Pharmacological Basis
            </div>
          </div>

          <p className="text-xs leading-relaxed text-stone-700 dark:text-stone-300">
            A disciplined daily study plan transforms diagnostic uncertainty into confident clinical decision-making. Focus on landmark trials and patient mechanisms.
          </p>

          {/* 1. EDITORIAL CALENDAR CARD (With Eye-Catching Logo in Front of Calendar) */}
          <div
            onClick={onOpenRosterModal}
            className="p-3 rounded-2xl bg-white dark:bg-[#1a2028] border-2 border-stone-800 dark:border-stone-600 shadow-xs hover:shadow-md cursor-pointer transition-all flex items-center justify-between group"
            title="Open Academic Calendar & Ward Postings"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 flex items-center justify-center font-bold shadow-2xs group-hover:scale-105 transition-transform shrink-0">
                <CalendarDays className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold font-sans uppercase tracking-tight text-stone-900 dark:text-stone-100 block truncate group-hover:text-sky-600 dark:group-hover:text-sky-400">
                  Academic Calendar
                </span>
                <span className="text-[10px] font-mono text-stone-500 dark:text-stone-400 block truncate">
                  {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} · Ward Postings
                </span>
              </div>
            </div>
            <div className="w-5 h-5 rounded-md bg-stone-100 dark:bg-[#252e39] flex items-center justify-center text-stone-600 dark:text-stone-300 group-hover:text-sky-600 transition-colors shrink-0">
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* 2. SMART BROADSHEET TASKS (With Radial Progress Arc + Filter Tabs) */}
          <div className="p-3.5 rounded-2xl bg-white dark:bg-[#1a2028] border-2 border-stone-800 dark:border-stone-600 shadow-xs space-y-3">
            {/* Header with Circular Completion Meter */}
            <div className="flex items-center justify-between pb-2 border-b border-stone-300 dark:border-stone-700">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold">
                  <CheckSquare className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-stone-900 dark:text-white">
                    Clinical Tasks
                  </h3>
                  <span className="text-[9px] font-mono text-stone-500 dark:text-stone-400">
                    Daily Rounds Checklist
                  </span>
                </div>
              </div>

              {/* Circular Radial Completion Meter */}
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <span className="text-xs font-bold font-mono text-stone-900 dark:text-white block leading-tight">
                    {tasks.filter((t) => t.completed).length}/{tasks.length}
                  </span>
                  <span className="text-[9px] font-mono text-[#8f5f2c] dark:text-amber-400">
                    {tasks.length > 0 ? Math.round((tasks.filter((t) => t.completed).length / tasks.length) * 100) : 0}% Done
                  </span>
                </div>
                <div className="relative w-7 h-7 flex items-center justify-center">
                  <svg className="w-7 h-7 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-stone-200 dark:text-stone-700"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-amber-600 transition-all duration-500"
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
            <div className="flex items-center gap-1 bg-stone-100 dark:bg-[#242b35] p-0.5 rounded-lg text-[10px] font-semibold">
              {(['all', 'pending', 'completed'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setTaskFilter(f)}
                  className={`flex-1 py-0.5 rounded-md capitalize transition-colors ${
                    taskFilter === f
                      ? 'bg-white dark:bg-[#2f3946] text-stone-900 dark:text-white shadow-2xs font-bold'
                      : 'text-stone-500'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Tasks Checklist */}
            <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1 custom-scrollbar">
              {tasks
                .filter((t) => {
                  if (taskFilter === 'pending') return !t.completed;
                  if (taskFilter === 'completed') return t.completed;
                  return true;
                })
                .slice(0, 6)
                .map((t) => (
                  <div
                    key={t.id}
                    onClick={() => onToggleTask(t.id)}
                    className="flex items-start justify-between p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-[#232a34] cursor-pointer transition-colors group select-none"
                  >
                    <div className="flex items-start gap-2 min-w-0 flex-1">
                      {t.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-[#8f5f2c] dark:text-amber-400 shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="w-4 h-4 text-stone-400 shrink-0 mt-0.5 group-hover:text-amber-500" />
                      )}
                      <span
                        className={`text-xs block leading-snug font-medium truncate ${
                          t.completed
                            ? 'line-through text-stone-400 dark:text-stone-500'
                            : 'text-stone-900 dark:text-stone-100'
                        }`}
                      >
                        {t.title}
                      </span>
                    </div>
                    {t.highYield && (
                      <span className="text-[8.5px] font-mono px-1 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 shrink-0">
                        HY
                      </span>
                    )}
                  </div>
                ))}
            </div>

            {/* Quick Add Task */}
            {onAddTask && (
              <form onSubmit={handleAddNewTask} className="pt-2 border-t border-stone-200 dark:border-stone-700 flex items-center gap-1.5">
                <input
                  type="text"
                  placeholder="+ Add clinical task..."
                  value={taskInput}
                  onChange={(e) => setTaskInput(e.target.value)}
                  className="bg-stone-50 dark:bg-[#151920] text-xs px-2.5 py-1 rounded-lg border border-stone-300 dark:border-stone-700 outline-none flex-1 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:border-stone-800"
                />
                <button
                  type="submit"
                  disabled={!taskInput.trim()}
                  className="p-1.5 rounded-lg bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 hover:bg-stone-800 disabled:opacity-30 transition-all shrink-0 cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>

          {/* 3. SMART CLINICAL REMINDERS & WARD BULLETINS (With Edit Option & Notifications) */}
          <div className="p-3.5 rounded-2xl bg-white dark:bg-[#1a2028] border-2 border-stone-800 dark:border-stone-600 shadow-xs space-y-3">
            {/* Header: Bell with Radar Wave + Add Reminder Button */}
            <div className="flex items-center justify-between pb-2 border-b border-stone-300 dark:border-stone-700">
              <div className="flex items-center gap-2">
                <div className="relative w-6 h-6 rounded-lg bg-sky-500/10 text-sky-700 dark:text-sky-400 flex items-center justify-center font-bold">
                  <Bell className="w-3.5 h-3.5" />
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-sky-500 animate-ping" />
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-sky-500" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-stone-900 dark:text-white">
                    Ward Reminders
                  </h3>
                  <span className="text-[9px] font-mono text-stone-500 dark:text-stone-400">
                    Clinical Bulletins & Chimes
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingReminder(null);
                  setIsReminderModalOpen(true);
                }}
                className="px-2 py-0.5 rounded-lg bg-stone-100 dark:bg-[#252e39] hover:bg-stone-200 dark:hover:bg-[#2d3745] border border-stone-300 dark:border-stone-600 text-stone-800 dark:text-stone-200 text-[10px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                title="Add new clinical reminder"
              >
                <Plus className="w-3 h-3" />
                <span>New</span>
              </button>
            </div>

            {/* Reminders List */}
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
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
                        ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-900/50 hover:border-rose-400'
                        : isWellness
                        ? 'bg-amber-50/60 dark:bg-[#231912] border-amber-300 dark:border-[#4b3322] hover:border-amber-500'
                        : isHigh
                        ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-900/50 hover:border-amber-400'
                        : 'bg-stone-50/70 dark:bg-[#161c24] border-stone-300 dark:border-stone-700 hover:border-stone-400'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1 mb-0.5">
                        <span
                          className={`text-[8.5px] font-mono font-bold uppercase px-1.5 py-0.2 rounded ${
                            isCritical
                              ? 'bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-200'
                              : isWellness
                              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200'
                              : isHigh
                              ? 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200'
                              : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                          }`}
                        >
                          {rem.category}
                        </span>
                        <span className="text-[9px] text-stone-400 font-mono truncate">
                          {rem.dueTime}
                        </span>
                      </div>
                      <p className="font-semibold text-[11px] text-stone-900 dark:text-stone-100 leading-snug line-clamp-1">
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
                        className="p-1 rounded-md text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-200/60 dark:hover:bg-[#252e39] transition-colors"
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
        </div>

        {/* Column 2 (Span 8): LANDMARK CLINICAL TRIALS & EDITORIAL SLABS */}
        <div className="lg:col-span-8 space-y-5 pt-4 lg:pt-0 pl-0 lg:pl-5">
          
          {/* Landmark Trials Evidence Box */}
          <div className="p-4 rounded-2xl bg-[#f2edd9] dark:bg-[#1a2027] border border-stone-300 dark:border-stone-700 space-y-3">
            <div className="flex items-center justify-between border-b border-stone-300 dark:border-stone-700 pb-2">
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-stone-900 dark:text-stone-100">
                  Landmark Clinical Trials Evidence Brief
                </h3>
              </div>
              <button
                onClick={() => {
                  setGeminiTopic('Landmark Clinical Trials: EMPA-REG and PARADIGM-HF');
                  setIsAskGeminiOpen(true);
                }}
                className="text-[11px] font-semibold text-sky-700 dark:text-sky-400 flex items-center gap-1 hover:underline"
              >
                <Sparkles className="w-3 h-3" />
                <span>Ask Gemini to Summarize</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white dark:bg-[#141820] border border-stone-200 dark:border-stone-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 dark:text-white">EMPA-REG OUTCOME</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                    p &lt; 0.001
                  </span>
                </div>
                <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-relaxed">
                  Empagliflozin reduced cardiovascular death by 38% and hospitalization for heart failure by 35% in T2DM patients with established CVD.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-[#141820] border border-stone-200 dark:border-stone-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 dark:text-white">PARADIGM-HF</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300">
                    20% Reduction
                  </span>
                </div>
                <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-relaxed">
                  Sacubitril/Valsartan (ARNI) demonstrated superior 20% reduction in cardiovascular death or HF hospitalization compared to Enalapril alone.
                </p>
              </div>
            </div>
          </div>

          {/* Modular Editorial Slabs Section */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-stone-300 dark:border-stone-700 gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold font-mono uppercase tracking-wider text-stone-900 dark:text-white">
                  Editorial Slabs ({editorialSlabs.length})
                </h3>

                {/* Slabs Size Switcher */}
                <div className="flex items-center bg-stone-200 dark:bg-[#202630] p-0.5 rounded-lg text-[10px] font-semibold">
                  {(['compact', 'normal', 'expanded'] as const).map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSlabSize(sz)}
                      className={`px-2 py-0.5 rounded-md capitalize transition-colors ${
                        slabSize === sz
                          ? 'bg-white dark:bg-[#2c3644] text-stone-900 dark:text-white shadow-2xs font-bold'
                          : 'text-stone-500'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>

                {/* Grid Density */}
                <div className="flex items-center bg-stone-200 dark:bg-[#202630] p-0.5 rounded-lg text-[10px] font-semibold">
                  {(['2', '3', '4'] as const).map((d) => (
                    <button
                      key={d}
                      onClick={() => setGridDensity(d)}
                      className={`px-2 py-0.5 rounded-md transition-colors ${
                        gridDensity === d
                          ? 'bg-white dark:bg-[#2c3644] text-stone-900 dark:text-white shadow-2xs font-bold'
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
                      ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-200'
                      : 'bg-stone-200 dark:bg-[#202630] text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-700'
                  }`}
                >
                  {isRearranging ? 'Done' : 'Arrange Slabs'}
                </button>
              </div>
            </div>

            {/* Slabs Grid */}
            <div
              className={`grid gap-3 ${
                gridDensity === '4'
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                  : gridDensity === '3'
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                  : 'grid-cols-1 sm:grid-cols-2'
              }`}
            >
              {editorialSlabs.map((slab) => (
                <div
                  key={slab.id}
                  className={`p-3.5 rounded-xl bg-white dark:bg-[#161c24] border border-stone-300 dark:border-stone-700 shadow-xs flex flex-col justify-between transition-all ${
                    slabSize === 'compact' ? 'py-2.5' : slabSize === 'expanded' ? 'min-h-[110px]' : ''
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="text-xs font-bold text-stone-900 dark:text-white">
                        {slab.title}
                      </span>

                      <div className="flex items-center gap-1 shrink-0">
                        {isRearranging ? (
                          <>
                            <button
                              onClick={() => handleMoveSlab(slab.id, 'left')}
                              className="p-1 rounded text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800"
                            >
                              <ArrowLeft className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleMoveSlab(slab.id, 'right')}
                              className="p-1 rounded text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800"
                            >
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => setEditingSlab(slab)}
                              className="p-1 rounded text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
                              title="Edit slab"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => {
                                setGeminiTopic(slab.title);
                                setIsAskGeminiOpen(true);
                              }}
                              className="p-1 rounded text-stone-400 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-stone-100 dark:hover:bg-stone-800"
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
                    <div className="pt-2 mt-2 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-[10px]">
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
        </div>
      </div>

      {/* Edit Slab Modal */}
      <EditSlabModal
        isOpen={!!editingSlab}
        onClose={() => setEditingSlab(null)}
        slab={editingSlab}
        onSaveSlab={(updated) => {
          setEditorialSlabs(editorialSlabs.map((s) => (s.id === updated.id ? updated : s)));
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
