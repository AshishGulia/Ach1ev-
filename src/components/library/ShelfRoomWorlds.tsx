import React from 'react';
import type { DesignId } from '../../types';

export type ShelfThemeId = '1' | '2' | '3' | '4' | '5';

const VALID_IDS = new Set<ShelfThemeId>(['1', '2', '3', '4', '5']);

export function resolveShelfThemeId(activeDesign?: DesignId | string): ShelfThemeId {
  if (activeDesign && VALID_IDS.has(activeDesign as ShelfThemeId)) {
    return activeDesign as ShelfThemeId;
  }
  return '1';
}

export function resolveShelfAssetCssUrl(filename: string): string {
  const base =
    typeof import.meta !== 'undefined' && (import.meta as { env?: { BASE_URL?: string } }).env?.BASE_URL
      ? (import.meta as { env?: { BASE_URL?: string } }).env!.BASE_URL!
      : '/';
  const normalizedBase = base === './' ? './' : base.endsWith('/') ? base : `${base}/`;
  return `url("${normalizedBase}assets/shelf/${filename}")`;
}

const SHELF_SCENE_IMAGES: Record<ShelfThemeId, { day: string; night: string }> = {
  '1': {
    day: resolveShelfAssetCssUrl('theme1-day.jpg?v=1'),
    night: resolveShelfAssetCssUrl('theme1-night.jpg?v=1'),
  },
  '2': {
    day: resolveShelfAssetCssUrl('theme2-day.jpg?v=1'),
    night: resolveShelfAssetCssUrl('theme2-night.jpg?v=1'),
  },
  '3': {
    day: resolveShelfAssetCssUrl('theme3-day.jpg?v=1'),
    night: resolveShelfAssetCssUrl('theme3-night.jpg?v=1'),
  },
  '4': {
    day: resolveShelfAssetCssUrl('theme4-day.jpg?v=1'),
    night: resolveShelfAssetCssUrl('theme4-night.jpg?v=1'),
  },
  '5': {
    day: resolveShelfAssetCssUrl('theme5-day.jpg?v=1'),
    night: resolveShelfAssetCssUrl('theme5-night.jpg?v=1'),
  },
};

const BAY_BG_POSITIONS = ['40% 42%', '46% 45%', '50% 46%', '55% 44%', '60% 42%'];

/* ───────────── REAL SCENIC PHOTOGRAPHIC CSS VISTA (MATCHED DAY & NIGHT) ───────────── */
const ScenicPhotoVista: React.FC<{
  themeId: ShelfThemeId;
  night: boolean;
  variantIdx: number;
  dayFilter?: string;
  nightFilter?: string;
  dayScrim?: string;
  nightScrim?: string;
}> = ({
  themeId,
  night,
  variantIdx,
  dayFilter = 'brightness(1.03) saturate(1.06)',
  nightFilter = 'brightness(0.95) contrast(1.05)',
  dayScrim = 'linear-gradient(180deg, rgba(255,252,244,0.12) 0%, rgba(16,12,8,0.04) 55%, rgba(16,12,8,0.22) 100%)',
  nightScrim = 'linear-gradient(180deg, rgba(4,8,20,0.22) 0%, rgba(4,8,20,0.12) 55%, rgba(4,8,16,0.42) 100%)',
}) => {
  const v = ((variantIdx % 5) + 5) % 5;
  const pos = BAY_BG_POSITIONS[v] || '50% 45%';
  const imgs = SHELF_SCENE_IMAGES[themeId];

  return (
    <>
      {/* Real Daytime Scenic Photograph */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: imgs.day,
          backgroundSize: 'cover',
          backgroundPosition: pos,
          backgroundRepeat: 'no-repeat',
          filter: dayFilter,
          opacity: night ? 0 : 1,
          transform: `scale(${1.02 + v * 0.01})`,
          transition: 'opacity 0.65s ease, filter 0.65s ease, background-position 0.7s ease',
        }}
      />
      {/* Real Nighttime Scenic Photograph */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: imgs.night,
          backgroundSize: 'cover',
          backgroundPosition: pos,
          backgroundRepeat: 'no-repeat',
          filter: nightFilter,
          opacity: night ? 1 : 0,
          transform: `scale(${1.02 + v * 0.01})`,
          transition: 'opacity 0.65s ease, filter 0.65s ease, background-position 0.7s ease',
        }}
      />
      {/* Atmospheric Depth & Readability Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: night ? nightScrim : dayScrim,
          transition: 'background 0.65s ease',
          pointerEvents: 'none',
        }}
      />
    </>
  );
};

/* ───────────── DEDICATED CELESTIAL SUN (DAY) & MOON + STARS (NIGHT) ───────────── */
const NIGHT_SKY_STARS = [
  { top: '7%', left: '6%', size: 2.6, delay: '0s' },
  { top: '13%', left: '19%', size: 2.0, delay: '0.7s' },
  { top: '5%', left: '24%', size: 1.8, delay: '1.4s' },
  { top: '20%', left: '8%', size: 2.2, delay: '0.4s' },
  { top: '16%', left: '15%', size: 1.6, delay: '1.9s' },
  { top: '8%', right: '7%', size: 2.5, delay: '0.3s' },
  { top: '15%', right: '19%', size: 2.0, delay: '1.1s' },
  { top: '6%', right: '23%', size: 1.8, delay: '1.8s' },
  { top: '22%', right: '11%', size: 2.2, delay: '0.6s' },
  { top: '11%', right: '14%', size: 2.8, delay: '1.5s' },
];

const CelestialSkyOrb: React.FC<{
  night: boolean;
  variantIdx?: number;
  cloudVeiled?: boolean;
  topOffset?: number;
}> = ({ night, variantIdx = 0, cloudVeiled = false, topOffset = 14 }) => {
  const v = ((variantIdx % 5) + 5) % 5;
  // Place clearly in upper-left or upper-right sky wings flanking the central almirah (away from pull cord at 89.5%)
  const alignRight = v === 2;
  const horizontalPos: React.CSSProperties = alignRight
    ? { right: '15.5%' }
    : { left: `${10.5 + (v % 3) * 1.4}%` };

  return (
    <>
      {/* Delicate Twinkling Stars Across Open Night Sky */}
      {night && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            opacity: cloudVeiled ? 0.35 : 0.92,
            transition: 'opacity 0.6s ease',
          }}
        >
          {NIGHT_SKY_STARS.map((s, idx) => (
            <div
              key={idx}
              style={{
                position: 'absolute',
                top: s.top,
                left: s.left,
                right: s.right,
                width: s.size,
                height: s.size,
                borderRadius: '50%',
                background: '#f8fafc',
                boxShadow: '0 0 6px 1.5px rgba(226, 232, 240, 0.85)',
                animation: `jugnooGlow ${2.4 + (idx % 3) * 0.7}s ease-in-out infinite alternate`,
                animationDelay: s.delay,
              }}
            />
          ))}
        </div>
      )}

      {/* Unmistakable Luminous Sun (Day Mode) or Silver Moon (Night Mode) */}
      <div
        className="sh-celestial-orb"
        aria-label={night ? 'Night moon in sky' : 'Daytime sun in sky'}
        style={{
          position: 'absolute',
          top: topOffset,
          ...horizontalPos,
          width: 60,
          height: 60,
          pointerEvents: 'none',
          zIndex: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'left 0.6s ease, right 0.6s ease, opacity 0.6s ease',
        }}
      >
        {!night ? (
          /* DAYTIME RADIANT SUN (SURAJ) */
          <div style={{ position: 'relative', width: 58, height: 58, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Soft outer solar corona */}
            <div
              style={{
                position: 'absolute',
                inset: -16,
                borderRadius: '50%',
                background: cloudVeiled
                  ? 'radial-gradient(circle, rgba(254,240,138,0.62) 0%, rgba(253,224,71,0.24) 48%, transparent 74%)'
                  : 'radial-gradient(circle, rgba(254,249,195,0.88) 0%, rgba(253,224,71,0.42) 45%, rgba(245,158,11,0.12) 68%, transparent 80%)',
                filter: 'blur(3px)',
              }}
            />
            {/* Sun rays */}
            <svg
              viewBox="0 0 80 80"
              width="66"
              height="66"
              style={{
                position: 'absolute',
                opacity: cloudVeiled ? 0.55 : 0.88,
                filter: 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.75))',
              }}
            >
              {Array.from({ length: 12 }, (_, idx) => {
                const angle = idx * 30;
                return (
                  <line
                    key={idx}
                    x1="40"
                    y1="5"
                    x2="40"
                    y2={idx % 2 === 0 ? '14' : '17'}
                    stroke="#fde047"
                    strokeWidth={idx % 2 === 0 ? '2.4' : '1.6'}
                    strokeLinecap="round"
                    transform={`rotate(${angle} 40 40)`}
                  />
                );
              })}
            </svg>
            {/* Glowing Sun Disc */}
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: 'radial-gradient(circle at 38% 35%, #ffffff 0%, #fef08a 42%, #f59e0b 95%)',
                boxShadow: cloudVeiled
                  ? '0 0 20px 6px rgba(254,240,138,0.75)'
                  : '0 0 24px 8px rgba(253,224,71,0.9), 0 0 54px 18px rgba(251,191,36,0.45)',
              }}
            />
            {/* Subtle drifting monsoon cloud veil across lower sun edge in Rain theme */}
            {cloudVeiled && (
              <svg viewBox="0 0 64 26" width="54" height="22" style={{ position: 'absolute', bottom: 4, left: 4, opacity: 0.85 }}>
                <path
                  d="M10 21 H52 C57 21 60 17 58 13 C57 9 52 8 48 10 C45 4 36 3 31 8 C26 5 18 7 17 12 C11 12 7 15 10 21 Z"
                  fill="rgba(226, 232, 240, 0.82)"
                />
              </svg>
            )}
          </div>
        ) : (
          /* NIGHTTIME LUMINOUS SILVER MOON (CHAAND) */
          <div style={{ position: 'relative', width: 54, height: 54, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Soft lunar silver halo */}
            <div
              style={{
                position: 'absolute',
                inset: -16,
                borderRadius: '50%',
                background: cloudVeiled
                  ? 'radial-gradient(circle, rgba(226,232,240,0.45) 0%, rgba(148,163,184,0.16) 52%, transparent 74%)'
                  : 'radial-gradient(circle, rgba(241,245,249,0.58) 0%, rgba(186,230,253,0.22) 48%, transparent 76%)',
                filter: 'blur(3px)',
              }}
            />
            {/* Realistic Silver Full/Gibbous Moon with Craters */}
            <svg
              viewBox="0 0 60 60"
              width="38"
              height="38"
              style={{
                filter: 'drop-shadow(0 0 12px rgba(226, 232, 240, 0.88))',
              }}
            >
              <defs>
                <radialGradient id="shelfMoonGrad" cx="35%" cy="32%" r="70%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="55%" stopColor="#e2e8f0" />
                  <stop offset="100%" stopColor="#94a3b8" />
                </radialGradient>
              </defs>
              <circle cx="30" cy="30" r="24" fill="url(#shelfMoonGrad)" />
              <circle cx="22" cy="21" r="4.2" fill="#94a3b8" opacity="0.32" />
              <circle cx="37" cy="24" r="3.0" fill="#64748b" opacity="0.28" />
              <circle cx="33" cy="38" r="5.2" fill="#94a3b8" opacity="0.28" />
              <circle cx="20" cy="36" r="2.4" fill="#64748b" opacity="0.24" />
              <circle cx="40" cy="32" r="2.1" fill="#94a3b8" opacity="0.22" />
            </svg>
            {cloudVeiled && (
              <svg viewBox="0 0 64 26" width="52" height="21" style={{ position: 'absolute', bottom: 4, left: 4, opacity: 0.78 }}>
                <path
                  d="M10 21 H52 C57 21 60 17 58 13 C57 9 52 8 48 10 C45 4 36 3 31 8 C26 5 18 7 17 12 C11 12 7 15 10 21 Z"
                  fill="rgba(30, 41, 59, 0.82)"
                />
              </svg>
            )}
          </div>
        )}
      </div>
    </>
  );
};

/** Tasteful per-theme almirah palette overrides preserving Theme 1 architectural decency */
export interface ThemeLookTint {
  frame?: string;
  dark?: string;
  back?: string;
  plank?: string;
  face?: string;
  handle?: string;
}

const THEME_LOOK_OVERRIDES: Record<Exclude<ShelfThemeId, '1'>, Record<string, ThemeLookTint>> = {
  '2': {
    'Dark Chocolate': { frame: '#322318', dark: '#1d140d', back: '#141a14', plank: '#433020', face: '#322318', handle: '#c8a96a' },
    'Creamy Caramel': { frame: '#8f7451', dark: '#634d33', back: '#3b3325', plank: '#a3865f', face: '#8f7451', handle: '#f3ecd8' },
    'Vanilla White': { frame: '#eae7dc', dark: '#c5c2b2', back: '#dee0d4', plank: '#dbd8cb', face: '#f2f0e8', handle: '#526050' },
    'Mocha Espresso': { frame: '#2d3a33', dark: '#18211c', back: '#101713', plank: '#3d4d44', face: '#27332c', handle: '#d7cdb6' },
    Vault: { frame: '#141b16', dark: '#090e0b', back: '#050806', plank: '#1c261f', face: '#101612', handle: '#b99c58' },
  },
  '3': {
    'Dark Chocolate': { frame: '#594230', dark: '#38281c', back: '#22282d', plank: '#6d533d', face: '#594230', handle: '#e6c88a' },
    'Creamy Caramel': { frame: '#c9b18e', dark: '#937c5d', back: '#5d5342', plank: '#d6c1a2', face: '#c9b18e', handle: '#fdf9ee' },
    'Vanilla White': { frame: '#f5f2eb', dark: '#d8d2c6', back: '#ece9e2', plank: '#e7e3da', face: '#faf8f3', handle: '#4e6f7a' },
    'Mocha Espresso': { frame: '#2d3f4c', dark: '#19252e', back: '#111a21', plank: '#3c5363', face: '#263642', handle: '#e8dec8' },
    Vault: { frame: '#141c24', dark: '#090e12', back: '#06090c', plank: '#1c2732', face: '#10171e', handle: '#d4b46a' },
  },
  '4': {
    'Dark Chocolate': { frame: '#362620', dark: '#1e1410', back: '#151921', plank: '#47332b', face: '#362620', handle: '#d5a865' },
    'Creamy Caramel': { frame: '#b38862', dark: '#7c593c', back: '#44352a', plank: '#c29973', face: '#b38862', handle: '#f6ead8' },
    'Vanilla White': { frame: '#eceae6', dark: '#c8c6c0', back: '#dfe1e2', plank: '#dbd9d4', face: '#f2f1ed', handle: '#526273' },
    'Mocha Espresso': { frame: '#2d3440', dark: '#191e26', back: '#11151b', plank: '#3d4654', face: '#262c36', handle: '#e2cfb4' },
    Vault: { frame: '#14171e', dark: '#080a0e', back: '#050609', plank: '#1c202a', face: '#101218', handle: '#c99f52' },
  },
  '5': {
    'Dark Chocolate': { frame: '#181a18', dark: '#0c0d0c', back: '#060706', plank: '#242923', face: '#181a18', handle: '#a8d98b' },
    'Creamy Caramel': { frame: '#9ab088', dark: '#6d825d', back: '#3e4d33', plank: '#b0c49e', face: '#9ab088', handle: '#f4faee' },
    'Vanilla White': { frame: '#edf6e4', dark: '#c7dcba', back: '#e2efd7', plank: '#d7e8ca', face: '#f5fbf0', handle: '#4a8235' },
    'Mocha Espresso': { frame: '#121316', dark: '#070809', back: '#030304', plank: '#1d1f23', face: '#0e0f12', handle: '#c7e8b0' },
    Vault: { frame: '#0b0c0e', dark: '#040405', back: '#020203', plank: '#141518', face: '#08090b', handle: '#a8d98b' },
  },
};

export function getThemeAdaptedLook<
  T extends { name: string; frame: string; dark: string; back: string; plank: string; face: string; handle: string },
>(baseLook: T, themeId: ShelfThemeId): T {
  if (themeId === '1') return baseLook;
  const themeOverrides = THEME_LOOK_OVERRIDES[themeId];
  const override =
    themeOverrides?.[baseLook.name] ??
    (baseLook.name === 'Classic Walnut' ? themeOverrides?.['Dark Chocolate'] : undefined);
  if (!override) return baseLook;
  return { ...baseLook, ...override };
}

export interface ThemeAlmirahTrim {
  accentHex: string;
  corniceInlay: string;
  plinthAccentBg: string;
  plinthText: string;
}

export function getThemeAlmirahTrim(themeId: ShelfThemeId): ThemeAlmirahTrim {
  switch (themeId) {
    case '2':
      return { accentHex: '#5ca376', corniceInlay: 'linear-gradient(90deg, transparent, rgba(114,196,138,0.45), transparent)', plinthAccentBg: '#2f6b43', plinthText: '#f4fbf6' };
    case '3':
      return { accentHex: '#4fb0cc', corniceInlay: 'linear-gradient(90deg, transparent, rgba(125,211,252,0.5), transparent)', plinthAccentBg: '#1c637a', plinthText: '#f4fbfd' };
    case '4':
      return { accentHex: '#7ea5d6', corniceInlay: 'linear-gradient(90deg, transparent, rgba(147,197,253,0.45), transparent)', plinthAccentBg: '#365578', plinthText: '#f3f7fc' };
    case '5':
      return { accentHex: '#a8d98b', corniceInlay: 'linear-gradient(90deg, transparent, rgba(168,217,139,0.5), transparent)', plinthAccentBg: '#27292c', plinthText: '#eef7e8' };
    default:
      return { accentHex: '#d4af37', corniceInlay: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.42), transparent)', plinthAccentBg: '#b4742a', plinthText: '#1b1108' };
  }
}

/* ───────────── DAYTIME FLUTTERING BUTTERFLIES (Themes 1 & 2 Day Mode) ───────────── */
export const DayButterflies: React.FC<{ forestTone?: boolean }> = ({ forestTone = false }) => {
  const butterflies = [
    { top: '22%', left: '16%', color1: forestTone ? '#eab308' : '#f59e0b', color2: '#fef08a', delay: '0s', dur: '7.5s', size: 22 },
    { top: '39%', left: '78%', color1: forestTone ? '#38bdf8' : '#fb923c', color2: '#fde68a', delay: '1.8s', dur: '8.8s', size: 20 },
    { top: '16%', left: '74%', color1: '#a78bfa', color2: '#e9d5ff', delay: '0.9s', dur: '9.6s', size: 18 },
  ];
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 13 }}>
      {butterflies.map((b, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: b.top,
            left: b.left,
            animation: `butterflyFlight ${b.dur} ease-in-out infinite alternate`,
            animationDelay: b.delay,
          }}
        >
          <svg
            viewBox="0 0 36 28"
            width={b.size}
            height={Math.round(b.size * 0.78)}
            style={{
              filter: 'drop-shadow(0 3px 5px rgba(0,0,0,0.28))',
              animation: 'butterflyWing 0.36s ease-in-out infinite alternate',
            }}
          >
            <path d="M18 14 C12 4, 2 3, 4 12 C6 17, 13 17, 18 15 Z" fill={b.color1} opacity="0.92" />
            <path d="M18 15 C11 16, 6 22, 10 25 C14 27, 17 21, 18 16 Z" fill={b.color2} opacity="0.9" />
            <path d="M18 14 C24 4, 34 3, 32 12 C30 17, 23 17, 18 15 Z" fill={b.color1} opacity="0.92" />
            <path d="M18 15 C25 16, 30 22, 26 25 C22 27, 19 21, 18 16 Z" fill={b.color2} opacity="0.9" />
            <rect x="17" y="8" width="2" height="12" rx="1" fill="#3f2718" />
          </svg>
        </div>
      ))}
    </div>
  );
};

/* ───────────── THEME 1: HERITAGE ATELIER STUDY COURTYARD BALCONY (REAL SCENES + ARCHITECTURAL PILASTERS) ───────────── */
export const ShelfTheme1BayWall: React.FC<{ night: boolean; variantIdx?: number }> = ({
  night,
  variantIdx = 0,
}) => {
  const v = ((variantIdx % 5) + 5) % 5;
  const trimTones = [
    night ? '#2a1d17' : '#6c4d35',
    night ? '#1c2128' : '#3d4550',
    night ? '#302923' : '#d5c7b2',
    night ? '#232730' : '#8e8474',
    night ? '#1c1712' : '#57432f',
  ][v]!;

  return (
    <div style={{ position: 'absolute', inset: 0, bottom: 130, zIndex: -16, pointerEvents: 'none', overflow: 'hidden' }}>
      <ScenicPhotoVista
        themeId="1"
        night={night}
        variantIdx={v}
        dayFilter="brightness(1.04) saturate(1.08)"
        nightFilter="brightness(0.96) contrast(1.06)"
      />

      {/* Sun (Day) & Moon + Stars (Night) Clearly Visible in Upper Balcony Sky */}
      <CelestialSkyOrb night={night} variantIdx={v} topOffset={16} />

      {/* Subtle Atelier Balcony Pilasters Flanking Far Left & Right Edges */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          width: 24,
          background: `linear-gradient(90deg, ${trimTones}, transparent)`,
          opacity: 0.72,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          width: 24,
          background: `linear-gradient(270deg, ${trimTones}, transparent)`,
          opacity: 0.72,
        }}
      />

      {/* Heritage Balcony Stone Balustrade along Lower Terrace Edge */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 68,
          borderTop: `6px solid ${night ? 'rgba(110,98,86,0.75)' : 'rgba(232,218,195,0.88)'}`,
          backgroundImage: night
            ? 'repeating-linear-gradient(90deg, rgba(44,36,30,0.82) 0 12px, transparent 12px 48px)'
            : 'repeating-linear-gradient(90deg, rgba(214,198,173,0.82) 0 12px, transparent 12px 48px)',
          boxShadow: 'inset 0 6px 14px rgba(0,0,0,0.22)',
        }}
      />
    </div>
  );
};

/* ───────────── THEME 2: FOREST SANCTUARY (REAL FOREST DAY & NIGHT PHOTO + CANOPY) ───────────── */
export const ForestSanctuaryBackdrop: React.FC<{ night: boolean; variantIdx?: number }> = ({
  night,
  variantIdx = 0,
}) => {
  const v = ((variantIdx % 5) + 5) % 5;

  return (
    <div style={{ position: 'absolute', inset: 0, bottom: 130, zIndex: -16, pointerEvents: 'none', overflow: 'hidden' }}>
      <ScenicPhotoVista
        themeId="2"
        night={night}
        variantIdx={v}
        dayFilter="brightness(1.03) saturate(1.1)"
        nightFilter="brightness(0.95) contrast(1.06)"
        dayScrim="linear-gradient(180deg, rgba(210,235,214,0.12) 0%, rgba(16,32,20,0.05) 58%, rgba(8,20,12,0.28) 100%)"
        nightScrim="linear-gradient(180deg, rgba(3,10,6,0.22) 0%, rgba(3,10,6,0.12) 55%, rgba(2,6,4,0.42) 100%)"
      />

      {/* Woodland Clearing Sun (Day) & Starlit Forest Moon (Night) */}
      <CelestialSkyOrb night={night} variantIdx={v} topOffset={16} />

      {/* Gentle Upper Corner Foliage Silhouettes Framing Open Center Sky */}
      <svg
        viewBox="0 0 1200 580"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: night ? 0.55 : 0.42 }}
      >
        <path d="M0 0 H220 C165 44 108 62 55 96 C26 116 12 146 0 165 Z" fill={night ? '#030805' : '#243c26'} />
        <path d="M1200 0 H980 C1035 44 1092 62 1145 96 C1174 116 1188 146 1200 165 Z" fill={night ? '#030805' : '#243c26'} />
      </svg>
    </div>
  );
};

/* ───────────── THEME 3: BEACH BALCONY (REAL SEASCAPE DAY & NIGHT) ───────────── */
export const BeachBalconyBackdrop: React.FC<{ night: boolean; variantIdx?: number }> = ({
  night,
  variantIdx = 0,
}) => {
  const v = ((variantIdx % 5) + 5) % 5;

  return (
    <div style={{ position: 'absolute', inset: 0, bottom: 130, zIndex: -14, pointerEvents: 'none', overflow: 'hidden' }}>
      <ScenicPhotoVista
        themeId="3"
        night={night}
        variantIdx={v}
        dayFilter="brightness(1.02) saturate(1.1)"
        nightFilter="brightness(0.98) contrast(1.06)"
        dayScrim="linear-gradient(180deg, rgba(186,230,253,0.08) 0%, transparent 55%, rgba(12,56,74,0.22) 100%)"
        nightScrim="linear-gradient(180deg, rgba(5,14,32,0.18) 0%, transparent 55%, rgba(4,12,26,0.36) 100%)"
      />

      {/* Coastal Sun (Day) or Ocean Moon & Stars (Night) */}
      <CelestialSkyOrb night={night} variantIdx={v} topOffset={16} />

      {/* Balcony Limestone Balustrade Rail */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 82,
          pointerEvents: 'none',
          borderTop: `8px solid ${night ? '#3c4654' : '#ede7dc'}`,
          backgroundImage: night
            ? 'repeating-linear-gradient(90deg, rgba(39,48,60,0.88) 0 10px, transparent 10px 44px)'
            : 'repeating-linear-gradient(90deg, rgba(223,215,202,0.88) 0 10px, transparent 10px 44px)',
          boxShadow: 'inset 0 6px 14px rgba(0,0,0,0.22)',
        }}
      />
    </div>
  );
};

/* ───────────── THEME 4: HEAVY RAIN + COVERED VERANDA BALCONY (REAL MONSOON DAY & NIGHT PHOTO) ───────────── */
export const MonsoonRainBackdrop: React.FC<{ night: boolean; variantIdx?: number }> = ({
  night,
  variantIdx = 0,
}) => {
  const v = ((variantIdx % 5) + 5) % 5;

  const rainStreaks = Array.from({ length: 56 }, (_, idx) => ({
    left: `${(idx * 2 + (idx % 3)) % 99}%`,
    top: `${-15 - (idx % 5) * 14}%`,
    height: 36 + (idx % 4) * 16,
    width: idx % 5 === 0 ? 2 : 1.3,
    dur: 0.72 + (idx % 6) * 0.14,
    delay: ((idx * 0.11) % 1.3).toFixed(2),
    opacity: idx % 3 === 0 ? 0.74 : 0.48,
  }));

  const eavesDrips = [5, 11, 18, 26, 35, 48, 62, 71, 79, 86, 93, 97];
  const puddles = [8, 17, 24, 77, 85, 92];

  return (
    <div style={{ position: 'absolute', inset: 0, bottom: 130, zIndex: -15, pointerEvents: 'none', overflow: 'hidden' }}>
      {/* Real Monsoon Mountain & Lake Rain Photography (Matched Day & Night) */}
      <ScenicPhotoVista
        themeId="4"
        night={night}
        variantIdx={v}
        dayFilter="brightness(1.02) contrast(1.04)"
        nightFilter="brightness(0.95) contrast(1.08)"
        dayScrim="linear-gradient(180deg, rgba(148,163,184,0.16) 0%, rgba(100,116,139,0.06) 55%, rgba(30,41,59,0.34) 100%)"
        nightScrim="linear-gradient(180deg, rgba(7,12,21,0.24) 0%, rgba(10,18,30,0.14) 55%, rgba(6,10,18,0.44) 100%)"
      />

      {/* Cloud-Veiled Golden Sun in Monsoon Day / Silver Storm Moon in Monsoon Night */}
      <CelestialSkyOrb night={night} variantIdx={v} cloudVeiled topOffset={26} />

      {/* Heavy Multi-Layer Diagonal Monsoon Rainfall */}
      {rainStreaks.map((r, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: r.left,
            top: r.top,
            width: r.width,
            height: r.height,
            borderRadius: 2,
            background: night
              ? `linear-gradient(180deg, transparent, rgba(191,219,254,${r.opacity}))`
              : `linear-gradient(180deg, transparent, rgba(226,238,248,${r.opacity * 0.85}))`,
            transform: 'rotate(13deg)',
            animation: `monsoonRainFall ${r.dur}s linear infinite`,
            animationDelay: `${r.delay}s`,
          }}
        />
      ))}

      {/* Overhanging Sloped Covered Balcony Veranda Eaves + Rainwater Drips */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 20,
          background: night
            ? 'linear-gradient(180deg, #10151d 0%, #1d2633 78%, #0c1016 100%)'
            : 'linear-gradient(180deg, #3c4552 0%, #566272 78%, #2e3642 100%)',
          borderBottom: `3px solid ${night ? '#090c12' : '#262d38'}`,
          boxShadow: '0 8px 22px rgba(0,0,0,0.42)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 'auto 0 2px 0',
            height: 5,
            backgroundImage: 'repeating-linear-gradient(90deg, rgba(0,0,0,0.35) 0 8px, transparent 8px 64px)',
          }}
        />
      </div>

      {/* Animated Drips Falling Straight Off Veranda Eaves */}
      {eavesDrips.map((x, idx) => (
        <div
          key={idx}
          style={{
            position: 'absolute',
            top: 18,
            left: `${x}%`,
            width: 2,
            height: 12,
            borderRadius: 99,
            background: night ? 'rgba(186,230,253,0.75)' : 'rgba(241,245,249,0.88)',
            animation: `rainEavesDrip ${0.95 + (idx % 4) * 0.25}s ease-in infinite`,
            animationDelay: `${(idx * 0.17) % 1.1}s`,
          }}
        />
      ))}

      {/* Left & Right Veranda Masonry Columns */}
      <div
        style={{
          position: 'absolute',
          top: 24,
          bottom: 0,
          left: 0,
          width: 30,
          background: night ? 'linear-gradient(90deg, #1b222c, #12171e)' : 'linear-gradient(90deg, #747c86, #5e6670)',
          boxShadow: '6px 0 18px rgba(0,0,0,0.35)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 24,
          bottom: 0,
          right: 0,
          width: 30,
          background: night ? 'linear-gradient(270deg, #1b222c, #12171e)' : 'linear-gradient(270deg, #747c86, #5e6670)',
          boxShadow: '-6px 0 18px rgba(0,0,0,0.35)',
        }}
      />

      {/* Warm Hanging Brass Veranda Lantern */}
      <div style={{ position: 'absolute', top: 28, left: '84%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: 2, height: 22, background: '#334155' }} />
        <div
          style={{
            width: 22,
            height: 28,
            borderRadius: 6,
            border: '2px solid #92400e',
            background: night
              ? 'radial-gradient(circle, #fef3c7 20%, #f59e0b 80%)'
              : 'radial-gradient(circle, #fffbeb 25%, #fde68a 80%)',
            boxShadow: night
              ? '0 0 28px 10px rgba(245,158,11,0.45)'
              : '0 0 16px 4px rgba(251,191,36,0.35)',
          }}
        />
      </div>

      {/* Wrought-Iron & Stone Balcony Balustrade Behind the Sheltered Almirah */}
      <div
        style={{
          position: 'absolute',
          left: 30,
          right: 30,
          bottom: 0,
          height: 82,
          borderTop: `6px solid ${night ? '#2c3542' : '#4a5461'}`,
          backgroundImage: night
            ? 'repeating-linear-gradient(90deg, rgba(30,39,51,0.88) 0 6px, transparent 6px 32px)'
            : 'repeating-linear-gradient(90deg, rgba(60,70,82,0.85) 0 6px, transparent 6px 32px)',
          boxShadow: 'inset 0 8px 18px rgba(0,0,0,0.32)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: 16,
            background: night
              ? 'linear-gradient(180deg, #27313d, #182028)'
              : 'linear-gradient(180deg, #758290, #5b6775)',
          }}
        >
          {puddles.map((x, idx) => (
            <div
              key={idx}
              style={{
                position: 'absolute',
                left: `${x}%`,
                top: 4,
                width: 20,
                height: 7,
                borderRadius: '50%',
                border: `1.5px solid ${night ? 'rgba(186,230,253,0.65)' : 'rgba(241,245,249,0.75)'}`,
                animation: `puddleRipple ${1.4 + (idx % 3) * 0.35}s ease-out infinite`,
                animationDelay: `${idx * 0.25}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

/* ───────────── THEME 5: PISTACHIO CONSERVATORY (DAY) & OBSIDIAN REFLECTION TERRACE (NIGHT) ───────────── */
export const PistachioObsidianBackdrop: React.FC<{ night: boolean; variantIdx?: number }> = ({
  night,
  variantIdx = 0,
}) => {
  const v = ((variantIdx % 5) + 5) % 5;

  return (
    <div style={{ position: 'absolute', inset: 0, bottom: 130, zIndex: -15, pointerEvents: 'none', overflow: 'hidden' }}>
      <ScenicPhotoVista
        themeId="5"
        night={night}
        variantIdx={v}
        dayFilter="brightness(1.03) saturate(1.05)"
        nightFilter="brightness(1.0) contrast(1.08)"
        dayScrim="linear-gradient(180deg, rgba(247,250,238,0.14) 0%, rgba(235,244,218,0.06) 55%, rgba(36,52,24,0.22) 100%)"
        nightScrim="linear-gradient(180deg, rgba(2,3,5,0.16) 0%, rgba(2,3,5,0.08) 55%, rgba(0,0,0,0.42) 100%)"
      />

      {/* Pistachio Morning Sun (Day) & Obsidian Starlit Moon (Night) */}
      <CelestialSkyOrb night={night} variantIdx={v} topOffset={16} />

      {/* Subtle Conservatory / Obsidian Minimalist Arch Framing */}
      <svg viewBox="0 0 1200 580" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.35 }}>
        <g fill="none" stroke={night ? '#474c54' : '#b4c99b'} strokeWidth={v % 2 === 0 ? 3 : 2.2}>
          <path d="M40 580 V180 Q135 65 230 180 V580" />
          <path d="M970 580 V180 Q1065 65 1160 180 V580" />
        </g>
      </svg>
    </div>
  );
};

/* ───────────── 5 COMPLETELY DIFFERENT THEME CARPETS ───────────── */
export const ShelfThemeCarpet: React.FC<{ night: boolean; lit: boolean; themeId: ShelfThemeId }> = ({
  night,
  lit,
  themeId,
}) => {
  const dimStyle: React.CSSProperties = {
    filter: night && !lit ? 'brightness(0.45) saturate(0.75)' : 'none',
    transition: 'filter 0.6s, box-shadow 0.6s',
  };

  const renderSvg = () => {
    switch (themeId) {
      case '2':
        return (
          <svg viewBox="0 0 790 92" preserveAspectRatio="none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
            <ellipse cx="395" cy="48" rx="345" ry="40" fill="#9fb294" stroke="#47664c" strokeWidth="4" />
            <ellipse cx="395" cy="48" rx="285" ry="31" fill="#c7d5bd" stroke="#628064" strokeWidth="2.5" strokeDasharray="10 5" />
            <ellipse cx="395" cy="48" rx="210" ry="22" fill="#dde7d4" stroke="#47664c" strokeWidth="2" />
            <ellipse cx="395" cy="48" rx="110" ry="12" fill="#eef3e7" />
          </svg>
        );
      case '3':
        return (
          <svg viewBox="0 0 790 92" preserveAspectRatio="none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
            <rect x="18" y="8" width="754" height="74" rx="18" fill="#efe6d3" stroke="#2c7a94" strokeWidth="4" />
            <path d="M24 30 Q90 22 156 30 T288 30 T420 30 T552 30 T684 30 T766 30" fill="none" stroke="#4ca0b8" strokeWidth="2.5" />
            <path d="M24 62 Q90 54 156 62 T288 62 T420 62 T552 62 T684 62 T766 62" fill="none" stroke="#c97d5d" strokeWidth="2.5" />
            <rect x="34" y="16" width="722" height="58" rx="12" fill="none" stroke="#b59d7a" strokeWidth="1.5" strokeDasharray="6 6" />
          </svg>
        );
      case '4':
        return (
          <svg viewBox="0 0 790 92" preserveAspectRatio="none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
            <g stroke="#cbd5e1" strokeWidth="2">
              {[18, 28, 38, 48, 58, 68, 76].map((y) => (
                <g key={y}>
                  <line x1="2" y1={y} x2="22" y2={y} />
                  <line x1="768" y1={y} x2="788" y2={y} />
                </g>
              ))}
            </g>
            <rect x="22" y="10" width="746" height="72" rx="4" fill="#4f5f70" stroke="#9eb3c9" strokeWidth="2.5" />
            <rect x="46" y="10" width="18" height="72" fill="#b47438" opacity="0.72" />
            <rect x="726" y="10" width="18" height="72" fill="#b47438" opacity="0.72" />
            <rect x="76" y="20" width="638" height="52" fill="#63758a" stroke="#d9e3ed" strokeWidth="1" opacity="0.65" />
          </svg>
        );
      case '5':
        return (
          <svg viewBox="0 0 790 92" preserveAspectRatio="none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
            <rect
              x="16"
              y="8"
              width="758"
              height="76"
              rx="10"
              fill={night ? '#16171a' : '#cfe6ba'}
              stroke={night ? '#a8d98b' : '#4a8235'}
              strokeWidth="3"
            />
            <rect
              x="40"
              y="16"
              width="710"
              height="60"
              rx="6"
              fill={night ? '#0c0d0f' : '#e5f3d7'}
              stroke={night ? '#5a6358' : '#73ab59'}
              strokeWidth="1.5"
            />
            <polygon
              points="395,22 475,46 395,70 315,46"
              fill={night ? '#262926' : '#a8d98b'}
              stroke={night ? '#a8d98b' : '#3a6b28'}
              strokeWidth="2"
            />
            <polygon points="395,32 435,46 395,60 355,46" fill={night ? '#a8d98b' : '#4a8235'} opacity="0.82" />
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 790 86" preserveAspectRatio="none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
            <defs>
              <radialGradient id="fur-radial-t1" cx="50%" cy="45%" r="55%">
                <stop offset="0%" stopColor="#ede6d8" />
                <stop offset="45%" stopColor="#ded4c0" />
                <stop offset="80%" stopColor="#cfc2ab" />
                <stop offset="100%" stopColor="#baa990" />
              </radialGradient>
            </defs>
            <rect x="8" y="10" width="774" height="72" rx="36" fill="rgba(25,18,12,0.45)" />
            <rect x="10" y="6" width="770" height="74" rx="37" fill="url(#fur-radial-t1)" stroke="#c5b79e" strokeWidth="2.5" strokeDasharray="4 2.5" />
            <rect x="14" y="9" width="762" height="68" rx="34" fill="url(#fur-radial-t1)" />
            <ellipse cx="395" cy="40" rx="340" ry="26" fill="#fcf9f2" opacity="0.38" />
          </svg>
        );
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        bottom: 10,
        transform: 'translateX(-50%) perspective(750px) rotateX(28deg)',
        transformOrigin: 'bottom center',
        width: 'min(790px, 88%)',
        height: 86,
        zIndex: 5,
        pointerEvents: 'none',
        ...dimStyle,
      }}
    >
      {renderSvg()}
    </div>
  );
};

/* ───────────── 5 DISTINCT ARCHITECTURAL LAMPS (PER THEME) ───────────── */
export const ShelfThemeLamp: React.FC<{ night: boolean; themeId: ShelfThemeId }> = ({
  night,
  themeId,
}) => {
  // Subtle night tungsten / lantern wash tuned per theme
  const nightWash = (() => {
    switch (themeId) {
      case '2':
        return 'radial-gradient(ellipse 58% 62% at 50% 24%, rgba(251,191,36,0.34) 0%, rgba(217,119,6,0.14) 48%, transparent 78%)';
      case '3':
        return 'radial-gradient(ellipse 58% 62% at 50% 22%, rgba(254,215,170,0.32) 0%, rgba(245,158,11,0.13) 48%, transparent 78%)';
      case '4':
        return 'radial-gradient(ellipse 60% 62% at 50% 20%, rgba(253,186,116,0.36) 0%, rgba(234,88,12,0.14) 48%, transparent 78%)';
      case '5':
        return 'radial-gradient(ellipse 56% 58% at 50% 20%, rgba(236,253,225,0.28) 0%, rgba(168,217,139,0.12) 48%, transparent 78%)';
      default:
        return 'radial-gradient(ellipse 55% 60% at 50% 18%, rgba(254,240,138,0.28) 0%, rgba(251,191,36,0.12) 45%, transparent 78%)';
    }
  })();

  const renderLampBody = () => {
    switch (themeId) {
      /* THEME 2: CEDAR TRIPOD WOODLAND LANTERN LAMP */
      case '2':
        return (
          <svg
            viewBox="0 0 120 278"
            width="106"
            height="252"
            style={{
              zIndex: 2,
              overflow: 'visible',
              filter: night
                ? 'drop-shadow(0 0 18px rgba(245,158,11,0.35)) drop-shadow(4px 10px 14px rgba(0,0,0,0.5))'
                : 'drop-shadow(6px 10px 14px rgba(0,0,0,0.38))',
            }}
          >
            <defs>
              <linearGradient id="t2WoodLeg" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3b2313" />
                <stop offset="45%" stopColor="#7a4c2a" />
                <stop offset="100%" stopColor="#26160a" />
              </linearGradient>
              <linearGradient id="t2Copper" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#5c3317" />
                <stop offset="40%" stopColor="#d99b66" />
                <stop offset="100%" stopColor="#42210d" />
              </linearGradient>
              <radialGradient id="t2LanternCore" cx="50%" cy="46%" r="55%">
                <stop offset="0%" stopColor={night ? '#ffffff' : '#fef9eb'} />
                <stop offset="48%" stopColor={night ? '#fde68a' : '#f5e7c6'} />
                <stop offset="100%" stopColor={night ? '#d97706' : '#c9b38c'} />
              </radialGradient>
            </defs>

            {/* Floor contact shadow */}
            <ellipse cx="60" cy="272" rx="44" ry="7" fill="rgba(0,0,0,0.48)" />

            {/* Three splayed hand-hewn cedar tripod legs */}
            <path d="M58 66 L22 270 L29 270 L62 72 Z" fill="url(#t2WoodLeg)" />
            <path d="M62 66 L98 270 L91 270 L58 72 Z" fill="url(#t2WoodLeg)" />
            <path d="M57 68 L57 265 L63 265 L63 68 Z" fill="#2c190c" opacity="0.92" />

            {/* Mid-tripod brass stabilizing collar */}
            <ellipse cx="60" cy="176" rx="22" ry="4" fill="none" stroke="url(#t2Copper)" strokeWidth="3.5" />
            <circle cx="40" cy="176" r="2.6" fill="#d4af37" />
            <circle cx="80" cy="176" r="2.6" fill="#d4af37" />

            {/* Top Apex Brass Hub & Hanging Hook */}
            <rect x="48" y="54" width="24" height="14" rx="4" fill="url(#t2Copper)" />
            <path d="M60 54 C60 22, 92 22, 86 42" fill="none" stroke="url(#t2Copper)" strokeWidth="4.5" strokeLinecap="round" />

            {/* Suspended Copper & Warm Frosted Glass Forest Lantern */}
            <g transform="translate(64, 42)">
              {/* Ring & Chimney Cap */}
              <circle cx="22" cy="4" r="4" fill="none" stroke="#b47438" strokeWidth="2" />
              <path d="M10 18 L22 7 L34 18 Z" fill="url(#t2Copper)" />
              <rect x="7" y="18" width="30" height="4" rx="2" fill="#42210d" />
              {/* Frosted Glass Chamber */}
              <path d="M10 22 L34 22 L31 56 L13 56 Z" fill="url(#t2LanternCore)" stroke="#5c3317" strokeWidth="1.5" />
              {/* Inner glowing filament */}
              <ellipse cx="22" cy="40" rx="5" ry="9" fill={night ? '#fffbeb' : '#f5d076'} opacity={night ? 0.95 : 0.45} />
              {/* Protective Vertical Copper Struts */}
              <line x1="16" y1="22" x2="17" y2="56" stroke="#5c3317" strokeWidth="1.5" />
              <line x1="28" y1="22" x2="27" y2="56" stroke="#5c3317" strokeWidth="1.5" />
              {/* Lantern Bottom Pan & Finial */}
              <rect x="11" y="56" width="22" height="4" rx="1.5" fill="url(#t2Copper)" />
              <circle cx="22" cy="63" r="2.5" fill="#92400e" />
            </g>
          </svg>
        );

      /* THEME 3: COASTAL DRIFTWOOD ARC & WOVEN HONEY-RATTAN BELL LAMP */
      case '3':
        return (
          <svg
            viewBox="0 0 120 278"
            width="106"
            height="252"
            style={{
              zIndex: 2,
              overflow: 'visible',
              filter: night
                ? 'drop-shadow(0 0 18px rgba(253,186,116,0.38)) drop-shadow(4px 10px 14px rgba(0,0,0,0.45))'
                : 'drop-shadow(6px 10px 14px rgba(0,0,0,0.32))',
            }}
          >
            <defs>
              <linearGradient id="t3Driftwood" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#8e7f6d" />
                <stop offset="45%" stopColor="#d6cab9" />
                <stop offset="100%" stopColor="#6b5e4e" />
              </linearGradient>
              <linearGradient id="t3RattanShade" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={night ? '#fde68a' : '#e6c590'} />
                <stop offset="55%" stopColor={night ? '#f59e0b' : '#c69858'} />
                <stop offset="100%" stopColor={night ? '#b45309' : '#8f6330'} />
              </linearGradient>
              <linearGradient id="t3StoneBase" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#b9b0a1" />
                <stop offset="50%" stopColor="#f2ece1" />
                <stop offset="100%" stopColor="#9c9384" />
              </linearGradient>
            </defs>

            {/* Floor contact shadow */}
            <ellipse cx="46" cy="271" rx="34" ry="7" fill="rgba(0,0,0,0.42)" />

            {/* Sand-Washed Travertine Stone Base */}
            <ellipse cx="46" cy="264" rx="28" ry="8" fill="url(#t3StoneBase)" stroke="#a89e8e" strokeWidth="1" />
            <rect x="42" y="250" width="8" height="14" rx="2" fill="#c79e65" />

            {/* Organic Sweeping Bleached Driftwood Arc Pole */}
            <path
              d="M46 254 C44 175, 42 105, 50 56 C55 24, 78 22, 82 42"
              fill="none"
              stroke="url(#t3Driftwood)"
              strokeWidth="7.5"
              strokeLinecap="round"
            />

            {/* Hanging Rattan Cord */}
            <line x1="82" y1="42" x2="82" y2="54" stroke="#785838" strokeWidth="2.2" />

            {/* Sculpted Woven Honey-Rattan Bell Shade */}
            <g transform="translate(46, 52)">
              {/* Top wooden cap */}
              <ellipse cx="36" cy="5" rx="11" ry="4" fill="#7c562c" />
              {/* Bell Silhouette */}
              <path
                d="M25 6 C14 14, 4 38, 2 62 Q36 72 70 62 C68 38, 58 14, 47 6 Z"
                fill="url(#t3RattanShade)"
                stroke="#7c562c"
                strokeWidth="1.5"
              />
              {/* Dappled Wicker Lattice Cross-Weave */}
              <g stroke="rgba(92,56,22,0.45)" strokeWidth="1.15" fill="none">
                <path d="M21 15 Q36 22 51 15" />
                <path d="M13 30 Q36 40 59 30" />
                <path d="M7 46 Q36 58 65 46" />
                <path d="M28 8 C22 28, 16 48, 13 65" />
                <path d="M36 8 V67" />
                <path d="M44 8 C50 28, 56 48, 59 65" />
              </g>
              {/* Warm Glowing Bulbs Inside Rattan */}
              <ellipse cx="36" cy="63" rx="31" ry="5" fill={night ? '#fff7ed' : '#574229'} opacity={night ? 0.92 : 0.45} />
              {night && <circle cx="36" cy="48" r="9" fill="#fef3c7" opacity="0.72" />}
            </g>
          </svg>
        );

      /* THEME 4: VINTAGE WROUGHT-IRON VERANDA COACH POST LAMP */
      case '4':
        return (
          <svg
            viewBox="0 0 120 278"
            width="106"
            height="252"
            style={{
              zIndex: 2,
              overflow: 'visible',
              filter: night
                ? 'drop-shadow(0 0 18px rgba(251,146,60,0.42)) drop-shadow(4px 10px 14px rgba(0,0,0,0.52))'
                : 'drop-shadow(6px 10px 14px rgba(0,0,0,0.38))',
            }}
          >
            <defs>
              <linearGradient id="t4Iron" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#121821" />
                <stop offset="45%" stopColor="#3b4757" />
                <stop offset="100%" stopColor="#0d1118" />
              </linearGradient>
              <radialGradient id="t4GlassFlame" cx="50%" cy="54%" r="54%">
                <stop offset="0%" stopColor={night ? '#ffffff' : '#eef4fa'} />
                <stop offset="45%" stopColor={night ? '#fde68a' : '#cbd9e8'} />
                <stop offset="100%" stopColor={night ? '#ea580c' : '#8ea1b5'} />
              </radialGradient>
            </defs>

            {/* Wet veranda shadow */}
            <ellipse cx="48" cy="272" rx="30" ry="6.5" fill="rgba(0,0,0,0.48)" />

            {/* Cast-Iron Fluted Pedestal Base & Post */}
            <ellipse cx="48" cy="266" rx="23" ry="6" fill="url(#t4Iron)" />
            <path d="M36 264 L40 236 L56 236 L60 264 Z" fill="url(#t4Iron)" />
            <rect x="44" y="64" width="8" height="174" fill="url(#t4Iron)" />
            <ellipse cx="48" cy="148" rx="8" ry="3.5" fill="#4b5a6e" />
            <ellipse cx="48" cy="236" rx="10" ry="4" fill="#4b5a6e" />

            {/* Decorative Victorian Scroll Bracket Arm */}
            <path d="M48 68 C48 34, 84 30, 84 52" fill="none" stroke="url(#t4Iron)" strokeWidth="5" strokeLinecap="round" />
            <path d="M48 92 C64 90, 68 74, 58 66" fill="none" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />

            {/* Tapered 4-Pane Rain-Shielded Copper-Cap Coach Lantern */}
            <g transform="translate(61, 52)">
              {/* Finial & Flared Weather Shield Roof */}
              <circle cx="23" cy="3" r="3" fill="#b45309" />
              <path d="M4 18 L23 5 L42 18 Z" fill="#1e293b" stroke="#92400e" strokeWidth="1.5" />
              {/* Tapered Seeded Rain-Glass Lantern Box */}
              <path d="M9 18 L37 18 L33 54 L13 54 Z" fill="url(#t4GlassFlame)" stroke="#1e293b" strokeWidth="2" />
              {/* Mullion bars */}
              <line x1="23" y1="18" x2="23" y2="54" stroke="#1e293b" strokeWidth="1.8" />
              <line x1="11" y1="36" x2="35" y2="36" stroke="#1e293b" strokeWidth="1.4" />
              {/* Cozy Warm Candle / Filament Bulb */}
              <ellipse cx="23" cy="40" rx="5" ry="8" fill={night ? '#fff7ed' : '#fef3c7'} opacity={night ? 0.96 : 0.6} />
              {/* Tapered Bottom Cradle */}
              <path d="M13 54 L33 54 L26 62 L20 62 Z" fill="url(#t4Iron)" />
            </g>
          </svg>
        );

      /* THEME 5: ARCHITECTURAL BAUHAUS CANTILEVERED ARC GLOBE LAMP */
      case '5':
        return (
          <svg
            viewBox="0 0 120 278"
            width="106"
            height="252"
            style={{
              zIndex: 2,
              overflow: 'visible',
              filter: night
                ? 'drop-shadow(0 0 18px rgba(168,217,139,0.34)) drop-shadow(4px 10px 14px rgba(0,0,0,0.52))'
                : 'drop-shadow(6px 10px 14px rgba(0,0,0,0.28))',
            }}
          >
            <defs>
              <linearGradient id="t5MarbleDrum" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={night ? '#121316' : '#c7d6b4'} />
                <stop offset="45%" stopColor={night ? '#2c3038' : '#f4faee'} />
                <stop offset="100%" stopColor={night ? '#0a0b0d' : '#a8bc93'} />
              </linearGradient>
              <linearGradient id="t5Stem" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={night ? '#2d322c' : '#577542'} />
                <stop offset="50%" stopColor={night ? '#a8d98b' : '#b7d49e'} />
                <stop offset="100%" stopColor={night ? '#161917' : '#3d592b'} />
              </linearGradient>
              <radialGradient id="t5OpalGlobe" cx="38%" cy="34%" r="65%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="55%" stopColor={night ? '#eef7e8' : '#f6faef'} />
                <stop offset="100%" stopColor={night ? '#a8d98b' : '#cddfb9'} />
              </radialGradient>
            </defs>

            {/* Floor contact shadow */}
            <ellipse cx="44" cy="272" rx="30" ry="6.5" fill="rgba(0,0,0,0.42)" />

            {/* Honed Travertine / Matte Obsidian Marble Cylindrical Base */}
            <path d="M26 232 L62 232 L64 268 Q44 274 24 268 Z" fill="url(#t5MarbleDrum)" />
            <ellipse cx="44" cy="232" rx="18" ry="4" fill={night ? '#3d423e' : '#e6f0d8'} />

            {/* Sweeping Architectural Cantilevered Arc Stem */}
            <path
              d="M44 232 L44 108 C44 42, 84 34, 86 58"
              fill="none"
              stroke="url(#t5Stem)"
              strokeWidth="5.2"
              strokeLinecap="round"
            />

            {/* Minimalist Satin Collar & Frosted Opal-Glass Pearl Globe Shade */}
            <g transform="translate(56, 46)">
              {/* Sculptural Cream-Pistachio / Matte Obsidian Top Canopy Hood */}
              <path
                d="M12 18 C12 2, 48 2, 48 18 Z"
                fill={night ? '#1a1c20' : '#d8e8c4'}
                stroke={night ? '#a8d98b' : '#5d8443'}
                strokeWidth="1.6"
              />
              {/* Luminous Frosted Opal Sphere */}
              <circle
                cx="30"
                cy="30"
                r="17"
                fill="url(#t5OpalGlobe)"
                stroke={night ? 'rgba(232,245,220,0.75)' : 'rgba(128,158,104,0.45)'}
                strokeWidth="1.2"
              />
            </g>
          </svg>
        );

      /* THEME 1: HERITAGE BRITISH TURNED-WALNUT & PLEATED EMPIRE LINEN LAMP */
      default:
        return (
          <>
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
            <svg
              viewBox="0 0 110 74"
              width="96"
              height="65"
              style={{
                zIndex: 2,
                filter: night ? 'drop-shadow(0 0 18px rgba(253,230,138,0.42))' : 'drop-shadow(6px 10px 12px rgba(0,0,0,0.38))',
              }}
            >
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
              <path d="M24 6 Q55 2 86 6 L104 64 Q55 72 6 64 Z" fill="url(#britishShadeGrad)" stroke={night ? '#f59e0b' : '#9c8c76'} strokeWidth="1.5" />
              {[22, 34, 46, 58, 70, 82, 92].map((x, idx) => (
                <line key={idx} x1={24 + idx * 9.5} y1={6} x2={x} y2={65} stroke="rgba(60,38,16,0.22)" strokeWidth="1" />
              ))}
              <path d="M6 62 Q55 70 104 62" fill="none" stroke="#d4af37" strokeWidth="2.4" />
              <path d="M24 7 Q55 3 86 7" fill="none" stroke="#d4af37" strokeWidth="1.8" />
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
              <line x1="20" y1="0" x2="20" y2="26" stroke="#d4af37" strokeWidth="1" />
              <circle cx="20" cy="28" r="2.2" fill="#d4af37" />
              <line x1="40" y1="0" x2="40" y2="20" stroke="#d4af37" strokeWidth="1" />
              <circle cx="40" cy="22" r="2.2" fill="#d4af37" />
              <rect x="27" y="4" width="6" height="22" rx="2" fill="url(#brassCol)" />
              <ellipse cx="30" cy="28" rx="8" ry="4" fill="url(#brassCol)" />
              <rect x="27" y="30" width="6" height="110" fill="url(#walnutCol)" />
              <ellipse cx="30" cy="142" rx="7" ry="3.5" fill="url(#brassCol)" />
              <rect x="26" y="144" width="8" height="48" fill="url(#walnutCol)" />
              <ellipse cx="30" cy="196" rx="16" ry="5" fill="url(#brassCol)" />
              <ellipse cx="30" cy="203" rx="24" ry="7" fill="url(#walnutCol)" />
              <ellipse cx="30" cy="207" rx="26" ry="7" fill="rgba(0,0,0,0.45)" style={{ mixBlendMode: 'multiply' }} />
            </svg>
          </>
        );
    }
  };

  return (
    <>
      {night && (
        <div
          style={{
            position: 'absolute',
            top: 28,
            width: 240,
            height: 290,
            background: nightWash,
            pointerEvents: 'none',
            filter: 'blur(8px)',
          }}
        />
      )}
      {renderLampBody()}
    </>
  );
};

/* ───────────── 5 DISTINCT REALISTIC BOTANICAL PLANTS (PER THEME) ───────────── */
export const ShelfThemePlant: React.FC<{ night: boolean; themeId: ShelfThemeId }> = ({
  night,
  themeId,
}) => {
  const foliageFilter = night
    ? 'drop-shadow(-6px 10px 14px rgba(0,0,0,0.52)) brightness(0.86)'
    : 'drop-shadow(-6px 10px 14px rgba(0,0,0,0.38))';

  switch (themeId) {
    /* THEME 2: FOREST BOSTON FERN & FENESTRATED MONSTERA IN MOSSY TERRACOTTA POT */
    case '2':
      return (
        <svg viewBox="0 0 176 232" width="148" height="198" style={{ filter: foliageFilter }}>
          <defs>
            <linearGradient id="t2Terracotta" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#824027" />
              <stop offset="32%" stopColor="#d47b56" />
              <stop offset="68%" stopColor="#b55d3b" />
              <stop offset="100%" stopColor="#69311c" />
            </linearGradient>
            <linearGradient id="t2MonsteraDark" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#356e43" />
              <stop offset="60%" stopColor="#1e4929" />
              <stop offset="100%" stopColor="#112b18" />
            </linearGradient>
            <linearGradient id="t2FernBright" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#72ad5f" />
              <stop offset="60%" stopColor="#437d3a" />
              <stop offset="100%" stopColor="#264d21" />
            </linearGradient>
          </defs>

          {/* Soft floor shadow */}
          <ellipse cx="88" cy="222" rx="46" ry="7.5" fill="rgba(0,0,0,0.46)" />

          {/* Back Tall Fenestrated Monstera Split-Leaves */}
          <path d="M88 148 Q74 96 58 64" fill="none" stroke="#2f5c35" strokeWidth="3.8" strokeLinecap="round" />
          <path d="M88 148 Q108 92 124 58" fill="none" stroke="#28502e" strokeWidth="3.6" strokeLinecap="round" />

          {/* Left Monstera Fenestrated Leaf */}
          <path
            d="M58 68 C32 56 18 32 32 16 C44 4 68 12 76 34 L62 36 L78 44 C80 54 74 66 58 68 Z"
            fill="url(#t2MonsteraDark)"
          />
          <path d="M56 64 Q49 42 40 24" fill="none" stroke="rgba(195,235,185,0.34)" strokeWidth="1.2" />

          {/* Right Monstera Fenestrated Leaf */}
          <path
            d="M122 64 C148 54 162 30 148 14 C134 2 110 12 104 34 L118 37 L102 45 C102 56 108 64 122 64 Z"
            fill="url(#t2MonsteraDark)"
          />
          <path d="M122 60 Q130 40 138 22" fill="none" stroke="rgba(195,235,185,0.34)" strokeWidth="1.2" />

          {/* Lush Arching Feathered Boston Fern Fronds */}
          {[
            { cx: 88, cy: 144, tx: 22, ty: 88, qx: 46, qy: 82 },
            { cx: 88, cy: 142, tx: 154, ty: 90, qx: 130, qy: 84 },
            { cx: 88, cy: 140, tx: 88, ty: 38, qx: 84, qy: 78 },
            { cx: 88, cy: 144, tx: 36, ty: 122, qx: 56, qy: 112 },
            { cx: 88, cy: 144, tx: 142, ty: 122, qx: 122, qy: 112 },
          ].map((frond, fIdx) => (
            <g key={fIdx}>
              <path
                d={`M${frond.cx} ${frond.cy} Q${frond.qx} ${frond.qy} ${frond.tx} ${frond.ty}`}
                fill="none"
                stroke="#436e36"
                strokeWidth="2.1"
                strokeLinecap="round"
              />
              {Array.from({ length: 7 }, (_, pIdx) => {
                const t = 0.25 + pIdx * 0.11;
                const px = (1 - t) * (1 - t) * frond.cx + 2 * (1 - t) * t * frond.qx + t * t * frond.tx;
                const py = (1 - t) * (1 - t) * frond.cy + 2 * (1 - t) * t * frond.qy + t * t * frond.ty;
                const scale = 1 - pIdx * 0.08;
                return (
                  <g key={pIdx} transform={`translate(${px}, ${py}) scale(${scale})`}>
                    <ellipse cx="-6" cy="-2" rx="7.5" ry="2.6" transform="rotate(-24)" fill="url(#t2FernBright)" />
                    <ellipse cx="6" cy="-2" rx="7.5" ry="2.6" transform="rotate(24)" fill="url(#t2FernBright)" />
                  </g>
                );
              })}
            </g>
          ))}

          {/* Velvet Forest Moss Mound on Pot Rim */}
          <ellipse cx="88" cy="144" rx="40" ry="8.5" fill="#3a6332" />
          <path d="M50 144 Q64 134 84 140 Q106 132 126 144" fill="#528246" />

          {/* Hand-Thrown Raw Clay Terracotta Rim & Tapered Vessel */}
          <path d="M46 144 L55 210 Q88 220 121 210 L130 144 Q88 153 46 144 Z" fill="url(#t2Terracotta)" />
          <path d="M43 139 Q88 148 133 139 L131 151 Q88 160 45 151 Z" fill="url(#t2Terracotta)" stroke="#70351f" strokeWidth="1" />
          {/* Terracotta Saucer Dish */}
          <path d="M49 208 Q88 219 127 208 L122 217 Q88 226 54 217 Z" fill="#9c4f32" />
        </svg>
      );

    /* THEME 3: COASTAL BIRD-OF-PARADISE & ARECA PALM IN WOVEN SEAGRASS BASKET */
    case '3':
      return (
        <svg viewBox="0 0 176 232" width="148" height="198" style={{ filter: foliageFilter }}>
          <defs>
            <linearGradient id="t3PalmLeaf" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#6eb368" />
              <stop offset="55%" stopColor="#3c8044" />
              <stop offset="100%" stopColor="#204f29" />
            </linearGradient>
            <linearGradient id="t3PaddleLeaf" x1="0" y1="0" x2="0.8" y2="1">
              <stop offset="0%" stopColor="#589e5a" />
              <stop offset="58%" stopColor="#2e6b38" />
              <stop offset="100%" stopColor="#1b4523" />
            </linearGradient>
            <linearGradient id="t3Seagrass" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#9c7e52" />
              <stop offset="35%" stopColor="#dec496" />
              <stop offset="70%" stopColor="#c9aa76" />
              <stop offset="100%" stopColor="#7d613a" />
            </linearGradient>
          </defs>

          {/* Soft floor shadow */}
          <ellipse cx="88" cy="222" rx="44" ry="7" fill="rgba(0,0,0,0.4)" />

          {/* Tall Sweeping Strelitzia Paddle Leaves (Left & Right) */}
          <path d="M86 146 Q68 92 48 48" fill="none" stroke="#397040" strokeWidth="4.2" strokeLinecap="round" />
          <path d="M90 146 Q106 88 128 42" fill="none" stroke="#306137" strokeWidth="4.2" strokeLinecap="round" />
          <path d="M88 146 Q88 76 86 24" fill="none" stroke="#46824d" strokeWidth="4.4" strokeLinecap="round" />

          {/* Center Tall Sunlit Paddle Leaf */}
          <path d="M86 68 C70 50 70 16 86 6 C102 16 102 50 86 68 Z" fill="url(#t3PaddleLeaf)" />
          <path d="M86 64 V14" fill="none" stroke="rgba(220,248,200,0.42)" strokeWidth="1.3" />

          {/* Left Arching Banana/Strelitzia Leaf */}
          <path d="M52 72 C24 58 14 28 32 16 C48 8 66 36 58 66 Z" fill="url(#t3PalmLeaf)" />
          <path d="M52 66 Q40 42 34 22" fill="none" stroke="rgba(225,248,210,0.36)" strokeWidth="1.2" />

          {/* Right Arching Paddle Leaf */}
          <path d="M124 68 C154 54 162 24 144 12 C126 6 110 34 118 62 Z" fill="url(#t3PaddleLeaf)" />
          <path d="M124 62 Q136 38 142 20" fill="none" stroke="rgba(225,248,210,0.34)" strokeWidth="1.2" />

          {/* Graceful Feathered Coastal Areca Palm Fronds */}
          {[
            { qx: 52, qy: 90, tx: 16, ty: 102 },
            { qx: 124, qy: 88, tx: 158, ty: 100 },
          ].map((arc, idx) => (
            <g key={idx}>
              <path d={`M88 144 Q${arc.qx} ${arc.qy} ${arc.tx} ${arc.ty}`} fill="none" stroke="#478246" strokeWidth="2.5" />
              {Array.from({ length: 6 }, (_, i) => {
                const dir = idx === 0 ? -1 : 1;
                const x = 88 + dir * (16 + i * 11);
                const y = 112 - Math.sin((i / 5) * Math.PI) * 18;
                return (
                  <path
                    key={i}
                    d={`M${x} ${y} Q${x + dir * 8} ${y - 16} ${x + dir * 18} ${y - 4}`}
                    fill="none"
                    stroke="#5fa35c"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                  />
                );
              })}
            </g>
          ))}

          {/* Soil Bed */}
          <ellipse cx="88" cy="144" rx="35" ry="7" fill="#3b2c1d" />

          {/* Woven Seagrass Wicker Handles */}
          <path d="M47 148 C34 146 34 134 48 136" fill="none" stroke="#b39260" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M129 148 C142 146 142 134 128 136" fill="none" stroke="#b39260" strokeWidth="3.5" strokeLinecap="round" />

          {/* Hand-Braided Belly Seagrass Basket Planter */}
          <path d="M50 144 C40 176 46 206 58 214 Q88 223 118 214 C130 206 136 176 126 144 Q88 152 50 144 Z" fill="url(#t3Seagrass)" />
          {/* Two-tone Dipped Natural Cream Lower Basket Weave */}
          <path d="M49 184 Q88 194 127 184 C126 200 122 210 118 214 Q88 223 58 214 C54 210 50 200 49 184 Z" fill="rgba(244,236,216,0.52)" />
          {/* Woven Chevron Texture Lines */}
          <g stroke="rgba(104,76,40,0.34)" strokeWidth="1.2" fill="none">
            <path d="M48 158 Q88 168 128 158" />
            <path d="M46 171 Q88 181 130 171" />
            <path d="M49 184 Q88 194 127 184" />
            <path d="M54 198 Q88 207 122 198" />
          </g>
        </svg>
      );

    /* THEME 4: RAIN-KISSED PEACE LILY & CASCADING POTHOS IN SLATE GLAZED URN */
    case '4':
      return (
        <svg viewBox="0 0 176 232" width="148" height="198" style={{ filter: foliageFilter }}>
          <defs>
            <linearGradient id="t4LilyDark" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#2e6b54" />
              <stop offset="55%" stopColor="#184736" />
              <stop offset="100%" stopColor="#0d2b20" />
            </linearGradient>
            <linearGradient id="t4LilyGloss" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#5ea88a" />
              <stop offset="50%" stopColor="#2c6e55" />
              <stop offset="100%" stopColor="#143c2e" />
            </linearGradient>
            <linearGradient id="t4SlateUrn" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#2b3a4a" />
              <stop offset="32%" stopColor="#66809c" />
              <stop offset="68%" stopColor="#465b73" />
              <stop offset="100%" stopColor="#1d2733" />
            </linearGradient>
          </defs>

          {/* Soft floor shadow */}
          <ellipse cx="88" cy="222" rx="42" ry="7" fill="rgba(0,0,0,0.46)" />

          {/* Glossy Lance-Shaped Peace Lily Foliage */}
          <path d="M84 140 C56 122 30 92 26 62 C44 64 72 96 86 138 Z" fill="url(#t4LilyDark)" />
          <path d="M92 140 C120 122 146 92 150 62 C132 64 104 96 90 138 Z" fill="url(#t4LilyDark)" />
          <path d="M88 140 C70 100 66 54 88 26 C110 54 106 100 88 140 Z" fill="url(#t4LilyGloss)" />
          <path d="M84 140 C48 134 22 114 18 92 C40 90 66 110 84 138 Z" fill="url(#t4LilyGloss)" />
          <path d="M92 140 C128 134 154 114 158 92 C136 90 110 110 92 138 Z" fill="url(#t4LilyGloss)" />

          {/* Crisp Midrib Highlights & Wet Rainwater Sheen */}
          <g fill="none" stroke="rgba(218,247,238,0.42)" strokeWidth="1.2">
            <path d="M88 134 V36" />
            <path d="M80 132 Q54 100 32 70" />
            <path d="M96 132 Q122 100 144 70" />
          </g>

          {/* Sculpted White Peace Lily Blooms (Spathe + Golden Spadix) */}
          {[
            { x: 64, y: 48, rot: -16 },
            { x: 112, y: 52, rot: 18 },
            { x: 88, y: 26, rot: 4 },
          ].map((bl, idx) => (
            <g key={idx}>
              <path d={`M88 138 Q${(88 + bl.x) / 2} 96 ${bl.x} ${bl.y + 18}`} fill="none" stroke="#367058" strokeWidth="2.4" />
              <g transform={`translate(${bl.x}, ${bl.y}) rotate(${bl.rot})`}>
                <path d="M0 18 C-14 12 -14 -8 0 -18 C14 -8 14 12 0 18 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
                <ellipse cx="0" cy="-1" rx="2.6" ry="8.5" fill="#fde047" />
              </g>
            </g>
          ))}

          {/* Glistening Monsoon Dewdrops on Leaves */}
          <circle cx="44" cy="96" r="2.1" fill="#e0f2fe" opacity="0.88" />
          <circle cx="132" cy="98" r="2.2" fill="#e0f2fe" opacity="0.85" />
          <circle cx="84" cy="64" r="1.9" fill="#e0f2fe" opacity="0.9" />

          {/* Fluted Glazed Monsoon Slate Ceramic Urn */}
          <path d="M46 140 L52 206 Q88 218 124 206 L130 140 Q88 149 46 140 Z" fill="url(#t4SlateUrn)" />
          <ellipse cx="88" cy="140" rx="42" ry="7.5" fill="#1e293b" stroke="#85a1bd" strokeWidth="2" />
          {/* Vertical Ceramic Fluting Ribs */}
          <g stroke="rgba(203,219,235,0.22)" strokeWidth="1.2">
            {[60, 74, 88, 102, 116].map((x) => (
              <line key={x} x1={x} y1="146" x2={x + (x - 88) * 0.08} y2="210" />
            ))}
          </g>

          {/* Cascading Wet Heart-Leaf Pothos Vines Over Urn Rim */}
          <path d="M54 142 Q42 164 46 186" fill="none" stroke="#296348" strokeWidth="2" />
          <path d="M46 154 C36 156 36 168 46 170 C54 168 54 156 46 154 Z" fill="#46916d" />
          <path d="M45 174 C36 176 37 188 46 189 C53 187 52 175 45 174 Z" fill="#357a59" />
          <path d="M122 142 Q132 162 128 180" fill="none" stroke="#296348" strokeWidth="2" />
          <path d="M128 158 C138 160 138 172 128 174 C120 172 120 160 128 158 Z" fill="#46916d" />
        </svg>
      );

    /* THEME 5: ARCHITECTURAL VARIEGATED SNAKE PLANT IN PEDESTAL PLANTER */
    case '5':
      return (
        <svg viewBox="0 0 176 232" width="148" height="198" style={{ filter: foliageFilter }}>
          <defs>
            <linearGradient id="t5BladeDark" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#7bb05b" />
              <stop offset="16%" stopColor="#1f4a2a" />
              <stop offset="84%" stopColor="#173820" />
              <stop offset="100%" stopColor="#8ec46c" />
            </linearGradient>
            <linearGradient id="t5BladeBright" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#c7e69c" />
              <stop offset="16%" stopColor="#357041" />
              <stop offset="84%" stopColor="#265430" />
              <stop offset="100%" stopColor="#d4f0aa" />
            </linearGradient>
            <linearGradient id="t5Pot" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={night ? '#121316' : '#c0d1a8'} />
              <stop offset="35%" stopColor={night ? '#2c2f36' : '#f4faeb'} />
              <stop offset="70%" stopColor={night ? '#1c1e24' : '#d8e6c3'} />
              <stop offset="100%" stopColor={night ? '#090a0c' : '#9eb384'} />
            </linearGradient>
          </defs>

          {/* Soft floor shadow */}
          <ellipse cx="88" cy="222" rx="40" ry="7" fill="rgba(0,0,0,0.44)" />

          {/* Back Shaded Upright Sansevieria Sword Leaves */}
          <path d="M62 146 C54 100 50 56 62 24 C74 56 76 100 76 146 Z" fill="url(#t5BladeDark)" />
          <path d="M100 146 C100 100 104 54 116 28 C126 56 122 102 114 146 Z" fill="url(#t5BladeDark)" />

          {/* Center Tall Sunlit Variegated Sword Leaves with Pistachio-Cream Gold Edges */}
          <path d="M78 148 C74 96 76 42 88 8 C100 42 102 96 98 148 Z" fill="url(#t5BladeBright)" />
          <path d="M48 146 C38 108 32 76 42 48 C54 74 62 108 66 146 Z" fill="url(#t5BladeBright)" />
          <path d="M110 146 C114 110 124 76 134 52 C142 78 134 112 126 146 Z" fill="url(#t5BladeBright)" />

          {/* Natural Sansevieria Horizontal Chevron Mottling Bands */}
          <g stroke="rgba(168,217,139,0.28)" strokeWidth="3" strokeLinecap="round" fill="none">
            <path d="M81 48 Q88 43 95 48" />
            <path d="M79 68 Q88 62 97 68" />
            <path d="M79 88 Q88 82 97 88" />
            <path d="M79 108 Q88 102 97 108" />
            <path d="M40 82 Q46 78 52 84" />
            <path d="M44 102 Q50 98 56 104" />
            <path d="M122 86 Q128 82 134 86" />
            <path d="M118 106 Q125 102 131 106" />
          </g>

          {/* River Pebbles Bed at Pot Top */}
          <ellipse cx="88" cy="144" rx="36" ry="7" fill={night ? '#1c1e22' : '#dfe8d0'} />
          <ellipse cx="70" cy="144" rx="6" ry="3" fill={night ? '#3c4048' : '#b8c4a6'} />
          <ellipse cx="90" cy="146" rx="7" ry="3" fill={night ? '#2c3038' : '#f2f7ea'} />
          <ellipse cx="106" cy="144" rx="5.5" ry="2.8" fill={night ? '#4a4f59' : '#c9d6b6'} />

          {/* Architectural Ribbed Pedestal Cylinder Planter */}
          <path d="M48 144 L52 204 Q88 214 124 204 L128 144 Q88 153 48 144 Z" fill="url(#t5Pot)" />
          <ellipse cx="88" cy="144" rx="40" ry="7" fill="none" stroke={night ? '#a8d98b' : '#7ea862'} strokeWidth="2.2" />
          {/* Minimalist Pedestal Ring Stand */}
          <rect x="64" y="204" width="48" height="10" rx="2" fill={night ? '#141518' : '#73915a'} />
          <line x1="50" y1="168" x2="126" y2="168" stroke={night ? 'rgba(168,217,139,0.28)' : 'rgba(84,122,58,0.22)'} strokeWidth="1.5" />
        </svg>
      );

    /* THEME 1: FIDDLE-LEAF FIG IN MATTE CREAM STONEWARE PLANTER */
    default:
      return (
        <svg viewBox="0 0 160 220" width="136" height="188" style={{ filter: foliageFilter }}>
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

          <ellipse cx="80" cy="212" rx="42" ry="7" fill="rgba(0,0,0,0.45)" />
          <path d="M54 176 L46 210 L53 210 L62 178 Z" fill="url(#woodStandGrad)" />
          <path d="M106 176 L114 210 L107 210 L98 178 Z" fill="url(#woodStandGrad)" />
          <rect x="46" y="185" width="68" height="5" rx="2.5" fill="url(#woodStandGrad)" />

          <path d="M78 140 Q74 102 62 72" fill="none" stroke="#5a432e" strokeWidth="3.8" strokeLinecap="round" />
          <path d="M80 140 Q88 100 98 66" fill="none" stroke="#4f3926" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M79 140 Q79 88 80 44" fill="none" stroke="#634b35" strokeWidth="4" strokeLinecap="round" />

          <path d="M62 78 C36 74 18 54 24 34 C30 16 56 26 66 56 C69 66 66 76 62 78 Z" fill="url(#figLeafDark)" />
          <path d="M98 72 C126 68 142 46 134 28 C126 12 100 22 92 50 C90 62 94 70 98 72 Z" fill="url(#figLeafDark)" />

          <path d="M78 52 C56 44 48 18 66 8 C84 -2 100 20 88 46 C85 52 80 54 78 52 Z" fill="url(#figLeafMid)" />
          <path d="M76 92 C44 96 20 82 22 64 C24 46 54 50 74 74 C79 82 80 90 76 92 Z" fill="url(#figLeafMid)" />
          <path d="M84 94 C116 96 140 80 136 62 C132 46 102 52 86 76 C81 84 80 92 84 94 Z" fill="url(#figLeafMid)" />

          <path d="M78 112 C48 118 30 104 34 88 C38 74 64 78 78 100 C81 106 81 111 78 112 Z" fill="url(#figLeafLight)" />
          <path d="M82 114 C110 122 128 108 124 92 C120 76 94 82 82 102 C79 107 79 112 82 114 Z" fill="url(#figLeafLight)" />
          <path d="M79 84 C64 74 62 52 78 44 C94 38 100 62 84 82 C81 85 80 86 79 84 Z" fill="url(#figLeafLight)" />

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

          <ellipse cx="80" cy="136" rx="34" ry="7" fill="#2c1d13" />
          <path d="M44 136 L49 182 Q80 192 111 182 L116 136 Q80 144 44 136 Z" fill="url(#ceramicPotGrad)" />
          <ellipse cx="80" cy="136" rx="36" ry="7.5" fill="none" stroke="#efe6d8" strokeWidth="2.4" />
          <path d="M47 166 Q80 175 113 166" fill="none" stroke="rgba(110,92,70,0.28)" strokeWidth="1.2" />
        </svg>
      );
  }
};

