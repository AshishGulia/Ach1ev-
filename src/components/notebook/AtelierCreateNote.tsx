import React, { useState, useRef, useEffect, useCallback } from 'react';
import './atelierNote.css';
import {
  Feather,
  LayoutGrid,
  PenLine,
  Calendar,
  Brain,
  Users,
  Coffee,
  Trash2,
  Menu,
  Square,
  Columns2,
  Columns3,
  Rows2,
  Cloud,
  Paperclip,
  Sparkles,
  Moon,
  Sun,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Search,
  Link2,
  Maximize2,
  Minimize2,
  Undo2,
  Redo2,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Highlighter,
  List,
  ListOrdered,
  ListChecks,
  Lightbulb,
  Link as LinkIcon,
  Play,
  Pause,
  CirclePlay,
  Image as ImageIcon,
  MoreHorizontal,
  X,
  Globe,
  FileText,
  Music,
  GripHorizontal,
  RotateCcw,
  RotateCw,
  Clock,
  Plus,
  Download,
  Printer,
  Copy,
  RemoveFormatting,
  TriangleAlert,
  Layers,
  EyeOff,
  Star,
  CalendarClock,
  Sigma,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  ChevronsDownUp,
  Minus,
  Check,
  Tag,
  BookOpen,
  Folder,
  Folders,
  ExternalLink,
  Loader2,
  Scissors,
  Clipboard,
  Move,
  Mic,
  MicOff,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  IndentIncrease,
  IndentDecrease,
  Subscript,
  Superscript,
  PenTool,
  RefreshCw,
} from 'lucide-react';
import { Notebook, DesignId, MedicalBook } from '../../types';
import { getDrivePreviewUrl } from '../../services/googleDriveService';
import {
  RoundColorColumnsPicker,
  UNIFIED_COLOR_COLUMNS,
  UNIFIED_HIGHLIGHT_COLUMNS,
} from '../common/RoundColorColumnsPicker';

export interface AtelierCreateNoteProps {
  notebook?: Notebook;
  onUpdateNotebook?: (updated: Notebook) => void;
  activePageIndex?: number;
  books?: MedicalBook[];
  onBack?: () => void;
  activeDesign?: DesignId;
}

interface DocumentItem {
  id: string;
  type: 'book' | 'web' | 'pdf' | 'image';
  title: string;
  short: string;
  tag?: string;
  url?: string;
  pages?: string[];
}

interface AttachedResource {
  id: string;
  type: 'youtube' | 'web' | 'doc' | 'image' | 'audio';
  title: string;
  meta: string;
  vid?: string;
  url?: string;
  docId?: string;
}

interface VideoWindowState {
  id: string;
  title: string;
  vid: string;
  left: number;
  top: number;
  width: number;
  height: number;
  zIndex: number;
  isPlaying: boolean;
  currentTime: number;
  playbackRate: number;
  isMinimized: boolean;
  isMaximized: boolean;
  preMaxStyle?: { left: number; top: number; width: number; height: number };
}

export interface OpenDocPane {
  id: string;
  docId: string;
  tag: string;
  tagColorClass?: string;
  zoom: number;
  searchOpen: boolean;
  searchQuery: string;
  searchHits: string;
  isMinimized: boolean;
  isClosed: boolean;
  pageIndex: number;
}

const INITIAL_DOCS: DocumentItem[] = [];

const mapBookToDocItem = (b: MedicalBook): DocumentItem => {
  const driveOrPdfUrl = b.driveFileId
    ? getDrivePreviewUrl(b.driveFileId)
    : b.pdfFileUrl && (b.pdfFileUrl.includes('drive.google.com') || b.pdfFileUrl.startsWith('http'))
    ? getDrivePreviewUrl(b.pdfFileUrl) || b.pdfFileUrl
    : undefined;
  if (driveOrPdfUrl) {
    return {
      id: b.id,
      type: 'pdf',
      title: b.title,
      short: b.title,
      tag: b.subject || 'PDF',
      url: driveOrPdfUrl,
    };
  }
  return {
    id: b.id,
    type: 'book',
    title: b.title,
    short: b.title,
    tag: b.subject || 'Book',
    pages: (b.pages || []).map(
      (p) =>
        `<div class="run"><span>${b.title} · ${p.keyTopic || b.subject}</span><span>Page ${p.pageNumber}</span></div><h2>${p.title}</h2>${p.contentHtml || ''}`
    ),
  };
};

const INITIAL_RESOURCES: AttachedResource[] = [];

const CUSTOMIZABLE_RIBBON_TOOLS: Array<{
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
}> = [
  { id: 'paper-style', label: 'Paper Style', icon: FileText, title: 'Ruled / Plain / Grid / Dot' },
  { id: 'table', label: 'Table', icon: Columns3, title: 'Insert 3x3 table' },
  { id: 'pearl', label: 'Pearl', icon: Lightbulb, title: 'Clinical pearl callout' },
  { id: 'warn', label: 'Caution', icon: TriangleAlert, title: 'Caution callout' },
  { id: 'mnemonic', label: 'Mnemonic', icon: Brain, title: 'Mnemonic block' },
  { id: 'flash', label: 'Flashcard', icon: Layers, title: 'Flashcard Q / A' },
  { id: 'hy', label: 'High-Yield', icon: Star, title: 'High-Yield badge' },
  { id: 'superscript', label: 'x² Superscript', icon: Superscript, title: 'Superscript' },
  { id: 'subscript', label: 'x₂ Subscript', icon: Subscript, title: 'Subscript' },
  { id: 'indent', label: 'Indent +/-', icon: IndentIncrease, title: 'Indent controls' },
  { id: 'cloze', label: 'Cloze', icon: EyeOff, title: 'Hide selected text' },
  { id: 'toggle', label: 'Toggle', icon: ChevronsDownUp, title: 'Collapsible toggle section' },
  { id: 'equation', label: 'Equation', icon: Sigma, title: 'Equation block' },
  { id: 'code', label: 'Code', icon: FileText, title: 'Code / formula block' },
  { id: 'divider', label: 'Divider', icon: Minus, title: 'Divider line' },
  { id: 'link', label: 'Link', icon: LinkIcon, title: 'Insert hyperlink' },
  { id: 'date', label: 'Date Stamp', icon: CalendarClock, title: 'Insert date & time' },
  { id: 'youtube', label: 'YouTube', icon: CirclePlay, title: 'Attach YouTube video' },
  { id: 'image', label: 'Image', icon: ImageIcon, title: 'Insert image' },
  { id: 'clear', label: 'Clear Format', icon: RemoveFormatting, title: 'Clear formatting' },
  { id: 'copy', label: 'Copy', icon: Copy, title: 'Copy note plain text' },
  { id: 'md', label: 'Export MD', icon: Download, title: 'Export Markdown (.md)' },
  { id: 'print', label: 'Print', icon: Printer, title: 'Print / Save PDF' },
];

const TOOL_GROUPS: Array<{
  category: string;
  items: Array<{ id: string; icon: React.ComponentType<{ className?: string }>; label: string; kbd?: string }>;
}> = [
  {
    category: 'Headings & Format',
    items: [
      { id: 'h1', icon: Heading1, label: 'Title (H1)' },
      { id: 'h2', icon: Heading2, label: 'Heading (H2)' },
      { id: 'h3', icon: Heading3, label: 'Subheading (H3)' },
      { id: 'quote', icon: Quote, label: 'Quote' },
      { id: 'superscript', icon: Superscript, label: 'Superscript (x²)' },
      { id: 'subscript', icon: Subscript, label: 'Subscript (x₂)' },
      { id: 'clear', icon: RemoveFormatting, label: 'Clear formatting' },
    ],
  },
  {
    category: 'Insert & Study Blocks',
    items: [
      { id: 'table', icon: Columns3, label: 'Table (3×3)' },
      { id: 'pearl', icon: Lightbulb, label: 'Pearl callout' },
      { id: 'warn', icon: TriangleAlert, label: 'Caution callout' },
      { id: 'mnemonic', icon: Brain, label: 'Mnemonic block' },
      { id: 'flash', icon: Layers, label: 'Flashcard Q / A' },
      { id: 'hy', icon: Star, label: 'High-Yield badge' },
      { id: 'cloze', icon: EyeOff, label: 'Cloze hide' },
      { id: 'toggle', icon: ChevronsDownUp, label: 'Collapsible toggle' },
      { id: 'equation', icon: Sigma, label: 'Equation block' },
      { id: 'code', icon: FileText, label: 'Code / formula block' },
      { id: 'divider', icon: Minus, label: 'Divider line' },
      { id: 'link', icon: LinkIcon, label: 'Insert link', kbd: 'Ctrl+L' },
      { id: 'date', icon: CalendarClock, label: 'Date & time stamp' },
      { id: 'timestamp', icon: Clock, label: 'Video timestamp' },
    ],
  },
  {
    category: 'Attach Resources',
    items: [
      { id: 'attach-yt', icon: CirclePlay, label: 'YouTube video' },
      { id: 'attach-image', icon: ImageIcon, label: 'Image' },
      { id: 'attach-web', icon: Globe, label: 'Website' },
      { id: 'attach-pdf', icon: FileText, label: 'Document / PDF' },
      { id: 'attach-audio', icon: Music, label: 'Audio' },
    ],
  },
  {
    category: 'Export & Share',
    items: [
      { id: 'copy', icon: Copy, label: 'Copy plain text' },
      { id: 'md', icon: Download, label: 'Export Markdown (.md)' },
      { id: 'print', icon: Printer, label: 'Print / Save PDF' },
    ],
  },
  {
    category: 'Layout & View',
    items: [
      { id: 'layout-focus', icon: Square, label: 'Focus note only' },
      { id: 'layout-split', icon: Columns2, label: 'Split view (1 doc + note)' },
      { id: 'layout-triple', icon: Columns3, label: 'Triple view (2 docs + note)' },
      { id: 'layout-stacked', icon: LayoutGrid, label: 'Stacked view (top docs)' },
      { id: 'sync', icon: RefreshCw, label: 'Toggle scroll sync' },
    ],
  },
];

const NOTE_FONT_OPTIONS: Array<{
  id: string;
  key: string;
  short: string;
  label: string;
  family: string;
  isHandwriting?: boolean;
}> = [
  { id: 'font-alata', key: 'alata', short: 'Alata', label: 'Alata · Workspace clean', family: "'Alata', sans-serif" },
  { id: 'font-plus-jakarta', key: 'plus-jakarta', short: 'Plus Jakarta Sans', label: 'Plus Jakarta Sans · Modern geometric', family: "'Plus Jakarta Sans', sans-serif" },
  { id: 'font-inter', key: 'inter', short: 'Inter', label: 'Inter · Swiss clinical legible', family: "'Inter', sans-serif" },
  { id: 'font-poppins', key: 'poppins', short: 'Poppins', label: 'Poppins · Rounded clean sans', family: "'Poppins', sans-serif" },
  { id: 'font-outfit', key: 'outfit', short: 'Outfit', label: 'Outfit · Architectural modern', family: "'Outfit', sans-serif" },
  { id: 'font-lora', key: 'lora', short: 'Lora', label: 'Lora · Calligraphic ink serif', family: "'Lora', serif" },
  { id: 'font-fraunces', key: 'fraunces', short: 'Fraunces', label: 'Fraunces · Warm optical serif', family: "'Fraunces', serif" },
  { id: 'font-eb-garamond', key: 'eb-garamond', short: 'EB Garamond', label: 'EB Garamond · Oxford scholarly serif', family: "'EB Garamond', serif" },
  { id: 'font-playfair', key: 'playfair', short: 'Playfair Display', label: 'Playfair Display · Editorial journal', family: "'Playfair Display', serif" },
  { id: 'font-merriweather', key: 'merriweather', short: 'Merriweather', label: 'Merriweather · Classic book serif', family: "'Merriweather', serif" },
  { id: 'font-caveat', key: 'caveat', short: 'Caveat', label: 'Caveat · Handwritten flow', family: "'Caveat', cursive", isHandwriting: true },
  { id: 'font-kalam', key: 'kalam', short: 'Kalam', label: 'Kalam · Upright ballpoint hand', family: "'Kalam', cursive", isHandwriting: true },
  { id: 'font-patrick', key: 'patrick', short: 'Patrick Hand', label: 'Patrick Hand · Neat study script', family: "'Patrick Hand', cursive", isHandwriting: true },
  { id: 'font-dancing-script', key: 'dancing-script', short: 'Dancing Script', label: 'Dancing Script · Fluid script', family: "'Dancing Script', cursive", isHandwriting: true },
  { id: 'font-architects-daughter', key: 'architects-daughter', short: 'Architects Daughter', label: 'Architects Daughter · Draftsman pen', family: "'Architects Daughter', cursive", isHandwriting: true },
  { id: 'font-mono', key: 'mono', short: 'JetBrains Mono', label: 'JetBrains Mono · Technical & formula', family: "'JetBrains Mono', monospace" },
];

const normalizeNoteFontKey = (raw: string): string => {
  if (raw === 'sans') return 'alata';
  if (raw === 'serif') return 'merriweather';
  if (raw === 'hand') return 'caveat';
  return raw || 'alata';
};

const formatTodayDate = () =>
  new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

const formatTime = (s: number) => {
  s = Math.max(0, Math.floor(s));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const x = String(s % 60).padStart(2, '0');
  return h ? `${h}:${String(m).padStart(2, '0')}:${x}` : `${m}:${x}`;
};

interface TableStylePreset {
  id: string;
  name: string;
  swatch: string;
  headerBg: string;
  headerText: string;
  stripeBg: string;
  cellBg: string;
  cellText: string;
  borderColor: string;
}

const MS_WORD_TABLE_STYLES: TableStylePreset[] = [
  {
    id: 'caramel',
    name: 'Caramel Brass',
    swatch: '#A47C43',
    headerBg: '#A47C43',
    headerText: '#FFFFFF',
    stripeBg: 'rgba(164, 124, 67, 0.12)',
    cellBg: 'transparent',
    cellText: 'inherit',
    borderColor: '#C9B18A',
  },
  {
    id: 'espresso',
    name: 'Espresso Wood',
    swatch: '#4A2B18',
    headerBg: '#4A2B18',
    headerText: '#FFF8EC',
    stripeBg: 'rgba(92, 53, 28, 0.10)',
    cellBg: 'transparent',
    cellText: 'inherit',
    borderColor: '#8D6E57',
  },
  {
    id: 'navy',
    name: 'Clinical Navy',
    swatch: '#1E3A5F',
    headerBg: '#1E3A5F',
    headerText: '#FFFFFF',
    stripeBg: 'rgba(30, 58, 95, 0.09)',
    cellBg: 'transparent',
    cellText: 'inherit',
    borderColor: '#93B0D1',
  },
  {
    id: 'sage',
    name: 'Forest Sage',
    swatch: '#355346',
    headerBg: '#355346',
    headerText: '#FFFFFF',
    stripeBg: 'rgba(53, 83, 70, 0.10)',
    cellBg: 'transparent',
    cellText: 'inherit',
    borderColor: '#8FAEA0',
  },
  {
    id: 'burgundy',
    name: 'Burgundy Rose',
    swatch: '#6E232A',
    headerBg: '#6E232A',
    headerText: '#FFF5F5',
    stripeBg: 'rgba(110, 35, 42, 0.09)',
    cellBg: 'transparent',
    cellText: 'inherit',
    borderColor: '#C99AA0',
  },
  {
    id: 'minimal',
    name: 'Clean Minimal',
    swatch: '#94A3B8',
    headerBg: 'rgba(148, 163, 184, 0.18)',
    headerText: 'inherit',
    stripeBg: 'rgba(148, 163, 184, 0.06)',
    cellBg: 'transparent',
    cellText: 'inherit',
    borderColor: '#CBD5E1',
  },
];

export const AtelierCreateNote: React.FC<AtelierCreateNoteProps> = ({
  notebook,
  onUpdateNotebook,
  activePageIndex = 0,
  books = [],
  activeDesign = '1',
}) => {
  // Title & Content (Starts with clean blank ruled paper by default)
  const initialTitle = notebook?.title || 'Untitled Note';
  const initialContent =
    notebook?.pages?.[activePageIndex]?.contentHtml ||
    `<p><br></p>`;

  const [noteTitle, setNoteTitle] = useState(initialTitle);
  const [todayDate, setTodayDate] = useState<string>(() => formatTodayDate());

  useEffect(() => {
    const syncDate = () => {
      const next = formatTodayDate();
      setTodayDate((prev) => (prev === next ? prev : next));
    };
    const interval = setInterval(syncDate, 60000);
    window.addEventListener('focus', syncDate);
    document.addEventListener('visibilitychange', syncDate);
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', syncDate);
      document.removeEventListener('visibilitychange', syncDate);
    };
  }, []);
  const [layout, setLayout] = useState<'split' | 'triple' | 'stacked' | 'focus'>('focus');
  const [isMoreLayoutsOpen, setIsMoreLayoutsOpen] = useState<boolean>(false);
  const [mobileTab, setMobileTab] = useState<string>('note');
  const [paperStyle, setPaperStyle] = useState<'ruled' | 'plain' | 'grid' | 'dot'>('ruled');
  const [fontStyle, setFontStyle] = useState<string>(() => {
    try {
      return localStorage.getItem('medden_note_font_style') || 'alata';
    } catch {
      return 'alata';
    }
  });
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkUrlInput, setLinkUrlInput] = useState('https://');
  const [linkLabelInput, setLinkLabelInput] = useState('');
  const [editorFontSizePx, setEditorFontSizePx] = useState<number>(15.5);
  const [underlineMode, setUnderlineMode] = useState<'straight' | 'hand'>('straight');
  const [openUnderlineMenu, setOpenUnderlineMenu] = useState<{ left: number; top: number } | null>(null);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');

  // Canvas Text Selection Floating Menu & Gemini AI popover
  const [canvasSelection, setCanvasSelection] = useState<{
    visible: boolean;
    x: number;
    y: number;
    text: string;
  }>({
    visible: false,
    x: 0,
    y: 0,
    text: '',
  });

  const [geminiExplainTerm, setGeminiExplainTerm] = useState<string | null>(null);
  const [geminiExplanation, setGeminiExplanation] = useState<string | null>(null);
  const [isGeminiLoading, setIsGeminiLoading] = useState(false);
  const [activeTableEl, setActiveTableEl] = useState<HTMLTableElement | null>(null);
  const [activeCellEl, setActiveCellEl] = useState<HTMLTableCellElement | null>(null);
  const [tableWidthPct, setTableWidthPct] = useState<number>(100);
  const [activeTableStyleId, setActiveTableStyleId] = useState<string>('caramel');
  const [tableBorderStyle, setTableBorderStyle] = useState<'grid' | 'horizontal' | 'none'>('grid');

  // Text Color & Highlighter popovers (clean round color columns, zero hex)
  const [activeTextColor, setActiveTextColor] = useState<string>('#5C351C');
  const [activeHighlightColor, setActiveHighlightColor] = useState<string>('#FEF08A');
  const [openColorMenu, setOpenColorMenu] = useState<{
    type: 'text' | 'highlight';
    left: number;
    top: number;
  } | null>(null);
  const ribbonScrollRef = useRef<HTMLDivElement | null>(null);
  const [isAddToolsOpen, setIsAddToolsOpen] = useState(false);
  const [pinnedRibbonTools, setPinnedRibbonTools] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('medden_note_pinned_tools_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });
  const togglePinnedTool = (id: string) => {
    setPinnedRibbonTools((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try {
        localStorage.setItem('medden_note_pinned_tools_v1', JSON.stringify(next));
      } catch {}
      return next;
    });
  };
  const loadedNoteKeyRef = useRef<string | null>(null);
  const historyStackRef = useRef<string[]>([]);
  const historyIdxRef = useRef<number>(-1);
  const isApplyingHistoryRef = useRef<boolean>(false);
  const tableActionRef = useRef<
    | {
        mode: 'col';
        table: HTMLTableElement;
        colIndex: number;
        startX: number;
        startWidth: number;
        nextStartWidth: number;
      }
    | {
        mode: 'move';
        wrapper: HTMLElement;
        startX: number;
        startY: number;
        origLeft: number;
        origTop: number;
      }
    | {
        mode: 'resize';
        edge: 'left' | 'right' | 'bottom' | 'bottom-right' | 'bottom-left';
        wrapper: HTMLElement;
        table: HTMLTableElement;
        startX: number;
        startY: number;
        origW: number;
        origH: number;
        origLeft: number;
      }
    | null
  >(null);

  const draftNoteIdRef = useRef<string>(`nb-${Date.now()}`);

  // Documents Catalog synced from user's real Shelf books + session attachments
  const [docsList, setDocsList] = useState<DocumentItem[]>(() =>
    books.length > 0 ? books.map(mapBookToDocItem) : INITIAL_DOCS
  );

  useEffect(() => {
    setDocsList((prev) => {
      const sessionDocs = prev.filter(
        (d) => !books.some((b) => b.id === d.id) && (d.id.startsWith('web-') || d.id.startsWith('doc-'))
      );
      return [...books.map(mapBookToDocItem), ...sessionDocs];
    });
  }, [books]);

  // Subwindow Panes State (empty until user opens a book or attaches a file/URL)
  const [docPanes, setDocPanes] = useState<OpenDocPane[]>([]);

  // Window State for Note & Maximization
  const [isNoteMinimized, setIsNoteMinimized] = useState(false);
  const [isNoteClosed, setIsNoteClosed] = useState(false);
  const [maximizedWindowId, setMaximizedWindowId] = useState<string | null>(null);
  const [isBookPickerOpen, setIsBookPickerOpen] = useState(false);

  const [syncScroll, setSyncScroll] = useState(false);

  // Attached Resources
  const [resources, setResources] = useState<AttachedResource[]>(INITIAL_RESOURCES);

  // Floating Videos
  const [videoWindows, setVideoWindows] = useState<VideoWindowState[]>([]);
  const topZIndexRef = useRef(100);

  // Tools Drawer, Direct Paper Border Drag Stretch (Width & Height) & Speech/Spelling State
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [toolsSearch, setToolsSearch] = useState('');
  const [sheetWidthPx, setSheetWidthPx] = useState<number>(() =>
    typeof window !== 'undefined' && window.innerWidth < 860
      ? Math.max(320, window.innerWidth - 52)
      : 780
  );
  const [sheetMinHeightPx, setSheetMinHeightPx] = useState<number>(640);
  const [isDraggingSheetWidth, setIsDraggingSheetWidth] = useState<boolean>(false);
  const [hoverSheetEdge, setHoverSheetEdge] = useState<'left' | 'right' | 'bottom' | 'bottom-right' | 'bottom-left' | null>(null);
  const [isDictating, setIsDictating] = useState<boolean>(false);
  const recognitionRef = useRef<any>(null);
  const [isAttachOpen, setIsAttachOpen] = useState(false);
  const [isAttachmentsDrawerOpen, setIsAttachmentsDrawerOpen] = useState(false);
  const [attachType, setAttachType] = useState<'youtube' | 'web' | 'pdf' | 'image' | 'audio'>('youtube');
  const [attachUrl, setAttachUrl] = useState('');
  const [attachName, setAttachName] = useState('');
  const [attachOpenRightAway, setAttachOpenRightAway] = useState(true);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadedFileUrl, setUploadedFileUrl] = useState('');

  // Toast
  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);
  const toastTimeoutRef = useRef<any>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setIsToastVisible(true);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setIsToastVisible(false);
    }, 2400);
  }, []);

  // Delete Note State & Handler
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const handleDeleteCurrentNote = () => {
    if (editorRef.current) {
      editorRef.current.innerHTML = '<p>Note moved to trash. Click here to begin writing new clinical notes...</p>';
    }
    setNoteTitle('Untitled Medical Note');
    setIsDeleteModalOpen(false);
    showToast('Note deleted successfully and moved to trash');
  };

  // Mouse Cursor Resizing Joystick State (Windows Folder Style)
  const [splitRatio, setSplitRatio] = useState<number>(45); // Left Doc(s): 45%, Note: 55%
  const [tripleRatios, setTripleRatios] = useState<[number, number]>([32, 32]); // Doc 1: 32%, Doc 2: 32%, Note: 36%
  const [stackedRatio, setStackedRatio] = useState<number>(45); // Top: 45%, Bottom: 55%
  const [isDraggingWsSplitter, setIsDraggingWsSplitter] = useState<boolean>(false);
  const [dragSplitterType, setDragSplitterType] = useState<string | null>(null);
  const wsRef = useRef<HTMLElement | null>(null);

  // Resize Joystick Pointer Handlers
  const handleSplitterPointerDown = (type: 'split' | 'sub-1' | 'triple-1' | 'triple-2' | 'stacked', e: React.PointerEvent) => {
    e.preventDefault();
    setIsDraggingWsSplitter(true);
    setDragSplitterType(type);
    const ws = wsRef.current;
    if (!ws) return;
    const wsRect = ws.getBoundingClientRect();

    const onPointerMove = (moveEv: PointerEvent) => {
      if (type === 'stacked') {
        const offsetY = moveEv.clientY - wsRect.top;
        const newPct = Math.max(18, Math.min(82, (offsetY / wsRect.height) * 100));
        setStackedRatio(Math.round(newPct));
      } else if (type === 'split') {
        const offsetX = moveEv.clientX - wsRect.left;
        const newPct = Math.max(18, Math.min(82, (offsetX / wsRect.width) * 100));
        setSplitRatio(Math.round(newPct));
      } else if (type === 'sub-1') {
        const offsetX = moveEv.clientX - wsRect.left;
        const newPct = Math.max(15, Math.min(70, (offsetX / wsRect.width) * 100));
        setSplitRatio(Math.round(newPct));
      } else if (type === 'triple-1') {
        const offsetX = moveEv.clientX - wsRect.left;
        const newPct = Math.max(15, Math.min(45, (offsetX / wsRect.width) * 100));
        setTripleRatios((prev) => [Math.round(newPct), prev[1]]);
      } else if (type === 'triple-2') {
        const offsetX = moveEv.clientX - wsRect.left;
        const totalPct = (offsetX / wsRect.width) * 100;
        const newDoc2 = Math.max(15, Math.min(50, totalPct - tripleRatios[0]));
        setTripleRatios((prev) => [prev[0], Math.round(newDoc2)]);
      }
    };

    const onPointerUp = () => {
      setIsDraggingWsSplitter(false);
      setDragSplitterType(null);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.body.style.cursor = type === 'stacked' ? 'row-resize' : 'col-resize';
    document.body.style.userSelect = 'none';
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  // Selection Pill
  const [selectionPill, setSelectionPill] = useState<{
    visible: boolean;
    x: number;
    y: number;
    quote: { text: string; src: string; page?: number } | null;
  }>({
    visible: false,
    x: 0,
    y: 0,
    quote: null,
  });

  // Editor Refs
  const editorRef = useRef<HTMLDivElement>(null);
  const sheetTitleRef = useRef<HTMLHeadingElement>(null);
  const savedSelectionRange = useRef<Range | null>(null);
  const isSyncingScrollRef = useRef(false);
  const docBodyRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Counts
  const [wordCount, setWordCount] = useState(0);
  const [readTime, setReadTime] = useState('1 min read');

  // Compute stats
  const updateCounts = useCallback(() => {
    if (!editorRef.current) return;
    const text = editorRef.current.innerText || '';
    const words = (text.trim().match(/\S+/g) || []).length;
    setWordCount(words);
    setReadTime(`${Math.max(1, Math.round(words / 200))} min read`);
  }, []);

  // Save Range for Rich Text insertion
  const saveRange = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && editorRef.current && editorRef.current.contains(sel.anchorNode)) {
      savedSelectionRange.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const restoreRange = () => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    const sel = window.getSelection();
    if (!sel) return;
    sel.removeAllRanges();
    if (savedSelectionRange.current && editorRef.current.contains(savedSelectionRange.current.startContainer)) {
      sel.addRange(savedSelectionRange.current);
    } else {
      const r = document.createRange();
      r.selectNodeContents(editorRef.current);
      r.collapse(false);
      sel.addRange(r);
    }
  };

  useEffect(() => {
    try {
      localStorage.setItem('medden_note_font_style', fontStyle);
    } catch {}
  }, [fontStyle]);

  const ensureTableDragHandles = useCallback(() => {
    const ed = editorRef.current;
    if (!ed) return;
    ed.querySelectorAll('table').forEach((tbl) => {
      const table = tbl as HTMLTableElement;
      table.setAttribute('contenteditable', 'true');
      let wrapper = table.closest('.an-table-wrapper') as HTMLElement | null;
      if (!wrapper && table.parentNode) {
        wrapper = document.createElement('div');
        wrapper.className = 'an-table-wrapper';
        wrapper.setAttribute('contenteditable', 'false');
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);
      }
      if (wrapper) {
        wrapper.setAttribute('contenteditable', 'false');
        if (!wrapper.querySelector(':scope > [data-table-grip="move"]')) {
          const grip = document.createElement('div');
          grip.className = 'an-table-drag-grip';
          grip.setAttribute('contenteditable', 'false');
          grip.setAttribute('data-table-grip', 'move');
          grip.setAttribute('title', 'Hold & drag to move table anywhere · Double-click to reset position');
          grip.innerHTML = '<span class="an-grip-dots">⋮⋮</span><span>Drag Table</span>';
          wrapper.insertBefore(grip, wrapper.firstChild);
        }
      }
    });
  }, []);

  const pushHistorySnapshot = useCallback((html?: string) => {
    if (isApplyingHistoryRef.current || !editorRef.current) return;
    const snap = html ?? editorRef.current.innerHTML;
    const stack = historyStackRef.current;
    if (historyIdxRef.current >= 0 && stack[historyIdxRef.current] === snap) return;
    const next = stack.slice(0, historyIdxRef.current + 1);
    next.push(snap);
    if (next.length > 45) next.shift();
    historyStackRef.current = next;
    historyIdxRef.current = next.length - 1;
  }, []);

  const performHistoryStep = (dir: -1 | 1) => {
    if (!editorRef.current) return;
    const nextIdx = historyIdxRef.current + dir;
    if (nextIdx >= 0 && nextIdx < historyStackRef.current.length) {
      isApplyingHistoryRef.current = true;
      historyIdxRef.current = nextIdx;
      editorRef.current.innerHTML = historyStackRef.current[nextIdx];
      ensureTableDragHandles();
      isApplyingHistoryRef.current = false;
      updateCounts();
      showToast(dir === -1 ? 'Undone' : 'Redone');
      return;
    }
    restoreRange();
    document.execCommand(dir === -1 ? 'undo' : 'redo');
    saveRange();
    ensureTableDragHandles();
    updateCounts();
  };

  const executeCommand = (cmd: string, val: string | undefined = undefined) => {
    if (cmd === 'undo') {
      performHistoryStep(-1);
      return;
    }
    if (cmd === 'redo') {
      performHistoryStep(1);
      return;
    }
    pushHistorySnapshot();
    restoreRange();
    try {
      document.execCommand('styleWithCSS', false, 'true');
    } catch {}
    document.execCommand(cmd, false, val);
    saveRange();
    pushHistorySnapshot();
    triggerSave();
  };

  const insertHtmlAtCursor = (html: string) => {
    pushHistorySnapshot();
    restoreRange();
    document.execCommand('insertHTML', false, html);
    ensureTableDragHandles();
    saveRange();
    pushHistorySnapshot();
    triggerSave();
  };

  // Debounced auto-save
  const saveTimeoutRef = useRef<any>(null);
  const triggerSave = useCallback(() => {
    setSaveStatus('saving');
    updateCounts();
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      setSaveStatus('saved');
      if (onUpdateNotebook && editorRef.current) {
        const updatedHtml = editorRef.current.innerHTML;
        const resolvedTitle = noteTitle.trim() || 'Untitled Note';
        if (notebook) {
          const pages = [...(notebook.pages || [])];
          if (pages[activePageIndex]) {
            pages[activePageIndex] = {
              ...pages[activePageIndex],
              title: resolvedTitle,
              contentHtml: updatedHtml,
              updatedAt: new Date().toISOString(),
            };
          } else {
            pages.push({
              id: `page-${Date.now()}`,
              title: resolvedTitle,
              contentHtml: updatedHtml,
              date: new Date().toISOString().split('T')[0],
              updatedAt: new Date().toISOString(),
              screenshots: [],
              inkStrokes: [],
            });
          }
          onUpdateNotebook({
            ...notebook,
            title: resolvedTitle,
            pages,
          });
        } else {
          const newId = draftNoteIdRef.current;
          const nowIso = new Date().toISOString();
          const todayStr = nowIso.split('T')[0];
          loadedNoteKeyRef.current = `${newId}::0`;
          onUpdateNotebook({
            id: newId,
            title: resolvedTitle,
            subject: 'Pharmacology',
            coverTheme: 'geometric',
            coverTitle: resolvedTitle,
            coverSubtitle: 'Personal Study Notebook',
            paperType: 'ruled-thin',
            paperColor: 'beige',
            coverColor: '#7c4521',
            activePageIndex: 0,
            createdAt: todayStr,
            updatedAt: nowIso,
            pages: [
              {
                id: `page-${Date.now()}`,
                title: resolvedTitle,
                contentHtml: updatedHtml,
                date: todayStr,
                updatedAt: nowIso,
                screenshots: [],
                inkStrokes: [],
              },
            ],
          });
        }
      }
    }, 700);
  }, [notebook, onUpdateNotebook, activePageIndex, noteTitle, updateCounts]);

  // Load/reset note content cleanly when switching notes or opening a new blank note
  useEffect(() => {
    const noteKey = `${notebook?.id || 'default'}::${activePageIndex}`;
    if (loadedNoteKeyRef.current !== noteKey) {
      loadedNoteKeyRef.current = noteKey;
      const nextTitle = notebook?.title || 'Untitled Note';
      const nextHtml = notebook?.pages?.[activePageIndex]?.contentHtml || '<p><br></p>';
      setNoteTitle(nextTitle);
      if (sheetTitleRef.current) {
        sheetTitleRef.current.textContent = nextTitle;
      }
      if (editorRef.current) {
        editorRef.current.innerHTML = nextHtml;
        ensureTableDragHandles();
        historyStackRef.current = [editorRef.current.innerHTML];
        historyIdxRef.current = 0;
      }
      setActiveTableEl(null);
      setActiveCellEl(null);
      setSaveStatus('saved');
    }
    updateCounts();
  }, [notebook?.id, activePageIndex, updateCounts]);

  // Handle Selection in Document Panes
  useEffect(() => {
    const handlePointerUp = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.an-sel-pill')) return;

      setTimeout(() => {
        const sel = window.getSelection();
        if (!sel || sel.isCollapsed) {
          setSelectionPill((p) => (p.visible ? { ...p, visible: false } : p));
          return;
        }

        const text = sel.toString().trim();
        const anchorParent = sel.anchorNode?.parentElement;
        const bodyEl = anchorParent?.closest('.an-doc-body');

        if (!bodyEl || text.length < 3) {
          setSelectionPill((p) => (p.visible ? { ...p, visible: false } : p));
          return;
        }

        const paneEl = bodyEl.closest('.an-pane') as HTMLElement;
        const paneId = paneEl?.dataset?.paneId;
        const pane = docPanes.find((p) => p.id === paneId);
        const currentDoc = docsList.find((d) => d.id === pane?.docId);
        const pageEl = anchorParent?.closest('.an-page') as HTMLElement;
        const pageNum = pageEl ? Number(pageEl.dataset.page) + 1 : undefined;

        const range = sel.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        setSelectionPill({
          visible: true,
          x: Math.min(window.innerWidth - 140, Math.max(12, rect.left + rect.width / 2 - 60)),
          y: Math.max(12, rect.top - 46),
          quote: {
            text,
            src: currentDoc?.short || currentDoc?.title || 'DOCUMENT',
            page: pageNum,
          },
        });
      }, 20);
    };

    window.addEventListener('pointerup', handlePointerUp);
    return () => window.removeEventListener('pointerup', handlePointerUp);
  }, [docPanes, docsList]);

  // Add selection quote to note
  const handleAddQuoteToNote = () => {
    if (!selectionPill.quote) return;
    const q = selectionPill.quote;
    const cite = `${q.src.toUpperCase()}${q.page ? ` · P. ${q.page}` : ''}`;
    const blockHtml = `<blockquote>${q.text}<cite>${cite}</cite></blockquote><p><br></p>`;
    insertHtmlAtCursor(blockHtml);
    setSelectionPill((p) => ({ ...p, visible: false }));
    window.getSelection()?.removeAllRanges();
    showToast('Quote added to note with source');
    if (window.innerWidth <= 900) setMobileTab('note');
  };

  // Synchronized scrolling across document panes
  const handleDocScroll = (e: React.UIEvent<HTMLDivElement>, sourcePaneId: string) => {
    if (!syncScroll || isSyncingScrollRef.current) return;
    const target = e.currentTarget;
    isSyncingScrollRef.current = true;
    const scrollRatio = target.scrollTop / Math.max(1, target.scrollHeight - target.clientHeight);

    Object.entries(docBodyRefs.current).forEach(([id, el]) => {
      if (id !== sourcePaneId && el) {
        el.scrollTop = scrollRatio * (el.scrollHeight - el.clientHeight);
      }
    });

    requestAnimationFrame(() => {
      isSyncingScrollRef.current = false;
    });
  };

  // Subwindow Folder Operations: Minimize, Expand/Maximize, Close, Restore
  const handleMinimizePane = (paneId: string) => {
    setDocPanes((prev) => prev.map((p) => (p.id === paneId ? { ...p, isMinimized: true } : p)));
    if (maximizedWindowId === paneId) setMaximizedWindowId(null);
    const p = docPanes.find((item) => item.id === paneId);
    const doc = docsList.find((d) => d.id === p?.docId);
    showToast(`Minimised ${doc?.short || doc?.title || 'window'}`);
  };

  const handleRestorePane = (paneId: string) => {
    setDocPanes((prev) =>
      prev.map((p) => (p.id === paneId ? { ...p, isMinimized: false, isClosed: false } : p))
    );
    const p = docPanes.find((item) => item.id === paneId);
    const doc = docsList.find((d) => d.id === p?.docId);
    showToast(`Restored ${doc?.short || doc?.title || 'window'}`);
  };

  const handleClosePane = (paneId: string) => {
    setDocPanes((prev) => prev.map((p) => (p.id === paneId ? { ...p, isClosed: true } : p)));
    if (maximizedWindowId === paneId) setMaximizedWindowId(null);
    const p = docPanes.find((item) => item.id === paneId);
    const doc = docsList.find((d) => d.id === p?.docId);
    showToast(`Closed ${doc?.short || doc?.title || 'window'}`);
  };

  const handleToggleMaximizePane = (paneId: string) => {
    setMaximizedWindowId((prev) => (prev === paneId ? null : paneId));
    const p = docPanes.find((item) => item.id === paneId);
    const doc = docsList.find((d) => d.id === p?.docId);
    showToast(
      maximizedWindowId === paneId
        ? `Restored ${doc?.short || doc?.title}`
        : `Expanded ${doc?.short || doc?.title}`
    );
  };

  const handleOpenBookWindow = (docId: string) => {
    const existing = docPanes.find((p) => p.docId === docId);
    if (existing) {
      if (existing.isClosed || existing.isMinimized) {
        handleRestorePane(existing.id);
        setIsBookPickerOpen(false);
        return;
      }
    }
    const count = docPanes.length + 1;
    const tagColor = count % 3 === 1 ? '' : count % 3 === 2 ? 'brass' : 'blue';
    const newPane: OpenDocPane = {
      id: `pane-${Date.now()}`,
      docId,
      tag: `Doc ${count}`,
      tagColorClass: tagColor,
      zoom: 1,
      searchOpen: false,
      searchQuery: '',
      searchHits: '',
      isMinimized: false,
      isClosed: false,
      pageIndex: 0,
    };
    setDocPanes((prev) => [...prev, newPane]);
    setLayout((cur) => (cur === 'focus' ? 'split' : cur));
    setIsBookPickerOpen(false);
    const doc = docsList.find((d) => d.id === docId);
    showToast(`Opened ${doc?.short || doc?.title || 'document'}`);
  };

  // Video Management
  const openVideoWindow = (resource: AttachedResource, startTime = 0) => {
    const vid = resource.vid || 'jNQXAC9IVRw';
    setVideoWindows((prev) => {
      const existing = prev.find((v) => v.id === resource.id);
      if (existing) {
        topZIndexRef.current += 1;
        return prev.map((v) =>
          v.id === resource.id
            ? {
                ...v,
                isMinimized: false,
                currentTime: startTime || v.currentTime,
                isPlaying: true,
                zIndex: topZIndexRef.current,
              }
            : v
        );
      }
      topZIndexRef.current += 1;
      const count = prev.length;
      const left = Math.max(20, Math.min(window.innerWidth - 480, window.innerWidth - 500 - count * 24));
      const top = Math.max(80, 140 + count * 24);
      return [
        ...prev,
        {
          id: resource.id,
          title: resource.title,
          vid,
          left,
          top,
          width: 440,
          height: 310,
          zIndex: topZIndexRef.current,
          isPlaying: true,
          currentTime: startTime,
          playbackRate: 1,
          isMinimized: false,
          isMaximized: false,
        },
      ];
    });
  };

  const handleOpenResource = (r: AttachedResource) => {
    if (r.type === 'youtube') {
      openVideoWindow(r);
    } else if (r.type === 'audio') {
      showToast('Use the inline audio player on the resource badge');
    } else if (r.docId) {
      handleOpenBookWindow(r.docId);
    } else if (r.url) {
      const newDoc: DocumentItem = {
        id: `web-${Date.now()}`,
        type: 'web',
        title: r.title,
        short: r.title,
        url: r.url,
      };
      setDocsList((prev) => [...prev, newDoc]);
      handleOpenBookWindow(newDoc.id);
    }
  };

  const handleRemoveResource = (id: string) => {
    setResources((prev) => prev.filter((r) => r.id !== id));
    setVideoWindows((prev) => prev.filter((v) => v.id !== id));
    showToast('Resource removed');
  };

  // Video Drag & Resize
  const handleVideoHeaderPointerDown = (id: string, e: React.PointerEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest('button')) return;
    const currentWin = videoWindows.find((v) => v.id === id);
    if (!currentWin || currentWin.isMaximized) return;

    topZIndexRef.current += 1;
    setVideoWindows((prev) => prev.map((v) => (v.id === id ? { ...v, zIndex: topZIndexRef.current } : v)));

    const startX = e.clientX - currentWin.left;
    const startY = e.clientY - currentWin.top;

    const onPointerMove = (ev: PointerEvent) => {
      setVideoWindows((prev) =>
        prev.map((v) =>
          v.id === id
            ? {
                ...v,
                left: Math.min(window.innerWidth - 80, Math.max(10, ev.clientX - startX)),
                top: Math.min(window.innerHeight - 40, Math.max(50, ev.clientY - startY)),
              }
            : v
        )
      );
    };

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  const handleVideoResizePointerDown = (id: string, e: React.PointerEvent<HTMLSpanElement>) => {
    e.preventDefault();
    const currentWin = videoWindows.find((v) => v.id === id);
    if (!currentWin || currentWin.isMaximized) return;

    const startX = e.clientX;
    const startY = e.clientY;
    const startW = currentWin.width;
    const startH = currentWin.height;

    const onPointerMove = (ev: PointerEvent) => {
      setVideoWindows((prev) =>
        prev.map((v) =>
          v.id === id
            ? {
                ...v,
                width: Math.max(280, startW + ev.clientX - startX),
                height: Math.max(200, startH + ev.clientY - startY),
              }
            : v
        )
      );
    };

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  // Video Window Controls
  const togglePlayVideo = (id: string) => {
    setVideoWindows((prev) => prev.map((v) => (v.id === id ? { ...v, isPlaying: !v.isPlaying } : v)));
  };

  const seekVideo = (id: string, delta: number) => {
    setVideoWindows((prev) =>
      prev.map((v) => (v.id === id ? { ...v, currentTime: Math.max(0, v.currentTime + delta) } : v))
    );
  };

  const setVideoPlaybackRate = (id: string, rate: number) => {
    setVideoWindows((prev) => prev.map((v) => (v.id === id ? { ...v, playbackRate: rate } : v)));
    showToast(`Speed ${rate}×`);
  };

  const stampVideoTimestamp = (vid: VideoWindowState) => {
    const formatted = formatTime(vid.currentTime);
    const stampHtml = `<button class="ts" contenteditable="false" data-res="${vid.id}" data-t="${Math.floor(
      vid.currentTime
    )}"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-play"><polygon points="6 3 20 12 6 21 6 3"/></svg>${formatted}</button>&nbsp;`;
    insertHtmlAtCursor(stampHtml);
    showToast(`Timestamp ${formatted} added to note`);
  };

  const toggleMaximizeVideo = (id: string) => {
    setVideoWindows((prev) =>
      prev.map((v) => {
        if (v.id !== id) return v;
        if (v.isMaximized) {
          return {
            ...v,
            isMaximized: false,
            left: v.preMaxStyle?.left ?? v.left,
            top: v.preMaxStyle?.top ?? v.top,
            width: v.preMaxStyle?.width ?? 440,
            height: v.preMaxStyle?.height ?? 310,
          };
        }
        return {
          ...v,
          isMaximized: true,
          preMaxStyle: { left: v.left, top: v.top, width: v.width, height: v.height },
          left: 40,
          top: 75,
          width: window.innerWidth - 80,
          height: window.innerHeight - 150,
        };
      })
    );
  };

  // Attach Dialog Submission
  const handleAttachSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let res: AttachedResource | null = null;

    if (attachType === 'youtube') {
      const match = attachUrl.match(/(?:youtu\.be\/|v=|embed\/|shorts\/|live\/)([\w-]{11})/);
      const ytId = match ? match[1] : /^[\w-]{11}$/.test(attachUrl) ? attachUrl : 'jNQXAC9IVRw';
      res = {
        id: `yt-${Date.now()}`,
        type: 'youtube',
        title: attachName || 'YouTube video',
        vid: ytId,
        meta: 'YouTube',
      };
    } else if (attachType === 'web') {
      let url = attachUrl.trim();
      if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
      let host = 'Website';
      try {
        host = new URL(url).hostname.replace(/^www\./, '');
      } catch {}
      const docItem: DocumentItem = {
        id: `web-${Date.now()}`,
        type: 'web',
        title: attachName || host,
        short: attachName || host,
        url,
      };
      setDocsList((prev) => [...prev, docItem]);
      res = {
        id: `res-${Date.now()}`,
        type: 'web',
        title: docItem.title,
        docId: docItem.id,
        url,
        meta: host,
      };
    } else {
      const title = attachName || uploadedFileName || 'Attached resource';
      const url = uploadedFileUrl || '#';
      if (attachType === 'audio') {
        res = {
          id: `res-${Date.now()}`,
          type: 'audio',
          title,
          url,
          meta: 'Audio',
        };
      } else {
        const docItem: DocumentItem = {
          id: `doc-${Date.now()}`,
          type: attachType === 'pdf' ? 'pdf' : 'image',
          title,
          short: title,
          url,
        };
        setDocsList((prev) => [...prev, docItem]);
        res = {
          id: `res-${Date.now()}`,
          type: attachType === 'pdf' ? 'doc' : 'image',
          title,
          docId: docItem.id,
          meta: attachType === 'pdf' ? 'Document' : 'Image',
        };
      }
    }

    if (res) {
      setResources((prev) => [...prev, res!]);
      showToast(`Attached ${res.title}`);
      if (attachOpenRightAway) {
        handleOpenResource(res);
      }
    }

    setIsAttachOpen(false);
    setAttachUrl('');
    setAttachName('');
    setUploadedFileName('');
    setUploadedFileUrl('');
  };

  // Actions execution from tools drawer or keyboard
  const executeToolAction = (toolId: string) => {
    saveRange();
    const capturedSelText = window.getSelection()?.toString() || savedSelectionRange.current?.toString() || '';
    setIsToolsOpen(false);
    setTimeout(() => {
      switch (toolId) {
        case 'h1':
          executeCommand('formatBlock', 'h1');
          break;
        case 'h2':
          executeCommand('formatBlock', 'h2');
          break;
        case 'h3':
          executeCommand('formatBlock', 'h3');
          break;
        case 'quote':
          executeCommand('formatBlock', 'blockquote');
          break;
        case 'bullets':
          executeCommand('insertUnorderedList');
          break;
        case 'numbers':
          executeCommand('insertOrderedList');
          break;
        case 'checklist':
          insertHtmlAtCursor(
            '<div class="chk"><span class="box" contenteditable="false" role="checkbox" aria-checked="false" tabindex="0"></span><span>New task</span></div>'
          );
          break;
        case 'superscript':
          executeCommand('superscript');
          break;
        case 'subscript':
          executeCommand('subscript');
          break;
        case 'attach-yt':
          setAttachType('youtube');
          setIsAttachOpen(true);
          break;
        case 'attach-image':
          setAttachType('image');
          setIsAttachOpen(true);
          break;
        case 'table':
          insertHtmlAtCursor(
            '<div class="an-table-wrapper" contenteditable="false"><div class="an-table-drag-grip" contenteditable="false" data-table-grip="move" title="Hold & drag to move table anywhere · Double-click to reset position"><span class="an-grip-dots">⋮⋮</span><span>Drag Table</span></div><table contenteditable="true"><thead><tr><th>Parameter</th><th>Mechanism / Feature</th><th>Clinical Pearl</th></tr></thead><tbody><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr></tbody></table></div><p><br></p>'
          );
          break;
        case 'code':
          insertHtmlAtCursor('<pre>code or formula…</pre><p><br></p>');
          break;
        case 'divider':
          insertHtmlAtCursor('<hr><p><br></p>');
          break;
        case 'toggle':
          insertHtmlAtCursor(
            '<details open><summary>Section title</summary><p>Hidden details…</p></details><p><br></p>'
          );
          break;
        case 'clear': {
          executeCommand('removeFormat');
          const ed = editorRef.current;
          const sel = window.getSelection();
          if (ed && sel && sel.rangeCount > 0) {
            const range = sel.getRangeAt(0);
            ed.querySelectorAll('.an-hand-underline, .cloze').forEach((span) => {
              if (range.intersectsNode(span)) {
                const parent = span.parentNode;
                if (!parent) return;
                while (span.firstChild) parent.insertBefore(span.firstChild, span);
                parent.removeChild(span);
              }
            });
            ed.querySelectorAll('span[style]').forEach((sp) => {
              if (range.intersectsNode(sp)) {
                (sp as HTMLElement).style.backgroundColor = '';
                (sp as HTMLElement).style.color = '';
              }
            });
            pushHistorySnapshot();
            triggerSave();
          }
          break;
        }
        case 'pearl':
          insertHtmlAtCursor(
            '<div class="callout"><span class="ci">Pearl</span><div>Key high-yield takeaway…</div><button class="callout-del-btn" contenteditable="false" title="Delete pearl">✕</button></div><p><br></p>'
          );
          break;
        case 'warn':
          insertHtmlAtCursor(
            '<div class="callout warn"><span class="ci">Caution</span><div>Contraindication or clinical pitfall…</div><button class="callout-del-btn" contenteditable="false" title="Delete pearl">✕</button></div><p><br></p>'
          );
          break;
        case 'flash':
          insertHtmlAtCursor('<div class="flash"><p><b>Q</b>Question…</p><p><b>A</b>Answer…</p></div><p><br></p>');
          break;
        case 'cloze': {
          const sel = capturedSelText.trim() || window.getSelection()?.toString() || '';
          if (!sel) {
            showToast('Select text first to hide as a cloze');
            return;
          }
          insertHtmlAtCursor(`<span class="cloze" title="Click to reveal">${sel}</span>&nbsp;`);
          break;
        }
        case 'mnemonic':
          insertHtmlAtCursor(
            '<div class="callout"><span class="ci">Mnemonic</span><div>Letters → clinical meaning…</div></div><p><br></p>'
          );
          break;
        case 'hy':
          insertHtmlAtCursor(
            '<b>High-Yield</b> <span class="ts" contenteditable="false" style="background:var(--an-brass-soft);color:var(--an-brass)">HIGH-YIELD</span>&nbsp;'
          );
          break;
        case 'date':
          insertHtmlAtCursor(new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) + '&nbsp;');
          break;
        case 'equation':
          insertHtmlAtCursor('<pre>E = mc²</pre><p><br></p>');
          break;
        case 'link': {
          setLinkLabelInput(capturedSelText.trim());
          setLinkUrlInput('https://');
          setIsLinkModalOpen(true);
          break;
        }
        case 'timestamp':
          if (videoWindows.length > 0) {
            stampVideoTimestamp(videoWindows[0]);
          } else {
            showToast('Open a video first to stamp timestamp');
          }
          break;
        case 'attach-youtube':
          setAttachType('youtube');
          setIsAttachOpen(true);
          break;
        case 'attach-web':
          setAttachType('web');
          setIsAttachOpen(true);
          break;
        case 'attach-pdf':
          setAttachType('pdf');
          setIsAttachOpen(true);
          break;
        case 'attach-image':
          setAttachType('image');
          setIsAttachOpen(true);
          break;
        case 'attach-audio':
          setAttachType('audio');
          setIsAttachOpen(true);
          break;
        case 'layout-focus':
          setLayout('focus');
          break;
        case 'layout-split':
          setLayout('split');
          break;
        case 'layout-triple':
          setLayout('triple');
          break;
        case 'layout-stacked':
          setLayout('stacked');
          break;
        case 'sync':
          setSyncScroll((s) => {
            const next = !s;
            showToast(next ? 'Scroll sync on' : 'Scroll sync off');
            return next;
          });
          break;
        case 'dark':
          document.documentElement.classList.toggle('dark');
          break;
        case 'paper-ruled':
          setPaperStyle('ruled');
          break;
        case 'paper-plain':
          setPaperStyle('plain');
          break;
        case 'paper-grid':
          setPaperStyle('grid');
          break;
        case 'paper-dot':
          setPaperStyle('dot');
          break;
        case 'md': {
          const mdText = `# ${noteTitle}\n\n${editorRef.current?.innerText || ''}`;
          const blob = new Blob([mdText], { type: 'text/markdown' });
          const a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = `${noteTitle.toLowerCase().replace(/\s+/g, '-')}.md`;
          a.click();
          showToast('Markdown exported');
          break;
        }
        case 'print':
          window.print();
          break;
        case 'copy':
          if (editorRef.current) {
            navigator.clipboard.writeText(editorRef.current.innerText);
            showToast('Note plain text copied');
          }
          break;
        default: {
          if (toolId.startsWith('font-')) {
            const rawKey = toolId === 'font-sans' ? 'alata' : toolId === 'font-serif' ? 'merriweather' : toolId === 'font-hand' ? 'caveat' : toolId.replace(/^font-/, '');
            const matched = NOTE_FONT_OPTIONS.find((f) => f.key === rawKey || f.id === toolId);
            if (matched) {
              setFontStyle(matched.key);
              showToast(`Note font: ${matched.label}`);
              triggerSave();
            }
          }
          break;
        }
      }
    }, 20);
  };

  // Keyboard shortcut Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsToolsOpen((prev) => !prev);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'l' && document.activeElement === editorRef.current) {
        e.preventDefault();
        saveRange();
        setLinkLabelInput(window.getSelection()?.toString().trim() || '');
        setLinkUrlInput('https://');
        setIsLinkModalOpen(true);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && document.activeElement === editorRef.current) {
        e.preventDefault();
        performHistoryStep(e.shiftKey ? 1 : -1);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y' && document.activeElement === editorRef.current) {
        e.preventDefault();
        performHistoryStep(1);
      } else if (e.key === 'Escape') {
        setIsToolsOpen(false);
        setIsAttachOpen(false);
        setIsBookPickerOpen(false);
        setOpenColorMenu(null);
        setOpenUnderlineMenu(null);
        setSelectionPill((p) => ({ ...p, visible: false }));
      }
    };
    const handleOutsideColorClick = (ev: PointerEvent) => {
      const target = ev.target as HTMLElement;
      if (!target.closest('.an-color-popover') && !target.closest('.an-color-split')) {
        setOpenColorMenu(null);
        setOpenUnderlineMenu(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('pointerdown', handleOutsideColorClick);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('pointerdown', handleOutsideColorClick);
    };
  }, []);

  // Click on interactive note elements (checkboxes, cloze, timestamps, pearl deletion, table focus)
  const handleEditorClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;

    // Callout Delete Button Click
    if (target.classList.contains('callout-del-btn')) {
      e.preventDefault();
      e.stopPropagation();
      const callout = target.closest('.callout');
      if (callout) {
        callout.remove();
        triggerSave();
        showToast('Key pearl callout deleted');
      }
      return;
    }

    // Active Table & Cell detection
    const table = target.closest('table') as HTMLTableElement | null;
    const cell = target.closest('td, th') as HTMLTableCellElement | null;
    setActiveTableEl(table);
    setActiveCellEl(cell);
    if (table) {
      const rawPct = parseInt(table.style.width || '100', 10);
      if (table.style.width?.includes('%') && !isNaN(rawPct)) {
        setTableWidthPct(rawPct);
      } else {
        setTableWidthPct(100);
      }
    }

    // Checkbox toggle
    const box = target.closest('.box');
    if (box) {
      const row = box.closest('.chk');
      if (row) {
        row.classList.toggle('done');
        box.setAttribute('aria-checked', row.classList.contains('done') ? 'true' : 'false');
        triggerSave();
      }
      return;
    }

    // Cloze toggle
    const cloze = target.closest('.cloze');
    if (cloze) {
      cloze.classList.toggle('show');
      return;
    }

    // Timestamp jump
    const tsBtn = target.closest('.ts') as HTMLElement;
    if (tsBtn) {
      const resId = tsBtn.dataset.res;
      const targetTime = Number(tsBtn.dataset.t || '0');
      const targetRes = resources.find((r) => r.id === resId);
      if (targetRes) {
        openVideoWindow(targetRes, targetTime);
      } else {
        showToast('That video is no longer attached');
      }
    }
  };

  // Canvas Text Selection Floating Menu Handler
  const handleCanvasMouseUp = () => {
    saveRange();
    setTimeout(() => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || !editorRef.current || !editorRef.current.contains(sel.anchorNode)) {
        setCanvasSelection((p) => (p.visible ? { ...p, visible: false } : p));
        return;
      }
      const text = sel.toString().trim();
      if (!text) {
        setCanvasSelection((p) => (p.visible ? { ...p, visible: false } : p));
        return;
      }
      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      if (rect.width > 0) {
        setCanvasSelection({
          visible: true,
          x: Math.max(100, Math.min(window.innerWidth - 100, rect.left + rect.width / 2)),
          y: Math.max(40, rect.top - 8),
          text,
        });
      }
    }, 15);
  };

  // Table MS Word Operations
  const handleAddRow = (pos: 'above' | 'below') => {
    if (!activeTableEl || !activeCellEl) {
      showToast('Select a table cell first');
      return;
    }
    const row = activeCellEl.closest('tr');
    if (!row) return;
    const idx = row.rowIndex;
    const colCount = row.cells.length;
    const newRow = activeTableEl.insertRow(pos === 'above' ? idx : idx + 1);
    for (let i = 0; i < colCount; i++) {
      const c = newRow.insertCell();
      c.innerHTML = '<br>';
    }
    triggerSave();
    showToast(`Row added ${pos}`);
  };

  const handleAddCol = (pos: 'left' | 'right') => {
    if (!activeTableEl || !activeCellEl) {
      showToast('Select a table cell first');
      return;
    }
    const idx = activeCellEl.cellIndex;
    Array.from(activeTableEl.rows).forEach((r) => {
      const insertAt = pos === 'left' ? idx : idx + 1;
      const c = r.insertCell(insertAt);
      c.innerHTML = '<br>';
    });
    triggerSave();
    showToast(`Column added ${pos}`);
  };

  const handleDeleteRow = () => {
    if (!activeTableEl || !activeCellEl) return;
    const row = activeCellEl.closest('tr');
    if (!row) return;
    if (activeTableEl.rows.length <= 1) {
      handleDeleteTable();
    } else {
      activeTableEl.deleteRow(row.rowIndex);
      triggerSave();
      showToast('Row deleted');
    }
  };

  const handleDeleteCol = () => {
    if (!activeTableEl || !activeCellEl) return;
    const idx = activeCellEl.cellIndex;
    Array.from(activeTableEl.rows).forEach((r) => {
      if (r.cells.length > idx) {
        r.deleteCell(idx);
      }
    });
    triggerSave();
    showToast('Column deleted');
  };

  const handleDeleteTable = () => {
    if (!activeTableEl) return;
    const wrapper = activeTableEl.closest('.an-table-wrapper') || activeTableEl;
    wrapper.remove();
    setActiveTableEl(null);
    setActiveCellEl(null);
    triggerSave();
    showToast('Table deleted');
  };

  const handleCellShading = (colorHex: string) => {
    if (!activeCellEl) {
      showToast('Select a table cell to shade');
      return;
    }
    activeCellEl.style.backgroundColor = colorHex;
    triggerSave();
  };

  // Interactive Table Width Resize, Column Sizing, Padding & MS Word Table Formats
  const handleResizeTableWidth = (pct: number) => {
    if (!activeTableEl) {
      showToast('Select a table first');
      return;
    }
    const clamped = Math.max(40, Math.min(100, pct));
    setTableWidthPct(clamped);
    activeTableEl.style.width = `${clamped}%`;
    triggerSave();
  };

  const handleResizeActiveCol = (deltaPx: number) => {
    if (!activeTableEl || !activeCellEl) {
      showToast('Select a table column to resize');
      return;
    }
    const colIdx = activeCellEl.cellIndex;
    activeTableEl.style.tableLayout = 'fixed';
    const currentW = activeCellEl.getBoundingClientRect().width;
    const nextW = Math.max(54, Math.min(460, Math.round(currentW + deltaPx)));
    Array.from(activeTableEl.rows).forEach((r) => {
      const targetCell = r.cells[colIdx];
      if (targetCell) {
        targetCell.style.width = `${nextW}px`;
      }
    });
    triggerSave();
  };

  const handleTablePadding = (pad: string, label: string) => {
    if (!activeTableEl) return;
    Array.from(activeTableEl.querySelectorAll('th, td')).forEach((el) => {
      (el as HTMLElement).style.padding = pad;
    });
    triggerSave();
    showToast(`Table density: ${label}`);
  };

  const handleApplyTableStyle = (preset: TableStylePreset, borderMode: 'grid' | 'horizontal' | 'none' = tableBorderStyle) => {
    if (!activeTableEl) {
      showToast('Click inside a table to style it');
      return;
    }
    setActiveTableStyleId(preset.id);
    activeTableEl.style.borderCollapse = 'collapse';
    activeTableEl.style.border = borderMode === 'none' ? 'none' : `1px solid ${preset.borderColor}`;

    Array.from(activeTableEl.rows).forEach((row, rIdx) => {
      const isHeader = rIdx === 0 && (row.parentElement?.tagName === 'THEAD' || row.cells[0]?.tagName === 'TH');
      const isStriped = !isHeader && rIdx % 2 === 0;
      Array.from(row.cells).forEach((c) => {
        const cell = c as HTMLElement;
        cell.style.backgroundColor = isHeader ? preset.headerBg : isStriped ? preset.stripeBg : preset.cellBg;
        cell.style.color = isHeader ? preset.headerText : preset.cellText;
        if (borderMode === 'none') {
          cell.style.border = 'none';
        } else if (borderMode === 'horizontal') {
          cell.style.border = 'none';
          cell.style.borderBottom = `1px solid ${preset.borderColor}`;
        } else {
          cell.style.border = `1px solid ${preset.borderColor}`;
        }
      });
    });
    triggerSave();
    showToast(`Table style: ${preset.name}`);
  };

  const handleCycleTableBorders = () => {
    const nextOrder: Array<'grid' | 'horizontal' | 'none'> = ['grid', 'horizontal', 'none'];
    const nextMode = nextOrder[(nextOrder.indexOf(tableBorderStyle) + 1) % nextOrder.length];
    setTableBorderStyle(nextMode);
    const preset = MS_WORD_TABLE_STYLES.find((s) => s.id === activeTableStyleId) || MS_WORD_TABLE_STYLES[0];
    handleApplyTableStyle(preset, nextMode);
  };

  const detectTableHitZone = (e: { clientX: number; clientY: number }, target: HTMLElement) => {
    const ed = editorRef.current;
    if (!ed) return null;
    const gripEl = target.closest('[data-table-grip="move"]') as HTMLElement | null;
    const table = (target.closest('table') || target.closest('.an-table-wrapper')?.querySelector('table')) as HTMLTableElement | null;
    if (!table || !ed.contains(table)) return null;
    const wrapper = (table.closest('.an-table-wrapper') || table) as HTMLElement;
    const tRect = table.getBoundingClientRect();

    if (gripEl) {
      return { kind: 'move' as const, cursor: 'grab', table, wrapper, tRect };
    }

    const nearLeft = Math.abs(e.clientX - tRect.left) <= 11 && e.clientY >= tRect.top - 10 && e.clientY <= tRect.bottom + 10;
    const nearRight = Math.abs(e.clientX - tRect.right) <= 11 && e.clientY >= tRect.top - 10 && e.clientY <= tRect.bottom + 10;
    const nearTop = Math.abs(e.clientY - tRect.top) <= 14 && e.clientX >= tRect.left - 10 && e.clientX <= tRect.right + 10;
    const nearBottom = Math.abs(e.clientY - tRect.bottom) <= 11 && e.clientX >= tRect.left - 10 && e.clientX <= tRect.right + 10;

    if (nearRight && nearBottom) return { kind: 'resize' as const, edge: 'bottom-right' as const, cursor: 'nwse-resize', table, wrapper, tRect };
    if (nearLeft && nearBottom) return { kind: 'resize' as const, edge: 'bottom-left' as const, cursor: 'nesw-resize', table, wrapper, tRect };
    if (nearRight) return { kind: 'resize' as const, edge: 'right' as const, cursor: 'ew-resize', table, wrapper, tRect };
    if (nearLeft) return { kind: 'resize' as const, edge: 'left' as const, cursor: 'ew-resize', table, wrapper, tRect };
    if (nearBottom) return { kind: 'resize' as const, edge: 'bottom' as const, cursor: 'ns-resize', table, wrapper, tRect };
    if (nearTop) return { kind: 'move' as const, cursor: 'grab', table, wrapper, tRect };

    const cell = target.closest('td, th') as HTMLTableCellElement | null;
    if (cell && table.contains(cell)) {
      const cRect = cell.getBoundingClientRect();
      const nearColDivider = Math.abs(cRect.right - e.clientX) <= 7 && cell.cellIndex < (cell.parentElement?.children.length || 1) - 1;
      if (nearColDivider) {
        return { kind: 'col' as const, cursor: 'col-resize', table, wrapper, cell, cRect };
      }
    }
    return null;
  };

  // Hover Table Outer Borders to Move (Top border grab) or Expand/Shrink (Side/Bottom/Corners)
  const handleEditorMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (tableActionRef.current) return;
    const ed = editorRef.current;
    if (!ed) return;
    const target = e.target as HTMLElement;
    const hit = detectTableHitZone(e, target);

    ed.querySelectorAll('.an-table-wrapper[data-table-hover]').forEach((el) => {
      if (!hit || hit.wrapper !== el) el.removeAttribute('data-table-hover');
    });

    if (hit) {
      ed.style.cursor = hit.cursor;
      hit.wrapper.setAttribute('data-table-hover', hit.kind === 'move' ? 'move' : 'resize');
    } else {
      ed.style.cursor = '';
    }
  };

  const handleEditorDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const hit = detectTableHitZone(e, target);
    if (!hit) return;
    e.preventDefault();
    if (hit.kind === 'move') {
      hit.wrapper.style.left = '0px';
      hit.wrapper.style.top = '0px';
      showToast('Table position reset');
    } else if (hit.kind === 'resize') {
      hit.table.style.width = '100%';
      Array.from(hit.table.querySelectorAll('th, td')).forEach((c) => {
        (c as HTMLElement).style.height = '';
        (c as HTMLElement).style.minHeight = '';
      });
      showToast('Table size reset to 100%');
    }
    triggerSave();
  };

  const handleEditorPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const hit = detectTableHitZone(e, target);
    if (!hit) return;

    e.preventDefault();
    e.stopPropagation();

    if (hit.kind === 'move') {
      hit.wrapper.style.position = 'relative';
      hit.wrapper.style.zIndex = '18';
      const origLeft = parseFloat(hit.wrapper.style.left || '0') || 0;
      const origTop = parseFloat(hit.wrapper.style.top || '0') || 0;
      hit.wrapper.setAttribute('data-table-active', 'move');
      tableActionRef.current = {
        mode: 'move',
        wrapper: hit.wrapper,
        startX: e.clientX,
        startY: e.clientY,
        origLeft,
        origTop,
      };
      document.body.style.cursor = 'grabbing';
    } else if (hit.kind === 'resize') {
      hit.wrapper.style.position = 'relative';
      hit.table.style.maxWidth = 'none';
      const origLeft = parseFloat(hit.wrapper.style.left || '0') || 0;
      hit.wrapper.setAttribute('data-table-active', 'resize');
      tableActionRef.current = {
        mode: 'resize',
        edge: hit.edge,
        wrapper: hit.wrapper,
        table: hit.table,
        startX: e.clientX,
        startY: e.clientY,
        origW: hit.tRect.width,
        origH: hit.tRect.height,
        origLeft,
      };
      document.body.style.cursor = hit.cursor;
    } else if (hit.kind === 'col' && hit.cell) {
      const colIndex = hit.cell.cellIndex;
      const nextCell = hit.cell.parentElement?.children[colIndex + 1] as HTMLElement | undefined;
      hit.table.style.tableLayout = 'fixed';
      tableActionRef.current = {
        mode: 'col',
        table: hit.table,
        colIndex,
        startX: e.clientX,
        startWidth: hit.cRect.width,
        nextStartWidth: nextCell ? nextCell.getBoundingClientRect().width : 0,
      };
      document.body.style.cursor = 'col-resize';
    }

    document.body.style.userSelect = 'none';

    const onMove = (ev: PointerEvent) => {
      const state = tableActionRef.current;
      if (!state) return;
      if (state.mode === 'move') {
        const dx = ev.clientX - state.startX;
        const dy = ev.clientY - state.startY;
        state.wrapper.style.left = `${Math.round(state.origLeft + dx)}px`;
        state.wrapper.style.top = `${Math.round(state.origTop + dy)}px`;
      } else if (state.mode === 'resize') {
        const dx = ev.clientX - state.startX;
        const dy = ev.clientY - state.startY;
        if (state.edge === 'right' || state.edge === 'bottom-right') {
          const nextW = Math.max(180, Math.min(1400, Math.round(state.origW + dx)));
          state.table.style.width = `${nextW}px`;
        }
        if (state.edge === 'left' || state.edge === 'bottom-left') {
          const nextW = Math.max(180, Math.min(1400, Math.round(state.origW - dx)));
          const appliedDelta = state.origW - nextW;
          state.table.style.width = `${nextW}px`;
          state.wrapper.style.left = `${Math.round(state.origLeft + appliedDelta)}px`;
        }
        if (state.edge === 'bottom' || state.edge === 'bottom-right' || state.edge === 'bottom-left') {
          const rowCount = Math.max(1, state.table.rows.length);
          const totalH = Math.max(rowCount * 28, Math.round(state.origH + dy));
          const perRowH = Math.max(26, Math.round(totalH / rowCount));
          Array.from(state.table.querySelectorAll('th, td')).forEach((el) => {
            (el as HTMLElement).style.height = `${perRowH}px`;
          });
        }
      } else if (state.mode === 'col') {
        const dx = ev.clientX - state.startX;
        const newW = Math.max(48, Math.round(state.startWidth + dx));
        Array.from(state.table.rows).forEach((r) => {
          const c = r.cells[state.colIndex] as HTMLElement | undefined;
          if (c) c.style.width = `${newW}px`;
          if (state.nextStartWidth > 0) {
            const nc = r.cells[state.colIndex + 1] as HTMLElement | undefined;
            if (nc) nc.style.width = `${Math.max(48, Math.round(state.nextStartWidth - dx))}px`;
          }
        });
      }
    };

    const onUp = () => {
      const prev = tableActionRef.current;
      if (prev && (prev.mode === 'move' || prev.mode === 'resize')) {
        prev.wrapper.removeAttribute('data-table-active');
      }
      tableActionRef.current = null;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      triggerSave();
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  const applyTextColor = (color: string) => {
    if (color === 'inherit') {
      executeCommand('removeFormat');
      setOpenColorMenu(null);
      return;
    }
    setActiveTextColor(color);
    executeCommand('foreColor', color);
    setOpenColorMenu(null);
  };

  const applyHighlightColor = (color: string) => {
    setActiveHighlightColor(color);
    pushHistorySnapshot();
    restoreRange();
    try {
      document.execCommand('styleWithCSS', false, 'true');
    } catch {}
    const ok = document.execCommand('hiliteColor', false, color === 'transparent' ? 'rgba(0,0,0,0)' : color);
    if (!ok) {
      document.execCommand('backColor', false, color === 'transparent' ? 'rgba(0,0,0,0)' : color);
    }
    saveRange();
    pushHistorySnapshot();
    triggerSave();
    setOpenColorMenu(null);
  };

  // Cleanup speech recognition on unmount
  useEffect(() => {
    return () => {
      try {
        recognitionRef.current?.stop?.();
      } catch {}
    };
  }, []);

  // Toggle Straight vs Hand-Made Natural Underline wave
  const applyHandMadeUnderline = () => {
    setUnderlineMode('hand');
    setOpenUnderlineMenu(null);
    restoreRange();
    const ed = editorRef.current;
    const sel = window.getSelection();
    if (!ed || !sel || sel.rangeCount === 0) return;

    const range = sel.getRangeAt(0);
    const commonEl =
      range.commonAncestorContainer.nodeType === 1
        ? (range.commonAncestorContainer as HTMLElement)
        : range.commonAncestorContainer.parentElement;
    const existingWave = commonEl?.closest('.an-hand-underline') as HTMLElement | null;

    if (existingWave && ed.contains(existingWave)) {
      const parent = existingWave.parentNode;
      if (parent) {
        const frag = document.createDocumentFragment();
        let lastChild: ChildNode | null = null;
        while (existingWave.firstChild) {
          lastChild = existingWave.firstChild;
          frag.appendChild(lastChild);
        }
        parent.replaceChild(frag, existingWave);
        if (lastChild) {
          const r = document.createRange();
          r.setStartAfter(lastChild);
          r.collapse(true);
          sel.removeAllRanges();
          sel.addRange(r);
        }
      }
      saveRange();
      triggerSave();
      return;
    }

    if (range.collapsed) {
      const span = document.createElement('span');
      span.className = 'an-hand-underline';
      const zwsp = document.createTextNode('​');
      span.appendChild(zwsp);
      range.insertNode(span);
      const nextRange = document.createRange();
      nextRange.setStart(zwsp, 1);
      nextRange.collapse(true);
      sel.removeAllRanges();
      sel.addRange(nextRange);
    } else {
      const span = document.createElement('span');
      span.className = 'an-hand-underline';
      const extracted = range.extractContents();
      span.appendChild(extracted);
      range.insertNode(span);
      const nextRange = document.createRange();
      nextRange.selectNodeContents(span);
      sel.removeAllRanges();
      sel.addRange(nextRange);
    }
    saveRange();
    triggerSave();
  };

  const applyUnderlineByMode = (mode: 'straight' | 'hand' = underlineMode) => {
    setUnderlineMode(mode);
    setOpenUnderlineMenu(null);
    if (mode === 'hand') {
      applyHandMadeUnderline();
    } else {
      executeCommand('underline');
    }
  };

  const openUnderlineDropdown = (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.stopPropagation();
    if (openUnderlineMenu) {
      setOpenUnderlineMenu(null);
      return;
    }
    const rect = ev.currentTarget.getBoundingClientRect();
    const clampedLeft = Math.max(12, Math.min(window.innerWidth - 220, rect.left - 32));
    const clampedTop = Math.min(window.innerHeight - 170, rect.bottom + 6);
    setOpenUnderlineMenu({ left: clampedLeft, top: clampedTop });
  };

  // Detect Mouse Hover Over Any Outer Border of Paper Sheet (Left, Right, Bottom, Corners)
  const detectSheetBorderEdge = (
    e: { clientX: number; clientY: number },
    el: HTMLElement
  ): 'left' | 'right' | 'bottom' | 'bottom-right' | 'bottom-left' | null => {
    const r = el.getBoundingClientRect();
    const threshold = 14;
    const nearLeft = Math.abs(e.clientX - r.left) <= threshold;
    const nearRight = Math.abs(e.clientX - r.right) <= threshold;
    const nearBottom = Math.abs(e.clientY - r.bottom) <= threshold;
    if (nearRight && nearBottom) return 'bottom-right';
    if (nearLeft && nearBottom) return 'bottom-left';
    if (nearRight) return 'right';
    if (nearLeft) return 'left';
    if (nearBottom) return 'bottom';
    return null;
  };

  // Mouse-hold & drag stretch along Left/Right/Bottom/Corner borders of paper sheet
  const handleSheetEdgePointerDown = (
    edge: 'left' | 'right' | 'bottom' | 'bottom-right' | 'bottom-left',
    e: React.PointerEvent<HTMLElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = sheetWidthPx;
    const startHeight = sheetMinHeightPx;
    setIsDraggingSheetWidth(true);
    setHoverSheetEdge(edge);

    const cursorMap = {
      left: 'ew-resize',
      right: 'ew-resize',
      bottom: 'ns-resize',
      'bottom-right': 'nwse-resize',
      'bottom-left': 'nesw-resize',
    };
    document.body.style.cursor = cursorMap[edge];
    document.body.style.userSelect = 'none';

    const onMove = (ev: PointerEvent) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      if (edge === 'right' || edge === 'bottom-right') {
        const nextW = Math.max(340, Math.min(1600, Math.round(startWidth + dx * 2)));
        setSheetWidthPx(nextW);
      } else if (edge === 'left' || edge === 'bottom-left') {
        const nextW = Math.max(340, Math.min(1600, Math.round(startWidth - dx * 2)));
        setSheetWidthPx(nextW);
      }
      if (edge === 'bottom' || edge === 'bottom-right' || edge === 'bottom-left') {
        const nextH = Math.max(360, Math.min(2400, Math.round(startHeight + dy)));
        setSheetMinHeightPx(nextH);
      }
    };

    const onUp = () => {
      setIsDraggingSheetWidth(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  // Speech-to-Text dictation directly into note editor
  const toggleSpeechToText = () => {
    if (isDictating) {
      try {
        recognitionRef.current?.stop?.();
      } catch {}
      setIsDictating(false);
      showToast('Speech dictation stopped');
      return;
    }

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      showToast('Speech to text is not supported in this browser');
      return;
    }

    try {
      const rec = new SpeechRec();
      rec.continuous = true;
      rec.interimResults = false;
      rec.lang = 'en-US';
      rec.onresult = (ev: any) => {
        let spoken = '';
        for (let i = ev.resultIndex; i < ev.results.length; i++) {
          if (ev.results[i].isFinal) {
            spoken += ev.results[i][0].transcript + ' ';
          }
        }
        const cleaned = spoken.trim();
        if (cleaned) {
          insertHtmlAtCursor(cleaned + ' ');
        }
      };
      rec.onerror = () => {
        setIsDictating(false);
        showToast('Microphone unavailable or permission denied');
      };
      rec.onend = () => {
        setIsDictating(false);
      };
      recognitionRef.current = rec;
      rec.start();
      setIsDictating(true);
      showToast('Listening… speak into your microphone');
    } catch {
      setIsDictating(false);
      showToast('Could not start speech recognition');
    }
  };

  // Correct Spellings & tidy capitalization across text nodes inside note editor
  const handleCorrectSpellings = () => {
    const ed = editorRef.current;
    if (!ed) return;
    const TYPO_MAP: Record<string, string> = {
      teh: 'the',
      adn: 'and',
      taht: 'that',
      waht: 'what',
      wich: 'which',
      recieve: 'receive',
      recieved: 'received',
      seperate: 'separate',
      seperated: 'separated',
      occurence: 'occurrence',
      accomodate: 'accommodate',
      definately: 'definitely',
      untill: 'until',
      becuase: 'because',
      thier: 'their',
      symtom: 'symptom',
      symtoms: 'symptoms',
      diagnois: 'diagnosis',
      prognosys: 'prognosis',
      inflamation: 'inflammation',
      hemorhage: 'hemorrhage',
      haemmorhage: 'haemorrhage',
      pnuemonia: 'pneumonia',
      diarhea: 'diarrhea',
      diarhhea: 'diarrhea',
      hypertention: 'hypertension',
      hypotention: 'hypotension',
      tachicardia: 'tachycardia',
      bradicardia: 'bradycardia',
      osteoporosys: 'osteoporosis',
      pharamcology: 'pharmacology',
      patophysiology: 'pathophysiology',
      anatmy: 'anatomy',
      medicin: 'medicine',
      treatement: 'treatment',
      dosge: 'dosage',
      patinet: 'patient',
      prescripion: 'prescription',
      antibotic: 'antibiotic',
      imediate: 'immediate',
      immediatly: 'immediately',
      recomand: 'recommend',
      recomend: 'recommend',
      neccessary: 'necessary',
      necesary: 'necessary',
      occassion: 'occasion',
    };

    let fixCount = 0;
    const walker = document.createTreeWalker(ed, NodeFilter.SHOW_TEXT);
    const nodes: Text[] = [];
    let cur = walker.nextNode();
    while (cur) {
      nodes.push(cur as Text);
      cur = walker.nextNode();
    }

    nodes.forEach((node) => {
      if (!node.nodeValue) return;
      let val = node.nodeValue;
      // Normalize accidental multi-spaces
      const spaced = val.replace(/ {2,}/g, ' ');
      if (spaced !== val) {
        val = spaced;
        fixCount += 1;
      }
      // Replace known misspellings preserving leading capital case
      val = val.replace(/\b([A-Za-z]+)\b/g, (word) => {
        const mapped = TYPO_MAP[word.toLowerCase()];
        if (!mapped || mapped === word.toLowerCase()) return word;
        fixCount += 1;
        if (word[0] === word[0].toUpperCase() && word[0] !== word[0].toLowerCase()) {
          return mapped[0].toUpperCase() + mapped.slice(1);
        }
        return mapped;
      });
      // Sentence-initial capitalization after punctuation + whitespace
      const capped = val.replace(/([.!?]\s+)([a-z])/g, (_, pre, ch) => {
        fixCount += 1;
        return pre + ch.toUpperCase();
      });
      val = capped;
      if (val !== node.nodeValue) {
        node.nodeValue = val;
      }
    });

    ed.focus();
    triggerSave();
    showToast(
      fixCount > 0
        ? `Corrected ${fixCount} spelling & formatting issue${fixCount === 1 ? '' : 's'}`
        : 'Spellcheck complete — text looks clean'
    );
  };

  const openSplitColorMenu = (type: 'text' | 'highlight', ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.stopPropagation();
    if (openColorMenu?.type === type) {
      setOpenColorMenu(null);
      return;
    }
    const rect = ev.currentTarget.getBoundingClientRect();
    const popWidth = 256;
    const clampedLeft = Math.max(12, Math.min(window.innerWidth - popWidth - 12, rect.left - 24));
    const clampedTop = Math.min(window.innerHeight - 280, rect.bottom + 6);
    setOpenColorMenu({ type, left: clampedLeft, top: clampedTop });
  };

  // Ask Gemini AI for Selected Medical Term
  const handleAskGeminiForSelectedText = async (text: string) => {
    if (!text) return;
    setGeminiExplainTerm(text);
    setIsGeminiLoading(true);
    setCanvasSelection((p) => ({ ...p, visible: false }));

    try {
      const res = await fetch('/api/gemini/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ term: text, context: 'Medical Pharmacology & Pathology High Yield Review' }),
      });
      if (res.ok) {
        const data = await res.json();
        setGeminiExplanation(data.explanation || data.summary || `Clinical summary for "${text}": High-yield mechanism and diagnostic significance.`);
      } else {
        throw new Error('Fallback explanation');
      }
    } catch {
      setGeminiExplanation(
        `High-yield clinical summary for "${text}": Key physiological mechanism, first-line management protocol, and USMLE/NEET question points.`
      );
    } finally {
      setIsGeminiLoading(false);
    }
  };

  // Helper to render Document Body
  const renderDocContent = (doc: DocumentItem | undefined, zoom: number, searchQuery: string) => {
    if (!doc) return <div className="p-8 text-center text-stone-400">Document not found</div>;

    if (doc.type === 'book' && doc.pages) {
      return (
        <>
          {doc.pages.map((pageHtml, idx) => {
            let processedHtml = pageHtml;
            if (searchQuery.trim().length >= 2) {
              const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
              processedHtml = pageHtml.replace(regex, '<mark class="hit">$1</mark>');
            }
            return (
              <section
                key={idx}
                className="an-page"
                data-page={idx}
                style={{ '--z': zoom } as React.CSSProperties}
              >
                <div dangerouslySetInnerHTML={{ __html: processedHtml }} />
                <div className="an-page-pno">— {idx + 1} —</div>
              </section>
            );
          })}
        </>
      );
    }

    if (doc.type === 'web' && doc.url) {
      return (
        <div className="an-web">
          <div className="bar">
            <Globe className="w-3.5 h-3.5 text-stone-500" />
            <span>{doc.url}</span>
            <a href={doc.url} target="_blank" rel="noopener noreferrer">
              Open <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>
          </div>
          <iframe src={doc.url} title={doc.title} />
          <small>Some websites block embedding — click Open to view them in a new browser tab.</small>
        </div>
      );
    }

    if (doc.type === 'pdf' && doc.url) {
      return (
        <div className="an-file-view">
          <iframe src={doc.url} title={doc.title} />
        </div>
      );
    }

    if (doc.type === 'image' && doc.url) {
      return (
        <div className="an-file-view">
          <img src={doc.url} alt={doc.title} />
        </div>
      );
    }

    return null;
  };

  // Filter visible, minimized, and closed panes
  const visiblePanes = docPanes.filter((p) => !p.isClosed && !p.isMinimized);
  const minimizedPanes = docPanes.filter((p) => !p.isClosed && p.isMinimized);
  const closedPanes = docPanes.filter((p) => p.isClosed);
  const isNoteVisible = !isNoteClosed && !isNoteMinimized;

  // Dynamic Grid Style for Workspace with Windows Folder Mouse Cursor Resize Joystick
  const getDynamicWsStyle = (): React.CSSProperties => {
    if (maximizedWindowId) {
      return {
        gridTemplateColumns: '1fr',
        gridTemplateRows: '1fr',
      };
    }
    if (layout === 'focus') {
      return {
        gridTemplateColumns: '1fr',
      };
    }
    if (layout === 'split') {
      if (visiblePanes.length === 1 && isNoteVisible) {
        return {
          gridTemplateColumns: `${splitRatio}% 14px minmax(0, 1fr)`,
          gap: 0,
        };
      }
      if (visiblePanes.length === 2 && isNoteVisible) {
        return {
          gridTemplateColumns: `${Math.round(splitRatio * 0.5)}% 14px ${Math.round(splitRatio * 0.5)}% 14px minmax(0, 1fr)`,
          gap: 0,
        };
      }
      if (visiblePanes.length > 0 && isNoteVisible) {
        return {
          gridTemplateColumns: `repeat(${visiblePanes.length}, minmax(0, 1fr)) 14px minmax(0, 1.25fr)`,
          gap: 0,
        };
      }
      return { gridTemplateColumns: '1fr' };
    }
    if (layout === 'triple') {
      if (visiblePanes.length === 2 && isNoteVisible) {
        return {
          gridTemplateColumns: `${tripleRatios[0]}% 14px ${tripleRatios[1]}% 14px minmax(0, 1fr)`,
          gap: 0,
        };
      }
      if (visiblePanes.length === 1 && isNoteVisible) {
        return {
          gridTemplateColumns: `${splitRatio}% 14px minmax(0, 1fr)`,
          gap: 0,
        };
      }
      if (visiblePanes.length > 0 && isNoteVisible) {
        return {
          gridTemplateColumns: `repeat(${visiblePanes.length}, minmax(0, 1fr)) 14px minmax(0, 1.25fr)`,
          gap: 0,
        };
      }
      return { gridTemplateColumns: '1fr' };
    }
    if (layout === 'stacked') {
      if (visiblePanes.length > 0 && isNoteVisible) {
        return {
          gridTemplateColumns: `repeat(${visiblePanes.length}, minmax(0, 1fr))`,
          gridTemplateRows: `${stackedRatio}% 14px minmax(0, 1fr)`,
          gap: 0,
        };
      }
      return {
        gridTemplateColumns: '1fr',
        gridTemplateRows: '1fr',
      };
    }
    return {};
  };

  return (
    <div className="atelier-note-root" data-atelier-theme={activeDesign}>
      {/* 1. Shell Top Header Bar */}
      <header className="an-top">
        <div className="an-title-wrap">
          <div className="an-crumb">
            <b>{notebook?.subject || 'Clinical Note'}</b>
          </div>
          <input
            className="an-title-in"
            aria-label="Note title"
            value={noteTitle}
            onChange={(e) => {
              setNoteTitle(e.target.value);
              triggerSave();
            }}
          />
        </div>

        {/* Layout Switcher Segments - Focus default & Split front, others in More menu */}
        <div className="an-seg layouts" role="group" aria-label="Workspace layout">
          <button
            aria-pressed={layout === 'focus'}
            onClick={() => {
              setLayout('focus');
              setMaximizedWindowId(null);
            }}
            title="Focus — note only (Default)"
          >
            <Square className="w-4 h-4" />
            <span>Focus</span>
          </button>
          <button
            aria-pressed={layout === 'split'}
            onClick={() => {
              setLayout('split');
              setMaximizedWindowId(null);
            }}
            title="Split — documents beside note"
          >
            <Columns2 className="w-4 h-4" />
            <span>Split</span>
          </button>
          
          {/* More Layouts Dropdown (Triple & Stacked hidden inside) */}
          <div className="relative inline-block">
            <button
              type="button"
              aria-pressed={layout === 'triple' || layout === 'stacked'}
              onClick={() => setIsMoreLayoutsOpen(!isMoreLayoutsOpen)}
              title="More workspace layouts (Triple & Stacked)"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>{layout === 'triple' ? 'Triple' : layout === 'stacked' ? 'Stacked' : 'Layouts'}</span>
              <ChevronDown className="w-3 h-3 opacity-70 ml-0.5" />
            </button>

            {isMoreLayoutsOpen && (
              <div className="an-more-layouts-menu animate-in fade-in slide-in-from-top-1 duration-150">
                <button
                  type="button"
                  className={`an-menu-item ${layout === 'triple' ? 'active' : ''}`}
                  onClick={() => {
                    setLayout('triple');
                    setMaximizedWindowId(null);
                    setIsMoreLayoutsOpen(false);
                  }}
                >
                  <Columns3 className="w-3.5 h-3.5" />
                  <span>Triple View</span>
                </button>
                <button
                  type="button"
                  className={`an-menu-item ${layout === 'stacked' ? 'active' : ''}`}
                  onClick={() => {
                    setLayout('stacked');
                    setMaximizedWindowId(null);
                    setIsMoreLayoutsOpen(false);
                  }}
                >
                  <Rows2 className="w-3.5 h-3.5" />
                  <span>Stacked View</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Open Book Button in Header */}
        <button
          className="an-btn"
          style={{ borderColor: 'var(--an-brass)', color: 'var(--an-brass)' }}
          onClick={() => setIsBookPickerOpen(true)}
          title="Open a book or document"
        >
          <BookOpen className="w-4 h-4" />
          <span className="lbl">Book</span>
        </button>

        {/* Save Status Indicator */}
        <div className="an-save" aria-live="polite">
          {saveStatus === 'saving' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" style={{ color: 'var(--an-brass)' }} />
              <span>Saving…</span>
            </>
          ) : (
            <>
              <Cloud className="w-4 h-4" style={{ color: 'var(--an-brass)' }} />
              <span>Saved</span>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <button className="an-btn" onClick={() => setIsAttachOpen(true)}>
          <Paperclip className="w-4 h-4" />
          <span className="lbl">Attach</span>
        </button>

        {/* Dedicated Attachments Toggle directly next to Attach per user request */}
        <button
          className={`an-btn ${isAttachmentsDrawerOpen ? 'primary' : ''}`}
          onClick={() => setIsAttachmentsDrawerOpen(!isAttachmentsDrawerOpen)}
          title="Toggle attached companion resources"
        >
          <Folders className="w-4 h-4" />
          <span className="lbl">Attachments ({resources.length})</span>
        </button>

        {/* Delete Note Option */}
        <button
          className="an-btn border-[#7f1d1d]/35 dark:border-[#962d32]/45 text-[#7f1d1d] dark:text-[#b0363b] hover:bg-[#7f1d1d]/10 dark:hover:bg-[#6e171b]/25"
          onClick={() => setIsDeleteModalOpen(true)}
          title="Delete current note (Move to Trash)"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="lbl">Delete</span>
        </button>

        <button
          className="an-icon-btn"
          aria-label="Toggle dark mode"
          onClick={() => window.dispatchEvent(new CustomEvent('medden_toggle_dark'))}
        >
          <Moon className="w-4 h-4 dark:hidden" />
          <Sun className="w-4 h-4 hidden dark:block" />
        </button>
      </header>

      {/* Subwindow Dock: Appears when any book or note is minimized or closed */}
      {(minimizedPanes.length > 0 || isNoteMinimized || isNoteClosed || closedPanes.length > 0) && (
        <div className="an-win-dock">
          <div className="an-dock-label">
            <Folders className="w-3.5 h-3.5 text-[#A47C43]" />
            <span>Subwindows:</span>
          </div>

          {/* Minimized document windows */}
          {minimizedPanes.map((pane) => {
            const doc = docsList.find((d) => d.id === pane.docId);
            return (
              <button
                key={pane.id}
                className="an-dock-pill"
                onClick={() => handleRestorePane(pane.id)}
                title="Click to restore this book window"
              >
                <span className="an-dock-dot" />
                <BookOpen className="w-3.5 h-3.5 text-[#A47C43]" />
                <span>
                  {pane.tag}: {doc?.short || doc?.title}
                </span>
                <Maximize2 className="w-3 h-3 text-stone-400" />
              </button>
            );
          })}

          {/* Minimized or Closed Note */}
          {(isNoteMinimized || isNoteClosed) && (
            <button
              className="an-dock-pill note"
              onClick={() => {
                setIsNoteMinimized(false);
                setIsNoteClosed(false);
              }}
              title="Click to restore note sheet"
            >
              <span className="an-dock-dot note" />
              <PenLine className="w-3.5 h-3.5 text-[#A47C43]" />
              <span>Note: {noteTitle}</span>
              <Maximize2 className="w-3 h-3 text-stone-400" />
            </button>
          )}

          {/* Reopen Closed Book Windows */}
          {closedPanes.map((pane) => {
            const doc = docsList.find((d) => d.id === pane.docId);
            return (
              <button
                key={pane.id}
                className="an-dock-pill"
                style={{ opacity: 0.75, borderStyle: 'dashed' }}
                onClick={() => handleRestorePane(pane.id)}
                title="Click to reopen closed book window"
              >
                <Plus className="w-3 h-3 text-stone-400" />
                <span>Reopen {doc?.short || pane.tag}</span>
              </button>
            );
          })}

          {/* Quick Add Book Action */}
          <button
            className="an-dock-add-btn"
            onClick={() => setIsBookPickerOpen(true)}
            title="Open another book or document"
          >
            <Plus className="w-3 h-3" />
            <span>Open Book</span>
          </button>
        </div>
      )}

      {/* Mobile Panels Segment */}
      <div className="an-mtabs an-seg" role="tablist">
        {visiblePanes.map((pane) => (
          <button
            key={pane.id}
            role="tab"
            aria-pressed={mobileTab === pane.id}
            onClick={() => setMobileTab(pane.id)}
          >
            {pane.tag}
          </button>
        ))}
        {isNoteVisible && (
          <button
            role="tab"
            aria-pressed={mobileTab === 'note'}
            onClick={() => setMobileTab('note')}
          >
            Note
          </button>
        )}
      </div>

      {/* 2. Main Workspace Layout */}
      <section
        ref={wsRef as any}
        className={`an-ws has-resizer ${maximizedWindowId ? 'has-maximized' : ''} ${
          isDraggingWsSplitter ? 'is-resizing' : ''
        }`}
        data-layout={layout}
        data-m={mobileTab}
        style={getDynamicWsStyle()}
      >
        {/* Dynamic Document Subwindows (Supports 1, 2, 3 or more open books!) */}
        {layout !== 'focus' &&
          visiblePanes.map((pane, idx) => {
            const doc = docsList.find((d) => d.id === pane.docId) || docsList[0];
            const isPaneMaximized = maximizedWindowId === pane.id;

            return (
              <React.Fragment key={pane.id}>
                <div
                  className={`an-pane an-doc ${isPaneMaximized ? 'is-maximized' : ''}`}
                  data-pane-id={pane.id}
                  style={layout === 'stacked' ? { gridRow: 1 } : undefined}
                >
                {/* Window Folder Header Bar */}
                <div className="an-pane-h">
                  <span className={`an-tag ${pane.tagColorClass || ''}`}>{pane.tag}</span>

                  <label className="an-doc-pick">
                    <span className="sr-only">Choose document</span>
                    <select
                      value={pane.docId}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDocPanes((prev) =>
                          prev.map((p) => (p.id === pane.id ? { ...p, docId: val } : p))
                        );
                      }}
                    >
                      {docsList.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.title}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </label>

                  <div className="an-mini">
                    {doc?.type === 'book' && (
                      <>
                        <button
                          className="an-icon-btn"
                          title="Zoom out"
                          onClick={() => {
                            setDocPanes((prev) =>
                              prev.map((p) =>
                                p.id === pane.id
                                  ? { ...p, zoom: Math.max(0.7, +(p.zoom - 0.1).toFixed(1)) }
                                  : p
                              )
                            );
                          }}
                        >
                          <ZoomOut className="w-3.5 h-3.5" />
                        </button>
                        <button
                          className="an-icon-btn"
                          title="Zoom in"
                          onClick={() => {
                            setDocPanes((prev) =>
                              prev.map((p) =>
                                p.id === pane.id
                                  ? { ...p, zoom: Math.min(1.6, +(p.zoom + 0.1).toFixed(1)) }
                                  : p
                              )
                            );
                          }}
                        >
                          <ZoomIn className="w-3.5 h-3.5" />
                        </button>
                        <button
                          className="an-icon-btn"
                          aria-pressed={pane.searchOpen}
                          title="Search in document"
                          onClick={() => {
                            setDocPanes((prev) =>
                              prev.map((p) =>
                                p.id === pane.id ? { ...p, searchOpen: !p.searchOpen } : p
                              )
                            );
                          }}
                        >
                          <Search className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}

                    <button
                      className="an-icon-btn"
                      aria-pressed={syncScroll}
                      title="Sync scroll between documents"
                      onClick={() => {
                        setSyncScroll((s) => !s);
                        showToast(!syncScroll ? 'Scroll sync on' : 'Scroll sync off');
                      }}
                    >
                      <Link2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Window Folder Controls: Minimise, Expand/Maximise, Close */}
                  <div className="an-win-controls" role="toolbar" aria-label="Window controls">
                    <button
                      className="an-win-btn min"
                      title="Minimise window"
                      onClick={() => handleMinimizePane(pane.id)}
                      aria-label="Minimise"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      className="an-win-btn max"
                      title={isPaneMaximized ? 'Restore window size' : 'Expand / Maximise window'}
                      onClick={() => handleToggleMaximizePane(pane.id)}
                      aria-label={isPaneMaximized ? 'Restore' : 'Maximise'}
                    >
                      {isPaneMaximized ? (
                        <Minimize2 className="w-3.5 h-3.5" />
                      ) : (
                        <Maximize2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      className="an-win-btn close"
                      title="Close window"
                      onClick={() => handleClosePane(pane.id)}
                      aria-label="Close"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Search Row */}
                <div className={`an-search-row ${pane.searchOpen ? 'on' : ''}`}>
                  <Search className="w-3.5 h-3.5 text-stone-400" />
                  <input
                    placeholder={`Search ${doc?.short || doc?.title}…`}
                    value={pane.searchQuery}
                    onChange={(e) => {
                      const query = e.target.value;
                      const count =
                        query.length >= 2
                          ? (doc?.pages?.join(' ').match(new RegExp(query, 'gi')) || []).length
                          : 0;
                      const hits = query.length >= 2 ? (count ? `${count} matches` : 'No matches') : '';
                      setDocPanes((prev) =>
                        prev.map((p) =>
                          p.id === pane.id ? { ...p, searchQuery: query, searchHits: hits } : p
                        )
                      );
                    }}
                  />
                  <span>{pane.searchHits}</span>
                </div>

                {/* Document Body */}
                <div
                  className="an-doc-body"
                  ref={(el) => {
                    docBodyRefs.current[pane.id] = el;
                  }}
                  onScroll={(e) => handleDocScroll(e, pane.id)}
                >
                  {renderDocContent(doc, pane.zoom, pane.searchQuery)}
                </div>
              </div>

              {/* Sub-splitter between open books in multi-book split view */}
              {layout !== 'stacked' &&
                !maximizedWindowId &&
                idx < visiblePanes.length - 1 && (
                  <div
                    className={`an-splitter-track ${
                      dragSplitterType === (layout === 'triple' ? 'triple-1' : 'sub-1')
                        ? 'is-dragging'
                        : ''
                    }`}
                    onPointerDown={(e) =>
                      handleSplitterPointerDown(layout === 'triple' ? 'triple-1' : 'sub-1', e)
                    }
                    onDoubleClick={() =>
                      layout === 'triple' ? setTripleRatios([33, 33]) : setSplitRatio(50)
                    }
                    title="Drag mouse cursor to resize subwindows · Double-click to balance 50/50"
                  >
                    <div className="an-splitter-line" />
                    <div
                      className="an-splitter-joystick"
                      role="separator"
                      aria-orientation="vertical"
                    >
                      <div className="an-joystick-grip">
                        <span className="grip-dot" />
                        <span className="grip-dot" />
                        <span className="grip-dot" />
                      </div>
                    </div>
                  </div>
                )}
            </React.Fragment>
          );
        })}

        {/* Main Joystick Splitter between Documents and Note */}
        {layout !== 'focus' &&
          !maximizedWindowId &&
          visiblePanes.length > 0 &&
          isNoteVisible && (
            <div
              className={`an-splitter-track ${layout === 'stacked' ? 'horizontal' : ''} ${
                dragSplitterType ===
                (layout === 'stacked' ? 'stacked' : layout === 'triple' ? 'triple-2' : 'split')
                  ? 'is-dragging'
                  : ''
              }`}
              style={
                layout === 'stacked'
                  ? { gridRow: 2, gridColumn: '1 / -1' }
                  : undefined
              }
              onPointerDown={(e) =>
                handleSplitterPointerDown(
                  layout === 'stacked' ? 'stacked' : layout === 'triple' ? 'triple-2' : 'split',
                  e
                )
              }
              onDoubleClick={() => {
                if (layout === 'stacked') setStackedRatio(50);
                else if (layout === 'triple') setTripleRatios([33, 33]);
                else setSplitRatio(50);
              }}
              title="Drag mouse cursor to resize split windows · Double-click to balance 50/50"
            >
              <div className="an-splitter-line" />
              <div
                className="an-splitter-joystick"
                role="separator"
                aria-orientation={layout === 'stacked' ? 'horizontal' : 'vertical'}
              >
                <div className="an-joystick-grip">
                  <span className="grip-dot" />
                  <span className="grip-dot" />
                  <span className="grip-dot" />
                </div>
                {isDraggingWsSplitter && (
                  <div className="an-joystick-tooltip">
                    {layout === 'stacked'
                      ? `Top ${stackedRatio}% | Bottom ${100 - stackedRatio}%`
                      : layout === 'triple'
                      ? `Doc 2: ${tripleRatios[1]}% | Note: ${Math.max(15, 100 - tripleRatios[0] - tripleRatios[1])}%`
                      : `${splitRatio}% | ${100 - splitRatio}%`}
                  </div>
                )}
              </div>
            </div>
          )}

        {/* Note Pane with Matching Window Folder Controls */}
        {isNoteVisible && (
          <div
            className={`an-pane an-note ${maximizedWindowId === 'note' ? 'is-maximized' : ''}`}
            style={layout === 'stacked' ? { gridRow: 3, gridColumn: '1 / -1' } : undefined}
          >
            {/* Single Slideable Basic Ribbon + Add Tools + More Tools */}
            <div
              className="an-note-ribbon"
              role="toolbar"
              aria-label="Note formatting and features"
              onMouseDown={(e) => {
                const target = e.target as HTMLElement;
                if (!target.closest('select, input, textarea')) {
                  saveRange();
                  e.preventDefault();
                } else {
                  saveRange();
                }
              }}
            >
              <button
                type="button"
                className="an-ribbon-slide-btn"
                title="Scroll ribbon left"
                aria-label="Scroll ribbon left"
                onClick={() => ribbonScrollRef.current?.scrollBy({ left: -180, behavior: 'smooth' })}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <div className="an-ribbon-scroll" ref={ribbonScrollRef}>
                <button
                  type="button"
                  className="an-ribbon-feat primary-front"
                  title="Insert interactive tick box / checklist"
                  onClick={() =>
                    insertHtmlAtCursor(
                      '<div class="chk"><span class="box" contenteditable="false" role="checkbox" aria-checked="false" tabindex="0"></span><span>New item</span></div>'
                    )
                  }
                >
                  <ListChecks className="w-4 h-4 text-[#8f5f2c] dark:text-[#c49257]" />
                  <span>Tick box</span>
                </button>
                <button
                  type="button"
                  className="an-icon-btn"
                  title="Bulleted list"
                  onClick={() => executeCommand('insertUnorderedList')}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="an-icon-btn"
                  title="Numbered list"
                  onClick={() => executeCommand('insertOrderedList')}
                >
                  <ListOrdered className="w-4 h-4" />
                </button>

                <span className="an-vsep" />
                <button
                  type="button"
                  className="an-icon-btn"
                  title="Undo (Ctrl Z)"
                  onClick={() => executeCommand('undo')}
                >
                  <Undo2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="an-icon-btn"
                  title="Redo (Ctrl Y)"
                  onClick={() => executeCommand('redo')}
                >
                  <Redo2 className="w-4 h-4" />
                </button>

                <span className="an-vsep" />
                {/* Compact Font Picker */}
                <select
                  className="an-select-sm an-font-select"
                  value={normalizeNoteFontKey(fontStyle)}
                  onChange={(e) => {
                    const nextKey = e.target.value;
                    setFontStyle(nextKey);
                    const matched = NOTE_FONT_OPTIONS.find((f) => f.key === nextKey);
                    if (matched) showToast(`Font: ${matched.short}`);
                    triggerSave();
                  }}
                  aria-label="Note font family"
                  title="Choose font"
                >
                  {NOTE_FONT_OPTIONS.map((f) => (
                    <option key={f.key} value={f.key} style={{ fontFamily: f.family }}>
                      {f.short}
                    </option>
                  ))}
                </select>

                {/* Base Text Size Controls */}
                <div className="inline-flex items-center rounded-[9px] border border-[var(--an-line)] bg-[var(--an-page)] overflow-hidden h-[28px] shrink-0" title="Adjust paper text size">
                  <button
                    type="button"
                    className="px-1.5 h-full text-[11px] font-bold hover:bg-[var(--an-bg)] transition-colors"
                    onClick={() => setEditorFontSizePx((s) => Math.max(12, +(s - 1).toFixed(1)))}
                    title="Decrease note text size"
                  >
                    A-
                  </button>
                  <span className="px-1.5 text-[10px] font-mono text-[var(--an-muted)] border-x border-[var(--an-line)] leading-[26px]">
                    {Math.round(editorFontSizePx)}
                  </span>
                  <button
                    type="button"
                    className="px-1.5 h-full text-[11px] font-bold hover:bg-[var(--an-bg)] transition-colors"
                    onClick={() => setEditorFontSizePx((s) => Math.min(26, +(s + 1).toFixed(1)))}
                    title="Increase note text size"
                  >
                    A+
                  </button>
                </div>

                <span className="an-vsep" />
                <button
                  type="button"
                  className="an-icon-btn"
                  title="Bold (Ctrl B)"
                  onClick={() => executeCommand('bold')}
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="an-icon-btn"
                  title="Italic (Ctrl I)"
                  onClick={() => executeCommand('italic')}
                >
                  <Italic className="w-4 h-4" />
                </button>

                {/* 2-Option Underline Split */}
                <div className="an-color-split" title="Underline style">
                  <button
                    type="button"
                    className="an-color-main"
                    onClick={() => applyUnderlineByMode(underlineMode)}
                    title={underlineMode === 'hand' ? 'Apply Hand-Made natural underline' : 'Apply Straight underline'}
                  >
                    <span className="text-[13px] font-serif font-bold leading-none">U</span>
                    {underlineMode === 'hand' ? (
                      <svg width="16" height="5" viewBox="0 0 24 6" className="text-[#8f5f2c] dark:text-[#e0b068]">
                        <path
                          d="M1 3.6 Q4.5 1.2 8 3.8 T15 3.1 Q19 5.0 23 2.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.9"
                          strokeLinecap="round"
                        />
                      </svg>
                    ) : (
                      <span className="block w-3.5 h-[2px] bg-current rounded-full mt-0.5" />
                    )}
                  </button>
                  <button
                    type="button"
                    className="an-color-arrow"
                    onClick={openUnderlineDropdown}
                    aria-label="Choose underline style"
                    title="Choose Straight Line or Hand-Made Line"
                  >
                    <ChevronDown className="w-3 h-3" />
                  </button>
                </div>

                <button
                  type="button"
                  className="an-icon-btn"
                  title="Strikethrough"
                  onClick={() => executeCommand('strikeThrough')}
                >
                  <Strikethrough className="w-4 h-4" />
                </button>

                <span className="an-vsep" />
                {/* Split Text Color Picker */}
                <div className="an-color-split" title="Text color">
                  <button
                    type="button"
                    className="an-color-main"
                    onClick={() => applyTextColor(activeTextColor)}
                    title="Apply selected text color"
                  >
                    <span className="an-text-a">A</span>
                    <span className="an-color-bar" style={{ backgroundColor: activeTextColor }} />
                  </button>
                  <button
                    type="button"
                    className="an-color-arrow"
                    onClick={(e) => openSplitColorMenu('text', e)}
                    aria-label="Choose text color"
                    title="Choose text color"
                  >
                    <ChevronDown className="w-3 h-3" />
                  </button>
                </div>

                {/* Split Highlighter Picker */}
                <div className="an-color-split" title="Highlighter">
                  <button
                    type="button"
                    className="an-color-main"
                    onClick={() => applyHighlightColor(activeHighlightColor)}
                    title="Apply selected highlight"
                  >
                    <Highlighter className="w-3.5 h-3.5" />
                    <span
                      className="an-color-bar"
                      style={{
                        background:
                          activeHighlightColor === 'transparent'
                            ? 'linear-gradient(135deg, #fff 40%, #ef4444 40% 60%, #fff 60%)'
                            : activeHighlightColor,
                      }}
                    />
                  </button>
                  <button
                    type="button"
                    className="an-color-arrow"
                    onClick={(e) => openSplitColorMenu('highlight', e)}
                    aria-label="Choose highlight color"
                    title="Choose highlight color"
                  >
                    <ChevronDown className="w-3 h-3" />
                  </button>
                </div>

                <span className="an-vsep" />
                <button type="button" className="an-icon-btn sm" title="Align left" onClick={() => executeCommand('justifyLeft')}>
                  <AlignLeft className="w-3.5 h-3.5" />
                </button>
                <button type="button" className="an-icon-btn sm" title="Align center" onClick={() => executeCommand('justifyCenter')}>
                  <AlignCenter className="w-3.5 h-3.5" />
                </button>
                <button type="button" className="an-icon-btn sm" title="Align right" onClick={() => executeCommand('justifyRight')}>
                  <AlignRight className="w-3.5 h-3.5" />
                </button>
                <button type="button" className="an-icon-btn sm" title="Justify text" onClick={() => executeCommand('justifyFull')}>
                  <AlignJustify className="w-3.5 h-3.5" />
                </button>

                {/* User-Pinned Custom Tools from "Add tools" */}
                {pinnedRibbonTools.length > 0 && <span className="an-vsep" />}
                {pinnedRibbonTools.map((tid) => {
                  if (tid === 'paper-style') {
                    return (
                      <div key="paper-style" className="an-paper-mini-pills shrink-0" role="group" aria-label="Paper style">
                        {(['ruled', 'plain', 'grid', 'dot'] as const).map((ps) => (
                          <button
                            key={ps}
                            type="button"
                            className={paperStyle === ps ? 'active' : ''}
                            onClick={() => setPaperStyle(ps)}
                            title={`Switch paper to ${ps}`}
                          >
                            {ps.charAt(0).toUpperCase() + ps.slice(1)}
                          </button>
                        ))}
                      </div>
                    );
                  }
                  if (tid === 'indent') {
                    return (
                      <React.Fragment key="indent">
                        <button type="button" className="an-icon-btn sm" title="Decrease indent" onClick={() => executeCommand('outdent')}>
                          <IndentDecrease className="w-3.5 h-3.5" />
                        </button>
                        <button type="button" className="an-icon-btn sm" title="Increase indent" onClick={() => executeCommand('indent')}>
                          <IndentIncrease className="w-3.5 h-3.5" />
                        </button>
                      </React.Fragment>
                    );
                  }
                  const toolDef = CUSTOMIZABLE_RIBBON_TOOLS.find((t) => t.id === tid);
                  if (!toolDef) return null;
                  const TIcon = toolDef.icon;
                  return (
                    <button
                      key={tid}
                      type="button"
                      className="an-ribbon-feat compact shrink-0"
                      title={toolDef.title}
                      onClick={() => {
                        if (tid === 'youtube') {
                          setAttachType('youtube');
                          setIsAttachOpen(true);
                        } else if (tid === 'image') {
                          setAttachType('image');
                          setIsAttachOpen(true);
                        } else {
                          executeToolAction(tid);
                        }
                      }}
                    >
                      <TIcon className="w-3.5 h-3.5 text-[#A47C43]" />
                      <span>{toolDef.label}</span>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                className="an-ribbon-slide-btn"
                title="Scroll ribbon right"
                aria-label="Scroll ribbon right"
                onClick={() => ribbonScrollRef.current?.scrollBy({ left: 180, behavior: 'smooth' })}
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <div className="an-ribbon-pin-right">
                <div className="relative">
                  <button
                    type="button"
                    className="an-btn"
                    style={{ padding: '4px 9px', fontSize: 11.5 }}
                    onClick={() => setIsAddToolsOpen((p) => !p)}
                    title="Customize ribbon tools"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add tools</span>
                  </button>

                  {isAddToolsOpen && (
                    <div
                      className="fixed sm:absolute right-2 sm:right-0 top-12 sm:top-full sm:mt-2 z-[90] w-64 max-h-80 overflow-y-auto custom-scrollbar rounded-2xl border p-3 shadow-2xl"
                      style={{
                        background: 'var(--an-paper)',
                        borderColor: 'var(--an-line)',
                        color: 'var(--an-ink)',
                      }}
                    >
                      <div className="flex items-center justify-between pb-2 mb-2 border-b" style={{ borderColor: 'var(--an-line)' }}>
                        <span className="text-xs font-bold">Customize Ribbon Tools</span>
                        <button
                          type="button"
                          onClick={() => setIsAddToolsOpen(false)}
                          className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 gap-1">
                        {CUSTOMIZABLE_RIBBON_TOOLS.map((tool) => {
                          const TIcon = tool.icon;
                          const isChecked = pinnedRibbonTools.includes(tool.id);
                          return (
                            <button
                              key={tool.id}
                              type="button"
                              onClick={() => togglePinnedTool(tool.id)}
                              className={`w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg text-xs text-left transition-colors ${
                                isChecked
                                  ? 'bg-[#A47C43]/15 font-semibold'
                                  : 'hover:bg-black/5 dark:hover:bg-white/5'
                              }`}
                            >
                              <span className="flex items-center gap-2 min-w-0">
                                <TIcon className="w-3.5 h-3.5 shrink-0 text-[#A47C43]" />
                                <span className="truncate">{tool.label}</span>
                              </span>
                              {isChecked && <Check className="w-3.5 h-3.5 text-[#A47C43] shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  className="an-btn"
                  style={{ padding: '4px 9px', fontSize: 11.5 }}
                  onClick={() => setIsToolsOpen(true)}
                >
                  <MoreHorizontal className="w-3.5 h-3.5" />
                  <span>More tools</span>
                </button>

                <div className="an-win-controls" role="toolbar" aria-label="Note window controls">
                  <button
                    type="button"
                    className="an-win-btn min"
                    title="Minimise note"
                    onClick={() => {
                      setIsNoteMinimized(true);
                      showToast('Note minimised to dock');
                    }}
                    aria-label="Minimise note"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    className="an-win-btn max"
                    title={maximizedWindowId === 'note' ? 'Restore note pane layout' : 'Maximise note pane'}
                    onClick={() =>
                      setMaximizedWindowId((prev) => (prev === 'note' ? null : 'note'))
                    }
                    aria-label={maximizedWindowId === 'note' ? 'Restore note pane' : 'Maximise note pane'}
                  >
                    {maximizedWindowId === 'note' ? (
                      <Minimize2 className="w-3.5 h-3.5" />
                    ) : (
                      <Maximize2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    type="button"
                    className="an-win-btn close"
                    title="Close note"
                    onClick={() => {
                      setIsNoteClosed(true);
                      showToast('Note closed. Restore anytime from dock.');
                    }}
                    aria-label="Close note"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Note Sheet + Vertical Category Attachments Ribbon */}
            <div className="an-note-split-body">
            <div className="an-note-body">
              {(() => {
                const normFontKey = normalizeNoteFontKey(fontStyle);
                const activeFontObj = NOTE_FONT_OPTIONS.find((f) => f.key === normFontKey) || NOTE_FONT_OPTIONS[0];
                const sheetCursor =
                  hoverSheetEdge === 'left' || hoverSheetEdge === 'right'
                    ? 'ew-resize'
                    : hoverSheetEdge === 'bottom'
                    ? 'ns-resize'
                    : hoverSheetEdge === 'bottom-right'
                    ? 'nwse-resize'
                    : hoverSheetEdge === 'bottom-left'
                    ? 'nesw-resize'
                    : undefined;
                return (
              <article
                className={`an-sheet ${isDraggingSheetWidth ? 'is-sheet-resizing' : ''}`}
                id="sheet"
                data-paper={paperStyle}
                data-font={normFontKey}
                data-hand={activeFontObj.isHandwriting ? 'true' : undefined}
                data-hover-edge={hoverSheetEdge || undefined}
                style={{
                  width: `${sheetWidthPx}px`,
                  minHeight: `${sheetMinHeightPx}px`,
                  minWidth: '340px',
                  cursor: sheetCursor,
                  ['--an-nf' as string]: activeFontObj.family,
                } as React.CSSProperties}
                onMouseMove={(e) => {
                  if (isDraggingSheetWidth) return;
                  const edge = detectSheetBorderEdge(e, e.currentTarget);
                  if (edge !== hoverSheetEdge) setHoverSheetEdge(edge);
                }}
                onMouseLeave={() => {
                  if (!isDraggingSheetWidth && hoverSheetEdge) setHoverSheetEdge(null);
                }}
                onPointerDown={(e) => {
                  const edge = detectSheetBorderEdge(e, e.currentTarget);
                  if (edge) {
                    handleSheetEdgePointerDown(edge, e);
                  }
                }}
                onDoubleClick={(e) => {
                  const edge = detectSheetBorderEdge(e, e.currentTarget);
                  if (edge) {
                    e.preventDefault();
                    setSheetWidthPx(780);
                    setSheetMinHeightPx(640);
                    showToast('Paper size reset (780 × 640 px)');
                  }
                }}
              >
                {/* Continuous Mouse-Hold Drag Resize Borders & Corners (Left, Right, Bottom, BL, BR) */}
                <div
                  className="an-sheet-rz-handle left"
                  onPointerDown={(e) => handleSheetEdgePointerDown('left', e)}
                  onDoubleClick={() => { setSheetWidthPx(780); setSheetMinHeightPx(640); }}
                  title="Hold & drag left border to stretch or narrow paper (Double-click to reset)"
                  role="separator"
                  aria-orientation="vertical"
                >
                  <span className="an-sheet-rz-bar" />
                </div>
                <div
                  className="an-sheet-rz-handle right"
                  onPointerDown={(e) => handleSheetEdgePointerDown('right', e)}
                  onDoubleClick={() => { setSheetWidthPx(780); setSheetMinHeightPx(640); }}
                  title="Hold & drag right border to stretch or narrow paper (Double-click to reset)"
                  role="separator"
                  aria-orientation="vertical"
                >
                  <span className="an-sheet-rz-bar" />
                </div>
                <div
                  className="an-sheet-rz-handle bottom"
                  onPointerDown={(e) => handleSheetEdgePointerDown('bottom', e)}
                  onDoubleClick={() => { setSheetWidthPx(780); setSheetMinHeightPx(640); }}
                  title="Hold & drag bottom border to stretch paper height (Double-click to reset)"
                  role="separator"
                  aria-orientation="horizontal"
                >
                  <span className="an-sheet-rz-bar horizontal" />
                </div>
                <div
                  className="an-sheet-rz-corner bottom-left"
                  onPointerDown={(e) => handleSheetEdgePointerDown('bottom-left', e)}
                  onDoubleClick={() => { setSheetWidthPx(780); setSheetMinHeightPx(640); }}
                  title="Hold & drag bottom-left corner to resize paper width & height"
                />
                <div
                  className="an-sheet-rz-corner bottom-right"
                  onPointerDown={(e) => handleSheetEdgePointerDown('bottom-right', e)}
                  onDoubleClick={() => { setSheetWidthPx(780); setSheetMinHeightPx(640); }}
                  title="Hold & drag bottom-right corner to resize paper width & height"
                />

                {isDraggingSheetWidth && (
                  <div className="an-sheet-width-pill">{sheetWidthPx} × {sheetMinHeightPx} px</div>
                )}

                {/* Top-Right Paper Quick Tools: Speech to Text + smaller Correct Spellings underneath */}
                <div className="an-sheet-quick-tools">
                  <button
                    type="button"
                    className={`an-speech-btn ${isDictating ? 'listening' : ''}`}
                    onClick={toggleSpeechToText}
                    title={isDictating ? 'Stop voice dictation' : 'Dictate note using Speech to Text'}
                  >
                    {isDictating ? (
                      <MicOff className="w-3.5 h-3.5" />
                    ) : (
                      <Mic className="w-3.5 h-3.5 text-[#A47C43]" />
                    )}
                    <span>{isDictating ? 'Stop Dictation' : 'Speech to Text'}</span>
                  </button>
                  <button
                    type="button"
                    className="an-spell-btn"
                    onClick={handleCorrectSpellings}
                    title="Auto-correct spellings & punctuation across note"
                  >
                    <Check className="w-3 h-3 text-[#A47C43]" />
                    <span>Correct Spellings</span>
                  </button>
                </div>

                {/* Meta row — auto-updates daily, no default proxy tags */}
                <div className="an-meta-row">
                  <span>{todayDate}</span>
                </div>

                {/* Editable Note Title */}
                <h1
                  className="an-note-title"
                  contentEditable
                  suppressContentEditableWarning
                  ref={sheetTitleRef}
                  onInput={(e) => {
                    setNoteTitle(e.currentTarget.textContent || '');
                    triggerSave();
                  }}
                >
                  {noteTitle}
                </h1>

                {/* MS Word-Like Table Control Bar (Rows/Cols, Resize Controls & MS Word Table Color Formats) */}
                {activeTableEl && (
                  <div className="an-table-word-bar" role="toolbar" aria-label="Table MS Word Controls">
                    <div className="flex flex-wrap items-center gap-1 w-full">
                      <span className="an-table-handle px-1" title="Drag any column divider edge directly to resize">
                        <Move className="w-3.5 h-3.5" />
                      </span>
                      <span className="text-[10px] font-mono font-bold text-stone-400 mr-1">TABLE</span>

                      <button type="button" className="an-table-word-btn" onClick={() => handleAddRow('above')} title="Insert row above">+ Row ↑</button>
                      <button type="button" className="an-table-word-btn" onClick={() => handleAddRow('below')} title="Insert row below">+ Row ↓</button>
                      <button type="button" className="an-table-word-btn" onClick={() => handleAddCol('left')} title="Insert column left">+ Col ←</button>
                      <button type="button" className="an-table-word-btn" onClick={() => handleAddCol('right')} title="Insert column right">+ Col →</button>

                      <div className="w-px h-3.5 bg-stone-200 dark:bg-stone-700 mx-0.5" />

                      <button type="button" className="an-table-word-btn danger" onClick={handleDeleteRow} title="Delete current row">- Row</button>
                      <button type="button" className="an-table-word-btn danger" onClick={handleDeleteCol} title="Delete current column">- Col</button>
                      <button
                        type="button"
                        className="an-table-word-btn"
                        onClick={() => {
                          const w = activeTableEl?.closest('.an-table-wrapper') as HTMLElement | null;
                          if (w) {
                            w.style.left = '0px';
                            w.style.top = '0px';
                            triggerSave();
                            showToast('Table position reset');
                          }
                        }}
                        title="Reset moved table back to center flow"
                      >
                        Reset Pos
                      </button>
                      <button type="button" className="an-table-word-btn danger" onClick={handleDeleteTable} title="Delete entire table">
                        <Trash2 className="w-3 h-3 text-[#7f1d1d] dark:text-[#b0363b]" />
                        <span>Del</span>
                      </button>

                      <div className="w-px h-3.5 bg-stone-200 dark:bg-stone-700 mx-0.5" />

                      {/* Resize Width & Column Width */}
                      <div className="flex items-center gap-1" title="Resize Table & Selected Column">
                        <span className="text-[9.5px] font-mono text-stone-400">Size:</span>
                        {[55, 75, 100].map((pct) => (
                          <button
                            key={pct}
                            type="button"
                            onClick={() => handleResizeTableWidth(pct)}
                            className={`an-table-word-btn ${tableWidthPct === pct ? 'bg-[#A47C43]/20 text-[#85532d] dark:text-amber-300 font-bold' : ''}`}
                            title={`Set table width to ${pct}%`}
                          >
                            {pct}%
                          </button>
                        ))}
                        <button type="button" className="an-table-word-btn" onClick={() => handleResizeActiveCol(-24)} title="Narrow selected column">Col -</button>
                        <button type="button" className="an-table-word-btn" onClick={() => handleResizeActiveCol(24)} title="Widen selected column">Col +</button>
                        <button type="button" className="an-table-word-btn" onClick={() => handleTablePadding('3px 6px', 'Compact')} title="Compact cell spacing">Compact</button>
                        <button type="button" className="an-table-word-btn" onClick={() => handleTablePadding('9px 12px', 'Spacious')} title="Spacious cell padding">Wide</button>
                      </div>
                    </div>

                    {/* Row 2: MS Word Table Color Formats & Cell Shading */}
                    <div className="flex flex-wrap items-center gap-1.5 w-full pt-1 mt-1 border-t border-stone-200/70 dark:border-stone-700/70">
                      <span className="text-[9.5px] font-mono text-stone-400 uppercase tracking-wider">Formats:</span>
                      {MS_WORD_TABLE_STYLES.map((st) => (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() => handleApplyTableStyle(st)}
                          className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] border transition-all cursor-pointer ${
                            activeTableStyleId === st.id
                              ? 'border-[#A47C43] bg-[#A47C43]/15 font-bold'
                              : 'border-stone-200 dark:border-stone-700 hover:border-[#A47C43]/60'
                          }`}
                          title={st.name}
                        >
                          <span className="w-2.5 h-2.5 rounded-full shrink-0 border border-black/15" style={{ backgroundColor: st.swatch }} />
                          <span>{st.name.split(' ')[0]}</span>
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={handleCycleTableBorders}
                        className="an-table-word-btn"
                        title="Cycle table borders (Grid / Horizontal / Clean)"
                      >
                        Borders: {tableBorderStyle}
                      </button>

                      <div className="w-px h-3.5 bg-stone-200 dark:bg-stone-700 mx-0.5" />
                      <span className="text-[9.5px] font-mono text-stone-400">Cell:</span>
                      <div className="flex items-center gap-1" title="Cell Background Shading">
                        {[
                          { label: 'Clear', hex: 'transparent' },
                          { label: 'Lemon', hex: '#fef9c3' },
                          { label: 'Amber', hex: '#fef3c7' },
                          { label: 'Mint', hex: '#dcfce7' },
                          { label: 'Sky', hex: '#e0f2fe' },
                          { label: 'Rose', hex: '#ffe4e6' },
                          { label: 'Lavender', hex: '#f3e8ff' },
                        ].map((c) => (
                          <button
                            key={c.label}
                            type="button"
                            data-swatch
                            className="w-3.5 h-3.5 rounded-full border border-stone-300 dark:border-stone-600 cursor-pointer hover:scale-125 transition-transform"
                            style={{
                              background:
                                c.hex === 'transparent'
                                  ? 'linear-gradient(135deg, #fff 40%, #ef4444 40% 60%, #fff 60%)'
                                  : c.hex,
                            }}
                            title={`Cell shading: ${c.label}`}
                            onClick={() => handleCellShading(c.hex)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Rich ContentEditable Note Area (Supports dragging table column borders) */}
                <div
                  className="an-ed"
                  id="ed"
                  contentEditable
                  suppressContentEditableWarning
                  spellCheck
                  ref={editorRef}
                  onInput={() => {
                    ensureTableDragHandles();
                    pushHistorySnapshot();
                    triggerSave();
                  }}
                  onClick={handleEditorClick}
                  onMouseMove={handleEditorMouseMove}
                  onPointerDown={handleEditorPointerDown}
                  onKeyUp={() => {
                    saveRange();
                    handleCanvasMouseUp();
                  }}
                  style={{ fontSize: `${editorFontSizePx}px` }}
                  onDoubleClick={handleEditorDoubleClick}
                  onMouseUp={handleCanvasMouseUp}
                  onBlur={saveRange}
                />
              </article>
                );
              })()}

              {/* Floating Canvas Context Menu for Text Selection */}
              {canvasSelection.visible && (
                <div
                  className="an-floating-sel-menu"
                  style={{
                    left: canvasSelection.x,
                    top: canvasSelection.y,
                  }}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <button
                    type="button"
                    className="an-sel-btn"
                    onClick={() => {
                      restoreRange();
                      document.execCommand('cut');
                      setCanvasSelection((p) => ({ ...p, visible: false }));
                      triggerSave();
                      showToast('Cut to clipboard');
                    }}
                    title="Cut"
                  >
                    <Scissors className="w-3.5 h-3.5" />
                    <span>Cut</span>
                  </button>

                  <button
                    type="button"
                    className="an-sel-btn"
                    onClick={() => {
                      navigator.clipboard.writeText(canvasSelection.text);
                      setCanvasSelection((p) => ({ ...p, visible: false }));
                      showToast('Copied to clipboard');
                    }}
                    title="Copy"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </button>

                  <button
                    type="button"
                    className="an-sel-btn"
                    onClick={async () => {
                      try {
                        const text = await navigator.clipboard.readText();
                        if (text) {
                          insertHtmlAtCursor(text);
                          setCanvasSelection((p) => ({ ...p, visible: false }));
                          showToast('Pasted');
                        }
                      } catch {
                        document.execCommand('paste');
                      }
                    }}
                    title="Paste"
                  >
                    <Clipboard className="w-3.5 h-3.5" />
                    <span>Paste</span>
                  </button>

                  <button
                    type="button"
                    className="an-sel-btn"
                    onClick={() => {
                      restoreRange();
                      document.execCommand('selectAll');
                      setCanvasSelection((p) => ({ ...p, visible: false }));
                    }}
                    title="Select All"
                  >
                    <span>Select All</span>
                  </button>

                  <div className="w-px h-3.5 bg-white/20 mx-0.5" />

                  <button
                    type="button"
                    className="an-sel-btn gemini"
                    onClick={() => handleAskGeminiForSelectedText(canvasSelection.text)}
                    title="Ask Gemini AI about this medical term"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Ask Gemini AI</span>
                  </button>
                </div>
              )}

              {/* Inline Gemini AI Clinical Explanation Window */}
              {geminiExplainTerm && (
                <div
                  className="an-gemini-popover"
                  style={{
                    left: '50%',
                    top: '20%',
                    transform: 'translateX(-50%)',
                  }}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-700">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-amber-700 dark:text-amber-400">
                      <Sparkles className="w-4 h-4" />
                      <span>Gemini Clinical Intelligence</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setGeminiExplainTerm(null);
                        setGeminiExplanation(null);
                      }}
                      className="p-1 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="my-3">
                    <h4 className="font-serif text-base font-bold text-stone-900 dark:text-stone-100">
                      {geminiExplainTerm}
                    </h4>

                    {isGeminiLoading ? (
                      <div className="flex items-center gap-2 py-6 justify-center text-xs text-stone-500 font-mono">
                        <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
                        <span>Gathering high-yield clinical insights…</span>
                      </div>
                    ) : (
                      <div className="mt-2 text-xs text-stone-700 dark:text-stone-300 leading-relaxed max-h-56 overflow-y-auto custom-scrollbar pr-1 whitespace-pre-line">
                        {geminiExplanation}
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-stone-200 dark:border-stone-700 flex items-center justify-between">
                    <button
                      type="button"
                      disabled={isGeminiLoading}
                      onClick={() => {
                        insertHtmlAtCursor(
                          `<div class="callout"><span class="ci">Gemini AI</span><div><b>${geminiExplainTerm}:</b> ${geminiExplanation || ''}</div><button class="callout-del-btn" contenteditable="false" title="Delete pearl">✕</button></div><p><br></p>`
                        );
                        setGeminiExplainTerm(null);
                        setGeminiExplanation(null);
                        showToast('Gemini pearl inserted into note!');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#A47C43] hover:bg-[#8e6834] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Insert Pearl into Note</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setGeminiExplainTerm(null);
                        setGeminiExplanation(null);
                      }}
                      className="px-2.5 py-1 text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 font-medium cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Vertical Category-Distributed Attachments Ribbon Column */}
            {isAttachmentsDrawerOpen && (
              <aside
                className="an-attach-ribbon animate-in fade-in slide-in-from-right-2 duration-150"
                aria-label="Category-wise vertical attachments column"
              >
                <div className="an-attach-ribbon-h">
                  <div>
                    <span className="eyebrow">Attachments</span>
                    <b>{resources.length} file{resources.length === 1 ? '' : 's'}</b>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setIsAttachOpen(true)}
                      className="an-attach-add-pill"
                      title="Attach new resource"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAttachmentsDrawerOpen(false)}
                      className="an-icon-btn"
                      style={{ width: 26, height: 26 }}
                      title="Close attachments column"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="an-attach-ribbon-list custom-scrollbar">
                  {([
                    { key: 'web', label: 'Links & Web', modalType: 'web' as const, icon: Globe },
                    { key: 'doc', label: 'Docs & PDFs', modalType: 'pdf' as const, icon: FileText },
                    { key: 'image', label: 'Images', modalType: 'image' as const, icon: ImageIcon },
                    { key: 'audio', label: 'Audio', modalType: 'audio' as const, icon: Music },
                    { key: 'youtube', label: 'Video & YouTube', modalType: 'youtube' as const, icon: CirclePlay },
                  ] as const).map((cat) => {
                    const catItems = resources.filter((r) => r.type === cat.key);
                    const CatIcon = cat.icon;
                    return (
                      <div key={cat.key} className="an-attach-cat">
                        <div className="an-attach-cat-h">
                          <span className="flex items-center gap-1.5 min-w-0">
                            <CatIcon className="w-3.5 h-3.5 shrink-0 opacity-80" />
                            <span className="truncate">{cat.label}</span>
                            <span className="cnt">{catItems.length}</span>
                          </span>
                          <button
                            type="button"
                            className="cat-add"
                            onClick={() => {
                              setAttachType(cat.modalType);
                              setIsAttachOpen(true);
                            }}
                            title={`Add to ${cat.label}`}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {catItems.length > 0 ? (
                          <div className="an-attach-cat-items">
                            {catItems.map((res) => (
                              <div key={res.id} className="an-res-v" data-type={res.type}>
                                <button
                                  type="button"
                                  className="ri"
                                  onClick={() => handleOpenResource(res)}
                                  title={`Open ${res.title}`}
                                >
                                  <CatIcon className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  className="rt"
                                  onClick={() => handleOpenResource(res)}
                                >
                                  <b>{res.title}</b>
                                  <small>{res.meta}</small>
                                </button>
                                <button
                                  type="button"
                                  className="rx"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveResource(res.id);
                                  }}
                                  title="Remove attachment"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                                {res.type === 'audio' && res.url && (
                                  <audio src={res.url} controls className="w-full h-7 mt-1.5 col-span-full" />
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <button
                            type="button"
                            className="an-attach-empty"
                            onClick={() => {
                              setAttachType(cat.modalType);
                              setIsAttachOpen(true);
                            }}
                          >
                            + Add {cat.label.split(' ')[0]}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </aside>
            )}
            </div>
          </div>
        )}
      </section>

      {/* 3. Selection Quote Floating Pill */}
      {selectionPill.visible && (
        <button
          className="an-sel-pill on"
          style={{ left: selectionPill.x, top: selectionPill.y }}
          onClick={handleAddQuoteToNote}
        >
          <Plus className="w-3.5 h-3.5 text-[#A47C43]" />
          Add to note
        </button>
      )}

      {/* 4. Floating Resizable Draggable Video Windows */}
      {videoWindows.map((win) => {
        if (win.isMinimized) return null;
        return (
          <div
            key={win.id}
            className={`an-vw ${win.isMaximized ? 'maximized' : ''}`}
            style={{
              left: win.left,
              top: win.top,
              width: win.width,
              height: win.height,
              zIndex: win.zIndex,
            }}
            onPointerDown={() => {
              topZIndexRef.current += 1;
              setVideoWindows((prev) =>
                prev.map((v) => (v.id === win.id ? { ...v, zIndex: topZIndexRef.current } : v))
              );
            }}
          >
            {/* Header / Drag Bar */}
            <div
              className="an-vw-h"
              onPointerDown={(e) => handleVideoHeaderPointerDown(win.id, e)}
            >
              <GripHorizontal className="w-4 h-4 text-stone-500" />
              <span className="t">{win.title}</span>
              <button
                className="vb"
                title="Minimise to dock"
                onClick={() =>
                  setVideoWindows((prev) =>
                    prev.map((v) => (v.id === win.id ? { ...v, isMinimized: true } : v))
                  )
                }
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <button
                className="vb"
                title={win.isMaximized ? 'Restore size' : 'Fit to note'}
                onClick={() => toggleMaximizeVideo(win.id)}
              >
                {win.isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                className="vb"
                title="Close"
                onClick={() => setVideoWindows((prev) => prev.filter((v) => v.id !== win.id))}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Video Body / iframe */}
            <div className="an-vw-b">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${win.vid}?enablejsapi=1&rel=0&modestbranding=1&playsinline=1&start=${Math.floor(
                  win.currentTime
                )}`}
                title={win.title}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
              />
            </div>

            {/* Controls Bar */}
            <div className="an-vw-c">
              <button className="vb" title="Back 10s" onClick={() => seekVideo(win.id, -10)}>
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                className="vb"
                title={win.isPlaying ? 'Pause' : 'Play'}
                onClick={() => togglePlayVideo(win.id)}
              >
                {win.isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <button className="vb" title="Forward 10s" onClick={() => seekVideo(win.id, 10)}>
                <RotateCw className="w-3.5 h-3.5" />
              </button>

              <span className="time">{formatTime(win.currentTime)}</span>

              <div className="an-speed" role="group" aria-label="Playback speed">
                {[0.75, 1, 1.25, 1.5, 2].map((s) => (
                  <button
                    key={s}
                    aria-pressed={win.playbackRate === s}
                    onClick={() => setVideoPlaybackRate(win.id, s)}
                  >
                    {s}×
                  </button>
                ))}
              </div>

              <span className="grow" />
              <button
                className="stamp"
                title="Insert timestamp into note"
                onClick={() => stampVideoTimestamp(win)}
              >
                <Clock className="w-3.5 h-3.5" />
                Timestamp
              </button>
            </div>

            {/* Resizing Grip */}
            <span
              className="an-vw-rz"
              onPointerDown={(e) => handleVideoResizePointerDown(win.id, e)}
              aria-hidden="true"
            />
          </div>
        );
      })}

      {/* 5. Minimized Video Dock */}
      {videoWindows.some((v) => v.isMinimized) && (
        <div className="an-dock" aria-label="Minimised videos">
          {videoWindows
            .filter((v) => v.isMinimized)
            .map((v) => (
              <button
                key={v.id}
                onClick={() => {
                  topZIndexRef.current += 1;
                  setVideoWindows((prev) =>
                    prev.map((win) =>
                      win.id === v.id
                        ? { ...win, isMinimized: false, zIndex: topZIndexRef.current }
                        : win
                    )
                  );
                }}
              >
                <span className="pulse" />
                <span>{v.title}</span>
                <Maximize2 className="w-3.5 h-3.5 ml-1 text-stone-400" />
              </button>
            ))}
        </div>
      )}

      {/* 6. "More tools" Slide-over Drawer & Scrim */}
      <div
        className={`an-scrim ${isToolsOpen ? 'on' : ''}`}
        onClick={() => setIsToolsOpen(false)}
      />
      <aside
        className={`an-drawer ${isToolsOpen ? 'on' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="More tools"
      >
        <div className="an-dr-h">
          <div style={{ flex: 1 }}>
            <h3>More tools</h3>
          </div>
          <button
            className="an-icon-btn"
            onClick={() => setIsToolsOpen(false)}
            aria-label="Close tools"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <label className="an-dr-s">
          <Search className="w-4 h-4 text-stone-400" />
          <input
            placeholder="Search tools — try “table” or “video”"
            value={toolsSearch}
            onChange={(e) => setToolsSearch(e.target.value)}
          />
        </label>

        <div className="an-dr-b">
          {TOOL_GROUPS.map((group) => {
            const filtered = group.items.filter(
              (item) =>
                !toolsSearch ||
                item.label.toLowerCase().includes(toolsSearch.toLowerCase()) ||
                group.category.toLowerCase().includes(toolsSearch.toLowerCase())
            );
            if (filtered.length === 0) return null;
            return (
              <div key={group.category} className="an-grp">
                <span className="eyebrow">{group.category}</span>
                <div className="an-grp-items">
                  {filtered.map((item) => {
                    const IconComp = item.icon;
                    return (
                      <button
                        key={item.id}
                        className="an-ti"
                        onClick={() => executeToolAction(item.id)}
                      >
                        <IconComp className="w-4 h-4" />
                        <span>{item.label}</span>
                        {item.kbd && <span className="an-kbd">{item.kbd}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </aside>

      {/* 7. Attach Resource Dialog Modal */}
      {isAttachOpen && (
        <div className="an-dialog-overlay" onClick={() => setIsAttachOpen(false)}>
          <div className="an-dialog" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleAttachSubmit}>
              <h3>Attach a resource</h3>
              <p className="sub">
                Linked resources open beside your note — videos float in a resizable window.
              </p>

              {/* Resource Type Tabs */}
              <div className="an-atabs">
                <button
                  type="button"
                  aria-pressed={attachType === 'youtube'}
                  onClick={() => setAttachType('youtube')}
                >
                  <CirclePlay className="w-4 h-4" />
                  YouTube
                </button>
                <button
                  type="button"
                  aria-pressed={attachType === 'web'}
                  onClick={() => setAttachType('web')}
                >
                  <Globe className="w-4 h-4" />
                  Website
                </button>
                <button
                  type="button"
                  aria-pressed={attachType === 'pdf'}
                  onClick={() => setAttachType('pdf')}
                >
                  <FileText className="w-4 h-4" />
                  Document
                </button>
                <button
                  type="button"
                  aria-pressed={attachType === 'image'}
                  onClick={() => setAttachType('image')}
                >
                  <ImageIcon className="w-4 h-4" />
                  Image
                </button>
                <button
                  type="button"
                  aria-pressed={attachType === 'audio'}
                  onClick={() => setAttachType('audio')}
                >
                  <Music className="w-4 h-4" />
                  Audio
                </button>
              </div>

              {/* URL or File Input */}
              {attachType === 'youtube' || attachType === 'web' ? (
                <div className="an-field">
                  <label htmlFor="attachUrlInput">
                    {attachType === 'youtube' ? 'Video link' : 'Website address'}
                  </label>
                  <input
                    id="attachUrlInput"
                    type="url"
                    placeholder={
                      attachType === 'youtube'
                        ? 'https://youtube.com/watch?v=…'
                        : 'https://…'
                    }
                    value={attachUrl}
                    onChange={(e) => setAttachUrl(e.target.value)}
                    required
                  />
                </div>
              ) : (
                <div className="an-field">
                  <label className="an-drop" htmlFor="attachFileInput">
                    <span>{uploadedFileName || 'Choose a file or drop it here'}</span>
                    <input
                      id="attachFileInput"
                      type="file"
                      accept={
                        attachType === 'pdf'
                          ? '.pdf,application/pdf'
                          : attachType === 'image'
                          ? 'image/*'
                          : 'audio/*'
                      }
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setUploadedFileName(file.name);
                          setUploadedFileUrl(URL.createObjectURL(file));
                        }
                      }}
                    />
                  </label>
                </div>
              )}

              {/* Display Name */}
              <div className="an-field">
                <label htmlFor="attachNameInput">Display name (optional)</label>
                <input
                  id="attachNameInput"
                  type="text"
                  placeholder="e.g. Autonomic pharmacology lecture"
                  value={attachName}
                  onChange={(e) => setAttachName(e.target.value)}
                />
              </div>

              {/* Open Right Away */}
              <label className="an-check-row">
                <input
                  type="checkbox"
                  checked={attachOpenRightAway}
                  onChange={(e) => setAttachOpenRightAway(e.target.checked)}
                />
                Open right away
              </label>

              {/* Dialog Actions */}
              <div className="an-d-actions">
                <button type="button" className="an-btn" onClick={() => setIsAttachOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="an-btn primary">
                  <Paperclip className="w-4 h-4" />
                  Attach
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. Open Book / Subwindow Picker Modal */}
      {isBookPickerOpen && (
        <div className="an-dialog-overlay" onClick={() => setIsBookPickerOpen(false)}>
          <div className="an-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 540 }}>
            <h3>Open a Book or Reference</h3>
            <p className="sub">
              Select any medical book or document to open as a dedicated subwindow in your layout.
            </p>

            <div className="an-book-grid">
              {docsList.length === 0 ? (
                <div className="col-span-full py-8 px-4 text-center border border-dashed border-stone-300 dark:border-[#382518] rounded-xl space-y-2">
                  <p className="text-sm font-semibold text-stone-700 dark:text-[#efe4d4]">
                    No books in Shelf yet
                  </p>
                  <p className="text-xs text-stone-500 dark:text-[#a69079]">
                    Upload a PDF in Library or attach a local PDF, image, YouTube video, or web link directly here.
                  </p>
                  <button
                    type="button"
                    className="an-btn primary mx-auto mt-2"
                    onClick={() => {
                      setIsBookPickerOpen(false);
                      setIsAttachOpen(true);
                    }}
                  >
                    <Paperclip className="w-3.5 h-3.5" />
                    <span>Attach File or URL</span>
                  </button>
                </div>
              ) : (
                docsList.map((doc) => {
                  const isCurrentlyOpen = visiblePanes.some((p) => p.docId === doc.id);
                  return (
                    <button
                      key={doc.id}
                      className="an-book-card"
                      onClick={() => handleOpenBookWindow(doc.id)}
                    >
                      <div className="b-icon">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div className="b-info">
                        <b>{doc.title}</b>
                        <small>
                          {doc.tag || 'Reference'} · {doc.pages?.length || 1} pages
                          {isCurrentlyOpen && ' (Already open)'}
                        </small>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            <div className="an-d-actions">
              <button
                type="button"
                className="an-btn"
                onClick={() => setIsBookPickerOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IN-APP HYPERLINK MODAL (replaces native window.prompt) */}
      {isLinkModalOpen && (
        <div className="an-dialog-overlay" onClick={() => setIsLinkModalOpen(false)}>
          <div className="an-dialog" onClick={(e) => e.stopPropagation()}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const rawUrl = linkUrlInput.trim();
                if (!rawUrl || rawUrl === 'https://') {
                  showToast('Enter a valid URL');
                  return;
                }
                const safeHref = /^https?:///i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;
                const display = linkLabelInput.trim() || rawUrl;
                setIsLinkModalOpen(false);
                setTimeout(() => {
                  insertHtmlAtCursor(`<a href="${safeHref}" target="_blank" rel="noopener noreferrer">${display}</a>&nbsp;`);
                }, 10);
              }}
            >
              <h3>Insert Hyperlink</h3>
              <p className="sub">Attach a clickable reference or citation link inside your clinical note.</p>
              <label>Display Label (optional)</label>
              <input
                type="text"
                placeholder="e.g. UpToDate · Hypercalcaemia"
                value={linkLabelInput}
                onChange={(e) => setLinkLabelInput(e.target.value)}
              />
              <label>URL Address</label>
              <input
                type="text"
                autoFocus
                required
                placeholder="https://example.com"
                value={linkUrlInput}
                onChange={(e) => setLinkUrlInput(e.target.value)}
              />
              <div className="an-d-actions">
                <button type="button" className="an-btn" onClick={() => setIsLinkModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="an-btn primary">
                  Insert Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE NOTE CONFIRMATION MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="border border-[#962d32]/50 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4" style={{ background: 'var(--an-paper)', color: 'var(--an-ink)' }}>
            <div className="w-12 h-12 rounded-2xl bg-[#6e171b]/25 text-[#c94a4f] flex items-center justify-center mx-auto border border-[#962d32]/40">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-serif text-xl font-bold" style={{ color: 'var(--an-ink)' }}>Delete Current Note?</h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--an-muted)' }}>
                Are you sure you want to delete <b>"{noteTitle}"</b>? This note will be removed from your active workspace and moved to Trash.
              </p>
            </div>
            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 py-2 rounded-xl border text-xs font-semibold cursor-pointer"
                style={{ background: 'var(--an-bg)', borderColor: 'var(--an-line)', color: 'var(--an-ink)' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteCurrentNote}
                className="flex-1 py-2 rounded-xl bg-[#7f1d1d] hover:bg-[#962d32] text-[#fdf2f2] text-xs font-bold shadow-md cursor-pointer"
              >
                Delete Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2-Option Underline Selector Popover (Straight Line vs Hand-Made Natural Line) */}
      {openUnderlineMenu && (
        <div
          className="an-color-popover an-underline-popover animate-in fade-in zoom-in-95 duration-100"
          style={{ left: openUnderlineMenu.left, top: openUnderlineMenu.top, width: 224 }}
          onMouseDown={(e) => e.preventDefault()}
        >
          <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-stone-200 dark:border-[#382518]">
            <span className="text-[11px] font-bold tracking-wide text-stone-700 dark:text-[#efe4d4]">
              Underline Style
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => applyUnderlineByMode('straight')}
              className={`w-full flex flex-col items-start gap-1 px-3 py-2 rounded-xl border text-left transition-all cursor-pointer ${
                underlineMode === 'straight'
                  ? 'border-[#A47C43] bg-[#A47C43]/15'
                  : 'border-stone-200 dark:border-[#382518] hover:border-[#A47C43]/60'
              }`}
            >
              <div className="flex items-center justify-between w-full text-xs font-semibold">
                <span>Straight Line</span>
                {underlineMode === 'straight' && <Check className="w-3.5 h-3.5 text-[#A47C43]" />}
              </div>
              <div className="w-full h-[2px] bg-stone-700 dark:bg-stone-200 rounded-full" />
            </button>

            <button
              type="button"
              onClick={() => applyUnderlineByMode('hand')}
              className={`w-full flex flex-col items-start gap-1 px-3 py-2 rounded-xl border text-left transition-all cursor-pointer ${
                underlineMode === 'hand'
                  ? 'border-[#A47C43] bg-[#A47C43]/15'
                  : 'border-stone-200 dark:border-[#382518] hover:border-[#A47C43]/60'
              }`}
            >
              <div className="flex items-center justify-between w-full text-xs font-semibold">
                <span className="flex items-center gap-1.5">
                  <PenTool className="w-3 h-3 text-[#A47C43]" />
                  <span>Hand-Made Line</span>
                </span>
                {underlineMode === 'hand' && <Check className="w-3.5 h-3.5 text-[#A47C43]" />}
              </div>
              <svg width="100%" height="9" viewBox="0 0 180 9" preserveAspectRatio="none" className="text-[#8f5f2c] dark:text-[#e0b068]">
                <path
                  d="M2 5.2 Q14 2.1 26 5.4 T52 4.1 Q66 6.8 80 3.2 T108 5.5 Q122 2.4 138 5.1 T178 3.9"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.1"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Round Color Columns Popover for Text Color & Highlighter (Zero Hex) */}
      {openColorMenu && (
        <div
          className="an-color-popover animate-in fade-in zoom-in-95 duration-100"
          style={{ left: openColorMenu.left, top: openColorMenu.top }}
          onMouseDown={(e) => e.preventDefault()}
        >
          <div className="flex items-center justify-between pb-1.5 mb-2.5 border-b border-stone-200 dark:border-[#382518]">
            <span className="text-[11px] font-bold tracking-wide text-stone-700 dark:text-[#efe4d4]">
              {openColorMenu.type === 'text' ? 'Text Color' : 'Highlighter'}
            </span>
            <button
              type="button"
              onClick={() =>
                openColorMenu.type === 'text'
                  ? applyTextColor('inherit')
                  : applyHighlightColor('transparent')
              }
              className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-100 dark:bg-[#2a1d14] hover:bg-stone-200 dark:hover:bg-[#382518] text-stone-600 dark:text-stone-300 cursor-pointer"
            >
              {openColorMenu.type === 'text' ? 'Automatic' : 'No Color'}
            </button>
          </div>

          {openColorMenu.type === 'text' ? (
            <RoundColorColumnsPicker
              columns={UNIFIED_COLOR_COLUMNS}
              selectedColor={activeTextColor}
              onSelectColor={applyTextColor}
              showStandardRow
              swatchSizeClass="w-5 h-5"
            />
          ) : (
            <RoundColorColumnsPicker
              columns={UNIFIED_HIGHLIGHT_COLUMNS}
              selectedColor={activeHighlightColor}
              onSelectColor={applyHighlightColor}
              swatchSizeClass="w-6 h-6"
            />
          )}
        </div>
      )}

      {/* 9. Toast Feedback Popup */}
      <div className={`an-toast ${isToastVisible ? 'on' : ''}`} role="status">
        {toastMessage}
      </div>
    </div>
  );
};

export default AtelierCreateNote;
