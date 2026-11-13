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
} from 'lucide-react';

export interface ThemeAppStorePreviewsProps {
  editionId: DesignId;
  isSelected?: boolean;
  onApply?: () => void;
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
    title: 'Cockpit',
    sectionBadge: 'Section 1 · Study Command',
    tagline: 'Unified Study Collage, Slabs & Telemetry',
    description:
      'Identical ergonomic Cockpit layout across all 10 themes — customizable topic slabs, 20-20-20 eye rest countdown, checklist, calendar preview, and daily thought — restyled cleanly in each theme’s palette, button shape, and blurred wallpaper.',
    features: [
      'Identical functional layout across all 10 themes',
      'Blurred theme wallpaper & custom watermarks in Themes 2–10',
      'Distinct sober button silhouette per edition',
      'Sharp Dark Mode typography with high contrast',
    ],
  },
  'read-studio': {
    id: 'read-studio',
    title: 'Read Studio',
    sectionBadge: 'Section 2 · Clinical Atlas',
    tagline: 'Dual-Page Textbook Reader & Anatomical Snip',
    description:
      'Same dual-page medical PDF reader, chapter index drawer, boundary hover stretch slider, and snip-to-note toolbar across every theme — adapted in each theme’s header bar, button silhouette, and wallpaper depth.',
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
      'Same MS-Word-inspired formatting ribbon, color & highlighter pickers, draggable resizable tables, full font selector, speech-to-text, and mouse-drag paper width control across all 10 editions.',
    features: [
      'Aligned ruled notebook paper with draggable paper edge',
      'Full font list + straight & natural underline options',
      'Movable & border-resizable color-formatted tables',
      'Theme-matched ribbon buttons & frosted paper stage',
    ],
  },
  'my-shelf': {
    id: 'my-shelf',
    title: 'Shelf',
    sectionBadge: 'Section 4 · Living Almirah Room',
    tagline: '50 Unique Backdrops, 10 Rugs, Left Lamp & Stealthy Cat',
    description:
      'Each theme transforms the 3D Shelf sanctuary with 5 non-repeating bay backdrops (50 total across 10 themes), left-side standing lamp, right-side potted plant, custom carpet design, themed almirah finishes, and a sneaky alert cat.',
    features: [
      '50 zero-repeat backdrops (5 unique bays × 10 themes)',
      '10 unique theme-matched carpet silhouettes & weaves',
      'Standing lamp on left & fig plant on right across all themes',
      'Click cat anytime to stalk in a random direction slowly',
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
    emoji: '🏔️⏱️',
    worldLabel: 'Swiss Alpine',
    rugLabel: 'Herringbone Wool',
    skyBg: 'linear-gradient(180deg, #a7b8c9 0%, #526375 62%, #59463c 100%)',
    cabinetBg: '#2d3540',
    cabinetBorder: '#a84732',
    rugColor: '#d9d4cd',
    accentBadge: 'Swiss 3px Precision',
  },
  '6': {
    emoji: '🌿🏛️',
    worldLabel: 'Conservatory',
    rugLabel: 'Octagonal Jute',
    skyBg: 'linear-gradient(180deg, #86baa8 0%, #2b6859 64%, #3c4f47 100%)',
    cabinetBg: '#1c423a',
    cabinetBorder: '#48b8a4',
    rugColor: '#c2dbd2',
    accentBadge: 'Conservatory Arch',
  },
  '7': {
    emoji: '🔭🌌',
    worldLabel: 'Observatory Dome',
    rugLabel: 'Celestial Hex',
    skyBg: 'linear-gradient(180deg, #101633 0%, #1c244f 64%, #25283d 100%)',
    cabinetBg: '#191f3b',
    cabinetBorder: '#c9a65b',
    rugColor: '#3a4270',
    accentBadge: 'Counter-Chamfer',
  },
  '8': {
    emoji: '🍷📖',
    worldLabel: 'Scriptorium',
    rugLabel: 'Persian Velvet',
    skyBg: 'linear-gradient(180deg, #4b1d2b 0%, #2c1018 68%, #3c2229 100%)',
    cabinetBg: '#3c1622',
    cabinetBorder: '#d67e96',
    rugColor: '#8f3047',
    accentBadge: 'Bookplate Flag',
  },
  '9': {
    emoji: '🗞️✒️',
    worldLabel: 'Press Atrium',
    rugLabel: 'Kilim Diamond',
    skyBg: 'linear-gradient(180deg, #cfc4ab 0%, #8f7f65 64%, #524838 100%)',
    cabinetBg: '#3b3327',
    cabinetBorder: '#cfa86b',
    rugColor: '#d8cbb2',
    accentBadge: 'Press Stamp (6px)',
  },
  '10': {
    emoji: '🧊✨',
    worldLabel: 'Fjord Studio',
    rugLabel: 'Split Bouclé',
    skyBg: 'linear-gradient(180deg, #8bb6de 0%, #2e5984 64%, #1e2d40 100%)',
    cabinetBg: '#1c2f47',
    cabinetBorder: '#5ea1e6',
    rugColor: '#c7d9ec',
    accentBadge: 'Fluent Squircle',
  },
};

export const ThemeAppStorePreviews: React.FC<ThemeAppStorePreviewsProps> = ({
  editionId,
  onApply,
}) => {
  const [activeModalSection, setActiveModalSection] = useState<SectionType | null>(null);
  const meta = getThemeMeta(editionId);
  const shelfWorld = SHELF_WORLD_PREVIEW[editionId] ?? SHELF_WORLD_PREVIEW['1'];
  const btnRadius = meta.buttonRadius;

  const sections: SectionType[] = ['my-space', 'read-studio', 'create-note', 'my-shelf'];

  // Background style helper using the real theme Light wallpaper/surface tokens
  const workspacePreviewStyle: React.CSSProperties = {
    backgroundColor: meta.lightBg,
    backgroundImage: meta.lightWallpaperUri || 'none',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    color: meta.lightInk,
  };

  const renderMiniPreview = (section: SectionType) => {
    switch (section) {
      case 'my-space':
        return (
          <div
            className="w-full h-full flex select-none overflow-hidden"
            style={workspacePreviewStyle}
          >
            {/* Left Slim Gradient Sidebar Replica */}
            <div
              className="w-11 shrink-0 p-1 flex flex-col justify-between border-r"
              style={{
                background: meta.sidebar.light.railBg,
                borderColor: meta.sidebar.light.railBorder,
              }}
            >
              <div className="space-y-1">
                <div
                  className="text-[7px] font-black tracking-tight truncate px-0.5"
                  style={{ color: meta.lightAccent }}
                >
                  ACH1EV
                </div>
                <div
                  className="h-3 px-1 flex items-center text-[6px] font-bold text-white shadow-2xs"
                  style={{
                    background: meta.sidebar.light.activeBtnBg,
                    borderRadius: btnRadius,
                  }}
                >
                  Cockpit
                </div>
                <div
                  className="h-2.5 px-1 flex items-center text-[5.5px]"
                  style={{
                    background: meta.sidebar.light.idleBtnBg,
                    color: meta.sidebar.light.idleBtnText,
                    borderRadius: btnRadius,
                  }}
                >
                  Read
                </div>
                <div
                  className="h-2.5 px-1 flex items-center text-[5.5px]"
                  style={{
                    background: meta.sidebar.light.idleBtnBg,
                    color: meta.sidebar.light.idleBtnText,
                    borderRadius: btnRadius,
                  }}
                >
                  Shelf
                </div>
              </div>
              <div
                className="text-[5.5px] font-mono px-0.5 truncate"
                style={{ color: meta.sidebar.light.mutedLabelColor }}
              >
                {meta.shapeName}
              </div>
            </div>

            {/* Unified Cockpit Content Replica */}
            <div className="flex-1 p-2 flex flex-col justify-between min-w-0">
              <div
                className="flex items-center justify-between pb-1 border-b"
                style={{ borderColor: meta.lightBorder }}
              >
                <span className="text-[8.5px] font-bold uppercase tracking-wide truncate">
                  {meta.name}
                </span>
                <span
                  className="text-[6.5px] px-1.5 py-0.5 text-white font-semibold shadow-2xs shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${meta.lightAccent}, ${meta.darkBorder})`,
                    borderRadius: btnRadius,
                  }}
                >
                  {meta.shapeName}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-1.5 my-1 flex-1">
                <div
                  className="p-1.5 rounded-lg border flex flex-col justify-between backdrop-blur-xs"
                  style={{
                    background: meta.lightSurface,
                    borderColor: meta.lightBorder,
                  }}
                >
                  <span className="text-[7.5px] font-bold truncate">Cardiology Slab</span>
                  <div
                    className="h-1 rounded-full overflow-hidden my-1"
                    style={{ background: meta.lightAccentSoft }}
                  >
                    <div
                      className="w-3/4 h-full"
                      style={{ background: meta.lightAccent }}
                    />
                  </div>
                  <span className="text-[6px]" style={{ color: meta.lightMuted }}>
                    Tasks · Timer
                  </span>
                </div>

                <div
                  className="p-1.5 rounded-lg border flex flex-col justify-between backdrop-blur-xs"
                  style={{
                    background: meta.lightRaised,
                    borderColor: meta.lightBorder,
                  }}
                >
                  <span className="text-[7.5px] font-bold truncate">Daily Agenda</span>
                  <span className="text-[6px]" style={{ color: meta.lightMuted }}>
                    Exact Theme 1 Grid
                  </span>
                  <span
                    className="text-[6px] font-bold truncate"
                    style={{ color: meta.lightAccent }}
                  >
                    {editionId === '1' ? 'Marble / Espresso' : 'Blurred Wallpaper'}
                  </span>
                </div>
              </div>

              <div
                className="flex items-center justify-between text-[6.5px] font-mono border-t pt-0.5"
                style={{ borderColor: meta.lightBorder, color: meta.lightMuted }}
              >
                <span>Theme {editionId}</span>
                <span className="font-bold" style={{ color: meta.lightAccent }}>
                  Unified Cockpit
                </span>
              </div>
            </div>
          </div>
        );

      case 'read-studio':
        return (
          <div
            className="w-full h-full p-2 flex flex-col justify-between select-none"
            style={workspacePreviewStyle}
          >
            <div
              className="flex items-center justify-between border-b pb-1 px-1.5 py-0.5 rounded-md"
              style={{
                background: meta.lightHeader,
                borderColor: meta.lightBorder,
              }}
            >
              <div className="flex items-center gap-1 truncate">
                <BookOpen className="w-3 h-3 shrink-0" style={{ color: meta.lightAccent }} />
                <span className="text-[8px] font-serif font-bold truncate">
                  Harrison&apos;s Internal Medicine
                </span>
              </div>
              <span
                className="text-[6.5px] font-mono px-1.5 py-0.5 text-white shrink-0"
                style={{ background: meta.lightAccent, borderRadius: btnRadius }}
              >
                Snip
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 my-1 flex-1">
              <div
                className="p-1.5 rounded border space-y-1 shadow-2xs"
                style={{ background: meta.lightSurface, borderColor: meta.lightBorder }}
              >
                <div className="h-1.5 rounded-xs w-3/4" style={{ background: meta.lightInk }} />
                <div className="h-0.5 rounded-xs w-full" style={{ background: meta.lightBorder }} />
                <div className="h-0.5 rounded-xs w-5/6" style={{ background: meta.lightBorder }} />
                <div className="h-0.5 rounded-xs w-full" style={{ background: meta.lightBorder }} />
              </div>
              <div
                className="p-1 rounded border flex flex-col items-center justify-center shadow-2xs"
                style={{ background: meta.lightSurface, borderColor: meta.lightBorder }}
              >
                <div
                  className="w-7 h-6 flex items-center justify-center border"
                  style={{
                    background: meta.lightAccentSoft,
                    borderColor: meta.lightBorder,
                    borderRadius: btnRadius,
                  }}
                >
                  <Heart className="w-3.5 h-3.5" style={{ color: meta.lightAccent }} />
                </div>
                <span className="text-[6px] font-bold mt-1">Coronary Atlas</span>
              </div>
            </div>

            <div
              className="flex items-center justify-between text-[6.5px] font-mono border-t pt-0.5"
              style={{ borderColor: meta.lightBorder, color: meta.lightMuted }}
            >
              <span>Dual-Page Reader</span>
              <span className="font-bold" style={{ color: meta.lightAccent }}>
                {meta.name}
              </span>
            </div>
          </div>
        );

      case 'create-note':
        return (
          <div
            className="w-full h-full p-2 flex flex-col justify-between select-none"
            style={workspacePreviewStyle}
          >
            {/* Unified Rich Ribbon Header */}
            <div
              className="flex items-center justify-between border-b pb-1 px-1.5 py-0.5 rounded-md"
              style={{
                background: meta.lightHeader,
                borderColor: meta.lightBorder,
              }}
            >
              <span className="text-[8.5px] font-bold font-serif truncate">
                Ruled Studio Ribbon
              </span>
              <div className="flex items-center gap-1 shrink-0">
                <span
                  className="px-1.5 py-0.5 text-[6px] font-bold text-white"
                  style={{ background: meta.lightAccent, borderRadius: btnRadius }}
                >
                  Fonts
                </span>
                <span
                  className="px-1.5 py-0.5 text-[6px] font-bold border"
                  style={{
                    background: meta.lightSurface,
                    borderColor: meta.lightBorder,
                    borderRadius: btnRadius,
                  }}
                >
                  Table
                </span>
              </div>
            </div>

            {/* Clean Ruled Paper Centerpiece */}
            <div
              className="my-1 pl-2.5 pr-1.5 py-1 flex-1 flex flex-col justify-between rounded border shadow-2xs"
              style={{
                background: '#fcfbf7',
                borderColor: meta.lightBorder,
                borderLeft: `3px solid ${meta.lightAccent}`,
                color: '#1f2329',
              }}
            >
              <div className="space-y-1">
                <div className="text-[7px] font-semibold">
                  Clinical Ward Summary · Drag Margin to Resize
                </div>
                <div className="h-0.5 bg-sky-200 rounded-full w-full" />
                <div className="h-0.5 bg-sky-200 rounded-full w-5/6" />
              </div>

              <div
                className="p-1 text-[6px] font-mono border rounded-xs"
                style={{
                  background: meta.lightAccentSoft,
                  borderColor: meta.lightBorder,
                }}
              >
                [Draggable &amp; Color-Formatted Table]
              </div>
            </div>

            <div
              className="flex items-center justify-between text-[6.5px] font-mono border-t pt-0.5"
              style={{ borderColor: meta.lightBorder, color: meta.lightMuted }}
            >
              <span>Identical Editor Layout</span>
              <span className="font-bold" style={{ color: meta.lightAccent }}>
                {meta.shapeName}
              </span>
            </div>
          </div>
        );

      case 'my-shelf':
        return (
          <div
            className="w-full h-full p-1.5 flex flex-col justify-between text-white select-none relative overflow-hidden"
            style={{ background: shelfWorld.skyBg }}
          >
            <div className="flex justify-between text-[6.5px] font-mono text-white/90 px-1 drop-shadow-xs">
              <span>
                {shelfWorld.emoji} {shelfWorld.worldLabel}
              </span>
              <span>5 Unique Bays</span>
            </div>

            {/* Room Arrangement: Left Lamp + Center Almirah + Right Plant */}
            <div className="flex items-end justify-between px-1.5 flex-1 gap-1.5 my-0.5">
              {/* Left Standing Lamp */}
              <div className="flex flex-col items-center shrink-0 pb-0.5" title="Lamp on Left">
                <div className="w-3 h-2 rounded-t bg-amber-100 border border-amber-400" />
                <div className="w-0.5 h-6 bg-amber-700" />
                <div className="w-2.5 h-0.5 bg-amber-900 rounded" />
              </div>

              {/* Center Almirah */}
              <div
                className="flex-1 h-full rounded p-1 flex flex-col justify-between shadow-md"
                style={{
                  background: shelfWorld.cabinetBg,
                  border: `2px solid ${shelfWorld.cabinetBorder}`,
                }}
              >
                <div className="flex items-end gap-1 h-6 border-b border-white/15 pb-0.5 px-1 bg-black/25">
                  <div className="w-2.5 h-4.5 bg-rose-700 rounded-2xs" />
                  <div className="w-2.5 h-5 bg-sky-700 rounded-2xs" />
                  <div className="w-2.5 h-4 bg-emerald-700 rounded-2xs" />
                </div>
                <div className="h-4 bg-black/30 rounded-2xs flex items-center justify-between px-1 text-[5.5px] text-amber-100">
                  <span>{shelfWorld.accentBadge}</span>
                  <span>🐾</span>
                </div>
              </div>

              {/* Right Plant */}
              <div className="flex flex-col items-center shrink-0 pb-0.5" title="Plant on Right">
                <div className="text-[10px] leading-none">🪴</div>
              </div>
            </div>

            {/* Distinct Theme Carpet Bar */}
            <div
              className="h-3 rounded px-1.5 flex items-center justify-between text-[5.5px] font-mono font-bold text-stone-900 shadow-xs"
              style={{
                background: shelfWorld.rugColor,
                borderRadius: btnRadius,
              }}
            >
              <span>Rug: {shelfWorld.rugLabel}</span>
              <span>Stealthy Cat</span>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="my-2 space-y-2">
      {/* Horizontal Screenshot Carousel (App Store Style) */}
      <div className="flex gap-3 overflow-x-auto pb-2 pt-1 custom-scrollbar snap-x snap-mandatory">
        {sections.map((section) => {
          const data = SECTION_DATA[section];
          return (
            <div
              key={section}
              onClick={(e) => {
                e.stopPropagation();
                setActiveModalSection(section);
              }}
              className="themed-glass-card w-56 sm:w-64 shrink-0 snap-start rounded-2xl border border-stone-200/90 dark:border-[#382518] bg-stone-50/80 dark:bg-[#1a120d] p-2 hover:border-amber-500/80 dark:hover:border-amber-400/80 hover:shadow-xl transition-all duration-200 cursor-pointer group hover:-translate-y-0.5"
            >
              <div className="w-full h-36 rounded-xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-xs relative group-hover:ring-2 group-hover:ring-sky-500/30 transition-all">
                {renderMiniPreview(section)}

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-150 backdrop-blur-2xs">
                  <div className="p-2 rounded-full bg-white/95 text-stone-900 shadow-md transform scale-90 group-hover:scale-100 transition-transform">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>

                <div className="absolute top-1.5 left-1.5 pointer-events-none">
                  <span className="px-2 py-0.5 rounded-md bg-stone-900/85 text-white text-[9px] font-bold shadow-xs backdrop-blur-2xs">
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setActiveModalSection(null)}
        >
          <div
            className="themed-glass-card w-full max-w-2xl bg-white dark:bg-[#140e0a] rounded-3xl border border-stone-200 dark:border-[#382518] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="themed-glass-bar flex items-center justify-between p-4 border-b border-stone-200 dark:border-[#352317] bg-stone-50 dark:bg-[#18110c]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-sky-600 dark:text-sky-400 font-bold">
                  {meta.name} · {SECTION_DATA[activeModalSection].sectionBadge}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
                  <span>{SECTION_DATA[activeModalSection].title}</span>
                  <span className="text-xs font-normal text-stone-500">
                    · {SECTION_DATA[activeModalSection].tagline}
                  </span>
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalSection(null)}
                className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5">
              <div className="w-full h-64 rounded-2xl overflow-hidden border border-stone-300 dark:border-stone-700 shadow-inner relative">
                {renderMiniPreview(activeModalSection)}
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

            <div className="themed-glass-bar flex items-center justify-between p-4 border-t border-stone-200 dark:border-[#352317] bg-stone-50 dark:bg-[#18110c]">
              <div className="flex items-center gap-1.5">
                {sections.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setActiveModalSection(s)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer ${
                      activeModalSection === s
                        ? 'themed-tab-active bg-sky-600 text-white shadow-xs'
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
                    className="themed-accent-btn flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition shadow-sm cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Apply {meta.name}</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setActiveModalSection(null)}
                  className="themed-soft-pill px-3.5 py-1.5 rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-medium hover:bg-stone-300 transition cursor-pointer"
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
