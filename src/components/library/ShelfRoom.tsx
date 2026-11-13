import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, FormEvent, ReactNode } from 'react';
import {
  BookOpen,
  Plus,
  Upload,
  FileText,
  Cloud,
  Trash2,
  Move,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Palette,
  DoorClosed,
  DoorOpen,
  Eye,
  Sliders,
  FolderPlus,
  RefreshCw,
  Search,
  Lock,
  Unlock,
  Pencil,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from 'lucide-react';
import type { BookThumbnailConfig, Notebook, MedicalBook, DesignId } from '../../types';
import { BookLogoBadge } from './BookLogoBadge';
import { BookThumbnailEditorModal } from './BookThumbnailEditorModal';
import { getDefaultThumbnail } from '../../data/thumbnailMeta';
import {
  resolveShelfThemeId,
  getThemeAdaptedLook,
  getThemeAlmirahTrim,
  DayButterflies,
  ShelfTheme1BayWall,
  ForestSanctuaryBackdrop,
  BeachBalconyWithDolphins,
  MonsoonRainBackdrop,
  SwissAlpineBackdrop,
  ConservatoryBackdrop,
  ObservatoryBackdrop,
  RosewoodScriptoriumBackdrop,
  BroadsheetAtriumBackdrop,
  MicaFjordBackdrop,
  ShelfThemeCarpet,
  type ShelfThemeId,
} from './ShelfRoomWorlds';

/* ───────────── TYPES & DATA MODELS ───────────── */

export type Book = {
  id: string;
  title: string;
  cover: string;
  author?: string;
  edition?: string;
  pagesCount?: number;
  thumbnail?: BookThumbnailConfig;
};

export type KeepsakeType =
  | 'vase-gold'
  | 'clock-brass'
  | 'succulent-pot'
  | 'book-stack'
  | 'rattan-basket'
  | 'starfish-sculpt'
  | 'bottles-apothecary'
  | 'modern-ring'
  | 'flower-vase'
  | 'forest-lantern'
  | 'moss-terrarium'
  | 'conch-shell'
  | 'coral-sculpt'
  | 'chai-kulhad'
  | 'paper-boat';

export type KeepsakeItem = {
  id: string;
  type: KeepsakeType;
  label: string;
};

export type ShelfT = {
  id: string;
  name: string;
  books: Book[];
  keepsakes?: KeepsakeItem[];
};

export type AlmirahT = {
  id: string;
  name: string;
  design: string;
  shelves: ShelfT[];
  hasUpperDoor?: boolean;
};

export const DESIGNS = [
  'Dark Chocolate',
  'Creamy Caramel',
  'Vanilla White',
  'Mocha Espresso',
  'Vault',
] as const;

export type DesignName = (typeof DESIGNS)[number];

export const COVERS = [
  'Maroon',
  'Navy',
  'Forest',
  'Ochre',
  'Slate',
  'Cream',
  'Crimson',
  'Emerald',
  'Amber',
  'RoyalBlue',
  'Obsidian',
] as const;

export type UpperDoorType = 'french-swing' | 'bypass-slide' | 'bifold-fold' | 'flip-up' | 'vault-dial';
export type LowerDoorType = 'diamond-swing' | 'pocket-fluted' | 'classified-shutter' | 'drop-down' | 'bunker-slide';

export type Look = {
  name: string;
  frame: string;
  dark: string;
  back: string;
  plank: string;
  door: 'glass' | 'window' | 'solid' | 'rattan' | 'split-glass' | 'wood' | 'translucent-glass' | 'vault';
  upperDoorType: UpperDoorType;
  lowerDoorType: LowerDoorType;
  face: string;
  handle: string;
  knob: boolean;
  light: boolean;
  grain: number;
  wallType: 'charcoal-slats' | 'cream-panel' | 'dark-taupe' | 'warm-taupe' | 'classic-oak';
  legs: 'tapered-wood' | 'metal-pin' | 'peg-walnut' | 'block-base';
  accentDesc: string;
  hasUpperDoor: boolean;
  isVault?: boolean;
  opaque?: boolean;
  isWoodDoors?: boolean;
  hasSlideBars?: boolean;
  isClassifiedShutter?: boolean;
};

const LOOK_DARK_CHOCOLATE: Look = {
  name: 'Classic Walnut',
  frame: '#3b2114',
  dark: '#221109',
  back: '#190c06',
  plank: '#4d2b1a',
  door: 'glass',
  upperDoorType: 'french-swing',
  lowerDoorType: 'diamond-swing',
  face: '#3b2114',
  handle: '#d4af37',
  knob: false,
  light: false,
  grain: 0.42,
  wallType: 'dark-taupe',
  legs: 'peg-walnut',
  accentDesc: 'Deep cocoa mahogany · French clear-glass swing doors (upper) & full clear glass double doors (lower)',
  hasUpperDoor: true,
  hasSlideBars: true,
};

const LOOK_CREAMY_CARAMEL: Look = {
  name: 'Creamy Caramel',
  frame: '#c98e54',
  dark: '#915f2f',
  back: '#5d3c1e',
  plank: '#d69f68',
  door: 'translucent-glass',
  upperDoorType: 'bypass-slide',
  lowerDoorType: 'pocket-fluted',
  face: '#c98e54',
  handle: '#fef3c7',
  knob: true,
  light: false,
  grain: 0.3,
  wallType: 'charcoal-slats',
  legs: 'tapered-wood',
  accentDesc: 'Golden caramel wood · Horizontal bypass sliding glass panes (upper) & pocket fluted glass (lower)',
  hasUpperDoor: true,
  hasSlideBars: true,
};

const LOOK_VANILLA_WHITE: Look = {
  name: 'Vanilla White',
  frame: '#f4f0e8',
  dark: '#d5cdc0',
  back: '#ebe5d8',
  plank: '#e6dfd1',
  door: 'glass',
  upperDoorType: 'bifold-fold',
  lowerDoorType: 'classified-shutter',
  face: '#f9f7f2',
  handle: '#78716c',
  knob: false,
  light: true,
  grain: 0,
  wallType: 'cream-panel',
  legs: 'tapered-wood',
  accentDesc: 'Smooth matte vanilla cream · Bi-fold clear glass doors (upper) & clean rolling shutter (lower)',
  hasUpperDoor: true,
  hasSlideBars: true,
  isClassifiedShutter: true,
};

const LOOK_MOCHA_ESPRESSO: Look = {
  name: 'Mocha Espresso',
  frame: '#333640',
  dark: '#1b1d24',
  back: '#12141a',
  plank: '#434856',
  door: 'split-glass',
  upperDoorType: 'flip-up',
  lowerDoorType: 'drop-down',
  face: '#2b2e37',
  handle: '#e5d4bc',
  knob: false,
  light: false,
  grain: 0,
  wallType: 'warm-taupe',
  legs: 'metal-pin',
  accentDesc: 'Non-woody honed basalt slate & champagne steel · Flip-up visor (upper) & drop-down flap (lower)',
  hasUpperDoor: true,
  hasSlideBars: true,
};

const LOOK_VAULT: Look = {
  name: 'Vault',
  frame: '#141414',
  dark: '#070707',
  back: '#040404',
  plank: '#1c1c1c',
  door: 'vault',
  upperDoorType: 'vault-dial',
  lowerDoorType: 'bunker-slide',
  face: '#111111',
  handle: '#d4af37',
  knob: true,
  light: false,
  grain: 0.0,
  wallType: 'classic-oak',
  legs: 'block-base',
  accentDesc: 'Coal-black opaque steel vault · Rotary dial security door (upper) & dual coal-black bunker panels (lower)',
  hasUpperDoor: true,
  isVault: true,
  opaque: true,
  hasSlideBars: true,
};

export const LOOKS: Record<string, Look> = {
  'Dark Chocolate': LOOK_DARK_CHOCOLATE,
  'Creamy Caramel': LOOK_CREAMY_CARAMEL,
  'Vanilla White': LOOK_VANILLA_WHITE,
  'Mocha Espresso': LOOK_MOCHA_ESPRESSO,
  Vault: LOOK_VAULT,
  'Smoked Onyx': LOOK_VAULT,
  // Backward-compatibility aliases for older saved storage:
  'Dark wood classic': LOOK_DARK_CHOCOLATE,
  'Natural oak wood': LOOK_CREAMY_CARAMEL,
  'Paige frosty white': LOOK_VANILLA_WHITE,
  'Steel bank vault': LOOK_VAULT,
  'Teakwood glass': LOOK_DARK_CHOCOLATE,
  'White glass doors': LOOK_VANILLA_WHITE,
  'Twin dark wood': LOOK_MOCHA_ESPRESSO,
  'Oak and white': LOOK_CREAMY_CARAMEL,
  'Amber teak classic': LOOK_CREAMY_CARAMEL,
};

export const COVER: Record<string, { from: string; to: string; edge: string; ink: string }> = {
  Maroon: { from: '#881337', to: '#4c0519', edge: '#330310', ink: '#ffe4e6' },
  Navy: { from: '#1e3a8a', to: '#0f172a', edge: '#090d16', ink: '#e0f2fe' },
  Forest: { from: '#064e3b', to: '#022c22', edge: '#011a14', ink: '#d1fae5' },
  Ochre: { from: '#9a3412', to: '#431407', edge: '#2b0c04', ink: '#ffedd5' },
  Slate: { from: '#334155', to: '#0f172a', edge: '#090d16', ink: '#f1f5f9' },
  Cream: { from: '#fef3c7', to: '#d97706', edge: '#92400e', ink: '#451a03' },
  Crimson: { from: '#991b1b', to: '#5a0a0a', edge: '#380606', ink: '#fef2f2' },
  Emerald: { from: '#047857', to: '#064e3b', edge: '#022c22', ink: '#ecfdf5' },
  Amber: { from: '#b45309', to: '#78350f', edge: '#451a03', ink: '#fffbeb' },
  RoyalBlue: { from: '#1d4ed8', to: '#1e3a8a', edge: '#172554', ink: '#eff6ff' },
  Obsidian: { from: '#27272a', to: '#09090b', edge: '#000000', ink: '#fafafa' },
};

let counter = 0;
export const uid = () => `${Date.now().toString(36)}${(counter += 1)}`;

export const mk = (
  name: string,
  titles: Array<[string, string]>,
  keepsakes?: KeepsakeItem[]
): ShelfT => ({
  id: uid(),
  name,
  books: titles.map(([title, cover]) => ({ id: uid(), title, cover })),
  keepsakes: keepsakes ?? [],
});

export const seed = (): AlmirahT[] => [
  {
    id: 'alm-dark-chocolate',
    name: 'Classic Walnut',
    design: 'Dark Chocolate',
    hasUpperDoor: true,
    shelves: [
      mk('Section 1', []),
      mk('Section 2', []),
      mk('Section 3', []),
      mk('Lower Section', []),
    ],
  },
  {
    id: 'alm-creamy-caramel',
    name: 'Creamy Caramel',
    design: 'Creamy Caramel',
    hasUpperDoor: true,
    shelves: [
      mk('Section 1', []),
      mk('Section 2', []),
      mk('Section 3', []),
      mk('Lower Section', []),
    ],
  },
  {
    id: 'alm-vanilla-white',
    name: 'Vanilla White',
    design: 'Vanilla White',
    hasUpperDoor: true,
    shelves: [
      mk('Section 1', []),
      mk('Section 2', []),
      mk('Section 3', []),
      mk('Lower Section', []),
    ],
  },
  {
    id: 'alm-mocha-espresso',
    name: 'Mocha Espresso',
    design: 'Mocha Espresso',
    hasUpperDoor: true,
    shelves: [
      mk('Section 1', []),
      mk('Section 2', []),
      mk('Section 3', []),
      mk('Lower Section', []),
    ],
  },
  {
    id: 'alm-vault',
    name: 'Vault',
    design: 'Vault',
    hasUpperDoor: true,
    shelves: [
      mk('Section 1', []),
      mk('Section 2', []),
      mk('Section 3', []),
      mk('Lower Section', []),
    ],
  },
];

export const KEY = 'medden_shelf_room_v6';

function migrateAlmirah(a: AlmirahT): AlmirahT {
  const isLegacyOnyx = a.design === 'Smoked Onyx' || a.id === 'alm-smoked-onyx';
  return {
    ...a,
    id: a.id === 'alm-smoked-onyx' ? 'alm-vault' : a.id,
    name: a.name === 'Smoked Onyx' ? 'Vault' : a.name,
    design: isLegacyOnyx ? 'Vault' : a.design,
    shelves: (a.shelves || []).map((s, idx) => {
      const legacyNames = new Set([
        'Lower Vault Section',
        'Lower Classified Section',
        'Lower Espresso Bay',
        'Lower Security Bay',
        'Vault Chamber 1',
        'Vault Chamber 2',
        'Vault Chamber 3',
      ]);
      if (legacyNames.has(s.name)) {
        return {
          ...s,
          name: s.name.startsWith('Lower') ? 'Lower Section' : `Section ${idx + 1}`,
        };
      }
      return s;
    }),
  };
}

export function useStored(): [AlmirahT[], (next: AlmirahT[]) => void] {
  const [value, setValue] = useState<AlmirahT[]>(seed);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY) ?? localStorage.getItem('medden_shelf_room_v5');
      if (raw !== null) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const migrated = (parsed as AlmirahT[]).map(migrateAlmirah);
          setValue(migrated);
          localStorage.setItem(KEY, JSON.stringify(migrated));
        }
      }
    } catch {
      /* keep seed */
    }
  }, []);

  return [
    value,
    (next) => {
      setValue(next);
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch (err) {
        console.error('Failed to save almirahs to localStorage', err);
      }
    },
  ];
}

/* ───────────── STYLES & ANIMATIONS ───────────── */

export const FLOOR = 130;

const WOOD_SWIRL_SVG = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="120" viewBox="0 0 180 120"><g fill="none" stroke-linecap="round"><path d="M0 12 Q42 4 86 15 T180 10" stroke="rgba(0,0,0,0.42)" stroke-width="1.6"/><path d="M0 26 Q55 38 102 22 T180 28" stroke="rgba(255,228,196,0.16)" stroke-width="1.2"/><path d="M0 44 Q38 28 78 46 T180 42" stroke="rgba(0,0,0,0.38)" stroke-width="2"/><ellipse cx="64" cy="60" rx="22" ry="7" stroke="rgba(0,0,0,0.45)" stroke-width="1.5"/><ellipse cx="64" cy="60" rx="11" ry="3.2" stroke="rgba(255,228,196,0.18)" stroke-width="1.1"/><path d="M0 78 Q48 92 96 74 T180 80" stroke="rgba(0,0,0,0.4)" stroke-width="1.7"/><path d="M0 98 Q40 84 90 100 T180 95" stroke="rgba(255,228,196,0.15)" stroke-width="1.3"/><path d="M0 112 Q60 104 120 114 T180 110" stroke="rgba(0,0,0,0.34)" stroke-width="1.5"/><ellipse cx="142" cy="36" rx="16" ry="5.5" stroke="rgba(0,0,0,0.36)" stroke-width="1.2"/></g></svg>`
);

const NON_WOOD_STONE_SVG = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"><g fill="none" stroke="rgba(255,255,255,0.055)" stroke-width="0.7"><path d="M0 15 H60 M0 30 H60 M0 45 H60 M15 0 V60 M30 0 V60 M45 0 V60"/><circle cx="20" cy="20" r="1.1" fill="rgba(255,255,255,0.06)"/><circle cx="48" cy="40" r="0.9" fill="rgba(0,0,0,0.22)"/></g></svg>`
);

export function grain(alpha: number, isBasalt = false): string {
  if (isBasalt) {
    return `url("data:image/svg+xml,${NON_WOOD_STONE_SVG}"), radial-gradient(circle at 25% 30%, rgba(255,255,255,0.07), transparent 55%), `;
  }
  if (alpha <= 0) return '';
  return `url("data:image/svg+xml,${WOOD_SWIRL_SVG}"), repeating-linear-gradient(92deg, rgba(0,0,0,${(alpha * 0.55).toFixed(2)}) 0 1px, transparent 1px 11px, rgba(255,235,205,${(alpha * 0.22).toFixed(2)}) 11px 12px, transparent 12px 24px), `;
}

export const CSS = `
.sh-scroll { scrollbar-width: thin; scrollbar-color: rgba(180,140,85,0.45) transparent; }
.sh-scroll::-webkit-scrollbar { height: 5px; }
.sh-scroll::-webkit-scrollbar-track { background: transparent; }
.sh-scroll::-webkit-scrollbar-thumb { background: rgba(180,140,85,0.45); border-radius: 99px; }
.sh-scroll::-webkit-scrollbar-thumb:hover { background: rgba(180,140,85,0.8); }

.sh-scroll-v { scrollbar-width: thin; scrollbar-color: rgba(180,140,85,0.5) rgba(0,0,0,0.12); }
.sh-scroll-v::-webkit-scrollbar { width: 6px; }
.sh-scroll-v::-webkit-scrollbar-track { background: rgba(0,0,0,0.08); border-radius: 99px; }
.sh-scroll-v::-webkit-scrollbar-thumb { background: rgba(180,140,85,0.55); border-radius: 99px; }
.sh-scroll-v::-webkit-scrollbar-thumb:hover { background: rgba(180,140,85,0.85); }

.sh-slide-range {
  -webkit-appearance: none;
  appearance: none;
  height: 4px;
  border-radius: 999px;
  outline: none;
  cursor: pointer;
}
.sh-slide-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 14px;
  height: 10px;
  border-radius: 4px;
  background: linear-gradient(180deg, #fef08a 0%, #d4af37 60%, #92400e 100%);
  border: 1px solid rgba(0,0,0,0.55);
  box-shadow: 0 1px 3px rgba(0,0,0,0.45);
  cursor: grab;
}

.sh-cat {
  position: absolute;
  bottom: 24px;
  width: 104px;
  height: 58px;
  z-index: 24;
  cursor: pointer;
  user-select: none;
  transition: left 12s cubic-bezier(0.28, 0.08, 0.25, 1), transform 0.5s ease;
}
.sh-cat:hover {
  filter: drop-shadow(0 4px 8px rgba(217, 119, 6, 0.45));
}
.sh-leg {
  transform-box: fill-box;
  transform-origin: 50% 0;
  animation: sh-leg 1.1s ease-in-out infinite alternate;
}
.sh-leg.b {
  animation-delay: -0.55s;
}
@keyframes sh-leg {
  from { transform: rotate(22deg); }
  to { transform: rotate(-22deg); }
}
.sh-tail {
  transform-box: fill-box;
  transform-origin: 100% 100%;
  animation: sh-tail 2s ease-in-out infinite alternate;
}
@keyframes sh-tail {
  from { transform: rotate(-10deg); }
  to { transform: rotate(14deg); }
}
.sh-bob {
  animation: sh-bob 0.55s ease-in-out infinite alternate;
}
@keyframes sh-bob {
  to { transform: translateY(-2px); }
}

.sh-book-item {
  transition: transform 0.22s cubic-bezier(0.2, 0.9, 0.3, 1), box-shadow 0.22s, filter 0.22s;
}
.sh-book-item:hover {
  transform: translateY(-8px) scale(1.04);
  box-shadow: 0 12px 18px -4px rgba(0,0,0,0.65), inset -2px 0 0 rgba(255,255,255,0.45);
  filter: brightness(1.12);
  z-index: 15;
}

.sh-keepsake-item {
  transition: transform 0.2s cubic-bezier(0.2, 0.9, 0.3, 1), filter 0.2s;
}
.sh-keepsake-item:hover {
  transform: translateY(-4px) scale(1.08);
  filter: drop-shadow(0 8px 10px rgba(0,0,0,0.5));
}

.sh-zoom-stage {
  width: 100%;
  overflow: auto;
  touch-action: pan-x pan-y pinch-zoom;
  -webkit-overflow-scrolling: touch;
}

.sh-almirah-wrap {
  position: relative;
  margin: 0 auto;
  width: min(34rem, 62%);
  pointer-events: auto;
  transition: filter .7s, width .25s ease;
}

.sh-stile {
  width: 26px;
  flex: none;
}

.sh-world-shell {
  min-height: 740px;
  padding-top: 36px;
}

@media (max-width: 768px) {
  .sh-world-shell {
    min-height: 560px !important;
    padding-top: 44px !important;
  }
  .sh-almirah-wrap {
    width: 97% !important;
  }
  .sh-stile {
    width: 11px !important;
  }
  .sh-room-lamp {
    left: 1.5% !important;
    transform: scale(0.55);
    transform-origin: bottom left;
    opacity: 0.72;
  }
  .sh-room-plant {
    right: -2% !important;
    transform: scale(0.58);
    transform-origin: bottom right;
    opacity: 0.78;
  }
}
`;

/* ───────────── BEIGE FUR-LIKE CARPET (SINGLE TONE WOODEN SHADE) ───────────── */

export function BeigeFurCarpet({
  night,
  lit,
  themeId = '1',
}: {
  night: boolean;
  lit: boolean;
  themeId?: ShelfThemeId;
}) {
  return <ShelfThemeCarpet night={night} lit={lit} themeId={themeId} />;
}

/* ───────────── ULTRA-REALISTIC ROOM DETAILS ───────────── */

export function Room({
  night,
  lit,
  pulled,
  onPull,
  design: _design,
  bayIdx = 0,
  themeId = '1',
  children,
}: {
  night: boolean;
  lit: boolean;
  pulled: boolean;
  onPull: () => void;
  design: string;
  bayIdx?: number;
  themeId?: ShelfThemeId;
  children: ReactNode;
}) {
  const abs = (s: CSSProperties): CSSProperties => ({ position: 'absolute', ...s });

  const floorBg = (() => {
    switch (themeId) {
      case '2':
        return night
          ? 'linear-gradient(180deg, rgba(0,0,0,0.58), rgba(0,0,0,0.22) 35%), repeating-linear-gradient(90deg, #2d3827 0 130px, #1d2519 130px 132px)'
          : 'linear-gradient(180deg, rgba(0,0,0,0.24), transparent 35%), repeating-linear-gradient(90deg, #6d6146 0 130px, #584e37 130px 132px)';
      case '3':
        return night
          ? 'linear-gradient(180deg, rgba(0,0,0,0.52), rgba(0,0,0,0.2) 35%), repeating-linear-gradient(90deg, #27323c 0 130px, #1b242c 130px 132px)'
          : 'linear-gradient(180deg, rgba(0,0,0,0.14), transparent 35%), repeating-linear-gradient(90deg, #d7cbb8 0 130px, #c2b49d 130px 132px)';
      case '4':
        return night
          ? 'linear-gradient(180deg, rgba(8,14,24,0.62), rgba(0,0,0,0.26) 40%), repeating-linear-gradient(90deg, #252e3a 0 110px, #19202a 110px 113px)'
          : 'linear-gradient(180deg, rgba(35,45,58,0.3), rgba(255,255,255,0.06) 35%, transparent 60%), repeating-linear-gradient(90deg, #6b727d 0 110px, #545b65 110px 113px)';
      case '5':
        return night
          ? 'linear-gradient(180deg, rgba(0,0,0,0.54), rgba(0,0,0,0.2) 35%), repeating-linear-gradient(90deg, #323942 0 120px, #232830 120px 122px)'
          : 'linear-gradient(180deg, rgba(0,0,0,0.16), transparent 35%), repeating-linear-gradient(90deg, #b8aa98 0 120px, #a29380 120px 122px)';
      case '6':
        return night
          ? 'linear-gradient(180deg, rgba(0,0,0,0.55), rgba(0,0,0,0.22) 35%), repeating-linear-gradient(90deg, #1b302b 0 118px, #12211e 118px 120px)'
          : 'linear-gradient(180deg, rgba(0,0,0,0.18), transparent 35%), repeating-linear-gradient(90deg, #7f9486 0 118px, #687c6f 118px 120px)';
      case '7':
        return night
          ? 'linear-gradient(180deg, rgba(0,0,0,0.6), rgba(0,0,0,0.22) 35%), repeating-linear-gradient(90deg, #1e2138 0 126px, #131526 126px 128px)'
          : 'linear-gradient(180deg, rgba(0,0,0,0.2), transparent 35%), repeating-linear-gradient(90deg, #6c6a80 0 126px, #585669 126px 128px)';
      case '8':
        return night
          ? 'linear-gradient(180deg, rgba(0,0,0,0.6), rgba(0,0,0,0.24) 35%), repeating-linear-gradient(90deg, #3b1721 0 124px, #290e16 124px 126px)'
          : 'linear-gradient(180deg, rgba(0,0,0,0.24), transparent 35%), repeating-linear-gradient(90deg, #7d4c55 0 124px, #653b43 124px 126px)';
      case '9':
        return night
          ? 'linear-gradient(180deg, rgba(0,0,0,0.58), rgba(0,0,0,0.22) 35%), repeating-linear-gradient(90deg, #2e2920 0 132px, #201c16 132px 134px)'
          : 'linear-gradient(180deg, rgba(0,0,0,0.18), transparent 35%), repeating-linear-gradient(90deg, #b8ab92 0 132px, #a09278 132px 134px)';
      case '10':
        return night
          ? 'linear-gradient(180deg, rgba(0,0,0,0.56), rgba(0,0,0,0.2) 35%), repeating-linear-gradient(90deg, #1d2b3b 0 126px, #131e2b 126px 128px)'
          : 'linear-gradient(180deg, rgba(0,0,0,0.14), transparent 35%), repeating-linear-gradient(90deg, #bfd0e0 0 126px, #a7bad0 126px 128px)';
      default:
        return night
          ? 'linear-gradient(180deg, rgba(0,0,0,0.55), rgba(0,0,0,0.2) 35%), repeating-linear-gradient(90deg, #573a21 0 130px, #422915 130px 132px)'
          : 'linear-gradient(180deg, rgba(0,0,0,0.3), transparent 35%), repeating-linear-gradient(90deg, #996939 0 130px, #7c5127 130px 132px)';
    }
  })();

  const baseboardBg = (() => {
    if (night) {
      if (themeId === '4' || themeId === '10') return 'linear-gradient(#263140, #121821)';
      if (themeId === '2' || themeId === '6') return 'linear-gradient(#213227, #111b14)';
      if (themeId === '7') return 'linear-gradient(#282b45, #141626)';
      if (themeId === '8') return 'linear-gradient(#421d27, #220d13)';
      return 'linear-gradient(#3a332d, #1c1815)';
    }
    if (themeId === '4' || themeId === '10') return 'linear-gradient(#e5edf5, #b8c6d6)';
    if (themeId === '2' || themeId === '6') return 'linear-gradient(#ebf2ec, #c2d1c6)';
    return 'linear-gradient(#f7f2eb, #d6cbba)';
  })();

  return (
    <div
      className="shelf-world-root sh-world-shell"
      style={{
        position: 'relative',
        isolation: 'isolate',
        overflow: 'hidden',
        borderRadius: 12,
        border: '1px solid rgba(0,0,0,.2)',
        paddingBottom: FLOOR - 32,
        background: '#111418',
        boxShadow: 'inset 0 0 100px rgba(0,0,0,0.5)',
        touchAction: 'pan-x pan-y pinch-zoom',
      }}
    >
      {/* 1. ROOM WALL / WORLD BACKDROP (10 Themes x 5 Almirah Bays = 50 Zero-Repeat Backdrops) */}
      {themeId === '1' ? (
        <ShelfTheme1BayWall night={night} variantIdx={bayIdx} />
      ) : themeId === '2' ? (
        <ForestSanctuaryBackdrop night={night} variantIdx={bayIdx} />
      ) : themeId === '3' ? (
        <BeachBalconyWithDolphins night={night} variantIdx={bayIdx} />
      ) : themeId === '4' ? (
        <MonsoonRainBackdrop night={night} variantIdx={bayIdx} />
      ) : themeId === '5' ? (
        <SwissAlpineBackdrop night={night} variantIdx={bayIdx} />
      ) : themeId === '6' ? (
        <ConservatoryBackdrop night={night} variantIdx={bayIdx} />
      ) : themeId === '7' ? (
        <ObservatoryBackdrop night={night} variantIdx={bayIdx} />
      ) : themeId === '8' ? (
        <RosewoodScriptoriumBackdrop night={night} variantIdx={bayIdx} />
      ) : themeId === '9' ? (
        <BroadsheetAtriumBackdrop night={night} variantIdx={bayIdx} />
      ) : (
        <MicaFjordBackdrop night={night} variantIdx={bayIdx} />
      )}

      {/* 2. REALISTIC HARDWOOD / VERANDA FLOOR */}
      <div
        style={abs({
          left: 0,
          right: 0,
          bottom: 0,
          height: FLOOR,
          zIndex: -20,
          backgroundImage: floorBg,
          boxShadow: 'inset 0 10px 24px rgba(0,0,0,0.4)',
        })}
      />

      {/* Baseboard Skirting */}
      <div
        style={abs({
          left: 0,
          right: 0,
          bottom: FLOOR,
          height: 16,
          zIndex: -20,
          background: baseboardBg,
          boxShadow: '0 3px 6px rgba(0,0,0,0.3)',
        })}
      />

      {/* 1b. ARCHITECTURAL 3D ROOM DEPTH (Wainscoting chair rail, corner shadows & warm ambient bounce) */}
      <div
        style={abs({
          inset: 0,
          bottom: FLOOR,
          zIndex: -26,
          pointerEvents: 'none',
          background: night
            ? 'radial-gradient(ellipse 72% 65% at 50% 42%, transparent 45%, rgba(0,0,0,0.68) 100%), linear-gradient(90deg, rgba(0,0,0,0.42), transparent 14%, transparent 86%, rgba(0,0,0,0.48))'
            : 'radial-gradient(ellipse 78% 70% at 48% 40%, rgba(255,250,235,0.22) 0%, transparent 55%, rgba(35,20,8,0.26) 100%), linear-gradient(90deg, rgba(25,14,6,0.22), transparent 14%, transparent 86%, rgba(25,14,6,0.28))',
        })}
      />
      {/* Traditional Wainscoting Chair Rail Molding */}
      <div
        style={abs({
          left: 0,
          right: 0,
          bottom: FLOOR + 145,
          height: 8,
          zIndex: -25,
          pointerEvents: 'none',
          background: night
            ? 'linear-gradient(180deg, rgba(255,245,230,0.08), rgba(0,0,0,0.45))'
            : 'linear-gradient(180deg, rgba(255,255,255,0.4), rgba(65,40,18,0.25))',
          boxShadow: '0 4px 10px rgba(0,0,0,0.22)',
        })}
      />

      {/* 3. PLUSH CARPET */}
      <BeigeFurCarpet night={night} lit={lit} themeId={themeId} />

      {/* 4. BALCONY GLASS DOOR (Theme 1 classic side terrace) */}
      {themeId === '1' && (
      <div
        style={abs({
          top: 0,
          bottom: FLOOR,
          left: 0,
          width: '9%',
          minWidth: 64,
          maxWidth: 96,
          zIndex: -15,
          borderRight: '6px solid #1a1a1a',
          boxShadow: '8px 0 22px rgba(0,0,0,0.28)',
          background: night
            ? 'linear-gradient(180deg, #0b1220 0%, #152238 60%, #1f314f 100%)'
            : 'linear-gradient(180deg, #60a5fa 0%, #93c5fd 42%, #fde68a 66%, #92400e 67%, #451a03 100%)',
          overflow: 'hidden',
        })}
      >
        {/* Balcony Railing Bars */}
        <div
          style={{
            position: 'absolute',
            bottom: 12,
            left: 0,
            right: 0,
            height: 48,
            borderTop: '3px solid rgba(255,255,255,0.4)',
            backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.35) 0 3px, transparent 3px 14px)',
          }}
        />
        {/* Outdoor Sunshine Sun / Moonlight Sheen */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: night
              ? 'radial-gradient(circle at 40% 30%, rgba(255,255,255,0.2), transparent 70%)'
              : 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.95), transparent 75%)',
          }}
        />
        {/* Radiant Morning Sun Disk in Light Mode */}
        {!night && (
          <div
            style={{
              position: 'absolute',
              top: 14,
              left: 14,
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: 'radial-gradient(circle, #fffbeb 20%, #fde047 65%, rgba(253,224,71,0) 100%)',
              boxShadow: '0 0 28px rgba(254,240,138,0.95)',
            }}
          />
        )}
      </div>
      )}

      {/* 4b. SUNLIGHT ROOM BEAMS (Suppressed on rainy monsoon veranda '4' and celestial observatory '7') */}
      {!night && themeId !== '4' && themeId !== '7' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: -8,
            overflow: 'hidden',
          }}
        >
          {/* Broad warm ambient morning daylight wash */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(125deg, rgba(255,248,220,0.45) 0%, rgba(254,240,138,0.22) 30%, rgba(253,224,71,0.06) 65%, transparent 85%)',
            }}
          />
          {/* Angular morning sunbeam 1 */}
          <div
            style={{
              position: 'absolute',
              top: -60,
              left: 0,
              width: '130%',
              height: 420,
              transformOrigin: 'top left',
              transform: 'rotate(22deg)',
              background:
                'linear-gradient(180deg, rgba(255,255,255,0.42) 0%, rgba(254,240,138,0.25) 45%, transparent 100%)',
              filter: 'blur(18px)',
              opacity: 0.85,
            }}
          />
          {/* Angular morning sunbeam 2 */}
          <div
            style={{
              position: 'absolute',
              top: 80,
              left: 0,
              width: '120%',
              height: 280,
              transformOrigin: 'top left',
              transform: 'rotate(25deg)',
              background:
                'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, rgba(254,243,199,0.18) 50%, transparent 100%)',
              filter: 'blur(16px)',
              opacity: 0.75,
            }}
          />
          {/* Floor golden sunlight patch */}
          <div
            style={{
              position: 'absolute',
              left: '8%',
              bottom: 0,
              width: '65%',
              height: FLOOR,
              background:
                'radial-gradient(ellipse at 40% 50%, rgba(254,240,138,0.38) 0%, rgba(253,224,71,0.12) 55%, transparent 80%)',
              filter: 'blur(14px)',
            }}
          />
        </div>
      )}

      {/* 5. BRITISH STUDY STANDARD LAMP (Positioned on the Left Side across all Themes) */}
      <div
        className="sh-room-lamp"
        style={abs({
          left: '11.5%',
          bottom: FLOOR - 16,
          zIndex: 11,
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        })}
      >
        {/* Warm Downward & Upward Tungsten Wash Cone in Night Mode */}
        {night && (
          <div
            style={{
              position: 'absolute',
              top: 28,
              width: 240,
              height: 290,
              background:
                'radial-gradient(ellipse 55% 60% at 50% 18%, rgba(254,240,138,0.28) 0%, rgba(251,191,36,0.12) 45%, transparent 78%)',
              pointerEvents: 'none',
              filter: 'blur(8px)',
            }}
          />
        )}

        {/* Turned Brass Finial Ball */}
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 30%, #fef08a, #b45309 80%)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.45)',
            marginBottom: -2,
            zIndex: 2,
          }}
        />

        {/* Classic Flared Pleated Empire Linen Shade */}
        <svg viewBox="0 0 110 74" width="96" height="65" style={{ zIndex: 2, filter: night ? 'drop-shadow(0 0 18px rgba(253,230,138,0.42))' : 'drop-shadow(6px 10px 12px rgba(0,0,0,0.38))' }}>
          <defs>
            <linearGradient id="britishShadeGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={night ? '#f59e0b' : '#b8a996'} />
              <stop offset="28%" stopColor={night ? '#fef3c7' : '#ebe2d3'} />
              <stop offset="68%" stopColor={night ? '#fde68a' : '#d6cab8'} />
              <stop offset="100%" stopColor={night ? '#d97706' : '#8c7e6c'} />
            </linearGradient>
            <linearGradient id="shadeInner" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={night ? '#ffffff' : '#574c3f'} />
              <stop offset="100%" stopColor={night ? '#fbbf24' : '#3d342a'} />
            </linearGradient>
          </defs>
          {/* Main Empire Shade Trapezoid */}
          <path d="M24 6 Q55 2 86 6 L104 64 Q55 72 6 64 Z" fill="url(#britishShadeGrad)" stroke={night ? '#f59e0b' : '#9c8c76'} strokeWidth="1.5" />
          {/* Pleat ribs */}
          {[22, 34, 46, 58, 70, 82, 92].map((x, idx) => (
            <line
              key={idx}
              x1={24 + idx * 9.5}
              y1={6}
              x2={x}
              y2={65}
              stroke="rgba(60,38,16,0.22)"
              strokeWidth="1"
            />
          ))}
          {/* Scalloped Brass Braid Trim */}
          <path d="M6 62 Q55 70 104 62" fill="none" stroke="#d4af37" strokeWidth="2.4" />
          <path d="M24 7 Q55 3 86 7" fill="none" stroke="#d4af37" strokeWidth="1.8" />
          {/* Warm glowing underside */}
          <ellipse cx="55" cy="64" rx="45" ry="5" fill="url(#shadeInner)" opacity={night ? 0.95 : 0.45} />
        </svg>

        {/* Turned Walnut & Burnished Brass Floor Column */}
        <svg viewBox="0 0 60 220" width="54" height="196" style={{ marginTop: -8 }}>
          <defs>
            <linearGradient id="brassCol" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#854d0e" />
              <stop offset="35%" stopColor="#fef08a" />
              <stop offset="70%" stopColor="#d4af37" />
              <stop offset="100%" stopColor="#713f12" />
            </linearGradient>
            <linearGradient id="walnutCol" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#261409" />
              <stop offset="40%" stopColor="#6b3e1f" />
              <stop offset="100%" stopColor="#1e0f06" />
            </linearGradient>
          </defs>
          {/* Twin Pull Chain Tassels */}
          <line x1="20" y1="0" x2="20" y2="26" stroke="#d4af37" strokeWidth="1" />
          <circle cx="20" cy="28" r="2.2" fill="#d4af37" />
          <line x1="40" y1="0" x2="40" y2="20" stroke="#d4af37" strokeWidth="1" />
          <circle cx="40" cy="22" r="2.2" fill="#d4af37" />
          {/* Harp / Brass Neck */}
          <rect x="27" y="4" width="6" height="22" rx="2" fill="url(#brassCol)" />
          <ellipse cx="30" cy="28" rx="8" ry="4" fill="url(#brassCol)" />
          {/* Turned Walnut Fluted Shaft */}
          <rect x="27" y="30" width="6" height="110" fill="url(#walnutCol)" />
          <ellipse cx="30" cy="142" rx="7" ry="3.5" fill="url(#brassCol)" />
          <rect x="26" y="144" width="8" height="48" fill="url(#walnutCol)" />
          {/* Classical Stepped Brass & Mahogany Base */}
          <ellipse cx="30" cy="196" rx="16" ry="5" fill="url(#brassCol)" />
          <ellipse cx="30" cy="203" rx="24" ry="7" fill="url(#walnutCol)" />
          <ellipse cx="30" cy="207" rx="26" ry="7" fill="rgba(0,0,0,0.45)" style={{ mixBlendMode: 'multiply' }} />
        </svg>
      </div>

      {/* 6. ORGANIC FIDDLE-LEAF FIG PLANT IN MATTE CERAMIC PLANTER */}
      <div
        className="sh-room-plant"
        style={abs({
          right: '0.6%',
          bottom: FLOOR - 20,
          zIndex: 13,
          pointerEvents: 'none',
        })}
      >
        <svg viewBox="0 0 160 220" width="136" height="188" style={{ filter: 'drop-shadow(-6px 10px 14px rgba(0,0,0,0.38))' }}>
          <defs>
            <linearGradient id="figLeafDark" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3b6e44" />
              <stop offset="55%" stopColor="#254c2c" />
              <stop offset="100%" stopColor="#16301b" />
            </linearGradient>
            <linearGradient id="figLeafMid" x1="0" y1="0" x2="0.8" y2="1">
              <stop offset="0%" stopColor="#588e5b" />
              <stop offset="55%" stopColor="#35663b" />
              <stop offset="100%" stopColor="#1f4124" />
            </linearGradient>
            <linearGradient id="figLeafLight" x1="0.1" y1="0" x2="0.9" y2="1">
              <stop offset="0%" stopColor="#72a76f" />
              <stop offset="60%" stopColor="#467a48" />
              <stop offset="100%" stopColor="#284e2b" />
            </linearGradient>
            <linearGradient id="ceramicPotGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#a89882" />
              <stop offset="28%" stopColor="#ede3d4" />
              <stop offset="62%" stopColor="#d8cab4" />
              <stop offset="100%" stopColor="#85745f" />
            </linearGradient>
            <linearGradient id="woodStandGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#472b19" />
              <stop offset="45%" stopColor="#7a4c2d" />
              <stop offset="100%" stopColor="#331d10" />
            </linearGradient>
          </defs>

          {/* Soft floor shadow */}
          <ellipse cx="80" cy="212" rx="42" ry="7" fill="rgba(0,0,0,0.45)" />

          {/* Wooden Cross Stand Legs */}
          <path d="M54 176 L46 210 L53 210 L62 178 Z" fill="url(#woodStandGrad)" />
          <path d="M106 176 L114 210 L107 210 L98 178 Z" fill="url(#woodStandGrad)" />
          <rect x="46" y="185" width="68" height="5" rx="2.5" fill="url(#woodStandGrad)" />

          {/* Organic Natural Branches / Woody Stems */}
          <path d="M78 140 Q74 102 62 72" fill="none" stroke="#5a432e" strokeWidth="3.8" strokeLinecap="round" />
          <path d="M80 140 Q88 100 98 66" fill="none" stroke="#4f3926" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M79 140 Q79 88 80 44" fill="none" stroke="#634b35" strokeWidth="4" strokeLinecap="round" />

          {/* Back Shaded Broad Ficus Leaves */}
          <path d="M62 78 C36 74 18 54 24 34 C30 16 56 26 66 56 C69 66 66 76 62 78 Z" fill="url(#figLeafDark)" />
          <path d="M98 72 C126 68 142 46 134 28 C126 12 100 22 92 50 C90 62 94 70 98 72 Z" fill="url(#figLeafDark)" />

          {/* Mid Canopy Sculpted Rounded Leaves with Slight Wave */}
          <path d="M78 52 C56 44 48 18 66 8 C84 -2 100 20 88 46 C85 52 80 54 78 52 Z" fill="url(#figLeafMid)" />
          <path d="M76 92 C44 96 20 82 22 64 C24 46 54 50 74 74 C79 82 80 90 76 92 Z" fill="url(#figLeafMid)" />
          <path d="M84 94 C116 96 140 80 136 62 C132 46 102 52 86 76 C81 84 80 92 84 94 Z" fill="url(#figLeafMid)" />

          {/* Foreground Lit Organic Leaves & Delicate Veining */}
          <path d="M78 112 C48 118 30 104 34 88 C38 74 64 78 78 100 C81 106 81 111 78 112 Z" fill="url(#figLeafLight)" />
          <path d="M82 114 C110 122 128 108 124 92 C120 76 94 82 82 102 C79 107 79 112 82 114 Z" fill="url(#figLeafLight)" />
          <path d="M79 84 C64 74 62 52 78 44 C94 38 100 62 84 82 C81 85 80 86 79 84 Z" fill="url(#figLeafLight)" />

          {/* Delicate Botanical Midrib & Lateral Leaf Veins */}
          <g fill="none" stroke="rgba(228, 245, 218, 0.34)" strokeWidth="1.1" strokeLinecap="round">
            <path d="M78 50 Q76 30 70 15" />
            <path d="M62 74 Q42 54 30 39" />
            <path d="M97 68 Q116 48 128 33" />
            <path d="M75 89 Q50 78 29 67" />
            <path d="M85 90 Q112 78 129 66" />
            <path d="M76 109 Q56 100 40 91" />
            <path d="M83 111 Q104 102 118 94" />
            <path d="M80 82 Q82 62 82 48" />
          </g>

          {/* Soil Bed */}
          <ellipse cx="80" cy="136" rx="34" ry="7" fill="#2c1d13" />

          {/* Matte Off-White Stoneware Cylindrical Planter */}
          <path d="M44 136 L49 182 Q80 192 111 182 L116 136 Q80 144 44 136 Z" fill="url(#ceramicPotGrad)" />
          <ellipse cx="80" cy="136" rx="36" ry="7.5" fill="none" stroke="#efe6d8" strokeWidth="2.4" />
          {/* Subtle Artisan Glaze Horizontal Groove */}
          <path d="M47 166 Q80 175 113 166" fill="none" stroke="rgba(110,92,70,0.28)" strokeWidth="1.2" />
        </svg>
      </div>

      {/* 7. WALL ART CANVAS (Theme 1 classic study accent, balanced on right wall) */}
      {themeId === '1' && (
      <div
        style={abs({
          top: '9%',
          right: '14.5%',
          width: 84,
          height: 104,
          zIndex: -10,
          border: '4px solid #d4af37',
          background: '#fafaf9',
          boxShadow: '4px 8px 18px rgba(0,0,0,0.4)',
          borderRadius: 2,
          padding: 6,
          boxSizing: 'border-box',
        })}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #fef3c7 0%, #fed7aa 50%, #fecaca 100%)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Abstract Sun Arches (Like Photo 2 canvas) */}
          <div
            style={{
              position: 'absolute',
              bottom: -15,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 52,
              height: 52,
              borderRadius: '50%',
              border: '6px solid #b45309',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: -5,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: '#d97706',
            }}
          />
        </div>
      </div>
      )}

      {/* 8. INTERACTIVE PULL CORD (Night Mode Only) */}
      {night && (
      <div
        style={abs({
          top: 0,
          left: '89.5%',
          zIndex: 25,
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        })}
      >
        <button
          type="button"
          aria-label="Pull rope to toggle almirah interior spotlight"
          title="Pull cord to toggle almirah spotlights"
          onClick={onPull}
          style={{
            all: 'unset',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transition: 'transform 0.16s ease-out',
            transform: pulled ? 'translateY(16px)' : 'none',
          }}
        >
          <span
            style={{
              width: 2.5,
              height: 110,
              background: 'repeating-linear-gradient(180deg, #f5f5f4 0 4px, #d6d3d1 4px 6px)',
              boxShadow: '1px 1px 2px rgba(0,0,0,0.5)',
            }}
          />
          <span
            style={{
              width: 14,
              height: 26,
              borderRadius: '0 0 7px 7px',
              background: 'linear-gradient(90deg, #d4af37 0%, #a16207 100%)',
              boxShadow: '0 3px 5px rgba(0,0,0,0.5)',
            }}
          />
        </button>
        <span
          style={{
            marginTop: 4,
            fontSize: 8.5,
            fontWeight: 700,
            letterSpacing: 0.8,
            textTransform: 'uppercase',
            color: '#fef3c7',
            textShadow: '0 1px 3px rgba(0,0,0,0.9)',
          }}
        >
          {lit ? 'Almirah Light ON' : 'Pull for Light'}
        </span>
      </div>
      )}

      {/* 9. NIGHT TIME SUBTLE AMBIENCE (Lamp gently illuminates room; pull-cord lights interior of almirah) */}
      <div
        style={abs({
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          transition: 'background-color 0.7s',
          backgroundColor: `rgba(6, 7, 24, ${night ? 0.34 : 0})`,
          mixBlendMode: 'multiply',
        })}
      />
      {night && (
        <div
          style={abs({
            inset: 0,
            zIndex: 0,
            pointerEvents: 'none',
            background:
              'radial-gradient(ellipse 36% 46% at 15% 58%, rgba(253,230,138,0.18), transparent 72%)',
            mixBlendMode: 'screen',
          })}
        />
      )}

      {/* Floating Glowing Jugnoos (Fireflies) hovering gently in the room during night */}
      {night && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 12 }}>
          <div
            style={{
              position: 'absolute',
              top: '30%',
              left: '22%',
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#fef08a',
              boxShadow: '0 0 14px 6px rgba(250, 204, 21, 0.95), 0 0 28px 12px rgba(234, 179, 8, 0.5)',
              animation: 'jugnooFloat 6s ease-in-out infinite alternate, jugnooGlow 2.4s ease-in-out infinite alternate',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '52%',
              left: '38%',
              width: 9,
              height: 9,
              borderRadius: '50%',
              background: '#fef08a',
              boxShadow: '0 0 16px 7px rgba(250, 204, 21, 0.95), 0 0 30px 14px rgba(234, 179, 8, 0.5)',
              animation: 'jugnooFloat 7.8s ease-in-out infinite alternate, jugnooGlow 2.1s ease-in-out infinite alternate',
              animationDelay: '1.4s',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '26%',
              left: '74%',
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#fef08a',
              boxShadow: '0 0 14px 6px rgba(250, 204, 21, 0.95), 0 0 26px 10px rgba(234, 179, 8, 0.45)',
              animation: 'jugnooFloat 6.5s ease-in-out infinite alternate, jugnooGlow 2.7s ease-in-out infinite alternate',
              animationDelay: '0.8s',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '64%',
              left: '84%',
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: '#fef08a',
              boxShadow: '0 0 12px 5px rgba(250, 204, 21, 0.9), 0 0 22px 9px rgba(234, 179, 8, 0.4)',
              animation: 'jugnooFloat 8.2s ease-in-out infinite alternate, jugnooGlow 2.3s ease-in-out infinite alternate',
              animationDelay: '2.2s',
            }}
          />
        </div>
      )}

      {/* Daytime Fluttering Butterflies (Themes 1 & 2 Day Mode) */}
      {!night && (themeId === '1' || themeId === '2') && (
        <DayButterflies forestTone={themeId === '2'} />
      )}

      {/* Almirah Children Container (pointerEvents none so side balcony elements like dolphins remain clickable) */}
      <div style={{ position: 'relative', zIndex: 10, pointerEvents: 'none' }}>{children}</div>

      {/* Charming Animated Cat on Floor */}
      <Cat dim={night && !lit} />
    </div>
  );
}

/* ───────────── INTERACTIVE ANIMATED CAT (SLOW PROWL, MEOW BUBBLE & SOFT VOICE) ───────────── */

function playCuteMeowSound() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const triggerMeow = (startOffset: number, pitchPeak: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      osc.type = 'triangle';
      const t0 = ctx.currentTime + startOffset;
      osc.frequency.setValueAtTime(520, t0);
      osc.frequency.exponentialRampToValueAtTime(pitchPeak, t0 + 0.08);
      osc.frequency.exponentialRampToValueAtTime(440, t0 + 0.24);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1600, t0);

      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.linearRampToValueAtTime(0.065, t0 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0008, t0 + 0.25);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t0);
      osc.stop(t0 + 0.27);
    };
    triggerMeow(0, 760);
    triggerMeow(0.32, 820);
    window.setTimeout(() => {
      try {
        ctx.close();
      } catch {}
    }, 900);
  } catch {}
}

export function Cat({ dim }: { dim: boolean }) {
  const [isRoaming, setIsRoaming] = useState(false);
  const [isAlertPaused, setIsAlertPaused] = useState(false);
  const [posX, setPosX] = useState(48);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [bubble, setBubble] = useState<string | null>('meow meow');
  const [stalkTrigger, setStalkTrigger] = useState(0);
  const posXRef = useRef(posX);
  posXRef.current = posX;

  const pickRandomNextTarget = (currX: number): { nextX: number; nextDir: 1 | -1 } => {
    const canGoLeft = currX - 14 >= 14;
    const canGoRight = 76 - currX >= 14;
    let chosenDir: 1 | -1;
    if (canGoLeft && canGoRight) {
      chosenDir = Math.random() < 0.5 ? -1 : 1;
    } else if (canGoLeft) {
      chosenDir = -1;
    } else {
      chosenDir = 1;
    }

    const span = chosenDir === -1 ? currX - 14 : 76 - currX;
    const stepDist = 14 + Math.random() * Math.max(4, span - 14);
    const rawTarget = currX + chosenDir * stepDist;
    const nextX = Math.round(Math.max(14, Math.min(76, rawTarget)));
    return { nextX, nextDir: nextX >= currX ? 1 : -1 };
  };

  useEffect(() => {
    if (!isRoaming) {
      setIsAlertPaused(false);
      setBubble('meow meow');
      return;
    }

    let cancelled = false;
    let timerId: number | undefined;

    const runCadenceLoop = () => {
      if (cancelled) return;
      setIsAlertPaused(true);
      setBubble('meow meow');

      timerId = window.setTimeout(() => {
        if (cancelled) return;
        const { nextX, nextDir } = pickRandomNextTarget(posXRef.current);
        setIsAlertPaused(false);
        setDirection(nextDir);
        setPosX(nextX);
        setBubble('meow meow');

        timerId = window.setTimeout(runCadenceLoop, 10800);
      }, 3200);
    };

    timerId = window.setTimeout(runCadenceLoop, 11200);

    return () => {
      cancelled = true;
      if (timerId !== undefined) window.clearTimeout(timerId);
    };
  }, [isRoaming, stalkTrigger]);

  const handleCatClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    playCuteMeowSound();
    const { nextX, nextDir } = pickRandomNextTarget(posXRef.current);
    setIsRoaming(true);
    setIsAlertPaused(false);
    setDirection(nextDir);
    setPosX(nextX);
    setStalkTrigger((c) => c + 1);
    setBubble('meow meow');
  };

  const handleRestClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRoaming(false);
    setIsAlertPaused(false);
    setDirection(1);
    setPosX(48);
    setBubble('meow meow');
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleCatClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCatClick(e as unknown as React.MouseEvent);
        }
      }}
      title="meow meow"
      className={`sh-cat group ${isRoaming ? 'is-roaming' : ''}`}
      style={{
        left: `${posX}%`,
        transform: `scaleX(${direction})`,
        filter: dim ? 'brightness(0.55)' : 'none',
        transition: 'left 12s cubic-bezier(0.28, 0.08, 0.25, 1), transform 0.5s ease',
      }}
    >
      {/* Quiet rest button visible on hover while walking */}
      {isRoaming && (
        <button
          type="button"
          onClick={handleRestClick}
          title="Rest"
          className="opacity-0 group-hover:opacity-95 transition-opacity"
          style={{
            position: 'absolute',
            top: -10,
            right: -6,
            transform: `scaleX(${direction})`,
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: 'rgba(28, 25, 23, 0.85)',
            border: '1px solid rgba(251, 191, 36, 0.65)',
            color: '#fef3c7',
            fontSize: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 38,
          }}
        >
          ×
        </button>
      )}

      {/* Meow / Alert Stealth Thought Bubble */}
      {bubble && (
        <div
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: `translateX(-50%) scaleX(${direction})`,
            marginBottom: 8,
            padding: '3px 9px',
            borderRadius: 14,
            background: 'rgba(255, 255, 255, 0.96)',
            border: '1.5px solid #d97706',
            color: '#78350f',
            fontSize: 10.5,
            fontWeight: 700,
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            pointerEvents: 'none',
            zIndex: 35,
          }}
        >
          {bubble}
          {/* Comic thought bubbles tail */}
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 5,
              height: 5,
              borderRadius: '50%',
              background: '#ffffff',
              border: '1px solid #d97706',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: '42%',
              transform: 'translateY(5px)',
              width: 3,
              height: 3,
              borderRadius: '50%',
              background: '#ffffff',
              border: '1px solid #d97706',
            }}
          />
        </div>
      )}

      {/* Realistic Cat SVG Illustration (Resting vs Low-Slung Sneaky Alert Hunter) */}
      {!isRoaming ? (
        /* REALISTIC SITTING CAT (Curled comfortably on carpet) */
        <svg viewBox="0 0 100 70" width="88" height="52" className="transition-transform group-hover:scale-105 active:scale-95">
          <g className="sh-bob">
            <path d="M72 58 C85 58 92 48 88 38 C85 30 76 34 78 42" fill="none" stroke="#b45309" strokeWidth="5.5" strokeLinecap="round" />
            <ellipse cx="48" cy="45" rx="26" ry="17" fill="#d97706" />
            <ellipse cx="44" cy="46" rx="19" ry="12" fill="#f59e0b" />
            <path d="M32 40 C36 48 42 56 46 56 C50 56 48 44 40 38 Z" fill="#fef3c7" opacity="0.9" />
            <ellipse cx="36" cy="58" rx="7" ry="4.5" fill="#fef3c7" stroke="#b45309" strokeWidth="1" />
            <ellipse cx="47" cy="58" rx="6.5" ry="4.5" fill="#fef3c7" stroke="#b45309" strokeWidth="1" />
            <circle cx="30" cy="29" r="14" fill="#d97706" />
            <ellipse cx="30" cy="33" rx="10" ry="7" fill="#fef3c7" />
            <polygon points="21,21 21,7 28,18" fill="#d97706" />
            <polygon points="23,19 23,10 27,17" fill="#f43f5e" opacity="0.6" />
            <polygon points="32,18 39,7 40,21" fill="#d97706" />
            <polygon points="34,17 38,10 39,19" fill="#f43f5e" opacity="0.6" />
            <path d="M22 28 Q25 32 28 28" fill="none" stroke="#78350f" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M32 28 Q35 32 38 28" fill="none" stroke="#78350f" strokeWidth="1.5" strokeLinecap="round" />
            <polygon points="29,33 31,33 30,35" fill="#f43f5e" />
            <path d="M27 36 Q30 38 33 36" fill="none" stroke="#78350f" strokeWidth="1" strokeLinecap="round" />
            <path d="M19 33 L11 31 M19 35 L12 36 M41 33 L49 31 M41 35 L48 36" stroke="#fde68a" strokeWidth="1" opacity="0.85" />
          </g>
        </svg>
      ) : (
        /* LOW-SLUNG SNEAKY & ALERT PROWLING CAT (crouched posture, twitching ears, scanning pupils) */
        <svg viewBox="0 0 132 70" width="104" height="58" className="transition-transform group-hover:scale-105 active:scale-95">
          {/* Low sinuous trailing tail */}
          <g className="sh-cat-tail">
            <path d="M24 44 C10 47 4 40 2 33" fill="none" stroke="#b45309" strokeWidth="5.2" strokeLinecap="round" />
            <circle cx="2" cy="33" r="2.6" fill="#fef3c7" />
          </g>

          {/* Back crouched stealth legs (pause smoothly during alert scan) */}
          <g className={isAlertPaused ? undefined : 'sh-cat-sneak-a'}>
            <rect x="28" y="45" width="6.5" height="17" rx="3.2" fill="#92400e" />
            <ellipse cx="32" cy="62" rx="4.5" ry="2.2" fill="#fef3c7" />
          </g>
          <g className={isAlertPaused ? undefined : 'sh-cat-sneak-b'}>
            <rect x="88" y="46" width="6.5" height="16" rx="3.2" fill="#92400e" />
            <ellipse cx="92" cy="62" rx="4.5" ry="2.2" fill="#fef3c7" />
          </g>

          {/* Low crouched body close to floor */}
          <ellipse cx="62" cy="43" rx="35" ry="11.5" fill="#d97706" />
          <ellipse cx="64" cy="48" rx="26" ry="5.5" fill="#fef3c7" opacity="0.86" />
          {/* Subtle tiger/tabby shoulder stealth stripes */}
          <path d="M46 34 Q48 41 44 45 M58 33 Q60 40 56 44 M70 33 Q72 40 68 44" fill="none" stroke="#92400e" strokeWidth="2.2" strokeLinecap="round" opacity="0.55" />

          {/* Lowered attentive head pushed forward in stealth pose */}
          <g transform="translate(0, 4)">
            <circle cx="102" cy="34" r="11.5" fill="#d97706" />
            <ellipse cx="105" cy="37" rx="7.5" ry="5" fill="#fef3c7" opacity="0.92" />
            {/* Radar-twitching attentive ears */}
            <g className="sh-cat-ear">
              <polygon points="94,25 95,11 103,22" fill="#d97706" />
              <polygon points="96,24 96,14 101,22" fill="#f43f5e" opacity="0.55" />
            </g>
            <g className="sh-cat-ear" style={{ animationDelay: '-0.8s' }}>
              <polygon points="103,22 112,11 113,26" fill="#d97706" />
              <polygon points="105,21 110,14 111,24" fill="#f43f5e" opacity="0.55" />
            </g>
            {/* Wide alert luminous green eyes with scanning pupils */}
            <ellipse cx="106" cy="33" rx="3.4" ry="2.6" fill="#bef264" stroke="#78350f" strokeWidth="0.6" />
            <g className="sh-cat-pupil">
              <ellipse cx="106.4" cy="33" rx="1.15" ry="2.2" fill="#1c1917" />
              <circle cx="105.7" cy="32.2" r="0.6" fill="#ffffff" />
            </g>
            {/* Alert pink nose & whiskers */}
            <circle cx="113" cy="36.5" r="1.4" fill="#f43f5e" />
            <path d="M108 38 L119 36.5 M108 40 L118 40.5" stroke="#fde68a" strokeWidth="1" opacity="0.85" />
          </g>

          {/* Foreground sneaking padded paws */}
          <g className={isAlertPaused ? undefined : 'sh-cat-sneak-b'}>
            <rect x="38" y="45" width="6.5" height="17" rx="3.2" fill="#d97706" />
            <ellipse cx="42" cy="62" rx="4.5" ry="2.2" fill="#fef3c7" />
          </g>
          <g className={isAlertPaused ? undefined : 'sh-cat-sneak-a'}>
            <rect x="97" y="46" width="6.5" height="16" rx="3.2" fill="#d97706" />
            <ellipse cx="101" cy="62" rx="4.5" ry="2.2" fill="#fef3c7" />
          </g>
        </svg>
      )}
    </div>
  );
}

/* ───────────── REALISTIC KEEPSAKES / EXTRA SAMAN ───────────── */

export function Keepsake({
  item,
  shelfIndex,
  onRemove,
  onMoveToShelf,
  totalShelves,
}: {
  item: KeepsakeItem;
  shelfIndex: number;
  onRemove: () => void;
  onMoveToShelf: (targetIndex: number) => void;
  totalShelves: number;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const sh = '0 6px 12px rgba(0,0,0,0.55)';

  const renderGraphic = () => {
    switch (item.type) {
      case 'vase-gold':
        return (
          <div
            title={`${item.label} · Click to manage keepsake`}
            style={{
              width: 32,
              height: 48,
              borderRadius: '45% 45% 35% 35%',
              background: 'linear-gradient(135deg, #fdfbf7 0%, #f5eedc 60%, #e2d3b5 100%)',
              borderTop: '3px solid #d4af37',
              boxShadow: sh,
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 8,
                left: '20%',
                right: '20%',
                height: 1.5,
                background: '#d4af37',
              }}
            />
          </div>
        );

      case 'clock-brass':
        return (
          <div
            title={`${item.label} · Click to manage keepsake`}
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              border: '3.5px solid #d4af37',
              background: 'radial-gradient(circle, #fcfbf9, #f4efe6)',
              boxShadow: sh,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ position: 'absolute', width: 2, height: 12, background: '#1c1917', top: 8 }} />
            <div style={{ position: 'absolute', width: 10, height: 2, background: '#1c1917', right: 8 }} />
            <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#b45309' }} />
          </div>
        );

      case 'succulent-pot':
        return (
          <div
            title={`${item.label} · Click to manage keepsake`}
            style={{ width: 34, height: 44, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            {/* Succulent Leaves */}
            <div style={{ display: 'flex', gap: 1, marginBottom: -2 }}>
              <span style={{ width: 9, height: 16, borderRadius: '50% 50% 0 0', background: '#15803d' }} />
              <span style={{ width: 10, height: 20, borderRadius: '50% 50% 0 0', background: '#16a34a' }} />
              <span style={{ width: 9, height: 16, borderRadius: '50% 50% 0 0', background: '#15803d' }} />
            </div>
            {/* Terracotta Pot */}
            <div
              style={{
                width: 26,
                height: 22,
                borderRadius: '2px 2px 6px 6px',
                background: 'linear-gradient(90deg, #c2410c, #9a3412)',
                boxShadow: sh,
              }}
            />
          </div>
        );

      case 'book-stack':
        return (
          <div
            title={`${item.label} · Click to manage keepsake`}
            style={{
              display: 'flex',
              flexDirection: 'column-reverse',
              gap: 1.5,
              boxShadow: sh,
            }}
          >
            <div style={{ height: 11, width: 52, borderRadius: 2, background: '#881337', borderLeft: '4px solid #4c0519' }} />
            <div style={{ height: 10, width: 46, borderRadius: 2, background: '#1e3a8a', borderLeft: '4px solid #0f172a' }} />
            <div style={{ height: 9, width: 40, borderRadius: 2, background: '#b45309', borderLeft: '4px solid #78350f' }} />
          </div>
        );

      case 'rattan-basket':
        return (
          <div
            title={`${item.label} · Click to manage keepsake`}
            style={{
              width: 42,
              height: 32,
              borderRadius: 3,
              background: '#b48a58',
              backgroundImage:
                'repeating-linear-gradient(45deg, rgba(0,0,0,0.3) 0 2px, transparent 2px 6px), repeating-linear-gradient(-45deg, rgba(0,0,0,0.3) 0 2px, transparent 2px 6px)',
              boxShadow: sh,
              position: 'relative',
            }}
          >
            {/* Basket Handle */}
            <div
              style={{
                position: 'absolute',
                top: 6,
                left: '25%',
                right: '25%',
                height: 6,
                borderRadius: 3,
                background: '#451a03',
              }}
            />
          </div>
        );

      case 'starfish-sculpt':
        return (
          <div
            title={`${item.label} · Click to manage keepsake`}
            style={{ width: 34, height: 42, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <svg viewBox="0 0 32 32" width="30" height="30">
              <polygon
                points="16,2 20,12 30,12 22,18 25,28 16,22 7,28 10,18 2,12 12,12"
                fill="#d4af37"
                stroke="#92400e"
                strokeWidth="1.5"
              />
            </svg>
            <div style={{ width: 2, height: 10, background: '#1c1917' }} />
            <div style={{ width: 18, height: 4, background: '#44403c', borderRadius: 2 }} />
          </div>
        );

      case 'bottles-apothecary':
        return (
          <div
            title={`${item.label} · Click to manage keepsake`}
            style={{ display: 'flex', gap: 3, alignItems: 'flex-end', boxShadow: sh }}
          >
            <div
              style={{
                width: 14,
                height: 36,
                borderRadius: '3px 3px 2px 2px',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.7), rgba(180,220,250,0.4))',
                border: '1px solid rgba(255,255,255,0.6)',
              }}
            />
            <div
              style={{
                width: 16,
                height: 44,
                borderRadius: '3px 3px 2px 2px',
                background: 'linear-gradient(135deg, rgba(160,110,60,0.8), rgba(90,50,20,0.85))',
                border: '1px solid rgba(212,175,55,0.4)',
              }}
            />
          </div>
        );

      case 'modern-ring':
        return (
          <div
            title={`${item.label} · Click to manage keepsake`}
            style={{
              width: 38,
              height: 44,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                border: '5px solid #1c1917',
                boxShadow: sh,
              }}
            />
            <div style={{ width: 20, height: 4, background: '#d4af37', borderRadius: 1 }} />
          </div>
        );

      case 'forest-lantern':
        return (
          <div
            title={`${item.label} · Click to manage keepsake`}
            style={{ width: 32, height: 46, display: 'flex', flexDirection: 'column', alignItems: 'center', filter: `drop-shadow(0 5px 8px rgba(0,0,0,0.45))` }}
          >
            <div style={{ width: 14, height: 6, borderRadius: '6px 6px 0 0', border: '2px solid #8c6a38', borderBottom: 0 }} />
            <div style={{ width: 24, height: 32, borderRadius: 4, border: '2px solid #574124', background: 'linear-gradient(180deg, rgba(254,240,138,0.85), rgba(217,119,6,0.55))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 8, height: 12, borderRadius: '50%', background: '#fffbeb', boxShadow: '0 0 10px #fde047' }} />
            </div>
            <div style={{ width: 28, height: 4, borderRadius: 2, background: '#3a2b18' }} />
          </div>
        );

      case 'moss-terrarium':
        return (
          <div
            title={`${item.label} · Click to manage keepsake`}
            style={{ width: 38, height: 42, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}
          >
            <div style={{ width: 34, height: 34, borderRadius: '50% 50% 42% 42%', border: '2px solid rgba(226,242,231,0.72)', background: 'linear-gradient(180deg, rgba(220,252,231,0.22), rgba(21,128,61,0.45) 65%, #3a2b1c 75%)', boxShadow: sh, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', bottom: 8, left: 6, width: 10, height: 12, borderRadius: '50% 50% 0 0', background: '#4ade80' }} />
              <div style={{ position: 'absolute', bottom: 8, right: 6, width: 12, height: 15, borderRadius: '50% 50% 0 0', background: '#22c55e' }} />
            </div>
          </div>
        );

      case 'conch-shell':
        return (
          <div
            title={`${item.label} · Click to manage keepsake`}
            style={{ width: 42, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', filter: 'drop-shadow(0 5px 8px rgba(0,0,0,0.4))' }}
          >
            <svg viewBox="0 0 44 30" width="40" height="28">
              <path d="M4 22 C8 10, 22 4, 34 10 C40 13, 42 20, 34 24 C24 28, 10 26, 4 22 Z" fill="#fef3e2" stroke="#c29275" strokeWidth="1.5" />
              <path d="M16 10 Q20 18 16 25 M24 8 Q28 18 25 26 M31 11 Q34 18 32 24" fill="none" stroke="#d4a382" strokeWidth="1.2" />
            </svg>
          </div>
        );

      case 'coral-sculpt':
        return (
          <div
            title={`${item.label} · Click to manage keepsake`}
            style={{ width: 38, height: 44, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', filter: 'drop-shadow(0 5px 8px rgba(0,0,0,0.42))' }}
          >
            <svg viewBox="0 0 38 36" width="36" height="34">
              <path d="M19 34 L19 20 M19 24 L11 14 M11 14 L8 6 M11 14 L15 8 M19 20 L27 12 M27 12 L24 4 M27 12 L32 8" stroke="#e07a5f" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            </svg>
            <div style={{ width: 22, height: 6, borderRadius: 2, background: '#e7decb' }} />
          </div>
        );

      case 'chai-kulhad':
        return (
          <div
            title={`${item.label} · Click to manage keepsake`}
            style={{ width: 34, height: 42, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', position: 'relative' }}
          >
            <div style={{ position: 'absolute', top: 0, width: 12, height: 14, borderRadius: '50%', borderLeft: '2px solid rgba(255,250,240,0.65)', animation: 'chaiSteamFloat 2.4s ease-in-out infinite' }} />
            <div style={{ width: 24, height: 22, clipPath: 'polygon(0% 0%, 100% 0%, 84% 100%, 16% 100%)', background: 'linear-gradient(135deg, #c9723d, #8a4319)', boxShadow: sh, borderRadius: 2 }} />
          </div>
        );

      case 'paper-boat':
        return (
          <div
            title={`${item.label} · Click to manage keepsake`}
            style={{ width: 44, height: 30, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', filter: 'drop-shadow(0 5px 8px rgba(0,0,0,0.4))' }}
          >
            <svg viewBox="0 0 48 30" width="42" height="26">
              <polygon points="4,20 44,20 36,28 12,28" fill="#f5efe4" stroke="#cbd5e1" strokeWidth="1" />
              <polygon points="12,20 24,5 36,20" fill="#fffdf9" stroke="#cbd5e1" strokeWidth="1" />
              <line x1="24" y1="5" x2="24" y2="20" stroke="#94a3b8" strokeWidth="1" />
            </svg>
          </div>
        );

      case 'flower-vase':
      default:
        return (
          <div
            title={`${item.label} · Click to manage keepsake`}
            style={{
              width: 32,
              height: 46,
              borderRadius: '40% 40% 30% 30%',
              background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
              borderTop: '4px solid #4338ca',
              boxShadow: sh,
            }}
          />
        );
    }
  };

  return (
    <div style={{ position: 'relative', flex: 'none' }} className="sh-keepsake-item">
      <div
        role="button"
        tabIndex={0}
        onClick={() => setMenuOpen(!menuOpen)}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setMenuOpen(!menuOpen)}
        style={{ cursor: 'pointer', padding: '0 4px' }}
      >
        {renderGraphic()}
      </div>

      {/* Keepsake Quick Action Popover */}
      {menuOpen && (
        <div
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginBottom: 8,
            width: 154,
            padding: 8,
            borderRadius: 8,
            background: '#1a120d',
            border: '1px solid #382518',
            boxShadow: '0 12px 24px rgba(0,0,0,0.85)',
            zIndex: 50,
            color: '#efe4d4',
            font: '500 11px system-ui',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontWeight: 700, color: '#e5ce95', fontSize: 10 }}>{item.label}</span>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              style={{ all: 'unset', cursor: 'pointer', color: '#a69079' }}
            >
              <X className="w-3 h-3" />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {/* Remove Button */}
            <button
              type="button"
              onClick={() => {
                onRemove();
                setMenuOpen(false);
              }}
              className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#6e171b]/35 hover:bg-[#6e171b]/55 border border-[#962d32]/45 text-[#d97074] text-[10px] w-full text-left transition"
            >
              <Trash2 className="w-3 h-3 text-[#b0363b]" />
              <span>Remove from shelf</span>
            </button>

            {/* Move to another shelf */}
            <div style={{ marginTop: 2, fontSize: 9.5, color: '#a8a29e', textTransform: 'uppercase' }}>
              Move to Shelf:
            </div>
            <div className="flex flex-wrap gap-1">
              {Array.from({ length: totalShelves }).map((_, idx) => {
                if (idx === shelfIndex) return null;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      onMoveToShelf(idx);
                      setMenuOpen(false);
                    }}
                    className="px-2 py-0.5 rounded bg-stone-800 hover:bg-amber-600 hover:text-stone-950 text-stone-300 text-[9.5px] transition"
                  >
                    Shelf {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ───────────── DUKAAN ROLLING SHUTTER (Vanilla White Lower Compartment) ───────────── */

export function DukaanRollingShutter({
  open,
  onToggle,
}: {
  look: Look;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className="select-none"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 25,
        overflow: 'hidden',
        pointerEvents: open ? 'none' : 'auto',
      }}
    >
      {/* Clean Top Pelmet Casing (Text-free, clickable to toggle) */}
      <div
        role="button"
        tabIndex={0}
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onToggle())}
        title={open ? 'Click pelmet or shutter rail to close' : 'Click to unlock rolling shutter'}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 16,
          zIndex: 28,
          cursor: 'pointer',
          pointerEvents: 'auto',
          background: 'linear-gradient(180deg, #1e293b 0%, #334155 45%, #0f172a 100%)',
          boxShadow: '0 4px 10px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.2)',
          borderBottom: '2px solid #090d14',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 14px',
        }}
      >
        <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#94a3b8' }} />
        <span style={{ width: 64, height: 2, borderRadius: 2, background: 'rgba(255,255,255,0.22)' }} />
        <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#94a3b8' }} />
      </div>

      {/* Left & Right Vertical Steel Guide Channels */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          width: 12,
          zIndex: 22,
          background: 'linear-gradient(90deg, #090d14 0%, #334155 50%, #1e293b 80%, #090d14 100%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          width: 12,
          zIndex: 22,
          background: 'linear-gradient(270deg, #090d14 0%, #334155 50%, #1e293b 80%, #090d14 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Main Corrugated Metal Shutter Curtain (Clean surface, zero label text) */}
      <div
        role="button"
        tabIndex={0}
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onToggle())}
        title={open ? 'Click shutter rail to close & lock' : 'Click to lift shutter & unlock'}
        style={{
          position: 'absolute',
          left: 12,
          right: 12,
          top: 0,
          bottom: 0,
          zIndex: 18,
          cursor: 'pointer',
          pointerEvents: 'auto',
          transform: open ? 'translateY(-100%)' : 'translateY(0%)',
          transition: 'transform 1.05s cubic-bezier(0.22, 1, 0.36, 1)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: open ? '0 12px 24px rgba(0,0,0,0.65)' : 'none',
        }}
      >
        <div
          style={{
            flex: 1,
            width: '100%',
            background: 'linear-gradient(180deg, #475569 0%, #334155 45%, #1e293b 85%, #0f172a 100%)',
            backgroundImage:
              'repeating-linear-gradient(180deg, rgba(255,255,255,0.20) 0px, rgba(255,255,255,0.06) 2px, rgba(0,0,0,0.16) 6px, rgba(0,0,0,0.48) 12px, rgba(0,0,0,0.72) 14px)',
            boxShadow: 'inset 0 0 36px rgba(0,0,0,0.45)',
            position: 'relative',
          }}
        />

        {/* Clean Bottom Threshold Handle Rail (Zero border text) */}
        <div
          style={{
            height: 24,
            width: '100%',
            background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 60%, #020617 100%)',
            borderTop: '2px solid #64748b',
            borderBottom: '3px solid #000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 18px',
          }}
        >
          <div style={{ width: 28, height: 8, borderRadius: 3, border: '1.5px solid #d4af37', background: '#111827' }} />
          <div style={{ width: 56, height: 4, borderRadius: 99, background: '#d4af37', opacity: 0.78 }} />
          <div style={{ width: 28, height: 8, borderRadius: 3, border: '1.5px solid #d4af37', background: '#111827' }} />
        </div>
      </div>

      {/* Unified Bottom-Center Lock / Unlock Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        style={{
          position: 'absolute',
          bottom: 4,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 36,
          pointerEvents: 'auto',
          padding: '3px 11px',
          borderRadius: 999,
          background: 'rgba(15, 11, 8, 0.88)',
          border: '1px solid rgba(212, 175, 55, 0.55)',
          color: '#ffffff',
          font: '700 10px/1.2 system-ui',
          boxShadow: '0 3px 10px rgba(0,0,0,0.55)',
        }}
        className="flex items-center gap-1 cursor-pointer hover:bg-amber-700 transition"
        title={open ? 'Lock shutter closed' : 'Unlock shutter'}
      >
        {open ? <Lock className="w-3 h-3 text-amber-300" /> : <Unlock className="w-3 h-3 text-amber-300" />}
        <span>{open ? 'Lock' : 'Unlock'}</span>
      </button>
    </div>
  );
}

/* ───────────── COAL-BLACK TIJORI / BANK VAULT DOOR (UPPER) ───────────── */

export function BankVaultDoor({
  open,
  onToggle,
}: {
  look: Look;
  open: boolean;
  onToggle: () => void;
}) {
  const [dialSpinning, setDialSpinning] = useState(false);

  const handleDialClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!open) {
      setDialSpinning(true);
      setTimeout(() => {
        onToggle();
      }, 420);
      setTimeout(() => setDialSpinning(false), 900);
    } else {
      onToggle();
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: open ? 35 : 25,
        perspective: 2200,
        perspectiveOrigin: 'left center',
        overflow: 'visible',
        pointerEvents: open ? 'none' : 'auto',
      }}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={handleDialClick}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), handleDialClick(e as any))}
        title={open ? 'Click vault door panel to close & lock' : 'Click vault door to unlock'}
        style={{
          position: 'absolute',
          inset: 0,
          cursor: 'pointer',
          pointerEvents: 'auto',
          transformOrigin: 'left center',
          transform: `translateX(${open ? -28 : 0}px) rotateY(${open ? -150 : 0}deg)`,
          transition: 'transform 1.05s cubic-bezier(0.2, 0.8, 0.25, 1)',
          boxShadow: open ? '0 18px 40px rgba(0,0,0,0.88)' : 'none',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, #171717 0%, #0b0b0b 60%, #040404 100%)',
            border: '6px solid #242424',
            boxShadow: 'inset 0 0 38px rgba(0,0,0,0.92), inset 0 1px 3px rgba(255,255,255,0.12)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 10,
              border: '1.5px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 4,
              pointerEvents: 'none',
            }}
          />

          {/* Heavy Combination Dial Center Knob (Clean, zero text) */}
          <div
            style={{
              position: 'relative',
              width: 78,
              height: 78,
              borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 30%, #3a3a3a 0%, #181818 70%, #0a0a0a 100%)',
              border: '4px solid #525252',
              boxShadow: '0 8px 24px rgba(0,0,0,0.9), inset 0 2px 4px rgba(255,255,255,0.22)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: dialSpinning ? 'rotate(240deg)' : 'rotate(0deg)',
              transition: 'transform 0.7s ease-in-out',
            }}
          >
            <div style={{ position: 'absolute', inset: 4, borderRadius: '50%', border: '1.5px dotted rgba(212,175,55,0.5)' }} />
            <div style={{ width: 44, height: 4, background: '#d4af37', borderRadius: 2 }} />
            <div style={{ position: 'absolute', width: 4, height: 44, background: '#d4af37', borderRadius: 2 }} />
            <div style={{ position: 'absolute', width: 22, height: 22, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #e5e5e5, #737373)' }} />
          </div>
        </div>
      </div>

      {/* Unified Bottom-Center Lock / Unlock Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        style={{
          position: 'absolute',
          bottom: 4,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 36,
          pointerEvents: 'auto',
          padding: '3px 11px',
          borderRadius: 999,
          background: 'rgba(12, 10, 9, 0.9)',
          border: '1px solid rgba(212, 175, 55, 0.55)',
          color: '#ffffff',
          font: '700 10px/1.2 system-ui',
          boxShadow: '0 3px 10px rgba(0,0,0,0.55)',
        }}
        className="flex items-center gap-1 cursor-pointer hover:bg-amber-700 transition"
        title={open ? 'Lock Vault Door' : 'Unlock Vault Door'}
      >
        {open ? <Lock className="w-3 h-3 text-amber-300" /> : <Unlock className="w-3 h-3 text-amber-300" />}
        <span>{open ? 'Lock' : 'Unlock'}</span>
      </button>
    </div>
  );
}

/* ───────────── 5 DISTINCT ARCHITECTURAL DOOR SYSTEMS (ACCESS-GATED GLASS & VAULT) ───────────── */

export function CabinetDoors({
  look,
  doorKind,
  open,
  onToggle,
}: {
  look: Look;
  doorKind: UpperDoorType | LowerDoorType;
  open: boolean;
  onToggle: () => void;
}) {
  if (doorKind === 'classified-shutter') {
    return <DukaanRollingShutter look={look} open={open} onToggle={onToggle} />;
  }
  if (doorKind === 'vault-dial') {
    return <BankVaultDoor look={look} open={open} onToggle={onToggle} />;
  }

  const glassSheen =
    'linear-gradient(125deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.03) 36%, rgba(255,255,255,0.14) 55%, rgba(255,255,255,0.02) 78%, rgba(255,255,255,0.12) 100%)';
  const bevel = `inset 0 0 0 1.5px ${look.dark}, inset 2px 2px 0 2px rgba(255,255,255,0.16), inset -2px -2px 0 2px rgba(0,0,0,0.22)`;

  // Unified Lock / Unlock pill at exact bottom-center across ALL 5 Almirahs
  const lockToggleBtn = (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      style={{
        position: 'absolute',
        bottom: 4,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 36,
        pointerEvents: 'auto',
        padding: '3px 11px',
        borderRadius: 999,
        background: 'rgba(15, 11, 8, 0.88)',
        border: '1px solid rgba(212, 175, 55, 0.55)',
        color: '#ffffff',
        font: '700 10px/1.2 system-ui',
        whiteSpace: 'nowrap',
        boxShadow: '0 3px 10px rgba(0,0,0,0.55)',
      }}
      className="flex items-center gap-1 cursor-pointer hover:bg-amber-700 transition"
      title={open ? 'Lock door closed' : 'Unlock door'}
    >
      {open ? <Lock className="w-3 h-3 text-amber-300" /> : <Unlock className="w-3 h-3 text-amber-300" />}
      <span>{open ? 'Lock' : 'Unlock'}</span>
    </button>
  );

  // 1. FRENCH CLEAR-GLASS SWING (Dark Chocolate Upper) & FULL CLEAR DOUBLE GLASS (Dark Chocolate Lower, zero crosshatch)
  if (doorKind === 'french-swing' || doorKind === 'diamond-swing') {
    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: open ? 35 : 25,
          perspective: 1900,
          overflow: 'visible',
          pointerEvents: open ? 'none' : 'auto',
        }}
      >
        {(['left', 'right'] as const).map((side) => {
          const left = side === 'left';
          return (
            <div
              key={side}
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onToggle())}
              title={open ? 'Click glass door to close & lock' : 'Click glass door to unlock'}
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                width: '50%',
                [left ? 'left' : 'right']: 0,
                cursor: 'pointer',
                pointerEvents: 'auto',
                transformOrigin: left ? 'left center' : 'right center',
                transform: `translateX(${open ? (left ? -26 : 26) : 0}px) rotateY(${open ? (left ? -148 : 148) : 0}deg)`,
                transition: 'transform 0.9s cubic-bezier(0.28, 0.75, 0.25, 1)',
                border: `8px solid ${look.frame}`,
                backgroundImage: glassSheen,
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                boxShadow: bevel,
              }}
            >
              {/* Curved brass pull */}
              <span
                style={{
                  position: 'absolute',
                  top: '42%',
                  [left ? 'right' : 'left']: 7,
                  width: 5,
                  height: 36,
                  borderRadius: 4,
                  background: 'linear-gradient(180deg, #fef08a 0%, #d4af37 55%, #854d0e 100%)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.6)',
                }}
              />
            </div>
          );
        })}
        {lockToggleBtn}
      </div>
    );
  }

  // 2. BYPASS SLIDING GLASS (Creamy Caramel Upper) & POCKET FLUTED SLIDING GLASS (Creamy Caramel Lower)
  if (doorKind === 'bypass-slide' || doorKind === 'pocket-fluted') {
    const isFluted = doorKind === 'pocket-fluted';
    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 25,
          overflow: 'hidden',
          pointerEvents: open ? 'none' : 'auto',
        }}
      >
        {/* Top brass glide rail */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            zIndex: 29,
            background: 'linear-gradient(90deg, #78350f, #fef08a, #b45309, #78350f)',
            pointerEvents: 'none',
          }}
        />
        {(['left', 'right'] as const).map((side) => {
          const left = side === 'left';
          const shift = left ? '-100%' : '100%';
          return (
            <div
              key={side}
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onToggle())}
              title={open ? 'Click sliding door leaf to close & lock' : 'Click to slide glass doors open'}
              style={{
                position: 'absolute',
                top: 4,
                bottom: 0,
                width: '50.5%',
                [left ? 'left' : 'right']: 0,
                cursor: 'pointer',
                pointerEvents: 'auto',
                transform: open ? `translateX(${shift})` : 'translateX(0%)',
                transition: 'transform 0.85s cubic-bezier(0.22, 1, 0.36, 1)',
                border: `7px solid ${look.frame}`,
                backgroundImage: isFluted
                  ? `repeating-linear-gradient(90deg, rgba(255,255,255,0.28) 0 2px, rgba(255,255,255,0.04) 2px 7px), ${glassSheen}`
                  : glassSheen,
                backgroundColor: isFluted ? 'rgba(255, 248, 235, 0.18)' : 'rgba(255, 255, 255, 0.05)',
                backdropFilter: isFluted ? 'blur(1.5px)' : 'none',
                boxShadow: `${bevel}, 0 4px 12px rgba(0,0,0,0.35)`,
              }}
            >
              {/* Recessed brass finger pull */}
              <div
                style={{
                  position: 'absolute',
                  top: '44%',
                  [left ? 'left' : 'right']: 8,
                  width: 9,
                  height: 28,
                  borderRadius: 4,
                  background: 'rgba(120, 53, 15, 0.55)',
                  border: '1.5px solid #fef3c7',
                }}
              />
            </div>
          );
        })}
        {lockToggleBtn}
      </div>
    );
  }

  // 3. BI-FOLD ACCORDION CLEAR-GLASS DOORS (Vanilla White Upper — ZERO horizontal middle white bar!)
  if (doorKind === 'bifold-fold') {
    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 25,
          overflow: 'hidden',
          pointerEvents: open ? 'none' : 'auto',
        }}
      >
        {(['left', 'right'] as const).map((side) => {
          const left = side === 'left';
          return (
            <div
              key={side}
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onToggle())}
              title={open ? 'Click folded glass panel to close & lock' : 'Click to fold crystal glass doors open'}
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                width: '50%',
                [left ? 'left' : 'right']: 0,
                cursor: 'pointer',
                pointerEvents: 'auto',
                transformOrigin: left ? 'left center' : 'right center',
                transform: open ? `translateX(${left ? '-100%' : '100%'}) scaleX(0.05)` : 'translateX(0%) scaleX(1)',
                transition: 'transform 0.8s cubic-bezier(0.25, 0.9, 0.3, 1)',
                border: `7px solid ${look.frame}`,
                backgroundImage: glassSheen,
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                boxShadow: bevel,
              }}
            >
              {/* Center vertical accordion fold seam only — NO horizontal middle bar */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: '50%',
                  width: 3,
                  background: look.dark,
                  opacity: 0.45,
                }}
              />
              {/* Satin nickel minimalist handle */}
              <span
                style={{
                  position: 'absolute',
                  top: '44%',
                  [left ? 'right' : 'left']: 6,
                  width: 5,
                  height: 32,
                  borderRadius: 3,
                  background: 'linear-gradient(180deg, #e2e8f0, #94a3b8)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.45)',
                }}
              />
            </div>
          );
        })}
        {lockToggleBtn}
      </div>
    );
  }

  // 4. FLIP-UP AWNING GLASS (Mocha Espresso Upper) & DROP-DOWN GLASS FLAP (Mocha Espresso Lower)
  if (doorKind === 'flip-up' || doorKind === 'drop-down') {
    const isFlipUp = doorKind === 'flip-up';
    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 25,
          perspective: 1800,
          overflow: 'hidden',
          pointerEvents: open ? 'none' : 'auto',
        }}
      >
        <div
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onToggle())}
          title={open ? 'Click glass panel to close & lock' : 'Click glass panel to unlock'}
          style={{
            position: 'absolute',
            inset: 0,
            cursor: 'pointer',
            pointerEvents: 'auto',
            transformOrigin: isFlipUp ? 'top center' : 'bottom center',
            transform: open
              ? isFlipUp
                ? 'translateY(-100%) rotateX(78deg)'
                : 'translateY(100%) rotateX(-78deg)'
              : 'translateY(0%) rotateX(0deg)',
            transition: 'transform 0.9s cubic-bezier(0.25, 0.85, 0.3, 1)',
            border: `8px solid ${look.frame}`,
            backgroundImage: glassSheen,
            backgroundColor: isFlipUp ? 'rgba(180, 120, 60, 0.08)' : 'rgba(60, 35, 22, 0.14)',
            boxShadow: `${bevel}, 0 8px 18px rgba(0,0,0,0.45)`,
          }}
        >
          {/* Horizontal Espresso Bar Pull */}
          <span
            style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              [isFlipUp ? 'bottom' : 'top']: 8,
              width: 72,
              height: 5,
              borderRadius: 3,
              background: 'linear-gradient(90deg, #a8a29e, #f5f5f4, #a8a29e)',
              boxShadow: '0 2px 5px rgba(0,0,0,0.6)',
            }}
          />
        </div>
        {lockToggleBtn}
      </div>
    );
  }

  // 5. COAL-BLACK BUNKER OPAQUE SLIDING PANELS (Vault Lower — Strictly Opaque, zero label text)
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 25,
        overflow: 'hidden',
        pointerEvents: open ? 'none' : 'auto',
      }}
    >
      {(['left', 'right'] as const).map((side) => {
        const left = side === 'left';
        return (
          <div
            key={side}
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onToggle())}
            title={open ? 'Click panel edge to close & lock' : 'Click to open coal-black vault panels'}
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              width: '50%',
              [left ? 'left' : 'right']: 0,
              cursor: 'pointer',
              pointerEvents: 'auto',
              transform: open ? `translateX(${left ? '-100%' : '100%'})` : 'translateX(0%)',
              transition: 'transform 0.9s cubic-bezier(0.22, 1, 0.36, 1)',
              border: '5px solid #242424',
              background: 'linear-gradient(155deg, #181818 0%, #0b0b0b 60%, #040404 100%)',
              boxShadow: 'inset 0 0 24px rgba(0,0,0,0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: '74%',
                height: '62%',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 3,
              }}
            />
          </div>
        );
      })}
      {lockToggleBtn}
    </div>
  );
}

/* ───────────── SINGLE SHELF ROW WITH BIG COVER THUMBS, PINNED + ADD, SLIDE BAR & RENAME ───────────── */

function ShelfRow({
  shelf,
  shelfIdx,
  bayIdx,
  totalShelves,
  look,
  ink,
  night,
  lit,
  open,
  renderDoors,
  onMoveShelf,
  onRenameShelf,
  onAddBook,
  onRemoveBook,
  onEditBookThumbnail,
  onSelectBook,
  onRemoveKeepsake,
  onMoveKeepsake,
  onAddKeepsake,
}: {
  shelf: ShelfT;
  shelfIdx: number;
  bayIdx: number;
  totalShelves: number;
  look: Look;
  ink: string;
  night: boolean;
  lit: boolean;
  open: boolean;
  renderDoors: boolean;
  onMoveShelf: (i: number, d: -1 | 1) => void;
  onRenameShelf: (shelfId: string, newName: string) => void;
  onAddBook: (shelfId: string) => void;
  onRemoveBook: (shelfId: string, bookId: string) => void;
  onEditBookThumbnail?: (shelfId: string, book: Book) => void;
  onSelectBook?: (book: Book) => void;
  onRemoveKeepsake: (shelfId: string, keepsakeId: string) => void;
  onMoveKeepsake: (fromShelfId: string, keepsakeId: string, targetShelfIndex: number) => void;
  onAddKeepsake: (shelfId: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [slidePct, setSlidePct] = useState(0);
  const [isEditingName, setIsEditingName] = useState(false);
  const [draftName, setDraftName] = useState(shelf.name);

  useEffect(() => {
    setDraftName(shelf.name);
  }, [shelf.name]);

  const handleTrackScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setSlidePct(max > 1 ? Math.round((el.scrollLeft / max) * 100) : 0);
  };

  const handleSliderChange = (pct: number) => {
    setSlidePct(pct);
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    if (max > 0) {
      el.scrollLeft = (pct / 100) * max;
    }
  };

  const scrollByDelta = (delta: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: delta, behavior: 'smooth' });
  };

  const commitRename = () => {
    const cleaned = draftName.trim();
    if (cleaned && cleaned !== shelf.name) {
      onRenameShelf(shelf.id, cleaned);
    } else {
      setDraftName(shelf.name);
    }
    setIsEditingName(false);
  };

  const accessible = open || !renderDoors;
  const mutedInk = look.light ? 'rgba(65,50,38,0.65)' : 'rgba(235,222,205,0.58)';

  return (
    <div style={{ position: 'relative', padding: '8px 12px 0', minWidth: 0 }}>
      {/* Interior Cove Spotlight Glow */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: night && lit ? 60 : 34,
          pointerEvents: 'none',
          background:
            night && lit
              ? 'linear-gradient(180deg, rgba(254,240,138,0.68), rgba(253,224,71,0.16) 60%, transparent)'
              : 'linear-gradient(180deg, rgba(0,0,0,0.28), transparent)',
        }}
      />

      {/* Shelf Header: Editable Section Title + Book Count + Controls */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 6,
          paddingBottom: 4,
        }}
      >
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          {isEditingName ? (
            <input
              type="text"
              autoFocus
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              onBlur={commitRename}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitRename();
                if (e.key === 'Escape') {
                  setDraftName(shelf.name);
                  setIsEditingName(false);
                }
              }}
              className="px-2 py-0.5 rounded bg-black/30 border border-amber-400/70 text-[11px] font-semibold uppercase tracking-wider outline-none max-w-[190px]"
              style={{ color: '#fffbeb' }}
            />
          ) : (
            <button
              type="button"
              onClick={() => accessible && setIsEditingName(true)}
              className="flex items-center gap-1 text-left min-w-0 group cursor-pointer"
              title={accessible ? 'Click to rename section' : 'Open door to edit section name'}
            >
              <span
                style={{
                  font: '700 10.5px/1.2 system-ui',
                  letterSpacing: 0.7,
                  textTransform: 'uppercase',
                  color: ink,
                }}
                className="truncate"
              >
                {shelf.name}
              </span>
              {accessible && (
                <Pencil
                  className="w-2.5 h-2.5 shrink-0 opacity-45 group-hover:opacity-100 transition-opacity"
                  style={{ color: ink }}
                />
              )}
            </button>
          )}
        </div>

        <span style={{ display: 'flex', gap: 5, alignItems: 'center', flexShrink: 0 }}>
          <span style={{ font: '500 10.5px system-ui', color: mutedInk }}>
            {shelf.books.length} {shelf.books.length === 1 ? 'book' : 'books'}
          </span>

          <span
            style={{
              display: 'flex',
              gap: 2,
              opacity: accessible ? 1 : 0.35,
              pointerEvents: accessible ? 'auto' : 'none',
            }}
          >
            <button
              type="button"
              onClick={() => onAddKeepsake(shelf.id)}
              className="px-1.5 py-0.5 rounded text-[10px] transition cursor-pointer"
              style={{
                background: look.light ? 'rgba(180,83,9,0.12)' : 'rgba(245,158,11,0.15)',
                color: look.light ? '#78350f' : '#fcd34d',
              }}
              title="Add keepsake ornament"
            >
              🏺+
            </button>
            <button
              type="button"
              disabled={shelfIdx === 0}
              onClick={() => onMoveShelf(shelfIdx, -1)}
              className="px-1 py-0.5 rounded text-[10px] transition disabled:opacity-30 cursor-pointer"
              style={{
                background: look.light ? 'rgba(56,34,20,0.12)' : 'rgba(68,64,60,0.45)',
                color: ink,
              }}
              title="Move section up"
            >
              ↑
            </button>
            <button
              type="button"
              disabled={shelfIdx === totalShelves - 1}
              onClick={() => onMoveShelf(shelfIdx, 1)}
              className="px-1 py-0.5 rounded text-[10px] transition disabled:opacity-30 cursor-pointer"
              style={{
                background: look.light ? 'rgba(56,34,20,0.12)' : 'rgba(68,64,60,0.45)',
                color: ink,
              }}
              title="Move section down"
            >
              ↓
            </button>
          </span>
        </span>
      </div>

      {/* Main Shelf Display Track + Always-Visible Pinned + Add Button */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'flex-end',
          gap: 10,
          minWidth: 0,
          pointerEvents: accessible ? 'auto' : 'none',
        }}
      >
        {/* Scrollable Books & Keepsakes Row */}
        <div
          ref={scrollRef}
          onScroll={handleTrackScroll}
          className="sh-scroll"
          style={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            alignItems: 'flex-end',
            gap: 10,
            minHeight: 132,
            overflowX: 'auto',
            padding: '8px 4px 8px',
          }}
        >
          {/* Empty Shelf Visual Guide */}
          {shelf.books.length === 0 && (shelf.keepsakes?.length ?? 0) === 0 && (
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 98,
                borderRadius: 6,
                border: `1px dashed ${look.light ? 'rgba(80,60,40,0.22)' : 'rgba(255,235,205,0.18)'}`,
                color: mutedInk,
                fontSize: 10.5,
                fontStyle: 'italic',
                padding: '0 10px',
                textAlign: 'center',
              }}
            >
              {accessible ? 'Empty compartment · Click + Add to place books' : 'Empty shelf'}
            </div>
          )}

          {/* Prominent Front-Cover Book Thumbnails (Logo-Only Default or Concise Name) */}
          {shelf.books.map((b, n) => {
            const c = COVER[b.cover] ?? COVER.Amber!;
            const bookHeight = 108 + ((n + shelfIdx) % 3) * 4;
            const hasCustomBg = Boolean(b.thumbnail?.bgColor);
            return (
              <div
                key={b.id}
                role="button"
                tabIndex={0}
                title={`${b.title} · Click to open in Read Studio (Hover corner icon to customize cover)`}
                onClick={() => onSelectBook?.(b)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelectBook?.(b)}
                className="sh-book-item group"
                style={{
                  flex: 'none',
                  width: 78,
                  height: bookHeight,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '6px 6px 6px 10px',
                  boxSizing: 'border-box',
                  borderRadius: '2px 5px 5px 2px',
                  background: hasCustomBg
                    ? `linear-gradient(145deg, ${b.thumbnail!.bgColor} 0%, rgba(15,12,10,0.42) 100%)`
                    : `linear-gradient(145deg, ${c.from} 0%, ${c.to} 100%)`,
                  backgroundColor: b.thumbnail?.bgColor || c.from,
                  borderLeft: `6px solid ${c.edge}`,
                  boxShadow:
                    '4px 6px 10px rgba(0,0,0,0.52), inset -3px 0 0 rgba(255,255,255,0.32), inset 0 1px 0 rgba(255,255,255,0.2)',
                  color: b.thumbnail?.fgColor || c.ink,
                  cursor: 'pointer',
                  position: 'relative',
                }}
              >
                {/* Edit Cover Logo / 100 Icons button on hover/mobile */}
                {accessible && onEditBookThumbnail && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditBookThumbnail(shelf.id, b);
                    }}
                    title="Edit Cover Logo, Font, Colors or 100 Icons"
                    className="opacity-85 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-amber-500 text-stone-950 border border-amber-200 flex items-center justify-center shadow z-20 cursor-pointer"
                  >
                    <Palette className="w-2.5 h-2.5" />
                  </button>
                )}

                {/* Remove button on hover/mobile */}
                {accessible && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveBook(shelf.id, b.id);
                    }}
                    title="Remove book from shelf"
                    className="opacity-85 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-stone-950 text-amber-300 border border-amber-400/50 flex items-center justify-center shadow z-20 cursor-pointer"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                )}

                {/* Inlaid Gold Cover Border */}
                <div
                  style={{
                    position: 'absolute',
                    inset: '4px 4px 4px 8px',
                    border: '1px solid rgba(254, 240, 138, 0.28)',
                    borderRadius: 2,
                    pointerEvents: 'none',
                  }}
                />

                {/* Top Cover Spine Dot */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                  <span
                    style={{
                      width: 14,
                      height: 2,
                      borderRadius: 1,
                      background: 'rgba(254, 240, 138, 0.5)',
                    }}
                  />
                </div>

                {/* Prominent Logo Monogram / Icon (No full title clutter by default!) */}
                <BookLogoBadge
                  title={b.title}
                  thumbnail={b.thumbnail}
                  fallbackBg={c.from}
                  fallbackInk={c.ink}
                  shelfMode={true}
                />

                {/* Bottom Cover Foil Accent */}
                <div
                  style={{
                    height: 2,
                    width: '65%',
                    margin: '0 auto',
                    background: 'rgba(254, 240, 138, 0.5)',
                    borderRadius: 1,
                  }}
                />
              </div>
            );
          })}

          {/* Keepsakes */}
          {shelf.keepsakes?.map((kItem) => (
            <Keepsake
              key={kItem.id}
              item={kItem}
              shelfIndex={shelfIdx}
              totalShelves={totalShelves}
              onRemove={() => onRemoveKeepsake(shelf.id, kItem.id)}
              onMoveToShelf={(targetIdx) => onMoveKeepsake(shelf.id, kItem.id, targetIdx)}
            />
          ))}
        </div>

        {/* ALWAYS-VISIBLE Pinned + Add Book Button */}
        <button
          type="button"
          onClick={() => onAddBook(shelf.id)}
          aria-label="Add a book to this shelf"
          title="Add a book (MBBS Textbooks, Upload PDF, Notes, Drive)"
          style={{
            flex: 'none',
            width: 62,
            height: 108,
            marginBottom: 8,
            borderRadius: 5,
            border: `1.5px dashed ${look.light ? '#785a3a' : '#d4af37'}`,
            background: look.light ? 'rgba(120,90,58,0.08)' : 'rgba(255,255,255,0.06)',
            color: ink,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
            cursor: 'pointer',
          }}
          className="hover:scale-105 hover:bg-amber-500/15 transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span style={{ fontSize: 9, fontWeight: 700, textAlign: 'center', lineHeight: 1.15 }}>
            Add Book
          </span>
        </button>
      </div>

      {/* Interactive Per-Section Slide Bar (Present on ALL 5 Almirahs) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '2px 2px 5px',
          pointerEvents: accessible ? 'auto' : 'none',
          opacity: accessible ? 0.92 : 0.45,
        }}
      >
        <button
          type="button"
          onClick={() => scrollByDelta(-150)}
          className="px-1.5 py-0.5 rounded text-[10px] font-bold transition cursor-pointer"
          style={{
            color: ink,
            background: look.light ? 'rgba(56,34,20,0.12)' : 'rgba(0,0,0,0.28)',
          }}
          title="Slide books left"
        >
          ◄
        </button>
        <input
          type="range"
          min={0}
          max={100}
          value={slidePct}
          onChange={(e) => handleSliderChange(Number(e.target.value))}
          aria-label={`Slide books in ${shelf.name}`}
          className="sh-slide-range flex-1"
          style={{
            background: 'linear-gradient(90deg, rgba(146,64,14,0.65), rgba(212,175,55,0.85), rgba(146,64,14,0.65))',
          }}
        />
        <button
          type="button"
          onClick={() => scrollByDelta(150)}
          className="px-1.5 py-0.5 rounded text-[10px] font-bold transition cursor-pointer"
          style={{
            color: ink,
            background: look.light ? 'rgba(56,34,20,0.12)' : 'rgba(0,0,0,0.28)',
          }}
          title="Slide books right"
        >
          ►
        </button>
      </div>

      {/* Wooden Swirl / Honed Basalt Shelf Plank */}
      <div
        style={{
          margin: '0 -12px',
          height: 13,
          backgroundImage: `${grain(look.grain, look.name === 'Mocha Espresso')}linear-gradient(180deg, ${look.plank}, ${look.dark})`,
          boxShadow: '0 4px 7px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.32)',
        }}
      />
    </div>
  );
}

/* ───────────── COMPARTMENT BAY (UPPER SWING/SLIDE/FOLD/FLIP/VAULT OR LOWER BAY) ───────────── */

export function Compartment({
  shelves,
  offset,
  total,
  look,
  night,
  lit,
  open,
  onToggle,
  onMoveShelf,
  onRenameShelf,
  onAddBook,
  onRemoveBook,
  onEditBookThumbnail,
  onSelectBook,
  onRemoveKeepsake,
  onMoveKeepsake,
  onAddKeepsake,
  isBottomShutter = false,
  renderDoors = true,
}: {
  shelves: ShelfT[];
  offset: number;
  total: number;
  look: Look;
  night: boolean;
  lit: boolean;
  open: boolean;
  onToggle: () => void;
  onMoveShelf: (i: number, d: -1 | 1) => void;
  onRenameShelf: (shelfId: string, newName: string) => void;
  onAddBook: (shelfId: string) => void;
  onRemoveBook: (shelfId: string, bookId: string) => void;
  onEditBookThumbnail?: (shelfId: string, book: Book) => void;
  onSelectBook?: (book: Book) => void;
  onRemoveKeepsake: (shelfId: string, keepsakeId: string) => void;
  onMoveKeepsake: (fromShelfId: string, keepsakeId: string, targetShelfIndex: number) => void;
  onAddKeepsake: (shelfId: string) => void;
  isBottomShutter?: boolean;
  renderDoors?: boolean;
}) {
  const ink = look.light ? '#382214' : '#f5ede0';
  const doorKind = isBottomShutter ? look.lowerDoorType : look.upperDoorType;
  const scrollableUpper = !isBottomShutter && shelves.length > 3;

  const clipDoorsToBay =
    doorKind === 'classified-shutter' ||
    doorKind === 'bypass-slide' ||
    doorKind === 'pocket-fluted' ||
    doorKind === 'bunker-slide';

  return (
    <div style={{ position: 'relative', perspective: 2100, minWidth: 0, overflow: clipDoorsToBay ? 'hidden' : 'visible' }}>
      {/* Compartment Back Panel & Depth Shadow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          background:
            night && lit
              ? `radial-gradient(ellipse at 50% 0%, rgba(254,240,138,0.58), transparent 75%), ${look.back}`
              : look.back,
          boxShadow:
            'inset 0 10px 22px rgba(0,0,0,0.48), inset 10px 0 16px rgba(0,0,0,0.3), inset -10px 0 16px rgba(0,0,0,0.3)',
        }}
      />

      {/* Vertically Scrollable Compartment List when user adds >3 upper sections */}
      <div
        className={scrollableUpper ? 'sh-scroll-v' : undefined}
        style={{
          position: 'relative',
          maxHeight: scrollableUpper ? 510 : undefined,
          overflowY: scrollableUpper ? 'auto' : 'visible',
          overflowX: 'hidden',
          minWidth: 0,
        }}
      >
        {shelves.map((shelf, k) => (
          <ShelfRow
            key={shelf.id}
            shelf={shelf}
            shelfIdx={offset + k}
            bayIdx={k}
            totalShelves={total}
            look={look}
            ink={ink}
            night={night}
            lit={lit}
            open={open}
            renderDoors={renderDoors}
            onMoveShelf={onMoveShelf}
            onRenameShelf={onRenameShelf}
            onAddBook={onAddBook}
            onRemoveBook={onRemoveBook}
            onEditBookThumbnail={onEditBookThumbnail}
            onSelectBook={onSelectBook}
            onRemoveKeepsake={onRemoveKeepsake}
            onMoveKeepsake={onMoveKeepsake}
            onAddKeepsake={onAddKeepsake}
          />
        ))}
      </div>

      {/* Distinct Door Mechanism Over Every Bay */}
      {renderDoors && (
        <CabinetDoors
          look={look}
          doorKind={doorKind}
          open={open}
          onToggle={onToggle}
        />
      )}
    </div>
  );
}

/* ───────────── PROMINENT ALMIRAH WITH FLOOR-PLINTH HARDWARE SWITCHER ───────────── */

export function Almirah({
  a,
  idx,
  totalAlmirahs,
  onPrevAlmirah,
  onNextAlmirah,
  onAddShelf,
  onOpenNewAlmirah,
  night,
  lit,
  openMap,
  toggle,
  onMoveShelf,
  onRenameShelf,
  onAddBook,
  onRemoveBook,
  onEditBookThumbnail,
  onSelectBook,
  onRemoveKeepsake,
  onMoveKeepsake,
  onAddKeepsake,
  themeId = '1',
}: {
  a: AlmirahT;
  idx: number;
  totalAlmirahs: number;
  onPrevAlmirah: () => void;
  onNextAlmirah: () => void;
  onAddShelf: () => void;
  onOpenNewAlmirah: () => void;
  night: boolean;
  lit: boolean;
  openMap: Record<string, boolean>;
  toggle: (key: string) => void;
  onMoveShelf: (i: number, d: -1 | 1) => void;
  onRenameShelf: (shelfId: string, newName: string) => void;
  onAddBook: (shelfId: string) => void;
  onRemoveBook: (shelfId: string, bookId: string) => void;
  onEditBookThumbnail?: (shelfId: string, book: Book) => void;
  onSelectBook?: (book: Book) => void;
  onRemoveKeepsake: (shelfId: string, keepsakeId: string) => void;
  onMoveKeepsake: (fromShelfId: string, keepsakeId: string, targetShelfIndex: number) => void;
  onAddKeepsake: (shelfId: string) => void;
  themeId?: ShelfThemeId;
}) {
  const look = getThemeAdaptedLook(LOOKS[a.design] ?? LOOKS['Dark Chocolate']!, themeId);
  const hasUpperDoor = a.hasUpperDoor !== undefined ? a.hasUpperDoor : (look.hasUpperDoor ?? true);
  const bottom = a.shelves[a.shelves.length - 1];
  const upper = a.shelves.slice(0, -1);

  const wood = (dir: string): CSSProperties => ({
    backgroundImage: `${grain(look.grain, look.name === 'Mocha Espresso')}linear-gradient(${dir}, ${look.frame}, ${look.dark})`,
  });

  const stile = (dir: string): CSSProperties => ({ ...wood(dir) });

  const shadow = night
    ? '0 20px 44px rgba(0,0,0,0.78)'
    : '26px 18px 42px rgba(35,18,0,0.38)';

  const common = {
    look,
    total: a.shelves.length,
    night,
    lit,
    onMoveShelf,
    onRenameShelf,
    onAddBook,
    onRemoveBook,
    onEditBookThumbnail,
    onSelectBook,
    onRemoveKeepsake,
    onMoveKeepsake,
    onAddKeepsake,
  };

  const trim = getThemeAlmirahTrim(themeId);
  const plinthInk = look.light ? '#292524' : '#f5ede0';

  return (
    <div
      className="sh-almirah-wrap"
      style={{
        filter: night && !lit ? 'brightness(.82)' : 'none',
      }}
    >
      {/* Floor Drop Shadow Under Almirah */}
      <div
        style={{
          position: 'absolute',
          left: 20,
          right: 20,
          bottom: -16,
          height: 28,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(0,0,0,0.68), transparent 75%)',
          filter: 'blur(5px)',
        }}
      />

      <div style={{ position: 'relative', boxShadow: shadow, borderRadius: 3 }}>
        {/* Clean Architectural Cornice Molding */}
        <div
          style={{
            margin: '0 -8px',
            height: 26,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '4px 4px 0 0',
            boxShadow: '0 4px 6px rgba(0,0,0,.4), inset 0 2px 0 rgba(255,255,255,.3)',
            ...wood('90deg'),
          }}
        >
          <div
            style={{
              width: '94%',
              height: 3,
              borderRadius: 1,
              background: trim.corniceInlay,
              borderBottom: '1px solid rgba(255,255,255,0.18)',
            }}
          />
        </div>

        {/* Almirah Body with Side Stiles and Compartments */}
        <div style={{ display: 'flex', minWidth: 0 }}>
          {/* Left Vertical Stile */}
          <div style={{ ...stile('90deg'), position: 'relative', zIndex: 1 }} className="sh-stile flex items-center justify-center pointer-events-none">
            <div style={{ width: 1, height: '70%', background: 'rgba(255,255,255,0.15)' }} />
          </div>

          {/* Center Bays Column (zIndex: 8 + overflow: visible lets hinged vault/glass doors swing edge-to-edge) */}
          <div style={{ flex: 1, minWidth: 0, position: 'relative', zIndex: 8, overflow: 'visible' }}>
            {bottom === undefined ? (
              <div style={{ padding: '96px 16px', textAlign: 'center', background: look.back }}>
                No sections yet. Click + Section below.
              </div>
            ) : (
              <>
                {upper.length > 0 && (
                  <>
                    <Compartment
                      {...common}
                      shelves={upper}
                      offset={0}
                      open={openMap[`${a.id}:top`] === true}
                      onToggle={() => toggle(`${a.id}:top`)}
                      isBottomShutter={false}
                      renderDoors={hasUpperDoor}
                    />
                    {/* Horizontal Divider Rail between Upper 3 Bays & Lower Bay */}
                    <div
                      style={{
                        height: 14,
                        boxShadow: '0 4px 6px rgba(0,0,0,.42)',
                        ...wood('90deg'),
                      }}
                    />
                  </>
                )}

                <Compartment
                  {...common}
                  shelves={[bottom]}
                  offset={upper.length}
                  open={openMap[`${a.id}:bottom`] === true}
                  onToggle={() => toggle(`${a.id}:bottom`)}
                  isBottomShutter={true}
                  renderDoors={true}
                />
              </>
            )}
          </div>

          {/* Right Vertical Stile */}
          <div style={{ ...stile('270deg'), position: 'relative', zIndex: 1 }} className="sh-stile flex items-center justify-center pointer-events-none">
            <div style={{ width: 1, height: '70%', background: 'rgba(0,0,0,0.2)' }} />
          </div>
        </div>

        {/* Almirah Bottom Plinth (Touching Floor) with Embedded Switcher & Controls */}
        <div
          style={{
            margin: '0 -6px',
            minHeight: 44,
            padding: '6px 12px',
            borderRadius: '0 0 4px 4px',
            boxShadow: '0 5px 10px rgba(0,0,0,.42)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
            ...wood('90deg'),
          }}
        >
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onPrevAlmirah}
              className="p-1.5 rounded-lg bg-black/20 hover:bg-black/35 border border-white/15 transition cursor-pointer"
              style={{ color: plinthInk }}
              title="Previous Almirah Style"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={onNextAlmirah}
              className="px-3 py-1 rounded-lg bg-black/25 hover:bg-black/40 border text-[11px] font-bold flex items-center gap-2 shadow-xs transition cursor-pointer"
              style={{ color: plinthInk, borderColor: `${trim.accentHex}66` }}
              title="Click to switch to the next Almirah style"
            >
              <span>{look.name}</span>
              <span className="opacity-70 font-mono text-[10px]">
                ({idx + 1}/{totalAlmirahs})
              </span>
              <span
                className="flex items-center gap-0.5 text-[10px]"
                style={{ color: look.light ? '#5a3a18' : trim.accentHex }}
              >
                <span>Switch</span>
                <ChevronRight className="w-3 h-3" />
              </span>
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onAddShelf}
              className="px-2.5 py-1 rounded-lg bg-black/20 hover:bg-black/35 border border-white/15 text-[10.5px] font-semibold flex items-center gap-1 transition cursor-pointer"
              style={{ color: plinthInk }}
              title="Add an extra compartment inside this almirah"
            >
              <Plus className="w-3 h-3" style={{ color: look.light ? '#5a3a18' : trim.accentHex }} />
              <span>Section</span>
            </button>

            <button
              type="button"
              onClick={onOpenNewAlmirah}
              className="px-2.5 py-1 rounded-lg text-[10.5px] font-bold flex items-center gap-1 shadow-xs transition cursor-pointer hover:brightness-110"
              style={{ background: trim.plinthAccentBg, color: trim.plinthText }}
              title="Create a new custom almirah"
            >
              <FolderPlus className="w-3 h-3" />
              <span>New Cabinet</span>
            </button>
          </div>
        </div>

        {/* Feet / Legs on Floor */}
        {look.legs === 'metal-pin' ? (
          <>
            <div style={{ position: 'absolute', bottom: -14, left: 16, width: 8, height: 14, background: '#a1a1aa', borderRadius: '0 0 2px 2px' }} />
            <div style={{ position: 'absolute', bottom: -14, right: 16, width: 8, height: 14, background: '#a1a1aa', borderRadius: '0 0 2px 2px' }} />
          </>
        ) : (
          <>
            <div style={{ position: 'absolute', bottom: -14, left: 16, width: 14, height: 14, background: look.dark, borderRadius: '0 0 4px 4px' }} />
            <div style={{ position: 'absolute', bottom: -14, right: 16, width: 14, height: 14, background: look.dark, borderRadius: '0 0 4px 4px' }} />
          </>
        )}
      </div>
    </div>
  );
}

/* ───────────── COMPREHENSIVE ADD BOOK / MEDIA MODAL ───────────── */

export function AddBookModal({
  isOpen,
  onClose,
  shelfName,
  notebooks = [],
  driveBooks = [],
  onAddBook,
}: {
  isOpen: boolean;
  onClose: () => void;
  shelfName: string;
  notebooks?: Notebook[];
  driveBooks?: MedicalBook[];
  onAddBook: (title: string, cover: string, thumbnail?: BookThumbnailConfig) => void;
}) {
  const [activeTab, setActiveTab] = useState<'upload' | 'quick' | 'notes' | 'drive'>('upload');
  const [title, setTitle] = useState('');
  const [cover, setCover] = useState<string>(COVERS[0]);
  const [customThumb, setCustomThumb] = useState<BookThumbnailConfig | undefined>(undefined);
  const [isThumbEditorOpen, setIsThumbEditorOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '');
      onAddBook(cleanName, cover, customThumb || getDefaultThumbnail(cleanName, COVER[cover]?.from));
      setCustomThumb(undefined);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl bg-[#faf6ee] dark:bg-[#18110c] border border-[#d6c7b0] dark:border-[#382518] rounded-2xl shadow-2xl overflow-hidden text-[#1c140e] dark:text-[#efe4d4] flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#d6c7b0] dark:border-[#382518] bg-[#f2eadb] dark:bg-[#140e0a]/90">
          <div>
            <h3 className="text-lg font-bold text-[#1c140e] dark:text-[#efe4d4] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-500" />
              <span>Add Book to {shelfName}</span>
            </h3>
            <p className="text-xs text-[#6f5d4d] dark:text-[#a69079]">
              Upload your PDFs, import study notes, connect Google Drive, or add a custom book.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-[#6f5d4d] dark:text-[#a69079] hover:text-[#1c140e] dark:hover:text-[#efe4d4] hover:bg-black/5 dark:hover:bg-[#2a1d14] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#d6c7b0] dark:border-[#382518] bg-[#f5efe2] dark:bg-[#140e0a]/60 px-6 gap-2 text-xs font-semibold overflow-x-auto">
          {[
            { id: 'upload', label: 'Upload PDF / EPUB', icon: Upload },
            { id: 'notes', label: 'Import Notes', icon: FileText },
            { id: 'drive', label: 'Google Drive', icon: Cloud },
            { id: 'quick', label: 'Quick Custom', icon: Plus },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 py-3 px-3 border-b-2 transition whitespace-nowrap cursor-pointer ${
                  active
                    ? 'border-amber-600 dark:border-amber-500 text-amber-700 dark:text-amber-400'
                    : 'border-transparent text-[#6f5d4d] dark:text-[#a69079] hover:text-[#1c140e] dark:hover:text-[#efe4d4]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* TAB 1: UPLOAD LOCAL DOCUMENT */}
          {activeTab === 'upload' && (
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-[#d6c7b0] dark:border-[#382518] rounded-2xl p-8 text-center space-y-4 hover:border-amber-500/50 bg-[#f4ede0] dark:bg-[#140e0a]/50 transition">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.epub,.docx,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="w-14 h-14 rounded-full bg-amber-500/15 flex items-center justify-center text-amber-700 dark:text-amber-400">
                <Upload className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1c140e] dark:text-[#efe4d4]">
                  Select a Medical PDF or EPUB textbook
                </p>
                <p className="text-xs text-[#6f5d4d] dark:text-[#a69079] mt-1">
                  Supports .pdf, .epub, .docx up to 250MB
                </p>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white dark:text-[#110c09] text-xs font-bold transition shadow-lg cursor-pointer"
              >
                Choose Local File
              </button>
            </div>
          )}

          {/* TAB 3: IMPORT NOTES FROM USER NOTEBOOKS */}
          {activeTab === 'notes' && (
            notebooks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-80 overflow-y-auto pr-1">
                {notebooks.map((nb) => (
                  <div
                    key={nb.id}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-[#d6c7b0] dark:border-[#382518] hover:border-amber-500/50 bg-white dark:bg-[#140e0a]/80 hover:bg-[#f5efe2] dark:hover:bg-[#231912] transition group gap-2"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <BookLogoBadge
                        title={nb.title}
                        thumbnail={nb.thumbnail}
                        fallbackBg={nb.coverColor || '#1e3a8a'}
                        compact
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[#1c140e] dark:text-[#efe4d4] truncate">{nb.title}</p>
                        <span className="text-[10px] text-amber-700 dark:text-amber-400/80 uppercase font-mono tracking-wider">
                          {nb.subject} · {nb.pages.length}p
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onAddBook(nb.title, 'Navy', nb.thumbnail || getDefaultThumbnail(nb.title, nb.coverColor || '#1e3a8a'));
                        onClose();
                      }}
                      className="px-2.5 py-1 text-xs rounded-lg bg-amber-500/15 hover:bg-amber-500 text-amber-800 dark:text-amber-300 hover:text-white dark:hover:text-[#110c09] font-bold transition shrink-0 cursor-pointer"
                    >
                      ＋ Shelve
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#d6c7b0] dark:border-[#382518] bg-[#f4ede0] dark:bg-[#140e0a]/50 p-8 text-center space-y-3">
                <FileText className="w-8 h-8 text-amber-700 dark:text-amber-400/70" />
                <p className="text-xs font-semibold text-[#1c140e] dark:text-[#efe4d4]">No notebooks available to import</p>
                <p className="text-[11px] text-[#6f5d4d] dark:text-[#a69079] max-w-sm">
                  Create a notebook in Create Note or upload a local file directly into this shelf compartment.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('upload')}
                  className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white dark:text-[#110c09] text-xs font-bold transition cursor-pointer"
                >
                  Upload Note File
                </button>
              </div>
            )
          )}

          {/* TAB 4: GOOGLE DRIVE PDF VAULT */}
          {activeTab === 'drive' && (
            driveBooks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-80 overflow-y-auto pr-1">
                {driveBooks.map((dk) => (
                  <div
                    key={dk.id}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-[#d6c7b0] dark:border-[#382518] hover:border-amber-500/50 bg-white dark:bg-[#140e0a]/80 hover:bg-[#f5efe2] dark:hover:bg-[#231912] transition group gap-2"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <BookLogoBadge
                        title={dk.title}
                        thumbnail={dk.thumbnail}
                        fallbackBg={dk.coverColor || '#7c4521'}
                        compact
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[#1c140e] dark:text-[#efe4d4] truncate">{dk.title}</p>
                        <span className="text-[10px] text-amber-700 dark:text-amber-400/80 uppercase font-mono tracking-wider">
                          {dk.subject} · Drive PDF
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onAddBook(dk.title, 'Amber', dk.thumbnail || getDefaultThumbnail(dk.title, dk.coverColor || '#7c4521'));
                        onClose();
                      }}
                      className="px-2.5 py-1 text-xs rounded-lg bg-amber-500/15 hover:bg-amber-500 text-amber-800 dark:text-amber-300 hover:text-white dark:hover:text-[#110c09] font-bold transition shrink-0 cursor-pointer"
                    >
                      ＋ Shelve
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#d6c7b0] dark:border-[#382518] bg-[#f4ede0] dark:bg-[#140e0a]/50 p-8 text-center space-y-3">
                <Cloud className="w-8 h-8 text-amber-700 dark:text-amber-400/70" />
                <p className="text-xs font-semibold text-[#1c140e] dark:text-[#efe4d4]">Google Drive Folder</p>
                <p className="text-[11px] text-[#6f5d4d] dark:text-[#a69079] max-w-sm">
                  Upload PDFs with the Upload PDF (Drive) button above or switch to Upload PDF / Quick Custom to shelve your own books.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('upload')}
                  className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white dark:text-[#110c09] text-xs font-bold transition cursor-pointer"
                >
                  Upload Local / Drive PDF
                </button>
              </div>
            )
          )}

          {/* TAB 5: QUICK CUSTOM ADD */}
          {activeTab === 'quick' && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (title.trim()) {
                  onAddBook(
                    title.trim(),
                    cover,
                    customThumb || getDefaultThumbnail(title.trim(), COVER[cover]?.from)
                  );
                  setTitle('');
                  setCustomThumb(undefined);
                  onClose();
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-[#4a3728] dark:text-[#d8c7b0] mb-1.5">Book Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Current Medical Diagnosis & Treatment 2025"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-[#110c09] border border-[#d6c7b0] dark:border-[#382518] rounded-lg text-[#1c140e] dark:text-[#efe4d4] focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4a3728] dark:text-[#d8c7b0] mb-1.5">
                  Spine Leather Tone
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {COVERS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCover(c)}
                      className={`h-9 rounded-lg border-2 flex items-center justify-center transition cursor-pointer ${
                        cover === c ? 'border-amber-500 scale-105' : 'border-transparent opacity-80'
                      }`}
                      style={{ background: COVER[c]?.from ?? '#5c2c16' }}
                    >
                      {cover === c && <Check className="w-3.5 h-3.5 text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-white dark:bg-[#110c09] border border-[#d6c7b0] dark:border-[#382518]">
                <div className="flex items-center gap-2.5 min-w-0">
                  <BookLogoBadge
                    title={title.trim() || 'Book'}
                    thumbnail={customThumb}
                    fallbackBg={COVER[cover]?.from}
                    compact
                  />
                  <div className="min-w-0">
                    <span className="text-[11px] font-bold block text-[#1c140e] dark:text-[#efe4d4]">
                      Cover Logo / Icon
                    </span>
                    <span className="text-[10px] text-[#6f5d4d] dark:text-[#a69079] block truncate">
                      Default shows monogram only on shelf
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsThumbEditorOpen(true)}
                  className="px-2.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-800 dark:text-amber-300 text-[11px] font-semibold flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Palette className="w-3 h-3" />
                  <span>Customize</span>
                </button>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-[#e8dfd0] hover:bg-[#ddd1bd] dark:bg-[#231912] dark:hover:bg-[#2f2117] border border-[#d6c7b0] dark:border-[#382518] text-[#1c140e] dark:text-[#d8c7b0] text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white dark:text-[#110c09] text-xs font-bold cursor-pointer"
                >
                  Add to Shelf
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <BookThumbnailEditorModal
        isOpen={isThumbEditorOpen}
        itemTitle={title.trim() || 'New Volume'}
        initialConfig={customThumb}
        defaultBgHex={COVER[cover]?.from}
        onClose={() => setIsThumbEditorOpen(false)}
        onSave={(cfg) => {
          setCustomThumb(cfg);
          setIsThumbEditorOpen(false);
        }}
      />
    </div>
  );
}

/* ───────────── MINI ALMIRAH PREVIEW PILL ───────────── */

export function Mini({ design, themeId = '1' }: { design: string; themeId?: ShelfThemeId }) {
  const l = getThemeAdaptedLook(LOOKS[design] ?? LOOKS['Dark Chocolate']!, themeId);
  return (
    <span
      style={{
        display: 'flex',
        gap: 1.5,
        padding: 3,
        width: 38,
        height: 52,
        boxSizing: 'border-box',
        margin: '0 auto',
        background: `linear-gradient(180deg, ${l.frame}, ${l.dark})`,
        boxShadow: '1px 2px 4px rgba(0,0,0,.4)',
        borderRadius: 2,
      }}
    >
      {[0, 1].map((k) => (
        <span
          key={k}
          style={{
            flex: 1,
            background:
              l.door === 'glass' || l.door === 'split-glass'
                ? 'linear-gradient(115deg, rgba(255,255,255,.6), rgba(255,255,255,.12))'
                : l.face,
            boxShadow: `inset 0 0 0 1px ${l.dark}`,
          }}
        />
      ))}
    </span>
  );
}

/* ───────────── MAIN SHELFROOM CONTAINER ───────────── */

export interface ShelfRoomProps {
  onSelectBook?: (book: Book) => void;
  onOpenEagleView?: () => void;
  onOpenFlowcharts?: () => void;
  nightMode?: boolean;
  onToggleNight?: () => void;
  activeDesign?: DesignId | string;
  notebooks?: Notebook[];
  driveBooks?: MedicalBook[];
}

export default function ShelfRoom({
  onSelectBook,
  nightMode,
  activeDesign,
  notebooks = [],
  driveBooks = [],
}: ShelfRoomProps) {
  const [data, save] = useStored();
  const [internalNight, setInternalNight] = useState<boolean>(() => {
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
    if (nightMode !== undefined) return;
    const checkTheme = () => {
      const isDark =
        document.documentElement.classList.contains('dark') ||
        localStorage.getItem('medden_theme') === 'dark';
      setInternalNight(isDark);
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    window.addEventListener('storage', checkTheme);
    return () => {
      observer.disconnect();
      window.removeEventListener('storage', checkTheme);
    };
  }, [nightMode]);

  const [observedDesign, setObservedDesign] = useState<string>(() => {
    try {
      if (typeof document !== 'undefined') {
        return document.documentElement.getAttribute('data-design') || localStorage.getItem('medden_active_design') || '1';
      }
    } catch {}
    return '1';
  });

  useEffect(() => {
    if (activeDesign !== undefined) return;
    const syncDesign = () => {
      const d = document.documentElement.getAttribute('data-design') || localStorage.getItem('medden_active_design') || '1';
      setObservedDesign(d);
    };
    syncDesign();
    const obs = new MutationObserver(syncDesign);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-design'] });
    return () => obs.disconnect();
  }, [activeDesign]);

  const themeId: ShelfThemeId = resolveShelfThemeId(activeDesign ?? observedDesign);
  const night = nightMode !== undefined ? nightMode : internalNight;

  const [lit, setLit] = useState(false);
  const [pulled, setPulled] = useState(false);
  const [at, setAt] = useState(0);

  /* Doors start closed so books appear behind glass (or opaque steel) and unlock when opened */
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});

  /* Modals */
  const [activeAddShelfId, setActiveAddShelfId] = useState<string | null>(null);
  const [editingShelfBook, setEditingShelfBook] = useState<{ shelfId: string; book: Book } | null>(null);
  const [isNewAlmirahModalOpen, setIsNewAlmirahModalOpen] = useState(false);
  const [newAlmirahName, setNewAlmirahName] = useState('');
  const [selectedDesign, setSelectedDesign] = useState<string>(DESIGNS[0]);

  const idx = Math.min(at, Math.max(data.length - 1, 0));
  const current = data[idx] ?? data[0];

  const [shelfZoom, setShelfZoom] = useState<number>(() => {
    try {
      const saved = parseInt(localStorage.getItem('ach1ev_shelf_zoom_pct') || '100', 10);
      if (Number.isFinite(saved) && saved >= 60 && saved <= 160) return saved;
    } catch {}
    return 100;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ach1ev_shelf_zoom_pct', String(shelfZoom));
    } catch {}
  }, [shelfZoom]);

  const patch = (id: string, fn: (a: AlmirahT) => AlmirahT) =>
    save(data.map((a) => (a.id === id ? fn(a) : a)));

  const pull = () => {
    setPulled(true);
    setLit((v) => !v);
    window.setTimeout(() => setPulled(false), 180);
  };

  const moveShelf = (a: AlmirahT, i: number, d: -1 | 1) => {
    const sList = [...a.shelves];
    const other = sList[i + d];
    const me = sList[i];
    if (!other || !me) return;
    sList[i + d] = me;
    sList[i] = other;
    patch(a.id, (x) => ({ ...x, shelves: sList }));
  };

  const handleRenameShelf = (shelfId: string, newName: string) => {
    save(
      data.map((a) => ({
        ...a,
        shelves: a.shelves.map((s) => (s.id === shelfId ? { ...s, name: newName } : s)),
      }))
    );
  };

  const handleAddShelfToAlmirah = (almirahId: string) => {
    patch(almirahId, (a) => ({
      ...a,
      shelves: [
        ...a.shelves.slice(0, -1),
        mk(`Section ${a.shelves.length}`, []),
        ...a.shelves.slice(-1),
      ],
    }));
  };

  const handleAddBookToShelf = (
    shelfId: string,
    title: string,
    cover: string,
    thumbnail?: BookThumbnailConfig
  ) => {
    const resolvedThumb = thumbnail || getDefaultThumbnail(title, COVER[cover]?.from);
    save(
      data.map((a) => ({
        ...a,
        shelves: a.shelves.map((s) =>
          s.id === shelfId
            ? { ...s, books: [...s.books, { id: uid(), title, cover, thumbnail: resolvedThumb }] }
            : s
        ),
      }))
    );
  };

  const handleUpdateBookThumbnail = (
    shelfId: string,
    bookId: string,
    thumbnail: BookThumbnailConfig
  ) => {
    save(
      data.map((a) => ({
        ...a,
        shelves: a.shelves.map((s) =>
          s.id === shelfId
            ? {
                ...s,
                books: s.books.map((b) => (b.id === bookId ? { ...b, thumbnail } : b)),
              }
            : s
        ),
      }))
    );
  };

  const handleRemoveBookFromShelf = (shelfId: string, bookId: string) => {
    save(
      data.map((a) => ({
        ...a,
        shelves: a.shelves.map((s) =>
          s.id === shelfId
            ? { ...s, books: s.books.filter((b) => b.id !== bookId) }
            : s
        ),
      }))
    );
  };

  const handleRemoveKeepsake = (shelfId: string, keepsakeId: string) => {
    save(
      data.map((a) => ({
        ...a,
        shelves: a.shelves.map((s) =>
          s.id === shelfId
            ? { ...s, keepsakes: (s.keepsakes || []).filter((k) => k.id !== keepsakeId) }
            : s
        ),
      }))
    );
  };

  const handleMoveKeepsake = (
    fromShelfId: string,
    keepsakeId: string,
    targetShelfIndex: number
  ) => {
    if (!current) return;
    let foundItem: KeepsakeItem | undefined;

    const updatedShelves = current.shelves.map((s) => {
      if (s.id === fromShelfId) {
        const item = (s.keepsakes || []).find((k) => k.id === keepsakeId);
        if (item) foundItem = item;
        return { ...s, keepsakes: (s.keepsakes || []).filter((k) => k.id !== keepsakeId) };
      }
      return s;
    });

    if (foundItem && updatedShelves[targetShelfIndex]) {
      const targetShelf = updatedShelves[targetShelfIndex];
      updatedShelves[targetShelfIndex] = {
        ...targetShelf,
        keepsakes: [...(targetShelf.keepsakes || []), foundItem],
      };
      patch(current.id, (a) => ({ ...a, shelves: updatedShelves }));
    }
  };

  const handleAddKeepsakeToShelf = (shelfId: string) => {
    const themeOptions: Array<{ type: KeepsakeType; label: string }> =
      themeId === '2'
        ? [
            { type: 'forest-lantern', label: 'Woodland Lantern' },
            { type: 'moss-terrarium', label: 'Moss Glass Terrarium' },
            { type: 'succulent-pot', label: 'Forest Fern Pot' },
            { type: 'book-stack', label: 'Field Journals' },
          ]
        : themeId === '3'
        ? [
            { type: 'conch-shell', label: 'Seaside Conch' },
            { type: 'coral-sculpt', label: 'Reef Coral Sculpture' },
            { type: 'starfish-sculpt', label: 'Golden Starfish' },
            { type: 'bottles-apothecary', label: 'Message Bottles' },
          ]
        : themeId === '4'
        ? [
            { type: 'chai-kulhad', label: 'Steaming Chai Kulhad' },
            { type: 'paper-boat', label: 'Monsoon Paper Boat' },
            { type: 'clock-brass', label: 'Rain Veranda Clock' },
            { type: 'book-stack', label: 'Rainy Day Reading' },
          ]
        : themeId === '5'
        ? [
            { type: 'modern-ring', label: 'Alpine Geometric Ring' },
            { type: 'clock-brass', label: 'Swiss Precision Chronometer' },
            { type: 'book-stack', label: 'Chalet Compendium' },
          ]
        : themeId === '6'
        ? [
            { type: 'moss-terrarium', label: 'Conservatory Terrarium' },
            { type: 'succulent-pot', label: 'Botanical Specimen' },
            { type: 'bottles-apothecary', label: 'Apothecary Vial Pair' },
          ]
        : themeId === '7'
        ? [
            { type: 'clock-brass', label: 'Astronomer Astrolabe Clock' },
            { type: 'modern-ring', label: 'Celestial Brass Ring' },
            { type: 'forest-lantern', label: 'Observatory Hurricane Lamp' },
          ]
        : themeId === '8'
        ? [
            { type: 'vase-gold', label: 'Oxford Gilded Urn' },
            { type: 'book-stack', label: 'Bound Folio Stack' },
            { type: 'clock-brass', label: 'Scriptorium Mantel Clock' },
          ]
        : themeId === '9'
        ? [
            { type: 'rattan-basket', label: 'Woven Archival Crate' },
            { type: 'book-stack', label: 'Broadsheet Bindings' },
            { type: 'vase-gold', label: 'Travertine Studio Vessel' },
          ]
        : themeId === '10'
        ? [
            { type: 'modern-ring', label: 'Nordic Ring Sculpture' },
            { type: 'bottles-apothecary', label: 'Fjord Frosted Glass' },
            { type: 'succulent-pot', label: 'Arctic Lichen Planter' },
          ]
        : [];

    const keepsakeOptions: Array<{ type: KeepsakeType; label: string }> = [
      ...themeOptions,
      ...themeOptions,
      { type: 'vase-gold', label: 'Porcelain Vase' },
      { type: 'clock-brass', label: 'Brass Clock' },
      { type: 'succulent-pot', label: 'Potted Succulent' },
      { type: 'book-stack', label: 'Stacked Volumes' },
      { type: 'rattan-basket', label: 'Wicker Basket' },
      { type: 'starfish-sculpt', label: 'Starfish Sculpture' },
      { type: 'bottles-apothecary', label: 'Apothecary Bottles' },
      { type: 'modern-ring', label: 'Geometric Ring' },
    ];
    const picked = keepsakeOptions[Math.floor(Math.random() * keepsakeOptions.length)]!;

    save(
      data.map((a) => ({
        ...a,
        shelves: a.shelves.map((s) =>
          s.id === shelfId
            ? { ...s, keepsakes: [...(s.keepsakes || []), { id: uid(), ...picked }] }
            : s
        ),
      }))
    );
  };

  const activeShelfObj = current?.shelves.find((s) => s.id === activeAddShelfId);

  return (
    <div style={{ maxWidth: 1180, margin: '0 auto', padding: '6px 6px', font: '14px system-ui', position: 'relative' }}>
      <style>{CSS}</style>

      {/* Floating Shelf Zoom Control Bar (Pinch-Zoom + Tap Zoom for Mobile & Desktop) */}
      <div
        className="flex items-center justify-end mb-2 px-1"
        style={{ position: 'relative', zIndex: 25 }}
      >
        <div
          className="inline-flex items-center gap-1 px-2 py-1 rounded-full border shadow-sm backdrop-blur-md"
          style={{
            background: night ? 'rgba(20, 14, 10, 0.78)' : 'rgba(253, 250, 244, 0.85)',
            borderColor: night ? 'rgba(212, 175, 55, 0.3)' : 'rgba(139, 98, 45, 0.25)',
            color: night ? '#efe4d4' : '#2b2118',
          }}
        >
          <button
            type="button"
            onClick={() => setShelfZoom((z) => Math.max(60, z - 10))}
            disabled={shelfZoom <= 60}
            className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-35 cursor-pointer"
            title="Zoom out Shelf"
            aria-label="Zoom out shelf"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setShelfZoom(100)}
            className="px-1.5 py-0.5 rounded-full text-[11px] font-mono font-bold hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer flex items-center gap-1"
            title="Reset Shelf Zoom to 100%"
          >
            <span>Shelf {shelfZoom}%</span>
            {shelfZoom !== 100 && <RotateCcw className="w-2.5 h-2.5 opacity-70" />}
          </button>
          <button
            type="button"
            onClick={() => setShelfZoom((z) => Math.min(160, z + 10))}
            disabled={shelfZoom >= 160}
            className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-35 cursor-pointer"
            title="Zoom in Shelf"
            aria-label="Zoom in shelf"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ULTRA REALISTIC ROOM ENVIRONMENT (Pinch-Zoom & Interactive Scale Container) */}
      <div className="sh-zoom-stage sh-scroll">
        <div style={{ zoom: shelfZoom / 100 }}>
          <Room
            night={night}
            lit={lit}
            pulled={pulled}
            onPull={pull}
            design={current ? current.design : DESIGNS[0]}
            bayIdx={idx}
            themeId={themeId}
          >
            {data.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#fff', textShadow: '0 1px 3px #000', pointerEvents: 'auto' }}>
                No almirah in your room yet. Click New Cabinet to create one.
              </p>
            ) : (
              <div style={{ overflow: 'hidden', pointerEvents: 'none' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    transition: 'transform .75s cubic-bezier(0.25, 1, 0.3, 1)',
                    transform: `translateX(-${idx * 100}%)`,
                    pointerEvents: 'none',
                  }}
                >
                  {data.map((a) => (
                    <div
                      key={a.id}
                      style={{ width: '100%', flex: 'none', padding: '0 2px', boxSizing: 'border-box', pointerEvents: 'none' }}
                    >
                      <Almirah
                        a={a}
                        idx={idx}
                        totalAlmirahs={data.length}
                        onPrevAlmirah={() => setAt((i) => (i - 1 + data.length) % data.length)}
                        onNextAlmirah={() => setAt((i) => (i + 1) % data.length)}
                        onAddShelf={() => handleAddShelfToAlmirah(a.id)}
                        onOpenNewAlmirah={() => setIsNewAlmirahModalOpen(true)}
                        night={night}
                        lit={lit}
                        openMap={openMap}
                        toggle={(k) => setOpenMap((m) => ({ ...m, [k]: !m[k] }))}
                        onMoveShelf={(i, d) => moveShelf(a, i, d)}
                        onRenameShelf={handleRenameShelf}
                        onAddBook={(shelfId) => setActiveAddShelfId(shelfId)}
                        onRemoveBook={handleRemoveBookFromShelf}
                        onEditBookThumbnail={(shelfId, book) => setEditingShelfBook({ shelfId, book })}
                        onSelectBook={onSelectBook}
                        onRemoveKeepsake={handleRemoveKeepsake}
                        onMoveKeepsake={handleMoveKeepsake}
                        onAddKeepsake={handleAddKeepsakeToShelf}
                        themeId={themeId}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Room>
        </div>
      </div>

      {/* COMPREHENSIVE ADD BOOK MODAL */}
      <AddBookModal
        isOpen={activeAddShelfId !== null}
        onClose={() => setActiveAddShelfId(null)}
        shelfName={activeShelfObj?.name || 'Shelf'}
        notebooks={notebooks}
        driveBooks={driveBooks}
        onAddBook={(bookTitle, bookCover, thumbCfg) => {
          if (activeAddShelfId) handleAddBookToShelf(activeAddShelfId, bookTitle, bookCover, thumbCfg);
        }}
      />

      {/* SHELF BOOK THUMBNAIL / LOGO / 100 ICONS EDITOR MODAL */}
      <BookThumbnailEditorModal
        isOpen={editingShelfBook !== null}
        itemTitle={editingShelfBook?.book.title || ''}
        initialConfig={editingShelfBook?.book.thumbnail}
        defaultBgHex={
          editingShelfBook ? (COVER[editingShelfBook.book.cover]?.from || '#5C351C') : '#5C351C'
        }
        onClose={() => setEditingShelfBook(null)}
        onSave={(cfg) => {
          if (editingShelfBook) {
            handleUpdateBookThumbnail(editingShelfBook.shelfId, editingShelfBook.book.id, cfg);
          }
          setEditingShelfBook(null);
        }}
      />

      {/* CREATE NEW ALMIRAH MODAL */}
      {isNewAlmirahModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#faf6ee] dark:bg-[#18110c] border border-[#d6c7b0] dark:border-[#382518] rounded-2xl p-6 shadow-2xl text-[#1c140e] dark:text-[#efe4d4] max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-[#1c140e] dark:text-[#efe4d4] mb-1 flex items-center gap-2">
              <FolderPlus className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Add New Almirah / Bookcase</span>
            </h3>
            <p className="text-xs text-[#6f5d4d] dark:text-[#a69079] mb-4">
              Select one of the 5 color-finish styles and name your new bookcase.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (newAlmirahName.trim()) {
                  const newAlmirah: AlmirahT = {
                    id: uid(),
                    name: newAlmirahName.trim(),
                    design: selectedDesign,
                    hasUpperDoor: true,
                    shelves: [
                      mk('Section 1', []),
                      mk('Section 2', []),
                      mk('Section 3', []),
                      mk('Lower Section', []),
                    ],
                  };
                  save([...data, newAlmirah]);
                  setAt(data.length);
                  setNewAlmirahName('');
                  setIsNewAlmirahModalOpen(false);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-[#4a3728] dark:text-[#d8c7b0] mb-1">Bookcase Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Surgical Operative Library"
                  value={newAlmirahName}
                  onChange={(e) => setNewAlmirahName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-[#110c09] border border-[#d6c7b0] dark:border-[#382518] rounded-lg text-[#1c140e] dark:text-[#efe4d4] focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4a3728] dark:text-[#d8c7b0] mb-1.5">Finish & Door Mechanism</label>
                <div className="grid grid-cols-1 gap-2">
                  {DESIGNS.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setSelectedDesign(d)}
                      className={`flex items-center gap-3 p-2.5 rounded-xl border text-left transition cursor-pointer ${
                        selectedDesign === d
                          ? 'border-amber-500 bg-amber-500/12 text-amber-800 dark:text-amber-300'
                          : 'border-[#d6c7b0] dark:border-[#382518] bg-white dark:bg-[#140e0a]/70 text-[#6f5d4d] dark:text-[#a69079] hover:text-[#1c140e] dark:hover:text-[#efe4d4]'
                      }`}
                    >
                      <Mini design={d} themeId={themeId} />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold">{LOOKS[d]?.name}</p>
                        <p className="text-[10px] text-[#6f5d4d] dark:text-[#a69079]">{LOOKS[d]?.accentDesc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewAlmirahModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-[#e8dfd0] hover:bg-[#ddd1bd] dark:bg-[#231912] dark:hover:bg-[#2f2117] border border-[#d6c7b0] dark:border-[#382518] text-[#1c140e] dark:text-[#d8c7b0] text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white dark:text-[#110c09] text-xs font-bold cursor-pointer"
                >
                  Create Almirah
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
