import React, { useState } from 'react';
import {
  SubjectCourse,
  StudyTask,
  Notebook,
  UserProfile,
} from '../../../types';
import { AchievBrand } from '../../common/AchievBrand';
import {
  FileText,
  HelpCircle,
  CheckSquare,
  PlusCircle,
  RefreshCw,
  Cloud,
  BookOpen,
  Calendar as CalendarIcon,
  Settings,
  ChevronDown,
  ArrowRight,
  Search,
  CheckCircle2,
  Circle,
  Pill,
  Flame,
  Globe,
  Video,
  FileSpreadsheet,
  Presentation,
  Plus,
} from 'lucide-react';

interface Design2Props {
  userProfile: UserProfile;
  currentSubject: SubjectCourse;
  onSelectSubject: (subject: SubjectCourse) => void;
  tasks: StudyTask[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (task: StudyTask) => void;
  notebooks: Notebook[];
  onOpenNotebook: (id: string) => void;
  onOpenStudio: (actionType?: string) => void;
  onOpenRosterModal: () => void;
  onOpenSettings?: () => void;
}

export const Design2OfficeClassic: React.FC<Design2Props> = ({
  userProfile,
  currentSubject,
  onSelectSubject,
  tasks,
  onToggleTask,
  onAddTask,
  notebooks,
  onOpenNotebook,
  onOpenStudio,
  onOpenRosterModal,
  onOpenSettings,
}) => {
  const [activeRibbonTab, setActiveRibbonTab] = useState<'Home' | 'Setup' | 'Library' | 'Notebooks' | 'Practice' | 'Calendar'>('Home');
  const [taskFilter, setTaskFilter] = useState('All');

  // Office style task table
  const taskRows = [
    { id: 't1', task: 'Read Katzung Ch. 5', subject: 'Pharmacology', priority: 'High', due: 'Apr 16', status: 'Not Started' },
    { id: 't2', task: 'Complete 50 UWorld questions', subject: 'Cardiology', priority: 'Medium', due: 'Apr 16', status: 'In Progress' },
    { id: 't3', task: 'Review renal pathology slides', subject: 'Pathology', priority: 'Medium', due: 'Apr 16', status: 'Not Started' },
    { id: 't4', task: 'Anatomy: Cranial nerves (Anki)', subject: 'Anatomy', priority: 'Low', due: 'Apr 16', status: 'Not Started' },
    { id: 't5', task: 'Summarize lecture notes', subject: 'General', priority: 'Low', due: 'Apr 16', status: 'Not Started' },
    { id: 't6', task: 'Plan study schedule for weekend', subject: 'General', priority: 'Medium', due: 'Apr 16', status: 'Not Started' },
  ];

  const [rowStatus, setRowStatus] = useState<Record<string, boolean>>({
    t2: true,
  });

  const toggleRow = (id: string) => {
    setRowStatus((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-4 font-sans text-stone-800 dark:text-stone-100 bg-[#f8f7f4] dark:bg-[#14181c] p-4 rounded-2xl border border-stone-200/80 dark:border-[#222930] shadow-sm transition-colors">
      {/* Office Mineral Slate Ribbon Bar */}
      <div className="bg-[#3e586d] dark:bg-[#253746] text-white rounded-xl shadow-md overflow-hidden">
        {/* Top Header Row */}
        <div className="px-4 py-2 flex items-center justify-between border-b border-sky-400/20">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 font-bold tracking-tight text-sm">
              <AchievBrand variant="emblem" imgClassName="w-5 h-5" />
              <span>ACH1EV</span>
              <span className="text-blue-200 text-xs font-normal">| Cockpit</span>
            </div>
            {/* Ribbon Tabs */}
            <div className="flex items-center gap-0.5 ml-4">
              {['Home', 'Setup', 'Library', 'Notebooks', 'Practice', 'Calendar'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveRibbonTab(tab as any)}
                  className={`px-3 py-1 text-xs font-medium rounded-t transition-colors ${
                    activeRibbonTab === tab
                      ? 'bg-white text-[#005a9e] font-bold shadow-xs'
                      : 'text-blue-100 hover:bg-blue-600/50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-blue-200 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search Ach1ev (Ctrl+Q)"
                className="pl-8 pr-2 py-1 text-xs rounded bg-blue-800/60 border border-blue-400/40 text-white placeholder-blue-300 focus:outline-none w-48"
              />
            </div>
            <div className="flex items-center gap-1.5 text-xs text-blue-100">
              <span className="w-6 h-6 rounded-full bg-blue-400/30 flex items-center justify-center font-bold text-[10px]">
                DR
              </span>
              <span>Dr. {userProfile.name.split(' ')[0] || 'Student'}</span>
              <ChevronDown className="w-3 h-3" />
            </div>
          </div>
        </div>

        {/* Action Ribbon Toolbar */}
        <div className="bg-[#f0f4f9] dark:bg-[#151c28] text-slate-700 dark:text-zinc-200 p-2 flex items-stretch gap-4 overflow-x-auto border-b border-slate-300 dark:border-slate-800 text-[11px]">
          {/* Create Group */}
          <div className="flex items-center gap-2 pr-4 border-r border-slate-300 dark:border-slate-700">
            <button
              onClick={() => onOpenStudio('make-note')}
              className="flex flex-col items-center justify-center px-2 py-1 hover:bg-blue-100 dark:hover:bg-slate-800 rounded transition-colors group"
            >
              <FileText className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
              <span className="mt-1 font-medium">New Note</span>
            </button>
            <button
              onClick={() => onOpenStudio('open-cal')}
              className="flex flex-col items-center justify-center px-2 py-1 hover:bg-blue-100 dark:hover:bg-slate-800 rounded transition-colors group"
            >
              <HelpCircle className="w-5 h-5 text-indigo-600 group-hover:scale-110 transition-transform" />
              <span className="mt-1 font-medium">New Quiz</span>
            </button>
            <button
              onClick={() => onOpenRosterModal()}
              className="flex flex-col items-center justify-center px-2 py-1 hover:bg-blue-100 dark:hover:bg-slate-800 rounded transition-colors group"
            >
              <CheckSquare className="w-5 h-5 text-amber-600 group-hover:scale-110 transition-transform" />
              <span className="mt-1 font-medium">New Task</span>
            </button>
            <button
              onClick={() => onOpenStudio('open-book')}
              className="flex flex-col items-center justify-center px-2 py-1 hover:bg-blue-100 dark:hover:bg-slate-800 rounded transition-colors group"
            >
              <PlusCircle className="w-5 h-5 text-purple-600 group-hover:scale-110 transition-transform" />
              <span className="mt-1 font-medium">Add Resource ▾</span>
            </button>
            <div className="text-[9px] uppercase font-mono text-slate-400 self-end text-center w-full">Create</div>
          </div>

          {/* Tools Group */}
          <div className="flex items-center gap-2 pr-4 border-r border-slate-300 dark:border-slate-700">
            <button
              onClick={() => {}}
              className="flex flex-col items-center justify-center px-2 py-1 hover:bg-blue-100 dark:hover:bg-slate-800 rounded transition-colors"
            >
              <RefreshCw className="w-5 h-5 text-cyan-600" />
              <span className="mt-1 font-medium">Sync</span>
            </button>
            <button
              onClick={() => {}}
              className="flex flex-col items-center justify-center px-2 py-1 hover:bg-blue-100 dark:hover:bg-slate-800 rounded transition-colors"
            >
              <Cloud className="w-5 h-5 text-blue-500" />
              <span className="mt-1 font-medium">Back Up ▾</span>
            </button>
            <div className="text-[9px] uppercase font-mono text-slate-400 self-end text-center w-full">Tools</div>
          </div>

          {/* Study Group */}
          <div className="flex items-center gap-2 pr-4 border-r border-slate-300 dark:border-slate-700">
            <button
              onClick={() => onOpenStudio('open-book')}
              className="flex flex-col items-center justify-center px-2 py-1 hover:bg-blue-100 dark:hover:bg-slate-800 rounded transition-colors"
            >
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <span className="mt-1 font-medium">View Library</span>
            </button>
            <button
              onClick={() => notebooks[0] && onOpenNotebook(notebooks[0].id)}
              className="flex flex-col items-center justify-center px-2 py-1 hover:bg-blue-100 dark:hover:bg-slate-800 rounded transition-colors"
            >
              <FileText className="w-5 h-5 text-[#8f5f2c]" />
              <span className="mt-1 font-medium">Open Notebook</span>
            </button>
            <button
              onClick={() => onOpenStudio('open-practical')}
              className="flex flex-col items-center justify-center px-2 py-1 hover:bg-blue-100 dark:hover:bg-slate-800 rounded transition-colors"
            >
              <Flame className="w-5 h-5 text-rose-600" />
              <span className="mt-1 font-medium">Practice Mode</span>
            </button>
            <div className="text-[9px] uppercase font-mono text-slate-400 self-end text-center w-full">Study</div>
          </div>

          {/* Navigate Group */}
          <div className="flex items-center gap-2 pr-4 border-r border-slate-300 dark:border-slate-700">
            <button
              onClick={onOpenRosterModal}
              className="flex flex-col items-center justify-center px-2 py-1 hover:bg-blue-100 dark:hover:bg-slate-800 rounded transition-colors"
            >
              <CalendarIcon className="w-5 h-5 text-sky-600" />
              <span className="mt-1 font-medium">Today</span>
            </button>
            <button
              onClick={onOpenRosterModal}
              className="flex flex-col items-center justify-center px-2 py-1 hover:bg-blue-100 dark:hover:bg-slate-800 rounded transition-colors"
            >
              <CalendarIcon className="w-5 h-5 text-amber-600" />
              <span className="mt-1 font-medium">Next 7 Days</span>
            </button>
            <div className="text-[9px] uppercase font-mono text-slate-400 self-end text-center w-full">Navigate</div>
          </div>

          {/* Support Group */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSettings}
              className="flex flex-col items-center justify-center px-2 py-1 hover:bg-blue-100 dark:hover:bg-slate-800 rounded transition-colors"
            >
              <Settings className="w-5 h-5 text-slate-600 dark:text-zinc-400" />
              <span className="mt-1 font-medium">Settings</span>
            </button>
            <button
              onClick={() => {}}
              className="flex flex-col items-center justify-center px-2 py-1 hover:bg-blue-100 dark:hover:bg-slate-800 rounded transition-colors"
            >
              <HelpCircle className="w-5 h-5 text-blue-600" />
              <span className="mt-1 font-medium">Help</span>
            </button>
            <div className="text-[9px] uppercase font-mono text-slate-400 self-end text-center w-full">Support</div>
          </div>
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (Span 8): Study Subjects & Today's Tasks Table */}
        <div className="lg:col-span-8 space-y-4">
          {/* Study Subjects */}
          <div className="p-4 rounded-xl bg-white dark:bg-[#121622] border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-zinc-100">
                Study Subjects
              </h2>
              <button
                onClick={() => onSelectSubject('Pharmacology')}
                className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>View All Subjects</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { title: 'Pharmacology', notes: 342, questions: '1,280', icon: Pill, color: 'text-blue-600', subject: 'Pharmacology' as SubjectCourse },
                { title: 'Pathology', notes: 281, questions: '980', icon: Flame, color: 'text-rose-600', subject: 'Pathology' as SubjectCourse },
                { title: 'Anatomy', notes: 412, questions: '1,540', icon: BookOpen, color: 'text-amber-700', subject: 'Anatomy' as SubjectCourse },
              ].map((subj) => {
                const Icon = subj.icon;
                return (
                  <div
                    key={subj.title}
                    onClick={() => onSelectSubject(subj.subject)}
                    className="p-3.5 rounded-lg border border-slate-200/90 dark:border-slate-700/80 hover:border-blue-500 cursor-pointer transition-all bg-slate-50/50 dark:bg-[#151a28] flex flex-col justify-between group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Icon className={`w-6 h-6 ${subj.color}`} />
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 group-hover:text-blue-500 transition-all" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {subj.title}
                      </h3>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                        Notes {subj.notes} | Questions {subj.questions}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Today's Tasks Table */}
          <div className="p-4 rounded-xl bg-white dark:bg-[#121622] border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-zinc-100">
                Today's Tasks
              </h2>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500">Filter:</span>
                <select
                  value={taskFilter}
                  onChange={(e) => setTaskFilter(e.target.value)}
                  className="px-2 py-0.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#151a28] text-xs font-medium"
                >
                  <option>All</option>
                  <option>High Priority</option>
                  <option>Pharmacology</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 uppercase font-mono">
                    <th className="py-2 px-2 w-8"></th>
                    <th className="py-2 px-2">Task</th>
                    <th className="py-2 px-2">Subject</th>
                    <th className="py-2 px-2">Priority</th>
                    <th className="py-2 px-2">Due</th>
                    <th className="py-2 px-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {taskRows.map((row) => {
                    const isChecked = !!rowStatus[row.id];
                    return (
                      <tr
                        key={row.id}
                        onClick={() => toggleRow(row.id)}
                        className="hover:bg-blue-50/40 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                      >
                        <td className="py-2.5 px-2">
                          {isChecked ? (
                            <CheckCircle2 className="w-4 h-4 text-blue-600" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-400" />
                          )}
                        </td>
                        <td className={`py-2.5 px-2 font-medium ${isChecked ? 'line-through text-slate-400' : 'text-slate-900 dark:text-zinc-100'}`}>
                          {row.task}
                        </td>
                        <td className="py-2.5 px-2 text-slate-600 dark:text-zinc-400 font-mono text-[11px]">
                          {row.subject}
                        </td>
                        <td className="py-2.5 px-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              row.priority === 'High'
                                ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                                : row.priority === 'Medium'
                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                            }`}
                          >
                            ↑ {row.priority}
                          </span>
                        </td>
                        <td className="py-2.5 px-2 text-slate-500 font-mono text-[11px]">{row.due}</td>
                        <td className="py-2.5 px-2">
                          <span
                            className={`text-[11px] font-medium ${
                              isChecked
                                ? 'text-[#8f5f2c] dark:text-amber-400'
                                : 'text-slate-500'
                            }`}
                          >
                            {isChecked ? 'Complete' : row.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (Span 4): Calendar + Today at a Glance + Reminders */}
        <div className="lg:col-span-4 space-y-4">
          {/* Calendar Card */}
          <div className="p-4 rounded-xl bg-white dark:bg-[#121622] border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-zinc-100">
                Calendar
              </h3>
              <span className="text-xs font-mono font-bold text-slate-600 dark:text-zinc-400">
                April 2025
              </span>
            </div>

            <div className="grid grid-cols-7 text-center text-[10px] font-mono text-slate-400 mb-1">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-xs font-mono">
              <span className="text-slate-300">30</span>
              <span className="text-slate-300">31</span>
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
              <span>15</span>
              <span className="w-6 h-6 mx-auto rounded bg-blue-600 text-white font-bold flex items-center justify-center">
                16
              </span>
              <span>17</span>
              <span>18</span>
              <span>19</span>
              <span>20</span>
              <span>21</span>
              <span>22</span>
              <span>23</span>
              <span>24</span>
              <span>25</span>
              <span>26</span>
              <span>27</span>
              <span>28</span>
              <span>29</span>
              <span>30</span>
            </div>
          </div>

          {/* Today at a Glance Agenda */}
          <div className="p-4 rounded-xl bg-white dark:bg-[#121622] border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-zinc-100">
                  Today at a Glance
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">Wed, Apr 16, 2025</span>
              </div>
              <button
                onClick={onOpenRosterModal}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium"
              >
                <span>View Agenda</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2.5">
              {[
                { time: '9:00 AM - 10:00 AM', title: 'Study Pharmacology', icon: BookOpen },
                { time: '10:30 AM - 12:00 PM', title: 'Complete QBank (Cardio)', icon: CheckSquare },
                { time: '1:00 PM - 2:00 PM', title: 'Review Pathology Notes', icon: FileText },
                { time: '3:00 PM - 4:00 PM', title: 'Small Group Discussion', icon: Globe },
                { time: '6:00 PM - 7:00 PM', title: 'Gym / Wellness', icon: Flame },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-2 rounded-lg bg-slate-50 dark:bg-[#151a28] border border-slate-200/60 dark:border-slate-800 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className="w-4 h-4 text-blue-600 shrink-0" />
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                          {item.title}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">{item.time}</div>
                      </div>
                    </div>
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reminders List */}
          <div className="p-4 rounded-xl bg-white dark:bg-[#121622] border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-zinc-100">
                Reminders
              </h3>
              <span className="text-xs text-blue-600 font-medium cursor-pointer hover:underline">
                View All →
              </span>
            </div>

            <div className="space-y-2">
              {[
                { title: 'NBME Step 1 registration deadline', date: 'Apr 25, 2025' },
                { title: 'Immunization records due', date: 'May 1, 2025' },
                { title: 'Clinical skills OSCE', date: 'May 12, 2025' },
                { title: 'Research meeting with Dr. Khan', date: 'Apr 17, 2025' },
                { title: 'Submit elective application', date: 'May 5, 2025' },
              ].map((rem, idx) => (
                <div key={idx} className="flex items-start justify-between gap-2 text-xs py-1">
                  <span className="text-slate-800 dark:text-zinc-200 font-medium truncate">
                    {rem.title}
                  </span>
                  <span className="text-slate-400 font-mono text-[10px] shrink-0">
                    {rem.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access Dock */}
      <div className="p-4 rounded-xl bg-white dark:bg-[#121622] border border-slate-200 dark:border-slate-800 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-zinc-100 mb-3">
          Quick Access
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
          {[
            { name: 'Google', sub: 'Search the web', icon: Globe, color: 'text-rose-500' },
            { name: 'Google Slides', sub: 'Create & edit slides', icon: Presentation, color: 'text-amber-500' },
            { name: 'Google Sheets', sub: 'Data & schedules', icon: FileSpreadsheet, color: 'text-amber-600' },
            { name: 'YouTube', sub: 'Educational videos', icon: Video, color: 'text-red-600' },
            { name: 'PubMed', sub: 'Search biomedical literature', icon: BookOpen, color: 'text-blue-700' },
            { name: 'Add Shortcut', sub: '', icon: Plus, color: 'text-slate-400' },
          ].map((dock, idx) => {
            const Icon = dock.icon;
            return (
              <div
                key={idx}
                className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-blue-500 bg-slate-50/50 dark:bg-[#151a28] cursor-pointer transition-all flex flex-col justify-between"
              >
                <Icon className={`w-6 h-6 ${dock.color} mb-2`} />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {dock.name}
                  </div>
                  {dock.sub && (
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                      {dock.sub}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Classic Windows Status Bar */}
      <div className="px-4 py-2 bg-slate-100 dark:bg-[#0c1017] rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-500">
        <div className="flex items-center gap-3">
          <span>Ready</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-[#8f5f2c] dark:text-amber-400">
            <span className="w-2 h-2 rounded-full bg-[#8f5f2c] dark:bg-amber-400" />
            Synced just now
          </span>
          <span>Offline copies available</span>
        </div>
      </div>
    </div>
  );
};
