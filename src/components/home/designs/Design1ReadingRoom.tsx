import React, { useState, useRef, useEffect } from 'react';
import {
  SubjectCourse,
  StudyTask,
  Notebook,
  UserProfile,
  OptionSlab,
  RosterEvent,
} from '../../../types';
import {
  Search,
  Settings,
  Lightbulb,
  Check,
  Plus,
  BookOpen,
  Calendar as CalendarIcon,
  Bell,
  SlidersHorizontal,
  X,
  FileText,
  Clock,
  Sparkles,
  Edit2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Users,
  Flame,
  Layers,
  ClipboardCheck,
  Edit3,
  ArrowUp,
  ArrowDown,
  Maximize2,
  Minimize2,
  Trash2,
  Eye,
  EyeOff,
  LayoutGrid,
  RotateCcw,
  PlusCircle,
  Activity,
  Play,
  Pause,
  Bookmark,
  Target,
  Award,
  Heart,
  Droplets,
  Coffee,
  Compass,
  Gamepad2,
  Dumbbell,
  Apple,
  Trees,
  Cpu,
  Globe,
  Volume2,
  VolumeX,
  Smile,
  ArrowRight,
  ArrowLeft,
  CheckSquare,
  Brain,
  Paperclip,
  Sliders,
  Download,
  CalendarDays,
  BellRing,
  BellOff,
  ShieldAlert,
  CheckCircle2,
  Circle,
} from 'lucide-react';
import { EditSlabModal } from '../EditSlabModal';
import { EditReminderModal } from '../EditReminderModal';
import { AskGeminiModal } from '../../common/AskGeminiModal';
import { ClinicalReminder } from '../../../types';

interface Design1Props {
  userProfile: UserProfile;
  currentSubject: SubjectCourse;
  onSelectSubject?: (subject: SubjectCourse) => void;
  optionSlabs?: OptionSlab[];
  onUpdateOptionSlabs?: (slabs: OptionSlab[]) => void;
  tasks: StudyTask[];
  onToggleTask: (taskId: string) => void;
  onAddTask?: (task: StudyTask) => void;
  notebooks: Notebook[];
  onOpenNotebook: (id: string) => void;
  onOpenStudio: (actionType?: string) => void;
  onOpenRosterModal: () => void;
  onOpenSettings?: () => void;
  onTriggerEyeBreak?: () => void;
  breakTimerCountdown?: string;
  rosterEvents?: RosterEvent[];
}

export const Design1ReadingRoom: React.FC<Design1Props> = ({
  userProfile,
  currentSubject,
  onSelectSubject,
  optionSlabs,
  onUpdateOptionSlabs,
  tasks,
  onToggleTask,
  onAddTask,
  notebooks,
  onOpenNotebook,
  onOpenStudio,
  onOpenRosterModal,
  onOpenSettings,
  onTriggerEyeBreak,
  breakTimerCountdown,
  rosterEvents = [],
}) => {
  const [bookSearchQuery, setBookSearchQuery] = useState('');
  const [taskInput, setTaskInput] = useState('');

  // Daily Updatable Thought of the Day State
  const defaultThoughts = [
    'Small steps today. A brighter, wiser doctor tomorrow.',
    'The good physician treats the disease; the great physician treats the patient who has the disease.',
    'Discipline in daily rounds transforms doubt into diagnostic confidence.',
    'Observation, Reason, Human Understanding, Courage; these make the physician.',
    'Medicine is a science of uncertainty and an art of probability.',
  ];

  const [activeThought, setActiveThought] = useState<string>(() => {
    return localStorage.getItem('medden_daily_thought') || defaultThoughts[0];
  });
  const [isEditingThought, setIsEditingThought] = useState(false);
  const [thoughtInputText, setThoughtInputText] = useState(activeThought);

  const handleSaveThought = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!thoughtInputText.trim()) return;
    const clean = thoughtInputText.trim();
    setActiveThought(clean);
    localStorage.setItem('medden_daily_thought', clean);
    setIsEditingThought(false);
  };

  const handleNextThought = () => {
    const nextIdx = (defaultThoughts.indexOf(activeThought) + 1) % defaultThoughts.length;
    const nextThought = defaultThoughts[nextIdx] || defaultThoughts[0];
    setActiveThought(nextThought);
    setThoughtInputText(nextThought);
    localStorage.setItem('medden_daily_thought', nextThought);
  };

  // Scroll Joystick Refs for smooth navigation within compact space
  const subjectsScrollRef = useRef<HTMLDivElement>(null);
  const booksScrollRef = useRef<HTMLDivElement>(null);
  const notesScrollRef = useRef<HTMLDivElement>(null);
  const groupsScrollRef = useRef<HTMLDivElement>(null);

  const scrollContainer = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right', amount = 220) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction === 'left' ? -amount : amount,
        behavior: 'smooth',
      });
    }
  };

  // Extract user greeting (defaults cleanly to "Dr Ashish")
  const greetingName = userProfile.name.toLowerCase().includes('ashish')
    ? 'Dr Ashish'
    : userProfile.name.startsWith('Dr.')
    ? userProfile.name.split(',')[0].replace('Dr. ', 'Dr ')
    : `Dr ${userProfile.name.split(' ')[0]}`;

  // =========================================================================
  // DYNAMIC SLABS SYSTEM (Subjects, Recent Books, Custom Slabs)
  // =========================================================================
  interface DynamicSlab {
    id: string;
    key: string;
    name: string;
    subtitle: string;
    category: 'Subjects' | 'Recent Books' | 'Custom';
    size?: 'compact' | 'normal' | 'expanded';
    fileAttachmentName?: string;
    fileAttachmentUrl?: string;
    fileAttachmentSize?: string;
    customNotes?: string;
    badge?: string;
    accentColor?: string;
  }

  const initialDefaultSlabs: DynamicSlab[] = [
    { id: 'slab-1', key: 'A', name: 'Pharmacology', subtitle: 'Autonomic, Cardio, Chemo', category: 'Subjects', badge: '14 Modules', accentColor: 'sky', size: 'normal' },
    { id: 'slab-2', key: 'B', name: 'Pathology', subtitle: 'Cell Injury, Inflammation, Neoplasia', category: 'Subjects', badge: 'Robbins High-Yield', accentColor: 'amber', size: 'normal' },
    { id: 'slab-3', key: 'C', name: 'Anatomy', subtitle: 'Head & Neck, Neuroanatomy, Limbs', category: 'Subjects', badge: 'Netter Dissections', accentColor: 'emerald', size: 'normal' },
    { id: 'slab-4', key: 'D', name: 'Physiology', subtitle: 'Renal, Endocrine, Hemodynamics', category: 'Subjects', badge: 'Guyton Mechanics', accentColor: 'indigo', size: 'normal' },
    { id: 'slab-5', key: 'E', name: 'Microbiology', subtitle: 'Bacteriology, Virology, Mycology', category: 'Subjects', badge: 'Culture Pearls', accentColor: 'rose', size: 'normal' },
    { id: 'slab-6', key: 'F', name: 'Internal Medicine', subtitle: 'Bedside Diagnosis & Rounds', category: 'Subjects', badge: 'Harrison Clinical', accentColor: 'slate', size: 'normal' },
  ];

  const [slabsList, setSlabsList] = useState<DynamicSlab[]>(() => {
    try {
      const saved = localStorage.getItem('medden_myspace_slabs');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return initialDefaultSlabs;
  });

  // Slab Altering Controls: Size, Density, Arrangement & Modals
  const [slabGlobalSize, setSlabGlobalSize] = useState<'compact' | 'normal' | 'expanded'>(() => {
    return (localStorage.getItem('medden_global_slab_size') as any) || 'normal';
  });
  const [slabLayoutMode, setSlabLayoutMode] = useState<'grid' | 'carousel'>('grid');
  const [slabGridDensity, setSlabGridDensity] = useState<'2' | '3' | '4'>(() => {
    return (localStorage.getItem('medden_grid_density') as any) || '3';
  });
  const [editingSlabTarget, setEditingSlabTarget] = useState<OptionSlab | null>(null);
  const [isAskGeminiModalOpen, setIsAskGeminiModalOpen] = useState(false);
  const [askGeminiTopic, setAskGeminiTopic] = useState<string>('Pharmacology');

  const [isAddSlabOpen, setIsAddSlabOpen] = useState(false);
  const [isEditingSlabs, setIsEditingSlabs] = useState(false);
  const [newSlabForm, setNewSlabForm] = useState({
    key: '',
    name: '',
    subtitle: '',
    category: 'Subjects' as 'Subjects' | 'Recent Books' | 'Custom',
  });

  const handleAddSlab = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlabForm.name.trim()) return;
    const newSlab: DynamicSlab = {
      id: `slab-${Date.now()}`,
      key: newSlabForm.key.trim() || String.fromCharCode(65 + (slabsList.length % 26)),
      name: newSlabForm.name.trim(),
      subtitle: newSlabForm.subtitle.trim() || 'Custom Clinical Module',
      category: newSlabForm.category,
      size: slabGlobalSize,
    };
    const updated = [...slabsList, newSlab];
    setSlabsList(updated);
    localStorage.setItem('medden_myspace_slabs', JSON.stringify(updated));
    setNewSlabForm({ key: '', name: '', subtitle: '', category: 'Subjects' });
    setIsAddSlabOpen(false);
  };

  const handleDeleteSlab = (slabId: string) => {
    const updated = slabsList.filter((s) => s.id !== slabId);
    setSlabsList(updated);
    localStorage.setItem('medden_myspace_slabs', JSON.stringify(updated));
  };

  const moveSlabPosition = (slabId: string, direction: 'left' | 'right') => {
    const idx = slabsList.findIndex((s) => s.id === slabId);
    if (idx < 0) return;
    const targetIdx = direction === 'left' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= slabsList.length) return;
    const updated = [...slabsList];
    const [moved] = updated.splice(idx, 1);
    updated.splice(targetIdx, 0, moved);
    setSlabsList(updated);
    localStorage.setItem('medden_myspace_slabs', JSON.stringify(updated));
  };

  const handleOpenEditSlabModal = (slab: DynamicSlab) => {
    const optionSlabFormat: OptionSlab = {
      id: slab.id,
      title: slab.name,
      subtitle: slab.subtitle,
      subject: (slab.name as SubjectCourse) || currentSubject,
      iconName: 'BookOpen',
      badge: slab.badge,
      accentColor: slab.accentColor || 'sky',
      enabled: true,
      linkAction: 'open-subject',
      fileAttachmentName: slab.fileAttachmentName,
      fileAttachmentUrl: slab.fileAttachmentUrl,
      fileAttachmentSize: slab.fileAttachmentSize,
      customNotes: slab.customNotes,
      size: slab.size || slabGlobalSize,
    };
    setEditingSlabTarget(optionSlabFormat);
  };

  const handleSaveEditedSlab = (updatedSlab: OptionSlab) => {
    const updated = slabsList.map((s) => {
      if (s.id === updatedSlab.id) {
        return {
          ...s,
          name: updatedSlab.title,
          subtitle: updatedSlab.subtitle,
          badge: updatedSlab.badge,
          size: updatedSlab.size,
          fileAttachmentName: updatedSlab.fileAttachmentName,
          fileAttachmentUrl: updatedSlab.fileAttachmentUrl,
          fileAttachmentSize: updatedSlab.fileAttachmentSize,
          customNotes: updatedSlab.customNotes,
          accentColor: updatedSlab.accentColor,
        };
      }
      return s;
    });
    setSlabsList(updated);
    localStorage.setItem('medden_myspace_slabs', JSON.stringify(updated));
  };

  // =========================================================================
  // MY SPACE WIDGETS SYSTEM (Reordering, Resizing & Customization)
  // =========================================================================
  interface SpaceWidgetConfig {
    id: string;
    title: string;
    description: string;
    visible: boolean;
    width: 'full' | 'half';
  }

  const initialDefaultWidgets: SpaceWidgetConfig[] = [
    { id: 'tracker', title: 'Tracker', description: 'Vital study metrics with custom tracking & catalog', visible: true, width: 'full' },
    { id: 'subjects', title: 'Topic', description: 'Topic slabs carousel with quick access & editing', visible: true, width: 'full' },
    { id: 'books', title: 'Recent Books', description: 'Medical textbooks & study readers with Add & Edit', visible: true, width: 'full' },
    { id: 'notes', title: 'Recent Notes', description: 'Direct links to clinical & topic notes with Add & Edit', visible: true, width: 'full' },
    { id: 'timer', title: 'Quick Focus & Eye Break Timer', description: '25-minute Pomodoro & 20-20-20 eye strain reminder', visible: false, width: 'half' },
  ];

  const [widgets, setWidgets] = useState<SpaceWidgetConfig[]>(() => {
    try {
      const saved = localStorage.getItem('medden_myspace_widgets');
      if (saved) {
        const parsed: SpaceWidgetConfig[] = JSON.parse(saved);
        // Remove leisure, pearls, and groups from My Space reading room
        const filtered = parsed.filter((w) => w.id !== 'pearls' && w.id !== 'leisure' && w.id !== 'groups');
        localStorage.setItem('medden_myspace_widgets', JSON.stringify(filtered));
        return filtered;
      }
    } catch {
      // fallback
    }
    return initialDefaultWidgets;
  });

  const [isCustomizeSpaceOpen, setIsCustomizeSpaceOpen] = useState(false);
  const [isEditLayoutMode, setIsEditLayoutMode] = useState(false);

  // Focus Timer Widget State
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => setTimerSeconds((s) => s - 1), 1000);
    } else if (timerSeconds === 0) {
      setTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  const moveWidget = (id: string, direction: 'up' | 'down') => {
    const idx = widgets.findIndex((w) => w.id === id);
    if (idx < 0) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= widgets.length) return;
    const updated = [...widgets];
    const [moved] = updated.splice(idx, 1);
    updated.splice(targetIdx, 0, moved);
    setWidgets(updated);
    localStorage.setItem('medden_myspace_widgets', JSON.stringify(updated));
  };

  const toggleWidgetWidth = (id: string) => {
    const updated = widgets.map((w) => {
      if (w.id === id) {
        return { ...w, width: (w.width === 'full' ? 'half' : 'full') as 'full' | 'half' };
      }
      return w;
    });
    setWidgets(updated);
    localStorage.setItem('medden_myspace_widgets', JSON.stringify(updated));
  };

  const toggleWidgetVisibility = (id: string) => {
    const updated = widgets.map((w) => (w.id === id ? { ...w, visible: !w.visible } : w));
    setWidgets(updated);
    localStorage.setItem('medden_myspace_widgets', JSON.stringify(updated));
  };

  const resetWidgets = () => {
    setWidgets(initialDefaultWidgets);
    localStorage.setItem('medden_myspace_widgets', JSON.stringify(initialDefaultWidgets));
  };

  // Recent Books (with 6 pastel colors from screenshot + extra scrollable items)
  const recentBooks = [
    {
      id: 'book-1',
      title: "Goodman & Gilman's Pharmacology",
      code: 'G&G',
      lastOpened: 'Last opened 2h ago',
      bgColor: '#cee3f8', // Baby Blue
      textColor: '#1e3a8a',
    },
    {
      id: 'book-2',
      title: 'Robbins & Cotran Pathologic Basis',
      code: 'Robbins',
      lastOpened: 'Last opened 5h ago',
      bgColor: '#fde8d7', // Light Cream / Peach
      textColor: '#7c2d12',
    },
    {
      id: 'book-3',
      title: "Netter's Atlas of Human Anatomy",
      code: 'Netter',
      lastOpened: 'Last opened 1d ago',
      bgColor: '#f9b98c', // Soft Coral / Orange
      textColor: '#9a3412',
    },
    {
      id: 'book-4',
      title: 'Guyton & Hall Medical Physiology',
      code: 'Guyton',
      lastOpened: 'Last opened 2d ago',
      bgColor: '#f2e2c8', // Warm Caramel Parchment
      textColor: '#5c351c',
    },
    {
      id: 'book-5',
      title: 'First Aid for the USMLE Step 1',
      code: 'First Aid',
      lastOpened: 'Last opened 3d ago',
      bgColor: '#8ec0e4', // Soft Blue
      textColor: '#0c4a6e',
    },
    {
      id: 'book-6',
      title: 'Harrison Principles of Internal Medicine',
      code: 'Harrison',
      lastOpened: 'Last opened 4d ago',
      bgColor: '#71717a', // Slate Charcoal Gray
      textColor: '#ffffff',
    },
    {
      id: 'book-7',
      title: 'Katzung Basic & Clinical Pharmacology',
      code: 'Katzung',
      lastOpened: 'Last opened 5d ago',
      bgColor: '#fed7aa',
      textColor: '#9a3412',
    },
    {
      id: 'book-8',
      title: 'Kumar & Clark Clinical Medicine',
      code: 'K&C',
      lastOpened: 'Last opened 6d ago',
      bgColor: '#c7d2fe',
      textColor: '#312e81',
    },
  ];

  // Recent Notes initial defaults
  const recentNotes = [
    {
      id: 'note-1',
      title: 'Autonomic Pharmacology & Receptors',
      subject: 'Pharmacology',
      lastOpened: 'Last opened 1h ago',
      bgColor: '#cee3f8',
      textColor: '#1e3a8a',
      notebookId: notebooks[0]?.id,
    },
    {
      id: 'note-2',
      title: 'Cellular Injury & Necrosis Pathways',
      subject: 'Pathology',
      lastOpened: 'Last opened 3h ago',
      bgColor: '#fde8d7',
      textColor: '#7c2d12',
      notebookId: notebooks[1]?.id,
    },
    {
      id: 'note-3',
      title: 'Brachial Plexus & Nerve Injuries',
      subject: 'Anatomy',
      lastOpened: 'Last opened 1d ago',
      bgColor: '#f9b98c',
      textColor: '#9a3412',
      notebookId: notebooks[2]?.id,
    },
    {
      id: 'note-4',
      title: 'Cardiac Action Potential & Arrhythmias',
      subject: 'Physiology',
      lastOpened: 'Last opened 2d ago',
      bgColor: '#f2e2c8',
      textColor: '#5c351c',
      notebookId: notebooks[0]?.id,
    },
    {
      id: 'note-5',
      title: 'Gram-Positive Bacilli & Toxins',
      subject: 'Microbiology',
      lastOpened: 'Last opened 3d ago',
      bgColor: '#8ec0e4',
      textColor: '#0c4a6e',
      notebookId: notebooks[1]?.id,
    },
  ];

  // Recent Groups initial defaults
  const recentGroups = [
    {
      id: 'grp-1',
      title: 'Internal Medicine Morning Rounds',
      members: '8 residents',
      lastOpened: 'Active 12m ago',
      status: 'Bedside Round',
    },
    {
      id: 'grp-2',
      title: 'USMLE Step 1 High-Yield Study Circle',
      members: '14 doctors',
      lastOpened: 'Active 1h ago',
      status: 'Q-Bank Review',
    },
    {
      id: 'grp-3',
      title: 'Robbins Pathology Case Discussions',
      members: '6 doctors',
      lastOpened: 'Active 4h ago',
      status: 'Histology',
    },
    {
      id: 'grp-4',
      title: 'Pharmacology Drug Class Drills',
      members: '11 doctors',
      lastOpened: 'Active 1d ago',
      status: 'Active',
    },
    {
      id: 'grp-5',
      title: 'Emergency Med & Trauma Journal Club',
      members: '9 doctors',
      lastOpened: 'Active 2d ago',
      status: 'Journal Club',
    },
  ];

  // =========================================================================
  // DYNAMIC RECENT BOOKS, NOTES & GROUPS SYSTEM
  // =========================================================================
  const [booksList, setBooksList] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('medden_myspace_books');
      if (saved) return JSON.parse(saved);
    } catch {}
    return recentBooks;
  });
  const [isEditingBooks, setIsEditingBooks] = useState(false);

  const [notesList, setNotesList] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('medden_myspace_notes');
      if (saved) return JSON.parse(saved);
    } catch {}
    return recentNotes;
  });
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  const [groupsList, setGroupsList] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('medden_myspace_groups');
      if (saved) return JSON.parse(saved);
    } catch {}
    return recentGroups;
  });
  const [isEditingGroups, setIsEditingGroups] = useState(false);

  // Active Add Modal: 'topic' | 'book' | 'note' | 'group' | null
  const [activeAddModal, setActiveAddModal] = useState<'topic' | 'book' | 'note' | 'group' | null>(null);

  const [newBookForm, setNewBookForm] = useState({ title: '', code: '' });
  const [newNoteForm, setNewNoteForm] = useState({ title: '', subject: 'Pharmacology' });
  const [newGroupForm, setNewGroupForm] = useState({ title: '', members: '6 doctors', status: 'Case Review' });

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBookForm.title.trim()) return;
    const colors = ['#cee3f8', '#fde8d7', '#f9b98c', '#f2e2c8', '#8ec0e4', '#fed7aa', '#c7d2fe'];
    const textColors = ['#1e3a8a', '#7c2d12', '#9a3412', '#5c351c', '#0c4a6e', '#9a3412', '#312e81'];
    const idx = booksList.length % colors.length;
    const newBook = {
      id: `book-${Date.now()}`,
      title: newBookForm.title.trim(),
      code: newBookForm.code.trim() || newBookForm.title.slice(0, 8),
      lastOpened: 'Just added',
      bgColor: colors[idx],
      textColor: textColors[idx],
    };
    const updated = [newBook, ...booksList];
    setBooksList(updated);
    localStorage.setItem('medden_myspace_books', JSON.stringify(updated));
    setNewBookForm({ title: '', code: '' });
    setActiveAddModal(null);
  };

  const handleDeleteBook = (id: string) => {
    const updated = booksList.filter((b: any) => b.id !== id);
    setBooksList(updated);
    localStorage.setItem('medden_myspace_books', JSON.stringify(updated));
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteForm.title.trim()) return;
    const colors = ['#cee3f8', '#fde8d7', '#f9b98c', '#f2e2c8', '#8ec0e4'];
    const textColors = ['#1e3a8a', '#7c2d12', '#9a3412', '#5c351c', '#0c4a6e'];
    const idx = notesList.length % colors.length;
    const newNote = {
      id: `note-${Date.now()}`,
      title: newNoteForm.title.trim(),
      code: `${newNoteForm.subject.slice(0, 4)} Note`,
      subject: newNoteForm.subject.trim(),
      lastOpened: 'Just added',
      bgColor: colors[idx],
      textColor: textColors[idx],
      notebookId: notebooks[0]?.id,
    };
    const updated = [newNote, ...notesList];
    setNotesList(updated);
    localStorage.setItem('medden_myspace_notes', JSON.stringify(updated));
    setNewNoteForm({ title: '', subject: 'Pharmacology' });
    setActiveAddModal(null);
  };

  const handleDeleteNote = (id: string) => {
    const updated = notesList.filter((n: any) => n.id !== id);
    setNotesList(updated);
    localStorage.setItem('medden_myspace_notes', JSON.stringify(updated));
  };

  const handleAddGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupForm.title.trim()) return;
    const newGroup = {
      id: `grp-${Date.now()}`,
      title: newGroupForm.title.trim(),
      members: newGroupForm.members.trim() || '8 members',
      lastOpened: 'Just added',
      status: newGroupForm.status.trim() || 'Active Discussion',
    };
    const updated = [newGroup, ...groupsList];
    setGroupsList(updated);
    localStorage.setItem('medden_myspace_groups', JSON.stringify(updated));
    setNewGroupForm({ title: '', members: '6 doctors', status: 'Case Review' });
    setActiveAddModal(null);
  };

  const handleDeleteGroup = (id: string) => {
    const updated = groupsList.filter((g: any) => g.id !== id);
    setGroupsList(updated);
    localStorage.setItem('medden_myspace_groups', JSON.stringify(updated));
  };

  // =========================================================================
  // DYNAMIC TRACKERS SYSTEM (Add, Edit, Catalog Modal)
  // =========================================================================
  interface StudyTrackerItem {
    id: string;
    title: string;
    value: string;
    subtext: string;
    iconType: 'flame' | 'clock' | 'layers' | 'check' | 'edit' | 'target' | 'award' | 'heart' | 'droplet' | 'coffee' | 'brain';
    color: string;
    actionType?: string;
  }

  const DEFAULT_TRACKERS: StudyTrackerItem[] = [
    { id: 'trk-1', title: 'Study streak', value: '12 days', subtext: 'Daily streak active', iconType: 'flame', color: '#8f5f2c' },
    { id: 'trk-2', title: 'This week', value: '26.5 hrs', subtext: 'Total study hours', iconType: 'clock', color: '#8f5f2c' },
    { id: 'trk-3', title: 'Flashcards due', value: '42', subtext: 'High-yield decks', iconType: 'layers', color: '#8f5f2c', actionType: 'flashcards' },
    { id: 'trk-4', title: 'Tasks done', value: `${tasks.filter((t) => t.completed).length} / ${tasks.length || 6}`, subtext: 'Daily checklist', iconType: 'check', color: '#8f5f2c' },
    { id: 'trk-5', title: 'Notes written', value: '394', subtext: 'Clinical notebook pages', iconType: 'edit', color: '#8f5f2c', actionType: 'notes' },
  ];

  const PRESET_TRACKERS_CATALOG: StudyTrackerItem[] = [
    { id: 'cat-qbank', title: 'Questions Practiced', value: '48 / 60 Qs', subtext: 'Daily UWorld/USMLE Q-Bank', iconType: 'target', color: '#dc2626' },
    { id: 'cat-accuracy', title: 'Diagnostic Accuracy', value: '84%', subtext: 'High-yield recall rate', iconType: 'award', color: '#d97706' },
    { id: 'cat-pomodoro', title: 'Pomodoro Blocks', value: '6 rounds', subtext: '25m deep work rounds', iconType: 'clock', color: '#4f46e5' },
    { id: 'cat-sleep', title: 'Sleep & Recovery', value: '7.5 hrs', subtext: 'Restful brain recovery', iconType: 'heart', color: '#e11d48' },
    { id: 'cat-water', title: 'Daily Hydration', value: '2.4 L', subtext: 'Target 3.0 Liters', iconType: 'droplet', color: '#0891b2' },
    { id: 'cat-cases', title: 'Cases Solved', value: '14 cases', subtext: 'Ward rounds & diagnosis', iconType: 'brain', color: '#7c3aed' },
    { id: 'cat-revision', title: 'Spaced Repetition', value: '3 cycles', subtext: 'Long-term retention', iconType: 'layers', color: '#4a76a4' },
    { id: 'cat-pearls', title: 'Clinical Pearls', value: '28 pearls', subtext: 'High-yield mnemonics', iconType: 'flame', color: '#ea580c' },
    { id: 'cat-focus', title: 'Deep Focus Score', value: '92%', subtext: 'Zero phone distractions', iconType: 'coffee', color: '#8f5f2c' },
  ];

  const [trackersList, setTrackersList] = useState<StudyTrackerItem[]>(() => {
    try {
      const saved = localStorage.getItem('medden_myspace_trackers');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_TRACKERS;
  });
  const [isEditingTrackers, setIsEditingTrackers] = useState(false);
  const [isAddTrackerModalOpen, setIsAddTrackerModalOpen] = useState(false);
  const [newCustomTrackerForm, setNewCustomTrackerForm] = useState({
    title: '',
    value: '',
    subtext: '',
    iconType: 'target' as StudyTrackerItem['iconType'],
  });

  const handleAddTrackerFromCatalog = (preset: StudyTrackerItem) => {
    if (trackersList.some((t) => t.id === preset.id)) return;
    const updated = [...trackersList, preset];
    setTrackersList(updated);
    localStorage.setItem('medden_myspace_trackers', JSON.stringify(updated));
  };

  const handleCreateCustomTracker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomTrackerForm.title.trim()) return;
    const customItem: StudyTrackerItem = {
      id: `trk-custom-${Date.now()}`,
      title: newCustomTrackerForm.title.trim(),
      value: newCustomTrackerForm.value.trim() || '0',
      subtext: newCustomTrackerForm.subtext.trim() || 'Active Goal',
      iconType: newCustomTrackerForm.iconType,
      color: '#2563eb',
    };
    const updated = [...trackersList, customItem];
    setTrackersList(updated);
    localStorage.setItem('medden_myspace_trackers', JSON.stringify(updated));
    setNewCustomTrackerForm({ title: '', value: '', subtext: '', iconType: 'target' });
    setIsAddTrackerModalOpen(false);
  };

  const handleDeleteTracker = (id: string) => {
    const updated = trackersList.filter((t) => t.id !== id);
    setTrackersList(updated);
    localStorage.setItem('medden_myspace_trackers', JSON.stringify(updated));
  };

  // Helper to render tracker icon
  const renderTrackerIcon = (iconType: StudyTrackerItem['iconType']) => {
    switch (iconType) {
      case 'flame': return <Flame className="w-4 h-4 stroke-[2]" />;
      case 'clock': return <Clock className="w-4 h-4 stroke-[2]" />;
      case 'layers': return <Layers className="w-4 h-4 stroke-[2]" />;
      case 'check': return <ClipboardCheck className="w-4 h-4 stroke-[2]" />;
      case 'edit': return <Edit3 className="w-4 h-4 stroke-[2]" />;
      case 'target': return <Target className="w-4 h-4 stroke-[2]" />;
      case 'award': return <Award className="w-4 h-4 stroke-[2]" />;
      case 'heart': return <Heart className="w-4 h-4 stroke-[2]" />;
      case 'droplet': return <Droplets className="w-4 h-4 stroke-[2]" />;
      case 'coffee': return <Coffee className="w-4 h-4 stroke-[2]" />;
      case 'brain': return <Brain className="w-4 h-4 stroke-[2]" />;
      default: return <Activity className="w-4 h-4 stroke-[2]" />;
    }
  };

  // =========================================================================
  // LEISURE & ANTI-DISTRACTION RELAXATION SYSTEM
  // =========================================================================
  interface LeisureCategory {
    id: 'science' | 'travel' | 'tech' | 'games' | 'yoga' | 'exercises' | 'food' | 'nature';
    title: string;
    tagline: string;
    image: string;
    badge: string;
    color: string;
  }

  const LEISURE_CATEGORIES: LeisureCategory[] = [
    {
      id: 'science',
      title: 'Science & Cosmos',
      tagline: 'Deep space discoveries, quantum biology & mind wonders',
      image: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=600&q=80',
      badge: 'Mind Wonder',
      color: '#3b82f6',
    },
    {
      id: 'travel',
      title: 'Travel & Escapes',
      tagline: 'Peaceful scenic walks: Amalfi Coast, Kyoto bamboo, Swiss Alps',
      image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
      badge: 'Virtual Walk',
      color: '#0ea5e9',
    },
    {
      id: 'tech',
      title: 'Future Tech & AI',
      tagline: 'Surgical robotics, bionic prosthetics & Neuralink medicine',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80',
      badge: 'Innovations',
      color: '#8b5cf6',
    },
    {
      id: 'games',
      title: '2-Min Brain Games',
      tagline: 'Medical word scramble, rapid diagnosis blitz & mini puzzles',
      image: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=600&q=80',
      badge: 'Playable Mini-Game',
      color: '#ec4899',
    },
    {
      id: 'yoga',
      title: 'Desk Yoga & Posture',
      tagline: 'Seated spinal twist, eagle arms & 4-7-8 Pranayama breath',
      image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80',
      badge: '2-Min Reset',
      color: '#b57c52',
    },
    {
      id: 'exercises',
      title: 'Quick Study Exercises',
      tagline: 'Doctor spinal decompression, carpal tunnel & 20-20-20 eye gym',
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
      badge: 'Study Break',
      color: '#f59e0b',
    },
    {
      id: 'food',
      title: 'Brain Fuel & Snacks',
      tagline: 'Antioxidant bowls, matcha l-theanine & ward smoothie fuel',
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=600&q=80',
      badge: 'Nutrition',
      color: '#d97706',
    },
    {
      id: 'nature',
      title: 'Nature Soundscapes',
      tagline: 'Calming rain on glass, alpine pine winds & ocean surf',
      image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80',
      badge: 'Calming Audio',
      color: '#4a76a4',
    },
  ];

  const [selectedLeisureCategory, setSelectedLeisureCategory] = useState<LeisureCategory | null>(null);
  const [isNatureAudioPlaying, setIsNatureAudioPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  const toggleNatureAudio = () => {
    if (isNatureAudioPlaying) {
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }
      setIsNatureAudioPlaying(false);
    } else {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        audioContextRef.current = ctx;
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          data[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = data[i];
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, ctx.currentTime);
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start();
        setIsNatureAudioPlaying(true);
      } catch {
        setIsNatureAudioPlaying(true);
      }
    }
  };

  // Word Scramble Mini-Game State
  const scrambleWords = [
    { word: 'SYNAPSE', clue: 'Microscopic junction where neurotransmitters pass chemical signals' },
    { word: 'ANEURYSM', clue: 'Localized ballooning or dilation of an arterial vessel wall' },
    { word: 'NEPHRON', clue: 'Functional microscopic filtering unit of the human kidney' },
    { word: 'MYOCARDIUM', clue: 'Muscular middle tissue layer of the heart wall' },
  ];
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [scrambleInput, setScrambleInput] = useState('');
  const [scrambleFeedback, setScrambleFeedback] = useState<string | null>(null);

  const currentScramble = scrambleWords[currentWordIdx];

  const handleCheckScramble = (e: React.FormEvent) => {
    e.preventDefault();
    if (scrambleInput.trim().toUpperCase() === currentScramble.word) {
      setScrambleFeedback('Correct! Diagnostic mastery unlocked.');
    } else {
      setScrambleFeedback('Try again! Think about the clinical clue.');
    }
  };

  const filteredBooks = booksList.filter((b: { title: string; code: string }) =>
    b.title.toLowerCase().includes(bookSearchQuery.toLowerCase()) ||
    b.code.toLowerCase().includes(bookSearchQuery.toLowerCase())
  );

  const handleAddNewTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskInput.trim() || !onAddTask) return;
    onAddTask({
      id: `task-${Date.now()}`,
      title: taskInput.trim(),
      subject: currentSubject,
      dueTime: 'Today',
      completed: false,
      highYield: true,
    });
    setTaskInput('');
  };

  // Clinical reminders state & handlers with notification support
  const [reminders, setReminders] = useState<ClinicalReminder[]>(() => {
    try {
      const saved = localStorage.getItem('medden_clinical_reminders');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'rem-1',
        title: 'Ward Rounds Case Presentation (Cardiology)',
        dueTime: 'Tomorrow, 08:30 AM',
        category: 'Ward Rounds',
        priority: 'critical',
        notificationEnabled: true,
        notificationType: 'both',
        alertTiming: '30m-before',
        recurrence: 'daily',
        notes: 'Present Digoxin vs Metoprolol clinical trial data.',
      },
      {
        id: 'rem-2',
        title: 'Check Vancomycin Trough & Serum Creatinine',
        dueTime: 'Today, 02:00 PM',
        category: 'Drug Review',
        priority: 'critical',
        notificationEnabled: true,
        notificationType: 'sound',
        alertTiming: '10m-before',
        recurrence: 'every-4h',
        notes: 'Target trough 15-20 mcg/mL for MRSA bacteremia.',
      },
      {
        id: 'rem-3',
        title: 'High-Yield Mnemonic Recall (SICKFACES CYP450)',
        dueTime: 'Today, 06:00 PM',
        category: 'Exam Trap',
        priority: 'high',
        notificationEnabled: true,
        notificationType: 'banner',
        alertTiming: '10m-before',
        recurrence: 'daily',
        notes: 'Recall all 9 enzyme inhibitors before evening study.',
      },
      {
        id: 'rem-4',
        title: `Eye Break Timer (${breakTimerCountdown || '12 min left'})`,
        dueTime: 'Regular Interval',
        category: 'Wellness & Rest',
        priority: 'wellness',
        notificationEnabled: true,
        notificationType: 'sound',
        alertTiming: 'at-time',
        recurrence: 'every-4h',
      },
    ];
  });

  const [editingReminder, setEditingReminder] = useState<ClinicalReminder | null>(null);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [taskFilter, setTaskFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const handleSaveReminder = (updated: ClinicalReminder) => {
    setReminders((prev) => {
      const exists = prev.some((r) => r.id === updated.id);
      const next = exists ? prev.map((r) => (r.id === updated.id ? updated : r)) : [updated, ...prev];
      localStorage.setItem('medden_clinical_reminders', JSON.stringify(next));
      return next;
    });
  };

  const handleDeleteReminder = (id: string) => {
    setReminders((prev) => {
      const next = prev.filter((r) => r.id !== id);
      localStorage.setItem('medden_clinical_reminders', JSON.stringify(next));
      return next;
    });
  };

  const handleToggleReminderNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setReminders((prev) => {
      const next = prev.map((r) => (r.id === id ? { ...r, notificationEnabled: !r.notificationEnabled } : r));
      localStorage.setItem('medden_clinical_reminders', JSON.stringify(next));
      return next;
    });
  };

  // Joystick controller component to scroll items within compact spaces
  const ScrollJoystick = ({
    onLeft,
    onRight,
  }: {
    onLeft: () => void;
    onRight: () => void;
  }) => (
    <div className="flex items-center gap-0.5 bg-[#ecebe6] dark:bg-[#1a120d] p-0.5 rounded-lg border border-[#5f7585]/40 dark:border-[#382518] shadow-2xs">
      <button
        onClick={onLeft}
        className="p-1 rounded hover:bg-white dark:hover:bg-[#251a12] text-slate-700 dark:text-[#d8c7b0] transition-all active:scale-90"
        title="Scroll Left / Previous"
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
      </button>
      <div className="w-1 h-1 rounded-full bg-[#5f7585]/70 dark:bg-[#8c6b4e] mx-0.5" />
      <button
        onClick={onRight}
        className="p-1 rounded hover:bg-white dark:hover:bg-[#251a12] text-slate-700 dark:text-[#d8c7b0] transition-all active:scale-90"
        title="Scroll Right / Next"
        aria-label="Scroll right"
      >
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );

  // =========================================================================
  // RENDER SPECIFIC WIDGET SECTION CONTENT
  // =========================================================================
  const renderWidgetContent = (widgetId: string) => {
    switch (widgetId) {
      case 'tracker':
        return (
          <div>
            <div className="flex items-center justify-between pb-1.5 border-b border-[#c2d7ed] dark:border-[#352317] mb-3.5">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#8f5f2c] dark:text-[#d4a373]" />
                <h3 className="text-sm sm:text-base font-bold text-slate-800 dark:text-[#efe4d4]">
                  Tracker
                </h3>
                <span className="text-[10px] font-mono text-slate-500 dark:text-[#a69079] hidden sm:inline">
                  · Live Study Metrics ({trackersList.length})
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* 1. Add Tracker Button */}
                <button
                  onClick={() => setIsAddTrackerModalOpen(true)}
                  className="flex items-center gap-1 text-[11px] font-semibold text-blue-700 dark:text-amber-300 hover:text-blue-900 dark:hover:text-[#fff6e8] bg-blue-50 dark:bg-[#251a12] border border-blue-200 dark:border-[#4b3322] px-2 py-0.5 rounded-lg transition-colors cursor-pointer"
                  title="Add new study metric tracker"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Tracker</span>
                </button>

                {/* 2. Hidden Button for Full List of Different Trackers */}
                <button
                  onClick={() => setIsAddTrackerModalOpen(true)}
                  className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 dark:text-[#d8c7b0] hover:text-slate-900 dark:hover:text-[#efe4d4] bg-slate-100 dark:bg-[#211711] border border-slate-300 dark:border-[#382518] px-2 py-0.5 rounded-lg transition-colors cursor-pointer"
                  title="Browse complete catalog of medical & productivity trackers"
                >
                  <SlidersHorizontal className="w-3 h-3 text-slate-500 dark:text-[#a69079]" />
                  <span>Available Trackers</span>
                </button>

                {/* 3. Edit Trackers Button */}
                <button
                  onClick={() => setIsEditingTrackers(!isEditingTrackers)}
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-lg border transition-colors cursor-pointer ${
                    isEditingTrackers
                      ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/50 dark:text-amber-200'
                      : 'text-slate-600 dark:text-[#a69079] border-slate-300 dark:border-[#382518] hover:bg-slate-100 dark:hover:bg-[#251a12]'
                  }`}
                  title="Toggle edit/delete mode for tracker metrics"
                >
                  {isEditingTrackers ? 'Done' : 'Edit Trackers'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-3.5">
              {trackersList.map((trk) => (
                <div
                  key={trk.id}
                  onClick={() => {
                    if (isEditingTrackers) return;
                    if (trk.actionType === 'flashcards') onOpenStudio('flashcards');
                    else if (trk.actionType === 'notes') {
                      if (notebooks.length > 0) onOpenNotebook(notebooks[0].id);
                      else onOpenStudio('new-note');
                    }
                  }}
                  className={`bg-[#fcfbf7] dark:bg-[#1a120d] border border-[#e5e0d4] dark:border-[#382518] rounded-xl p-3 sm:p-3.5 shadow-2xs flex items-center gap-3 transition-transform hover:-translate-y-0.5 relative group ${
                    trk.actionType ? 'cursor-pointer' : ''
                  }`}
                  title={`${trk.title} · ${trk.subtext}`}
                >
                  <div className="w-9 h-9 rounded-full bg-[#f0ede4] dark:bg-[#251a12] flex items-center justify-center shrink-0 text-[#8f5f2c] dark:text-[#d4a373]">
                    {renderTrackerIcon(trk.iconType)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-base sm:text-lg font-bold text-[#1f2937] dark:text-[#efe4d4] leading-tight truncate">
                      {trk.id === 'trk-4' ? `${tasks.filter((t) => t.completed).length} / ${tasks.length || 6}` : trk.value}
                    </div>
                    <div className="text-[11px] font-sans text-slate-500 dark:text-[#a69079] font-medium leading-none mt-0.5 truncate">
                      {trk.title}
                    </div>
                  </div>

                  {/* Delete button in Edit mode */}
                  {isEditingTrackers && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTracker(trk.id);
                      }}
                      className="absolute -top-1.5 -right-1.5 p-1 rounded-full bg-[#7f1d1d] hover:bg-[#962d32] text-[#fdf2f2] shadow-md hover:scale-110 transition-transform"
                      title="Delete tracker"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}

              {/* Quick Add Tracker Card */}
              <div
                onClick={() => setIsAddTrackerModalOpen(true)}
                className="bg-[#fcfbf7]/60 dark:bg-[#1a120d]/70 border border-dashed border-[#b8c5d6] dark:border-[#4b3322] rounded-xl p-3 sm:p-3.5 shadow-2xs flex items-center justify-center gap-2 transition-transform hover:-translate-y-0.5 cursor-pointer hover:border-amber-500 text-slate-600 dark:text-[#a69079] hover:text-amber-600 dark:hover:text-amber-300"
                title="Add new metric tracker"
              >
                <Plus className="w-4 h-4 text-blue-600 dark:text-amber-400" />
                <span className="text-xs font-semibold">New Tracker</span>
              </div>
            </div>
          </div>
        );

      case 'subjects':
        return (
          <div className="space-y-3">
            {/* Slabs Control Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-[#c2d7ed] dark:border-[#352317] gap-2.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-bold text-slate-800 dark:text-[#efe4d4] flex items-center gap-2">
                  <span>Topic Modules</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#8f5f2c]/15 text-[#8f5f2c] dark:text-[#d4a373] font-semibold border border-[#8f5f2c]/30 dark:border-[#4b3322]">
                    {slabsList.length} Slabs
                  </span>
                </h3>

                {/* Slabs Size Switcher (Compact / Normal / Expanded) */}
                <div className="flex items-center bg-stone-100 dark:bg-[#18110c] p-0.5 rounded-lg border border-stone-200 dark:border-[#382518]">
                  {(['compact', 'normal', 'expanded'] as const).map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSlabGlobalSize(sz)}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-semibold capitalize transition-all cursor-pointer ${
                        slabGlobalSize === sz
                          ? 'bg-white dark:bg-[#2b1e15] text-sky-700 dark:text-amber-300 shadow-2xs font-bold'
                          : 'text-stone-500 dark:text-[#a69079] hover:text-stone-800 dark:hover:text-[#efe4d4]'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>

                {/* Grid Density Switcher (2, 3, 4 Cols or Carousel) */}
                <div className="flex items-center bg-stone-100 dark:bg-[#18110c] p-0.5 rounded-lg border border-stone-200 dark:border-[#382518]">
                  <button
                    type="button"
                    onClick={() => setSlabLayoutMode('carousel')}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-all cursor-pointer ${
                      slabLayoutMode === 'carousel'
                        ? 'bg-white dark:bg-[#2b1e15] text-sky-700 dark:text-amber-300 shadow-2xs'
                        : 'text-stone-500 dark:text-[#a69079] hover:text-stone-800 dark:hover:text-[#efe4d4]'
                    }`}
                  >
                    Carousel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSlabLayoutMode('grid');
                      setSlabGridDensity('2');
                    }}
                    className={`px-1.5 py-0.5 rounded-md text-[10px] font-semibold transition-all cursor-pointer ${
                      slabLayoutMode === 'grid' && slabGridDensity === '2'
                        ? 'bg-white dark:bg-[#2b1e15] text-sky-700 dark:text-amber-300 shadow-2xs'
                        : 'text-stone-500 dark:text-[#a69079] hover:text-stone-800 dark:hover:text-[#efe4d4]'
                    }`}
                  >
                    2 Col
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSlabLayoutMode('grid');
                      setSlabGridDensity('3');
                    }}
                    className={`px-1.5 py-0.5 rounded-md text-[10px] font-semibold transition-all cursor-pointer ${
                      slabLayoutMode === 'grid' && slabGridDensity === '3'
                        ? 'bg-white dark:bg-[#2b1e15] text-sky-700 dark:text-amber-300 shadow-2xs'
                        : 'text-stone-500 dark:text-[#a69079] hover:text-stone-800 dark:hover:text-[#efe4d4]'
                    }`}
                  >
                    3 Col
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSlabLayoutMode('grid');
                      setSlabGridDensity('4');
                    }}
                    className={`px-1.5 py-0.5 rounded-md text-[10px] font-semibold transition-all cursor-pointer ${
                      slabLayoutMode === 'grid' && slabGridDensity === '4'
                        ? 'bg-white dark:bg-[#2b1e15] text-sky-700 dark:text-amber-300 shadow-2xs'
                        : 'text-stone-500 dark:text-[#a69079] hover:text-stone-800 dark:hover:text-[#efe4d4]'
                    }`}
                  >
                    4 Col
                  </button>
                </div>
              </div>

              {/* Action Buttons: Add Topic & Reorder */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsAskGeminiModalOpen(true)}
                  className="flex items-center gap-1 text-[11px] font-semibold text-sky-700 dark:text-amber-300 bg-sky-50 dark:bg-[#251a12] border border-sky-200 dark:border-[#4b3322] px-2 py-0.5 rounded-lg transition-colors cursor-pointer"
                  title="Ask Gemini about active subject"
                >
                  <Sparkles className="w-3 h-3 text-sky-500 dark:text-amber-400" />
                  <span className="hidden sm:inline">Ask Gemini</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveAddModal('topic')}
                  className="flex items-center gap-1 text-[11px] font-semibold text-blue-700 dark:text-amber-300 hover:text-blue-900 dark:hover:text-[#fff6e8] bg-blue-50 dark:bg-[#251a12] border border-blue-200 dark:border-[#4b3322] px-2.5 py-0.5 rounded-lg transition-colors cursor-pointer"
                  title="Add new topic slab"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Slab</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsEditingSlabs(!isEditingSlabs)}
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-lg border transition-colors cursor-pointer ${
                    isEditingSlabs
                      ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/50 dark:text-amber-200'
                      : 'text-slate-600 dark:text-[#a69079] border-slate-300 dark:border-[#382518] hover:bg-slate-100 dark:hover:bg-[#251a12]'
                  }`}
                  title="Toggle reordering & editing controls on slabs"
                >
                  {isEditingSlabs ? 'Done' : 'Arrange / Edit'}
                </button>
              </div>
            </div>

            {/* Slabs Container: Either Responsive Grid or Scrollable Carousel */}
            {slabLayoutMode === 'carousel' ? (
              <div className="relative">
                <div
                  ref={subjectsScrollRef}
                  className="flex items-stretch gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700"
                  style={{ scrollSnapType: 'x mandatory' }}
                >
                  {slabsList.map((slab) => {
                    const isSelected = currentSubject === slab.name;
                    return (
                      <div
                        key={slab.id}
                        onClick={() => {
                          if (isEditingSlabs) return;
                          if (slab.category === 'Recent Books') {
                            onOpenStudio('study-reader');
                          } else {
                            onSelectSubject?.(slab.name as SubjectCourse);
                          }
                        }}
                        className={`min-w-[220px] sm:min-w-[250px] ${
                          slabGlobalSize === 'compact' ? 'h-13 py-1.5' : slabGlobalSize === 'expanded' ? 'min-h-[110px] py-3' : 'h-16 py-2'
                        } px-3.5 rounded-xl flex flex-col justify-between border cursor-pointer transition-all duration-150 select-none shrink-0 relative group ${
                          isSelected
                            ? 'bg-[#f3eadb] dark:bg-[#2a1c13] border-[#a47c43] dark:border-[#c49257] shadow-sm ring-1 ring-[#a47c43]/30 dark:ring-[#c49257]/35'
                            : 'bg-[#ecebe6] dark:bg-[#1a120d] hover:bg-[#e2e0d8] dark:hover:bg-[#251a12] border-[#5f7585]/40 dark:border-[#382518] shadow-[0_2px_4px_rgba(0,0,0,0.05)]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="text-sm font-mono font-bold text-slate-900 dark:text-[#efe4d4] shrink-0">
                              {slab.key}
                            </span>
                            <div className="truncate">
                              <span className="text-xs font-semibold text-slate-800 dark:text-[#efe4d4] block truncate">
                                {slab.name}
                              </span>
                              <span className="text-[10px] text-slate-500 dark:text-[#a69079] block truncate font-mono">
                                {slab.subtitle}
                              </span>
                            </div>
                          </div>

                          {/* Quick Slab Action Buttons */}
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenEditSlabModal(slab);
                              }}
                              className="p-1 rounded-md text-stone-400 hover:text-slate-800 dark:hover:text-[#efe4d4] hover:bg-black/5 dark:hover:bg-[#2b1e15] transition-colors"
                              title="Edit slab properties"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            {isSelected && (
                              <div className="w-4 h-4 rounded-full bg-blue-600 dark:bg-amber-600 text-white flex items-center justify-center shadow-2xs">
                                <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* File Attachment & Notes in Expanded Mode */}
                        {slabGlobalSize === 'expanded' && (
                          <div className="pt-1.5 mt-1.5 border-t border-stone-200/60 dark:border-[#352317] flex items-center justify-between text-[10px]">
                            {slab.fileAttachmentName ? (
                              <span className="flex items-center gap-1 text-[#446378] dark:text-amber-300 truncate font-mono">
                                <Paperclip className="w-2.5 h-2.5" />
                                <span className="truncate">{slab.fileAttachmentName}</span>
                              </span>
                            ) : (
                              <span className="text-stone-400 dark:text-[#8b735c] italic">No file attached</span>
                            )}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setAskGeminiTopic(slab.name);
                                setIsAskGeminiModalOpen(true);
                              }}
                              className="text-[10px] text-sky-600 dark:text-amber-400 font-semibold flex items-center gap-0.5 hover:underline"
                            >
                              <Sparkles className="w-2.5 h-2.5" />
                              <span>AI Pearl</span>
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Responsive Grid Mode */
              <div
                className={`grid gap-3 ${
                  slabGridDensity === '2'
                    ? 'grid-cols-1 sm:grid-cols-2'
                    : slabGridDensity === '4'
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                }`}
              >
                {slabsList.map((slab) => {
                  const isSelected = currentSubject === slab.name;
                  return (
                    <div
                      key={slab.id}
                      onClick={() => {
                        if (isEditingSlabs) return;
                        if (slab.category === 'Recent Books') {
                          onOpenStudio('study-reader');
                        } else {
                          onSelectSubject?.(slab.name as SubjectCourse);
                        }
                      }}
                      className={`rounded-xl border cursor-pointer transition-all duration-150 select-none relative group flex flex-col justify-between ${
                        slabGlobalSize === 'compact'
                          ? 'p-2.5'
                          : slabGlobalSize === 'expanded'
                          ? 'p-4 min-h-[110px]'
                          : 'p-3.5'
                      } ${
                        isSelected
                          ? 'bg-[#f3eadb] dark:bg-[#2a1c13] border-[#a47c43] dark:border-[#c49257] shadow-sm ring-1 ring-[#a47c43]/30 dark:ring-[#c49257]/35'
                          : 'bg-[#ecebe6] dark:bg-[#1a120d] hover:bg-[#e2e0d8] dark:hover:bg-[#251a12] border-[#5f7585]/40 dark:border-[#382518] shadow-[0_2px_4px_rgba(0,0,0,0.05)]'
                      }`}
                    >
                      {/* Top Row: Key + Title + Badge + Actions */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-7 h-7 rounded-lg bg-stone-200/80 dark:bg-[#2b1e15] text-slate-900 dark:text-[#efe4d4] font-mono font-bold text-xs flex items-center justify-center shrink-0">
                            {slab.key}
                          </span>
                          <div className="truncate">
                            <div className="flex items-center gap-1.5 truncate">
                              <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-[#efe4d4] truncate">
                                {slab.name}
                              </span>
                              {slab.badge && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-stone-200 dark:bg-[#251a12] text-stone-700 dark:text-[#d8c7b0] font-mono shrink-0 border border-transparent dark:border-[#382518]">
                                  {slab.badge}
                                </span>
                              )}
                            </div>
                            {slabGlobalSize !== 'compact' && (
                              <span className="text-[10px] text-slate-500 dark:text-[#a69079] block truncate font-mono mt-0.5">
                                {slab.subtitle}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Slab Action Buttons */}
                        <div className="flex items-center gap-1 shrink-0">
                          {isEditingSlabs ? (
                            <>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveSlabPosition(slab.id, 'left');
                                }}
                                className="p-1 rounded hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-500"
                                title="Move slab left"
                              >
                                <ArrowLeft className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveSlabPosition(slab.id, 'right');
                                }}
                                className="p-1 rounded hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-500"
                                title="Move slab right"
                              >
                                <ArrowRight className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteSlab(slab.id);
                                }}
                                className="p-1 rounded hover:bg-[#7f1d1d]/15 dark:hover:bg-[#6e171b]/35 text-[#6e1418] dark:text-[#c94a4f]"
                                title="Delete slab"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenEditSlabModal(slab);
                                }}
                                className="p-1 rounded-md text-stone-400 hover:text-slate-800 dark:hover:text-[#efe4d4] hover:bg-black/5 dark:hover:bg-[#2b1e15] transition-colors"
                                title="Edit slab"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setAskGeminiTopic(slab.name);
                                  setIsAskGeminiModalOpen(true);
                                }}
                                className="p-1 rounded-md text-stone-400 hover:text-sky-600 dark:hover:text-amber-300 hover:bg-black/5 dark:hover:bg-[#2b1e15] transition-colors"
                                title="Ask Gemini about this topic"
                              >
                                <Sparkles className="w-3 h-3" />
                              </button>
                              {isSelected && (
                                <div className="w-4 h-4 rounded-full bg-blue-600 dark:bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                                  <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>

                      {/* File Attachment & Notes in Expanded Mode */}
                      {slabGlobalSize === 'expanded' && (
                        <div className="pt-2 mt-2 border-t border-stone-200/70 dark:border-[#352317] space-y-1">
                          {slab.fileAttachmentName ? (
                            <div className="flex items-center justify-between text-[10px] bg-stone-100/80 dark:bg-[#140e0a] px-2 py-1 rounded-md">
                              <span className="flex items-center gap-1.5 text-[#446378] dark:text-amber-300 font-mono truncate">
                                <Paperclip className="w-3 h-3 shrink-0" />
                                <span className="truncate">{slab.fileAttachmentName}</span>
                              </span>
                              {slab.fileAttachmentSize && (
                                <span className="text-stone-400 dark:text-[#8b735c] font-mono shrink-0">
                                  {slab.fileAttachmentSize}
                                </span>
                              )}
                            </div>
                          ) : null}

                          {slab.customNotes ? (
                            <p className="text-[10px] text-stone-600 dark:text-[#a69079] line-clamp-1 italic">
                              "{slab.customNotes}"
                            </p>
                          ) : null}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Add New Slab Card */}
                <div
                  onClick={() => setActiveAddModal('topic')}
                  className={`rounded-xl border border-dashed border-[#4a6b8c]/60 dark:border-[#4b3322] hover:border-amber-500 bg-white/40 dark:bg-[#1a120d]/50 hover:bg-amber-50/40 dark:hover:bg-[#251a12] cursor-pointer transition-all select-none flex items-center justify-center gap-2 text-slate-600 dark:text-[#d8c7b0] ${
                    slabGlobalSize === 'compact' ? 'p-2.5 h-11' : 'p-3.5 min-h-[64px]'
                  }`}
                  title="Add new topic slab"
                >
                  <Plus className="w-4 h-4 text-blue-600 dark:text-amber-400" />
                  <span className="text-xs font-semibold">New Topic Slab</span>
                </div>
              </div>
            )}
          </div>
        );

      case 'books':
        return (
          <div>
            <div className="flex items-center justify-between pb-1.5 border-b border-[#c2d7ed] dark:border-[#352317] mb-3.5">
              <div className="flex items-center gap-2">
                <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-[#efe4d4] shrink-0">
                  Recent Books
                </h3>

                <div className="flex items-center bg-[#eef3f7] dark:bg-[#1a120d] border border-slate-300/80 dark:border-[#382518] rounded-full px-2 py-0.5 text-xs">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={bookSearchQuery}
                    onChange={(e) => setBookSearchQuery(e.target.value)}
                    className="bg-transparent outline-none text-[11px] text-slate-800 dark:text-[#efe4d4] placeholder-slate-400 dark:placeholder-[#8b735c] w-16 sm:w-20"
                  />
                  <Search className="w-3 h-3 text-slate-500 dark:text-[#a69079] ml-1" />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveAddModal('book')}
                  className="flex items-center gap-1 text-[11px] font-semibold text-blue-700 dark:text-amber-300 hover:text-blue-900 dark:hover:text-[#fff6e8] bg-blue-50 dark:bg-[#251a12] border border-blue-200 dark:border-[#4b3322] px-2 py-0.5 rounded-lg transition-colors cursor-pointer"
                  title="Add new book"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Book</span>
                </button>

                <button
                  onClick={() => setIsEditingBooks(!isEditingBooks)}
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-lg border transition-colors cursor-pointer ${
                    isEditingBooks
                      ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/50 dark:text-amber-200'
                      : 'text-slate-600 dark:text-[#a69079] border-slate-300 dark:border-[#382518] hover:bg-slate-100 dark:hover:bg-[#251a12]'
                  }`}
                  title="Toggle edit/delete mode for books"
                >
                  {isEditingBooks ? 'Done' : 'Edit Books'}
                </button>
              </div>
            </div>

            <div
              ref={booksScrollRef}
              className="flex items-stretch gap-2.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700"
            >
              {filteredBooks.map((book: any) => (
                <div
                  key={book.id}
                  onClick={() => {
                    if (isEditingBooks) return;
                    onOpenStudio('study-reader');
                  }}
                  className="flex flex-col items-center group cursor-pointer shrink-0 w-28 sm:w-32 relative perspective-1000"
                  title={book.title}
                >
                  {/* 3D Realistic Book Cover with Spine & Stacked Page Edges */}
                  <div
                    className="w-full h-36 sm:h-40 rounded-r-xl rounded-l-sm relative flex flex-col justify-between p-2.5 transition-all duration-300 group-hover:-translate-y-2 shadow-[6px_10px_20px_rgba(0,0,0,0.25)] border-t border-r border-b border-black/20 overflow-hidden"
                    style={{
                      backgroundColor: book.bgColor || '#1e3a8a',
                      boxShadow: '6px 10px 18px -2px rgba(0,0,0,0.35), inset 2px 0 3px rgba(255,255,255,0.25), inset -2px 0 4px rgba(0,0,0,0.4)',
                    }}
                  >
                    {/* 3D Spine Crease on Left */}
                    <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-black/50 via-black/20 to-transparent border-r border-black/30 pointer-events-none" />

                    {/* Bookmark Ribbon Hanging from Top */}
                    <div className="absolute -top-1 right-4 w-2.5 h-6 bg-[#7f1d1d] shadow-xs rounded-b-xs transform translate-y-1 z-10">
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#4f0b0e]" />
                    </div>

                    {/* Pages Edge on the Right Margin (Stacked Sheets) */}
                    <div className="absolute right-0 top-1 bottom-1 w-1 bg-gradient-to-l from-stone-200 to-stone-400 border-l border-stone-400" />

                    {/* Book Front Cover Header */}
                    <div className="pl-2 relative z-10 flex items-center justify-between">
                      <span className="text-[8px] font-mono font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-black/30 text-white backdrop-blur-2xs">
                        {book.edition || 'EDITION'}
                      </span>
                      <BookOpen className="w-3.5 h-3.5 text-white/80" />
                    </div>

                    {/* Book Front Cover Center / Title */}
                    <div className="pl-2 relative z-10 my-auto text-center">
                      <div
                        className="font-black text-xs sm:text-[13px] tracking-tight leading-snug drop-shadow-sm line-clamp-2"
                        style={{ color: book.textColor || '#ffffff' }}
                      >
                        {book.title || book.code}
                      </div>
                      <div className="text-[9px] font-mono text-white/75 mt-1 truncate">
                        {book.author || 'Clinical Author'}
                      </div>
                    </div>

                    {/* Book Front Cover Bottom Emblem / Bar */}
                    <div className="pl-2 relative z-10 pt-1 border-t border-white/20 flex items-center justify-between text-[8px] font-mono text-white/70">
                      <span>MED·DEN</span>
                      <span>{book.code}</span>
                    </div>

                    {/* Edit/Delete Overlay */}
                    {isEditingBooks && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteBook(book.id);
                        }}
                        className="absolute top-1 right-1 p-1 rounded-full bg-[#7f1d1d] hover:bg-[#962d32] text-[#fdf2f2] shadow-md hover:scale-110 transition-transform z-30"
                        title="Delete book"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Last Opened / Subtitle */}
                  <span className="text-[10px] text-slate-600 dark:text-zinc-400 font-medium mt-1.5 truncate max-w-full text-center">
                    {book.lastOpened}
                  </span>
                </div>
              ))}

              {/* Quick Add Book Card */}
              <div
                onClick={() => setActiveAddModal('book')}
                className="w-24 sm:w-26 aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 border border-dashed border-[#5f7585]/60 hover:border-amber-600 bg-white/40 dark:bg-white/5 hover:bg-amber-50/30 cursor-pointer transition-all select-none shrink-0 text-stone-600 dark:text-stone-300"
                title="Add new book"
              >
                <Plus className="w-4 h-4 text-[#8f5f2c] dark:text-[#d4a373]" />
                <span className="text-[11px] font-semibold">New Book</span>
              </div>
            </div>
          </div>
        );

      case 'notes':
        return (
          <div>
            <div className="flex items-center justify-between pb-1.5 border-b border-stone-200/80 dark:border-[#352317] mb-3.5">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-500 dark:text-amber-400" />
                <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-[#efe4d4]">
                  Recent Notes
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveAddModal('note')}
                  className="flex items-center gap-1 text-[11px] font-semibold text-blue-700 dark:text-amber-300 hover:text-blue-900 dark:hover:text-[#fff6e8] bg-blue-50 dark:bg-[#251a12] border border-blue-200 dark:border-[#4b3322] px-2 py-0.5 rounded-lg transition-colors cursor-pointer"
                  title="Add new note"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Note</span>
                </button>

                <button
                  onClick={() => setIsEditingNotes(!isEditingNotes)}
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-lg border transition-colors cursor-pointer ${
                    isEditingNotes
                      ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/50 dark:text-amber-200'
                      : 'text-slate-600 dark:text-[#a69079] border-slate-300 dark:border-[#382518] hover:bg-slate-100 dark:hover:bg-[#251a12]'
                  }`}
                  title="Toggle edit/delete mode for notes"
                >
                  {isEditingNotes ? 'Done' : 'Edit Notes'}
                </button>
              </div>
            </div>

            <div
              ref={notesScrollRef}
              className="flex items-stretch gap-2.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-stone-300 dark:scrollbar-thumb-[#382518]"
            >
              {notesList.map((note: any) => (
                <div
                  key={note.id}
                  onClick={() => {
                    if (isEditingNotes) return;
                    if (note.notebookId) {
                      onOpenNotebook(note.notebookId);
                    } else {
                      onOpenStudio('new-note');
                    }
                  }}
                  className="flex flex-col items-center group cursor-pointer shrink-0 w-28 sm:w-32 relative"
                  title={`${note.title} (${note.subject})`}
                >
                  <div
                    className="w-full h-24 sm:h-28 rounded-2xl flex flex-col justify-between p-2.5 border border-[#5f7585]/40 dark:border-[#382518] shadow-[0_2px_4px_rgba(0,0,0,0.06)] transition-transform duration-150 group-hover:scale-103 relative"
                    style={{ backgroundColor: note.bgColor }}
                  >
                    <div className="flex items-center justify-between w-full">
                      <FileText className="w-3.5 h-3.5" style={{ color: note.textColor }} />
                      <span
                        className="text-[9px] font-mono font-bold uppercase px-1 py-0.2 rounded"
                        style={{ color: note.textColor, backgroundColor: `${note.textColor}18` }}
                      >
                        {note.subject.slice(0, 4)}
                      </span>
                    </div>

                    <div>
                      <p
                        className="font-bold text-[11px] leading-tight line-clamp-2"
                        style={{ color: note.textColor }}
                      >
                        {note.title}
                      </p>
                    </div>

                    {isEditingNotes && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNote(note.id);
                        }}
                        className="absolute -top-1.5 -right-1.5 p-1 rounded-full bg-[#7f1d1d] hover:bg-[#962d32] text-[#fdf2f2] shadow-md hover:scale-110 transition-transform"
                        title="Delete note"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  <span className="text-[10px] text-slate-600 dark:text-zinc-400 font-medium mt-1 truncate max-w-full text-center">
                    {note.lastOpened}
                  </span>
                </div>
              ))}

              {/* Quick Add Note Card */}
              <div
                onClick={() => setActiveAddModal('note')}
                className="w-28 sm:w-32 h-24 sm:h-28 rounded-2xl flex flex-col items-center justify-center gap-1 border border-dashed border-[#5f7585]/60 hover:border-amber-600 bg-white/40 dark:bg-white/5 hover:bg-amber-50/30 cursor-pointer transition-all select-none shrink-0 text-stone-600 dark:text-stone-300"
                title="Add new note"
              >
                <Plus className="w-4 h-4 text-[#8f5f2c] dark:text-[#d4a373]" />
                <span className="text-[11px] font-semibold">New Note</span>
              </div>
            </div>
          </div>
        );

      case 'timer':
        return (
          <div className="p-4 rounded-2xl bg-[#f7f5ef] dark:bg-[#1a120d] border border-[#5f7585]/30 dark:border-[#382518] shadow-2xs">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200/80 dark:border-[#352317] mb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600 dark:text-amber-400" />
                <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-[#efe4d4]">
                  Quick Focus & Eye Break Timer
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 dark:bg-[#251a12] text-blue-700 dark:text-amber-300 border border-transparent dark:border-[#4b3322]">
                Pomodoro
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-2xl font-mono font-bold text-slate-900 dark:text-[#efe4d4] tracking-wider">
                  {String(Math.floor(timerSeconds / 60)).padStart(2, '0')}:
                  {String(timerSeconds % 60).padStart(2, '0')}
                </div>
                <p className="text-[10px] text-slate-500 dark:text-[#a69079] mt-0.5">
                  {timerRunning ? 'Focus session active' : 'Ready to start 25m round'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTimerRunning(!timerRunning)}
                  className={`p-2 rounded-xl text-white font-semibold flex items-center gap-1.5 text-xs shadow-2xs transition-all ${
                    timerRunning ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 dark:bg-amber-700 hover:bg-blue-700 dark:hover:bg-amber-800'
                  }`}
                >
                  {timerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{timerRunning ? 'Pause' : 'Start'}</span>
                </button>
                <button
                  onClick={() => {
                    setTimerRunning(false);
                    setTimerSeconds(25 * 60);
                  }}
                  className="p-2 rounded-xl bg-slate-200 dark:bg-[#251a12] text-slate-700 dark:text-[#d8c7b0] hover:bg-slate-300 dark:hover:bg-[#322318] text-xs transition-colors"
                  title="Reset timer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                {onTriggerEyeBreak && (
                  <button
                    onClick={onTriggerEyeBreak}
                    className="px-2.5 py-1.5 rounded-xl border border-sky-400 text-sky-700 dark:text-sky-300 hover:bg-sky-50 dark:hover:bg-sky-950/40 text-xs font-semibold"
                    title="Take 20-20-20 eye break"
                  >
                    Eye Break
                  </button>
                )}
              </div>
            </div>
          </div>
        );

      case 'pearls':
        return (
          <div className="p-4 rounded-2xl bg-[#fdf9ee] dark:bg-[#1a120d] border border-amber-300/70 dark:border-[#4b3322] shadow-2xs">
            <div className="flex items-center justify-between pb-2 border-b border-amber-200 dark:border-[#352317] mb-3">
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-zinc-100">
                  Clinical Pearls & Mnemonics
                </h3>
              </div>
              <button
                onClick={() => onOpenStudio('mnemonics')}
                className="text-[10px] font-semibold text-amber-800 dark:text-amber-300 hover:underline"
              >
                Open Mnemonics →
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2 rounded-xl bg-white/70 dark:bg-black/30 border border-amber-200/80 dark:border-amber-900/40">
                <span className="font-bold text-amber-900 dark:text-amber-300">CRASH and Burn:</span>{' '}
                <span className="text-slate-700 dark:text-zinc-300">
                  Kawasaki Disease (Conjunctivitis, Rash, Adenopathy, Strawberry tongue, Hand/foot erythema, Burn = 5+ days fever).
                </span>
              </div>
              <div className="p-2 rounded-xl bg-white/70 dark:bg-black/30 border border-amber-200/80 dark:border-amber-900/40">
                <span className="font-bold text-amber-900 dark:text-amber-300">HARDASS:</span>{' '}
                <span className="text-slate-700 dark:text-zinc-300">
                  Normal anion gap metabolic acidosis (Hyperalimentation, Acetazolamide, Renal tubular acidosis, Diarrhea, Addison, Spironolactone, Saline).
                </span>
              </div>
            </div>
          </div>
        );


      default:
        return null;
    }
  };

  return (
    <div className="w-full space-y-7 transition-colors font-sans text-slate-850 dark:text-[#efe4d4] select-none pb-12">
      {/* ========================================================================= */}
      {/* 1. GREETING & SINGLE SMALL THOUGHT (Underline removed, clean greeting)    */}
      {/* ========================================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#c2d7ed] dark:border-[#352317]">
        {/* Left: Greeting (Clean without underline, 75% size) */}
        <div className="flex items-center gap-2">
          <h2 className="text-sm sm:text-base font-bold text-slate-800 dark:text-[#efe4d4] tracking-tight">
            Hi {greetingName}
          </h2>
        </div>

        {/* Right: Thought Pill & My Space Customization Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Single Small Thought Pill */}
          <div className="inline-flex items-center gap-2 bg-[#d7dde4]/90 dark:bg-[#1a120d] border border-[#b8c5d6] dark:border-[#382518] rounded-lg px-2.5 py-1 shadow-2xs">
            <Lightbulb className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-[#a69079] shrink-0">
              Thought:
            </span>

            <span
              className="text-[11px] sm:text-xs font-medium italic text-slate-800 dark:text-[#d8c7b0] truncate max-w-[200px] sm:max-w-[320px]"
              title={activeThought}
            >
              "{activeThought}"
            </span>
          </div>

          {/* Customize Space Button */}
          <button
            onClick={() => setIsCustomizeSpaceOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#ecebe6] dark:bg-[#1a120d] border border-[#5f7585]/40 dark:border-[#382518] text-stone-800 dark:text-[#efe4d4] text-xs font-semibold hover:bg-[#e2e0d8] dark:hover:bg-[#251a12] transition-all shadow-2xs active:scale-95"
            title="Customize Cockpit widgets, ordering, and resizing"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-[#8f5f2c] dark:text-amber-400" />
            <span>Customize Space</span>
          </button>

          {/* Quick Edit Layout Mode Toggle Button */}
          <button
            onClick={() => setIsEditLayoutMode(!isEditLayoutMode)}
            className={`px-2 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-all shadow-2xs ${
              isEditLayoutMode
                ? 'bg-[#8f5f2c] text-white border-[#8f5f2c] shadow-sm'
                : 'bg-[#ecebe6] dark:bg-[#1a120d] border-[#5f7585]/40 dark:border-[#382518] text-stone-700 dark:text-[#efe4d4] hover:bg-[#e2e0d8] dark:hover:bg-[#251a12]'
            }`}
            title={isEditLayoutMode ? 'Finish inline editing' : 'Inline reorder & resize widgets'}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isEditLayoutMode ? 'Done' : 'Edit Layout'}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN 2-COLUMN VIEWPORT (DYNAMIC CUSTOMIZABLE MY SPACE WIDGETS)          */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-8 pt-1">
        {/* ======================================================================= */}
        {/* LEFT COLUMN: Dynamic reorderable & resizable widgets                     */}
        {/* ======================================================================= */}
        <div className="lg:col-span-8 xl:col-span-9">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7 sm:gap-8">
            {widgets
              .filter((w) => w.visible)
              .map((widget) => {
                const isFull = widget.width === 'full';
                const colSpanClass = isFull ? 'col-span-1 md:col-span-2' : 'col-span-1';

                return (
                  <div key={widget.id} className={`${colSpanClass} flex flex-col transition-all duration-200 relative`}>
                    {/* Inline Reorder/Resize Toolbar (when Edit Layout is Active) */}
                    {isEditLayoutMode && (
                      <div className="flex items-center justify-between bg-blue-50/95 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 px-3 py-1.5 rounded-xl mb-2 text-xs shadow-2xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-blue-900 dark:text-blue-200 text-xs">
                            {widget.title}
                          </span>
                          <span className="text-[10px] text-blue-600 dark:text-blue-400 font-mono">
                            {widget.width === 'full' ? 'Full Width (100%)' : 'Half Width (50%)'}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => moveWidget(widget.id, 'up')}
                            className="p-1 rounded hover:bg-blue-200/60 dark:hover:bg-blue-900 text-blue-800 dark:text-blue-200 transition-colors"
                            title="Move section up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => moveWidget(widget.id, 'down')}
                            className="p-1 rounded hover:bg-blue-200/60 dark:hover:bg-blue-900 text-blue-800 dark:text-blue-200 transition-colors"
                            title="Move section down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => toggleWidgetWidth(widget.id)}
                            className="px-2 py-0.5 rounded bg-white dark:bg-blue-900/50 border border-blue-300 dark:border-blue-800 text-[10px] font-semibold text-blue-900 dark:text-blue-100 hover:bg-blue-100 transition-colors"
                            title="Toggle between Full width and Half width"
                          >
                            {widget.width === 'full' ? 'Make Half (50%)' : 'Make Full (100%)'}
                          </button>
                          <button
                            onClick={() => toggleWidgetVisibility(widget.id)}
                            className="p-1 rounded hover:bg-[#7f1d1d]/15 dark:hover:bg-[#6e171b]/35 text-[#6e1418] dark:text-[#c94a4f] transition-colors"
                            title="Hide this section"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Section Content */}
                    {renderWidgetContent(widget.id)}
                  </div>
                );
              })}
          </div>
        </div>

        {/* ======================================================================= */}
        {/* RIGHT COLUMN: Calendar, Tasks, Reminder (4 of 12 cols)                  */}
        {/* ======================================================================= */}
        <div className="lg:col-span-4 xl:col-span-3 flex flex-col space-y-4">
          
          {/* 1. CALENDAR CARD (With Eye-Catching Logo in Front of Calendar) */}
          <div
            onClick={onOpenRosterModal}
            className="w-full p-3.5 rounded-2xl bg-white dark:bg-[#18110c] border border-stone-200/90 dark:border-[#382518] shadow-xs hover:shadow-md cursor-pointer hover:border-blue-500/60 dark:hover:border-amber-500/50 transition-all flex items-center justify-between select-none group"
            title="Click to open Academic Roster & Calendar"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 dark:from-amber-700 dark:to-amber-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20 dark:shadow-black/40 group-hover:scale-105 transition-transform shrink-0">
                <CalendarDays className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-[#efe4d4] block leading-tight group-hover:text-blue-600 dark:group-hover:text-amber-300 transition-colors truncate">
                  Academic Calendar
                </span>
                <span className="text-[10px] text-stone-500 dark:text-[#a69079] font-mono block truncate mt-0.5">
                  {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} · Ward Postings
                </span>
              </div>
            </div>
            <div className="w-6 h-6 rounded-lg bg-stone-100 dark:bg-[#251a12] flex items-center justify-center text-stone-400 group-hover:text-blue-600 dark:group-hover:text-amber-300 shrink-0 transition-colors">
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* 2. REALISTIC 3D WOODEN CLIPBOARD WITH PIN & LAYERED PAPER SHEETS */}
          <div className="rounded-3xl p-3 pt-6 relative clipboard-wood border-4 border-[#8e6538] dark:border-[#2b1e15] shadow-2xl flex flex-col min-h-[360px] transition-all select-none">
            
            {/* Top Wooden Clipboard Eyelet / Hanging Hole */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#3d2716] dark:bg-black border-2 border-[#a77b4d] shadow-inner" />

            {/* 3D Realistic Metallic Clamp & Pushpin */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
              {/* Pushpin piercing the board & clamp */}
              <div className="relative group cursor-pointer" title="Pinned to Study Clipboard">
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#6e1418] via-[#962d32] to-[#c94a4f] shadow-md shadow-black/50 border border-white/50 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/80" />
                </div>
                {/* Pin shadow on clamp */}
                <div className="absolute -bottom-1 right-0 w-3 h-1.5 bg-black/40 blur-[1px] rounded-full" />
              </div>

              {/* Brushed Metallic Clip Bar */}
              <div className="w-28 sm:w-32 h-6 rounded-md bg-gradient-to-r from-stone-400 via-stone-200 via-white to-stone-400 shadow-md border-t border-b border-stone-300 dark:border-stone-600 flex items-center justify-between px-3 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-stone-500 shadow-inner" />
                <span className="text-[8px] font-mono font-black tracking-widest text-stone-600 uppercase">
                  MED·DEN CLIP
                </span>
                <div className="w-2 h-2 rounded-full bg-stone-500 shadow-inner" />
              </div>
            </div>

            {/* Background Layered Paper (Slightly Angled for 3D realism) */}
            <div className="absolute inset-x-4 top-10 bottom-3 bg-[#f3ebd7] dark:bg-[#1a120d] rotate-[1.2deg] rounded-xl shadow-xs border border-amber-900/10 dark:border-[#352317] pointer-events-none" />

            {/* Foreground 3D Study Paper Sheet */}
            <div className="relative z-10 bg-[#fffefb] dark:bg-[#140e0a] rounded-xl p-3.5 pt-5 shadow-lg border border-amber-900/15 dark:border-[#382518] flex-1 flex flex-col justify-between">
              
              {/* Paper Header with Circular Completion Meter */}
              <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-amber-900/10 dark:border-[#352317]">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold">
                    <CheckSquare className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-[#efe4d4] flex items-center gap-1.5">
                      <span>Clinical Ward Tasks</span>
                      <span className="text-[9px] font-mono px-1 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                        Clipboard
                      </span>
                    </h3>
                    <span className="text-[10px] font-mono text-stone-400 dark:text-[#a69079]">
                      Physician's Checksheet
                    </span>
                  </div>
                </div>

                {/* Circular Progress Ring */}
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <span className="text-xs font-bold font-mono text-slate-900 dark:text-[#efe4d4] block leading-tight">
                      {tasks.filter((t) => t.completed).length}/{tasks.length}
                    </span>
                    <span className="text-[9px] font-mono text-[#8f5f2c] dark:text-amber-400 font-bold">
                      {tasks.length > 0 ? Math.round((tasks.filter((t) => t.completed).length / tasks.length) * 100) : 0}% Done
                    </span>
                  </div>
                  <div className="relative w-7 h-7 flex items-center justify-center">
                    <svg className="w-7 h-7 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-stone-200 dark:text-[#2b1e15]"
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

              {/* Filter Tabs on Paper */}
              <div className="flex items-center gap-1 mb-2 bg-amber-50/70 dark:bg-[#1a120d] p-0.5 rounded-lg text-[10px] font-semibold border border-amber-900/5 dark:border-[#352317]">
                {(['all', 'pending', 'completed'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setTaskFilter(f)}
                    className={`flex-1 py-1 rounded-md capitalize transition-colors ${
                      taskFilter === f
                        ? 'bg-white dark:bg-[#2b1e15] text-stone-900 dark:text-[#efe4d4] shadow-xs font-bold'
                        : 'text-stone-500 dark:text-[#a69079] hover:text-stone-800 dark:hover:text-[#efe4d4]'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {/* Task Checklist Items on Ruled Paper */}
              <div className="space-y-1.5 flex-1 overflow-y-auto max-h-48 pr-1 custom-scrollbar">
                {tasks
                  .filter((t) => {
                    if (taskFilter === 'pending') return !t.completed;
                    if (taskFilter === 'completed') return t.completed;
                    return true;
                  })
                  .slice(0, 8)
                  .map((task) => (
                    <div
                      key={task.id}
                      onClick={() => onToggleTask(task.id)}
                      className={`flex items-start gap-2.5 p-2 rounded-xl border transition-all cursor-pointer group select-none ${
                        task.completed
                          ? 'bg-amber-50/40 dark:bg-[#110c09] border-amber-900/10 dark:border-[#2a1c13] opacity-70'
                          : 'bg-white dark:bg-[#1a120d] border-stone-200/80 dark:border-[#352317] hover:border-amber-400/60 shadow-2xs'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          task.completed
                            ? 'bg-[#8f5f2c] text-white border-[#8f5f2c]'
                            : 'border-stone-400 dark:border-[#4b3322] bg-white dark:bg-[#120c08] group-hover:border-amber-500'
                        }`}
                      >
                        {task.completed && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>

                      <div className="min-w-0 flex-1">
                        <span
                          className={`text-xs block leading-snug font-medium truncate ${
                            task.completed
                              ? 'line-through text-stone-400 dark:text-[#8b735c]'
                              : 'text-stone-900 dark:text-[#efe4d4] font-sans'
                          }`}
                        >
                          {task.title}
                        </span>
                        {task.tag && (
                          <span className="text-[9px] font-mono text-stone-400 dark:text-[#a69079] mt-0.5 block">
                            {task.tag}
                          </span>
                        )}
                      </div>

                      {task.highYield && (
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/25 shrink-0 font-bold">
                          HY
                        </span>
                      )}
                    </div>
                  ))}
              </div>

              {/* Inline Quick Add Task on Clipboard */}
              {onAddTask && (
                <form onSubmit={handleAddNewTask} className="mt-2.5 pt-2 border-t border-amber-900/10 dark:border-[#352317] flex items-center gap-1.5">
                  <input
                    type="text"
                    placeholder="+ Clip new task..."
                    value={taskInput}
                    onChange={(e) => setTaskInput(e.target.value)}
                    className="bg-amber-50/50 dark:bg-[#1a120d] text-xs px-2.5 py-1.5 rounded-xl border border-amber-900/10 dark:border-[#382518] outline-none flex-1 text-slate-900 dark:text-[#efe4d4] placeholder-stone-400 dark:placeholder-[#8b735c] focus:border-amber-500 font-sans"
                  />
                  <button
                    type="submit"
                    disabled={!taskInput.trim()}
                    className="p-1.5 px-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white disabled:opacity-30 transition-all shrink-0 cursor-pointer shadow-xs text-xs font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Clip</span>
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* 3. SMART RESHAPED REMINDER CARD (With Edit Option & Diversity of Notifications) */}
          <div className="rounded-2xl bg-white dark:bg-[#18110c] border border-stone-200/90 dark:border-[#382518] p-4 shadow-xs flex flex-col min-h-[260px] transition-colors">
            
            {/* Header: Bell with Radar Wave + Add Reminder Button */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-200/70 dark:border-[#352317]">
              <div className="flex items-center gap-2">
                <div className="relative w-7 h-7 rounded-lg bg-sky-500/10 dark:bg-amber-500/15 text-sky-600 dark:text-amber-400 flex items-center justify-center font-bold">
                  <Bell className="w-4 h-4" />
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-500" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-[#efe4d4]">
                    Clinical Reminders
                  </h3>
                  <span className="text-[10px] font-mono text-stone-400 dark:text-[#a69079]">
                    Ward Alerts & Notifications
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingReminder(null);
                  setIsReminderModalOpen(true);
                }}
                className="px-2 py-1 rounded-lg bg-sky-50 dark:bg-[#251a12] hover:bg-sky-100 dark:hover:bg-[#322318] border border-sky-200 dark:border-[#4b3322] text-sky-700 dark:text-amber-300 text-[10px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                title="Add new clinical reminder"
              >
                <Plus className="w-3 h-3" />
                <span>New</span>
              </button>
            </div>

            {/* Reminders List */}
            <div className="space-y-2 flex-1 overflow-y-auto max-h-56 pr-1 custom-scrollbar">
              {reminders.map((rem) => {
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
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer group flex items-start justify-between gap-2 ${
                      isCritical
                        ? 'bg-[#7f1d1d]/8 dark:bg-[#6e171b]/20 border-[#7f1d1d]/30 dark:border-[#962d32]/50 hover:border-[#962d32]'
                        : isWellness
                        ? 'bg-amber-50/60 dark:bg-[#231912] border-amber-300/70 dark:border-[#4b3322] hover:border-amber-500'
                        : isHigh
                        ? 'bg-amber-50/50 dark:bg-[#251a12] border-amber-200 dark:border-amber-800/50 hover:border-amber-500'
                        : 'bg-stone-50/60 dark:bg-[#1a120d] border-stone-200/80 dark:border-[#352317] hover:border-stone-300 dark:hover:border-[#4b3322]'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                        <span
                          className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.2 rounded ${
                            isCritical
                              ? 'bg-[#7f1d1d]/15 dark:bg-[#6e171b]/45 text-[#6e1418] dark:text-[#d97074]'
                              : isWellness
                              ? 'bg-amber-100/90 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                              : isHigh
                              ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300'
                              : 'bg-stone-200 dark:bg-[#2b1e15] text-stone-600 dark:text-[#d8c7b0]'
                          }`}
                        >
                          {rem.category}
                        </span>

                        <span className="text-[10px] text-stone-400 font-mono">
                          {rem.dueTime}
                        </span>
                      </div>

                      <p className="font-semibold text-xs text-slate-900 dark:text-zinc-100 leading-snug line-clamp-1">
                        {rem.title}
                      </p>

                      {rem.notes && (
                        <p className="text-[10px] text-stone-500 dark:text-stone-400 line-clamp-1 mt-0.5 italic">
                          "{rem.notes}"
                        </p>
                      )}
                    </div>

                    {/* Quick Action Icons: Notification Toggle + Edit Pencil */}
                    <div className="flex items-center gap-1 shrink-0 pt-0.5">
                      <button
                        type="button"
                        onClick={(e) => handleToggleReminderNotification(rem.id, e)}
                        className={`p-1 rounded-md transition-colors ${
                          rem.notificationEnabled
                            ? 'text-sky-600 dark:text-sky-400 bg-sky-500/10'
                            : 'text-stone-400 hover:text-stone-600'
                        }`}
                        title={rem.notificationEnabled ? 'Notifications active (click to mute)' : 'Notifications muted (click to activate)'}
                      >
                        {rem.notificationEnabled ? (
                          <BellRing className="w-3.5 h-3.5" />
                        ) : (
                          <BellOff className="w-3.5 h-3.5" />
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
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. CUSTOMIZE SPACE MODAL (Reorder, Resize, Add/Remove Widgets)            */}
      {/* ========================================================================= */}
      {isCustomizeSpaceOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#140e0a] rounded-2xl border border-slate-200 dark:border-[#382518] max-w-xl w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsCustomizeSpaceOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-md text-slate-400 hover:text-slate-800 dark:hover:text-[#efe4d4]"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <LayoutGrid className="w-5 h-5 text-blue-600 dark:text-amber-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-[#efe4d4]">
                Customize Cockpit Widgets
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-[#a69079] mb-4">
              Toggle widget visibility, reorder sections up/down, and adjust widths between half (50%) and full (100%).
            </p>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1 mb-5">
              {widgets.map((widget, idx) => (
                <div
                  key={widget.id}
                  className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-colors ${
                    widget.visible
                      ? 'bg-slate-50 dark:bg-[#1a120d] border-slate-300 dark:border-[#382518]'
                      : 'bg-slate-100/50 dark:bg-[#110c09] border-dashed border-slate-300 dark:border-[#352317] opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={() => toggleWidgetVisibility(widget.id)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        widget.visible
                          ? 'bg-amber-100 border-amber-300 text-amber-900 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-300'
                          : 'bg-slate-200 border-slate-300 text-slate-500 dark:bg-[#221811] dark:border-[#3d291a] dark:text-[#a69079]'
                      }`}
                      title={widget.visible ? 'Hide widget' : 'Show widget'}
                    >
                      {widget.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-zinc-100 text-sm">
                          {widget.title}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                          {widget.width === 'full' ? '100% Full' : '50% Half'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate mt-0.5">
                        {widget.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                    {/* Toggle Width */}
                    <button
                      onClick={() => toggleWidgetWidth(widget.id)}
                      className="px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-zinc-300 transition-colors"
                      title="Switch between half and full width"
                    >
                      {widget.width === 'full' ? 'Make Half (50%)' : 'Make Full (100%)'}
                    </button>

                    {/* Reorder Up */}
                    <button
                      onClick={() => moveWidget(widget.id, 'up')}
                      disabled={idx === 0}
                      className="p-1 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-30 text-slate-700 dark:text-zinc-300 transition-colors"
                      title="Move up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>

                    {/* Reorder Down */}
                    <button
                      onClick={() => moveWidget(widget.id, 'down')}
                      disabled={idx === widgets.length - 1}
                      className="p-1 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-30 text-slate-700 dark:text-zinc-300 transition-colors"
                      title="Move down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={resetWidgets}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Default Layout</span>
              </button>

              <button
                onClick={() => setIsCustomizeSpaceOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-900 dark:bg-zinc-100 text-white dark:text-slate-900 text-xs font-semibold shadow-sm"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MODALS TO ADD TOPIC, BOOK, NOTE, OR GROUP                              */}
      {/* ========================================================================= */}
      {/* A. Add Topic Slab Modal */}
      {activeAddModal === 'topic' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#140e0a] rounded-2xl border border-slate-200 dark:border-[#382518] max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setActiveAddModal(null)}
              className="absolute top-4 right-4 p-1 rounded-md text-slate-400 hover:text-slate-800 dark:hover:text-[#efe4d4]"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <PlusCircle className="w-5 h-5 text-blue-600 dark:text-amber-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-[#efe4d4]">
                Add New Topic Slab
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-[#a69079] mb-4">
              Add a clinical topic or subject module slab to your Topic carousel.
            </p>

            <form onSubmit={handleAddSlab} className="space-y-3.5">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-[#d8c7b0] block mb-1">
                    Key Tag
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. G"
                    value={newSlabForm.key}
                    onChange={(e) => setNewSlabForm({ ...newSlabForm, key: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#1a120d] border border-slate-300 dark:border-[#382518] rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-[#efe4d4] outline-none focus:border-amber-500"
                    maxLength={4}
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-[#d8c7b0] block mb-1">
                    Topic Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Pediatrics"
                    value={newSlabForm.name}
                    onChange={(e) => setNewSlabForm({ ...newSlabForm, name: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#1a120d] border border-slate-300 dark:border-[#382518] rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-[#efe4d4] outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-[#d8c7b0] block mb-1">
                  Subtitle / Clinical Topics
                </label>
                <input
                  type="text"
                  placeholder="e.g. Neonatology, Milestones, Immunization"
                  value={newSlabForm.subtitle}
                  onChange={(e) => setNewSlabForm({ ...newSlabForm, subtitle: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#1a120d] border border-slate-300 dark:border-[#382518] rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-[#efe4d4] outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-[#352317]">
                <button
                  type="button"
                  onClick={() => setActiveAddModal(null)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-[#382518] text-xs text-slate-700 dark:text-[#d8c7b0] hover:bg-slate-100 dark:hover:bg-[#251a12]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newSlabForm.name.trim()}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 dark:bg-amber-700 text-white text-xs font-semibold shadow-sm hover:bg-blue-700 dark:hover:bg-amber-800 disabled:opacity-40"
                >
                  Add Topic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* B. Add Book Modal */}
      {activeAddModal === 'book' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#140e0a] rounded-2xl border border-slate-200 dark:border-[#382518] max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setActiveAddModal(null)}
              className="absolute top-4 right-4 p-1 rounded-md text-slate-400 hover:text-slate-800 dark:hover:text-[#efe4d4]"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="w-5 h-5 text-blue-600 dark:text-amber-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-[#efe4d4]">
                Add Recent Book
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-[#a69079] mb-4">
              Add a medical textbook, atlas, or reference guide to your library.
            </p>

            <form onSubmit={handleAddBook} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-[#d8c7b0] block mb-1">
                  Book Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Oxford Handbook of Clinical Medicine"
                  value={newBookForm.title}
                  onChange={(e) => setNewBookForm({ ...newBookForm, title: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#1a120d] border border-slate-300 dark:border-[#382518] rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-[#efe4d4] outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-[#d8c7b0] block mb-1">
                  Short Code / Spine Acronym
                </label>
                <input
                  type="text"
                  placeholder="e.g. Oxford Med or OHCM"
                  value={newBookForm.code}
                  onChange={(e) => setNewBookForm({ ...newBookForm, code: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#1a120d] border border-slate-300 dark:border-[#382518] rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-[#efe4d4] outline-none focus:border-amber-500"
                  maxLength={12}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-[#352317]">
                <button
                  type="button"
                  onClick={() => setActiveAddModal(null)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-[#382518] text-xs text-slate-700 dark:text-[#d8c7b0] hover:bg-slate-100 dark:hover:bg-[#251a12]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newBookForm.title.trim()}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 dark:bg-amber-700 text-white text-xs font-semibold shadow-sm hover:bg-blue-700 dark:hover:bg-amber-800 disabled:opacity-40"
                >
                  Add Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* C. Add Group Modal */}
      {activeAddModal === 'group' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#140e0a] rounded-2xl border border-slate-200 dark:border-[#382518] max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setActiveAddModal(null)}
              className="absolute top-4 right-4 p-1 rounded-md text-slate-400 hover:text-slate-800 dark:hover:text-[#efe4d4]"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <Users className="w-5 h-5 text-blue-600 dark:text-amber-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-[#efe4d4]">
                Add Recent Group
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-[#a69079] mb-4">
              Add a clinical study circle, journal club, or ward discussion team.
            </p>

            <form onSubmit={handleAddGroup} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-[#d8c7b0] block mb-1">
                  Group Name / Circle
                </label>
                <input
                  type="text"
                  placeholder="e.g. Neurology Case Discussion Club"
                  value={newGroupForm.title}
                  onChange={(e) => setNewGroupForm({ ...newGroupForm, title: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#1a120d] border border-slate-300 dark:border-[#382518] rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-[#efe4d4] outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-[#d8c7b0] block mb-1">
                    Members Info
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 10 doctors"
                    value={newGroupForm.members}
                    onChange={(e) => setNewGroupForm({ ...newGroupForm, members: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#1a120d] border border-slate-300 dark:border-[#382518] rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-[#efe4d4] outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-[#d8c7b0] block mb-1">
                    Status / Tag
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ward Round"
                    value={newGroupForm.status}
                    onChange={(e) => setNewGroupForm({ ...newGroupForm, status: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#1a120d] border border-slate-300 dark:border-[#382518] rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-[#efe4d4] outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-[#352317]">
                <button
                  type="button"
                  onClick={() => setActiveAddModal(null)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-[#382518] text-xs text-slate-700 dark:text-[#d8c7b0] hover:bg-slate-100 dark:hover:bg-[#251a12]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newGroupForm.title.trim()}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 dark:bg-amber-700 text-white text-xs font-semibold shadow-sm hover:bg-blue-700 dark:hover:bg-amber-800 disabled:opacity-40"
                >
                  Add Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* D. Add Note Modal */}
      {activeAddModal === 'note' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#140e0a] rounded-2xl border border-slate-200 dark:border-[#382518] max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setActiveAddModal(null)}
              className="absolute top-4 right-4 p-1 rounded-md text-slate-400 hover:text-slate-800 dark:hover:text-[#efe4d4]"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-5 h-5 text-blue-600 dark:text-amber-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-[#efe4d4]">
                Add Recent Note
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-[#a69079] mb-4">
              Add a clinical topic summary or high-yield revision note.
            </p>

            <form onSubmit={handleAddNote} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-[#d8c7b0] block mb-1">
                  Note Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Heart Failure Classification & Drugs"
                  value={newNoteForm.title}
                  onChange={(e) => setNewNoteForm({ ...newNoteForm, title: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#1a120d] border border-slate-300 dark:border-[#382518] rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-[#efe4d4] outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-[#d8c7b0] block mb-1">
                  Subject / Clinical Domain
                </label>
                <input
                  type="text"
                  placeholder="e.g. Cardiology or Pharmacology"
                  value={newNoteForm.subject}
                  onChange={(e) => setNewNoteForm({ ...newNoteForm, subject: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#1a120d] border border-slate-300 dark:border-[#382518] rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-[#efe4d4] outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-[#352317]">
                <button
                  type="button"
                  onClick={() => setActiveAddModal(null)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-[#382518] text-xs text-slate-700 dark:text-[#d8c7b0] hover:bg-slate-100 dark:hover:bg-[#251a12]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newNoteForm.title.trim()}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 dark:bg-amber-700 text-white text-xs font-semibold shadow-sm hover:bg-blue-700 dark:hover:bg-amber-800 disabled:opacity-40"
                >
                  Add Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. ADD TRACKER & AVAILABLE TRACKERS CATALOG MODAL                         */}
      {/* ========================================================================= */}
      {isAddTrackerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl max-h-[85vh] bg-white dark:bg-[#140e0a] rounded-2xl border border-stone-200 dark:border-[#382518] shadow-2xl flex flex-col overflow-hidden">
            <div className="p-4 border-b border-stone-200 dark:border-[#352317] flex items-center justify-between bg-stone-50 dark:bg-[#18110c]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#8f5f2c] text-white flex items-center justify-center shadow-xs">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-[#efe4d4] flex items-center gap-2">
                    <span>Available Trackers & Catalog</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                      Study Metrics
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-[#a69079]">
                    Add from the pre-configured medical study metrics or create your own custom tracker.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddTrackerModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-[#efe4d4]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
              {/* Section 1: Pre-configured Trackers Catalog */}
              <div>
                <h4 className="text-xs font-bold font-mono uppercase text-slate-500 dark:text-[#a69079] mb-3 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-blue-600 dark:text-amber-400" />
                  <span>Curated Medical & Study Trackers</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {PRESET_TRACKERS_CATALOG.map((preset) => {
                    const isAlreadyAdded = trackersList.some((t) => t.id === preset.id || t.title === preset.title);
                    return (
                      <div
                        key={preset.id}
                        className={`p-3 rounded-xl border flex flex-col justify-between transition-all ${
                          isAlreadyAdded
                            ? 'bg-stone-50 dark:bg-[#1a120d] border-amber-500/40 opacity-75'
                            : 'bg-white dark:bg-[#1a120d] border-stone-200 dark:border-[#382518] hover:border-amber-500 shadow-2xs'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-[#251a12] flex items-center justify-center shrink-0">
                            {renderTrackerIcon(preset.iconType)}
                          </div>
                          <div className="min-w-0">
                            <span className="text-sm font-bold text-slate-900 dark:text-[#efe4d4] block truncate">
                              {preset.value}
                            </span>
                            <span className="text-xs font-semibold text-slate-700 dark:text-[#d8c7b0] block truncate">
                              {preset.title}
                            </span>
                            <span className="text-[10px] text-slate-500 dark:text-[#a69079] block truncate">
                              {preset.subtext}
                            </span>
                          </div>
                        </div>

                        <div className="mt-3 pt-2 border-t border-stone-100 dark:border-[#352317] flex justify-end">
                          {isAlreadyAdded ? (
                            <span className="text-[10px] font-mono font-semibold text-[#8f5f2c] dark:text-amber-400 flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              <span>Active</span>
                            </span>
                          ) : (
                            <button
                              onClick={() => handleAddTrackerFromCatalog(preset)}
                              className="px-2.5 py-1 rounded-lg bg-blue-600 dark:bg-amber-700 hover:bg-blue-700 dark:hover:bg-amber-800 text-white text-[11px] font-semibold flex items-center gap-1 shadow-2xs active:scale-95"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Add</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Section 2: Create Custom Tracker Form */}
              <div className="pt-4 border-t border-stone-200 dark:border-[#352317]">
                <h4 className="text-xs font-bold font-mono uppercase text-slate-500 dark:text-[#a69079] mb-3 flex items-center gap-1.5">
                  <PlusCircle className="w-3.5 h-3.5 text-blue-600 dark:text-amber-400" />
                  <span>Create Custom Tracker</span>
                </h4>

                <form onSubmit={handleCreateCustomTracker} className="space-y-3 bg-stone-50 dark:bg-[#18110c] p-4 rounded-xl border border-stone-200 dark:border-[#382518]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-[#d8c7b0] block mb-1">
                        Metric Title
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Diagnostic OSCEs Passed"
                        value={newCustomTrackerForm.title}
                        onChange={(e) => setNewCustomTrackerForm({ ...newCustomTrackerForm, title: e.target.value })}
                        className="w-full bg-white dark:bg-[#211711] border border-stone-300 dark:border-[#382518] rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-[#efe4d4] outline-none focus:border-amber-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-[#d8c7b0] block mb-1">
                        Current Value / Target
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 18 / 20"
                        value={newCustomTrackerForm.value}
                        onChange={(e) => setNewCustomTrackerForm({ ...newCustomTrackerForm, value: e.target.value })}
                        className="w-full bg-white dark:bg-[#211711] border border-stone-300 dark:border-[#382518] rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-[#efe4d4] outline-none focus:border-amber-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-[#d8c7b0] block mb-1">
                        Subtext / Description
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Clinical ward checklist"
                        value={newCustomTrackerForm.subtext}
                        onChange={(e) => setNewCustomTrackerForm({ ...newCustomTrackerForm, subtext: e.target.value })}
                        className="w-full bg-white dark:bg-[#211711] border border-stone-300 dark:border-[#382518] rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-[#efe4d4] outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-[#d8c7b0] block mb-1">
                        Icon Type
                      </label>
                      <select
                        value={newCustomTrackerForm.iconType}
                        onChange={(e) => setNewCustomTrackerForm({ ...newCustomTrackerForm, iconType: e.target.value as any })}
                        className="w-full bg-white dark:bg-[#211711] border border-stone-300 dark:border-[#382518] rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-[#efe4d4] outline-none focus:border-amber-500 cursor-pointer"
                      >
                        <option value="target">Target / Goal</option>
                        <option value="award">Award / Accuracy</option>
                        <option value="flame">Flame / Streak</option>
                        <option value="clock">Clock / Time</option>
                        <option value="layers">Layers / Flashcards</option>
                        <option value="check">Checkmark / Tasks</option>
                        <option value="heart">Heart / Wellness</option>
                        <option value="droplet">Droplet / Hydration</option>
                        <option value="coffee">Coffee / Focus</option>
                        <option value="brain">Brain / Cases</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={!newCustomTrackerForm.title.trim()}
                      className="px-4 py-1.5 rounded-lg bg-blue-600 dark:bg-amber-700 text-white text-xs font-semibold hover:bg-blue-700 dark:hover:bg-amber-800 disabled:opacity-40 shadow-xs"
                    >
                      Create Tracker
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="p-3 border-t border-stone-200 dark:border-[#352317] flex justify-end bg-stone-50 dark:bg-[#18110c]">
              <button
                onClick={() => setIsAddTrackerModalOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-stone-200 dark:bg-[#2b1e15] text-slate-800 dark:text-[#efe4d4] text-xs font-semibold hover:bg-stone-300 dark:hover:bg-[#382518]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. LEISURE INTERACTIVE CATEGORY MODAL                                      */}
      {/* ========================================================================= */}
      {selectedLeisureCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl max-h-[88vh] bg-white dark:bg-[#140e0a] rounded-2xl border border-stone-200 dark:border-[#382518] shadow-2xl flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-stone-200 dark:border-[#352317] flex items-center justify-between bg-stone-50 dark:bg-[#18110c]">
              <div className="flex items-center gap-2.5">
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[#7f1d1d] text-white">
                  {selectedLeisureCategory.badge}
                </span>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-[#efe4d4]">
                    {selectedLeisureCategory.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-[#a69079]">
                    {selectedLeisureCategory.tagline}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedLeisureCategory(null);
                  if (isNatureAudioPlaying) toggleNatureAudio();
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-[#efe4d4]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body: Tailored Content per Category */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
              {/* Category Image Banner */}
              <div className="relative w-full h-40 rounded-xl overflow-hidden shadow-xs">
                <img
                  src={selectedLeisureCategory.image}
                  alt={selectedLeisureCategory.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-3">
                  <span className="text-white text-xs font-medium italic drop-shadow-sm">
                    Recharge and return to study refreshed.
                  </span>
                </div>
              </div>

              {/* 1. GAMES CATEGORY: Interactive Word Scramble */}
              {selectedLeisureCategory.id === 'games' && (
                <div className="p-4 rounded-xl bg-pink-50 dark:bg-pink-950/30 border border-pink-200 dark:border-pink-900/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-pink-900 dark:text-pink-300 uppercase tracking-wide">
                      Medical Word Scramble
                    </span>
                    <span className="text-[10px] font-mono text-pink-700 dark:text-pink-400">
                      Word {currentWordIdx + 1} of {scrambleWords.length}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-white dark:bg-[#1a120d] border border-[#7f1d1d]/25 dark:border-[#962d32]/35 text-center">
                    <span className="text-[10px] uppercase font-mono text-slate-400 dark:text-[#a69079] block mb-1">Unscramble the letters:</span>
                    <span className="text-xl sm:text-2xl font-mono font-extrabold tracking-widest text-slate-900 dark:text-[#efe4d4]">
                      {currentScramble.word.split('').sort().join(' ')}
                    </span>
                    <p className="text-xs text-slate-600 dark:text-[#d8c7b0] italic mt-2">
                      Clue: "{currentScramble.clue}"
                    </p>
                  </div>

                  <form onSubmit={handleCheckScramble} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type medical word here..."
                      value={scrambleInput}
                      onChange={(e) => setScrambleInput(e.target.value)}
                      className="flex-1 bg-white dark:bg-[#1a120d] border border-stone-300 dark:border-[#382518] rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-[#efe4d4] outline-none uppercase font-mono font-bold"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-lg bg-[#7f1d1d] text-white text-xs font-semibold hover:bg-[#962d32] shadow-xs"
                    >
                      Check
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentWordIdx((prev) => (prev + 1) % scrambleWords.length);
                        setScrambleInput('');
                        setScrambleFeedback(null);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-stone-200 dark:bg-[#251a12] text-slate-700 dark:text-[#d8c7b0] text-xs font-semibold hover:bg-stone-300 dark:hover:bg-[#322318]"
                    >
                      Next
                    </button>
                  </form>

                  {scrambleFeedback && (
                    <div className={`p-2 rounded-lg text-xs font-semibold ${
                      scrambleFeedback.includes('Correct')
                        ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {scrambleFeedback}
                    </div>
                  )}
                </div>
              )}

              {/* 2. NATURE CATEGORY: Rain/Ocean Audio Synthesizer */}
              {selectedLeisureCategory.id === 'nature' && (
                <div className="p-4 rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-sky-950 dark:text-sky-200">
                        Synthesized Rain & Ambient White Noise
                      </h4>
                      <p className="text-[11px] text-sky-800 dark:text-sky-300">
                        Proven to mask distracting sounds and calm sympathetic autonomic arousal.
                      </p>
                    </div>
                    <button
                      onClick={toggleNatureAudio}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-xs ${
                        isNatureAudioPlaying
                          ? 'bg-sky-600 text-white'
                          : 'bg-white dark:bg-[#1a120d] text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-800'
                      }`}
                    >
                      {isNatureAudioPlaying ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                      <span>{isNatureAudioPlaying ? 'Mute Rain' : 'Play Rain Sound'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
                    <div className="p-2 rounded-lg bg-white dark:bg-[#1a120d] border border-sky-200/60 dark:border-sky-900/40">
                      <span className="font-bold block text-sky-900 dark:text-sky-200">Rain on Glass</span>
                      <span className="text-[10px] text-slate-500">Soft lowpass filter</span>
                    </div>
                    <div className="p-2 rounded-lg bg-white dark:bg-[#1a120d] border border-sky-200/60 dark:border-sky-900/40">
                      <span className="font-bold block text-sky-900 dark:text-sky-200">Pine Forest</span>
                      <span className="text-[10px] text-slate-500">Muted wind breeze</span>
                    </div>
                    <div className="p-2 rounded-lg bg-white dark:bg-[#1a120d] border border-sky-200/60 dark:border-sky-900/40">
                      <span className="font-bold block text-sky-900 dark:text-sky-200">Ocean Surf</span>
                      <span className="text-[10px] text-slate-500">Rhythmic swells</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. YOGA & EXERCISES: Guided Desk Stretches */}
              {(selectedLeisureCategory.id === 'yoga' || selectedLeisureCategory.id === 'exercises') && (
                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-3">
                  <h4 className="text-xs font-bold text-amber-950 dark:text-amber-200 uppercase font-mono">
                    2-Minute Doctor Study Break Exercises
                  </h4>

                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-white dark:bg-[#1a120d] border border-amber-200/80 dark:border-[#382518] flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold flex items-center justify-center shrink-0 text-[10px]">
                        1
                      </span>
                      <div>
                        <span className="font-bold text-slate-900 dark:text-[#efe4d4]">Seated Spinal Twist: </span>
                        <span className="text-slate-600 dark:text-[#d8c7b0]">
                          Cross right leg over left, place left hand on right knee, gently twist torso right for 30s. Switch sides to release lumbar pressure.
                        </span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-white dark:bg-[#1a120d] border border-amber-200/80 dark:border-[#382518] flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold flex items-center justify-center shrink-0 text-[10px]">
                        2
                      </span>
                      <div>
                        <span className="font-bold text-slate-900 dark:text-[#efe4d4]">Carpal Tunnel Median Nerve Glides: </span>
                        <span className="text-slate-600 dark:text-[#d8c7b0]">
                          Extend arm forward, flex wrist backwards with gentle pull on fingers for 15s. Relieves typing strain from writing notes.
                        </span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-white dark:bg-[#1a120d] border border-amber-200/80 dark:border-[#382518] flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold flex items-center justify-center shrink-0 text-[10px]">
                        3
                      </span>
                      <div>
                        <span className="font-bold text-slate-900 dark:text-zinc-100">4-7-8 Parasympathetic Breathing: </span>
                        <span className="text-slate-600 dark:text-zinc-300">
                          Inhale through nose for 4 seconds, hold breath for 7 seconds, exhale slowly through mouth for 8 seconds. Drops cortisol immediately.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. SCIENCE, TRAVEL, TECH, FOOD CARDS */}
              {(selectedLeisureCategory.id === 'science' ||
                selectedLeisureCategory.id === 'travel' ||
                selectedLeisureCategory.id === 'tech' ||
                selectedLeisureCategory.id === 'food') && (
                <div className="space-y-2.5 text-xs">
                  {selectedLeisureCategory.id === 'science' && (
                    <>
                      <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50">
                        <span className="font-bold text-blue-900 dark:text-blue-300">Glymphatic Brain Flush:</span>{' '}
                        <span className="text-slate-700 dark:text-zinc-300">
                          During slow-wave deep sleep, interstitial space in your brain increases by 60%, allowing cerebrospinal fluid to wash away toxic beta-amyloid proteins.
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50">
                        <span className="font-bold text-blue-900 dark:text-blue-300">Quantum Scent Theory:</span>{' '}
                        <span className="text-slate-700 dark:text-zinc-300">
                          Olfactory receptors may detect molecular vibrations through quantum electron tunneling, explaining why humans can distinguish over 1 trillion odorants.
                        </span>
                      </div>
                    </>
                  )}

                  {selectedLeisureCategory.id === 'travel' && (
                    <>
                      <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900/50">
                        <span className="font-bold text-sky-900 dark:text-sky-300">Amalfi Cliffside Trails (Italy):</span>{' '}
                        <span className="text-slate-700 dark:text-zinc-300">
                          The 'Path of the Gods' overlooks azure Mediterranean waters lined with lemon groves and peaceful limestone crags.
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900/50">
                        <span className="font-bold text-sky-900 dark:text-sky-300">Sagano Bamboo Forest (Kyoto):</span>{' '}
                        <span className="text-slate-700 dark:text-zinc-300">
                          The Ministry of Environment included the rustling sound of wind swaying the giant bamboo stalks in Japan's '100 Soundscapes to be Preserved'.
                        </span>
                      </div>
                    </>
                  )}

                  {selectedLeisureCategory.id === 'tech' && (
                    <>
                      <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/50">
                        <span className="font-bold text-purple-900 dark:text-purple-300">Single-Port Surgical Robots:</span>{' '}
                        <span className="text-slate-700 dark:text-zinc-300">
                          Surgeons now operate through a single 2.5cm incision using snake-like articulating instruments with 3D HD stereoscopic magnification.
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/50">
                        <span className="font-bold text-purple-900 dark:text-purple-300">AI Pathology Screeners:</span>{' '}
                        <span className="text-slate-700 dark:text-zinc-300">
                          Deep neural networks scanning whole slide biopsy images can identify micrometastases in lymph nodes with 99.4% area-under-the-curve precision.
                        </span>
                      </div>
                    </>
                  )}

                  {selectedLeisureCategory.id === 'food' && (
                    <>
                      <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50">
                        <span className="font-bold text-amber-900 dark:text-amber-300">Matcha + L-Theanine:</span>{' '}
                        <span className="text-slate-700 dark:text-zinc-300">
                          Combines slow-release caffeine with L-Theanine, which crosses the blood-brain barrier to stimulate alpha brain waves for calm, jitter-free focus.
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50">
                        <span className="font-bold text-amber-900 dark:text-amber-300">Brain-Fuel Walnut & Blueberry Bowl:</span>{' '}
                        <span className="text-slate-700 dark:text-zinc-300">
                          Anthocyanin flavonoids in wild blueberries cross into brain centers responsible for memory, while alpha-linolenic acid (ALA) in walnuts protects vascular endothelium.
                        </span>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-stone-200 dark:border-[#352317] flex justify-between items-center bg-stone-50 dark:bg-[#18110c]">
              <span className="text-[11px] text-slate-500 dark:text-[#a69079] font-mono">
                Ach1ev Rest & Reset
              </span>
              <button
                onClick={() => {
                  setSelectedLeisureCategory(null);
                  if (isNatureAudioPlaying) toggleNatureAudio();
                }}
                className="px-4 py-1.5 rounded-xl bg-stone-200 dark:bg-[#2b1e15] text-slate-800 dark:text-[#efe4d4] text-xs font-semibold hover:bg-stone-300 dark:hover:bg-[#382518]"
              >
                Back to Study
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Slab Modal */}
      <EditSlabModal
        isOpen={!!editingSlabTarget}
        onClose={() => setEditingSlabTarget(null)}
        slab={editingSlabTarget}
        onSaveSlab={handleSaveEditedSlab}
        onDeleteSlab={(slabId) => handleDeleteSlab(slabId)}
        onAskGeminiAboutSlab={(topic) => {
          setAskGeminiTopic(topic);
          setIsAskGeminiModalOpen(true);
        }}
        currentSubject={currentSubject}
      />

      {/* Edit Reminder & Notification Modal */}
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

      {/* Universal Ask Gemini Modal */}
      <AskGeminiModal
        isOpen={isAskGeminiModalOpen}
        onClose={() => setIsAskGeminiModalOpen(false)}
        initialTopic={askGeminiTopic}
        currentSubject={currentSubject}
        onInsertToNote={(contentHtml) => {
          if (notebooks[0]) {
            onOpenNotebook(notebooks[0].id);
          }
        }}
      />
    </div>
  );
};
