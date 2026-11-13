import './atelier.css';
import React, { useState, useEffect } from 'react';
import { SubjectCourse, StudyTask, UserProfile, RosterEvent, DesignId, MedicalBook, Notebook } from '../../types';
import {
  Search,
  Settings,
  Plus,
  Trash2,
  AlarmClock,
  X,
  Calendar,
  Check,
  BookOpenText,
  Paperclip,
  HardDrive,
  Star,
  Sparkles,
  BookOpen,
  ExternalLink,
  Smartphone,
  Monitor,
  ChevronRight,
  FileCode,
  Tag,
  MoveVertical,
  MessageSquareCode,
  Bot,
  Activity,
  Pencil,
} from 'lucide-react';

export interface TrackerItem {
  id: string;
  n: string;
  type: 'arch' | 'ring' | 'bars' | 'dots';
  v: number;
  g: number;
  u: string;
  step: number;
}

export interface TrackerPreset {
  name: string;
  category: 'Academics' | 'Clinical' | 'Cognitive' | 'Wellness';
  type: 'arch' | 'ring' | 'bars' | 'dots';
  goal: number;
  val: number;
  unit: string;
  step: number;
  icon: string;
  desc: string;
}

export const MEDICAL_TRACKER_PRESETS: TrackerPreset[] = [
  // Academics & Exams
  { name: 'Study Hours', category: 'Academics', type: 'arch', val: 3.5, goal: 8, unit: 'hrs', step: 0.5, icon: '⏱️', desc: 'Active textbook & notes reading' },
  { name: 'QBank MCQs', category: 'Academics', type: 'ring', val: 42, goal: 100, unit: 'mcqs', step: 5, icon: '❓', desc: 'NEET-PG / USMLE question solving' },
  { name: 'Flashcard Reviews', category: 'Academics', type: 'bars', val: 88, goal: 150, unit: 'cards', step: 10, icon: '🗂️', desc: 'Spaced repetition recall deck' },
  { name: 'Textbook Pages', category: 'Academics', type: 'bars', val: 18, goal: 40, unit: 'pages', step: 2, icon: '📖', desc: 'Core textbook syllabus coverage' },
  { name: 'Pharmacology Drug Cards', category: 'Academics', type: 'dots', val: 12, goal: 30, unit: 'drugs', step: 2, icon: '💊', desc: 'Drug mechanism and adverse effects' },
  { name: 'First Aid Pearls', category: 'Academics', type: 'bars', val: 9, goal: 20, unit: 'pearls', step: 1, icon: '⭐', desc: 'High-yield exam review pearls' },

  // Clinical Wards & Hospital
  { name: 'Ward Posting Hours', category: 'Clinical', type: 'arch', val: 2.5, goal: 4, unit: 'hrs', step: 0.5, icon: '🏥', desc: 'Hospital ward & OPD clinical hours' },
  { name: 'Clinical Cases Logged', category: 'Clinical', type: 'dots', val: 3, goal: 6, unit: 'cases', step: 1, icon: '🩺', desc: 'Patient histories taken & presented' },
  { name: 'Surgical Scrub-Ins', category: 'Clinical', type: 'dots', val: 1, goal: 3, unit: 'surgeries', step: 1, icon: '✂️', desc: 'OT scrub-in and observation' },
  { name: 'IV Cannulations & Draws', category: 'Clinical', type: 'bars', val: 4, goal: 10, unit: 'procedures', step: 1, icon: '💉', desc: 'Clinical bedside skills logged' },
  { name: 'Pathology Slides', category: 'Clinical', type: 'bars', val: 12, goal: 25, unit: 'slides', step: 1, icon: '🔬', desc: 'Microscopic slide analysis' },
  { name: 'Arterial Blood Gases', category: 'Clinical', type: 'ring', val: 3, goal: 8, unit: 'ABGs', step: 1, icon: '🩸', desc: 'Acid-base clinical analysis' },

  // Cognitive & Atelier Slabs
  { name: 'Flowchart Lineages Built', category: 'Cognitive', type: 'arch', val: 2, goal: 5, unit: 'charts', step: 1, icon: '🌳', desc: 'Pedigree & diagnosis classification trees' },
  { name: 'Mnemonics Mastered', category: 'Cognitive', type: 'ring', val: 6, goal: 10, unit: 'mnemonics', step: 1, icon: '💡', desc: 'Memory pegs & visual recall anchors' },
  { name: 'Anatomy Dissections', category: 'Cognitive', type: 'dots', val: 2, goal: 5, unit: 'regions', step: 1, icon: '🧠', desc: 'Cadaveric dissection & 3D atlas' },
  { name: 'Peace Sounds Meditation', category: 'Cognitive', type: 'ring', val: 15, goal: 30, unit: 'mins', step: 5, icon: '🎵', desc: 'Ocular reset & pink noise recharge' },

  // Wellness & Daily Habits
  { name: 'Daily Water Intake', category: 'Wellness', type: 'ring', val: 1.8, goal: 3.5, unit: 'L', step: 0.25, icon: '💧', desc: 'Hydration during long study shifts' },
  { name: 'Sleep & Recovery', category: 'Wellness', type: 'arch', val: 6.5, goal: 8, unit: 'hrs', step: 0.5, icon: '🌙', desc: 'Optimal brain consolidation sleep' },
  { name: '20-20-20 Eye Breaks', category: 'Wellness', type: 'dots', val: 8, goal: 15, unit: 'breaks', step: 1, icon: '👁️', desc: 'Ocular relaxation cycles taken' },
  { name: 'Pomodoro Focus Blocks', category: 'Wellness', type: 'dots', val: 4, goal: 8, unit: 'blocks', step: 1, icon: '🍅', desc: '25-minute deep focus sprints' },
];

const DEFAULT_TRACKERS: TrackerItem[] = [];

const ACCENTS_BY_THEME: Record<string, string[]> = {
  '1': ['#A47C43', '#8f5f2c', '#3F4E6B', '#8A5A3B', '#6B4A5E', '#b47b44'],
  '2': ['#2f6b43', '#4e8a60', '#7a5c32', '#3d7d63', '#5f7d40', '#2b593c'],
  '3': ['#1c637a', '#2b8a99', '#b07d4f', '#3d7899', '#5a8f88', '#8c6b43'],
  '4': ['#365578', '#52739e', '#9e6530', '#4a6b8c', '#6c7c94', '#7a5a40'],
  '5': ['#a84732', '#364454', '#7d4a3a', '#4f5d70', '#8f5f3c', '#293545'],
  '6': ['#1f6f62', '#3c8c77', '#8c6b3f', '#2e7d82', '#52805e', '#755c42'],
  '7': ['#4b4a8a', '#7c6bb8', '#b08b3e', '#3d5894', '#695294', '#8a723d'],
  '8': ['#7d2f45', '#9e4760', '#9e7540', '#63344e', '#85404b', '#75583a'],
  '9': ['#75532a', '#4b453a', '#8c693c', '#5e5648', '#6e4c2b', '#3b342b'],
  '10': ['#2563a8', '#3c82c7', '#4a7096', '#20538c', '#5b7299', '#756648'],
};

interface AtelierMySpaceProps {
  userProfile?: UserProfile;
  currentSubject?: SubjectCourse;
  onSelectSubject?: (subject: SubjectCourse) => void;
  tasks?: StudyTask[];
  onToggleTask?: (taskId: string) => void;
  onAddTask?: (task: StudyTask) => void;
  onOpenRosterModal?: () => void;
  onOpenSettings?: () => void;
  onNavigate?: (view: string) => void;
  rosterEvents?: RosterEvent[];
  books?: MedicalBook[];
  notebooks?: Notebook[];
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  activeDesign?: DesignId;
}

export const AtelierMySpace: React.FC<AtelierMySpaceProps> = ({
  userProfile,
  currentSubject = 'Pharmacology',
  onOpenRosterModal,
  onOpenSettings,
  onNavigate,
  rosterEvents = [],
  books = [],
  notebooks = [],
  activeDesign = '1',
}) => {

  // Dynamic Panel Resizing (Compact 50% default with Mouse-Drag Joystick)
  const [calHeight, setCalHeight] = useState<number>(() => {
    return parseInt(localStorage.getItem('medden_panel_cal_h') || '160', 10);
  });
  const [remHeight, setRemHeight] = useState<number>(() => {
    return parseInt(localStorage.getItem('medden_panel_rem_h') || '160', 10);
  });
  const [noteHeight, setNoteHeight] = useState<number>(() => {
    return parseInt(localStorage.getItem('medden_panel_note_h') || '160', 10);
  });

  const startResize = (e: React.MouseEvent, type: 'cal' | 'rem' | 'note') => {
    e.preventDefault();
    const startY = e.clientY;
    const initialH = type === 'cal' ? calHeight : type === 'rem' ? remHeight : noteHeight;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaY = moveEvent.clientY - startY;
      const newH = Math.max(120, Math.min(500, Math.round(initialH + deltaY)));
      if (type === 'cal') {
        setCalHeight(newH);
        localStorage.setItem('medden_panel_cal_h', String(newH));
      } else if (type === 'rem') {
        setRemHeight(newH);
        localStorage.setItem('medden_panel_rem_h', String(newH));
      } else {
        setNoteHeight(newH);
        localStorage.setItem('medden_panel_note_h', String(newH));
      }
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  interface CockpitFavouriteItem {
    id: string;
    type: 'book' | 'note' | 'custom';
    sourceId?: string;
    title: string;
    subject: string;
    badge: string;
    coverColor?: string;
    pdfFileUrl?: string;
    driveFileId?: string;
    contentHtml?: string;
  }

  // User-managed Favourites (empty by default, fully editable + addable, opens in Read format)
  const [favourites, setFavourites] = useState<CockpitFavouriteItem[]>(() => {
    try {
      const saved = localStorage.getItem('medden_cockpit_favourites_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });

  const saveFavourites = (next: CockpitFavouriteItem[]) => {
    setFavourites(next);
    try {
      localStorage.setItem('medden_cockpit_favourites_v1', JSON.stringify(next));
    } catch {}
  };

  const [isFavModalOpen, setIsFavModalOpen] = useState(false);
  const [editingFavId, setEditingFavId] = useState<string | null>(null);
  const [favTitleInput, setFavTitleInput] = useState('');
  const [favSubjectInput, setFavSubjectInput] = useState('');
  const [favBadgeInput, setFavBadgeInput] = useState('Favourite');

  // Editable Cockpit Section Headings
  type SectionKey = 'trackers' | 'today' | 'favourites';
  const [sectionNames, setSectionNames] = useState<Record<SectionKey, string>>(() => {
    const defaults: Record<SectionKey, string> = {
      trackers: 'Trackers',
      today: 'Today',
      favourites: 'Favourites',
    };
    try {
      const saved = localStorage.getItem('medden_cockpit_section_names_v1');
      if (saved) return { ...defaults, ...JSON.parse(saved) };
    } catch {}
    return defaults;
  });
  const [editingSectionKey, setEditingSectionKey] = useState<SectionKey | null>(null);
  const [editingSectionDraft, setEditingSectionDraft] = useState('');

  const commitSectionRename = (key: SectionKey) => {
    const clean = editingSectionDraft.trim();
    if (clean) {
      const next = { ...sectionNames, [key]: clean };
      setSectionNames(next);
      try {
        localStorage.setItem('medden_cockpit_section_names_v1', JSON.stringify(next));
      } catch {}
    }
    setEditingSectionKey(null);
  };

  const renderEditableHeading = (key: SectionKey) => {
    if (editingSectionKey === key) {
      return (
        <input
          type="text"
          autoFocus
          value={editingSectionDraft}
          onChange={(e) => setEditingSectionDraft(e.target.value)}
          onBlur={() => commitSectionRename(key)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commitSectionRename(key);
            if (e.key === 'Escape') setEditingSectionKey(null);
          }}
          className="bg-transparent border-b border-[var(--at-brass)] outline-none font-serif text-[17px] font-medium px-0.5 text-[var(--at-ink)] min-w-[100px]"
        />
      );
    }
    return (
      <div className="inline-flex items-center gap-1.5 group">
        <h2
          onClick={() => {
            setEditingSectionKey(key);
            setEditingSectionDraft(sectionNames[key]);
          }}
          title="Click to rename section"
          className="cursor-pointer hover:opacity-80 transition-opacity"
        >
          {sectionNames[key]}
        </h2>
        <button
          type="button"
          onClick={() => {
            setEditingSectionKey(key);
            setEditingSectionDraft(sectionNames[key]);
          }}
          title="Rename section"
          aria-label={`Rename ${sectionNames[key]} section`}
          className="opacity-0 group-hover:opacity-65 hover:!opacity-100 p-1 rounded transition-opacity cursor-pointer"
          style={{ color: 'var(--at-muted)' }}
        >
          <Pencil className="w-3 h-3" />
        </button>
      </div>
    );
  };



  const openPayloadInReader = (payload: {
    id?: string;
    title: string;
    subject?: string;
    author?: string;
    edition?: string;
    coverColor?: string;
    pdfFileUrl?: string;
    driveFileId?: string;
    pages?: Array<{ pageNumber: number; title: string; keyTopic?: string; summaryPearl?: string; contentHtml: string }>;
    contentHtml?: string;
  }) => {
    try {
      localStorage.setItem('medden_pending_read_book_v1', JSON.stringify(payload));
      window.dispatchEvent(new Event('medden_open_book_in_reader'));
    } catch {}
    onNavigate?.('read');
  };

  const handleOpenFavouriteInRead = (fav: CockpitFavouriteItem) => {
    if (fav.type === 'book') {
      const matchedBook = books.find((b) => b.id === fav.sourceId || b.title === fav.title);
      if (matchedBook) {
        openPayloadInReader(matchedBook);
        return;
      }
    }
    if (fav.type === 'note') {
      const matchedNote = notebooks.find((n) => n.id === fav.sourceId || n.title === fav.title);
      if (matchedNote) {
        const notePages = (matchedNote.pages || []).map((p: any, idx: number) => ({
          pageNumber: idx + 1,
          title: idx === 0 ? matchedNote.title : `${matchedNote.title} · Page ${idx + 1}`,
          keyTopic: matchedNote.subject || 'Personal Note',
          summaryPearl: '',
          contentHtml: p.content || p.html || `<p>${String(matchedNote.title)}</p>`,
        }));
        openPayloadInReader({
          id: matchedNote.id,
          title: matchedNote.title,
          subject: matchedNote.subject,
          author: 'My Notebook',
          edition: `${notePages.length} ${notePages.length === 1 ? 'Page' : 'Pages'}`,
          coverColor: matchedNote.coverColor,
          pages: notePages,
        });
        return;
      }
    }
    openPayloadInReader({
      id: fav.sourceId || fav.id,
      title: fav.title,
      subject: fav.subject || currentSubject,
      author: 'Favourites',
      edition: fav.badge || 'Saved Item',
      coverColor: fav.coverColor || '#7c4521',
      pdfFileUrl: fav.pdfFileUrl,
      driveFileId: fav.driveFileId,
      contentHtml: fav.contentHtml,
    });
  };





  // Search input state
  const [searchQuery, setSearchQuery] = useState('');

  // Trackers State
  const [trackers, setTrackers] = useState<TrackerItem[]>(() => {
    try {
      const saved = localStorage.getItem('medden_atelier_trackers');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const cleaned = parsed.filter((tr: any) => {
            const isSeed =
              (tr?.id === '1' && tr?.n === 'Daily study') ||
              (tr?.id === '2' && tr?.n === 'Recall retention') ||
              (tr?.id === '3' && tr?.n === 'Flashcards reviewed') ||
              (tr?.id === '4' && tr?.n === 'Study streak');
            return !isSeed;
          });
          if (cleaned.length !== parsed.length) {
            localStorage.setItem('medden_atelier_trackers', JSON.stringify(cleaned));
          }
          return cleaned;
        }
      }
    } catch {}
    return DEFAULT_TRACKERS;
  });

  const saveTrackers = (updated: TrackerItem[]) => {
    setTrackers(updated);
    try {
      localStorage.setItem('medden_atelier_trackers', JSON.stringify(updated));
    } catch {}
  };

  const handleLogProgress = (index: number) => {
    const updated = [...trackers];
    const t = updated[index];
    t.v = Math.round(Math.min(t.g, t.v + t.step) * 10) / 10;
    saveTrackers(updated);
  };

  const handleDeleteTracker = (index: number) => {
    const updated = trackers.filter((_, i) => i !== index);
    saveTrackers(updated);
  };

  // Add Tracker Modal Dialog & Customization
  const [isAddTrackerOpen, setIsAddTrackerOpen] = useState(false);
  const [selectedPresetCat, setSelectedPresetCat] = useState<'All' | 'Academics' | 'Clinical' | 'Cognitive' | 'Wellness'>('All');
  const [aiPrompt, setAiPrompt] = useState('');
  const [newTrName, setNewTrName] = useState('');
  const [newTrVal, setNewTrVal] = useState('0');
  const [newTrGoal, setNewTrGoal] = useState('10');
  const [newTrUnit, setNewTrUnit] = useState('pages');
  const [newTrType, setNewTrType] = useState<'arch' | 'ring' | 'bars' | 'dots'>('arch');

  const handleSelectPreset = (p: TrackerPreset) => {
    setNewTrName(p.name);
    setNewTrGoal(String(p.goal));
    setNewTrVal(String(p.val));
    setNewTrUnit(p.unit);
    setNewTrType(p.type);
  };

  const handleGenerateWithAI = () => {
    if (!aiPrompt.trim()) return;
    const txt = aiPrompt.toLowerCase();
    const numMatch = txt.match(/(\d+(\.\d+)?)/);
    const detectedGoal = numMatch ? parseFloat(numMatch[1]) : 10;
    
    let name = aiPrompt.trim();
    let unit = 'units';
    let type: 'arch' | 'ring' | 'bars' | 'dots' = 'ring';
    
    if (txt.includes('mcq') || txt.includes('question') || txt.includes('qbank')) {
      name = 'MCQ Practice';
      unit = 'mcqs';
      type = 'bars';
    } else if (txt.includes('ward') || txt.includes('round') || txt.includes('hospital') || txt.includes('opd')) {
      name = 'Ward Rounds';
      unit = 'rounds';
      type = 'arch';
    } else if (txt.includes('water') || txt.includes('pani') || txt.includes('liter') || txt.includes('hydrate')) {
      name = 'Water Intake';
      unit = 'L';
      type = 'ring';
    } else if (txt.includes('hour') || txt.includes('ghante') || txt.includes('hr') || txt.includes('study')) {
      name = 'Study Time';
      unit = 'hrs';
      type = 'arch';
    } else if (txt.includes('page') || txt.includes('kitab') || txt.includes('book') || txt.includes('chapter')) {
      name = 'Pages Read';
      unit = 'pages';
      type = 'bars';
    } else if (txt.includes('mnemonic')) {
      name = 'Mnemonics';
      unit = 'mnemonics';
      type = 'dots';
    } else {
      name = aiPrompt.replace(/track karna hai|tracker|track|daily|banao|chahiye/gi, '').trim() || 'Custom Goal';
    }
    
    setNewTrName(name);
    setNewTrGoal(String(detectedGoal));
    setNewTrVal('0');
    setNewTrUnit(unit);
    setNewTrType(type);
    setAiPrompt('');
  };

  const handleCreateTracker = (e: React.FormEvent) => {
    e.preventDefault();
    const g = Math.max(1, parseFloat(newTrGoal) || 10);
    const v = Math.min(g, Math.max(0, parseFloat(newTrVal) || 0));
    const step = g >= 50 ? 5 : g < 10 ? 0.5 : 1;

    const newTr: TrackerItem = {
      id: `tr-${Date.now()}`,
      n: newTrName.trim() || 'Untitled Tracker',
      type: newTrType,
      v,
      g,
      u: newTrUnit.trim() || 'units',
      step,
    };

    saveTrackers([...trackers, newTr]);
    setIsAddTrackerOpen(false);
    setNewTrName('');
    setNewTrVal('0');
    setNewTrGoal('10');
    setNewTrUnit('pages');
    setNewTrType('arch');
  };

  // Days row in Calendar (real current week Mon–Sun)
  const [selectedDay, setSelectedDay] = useState(() => (new Date().getDay() + 6) % 7);
  const daysList = React.useMemo(() => {
    const today = new Date();
    const dayIdxFromMon = (today.getDay() + 6) % 7;
    const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - dayIdxFromMon);
    const shortNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const fullNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const dayNumStr = String(d.getDate()).padStart(2, '0');
      return {
        name: shortNames[i],
        dayName: fullNames[i],
        num: d.getDate(),
        isoDate: `${y}-${m}-${dayNumStr}`,
      };
    });
  }, []);
  const selectedDayObj = daysList[selectedDay] || daysList[0];
  const currentMonthLabel = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const dayEvents = React.useMemo(() => {
    if (!selectedDayObj) return [];
    return rosterEvents.filter(
      (ev) =>
        ev.date === selectedDayObj.isoDate ||
        ev.dayOfWeek?.toLowerCase() === selectedDayObj.dayName.toLowerCase()
    );
  }, [rosterEvents, selectedDayObj]);

  // Tasks State (Sticky note)
  interface AtelierTask {
    id: string;
    t: string;
    done: boolean;
  }

  const [stickyTasks, setStickyTasks] = useState<AtelierTask[]>(() => {
    try {
      const saved = localStorage.getItem('medden_atelier_tasks');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const cleaned = parsed.filter((t: any) => {
            const isSeed =
              (t?.id === 't1' && t?.t === 'Review Osteoporosis: Bisphosphonate & Denosumab') ||
              (t?.id === 't2' && t?.t === 'Complete CAL Practical Report: Rabbit Eye Autonomic') ||
              (t?.id === 't3' && t?.t === 'Annotate Goodman & Gilman Chapter 48') ||
              (t?.id === 't4' && t?.t === 'Take 20-20-20 screen rest after reading');
            return !isSeed;
          });
          if (cleaned.length !== parsed.length) {
            localStorage.setItem('medden_atelier_tasks', JSON.stringify(cleaned));
          }
          return cleaned;
        }
      }
    } catch {}
    return [];
  });

  const saveStickyTasks = (tasks: AtelierTask[]) => {
    setStickyTasks(tasks);
    try {
      localStorage.setItem('medden_atelier_tasks', JSON.stringify(tasks));
    } catch {}
  };

  const [taskFilter, setTaskFilter] = useState<'all' | 'pending' | 'done'>('all');
  const [newTaskInput, setNewTaskInput] = useState('');

  const handleToggleTaskDone = (id: string) => {
    const updated = stickyTasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
    saveStickyTasks(updated);
  };

  const handleDeleteTask = (id: string) => {
    saveStickyTasks(stickyTasks.filter((t) => t.id !== id));
  };

  const handleAddNewTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskInput.trim()) return;
    const newTask: AtelierTask = {
      id: `task-${Date.now()}`,
      t: newTaskInput.trim(),
      done: false,
    };
    saveStickyTasks([...stickyTasks, newTask]);
    setNewTaskInput('');
  };

  const filteredTasks = stickyTasks.filter((t) => {
    if (taskFilter === 'pending') return !t.done;
    if (taskFilter === 'done') return t.done;
    return true;
  });

  const completedCount = stickyTasks.filter((t) => t.done).length;

  // Reminders State (persisted in localStorage, zero pre-seeded samples)
  interface AtelierReminder {
    id: string;
    time: string;
    ampm: string;
    category: string;
    title: string;
    active: boolean;
  }

  const [reminders, setReminders] = useState<AtelierReminder[]>(() => {
    try {
      const saved = localStorage.getItem('medden_atelier_reminders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const cleaned = parsed.filter((r: any) => {
            const isSeed =
              (r?.id === 'r1' && r?.title === 'Pediatric Ward Rounds & Case Presentation') ||
              (r?.id === 'r2' && r?.title === 'Check Vancomycin Trough & Serum Creatinine') ||
              (r?.id === 'r3' && r?.title === 'USMLE QBank Block — 40 Renal / Cardio');
            return !isSeed;
          });
          if (cleaned.length !== parsed.length) {
            localStorage.setItem('medden_atelier_reminders', JSON.stringify(cleaned));
          }
          return cleaned;
        }
      }
    } catch {}
    return [];
  });

  const saveReminders = (updated: AtelierReminder[]) => {
    setReminders(updated);
    try {
      localStorage.setItem('medden_atelier_reminders', JSON.stringify(updated));
    } catch {}
  };

  const [isAddingReminder, setIsAddingReminder] = useState(false);
  const [newRemTitle, setNewRemTitle] = useState('');
  const [newRemTime, setNewRemTime] = useState('09:00');
  const [newRemAmpm, setNewRemAmpm] = useState<'AM' | 'PM'>('AM');
  const [newRemCat, setNewRemCat] = useState('Reminder');

  const handleCreateReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRemTitle.trim()) return;
    const newRem: AtelierReminder = {
      id: `rem-${Date.now()}`,
      time: newRemTime.trim() || '09:00',
      ampm: newRemAmpm,
      category: newRemCat.trim() || 'Reminder',
      title: newRemTitle.trim(),
      active: true,
    };
    saveReminders([...reminders, newRem]);
    setNewRemTitle('');
    setIsAddingReminder(false);
  };

  const handleDeleteReminder = (id: string) => {
    saveReminders(reminders.filter((r) => r.id !== id));
  };

  const toggleReminderActive = (id: string) => {
    saveReminders(
      reminders.map((r) => (r.id === id ? { ...r, active: !r.active } : r))
    );
  };

  // Helper: Render tracker visual instrument
  const renderVisual = (t: TrackerItem, pct: number) => {
    if (t.type === 'arch') {
      return (
        <div className="atelier-v-arch">
          <svg viewBox="0 0 200 104">
            <path
              d="M14 100 A86 86 0 0 1 186 100"
              fill="none"
              stroke="var(--at-line)"
              strokeWidth="7"
              strokeLinecap="round"
            />
            <path
              d="M14 100 A86 86 0 0 1 186 100"
              fill="none"
              stroke="var(--acc)"
              strokeWidth="7"
              strokeLinecap="round"
              pathLength={100}
              strokeDasharray={`${pct} 100`}
            />
            <text
              x="100"
              y="92"
              textAnchor="middle"
              fontFamily="Geist Mono, monospace"
              fontSize="15"
              fill="currentColor"
            >
              {Math.round(pct)}%
            </text>
          </svg>
        </div>
      );
    }

    if (t.type === 'ring') {
      return (
        <div className="atelier-v-ring">
          <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="var(--at-line)"
              strokeWidth="6"
            />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="var(--acc)"
              strokeWidth="6"
              strokeLinecap="round"
              pathLength={100}
              strokeDasharray={`${pct} 100`}
            />
            <circle
              cx="50"
              cy="50"
              r="32"
              fill="none"
              stroke="var(--at-line)"
              strokeWidth="1"
              strokeDasharray="1 3"
            />
          </svg>
          <b>{Math.round(pct)}%</b>
        </div>
      );
    }

    if (t.type === 'bars') {
      const onBars = Math.round((pct / 100) * 14);
      return (
        <div className="atelier-v-bars">
          {Array.from({ length: 14 }, (_, k) => (
            <i
              key={k}
              className={k < onBars ? 'on' : ''}
              style={{ height: `${30 + k * 5}%` }}
            />
          ))}
        </div>
      );
    }

    // Dots style
    const totalDots = Math.min(Math.ceil(t.g), 28);
    const onDots = Math.min(Math.floor(t.v), totalDots);
    return (
      <div className="atelier-v-dots">
        {Array.from({ length: totalDots }, (_, k) => (
          <i key={k} className={k < onDots ? 'on' : ''} />
        ))}
      </div>
    );
  };

  return (
    <div className="atelier-root" data-atelier-theme={activeDesign}>
      <main className="atelier-main">
        {/* Top Search Bar (Eye rest timer & theme mode live in the top utility ribbon) */}
        <header className="atelier-top">
          <label className="atelier-search">
            <Search className="w-3.5 h-3.5 text-stone-400" />
            <input
              placeholder="Search notes, slabs…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </label>
        </header>

        {/* Section: Trackers */}
        <div className="atelier-sec" style={{ marginTop: '4px' }}>
          {renderEditableHeading('trackers')}
          <span className="atelier-chip">{trackers.length} trackers</span>
          <span className="atelier-rule" />
          <button
            type="button"
            className="atelier-btn"
            style={{ padding: '6px 14px', fontSize: '12px' }}
            onClick={() => setIsAddTrackerOpen(true)}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>

        {/* Trackers Grid */}
        <div className="atelier-trackers">
          {trackers.map((t, i) => {
            const pct = Math.min(100, (t.v / t.g) * 100);
            const palette = ACCENTS_BY_THEME[activeDesign] || ACCENTS_BY_THEME['1'];
            const acc = palette[i % palette.length];

            return (
              <article
                key={t.id || i}
                className="atelier-card atelier-tracker"
                style={{ ['--acc' as string]: acc }}
                aria-label={`${t.n}: ${t.v} of ${t.g} ${t.u}`}
              >
                <div className="atelier-tr-h">
                  <p className="atelier-eyebrow">{t.n}</p>
                  <button
                    type="button"
                    className="atelier-tr-del"
                    onClick={() => handleDeleteTracker(i)}
                    aria-label={`Remove ${t.n} tracker`}
                    title="Remove tracker"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="atelier-tr-vis" aria-hidden="true">
                  {renderVisual(t, pct)}
                </div>

                <div className="atelier-tr-f">
                  <div>
                    <p className="atelier-tr-val">
                      {t.v}
                      <small>
                        {' '}
                        / {t.g} {t.u}
                      </small>
                    </p>
                    <p className="atelier-tr-sub">{Math.round(pct)}% of goal</p>
                  </div>
                  <button
                    type="button"
                    className="atelier-log"
                    onClick={() => handleLogProgress(i)}
                    aria-label={`Log progress for ${t.n}`}
                    title={`Log +${t.step} ${t.u}`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </article>
            );
          })}

          {/* Add Tracker Action Card */}
          <button
            type="button"
            className="atelier-tr-add"
            onClick={() => setIsAddTrackerOpen(true)}
          >
            <span className="plus">
              <Plus className="w-5 h-5" />
            </span>
            <span>Add tracker</span>
            <small className="atelier-eyebrow">Arch · Ring · Columns · Streak</small>
          </button>
        </div>

        {/* Section: Today */}
        <div className="atelier-sec">
          {renderEditableHeading('today')}
          <span className="atelier-rule" />
        </div>

        {/* Trio Columns */}
        <div className="atelier-trio">
          {/* Card 1: Academic Calendar */}
          <section
            className="atelier-card atelier-panel"
            aria-labelledby="cal-h"
            style={{ height: `${calHeight}px`, overflowY: 'auto' }}
          >
            <div className="atelier-panel-h">
              <div>
                <h3 id="cal-h">{currentMonthLabel}</h3>
              </div>
              <button
                type="button"
                onClick={onOpenRosterModal}
                className="atelier-chip"
                title="Open full calendar"
              >
                {dayEvents.length} {dayEvents.length === 1 ? 'session' : 'sessions'}
              </button>
            </div>

            <div className="atelier-days">
              {daysList.map((d, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="atelier-day"
                  aria-pressed={selectedDay === idx}
                  onClick={() => setSelectedDay(idx)}
                >
                  {d.name}
                  <b>{d.num}</b>
                </button>
              ))}
            </div>

            <div className="atelier-timeline">
              {dayEvents.length === 0 ? (
                <div className="py-3 text-center space-y-1.5">
                  <p className="text-xs opacity-70" style={{ color: 'var(--at-muted)' }}>
                    No sessions scheduled
                  </p>
                  {onOpenRosterModal && (
                    <button
                      type="button"
                      onClick={onOpenRosterModal}
                      className="atelier-chip cursor-pointer"
                    >
                      Open Calendar
                    </button>
                  )}
                </div>
              ) : (
                dayEvents.map((ev) => (
                  <div key={ev.id} className="atelier-ev">
                    <time>
                      {ev.startTime || 'All day'}
                      {ev.venue ? ` — ${ev.venue}` : ''}
                    </time>
                    <p className="t">
                      {ev.title}{' '}
                      {ev.type && (
                        <span className="atelier-chip">
                          {ev.type}
                        </span>
                      )}
                    </p>
                    {(ev.instructor || ev.notes) && (
                      <p className="m">{[ev.instructor, ev.notes].filter(Boolean).join(' · ')}</p>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Drag Resize Handle */}
            <div className="panel-resize-joystick-widget">
              <div
                className="panel-resize-joystick"
                onMouseDown={(e) => startResize(e, 'cal')}
                title="Drag up/down to resize"
              >
                <MoveVertical className="w-3 h-3" />
              </div>
            </div>
          </section>

          {/* Card 2: 3D Yellow Sticky Note Tasks */}
          <section
            className="atelier-sticky atelier-panel"
            aria-labelledby="task-h"
            style={{ height: `${noteHeight}px`, overflowY: 'auto' }}
          >
            <div className="atelier-panel-h">
              <div>
                <h3 id="task-h">Tasks</h3>
              </div>
              <span className="atelier-chip brass" id="task-count">
                {completedCount} / {stickyTasks.length}
              </span>
            </div>

            <div className="atelier-seg" role="group" aria-label="Filter tasks">
              <button
                type="button"
                aria-pressed={taskFilter === 'all'}
                onClick={() => setTaskFilter('all')}
              >
                All
              </button>
              <button
                type="button"
                aria-pressed={taskFilter === 'pending'}
                onClick={() => setTaskFilter('pending')}
              >
                Pending
              </button>
              <button
                type="button"
                aria-pressed={taskFilter === 'done'}
                onClick={() => setTaskFilter('done')}
              >
                Completed
              </button>
            </div>

            <ul className="atelier-tasks">
              {filteredTasks.length === 0 ? (
                <li
                  className="atelier-task"
                  style={{ color: 'color-mix(in srgb, var(--note-ink) 65%, transparent)', fontFamily: 'Caveat, cursive', fontSize: '15px', fontStyle: 'normal' }}
                >
                  Nothing here.
                </li>
              ) : (
                filteredTasks.map((t) => (
                  <li key={t.id} className={`atelier-task ${t.done ? 'done' : ''} group flex items-center justify-between gap-1`}>
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <input
                        type="checkbox"
                        id={`chk-${t.id}`}
                        checked={t.done}
                        onChange={() => handleToggleTaskDone(t.id)}
                      />
                      <label htmlFor={`chk-${t.id}`} className="truncate">{t.t}</label>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteTask(t.id)}
                      className="opacity-50 hover:opacity-100 p-0.5 cursor-pointer shrink-0"
                      aria-label={`Delete task ${t.t}`}
                      title="Delete task"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </li>
                ))
              )}
            </ul>

            <form className="atelier-add" onSubmit={handleAddNewTask}>
              <input
                id="new-task"
                placeholder="Add a task…"
                autoComplete="off"
                value={newTaskInput}
                onChange={(e) => setNewTaskInput(e.target.value)}
              />
              <button type="submit" aria-label="Add task">
                <Plus className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Drag Resize Handle */}
            <div className="panel-resize-joystick-widget">
              <div
                className="panel-resize-joystick"
                onMouseDown={(e) => startResize(e, 'note')}
                title="Drag up/down to resize"
              >
                <MoveVertical className="w-3 h-3" />
              </div>
            </div>
          </section>

          {/* Card 3: Reminders */}
          <section
            className="atelier-card atelier-panel"
            aria-labelledby="rem-h"
            style={{ height: `${remHeight}px`, overflowY: 'auto' }}
          >
            <div className="atelier-panel-h">
              <div>
                <h3 id="rem-h">Reminders</h3>
              </div>
              <button
                type="button"
                className="atelier-chip"
                style={{ cursor: 'pointer' }}
                onClick={() => setIsAddingReminder((prev) => !prev)}
              >
                {isAddingReminder ? 'Cancel' : '+ New'}
              </button>
            </div>

            {isAddingReminder && (
              <form onSubmit={handleCreateReminder} className="mb-2.5 p-2 rounded-xl border border-stone-300/60 dark:border-[#3d291b] space-y-1.5 text-xs">
                <input
                  type="text"
                  value={newRemTitle}
                  onChange={(e) => setNewRemTitle(e.target.value)}
                  placeholder="Reminder title..."
                  required
                  autoFocus
                  className="w-full px-2 py-1 rounded-lg bg-white/80 dark:bg-[#1a120d] border border-stone-300/60 dark:border-[#3d291b] text-xs outline-none"
                />
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={newRemTime}
                    onChange={(e) => setNewRemTime(e.target.value)}
                    placeholder="09:00"
                    className="w-16 px-2 py-1 rounded-lg bg-white/80 dark:bg-[#1a120d] border border-stone-300/60 dark:border-[#3d291b] text-xs font-mono outline-none"
                  />
                  <select
                    value={newRemAmpm}
                    onChange={(e) => setNewRemAmpm(e.target.value as 'AM' | 'PM')}
                    className="px-1.5 py-1 rounded-lg bg-white/80 dark:bg-[#1a120d] border border-stone-300/60 dark:border-[#3d291b] text-xs outline-none"
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                  <input
                    type="text"
                    value={newRemCat}
                    onChange={(e) => setNewRemCat(e.target.value)}
                    placeholder="Category"
                    className="flex-1 min-w-0 px-2 py-1 rounded-lg bg-white/80 dark:bg-[#1a120d] border border-stone-300/60 dark:border-[#3d291b] text-xs outline-none"
                  />
                  <button
                    type="submit"
                    className="px-2.5 py-1 rounded-lg bg-[#A47C43] text-white font-semibold text-xs cursor-pointer shrink-0"
                  >
                    Add
                  </button>
                </div>
              </form>
            )}

            <div className="atelier-rems">
              {reminders.length === 0 ? (
                <p className="py-3 text-center text-xs opacity-70" style={{ color: 'var(--at-muted)' }}>
                  No reminders set.
                </p>
              ) : (
                reminders.map((r) => (
                  <div key={r.id} className="atelier-rem">
                    <p className="atelier-rem-time">
                      {r.time}
                      <small>{r.ampm}</small>
                    </p>
                    <div>
                      <span
                        className="atelier-eyebrow"
                        style={{ color: 'var(--at-brass)', fontWeight: 600 }}
                      >
                        {r.category}
                      </span>
                      <p className="ti">{r.title}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        className="atelier-bell"
                        aria-pressed={r.active}
                        onClick={() => toggleReminderActive(r.id)}
                        aria-label={`Toggle alarm for ${r.title}`}
                        title={r.active ? 'Alarm set' : 'Muted'}
                      >
                        <AlarmClock className={`w-3.5 h-3.5 ${r.active ? '' : 'opacity-40'}`} />
                      </button>
                      <button
                        type="button"
                        className="atelier-bell opacity-65 hover:opacity-100"
                        onClick={() => handleDeleteReminder(r.id)}
                        aria-label={`Delete reminder ${r.title}`}
                        title="Delete reminder"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Drag Resize Handle */}
            <div className="panel-resize-joystick-widget">
              <div
                className="panel-resize-joystick"
                onMouseDown={(e) => startResize(e, 'rem')}
                title="Drag up/down to resize"
              >
                <MoveVertical className="w-3 h-3" />
              </div>
            </div>
          </section>
        </div>

        {/* Section: Favourites */}
        <div className="atelier-sec" style={{ marginTop: '18px' }}>
          {renderEditableHeading('favourites')}
          <span className="atelier-rule" />
          <button
            type="button"
            className="atelier-btn"
            style={{ padding: '6px 14px', fontSize: '12px' }}
            onClick={() => {
              setEditingFavId(null);
              setFavTitleInput('');
              setFavSubjectInput(String(currentSubject));
              setFavBadgeInput('Favourite');
              setIsFavModalOpen(true);
            }}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>

        {favourites.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
            {favourites.map((fav) => (
              <div
                key={fav.id}
                onClick={() => handleOpenFavouriteInRead(fav)}
                className="p-3.5 rounded-xl border shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group relative"
                style={{
                  background: 'var(--at-paper)',
                  borderColor: 'var(--at-line)',
                  color: 'var(--at-ink)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <div>
                  <div className="flex items-center justify-between gap-1.5 mb-2">
                    <span
                      className="px-1.5 py-0.5 rounded text-[9.5px] font-mono font-bold truncate"
                      style={{ background: 'var(--at-brass-soft)', color: 'var(--at-brass)' }}
                    >
                      {fav.badge || 'Favourite'}
                    </span>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        title="Edit favourite"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingFavId(fav.id);
                          setFavTitleInput(fav.title);
                          setFavSubjectInput(fav.subject);
                          setFavBadgeInput(fav.badge);
                          setIsFavModalOpen(true);
                        }}
                        className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                        style={{ color: 'var(--at-muted)' }}
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        title="Remove from favourites"
                        onClick={(e) => {
                          e.stopPropagation();
                          saveFavourites(favourites.filter((item) => item.id !== fav.id));
                        }}
                        className="p-1 rounded hover:bg-red-500/10 hover:text-red-500 transition-colors cursor-pointer"
                        style={{ color: 'var(--at-muted)' }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <h4 className="text-[13.5px] font-bold line-clamp-2 leading-snug" style={{ color: 'var(--at-ink)' }}>
                    {fav.title}
                  </h4>
                  {fav.subject && (
                    <p className="text-[10px] mt-1" style={{ color: 'var(--at-muted)' }}>
                      {fav.subject}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}



      </main>

      {/* ========================================================================= */}
      {/* ENHANCED ADD TRACKER MODAL WITH MEDICAL CATALOG, AI GENERATOR & DEVELOPER */}
      {/* ========================================================================= */}
      {isAddTrackerOpen && (
        <div
          className="atelier-dialog-overlay"
          onClick={() => setIsAddTrackerOpen(false)}
        >
          <div
            className="atelier-dialog max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar"
            style={{ width: '650px', maxWidth: '95vw', padding: '24px' }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="tr-d-h"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b mb-4" style={{ borderColor: 'var(--at-line)' }}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold" style={{ background: 'var(--at-brass-soft)', color: 'var(--at-brass)' }}>
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h3 id="tr-d-h" className="atelier-serif text-[26px] font-bold m-0" style={{ color: 'var(--at-ink)' }}>
                    Medical & Routine Trackers
                  </h3>
                  <p className="text-xs m-0" style={{ color: 'var(--at-muted)' }}>
                    Choose from standard medical presets, generate via AI, or customize your own
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddTrackerOpen(false)}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* AI Natural Language Prompt Generator */}
            <div className="p-3.5 rounded-xl border mb-4" style={{ background: 'var(--at-brass-soft)', borderColor: 'var(--at-line)' }}>
              <div className="flex items-center gap-2 mb-1.5">
                <Sparkles className="w-3.5 h-3.5" style={{ color: 'var(--at-brass)' }} />
                <span className="text-xs font-bold" style={{ color: 'var(--at-ink)' }}>
                  AI Tracker Generator (English / Hinglish)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="e.g. 'Daily 3 ward rounds track karna hai', '50 mcq solve karne ka tracker', 'Daily 4 liter water'..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleGenerateWithAI();
                    }
                  }}
                  className="flex-1 text-xs px-3 py-2 rounded-lg border outline-none"
                  style={{ background: 'var(--at-bg)', borderColor: 'var(--at-line)', color: 'var(--at-ink)' }}
                />
                <button
                  type="button"
                  onClick={handleGenerateWithAI}
                  disabled={!aiPrompt.trim()}
                  className="px-3 py-2 rounded-lg disabled:opacity-50 text-white text-xs font-bold transition-colors cursor-pointer shrink-0 flex items-center gap-1.5"
                  style={{ backgroundColor: 'var(--at-brass)' }}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate</span>
                </button>
              </div>
            </div>

            {/* Catalog of Medical Tracker Presets */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-stone-500 dark:text-stone-400">
                  Quick-Pick Medical & Habit Presets
                </span>
                {/* Category Filter Tabs */}
                <div className="flex items-center gap-1">
                  {(['All', 'Academics', 'Clinical', 'Cognitive', 'Wellness'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedPresetCat(cat)}
                      className={`text-[10px] px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer ${
                        selectedPresetCat === cat
                          ? 'text-white font-bold bg-[var(--at-brass)]'
                          : 'bg-[var(--at-bg)] text-[var(--at-muted)] hover:text-[var(--at-ink)]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Presets Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-36 overflow-y-auto p-1 custom-scrollbar">
                {MEDICAL_TRACKER_PRESETS.filter(
                  (p) => selectedPresetCat === 'All' || p.category === selectedPresetCat
                ).map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className="p-2 rounded-lg border border-[var(--at-line)] bg-[var(--at-bg)] text-left transition-all hover:shadow-xs cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">{preset.icon}</span>
                      <span className="text-xs font-bold text-stone-800 dark:text-stone-200 group-hover:text-amber-600 truncate">
                        {preset.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-stone-400 mt-1">
                      <span>Goal: {preset.goal} {preset.unit}</span>
                      <span className="font-mono uppercase text-[9px] text-amber-700 dark:text-amber-400">{preset.type}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Customization Form */}
            <form onSubmit={handleCreateTracker} className="space-y-3 pt-3 border-t border-stone-200 dark:border-stone-800">
              <div className="atelier-field">
                <label className="atelier-eyebrow" htmlFor="tr-name">
                  Tracker Name
                </label>
                <input
                  id="tr-name"
                  required
                  placeholder="e.g. Ward Rounds, Pages Read, QBank MCQs"
                  autoComplete="off"
                  value={newTrName}
                  onChange={(e) => setNewTrName(e.target.value)}
                />
              </div>

              {/* 3-Column Values - Styled with min-width: 0 so it never overflows */}
              <div className="grid grid-cols-3 gap-2.5 w-full box-border overflow-hidden">
                <div className="atelier-field min-w-0">
                  <label className="atelier-eyebrow" htmlFor="tr-v">
                    Current
                  </label>
                  <input
                    id="tr-v"
                    type="number"
                    min="0"
                    step="any"
                    value={newTrVal}
                    onChange={(e) => setNewTrVal(e.target.value)}
                    className="w-full min-w-0 box-border"
                    style={{ boxSizing: 'border-box' }}
                  />
                </div>
                <div className="atelier-field min-w-0">
                  <label className="atelier-eyebrow" htmlFor="tr-g">
                    Goal Target
                  </label>
                  <input
                    id="tr-g"
                    type="number"
                    min="1"
                    step="any"
                    required
                    value={newTrGoal}
                    onChange={(e) => setNewTrGoal(e.target.value)}
                    className="w-full min-w-0 box-border"
                    style={{ boxSizing: 'border-box' }}
                  />
                </div>
                <div className="atelier-field min-w-0">
                  <label className="atelier-eyebrow" htmlFor="tr-u">
                    Unit
                  </label>
                  <input
                    id="tr-u"
                    placeholder="e.g. hrs, mcqs, pages"
                    autoComplete="off"
                    value={newTrUnit}
                    onChange={(e) => setNewTrUnit(e.target.value)}
                    className="w-full min-w-0 box-border"
                    style={{ boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* Visual Style Selection */}
              <fieldset className="atelier-field" style={{ border: 0, padding: 0 }}>
                <legend className="atelier-eyebrow" style={{ marginBottom: '6px' }}>
                  Visualization Style
                </legend>
                <div className="atelier-types grid grid-cols-4 gap-2">
                  <label
                    className={`cursor-pointer text-center py-1.5 rounded-lg border text-xs font-semibold ${
                      newTrType === 'arch' ? 'active bg-amber-700 text-white border-amber-700' : 'border-stone-200 dark:border-stone-800'
                    }`}
                    onClick={() => setNewTrType('arch')}
                  >
                    <input
                      type="radio"
                      name="trType"
                      checked={newTrType === 'arch'}
                      onChange={() => setNewTrType('arch')}
                      className="sr-only"
                    />
                    ⏱️ Arch
                  </label>
                  <label
                    className={`cursor-pointer text-center py-1.5 rounded-lg border text-xs font-semibold ${
                      newTrType === 'ring' ? 'active bg-amber-700 text-white border-amber-700' : 'border-stone-200 dark:border-stone-800'
                    }`}
                    onClick={() => setNewTrType('ring')}
                  >
                    <input
                      type="radio"
                      name="trType"
                      checked={newTrType === 'ring'}
                      onChange={() => setNewTrType('ring')}
                      className="sr-only"
                    />
                    ⭕ Ring
                  </label>
                  <label
                    className={`cursor-pointer text-center py-1.5 rounded-lg border text-xs font-semibold ${
                      newTrType === 'bars' ? 'active bg-amber-700 text-white border-amber-700' : 'border-stone-200 dark:border-stone-800'
                    }`}
                    onClick={() => setNewTrType('bars')}
                  >
                    <input
                      type="radio"
                      name="trType"
                      checked={newTrType === 'bars'}
                      onChange={() => setNewTrType('bars')}
                      className="sr-only"
                    />
                    📊 Columns
                  </label>
                  <label
                    className={`cursor-pointer text-center py-1.5 rounded-lg border text-xs font-semibold ${
                      newTrType === 'dots' ? 'active bg-amber-700 text-white border-amber-700' : 'border-stone-200 dark:border-stone-800'
                    }`}
                    onClick={() => setNewTrType('dots')}
                  >
                    <input
                      type="radio"
                      name="trType"
                      checked={newTrType === 'dots'}
                      onChange={() => setNewTrType('dots')}
                      className="sr-only"
                    />
                    🔥 Streak
                  </label>
                </div>
              </fieldset>

              {/* Talk to Developer Banner per User Request */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-100 dark:bg-[#140e0a] border border-stone-200 dark:border-[#352317] mt-2">
                <div className="flex items-center gap-2">
                  <MessageSquareCode className="w-4 h-4 text-stone-500" />
                  <span className="text-[11px] text-stone-600 dark:text-stone-300">
                    Need a bespoke formula or complex tracker not working?
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddTrackerOpen(false);
                    if (onNavigate) onNavigate('talk-to-dev');
                    else onOpenSettings?.();
                  }}
                  className="px-2.5 py-1 rounded-md bg-stone-200 hover:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold cursor-pointer transition-colors"
                >
                  Talk to Developer 💬
                </button>
              </div>

              {/* Action Buttons */}
              <div className="atelier-d-acts flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="atelier-btn"
                  onClick={() => setIsAddTrackerOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="atelier-btn atelier-btn-ink">
                  Save Tracker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADD / EDIT FAVOURITE MODAL                                                */}
      {/* ========================================================================= */}
      {isFavModalOpen && (
        <div
          className="atelier-dialog-overlay"
          onClick={() => setIsFavModalOpen(false)}
        >
          <div
            className="atelier-dialog max-w-lg w-full max-h-[85vh] overflow-y-auto custom-scrollbar"
            style={{ width: '520px', maxWidth: '94vw', padding: '22px' }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label={editingFavId ? 'Edit Favourite' : 'Add Favourite'}
          >
            <div className="flex items-center justify-between pb-3 border-b mb-4" style={{ borderColor: 'var(--at-line)' }}>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4" style={{ color: 'var(--at-brass)' }} />
                <h3 className="text-base font-bold" style={{ color: 'var(--at-ink)' }}>
                  {editingFavId ? 'Edit Favourite' : 'Add to Favourites'}
                </h3>
              </div>
              <button
                type="button"
                className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
                onClick={() => setIsFavModalOpen(false)}
                style={{ color: 'var(--at-muted)' }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {!editingFavId && (books.length > 0 || notebooks.length > 0) && (
              <div className="mb-4">
                <p className="text-[11px] font-mono uppercase tracking-wider mb-2" style={{ color: 'var(--at-muted)' }}>
                  Quick Pick from Your Files
                </p>
                <div className="max-h-44 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
                  {books.map((bk) => (
                    <button
                      key={`pick-b-${bk.id}`}
                      type="button"
                      onClick={() => {
                        const item: CockpitFavouriteItem = {
                          id: `fav-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                          type: 'book',
                          sourceId: bk.id,
                          title: bk.title,
                          subject: bk.subject || 'Library Volume',
                          badge: bk.edition || (bk.storageProvider === 'google_drive' ? 'Drive PDF' : 'Book'),
                          coverColor: bk.coverColor,
                          pdfFileUrl: bk.pdfFileUrl,
                          driveFileId: bk.driveFileId,
                        };
                        saveFavourites([...favourites, item]);
                        setIsFavModalOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg border flex items-center justify-between gap-2 hover:brightness-105 cursor-pointer transition-all"
                      style={{ background: 'var(--at-paper)', borderColor: 'var(--at-line)', color: 'var(--at-ink)' }}
                    >
                      <span className="text-xs font-semibold truncate">{bk.title}</span>
                      <span className="text-[10px] font-mono shrink-0" style={{ color: 'var(--at-brass)' }}>
                        Book
                      </span>
                    </button>
                  ))}
                  {notebooks.map((nb) => (
                    <button
                      key={`pick-n-${nb.id}`}
                      type="button"
                      onClick={() => {
                        const item: CockpitFavouriteItem = {
                          id: `fav-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                          type: 'note',
                          sourceId: nb.id,
                          title: nb.title,
                          subject: nb.subject || 'Notebook',
                          badge: `${nb.pages?.length || 1} ${(nb.pages?.length || 1) === 1 ? 'Page' : 'Pages'}`,
                          coverColor: nb.coverColor,
                        };
                        saveFavourites([...favourites, item]);
                        setIsFavModalOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg border flex items-center justify-between gap-2 hover:brightness-105 cursor-pointer transition-all"
                      style={{ background: 'var(--at-paper)', borderColor: 'var(--at-line)', color: 'var(--at-ink)' }}
                    >
                      <span className="text-xs font-semibold truncate">{nb.title}</span>
                      <span className="text-[10px] font-mono shrink-0" style={{ color: 'var(--at-sage)' }}>
                        Note
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!favTitleInput.trim()) return;
                if (editingFavId) {
                  saveFavourites(
                    favourites.map((item) =>
                      item.id === editingFavId
                        ? {
                            ...item,
                            title: favTitleInput.trim(),
                            subject: favSubjectInput.trim(),
                            badge: favBadgeInput.trim() || 'Favourite',
                          }
                        : item
                    )
                  );
                } else {
                  saveFavourites([
                    ...favourites,
                    {
                      id: `fav-${Date.now()}`,
                      type: 'custom',
                      title: favTitleInput.trim(),
                      subject: favSubjectInput.trim() || String(currentSubject),
                      badge: favBadgeInput.trim() || 'Favourite',
                    },
                  ]);
                }
                setIsFavModalOpen(false);
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-[11px] font-semibold mb-1" style={{ color: 'var(--at-muted)' }}>
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={favTitleInput}
                  onChange={(e) => setFavTitleInput(e.target.value)}
                  placeholder="Enter file or book title..."
                  className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                  style={{ background: 'var(--at-paper)', borderColor: 'var(--at-line)', color: 'var(--at-ink)' }}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold mb-1" style={{ color: 'var(--at-muted)' }}>
                    Subject / Subtitle
                  </label>
                  <input
                    type="text"
                    value={favSubjectInput}
                    onChange={(e) => setFavSubjectInput(e.target.value)}
                    placeholder="Subject or folder..."
                    className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                    style={{ background: 'var(--at-paper)', borderColor: 'var(--at-line)', color: 'var(--at-ink)' }}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold mb-1" style={{ color: 'var(--at-muted)' }}>
                    Tag
                  </label>
                  <input
                    type="text"
                    value={favBadgeInput}
                    onChange={(e) => setFavBadgeInput(e.target.value)}
                    placeholder="Favourite / PDF"
                    className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                    style={{ background: 'var(--at-paper)', borderColor: 'var(--at-line)', color: 'var(--at-ink)' }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="atelier-btn"
                  onClick={() => setIsFavModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="atelier-btn atelier-btn-ink">
                  {editingFavId ? 'Save Changes' : 'Add Favourite'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


    </div>
  );
};
