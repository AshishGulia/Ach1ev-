import './shelfwise.css';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { SubjectCourse, MedicalBook, Notebook, SnippetScreenshot, DesignId, BookThumbnailConfig } from '../../types';
import { BookLogoBadge } from './BookLogoBadge';
import { BookThumbnailEditorModal } from './BookThumbnailEditorModal';
import { getDefaultThumbnail } from '../../data/thumbnailMeta';
import { INITIAL_BOOKS } from '../../data/mockData';
import { FlowchartStudio } from '../flowchart/FlowchartStudio';
import ShelfRoom, { type Book as ShelfBook, COVER as SHELF_COVER } from './ShelfRoom';
import { getThemeMeta } from '../../data/themeMeta';
import { useAuth } from '../../contexts/AuthContext';
import {
  DRIVE_APP_FOLDER_NAME,
  getDrivePreviewUrl,
  prefetchGoogleOAuth,
  uploadPdfToPersonalDrive,
} from '../../services/googleDriveService';
import {
  INITIAL_FLOWCHART_DOCS,
  MedicalFlowchartDoc,
  CLASSIFICATION_TEMPLATES,
  ClassificationTreeDoc,
  ClassificationItemNode,
} from '../../data/flowchartData';
import {
  BookOpen,
  FileText,
  Image as ImageIcon,
  Search,
  Filter,
  Eye,
  ExternalLink,
  Download,
  Share2,
  Copy,
  Check,
  ZoomIn,
  X,
  Layers,
  Sparkles,
  Camera,
  Activity,
  Heart,
  Brain,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  Plus,
  GitBranch,
  LayoutGrid,
  GripVertical,
  ArrowUpDown,
  ArrowLeft,
  Sun,
  Moon,
  HardDrive,
  UploadCloud,
  AlertCircle,
  Palette,
} from 'lucide-react';

export interface MedicalImageItem {
  id: string;
  title: string;
  category: 'Anatomy' | 'Histopathology' | 'Radiology' | 'ECG' | 'Dermatology';
  subject: SubjectCourse;
  imageUrl: string;
  description: string;
  clinicalSignificance: string;
  tags: string[];
}

export const MEDICAL_IMAGE_ATLAS: MedicalImageItem[] = [];

interface LibraryViewProps {
  currentSubject: SubjectCourse;
  onSelectSubject?: (subject: SubjectCourse) => void;
  books?: MedicalBook[];
  onAddBook?: (book: MedicalBook) => void;
  onUpdateBook?: (book: MedicalBook) => void;
  notebooks?: Notebook[];
  onUpdateNotebook?: (notebook: Notebook) => void;
  onOpenNotebook?: (id: string) => void;
  onOpenStudio?: (action?: string) => void;
  onSnipToNote?: (snippet: SnippetScreenshot) => void;
  isDarkMode?: boolean;
  activeDesign?: DesignId;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  currentSubject,
  onSelectSubject,
  books = [],
  onAddBook,
  onUpdateBook,
  notebooks = [],
  onOpenNotebook,
  onOpenStudio,
  onSnipToNote,
  isDarkMode = false,
  activeDesign = '1',
}) => {
  const { driveAccount, connectGoogleDrive, disconnectGoogleDrive, getValidDriveAccessToken } = useAuth();
  const [activeTab, setActiveTab] = useState<'books' | 'images' | 'flowcharts'>('books');
  const [flowchartSort, setFlowchartSort] = useState<'recent' | 'az' | 'nodes'>('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('All');
  const [selectedImage, setSelectedImage] = useState<MedicalImageItem | null>(null);
  const [selectedFlowchartModal, setSelectedFlowchartModal] = useState<MedicalFlowchartDoc | null>(null);
  const [activeBookModal, setActiveBookModal] = useState<MedicalBook | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [snipSuccessId, setSnipSuccessId] = useState<string | null>(null);

  // Editable Book Cover Thumbnails (persisted for curated + uploaded books)
  const [bookThumbOverrides, setBookThumbOverrides] = useState<Record<string, BookThumbnailConfig>>(() => {
    try {
      const saved = localStorage.getItem('medden_book_thumb_overrides_v1');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [editingLibBook, setEditingLibBook] = useState<MedicalBook | null>(null);
  const [drivePdfThumbnail, setDrivePdfThumbnail] = useState<BookThumbnailConfig | undefined>(undefined);
  const [isEditingUploadThumb, setIsEditingUploadThumb] = useState(false);

  const getResolvedBookThumb = (bk: MedicalBook): BookThumbnailConfig | undefined => {
    return bookThumbOverrides[bk.id] || bk.thumbnail;
  };

  const handleSaveLibraryBookThumbnail = (bk: MedicalBook, cfg: BookThumbnailConfig) => {
    setBookThumbOverrides((prev) => {
      const next = { ...prev, [bk.id]: cfg };
      try {
        localStorage.setItem('medden_book_thumb_overrides_v1', JSON.stringify(next));
      } catch {}
      return next;
    });
    if (books.some((item) => item.id === bk.id)) {
      onUpdateBook?.({ ...bk, thumbnail: cfg });
    }
    if (activeBookModal?.id === bk.id) {
      setActiveBookModal({ ...activeBookModal, thumbnail: cfg });
    }
  };

  // Personal Google Drive PDF Upload Offloading State
  const [isDriveUploadOpen, setIsDriveUploadOpen] = useState(false);
  const [drivePdfFile, setDrivePdfFile] = useState<File | null>(null);
  const [drivePdfTitle, setDrivePdfTitle] = useState('');
  const [drivePdfAuthor, setDrivePdfAuthor] = useState('');
  const [drivePdfEdition, setDrivePdfEdition] = useState('PDF Edition');
  const [drivePdfSubject, setDrivePdfSubject] = useState<SubjectCourse>(currentSubject);
  const [driveUploadProgress, setDriveUploadProgress] = useState<number | null>(null);
  const [driveUploadError, setDriveUploadError] = useState<string | null>(null);
  const [driveUploadStatus, setDriveUploadStatus] = useState<string | null>(null);
  const [showInlineDriveReader, setShowInlineDriveReader] = useState(true);

  const cloudUploadedBooks = books.filter(
    (b) => b.isUserUploaded || b.storageProvider === 'google_drive' || b.driveFileId
  );

  const handleOpenUploadModal = () => {
    void prefetchGoogleOAuth();
    setDrivePdfSubject(currentSubject);
    setDrivePdfFile(null);
    setDrivePdfTitle('');
    setDrivePdfAuthor('');
    setDrivePdfEdition('PDF Edition');
    setDrivePdfThumbnail(undefined);
    setIsEditingUploadThumb(false);
    setDriveUploadProgress(null);
    setDriveUploadError(null);
    setDriveUploadStatus(null);
    setIsDriveUploadOpen(true);
  };

  const handleUploadBookToPersonalDrive = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!drivePdfFile) {
      setDriveUploadError('Please select a PDF textbook or medical document to upload.');
      return;
    }
    setDriveUploadError(null);
    setDriveUploadProgress(1);
    setDriveUploadStatus(`Connecting to personal Google Drive ("${DRIVE_APP_FOLDER_NAME}")...`);

    try {
      const accessToken = await getValidDriveAccessToken();
      setDriveUploadStatus(`Uploading ${(drivePdfFile.size / (1024 * 1024)).toFixed(2)} MB PDF directly to Google Drive...`);

      const uploadResult = await uploadPdfToPersonalDrive(drivePdfFile, accessToken, {
        folderId: driveAccount.folderId,
        makeAnyoneReader: true,
        onProgress: (pct) => {
          setDriveUploadProgress(pct);
          setDriveUploadStatus(`Streaming PDF directly to Google Drive (${pct}%)...`);
        },
      });

      const bookTitle = drivePdfTitle.trim() || drivePdfFile.name.replace(/\.pdf$/i, '');
      const sizeMb = `${(uploadResult.fileSizeBytes / (1024 * 1024)).toFixed(2)} MB`;
      const newBook: MedicalBook = {
        id: `book-drive-${Date.now()}`,
        title: bookTitle,
        subject: drivePdfSubject,
        author: drivePdfAuthor.trim() || 'Uploaded to Personal Google Drive',
        edition: drivePdfEdition.trim() || sizeMb,
        coverColor: drivePdfThumbnail?.bgColor || '#7c4521',
        thumbnail: drivePdfThumbnail || getDefaultThumbnail(bookTitle, '#7c4521'),
        pdfFileUrl: uploadResult.webViewLink,
        driveFileId: uploadResult.driveFileId,
        driveFolderId: uploadResult.driveFolderId,
        fileSizeBytes: uploadResult.fileSizeBytes,
        mimeType: uploadResult.mimeType,
        storageProvider: 'google_drive',
        isUserUploaded: true,
        bookmarks: [1],
        pages: [
          {
            pageNumber: 1,
            title: `${bookTitle} · Full PDF Hosted on Personal Google Drive`,
            keyTopic: `${drivePdfSubject} · ${sizeMb}`,
            summaryPearl: `Stored safely in your personal Google Drive ("${DRIVE_APP_FOLDER_NAME}"). Only the link metadata (${uploadResult.driveFileId}) is synced to Supabase.`,
            contentHtml: `<p><strong>${bookTitle}</strong> (${sizeMb}) is offloaded to your personal Google Drive folder so Supabase stays ultra-lightweight while syncing seamlessly across your devices.</p>`,
          },
        ],
        updatedAt: new Date().toISOString(),
      };

      onAddBook?.(newBook);
      setDriveUploadStatus('Uploaded to Drive and metadata synced cleanly!');
      setIsDriveUploadOpen(false);
      setActiveBookModal(newBook);
      setShowInlineDriveReader(true);
    } catch (err: any) {
      if (err?.status === 401) {
        await disconnectGoogleDrive().catch(() => {});
      }
      setDriveUploadProgress(null);
      setDriveUploadError(err?.message || 'Google Drive PDF upload failed.');
      setDriveUploadStatus(null);
    }
  };

  // Shelfwise Bookshelf State
  interface BookshelfSection {
    id: number;
    name: string;
    count: number;
  }

  type SortOption = 'last_opened' | 'alphabetical' | 'alphabetical_desc' | 'most_opened' | 'recently_added';

  interface FrontMedicalBook extends MedicalBook {
    readCount: number;
    lastOpenedText: string;
    lastOpenedTimestamp: number;
    addedTimestamp: number;
  }

  const CURATED_MEDICAL_BOOKS: FrontMedicalBook[] = [];

  const DEFAULT_SHELF_SECTIONS: BookshelfSection[] = [];

  const [shelfSort, setShelfSort] = useState<Record<number, SortOption>>({
    1: 'last_opened',
    2: 'last_opened',
    3: 'last_opened',
    4: 'last_opened',
  });

  const [shelfScrollPos, setShelfScrollPos] = useState<Record<number, number>>({});

  const handleShelfScroll = (secId: number, target: HTMLDivElement) => {
    const max = target.scrollWidth - target.clientWidth;
    if (max > 0) {
      const pct = Math.round((target.scrollLeft / max) * 100);
      setShelfScrollPos((prev) => ({ ...prev, [secId]: pct }));
    }
  };

  const onSliderChange = (secId: number, pct: number) => {
    setShelfScrollPos((prev) => ({ ...prev, [secId]: pct }));
    const el = document.getElementById(`shelf-books-${secId}`);
    if (el) {
      const max = el.scrollWidth - el.clientWidth;
      el.scrollLeft = (pct / 100) * (max > 0 ? max : 0);
    }
  };

  const scrollShelf = (secId: number, delta: number) => {
    const el = document.getElementById(`shelf-books-${secId}`);
    if (el) {
      el.scrollBy({ left: delta, behavior: 'smooth' });
    }
  };

  const getSectionBooks = (_secId: number, _count: number): FrontMedicalBook[] => [];

  const getSortedSectionBooks = (secId: number, secBooks: FrontMedicalBook[]): FrontMedicalBook[] => {
    const sort = shelfSort[secId] || 'last_opened';
    const list = [...secBooks];
    switch (sort) {
      case 'alphabetical':
        return list.sort((a, b) => a.title.localeCompare(b.title));
      case 'alphabetical_desc':
        return list.sort((a, b) => b.title.localeCompare(a.title));
      case 'most_opened':
        return list.sort((a, b) => b.readCount - a.readCount);
      case 'recently_added':
        return list.sort((a, b) => b.addedTimestamp - a.addedTimestamp);
      case 'last_opened':
      default:
        return list.sort((a, b) => b.lastOpenedTimestamp - a.lastOpenedTimestamp);
    }
  };

  const SHELFWISE_PALETTE = [
    '#8a3b2e', '#2f4a3a', '#c9b48a', '#3b4a63',
    '#d9cfbd', '#6e5a3c', '#a8763e', '#4b3a2c',
    '#e8e1d3', '#7a8b6f', '#5c2f36', '#b5a07a'
  ];

  const rnd = (seed: number) => {
    const x = Math.sin(seed * 9301 + 49297) * 233280;
    return x - Math.floor(x);
  };

  const [sections, setSections] = useState<BookshelfSection[]>(() => {
    try {
      const saved = localStorage.getItem('medden_bookshelf_sections_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return DEFAULT_SHELF_SECTIONS;
  });

  const [notesShelf, setNotesShelf] = useState<{ name: string; count: number }>(() => {
    try {
      const saved = localStorage.getItem('medden_bookshelf_notes_v3');
      if (saved) return JSON.parse(saved);
    } catch {}
    return { name: 'Notes', count: 0 };
  });

  const [isCabinetOpen, setIsCabinetOpen] = useState(false);
  const [editingTarget, setEditingTarget] = useState<BookshelfSection | 'notes' | null>(null);
  const [isNewSection, setIsNewSection] = useState(false);
  const [editName, setEditName] = useState('');
  const [editCount, setEditCount] = useState(0);

  const saveSections = (newSecs: BookshelfSection[]) => {
    setSections(newSecs);
    localStorage.setItem('medden_bookshelf_sections_v3', JSON.stringify(newSecs));
  };

  const saveNotesShelf = (newNotes: { name: string; count: number }) => {
    setNotesShelf(newNotes);
    localStorage.setItem('medden_bookshelf_notes_v3', JSON.stringify(newNotes));
  };

  const WOOD_SHADES = [
    'linear-gradient(180deg, #24160f 0%, #170d08 100%)', // Rich Dark Walnut
    'linear-gradient(180deg, #2e1a11 0%, #1f110a 100%)', // Warm Golden Teak
    'linear-gradient(180deg, #2a1215 0%, #1a0a0c 100%)', // Mahogany Rosewood
    'linear-gradient(180deg, #1c1512 0%, #120e0c 100%)', // Deep Espresso Oak
    'linear-gradient(180deg, #331f13 0%, #23140b 100%)', // Vintage Amber Chestnut
    'linear-gradient(180deg, #281712 0%, #1b0f0b 100%)', // Aged Cedar
  ];

  // 5 Authentic Almirah & Bookshelf Designs from user-uploaded showroom photos
  const ALMIRAH_DESIGNS = [
    {
      id: 'dark-chocolate',
      name: 'Classic Walnut Showcase',
      badge: 'Finish 1 · Classic Walnut',
      material: 'Natural Burma Teak with Full Glass Framed Double Doors',
      wallTexture: 'linear-gradient(90deg, #1b1713 0%, #29221b 15%, #1b1713 30%, #29221b 45%, #1b1713 60%, #29221b 75%, #1b1713 90%, #241e17 100%)',
      frameBg: 'linear-gradient(180deg, #a96d36 0%, #7d4d20 50%, #563312 100%)',
      woodShades: ['#7d4d20', '#6c4119', '#5a3513', '#49290e'],
      crownStyle: 'border-b-4 border-amber-900/90 shadow-2xl',
      doorStyle: 'bg-gradient-to-r from-[#7d4d20]/75 to-[#563312]/75 backdrop-blur-xs border-4 border-[#a96d36]',
      handleColor: '#fdfbf7', // Porcelain white/brass round knobs
      isGlassDoor: true,
      knobType: 'round',
    },
    {
      id: 'vanilla-white',
      name: 'Vanilla White Cabinet',
      badge: 'Finish 2 · Vanilla White',
      material: 'Engineered Wood in Frosty White Finish with Clear Glass Doors',
      wallTexture: 'linear-gradient(135deg, #e8dfd1 0%, #ddd2c1 100%)',
      frameBg: 'linear-gradient(180deg, #ffffff 0%, #f7f7f7 50%, #ededed 100%)',
      woodShades: ['#fcfbf9', '#f5f3ef', '#eeebe4', '#e6e2d9'],
      crownStyle: 'border-b-2 border-stone-300 shadow-md',
      doorStyle: 'bg-white/45 backdrop-blur-xs border-4 border-white shadow-lg',
      handleColor: '#cbd5e1', // Slender vertical silver bar handles
      isGlassDoor: true,
      knobType: 'bar',
    },
    {
      id: 'mocha-espresso',
      name: 'Mocha Espresso Armoire',
      badge: 'Finish 3 · Mocha Espresso',
      material: 'Rich Espresso Walnut with Bottom Textured Woven Cane Doors',
      wallTexture: 'linear-gradient(135deg, #2b2824 0%, #1a1815 100%)',
      frameBg: 'linear-gradient(180deg, #443024 0%, #2e2017 50%, #1d130d 100%)',
      woodShades: ['#3a281d', '#2f1f16', '#251710', '#1c100a'],
      crownStyle: 'border-b-4 border-amber-950 shadow-2xl',
      doorStyle: 'bg-gradient-to-r from-[#2e2017] to-[#1d130d] border-2 border-[#5a4030]',
      handleColor: '#d4af37', // Vertical brass pulls
      isGlassDoor: false,
      knobType: 'brass-pull',
    },
    {
      id: 'creamy-caramel',
      name: 'Creamy Caramel Cabinet',
      badge: 'Finish 4 · Creamy Caramel',
      material: 'Warm Honey Teak Open Display with Bottom Dual Cream Doors',
      wallTexture: 'linear-gradient(135deg, #f3ece0 0%, #dfd5c3 100%)',
      frameBg: 'linear-gradient(180deg, #b87837 0%, #955d24 50%, #724416 100%)',
      woodShades: ['#955d24', '#84501d', '#724316', '#613610'],
      crownStyle: 'border-b-2 border-amber-700/60 shadow-lg',
      doorStyle: 'bg-[#f7f3ec] border-2 border-[#b87837]/50 shadow-sm',
      handleColor: '#b8975a', // Slim brass vertical handles
      isGlassDoor: false,
      knobType: 'brass-pull',
    },
    {
      id: 'vault',
      name: 'Vault Cabinet',
      badge: 'Finish 5 · Vault',
      material: 'Coal-Black Matte Steel Tijori Vault & Blast Security Panels',
      wallTexture: 'linear-gradient(135deg, #1b1b1b 0%, #0d0d0d 100%)',
      frameBg: 'linear-gradient(180deg, #1a1a1a 0%, #101010 50%, #070707 100%)',
      woodShades: ['#181818', '#121212', '#0d0d0d', '#080808'],
      crownStyle: 'border-b-3 border-neutral-800 shadow-xl',
      doorStyle: 'bg-[#121212] border-4 border-[#262626] shadow-md',
      handleColor: '#d4af37',
      isGlassDoor: false,
      knobType: 'bar',
    },
  ];

  const [almirahIndex, setAlmirahIndex] = useState<number>(0);
  const currentAlmirah = ALMIRAH_DESIGNS[almirahIndex] || ALMIRAH_DESIGNS[0];
  const [isBacklit, setIsBacklit] = useState<boolean>(true);
  const [isPullingCord, setIsPullingCord] = useState<boolean>(false);
  const [isDoorsOpen, setIsDoorsOpen] = useState<boolean>(true);
  const [isCabinetDoorsOpen, setIsCabinetDoorsOpen] = useState<boolean>(true);
  const [isEagleViewOpen, setIsEagleViewOpen] = useState<boolean>(false);
  const [isAsideOpen, setIsAsideOpen] = useState<boolean>(true);

  const handlePullCord = () => {
    setIsPullingCord(true);
    setIsBacklit((prev) => !prev);
    setTimeout(() => setIsPullingCord(false), 300);
  };

  const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= sections.length) return;
    const reordered = [...sections];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(newIndex, 0, moved);
    saveSections(reordered);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndexStr = e.dataTransfer.getData('text/plain');
    if (!dragIndexStr) return;
    const dragIndex = parseInt(dragIndexStr, 10);
    if (isNaN(dragIndex) || dragIndex === dropIndex) return;
    const reordered = [...sections];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(dropIndex, 0, moved);
    saveSections(reordered);
  };

  const openEdit = (target: BookshelfSection | 'notes', isNew = false) => {
    setEditingTarget(target);
    setIsNewSection(isNew);
    if (target === 'notes') {
      setEditName(notesShelf.name);
      setEditCount(notesShelf.count);
    } else {
      setEditName(target.name);
      setEditCount(target.count);
    }
  };

  const handleSaveEdit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editingTarget) return;

    if (editingTarget === 'notes') {
      saveNotesShelf({
        name: editName.trim() || 'Notes & Journals',
        count: Math.max(0, Math.min(60, editCount)),
      });
    } else if (isNewSection) {
      const newSec: BookshelfSection = {
        id: Date.now(),
        name: editName.trim() || 'New Section',
        count: Math.max(0, Math.min(60, editCount)),
      };
      saveSections([...sections, newSec]);
    } else {
      const updated = sections.map((s) =>
        s.id === (editingTarget as BookshelfSection).id
          ? { ...s, name: editName.trim() || s.name, count: Math.max(0, Math.min(60, editCount)) }
          : s
      );
      saveSections(updated);
    }
    setEditingTarget(null);
  };

  const handleDeleteSection = () => {
    if (!editingTarget || editingTarget === 'notes') return;
    const filtered = sections.filter((s) => s.id !== (editingTarget as BookshelfSection).id);
    saveSections(filtered);
    setEditingTarget(null);
  };

  const handleMoveSection = (dir: -1 | 1) => {
    if (!editingTarget || editingTarget === 'notes') return;
    const targetId = (editingTarget as BookshelfSection).id;
    const idx = sections.findIndex((s) => s.id === targetId);
    const targetIdx = idx + dir;
    if (targetIdx < 0 || targetIdx >= sections.length) return;
    const copy = [...sections];
    const [moved] = copy.splice(idx, 1);
    copy.splice(targetIdx, 0, moved);
    saveSections(copy);
  };

  const handleAddBookToShelf = (secId: number) => {
    const updated = sections.map((s) =>
      s.id === secId ? { ...s, count: Math.min(60, s.count + 1) } : s
    );
    saveSections(updated);
  };

  // Classification Flowchart with Levels State
  const [activeClassificationId, setActiveClassificationId] = useState<string>('tree-shock');
  const [isBuilderOpen, setIsBuilderOpen] = useState<boolean>(false);
  const [collapsedNodeIds, setCollapsedNodeIds] = useState<Set<string>>(new Set());
  const [newNodeTitle, setNewNodeTitle] = useState('');
  const [newNodeDesc, setNewNodeDesc] = useState('');
  const [newNodePearl, setNewNodePearl] = useState('');
  const [newNodeLevel, setNewNodeLevel] = useState<1 | 2 | 3 | 4>(2);
  const [customClassifications, setCustomClassifications] = useState<ClassificationTreeDoc[]>(() => {
    try {
      const saved = localStorage.getItem('medden_custom_classification_trees');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  const allClassificationTrees = [...CLASSIFICATION_TEMPLATES, ...customClassifications];
  const activeTree: ClassificationTreeDoc | undefined =
    allClassificationTrees.find((t) => t.id === activeClassificationId) || allClassificationTrees[0];

  const toggleNodeCollapse = (nodeId: string) => {
    setCollapsedNodeIds((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) next.delete(nodeId);
      else next.add(nodeId);
      return next;
    });
  };

  const handleSnipClassificationTree = (tree: ClassificationTreeDoc) => {
    if (onSnipToNote) {
      onSnipToNote({
        id: `snip-class-${Date.now()}`,
        dataUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=400&q=80',
        sourceBookTitle: `Classification Flowchart: ${tree.title}`,
        pageNumber: 1,
        caption: `[CLASSIFICATION FLOWCHART · ${tree.title}]: ${tree.levelsGuide.map((l) => `${l.label}`).join(' ➔ ')}`,
        timestamp: new Date().toLocaleTimeString(),
      });
    }
    setSnipSuccessId(tree.id);
    setTimeout(() => setSnipSuccessId(null), 2200);
  };

  const handleAddCustomNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNodeTitle.trim() || !activeTree) return;

    const newNode: ClassificationItemNode = {
      id: `node-${Date.now()}`,
      level: newNodeLevel,
      title: newNodeTitle.trim(),
      badge: `Level ${newNodeLevel}`,
      description: newNodeDesc.trim() || 'Custom clinical diagnostic criteria.',
      keyPearl: newNodePearl.trim() || undefined,
    };

    const updatedTree: ClassificationTreeDoc = {
      ...activeTree,
      root: {
        ...activeTree.root,
        children: [...(activeTree.root.children || []), newNode],
      },
    };

    const updatedList = [
      ...customClassifications.filter((t) => t.id !== activeTree.id),
      updatedTree,
    ];
    setCustomClassifications(updatedList);
    localStorage.setItem('medden_custom_classification_trees', JSON.stringify(updatedList));

    setNewNodeTitle('');
    setNewNodeDesc('');
    setNewNodePearl('');
    setIsBuilderOpen(false);
  };

  const subjectsList = ['All', 'Pharmacology', 'Pathology', 'Anatomy', 'Physiology', 'Microbiology', 'Internal Medicine', 'Cardiology', 'Emergency', 'Neurology', 'Gastroenterology'];

  // Filtered Flowcharts
  const filteredFlowcharts = INITIAL_FLOWCHART_DOCS.filter((fc) => {
    const matchesSearch =
      fc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fc.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fc.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fc.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fc.nodes.some((n) => n.label.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSubject =
      selectedSubjectFilter === 'All' ||
      fc.subject.toLowerCase().includes(selectedSubjectFilter.toLowerCase()) ||
      fc.category.toLowerCase().includes(selectedSubjectFilter.toLowerCase());
    return matchesSearch && matchesSubject;
  });

  // Filtered Books
  const filteredBooks = books.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubjectFilter === 'All' || b.subject.toLowerCase().includes(selectedSubjectFilter.toLowerCase());
    return matchesSearch && matchesSubject;
  });

  // Filtered Notes
  const filteredNotebooks = notebooks.filter((nb) => {
    const matchesSearch =
      nb.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nb.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nb.pages.some((p) => p.title.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSubject = selectedSubjectFilter === 'All' || nb.subject.toLowerCase().includes(selectedSubjectFilter.toLowerCase());
    return matchesSearch && matchesSubject;
  });

  // Filtered Medical Images
  const filteredImages = MEDICAL_IMAGE_ATLAS.filter((img) => {
    const matchesSearch =
      img.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      img.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      img.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      img.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSubject = selectedSubjectFilter === 'All' || img.subject.toLowerCase().includes(selectedSubjectFilter.toLowerCase());
    return matchesSearch && matchesSubject;
  });

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSnipFlowchart = (fc: MedicalFlowchartDoc) => {
    if (onSnipToNote) {
      onSnipToNote({
        id: `snip-fc-${Date.now()}`,
        dataUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=400&q=80',
        sourceBookTitle: `Flowchart: ${fc.title}`,
        pageNumber: 1,
        caption: `[FLOWCHART: ${fc.title} (${fc.category})]: ${fc.nodes.map((n, i) => `${i + 1}. ${n.label}`).join(' -> ')}`,
        timestamp: new Date().toLocaleTimeString(),
      });
    }
    setSnipSuccessId(fc.id);
    setTimeout(() => setSnipSuccessId(null), 2200);
  };

  const handleSnipImage = (item: MedicalImageItem) => {
    if (onSnipToNote) {
      onSnipToNote({
        id: `snip-${Date.now()}`,
        dataUrl: item.imageUrl,
        sourceBookTitle: item.title,
        pageNumber: 1,
        caption: `${item.title} (${item.category}): ${item.clinicalSignificance}`,
        timestamp: new Date().toLocaleTimeString(),
      });
    }
    setSnipSuccessId(item.id);
    setTimeout(() => setSnipSuccessId(null), 2200);
  };

  // Room day/night mode follows the global app dark/light mode
  const [themeModeDark, setThemeModeDark] = useState<boolean>(() => {
    try {
      if (typeof document !== 'undefined') {
        return (
          document.documentElement.classList.contains('dark') ||
          localStorage.getItem('medden_theme') === 'dark'
        );
      }
    } catch {}
    return false;
  });

  useEffect(() => {
    const checkTheme = () => {
      setThemeModeDark(
        document.documentElement.classList.contains('dark') ||
        localStorage.getItem('medden_theme') === 'dark'
      );
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    window.addEventListener('storage', checkTheme);
    return () => {
      observer.disconnect();
      window.removeEventListener('storage', checkTheme);
    };
  }, []);

  const effectiveNightMode = isDarkMode !== undefined ? isDarkMode : themeModeDark;

  const handleSelectShelfBook = (shelfBook: ShelfBook) => {
    const found =
      CURATED_MEDICAL_BOOKS.find(
        (b) =>
          b.title.toLowerCase().includes(shelfBook.title.toLowerCase()) ||
          shelfBook.title.toLowerCase().includes(b.title.toLowerCase())
      ) ||
      books.find(
        (b) =>
          b.title.toLowerCase().includes(shelfBook.title.toLowerCase()) ||
          shelfBook.title.toLowerCase().includes(b.title.toLowerCase())
      );

    if (found) {
      setActiveBookModal(
        shelfBook.thumbnail ? { ...found, thumbnail: shelfBook.thumbnail } : found
      );
    } else {
      const dynamicBook: FrontMedicalBook = {
        id: shelfBook.id,
        title: shelfBook.title,
        subject: 'Internal Medicine',
        author: 'Ach1ev Medical Library',
        edition: 'Standard Edition',
        coverColor: shelfBook.thumbnail?.bgColor || SHELF_COVER[shelfBook.cover]?.from || '#1e3a8a',
        thumbnail: shelfBook.thumbnail,
        readCount: 1,
        lastOpenedText: 'Just now',
        lastOpenedTimestamp: Date.now(),
        addedTimestamp: Date.now(),
        bookmarks: [1],
        pages: [
          {
            pageNumber: 1,
            title: `${shelfBook.title} · Chapter 1: Clinical High-Yield Review`,
            keyTopic: 'Diagnostic Criteria & Pathophysiology Highlights',
            summaryPearl: 'Comprehensive clinical study review and high-yield concepts.',
            contentHtml: `<p>Welcome to <strong>${shelfBook.title}</strong>. Full digital study edition with clinical notes, diagnostic criteria, and board examination pearls.</p>`,
          },
        ],
      };
      setActiveBookModal(dynamicBook);
    }
  };

  return (
    <div className="shelfwise-root">
      <div className="shelfwise-app">
        {/* Left Library Overview Sidebar with Collapsible Toggle per user request */}
        {isAsideOpen ? (
          <aside className="shelfwise-aside" aria-label="Library overview">
            <div className="flex items-center justify-between pb-1">
              <div className="shelfwise-brand">
                <span className="shelfwise-brand-mark" aria-hidden="true">
                  <BookOpen className="w-4 h-4 text-amber-200" />
                </span>
                <span className="text-[15.5px] font-serif font-bold text-[#2b2118] dark:text-amber-100 whitespace-nowrap">Library Sections</span>
              </div>
            </div>

            {/* Hide Column Button matching Main Sidebar */}
            <button
              type="button"
              onClick={() => setIsAsideOpen(false)}
              className="themed-soft-pill w-full group flex items-center justify-center py-1 mb-2 rounded-lg bg-[#e6d9c4] hover:bg-[#dacab0] dark:bg-black/40 dark:hover:bg-black/60 border border-[#b8975a]/45 dark:border-amber-900/40 text-[#4a321f] dark:text-amber-300 dark:hover:text-amber-100 transition-all shadow-xs active:scale-[0.97] cursor-pointer"
              title="Hide Library Sections Column to expand Almirah"
              aria-label="Hide column"
            >
              <ArrowLeft className="w-3.5 h-3.5 stroke-[2.2] transition-transform duration-200 group-hover:-translate-x-1" />
            </button>

            <div className="shelfwise-stats">
              <div className="shelfwise-stat">
                <b>{sections.reduce((a, s) => a + s.count, 0)}</b>
                <span>Books</span>
              </div>
              <div className="shelfwise-stat">
                <b>{sections.length}</b>
                <span>Sections</span>
              </div>
              <div className="shelfwise-stat">
                <b>{notesShelf.count}</b>
                <span>Notes</span>
              </div>
            </div>
            <div>
              <p className="shelfwise-label">Sections</p>
              <ul className="shelfwise-sec-list">
                {sections.length === 0 ? (
                  <li className="px-2 py-2 text-[11px] opacity-65 italic">No sections added yet</li>
                ) : (
                  sections.map((sec, idx) => (
                  <li key={sec.id}>
                    <button
                      type="button"
                      onClick={() => {
                        if (activeTab !== 'books') setActiveTab('books');
                        setTimeout(() => {
                          const el = document.getElementById(`sec-${sec.id}`);
                          el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }, 50);
                      }}
                    >
                      <span className="truncate max-w-[116px]">
                        {idx + 1}. {sec.name}
                      </span>
                      <em>{sec.count}</em>
                    </button>
                  </li>
                  ))
                )}
              </ul>
            </div>

            {/* Flowcharts in Library Left Column (Indexed, Sortable & High Contrast in Light/Dark Mode) */}
            <div className="mt-4 pt-3 border-t border-[#b8975a]/35 dark:border-amber-900/40">
              <div className="flex flex-wrap items-center justify-between gap-1 mb-2 px-0.5">
                <button
                  type="button"
                  onClick={() => setActiveTab('flowcharts')}
                  className="shelfwise-label mb-0 flex items-center gap-1.5 text-[#3b2615] dark:text-amber-200 hover:text-[#6e451e] dark:hover:text-amber-100 transition-colors cursor-pointer text-left"
                >
                  <GitBranch className="w-3.5 h-3.5 text-[#8e622a] dark:text-amber-400" />
                  <span>Flowcharts</span>
                </button>
                <div className="flex items-center gap-1">
                  <select
                    value={flowchartSort}
                    onChange={(e) => setFlowchartSort(e.target.value as 'recent' | 'az' | 'nodes')}
                    aria-label="Sort flowcharts index"
                    title="Sort flowcharts index"
                    className="themed-glass-card text-[10px] font-mono rounded-md px-1.5 py-0.5 bg-[#eadec9] dark:bg-[#1a120d] border border-[#b8975a]/50 dark:border-amber-900/50 text-[#2b2118] dark:text-amber-200 outline-none cursor-pointer"
                  >
                    <option value="recent">Recent</option>
                    <option value="az">A–Z</option>
                    <option value="nodes">Steps</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => setActiveTab('flowcharts')}
                    className="text-[10px] font-mono font-semibold text-[#784918] dark:text-amber-400/90 hover:underline cursor-pointer pl-1"
                  >
                    Studio ➔
                  </button>
                </div>
              </div>

              <div className="space-y-1 max-h-60 overflow-y-auto custom-scrollbar pr-1">
                {(() => {
                  let userCharts: Array<{ id: string; title: string; nodes?: any[]; lastUpdated?: string }> = [];
                  try {
                    const saved = localStorage.getItem('medden_studio_flowcharts');
                    if (saved) {
                      const parsed = JSON.parse(saved);
                      const sampleChartIds = new Set(['chart-shiv-parivar', 'chart-ikshvaku', 'chart-acs', 'chart-shock']);
                      if (Array.isArray(parsed)) {
                        userCharts = parsed.filter((c: any) => c && c.id && !sampleChartIds.has(c.id));
                      }
                    }
                  } catch {}
                  const combined = [...userCharts, ...INITIAL_FLOWCHART_DOCS];
                  if (combined.length === 0) {
                    return (
                      <p className="px-2 py-2 text-[11px] opacity-65 italic">
                        No flowcharts yet
                      </p>
                    );
                  }
                  return combined
                    .sort((a, b) => {
                      if (flowchartSort === 'az') return a.title.localeCompare(b.title);
                      if (flowchartSort === 'nodes') return (b.nodes?.length || 0) - (a.nodes?.length || 0);
                      return new Date(b.lastUpdated || 0).getTime() - new Date(a.lastUpdated || 0).getTime();
                    })
                    .map((fc, idx) => (
                      <button
                        key={fc.id}
                        type="button"
                        onClick={() => setActiveTab('flowcharts')}
                        className="themed-glass-card w-full text-left px-2 py-1.5 rounded-md bg-[#ede3d2] hover:bg-[#e1d2b8] dark:bg-black/35 dark:hover:bg-amber-950/40 border border-[#b8975a]/45 dark:border-amber-900/30 hover:border-[#8e622a] dark:hover:border-amber-600/50 transition-all flex items-center gap-1.5 group cursor-pointer"
                        title={`${fc.title} · ${fc.nodes?.length || 0} nodes · Updated ${fc.lastUpdated || 'Recently'}`}
                      >
                        <span className="text-[10px] font-mono font-bold text-[#6e451e] dark:text-amber-400 shrink-0 w-4 text-right">
                          {idx + 1}.
                        </span>
                        <GitBranch className="w-3 h-3 text-[#8e622a] dark:text-amber-400/80 shrink-0" />
                        <span className="text-[11px] font-semibold text-[#2b2118] dark:text-amber-200 dark:group-hover:text-amber-100 truncate whitespace-nowrap">
                          {fc.title}
                        </span>
                      </button>
                    ));
                })()}
              </div>
            </div>
          </aside>
        ) : (
          /* Minimized Strip to Reopen Left Column */
          <div className="themed-glass-bar w-7 shrink-0 bg-[#ede3d2] dark:bg-black/40 border-r border-[#b8975a]/40 dark:border-amber-900/40 flex flex-col items-center py-4 gap-4 z-20">
            <button
              type="button"
              onClick={() => setIsAsideOpen(true)}
              className="p-1.5 rounded-lg bg-[#A47C43]/20 hover:bg-[#A47C43]/35 text-[#4a321f] dark:text-amber-300 dark:hover:text-amber-100 transition-colors cursor-pointer shadow-sm"
              title="Expand Library Column"
              aria-label="Expand column"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <span
              className="text-[10px] font-mono text-[#5c3c1e] dark:text-amber-400/70 font-bold uppercase tracking-widest select-none cursor-pointer"
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
              onClick={() => setIsAsideOpen(true)}
            >
              Sections
            </span>
          </div>
        )}

        {/* Main View Area */}
        <main className="shelfwise-main">
          {/* Top Window Bar */}
          <header className="shelfwise-header">
            <div className="flex items-center gap-2">
              <span className="themed-soft-pill text-base font-serif font-bold text-[#2b2118] dark:text-amber-100 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#ede3d2] dark:bg-black/40 border border-[#b8975a]/45 dark:border-amber-900/40">
                <BookOpen className="w-4 h-4 text-[#8e622a] dark:text-amber-300" />
                <span>Shelf</span>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Subtle Total Books count */}
              <span className="text-[11px] font-mono text-[#5c4835] dark:text-amber-200/70 font-semibold px-1 mr-1">
                Total: {sections.reduce((a, s) => a + s.count, 0) + cloudUploadedBooks.length} books
              </span>

              {/* Library Button */}
              <button
                type="button"
                onClick={() => setIsEagleViewOpen(true)}
                className="shelfwise-btn shelfwise-btn-ghost flex items-center gap-1.5"
                title="Library: Subject-wise curated catalog of all textbooks & resources"
              >
                <LayoutGrid className="w-4 h-4 text-amber-400" />
                <span>Library</span>
              </button>

              {/* Flowcharts Button */}
              <button
                type="button"
                onClick={() => setActiveTab(activeTab === 'flowcharts' ? 'books' : 'flowcharts')}
                className={`shelfwise-btn ${
                  activeTab === 'flowcharts' ? 'shelfwise-btn-primary' : 'shelfwise-btn-ghost'
                }`}
              >
                <GitBranch className="w-4 h-4" />
                <span>{activeTab === 'flowcharts' ? 'Back to Shelf' : 'Flowcharts'}</span>
              </button>
            </div>
          </header>

          {/* TAB 1: PRIMARY BOOKSHELF (Exact Room + Almirah from user code) */}
          {activeTab === 'books' && (
            <div className="flex-1 overflow-y-auto custom-scrollbar p-1.5 sm:p-4 space-y-3 sm:space-y-4">
              {cloudUploadedBooks.length > 0 && (
                <div className="themed-glass-card rounded-2xl border border-amber-700/35 bg-amber-50/90 dark:bg-[#1b120c]/90 text-stone-900 dark:text-amber-100 p-3.5 shadow-lg">
                  <div className="flex items-center justify-between gap-2 mb-2.5 flex-wrap">
                    <div className="flex items-center gap-2">
                      <HardDrive className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                      <h3 className="text-base font-bold uppercase tracking-wider font-mono text-amber-900 dark:text-amber-200">
                        Personal Google Drive PDF Vault ({cloudUploadedBooks.length})
                      </h3>
                      <span className="themed-soft-pill text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/35 font-mono">
                        Synced via Metadata Link
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleOpenUploadModal}
                      className="themed-accent-btn text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-amber-700 hover:bg-amber-800 text-white flex items-center gap-1 cursor-pointer shadow-xs"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add PDF</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {cloudUploadedBooks.map((bk) => (
                      <div
                        key={bk.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => {
                          setActiveBookModal(bk);
                          setShowInlineDriveReader(true);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setActiveBookModal(bk);
                            setShowInlineDriveReader(true);
                          }
                        }}
                        className="text-left p-3 rounded-xl bg-white/85 hover:bg-amber-100/65 dark:bg-black/35 dark:hover:bg-amber-950/50 border border-amber-700/25 dark:border-amber-800/40 hover:border-amber-600/60 transition-all flex items-center justify-between gap-2.5 cursor-pointer group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <BookLogoBadge
                            compact
                            title={bk.title}
                            thumbnail={getResolvedBookThumb(bk)}
                            fallbackBg={bk.coverColor || '#7c4521'}
                          />
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-stone-900 dark:text-amber-100 truncate group-hover:text-amber-800 dark:group-hover:text-amber-300">
                              {bk.title}
                            </div>
                            <div className="text-[10px] text-amber-800/80 dark:text-amber-300/70 font-mono truncate mt-0.5">
                              {bk.subject} · {bk.fileSizeBytes ? `${(bk.fileSizeBytes / (1024 * 1024)).toFixed(1)} MB` : bk.edition}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingLibBook(bk);
                            }}
                            title="Edit Cover Thumbnail, A–Z Monogram & 100 Icons"
                            className="themed-soft-pill p-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/30 text-amber-800 dark:text-amber-300 border border-amber-500/30 transition cursor-pointer"
                          >
                            <Palette className="w-3.5 h-3.5" />
                          </button>
                          <ExternalLink className="w-3.5 h-3.5 text-amber-700/70 dark:text-amber-400/70 group-hover:text-amber-900 dark:group-hover:text-amber-200 shrink-0" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <ShelfRoom
                nightMode={effectiveNightMode}
                activeDesign={activeDesign}
                notebooks={notebooks}
                driveBooks={cloudUploadedBooks}
                onOpenEagleView={() => setIsEagleViewOpen(true)}
                onOpenFlowcharts={() => setActiveTab('flowcharts')}
                onSelectBook={handleSelectShelfBook}
              />
            </div>
          )}

          {/* TAB 2: FLOWCHARTS STUDIO */}
          {activeTab === 'flowcharts' && (
            <div className="flex-1 h-full overflow-hidden flex flex-col">
              <FlowchartStudio
                onBackToLibrary={() => setActiveTab('books')}
                onSnipToNote={onSnipToNote}
              />
            </div>
          )}

          {/* TAB 3: MEDICAL ATLAS */}
          {activeTab === 'images' && (
        <div className="p-4 sm:p-6 overflow-y-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 dark:text-zinc-400">
              <span>Showing {filteredImages.length} high-yield clinical figures, CT/MRI, histology stains, and ECG tracings</span>
              <span className="font-mono text-[#8e622a] dark:text-amber-400 font-semibold">
                Tip: Click "Snip to Note" to embed any diagram straight into your notebook!
              </span>
            </div>

            {/* Gallery Grid */}
            {filteredImages.length === 0 ? (
              <div className="themed-glass-card bg-white dark:bg-[#18110c] border border-stone-200 dark:border-[#382518] rounded-2xl p-10 text-center max-w-md mx-auto my-8 space-y-2">
                <p className="text-sm font-semibold text-stone-800 dark:text-[#efe4d4]">
                  No diagrams in atlas yet
                </p>
                <p className="text-xs text-stone-500 dark:text-[#a69079]">
                  Diagrams and images you add or snip to your notes will appear here.
                </p>
              </div>
            ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredImages.map((img) => (
                <div
                  key={img.id}
                  className="themed-glass-card bg-white dark:bg-[#18110c] border border-stone-200 dark:border-[#382518] rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  {/* Image Container with Zoom overlay */}
                  <div
                    onClick={() => setSelectedImage(img)}
                    className="relative w-full h-48 bg-stone-900 cursor-pointer overflow-hidden"
                  >
                    <img
                      src={img.imageUrl}
                      alt={img.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-between p-3 opacity-90 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-black/60 text-white backdrop-blur-xs border border-white/20">
                          {img.category}
                        </span>
                        <span className="p-1 rounded-lg bg-black/60 text-white backdrop-blur-xs hover:bg-black/80 transition-colors">
                          <ZoomIn className="w-3.5 h-3.5" />
                        </span>
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-sm leading-tight drop-shadow-md">
                          {img.title}
                        </h4>
                        <span className="text-[10px] text-zinc-300 font-mono mt-0.5 block">
                          {img.subject}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Body description */}
                  <div className="p-4 space-y-2.5 flex-1">
                    <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed line-clamp-2">
                      {img.description}
                    </p>

                    <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 text-[11px] text-amber-900 dark:text-amber-200">
                      <span className="font-bold">Clinical Key: </span>
                      {img.clinicalSignificance}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {img.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-stone-100 dark:bg-[#221811] text-slate-600 dark:text-[#d8c7b0]"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="p-3 bg-stone-50 dark:bg-[#140e0a] border-t border-stone-200 dark:border-[#382518] flex items-center justify-between">
                    <button
                      onClick={() => setSelectedImage(img)}
                      className="text-xs font-semibold text-slate-700 dark:text-[#d8c7b0] hover:text-amber-700 dark:hover:text-amber-300 flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </button>

                    <button
                      onClick={() => handleSnipImage(img)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold transition-all shadow-2xs ${
                        snipSuccessId === img.id
                          ? 'bg-[#A47C43] text-white'
                          : 'bg-[#7a5228] hover:bg-[#5e3d1c] text-white active:scale-95'
                      }`}
                    >
                      {snipSuccessId === img.id ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Snipped!</span>
                        </>
                      ) : (
                        <>
                          <Camera className="w-3.5 h-3.5" />
                          <span>Snip to Note</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            )}
          </div>
        )}
        </main>
      </div>



      {/* Shelfwise Edit Section Modal */}
      {editingTarget && (
        <div className="shelfwise-modal-overlay" onClick={() => setEditingTarget(null)}>
          <div className="shelfwise-dlg" onClick={(e) => e.stopPropagation()}>
            <h2>
              {isNewSection
                ? 'New section'
                : editingTarget === 'notes'
                ? 'Edit notes cabinet'
                : 'Edit section'}
            </h2>

            <label className="shelfwise-field">
              Section name
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                maxLength={32}
                required
                autoFocus
              />
            </label>

            {/* Visual Mini Picture Preview of the 5 Almirah Styles per user request */}
            {isNewSection && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-semibold text-stone-700 dark:text-stone-300 block">
                  Select Almirah Style Design (Mini Preview):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {ALMIRAH_DESIGNS.map((alm, idx) => (
                    <div
                      key={alm.id}
                      onClick={() => setAlmirahIndex(idx)}
                      className={`p-2 rounded-xl border flex items-center gap-2.5 transition-all cursor-pointer ${
                        almirahIndex === idx
                          ? 'border-amber-500 bg-amber-500/15 shadow-xs ring-1 ring-amber-500/40'
                          : 'border-stone-200 dark:border-stone-700 bg-black/10 hover:bg-black/20'
                      }`}
                    >
                      {/* Stylized Miniature Almirah Illustration / Picture */}
                      <div
                        className="w-10 h-14 rounded border border-black/40 shadow-xs flex flex-col justify-between p-0.5 shrink-0 relative overflow-hidden"
                        style={{ background: alm.frameBg }}
                      >
                        <div className="w-full h-1 bg-amber-900/60 rounded-xs" />
                        <div className="w-full flex-1 flex flex-col justify-around py-0.5 px-1">
                          <div className="w-full h-0.5 bg-black/30" />
                          <div className="w-full h-0.5 bg-black/30" />
                          <div className="w-full h-0.5 bg-black/30" />
                        </div>
                        {/* Door preview */}
                        <div className="w-full h-3 border-t border-black/40 flex items-center justify-center">
                          <div className="w-1 h-1.5 rounded-full" style={{ backgroundColor: alm.handleColor }} />
                        </div>
                      </div>

                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-bold text-stone-800 dark:text-stone-200 block truncate">
                          {alm.name}
                        </span>
                        <span className="text-[10px] text-stone-500 dark:text-stone-400 block line-clamp-1">
                          {alm.badge}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="shelfwise-field">
              <span>{editingTarget === 'notes' ? 'Number of notes' : 'Number of books'}</span>
              <div className="shelfwise-stepper">
                <button
                  type="button"
                  onClick={() => setEditCount(Math.max(0, editCount - 1))}
                  aria-label="Decrease"
                >
                  −
                </button>
                <output aria-live="polite">{editCount}</output>
                <button
                  type="button"
                  onClick={() => setEditCount(Math.min(60, editCount + 1))}
                  aria-label="Increase"
                >
                  +
                </button>
              </div>
              <input
                type="range"
                min={0}
                max={60}
                value={editCount}
                onChange={(e) => setEditCount(Number(e.target.value))}
                className="shelfwise-slider"
              />
            </div>

            {editingTarget !== 'notes' && !isNewSection && (
              <div className="shelfwise-row">
                <button
                  type="button"
                  className="shelfwise-btn shelfwise-btn-ghost"
                  onClick={() => handleMoveSection(-1)}
                >
                  Move up
                </button>
                <button
                  type="button"
                  className="shelfwise-btn shelfwise-btn-ghost"
                  onClick={() => handleMoveSection(1)}
                >
                  Move down
                </button>
              </div>
            )}

            <div className="shelfwise-row pt-2">
              {editingTarget !== 'notes' && !isNewSection && (
                <button
                  type="button"
                  className="shelfwise-btn-danger"
                  onClick={handleDeleteSection}
                >
                  Delete
                </button>
              )}
              <span className="spacer" />
              <button
                type="button"
                className="shelfwise-btn shelfwise-btn-ghost"
                onClick={() => setEditingTarget(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="shelfwise-btn shelfwise-btn-primary"
                onClick={handleSaveEdit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal for Image Inspection */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-[#18110c] rounded-2xl border border-stone-200 dark:border-[#382518] shadow-2xl flex flex-col overflow-hidden">
            <div className="p-3.5 border-b border-stone-200 dark:border-[#382518] flex items-center justify-between bg-stone-50 dark:bg-[#140e0a]">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-blue-600 text-white">
                  {selectedImage.category}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100 truncate">
                  {selectedImage.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedImage(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col md:flex-row gap-5">
              <div className="flex-1 bg-black rounded-xl overflow-hidden flex items-center justify-center min-h-[280px]">
                <img
                  src={selectedImage.imageUrl}
                  alt={selectedImage.title}
                  className="max-h-[60vh] max-w-full object-contain"
                />
              </div>
              <div className="w-full md:w-80 space-y-4">
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-zinc-100">{selectedImage.title}</h4>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">{selectedImage.subject}</p>
                </div>
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200">
                  <span className="font-bold">Clinical Key: </span>
                  {selectedImage.clinicalSignificance}
                </div>
                <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">
                  {selectedImage.description}
                </p>
                <button
                  onClick={() => handleSnipImage(selectedImage)}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                >
                  <Camera className="w-4 h-4" />
                  <span>{snipSuccessId === selectedImage.id ? 'Snipped to Note!' : 'Snip Diagram to Note'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Book Reader Modal */}
      {activeBookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="themed-glass-card relative w-full max-w-4xl max-h-[88vh] bg-white dark:bg-[#18110c] rounded-2xl border border-stone-200 dark:border-[#382518] shadow-2xl flex flex-col overflow-hidden">
            <div className="themed-glass-bar p-4 border-b border-stone-200 dark:border-[#382518] flex items-center justify-between bg-stone-50 dark:bg-[#140e0a]">
              <div className="flex items-center gap-2.5 min-w-0">
                <BookLogoBadge
                  compact
                  title={activeBookModal.title}
                  thumbnail={getResolvedBookThumb(activeBookModal)}
                  fallbackBg={activeBookModal.coverColor || '#7c4521'}
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-[#efe4d4] truncate">
                      {activeBookModal.title}
                    </h3>
                    {(activeBookModal.driveFileId || activeBookModal.storageProvider === 'google_drive') && (
                      <span className="themed-soft-pill text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/35 font-semibold shrink-0">
                        Google Drive Vault
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-[#a69079] font-mono truncate">
                    {activeBookModal.author} · {activeBookModal.edition}
                    {activeBookModal.fileSizeBytes
                      ? ` · ${(activeBookModal.fileSizeBytes / (1024 * 1024)).toFixed(2)} MB`
                      : ''}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setEditingLibBook(activeBookModal)}
                  className="themed-soft-pill px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/35 text-amber-800 dark:text-amber-300 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Palette className="w-3 h-3" />
                  <span>Edit Cover</span>
                </button>
                {activeBookModal.pdfFileUrl && (
                  <a
                    href={activeBookModal.pdfFileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="themed-soft-pill px-2.5 py-1 rounded-lg bg-amber-600/15 hover:bg-amber-600/25 border border-amber-600/35 text-amber-800 dark:text-amber-300 text-[11px] font-semibold flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Open in Drive</span>
                  </a>
                )}
                <button
                  onClick={() => setActiveBookModal(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-[#efe4d4]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
              {(activeBookModal.driveFileId || activeBookModal.pdfFileUrl) && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                      <HardDrive className="w-3.5 h-3.5" />
                      <span>Direct Google Drive PDF Stream</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowInlineDriveReader((p) => !p)}
                      className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 underline cursor-pointer"
                    >
                      {showInlineDriveReader ? 'Collapse PDF Viewer' : 'Expand PDF Viewer'}
                    </button>
                  </div>
                  {showInlineDriveReader && (
                    <div className="rounded-xl overflow-hidden border border-stone-200 dark:border-[#382518] bg-black/90 h-[440px]">
                      <iframe
                        src={
                          getDrivePreviewUrl(
                            activeBookModal.driveFileId || activeBookModal.pdfFileUrl
                          ) || undefined
                        }
                        title={activeBookModal.title}
                        className="w-full h-full border-0"
                        allow="autoplay"
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-[#221811] border border-amber-200 dark:border-[#4b3322] text-xs text-amber-950 dark:text-[#efe4d4]">
                <span className="font-bold">Overview: </span>
                {activeBookModal.pages[0]?.summaryPearl || 'Comprehensive high-yield medical textbook and clinical reference.'}
              </div>

              <div>
                <h4 className="text-xs font-bold font-mono uppercase text-slate-500 dark:text-[#a69079] mb-2">
                  Table of Contents & Core Chapters ({activeBookModal.pages.length})
                </h4>
                <div className="space-y-1.5">
                  {activeBookModal.pages.map((pg, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl border border-stone-200 dark:border-[#352317] bg-white dark:bg-[#1e150f] flex items-center justify-between text-xs hover:border-amber-500 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-stone-100 dark:bg-[#2a1d14] flex items-center justify-center font-mono font-bold text-[10px] text-slate-600 dark:text-[#d8c7b0]">
                          {pg.pageNumber || idx + 1}
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-[#efe4d4]">
                          {pg.title}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 dark:text-[#a69079]">
                        {pg.keyTopic}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="themed-glass-bar p-3 border-t border-stone-200 dark:border-[#382518] flex justify-end gap-2 bg-stone-50 dark:bg-[#140e0a]">
              <button
                onClick={() => setActiveBookModal(null)}
                className="px-4 py-1.5 rounded-xl bg-stone-200 dark:bg-[#2b1e15] text-slate-800 dark:text-[#efe4d4] text-xs font-semibold hover:bg-stone-300 dark:hover:bg-[#38261a] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Heavy PDF to Personal Google Drive Modal */}
      {isDriveUploadOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => driveUploadProgress === null && setIsDriveUploadOpen(false)}
        >
          <form
            onSubmit={handleUploadBookToPersonalDrive}
            onClick={(e) => e.stopPropagation()}
            className="themed-glass-card w-full max-w-lg rounded-2xl bg-[#fbf9f5] dark:bg-[#18110c] border border-stone-200 dark:border-[#382518] shadow-2xl overflow-hidden text-stone-900 dark:text-[#efe4d4]"
          >
            <div className="themed-glass-bar p-4 border-b border-stone-200 dark:border-[#382518] bg-stone-50 dark:bg-[#140e0a] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <HardDrive className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Upload Heavy PDF to Personal Google Drive</h3>
                  <p className="text-[10px] text-stone-500 dark:text-[#a69079]">
                    Offloads binary PDF to Drive (&ldquo;{DRIVE_APP_FOLDER_NAME}&rdquo;); syncs link metadata in Supabase.
                  </p>
                </div>
              </div>
              <button
                type="button"
                disabled={driveUploadProgress !== null}
                onClick={() => setIsDriveUploadOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-[#efe4d4]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-stone-100 dark:bg-[#221811] border border-stone-200 dark:border-[#382518] flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <span className="font-bold block truncate">
                    {driveAccount.connected
                      ? `Connected: ${driveAccount.email || 'Google Drive Ready'}`
                      : 'Google Drive authorization required on upload'}
                  </span>
                  <span className="text-[10px] text-stone-500 dark:text-[#a69079] block">
                    Target folder: {driveAccount.folderName || DRIVE_APP_FOLDER_NAME}
                  </span>
                </div>
                {!driveAccount.connected && (
                  <button
                    type="button"
                    onClick={() =>
                      connectGoogleDrive().catch((err: any) =>
                        setDriveUploadError(err?.message || 'Google Drive OAuth cancelled.')
                      )
                    }
                    className="themed-accent-btn px-2.5 py-1 rounded-lg bg-amber-700 hover:bg-amber-800 text-white text-[11px] font-semibold shrink-0 cursor-pointer"
                  >
                    Connect Drive
                  </button>
                )}
              </div>

              {driveUploadError && (
                <div className="p-2.5 rounded-xl bg-[#7f1d1d]/12 dark:bg-[#6e171b]/30 border border-[#7f1d1d]/30 dark:border-[#962d32]/50 text-[#6e1418] dark:text-[#e49b9e] flex items-center justify-between gap-2">
                  <div className="flex items-start gap-2 min-w-0">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span className="break-words">{driveUploadError}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setDriveUploadError(null);
                      connectGoogleDrive().catch((err: any) =>
                        setDriveUploadError(err?.message || 'Google Drive OAuth cancelled.')
                      );
                    }}
                    className="px-2.5 py-1 rounded-lg bg-amber-700 hover:bg-amber-800 text-white text-[10.5px] font-semibold shrink-0 cursor-pointer"
                  >
                    Connect Drive
                  </button>
                </div>
              )}

              <div>
                <label className="block font-semibold mb-1.5">Select Textbook / Clinical PDF</label>
                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={(e) => {
                    const f = e.target.files?.[0] || null;
                    setDrivePdfFile(f);
                    if (f && !drivePdfTitle) {
                      setDrivePdfTitle(f.name.replace(/\.pdf$/i, ''));
                    }
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-dashed border-amber-600/40 bg-white dark:bg-[#120c08] text-xs cursor-pointer"
                  required
                />
                {drivePdfFile && (
                  <p className="text-[10px] font-mono text-[#8e622a] dark:text-amber-400 mt-1">
                    Ready: {drivePdfFile.name} ({(drivePdfFile.size / (1024 * 1024)).toFixed(2)} MB)
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Book / Document Title</label>
                  <input
                    type="text"
                    placeholder="My PDF Document"
                    value={drivePdfTitle}
                    onChange={(e) => setDrivePdfTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-[#382518] bg-white dark:bg-[#120c08] outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Subject Category</label>
                  <select
                    value={drivePdfSubject}
                    onChange={(e) => setDrivePdfSubject(e.target.value as SubjectCourse)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-[#382518] bg-white dark:bg-[#120c08] outline-none focus:border-amber-500"
                  >
                    {[
                      'Pharmacology',
                      'Pathology',
                      'Anatomy',
                      'Physiology',
                      'Microbiology',
                      'Internal Medicine',
                      'Surgery',
                      'Pediatrics',
                    ].map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Author / Publisher</label>
                  <input
                    type="text"
                    placeholder="Author / Source"
                    value={drivePdfAuthor}
                    onChange={(e) => setDrivePdfAuthor(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-[#382518] bg-white dark:bg-[#120c08] outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Edition / Tag</label>
                  <input
                    type="text"
                    placeholder="Edition / Tag"
                    value={drivePdfEdition}
                    onChange={(e) => setDrivePdfEdition(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-[#382518] bg-white dark:bg-[#120c08] outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Custom Cover Logo / Monogram / 100 Icons for Uploaded PDF */}
              <div className="p-3 rounded-xl border border-stone-200 dark:border-[#382518] bg-stone-50 dark:bg-[#120c08] flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <BookLogoBadge
                    compact
                    title={drivePdfTitle.trim() || drivePdfFile?.name.replace(/\.pdf$/i, '') || 'PDF Book'}
                    thumbnail={drivePdfThumbnail}
                    fallbackBg="#7c4521"
                  />
                  <div className="min-w-0">
                    <span className="font-bold block text-xs">Cover Thumbnail Logo</span>
                    <span className="text-[10px] text-stone-500 dark:text-[#a69079] block truncate">
                      Pick A–Z designer font or 100 icons with color columns
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditingUploadThumb(true)}
                  className="themed-soft-pill px-2.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-800 dark:text-amber-300 text-[11px] font-semibold flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Palette className="w-3 h-3" />
                  <span>Customize</span>
                </button>
              </div>

              {driveUploadProgress !== null && (
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="truncate">{driveUploadStatus}</span>
                    <span className="font-bold">{driveUploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-stone-200 dark:bg-[#2b1e15] overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-700 to-amber-400 transition-all duration-200"
                      style={{ width: `${driveUploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="themed-glass-bar p-3.5 border-t border-stone-200 dark:border-[#382518] bg-stone-50 dark:bg-[#140e0a] flex justify-end gap-2">
              <button
                type="button"
                disabled={driveUploadProgress !== null}
                onClick={() => setIsDriveUploadOpen(false)}
                className="px-3.5 py-1.5 rounded-xl bg-stone-200 dark:bg-[#2b1e15] text-stone-800 dark:text-[#efe4d4] text-xs font-semibold cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={driveUploadProgress !== null || !drivePdfFile}
                className="themed-accent-btn px-4 py-1.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>{driveUploadProgress !== null ? 'Uploading to Drive...' : 'Upload to Drive & Sync'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Flowchart Modal */}
      {selectedFlowchartModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="themed-glass-card relative w-full max-w-3xl max-h-[88vh] bg-white dark:bg-[#18110c] rounded-2xl border border-stone-200 dark:border-[#382518] shadow-2xl flex flex-col overflow-hidden">
            <div className="themed-glass-bar p-4 border-b border-stone-200 dark:border-[#382518] flex items-center justify-between bg-stone-50 dark:bg-[#140e0a]">
              <div className="flex items-center gap-2.5">
                <div className="themed-accent-btn w-8 h-8 rounded-xl bg-[#A47C43] text-white flex items-center justify-center shadow-xs">
                  <GitBranch className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-[#efe4d4]">
                    {selectedFlowchartModal.title}
                  </h3>
                  <p className="text-[10px] text-slate-500 dark:text-[#a69079] font-mono">
                    {selectedFlowchartModal.category} · {selectedFlowchartModal.subject}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedFlowchartModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-[#efe4d4]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-[#231912] border border-amber-200 dark:border-[#4b3322] text-xs text-amber-950 dark:text-amber-200">
                <strong className="block mb-0.5">Clinical Protocol Summary:</strong>
                {selectedFlowchartModal.summary}
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold font-mono uppercase text-slate-500 dark:text-[#a69079]">
                  Step-by-Step Decision Algorithm ({selectedFlowchartModal.nodes.length} Key Checkpoints)
                </h4>

                <div className="space-y-2">
                  {selectedFlowchartModal.nodes.map((node, idx) => (
                    <div
                      key={node.id}
                      className={`p-3.5 rounded-xl border text-xs shadow-2xs ${
                        node.type === 'start'
                          ? 'bg-white dark:bg-[#241911] border-amber-500 dark:border-amber-600/70'
                          : node.type === 'decision'
                          ? 'bg-amber-50 dark:bg-[#2b1e13] border-amber-400 dark:border-amber-600/70'
                          : node.type === 'endpoint'
                          ? 'bg-stone-100 dark:bg-[#241820] border-stone-400 dark:border-amber-700/60'
                          : 'bg-white dark:bg-[#211711] border-stone-300 dark:border-[#4b3322]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-black/5 dark:bg-white/10">
                          Step {idx + 1}: {node.type}
                        </span>
                      </div>
                      <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-[#efe4d4]">
                        {node.label}
                      </h5>
                      {node.detail && (
                        <p className="text-xs text-slate-600 dark:text-[#d8c7b0] mt-1 leading-relaxed">
                          {node.detail}
                        </p>
                      )}
                      {node.branchYes && (
                        <div className="mt-2 pt-2 border-t border-stone-200 dark:border-[#382518] grid grid-cols-2 gap-2 text-xs">
                          <div className="p-2 rounded-lg bg-amber-100/80 dark:bg-amber-950/60 text-amber-950 dark:text-amber-200">
                            <strong className="block text-[9px] uppercase font-mono mb-0.5">↳ [YES Branch]:</strong>
                            {node.branchYes}
                          </div>
                          <div className="p-2 rounded-lg bg-[#7f1d1d]/12 dark:bg-[#6e171b]/30 border border-[#7f1d1d]/25 dark:border-[#962d32]/40 text-[#6e1418] dark:text-[#e49b9e]">
                            <strong className="block text-[9px] uppercase font-mono mb-0.5">↳ [NO Branch]:</strong>
                            {node.branchNo || 'Re-evaluate and monitor vitals'}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="themed-glass-bar p-3 border-t border-stone-200 dark:border-[#382518] flex justify-end gap-2 bg-stone-50 dark:bg-[#140e0a]">
              <button
                onClick={() => setSelectedFlowchartModal(null)}
                className="px-4 py-1.5 rounded-xl bg-stone-200 dark:bg-[#2b1e15] text-slate-800 dark:text-[#efe4d4] text-xs font-semibold hover:bg-stone-300 dark:hover:bg-[#38261a] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LIBRARY MODAL: THEME & MODE MATCHED SUBJECT-WISE SECTIONS */}
      {isEagleViewOpen && (() => {
        const themeMeta = getThemeMeta(activeDesign);
        const isHeritage = activeDesign === '1';
        const themeAccent = isDarkMode ? themeMeta.darkAccent : themeMeta.lightAccent;
        const solidShellBg = isDarkMode ? themeMeta.darkBg : themeMeta.lightBg;

        const shellClass = isHeritage
          ? isDarkMode
            ? 'bg-[#18110c] border border-[#4b3322] text-[#efe4d4]'
            : 'bg-[#fbf9f5] border border-amber-900/30 text-stone-800'
          : `border ${activeDesign === '4' ? 'backdrop-blur-xl' : ''}`;

        const shellStyle: React.CSSProperties | undefined = isHeritage
          ? undefined
          : { backgroundColor: solidShellBg, borderColor: 'var(--th-border)', color: 'var(--th-ink)' };

        const headerClass = isHeritage
          ? isDarkMode
            ? 'bg-[#140e0a] border-[#382518]'
            : 'bg-stone-50/95 border-stone-200'
          : 'themed-glass-bar';

        const headerStyle: React.CSSProperties | undefined = isHeritage
          ? undefined
          : { backgroundColor: 'var(--th-header)', borderColor: 'var(--th-border)', color: 'var(--th-ink)' };

        const bodyBg = isHeritage
          ? isDarkMode
            ? 'bg-[#110c09]'
            : 'bg-stone-50/60'
          : '';

        const bodyStyle: React.CSSProperties | undefined = isHeritage
          ? undefined
          : { backgroundColor: solidShellBg, color: 'var(--th-ink)' };

        // Combine curated & workspace books cleanly by subject
        const combinedBooksMap = new Map<string, any>();
        [...CURATED_MEDICAL_BOOKS, ...books].forEach((b) => {
          const k = b.title.toLowerCase().trim();
          if (!combinedBooksMap.has(k)) combinedBooksMap.set(k, b);
        });
        const allCatalogBooks = Array.from(combinedBooksMap.values());

        const SUBJECT_SECTIONS = [
          {
            subject: 'Pharmacology',
            subtitle: 'Autonomics, Antimicrobials & Therapeutics',
            accent: isHeritage ? '#A47C43' : themeAccent,
            cardBg: !isHeritage
              ? 'themed-glass-card'
              : isDarkMode ? 'bg-[#1a120d] border-[#4b3322]' : 'bg-[#fdfaf3] border-amber-800/25',
          },
          {
            subject: 'Pathology',
            subtitle: 'Cellular Injury, Neoplasia & Histology',
            accent: isHeritage ? '#8A3B2E' : '#9f4a3c',
            cardBg: !isHeritage
              ? 'themed-glass-card'
              : isDarkMode ? 'bg-[#1d120e] border-[#593326]' : 'bg-[#fdf7f5] border-rose-900/20',
          },
          {
            subject: 'Internal Medicine',
            subtitle: 'Harrison Rounds, Cardiology & Nephrology',
            accent: isHeritage ? '#7a5233' : '#2e6b7c',
            cardBg: !isHeritage
              ? 'themed-glass-card'
              : isDarkMode ? 'bg-[#19120d] border-[#3d2a1c]' : 'bg-[#faf7f2] border-stone-300',
          },
          {
            subject: 'Anatomy',
            subtitle: 'Gross Dissections & Clinical Plates',
            accent: isHeritage ? '#9a6b3b' : '#4a744e',
            cardBg: !isHeritage
              ? 'themed-glass-card'
              : isDarkMode ? 'bg-[#16130e] border-[#423823]' : 'bg-[#f7f7f2] border-stone-300',
          },
          {
            subject: 'Physiology',
            subtitle: 'Electrophysiology, Hemodynamics & Renal',
            accent: isHeritage ? '#9a5b25' : '#7b5e34',
            cardBg: !isHeritage
              ? 'themed-glass-card'
              : isDarkMode ? 'bg-[#1c130d] border-[#4a321e]' : 'bg-[#fdf8ee] border-amber-700/25',
          },
          {
            subject: 'Surgery',
            subtitle: 'Operative Practice, Trauma & Emergency',
            accent: isHeritage ? '#6e4520' : '#5b526e',
            cardBg: !isHeritage
              ? 'themed-glass-card'
              : isDarkMode ? 'bg-[#17110c] border-[#3d291a]' : 'bg-[#f9f6f0] border-stone-300',
          },
        ];

        const assignedSubjects = new Set(SUBJECT_SECTIONS.map((sec) => sec.subject));
        const otherBooks = allCatalogBooks.filter((b) => !assignedSubjects.has(b.subject));
        const activeSubjectSectionCount =
          SUBJECT_SECTIONS.filter((sec) =>
            allCatalogBooks.some((b) => b.subject.toLowerCase() === sec.subject.toLowerCase())
          ).length + (otherBooks.length > 0 ? 1 : 0);

        return createPortal(
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
            <div
              className={`relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden ${shellClass}`}
              style={shellStyle}
            >
              {/* Header */}
              <div className={`px-6 py-4 border-b flex items-center justify-between ${headerClass}`} style={headerStyle}>
                <div className="flex items-center gap-3">
                  <div className="themed-soft-pill w-9 h-9 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 flex items-center justify-center">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Library</h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsEagleViewOpen(false)}
                  className="p-2 rounded-xl opacity-70 hover:opacity-100 hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Metrics Strip */}
              <div className={`px-6 py-2.5 border-b flex flex-wrap items-center justify-between gap-3 text-xs ${headerClass}`} style={headerStyle}>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <Layers className="w-3.5 h-3.5" style={{ color: isHeritage ? '#d97706' : themeAccent }} />
                    <span>Subject Sections: <strong>{activeSubjectSectionCount}</strong></span>
                  </span>
                </div>
              </div>

              {/* Subject-Wise Sections */}
              <div className={`flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 custom-scrollbar ${bodyBg}`} style={bodyStyle}>
                {allCatalogBooks.length === 0 && (
                  <div
                    className="p-8 rounded-2xl border border-dashed text-center space-y-3"
                    style={isHeritage ? undefined : { backgroundColor: 'var(--th-surface)', borderColor: 'var(--th-border)', color: 'var(--th-ink)' }}
                  >
                    <BookOpen className="w-9 h-9 mx-auto opacity-55" />
                    <h4 className="text-lg font-bold">Your Library starts clean</h4>
                    <p className="text-xs opacity-70 max-w-md mx-auto">
                      No pre-loaded sample textbooks are shown here. Upload your own PDFs via Google Drive or add custom books inside any Shelf compartment.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEagleViewOpen(false);
                        handleOpenUploadModal();
                      }}
                      className="themed-accent-btn px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                      style={isHeritage ? { backgroundColor: '#7c4521', color: '#fff' } : { backgroundColor: themeAccent, color: '#fff' }}
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Upload PDF (Drive)</span>
                    </button>
                  </div>
                )}
                {SUBJECT_SECTIONS.map((sec, sIdx) => {
                  const secBooks = allCatalogBooks.filter(
                    (b) => b.subject.toLowerCase() === sec.subject.toLowerCase()
                  );
                  if (secBooks.length === 0) return null;
                  return (
                    <section
                      key={sIdx}
                      className={`p-4 rounded-2xl border space-y-3.5 shadow-2xs transition-colors ${sec.cardBg}`}
                      style={{
                        ...(isHeritage ? {} : { backgroundColor: 'var(--th-surface)', borderColor: 'var(--th-border)', color: 'var(--th-ink)' }),
                        borderLeftWidth: 4,
                        borderLeftColor: sec.accent,
                      }}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-black/10 dark:border-white/10">
                        <div className="flex items-center gap-2.5">
                          <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: sec.accent }} />
                          <div>
                            <h4 className="text-lg font-bold leading-tight">{sec.subject}</h4>
                            <p className="text-[11px] opacity-65">{sec.subtitle}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className="text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold text-white shadow-2xs"
                            style={{ backgroundColor: sec.accent }}
                          >
                            {secBooks.length} {secBooks.length === 1 ? 'volume' : 'volumes'}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {secBooks.map((bk: any) => (
                          <div
                            key={bk.id}
                            onClick={() => {
                              setIsEagleViewOpen(false);
                              setActiveBookModal(bk);
                            }}
                            className="p-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-black/25 hover:border-amber-500 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                            style={isHeritage ? undefined : { backgroundColor: 'var(--th-raised)', borderColor: 'var(--th-border)', color: 'var(--th-ink)' }}
                          >
                            <div>
                              <div className="flex items-center justify-between gap-1 mb-1.5">
                                <span
                                  className="text-[9px] font-mono px-1.5 py-0.5 rounded font-bold text-white"
                                  style={{ backgroundColor: sec.accent }}
                                >
                                  {bk.subject}
                                </span>
                                <span className="text-[10px] opacity-70 group-hover:opacity-100 flex items-center gap-0.5 font-medium" style={{ color: isHeritage ? undefined : themeAccent }}>
                                  <span>Read</span>
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </span>
                              </div>
                              <div className="flex items-start gap-2.5 mt-0.5">
                                <BookLogoBadge
                                  compact
                                  title={bk.title}
                                  thumbnail={getResolvedBookThumb(bk)}
                                  fallbackBg={bk.coverColor || sec.accent}
                                />
                                <div className="min-w-0 flex-1">
                                  <h5 className="font-bold text-xs line-clamp-2 leading-snug">{bk.title}</h5>
                                  <p className="text-[10px] opacity-65 mt-1 line-clamp-1">
                                    {bk.author} · {bk.edition}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="mt-2.5 pt-2 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-[9.5px] font-mono opacity-85">
                              <span>Opened: {bk.readCount || 0}×</span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingLibBook(bk);
                                }}
                                title="Edit Book Cover Monogram / 100 Icons / Colors"
                                className="themed-soft-pill px-2 py-0.5 rounded-md bg-amber-500/15 hover:bg-amber-500/30 border border-amber-500/35 text-amber-800 dark:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer transition"
                              >
                                <Palette className="w-2.5 h-2.5" />
                                <span>Cover</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  );
                })}

                {otherBooks.length > 0 && (
                  <section
                    className={`p-4 rounded-2xl border space-y-3 ${isHeritage ? 'border-black/15 dark:border-white/15 bg-white/60 dark:bg-black/20' : 'themed-glass-card'}`}
                    style={{
                      ...(isHeritage ? {} : { backgroundColor: 'var(--th-surface)', borderColor: 'var(--th-border)', color: 'var(--th-ink)' }),
                      borderLeftWidth: 4,
                      borderLeftColor: isHeritage ? '#A47C43' : themeAccent,
                    }}
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-black/10 dark:border-white/10 gap-2 flex-wrap">
                      <h4 className="text-lg font-bold">Other Subjects & Uploads</h4>
                      <div className="flex items-center gap-2">
                        <span
                          className="themed-accent-btn text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-600 text-white font-bold"
                          style={isHeritage ? undefined : { backgroundColor: themeAccent }}
                        >
                          {otherBooks.length} volumes
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {otherBooks.map((bk: any) => (
                        <div
                          key={bk.id}
                          onClick={() => {
                            setIsEagleViewOpen(false);
                            setActiveBookModal(bk);
                          }}
                          className="p-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-black/30 hover:border-amber-500 cursor-pointer flex items-start justify-between gap-2"
                          style={isHeritage ? undefined : { backgroundColor: 'var(--th-raised)', borderColor: 'var(--th-border)', color: 'var(--th-ink)' }}
                        >
                          <div className="flex items-start gap-2.5 min-w-0">
                            <BookLogoBadge
                              compact
                              title={bk.title}
                              thumbnail={getResolvedBookThumb(bk)}
                              fallbackBg={bk.coverColor || '#7c4521'}
                            />
                            <div className="min-w-0">
                              <span
                                className="text-[9px] font-mono text-amber-700 dark:text-amber-400 font-bold"
                                style={isHeritage ? undefined : { color: themeAccent }}
                              >
                                {bk.subject}
                              </span>
                              <h5 className="font-bold text-xs line-clamp-2 mt-0.5">{bk.title}</h5>
                              <p className="text-[10px] opacity-65 mt-0.5 line-clamp-1">{bk.author}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingLibBook(bk);
                            }}
                            title="Edit Book Cover Thumbnail"
                            className="themed-soft-pill p-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/30 border border-amber-500/35 text-amber-800 dark:text-amber-300 shrink-0 cursor-pointer"
                          >
                            <Palette className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>

              <div className={`p-3 border-t flex justify-end ${headerClass}`} style={headerStyle}>
                <button
                  type="button"
                  onClick={() => setIsEagleViewOpen(false)}
                  className="themed-accent-btn px-4 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-900 dark:bg-[#2b1e15] dark:hover:bg-[#3a281c] border border-transparent dark:border-[#4b3322] text-white dark:text-[#efe4d4] text-xs font-semibold cursor-pointer"
                >
                  Close Library
                </button>
              </div>
            </div>
          </div>,
          document.body
        );
      })()}

      {/* Shared Book Cover Thumbnail Customizer Modal (Library, Drive Vault, Upload PDF & Reader) */}
      <BookThumbnailEditorModal
        isOpen={Boolean(editingLibBook) || isEditingUploadThumb}
        itemTitle={
          isEditingUploadThumb
            ? drivePdfTitle.trim() || drivePdfFile?.name.replace(/\.pdf$/i, '') || 'Uploaded PDF Volume'
            : editingLibBook?.title || 'Medical Volume'
        }
        initialConfig={
          isEditingUploadThumb
            ? drivePdfThumbnail
            : editingLibBook
            ? getResolvedBookThumb(editingLibBook)
            : undefined
        }
        defaultBgHex={
          isEditingUploadThumb
            ? '#7c4521'
            : editingLibBook?.coverColor || '#7c4521'
        }
        onClose={() => {
          setEditingLibBook(null);
          setIsEditingUploadThumb(false);
        }}
        onSave={(cfg) => {
          if (isEditingUploadThumb) {
            setDrivePdfThumbnail(cfg);
            setIsEditingUploadThumb(false);
          } else if (editingLibBook) {
            handleSaveLibraryBookThumbnail(editingLibBook, cfg);
            setEditingLibBook(null);
          }
        }}
      />
    </div>
  );
};
