import React, { useState } from 'react';
import {
  SubjectCourse,
  StudyTask,
  Notebook,
  UserProfile,
} from '../../../types';
import { AchievBrand } from '../../common/AchievBrand';
import {
  CheckCircle2,
  Circle,
  BookOpen,
  Calendar as CalendarIcon,
  Coffee,
  Heart,
  Stethoscope,
  Sparkles,
} from 'lucide-react';

interface Design4Props {
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

export const Design4StudyDesk: React.FC<Design4Props> = ({
  userProfile,
  tasks,
  onToggleTask,
  notebooks,
  onOpenNotebook,
  onOpenStudio,
  onOpenRosterModal,
}) => {
  const [checklist, setChecklist] = useState([
    { id: 'c1', text: 'Read Pharmacology (CNS)', completed: true },
    { id: 'c2', text: 'Revise Histology (Epithelial)', completed: true },
    { id: 'c3', text: 'Watch Physiology lect. (CVS)', completed: false },
    { id: 'c4', text: 'Make notes', completed: false },
    { id: 'c5', text: 'MCQs (50)', completed: false },
    { id: 'c6', text: 'Gym / Walk', completed: false },
    { id: 'c7', text: 'Be proud :)', completed: false },
  ]);

  const toggleChecklistItem = (id: string) => {
    setChecklist(
      checklist.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  return (
    <div className="relative font-sans text-stone-800 rounded-3xl overflow-hidden shadow-2xl border-4 border-[#5a3e28] bg-[#6d4c33]">
      {/* Wood Desk Texture Overlay */}
      <div
        className="p-6 md:p-8 space-y-6"
        style={{
          background: 'linear-gradient(135deg, #7c583b 0%, #5d3f29 50%, #4a301e 100%)',
        }}
      >
        {/* Top Header Bar on Wood */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#8e6848]/60 text-[#f6eee3]">
          <div className="flex items-center gap-3">
            <AchievBrand variant="emblem" imgClassName="w-8 h-8" />
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-wide">
                Ach1ev Desk
              </h1>
              <p className="text-xs italic text-amber-200/80">
                Settle Ideas · Study Today. Heal Tomorrow.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono bg-[#482e1b]/70 px-3 py-1.5 rounded-full border border-[#8e6848]/60">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Study Sanctum · Design 4: Expanded</span>
          </div>
        </div>

        {/* Desk Flat-lay Top Accessories: Plant, Sticky Note, Flip Calendar, Coffee Mug */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
          {/* Potted Plant & Book Edge */}
          <div className="p-4 rounded-2xl bg-[#523722]/80 border border-[#855f3f] text-[#f7eee4] flex items-center gap-3 shadow-md">
            <div className="w-14 h-14 rounded-full bg-emerald-950/70 border-2 border-emerald-600/40 flex items-center justify-center text-emerald-300 shrink-0">
              <span className="text-2xl">🌿</span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 block">
                Fresh Mindset
              </span>
              <p className="text-xs font-bold font-sans leading-tight">
                Good Doctors Brighter Tomorrows
              </p>
            </div>
          </div>

          {/* Yellow Post-It Sticky Note */}
          <div className="p-4 rounded-xl bg-[#ffef9e] text-stone-900 border border-[#e5d47e] shadow-lg -rotate-1 hover:rotate-0 transition-transform flex flex-col justify-between">
            <div className="font-handwriting text-lg leading-snug">
              You can Do this!
            </div>
            <div className="text-right text-xs font-handwriting text-stone-600 mt-2">
              – Ach1ev ❤️
            </div>
          </div>

          {/* Desktop Ring Flip Calendar */}
          <div
            onClick={onOpenRosterModal}
            className="p-3 rounded-xl bg-white text-stone-900 shadow-xl border-t-8 border-t-[#3b2719] cursor-pointer hover:scale-[1.02] transition-transform"
          >
            <div className="flex items-center justify-between pb-1 mb-1 border-b border-stone-200">
              <span className="text-xs font-bold font-sans">April 2025</span>
              <span className="text-[9px] font-mono text-stone-400">📅 Desk Flip</span>
            </div>
            <div className="grid grid-cols-7 text-center text-[8.5px] font-mono text-stone-400 mb-1">
              <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
            </div>
            <div className="grid grid-cols-7 gap-0.5 text-center text-[10px] font-mono font-semibold">
              <span className="text-stone-300">30</span>
              <span className="text-stone-300">31</span>
              <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
              <span>6</span><span>7</span><span>8</span><span>9</span><span>10</span><span>11</span><span>12</span>
              <span>13</span><span>14</span><span>15</span><span>16</span><span>17</span><span>18</span><span>19</span>
              <span>20</span><span>21</span>
              <span className="w-4 h-4 mx-auto rounded-full bg-rose-600 text-white flex items-center justify-center font-bold">
                22
              </span>
              <span>23</span><span>24</span><span>25</span><span>26</span>
              <span>27</span><span>28</span><span>29</span><span>30</span>
            </div>
            <div className="mt-1 text-[9px] font-sans italic text-center text-stone-500">
              "Small Steps Big Progress"
            </div>
          </div>

          {/* Ceramic Coffee Mug */}
          <div className="p-4 rounded-2xl bg-[#4b321f]/90 border border-[#7d5637] text-white flex items-center gap-3 shadow-md">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#f8f5ee] to-[#d6c7b2] p-1.5 shadow-inner shrink-0 flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-[#3d2312] border-2 border-[#5c371d] flex items-center justify-center text-amber-300/80">
                <Coffee className="w-5 h-5 text-amber-200" />
              </div>
            </div>
            <div>
              <span className="text-[9px] font-mono uppercase tracking-widest text-amber-300">
                Espresso Fuel
              </span>
              <p className="text-xs font-bold uppercase tracking-tight text-white leading-tight">
                MEDICINE PEOPLE PURPOSE
              </p>
            </div>
          </div>
        </div>

        {/* Main Flat-lay Surface: 3 Notebooks + Lined Notepad Checklist */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* 3 Notebooks Laid on the Desk (Span 8) */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Notebook 1: Pharmacology (Brown Leather) */}
            <div
              onClick={() => notebooks[0] && onOpenNotebook(notebooks[0].id)}
              className="group cursor-pointer rounded-2xl bg-[#592c23] border-4 border-[#3b1912] p-5 shadow-2xl transition-all hover:-translate-y-2 text-[#f6ebd9] flex flex-col justify-between min-h-[340px] relative overflow-hidden"
            >
              {/* Leather texture foil banner */}
              <div className="space-y-1">
                <div className="text-[10px] uppercase font-mono tracking-widest text-amber-300/90 font-bold">
                  STUDY VOLUME I
                </div>
                <h3 className="text-xl font-bold font-sans tracking-tight text-white group-hover:text-amber-200 transition-colors">
                  Pharmacology
                </h3>
                <div className="text-[10px] font-mono text-amber-200/70">
                  DRUGS | MECHANISMS | THERAPY
                </div>
              </div>

              {/* Chemical Structure Graphic */}
              <div className="my-6 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-[#421d16] border-2 border-[#824436] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <div className="text-3xl text-amber-200">⬡</div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#824436]/60">
                <p className="text-[11px] font-sans italic text-amber-100/90">
                  Better Therapies Brighter Lives
                </p>
                <div className="mt-2 text-[10px] font-mono text-amber-300 flex items-center justify-between">
                  <span>Open Notebook →</span>
                  <span>142 Notes</span>
                </div>
              </div>
            </div>

            {/* Notebook 2: Histology (Blue Spiral) */}
            <div
              onClick={() => notebooks[1] ? onOpenNotebook(notebooks[1].id) : onOpenStudio('make-note')}
              className="group cursor-pointer rounded-2xl bg-[#1c324a] border-4 border-[#122030] p-5 shadow-2xl transition-all hover:-translate-y-2 text-[#ebf3fa] flex flex-col justify-between min-h-[340px] relative overflow-hidden"
            >
              <div className="space-y-1">
                <div className="text-[10px] uppercase font-mono tracking-widest text-cyan-300 font-bold">
                  STUDY VOLUME II
                </div>
                <h3 className="text-xl font-bold font-sans tracking-tight text-white group-hover:text-cyan-200 transition-colors">
                  Histology
                </h3>
                <div className="text-[10px] font-mono text-cyan-200/70">
                  CELLS | TISSUES | LIFE
                </div>
              </div>

              {/* Microscopy Tissue Graphic */}
              <div className="my-6 flex items-center justify-center">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-900 to-indigo-900 border-2 border-indigo-400/40 p-2 shadow-inner group-hover:scale-105 transition-transform flex items-center justify-center text-center">
                  <span className="text-xs font-mono text-purple-200">Microscopy Stain</span>
                </div>
              </div>

              <div className="pt-3 border-t border-indigo-700/60">
                <p className="text-[11px] font-sans italic text-cyan-100/90">
                  See the Small Discover the Big
                </p>
                <div className="mt-2 text-[10px] font-mono text-cyan-300 flex items-center justify-between">
                  <span>Open Notebook →</span>
                  <span>98 Notes</span>
                </div>
              </div>
            </div>

            {/* Notebook 3: Physiology (Green Hardcover) */}
            <div
              onClick={() => notebooks[2] ? onOpenNotebook(notebooks[2].id) : onOpenStudio('make-note')}
              className="group cursor-pointer rounded-2xl bg-[#20402e] border-4 border-[#13271c] p-5 shadow-2xl transition-all hover:-translate-y-2 text-[#eaf4ed] flex flex-col justify-between min-h-[340px] relative overflow-hidden"
            >
              <div className="space-y-1">
                <div className="text-[10px] uppercase font-mono tracking-widest text-emerald-300 font-bold">
                  STUDY VOLUME III
                </div>
                <h3 className="text-xl font-bold font-sans tracking-tight text-white group-hover:text-emerald-200 transition-colors">
                  Physiology
                </h3>
                <div className="text-[10px] font-mono text-emerald-200/70">
                  FUNCTION | REGULATION | LIFE
                </div>
              </div>

              {/* Anatomical Heart & Rhythm Sketch */}
              <div className="my-6 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-[#152b1f] border-2 border-emerald-500/40 flex items-center justify-center text-emerald-300 group-hover:scale-105 transition-transform">
                  <div className="text-2xl font-mono">🫀 ∿</div>
                </div>
              </div>

              <div className="pt-3 border-t border-emerald-700/60">
                <p className="text-[11px] font-sans italic text-emerald-100/90">
                  Systems in Balance Life in Motion
                </p>
                <div className="mt-2 text-[10px] font-mono text-emerald-300 flex items-center justify-between">
                  <span>Open Notebook →</span>
                  <span>115 Notes</span>
                </div>
              </div>
            </div>
          </div>

          {/* Lined Paper Checklist: "Today" (Span 4) */}
          <div className="lg:col-span-4 rounded-2xl bg-[#fdfaf3] text-stone-900 border-4 border-[#dfd4c2] p-5 shadow-2xl relative min-h-[360px] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-rose-300">
                <h3 className="text-xl font-bold font-sans tracking-tight text-stone-900">
                  Today
                </h3>
                <span className="text-xs font-mono text-stone-500">
                  Date: 22 Apr 2025
                </span>
              </div>

              {/* Lined Paper checklist items */}
              <div className="space-y-3 font-sans">
                {checklist.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleChecklistItem(item.id)}
                    className="flex items-center gap-2.5 cursor-pointer group"
                  >
                    {item.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-[#8f5f2c] shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-stone-400 shrink-0 group-hover:text-stone-700" />
                    )}
                    <span
                      className={`text-xs ${
                        item.completed
                          ? 'line-through text-stone-400 italic'
                          : 'text-stone-800 font-medium'
                      }`}
                    >
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-stone-200 text-center font-handwriting text-sm text-amber-900">
              A healthier you for a kinder world. ❤️
            </div>
          </div>
        </div>

        {/* Bottom Desk Accessories: Stethoscope, Pen, Coaster */}
        <div className="pt-4 border-t border-[#8e6848]/60 flex flex-col md:flex-row items-center justify-between gap-4 text-[#f6eee3]">
          {/* Stethoscope */}
          <div className="flex items-center gap-2 text-xs font-mono text-amber-200">
            <Stethoscope className="w-5 h-5 text-amber-300" />
            <span>Clinical Stethoscope on Desk Surface</span>
          </div>

          {/* Engraved Pen */}
          <div className="px-5 py-2 rounded-full bg-[#1a120c] border border-[#a17855] text-amber-200 text-xs font-sans italic tracking-wider shadow-md">
            Good Doctors Brighter Tomorrows ✒️
          </div>

          {/* Coaster */}
          <div className="w-36 h-10 rounded-xl bg-[#4a301e] border-2 border-[#8e6848] flex items-center justify-center text-[10px] font-mono font-bold tracking-widest text-amber-300 shadow-md">
            DISCIPLINE CREATES FREEDOM
          </div>
        </div>
      </div>
    </div>
  );
};
