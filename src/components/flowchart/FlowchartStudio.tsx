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
  ChevronRight,
  Eye,
  Layers,
  Copy,
  Sliders,
  ExternalLink,
  Printer,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  BookOpen,
  ArrowRight,
  Star,
  FileSpreadsheet,
  Presentation,
  Upload,
  Link as LinkIcon,
  HelpCircle,
  Users,
  Palette,
  Shuffle,
} from 'lucide-react';

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
  level: 1 | 2 | 3 | 4;
  title: string;
  subtitle: string;
  description: string;
  pearls: string[];
  connections?: string[]; // related nodes or spouses
  color?: string; // hex color or preset
  colorOverride?: boolean; // explicit manual override instead of active theme level color
  shape?: BoxShape;
  size?: BoxSize;
  photoUrl?: string; // photo adding feature!
  documents?: AttachedDocument[]; // document adding feature!
  badge?: string;
  isStarred?: boolean;
}

export interface FlowchartLevelPalette {
  lightBg: string;
  lightBorder: string;
  lightAccent: string;
  lightText: string;
  lightBadgeBg: string;
  lightBadgeText: string;
  lightLine: string;
  darkBg: string;
  darkBorder: string;
  darkAccent: string;
  darkText: string;
  darkBadgeBg: string;
  darkBadgeText: string;
  darkLine: string;
}

export interface FlowchartSoberTheme {
  id: string;
  name: string;
  subtitle: string;
  isAuto?: boolean;
  levels: Record<1 | 2 | 3 | 4, FlowchartLevelPalette>;
}

const hslToHex = (h: number, s: number, l: number): string => {
  const hn = ((h % 360) + 360) % 360;
  const sn = Math.max(0, Math.min(100, s)) / 100;
  const ln = Math.max(0, Math.min(100, l)) / 100;
  const k = (n: number) => (n + hn / 30) % 12;
  const a = sn * Math.min(ln, 1 - ln);
  const f = (n: number) => {
    const val = ln - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return Math.round(255 * val).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

export const generateLevelPaletteFromHue = (hue: number, satBase = 26): FlowchartLevelPalette => {
  const s = Math.max(16, Math.min(34, satBase));
  return {
    lightBg: hslToHex(hue, Math.round(s * 0.72), 95),
    lightBorder: hslToHex(hue, Math.round(s * 0.85), 76),
    lightAccent: hslToHex(hue, s + 6, 38),
    lightText: hslToHex(hue, 22, 17),
    lightBadgeBg: hslToHex(hue, Math.round(s * 0.9), 89),
    lightBadgeText: hslToHex(hue, s + 8, 29),
    lightLine: hslToHex(hue, s + 4, 52),
    darkBg: hslToHex(hue, Math.round(s * 0.65), 14),
    darkBorder: hslToHex(hue, Math.round(s * 0.75), 31),
    darkAccent: hslToHex(hue, s + 8, 63),
    darkText: hslToHex(hue, 18, 90),
    darkBadgeBg: hslToHex(hue, Math.round(s * 0.7), 22),
    darkBadgeText: hslToHex(hue, s + 10, 76),
    darkLine: hslToHex(hue, s + 6, 56),
  };
};

export const buildSoberTheme = (
  id: string,
  name: string,
  subtitle: string,
  hues: [number, number, number, number],
  sat: [number, number, number, number] = [27, 25, 24, 23],
  isAuto = false
): FlowchartSoberTheme => ({
  id,
  name,
  subtitle,
  isAuto,
  levels: {
    1: generateLevelPaletteFromHue(hues[0], sat[0]),
    2: generateLevelPaletteFromHue(hues[1], sat[1]),
    3: generateLevelPaletteFromHue(hues[2], sat[2]),
    4: generateLevelPaletteFromHue(hues[3], sat[3]),
  },
});

export const FLOWCHART_SOBER_THEMES: FlowchartSoberTheme[] = [
  buildSoberTheme('sober-nordic', 'Nordic Archive', 'Warm ochre, muted sage, dusk slate & taupe', [35, 152, 212, 318], [28, 25, 26, 22]),
  buildSoberTheme('sober-botanical', 'Botanical Linen', 'Forest moss, terracotta clay, sand & petrol', [142, 16, 44, 194], [25, 28, 26, 24]),
  buildSoberTheme('sober-oxford', 'Oxford Ledger', 'Burgundy ink, oxford navy, bronze & graphite', [352, 222, 34, 182], [26, 26, 27, 20]),
  buildSoberTheme('sober-mineral', 'Mineral Fog', 'Deep mineral teal, driftwood, periwinkle & quartz', [176, 30, 228, 342], [25, 22, 24, 24]),
  buildSoberTheme('sober-monolith', 'Monolith Earth', 'Roasted sienna, cypress, steel blue & plum-grey', [22, 118, 208, 286], [28, 22, 24, 21]),
];

export const generateAutoSoberTheme = (seedNumber = Date.now()): FlowchartSoberTheme => {
  const baseHue = Math.round(((seedNumber * 137.508) % 360 + Math.random() * 60) % 360);
  const hues: [number, number, number, number] = [
    baseHue,
    (baseHue + 68) % 360,
    (baseHue + 148) % 360,
    (baseHue + 232) % 360,
  ];
  return buildSoberTheme(
    `sober-auto-${seedNumber}`,
    'Auto Palette',
    'Auto-generated balanced 4-level sober theme',
    hues,
    [26, 24, 25, 22],
    true
  );
};

export interface StudioFlowchart {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  nodesCount: number;
  levelsCount: number;
  storiesCount: number;
  lastUpdated: string;
  nodes: StudioFlowNode[];
}

// 8 Warm Atelier & Clinical Palette Swatches
export const COLOR_SWATCHES = [
  { name: 'Atelier Beige', hex: '#F5EFEB', bg: '#FAF6EE', border: '#DCD4C4', text: '#3E3529' },
  { name: 'Warm Antique Brass', hex: '#A47C43', bg: '#F8F4EA', border: '#C5A367', text: '#543D1A' },
  { name: 'Emerald Sage', hex: '#4F6E61', bg: '#EFF5F2', border: '#84A89A', text: '#233E33' },
  { name: 'Coral Terracotta', hex: '#D97764', bg: '#FAF0ED', border: '#E7A294', text: '#682E22' },
  { name: 'Clinical Cobalt', hex: '#3B82F6', bg: '#EFF6FF', border: '#93C5FD', text: '#1E3A8A' },
  { name: 'Dusty Slate', hex: '#475569', bg: '#F1F5F9', border: '#94A3B8', text: '#1E293B' },
  { name: 'Royal Amethyst', hex: '#8B5CF6', bg: '#F5F3FF', border: '#C4B5FD', text: '#4C1D95' },
  { name: 'Amber Ochre', hex: '#D97706', bg: '#FFFBEB', border: '#FCD34D', text: '#78350F' },
];

export const SHAPE_OPTIONS: { id: BoxShape; label: string; desc: string }[] = [
  { id: 'rounded', label: 'Rounded Box', desc: 'Soft 16px radius' },
  { id: 'card', label: 'Accent Card', desc: 'Top colored border band' },
  { id: 'pill', label: 'Capsule Pill', desc: 'Fully rounded pill format' },
  { id: 'rectangle', label: 'Sharp Modern', desc: 'Crisp clinical rectangle' },
  { id: 'diamond', label: 'Decision Chamfer', desc: 'Chamfered decision corners' },
  { id: 'hexagon', label: 'Hexagonal', desc: 'Geometric diagnosis node' },
];

export const MEDICAL_AVATAR_PRESETS = [
  { label: 'Stethoscope', icon: '🩺' },
  { label: 'Heart Cardio', icon: '❤️' },
  { label: 'Brain Neuro', icon: '🧠' },
  { label: 'Lungs Pulmonary', icon: '🫁' },
  { label: 'Syringe Pharma', icon: '💉' },
  { label: 'ECG Rhythm', icon: '📈' },
  { label: 'Microscope Cell', icon: '🔬' },
  { label: 'DNA Genetic', icon: '🧬' },
  { label: 'Alert Resus', icon: '⚡' },
  { label: 'Pill Capsule', icon: '💊' },
];

export const DEFAULT_STUDIO_CHARTS: StudioFlowchart[] = [];

const SEED_STUDIO_CHART_IDS = new Set([
  'chart-shiv-parivar',
  'chart-ikshvaku',
  'chart-acs',
  'chart-shock',
]);

interface FlowchartStudioProps {
  onBackToLibrary?: () => void;
  onSnipToNote?: (snip: any) => void;
}

export const FlowchartStudio: React.FC<FlowchartStudioProps> = ({
  onBackToLibrary,
  onSnipToNote,
}) => {
  // 1. Studio State
  const [charts, setCharts] = useState<StudioFlowchart[]>(() => {
    try {
      const saved = localStorage.getItem('medden_studio_flowcharts');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const cleaned = parsed.filter((c: any) => !SEED_STUDIO_CHART_IDS.has(c?.id));
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

  // Active Selected Node for Inspector
  const [selectedNodeId, setSelectedNodeId] = useState<string>(() => {
    return activeChart?.nodes?.[0]?.id || '';
  });

  const activeNode = activeChart?.nodes?.find((n) => n.id === selectedNodeId) || activeChart?.nodes?.[0];

  // 2. View Mode Tabs: 'tree' (Flowchart Diagram) vs 'stories' (Story / Case Cards)
  const [activeViewMode, setActiveViewMode] = useState<'tree' | 'stories'>('tree');
  const [storiesLevelFilter, setStoriesLevelFilter] = useState<'all' | 1 | 2 | 3 | 4>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 3. Chatbox-Style Bottom Drawers (Charts & Inspector) + Sober Per-Level Auto Themes + Live Canvas ResizeObserver
  const [chartsDrawerOpen, setChartsDrawerOpen] = useState(false);
  const [inspectorDrawerOpen, setInspectorDrawerOpen] = useState(false);
  const [isDarkThemeMode, setIsDarkThemeMode] = useState<boolean>(() =>
    typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') : false
  );

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const syncDark = () => setIsDarkThemeMode(document.documentElement.classList.contains('dark'));
    syncDark();
    const observer = new MutationObserver(syncDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const [autoCustomTheme, setAutoCustomTheme] = useState<FlowchartSoberTheme | null>(() => {
    try {
      const raw = localStorage.getItem('medden_fc_auto_theme_v1');
      return raw ? (JSON.parse(raw) as FlowchartSoberTheme) : null;
    } catch {
      return null;
    }
  });
  const [activeThemeId, setActiveThemeId] = useState<string>(() => {
    return localStorage.getItem('medden_fc_theme_id_v1') || FLOWCHART_SOBER_THEMES[0].id;
  });

  const activeTheme: FlowchartSoberTheme =
    (autoCustomTheme && activeThemeId === autoCustomTheme.id
      ? autoCustomTheme
      : FLOWCHART_SOBER_THEMES.find((t) => t.id === activeThemeId)) || FLOWCHART_SOBER_THEMES[0];

  const handleSelectSoberTheme = (themeId: string) => {
    setActiveThemeId(themeId);
    localStorage.setItem('medden_fc_theme_id_v1', themeId);
  };

  const handleGenerateAutoTheme = () => {
    const generated = generateAutoSoberTheme(Date.now());
    setAutoCustomTheme(generated);
    setActiveThemeId(generated.id);
    localStorage.setItem('medden_fc_auto_theme_v1', JSON.stringify(generated));
    localStorage.setItem('medden_fc_theme_id_v1', generated.id);
  };

  const canvasPaneRef = useRef<HTMLDivElement | null>(null);
  const [canvasMeasuredW, setCanvasMeasuredW] = useState<number>(860);

  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (typeof ResizeObserver === 'undefined') return;
    const obs = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = Math.round(entry.contentRect.width);
        if (w && entry.target === canvasPaneRef.current) setCanvasMeasuredW(w);
      }
    });
    if (canvasPaneRef.current) obs.observe(canvasPaneRef.current);
    return () => obs.disconnect();
  }, []);

  // 4. Modals & Popovers
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const [newChartModalOpen, setNewChartModalOpen] = useState(false);
  const [photoPickerOpen, setPhotoPickerOpen] = useState(false);
  const [docUploadOpen, setDocUploadOpen] = useState(false);
  const [newChartForm, setNewChartForm] = useState({ title: '', category: '', subtitle: '' });
  const [newDocForm, setNewDocForm] = useState({ name: '', size: '1.2 MB', type: 'pdf' as const });
  const [newPhotoInput, setNewPhotoInput] = useState('');
  const [geminiFeedback, setGeminiFeedback] = useState<string | null>(null);

  // Sync to localStorage
  const saveCharts = (updatedCharts: StudioFlowchart[]) => {
    setCharts(updatedCharts);
    localStorage.setItem('medden_studio_flowcharts', JSON.stringify(updatedCharts));
  };

  // 5. Node Update Functions
  const handleUpdateNodeColor = (hex: string) => {
    if (!activeChart || !activeNode) return;
    const updatedNodes = activeChart.nodes.map((n) =>
      n.id === activeNode.id ? { ...n, color: hex, colorOverride: true } : n
    );
    const updatedCharts = charts.map((c) =>
      c.id === activeChart.id ? { ...c, nodes: updatedNodes } : c
    );
    saveCharts(updatedCharts);
  };

  const handleResetNodeThemeColor = () => {
    if (!activeChart || !activeNode) return;
    const updatedNodes = activeChart.nodes.map((n) =>
      n.id === activeNode.id ? { ...n, colorOverride: false } : n
    );
    const updatedCharts = charts.map((c) =>
      c.id === activeChart.id ? { ...c, nodes: updatedNodes } : c
    );
    saveCharts(updatedCharts);
  };

  const handleUpdateNodeShape = (shape: BoxShape) => {
    if (!activeChart || !activeNode) return;
    const updatedNodes = activeChart.nodes.map((n) =>
      n.id === activeNode.id ? { ...n, shape } : n
    );
    const updatedCharts = charts.map((c) =>
      c.id === activeChart.id ? { ...c, nodes: updatedNodes } : c
    );
    saveCharts(updatedCharts);
  };

  const handleUpdateNodeSize = (size: BoxSize) => {
    if (!activeChart || !activeNode) return;
    const updatedNodes = activeChart.nodes.map((n) =>
      n.id === activeNode.id ? { ...n, size } : n
    );
    const updatedCharts = charts.map((c) =>
      c.id === activeChart.id ? { ...c, nodes: updatedNodes } : c
    );
    saveCharts(updatedCharts);
  };

  const handleUpdateNodeText = (field: 'title' | 'subtitle' | 'description', val: string) => {
    if (!activeChart || !activeNode) return;
    const updatedNodes = activeChart.nodes.map((n) =>
      n.id === activeNode.id ? { ...n, [field]: val } : n
    );
    const updatedCharts = charts.map((c) =>
      c.id === activeChart.id ? { ...c, nodes: updatedNodes } : c
    );
    saveCharts(updatedCharts);
  };

  const handleAddPhoto = (urlOrEmoji: string) => {
    if (!activeChart || !activeNode) return;
    const updatedNodes = activeChart.nodes.map((n) =>
      n.id === activeNode.id ? { ...n, photoUrl: urlOrEmoji } : n
    );
    const updatedCharts = charts.map((c) =>
      c.id === activeChart.id ? { ...c, nodes: updatedNodes } : c
    );
    saveCharts(updatedCharts);
    setPhotoPickerOpen(false);
    setNewPhotoInput('');
  };

  const handleRemovePhoto = () => {
    if (!activeChart || !activeNode) return;
    const updatedNodes = activeChart.nodes.map((n) =>
      n.id === activeNode.id ? { ...n, photoUrl: undefined } : n
    );
    const updatedCharts = charts.map((c) =>
      c.id === activeChart.id ? { ...c, nodes: updatedNodes } : c
    );
    saveCharts(updatedCharts);
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

    const existingDocs = activeNode.documents || [];
    const updatedNodes = activeChart.nodes.map((n) =>
      n.id === activeNode.id ? { ...n, documents: [...existingDocs, newDoc] } : n
    );
    const updatedCharts = charts.map((c) =>
      c.id === activeChart.id ? { ...c, nodes: updatedNodes } : c
    );
    saveCharts(updatedCharts);
    setDocUploadOpen(false);
    setNewDocForm({ name: '', size: '1.2 MB', type: 'pdf' });
  };

  const handleRemoveDocument = (docId: string) => {
    if (!activeChart || !activeNode || !activeNode.documents) return;
    const updatedDocs = activeNode.documents.filter((d) => d.id !== docId);
    const updatedNodes = activeChart.nodes.map((n) =>
      n.id === activeNode.id ? { ...n, documents: updatedDocs } : n
    );
    const updatedCharts = charts.map((c) =>
      c.id === activeChart.id ? { ...c, nodes: updatedNodes } : c
    );
    saveCharts(updatedCharts);
  };

  const handleAddChildNode = () => {
    if (!activeChart) return;
    if (!activeNode) return;
    const nextLevel = (Math.min(activeNode.level + 1, 4) as 1 | 2 | 3 | 4);
    const newId = `node-${Date.now()}`;
    const newNode: StudioFlowNode = {
      id: newId,
      parentId: activeNode.id,
      level: nextLevel,
      title: `Next Step from ${activeNode.title}`,
      subtitle: `Level ${nextLevel} node`,
      description: 'Document details, criteria, or notes here.',
      pearls: ['Key note for this step.'],
      connections: [activeNode.title],
      color: activeNode.color || '#A47C43',
      shape: activeNode.shape || 'rounded',
      size: 'normal',
      badge: `Level ${nextLevel} · Step`,
    };

    const updatedNodes = [...activeChart.nodes, newNode];
    const updatedCharts = charts.map((c) =>
      c.id === activeChart.id
        ? {
            ...c,
            nodes: updatedNodes,
            nodesCount: updatedNodes.length,
            levelsCount: Math.max(...updatedNodes.map((n) => n.level)),
          }
        : c
    );
    saveCharts(updatedCharts);
    setSelectedNodeId(newId);
  };

  const handleDeleteNode = (nodeId: string) => {
    if (!activeChart || activeChart.nodes.length <= 1) return;
    const updatedNodes = activeChart.nodes.filter((n) => n.id !== nodeId);
    const updatedCharts = charts.map((c) =>
      c.id === activeChart.id
        ? {
            ...c,
            nodes: updatedNodes,
            nodesCount: updatedNodes.length,
          }
        : c
    );
    saveCharts(updatedCharts);
    setSelectedNodeId(updatedNodes[0]?.id || '');
  };

  // Gemini Expand Assistance Simulation
  const handleGeminiExpand = () => {
    if (!activeChart || !activeNode) {
      setNewChartModalOpen(true);
      return;
    }
    setGeminiFeedback('Gemini AI analyzing flowchart...');
    setTimeout(() => {
      handleAddChildNode();
      setGeminiFeedback('✨ Gemini generated next child node!');
      setTimeout(() => setGeminiFeedback(null), 3000);
    }, 900);
  };

  // Export handlers
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

  // Group nodes by Level for Canvas Layout
  const chartNodes = activeChart?.nodes || [];
  const level1Nodes = chartNodes.filter((n) => n.level === 1);
  const level2Nodes = chartNodes.filter((n) => n.level === 2);
  const level3Nodes = chartNodes.filter((n) => n.level === 3);
  const level4Nodes = chartNodes.filter((n) => n.level === 4);

  const totalLevels = Math.max(...chartNodes.map((n) => n.level), 1);

  // Canvas responsive scaling derived from ResizeObserver width
  const canvasScaleRatio = Math.max(0.7, Math.min(1.18, canvasMeasuredW / 860));
  const dynamicNodeWidthPx = Math.max(
    165,
    Math.min(275, Math.round(canvasMeasuredW * (canvasMeasuredW < 520 ? 0.44 : canvasMeasuredW < 880 ? 0.28 : 0.22)))
  );
  const storiesGridClass =
    canvasMeasuredW >= 960 ? 'grid-cols-3' : canvasMeasuredW >= 540 ? 'grid-cols-2' : 'grid-cols-1';
  const isCanvasNarrow = canvasMeasuredW < 580;

  // Helpers to read active sober level tokens (light or dark)
  const lvlPalette = (lvl: 1 | 2 | 3 | 4) => activeTheme.levels[lvl] || activeTheme.levels[1];
  const lvlAccent = (lvl: 1 | 2 | 3 | 4) => (isDarkThemeMode ? lvlPalette(lvl).darkAccent : lvlPalette(lvl).lightAccent);
  const lvlLine = (lvl: 1 | 2 | 3 | 4) => (isDarkThemeMode ? lvlPalette(lvl).darkLine : lvlPalette(lvl).lightLine);
  const lvlBadgeStyle = (lvl: 1 | 2 | 3 | 4): React.CSSProperties => {
    const p = lvlPalette(lvl);
    return {
      backgroundColor: isDarkThemeMode ? p.darkBadgeBg : p.lightBadgeBg,
      color: isDarkThemeMode ? p.darkBadgeText : p.lightBadgeText,
      borderColor: isDarkThemeMode ? p.darkBorder : p.lightBorder,
    };
  };

  return (
    <div className={`flex flex-col h-full w-full bg-[#fcfbf8] dark:bg-[#110c09] text-stone-900 dark:text-[#efe4d4] select-text overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50' : 'relative'}`}>
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
      {/* 1. TOP STUDIO CONTROLS BAR (Clean: Back + Gemini, Export & Fullscreen)     */}
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
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-2.5">
          {/* Gemini AI Assist Button */}
          <button
            type="button"
            onClick={handleGeminiExpand}
            className="px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 via-[#A47C43]/20 to-[#8f5f2c]/15 hover:from-amber-500/25 text-stone-800 dark:text-amber-200 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Fill next generation with Gemini</span>
          </button>

          {/* Export Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
              className="px-3.5 py-1.5 rounded-full bg-[#1e2530] text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
              <ChevronDown className="w-3 h-3 opacity-70" />
            </button>

            {exportDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-56 rounded-2xl bg-[#18110c] border border-[#382518] shadow-2xl p-2 z-50 text-[#efe4d4] text-xs space-y-1 animate-in fade-in duration-100">
                <button
                  type="button"
                  onClick={() => handleExport('PDF')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#2a1d14] text-left transition-colors cursor-pointer"
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
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#2a1d14] text-left transition-colors cursor-pointer"
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
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#2a1d14] text-left transition-colors cursor-pointer"
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
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#2a1d14] text-left transition-colors cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 text-amber-400" />
                  <div>
                    <div className="font-semibold text-xs">Excel</div>
                    <div className="text-[10px] text-[#a69079]">Nodes, tree, clinical steps</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleExport('PNG image')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#2a1d14] text-left transition-colors cursor-pointer"
                >
                  <ImageIcon className="w-4 h-4 text-purple-400" />
                  <div>
                    <div className="font-semibold text-xs">PNG image</div>
                    <div className="text-[10px] text-[#a69079]">High resolution snapshot</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleExport('SVG vector')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#2a1d14] text-left transition-colors cursor-pointer"
                >
                  <GitBranch className="w-4 h-4 text-sky-400" />
                  <div>
                    <div className="font-semibold text-xs">SVG</div>
                    <div className="text-[10px] text-[#a69079]">Scalable vector diagram</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleExport('JSON')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#2a1d14] text-left transition-colors cursor-pointer border-t border-[#382518] mt-1 pt-1.5"
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

          {/* Fullscreen Toggle */}
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
      {/* 2. FULL-WIDTH CANVAS + BOTTOM CHATBOX DRAWERS (Charts & Inspector)        */}
      {/* ========================================================================= */}
      <div className="flex-1 flex overflow-hidden relative">
        <main
          ref={canvasPaneRef}
          className="flex-1 min-w-0 flex flex-col bg-[#fcfbf8] dark:bg-[#0e0907] overflow-hidden relative"
        >
          {/* Chart Header Bar */}
          {activeChart ? (
          <div
            className={`${isCanvasNarrow ? 'px-3.5 py-2.5' : 'px-6 py-3'} border-b border-stone-200/80 dark:border-[#382518] bg-[#fdfdfb] dark:bg-[#140e0a] flex flex-wrap items-center justify-between gap-3 shrink-0`}
          >
            <div className="min-w-0 flex-1">
              <h1
                className="font-serif font-bold tracking-tight text-stone-900 dark:text-[#efe4d4] flex items-center gap-2 flex-wrap"
                style={{ fontSize: `${Math.max(19, Math.min(28, Math.round(20 + canvasScaleRatio * 4)))}px` }}
              >
                <span className="truncate">{activeChart.title}</span>
                {geminiFeedback && (
                  <span className="text-xs font-sans font-normal text-amber-600 dark:text-amber-300 animate-pulse">
                    {geminiFeedback}
                  </span>
                )}
              </h1>
              <p className="text-xs text-stone-500 dark:text-[#a69079] line-clamp-1">
                {activeChart.subtitle}
              </p>
            </div>

            {/* View Switcher Tabs */}
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
                onClick={() => setActiveViewMode('stories')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeViewMode === 'stories'
                    ? 'bg-white dark:bg-[#efe4d4] text-stone-900 dark:text-[#110c09] shadow-xs'
                    : 'text-stone-600 dark:text-[#a69079] hover:text-stone-900 dark:hover:text-[#efe4d4]'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Stories</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-stone-300/70 dark:bg-[#382518] text-stone-800 dark:text-[#d8c7b0]">
                  {activeChart.storiesCount}
                </span>
              </button>
            </div>
          </div>
          ) : (
          <div className={`${isCanvasNarrow ? 'px-3.5 py-2.5' : 'px-6 py-3'} border-b border-stone-200/80 dark:border-[#382518] bg-[#fdfdfb] dark:bg-[#140e0a] flex items-center justify-between gap-3 shrink-0`}>
            <div>
              <h1 className="font-serif font-bold text-lg text-stone-900 dark:text-[#efe4d4]">
                Flowchart Studio
              </h1>
              <p className="text-xs text-stone-500 dark:text-[#a69079]">
                Create your own multi-level flowcharts and pathways
              </p>
            </div>
            <button
              type="button"
              onClick={() => setNewChartModalOpen(true)}
              className="px-3.5 py-1.5 rounded-full bg-[#A47C43] hover:bg-[#8e6834] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Flowchart</span>
            </button>
          </div>
          )}

          {/* Sub-Header: Search + 5 Sober Per-Level Auto Themes + Legend & Zoom */}
          <div className={`${isCanvasNarrow ? 'px-3.5' : 'px-6'} py-2 border-b border-stone-200/70 dark:border-[#352317] bg-stone-50/75 dark:bg-[#120c08] flex flex-wrap items-center justify-between gap-2.5 shrink-0 text-xs`}>
            {/* Search Input */}
            <div className="relative flex-1 min-w-[180px] max-w-xs">
              <Search className="w-3.5 h-3.5 text-stone-400 dark:text-[#a69079] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={
                  activeViewMode === 'tree'
                    ? 'Search nodes in this chart...'
                    : 'Search stories, events or names...'
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

            {/* 5 Sober Per-Level Palette Themes + Auto-Generate Control */}
            <div className="flex items-center gap-1.5 flex-wrap" title="5 sober themes — distinct colors per level (L1–L4)">
              <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-stone-500 dark:text-[#a69079] mr-0.5">
                <Palette className="w-3 h-3 text-[#A47C43]" />
                <span className="hidden lg:inline">Themes:</span>
              </span>
              {FLOWCHART_SOBER_THEMES.map((theme) => {
                const isSel = activeTheme.id === theme.id;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => handleSelectSoberTheme(theme.id)}
                    title={`${theme.name} — ${theme.subtitle}`}
                    className={`px-2 py-1 rounded-lg border text-[11px] font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                      isSel
                        ? 'bg-[#5c351c] text-white border-[#5c351c] dark:bg-[#a47c43] dark:text-white dark:border-[#a47c43] shadow-2xs font-semibold'
                        : 'bg-white dark:bg-[#1a120d] text-stone-700 dark:text-[#d8c7b0] border-stone-300/80 dark:border-[#382518] hover:border-[#A47C43]'
                    }`}
                  >
                    <span className="flex items-center -space-x-0.5">
                      {([1, 2, 3, 4] as const).map((lvl) => (
                        <span
                          key={lvl}
                          className="w-2.5 h-2.5 rounded-full border border-white/80 dark:border-black/40"
                          style={{
                            backgroundColor: isDarkThemeMode
                              ? theme.levels[lvl].darkAccent
                              : theme.levels[lvl].lightAccent,
                          }}
                        />
                      ))}
                    </span>
                    <span className="hidden xl:inline">{theme.name.split(' ')[0]}</span>
                  </button>
                );
              })}

              {/* Auto-Generate Sober Multi-Level Palette */}
              <button
                type="button"
                onClick={handleGenerateAutoTheme}
                title="Auto-generate a new sober 4-level color palette"
                className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTheme.isAuto
                    ? 'bg-stone-900 text-white dark:bg-[#efe4d4] dark:text-[#110c09] border-transparent shadow-2xs'
                    : 'bg-white dark:bg-[#1a120d] text-stone-700 dark:text-[#efe4d4] border-stone-300/80 dark:border-[#382518] hover:border-[#A47C43]'
                }`}
              >
                <Shuffle className="w-3 h-3" />
                <span>Auto</span>
                {autoCustomTheme && activeTheme.id === autoCustomTheme.id && (
                  <span className="flex items-center -space-x-0.5">
                    {([1, 2, 3, 4] as const).map((lvl) => (
                      <span
                        key={lvl}
                        className="w-2 h-2 rounded-full border border-white/70"
                        style={{
                          backgroundColor: isDarkThemeMode
                            ? autoCustomTheme.levels[lvl].darkAccent
                            : autoCustomTheme.levels[lvl].lightAccent,
                        }}
                      />
                    ))}
                  </span>
                )}
              </button>
            </div>

            {/* Right Controls: Zoom (Tree mode) or Level Filter (Stories mode) */}
            {activeViewMode === 'tree' ? (
              <div className="flex items-center gap-3">
                <div className="hidden 2xl:flex items-center gap-2.5 text-[10.5px] font-mono text-stone-500 dark:text-[#a69079]">
                  {([1, 2, 3, 4] as const).map((lvl) => (
                    <div key={lvl} className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: lvlAccent(lvl) }} />
                      <span>L{lvl}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-1 bg-white dark:bg-[#1a120d] border border-stone-300 dark:border-[#382518] rounded-xl p-1">
                  <button
                    type="button"
                    onClick={() => setZoomLevel((z) => Math.max(50, z - 15))}
                    className="p-1 rounded text-stone-500 dark:text-[#a69079] hover:text-stone-900 dark:hover:text-[#efe4d4]"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] font-mono px-1 font-semibold min-w-[36px] text-center">
                    {zoomLevel}%
                  </span>
                  <button
                    type="button"
                    onClick={() => setZoomLevel((z) => Math.min(150, z + 15))}
                    className="p-1 rounded text-stone-500 dark:text-[#a69079] hover:text-stone-900 dark:hover:text-[#efe4d4]"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                {(['all', 1, 2, 3, 4] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setStoriesLevelFilter(lvl as any)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                      storiesLevelFilter === lvl
                        ? 'bg-[#5c351c] text-white dark:bg-[#a47c43] shadow-2xs'
                        : 'bg-white dark:bg-[#1a120d] text-stone-600 dark:text-[#a69079] border border-stone-300 dark:border-[#382518]'
                    }`}
                  >
                    {lvl === 'all' ? 'All levels' : `L${lvl}`}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ===================================================================== */}
          {/* VIEWPORT CONTENT (TREE VIEW vs STORIES CARDS VIEW)                     */}
          {/* ===================================================================== */}
          <div className={`flex-1 overflow-auto ${isCanvasNarrow ? 'p-3.5' : 'p-6'} relative custom-scrollbar bg-[#f8f5ee] dark:bg-[#0e0907]`}>

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
                      Build your first flowchart, algorithm, or hierarchy from scratch.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNewChartModalOpen(true)}
                    className="px-5 py-2.5 rounded-full bg-[#A47C43] hover:bg-[#8e6834] text-white text-xs font-semibold inline-flex items-center gap-2 shadow-sm cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create First Flowchart</span>
                  </button>
                </div>
              </div>
            ) : activeViewMode === 'tree' ? (
              <div
                className="w-full min-w-0 transition-transform duration-150 origin-top-left pb-24"
                style={{
                  transform: zoomLevel === 100 ? undefined : `scale(${zoomLevel / 100})`,
                  width: zoomLevel === 100 ? '100%' : `${(10000 / zoomLevel).toFixed(2)}%`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: `${Math.round(28 * canvasScaleRatio)}px`,
                }}
              >
                {/* Level 1 Track */}
                <div className={`flex ${isCanvasNarrow ? 'flex-col items-stretch gap-2.5' : 'items-center gap-4'}`}>
                  <div className={isCanvasNarrow ? 'self-start' : 'w-20 shrink-0'}>
                    <div
                      className="px-2 py-1 rounded-lg border text-[10px] font-mono font-bold text-center uppercase shadow-2xs"
                      style={lvlBadgeStyle(1)}
                    >
                      LEVEL 1{isCanvasNarrow ? ` · ${level1Nodes.length}` : ''}
                      {!isCanvasNarrow && (
                        <>
                          <br />
                          <span className="text-[9px] font-normal font-sans opacity-90">
                            {level1Nodes.length} item{level1Nodes.length === 1 ? '' : 's'}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div
                    className="flex-1 flex flex-wrap justify-center"
                    style={{ gap: `${Math.max(8, Math.round(18 * canvasScaleRatio))}px` }}
                  >
                    {level1Nodes.map((node) => (
                      <NodeBox
                        key={node.id}
                        node={node}
                        levelPalette={lvlPalette(node.level)}
                        isDark={isDarkThemeMode}
                        isSelected={selectedNodeId === node.id}
                        onSelect={() => setSelectedNodeId(node.id)}
                        searchQuery={searchQuery}
                        cardWidthPx={dynamicNodeWidthPx}
                        scaleFactor={canvasScaleRatio}
                      />
                    ))}
                  </div>
                </div>

                {/* Connector between L1 and L2 */}
                {level2Nodes.length > 0 && (
                  <div className="w-full flex justify-center -my-3 py-1 pointer-events-none">
                    <div className="w-0.5 h-6 shadow-2xs" style={{ backgroundColor: lvlLine(2) }} />
                  </div>
                )}

                {/* Level 2 Track */}
                {level2Nodes.length > 0 && (
                  <div className={`flex ${isCanvasNarrow ? 'flex-col items-stretch gap-2.5' : 'items-center gap-4'}`}>
                    <div className={isCanvasNarrow ? 'self-start' : 'w-20 shrink-0'}>
                      <div
                        className="px-2 py-1 rounded-lg border text-[10px] font-mono font-bold text-center uppercase shadow-2xs"
                        style={lvlBadgeStyle(2)}
                      >
                        LEVEL 2{isCanvasNarrow ? ` · ${level2Nodes.length}` : ''}
                        {!isCanvasNarrow && (
                          <>
                            <br />
                            <span className="text-[9px] font-normal font-sans opacity-90">
                              {level2Nodes.length} items
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div
                      className="flex-1 flex flex-wrap justify-center relative pt-3"
                      style={{ gap: `${Math.max(8, Math.round(18 * canvasScaleRatio))}px` }}
                    >
                      <div className="hidden sm:block absolute top-0 left-[18%] right-[18%] h-0.5" style={{ backgroundColor: lvlLine(2) }} />
                      {level2Nodes.map((node) => (
                        <div key={node.id} className="relative flex flex-col items-center">
                          <div className="w-0.5 h-3 -mt-3 mb-0" style={{ backgroundColor: lvlLine(2) }} />
                          <NodeBox
                            node={node}
                            levelPalette={lvlPalette(node.level)}
                            isDark={isDarkThemeMode}
                            isSelected={selectedNodeId === node.id}
                            onSelect={() => setSelectedNodeId(node.id)}
                            searchQuery={searchQuery}
                            cardWidthPx={dynamicNodeWidthPx}
                            scaleFactor={canvasScaleRatio}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Level 3 Track */}
                {level3Nodes.length > 0 && (
                  <div className={`flex ${isCanvasNarrow ? 'flex-col items-stretch gap-2.5' : 'items-center gap-4'} pt-2`}>
                    <div className={isCanvasNarrow ? 'self-start' : 'w-20 shrink-0'}>
                      <div
                        className="px-2 py-1 rounded-lg border text-[10px] font-mono font-bold text-center uppercase shadow-2xs"
                        style={lvlBadgeStyle(3)}
                      >
                        LEVEL 3{isCanvasNarrow ? ` · ${level3Nodes.length}` : ''}
                        {!isCanvasNarrow && (
                          <>
                            <br />
                            <span className="text-[9px] font-normal font-sans opacity-90">
                              {level3Nodes.length} items
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div
                      className="flex-1 flex flex-wrap justify-center relative pt-3"
                      style={{ gap: `${Math.max(8, Math.round(18 * canvasScaleRatio))}px` }}
                    >
                      <div className="hidden sm:block absolute top-0 left-[28%] right-[28%] h-0.5" style={{ backgroundColor: lvlLine(3) }} />
                      {level3Nodes.map((node) => (
                        <div key={node.id} className="relative flex flex-col items-center">
                          <div className="w-0.5 h-3 -mt-3 mb-0" style={{ backgroundColor: lvlLine(3) }} />
                          <NodeBox
                            node={node}
                            levelPalette={lvlPalette(node.level)}
                            isDark={isDarkThemeMode}
                            isSelected={selectedNodeId === node.id}
                            onSelect={() => setSelectedNodeId(node.id)}
                            searchQuery={searchQuery}
                            cardWidthPx={dynamicNodeWidthPx}
                            scaleFactor={canvasScaleRatio}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Level 4 Track */}
                {level4Nodes.length > 0 && (
                  <div className={`flex ${isCanvasNarrow ? 'flex-col items-stretch gap-2.5' : 'items-center gap-4'} pt-2`}>
                    <div className={isCanvasNarrow ? 'self-start' : 'w-20 shrink-0'}>
                      <div
                        className="px-2 py-1 rounded-lg border text-[10px] font-mono font-bold text-center uppercase shadow-2xs"
                        style={lvlBadgeStyle(4)}
                      >
                        LEVEL 4{isCanvasNarrow ? ` · ${level4Nodes.length}` : ''}
                        {!isCanvasNarrow && (
                          <>
                            <br />
                            <span className="text-[9px] font-normal font-sans opacity-90">
                              {level4Nodes.length} protocol
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div
                      className="flex-1 flex flex-wrap justify-center relative pt-3"
                      style={{ gap: `${Math.max(8, Math.round(18 * canvasScaleRatio))}px` }}
                    >
                      <div className="hidden sm:block absolute top-0 left-[32%] right-[32%] h-0.5" style={{ backgroundColor: lvlLine(4) }} />
                      {level4Nodes.map((node) => (
                        <div key={node.id} className="relative flex flex-col items-center">
                          <div className="w-0.5 h-3 -mt-3 mb-0" style={{ backgroundColor: lvlLine(4) }} />
                          <NodeBox
                            node={node}
                            levelPalette={lvlPalette(node.level)}
                            isDark={isDarkThemeMode}
                            isSelected={selectedNodeId === node.id}
                            onSelect={() => setSelectedNodeId(node.id)}
                            searchQuery={searchQuery}
                            cardWidthPx={dynamicNodeWidthPx}
                            scaleFactor={canvasScaleRatio}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* VIEW B: STORIES / CASE CARDS */
              <div className="space-y-4 w-full max-w-6xl mx-auto pb-24">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-stone-200/80 dark:border-[#382518]">
                  <div className="text-xs text-stone-500 dark:text-[#a69079] font-medium font-serif">
                    {activeChart?.storiesCount || 0} stories across {activeChart?.nodesCount || 0} nodes · Theme: {activeTheme.name}
                  </div>
                </div>

                <div className={`grid ${storiesGridClass} gap-3.5`}>
                  {(activeChart?.nodes || [])
                    .filter((n) => storiesLevelFilter === 'all' || n.level === storiesLevelFilter)
                    .filter((n) => {
                      if (!searchQuery.trim()) return true;
                      const q = searchQuery.toLowerCase();
                      return (
                        n.title.toLowerCase().includes(q) ||
                        n.subtitle.toLowerCase().includes(q) ||
                        n.description.toLowerCase().includes(q) ||
                        n.pearls.some((p) => p.toLowerCase().includes(q))
                      );
                    })
                    .map((node) => {
                      const p = lvlPalette(node.level);
                      const accentColor = node.colorOverride && node.color ? node.color : (isDarkThemeMode ? p.darkAccent : p.lightAccent);
                      const cardBg = isDarkThemeMode ? p.darkBg : p.lightBg;
                      const cardBorder = isDarkThemeMode ? p.darkBorder : p.lightBorder;
                      return (
                        <div
                          key={node.id}
                          className="p-5 rounded-2xl border shadow-xs space-y-3 relative overflow-hidden"
                          style={{
                            backgroundColor: cardBg,
                            borderColor: cardBorder,
                            borderLeftColor: accentColor,
                            borderLeftWidth: '4px',
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <div
                                className="w-9 h-9 rounded-full font-bold flex items-center justify-center text-sm border shadow-2xs"
                                style={{
                                  backgroundColor: isDarkThemeMode ? p.darkBadgeBg : p.lightBadgeBg,
                                  color: accentColor,
                                  borderColor: accentColor,
                                }}
                              >
                                {node.photoUrl || node.title.charAt(0)}
                              </div>
                              <div>
                                <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                                  {node.title}
                                </h4>
                                <p className="text-[10px] font-mono text-stone-500 dark:text-[#b7a38c]">
                                  Level {node.level} · {node.subtitle}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedNodeId(node.id);
                                  setActiveViewMode('tree');
                                }}
                                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                                title="View node in lineage tree"
                              >
                                <GitBranch className="w-4 h-4" />
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  alert(`Gathered all stories for ${node.title}`);
                                }}
                                className="px-2.5 py-1 rounded-xl bg-white/75 dark:bg-black/30 hover:bg-white dark:hover:bg-black/50 text-stone-800 dark:text-stone-100 font-semibold text-xs flex items-center gap-1 border border-stone-300/60 dark:border-white/15 transition-colors cursor-pointer"
                              >
                                <Sparkles className="w-3 h-3 text-[#A47C43]" />
                                <span>Gather all</span>
                              </button>
                            </div>
                          </div>

                          <div className="space-y-2 pt-1 border-t border-black/10 dark:border-white/10">
                            {node.pearls.map((pearl, pIdx) => (
                              <div key={pIdx} className="flex items-start gap-2.5 text-xs text-stone-700 dark:text-stone-300">
                                <span
                                  className="w-4 h-4 rounded-full font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5"
                                  style={lvlBadgeStyle(node.level)}
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
        {/* CHATBOX-STYLE BOTTOM DRAWERS (Charts Bottom-Left & Inspector Bottom-Right) */}
        {/* ======================================================================= */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 px-3 sm:px-5 z-30 flex items-end justify-between gap-2 sm:gap-4">
          {/* LEFT CHATBOX DRAWER: CHARTS */}
          <div className="pointer-events-auto flex flex-col items-start">
            {chartsDrawerOpen ? (
              <div className="fc-drawer-slide-up w-[290px] sm:w-[330px] max-h-[66vh] rounded-t-2xl border border-b-0 border-stone-300 dark:border-[#3d291b] bg-[#f8f6f0] dark:bg-[#160f0b] shadow-2xl flex flex-col overflow-hidden">
                {/* Clickable Chatbox Header (Click or Minus to minimize back down) */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setChartsDrawerOpen(false)}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setChartsDrawerOpen(false)}
                  className="px-3.5 py-2.5 border-b border-stone-200/80 dark:border-[#352317] bg-[#eee9de] dark:bg-[#1e1510] flex items-center justify-between gap-2 shrink-0 cursor-pointer select-none hover:bg-[#e5dfd2] dark:hover:bg-[#261a13] transition-colors"
                  title="Minimize Charts list"
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
                      title="Create new flowchart"
                    >
                      + New
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setChartsDrawerOpen(false);
                      }}
                      className="p-1 rounded-md text-stone-500 dark:text-[#a69079] hover:text-stone-900 dark:hover:text-[#efe4d4] hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer"
                      aria-label="Minimize Charts"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Vertical Scrollable List of Flowcharts */}
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
                            ? 'bg-[#5c351c] text-white dark:bg-[#a47c43] dark:text-white border-transparent shadow-xs font-semibold'
                            : 'bg-white/90 dark:bg-[#211711] text-stone-700 dark:text-[#d8c7b0] border-stone-200/80 dark:border-[#382518] hover:border-amber-400/50'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="truncate font-semibold text-xs leading-snug">
                            {c.title}
                          </div>
                          <div
                            className={`text-[10px] truncate mt-0.5 ${
                              isActive ? 'text-white/80' : 'text-stone-500 dark:text-[#a69079]'
                            }`}
                          >
                            {c.subtitle}
                          </div>
                        </div>
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md shrink-0 flex items-center gap-1 ${
                            isActive ? 'bg-black/20 text-white' : 'bg-black/10 dark:bg-black/25'
                          }`}
                        >
                          <Users className="w-2.5 h-2.5 opacity-80" />
                          {c.nodesCount}
                        </span>
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() => setNewChartModalOpen(true)}
                    className="w-full py-2 px-3 rounded-xl border border-dashed border-stone-300 dark:border-[#4b3322] hover:border-amber-500/60 text-xs text-stone-600 dark:text-[#a69079] hover:text-stone-900 dark:hover:text-[#efe4d4] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer bg-white/60 dark:bg-[#140e0a]/60"
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
                className="px-3.5 py-2 rounded-t-2xl border border-b-0 border-stone-300 dark:border-[#3d291b] bg-[#eee9de] dark:bg-[#1e1510] hover:bg-[#e5dfd2] dark:hover:bg-[#281c14] text-stone-800 dark:text-[#efe4d4] shadow-xl flex items-center gap-2 text-xs font-semibold transition-colors cursor-pointer"
                title="Expand Charts vertical list"
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
          <div className="pointer-events-auto mb-2.5 hidden sm:flex items-center gap-2 bg-stone-900/90 dark:bg-[#1c140e]/95 backdrop-blur-md text-white border border-stone-700/80 dark:border-[#382518] rounded-full px-3 py-1.5 shadow-xl">
            <button
              type="button"
              onClick={() => setActiveViewMode(activeViewMode === 'tree' ? 'stories' : 'tree')}
              className="p-1.5 rounded-full hover:bg-stone-800 dark:hover:bg-[#2b1e15] text-stone-300 hover:text-white transition-colors cursor-pointer"
              title="Toggle Tree / Stories View"
            >
              <Eye className="w-4 h-4" />
            </button>
            <div className="h-3 w-px bg-stone-700 dark:bg-[#382518]" />
            <button
              type="button"
              onClick={handleAddChildNode}
              className="px-2.5 py-1 rounded-full bg-[#A47C43] hover:bg-[#8e6834] text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Node</span>
            </button>
          </div>

          {/* RIGHT CHATBOX DRAWER: INSPECTOR */}
          <div className="pointer-events-auto flex flex-col items-end">
            {inspectorDrawerOpen ? (
              <div className="fc-drawer-slide-up w-[310px] sm:w-[375px] max-h-[72vh] rounded-t-2xl border border-b-0 border-stone-300 dark:border-[#3d291b] bg-[#fcfbf8] dark:bg-[#140e0a] shadow-2xl flex flex-col overflow-hidden">
                {/* Clickable Chatbox Header (Click or Minus to minimize back down) */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setInspectorDrawerOpen(false)}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setInspectorDrawerOpen(false)}
                  className="px-4 py-2.5 border-b border-stone-200/80 dark:border-[#352317] bg-[#eee9de] dark:bg-[#1e1510] flex items-center justify-between gap-2 shrink-0 cursor-pointer select-none hover:bg-[#e5dfd2] dark:hover:bg-[#261a13] transition-colors"
                  title="Minimize Inspector"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Sliders className="w-3.5 h-3.5 text-[#8f5f2c] dark:text-[#d4a373] shrink-0" />
                    <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-stone-800 dark:text-[#efe4d4]">
                      Inspector
                    </span>
                    {activeNode && (
                      <span
                        className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-md border truncate max-w-[140px]"
                        style={lvlBadgeStyle(activeNode.level)}
                      >
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
                    className="p-1 rounded-md text-stone-500 dark:text-[#a69079] hover:text-stone-900 dark:hover:text-[#efe4d4] hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer shrink-0"
                    aria-label="Minimize Inspector"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Vertical Scrollable Inspector Body */}
                {activeNode ? (
                  <div className="flex-1 flex flex-col overflow-y-auto p-3.5 space-y-4 custom-scrollbar text-xs">
                    {/* Node Header */}
                    <div className="flex items-start justify-between gap-2.5 border-b border-stone-200/80 dark:border-[#352317] pb-3.5">
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div
                          onClick={() => setPhotoPickerOpen(true)}
                          className="w-11 h-11 rounded-2xl text-lg font-bold flex items-center justify-center shrink-0 cursor-pointer hover:ring-2 hover:ring-[#A47C43] transition-all shadow-2xs relative group border"
                          style={lvlBadgeStyle(activeNode.level)}
                          title="Click to change photo / avatar"
                        >
                          {activeNode.photoUrl || activeNode.title.charAt(0)}
                          <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-mono transition-opacity">
                            Edit
                          </div>
                        </div>

                        <div className="min-w-0 flex-1">
                          <input
                            type="text"
                            value={activeNode.title}
                            onChange={(e) => handleUpdateNodeText('title', e.target.value)}
                            className="w-full font-bold text-sm text-stone-900 dark:text-[#efe4d4] bg-transparent border-b border-transparent hover:border-stone-300 focus:border-amber-500 outline-none transition-colors"
                          />
                          <input
                            type="text"
                            value={activeNode.subtitle}
                            onChange={(e) => handleUpdateNodeText('subtitle', e.target.value)}
                            className="w-full text-xs text-stone-500 dark:text-[#a69079] bg-transparent border-b border-transparent hover:border-stone-300 focus:border-amber-500 outline-none transition-colors"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <span
                          className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full border"
                          style={lvlBadgeStyle(activeNode.level)}
                        >
                          L{activeNode.level}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteNode(activeNode.id)}
                          className="p-1 rounded text-stone-400 hover:text-[#7f1d1d] dark:hover:text-[#c94a4f] transition-colors cursor-pointer"
                          title="Delete Node"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Help From Gemini */}
                    <div className="p-3 rounded-2xl bg-amber-500/10 dark:bg-[#221811] border border-amber-500/25 dark:border-[#4b3322] space-y-2">
                      <div className="text-[10px] font-mono font-bold uppercase text-amber-700 dark:text-amber-400">
                        Help from Gemini
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <button
                          type="button"
                          onClick={handleAddChildNode}
                          className="p-2 rounded-xl bg-white dark:bg-[#1a120d] border border-amber-400/40 dark:border-[#4b3322] hover:bg-amber-50 dark:hover:bg-[#2b1e15] text-stone-800 dark:text-[#efe4d4] font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          <span>Fill next level</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveViewMode('stories')}
                          className="p-2 rounded-xl bg-white dark:bg-[#1a120d] border border-amber-400/40 dark:border-[#4b3322] hover:bg-amber-50 dark:hover:bg-[#2b1e15] text-stone-800 dark:text-[#efe4d4] font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-amber-500" />
                          <span>Gather stories</span>
                        </button>
                      </div>
                    </div>

                    {/* Customisation Controls */}
                    <div className="p-3.5 rounded-2xl bg-stone-100/70 dark:bg-[#1a120d] border border-stone-200 dark:border-[#382518] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-stone-800 dark:text-[#efe4d4] flex items-center gap-1.5">
                          <Sliders className="w-3.5 h-3.5 text-amber-500" />
                          <span>Box Design &amp; Styling</span>
                        </span>
                        {activeNode.colorOverride && (
                          <button
                            type="button"
                            onClick={handleResetNodeThemeColor}
                            className="text-[10px] font-mono text-[#8f5f2c] dark:text-[#d4a373] hover:underline cursor-pointer"
                          >
                            Use Level Theme
                          </button>
                        )}
                      </div>

                      {/* Override Color Swatches */}
                      <div>
                        <label className="block text-[10px] font-semibold text-stone-500 dark:text-[#a69079] mb-1.5">
                          Node Color {activeNode.colorOverride ? '(Custom Override)' : `(Follows ${activeTheme.name} L${activeNode.level})`}:
                        </label>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {COLOR_SWATCHES.map((sw) => {
                            const isSelected = Boolean(activeNode.colorOverride) && activeNode.color === sw.hex;
                            return (
                              <button
                                key={sw.hex}
                                type="button"
                                data-swatch=""
                                onClick={() => handleUpdateNodeColor(sw.hex)}
                                className={`w-6 h-6 rounded-full border shadow-2xs transition-transform cursor-pointer flex items-center justify-center ${
                                  isSelected ? 'scale-110 ring-2 ring-stone-900 dark:ring-white' : 'hover:scale-105'
                                }`}
                                style={{ backgroundColor: sw.hex }}
                                title={sw.name}
                              >
                                {isSelected && <Check className="w-3 h-3 text-white stroke-[3]" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Box Shapes */}
                      <div>
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

                      {/* Photo & Document Features */}
                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-stone-200/80 dark:border-[#352317]">
                        <button
                          type="button"
                          onClick={() => setPhotoPickerOpen(true)}
                          className="p-2 rounded-xl bg-white dark:bg-[#231912] border border-stone-300 dark:border-[#382518] hover:border-amber-400 text-stone-700 dark:text-[#efe4d4] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <ImageIcon className="w-3.5 h-3.5 text-blue-500" />
                          <span>{activeNode.photoUrl ? 'Change Photo' : 'Add Photo'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setDocUploadOpen(true)}
                          className="p-2 rounded-xl bg-white dark:bg-[#231912] border border-stone-300 dark:border-[#382518] hover:border-amber-400 text-stone-700 dark:text-[#efe4d4] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Paperclip className="w-3.5 h-3.5 text-[#8f5f2c] dark:text-amber-400" />
                          <span>Attach Doc</span>
                        </button>
                      </div>

                      {/* Attached Documents List */}
                      {activeNode.documents && activeNode.documents.length > 0 && (
                        <div className="space-y-1.5 pt-1">
                          <span className="text-[10px] font-mono font-bold uppercase text-stone-400 dark:text-[#a69079]">
                            Attached Documents ({activeNode.documents.length}):
                          </span>
                          {activeNode.documents.map((doc) => (
                            <div
                              key={doc.id}
                              className="p-2 rounded-xl bg-white dark:bg-[#231912] border border-stone-200 dark:border-[#382518] flex items-center justify-between text-xs"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <FileText className="w-3.5 h-3.5 text-[#7f1d1d] dark:text-[#c94a4f] shrink-0" />
                                <span className="truncate text-stone-800 dark:text-[#efe4d4] font-medium">
                                  {doc.name}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <span className="text-[10px] font-mono text-stone-400 dark:text-[#a69079]">{doc.size}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveDocument(doc.id)}
                                  className="text-stone-400 hover:text-[#7f1d1d] dark:hover:text-[#c94a4f]"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Numbered Sections (1 ABOUT, 2 CONNECTIONS, 3 CHILDREN, 4 PROTOCOLS) */}
                    <div className="space-y-3.5">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-stone-500 dark:text-[#a69079]">
                          <span className="w-4 h-4 rounded-full bg-stone-200 dark:bg-[#2a1d14] text-center leading-4 text-[10px]">
                            1
                          </span>
                          <span>ABOUT</span>
                        </div>
                        <textarea
                          rows={3}
                          value={activeNode.description}
                          onChange={(e) => handleUpdateNodeText('description', e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-white dark:bg-[#1a120d] border border-stone-200 dark:border-[#382518] text-xs text-stone-800 dark:text-[#efe4d4] outline-none focus:border-amber-500 resize-none leading-relaxed"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-stone-500 dark:text-[#a69079]">
                          <span className="w-4 h-4 rounded-full bg-stone-200 dark:bg-[#2a1d14] text-center leading-4 text-[10px]">
                            2
                          </span>
                          <span>CONNECTIONS / LINEAGE</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white dark:bg-[#1a120d] border border-stone-200 dark:border-[#382518] text-xs text-stone-700 dark:text-[#d8c7b0]">
                          {activeNode.parentId ? (
                            <div className="flex items-center gap-1.5">
                              <span className="text-stone-400 dark:text-[#a69079]">Parent node:</span>
                              <span className="font-semibold text-amber-600 dark:text-amber-400">
                                {activeChart?.nodes.find((n) => n.id === activeNode.parentId)?.title || 'Root'}
                              </span>
                            </div>
                          ) : (
                            <span className="font-medium text-amber-600 dark:text-amber-400">
                              Top Root Ancestor (Level 1)
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-stone-500 dark:text-[#a69079]">
                          <span className="w-4 h-4 rounded-full bg-stone-200 dark:bg-[#2a1d14] text-center leading-4 text-[10px]">
                            3
                          </span>
                          <span>CHILDREN / SUB-NODES</span>
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {(activeChart?.nodes || [])
                            .filter((n) => n.parentId === activeNode.id)
                            .map((child) => (
                              <button
                                key={child.id}
                                type="button"
                                onClick={() => setSelectedNodeId(child.id)}
                                className="px-2.5 py-1 rounded-lg bg-stone-200/80 dark:bg-[#231912] text-stone-800 dark:text-[#efe4d4] text-xs font-medium hover:bg-amber-500/20 hover:text-amber-700 dark:hover:text-amber-300 transition-colors cursor-pointer"
                              >
                                {child.title}
                              </button>
                            ))}
                          <button
                            type="button"
                            onClick={handleAddChildNode}
                            className="px-2 py-1 rounded-lg border border-dashed border-stone-400 dark:border-[#4b3322] text-xs text-stone-500 dark:text-[#a69079] hover:text-amber-500 flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add</span>
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-stone-500 dark:text-[#a69079]">
                          <span className="w-4 h-4 rounded-full bg-stone-200 dark:bg-[#2a1d14] text-center leading-4 text-[10px]">
                            4
                          </span>
                          <span>CLINICAL PROTOCOLS / PEARLS</span>
                        </div>
                        <div className="space-y-1.5">
                          {activeNode.pearls.map((pearl, pIdx) => (
                            <div key={pIdx} className="p-2.5 rounded-xl bg-white dark:bg-[#1a120d] border border-stone-200 dark:border-[#382518] text-xs text-stone-700 dark:text-[#d8c7b0] flex items-start gap-2">
                              <span className="w-3.5 h-3.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-400 font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5">
                                {pIdx + 1}
                              </span>
                              <p className="leading-relaxed flex-1">{pearl}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddChildNode}
                      className="w-full py-2.5 rounded-2xl bg-[#A47C43] hover:bg-[#8e6834] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add child manually</span>
                    </button>

                    {/* Mini-Map Card */}
                    <div className="p-3.5 rounded-2xl bg-[#f5f1e8] dark:bg-[#1a120d] border border-amber-300/80 dark:border-[#382518] space-y-2.5">
                      <div>
                        <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-[#efe4d4]">
                          Where you are
                        </h4>
                        <p className="text-[11px] text-stone-500 dark:text-[#a69079]">
                          {activeNode.level === 1 ? 'At the root of the line' : `In Level ${activeNode.level} pathway`} · {activeNode.level} of {totalLevels} levels
                        </p>
                      </div>
                      <div className="p-2 rounded-xl border flex items-center justify-between text-xs font-semibold" style={lvlBadgeStyle(activeNode.level)}>
                        <span className="font-mono text-[11px]">L{activeNode.level}</span>
                        <span className="truncate px-2">{activeNode.title}</span>
                        <span className="text-[10px] font-mono opacity-80">you are here</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center text-xs text-stone-400">
                    Select a node in the tree to inspect details.
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setInspectorDrawerOpen(true)}
                className="px-3.5 py-2 rounded-t-2xl border border-b-0 border-stone-300 dark:border-[#3d291b] bg-[#eee9de] dark:bg-[#1e1510] hover:bg-[#e5dfd2] dark:hover:bg-[#281c14] text-stone-800 dark:text-[#efe4d4] shadow-xl flex items-center gap-2 text-xs font-semibold transition-colors cursor-pointer"
                title="Expand Inspector vertical list"
              >
                <Sliders className="w-3.5 h-3.5 text-[#8f5f2c] dark:text-[#d4a373]" />
                <span className="font-mono uppercase tracking-wider text-[11px] font-bold">Inspector</span>
                {activeNode && (
                  <span
                    className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.2 rounded-md border truncate max-w-[125px]"
                    style={lvlBadgeStyle(activeNode.level)}
                  >
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
      {/* 3. PHOTO / AVATAR PICKER MODAL (Photo Adding Feature)                      */}
      {/* ========================================================================= */}
      {photoPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-[#fcfbf8] dark:bg-[#18110c] border border-stone-300 dark:border-[#382518] rounded-3xl max-w-md w-full p-6 text-stone-900 dark:text-[#efe4d4] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-[#352317] pb-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-amber-500" />
                <h3 className="font-serif font-bold text-lg">Node Photo &amp; Avatar</h3>
              </div>
              <button
                type="button"
                onClick={() => setPhotoPickerOpen(false)}
                className="text-stone-400 hover:text-stone-700 dark:hover:text-[#efe4d4]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Medical Presets */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-stone-600 dark:text-[#a69079]">
                Medical &amp; Clinical Icon Presets:
              </label>
              <div className="grid grid-cols-5 gap-2">
                {MEDICAL_AVATAR_PRESETS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => handleAddPhoto(p.icon)}
                    className="p-3 rounded-xl bg-white dark:bg-[#231912] border border-stone-200 dark:border-[#382518] hover:border-amber-500 text-2xl flex items-center justify-center transition-all cursor-pointer hover:scale-105"
                    title={p.label}
                  >
                    {p.icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom URL or Emoji */}
            <div className="space-y-1.5 pt-2 border-t border-stone-200 dark:border-[#352317] text-xs">
              <label className="font-semibold text-stone-600 dark:text-[#a69079]">
                Or Paste Image URL / Custom Emoji:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="https://... or emoji"
                  value={newPhotoInput}
                  onChange={(e) => setNewPhotoInput(e.target.value)}
                  className="flex-1 bg-white dark:bg-[#110c09] border border-stone-300 dark:border-[#382518] rounded-xl px-3 py-2 text-xs outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={() => newPhotoInput && handleAddPhoto(newPhotoInput)}
                  className="px-4 py-2 rounded-xl bg-[#A47C43] hover:bg-[#8e6b39] text-white font-semibold text-xs"
                >
                  Apply
                </button>
              </div>
            </div>

            {activeNode?.photoUrl && (
              <div className="pt-2 flex justify-between items-center text-xs text-stone-500 dark:text-[#a69079]">
                <span>Current: {activeNode.photoUrl}</span>
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="text-[#7f1d1d] dark:text-[#c94a4f] hover:underline"
                >
                  Remove Photo
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. DOCUMENT ATTACH MODAL (Document Adding Feature)                         */}
      {/* ========================================================================= */}
      {docUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-[#fcfbf8] dark:bg-[#18110c] border border-stone-300 dark:border-[#382518] rounded-3xl max-w-md w-full p-6 text-stone-900 dark:text-[#efe4d4] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-[#352317] pb-3">
              <div className="flex items-center gap-2">
                <Paperclip className="w-4 h-4 text-[#8f5f2c] dark:text-amber-400" />
                <h3 className="font-serif font-bold text-lg">Attach Clinical Document</h3>
              </div>
              <button
                type="button"
                onClick={() => setDocUploadOpen(false)}
                className="text-stone-400 hover:text-stone-700 dark:hover:text-[#efe4d4]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAttachDocument} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-600 dark:text-[#a69079] mb-1">
                  Document / Guideline Title:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AHA_AHA_STEMI_Algorithm_2026.pdf"
                  value={newDocForm.name}
                  onChange={(e) => setNewDocForm({ ...newDocForm, name: e.target.value })}
                  className="w-full bg-white dark:bg-[#110c09] border border-stone-300 dark:border-[#382518] rounded-xl px-3.5 py-2 text-xs outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-600 dark:text-[#a69079] mb-1">
                    Document Type:
                  </label>
                  <select
                    value={newDocForm.type}
                    onChange={(e) => setNewDocForm({ ...newDocForm, type: e.target.value as any })}
                    className="w-full bg-white dark:bg-[#110c09] border border-stone-300 dark:border-[#382518] rounded-xl px-3 py-2 text-xs outline-none"
                  >
                    <option value="pdf">Clinical PDF Guidelines</option>
                    <option value="doc">Word / Text Protocol</option>
                    <option value="sheet">Excel / Scoring Sheet</option>
                    <option value="notes">Ward Study Notes</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-600 dark:text-[#a69079] mb-1">
                    Simulated File Size:
                  </label>
                  <input
                    type="text"
                    value={newDocForm.size}
                    onChange={(e) => setNewDocForm({ ...newDocForm, size: e.target.value })}
                    className="w-full bg-white dark:bg-[#110c09] border border-stone-300 dark:border-[#382518] rounded-xl px-3 py-2 text-xs outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200 dark:border-[#352317]">
                <button
                  type="button"
                  onClick={() => setDocUploadOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-200 dark:bg-[#231912] text-stone-700 dark:text-[#d8c7b0] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#8f5f2c] hover:bg-[#754b20] text-white font-semibold"
                >
                  Attach to Node
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-[#fcfbf8] dark:bg-[#18110c] border border-stone-300 dark:border-[#382518] rounded-3xl max-w-md w-full p-6 text-stone-900 dark:text-[#efe4d4] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-[#352317] pb-3">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-500" />
                <h3 className="font-serif font-bold text-lg">Create New Flowchart</h3>
              </div>
              <button
                type="button"
                onClick={() => setNewChartModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 dark:hover:text-[#efe4d4]"
              >
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
                  subtitle: newChartForm.subtitle.trim() || 'New clinical diagnostic pathway',
                  category: newChartForm.category.trim() || 'Clinical Medicine',
                  nodesCount: 1,
                  levelsCount: 1,
                  storiesCount: 1,
                  lastUpdated: 'Just now',
                  nodes: [
                    {
                      id: `node-${Date.now()}-root`,
                      level: 1,
                      title: `${newChartForm.title.trim()} Presentation`,
                      subtitle: 'Primary diagnostic trigger or symptom',
                      description: 'Define initial presentation, vital signs and inclusion criteria.',
                      pearls: ['Primary board examination and ward clinical pearl.'],
                      color: '#A47C43',
                      shape: 'card',
                      size: 'normal',
                      badge: 'Level 1 · Gatekeeper',
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
                <label className="block font-semibold text-stone-600 dark:text-[#a69079] mb-1">
                  Flowchart Title:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Heart Failure with Reduced Ejection Fraction (HFrEF)"
                  value={newChartForm.title}
                  onChange={(e) => setNewChartForm({ ...newChartForm, title: e.target.value })}
                  className="w-full bg-white dark:bg-[#110c09] border border-stone-300 dark:border-[#382518] rounded-xl px-3.5 py-2 text-xs outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-600 dark:text-[#a69079] mb-1">
                  Medical Subject / Specialty:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Cardiology & Pharmacotherapy"
                  value={newChartForm.category}
                  onChange={(e) => setNewChartForm({ ...newChartForm, category: e.target.value })}
                  className="w-full bg-white dark:bg-[#110c09] border border-stone-300 dark:border-[#382518] rounded-xl px-3.5 py-2 text-xs outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-600 dark:text-[#a69079] mb-1">
                  Summary / Subtitle:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Guideline-directed medical therapy: ARNI, Beta-blocker, MRA & SGLT2i"
                  value={newChartForm.subtitle}
                  onChange={(e) => setNewChartForm({ ...newChartForm, subtitle: e.target.value })}
                  className="w-full bg-white dark:bg-[#110c09] border border-stone-300 dark:border-[#382518] rounded-xl px-3.5 py-2 text-xs outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200 dark:border-[#352317]">
                <button
                  type="button"
                  onClick={() => setNewChartModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-200 dark:bg-[#231912] text-stone-700 dark:text-[#d8c7b0] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold"
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
// SUB-COMPONENT: FLOWCHART NODE BOX (Matching Screenshot 2 & Custom Shapes)
// =============================================================================
const NodeBox: React.FC<{
  node: StudioFlowNode;
  levelPalette: FlowchartLevelPalette;
  isDark: boolean;
  isSelected: boolean;
  onSelect: () => void;
  searchQuery?: string;
  cardWidthPx?: number;
  scaleFactor?: number;
}> = ({ node, levelPalette, isDark, isSelected, onSelect, searchQuery = '', cardWidthPx = 225, scaleFactor = 1 }) => {
  const shape = node.shape || 'rounded';
  const baseAccent = isDark ? levelPalette.darkAccent : levelPalette.lightAccent;
  const accentColor = node.colorOverride && node.color ? node.color : baseAccent;
  const cardBg = node.colorOverride && node.color
    ? (isDark ? `${node.color}1c` : `${node.color}12`)
    : (isDark ? levelPalette.darkBg : levelPalette.lightBg);
  const cardBorder = node.colorOverride && node.color
    ? `${node.color}66`
    : (isDark ? levelPalette.darkBorder : levelPalette.lightBorder);
  const badgeBg = node.colorOverride && node.color
    ? `${node.color}22`
    : (isDark ? levelPalette.darkBadgeBg : levelPalette.lightBadgeBg);
  const badgeText = node.colorOverride && node.color
    ? accentColor
    : (isDark ? levelPalette.darkBadgeText : levelPalette.lightBadgeText);

  // Search matching highlights
  const isSearchMatch = searchQuery.trim()
    ? node.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.pearls.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase()))
    : false;

  const isDimmedBySearch = searchQuery.trim() && !isSearchMatch;

  // Shape class calculation
  let shapeClass = 'rounded-2xl';
  if (shape === 'pill') shapeClass = 'rounded-full px-5';
  else if (shape === 'rectangle') shapeClass = 'rounded-none';
  else if (shape === 'diamond') shapeClass = 'rounded-lg rotate-0 border-2';
  else if (shape === 'hexagon') shapeClass = 'rounded-xl';

  const padPx = Math.max(8, Math.round(13 * scaleFactor));
  const avatarPx = Math.max(20, Math.round(28 * scaleFactor));
  const titlePx = Math.max(10.5, +(12 * Math.max(0.84, scaleFactor)).toFixed(1));
  const subPx = Math.max(9, +(10 * Math.max(0.84, scaleFactor)).toFixed(1));
  const descPx = Math.max(9.5, +(10.5 * Math.max(0.84, scaleFactor)).toFixed(1));

  return (
    <div
      onClick={onSelect}
      className={`border transition-all duration-150 cursor-pointer shadow-sm relative group ${shapeClass} ${
        isSearchMatch
          ? 'ring-4 ring-amber-400 shadow-xl scale-105 z-20'
          : isSelected
          ? 'ring-2 shadow-md'
          : isDimmedBySearch
          ? 'opacity-35'
          : 'hover:shadow-md'
      }`}
      style={{
        width: `${cardWidthPx}px`,
        padding: `${padPx}px`,
        backgroundColor: cardBg,
        borderColor: isSelected ? accentColor : cardBorder,
        borderTopColor: accentColor,
        borderTopWidth: shape === 'card' ? '4px' : '2.5px',
        boxShadow: isSelected ? `0 0 0 1px ${accentColor}` : undefined,
      }}
    >
      {/* Top Row: Avatar / Photo + Title */}
      <div className="flex items-center gap-2 mb-1.5">
        {/* Photo / Avatar */}
        <div
          className="rounded-full border font-bold flex items-center justify-center shrink-0 shadow-2xs"
          style={{
            backgroundColor: badgeBg,
            color: badgeText,
            borderColor: accentColor,
            width: `${avatarPx}px`,
            height: `${avatarPx}px`,
            fontSize: `${titlePx}px`,
          }}
        >
          {node.photoUrl || node.title.charAt(0)}
        </div>

        <div className="min-w-0 flex-1">
          <div
            className="font-bold text-stone-900 dark:text-stone-100 truncate transition-colors"
            style={{ fontSize: `${titlePx}px` }}
          >
            {node.title}
          </div>
          <div
            className="text-stone-600 dark:text-stone-300/80 truncate"
            style={{ fontSize: `${subPx}px` }}
          >
            {node.subtitle}
          </div>
        </div>
      </div>

      {/* Description Snippet */}
      <p
        className="text-stone-700 dark:text-stone-300 line-clamp-2 leading-relaxed mb-2"
        style={{ fontSize: `${descPx}px` }}
      >
        {node.description}
      </p>

      {/* Badges / Document Indicator */}
      <div className="flex items-center justify-between text-[9px] font-mono border-t border-black/10 dark:border-white/10 pt-1.5 text-stone-500 dark:text-stone-400">
        <span
          className="px-1.5 py-0.2 rounded font-semibold"
          style={{ backgroundColor: badgeBg, color: badgeText }}
        >
          L{node.level}
        </span>

        {node.documents && node.documents.length > 0 && (
          <span className="flex items-center gap-1 text-[#8f5f2c] dark:text-amber-400 font-semibold">
            <Paperclip className="w-2.5 h-2.5" />
            <span>{node.documents.length} doc</span>
          </span>
        )}
      </div>
    </div>
  );
};
