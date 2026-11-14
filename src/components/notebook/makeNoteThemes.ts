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

const UNIFIED_FONT = "'Alata', system-ui, -apple-system, sans-serif";

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
    name: 'Pistachio & Obsidian',
    badge: 'Pistachio & Noir Desk',
    subtitle: 'Pista Light Green (Light) & Pure Obsidian Black (Dark) Writing Desk',
    workspaceBg: '#09090b',
    headerBg: '#101013',
    headerBorder: '#27282e',
    windowBg: '#0c0c0f',
    windowBorder: '#27282e',
    windowHeaderBg: '#141418',
    windowHeaderBorder: '#2d2e35',
    accentHex: '#4a8235',
    accentLightHex: '#eaf5e0',
    fontFamily: UNIFIED_FONT,
    fontFamilyTitle: UNIFIED_FONT,
    paperDefaultBg: '#f9fcf5',
    paperDefaultColor: '#172914',
    toolbarBg: '#121216',
    toolbarBorder: '#27282e',
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
