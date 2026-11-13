import { DashboardPreset } from '../types';

export interface DesignEditionConfig {
  id: DashboardPreset;
  name: string;
  code: string;
  tagline: string;
  shortDesc: string;
  accentHex: string;
  accentSecondaryHex: string;
  themeStyle: 'cyber' | 'architectural' | 'techworld' | 'quartz' | 'library' | 'nordic' | 'horlogerie' | 'sumi';
  fontFamilyHeading: string;
  fontFamilyBody: string;
  fontFamilyDesk: string;
  bgDarkHex: string;
  sidebarDarkHex: string;
  borderDarkHex: string;
  meshColor1: string;
  meshColor2: string;
  deskStyle: {
    bg: string;
    textColor: string;
    borderColor: string;
    lineColor: string;
    tagBg: string;
    fontFamily: string;
    accentBadge: string;
  };
  cardGlow: string;
  signatureBadge: string;
}

const UNIFIED_APP_FONT = "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif";

export const DESIGN_EDITIONS: Record<string, DesignEditionConfig> = {
  'cyber-tech': {
    id: 'cyber-tech',
    name: 'Bear Caramel & Parchment',
    code: 'SYS // 01',
    tagline: 'Sober Restorative Precision · Warm Caramel & Cream Slate',
    shortDesc: 'Deep espresso wood desk, soft hairline precision borders, warm bear-caramel & brass telemetry designed for low eye strain.',
    accentHex: '#8f5f2c',
    accentSecondaryHex: '#c49257',
    themeStyle: 'cyber',
    fontFamilyHeading: UNIFIED_APP_FONT,
    fontFamilyBody: UNIFIED_APP_FONT,
    fontFamilyDesk: UNIFIED_APP_FONT,
    bgDarkHex: '#110c09',
    sidebarDarkHex: '#160e0a',
    borderDarkHex: '#352216',
    meshColor1: 'rgba(184, 132, 76, 0.12)',
    meshColor2: 'rgba(110, 62, 31, 0.08)',
    deskStyle: {
      bg: '#18110c',
      textColor: '#efe4d4',
      borderColor: '#362519',
      lineColor: 'rgba(184, 132, 76, 0.14)',
      tagBg: 'rgba(184, 132, 76, 0.16)',
      fontFamily: UNIFIED_APP_FONT,
      accentBadge: 'REST // SYS.01',
    },
    cardGlow: 'hover:shadow-[0_4px_20px_rgba(143,95,44,0.15)] hover:border-amber-600/50',
    signatureBadge: 'REST // 01',
  },
  'nordic-noir': {
    id: 'nordic-noir',
    name: 'Fjord Slate Studio',
    code: 'SHAPE // 02',
    tagline: 'Nordic Archival Simplicity · Calming Mineral Slate Format',
    shortDesc: 'Deep fjord slate grid, soft archival project slabs, muted stats counters, and quiet hairline borders.',
    accentHex: '#587a94',
    accentSecondaryHex: '#849fb3',
    themeStyle: 'architectural',
    fontFamilyHeading: UNIFIED_APP_FONT,
    fontFamilyBody: UNIFIED_APP_FONT,
    fontFamilyDesk: UNIFIED_APP_FONT,
    bgDarkHex: '#13171d',
    sidebarDarkHex: '#171c23',
    borderDarkHex: '#232b35',
    meshColor1: 'rgba(88, 122, 148, 0.10)',
    meshColor2: 'rgba(132, 159, 179, 0.06)',
    deskStyle: {
      bg: '#181e26',
      textColor: '#e6ebef',
      borderColor: '#273340',
      lineColor: 'rgba(132, 159, 179, 0.14)',
      tagBg: 'rgba(88, 122, 148, 0.14)',
      fontFamily: UNIFIED_APP_FONT,
      accentBadge: 'NORDIC FJORD · ARCH // 02',
    },
    cardGlow: 'hover:shadow-[0_4px_20px_rgba(88,122,148,0.15)] hover:border-sky-600/50',
    signatureBadge: 'FJORD // 02',
  },
  'haute-horlogerie': {
    id: 'haute-horlogerie',
    name: 'Roasted Walnut & Brass',
    code: 'DEV // 03',
    tagline: 'Warm Amber Atelier · Low-Fatigue Monospace Matrix',
    shortDesc: 'Deep roasted walnut backdrop, warm burnished brass telemetry, and calm non-fatiguing clinical readouts.',
    accentHex: '#7d5630',
    accentSecondaryHex: '#b88642',
    themeStyle: 'techworld',
    fontFamilyHeading: UNIFIED_APP_FONT,
    fontFamilyBody: UNIFIED_APP_FONT,
    fontFamilyDesk: UNIFIED_APP_FONT,
    bgDarkHex: '#140f0c',
    sidebarDarkHex: '#1a130f',
    borderDarkHex: '#33251c',
    meshColor1: 'rgba(184, 134, 66, 0.10)',
    meshColor2: 'rgba(125, 86, 48, 0.06)',
    deskStyle: {
      bg: '#1c1510',
      textColor: '#efe4d4',
      borderColor: '#3b2b1f',
      lineColor: 'rgba(184, 134, 66, 0.14)',
      tagBg: 'rgba(184, 134, 66, 0.15)',
      fontFamily: UNIFIED_APP_FONT,
      accentBadge: 'WALNUT // v4.12',
    },
    cardGlow: 'hover:shadow-[0_4px_20px_rgba(125,86,48,0.15)] hover:border-amber-700/50',
    signatureBadge: 'BRASS // 03',
  },
  'geneva-quartz': {
    id: 'geneva-quartz',
    name: 'Calm Glacier Quartz',
    code: 'CHRONO // 04',
    tagline: 'Quiet Precision · Smoked Mist & Soft Mineral Glass',
    shortDesc: 'Subdued Zurich aesthetic, frosted mineral glass, razor-thin silver borders, and eye-comfort ivory typography.',
    accentHex: '#6a8fa3',
    accentSecondaryHex: '#e2e8f0',
    themeStyle: 'quartz',
    fontFamilyHeading: UNIFIED_APP_FONT,
    fontFamilyBody: UNIFIED_APP_FONT,
    fontFamilyDesk: UNIFIED_APP_FONT,
    bgDarkHex: '#13161a',
    sidebarDarkHex: '#171b20',
    borderDarkHex: '#22272e',
    meshColor1: 'rgba(106, 143, 163, 0.08)',
    meshColor2: 'rgba(148, 163, 184, 0.08)',
    deskStyle: {
      bg: '#181d22',
      textColor: '#f1f4f6',
      borderColor: '#28313a',
      lineColor: 'rgba(106, 143, 163, 0.12)',
      tagBg: 'rgba(106, 143, 163, 0.10)',
      fontFamily: UNIFIED_APP_FONT,
      accentBadge: 'GLACIER QUARTZ · ETCHED',
    },
    cardGlow: 'hover:shadow-[0_4px_20px_rgba(106,143,163,0.15)] hover:border-slate-500/50',
    signatureBadge: 'GLACIER // 04',
  },
  'kyoto-sumi': {
    id: 'kyoto-sumi',
    name: 'Aged Vellum & Amber',
    code: 'FOLIO // 05',
    tagline: 'Oxford Archival Desk · Smoked Walnut & Muted Amber Vellum',
    shortDesc: 'Rich antique walnut oak borders, warm soft candlelight ochre, card index tabs, and soothing serif typography.',
    accentHex: '#b57c52',
    accentSecondaryHex: '#93613b',
    themeStyle: 'library',
    fontFamilyHeading: UNIFIED_APP_FONT,
    fontFamilyBody: UNIFIED_APP_FONT,
    fontFamilyDesk: UNIFIED_APP_FONT,
    bgDarkHex: '#171412',
    sidebarDarkHex: '#1c1916',
    borderDarkHex: '#2c2621',
    meshColor1: 'rgba(181, 124, 82, 0.10)',
    meshColor2: 'rgba(147, 97, 59, 0.06)',
    deskStyle: {
      bg: '#1e1a17',
      textColor: '#f5ede3',
      borderColor: '#382e26',
      lineColor: 'rgba(181, 124, 82, 0.15)',
      tagBg: 'rgba(181, 124, 82, 0.14)',
      fontFamily: UNIFIED_APP_FONT,
      accentBadge: 'ARCHIVAL STACKS · SHELF 42',
    },
    cardGlow: 'hover:shadow-[0_4px_20px_rgba(181,124,82,0.16)] hover:border-amber-700/60',
    signatureBadge: 'FOLIO // 05',
  },
};

export const DEFAULT_DESIGN_EDITION: DashboardPreset = 'cyber-tech';

export const getDesignEdition = (preset?: DashboardPreset): DesignEditionConfig => {
  if (!preset) return DESIGN_EDITIONS['cyber-tech'];
  if (preset === 'nordic') return DESIGN_EDITIONS['nordic-noir'];
  if (DESIGN_EDITIONS[preset]) return DESIGN_EDITIONS[preset];
  return DESIGN_EDITIONS['cyber-tech'];
};
