import React, { useState } from 'react';
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
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface Design5Props {
  userProfile: UserProfile;
  currentSubject: SubjectCourse;
  onSelectSubject: (subject: SubjectCourse) => void;
  tasks: StudyTask[];
  onToggleTask: (taskId: string) => void;
  notebooks: Notebook[];
  onOpenNotebook: (id: string) => void;
  onOpenStudio: (actionType?: string) => void;
  onOpenRosterModal: () => void;
}

export const Design5SwissMinimal: React.FC<Design5Props> = ({
  userProfile,
  onSelectSubject,
  tasks,
  onToggleTask,
  onOpenNotebook,
  onOpenStudio,
  onOpenRosterModal,
}) => {
  const [activeDateIndex, setActiveDateIndex] = useState(3); // 27 Tue

  const datesStrip = [
    { day: 24, name: 'SAT' },
    { day: 25, name: 'SUN' },
    { day: 26, name: 'MON' },
    { day: 27, name: 'TUE' },
    { day: 28, name: 'WED' },
    { day: 29, name: 'THU' },
    { day: 30, name: 'FRI' },
    { day: 31, name: 'SAT' },
    { day: 1, name: 'SUN' },
    { day: 2, name: 'MON' },
    { day: 3, name: 'TUE' },
  ];

  const subjects = [
    { num: '01', title: 'Pharmacology', tags: 'DRUGS / MECHANISMS / CLINICAL USES', course: 'Pharmacology' as SubjectCourse },
    { num: '02', title: 'Pathology', tags: 'DISEASES / PROCESSES / DIAGNOSIS', course: 'Pathology' as SubjectCourse },
    { num: '03', title: 'Anatomy', tags: 'STRUCTURE / RELATIONS / CLINICAL CORRELATES', course: 'Anatomy' as SubjectCourse },
  ];

  const swissTasks = [
    { id: 'st-1', text: 'Read Katzung Ch. 5', completed: true },
    { id: 'st-2', text: 'Revise inflammation (Pathology)', completed: true },
    { id: 'st-3', text: 'Anatomy diagrams — upper limb', completed: true },
    { id: 'st-4', text: 'Solve 20 MCQs (Pharmacology)', completed: true },
    { id: 'st-5', text: 'Watch pathology lecture (1 hr)', completed: false },
    { id: 'st-6', text: 'Make short notes (Anatomy)', completed: false },
  ];

  const [taskList, setTaskList] = useState(swissTasks);

  const toggleSwissTask = (id: string) => {
    setTaskList((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const completedCount = taskList.filter((t) => t.completed).length;

  return (
    <div className="space-y-8 font-sans text-stone-900 dark:text-stone-100 bg-[#fbf9f5] dark:bg-[#131518] p-6 md:p-10 rounded-3xl border border-stone-200/80 dark:border-[#22272e] shadow-sm transition-colors">
      {/* Swiss Top Nav */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-200/80 dark:border-[#22272e] text-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 font-bold tracking-tight text-sm">
            <span>ACH1EV</span>
            <span className="text-stone-400">◆</span>
            <span className="font-mono text-[10px] text-stone-400">SETTLE IDEAS</span>
          </div>

          <div className="flex items-center gap-5 font-mono text-[11px] uppercase tracking-wider">
            <span className="font-bold border-b-2 border-[#9e5d53] pb-0.5 text-stone-900 dark:text-white">
              Home
            </span>
            <span className="text-stone-400 hover:text-stone-900 dark:hover:text-white cursor-pointer">
              Subjects
            </span>
            <span className="text-stone-400 hover:text-stone-900 dark:hover:text-white cursor-pointer">
              Planner
            </span>
            <span className="text-stone-400 hover:text-stone-900 dark:hover:text-white cursor-pointer">
              Resources
            </span>
            <span className="text-stone-400 hover:text-stone-900 dark:hover:text-white cursor-pointer">
              Notes
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono uppercase tracking-widest text-stone-500">
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline border-l border-stone-200 dark:border-stone-800 pl-4 text-stone-400">
            DISCIPLINE HEALS
          </span>
        </div>
      </div>

      {/* Massive Display Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-2">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-stone-400 block mb-1">
            GOOD MORNING
          </span>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-stone-950 dark:text-white leading-none">
            Cockpit
          </h1>
          <div className="text-xs font-mono uppercase tracking-widest text-stone-400 mt-3">
            TUESDAY, 27 MAY 2025
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs font-mono uppercase tracking-widest text-stone-600 dark:text-stone-400">
            A CALMER MIND
          </div>
          <div className="text-xs font-mono uppercase tracking-widest text-stone-600 dark:text-stone-400 font-bold">
            A BRIGHTER DOCTOR
          </div>
          <div className="w-8 h-0.5 bg-red-600 ml-auto mt-2" />
        </div>
      </div>

      {/* Horizontal Date Strip (Calendar) */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#12141a] border border-stone-200 dark:border-stone-800 flex items-center justify-between gap-2 overflow-x-auto">
        <div className="text-xs font-mono font-bold uppercase tracking-wider text-stone-400 shrink-0 pr-3 border-r border-stone-200 dark:border-stone-800">
          MAY 2025
        </div>

        <div className="flex items-center gap-4 md:gap-8 mx-auto">
          {datesStrip.map((item, idx) => {
            const isSelected = idx === activeDateIndex;
            return (
              <button
                key={idx}
                onClick={() => setActiveDateIndex(idx)}
                className="flex flex-col items-center gap-1 group"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-red-700 text-white shadow-sm scale-110'
                      : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                  }`}
                >
                  {item.day < 10 ? `0${item.day}` : item.day}
                </div>
                <span className="text-[9px] font-mono text-stone-400 uppercase tracking-widest">
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1 text-stone-400 shrink-0 pl-3 border-l border-stone-200 dark:border-stone-800">
          <button className="p-1 hover:text-stone-900 dark:hover:text-white">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="p-1 hover:text-stone-900 dark:hover:text-white">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Swiss Grid: Left Subjects (01, 02, 03) | Right Tasks & Reminders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
        {/* Left Column: Numbered Subjects (Span 6) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="text-sm font-semibold font-mono uppercase tracking-widest text-stone-400 pb-2 border-b border-stone-200 dark:border-stone-800">
            SUBJECTS
          </div>

          <div className="space-y-6">
            {subjects.map((subj) => (
              <div
                key={subj.num}
                onClick={() => onSelectSubject(subj.course)}
                className="group cursor-pointer pb-6 border-b border-stone-200 dark:border-stone-800 flex items-baseline justify-between transition-colors"
              >
                <div className="flex items-baseline gap-4">
                  <span className="text-2xl font-bold font-mono text-red-600">
                    {subj.num}
                  </span>
                  <div>
                    <h2 className="text-4xl font-bold tracking-tight text-stone-950 dark:text-white group-hover:text-red-600 transition-colors">
                      {subj.title}
                    </h2>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-stone-400 mt-1">
                      {subj.tags}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-stone-300 dark:text-stone-600 group-hover:text-stone-900 dark:group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Tasks (Span 4) + Reminders & Quick Links (Span 2) */}
        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* Today's Tasks */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-800 text-sm font-semibold font-mono uppercase tracking-widest text-stone-400">
              <span>TODAY'S TASKS</span>
              <span>{completedCount} / {taskList.length}</span>
            </div>

            <div className="space-y-3">
              {taskList.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleSwissTask(task.id)}
                  className="flex items-center gap-3 cursor-pointer group text-xs"
                >
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 border transition-colors ${
                      task.completed
                        ? 'bg-stone-900 border-stone-900 text-white dark:bg-white dark:border-white dark:text-black'
                        : 'border-stone-300 dark:border-stone-700'
                    }`}
                  >
                    {task.completed && <span className="text-[9px]">✓</span>}
                  </div>
                  <span
                    className={`font-medium ${
                      task.completed
                        ? 'line-through text-stone-400'
                        : 'text-stone-900 dark:text-stone-100'
                    }`}
                  >
                    {task.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Reminders & Quick Links */}
          <div className="space-y-6">
            {/* Reminders */}
            <div className="space-y-3">
              <div className="text-sm font-semibold font-mono uppercase tracking-widest text-stone-400 pb-2 border-b border-stone-200 dark:border-stone-800">
                REMINDERS
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                    <span>ANATOMY TEST</span>
                  </div>
                  <div className="text-[10px] font-mono text-stone-400 ml-3">30 MAY 2025</div>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                    <span>PATHOLOGY QUIZ</span>
                  </div>
                  <div className="text-[10px] font-mono text-stone-400 ml-3">02 JUN 2025</div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-3 pt-2">
              <div className="text-sm font-semibold font-mono uppercase tracking-widest text-stone-400 pb-2 border-b border-stone-200 dark:border-stone-800">
                QUICK LINKS
              </div>
              <div className="space-y-2 text-xs font-medium">
                {[
                  { name: 'Past Papers', action: 'open-cal' },
                  { name: 'Flashcards', action: 'open-practical' },
                  { name: 'Clinical Cases', action: 'open-book' },
                  { name: 'Book Library', action: 'open-book' },
                ].map((link, idx) => (
                  <div
                    key={idx}
                    onClick={() => onOpenStudio(link.action)}
                    className="flex items-center justify-between text-stone-700 dark:text-stone-300 hover:text-red-600 cursor-pointer group py-0.5"
                  >
                    <span>{link.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-stone-300 group-hover:translate-x-1 group-hover:text-red-600 transition-all" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Swiss Bottom Line */}
      <div className="pt-6 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-stone-400">
        <span>SETTLE IDEAS · SMALL STEPS. A BIGGER YOU.</span>
        <span>ACH1EV v1.0.0</span>
      </div>
    </div>
  );
};
