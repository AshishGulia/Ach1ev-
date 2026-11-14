import React, { useState } from 'react';
import { DesignId } from '../../types';
import { getThemeMeta } from '../../data/themeMeta';
import {
  Maximize2,
  Check,
  X,
  Heart,
  CheckCircle2,
  BookOpen,
  Sun,
  Moon,
  LayoutDashboard,
  BookOpenText,
  PenTool,
  CalendarDays,
  Users,
  Brain,
  Coffee,
  MessageSquareCode,
  Settings as SettingsIcon,
  Trash2,
} from 'lucide-react';

export interface ThemeAppStorePreviewsProps {
  editionId: DesignId;
  isSelected?: boolean;
  onApply?: () => void;
  previewMode?: 'light' | 'dark';
  onChangePreviewMode?: (mode: 'light' | 'dark') => void;
}

export type SectionType = 'my-space' | 'read-studio' | 'create-note' | 'my-shelf';

interface ScreenshotData {
  id: SectionType;
  title: string;
  sectionBadge: string;
  tagline: string;
  description: string;
  features: string[];
}

const SECTION_DATA: Record<SectionType, ScreenshotData> = {
  'my-space': {
    id: 'my-space',
    title: 'Cockpit & Sidebar',
    sectionBadge: 'Section 1 · Full Sidebar & Cockpit',
    tagline: 'All Sidebar Sections, Slabs & Workspace Wallpaper',
    description:
      'Preview every sidebar section (Cockpit, Read, Create note, Calendar, Shelf, Mnemonics, Ach1evers Hub, Leisure, Talk to Developer, Settings & Trash) and study slabs in both Light and Dark mode.',
    features: [
      'Complete sidebar rail preview across all 5 themes',
      'Blurred theme wallpaper & custom watermarks in Themes 2–5',
      'Distinct sober button silhouette per edition',
      'High-contrast Dark Mode typography & Light/Dark toggle',
    ],
  },
  'read-studio': {
    id: 'read-studio',
    title: 'Read Studio',
    sectionBadge: 'Section 2 · Clinical Atlas',
    tagline: 'Dual-Page Textbook Reader & Anatomical Snip',
    description:
      'Dual-page medical PDF reader, chapter index drawer, boundary hover stretch slider, and snip-to-note toolbar across every theme — adapted in each theme’s header bar, sidebar rail, and wallpaper depth.',
    features: [
      'Dual-page spread with anatomical snip tool',
      'Matching gradient slim sidebar & header glass bar',
      'Consistent controls across every edition',
      'Direct one-click snip into Create Note',
    ],
  },
  'create-note': {
    id: 'create-note',
    title: 'Create Note',
    sectionBadge: 'Section 3 · Ruled Studio',
    tagline: 'Ruled Notebook, Rich Ribbon, Fonts & Tables',
    description:
      'Same MS-Word-inspired formatting ribbon, color & highlighter pickers, draggable resizable tables, full font selector, speech-to-text, and mouse-drag paper width control across all 5 editions.',
    features: [
      'Aligned ruled notebook paper with draggable paper edge',
      'Full font list + straight & natural underline options',
      'Movable & border-resizable color-formatted tables',
      'Theme-matched ribbon buttons & frosted paper stage',
    ],
  },
  'my-shelf': {
    id: 'my-shelf',
    title: 'Shelf & Room',
    sectionBadge: 'Section 4 · Living Almirah Room',
    tagline: '25 Unique Backdrops, 5 Rugs, Left Lamp & Stealthy Cat',
    description:
      'Each theme transforms the 3D Shelf sanctuary with 5 non-repeating bay backdrops (25 total across 5 themes), left-side standing lamp, right-side potted plant, custom carpet design, themed almirah finishes, and a sneaky alert cat.',
    features: [
      '25 zero-repeat backdrops (5 unique bays × 5 themes)',
      '5 unique theme-matched carpet silhouettes & weaves',
      'Standing lamp on left & fig plant on right across all themes',
      'Daylight sunlight dialog & night study ambiance',
    ],
  },
};

const SHELF_WORLD_PREVIEW: Record<
  DesignId,
  {
    emoji: string;
    worldLabel: string;
    rugLabel: string;
    skyBg: string;
    cabinetBg: string;
    cabinetBorder: string;
    rugColor: string;
    accentBadge: string;
  }
> = {
  '1': {
    emoji: '🦋✨',
    worldLabel: 'Heritage Study',
    rugLabel: 'Cream Chenille',
    skyBg: 'linear-gradient(180deg, #272320 0%, #3a3027 68%, #6d4726 100%)',
    cabinetBg: '#3b2114',
    cabinetBorder: '#b36d2c',
    rugColor: '#ded4c0',
    accentBadge: 'Warm Espresso Dark & Marble Leisure',
  },
  '2': {
    emoji: '🌲🦋',
    worldLabel: 'Forest Sanctuary',
    rugLabel: 'Botanical Ring',
    skyBg: 'linear-gradient(180deg, #2c4c38 0%, #1d3527 68%, #4b432e 100%)',
    cabinetBg: '#233429',
    cabinetBorder: '#6e5a3e',
    rugColor: '#b0bea6',
    accentBadge: 'Leaf-Contour Buttons',
  },
  '3': {
    emoji: '🌊🐬',
    worldLabel: 'Beach Balcony',
    rugLabel: 'Scalloped Wave',
    skyBg: 'linear-gradient(180deg, #7ec4d8 0%, #3a8fa8 56%, #cfc1ab 100%)',
    cabinetBg: '#465864',
    cabinetBorder: '#c9b18e',
    rugColor: '#e8dec9',
    accentBadge: 'Clickable Leaping Dolphins',
  },
  '4': {
    emoji: '🌧️☕',
    worldLabel: 'Monsoon Veranda',
    rugLabel: 'Slate Runner',
    skyBg: 'linear-gradient(180deg, #243347 0%, #172230 68%, #47413a 100%)',
    cabinetBg: '#272f3b',
    cabinetBorder: '#64768a',
    rugColor: '#8d99a6',
    accentBadge: 'Heavy Rain Balcony & Puddles',
  },
  '5': {
    emoji: '🌿🖤',
    worldLabel: 'Pistachio & Obsidian',
    rugLabel: 'Pistachio Velvet Weave',
    skyBg: 'linear-gradient(180deg, #f5f8ee 0%, #578440 45%, #070709 100%)',
    cabinetBg: '#111215',
    cabinetBorder: '#e5eed6',
    rugColor: '#e4edd5',
    accentBadge: 'Creamish Pista & Pitch Black',
  },
};

const SIDEBAR_SECTIONS_MINI = [
  { id: 'my-space', label: 'Cockpit', icon: LayoutDashboard },
  { id: 'read-studio', label: 'Read', icon: BookOpenText },
  { id: 'create-note', label: 'Note', icon: PenTool },
  { id: 'roster', label: 'Cal', icon: CalendarDays },
  { id: 'my-shelf', label: 'Shelf', icon: BookOpen },
  { id: 'mnemonics', label: 'Mnem.', icon: Brain },
  { id: 'community', label: 'Hub', icon: Users },
  { id: 'leisure', label: 'Leisure', icon: Coffee },
  { id: 'talk-to-dev', label: 'Dev', icon: MessageSquareCode },
];

export const ThemeAppStorePreviews: React.FC<ThemeAppStorePreviewsProps> = ({
  editionId,
  onApply,
  previewMode = 'light',
  onChangePreviewMode,
}) => {
  const [activeModalSection, setActiveModalSection] = useState<SectionType | null>(null);
  const [localPreviewMode, setLocalPreviewMode] = useState<'light' | 'dark'>(previewMode);
  const effectiveMode = onChangePreviewMode ? previewMode : localPreviewMode;
  const isDark = effectiveMode === 'dark';

  const meta = getThemeMeta(editionId);
  const sb = isDark ? meta.sidebar.dark : meta.sidebar.light;
  const shelfWorld = SHELF_WORLD_PREVIEW[editionId] ?? SHELF_WORLD_PREVIEW['1'];
  const btnRadius = meta.buttonRadius;

  const tBg = isDark ? meta.darkBg : meta.lightBg;
  const tSurface = isDark ? meta.darkSurface : meta.lightSurface;
  const tRaised = isDark ? meta.darkRaised : meta.lightRaised;
  const tHeader = isDark ? meta.darkHeader : meta.lightHeader;
  const tBorder = isDark ? meta.darkBorder : meta.lightBorder;
  const tInk = isDark ? meta.darkInk : meta.lightInk;
  const tMuted = isDark ? meta.darkMuted : meta.lightMuted;
  const tAccent = isDark ? meta.darkAccent : meta.lightAccent;
  const tAccentSoft = isDark ? meta.darkAccentSoft : meta.lightAccentSoft;
  const tWallpaper = isDark ? meta.darkWallpaperUri : meta.lightWallpaperUri;

  const sections: SectionType[] = ['my-space', 'read-studio', 'create-note', 'my-shelf'];

  const workspacePreviewStyle: React.CSSProperties = {
    backgroundColor: tBg,
    backgroundImage: tWallpaper || 'none',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    color: tInk,
  };

  // Shared miniature full-sidebar replica showing EVERY section for each theme in Light/Dark
  const renderSidebarRailReplica = (activeMiniId: string, expandedScale = false) => (
    <div
      className={`${expandedScale ? 'w-20 p-1.5' : 'w-12 sm:w-14 p-1'} shrink-0 flex flex-col justify-between border-r overflow-hidden`}
      style={{
        background: sb.railBg,
        borderColor: sb.railBorder,
      }}
    >
      <div className="space-y-0.5 min-w-0">
        <div
          className={`${expandedScale ? 'text-[8px]' : 'text-[6px]'} font-black tracking-tight truncate px-0.5 mb-0.5`}
          style={{ color: tAccent }}
        >
          ACH1EV
        </div>
        <div
          className="rounded-md p-0.5 space-y-0.5"
          style={{
            background: sb.navSectionBg,
            border: `1px solid ${sb.sectionBorder}`,
          }}
        >
          {SIDEBAR_SECTIONS_MINI.map((s) => {
            const Icon = s.icon;
            const isAct = s.id === activeMiniId;
            return (
              <div
                key={s.id}
                className={`flex items-center gap-1 px-1 ${expandedScale ? 'py-0.5 text-[7px]' : 'py-[1px] text-[5px]'} font-medium truncate`}
                style={{
                  background: isAct ? sb.activeBtnBg : sb.idleBtnBg,
                  color: isAct ? sb.activeBtnText : sb.idleBtnText,
                  border: isAct ? `1px solid ${sb.activeBtnBorder}` : '1px solid transparent',
                  borderRadius: btnRadius,
                }}
              >
                <Icon
                  className={`${expandedScale ? 'w-2.5 h-2.5' : 'w-2 h-2'} shrink-0`}
                  style={{ color: isAct ? sb.activeIconColor : sb.idleIconColor }}
                />
                <span className="truncate">{s.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div
        className="rounded-md p-0.5 space-y-0.5 mt-0.5"
        style={{
          background: sb.footerSectionBg,
          border: `1px solid ${sb.sectionBorder}`,
        }}
      >
        <div
          className={`flex items-center gap-1 px-1 ${expandedScale ? 'text-[6.5px]' : 'text-[4.5px]'} truncate`}
          style={{ color: sb.idleBtnText }}
        >
          <SettingsIcon className="w-2 h-2 shrink-0" style={{ color: sb.idleIconColor }} />
          <span>Settings</span>
        </div>
        <div
          className={`flex items-center gap-1 px-1 ${expandedScale ? 'text-[6.5px]' : 'text-[4.5px]'} truncate`}
          style={{ color: sb.trashTextColor }}
        >
          <Trash2 className="w-2 h-2 shrink-0" style={{ color: sb.trashIconColor }} />
          <span>Trash</span>
        </div>
      </div>
    </div>
  );

  const renderMiniPreview = (section: SectionType, isLightbox = false) => {
    switch (section) {
      case 'my-space':
        return (
          <div className="w-full h-full flex select-none overflow-hidden" style={workspacePreviewStyle}>
            {renderSidebarRailReplica('my-space', isLightbox)}

            {/* Unified Cockpit Content Replica */}
            <div className="flex-1 p-1.5 sm:p-2 flex flex-col justify-between min-w-0">
              <div
                className="flex items-center justify-between pb-1 border-b"
                style={{ borderColor: tBorder }}
              >
                <span className="text-[7.5px] sm:text-[8.5px] font-bold uppercase tracking-wide truncate">
                  {meta.name}
                </span>
                <span
                  className="text-[5.5px] sm:text-[6.5px] px-1.5 py-0.5 font-semibold shadow-2xs shrink-0"
                  style={{
                    background: isDark ? tAccent : `linear-gradient(135deg, ${meta.lightAccent}, ${meta.darkBorder})`,
                    color: isDark ? '#110c09' : '#ffffff',
                    borderRadius: btnRadius,
                  }}
                >
                  {isDark ? 'Dark' : 'Light'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-1 my-1 flex-1">
                <div
                  className="p-1.5 rounded-lg border flex flex-col justify-between backdrop-blur-xs"
                  style={{ background: tSurface, borderColor: tBorder }}
                >
                  <span className="text-[6.5px] sm:text-[7.5px] font-bold truncate">Cardiology Slab</span>
                  <div className="h-1 rounded-full overflow-hidden my-0.5" style={{ background: tAccentSoft }}>
                    <div className="w-3/4 h-full" style={{ background: tAccent }} />
                  </div>
                  <span className="text-[5.5px]" style={{ color: tMuted }}>
                    Tasks · Timer
                  </span>
                </div>

                <div
                  className="p-1.5 rounded-lg border flex flex-col justify-between backdrop-blur-xs"
                  style={{ background: tRaised, borderColor: tBorder }}
                >
                  <span className="text-[6.5px] sm:text-[7.5px] font-bold truncate">Daily Agenda</span>
                  <span className="text-[5.5px]" style={{ color: tMuted }}>
                    {meta.shapeName}
                  </span>
                  <span className="text-[5.5px] font-bold truncate" style={{ color: tAccent }}>
                    {isDark ? 'Night Atelier' : 'Daylight Mode'}
                  </span>
                </div>
              </div>

              <div
                className="flex items-center justify-between text-[5.5px] sm:text-[6px] font-mono border-t pt-0.5"
                style={{ borderColor: tBorder, color: tMuted }}
              >
                <span>Theme {editionId}</span>
                <span className="font-bold" style={{ color: tAccent }}>
                  All Sections Active
                </span>
              </div>
            </div>
          </div>
        );

      case 'read-studio':
        return (
          <div className="w-full h-full flex select-none overflow-hidden" style={workspacePreviewStyle}>
            {renderSidebarRailReplica('read-studio', isLightbox)}
            <div className="flex-1 p-1.5 sm:p-2 flex flex-col justify-between min-w-0">
              <div
                className="flex items-center justify-between border-b pb-1 px-1.5 py-0.5 rounded-md"
                style={{ background: tHeader, borderColor: tBorder }}
              >
                <div className="flex items-center gap-1 truncate">
                  <BookOpen className="w-3 h-3 shrink-0" style={{ color: tAccent }} />
                  <span className="text-[7px] sm:text-[8px] font-serif font-bold truncate">
                    Harrison&apos;s Medicine
                  </span>
                </div>
                <span
                  className="text-[5.5px] font-mono px-1.5 py-0.5 font-bold shrink-0"
                  style={{
                    background: tAccent,
                    color: isDark ? '#110c09' : '#ffffff',
                    borderRadius: btnRadius,
                  }}
                >
                  Snip
                </span>
              </div>

              <div className="grid grid-cols-2 gap-1 my-1 flex-1">
                <div
                  className="p-1.5 rounded border space-y-1 shadow-2xs"
                  style={{ background: tSurface, borderColor: tBorder }}
                >
                  <div className="h-1.5 rounded-xs w-3/4" style={{ background: tInk }} />
                  <div className="h-0.5 rounded-xs w-full" style={{ background: tBorder }} />
                  <div className="h-0.5 rounded-xs w-5/6" style={{ background: tBorder }} />
                  <div className="h-0.5 rounded-xs w-full" style={{ background: tBorder }} />
                </div>
                <div
                  className="p-1 rounded border flex flex-col items-center justify-center shadow-2xs"
                  style={{ background: tSurface, borderColor: tBorder }}
                >
                  <div
                    className="w-6 h-5 flex items-center justify-center border"
                    style={{
                      background: tAccentSoft,
                      borderColor: tBorder,
                      borderRadius: btnRadius,
                    }}
                  >
                    <Heart className="w-3 h-3" style={{ color: tAccent }} />
                  </div>
                  <span className="text-[5.5px] font-bold mt-0.5">Coronary Atlas</span>
                </div>
              </div>

              <div
                className="flex items-center justify-between text-[5.5px] font-mono border-t pt-0.5"
                style={{ borderColor: tBorder, color: tMuted }}
              >
                <span>Dual Reader</span>
                <span className="font-bold" style={{ color: tAccent }}>
                  {isDark ? 'Dark' : 'Light'}
                </span>
              </div>
            </div>
          </div>
        );

      case 'create-note':
        return (
          <div className="w-full h-full flex select-none overflow-hidden" style={workspacePreviewStyle}>
            {renderSidebarRailReplica('create-note', isLightbox)}
            <div className="flex-1 p-1.5 sm:p-2 flex flex-col justify-between min-w-0">
              <div
                className="flex items-center justify-between border-b pb-1 px-1.5 py-0.5 rounded-md"
                style={{ background: tHeader, borderColor: tBorder }}
              >
                <span className="text-[7px] sm:text-[8px] font-bold font-serif truncate">
                  Ruled Studio
                </span>
                <div className="flex items-center gap-1 shrink-0">
                  <span
                    className="px-1.5 py-0.5 text-[5.5px] font-bold"
                    style={{
                      background: tAccent,
                      color: isDark ? '#110c09' : '#ffffff',
                      borderRadius: btnRadius,
                    }}
                  >
                    Fonts
                  </span>
                </div>
              </div>

              <div
                className="my-1 pl-2 pr-1.5 py-1 flex-1 flex flex-col justify-between rounded border shadow-2xs"
                style={{
                  background: isDark ? '#1a1410' : '#fcfbf7',
                  borderColor: tBorder,
                  borderLeft: `3px solid ${tAccent}`,
                  color: isDark ? '#efe4d4' : '#1f2329',
                }}
              >
                <div className="space-y-1">
                  <div className="text-[6.5px] font-semibold truncate">Ward Note Summary</div>
                  <div className="h-0.5 bg-sky-300/60 rounded-full w-full" />
                  <div className="h-0.5 bg-sky-300/60 rounded-full w-5/6" />
                </div>

                <div
                  className="p-1 text-[5.5px] font-mono border rounded-xs truncate"
                  style={{ background: tAccentSoft, borderColor: tBorder }}
                >
                  [Resizable Table]
                </div>
              </div>

              <div
                className="flex items-center justify-between text-[5.5px] font-mono border-t pt-0.5"
                style={{ borderColor: tBorder, color: tMuted }}
              >
                <span>Ruled Notebook</span>
                <span className="font-bold" style={{ color: tAccent }}>
                  {meta.shapeName}
                </span>
              </div>
            </div>
          </div>
        );

      case 'my-shelf':
        return (
          <div
            className="w-full h-full flex select-none relative overflow-hidden"
            style={{
              background: isDark
                ? `linear-gradient(180deg, #0b0806 0%, #17110d 100%)`
                : shelfWorld.skyBg,
            }}
          >
            {renderSidebarRailReplica('my-shelf', isLightbox)}
            <div className="flex-1 p-1.5 flex flex-col justify-between text-white min-w-0">
              <div className="flex justify-between text-[5.5px] sm:text-[6.5px] font-mono text-white/90 px-0.5 drop-shadow-xs">
                <span className="truncate">
                  {isDark ? '🌙 ' : '☀️ '}
                  {shelfWorld.worldLabel}
                </span>
                <span className="shrink-0">{isDark ? 'Night Lamp' : 'Sunlight'}</span>
              </div>

              <div className="flex items-end justify-between px-1 flex-1 gap-1 my-0.5">
                <div className="flex flex-col items-center shrink-0 pb-0.5">
                  <div
                    className={`w-2.5 h-2 rounded-t border ${
                      isDark ? 'bg-amber-300 border-amber-500 shadow-[0_0_8px_rgba(251,191,36,0.9)]' : 'bg-amber-100 border-amber-400'
                    }`}
                  />
                  <div className="w-0.5 h-5 bg-amber-700" />
                  <div className="w-2 h-0.5 bg-amber-900 rounded" />
                </div>

                <div
                  className="flex-1 h-full rounded p-1 flex flex-col justify-between shadow-md"
                  style={{
                    background: shelfWorld.cabinetBg,
                    border: `2px solid ${shelfWorld.cabinetBorder}`,
                  }}
                >
                  <div className="flex items-end gap-0.5 h-5 border-b border-white/15 pb-0.5 px-1 bg-black/25">
                    <div className="w-2 h-4 bg-rose-700 rounded-2xs" />
                    <div className="w-2 h-4.5 bg-sky-700 rounded-2xs" />
                    <div className="w-2 h-3.5 bg-emerald-700 rounded-2xs" />
                  </div>
                  <div className="h-3.5 bg-black/30 rounded-2xs flex items-center justify-between px-1 text-[5px] text-amber-100 truncate">
                    <span className="truncate">{shelfWorld.accentBadge}</span>
                    <span>🐾</span>
                  </div>
                </div>

                <div className="flex flex-col items-center shrink-0 pb-0.5">
                  <div className="text-[9px] leading-none">🪴</div>
                </div>
              </div>

              <div
                className="h-2.5 rounded px-1.5 flex items-center justify-between text-[5px] font-mono font-bold text-stone-900 shadow-xs"
                style={{ background: shelfWorld.rugColor, borderRadius: btnRadius }}
              >
                <span className="truncate">Rug: {shelfWorld.rugLabel}</span>
                <span>Flowcharts</span>
              </div>
            </div>
          </div>
        );
    }
  };

  const handleTogglePreviewMode = (next: 'light' | 'dark') => {
    if (onChangePreviewMode) onChangePreviewMode(next);
    else setLocalPreviewMode(next);
  };

  return (
    <div className="my-1.5 space-y-1.5">
      {/* Horizontal Screenshot Carousel (Compact on Mobile) */}
      <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-1.5 pt-0.5 custom-scrollbar snap-x snap-mandatory">
        {sections.map((section) => {
          const data = SECTION_DATA[section];
          return (
            <div
              key={section}
              onClick={(e) => {
                e.stopPropagation();
                setActiveModalSection(section);
              }}
              className="themed-glass-card w-44 sm:w-64 shrink-0 snap-start rounded-xl sm:rounded-2xl border border-stone-200/90 dark:border-[#382518] bg-stone-50/80 dark:bg-[#1a120d] p-1.5 sm:p-2 hover:border-amber-500/80 dark:hover:border-amber-400/80 hover:shadow-xl transition-all duration-200 cursor-pointer group hover:-translate-y-0.5"
            >
              <div className="w-full h-28 sm:h-36 rounded-lg sm:rounded-xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-xs relative group-hover:ring-2 group-hover:ring-sky-500/30 transition-all">
                {renderMiniPreview(section, false)}

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-150 backdrop-blur-2xs">
                  <div className="p-2 rounded-full bg-white/95 text-stone-900 shadow-md transform scale-90 group-hover:scale-100 transition-transform">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>

                <div className="absolute top-1 left-1 pointer-events-none flex items-center gap-1">
                  <span className="px-1.5 py-0.5 rounded-md bg-stone-900/85 text-white text-[8px] sm:text-[9px] font-bold shadow-xs backdrop-blur-2xs">
                    {data.title}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* LIGHTBOX ZOOM MODAL */}
      {activeModalSection && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setActiveModalSection(null)}
        >
          <div
            className="themed-glass-card w-full max-w-2xl bg-white dark:bg-[#140e0a] rounded-2xl sm:rounded-3xl border border-stone-200 dark:border-[#382518] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="themed-glass-bar flex items-center justify-between p-3.5 sm:p-4 border-b border-stone-200 dark:border-[#352317] bg-stone-50 dark:bg-[#18110c] gap-2">
              <div className="min-w-0">
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-700 dark:text-amber-400 font-bold">
                  {meta.name} · {SECTION_DATA[activeModalSection].sectionBadge}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2 truncate">
                  <span>{SECTION_DATA[activeModalSection].title}</span>
                  <span className="text-xs font-normal text-stone-500 hidden sm:inline">
                    · {SECTION_DATA[activeModalSection].tagline}
                  </span>
                </h3>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* Light / Dark Screenshot Mode Switch in Lightbox */}
                <div className="flex items-center p-0.5 rounded-lg bg-stone-200 dark:bg-[#251a12] border border-stone-300/70 dark:border-[#382518]">
                  <button
                    type="button"
                    onClick={() => handleTogglePreviewMode('light')}
                    className={`px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                      !isDark
                        ? 'bg-white text-stone-900 shadow-2xs'
                        : 'text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    <Sun className="w-3 h-3 text-amber-500" />
                    <span>Light</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTogglePreviewMode('dark')}
                    className={`px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                      isDark
                        ? 'bg-amber-500 text-[#110c09] shadow-2xs'
                        : 'text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    <Moon className="w-3 h-3" />
                    <span>Dark</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveModalSection(null)}
                  className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-5">
              <div className="w-full h-56 sm:h-64 rounded-2xl overflow-hidden border border-stone-300 dark:border-stone-700 shadow-inner relative">
                {renderMiniPreview(activeModalSection, true)}
              </div>

              <div className="mt-4 space-y-3">
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                  {SECTION_DATA[activeModalSection].description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-stone-200 dark:border-stone-800">
                  {SECTION_DATA[activeModalSection].features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs text-stone-700 dark:text-stone-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#A47C43] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="themed-glass-bar flex flex-wrap items-center justify-between gap-2 p-3.5 sm:p-4 border-t border-stone-200 dark:border-[#352317] bg-stone-50 dark:bg-[#18110c]">
              <div className="flex items-center gap-1 flex-wrap">
                {sections.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setActiveModalSection(s)}
                    className={`px-2 py-1 rounded-lg text-[10.5px] font-semibold transition cursor-pointer ${
                      activeModalSection === s
                        ? 'themed-tab-active bg-amber-700 text-white shadow-xs'
                        : 'themed-soft-pill bg-stone-200/80 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-300'
                    }`}
                  >
                    {SECTION_DATA[s].title}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                {onApply && (
                  <button
                    type="button"
                    onClick={() => {
                      onApply();
                      setActiveModalSection(null);
                    }}
                    className="themed-accent-btn flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition shadow-sm cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Apply {meta.name}</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setActiveModalSection(null)}
                  className="themed-soft-pill px-3 py-1.5 rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-medium hover:bg-stone-300 transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
