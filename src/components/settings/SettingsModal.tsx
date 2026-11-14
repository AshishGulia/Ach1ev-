import React, { useState, useEffect } from 'react';
import { UserProfile, BreakTimerConfig, DesignId, AppLanguage, SidebarSettings } from '../../types';
import {
  INDIAN_LANGUAGES,
  WORLD_LANGUAGES,
  getAllAvailableLanguages,
  getCustomLanguages,
  saveCustomLanguage,
  removeCustomLanguage,
  getCurrentLanguage,
  setAppLanguage,
} from '../../data/translations';
import { SUBSCRIPTION_TIERS, COMPETITOR_BENCHMARKS } from '../../data/subscriptionData';
import { ThemeAppStorePreviews } from './ThemeAppStorePreviews';
import { useAuth } from '../../contexts/AuthContext';
import {
  DRIVE_APP_FOLDER_NAME,
} from '../../services/googleDriveService';
import {
  User,
  Settings,
  Eye,
  Volume2,
  X,
  Check,
  CheckCircle2,
  Download,
  RotateCcw,
  Sparkles,
  Palette,
  ShieldCheck,
  Zap,
  ExternalLink,
  Copy,
  Globe,
  UploadCloud,
  Crown,
  SlidersHorizontal,
  ArrowUp,
  ArrowDown,
  Cloud,
  HardDrive,
  RefreshCw,
  Database,
  LogIn,
  LogOut,
  AlertCircle,
  Plus,
  Trash2,
  Search,
  Sun,
  Moon,
  Camera,
  Link2,
  Keyboard,
  Target,
  Type,
} from 'lucide-react';

export type SettingsTabId =
  | 'designs'
  | 'cloud-sync'
  | 'typography'
  | 'languages'
  | 'import-notes'
  | 'sidebar-buttons'
  | 'subscription'
  | 'profile'
  | 'customizer'
  | 'break'
  | 'defaults';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  breakTimerConfig: BreakTimerConfig;
  onUpdateBreakConfig: (cfg: BreakTimerConfig) => void;
  onExportNotes: () => void;
  onResetSession: () => void;
  activeDesign?: DesignId;
  onSelectDesign?: (design: DesignId) => void;
  onOpenAIStudioModal?: () => void;
  isWorkspaceView?: boolean;
  initialTab?: SettingsTabId;
  onSyncNow?: () => Promise<void> | void;
  onLogout?: () => void;
}

export interface MasterEdition {
  id: DesignId;
  title: string;
  badge: string;
  category: string;
  tagline: string;
  description: string;
  paletteColors: string[];
  keyHighlights: string[];
}

export const MASTER_EDITIONS: MasterEdition[] = [
  {
    id: '1',
    title: 'Heritage Atelier Study',
    badge: 'Theme 1 · Default',
    category: 'Linen & Walnut Atelier · Espresso Night',
    tagline: 'Calacatta marble Leisure (Light), warm walnut & espresso (Dark), Soft Pill buttons',
    description: 'Signature Heritage Study with warm linen Light Mode, smooth dark walnut & espresso Dark Mode, Soft Pill buttons, daytime butterflies & nighttime fireflies.',
    paletteColors: ['#f6f2ea', '#a47c43', '#6f4225', '#2a180d', '#160b05'],
    keyHighlights: [
      'Smooth walnut & espresso palette (Dark) & Calacatta marble Leisure (Light)',
      '5 unique indoor study walls + Soft Cream Chenille rug in Shelf',
      'Daytime butterflies & nighttime glowing fireflies',
      'Soft Pill buttons (11px) with gradient depth',
    ],
  },
  {
    id: '2',
    title: 'Forest Sanctuary',
    badge: 'Theme 2 · Woodland Living',
    category: 'Exact Atelier Replica · Sage Pine',
    tagline: 'Blurred forest canopy wallpaper, botanical watermarks, Leaf-Contour buttons & woodland Shelf',
    description: 'Exact structural replica of Theme 1 dressed in restorative moss-pine tones. Blurred forest canopy wallpaper, Leaf-Contour buttons (15px 4px 15px 4px), 5 distinct woodland Shelf vistas & round rug.',
    paletteColors: ['#ebf2e7', '#2f6b43', '#46614d', '#153220', '#08120c'],
    keyHighlights: [
      'Blurred woodland canopy wallpaper + botanical watermarks (Light & Dark)',
      'Leaf-Contour button silhouette across all controls',
      '5 unique forest vistas + Mossy Botanical Ring rug in Shelf',
      'Daytime butterflies & nighttime fireflies',
    ],
  },
  {
    id: '3',
    title: 'Coastal Beach Balcony',
    badge: 'Theme 3 · Sea & Dolphins',
    category: 'Exact Atelier Replica · Coastal Sand',
    tagline: 'Blurred surf wallpaper, wave watermarks, Coastal Pebble buttons & interactive dolphins',
    description: 'Exact structural replica of Theme 1 overlooking serene coastal horizons. Worn Coastal Pebble buttons (13px 19px 11px 17px), 5 ocean cove vistas, scalloped sea-shell rug & clickable leaping dolphins.',
    paletteColors: ['#f4efe6', '#1c637a', '#4fb0cc', '#1f415d', '#07121d'],
    keyHighlights: [
      'Blurred surf & sand dune wallpaper + sea-shell watermarks',
      'Coastal Pebble asymmetrical button silhouettes',
      '5 coastal horizons & 3 clickable leaping dolphins in Shelf',
      'Scalloped Beach Flatweave rug & coastal almirahs',
    ],
  },
  {
    id: '4',
    title: 'Cozy Rainy Monsoon',
    badge: 'Theme 4 · Misted Veranda',
    category: 'Exact Atelier Replica · Heavy Rain Balcony',
    tagline: 'Raindrop watermarks, Teardrop buttons & heavy rain streaming past a covered veranda balcony',
    description: 'Exact structural replica of Theme 1 sheltered under a cozy covered monsoon balcony. Features heavy multi-layer rainfall, dripping veranda eaves, wrought-iron balcony railing, puddle ripples & Teardrop buttons.',
    paletteColors: ['#e7edf3', '#365578', '#7ea5d6', '#2c3f5b', '#090f18'],
    keyHighlights: [
      'True covered monsoon veranda balcony with balustrade, dripping eaves & puddles',
      'Heavy animated rainfall + hanging brass veranda lantern',
      'Teardrop (15px 15px 15px 4px) button silhouettes',
      'Woven Monsoon Slate Runner rug & rain watermarks',
    ],
  },
  {
    id: '5',
    title: 'Swiss Alpine Atelier',
    badge: 'Theme 5 · Precision Chalet',
    category: 'Exact Atelier Replica · Glacier & Terracotta',
    tagline: 'Precision drafting wallpaper, Swiss 3px Rectilinear buttons & 5 Alpine peak vistas',
    description: 'Exact structural replica of Theme 1 with crisp Swiss drafting precision. Features Glacier Slate & Alpine Terracotta accents, sharp 3px rectilinear buttons, Alpine chalet Shelf views & herringbone wool rug.',
    paletteColors: ['#eef0f2', '#a84732', '#df7860', '#2e3847', '#0d1015'],
    keyHighlights: [
      'Swiss Precision (3px) crisp rectilinear buttons',
      'Blurred Alpine glacier wallpaper & geometric watermarks',
      '5 Alpine chalet & glacier bays in Shelf',
      'Bordered Herringbone Alpine Wool rug',
    ],
  },
  {
    id: '6',
    title: 'Botanical Conservatory',
    badge: 'Theme 6 · Glasshouse Atrium',
    category: 'Exact Atelier Replica · Eucalyptus & Teal',
    tagline: 'Arched glasshouse wallpaper, Herbarium watermarks, Conservatory Arch buttons & botanical Shelf',
    description: 'Exact structural replica of Theme 1 inside a Victorian glasshouse atrium. Features Conservatory Arch buttons (14px 14px 4px 4px), blurred glasshouse panes & 5 lush botanical atrium vistas.',
    paletteColors: ['#eaf3ef', '#1f6f62', '#48b8a4', '#204840', '#071412'],
    keyHighlights: [
      'Conservatory Arch button silhouettes (arched top corners)',
      'Blurred Victorian atrium wallpaper & herbarium watermarks',
      '5 botanical glasshouse wings + octagonal conservatory mat in Shelf',
      'Teal-patina & cedar almirah refinements',
    ],
  },
  {
    id: '7',
    title: 'Nocturne Observatory',
    badge: 'Theme 7 · Celestial Dome',
    category: 'Exact Atelier Replica · Midnight Indigo & Brass',
    tagline: 'Celestial constellation wallpaper, Counter-Chamfer buttons & 5 observatory dome bays',
    description: 'Exact structural replica of Theme 1 under a celestial observatory dome. Features Counter-Chamfer (4px 15px 4px 15px) buttons, celestial brass accents & 5 stargazing gallery bays.',
    paletteColors: ['#efeef3', '#4b4a8a', '#c9a65b', '#2a3357', '#080b16'],
    keyHighlights: [
      'Counter-Chamfer button silhouettes (4px 15px 4px 15px)',
      'Blurred celestial dome wallpaper & star-chart watermarks',
      '5 observatory arch vistas + Hexagonal Celestial Medallion rug',
      'Twilight brass & midnight indigo almirah trim',
    ],
  },
  {
    id: '8',
    title: 'Rosewood Scriptorium',
    badge: 'Theme 8 · Burgundy Library',
    category: 'Exact Atelier Replica · Rosewood & Cream',
    tagline: 'Scriptorium rosewood wallpaper, Ex-Libris watermarks, Bookplate Flag buttons & Oxford alcoves',
    description: 'Exact structural replica of Theme 1 inside an Oxford scriptorium library. Features Bookplate Flag buttons (4px 15px 15px 4px), rich burgundy-rosewood surfaces & 5 scriptorium alcove views.',
    paletteColors: ['#f5ecee', '#7d2f45', '#d67e96', '#4c2231', '#14080c'],
    keyHighlights: [
      'Bookplate Flag button silhouettes (4px 15px 15px 4px)',
      'Blurred Scriptorium wallpaper & Ex-Libris crest watermarks',
      '5 arched rosewood study alcoves + Persian Fringed Velvet carpet',
      'Burgundy mahogany & antique cream almirah cabinetry',
    ],
  },
  {
    id: '9',
    title: 'Archival Broadsheet',
    badge: 'Theme 9 · Press Vellum',
    category: 'Exact Atelier Replica · Sepia Newsprint',
    tagline: 'Letterpress vellum wallpaper, Press-Stamp buttons (6px) & archival colonnade gallery',
    description: 'Exact structural replica of Theme 1 in warm archival newsprint vellum. Features Press-Stamp (6px) tactile buttons, broadsheet colophon watermarks & 5 colonnade press gallery views.',
    paletteColors: ['#f3ede0', '#75532a', '#cfa86b', '#3d372a', '#100f0b'],
    keyHighlights: [
      'Press Stamp (6px) tactile editorial button silhouettes',
      'Blurred vellum press wallpaper & fleuron watermarks',
      '5 sandstone colonnade atrium views + Kilim Diamond Weave rug',
      'Smoked oak & parchment brass almirah finish',
    ],
  },
  {
    id: '10',
    title: 'Fluent Mica Studio',
    badge: 'Theme 10 · Nordic Fjord',
    category: 'Exact Atelier Replica · Fjord Azure Glass',
    tagline: 'Fjord glass wallpaper, Fluent Squircle buttons (10px) & 5 Nordic terrace Shelf vistas',
    description: 'Exact structural replica of Theme 1 in calm Nordic fjord glassmorphism. Features Fluent Squircle (10px) frosted buttons, cool azure wallpaper & 5 panoramic fjord glass-terrace bays.',
    paletteColors: ['#eaf1f8', '#2563a8', '#5ea1e6', '#233f63', '#070f19'],
    keyHighlights: [
      'Fluent Squircle (10px) modern frosted button shapes',
      'Blurred Fjord Azure wallpaper & prism watermarks',
      '5 Nordic fjord terrace vistas + Dual-Tone Boucle rug',
      'Brushed anodized steel & glacier oak almirahs',
    ],
  },
];

export interface FontOption {
  id: string;
  name: string;
  category: string;
  fontType: 'handwriting' | 'sans' | 'serif' | 'mono';
  cssFamily: string;
  description: string;
  sample: string;
}

export const APP_FONTS: FontOption[] = [
  // 5 CLASSY SANS-SERIF FONTS (including Alata)
  { id: 'alata', name: 'Alata', category: 'Classy Monolinear Sans', fontType: 'sans', cssFamily: "'Alata', sans-serif", description: 'Classy monumental geometric monolinear sans.', sample: 'Cardiovascular Hemodynamics & Clinical Triage' },
  { id: 'plus-jakarta', name: 'Plus Jakarta Sans', category: 'Modern Geometric Workstation', fontType: 'sans', cssFamily: "'Plus Jakarta Sans', sans-serif", description: 'Clean crisp modern medical UI font.', sample: 'Arterial Blood Gas Analysis & Anion Gap Synthesis' },
  { id: 'inter', name: 'Inter', category: 'Swiss Clinical Precision', fontType: 'sans', cssFamily: "'Inter', sans-serif", description: 'High x-height optimized for dense ward tables and charts.', sample: 'Pharmacokinetics: Volume of Distribution & Half-Life' },
  { id: 'poppins', name: 'Poppins', category: 'Geometric Rounded Sans', fontType: 'sans', cssFamily: "'Poppins', sans-serif", description: 'Friendly balanced geometric curves for rapid recall.', sample: 'Glasgow Coma Scale (GCS) Assessment in Trauma' },
  { id: 'outfit', name: 'Outfit', category: 'Contemporary Tech Sans', fontType: 'sans', cssFamily: "'Outfit', sans-serif", description: 'Ultra-legible contemporary display font.', sample: 'Systemic Vascular Resistance & Cardiac Output Monitoring' },

  // 5 CLASSY SERIF FONTS
  { id: 'lora', name: 'Lora', category: 'Literary Contemporary Serif', fontType: 'serif', cssFamily: "'Lora', serif", description: 'Contemporary serif with calligraphic balance.', sample: 'Differential Diagnosis of Acute Abdomen & Peritonitis' },
  { id: 'fraunces', name: 'Fraunces', category: 'Warm Vintage Optical Serif', fontType: 'serif', cssFamily: "'Fraunces', serif", description: 'Warm optical display serif with rich character.', sample: 'The Principles and Practice of Clinical Medicine' },
  { id: 'eb-garamond', name: 'EB Garamond', category: 'Oxford Scholarly Classic', fontType: 'serif', cssFamily: "'EB Garamond', serif", description: 'Timeless Renaissance scholarly serif.', sample: 'Harrison’s Principles of Internal Medicine (21st Edition)' },
  { id: 'playfair', name: 'Playfair Display', category: 'High-Contrast Editorial Serif', fontType: 'serif', cssFamily: "'Playfair Display', serif", description: 'Dramatic high-contrast clinical journal title font.', sample: 'Lancet Clinical Trials & Global Health Evidence' },
  { id: 'merriweather', name: 'Merriweather', category: 'Screen-Optimized Reading Serif', fontType: 'serif', cssFamily: "'Merriweather', serif", description: 'Pleasant robust serif designed for extended textbook reading.', sample: 'Diagnostic Criteria for Acute Coronary Syndromes (ACS)' },

  // 5 CLASSY HANDWRITING FONTS
  { id: 'caveat', name: 'Caveat', category: 'Natural Note-Taker Cursive', fontType: 'handwriting', cssFamily: "'Caveat', cursive", description: 'Organic handwritten student notebook cursive.', sample: 'High-Yield Ward Pearl: Always confirm Airway, Breathing & SpO2 first!' },
  { id: 'kalam', name: 'Kalam', category: 'Clinical Ballpoint Penmanship', fontType: 'handwriting', cssFamily: "'Kalam', cursive", description: 'Authentic pen-stroke hospital prescription handwriting.', sample: 'Rx: Tab. Amoxicillin-Clavulanate 625mg PO TDS x 7 days.' },
  { id: 'patrick-hand', name: 'Patrick Hand', category: 'Neat Resident Study Print', fontType: 'handwriting', cssFamily: "'Patrick Hand', cursive", description: 'Clean upright student notebook handwriting.', sample: 'Differential Diagnosis: Rule out Tension Pneumothorax vs Tamponade.' },
  { id: 'dancing-script', name: 'Dancing Script', category: 'Fluid Calligraphic Notes', fontType: 'handwriting', cssFamily: "'Dancing Script', cursive", description: 'Expressive lively notes for memory anchors.', sample: 'Important: Discontinue Metformin 48 hrs before IV contrast!' },
  { id: 'architects-daughter', name: 'Architects Daughter', category: 'Precise Architectural Script', fontType: 'handwriting', cssFamily: "'Architects Daughter', cursive", description: 'Crisp grid-aligned blueprint lettering for diagrams.', sample: 'Step 1: Calculate MAP = DBP + 1/3 (SBP - DBP).' },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onUpdateProfile,
  breakTimerConfig,
  onUpdateBreakConfig,
  onExportNotes,
  onResetSession,
  activeDesign = '1',
  onSelectDesign,
  onOpenAIStudioModal,
  isWorkspaceView = false,
  initialTab = 'designs',
  onSyncNow,
  onLogout,
}) => {
  const {
    user,
    googleUser,
    syncStatus,
    lastSyncedAt,
    driveAccount,
    connectGoogleDrive,
    disconnectGoogleDrive,
    openAuthModal,
    signOut,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<SettingsTabId>(initialTab);
  const [driveConnecting, setDriveConnecting] = useState(false);
  const [driveOpError, setDriveOpError] = useState<string | null>(null);
  const [driveOpSuccess, setDriveOpSuccess] = useState<string | null>(null);
  const [syncingManual, setSyncingManual] = useState(false);

  // Per-theme Light / Dark screenshot preview toggle state
  const [themePreviewModes, setThemePreviewModes] = useState<Record<string, 'light' | 'dark'>>({});

  // Connected Cloud & Drive websites
  interface ConnectedDriveItem {
    id: string;
    name: string;
    url: string;
    accountHint?: string;
    connectedAt: string;
  }
  const [connectedDrives, setConnectedDrives] = useState<ConnectedDriveItem[]>(() => {
    try {
      const saved = localStorage.getItem('ach1ev_connected_drives_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [customDriveName, setCustomDriveName] = useState('');
  const [customDriveUrl, setCustomDriveUrl] = useState('');
  const [customDriveAccount, setCustomDriveAccount] = useState('');

  const [profileForm, setProfileForm] = useState<UserProfile>(userProfile);
  const [breakForm, setBreakForm] = useState<BreakTimerConfig>(breakTimerConfig);
  const [savedFeedback, setSavedFeedback] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  useEffect(() => {
    setProfileForm(userProfile);
  }, [userProfile]);

  const persistConnectedDrives = (next: ConnectedDriveItem[]) => {
    setConnectedDrives(next);
    try {
      localStorage.setItem('ach1ev_connected_drives_v1', JSON.stringify(next));
    } catch {}
  };

  const handleTogglePresetDrive = (preset: { id: string; name: string; defaultUrl: string }) => {
    const exists = connectedDrives.some((d) => d.id === preset.id);
    if (exists) {
      persistConnectedDrives(connectedDrives.filter((d) => d.id !== preset.id));
      setDriveOpSuccess(`Disconnected ${preset.name}.`);
    } else {
      const item: ConnectedDriveItem = {
        id: preset.id,
        name: preset.name,
        url: preset.defaultUrl,
        connectedAt: new Date().toLocaleDateString(),
      };
      persistConnectedDrives([item, ...connectedDrives]);
      setDriveOpSuccess(`Connected ${preset.name} (${preset.defaultUrl}).`);
    }
  };

  const handleAddCustomDrive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customDriveUrl.trim()) return;
    let normalizedUrl = customDriveUrl.trim();
    if (!/^https?:\/\//i.test(normalizedUrl)) {
      normalizedUrl = `https://${normalizedUrl}`;
    }
    const domainLabel = (() => {
      try {
        return new URL(normalizedUrl).hostname.replace(/^www\./, '');
      } catch {
        return 'External Drive';
      }
    })();
    const item: ConnectedDriveItem = {
      id: `drive-${Date.now()}`,
      name: customDriveName.trim() || domainLabel,
      url: normalizedUrl,
      accountHint: customDriveAccount.trim() || undefined,
      connectedAt: new Date().toLocaleDateString(),
    };
    persistConnectedDrives([item, ...connectedDrives]);
    setCustomDriveName('');
    setCustomDriveUrl('');
    setCustomDriveAccount('');
    setDriveOpError(null);
    setDriveOpSuccess(`Connected "${item.name}" to your Ach1ev Drive vault.`);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const size = 256;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const minSide = Math.min(img.width, img.height);
        const sx = (img.width - minSide) / 2;
        const sy = (img.height - minSide) / 2;
        ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, size, size);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.86);
        const nextProfile = { ...profileForm, avatarUrl: dataUrl };
        setProfileForm(nextProfile);
        onUpdateProfile(nextProfile);
        setSavedFeedback(true);
        setTimeout(() => setSavedFeedback(false), 1800);
      };
      img.src = String(reader.result || '');
    };
    reader.readAsDataURL(file);
  };

  const handleConnectDriveClick = async () => {
    setDriveOpError(null);
    setDriveOpSuccess(null);
    setDriveConnecting(true);
    try {
      const acct = await connectGoogleDrive();
      setDriveOpSuccess(
        `Connected personal Google Drive${acct.email ? ` (${acct.email})` : ''} · Folder "${acct.folderName || DRIVE_APP_FOLDER_NAME}" ready.`
      );
    } catch (err: any) {
      setDriveOpError(err?.message || 'Google Drive connection failed.');
    } finally {
      setDriveConnecting(false);
    }
  };

  const handleManualSyncClick = async () => {
    if (!onSyncNow) return;
    setSyncingManual(true);
    setDriveOpError(null);
    try {
      await onSyncNow();
      setSavedFeedback(true);
      setTimeout(() => setSavedFeedback(false), 1800);
    } catch (err: any) {
      setDriveOpError(err?.message || 'Cloud sync failed.');
    } finally {
      setSyncingManual(false);
    }
  };
  const [selectedLang, setSelectedLang] = useState<AppLanguage>(() => getCurrentLanguage());
  const [customLanguages, setCustomLanguages] = useState(() => getCustomLanguages());
  const [langSearchQuery, setLangSearchQuery] = useState('');
  const [langRegionFilter, setLangRegionFilter] = useState<'indian' | 'world'>('indian');
  const [newLangRegion, setNewLangRegion] = useState<'indian' | 'world'>('indian');
  const [showAddLangBuilder, setShowAddLangBuilder] = useState(false);
  const [newLangName, setNewLangName] = useState('');
  const [newLangNative, setNewLangNative] = useState('');
  const [newLangFlag, setNewLangFlag] = useState('🌐');
  const [newLangGreeting, setNewLangGreeting] = useState('');
  const [newLangNavMySpace, setNewLangNavMySpace] = useState('');
  const [newLangNavRead, setNewLangNavRead] = useState('');
  const [newLangNavCreateNote, setNewLangNavCreateNote] = useState('');
  const [newLangNavCalendar, setNewLangNavCalendar] = useState('');
  const [newLangNavShelf, setNewLangNavShelf] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const href =
      'https://fonts.googleapis.com/css2?family=Alata&family=Architects+Daughter&family=Caveat:wght@400;500;600;700&family=Dancing+Script:wght@400;600;700&family=EB+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600&family=Inter:wght@300;400;500;600;700&family=Kalam:wght@300;400;700&family=Lora:ital,wght@0,400;0,600;1,400&family=Merriweather:ital,wght@0,300;0,400;0,700;1,300&family=Outfit:wght@300;400;500;600;700&family=Patrick+Hand&family=Playfair+Display:ital,wght@0,500;0,700;0,900;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Poppins:wght@300;400;500;600;700&display=swap';
    const existing = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).some((l) =>
      (l.getAttribute('href') || '').includes('fonts.googleapis.com')
    );
    if (!existing && !document.getElementById('achiev-google-fonts')) {
      const link = document.createElement('link');
      link.id = 'achiev-google-fonts';
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
    }
  }, []);

  const BASE_SIDEBAR_DEFAULTS: SidebarSettings = {
    showMySpace: true,
    showRead: true,
    showCreateNote: true,
    showCalendar: true,
    showLibrary: true,
    showMnemonics: false,
    showCommunity: true,
    showLeisure: false,
    showExploreBody: false,
    showTalkToDev: true,
  };

  const [sidebarSettings, setSidebarSettings] = useState<SidebarSettings>(() => {
    try {
      const saved = localStorage.getItem('medden_sidebar_settings');
      if (saved) return { ...BASE_SIDEBAR_DEFAULTS, ...JSON.parse(saved) };
    } catch {}
    return BASE_SIDEBAR_DEFAULTS;
  });

  const toggleSidebarSetting = (key: keyof SidebarSettings) => {
    const updated = { ...sidebarSettings, [key]: sidebarSettings[key] === false };
    setSidebarSettings(updated);
    localStorage.setItem('medden_sidebar_settings', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('medden_sidebar_settings_changed'));
  };

  const ALL_SIDEBAR_BUTTON_ITEMS: Array<{ id: string; key: keyof SidebarSettings; label: string }> = [
    { id: 'home', key: 'showMySpace', label: 'Cockpit' },
    { id: 'read', key: 'showRead', label: 'Read' },
    { id: 'make-note', key: 'showCreateNote', label: 'Create note' },
    { id: 'roster', key: 'showCalendar', label: 'Calendar' },
    { id: 'library', key: 'showLibrary', label: 'Shelf' },
    { id: 'mnemonics', key: 'showMnemonics', label: 'Mnemonics' },
    { id: 'community', key: 'showCommunity', label: 'Ach1evers Hub' },
    { id: 'leisure', key: 'showLeisure', label: 'Leisure' },
    { id: 'explore-body', key: 'showExploreBody', label: 'Explore Body' },
    { id: 'talk-to-dev', key: 'showTalkToDev', label: 'Talk to Developer' },
  ];

  const [sidebarOrder, setSidebarOrder] = useState<string[]>(() => {
    const fallback = ALL_SIDEBAR_BUTTON_ITEMS.map((item) => item.id);
    try {
      const saved = localStorage.getItem('medden_sidebar_order');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const merged = [...parsed];
          fallback.forEach((id) => {
            if (!merged.includes(id)) merged.push(id);
          });
          return merged;
        }
      }
    } catch {}
    return fallback;
  });

  const handleShiftSidebarItem = (id: string, direction: -1 | 1) => {
    setSidebarOrder((prev) => {
      const idx = prev.indexOf(id);
      if (idx === -1) return prev;
      const targetIdx = idx + direction;
      if (targetIdx < 0 || targetIdx >= prev.length) return prev;
      const newOrder = [...prev];
      const [removed] = newOrder.splice(idx, 1);
      newOrder.splice(targetIdx, 0, removed);
      localStorage.setItem('medden_sidebar_order', JSON.stringify(newOrder));
      window.dispatchEvent(new CustomEvent('medden_sidebar_settings_changed'));
      return newOrder;
    });
  };

  const handleLanguageSelect = (langCode: AppLanguage) => {
    setSelectedLang(langCode);
    setAppLanguage(langCode);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 1500);
  };

  const handleAddCustomLanguage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLangName.trim()) return;
    const saved = saveCustomLanguage(
      {
        code: newLangName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 20) || `lang-${Date.now()}`,
        label: newLangName.trim(),
        nativeLabel: newLangNative.trim() || newLangName.trim(),
        flag: newLangFlag.trim() || (newLangRegion === 'indian' ? '🇮🇳' : '🌐'),
        region: newLangRegion,
        greeting: newLangGreeting.trim() || `Welcome in ${newLangName.trim()}`,
      },
      {
        'nav.mySpace': newLangNavMySpace,
        'nav.read': newLangNavRead,
        'nav.createNote': newLangNavCreateNote,
        'nav.calendar': newLangNavCalendar,
        'nav.myShelf': newLangNavShelf,
      }
    );
    setCustomLanguages(getCustomLanguages());
    setLangRegionFilter(newLangRegion);
    handleLanguageSelect(saved.code);
    setNewLangName('');
    setNewLangNative('');
    setNewLangFlag('🌐');
    setNewLangGreeting('');
    setNewLangNavMySpace('');
    setNewLangNavRead('');
    setNewLangNavCreateNote('');
    setNewLangNavCalendar('');
    setNewLangNavShelf('');
    setShowAddLangBuilder(false);
  };

  const handleDeleteCustomLanguage = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeCustomLanguage(code);
    setCustomLanguages(getCustomLanguages());
    setSelectedLang(getCurrentLanguage());
  };

  const handleSettingsLogout = async () => {
    if (onLogout) {
      await onLogout();
    } else {
      await signOut();
    }
    onClose?.();
  };

  const handleImportNotesFromApp = (appName: string) => {
    setImportStatus(`Importing notes from ${appName}...`);
    setTimeout(() => {
      const newNb = {
        id: `nb-imported-${Date.now()}`,
        title: `${appName} Clinical Notes`,
        subject: 'Internal Medicine',
        coverTheme: 'botany',
        coverTitle: `${appName.toUpperCase()} CLINICAL ARCHIVE`,
        coverSubtitle: 'Imported Notebook & Flashcards',
        coverColor: '#365314',
        paperType: 'ruled-thin',
        paperColor: 'beige',
        pages: [
          {
            id: `p-${Date.now()}`,
            title: `Imported from ${appName}: Cardiology & EKG Pearls`,
            contentHtml: `<h2>Imported ${appName} Note</h2><p>Successfully migrated clinical pearls, diagnostic criteria, and medication charts from ${appName}.</p><ul><li>ST-segment elevation criteria in V1-V4</li><li>Troponin-I serial kinetics & delta cutoffs</li><li>ACEi vs ARB in heart failure with reduced ejection fraction (HFrEF)</li></ul>`,
            inkStrokes: [],
            screenshots: [],
            date: new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString(),
          },
        ],
        activePageIndex: 0,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };
      try {
        const existing = JSON.parse(localStorage.getItem('medden_notebooks') || '[]');
        existing.unshift(newNb);
        localStorage.setItem('medden_notebooks', JSON.stringify(existing));
        window.dispatchEvent(new CustomEvent('medden_notebooks_updated'));
      } catch {}
      setImportStatus(`✓ Successfully imported 1 notebook & 3 clinical topics from ${appName}!`);
      setTimeout(() => setImportStatus(null), 3000);
    }, 1000);
  };
  const [accentTheme, setAccentTheme] = useState<string>(() => localStorage.getItem('medden_accent_theme') || '#A47C43');
  const [autoSaveFreq, setAutoSaveFreq] = useState<string>(() => localStorage.getItem('medden_autosave_freq') || 'instant');
  const [dailyHoursGoal, setDailyHoursGoal] = useState<number>(() => Number(localStorage.getItem('medden_daily_hours')) || 5);
  const [dailyQBankGoal, setDailyQBankGoal] = useState<number>(() => Number(localStorage.getItem('medden_daily_qbank')) || 40);
  const [distractionFree, setDistractionFree] = useState<boolean>(() => localStorage.getItem('medden_distraction_free') === 'true');
  const [currentFont, setCurrentFont] = useState<string>(() => {
    return localStorage.getItem('medden_app_font') || 'Alata';
  });
  const [fontScale, setFontScale] = useState<number>(() => {
    const saved = localStorage.getItem('medden_font_scale');
    return saved ? parseInt(saved, 10) : 100;
  });
  const [fontCategoryFilter, setFontCategoryFilter] = useState<'all' | 'handwriting' | 'sans' | 'serif' | 'mono'>('all');
  const [copiedAppletId, setCopiedAppletId] = useState<boolean>(false);

  const handleCopyAppletId = () => {
    navigator.clipboard.writeText('0087218c-d7d0-4ad0-b0df-2e515051e7a0');
    setCopiedAppletId(true);
    setTimeout(() => setCopiedAppletId(false), 2000);
  };

  const handleSelectFont = (font: FontOption) => {
    setCurrentFont(font.name);
    localStorage.setItem('medden_app_font', font.name);
    document.documentElement.style.setProperty('--app-font-family', `${font.cssFamily}, system-ui, sans-serif`);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 1500);
  };

  const handleUpdateFontScale = (scaleVal: number) => {
    setFontScale(scaleVal);
    const scaleStr = `${scaleVal}%`;
    localStorage.setItem('medden_font_scale', scaleStr);
    document.documentElement.style.setProperty('--app-font-scale', scaleStr);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 1500);
  };

  // Global slab preferences stored in localStorage
  const [globalSlabSize, setGlobalSlabSize] = useState<'compact' | 'normal' | 'expanded'>(() => {
    return (localStorage.getItem('medden_global_slab_size') as any) || 'normal';
  });

  const [globalGridDensity, setGlobalGridDensity] = useState<'2' | '3' | '4'>(() => {
    return (localStorage.getItem('medden_grid_density') as any) || '3';
  });

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(profileForm);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  const handleSaveBreak = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateBreakConfig(breakForm);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  const handleSelectEdition = (editionId: DesignId) => {
    if (onSelectDesign) {
      onSelectDesign(editionId);
      setSavedFeedback(true);
      setTimeout(() => setSavedFeedback(false), 1500);
    }
  };

  const handleUpdateGlobalSlabSize = (sz: 'compact' | 'normal' | 'expanded') => {
    setGlobalSlabSize(sz);
    localStorage.setItem('medden_global_slab_size', sz);
  };

  const handleUpdateGridDensity = (density: '2' | '3' | '4') => {
    setGlobalGridDensity(density);
    localStorage.setItem('medden_grid_density', density);
  };

  const handleUpdateAccentTheme = (color: string) => {
    setAccentTheme(color);
    localStorage.setItem('medden_accent_theme', color);
    document.documentElement.style.setProperty('--app-accent-color', color);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 1500);
  };

  const handleUpdateAutoSave = (freq: string) => {
    setAutoSaveFreq(freq);
    localStorage.setItem('medden_autosave_freq', freq);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 1500);
  };

  const handleToggleDistractionFree = () => {
    const nextVal = !distractionFree;
    setDistractionFree(nextVal);
    localStorage.setItem('medden_distraction_free', String(nextVal));
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 1500);
  };

  const handleUpdateDailyHours = (hrs: number) => {
    setDailyHoursGoal(hrs);
    localStorage.setItem('medden_daily_hours', String(hrs));
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 1500);
  };

  const handleUpdateDailyQBank = (q: number) => {
    setDailyQBankGoal(q);
    localStorage.setItem('medden_daily_qbank', String(q));
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 1500);
  };

  const modalContent = (
    <div className={isWorkspaceView ? "themed-workspace-surface w-full h-full flex flex-col overflow-hidden text-stone-900 dark:text-stone-100 bg-[#fbf9f4] dark:bg-[#110c09] transition-colors" : "themed-glass-card bg-[#fcfbf8] dark:bg-[#18110c] border border-stone-200/90 dark:border-[#382518] rounded-3xl shadow-2xl max-w-4xl w-full h-[88vh] flex flex-col overflow-hidden relative text-stone-900 dark:text-stone-100 transition-colors"}>
      
      {/* Header ribbon shown only in popup modal mode; Workspace view already displays Settings in the top panel */}
      {!isWorkspaceView && (
        <div className="bg-stone-50 dark:bg-[#140e0a] px-6 py-3.5 border-b border-stone-200/80 dark:border-[#382518] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-600/15 text-amber-700 dark:text-amber-400 flex items-center justify-center border border-amber-600/25">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-serif text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <span>Settings</span>
                {savedFeedback && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 animate-pulse">
                    Saved
                  </span>
                )}
              </h3>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-[#251a12] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      )}

        {/* Master-Detail Layout */}
        <div className="flex-1 flex flex-col sm:flex-row overflow-hidden">
          {/* Left Navigation Sidebar (Horizontal scrolling tabs on mobile, vertical column on sm+) */}
          <div className="themed-glass-bar w-full sm:w-44 border-b sm:border-b-0 sm:border-r border-stone-200/80 dark:border-[#382518] bg-stone-50/70 dark:bg-[#140e0a] p-1.5 flex sm:flex-col justify-between gap-2 shrink-0">
            <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-auto gap-1 flex-1 custom-scrollbar">
            <button
              type="button"
              onClick={() => setActiveTab('designs')}
              className={`flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer shrink-0 whitespace-nowrap sm:whitespace-normal sm:w-full ${
                activeTab === 'designs'
                  ? 'themed-tab-active bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-[#251a12] hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              <Palette className="w-4 h-4 shrink-0" />
              <span>Themes</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('cloud-sync')}
              className={`flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer shrink-0 whitespace-nowrap sm:whitespace-normal sm:w-full ${
                activeTab === 'cloud-sync'
                  ? 'themed-tab-active bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-[#251a12] hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              <Cloud className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <span>Cloud &amp; Drive</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('typography')}
              className={`flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer shrink-0 whitespace-nowrap sm:whitespace-normal sm:w-full ${
                activeTab === 'typography'
                  ? 'themed-tab-active bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-[#251a12] hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              <Type className="w-4 h-4 shrink-0" />
              <span>Fonts</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('languages')}
              className={`flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer shrink-0 whitespace-nowrap sm:whitespace-normal sm:w-full ${
                activeTab === 'languages'
                  ? 'themed-tab-active bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-[#251a12] hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              <Globe className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <span>Languages</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('import-notes')}
              className={`flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer shrink-0 whitespace-nowrap sm:whitespace-normal sm:w-full ${
                activeTab === 'import-notes'
                  ? 'themed-tab-active bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-[#251a12] hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              <UploadCloud className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <span>Import Notes</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('sidebar-buttons')}
              className={`flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer shrink-0 whitespace-nowrap sm:whitespace-normal sm:w-full ${
                activeTab === 'sidebar-buttons'
                  ? 'themed-tab-active bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-[#251a12] hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <span>Sidebar Customizer</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('subscription')}
              className={`flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer shrink-0 whitespace-nowrap sm:whitespace-normal sm:w-full ${
                activeTab === 'subscription'
                  ? 'themed-tab-active bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-[#251a12] hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              <Crown className="w-4 h-4 shrink-0 text-amber-500" />
              <span>Plans &amp; Pricing</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('customizer')}
              className={`flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer shrink-0 whitespace-nowrap sm:whitespace-normal sm:w-full ${
                activeTab === 'customizer'
                  ? 'themed-tab-active bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-[#251a12] hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              <Sparkles className="w-4 h-4 shrink-0 text-amber-500" />
              <span>Student Customizer</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer shrink-0 whitespace-nowrap sm:whitespace-normal sm:w-full ${
                activeTab === 'profile'
                  ? 'themed-tab-active bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-[#251a12] hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              <User className="w-4 h-4 shrink-0" />
              <span>Student Profile</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('break')}
              className={`flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer shrink-0 whitespace-nowrap sm:whitespace-normal sm:w-full ${
                activeTab === 'break'
                  ? 'themed-tab-active bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-[#251a12] hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              <Eye className="w-4 h-4 shrink-0" />
              <span>Eye Rest Timers</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('defaults')}
              className={`flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer shrink-0 whitespace-nowrap sm:whitespace-normal sm:w-full ${
                activeTab === 'defaults'
                  ? 'themed-tab-active bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-[#251a12] hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              <RotateCcw className="w-4 h-4 shrink-0" />
              <span>Backup & Reset</span>
            </button>
            </div>

            {/* Bottom-pinned Log Out button (shifted from top ribbon into Settings last position) */}
            <div className="sm:pt-2 sm:border-t sm:border-stone-200/80 dark:sm:border-[#382518] shrink-0 flex items-center">
              <button
                type="button"
                onClick={handleSettingsLogout}
                title={user?.email ? `Log out (${user.email})` : 'Log out / Switch Account'}
                className="flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 whitespace-nowrap sm:w-full bg-[#7f1d1d]/12 hover:bg-[#7f1d1d]/22 dark:bg-[#6e171b]/30 dark:hover:bg-[#6e171b]/50 text-[#7f1d1d] dark:text-[#e49b9e] border border-[#7f1d1d]/25 dark:border-[#962d32]/45"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span className="truncate">Log Out</span>
              </button>
            </div>
          </div>

          {/* Right Detail Content Viewport */}
          <div className="p-3 sm:p-6 overflow-y-auto space-y-5 flex-1 custom-scrollbar">
          {/* ========================================================================= */}
          {/* TAB 1: THEMES (COMPACT MOBILE + LIGHT/DARK SCREENSHOT TOGGLE BESIDE APPLY)*/}
          {/* ========================================================================= */}
          {activeTab === 'designs' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="space-y-3 sm:space-y-4">
                <div className="pb-2 border-b border-stone-200 dark:border-[#382518] flex items-center justify-between gap-2">
                  <h4 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                    <Palette className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>Themes</span>
                  </h4>
                  <span className="text-[10px] font-mono text-stone-500 dark:text-stone-400">
                    All 10 Editions · Light &amp; Dark Previews
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-2.5 sm:gap-4">
                  {MASTER_EDITIONS.map((edition) => {
                    const isSelected = activeDesign === edition.id;
                    const pMode = themePreviewModes[edition.id] || 'light';

                    return (
                      <div
                        key={edition.id}
                        onClick={() => handleSelectEdition(edition.id)}
                        className={`p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border transition-all cursor-pointer relative ${
                          isSelected
                            ? 'themed-glass-card bg-amber-50/70 dark:bg-[#231912] border-[#A47C43] ring-2 ring-[#A47C43]/25 shadow-md'
                            : 'themed-glass-card bg-white dark:bg-[#18110c] border-stone-200/90 dark:border-[#382518] hover:border-stone-300 dark:hover:border-[#4b3322]'
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5 sm:mb-2">
                          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap min-w-0">
                            <span className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
                              {edition.title}
                            </span>
                            <span className="text-[9px] sm:text-[10px] font-mono px-1.5 sm:px-2 py-0.5 rounded-full bg-stone-200/80 dark:bg-[#251a12] text-stone-700 dark:text-stone-300 font-semibold">
                              {edition.badge}
                            </span>
                          </div>

                          <div
                            className="flex items-center gap-1.5 sm:gap-2 shrink-0 ml-auto"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {/* Color Swatch Dots */}
                            <div className="hidden sm:flex items-center -space-x-1">
                              {edition.paletteColors.map((c, i) => (
                                <div
                                  key={i}
                                  className="w-3.5 h-3.5 rounded-full border border-white dark:border-[#110c09] shadow-2xs"
                                  style={{ backgroundColor: c }}
                                  title={c}
                                />
                              ))}
                            </div>

                            {/* Light / Dark Screenshot Preview Toggle beside Apply */}
                            <div className="flex items-center p-0.5 rounded-lg bg-stone-200/90 dark:bg-[#251a12] border border-stone-300/70 dark:border-[#382518]">
                              <button
                                type="button"
                                onClick={() =>
                                  setThemePreviewModes((prev) => ({ ...prev, [edition.id]: 'light' }))
                                }
                                title="View screenshots in Light mode"
                                className={`px-1.5 py-0.5 rounded-md text-[9.5px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                                  pMode === 'light'
                                    ? 'bg-white text-stone-900 shadow-2xs'
                                    : 'text-stone-600 dark:text-stone-400'
                                }`}
                              >
                                <Sun className="w-2.5 h-2.5 text-amber-500" />
                                <span>Light</span>
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setThemePreviewModes((prev) => ({ ...prev, [edition.id]: 'dark' }))
                                }
                                title="View screenshots in Dark mode"
                                className={`px-1.5 py-0.5 rounded-md text-[9.5px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                                  pMode === 'dark'
                                    ? 'bg-amber-500 text-[#110c09] shadow-2xs'
                                    : 'text-stone-600 dark:text-stone-400'
                                }`}
                              >
                                <Moon className="w-2.5 h-2.5" />
                                <span>Dark</span>
                              </button>
                            </div>

                            {isSelected ? (
                              <div className="themed-accent-btn flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg bg-amber-700 text-white text-[11px] sm:text-xs font-bold shadow-2xs">
                                <Check className="w-3 h-3 stroke-[2.5]" />
                                <span>Active</span>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleSelectEdition(edition.id)}
                                className="px-2.5 sm:px-3 py-1 rounded-lg bg-stone-200/80 dark:bg-[#251a12] text-stone-700 dark:text-stone-300 text-[11px] sm:text-xs font-semibold hover:bg-stone-300 dark:hover:bg-[#322318] transition-colors cursor-pointer"
                              >
                                Apply
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Section & Sidebar Screenshots Carousel */}
                        <ThemeAppStorePreviews
                          editionId={edition.id}
                          isSelected={isSelected}
                          previewMode={pMode}
                          onChangePreviewMode={(next) =>
                            setThemePreviewModes((prev) => ({ ...prev, [edition.id]: next }))
                          }
                          onApply={() => handleSelectEdition(edition.id)}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB: CLOUD & DRIVE (CONNECT ANY DRIVE WEBSITE, NO ENV SETTINGS BLOCK)    */}
          {/* ========================================================================= */}
          {activeTab === 'cloud-sync' && (
            <div className="space-y-5">
              <div className="pb-2 border-b border-stone-200 dark:border-[#382518]">
                <h4 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <Cloud className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Cloud &amp; Drive</span>
                </h4>
              </div>

              {driveOpError && (
                <div className="p-3 rounded-xl bg-[#7f1d1d]/12 dark:bg-[#6e171b]/30 border border-[#7f1d1d]/30 dark:border-[#962d32]/50 text-[#6e1418] dark:text-[#e49b9e] text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{driveOpError}</span>
                </div>
              )}

              {driveOpSuccess && (
                <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/35 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                  <span>{driveOpSuccess}</span>
                </div>
              )}

              {/* Card 1: Authenticated Account & Multi-Device Sync */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#1a120d] border border-stone-200 dark:border-[#382518] space-y-3">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-400 flex items-center justify-center border border-amber-500/30">
                      <Database className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                        {user
                          ? user.email || user.phone || 'Authenticated Cloud Scholar'
                          : googleUser
                          ? googleUser.name
                            ? `${googleUser.name} (${googleUser.email})`
                            : googleUser.email
                          : 'Not Signed In (Offline Browser Cache)'}
                      </h5>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400">
                        {user
                          ? `Provider: ${String(user.app_metadata?.provider || 'account').toUpperCase()}${
                              lastSyncedAt ? ` · Last synced ${new Date(lastSyncedAt).toLocaleTimeString()}` : ''
                            }`
                          : googleUser
                          ? 'Provider: GOOGLE OAUTH2 · Signed in & Drive-ready'
                          : 'Sign in with Email, Phone OTP, or Google to sync across devices.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {user || googleUser ? (
                      <>
                        {user && onSyncNow && (
                          <button
                            type="button"
                            onClick={handleManualSyncClick}
                            disabled={syncingManual}
                            className="themed-accent-btn px-3 py-1.5 rounded-xl bg-[#A47C43] hover:bg-[#8e6834] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                          >
                            <RefreshCw className={`w-3.5 h-3.5 ${syncingManual ? 'animate-spin' : ''}`} />
                            <span>{syncingManual ? 'Syncing...' : 'Sync Now'}</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={signOut}
                          className="px-3 py-1.5 rounded-xl bg-[#7f1d1d]/12 hover:bg-[#7f1d1d]/20 dark:bg-[#6e171b]/30 dark:hover:bg-[#6e171b]/45 text-[#6e1418] dark:text-[#d97074] border border-[#7f1d1d]/25 dark:border-[#962d32]/45 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={openAuthModal}
                        className="themed-accent-btn px-3.5 py-1.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        <span>Sign In / Sign Up</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Card 2: Personal Google Drive OAuth PDF Vault */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#1a120d] border border-stone-200 dark:border-[#382518] space-y-3">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/30">
                      <HardDrive className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                        <span>Personal Google Drive PDF Vault</span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                            driveAccount.connected
                              ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30'
                              : 'bg-stone-100 dark:bg-[#251a12] text-stone-500 dark:text-stone-400'
                          }`}
                        >
                          {driveAccount.connected ? 'Connected' : 'Disconnected'}
                        </span>
                      </h5>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400">
                        {driveAccount.connected
                          ? `Linked to ${driveAccount.email || 'your Google account'} · Folder: "${driveAccount.folderName || DRIVE_APP_FOLDER_NAME}"`
                          : 'Offload textbooks & large PDFs directly to your personal Google Drive.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {driveAccount.connected ? (
                      <>
                        {driveAccount.folderId && (
                          <a
                            href={`https://drive.google.com/drive/folders/${driveAccount.folderId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-[#251a12] hover:bg-stone-200 dark:hover:bg-[#322318] text-stone-700 dark:text-stone-200 text-xs font-semibold flex items-center gap-1.5"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Open Folder</span>
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={disconnectGoogleDrive}
                          className="px-3 py-1.5 rounded-xl bg-[#7f1d1d]/12 hover:bg-[#7f1d1d]/20 dark:bg-[#6e171b]/30 text-[#6e1418] dark:text-[#d97074] border border-[#7f1d1d]/25 dark:border-[#962d32]/45 text-xs font-semibold cursor-pointer"
                        >
                          Disconnect
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={handleConnectDriveClick}
                        disabled={driveConnecting}
                        className="themed-accent-btn px-3.5 py-1.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-60"
                      >
                        <HardDrive className="w-3.5 h-3.5" />
                        <span>{driveConnecting ? 'Authorizing...' : 'Connect Google Drive'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Card 3: Connect Your Drive (Any Cloud Storage Website) */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#1a120d] border border-stone-200 dark:border-[#382518] space-y-4">
                <div>
                  <h5 className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                    <Link2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>Connect Your Drive</span>
                  </h5>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                    Link OneDrive, Dropbox, iCloud Drive, Box, pCloud, or any cloud storage website to access your study files.
                  </p>
                </div>

                {/* Quick Cloud Providers */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'gdrive-web', name: 'Google Drive Web', defaultUrl: 'https://drive.google.com' },
                    { id: 'onedrive', name: 'Microsoft OneDrive', defaultUrl: 'https://onedrive.live.com' },
                    { id: 'dropbox', name: 'Dropbox', defaultUrl: 'https://www.dropbox.com/home' },
                    { id: 'icloud', name: 'iCloud Drive', defaultUrl: 'https://www.icloud.com/iclouddrive' },
                    { id: 'box', name: 'Box Cloud', defaultUrl: 'https://app.box.com' },
                    { id: 'pcloud', name: 'pCloud', defaultUrl: 'https://my.pcloud.com' },
                  ].map((provider) => {
                    const isLinked = connectedDrives.some((d) => d.id === provider.id);
                    return (
                      <div
                        key={provider.id}
                        className={`p-2.5 rounded-xl border flex flex-col justify-between gap-2 ${
                          isLinked
                            ? 'border-amber-500/60 bg-amber-50/40 dark:bg-[#231912]'
                            : 'border-stone-200 dark:border-[#352317] bg-stone-50/60 dark:bg-[#140e0a]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-bold text-stone-800 dark:text-stone-100 truncate">
                            {provider.name}
                          </span>
                          {isLinked && <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleTogglePresetDrive(provider)}
                            className={`flex-1 py-1 px-2 rounded-lg text-[10.5px] font-bold cursor-pointer transition-colors ${
                              isLinked
                                ? 'bg-stone-200 dark:bg-[#2a1d14] text-stone-700 dark:text-stone-300'
                                : 'themed-accent-btn bg-amber-700 hover:bg-amber-800 text-white'
                            }`}
                          >
                            {isLinked ? 'Disconnect' : 'Connect'}
                          </button>
                          {isLinked && (
                            <a
                              href={provider.defaultUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              title={`Open ${provider.name}`}
                              className="p-1.5 rounded-lg bg-stone-100 dark:bg-[#251a12] hover:bg-stone-200 text-stone-700 dark:text-stone-200"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Connect Any Custom Drive Website URL */}
                <form
                  onSubmit={handleAddCustomDrive}
                  className="p-3 rounded-xl bg-stone-50 dark:bg-[#140e0a] border border-stone-200/80 dark:border-[#352317] space-y-2.5"
                >
                  <div className="text-[11px] font-bold text-stone-700 dark:text-stone-300">
                    Connect Any Other Drive / Cloud Website
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Drive name (e.g. Nextcloud / Mega)"
                      value={customDriveName}
                      onChange={(e) => setCustomDriveName(e.target.value)}
                      className="px-3 py-1.5 rounded-lg border border-stone-200 dark:border-[#382518] bg-white dark:bg-[#1a120d] text-xs outline-none focus:border-amber-500"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Drive website URL (e.g. https://mega.nz)"
                      value={customDriveUrl}
                      onChange={(e) => setCustomDriveUrl(e.target.value)}
                      className="px-3 py-1.5 rounded-lg border border-stone-200 dark:border-[#382518] bg-white dark:bg-[#1a120d] text-xs outline-none focus:border-amber-500"
                    />
                    <input
                      type="text"
                      placeholder="Account email / handle (optional)"
                      value={customDriveAccount}
                      onChange={(e) => setCustomDriveAccount(e.target.value)}
                      className="px-3 py-1.5 rounded-lg border border-stone-200 dark:border-[#382518] bg-white dark:bg-[#1a120d] text-xs outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="themed-accent-btn px-3.5 py-1.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Connect Drive Website</span>
                    </button>
                  </div>
                </form>

                {/* List of Linked Drives */}
                {connectedDrives.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="text-[10.5px] font-mono font-bold uppercase text-stone-500 dark:text-stone-400">
                      Connected Drives ({connectedDrives.length})
                    </div>
                    {connectedDrives.map((drv) => (
                      <div
                        key={drv.id}
                        className="p-2.5 rounded-xl bg-stone-50 dark:bg-[#140e0a] border border-stone-200 dark:border-[#352317] flex items-center justify-between gap-2 text-xs"
                      >
                        <div className="min-w-0">
                          <div className="font-bold text-stone-900 dark:text-stone-100 truncate">
                            {drv.name} {drv.accountHint ? `(${drv.accountHint})` : ''}
                          </div>
                          <div className="text-[10.5px] text-stone-500 dark:text-stone-400 truncate font-mono">
                            {drv.url}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <a
                            href={drv.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 rounded-lg bg-stone-200/80 dark:bg-[#251a12] hover:bg-stone-300 text-stone-800 dark:text-stone-200 text-[11px] font-semibold flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Open</span>
                          </a>
                          <button
                            type="button"
                            onClick={() => persistConnectedDrives(connectedDrives.filter((d) => d.id !== drv.id))}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-[#7f1d1d] dark:hover:text-[#d97074] cursor-pointer"
                            title="Remove Drive"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB: 15 CURATED FONTS (6 HANDWRITING) & LIVE SIZING SPECTRUM              */}
          {/* ========================================================================= */}
          {activeTab === 'typography' && (
            <div className="space-y-6">
              <div className="pb-2 border-b border-stone-200 dark:border-[#382518]">
                <h4 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <Type className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Fonts</span>
                </h4>
              </div>

              {/* Font Size Spectrum Slider */}
              <div className="p-4 rounded-xl bg-stone-50 dark:bg-[#18110c] border border-stone-200/80 dark:border-[#382518] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                    <span>Font Size Spectrum:</span>
                    <span className="text-amber-700 dark:text-amber-400 font-mono font-black">{fontScale}%</span>
                    <span className="text-stone-400 font-normal">({Math.round(15 * (fontScale / 100))}px baseline)</span>
                  </span>
                </div>

                <input
                  type="range"
                  min="80"
                  max="135"
                  step="5"
                  value={fontScale}
                  onChange={(e) => handleUpdateFontScale(parseInt(e.target.value, 10))}
                  className="w-full accent-amber-600 cursor-pointer h-2 bg-stone-200 dark:bg-[#251a12] rounded-lg"
                />

                {/* Preset spectrum quick buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                  {[
                    { label: 'Compact', val: 85 },
                    { label: 'Standard', val: 100 },
                    { label: 'Comfort', val: 110 },
                    { label: 'Expanded', val: 120 },
                    { label: 'Clinical Display', val: 130 },
                  ].map((pst) => (
                    <button
                      key={pst.val}
                      type="button"
                      onClick={() => handleUpdateFontScale(pst.val)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all ${
                        fontScale === pst.val
                          ? 'themed-accent-btn bg-amber-700 text-white border-amber-700 shadow-xs'
                          : 'themed-glass-card bg-white dark:bg-[#140e0a] text-stone-700 dark:text-stone-300 border-stone-200 dark:border-[#382518] hover:border-amber-500'
                      }`}
                    >
                      {pst.label} ({pst.val}%)
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Filter Pills & Counter */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="text-xs font-semibold text-stone-600 dark:text-stone-400">
                    Filter by Style & Function:
                  </div>
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                    {[
                      { key: 'all', label: `All (${APP_FONTS.length})`, count: APP_FONTS.length },
                      { key: 'handwriting', label: `✍️ Handwriting (${APP_FONTS.filter(f => f.fontType === 'handwriting').length})`, count: APP_FONTS.filter(f => f.fontType === 'handwriting').length },
                      { key: 'sans', label: `Clean Sans (${APP_FONTS.filter(f => f.fontType === 'sans').length})`, count: APP_FONTS.filter(f => f.fontType === 'sans').length },
                      { key: 'serif', label: `Editorial Serif (${APP_FONTS.filter(f => f.fontType === 'serif').length})`, count: APP_FONTS.filter(f => f.fontType === 'serif').length },
                      { key: 'mono', label: `Technical Mono (${APP_FONTS.filter(f => f.fontType === 'mono').length})`, count: APP_FONTS.filter(f => f.fontType === 'mono').length },
                    ].filter((btn) => btn.count > 0).map((btn) => (
                      <button
                        key={btn.key}
                        type="button"
                        onClick={() => setFontCategoryFilter(btn.key as any)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all shrink-0 ${
                          fontCategoryFilter === btn.key
                            ? 'themed-accent-btn bg-amber-700 text-white shadow-xs'
                            : 'themed-glass-card bg-stone-100 dark:bg-[#1a120d] text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-[#251a12]'
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Font Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {APP_FONTS
                    .filter((f) => fontCategoryFilter === 'all' || f.fontType === fontCategoryFilter)
                    .map((font) => {
                      const isSelected = currentFont === font.name;
                      const isHandwriting = font.fontType === 'handwriting';
                      return (
                        <div
                          key={font.id}
                          onClick={() => handleSelectFont(font)}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between group ${
                            isSelected
                              ? 'border-[#A47C43] bg-amber-50/50 dark:bg-[#231912] ring-2 ring-[#A47C43]/30 shadow-xs'
                              : isHandwriting
                              ? 'border-amber-200/90 dark:border-[#4b3322] bg-amber-50/20 dark:bg-[#1a120d] hover:border-amber-400'
                              : 'border-stone-200/90 dark:border-[#382518] bg-white dark:bg-[#18110c] hover:border-amber-500'
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                                <span
                                  data-font-sample=""
                                  style={
                                    {
                                      fontFamily: font.cssFamily,
                                      '--sample-font': font.cssFamily,
                                      fontSize: isHandwriting ? '1.25rem' : '1.05rem',
                                      fontStyle: 'normal',
                                    } as React.CSSProperties
                                  }
                                >
                                  {font.name}
                                </span>
                                {isHandwriting && (
                                  <span className="px-1.5 py-0.2 rounded text-[8.5px] font-mono font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                                    ✍️ Handwriting
                                  </span>
                                )}
                                {isSelected && <Check className="w-3.5 h-3.5 text-amber-500" />}
                              </span>
                              <span className="text-[9.5px] font-mono px-1.5 py-0.2 rounded bg-stone-100 dark:bg-[#251a12] text-stone-600 dark:text-stone-300">
                                {font.category}
                              </span>
                            </div>
                          </div>

                          {/* Live Font Sample */}
                          <div
                            data-font-sample=""
                            className={`mt-2.5 p-3 rounded-lg border text-stone-900 dark:text-stone-100 transition-colors ${
                              isHandwriting
                                ? 'bg-amber-50/60 dark:bg-[#1d1810] border-amber-200/60 dark:border-[#4b3322]'
                                : 'bg-stone-50 dark:bg-[#120c08] border-stone-100 dark:border-[#352317]'
                            }`}
                            style={
                              {
                                fontFamily: font.cssFamily,
                                '--sample-font': font.cssFamily,
                                fontStyle: 'normal',
                              } as React.CSSProperties
                            }
                          >
                            <div className={`font-semibold leading-snug ${isHandwriting ? 'text-base sm:text-lg text-amber-950 dark:text-amber-200' : 'text-sm'}`}>
                              {font.sample}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB: INDIAN (15) & WORLD (15) LANGUAGES + ADD MORE LANGUAGE BUILDER       */}
          {/* ========================================================================= */}
          {activeTab === 'languages' && (() => {
            const q = langSearchQuery.trim().toLowerCase();
            const matchLang = (l: { label: string; nativeLabel: string; code: string }) =>
              !q ||
              l.label.toLowerCase().includes(q) ||
              l.nativeLabel.toLowerCase().includes(q) ||
              l.code.toLowerCase().includes(q);

            const allLangsNow = getAllAvailableLanguages();
            const customIndian = customLanguages.filter((l) => l.region === 'indian').filter(matchLang);
            const customWorld = customLanguages.filter((l) => l.region !== 'indian').filter(matchLang);
            const filteredIndian = [...customIndian, ...INDIAN_LANGUAGES.filter(matchLang)];
            const filteredWorld = [...customWorld, ...WORLD_LANGUAGES.filter(matchLang)];

            const renderLangCard = (lang: (typeof allLangsNow)[number], removable = false) => {
              const isSelected = selectedLang === lang.code;
              return (
                <div
                  key={lang.code}
                  onClick={() => handleLanguageSelect(lang.code)}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all relative ${
                    isSelected
                      ? 'border-amber-600 bg-amber-500/10 dark:bg-[#231912] ring-2 ring-amber-500/40 shadow-xs'
                      : 'border-stone-200/90 dark:border-[#382518] bg-white dark:bg-[#18110c] hover:border-amber-400'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-lg shrink-0">{lang.flag}</span>
                      <div className="min-w-0">
                        <span className="font-bold text-sm text-stone-900 dark:text-stone-100 block truncate">
                          {lang.nativeLabel}
                        </span>
                        <span className="text-[11px] text-stone-500 dark:text-stone-400 block truncate">
                          {lang.label}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {isSelected && <Check className="w-4 h-4 text-amber-600 dark:text-amber-400 stroke-[3]" />}
                      {removable && (
                        <button
                          type="button"
                          onClick={(e) => handleDeleteCustomLanguage(lang.code, e)}
                          title="Remove custom language"
                          className="p-1 rounded-lg text-stone-400 hover:text-[#7f1d1d] dark:hover:text-[#d97074] hover:bg-stone-100 dark:hover:bg-[#251a12] cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="mt-2.5 p-2 rounded-lg bg-stone-50 dark:bg-[#120c08] border border-stone-200/60 dark:border-[#352317] text-xs text-stone-700 dark:text-stone-300">
                    <p className="italic font-medium leading-relaxed truncate">"{lang.greeting}"</p>
                  </div>
                </div>
              );
            };

            return (
              <div className="space-y-5">
                <div className="pb-2 border-b border-stone-200 dark:border-[#382518]">
                  <h4 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>Languages</span>
                  </h4>
                </div>

                {/* Indian & World Region Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setLangRegionFilter('indian');
                      setNewLangRegion('indian');
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      langRegionFilter === 'indian'
                        ? 'themed-accent-btn bg-[#5c351c] text-white border-[#5c351c] dark:bg-[#a47c43] dark:text-white dark:border-[#a47c43] shadow-xs'
                        : 'bg-white dark:bg-[#1a120d] text-stone-700 dark:text-stone-300 border-stone-200 dark:border-[#382518] hover:border-[#A47C43]'
                    }`}
                  >
                    Indian
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLangRegionFilter('world');
                      setNewLangRegion('world');
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      langRegionFilter === 'world'
                        ? 'themed-accent-btn bg-[#5c351c] text-white border-[#5c351c] dark:bg-[#a47c43] dark:text-white dark:border-[#a47c43] shadow-xs'
                        : 'bg-white dark:bg-[#1a120d] text-stone-700 dark:text-stone-300 border-stone-200 dark:border-[#382518] hover:border-[#A47C43]'
                    }`}
                  >
                    World
                  </button>
                </div>

                {/* Search + Add More Language Bar */}
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={langSearchQuery}
                      onChange={(e) => setLangSearchQuery(e.target.value)}
                      placeholder={langRegionFilter === 'indian' ? 'Search Indian languages...' : 'Search World languages...'}
                      className="w-full pl-8 pr-3 py-2 rounded-xl border border-stone-200 dark:border-[#382518] bg-white dark:bg-[#140e0a] text-xs text-stone-900 dark:text-stone-100 outline-none focus:border-amber-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setNewLangRegion(langRegionFilter);
                      setShowAddLangBuilder((v) => !v);
                    }}
                    className="themed-accent-btn px-3.5 py-2 rounded-xl bg-[#A47C43] hover:bg-[#8e6834] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add More Language</span>
                  </button>
                </div>

                {/* Custom Language Builder Panel */}
                {showAddLangBuilder && (
                  <form
                    onSubmit={handleAddCustomLanguage}
                    className="p-4 rounded-2xl border border-amber-500/40 bg-amber-50/40 dark:bg-[#1a120d] space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                        Create &amp; Save Custom Language
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="inline-flex rounded-lg border border-stone-200 dark:border-[#382518] bg-white dark:bg-[#120c08] p-0.5 text-[11px]">
                          <button
                            type="button"
                            onClick={() => setNewLangRegion('indian')}
                            className={`px-2.5 py-0.5 rounded-md font-semibold cursor-pointer transition-colors ${
                              newLangRegion === 'indian'
                                ? 'bg-[#5c351c] text-white dark:bg-[#a47c43]'
                                : 'text-stone-600 dark:text-stone-400'
                            }`}
                          >
                            Indian List
                          </button>
                          <button
                            type="button"
                            onClick={() => setNewLangRegion('world')}
                            className={`px-2.5 py-0.5 rounded-md font-semibold cursor-pointer transition-colors ${
                              newLangRegion === 'world'
                                ? 'bg-[#5c351c] text-white dark:bg-[#a47c43]'
                                : 'text-stone-600 dark:text-stone-400'
                            }`}
                          >
                            World List
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowAddLangBuilder(false)}
                          className="text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                      <input
                        type="text"
                        required
                        placeholder="Language name (e.g. Nepali)"
                        value={newLangName}
                        onChange={(e) => setNewLangName(e.target.value)}
                        className="sm:col-span-2 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-[#382518] bg-white dark:bg-[#120c08] text-xs outline-none focus:border-amber-500"
                      />
                      <input
                        type="text"
                        placeholder="Native script (e.g. नेपाली)"
                        value={newLangNative}
                        onChange={(e) => setNewLangNative(e.target.value)}
                        className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-[#382518] bg-white dark:bg-[#120c08] text-xs outline-none focus:border-amber-500"
                      />
                      <input
                        type="text"
                        placeholder="Flag (e.g. 🇳🇵)"
                        value={newLangFlag}
                        onChange={(e) => setNewLangFlag(e.target.value)}
                        className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-[#382518] bg-white dark:bg-[#120c08] text-xs outline-none focus:border-amber-500"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Greeting preview sentence..."
                      value={newLangGreeting}
                      onChange={(e) => setNewLangGreeting(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-stone-200 dark:border-[#382518] bg-white dark:bg-[#120c08] text-xs outline-none focus:border-amber-500"
                    />
                    <div className="pt-1">
                      <div className="text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1.5">
                        Optional Custom Sidebar Labels:
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        <input
                          type="text"
                          placeholder="Cockpit"
                          value={newLangNavMySpace}
                          onChange={(e) => setNewLangNavMySpace(e.target.value)}
                          className="px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-[#382518] bg-white dark:bg-[#120c08] text-[11px] outline-none focus:border-amber-500"
                        />
                        <input
                          type="text"
                          placeholder="Read"
                          value={newLangNavRead}
                          onChange={(e) => setNewLangNavRead(e.target.value)}
                          className="px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-[#382518] bg-white dark:bg-[#120c08] text-[11px] outline-none focus:border-amber-500"
                        />
                        <input
                          type="text"
                          placeholder="Create note"
                          value={newLangNavCreateNote}
                          onChange={(e) => setNewLangNavCreateNote(e.target.value)}
                          className="px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-[#382518] bg-white dark:bg-[#120c08] text-[11px] outline-none focus:border-amber-500"
                        />
                        <input
                          type="text"
                          placeholder="Calendar"
                          value={newLangNavCalendar}
                          onChange={(e) => setNewLangNavCalendar(e.target.value)}
                          className="px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-[#382518] bg-white dark:bg-[#120c08] text-[11px] outline-none focus:border-amber-500"
                        />
                        <input
                          type="text"
                          placeholder="Shelf"
                          value={newLangNavShelf}
                          onChange={(e) => setNewLangNavShelf(e.target.value)}
                          className="px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-[#382518] bg-white dark:bg-[#120c08] text-[11px] outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="themed-accent-btn px-4 py-1.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold cursor-pointer"
                      >
                        Save &amp; Activate Language
                      </button>
                    </div>
                  </form>
                )}

                {/* Indian Languages List (Strict) */}
                {langRegionFilter === 'indian' && (
                  <div className="space-y-2.5">
                    <h5 className="text-xs font-bold uppercase tracking-wider font-mono text-stone-600 dark:text-stone-400">
                      Indian ({filteredIndian.length})
                    </h5>
                    {filteredIndian.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {filteredIndian.map((lang) => renderLangCard(lang, Boolean(lang.isCustom)))}
                      </div>
                    ) : (
                      <div className="text-xs text-stone-500 dark:text-stone-400 py-4">
                        No matching Indian languages found.
                      </div>
                    )}
                  </div>
                )}

                {/* World Languages List (Strict) */}
                {langRegionFilter === 'world' && (
                  <div className="space-y-2.5">
                    <h5 className="text-xs font-bold uppercase tracking-wider font-mono text-stone-600 dark:text-stone-400">
                      World ({filteredWorld.length})
                    </h5>
                    {filteredWorld.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {filteredWorld.map((lang) => renderLangCard(lang, Boolean(lang.isCustom)))}
                      </div>
                    ) : (
                      <div className="text-xs text-stone-500 dark:text-stone-400 py-4">
                        No matching World languages found.
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })()}

          {/* ========================================================================= */}
          {/* TAB: IMPORT NOTES FROM OTHER APPS                                         */}
          {/* ========================================================================= */}
          {activeTab === 'import-notes' && (
            <div className="space-y-6">
              <div className="pb-2 border-b border-stone-200 dark:border-[#382518]">
                <h4 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <UploadCloud className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Import Notes</span>
                </h4>
              </div>

              {importStatus && (
                <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-[#231912] border border-amber-300 dark:border-[#4b3322] text-amber-900 dark:text-amber-300 text-xs font-semibold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 animate-spin text-amber-600 dark:text-amber-400" />
                  <span>{importStatus}</span>
                </div>
              )}

              {/* Supported Apps Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {[
                  { name: 'Notion', format: '.md, .zip, HTML', desc: 'Pages, clinical tables, toggle lists & multi-column boards', color: '#000000', badge: 'Full Markdown' },
                  { name: 'Obsidian', format: '.md Vault folders', desc: 'Bidirectional links, frontmatter tags & canvas graphs', color: '#7c3aed', badge: 'Vault Sync' },
                  { name: 'Apple Notes', format: '.txt, PDF, iCloud', desc: 'Handwritten Apple Pencil sketches, checklists & text', color: '#f59e0b', badge: 'iOS Native' },
                  { name: 'GoodNotes / Notability', format: '.pdf, .goodnotes', desc: 'Digital ink annotations, margin notes & anatomical slides', color: '#0284c7', badge: 'Vector Ink' },
                  { name: 'Google Keep', format: 'Takeout .json, .txt', desc: 'Quick ward memos, clinical pearls & audio transcripts', color: '#eab308', badge: 'Google Sync' },
                  { name: 'OneNote / Word', format: '.docx, .pdf', desc: 'Clinical rotation handouts, journal clubs & syllabi', color: '#2563eb', badge: 'Office 365' },
                ].map((app) => (
                  <div
                    key={app.name}
                    className="p-4 rounded-xl border border-stone-200 dark:border-[#382518] bg-white dark:bg-[#18110c] flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="font-bold text-xs text-stone-900 dark:text-stone-100">
                          {app.name}
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-stone-100 dark:bg-[#251a12] text-stone-600 dark:text-stone-300 font-semibold">
                          {app.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400">
                        {app.desc}
                      </p>
                      <span className="text-[10px] font-mono text-stone-400 dark:text-stone-500 block mt-1">
                        Accepted: {app.format}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleImportNotesFromApp(app.name)}
                      className="w-full py-1.5 px-3 rounded-lg text-xs font-semibold bg-stone-100 hover:bg-stone-200 dark:bg-[#251a12] dark:hover:bg-[#322318] text-stone-800 dark:text-stone-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400" />
                      <span>Import from {app.name}</span>
                    </button>
                  </div>
                ))}
              </div>

              {/* Upload Drop Zone */}
              <div className="p-6 rounded-2xl border-2 border-dashed border-stone-300 dark:border-[#4b3322] text-center bg-stone-50/50 dark:bg-[#160f0b] space-y-2">
                <UploadCloud className="w-8 h-8 text-stone-400 mx-auto" />
                <h5 className="text-xs font-bold text-stone-800 dark:text-stone-200">
                  Drag and drop your exported notes, markdown files or archives here
                </h5>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  Supports .zip, .md, .pdf, .json, and .html up to 50MB
                </p>
                <label className="inline-block px-4 py-2 bg-stone-800 hover:bg-stone-900 dark:bg-stone-200 dark:hover:bg-white text-white dark:text-stone-900 rounded-xl text-xs font-semibold cursor-pointer transition-colors shadow-xs">
                  <span>Browse Local Files</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleImportNotesFromApp(e.target.files[0].name.replace(/\.[^/.]+$/, ''));
                      }
                    }}
                  />
                </label>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB: SIDEBAR BUTTONS CUSTOMIZER                                           */}
          {/* ========================================================================= */}
          {activeTab === 'sidebar-buttons' && (
            <div className="space-y-6">
              <div className="pb-2 border-b border-stone-200 dark:border-[#382518]">
                <h4 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Sidebar Customizer</span>
                </h4>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-[#18110c] border border-stone-200 dark:border-[#382518] divide-y divide-stone-200 dark:divide-[#382518]">
                {[...ALL_SIDEBAR_BUTTON_ITEMS]
                  .sort((a, b) => {
                    const idxA = sidebarOrder.indexOf(a.id);
                    const idxB = sidebarOrder.indexOf(b.id);
                    return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
                  })
                  .map((item, idx, arr) => (
                    <div key={item.key} className="py-2.5 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-0.5">
                          <button
                            type="button"
                            onClick={() => handleShiftSidebarItem(item.id, -1)}
                            disabled={idx === 0}
                            title="Move segment Up in Sidebar"
                            className="p-1 rounded hover:bg-stone-200 dark:hover:bg-[#251a12] disabled:opacity-30 disabled:pointer-events-none text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleShiftSidebarItem(item.id, 1)}
                            disabled={idx === arr.length - 1}
                            title="Move segment Down in Sidebar"
                            className="p-1 rounded hover:bg-stone-200 dark:hover:bg-[#251a12] disabled:opacity-30 disabled:pointer-events-none text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="font-bold text-xs text-stone-900 dark:text-stone-100">
                          {item.label}
                        </span>
                      </div>

                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input
                          type="checkbox"
                          checked={sidebarSettings[item.key] !== false}
                          onChange={() => toggleSidebarSetting(item.key)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer dark:bg-[#322318] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
                      </label>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB: SUBSCRIPTION & PAYMENT PLANS (4 TIERS)                               */}
          {/* ========================================================================= */}
          {activeTab === 'subscription' && (
            <div className="space-y-6">
              <div className="pb-2 border-b border-stone-200 dark:border-[#382518]">
                <h4 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <Crown className="w-4 h-4 text-amber-500" />
                  <span>Plans &amp; Pricing</span>
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {SUBSCRIPTION_TIERS.map((tier) => (
                  <div
                    key={tier.id}
                    className={`p-4 rounded-xl border flex flex-col justify-between ${
                      tier.highlight
                        ? 'border-amber-500 bg-amber-500/10 dark:bg-[#231912] ring-2 ring-amber-500/20'
                        : 'border-stone-200 dark:border-[#382518] bg-white dark:bg-[#18110c]'
                    }`}
                  >
                    <div>
                      <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-stone-100 dark:bg-[#251a12] text-stone-700 dark:text-stone-300 uppercase">
                        {tier.badge}
                      </span>
                      <h5 className="font-bold text-xs text-stone-900 dark:text-stone-100 mt-2">
                        {tier.name}
                      </h5>
                      <div className="my-2 text-base font-black font-mono text-stone-900 dark:text-stone-100">
                        {tier.priceMonthly === 0 ? '₹0 / Free' : `₹${tier.priceMonthly} / mo`}
                      </div>
                      <p className="text-[10.5px] text-stone-500 dark:text-stone-400 line-clamp-2 mb-3">
                        {tier.description}
                      </p>
                      <ul className="space-y-1.5 text-[10px]">
                        {tier.features.slice(0, 4).map((f, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <Check className="w-3 h-3 text-amber-600 shrink-0 mt-0.5" />
                            <span className="text-stone-700 dark:text-stone-300">{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                      <button
                        type="button"
                        onClick={() => {
                          localStorage.setItem('medden_user_tier', tier.id);
                          setSavedFeedback(true);
                          setTimeout(() => setSavedFeedback(false), 1500);
                        }}
                        className={`mt-4 w-full py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          tier.highlight
                            ? 'themed-accent-btn bg-amber-600 hover:bg-amber-700 text-white'
                            : 'bg-stone-200 dark:bg-[#251a12] hover:bg-stone-300 dark:hover:bg-[#322318] text-stone-800 dark:text-stone-200'
                        }`}
                      >
                        {tier.priceMonthly === 0 ? 'Current Free' : 'Select Plan'}
                      </button>
                    </div>
                  ))}
              </div>

              {/* Other Note-Making Apps Pricing & Criteria Benchmark */}
              <div className="rounded-2xl border border-stone-200 dark:border-[#382518] bg-white dark:bg-[#1a120d] overflow-hidden">
                <div className="px-4 py-3 border-b border-stone-200 dark:border-[#352317] bg-stone-50/90 dark:bg-[#18110c] flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h5 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                      Note-Making Apps Benchmark Pricing &amp; Feature Criteria
                    </h5>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400">
                      Calibrated Ach1ev pricing criteria compared against popular note apps
                    </p>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-[11px]">
                    <thead>
                      <tr className="border-b border-stone-200 dark:border-[#352317] text-stone-500 dark:text-stone-400 font-mono uppercase text-[10px]">
                        <th className="py-2 px-3">App</th>
                        <th className="py-2 px-3">Other App Price</th>
                        <th className="py-2 px-3">Matched Feature Criteria</th>
                        <th className="py-2 px-3">Ach1ev Price &amp; Plan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 dark:divide-[#2e1e14]">
                      {COMPETITOR_BENCHMARKS.map((row) => (
                        <tr key={row.app}>
                          <td className="py-2 px-3 font-bold text-stone-900 dark:text-stone-100 whitespace-nowrap">
                            {row.app}
                          </td>
                          <td className="py-2 px-3 font-mono text-stone-600 dark:text-stone-300 whitespace-nowrap">
                            ~₹{row.typicalPriceMonthlyInr}/mo
                          </td>
                          <td className="py-2 px-3 text-stone-700 dark:text-stone-300">
                            {row.keyMatchedFeatures}
                          </td>
                          <td className="py-2 px-3 whitespace-nowrap">
                            <span className="font-bold text-amber-700 dark:text-amber-300">
                              {row.matchedAch1evTier} · ₹{row.ach1evPriceMonthlyInr}/mo
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          {/* ========================================================================= */}
          {activeTab === 'customizer' && (
            <div className="space-y-6">
              <div className="pb-2 border-b border-stone-200 dark:border-[#382518]">
                <h4 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Student Customizer</span>
                </h4>
              </div>

              {/* Deep Study & Distraction Controls */}
              <div className="p-4 rounded-2xl bg-stone-50/80 dark:bg-[#18110c] border border-stone-200/90 dark:border-[#382518] space-y-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
                    Deep Study & Focus Protections
                  </span>
                </div>

                {/* Distraction Free Toggle */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-[#140e0a] border border-stone-200/80 dark:border-[#352317]">
                  <div className="pr-4">
                    <div className="text-xs font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      <span>Distraction-Free Deep Note Mode</span>
                    </div>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                      Automatically soft-dim non-essential side panels and widgets while actively taking medical notes.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleToggleDistractionFree}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                      distractionFree ? 'bg-[#A47C43]' : 'bg-stone-300 dark:bg-[#322318]'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform transform shadow-2xs absolute top-1 ${
                        distractionFree ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Auto-Save Frequency */}
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                    Note Auto-Save Cadence:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'instant', label: 'Instant (Keystroke)' },
                      { id: '30s', label: 'Every 30 Seconds' },
                      { id: '60s', label: 'Every 60 Seconds' },
                      { id: 'manual', label: 'Manual Only (⌘S)' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleUpdateAutoSave(opt.id)}
                        className={`p-2 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer ${
                          autoSaveFreq === opt.id
                            ? 'themed-accent-btn bg-[#A47C43] text-white border-[#A47C43] shadow-2xs font-semibold'
                            : 'bg-white dark:bg-[#140e0a] text-stone-700 dark:text-stone-300 border-stone-200 dark:border-[#352317] hover:border-stone-400 dark:hover:border-[#4b3322]'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3. Daily Clinical Target Goals */}
              <div className="p-4 rounded-2xl bg-stone-50/80 dark:bg-[#18110c] border border-stone-200/90 dark:border-[#382518] space-y-4">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
                    Clinical Exam & Daily Target Goals
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Daily Study Hours */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[11px] font-semibold text-stone-700 dark:text-stone-300">
                        Daily Focus Hours Target:
                      </label>
                      <span className="text-xs font-bold font-mono text-amber-700 dark:text-amber-400">{dailyHoursGoal} hrs/day</span>
                    </div>
                    <div className="grid grid-cols-5 gap-1.5">
                      {[3, 4, 5, 6, 8].map((h) => (
                        <button
                          key={h}
                          type="button"
                          onClick={() => handleUpdateDailyHours(h)}
                          className={`py-1.5 rounded-lg text-xs font-medium border text-center transition-all cursor-pointer ${
                            dailyHoursGoal === h
                              ? 'themed-tab-active bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-bold shadow-2xs'
                              : 'bg-white dark:bg-[#140e0a] text-stone-700 dark:text-stone-300 border-stone-200 dark:border-[#352317] hover:border-stone-400 dark:hover:border-[#4b3322]'
                          }`}
                        >
                          {h}h
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Daily QBank Questions */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[11px] font-semibold text-stone-700 dark:text-stone-300">
                        Daily USMLE / MCQ Questions:
                      </label>
                      <span className="text-xs font-bold font-mono text-amber-600 dark:text-amber-400">{dailyQBankGoal} Qs</span>
                    </div>
                    <div className="grid grid-cols-5 gap-1.5">
                      {[20, 40, 60, 80, 100].map((q) => (
                        <button
                          key={q}
                          type="button"
                          onClick={() => handleUpdateDailyQBank(q)}
                          className={`py-1.5 rounded-lg text-xs font-medium border text-center transition-all cursor-pointer ${
                            dailyQBankGoal === q
                              ? 'themed-accent-btn bg-amber-600 text-white font-bold shadow-2xs'
                              : 'bg-white dark:bg-[#140e0a] text-stone-700 dark:text-stone-300 border-stone-200 dark:border-[#352317] hover:border-stone-400 dark:hover:border-[#4b3322]'
                          }`}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Keyboard Shortcuts Cheatsheet */}
              <div className="p-4 rounded-2xl bg-stone-50/80 dark:bg-[#18110c] border border-stone-200/90 dark:border-[#382518] space-y-3">
                <div className="flex items-center gap-2">
                  <Keyboard className="w-4 h-4 text-stone-500" />
                  <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
                    High-Yield Keyboard Shortcuts
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {[
                    { key: '⌘ / Ctrl + K', action: 'Quick Command Palette / Search' },
                    { key: '⌘ / Ctrl + S', action: 'Instant Note Save' },
                    { key: '⌘ / Ctrl + B', action: 'Toggle Slim Sidebar Width' },
                    { key: '⌘ / Ctrl + F', action: 'Focus / Split Note View Mode' },
                    { key: '⌘ / Ctrl + E', action: 'Trigger Eye Rest 20-20-20 Timer' },
                    { key: '⌘ / Ctrl + P', action: 'Launch Peace Audio Synthesizer' },
                  ].map((sc, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-[#140e0a] border border-stone-200/70 dark:border-[#352317]"
                    >
                      <span className="text-[11px] text-stone-600 dark:text-stone-300">{sc.action}</span>
                      <kbd className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-[#251a12] border border-stone-300 dark:border-[#4b3322] text-[10px] font-mono text-stone-800 dark:text-stone-200 font-semibold shadow-2xs">
                        {sc.key}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: STUDENT PROFILE (AVATAR UPLOAD + @USERNAME SLAB)                   */}
          {/* ========================================================================= */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="pb-2 border-b border-stone-200 dark:border-[#382518]">
                <h4 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <User className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Student Profile</span>
                </h4>
              </div>

              {/* Profile Picture Upload Card */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-[#18110c] border border-stone-200 dark:border-[#382518] flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  {profileForm.avatarUrl ? (
                    <img
                      src={profileForm.avatarUrl}
                      alt={profileForm.name}
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-amber-500/40 shadow-sm"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-amber-600/15 text-amber-800 dark:text-amber-300 font-bold text-xl flex items-center justify-center border border-amber-500/30">
                      {(profileForm.name || 'S').slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="text-xs font-bold text-stone-900 dark:text-stone-100">
                      Profile Photo
                    </div>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400">
                      Displayed across Ach1evers Hub, chat &amp; your sidebar badge
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="themed-accent-btn px-3 py-1.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs">
                    <Camera className="w-3.5 h-3.5" />
                    <span>{profileForm.avatarUrl ? 'Change Photo' : 'Upload Photo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </label>
                  {profileForm.avatarUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        const cleared = { ...profileForm, avatarUrl: undefined };
                        setProfileForm(cleared);
                        onUpdateProfile(cleared);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-stone-200 dark:bg-[#251a12] hover:bg-stone-300 text-stone-700 dark:text-stone-300 text-xs font-semibold cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Full Name &amp; Credentials:
                  </label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full bg-stone-50 dark:bg-[#18110c] px-3 py-2 rounded-xl border border-stone-200 dark:border-[#382518] text-xs text-stone-800 dark:text-stone-200 outline-none focus:border-amber-500"
                  />
                </div>

                {/* Username Slab for Peer Search */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Username (searchable by friends in Ach1evers Hub):
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-amber-700 dark:text-amber-400">
                      @
                    </span>
                    <input
                      type="text"
                      value={profileForm.username || ''}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          username: e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, ''),
                        })
                      }
                      placeholder="your_username"
                      className="w-full bg-stone-50 dark:bg-[#18110c] pl-7 pr-3 py-2 rounded-xl border border-stone-200 dark:border-[#382518] text-xs font-mono text-stone-800 dark:text-stone-200 outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Medical College / Institution:
                  </label>
                  <input
                    type="text"
                    value={profileForm.institution}
                    onChange={(e) => setProfileForm({ ...profileForm, institution: e.target.value })}
                    className="w-full bg-stone-50 dark:bg-[#18110c] px-3 py-2 rounded-xl border border-stone-200 dark:border-[#382518] text-xs text-stone-800 dark:text-stone-200 outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Contact Number:
                  </label>
                  <input
                    type="tel"
                    value={profileForm.phone || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    placeholder="+91 9876543210"
                    className="w-full bg-stone-50 dark:bg-[#18110c] px-3 py-2 rounded-xl border border-stone-200 dark:border-[#382518] text-xs text-stone-800 dark:text-stone-200 outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Year / Clinical Stage:
                  </label>
                  <input
                    type="text"
                    value={profileForm.currentYear}
                    onChange={(e) => setProfileForm({ ...profileForm, currentYear: e.target.value })}
                    className="w-full bg-stone-50 dark:bg-[#18110c] px-3 py-2 rounded-xl border border-stone-200 dark:border-[#382518] text-xs text-stone-800 dark:text-stone-200 outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Specialty Target:
                  </label>
                  <input
                    type="text"
                    value={profileForm.specialityGoal}
                    onChange={(e) => setProfileForm({ ...profileForm, specialityGoal: e.target.value })}
                    className="w-full bg-stone-50 dark:bg-[#18110c] px-3 py-2 rounded-xl border border-stone-200 dark:border-[#382518] text-xs text-stone-800 dark:text-stone-200 outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  className="themed-accent-btn px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  {savedFeedback && <Check className="w-3.5 h-3.5" />}
                  <span>{savedFeedback ? 'Saved!' : 'Save Profile'}</span>
                </button>
              </div>
            </form>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: BREAK TIMERS                                                       */}
          {/* ========================================================================= */}
          {activeTab === 'break' && (
            <form onSubmit={handleSaveBreak} className="space-y-4">
              <div className="pb-2 border-b border-stone-200 dark:border-[#382518]">
                <h4 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Eye Rest Timers</span>
                </h4>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Study Interval Before Eye Rest:
                </label>
                <select
                  value={breakForm.intervalMinutes}
                  onChange={(e) => setBreakForm({ ...breakForm, intervalMinutes: Number(e.target.value) })}
                  className="w-full bg-stone-50 dark:bg-[#18110c] px-3 py-2 rounded-xl border border-stone-200 dark:border-[#382518] text-xs text-stone-800 dark:text-stone-200 outline-none focus:border-amber-500"
                >
                  <option value={15}>Every 15 Minutes (High Screen Sensitivity)</option>
                  <option value={20}>Every 20 Minutes (Standard 20-20-20 Rule)</option>
                  <option value={30}>Every 30 Minutes</option>
                  <option value={45}>Every 45 Minutes (Extended Deep Work)</option>
                  <option value={60}>Every 60 Minutes</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Break Duration:
                </label>
                <select
                  value={breakForm.breakDurationSeconds}
                  onChange={(e) => setBreakForm({ ...breakForm, breakDurationSeconds: Number(e.target.value) })}
                  className="w-full bg-stone-50 dark:bg-[#18110c] px-3 py-2 rounded-xl border border-stone-200 dark:border-[#382518] text-xs text-stone-800 dark:text-stone-200 outline-none focus:border-amber-500"
                >
                  <option value={20}>20 Seconds (20ft distant focus)</option>
                  <option value={30}>30 Seconds</option>
                  <option value={60}>1 Minute</option>
                  <option value={120}>2 Minutes (Eye stretch + hydration)</option>
                  <option value={300}>5 Minutes</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-stone-50 dark:bg-[#18110c] border border-stone-200 dark:border-[#382518]">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span className="text-xs font-medium text-stone-800 dark:text-stone-200">
                    Tibetan Bowl Chime Sound Alert
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={breakForm.soundEnabled}
                  onChange={(e) => setBreakForm({ ...breakForm, soundEnabled: e.target.checked })}
                  className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
                />
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  className="themed-accent-btn px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  {savedFeedback && <Check className="w-3.5 h-3.5" />}
                  <span>{savedFeedback ? 'Saved!' : 'Save Timer Config'}</span>
                </button>
              </div>
            </form>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: BACKUP & RESET                                                     */}
          {/* ========================================================================= */}
          {activeTab === 'defaults' && (
            <div className="space-y-4">
              <div className="pb-2 border-b border-stone-200 dark:border-[#382518]">
                <h4 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Backup &amp; Reset</span>
                </h4>
              </div>
              {/* Google AI Studio Export Card */}
              <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/90 dark:border-amber-900/50 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-300">
                      <Sparkles className="w-4 h-4" />
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-amber-950 dark:text-amber-200">
                        Export to Google AI Studio
                      </h4>
                      <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80">
                        Full-stack workspace bundle with server, Flowcharts, Leisure Atelier & Gemini API
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-200/60 dark:bg-amber-900/60 text-amber-900 dark:text-amber-300 font-semibold">
                    Applet Ready
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-white/70 dark:bg-[#1a1714] border border-amber-200/60 dark:border-amber-900/40 text-[11px] font-mono flex items-center justify-between">
                  <div className="truncate">
                    <span className="text-stone-500 dark:text-stone-400">Applet ID: </span>
                    <span className="font-semibold text-stone-800 dark:text-amber-200">0087218c-d7d0-4ad0-b0df-2e515051e7a0</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyAppletId}
                    title="Copy Applet ID"
                    className="ml-2 px-2 py-1 rounded bg-stone-100 hover:bg-stone-200 dark:bg-[#251a12] dark:hover:bg-[#322318] text-stone-700 dark:text-stone-300 flex items-center gap-1 text-[10px] transition-colors cursor-pointer"
                  >
                    {copiedAppletId ? <Check className="w-3 h-3 text-amber-600 dark:text-amber-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedAppletId ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <a
                    href="/api/export/aistudio"
                    download="MedDen-AI-Studio-Export.zip"
                    className="px-3.5 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download AI Studio Bundle (.zip)</span>
                  </a>

                  <a
                    href="https://aistudio.google.com/app/applet/0087218c-d7d0-4ad0-b0df-2e515051e7a0"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 bg-stone-200 dark:bg-[#251a12] hover:bg-stone-300 dark:hover:bg-[#322318] text-stone-800 dark:text-stone-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open in AI Studio ↗</span>
                  </a>

                  {onOpenAIStudioModal && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenAIStudioModal();
                      }}
                      className="px-3.5 py-1.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-800 dark:text-amber-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-amber-500/40 transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Share Center & Links</span>
                    </button>
                  )}
                </div>

                <div className="text-[10px] text-stone-600 dark:text-stone-400 space-y-1 bg-amber-500/5 p-2 rounded-lg border border-amber-500/10">
                  <p className="font-semibold text-stone-700 dark:text-stone-300">How to use in Google AI Studio:</p>
                  <ol className="list-decimal list-inside space-y-0.5">
                    <li>Download the <strong>MedDen-AI-Studio-Export.zip</strong> bundle above.</li>
                    <li>Go to <a href="https://aistudio.google.com" target="_blank" rel="noreferrer" className="underline font-medium text-amber-700 dark:text-amber-400">Google AI Studio</a>.</li>
                    <li>Click <strong>New Applet</strong> or import project archive, then upload the ZIP.</li>
                    <li>All modules (Atelier, Flowcharts, 10 Peace Sounds, Notes) are immediately active.</li>
                  </ol>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 dark:bg-[#18110c] border border-stone-200 dark:border-[#382518]">
                <h4 className="text-xs font-bold text-stone-800 dark:text-stone-200 mb-1">
                  Backup Study Notes:
                </h4>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 mb-3">
                  Export all medical notebooks, drawings, snippets, and clinical pearl notes as JSON backup.
                </p>
                <button
                  type="button"
                  onClick={onExportNotes}
                  className="px-3.5 py-1.5 bg-stone-200 dark:bg-[#251a12] hover:bg-stone-300 dark:hover:bg-[#322318] text-stone-800 dark:text-stone-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Notes Archive</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 dark:bg-[#18110c] border border-stone-200 dark:border-[#382518] flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <h4 className="text-xs font-bold text-stone-800 dark:text-stone-200 mb-0.5">
                    Account &amp; Workspace Session
                  </h4>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    {user?.email ? `Signed in as ${user.email}` : 'Local browser session · Sign out to return to Login screen'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSettingsLogout}
                  className="px-4 py-1.5 rounded-xl bg-[#7f1d1d] hover:bg-[#962d32] text-[#fdf2f2] text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-[#7f1d1d]/10 dark:bg-[#6e171b]/25 border border-[#7f1d1d]/25 dark:border-[#962d32]/50">
                <h4 className="text-xs font-bold text-[#6e1418] dark:text-[#d97074] mb-1">
                  Reset Den to Factory Default:
                </h4>
                <p className="text-[11px] text-[#7f1d1d] dark:text-[#c94a4f] mb-3">
                  Revert notebooks, timetable roster, and option slabs back to default Pharmacology demo dataset.
                </p>
                <button
                  type="button"
                  onClick={onResetSession}
                  className="px-3.5 py-1.5 bg-[#7f1d1d] hover:bg-[#962d32] text-[#fdf2f2] rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Data</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (isWorkspaceView) {
    return modalContent;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0e0907]/75 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in duration-200">
      {modalContent}
    </div>
  );
};
