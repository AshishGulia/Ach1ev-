import React, { useState, useRef } from 'react';
import { MedicalBook, BookPage, SnippetScreenshot } from '../../types';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Sparkles,
  Camera,
  Bookmark,
  Search,
  Check,
  Copy,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

interface MedicalBookReaderProps {
  book: MedicalBook;
  onPageChange?: (pageNumber: number) => void;
  onAskAI: (topic: string, snippetText: string) => void;
  onCaptureSnippet: (snippet: SnippetScreenshot) => void;
  onSwapWithMain?: () => void;
  isMiniView?: boolean;
}

export const MedicalBookReader: React.FC<MedicalBookReaderProps> = ({
  book,
  onAskAI,
  onCaptureSnippet,
  onSwapWithMain,
  isMiniView = false,
}) => {
  const [currentPageNum, setCurrentPageNum] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isSnipping, setIsSnipping] = useState<boolean>(false);
  const [snipStart, setSnipStart] = useState<{ x: number; y: number } | null>(null);
  const [snipEnd, setSnipEnd] = useState<{ x: number; y: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [bookmarkedPages, setBookmarkedPages] = useState<number[]>(book.bookmarks || []);
  const [justCaptured, setJustCaptured] = useState<boolean>(false);

  const pageContainerRef = useRef<HTMLDivElement | null>(null);

  const activePage: BookPage =
    book.pages.find((p) => p.pageNumber === currentPageNum) ||
    book.pages[0] || {
      pageNumber: 1,
      title: 'Blank Page',
      keyTopic: 'General Clinical Pharmacology',
      summaryPearl: 'No content',
      contentHtml: '<p>Document page unavailable.</p>',
    };

  const handleNextPage = () => {
    if (currentPageNum < book.pages.length) {
      setCurrentPageNum(currentPageNum + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPageNum > 1) {
      setCurrentPageNum(currentPageNum - 1);
    }
  };

  const toggleBookmark = () => {
    if (bookmarkedPages.includes(currentPageNum)) {
      setBookmarkedPages(bookmarkedPages.filter((p) => p !== currentPageNum));
    } else {
      setBookmarkedPages([...bookmarkedPages, currentPageNum]);
    }
  };

  // Snipping / Screenshot Capture Tool
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isSnipping) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setSnipStart({ x, y });
    setSnipEnd({ x, y });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isSnipping || !snipStart) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setSnipEnd({ x, y });
  };

  const handlePointerUp = () => {
    if (!isSnipping || !snipStart || !snipEnd) return;

    const width = Math.abs(snipEnd.x - snipStart.x);
    const height = Math.abs(snipEnd.y - snipStart.y);

    if (width > 20 && height > 20 && pageContainerRef.current) {
      // Create a visual snippet card on HTML Canvas
      const canvas = document.createElement('canvas');
      canvas.width = Math.min(width * 2, 800);
      canvas.height = Math.min(height * 2, 600);
      const ctx = canvas.getContext('2d');

      if (ctx) {
        // Draw elegant clip styling
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Header ribbon
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, canvas.width, 36);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText(`Snippet from: ${book.title.slice(0, 30)}...`, 14, 24);

        // Simulated high-res diagram / text excerpt
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(10, 46, canvas.width - 20, canvas.height - 56);
        ctx.strokeStyle = '#cbd5e1';
        ctx.strokeRect(10, 46, canvas.width - 20, canvas.height - 56);

        ctx.fillStyle = '#1e293b';
        ctx.font = '14px sans-serif';
        ctx.fillText(`Topic: ${activePage.keyTopic}`, 20, 75);
        ctx.fillStyle = '#475569';
        ctx.font = '12px sans-serif';
        ctx.fillText(`Captured on page ${currentPageNum} · High-Yield Visual Excerpt`, 20, 98);

        // Draw illustrative medical diagram graph
        ctx.strokeStyle = '#2563eb';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(30, 160);
        ctx.bezierCurveTo(90, 120, 160, 200, 240, 130);
        ctx.stroke();

        ctx.fillStyle = '#8f5f2c';
        ctx.fillRect(30, 180, canvas.width - 60, 24);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(`Pearl: ${activePage.summaryPearl.slice(0, 65)}...`, 36, 196);

        const dataUrl = canvas.toDataURL('image/png');

        const newSnippet: SnippetScreenshot = {
          id: `snip-${Date.now()}`,
          dataUrl,
          sourceBookTitle: book.title,
          pageNumber: currentPageNum,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          caption: `${activePage.keyTopic} (p. ${currentPageNum})`,
        };

        onCaptureSnippet(newSnippet);
        setJustCaptured(true);
        setTimeout(() => setJustCaptured(false), 2400);
      }
    }

    setSnipStart(null);
    setSnipEnd(null);
    setIsSnipping(false);
  };

  const cancelSnip = () => {
    setIsSnipping(false);
    setSnipStart(null);
    setSnipEnd(null);
  };

  return (
    <div className="flex flex-col h-full bg-stone-100 dark:bg-[#140e0a] border border-stone-300 dark:border-[#382518] rounded-lg overflow-hidden shadow-sm">
      {/* Top Windows Reader Bar */}
      <div className="bg-white dark:bg-[#18110c] border-b border-stone-200 dark:border-[#352317] px-3 py-2 flex items-center justify-between gap-2 text-xs select-none shadow-xs">
        {/* Book Title & Edition */}
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="w-3 h-3 rounded-full shrink-0"
            style={{ backgroundColor: book.coverColor || '#2563eb' }}
          />
          <span className="font-semibold text-stone-800 dark:text-[#efe4d4] truncate text-[11px] md:text-xs">
            {book.title}
          </span>
          <span className="text-[10px] text-stone-500 dark:text-[#a69079] hidden sm:inline">
            · {book.edition}
          </span>
        </div>

        {/* Reader Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Lasso / Snippet Tool */}
          <button
            onClick={() => setIsSnipping(!isSnipping)}
            title="Snip / Screenshot region to active Notebook"
            className={`px-2.5 py-1 rounded text-[11px] font-medium flex items-center gap-1.5 transition-colors ${
              isSnipping
                ? 'bg-[#7f1d1d] text-[#fdf2f2] animate-pulse'
                : justCaptured
                ? 'bg-[#8f5f2c] text-white'
                : 'bg-stone-100 dark:bg-[#251a12] hover:bg-stone-200 dark:hover:bg-[#2b1e15] text-stone-700 dark:text-[#d8c7b0] border border-stone-200 dark:border-[#382518]'
            }`}
          >
            {justCaptured ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Pasted in Note!</span>
              </>
            ) : (
              <>
                <Camera className="w-3.5 h-3.5 text-amber-500" />
                <span>{isSnipping ? 'Drag Area to Snip' : 'Snip to Note'}</span>
              </>
            )}
          </button>

          {/* Ask AI about this Page */}
          <button
            onClick={() => onAskAI(activePage.keyTopic, activePage.contentHtml)}
            title="Ask AI & Show Latest Studies on this Topic"
            className="px-2.5 py-1 rounded text-[11px] font-medium bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-800 hover:to-amber-900 text-white flex items-center gap-1 shadow-xs transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
            <span className="hidden sm:inline">AI Studies</span>
          </button>

          {/* Swap with Main Reading if mini view */}
          {isMiniView && onSwapWithMain && (
            <button
              onClick={onSwapWithMain}
              title="Expand this book to main window"
              className="p-1 rounded bg-stone-100 dark:bg-[#251a12] hover:bg-stone-200 dark:hover:bg-[#2b1e15] text-stone-700 dark:text-[#d8c7b0]"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Bookmark */}
          <button
            onClick={toggleBookmark}
            title={bookmarkedPages.includes(currentPageNum) ? 'Remove Bookmark' : 'Add Bookmark'}
            className="p-1 rounded hover:bg-stone-100 dark:hover:bg-[#251a12] text-stone-600 dark:text-[#d8c7b0]"
          >
            <Bookmark
              className={`w-3.5 h-3.5 ${
                bookmarkedPages.includes(currentPageNum) ? 'fill-amber-400 text-amber-500' : ''
              }`}
            />
          </button>

          <div className="w-px h-4 bg-stone-200 dark:bg-[#382518] mx-0.5" />

          {/* Zoom controls */}
          <button
            onClick={() => setZoomLevel(Math.max(70, zoomLevel - 15))}
            title="Zoom Out"
            className="p-1 rounded hover:bg-stone-100 dark:hover:bg-[#251a12] text-stone-600 dark:text-[#d8c7b0]"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] font-mono text-stone-500 dark:text-[#a69079] w-8 text-center">
            {zoomLevel}%
          </span>
          <button
            onClick={() => setZoomLevel(Math.min(150, zoomLevel + 15))}
            title="Zoom In"
            className="p-1 rounded hover:bg-stone-100 dark:hover:bg-[#251a12] text-stone-600 dark:text-[#d8c7b0]"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Snipping Mode Banner */}
      {isSnipping && (
        <div className="bg-[#7f1d1d] text-[#fdf2f2] text-[11px] px-3 py-1 flex items-center justify-between font-medium select-none shadow-xs">
          <span>Click and drag over any textbook diagram, table, or paragraph to paste it into your active notebook.</span>
          <button
            onClick={cancelSnip}
            className="underline hover:text-[#e49b9e] text-[10px]"
          >
            Cancel Snip
          </button>
        </div>
      )}

      {/* Main Page Content Body */}
      <div
        ref={pageContainerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className={`flex-1 overflow-y-auto p-4 md:p-8 flex justify-center relative ${
          isSnipping ? 'cursor-crosshair select-none' : ''
        }`}
      >
        {/* Book Sheet Page */}
        <div
          className="bg-white dark:bg-[#1a120d] text-stone-900 dark:text-[#efe4d4] w-full max-w-3xl min-h-[750px] p-8 md:p-12 rounded shadow-md border border-stone-200 dark:border-[#382518] transition-transform origin-top"
          style={{ transform: `scale(${zoomLevel / 100})` }}
        >
          {/* Header on page */}
          <div className="flex items-center justify-between border-b border-stone-200 dark:border-[#352317] pb-2 mb-6 text-xs text-stone-500 dark:text-[#a69079]">
            <span className="font-mono uppercase">{book.subject} · {book.author.split(',')[0]}</span>
            <span className="font-mono">Page {activePage.pageNumber}</span>
          </div>

          <h1 className="text-xl md:text-2xl font-bold mb-4 tracking-tight text-stone-900 dark:text-[#efe4d4]">
            {activePage.title}
          </h1>

          {/* High-Yield Summary Banner on Page */}
          <div className="p-3 mb-6 bg-stone-50 dark:bg-[#211711] rounded border border-stone-200 dark:border-[#382518] flex items-start gap-2 text-xs">
            <span className="text-amber-500 font-bold shrink-0 mt-0.5">💡 High-Yield:</span>
            <p className="text-stone-700 dark:text-[#d8c7b0] italic">{activePage.summaryPearl}</p>
          </div>

          {/* HTML Render of textbook page content */}
          <div
            className="prose dark:prose-invert max-w-none text-sm md:text-base leading-relaxed"
            dangerouslySetInnerHTML={{ __html: activePage.contentHtml }}
          />
        </div>

        {/* Live Snipping Box Overlay */}
        {isSnipping && snipStart && snipEnd && (
          <div
            className="absolute border-2 border-[#962d32] bg-[#7f1d1d]/15 pointer-events-none rounded-xs z-40"
            style={{
              left: Math.min(snipStart.x, snipEnd.x),
              top: Math.min(snipStart.y, snipEnd.y),
              width: Math.abs(snipEnd.x - snipStart.x),
              height: Math.abs(snipEnd.y - snipStart.y),
            }}
          >
            <div className="absolute -top-6 left-0 bg-[#7f1d1d] text-[#fdf2f2] text-[9px] px-1.5 py-0.5 rounded font-mono">
              Release to stamp to Note
            </div>
          </div>
        )}
      </div>

      {/* Bottom Page Navigation Footer */}
      <div className="bg-white dark:bg-[#18110c] border-t border-stone-200 dark:border-[#352317] px-4 py-2 flex items-center justify-between text-xs text-stone-600 dark:text-[#a69079]">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevPage}
            disabled={currentPageNum === 1}
            className="p-1 rounded bg-stone-100 dark:bg-[#251a12] hover:bg-stone-200 dark:hover:bg-[#2b1e15] disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-mono text-[11px]">
            Page {currentPageNum} / {book.pages.length}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPageNum === book.pages.length}
            className="p-1 rounded bg-stone-100 dark:bg-[#251a12] hover:bg-stone-200 dark:hover:bg-[#2b1e15] disabled:opacity-40"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="text-[11px] text-stone-500 dark:text-[#a69079]">
          Topic: <span className="font-medium text-stone-700 dark:text-[#efe4d4]">{activePage.keyTopic}</span>
        </div>
      </div>
    </div>
  );
};
