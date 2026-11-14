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
  FileText,
  CheckCircle2,
  Circle,
  X,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface Design8Props {
  userProfile: UserProfile;
  currentSubject: SubjectCourse;
  tasks: StudyTask[];
  onToggleTask: (taskId: string) => void;
  notebooks: Notebook[];
  onOpenNotebook: (id: string) => void;
  onOpenStudio: (actionType?: string) => void;
  onOpenRosterModal: () => void;
}

export const Design8Bookshelf: React.FC<Design8Props> = ({
  userProfile,
  tasks,
  onToggleTask,
  notebooks,
  onOpenNotebook,
  onOpenStudio,
}) => {
  const [selectedBook, setSelectedBook] = useState<{
    title: string;
    subtitle: string;
    progress: number;
    notes: number;
    links: number;
    videos: number;
    color: string;
  } | null>({
    title: 'Pathology',
    subtitle: 'Patterns Explain People',
    progress: 64,
    notes: 42,
    links: 18,
    videos: 27,
    color: 'from-emerald-950 to-green-900',
  });

  const leatherBooks = [
    {
      title: 'Pharmacology',
      subtitle: 'Drugs & Mechanisms',
      subtext: 'DRUGS / A RICHER TOMORROW',
      progress: 78,
      notes: 56,
      links: 22,
      videos: 31,
      bg: 'bg-[#592c23] border-[#3b1912] text-[#f7e6d4]',
      color: 'from-amber-950 to-rose-950',
    },
    {
      title: 'Pathology',
      subtitle: 'Patterns Explain People',
      subtext: 'PATTERNS EXPLAIN PEOPLE · 2ND ED',
      progress: 64,
      notes: 42,
      links: 18,
      videos: 27,
      bg: 'bg-[#1e3b2b] border-[#102419] text-[#e3f4ea]',
      color: 'from-emerald-950 to-green-900',
    },
    {
      title: 'Microbiology',
      subtitle: 'Pathogens & Immunity',
      subtext: 'CULTURES & ANTIMICROBIALS',
      progress: 52,
      notes: 38,
      links: 14,
      videos: 19,
      bg: 'bg-[#1c2e4a] border-[#0f1d30] text-[#e0efff]',
      color: 'from-blue-950 to-cyan-950',
    },
    {
      title: 'Anatomy',
      subtitle: 'Structure Builds Function',
      subtext: 'STRUCTURE BUILDS FUNCTION',
      progress: 84,
      notes: 71,
      links: 29,
      videos: 40,
      bg: 'bg-[#665038] border-[#3d2f20] text-[#faede1]',
      color: 'from-amber-900 to-stone-900',
    },
    {
      title: 'Physiology',
      subtitle: 'Life In Motion',
      subtext: 'LIFE IN MOTION · SYSTEMS',
      progress: 61,
      notes: 49,
      links: 21,
      videos: 25,
      bg: 'bg-[#4a2e22] border-[#291710] text-[#fbeee6]',
      color: 'from-stone-900 to-amber-950',
    },
  ];

  return (
    <div className="space-y-6 font-sans text-[#f2e7d8] rounded-3xl overflow-hidden shadow-2xl border-4 border-[#332014] bg-[#22150d] p-6 md:p-8 relative">
      {/* Top Bookshelf Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#4d3221]/80">
        <div>
          <div className="flex items-center gap-3">
            <AchievBrand variant="lockup" isDarkMode={true} emblemClassName="w-10 h-10 shrink-0" imgClassName="h-9 w-auto" />
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
              Cockpit · Bookshelf
            </span>
          </div>
          <p className="text-xs italic text-amber-300/80 mt-1">
            "Settle Ideas · Same chapters. A brighter you."
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search books, notes, topics..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-[#150d08] border border-[#523724] text-white placeholder-stone-400 focus:outline-none focus:border-amber-400 font-sans"
            />
          </div>
        </div>
      </div>

      <div className="text-[11px] font-mono tracking-widest text-amber-400/90 uppercase">
        A CALMER PLACE FOR A BRIGHTER DOCTOR
      </div>

      {/* Bookshelf Section (Wooden Shelves with Books) */}
      <div className="space-y-8 relative">
        {/* SHELF 1: Embossed Leather Textbooks with Popover */}
        <div className="relative">
          <div className="flex items-end justify-center sm:justify-start gap-3 md:gap-6 overflow-x-auto pb-1 px-4">
            {leatherBooks.map((book) => {
              const isSelected = selectedBook?.title === book.title;
              return (
                <div
                  key={book.title}
                  onClick={() => setSelectedBook(book)}
                  className={`w-24 sm:w-28 h-56 sm:h-64 rounded-t-xl border-4 ${book.bg} p-3 flex flex-col justify-between cursor-pointer transition-all hover:-translate-y-3 shadow-2xl relative ${
                    isSelected ? 'ring-2 ring-amber-400 scale-102' : ''
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-[8px] font-mono tracking-widest uppercase block text-amber-300/80">
                      MEDICINE
                    </span>
                    <h3 className="text-sm sm:text-base font-bold tracking-tight leading-tight">
                      {book.title}
                    </h3>
                  </div>

                  <div className="w-10 h-10 mx-auto rounded-full border border-amber-300/40 flex items-center justify-center text-xs opacity-70">
                    ⚕
                  </div>

                  <div className="text-[7.5px] font-mono text-center tracking-tight opacity-75">
                    {book.subtext}
                  </div>
                </div>
              );
            })}

            {/* Potted Plant & Book End */}
            <div className="hidden lg:flex flex-col items-center justify-end h-56 pl-4 pb-2 text-center">
              <span className="text-3xl">🌿</span>
              <div className="w-20 p-2 rounded-t bg-[#3d2717] border border-[#6b472a] text-[8px] font-mono text-amber-200 mt-2">
                DISCIPLINE CREATES FREEDOM
              </div>
            </div>
          </div>

          {/* Wooden Shelf Plank 1 */}
          <div className="h-4 w-full bg-gradient-to-r from-[#4d2f1b] via-[#663e24] to-[#4d2f1b] rounded-sm shadow-xl border-t border-[#7a4c2c]" />

          {/* Interactive Popover Modal Over Books */}
          {selectedBook && (
            <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 w-80 p-5 rounded-2xl bg-[#1c130d] border-2 border-amber-600/60 shadow-2xl text-white animate-in zoom-in-95 duration-150">
              <div className="flex items-start justify-between pb-2 mb-3 border-b border-amber-800/60">
                <div>
                  <h3 className="text-xl font-bold">{selectedBook.title}</h3>
                  <p className="text-xs text-amber-300/80 font-mono">
                    {selectedBook.subtitle}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedBook(null)}
                  className="p-1 text-stone-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Progress */}
              <div className="space-y-1 mb-4">
                <div className="flex justify-between text-xs font-mono">
                  <span>Progress</span>
                  <span className="text-amber-400 font-bold">{selectedBook.progress}%</span>
                </div>
                <div className="w-full h-2 bg-stone-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-600 rounded-full"
                    style={{ width: `${selectedBook.progress}%` }}
                  />
                </div>
              </div>

              {/* Counts */}
              <div className="space-y-2 text-xs font-mono mb-4">
                <div className="flex items-center justify-between py-1 border-b border-stone-800">
                  <span className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-amber-400" />
                    <span>Notes</span>
                  </span>
                  <span className="font-bold">{selectedBook.notes}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-stone-800">
                  <span className="flex items-center gap-2">
                    <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
                    <span>Links</span>
                  </span>
                  <span className="font-bold">{selectedBook.links}</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-amber-300" />
                    <span>Videos</span>
                  </span>
                  <span className="font-bold">{selectedBook.videos}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  notebooks[0] && onOpenNotebook(notebooks[0].id);
                  setSelectedBook(null);
                }}
                className="w-full py-2.5 rounded-xl bg-[#8f5f2c] hover:bg-[#a47c43] text-white font-mono text-xs font-bold transition-colors shadow-md"
              >
                Open Book
              </button>
            </div>
          )}
        </div>

        {/* SHELF 2: Framed Motivational Plaques & Curated Book Stacks */}
        <div>
          <div className="flex items-end justify-between gap-4 px-6 pb-1">
            <div className="p-3 rounded-lg bg-[#2e1d13] border border-[#6b472a] text-center w-36 shadow-md">
              <div className="text-[10px] font-sans text-amber-200">
                Better Notes<br />Brighter Tomorrows
              </div>
            </div>

            <div className="flex flex-col gap-1 w-44">
              {['CLINICAL CORRELATIONS', 'HIGH YIELD', 'PAST PAPERS', 'STAY CURIOUS'].map((title, i) => (
                <div
                  key={i}
                  className="py-1 px-2 rounded bg-[#3d2717] border border-[#5c371d] text-[8px] font-mono text-amber-200 text-center tracking-wider"
                >
                  {title}
                </div>
              ))}
            </div>

            <div className="p-3 rounded-lg bg-[#2e1d13] border border-[#6b472a] text-center w-36 shadow-md">
              <div className="text-[10px] font-sans text-amber-200">
                A CALMER MIND<br />A SHARPER YOU
              </div>
            </div>
          </div>
          <div className="h-4 w-full bg-gradient-to-r from-[#4d2f1b] via-[#663e24] to-[#4d2f1b] rounded-sm shadow-xl border-t border-[#7a4c2c]" />
        </div>

        {/* SHELF 3: Wire-bound Student Notebooks */}
        <div>
          <div className="flex items-end justify-start gap-4 px-6 pb-1 overflow-x-auto">
            {['Pharmacology Notes', 'Pathology Notes', 'Microbiology Notes', 'Anatomy Notes', 'Physiology Notes'].map((title, i) => (
              <div
                key={title}
                onClick={() => notebooks[i] ? onOpenNotebook(notebooks[i].id) : onOpenStudio('make-note')}
                className="w-28 h-36 rounded-t-lg bg-[#1a120c] border-2 border-[#5c371d] p-2 flex flex-col justify-between cursor-pointer hover:-translate-y-2 transition-all shadow-md group"
              >
                <div className="w-full flex items-center justify-between border-b border-[#5c371d] pb-1">
                  <span className="text-[8px] font-mono text-amber-300">NOTEBOOK</span>
                  <span className="text-[8px] text-stone-500">Vol {i + 1}</span>
                </div>
                <div className="text-xs font-bold text-amber-100 group-hover:text-amber-300 transition-colors">
                  {title}
                </div>
                <div className="text-[8px] font-mono text-stone-400">Ach1ev Spiral</div>
              </div>
            ))}
          </div>
          <div className="h-4 w-full bg-gradient-to-r from-[#4d2f1b] via-[#663e24] to-[#4d2f1b] rounded-sm shadow-xl border-t border-[#7a4c2c]" />
        </div>
      </div>

      {/* Bottom Mahogany Drawer: Today's Tasks & Next Reminder */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-4 border-t border-[#4d3221]/80">
        {/* Today's Tasks (Span 8) */}
        <div className="md:col-span-8 p-4 rounded-2xl bg-[#1a1009] border border-[#523724] space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-[#3b2719]">
            <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-amber-300">
              Today's Tasks
            </h3>
            <span className="text-[11px] font-mono text-stone-400">Tue, Apr 22, 2025</span>
          </div>

          <div className="space-y-1.5 text-xs font-sans">
            {[
              { title: 'Revise complement system (Immunology)', time: '09:00 AM', done: true },
              { title: 'Solve Pathology PYQs (20 questions)', time: '11:00 AM', done: false },
              { title: 'Watch ANS physiology video (Autonomic NS)', time: '02:00 PM', done: false },
              { title: 'Make notes: Diuretics (Pharmacology)', time: '04:00 PM', done: false },
            ].map((task, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-1.5 rounded-lg hover:bg-[#2b1b11] cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  {task.done ? (
                    <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Circle className="w-4 h-4 text-stone-500" />
                  )}
                  <span className={task.done ? 'line-through text-stone-500' : 'text-stone-200'}>
                    {task.title}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-stone-400">{task.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Next Reminder (Span 4) */}
        <div className="md:col-span-4 p-4 rounded-2xl bg-[#1a1009] border border-[#523724] flex flex-col justify-between">
          <div className="pb-2 border-b border-[#3b2719]">
            <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-amber-300">
              Next Reminder
            </h3>
          </div>

          <div className="my-2">
            <div className="text-xs font-bold text-white">
              Solve Pathology PYQs (20 questions)
            </div>
            <div className="text-xs font-mono text-amber-400 mt-1">11:00 AM</div>
          </div>

          <div className="pt-2 border-t border-[#3b2719] text-right">
            <span className="text-[10px] font-sans italic text-amber-200/80">
              "Progress Today. A Kinder Tomorrow."
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
