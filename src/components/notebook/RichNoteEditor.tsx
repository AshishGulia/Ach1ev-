import React, { useState, useRef, useEffect } from 'react';
import {
  Notebook,
  NotePage,
  PaperType,
  PaperColor,
  SnippetScreenshot,
  InkStroke,
  MedicalBook,
  DashboardPreset,
  DesignId,
  NoteAttachment,
} from '../../types';
import { getDesignEdition } from '../../data/designEditions';
import { getMakeNoteTheme, MAKE_NOTE_THEMES } from './makeNoteThemes';
import { INITIAL_BOOKS } from '../../data/mockData';
import { DigitalPenCanvas } from './DigitalPenCanvas';
import AtelierCreateNote from './AtelierCreateNote';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  CheckSquare,
  Highlighter,
  Palette,
  FileText,
  PenTool,
  Split,
  Plus,
  Trash2,
  Sparkles,
  BookOpen,
  Maximize2,
  Minimize2,
  Columns,
  Grid,
  ExternalLink,
  Search,
  ZoomIn,
  ZoomOut,
  Play,
  Pause,
  FastForward,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Download,
  AlertCircle,
  FileSpreadsheet,
  Clock,
  Share2,
  X,
  Workflow,
  GitFork,
  ChevronDown,
  ChevronUp,
  Sliders,
  Edit2,
  SlidersHorizontal,
  ArrowUpDown,
  RotateCcw,
  Image as ImageIcon,
  Paperclip,
  Link as LinkIcon,
  Globe,
  Camera,
  Type,
  Video,
  Mic,
  Music,
} from 'lucide-react';
import { INITIAL_FLOWCHART_DOCS, MedicalFlowchartDoc, FlowchartNode } from '../../data/flowchartData';
import { APP_FONTS } from '../settings/SettingsModal';

export type NoteWorkspaceLayout = 'focus-note' | 'classic-duo' | 'quad' | 'triple' | 'dual-top';

export interface ViewOptionDefinition {
  id: NoteWorkspaceLayout;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  rotateIcon?: boolean;
}

const VIEW_OPTION_DEFINITIONS: Record<NoteWorkspaceLayout, ViewOptionDefinition> = {
  'focus-note': {
    id: 'focus-note',
    label: 'Focus Note',
    icon: FileText,
    description: 'Focus Note: Wide Note Desk with Collapsible PDF Drawer',
  },
  'classic-duo': {
    id: 'classic-duo',
    label: 'Classic Studio',
    icon: Split,
    description: 'Classic Studio: Lined Notebook Left, Flowchart & Book Reader Right',
  },
  'quad': {
    id: 'quad',
    label: 'Quad Split',
    icon: Grid,
    description: 'Quad Layout: 2 PDFs Left, Note Editor Right',
  },
  'triple': {
    id: 'triple',
    label: 'Triple Column',
    icon: Columns,
    description: 'Triple Split: PDF 1 | Note Editor | PDF 2',
  },
  'dual-top': {
    id: 'dual-top',
    label: 'Stacked Horizon',
    icon: Split,
    description: 'Stacked Horizon: Dual PDFs Top, Full Note Bottom',
    rotateIcon: true,
  },
};

const DEFAULT_VIEW_ORDER: NoteWorkspaceLayout[] = [
  'focus-note',
  'classic-duo',
  'quad',
  'triple',
  'dual-top',
];

// Curated YouTube Study Lectures for Medical Students
interface YouTubeStudyVideo {
  id: string;
  title: string;
  channel: string;
  duration: string;
  durationSeconds: number;
  thumbnailUrl: string;
  youtubeUrl: string;
  topic: string;
}

const STUDY_VIDEOS: YouTubeStudyVideo[] = [
  {
    id: 'yt-1',
    title: 'Autonomic Pharmacology: Sympathetic vs Parasympathetic Pathways & G-Protein Couplings',
    channel: 'Ninja Nerd Medicine',
    duration: '38:50',
    durationSeconds: 2330,
    thumbnailUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80',
    youtubeUrl: 'https://www.youtube.com/results?search_query=ninja+nerd+autonomic+pharmacology',
    topic: 'Pharmacology',
  },
  {
    id: 'yt-2',
    title: 'Acute Cellular Injury, Free Radical Necrosis & Apoptosis Pathways',
    channel: 'MedCram / Robbins Pathology',
    duration: '24:15',
    durationSeconds: 1455,
    thumbnailUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=600&q=80',
    youtubeUrl: 'https://www.youtube.com/results?search_query=robbins+pathology+acute+inflammation',
    topic: 'Pathology',
  },
  {
    id: 'yt-3',
    title: 'Bone Mineral Homeostasis: RANKL, Bisphosphonates & Teriparatide Mechanisms',
    channel: 'Osmosis Clinical Review',
    duration: '19:40',
    durationSeconds: 1180,
    thumbnailUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80',
    youtubeUrl: 'https://www.youtube.com/results?search_query=osmosis+bone+mineral+pharmacology',
    topic: 'Pharmacology',
  },
  {
    id: 'yt-4',
    title: 'High-Yield Cardiovascular & Autonomic Drug Mnemonics for USMLE Step 1',
    channel: 'Dirty Medicine',
    duration: '22:10',
    durationSeconds: 1330,
    thumbnailUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=600&q=80',
    youtubeUrl: 'https://www.youtube.com/results?search_query=dirty+medicine+pharmacology+mnemonics',
    topic: 'High-Yield Recall',
  },
];

interface RichNoteEditorProps {
  notebook?: Notebook;
  onUpdateNotebook: (updated: Notebook) => void;
  activePageIndex: number;
  onSelectPage: (index: number) => void;
  designEdition?: DashboardPreset;
  books?: MedicalBook[];
  onBack?: () => void;
  onAskAIAboutSelection?: (text: string) => void;
  activeDesign?: DesignId;
  onSelectDesign?: (design: DesignId) => void;
}

const LegacyRichNoteEditor: React.FC<RichNoteEditorProps> = ({
  notebook,
  onUpdateNotebook,
  activePageIndex,
  onSelectPage,
  designEdition = 'nordic-noir',
  books = INITIAL_BOOKS,
  onBack,
  onAskAIAboutSelection,
  activeDesign = '1',
  onSelectDesign,
}) => {
  const edition = getDesignEdition(designEdition);
  const noteTheme = getMakeNoteTheme(activeDesign);
  const editorRef = useRef<HTMLDivElement | null>(null);

  const safeNotebook: Notebook = notebook || {
    id: 'nb-default',
    title: 'Untitled Note',
    subject: 'Internal Medicine',
    coverTheme: 'geometric',
    coverTitle: 'Untitled Note',
    coverSubtitle: 'Personal Notes',
    coverColor: '#7c4521',
    pages: [
      {
        id: 'p-default',
        title: 'Untitled Note',
        contentHtml: '<p><br></p>',
        date: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString(),
        screenshots: [],
        inkStrokes: [],
      },
    ],
    paperType: 'ruled-thin',
    paperColor: 'beige',
    activePageIndex: 0,
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString(),
  };

  const pages = safeNotebook.pages && safeNotebook.pages.length > 0 ? safeNotebook.pages : [
    {
      id: 'p-default',
      title: 'New Clinical Note',
      contentHtml: '<h2>Clinical Notes</h2><p>Start recording medical study pearls here...</p>',
      date: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString(),
      screenshots: [],
      inkStrokes: [],
    },
  ];

  const activePage: NotePage =
    pages[activePageIndex] || pages[0];

  // Workspace Layout State (Focus Note is default on the first position)
  const [workspaceLayout, setWorkspaceLayout] = useState<NoteWorkspaceLayout>(() => {
    try {
      const saved = localStorage.getItem('medden_note_active_layout');
      if (saved) return saved as NoteWorkspaceLayout;
    } catch {}
    return 'focus-note';
  });
  const [openBookSearchQuery, setOpenBookSearchQuery] = useState<string>('');
  const [youtubeSearchQuery, setYoutubeSearchQuery] = useState<string>('');
  const [maximizedWindow, setMaximizedWindow] = useState<'none' | 'pdf1' | 'pdf2' | 'note' | 'youtube'>('none');
  const [copiedAlert, setCopiedAlert] = useState<string | null>(null);

  // View Options Rearrangement State (Persisted in localStorage with Focus Note first)
  const [viewOptionOrder, setViewOptionOrder] = useState<NoteWorkspaceLayout[]>(() => {
    try {
      const saved = localStorage.getItem('medden_view_options_order');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const allKnown: NoteWorkspaceLayout[] = ['focus-note', 'classic-duo', 'quad', 'triple', 'dual-top'];
          const filtered = parsed.filter((id) => allKnown.includes(id));
          allKnown.forEach((id) => {
            if (!filtered.includes(id)) filtered.push(id);
          });
          return filtered;
        }
      }
    } catch {}
    return DEFAULT_VIEW_ORDER;
  });

  const [isRearrangeModalOpen, setIsRearrangeModalOpen] = useState<boolean>(false);
  const [isInlineRearrange, setIsInlineRearrange] = useState<boolean>(false);

  const handleSelectLayout = (layout: NoteWorkspaceLayout) => {
    setWorkspaceLayout(layout);
    setMaximizedWindow('none');
    localStorage.setItem('medden_note_active_layout', layout);
  };

  const moveViewOption = (id: NoteWorkspaceLayout, direction: 'left' | 'right') => {
    const idx = viewOptionOrder.indexOf(id);
    if (idx === -1) return;
    const targetIdx = direction === 'left' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= viewOptionOrder.length) return;
    const newOrder = [...viewOptionOrder];
    const [moved] = newOrder.splice(idx, 1);
    newOrder.splice(targetIdx, 0, moved);
    setViewOptionOrder(newOrder);
    localStorage.setItem('medden_view_options_order', JSON.stringify(newOrder));
  };

  const moveViewOptionToFirst = (id: NoteWorkspaceLayout) => {
    const newOrder = [id, ...viewOptionOrder.filter((item) => item !== id)];
    setViewOptionOrder(newOrder);
    localStorage.setItem('medden_view_options_order', JSON.stringify(newOrder));
  };

  const resetViewOptionsOrder = () => {
    setViewOptionOrder(DEFAULT_VIEW_ORDER);
    localStorage.setItem('medden_view_options_order', JSON.stringify(DEFAULT_VIEW_ORDER));
  };

  // Study Desk & Library Reading Room Ambiance State
  const [deskVibe, setDeskVibe] = useState<'mahogany' | 'oxford' | 'nordic'>(() => {
    return (localStorage.getItem('medden_note_desk_vibe') as any) || 'mahogany';
  });
  const [isDeskLampOn, setIsDeskLampOn] = useState<boolean>(() => {
    return localStorage.getItem('medden_note_desk_lamp') !== 'false';
  });

  const handleToggleDeskLamp = () => {
    setIsDeskLampOn((prev) => {
      const next = !prev;
      localStorage.setItem('medden_note_desk_lamp', String(next));
      return next;
    });
  };

  const handleSelectDeskVibe = (vibe: 'mahogany' | 'oxford' | 'nordic') => {
    setDeskVibe(vibe);
    localStorage.setItem('medden_note_desk_vibe', vibe);
  };

  // Flowchart Segment State (3-4 Medical Flowchart Docs with Search & Edit)
  const [flowchartDocs, setFlowchartDocs] = useState<MedicalFlowchartDoc[]>(() => {
    try {
      const saved = localStorage.getItem('medden_flowchart_docs');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_FLOWCHART_DOCS;
  });
  const [selectedFlowchartId, setSelectedFlowchartId] = useState<string>(INITIAL_FLOWCHART_DOCS[0]?.id || '');
  const [flowchartSearchQuery, setFlowchartSearchQuery] = useState<string>('');
  const [isEditingFlowcharts, setIsEditingFlowcharts] = useState<boolean>(false);
  const [isNewFlowchartModalOpen, setIsNewFlowchartModalOpen] = useState<boolean>(false);
  const [newFlowchartForm, setNewFlowchartForm] = useState({ title: '', subject: 'Clinical Algorithm', summary: '' });

  // Component Resizing Options for all dashboard components
  const [noteMakerWidthRatio, setNoteMakerWidthRatio] = useState<'50' | '60' | '70' | '100'>('60');
  const [splitPercent, setSplitPercent] = useState<number>(60);
  const [isDraggingSplitter, setIsDraggingSplitter] = useState<boolean>(false);
  const duoContainerRef = useRef<HTMLDivElement>(null);

  const handleDuoSplitterPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDraggingSplitter(true);

    const onPointerMove = (moveEvt: PointerEvent) => {
      if (!duoContainerRef.current) return;
      const rect = duoContainerRef.current.getBoundingClientRect();
      const rawPct = ((moveEvt.clientX - rect.left) / rect.width) * 100;
      const clamped = Math.min(85, Math.max(25, Math.round(rawPct)));
      setSplitPercent(clamped);
    };

    const onPointerUp = () => {
      setIsDraggingSplitter(false);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };
  const [bookCardHeight, setBookCardHeight] = useState<'compact' | 'normal' | 'tall'>('normal');
  const [flowchartCardHeight, setFlowchartCardHeight] = useState<'compact' | 'normal' | 'tall'>('normal');
  const [youtubeCardHeight, setYoutubeCardHeight] = useState<'compact' | 'normal' | 'tall'>('compact');
  const [isBookPickerOpen, setIsBookPickerOpen] = useState<boolean>(false);

  // Editor Sub-modes (Inside Window 3)
  const [editorMode, setEditorMode] = useState<'type' | 'pen' | 'split'>('type');
  const [selectedTextColor, setSelectedTextColor] = useState('#0f172a');
  const [selectedHighlightColor, setSelectedHighlightColor] = useState('#fef08a');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showPaperDropdown, setShowPaperDropdown] = useState(false);
  const [showClinicalTemplates, setShowClinicalTemplates] = useState(false);

  // Window 1 (PDF 1 - Primary Textbook)
  const [pdf1BookId, setPdf1BookId] = useState<string>(books[0]?.id || 'book-osteoporosis');
  const [pdf1PageIndex, setPdf1PageIndex] = useState<number>(0);
  const [pdf1Zoom, setPdf1Zoom] = useState<number>(100);
  const [pdf1SearchQuery, setPdf1SearchQuery] = useState<string>('');
  const [pdf1TocOpen, setPdf1TocOpen] = useState<boolean>(false);

  // Window 2 (PDF 2 - Secondary Reference / Practical / First Aid)
  const [pdf2BookId, setPdf2BookId] = useState<string>(books[1]?.id || books[0]?.id || 'book-cal-practical');
  const [pdf2PageIndex, setPdf2PageIndex] = useState<number>(0);
  const [pdf2Zoom, setPdf2Zoom] = useState<number>(100);
  const [pdf2SearchQuery, setPdf2SearchQuery] = useState<string>('');
  const [syncScroll, setSyncScroll] = useState<boolean>(false);

  // Window 4 (YouTube Corner PIP Study Lecture)
  const [activeVideoIndex, setActiveVideoIndex] = useState<number>(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const [videoCurrentSeconds, setVideoCurrentSeconds] = useState<number>(862); // 14:22 default
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.25);
  const [isPipMinimized, setIsPipMinimized] = useState<boolean>(false);
  const [pipCorner, setPipCorner] = useState<'bottom-right' | 'top-right'>('bottom-right');
  const [showPip, setShowPip] = useState<boolean>(false);
  const [isPdfDrawerOpen, setIsPdfDrawerOpen] = useState<boolean>(false);

  // Active Note Font State (supports all 15 master fonts & 6 handwriting fonts)
  const [activeNoteFont, setActiveNoteFont] = useState<string>(() => {
    return localStorage.getItem('medden_app_font') || 'Alata';
  });

  const handleSelectNoteFont = (fontName: string) => {
    setActiveNoteFont(fontName);
    const found = APP_FONTS.find((f) => f.name === fontName);
    if (found) {
      localStorage.setItem('medden_app_font', found.name);
      document.documentElement.style.setProperty('--app-font-family', `${found.cssFamily}, system-ui, sans-serif`);
      if (editorRef.current) {
        editorRef.current.style.fontFamily = found.cssFamily;
      }
    }
  };

  // MS Word-Style Ribbon & Attachments State
  const [ribbonTab, setRibbonTab] = useState<'home' | 'insert' | 'link' | 'summary'>('home');
  const [isAttachPhotoModalOpen, setIsAttachPhotoModalOpen] = useState<boolean>(false);
  const [photoInputUrl, setPhotoInputUrl] = useState<string>('');
  const [photoCaption, setPhotoCaption] = useState<string>('');
  const [linkBookTitle, setLinkBookTitle] = useState<string>(books[0]?.title || "Harrison's Principles of Internal Medicine");
  const [linkChapter, setLinkChapter] = useState<string>('Ch. 248 Adrenal Cortex');
  const [linkPage, setLinkPage] = useState<string>('1420');
  const [linkLine, setLinkLine] = useState<string>('Line 18');
  const [linkAnchorText, setLinkAnchorText] = useState<string>('Cushing Diagnostic Algorithm');
  const [webLinkUrl, setWebLinkUrl] = useState<string>('https://pubmed.ncbi.nlm.nih.gov/');
  const [webLinkTitle, setWebLinkTitle] = useState<string>('PubMed Clinical Trial Reference');
  const [isAttachmentsDrawerOpen, setIsAttachmentsDrawerOpen] = useState<boolean>(false);
  const [attachmentDrawerCategory, setAttachmentDrawerCategory] = useState<'all' | 'links' | 'docs' | 'images' | 'audio' | 'video'>('all');
  const [newAttTitle, setNewAttTitle] = useState<string>('');
  const [newAttUrl, setNewAttUrl] = useState<string>('');
  const [newAttKind, setNewAttKind] = useState<'links' | 'docs' | 'images' | 'audio' | 'video'>('links');

  // 1-Click Maximize / Restore: Esc key listener to quickly restore full view
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && maximizedWindow !== 'none') {
        setMaximizedWindow('none');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [maximizedWindow]);

  const currentVideo = STUDY_VIDEOS[activeVideoIndex];
  const pdf1Book = books.find((b) => b.id === pdf1BookId) || books[0];
  const pdf2Book = books.find((b) => b.id === pdf2BookId) || books[1] || books[0];

  const currentPdf1Page = pdf1Book?.pages[pdf1PageIndex] || pdf1Book?.pages[0];
  const currentPdf2Page = pdf2Book?.pages[pdf2PageIndex] || pdf2Book?.pages[0];

  // Video timer simulation
  useEffect(() => {
    let interval: any;
    if (isVideoPlaying) {
      interval = setInterval(() => {
        setVideoCurrentSeconds((prev) => {
          if (prev >= currentVideo.durationSeconds) {
            setIsVideoPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isVideoPlaying, playbackSpeed, currentVideo.durationSeconds]);

  const formatVideoTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Sync content into contentEditable on page change
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== activePage.contentHtml) {
      editorRef.current.innerHTML = activePage.contentHtml;
    }
  }, [activePageIndex, safeNotebook.id, activePage.id, workspaceLayout]);

  // Execute rich text command
  const execCmd = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      handleContentChange();
    }
  };

  const handleContentChange = () => {
    if (!editorRef.current) return;
    const newHtml = editorRef.current.innerHTML;
    const updatedPages = [...safeNotebook.pages];
    updatedPages[activePageIndex] = {
      ...activePage,
      contentHtml: newHtml,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    onUpdateNotebook({
      ...safeNotebook,
      pages: updatedPages,
      updatedAt: new Date().toISOString().split('T')[0],
    });
  };

  const handleStrokesChange = (strokes: InkStroke[]) => {
    const updatedPages = [...safeNotebook.pages];
    updatedPages[activePageIndex] = {
      ...activePage,
      inkStrokes: strokes,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    onUpdateNotebook({
      ...safeNotebook,
      pages: updatedPages,
      updatedAt: new Date().toISOString().split('T')[0],
    });
  };

  // Insert Clinical Templates
  const handleInsertClinicalBox = (type: 'pearl' | 'warning' | 'rx' | 'ddx' | 'yt-timestamp') => {
    let boxHtml = '';
    if (type === 'pearl') {
      boxHtml = `
        <div style="background-color: #fdf8ee; border-left: 4px solid #a47c43; padding: 10px 14px; margin: 12px 0; border-radius: 4px; color: #5c351c;">
          <strong>★ High-Yield Medical Pearl:</strong> Enter key mechanism, USMLE/NEET question point, or pharmacodynamic trigger.
        </div>
        <p><br/></p>
      `;
    } else if (type === 'warning') {
      boxHtml = `
        <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 10px 14px; margin: 12px 0; border-radius: 4px; color: #991b1b;">
          <strong>⚠ Black Box Warning / Severe Toxicity:</strong> Contraindication, critical drug-drug interaction, or organ risk.
        </div>
        <p><br/></p>
      `;
    } else if (type === 'rx') {
      boxHtml = `
        <div style="background-color: #f8fafc; border: 1.5px dashed #0284c7; padding: 12px 16px; margin: 12px 0; border-radius: 8px; color: #0f172a;">
          <div style="font-weight: bold; color: #0284c7; font-size: 14px; margin-bottom: 6px;">℞ CLINICAL PRESCRIPTION PROTOCOL</div>
          <table style="width: 100%; font-size: 12px; border-collapse: collapse;">
            <tr><td style="padding: 2px 0; width: 120px;"><strong>Drug Name:</strong></td><td>Alendronate Sodium</td></tr>
            <tr><td style="padding: 2px 0;"><strong>Dosage & Route:</strong></td><td>70 mg Oral, Once Weekly</td></tr>
            <tr><td style="padding: 2px 0;"><strong>Directions:</strong></td><td>Take upon waking with 240mL plain water; remain upright ≥30 mins.</td></tr>
            <tr><td style="padding: 2px 0;"><strong>Refills:</strong></td><td>3 months · Check Serum Ca2+ & CrCl</td></tr>
          </table>
        </div>
        <p><br/></p>
      `;
    } else if (type === 'ddx') {
      boxHtml = `
        <div style="margin: 14px 0;">
          <div style="font-weight: bold; font-size: 13px; color: #334155; margin-bottom: 6px;">☤ DIFFERENTIAL DIAGNOSIS MATRIX</div>
          <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
            <thead>
              <tr style="background-color: #e2e8f0; color: #0f172a;">
                <th style="border: 1px solid #cbd5e1; padding: 6px 8px; text-align: left;">Suspected Pathology</th>
                <th style="border: 1px solid #cbd5e1; padding: 6px 8px; text-align: left;">Pathognomonic Sign / Marker</th>
                <th style="border: 1px solid #cbd5e1; padding: 6px 8px; text-align: left;">Gold-Standard Investigation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="border: 1px solid #cbd5e1; padding: 6px 8px;">Postmenopausal Osteoporosis</td>
                <td style="border: 1px solid #cbd5e1; padding: 6px 8px;">Fragility vertebral compression, loss of height</td>
                <td style="border: 1px solid #cbd5e1; padding: 6px 8px;">DEXA Scan (T-Score ≤ -2.5 SD)</td>
              </tr>
              <tr>
                <td style="border: 1px solid #cbd5e1; padding: 6px 8px;">Osteomalacia / Rickets</td>
                <td style="border: 1px solid #cbd5e1; padding: 6px 8px;">Looser zones / pseudofractures, bone pain</td>
                <td style="border: 1px solid #cbd5e1; padding: 6px 8px;">Low 25(OH)D, elevated Alkaline Phosphatase</td>
              </tr>
              <tr>
                <td style="border: 1px solid #cbd5e1; padding: 6px 8px;">Multiple Myeloma</td>
                <td style="border: 1px solid #cbd5e1; padding: 6px 8px;">Punched-out lytic lesions, Bence-Jones proteinuria</td>
                <td style="border: 1px solid #cbd5e1; padding: 6px 8px;">Serum Protein Electrophoresis (M-Spike) + Bone Marrow</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p><br/></p>
      `;
    } else if (type === 'yt-timestamp') {
      const timeStr = formatVideoTime(videoCurrentSeconds);
      boxHtml = `
        <div style="background-color: #fff1f2; border-left: 3px solid #e11d48; padding: 6px 10px; margin: 8px 0; border-radius: 4px; font-size: 12px; color: #9f1239;">
          <strong>[⏱ ${timeStr} · ${currentVideo.channel}]:</strong> <em>"${currentVideo.title}"</em> — enter lecture observation here.
        </div>
        <p><br/></p>
      `;
    }
    execCmd('insertHTML', boxHtml);
    setShowClinicalTemplates(false);
  };

  // Snip quote from PDF 1 or PDF 2 directly into Note Editor
  const handleSnipFromPdf = (bookTitle: string, pageNum: number, textSnippet: string) => {
    const snipHtml = `
      <blockquote style="margin: 10px 0; padding: 8px 12px; background: #f8fafc; border-left: 3px solid #6366f1; border-radius: 4px; font-style: italic; color: #334155; font-size: 13px;">
        "${textSnippet}"
        <div style="margin-top: 4px; font-size: 11px; font-style: normal; color: #64748b; font-family: monospace;">
          — Source: ${bookTitle} (Page ${pageNum})
        </div>
      </blockquote>
      <p><br/></p>
    `;
    execCmd('insertHTML', snipHtml);
    setCopiedAlert(`Snippet from Page ${pageNum} inserted into Note!`);
    setTimeout(() => setCopiedAlert(null), 2500);
  };

  // Page management
  const handleAddPage = () => {
    const newPage: NotePage = {
      id: `p-${Date.now()}`,
      title: `Page ${safeNotebook.pages.length + 1} - Untitled`,
      contentHtml: '<h3>New Clinical Topic</h3><p>Start recording medical observations...</p>',
      inkStrokes: [],
      screenshots: [],
      date: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    const updated = {
      ...safeNotebook,
      pages: [...safeNotebook.pages, newPage],
      activePageIndex: safeNotebook.pages.length,
    };
    onUpdateNotebook(updated);
    onSelectPage(safeNotebook.pages.length);
  };

  const handleDeleteCurrentPage = () => {
    if (safeNotebook.pages.length <= 1) return;
    const filtered = safeNotebook.pages.filter((_, idx) => idx !== activePageIndex);
    const nextIdx = Math.max(0, activePageIndex - 1);
    onUpdateNotebook({
      ...safeNotebook,
      pages: filtered,
      activePageIndex: nextIdx,
    });
    onSelectPage(nextIdx);
  };

  // Attach Photo to Note and Attachment Registry
  const handleAttachPhoto = (photoData: { url: string; caption?: string; name: string }) => {
    const newAttachment: NoteAttachment = {
      id: `att-photo-${Date.now()}`,
      name: photoData.name || 'Clinical Photo',
      type: 'photo',
      url: photoData.url,
      thumbnailUrl: photoData.url,
      caption: photoData.caption,
      addedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const currentAttachments = activePage.attachments || [];
    const updatedAttachments = [newAttachment, ...currentAttachments];

    const photoHtml = `
      <figure class="my-3 p-2 bg-stone-100 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 max-w-lg">
        <img src="${photoData.url}" alt="${photoData.caption || 'Attached clinical photo'}" class="w-full h-auto rounded-lg object-cover max-h-80 shadow-xs" />
        ${photoData.caption ? `<figcaption class="text-xs text-stone-600 dark:text-stone-300 mt-1.5 font-medium italic text-center">📷 ${photoData.caption}</figcaption>` : ''}
      </figure>
      <p><br/></p>
    `;

    execCmd('insertHTML', photoHtml);

    const updatedPages = [...safeNotebook.pages];
    updatedPages[activePageIndex] = {
      ...activePage,
      attachments: updatedAttachments,
      contentHtml: editorRef.current ? editorRef.current.innerHTML : activePage.contentHtml,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    onUpdateNotebook({
      ...safeNotebook,
      pages: updatedPages,
    });
    setCopiedAlert('Photo attached and embedded in note!');
    setTimeout(() => setCopiedAlert(null), 2500);
  };

  // Local Photo file upload input handler
  const handlePhotoFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (dataUrl) {
          handleAttachPhoto({
            url: dataUrl,
            caption: file.name.replace(/\.[^/.]+$/, ''),
            name: file.name,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Sample medical diagram insertion
  const handleInsertSampleDiagram = (type: 'histology' | 'ecg' | 'anatomy') => {
    if (type === 'histology') {
      handleAttachPhoto({
        url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80',
        caption: 'Histopathology: Cellular dysplasia and inflammatory infiltrate (H&E Stain 40x)',
        name: 'Histology Specimen',
      });
    } else if (type === 'ecg') {
      handleAttachPhoto({
        url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80',
        caption: 'Lead II 12-Lead Rhythm Strip: Normal sinus rhythm with PR interval 160ms',
        name: 'ECG Rhythm Strip',
      });
    } else {
      handleAttachPhoto({
        url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80',
        caption: 'Anatomical Morphology: Cross-sectional clinical vascular landmarks',
        name: 'Anatomy Chart',
      });
    }
  };

  // Clinical Table insertion
  const handleInsertClinicalTable = () => {
    const tableHtml = `
      <div class="my-3 overflow-x-auto">
        <table class="w-full text-left text-xs border border-stone-300 dark:border-stone-700 rounded-lg overflow-hidden border-collapse">
          <thead class="bg-stone-100 dark:bg-stone-800 font-semibold text-stone-700 dark:text-stone-300">
            <tr>
              <th class="p-2 border border-stone-300 dark:border-stone-700">Diagnostic Feature</th>
              <th class="p-2 border border-stone-300 dark:border-stone-700">Condition A (Primary)</th>
              <th class="p-2 border border-stone-300 dark:border-stone-700">Condition B (Differential)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="p-2 border border-stone-300 dark:border-stone-700 font-medium">Pathophysiology</td>
              <td class="p-2 border border-stone-300 dark:border-stone-700">Receptor mutation / upregulation</td>
              <td class="p-2 border border-stone-300 dark:border-stone-700">Enzymatic deficiency / clearance</td>
            </tr>
            <tr>
              <td class="p-2 border border-stone-300 dark:border-stone-700 font-medium">Lab Biomarkers</td>
              <td class="p-2 border border-stone-300 dark:border-stone-700">Elevated serum markers</td>
              <td class="p-2 border border-stone-300 dark:border-stone-700">Normal or compensatory low</td>
            </tr>
            <tr>
              <td class="p-2 border border-stone-300 dark:border-stone-700 font-medium">1st-Line Therapy</td>
              <td class="p-2 border border-stone-300 dark:border-stone-700">Targeted agonist / surgery</td>
              <td class="p-2 border border-stone-300 dark:border-stone-700">Supportive / replacement therapy</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p><br/></p>
    `;
    execCmd('insertHTML', tableHtml);
    setCopiedAlert('Differential table inserted!');
    setTimeout(() => setCopiedAlert(null), 2500);
  };

  // Link In-App Document Citation (Harrison's, Robbins, Guyton, etc.)
  const handleInsertDocumentCitation = () => {
    const label = `${linkBookTitle} · ${linkChapter}${linkPage ? ` · p. ${linkPage}` : ''}${linkLine ? ` · L. ${linkLine}` : ''}`;
    const newAttachment: NoteAttachment = {
      id: `att-doc-${Date.now()}`,
      name: linkAnchorText ? `${linkAnchorText} (${label})` : label,
      type: 'document-link',
      targetBook: linkBookTitle,
      targetChapter: linkChapter,
      targetPage: linkPage,
      targetLine: linkLine,
      caption: linkAnchorText || label,
      addedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const currentAttachments = activePage.attachments || [];
    const updatedAttachments = [newAttachment, ...currentAttachments];

    const citationHtml = `
      <span class="inline-flex items-center gap-1 px-2 py-0.5 my-1 rounded-md text-xs font-mono font-medium bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shadow-2xs select-none" contenteditable="false">
        <span>📖</span>
        <span class="font-bold">${linkAnchorText ? `${linkAnchorText} · ` : ''}${label}</span>
      </span>&nbsp;
    `;

    execCmd('insertHTML', citationHtml);

    const updatedPages = [...safeNotebook.pages];
    updatedPages[activePageIndex] = {
      ...activePage,
      attachments: updatedAttachments,
      contentHtml: editorRef.current ? editorRef.current.innerHTML : activePage.contentHtml,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    onUpdateNotebook({
      ...safeNotebook,
      pages: updatedPages,
    });
    setCopiedAlert(`Linked to ${linkBookTitle} (${linkChapter})!`);
    setTimeout(() => setCopiedAlert(null), 2500);
  };

  // Link Web Citation (PubMed, UpToDate, NEJM, Amboss)
  const handleInsertWebCitation = () => {
    if (!webLinkUrl.trim()) return;
    const newAttachment: NoteAttachment = {
      id: `att-web-${Date.now()}`,
      name: webLinkTitle || webLinkUrl,
      type: 'web-link',
      url: webLinkUrl,
      caption: webLinkTitle,
      addedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const currentAttachments = activePage.attachments || [];
    const updatedAttachments = [newAttachment, ...currentAttachments];

    const webHtml = `
      <a href="${webLinkUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 px-2 py-0.5 my-1 rounded-md text-xs font-mono font-medium bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 shadow-2xs hover:underline" contenteditable="false">
        <span>🌐</span>
        <span>${webLinkTitle || webLinkUrl}</span>
        <span class="text-[9px]">↗</span>
      </a>&nbsp;
    `;

    execCmd('insertHTML', webHtml);

    const updatedPages = [...safeNotebook.pages];
    updatedPages[activePageIndex] = {
      ...activePage,
      attachments: updatedAttachments,
      contentHtml: editorRef.current ? editorRef.current.innerHTML : activePage.contentHtml,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    onUpdateNotebook({
      ...safeNotebook,
      pages: updatedPages,
    });
    setCopiedAlert(`Linked to ${webLinkTitle || 'Web'}!`);
    setTimeout(() => setCopiedAlert(null), 2500);
  };

  // Generate / Refresh AI Clinical Summary of Note
  const handleGenerateSummary = () => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = activePage.contentHtml || '';
    const text = tempDiv.innerText || tempDiv.textContent || '';
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 10).slice(0, 4);

    const autoSummary = lines.length > 0
      ? `• Key Mechanism / Pearl: ${lines[0].slice(0, 110)}...\n• Diagnostic / Clinical Significance: ${lines[1] ? lines[1].slice(0, 110) + '...' : 'Correlates with bedside ward presentation and diagnostic workup protocols.'}\n• Board & Exam High-Yield: Critical recall item for USMLE Step 1 / NEET PG clinical scenarios.`
      : `• Clinical Pearl: Core observations summarized for ${activePage.title}.\n• Pathophysiology / Pharmacology: Highlights therapeutic targets, drug actions, and bedside safety markers.\n• Board High-Yield: Essential recall differential for hospital ward rounds.`;

    const updatedPages = [...safeNotebook.pages];
    updatedPages[activePageIndex] = {
      ...activePage,
      summary: autoSummary,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    onUpdateNotebook({
      ...safeNotebook,
      pages: updatedPages,
    });
    setCopiedAlert('AI Clinical Summary generated!');
    setTimeout(() => setCopiedAlert(null), 2500);
  };

  // Delete an attachment
  const handleDeleteAttachment = (attachmentId: string) => {
    const currentAttachments = activePage.attachments || [];
    const updatedAttachments = currentAttachments.filter(a => a.id !== attachmentId);
    const updatedPages = [...safeNotebook.pages];
    updatedPages[activePageIndex] = {
      ...activePage,
      attachments: updatedAttachments,
    };
    onUpdateNotebook({
      ...safeNotebook,
      pages: updatedPages,
    });
  };

  // Paper styling
  const getPaperColorStyle = (color: PaperColor) => {
    switch (color) {
      case 'beige':
        return { backgroundColor: '#fcf8ec', color: '#24201c' };
      case 'white':
        return { backgroundColor: '#faf9f5', color: '#1a1d20' };
      case 'dark':
        return { backgroundColor: '#14171a', color: '#e6e9ec' };
      case 'sepia':
        return { backgroundColor: '#f6f0e2', color: '#26221d' };
      case 'mint':
        return { backgroundColor: '#f2f6f4', color: '#1c2d27' };
      default:
        return { backgroundColor: '#fcf8ec', color: '#24201c' };
    }
  };

  const getPaperBackgroundClasses = (type: PaperType) => {
    switch (type) {
      case 'ruled-thin':
        return 'paper-ruled-thin';
      case 'box-ruled':
        return 'paper-grid';
      case 'dot-grid':
        return 'paper-dots';
      default:
        return '';
    }
  };

  const paperStyle = safeNotebook.customPaperHex
    ? { backgroundColor: safeNotebook.customPaperHex, color: '#0f172a' }
    : safeNotebook.paperColor === 'beige'
    ? { backgroundColor: noteTheme.paperDefaultBg, color: noteTheme.paperDefaultColor }
    : getPaperColorStyle(safeNotebook.paperColor);

  // Export note to clipboard or download markdown
  const handleExportMarkdown = () => {
    const md = `# ${activePage.title}\nDate: ${activePage.date}\nNotebook: ${safeNotebook.title}\n\n${activePage.contentHtml.replace(/<[^>]+>/g, '\n')}`;
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activePage.title.replace(/[^a-zA-Z0-9]/g, '_')}_notes.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="flex-1 flex flex-col h-full w-full overflow-hidden relative transition-colors"
      style={{
        backgroundColor: noteTheme.workspaceBg,
        fontFamily: noteTheme.fontFamily,
      }}
    >
      {/* ========================================================================= */}
      {/* TOP WORKSPACE NAVIGATION & MULTI-WINDOW LAYOUT SELECTOR                  */}
      {/* ========================================================================= */}
      <div
        className="shrink-0 px-3 py-2 border-b flex flex-wrap items-center justify-between gap-2.5 z-20 transition-colors"
        style={{
          borderColor: noteTheme.headerBorder,
          backgroundColor: noteTheme.headerBg,
        }}
      >
        {/* Left: Active Notebook & Subject Indicator (Shelf button removed) */}
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="flex items-center gap-2 px-2.5 py-1 rounded-lg border text-xs font-mono font-medium select-none"
            style={{
              borderColor: `${noteTheme.accentHex}40`,
              color: noteTheme.accentHex,
              backgroundColor: `${noteTheme.accentHex}10`,
            }}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span className="font-bold truncate max-w-[150px] sm:max-w-[200px]">
              {safeNotebook.title}
            </span>
            <span className="text-[10px] opacity-75 hidden md:inline">
              · {safeNotebook.subject}
            </span>
          </div>
        </div>

        {/* Center: Multi-Window Arrangement Presets Selector with Rearrange Option */}
        <div className="flex items-center gap-1 bg-white/80 dark:bg-black/40 p-1 rounded-xl border border-slate-300 dark:border-white/10 flex-wrap shadow-2xs">
          <span className="text-[9.5px] font-mono text-slate-500 dark:text-stone-400 uppercase tracking-wider px-1.5 hidden lg:inline">
            Arrange:
          </span>

          {viewOptionOrder.map((layoutId, index) => {
            const def = VIEW_OPTION_DEFINITIONS[layoutId];
            if (!def) return null;
            const Icon = def.icon;
            const isActive = workspaceLayout === layoutId && maximizedWindow === 'none';

            return (
              <div key={layoutId} className="flex items-center group relative">
                {/* When inline rearrange is active, show Left arrow */}
                {isInlineRearrange && index > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveViewOption(layoutId, 'left');
                    }}
                    className="p-0.5 rounded text-amber-300 hover:text-white hover:bg-white/20 mr-0.5 transition-colors"
                    title={`Move ${def.label} left`}
                  >
                    <ChevronLeft className="w-3 h-3" />
                  </button>
                )}

                <button
                  onClick={() => handleSelectLayout(layoutId)}
                  className={`px-2 py-1 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all active:scale-95 hover:-translate-y-0.5 ${
                    isActive
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'text-slate-700 dark:text-stone-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-white/10'
                  }`}
                  title={def.description}
                >
                  <Icon className={`w-3 h-3 ${def.rotateIcon ? 'rotate-90' : ''}`} />
                  <span className="hidden sm:inline">{def.label}</span>
                </button>

                {/* When inline rearrange is active, show Right arrow */}
                {isInlineRearrange && index < viewOptionOrder.length - 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveViewOption(layoutId, 'right');
                    }}
                    className="p-0.5 rounded text-amber-500 hover:text-amber-600 hover:bg-slate-200/80 dark:hover:bg-white/20 ml-0.5 transition-colors"
                    title={`Move ${def.label} right`}
                  >
                    <ChevronRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}

          {/* Rearrange Options Action Buttons */}
          <div className="flex items-center gap-0.5 ml-1 pl-1 border-l border-slate-300 dark:border-white/15">
            <button
              onClick={() => setIsInlineRearrange(!isInlineRearrange)}
              className={`p-1 px-1.5 rounded-lg text-[10.5px] font-mono flex items-center gap-1 transition-all border ${
                isInlineRearrange
                  ? 'bg-amber-400 text-stone-950 border-amber-300 font-bold shadow-2xs'
                  : 'text-slate-700 dark:text-stone-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-white/10 border-slate-300 dark:border-white/10'
              }`}
              title={isInlineRearrange ? 'Done rearranging views' : 'Rearrange view options order (inline)'}
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span className="hidden xl:inline">{isInlineRearrange ? 'Done' : 'Rearrange'}</span>
            </button>

            <button
              onClick={() => setIsRearrangeModalOpen(true)}
              className="p-1 rounded-lg text-slate-700 dark:text-stone-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-white/10 transition-colors"
              title="Open View Options Rearrange Manager Modal"
            >
              <ArrowUpDown className="w-3 h-3" />
            </button>
          </div>

          {/* 1-Click Restore Layout Button when any window is maximized */}
          {maximizedWindow !== 'none' && (
            <button
              onClick={() => setMaximizedWindow('none')}
              className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-amber-500 text-slate-950 border border-amber-400 flex items-center gap-1.5 transition-all shadow-md active:scale-95 hover:bg-amber-400"
              title="1-Click Restore to active layout preset (or press Esc)"
            >
              <Minimize2 className="w-3 h-3" />
              <span>Restore Layout</span>
            </button>
          )}
        </div>

        {/* Right: Study Desk & Library Ambiance Controls & Alert Pill */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Desk Lamp Button */}
          <button
            onClick={handleToggleDeskLamp}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
              isDeskLampOn
                ? 'bg-amber-400 text-stone-950 border-amber-300 shadow-sm shadow-amber-400/40 ring-2 ring-amber-300/30'
                : 'bg-stone-200/80 dark:bg-stone-800 text-stone-500 border-stone-300 dark:border-stone-700'
            }`}
            title="Toggle Warm Library Desk Lamp reading spotlight"
          >
            <span>💡</span>
            <span className="hidden sm:inline">Desk Lamp: {isDeskLampOn ? 'ON' : 'OFF'}</span>
          </button>

          {/* Desk Surface Selector */}
          <div className="flex items-center gap-0.5 bg-stone-100 dark:bg-[#161a22] p-0.5 rounded-lg border border-stone-200 dark:border-stone-800 text-[10px] font-mono">
            {[
              { id: 'mahogany', label: 'Mahogany Desk', icon: '🪵' },
              { id: 'oxford', label: 'Oxford Library', icon: '🏛️' },
              { id: 'nordic', label: 'Nordic Study', icon: '☕' },
            ].map((d) => (
              <button
                key={d.id}
                onClick={() => handleSelectDeskVibe(d.id as any)}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer flex items-center gap-1 ${
                  deskVibe === d.id
                    ? 'bg-amber-800 text-white font-bold shadow-2xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
                title={`Switch study desk to ${d.label} style`}
              >
                <span>{d.icon}</span>
                <span className="hidden md:inline">{d.label}</span>
              </button>
            ))}
          </div>

          {copiedAlert && (
            <span className="text-[10px] font-mono text-amber-200 bg-amber-950/85 border border-amber-500/50 px-2 py-0.5 rounded-full animate-pulse">
              ✓ {copiedAlert}
            </span>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MAIN 4-WINDOW WORKSPACE CANVAS                                           */}
      {/* ========================================================================= */}
      <div
        className="flex-1 overflow-hidden relative p-2.5 transition-colors"
        style={{
          backgroundColor: noteTheme.workspaceBg,
        }}
      >
        {/* Render Single Window if Maximized */}
        {maximizedWindow === 'pdf1' && (
          <div className="h-full w-full">
            {renderWindow1PdfPrimary(true)}
          </div>
        )}

        {maximizedWindow === 'pdf2' && (
          <div className="h-full w-full">
            {renderWindow2PdfSecondary(true)}
          </div>
        )}

        {maximizedWindow === 'note' && (
          <div className="h-full w-full">
            {renderWindow3NoteMaker(true)}
          </div>
        )}

        {maximizedWindow === 'youtube' && (
          <div className="h-full w-full">
            {renderWindow4YouTubePip(true)}
          </div>
        )}

        {/* Multi-Window Presets when not maximized */}
        {maximizedWindow === 'none' && (
          <>
            {/* 0. CLASSIC DUO LAYOUT (WITH FLOWCHART SEGMENT & RESIZE CONTROLS) */}
            {workspaceLayout === 'classic-duo' && (
              <div
                ref={duoContainerRef}
                className="flex flex-col lg:flex-row h-full w-full overflow-hidden p-2 sm:p-3 relative"
              >
                {/* Left Side: Large Lined Notebook Pad with Dynamic Drag & Hover-Stretch Width */}
                <div
                  className="h-full overflow-hidden min-h-0 flex flex-col transition-all duration-75"
                  style={{
                    width: noteMakerWidthRatio === '100' ? '100%' : `${splitPercent}%`,
                    flex: 'none',
                  }}
                >
                  {renderScreenshotLinedNoteMaker()}
                </div>

                {/* Mouse Cursor Hover Stretch Resizer Boundary Joystick */}
                {noteMakerWidthRatio !== '100' && (
                  <div
                    onPointerDown={handleDuoSplitterPointerDown}
                    onDoubleClick={() => setSplitPercent(60)}
                    title="Slide to stretch/resize panels · Double-click to reset (60%)"
                    className={`hidden lg:flex flex-col justify-center items-center w-2.5 hover:w-3.5 mx-1 my-2 rounded-full cursor-col-resize select-none transition-all group shrink-0 ${
                      isDraggingSplitter
                        ? 'bg-sky-500 shadow-md ring-2 ring-sky-400/40'
                        : 'bg-stone-300/60 dark:bg-stone-700/60 hover:bg-sky-500/70'
                    }`}
                  >
                    <div className="w-1 h-8 rounded-full bg-stone-400 dark:bg-stone-500 group-hover:bg-white transition-colors flex flex-col items-center justify-center gap-1">
                      <span className="w-0.5 h-0.5 rounded-full bg-stone-600 dark:bg-stone-300 group-hover:bg-white" />
                      <span className="w-0.5 h-0.5 rounded-full bg-stone-600 dark:bg-stone-300 group-hover:bg-white" />
                      <span className="w-0.5 h-0.5 rounded-full bg-stone-600 dark:bg-stone-300 group-hover:bg-white" />
                    </div>
                  </div>
                )}

                {/* Right Side: Companion Cards (Flow chart, Book Reader & YouTube Search) */}
                {noteMakerWidthRatio !== '100' && (
                  <div
                    className="flex flex-col gap-4 h-full overflow-y-auto custom-scrollbar shrink-0 transition-all duration-75 flex-1 min-w-0"
                  >
                    {/* 1. New Flow chart Segment */}
                    {renderFlowchartSegment()}

                    {/* 2. Book Reader (with Small Option Button to Open Another Book) */}
                    {renderScreenshotOpenBookCard()}
                  </div>
                )}
              </div>
            )}

            {/* 1. QUAD LAYOUT: Dual PDFs stacked on the left, Note Editor on the right, YouTube PIP in the corner */}
            {workspaceLayout === 'quad' && (
              <div className="flex flex-col lg:flex-row gap-2.5 h-full w-full overflow-hidden">
                {/* Left Column (approx 42%): Dual Stacked PDFs */}
                <div className="w-full lg:w-[42%] xl:w-[40%] flex flex-col gap-2.5 h-full overflow-hidden min-h-0 shrink-0">
                  <div className="flex-1 h-1/2 overflow-hidden min-h-0">
                    {renderWindow1PdfPrimary(false)}
                  </div>
                  <div className="flex-1 h-1/2 overflow-hidden min-h-0">
                    {renderWindow2PdfSecondary(false)}
                  </div>
                </div>

                {/* Right Column: Note Editor */}
                <div className="flex-1 h-full overflow-hidden relative min-h-0">
                  {renderWindow3NoteMaker(false)}
                </div>
              </div>
            )}

            {/* 2. TRIPLE COLUMN LAYOUT: PDF 1 | Note Editor | PDF 2 with floating PIP */}
            {workspaceLayout === 'triple' && (
              <div className="flex flex-col lg:flex-row gap-2.5 h-full w-full overflow-hidden">
                {/* Column 1: PDF 1 */}
                <div className="w-full lg:w-[28%] xl:w-[29%] h-full overflow-hidden min-h-0 shrink-0">
                  {renderWindow1PdfPrimary(false)}
                </div>
                {/* Column 2: Note Editor (Center) */}
                <div className="flex-1 h-full overflow-hidden relative min-h-0">
                  {renderWindow3NoteMaker(false)}
                </div>
                {/* Column 3: PDF 2 */}
                <div className="w-full lg:w-[28%] xl:w-[29%] h-full overflow-hidden min-h-0 shrink-0">
                  {renderWindow2PdfSecondary(false)}
                </div>
              </div>
            )}

            {/* 3. STACKED HORIZON LAYOUT: Dual PDFs side-by-side on top, Note Editor spanning the full bottom */}
            {workspaceLayout === 'dual-top' && (
              <div className="flex flex-col gap-2.5 h-full w-full overflow-hidden">
                {/* Top Half: Dual PDFs side-by-side */}
                <div className="h-[46%] flex flex-col sm:flex-row gap-2.5 overflow-hidden min-h-0 shrink-0">
                  <div className="flex-1 h-full overflow-hidden min-h-0">
                    {renderWindow1PdfPrimary(false)}
                  </div>
                  <div className="flex-1 h-full overflow-hidden min-h-0">
                    {renderWindow2PdfSecondary(false)}
                  </div>
                </div>

                {/* Bottom Half: Note Editor spanning full bottom */}
                <div className="flex-1 h-[54%] overflow-hidden relative min-h-0">
                  {renderWindow3NoteMaker(false)}
                </div>
              </div>
            )}

            {/* 4. FOCUS NOTE LAYOUT: Wide synthesis desk with collapsible PDF drawer */}
            {workspaceLayout === 'focus-note' && (
              <div className="flex flex-row gap-2.5 h-full w-full overflow-hidden relative">
                {/* Collapsible PDF Drawer */}
                {isPdfDrawerOpen ? (
                  <div className="w-full sm:w-64 md:w-80 lg:w-[27%] xl:w-[25%] flex flex-col gap-2 h-full overflow-hidden shrink-0 z-20 animate-in slide-in-from-left duration-200">
                    <div className="flex items-center justify-between bg-white/90 dark:bg-black/50 p-1.5 rounded-xl border border-slate-300 dark:border-white/10 shrink-0 shadow-2xs">
                      <div className="flex items-center gap-1 flex-1">
                        <button
                          onClick={() => setPdf1TocOpen(false)}
                          className={`flex-1 py-1 rounded-lg text-xs font-mono font-medium truncate ${
                            !pdf1TocOpen ? 'bg-blue-600 text-white font-bold shadow-xs' : 'text-slate-600 dark:text-stone-400 hover:text-slate-950 dark:hover:text-white'
                          }`}
                        >
                          PDF 1
                        </button>
                        <button
                          onClick={() => setPdf1TocOpen(true)}
                          className={`flex-1 py-1 rounded-lg text-xs font-mono font-medium truncate ${
                            pdf1TocOpen ? 'bg-blue-600 text-white font-bold shadow-xs' : 'text-slate-600 dark:text-stone-400 hover:text-slate-950 dark:hover:text-white'
                          }`}
                        >
                          PDF 2
                        </button>
                      </div>
                      <button
                        onClick={() => setIsPdfDrawerOpen(false)}
                        className="px-2 py-1 rounded-lg hover:bg-slate-200/70 dark:hover:bg-white/10 text-slate-600 dark:text-stone-400 hover:text-slate-950 dark:hover:text-white ml-1 text-xs font-mono flex items-center gap-1 transition-colors"
                        title="Collapse PDF Drawer to 100% Wide Desk"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span className="text-[10px]">Collapse</span>
                      </button>
                    </div>
                    <div className="flex-1 overflow-hidden min-h-0">
                      {!pdf1TocOpen ? renderWindow1PdfPrimary(false) : renderWindow2PdfSecondary(false)}
                    </div>
                  </div>
                ) : (
                  /* Slide-out Drawer trigger button when collapsed */
                  <button
                    onClick={() => setIsPdfDrawerOpen(true)}
                    className="absolute top-2 left-2 z-20 px-3 py-1.5 rounded-xl bg-white/90 dark:bg-slate-900/90 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-white border border-slate-300 dark:border-white/20 text-xs font-mono flex items-center gap-1.5 shadow-xl backdrop-blur-md transition-all hover:scale-105 active:scale-95"
                    title="Expand Collapsible PDF Reference Drawer"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />
                    <span>Open PDF Drawer</span>
                  </button>
                )}

                {/* Wide synthesis desk (spans full width if drawer collapsed) */}
                <div className="flex-1 h-full overflow-hidden relative min-h-0">
                  {renderWindow3NoteMaker(false)}
                </div>
              </div>
            )}

          </>
        )}

      {/* ========================================================================= */}
      {/* REARRANGE VIEW OPTIONS MODAL                                             */}
      {/* ========================================================================= */}
      {isRearrangeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white dark:bg-[#0f1422] rounded-2xl border border-stone-200 dark:border-[#1e2a40] shadow-2xl p-5 flex flex-col gap-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-[#1e2a40]">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-blue-600 dark:text-sky-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">
                  Rearrange View Options
                </h3>
              </div>
              <button
                onClick={() => setIsRearrangeModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-slate-800 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-zinc-400">
              Customize the arrangement order of multi-window workspace buttons. Focus Note is positioned first by default.
            </p>

            <div className="space-y-2">
              {viewOptionOrder.map((id, index) => {
                const def = VIEW_OPTION_DEFINITIONS[id];
                if (!def) return null;
                const Icon = def.icon;
                return (
                  <div
                    key={id}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-stone-200 dark:border-[#1d273a] bg-stone-50 dark:bg-[#131a2b] shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-5 h-5 rounded-full bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-zinc-200 text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                        {index + 1}
                      </span>
                      <Icon className={`w-4 h-4 text-blue-600 dark:text-sky-400 shrink-0 ${def.rotateIcon ? 'rotate-90' : ''}`} />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-800 dark:text-zinc-100 truncate">
                          {def.label}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-zinc-400 truncate">
                          {def.description}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {index > 0 && (
                        <button
                          onClick={() => moveViewOption(id, 'left')}
                          className="p-1 rounded bg-stone-200/60 dark:bg-stone-800 text-stone-700 dark:text-zinc-300 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                          title="Move Left / Earlier"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {index < viewOptionOrder.length - 1 && (
                        <button
                          onClick={() => moveViewOption(id, 'right')}
                          className="p-1 rounded bg-stone-200/60 dark:bg-stone-800 text-stone-700 dark:text-zinc-300 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                          title="Move Right / Later"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {index !== 0 && (
                        <button
                          onClick={() => moveViewOptionToFirst(id)}
                          className="px-1.5 py-0.5 rounded text-[9.5px] font-mono font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-sky-300 border border-blue-200 dark:border-blue-900/50 hover:bg-blue-100 transition-colors"
                          title="Set as First View"
                        >
                          Set First
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-stone-200 dark:border-[#1e2a40]">
              <button
                onClick={resetViewOptionsOrder}
                className="flex items-center gap-1 text-xs text-stone-500 hover:text-stone-800 dark:hover:text-zinc-200 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset (Focus Note #1)</span>
              </button>

              <button
                onClick={() => setIsRearrangeModalOpen(false)}
                className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors shadow-2xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1. ATTACH PHOTO MODAL */}
      {isAttachPhotoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#151a22] border border-stone-200 dark:border-[#252e3b] rounded-2xl p-5 shadow-2xl max-w-md w-full space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-[#252e3b] pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-[#8f5f2c] dark:text-amber-300">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-stone-100">
                    Attach Clinical Photo or Figure
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Embed image into note & record in attachment gallery
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAttachPhotoModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Image Web URL or Direct Link:
                </label>
                <input
                  type="text"
                  value={photoInputUrl}
                  onChange={(e) => setPhotoInputUrl(e.target.value)}
                  placeholder="https://example.com/clinical_image.jpg"
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-[#11151b] border border-stone-300 dark:border-[#2a3443] text-xs outline-none focus:border-amber-500 text-stone-900 dark:text-stone-100"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Or Upload Local File:
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    handlePhotoFileInput(e);
                    setIsAttachPhotoModalOpen(false);
                  }}
                  className="w-full text-xs text-stone-600 dark:text-stone-400 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-[#8f5f2c] hover:file:bg-amber-100 dark:file:bg-amber-950/60 dark:file:text-amber-300"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Clinical Caption (Optional):
                </label>
                <input
                  type="text"
                  value={photoCaption}
                  onChange={(e) => setPhotoCaption(e.target.value)}
                  placeholder="e.g. Figure 1: Renal biopsy showing crescentic glomerulonephritis"
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-[#11151b] border border-stone-300 dark:border-[#2a3443] text-xs outline-none focus:border-amber-500 text-stone-900 dark:text-stone-100"
                />
              </div>

              {/* Sample Medical Photos Quick Pick */}
              <div>
                <span className="text-[10px] font-mono text-stone-400 uppercase block mb-1.5">
                  Or 1-Click Medical Samples:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Histology', url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=400&q=80', cap: 'H&E Cellular Dysplasia 40x' },
                    { label: 'ECG Lead II', url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=400&q=80', cap: 'Lead II 12-Lead Rhythm Strip' },
                    { label: 'Anatomy', url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=400&q=80', cap: 'Clinical Anatomy Vascular Map' },
                  ].map((sample) => (
                    <button
                      key={sample.label}
                      type="button"
                      onClick={() => {
                        setPhotoInputUrl(sample.url);
                        setPhotoCaption(sample.cap);
                      }}
                      className="p-1.5 rounded-lg border border-stone-200 dark:border-[#252e3b] bg-stone-50 dark:bg-[#141820] hover:border-amber-500 text-[10px] font-medium text-stone-700 dark:text-stone-300 text-center cursor-pointer"
                    >
                      {sample.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200 dark:border-[#252e3b]">
              <button
                onClick={() => setIsAttachPhotoModalOpen(false)}
                className="px-3 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (photoInputUrl.trim()) {
                    handleAttachPhoto({
                      url: photoInputUrl.trim(),
                      caption: photoCaption.trim() || undefined,
                      name: photoCaption.trim() || 'Clinical Figure',
                    });
                    setPhotoInputUrl('');
                    setPhotoCaption('');
                    setIsAttachPhotoModalOpen(false);
                  }
                }}
                disabled={!photoInputUrl.trim()}
                className="px-4 py-1.5 rounded-xl bg-[#8f5f2c] hover:bg-[#754b20] text-white text-xs font-bold shadow-xs disabled:opacity-50 cursor-pointer"
              >
                Attach Photo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. SUMMARY & ATTACHMENTS INSPECTOR DRAWER */}
      {isAttachmentsDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-[#fcfbf8] dark:bg-[#13171e] border-l border-stone-200 dark:border-[#242b35] h-full w-full max-w-md flex flex-col shadow-2xl p-5 overflow-y-auto space-y-5">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-[#242b35]">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-stone-100">
                    Summary & Attachments Inspector
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    {safeNotebook.title} · Page {activePageIndex + 1}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAttachmentsDrawerOpen(false)}
                className="p-1.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* SECTION 1: AI Clinical Summary */}
            <div className="space-y-2 p-3.5 rounded-2xl bg-amber-50/60 dark:bg-[#1b1c24] border border-amber-200/80 dark:border-[#302b3e]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Clinical Summary Pearls</span>
                </span>
                <button
                  onClick={handleGenerateSummary}
                  className="text-[10.5px] font-semibold text-amber-700 dark:text-amber-300 hover:underline cursor-pointer"
                >
                  Refresh
                </button>
              </div>
              <p className="text-xs text-stone-700 dark:text-stone-300 whitespace-pre-line leading-relaxed font-mono">
                {activePage.summary || 'Click "Generate / Refresh AI Summary" in the ribbon to synthesize clinical pearls from this note.'}
              </p>
            </div>

            {/* CATEGORY SWITCHER TABS: Links, Docs, Images, Audio, Video per user instruction */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-stone-200 dark:border-stone-800 custom-scrollbar">
              {[
                { key: 'all', label: 'All Resources' },
                { key: 'links', label: 'Links 🔗' },
                { key: 'docs', label: 'Docs 📄' },
                { key: 'images', label: 'Images 🖼️' },
                { key: 'audio', label: 'Audio 🎙️' },
                { key: 'video', label: 'Video 🎬' },
              ].map((cat) => (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setAttachmentDrawerCategory(cat.key as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    attachmentDrawerCategory === cat.key
                      ? 'bg-amber-600 text-white shadow-2xs font-bold'
                      : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-stone-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Quick Add Attachment Bar */}
            <div className="p-3 rounded-2xl bg-amber-50/70 dark:bg-[#1a202c] border border-amber-200/70 dark:border-amber-900/40 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-amber-950 dark:text-amber-200">
                <span className="flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-amber-600" />
                  <span>Attach New Resource</span>
                </span>
                <select
                  value={newAttKind}
                  onChange={(e) => setNewAttKind(e.target.value as any)}
                  className="text-[11px] font-semibold bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg px-2 py-0.5 text-stone-800 dark:text-stone-200 cursor-pointer"
                >
                  <option value="links">Links 🔗</option>
                  <option value="docs">Docs 📄</option>
                  <option value="images">Images 🖼️</option>
                  <option value="audio">Audio 🎙️</option>
                  <option value="video">Video 🎬</option>
                </select>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-1.5">
                <input
                  type="text"
                  placeholder={
                    newAttKind === 'links'
                      ? 'Title (e.g. PubMed Trial)'
                      : newAttKind === 'audio'
                      ? 'Audio Title (e.g. S3 Heart Sound)'
                      : newAttKind === 'video'
                      ? 'Video Title (e.g. Lumbar Puncture)'
                      : newAttKind === 'docs'
                      ? 'Doc Title (e.g. Harrison Ch 14)'
                      : 'Image Caption'
                  }
                  value={newAttTitle}
                  onChange={(e) => setNewAttTitle(e.target.value)}
                  className="w-full sm:flex-1 px-2.5 py-1 text-xs rounded-lg bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 outline-none"
                />
                <input
                  type="text"
                  placeholder={newAttKind === 'links' ? 'https://...' : 'URL or Reference Source'}
                  value={newAttUrl}
                  onChange={(e) => setNewAttUrl(e.target.value)}
                  className="w-full sm:flex-1 px-2.5 py-1 text-xs rounded-lg bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!newAttTitle.trim()) return;
                    const newAtt: NoteAttachment = {
                      id: `att-${Date.now()}`,
                      name: newAttTitle.trim(),
                      type: newAttKind === 'links' ? 'web-link' : newAttKind === 'docs' ? 'document-link' : newAttKind === 'images' ? 'photo' : (newAttKind as any),
                      url: newAttUrl.trim() || undefined,
                      addedAt: new Date().toISOString().split('T')[0],
                    };
                    const currentAtts = activePage.attachments || [];
                    const updated = [newAtt, ...currentAtts];
                    const updatedPages = [...safeNotebook.pages];
                    updatedPages[activePageIndex] = {
                      ...activePage,
                      attachments: updated,
                    };
                    onUpdateNotebook({
                      ...safeNotebook,
                      pages: updatedPages,
                    });
                    setNewAttTitle('');
                    setNewAttUrl('');
                    setCopiedAlert('Attachment added!');
                    setTimeout(() => setCopiedAlert(null), 2000);
                  }}
                  className="w-full sm:w-auto px-3.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 cursor-pointer shadow-2xs"
                >
                  Add
                </button>
              </div>
            </div>

            {/* CATEGORIZED LIST FORMAT COLUMN */}
            <div className="space-y-3">
              {/* Combine page attachments with curated medical resources for each category */}
              {(() => {
                const curatedResources: NoteAttachment[] = [
                  {
                    id: 'seed-link-1',
                    name: 'UpToDate: Treatment of Chronic Heart Failure (HFrEF)',
                    type: 'web-link',
                    url: 'https://www.uptodate.com/contents/heart-failure-hfref',
                    addedAt: '2026-11-09',
                  },
                  {
                    id: 'seed-link-2',
                    name: 'PubMed: EMPA-REG Outcome Trial in Type 2 Diabetes',
                    type: 'web-link',
                    url: 'https://pubmed.ncbi.nlm.nih.gov/26378288/',
                    addedAt: '2026-11-09',
                  },
                  {
                    id: 'seed-doc-1',
                    name: "Harrison's Principles of Internal Medicine - Ch. 267 Heart Failure",
                    type: 'document-link',
                    targetBook: "Harrison's 21st Ed.",
                    targetChapter: 'Ch. 267',
                    targetPage: '1940',
                    addedAt: '2026-11-09',
                  },
                  {
                    id: 'seed-doc-2',
                    name: 'Robbins & Cotran Pathologic Basis of Disease - Atherosclerosis Plaque Morphology',
                    type: 'document-link',
                    targetBook: 'Robbins Pathology 10th Ed.',
                    targetChapter: 'Ch. 11',
                    targetPage: '492',
                    addedAt: '2026-11-09',
                  },
                  {
                    id: 'seed-img-1',
                    name: 'Histopathology: Cardiac Myocyte Hypertrophy (H&E Stain 40x)',
                    type: 'photo',
                    url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80',
                    caption: 'Cardiac Myocyte Hypertrophy with Boxcar Nuclei',
                    addedAt: '2026-11-09',
                  },
                  {
                    id: 'seed-img-2',
                    name: 'Chest Radiograph: Cardiomegaly and Pulmonary Venous Congestion',
                    type: 'photo',
                    url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80',
                    caption: 'AP Chest Radiograph with Kerley B Lines',
                    addedAt: '2026-11-09',
                  },
                  {
                    id: 'seed-aud-1',
                    name: 'Auscultation: S3 Ventricular Gallop Stethoscope Audio',
                    type: 'audio',
                    duration: '01:25 min · 44.1 kHz High Fidelity',
                    url: 'https://medden.workspace/audio/s3-gallop.mp3',
                    addedAt: '2026-11-09',
                  },
                  {
                    id: 'seed-aud-2',
                    name: 'Clinical Pearl: S4 Atrial Kick vs S3 Fluid Overload Distinctions',
                    type: 'audio',
                    duration: '02:10 min · Ward Round Voice Memo',
                    url: 'https://medden.workspace/audio/s4-lecture.mp3',
                    addedAt: '2026-11-09',
                  },
                  {
                    id: 'seed-vid-1',
                    name: 'OSCE Clinical Tutorial: Complete 12 Cranial Nerves Bedside Exam',
                    type: 'video',
                    duration: '04:15 min · 1080p Clinical Masterclass',
                    url: 'https://medden.workspace/video/cranial-nerves.mp4',
                    addedAt: '2026-11-09',
                  },
                  {
                    id: 'seed-vid-2',
                    name: 'Procedural Video: Diagnostic Lumbar Puncture Sterile Technique',
                    type: 'video',
                    duration: '06:30 min · Step-by-Step Resident Guide',
                    url: 'https://medden.workspace/video/lumbar-puncture.mp4',
                    addedAt: '2026-11-09',
                  },
                ];

                const allItems = [...(activePage.attachments || []), ...curatedResources];
                const filtered = allItems.filter((item) => {
                  if (attachmentDrawerCategory === 'all') return true;
                  if (attachmentDrawerCategory === 'links') return item.type === 'web-link' || item.type === 'link';
                  if (attachmentDrawerCategory === 'docs') return item.type === 'document-link' || item.type === 'doc';
                  if (attachmentDrawerCategory === 'images') return item.type === 'photo';
                  if (attachmentDrawerCategory === 'audio') return item.type === 'audio';
                  if (attachmentDrawerCategory === 'video') return item.type === 'video';
                  return true;
                });

                if (filtered.length === 0) {
                  return (
                    <div className="p-8 text-center text-xs text-stone-400 border border-dashed border-stone-300 dark:border-stone-800 rounded-2xl">
                      No attachments in category "{attachmentDrawerCategory}". Use the Add form above to attach files.
                    </div>
                  );
                }

                return (
                  <div className="divide-y divide-stone-200/80 dark:divide-stone-800/80 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden bg-white dark:bg-[#14181f]">
                    {filtered.map((item) => {
                      const isLink = item.type === 'web-link' || item.type === 'link';
                      const isDoc = item.type === 'document-link' || item.type === 'doc';
                      const isImage = item.type === 'photo';
                      const isAudio = item.type === 'audio';
                      const isVideo = item.type === 'video';

                      return (
                        <div
                          key={item.id}
                          className="p-3 flex items-center justify-between gap-3 hover:bg-stone-50 dark:hover:bg-[#181d26] transition-colors"
                        >
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            {/* Icon or Thumbnail */}
                            <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center font-bold overflow-hidden border border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-800">
                              {isLink && <Globe className="w-4 h-4 text-amber-700 dark:text-amber-400" />}
                              {isDoc && <FileText className="w-4 h-4 text-blue-600" />}
                              {isImage && (
                                item.url ? (
                                  <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                                ) : (
                                  <ImageIcon className="w-4 h-4 text-indigo-600" />
                                )
                              )}
                              {isAudio && <Mic className="w-4 h-4 text-purple-600" />}
                              {isVideo && <Video className="w-4 h-4 text-rose-600" />}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">
                                  {item.name}
                                </span>
                                <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full uppercase font-bold shrink-0 ${
                                  isLink ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300' :
                                  isDoc ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300' :
                                  isImage ? 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300' :
                                  isAudio ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300' :
                                  'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300'
                                }`}>
                                  {isLink ? 'Link' : isDoc ? 'Doc' : isImage ? 'Image' : isAudio ? 'Audio' : 'Video'}
                                </span>
                              </div>
                              <p className="text-[10px] text-stone-500 dark:text-stone-400 truncate mt-0.5 font-mono">
                                {item.caption || item.url || item.duration || `${item.targetBook || ''} ${item.targetChapter || ''}`}
                              </p>
                            </div>
                          </div>

                          {/* Action Buttons: Insert in Note, Open/Play, Delete */}
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                if (editorRef.current) {
                                  const snippet = isLink ? `<p><a href="${item.url || '#'}" target="_blank" class="text-blue-600 underline font-semibold">🔗 ${item.name}</a></p>` :
                                    isDoc ? `<div class="my-2 p-2 rounded-lg bg-blue-50 border border-blue-200 text-xs font-serif font-bold text-blue-900">📖 Reference: ${item.name}</div>` :
                                    isImage ? `<figure class="my-2 p-2 bg-stone-100 rounded-lg border max-w-sm"><img src="${item.url}" class="rounded w-full" /><figcaption class="text-xs text-center text-stone-600 mt-1 italic">${item.caption || item.name}</figcaption></figure>` :
                                    isAudio ? `<div class="my-2 p-2 rounded-lg bg-purple-50 border border-purple-200 text-xs font-mono text-purple-900 flex items-center gap-2">🎙️ Auscultation Audio: ${item.name} (${item.duration || '01:25'})</div>` :
                                    `<div class="my-2 p-2 rounded-lg bg-rose-50 border border-rose-200 text-xs font-mono text-rose-900 flex items-center gap-2">🎬 Clinical Video Tutorial: ${item.name} (${item.duration || '04:15'})</div>`;
                                  editorRef.current.innerHTML += snippet;
                                  setCopiedAlert(`Inserted "${item.name}" into note!`);
                                  setTimeout(() => setCopiedAlert(null), 2000);
                                }
                              }}
                              className="px-2 py-1 rounded-lg text-[10px] font-bold bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer"
                              title="Embed inside current note body"
                            >
                              Insert
                            </button>

                            {isLink && item.url && (
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 hover:text-stone-800 transition-colors"
                                title="Open URL in new tab"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}

                            {(isAudio || isVideo) && (
                              <button
                                type="button"
                                onClick={() => {
                                  setCopiedAlert(`Playing ${isAudio ? 'auscultation audio' : 'clinical video'}: ${item.name}`);
                                  setTimeout(() => setCopiedAlert(null), 2500);
                                }}
                                className="p-1 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-amber-600 hover:text-amber-700 transition-colors cursor-pointer"
                                title="Play media"
                              >
                                <Play className="w-3.5 h-3.5" />
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => handleDeleteAttachment(item.id)}
                              className="p-1 rounded-lg text-[#7f1d1d]/80 hover:text-[#6e1418] hover:bg-[#7f1d1d]/10 dark:text-[#b0363b] dark:hover:text-[#d97074] dark:hover:bg-[#6e171b]/30 transition-colors cursor-pointer"
                              title="Remove attachment"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );

  {/* ========================================================================= */}
  {/* WINDOW 1: PDF VIEWER PANEL 1 (PRIMARY MEDICAL TEXTBOOK)                  */}
  {/* ========================================================================= */}
  function renderWindow1PdfPrimary(isMax: boolean) {
    return (
      <div
        className="flex flex-col h-full w-full rounded-xl overflow-hidden border shadow-lg transition-all"
        style={{
          backgroundColor: noteTheme.windowBg,
          borderColor: isMax ? noteTheme.accentHex : noteTheme.windowBorder,
        }}
      >
        {/* Header Bar */}
        <div
          className="px-2.5 py-1.5 border-b flex items-center justify-between shrink-0"
          style={{
            borderColor: noteTheme.windowHeaderBorder,
            backgroundColor: noteTheme.windowHeaderBg,
          }}
        >
          <div className="flex items-center gap-1.5 min-w-0">
            <span
              className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase"
              style={{
                borderColor: `${noteTheme.accentHex}40`,
                color: noteTheme.accentHex,
                backgroundColor: `${noteTheme.accentHex}15`,
              }}
            >
              PDF 1
            </span>

            {/* Book Selector */}
            <select
              value={pdf1BookId}
              onChange={(e) => {
                setPdf1BookId(e.target.value);
                setPdf1PageIndex(0);
              }}
              className="bg-transparent text-xs font-bold text-white outline-none cursor-pointer truncate max-w-[170px] sm:max-w-[220px]"
            >
              {books.map((b) => (
                <option key={b.id} value={b.id} className="bg-slate-900 text-white">
                  {b.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1">
            {/* Page Jumper */}
            <div className="flex items-center text-xs font-mono text-stone-300">
              <button
                disabled={pdf1PageIndex <= 0}
                onClick={() => setPdf1PageIndex((p) => Math.max(0, p - 1))}
                className="p-1 rounded hover:bg-white/10 disabled:opacity-30 transition-all active:scale-95"
                title="Previous Page"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] px-1">
                {pdf1PageIndex + 1}/{pdf1Book.pages.length}
              </span>
              <button
                disabled={pdf1PageIndex >= pdf1Book.pages.length - 1}
                onClick={() => setPdf1PageIndex((p) => Math.min(pdf1Book.pages.length - 1, p + 1))}
                className="p-1 rounded hover:bg-white/10 disabled:opacity-30 transition-all active:scale-95"
                title="Next Page"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Zoom Controls */}
            <button
              onClick={() => setPdf1Zoom((z) => Math.max(70, z - 10))}
              className="p-1 text-stone-400 hover:text-white rounded hover:bg-white/10 transition-all active:scale-95"
              title="Zoom Out"
            >
              <ZoomOut className="w-3 h-3" />
            </button>
            <span className="text-[9.5px] font-mono text-stone-400">{pdf1Zoom}%</span>
            <button
              onClick={() => setPdf1Zoom((z) => Math.min(150, z + 10))}
              className="p-1 text-stone-400 hover:text-white rounded hover:bg-white/10 transition-all active:scale-95"
              title="Zoom In"
            >
              <ZoomIn className="w-3 h-3" />
            </button>

            {/* 1-Click Maximize / Restore Toggle */}
            <button
              onClick={() => setMaximizedWindow(isMax ? 'none' : 'pdf1')}
              className={`p-1 rounded ml-1 transition-all active:scale-95 flex items-center gap-1 ${
                isMax
                  ? 'bg-amber-500 text-slate-950 font-bold px-2 py-0.5 text-[10px] shadow-sm'
                  : 'text-stone-400 hover:text-white hover:bg-white/10'
              }`}
              title={isMax ? '1-Click Restore Layout (Esc)' : '1-Click Maximize to full viewport'}
            >
              {isMax ? (
                <>
                  <Minimize2 className="w-3 h-3" />
                  <span>Restore</span>
                </>
              ) : (
                <Maximize2 className="w-3 h-3" />
              )}
            </button>
          </div>
        </div>

        {/* Search bar inside PDF 1 */}
        <div className="px-2.5 py-1 bg-black/30 border-b border-white/5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 flex-1 min-w-0 pr-2">
            <Search className="w-3 h-3 text-stone-500" />
            <input
              type="text"
              placeholder="Search textbook keywords..."
              value={pdf1SearchQuery}
              onChange={(e) => setPdf1SearchQuery(e.target.value)}
              className="bg-transparent text-[11px] text-stone-200 outline-none w-full placeholder:text-stone-600"
            />
          </div>
          <button
            onClick={() => {
              if (currentPdf1Page) {
                handleSnipFromPdf(pdf1Book.title, currentPdf1Page.pageNumber, currentPdf1Page.summaryPearl);
              }
            }}
            className="text-[10px] font-mono px-2 py-0.5 rounded border flex items-center gap-1 transition-all active:scale-95 hover:-translate-y-0.5 shrink-0"
            style={{
              borderColor: `${edition.accentHex}40`,
              color: edition.accentHex,
              backgroundColor: `${edition.accentHex}10`,
            }}
            title="Snip high-yield summary pearl into Note"
          >
            <Copy className="w-2.5 h-2.5" />
            <span>Snip Pearl</span>
          </button>
        </div>

        {/* PDF Page Reader Viewport */}
        <div
          className="flex-1 overflow-y-auto p-3.5 bg-[#e5ecf4] dark:bg-[#080b11] text-stone-800 dark:text-stone-200 leading-relaxed text-xs"
          style={{ backgroundColor: '#e5ecf4' }}
        >
          {currentPdf1Page ? (
            <div
              className="max-w-2xl mx-auto bg-stone-950 p-4 rounded-lg border border-white/10 shadow-md select-text"
              style={{ fontSize: `${(pdf1Zoom / 100) * 12}px` }}
            >
              <div className="mb-2 pb-2 border-b border-white/10 flex items-center justify-between text-[10px] text-stone-400 font-mono">
                <span className="uppercase">{pdf1Book.edition}</span>
                <span>Page {currentPdf1Page.pageNumber}</span>
              </div>

              <h2 className="text-base md:text-lg font-bold text-white mb-2 leading-snug">
                {currentPdf1Page.title}
              </h2>

              {/* High Yield Callout Box */}
              <div
                className="p-2.5 rounded mb-3 border text-xs"
                style={{
                  backgroundColor: `${noteTheme.accentHex}10`,
                  borderColor: `${noteTheme.accentHex}30`,
                  color: noteTheme.accentLightHex,
                }}
              >
                <div className="font-bold flex items-center justify-between mb-1">
                  <span>★ Pearl / High-Yield Hook:</span>
                  <button
                    onClick={() => handleSnipFromPdf(pdf1Book.title, currentPdf1Page.pageNumber, currentPdf1Page.summaryPearl)}
                    className="text-[9.5px] underline hover:opacity-80 transition-opacity"
                  >
                    + Insert to Note
                  </button>
                </div>
                <p className="text-[11px] leading-relaxed">{currentPdf1Page.summaryPearl}</p>
              </div>

              {/* Render HTML Content */}
              <div
                className="space-y-3 prose prose-invert prose-xs max-w-none"
                dangerouslySetInnerHTML={{ __html: currentPdf1Page.contentHtml }}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-stone-500 font-mono text-xs">
              No page selected.
            </div>
          )}
        </div>
      </div>
    );
  }

  {/* ========================================================================= */}
  {/* WINDOW 2: PDF VIEWER PANEL 2 (SECONDARY REFERENCE / CAL MANUAL / FIRST AID)*/}
  {/* ========================================================================= */}
  function renderWindow2PdfSecondary(isMax: boolean) {
    return (
      <div
        className="flex flex-col h-full w-full rounded-xl overflow-hidden border shadow-lg transition-all"
        style={{
          backgroundColor: noteTheme.windowBg,
          borderColor: isMax ? noteTheme.accentHex : noteTheme.windowBorder,
        }}
      >
        {/* Header Bar */}
        <div
          className="px-2.5 py-1.5 border-b flex items-center justify-between shrink-0"
          style={{
            borderColor: noteTheme.windowHeaderBorder,
            backgroundColor: noteTheme.windowHeaderBg,
          }}
        >
          <div className="flex items-center gap-1.5 min-w-0">
            <span
              className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase"
              style={{
                borderColor: `${noteTheme.accentHex}40`,
                color: noteTheme.accentHex,
                backgroundColor: `${noteTheme.accentHex}15`,
              }}
            >
              PDF 2 (REF)
            </span>

            {/* Reference Book Selector */}
            <select
              value={pdf2BookId}
              onChange={(e) => {
                setPdf2BookId(e.target.value);
                setPdf2PageIndex(0);
              }}
              className="bg-transparent text-xs font-bold text-white outline-none cursor-pointer truncate max-w-[170px] sm:max-w-[220px]"
            >
              {books.map((b) => (
                <option key={b.id} value={b.id} className="bg-slate-900 text-white">
                  {b.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1">
            {/* Compare / Sync Page turns */}
            <button
              onClick={() => setSyncScroll(!syncScroll)}
              className={`p-1 rounded text-[10px] font-mono flex items-center gap-0.5 transition-all ${
                syncScroll ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-stone-400 hover:text-white'
              }`}
              title="Compare Sync Mode"
            >
              <Split className="w-2.5 h-2.5" />
              <span className="hidden xl:inline">{syncScroll ? 'Sync ON' : 'Sync'}</span>
            </button>

            {/* Page Jumper */}
            <div className="flex items-center text-xs font-mono text-stone-300">
              <button
                disabled={pdf2PageIndex <= 0}
                onClick={() => setPdf2PageIndex((p) => Math.max(0, p - 1))}
                className="p-1 rounded hover:bg-white/10 disabled:opacity-30 transition-all active:scale-95"
                title="Previous Page"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] px-1">
                {pdf2PageIndex + 1}/{pdf2Book.pages.length}
              </span>
              <button
                disabled={pdf2PageIndex >= pdf2Book.pages.length - 1}
                onClick={() => setPdf2PageIndex((p) => Math.min(pdf2Book.pages.length - 1, p + 1))}
                className="p-1 rounded hover:bg-white/10 disabled:opacity-30 transition-all active:scale-95"
                title="Next Page"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 1-Click Maximize / Restore Toggle */}
            <button
              onClick={() => setMaximizedWindow(isMax ? 'none' : 'pdf2')}
              className={`p-1 rounded ml-1 transition-all active:scale-95 flex items-center gap-1 ${
                isMax
                  ? 'bg-amber-500 text-slate-950 font-bold px-2 py-0.5 text-[10px] shadow-sm'
                  : 'text-stone-400 hover:text-white hover:bg-white/10'
              }`}
              title={isMax ? '1-Click Restore Layout (Esc)' : '1-Click Maximize to full viewport'}
            >
              {isMax ? (
                <>
                  <Minimize2 className="w-3 h-3" />
                  <span>Restore</span>
                </>
              ) : (
                <Maximize2 className="w-3 h-3" />
              )}
            </button>
          </div>
        </div>

        {/* Page Reader Viewport */}
        <div
          className="flex-1 overflow-y-auto p-3 bg-[#e5ecf4] dark:bg-[#080b11] text-stone-800 dark:text-stone-200 leading-relaxed text-xs"
          style={{ backgroundColor: '#e5ecf4' }}
        >
          {currentPdf2Page ? (
            <div
              className="max-w-2xl mx-auto bg-stone-950 p-4 rounded-lg border border-white/10 shadow-md select-text"
              style={{ fontSize: `${(pdf2Zoom / 100) * 12}px` }}
            >
              <div className="mb-2 pb-1.5 border-b border-white/10 flex items-center justify-between text-[10px] text-stone-400 font-mono">
                <span className="uppercase text-amber-400">{pdf2Book.author}</span>
                <button
                  onClick={() => handleSnipFromPdf(pdf2Book.title, currentPdf2Page.pageNumber, currentPdf2Page.summaryPearl)}
                  className="text-[9.5px] text-amber-400 hover:underline flex items-center gap-1"
                >
                  <Copy className="w-2.5 h-2.5" />
                  <span>Insert to Note</span>
                </button>
              </div>

              <h3 className="text-xs sm:text-sm font-bold text-white mb-2 leading-tight">
                {currentPdf2Page.title}
              </h3>

              <div
                className="space-y-3 prose prose-invert prose-xs max-w-none"
                dangerouslySetInnerHTML={{ __html: currentPdf2Page.contentHtml }}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-stone-500 font-mono text-xs">
              No reference selected.
            </div>
          )}
        </div>
      </div>
    );
  }

  {/* ========================================================================= */}
  {/* MS WORD-STYLE TABBED RIBBON BAR                                           */}
  {/* ========================================================================= */}
  function renderRibbonBar() {
    return (
      <div className="border-b border-stone-200 dark:border-[#252e3b] bg-stone-100/95 dark:bg-[#151a22] text-stone-800 dark:text-stone-200 shrink-0 transition-colors">
        {/* Ribbon Tab Switcher */}
        <div className="flex items-center gap-0.5 px-3 pt-1 border-b border-stone-200/80 dark:border-[#202734] bg-stone-200/50 dark:bg-[#10141b] text-xs font-medium">
          <button
            onClick={() => setRibbonTab('home')}
            className={`px-3 py-1 rounded-t-lg transition-all flex items-center gap-1.5 cursor-pointer text-xs ${
              ribbonTab === 'home'
                ? 'bg-stone-100 dark:bg-[#151a22] text-[#8f5f2c] dark:text-amber-300 font-bold border-t border-l border-r border-stone-200 dark:border-[#252e3b] shadow-2xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-white/5'
            }`}
          >
            <span>Home</span>
          </button>
          <button
            onClick={() => setRibbonTab('insert')}
            className={`px-3 py-1 rounded-t-lg transition-all flex items-center gap-1.5 cursor-pointer text-xs ${
              ribbonTab === 'insert'
                ? 'bg-stone-100 dark:bg-[#151a22] text-[#8f5f2c] dark:text-amber-300 font-bold border-t border-l border-r border-stone-200 dark:border-[#252e3b] shadow-2xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-white/5'
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-[#8f5f2c] dark:text-amber-400" />
            <span>Insert & Attach</span>
          </button>
          <button
            onClick={() => setRibbonTab('link')}
            className={`px-3 py-1 rounded-t-lg transition-all flex items-center gap-1.5 cursor-pointer text-xs ${
              ribbonTab === 'link'
                ? 'bg-stone-100 dark:bg-[#151a22] text-[#8f5f2c] dark:text-amber-300 font-bold border-t border-l border-r border-stone-200 dark:border-[#252e3b] shadow-2xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-white/5'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Link Document & Web</span>
          </button>
          <button
            onClick={() => setRibbonTab('summary')}
            className={`px-3 py-1 rounded-t-lg transition-all flex items-center gap-1.5 cursor-pointer text-xs ${
              ribbonTab === 'summary'
                ? 'bg-stone-100 dark:bg-[#151a22] text-[#8f5f2c] dark:text-amber-300 font-bold border-t border-l border-r border-stone-200 dark:border-[#252e3b] shadow-2xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Summary & Attachments</span>
            {activePage.attachments && activePage.attachments.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono bg-[#8f5f2c] text-white font-bold">
                {activePage.attachments.length}
              </span>
            )}
          </button>

          <div className="ml-auto flex items-center gap-1.5 text-xs">
            <button
              onClick={handleAddPage}
              className="px-2 py-0.5 rounded text-[10.5px] font-semibold bg-white dark:bg-[#1e2530] text-stone-700 dark:text-stone-200 border border-stone-300 dark:border-[#2e3948] hover:bg-stone-50 transition-all flex items-center gap-1 cursor-pointer"
              title="Add New Note Page"
            >
              <Plus className="w-3 h-3" />
              <span>Page ({safeNotebook.pages.length})</span>
            </button>
            {safeNotebook.pages.length > 1 && (
              <button
                onClick={handleDeleteCurrentPage}
                className="p-1 rounded text-[#7f1d1d] hover:bg-[#7f1d1d]/12 dark:text-[#c94a4f] dark:hover:bg-[#6e171b]/30 transition-colors cursor-pointer"
                title="Delete Page"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Tab 1: HOME (Font Styling, Paragraph, Alignments) */}
        {ribbonTab === 'home' && (
          <div className="p-1.5 px-3 flex flex-wrap items-center gap-2 text-xs">
            {/* Font Family Dropdown (15 Fonts including 6 Handwriting Fonts) */}
            <div className="flex items-center gap-1.5 bg-white/85 dark:bg-black/35 p-1 px-2 rounded-lg border border-stone-200 dark:border-stone-700/60 shadow-2xs">
              <Type className="w-3.5 h-3.5 text-stone-500" />
              <select
                value={activeNoteFont}
                onChange={(e) => handleSelectNoteFont(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-800 dark:text-stone-200 outline-none cursor-pointer pr-1"
                title="Change Note Font"
              >
                <optgroup label="✍️ Handwriting Fonts">
                  <option value="Caveat">✍️ Caveat (Natural Cursive)</option>
                  <option value="Kalam">✍️ Kalam (Ballpoint Pen)</option>
                  <option value="Patrick Hand">✍️ Patrick Hand (Neat Print)</option>
                  <option value="Shadows Into Light">✍️ Shadows Into Light (Fine Liner)</option>
                  <option value="Architects Daughter">✍️ Architects Daughter (Blueprint)</option>
                  <option value="Dancing Script">✍️ Dancing Script (Flowing Cursive)</option>
                </optgroup>
                <optgroup label="📄 Clean UI & Reading">
                  <option value="Alata">Alata</option>
                  <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
                  <option value="Inter">Inter</option>
                  <option value="Outfit">Outfit</option>
                  <option value="Poppins">Poppins</option>
                </optgroup>
                <optgroup label="📖 Editorial & Academic Serif">
                  <option value="Playfair Display">Playfair Display</option>
                  <option value="Merriweather">Merriweather</option>
                  <option value="EB Garamond">EB Garamond</option>
                  <option value="Lora">Lora</option>
                </optgroup>
                <optgroup label="💻 Monospace & Precision">
                  <option value="JetBrains Mono">JetBrains Mono</option>
                </optgroup>
              </select>
            </div>

            {/* Font Style Group */}
            <div className="flex items-center gap-0.5 bg-white/70 dark:bg-black/25 p-0.5 rounded-lg border border-stone-200 dark:border-stone-700/60">
              <button onClick={() => execCmd('bold')} className="p-1 rounded hover:bg-stone-200 dark:hover:bg-white/10" title="Bold (Ctrl+B)">
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => execCmd('italic')} className="p-1 rounded hover:bg-stone-200 dark:hover:bg-white/10" title="Italic (Ctrl+I)">
                <Italic className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => execCmd('underline')} className="p-1 rounded hover:bg-stone-200 dark:hover:bg-white/10" title="Underline (Ctrl+U)">
                <Underline className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => execCmd('strikeThrough')} className="p-1 rounded hover:bg-stone-200 dark:hover:bg-white/10" title="Strikethrough">
                <Strikethrough className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Colors */}
            <div className="flex items-center gap-1 bg-white/70 dark:bg-black/25 p-0.5 px-1.5 rounded-lg border border-stone-200 dark:border-stone-700/60">
              <span className="text-[10px] font-mono text-stone-500">Color:</span>
              {(['#0f172a', '#5c351c', '#b91c1c', '#1d4ed8', '#b45309'] as const).map((color) => (
                <button
                  key={color}
                  data-swatch=""
                  onClick={() => execCmd('foreColor', color)}
                  className="w-3.5 h-3.5 rounded-full border border-stone-300 dark:border-stone-600 hover:scale-110 transition-transform cursor-pointer"
                  style={{ backgroundColor: color }}
                  title={`Color: ${color}`}
                />
              ))}
              <div className="w-px h-3 bg-stone-300 dark:bg-stone-700 mx-0.5" />
              <button
                onClick={() => execCmd('hiliteColor', '#fef08a')}
                className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-yellow-200 text-yellow-900 border border-yellow-300 hover:opacity-90 cursor-pointer"
                title="Yellow Highlighter"
              >
                Highlight
              </button>
              <button
                onClick={() => execCmd('hiliteColor', '#fed7aa')}
                className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-orange-200 text-orange-900 border border-orange-300 hover:opacity-90 cursor-pointer"
                title="Peach Highlighter"
              >
                Peach
              </button>
            </div>

            {/* Headings & Paragraph */}
            <div className="flex items-center gap-0.5 bg-white/70 dark:bg-black/25 p-0.5 rounded-lg border border-stone-200 dark:border-stone-700/60">
              <button onClick={() => execCmd('formatBlock', '<h2>')} className="px-1.5 py-0.5 rounded text-[10.5px] font-bold hover:bg-stone-200 dark:hover:bg-white/10" title="Heading 2">
                H2
              </button>
              <button onClick={() => execCmd('formatBlock', '<h3>')} className="px-1.5 py-0.5 rounded text-[10.5px] font-bold hover:bg-stone-200 dark:hover:bg-white/10" title="Heading 3">
                H3
              </button>
              <button onClick={() => execCmd('formatBlock', '<p>')} className="px-1.5 py-0.5 rounded text-[10.5px] font-bold hover:bg-stone-200 dark:hover:bg-white/10" title="Normal Paragraph">
                ¶
              </button>
            </div>

            {/* Lists & Alignment */}
            <div className="flex items-center gap-0.5 bg-white/70 dark:bg-black/25 p-0.5 rounded-lg border border-stone-200 dark:border-stone-700/60">
              <button onClick={() => execCmd('insertUnorderedList')} className="p-1 rounded hover:bg-stone-200 dark:hover:bg-white/10" title="Bullet List">
                <List className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => execCmd('insertOrderedList')} className="p-1 rounded hover:bg-stone-200 dark:hover:bg-white/10" title="Numbered List">
                <ListOrdered className="w-3.5 h-3.5" />
              </button>
              <div className="w-px h-3 bg-stone-300 dark:bg-stone-700 mx-0.5" />
              <button onClick={() => execCmd('justifyLeft')} className="p-1 rounded hover:bg-stone-200 dark:hover:bg-white/10" title="Align Left">
                <AlignLeft className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => execCmd('justifyCenter')} className="p-1 rounded hover:bg-stone-200 dark:hover:bg-white/10" title="Align Center">
                <AlignCenter className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => execCmd('justifyRight')} className="p-1 rounded hover:bg-stone-200 dark:hover:bg-white/10" title="Align Right">
                <AlignRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Clear Formatting */}
            <button
              onClick={() => execCmd('removeFormat')}
              className="px-2 py-0.5 rounded text-[10px] font-mono text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 border border-stone-300 dark:border-stone-700 hover:bg-stone-200/50 cursor-pointer"
              title="Clear Formatting"
            >
              Clear Format
            </button>
          </div>
        )}

        {/* Tab 2: INSERT & ATTACH (Dedicated Photo Attach Section + Diagrams + Tables + Callouts) */}
        {ribbonTab === 'insert' && (
          <div className="p-2 px-3 flex flex-wrap items-center gap-2.5 text-xs">
            {/* Dedicated Attach Photo Section */}
            <div className="flex items-center gap-1.5 p-1 px-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/35 border border-amber-300 dark:border-amber-800/60 shadow-2xs">
              <div className="p-1.5 rounded-lg bg-[#8f5f2c] text-white shrink-0 shadow-2xs">
                <Camera className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-amber-950 dark:text-amber-200">
                    Attach Photos
                  </span>
                  <Paperclip className="w-3 h-3 text-[#8f5f2c] dark:text-amber-400" />
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <button
                    onClick={() => setIsAttachPhotoModalOpen(true)}
                    className="px-2 py-0.5 rounded text-[10.5px] font-semibold bg-[#8f5f2c] hover:bg-[#754b20] text-white shadow-2xs transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>+ Attach Photo</span>
                  </button>
                  <label className="px-2 py-0.5 rounded text-[10.5px] font-medium bg-white dark:bg-[#1f1610] text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800/60 hover:bg-amber-100/50 cursor-pointer transition-colors flex items-center gap-1">
                    <span>Upload Local</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoFileInput}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Quick Clinical Figures / Diagrams */}
            <div className="flex items-center gap-1 bg-white/70 dark:bg-black/25 p-1 rounded-xl border border-stone-200 dark:border-stone-700/60">
              <span className="text-[10px] font-mono text-stone-500 uppercase px-1">Diagrams:</span>
              <button
                onClick={() => handleInsertSampleDiagram('histology')}
                className="px-2 py-1 rounded text-[10.5px] font-medium bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 flex items-center gap-1 cursor-pointer"
                title="Insert Histopathology Specimen Diagram"
              >
                <span>🔬 Histology</span>
              </button>
              <button
                onClick={() => handleInsertSampleDiagram('ecg')}
                className="px-2 py-1 rounded text-[10.5px] font-medium bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 flex items-center gap-1 cursor-pointer"
                title="Insert ECG Rhythm Strip"
              >
                <span>📈 ECG Strip</span>
              </button>
              <button
                onClick={() => handleInsertSampleDiagram('anatomy')}
                className="px-2 py-1 rounded text-[10.5px] font-medium bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 hover:bg-sky-100 flex items-center gap-1 cursor-pointer"
                title="Insert Anatomical Diagram"
              >
                <span>🫁 Anatomy</span>
              </button>
            </div>

            {/* Medical Callout Boxes */}
            <div className="flex items-center gap-1 bg-white/70 dark:bg-black/25 p-1 rounded-xl border border-stone-200 dark:border-stone-700/60">
              <span className="text-[10px] font-mono text-stone-500 uppercase px-1">Callouts:</span>
              <button
                onClick={() => handleInsertClinicalBox('pearl')}
                className="px-2 py-1 rounded text-[10.5px] font-medium bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 cursor-pointer"
              >
                ★ Clinical Pearl
              </button>
              <button
                onClick={() => handleInsertClinicalBox('warning')}
                className="px-2 py-1 rounded text-[10.5px] font-medium bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 cursor-pointer"
              >
                ⚠ Black Box Warning
              </button>
              <button
                onClick={() => handleInsertClinicalBox('ddx')}
                className="px-2 py-1 rounded text-[10.5px] font-medium bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 cursor-pointer"
              >
                ☤ Diff Diagnosis
              </button>
            </div>

            {/* Insert Table & Horizontal Rule */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleInsertClinicalTable}
                className="px-2 py-1 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#1e2530] text-[10.5px] font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-100 flex items-center gap-1 cursor-pointer"
                title="Insert 3x3 Differential Diagnosis Table"
              >
                <span>⊞ Clinical Table</span>
              </button>
              <button
                onClick={() => execCmd('insertHorizontalRule')}
                className="px-2 py-1 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#1e2530] text-[10.5px] font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-100 cursor-pointer"
                title="Insert Divider Line"
              >
                ― Divider
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: LINK DOCUMENT & WEB (Chapter, Page, Line, Internet Citations) */}
        {ribbonTab === 'link' && (
          <div className="p-2 px-3 flex flex-wrap items-center gap-2.5 text-xs">
            {/* In-App Document Linker */}
            <div className="flex items-center gap-2 p-1.5 px-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-300 dark:border-blue-800 shadow-2xs">
              <div className="p-1 rounded-lg bg-blue-600 text-white shrink-0">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-blue-900 dark:text-blue-200">
                  Link In-App Document / Chapter / Page / Line
                </span>
                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                  <select
                    value={linkBookTitle}
                    onChange={(e) => setLinkBookTitle(e.target.value)}
                    className="text-[10px] bg-white dark:bg-[#151c28] border border-blue-200 dark:border-blue-800 rounded px-1.5 py-0.5 text-stone-800 dark:text-stone-200"
                  >
                    {books.map((b) => (
                      <option key={b.id} value={b.title}>
                        {b.title.slice(0, 30)}...
                      </option>
                    ))}
                    <option value="Harrison's Internal Medicine 21st Ed">Harrison's Internal Medicine</option>
                    <option value="Robbins & Cotran Pathologic Basis of Disease">Robbins & Cotran Pathology</option>
                    <option value="Guyton and Hall Medical Physiology">Guyton and Hall Physiology</option>
                    <option value="First Aid for the USMLE Step 1">First Aid USMLE</option>
                  </select>

                  <input
                    type="text"
                    value={linkChapter}
                    onChange={(e) => setLinkChapter(e.target.value)}
                    placeholder="Ch. 248"
                    className="w-16 text-[10px] bg-white dark:bg-[#151c28] border border-blue-200 dark:border-blue-800 rounded px-1.5 py-0.5 text-stone-900 dark:text-stone-100"
                    title="Chapter number or title"
                  />
                  <input
                    type="text"
                    value={linkPage}
                    onChange={(e) => setLinkPage(e.target.value)}
                    placeholder="p. 1420"
                    className="w-14 text-[10px] bg-white dark:bg-[#151c28] border border-blue-200 dark:border-blue-800 rounded px-1.5 py-0.5 text-stone-900 dark:text-stone-100"
                    title="Page number"
                  />
                  <input
                    type="text"
                    value={linkLine}
                    onChange={(e) => setLinkLine(e.target.value)}
                    placeholder="Line 18"
                    className="w-14 text-[10px] bg-white dark:bg-[#151c28] border border-blue-200 dark:border-blue-800 rounded px-1.5 py-0.5 text-stone-900 dark:text-stone-100"
                    title="Line number or paragraph anchor"
                  />

                  <button
                    onClick={handleInsertDocumentCitation}
                    className="px-2.5 py-0.5 rounded text-[10.5px] font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-2xs transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Insert Citation</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Internet / Web Citation Linker */}
            <div className="flex items-center gap-2 p-1.5 px-3 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-300 dark:border-sky-800 shadow-2xs">
              <div className="p-1 rounded-lg bg-sky-600 text-white shrink-0">
                <Globe className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-sky-900 dark:text-sky-200">
                  Link Internet Medical Resource
                </span>
                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                  <div className="flex items-center gap-1">
                    {[
                      { name: 'PubMed', url: 'https://pubmed.ncbi.nlm.nih.gov/' },
                      { name: 'UpToDate', url: 'https://www.uptodate.com/' },
                      { name: 'NEJM', url: 'https://www.nejm.org/' },
                      { name: 'Amboss', url: 'https://www.amboss.com/' },
                    ].map((portal) => (
                      <button
                        key={portal.name}
                        onClick={() => {
                          setWebLinkUrl(portal.url);
                          setWebLinkTitle(`${portal.name} Clinical Study`);
                        }}
                        className="px-1.5 py-0.5 rounded text-[9.5px] font-mono bg-white dark:bg-[#16212e] text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 hover:bg-sky-100/60 cursor-pointer"
                      >
                        {portal.name}
                      </button>
                    ))}
                  </div>

                  <input
                    type="text"
                    value={webLinkUrl}
                    onChange={(e) => setWebLinkUrl(e.target.value)}
                    placeholder="https://pubmed..."
                    className="w-32 text-[10px] bg-white dark:bg-[#151c28] border border-sky-200 dark:border-sky-800 rounded px-1.5 py-0.5 text-stone-900 dark:text-stone-100"
                  />
                  <input
                    type="text"
                    value={webLinkTitle}
                    onChange={(e) => setWebLinkTitle(e.target.value)}
                    placeholder="Citation Title"
                    className="w-24 text-[10px] bg-white dark:bg-[#151c28] border border-sky-200 dark:border-sky-800 rounded px-1.5 py-0.5 text-stone-900 dark:text-stone-100"
                  />

                  <button
                    onClick={handleInsertWebCitation}
                    className="px-2.5 py-0.5 rounded text-[10.5px] font-bold bg-[#8f5f2c] hover:bg-[#754b20] text-white shadow-2xs transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Insert Web</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: SUMMARY & ATTACHMENTS (AI Summary, Attachments Gallery, Document Links List) */}
        {ribbonTab === 'summary' && (
          <div className="p-2 px-3 flex flex-wrap items-center justify-between gap-3 text-xs bg-amber-50/40 dark:bg-amber-950/20">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Summary Trigger */}
              <button
                onClick={handleGenerateSummary}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate / Refresh AI Summary</span>
              </button>

              {/* View Full Inspector Drawer */}
              <button
                onClick={() => setIsAttachmentsDrawerOpen(true)}
                className="px-3 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#1e2530] text-stone-800 dark:text-stone-200 hover:bg-stone-100 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
              >
                <Paperclip className="w-3.5 h-3.5 text-[#8f5f2c] dark:text-amber-400" />
                <span>
                  Inspect Attachments & Documents ({activePage.attachments?.length || 0})
                </span>
              </button>

              {/* Live Status Badges */}
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-stone-600 dark:text-stone-400">
                <span className="px-2 py-0.5 rounded-full bg-white dark:bg-[#1a222f] border border-stone-200 dark:border-stone-700">
                  📷 {activePage.attachments?.filter(a => a.type === 'photo').length || 0} Photos
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white dark:bg-[#1a222f] border border-stone-200 dark:border-stone-700">
                  📖 {activePage.attachments?.filter(a => a.type === 'document-link').length || 0} Docs Linked
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white dark:bg-[#1a222f] border border-stone-200 dark:border-stone-700">
                  🌐 {activePage.attachments?.filter(a => a.type === 'web-link').length || 0} Web Citations
                </span>
              </div>
            </div>

            {/* Quick Export / Print */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => window.print()}
                className="px-2 py-1 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#1e2530] text-[10.5px] font-mono text-stone-700 dark:text-stone-300 hover:bg-stone-100 flex items-center gap-1 cursor-pointer"
                title="Print or Export PDF"
              >
                <Download className="w-3 h-3" />
                <span>Export Note</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  {/* ========================================================================= */}
  {/* WINDOW 3: NOTE MAKING PANEL (RICH TEXT + DIGITAL STYLUS + TEMPLATES)     */}
  {/* ========================================================================= */}
  function renderWindow3NoteMaker(isMax: boolean) {
    return (
      <div
        className="flex flex-col h-full w-full rounded-xl overflow-hidden border shadow-lg transition-all"
        style={{
          backgroundColor: noteTheme.windowBg,
          borderColor: isMax ? noteTheme.accentHex : noteTheme.windowBorder,
        }}
      >
        {/* Note Editor Header Bar */}
        <div
          className="px-3 py-1.5 border-b flex flex-wrap items-center justify-between gap-2 shrink-0"
          style={{
            borderColor: noteTheme.windowHeaderBorder,
            backgroundColor: noteTheme.windowHeaderBg,
          }}
        >
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase"
              style={{
                borderColor: `${noteTheme.accentHex}40`,
                color: noteTheme.accentHex,
                backgroundColor: `${noteTheme.accentHex}15`,
              }}
            >
              WINDOW 3: NOTE
            </span>

            {/* Note Paper Selector */}
            <div className="relative">
              <button
                onClick={() => setShowPaperDropdown(!showPaperDropdown)}
                className="text-[10px] font-mono text-slate-700 dark:text-stone-300 hover:text-slate-950 dark:hover:text-white flex items-center gap-1 bg-white/90 dark:bg-black/30 px-2 py-0.5 rounded border border-slate-300 dark:border-white/10 shadow-2xs"
              >
                <span>{safeNotebook.paperColor} · {safeNotebook.paperType}</span>
              </button>
              {showPaperDropdown && (
                <div className="absolute top-7 left-0 z-50 bg-stone-900 border border-stone-700 rounded-lg p-2 shadow-2xl space-y-1 w-44">
                  <div className="text-[9px] font-mono text-stone-400 uppercase">Paper Color</div>
                  <div className="grid grid-cols-5 gap-1 pb-2 border-b border-stone-800">
                    {(['beige', 'white', 'dark', 'sepia', 'mint'] as PaperColor[]).map((c) => (
                      <button
                        key={c}
                        onClick={() => {
                          onUpdateNotebook({ ...safeNotebook, paperColor: c });
                          setShowPaperDropdown(false);
                        }}
                        className={`h-5 rounded border ${safeNotebook.paperColor === c ? 'ring-2 ring-white' : ''}`}
                        style={{ backgroundColor: getPaperColorStyle(c).backgroundColor }}
                        title={c}
                      />
                    ))}
                  </div>
                  <div className="text-[9px] font-mono text-stone-400 uppercase pt-1">Ruling Style</div>
                  {(['ruled-thin', 'box-ruled', 'dot-grid', 'blank'] as PaperType[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        onUpdateNotebook({ ...safeNotebook, paperType: t });
                        setShowPaperDropdown(false);
                      }}
                      className="w-full text-left text-xs px-2 py-1 rounded hover:bg-white/10 text-stone-200 capitalize font-mono text-[11px]"
                    >
                      {t.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mode Switcher: Type / Pen / Split */}
          <div className="flex items-center gap-1 bg-slate-200/80 dark:bg-black/40 p-0.5 rounded-lg border border-slate-300 dark:border-white/10">
            <button
              onClick={() => setEditorMode('type')}
              className={`px-2 py-0.5 rounded text-[11px] font-mono flex items-center gap-1 transition-all ${
                editorMode === 'type' ? 'bg-white text-slate-950 font-bold shadow-xs' : 'text-slate-600 dark:text-stone-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileText className="w-3 h-3" />
              <span>Type</span>
            </button>
            <button
              onClick={() => setEditorMode('pen')}
              className={`px-2 py-0.5 rounded text-[11px] font-mono flex items-center gap-1 transition-all ${
                editorMode === 'pen' ? 'bg-white text-slate-950 font-bold shadow-xs' : 'text-slate-600 dark:text-stone-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <PenTool className="w-3 h-3" />
              <span>Stylus</span>
            </button>
            <button
              onClick={() => setEditorMode('split')}
              className={`px-2 py-0.5 rounded text-[11px] font-mono flex items-center gap-1 transition-all ${
                editorMode === 'split' ? 'bg-white text-slate-950 font-bold shadow-xs' : 'text-slate-600 dark:text-stone-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Split className="w-3 h-3" />
              <span>Dual</span>
            </button>
          </div>

          <div className="flex items-center gap-1">
            {/* Clinical Templates Trigger */}
            <div className="relative">
              <button
                onClick={() => setShowClinicalTemplates(!showClinicalTemplates)}
                className="text-[10px] font-mono px-2 py-1 rounded border flex items-center gap-1 transition-all active:scale-95 hover:-translate-y-0.5"
                style={{
                  borderColor: `${noteTheme.accentHex}50`,
                  color: noteTheme.accentHex,
                  backgroundColor: `${noteTheme.accentHex}15`,
                }}
              >
                <Sparkles className="w-3 h-3" />
                <span>+ Templates</span>
              </button>

              {showClinicalTemplates && (
                <div className="absolute top-8 right-0 z-50 bg-stone-900 border border-stone-700 rounded-xl p-2 shadow-2xl space-y-1 w-52">
                  <button
                    onClick={() => handleInsertClinicalBox('pearl')}
                    className="w-full text-left px-2.5 py-1.5 rounded hover:bg-amber-950/60 text-amber-400 text-xs font-medium flex items-center gap-2"
                  >
                    <span>★</span>
                    <span>High-Yield Pearl Box</span>
                  </button>
                  <button
                    onClick={() => handleInsertClinicalBox('warning')}
                    className="w-full text-left px-2.5 py-1.5 rounded hover:bg-[#6e171b]/35 text-[#d97074] text-xs font-medium flex items-center gap-2"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Black Box Warning</span>
                  </button>
                  <button
                    onClick={() => handleInsertClinicalBox('rx')}
                    className="w-full text-left px-2.5 py-1.5 rounded hover:bg-sky-950/60 text-sky-400 text-xs font-medium flex items-center gap-2"
                  >
                    <span>℞</span>
                    <span>Prescription Protocol</span>
                  </button>
                  <button
                    onClick={() => handleInsertClinicalBox('ddx')}
                    className="w-full text-left px-2.5 py-1.5 rounded hover:bg-amber-950/60 text-amber-400 text-xs font-medium flex items-center gap-2"
                  >
                    <span>☤</span>
                    <span>Differential Diagnosis</span>
                  </button>
                  <button
                    onClick={() => handleInsertClinicalBox('yt-timestamp')}
                    className="w-full text-left px-2.5 py-1.5 rounded hover:bg-[#6e171b]/35 text-[#e49b9e] text-xs font-medium flex items-center gap-2 border-t border-stone-800 pt-1.5"
                  >
                    <Clock className="w-3.5 h-3.5 text-[#c94a4f]" />
                    <span>Insert Video Timestamp</span>
                  </button>
                </div>
              )}
            </div>

            {/* 1-Click Maximize / Restore Toggle */}
            <button
              onClick={() => setMaximizedWindow(isMax ? 'none' : 'note')}
              className={`p-1 rounded transition-all active:scale-95 flex items-center gap-1 ${
                isMax
                  ? 'bg-amber-500 text-slate-950 font-bold px-2 py-0.5 text-[10px] shadow-sm'
                  : 'text-stone-400 hover:text-white hover:bg-white/10'
              }`}
              title={isMax ? '1-Click Restore Layout (Esc)' : '1-Click Maximize to full viewport'}
            >
              {isMax ? (
                <>
                  <Minimize2 className="w-3 h-3" />
                  <span>Restore</span>
                </>
              ) : (
                <Maximize2 className="w-3 h-3" />
              )}
            </button>
          </div>
        </div>

        {/* MS Word-Style Tabbed Ribbon */}
        {renderRibbonBar()}

        {/* Paper & Editor Writing Area with Study Desk & Library Reading Room Ambiance */}
        <div
          className={`flex-1 overflow-y-auto p-3 sm:p-5 md:p-8 flex justify-center relative transition-colors ${
            deskVibe === 'mahogany'
              ? 'bg-[#29170c] dark:bg-[#140a04]'
              : deskVibe === 'oxford'
              ? 'bg-[#332213] dark:bg-[#191007]'
              : 'bg-[#312c26] dark:bg-[#181512]'
          }`}
          style={{
            backgroundImage:
              deskVibe === 'mahogany'
                ? 'radial-gradient(ellipse at 50% 50%, rgba(88, 48, 22, 0.45) 0%, rgba(24, 11, 4, 0.95) 100%)'
                : deskVibe === 'oxford'
                ? 'radial-gradient(ellipse at 50% 50%, rgba(98, 62, 33, 0.45) 0%, rgba(28, 15, 6, 0.95) 100%)'
                : 'radial-gradient(ellipse at 50% 50%, rgba(90, 80, 70, 0.35) 0%, rgba(24, 21, 18, 0.95) 100%)',
          }}
        >
          {/* Warm Desk Lamp Ambient Spotlight Cone */}
          {isDeskLampOn && (
            <div
              className="absolute inset-0 pointer-events-none z-10"
              style={{
                background:
                  'radial-gradient(ellipse 70% 55% at 50% 0%, rgba(253, 230, 138, 0.22) 0%, rgba(245, 158, 11, 0.08) 50%, transparent 80%)',
              }}
            />
          )}

          {/* Desk Leather Pad / Blotter under Notebook */}
          <div className="w-full max-w-4xl p-3 sm:p-6 rounded-3xl bg-[#1b120c] dark:bg-[#100a06] border-4 border-[#3d2414] dark:border-[#221309] shadow-2xl relative flex flex-col items-center">
            {/* Leather Pad Gold Stitched Seam */}
            <div className="absolute inset-1.5 border border-dashed border-amber-600/30 rounded-2xl pointer-events-none" />

            {/* Desk Accessory Accent Header: Fountain Pen Rest, Hot Coffee & Glasses */}
            <div className="w-full flex items-center justify-between pb-2.5 px-2 text-[10px] font-mono text-amber-200/70 select-none">
              <div className="flex items-center gap-2">
                <span>🖋️ Brass Fountain Pen Rest</span>
                <span className="hidden sm:inline">· ☕ Dark Roast Clinical Study Brew</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline">👓 Reading Spectacles</span>
                <span className="text-amber-400 font-bold">
                  {deskVibe === 'mahogany' ? '🏛️ Grand Mahogany Desk' : deskVibe === 'oxford' ? '📜 Oxford Archival Library' : '☕ Nordic Minimal Desk'}
                </span>
              </div>
            </div>

            {/* The Notebook Page with physical shadow */}
            <div
              className={`relative w-full max-w-3xl min-h-[640px] rounded-2xl shadow-2xl transition-all border overflow-hidden ${
                editorMode === 'split' ? 'flex flex-row' : ''
              }`}
              style={{
                ...paperStyle,
                borderColor: noteTheme.windowBorder,
                boxShadow: '0 20px 40px -15px rgba(0,0,0,0.6), 0 0 1px 1px rgba(0,0,0,0.1)',
              }}
            >
              {/* Split Mode: Left Side Stylus / Canvas */}
              {editorMode === 'split' && (
                <div className="w-1/2 border-r-2 border-dashed border-stone-400/40 relative bg-white/40 dark:bg-stone-900/40 p-3 flex flex-col">
                  <div className="text-[10px] font-mono tracking-wide text-stone-500 uppercase mb-2 flex items-center justify-between">
                    <span>Anatomy / Diagram Canvas</span>
                    <span className="text-[9px] bg-stone-200 dark:bg-stone-800 px-1.5 py-0.5 rounded">Stylus Active</span>
                  </div>
                  <div className="flex-1 relative rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900/80 overflow-hidden">
                    <DigitalPenCanvas
                      initialStrokes={activePage.inkStrokes}
                      onStrokesChange={handleStrokesChange}
                      isActive={true}
                    />
                  </div>
                </div>
              )}

              {/* Note Text Area */}
              <div
                className={`relative p-6 sm:p-8 flex-1 ${
                  editorMode === 'split' ? 'w-1/2' : 'w-full'
                } ${getPaperBackgroundClasses(safeNotebook.paperType)}`}
              >
                {/* Ruled Margin Line */}
                {safeNotebook.paperType === 'ruled-thin' && (
                  <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-rose-400/35 pointer-events-none" />
                )}

                {/* Title Header */}
                <div className="mb-4 pb-2 border-b border-stone-300 dark:border-stone-700 flex items-center justify-between">
                  <input
                    type="text"
                    value={activePage.title}
                    onChange={(e) => {
                      const updatedPages = [...safeNotebook.pages];
                      updatedPages[activePageIndex] = { ...activePage, title: e.target.value };
                      onUpdateNotebook({ ...safeNotebook, pages: updatedPages });
                    }}
                    className="text-base sm:text-lg font-bold bg-transparent outline-none w-full"
                    placeholder="Clinical Topic Title..."
                  />
                  <span className="text-[10px] font-mono text-stone-400 whitespace-nowrap pl-2">
                    {activePage.date}
                  </span>
                </div>

                {/* Editable Body */}
                <div
                  ref={editorRef}
                  contentEditable={editorMode !== 'pen'}
                  onInput={handleContentChange}
                  className="outline-none min-h-[480px] text-xs sm:text-sm leading-relaxed prose prose-stone max-w-none focus:outline-none"
                  style={{
                    fontFamily: "var(--app-font-family, inherit)",
                  }}
                />

                {/* Digital Pen Overlay if Pen Mode Only */}
                {editorMode === 'pen' && (
                  <div className="absolute inset-0 z-10">
                    <DigitalPenCanvas
                      initialStrokes={activePage.inkStrokes}
                      onStrokesChange={handleStrokesChange}
                      isActive={true}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  {/* ========================================================================= */}
  {/* WINDOW 4: CORNER PIP YOUTUBE STUDY LECTURE PANEL                          */}
  {/* ========================================================================= */}
  function renderWindow4YouTubePip(isMax: boolean) {
    return (
      <div
        className={`flex flex-col rounded-xl overflow-hidden border shadow-2xl transition-all duration-200 ${
          isMax ? 'h-full w-full' : 'backdrop-blur-md'
        }`}
        style={{
          backgroundColor: noteTheme.windowBg,
          borderColor: isMax ? noteTheme.accentHex : noteTheme.windowBorder,
          boxShadow: `0 8px 32px ${noteTheme.accentHex}25`,
        }}
      >
        {/* PIP Header */}
        <div
          className="px-2.5 py-1.5 border-b flex items-center justify-between text-xs shrink-0"
          style={{
            borderColor: noteTheme.windowHeaderBorder,
            backgroundColor: noteTheme.windowHeaderBg,
          }}
        >
          <div className="flex items-center gap-1.5 min-w-0">
            {/* YouTube Red Logo */}
            <div className="w-5 h-3.5 rounded bg-red-600 flex items-center justify-center shrink-0 shadow-xs">
              <div className="w-0 h-0 border-y-[3px] border-y-transparent border-l-[5px] border-l-white ml-0.5" />
            </div>

            <span className="text-[10px] font-mono font-bold text-white uppercase truncate">
              {currentVideo.channel}
            </span>
          </div>

          <div className="flex items-center gap-1 text-stone-300">
            {/* Corner position switcher (when not max) */}
            {!isMax && (
              <button
                onClick={() => setPipCorner((c) => (c === 'bottom-right' ? 'top-right' : 'bottom-right'))}
                className="p-1 rounded hover:bg-white/10 text-stone-400 hover:text-white transition-all"
                title={`Move to ${pipCorner === 'bottom-right' ? 'Top Right' : 'Bottom Right'}`}
              >
                <ChevronRight className={`w-3 h-3 ${pipCorner === 'bottom-right' ? '-rotate-90' : 'rotate-90'}`} />
              </button>
            )}

            {/* Minimize / Maximize */}
            <button
              onClick={() => setIsPipMinimized(!isPipMinimized)}
              className="p-1 rounded hover:bg-white/10 text-stone-400 hover:text-white transition-all"
              title={isPipMinimized ? 'Expand Video' : 'Minimize Video'}
            >
              <Minimize2 className="w-3 h-3" />
            </button>

            {/* 1-Click Maximize / Restore Toggle */}
            <button
              onClick={() => setMaximizedWindow(isMax ? 'none' : 'youtube')}
              className={`p-1 rounded transition-all active:scale-95 flex items-center gap-1 ${
                isMax
                  ? 'bg-amber-500 text-slate-950 font-bold px-2 py-0.5 text-[10px] shadow-sm'
                  : 'text-stone-400 hover:text-white hover:bg-white/10'
              }`}
              title={isMax ? '1-Click Restore to corner PIP (Esc)' : '1-Click Maximize Video to full viewport'}
            >
              {isMax ? (
                <>
                  <Minimize2 className="w-3 h-3" />
                  <span>Restore</span>
                </>
              ) : (
                <Maximize2 className="w-3 h-3" />
              )}
            </button>

            {/* Close / Hide PIP Button */}
            {!isMax && (
              <button
                onClick={() => setShowPip(false)}
                className="p-1 rounded hover:bg-white/10 text-stone-400 hover:text-[#c94a4f] transition-all ml-0.5"
                title="Hide YouTube PIP (Can reopen anytime from Arrange bar)"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Video Body */}
        {!isPipMinimized && (
          <div className="flex flex-col">
            {/* Video Thumbnail & Live Player Overlay */}
            <div className="relative aspect-video w-full bg-black overflow-hidden group">
              <img
                src={currentVideo.thumbnailUrl}
                alt={currentVideo.title}
                className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/30" />

              {/* Play / Pause Big Center Button */}
              <button
                onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                className="absolute inset-0 flex items-center justify-center transition-all group-hover:scale-110 active:scale-95"
              >
                <div className="w-11 h-11 rounded-full bg-red-600/90 hover:bg-red-600 text-white flex items-center justify-center shadow-lg transition-all border border-white/20">
                  {isVideoPlaying ? (
                    <Pause className="w-5 h-5 fill-current" />
                  ) : (
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  )}
                </div>
              </button>

              {/* Video Title in Overlay */}
              <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
                <span className="text-[9px] font-mono bg-black/75 px-1.5 py-0.5 rounded text-white border border-white/10">
                  {currentVideo.topic}
                </span>
                <a
                  href={currentVideo.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[9px] font-mono bg-red-600/90 text-white px-2 py-0.5 rounded flex items-center gap-1 hover:bg-red-500 transition-colors"
                  title="Open in YouTube"
                >
                  <ExternalLink className="w-2.5 h-2.5" />
                  <span>YouTube</span>
                </a>
              </div>

              {/* Live Timeline Bar at bottom of thumbnail */}
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/95 to-transparent">
                <div className="flex items-center justify-between text-[10px] font-mono text-white mb-1">
                  <span>{formatVideoTime(videoCurrentSeconds)}</span>
                  <span>{currentVideo.duration}</span>
                </div>
                {/* Scrubber Track */}
                <div
                  className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden cursor-pointer"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const percent = clickX / rect.width;
                    setVideoCurrentSeconds(Math.floor(percent * currentVideo.durationSeconds));
                  }}
                >
                  <div
                    className="h-full bg-red-500 rounded-full transition-all"
                    style={{
                      width: `${(videoCurrentSeconds / currentVideo.durationSeconds) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Controls Bar */}
            <div className="p-2.5 space-y-2 bg-stone-950/80">
              <h4 className="text-[11px] font-semibold text-white leading-tight line-clamp-2">
                {currentVideo.title}
              </h4>

              {/* Speed Buttons + Insert Timestamp Note */}
              <div className="flex items-center justify-between gap-1 pt-1 border-t border-white/10">
                <div className="flex items-center gap-1">
                  <span className="text-[9px] font-mono text-stone-400">Speed:</span>
                  {[1.0, 1.25, 1.5, 2.0].map((s) => (
                    <button
                      key={s}
                      onClick={() => setPlaybackSpeed(s)}
                      className={`text-[9.5px] font-mono px-1.5 py-0.5 rounded transition-all ${
                        playbackSpeed === s
                          ? 'bg-red-600 text-white font-bold'
                          : 'text-stone-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>

                {/* Insert Timestamp to Note */}
                <button
                  onClick={() => handleInsertClinicalBox('yt-timestamp')}
                  className="text-[9.5px] font-mono px-2 py-0.5 rounded border border-rose-500/50 bg-rose-500/15 text-rose-300 hover:bg-rose-500/25 flex items-center gap-1 transition-all active:scale-95 hover:-translate-y-0.5"
                  title="Insert Current Timestamp directly into Note"
                >
                  <Clock className="w-2.5 h-2.5 text-rose-400" />
                  <span>Insert [{formatVideoTime(videoCurrentSeconds)}]</span>
                </button>
              </div>

              {/* Video Switcher Selector */}
              <div className="pt-1">
                <select
                  value={activeVideoIndex}
                  onChange={(e) => {
                    setActiveVideoIndex(Number(e.target.value));
                    setVideoCurrentSeconds(0);
                    setIsVideoPlaying(false);
                  }}
                  className="w-full bg-stone-900 border border-stone-800 text-[10px] font-mono text-stone-300 rounded p-1 outline-none cursor-pointer"
                >
                  {STUDY_VIDEOS.map((v, i) => (
                    <option key={v.id} value={i}>
                      {i + 1}. {v.channel} · {v.title.slice(0, 36)}...
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  {/* ========================================================================= */}
  {/* SCREENSHOT 480 LAYOUT COMPONENTS                                          */}
  {/* ========================================================================= */}

  function renderScreenshotLinedNoteMaker() {
    return (
      <div className="w-full h-full rounded-3xl bg-[#faeee4] dark:bg-[#1a1410] border-2 border-[#475569]/70 dark:border-[#334155] shadow-[0_6px_20px_rgba(0,0,0,0.12)] flex flex-col overflow-hidden relative">
        {/* Top Note Header Bar with Title & Date */}
        <div className="px-5 py-3 border-b border-[#d8c5b4] dark:border-[#30251f] flex flex-wrap items-center justify-between gap-2 shrink-0 bg-[#f7e6d8]/70 dark:bg-[#201813]/80">
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <input
              type="text"
              value={activePage.title}
              onChange={(e) => {
                const updatedPages = [...safeNotebook.pages];
                updatedPages[activePageIndex] = { ...activePage, title: e.target.value };
                onUpdateNotebook({ ...safeNotebook, pages: updatedPages });
              }}
              className="text-base sm:text-lg font-bold bg-transparent outline-none w-full text-slate-900 dark:text-amber-100 placeholder:text-stone-400"
              placeholder="Clinical Note Title (e.g. Autonomic Receptors & Drugs)..."
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-stone-500 font-mono">
            {/* Small Option Button for Opening Another Book Beside Notes */}
            <div className="relative">
              <button
                onClick={() => setIsBookPickerOpen(!isBookPickerOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-sky-300 text-[11px] font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-all shadow-2xs"
                title="Open another book beside notes"
              >
                <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden sm:inline">Open Book Beside Notes</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {/* Book Picker Popover */}
              {isBookPickerOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-64 bg-white dark:bg-[#101422] rounded-xl border border-stone-200 dark:border-[#1d2740] shadow-xl p-2 z-40 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-400 px-2 block">
                    Choose Book Beside Notes:
                  </span>
                  {books.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => {
                        setPdf1BookId(b.id);
                        setPdf1PageIndex(0);
                        setIsBookPickerOpen(false);
                      }}
                      className={`w-full text-left px-2 py-1.5 rounded-lg text-xs font-medium truncate flex items-center justify-between ${
                        b.id === pdf1BookId
                          ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold'
                          : 'text-slate-700 dark:text-zinc-300 hover:bg-stone-100 dark:hover:bg-[#161d30]'
                      }`}
                    >
                      <span className="truncate">{b.title}</span>
                      {b.id === pdf1BookId && <Check className="w-3 h-3 text-blue-600 shrink-0" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Resize Option for Note Maker */}
            <div className="hidden md:flex items-center gap-0.5 bg-stone-200/60 dark:bg-[#221813] rounded-lg p-0.5 border border-stone-300/80 dark:border-[#33241b]">
              <span className="text-[9px] font-mono text-stone-500 px-1">Width:</span>
              {(['50', '60', '70', '100'] as const).map((ratio) => (
                <button
                  key={ratio}
                  onClick={() => setNoteMakerWidthRatio(ratio)}
                  className={`px-1.5 py-0.5 rounded text-[9.5px] font-mono transition-colors ${
                    noteMakerWidthRatio === ratio
                      ? 'bg-amber-600 text-white font-bold shadow-2xs'
                      : 'text-stone-600 dark:text-stone-300 hover:bg-white/60'
                  }`}
                  title={`Resize note width to ${ratio}%`}
                >
                  {ratio}%
                </button>
              ))}
            </div>

            <div className="w-px h-3.5 bg-stone-300 dark:bg-stone-700 mx-0.5" />
            <button
              onClick={handleAddPage}
              className="px-2 py-0.5 rounded border border-stone-300 dark:border-stone-700 bg-white/60 dark:bg-white/5 text-[11px] font-semibold text-stone-700 dark:text-stone-300 hover:bg-white"
            >
              + Page
            </button>
          </div>
        </div>

        {/* MS Word-Style Tabbed Ribbon */}
        {renderRibbonBar()}

        {/* Real Horizontal Lined Paper Body (matching Screenshot 480) */}
        <div
          className="flex-1 overflow-y-auto px-6 sm:px-10 py-6 relative custom-scrollbar bg-[#faeee4] dark:bg-[#151210] transition-colors"
          style={{
            background: 'repeating-linear-gradient(to bottom, transparent, transparent 31px, rgba(165, 135, 115, 0.35) 31px, rgba(165, 135, 115, 0.35) 32px)',
          }}
        >
          {/* Subtle Left Red Margin Line for authentic notebook look */}
          <div className="absolute left-6 sm:left-10 top-0 bottom-0 w-0.5 bg-rose-400/25 pointer-events-none" />

          {/* Note contentEditable text area */}
          <div
            ref={editorRef}
            contentEditable={editorMode !== 'pen'}
            onInput={handleContentChange}
            className="outline-none min-h-[500px] text-xs sm:text-sm pl-4 sm:pl-6 text-slate-850 dark:text-stone-900 focus:outline-none"
            style={{
              lineHeight: '32px',
              fontFamily: "var(--app-font-family, inherit)",
            }}
          />

          {/* Pen Overlay Canvas */}
          {editorMode === 'pen' && (
            <div className="absolute inset-0 z-10">
              <DigitalPenCanvas
                initialStrokes={activePage.inkStrokes}
                onStrokesChange={handleStrokesChange}
                isActive={true}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // FLOW CHART SEGMENT (With 3-4 doc files, search bar & edit option)
  // =========================================================================
  function renderFlowchartSegment() {
    const filteredFlowcharts = flowchartDocs.filter(
      (fc) =>
        fc.title.toLowerCase().includes(flowchartSearchQuery.toLowerCase()) ||
        fc.subject.toLowerCase().includes(flowchartSearchQuery.toLowerCase()) ||
        fc.nodes.some(
          (n) =>
            n.label.toLowerCase().includes(flowchartSearchQuery.toLowerCase()) ||
            (n.detail && n.detail.toLowerCase().includes(flowchartSearchQuery.toLowerCase()))
        )
    );

    const activeDoc = flowchartDocs.find((fc) => fc.id === selectedFlowchartId) || flowchartDocs[0];

    const heightClass =
      flowchartCardHeight === 'compact'
        ? 'min-h-[200px] max-h-[220px]'
        : flowchartCardHeight === 'tall'
        ? 'min-h-[360px] max-h-[420px]'
        : 'min-h-[270px] max-h-[300px]';

    const handleSnipFlowchartToNote = () => {
      if (!activeDoc) return;
      const html = `
        <div style="border: 2px solid #a47c43; border-radius: 12px; padding: 12px; margin: 10px 0; background: #fdf8ee; color: #4e2f19;">
          <h4 style="font-weight: bold; margin-bottom: 6px; font-size: 13px;">📋 Flowchart: ${activeDoc.title}</h4>
          <p style="font-size: 11px; color: #754b20; margin-bottom: 8px;"><em>${activeDoc.summary}</em></p>
          <ol style="padding-left: 18px; margin: 0; font-size: 11px; line-height: 1.6;">
            ${activeDoc.nodes
              .map(
                (n) =>
                  `<li><strong>${n.label}:</strong> ${n.detail || ''} ${
                    n.branchYes ? `<br/>↳ [YES]: ${n.branchYes} | [NO]: ${n.branchNo || 'Continue'} ` : ''
                  }</li>`
              )
              .join('')}
          </ol>
        </div>
      `;
      execCmd('insertHTML', html);
      setCopiedAlert('Flowchart inserted into note!');
      setTimeout(() => setCopiedAlert(null), 2000);
    };

    return (
      <div
        className={`w-full ${heightClass} rounded-3xl bg-white dark:bg-[#111726] border-2 border-[#475569]/70 dark:border-[#334155] p-3.5 shadow-sm flex flex-col justify-between overflow-hidden transition-all duration-150`}
      >
        {/* Top Header: Title, Edit Flowcharts Option & Resize Option */}
        <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-[#1e2740] shrink-0 gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <GitFork className="w-4 h-4 text-[#8f5f2c] dark:text-amber-400 shrink-0" />
            <h3 className="text-sm sm:text-base font-bold text-slate-800 dark:text-zinc-100 tracking-wide truncate">
              Flow chart
            </h3>
            <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 shrink-0">
              {flowchartDocs.length} Docs
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Edit Flowcharts Option Button */}
            <button
              onClick={() => setIsEditingFlowcharts(!isEditingFlowcharts)}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold border transition-colors cursor-pointer ${
                isEditingFlowcharts
                  ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-200'
                  : 'text-slate-600 dark:text-zinc-400 border-stone-200 dark:border-[#223050] hover:bg-stone-100 dark:hover:bg-[#1a2336]'
              }`}
              title="Toggle Edit Flowcharts mode"
            >
              {isEditingFlowcharts ? 'Done' : 'Edit Flowcharts'}
            </button>

            {/* Resize Option Control */}
            <div className="flex items-center gap-0.5 bg-stone-100 dark:bg-[#172036] rounded-lg p-0.5 border border-stone-200 dark:border-[#223050]">
              <span className="text-[9px] font-mono text-slate-400 px-1">Size:</span>
              <button
                onClick={() => setFlowchartCardHeight('compact')}
                className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold transition-colors ${
                  flowchartCardHeight === 'compact'
                    ? 'bg-white dark:bg-[#202c46] text-[#8f5f2c] dark:text-amber-300 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Compact size"
              >
                S
              </button>
              <button
                onClick={() => setFlowchartCardHeight('normal')}
                className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold transition-colors ${
                  flowchartCardHeight === 'normal'
                    ? 'bg-white dark:bg-[#202c46] text-[#8f5f2c] dark:text-amber-300 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Standard size"
              >
                M
              </button>
              <button
                onClick={() => setFlowchartCardHeight('tall')}
                className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold transition-colors ${
                  flowchartCardHeight === 'tall'
                    ? 'bg-white dark:bg-[#202c46] text-[#8f5f2c] dark:text-amber-300 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Tall size"
              >
                L
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar + Doc Selector Strip */}
        <div className="py-1.5 shrink-0 space-y-1.5">
          <div className="relative w-full">
            <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={flowchartSearchQuery}
              onChange={(e) => setFlowchartSearchQuery(e.target.value)}
              placeholder="Search flowcharts, decision trees, criteria..."
              className="w-full pl-7 pr-2 py-1 rounded-lg bg-stone-100 dark:bg-[#172036] border border-stone-200 dark:border-[#223050] text-[11px] text-slate-800 dark:text-zinc-100 outline-none focus:border-amber-500"
            />
          </div>

          {/* Doc File Tabs (3-4 Medical Flowchart Docs) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
            {filteredFlowcharts.map((fc) => (
              <button
                key={fc.id}
                onClick={() => setSelectedFlowchartId(fc.id)}
                className={`px-2 py-1 rounded-lg text-[10px] font-semibold whitespace-nowrap shrink-0 transition-all ${
                  fc.id === selectedFlowchartId
                    ? 'bg-[#8f5f2c] text-white shadow-2xs font-bold'
                    : 'bg-stone-100 dark:bg-[#161f33] text-slate-700 dark:text-zinc-300 hover:bg-stone-200 dark:hover:bg-[#1f2c48]'
                }`}
              >
                📄 {fc.title.split(' ')[0]} {fc.title.split(' ')[1] || ''}
              </button>
            ))}

            {isEditingFlowcharts && (
              <button
                onClick={() => setIsNewFlowchartModalOpen(true)}
                className="px-2 py-1 rounded-lg text-[10px] font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-dashed border-amber-400 shrink-0 hover:bg-amber-100"
              >
                + New Chart
              </button>
            )}
          </div>
        </div>

        {/* Visual Flowchart Display Area */}
        <div className="flex-1 rounded-2xl bg-[#fdf9f0] dark:bg-[#1f160f] border-2 border-[#c49257]/60 dark:border-[#4b3322] p-2.5 shadow-inner flex flex-col justify-between overflow-hidden relative">
          <div className="flex items-center justify-between pb-1.5 border-b border-[#e4d5bc] dark:border-[#3b271a] shrink-0 text-xs">
            <div className="min-w-0">
              <h4 className="font-bold text-[11px] text-[#4e2f19] dark:text-amber-200 truncate">
                {activeDoc.title}
              </h4>
              <p className="text-[9px] text-[#7c5329]/85 dark:text-amber-300/80 truncate">
                {activeDoc.category} · {activeDoc.nodes.length} Steps
              </p>
            </div>
            <button
              onClick={handleSnipFlowchartToNote}
              className="px-2 py-0.5 rounded bg-[#8f5f2c] hover:bg-[#754b20] text-white text-[10px] font-semibold transition-all shadow-xs shrink-0"
              title="Insert this clinical flowchart into active note"
            >
              Snip to Note
            </button>
          </div>

          {/* Interactive Flow Nodes list */}
          <div className="flex-1 overflow-y-auto py-2 pr-1 space-y-1.5 text-xs custom-scrollbar">
            {activeDoc.nodes.map((node, idx) => (
              <div key={node.id} className="relative">
                <div
                  className={`p-2 rounded-xl border text-xs shadow-2xs ${
                    node.type === 'start'
                      ? 'bg-white dark:bg-[#2a1d14] border-[#c49257] text-[#4e2f19] dark:text-amber-100 font-semibold'
                      : node.type === 'decision'
                      ? 'bg-amber-50 dark:bg-[#2b2414] border-amber-400 text-amber-950 dark:text-amber-100'
                      : node.type === 'endpoint'
                      ? 'bg-purple-50 dark:bg-[#241a2e] border-purple-400 text-purple-950 dark:text-purple-100'
                      : 'bg-white dark:bg-[#1c1612] border-[#d6c2a5] dark:border-[#3d2a1c] text-slate-850 dark:text-zinc-100'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="text-[9px] font-mono uppercase font-bold px-1.5 py-0.2 rounded bg-black/5 dark:bg-white/10">
                      Step {idx + 1}: {node.type}
                    </span>
                    {isEditingFlowcharts && (
                      <span className="text-[9px] text-amber-600 font-mono font-semibold">Editable Step</span>
                    )}
                  </div>

                  <p className="font-bold text-[11px] leading-snug">
                    {node.label}
                  </p>

                  {node.detail && (
                    <p className="text-[10px] opacity-90 mt-0.5 leading-relaxed">
                      {node.detail}
                    </p>
                  )}

                  {node.branchYes && (
                    <div className="mt-1 pt-1 border-t border-amber-200 dark:border-amber-900/50 text-[10px] grid grid-cols-2 gap-1.5">
                      <div className="p-1 rounded bg-sky-100/70 dark:bg-sky-950/60 text-sky-900 dark:text-sky-200">
                        <strong className="block text-[8.5px] uppercase font-mono">↳ [YES]:</strong>
                        {node.branchYes}
                      </div>
                      <div className="p-1 rounded bg-rose-100/70 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200">
                        <strong className="block text-[8.5px] uppercase font-mono">↳ [NO]:</strong>
                        {node.branchNo || 'Monitor'}
                      </div>
                    </div>
                  )}
                </div>

                {idx < activeDoc.nodes.length - 1 && (
                  <div className="flex justify-center py-0.5">
                    <div className="text-[9px] font-mono text-[#8f5f2c] dark:text-amber-400">
                      ↓
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // BOOK COMPANION CARD (Without heading, with small option button & resize)
  // =========================================================================
  function renderScreenshotOpenBookCard() {
    const filteredSearchBooks = books.filter(
      (b) =>
        b.title.toLowerCase().includes(openBookSearchQuery.toLowerCase()) ||
        b.subject.toLowerCase().includes(openBookSearchQuery.toLowerCase())
    );

    const heightClass =
      bookCardHeight === 'compact'
        ? 'min-h-[190px] max-h-[210px]'
        : bookCardHeight === 'tall'
        ? 'min-h-[360px] max-h-[400px]'
        : 'min-h-[250px] max-h-[280px]';

    return (
      <div
        className={`w-full ${heightClass} rounded-3xl bg-white dark:bg-[#111726] border-2 border-[#475569]/70 dark:border-[#334155] p-3.5 shadow-sm flex flex-col justify-between overflow-hidden transition-all duration-150`}
      >
        {/* Header: Small Option Button for Opening Another Book Beside Notes & Component Resize */}
        <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-[#1e2740] mb-2 shrink-0 gap-2">
          {/* Small Option Button (Replaces the big heading as requested) */}
          <div className="relative">
            <button
              onClick={() => setIsBookPickerOpen(!isBookPickerOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-700 dark:text-sky-300 text-xs font-semibold border border-blue-200 dark:border-blue-800 transition-colors shadow-2xs"
              title="Open another book beside notes"
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              <span className="truncate max-w-[140px] sm:max-w-[200px]">Book: {pdf1Book.title}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {/* Quick Book Selector Dropdown */}
            {isBookPickerOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-64 bg-white dark:bg-[#101422] rounded-xl border border-stone-200 dark:border-[#1d2740] shadow-xl p-2 z-40 space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-400 px-2 block">
                  Choose Book Beside Notes:
                </span>
                {books.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => {
                      setPdf1BookId(b.id);
                      setPdf1PageIndex(0);
                      setIsBookPickerOpen(false);
                    }}
                    className={`w-full text-left px-2 py-1.5 rounded-lg text-xs font-medium truncate flex items-center justify-between ${
                      b.id === pdf1BookId
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold'
                        : 'text-slate-700 dark:text-zinc-300 hover:bg-stone-100 dark:hover:bg-[#161d30]'
                    }`}
                  >
                    <span className="truncate">{b.title}</span>
                    {b.id === pdf1BookId && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Component Resize Control */}
          <div className="flex items-center gap-0.5 bg-stone-100 dark:bg-[#172036] rounded-lg p-0.5 border border-stone-200 dark:border-[#223050]">
            <span className="text-[9px] font-mono text-slate-400 px-1">Size:</span>
            <button
              onClick={() => setBookCardHeight('compact')}
              className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold transition-colors ${
                bookCardHeight === 'compact'
                  ? 'bg-white dark:bg-[#202c46] text-blue-600 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Compact size"
            >
              S
            </button>
            <button
              onClick={() => setBookCardHeight('normal')}
              className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold transition-colors ${
                bookCardHeight === 'normal'
                  ? 'bg-white dark:bg-[#202c46] text-blue-600 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Standard size"
            >
              M
            </button>
            <button
              onClick={() => setBookCardHeight('tall')}
              className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold transition-colors ${
                bookCardHeight === 'tall'
                  ? 'bg-white dark:bg-[#202c46] text-blue-600 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Tall size"
            >
              L
            </button>
          </div>
        </div>

        {/* Quick Search & Book Switch Bar */}
        <div className="mb-2 shrink-0 flex items-center gap-1.5">
          <div className="relative flex-1">
            <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={openBookSearchQuery}
              onChange={(e) => setOpenBookSearchQuery(e.target.value)}
              placeholder="Search books, chapters..."
              className="w-full pl-7 pr-2 py-1 rounded-lg bg-stone-100 dark:bg-[#172036] border border-stone-200 dark:border-[#223050] text-[11px] text-slate-800 dark:text-zinc-100 outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={pdf1BookId}
            onChange={(e) => {
              setPdf1BookId(e.target.value);
              setPdf1PageIndex(0);
            }}
            className="bg-stone-100 dark:bg-[#172036] border border-stone-200 dark:border-[#223050] text-[11px] font-semibold text-slate-800 dark:text-zinc-100 rounded-lg px-2 py-1 outline-none max-w-[140px] truncate"
          >
            {filteredSearchBooks.map((b) => (
              <option key={b.id} value={b.id}>
                {b.title}
              </option>
            ))}
          </select>
        </div>

        {/* Inner Light Blue Rounded Slab */}
        <div className="flex-1 rounded-2xl bg-[#cee3f8] dark:bg-[#16293f] border-2 border-[#4a6b8c] dark:border-[#2e4c70] p-3 shadow-inner flex flex-col justify-between overflow-hidden relative">
          {/* Book Header Inside Blue Slab */}
          <div className="flex items-center justify-between pb-1.5 border-b border-[#b5d3f2] dark:border-[#203a58] shrink-0 text-xs text-[#1e3a8a] dark:text-sky-200">
            <div className="flex items-center gap-1.5 min-w-0">
              <BookOpen className="w-3.5 h-3.5 shrink-0" />
              <span className="font-bold truncate max-w-[170px] sm:max-w-[210px]">
                {pdf1Book.title}
              </span>
            </div>
            {/* Page Nav */}
            <div className="flex items-center gap-1 font-mono text-[10px]">
              <button
                disabled={pdf1PageIndex <= 0}
                onClick={() => setPdf1PageIndex((p) => Math.max(0, p - 1))}
                className="p-0.5 rounded hover:bg-black/10 disabled:opacity-30"
              >
                <ChevronLeft className="w-3 h-3" />
              </button>
              <span>
                {pdf1PageIndex + 1}/{pdf1Book.pages.length}
              </span>
              <button
                disabled={pdf1PageIndex >= pdf1Book.pages.length - 1}
                onClick={() => setPdf1PageIndex((p) => Math.min(pdf1Book.pages.length - 1, p + 1))}
                className="p-0.5 rounded hover:bg-black/10 disabled:opacity-30"
              >
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Book Page Content with Scrollbar */}
          <div className="flex-1 overflow-y-auto py-2 pr-1 space-y-1.5 text-xs text-[#1e3a8a] dark:text-sky-100 font-sans custom-scrollbar">
            <h4 className="font-bold text-xs">
              {currentPdf1Page?.title || 'Chapter Review'}
            </h4>
            <p className="text-[11px] leading-relaxed opacity-90 line-clamp-5">
              {currentPdf1Page?.summaryPearl ||
                currentPdf1Page?.contentHtml?.replace(/<[^>]*>?/gm, '') ||
                'Textbook content loaded and accessible for active study and reference.'}
            </p>
          </div>

          {/* Bottom Action Bar */}
          <div className="pt-1.5 border-t border-[#b5d3f2] dark:border-[#203a58] flex items-center justify-between shrink-0 text-[10px]">
            <span className="font-mono opacity-75 text-[#1e3a8a] dark:text-sky-200 truncate max-w-[150px]">
              {pdf1Book.author}
            </span>
            <button
              onClick={() => {
                const textToSnip =
                  currentPdf1Page?.summaryPearl ||
                  currentPdf1Page?.contentHtml?.replace(/<[^>]*>?/gm, '').slice(0, 200) ||
                  '';
                if (textToSnip) {
                  execCmd(
                    'insertHTML',
                    `<blockquote style="border-left: 3px solid #2563eb; padding-left: 8px; margin: 6px 0; color: #1e3a8a;"><strong>${pdf1Book.title} (p.${pdf1PageIndex + 1}):</strong> ${textToSnip}</blockquote>`
                  );
                }
              }}
              className="px-2 py-0.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all shadow-xs"
            >
              Snip to Note
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // YOUTUBE COMPANION CARD (With resize option)
  // =========================================================================
  function renderScreenshotYouTubeCard() {
    const filteredSearchVideos = STUDY_VIDEOS.filter(
      (v) =>
        v.title.toLowerCase().includes(youtubeSearchQuery.toLowerCase()) ||
        v.channel.toLowerCase().includes(youtubeSearchQuery.toLowerCase()) ||
        v.topic.toLowerCase().includes(youtubeSearchQuery.toLowerCase())
    );

    const ytHeightClass =
      youtubeCardHeight === 'compact'
        ? 'min-h-[190px] max-h-[220px]'
        : youtubeCardHeight === 'tall'
        ? 'min-h-[360px] max-h-[400px]'
        : 'min-h-[250px] max-h-[280px]';

    return (
      <div
        className={`w-full ${ytHeightClass} rounded-3xl bg-white dark:bg-[#111726] border-2 border-[#475569]/70 dark:border-[#334155] p-3.5 shadow-sm flex flex-col justify-between overflow-hidden transition-all duration-150`}
      >
        {/* Header: Centered "Youtube search" with Resize Option */}
        <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-[#1e2740] mb-2 shrink-0">
          <div className="flex items-center gap-1.5">
            <Play className="w-3.5 h-3.5 text-red-600" />
            <h3 className="text-sm sm:text-base font-bold text-slate-800 dark:text-zinc-100 tracking-wide">
              Youtube search
            </h3>
          </div>

          {/* Component Resize Control */}
          <div className="flex items-center gap-0.5 bg-stone-100 dark:bg-[#172036] rounded-lg p-0.5 border border-stone-200 dark:border-[#223050]">
            <span className="text-[9px] font-mono text-slate-400 px-1">Size:</span>
            <button
              onClick={() => setYoutubeCardHeight('compact')}
              className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold transition-colors ${
                youtubeCardHeight === 'compact'
                  ? 'bg-white dark:bg-[#202c46] text-red-600 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Compact size"
            >
              S
            </button>
            <button
              onClick={() => setYoutubeCardHeight('normal')}
              className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold transition-colors ${
                youtubeCardHeight === 'normal'
                  ? 'bg-white dark:bg-[#202c46] text-red-600 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Standard size"
            >
              M
            </button>
            <button
              onClick={() => setYoutubeCardHeight('tall')}
              className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold transition-colors ${
                youtubeCardHeight === 'tall'
                  ? 'bg-white dark:bg-[#202c46] text-red-600 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Tall size"
            >
              L
            </button>
          </div>
        </div>

        {/* Video Search Input Bar */}
        <div className="mb-2 shrink-0 flex items-center gap-1.5">
          <div className="relative flex-1">
            <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={youtubeSearchQuery}
              onChange={(e) => setYoutubeSearchQuery(e.target.value)}
              placeholder="Search Osmosis, Ninja Nerd, Dirty Med..."
              className="w-full pl-7 pr-2 py-1 rounded-lg bg-stone-100 dark:bg-[#172036] border border-stone-200 dark:border-[#223050] text-[11px] text-slate-800 dark:text-zinc-100 outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={activeVideoIndex}
            onChange={(e) => {
              setActiveVideoIndex(Number(e.target.value));
              setVideoCurrentSeconds(0);
              setIsVideoPlaying(false);
            }}
            className="bg-stone-100 dark:bg-[#172036] border border-stone-200 dark:border-[#223050] text-[11px] font-semibold text-slate-800 dark:text-zinc-100 rounded-lg px-2 py-1 outline-none max-w-[140px] truncate"
          >
            {filteredSearchVideos.map((v, i) => (
              <option key={v.id} value={STUDY_VIDEOS.indexOf(v)}>
                {v.channel}: {v.title.slice(0, 24)}...
              </option>
            ))}
          </select>
        </div>

        {/* Inner Light Blue Rounded Slab (matching Screenshot 480) */}
        <div className="flex-1 rounded-2xl bg-[#cee3f8] dark:bg-[#16293f] border-2 border-[#4a6b8c] dark:border-[#2e4c70] p-3 shadow-inner flex flex-col justify-between overflow-hidden relative">
          {/* Top Video Header */}
          <div className="flex items-center justify-between pb-1.5 border-b border-[#b5d3f2] dark:border-[#203a58] shrink-0 text-xs text-[#1e3a8a] dark:text-sky-200">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              <span className="font-bold truncate max-w-[180px]">
                {currentVideo.channel}
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-red-600 text-white">
              {currentVideo.duration}
            </span>
          </div>

          {/* Active Video Player View */}
          <div className="flex-1 py-1 flex items-center gap-3 overflow-hidden">
            <div className="relative w-24 h-16 rounded-lg overflow-hidden shrink-0 bg-stone-900 border border-[#b5d3f2]">
              <img
                src={currentVideo.thumbnailUrl}
                alt={currentVideo.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                className="absolute inset-0 m-auto w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-md"
              >
                {isVideoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
              </button>
            </div>

            <div className="min-w-0 flex-1 space-y-1">
              <h4 className="text-[11px] font-bold text-[#1e3a8a] dark:text-sky-100 line-clamp-2 leading-tight">
                {currentVideo.title}
              </h4>
              <div className="flex items-center gap-2 text-[10px] text-stone-600 dark:text-sky-300 font-mono">
                <span>{formatVideoTime(videoCurrentSeconds)} / {currentVideo.duration}</span>
                <span>• {playbackSpeed}x</span>
              </div>
            </div>
          </div>

          {/* Bottom Action / Timestamp Insert */}
          <div className="pt-1.5 border-t border-[#b5d3f2] dark:border-[#203a58] flex items-center justify-between shrink-0 text-[10px]">
            <a
              href={currentVideo.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-700 dark:text-red-400 font-semibold hover:underline flex items-center gap-1"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Watch on YouTube</span>
            </a>
            <button
              onClick={() => handleInsertClinicalBox('yt-timestamp')}
              className="px-2 py-0.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all shadow-xs flex items-center gap-1"
            >
              <Clock className="w-3 h-3" />
              <span>Insert Timestamp</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
};

export const RichNoteEditor: React.FC<RichNoteEditorProps> = (props) => {
  return (
    <AtelierCreateNote
      notebook={props.notebook}
      onUpdateNotebook={props.onUpdateNotebook}
      activePageIndex={props.activePageIndex}
      books={props.books}
      onBack={props.onBack}
      activeDesign={props.activeDesign || '1'}
    />
  );
};

export default RichNoteEditor;

