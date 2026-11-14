import React, { useState } from 'react';
import {
  SubjectCourse,
  OptionSlab,
  StudyTask,
  Notebook,
  RosterEvent,
  UserProfile,
  DesignId,
  MedicalBook,
} from '../../types';
import { SlidersHorizontal, X, Check } from 'lucide-react';
import { AtelierMySpace } from './AtelierMySpace';

// Hand lens SVG icon for G K slab
const HandLensIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.35-4.35" />
    <path d="M11 8a3 3 0 0 0-3 3" strokeWidth="1.5" />
  </svg>
);

export const DESIGN_OPTIONS = [
  {
    id: '1' as DesignId,
    num: '1',
    name: 'Heritage Atelier',
    label: 'Heritage Atelier Study',
    tagline: 'Warm parchment & dark walnut espresso, Calacatta marble Leisure, pill buttons, daytime butterflies & nighttime fireflies',
    badge: 'Theme 1',
  },
  {
    id: '2' as DesignId,
    num: '2',
    name: 'Forest Sanctuary',
    label: 'Forest Sanctuary',
    tagline: 'Sage woodland palette, blurred canopy wallpaper, leaf-shaped buttons & woodland Shelf',
    badge: 'Theme 2',
  },
  {
    id: '3' as DesignId,
    num: '3',
    name: 'Coastal Beach',
    label: 'Coastal Beach Balcony',
    tagline: 'Sea-glass & seashell sand tones, coastal pebble buttons & ocean balcony with leaping dolphins',
    badge: 'Theme 3',
  },
  {
    id: '4' as DesignId,
    num: '4',
    name: 'Cozy Rainy Monsoon',
    label: 'Cozy Rainy Monsoon',
    tagline: 'Rain-washed slate & chai amber cockpit, teardrop frosted glass buttons & open veranda rain balcony',
    badge: 'Theme 4',
  },
  {
    id: '5' as DesignId,
    num: '5',
    name: 'Pistachio & Obsidian',
    label: 'Pistachio & Obsidian',
    tagline: 'Light Creamish Pista in Light Mode, pure Obsidian Black in Dark Mode with Creamish Pista buttons & dark text',
    badge: 'Theme 5',
  },
];

interface MyDenHomeProps {
  userProfile: UserProfile;
  currentSubject: SubjectCourse;
  onSelectSubject: (subject: SubjectCourse) => void;
  optionSlabs: OptionSlab[];
  onUpdateOptionSlabs: (slabs: OptionSlab[]) => void;
  tasks: StudyTask[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (task: StudyTask) => void;
  notebooks: Notebook[];
  books?: MedicalBook[];
  onOpenNotebook: (id: string) => void;
  onOpenStudio: (actionType?: string) => void;
  onOpenRosterModal: () => void;
  onOpenSettings?: () => void;
  onNavigate?: (view: any) => void;
  rosterEvents: RosterEvent[];
  breakTimerCountdown: string;
  onTriggerEyeBreak: () => void;
  activeDesign?: DesignId;
  onSelectDesign?: (design: DesignId) => void;
  onRevertChanges?: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const MyDenHome: React.FC<MyDenHomeProps> = ({
  userProfile,
  currentSubject,
  onSelectSubject,
  optionSlabs,
  onUpdateOptionSlabs,
  tasks,
  onToggleTask,
  onAddTask,
  notebooks,
  books = [],
  onOpenRosterModal,
  onOpenSettings,
  onNavigate,
  rosterEvents,
  activeDesign = '1',
  isDarkMode,
  onToggleDarkMode,
}) => {
  const [isCustomizingSlabs, setIsCustomizingSlabs] = useState<boolean>(false);
  const [isGkModalOpen, setIsGkModalOpen] = useState(false);

  const [newSlabTitle, setNewSlabTitle] = useState('');
  const [newSlabSubtitle, setNewSlabSubtitle] = useState('');
  const [newSlabBadge, setNewSlabBadge] = useState('');

  const handleToggleSlabVisibility = (slabId: string) => {
    const updated = optionSlabs.map((s) => (s.id === slabId ? { ...s, enabled: !s.enabled } : s));
    onUpdateOptionSlabs(updated);
  };

  const handleCreateCustomSlab = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlabTitle.trim()) return;

    const newSlab: OptionSlab = {
      id: `custom-slab-${Date.now()}`,
      title: newSlabTitle.trim(),
      subtitle: newSlabSubtitle.trim() || 'Clinical study module',
      subject: currentSubject,
      iconName: 'Sparkles',
      badge: newSlabBadge.trim() || 'Custom',
      accentColor: 'slate',
      enabled: true,
      linkAction: 'open-custom',
      metaText: 'Customized',
    };

    onUpdateOptionSlabs([...optionSlabs, newSlab]);
    setNewSlabTitle('');
    setNewSlabSubtitle('');
    setNewSlabBadge('');
  };

  const resolvedDesign: DesignId =
    (['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].includes(activeDesign)
      ? activeDesign
      : '1') as DesignId;

  // ALL 10 Themes share the EXACT same Theme 1 Atelier Cockpit layout & functioning,
  // adapting solely through theme palette tokens, button shapes, and blurred wallpaper.
  return (
    <>
      <AtelierMySpace
        userProfile={userProfile}
        currentSubject={currentSubject}
        onSelectSubject={onSelectSubject}
        tasks={tasks}
        onToggleTask={onToggleTask}
        onAddTask={onAddTask}
        onOpenRosterModal={onOpenRosterModal}
        onOpenSettings={onOpenSettings}
        onNavigate={onNavigate}
        rosterEvents={rosterEvents}
        books={books}
        notebooks={notebooks}
        isDarkMode={isDarkMode}
        onToggleDarkMode={onToggleDarkMode}
        activeDesign={resolvedDesign}
      />

      {isGkModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--th-surface)] text-[var(--th-ink)] rounded-2xl border border-[var(--th-border)] max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsGkModalOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-md opacity-70 hover:opacity-100"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center border border-[var(--th-border)]" style={{ backgroundColor: 'var(--th-accent-soft)', color: 'var(--th-accent)' }}>
                <HandLensIcon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold font-mono">G K · Clinical Pearls & Trivia</h3>
                <span className="text-[10px] opacity-70 font-mono">High-yield USMLE & Clinical Board Trivia</span>
              </div>
            </div>
            <div className="flex justify-end pt-2 border-t border-[var(--th-border)]">
              <button
                onClick={() => setIsGkModalOpen(false)}
                className="px-3.5 py-1.5 rounded-lg text-white text-xs font-medium"
                style={{ backgroundColor: 'var(--th-accent)' }}
              >
                Close Pearls
              </button>
            </div>
          </div>
        </div>
      )}

      {isCustomizingSlabs && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--th-surface)] text-[var(--th-ink)] rounded-2xl border border-[var(--th-border)] max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsCustomizingSlabs(false)}
              className="absolute top-4 right-4 p-1 rounded-md opacity-70 hover:opacity-100"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-sm font-bold mb-1 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" style={{ color: 'var(--th-accent)' }} />
              <span>Customize Starting Page Modules</span>
            </h3>
            <p className="text-xs opacity-70 mb-4">
              Toggle visible slabs or add custom coursework modules for {currentSubject}.
            </p>
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1 mb-5">
              {optionSlabs
                .filter((s) => s.subject === currentSubject)
                .map((slab) => (
                  <div
                    key={slab.id}
                    onClick={() => handleToggleSlabVisibility(slab.id)}
                    className="p-2.5 rounded-lg border border-[var(--th-border)] flex items-center justify-between text-xs cursor-pointer transition-colors"
                  >
                    <div>
                      <h4 className="font-semibold">{slab.title}</h4>
                      <p className="text-[11px] opacity-70">{slab.subtitle}</p>
                    </div>
                    <div
                      className="w-4 h-4 rounded flex items-center justify-center text-white"
                      style={{ backgroundColor: slab.enabled ? 'var(--th-accent)' : 'var(--th-border)' }}
                    >
                      {slab.enabled && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </div>
                ))}
            </div>
            <form onSubmit={handleCreateCustomSlab} className="pt-3 border-t border-[var(--th-border)] space-y-2.5">
              <h4 className="text-xs font-semibold">+ Add Custom Module:</h4>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Module Title"
                  value={newSlabTitle}
                  onChange={(e) => setNewSlabTitle(e.target.value)}
                  className="bg-[var(--th-raised)] px-2.5 py-1.5 rounded-lg border border-[var(--th-border)] text-xs outline-none"
                />
                <input
                  type="text"
                  placeholder="Subtitle Description"
                  value={newSlabSubtitle}
                  onChange={(e) => setNewSlabSubtitle(e.target.value)}
                  className="bg-[var(--th-raised)] px-2.5 py-1.5 rounded-lg border border-[var(--th-border)] text-xs outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCustomizingSlabs(false)}
                  className="px-3 py-1.5 rounded-lg text-xs opacity-75"
                >
                  Done
                </button>
                <button
                  type="submit"
                  disabled={!newSlabTitle.trim()}
                  className="px-3.5 py-1.5 rounded-lg text-white text-xs font-medium disabled:opacity-40"
                  style={{ backgroundColor: 'var(--th-accent)' }}
                >
                  Add Module
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
