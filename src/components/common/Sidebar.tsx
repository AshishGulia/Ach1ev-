import React, { useState, useEffect } from 'react';
import { SubjectCourse, UserProfile, DashboardPreset, SidebarSettings, AppLanguage, DesignId } from '../../types';
import { getThemeMeta } from '../../data/themeMeta';
import { getTranslation, getCurrentLanguage } from '../../data/translations';
import { AchievBrand } from './AchievBrand';
import {
  LayoutDashboard,
  Trash2,
  ArrowLeft,
  ArrowRight,
  BookOpenText,
  Settings,
  Users,
  CalendarDays,
  MessageSquareCode,
  Brain,
  Coffee,
} from 'lucide-react';

// Authentic Bookshelf / Almirah SVG Icon
const BookshelfIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <line x1="3" y1="9" x2="21" y2="9" />
    <line x1="3" y1="15" x2="21" y2="15" />
    <line x1="8" y1="3" x2="8" y2="9" />
    <line x1="15" y1="9" x2="15" y2="15" />
    <line x1="9" y1="15" x2="9" y2="21" />
  </svg>
);

// Custom Nib Pen SVG Icon
const PenLogoIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    <path d="m15 5 4 4" />
  </svg>
);

export type AppViewType =
  | 'home'
  | 'read'
  | 'notebooks'
  | 'library'
  | 'roster'
  | 'recycle-bin'
  | 'make-note'
  | 'mnemonics'
  | 'leisure'
  | 'community'
  | 'talk-to-dev'
  | 'settings';

export const DAILY_THOUGHTS_31 = [
  { text: "The good physician treats the disease; the great physician treats the patient who has the disease.", author: "Sir William Osler", icon: "☕" },
  { text: "Between stimulus and response there is a space. In that space is our power to choose.", author: "Viktor Frankl", icon: "🧘" },
  { text: "Fast decisions are often driven by heuristics; pause when the clinical stakes are high.", author: "Daniel Kahneman", icon: "💡" },
  { text: "We suffer more often in imagination than in reality.", author: "Seneca", icon: "🕯️" },
  { text: "Better is possible. It does not take genius. It takes diligence and moral clarity.", author: "Dr. Atul Gawande", icon: "🩺" },
  { text: "He who has a why to live can bear almost any how.", author: "Friedrich Nietzsche", icon: "🌱" },
  { text: "Cure sometimes, treat often, comfort always.", author: "Hippocrates", icon: "🕊️" },
  { text: "Certainty in medicine is an illusion; wisdom lies in navigating the gray with care.", author: "Siddhartha Mukherjee", icon: "📖" },
  { text: "You have power over your mind, not outside events. Realize this, and find calm strength.", author: "Marcus Aurelius", icon: "🏛️" },
  { text: "The first principle is that you must not fool yourself — and you are easiest to fool.", author: "Richard Feynman", icon: "🔬" },
  { text: "Attention is the rarest and purest form of clinical generosity.", author: "Simone Weil", icon: "✨" },
  { text: "Diagnose before you treat; listen before you conclude.", author: "Clinical Maxim", icon: "👂" },
  { text: "Fatigue compromises judgment; rest is not a reward, it is a clinical necessity.", author: "Medical Maxim", icon: "🌙" },
  { text: "A ship in harbor is safe, but that is not what ships are built for.", author: "John A. Shedd", icon: "⛵" },
  { text: "Doubt is not a pleasant condition, but certainty is an absurd one.", author: "Voltaire", icon: "💭" },
  { text: "The greatest medicine of all is teaching people how not to need it.", author: "Preventive Care", icon: "🌿" },
  { text: "Mastery is not about perfection, but steady patient curiosity on the ward.", author: "Robert Greene", icon: "🧭" },
  { text: "Look closely at the data, but never forget the human pulse behind the chart.", author: "Dr. Paul Kalanithi", icon: "❤️" },
  { text: "When an outcome is critical, checklist clarity trumps memory under stress.", author: "Checklist Manifesto", icon: "📋" },
  { text: "Small consistent disciplines compound into legendary clinical intuition.", author: "James Clear", icon: "⏳" },
  { text: "The mind that perceives the problem cannot solve it from the same state of hurry.", author: "Albert Einstein", icon: "🌊" },
  { text: "Silence is sometimes the most powerful diagnostic tool during a patient interview.", author: "Dr. Abraham Verghese", icon: "🤫" },
  { text: "Calmness of mind is one of the beautiful jewels of wisdom.", author: "James Allen", icon: "💎" },
  { text: "Every patient is a book waiting to be understood, not merely indexed.", author: "Oliver Sacks", icon: "📚" },
  { text: "Clear thinking requires courage rather than intellect alone.", author: "Thomas Sowell", icon: "🧠" },
  { text: "To know what you know and that you do not know what you do not know, that is true knowledge.", author: "Confucius", icon: "🏮" },
  { text: "In high-stress surgical decisions, slow is smooth, and smooth is fast.", author: "Surgical Maxim", icon: "⚡" },
  { text: "He who studies medicine without books sails an uncharted sea; without patients does not go to sea.", author: "Sir William Osler", icon: "🌊" },
  { text: "Grit is passion and perseverance for very long-term goals.", author: "Angela Duckworth", icon: "🏔️" },
  { text: "Peace is not the absence of trouble, but the presence of perspective.", author: "Stoic Maxim", icon: "🕊️" },
  { text: "The art of medicine consists in amusing the patient while nature cures the disease.", author: "Voltaire", icon: "🎭" },
];

export const DEFAULT_SIDEBAR_SETTINGS: SidebarSettings = {
  showMySpace: true,
  showRead: true,
  showCreateNote: true,
  showCalendar: true,
  showLibrary: true,
  showMnemonics: false,
  showCommunity: true,
  showLeisure: false,
  showTalkToDev: true,
};

export const DEFAULT_SIDEBAR_ORDER: string[] = [
  'home',
  'read',
  'make-note',
  'roster',
  'library',
  'mnemonics',
  'community',
  'leisure',
  'talk-to-dev',
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
  activeView: AppViewType;
  isSettingsActive?: boolean;
  onNavigate: (view: AppViewType) => void;
  currentSubject: SubjectCourse;
  onSelectSubject: (subject: SubjectCourse) => void;
  userProfile: UserProfile;
  designEdition?: DashboardPreset;
  activeDesign?: DesignId;
  onOpenSettings?: () => void;
  onOpenAIStudioModal?: () => void;
  isDarkMode?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  onToggle,
  activeView,
  isSettingsActive,
  onNavigate,
  currentSubject,
  userProfile,
  activeDesign,
  onOpenSettings,
  isDarkMode,
}) => {
  const isSettingsOn = activeView === 'settings' || !!isSettingsActive;

  const isNightMode =
    isDarkMode !== undefined
      ? isDarkMode
      : typeof document !== 'undefined'
      ? document.documentElement.classList.contains('dark') ||
        localStorage.getItem('medden_theme') === 'dark'
      : false;

  const [observedDesign, setObservedDesign] = useState<string>(() => {
    try {
      if (typeof document !== 'undefined') {
        return (
          document.documentElement.getAttribute('data-design') ||
          localStorage.getItem('medden_active_design') ||
          '1'
        );
      }
    } catch {}
    return '1';
  });

  useEffect(() => {
    if (activeDesign !== undefined) return;
    const syncDesign = () => {
      try {
        const d =
          document.documentElement.getAttribute('data-design') ||
          localStorage.getItem('medden_active_design') ||
          '1';
        setObservedDesign(d);
      } catch {}
    };
    syncDesign();
    const obs = new MutationObserver(syncDesign);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-design'],
    });
    return () => obs.disconnect();
  }, [activeDesign]);

  const resolvedDesign = activeDesign || observedDesign || '1';
  const themeMeta = getThemeMeta(resolvedDesign);
  const sb = isNightMode ? themeMeta.sidebar.dark : themeMeta.sidebar.light;

  const railWallpaper = isNightMode ? themeMeta.darkWallpaperUri : themeMeta.lightWallpaperUri;

  const sidebarSurfaceStyle: React.CSSProperties = {
    background: sb.railBg,
    borderRight: `1px solid ${sb.railBorder}`,
    color: sb.railText,
  };

  const leatherBtnCls = '';

  const getBtnStyle = (isActive: boolean): React.CSSProperties =>
    isActive
      ? {
          background: sb.activeBtnBg,
          border: `1px solid ${sb.activeBtnBorder}`,
          color: sb.activeBtnText,
          borderRadius: resolvedDesign === '1' ? '9px' : themeMeta.buttonRadius,
          fontWeight: 600,
          backdropFilter: 'blur(14px) saturate(1.25)',
          WebkitBackdropFilter: 'blur(14px) saturate(1.25)',
          boxShadow: isNightMode
            ? '0 0 0 1px rgba(255, 255, 255, 0.2), 0 8px 20px -4px rgba(0, 0, 0, 0.9), 0 2px 6px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.42), inset 0 -1px 0 rgba(0, 0, 0, 0.25)'
            : '0 4px 12px -2px rgba(36, 22, 10, 0.34), 0 2px 4px rgba(36, 22, 10, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.22)',
        }
      : {
          background: sb.idleBtnBg,
          border: '1px solid transparent',
          color: sb.idleBtnText,
          borderRadius: resolvedDesign === '1' ? '9px' : themeMeta.buttonRadius,
          boxShadow: isNightMode
            ? '0 3px 8px -2px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
            : undefined,
        };

  const toggleBtnStyle: React.CSSProperties = {
    background: sb.toggleBtnBg,
    border: `1px solid ${sb.toggleBtnBorder}`,
    color: sb.toggleBtnText,
    borderRadius: resolvedDesign === '1' ? '9px' : themeMeta.buttonRadius,
    boxShadow: isNightMode
      ? '0 4px 10px -2px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.14)'
      : undefined,
  };

  // Language state
  const [currentLang, setCurrentLang] = useState<AppLanguage>(() => getCurrentLanguage());
  useEffect(() => {
    const handleLangChange = (e: any) => {
      if (e?.detail?.lang) setCurrentLang(e.detail.lang);
      else setCurrentLang(getCurrentLanguage());
    };
    window.addEventListener('medden_language_changed', handleLangChange);
    return () => window.removeEventListener('medden_language_changed', handleLangChange);
  }, []);

  // Sidebar Visibility Settings (defaults keep mnemonics and leisure toggled OFF until enabled in Settings)
  const [sidebarSettings, setSidebarSettings] = useState<SidebarSettings>(() => {
    try {
      const saved = localStorage.getItem('medden_sidebar_settings');
      if (saved) return { ...DEFAULT_SIDEBAR_SETTINGS, ...JSON.parse(saved) };
    } catch {}
    return DEFAULT_SIDEBAR_SETTINGS;
  });

  const [sidebarOrder, setSidebarOrder] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('medden_sidebar_order');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const merged = [...parsed];
          DEFAULT_SIDEBAR_ORDER.forEach((id) => {
            if (!merged.includes(id)) merged.push(id);
          });
          return merged;
        }
      }
    } catch {}
    return DEFAULT_SIDEBAR_ORDER;
  });

  useEffect(() => {
    const handleSettingsChange = () => {
      try {
        const saved = localStorage.getItem('medden_sidebar_settings');
        if (saved) setSidebarSettings({ ...DEFAULT_SIDEBAR_SETTINGS, ...JSON.parse(saved) });
        const savedOrder = localStorage.getItem('medden_sidebar_order');
        if (savedOrder) {
          const parsed = JSON.parse(savedOrder);
          if (Array.isArray(parsed)) {
            const merged = [...parsed];
            DEFAULT_SIDEBAR_ORDER.forEach((id) => {
              if (!merged.includes(id)) merged.push(id);
            });
            setSidebarOrder(merged);
          }
        }
      } catch {}
    };
    window.addEventListener('medden_sidebar_settings_changed', handleSettingsChange);
    return () => window.removeEventListener('medden_sidebar_settings_changed', handleSettingsChange);
  }, []);

  // Workspaces Nav (sidebar toggle controls managed exclusively inside Settings)
  const allNavItems = [
    {
      id: 'home' as const,
      settingKey: 'showMySpace' as keyof SidebarSettings,
      label: getTranslation('nav.mySpace', currentLang),
      icon: LayoutDashboard,
    },
    {
      id: 'read' as const,
      settingKey: 'showRead' as keyof SidebarSettings,
      label: getTranslation('nav.read', currentLang),
      icon: BookOpenText,
    },
    {
      id: 'make-note' as const,
      settingKey: 'showCreateNote' as keyof SidebarSettings,
      label: getTranslation('nav.createNote', currentLang),
      icon: PenLogoIcon,
    },
    {
      id: 'roster' as const,
      settingKey: 'showCalendar' as keyof SidebarSettings,
      label: getTranslation('nav.calendar', currentLang),
      icon: CalendarDays,
    },
    {
      id: 'library' as const,
      settingKey: 'showLibrary' as keyof SidebarSettings,
      label: getTranslation('nav.myShelf', currentLang),
      icon: BookshelfIcon,
    },
    {
      id: 'mnemonics' as const,
      settingKey: 'showMnemonics' as keyof SidebarSettings,
      label: getTranslation('nav.mnemonics', currentLang),
      icon: Brain,
    },
    {
      id: 'community' as const,
      settingKey: 'showCommunity' as keyof SidebarSettings,
      label: getTranslation('nav.community', currentLang),
      icon: Users,
    },
    {
      id: 'leisure' as const,
      settingKey: 'showLeisure' as keyof SidebarSettings,
      label: getTranslation('nav.leisure', currentLang),
      icon: Coffee,
    },
    {
      id: 'talk-to-dev' as const,
      settingKey: 'showTalkToDev' as keyof SidebarSettings,
      label: getTranslation('nav.talkToDev', currentLang),
      icon: MessageSquareCode,
    },
  ];

  // Reorder navigation items according to user customization in settings
  const sortedNavItems = [...allNavItems].sort((a, b) => {
    const idxA = sidebarOrder.indexOf(a.id);
    const idxB = sidebarOrder.indexOf(b.id);
    return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
  });

  const navItems = sortedNavItems.filter(
    (item) => sidebarSettings[item.settingKey] !== false
  );

  const handleItemClick = (id: AppViewType) => {
    onNavigate(id);
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      onClose();
    }
  };

  const renderSidebarTextureBackdrop = () => (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden z-0">
      {railWallpaper && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: railWallpaper,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: resolvedDesign === '1' && !isNightMode ? 'none' : 'blur(2px) saturate(1.08)',
            transform: resolvedDesign === '1' && !isNightMode ? 'scale(1.01)' : 'scale(1.05)',
            opacity: isNightMode ? 0.68 : 0.66,
          }}
        />
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-2xs z-40 md:hidden animate-in fade-in duration-200"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        aria-label="Workspace sidebar"
        className={`fixed md:relative top-0 left-0 bottom-0 z-50 md:z-40 shrink-0 h-[100dvh] flex flex-col justify-between select-none shadow-2xl md:shadow-none transition-all duration-200 ease-in-out overflow-hidden ${
          isOpen
            ? 'w-[200px] md:w-[148px] translate-x-0'
            : '-translate-x-full md:translate-x-0 w-0 md:w-8 overflow-hidden md:overflow-visible'
        }`}
        style={sidebarSurfaceStyle}
      >
        {renderSidebarTextureBackdrop()}

        {/* Expanded View */}
        {isOpen ? (
          <div className="relative z-10 flex flex-col justify-between h-full w-full animate-in fade-in duration-150 overflow-hidden">
            {/* Top Scrollable Section */}
            <div className="p-1.5 space-y-1.5 w-full overflow-y-auto flex-1 custom-scrollbar">
              {/* Section 1: Brand + Minimize Arrow */}
              <div className="px-0.5 pt-1 pb-1 space-y-1.5">
                <div className="overflow-visible">
                  <AchievBrand variant="compact" isDarkMode={isNightMode} />
                </div>

                {/* Compact Scholar Mini-Strip when avatar or username is customized */}
                {(userProfile.avatarUrl || userProfile.username) && (
                  <div
                    className="flex items-center gap-1.5 px-1.5 py-1 rounded-lg border"
                    style={{
                      background: sb.navSectionBg,
                      borderColor: sb.sectionBorder,
                    }}
                  >
                    {userProfile.avatarUrl ? (
                      <img
                        src={userProfile.avatarUrl}
                        alt={userProfile.name}
                        className="w-5 h-5 rounded-full object-cover shrink-0 border border-amber-500/40"
                      />
                    ) : (
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0"
                        style={{
                          background: sb.activeBtnBg,
                          color: sb.activeBtnText,
                        }}
                      >
                        {(userProfile.name || 'S').charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="text-[9.5px] font-semibold truncate leading-tight" style={{ color: sb.railText }}>
                        {userProfile.name}
                      </div>
                      {userProfile.username && (
                        <div className="text-[8.5px] font-mono truncate opacity-75" style={{ color: sb.mutedLabelColor }}>
                          @{userProfile.username}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <button
                  onClick={onClose}
                  title="Minimize sidebar to thin column"
                  aria-label="Minimize sidebar"
                  style={toggleBtnStyle}
                  className={`w-full group flex items-center justify-center py-1 transition-all shadow-xs hover:brightness-110 active:scale-[0.97] cursor-pointer ${leatherBtnCls}`}
                >
                  <ArrowLeft className="w-3.5 h-3.5 stroke-[2.2] transition-transform duration-200 group-hover:-translate-x-1" />
                </button>
              </div>

              {/* Section 2: Vertical Column Navigation Links */}
              <div
                className="rounded-xl p-1 space-y-0.5"
                style={{
                  background: sb.navSectionBg,
                  border: `1px solid ${sb.sectionBorder}`,
                }}
              >
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeView === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleItemClick(item.id)}
                      style={getBtnStyle(isActive)}
                      className={`w-full min-h-[36px] md:min-h-[30px] h-auto flex items-center px-2 md:px-1.5 py-1.5 text-[12px] md:text-[11px] font-medium transition-all hover:brightness-110 cursor-pointer text-left ${leatherBtnCls}`}
                    >
                      <div className="flex items-center gap-1.5 min-w-0 w-full">
                        <div className="w-4 h-4 flex items-center justify-center shrink-0">
                          <Icon
                            className="w-3.5 h-3.5 shrink-0"
                            style={{ color: isActive ? sb.activeIconColor : sb.idleIconColor }}
                          />
                        </div>
                        <span className="leading-tight break-words whitespace-normal flex-1 min-w-0">{item.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section 3: Daily Thought of the Day */}
            <div className="px-2.5 py-2 mx-0.5 mb-1 mt-auto select-none group">
              {(() => {
                const now = new Date();
                const dayOfYear = Math.floor(
                  (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) /
                    (1000 * 60 * 60 * 24)
                );
                const todayThought =
                  DAILY_THOUGHTS_31[dayOfYear % DAILY_THOUGHTS_31.length] || DAILY_THOUGHTS_31[0];

                return (
                  <div
                    className="flex flex-col cursor-default"
                    title={`"${todayThought.text}" — ${todayThought.author}`}
                  >
                    <p
                      className="sidebar-thought-quote font-sans not-italic font-medium"
                      style={{
                        fontFamily: "var(--app-font-family, 'Alata', system-ui, -apple-system, sans-serif)",
                        fontSize: '12.5px',
                        fontStyle: 'normal',
                        lineHeight: 1.45,
                        color: sb.thoughtColor,
                      }}
                    >
                      "{todayThought.text}"
                    </p>
                    <span
                      className="sidebar-thought-author font-sans tracking-wider uppercase block mt-1 font-bold"
                      style={{
                        fontFamily: "var(--app-font-family, 'Alata', system-ui, -apple-system, sans-serif)",
                        fontSize: '10px',
                        color: sb.authorColor,
                      }}
                    >
                      — {todayThought.author}
                    </span>
                  </div>
                );
              })()}
            </div>

            {/* Section 4: Bottom Settings & Trash Footer */}
            <div
              className="p-1.5 mx-1 mb-1 rounded-xl space-y-0.5"
              style={{
                background: sb.footerSectionBg,
                border: `1px solid ${sb.sectionBorder}`,
              }}
            >
              {onOpenSettings && (
                <button
                  onClick={() => {
                    onOpenSettings();
                    if (typeof window !== 'undefined' && window.innerWidth < 768) {
                      onClose();
                    }
                  }}
                  title="Settings & Design Preferences"
                  style={getBtnStyle(isSettingsOn)}
                  className={`w-full min-h-[30px] h-auto flex items-center px-1.5 py-1.5 text-[11px] font-medium transition-all hover:brightness-110 cursor-pointer text-left ${leatherBtnCls}`}
                >
                  <div className="flex items-center gap-1.5 min-w-0 w-full">
                    <div className="w-4 h-4 flex items-center justify-center shrink-0">
                      <Settings
                        className="w-3.5 h-3.5"
                        style={{ color: isSettingsOn ? sb.activeIconColor : sb.idleIconColor }}
                      />
                    </div>
                    <span className="leading-tight break-words whitespace-normal flex-1 min-w-0">Settings</span>
                  </div>
                </button>
              )}
              <button
                onClick={() => handleItemClick('recycle-bin')}
                title="Open Trash"
                style={
                  activeView === 'recycle-bin'
                    ? getBtnStyle(true)
                    : {
                        background: sb.idleBtnBg,
                        border: '1px solid transparent',
                        color: sb.trashTextColor,
                        borderRadius: resolvedDesign === '1' ? '9px' : themeMeta.buttonRadius,
                        fontWeight: 600,
                      }
                }
                className={`sidebar-trash-btn w-full min-h-[30px] h-auto flex items-center px-1.5 py-1.5 text-[11px] transition-all hover:brightness-110 cursor-pointer text-left ${leatherBtnCls}`}
              >
                <div className="flex items-center gap-1.5 min-w-0 w-full">
                  <div className="w-4 h-4 flex items-center justify-center shrink-0">
                    <Trash2
                      className="w-3.5 h-3.5"
                      style={{
                        color: activeView === 'recycle-bin' ? sb.activeIconColor : sb.trashIconColor,
                      }}
                    />
                  </div>
                  <span className="leading-tight break-words whitespace-normal flex-1 min-w-0 tracking-wide">Trash</span>
                </div>
              </button>
            </div>
          </div>
        ) : (
          /* Persistent Minimized Thin Slab on Left Border */
          <div className="relative z-10 flex flex-col items-center justify-between h-full py-2.5 px-0.5 w-full animate-in fade-in duration-150">
            <div className="flex flex-col items-center space-y-2.5 w-full">
              <div
                onClick={onToggle}
                role="button"
                tabIndex={0}
                title="Ach1ev · Settle Ideas - Click to expand sidebar"
                className="w-6 h-6 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform bg-transparent"
              >
                <AchievBrand
                  variant="emblem"
                  imgClassName="w-5 h-5"
                  title="Ach1ev · Settle Ideas - Click to expand sidebar"
                />
              </div>

              <button
                onClick={onToggle}
                title="Expand sidebar column"
                aria-label="Expand sidebar column"
                style={toggleBtnStyle}
                className={`w-6 h-6 group flex items-center justify-center transition-all shadow-xs hover:brightness-110 active:scale-[0.96] cursor-pointer ${leatherBtnCls}`}
              >
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.2] transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>

              <div className="w-4 h-[1px]" style={{ background: sb.sectionBorder }} />

              <div className="flex flex-col items-center space-y-1 w-full">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleItemClick(item.id)}
                      title={item.label}
                      style={getBtnStyle(isActive)}
                      className={`w-6 h-6 flex items-center justify-center transition-all hover:brightness-110 cursor-pointer ${leatherBtnCls}`}
                    >
                      <Icon
                        className="w-3.5 h-3.5"
                        style={{ color: isActive ? sb.activeIconColor : sb.idleIconColor }}
                      />
                    </button>
                  );
                })}
              </div>

              <div
                title={`Active Subject: ${currentSubject}`}
                style={toggleBtnStyle}
                className={`mt-1.5 w-6 h-6 flex items-center justify-center text-[8.5px] font-mono font-bold uppercase cursor-default ${leatherBtnCls}`}
              >
                {currentSubject.slice(0, 2)}
              </div>
            </div>

            <div
              className="w-full flex flex-col items-center space-y-1 pt-2"
              style={{ borderTop: `1px solid ${sb.sectionBorder}` }}
            >
              {onOpenSettings && (
                <button
                  onClick={() => {
                    onOpenSettings();
                    if (typeof window !== 'undefined' && window.innerWidth < 768) {
                      onClose();
                    }
                  }}
                  title="Settings & Design Preferences"
                  style={getBtnStyle(isSettingsOn)}
                  className={`w-6 h-6 flex items-center justify-center transition-all hover:brightness-110 cursor-pointer ${leatherBtnCls}`}
                >
                  <Settings
                    className="w-3.5 h-3.5"
                    style={{ color: isSettingsOn ? sb.activeIconColor : sb.idleIconColor }}
                  />
                </button>
              )}
              <button
                onClick={() => handleItemClick('recycle-bin')}
                title="Trash"
                style={
                  activeView === 'recycle-bin'
                    ? getBtnStyle(true)
                    : {
                        background: sb.idleBtnBg,
                        border: '1px solid transparent',
                        color: sb.trashTextColor,
                        borderRadius: resolvedDesign === '1' ? '9px' : themeMeta.buttonRadius,
                      }
                }
                className={`sidebar-trash-btn w-6 h-6 flex items-center justify-center transition-all hover:brightness-110 cursor-pointer ${leatherBtnCls}`}
              >
                <Trash2
                  className="w-3.5 h-3.5"
                  style={{
                    color: activeView === 'recycle-bin' ? sb.activeIconColor : sb.trashIconColor,
                  }}
                />
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
