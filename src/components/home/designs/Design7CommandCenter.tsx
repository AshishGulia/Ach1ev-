import React, { useState } from 'react';
import {
  SubjectCourse,
  StudyTask,
  Notebook,
  UserProfile,
} from '../../../types';
import { AchievBrand } from '../../common/AchievBrand';
import {
  Search,
  BookOpen,
  Layers,
  FileText,
  Clock,
  Sparkles,
  Image as ImageIcon,
  MessageSquare,
  CheckSquare,
  ArrowRight,
  Settings,
  X,
  Minus,
  Square,
} from 'lucide-react';

interface Design7Props {
  userProfile: UserProfile;
  currentSubject: SubjectCourse;
  tasks: StudyTask[];
  onToggleTask: (taskId: string) => void;
  notebooks: Notebook[];
  onOpenNotebook: (id: string) => void;
  onOpenStudio: (actionType?: string) => void;
  onOpenRosterModal: () => void;
}

export const Design7CommandCenter: React.FC<Design7Props> = ({
  userProfile,
  tasks,
  notebooks,
  onOpenNotebook,
  onOpenStudio,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);

  const commandItems = [
    {
      id: 'cmd-1',
      title: 'Pharmacology > Beta blockers',
      type: 'notebook',
      icon: BookOpen,
      actionLabel: '↵ Open ⤶',
      action: () => notebooks[0] && onOpenNotebook(notebooks[0].id),
    },
    {
      id: 'cmd-2',
      title: 'Histology > Bone',
      type: 'notebook',
      icon: Layers,
      actionLabel: 'Open',
      action: () => notebooks[1] ? onOpenNotebook(notebooks[1].id) : onOpenStudio('open-book'),
    },
    {
      id: 'cmd-3',
      title: 'New notebook',
      type: 'action',
      icon: FileText,
      actionLabel: 'Create',
      action: () => onOpenStudio('make-note'),
    },
    {
      id: 'cmd-4',
      title: 'Start focus 25 min',
      type: 'timer',
      icon: Clock,
      actionLabel: 'Run',
      action: () => onOpenStudio('open-practical'),
    },
  ];

  const filteredItems = commandItems.filter((item) =>
    item.title.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <div className="space-y-10 font-sans text-slate-100 bg-[#0e131d] p-6 md:p-10 rounded-3xl border border-slate-800 shadow-2xl min-h-[680px] flex flex-col justify-between">
      {/* Top Bar with Minimal Header */}
      <div className="flex items-center justify-between text-xs text-slate-400 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2 font-bold text-white tracking-wide">
          <AchievBrand variant="emblem" imgClassName="w-6 h-6" />
          <span>ACH1EV</span>
          <span className="px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 text-[10px] font-mono">
            Settle Ideas · Command Center
          </span>
        </div>

        <div className="flex items-center gap-6">
          <span className="hover:text-white cursor-pointer" onClick={() => onOpenStudio('open-book')}>Library</span>
          <span className="hover:text-white cursor-pointer" onClick={() => onOpenStudio('make-note')}>Notebooks</span>
          <span className="hover:text-white cursor-pointer" onClick={() => onOpenStudio('open-cal')}>Flashcards</span>
          <span className="hover:text-white cursor-pointer">Tasks</span>
          <span className="hover:text-white cursor-pointer">Settings</span>
        </div>

        <div className="hidden sm:flex items-center gap-3 text-slate-500">
          <Minus className="w-3.5 h-3.5" />
          <Square className="w-3 h-3" />
          <X className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Hero Spotlight Command Box */}
      <div className="max-w-2xl mx-auto w-full space-y-6 my-auto">
        <div className="text-center space-y-1">
          <span className="text-xs font-mono uppercase tracking-widest text-slate-400 block font-semibold">
            COMMAND CENTER
          </span>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            Find. Open. Create. Do.
          </h1>
        </div>

        {/* Floating Spotlight Card */}
        <div className="rounded-2xl bg-[#141b29] border border-sky-500/40 shadow-[0_0_40px_rgba(14,165,233,0.15)] overflow-hidden">
          {/* Input Bar */}
          <div className="relative p-3 flex items-center gap-3 border-b border-slate-800">
            <Search className="w-5 h-5 text-sky-400 shrink-0 ml-1" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Open anything..."
              className="flex-1 bg-transparent text-sm md:text-base text-white placeholder-slate-400 focus:outline-none"
              autoFocus
            />
            <span className="px-2 py-1 rounded-md bg-slate-800/80 border border-slate-700 text-xs font-mono text-slate-300">
              Ctrl K
            </span>
          </div>

          {/* Autocomplete items */}
          <div className="divide-y divide-slate-800/60 p-1">
            {filteredItems.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedItemIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => item.action()}
                  onMouseEnter={() => setSelectedItemIndex(idx)}
                  className={`flex items-center justify-between p-3.5 rounded-xl cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-sky-500/10 text-white border border-sky-500/30'
                      : 'hover:bg-slate-800/40 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-sky-400" />
                    <span className="text-sm font-medium">{item.title}</span>
                  </div>
                  <span
                    className={`text-xs font-mono px-2 py-0.5 rounded ${
                      isSelected
                        ? 'bg-sky-500 text-white font-bold'
                        : 'text-slate-500'
                    }`}
                  >
                    {item.actionLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent History Tray */}
      <div className="space-y-3 max-w-5xl mx-auto w-full pt-6">
        <span className="text-[11px] font-mono uppercase tracking-widest text-slate-500 block">
          RECENT
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            { title: 'Acute coronary syndrome', sub: 'Notes · 2h ago', icon: BookOpen, color: 'text-rose-400' },
            { title: 'Liver histology', sub: 'Image · 5h ago', icon: ImageIcon, color: 'text-amber-400' },
            { title: 'Beta blockers', sub: 'Flashcards · 1d ago', icon: MessageSquare, color: 'text-purple-400' },
            { title: 'Exam prep', sub: 'Notebook · 2d ago', icon: FileText, color: 'text-sky-400' },
            { title: 'Read guidelines', sub: 'Task · 3d ago', icon: CheckSquare, color: 'text-amber-400' },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                onClick={() => onOpenStudio('open-book')}
                className="p-3.5 rounded-xl bg-[#141b29] border border-slate-800/90 hover:border-sky-500/50 cursor-pointer transition-all flex items-start gap-3 group"
              >
                <Icon className={`w-4 h-4 ${item.color} mt-0.5 shrink-0 group-hover:scale-110 transition-transform`} />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate group-hover:text-sky-400 transition-colors">
                    {item.title}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">{item.sub}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Status Line */}
        <div className="text-center pt-6 text-xs font-mono text-slate-500">
          <span>{tasks.filter((t) => !t.completed).length} tasks · 2 reminders · 42 flashcards due</span>
        </div>
      </div>
    </div>
  );
};
