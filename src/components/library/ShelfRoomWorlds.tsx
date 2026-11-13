import React, { useState } from 'react';
import type { DesignId } from '../../types';

export type ShelfThemeId = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10';

const VALID_IDS = new Set<ShelfThemeId>(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);

export function resolveShelfThemeId(activeDesign?: DesignId | string): ShelfThemeId {
  if (activeDesign && VALID_IDS.has(activeDesign as ShelfThemeId)) {
    return activeDesign as ShelfThemeId;
  }
  return '1';
}

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
    'Dark Chocolate': { frame: '#3a2b26', dark: '#211815', back: '#191616', plank: '#4d3a34', face: '#3a2b26', handle: '#df7860' },
    'Creamy Caramel': { frame: '#bda284', dark: '#877057', back: '#4c4237', plank: '#ccb396', face: '#bda284', handle: '#f4efe8' },
    'Vanilla White': { frame: '#eff1f3', dark: '#ccd2d9', back: '#e2e6eb', plank: '#dce0e6', face: '#f6f8fa', handle: '#a84732' },
    'Mocha Espresso': { frame: '#2c3440', dark: '#171c24', back: '#10141a', plank: '#3a4554', face: '#242b36', handle: '#e28872' },
    Vault: { frame: '#141820', dark: '#090b10', back: '#05070a', plank: '#1d222e', face: '#11151c', handle: '#d4b46a' },
  },
  '6': {
    'Dark Chocolate': { frame: '#2a3730', dark: '#17211c', back: '#0f1814', plank: '#394b41', face: '#2a3730', handle: '#76c7b4' },
    'Creamy Caramel': { frame: '#9e8b69', dark: '#6d5e43', back: '#3d3729', plank: '#b29d79', face: '#9e8b69', handle: '#f4f8f5' },
    'Vanilla White': { frame: '#eef4f1', dark: '#c7d8cf', back: '#e0ebe6', plank: '#d7e5de', face: '#f4faf7', handle: '#1f6f62' },
    'Mocha Espresso': { frame: '#1e3934', dark: '#0f211e', back: '#091513', plank: '#294c45', face: '#18302c', handle: '#cbe4dc' },
    Vault: { frame: '#0f1c19', dark: '#060d0b', back: '#040908', plank: '#172a26', face: '#0d1816', handle: '#48b8a4' },
  },
  '7': {
    'Dark Chocolate': { frame: '#2a2433', dark: '#17131e', back: '#0f0d18', plank: '#393247', face: '#2a2433', handle: '#c9a65b' },
    'Creamy Caramel': { frame: '#968468', dark: '#645742', back: '#37322c', plank: '#a89578', face: '#968468', handle: '#f5efe0' },
    'Vanilla White': { frame: '#edeef4', dark: '#c9ccdb', back: '#dfe1ec', plank: '#d8dae8', face: '#f5f6fa', handle: '#4b4a8a' },
    'Mocha Espresso': { frame: '#202642', dark: '#111526', back: '#0b0e1c', plank: '#2c3457', face: '#191f38', handle: '#d8bc78' },
    Vault: { frame: '#101324', dark: '#060812', back: '#04050c', plank: '#191e36', face: '#0d1020', handle: '#c9a65b' },
  },
  '8': {
    'Dark Chocolate': { frame: '#441a25', dark: '#290e15', back: '#1c090e', plank: '#592331', face: '#441a25', handle: '#e5c687' },
    'Creamy Caramel': { frame: '#b48774', dark: '#7c5749', back: '#45302a', plank: '#c59784', face: '#b48774', handle: '#fbf2f0' },
    'Vanilla White': { frame: '#f4ecef', dark: '#d6c2c8', back: '#eadde1', plank: '#e4d3d8', face: '#faf4f6', handle: '#7d2f45' },
    'Mocha Espresso': { frame: '#2f1a22', dark: '#1b0d13', back: '#12080c', plank: '#422530', face: '#26141b', handle: '#e5bcc6' },
    Vault: { frame: '#180c10', dark: '#0b0507', back: '#060204', plank: '#241219', face: '#14090d', handle: '#d67e96' },
  },
  '9': {
    'Dark Chocolate': { frame: '#3d3326', dark: '#241d15', back: '#1a150f', plank: '#4f4232', face: '#3d3326', handle: '#cfa86b' },
    'Creamy Caramel': { frame: '#beaa86', dark: '#88775a', back: '#4e4434', plank: '#ccba96', face: '#beaa86', handle: '#fbf8f0' },
    'Vanilla White': { frame: '#f2ece0', dark: '#cfc5b0', back: '#e7dfd0', plank: '#e0d7c5', face: '#f8f4ec', handle: '#75532a' },
    'Mocha Espresso': { frame: '#2e2b24', dark: '#1a1813', back: '#11100c', plank: '#3f3b31', face: '#26231d', handle: '#dfd5c0' },
    Vault: { frame: '#15130e', dark: '#090806', back: '#050403', plank: '#201d15', face: '#11100b', handle: '#cfa86b' },
  },
  '10': {
    'Dark Chocolate': { frame: '#2c394b', dark: '#18212e', back: '#101721', plank: '#3b4c63', face: '#2c394b', handle: '#93c5fd' },
    'Creamy Caramel': { frame: '#ad9d87', dark: '#796c5a', back: '#46413b', plank: '#bfae98', face: '#ad9d87', handle: '#f6f9fd' },
    'Vanilla White': { frame: '#ecf2f8', dark: '#c4d3e3', back: '#dee8f3', plank: '#d6e2ef', face: '#f5f9fd', handle: '#2563a8' },
    'Mocha Espresso': { frame: '#1e3047', dark: '#101b29', back: '#09111c', plank: '#29415e', face: '#18283b', handle: '#bae6fd' },
    Vault: { frame: '#0f1824', dark: '#060c14', back: '#04080e', plank: '#172536', face: '#0c141f', handle: '#5ea1e6' },
  },
};

export function getThemeAdaptedLook<
  T extends { name: string; frame: string; dark: string; back: string; plank: string; face: string; handle: string },
>(baseLook: T, themeId: ShelfThemeId): T {
  if (themeId === '1') return baseLook;
  const override = THEME_LOOK_OVERRIDES[themeId]?.[baseLook.name];
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
      return { accentHex: '#df7860', corniceInlay: 'linear-gradient(90deg, transparent, rgba(223,120,96,0.5), transparent)', plinthAccentBg: '#a84732', plinthText: '#fff8f6' };
    case '6':
      return { accentHex: '#48b8a4', corniceInlay: 'linear-gradient(90deg, transparent, rgba(94,234,212,0.45), transparent)', plinthAccentBg: '#1f6f62', plinthText: '#f2fbf8' };
    case '7':
      return { accentHex: '#c9a65b', corniceInlay: 'linear-gradient(90deg, transparent, rgba(217,184,108,0.52), transparent)', plinthAccentBg: '#4b4a8a', plinthText: '#f7f7fc' };
    case '8':
      return { accentHex: '#d67e96', corniceInlay: 'linear-gradient(90deg, transparent, rgba(214,126,150,0.48), transparent)', plinthAccentBg: '#7d2f45', plinthText: '#fcf5f7' };
    case '9':
      return { accentHex: '#cfa86b', corniceInlay: 'linear-gradient(90deg, transparent, rgba(207,168,107,0.48), transparent)', plinthAccentBg: '#75532a', plinthText: '#fdfaf3' };
    case '10':
      return { accentHex: '#5ea1e6', corniceInlay: 'linear-gradient(90deg, transparent, rgba(125,211,252,0.5), transparent)', plinthAccentBg: '#2563a8', plinthText: '#f3f8fd' };
    default:
      return { accentHex: '#d4af37', corniceInlay: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.42), transparent)', plinthAccentBg: '#b4742a', plinthText: '#1b1108' };
  }
}

/* ───────────── DAYTIME FLUTTERING BUTTERFLIES (Themes 1 & 2 Day Mode) ───────────── */
export const DayButterflies: React.FC<{ forestTone?: boolean }> = ({ forestTone = false }) => {
  const butterflies = [
    { top: '20%', left: '16%', color1: forestTone ? '#eab308' : '#f59e0b', color2: '#fef08a', delay: '0s', dur: '7.5s', size: 22 },
    { top: '39%', left: '78%', color1: forestTone ? '#38bdf8' : '#fb923c', color2: '#fde68a', delay: '1.8s', dur: '8.8s', size: 20 },
    { top: '14%', left: '72%', color1: '#a78bfa', color2: '#e9d5ff', delay: '0.9s', dur: '9.6s', size: 18 },
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

/* ───────────── THEME 1: 5 DISTINCT INDOOR STUDY WALLS (ZERO REPETITION ACROSS BAYS) ───────────── */
export const ShelfTheme1BayWall: React.FC<{ night: boolean; variantIdx?: number }> = ({
  night,
  variantIdx = 0,
}) => {
  const v = ((variantIdx % 5) + 5) % 5;

  if (v === 0) {
    // Bay 0 (Dark Chocolate): Deep Walnut Wainscoted Study Wall with Warm Picture Moulding & Gallery Sconce Wash
    return (
      <div style={{ position: 'absolute', inset: 0, zIndex: -30, pointerEvents: 'none' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: night
              ? 'linear-gradient(180deg, #27201e 0%, #191412 65%, #120e0d 100%)'
              : 'linear-gradient(180deg, #cfc2b5 0%, #beae9e 68%, #ae9d8c 100%)',
          }}
        />
        {/* Recessed Georgian Wall Frame Moulding */}
        <svg viewBox="0 0 1200 620" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.35 }}>
          <rect x="64" y="42" width="320" height="440" fill="none" stroke={night ? '#5a463a' : '#7d6956'} strokeWidth="4" />
          <rect x="816" y="42" width="320" height="440" fill="none" stroke={night ? '#5a463a' : '#7d6956'} strokeWidth="4" />
          <rect x="64" y="498" width="1072" height="90" fill={night ? 'rgba(0,0,0,0.22)' : 'rgba(92,68,46,0.12)'} />
        </svg>
      </div>
    );
  }

  if (v === 1) {
    // Bay 1 (Creamy Caramel): Fluted Charcoal Acoustic Slats & Brass Divider Trim
    return (
      <div style={{ position: 'absolute', inset: 0, zIndex: -30, pointerEvents: 'none' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: night
              ? 'repeating-linear-gradient(90deg, #1b2025 0 18px, #0f1215 18px 25px)'
              : 'repeating-linear-gradient(90deg, #2b323a 0 18px, #171c21 18px 25px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 42,
            height: 3,
            background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.45), transparent)',
          }}
        />
      </div>
    );
  }

  if (v === 2) {
    // Bay 2 (Vanilla White): Sunlit Heritage Cream Horizontal Shiplap & Plaster Frieze
    return (
      <div style={{ position: 'absolute', inset: 0, zIndex: -30, pointerEvents: 'none' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: night
              ? 'repeating-linear-gradient(180deg, #352f29 0 54px, #24201c 54px 56px)'
              : 'repeating-linear-gradient(180deg, #f3ede2 0 54px, #dfd4c2 54px 56px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: night
              ? 'radial-gradient(ellipse at 50% 25%, rgba(255,244,214,0.06), transparent 65%)'
              : 'radial-gradient(ellipse at 50% 25%, rgba(255,255,255,0.45), transparent 65%)',
          }}
        />
      </div>
    );
  }

  if (v === 3) {
    // Bay 3 (Mocha Espresso): Nordic Limewash Stone Plaster with Chevron Wood Inlay Band
    return (
      <div style={{ position: 'absolute', inset: 0, zIndex: -30, pointerEvents: 'none' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: night
              ? 'linear-gradient(180deg, #272b33 0%, #181b21 100%)'
              : 'linear-gradient(180deg, #e5e1d8 0%, #d3cdc0 100%)',
          }}
        />
        <svg viewBox="0 0 1200 620" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.32 }}>
          <path d="M0 160 L300 90 L600 160 L900 90 L1200 160" fill="none" stroke={night ? '#525866' : '#8d8575'} strokeWidth="2.5" />
          <path d="M0 190 L300 120 L600 190 L900 120 L1200 190" fill="none" stroke={night ? '#525866' : '#8d8575'} strokeWidth="1.5" />
          <line x1="220" y1="0" x2="220" y2="620" stroke={night ? '#3c414d' : '#a8a090'} strokeWidth="2" />
          <line x1="980" y1="0" x2="980" y2="620" stroke={night ? '#3c414d' : '#a8a090'} strokeWidth="2" />
        </svg>
      </div>
    );
  }

  // Bay 4 (Vault): Classic Oxford Oak Coffered Wall & Gilded Brass Pilaster Flutes
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: -30, pointerEvents: 'none' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: night
            ? 'linear-gradient(180deg, #1b1714 0%, #0f0c0a 100%)'
            : 'linear-gradient(180deg, #b8aa99 0%, #9b8c79 100%)',
        }}
      />
      <svg viewBox="0 0 1200 620" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.42 }}>
        {[120, 320, 880, 1080].map((x) => (
          <g key={x}>
            <rect x={x} y="30" width="90" height="540" rx="2" fill="none" stroke="#d4af37" strokeWidth="1.6" />
            <rect x={x + 12} y="44" width="66" height="512" fill="none" stroke={night ? '#45382c' : '#6e5c4a'} strokeWidth="2.4" />
          </g>
        ))}
      </svg>
    </div>
  );
};

/* ───────────── THEME 2: FOREST SANCTUARY (5 DISTINCT WOODLAND VISTAS) ───────────── */
export const ForestSanctuaryBackdrop: React.FC<{ night: boolean; variantIdx?: number }> = ({
  night,
  variantIdx = 0,
}) => {
  const v = ((variantIdx % 5) + 5) % 5;
  const skyColors = [
    night ? ['#09130f', '#0e1e17', '#12261c'] : ['#cddcd0', '#dce7dc', '#c2d4c2'],
    night ? ['#071214', '#0b1e21', '#102825'] : ['#c7deda', '#d7e9e4', '#b8d1ca'],
    night ? ['#0a140b', '#122112', '#172b15'] : ['#d9e4ca', '#e5ecd8', '#cbd8b8'],
    night ? ['#081018', '#0d1b28', '#10232b'] : ['#c9dae3', '#dce7ec', '#bed2d9'],
    night ? ['#12120c', '#1c1d12', '#1e2416'] : ['#e4dcc9', '#ede6d6', '#cfcaa9'],
  ][v]!;

  return (
    <div style={{ position: 'absolute', inset: 0, bottom: 130, zIndex: -16, pointerEvents: 'none', overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(180deg, ${skyColors[0]} 0%, ${skyColors[1]} 48%, ${skyColors[2]} 100%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 22,
          left: `${12 + v * 16}%`,
          width: 110,
          height: 110,
          borderRadius: '50%',
          background: night
            ? 'radial-gradient(circle, rgba(226,242,231,0.34), rgba(148,210,168,0.08) 58%, transparent 72%)'
            : 'radial-gradient(circle, rgba(255,252,224,0.85), rgba(254,240,138,0.22) 55%, transparent 75%)',
          filter: 'blur(4px)',
        }}
      />

      <svg
        viewBox="0 0 1200 580"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: night ? 0.9 : 0.94 }}
      >
        {v === 0 && (
          <>
            <path d="M0 390 Q180 310 360 365 T760 340 T1200 370 V580 H0 Z" fill={night ? '#0b1912' : '#96ad98'} opacity="0.55" />
            <path d="M0 450 Q260 395 520 435 T980 405 T1200 440 V580 H0 Z" fill={night ? '#09140e' : '#7b967e'} opacity="0.72" />
            <g fill={night ? '#16221b' : '#4a3d2f'}>
              <path d="M0 0 H52 C42 200 54 410 72 580 H0 Z" opacity="0.92" />
              <path d="M1146 0 H1200 V580 H1126 C1138 390 1148 210 1146 0 Z" opacity="0.92" />
            </g>
          </>
        )}
        {v === 1 && (
          <>
            {/* Cedar Waterfall Canyon */}
            <path d="M0 580 V260 L210 180 L310 380 L450 580 Z" fill={night ? '#12241c' : '#6c8771'} />
            <path d="M1200 580 V230 L960 175 L840 395 L740 580 Z" fill={night ? '#102019' : '#5e7a64'} />
            <path d="M165 245 Q195 385 182 580 H238 Q226 390 198 245 Z" fill={night ? '#416f7d' : '#d8f1f5'} opacity="0.72" />
            <ellipse cx="208" cy="566" rx="115" ry="20" fill={night ? '#2c5360' : '#f1fbfd'} opacity="0.6" />
          </>
        )}
        {v === 2 && (
          <>
            {/* Tall Sunlit Bamboo & Glade Stalks */}
            <path d="M0 440 Q320 390 640 425 T1200 405 V580 H0 Z" fill={night ? '#112113' : '#8aa67a'} opacity="0.65" />
            {[46, 98, 152, 1020, 1082, 1140].map((bx, i) => (
              <g key={bx} stroke={night ? '#264226' : '#547344'} strokeWidth={i % 2 === 0 ? 12 : 8}>
                <line x1={bx} y1="0" x2={bx + (i % 2 === 0 ? 8 : -10)} y2="580" />
              </g>
            ))}
          </>
        )}
        {v === 3 && (
          <>
            {/* Mirror Forest Lake & Spruce Reflection */}
            <path d="M0 330 L140 210 L260 320 L380 185 L520 330 L740 205 L900 325 L1060 195 L1200 315 V580 H0 Z" fill={night ? '#0d1d24' : '#64827d'} opacity="0.72" />
            <rect x="0" y="340" width="1200" height="240" fill={night ? '#0a1924' : '#7ba6ad'} opacity="0.65" />
            <line x1="60" y1="415" x2="290" y2="415" stroke={night ? '#7fb4c4' : '#effafc'} strokeWidth="2" opacity="0.45" />
            <line x1="880" y1="440" x2="1120" y2="440" stroke={night ? '#7fb4c4' : '#effafc'} strokeWidth="2" opacity="0.45" />
          </>
        )}
        {v === 4 && (
          <>
            {/* Golden Birch Grove Ridge */}
            <path d="M0 420 Q280 340 580 390 T1200 350 V580 H0 Z" fill={night ? '#1a2417' : '#8c8a5e'} opacity="0.65" />
            <g fill={night ? '#2c3328' : '#dfd6c2'}>
              <rect x="28" y="0" width="28" height="580" rx="6" />
              <rect x="92" y="0" width="22" height="580" rx="6" />
              <rect x="1080" y="0" width="26" height="580" rx="6" />
              <rect x="1142" y="0" width="32" height="580" rx="6" />
            </g>
          </>
        )}
        {/* Upper Woodland Canopy Framing */}
        <path d="M0 0 H370 C300 62 210 78 130 122 C70 154 35 204 0 232 Z" fill={night ? '#0d1d14' : '#3d5940'} opacity="0.86" />
        <path d="M1200 0 H830 C900 60 990 76 1070 122 C1130 156 1165 204 1200 228 Z" fill={night ? '#0d1d14' : '#3d5940'} opacity="0.86" />
      </svg>
    </div>
  );
};

/* ───────────── THEME 3: BEACH BALCONY + INTERACTIVE DOLPHINS (5 COASTAL VISTAS) ───────────── */
export const BeachBalconyWithDolphins: React.FC<{ night: boolean; variantIdx?: number }> = ({
  night,
  variantIdx = 0,
}) => {
  const [dolphinBoost, setDolphinBoost] = useState<number | null>(null);
  const [splashMsg, setSplashMsg] = useState<string | null>(null);
  const v = ((variantIdx % 5) + 5) % 5;

  const handleDolphinClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setDolphinBoost(id);
    setSplashMsg(
      night ? 'Moonlit dolphin leaps over silver waves!' : 'Dolphin dives happily through turquoise surf!'
    );
    window.setTimeout(() => setDolphinBoost(null), 1600);
    window.setTimeout(() => setSplashMsg(null), 2600);
  };

  const skyPalette = [
    night ? ['#081326', '#0e2240', '#0c2947', '#07192d'] : ['#b8dcf0', '#dff0f8', '#4da1b8', '#28748d'],
    night ? ['#0b1528', '#152746', '#10304f', '#081b2e'] : ['#c7e4f2', '#eef4f7', '#5cb4c9', '#2b7c94'],
    night ? ['#0c1229', '#1c2448', '#132a47', '#081629'] : ['#ffd8be', '#ffeedd', '#499bb3', '#236880'],
    night ? ['#071626', '#0b2a3c', '#0e3447', '#061a26'] : ['#a8dce3', '#dcf6f5', '#34a3a3', '#1e6e73'],
    night ? ['#091220', '#122036', '#0d253d', '#061321'] : ['#cbe3f5', '#e9f3fa', '#468eb8', '#235e85'],
  ][v]!;

  return (
    <div style={{ position: 'absolute', inset: 0, bottom: 130, zIndex: -14, overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(180deg, ${skyPalette[0]} 0%, ${skyPalette[1]} 46%, ${skyPalette[2]} 48%, ${skyPalette[3]} 100%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Sun or Silver Moon */}
      <div
        style={{
          position: 'absolute',
          top: 30,
          left: v === 2 ? '82%' : `${12 + v * 15}%`,
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: night
            ? 'radial-gradient(circle, #f8fafc 30%, #cbd5e1 75%, transparent 100%)'
            : 'radial-gradient(circle, #fffbeb 25%, #fde68a 70%, transparent 100%)',
          boxShadow: night ? '0 0 32px rgba(226,232,240,0.55)' : '0 0 38px rgba(254,240,138,0.85)',
          pointerEvents: 'none',
        }}
      />

      {/* Distinct Scenic Horizon Elements for Bays 0..4 */}
      <svg
        viewBox="0 0 1200 320"
        preserveAspectRatio="none"
        style={{ position: 'absolute', top: '24%', left: 0, width: '100%', height: '62%', pointerEvents: 'none', opacity: 0.85 }}
      >
        {v === 0 && (
          <>
            {/* Horizon Sailboat */}
            <polygon points="150,115 168,62 178,115" fill={night ? '#cbd5e1' : '#ffffff'} opacity="0.88" />
            <polygon points="1030,112 1044,72 1054,112" fill={night ? '#94a3b8' : '#fef9ee'} opacity="0.82" />
          </>
        )}
        {v === 1 && (
          <>
            {/* Limestone Sea Arch & Cliffs */}
            <path d="M0 165 L90 70 Q135 55 165 110 V165 H115 Q115 115 80 115 Q52 115 48 165 Z" fill={night ? '#243140' : '#b8a992'} />
            <path d="M1200 165 L1080 82 L1020 130 L980 165 H1200 Z" fill={night ? '#1c2633' : '#a89882'} />
          </>
        )}
        {v === 2 && (
          <>
            {/* Seaside Promontory Lighthouse */}
            <path d="M0 165 Q120 115 210 165 Z" fill={night ? '#182230' : '#857766'} />
            <rect x="86" y="72" width="16" height="58" fill={night ? '#cbd5e1' : '#f8f5ef'} />
            <circle cx="94" cy="70" r="7" fill="#fef08a" />
          </>
        )}
        {v === 3 && (
          <>
            {/* Tropical Palm Arch Silhouettes */}
            <path d="M40 300 Q65 160 110 80" stroke={night ? '#101d24' : '#3a4f45'} strokeWidth="10" fill="none" />
            <path d="M110 80 Q60 55 25 90 M110 80 Q150 50 185 88 M110 80 Q95 35 135 28" stroke={night ? '#162b26' : '#2d543f'} strokeWidth="6" fill="none" />
            <path d="M1155 300 Q1130 165 1090 92" stroke={night ? '#101d24' : '#3a4f45'} strokeWidth="10" fill="none" />
            <path d="M1090 92 Q1040 62 1010 95 M1090 92 Q1140 60 1175 94" stroke={night ? '#162b26' : '#2d543f'} strokeWidth="6" fill="none" />
          </>
        )}
        {v === 4 && (
          <>
            {/* Crescent Harbor Jetty Pier */}
            <rect x="920" y="138" width="280" height="14" fill={night ? '#28313d' : '#78624d'} />
            <rect x="960" y="148" width="8" height="44" fill={night ? '#1f2630' : '#574534'} />
            <rect x="1080" y="148" width="8" height="44" fill={night ? '#1f2630' : '#574534'} />
          </>
        )}
        <path d="M0 155 Q180 135 360 155 T720 155 T1200 155 V320 H0 Z" fill={night ? '#0d3154' : '#3a8fa8'} opacity="0.72" />
        <path d="M0 198 Q190 180 380 198 T760 198 T1200 198 V320 H0 Z" fill={night ? '#0a243f' : '#2a778f'} opacity="0.82" />
      </svg>

      {/* INTERACTIVE DOLPHINS ON LEFT & RIGHT SEASIDE BALCONY VIEW */}
      {[
        { id: 1, left: '7%', bottom: 132, scale: 1 },
        { id: 2, left: '16%', bottom: 112, scale: 0.85 },
        { id: 3, right: '11%', bottom: 122, scale: -0.92 },
      ].map((d) => {
        const isLeaping = dolphinBoost === d.id;
        return (
          <button
            key={d.id}
            type="button"
            onClick={(e) => handleDolphinClick(e, d.id)}
            title="Click dolphin to watch it swim, leap & dive!"
            className="beach-dolphin-btn"
            style={{
              position: 'absolute',
              left: d.left,
              right: d.right,
              bottom: d.bottom,
              zIndex: 4,
              background: 'none',
              border: 0,
              padding: 4,
              cursor: 'pointer',
              pointerEvents: 'auto',
              transform: `scaleX(${d.scale < 0 ? -1 : 1}) scale(${Math.abs(d.scale)})`,
              animation: isLeaping
                ? 'dolphinActiveDive 1.45s cubic-bezier(0.32, 0.85, 0.4, 1) forwards'
                : `dolphinIdleSwim ${4.4 + d.id * 0.9}s ease-in-out infinite`,
            }}
          >
            <svg viewBox="0 0 92 56" width="84" height="50" style={{ overflow: 'visible' }}>
              {isLeaping && (
                <g fill={night ? '#cbd5e1' : '#e0f2fe'} opacity="0.9">
                  <circle cx="16" cy="48" r="2.6" />
                  <circle cx="28" cy="42" r="2" />
                  <circle cx="62" cy="44" r="2.4" />
                  <circle cx="74" cy="49" r="1.8" />
                </g>
              )}
              <path
                d="M12 40 C22 18, 48 10, 68 24 C75 29, 82 32, 86 33 C80 36, 73 36, 67 35 C58 34, 44 29, 28 38 C22 42, 16 46, 12 40 Z"
                fill={night ? '#64748b' : '#3b738c'}
                stroke={night ? '#cbd5e1' : '#bae6fd'}
                strokeWidth="1.2"
              />
              <path d="M40 18 Q44 6 52 16 Z" fill={night ? '#475569' : '#2a5a70'} />
              <path d="M12 39 Q2 32 4 42 Q8 48 15 43 Z" fill={night ? '#475569' : '#2a5a70'} />
              <path d="M30 35 C44 27, 58 29, 70 33 C58 35, 42 33, 30 35 Z" fill="#e2e8f0" opacity="0.65" />
            </svg>
          </button>
        );
      })}

      {splashMsg && (
        <div
          style={{ position: 'absolute', left: '8%', bottom: 190, zIndex: 18, pointerEvents: 'none' }}
          className="px-3 py-1 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-sky-200 text-[10.5px] font-semibold shadow-md border border-sky-300/60"
        >
          {splashMsg}
        </div>
      )}

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
            ? 'repeating-linear-gradient(90deg, #27303c 0 10px, transparent 10px 44px)'
            : 'repeating-linear-gradient(90deg, #dfd7ca 0 10px, transparent 10px 44px)',
          boxShadow: 'inset 0 6px 14px rgba(0,0,0,0.22)',
        }}
      />
    </div>
  );
};

/* ───────────── THEME 4: HEAVY RAIN + COVERED VERANDA BALCONY (5 MONSOON VISTAS) ───────────── */
export const MonsoonRainBackdrop: React.FC<{ night: boolean; variantIdx?: number }> = ({
  night,
  variantIdx = 0,
}) => {
  const v = ((variantIdx % 5) + 5) % 5;

  // Generate 52 rain streaks across full veranda sky
  const rainStreaks = Array.from({ length: 52 }, (_, idx) => ({
    left: `${(idx * 2 + (idx % 3)) % 99}%`,
    top: `${-15 - (idx % 5) * 14}%`,
    height: 36 + (idx % 4) * 16,
    width: idx % 5 === 0 ? 2 : 1.3,
    dur: 0.72 + (idx % 6) * 0.14,
    delay: ((idx * 0.11) % 1.3).toFixed(2),
    opacity: idx % 3 === 0 ? 0.72 : 0.45,
  }));

  const eavesDrips = [5, 11, 18, 26, 35, 48, 62, 71, 79, 86, 93, 97];
  const puddles = [8, 17, 24, 77, 85, 92];

  return (
    <div style={{ position: 'absolute', inset: 0, bottom: 130, zIndex: -15, pointerEvents: 'none', overflow: 'hidden' }}>
      {/* Stormy Misted Monsoon Sky */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: night
            ? 'linear-gradient(180deg, #070c15 0%, #0e1828 52%, #131f30 100%)'
            : 'linear-gradient(180deg, #9fb1c1 0%, #b5c5d4 52%, #cad6e0 100%)',
        }}
      />

      {/* 5 Distinct Distant Storm Sceneries Beyond the Veranda Balcony */}
      <svg
        viewBox="0 0 1200 580"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.84 }}
      >
        {v === 0 && (
          <>
            {/* Misty Hillside Tea Estate in Monsoon Clouds */}
            <path d="M0 440 Q220 330 460 390 T920 350 T1200 390 V580 H0 Z" fill={night ? '#0d1924' : '#6f8594'} />
            <path d="M0 490 Q280 415 580 465 T1200 445 V580 H0 Z" fill={night ? '#0a141d' : '#586e7d'} />
            <ellipse cx="320" cy="290" rx="220" ry="38" fill="rgba(226,238,248,0.22)" />
          </>
        )}
        {v === 1 && (
          <>
            {/* Wet Cobblestone Town Silhouettes & Chimneys */}
            <path d="M0 580 V380 L75 340 L145 380 V350 L215 315 L280 355 V580 Z" fill={night ? '#0c131d' : '#657382'} />
            <path d="M920 580 V360 L1000 315 L1085 360 V340 L1200 300 V580 Z" fill={night ? '#0a1019' : '#596776'} />
            <rect x="110" y="395" width="12" height="16" fill="#fbbf24" opacity={night ? 0.85 : 0.45} rx="1" />
            <rect x="1030" y="388" width="14" height="18" fill="#fbbf24" opacity={night ? 0.85 : 0.45} rx="1" />
          </>
        )}
        {v === 2 && (
          <>
            {/* Swollen Monsoon Riverfront & Ferry Pier */}
            <path d="M0 370 Q400 340 800 375 T1200 355 V580 H0 Z" fill={night ? '#101d2b' : '#687f8c'} />
            <rect x="0" y="425" width="1200" height="155" fill={night ? '#0c1b29' : '#56707d'} />
            <rect x="850" y="395" width="260" height="12" fill={night ? '#1f2937' : '#475569'} />
          </>
        )}
        {v === 3 && (
          <>
            {/* Fog-Cloaked Monsoon Pine Gorge */}
            <path d="M0 330 L140 220 L250 340 L370 215 L480 355 L1200 365 V580 H0 Z" fill={night ? '#0d1a1f' : '#5b7576'} />
            <path d="M1000 220 L1080 140 L1180 280 V580 H920 Z" fill={night ? '#0a1418' : '#4a6364'} />
          </>
        )}
        {v === 4 && (
          <>
            {/* Distant Storm Harbour Breakwater */}
            <path d="M0 410 Q320 385 640 410 T1200 390 V580 H0 Z" fill={night ? '#0f1b28' : '#627789'} />
            <path d="M60 440 H240 V470 H60 Z" fill={night ? '#1e293b' : '#4b5a69'} />
            <rect x="90" y="365" width="16" height="75" fill={night ? '#94a3b8' : '#e2e8f0'} />
            <circle cx="98" cy="364" r="6" fill="#fde047" opacity="0.88" />
          </>
        )}
      </svg>

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
              : `linear-gradient(180deg, transparent, rgba(51,65,85,${r.opacity * 0.72}))`,
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
          height: 36,
          background: night
            ? 'linear-gradient(180deg, #10151d 0%, #1d2633 78%, #0c1016 100%)'
            : 'linear-gradient(180deg, #3c4552 0%, #566272 78%, #2e3642 100%)',
          borderBottom: `4px solid ${night ? '#090c12' : '#262d38'}`,
          boxShadow: '0 8px 22px rgba(0,0,0,0.45)',
        }}
      >
        {/* Terracotta Roof Timber Rafter Ends */}
        <div
          style={{
            position: 'absolute',
            inset: 'auto 0 4px 0',
            height: 8,
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
            top: 34,
            left: `${x}%`,
            width: 2,
            height: 12,
            borderRadius: 99,
            background: night ? 'rgba(186,230,253,0.75)' : 'rgba(226,232,240,0.85)',
            animation: `rainEavesDrip ${0.95 + (idx % 4) * 0.25}s ease-in infinite`,
            animationDelay: `${(idx * 0.17) % 1.1}s`,
          }}
        />
      ))}

      {/* Left & Right Veranda Masonry Columns + Warm Brass Hanging Storm Lantern */}
      <div
        style={{
          position: 'absolute',
          top: 28,
          bottom: 0,
          left: 0,
          width: 34,
          background: night ? 'linear-gradient(90deg, #1b222c, #12171e)' : 'linear-gradient(90deg, #747c86, #5e6670)',
          boxShadow: '6px 0 18px rgba(0,0,0,0.35)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 28,
          bottom: 0,
          right: 0,
          width: 34,
          background: night ? 'linear-gradient(270deg, #1b222c, #12171e)' : 'linear-gradient(270deg, #747c86, #5e6670)',
          boxShadow: '-6px 0 18px rgba(0,0,0,0.35)',
        }}
      />

      {/* Warm Hanging Brass Veranda Lantern */}
      <div style={{ position: 'absolute', top: 34, left: '84%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
          left: 34,
          right: 34,
          bottom: 0,
          height: 86,
          borderTop: `7px solid ${night ? '#2c3542' : '#4a5461'}`,
          backgroundImage: night
            ? 'repeating-linear-gradient(90deg, #1e2733 0 6px, transparent 6px 32px)'
            : 'repeating-linear-gradient(90deg, #3c4652 0 6px, transparent 6px 32px)',
          boxShadow: 'inset 0 8px 18px rgba(0,0,0,0.32)',
        }}
      >
        {/* Wet Veranda Coping Stone Ledge + Animated Rain Splash Puddle Ripples */}
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

/* ───────────── THEME 5: SWISS ALPINE CHALET GALLERY (5 PEAKS) ───────────── */
export const SwissAlpineBackdrop: React.FC<{ night: boolean; variantIdx?: number }> = ({
  night,
  variantIdx = 0,
}) => {
  const v = ((variantIdx % 5) + 5) % 5;
  return (
    <div style={{ position: 'absolute', inset: 0, bottom: 130, zIndex: -15, pointerEvents: 'none', overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: night
            ? 'linear-gradient(180deg, #0d1219 0%, #151e29 58%, #1a232e 100%)'
            : 'linear-gradient(180deg, #c6d4e3 0%, #dce4ed 52%, #cbd4de 100%)',
        }}
      />
      <svg viewBox="0 0 1200 580" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <path
          d={
            v === 0
              ? 'M0 580 V380 L190 190 L370 330 L610 130 L850 320 L1040 195 L1200 340 V580 Z'
              : v === 1
              ? 'M0 580 V340 L240 155 L480 350 L760 190 L1020 330 L1200 215 V580 Z'
              : v === 2
              ? 'M0 580 V370 L160 220 L340 310 L580 165 L820 340 L980 230 L1200 330 V580 Z'
              : v === 3
              ? 'M0 580 V390 L280 205 L520 360 L790 150 L1060 355 L1200 280 V580 Z'
              : 'M0 580 V360 L210 230 L430 340 L690 175 L940 310 L1110 210 L1200 315 V580 Z'
          }
          fill={night ? '#222d3b' : '#9aa9ba'}
        />
        <path
          d={v % 2 === 0 ? 'M540 200 L610 130 L680 200 L640 215 L610 190 L575 215 Z' : 'M200 200 L240 155 L295 210 Z'}
          fill={night ? '#cbd5e1' : '#ffffff'}
          opacity="0.82"
        />
        {/* Clean Swiss Chalet Timber Frame Posts */}
        <rect x="0" y="0" width="28" height="580" fill={night ? '#2b1e16' : '#73533d'} />
        <rect x="1172" y="0" width="28" height="580" fill={night ? '#2b1e16' : '#73533d'} />
      </svg>
    </div>
  );
};

/* ───────────── THEME 6: BOTANICAL CONSERVATORY (5 ATRIUM WINGS) ───────────── */
export const ConservatoryBackdrop: React.FC<{ night: boolean; variantIdx?: number }> = ({
  night,
  variantIdx = 0,
}) => {
  const v = ((variantIdx % 5) + 5) % 5;
  const glassFill = [
    night ? ['#071614', '#0e2823'] : ['#cde5dd', '#e3f2ec'],
    night ? ['#081a15', '#103025'] : ['#d5ebe0', '#ebf6ef'],
    night ? ['#0b1712', '#172a1d'] : ['#dfead7', '#f0f5ea'],
    night ? ['#07181d', '#0d2c34'] : ['#c8e4ea', '#e2f3f6'],
    night ? ['#0b1915', '#152c23'] : ['#d9eae0', '#eef6f0'],
  ][v]!;

  return (
    <div style={{ position: 'absolute', inset: 0, bottom: 130, zIndex: -15, pointerEvents: 'none', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${glassFill[0]} 0%, ${glassFill[1]} 100%)` }} />
      <svg viewBox="0 0 1200 580" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <g fill="none" stroke={night ? '#285e52' : '#588276'} strokeWidth={v % 2 === 0 ? 4 : 3}>
          <path d="M40 580 V240 A140 160 0 0 1 320 240 V580" />
          <path d="M880 580 V240 A140 160 0 0 1 1160 240 V580" />
          <line x1="180" y1="80" x2="180" y2="580" opacity="0.55" />
          <line x1="1020" y1="80" x2="1020" y2="580" opacity="0.55" />
          <path d={`M0 ${140 + v * 18} H1200`} opacity="0.4" />
        </g>
        <ellipse cx={160 + v * 12} cy="540" rx="130" ry="60" fill={night ? '#12382f' : '#4a8572'} opacity="0.72" />
        <ellipse cx={1040 - v * 10} cy="540" rx="140" ry="64" fill={night ? '#12382f' : '#4a8572'} opacity="0.72" />
      </svg>
    </div>
  );
};

/* ───────────── THEME 7: NOCTURNE OBSERVATORY (5 CELESTIAL DOMES) ───────────── */
export const ObservatoryBackdrop: React.FC<{ night: boolean; variantIdx?: number }> = ({
  night,
  variantIdx = 0,
}) => {
  const v = ((variantIdx % 5) + 5) % 5;
  return (
    <div style={{ position: 'absolute', inset: 0, bottom: 130, zIndex: -15, pointerEvents: 'none', overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: night
            ? 'linear-gradient(180deg, #060914 0%, #0f1633 65%, #161d3b 100%)'
            : 'linear-gradient(180deg, #dfe0eb 0%, #c8cae0 65%, #b3b7d4 100%)',
        }}
      />
      <svg viewBox="0 0 1200 580" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <circle
          cx={180 + v * 200}
          cy={95 + (v % 3) * 28}
          r="34"
          fill={night ? '#f6d887' : '#ffffff'}
          opacity={night ? 0.85 : 0.72}
        />
        <g stroke={night ? 'rgba(201,166,91,0.45)' : 'rgba(75,74,138,0.35)'} strokeWidth="2" fill="none">
          <circle cx="600" cy="310" r={230 + v * 18} strokeDasharray="8 6" />
          <path d="M120 580 V180 A480 280 0 0 1 1080 180 V580" strokeWidth="5" />
          {v >= 2 && <line x1="920" y1="420" x2="1080" y2="120" strokeWidth="7" stroke={night ? '#c9a65b' : '#4b4a8a'} />}
        </g>
      </svg>
    </div>
  );
};

/* ───────────── THEME 8: ROSEWOOD SCRIPTORIUM (5 OXFORD ALCOVES) ───────────── */
export const RosewoodScriptoriumBackdrop: React.FC<{ night: boolean; variantIdx?: number }> = ({
  night,
  variantIdx = 0,
}) => {
  const v = ((variantIdx % 5) + 5) % 5;
  return (
    <div style={{ position: 'absolute', inset: 0, bottom: 130, zIndex: -15, pointerEvents: 'none', overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: night
            ? 'linear-gradient(180deg, #1b0a10 0%, #12070b 65%, #0c0407 100%)'
            : 'linear-gradient(180deg, #eedee2 0%, #dfc6cd 65%, #cfb0b8 100%)',
        }}
      />
      <svg viewBox="0 0 1200 580" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <g fill="none" stroke={night ? '#7a3147' : '#8e4056'} strokeWidth="4">
          <path d="M56 580 V190 Q140 60 224 190 V580" />
          <path d="M976 580 V190 Q1060 60 1144 190 V580" />
          <circle cx="140" cy="170" r={30 + v * 5} stroke={night ? '#c98899' : '#7d2f45'} />
          <circle cx="1060" cy="170" r={30 + v * 5} stroke={night ? '#c98899' : '#7d2f45'} />
        </g>
      </svg>
    </div>
  );
};

/* ───────────── THEME 9: ARCHIVAL BROADSHEET ATRIUM (5 COLONNADE GALLERIES) ───────────── */
export const BroadsheetAtriumBackdrop: React.FC<{ night: boolean; variantIdx?: number }> = ({
  night,
  variantIdx = 0,
}) => {
  const v = ((variantIdx % 5) + 5) % 5;
  return (
    <div style={{ position: 'absolute', inset: 0, bottom: 130, zIndex: -15, pointerEvents: 'none', overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: night
            ? 'linear-gradient(180deg, #16140f 0%, #100e0b 68%, #0a0907 100%)'
            : 'linear-gradient(180deg, #efe8da 0%, #dfd5c1 68%, #cec1a8 100%)',
        }}
      />
      <svg viewBox="0 0 1200 580" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.52 }}>
        {[60, 210, 990, 1140].map((x, idx) => (
          <rect key={idx} x={x} y={40 + v * 8} width="26" height="540" fill={night ? '#2c271d' : '#baa98c'} />
        ))}
        <circle cx={140 + v * 120} cy="120" r="46" fill="none" stroke={night ? '#cfa86b' : '#75532a'} strokeWidth="3" />
      </svg>
    </div>
  );
};

/* ───────────── THEME 10: FLUENT MICA FJORD TERRACE (5 NORDIC VISTAS) ───────────── */
export const MicaFjordBackdrop: React.FC<{ night: boolean; variantIdx?: number }> = ({
  night,
  variantIdx = 0,
}) => {
  const v = ((variantIdx % 5) + 5) % 5;
  return (
    <div style={{ position: 'absolute', inset: 0, bottom: 130, zIndex: -15, pointerEvents: 'none', overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: night
            ? 'linear-gradient(180deg, #06101c 0%, #0d2138 58%, #0a1829 100%)'
            : 'linear-gradient(180deg, #d8e8f6 0%, #eaf2fa 55%, #bed4e8 100%)',
        }}
      />
      <svg viewBox="0 0 1200 580" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <path
          d={
            v % 2 === 0
              ? 'M0 580 V260 L260 350 L480 280 L760 360 L1020 220 L1200 320 V580 Z'
              : 'M0 580 V300 L220 210 L460 360 L720 230 L960 350 L1200 245 V580 Z'
          }
          fill={night ? '#16314f' : '#8cb1d4'}
          opacity="0.7"
        />
        <rect x="0" y="420" width="1200" height="160" fill={night ? '#0d2238' : '#7ca4cb'} opacity="0.65" />
      </svg>
    </div>
  );
};

/* ───────────── 10 COMPLETELY DIFFERENT THEME CARPETS ───────────── */
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
        // Theme 2: Circular Braided Mossy Botanical Ring Rug
        return (
          <svg viewBox="0 0 790 92" preserveAspectRatio="none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
            <ellipse cx="395" cy="48" rx="345" ry="40" fill="#9fb294" stroke="#47664c" strokeWidth="4" />
            <ellipse cx="395" cy="48" rx="285" ry="31" fill="#c7d5bd" stroke="#628064" strokeWidth="2.5" strokeDasharray="10 5" />
            <ellipse cx="395" cy="48" rx="210" ry="22" fill="#dde7d4" stroke="#47664c" strokeWidth="2" />
            <ellipse cx="395" cy="48" rx="110" ry="12" fill="#eef3e7" />
          </svg>
        );
      case '3':
        // Theme 3: Scalloped Seaside Wave Flatweave Rug
        return (
          <svg viewBox="0 0 790 92" preserveAspectRatio="none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
            <rect x="18" y="8" width="754" height="74" rx="18" fill="#efe6d3" stroke="#2c7a94" strokeWidth="4" />
            <path d="M24 30 Q90 22 156 30 T288 30 T420 30 T552 30 T684 30 T766 30" fill="none" stroke="#4ca0b8" strokeWidth="2.5" />
            <path d="M24 62 Q90 54 156 62 T288 62 T420 62 T552 62 T684 62 T766 62" fill="none" stroke="#c97d5d" strokeWidth="2.5" />
            <rect x="34" y="16" width="722" height="58" rx="12" fill="none" stroke="#b59d7a" strokeWidth="1.5" strokeDasharray="6 6" />
          </svg>
        );
      case '4':
        // Theme 4: Fringed Rectangular Woven Monsoon Slate Runner with Warm Amber Stripes
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
        // Theme 5: Sharp Swiss Rectilinear Herringbone Wool Rug with Crimson Tape Border
        return (
          <svg viewBox="0 0 790 92" preserveAspectRatio="none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
            <rect x="14" y="8" width="762" height="76" rx="2" fill="#a84732" />
            <rect x="28" y="14" width="734" height="64" rx="1" fill="#dedad4" />
            <g stroke="#9ca3af" strokeWidth="1.5" opacity="0.65">
              {Array.from({ length: 18 }, (_, i) => (
                <path key={i} d={`M${40 + i * 40} 18 L${60 + i * 40} 46 L${40 + i * 40} 74`} fill="none" />
              ))}
            </g>
          </svg>
        );
      case '6':
        // Theme 6: Octagonal Botanical Conservatory Jute & Teal Border Mat
        return (
          <svg viewBox="0 0 790 92" preserveAspectRatio="none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
            <polygon points="78,8 712,8 776,30 776,62 712,84 78,84 14,62 14,30" fill="#d9ccb2" stroke="#1f6f62" strokeWidth="4" />
            <polygon points="94,16 696,16 746,35 746,57 696,76 94,76 44,57 44,35" fill="none" stroke="#3c9180" strokeWidth="2" />
            <ellipse cx="395" cy="46" rx="75" ry="18" fill="#1f6f62" opacity="0.22" />
          </svg>
        );
      case '7':
        // Theme 7: Elongated Hexagonal Celestial Observatory Rug with Brass Constellation Inlays
        return (
          <svg viewBox="0 0 790 92" preserveAspectRatio="none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
            <polygon points="65,8 725,8 778,46 725,84 65,84 12,46" fill="#23294d" stroke="#c9a65b" strokeWidth="3.5" />
            <ellipse cx="395" cy="46" rx="180" ry="22" fill="none" stroke="#c9a65b" strokeWidth="1.5" strokeDasharray="8 5" />
            <polygon points="395,28 402,42 420,46 402,50 395,64 388,50 370,46 388,42" fill="#f3d68a" opacity="0.88" />
          </svg>
        );
      case '8':
        // Theme 8: Fringed Rectangular Burgundy Persian Scriptorium Velvet Carpet
        return (
          <svg viewBox="0 0 790 92" preserveAspectRatio="none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
            <rect x="18" y="8" width="754" height="76" rx="3" fill="#6b1d30" stroke="#e5c687" strokeWidth="3" />
            <rect x="44" y="16" width="702" height="60" fill="#82293e" stroke="#f0d9ab" strokeWidth="1.5" />
            <polygon points="395,20 475,46 395,72 315,46" fill="#3a101b" stroke="#e5c687" strokeWidth="2" />
            <polygon points="395,30 438,46 395,62 352,46" fill="#e5c687" opacity="0.82" />
          </svg>
        );
      case '9':
        // Theme 9: Stepped-Diamond Kilim Archival Vellum & Espresso Carpet
        return (
          <svg viewBox="0 0 790 92" preserveAspectRatio="none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
            <rect x="20" y="10" width="750" height="72" rx="4" fill="#e4d8c1" stroke="#59452c" strokeWidth="3.5" />
            {[160, 395, 630].map((cx) => (
              <polygon key={cx} points={`${cx},20 ${cx + 55},46 ${cx},72 ${cx - 55},46`} fill="#8b6239" stroke="#3b2f21" strokeWidth="1.5" />
            ))}
          </svg>
        );
      case '10':
        // Theme 10: Layered Dual-Tone Nordic Boucle Pill Rug
        return (
          <svg viewBox="0 0 790 92" preserveAspectRatio="none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
            <rect x="14" y="10" width="762" height="72" rx="36" fill="#30567a" stroke="#93c5fd" strokeWidth="2" />
            <rect x="44" y="16" width="540" height="60" rx="30" fill="#dde8f4" opacity="0.92" />
            <rect x="520" y="20" width="232" height="52" rx="26" fill="#7aaad6" opacity="0.65" />
          </svg>
        );
      default:
        // Theme 1: Classic Soft Cream Plush Shearling Rug
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
