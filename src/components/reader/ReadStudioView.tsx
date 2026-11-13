import React, { useState, useEffect, useRef, useCallback } from 'react';
import './readStudio.css';
import { SubjectCourse, MedicalBook, BookPage, SnippetScreenshot } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import {
  DRIVE_APP_FOLDER_NAME,
  getDrivePreviewUrl,
  uploadPdfToPersonalDrive,
} from '../../services/googleDriveService';
import {
  BookOpen,
  BookOpenText,
  Paperclip,
  Columns2,
  FileText,
  UploadCloud,
  ExternalLink,
  Plus,
  X,
  Search,
  Bookmark,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Type,
  Copy,
  Check,
  RotateCcw,
  Layers,
  HardDrive,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

// Attached Document Interface
export interface AttachedDoc {
  id: string;
  title: string;
  type: 'book' | 'pdf' | 'web' | 'diagram';
  authorOrSource?: string;
  subject?: SubjectCourse;
  pages: BookPage[];
  currentPage: number;
  fileSize?: string;
  webUrl?: string;
  imageUrl?: string;
  summary?: string;
  pdfUrl?: string;
  driveFileId?: string;
  storageProvider?: 'google_drive' | 'local';
}

const getEmptyMainBook = (subject: SubjectCourse): MedicalBook => ({
  id: `empty-${subject}`,
  title: 'No Book Loaded',
  subject,
  author: 'Personal Study Desk',
  edition: 'Upload a PDF or select from Shelf',
  coverColor: '#7c4521',
  bookmarks: [],
  pages: [],
});

interface DriveListedPdf {
  id: string;
  name: string;
  size?: string;
  mimeType?: string;
  webViewLink?: string;
}

interface ReadStudioViewProps {
  currentSubject: SubjectCourse;
  books?: MedicalBook[];
  onAddBook?: (book: MedicalBook) => void;
  onSnipToNote?: (snippet: SnippetScreenshot) => void;
  onOpenStudio?: () => void;
  onNavigateToShelf?: () => void;
  isDarkMode?: boolean;
}

export const ReadStudioView: React.FC<ReadStudioViewProps> = ({
  currentSubject,
  books = [],
  onAddBook,
  onSnipToNote,
  onOpenStudio,
  onNavigateToShelf,
  isDarkMode = false,
}) => {
  const { driveAccount, getValidDriveAccessToken, connectGoogleDrive, disconnectGoogleDrive } = useAuth();
  const [driveUploadPct, setDriveUploadPct] = useState<number | null>(null);
  const [driveUploadErr, setDriveUploadErr] = useState<string | null>(null);
  const [uploadTargetMode, setUploadTargetMode] = useState<'drive' | 'local'>('drive');
  const [drivePickerFiles, setDrivePickerFiles] = useState<DriveListedPdf[]>([]);
  const [isLoadingDriveFiles, setIsLoadingDriveFiles] = useState<boolean>(false);
  const [hasLoadedDriveList, setHasLoadedDriveList] = useState<boolean>(false);
  // 1. Initial State: Open pending book from Favourites / Read Desk if queued, otherwise clean Study Desk
  const consumePendingReadBook = (): MedicalBook | null => {
    try {
      const raw = localStorage.getItem('medden_pending_read_book_v1');
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      localStorage.removeItem('medden_pending_read_book_v1');
      if (parsed && parsed.title) {
        return {
          id: parsed.id || `read-${Date.now()}`,
          title: parsed.title,
          subject: parsed.subject || currentSubject,
          author: parsed.author || 'Personal Study Desk',
          edition: parsed.edition || (parsed.pdfFileUrl || parsed.driveFileId ? 'Document / PDF' : 'Reader View'),
          coverColor: parsed.coverColor || '#7c4521',
          bookmarks: Array.isArray(parsed.bookmarks) ? parsed.bookmarks : [1],
          pdfFileUrl: parsed.pdfFileUrl,
          driveFileId: parsed.driveFileId,
          storageProvider: parsed.storageProvider,
          pages:
            Array.isArray(parsed.pages) && parsed.pages.length > 0
              ? parsed.pages
              : [
                  {
                    pageNumber: 1,
                    title: parsed.title,
                    keyTopic: parsed.subject || 'Personal Reading',
                    summaryPearl: parsed.summaryPearl || '',
                    contentHtml:
                      parsed.contentHtml ||
                      `<p><strong>${String(parsed.title)}</strong>${parsed.author ? ` — ${String(parsed.author)}` : ''}${parsed.edition ? ` (${String(parsed.edition)})` : ''}.</p><p>Opened in Reader View.</p>`,
                  },
                ],
        };
      }
    } catch {}
    return null;
  };

  const initialPendingRef = useRef<MedicalBook | null>(consumePendingReadBook());
  const defaultMainBook =
    initialPendingRef.current ||
    books.find((b) => b.subject === currentSubject) ||
    books[0] ||
    getEmptyMainBook(currentSubject);
  const [mainBook, setMainBook] = useState<MedicalBook>(defaultMainBook);
  const [mainPageNum, setMainPageNum] = useState<number>(1);
  const [isBookClosed, setIsBookClosed] = useState<boolean>(!initialPendingRef.current);

  // Attached documents list (initially empty)
  const [attachedDocs, setAttachedDocs] = useState<AttachedDoc[]>([]);

  // Active tab: 'main' or attachedDoc id
  const [activeTab, setActiveTab] = useState<string>('main');

  // View mode: 'single' (focused reader) or 'split' (side-by-side dual reader)
  const [isSplitView, setIsSplitView] = useState<boolean>(false);

  // Split View Resizing Joystick State (Windows Folder Style)
  const [splitPercent, setSplitPercent] = useState<number>(50);
  const [isDraggingSplitter, setIsDraggingSplitter] = useState<boolean>(false);
  const stageRef = useRef<HTMLElement | null>(null);

  const handleSplitterPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDraggingSplitter(true);
    const stage = stageRef.current;
    if (!stage) return;
    const stageRect = stage.getBoundingClientRect();

    const onPointerMove = (moveEvent: PointerEvent) => {
      const offsetX = moveEvent.clientX - stageRect.left;
      const newPct = Math.max(15, Math.min(85, (offsetX / stageRect.width) * 100));
      setSplitPercent(Math.round(newPct));
    };

    const onPointerUp = () => {
      setIsDraggingSplitter(false);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  // Synchronized scroll toggle for split view
  const [isSyncScroll, setIsSyncScroll] = useState<boolean>(false);

  // Reading Theme: 'paper' (warm white), 'sepia' (book cream), 'dark' (coal dark burnt wood)
  const [themeMode, setThemeMode] = useState<'paper' | 'sepia' | 'dark'>(() => (isDarkMode ? 'dark' : 'paper'));

  // Sync reader dark/paper mode when global Dark Mode toggles
  useEffect(() => {
    setThemeMode(isDarkMode ? 'dark' : 'paper');
  }, [isDarkMode]);
  // Font color mode: 'default', 'white', 'sepia'
  const [fontColorMode, setFontColorMode] = useState<'default' | 'white' | 'sepia'>('default');

  // Font Size
  const [fontSize, setFontSize] = useState<'font-normal' | 'font-large' | 'font-xlarge'>('font-normal');

  // Attach Modal Open State
  const [isAttachModalOpen, setIsAttachModalOpen] = useState<boolean>(false);

  const loadDrivePdfFiles = useCallback(async (forceConnect = false) => {
    setDriveUploadErr(null);
    setIsLoadingDriveFiles(true);
    try {
      let token = await getValidDriveAccessToken().catch(() => '');
      if (!token && forceConnect) {
        await connectGoogleDrive();
        token = await getValidDriveAccessToken();
      }
      if (!token) {
        setIsLoadingDriveFiles(false);
        return;
      }
      const q = encodeURIComponent("trashed = false and mimeType = 'application/pdf'");
      const res = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name,size,mimeType,webViewLink)&pageSize=30&orderBy=modifiedTime desc`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.status === 401) {
        await disconnectGoogleDrive().catch(() => {});
        throw new Error('Google Drive session expired. Please click Connect Drive to re-authorize.');
      }
      if (!res.ok) {
        throw new Error('Could not load PDFs from Google Drive.');
      }
      const data = await res.json();
      setDrivePickerFiles(Array.isArray(data?.files) ? data.files : []);
      setHasLoadedDriveList(true);
    } catch (err: any) {
      setDriveUploadErr(err?.message || 'Unable to load files from Google Drive.');
    } finally {
      setIsLoadingDriveFiles(false);
    }
  }, [connectGoogleDrive, disconnectGoogleDrive, getValidDriveAccessToken]);

  useEffect(() => {
    if (isAttachModalOpen && uploadTargetMode === 'drive' && driveAccount.connected && !hasLoadedDriveList) {
      void loadDrivePdfFiles(false);
    }
  }, [isAttachModalOpen, uploadTargetMode, driveAccount.connected, hasLoadedDriveList, loadDrivePdfFiles]);

  // In-book search state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Single Page vs Book/Double Page Toggle (per user instruction)
  const [isDoublePage, setIsDoublePage] = useState<boolean>(false);

  // Retractable TOC / Index / Bookmarks Drawer State
  const [isTOCDrawerOpen, setIsTOCDrawerOpen] = useState<boolean>(false);
  const [tocDrawerTab, setTocDrawerTab] = useState<'toc' | 'index' | 'bookmarks'>('toc');
  const [bookmarkedPages, setBookmarkedPages] = useState<number[]>(() => {
    return [1];
  });

  const handleToggleBookmark = (pageNum: number) => {
    setBookmarkedPages((prev) =>
      prev.includes(pageNum) ? prev.filter((p) => p !== pageNum) : [...prev, pageNum]
    );
  };

  // Floating text selection
  const [selectedText, setSelectedText] = useState<string>('');
  const [selectionPos, setSelectionPos] = useState<{ x: number; y: number } | null>(null);
  const [copyToast, setCopyToast] = useState<string | null>(null);

  // Ref for dual scrolling
  const leftPaneRef = useRef<HTMLDivElement | null>(null);
  const rightPaneRef = useRef<HTMLDivElement | null>(null);
  const isScrollingRef = useRef<boolean>(false);

  // Sync main book from user's library books when subject or books change (unless a requested book is open)
  useEffect(() => {
    const queued = consumePendingReadBook();
    if (queued) {
      initialPendingRef.current = queued;
      setMainBook(queued);
      setMainPageNum(1);
      setIsBookClosed(false);
      setActiveTab('main');
      return;
    }
    if (initialPendingRef.current) return;
    const newMain =
      books.find((b) => b.subject === currentSubject) || books[0] || getEmptyMainBook(currentSubject);
    setMainBook(newMain);
    setMainPageNum(1);
  }, [currentSubject, books]);

  // Listen for direct open requests from Favourites or Read Desk folders
  useEffect(() => {
    const onOpenBook = () => {
      const queued = consumePendingReadBook();
      if (queued) {
        initialPendingRef.current = queued;
        setMainBook(queued);
        setMainPageNum(1);
        setIsBookClosed(false);
        setActiveTab('main');
      }
    };
    window.addEventListener('medden_open_book_in_reader', onOpenBook);
    return () => window.removeEventListener('medden_open_book_in_reader', onOpenBook);
  }, []);

  // Active primary book page
  const currentMainPage =
    mainBook.pages.find((p) => p.pageNumber === mainPageNum) ||
    mainBook.pages[0] || {
      pageNumber: 1,
      title: mainBook.title,
      keyTopic: 'Personal Reading',
      summaryPearl: '',
      contentHtml:
        '<p class="text-stone-500">No book content loaded yet. Upload a PDF or select a book from your Shelf to start reading.</p>',
    };

  // Active attached document (for tabbed view or right split pane)
  const currentAttachedDoc: AttachedDoc | undefined = attachedDocs.find(
    (d) => d.id === (activeTab !== 'main' ? activeTab : attachedDocs[0]?.id)
  ) || attachedDocs[0];

  const currentAttachedPage =
    currentAttachedDoc?.pages?.find((p) => p.pageNumber === currentAttachedDoc.currentPage) ||
    currentAttachedDoc?.pages?.[0];

  // Attach a companion medical textbook
  const handleAttachBook = (book: MedicalBook) => {
    // Check if already attached
    if (attachedDocs.some((d) => d.id === book.id)) {
      setActiveTab(book.id);
      setIsAttachModalOpen(false);
      return;
    }

    const newDoc: AttachedDoc = {
      id: book.id,
      title: book.title,
      type: book.pdfFileUrl || book.driveFileId ? 'pdf' : 'book',
      authorOrSource: book.author,
      subject: book.subject,
      pages: book.pages,
      currentPage: 1,
      pdfUrl: book.pdfFileUrl,
      driveFileId: book.driveFileId,
      storageProvider: book.storageProvider === 'google_drive' ? 'google_drive' : undefined,
      fileSize: book.fileSizeBytes
        ? `${(book.fileSizeBytes / (1024 * 1024)).toFixed(2)} MB`
        : undefined,
    };

    setAttachedDocs([...attachedDocs, newDoc]);
    setActiveTab(newDoc.id);
    setIsAttachModalOpen(false);
  };

  // Real File Upload Handler: Personal Google Drive Offload or Local Object URL Preview
  const handleRealPdfFileSelect = async (file: File) => {
    setDriveUploadErr(null);
    const sizeLabel = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;

    if (uploadTargetMode === 'local') {
      const localUrl = URL.createObjectURL(file);
      const newDoc: AttachedDoc = {
        id: `doc-local-${Date.now()}`,
        title: file.name,
        type: 'pdf',
        authorOrSource: `Local File · ${sizeLabel}`,
        fileSize: sizeLabel,
        pdfUrl: localUrl,
        storageProvider: 'local',
        summary: 'Loaded locally in browser memory for this session.',
        currentPage: 1,
        pages: [
          {
            pageNumber: 1,
            title: file.name,
            keyTopic: 'Local PDF Document',
            summaryPearl: 'Previewing directly from local browser memory.',
            contentHtml: '',
          },
        ],
      };
      setAttachedDocs((prev) => [...prev, newDoc]);
      setActiveTab(newDoc.id);
      setIsAttachModalOpen(false);
      return;
    }

    // Offload heavy PDF directly to user's personal Google Drive
    setDriveUploadPct(1);
    try {
      const accessToken = await getValidDriveAccessToken();
      const uploaded = await uploadPdfToPersonalDrive(file, accessToken, {
        folderId: driveAccount.folderId,
        makeAnyoneReader: true,
        onProgress: (pct) => setDriveUploadPct(pct),
      });

      const docTitle = file.name.replace(/\.pdf$/i, '');
      const newBook: MedicalBook = {
        id: `book-drive-${Date.now()}`,
        title: docTitle,
        subject: currentSubject,
        author: 'Personal Google Drive Vault',
        edition: sizeLabel,
        coverColor: '#7c4521',
        pdfFileUrl: uploaded.webViewLink,
        driveFileId: uploaded.driveFileId,
        driveFolderId: uploaded.driveFolderId,
        fileSizeBytes: uploaded.fileSizeBytes,
        mimeType: uploaded.mimeType,
        storageProvider: 'google_drive',
        isUserUploaded: true,
        bookmarks: [1],
        pages: [
          {
            pageNumber: 1,
            title: `${docTitle} · Hosted on Personal Google Drive`,
            keyTopic: `${currentSubject} · ${sizeLabel}`,
            summaryPearl: `Offloaded to "${DRIVE_APP_FOLDER_NAME}" in personal Google Drive; metadata synced via Supabase.`,
            contentHtml: `<p><strong>${docTitle}</strong> is stored in your personal Google Drive vault (${uploaded.driveFileId}).</p>`,
          },
        ],
        updatedAt: new Date().toISOString(),
      };
      onAddBook?.(newBook);

      const newDoc: AttachedDoc = {
        id: newBook.id,
        title: docTitle,
        type: 'pdf',
        authorOrSource: `Google Drive Vault · ${sizeLabel}`,
        subject: currentSubject,
        fileSize: sizeLabel,
        pdfUrl: uploaded.webViewLink,
        driveFileId: uploaded.driveFileId,
        storageProvider: 'google_drive',
        summary: `Stored in your personal Google Drive ("${DRIVE_APP_FOLDER_NAME}") and synced to Supabase.`,
        currentPage: 1,
        pages: newBook.pages,
      };
      setAttachedDocs((prev) => [...prev, newDoc]);
      setActiveTab(newDoc.id);
      setDriveUploadPct(null);
      setIsAttachModalOpen(false);
    } catch (err: any) {
      if (err?.status === 401) {
        await disconnectGoogleDrive().catch(() => {});
      }
      setDriveUploadPct(null);
      setDriveUploadErr(err?.message || 'Google Drive upload failed.');
    }
  };

  // Attach a Google Drive file directly into reader
  const handleAttachDriveFile = (file: DriveListedPdf) => {
    const existing = attachedDocs.find((d) => d.driveFileId === file.id || d.id === file.id);
    if (existing) {
      setActiveTab(existing.id);
      setIsAttachModalOpen(false);
      return;
    }
    const sizeBytes = file.size ? Number(file.size) : 0;
    const sizeLabel = sizeBytes > 0 ? `${(sizeBytes / (1024 * 1024)).toFixed(2)} MB` : 'Google Drive PDF';
    const docTitle = file.name.replace(/\.pdf$/i, '');
    const newDoc: AttachedDoc = {
      id: `drive-${file.id}`,
      title: docTitle,
      type: 'pdf',
      authorOrSource: `Google Drive · ${sizeLabel}`,
      subject: currentSubject,
      fileSize: sizeLabel,
      pdfUrl: file.webViewLink || `https://drive.google.com/file/d/${file.id}/view`,
      driveFileId: file.id,
      storageProvider: 'google_drive',
      summary: `Opened from your personal Google Drive.`,
      currentPage: 1,
      pages: [
        {
          pageNumber: 1,
          title: docTitle,
          keyTopic: `${currentSubject} · Google Drive`,
          summaryPearl: '',
          contentHtml: `<p><strong>${docTitle}</strong> loaded from your Google Drive.</p>`,
        },
      ],
    };
    setAttachedDocs((prev) => [...prev, newDoc]);
    setActiveTab(newDoc.id);
    setIsAttachModalOpen(false);
  };

  // Detach / Close an attached document
  const handleDetachDoc = (docId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = attachedDocs.filter((d) => d.id !== docId);
    setAttachedDocs(updated);
    if (activeTab === docId) {
      setActiveTab('main');
    }
    if (updated.length === 0) {
      setIsSplitView(false);
    }
  };

  // Synchronized scroll handler
  const handleScrollLeft = () => {
    if (!isSyncScroll || isScrollingRef.current || !leftPaneRef.current || !rightPaneRef.current) return;
    isScrollingRef.current = true;
    const l = leftPaneRef.current;
    const r = rightPaneRef.current;
    const ratio = l.scrollTop / (l.scrollHeight - l.clientHeight || 1);
    r.scrollTop = ratio * (r.scrollHeight - r.clientHeight || 1);
    setTimeout(() => {
      isScrollingRef.current = false;
    }, 50);
  };

  const handleScrollRight = () => {
    if (!isSyncScroll || isScrollingRef.current || !leftPaneRef.current || !rightPaneRef.current) return;
    isScrollingRef.current = true;
    const l = leftPaneRef.current;
    const r = rightPaneRef.current;
    const ratio = r.scrollTop / (r.scrollHeight - r.clientHeight || 1);
    l.scrollTop = ratio * (l.scrollHeight - l.clientHeight || 1);
    setTimeout(() => {
      isScrollingRef.current = false;
    }, 50);
  };

  // Handle Text Selection for Snip / Copy
  const handleMouseUp = () => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) {
      setSelectedText('');
      setSelectionPos(null);
      return;
    }

    const text = sel.toString().trim();
    if (text.length > 5) {
      setSelectedText(text);
      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setSelectionPos({
        x: rect.left + rect.width / 2,
        y: rect.top,
      });
    } else {
      setSelectedText('');
      setSelectionPos(null);
    }
  };

  // Copy selected quote
  const handleCopyQuote = () => {
    if (!selectedText) return;
    navigator.clipboard.writeText(selectedText);
    setCopyToast('Quote copied to clipboard!');
    setTimeout(() => setCopyToast(null), 2500);
    setSelectedText('');
    setSelectionPos(null);
  };

  // Snip quote directly to active note
  const handleSnipQuoteToNote = () => {
    if (!selectedText) return;
    const snippet: SnippetScreenshot = {
      id: `snip-${Date.now()}`,
      dataUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=400&q=80',
      sourceBookTitle: activeTab === 'main' ? mainBook.title : currentAttachedDoc?.title || 'Attached Document',
      pageNumber: activeTab === 'main' ? mainPageNum : currentAttachedDoc?.currentPage || 1,
      timestamp: new Date().toLocaleTimeString(),
    };
    if (onSnipToNote) {
      onSnipToNote(snippet);
    }
    setCopyToast('Snippet clipped to your Active Note!');
    setTimeout(() => setCopyToast(null), 2500);
    setSelectedText('');
    setSelectionPos(null);
  };

  // Watermark study desk view when main book is closed per user request
  const renderBlankDeskView = () => (
    <div className="themed-workspace-surface relative flex-1 flex flex-col items-center justify-center p-8 bg-[#fbf9f4] dark:bg-[#110c09] overflow-hidden select-none min-h-[480px]">
      {/* Watermark Illustration: Cute child studying at a desk with lamp & books */}
      <div className="absolute inset-0 flex items-center justify-center opacity-15 dark:opacity-10 pointer-events-none">
        <svg
          viewBox="0 0 400 400"
          className="w-[360px] h-[360px] max-w-full text-amber-900 dark:text-amber-100 fill-current"
        >
          {/* Desk Table */}
          <path d="M40 280 L360 280 L360 300 L340 300 L340 370 L320 370 L320 300 L80 300 L80 370 L60 370 L60 300 L40 300 Z" opacity="0.6" />
          {/* Head & hair */}
          <circle cx="200" cy="150" r="38" />
          <path d="M190 112 Q200 95 215 110 Q225 100 230 115" stroke="currentColor" strokeWidth="6" fill="none" strokeLinecap="round" />
          {/* Glasses */}
          <circle cx="188" cy="152" r="8" fill="none" stroke="currentColor" strokeWidth="3" />
          <circle cx="212" cy="152" r="8" fill="none" stroke="currentColor" strokeWidth="3" />
          <path d="M196 152 L204 152" stroke="currentColor" strokeWidth="3" />
          {/* Child Body leaning forward over desk */}
          <path d="M168 190 Q200 185 232 190 L248 260 L152 260 Z" />
          {/* Arms holding pencil on desk */}
          <path d="M160 215 Q180 250 205 255 Q195 240 180 210" fill="none" stroke="currentColor" strokeWidth="12" strokeLinecap="round" />
          <path d="M240 215 Q220 250 205 255" fill="none" stroke="currentColor" strokeWidth="12" strokeLinecap="round" />
          {/* Cute Desk Study Lamp */}
          <path d="M100 280 L120 280 L120 270 Q120 210 110 170 Q110 130 140 110" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
          <path d="M130 100 L160 120 L135 135 Z" />
          <polygon points="145,125 180,265 240,265" fill="currentColor" opacity="0.1" />
          {/* Open Book on Desk */}
          <path d="M170 262 Q200 258 200 270 Q200 258 230 262 L225 278 Q200 274 200 280 Q200 274 175 278 Z" />
          {/* Stack of books */}
          <rect x="290" y="245" width="55" height="10" rx="2" />
          <rect x="285" y="257" width="60" height="10" rx="2" />
          <rect x="280" y="269" width="68" height="11" rx="2" />
        </svg>
      </div>

      {/* Center Action Box */}
      <div className="themed-glass-card relative z-10 text-center max-w-md mx-auto space-y-4 p-8 rounded-3xl bg-white/80 dark:bg-[#1a120d]/95 backdrop-blur-md border border-stone-200/90 dark:border-[#382518] shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-400 mx-auto flex items-center justify-center shadow-inner">
          <BookOpen className="w-8 h-8" />
        </div>

        <div>
          <p className="text-sm font-sans text-stone-700 dark:text-[#efe4d4] leading-relaxed">
            Select a book from your Shelf, open your subject textbook, or attach a secondary book / PDF to start reading.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 font-sans">
          <button
            type="button"
            onClick={() => {
              if (onNavigateToShelf) {
                onNavigateToShelf();
              } else {
                setIsAttachModalOpen(true);
              }
            }}
            className="themed-accent-btn w-full sm:w-auto px-6 py-3 rounded-full bg-[#775734] hover:bg-[#5f442a] text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>Choose a Book from Shelf</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (books.length > 0) {
                setIsBookClosed(false);
              } else {
                setUploadTargetMode('local');
                setIsAttachModalOpen(true);
              }
            }}
            className="themed-soft-pill w-full sm:w-auto px-5 py-3 rounded-full bg-[#efe7d8] dark:bg-[#2a1d14] text-[#2a1d14] dark:text-white font-semibold text-sm hover:bg-[#e5dac6] dark:hover:bg-[#38271b] transition-colors cursor-pointer"
          >
            {books.length > 0 ? 'Open Recent Shelf Book' : 'Upload / Attach PDF'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`read-studio-root theme-${themeMode} font-mode-${fontColorMode}`}>
      {/* Top Bar with Document Tabs & Attach Button */}
      <header className="read-top-bar">
        {/* Left: Document Tabs */}
        <div className="read-tabs-list custom-scrollbar">
          {/* Main Book Tab (Shown only when main textbook is open; no Study Desk label) */}
          {!isBookClosed && (
            <button
              type="button"
              className={`read-tab-item is-main ${activeTab === 'main' ? 'active' : ''}`}
              onClick={() => setActiveTab('main')}
              title={`Primary Course Textbook: ${mainBook.title}`}
            >
              <BookOpen className="w-3.5 h-3.5 text-[#A47C43] dark:text-amber-400" />
              <span className="truncate max-w-[200px]">{mainBook.title}</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-[#A47C43]/15 text-[#784d22] dark:text-amber-300 rounded">
                Main
              </span>
            </button>
          )}

          {/* Attached Documents Tabs */}
          {attachedDocs.map((doc) => {
            const isActive = activeTab === doc.id;
            return (
              <div
                key={doc.id}
                role="button"
                tabIndex={0}
                className={`read-tab-item ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(doc.id)}
                title={`Attached Document: ${doc.title}`}
              >
                {doc.type === 'book' ? (
                  <BookOpenText className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                ) : doc.type === 'pdf' ? (
                  <FileText className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                ) : doc.type === 'web' ? (
                  <ExternalLink className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                ) : (
                  <Layers className="w-3.5 h-3.5 text-[#7f1d1d] dark:text-[#c94a4f]" />
                )}
                <span className="truncate max-w-[170px]">{doc.title}</span>
                <span
                  role="button"
                  tabIndex={0}
                  className="read-tab-close"
                  onClick={(e) => handleDetachDoc(doc.id, e)}
                  title="Detach document"
                >
                  <X className="w-3 h-3" />
                </span>
              </div>
            );
          })}
        </div>

        {/* Center: "+ Attach Book / Doc" Button */}
        <button
          type="button"
          className="read-attach-btn"
          onClick={() => setIsAttachModalOpen(true)}
          title="Attach secondary books, PDFs, clinical guidelines, or diagrams for side-by-side reading"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Attach Book / Doc</span>
        </button>

        {/* Right: Reading Comfort Controls & Dual Split View Toggle */}
        <div className="read-controls-cluster">
          {/* Retractable TOC, Index & Bookmarks Drawer Toggle */}
          <button
            type="button"
            className={`read-icon-btn ${isTOCDrawerOpen ? 'active' : ''}`}
            onClick={() => setIsTOCDrawerOpen(!isTOCDrawerOpen)}
            title="Table of Contents, Clinical Index & Bookmarks"
          >
            <Bookmark className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </button>

          {/* Single Page vs Book / Double Page Spread Toggle */}
          <button
            type="button"
            className={`read-icon-btn ${isDoublePage ? 'active' : ''}`}
            onClick={() => setIsDoublePage(!isDoublePage)}
            title={isDoublePage ? 'Double Page Spread Active (Click for Single Page)' : 'Single Page Active (Click for Book / Double Page)'}
          >
            <BookOpen className="w-4 h-4" />
          </button>

          {/* Dual Split View Toggle (Enabled when at least 1 document is attached) */}
          <button
            type="button"
            className={`read-icon-btn ${isSplitView ? 'active' : ''}`}
            onClick={() => {
              if (attachedDocs.length === 0) {
                setIsAttachModalOpen(true);
              } else {
                setIsSplitView(!isSplitView);
              }
            }}
            title={
              attachedDocs.length === 0
                ? 'Attach a book or document first to read side-by-side'
                : isSplitView
                ? 'Switch to single tab mode'
                : 'Dual View: Read Main Book & Attached Doc side-by-side'
            }
          >
            <Columns2 className="w-4 h-4" />
          </button>

          {/* Direct 1-Click Reading Theme Pills (Day, Sepia, Night) */}
          <div className="flex items-center gap-1 bg-stone-100 dark:bg-[#221811] p-0.5 rounded-lg border border-stone-200 dark:border-[#382518]">
            <button
              type="button"
              onClick={() => setThemeMode('paper')}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                themeMode === 'paper' ? 'bg-white text-stone-900 shadow-2xs font-bold' : 'text-stone-500 hover:text-stone-800'
              }`}
              title="Day White Mode"
            >
              Day
            </button>
            <button
              type="button"
              onClick={() => setThemeMode('sepia')}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                themeMode === 'sepia' ? 'bg-[#f4ede0] text-[#78350f] shadow-2xs font-bold' : 'text-stone-500 hover:text-stone-800'
              }`}
              title="Sepia Warm Mode"
            >
              Sepia
            </button>
            <button
              type="button"
              onClick={() => setThemeMode('dark')}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-all cursor-pointer ${
                themeMode === 'dark' ? 'bg-[#1a120d] text-white shadow-2xs font-semibold' : 'text-stone-500 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
              }`}
              title="Night Dark Mode"
            >
              Night
            </button>
          </div>

          {/* Font Color Options (White, Sepia, Default) */}
          <div className="flex items-center gap-1 bg-stone-100 dark:bg-[#221811] p-0.5 rounded-lg border border-stone-200 dark:border-[#382518]">
            <button
              type="button"
              onClick={() => setFontColorMode('default')}
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                fontColorMode === 'default' ? 'bg-white dark:bg-[#382518] text-stone-900 dark:text-[#efe4d4] shadow-2xs' : 'text-stone-400 hover:text-stone-600'
              }`}
              title="Default Theme Ink"
            >
              Ink
            </button>
            <button
              type="button"
              onClick={() => setFontColorMode('white')}
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold cursor-pointer text-white bg-[#1c130e] border border-[#382518] ${
                fontColorMode === 'white' ? 'ring-1 ring-amber-400 shadow-2xs' : 'opacity-70 hover:opacity-100'
              }`}
              title="White Font Color"
            >
              White
            </button>
            <button
              type="button"
              onClick={() => setFontColorMode('sepia')}
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold cursor-pointer text-[#8c532b] bg-[#fdf8f0] border border-[#d9c0a3] ${
                fontColorMode === 'sepia' ? 'ring-1 ring-[#8c532b] shadow-2xs' : 'opacity-70 hover:opacity-100'
              }`}
              title="Sepia Font Color"
            >
              Sepia
            </button>
          </div>

          {/* Font Size Toggle */}
          <button
            type="button"
            className="read-icon-btn"
            onClick={() => {
              if (fontSize === 'font-normal') setFontSize('font-large');
              else if (fontSize === 'font-large') setFontSize('font-xlarge');
              else setFontSize('font-normal');
            }}
            title="Adjust reading font size"
          >
            <Type className="w-4 h-4" />
          </button>

          {/* Jump to Create Note */}
          {onOpenStudio && (
            <button
              type="button"
              className="read-icon-btn"
              onClick={onOpenStudio}
              title="Open Create Note with current book context"
            >
              <Sparkles className="w-4 h-4 text-[#A47C43] dark:text-amber-400" />
            </button>
          )}
        </div>
      </header>

      {/* Main Reading Stage */}
      <main className={`read-desk-stage ${isDraggingSplitter ? 'is-resizing' : ''}`} ref={stageRef as any} onMouseUp={handleMouseUp}>
        {/* Floating Text Selection Popup */}
        {selectedText && selectionPos && (
          <div
            className="read-selection-menu"
            style={{
              left: `${selectionPos.x}px`,
              top: `${selectionPos.y}px`,
            }}
          >
            <button type="button" className="read-sel-btn primary" onClick={handleSnipQuoteToNote}>
              <Plus className="w-3.5 h-3.5" />
              <span>Add to Note</span>
            </button>
            <button type="button" className="read-sel-btn" onClick={handleCopyQuote}>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Quote</span>
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* DUAL VIEW (SIDE-BY-SIDE): MAIN BOOK (LEFT) + ATTACHED DOC (RIGHT)         */}
        {/* ========================================================================= */}
        {isSplitView && currentAttachedDoc ? (
          <>
            {/* Left Pane: Main Course Textbook */}
            <section
              className="read-pane"
              ref={leftPaneRef}
              onScroll={handleScrollLeft}
              aria-label="Main Course Textbook"
              style={{ width: `${splitPercent}%`, flex: 'none' }}
            >
              <div className="read-pane-header">
                <div className="flex items-center gap-2">
                  <span className="doc-badge">
                    <BookOpen className="w-3 h-3 text-[#A47C43]" />
                    <span>MAIN BOOK · {mainBook.subject}</span>
                  </span>
                  <span className="truncate font-serif text-xs font-bold text-stone-800 dark:text-stone-200">
                    {isBookClosed ? 'No Book Open' : mainBook.title}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {!isBookClosed ? (
                    <>
                      <span className="text-[10px] font-mono">
                        Ch {mainPageNum} / {mainBook.pages.length}
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsBookClosed(true)}
                        className="p-1 rounded-md text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                        title="Close main book"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsBookClosed(false)}
                      className="text-xs text-amber-700 dark:text-amber-400 hover:underline font-bold"
                    >
                      Reopen
                    </button>
                  )}
                </div>
              </div>

              {isBookClosed ? (
                renderBlankDeskView()
              ) : (
                <>
                  {/* Main Book Content Body */}
                  <div className={`read-pane-content ${fontSize}`}>
                    <article className="read-article-container">
                      <div className="read-book-meta-header">
                        <p className="read-book-kicker">{currentMainPage.keyTopic}</p>
                        <h1 className="read-book-headline">{currentMainPage.title}</h1>
                        <p className="read-book-byline">
                          Author: {mainBook.author} · {mainBook.edition}
                        </p>
                      </div>

                      {/* Summary Pearl Box */}
                      {currentMainPage.summaryPearl && (
                        <div className="my-5 p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-950 dark:text-amber-100 text-sm">
                          <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider mb-1 text-amber-700 dark:text-amber-400">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Core High-Yield Pearl</span>
                          </div>
                          <p>{currentMainPage.summaryPearl}</p>
                        </div>
                      )}

                      {/* HTML Rich Content */}
                      <div
                        className="read-prose-body leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: currentMainPage.contentHtml }}
                      />
                    </article>
                  </div>

                  {/* Chapter Footer Pagination */}
                  <div className="read-pane-footer">
                    <button
                      type="button"
                      disabled={mainPageNum <= 1}
                      onClick={() => setMainPageNum((p) => Math.max(1, p - 1))}
                      className="read-icon-btn disabled:opacity-30"
                      title="Previous Chapter"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="font-mono text-xs text-stone-500">
                      Chapter {mainPageNum} of {mainBook.pages.length}
                    </span>
                    <button
                      type="button"
                      disabled={mainPageNum >= mainBook.pages.length}
                      onClick={() => setMainPageNum((p) => Math.min(mainBook.pages.length, p + 1))}
                      className="read-icon-btn disabled:opacity-30"
                      title="Next Chapter"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}
            </section>

            {/* Windows Folder Style Mouse Cursor Resize Joystick */}
            <div
              className={`read-splitter-track ${isDraggingSplitter ? 'is-dragging' : ''}`}
              onPointerDown={handleSplitterPointerDown}
              onDoubleClick={() => setSplitPercent(50)}
              title="Drag to resize split windows (Double-click to reset 50/50)"
            >
              <div className="read-splitter-line" />
              <div className="read-splitter-joystick" role="separator" aria-orientation="vertical">
                <div className="read-joystick-grip">
                  <span className="grip-dot" />
                  <span className="grip-dot" />
                  <span className="grip-dot" />
                </div>
                {isDraggingSplitter && (
                  <div className="read-joystick-tooltip">
                    {splitPercent}% | {100 - splitPercent}%
                  </div>
                )}
              </div>
            </div>

            {/* Right Pane: Attached Secondary Book, PDF, Web Link or Diagram */}
            <section
              className="read-pane"
              ref={rightPaneRef}
              onScroll={handleScrollRight}
              aria-label="Attached Document"
              style={{ width: `${100 - splitPercent}%`, flex: 'none' }}
            >
              <div className="read-pane-header">
                <div className="flex items-center gap-2 truncate">
                  <span className="doc-badge">
                    <Paperclip className="w-3 h-3 text-sky-600" />
                    <span>ATTACHED · {currentAttachedDoc.type.toUpperCase()}</span>
                  </span>
                  <span className="truncate font-serif text-xs font-bold text-stone-800 dark:text-stone-200">
                    {currentAttachedDoc.title}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {/* Sync scroll toggle */}
                  <button
                    type="button"
                    onClick={() => setIsSyncScroll(!isSyncScroll)}
                    className={`read-icon-btn ${isSyncScroll ? 'active' : ''}`}
                    title={isSyncScroll ? 'Disable Synchronized Scrolling' : 'Enable Synchronized Scrolling'}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>

                  {/* Close / Detach */}
                  <button
                    type="button"
                    onClick={() => handleDetachDoc(currentAttachedDoc.id)}
                    className="read-icon-btn text-[#7f1d1d] dark:text-[#a93338] hover:text-[#96282c]"
                    title="Detach this reference document"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Attached Doc Content Body */}
              <div className={`read-pane-content ${fontSize}`}>
                <article className="read-article-container">
                  <div className="read-book-meta-header">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <p className="read-book-kicker text-sky-600">
                        {currentAttachedDoc.authorOrSource || 'Attached Clinical Reference'}
                      </p>
                      {(currentAttachedDoc.pdfUrl || currentAttachedDoc.driveFileId) && (
                        <div className="flex items-center gap-2">
                          {currentAttachedDoc.storageProvider === 'google_drive' && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/35 font-semibold">
                              Google Drive
                            </span>
                          )}
                          {currentAttachedDoc.pdfUrl && (
                            <a
                              href={currentAttachedDoc.pdfUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] font-semibold text-amber-700 dark:text-amber-300 hover:underline flex items-center gap-1"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>Open Original</span>
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                    <h1 className="read-book-headline">
                      {currentAttachedPage?.title || currentAttachedDoc.title}
                    </h1>
                    {currentAttachedDoc.summary && (
                      <p className="read-book-byline text-stone-500 italic">
                        {currentAttachedDoc.summary}
                      </p>
                    )}
                  </div>

                  {(currentAttachedDoc.driveFileId || currentAttachedDoc.pdfUrl) && (
                    <div className="my-4 rounded-xl overflow-hidden border border-stone-200 dark:border-[#382518] bg-black/90 h-[62vh]">
                      <iframe
                        src={
                          getDrivePreviewUrl(
                            currentAttachedDoc.driveFileId || currentAttachedDoc.pdfUrl
                          ) || undefined
                        }
                        title={currentAttachedDoc.title}
                        className="w-full h-full border-0"
                        allow="autoplay"
                      />
                    </div>
                  )}

                  {/* Attached HTML Body */}
                  {currentAttachedPage?.contentHtml && (
                    <div
                      className="read-prose-body leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: currentAttachedPage.contentHtml }}
                    />
                  )}
                </article>
              </div>

              {/* Attached Doc Footer */}
              <div className="read-pane-footer">
                <span className="font-mono text-xs text-stone-500">
                  {currentAttachedDoc.authorOrSource || 'Attached Reference'}
                </span>
                <button
                  type="button"
                  className="read-attach-btn"
                  style={{ padding: '4px 10px', fontSize: '11px' }}
                  onClick={() => setIsAttachModalOpen(true)}
                >
                  <Plus className="w-3 h-3" />
                  <span>Switch Reference</span>
                </button>
              </div>
            </section>
          </>
        ) : (
          /* ========================================================================= */
          /* SINGLE FOCUSED TAB VIEW: CURRENTLY ACTIVE DOCUMENT (MAIN OR ATTACHED)    */
          /* ========================================================================= */
          <section className="read-pane w-full" aria-label="Reading View">
            {/* Content Body (Header bar removed per user instruction to maximize reading space) */}
            {activeTab === 'main' && isBookClosed ? (
              renderBlankDeskView()
            ) : isDoublePage && activeTab === 'main' ? (
              /* BOOK / DOUBLE PAGE SPREAD VIEW */
              <div className={`read-pane-content ${fontSize} flex flex-col md:flex-row gap-0 overflow-y-auto`}>
                {/* Left Page */}
                <div className="flex-1 p-6 md:p-8 border-b md:border-b-0 md:border-r relative" style={{ backgroundColor: 'var(--rs-surface)', borderColor: 'var(--rs-border)' }}>
                  <div className="absolute top-3 right-4 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleBookmark(mainPageNum)}
                      className={`p-1 rounded transition-colors ${
                        bookmarkedPages.includes(mainPageNum)
                          ? 'text-amber-500 fill-amber-500'
                          : 'text-stone-400 hover:text-stone-600'
                      }`}
                      title={bookmarkedPages.includes(mainPageNum) ? 'Remove Bookmark' : 'Bookmark Left Page'}
                    >
                      <Bookmark className={`w-4 h-4 ${bookmarkedPages.includes(mainPageNum) ? 'fill-current' : ''}`} />
                    </button>
                    <span className="text-[10px] font-mono text-stone-400">P. {mainPageNum}</span>
                  </div>

                  <article className="read-article-container max-w-xl mx-auto">
                    <div className="read-book-meta-header">
                      <p className="read-book-kicker">{currentMainPage.keyTopic}</p>
                      <h1 className="read-book-headline">{currentMainPage.title}</h1>
                      <p className="read-book-byline">
                        {mainBook.author} · {mainBook.edition}
                      </p>
                    </div>

                    {currentMainPage.summaryPearl && (
                      <div className="my-4 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-950 dark:text-amber-100 text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider mb-1 text-amber-700 dark:text-amber-400">
                          <Sparkles className="w-3 h-3" />
                          <span>Core Pearl</span>
                        </div>
                        <p>{currentMainPage.summaryPearl}</p>
                      </div>
                    )}

                    <div
                      className="read-prose-body leading-relaxed text-sm"
                      dangerouslySetInnerHTML={{ __html: currentMainPage.contentHtml }}
                    />
                  </article>
                </div>

                {/* Center Book Gutter Shadow */}
                <div className="hidden md:block w-3 bg-gradient-to-r from-stone-300/40 via-stone-400/20 to-stone-300/40 dark:from-black/50 dark:via-black/20 dark:to-black/50 shrink-0 pointer-events-none" />

                {/* Right Page */}
                <div className="flex-1 p-6 md:p-8 relative" style={{ backgroundColor: 'var(--rs-surface)' }}>
                  {mainBook.pages[mainPageNum] ? (
                    <>
                      <div className="absolute top-3 right-4 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleBookmark(mainPageNum + 1)}
                          className={`p-1 rounded transition-colors ${
                            bookmarkedPages.includes(mainPageNum + 1)
                              ? 'text-amber-500 fill-amber-500'
                              : 'text-stone-400 hover:text-stone-600'
                          }`}
                          title={bookmarkedPages.includes(mainPageNum + 1) ? 'Remove Bookmark' : 'Bookmark Right Page'}
                        >
                          <Bookmark className={`w-4 h-4 ${bookmarkedPages.includes(mainPageNum + 1) ? 'fill-current' : ''}`} />
                        </button>
                        <span className="text-[10px] font-mono text-stone-400">P. {mainPageNum + 1}</span>
                      </div>

                      <article className="read-article-container max-w-xl mx-auto">
                        <div className="read-book-meta-header">
                          <p className="read-book-kicker">{mainBook.pages[mainPageNum].keyTopic}</p>
                          <h1 className="read-book-headline">{mainBook.pages[mainPageNum].title}</h1>
                        </div>

                        {mainBook.pages[mainPageNum].summaryPearl && (
                          <div className="my-4 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-950 dark:text-amber-100 text-xs">
                            <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider mb-1 text-amber-700 dark:text-amber-400">
                              <Sparkles className="w-3 h-3" />
                              <span>Clinical Takeaway</span>
                            </div>
                            <p>{mainBook.pages[mainPageNum].summaryPearl}</p>
                          </div>
                        )}

                        <div
                          className="read-prose-body leading-relaxed text-sm"
                          dangerouslySetInnerHTML={{ __html: mainBook.pages[mainPageNum].contentHtml }}
                        />
                      </article>
                    </>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center p-8 text-center text-stone-400">
                      <BookOpen className="w-8 h-8 mb-2 opacity-30" />
                      <p className="text-xs font-mono">End of Textbook Section</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className={`read-pane-content ${fontSize}`}>
                <article className="read-article-container">
                  {activeTab === 'main' ? (
                    <>
                      <div className="read-book-meta-header">
                        <div className="flex items-center justify-between">
                          <p className="read-book-kicker">{currentMainPage.keyTopic}</p>
                          <button
                            type="button"
                            onClick={() => handleToggleBookmark(mainPageNum)}
                            className={`p-1 rounded transition-colors ${
                              bookmarkedPages.includes(mainPageNum)
                                ? 'text-amber-500 fill-amber-500'
                                : 'text-stone-400 hover:text-stone-600'
                            }`}
                            title={bookmarkedPages.includes(mainPageNum) ? 'Remove Bookmark' : 'Bookmark this page'}
                          >
                            <Bookmark className={`w-4 h-4 ${bookmarkedPages.includes(mainPageNum) ? 'fill-current' : ''}`} />
                          </button>
                        </div>
                        <h1 className="read-book-headline">{currentMainPage.title}</h1>
                        <p className="read-book-byline">
                          {mainBook.author} · {mainBook.edition}
                        </p>
                      </div>

                      {/* Summary Pearl */}
                      {currentMainPage.summaryPearl && (
                        <div className="my-5 p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-950 dark:text-amber-100 text-sm">
                          <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider mb-1 text-amber-700 dark:text-amber-400">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Core High-Yield Pearl</span>
                          </div>
                          <p>{currentMainPage.summaryPearl}</p>
                        </div>
                      )}

                      {/* HTML Content or Drive PDF */}
                      {(mainBook.driveFileId || mainBook.pdfFileUrl) && (
                        <div className="my-4 rounded-xl overflow-hidden border border-stone-200 dark:border-[#382518] bg-black/90 h-[66vh]">
                          <iframe
                            src={
                              getDrivePreviewUrl(
                                mainBook.driveFileId || mainBook.pdfFileUrl
                              ) || undefined
                            }
                            title={mainBook.title}
                            className="w-full h-full border-0"
                            allow="autoplay"
                          />
                        </div>
                      )}
                      {currentMainPage.contentHtml && (
                        <div
                          className="read-prose-body leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: currentMainPage.contentHtml }}
                        />
                      )}
                    </>
                  ) : (
                    currentAttachedDoc && (
                      <>
                        <div className="read-book-meta-header">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <p className="read-book-kicker text-sky-600">
                              {currentAttachedDoc.authorOrSource || 'Attached Document'}
                            </p>
                            {(currentAttachedDoc.pdfUrl || currentAttachedDoc.driveFileId) && (
                              <div className="flex items-center gap-2">
                                {currentAttachedDoc.storageProvider === 'google_drive' && (
                                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/35 font-semibold">
                                    Google Drive
                                  </span>
                                )}
                                {currentAttachedDoc.pdfUrl && (
                                  <a
                                    href={currentAttachedDoc.pdfUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[11px] font-semibold text-amber-700 dark:text-amber-300 hover:underline flex items-center gap-1"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                    <span>Open Original</span>
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                          <h1 className="read-book-headline">
                            {currentAttachedPage?.title || currentAttachedDoc.title}
                          </h1>
                          {currentAttachedDoc.summary && (
                            <p className="read-book-byline text-stone-500 italic">
                              {currentAttachedDoc.summary}
                            </p>
                          )}
                        </div>

                        {(currentAttachedDoc.driveFileId || currentAttachedDoc.pdfUrl) && (
                          <div className="my-4 rounded-xl overflow-hidden border border-stone-200 dark:border-[#382518] bg-black/90 h-[66vh]">
                            <iframe
                              src={
                                getDrivePreviewUrl(
                                  currentAttachedDoc.driveFileId || currentAttachedDoc.pdfUrl
                                ) || undefined
                              }
                              title={currentAttachedDoc.title}
                              className="w-full h-full border-0"
                              allow="autoplay"
                            />
                          </div>
                        )}

                        {currentAttachedPage?.contentHtml && (
                          <div
                            className="read-prose-body leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: currentAttachedPage.contentHtml }}
                          />
                        )}
                      </>
                    )
                  )}
                </article>
              </div>
            )}

            {/* Pagination Footer */}
            {activeTab === 'main' && !isBookClosed && (
              <div className="read-pane-footer">
                <button
                  type="button"
                  disabled={mainPageNum <= 1}
                  onClick={() => setMainPageNum((p) => Math.max(1, p - 1))}
                  className="read-icon-btn disabled:opacity-30"
                  title="Previous Chapter"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-mono text-xs text-stone-500">
                  Chapter {mainPageNum} of {mainBook.pages.length}
                </span>
                <button
                  type="button"
                  disabled={mainPageNum >= mainBook.pages.length}
                  onClick={() => setMainPageNum((p) => Math.min(mainBook.pages.length, p + 1))}
                  className="read-icon-btn disabled:opacity-30"
                  title="Next Chapter"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </section>
        )}
      </main>

      {/* ========================================================================= */}
      {/* ATTACHMENT MODAL: TAKE FROM DRIVE OR DEVICE UPLOAD                        */}
      {/* ========================================================================= */}
      {isAttachModalOpen && (
        <div className="read-modal-overlay" onClick={() => setIsAttachModalOpen(false)}>
          <div className="read-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="read-modal-header">
              <h3 className="font-semibold text-lg text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Paperclip className="w-4 h-4 text-[#A47C43]" />
                <span>Attach PDF or Document</span>
              </h3>
              <button
                type="button"
                className="read-icon-btn"
                onClick={() => setIsAttachModalOpen(false)}
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body: Only 2 Options — Take from Drive & Device Upload */}
            <div className="read-modal-body custom-scrollbar space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs items-start">
                {/* Option 1: Take from Drive + Connect Drive directly below */}
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setUploadTargetMode('drive')}
                    className={`w-full p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      uploadTargetMode === 'drive'
                        ? 'border-amber-500 bg-amber-500/12 ring-1 ring-amber-500/40'
                        : 'border-stone-200 dark:border-[#382518] hover:border-amber-500/40'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-stone-900 dark:text-stone-100">
                      <span className="flex items-center gap-2">
                        <HardDrive className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        <span>Take from Drive</span>
                      </span>
                      {driveAccount.connected && (
                        <span className="text-[10px] font-mono text-[#A47C43] dark:text-amber-400">
                          Connected
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
                      Open PDFs from your Google Drive
                    </p>
                  </button>

                  {/* Connect Drive button right below Drive option */}
                  <button
                    type="button"
                    onClick={() => {
                      setUploadTargetMode('drive');
                      setDriveUploadErr(null);
                      if (driveAccount.connected) {
                        void loadDrivePdfFiles(false);
                      } else {
                        connectGoogleDrive()
                          .then(() => {
                            setHasLoadedDriveList(false);
                            void loadDrivePdfFiles(false);
                          })
                          .catch((e: any) =>
                            setDriveUploadErr(e?.message || 'Google Drive OAuth cancelled.')
                          );
                      }
                    }}
                    className="w-full py-2 px-3 rounded-xl border border-amber-500/35 bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <HardDrive className="w-3.5 h-3.5" />
                    <span>{driveAccount.connected ? 'Connect Drive / Refresh' : 'Connect Drive'}</span>
                  </button>
                </div>

                {/* Option 2: Device Upload */}
                <div>
                  <button
                    type="button"
                    onClick={() => setUploadTargetMode('local')}
                    className={`w-full p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      uploadTargetMode === 'local'
                        ? 'border-[#A47C43] bg-[#A47C43]/15 ring-1 ring-[#A47C43]/40'
                        : 'border-stone-200 dark:border-[#382518] hover:border-[#A47C43]/40'
                    }`}
                  >
                    <div className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                      <UploadCloud className="w-4 h-4 text-[#A47C43]" />
                      <span>Device Upload</span>
                    </div>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
                      Upload a PDF directly from this device
                    </p>
                  </button>
                </div>
              </div>

              {driveUploadErr && (
                <div className="p-2.5 rounded-xl bg-[#7f1d1d]/12 dark:bg-[#6e171b]/30 border border-[#7f1d1d]/30 dark:border-[#962d32]/50 text-[#6e1418] dark:text-[#e49b9e] text-xs flex items-center justify-between gap-2">
                  <div className="flex items-start gap-2 min-w-0">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span className="break-words">{driveUploadErr}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setDriveUploadErr(null);
                      connectGoogleDrive()
                        .then(() => {
                          setHasLoadedDriveList(false);
                          void loadDrivePdfFiles(false);
                        })
                        .catch((e: any) =>
                          setDriveUploadErr(e?.message || 'Google Drive OAuth cancelled.')
                        );
                    }}
                    className="px-2.5 py-1 rounded-lg bg-amber-700 hover:bg-amber-800 text-white text-[10.5px] font-semibold shrink-0 cursor-pointer"
                  >
                    Connect Drive
                  </button>
                </div>
              )}

              {driveUploadPct !== null && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1.5">
                  <div className="flex justify-between text-[11px] font-mono font-bold text-amber-700 dark:text-amber-300">
                    <span>Uploading to Google Drive...</span>
                    <span>{driveUploadPct}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-stone-200 dark:bg-[#2b1e15] overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#85532d] to-[#d4a373] transition-all duration-200"
                      style={{ width: `${driveUploadPct}%` }}
                    />
                  </div>
                </div>
              )}

              <input
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                id="read-file-input"
                disabled={driveUploadPct !== null}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleRealPdfFileSelect(file);
                  }
                  e.target.value = '';
                }}
              />

              {/* Panel 1: Take from Drive */}
              {uploadTargetMode === 'drive' && (
                <div className="space-y-3">
                  {(() => {
                    const driveBooks = books.filter(
                      (b) => b.driveFileId || b.storageProvider === 'google_drive'
                    );
                    const mergedDriveFiles: DriveListedPdf[] = [
                      ...drivePickerFiles,
                      ...driveBooks
                        .filter(
                          (b) =>
                            b.driveFileId &&
                            !drivePickerFiles.some((f) => f.id === b.driveFileId)
                        )
                        .map((b) => ({
                          id: b.driveFileId!,
                          name: b.title,
                          size: b.fileSizeBytes ? String(b.fileSizeBytes) : undefined,
                          webViewLink: b.pdfFileUrl,
                        })),
                    ];

                    if (!driveAccount.connected && mergedDriveFiles.length === 0) {
                      return (
                        <div className="p-6 rounded-2xl border border-dashed border-stone-300 dark:border-[#382518] text-center space-y-2.5">
                          <HardDrive className="w-7 h-7 text-[#A47C43] mx-auto" />
                          <p className="text-sm font-semibold text-stone-800 dark:text-stone-100">
                            Google Drive not connected
                          </p>
                          <p className="text-xs text-stone-500">
                            Click Connect Drive above to pick or upload PDFs from your Google Drive.
                          </p>
                        </div>
                      );
                    }

                    return (
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                            Google Drive PDFs ({mergedDriveFiles.length})
                          </span>
                          <div className="flex items-center gap-2">
                            {driveAccount.connected && (
                              <button
                                type="button"
                                onClick={() => void loadDrivePdfFiles(false)}
                                disabled={isLoadingDriveFiles}
                                className="px-2.5 py-1 rounded-lg border border-stone-200 dark:border-[#382518] text-[11px] font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-[#241911] flex items-center gap-1 cursor-pointer"
                              >
                                <RefreshCw className={`w-3 h-3 ${isLoadingDriveFiles ? 'animate-spin' : ''}`} />
                                <span>Refresh</span>
                              </button>
                            )}
                            <label
                              htmlFor="read-file-input"
                              className="themed-accent-btn px-3 py-1 rounded-lg bg-[#A47C43] hover:bg-[#8e6834] text-white text-[11px] font-semibold cursor-pointer"
                            >
                              + Upload PDF to Drive
                            </label>
                          </div>
                        </div>

                        {isLoadingDriveFiles && mergedDriveFiles.length === 0 ? (
                          <div className="p-6 text-center text-xs text-stone-500">
                            Loading PDFs from Google Drive...
                          </div>
                        ) : mergedDriveFiles.length === 0 ? (
                          <div className="p-6 rounded-xl border border-dashed border-stone-300 dark:border-[#382518] text-center space-y-2">
                            <p className="text-xs text-stone-500">
                              No PDFs found in &ldquo;{DRIVE_APP_FOLDER_NAME}&rdquo; yet.
                            </p>
                            <label
                              htmlFor="read-file-input"
                              className="themed-accent-btn inline-block px-3.5 py-1.5 rounded-lg bg-[#A47C43] hover:bg-[#8e6834] text-white text-xs font-semibold cursor-pointer"
                            >
                              Upload First PDF to Drive
                            </label>
                          </div>
                        ) : (
                          <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-1">
                            {mergedDriveFiles.map((df) => {
                              const matchingBook = books.find((b) => b.driveFileId === df.id);
                              const sizeMb =
                                df.size && Number(df.size) > 0
                                  ? `${(Number(df.size) / (1024 * 1024)).toFixed(2)} MB`
                                  : 'Google Drive PDF';
                              return (
                                <div
                                  key={df.id}
                                  className="p-3 rounded-xl border border-stone-200 dark:border-[#382518] bg-stone-50 dark:bg-[#221811]/85 flex items-center justify-between gap-3 hover:border-amber-500/60 transition-colors"
                                >
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <FileText className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                                    <div className="min-w-0">
                                      <p className="text-xs font-semibold text-stone-900 dark:text-stone-100 truncate">
                                        {df.name}
                                      </p>
                                      <p className="text-[10.5px] text-stone-500 truncate">{sizeMb}</p>
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    className="read-attach-btn shrink-0"
                                    style={{ padding: '5px 11px' }}
                                    onClick={() =>
                                      matchingBook
                                        ? handleAttachBook(matchingBook)
                                        : handleAttachDriveFile(df)
                                    }
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Attach</span>
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Panel 2: Device Upload */}
              {uploadTargetMode === 'local' && (
                <label htmlFor="read-file-input" className="read-dropzone block">
                  <UploadCloud className="w-8 h-8 text-[#A47C43] mx-auto mb-2" />
                  <p className="text-sm font-semibold text-stone-800 dark:text-stone-200">
                    Upload PDF from Device
                  </p>
                  <p className="text-xs text-stone-400 mt-1">
                    Select any PDF file from your computer or phone to open right away
                  </p>
                  <span className="themed-accent-btn inline-block mt-3 px-4 py-1.5 rounded-lg bg-[#A47C43] text-white text-xs font-semibold hover:bg-[#8e6834]">
                    Browse Device
                  </span>
                </label>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* RETRACTABLE DRAWER: TABLE OF CONTENTS, CLINICAL INDEX & BOOKMARKS         */}
      {/* ========================================================================= */}
      {isTOCDrawerOpen && (
        <>
          <div
            className="fixed inset-0 top-12 bg-black/40 backdrop-blur-2xs z-40"
            onClick={() => setIsTOCDrawerOpen(false)}
          />
          <aside className="themed-glass-card fixed top-12 bottom-0 right-0 w-80 sm:w-96 bg-white dark:bg-[#18110c] border-l border-stone-200 dark:border-[#352317] shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-4 border-b border-stone-200 dark:border-[#352317] flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-base text-stone-900 dark:text-[#efe4d4] flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Textbook Navigation</span>
                </h3>
                <p className="text-[11px] text-stone-500 dark:text-[#a69079] truncate max-w-[240px]">
                  {mainBook.title}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsTOCDrawerOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-[#efe4d4] hover:bg-stone-100 dark:hover:bg-[#2b1e15]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Tabs (Contents, Index, Bookmarks) */}
            <div className="p-2 border-b border-stone-200 dark:border-[#352317] flex items-center gap-1 bg-stone-50 dark:bg-[#120c08] text-xs">
              <button
                type="button"
                onClick={() => setTocDrawerTab('toc')}
                className={`flex-1 py-1.5 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                  tocDrawerTab === 'toc'
                    ? 'bg-white dark:bg-[#2b1e15] text-stone-900 dark:text-[#efe4d4] shadow-2xs'
                    : 'text-stone-500 hover:text-stone-800 dark:hover:text-[#efe4d4]'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-[#A47C43]" />
                <span>Contents</span>
              </button>

              <button
                type="button"
                onClick={() => setTocDrawerTab('index')}
                className={`flex-1 py-1.5 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                  tocDrawerTab === 'index'
                    ? 'bg-white dark:bg-[#2b1e15] text-stone-900 dark:text-[#efe4d4] shadow-2xs'
                    : 'text-stone-500 hover:text-stone-800 dark:hover:text-[#efe4d4]'
                }`}
              >
                <Search className="w-3.5 h-3.5 text-sky-600" />
                <span>Index (A-Z)</span>
              </button>

              <button
                type="button"
                onClick={() => setTocDrawerTab('bookmarks')}
                className={`flex-1 py-1.5 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                  tocDrawerTab === 'bookmarks'
                    ? 'bg-white dark:bg-[#2b1e15] text-stone-900 dark:text-[#efe4d4] shadow-2xs'
                    : 'text-stone-500 hover:text-stone-800 dark:hover:text-[#efe4d4]'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5 text-amber-600" />
                <span>Marks ({bookmarkedPages.length})</span>
              </button>
            </div>

            {/* Drawer Body Content */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar text-xs">
              {/* TAB 1: TABLE OF CONTENTS */}
              {tocDrawerTab === 'toc' && (
                <div className="space-y-1.5">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-bold px-2 py-1">
                    Chapters & Modules ({mainBook.pages.length})
                  </div>
                  {mainBook.pages.map((p, idx) => {
                    const isCurrent = p.pageNumber === mainPageNum;
                    return (
                      <div
                        key={p.pageNumber}
                        onClick={() => {
                          setMainPageNum(p.pageNumber);
                          setIsTOCDrawerOpen(false);
                        }}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                          isCurrent
                            ? 'bg-[#A47C43]/15 border-[#A47C43]/35 text-amber-900 dark:text-amber-100 font-bold shadow-2xs'
                            : 'bg-stone-50 dark:bg-[#211711] border-stone-200/70 dark:border-[#352317] hover:border-amber-500/50 text-stone-700 dark:text-[#d8c7b0]'
                        }`}
                      >
                        <div className="min-w-0 flex-1 pr-2">
                          <div className="text-[10px] font-mono text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                            Ch {idx + 1} · {p.keyTopic}
                          </div>
                          <div className="text-xs truncate font-serif font-bold mt-0.5">
                            {p.title}
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-stone-400 shrink-0">
                          P. {p.pageNumber}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* TAB 2: CLINICAL INDEX (A-Z) */}
              {tocDrawerTab === 'index' && (
                <div className="space-y-2">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-bold px-2 py-1">
                    Index Entries ({mainBook.pages.length})
                  </div>
                  {mainBook.pages.length === 0 ? (
                    <div className="p-4 text-center text-xs text-stone-400">
                      No index entries yet. Open or upload a book to browse chapters.
                    </div>
                  ) : (
                    mainBook.pages.map((p) => (
                      <div
                        key={p.pageNumber}
                        onClick={() => {
                          setMainPageNum(p.pageNumber);
                          setIsTOCDrawerOpen(false);
                        }}
                        className="p-2.5 rounded-xl border border-stone-200/70 dark:border-[#352317] bg-stone-50 dark:bg-[#211711] hover:border-sky-500/50 transition-all cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-stone-900 dark:text-stone-100 text-xs">
                            {p.keyTopic || p.title}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-sky-500/10 text-sky-700 dark:text-sky-300">
                            P. {p.pageNumber}
                          </span>
                        </div>
                        {p.summaryPearl && (
                          <p className="text-[10.5px] text-stone-500 dark:text-stone-400 mt-1 leading-snug">
                            {p.summaryPearl}
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 3: BOOKMARKS */}
              {tocDrawerTab === 'bookmarks' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-2 py-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-bold">
                      Saved Bookmarks
                    </span>
                    <button
                      type="button"
                      onClick={() => handleToggleBookmark(mainPageNum)}
                      className="text-xs text-amber-700 dark:text-amber-400 hover:underline font-bold flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Bookmark Page {mainPageNum}</span>
                    </button>
                  </div>

                  {bookmarkedPages.length === 0 ? (
                    <div className="text-center py-8 text-stone-400">
                      <Bookmark className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      <p className="text-xs">No bookmarks saved yet.</p>
                      <button
                        type="button"
                        onClick={() => handleToggleBookmark(mainPageNum)}
                        className="mt-3 px-3 py-1.5 rounded-lg bg-amber-600 text-white font-bold text-xs"
                      >
                        Bookmark Page {mainPageNum}
                      </button>
                    </div>
                  ) : (
                    bookmarkedPages.map((pageNum) => {
                      const pageObj = mainBook.pages.find((p) => p.pageNumber === pageNum);
                      return (
                        <div
                          key={pageNum}
                          className="p-2.5 rounded-xl border border-stone-200/80 dark:border-[#352317] bg-stone-50 dark:bg-[#211711] flex items-center justify-between group"
                        >
                          <div
                            onClick={() => {
                              setMainPageNum(pageNum);
                              setIsTOCDrawerOpen(false);
                            }}
                            className="min-w-0 flex-1 cursor-pointer"
                          >
                            <div className="flex items-center gap-1.5 font-bold text-xs text-stone-900 dark:text-stone-100">
                              <Bookmark className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                              <span>Page {pageNum}</span>
                            </div>
                            <div className="text-[11px] text-stone-500 truncate mt-0.5">
                              {pageObj?.title || `Page ${pageNum}`}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleToggleBookmark(pageNum)}
                            className="p-1 rounded text-stone-400 hover:text-[#7f1d1d] dark:hover:text-[#c94a4f] transition-colors"
                            title="Remove bookmark"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </aside>
        </>
      )}

      {/* Toast Notification */}
      {copyToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1a120d] text-[#efe4d4] text-xs font-medium shadow-xl border border-[#382518]">
            <Check className="w-4 h-4 text-amber-400" />
            <span>{copyToast}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadStudioView;
