/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  SubjectCourse,
  OptionSlab,
  MedicalBook,
  Notebook,
  StudyTask,
  RosterEvent,
  UserProfile,
  BreakTimerConfig,
  SnippetScreenshot,
  DesignId,
  NotePage,
} from './types';
import {
  INITIAL_USER_PROFILE,
  INITIAL_OPTION_SLABS,
  INITIAL_BOOKS,
  INITIAL_NOTEBOOKS,
  INITIAL_TASKS,
  DEFAULT_ROSTER_EVENTS,
} from './data/mockData';
import { Sidebar } from './components/common/Sidebar';
import { WindowsHeader } from './components/common/WindowsHeader';
import { MyDenHome } from './components/home/MyDenHome';
import { NotebookShelfView } from './components/notebook/NotebookShelfView';
import { ExploreBodyView } from './components/explore/ExploreBodyView';
import { RosterCalendarModal } from './components/roster/RosterCalendarModal';
import { EyeBreakModal } from './components/common/EyeBreakModal';
import { SettingsModal, SettingsTabId } from './components/settings/SettingsModal';
import { RichNoteEditor } from './components/notebook/RichNoteEditor';
import { RecycleBinView, DeletedItem } from './components/recycle/RecycleBinView';
import { LibraryView } from './components/library/LibraryView';
import { CommunityView } from './components/community/CommunityView';
import { MnemonicDashboard } from './components/mnemonics/MnemonicDashboard';
import { LeisureDashboard } from './components/leisure/LeisureDashboard';
import { AskGeminiModal } from './components/common/AskGeminiModal';
import { ReadStudioView } from './components/reader/ReadStudioView';
import { TalkToDeveloperModal } from './components/developer/TalkToDeveloperModal';
import { SubscriptionModal } from './components/subscription/SubscriptionModal';
import { ShareToAIStudioModal } from './components/common/ShareToAIStudioModal';
import { AuthPortal } from './components/auth/AuthPortal';
import { AchievBrand } from './components/common/AchievBrand';
import { getThemeMeta } from './data/themeMeta';
import { useAuth } from './contexts/AuthContext';
import {
  deleteNotebookPermanentlyInCloud,
  emptyTrashedNotebooksInCloud,
  fetchWorkspaceSnapshot,
  markNotebookTrashedInCloud,
  pushBooksToCloud,
  pushNotebooksToCloud,
  pushProfileToCloud,
  pushRosterToCloud,
  pushSlabsToCloud,
  pushTasksToCloud,
  subscribeToRealtimeWorkspace,
} from './services/supabaseSyncService';
import {
  Sparkles,
  LayoutDashboard,
  BookOpenText,
  Settings,
  Library,
  PenTool,
} from 'lucide-react';

export default function App() {
  const {
    user,
    googleUser,
    isLoading: authLoading,
    isGuestMode,
    isAuthModalOpen,
    closeAuthModal,
    signOut,
    setSyncStatus,
    setLastSyncedAt,
    driveAccount,
  } = useAuth();

  // Navigation & Subject State
  const [activeView, setActiveView] = useState<
    'home' | 'read' | 'notebooks' | 'explore-body' | 'library' | 'roster' | 'recycle-bin' | 'mnemonics' | 'leisure' | 'community' | 'make-note' | 'talk-to-dev' | 'settings'
  >('home');
  const [settingsInitialTab, setSettingsInitialTab] = useState<SettingsTabId>('designs');
  const [currentSubject, setCurrentSubject] = useState<SubjectCourse>('Pharmacology');
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState<boolean>(false);

  // In-Notebook Active Note Editor View (when student opens a notebook directly)
  const [isEditingNote, setIsEditingNote] = useState<boolean>(false);

  // Left vertical column sidebar open/hide state
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  // Data Collections
  const [optionSlabs, setOptionSlabs] = useState<OptionSlab[]>(() => {
    const saved = localStorage.getItem('medden_option_slabs');
    if (saved) {
      try {
        const parsed: OptionSlab[] = JSON.parse(saved);
        const existingIds = new Set(parsed.map((s) => s.id));
        const missing = INITIAL_OPTION_SLABS.filter((s) => !existingIds.has(s.id));
        if (missing.length > 0) {
          const merged = [...missing, ...parsed];
          localStorage.setItem('medden_option_slabs', JSON.stringify(merged));
          return merged;
        }
        return parsed;
      } catch {
        return INITIAL_OPTION_SLABS;
      }
    }
    return INITIAL_OPTION_SLABS;
  });

  const [notebooks, setNotebooks] = useState<Notebook[]>(() => {
    try {
      const saved = localStorage.getItem('medden_notebooks');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const seedNotebookIds = new Set(['nb-pharma-1', 'nb-pharma-2', 'nb-pharma-3', 'nb-pharma-4']);
          const cleaned = parsed
            .filter((nb: any) => !seedNotebookIds.has(nb?.id))
            .map((nb: any, i: number) => ({
              ...nb,
              id: nb.id || `nb-${Date.now()}-${i}`,
              title: nb.title || 'Notes',
              pages: Array.isArray(nb.pages) && nb.pages.length > 0 ? nb.pages : [
                {
                  id: `p-${Date.now()}`,
                  title: nb.title || 'Study Note',
                  contentHtml: '<p><br></p>',
                  date: new Date().toISOString().split('T')[0],
                  updatedAt: new Date().toISOString(),
                  screenshots: [],
                  inkStrokes: [],
                }
              ],
              paperType: nb.paperType || 'ruled-thin',
              paperColor: nb.paperColor || 'beige',
              activePageIndex: typeof nb.activePageIndex === 'number' ? nb.activePageIndex : 0,
            }));
          if (cleaned.length !== parsed.length) {
            localStorage.setItem('medden_notebooks', JSON.stringify(cleaned));
          }
          return cleaned;
        }
      }
    } catch {}
    return [];
  });
  const [activeNotebookId, setActiveNotebookId] = useState<string>(notebooks[0]?.id || '');

  const [books, setBooks] = useState<MedicalBook[]>(() => {
    try {
      const saved = localStorage.getItem('medden_books');
      if (saved) {
        const parsed: MedicalBook[] = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const sampleIds = new Set(['book-osteoporosis', 'book-cal-practical', 'book-goodman-gilman']);
          const cleaned = parsed.filter(
            (b) => !sampleIds.has(b.id) || b.isUserUploaded || Boolean(b.driveFileId) || b.storageProvider === 'google_drive'
          );
          if (cleaned.length !== parsed.length) {
            localStorage.setItem('medden_books', JSON.stringify(cleaned));
          }
          return cleaned;
        }
      }
    } catch {}
    return INITIAL_BOOKS;
  });

  const [tasks, setTasks] = useState<StudyTask[]>(() => {
    try {
      const saved = localStorage.getItem('medden_tasks');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const seedTaskIds = new Set(['task-1', 'task-2', 'task-3', 'task-4']);
          const cleaned = parsed.filter((t: any) => !seedTaskIds.has(t?.id));
          if (cleaned.length !== parsed.length) {
            localStorage.setItem('medden_tasks', JSON.stringify(cleaned));
          }
          return cleaned;
        }
      }
    } catch {}
    return [];
  });

  const [rosterEvents, setRosterEvents] = useState<RosterEvent[]>(() => {
    try {
      const saved = localStorage.getItem('medden_roster');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const seedRosterIds = new Set(['roster-1', 'roster-2', 'roster-3', 'roster-4', 'roster-5']);
          const cleaned = parsed.filter((r: any) => !seedRosterIds.has(r?.id));
          if (cleaned.length !== parsed.length) {
            localStorage.setItem('medden_roster', JSON.stringify(cleaned));
          }
          return cleaned;
        }
      }
    } catch {}
    return [];
  });

  // Recycle Bin State
  const [recycleBinItems, setRecycleBinItems] = useState<DeletedItem[]>(() => {
    try {
      const saved = localStorage.getItem('medden_recycle_bin');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const seedDelIds = new Set(['del-1', 'del-2', 'del-3']);
          const cleaned = parsed.filter((d: any) => !seedDelIds.has(d?.id));
          if (cleaned.length !== parsed.length) {
            localStorage.setItem('medden_recycle_bin', JSON.stringify(cleaned));
          }
          return cleaned;
        }
      }
    } catch {}
    return [];
  });

  // Modal States
  const [isRosterModalOpen, setIsRosterModalOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isEyeBreakModalOpen, setIsEyeBreakModalOpen] = useState<boolean>(false);
  const [isGlobalGeminiOpen, setIsGlobalGeminiOpen] = useState<boolean>(false);
  const [isAIStudioModalOpen, setIsAIStudioModalOpen] = useState<boolean>(false);

  // Default opening theme: Light Mode (one-time migration ensures previous dark default resets to light)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const migrated = localStorage.getItem('ach1ev_light_default_v1');
      if (!migrated) {
        localStorage.setItem('ach1ev_light_default_v1', '1');
        localStorage.setItem('medden_theme', 'light');
        return false;
      }
      const saved = localStorage.getItem('medden_theme');
      return saved === 'dark';
    } catch {
      return false;
    }
  });

  // Screen Break Timer Configuration
  const [breakConfig, setBreakConfig] = useState<BreakTimerConfig>(() => {
    try {
      const saved = localStorage.getItem('medden_break_config');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      intervalMinutes: 20,
      breakDurationSeconds: 20,
      soundEnabled: true,
      autoStartNext: true,
    };
  });
  const [secondsUntilBreak, setSecondsUntilBreak] = useState<number>(breakConfig.intervalMinutes * 60);

  // 10 Layout Designs (Safely verified fallback to '1')
  const [activeDesign, setActiveDesign] = useState<DesignId>(() => {
    try {
      const saved = localStorage.getItem('medden_active_design');
      if (saved && ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].includes(saved)) {
        return saved as DesignId;
      }
    } catch {}
    return '1';
  });

  // Revert Feedback Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSelectDesign = (design: DesignId) => {
    setActiveDesign(design);
    localStorage.setItem('medden_active_design', design);
  };

  const handleRevertChanges = () => {
    // 1. Revert back to Design 1 (Original Classic)
    setActiveDesign('1');
    localStorage.setItem('medden_active_design', '1');

    // 2. Revert module slabs back to initial defaults
    setOptionSlabs(INITIAL_OPTION_SLABS);
    localStorage.setItem('medden_option_slabs', JSON.stringify(INITIAL_OPTION_SLABS));

    // 3. Return to home if nested
    setActiveView('home');
    setIsEditingNote(false);

    // 4. Show success toast notification
    setToastMessage('Changes successfully reverted to Design 1 (Default)');
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const isEdition1 = true;

  // Sync Dark Theme class & attributes on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      localStorage.setItem('medden_theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
      localStorage.setItem('medden_theme', 'light');
      localStorage.setItem('theme', 'light');
    }
    root.setAttribute('data-design', activeDesign);
    root.setAttribute('data-edition', '1');
    if (isDarkMode && activeDesign === '1') {
      root.classList.add('theme-1-dark');
    } else {
      root.classList.remove('theme-1-dark');
    }
  }, [isDarkMode, activeDesign]);

  // Allow nested workspaces (e.g. AtelierCreateNote) to toggle global dark mode cleanly
  useEffect(() => {
    const handleGlobalDarkToggle = () => setIsDarkMode((prev) => !prev);
    window.addEventListener('medden_toggle_dark', handleGlobalDarkToggle);
    return () => window.removeEventListener('medden_toggle_dark', handleGlobalDarkToggle);
  }, []);

  // Persist Data State
  useEffect(() => {
    localStorage.setItem('medden_option_slabs', JSON.stringify(optionSlabs));
  }, [optionSlabs]);

  useEffect(() => {
    localStorage.setItem('medden_notebooks', JSON.stringify(notebooks));
  }, [notebooks]);

  useEffect(() => {
    localStorage.setItem('medden_books', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('medden_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('medden_roster', JSON.stringify(rosterEvents));
  }, [rosterEvents]);

  useEffect(() => {
    localStorage.setItem('medden_break_config', JSON.stringify(breakConfig));
  }, [breakConfig]);

  // ============================================================================
  // SUPABASE REAL-TIME MULTI-DEVICE CLOUD SYNCHRONIZATION
  // ============================================================================
  const hasHydratedCloudRef = useRef<string | null>(null);
  const isApplyingRemoteRef = useRef<boolean>(false);

  const hydrateWorkspaceFromCloud = useCallback(
    async (userId: string, seedIfEmpty: boolean) => {
      try {
        setSyncStatus('connecting');
        const snap = await fetchWorkspaceSnapshot(userId);
        if (!snap) {
          setSyncStatus('local-only');
          return;
        }

        isApplyingRemoteRef.current = true;

        if (snap.profile) {
          setUserProfile(snap.profile);
          if (snap.profile.activeSubject) {
            setCurrentSubject(snap.profile.activeSubject);
          }
        } else if (seedIfEmpty) {
          await pushProfileToCloud(
            userId,
            { ...userProfile, email: user?.email || userProfile.email },
            {
              connected: driveAccount.connected,
              email: driveAccount.email,
              folderId: driveAccount.folderId,
            }
          );
        }

        if (snap.notebooks.length > 0) {
          setNotebooks(snap.notebooks);
          setActiveNotebookId((prevId) =>
            snap.notebooks.some((n) => n.id === prevId) ? prevId : snap.notebooks[0].id
          );
        } else if (seedIfEmpty && notebooks.length > 0) {
          await pushNotebooksToCloud(userId, notebooks);
        }

        if (snap.trashedNotebooks.length > 0) {
          setRecycleBinItems(
            snap.trashedNotebooks.map((tr) => ({
              id: `del-${tr.id}`,
              originalNotebookId: tr.id,
              title: tr.title,
              type: 'notebook',
              subject: tr.subject,
              deletedAt: tr.deletedAt,
            }))
          );
        }

        if (snap.books.length > 0) {
          setBooks(snap.books);
        } else if (seedIfEmpty && books.length > 0) {
          await pushBooksToCloud(userId, books);
        }

        if (snap.tasks.length > 0) {
          setTasks(snap.tasks);
        } else if (seedIfEmpty && tasks.length > 0) {
          await pushTasksToCloud(userId, tasks);
        }

        if (snap.rosterEvents.length > 0) {
          setRosterEvents(snap.rosterEvents);
        } else if (seedIfEmpty && rosterEvents.length > 0) {
          await pushRosterToCloud(userId, rosterEvents);
        }

        if (snap.optionSlabs.length > 0) {
          setOptionSlabs(snap.optionSlabs);
        } else if (seedIfEmpty && optionSlabs.length > 0) {
          await pushSlabsToCloud(userId, optionSlabs);
        }

        hasHydratedCloudRef.current = userId;
        setSyncStatus('synced');
        setLastSyncedAt(new Date().toISOString());
      } catch (err) {
        console.error('Supabase workspace sync failed:', err);
        setSyncStatus('error');
      } finally {
        setTimeout(() => {
          isApplyingRemoteRef.current = false;
        }, 300);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user?.email]
  );

  // Initial pull & Realtime subscription per authenticated user
  useEffect(() => {
    const uid = user?.id;
    if (!uid) {
      hasHydratedCloudRef.current = null;
      return;
    }

    hydrateWorkspaceFromCloud(uid, true);

    let refreshTimer: number | null = null;
    const unsubscribe = subscribeToRealtimeWorkspace(uid, () => {
      if (refreshTimer) window.clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(() => {
        hydrateWorkspaceFromCloud(uid, false);
      }, 450);
    });

    return () => {
      if (refreshTimer) window.clearTimeout(refreshTimer);
      unsubscribe();
    };
  }, [user?.id, hydrateWorkspaceFromCloud]);

  // Debounced auto-push effects when local state edits occur
  useEffect(() => {
    const uid = user?.id;
    if (!uid || hasHydratedCloudRef.current !== uid || isApplyingRemoteRef.current) return;
    const t = window.setTimeout(async () => {
      try {
        setSyncStatus('syncing');
        await pushNotebooksToCloud(uid, notebooks);
        setSyncStatus('synced');
        setLastSyncedAt(new Date().toISOString());
      } catch {
        setSyncStatus('error');
      }
    }, 900);
    return () => window.clearTimeout(t);
  }, [notebooks, user?.id, setSyncStatus, setLastSyncedAt]);

  useEffect(() => {
    const uid = user?.id;
    if (!uid || hasHydratedCloudRef.current !== uid || isApplyingRemoteRef.current) return;
    const t = window.setTimeout(async () => {
      try {
        setSyncStatus('syncing');
        await pushBooksToCloud(uid, books);
        setSyncStatus('synced');
        setLastSyncedAt(new Date().toISOString());
      } catch {
        setSyncStatus('error');
      }
    }, 800);
    return () => window.clearTimeout(t);
  }, [books, user?.id, setSyncStatus, setLastSyncedAt]);

  useEffect(() => {
    const uid = user?.id;
    if (!uid || hasHydratedCloudRef.current !== uid || isApplyingRemoteRef.current) return;
    const t = window.setTimeout(async () => {
      try {
        setSyncStatus('syncing');
        await pushTasksToCloud(uid, tasks);
        setSyncStatus('synced');
        setLastSyncedAt(new Date().toISOString());
      } catch {
        setSyncStatus('error');
      }
    }, 800);
    return () => window.clearTimeout(t);
  }, [tasks, user?.id, setSyncStatus, setLastSyncedAt]);

  useEffect(() => {
    const uid = user?.id;
    if (!uid || hasHydratedCloudRef.current !== uid || isApplyingRemoteRef.current) return;
    const t = window.setTimeout(async () => {
      try {
        setSyncStatus('syncing');
        await pushRosterToCloud(uid, rosterEvents);
        setSyncStatus('synced');
        setLastSyncedAt(new Date().toISOString());
      } catch {
        setSyncStatus('error');
      }
    }, 800);
    return () => window.clearTimeout(t);
  }, [rosterEvents, user?.id, setSyncStatus, setLastSyncedAt]);

  useEffect(() => {
    const uid = user?.id;
    if (!uid || hasHydratedCloudRef.current !== uid || isApplyingRemoteRef.current) return;
    const t = window.setTimeout(async () => {
      try {
        setSyncStatus('syncing');
        await pushSlabsToCloud(uid, optionSlabs);
        setSyncStatus('synced');
        setLastSyncedAt(new Date().toISOString());
      } catch {
        setSyncStatus('error');
      }
    }, 900);
    return () => window.clearTimeout(t);
  }, [optionSlabs, user?.id, setSyncStatus, setLastSyncedAt]);

  useEffect(() => {
    const uid = user?.id;
    if (!uid || hasHydratedCloudRef.current !== uid || isApplyingRemoteRef.current) return;
    const t = window.setTimeout(async () => {
      try {
        await pushProfileToCloud(
          uid,
          { ...userProfile, activeSubject: currentSubject, email: user?.email || userProfile.email },
          {
            connected: driveAccount.connected,
            email: driveAccount.email,
            folderId: driveAccount.folderId,
          }
        );
      } catch {
        setSyncStatus('error');
      }
    }, 900);
    return () => window.clearTimeout(t);
  }, [
    userProfile,
    currentSubject,
    driveAccount.connected,
    driveAccount.email,
    driveAccount.folderId,
    user?.id,
    user?.email,
    setSyncStatus,
  ]);

  const handleSyncAllNow = async () => {
    if (!user?.id) return;
    setSyncStatus('syncing');
    try {
      await Promise.all([
        pushProfileToCloud(
          user.id,
          { ...userProfile, activeSubject: currentSubject, email: user.email || userProfile.email },
          {
            connected: driveAccount.connected,
            email: driveAccount.email,
            folderId: driveAccount.folderId,
          }
        ),
        pushNotebooksToCloud(user.id, notebooks),
        pushBooksToCloud(user.id, books),
        pushTasksToCloud(user.id, tasks),
        pushRosterToCloud(user.id, rosterEvents),
        pushSlabsToCloud(user.id, optionSlabs),
      ]);
      setSyncStatus('synced');
      setLastSyncedAt(new Date().toISOString());
      setToastMessage('Workspace synced with Supabase Cloud');
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err) {
      setSyncStatus('error');
      throw err;
    }
  };

  const handleAddBook = (newBook: MedicalBook) => {
    setBooks((prev) => {
      const updated = [newBook, ...prev.filter((b) => b.id !== newBook.id)];
      localStorage.setItem('medden_books', JSON.stringify(updated));
      return updated;
    });
  };

  const handleUpdateBook = (updatedBook: MedicalBook) => {
    setBooks((prev) => {
      const exists = prev.some((b) => b.id === updatedBook.id);
      const updated = exists
        ? prev.map((b) => (b.id === updatedBook.id ? updatedBook : b))
        : [updatedBook, ...prev];
      localStorage.setItem('medden_books', JSON.stringify(updated));
      return updated;
    });
  };

  // Screen Break Countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsUntilBreak((prev) => {
        if (prev <= 1) {
          setIsEyeBreakModalOpen(true);
          return breakConfig.intervalMinutes * 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [breakConfig.intervalMinutes]);

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSnoozeBreak = (minutes: number) => {
    setSecondsUntilBreak(minutes * 60);
    setIsEyeBreakModalOpen(false);
  };

  // Active Notebook (undefined when user hasn't created any notebooks yet)
  const activeNotebook: Notebook | undefined =
    notebooks.find((nb) => nb.id === activeNotebookId) || notebooks[0];

  const handleUpdateNotebook = (updatedNb: Notebook) => {
    setNotebooks((prev) => {
      const exists = prev.some((nb) => nb.id === updatedNb.id);
      return exists ? prev.map((nb) => (nb.id === updatedNb.id ? updatedNb : nb)) : [updatedNb, ...prev];
    });
    setActiveNotebookId((curr) => curr || updatedNb.id);
  };

  const handleCreateNotebook = (newNb: Notebook) => {
    setNotebooks([newNb, ...notebooks]);
    setActiveNotebookId(newNb.id);
    setIsEditingNote(true);
  };

  const handleDeleteNotebook = (id: string) => {
    const nbToDelete = notebooks.find((nb) => nb.id === id);
    if (nbToDelete) {
      const delItem: DeletedItem = {
        id: `del-${Date.now()}`,
        originalNotebookId: id,
        title: nbToDelete.title,
        type: 'notebook',
        subject: nbToDelete.subject,
        deletedAt: new Date().toISOString().split('T')[0],
      };
      setRecycleBinItems((prev) => {
        const updated = [delItem, ...prev];
        localStorage.setItem('medden_recycle_bin', JSON.stringify(updated));
        return updated;
      });
    }

    if (user?.id) {
      markNotebookTrashedInCloud(user.id, id, true).catch(() => {});
    }

    const filtered = notebooks.filter((nb) => nb.id !== id);
    setNotebooks(filtered);
    if (activeNotebookId === id) {
      setActiveNotebookId(filtered[0]?.id || '');
    }
  };

  const handleRestoreRecycleItem = (item: DeletedItem) => {
    setRecycleBinItems((prev) => {
      const updated = prev.filter((i) => i.id !== item.id);
      localStorage.setItem('medden_recycle_bin', JSON.stringify(updated));
      return updated;
    });

    if (item.type === 'notebook') {
      const restoredId = item.originalNotebookId || `restored-${item.id}`;
      const restoredNb: Notebook = {
        id: restoredId,
        title: item.title,
        subject: (item.subject as SubjectCourse) || currentSubject,
        coverTheme: 'astronomy',
        coverTitle: item.title,
        coverSubtitle: 'Restored from Recycle Bin',
        coverColor: '#1e3a8a',
        paperType: 'ruled-thin',
        paperColor: 'beige',
        activePageIndex: 0,
        createdAt: item.deletedAt,
        updatedAt: new Date().toISOString().split('T')[0],
        pages: [
          {
            id: `p-${Date.now()}`,
            title: item.title,
            contentHtml: `<h2>${item.title}</h2><p>Restored from Recycle Bin on ${new Date().toLocaleDateString()}.</p>`,
            inkStrokes: [],
            screenshots: [],
            date: new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString().split('T')[0],
          },
        ],
      };
      setNotebooks((prev) => [restoredNb, ...prev]);
      if (user?.id && item.originalNotebookId) {
        markNotebookTrashedInCloud(user.id, item.originalNotebookId, false).catch(() => {});
      }
    }
  };

  const handlePermanentDeleteRecycleItem = (id: string) => {
    const target = recycleBinItems.find((i) => i.id === id);
    if (user?.id && target?.originalNotebookId) {
      deleteNotebookPermanentlyInCloud(user.id, target.originalNotebookId).catch(() => {});
    }
    setRecycleBinItems((prev) => {
      const updated = prev.filter((i) => i.id !== id);
      localStorage.setItem('medden_recycle_bin', JSON.stringify(updated));
      return updated;
    });
  };

  const handleEmptyRecycleBin = () => {
    if (user?.id) {
      emptyTrashedNotebooksInCloud(user.id).catch(() => {});
    }
    setRecycleBinItems([]);
    localStorage.removeItem('medden_recycle_bin');
  };

  // Snip snippet into current active notebook (or create a fresh one if empty)
  const handleSnipToActiveNote = (snippet: SnippetScreenshot) => {
    const snippetHtml = `
      <div style="margin: 12px 0; border: 1px solid #1e222d; border-radius: 6px; overflow: hidden; background: #0f1118;">
        <div style="background: #171b26; padding: 4px 8px; font-size: 11px; font-weight: bold; color: #94a3b8;">
          📸 ${snippet.sourceBookTitle || 'Snipped Excerpt'}
        </div>
        ${snippet.dataUrl ? `<img src="${snippet.dataUrl}" style="width: 100%; max-height: 280px; object-fit: contain; display: block;" alt="Snippet" />` : `<div style="padding: 8px 10px; font-size: 12px; color: #e2e8f0;">${snippet.caption || ''}</div>`}
      </div>
      <p><br/></p>
    `;

    if (!activeNotebook) {
      const today = new Date().toISOString().split('T')[0];
      const nowIso = new Date().toISOString();
      const newNb: Notebook = {
        id: `nb-${Date.now()}`,
        title: 'Snipped Notes',
        subject: currentSubject,
        coverTheme: 'botany',
        coverTitle: 'SNIPPED NOTES',
        coverSubtitle: 'Personal Study Notes',
        coverColor: '#A47C43',
        paperType: 'ruled-thin',
        paperColor: 'beige',
        activePageIndex: 0,
        createdAt: today,
        updatedAt: nowIso,
        pages: [
          {
            id: `p-${Date.now()}`,
            title: 'Page 1',
            contentHtml: snippetHtml,
            date: today,
            updatedAt: nowIso,
            screenshots: [snippet],
            inkStrokes: [],
          },
        ],
      };
      setNotebooks((prev) => [newNb, ...prev]);
      setActiveNotebookId(newNb.id);
      return;
    }

    const pages: NotePage[] = (activeNotebook.pages && activeNotebook.pages.length > 0)
      ? activeNotebook.pages
      : [{
          id: 'p-default',
          title: 'Page 1',
          contentHtml: '',
          date: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString(),
          screenshots: [],
          inkStrokes: [],
        }];
    const currentPageIndex = Math.min(activeNotebook.activePageIndex || 0, pages.length - 1);
    const currentPage = pages[currentPageIndex] || pages[0];
    const updatedScreenshots = [...(currentPage.screenshots || []), snippet];

    const updatedPages = [...pages];
    updatedPages[currentPageIndex] = {
      ...currentPage,
      screenshots: updatedScreenshots,
      contentHtml: (currentPage.contentHtml || '') + snippetHtml,
    };

    handleUpdateNotebook({
      ...activeNotebook,
      pages: updatedPages,
    });
  };

  // Open note maker from slab or shelf & update recently opened priority
  const handleOpenNotebook = (id: string) => {
    const targetNb = notebooks.find((nb) => nb.id === id);
    if (targetNb) {
      const updatedNb = {
        ...targetNb,
        updatedAt: new Date().toISOString(),
      };
      const rest = notebooks.filter((nb) => nb.id !== id);
      const reordered = [updatedNb, ...rest];
      setNotebooks(reordered);
      localStorage.setItem('medden_notebooks', JSON.stringify(reordered));
    }
    setActiveNotebookId(id);
    setActiveView('notebooks');
    setIsEditingNote(true);
  };

  const handleCreateBlankNote = () => {
    const today = new Date().toISOString().split('T')[0];
    const nowIso = new Date().toISOString();
    const newNb: Notebook = {
      id: `nb-${Date.now()}`,
      title: 'Untitled Clinical Note',
      subject: currentSubject,
      coverTheme: 'botany',
      coverTitle: 'CLINICAL NOTE',
      coverSubtitle: 'Blank Note Sheet',
      coverColor: '#A47C43',
      paperType: 'ruled-thin',
      paperColor: 'beige',
      activePageIndex: 0,
      createdAt: today,
      updatedAt: nowIso,
      pages: [
        {
          id: `p-${Date.now()}`,
          title: 'Untitled Clinical Note',
          contentHtml: '<p><br></p>',
          inkStrokes: [],
          screenshots: [],
          date: today,
          updatedAt: nowIso,
        },
      ],
    };
    const updated = [newNb, ...notebooks];
    setNotebooks(updated);
    localStorage.setItem('medden_notebooks', JSON.stringify(updated));
    setActiveNotebookId(newNb.id);
    setActiveView('notebooks');
    setIsEditingNote(true);
  };

  const handleCreateQuickNote = () => {
    handleCreateBlankNote();
  };

  const handleToggleTask = (taskId: string) => {
    setTasks(tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)));
  };

  const handleAddTask = (task: StudyTask) => {
    setTasks([task, ...tasks]);
  };

  const handleExportNotes = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(notebooks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Ach1ev_Clinical_Notes_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleResetSession = () => {
    if (confirm('Reset Ach1ev workspace and clear all local data?')) {
      localStorage.clear();
      setOptionSlabs(INITIAL_OPTION_SLABS);
      setNotebooks([]);
      setBooks([]);
      setTasks([]);
      setRosterEvents([]);
      setRecycleBinItems([]);
      setActiveNotebookId('');
      setIsSettingsOpen(false);
    }
  };

  const activeThemeMeta = getThemeMeta(activeDesign);
  const appWallpaperUri = isDarkMode ? activeThemeMeta.darkWallpaperUri : activeThemeMeta.lightWallpaperUri;

  if (authLoading) {
    return (
      <div
        className="min-h-screen w-screen flex flex-col items-center justify-center gap-4"
        style={{ backgroundColor: 'var(--th-bg)', color: 'var(--th-ink)' }}
      >
        <AchievBrand variant="lockup" isDarkMode={isDarkMode} imgClassName="h-14 w-auto animate-pulse" />
        <p className="text-xs font-mono opacity-75">Initializing Ach1ev Cloud Workspace...</p>
      </div>
    );
  }

  if (!user && !googleUser && !isGuestMode) {
    return (
      <AuthPortal
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
      />
    );
  }

  return (
    <div
      className="flex h-[100dvh] w-full overflow-hidden bg-[var(--th-bg)] text-[var(--th-ink)] relative transition-colors"
      data-active-design={activeDesign}
      data-active-view={activeView}
    >
      {/* Dark Blurred Abstract Background Backdrops */}
      <div className="dark-ambient-backdrop opacity-0 dark:opacity-100 transition-opacity duration-700">
        <div className="dark-ambient-mesh-1" />
        <div className="dark-ambient-mesh-2" />
      </div>
      {/* Non-Repetitive Organic Abstract Theme Backdrop (Themes 2-10 in Light & Dark Modes; Leisure renders its own artwork) */}
      {appWallpaperUri && activeView !== 'leisure' && (
        <div
          className="app-theme-wallpaper"
          aria-hidden="true"
          style={{ backgroundImage: appWallpaperUri, opacity: isDarkMode ? 0.78 : 0.72 }}
        />
      )}

      {/* 1. Left Vertical Column (Cockpit, Notebooks, Shelf, Calendar) */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        isDarkMode={isDarkMode}
        activeDesign={activeDesign}
        activeView={isEditingNote || activeView === 'make-note' ? 'make-note' : activeView}
        isSettingsActive={activeView === 'settings' || isSettingsOpen}
        onNavigate={(view) => {
          setIsSettingsOpen(false);
          if (view === 'make-note') {
            handleCreateBlankNote();
          } else {
            setIsEditingNote(false);
            setActiveView(view as any);
          }
        }}
        currentSubject={currentSubject}
        onSelectSubject={setCurrentSubject}
        userProfile={userProfile}
        onOpenSettings={() => {
          setIsEditingNote(false);
          setIsSettingsOpen(false);
          setSettingsInitialTab('designs');
          setActiveView('settings');
        }}
        onOpenAIStudioModal={() => setIsAIStudioModalOpen(true)}
      />

      {/* 2. Right Main Viewport & Top Right Utility Column */}
      <div className="flex-1 min-w-0 flex flex-col h-[100dvh] overflow-hidden relative z-10">
        {/* Top Right Utility Bar */}
        <WindowsHeader
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          activeView={activeView}
          currentSubject={currentSubject}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          breakTimerCountdown={formatCountdown(secondsUntilBreak)}
          onTriggerEyeBreak={() => setIsEyeBreakModalOpen(true)}
          onOpenSettings={() => {
            setIsEditingNote(false);
            setIsSettingsOpen(false);
            setSettingsInitialTab('designs');
            setActiveView('settings');
          }}
          onOpenCloudSettings={() => {
            setIsEditingNote(false);
            setIsSettingsOpen(false);
            setSettingsInitialTab('cloud-sync');
            setActiveView('settings');
          }}
          onLogout={signOut}
          activeDesign={activeDesign}
          onSelectDesign={handleSelectDesign}
          onRevertChanges={handleRevertChanges}
          onOpenAskGemini={() => setIsGlobalGeminiOpen(true)}
          onOpenAIStudioModal={() => setIsAIStudioModalOpen(true)}
        />

        {/* Viewport Content */}
        <main className="flex-1 overflow-hidden flex pb-14 md:pb-0">
          {activeView === 'home' && (
            <MyDenHome
              userProfile={userProfile}
              currentSubject={currentSubject}
              onSelectSubject={setCurrentSubject}
              optionSlabs={optionSlabs}
              onUpdateOptionSlabs={setOptionSlabs}
              tasks={tasks}
              onToggleTask={handleToggleTask}
              onAddTask={handleAddTask}
              notebooks={notebooks}
              books={books}
              onOpenNotebook={handleOpenNotebook}
              onOpenStudio={(actionType) => {
                if (actionType === 'new-note') {
                  handleCreateQuickNote();
                } else {
                  setActiveView('notebooks');
                  setIsEditingNote(true);
                }
              }}
              onOpenRosterModal={() => {
                setIsEditingNote(false);
                setActiveView('roster');
              }}
              onOpenSettings={() => {
                setIsEditingNote(false);
                setIsSettingsOpen(false);
                setSettingsInitialTab('designs');
                setActiveView('settings');
              }}
              onNavigate={(view) => {
                setIsEditingNote(false);
                setIsSettingsOpen(false);
                setActiveView(view as any);
              }}
              rosterEvents={rosterEvents}
              breakTimerCountdown={formatCountdown(secondsUntilBreak)}
              onTriggerEyeBreak={() => setIsEyeBreakModalOpen(true)}
              activeDesign={activeDesign}
              onSelectDesign={handleSelectDesign}
              onRevertChanges={handleRevertChanges}
              isDarkMode={isDarkMode}
              onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
            />
          )}

          {activeView === 'read' && (
            <ReadStudioView
              currentSubject={currentSubject}
              books={books}
              onAddBook={handleAddBook}
              onSnipToNote={handleSnipToActiveNote}
              onOpenStudio={() => {
                setActiveView('notebooks');
                setIsEditingNote(true);
              }}
              onNavigateToShelf={() => setActiveView('library')}
              isDarkMode={isDarkMode}
            />
          )}

          {(activeView === 'notebooks' || activeView === 'make-note') && (
            (isEditingNote || activeView === 'make-note') ? (
              <div className="flex-1 flex flex-col h-full w-full overflow-hidden bg-transparent transition-colors">
                <RichNoteEditor
                  notebook={activeNotebook}
                  onUpdateNotebook={handleUpdateNotebook}
                  activePageIndex={activeNotebook?.activePageIndex || 0}
                  onSelectPage={(idx) => activeNotebook && handleUpdateNotebook({ ...activeNotebook, activePageIndex: idx })}
                  books={books}
                  onBack={() => {
                    setIsEditingNote(false);
                    setActiveView('home');
                  }}
                  activeDesign={activeDesign}
                  onSelectDesign={handleSelectDesign}
                />
              </div>
            ) : (
              <NotebookShelfView
                notebooks={notebooks}
                activeNotebookId={activeNotebookId}
                onSelectNotebook={handleOpenNotebook}
                onUpdateNotebook={handleUpdateNotebook}
                onCreateNotebook={handleCreateNotebook}
                onDeleteNotebook={handleDeleteNotebook}
                currentSubject={currentSubject}
                activeDesign={activeDesign}
                onSelectDesign={handleSelectDesign}
                isDarkMode={isDarkMode}
              />
            )
          )}

          {(activeView === 'library' || activeView === 'explore-body') && (
            <LibraryView
              isDarkMode={isDarkMode}
              activeDesign={activeDesign}
              currentSubject={currentSubject}
              onSelectSubject={setCurrentSubject}
              books={books}
              onAddBook={handleAddBook}
              onUpdateBook={handleUpdateBook}
              notebooks={notebooks}
              onUpdateNotebook={handleUpdateNotebook}
              onOpenNotebook={(id) => {
                setActiveNotebookId(id);
                setActiveView('notebooks');
                setIsEditingNote(true);
              }}
              onOpenStudio={(action) => {
                if (action === 'new-note') {
                  handleCreateQuickNote();
                } else {
                  setActiveView('notebooks');
                  setIsEditingNote(true);
                }
              }}
              onSnipToNote={handleSnipToActiveNote}
            />
          )}

          {activeView === 'community' && (
            <CommunityView
              currentSubject={currentSubject}
              onSnipToNote={handleSnipToActiveNote}
            />
          )}

          {activeView === 'mnemonics' && (
            <MnemonicDashboard
              currentSubject={currentSubject}
              onSnipToNote={handleSnipToActiveNote}
            />
          )}

          {activeView === 'leisure' && (
            <LeisureDashboard
              onBackToStudy={() => setActiveView('home')}
            />
          )}

          {activeView === 'roster' && (
            <div className="flex-1 h-full w-full overflow-hidden p-3 md:p-6 bg-transparent">
              <RosterCalendarModal
                isOpen={true}
                isFullView={true}
                onClose={() => setActiveView('home')}
                events={rosterEvents}
                onAddEvents={(newEvents) => setRosterEvents([...newEvents, ...rosterEvents])}
                onAddTasks={(newTasks) => setTasks([...newTasks, ...tasks])}
                currentSubject={currentSubject}
              />
            </div>
          )}

          {activeView === 'recycle-bin' && (
            <RecycleBinView
              items={recycleBinItems}
              onRestore={handleRestoreRecycleItem}
              onPermanentDelete={handlePermanentDeleteRecycleItem}
              onEmptyBin={handleEmptyRecycleBin}
              onBackToHome={() => setActiveView('home')}
            />
          )}

          {activeView === 'talk-to-dev' && (
            <div className="flex-1 h-full w-full overflow-hidden flex flex-col">
              <TalkToDeveloperModal
                isOpen={true}
                isWorkspaceView={true}
                onClose={() => setActiveView('home')}
                studentName={userProfile.name}
              />
            </div>
          )}

          {activeView === 'settings' && (
            <div className="flex-1 h-full w-full overflow-hidden flex flex-col">
              <SettingsModal
                isOpen={true}
                isWorkspaceView={true}
                initialTab={settingsInitialTab}
                onSyncNow={handleSyncAllNow}
                onLogout={signOut}
                onClose={() => setActiveView('home')}
                userProfile={userProfile}
                onUpdateProfile={setUserProfile}
                breakTimerConfig={breakConfig}
                onUpdateBreakConfig={setBreakConfig}
                onExportNotes={handleExportNotes}
                onResetSession={handleResetSession}
                activeDesign={activeDesign}
                onSelectDesign={handleSelectDesign}
                onOpenAIStudioModal={() => setIsAIStudioModalOpen(true)}
              />
            </div>
          )}
        </main>

        {/* Mobile Bottom Navigation Bar (Phone & Tablet-portrait view) */}
        <nav
          aria-label="Mobile navigation"
          className="md:hidden fixed bottom-0 left-0 right-0 z-40 backdrop-blur-md flex items-center justify-around px-2 py-1.5 safe-area-inset-bottom shadow-lg select-none border-t"
          style={{ backgroundColor: 'var(--th-header)', borderColor: 'var(--th-border)' }}
        >
          <button
            type="button"
            onClick={() => {
              setIsEditingNote(false);
              setActiveView('home');
            }}
            className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
              activeView === 'home' && !isEditingNote
                ? 'text-[var(--th-accent)] font-bold'
                : 'text-[var(--th-muted)] hover:text-[var(--th-ink)]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="text-[9px] font-medium leading-none">Cockpit</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsEditingNote(false);
              setActiveView('read');
            }}
            className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
              activeView === 'read'
                ? 'text-[var(--th-accent)] font-bold'
                : 'text-[var(--th-muted)] hover:text-[var(--th-ink)]'
            }`}
          >
            <BookOpenText className="w-4 h-4" />
            <span className="text-[9px] font-medium leading-none">Read</span>
          </button>

          {/* Central Highlighted Button: Create Note (always opens blank note) */}
          <button
            type="button"
            onClick={handleCreateBlankNote}
            className="relative -top-2 flex flex-col items-center gap-0.5 px-3.5 py-1.5 rounded-2xl text-white shadow-md active:scale-95 transition-all cursor-pointer"
            style={{ backgroundColor: 'var(--th-accent)' }}
          >
            <PenTool className="w-4 h-4 stroke-[2.2]" />
            <span className="text-[8px] font-bold tracking-tight">Note</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsEditingNote(false);
              setActiveView('library');
            }}
            className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
              activeView === 'library' || activeView === 'explore-body'
                ? 'text-[var(--th-accent)] font-bold'
                : 'text-[var(--th-muted)] hover:text-[var(--th-ink)]'
            }`}
          >
            <Library className="w-4 h-4" />
            <span className="text-[9px] font-medium leading-none">Shelf</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsEditingNote(false);
              setIsSettingsOpen(false);
              setActiveView('settings');
            }}
            className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
              activeView === 'settings'
                ? 'text-[var(--th-accent)] font-bold'
                : 'text-[var(--th-muted)] hover:text-[var(--th-ink)]'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span className="text-[9px] font-medium leading-none">Settings</span>
          </button>
        </nav>
      </div>

      {/* Subscription & Membership Modal */}
      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
      />

      {/* Roster Calendar & AI Scanner Modal */}
      <RosterCalendarModal
        isOpen={isRosterModalOpen}
        onClose={() => setIsRosterModalOpen(false)}
        events={rosterEvents}
        onAddEvents={(newEvents) => setRosterEvents([...newEvents, ...rosterEvents])}
        onAddTasks={(newTasks) => setTasks([...newTasks, ...tasks])}
        currentSubject={currentSubject}
      />

      {/* Eye Break 20-20-20 Rest Modal */}
      <EyeBreakModal
        isOpen={isEyeBreakModalOpen}
        onClose={() => {
          setIsEyeBreakModalOpen(false);
          setSecondsUntilBreak(breakConfig.intervalMinutes * 60);
        }}
        config={breakConfig}
        onUpdateConfig={setBreakConfig}
        onSnooze={handleSnoozeBreak}
      />

      {/* Settings & Student Profile Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        initialTab={settingsInitialTab}
        onSyncNow={handleSyncAllNow}
        onLogout={signOut}
        onClose={() => setIsSettingsOpen(false)}
        userProfile={userProfile}
        onUpdateProfile={setUserProfile}
        breakTimerConfig={breakConfig}
        onUpdateBreakConfig={setBreakConfig}
        onExportNotes={handleExportNotes}
        onResetSession={handleResetSession}
        activeDesign={activeDesign}
        onSelectDesign={handleSelectDesign}
        onOpenAIStudioModal={() => setIsAIStudioModalOpen(true)}
      />

      {/* Auth Modal Overlay when user triggers Sign In from Local Mode */}
      {isAuthModalOpen && (
        <AuthPortal
          isModal={true}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
          onClose={closeAuthModal}
        />
      )}

      {/* Universal Ask Gemini Modal */}
      <AskGeminiModal
        isOpen={isGlobalGeminiOpen}
        onClose={() => setIsGlobalGeminiOpen(false)}
        currentSubject={currentSubject}
        onInsertToNote={(contentHtml) => {
          if (activeNotebook) {
            const pages: NotePage[] = (activeNotebook.pages && activeNotebook.pages.length > 0)
              ? activeNotebook.pages
              : [{
                  id: 'p-default',
                  title: 'Page 1',
                  contentHtml: '',
                  date: new Date().toISOString().split('T')[0],
                  updatedAt: new Date().toISOString(),
                  screenshots: [],
                  inkStrokes: [],
                }];
            const currentPageIdx = Math.min(activeNotebook.activePageIndex || 0, pages.length - 1);
            const currentPage = pages[currentPageIdx] || pages[0];
            const updatedPages = [...pages];
            updatedPages[currentPageIdx] = {
              ...currentPage,
              contentHtml: (currentPage.contentHtml || '') + contentHtml,
            };
            handleUpdateNotebook({
              ...activeNotebook,
              pages: updatedPages,
            });
            setActiveView('notebooks');
            setIsEditingNote(true);
          } else {
            const today = new Date().toISOString().split('T')[0];
            const nowIso = new Date().toISOString();
            const newNb: Notebook = {
              id: `nb-${Date.now()}`,
              title: 'Study Note',
              subject: currentSubject,
              coverTheme: 'botany',
              coverTitle: 'STUDY NOTE',
              coverSubtitle: 'Personal Study Notes',
              coverColor: '#A47C43',
              paperType: 'ruled-thin',
              paperColor: 'beige',
              activePageIndex: 0,
              createdAt: today,
              updatedAt: nowIso,
              pages: [
                {
                  id: `p-${Date.now()}`,
                  title: 'Page 1',
                  contentHtml,
                  date: today,
                  updatedAt: nowIso,
                  screenshots: [],
                  inkStrokes: [],
                },
              ],
            };
            handleCreateNotebook(newNb);
            setActiveView('notebooks');
          }
        }}
      />

      {/* Share to Google AI Studio Modal */}
      <ShareToAIStudioModal
        isOpen={isAIStudioModalOpen}
        onClose={() => setIsAIStudioModalOpen(false)}
      />

      {/* Revert Changes Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 animate-in fade-in slide-in-from-bottom-3 duration-300 pointer-events-none">
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl shadow-2xl border backdrop-blur-md" style={{ backgroundColor: 'var(--th-surface)', color: 'var(--th-ink)', borderColor: 'var(--th-border)' }}>
            <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <svg className="w-3.5 h-3.5 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="text-xs font-mono font-medium">{toastMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}
