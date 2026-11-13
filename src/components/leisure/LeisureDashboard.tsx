import React, { useState, useEffect, useRef } from 'react';
import {
  SCRAMBLE_WORDS,
  FUN_VOCAB_QUESTIONS,
  LOGIC_PROGRAMMERS,
  LANGUAGE_SHORT_PROGRAM,
} from '../../data/leisureData';
import {
  PSYCHOLOGY_BIASES,
  BODY_LANGUAGE_CUES,
  HISTORY_EVENTS,
  WORLD_PLACES,
  MAGAZINE_ARTICLES,
  ART_PIECES,
  FASHION_MILESTONES,
  F1_PITSTOP_STEPS,
  GAMING_FACTS,
  WORLD_NEWS_FEED,
  INDIA_NEWS_FEED,
} from '../../data/leisureExtendedContent';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Wind,
  Search,
  Star,
  Sparkles,
  Plus,
  X,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  RefreshCw,
  BookOpen,
  Clock,
  Check,
  Eye,
  SlidersHorizontal,
  ExternalLink,
  Sun,
  Moon,
  Compass,
  Zap,
  Activity,
  Layers,
  ArrowLeft,
  CheckCircle2,
  Bell,
  Globe,
  Building2,
  Briefcase,
  Share2,
  Camera,
  Image as ImageIcon,
  Upload,
  AlertTriangle,
} from 'lucide-react';
import { INITIAL_POST_MBBS_OPPORTUNITIES, PostMbbsOpportunity } from '../../data/subscriptionData';

interface LeisureDashboardProps {
  onBackToStudy?: () => void;
}

export type PeaceSoundType =
  | 'rain'
  | 'forest'
  | 'ocean'
  | 'fireplace'
  | 'zen-bell'
  | 'library'
  | 'crickets'
  | 'cafe'
  | 'waterfall'
  | 'wind-chimes';

export interface AtelierSlab {
  id: string;
  wingId: string;
  name: string; // Simple, clean slab name
  tagline: string;
  badge: string;
  modulesCount: number;
  icon: string;
  customThumbnailUrl?: string;
  bannerType:
    | 'ripple'
    | 'tiles'
    | 'letters'
    | 'neural'
    | 'network'
    | 'arches'
    | 'ribbons'
    | 'velocity'
    | 'editorial';
  primaryColor: string;
  consoleId: string;
  watermark?: string;
  isCustom?: boolean;
}

export interface AtelierWing {
  id: string;
  title: string;
  badge: string;
  tagline: string;
  icon: string;
  badgeColor: string;
  slabs: AtelierSlab[];
}

export const INITIAL_WINGS: AtelierWing[] = [
  {
    id: 'decompression',
    title: 'Decompression Lab',
    badge: 'DECOMPRESSION',
    tagline: 'Unclench the jaw, slow the pulse · 3 slabs',
    icon: '🫁',
    badgeColor: '#ec4899',
    slabs: [
      {
        id: 'slab-breathing',
        wingId: 'decompression',
        name: 'Ocular Health & Breathing',
        tagline: 'Vagal brakes, pink noise rain & desk stretches',
        badge: 'DECOMPRESSION',
        modulesCount: 4,
        icon: '🫁',
        bannerType: 'ripple',
        primaryColor: '#9a6b3b',
        consoleId: 'nature',
        watermark: 'R',
      },
      {
        id: 'slab-stretches',
        wingId: 'decompression',
        name: 'Desk Reset Ritual',
        tagline: 'A two-minute full-body circuit for study chairs',
        badge: 'DECOMPRESSION',
        modulesCount: 3,
        icon: '🧘',
        bannerType: 'ripple',
        primaryColor: '#b45309',
        consoleId: 'stretches',
        watermark: 'B',
      },
      {
        id: 'slab-nap',
        wingId: 'decompression',
        name: 'Micro-Nap Studio',
        tagline: 'Engineered naps without the grog',
        badge: 'DECOMPRESSION',
        modulesCount: 3,
        icon: '🌙',
        bannerType: 'ripple',
        primaryColor: '#78350f',
        consoleId: 'sleep-cycles',
        watermark: 'M',
      },
    ],
  },
  {
    id: 'cognitive',
    title: 'Cognitive Play',
    badge: 'COGNITIVE FUN',
    tagline: 'Games that sharpen without straining · 4 slabs',
    icon: '🧩',
    badgeColor: '#eab308',
    slabs: [
      {
        id: 'slab-scramble',
        wingId: 'cognitive',
        name: 'Word Scramble',
        tagline: 'Medical terms & anagram unscrambler',
        badge: 'COGNITIVE FUN',
        modulesCount: 3,
        icon: '🔤',
        bannerType: 'tiles',
        primaryColor: '#d97706',
        consoleId: 'scramble',
        watermark: 'W',
      },
      {
        id: 'slab-logic',
        wingId: 'cognitive',
        name: 'Logic Puzzles',
        tagline: 'Bite-sized algorithmic thinking',
        badge: 'INTERACTIVE LOGIC',
        modulesCount: 3,
        icon: '💻',
        bannerType: 'tiles',
        primaryColor: '#ea580c',
        consoleId: 'coding',
        watermark: 'L',
      },
      {
        id: 'slab-trivia',
        wingId: 'cognitive',
        name: 'Medical Trivia',
        tagline: 'Greek roots, anatomy & quick quizzes',
        badge: 'COGNITIVE FUN',
        modulesCount: 3,
        icon: '💡',
        bannerType: 'tiles',
        primaryColor: '#ca8a04',
        consoleId: 'vocab',
        watermark: 'T',
      },
      {
        id: 'slab-chess',
        wingId: 'cognitive',
        name: 'Chess Tactics',
        tagline: 'Tactical mating nets & rapid spatial calculation',
        badge: 'STRATEGY',
        modulesCount: 3,
        icon: '♟️',
        bannerType: 'tiles',
        primaryColor: '#64748b',
        consoleId: 'chess',
        watermark: 'C',
      },
    ],
  },
  {
    id: 'language',
    title: 'Language Bytes',
    badge: 'LANGUAGE BYTES',
    tagline: 'Words as playgrounds · 3 slabs',
    icon: '🔤',
    badgeColor: '#a855f7',
    slabs: [
      {
        id: 'slab-latin',
        wingId: 'language',
        name: 'Clinical Languages & Mnemonics',
        tagline: 'Latin roots for ward rounds',
        badge: 'LANGUAGE BYTES',
        modulesCount: 3,
        icon: '📜',
        bannerType: 'letters',
        primaryColor: '#8b5cf6',
        consoleId: 'latin-roots',
      },
      {
        id: 'slab-poetry',
        wingId: 'language',
        name: 'Poetry Corners & Verse',
        tagline: 'Meter as meditation',
        badge: 'READING LOUNGE',
        modulesCount: 3,
        icon: '🪶',
        bannerType: 'letters',
        primaryColor: '#a855f7',
        consoleId: 'poetry',
      },
      {
        id: 'slab-idioms',
        wingId: 'language',
        name: 'Idiom Gym',
        tagline: 'Phrases that refuse to translate',
        badge: 'LANGUAGE BYTES',
        modulesCount: 3,
        icon: '💬',
        bannerType: 'letters',
        primaryColor: '#7c3aed',
        consoleId: 'idioms',
      },
    ],
  },
  {
    id: 'mind',
    title: 'Human Mind',
    badge: 'HUMAN MIND',
    tagline: 'Read the machine inside · 2 slabs',
    icon: '🧠',
    badgeColor: '#ec4899',
    slabs: [
      {
        id: 'slab-psychology',
        wingId: 'mind',
        name: 'Psychology & Human Behaviour',
        tagline: 'Why we do the strange things we do',
        badge: 'HUMAN MIND',
        modulesCount: 3,
        icon: '🧠',
        bannerType: 'neural',
        primaryColor: '#ec4899',
        consoleId: 'daily-biases',
        watermark: 'P',
      },
      {
        id: 'slab-biases',
        wingId: 'mind',
        name: 'Cognitive Biases Casino',
        tagline: 'Gamble against your own shortcuts',
        badge: 'HUMAN MIND',
        modulesCount: 3,
        icon: '🎰',
        bannerType: 'neural',
        primaryColor: '#f43f5e',
        consoleId: 'biases-casino',
        watermark: 'B',
      },
    ],
  },
  {
    id: 'social',
    title: 'Social Systems',
    badge: 'SOCIAL SYSTEMS',
    tagline: 'The invisible choreography of people · 2 slabs',
    icon: '🌐',
    badgeColor: '#0ea5e9',
    slabs: [
      {
        id: 'slab-sociology',
        wingId: 'social',
        name: 'Sociology & Social Currents',
        tagline: 'The physics of crowds and cultures',
        badge: 'SOCIAL SYSTEMS',
        modulesCount: 3,
        icon: '👥',
        bannerType: 'network',
        primaryColor: '#0ea5e9',
        consoleId: 'sociology',
      },
      {
        id: 'slab-cities',
        wingId: 'social',
        name: 'Urbanism & Cities',
        tagline: 'Cities as the greatest social invention',
        badge: 'SOCIAL SYSTEMS',
        modulesCount: 3,
        icon: '🏙️',
        bannerType: 'network',
        primaryColor: '#06b6d4',
        consoleId: 'urbanism',
      },
    ],
  },
  {
    id: 'civilization',
    title: 'Civilization Archive',
    badge: 'CIVILIZATION',
    tagline: 'Deep time, open shelves · 3 slabs',
    icon: '🏛️',
    badgeColor: '#b45309',
    slabs: [
      {
        id: 'slab-history',
        wingId: 'civilization',
        name: 'World History & Timeline',
        tagline: 'Pivot points and their aftershocks',
        badge: 'CIVILIZATION',
        modulesCount: 3,
        icon: '🏛️',
        bannerType: 'arches',
        primaryColor: '#b45309',
        consoleId: 'history',
      },
      {
        id: 'slab-maps',
        wingId: 'civilization',
        name: 'World Map Sanctuaries',
        tagline: 'Global odyssey for map-people',
        badge: 'GLOBAL ODYSSEY',
        modulesCount: 3,
        icon: '🗺️',
        bannerType: 'arches',
        primaryColor: '#92400e',
        consoleId: 'worldmap',
      },
      {
        id: 'slab-heritage',
        wingId: 'civilization',
        name: 'Art & Heritage Walks',
        tagline: 'Museums without the queue',
        badge: 'CIVILIZATION',
        modulesCount: 3,
        icon: '🖼️',
        bannerType: 'arches',
        primaryColor: '#78350f',
        consoleId: 'heritage',
      },
    ],
  },
  {
    id: 'aesthetic',
    title: 'Aesthetic Mind',
    badge: 'AESTHETIC MIND',
    tagline: 'Beauty as a form of rest · 3 slabs',
    icon: '🎨',
    badgeColor: '#f43f5e',
    slabs: [
      {
        id: 'slab-art',
        wingId: 'aesthetic',
        name: 'Masterpiece Art & Palettes',
        tagline: 'Color theory as a soothing drug',
        badge: 'AESTHETIC MIND',
        modulesCount: 3,
        icon: '🎨',
        bannerType: 'ribbons',
        primaryColor: '#f43f5e',
        consoleId: 'art',
      },
      {
        id: 'slab-fashion',
        wingId: 'aesthetic',
        name: 'High Fashion, Textiles & Couture',
        tagline: 'Fabric, form and cultural memory',
        badge: 'COUTURE & DESIGN',
        modulesCount: 3,
        icon: '✂️',
        bannerType: 'ribbons',
        primaryColor: '#fb7185',
        consoleId: 'fashion',
      },
      {
        id: 'slab-architecture',
        wingId: 'aesthetic',
        name: 'Architecture Digest',
        tagline: 'Buildings as frozen music',
        badge: 'AESTHETIC MIND',
        modulesCount: 3,
        icon: '📐',
        bannerType: 'ribbons',
        primaryColor: '#e11d48',
        consoleId: 'architecture',
      },
    ],
  },
  {
    id: 'performance',
    title: 'High Performance',
    badge: 'HIGH PERFORMANCE',
    tagline: 'Machines and margins of perfection · 2 slabs',
    icon: '🏎️',
    badgeColor: '#ea580c',
    slabs: [
      {
        id: 'slab-f1',
        wingId: 'performance',
        name: 'Formula 1 & Precision Machines',
        tagline: 'Splits measured in thousandths',
        badge: 'HIGH PERFORMANCE',
        modulesCount: 3,
        icon: '🏎️',
        bannerType: 'velocity',
        primaryColor: '#ea580c',
        consoleId: 'motorsport',
      },
      {
        id: 'slab-racing',
        wingId: 'performance',
        name: 'Motorsport Mindset',
        tagline: 'Calm hands at 300 km/h',
        badge: 'HIGH PERFORMANCE',
        modulesCount: 3,
        icon: '🏁',
        bannerType: 'velocity',
        primaryColor: '#c2410c',
        consoleId: 'racing-mindset',
      },
    ],
  },
  {
    id: 'pulse',
    title: 'Daily Pulse',
    badge: 'DAILY PULSE',
    tagline: 'The world, gently filtered · 2 slabs',
    icon: '📰',
    badgeColor: '#64748b',
    slabs: [
      {
        id: 'slab-news',
        wingId: 'pulse',
        name: 'World News & India Pulse',
        tagline: 'Stay informed without being consumed',
        badge: 'DAILY PULSE',
        modulesCount: 3,
        icon: '📰',
        bannerType: 'editorial',
        primaryColor: '#64748b',
        consoleId: 'news',
      },
      {
        id: 'slab-magazines',
        wingId: 'pulse',
        name: 'Curated Magazines & Longform',
        tagline: 'Slow reading for fast times',
        badge: 'READING LOUNGE',
        modulesCount: 3,
        icon: '📖',
        bannerType: 'editorial',
        primaryColor: '#475569',
        consoleId: 'magazines',
      },
    ],
  },
  {
    id: 'post-mbbs-wing',
    title: 'Post-MBBS Career Pathways & Medical Horizons',
    badge: 'CAREER DIVERSITY',
    tagline: 'Pathways after MBBS, global licensing, clinical agencies & overseas public directory · 2 slabs',
    icon: '🩺',
    badgeColor: '#0ea5e9',
    slabs: [
      {
        id: 'slab-post-mbbs',
        wingId: 'post-mbbs-wing',
        name: 'Post-MBBS Careers',
        tagline: 'NHS UK, USMLE Match, Clinical AI, UPSC CMS, Healthcare Consulting & Agencies',
        badge: 'CAREER PATHWAYS',
        modulesCount: 8,
        icon: '🩺',
        bannerType: 'network',
        primaryColor: '#0ea5e9',
        consoleId: 'post-mbbs-careers',
        watermark: 'MD',
      },
      {
        id: 'slab-overseas-jobs',
        wingId: 'post-mbbs-wing',
        name: 'Overseas & Global Registry',
        tagline: 'International hospital rosters, licensing exams & public community job list',
        badge: 'GLOBAL REACH',
        modulesCount: 6,
        icon: '🌍',
        bannerType: 'arches',
        primaryColor: '#b45309',
        consoleId: 'overseas-jobs',
        watermark: 'G',
      },
    ],
  },
];

// Bespoke Category-Matched Scenic SVG Backdrop + Vector Artwork for all 26 Leisure Slabs
const getCategoryBackdropPalette = (slab: AtelierSlab): [string, string, string] => {
  switch (slab.id) {
    case 'slab-breathing': return ['#1e293b', '#334155', '#e2b887'];
    case 'slab-stretches': return ['#292018', '#4a3525', '#f59e0b'];
    case 'slab-nap': return ['#0f172a', '#1e1b4b', '#fcd34d'];
    case 'slab-scramble': return ['#422006', '#78350f', '#fde68a'];
    case 'slab-logic': return ['#1c140d', '#3b2416', '#fb923c'];
    case 'slab-trivia': return ['#2d200a', '#573b10', '#facc15'];
    case 'slab-chess': return ['#1f1a16', '#3e3229', '#e6d5b8'];
    case 'slab-latin': return ['#271a33', '#422959', '#d8b4fe'];
    case 'slab-poetry': return ['#2e192f', '#4c2649', '#f0abfc'];
    case 'slab-idioms': return ['#221833', '#3b285c', '#c4b5fd'];
    case 'slab-psychology': return ['#311322', '#521d38', '#f9a8d4'];
    case 'slab-biases': return ['#35101b', '#5e1a2d', '#fda4af'];
    case 'slab-sociology': return ['#0f2536', '#163c57', '#7dd3fc'];
    case 'slab-cities': return ['#10222f', '#1c3b4f', '#67e8f9'];
    case 'slab-history': return ['#2f1b0c', '#573216', '#fcd34d'];
    case 'slab-maps': return ['#281c10', '#4a321b', '#fde047'];
    case 'slab-heritage': return ['#26160c', '#452815', '#fed7aa'];
    case 'slab-art': return ['#36121b', '#5b1c2d', '#fda4af'];
    case 'slab-fashion': return ['#331420', '#541e33', '#fbcfe8'];
    case 'slab-architecture': return ['#241219', '#421e2b', '#fecdd3'];
    case 'slab-f1': return ['#2b1309', '#57200d', '#fb923c'];
    case 'slab-racing': return ['#23120b', '#452010', '#fdba74'];
    case 'slab-news': return ['#1b2028', '#2f3845', '#cbd5e1'];
    case 'slab-magazines': return ['#1e222b', '#333b4a', '#e2e8f0'];
    case 'slab-post-mbbs': return ['#0e2536', '#173e5c', '#93c5fd'];
    case 'slab-overseas-jobs': return ['#271b0d', '#4b3317', '#fcd34d'];
    default: return ['#241911', '#3b281b', '#e5ce95'];
  }
};

const SlabThumbnail: React.FC<{
  slab: AtelierSlab;
  src?: string;
  customLogo?: string;
  compact?: boolean;
}> = ({ slab, customLogo, compact }) => {
  const [imgError, setImgError] = React.useState(false);
  const customImageSrc = customLogo && (customLogo.startsWith('http') || customLogo.startsWith('data:')) ? customLogo : undefined;

  React.useEffect(() => {
    setImgError(false);
  }, [customImageSrc]);

  const showEmoji = customLogo && !customLogo.startsWith('http') && !customLogo.startsWith('data:');

  if (showEmoji) {
    return (
      <div
        className="w-full h-full flex items-center justify-center select-none"
        style={{
          background: `radial-gradient(circle at 30% 20%, ${slab.primaryColor}45, #18110c 85%)`,
        }}
      >
        <span className={compact ? 'text-xl' : 'text-4xl drop-shadow-md'}>{customLogo}</span>
      </div>
    );
  }

  if (customImageSrc && !imgError) {
    return (
      <img
        src={customImageSrc}
        alt={slab.name}
        onError={() => setImgError(true)}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
      />
    );
  }

  const [bgFrom, bgTo, accent] = getCategoryBackdropPalette(slab);
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden group-hover:scale-[1.03] transition-transform duration-300"
      style={{
        background: `radial-gradient(circle at 75% 22%, ${accent}26 0%, transparent 55%), linear-gradient(145deg, ${bgFrom} 0%, ${bgTo} 100%)`,
      }}
    >
      {/* Subtle architectural pattern overlay tailored to each card */}
      <svg
        viewBox="0 0 160 110"
        className="absolute inset-0 w-full h-full opacity-25 pointer-events-none"
        preserveAspectRatio="xMidYMid slice"
      >
        <circle cx="132" cy="24" r="34" fill="none" stroke={accent} strokeWidth="0.9" strokeDasharray="3 3" />
        <circle cx="132" cy="24" r="22" fill={accent} fillOpacity="0.08" />
        <path d="M0 92 Q45 72 95 88 T160 76 L160 110 L0 110 Z" fill={accent} fillOpacity="0.1" />
      </svg>

      {/* Monogram badge in corner when full-size */}
      {!compact && (
        <span
          className="absolute top-2 left-2.5 text-[8.5px] font-mono font-bold tracking-widest uppercase px-1.5 py-0.5 rounded bg-black/30 border border-white/10"
          style={{ color: accent }}
        >
          {slab.badge}
        </span>
      )}

      <div
        className={`relative z-10 rounded-2xl flex items-center justify-center shadow-lg border border-white/15 backdrop-blur-xs ${
          compact ? 'w-9 h-9' : 'w-14 h-14'
        }`}
        style={{ background: 'rgba(15, 10, 7, 0.42)' }}
      >
        <SlabArtisticThumbnail
          slabId={slab.id}
          color={accent}
          className={compact ? 'w-5 h-5' : 'w-9 h-9'}
        />
      </div>
    </div>
  );
};

// High-resolution Curated Unsplash Photos for Every Leisure Slab
export const SLAB_REAL_PHOTOS: Record<string, string> = {
  // Decompression Lab
  'slab-breathing': 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80', // Eye iris macro
  'slab-stretches': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80', // Calming yoga / stretch
  'slab-nap': 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=600&q=80', // Rain on window / coffee

  // Cognitive Play
  'slab-scramble': 'https://images.unsplash.com/photo-1546776310-eef45dd6d63c?auto=format&fit=crop&w=600&q=80', // Wooden letters / scramble
  'slab-logic': 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80', // Code logic / digital circuit
  'slab-trivia': 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80', // Medical lab & glassware
  'slab-chess': 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=600&q=80', // Wooden chess pieces

  // Language Bytes
  'slab-latin': 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80', // Vintage parchment manuscript
  'slab-poetry': 'https://images.unsplash.com/photo-1473186578172-c141e6798cf4?auto=format&fit=crop&w=600&q=80', // Fountain pen & open book
  'slab-idioms': 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80', // Library book stacks

  // Human Mind
  'slab-psychology': 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=600&q=80', // Brain MRI / Neuroscience scan
  'slab-biases': 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80', // Human reflection & cognitive bias

  // Social Systems
  'slab-sociology': 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=600&q=80', // Urban crowd & community
  'slab-cities': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80', // Modern architecture & city lights

  // Civilization Archive
  'slab-history': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80', // Ancient classical amphitheatre
  'slab-maps': 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80', // Vintage topography world map
  'slab-heritage': 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&w=600&q=80', // Classical museum art gallery

  // Aesthetic Mind
  'slab-art': 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80', // Oil paints & master canvas
  'slab-fashion': 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80', // Haute couture tailoring & silk
  'slab-architecture': 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80', // Clean architectural spiral

  // High Performance
  'slab-f1': 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&q=80', // F1 motorsport machine
  'slab-racing': 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=600&q=80', // Apex racing track

  // Daily Pulse
  'slab-news': 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=600&q=80', // Newspaper printing & world wire
  'slab-magazines': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80', // Editorial journals & quiet desk

  // Post-MBBS Careers
  'slab-post-mbbs': 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=600&q=80', // Stethoscope, clinical rounds
  'slab-overseas-jobs': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=80', // Global airport & international licensing
};

// Artistic SVG Thumbnails for Every Slab (Ocular, F1, Art, Mind, Career, etc.)
const SlabArtisticThumbnail: React.FC<{ slabId: string; color: string; className?: string }> = ({ slabId, color, className = "w-5 h-5" }) => {
  switch (slabId) {
    case 'slab-breathing':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z" fill={`${color}15`} />
          <circle cx="12" cy="12" r="3.2" fill={color} fillOpacity="0.4" stroke={color} strokeWidth="1.5" />
          <circle cx="13" cy="11" r="1" fill="#ffffff" />
          <path d="M12 2v2M5.5 4.5l1.5 1.5M18.5 4.5l-1.5 1.5" stroke={color} strokeWidth="1.2" opacity="0.7" />
        </svg>
      );
    case 'slab-stretches':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="5" r="2.2" fill={color} fillOpacity="0.5" />
          <path d="M12 8v6M8 11l4 2 4-2M6 20c1.5-2 3.5-3 6-3s4.5 1 6 3" />
          <circle cx="12" cy="14" r="5" strokeDasharray="2 2" stroke={color} opacity="0.5" />
        </svg>
      );
    case 'slab-nap':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill={`${color}25`} />
          <path d="M15 5v2m-1-1h2m3 2v2m-1-1h2" stroke="#f59e0b" strokeWidth="1.4" />
        </svg>
      );
    case 'slab-chess':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21H5v-2l1.5-1.5c1-.5 1.5-1.5 1.5-3v-2.5C8 9.5 9.5 8 11.5 8c.5 0 1 .1 1.5.3L15 6l-1-2 3-1 2 4c.5 1 .5 2.5 0 3.5l-1 2.5v2.5c0 1.5.5 2.5 1.5 3L21 19v2z" fill={`${color}20`} />
          <circle cx="14" cy="9" r="1" fill={color} />
        </svg>
      );
    case 'slab-crosswords':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} stroke={color} strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" stroke={color} />
          <path d="M9 3v18M15 3v18M3 9h18M3 15h18" stroke={color} strokeWidth="1" opacity="0.6" />
          <rect x="9" y="3" width="6" height="6" fill={color} fillOpacity="0.4" />
          <rect x="3" y="15" width="6" height="6" fill={color} fillOpacity="0.4" />
          <rect x="15" y="9" width="6" height="6" fill={color} fillOpacity="0.4" />
        </svg>
      );
    case 'slab-cipher':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} stroke={color} strokeWidth="1.6">
          <circle cx="12" cy="12" r="9" stroke={color} />
          <circle cx="12" cy="12" r="5" stroke={color} strokeDasharray="3 2" />
          <circle cx="12" cy="12" r="2" fill={color} />
          <path d="M12 3v3M12 18v3M3 12h3M18 12h3" stroke={color} strokeWidth="1.5" />
        </svg>
      );
    case 'slab-lateral':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-7 7c0 3 2 5 3 6.5V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-1.5c1-1.5 3-3.5 3-6.5a7 7 0 0 0-7-7z" fill={`${color}20`} />
          <path d="M10 10l2-2 2 2" stroke={color} />
        </svg>
      );
    case 'slab-latin':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 4H8a4 4 0 0 0-4 4v10a2 2 0 0 0 2 2h11a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3z" fill={`${color}15`} />
          <path d="M8 8h8M8 12h6M8 16h4" stroke={color} strokeWidth="1.3" opacity="0.8" />
        </svg>
      );
    case 'slab-poetry':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.24 3.76a6 6 0 0 0-8.49 0L3 12.5V17h4.5l8.74-8.74a6 6 0 0 0 0-8.5z" fill={`${color}20`} />
          <path d="M16 8l-6 6M2 22h20" stroke={color} strokeWidth="1.4" />
        </svg>
      );
    case 'slab-idioms':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} stroke={color} strokeWidth="1.6" strokeLinecap="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill={`${color}15`} />
          <path d="M8 9h8M8 13h5" stroke={color} strokeWidth="1.3" />
        </svg>
      );
    case 'slab-psychology':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9.5 2A4.5 4.5 0 0 0 5 6.5c0 .6.1 1.2.3 1.7A4.5 4.5 0 0 0 3 12c0 2 1.3 3.7 3.1 4.3A4.5 4.5 0 0 0 10.5 20c.5 0 1-.1 1.5-.2V22h2v-2.2c.5.1 1 .2 1.5.2a4.5 4.5 0 0 0 4.4-3.7A4.5 4.5 0 0 0 21 12a4.5 4.5 0 0 0-2.3-3.8c.2-.5.3-1.1.3-1.7A4.5 4.5 0 0 0 14.5 2C13.2 2 12.1 2.6 12 3.5A4.5 4.5 0 0 0 9.5 2z" fill={`${color}20`} />
          <circle cx="10" cy="9" r="1" fill={color} />
          <circle cx="14" cy="9" r="1" fill={color} />
          <circle cx="12" cy="14" r="1" fill={color} />
        </svg>
      );
    case 'slab-biases':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} stroke={color} strokeWidth="1.6">
          <circle cx="12" cy="12" r="9" stroke={color} fill={`${color}15`} />
          <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M5.6 18.4L18.4 5.6" stroke={color} strokeWidth="1" opacity="0.6" />
          <circle cx="12" cy="12" r="3" fill={color} />
        </svg>
      );
    case 'slab-sociology':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} stroke={color} strokeWidth="1.6">
          <circle cx="12" cy="7" r="3" fill={color} fillOpacity="0.4" />
          <circle cx="6" cy="17" r="2.5" fill={color} fillOpacity="0.3" />
          <circle cx="18" cy="17" r="2.5" fill={color} fillOpacity="0.3" />
          <path d="M10 8.5L7.5 15M14 8.5L16.5 15M8.5 17h7" stroke={color} strokeWidth="1.3" />
        </svg>
      );
    case 'slab-logic':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="16" rx="3" fill={`${color}15`} />
          <path d="M8 9l3 3-3 3M13 15h4" stroke={color} strokeWidth="1.8" />
        </svg>
      );
    case 'slab-trivia':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18h6M10 21h4M12 2a7 7 0 0 0-7 7c0 3 2 5 3 6.5V17h8v-1.5c1-1.5 3-3.5 3-6.5a7 7 0 0 0-7-7z" fill={`${color}20`} />
          <path d="M10.5 9.5a1.5 1.5 0 1 1 2.2 1.3c-.5.3-.7.7-.7 1.2v.5" stroke={color} strokeWidth="1.5" />
          <circle cx="12" cy="14.5" r="0.6" fill={color} />
        </svg>
      );
    case 'slab-cities':
    case 'slab-urban':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="10" width="5" height="11" fill={`${color}20`} />
          <rect x="9.5" y="5" width="5" height="16" fill={`${color}30`} />
          <rect x="16" y="8" width="5" height="13" fill={`${color}20`} />
          <line x1="2" y1="21" x2="22" y2="21" stroke={color} strokeWidth="2" />
        </svg>
      );
    case 'slab-maps':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} stroke={color} strokeWidth="1.6">
          <circle cx="12" cy="12" r="9" stroke={color} />
          <polygon points="12,4 14.5,12 12,10.5 9.5,12" fill={color} />
          <polygon points="12,20 14.5,12 12,13.5 9.5,12" fill={`${color}50`} />
        </svg>
      );
    case 'slab-history':
    case 'slab-civilization':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} stroke={color} strokeWidth="1.6" strokeLinecap="round">
          <polygon points="12,3 2,8 22,8" fill={`${color}25`} stroke={color} strokeWidth="1.5" />
          <line x1="4" y1="9" x2="4" y2="18" stroke={color} strokeWidth="1.8" />
          <line x1="9.3" y1="9" x2="9.3" y2="18" stroke={color} strokeWidth="1.8" />
          <line x1="14.7" y1="9" x2="14.7" y2="18" stroke={color} strokeWidth="1.8" />
          <line x1="20" y1="9" x2="20" y2="18" stroke={color} strokeWidth="1.8" />
          <rect x="2" y="18" width="20" height="3" fill={color} fillOpacity="0.4" stroke={color} strokeWidth="1.5" />
        </svg>
      );
    case 'slab-heritage':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 3h8M9 3v3c-3 2-4 5-4 8 0 4 3 6 7 6s7-2 7-6c0-3-1-6-4-8V3" fill={`${color}20`} />
          <path d="M5 9c-1.5 0-2 1-2 2.5S4 14 5 14M19 9c1.5 0 2 1 2 2.5S20 14 19 14M8 20h8" />
        </svg>
      );
    case 'slab-art':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} stroke={color} strokeWidth="1.6">
          <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 3.58 8 8 8 1 0 1.5-.8 1.5-1.5 0-.46-.17-.89-.48-1.22-.3-.33-.52-.77-.52-1.28 0-1.1.9-2 2-2h1.5c4.42 0 8-3.58 8-8 0-5.52-4.48-10-9.5-10z" fill={`${color}20`} />
          <circle cx="6.5" cy="11.5" r="1.3" fill="#ef4444" />
          <circle cx="9.5" cy="7.5" r="1.3" fill="#eab308" />
          <circle cx="14.5" cy="7.5" r="1.3" fill="#3b82f6" />
          <circle cx="17.5" cy="11.5" r="1.3" fill="#d97706" />
        </svg>
      );
    case 'slab-fashion':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19.5 4.5l-15 15M17 3l4 4" stroke={color} strokeWidth="1.8" />
          <path d="M7 11c3 1 5 4 4 7s4 4 6 2" stroke="#f43f5e" strokeWidth="1.4" opacity="0.8" />
        </svg>
      );
    case 'slab-architecture':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="4" r="2" fill={color} fillOpacity="0.4" />
          <path d="M11 6L4 21M13 6l7 15M7 15h10" stroke={color} strokeWidth="1.6" />
          <path d="M8 12a4 4 0 0 1 8 0" stroke={color} strokeDasharray="2 2" opacity="0.7" />
        </svg>
      );
    case 'slab-f1':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 14h2l2-4h8l3 4h5v2h-3c-.5 0-1 .5-1 1a2 2 0 1 1-4 0c0-.5-.5-1-1-1H9c-.5 0-1 .5-1 1a2 2 0 1 1-4 0c0-.5-.5-1-1-1H2v-2z" fill={`${color}25`} />
          <path d="M11 10h4l1.5 2H11v-2z" fill={color} fillOpacity="0.5" />
          <path d="M1 12h4M1 16h3" stroke="#ea580c" strokeWidth="1.2" opacity="0.8" />
        </svg>
      );
    case 'slab-racing':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} stroke={color} strokeWidth="1.6" strokeLinecap="round">
          <path d="M4 22V3c3-1.5 6 1.5 9 0s5-1 7 0v11c-2-1-4 0-7 0s-6-1.5-9 0" fill={`${color}20`} />
          <line x1="4" y1="22" x2="4" y2="2" stroke={color} strokeWidth="2" />
        </svg>
      );
    case 'slab-news':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} stroke={color} strokeWidth="1.6" strokeLinecap="round">
          <rect x="3" y="4" width="18" height="16" rx="2" fill={`${color}15`} />
          <line x1="7" y1="8" x2="17" y2="8" stroke={color} strokeWidth="2" />
          <line x1="7" y1="12" x2="11" y2="12" stroke={color} strokeWidth="1.4" />
          <line x1="7" y1="15" x2="11" y2="15" stroke={color} strokeWidth="1.4" />
          <rect x="13" y="11" width="4" height="5" fill={color} fillOpacity="0.4" />
        </svg>
      );
    case 'slab-magazines':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" fill={`${color}20`} />
        </svg>
      );
    case 'slab-post-mbbs':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="2" x2="12" y2="22" stroke={color} strokeWidth="2" />
          <circle cx="12" cy="3" r="1.5" fill="#f59e0b" stroke="#f59e0b" />
          <path d="M7 7c2-1 3.5 1 5 1s3-2 5-1c-2 2-3.5 4-5 4s-3-2-5-4z" fill={`${color}30`} />
          <path d="M8 12c2.5 0 3.5 2 4 4s1.5 4 4 4" stroke={color} strokeWidth="1.5" />
        </svg>
      );
    case 'slab-overseas-jobs':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" stroke={color} opacity="0.6" />
          <path d="M3.6 9h16.8M3.6 15h16.8" stroke={color} strokeWidth="1" opacity="0.5" />
          <path d="M12 3a14 14 0 0 0 0 18 14 14 0 0 0 0-18" stroke={color} strokeWidth="1" opacity="0.5" />
          <path d="M16 8l3 3-5 1-2 4-1-1 1-3-3-2 1-1 3 1z" fill="#38bdf8" stroke="#38bdf8" strokeWidth="1" />
        </svg>
      );
    default:
      return (
        <div className="w-5 h-5 rounded-full flex items-center justify-center font-serif font-bold text-xs" style={{ backgroundColor: `${color}30`, color }}>
          ✦
        </div>
      );
  }
};

// SVG Banner Graphics for Slabs matching the screenshot styles
const SlabBannerGraphic: React.FC<{
  type: AtelierSlab['bannerType'];
  color: string;
  slabId?: string;
  watermarkLetter?: string;
  isCompact?: boolean;
}> = ({ type, color, slabId, watermarkLetter, isCompact }) => {
  const hClass = 'h-14 sm:h-16';

  if (type === 'ripple') {
    return (
      <div className={`w-full ${hClass} relative overflow-hidden bg-gradient-to-r from-amber-50 to-orange-50/70 dark:from-[#231912] dark:to-[#18110c]`}>
        <svg className="absolute inset-0 w-full h-full opacity-60 dark:opacity-40" preserveAspectRatio="none" viewBox="0 0 300 120">
          <circle cx="150" cy="120" r="35" fill="none" stroke={color} strokeWidth="1.5" />
          <circle cx="150" cy="120" r="65" fill="none" stroke={color} strokeWidth="1.5" />
          <circle cx="150" cy="120" r="95" fill="none" stroke={color} strokeWidth="1.5" />
          <circle cx="150" cy="120" r="130" fill="none" stroke={color} strokeWidth="1" strokeDasharray="3 3" />
        </svg>
        {watermarkLetter && (
          <span className="absolute right-4 bottom-1 font-serif text-5xl font-bold text-black/5 dark:text-white/5 select-none pointer-events-none">
            {watermarkLetter}
          </span>
        )}
      </div>
    );
  }

  if (type === 'tiles') {
    return (
      <div className={`w-full ${hClass} relative overflow-hidden bg-gradient-to-r from-amber-50 to-orange-50/70 dark:from-[#282015] dark:to-[#1c160e]`}>
        <svg className="absolute inset-0 w-full h-full opacity-50 dark:opacity-35" preserveAspectRatio="none" viewBox="0 0 300 120">
          <rect x="20" y="15" width="40" height="35" rx="8" fill={color} />
          <rect x="70" y="15" width="60" height="35" rx="8" fill={color} fillOpacity="0.6" />
          <rect x="140" y="15" width="45" height="35" rx="8" fill={color} fillOpacity="0.4" />
          <rect x="210" y="15" width="45" height="40" rx="10" fill={color} fillOpacity="0.7" />
          <rect x="265" y="15" width="30" height="35" rx="8" fill={color} fillOpacity="0.5" />
          <rect x="30" y="60" width="55" height="45" rx="8" fill={color} fillOpacity="0.5" />
          <rect x="95" y="60" width="40" height="45" rx="8" fill={color} fillOpacity="0.3" />
          <rect x="145" y="60" width="65" height="45" rx="8" fill={color} fillOpacity="0.6" />
        </svg>
        {watermarkLetter && (
          <span className="absolute right-4 bottom-1 font-serif text-5xl font-bold text-black/5 dark:text-white/5 select-none pointer-events-none">
            {watermarkLetter}
          </span>
        )}
      </div>
    );
  }

  if (type === 'letters') {
    return (
      <div className={`w-full ${hClass} relative overflow-hidden bg-gradient-to-r from-purple-50 to-indigo-50/70 dark:from-[#221a2d] dark:to-[#16111f]`}>
        <div className="absolute inset-0 flex items-center justify-around px-4 select-none pointer-events-none opacity-40 dark:opacity-25">
          <span className="font-serif text-3xl font-bold text-purple-600 dark:text-purple-300">U</span>
          <span className="font-serif text-4xl italic text-purple-700 dark:text-purple-400">c</span>
          <span className="font-serif text-2xl font-bold text-purple-500 dark:text-purple-200">&</span>
          <span className="font-serif text-4xl font-bold text-purple-700 dark:text-purple-400">?</span>
          <span className="font-serif text-5xl font-serif text-purple-600 dark:text-purple-300">A</span>
          <span className="font-serif text-3xl italic text-purple-700 dark:text-purple-400">S</span>
        </div>
      </div>
    );
  }

  if (type === 'neural') {
    return (
      <div className={`w-full ${hClass} relative overflow-hidden bg-gradient-to-r from-pink-50 to-rose-50/70 dark:from-[#2c1824] dark:to-[#1c1017]`}>
        <svg className="absolute inset-0 w-full h-full opacity-60 dark:opacity-40" preserveAspectRatio="none" viewBox="0 0 300 120">
          <path d="M 0,35 Q 75,70 150,35 T 300,35" fill="none" stroke={color} strokeWidth="2.5" />
          <path d="M 0,60 Q 75,25 150,60 T 300,60" fill="none" stroke={color} strokeWidth="2" strokeOpacity="0.7" />
          <path d="M 0,85 Q 75,110 150,85 T 300,85" fill="none" stroke={color} strokeWidth="1.5" strokeOpacity="0.5" />
        </svg>
        {watermarkLetter && (
          <span className="absolute right-4 bottom-1 font-serif text-5xl font-bold text-black/5 dark:text-white/5 select-none pointer-events-none">
            {watermarkLetter}
          </span>
        )}
      </div>
    );
  }

  if (type === 'network') {
    return (
      <div className={`w-full ${hClass} relative overflow-hidden bg-gradient-to-r from-sky-50 to-cyan-50/70 dark:from-[#12222b] dark:to-[#0c161c]`}>
        <svg className="absolute inset-0 w-full h-full opacity-60 dark:opacity-40" preserveAspectRatio="none" viewBox="0 0 300 120">
          <line x1="30" y1="40" x2="90" y2="25" stroke={color} strokeWidth="1.5" />
          <line x1="90" y1="25" x2="160" y2="55" stroke={color} strokeWidth="1.5" />
          <line x1="160" y1="55" x2="230" y2="30" stroke={color} strokeWidth="1.5" />
          <line x1="230" y1="30" x2="280" y2="70" stroke={color} strokeWidth="1.5" />
          <line x1="90" y1="25" x2="110" y2="85" stroke={color} strokeWidth="1" strokeDasharray="2 2" />
          <line x1="160" y1="55" x2="190" y2="95" stroke={color} strokeWidth="1" />
          <circle cx="30" cy="40" r="4" fill={color} />
          <circle cx="90" cy="25" r="5" fill={color} />
          <circle cx="160" cy="55" r="5" fill={color} />
          <circle cx="230" cy="30" r="4" fill={color} />
          <circle cx="280" cy="70" r="4" fill={color} />
          <circle cx="110" cy="85" r="3" fill={color} fillOpacity="0.7" />
          <circle cx="190" cy="95" r="3" fill={color} fillOpacity="0.7" />
        </svg>
      </div>
    );
  }

  if (type === 'arches') {
    return (
      <div className={`w-full ${hClass} relative overflow-hidden bg-gradient-to-r from-stone-100 to-amber-50/70 dark:from-[#2a1e16] dark:to-[#1b130d]`}>
        <svg className="absolute inset-0 w-full h-full opacity-60 dark:opacity-40" preserveAspectRatio="none" viewBox="0 0 300 120">
          <path d="M 30,120 L 30,50 A 25,25 0 0,1 80,50 L 80,120" fill="none" stroke={color} strokeWidth="2" />
          <path d="M 95,120 L 95,45 A 30,30 0 0,1 155,45 L 155,120" fill="none" stroke={color} strokeWidth="2.5" />
          <path d="M 170,120 L 170,50 A 25,25 0 0,1 220,50 L 220,120" fill="none" stroke={color} strokeWidth="2" />
          <path d="M 235,120 L 235,55 A 20,20 0 0,1 275,55 L 275,120" fill="none" stroke={color} strokeWidth="1.5" />
          <line x1="10" y1="120" x2="290" y2="120" stroke={color} strokeWidth="2" />
        </svg>
      </div>
    );
  }

  if (type === 'ribbons') {
    return (
      <div className={`w-full ${hClass} relative overflow-hidden bg-gradient-to-r from-rose-50 to-fuchsia-50/70 dark:from-[#2d1921] dark:to-[#1c1015]`}>
        <svg className="absolute inset-0 w-full h-full opacity-60 dark:opacity-40" preserveAspectRatio="none" viewBox="0 0 300 120">
          <path d="M 0,40 C 90,20 180,90 300,50" fill="none" stroke={color} strokeWidth="18" strokeLinecap="round" strokeOpacity="0.6" />
          <path d="M 0,75 C 100,100 200,30 300,85" fill="none" stroke={color} strokeWidth="12" strokeLinecap="round" strokeOpacity="0.4" />
        </svg>
      </div>
    );
  }

  if (type === 'velocity') {
    return (
      <div className={`w-full ${hClass} relative overflow-hidden bg-gradient-to-r from-orange-50 to-red-50/70 dark:from-[#2e1913] dark:to-[#1e100c]`}>
        <svg className="absolute inset-0 w-full h-full opacity-60 dark:opacity-40" preserveAspectRatio="none" viewBox="0 0 300 120">
          <path d="M 20,35 L 240,35 L 225,25 M 240,35 L 225,45" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 50,60 L 275,60 L 260,50 M 275,60 L 260,70" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
          <path d="M 30,85 L 210,85 L 195,75 M 210,85 L 195,95" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // Editorial
  return (
    <div className={`w-full ${hClass} relative overflow-hidden bg-gradient-to-r from-slate-50 to-stone-100 dark:from-[#171c26] dark:to-[#0f131a]`}>
      <svg className="absolute inset-0 w-full h-full opacity-60 dark:opacity-40" preserveAspectRatio="none" viewBox="0 0 300 120">
        <rect x="25" y="20" width="75" height="85" fill="none" stroke={color} strokeWidth="1" />
        <line x1="32" y1="32" x2="93" y2="32" stroke={color} strokeWidth="2" />
        <line x1="32" y1="42" x2="88" y2="42" stroke={color} strokeWidth="1" strokeDasharray="2 2" />
        <line x1="32" y1="50" x2="90" y2="50" stroke={color} strokeWidth="1" strokeDasharray="2 2" />
        <line x1="32" y1="58" x2="85" y2="58" stroke={color} strokeWidth="1" strokeDasharray="2 2" />

        <rect x="115" y="20" width="75" height="85" fill="none" stroke={color} strokeWidth="1" />
        <line x1="122" y1="32" x2="183" y2="32" stroke={color} strokeWidth="2" />
        <line x1="122" y1="42" x2="178" y2="42" stroke={color} strokeWidth="1" strokeDasharray="2 2" />
        <line x1="122" y1="50" x2="180" y2="50" stroke={color} strokeWidth="1" strokeDasharray="2 2" />

        <rect x="205" y="20" width="75" height="85" fill="none" stroke={color} strokeWidth="1" />
        <line x1="212" y1="32" x2="273" y2="32" stroke={color} strokeWidth="2" />
        <line x1="212" y1="42" x2="268" y2="42" stroke={color} strokeWidth="1" strokeDasharray="2 2" />
      </svg>
    </div>
  );
};

export const LeisureDashboard: React.FC<LeisureDashboardProps> = ({ onBackToStudy }) => {
  // 1. Wings & Custom Slabs State + Persistent Wing Reordering
  const [wings, setWings] = useState<AtelierWing[]>(() => {
    let base = INITIAL_WINGS;
    const savedCustom = localStorage.getItem('medden_custom_atelier_slabs');
    if (savedCustom) {
      try {
        const parsed: AtelierSlab[] = JSON.parse(savedCustom);
        base = INITIAL_WINGS.map((w) => ({
          ...w,
          slabs: [...w.slabs, ...parsed.filter((s) => s.wingId === w.id)],
        }));
      } catch {}
    }
    try {
      const savedOrder = localStorage.getItem('medden_leisure_wing_order_v1');
      if (savedOrder) {
        const orderArr: string[] = JSON.parse(savedOrder);
        if (Array.isArray(orderArr) && orderArr.length > 0) {
          const map = new Map(base.map((w) => [w.id, w]));
          const ordered: AtelierWing[] = [];
          orderArr.forEach((id) => {
            const w = map.get(id);
            if (w) {
              ordered.push(w);
              map.delete(id);
            }
          });
          map.forEach((w) => ordered.push(w));
          return ordered;
        }
      }
    } catch {}
    return base;
  });

  const handleMoveWing = (wingId: string, direction: 'up' | 'down') => {
    setWings((prev) => {
      const idx = prev.findIndex((w) => w.id === wingId);
      if (idx === -1) return prev;
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= prev.length) return prev;
      const next = [...prev];
      const [moved] = next.splice(idx, 1);
      next.splice(targetIdx, 0, moved);
      try {
        localStorage.setItem('medden_leisure_wing_order_v1', JSON.stringify(next.map((w) => w.id)));
      } catch {}
      return next;
    });
  };

  // 2. UI Controls
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [starredSlabs, setStarredSlabs] = useState<Record<string, boolean>>(() => {
    try {
      return JSON.parse(localStorage.getItem('medden_starred_slabs') || '{}');
    } catch {
      return {};
    }
  });
  const [hiddenWings, setHiddenWings] = useState<Record<string, boolean>>({});
  const [isCompact, setIsCompact] = useState(() => localStorage.getItem('medden_compact_slabs') === 'true');
  const [sessionTimer, setSessionTimer] = useState(27); // 0:27 initial as in screenshot
  const [activeConsoleSlab, setActiveConsoleSlab] = useState<AtelierSlab | null>(null);
  const [commissionModalOpen, setCommissionModalOpen] = useState(false);
  const [commissionTargetWing, setCommissionTargetWing] = useState<string>('decompression');

  // Timer Tick
  useEffect(() => {
    const t = setInterval(() => setSessionTimer((p) => p + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleToggleStar = (slabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setStarredSlabs((prev) => {
      const updated = { ...prev, [slabId]: !prev[slabId] };
      localStorage.setItem('medden_starred_slabs', JSON.stringify(updated));
      return updated;
    });
  };

  const handleToggleHideWing = (wingId: string) => {
    setHiddenWings((prev) => ({ ...prev, [wingId]: !prev[wingId] }));
  };

  const handleToggleCompact = () => {
    setIsCompact((prev) => {
      const next = !prev;
      localStorage.setItem('medden_compact_slabs', String(next));
      return next;
    });
  };

  // 4. Custom Set Timer (Custom Duration, 5 Alarm Tones & Volume Control)
  type AlarmToneId = 'tibetan-bowl' | 'crystal-chime' | 'warm-harp' | 'temple-bell' | 'gentle-pulse';
  const ALARM_TONES: Array<{ id: AlarmToneId; label: string }> = [
    { id: 'tibetan-bowl', label: 'Tibetan Singing Bowl' },
    { id: 'crystal-chime', label: 'Crystal Chime' },
    { id: 'warm-harp', label: 'Warm Harp Arpeggio' },
    { id: 'temple-bell', label: 'Brass Temple Bell' },
    { id: 'gentle-pulse', label: 'Gentle Soft Pulse' },
  ];

  const [timerInputMinutes, setTimerInputMinutes] = useState<number>(10);
  const [timerInputSeconds, setTimerInputSeconds] = useState<number>(0);
  const [breakAlarmActive, setBreakAlarmActive] = useState<boolean>(false);
  const [breakAlarmSecondsLeft, setBreakAlarmSecondsLeft] = useState<number>(600);
  const [isBreakAlarmModalOpen, setIsBreakAlarmModalOpen] = useState<boolean>(false);
  const [showAlarmPicker, setShowAlarmPicker] = useState<boolean>(false);
  const [alarmTone, setAlarmTone] = useState<AlarmToneId>(() => {
    try {
      return (localStorage.getItem('medden_alarm_tone_v1') as AlarmToneId) || 'tibetan-bowl';
    } catch {
      return 'tibetan-bowl';
    }
  });
  const [alarmVolume, setAlarmVolume] = useState<number>(() => {
    try {
      const saved = Number(localStorage.getItem('medden_alarm_volume_v1'));
      return Number.isFinite(saved) && saved >= 0 && saved <= 100 ? saved : 70;
    } catch {
      return 70;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('medden_alarm_tone_v1', alarmTone);
    } catch {}
  }, [alarmTone]);

  useEffect(() => {
    try {
      localStorage.setItem('medden_alarm_volume_v1', String(alarmVolume));
    } catch {}
  }, [alarmVolume]);

  // Play selected synthesized alarm tone scaled by volume (0-100)
  const playChimeAlert = (toneOverride?: AlarmToneId, volumeOverride?: number) => {
    try {
      const vol = Math.max(0.02, Math.min(1, (volumeOverride ?? alarmVolume) / 100)) * 0.4;
      const chosenTone = toneOverride || alarmTone;
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();

      const triggerTone = (freq: number, delay: number, duration: number, type: OscillatorType = 'sine', peak = vol) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
        gain.gain.setValueAtTime(0.0001, ctx.currentTime + delay);
        gain.gain.linearRampToValueAtTime(peak, ctx.currentTime + delay + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + duration + 0.05);
      };

      if (chosenTone === 'tibetan-bowl') {
        triggerTone(220, 0, 2.2, 'sine', vol);
        triggerTone(440, 0, 1.8, 'sine', vol * 0.45);
        triggerTone(659.25, 0.05, 1.4, 'sine', vol * 0.25);
      } else if (chosenTone === 'crystal-chime') {
        [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => triggerTone(f, i * 0.16, 1.15, 'sine', vol));
      } else if (chosenTone === 'warm-harp') {
        [392, 493.88, 587.33, 783.99, 987.77].forEach((f, i) => triggerTone(f, i * 0.12, 1.0, 'triangle', vol * 0.85));
      } else if (chosenTone === 'temple-bell') {
        triggerTone(329.63, 0, 1.5, 'triangle', vol);
        triggerTone(493.88, 0.02, 1.3, 'sine', vol * 0.5);
        triggerTone(329.63, 0.75, 1.5, 'triangle', vol * 0.8);
      } else {
        // gentle-pulse
        [0, 0.38, 0.76].forEach((d) => triggerTone(440, d, 0.3, 'sine', vol * 0.8));
      }
    } catch {}
  };

  // Custom Set Timer Tick
  useEffect(() => {
    let interval: any = null;
    if (breakAlarmActive && breakAlarmSecondsLeft > 0) {
      interval = setInterval(() => {
        setBreakAlarmSecondsLeft((prev) => {
          if (prev <= 1) {
            setBreakAlarmActive(false);
            playChimeAlert(alarmTone, alarmVolume);
            setIsBreakAlarmModalOpen(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [breakAlarmActive, breakAlarmSecondsLeft, alarmTone, alarmVolume]);

  const handleStartCustomTimer = (mins = timerInputMinutes, secs = timerInputSeconds) => {
    const total = Math.max(1, mins * 60 + secs);
    setBreakAlarmSecondsLeft(total);
    setBreakAlarmActive(true);
  };

  // 5. Custom Slab Logo & Thumbnail State
  const [customSlabLogos, setCustomSlabLogos] = useState<Record<string, string>>(() => {
    try {
      return JSON.parse(localStorage.getItem('medden_custom_slab_logos') || '{}');
    } catch {
      return {};
    }
  });
  const [logoPickerSlabId, setLogoPickerSlabId] = useState<string | null>(null);
  const [customLogoInput, setCustomLogoInput] = useState<string>('');

  const handleSaveCustomLogo = (slabId: string, logoOrUrl: string) => {
    setCustomSlabLogos((prev) => {
      const next = { ...prev, [slabId]: logoOrUrl };
      localStorage.setItem('medden_custom_slab_logos', JSON.stringify(next));
      return next;
    });
    setLogoPickerSlabId(null);
    setCustomLogoInput('');
  };

  const handleResetCustomLogo = (slabId: string) => {
    setCustomSlabLogos((prev) => {
      const next = { ...prev };
      delete next[slabId];
      localStorage.setItem('medden_custom_slab_logos', JSON.stringify(next));
      return next;
    });
    setLogoPickerSlabId(null);
  };

  // 6. Post-MBBS & Overseas Jobs State
  const [postMbbsJobs, setPostMbbsJobs] = useState<PostMbbsOpportunity[]>(() => {
    try {
      const saved = localStorage.getItem('medden_post_mbbs_jobs');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_POST_MBBS_OPPORTUNITIES;
  });
  const [careerCategoryFilter, setCareerCategoryFilter] = useState<string>('all');
  const [careerSearch, setCareerSearch] = useState<string>('');
  const [isAddJobModalOpen, setIsAddJobModalOpen] = useState<boolean>(false);
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobCountry, setNewJobCountry] = useState('Global / UK');
  const [newJobSalary, setNewJobSalary] = useState('');
  const [newJobOrg, setNewJobOrg] = useState('');
  const [newJobLink, setNewJobLink] = useState('');
  const [newJobContact, setNewJobContact] = useState('');
  const [newJobDesc, setNewJobDesc] = useState('');

  const handleAddJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobTitle.trim()) return;
    const created: PostMbbsOpportunity = {
      id: `opp-custom-${Date.now()}`,
      title: newJobTitle,
      category: 'global-exam',
      country: newJobCountry,
      stipendSalary: newJobSalary || 'Competitive / Band 5-7',
      organization: newJobOrg || 'International Health Agency',
      link: newJobLink || '#',
      contactEmail: newJobContact || 'recruitment@health-global.org',
      verified: true,
      description: newJobDesc || 'Community submitted verified medical career opportunity.',
      tags: ['Community Directory', 'Public Listing', newJobCountry, 'Verified'],
    };
    const updated = [created, ...postMbbsJobs];
    setPostMbbsJobs(updated);
    localStorage.setItem('medden_post_mbbs_jobs', JSON.stringify(updated));
    setIsAddJobModalOpen(false);
    setNewJobTitle('');
    setNewJobSalary('');
    setNewJobOrg('');
    setNewJobLink('');
    setNewJobContact('');
    setNewJobDesc('');
  };

  // 3. Web Audio Synthesizer (10 Peace Sounds) Engine
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioType, setAudioType] = useState<PeaceSoundType>('rain');
  const [soundDuration, setSoundDuration] = useState<number>(10);
  const [soundTimeRemaining, setSoundTimeRemaining] = useState<number>(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioIntervalRef = useRef<any>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const timerIntervalRef = useRef<any>(null);

  const stopAudio = () => {
    if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (audioContextRef.current) {
      try {
        if (masterGainRef.current) {
          masterGainRef.current.gain.linearRampToValueAtTime(0.001, audioContextRef.current.currentTime + 0.15);
        }
        setTimeout(() => {
          if (audioContextRef.current) {
            audioContextRef.current.close().catch(() => {});
            audioContextRef.current = null;
          }
        }, 160);
      } catch {
        audioContextRef.current = null;
      }
    }
    setIsAudioPlaying(false);
    setSoundTimeRemaining(0);
  };

  const playSound = (type: PeaceSoundType) => {
    if (isAudioPlaying && audioType === type) {
      stopAudio();
      return;
    }
    if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }

    setAudioType(type);

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.09, ctx.currentTime);
      masterGain.connect(ctx.destination);
      masterGainRef.current = masterGain;

      const createPinkNoiseBuffer = () => {
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
          b6 = white * 0.115926;
        }
        return buffer;
      };

      const createWhiteNoiseBuffer = (seconds = 2) => {
        const bufferSize = ctx.sampleRate * seconds;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * 0.14;
        }
        return buffer;
      };

      if (type === 'rain') {
        const noise = ctx.createBufferSource();
        noise.buffer = createPinkNoiseBuffer();
        noise.loop = true;
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(680, ctx.currentTime);
        noise.connect(filter);
        filter.connect(masterGain);
        noise.start();
      } else if (type === 'forest') {
        const noise = ctx.createBufferSource();
        noise.buffer = createPinkNoiseBuffer();
        noise.loop = true;
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(950, ctx.currentTime);
        filter.Q.setValueAtTime(1.2, ctx.currentTime);

        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(0.12, ctx.currentTime);
        lfoGain.gain.setValueAtTime(320, ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        lfo.start();

        noise.connect(filter);
        filter.connect(masterGain);
        noise.start();
      } else if (type === 'ocean') {
        const noise = ctx.createBufferSource();
        noise.buffer = createPinkNoiseBuffer();
        noise.loop = true;
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, ctx.currentTime);

        const swellGain = ctx.createGain();
        swellGain.gain.setValueAtTime(0.04, ctx.currentTime);

        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(0.14, ctx.currentTime);
        lfoGain.gain.setValueAtTime(0.06, ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(swellGain.gain);
        lfo.start();

        noise.connect(filter);
        filter.connect(swellGain);
        swellGain.connect(masterGain);
        noise.start();
      } else if (type === 'fireplace') {
        const noise = ctx.createBufferSource();
        noise.buffer = createPinkNoiseBuffer();
        noise.loop = true;
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(220, ctx.currentTime);
        const rumbleGain = ctx.createGain();
        rumbleGain.gain.setValueAtTime(0.06, ctx.currentTime);
        noise.connect(filter);
        filter.connect(rumbleGain);
        rumbleGain.connect(masterGain);
        noise.start();

        const popBuffer = createWhiteNoiseBuffer(0.04);
        audioIntervalRef.current = setInterval(() => {
          if (!audioContextRef.current || audioContextRef.current.state === 'closed') return;
          try {
            const pop = ctx.createBufferSource();
            pop.buffer = popBuffer;
            const popFilter = ctx.createBiquadFilter();
            popFilter.type = 'bandpass';
            popFilter.frequency.setValueAtTime(2400 + Math.random() * 2000, ctx.currentTime);
            const popGain = ctx.createGain();
            const vol = 0.03 + Math.random() * 0.07;
            popGain.gain.setValueAtTime(vol, ctx.currentTime);
            popGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.035);
            pop.connect(popFilter);
            popFilter.connect(popGain);
            popGain.connect(masterGain);
            pop.start();
          } catch {}
        }, 200);
      } else if (type === 'zen-bell') {
        const playBowl = () => {
          if (!audioContextRef.current || audioContextRef.current.state === 'closed') return;
          try {
            const now = ctx.currentTime;
            [432, 864].forEach((freq, idx) => {
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.type = 'sine';
              osc.frequency.setValueAtTime(freq, now);
              const initialVol = idx === 0 ? 0.08 : 0.03;
              gain.gain.setValueAtTime(0.001, now);
              gain.gain.linearRampToValueAtTime(initialVol, now + 0.08);
              gain.gain.exponentialRampToValueAtTime(0.0001, now + 5.2);
              osc.connect(gain);
              gain.connect(masterGain);
              osc.start(now);
              osc.stop(now + 5.3);
            });
          } catch {}
        };
        playBowl();
        audioIntervalRef.current = setInterval(playBowl, 5500);
      } else if (type === 'library') {
        const noise = ctx.createBufferSource();
        noise.buffer = createPinkNoiseBuffer();
        noise.loop = true;
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(260, ctx.currentTime);
        const libGain = ctx.createGain();
        libGain.gain.setValueAtTime(0.05, ctx.currentTime);
        noise.connect(filter);
        filter.connect(libGain);
        libGain.connect(masterGain);
        noise.start();
      } else if (type === 'crickets') {
        const chirpCricket = () => {
          if (!audioContextRef.current || audioContextRef.current.state === 'closed') return;
          try {
            const now = ctx.currentTime;
            for (let i = 0; i < 3; i++) {
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.type = 'triangle';
              osc.frequency.setValueAtTime(4500 + Math.random() * 200, now + i * 0.06);
              gain.gain.setValueAtTime(0.001, now + i * 0.06);
              gain.gain.linearRampToValueAtTime(0.025, now + i * 0.06 + 0.015);
              gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.06 + 0.045);
              osc.connect(gain);
              gain.connect(masterGain);
              osc.start(now + i * 0.06);
              osc.stop(now + i * 0.06 + 0.05);
            }
          } catch {}
        };
        chirpCricket();
        audioIntervalRef.current = setInterval(chirpCricket, 900);
      } else if (type === 'cafe') {
        const noise = ctx.createBufferSource();
        noise.buffer = createPinkNoiseBuffer();
        noise.loop = true;
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(750, ctx.currentTime);
        filter.Q.setValueAtTime(1.0, ctx.currentTime);
        const cafeGain = ctx.createGain();
        cafeGain.gain.setValueAtTime(0.07, ctx.currentTime);
        noise.connect(filter);
        filter.connect(cafeGain);
        cafeGain.connect(masterGain);
        noise.start();
      } else if (type === 'waterfall') {
        const noise = ctx.createBufferSource();
        noise.buffer = createWhiteNoiseBuffer(2);
        noise.loop = true;
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1050, ctx.currentTime);
        const wfGain = ctx.createGain();
        wfGain.gain.setValueAtTime(0.08, ctx.currentTime);
        noise.connect(filter);
        filter.connect(wfGain);
        wfGain.connect(masterGain);
        noise.start();
      } else if (type === 'wind-chimes') {
        const PENTATONIC = [523.25, 659.25, 783.99, 880.00, 1046.50, 1174.66];
        const strikeChime = () => {
          if (!audioContextRef.current || audioContextRef.current.state === 'closed') return;
          try {
            const count = 1 + Math.floor(Math.random() * 2);
            for (let c = 0; c < count; c++) {
              const freq = PENTATONIC[Math.floor(Math.random() * PENTATONIC.length)];
              const now = ctx.currentTime + c * 0.18;
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.type = 'sine';
              osc.frequency.setValueAtTime(freq, now);
              gain.gain.setValueAtTime(0.001, now);
              gain.gain.linearRampToValueAtTime(0.04, now + 0.02);
              gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);
              osc.connect(gain);
              gain.connect(masterGain);
              osc.start(now);
              osc.stop(now + 3.3);
            }
          } catch {}
        };
        strikeChime();
        audioIntervalRef.current = setInterval(strikeChime, 2400);
      }

      setIsAudioPlaying(true);

      if (soundDuration > 0) {
        const totalSec = soundDuration * 60;
        setSoundTimeRemaining(totalSec);
        timerIntervalRef.current = setInterval(() => {
          setSoundTimeRemaining((prev) => {
            if (prev <= 1) {
              stopAudio();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setSoundTimeRemaining(0);
      }
    } catch {
      setIsAudioPlaying(true);
    }
  };

  const toggleAudio = (type: PeaceSoundType = audioType) => {
    playSound(type);
  };

  // 4. Box Breathing State
  const [breathingPhase, setBreathingPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Inhale');
  const [breathingSecondsLeft, setBreathingSecondsLeft] = useState(4);
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [completedBreathingCycles, setCompletedBreathingCycles] = useState(0);

  useEffect(() => {
    let timer: any;
    if (isBreathingActive) {
      timer = setInterval(() => {
        setBreathingSecondsLeft((prev) => {
          if (prev <= 1) {
            setBreathingPhase((curr) => {
              if (curr === 'Inhale') return 'Hold';
              if (curr === 'Hold') return 'Exhale';
              if (curr === 'Exhale') return 'Rest';
              setCompletedBreathingCycles((c) => c + 1);
              return 'Inhale';
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isBreathingActive]);

  // 5. Word Scramble Game State (True Fisher-Yates letter shuffle + hints)
  const [wordIdx, setWordIdx] = useState(0);
  const [userGuess, setUserGuess] = useState('');
  const [gameFeedback, setGameFeedback] = useState<string | null>(null);
  const [gameScore, setGameScore] = useState(0);
  const [scrambleHintLetters, setScrambleHintLetters] = useState(0);
  const currentScramble = SCRAMBLE_WORDS[wordIdx % SCRAMBLE_WORDS.length];

  const shuffleLetters = (word: string): string => {
    const arr = word.toUpperCase().split('');
    if (arr.length < 2) return word.toUpperCase();
    for (let attempt = 0; attempt < 6; attempt++) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      if (arr.join('') !== word.toUpperCase()) break;
    }
    return arr.join('');
  };

  const [scrambledDisplay, setScrambledDisplay] = useState(() => shuffleLetters(SCRAMBLE_WORDS[0].word));
  useEffect(() => {
    setScrambledDisplay(shuffleLetters(currentScramble?.word || 'SYNAPSE'));
    setScrambleHintLetters(0);
  }, [wordIdx, currentScramble?.word]);

  const handleCheckWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userGuess.trim()) return;
    if (userGuess.trim().toUpperCase() === currentScramble.word.toUpperCase()) {
      setGameFeedback('Correct! +10 Points');
      setGameScore((s) => s + 10);
      setTimeout(() => {
        setWordIdx((i) => i + 1);
        setUserGuess('');
        setGameFeedback(null);
      }, 1000);
    } else {
      setGameFeedback('Try again or reveal a hint letter!');
      setTimeout(() => setGameFeedback(null), 1500);
    }
  };

  // 5B. Interactive States for Every Wing & Slab Console
  // Ocular 20-20-20 countdown
  const [ocularSeconds, setOcularSeconds] = useState(20);
  const [ocularActive, setOcularActive] = useState(false);
  useEffect(() => {
    if (!ocularActive) return;
    const t = setInterval(() => {
      setOcularSeconds((p) => {
        if (p <= 1) {
          setOcularActive(false);
          playChimeAlert();
          return 20;
        }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [ocularActive]);

  // Stretches active countdown
  const [activeStretchIdx, setActiveStretchIdx] = useState<number | null>(null);
  const [stretchSeconds, setStretchSeconds] = useState(0);
  useEffect(() => {
    if (activeStretchIdx === null || stretchSeconds <= 0) return;
    const t = setInterval(() => {
      setStretchSeconds((p) => {
        if (p <= 1) {
          setActiveStretchIdx(null);
          playChimeAlert();
          return 0;
        }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [activeStretchIdx, stretchSeconds]);

  // Power Nap countdown
  const [napSecondsLeft, setNapSecondsLeft] = useState(0);
  const [napLabel, setNapLabel] = useState<string | null>(null);
  useEffect(() => {
    if (!napLabel || napSecondsLeft <= 0) return;
    const t = setInterval(() => {
      setNapSecondsLeft((p) => {
        if (p <= 1) {
          setNapLabel(null);
          playChimeAlert();
          return 0;
        }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [napLabel, napSecondsLeft]);

  // Logic Puzzles (coding)
  const [logicIdx, setLogicIdx] = useState(0);
  const [logicSelectedOpt, setLogicSelectedOpt] = useState<number | null>(null);
  const [logicScore, setLogicScore] = useState(0);

  // Medical Trivia (vocab)
  const [vocabIdx, setVocabIdx] = useState(0);
  const [vocabSelectedOpt, setVocabSelectedOpt] = useState<number | null>(null);
  const [vocabScore, setVocabScore] = useState(0);

  // Interactive 8x8 Chess Tactical Puzzles
  const [chessPuzzleIdx, setChessPuzzleIdx] = useState(0);
  const [chessSelectedSq, setChessSelectedSq] = useState<string | null>(null);
  const [chessStatus, setChessStatus] = useState<'idle' | 'solved' | 'wrong'>('idle');

  // Language Bytes Flashcards & Poetry Haiku
  const [langFilter, setLangFilter] = useState<'ALL' | 'ER Spanish' | 'Latin/Greek Roots'>('ALL');
  const [langFlippedMap, setLangFlippedMap] = useState<Record<string, boolean>>({});
  const [poemIdx, setPoemIdx] = useState(0);
  const [haikuDraft, setHaikuDraft] = useState(() => localStorage.getItem('medden_haiku_draft') || 'Quiet ward lights glow\nStethoscope cools by the desk\nDawn brings gentle strength');
  const [idiomIdx, setIdiomIdx] = useState(0);
  const [idiomQuizChoice, setIdiomQuizChoice] = useState<number | null>(null);

  // Human Mind: Psychology Body-Language & Biases Casino
  const [psychTab, setPsychTab] = useState<'biases' | 'body'>('biases');
  const [casinoIdx, setCasinoIdx] = useState(0);
  const [casinoChips, setCasinoChips] = useState(100);
  const [casinoBet, setCasinoBet] = useState(25);
  const [casinoChoice, setCasinoChoice] = useState<number | null>(null);

  // Social Systems (Sociology + Biophilic Urbanism)
  const [socCaseIdx, setSocCaseIdx] = useState(0);
  const [socRevealed, setSocRevealed] = useState<Record<number, boolean>>({});
  const [urbanPolicies, setUrbanPolicies] = useState<Record<string, boolean>>({
    trees: true,
    bike: true,
    transit: false,
    quiet: false,
  });

  // Civilization (History, Interactive Map Pins, Heritage Walk)
  const [historyIdx, setHistoryIdx] = useState(0);
  const [mapPlaceIdx, setMapPlaceIdx] = useState(0);
  const [heritageStopIdx, setHeritageStopIdx] = useState(0);

  // Aesthetic Mind (Art, Fashion, Architecture)
  const [artIdx, setArtIdx] = useState(0);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [fashionIdx, setFashionIdx] = useState(0);
  const [archBase, setArchBase] = useState(100);

  // High Performance (Motorsport 5-Light F1 Reaction Timer)
  const [f1Stage, setF1Stage] = useState<'idle' | 'countdown' | 'go' | 'done' | 'false-start'>('idle');
  const [f1LightsCount, setF1LightsCount] = useState(0);
  const [f1ReactionMs, setF1ReactionMs] = useState<number | null>(null);
  const [f1BestMs, setF1BestMs] = useState<number | null>(null);
  const f1GoTimestampRef = useRef<number>(0);
  const f1TimersRef = useRef<any[]>([]);

  const clearF1Timers = () => {
    f1TimersRef.current.forEach((t) => clearTimeout(t));
    f1TimersRef.current = [];
  };

  const handleStartF1Sequence = () => {
    clearF1Timers();
    setF1Stage('countdown');
    setF1LightsCount(0);
    setF1ReactionMs(null);
    for (let i = 1; i <= 5; i++) {
      const t = setTimeout(() => setF1LightsCount(i), i * 550);
      f1TimersRef.current.push(t);
    }
    const randomDelay = 5 * 550 + 700 + Math.floor(Math.random() * 1400);
    const goTimer = setTimeout(() => {
      setF1LightsCount(0);
      setF1Stage('go');
      f1GoTimestampRef.current = performance.now();
    }, randomDelay);
    f1TimersRef.current.push(goTimer);
  };

  const handleF1React = () => {
    if (f1Stage === 'countdown') {
      clearF1Timers();
      setF1Stage('false-start');
      return;
    }
    if (f1Stage === 'go') {
      const ms = Math.round(performance.now() - f1GoTimestampRef.current);
      setF1ReactionMs(ms);
      setF1BestMs((prev) => (prev === null || ms < prev ? ms : prev));
      setF1Stage('done');
    }
  };

  useEffect(() => () => clearF1Timers(), []);

  // Daily Pulse (World vs India News, Magazines Reader)
  const [newsTab, setNewsTab] = useState<'world' | 'india'>('world');
  const [magIdx, setMagIdx] = useState(0);

  // Custom Slab Scratchpad
  const [customSlabNotes, setCustomSlabNotes] = useState<Record<string, string>>(() => {
    try {
      return JSON.parse(localStorage.getItem('medden_custom_slab_notes') || '{}');
    } catch {
      return {};
    }
  });

  // 6. Commission a Slab Handler
  const [newSlabForm, setNewSlabForm] = useState({
    name: '',
    tagline: '',
    wingId: 'decompression',
    icon: '☕',
    modulesCount: 3,
  });

  const handleCreateSlab = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlabForm.name.trim()) return;

    const newSlab: AtelierSlab = {
      id: `slab-custom-${Date.now()}`,
      wingId: newSlabForm.wingId,
      name: newSlabForm.name.trim(),
      tagline: newSlabForm.tagline.trim() || 'Custom curated leisure slab',
      badge: 'CUSTOM SLAB',
      modulesCount: newSlabForm.modulesCount || 3,
      icon: newSlabForm.icon || '☕',
      bannerType: 'ripple',
      primaryColor: '#A47C43',
      consoleId: 'custom',
      isCustom: true,
    };

    setWings((prevWings) => {
      const updated = prevWings.map((w) => {
        if (w.id === newSlabForm.wingId) {
          return { ...w, slabs: [...w.slabs, newSlab] };
        }
        return w;
      });

      // Persist custom slabs
      try {
        const allCustom: AtelierSlab[] = [];
        updated.forEach((w) => allCustom.push(...w.slabs.filter((s) => s.isCustom)));
        localStorage.setItem('medden_custom_atelier_slabs', JSON.stringify(allCustom));
      } catch {}

      return updated;
    });

    setCommissionModalOpen(false);
    setNewSlabForm({
      name: '',
      tagline: '',
      wingId: 'decompression',
      icon: '☕',
      modulesCount: 3,
    });
  };

  // Filtered Wings and Slabs
  const filteredWings = wings
    .filter((w) => !activeCategoryFilter || w.id === activeCategoryFilter)
    .map((w) => {
      let slabs = w.slabs;
      if (showFavoritesOnly) {
        slabs = slabs.filter((s) => starredSlabs[s.id]);
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        slabs = slabs.filter(
          (s) =>
            s.name.toLowerCase().includes(q) ||
            s.tagline.toLowerCase().includes(q) ||
            s.badge.toLowerCase().includes(q)
        );
      }
      return { ...w, slabs };
    });

  // Calculate total counts
  const totalSlabsCount = wings.reduce((acc, w) => acc + w.slabs.length, 0);

  return (
    <div className="leisure-surface flex-1 flex flex-col text-stone-900 dark:text-stone-100 min-h-screen overflow-x-hidden select-text transition-colors">
      {/* ========================================================================= */}
      {/* 1. TOP UTILITY BAR (No repeated section title)                            */}
      {/* ========================================================================= */}
      <div className="themed-glass-bar px-5 sm:px-8 py-2.5 border-b border-stone-200/80 dark:border-[#492d1b] bg-[#faf7f0]/88 dark:bg-[#22140c]/92 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 sticky top-0 z-30 shadow-2xs">
        {/* Left: Custom Set Timer with 5 Alarm Tones & Volume */}
        <div className="flex items-center gap-2.5 relative">
          <button
            type="button"
            onClick={() => setShowAlarmPicker((v) => !v)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-mono transition-all cursor-pointer ${
              breakAlarmActive
                ? 'bg-[#A47C43] text-white border-transparent shadow-sm'
                : 'bg-stone-100 dark:bg-[#1a120d] border-stone-200 dark:border-[#382518] text-stone-800 dark:text-stone-200 hover:border-amber-500'
            }`}
            title="Configure custom rest timer, alarm tone & volume"
          >
            {breakAlarmActive ? <Bell className="w-3.5 h-3.5 animate-bounce" /> : <Clock className="w-3.5 h-3.5 text-[#A47C43]" />}
            <span className="font-semibold">
              {breakAlarmActive ? `Set Timer · ${formatTimer(breakAlarmSecondsLeft)}` : 'Set Timer'}
            </span>
          </button>

          {showAlarmPicker && (
            <div className="themed-glass-card absolute left-0 top-full mt-2 w-80 bg-white dark:bg-[#18110c] border border-stone-200 dark:border-[#382518] rounded-2xl shadow-2xl p-4 z-50 text-xs space-y-3.5">
              <div className="flex items-center justify-between border-b border-stone-200/80 dark:border-[#352317] pb-2">
                <span className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">Custom Timer &amp; Alarm</span>
                <button
                  type="button"
                  onClick={() => setShowAlarmPicker(false)}
                  className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Minutes & Seconds Custom Inputs */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-stone-500 dark:text-stone-400 mb-1">Minutes</label>
                  <input
                    type="number"
                    min={0}
                    max={180}
                    value={timerInputMinutes}
                    onChange={(e) => setTimerInputMinutes(Math.max(0, Math.min(180, Number(e.target.value) || 0)))}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-stone-200 dark:border-[#382518] bg-stone-50 dark:bg-[#120c08] font-mono text-xs text-stone-900 dark:text-stone-100 outline-none focus:border-[#A47C43]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase text-stone-500 dark:text-stone-400 mb-1">Seconds</label>
                  <input
                    type="number"
                    min={0}
                    max={59}
                    value={timerInputSeconds}
                    onChange={(e) => setTimerInputSeconds(Math.max(0, Math.min(59, Number(e.target.value) || 0)))}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-stone-200 dark:border-[#382518] bg-stone-50 dark:bg-[#120c08] font-mono text-xs text-stone-900 dark:text-stone-100 outline-none focus:border-[#A47C43]"
                  />
                </div>
              </div>

              {/* Quick Presets */}
              <div className="flex flex-wrap gap-1.5">
                {[2, 5, 10, 15, 25, 45].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      setTimerInputMinutes(m);
                      setTimerInputSeconds(0);
                      handleStartCustomTimer(m, 0);
                    }}
                    className="px-2 py-1 rounded-lg bg-stone-100 hover:bg-[#A47C43]/20 dark:bg-[#241911] dark:hover:bg-[#A47C43]/30 text-[10.5px] font-mono text-stone-700 dark:text-stone-300 cursor-pointer"
                  >
                    {m}m
                  </button>
                ))}
              </div>

              {/* 5 Alarm Tones with Preview */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-mono uppercase text-stone-500 dark:text-stone-400">Alarm Tone (5 Sounds)</div>
                <div className="space-y-1 max-h-36 overflow-y-auto custom-scrollbar pr-1">
                  {ALARM_TONES.map((t) => {
                    const selected = alarmTone === t.id;
                    return (
                      <div
                        key={t.id}
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl transition-colors ${
                          selected
                            ? 'bg-[#A47C43]/20 border border-[#A47C43]/50 text-[#5c3c14] dark:text-[#f2dec0] font-semibold'
                            : 'bg-stone-50 dark:bg-[#120c08] border border-transparent text-stone-700 dark:text-stone-300'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setAlarmTone(t.id);
                            playChimeAlert(t.id, alarmVolume);
                          }}
                          className="flex-1 text-left flex items-center gap-1.5 cursor-pointer"
                        >
                          <Volume2 className="w-3 h-3 text-[#A47C43] shrink-0" />
                          <span className="text-[11px]">{t.label}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => playChimeAlert(t.id, alarmVolume)}
                          className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 hover:bg-[#A47C43]/30 cursor-pointer"
                          title="Preview alarm tone"
                        >
                          Preview
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Volume Slider (0% - 100%) */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10.5px] font-mono text-stone-600 dark:text-stone-400">
                  <span>Alarm Volume</span>
                  <span className="font-bold text-[#A47C43]">{alarmVolume}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={alarmVolume}
                  onChange={(e) => setAlarmVolume(Number(e.target.value))}
                  className="w-full accent-[#A47C43] cursor-pointer"
                />
              </div>

              {/* Timer Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    if (breakAlarmActive) {
                      setBreakAlarmActive(false);
                    } else {
                      handleStartCustomTimer(timerInputMinutes, timerInputSeconds);
                    }
                  }}
                  className="themed-accent-btn flex-1 py-1.5 rounded-xl bg-[#A47C43] hover:bg-[#8e6834] text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {breakAlarmActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{breakAlarmActive ? 'Pause Timer' : 'Start Timer'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBreakAlarmActive(false);
                    setBreakAlarmSecondsLeft(timerInputMinutes * 60 + timerInputSeconds);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-stone-200 dark:bg-[#241911] text-stone-700 dark:text-stone-300 font-semibold text-xs cursor-pointer"
                >
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2.5">
          {/* Compact Cards Toggle */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-stone-100 dark:bg-[#1a120d] border border-stone-200 dark:border-[#382518] text-xs text-stone-700 dark:text-stone-300">
            <SlidersHorizontal className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400" />
            <span className="text-[11px] hidden sm:inline">Compact</span>
            <button
              type="button"
              onClick={handleToggleCompact}
              className={`w-7 h-4 rounded-full transition-colors relative cursor-pointer ${
                isCompact ? 'bg-amber-600' : 'bg-stone-300 dark:bg-stone-700'
              }`}
            >
              <div
                className={`w-3 h-3 rounded-full bg-white transition-transform transform absolute top-0.5 ${
                  isCompact ? 'translate-x-3.5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* + Commission a Slab Button */}
          <button
            type="button"
            onClick={() => {
              setCommissionTargetWing('decompression');
              setCommissionModalOpen(true);
            }}
            className="px-3.5 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 dark:bg-[#1a120d] dark:hover:bg-[#251a12] text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-[#382518] text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Commission a slab</span>
          </button>

          {/* Resume Study Notes Button (Primary Bright CTA) */}
          {onBackToStudy && (
            <button
              type="button"
              onClick={onBackToStudy}
              className="themed-accent-btn px-4 py-1.5 rounded-full bg-[#A47C43] hover:bg-[#8f6730] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Resume study</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN SCROLLABLE ATELIER CONTAINER                                      */}
      {/* ========================================================================= */}
      <div className="flex-1 overflow-y-auto px-5 sm:px-8 py-5 space-y-6 max-w-[1550px] mx-auto w-full custom-scrollbar">
        {/* ======================================================================= */}
        {/* SEARCH & FILTERS BAR                                                    */}
        {/* ======================================================================= */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search slabs, tags, moods..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="themed-glass-card w-full bg-white dark:bg-[#160f0b] border border-stone-200 dark:border-[#382518] rounded-full pl-9 pr-4 py-2 text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 outline-none focus:border-amber-500 transition-colors shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Favorites Pill */}
            <button
              type="button"
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`px-3.5 py-2 rounded-full text-xs font-medium border flex items-center gap-1.5 transition-all cursor-pointer ${
                showFavoritesOnly
                  ? 'themed-soft-pill bg-amber-500/20 border-amber-500/60 text-amber-700 dark:text-amber-300 font-bold'
                  : 'themed-glass-card bg-white dark:bg-[#160f0b] border-stone-200 dark:border-[#382518] text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${showFavoritesOnly ? 'fill-amber-400 text-amber-500 dark:text-amber-400' : ''}`} />
              <span>Favorites</span>
            </button>

            {/* + Commission with AI */}
            <button
              type="button"
              onClick={() => {
                setCommissionTargetWing('cognitive');
                setCommissionModalOpen(true);
              }}
              className="themed-glass-card px-3.5 py-2 rounded-full bg-white dark:bg-[#1a120d] border border-stone-200 dark:border-[#382518] hover:border-amber-400 text-stone-700 dark:text-stone-200 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Commission a slab with AI</span>
            </button>
          </div>

          {/* Category Filter Pills Row (All 9 Wings) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
            <button
              type="button"
              onClick={() => setActiveCategoryFilter(null)}
              className={`px-3 py-1 rounded-full text-[11px] font-mono whitespace-nowrap transition-all cursor-pointer ${
                activeCategoryFilter === null
                  ? 'themed-tab-active bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-bold shadow-xs'
                  : 'themed-glass-card bg-white dark:bg-[#160f0b] text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 border border-stone-200 dark:border-[#382518]'
              }`}
            >
              ALL WINGS ({wings.length})
            </button>

            {wings.map((w) => {
              const isSelected = activeCategoryFilter === w.id;
              return (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => setActiveCategoryFilter(isSelected ? null : w.id)}
                  className={`px-3 py-1 rounded-full text-[11px] font-mono uppercase whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'themed-tab-active bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-bold shadow-xs'
                      : 'themed-glass-card bg-white dark:bg-[#160f0b] text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 border border-stone-200 dark:border-[#382518]'
                  }`}
                >
                  <span>{w.icon}</span>
                  <span>
                    {w.badge} {w.slabs.length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ======================================================================= */}
        {/* 3. WINGS & SLABS GRID                                                   */}
        {/* ======================================================================= */}
        <div className="space-y-10">
          {filteredWings.map((wing) => {
            const isHidden = hiddenWings[wing.id];

            return (
              <section key={wing.id} className="space-y-4">
                {/* Wing Header - Clean Title in Warm Brown, Wing Icons & Repeated Descriptions Removed */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-900/20 dark:border-amber-900/30 pb-3">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h2 className="text-lg sm:text-xl font-serif font-semibold text-[#5c351c]/90 dark:text-[#e8dccb]/90 tracking-normal">
                      {wing.title}
                    </h2>
                  </div>

                  {/* Right Action Buttons (including Up/Down wing reordering) */}
                  <div className="flex items-center gap-1.5 sm:gap-2 self-end sm:self-center flex-wrap">
                    <div className="flex items-center rounded-lg border border-amber-900/20 dark:border-[#3d291c] bg-stone-100 dark:bg-[#18110c] overflow-hidden">
                      <button
                        type="button"
                        disabled={wings.findIndex((w) => w.id === wing.id) === 0}
                        onClick={() => handleMoveWing(wing.id, 'up')}
                        className="p-1.5 text-[#5c351c] dark:text-[#d4a373] hover:bg-stone-200 dark:hover:bg-[#251a12] disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed transition-colors"
                        title="Move wing up"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <div className="w-px h-4 bg-amber-900/15 dark:bg-[#3d291c]" />
                      <button
                        type="button"
                        disabled={wings.findIndex((w) => w.id === wing.id) === wings.length - 1}
                        onClick={() => handleMoveWing(wing.id, 'down')}
                        className="p-1.5 text-[#5c351c] dark:text-[#d4a373] hover:bg-stone-200 dark:hover:bg-[#251a12] disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed transition-colors"
                        title="Move wing down"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setCommissionTargetWing(wing.id);
                        setCommissionModalOpen(true);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-[#18110c] dark:hover:bg-[#251a12] text-[#5c351c] dark:text-[#d4a373] border border-amber-900/20 dark:border-[#3d291c] text-[10px] font-mono uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3 h-3 text-amber-600" />
                      <span>New slab</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleHideWing(wing.id)}
                      className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-[#18110c] dark:hover:bg-[#251a12] text-[#784421] dark:text-stone-400 border border-amber-900/20 dark:border-[#382518] text-[10px] font-mono uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      {isHidden ? 'Show wing' : 'Hide wing'}
                    </button>
                  </div>
                </div>

                {/* Slabs Grid (Hidden if collapsed) — Dramatic Compact vs Full Showcase contrast */}
                {!isHidden && (
                  <div
                    className={
                      isCompact
                        ? 'grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
                        : 'grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
                    }
                  >
                    {/* Render Each Slab Card */}
                    {wing.slabs.map((slab) => {
                      const isStarred = Boolean(starredSlabs[slab.id]);
                      const realPhoto = SLAB_REAL_PHOTOS[slab.id];

                      if (isCompact) {
                        return (
                          <div
                            key={slab.id}
                            onClick={() => setActiveConsoleSlab(slab)}
                            className="themed-glass-card group bg-white dark:bg-[#18110c] hover:bg-amber-50/40 dark:hover:bg-[#221811] border border-amber-900/15 dark:border-[#382518] hover:border-amber-600/50 rounded-xl p-1.5 transition-all duration-200 flex items-center gap-2.5 cursor-pointer relative shadow-2xs hover:shadow-sm min-h-[54px]"
                          >
                            <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-[#140e0a] shrink-0">
                              <SlabThumbnail
                                slab={slab}
                                src={realPhoto}
                                customLogo={customSlabLogos[slab.id]}
                                compact={true}
                              />
                            </div>

                            <div className="flex-1 min-w-0">
                              <h3 className="font-serif text-[13.5px] font-bold text-[#5c351c] dark:text-[#f5eedc] group-hover:text-amber-700 dark:group-hover:text-amber-200 transition-colors truncate leading-tight">
                                {slab.name}
                              </h3>
                              <div className="text-[9px] font-mono text-[#8c532b] dark:text-stone-400 mt-0.5 flex items-center gap-1.5">
                                <span>{slab.modulesCount} MOD</span>
                                <span>·</span>
                                <span className="uppercase font-semibold">Open →</span>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => handleToggleStar(slab.id, e)}
                              className="p-1 rounded-full text-stone-400 hover:text-amber-500 transition-colors shrink-0 cursor-pointer"
                              title="Favorite"
                            >
                              <Star className={`w-3 h-3 ${isStarred ? 'fill-amber-400 text-amber-400' : ''}`} />
                            </button>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={slab.id}
                          onClick={() => setActiveConsoleSlab(slab)}
                          className="themed-glass-card group bg-white dark:bg-[#18110c] hover:bg-amber-50/40 dark:hover:bg-[#221811] border border-amber-900/15 dark:border-[#382518] hover:border-amber-600/50 rounded-xl overflow-hidden transition-all duration-200 flex flex-col justify-between cursor-pointer relative shadow-xs hover:shadow-md"
                        >
                          {/* Real Photo + Fallback Thumbnail */}
                          <div className="relative h-28 overflow-hidden bg-[#140e0a]">
                            <SlabThumbnail
                              slab={slab}
                              src={realPhoto}
                              customLogo={customSlabLogos[slab.id]}
                              compact={false}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/15 pointer-events-none" />

                            {/* Customize Photo/Icon Trigger */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setCustomLogoInput(customSlabLogos[slab.id] || '');
                                setLogoPickerSlabId(slab.id);
                              }}
                              className="absolute bottom-1.5 left-1.5 z-10 p-1 rounded-full bg-black/45 hover:bg-black/75 text-stone-200 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                              title="Change slab thumbnail"
                            >
                              <Camera className="w-3 h-3" />
                            </button>

                            {/* Star Toggle on Top-Right */}
                            <button
                              type="button"
                              onClick={(e) => handleToggleStar(slab.id, e)}
                              className="absolute top-1.5 right-1.5 z-10 p-1 rounded-full bg-black/50 hover:bg-black/80 text-stone-300 hover:text-amber-400 transition-colors cursor-pointer"
                            >
                              <Star
                                className={`w-3 h-3 ${
                                  isStarred ? 'fill-amber-400 text-amber-400' : ''
                                }`}
                              />
                            </button>
                          </div>

                          {/* Content Area - Slab Name in Warm Brown */}
                          <div className="p-2.5 flex-1 flex flex-col justify-between">
                            <div className="mb-2">
                              <h3 className="font-serif text-[14.5px] font-bold text-[#5c351c] dark:text-[#f5eedc] group-hover:text-amber-700 dark:group-hover:text-amber-200 transition-colors line-clamp-2 leading-snug">
                                {slab.name}
                              </h3>
                            </div>

                            {/* Footer: Modules Count & Open Console CTA */}
                            <div className="pt-1.5 border-t border-amber-900/10 dark:border-stone-800/60 flex items-center justify-between text-[9px] font-mono">
                              <span className="text-[#8c532b] dark:text-stone-400 tracking-wider">
                                {slab.modulesCount} MOD
                              </span>
                              <span className="text-[#5c351c] dark:text-[#d4a373] group-hover:text-amber-600 font-bold uppercase tracking-wider flex items-center gap-0.5">
                                <span>Open</span>
                                <ChevronRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {/* Dashed "+ Add a slab" Card */}
                    <div
                      onClick={() => {
                        setCommissionTargetWing(wing.id);
                        setCommissionModalOpen(true);
                      }}
                      className={`border-2 border-dashed border-stone-300 dark:border-[#382518] hover:border-amber-500/60 rounded-xl flex transition-all cursor-pointer bg-stone-50/70 dark:bg-[#140e0a]/60 hover:bg-stone-100 dark:hover:bg-[#1c140e] group ${
                        isCompact
                          ? 'flex-row items-center justify-center gap-2 p-2 min-h-[54px]'
                          : 'flex-col items-center justify-center p-3 text-center min-h-[110px]'
                      }`}
                    >
                      <div className="w-6 h-6 rounded-full bg-white dark:bg-[#231912] border border-stone-300 dark:border-[#4b3322] text-stone-500 dark:text-stone-400 group-hover:text-stone-800 dark:group-hover:text-stone-200 flex items-center justify-center transition-colors shadow-2xs shrink-0">
                        <Plus className="w-3.5 h-3.5" />
                      </div>
                      <div className={isCompact ? 'flex items-center gap-1.5' : ''}>
                        <div className="font-serif text-xs font-medium text-stone-700 dark:text-stone-200 group-hover:text-stone-900 dark:group-hover:text-white transition-colors">
                          Add slab
                        </div>
                        {!isCompact && (
                          <div className="text-[8px] font-mono tracking-widest text-stone-400 uppercase mt-0.5">
                            AI / HAND
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. COMMISSION A SLAB MODAL                                                */}
      {/* ========================================================================= */}
      {commissionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="themed-glass-card bg-white dark:bg-[#18110c] border border-stone-200 dark:border-[#382518] rounded-3xl max-w-lg w-full p-6 text-stone-900 dark:text-stone-100 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-[#352317] pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <h3 className="font-serif font-bold text-xl text-stone-900 dark:text-stone-100">
                  Commission a New Leisure Slab
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCommissionModalOpen(false)}
                className="p-1 rounded-lg text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSlab} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                  Simple Slab Name:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tea Ceremony, Classical Piano, Space Telescopes"
                  value={newSlabForm.name}
                  onChange={(e) =>
                    setNewSlabForm({ ...newSlabForm, name: e.target.value })
                  }
                  className="w-full bg-stone-50 dark:bg-[#120c08] border border-stone-200 dark:border-[#382518] rounded-xl px-3.5 py-2 text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                  Subtitle / Rest Focus:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mindful extraction, harmonics & relaxation"
                  value={newSlabForm.tagline}
                  onChange={(e) =>
                    setNewSlabForm({ ...newSlabForm, tagline: e.target.value })
                  }
                  className="w-full bg-stone-50 dark:bg-[#120c08] border border-stone-200 dark:border-[#382518] rounded-xl px-3.5 py-2 text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                    Select Wing:
                  </label>
                  <select
                    value={newSlabForm.wingId}
                    onChange={(e) =>
                      setNewSlabForm({ ...newSlabForm, wingId: e.target.value })
                    }
                    className="w-full bg-stone-50 dark:bg-[#120c08] border border-stone-200 dark:border-[#382518] rounded-xl px-3 py-2 text-stone-900 dark:text-stone-100 outline-none"
                  >
                    {wings.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.icon} {w.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                    Emoji / Icon:
                  </label>
                  <input
                    type="text"
                    value={newSlabForm.icon}
                    onChange={(e) =>
                      setNewSlabForm({ ...newSlabForm, icon: e.target.value })
                    }
                    className="w-full bg-stone-50 dark:bg-[#120c08] border border-stone-200 dark:border-[#382518] rounded-xl px-3.5 py-2 text-stone-900 dark:text-stone-100 outline-none text-center"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200 dark:border-[#352317]">
                <button
                  type="button"
                  onClick={() => setCommissionModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-[#251a12] dark:hover:bg-[#322318] text-stone-700 dark:text-stone-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="themed-accent-btn px-4 py-2 rounded-xl bg-[#A47C43] hover:bg-[#8e6834] text-white font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Slab to Atelier</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. INTERACTIVE SLAB CONSOLE MODAL ("OPEN CONSOLE")                         */}
      {/* ========================================================================= */}
      {activeConsoleSlab && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-5 animate-in fade-in duration-200">
          <div className="bg-[#140e0a] border border-[#382518] rounded-3xl max-w-5xl w-full h-[90vh] flex flex-col overflow-hidden shadow-2xl text-stone-100">
            {/* Console Header */}
            <div className="px-6 py-4 border-b border-[#352317] bg-[#18110c] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveConsoleSlab(null)}
                  className="p-1.5 rounded-xl bg-[#251a12] hover:bg-[#322318] text-stone-300 transition-colors flex items-center gap-1 text-xs cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Back to Atelier Slabs</span>
                </button>
                <div className="h-4 w-px bg-[#382518]" />
                <div className="flex items-center gap-2">
                  <span className="text-xl">{activeConsoleSlab.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif font-bold text-xl text-stone-100">
                        {activeConsoleSlab.name}
                      </h3>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#251a12] text-stone-400 border border-[#382518]">
                        {activeConsoleSlab.badge}
                      </span>
                    </div>
                    <p className="text-xs text-stone-400">
                      {activeConsoleSlab.tagline}
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveConsoleSlab(null)}
                className="p-1.5 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-[#251a12]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Console Viewport Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {/* CONSOLE A: OCULAR HEALTH (20-20-20), 10 PEACE SOUNDS & BOX BREATHING */}
              {activeConsoleSlab.consoleId === 'nature' && (
                <div className="space-y-6">
                  {/* 20-20-20 Ocular Relaxer */}
                  <div className="p-5 rounded-3xl bg-[#1a120d] border border-[#382518] flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-amber-950/70 text-amber-300 border border-amber-700/50 flex items-center justify-center">
                        <Eye className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-stone-100">20-20-20 Ocular Relaxer</h4>
                        <p className="text-xs text-stone-400">
                          Look 20 feet away at a distant object for 20 seconds to relax ciliary accommodation spasm
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-2xl font-black text-amber-300 w-12 text-center">
                        {ocularSeconds}s
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          if (ocularActive) {
                            setOcularActive(false);
                          } else {
                            setOcularSeconds(20);
                            setOcularActive(true);
                          }
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                          ocularActive ? 'bg-stone-700 text-stone-200' : 'bg-[#A47C43] hover:bg-[#8e6834] text-white'
                        }`}
                      >
                        {ocularActive ? 'Pause 20s' : 'Start 20s Gaze'}
                      </button>
                    </div>
                  </div>

                  {/* 10 Peace Sounds Synthesizer */}
                  <div className="p-5 rounded-3xl bg-[#1a120d] border border-[#382518] space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-950/70 text-amber-300 flex items-center justify-center border border-amber-800/70">
                          {isAudioPlaying ? (
                            <Volume2 className="w-5 h-5 animate-pulse" />
                          ) : (
                            <VolumeX className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-stone-100">
                              10 Peace Ambient Soundscapes
                            </h4>
                            {isAudioPlaying && soundTimeRemaining > 0 && (
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                                ⏱️ {Math.floor(soundTimeRemaining / 60)}:{(soundTimeRemaining % 60).toString().padStart(2, '0')} Left
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-stone-400">
                            Web Audio analog pink noise filters to mask hospital ward noise &amp; deepen memory retention
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleAudio(audioType)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          isAudioPlaying
                            ? 'bg-amber-600 hover:bg-amber-700 text-white'
                            : 'bg-[#A47C43] hover:bg-[#8e6834] text-white'
                        }`}
                      >
                        {isAudioPlaying ? <VolumeX className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        <span>{isAudioPlaying ? 'Mute' : 'Play Soundscape'}</span>
                      </button>
                    </div>

                    {/* Duration Pills */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                      <span className="text-stone-400 font-mono text-[11px] mr-1">Duration:</span>
                      {[
                        { m: 2, lbl: '2 Min' },
                        { m: 5, lbl: '5 Min' },
                        { m: 10, lbl: '10 Min' },
                        { m: 25, lbl: '25 Min' },
                        { m: 45, lbl: '45 Min' },
                        { m: 0, lbl: 'Manual Stop' },
                      ].map((d) => (
                        <button
                          key={d.m}
                          type="button"
                          onClick={() => {
                            setSoundDuration(d.m);
                            if (isAudioPlaying && d.m > 0) setSoundTimeRemaining(d.m * 60);
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                            soundDuration === d.m
                              ? 'bg-[#A47C43] text-white font-bold'
                              : 'bg-stone-800 text-stone-400 hover:text-stone-200'
                          }`}
                        >
                          {d.lbl}
                        </button>
                      ))}
                    </div>

                    {/* 10 Sound Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-2">
                      {[
                        { type: 'rain', label: 'Steady Rain', icon: '🌧️', desc: 'Pink noise 680Hz' },
                        { type: 'forest', label: 'Alpine Pines', icon: '🌲', desc: 'Evergreen breeze' },
                        { type: 'ocean', label: 'Beach Surf', icon: '🌊', desc: 'Oceanic wave swell' },
                        { type: 'fireplace', label: 'Warm Hearth', icon: '🪵', desc: 'Crackle & embers' },
                        { type: 'zen-bell', label: 'Singing Bowls', icon: '🧘', desc: '432Hz harmonic tones' },
                        { type: 'library', label: 'Quiet Library', icon: '📚', desc: 'Soft hall resonance' },
                        { type: 'crickets', label: 'Night Crickets', icon: '🦗', desc: '4.5kHz cicadas' },
                        { type: 'cafe', label: 'Artisan Cafe', icon: '☕', desc: 'Muffled warm hum' },
                        { type: 'waterfall', label: 'Waterfall', icon: '🏔️', desc: 'Full-spectrum rush' },
                        { type: 'wind-chimes', label: 'Wind Chimes', icon: '🎐', desc: 'Pentatonic strikes' },
                      ].map((s) => (
                        <button
                          key={s.type}
                          type="button"
                          onClick={() => toggleAudio(s.type as any)}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            audioType === s.type && isAudioPlaying
                              ? 'bg-[#A47C43] text-white border-amber-300 shadow-md'
                              : 'bg-stone-900/80 border-stone-800 hover:border-amber-500/50 text-stone-200'
                          }`}
                        >
                          <div className="text-base mb-1">{s.icon}</div>
                          <div className="font-bold text-xs">{s.label}</div>
                          <div className="text-[10px] text-stone-400 mt-0.5">{s.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Box Breathing Protocol */}
                  <div className="p-6 rounded-3xl bg-[#1a120d] border border-[#382518] space-y-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Wind className="w-5 h-5 text-amber-400" />
                        <div>
                          <h4 className="text-sm font-bold text-stone-100">
                            Box Breathing Protocol (4s Inhale · 4s Hold · 4s Exhale · 4s Rest)
                          </h4>
                          <p className="text-xs text-stone-400">
                            Stimulates vagus nerve baroreceptors to lower heart rate and normalize cortisol
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-amber-300 px-3 py-1 rounded-full bg-amber-950/70 border border-amber-800/70">
                        {completedBreathingCycles} Cycles Finished
                      </span>
                    </div>

                    <div className="py-6 flex flex-col items-center justify-center space-y-4">
                      <div
                        className={`w-36 h-36 rounded-full flex flex-col items-center justify-center font-bold transition-all duration-700 ${
                          isBreathingActive
                            ? breathingPhase === 'Inhale'
                              ? 'scale-110 bg-[#A47C43] text-white shadow-2xl ring-8 ring-amber-400/40'
                              : breathingPhase === 'Hold'
                              ? 'scale-110 bg-amber-600 text-white shadow-2xl ring-8 ring-amber-400/40'
                              : breathingPhase === 'Exhale'
                              ? 'scale-90 bg-slate-600 text-white shadow-2xl ring-8 ring-slate-400/40'
                              : 'scale-95 bg-stone-700 text-amber-100 ring-4 ring-amber-500/40'
                            : 'bg-[#231912] text-amber-300 border border-amber-700/60'
                        }`}
                      >
                        <span className="text-4xl font-black">
                          {isBreathingActive ? breathingSecondsLeft : '4'}
                        </span>
                        <span className="text-xs font-mono uppercase tracking-wider mt-1 font-semibold">
                          {isBreathingActive ? breathingPhase : 'Ready'}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsBreathingActive(!isBreathingActive)}
                        className={`px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                          isBreathingActive
                            ? 'bg-[#7f1d1d] hover:bg-[#962d32] text-[#fdf2f2]'
                            : 'bg-[#A47C43] hover:bg-[#8e6834] text-white'
                        }`}
                      >
                        {isBreathingActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        <span>{isBreathingActive ? 'Pause Session' : 'Start 4-4-4-4 Breathing'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* CONSOLE B: WORD SCRAMBLE */}
              {activeConsoleSlab.consoleId === 'scramble' && (
                <div className="p-6 rounded-3xl bg-[#1a120d] border border-[#382518] space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-stone-100">
                        Clinical Anagram Unscrambler
                      </h4>
                      <p className="text-xs text-stone-400">
                        Sharpen medical vocabulary pattern matching
                      </p>
                    </div>
                    <span className="text-xs font-mono font-bold text-amber-400 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-800">
                      Score: {gameScore} pts
                    </span>
                  </div>

                  <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 text-center space-y-4">
                    <div className="flex items-center justify-center gap-2 text-xs text-stone-400 font-mono">
                      <span>SCRAMBLED TERM ({wordIdx % SCRAMBLE_WORDS.length + 1}/{SCRAMBLE_WORDS.length}):</span>
                      <button
                        type="button"
                        onClick={() => setScrambledDisplay(shuffleLetters(currentScramble?.word || 'SYNAPSE'))}
                        className="text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                        title="Reshuffle letters"
                      >
                        <RefreshCw className="w-3 h-3" /> Shuffle
                      </button>
                    </div>
                    <div className="text-3xl font-mono font-black tracking-widest text-amber-300">
                      {scrambledDisplay}
                    </div>
                    {scrambleHintLetters > 0 && (
                      <div className="text-xs font-mono text-amber-200/80 tracking-widest">
                        Starts with: <span className="font-bold text-amber-400">{(currentScramble?.word || '').slice(0, scrambleHintLetters)}...</span>
                      </div>
                    )}
                    <div className="text-xs text-stone-300 italic">
                      Clue: {currentScramble?.clue}
                    </div>

                    <form onSubmit={handleCheckWord} className="max-w-md mx-auto flex gap-2">
                      <input
                        type="text"
                        placeholder="Type unscrambled word..."
                        value={userGuess}
                        onChange={(e) => setUserGuess(e.target.value)}
                        className="flex-1 bg-stone-800 border border-stone-700 rounded-xl px-3.5 py-2 text-xs text-stone-100 outline-none uppercase font-mono tracking-wider focus:border-amber-400"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs cursor-pointer"
                      >
                        Check
                      </button>
                    </form>

                    <div className="flex items-center justify-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setScrambleHintLetters((h) => Math.min((currentScramble?.word || '').length, h + 1))}
                        className="px-3 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-[11px] font-mono cursor-pointer"
                      >
                        Hint Letter
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setWordIdx((i) => i + 1);
                          setUserGuess('');
                          setGameFeedback(null);
                        }}
                        className="px-3 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-[11px] font-mono cursor-pointer"
                      >
                        Skip Word →
                      </button>
                    </div>

                    {gameFeedback && (
                      <div className="text-xs font-bold text-amber-400 animate-pulse">
                        {gameFeedback}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* CONSOLE C: DESK STRETCHES WITH GUIDED TIMERS */}
              {activeConsoleSlab.consoleId === 'stretches' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-semibold text-stone-300">
                      Micro-Mobility Circuit for Study Chairs (Click Start Timer on any drill):
                    </div>
                    {activeStretchIdx !== null && (
                      <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                        ⏱️ Active Hold: {stretchSeconds}s
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      {
                        title: 'Suboccipital Neck Release',
                        duration: '45 seconds',
                        secs: 45,
                        guide: 'Tuck chin gently toward chest. Interlace fingers behind head, letting gravity decompress upper cervical spine.',
                        target: 'Relieves reading tension headaches',
                      },
                      {
                        title: 'Thoracic Extension Arch',
                        duration: '60 seconds',
                        secs: 60,
                        guide: 'Interlock hands behind chair back. Inhale deeply and lift chest toward ceiling while retracting scapulae.',
                        target: 'Counters hunched laptop posture',
                      },
                      {
                        title: 'Median Nerve Glides',
                        duration: '45 seconds each arm',
                        secs: 45,
                        guide: 'Extend arm laterally with wrist extended back ("waiter tray"). Slowly tilt head to opposite side.',
                        target: 'Prevents carpal tunnel & stylus numbness',
                      },
                    ].map((st, i) => {
                      const running = activeStretchIdx === i;
                      return (
                        <div key={i} className={`p-5 rounded-2xl bg-[#1a120d] border flex flex-col justify-between space-y-3 ${running ? 'border-amber-500 ring-1 ring-amber-500/40' : 'border-[#382518]'}`}>
                          <div className="space-y-2">
                            <div className="text-xs font-mono font-bold text-amber-400">{st.duration}</div>
                            <h4 className="font-bold text-sm text-stone-100">{st.title}</h4>
                            <p className="text-xs text-stone-400 leading-relaxed">{st.guide}</p>
                            <div className="pt-2 text-[10px] font-mono text-stone-400 border-t border-[#352317]">
                              Target: {st.target}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              if (running) {
                                setActiveStretchIdx(null);
                                setStretchSeconds(0);
                              } else {
                                setActiveStretchIdx(i);
                                setStretchSeconds(st.secs);
                              }
                            }}
                            className={`w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                              running ? 'bg-stone-700 text-stone-100' : 'bg-[#A47C43] hover:bg-[#8e6834] text-white'
                            }`}
                          >
                            {running ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                            <span>{running ? `Stop (${stretchSeconds}s)` : `Start ${st.secs}s Timer`}</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* CONSOLE D: POWER NAP STUDIO WITH LIVE TIMER */}
              {activeConsoleSlab.consoleId === 'sleep-cycles' && (
                <div className="p-6 rounded-3xl bg-[#1a120d] border border-[#382518] space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-bold text-stone-100">
                        Ultradian 90-Minute Alertness Cycles &amp; Micro-Nap Studio
                      </h4>
                      <p className="text-xs text-stone-400">
                        Engineered naps without sleep inertia — start a timed chime wake-up below
                      </p>
                    </div>
                    {napLabel && (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 text-xs font-mono font-bold">
                        <Clock className="w-3.5 h-3.5 animate-pulse" />
                        <span>{napLabel}: {formatTimer(napSecondsLeft)}</span>
                        <button
                          type="button"
                          onClick={() => { setNapLabel(null); setNapSecondsLeft(0); }}
                          className="ml-1 text-stone-300 hover:text-white cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      {
                        type: 'Coffee Nap (Nappuccino)',
                        dur: '20 Minutes',
                        mins: 20,
                        desc: 'Drink espresso right before 20m rest. Adenosine receptors cleared as caffeine kicks in at min 21.',
                      },
                      {
                        type: 'Ultradian Reset',
                        dur: '90 Minutes',
                        mins: 90,
                        desc: 'A full NREM-REM sleep cycle restoring hippocampal memory trace consolidation.',
                      },
                      {
                        type: 'Micro-Sensory Pause',
                        dur: '10 Minutes',
                        mins: 10,
                        desc: 'Eyes closed, slow diaphragmatic breaths with noise cancelation.',
                      },
                    ].map((nap, i) => {
                      const active = napLabel === nap.type;
                      return (
                        <div key={i} className={`p-4 rounded-2xl bg-[#120c08] border flex flex-col justify-between space-y-3 ${active ? 'border-amber-500' : 'border-[#352317]'}`}>
                          <div className="space-y-1.5">
                            <span className="text-xs font-mono font-bold text-amber-400">{nap.dur}</span>
                            <h5 className="font-bold text-sm text-stone-100">{nap.type}</h5>
                            <p className="text-xs text-stone-400 leading-relaxed">{nap.desc}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              if (active) {
                                setNapLabel(null);
                                setNapSecondsLeft(0);
                              } else {
                                setNapLabel(nap.type);
                                setNapSecondsLeft(nap.mins * 60);
                              }
                            }}
                            className={`w-full py-2 rounded-xl text-xs font-bold cursor-pointer ${
                              active ? 'bg-stone-700 text-stone-200' : 'bg-[#A47C43] hover:bg-[#8e6834] text-white'
                            }`}
                          >
                            {active ? 'Cancel Nap Alarm' : `Start ${nap.mins}m Nap`}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* CONSOLE E1: PSYCHOLOGY & BODY LANGUAGE */}
              {activeConsoleSlab.consoleId === 'daily-biases' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="text-xs font-semibold text-stone-300">
                      Human Mind Lab: Clinical Heuristics &amp; Bedside Micro-Cues
                    </div>
                    <div className="flex items-center gap-1.5 bg-[#120c08] p-1 rounded-xl border border-[#382518]">
                      <button
                        type="button"
                        onClick={() => setPsychTab('biases')}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${psychTab === 'biases' ? 'bg-[#A47C43] text-white' : 'text-stone-400 hover:text-stone-200'}`}
                      >
                        Decision Heuristics
                      </button>
                      <button
                        type="button"
                        onClick={() => setPsychTab('body')}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${psychTab === 'body' ? 'bg-[#A47C43] text-white' : 'text-stone-400 hover:text-stone-200'}`}
                      >
                        Body Language Cues
                      </button>
                    </div>
                  </div>
                  {psychTab === 'biases' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {PSYCHOLOGY_BIASES.map((b) => (
                        <div key={b.id} className="p-5 rounded-2xl bg-[#1a120d] border border-[#382518] space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-sm text-stone-100">{b.name}</h4>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#251a12] text-stone-300">
                              {b.category}
                            </span>
                          </div>
                          <p className="text-xs text-stone-400">{b.tagline}</p>
                          <div className="p-2.5 rounded-xl bg-[#120c08]/90 border border-[#352317] text-[11px] text-amber-300/90">
                            <strong>Clinical Trap:</strong> {b.clinicalRelevance}
                          </div>
                          <div className="text-[11px] text-[#d4aa6e]">
                            <strong>Defense:</strong> {b.defenseStrategy}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {BODY_LANGUAGE_CUES.map((c, idx) => (
                        <div key={idx} className="p-5 rounded-2xl bg-[#1a120d] border border-[#382518] space-y-2">
                          <h4 className="font-bold text-sm text-amber-300">{c.cue}</h4>
                          <div className="text-[11px] font-mono text-stone-400">Indicator: {c.indicator}</div>
                          <p className="text-xs text-stone-300 leading-relaxed">{c.subconsciousMeaning}</p>
                          <div className="p-2.5 rounded-xl bg-[#120c08] border border-[#352317] text-[11px] text-[#d4aa6e]">
                            <strong>Bedside Application:</strong> {c.bedsideApplication}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* CONSOLE E2: COGNITIVE BIASES CASINO GAME */}
              {activeConsoleSlab.consoleId === 'biases-casino' && (() => {
                const hands = [
                  {
                    bias: 'Gambler’s Fallacy',
                    prompt: 'A flipped fair coin has landed HEADS 5 times in a row on Ward Night Duty. Where do you stake your chips for flip #6?',
                    options: ['Heads (~50% — coins have no memory)', 'Tails (due for regression now!)'],
                    rationalIdx: 0,
                    note: 'Independent Bernoulli trials have identical 50/50 probability regardless of streak history.',
                  },
                  {
                    bias: 'Base-Rate Neglect',
                    prompt: 'Rare Syndrome X affects 1 in 1,000 people. A test is 95% sensitive/specific. Your asymptomatic friend tests positive. Likely probability they actually have X?',
                    options: ['Around 95%', 'Under 2% (~1.9% via Bayes Theorem)'],
                    rationalIdx: 1,
                    note: 'Out of 1,000 healthy people, a 5% false-positive rate yields ~50 false positives vs 1 true positive!',
                  },
                  {
                    bias: 'Sunk Cost Fallacy',
                    prompt: 'You spent 3 hours reading a dense poorly written textbook chapter with 0 retention so far, while a concise high-yield lecture awaits.',
                    options: ['Finish it to not waste those 3 hours', 'Switch immediately based only on future yield'],
                    rationalIdx: 1,
                    note: 'Past hours are irrecoverable sunk costs; rational decisions optimize marginal future value per minute.',
                  },
                  {
                    bias: 'Framing Effect',
                    prompt: 'Surgery A cites "90% 5-year survival". Surgery B cites "10% 5-year mortality". Both perform identically. Which choice avoids framing bias?',
                    options: ['Recognize identical objective statistics', 'Pick Surgery A automatically'],
                    rationalIdx: 0,
                    note: 'Always translate survival framing to mortality framing and absolute risk before deciding.',
                  },
                ];
                const hand = hands[casinoIdx % hands.length];
                return (
                  <div className="p-6 rounded-3xl bg-[#1a120d] border border-[#382518] space-y-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-bold text-stone-100">Cognitive Biases Casino · Rationality Stake</h4>
                        <p className="text-xs text-stone-400">Wager Cognitive Chips against classical statistical illusions</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-amber-950/60 border border-amber-700/60 text-amber-300 text-xs font-mono font-bold">
                          🪙 {casinoChips} Chips
                        </span>
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-[#120c08] border border-[#352317] space-y-4">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-amber-400">SCENARIO #{(casinoIdx % hands.length) + 1} · {hand.bias}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-stone-400">Wager:</span>
                          {[10, 25, 50].map((b) => (
                            <button
                              key={b}
                              type="button"
                              disabled={casinoChoice !== null}
                              onClick={() => setCasinoBet(b)}
                              className={`px-2 py-0.5 rounded font-bold cursor-pointer ${casinoBet === b ? 'bg-amber-500 text-stone-950' : 'bg-stone-800 text-stone-300'}`}
                            >
                              {b}
                            </button>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm font-serif text-stone-100 leading-relaxed">{hand.prompt}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {hand.options.map((opt, idx) => {
                          const picked = casinoChoice === idx;
                          const isRational = idx === hand.rationalIdx;
                          return (
                            <button
                              key={idx}
                              type="button"
                              disabled={casinoChoice !== null}
                              onClick={() => {
                                setCasinoChoice(idx);
                                if (isRational) {
                                  setCasinoChips((c) => c + casinoBet);
                                } else {
                                  setCasinoChips((c) => Math.max(0, c - casinoBet));
                                }
                              }}
                              className={`p-3.5 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                                casinoChoice !== null
                                  ? isRational
                                    ? 'bg-[#A47C43]/30 border-[#A47C43] text-stone-100'
                                    : picked
                                    ? 'bg-[#7f1d1d]/30 border-[#7f1d1d] text-rose-200'
                                    : 'bg-stone-900 border-stone-800 text-stone-500'
                                  : 'bg-[#1a120d] border-[#382518] hover:border-amber-500 text-stone-200'
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                      {casinoChoice !== null && (
                        <div className="p-3 rounded-xl bg-[#1a120d] border border-amber-700/40 flex flex-wrap items-center justify-between gap-3">
                          <div className="text-xs text-stone-200">
                            <strong className={casinoChoice === hand.rationalIdx ? 'text-amber-300' : 'text-rose-300'}>
                              {casinoChoice === hand.rationalIdx ? `Won +${casinoBet} chips! ` : `House took ${casinoBet} chips! `}
                            </strong>
                            {hand.note}
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setCasinoIdx((i) => i + 1);
                              setCasinoChoice(null);
                            }}
                            className="px-4 py-1.5 rounded-lg bg-[#A47C43] hover:bg-[#8e6834] text-white text-xs font-bold cursor-pointer"
                          >
                            Next Hand →
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* CONSOLE F: WORLD NEWS & INDIA PULSE */}
              {activeConsoleSlab.consoleId === 'news' && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-xs font-semibold text-stone-300">
                      Curated Science, ICMR/AIIMS &amp; Global Medicine Pulse
                    </div>
                    <div className="flex items-center gap-1.5 bg-[#120c08] p-1 rounded-xl border border-[#382518]">
                      <button
                        type="button"
                        onClick={() => setNewsTab('world')}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${newsTab === 'world' ? 'bg-[#A47C43] text-white' : 'text-stone-400 hover:text-stone-200'}`}
                      >
                        🌐 World Medical &amp; Space
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewsTab('india')}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${newsTab === 'india' ? 'bg-[#A47C43] text-white' : 'text-stone-400 hover:text-stone-200'}`}
                      >
                        🇮🇳 India &amp; AIIMS/ICMR
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(newsTab === 'world' ? WORLD_NEWS_FEED : INDIA_NEWS_FEED).map((n) => (
                      <div key={n.id} className="p-5 rounded-2xl bg-[#1a120d] border border-[#382518] space-y-2.5">
                        <div className="flex items-center justify-between text-[10px] font-mono text-stone-400">
                          <span className="text-amber-400 font-semibold">{n.source}</span>
                          <span>{n.timestamp}</span>
                        </div>
                        <h4 className="font-bold text-sm text-stone-100 leading-snug">{n.title}</h4>
                        <ul className="space-y-1 text-xs text-stone-300 list-disc pl-4">
                          {n.bulletSummary.map((b, bi) => (
                            <li key={bi}>{b}</li>
                          ))}
                        </ul>
                        <div className="p-2.5 rounded-xl bg-[#120c08] border border-[#352317] text-[11px] text-[#d4aa6e]">
                          <strong>Exam Pearl:</strong> {n.relevanceForStudents}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CONSOLE G1: FORMULA 1 PITSTOP PRECISION */}
              {activeConsoleSlab.consoleId === 'motorsport' && (
                <div className="space-y-5">
                  <div className="p-6 rounded-3xl bg-[#1a120d] border border-[#382518] space-y-4">
                    <div>
                      <h4 className="text-sm font-bold text-stone-100">
                        Formula 1 Sub-2.0s Pitstop Choreography &amp; Team Precision
                      </h4>
                      <p className="text-xs text-stone-400">
                        20 mechanics working in microscopic synchrony under extreme pressure
                      </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {F1_PITSTOP_STEPS.map((step, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-[#120c08] border border-[#352317] space-y-1">
                          <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                            <span>{step.step}</span>
                            <span className="font-mono">{step.duration}</span>
                          </div>
                          <div className="text-[11px] font-semibold text-stone-300">{step.crewRole}</div>
                          <p className="text-xs text-stone-400 leading-relaxed">{step.neuromuscularInsight}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-5 rounded-3xl bg-[#1a120d] border border-[#382518] space-y-3">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                      Laparoscopic &amp; Neuro-Reflex Parallels
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {GAMING_FACTS.map((gf, gi) => (
                        <div key={gi} className="p-3.5 rounded-xl bg-[#120c08] border border-[#352317] space-y-1.5">
                          <div className="text-xs font-bold text-stone-100">{gf.title}</div>
                          <p className="text-[11px] text-stone-400 leading-relaxed">{gf.scientificStudy}</p>
                          <div className="text-[10.5px] text-[#d4aa6e]">{gf.clinicalTransfer}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* CONSOLE G2: MOTORSPORT MINDSET · 5-RED-LIGHTS REACTION TIMER */}
              {activeConsoleSlab.consoleId === 'racing-mindset' && (
                <div className="p-6 rounded-3xl bg-[#1a120d] border border-[#382518] space-y-6 text-center">
                  <div>
                    <h4 className="text-sm font-bold text-stone-100">F1 5-Red-Lights-Out Reflex Gantry</h4>
                    <p className="text-xs text-stone-400 mt-0.5">
                      Press Start Lights, wait for all 5 red pods, and tap immediately when they go OUT!
                    </p>
                  </div>

                  {/* 5 Gantry Light Pods */}
                  <div className="flex items-center justify-center gap-3 sm:gap-4 py-4 px-6 bg-[#110c09] border border-[#352317] rounded-2xl max-w-md mx-auto">
                    {[1, 2, 3, 4, 5].map((n) => {
                      const lit = f1Stage === 'countdown' && n <= f1LightsCount;
                      return (
                        <div key={n} className="w-11 h-16 rounded-xl bg-stone-950 border border-stone-800 flex flex-col items-center justify-evenly p-1.5">
                          <div className={`w-6 h-6 rounded-full transition-all ${lit ? 'bg-red-500 shadow-[0_0_18px_rgba(239,68,68,0.9)]' : 'bg-stone-800'}`} />
                          <div className={`w-6 h-6 rounded-full transition-all ${lit ? 'bg-red-500 shadow-[0_0_18px_rgba(239,68,68,0.9)]' : 'bg-stone-800'}`} />
                        </div>
                      );
                    })}
                  </div>

                  <div className="space-y-3">
                    {f1Stage === 'idle' && (
                      <button
                        type="button"
                        onClick={handleStartF1Sequence}
                        className="px-6 py-3 rounded-2xl bg-[#A47C43] hover:bg-[#8e6834] text-white font-bold text-sm cursor-pointer shadow-md"
                      >
                        Start Sequence →
                      </button>
                    )}

                    {(f1Stage === 'countdown' || f1Stage === 'go') && (
                      <button
                        type="button"
                        onMouseDown={handleF1React}
                        onClick={handleF1React}
                        className={`w-full max-w-md py-6 rounded-2xl font-black text-base tracking-wider uppercase cursor-pointer transition-colors ${
                          f1Stage === 'go'
                            ? 'bg-amber-500 text-stone-950 animate-pulse'
                            : 'bg-stone-800 text-stone-300 border border-stone-700'
                        }`}
                      >
                        {f1Stage === 'go' ? 'LIGHTS OUT! TAP NOW!' : 'WAIT FOR LIGHTS OUT...'}
                      </button>
                    )}

                    {f1Stage === 'false-start' && (
                      <div className="space-y-2">
                        <div className="text-sm font-bold text-rose-400">JUMP START! +5s Penalty — wait until lights extinguish.</div>
                        <button
                          type="button"
                          onClick={handleStartF1Sequence}
                          className="px-5 py-2 rounded-xl bg-[#A47C43] text-white text-xs font-bold cursor-pointer"
                        >
                          Retry Start
                        </button>
                      </div>
                    )}

                    {f1Stage === 'done' && (
                      <div className="space-y-3">
                        <div className="text-3xl font-mono font-black text-amber-300">{f1ReactionMs} ms</div>
                        <div className="text-xs text-stone-300">
                          {f1ReactionMs !== null && f1ReactionMs < 220
                            ? 'F1 Grid-Level Neuromuscular Reflex!'
                            : f1ReactionMs !== null && f1ReactionMs < 300
                            ? 'Sharp Acute Care Reaction Time!'
                            : 'Steady & Calm — try one more lap to beat your PB.'}
                          {f1BestMs !== null && ` · Session Best: ${f1BestMs} ms`}
                        </div>
                        <button
                          type="button"
                          onClick={handleStartF1Sequence}
                          className="px-5 py-2 rounded-xl bg-[#A47C43] hover:bg-[#8e6834] text-white text-xs font-bold cursor-pointer"
                        >
                          Run Another Launch
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* CONSOLE: POST-MBBS CAREER PATHWAYS & OVERSEAS DIRECTORY */}
              {(activeConsoleSlab.consoleId === 'post-mbbs-careers' || activeConsoleSlab.consoleId === 'overseas-jobs') && (
                <div className="space-y-6">
                  {/* Top Bar with Search & Publish New Job */}
                  <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[#18110c] border border-[#382518]">
                    <div className="flex-1 min-w-[240px] relative">
                      <Search className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search pathways, exams (PLAB, USMLE, AMC), countries, agencies..."
                        value={careerSearch}
                        onChange={(e) => setCareerSearch(e.target.value)}
                        className="w-full bg-[#110c09] border border-[#382518] rounded-xl pl-9 pr-4 py-2 text-xs text-stone-100 placeholder-stone-500 outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAddJobModalOpen(true)}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Publish New Global Job / Roster</span>
                      </button>
                    </div>
                  </div>

                  {/* Category Pills */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                    {[
                      { id: 'all', label: 'All Opportunities' },
                      { id: 'global-exam', label: 'Overseas & Licensing (PLAB/USMLE/AMC)' },
                      { id: 'consulting', label: 'Healthcare Consulting & MBA' },
                      { id: 'clinical-ai', label: 'Clinical AI & HealthTech' },
                      { id: 'government', label: 'Government & UPSC CMS' },
                      { id: 'pharma', label: 'Pharmacovigilance & Trials' },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCareerCategoryFilter(cat.id)}
                        className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-all font-mono text-[11px] cursor-pointer ${
                          careerCategoryFilter === cat.id
                            ? 'bg-amber-400 text-stone-950 font-bold shadow-xs'
                            : 'bg-stone-800 text-stone-400 hover:text-stone-200'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {/* Opportunities Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {postMbbsJobs
                      .filter((opp) => {
                        if (careerCategoryFilter !== 'all' && opp.category !== careerCategoryFilter) return false;
                        if (careerSearch.trim()) {
                          const q = careerSearch.toLowerCase();
                          return (
                            opp.title.toLowerCase().includes(q) ||
                            opp.country.toLowerCase().includes(q) ||
                            opp.organization.toLowerCase().includes(q) ||
                            opp.description.toLowerCase().includes(q)
                          );
                        }
                        return true;
                      })
                      .map((opp) => (
                        <div
                          key={opp.id}
                          className="p-5 rounded-2xl bg-[#1a120d] border border-[#382518] hover:border-amber-500/40 transition-all space-y-3 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
                              <span className="font-mono text-amber-400 font-semibold flex items-center gap-1.5">
                                <Globe className="w-3.5 h-3.5" />
                                {opp.country}
                              </span>
                              <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-950/60 text-amber-300 border border-amber-800/60 font-medium">
                                {opp.stipendSalary}
                              </span>
                            </div>

                            <h4 className="font-serif text-base font-bold text-stone-100">{opp.title}</h4>
                            <div className="text-xs text-stone-400 font-medium flex items-center gap-1 mt-0.5">
                              <Building2 className="w-3.5 h-3.5 text-stone-500" />
                              <span>{opp.organization}</span>
                            </div>

                            <p className="text-xs text-stone-300 leading-relaxed mt-2.5">
                              {opp.description}
                            </p>

                            <div className="flex flex-wrap gap-1.5 mt-3">
                              {opp.tags.map((t: string, ti: number) => (
                                <span key={ti} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-stone-900 text-stone-400 border border-stone-800">
                                  #{t}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="pt-3 border-t border-stone-800 flex items-center justify-between text-xs">
                            <span className="text-[11px] text-stone-400 truncate max-w-[200px]">
                              ✉️ {opp.contactEmail}
                            </span>
                            <a
                              href={opp.link}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-amber-600 hover:text-stone-950 text-stone-200 font-semibold flex items-center gap-1.5 transition-colors"
                            >
                              <span>Official Portal</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* CONSOLE I: LOGIC PUZZLES (Python Clinical Code Quiz) */}
              {activeConsoleSlab.consoleId === 'coding' && (() => {
                const prob = LOGIC_PROGRAMMERS[logicIdx % LOGIC_PROGRAMMERS.length];
                return (
                  <div className="p-6 rounded-3xl bg-[#1a120d] border border-[#382518] space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-amber-400">
                          Challenge {(logicIdx % LOGIC_PROGRAMMERS.length) + 1} / {LOGIC_PROGRAMMERS.length}
                        </span>
                        <h4 className="text-sm font-bold text-stone-100">{prob.title}</h4>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-amber-950/60 border border-amber-800 text-amber-300 text-xs font-mono font-bold">
                        Score: {logicScore}
                      </span>
                    </div>
                    <pre className="p-4 rounded-2xl bg-[#0e0907] border border-[#352317] text-xs font-mono text-amber-200 overflow-x-auto leading-relaxed">
                      {prob.snippet}
                    </pre>
                    <p className="text-xs font-semibold text-stone-100">{prob.question}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {prob.options.map((opt, idx) => {
                        const chosen = logicSelectedOpt === idx;
                        const right = idx === prob.correctIndex;
                        return (
                          <button
                            key={idx}
                            type="button"
                            disabled={logicSelectedOpt !== null}
                            onClick={() => {
                              setLogicSelectedOpt(idx);
                              if (right) setLogicScore((sc) => sc + 10);
                            }}
                            className={`p-3 rounded-xl border text-left text-xs cursor-pointer transition-all ${
                              logicSelectedOpt !== null
                                ? right
                                  ? 'bg-[#A47C43]/30 border-[#A47C43] text-stone-100 font-semibold'
                                  : chosen
                                  ? 'bg-[#7f1d1d]/30 border-[#7f1d1d] text-rose-200'
                                  : 'bg-stone-900 border-stone-800 text-stone-500'
                                : 'bg-[#120c08] border-[#382518] hover:border-amber-500 text-stone-200'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                    {logicSelectedOpt !== null && (
                      <div className="p-3.5 rounded-xl bg-[#120c08] border border-amber-700/40 flex flex-wrap items-center justify-between gap-3">
                        <p className="text-xs text-stone-300 flex-1">{prob.explanation}</p>
                        <button
                          type="button"
                          onClick={() => {
                            setLogicIdx((i) => i + 1);
                            setLogicSelectedOpt(null);
                          }}
                          className="px-4 py-1.5 rounded-lg bg-[#A47C43] hover:bg-[#8e6834] text-white text-xs font-bold cursor-pointer"
                        >
                          Next Puzzle →
                        </button>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* CONSOLE J: MEDICAL TRIVIA & VISUAL VOCAB */}
              {activeConsoleSlab.consoleId === 'vocab' && (() => {
                const q = FUN_VOCAB_QUESTIONS[vocabIdx % FUN_VOCAB_QUESTIONS.length];
                return (
                  <div className="p-6 rounded-3xl bg-[#1a120d] border border-[#382518] space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-amber-400">
                          Question {(vocabIdx % FUN_VOCAB_QUESTIONS.length) + 1} / {FUN_VOCAB_QUESTIONS.length}
                        </span>
                        <h4 className="font-serif text-xl font-bold text-stone-100">
                          {q.word} <span className="text-xs font-mono text-stone-400 font-normal ml-2">{q.phonetic}</span>
                        </h4>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-amber-950/60 border border-amber-800 text-amber-300 text-xs font-mono font-bold">
                        Score: {vocabScore}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 gap-2.5">
                      {q.options.map((opt, idx) => {
                        const chosen = vocabSelectedOpt === idx;
                        const right = idx === q.correctIndex;
                        return (
                          <button
                            key={idx}
                            type="button"
                            disabled={vocabSelectedOpt !== null}
                            onClick={() => {
                              setVocabSelectedOpt(idx);
                              if (right) setVocabScore((sc) => sc + 10);
                            }}
                            className={`p-3 rounded-xl border text-left text-xs cursor-pointer transition-all ${
                              vocabSelectedOpt !== null
                                ? right
                                  ? 'bg-[#A47C43]/30 border-[#A47C43] text-stone-100 font-semibold'
                                  : chosen
                                  ? 'bg-[#7f1d1d]/30 border-[#7f1d1d] text-rose-200'
                                  : 'bg-stone-900 border-stone-800 text-stone-500'
                                : 'bg-[#120c08] border-[#382518] hover:border-amber-500 text-stone-200'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                    {vocabSelectedOpt !== null && (
                      <div className="p-3.5 rounded-xl bg-[#120c08] border border-amber-700/40 space-y-2">
                        <div className="text-xs text-amber-300 font-semibold">Etymology: {q.etymology}</div>
                        <div className="text-xs text-stone-300 italic">"{q.exampleSentence}"</div>
                        <div className="pt-1 flex justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              setVocabIdx((i) => i + 1);
                              setVocabSelectedOpt(null);
                            }}
                            className="px-4 py-1.5 rounded-lg bg-[#A47C43] hover:bg-[#8e6834] text-white text-xs font-bold cursor-pointer"
                          >
                            Next Word →
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* CONSOLE K: INTERACTIVE 8x8 TACTICAL CHESS PUZZLES */}
              {activeConsoleSlab.consoleId === 'chess' && (() => {
                const puzzles = [
                  {
                    title: 'Royal Knight Fork (White to Move)',
                    clue: 'Select the White Knight and leap to fork Black King & Rook simultaneously.',
                    pieces: { e4: '♘', e8: '♚', g8: '♜', c8: '♝', d2: '♙', g1: '♔' } as Record<string, string>,
                    fromSq: 'e4',
                    targetSq: 'f6',
                    explanation: 'Nf6+! delivers check to the King on e8 while attacking the Rook on g8.',
                  },
                  {
                    title: 'Back-Rank Checkmate in 1 (White to Move)',
                    clue: 'Select the White Rook and sweep to the 8th rank for checkmate.',
                    pieces: { d1: '♖', g8: '♚', f7: '♟', g7: '♟', h7: '♟', g1: '♔' } as Record<string, string>,
                    fromSq: 'd1',
                    targetSq: 'd8',
                    explanation: 'Rd8#! Black King is trapped behind its own pawns on f7-h7.',
                  },
                  {
                    title: 'Queen Diagonal Battery Mate (White to Move)',
                    clue: 'Select the White Queen on f3 and strike f7 protected by the Bishop on c4.',
                    pieces: { f3: '♕', c4: '♗', e8: '♚', d8: '♛', f7: '♟', e1: '♔' } as Record<string, string>,
                    fromSq: 'f3',
                    targetSq: 'f7',
                    explanation: 'Qxf7#! Supported by the Bishop on c4 (Scholar’s tactical pattern).',
                  },
                ];
                const pz = puzzles[chessPuzzleIdx % puzzles.length];
                const boardPieces = { ...pz.pieces };
                if (chessStatus === 'solved') {
                  delete boardPieces[pz.fromSq];
                  boardPieces[pz.targetSq] = pz.pieces[pz.fromSq];
                }
                const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
                const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

                return (
                  <div className="p-6 rounded-3xl bg-[#1a120d] border border-[#382518] grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="max-w-[300px] mx-auto w-full aspect-square grid grid-cols-8 border-2 border-[#5c3d24] rounded-xl overflow-hidden shadow-xl">
                      {ranks.map((r, ri) =>
                        files.map((f, fi) => {
                          const sq = f + r;
                          const isLight = (ri + fi) % 2 === 0;
                          const piece = boardPieces[sq];
                          const isSel = chessSelectedSq === sq;
                          return (
                            <button
                              key={sq}
                              type="button"
                              onClick={() => {
                                if (chessStatus === 'solved') return;
                                if (!chessSelectedSq) {
                                  if (boardPieces[sq]) setChessSelectedSq(sq);
                                } else if (chessSelectedSq === sq) {
                                  setChessSelectedSq(null);
                                } else {
                                  if (chessSelectedSq === pz.fromSq && sq === pz.targetSq) {
                                    setChessStatus('solved');
                                    setChessSelectedSq(null);
                                  } else {
                                    setChessStatus('wrong');
                                    setChessSelectedSq(null);
                                  }
                                }
                              }}
                              className={`flex items-center justify-center text-xl sm:text-2xl select-none cursor-pointer transition-all ${
                                isSel
                                  ? 'bg-amber-400 text-stone-950'
                                  : chessStatus === 'solved' && sq === pz.targetSq
                                  ? 'bg-[#A47C43] text-white'
                                  : isLight
                                  ? 'bg-[#e6d5b8] text-stone-900'
                                  : 'bg-[#7d5533] text-stone-950'
                              }`}
                            >
                              {piece || ''}
                            </button>
                          );
                        })
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-amber-400">
                          Tactic {(chessPuzzleIdx % puzzles.length) + 1} / {puzzles.length}
                        </span>
                        <h4 className="font-serif text-lg font-bold text-stone-100 mt-1">{pz.title}</h4>
                        <p className="text-xs text-stone-300 mt-1">{pz.clue}</p>
                      </div>

                      {chessStatus === 'solved' && (
                        <div className="p-3.5 rounded-xl bg-[#A47C43]/25 border border-[#A47C43] text-xs text-stone-100">
                          <strong>Check! Brilliant Move:</strong> {pz.explanation}
                        </div>
                      )}
                      {chessStatus === 'wrong' && (
                        <div className="p-3 rounded-xl bg-[#7f1d1d]/25 border border-[#7f1d1d] text-xs text-rose-200">
                          Not the strongest tactical reply — click the attacking piece first, then target square!
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => { setChessStatus('idle'); setChessSelectedSq(null); }}
                          className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold cursor-pointer"
                        >
                          Reset Board
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setChessPuzzleIdx((i) => i + 1);
                            setChessStatus('idle');
                            setChessSelectedSq(null);
                          }}
                          className="px-4 py-2 rounded-xl bg-[#A47C43] hover:bg-[#8e6834] text-white text-xs font-bold cursor-pointer"
                        >
                          Next Tactic →
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* CONSOLE L: CLINICAL LANGUAGES & ANATOMICAL ROOTS FLASHCARDS */}
              {activeConsoleSlab.consoleId === 'latin-roots' && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-stone-300">Click any card to flip between medical phrase and bedside meaning:</span>
                    <div className="flex gap-1.5 bg-[#120c08] p-1 rounded-xl border border-[#382518]">
                      {(['ALL', 'ER Spanish', 'Latin/Greek Roots'] as const).map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setLangFilter(cat)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold cursor-pointer ${langFilter === cat ? 'bg-[#A47C43] text-white' : 'text-stone-400 hover:text-stone-200'}`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {LANGUAGE_SHORT_PROGRAM.filter((item) => langFilter === 'ALL' || item.category === langFilter).map((item) => {
                      const flipped = Boolean(langFlippedMap[item.id]);
                      return (
                        <div
                          key={item.id}
                          onClick={() => setLangFlippedMap((m) => ({ ...m, [item.id]: !m[item.id] }))}
                          className="p-5 rounded-2xl bg-[#1a120d] hover:bg-[#211710] border border-[#382518] hover:border-amber-500/50 cursor-pointer transition-all space-y-2"
                        >
                          <div className="flex items-center justify-between text-[10px] font-mono text-amber-400 uppercase">
                            <span>{item.category}</span>
                            <span>{flipped ? 'Translation' : 'Click to Flip'}</span>
                          </div>
                          {!flipped ? (
                            <>
                              <h4 className="font-serif text-base font-bold text-stone-100">{item.foreign}</h4>
                              <div className="text-xs font-mono text-stone-400">{item.phonetic}</div>
                            </>
                          ) : (
                            <>
                              <h4 className="font-serif text-base font-bold text-amber-300">{item.english}</h4>
                              <p className="text-xs text-stone-300 leading-relaxed">{item.usageContext}</p>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* CONSOLE M: POETRY CORNERS & HAIKU 5-7-5 SCRATCHPAD */}
              {activeConsoleSlab.consoleId === 'poetry' && (() => {
                const poems = [
                  { author: 'William Carlos Williams (Physician-Poet)', title: 'Between Walls', body: 'the back wings / of the / hospital where / nothing will grow lie / cinders / in which shine / the broken pieces of a green bottle' },
                  { author: 'Emily Dickinson', title: '“Hope” is the thing with feathers', body: '“Hope” is the thing with feathers - That perches in the soul - And sings the tune without the words - And never stops - at all -' },
                  { author: 'Rabindranath Tagore', title: 'Gitanjali 11', body: 'Leave this chanting and singing and telling of beads! Whom dost thou worship in this lonely dark corner of a temple with doors all shut?' },
                ];
                const curPoem = poems[poemIdx % poems.length];
                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="p-6 rounded-3xl bg-[#1a120d] border border-[#382518] flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <span className="text-[10px] font-mono uppercase text-amber-400">{curPoem.author}</span>
                        <h4 className="font-serif text-lg font-bold text-stone-100">{curPoem.title}</h4>
                        <p className="font-serif italic text-sm text-stone-200 leading-relaxed whitespace-pre-line">{curPoem.body}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPoemIdx((i) => i + 1)}
                        className="self-start px-4 py-2 rounded-xl bg-[#A47C43] hover:bg-[#8e6834] text-white text-xs font-bold cursor-pointer"
                      >
                        Next Verse →
                      </button>
                    </div>
                    <div className="p-6 rounded-3xl bg-[#1a120d] border border-[#382518] space-y-3">
                      <h4 className="font-serif text-sm font-bold text-stone-100">5-7-5 Haiku Zen Scratchpad</h4>
                      <p className="text-xs text-stone-400">Draft three short calm lines between ward shifts (auto-saved locally):</p>
                      <textarea
                        rows={5}
                        value={haikuDraft}
                        onChange={(e) => {
                          setHaikuDraft(e.target.value);
                          localStorage.setItem('medden_haiku_draft', e.target.value);
                        }}
                        className="w-full bg-[#110c09] border border-[#352317] rounded-xl p-3 font-serif text-sm text-stone-100 outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                );
              })()}

              {/* CONSOLE N: IDIOM GYM */}
              {activeConsoleSlab.consoleId === 'idioms' && (() => {
                const idioms = [
                  { term: 'Kintsugi (Japanese)', literal: 'Golden joinery', meaning: 'Honoring repaired cracks with gold lacquer rather than hiding flaws', options: ['Concealing scars completely', 'Valuing strength gained through healed fractures'], correct: 1 },
                  { term: 'Tsundoku (Japanese)', literal: 'Reading pile', meaning: 'Acquiring stacks of books that wait unread on a bedside shelf', options: ['Reading fast without notes', 'Buying inspiring books & letting them pile beside the bed'], correct: 1 },
                  { term: 'Meraki (Greek)', literal: 'Soulful essence', meaning: 'Doing something with soul, devotion, and mindful care', options: ['Putting piece of yourself into attentive craft', 'Working mechanically for speed'], correct: 0 },
                ];
                const idm = idioms[idiomIdx % idioms.length];
                return (
                  <div className="p-6 rounded-3xl bg-[#1a120d] border border-[#382518] space-y-4">
                    <div className="text-[10px] font-mono uppercase text-amber-400">Untranslatable World Concept {(idiomIdx % idioms.length) + 1}/{idioms.length}</div>
                    <h4 className="font-serif text-xl font-bold text-stone-100">{idm.term} · <span className="text-sm text-stone-400 font-normal">“{idm.literal}”</span></h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {idm.options.map((o, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setIdiomQuizChoice(idx)}
                          className={`p-3.5 rounded-xl border text-left text-xs cursor-pointer ${
                            idiomQuizChoice !== null
                              ? idx === idm.correct
                                ? 'bg-[#A47C43]/30 border-[#A47C43] text-stone-100 font-semibold'
                                : idiomQuizChoice === idx
                                ? 'bg-[#7f1d1d]/30 border-[#7f1d1d] text-rose-200'
                                : 'bg-stone-900 border-stone-800 text-stone-500'
                              : 'bg-[#120c08] border-[#382518] hover:border-amber-500 text-stone-200'
                          }`}
                        >
                          {o}
                        </button>
                      ))}
                    </div>
                    {idiomQuizChoice !== null && (
                      <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#120c08] border border-amber-700/40 text-xs text-stone-200">
                        <span>{idm.meaning}</span>
                        <button
                          type="button"
                          onClick={() => { setIdiomIdx((i) => i + 1); setIdiomQuizChoice(null); }}
                          className="px-3.5 py-1.5 rounded-lg bg-[#A47C43] text-white font-bold cursor-pointer shrink-0"
                        >
                          Next →
                        </button>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* CONSOLE O: SOCIOLOGY & SOCIAL CURRENTS */}
              {activeConsoleSlab.consoleId === 'sociology' && (() => {
                const cases = [
                  { title: 'Bystander Diffusion of Responsibility', question: 'In a crowded train station collapse vs a solo passerby, why do single witnesses intervene faster?', answer: 'When ambiguity is shared among 10+ observers, each person diffuses moral urgency unless explicitly pointed at ("You in the blue jacket, call ambulance!").' },
                  { title: 'Goffman’s Front Stage vs Back Stage', question: 'Why does a doctors’ lounge restore emotional composure immediately after an intense bedside family talk?', answer: 'Clinical wards require regulated "Front Stage" calm; sanctuaries without patient gaze act as "Back Stage" autonomic recovery zones.' },
                  { title: 'Information Cascades in Hospital Triage', question: 'What happens when 3 senior residents agree out loud before juniors speak?', answer: 'Juniors suppress private diagnostic doubts to align with social proof — mitigated by blind written differential polling.' },
                ];
                const cur = cases[socCaseIdx % cases.length];
                return (
                  <div className="p-6 rounded-3xl bg-[#1a120d] border border-[#382518] space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase text-amber-400">Social System Dynamic {(socCaseIdx % cases.length) + 1}/{cases.length}</span>
                      <button
                        type="button"
                        onClick={() => setSocCaseIdx((i) => i + 1)}
                        className="px-3 py-1 rounded-lg bg-[#A47C43] text-white text-xs font-bold cursor-pointer"
                      >
                        Next Case →
                      </button>
                    </div>
                    <h4 className="font-serif text-lg font-bold text-stone-100">{cur.title}</h4>
                    <p className="text-xs text-stone-300">{cur.question}</p>
                    <button
                      type="button"
                      onClick={() => setSocRevealed((r) => ({ ...r, [socCaseIdx]: !r[socCaseIdx] }))}
                      className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 text-xs font-semibold cursor-pointer"
                    >
                      {socRevealed[socCaseIdx] ? 'Hide Sociological Insight' : 'Reveal Sociological Insight'}
                    </button>
                    {socRevealed[socCaseIdx] && (
                      <div className="p-4 rounded-2xl bg-[#120c08] border border-amber-700/40 text-xs text-stone-200 leading-relaxed">
                        {cur.answer}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* CONSOLE P: URBANISM & BIOPHILIC HEALTHY CITIES */}
              {activeConsoleSlab.consoleId === 'urbanism' && (() => {
                const activeCount = Object.values(urbanPolicies).filter(Boolean).length;
                const cardioIdx = 58 + (urbanPolicies.bike ? 16 : 0) + (urbanPolicies.transit ? 12 : 0) + (urbanPolicies.trees ? 8 : 0);
                const calmIdx = 52 + (urbanPolicies.trees ? 18 : 0) + (urbanPolicies.quiet ? 20 : 0) + (urbanPolicies.bike ? 6 : 0);
                return (
                  <div className="p-6 rounded-3xl bg-[#1a120d] border border-[#382518] space-y-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-bold text-stone-100">15-Minute Biophilic City Simulator</h4>
                        <p className="text-xs text-stone-400">Toggle civic design interventions to inspect population health impact</p>
                      </div>
                      <span className="text-xs font-mono text-amber-300">{activeCount}/4 Policies Active</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { key: 'trees', label: '🌳 Dense Urban Tree Canopy', desc: '-3.2°C urban heat island & lower cortisol' },
                        { key: 'bike', label: '🚲 Protected Bike Corridors', desc: '+16% active commute cardiovascular health' },
                        { key: 'transit', label: '🚊 5-Min Walkable Transit Hubs', desc: 'Cuts sedentary congestion & PM2.5 particulates' },
                        { key: 'quiet', label: '🏥 Hospital Acoustic Quiet Zones', desc: 'Improves ICU sleep architecture & recovery' },
                      ].map((p) => {
                        const on = Boolean(urbanPolicies[p.key]);
                        return (
                          <button
                            key={p.key}
                            type="button"
                            onClick={() => setUrbanPolicies((u) => ({ ...u, [p.key]: !u[p.key] }))}
                            className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                              on ? 'bg-[#A47C43]/20 border-[#A47C43] text-stone-100' : 'bg-[#120c08] border-[#352317] text-stone-400'
                            }`}
                          >
                            <div className="flex items-center justify-between text-xs font-bold">
                              <span>{p.label}</span>
                              <span>{on ? 'ON' : 'OFF'}</span>
                            </div>
                            <div className="text-[11px] opacity-80 mt-1">{p.desc}</div>
                          </button>
                        );
                      })}
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="p-3.5 rounded-2xl bg-[#120c08] border border-[#352317]">
                        <div className="text-[10px] font-mono text-stone-400">CARDIOVASCULAR MOBILITY SCORE</div>
                        <div className="text-2xl font-mono font-black text-amber-300 mt-1">{cardioIdx}/100</div>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-[#120c08] border border-[#352317]">
                        <div className="text-[10px] font-mono text-stone-400">RESTORATIVE CALM INDEX</div>
                        <div className="text-2xl font-mono font-black text-amber-300 mt-1">{calmIdx}/100</div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* CONSOLE Q: WORLD HISTORY & MEDICAL REVOLUTIONS TIMELINE */}
              {activeConsoleSlab.consoleId === 'history' && (() => {
                const ev = HISTORY_EVENTS[historyIdx % HISTORY_EVENTS.length];
                return (
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {HISTORY_EVENTS.map((h, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setHistoryIdx(i)}
                          className={`px-3 py-1.5 rounded-full text-xs font-mono cursor-pointer transition-all ${
                            historyIdx === i ? 'bg-[#A47C43] text-white font-bold' : 'bg-[#1a120d] text-stone-300 border border-[#382518]'
                          }`}
                        >
                          {h.year}
                        </button>
                      ))}
                    </div>
                    <div className="p-6 rounded-3xl bg-[#1a120d] border border-[#382518] space-y-3">
                      <span className="text-[10px] font-mono uppercase text-amber-400">{ev.era} · {ev.year}</span>
                      <h4 className="font-serif text-lg font-bold text-stone-100">{ev.title}</h4>
                      <p className="text-xs text-stone-300 leading-relaxed">{ev.summary}</p>
                      <div className="p-3 rounded-xl bg-[#120c08] border border-[#352317] text-xs text-[#d4aa6e]">
                        <strong>Impact on Humanity:</strong> {ev.impactOnHumanity}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* CONSOLE R: WORLD MAP SANCTUARIES INTERACTIVE ATLAS */}
              {activeConsoleSlab.consoleId === 'worldmap' && (() => {
                const place = WORLD_PLACES[mapPlaceIdx % WORLD_PLACES.length];
                const pins = [
                  { idx: 0, x: 28, y: 66 }, // Uyuni Bolivia
                  { idx: 1, x: 83, y: 40 }, // Kyoto Japan
                  { idx: 2, x: 50, y: 31 }, // Oeschinensee Switzerland
                  { idx: 3, x: 69, y: 46 }, // Varanasi India
                ];
                return (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                    <div className="md:col-span-7 p-4 rounded-3xl bg-[#110c09] border border-[#382518] relative">
                      <svg viewBox="0 0 100 60" className="w-full h-auto opacity-85">
                        <rect width="100" height="60" rx="4" fill="#18110c" />
                        {/* Stylized Continental Massifs */}
                        <path d="M12,18 L28,15 L30,28 L20,33 L13,26 Z" fill="#3a281a" />
                        <path d="M23,35 L34,37 L31,55 L24,52 Z" fill="#3a281a" />
                        <path d="M44,16 L58,15 L60,26 L46,27 Z" fill="#3a281a" />
                        <path d="M46,28 L57,30 L56,50 L48,48 Z" fill="#3a281a" />
                        <path d="M59,15 L88,18 L85,38 L66,40 L60,28 Z" fill="#3a281a" />
                        <path d="M74,42 L86,42 L85,53 L75,52 Z" fill="#3a281a" />
                        {pins.map((pin) => {
                          const p = WORLD_PLACES[pin.idx];
                          const active = mapPlaceIdx === pin.idx;
                          return (
                            <g key={p.id} onClick={() => setMapPlaceIdx(pin.idx)} className="cursor-pointer">
                              {active && <circle cx={pin.x} cy={pin.y * 0.6} r="4.2" fill="#f59e0b" opacity="0.28" />}
                              <circle cx={pin.x} cy={pin.y * 0.6} r={active ? 2.4 : 1.7} fill={active ? '#f59e0b' : '#c49a62'} stroke="#110c09" strokeWidth="0.6" />
                              <text x={pin.x} y={pin.y * 0.6 - 3.2} textAnchor="middle" fontSize="2.7" fill="#f5eedc" fontWeight={active ? 'bold' : 'normal'}>
                                {p.country}
                              </text>
                            </g>
                          );
                        })}
                      </svg>
                    </div>
                    <div className="md:col-span-5 p-5 rounded-3xl bg-[#1a120d] border border-[#382518] space-y-2.5">
                      <div className="flex items-center justify-between text-[10px] font-mono text-amber-400">
                        <span>{place.theme}</span>
                        <span>{place.coordinates}</span>
                      </div>
                      <h4 className="font-serif text-lg font-bold text-stone-100">{place.name}</h4>
                      <p className="text-xs text-stone-300 leading-relaxed">{place.description}</p>
                      <div className="p-3 rounded-xl bg-[#120c08] border border-[#352317] text-xs text-[#d4aa6e]">
                        <strong>Mindfulness Reflection:</strong> {place.mindfulnessInsight}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* CONSOLE S: ART & HERITAGE MUSEUM WALKS */}
              {activeConsoleSlab.consoleId === 'heritage' && (() => {
                const stops = [
                  { museum: 'Louvre · Wing Denon', city: 'Paris', highlight: 'Winged Victory of Samothrace & Marble Classical Galleries', detail: 'Ascend the Daru staircase as Hellenistic sculpted drapery catches skylight from the glass vault above.' },
                  { museum: 'Uffizi Anatomical Codices', city: 'Florence', highlight: 'Renaissance Perspective & Botanical Herbal Manuscripts', detail: 'Early 15th-century physicians studied botanical pigments alongside sacred proportion before sketching anatomy.' },
                  { museum: 'National Museum · Kashi Bronze Gallery', city: 'New Delhi', highlight: 'Surgical Instruments & Chola Lost-Wax Bronzes', detail: 'Traces millennia-old metallurgical mastery from ancient medical probes to meditative bronze casting.' },
                ];
                const stop = stops[heritageStopIdx % stops.length];
                return (
                  <div className="p-6 rounded-3xl bg-[#1a120d] border border-[#382518] space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {stops.map((st, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setHeritageStopIdx(idx)}
                          className={`px-3 py-1.5 rounded-full text-xs cursor-pointer ${heritageStopIdx === idx ? 'bg-[#A47C43] text-white font-bold' : 'bg-[#120c08] text-stone-300 border border-[#382518]'}`}
                        >
                          {st.city} · Gallery {idx + 1}
                        </button>
                      ))}
                    </div>
                    <h4 className="font-serif text-xl font-bold text-stone-100">{stop.museum}</h4>
                    <div className="text-xs font-semibold text-amber-300">Featured Exhibit: {stop.highlight}</div>
                    <p className="text-xs text-stone-300 leading-relaxed">{stop.detail}</p>
                  </div>
                );
              })()}

              {/* CONSOLE T: MASTERPIECE ART & CLICK-TO-COPY COLOR PALETTES */}
              {activeConsoleSlab.consoleId === 'art' && (() => {
                const piece = ART_PIECES[artIdx % ART_PIECES.length];
                const palettes = [
                  ['#5E4534', '#A47C43', '#D9B99B', '#2C221E', '#F3EDE2'],
                  ['#1E1B18', '#7C5832', '#C69F68', '#52341D', '#EADBC8'],
                  ['#2B4C7E', '#608BC1', '#A6C8E0', '#B399D4', '#E8E2F2'],
                ];
                const colors = palettes[artIdx % palettes.length];
                return (
                  <div className="p-6 rounded-3xl bg-[#1a120d] border border-[#382518] space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex gap-1.5">
                        {ART_PIECES.map((ap, idx) => (
                          <button
                            key={ap.id}
                            type="button"
                            onClick={() => setArtIdx(idx)}
                            className={`px-3 py-1 rounded-full text-xs cursor-pointer ${artIdx === idx ? 'bg-[#A47C43] text-white font-bold' : 'bg-[#120c08] text-stone-300 border border-[#382518]'}`}
                          >
                            {ap.artist.split(' ').pop()}
                          </button>
                        ))}
                      </div>
                      {copiedHex && <span className="text-xs font-mono text-amber-300">Copied {copiedHex}</span>}
                    </div>
                    <h4 className="font-serif text-lg font-bold text-stone-100">{piece.title} ({piece.year})</h4>
                    <div className="text-xs font-mono text-stone-400">{piece.medium}</div>
                    <p className="text-xs text-stone-300 leading-relaxed">{piece.anatomicalBreakdown}</p>
                    <div className="p-3 rounded-xl bg-[#120c08] border border-[#352317] text-xs text-[#d4aa6e]">
                      <strong>Curator’s Secret:</strong> {piece.artisticSecret}
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-stone-400 mb-2">MASTER PALETTE (Click hex to copy):</div>
                      <div className="flex gap-2">
                        {colors.map((hex) => (
                          <button
                            key={hex}
                            type="button"
                            onClick={() => {
                              navigator.clipboard?.writeText(hex).catch(() => {});
                              setCopiedHex(hex);
                              setTimeout(() => setCopiedHex(null), 1500);
                            }}
                            className="flex-1 h-12 rounded-xl border border-white/15 flex items-end justify-center pb-1 text-[9px] font-mono text-white shadow-inner cursor-pointer hover:scale-105 transition-transform"
                            style={{ backgroundColor: hex }}
                          >
                            {hex}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* CONSOLE U: HIGH FASHION, TEXTILES & SCRUB COUTURE */}
              {activeConsoleSlab.consoleId === 'fashion' && (() => {
                const fm = FASHION_MILESTONES[fashionIdx % FASHION_MILESTONES.length];
                return (
                  <div className="p-6 rounded-3xl bg-[#1a120d] border border-[#382518] space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {FASHION_MILESTONES.map((f, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setFashionIdx(idx)}
                          className={`px-3 py-1.5 rounded-full text-xs cursor-pointer ${fashionIdx === idx ? 'bg-[#A47C43] text-white font-bold' : 'bg-[#120c08] text-stone-300 border border-[#382518]'}`}
                        >
                          {f.badge}
                        </button>
                      ))}
                    </div>
                    <h4 className="font-serif text-lg font-bold text-stone-100">{fm.title}</h4>
                    <div className="p-3.5 rounded-2xl bg-[#120c08] border border-[#352317] text-xs text-stone-300">
                      <strong className="text-amber-300">Innovation: </strong>{fm.innovation}
                    </div>
                    <div className="p-3.5 rounded-2xl bg-[#120c08] border border-[#352317] text-xs text-stone-300">
                      <strong className="text-amber-300">Material Science: </strong>{fm.materialScience}
                    </div>
                    <div className="text-xs text-[#d4aa6e]">
                      <strong>Ward / Daily Ergonomics: </strong>{fm.dailyApplication}
                    </div>
                  </div>
                );
              })()}

              {/* CONSOLE V: ARCHITECTURE DIGEST & GOLDEN RATIO CALCULATOR */}
              {activeConsoleSlab.consoleId === 'architecture' && (
                <div className="p-6 rounded-3xl bg-[#1a120d] border border-[#382518] space-y-5">
                  <div>
                    <h4 className="font-serif text-lg font-bold text-stone-100">Golden Ratio (φ = 1.618) Spatial Harmony Calculator</h4>
                    <p className="text-xs text-stone-400">Adjust base module dimension (mm or px) to inspect Classical Renaissance proportions</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    <input
                      type="range"
                      min={20}
                      max={400}
                      value={archBase}
                      onChange={(e) => setArchBase(Number(e.target.value))}
                      className="flex-1 min-w-[200px] accent-[#A47C43]"
                    />
                    <span className="font-mono text-sm font-bold text-amber-300">Base: {archBase}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 rounded-2xl bg-[#120c08] border border-[#352317]">
                      <div className="text-[10px] font-mono text-stone-400">MINOR (÷ φ)</div>
                      <div className="text-lg font-mono font-bold text-stone-100">{(archBase / 1.618).toFixed(1)}</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-[#A47C43]/20 border border-[#A47C43]">
                      <div className="text-[10px] font-mono text-amber-300">BASE SPAN</div>
                      <div className="text-lg font-mono font-bold text-amber-200">{archBase}</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-[#120c08] border border-[#352317]">
                      <div className="text-[10px] font-mono text-stone-400">GOLDEN (× φ)</div>
                      <div className="text-lg font-mono font-bold text-stone-100">{(archBase * 1.618).toFixed(1)}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* CONSOLE W: CURATED MAGAZINES & LONGFORM READER */}
              {activeConsoleSlab.consoleId === 'magazines' && (() => {
                const art = MAGAZINE_ARTICLES[magIdx % MAGAZINE_ARTICLES.length];
                return (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-4 space-y-2">
                      {MAGAZINE_ARTICLES.map((m, idx) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setMagIdx(idx)}
                          className={`w-full p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                            magIdx === idx ? 'bg-[#A47C43]/20 border-[#A47C43] text-stone-100' : 'bg-[#1a120d] border-[#382518] text-stone-300 hover:border-amber-600/50'
                          }`}
                        >
                          <div className="text-[10px] font-mono text-amber-400">{m.pubLogo} {m.publication}</div>
                          <div className="text-xs font-bold line-clamp-2 mt-0.5">{m.title}</div>
                        </button>
                      ))}
                    </div>
                    <div className="md:col-span-8 p-6 rounded-3xl bg-[#1a120d] border border-[#382518] space-y-3">
                      <div className="flex items-center justify-between text-[10px] font-mono text-stone-400">
                        <span className="text-amber-400 font-bold">{art.pubLogo} {art.publication}</span>
                        <span>{art.readTime} · {art.author}</span>
                      </div>
                      <h4 className="font-serif text-xl font-bold text-stone-100 leading-snug">{art.title}</h4>
                      <div className="p-3.5 rounded-2xl bg-[#120c08] border border-amber-700/40 text-xs text-amber-200">
                        <strong>Key Takeaway:</strong> {art.takeaway}
                      </div>
                      <p className="font-serif text-sm text-stone-300 leading-relaxed">{art.excerpt}</p>
                    </div>
                  </div>
                );
              })()}

              {/* CONSOLE H: INTERACTIVE CUSTOM SLAB SANCTUARY */}
              {![
                'nature', 'scramble', 'stretches', 'sleep-cycles', 'daily-biases', 'biases-casino',
                'news', 'motorsport', 'racing-mindset', 'post-mbbs-careers', 'overseas-jobs',
                'coding', 'vocab', 'chess', 'latin-roots', 'poetry', 'idioms',
                'sociology', 'urbanism', 'history', 'worldmap', 'heritage', 'art', 'fashion', 'architecture', 'magazines'
              ].includes(activeConsoleSlab.consoleId) && (
                <div className="p-6 rounded-3xl bg-[#1a120d] border border-[#382518] space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{activeConsoleSlab.icon}</span>
                    <div>
                      <h4 className="font-serif text-xl font-bold text-stone-100">
                        {activeConsoleSlab.name} Personal Sanctuary
                      </h4>
                      <p className="text-xs text-stone-400">{activeConsoleSlab.tagline}</p>
                    </div>
                  </div>
                  <textarea
                    rows={5}
                    placeholder="Write calming reflections, lyrics, or break goals for this slab..."
                    value={customSlabNotes[activeConsoleSlab.id] || ''}
                    onChange={(e) => {
                      const next = { ...customSlabNotes, [activeConsoleSlab.id]: e.target.value };
                      setCustomSlabNotes(next);
                      localStorage.setItem('medden_custom_slab_notes', JSON.stringify(next));
                    }}
                    className="w-full bg-[#110c09] border border-[#352317] rounded-2xl p-4 text-xs text-stone-100 outline-none focus:border-amber-500"
                  />
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => toggleAudio('rain')}
                      className="px-4 py-2 rounded-xl bg-[#A47C43] hover:bg-[#8e6834] text-white text-xs font-semibold flex items-center gap-2 cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>{isAudioPlaying ? 'Mute Ambient Sound' : 'Play Calming Rain'}</span>
                    </button>
                    {onBackToStudy && (
                      <button
                        type="button"
                        onClick={onBackToStudy}
                        className="px-4 py-2 rounded-xl bg-[#251a12] hover:bg-[#322318] text-stone-200 text-xs font-semibold cursor-pointer"
                      >
                        Resume Notes
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 6. STUDY BREAK EXPIRED MODAL */}
      {isBreakAlarmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-[#18110c] border border-amber-500/80 rounded-3xl max-w-md w-full p-6 text-stone-100 shadow-2xl space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-3xl mx-auto shadow-inner">
              ⏰
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-serif text-2xl font-bold text-amber-300">Study Break Finished!</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                You've completed your restorative mental pause. Your mind is refreshed and ready to master high-yield medical concepts!
              </p>
            </div>
            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsBreakAlarmModalOpen(false);
                  setTimerInputMinutes(5); setTimerInputSeconds(0); handleStartCustomTimer(5, 0);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#251a12] hover:bg-[#322318] text-xs font-semibold text-stone-300 cursor-pointer"
              >
                +5 Min Snooze
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsBreakAlarmModalOpen(false);
                  if (onBackToStudy) onBackToStudy();
                }}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold shadow-md cursor-pointer"
              >
                Resume Study Notes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. SLAB LOGO / THUMBNAIL PICKER MODAL */}
      {logoPickerSlabId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-[#18110c] border border-[#382518] rounded-3xl max-w-lg w-full p-6 text-stone-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#352317]">
              <h3 className="font-serif font-bold text-lg text-stone-100 flex items-center gap-2">
                <Camera className="w-5 h-5 text-amber-400" />
                <span>Customize Slab Icon or Upload Picture</span>
              </h3>
              <button
                type="button"
                onClick={() => setLogoPickerSlabId(null)}
                className="text-stone-400 hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <div className="text-xs font-semibold text-stone-300 mb-2">Pick an Animated Medical / Aesthetic Emoji:</div>
              <div className="grid grid-cols-7 gap-2">
                {['🩺', '🧠', '🫁', '❤️', '🔬', '💊', '⚡', '☕', '🏛️', '🏎️', '🎨', '🧩', '📖', '🌟'].map((ico) => (
                  <button
                    key={ico}
                    type="button"
                    onClick={() => handleSaveCustomLogo(logoPickerSlabId, ico)}
                    className="p-3 rounded-xl bg-[#251a12] hover:bg-amber-500/20 text-xl flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
                  >
                    {ico}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-[#352317] space-y-2.5">
              <div className="text-xs font-semibold text-stone-300">Upload Picture or Paste URL:</div>
              <label className="w-full py-2 px-3 rounded-xl bg-[#251a12] hover:bg-[#312217] border border-amber-700/30 text-xs text-amber-200 flex items-center justify-center gap-2 cursor-pointer transition-colors">
                <Upload className="w-3.5 h-3.5 text-amber-400" />
                <span>Choose Image File from Device</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file || !logoPickerSlabId) return;
                    const reader = new FileReader();
                    reader.onload = () => {
                      if (typeof reader.result === 'string') {
                        handleSaveCustomLogo(logoPickerSlabId, reader.result);
                      }
                    };
                    reader.readAsDataURL(file);
                  }}
                />
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/... or data:image"
                  value={customLogoInput}
                  onChange={(e) => setCustomLogoInput(e.target.value)}
                  className="flex-1 bg-[#120c08] border border-[#382518] rounded-xl px-3 py-2 text-xs text-stone-100 outline-none focus:border-amber-400"
                />
                <button
                  type="button"
                  onClick={() => customLogoInput.trim() && handleSaveCustomLogo(logoPickerSlabId, customLogoInput.trim())}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Apply
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center">
              <button
                type="button"
                onClick={() => handleResetCustomLogo(logoPickerSlabId)}
                className="text-xs text-stone-500 hover:text-stone-300 underline cursor-pointer"
              >
                Reset to Default
              </button>
              <button
                type="button"
                onClick={() => setLogoPickerSlabId(null)}
                className="px-4 py-1.5 rounded-xl bg-[#251a12] text-xs text-stone-300 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. PUBLISH NEW GLOBAL JOB MODAL */}
      {isAddJobModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <form onSubmit={handleAddJobSubmit} className="bg-[#18110c] border border-[#382518] rounded-3xl max-w-lg w-full p-6 text-stone-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#352317]">
              <h3 className="font-serif font-bold text-lg text-stone-100 flex items-center gap-2">
                <Globe className="w-5 h-5 text-amber-400" />
                <span>Publish New Overseas / Post-MBBS Opportunity</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddJobModalOpen(false)}
                className="text-stone-400 hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-400 mb-1">Opportunity / Job Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Junior Clinical Fellow in Cardiology (NHS Trust)"
                  value={newJobTitle}
                  onChange={(e) => setNewJobTitle(e.target.value)}
                  className="w-full bg-[#120c08] border border-[#382518] rounded-xl px-3 py-2 text-stone-100 outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-400 mb-1">Country / Region</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. United Kingdom, Australia, UAE"
                    value={newJobCountry}
                    onChange={(e) => setNewJobCountry(e.target.value)}
                    className="w-full bg-[#120c08] border border-[#382518] rounded-xl px-3 py-2 text-stone-100 outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 mb-1">Salary / Stipend</label>
                  <input
                    type="text"
                    placeholder="e.g. £42,000 / yr or $75,000 / yr"
                    value={newJobSalary}
                    onChange={(e) => setNewJobSalary(e.target.value)}
                    className="w-full bg-[#120c08] border border-[#382518] rounded-xl px-3 py-2 text-stone-100 outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-400 mb-1">Hospital / Agency / Organization</label>
                  <input
                    type="text"
                    placeholder="e.g. Oxford University Hospitals NHS"
                    value={newJobOrg}
                    onChange={(e) => setNewJobOrg(e.target.value)}
                    className="w-full bg-[#120c08] border border-[#382518] rounded-xl px-3 py-2 text-stone-100 outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 mb-1">Official Portal Link</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newJobLink}
                    onChange={(e) => setNewJobLink(e.target.value)}
                    className="w-full bg-[#120c08] border border-[#382518] rounded-xl px-3 py-2 text-stone-100 outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Contact Email / Recruiter</label>
                <input
                  type="email"
                  placeholder="recruitment@hospital.org"
                  value={newJobContact}
                  onChange={(e) => setNewJobContact(e.target.value)}
                  className="w-full bg-[#120c08] border border-[#382518] rounded-xl px-3 py-2 text-stone-100 outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Pathway Details & Requirements</label>
                <textarea
                  rows={3}
                  placeholder="Exam requirements (PLAB/USMLE), visa sponsorship status, core rotation details..."
                  value={newJobDesc}
                  onChange={(e) => setNewJobDesc(e.target.value)}
                  className="w-full bg-[#120c08] border border-[#382518] rounded-xl p-3 text-stone-100 outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddJobModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#251a12] text-xs text-stone-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md cursor-pointer"
              >
                Publish to Global Directory
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
