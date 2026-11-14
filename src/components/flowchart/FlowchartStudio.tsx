import React, { useState, useEffect, useRef } from 'react';
import {
  GitBranch,
  Plus,
  Search,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Minus,
  Download,
  Sparkles,
  Trash2,
  Check,
  X,
  FileText,
  Image as ImageIcon,
  Paperclip,
  Eye,
  Sliders,
  ChevronDown,
  ChevronUp,
  BookOpen,
  ArrowRight,
  ArrowDown,
  FileSpreadsheet,
  Presentation,
  Users,
  Palette,
  Columns,
  Tag,
} from 'lucide-react';
import {
  RoundColorColumnsPicker,
  UNIFIED_COLOR_COLUMNS,
} from '../common/RoundColorColumnsPicker';

export type BoxShape = 'rounded' | 'rectangle' | 'pill' | 'diamond' | 'hexagon' | 'card';
export type BoxSize = 'compact' | 'normal' | 'expanded';

export interface AttachedDocument {
  id: string;
  name: string;
  size: string;
  type: 'pdf' | 'doc' | 'sheet' | 'notes';
  url?: string;
  dateAdded: string;
}

export interface StudioFlowNode {
  id: string;
  parentId?: string | null;
  level: number;
  columnIndex?: number;
  phraseTag?: string;
  title: string;
  subtitle: string;
  description: string;
  pearls: string[];
  connections?: string[];
  color?: string;
  colorOverride?: boolean;
  shape?: BoxShape;
  size?: BoxSize;
  photoUrl?: string;
  documents?: AttachedDocument[];
  badge?: string;
  isStarred?: boolean;
}

export interface StudioFlowchart {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  nodesCount: number;
  levelsCount: number;
  infoCount: number;
  lastUpdated: string;
  levelColors?: Record<number, string>;
  columnColors?: Record<string, string>; // keyed `${level}-${colIdx}`
  childrenHeading?: string;
  notesHeading?: string;
  nodes: StudioFlowNode[];
}

export const COMMON_FLOWCHART_PHRASES = [
  'Start / Trigger',
  'Input / Data',
  'Process Step',
  'Decision Point',
  'Condition / Criteria',
  'Branch Pathway',
  'Parallel Action',
  'Loop / Re-evaluate',
  'Sub-routine',
  'Outcome / Endpoint',
  'Reference / Note',
];

export const SHAPE_OPTIONS: { id: BoxShape; label: string; desc: string }[] = [
  { id: 'rounded', label: 'Rounded Box', desc: 'Soft 16px radius' },
  { id: 'card', label: 'Accent Card', desc: 'Top colored border band' },
  { id: 'pill', label: 'Capsule Pill', desc: 'Fully rounded pill format' },
  { id: 'rectangle', label: 'Sharp Modern', desc: 'Crisp rectangle' },
  { id: 'diamond', label: 'Decision', desc: 'Decision chamfer box' },
  { id: 'hexagon', label: 'Hexagonal', desc: 'Geometric node' },
];

export const AVATAR_PRESETS = [
  { label: 'Process', icon: '⚡' },
  { label: 'Document', icon: '📄' },
  { label: 'Core', icon: '🎯' },
  { label: 'Analysis', icon: '🔬' },
  { label: 'Idea', icon: '💡' },
  { label: 'Trend', icon: '📈' },
  { label: 'Branch', icon: '🌿' },
  { label: 'Link', icon: '🔗' },
  { label: 'Bookmark', icon: '🔖' },
  { label: 'Milestone', icon: '🏁' },
];

const SEED_STUDIO_CHART_IDS = new Set([
  'chart-shiv-parivar',
  'chart-ikshvaku',
  'chart-acs',
  'chart-shock',
]);

// Contrast utilities for color columns
const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const clean = hex.replace('#', '').trim();
  if (clean.length !== 6) return null;
  const num = parseInt(clean, 16);
  if (Number.isNaN(num)) return null;
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
};

const getLuminance = (hex: string): number => {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0.5;
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const isColorLight = (hex: string): boolean => getLuminance(hex) > 0.52;

const hexWithAlpha = (hex: string, alpha: number): string => {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
};

interface ResolvedNodeStyle {
  effectiveColor: string | null;
  source: 'node' | 'column' | 'level' | 'default';
  cardBg: string;
  cardBorder: string;
  accentBar: string;
  badgeBg: string;
  badgeText: string;
  textPrimary: string;
  textSecondary: string;
}

const getResolvedNodeStyle = (
  chart: StudioFlowchart | undefined,
  node: StudioFlowNode,
  colIdx: number,
  isDark: boolean
): ResolvedNodeStyle => {
  const colKey = `${node.level}-${colIdx}`;
  const nodeColor = node.colorOverride && node.color ? node.color : undefined;
  const colColor = chart?.columnColors?.[colKey];
  const lvlColor = chart?.levelColors?.[node.level];

  const effectiveColor = nodeColor || colColor || lvlColor || null;
  const source: 'node' | 'column' | 'level' | 'default' = nodeColor
    ? 'node'
    : colColor
    ? 'column'
    : lvlColor
    ? 'level'
    : 'default';

  if (!effectiveColor) {
    return {
      effectiveColor: null,
      source: 'default',
      cardBg: isDark ? '#19120d' : '#ffffff',
      cardBorder: isDark ? '#3a2719' : '#d6cfc2',
      accentBar: isDark ? '#c99b5b' : '#a47c43',
      badgeBg: isDark ? '#2a1d14' : '#f3eee4',
      badgeText: isDark ? '#e8cfa6' : '#6c491e',
      textPrimary: isDark ? '#f5eadb' : '#1c1917',
      textSecondary: isDark ? '#bfa992' : '#57534e',
    };
  }

  const lightSwatch = isColorLight(effectiveColor);
  const badgeText = lightSwatch ? '#110c09' : '#ffffff';

  if (lightSwatch) {
    return {
      effectiveColor,
      source,
      cardBg: isDark ? hexWithAlpha(effectiveColor, 0.24) : hexWithAlpha(effectiveColor, 0.45),
      cardBorder: effectiveColor,
      accentBar: effectiveColor,
      badgeBg: effectiveColor,
      badgeText,
      textPrimary: isDark ? '#f9f2e7' : '#110c09',
      textSecondary: isDark ? '#dfd0be' : '#3a332c',
    };
  }

  return {
    effectiveColor,
    source,
    cardBg: isDark ? hexWithAlpha(effectiveColor, 0.22) : hexWithAlpha(effectiveColor, 0.14),
    cardBorder: effectiveColor,
    accentBar: effectiveColor,
    badgeBg: effectiveColor,
    badgeText,
    textPrimary: isDark ? '#f7efe3' : '#16120f',
    textSecondary: isDark ? '#d1c0ad' : '#44403c',
  };
};

interface FlowchartStudioProps {
  onBackToLibrary?: () => void;
  onSnipToNote?: (snip: any) => void;
}

export const FlowchartStudio: React.FC<FlowchartStudioProps> = ({
  onBackToLibrary,
}) => {
  const [charts, setCharts] = useState<StudioFlowchart[]>(() => {
    try {
      const saved = localStorage.getItem('medden_studio_flowcharts');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const cleaned = parsed
            .filter((c: any) => !SEED_STUDIO_CHART_IDS.has(c?.id))
            .map((c: any) => ({
              ...c,
              infoCount: c.infoCount ?? c.storiesCount ?? c.nodes?.length ?? 0,
              levelColors: c.levelColors || {},
              columnColors: c.columnColors || {},
              childrenHeading: c.childrenHeading || 'Connected Next Steps',
              notesHeading: c.notesHeading || 'Key Notes & Criteria',
            }));
          if (cleaned.length !== parsed.length) {
            localStorage.setItem('medden_studio_flowcharts', JSON.stringify(cleaned));
          }
          return cleaned;
        }
      }
    } catch {}
    return [];
  });

  const [activeChartId, setActiveChartId] = useState<string>(() => charts[0]?.id || '');

  const activeChart: StudioFlowchart | undefined =
    charts.find((c) => c.id === activeChartId) || charts[0];

  const [selectedNodeId, setSelectedNodeId] = useState<string>(() => {
    return activeChart?.nodes?.[0]?.id || '';
  });

  const activeNode = activeChart?.nodes?.find((n) => n.id === selectedNodeId) || activeChart?.nodes?.[0];

  const [activeViewMode, setActiveViewMode] = useState<'tree' | 'info'>('tree');
  const [infoLevelFilter, setInfoLevelFilter] = useState<'all' | number>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Bottom drawers
  const [chartsDrawerOpen, setChartsDrawerOpen] = useState(false);
  const [inspectorDrawerOpen, setInspectorDrawerOpen] = useState(false);
  const [isDarkThemeMode, setIsDarkThemeMode] = useState<boolean>(() =>
    typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') : false
  );

  // Batch Box Add Count (1..10) for sideways / below additions
  const [addBoxCount, setAddBoxCount] = useState<number>(1);
  // Popover state for level / column color picker on canvas
  const [activeColorPopover, setActiveColorPopover] = useState<{
    kind: 'level' | 'column';
    level: number;
    colIdx?: number;
  } | null>(null);

  const [infoBanner, setInfoBanner] = useState<string | null>(null);
  const showBanner = (msg: string) => {
    setInfoBanner(msg);
    setTimeout(() => setInfoBanner((prev) => (prev === msg ? null : prev)), 2800);
  };

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const syncDark = () => setIsDarkThemeMode(document.documentElement.classList.contains('dark'));
    syncDark();
    const observer = new MutationObserver(syncDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const canvasPaneRef = useRef<HTMLDivElement | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Modals & Popovers
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const [newChartModalOpen, setNewChartModalOpen] = useState(false);
  const [photoPickerOpen, setPhotoPickerOpen] = useState(false);
  const [docUploadOpen, setDocUploadOpen] = useState(false);
  const [newChartForm, setNewChartForm] = useState({ title: '', category: '', subtitle: '' });
  const [newDocForm, setNewDocForm] = useState({ name: '', size: '1.2 MB', type: 'pdf' as const });
  const [newPhotoInput, setNewPhotoInput] = useState('');
  const [newNoteText, setNewNoteText] = useState('');
  const [geminiFeedback, setGeminiFeedback] = useState<string | null>(null);

  const saveCharts = (updatedCharts: StudioFlowchart[]) => {
    setCharts(updatedCharts);
    localStorage.setItem('medden_studio_flowcharts', JSON.stringify(updatedCharts));
  };

  const updateActiveChart = (updater: (chart: StudioFlowchart) => StudioFlowchart) => {
    if (!activeChart) return;
    const updated = charts.map((c) => (c.id === activeChart.id ? updater(c) : c));
    saveCharts(updated);
  };

  // Level & Column Color Handlers (using shared RoundColorColumnsPicker)
  const handleUpdateLevelColor = (level: number, color: string) => {
    updateActiveChart((c) => ({
      ...c,
      levelColors: { ...(c.levelColors || {}), [level]: color },
    }));
  };

  const handleClearLevelColor = (level: number) => {
    updateActiveChart((c) => {
      const next = { ...(c.levelColors || {}) };
      delete next[level];
      return { ...c, levelColors: next };
    });
  };

  const handleUpdateColumnColor = (level: number, colIdx: number, color: string) => {
    const key = `${level}-${colIdx}`;
    updateActiveChart((c) => ({
      ...c,
      columnColors: { ...(c.columnColors || {}), [key]: color },
    }));
  };

  const handleClearColumnColor = (level: number, colIdx: number) => {
    const key = `${level}-${colIdx}`;
    updateActiveChart((c) => {
      const next = { ...(c.columnColors || {}) };
      delete next[key];
      return { ...c, columnColors: next };
    });
  };

  // Node Color / Shape / Text Handlers
  const handleUpdateNodeColor = (hex: string) => {
    if (!activeChart || !activeNode) return;
    updateActiveChart((c) => ({
      ...c,
      nodes: c.nodes.map((n) => (n.id === activeNode.id ? { ...n, color: hex, colorOverride: true } : n)),
    }));
  };

  const handleClearNodeColorOverride = () => {
    if (!activeChart || !activeNode) return;
    updateActiveChart((c) => ({
      ...c,
      nodes: c.nodes.map((n) => (n.id === activeNode.id ? { ...n, colorOverride: false, color: undefined } : n)),
    }));
  };

  const handleUpdateNodeShape = (shape: BoxShape) => {
    if (!activeChart || !activeNode) return;
    updateActiveChart((c) => ({
      ...c,
      nodes: c.nodes.map((n) => (n.id === activeNode.id ? { ...n, shape } : n)),
    }));
  };

  const handleUpdateNodeText = (
    field: 'title' | 'subtitle' | 'description' | 'phraseTag',
    val: string
  ) => {
    if (!activeChart || !activeNode) return;
    updateActiveChart((c) => ({
      ...c,
      nodes: c.nodes.map((n) => (n.id === activeNode.id ? { ...n, [field]: val } : n)),
    }));
  };

  const handleUpdateChartHeading = (field: 'childrenHeading' | 'notesHeading', val: string) => {
    updateActiveChart((c) => ({ ...c, [field]: val }));
  };

  const handleAddNodeNote = () => {
    if (!activeChart || !activeNode || !newNoteText.trim()) return;
    updateActiveChart((c) => ({
      ...c,
      nodes: c.nodes.map((n) =>
        n.id === activeNode.id ? { ...n, pearls: [...(n.pearls || []), newNoteText.trim()] } : n
      ),
    }));
    setNewNoteText('');
  };

  const handleUpdateNodeNote = (idx: number, val: string) => {
    if (!activeChart || !activeNode) return;
    updateActiveChart((c) => ({
      ...c,
      nodes: c.nodes.map((n) =>
        n.id === activeNode.id
          ? { ...n, pearls: n.pearls.map((p, i) => (i === idx ? val : p)) }
          : n
      ),
    }));
  };

  const handleDeleteNodeNote = (idx: number) => {
    if (!activeChart || !activeNode) return;
    updateActiveChart((c) => ({
      ...c,
      nodes: c.nodes.map((n) =>
        n.id === activeNode.id
          ? { ...n, pearls: n.pearls.filter((_, i) => i !== idx) }
          : n
      ),
    }));
  };

  const handleAddPhoto = (urlOrEmoji: string) => {
    if (!activeChart || !activeNode) return;
    updateActiveChart((c) => ({
      ...c,
      nodes: c.nodes.map((n) => (n.id === activeNode.id ? { ...n, photoUrl: urlOrEmoji } : n)),
    }));
    setPhotoPickerOpen(false);
    setNewPhotoInput('');
  };

  const handleRemovePhoto = () => {
    if (!activeChart || !activeNode) return;
    updateActiveChart((c) => ({
      ...c,
      nodes: c.nodes.map((n) => (n.id === activeNode.id ? { ...n, photoUrl: undefined } : n)),
    }));
  };

  const handleAttachDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChart || !activeNode || !newDocForm.name.trim()) return;
    const newDoc: AttachedDocument = {
      id: `doc-${Date.now()}`,
      name: newDocForm.name.trim(),
      size: newDocForm.size || '1.5 MB',
      type: newDocForm.type,
      dateAdded: 'Today',
    };
    updateActiveChart((c) => ({
      ...c,
      nodes: c.nodes.map((n) =>
        n.id === activeNode.id ? { ...n, documents: [...(n.documents || []), newDoc] } : n
      ),
    }));
    setDocUploadOpen(false);
    setNewDocForm({ name: '', size: '1.2 MB', type: 'pdf' });
  };

  const handleRemoveDocument = (docId: string) => {
    if (!activeChart || !activeNode || !activeNode.documents) return;
    updateActiveChart((c) => ({
      ...c,
      nodes: c.nodes.map((n) =>
        n.id === activeNode.id
          ? { ...n, documents: (n.documents || []).filter((d) => d.id !== docId) }
          : n
      ),
    }));
  };

  // Add N boxes Sideways (same level) or Below (next level, unlimited levels)
  const handleAddBoxes = (
    anchorNode: StudioFlowNode,
    direction: 'sideways' | 'below',
    count = addBoxCount
  ) => {
    if (!activeChart) return;
    const safeCount = Math.max(1, Math.min(12, count));
    const targetLevel = direction === 'below' ? anchorNode.level + 1 : anchorNode.level;
    const existingSameLevel = activeChart.nodes.filter((n) => n.level === targetLevel);
    const createdNodes: StudioFlowNode[] = [];

    for (let i = 0; i < safeCount; i++) {
      const idx = existingSameLevel.length + i + 1;
      createdNodes.push({
        id: `node-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`,
        parentId: direction === 'below' ? anchorNode.id : anchorNode.parentId || null,
        level: targetLevel,
        columnIndex: idx - 1,
        phraseTag: direction === 'below' ? 'Process Step' : anchorNode.phraseTag || 'Branch Pathway',
        title:
          direction === 'below'
            ? `Next Step ${idx}`
            : `Branch ${idx}`,
        subtitle: `Level ${targetLevel} · Column ${idx}`,
        description: 'Document key criteria, body content, or actions here.',
        pearls: ['Add supporting note or reference here.'],
        connections: [anchorNode.title],
        shape: anchorNode.shape || 'rounded',
        size: 'normal',
        badge: `L${targetLevel}`,
      });
    }

    let nextNodes: StudioFlowNode[];
    if (direction === 'sideways') {
      // Insert right after the anchor node so sideways boxes sit neatly adjacent in order
      const anchorIdx = activeChart.nodes.findIndex((n) => n.id === anchorNode.id);
      nextNodes = [
        ...activeChart.nodes.slice(0, anchorIdx + 1),
        ...createdNodes,
        ...activeChart.nodes.slice(anchorIdx + 1),
      ];
    } else {
      nextNodes = [...activeChart.nodes, ...createdNodes];
    }

    updateActiveChart((c) => ({
      ...c,
      nodes: nextNodes,
      nodesCount: nextNodes.length,
      levelsCount: Math.max(...nextNodes.map((n) => n.level), 1),
      infoCount: nextNodes.length,
    }));

    setSelectedNodeId(createdNodes[0].id);
    showBanner(
      `Added ${safeCount} box${safeCount > 1 ? 'es' : ''} ${
        direction === 'sideways' ? `sideways on Level ${targetLevel}` : `below at Level ${targetLevel}`
      }`
    );
  };

  const handleAddChildNode = () => {
    if (!activeChart || !activeNode) return;
    handleAddBoxes(activeNode, 'below', addBoxCount);
  };

  const handleDeleteNode = (nodeId: string) => {
    if (!activeChart) return;
    const updatedNodes = activeChart.nodes
      .filter((n) => n.id !== nodeId)
      .map((n) => (n.parentId === nodeId ? { ...n, parentId: null } : n));
    updateActiveChart((c) => ({
      ...c,
      nodes: updatedNodes,
      nodesCount: updatedNodes.length,
      levelsCount: updatedNodes.length > 0 ? Math.max(...updatedNodes.map((n) => n.level), 1) : 1,
      infoCount: updatedNodes.length,
    }));
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(updatedNodes[0]?.id || '');
    }
  };

  const handleAddRootBox = () => {
    if (!activeChart) return;
    const rootNode: StudioFlowNode = {
      id: `n_${Date.now()}`,
      title: 'Root Topic',
      subtitle: 'Start here',
      description: 'Click to edit heading, subheading, body & color.',
      level: 1,
      parentId: null,
      phraseTag: COMMON_FLOWCHART_PHRASES[0] || 'Main Topic',
      shape: 'rounded',
      pearls: [],
    };
    updateActiveChart((c) => ({
      ...c,
      nodes: [rootNode],
      nodesCount: 1,
      levelsCount: 1,
      infoCount: 1,
    }));
    setSelectedNodeId(rootNode.id);
    setInspectorDrawerOpen(true);
  };

  const handleGeminiExpand = () => {
    if (!activeChart || !activeNode) {
      setNewChartModalOpen(true);
      return;
    }
    setGeminiFeedback('Generating next boxes...');
    setTimeout(() => {
      handleAddBoxes(activeNode, 'below', addBoxCount);
      setGeminiFeedback('Next level boxes added!');
      setTimeout(() => setGeminiFeedback(null), 2600);
    }, 650);
  };

  const handleExport = (format: string) => {
    setExportDropdownOpen(false);
    if (!activeChart) return;
    if (format === 'JSON') {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(activeChart, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `${activeChart.title.replace(/\s+/g, '_')}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } else {
      window.print();
    }
  };

  // Dynamic unlimited levels 1..N
  const chartNodes = activeChart?.nodes || [];
  const levelNumbers: number[] = Array.from(new Set(chartNodes.map((n) => n.level))).sort((a, b) => a - b);
  const totalLevels = levelNumbers.length > 0 ? Math.max(...levelNumbers) : 1;

  return (
    <div
      className={`flex flex-col h-full w-full bg-[#fcfbf8] dark:bg-[#110c09] text-stone-900 dark:text-[#efe4d4] select-text overflow-hidden ${
        isFullscreen ? 'fixed inset-0 z-50' : 'relative'
      }`}
    >
      <style>{`
        @keyframes fcDrawerSlideUp {
          from { opacity: 0; transform: translateY(20px) scaleY(0.95); }
          to { opacity: 1; transform: translateY(0) scaleY(1); }
        }
        .fc-drawer-slide-up {
          transform-origin: bottom;
          animation: fcDrawerSlideUp 0.22s cubic-bezier(0.22, 1, 0.36, 1);
        }
      `}</style>

      {/* ========================================================================= */}
      {/* 1. TOP STUDIO HEADER BAR                                                  */}
      {/* ========================================================================= */}
      <header className="px-4 py-2.5 border-b border-stone-200/90 dark:border-[#382518] bg-[#f8f6f0] dark:bg-[#140e0a] flex items-center justify-between gap-2 shrink-0 shadow-2xs flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {onBackToLibrary && (
            <button
              type="button"
              onClick={onBackToLibrary}
              className="p-1.5 rounded-xl bg-stone-200/70 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <ArrowRight className="w-3.5 h-3.5 rotate-180" />
              <span className="hidden sm:inline">Back to Shelf</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setNewChartModalOpen(true)}
            className="themed-accent-btn px-3 py-1.5 rounded-xl bg-[#A47C43] hover:bg-[#8e6834] text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Flowchart</span>
          </button>
        </div>

        <div className="flex items-center gap-2.5">
          {infoBanner && (
            <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-800 dark:text-amber-200 text-xs font-semibold">
              {infoBanner}
            </span>
          )}

          <button
            type="button"
            onClick={handleGeminiExpand}
            className="px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 via-[#A47C43]/20 to-[#8f5f2c]/15 hover:from-amber-500/25 text-stone-800 dark:text-amber-200 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Fill next level</span>
          </button>

          {/* Export Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
              className="px-3.5 py-1.5 rounded-full bg-[#1e2530] text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-[#110c09] dark:hover:bg-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
              <ChevronDown className="w-3 h-3 opacity-70" />
            </button>

            {exportDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-56 rounded-2xl bg-[#18110c] border border-[#382518] shadow-2xl p-2 z-50 text-[#efe4d4] text-xs space-y-1">
                <button
                  type="button"
                  onClick={() => handleExport('PDF')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#2a1d14] text-left cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-[#c94a4f]" />
                  <div>
                    <div className="font-semibold text-xs">PDF</div>
                    <div className="text-[10px] text-[#a69079]">Tree + full details</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleExport('Word')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#2a1d14] text-left cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-blue-400" />
                  <div>
                    <div className="font-semibold text-xs">Word</div>
                    <div className="text-[10px] text-[#a69079]">.docx document format</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleExport('PowerPoint')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#2a1d14] text-left cursor-pointer"
                >
                  <Presentation className="w-4 h-4 text-amber-400" />
                  <div>
                    <div className="font-semibold text-xs">PowerPoint</div>
                    <div className="text-[10px] text-[#a69079]">Editable tree + slides</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleExport('Excel')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#2a1d14] text-left cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 text-amber-400" />
                  <div>
                    <div className="font-semibold text-xs">Excel</div>
                    <div className="text-[10px] text-[#a69079]">Nodes, tree & steps</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleExport('PNG image')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#2a1d14] text-left cursor-pointer"
                >
                  <ImageIcon className="w-4 h-4 text-purple-400" />
                  <div>
                    <div className="font-semibold text-xs">PNG image</div>
                    <div className="text-[10px] text-[#a69079]">High resolution snapshot</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleExport('JSON')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#2a1d14] text-left cursor-pointer border-t border-[#382518] mt-1 pt-1.5"
                >
                  <Download className="w-4 h-4 text-[#a69079]" />
                  <div>
                    <div className="font-semibold text-xs">JSON Backup</div>
                    <div className="text-[10px] text-[#a69079]">Raw flowchart dataset</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. WORKSPACE + ENDLESS SCROLLBAR CANVAS                                   */}
      {/* ========================================================================= */}
      <div className="flex-1 flex overflow-hidden relative">
        <main
          ref={canvasPaneRef}
          className="flex-1 min-w-0 flex flex-col bg-[#fcfbf8] dark:bg-[#0e0907] overflow-hidden relative"
        >
          {/* Chart Header Bar */}
          {activeChart ? (
            <div className="px-4 sm:px-6 py-3 border-b border-stone-200/80 dark:border-[#382518] bg-[#fdfdfb] dark:bg-[#140e0a] flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="min-w-0 flex-1">
                <h1 className="font-serif font-bold tracking-tight text-xl sm:text-2xl text-stone-900 dark:text-[#efe4d4] flex items-center gap-2 flex-wrap">
                  <span className="truncate">{activeChart.title}</span>
                  {geminiFeedback && (
                    <span className="text-xs font-sans font-normal text-amber-600 dark:text-amber-300 animate-pulse">
                      {geminiFeedback}
                    </span>
                  )}
                </h1>
                <p className="text-xs text-stone-500 dark:text-[#a69079] line-clamp-1">
                  {activeChart.subtitle} · Endless canvas (scroll horizontally & vertically)
                </p>
              </div>

              {/* View Switcher Tabs (Tree vs Info) */}
              <div className="flex items-center gap-1 bg-stone-200/70 dark:bg-[#211711] p-1 rounded-xl shrink-0 border border-stone-300/80 dark:border-[#382518]">
                <button
                  type="button"
                  onClick={() => setActiveViewMode('tree')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeViewMode === 'tree'
                      ? 'bg-white dark:bg-[#efe4d4] text-stone-900 dark:text-[#110c09] shadow-xs'
                      : 'text-stone-600 dark:text-[#a69079] hover:text-stone-900 dark:hover:text-[#efe4d4]'
                  }`}
                >
                  <GitBranch className="w-3.5 h-3.5" />
                  <span>Tree</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveViewMode('info')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeViewMode === 'info'
                      ? 'bg-white dark:bg-[#efe4d4] text-stone-900 dark:text-[#110c09] shadow-xs'
                      : 'text-stone-600 dark:text-[#a69079] hover:text-stone-900 dark:hover:text-[#efe4d4]'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Info</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-stone-300/70 dark:bg-[#382518] text-stone-800 dark:text-[#d8c7b0]">
                    {activeChart.nodes.length}
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <div className="px-6 py-3 border-b border-stone-200/80 dark:border-[#382518] bg-[#fdfdfb] dark:bg-[#140e0a] flex items-center justify-between gap-3 shrink-0">
              <div>
                <h1 className="font-serif font-bold text-lg text-stone-900 dark:text-[#efe4d4]">
                  Flowchart Studio
                </h1>
                <p className="text-xs text-stone-500 dark:text-[#a69079]">
                  Unlimited levels, per-level &amp; per-column color coding, endless scrollable canvas
                </p>
              </div>
              <button
                type="button"
                onClick={() => setNewChartModalOpen(true)}
                className="themed-accent-btn px-3.5 py-1.5 rounded-full bg-[#A47C43] hover:bg-[#8e6834] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Flowchart</span>
              </button>
            </div>
          )}

          {/* Sub-Header: Search + Box Add Count Selector (1..N) + Zoom */}
          <div className="px-4 sm:px-6 py-2 border-b border-stone-200/70 dark:border-[#352317] bg-stone-50/75 dark:bg-[#120c08] flex flex-wrap items-center justify-between gap-2.5 shrink-0 text-xs">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[180px] max-w-xs">
              <Search className="w-3.5 h-3.5 text-stone-400 dark:text-[#a69079] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={
                  activeViewMode === 'tree'
                    ? 'Search boxes, phrases, text...'
                    : 'Search info cards...'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-[#1a120d] border border-stone-300/80 dark:border-[#382518] rounded-xl pl-8 pr-7 py-1.5 text-xs text-stone-900 dark:text-[#efe4d4] outline-none focus:border-amber-500 shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 dark:hover:text-[#efe4d4] cursor-pointer p-0.5"
                  title="Clear search"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Number of Boxes to Add (Sideways or Below) */}
            <div className="flex items-center gap-2 flex-wrap bg-white dark:bg-[#1a120d] border border-stone-300/80 dark:border-[#382518] rounded-xl px-2.5 py-1">
              <span className="text-[11px] font-semibold text-stone-600 dark:text-[#bfa992]">
                Boxes per +Side/+Below click:
              </span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((cnt) => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => setAddBoxCount(cnt)}
                    className={`w-6 h-6 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      addBoxCount === cnt
                        ? 'themed-accent-btn bg-[#A47C43] text-white shadow-xs'
                        : 'bg-stone-100 dark:bg-[#231912] text-stone-700 dark:text-[#d8c7b0] hover:bg-stone-200 dark:hover:bg-[#322318]'
                    }`}
                  >
                    {cnt}
                  </button>
                ))}
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={addBoxCount}
                  onChange={(e) => setAddBoxCount(Math.max(1, Math.min(12, Number(e.target.value) || 1)))}
                  className="w-11 px-1.5 py-0.5 rounded-lg bg-stone-100 dark:bg-[#231912] border border-stone-300 dark:border-[#382518] text-center font-mono text-[11px] font-bold outline-none"
                  title="Custom number of boxes to add"
                />
              </div>
            </div>

            {/* Right Controls: Zoom or Info Filter */}
            {activeViewMode === 'tree' ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-white dark:bg-[#1a120d] border border-stone-300 dark:border-[#382518] rounded-xl p-1">
                  <button
                    type="button"
                    onClick={() => setZoomLevel((z) => Math.max(50, z - 15))}
                    className="p-1 rounded text-stone-500 dark:text-[#a69079] hover:text-stone-900 dark:hover:text-[#efe4d4] cursor-pointer"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] font-mono px-1 font-semibold min-w-[36px] text-center">
                    {zoomLevel}%
                  </span>
                  <button
                    type="button"
                    onClick={() => setZoomLevel((z) => Math.min(160, z + 15))}
                    className="p-1 rounded text-stone-500 dark:text-[#a69079] hover:text-stone-900 dark:hover:text-[#efe4d4] cursor-pointer"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => setInfoLevelFilter('all')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold cursor-pointer ${
                    infoLevelFilter === 'all'
                      ? 'themed-accent-btn bg-[#5c351c] text-white dark:bg-[#a47c43]'
                      : 'bg-white dark:bg-[#1a120d] text-stone-600 dark:text-[#a69079] border border-stone-300 dark:border-[#382518]'
                  }`}
                >
                  All levels
                </button>
                {levelNumbers.map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setInfoLevelFilter(lvl)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold cursor-pointer ${
                      infoLevelFilter === lvl
                        ? 'themed-accent-btn bg-[#5c351c] text-white dark:bg-[#a47c43]'
                        : 'bg-white dark:bg-[#1a120d] text-stone-600 dark:text-[#a69079] border border-stone-300 dark:border-[#382518]'
                    }`}
                  >
                    L{lvl}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ===================================================================== */}
          {/* ENDLESS SCROLLBAR CANVAS (Both Horizontal & Vertical Overflow)        */}
          {/* ===================================================================== */}
          <div
            className="flex-1 overflow-auto p-6 relative custom-scrollbar bg-[#f8f5ee] dark:bg-[#0e0907]"
            style={{ overflowX: 'auto', overflowY: 'auto' }}
          >
            {!activeChart ? (
              <div className="h-full flex items-center justify-center p-6">
                <div className="max-w-md w-full rounded-3xl border border-stone-200 dark:border-[#382518] bg-white/85 dark:bg-[#160f0b] p-8 text-center space-y-4 shadow-lg">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-[#8f5f2c] dark:text-[#d4a373] flex items-center justify-center mx-auto">
                    <GitBranch className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-[#efe4d4]">
                      No flowcharts yet
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-[#a69079]">
                      Build your first flowchart with endless horizontal &amp; vertical canvas, per-level &amp; per-column colors.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNewChartModalOpen(true)}
                    className="themed-accent-btn px-5 py-2.5 rounded-full bg-[#A47C43] hover:bg-[#8e6834] text-white text-xs font-semibold inline-flex items-center gap-2 shadow-sm cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create First Flowchart</span>
                  </button>
                </div>
              </div>
            ) : activeChart.nodes.length === 0 ? (
              <div className="h-full flex items-center justify-center p-6">
                <div className="max-w-sm w-full rounded-3xl border border-stone-200 dark:border-[#382518] bg-white/85 dark:bg-[#160f0b] p-7 text-center space-y-3 shadow-md">
                  <div className="w-11 h-11 rounded-2xl bg-amber-500/15 text-[#8f5f2c] dark:text-[#d4a373] flex items-center justify-center mx-auto">
                    <GitBranch className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-serif font-bold text-base text-stone-900 dark:text-[#efe4d4]">
                      Canvas is empty
                    </h4>
                    <p className="text-xs text-stone-500 dark:text-[#a69079]">
                      Add a starting box to begin building your flowchart.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddRootBox}
                    className="themed-accent-btn px-4 py-2 rounded-full bg-[#A47C43] hover:bg-[#8e6834] text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add First Box</span>
                  </button>
                </div>
              </div>
            ) : activeViewMode === 'tree' ? (
              <div
                className="min-w-max min-h-max pb-32 pr-32 transition-transform duration-150 origin-top-left"
                style={{
                  transform: zoomLevel === 100 ? undefined : `scale(${zoomLevel / 100})`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '28px',
                }}
              >
                {levelNumbers.map((lvl, lvlIdx) => {
                  const nodesInLevel = chartNodes.filter((n) => n.level === lvl);
                  const levelColor = activeChart.levelColors?.[lvl];
                  const isLevelPopoverOpen =
                    activeColorPopover?.kind === 'level' && activeColorPopover.level === lvl;

                  return (
                    <React.Fragment key={lvl}>
                      {lvlIdx > 0 && (
                        <div className="flex items-center pl-48 -my-4 pointer-events-none">
                          <div
                            className="w-0.5 h-8"
                            style={{ backgroundColor: levelColor || (isDarkThemeMode ? '#a47c43' : '#8f5f2c') }}
                          />
                        </div>
                      )}

                      <div className="flex items-start gap-5 min-w-max">
                        {/* Sticky Left Level Control Card with Level Color Picker */}
                        <div className="w-36 shrink-0 relative pt-2">
                          <div
                            className="p-2.5 rounded-xl border text-center space-y-1.5 shadow-2xs"
                            style={{
                              backgroundColor: levelColor
                                ? hexWithAlpha(levelColor, isDarkThemeMode ? 0.22 : 0.16)
                                : isDarkThemeMode
                                ? '#1b130e'
                                : '#ffffff',
                              borderColor: levelColor || (isDarkThemeMode ? '#382518' : '#d6cfc2'),
                            }}
                          >
                            <div className="text-[11px] font-mono font-bold uppercase tracking-wider">
                              LEVEL {lvl}
                            </div>
                            <div className="text-[10px] text-stone-500 dark:text-[#bfa992]">
                              {nodesInLevel.length} {nodesInLevel.length === 1 ? 'box' : 'boxes'}
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                setActiveColorPopover(
                                  isLevelPopoverOpen ? null : { kind: 'level', level: lvl }
                                )
                              }
                              className="w-full px-2 py-1 rounded-lg bg-white/80 dark:bg-[#2a1d14] border border-stone-300 dark:border-[#4b3322] text-[10px] font-semibold flex items-center justify-center gap-1 hover:border-[#A47C43] cursor-pointer"
                              title="Pick color for entire Level"
                            >
                              <span
                                className="w-2.5 h-2.5 rounded-full border border-black/20"
                                style={{ backgroundColor: levelColor || '#a47c43' }}
                              />
                              <span>Level Color</span>
                            </button>
                          </div>

                          {/* Level Color Picker Popover using Shared Color Columns */}
                          {isLevelPopoverOpen && (
                            <div className="absolute left-0 top-full mt-2 z-40 w-[260px] p-3 rounded-2xl bg-white dark:bg-[#1a120d] border border-stone-300 dark:border-[#4b3322] shadow-2xl space-y-2">
                              <div className="flex items-center justify-between text-[11px] font-bold">
                                <span>Level {lvl} Color</span>
                                <div className="flex items-center gap-1.5">
                                  {levelColor && (
                                    <button
                                      type="button"
                                      onClick={() => handleClearLevelColor(lvl)}
                                      className="text-[10px] text-red-500 hover:underline cursor-pointer"
                                    >
                                      Reset
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => setActiveColorPopover(null)}
                                    className="p-0.5 rounded hover:bg-stone-200 dark:hover:bg-[#2a1d14] cursor-pointer"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                              <RoundColorColumnsPicker
                                columns={UNIFIED_COLOR_COLUMNS}
                                selectedColor={levelColor}
                                onSelectColor={(col) => handleUpdateLevelColor(lvl, col)}
                                showStandardRow
                                swatchSizeClass="w-4 h-4"
                              />
                            </div>
                          )}
                        </div>

                        {/* Horizontal Non-Wrapping Endless Track of Columns in this Level */}
                        <div className="flex items-start gap-6 min-w-max">
                          {nodesInLevel.map((node, colIdx) => {
                            const colKey = `${lvl}-${colIdx}`;
                            const colColor = activeChart.columnColors?.[colKey];
                            const resolved = getResolvedNodeStyle(activeChart, node, colIdx, isDarkThemeMode);
                            const isColPopoverOpen =
                              activeColorPopover?.kind === 'column' &&
                              activeColorPopover.level === lvl &&
                              activeColorPopover.colIdx === colIdx;

                            return (
                              <div key={node.id} className="flex flex-col items-center relative">
                                {/* Per-Column Header Pill + Color Picker */}
                                <div className="mb-2 flex items-center gap-1.5 relative">
                                  <span className="text-[10px] font-mono text-stone-500 dark:text-[#a69079] px-2 py-0.5 rounded-md bg-stone-200/70 dark:bg-[#211711]">
                                    Col {colIdx + 1}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setActiveColorPopover(
                                        isColPopoverOpen
                                          ? null
                                          : { kind: 'column', level: lvl, colIdx }
                                      )
                                    }
                                    className="px-2 py-0.5 rounded-md bg-white dark:bg-[#1e1510] border border-stone-300 dark:border-[#4b3322] text-[10px] font-semibold flex items-center gap-1 hover:border-[#A47C43] cursor-pointer"
                                    title={`Pick color for Level ${lvl}, Column ${colIdx + 1}`}
                                  >
                                    <span
                                      className="w-2.5 h-2.5 rounded-full border border-black/20"
                                      style={{ backgroundColor: colColor || levelColor || '#a47c43' }}
                                    />
                                    <Columns className="w-2.5 h-2.5 opacity-70" />
                                  </button>

                                  {isColPopoverOpen && (
                                    <div className="absolute left-0 top-full mt-1.5 z-40 w-[260px] p-3 rounded-2xl bg-white dark:bg-[#1a120d] border border-stone-300 dark:border-[#4b3322] shadow-2xl space-y-2">
                                      <div className="flex items-center justify-between text-[11px] font-bold">
                                        <span>L{lvl} · Column {colIdx + 1} Color</span>
                                        <div className="flex items-center gap-1.5">
                                          {colColor && (
                                            <button
                                              type="button"
                                              onClick={() => handleClearColumnColor(lvl, colIdx)}
                                              className="text-[10px] text-red-500 hover:underline cursor-pointer"
                                            >
                                              Reset
                                            </button>
                                          )}
                                          <button
                                            type="button"
                                            onClick={() => setActiveColorPopover(null)}
                                            className="p-0.5 rounded hover:bg-stone-200 dark:hover:bg-[#2a1d14] cursor-pointer"
                                          >
                                            <X className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      </div>
                                      <RoundColorColumnsPicker
                                        columns={UNIFIED_COLOR_COLUMNS}
                                        selectedColor={colColor}
                                        onSelectColor={(c) => handleUpdateColumnColor(lvl, colIdx, c)}
                                        showStandardRow
                                        swatchSizeClass="w-4 h-4"
                                      />
                                    </div>
                                  )}
                                </div>

                                <NodeBox
                                  node={node}
                                  colIdx={colIdx}
                                  styleTokens={resolved}
                                  isSelected={selectedNodeId === node.id}
                                  onSelect={() => {
                                    setSelectedNodeId(node.id);
                                    setInspectorDrawerOpen(true);
                                  }}
                                  onAddSideways={() => handleAddBoxes(node, 'sideways', addBoxCount)}
                                  onAddBelow={() => handleAddBoxes(node, 'below', addBoxCount)}
                                  onDelete={() => handleDeleteNode(node.id)}
                                  addBoxCount={addBoxCount}
                                  searchQuery={searchQuery}
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
            ) : (
              /* VIEW B: GATHER INFO CARDS */
              <div className="space-y-4 w-full max-w-6xl mx-auto pb-28">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-stone-200/80 dark:border-[#382518]">
                  <div className="text-xs text-stone-500 dark:text-[#a69079] font-medium font-serif">
                    {activeChart.nodes.length} info entries across {totalLevels} levels
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {activeChart.nodes
                    .filter((n) => infoLevelFilter === 'all' || n.level === infoLevelFilter)
                    .filter((n) => {
                      if (!searchQuery.trim()) return true;
                      const q = searchQuery.toLowerCase();
                      return (
                        n.title.toLowerCase().includes(q) ||
                        n.subtitle.toLowerCase().includes(q) ||
                        n.description.toLowerCase().includes(q) ||
                        (n.phraseTag || '').toLowerCase().includes(q) ||
                        n.pearls.some((p) => p.toLowerCase().includes(q))
                      );
                    })
                    .map((node, idx) => {
                      const resolved = getResolvedNodeStyle(activeChart, node, idx, isDarkThemeMode);
                      return (
                        <div
                          key={node.id}
                          className="p-5 rounded-2xl border shadow-xs space-y-3 relative overflow-hidden"
                          style={{
                            backgroundColor: resolved.cardBg,
                            borderColor: resolved.cardBorder,
                            borderLeftColor: resolved.accentBar,
                            borderLeftWidth: '4px',
                          }}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div
                                className="w-9 h-9 rounded-full font-bold flex items-center justify-center text-sm border shrink-0 shadow-2xs"
                                style={{
                                  backgroundColor: resolved.badgeBg,
                                  color: resolved.badgeText,
                                  borderColor: resolved.accentBar,
                                }}
                              >
                                {node.photoUrl || node.title.charAt(0)}
                              </div>
                              <div className="min-w-0">
                                <h4
                                  className="font-bold text-sm truncate"
                                  style={{ color: resolved.textPrimary }}
                                >
                                  {node.title}
                                </h4>
                                <p
                                  className="text-[10px] font-mono truncate"
                                  style={{ color: resolved.textSecondary }}
                                >
                                  L{node.level} · {node.phraseTag || 'Step'} · {node.subtitle}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedNodeId(node.id);
                                  setActiveViewMode('tree');
                                }}
                                className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                                title="View node in flowchart tree"
                              >
                                <GitBranch className="w-4 h-4" />
                              </button>

                              <button
                                type="button"
                                onClick={() => showBanner(`Gathered all info for ${node.title}`)}
                                className="px-2.5 py-1 rounded-xl bg-white/80 dark:bg-black/35 hover:bg-white dark:hover:bg-black/50 text-stone-800 dark:text-stone-100 font-semibold text-xs flex items-center gap-1 border border-stone-300/60 dark:border-white/15 transition-colors cursor-pointer"
                              >
                                <Sparkles className="w-3 h-3 text-[#A47C43]" />
                                <span>Gather Info</span>
                              </button>
                            </div>
                          </div>

                          <p className="text-xs leading-relaxed" style={{ color: resolved.textSecondary }}>
                            {node.description}
                          </p>

                          <div className="space-y-1.5 pt-2 border-t border-black/10 dark:border-white/10">
                            {node.pearls.map((pearl, pIdx) => (
                              <div
                                key={pIdx}
                                className="flex items-start gap-2 text-xs"
                                style={{ color: resolved.textPrimary }}
                              >
                                <span
                                  className="w-4 h-4 rounded-full font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5"
                                  style={{ backgroundColor: resolved.badgeBg, color: resolved.badgeText }}
                                >
                                  {pIdx + 1}
                                </span>
                                <p className="leading-relaxed">{pearl}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        </main>

        {/* ======================================================================= */}
        {/* BOTTOM DRAWERS (Charts Bottom-Left & Inspector Bottom-Right)            */}
        {/* ======================================================================= */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 px-3 sm:px-5 z-30 flex items-end justify-between gap-2 sm:gap-4">
          {/* LEFT CHATBOX DRAWER: CHARTS */}
          <div className="pointer-events-auto flex flex-col items-start">
            {chartsDrawerOpen ? (
              <div className="fc-drawer-slide-up w-[290px] sm:w-[330px] max-h-[66vh] rounded-t-2xl border border-b-0 border-stone-300 dark:border-[#3d291b] bg-[#f8f6f0] dark:bg-[#160f0b] shadow-2xl flex flex-col overflow-hidden">
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setChartsDrawerOpen(false)}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setChartsDrawerOpen(false)}
                  className="px-3.5 py-2.5 border-b border-stone-200/80 dark:border-[#352317] bg-[#eee9de] dark:bg-[#1e1510] flex items-center justify-between gap-2 shrink-0 cursor-pointer select-none hover:bg-[#e5dfd2] dark:hover:bg-[#261a13] transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <GitBranch className="w-3.5 h-3.5 text-[#8f5f2c] dark:text-[#d4a373] shrink-0" />
                    <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-stone-800 dark:text-[#efe4d4]">
                      Charts
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-black/10 dark:bg-white/10 text-stone-700 dark:text-[#d8c7b0]">
                      {charts.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setNewChartModalOpen(true);
                      }}
                      className="px-2 py-0.5 rounded-md bg-white/80 dark:bg-[#2a1d14] hover:bg-white dark:hover:bg-[#382518] text-[10px] font-semibold text-stone-700 dark:text-[#efe4d4] border border-stone-300/70 dark:border-[#4b3322] cursor-pointer"
                    >
                      + New
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setChartsDrawerOpen(false);
                      }}
                      className="p-1 rounded-md text-stone-500 dark:text-[#a69079] hover:text-stone-900 dark:hover:text-[#efe4d4] cursor-pointer"
                      aria-label="Minimize Charts"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-2.5 space-y-1.5">
                  {charts.map((c) => {
                    const isActive = c.id === activeChartId;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setActiveChartId(c.id);
                          setSelectedNodeId(c.nodes[0]?.id || '');
                        }}
                        className={`w-full p-2.5 rounded-xl text-left transition-all cursor-pointer flex items-center justify-between gap-2 border ${
                          isActive
                            ? 'themed-accent-btn bg-[#5c351c] text-white dark:bg-[#a47c43] border-transparent shadow-xs font-semibold'
                            : 'bg-white/90 dark:bg-[#211711] text-stone-700 dark:text-[#d8c7b0] border-stone-200/80 dark:border-[#382518] hover:border-amber-400/50'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="truncate font-semibold text-xs leading-snug">{c.title}</div>
                          <div className={`text-[10px] truncate mt-0.5 opacity-80`}>{c.subtitle}</div>
                        </div>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md shrink-0 flex items-center gap-1 bg-black/10 dark:bg-black/25">
                          <Users className="w-2.5 h-2.5 opacity-80" />
                          {c.nodesCount}
                        </span>
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() => setNewChartModalOpen(true)}
                    className="w-full py-2 px-3 rounded-xl border border-dashed border-stone-300 dark:border-[#4b3322] hover:border-amber-500/60 text-xs text-stone-600 dark:text-[#a69079] hover:text-stone-900 dark:hover:text-[#efe4d4] font-semibold flex items-center justify-center gap-1.5 cursor-pointer bg-white/60 dark:bg-[#140e0a]/60"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New chart</span>
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setChartsDrawerOpen(true)}
                className="px-3.5 py-2 rounded-t-2xl border border-b-0 border-stone-300 dark:border-[#3d291b] bg-[#eee9de] dark:bg-[#1e1510] hover:bg-[#e5dfd2] dark:hover:bg-[#281c14] text-stone-800 dark:text-[#efe4d4] shadow-xl flex items-center gap-2 text-xs font-semibold cursor-pointer"
              >
                <GitBranch className="w-3.5 h-3.5 text-[#8f5f2c] dark:text-[#d4a373]" />
                <span className="font-mono uppercase tracking-wider text-[11px] font-bold">Charts</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-black/10 dark:bg-white/10">
                  {charts.length}
                </span>
                <ChevronUp className="w-3.5 h-3.5 opacity-70 ml-1" />
              </button>
            )}
          </div>

          {/* CENTER FLOATING CANVAS ACTION PILL */}
          {activeNode && (
            <div className="pointer-events-auto mb-2.5 hidden sm:flex items-center gap-2 bg-stone-900/90 dark:bg-[#1c140e]/95 backdrop-blur-md text-white border border-stone-700/80 dark:border-[#382518] rounded-full px-3 py-1.5 shadow-xl">
              <button
                type="button"
                onClick={() => setActiveViewMode(activeViewMode === 'tree' ? 'info' : 'tree')}
                className="p-1.5 rounded-full hover:bg-stone-800 dark:hover:bg-[#2b1e15] text-stone-300 hover:text-white cursor-pointer"
                title="Toggle Tree / Info View"
              >
                <Eye className="w-4 h-4" />
              </button>
              <div className="h-3 w-px bg-stone-700 dark:bg-[#382518]" />
              <button
                type="button"
                onClick={() => handleAddBoxes(activeNode, 'sideways', addBoxCount)}
                className="themed-accent-btn px-2.5 py-1 rounded-full bg-[#A47C43] hover:bg-[#8e6834] text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>+{addBoxCount} Sideways</span>
              </button>
              <button
                type="button"
                onClick={() => handleAddBoxes(activeNode, 'below', addBoxCount)}
                className="themed-accent-btn px-2.5 py-1 rounded-full bg-[#A47C43] hover:bg-[#8e6834] text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <ArrowDown className="w-3.5 h-3.5" />
                <span>+{addBoxCount} Below</span>
              </button>
            </div>
          )}

          {/* RIGHT CHATBOX DRAWER: INSPECTOR */}
          <div className="pointer-events-auto flex flex-col items-end">
            {inspectorDrawerOpen ? (
              <div className="fc-drawer-slide-up w-[320px] sm:w-[395px] max-h-[75vh] rounded-t-2xl border border-b-0 border-stone-300 dark:border-[#3d291b] bg-[#fcfbf8] dark:bg-[#140e0a] shadow-2xl flex flex-col overflow-hidden">
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setInspectorDrawerOpen(false)}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setInspectorDrawerOpen(false)}
                  className="px-4 py-2.5 border-b border-stone-200/80 dark:border-[#352317] bg-[#eee9de] dark:bg-[#1e1510] flex items-center justify-between gap-2 shrink-0 cursor-pointer select-none hover:bg-[#e5dfd2] dark:hover:bg-[#261a13]"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Sliders className="w-3.5 h-3.5 text-[#8f5f2c] dark:text-[#d4a373] shrink-0" />
                    <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-stone-800 dark:text-[#efe4d4]">
                      Inspector
                    </span>
                    {activeNode && (
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-md border truncate max-w-[140px] border-stone-400/50">
                        L{activeNode.level} · {activeNode.title}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setInspectorDrawerOpen(false);
                    }}
                    className="p-1 rounded-md text-stone-500 dark:text-[#a69079] hover:text-stone-900 dark:hover:text-[#efe4d4] cursor-pointer shrink-0"
                    aria-label="Minimize Inspector"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {activeNode ? (
                  <div className="flex-1 flex flex-col overflow-y-auto p-3.5 space-y-4 custom-scrollbar text-xs">
                    {/* Box Format: Heading, Subheading, Phrase Tag */}
                    <div className="space-y-2.5 border-b border-stone-200/80 dark:border-[#352317] pb-3.5">
                      <div className="flex items-start justify-between gap-2">
                        <div
                          onClick={() => setPhotoPickerOpen(true)}
                          className="w-11 h-11 rounded-2xl text-lg font-bold flex items-center justify-center shrink-0 cursor-pointer hover:ring-2 hover:ring-[#A47C43] border border-stone-300 dark:border-[#4b3322] bg-stone-100 dark:bg-[#211711]"
                          title="Click to change icon / photo"
                        >
                          {activeNode.photoUrl || activeNode.title.charAt(0)}
                        </div>
                        <div className="flex-1 space-y-1.5">
                          <div>
                            <label className="block text-[9.5px] font-mono uppercase text-stone-400">
                              Heading
                            </label>
                            <input
                              type="text"
                              value={activeNode.title}
                              onChange={(e) => handleUpdateNodeText('title', e.target.value)}
                              className="w-full font-bold text-sm text-stone-900 dark:text-[#efe4d4] bg-white dark:bg-[#1a120d] border border-stone-200 dark:border-[#382518] rounded-lg px-2.5 py-1 outline-none focus:border-amber-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[9.5px] font-mono uppercase text-stone-400">
                              Subheading
                            </label>
                            <input
                              type="text"
                              value={activeNode.subtitle}
                              onChange={(e) => handleUpdateNodeText('subtitle', e.target.value)}
                              className="w-full text-xs text-stone-700 dark:text-[#d8c7b0] bg-white dark:bg-[#1a120d] border border-stone-200 dark:border-[#382518] rounded-lg px-2.5 py-1 outline-none focus:border-amber-500"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <span className="text-[10.5px] font-mono font-bold px-2 py-0.5 rounded-full border border-stone-300 dark:border-[#4b3322]">
                            L{activeNode.level}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteNode(activeNode.id)}
                            className="p-1 rounded text-stone-400 hover:text-red-500 cursor-pointer"
                            title="Delete Box"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Editable Standard Flowchart Phrase / Type */}
                      <div className="space-y-1.5 pt-1">
                        <label className="flex items-center gap-1 text-[10px] font-mono uppercase text-stone-500 dark:text-[#a69079]">
                          <Tag className="w-3 h-3 text-[#A47C43]" />
                          <span>Flowchart Phrase (Editable)</span>
                        </label>
                        <input
                          type="text"
                          value={activeNode.phraseTag || ''}
                          onChange={(e) => handleUpdateNodeText('phraseTag', e.target.value)}
                          placeholder="e.g. Start / Trigger, Process, Decision..."
                          className="w-full text-xs bg-white dark:bg-[#1a120d] border border-stone-200 dark:border-[#382518] rounded-lg px-2.5 py-1.5 outline-none focus:border-amber-500"
                        />
                        <div className="flex flex-wrap gap-1 pt-0.5">
                          {COMMON_FLOWCHART_PHRASES.slice(0, 6).map((phrase) => (
                            <button
                              key={phrase}
                              type="button"
                              onClick={() => handleUpdateNodeText('phraseTag', phrase)}
                              className={`px-2 py-0.5 rounded-md text-[10px] font-medium border cursor-pointer ${
                                activeNode.phraseTag === phrase
                                  ? 'themed-accent-btn bg-[#A47C43] text-white border-transparent'
                                  : 'bg-stone-100 dark:bg-[#231912] text-stone-700 dark:text-[#d8c7b0] border-stone-200 dark:border-[#382518]'
                              }`}
                            >
                              {phrase}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="p-3 rounded-2xl bg-amber-500/10 dark:bg-[#221811] border border-amber-500/25 dark:border-[#4b3322] space-y-2">
                      <div className="text-[10px] font-mono font-bold uppercase text-amber-700 dark:text-amber-400">
                        Quick Actions
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <button
                          type="button"
                          onClick={handleAddChildNode}
                          className="p-2 rounded-xl bg-white dark:bg-[#1a120d] border border-amber-400/40 dark:border-[#4b3322] hover:bg-amber-50 dark:hover:bg-[#2b1e15] text-stone-800 dark:text-[#efe4d4] font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          <span>Fill next level</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveViewMode('info')}
                          className="p-2 rounded-xl bg-white dark:bg-[#1a120d] border border-amber-400/40 dark:border-[#4b3322] hover:bg-amber-50 dark:hover:bg-[#2b1e15] text-stone-800 dark:text-[#efe4d4] font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-amber-500" />
                          <span>Gather Info</span>
                        </button>
                      </div>
                    </div>

                    {/* Node Colour using Shared Round Color Columns */}
                    <div className="p-3.5 rounded-2xl bg-stone-100/70 dark:bg-[#1a120d] border border-stone-200 dark:border-[#382518] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-stone-800 dark:text-[#efe4d4] flex items-center gap-1.5">
                          <Palette className="w-3.5 h-3.5 text-amber-500" />
                          <span>Node Colour</span>
                        </span>
                        {activeNode.colorOverride && (
                          <button
                            type="button"
                            onClick={handleClearNodeColorOverride}
                            className="text-[10px] font-mono text-[#8f5f2c] dark:text-[#d4a373] hover:underline cursor-pointer"
                          >
                            Reset Override
                          </button>
                        )}
                      </div>

                      <RoundColorColumnsPicker
                        columns={UNIFIED_COLOR_COLUMNS}
                        selectedColor={activeNode.colorOverride ? activeNode.color : undefined}
                        onSelectColor={handleUpdateNodeColor}
                        showStandardRow
                        swatchSizeClass="w-4 h-4"
                      />

                      {/* Box Shapes */}
                      <div className="pt-2 border-t border-stone-200/80 dark:border-[#352317]">
                        <label className="block text-[10px] font-semibold text-stone-500 dark:text-[#a69079] mb-1.5">
                          Box Shape:
                        </label>
                        <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                          {SHAPE_OPTIONS.map((sh) => (
                            <button
                              key={sh.id}
                              type="button"
                              onClick={() => handleUpdateNodeShape(sh.id)}
                              className={`p-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                                activeNode.shape === sh.id
                                  ? 'bg-stone-900 text-white dark:bg-[#efe4d4] dark:text-[#110c09] font-bold border-transparent'
                                  : 'bg-white dark:bg-[#231912] text-stone-700 dark:text-[#d8c7b0] border-stone-300/80 dark:border-[#382518]'
                              }`}
                            >
                              {sh.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Photo & Document Attachments */}
                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-stone-200/80 dark:border-[#352317]">
                        <button
                          type="button"
                          onClick={() => setPhotoPickerOpen(true)}
                          className="p-2 rounded-xl bg-white dark:bg-[#231912] border border-stone-300 dark:border-[#382518] hover:border-amber-400 text-stone-700 dark:text-[#efe4d4] text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <ImageIcon className="w-3.5 h-3.5 text-blue-500" />
                          <span>{activeNode.photoUrl ? 'Change Icon' : 'Add Icon'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setDocUploadOpen(true)}
                          className="p-2 rounded-xl bg-white dark:bg-[#231912] border border-stone-300 dark:border-[#382518] hover:border-amber-400 text-stone-700 dark:text-[#efe4d4] text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Paperclip className="w-3.5 h-3.5 text-[#8f5f2c] dark:text-amber-400" />
                          <span>Attach Doc</span>
                        </button>
                      </div>

                      {activeNode.documents && activeNode.documents.length > 0 && (
                        <div className="space-y-1.5 pt-1">
                          <span className="text-[10px] font-mono font-bold uppercase text-stone-400">
                            Attachments ({activeNode.documents.length}):
                          </span>
                          {activeNode.documents.map((doc) => (
                            <div
                              key={doc.id}
                              className="p-2 rounded-xl bg-white dark:bg-[#231912] border border-stone-200 dark:border-[#382518] flex items-center justify-between text-xs"
                            >
                              <span className="truncate font-medium">{doc.name}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveDocument(doc.id)}
                                className="text-stone-400 hover:text-red-500 cursor-pointer"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Body & Editable Flowchart Section Headings */}
                    <div className="space-y-3.5">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-stone-500 dark:text-[#a69079]">
                          <span className="w-4 h-4 rounded-full bg-stone-200 dark:bg-[#2a1d14] text-center leading-4 text-[10px]">
                            1
                          </span>
                          <span>BODY / DETAILS</span>
                        </div>
                        <textarea
                          rows={3}
                          value={activeNode.description}
                          onChange={(e) => handleUpdateNodeText('description', e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-white dark:bg-[#1a120d] border border-stone-200 dark:border-[#382518] text-xs text-stone-800 dark:text-[#efe4d4] outline-none focus:border-amber-500 resize-none leading-relaxed"
                        />
                      </div>

                      {/* Editable Branch Connections Heading */}
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-stone-500 dark:text-[#a69079]">
                          <span className="w-4 h-4 rounded-full bg-stone-200 dark:bg-[#2a1d14] text-center leading-4 text-[10px]">
                            2
                          </span>
                          <input
                            type="text"
                            value={activeChart?.childrenHeading || 'Connected Next Steps'}
                            onChange={(e) => handleUpdateChartHeading('childrenHeading', e.target.value)}
                            className="flex-1 bg-transparent border-b border-dashed border-stone-300 dark:border-[#382518] focus:border-amber-500 outline-none uppercase font-mono font-bold text-xs"
                            title="Edit section title"
                          />
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {(activeChart?.nodes || [])
                            .filter((n) => n.parentId === activeNode.id)
                            .map((child) => (
                              <button
                                key={child.id}
                                type="button"
                                onClick={() => setSelectedNodeId(child.id)}
                                className="px-2.5 py-1 rounded-lg bg-stone-200/80 dark:bg-[#231912] text-stone-800 dark:text-[#efe4d4] text-xs font-medium hover:bg-amber-500/20 cursor-pointer"
                              >
                                {child.title}
                              </button>
                            ))}
                          <button
                            type="button"
                            onClick={() => handleAddBoxes(activeNode, 'below', addBoxCount)}
                            className="px-2 py-1 rounded-lg border border-dashed border-stone-400 dark:border-[#4b3322] text-xs text-stone-500 dark:text-[#a69079] hover:text-amber-500 flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add Below</span>
                          </button>
                        </div>
                      </div>

                      {/* Editable Process Notes / Key Points */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-stone-500 dark:text-[#a69079]">
                          <span className="w-4 h-4 rounded-full bg-stone-200 dark:bg-[#2a1d14] text-center leading-4 text-[10px]">
                            3
                          </span>
                          <input
                            type="text"
                            value={activeChart?.notesHeading || 'Key Notes & Criteria'}
                            onChange={(e) => handleUpdateChartHeading('notesHeading', e.target.value)}
                            className="flex-1 bg-transparent border-b border-dashed border-stone-300 dark:border-[#382518] focus:border-amber-500 outline-none uppercase font-mono font-bold text-xs"
                            title="Edit section title"
                          />
                        </div>
                        <div className="space-y-1.5">
                          {activeNode.pearls.map((pearl, pIdx) => (
                            <div key={pIdx} className="p-2 rounded-xl bg-white dark:bg-[#1a120d] border border-stone-200 dark:border-[#382518] text-xs flex items-center gap-2">
                              <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-400 font-bold text-[9px] flex items-center justify-center shrink-0">
                                {pIdx + 1}
                              </span>
                              <input
                                type="text"
                                value={pearl}
                                onChange={(e) => handleUpdateNodeNote(pIdx, e.target.value)}
                                className="flex-1 bg-transparent outline-none text-xs"
                              />
                              <button
                                type="button"
                                onClick={() => handleDeleteNodeNote(pIdx)}
                                className="text-stone-400 hover:text-red-500 cursor-pointer"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                          <div className="flex gap-1.5">
                            <input
                              type="text"
                              value={newNoteText}
                              onChange={(e) => setNewNoteText(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddNodeNote();
                                }
                              }}
                              placeholder="Add bullet note..."
                              className="flex-1 px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#1a120d] border border-stone-200 dark:border-[#382518] text-xs outline-none focus:border-amber-500"
                            />
                            <button
                              type="button"
                              onClick={handleAddNodeNote}
                              className="px-2.5 py-1.5 rounded-lg bg-stone-800 dark:bg-[#efe4d4] text-white dark:text-[#110c09] text-xs font-semibold cursor-pointer"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center text-xs text-stone-400">
                    Select a box in the tree to inspect or edit details.
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setInspectorDrawerOpen(true)}
                className="px-3.5 py-2 rounded-t-2xl border border-b-0 border-stone-300 dark:border-[#3d291b] bg-[#eee9de] dark:bg-[#1e1510] hover:bg-[#e5dfd2] dark:hover:bg-[#281c14] text-stone-800 dark:text-[#efe4d4] shadow-xl flex items-center gap-2 text-xs font-semibold cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5 text-[#8f5f2c] dark:text-[#d4a373]" />
                <span className="font-mono uppercase tracking-wider text-[11px] font-bold">Inspector</span>
                {activeNode && (
                  <span className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.2 rounded-md border truncate max-w-[125px] border-stone-400/50">
                    L{activeNode.level} · {activeNode.title}
                  </span>
                )}
                <ChevronUp className="w-3.5 h-3.5 opacity-70 ml-1" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. ICON / PHOTO PICKER MODAL                                              */}
      {/* ========================================================================= */}
      {photoPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-[#fcfbf8] dark:bg-[#18110c] border border-stone-300 dark:border-[#382518] rounded-3xl max-w-md w-full p-6 text-stone-900 dark:text-[#efe4d4] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-[#352317] pb-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-amber-500" />
                <h3 className="font-serif font-bold text-lg">Box Icon &amp; Avatar</h3>
              </div>
              <button
                type="button"
                onClick={() => setPhotoPickerOpen(false)}
                className="text-stone-400 hover:text-stone-700 dark:hover:text-[#efe4d4] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {AVATAR_PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => handleAddPhoto(p.icon)}
                  className="p-3 rounded-xl bg-white dark:bg-[#231912] border border-stone-200 dark:border-[#382518] hover:border-amber-500 text-2xl flex items-center justify-center cursor-pointer"
                  title={p.label}
                >
                  {p.icon}
                </button>
              ))}
            </div>

            <div className="flex gap-2 text-xs pt-2 border-t border-stone-200 dark:border-[#352317]">
              <input
                type="text"
                placeholder="Paste emoji or image URL..."
                value={newPhotoInput}
                onChange={(e) => setNewPhotoInput(e.target.value)}
                className="flex-1 bg-white dark:bg-[#110c09] border border-stone-300 dark:border-[#382518] rounded-xl px-3 py-2 text-xs outline-none"
              />
              <button
                type="button"
                onClick={() => newPhotoInput && handleAddPhoto(newPhotoInput)}
                className="themed-accent-btn px-4 py-2 rounded-xl bg-[#A47C43] text-white font-semibold text-xs cursor-pointer"
              >
                Apply
              </button>
            </div>

            {activeNode?.photoUrl && (
              <div className="pt-2 flex justify-between items-center text-xs text-stone-500">
                <span>Current: {activeNode.photoUrl}</span>
                <button type="button" onClick={handleRemovePhoto} className="text-red-500 hover:underline cursor-pointer">
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. DOCUMENT ATTACH MODAL                                                  */}
      {/* ========================================================================= */}
      {docUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-[#fcfbf8] dark:bg-[#18110c] border border-stone-300 dark:border-[#382518] rounded-3xl max-w-md w-full p-6 text-stone-900 dark:text-[#efe4d4] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-[#352317] pb-3">
              <div className="flex items-center gap-2">
                <Paperclip className="w-4 h-4 text-[#8f5f2c] dark:text-amber-400" />
                <h3 className="font-serif font-bold text-lg">Attach Document</h3>
              </div>
              <button type="button" onClick={() => setDocUploadOpen(false)} className="text-stone-400 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAttachDocument} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold mb-1">Document Title:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Reference_Summary.pdf"
                  value={newDocForm.name}
                  onChange={(e) => setNewDocForm({ ...newDocForm, name: e.target.value })}
                  className="w-full bg-white dark:bg-[#110c09] border border-stone-300 dark:border-[#382518] rounded-xl px-3.5 py-2 text-xs outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDocUploadOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-200 dark:bg-[#231912] font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="themed-accent-btn px-4 py-2 rounded-xl bg-[#A47C43] text-white font-semibold cursor-pointer"
                >
                  Attach
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. NEW CHART CREATION MODAL                                               */}
      {/* ========================================================================= */}
      {newChartModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-[#fcfbf8] dark:bg-[#18110c] border border-stone-300 dark:border-[#382518] rounded-3xl max-w-md w-full p-6 text-stone-900 dark:text-[#efe4d4] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-[#352317] pb-3">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-500" />
                <h3 className="font-serif font-bold text-lg">Create New Flowchart</h3>
              </div>
              <button type="button" onClick={() => setNewChartModalOpen(false)} className="text-stone-400 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newChartForm.title.trim()) return;
                const newChart: StudioFlowchart = {
                  id: `chart-${Date.now()}`,
                  title: newChartForm.title.trim(),
                  subtitle: newChartForm.subtitle.trim() || 'Interactive multi-level flowchart',
                  category: newChartForm.category.trim() || 'General',
                  nodesCount: 1,
                  levelsCount: 1,
                  infoCount: 1,
                  lastUpdated: 'Just now',
                  levelColors: {},
                  columnColors: {},
                  childrenHeading: 'Connected Next Steps',
                  notesHeading: 'Key Notes & Criteria',
                  nodes: [
                    {
                      id: `node-${Date.now()}-root`,
                      level: 1,
                      columnIndex: 0,
                      phraseTag: 'Start / Trigger',
                      title: newChartForm.title.trim(),
                      subtitle: 'Primary entry point',
                      description: 'Add your main concept, starting trigger, or overview here.',
                      pearls: ['Double-click to edit notes or click corners to add boxes.'],
                      shape: 'card',
                      size: 'normal',
                      badge: 'L1',
                    },
                  ],
                };
                const updated = [...charts, newChart];
                saveCharts(updated);
                setActiveChartId(newChart.id);
                setSelectedNodeId(newChart.nodes[0].id);
                setNewChartModalOpen(false);
                setNewChartForm({ title: '', category: '', subtitle: '' });
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-semibold mb-1">Flowchart Title:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Research Pipeline / System Architecture"
                  value={newChartForm.title}
                  onChange={(e) => setNewChartForm({ ...newChartForm, title: e.target.value })}
                  className="w-full bg-white dark:bg-[#110c09] border border-stone-300 dark:border-[#382518] rounded-xl px-3.5 py-2 text-xs outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Subject / Domain:</label>
                <input
                  type="text"
                  placeholder="e.g. Biology, Physics, History, Software..."
                  value={newChartForm.category}
                  onChange={(e) => setNewChartForm({ ...newChartForm, category: e.target.value })}
                  className="w-full bg-white dark:bg-[#110c09] border border-stone-300 dark:border-[#382518] rounded-xl px-3.5 py-2 text-xs outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Subheading:</label>
                <input
                  type="text"
                  placeholder="Short description of this flowchart"
                  value={newChartForm.subtitle}
                  onChange={(e) => setNewChartForm({ ...newChartForm, subtitle: e.target.value })}
                  className="w-full bg-white dark:bg-[#110c09] border border-stone-300 dark:border-[#382518] rounded-xl px-3.5 py-2 text-xs outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200 dark:border-[#352317]">
                <button
                  type="button"
                  onClick={() => setNewChartModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-200 dark:bg-[#231912] font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="themed-accent-btn px-4 py-2 rounded-xl bg-[#A47C43] hover:bg-[#8e6834] text-white font-semibold cursor-pointer"
                >
                  Create Flowchart
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// =============================================================================
// SUB-COMPONENT: FLOWCHART NODE BOX (Heading, Subheading, Body + Corner Adders)
// =============================================================================
const NodeBox: React.FC<{
  node: StudioFlowNode;
  colIdx: number;
  styleTokens: ResolvedNodeStyle;
  isSelected: boolean;
  onSelect: () => void;
  onAddSideways: () => void;
  onAddBelow: () => void;
  onDelete?: () => void;
  addBoxCount: number;
  searchQuery?: string;
}> = ({
  node,
  styleTokens,
  isSelected,
  onSelect,
  onAddSideways,
  onAddBelow,
  onDelete,
  addBoxCount,
  searchQuery = '',
}) => {
  const shape = node.shape || 'rounded';

  const isSearchMatch = searchQuery.trim()
    ? node.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (node.phraseTag || '').toLowerCase().includes(searchQuery.toLowerCase())
    : false;

  const isDimmedBySearch = searchQuery.trim() && !isSearchMatch;

  let shapeClass = 'rounded-2xl';
  if (shape === 'pill') shapeClass = 'rounded-full px-6';
  else if (shape === 'rectangle') shapeClass = 'rounded-none';
  else if (shape === 'diamond') shapeClass = 'rounded-lg border-2';
  else if (shape === 'hexagon') shapeClass = 'rounded-xl';

  return (
    <div className="relative group pb-4 pr-4">
      <div
        onClick={onSelect}
        className={`w-[245px] p-3.5 border transition-all duration-150 cursor-pointer shadow-sm relative ${shapeClass} ${
          isSearchMatch
            ? 'ring-4 ring-amber-400 shadow-xl scale-[1.03] z-20'
            : isSelected
            ? 'ring-2 ring-amber-500 shadow-md'
            : isDimmedBySearch
            ? 'opacity-35'
            : 'hover:shadow-md'
        }`}
        style={{
          backgroundColor: styleTokens.cardBg,
          borderColor: isSelected ? styleTokens.accentBar : styleTokens.cardBorder,
          borderTopColor: styleTokens.accentBar,
          borderTopWidth: shape === 'card' ? '4px' : '2px',
        }}
      >
        {/* Top-Right Hover Delete Cross */}
        {onDelete && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            title="Delete this box"
            aria-label={`Delete ${node.title}`}
            className="raw-icon-btn absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-all hover:scale-110 z-30 cursor-pointer"
          >
            <X className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        )}
        {/* Top Row: Phrase Tag + Avatar */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span
            className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold truncate"
            style={{ backgroundColor: styleTokens.badgeBg, color: styleTokens.badgeText }}
          >
            {node.phraseTag || `Level ${node.level}`}
          </span>
          <div
            className="w-6 h-6 rounded-full border text-[11px] font-bold flex items-center justify-center shrink-0"
            style={{
              backgroundColor: styleTokens.badgeBg,
              color: styleTokens.badgeText,
              borderColor: styleTokens.accentBar,
            }}
          >
            {node.photoUrl || node.title.charAt(0)}
          </div>
        </div>

        {/* Heading & Subheading */}
        <div className="mb-1.5">
          <div
            className="font-bold text-sm leading-snug truncate"
            style={{ color: styleTokens.textPrimary }}
          >
            {node.title}
          </div>
          <div
            className="text-[11px] font-medium truncate"
            style={{ color: styleTokens.textSecondary }}
          >
            {node.subtitle}
          </div>
        </div>

        {/* Body */}
        <p
          className="text-[11px] line-clamp-3 leading-relaxed mb-2"
          style={{ color: styleTokens.textSecondary }}
        >
          {node.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between text-[9.5px] font-mono border-t border-black/10 dark:border-white/10 pt-1.5 opacity-80">
          <span style={{ color: styleTokens.textSecondary }}>L{node.level}</span>
          {node.documents && node.documents.length > 0 && (
            <span className="flex items-center gap-1 font-semibold" style={{ color: styleTokens.textPrimary }}>
              <Paperclip className="w-2.5 h-2.5" />
              <span>{node.documents.length}</span>
            </span>
          )}
        </div>
      </div>

      {/* Right-Edge Corner Control: Add N boxes Sideways (same level) */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onAddSideways();
        }}
        title={`Add ${addBoxCount} box(es) sideways on Level ${node.level}`}
        className="themed-accent-btn absolute right-0 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#A47C43] hover:bg-[#8e6834] text-white shadow-md flex items-center justify-center text-[10px] font-bold cursor-pointer transition-transform hover:scale-110 z-20"
      >
        <span>+{addBoxCount}→</span>
      </button>

      {/* Bottom Corner Control: Add N boxes Below (next level) */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onAddBelow();
        }}
        title={`Add ${addBoxCount} box(es) below on Level ${node.level + 1}`}
        className="themed-accent-btn absolute bottom-0 left-1/2 -translate-x-1/2 h-7 px-2.5 rounded-full bg-[#A47C43] hover:bg-[#8e6834] text-white shadow-md flex items-center justify-center text-[10px] font-bold cursor-pointer transition-transform hover:scale-110 z-20"
      >
        <span>+{addBoxCount} ↓ Below</span>
      </button>
    </div>
  );
};
