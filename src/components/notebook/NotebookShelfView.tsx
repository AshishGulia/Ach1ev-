import React, { useState } from 'react';
import { Notebook, PaperType, PaperColor, SubjectCourse, DesignId } from '../../types';
import { ClassmateCover } from './ClassmateCover';
import { BookThumbnailEditorModal } from '../library/BookThumbnailEditorModal';
import { getDefaultThumbnail } from '../../data/thumbnailMeta';
import { getMakeNoteTheme, MAKE_NOTE_THEMES } from './makeNoteThemes';
import {
  Plus,
  BookOpen,
  Edit3,
  Trash2,
  Copy,
  Sparkles,
  Check,
  Palette,
  X,
  FileText,
  RotateCcw,
  Calendar,
  Filter,
} from 'lucide-react';

interface NotebookShelfViewProps {
  notebooks: Notebook[];
  activeNotebookId: string;
  onSelectNotebook: (id: string) => void;
  onUpdateNotebook: (updated: Notebook) => void;
  onCreateNotebook: (newNb: Notebook) => void;
  onDeleteNotebook: (id: string) => void;
  currentSubject: SubjectCourse;
  activeDesign?: DesignId;
  onSelectDesign?: (design: DesignId) => void;
  isDarkMode?: boolean;
}

export const NotebookShelfView: React.FC<NotebookShelfViewProps> = ({
  notebooks,
  activeNotebookId,
  onSelectNotebook,
  onUpdateNotebook,
  onCreateNotebook,
  onDeleteNotebook,
  currentSubject,
  activeDesign = '1',
  onSelectDesign,
  isDarkMode,
}) => {
  const resolvedDark =
    isDarkMode !== undefined
      ? isDarkMode
      : typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  const theme = getMakeNoteTheme(activeDesign, resolvedDark);
  const isLightTheme1 = theme.id === '1' && !resolvedDark;
  const [editingCoverNb, setEditingCoverNb] = useState<Notebook | null>(null);
  const [editingThumbNb, setEditingThumbNb] = useState<Notebook | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);

  // New notebook form state
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newTheme, setNewTheme] = useState<any>('astronomy');
  const [newPaperType, setNewPaperType] = useState<PaperType>('ruled-thin');
  const [newPaperColor, setNewPaperColor] = useState<PaperColor>('beige');

  // Date filter with iOS scroll wheel picker
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);
  const [filterDate, setFilterDate] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<'on' | 'older'>('older');

  // iOS Drum wheel selection state
  const [wheelDay, setWheelDay] = useState(8);
  const [wheelMonth, setWheelMonth] = useState(10); // Nov (0-11)
  const [wheelYear, setWheelYear] = useState(2026);

  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
  const YEARS = [2023, 2024, 2025, 2026];

  const handleApplyDateFilter = () => {
    const formatted = `${wheelYear}-${String(wheelMonth + 1).padStart(2, '0')}-${String(wheelDay).padStart(2, '0')}`;
    setFilterDate(formatted);
    setIsDateFilterOpen(false);
  };

  const handleClearDateFilter = () => {
    setFilterDate(null);
    setIsDateFilterOpen(false);
  };

  const filteredNotebooks = notebooks.filter((nb) => {
    if (!filterDate) return true;
    const nbDate = nb.updatedAt || nb.createdAt || '2026-11-01';
    if (filterMode === 'on') {
      return nbDate === filterDate;
    }
    return nbDate <= filterDate;
  });

  const coverThemes = [
    { id: 'astronomy', num: '1', name: 'Design 1: Astronomy & Cosmic', badge: 'Space Series' },
    { id: 'wildlife', num: '2', name: 'Design 2: Wildlife Snow Leopard', badge: 'Fauna Series' },
    { id: 'anatomy', num: '3', name: 'Design 3: Da Vinci Anatomical', badge: 'Medical Antique' },
    { id: 'geometric', num: '4', name: 'Design 4: Origami Geometric', badge: 'Abstract Series' },
    { id: 'dna', num: '5', name: 'Design 5: Cyber DNA Helix', badge: 'Biotech Series' },
  ];

  const handleSaveCoverEdits = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCoverNb) return;
    onUpdateNotebook(editingCoverNb);
    setEditingCoverNb(null);
  };

  const handleCreateNewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Notebook = {
      id: `nb-${Date.now()}`,
      title: newTitle || `${currentSubject} Notebook`,
      subject: currentSubject,
      coverTheme: newTheme,
      coverTitle: newTitle.toUpperCase() || currentSubject.toUpperCase(),
      coverSubtitle: newSubtitle || 'Clinical Notes & Practical Records',
      coverColor: '#1e293b',
      paperType: newPaperType,
      paperColor: newPaperColor,
      activePageIndex: 0,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      pages: [
        {
          id: `p-${Date.now()}`,
          title: 'Introduction & Case Index',
          contentHtml: `<h2>${newTitle || currentSubject} - Topic 1</h2><p>Begin writing notes just like MS Word...</p>`,
          inkStrokes: [],
          screenshots: [],
          date: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0],
        },
      ],
    };

    onCreateNotebook(created);
    setIsCreatingNew(false);
    setNewTitle('');
    setNewSubtitle('');
    onSelectNotebook(created.id);
  };

  return (
    <div
      className="themed-workspace-surface flex-1 overflow-y-auto p-6 md:p-10 transition-colors"
      style={{
        backgroundColor: activeDesign !== '1' ? undefined : theme.workspaceBg,
        fontFamily: theme.fontFamily,
        color: activeDesign !== '1' ? 'var(--th-ink)' : isLightTheme1 ? '#1e2227' : '#efe4d4',
      }}
    >
      {/* Top Banner with Active Design Sync */}
      <div
        className="max-w-6xl mx-auto mb-8 flex flex-wrap items-center justify-between gap-4 pb-6 border-b transition-colors"
        style={{ borderColor: theme.headerBorder }}
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border font-semibold"
              style={{
                borderColor: `${theme.accentHex}40`,
                color: theme.accentHex,
                backgroundColor: `${theme.accentHex}15`,
              }}
            >
              Design {theme.id}: {theme.name} · {theme.badge}
            </span>
            <span
              className="text-xs font-mono hidden sm:inline"
              style={{ color: isLightTheme1 ? '#5a626c' : '#a69079' }}
            >
              {theme.subtitle}
            </span>
          </div>

          <h2
            className="text-3xl font-bold tracking-tight flex items-center gap-2"
            style={{
              fontFamily: theme.fontFamilyTitle,
              color: isLightTheme1 ? '#1e2227' : '#f5ecde',
            }}
          >
            <BookOpen className="w-5 h-5" style={{ color: theme.accentHex }} />
            <span>Classmate Notebook Collection</span>
          </h2>
          <p
            className="text-xs mt-1"
            style={{ color: isLightTheme1 ? '#5a626c' : '#a69079' }}
          >
            Physical medical bookshelf with customizable Classmate covers, paper prints, digital ink, and synchronized study themes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Design Switcher */}
          {onSelectDesign && (
            <div
              className={`flex items-center gap-1.5 p-1.5 rounded-xl border ${
                isLightTheme1
                  ? 'bg-stone-200/80 border-stone-300'
                  : 'bg-[#1a120d]/90 border-[#382518]'
              }`}
            >
              <span
                className={`text-[10px] font-mono uppercase tracking-wider px-1 hidden md:inline ${
                  isLightTheme1 ? 'text-stone-600' : 'text-[#a69079]'
                }`}
              >
                Theme:
              </span>
              <select
                value={activeDesign}
                onChange={(e) => onSelectDesign(e.target.value as DesignId)}
                className="bg-transparent text-xs font-mono font-bold outline-none cursor-pointer px-1 py-0.5"
                style={{ color: theme.accentHex }}
              >
                {(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'] as DesignId[]).map((dId) => {
                  const t = MAKE_NOTE_THEMES[dId];
                  return (
                    <option key={dId} value={dId} className="bg-[#1a120d] text-[#efe4d4]">
                      {dId}: {t.name} ({t.badge})
                    </option>
                  );
                })}
              </select>
            </div>
          )}

          {/* iOS Date Filter Button */}
          <button
            onClick={() => setIsDateFilterOpen(true)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
              filterDate
                ? 'bg-amber-500/20 border-amber-500 text-amber-600 dark:text-amber-300'
                : isLightTheme1
                ? 'bg-stone-200/80 border-stone-300 text-stone-700 hover:border-stone-400'
                : 'bg-[#1a120d]/90 border-[#382518] text-[#d8c7b0] hover:border-[#c49257]/50'
            }`}
            title="Filter notes date-wise with iPhone scroll wheel"
          >
            <Calendar className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            <span>{filterDate ? `Date: ${filterDate}` : 'Date Filter'}</span>
          </button>

          <button
            onClick={() => setIsCreatingNew(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all active:scale-95 hover:opacity-95 text-slate-950"
            style={{
              backgroundColor: theme.accentHex,
              color: theme.id === '3' || theme.id === '7' ? '#040507' : '#ffffff',
            }}
          >
            <Plus className="w-4 h-4" />
            <span>New Notebook</span>
          </button>
        </div>
      </div>

      {/* Active Date Filter Banner */}
      {filterDate && (
        <div className="max-w-6xl mx-auto mb-6 flex items-center justify-between bg-amber-950/40 border border-amber-500/40 px-4 py-2.5 rounded-xl text-xs text-amber-200">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-amber-400" />
            <span>
              Filtering notes {filterMode === 'older' ? 'created on or before' : 'created exactly on'}: <b>{filterDate}</b> ({filteredNotebooks.length} notebooks found)
            </span>
          </div>
          <button
            type="button"
            onClick={handleClearDateFilter}
            className="px-3 py-1 rounded-lg bg-amber-500 text-stone-950 font-bold hover:bg-amber-400 cursor-pointer"
          >
            Clear Filter
          </button>
        </div>
      )}

      {/* Bookshelf Grid */}
      <div className="max-w-6xl mx-auto">
        {filteredNotebooks.length === 0 ? (
          <div
            className="themed-glass-card rounded-2xl border p-10 text-center max-w-md mx-auto my-8 space-y-3 shadow-sm"
            style={{
              backgroundColor: activeDesign !== '1' ? undefined : theme.windowBg,
              borderColor: activeDesign !== '1' ? 'var(--th-border)' : theme.windowBorder,
            }}
          >
            <h3 className={`text-base font-bold ${isLightTheme1 ? 'text-[#1e2227]' : 'text-[#efe4d4]'}`}>
              No notebooks yet
            </h3>
            <p className={`text-xs ${isLightTheme1 ? 'text-stone-500' : 'text-[#a69079]'}`}>
              Create your first personal notebook to start writing and organizing your notes.
            </p>
            <button
              type="button"
              onClick={() => setIsCreatingNew(true)}
              className="px-4 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 cursor-pointer text-white shadow-xs"
              style={{ backgroundColor: theme.accentHex }}
            >
              + Create New Notebook
            </button>
          </div>
        ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredNotebooks.map((nb) => {
            const isSelected = nb.id === activeNotebookId;
            return (
              <div
                key={nb.id}
                className="themed-glass-card flex flex-col items-center group relative p-4 rounded-xl transition-all duration-200 border shadow-md hover:scale-[1.01]"
                style={{
                  backgroundColor: activeDesign !== '1' ? undefined : theme.windowBg,
                  borderColor: isSelected ? 'var(--th-accent)' : activeDesign !== '1' ? 'var(--th-border)' : theme.windowBorder,
                }}
              >
                {/* 3D Realistic Classmate Notebook Cover */}
                <div className="mb-4">
                  <ClassmateCover
                    notebook={nb}
                    size="md"
                    isSelected={isSelected}
                    onClick={() => onSelectNotebook(nb.id)}
                  />
                </div>

                {/* Notebook Info & Action Buttons */}
                <div className="w-full text-center mt-2">
                  <h4
                    className={`font-bold text-sm truncate ${
                      isLightTheme1 ? 'text-[#1e2227]' : 'text-[#efe4d4]'
                    }`}
                  >
                    {nb.title}
                  </h4>
                  <div
                    className={`flex items-center justify-center gap-2 text-[11px] mt-0.5 font-mono ${
                      isLightTheme1 ? 'text-stone-500' : 'text-[#a69079]'
                    }`}
                  >
                    <span>{nb.subject}</span>
                    <span>·</span>
                    <span>{nb.pages.length} {nb.pages.length === 1 ? 'Page' : 'Pages'}</span>
                  </div>

                  {/* Actions Bar */}
                  <div
                    className={`flex items-center justify-center gap-2 mt-3 pt-3 border-t ${
                      isLightTheme1 ? 'border-stone-200' : 'border-[#382518]'
                    }`}
                  >
                    <button
                      onClick={() => onSelectNotebook(nb.id)}
                      className="px-3 py-1 rounded-lg text-xs font-semibold transition-all active:scale-95"
                      style={{
                        backgroundColor: isSelected
                          ? theme.accentHex
                          : isLightTheme1
                          ? '#e6e1d6'
                          : '#2b1e15',
                        color: isSelected
                          ? resolvedDark && theme.id === '1'
                            ? '#140e0a'
                            : theme.id === '3' || theme.id === '7'
                            ? '#040507'
                            : '#ffffff'
                          : isLightTheme1
                          ? '#292524'
                          : '#efe4d4',
                      }}
                    >
                      {isSelected ? 'Opened' : 'Open Note'}
                    </button>

                    <button
                      onClick={() => setEditingCoverNb(nb)}
                      title="Change Notebook Series & Ruling"
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        isLightTheme1
                          ? 'bg-stone-200/70 hover:bg-stone-300/80 text-stone-700'
                          : 'bg-[#2b1e15] hover:bg-[#382518] text-[#d8c7b0] hover:text-[#efe4d4]'
                      }`}
                    >
                      <Palette className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setEditingThumbNb(nb)}
                      title="Customize Cover Monogram, 10 Fonts & 100 Icons"
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        isLightTheme1
                          ? 'bg-amber-100/80 hover:bg-amber-200/80 text-amber-800'
                          : 'bg-[#2e1e12] hover:bg-[#412a19] text-amber-300 hover:text-amber-200'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onDeleteNotebook(nb.id)}
                      title="Delete Notebook"
                      className={`p-1.5 rounded-lg transition-colors ${
                        isLightTheme1
                          ? 'bg-stone-200/50 hover:bg-[#7f1d1d]/12 text-[#7f1d1d]'
                          : 'bg-[#2b1e15]/60 hover:bg-[#6e171b]/30 text-[#a93338] hover:text-[#cf4c52]'
                      }`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        )}
      </div>

      {/* Edit Notebook Cover Modal */}
      {editingCoverNb && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#1a120d] border border-stone-200 dark:border-[#382518] rounded-xl shadow-2xl max-w-xl w-full p-6 relative">
            <button
              onClick={() => setEditingCoverNb(null)}
              className="absolute right-4 top-4 text-stone-400 hover:text-stone-600 dark:hover:text-[#efe4d4]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-stone-900 dark:text-[#efe4d4] mb-1 flex items-center gap-2">
              <Palette className="w-5 h-5 text-sky-500" />
              <span>Customize Classmate Notebook Cover</span>
            </h3>
            <p className="text-xs text-stone-500 dark:text-[#a69079] mb-4">
              Select iconic Classmate cover designs, customize title label and paper defaults.
            </p>

            <form onSubmit={handleSaveCoverEdits} className="space-y-4">
              {/* Cover Theme Selection */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-[#d8c7b0] mb-2">
                  Iconic Cover Series:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {coverThemes.map((theme) => (
                    <button
                      type="button"
                      key={theme.id}
                      onClick={() => setEditingCoverNb({ ...editingCoverNb, coverTheme: theme.id as any })}
                      className={`text-left p-2.5 rounded-lg border text-xs transition-colors ${
                        editingCoverNb.coverTheme === theme.id
                          ? 'border-amber-500 bg-amber-50 dark:bg-[#2c1e14] text-amber-900 dark:text-amber-200 font-semibold ring-2 ring-amber-500/30'
                          : 'border-stone-200 dark:border-[#382518] hover:bg-stone-50 dark:hover:bg-[#241912] text-stone-700 dark:text-[#d8c7b0]'
                      }`}
                    >
                      <div className="font-medium">{theme.name}</div>
                      <div className="text-[10px] text-stone-500 dark:text-[#a69079] mt-0.5">{theme.badge}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title & Subtitle for Sticker Badge */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-[#d8c7b0] mb-1">
                    Cover Title Sticker:
                  </label>
                  <input
                    type="text"
                    value={editingCoverNb.coverTitle}
                    onChange={(e) => setEditingCoverNb({ ...editingCoverNb, coverTitle: e.target.value })}
                    className="w-full bg-stone-50 dark:bg-[#140e0a] px-3 py-1.5 rounded border border-stone-200 dark:border-[#382518] text-xs text-stone-800 dark:text-[#efe4d4] outline-none"
                    placeholder="e.g. PHARMACOLOGY"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-[#d8c7b0] mb-1">
                    Subtitle / Index:
                  </label>
                  <input
                    type="text"
                    value={editingCoverNb.coverSubtitle}
                    onChange={(e) => setEditingCoverNb({ ...editingCoverNb, coverSubtitle: e.target.value })}
                    className="w-full bg-stone-50 dark:bg-[#140e0a] px-3 py-1.5 rounded border border-stone-200 dark:border-[#382518] text-xs text-stone-800 dark:text-[#efe4d4] outline-none"
                    placeholder="e.g. Vol. 1 - Bone & Receptors"
                  />
                </div>
              </div>

              {/* Quick Launch Custom Monogram, 10 Designer Fonts & 100 Icons Editor */}
              <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-500/10 flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-stone-800 dark:text-[#efe4d4]">
                    Cover Logo, A–Z Designer Fonts &amp; 100 Icons
                  </div>
                  <div className="text-[10px] text-stone-500 dark:text-[#a69079]">
                    Customize monogram badge with 10-column colors and Shelf display mode
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingThumbNb(editingCoverNb)}
                  className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Customize Logo</span>
                </button>
              </div>

              {/* Paper Print Ruling */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-[#d8c7b0] mb-1">
                  Default Paper Ruling:
                </label>
                <select
                  value={editingCoverNb.paperType}
                  onChange={(e) => setEditingCoverNb({ ...editingCoverNb, paperType: e.target.value as any })}
                  className="w-full bg-stone-50 dark:bg-[#140e0a] px-3 py-1.5 rounded border border-stone-200 dark:border-[#382518] text-xs text-stone-800 dark:text-[#efe4d4] outline-none"
                >
                  <option value="ruled-thin">Thin Lines Ruled Paper (Single line with margin)</option>
                  <option value="box-ruled">Box Ruled / Grid Paper</option>
                  <option value="split-blank-ruled">One Side Blank, One Side Ruled (Observation File)</option>
                  <option value="dot-grid">Dot Grid (Bullet Journal)</option>
                  <option value="blank">Plain Blank Paper</option>
                </select>
              </div>

              {/* Paper Color Tint */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-[#d8c7b0] mb-1">
                  Paper Tint:
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {[
                    { id: 'beige', name: 'Beige', hex: '#fcf8ec' },
                    { id: 'white', name: 'White', hex: '#ffffff' },
                    { id: 'dark', name: 'Dark', hex: '#1a120d' },
                    { id: 'sepia', name: 'Sepia', hex: '#f5edd6' },
                    { id: 'mint', name: 'Mint', hex: '#f0fdf4' },
                    { id: 'ice-blue', name: 'Ice', hex: '#f0f9ff' },
                  ].map((c) => (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => setEditingCoverNb({ ...editingCoverNb, paperColor: c.id as any })}
                      className={`p-2 rounded border flex flex-col items-center gap-1 ${
                        editingCoverNb.paperColor === c.id
                          ? 'border-amber-500 ring-2 ring-amber-500/30'
                          : 'border-stone-200 dark:border-[#382518]'
                      }`}
                    >
                      <div className="w-5 h-5 rounded-full border border-stone-300 dark:border-[#4b3221]" style={{ backgroundColor: c.hex }} />
                      <span className="text-[10px] text-stone-600 dark:text-[#a69079]">{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-stone-200 dark:border-[#352317]">
                <button
                  type="button"
                  onClick={() => {
                    setEditingCoverNb({
                      ...editingCoverNb,
                      coverTheme: 'astronomy',
                      coverTitle: editingCoverNb.title.toUpperCase(),
                      coverSubtitle: 'Clinical Notes & Practical Records',
                      paperColor: 'beige',
                      paperType: 'ruled-thin',
                    });
                  }}
                  className="px-3 py-1.5 rounded text-xs text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 font-mono flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Revert Cover</span>
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingCoverNb(null)}
                    className="px-4 py-2 rounded text-xs text-stone-600 dark:text-[#a69079] hover:bg-stone-100 dark:hover:bg-[#2b1e15]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create New Notebook Modal */}
      {isCreatingNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#1a120d] border border-stone-200 dark:border-[#382518] rounded-xl shadow-2xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setIsCreatingNew(false)}
              className="absolute right-4 top-4 text-stone-400 hover:text-stone-600 dark:hover:text-[#efe4d4]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-stone-900 dark:text-[#efe4d4] mb-1 flex items-center gap-2">
              <Plus className="w-5 h-5 text-amber-500" />
              <span>Create New Medical Notebook</span>
            </h3>
            <p className="text-xs text-stone-500 dark:text-[#a69079] mb-4">
              Add a specialized note collection for {currentSubject}.
            </p>

            <form onSubmit={handleCreateNewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-[#d8c7b0] mb-1">
                  Notebook Title:
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={`e.g. ${currentSubject} - High-Yield Review`}
                  className="w-full bg-stone-50 dark:bg-[#140e0a] px-3 py-1.5 rounded border border-stone-200 dark:border-[#382518] text-xs text-stone-800 dark:text-[#efe4d4] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-[#d8c7b0] mb-1">
                  Cover Design (1 to 5):
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {coverThemes.map((th) => (
                    <button
                      type="button"
                      key={th.id}
                      onClick={() => setNewTheme(th.id)}
                      className={`p-2 rounded border text-xs text-left flex items-center gap-1.5 ${
                        newTheme === th.id
                          ? 'border-amber-500 bg-amber-50 dark:bg-[#2c1e14] text-amber-900 dark:text-amber-200 font-semibold'
                          : 'border-stone-200 dark:border-[#382518] text-stone-700 dark:text-[#d8c7b0]'
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 font-mono font-bold text-[10px] flex items-center justify-center shrink-0">
                        {th.num}
                      </span>
                      <span className="truncate">{th.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-[#d8c7b0] mb-1">
                  Paper Ruling:
                </label>
                <select
                  value={newPaperType}
                  onChange={(e) => setNewPaperType(e.target.value as any)}
                  className="w-full bg-stone-50 dark:bg-[#140e0a] px-3 py-1.5 rounded border border-stone-200 dark:border-[#382518] text-xs text-stone-800 dark:text-[#efe4d4] outline-none"
                >
                  <option value="ruled-thin">Thin Lines Ruled Paper</option>
                  <option value="box-ruled">Box Ruled / Grid Paper</option>
                  <option value="split-blank-ruled">One Side Blank, One Side Ruled</option>
                  <option value="dot-grid">Dot Grid</option>
                  <option value="blank">Plain Blank</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-[#d8c7b0] mb-1">
                  Paper Tint:
                </label>
                <div className="flex gap-2">
                  {[
                    { id: 'beige', name: 'Beige', hex: '#fcf8ec' },
                    { id: 'white', name: 'White', hex: '#ffffff' },
                    { id: 'dark', name: 'Dark', hex: '#1e293b' },
                    { id: 'mint', name: 'Mint', hex: '#f0fdf4' },
                    { id: 'sepia', name: 'Sepia', hex: '#f5edd6' },
                  ].map((c) => (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => setNewPaperColor(c.id as any)}
                      className={`p-1.5 rounded border flex-1 text-center ${
                        newPaperColor === c.id ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-stone-200 dark:border-[#382518]'
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full mx-auto mb-1 border" style={{ backgroundColor: c.hex }} />
                      <span className="text-[9px] text-stone-600 dark:text-[#a69079]">{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200 dark:border-[#352317]">
                <button
                  type="button"
                  onClick={() => setIsCreatingNew(false)}
                  className="px-4 py-2 rounded text-xs text-stone-600 dark:text-[#a69079] hover:bg-stone-100 dark:hover:bg-[#2b1e15]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold"
                >
                  Create Notebook
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* iOS STYLE WHEEL DRUM DATE PICKER MODAL */}
      {isDateFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-[#18110c] text-[#efe4d4] rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-[#382518] space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#352317]">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-400" />
                <h3 className="font-semibold text-lg text-[#efe4d4]">Select Date</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsDateFilterOpen(false)}
                className="text-[#a69079] hover:text-[#efe4d4]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Mode Selector (Older vs Exact) */}
            <div className="flex bg-[#120c08] p-1 rounded-xl text-xs border border-[#352317]">
              <button
                type="button"
                onClick={() => setFilterMode('older')}
                className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
                  filterMode === 'older' ? 'bg-amber-600 text-white font-bold' : 'text-stone-400'
                }`}
              >
                On or Before Date
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('on')}
                className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
                  filterMode === 'on' ? 'bg-amber-600 text-white font-bold' : 'text-stone-400'
                }`}
              >
                Exact Date Only
              </button>
            </div>

            {/* iOS Drum Wheel Columns Container */}
            <div className="relative py-4 bg-black/40 rounded-2xl border border-white/5 overflow-hidden">
              {/* Highlight Bar in Center */}
              <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 h-9 rounded-xl bg-white/10 border-y border-white/20 pointer-events-none" />

              <div className="grid grid-cols-3 gap-2 text-center">
                {/* Day Wheel */}
                <div className="h-40 overflow-y-auto custom-scrollbar snap-y snap-mandatory py-14">
                  {DAYS.map((d) => (
                    <div
                      key={d}
                      onClick={() => setWheelDay(d)}
                      className={`h-9 flex items-center justify-center snap-center cursor-pointer text-sm transition-all ${
                        wheelDay === d ? 'text-amber-400 font-bold scale-110' : 'text-stone-500'
                      }`}
                    >
                      {d}
                    </div>
                  ))}
                </div>

                {/* Month Wheel */}
                <div className="h-40 overflow-y-auto custom-scrollbar snap-y snap-mandatory py-14">
                  {MONTHS.map((m, idx) => (
                    <div
                      key={m}
                      onClick={() => setWheelMonth(idx)}
                      className={`h-9 flex items-center justify-center snap-center cursor-pointer text-sm transition-all ${
                        wheelMonth === idx ? 'text-amber-400 font-bold scale-110' : 'text-stone-500'
                      }`}
                    >
                      {m}
                    </div>
                  ))}
                </div>

                {/* Year Wheel */}
                <div className="h-40 overflow-y-auto custom-scrollbar snap-y snap-mandatory py-14">
                  {YEARS.map((y) => (
                    <div
                      key={y}
                      onClick={() => setWheelYear(y)}
                      className={`h-9 flex items-center justify-center snap-center cursor-pointer text-sm transition-all ${
                        wheelYear === y ? 'text-amber-400 font-bold scale-110' : 'text-stone-500'
                      }`}
                    >
                      {y}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Selected Date Summary */}
            <div className="text-center text-xs text-stone-400">
              Selected: <span className="text-amber-300 font-semibold">{wheelDay} {MONTHS[wheelMonth]} {wheelYear}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={handleClearDateFilter}
                className="flex-1 py-2.5 rounded-xl bg-stone-800 text-stone-300 text-xs font-semibold hover:bg-stone-700 cursor-pointer"
              >
                Clear Filter
              </button>
              <button
                type="button"
                onClick={handleApplyDateFilter}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 text-stone-950 text-xs font-bold hover:bg-amber-400 shadow-md cursor-pointer"
              >
                Apply Date
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Cover Monogram / A-Z / 100 Icons Modal */}
      <BookThumbnailEditorModal
        isOpen={Boolean(editingThumbNb)}
        itemTitle={editingThumbNb?.title || 'Notebook'}
        initialConfig={
          editingThumbNb?.thumbnail ||
          (editingThumbNb
            ? getDefaultThumbnail(editingThumbNb.title, editingThumbNb.coverColor || '#1e293b')
            : undefined)
        }
        defaultBgHex={editingThumbNb?.coverColor || '#1e293b'}
        onClose={() => setEditingThumbNb(null)}
        onSave={(cfg) => {
          if (!editingThumbNb) return;
          const updated: Notebook = { ...editingThumbNb, thumbnail: cfg };
          onUpdateNotebook(updated);
          if (editingCoverNb?.id === editingThumbNb.id) {
            setEditingCoverNb(updated);
          }
          setEditingThumbNb(null);
        }}
      />
    </div>
  );
};
