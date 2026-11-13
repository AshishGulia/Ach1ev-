import React, { useState } from 'react';
import { MedicalBook, Notebook, SnippetScreenshot } from '../../types';
import { MedicalBookReader } from './MedicalBookReader';
import { RichNoteEditor } from '../notebook/RichNoteEditor';
import { AIResearchPanel } from './AIResearchPanel';
import {
  Columns2,
  Columns3,
  Square,
  Sparkles,
  BookOpen,
  FileText,
  Upload,
  Layers,
  ArrowLeftRight,
} from 'lucide-react';

interface MultiSlabStudioProps {
  books: MedicalBook[];
  onUploadPDF: (file: File) => void;
  activeNotebook: Notebook;
  onUpdateNotebook: (nb: Notebook) => void;
  initialTopic?: string;
}

export type SlabLayoutMode = '3-slab-collage' | '2-slab-split' | '1-slab-focus';

export const MultiSlabStudio: React.FC<MultiSlabStudioProps> = ({
  books,
  onUploadPDF,
  activeNotebook,
  onUpdateNotebook,
  initialTopic = 'Osteoporosis Pharmacotherapy',
}) => {
  const [layoutMode, setLayoutMode] = useState<SlabLayoutMode>('3-slab-collage');
  const [selectedBook1Id, setSelectedBook1Id] = useState<string>(books[0]?.id || '');
  const [selectedBook2Id, setSelectedBook2Id] = useState<string>(books[1]?.id || books[0]?.id || '');
  const [middleSlabContent, setMiddleSlabContent] = useState<'book2' | 'ai'>('book2');
  const [activePageIndex, setActivePageIndex] = useState<number>(activeNotebook.activePageIndex || 0);

  // AI research state
  const [aiTopic, setAiTopic] = useState<string>(initialTopic);
  const [aiPageSnippet, setAiPageSnippet] = useState<string>('');
  const [isAiMainReading, setIsAiMainReading] = useState<boolean>(false);

  const book1 = books.find((b) => b.id === selectedBook1Id) || books[0];
  const book2 = books.find((b) => b.id === selectedBook2Id) || books[1] || books[0];

  // Handle snipping from book into notebook
  const handleCaptureSnippet = (snippet: SnippetScreenshot) => {
    const currentPage = activeNotebook.pages[activePageIndex] || activeNotebook.pages[0];
    const updatedScreenshots = [...(currentPage.screenshots || []), snippet];

    // Append image snippet directly into note content
    const snippetHtml = `
      <div style="margin: 12px 0; border: 1px solid #cbd5e1; border-radius: 6px; overflow: hidden; background: #ffffff;">
        <div style="background: #f1f5f9; padding: 4px 8px; font-size: 11px; font-weight: bold; color: #334155;">
          📸 Snippet from ${snippet.sourceBookTitle} (p. ${snippet.pageNumber})
        </div>
        <img src="${snippet.dataUrl}" style="width: 100%; max-height: 260px; object-fit: contain; display: block;" alt="Textbook snippet" />
      </div>
      <p><br/></p>
    `;

    const updatedPages = [...activeNotebook.pages];
    updatedPages[activePageIndex] = {
      ...currentPage,
      screenshots: updatedScreenshots,
      contentHtml: (currentPage.contentHtml || '') + snippetHtml,
    };

    onUpdateNotebook({
      ...activeNotebook,
      pages: updatedPages,
    });
  };

  const handleAskAI = (topic: string, snippetText: string) => {
    setAiTopic(topic);
    setAiPageSnippet(snippetText);
    setMiddleSlabContent('ai');
  };

  const handleInsertAiToNote = (contentHtml: string) => {
    const currentPage = activeNotebook.pages[activePageIndex] || activeNotebook.pages[0];
    const updatedPages = [...activeNotebook.pages];
    updatedPages[activePageIndex] = {
      ...currentPage,
      contentHtml: (currentPage.contentHtml || '') + contentHtml,
    };
    onUpdateNotebook({
      ...activeNotebook,
      pages: updatedPages,
    });
  };

  const handlePdfUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUploadPDF(e.target.files[0]);
    }
  };

  const toggleSwapAiMain = () => {
    setIsAiMainReading(!isAiMainReading);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-68px)] w-full bg-[#edece8] dark:bg-[#110c09] overflow-hidden transition-colors">
      {/* Windows Snap Studio Bar */}
      <div className="bg-[#fbfaf7]/90 dark:bg-[#18110c]/95 backdrop-blur-md border-b border-stone-200/80 dark:border-[#352317] px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs select-none z-20 shadow-xs">
        {/* Left: Active Workspace Title & Book Selector */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-stone-800 dark:text-[#efe4d4]">
            <Layers className="w-4 h-4 text-amber-500" />
            <span>Windows Multi-Slab Collage</span>
          </div>

          <div className="h-4 w-px bg-stone-300 dark:bg-[#382518] hidden sm:block" />

          {/* Book 1 Selector */}
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-stone-500 dark:text-[#a69079] font-mono">Book 1:</span>
            <select
              value={selectedBook1Id}
              onChange={(e) => setSelectedBook1Id(e.target.value)}
              className="bg-stone-100 dark:bg-[#251a12] border border-stone-300 dark:border-[#382518] rounded px-2 py-1 text-[11px] text-stone-700 dark:text-[#efe4d4] max-w-[160px] truncate"
            >
              {books.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title}
                </option>
              ))}
            </select>
          </div>

          {/* Book 2 Selector (in 3-slab mode) */}
          {layoutMode === '3-slab-collage' && (
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-stone-500 dark:text-[#a69079] font-mono">Book 2:</span>
              <select
                value={selectedBook2Id}
                onChange={(e) => setSelectedBook2Id(e.target.value)}
                className="bg-stone-100 dark:bg-[#251a12] border border-stone-300 dark:border-[#382518] rounded px-2 py-1 text-[11px] text-stone-700 dark:text-[#efe4d4] max-w-[160px] truncate"
              >
                {books.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Upload PDF */}
          <label className="cursor-pointer px-2 py-1 rounded bg-stone-100 dark:bg-[#251a12] hover:bg-stone-200 dark:hover:bg-[#2b1e15] text-stone-700 dark:text-[#efe4d4] text-[11px] flex items-center gap-1 border border-stone-300 dark:border-[#382518] transition-colors">
            <Upload className="w-3 h-3 text-amber-500" />
            <span>Upload PDF</span>
            <input type="file" accept=".pdf" onChange={handlePdfUploadChange} className="hidden" />
          </label>
        </div>

        {/* Right: Layout Snap Switchers (Windows 11 Collage) */}
        <div className="flex items-center gap-2">
          {/* Middle Slab Switcher (Book 2 vs AI Research) */}
          {layoutMode === '3-slab-collage' && (
            <div className="flex items-center bg-stone-100 dark:bg-[#211711] p-0.5 rounded border border-stone-300 dark:border-[#382518]">
              <button
                onClick={() => setMiddleSlabContent('book2')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  middleSlabContent === 'book2'
                    ? 'bg-white dark:bg-[#382518] text-stone-900 dark:text-[#efe4d4] shadow-xs'
                    : 'text-stone-500 hover:text-stone-900 dark:hover:text-[#efe4d4]'
                }`}
              >
                Book 2
              </button>
              <button
                onClick={() => setMiddleSlabContent('ai')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1 transition-colors ${
                  middleSlabContent === 'ai'
                    ? 'bg-amber-700 text-white shadow-xs'
                    : 'text-stone-500 hover:text-stone-900 dark:hover:text-[#efe4d4]'
                }`}
              >
                <Sparkles className="w-3 h-3" />
                <span>AI Slab</span>
              </button>
            </div>
          )}

          {/* Windows Snap Layout Mode Controls */}
          <div className="flex items-center bg-stone-100 dark:bg-[#211711] p-0.5 rounded border border-stone-300 dark:border-[#382518]">
            <button
              onClick={() => setLayoutMode('3-slab-collage')}
              title="3 Slabs Collage: Book 1 + Book 2/AI + Notebook"
              className={`p-1.5 rounded transition-colors ${
                layoutMode === '3-slab-collage'
                  ? 'bg-white dark:bg-[#382518] text-amber-600 dark:text-amber-300 shadow-xs'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-[#efe4d4]'
              }`}
            >
              <Columns3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setLayoutMode('2-slab-split')}
              title="2 Slabs Side-by-Side: Book + Notebook"
              className={`p-1.5 rounded transition-colors ${
                layoutMode === '2-slab-split'
                  ? 'bg-white dark:bg-[#382518] text-amber-600 dark:text-amber-300 shadow-xs'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-[#efe4d4]'
              }`}
            >
              <Columns2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setLayoutMode('1-slab-focus')}
              title="1 Slab Focus: Notebook Only"
              className={`p-1.5 rounded transition-colors ${
                layoutMode === '1-slab-focus'
                  ? 'bg-white dark:bg-[#382518] text-amber-600 dark:text-amber-300 shadow-xs'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-[#efe4d4]'
              }`}
            >
              <Square className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Slabs Multi-Pane Viewport Grid */}
      <div className="flex-1 p-2 gap-2 overflow-hidden flex flex-row">
        {/* SLAB 1: Primary Book Reader OR AI Research (if swapped) */}
        {layoutMode !== '1-slab-focus' && (
          <div
            className={`h-full flex flex-col transition-all duration-300 ${
              layoutMode === '3-slab-collage'
                ? isAiMainReading
                  ? 'w-[22%] shrink-0'
                  : 'w-[32%] shrink-0'
                : 'w-1/2'
            }`}
          >
            {isAiMainReading ? (
              /* Mini Book View when AI is Main */
              <MedicalBookReader
                book={book1}
                onAskAI={handleAskAI}
                onCaptureSnippet={handleCaptureSnippet}
                onSwapWithMain={toggleSwapAiMain}
                isMiniView={true}
              />
            ) : (
              /* Normal Primary Book View */
              <MedicalBookReader
                book={book1}
                onAskAI={handleAskAI}
                onCaptureSnippet={handleCaptureSnippet}
              />
            )}
          </div>
        )}

        {/* SLAB 2 (Collage Middle Slab): Book 2 OR AI Research Panel */}
        {layoutMode === '3-slab-collage' && (
          <div
            className={`h-full flex flex-col transition-all duration-300 ${
              isAiMainReading ? 'w-[42%] shrink-0' : 'w-[32%] shrink-0'
            }`}
          >
            {isAiMainReading ? (
              /* AI Research is Main Center Viewport */
              <AIResearchPanel
                initialTopic={aiTopic}
                initialSnippet={aiPageSnippet}
                onInsertToNote={handleInsertAiToNote}
                onMakeMainReading={toggleSwapAiMain}
                isMainReading={true}
              />
            ) : middleSlabContent === 'book2' ? (
              /* Second Book side-by-side */
              <MedicalBookReader
                book={book2}
                onAskAI={handleAskAI}
                onCaptureSnippet={handleCaptureSnippet}
              />
            ) : (
              /* AI Research Panel right next to book */
              <AIResearchPanel
                initialTopic={aiTopic}
                initialSnippet={aiPageSnippet}
                onInsertToNote={handleInsertAiToNote}
                onMakeMainReading={toggleSwapAiMain}
                isMainReading={false}
              />
            )}
          </div>
        )}

        {/* SLAB 3: Active Notebook with MS Word Editor & Stylus */}
        <div
          className={`h-full flex flex-col transition-all duration-300 ${
            layoutMode === '3-slab-collage'
              ? isAiMainReading
                ? 'w-[36%] flex-1'
                : 'w-[36%] flex-1'
              : layoutMode === '2-slab-split'
              ? 'w-1/2'
              : 'w-full'
          }`}
        >
          <RichNoteEditor
            notebook={activeNotebook}
            onUpdateNotebook={onUpdateNotebook}
            activePageIndex={activePageIndex}
            onSelectPage={setActivePageIndex}
            onAskAIAboutSelection={(text: string) => handleAskAI('Selected Concept', text)}
          />
        </div>
      </div>
    </div>
  );
};
