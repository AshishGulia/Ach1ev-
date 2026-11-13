import type { ComponentType } from 'react';
import type { BookThumbnailConfig } from '../types';
import {
  Activity,
  Anchor,
  Apple,
  Atom,
  Award,
  Bell,
  Bike,
  Binoculars,
  Bird,
  Bone,
  Book,
  BookMarked,
  Bookmark,
  BookOpen,
  Brain,
  Briefcase,
  Bug,
  Cake,
  Calendar,
  Camera,
  Car,
  Cat,
  Cherry,
  Citrus,
  Clock,
  CloudRain,
  Code2,
  Coffee,
  Compass,
  Cpu,
  Cross,
  Crown,
  CupSoda,
  Database,
  Dna,
  Dog,
  Ear,
  Eye,
  Feather,
  FileText,
  Fish,
  Flame,
  FlaskConical,
  Flower2,
  FolderHeart,
  Gem,
  Ghost,
  Globe,
  GraduationCap,
  Grid,
  Headphones,
  Heart,
  HeartPulse,
  Highlighter,
  Hospital,
  Hourglass,
  Key,
  Lamp,
  Laptop,
  Layers,
  LayoutGrid,
  Leaf,
  Lightbulb,
  Lock,
  MapPin,
  Medal,
  Mic,
  Microscope,
  Moon,
  Mountain,
  Music,
  Music2,
  Navigation,
  NotebookPen,
  Orbit,
  Palette,
  Paperclip,
  PawPrint,
  PenTool,
  Pill,
  Plane,
  Printer,
  Puzzle,
  Rabbit,
  Radio,
  Rainbow,
  Rocket,
  Ruler,
  Scissors,
  ScrollText,
  Shell,
  Shield,
  ShieldPlus,
  Ship,
  Smile,
  Sparkles,
  Speaker,
  Sprout,
  Squirrel,
  Star,
  Stethoscope,
  Sun,
  Swords,
  Syringe,
  Target,
  Telescope,
  Tent,
  Terminal,
  Thermometer,
  Timer,
  Train,
  Trees,
  Trophy,
  Turtle,
  Umbrella,
  Wand2,
  Watch,
  Waves,
  Zap,
} from 'lucide-react';

export interface DesignerFontOption {
  id: string;
  name: string;
  styleTag: string;
  cssFamily: string;
}

/** 10 Curated Designer Fonts loaded in index.html */
export const THUMBNAIL_DESIGNER_FONTS: DesignerFontOption[] = [
  { id: 'cinzel', name: 'Cinzel Carved', styleTag: 'Royal Engraved', cssFamily: "'Cinzel', Georgia, serif" },
  { id: 'playfair', name: 'Playfair Display', styleTag: 'Editorial Serif', cssFamily: "'Playfair Display', Georgia, serif" },
  { id: 'fraunces', name: 'Fraunces Optical', styleTag: 'Warm Atelier', cssFamily: "'Fraunces', Georgia, serif" },
  { id: 'eb-garamond', name: 'EB Garamond', styleTag: 'Oxford Folio', cssFamily: "'EB Garamond', Georgia, serif" },
  { id: 'lora', name: 'Lora Literary', styleTag: 'Calligraphic', cssFamily: "'Lora', Georgia, serif" },
  { id: 'dancing-script', name: 'Dancing Script', styleTag: 'Ribbon Script', cssFamily: "'Dancing Script', cursive" },
  { id: 'caveat', name: 'Caveat Brush', styleTag: 'Studio Hand', cssFamily: "'Caveat', cursive" },
  { id: 'architects-daughter', name: 'Architects Pen', styleTag: 'Draftsman', cssFamily: "'Architects Daughter', cursive" },
  { id: 'syne', name: 'Syne Geometric', styleTag: 'Avant Garde', cssFamily: "'Syne', sans-serif" },
  { id: 'mono', name: 'JetBrains Mono', styleTag: 'Clinical Code', cssFamily: "'JetBrains Mono', monospace" },
];

/** MS Word Style 10-Column Theme Color Matrix (Base + 4 Tints/Shades per column) */
export const THUMBNAIL_COLOR_COLUMNS: string[][] = [
  ['#1E1B18', '#524C44', '#78716C', '#A8A29E', '#E7E5E4'],
  ['#FFFFFF', '#F5EFE6', '#E5DACE', '#D6C6B2', '#B5A18A'],
  ['#5C351C', '#85532D', '#A47C43', '#D4A373', '#F3E3CA'],
  ['#1E3A5F', '#2B547E', '#3B82F6', '#93C5FD', '#DBEAFE'],
  ['#1F4E3D', '#2F5241', '#4F6E61', '#A4C3B2', '#D8EAE1'],
  ['#7F1D1D', '#991B1B', '#DC2626', '#F87171', '#FECACA'],
  ['#9A3412', '#C2410C', '#EA580C', '#FB923C', '#FED7AA'],
  ['#854D0E', '#CA8A04', '#EAB308', '#FACC15', '#FEF08A'],
  ['#4C1D95', '#6D28D9', '#8B5CF6', '#C4B5FD', '#EDE9FE'],
  ['#0F766E', '#0D9488', '#14B8A6', '#5EEAD4', '#CCFBF1'],
];

export const THUMBNAIL_STANDARD_COLORS: string[] = [
  '#C00000',
  '#FF0000',
  '#FFC000',
  '#FFFF00',
  '#92D050',
  '#00B050',
  '#00B0F0',
  '#0070C0',
  '#002060',
  '#7030A0',
];

export interface CoolIconItem {
  name: string;
  label: string;
  category: string;
  Icon: ComponentType<{ className?: string; style?: React.CSSProperties }>;
}

/** Exactly 100 verified cool vector icons across Medical, Nature, Cosmic, Travel & Studio categories */
export const THUMBNAIL_COOL_ICONS: CoolIconItem[] = [
  { name: 'BookOpen', label: 'Open Folio', category: 'Books', Icon: BookOpen },
  { name: 'Book', label: 'Hardcover', category: 'Books', Icon: Book },
  { name: 'BookMarked', label: 'Marked Tome', category: 'Books', Icon: BookMarked },
  { name: 'Bookmark', label: 'Ribbon Mark', category: 'Books', Icon: Bookmark },
  { name: 'NotebookPen', label: 'Journal', category: 'Books', Icon: NotebookPen },
  { name: 'FileText', label: 'Manuscript', category: 'Books', Icon: FileText },
  { name: 'ScrollText', label: 'Scroll', category: 'Books', Icon: ScrollText },
  { name: 'GraduationCap', label: 'Scholar', category: 'Books', Icon: GraduationCap },
  { name: 'Stethoscope', label: 'Stethoscope', category: 'Medical', Icon: Stethoscope },
  { name: 'Heart', label: 'Heart', category: 'Medical', Icon: Heart },
  { name: 'HeartPulse', label: 'Pulse', category: 'Medical', Icon: HeartPulse },
  { name: 'Activity', label: 'ECG Wave', category: 'Medical', Icon: Activity },
  { name: 'Brain', label: 'Neuro', category: 'Medical', Icon: Brain },
  { name: 'Dna', label: 'Genetics', category: 'Medical', Icon: Dna },
  { name: 'Microscope', label: 'Pathology', category: 'Medical', Icon: Microscope },
  { name: 'FlaskConical', label: 'Biochem', category: 'Medical', Icon: FlaskConical },
  { name: 'Pill', label: 'Pharma', category: 'Medical', Icon: Pill },
  { name: 'Syringe', label: 'Clinical', category: 'Medical', Icon: Syringe },
  { name: 'Thermometer', label: 'Vitals', category: 'Medical', Icon: Thermometer },
  { name: 'Eye', label: 'Optic', category: 'Medical', Icon: Eye },
  { name: 'Ear', label: 'ENT', category: 'Medical', Icon: Ear },
  { name: 'Bone', label: 'Ortho', category: 'Medical', Icon: Bone },
  { name: 'Cross', label: 'Medic', category: 'Medical', Icon: Cross },
  { name: 'Hospital', label: 'Ward', category: 'Medical', Icon: Hospital },
  { name: 'ShieldPlus', label: 'Immunity', category: 'Medical', Icon: ShieldPlus },
  { name: 'Atom', label: 'Atom', category: 'Science', Icon: Atom },
  { name: 'Orbit', label: 'Orbit', category: 'Science', Icon: Orbit },
  { name: 'Sparkles', label: 'Sparkles', category: 'Royal', Icon: Sparkles },
  { name: 'Star', label: 'North Star', category: 'Royal', Icon: Star },
  { name: 'Crown', label: 'Royal Crown', category: 'Royal', Icon: Crown },
  { name: 'Gem', label: 'Diamond', category: 'Royal', Icon: Gem },
  { name: 'Award', label: 'Laurel Seal', category: 'Royal', Icon: Award },
  { name: 'Trophy', label: 'Trophy', category: 'Royal', Icon: Trophy },
  { name: 'Medal', label: 'Honors', category: 'Royal', Icon: Medal },
  { name: 'Flame', label: 'Flame', category: 'Royal', Icon: Flame },
  { name: 'Sun', label: 'Day Sun', category: 'Nature', Icon: Sun },
  { name: 'Moon', label: 'Night Moon', category: 'Nature', Icon: Moon },
  { name: 'CloudRain', label: 'Monsoon', category: 'Nature', Icon: CloudRain },
  { name: 'Umbrella', label: 'Umbrella', category: 'Nature', Icon: Umbrella },
  { name: 'Rainbow', label: 'Rainbow', category: 'Nature', Icon: Rainbow },
  { name: 'Waves', label: 'Ocean', category: 'Nature', Icon: Waves },
  { name: 'Shell', label: 'Conch Shell', category: 'Nature', Icon: Shell },
  { name: 'Anchor', label: 'Anchor', category: 'Nautical', Icon: Anchor },
  { name: 'Compass', label: 'Compass', category: 'Nautical', Icon: Compass },
  { name: 'Ship', label: 'Vessel', category: 'Nautical', Icon: Ship },
  { name: 'Fish', label: 'Marine', category: 'Fauna', Icon: Fish },
  { name: 'Bird', label: 'Songbird', category: 'Fauna', Icon: Bird },
  { name: 'Bug', label: 'Butterfly', category: 'Fauna', Icon: Bug },
  { name: 'Trees', label: 'Forest', category: 'Nature', Icon: Trees },
  { name: 'Leaf', label: 'Botany', category: 'Nature', Icon: Leaf },
  { name: 'Flower2', label: 'Blossom', category: 'Nature', Icon: Flower2 },
  { name: 'Sprout', label: 'Sprout', category: 'Nature', Icon: Sprout },
  { name: 'Mountain', label: 'Peak', category: 'Nature', Icon: Mountain },
  { name: 'Tent', label: 'Camp', category: 'Nature', Icon: Tent },
  { name: 'Camera', label: 'Lens', category: 'Arts', Icon: Camera },
  { name: 'Palette', label: 'Palette', category: 'Arts', Icon: Palette },
  { name: 'Feather', label: 'Quill', category: 'Arts', Icon: Feather },
  { name: 'PenTool', label: 'Nib Pen', category: 'Arts', Icon: PenTool },
  { name: 'Highlighter', label: 'Highlighter', category: 'Arts', Icon: Highlighter },
  { name: 'Scissors', label: 'Surgery', category: 'Arts', Icon: Scissors },
  { name: 'Ruler', label: 'Measure', category: 'Arts', Icon: Ruler },
  { name: 'Layers', label: 'Folio Stack', category: 'Studio', Icon: Layers },
  { name: 'LayoutGrid', label: 'Mosaic', category: 'Studio', Icon: LayoutGrid },
  { name: 'Grid', label: 'Matrix', category: 'Studio', Icon: Grid },
  { name: 'Puzzle', label: 'Logic', category: 'Studio', Icon: Puzzle },
  { name: 'Key', label: 'Vault Key', category: 'Vault', Icon: Key },
  { name: 'Lock', label: 'Archive', category: 'Vault', Icon: Lock },
  { name: 'Shield', label: 'Crest', category: 'Vault', Icon: Shield },
  { name: 'Swords', label: 'Challenge', category: 'Vault', Icon: Swords },
  { name: 'Target', label: 'Bullseye', category: 'Studio', Icon: Target },
  { name: 'Zap', label: 'Impulse', category: 'Energy', Icon: Zap },
  { name: 'Lightbulb', label: 'Insight', category: 'Energy', Icon: Lightbulb },
  { name: 'Lamp', label: 'Desk Lamp', category: 'Studio', Icon: Lamp },
  { name: 'Hourglass', label: 'Hourglass', category: 'Time', Icon: Hourglass },
  { name: 'Clock', label: 'Chrono', category: 'Time', Icon: Clock },
  { name: 'Timer', label: 'Stopwatch', category: 'Time', Icon: Timer },
  { name: 'Calendar', label: 'Schedule', category: 'Time', Icon: Calendar },
  { name: 'Bell', label: 'Alert', category: 'Time', Icon: Bell },
  { name: 'Music', label: 'Melody', category: 'Audio', Icon: Music },
  { name: 'Headphones', label: 'Focus Audio', category: 'Audio', Icon: Headphones },
  { name: 'Radio', label: 'Frequency', category: 'Audio', Icon: Radio },
  { name: 'Mic', label: 'Voice', category: 'Audio', Icon: Mic },
  { name: 'Globe', label: 'Atlas', category: 'World', Icon: Globe },
  { name: 'MapPin', label: 'Landmark', category: 'World', Icon: MapPin },
  { name: 'Navigation', label: 'Vector', category: 'World', Icon: Navigation },
  { name: 'Plane', label: 'Flight', category: 'World', Icon: Plane },
  { name: 'Rocket', label: 'Launch', category: 'World', Icon: Rocket },
  { name: 'Car', label: 'Drive', category: 'World', Icon: Car },
  { name: 'Bike', label: 'Cycle', category: 'World', Icon: Bike },
  { name: 'Train', label: 'Express', category: 'World', Icon: Train },
  { name: 'Coffee', label: 'Espresso', category: 'Cozy', Icon: Coffee },
  { name: 'CupSoda', label: 'Refresh', category: 'Cozy', Icon: CupSoda },
  { name: 'Apple', label: 'Health', category: 'Cozy', Icon: Apple },
  { name: 'Cherry', label: 'Cherry', category: 'Cozy', Icon: Cherry },
  { name: 'Cat', label: 'Cat', category: 'Fauna', Icon: Cat },
  { name: 'Dog', label: 'Hound', category: 'Fauna', Icon: Dog },
  { name: 'Rabbit', label: 'Hare', category: 'Fauna', Icon: Rabbit },
  { name: 'Turtle', label: 'Tortoise', category: 'Fauna', Icon: Turtle },
  { name: 'PawPrint', label: 'Paw Print', category: 'Fauna', Icon: PawPrint },
  { name: 'Wand2', label: 'Magic', category: 'Studio', Icon: Wand2 },
];

export const ALPHABET_LIST = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const ICON_MAP = new Map<string, CoolIconItem>(THUMBNAIL_COOL_ICONS.map((item) => [item.name, item]));

export function getThumbnailIconItem(name?: string): CoolIconItem {
  if (name && ICON_MAP.has(name)) return ICON_MAP.get(name)!;
  return THUMBNAIL_COOL_ICONS[0]!;
}

export function getThumbnailFont(fontId?: string): DesignerFontOption {
  return THUMBNAIL_DESIGNER_FONTS.find((f) => f.id === fontId) || THUMBNAIL_DESIGNER_FONTS[0]!;
}

export function deriveConciseTitle(title: string): string {
  const clean = (title || 'Book')
    .replace(/['’]s\b/gi, '')
    .replace(/\b(textbook|principles|essentials|practical|manual|illustrated|basis|short|practice|review|clinical|human|of|and|the|for|in)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const words = clean.split(' ').filter(Boolean);
  if (words.length === 0) return title.slice(0, 12);
  const firstTwo = words.slice(0, 2).join(' ');
  return firstTwo.length <= 14 ? firstTwo : firstTwo.slice(0, 13) + '…';
}

export function getDefaultThumbnail(title: string, bgHex = '#5C351C'): BookThumbnailConfig {
  const match = (title || 'B').match(/[A-Za-z]/);
  const letter = (match ? match[0] : 'B').toUpperCase();
  return {
    displayMode: 'logo-only',
    kind: 'letter',
    letter,
    fontId: 'cinzel',
    iconName: 'BookOpen',
    fgColor: '#FEF3C7',
    bgColor: bgHex,
    conciseTitle: deriveConciseTitle(title),
  };
}

// Keep unused imports tree-shaken cleanly
void Cake;
void Citrus;
void Laptop;
void Music2;
void Printer;
void Smile;
void Speaker;
void Squirrel;
void Terminal;
void Watch;
void Briefcase;
void FolderHeart;
void Paperclip;
void Telescope;
