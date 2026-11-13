import { DesignId } from '../../types';

export interface MakeNoteThemeConfig {
  id: DesignId;
  name: string;
  badge: string;
  subtitle: string;
  workspaceBg: string;
  headerBg: string;
  headerBorder: string;
  windowBg: string;
  windowBorder: string;
  windowHeaderBg: string;
  windowHeaderBorder: string;
  accentHex: string;
  accentLightHex: string;
  fontFamily: string;
  fontFamilyTitle: string;
  paperDefaultBg: string;
  paperDefaultColor: string;
  toolbarBg: string;
  toolbarBorder: string;
  isGlass?: boolean;
  isBroadsheet?: boolean;
  isTerminal?: boolean;
}

const UNIFIED_FONT = "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif";

export const MAKE_NOTE_THEMES: Record<DesignId, MakeNoteThemeConfig> = {
  '1': {
    id: '1',
    name: 'Default',
    badge: 'Reading Room Desk',
    subtitle: 'Warm Bear Caramel & Soft Alabaster Paper Desk',
    workspaceBg: '#edece8',
    headerBg: '#f4f3ef',
    headerBorder: '#dedbd2',
    windowBg: '#fcfbf8',
    windowBorder: '#d9d5cb',
    windowHeaderBg: '#f3f1eb',
    windowHeaderBorder: '#dedbd2',
    accentHex: '#8f5f2c',
    accentLightHex: '#f3e7d4',
    fontFamily: UNIFIED_FONT,
    fontFamilyTitle: UNIFIED_FONT,
    paperDefaultBg: '#fcfbf8',
    paperDefaultColor: '#1e2227',
    toolbarBg: '#eae7df',
    toolbarBorder: '#dad5ca',
  },
  '2': {
    id: '2',
    name: 'Focus',
    badge: 'Office Ribbon Workspace',
    subtitle: 'Sober Fjord Slate & Archival Document Paper',
    workspaceBg: '#13181f',
    headerBg: '#1a222c',
    headerBorder: '#283443',
    windowBg: '#181f28',
    windowBorder: '#293747',
    windowHeaderBg: '#1f2834',
    windowHeaderBorder: '#304153',
    accentHex: '#587a94',
    accentLightHex: '#d8e5ef',
    fontFamily: UNIFIED_FONT,
    fontFamilyTitle: UNIFIED_FONT,
    paperDefaultBg: '#fbfaf7',
    paperDefaultColor: '#1e2227',
    toolbarBg: '#1b232e',
    toolbarBorder: '#2b394a',
  },
  '3': {
    id: '3',
    name: 'Minimalist',
    badge: 'Night Desk Cockpit',
    subtitle: 'Smoked Obsidian Basalt & Mineral Slate Telemetry',
    workspaceBg: '#111417',
    headerBg: '#161a1e',
    headerBorder: '#242a30',
    windowBg: '#14181c',
    windowBorder: '#222830',
    windowHeaderBg: '#1a2026',
    windowHeaderBorder: '#28313a',
    accentHex: '#587a94',
    accentLightHex: '#dce6ef',
    fontFamily: UNIFIED_FONT,
    fontFamilyTitle: UNIFIED_FONT,
    paperDefaultBg: '#161a1e',
    paperDefaultColor: '#e4e7ea',
    toolbarBg: '#181d22',
    toolbarBorder: '#262d35',
  },
  '4': {
    id: '4',
    name: 'Expanded',
    badge: 'Study Desk Flat-Lay',
    subtitle: 'Warm Smoked Walnut & Lined Terracotta Stationery',
    workspaceBg: '#181512',
    headerBg: '#211d19',
    headerBorder: '#372f28',
    windowBg: '#1d1915',
    windowBorder: '#342c25',
    windowHeaderBg: '#26211c',
    windowHeaderBorder: '#3c322b',
    accentHex: '#b57c52',
    accentLightHex: '#f6ebe0',
    fontFamily: UNIFIED_FONT,
    fontFamilyTitle: UNIFIED_FONT,
    paperDefaultBg: '#fbf7ee',
    paperDefaultColor: '#24201c',
    toolbarBg: '#231e1a',
    toolbarBorder: '#3a3129',
  },
  '5': {
    id: '5',
    name: 'Chill',
    badge: 'Swiss Minimal Grid',
    subtitle: 'Modernist Grid, Warm Lines & Muted Terracotta Accent',
    workspaceBg: '#131415',
    headerBg: '#1a1b1d',
    headerBorder: '#995a50',
    windowBg: '#17181a',
    windowBorder: '#282a2d',
    windowHeaderBg: '#1f2023',
    windowHeaderBorder: '#2d3034',
    accentHex: '#9e5d53',
    accentLightHex: '#f4e3e0',
    fontFamily: UNIFIED_FONT,
    fontFamilyTitle: UNIFIED_FONT,
    paperDefaultBg: '#faf8f5',
    paperDefaultColor: '#18191b',
    toolbarBg: '#1c1e20',
    toolbarBorder: '#2a2c30',
  },
  '6': {
    id: '6',
    name: 'Artistic',
    badge: 'Clinic Anatomy Suite',
    subtitle: 'Deep Mineral Fjord Slate & Diagnostic Matrix',
    workspaceBg: '#10141b',
    headerBg: '#151b24',
    headerBorder: '#232e3d',
    windowBg: '#131822',
    windowBorder: '#212c3b',
    windowHeaderBg: '#18202c',
    windowHeaderBorder: '#283649',
    accentHex: '#4a76a4',
    accentLightHex: '#e2ebf5',
    fontFamily: UNIFIED_FONT,
    fontFamilyTitle: UNIFIED_FONT,
    paperDefaultBg: '#f4f8f6',
    paperDefaultColor: '#122320',
    toolbarBg: '#182220',
    toolbarBorder: '#273834',
  },
  '7': {
    id: '7',
    name: 'techi',
    badge: 'Command Center HUD',
    subtitle: 'Warm Amber Brass Terminal & Low-Strain Monospace HUD',
    workspaceBg: '#111518',
    headerBg: '#161b20',
    headerBorder: '#252e36',
    windowBg: '#14191e',
    windowBorder: '#232b33',
    windowHeaderBg: '#1a2128',
    windowHeaderBorder: '#29333d',
    accentHex: '#b88642',
    accentLightHex: '#f5ead6',
    fontFamily: UNIFIED_FONT,
    fontFamilyTitle: UNIFIED_FONT,
    paperDefaultBg: '#151b20',
    paperDefaultColor: '#e2ddd5',
    toolbarBg: '#182026',
    toolbarBorder: '#27323b',
    isTerminal: true,
  },
  '8': {
    id: '8',
    name: 'Freestyle',
    badge: 'Bookshelf Archive',
    subtitle: 'Smoked Walnut Spine & Antique Muted Brass Manuscript',
    workspaceBg: '#16120f',
    headerBg: '#1f1914',
    headerBorder: '#352a21',
    windowBg: '#1a1511',
    windowBorder: '#33281f',
    windowHeaderBg: '#231c16',
    windowHeaderBorder: '#3d3025',
    accentHex: '#bfa260',
    accentLightHex: '#f7f1de',
    fontFamily: UNIFIED_FONT,
    fontFamilyTitle: UNIFIED_FONT,
    paperDefaultBg: '#faf7ee',
    paperDefaultColor: '#241b14',
    toolbarBg: '#201914',
    toolbarBorder: '#382c22',
  },
  '9': {
    id: '9',
    name: 'design 9',
    badge: 'Morning Edition Broadsheet',
    subtitle: 'Archival Broadsheet Newsprint & Editorial Columnist Desk',
    workspaceBg: '#171513',
    headerBg: '#201d19',
    headerBorder: '#352f29',
    windowBg: '#1c1916',
    windowBorder: '#322c26',
    windowHeaderBg: '#24201c',
    windowHeaderBorder: '#3a332c',
    accentHex: '#ad7e59',
    accentLightHex: '#f5eae1',
    fontFamily: UNIFIED_FONT,
    fontFamilyTitle: UNIFIED_FONT,
    paperDefaultBg: '#f7f2e7',
    paperDefaultColor: '#24201c',
    toolbarBg: '#211d1a',
    toolbarBorder: '#362f29',
    isBroadsheet: true,
  },
  '10': {
    id: '10',
    name: 'design 10',
    badge: 'Fluent Acrylic Glass',
    subtitle: 'Mica Frosted Glass & Sober Mineral Mist Ambient',
    workspaceBg: '#12161b',
    headerBg: 'rgba(23, 29, 37, 0.65)',
    headerBorder: 'rgba(255, 255, 255, 0.08)',
    windowBg: 'rgba(21, 26, 33, 0.55)',
    windowBorder: 'rgba(255, 255, 255, 0.08)',
    windowHeaderBg: 'rgba(29, 37, 47, 0.65)',
    windowHeaderBorder: 'rgba(255, 255, 255, 0.08)',
    accentHex: '#688ca6',
    accentLightHex: '#dce8f0',
    fontFamily: UNIFIED_FONT,
    fontFamilyTitle: UNIFIED_FONT,
    paperDefaultBg: '#fcfbf8',
    paperDefaultColor: '#1e2227',
    toolbarBg: 'rgba(27, 34, 44, 0.70)',
    toolbarBorder: 'rgba(255, 255, 255, 0.08)',
    isGlass: true,
  },
};

const THEME_1_DARK_OVERRIDE: MakeNoteThemeConfig = {
  id: '1',
  name: 'Default',
  badge: 'Reading Room Desk',
  subtitle: 'Coal Dark Burnt Wood & Warm Parchment Desk',
  workspaceBg: '#110c09',
  headerBg: '#18110c',
  headerBorder: '#352317',
  windowBg: '#1b130d',
  windowBorder: '#382518',
  windowHeaderBg: '#231912',
  windowHeaderBorder: '#3f2b1e',
  accentHex: '#c49257',
  accentLightHex: '#2c1e14',
  fontFamily: UNIFIED_FONT,
  fontFamilyTitle: UNIFIED_FONT,
  paperDefaultBg: '#1c140e',
  paperDefaultColor: '#f0e5d5',
  toolbarBg: '#18110c',
  toolbarBorder: '#352317',
};

export const getMakeNoteTheme = (id?: DesignId, isDarkMode?: boolean): MakeNoteThemeConfig => {
  const resolvedDark =
    isDarkMode !== undefined
      ? isDarkMode
      : typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  const targetId: DesignId = id && MAKE_NOTE_THEMES[id] ? id : '1';
  if (targetId === '1' && resolvedDark) {
    return THEME_1_DARK_OVERRIDE;
  }
  return MAKE_NOTE_THEMES[targetId];
};
