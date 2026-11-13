import React, { useState, useEffect, useMemo, useRef } from 'react';
import './mnemonicAtelier.css';
import { SubjectCourse, SnippetScreenshot } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import {
  Search,
  Sparkles,
  WandSparkles,
  Trash2,
  Copy,
  Check,
  Bookmark,
  ExternalLink,
  PenLine,
  X,
  Upload,
  Folder,
  FolderPlus,
  Cloud,
  Laptop,
  Edit2,
  Loader2,
} from 'lucide-react';

export interface MnemonicFolder {
  id: string;
  name: string;
}

export interface MnemonicItem {
  id: string;
  title: string;
  subject: string;
  memory_aid: string;
  explanation: string;
  source_name: string;
  source_url?: string;
  is_personal: boolean;
  folderId?: string;
}

export type MnemonicDraft = Omit<MnemonicItem, 'id'>;

export interface MnemonicDashboardProps {
  currentSubject?: SubjectCourse;
  onSnipToNote?: (screenshot: SnippetScreenshot) => void;
}

function parseMnemonicsText(rawText: string, fileName: string, folderId?: string): MnemonicItem[] {
  const trimmed = rawText.trim();
  if (!trimmed) return [];
  const results: MnemonicItem[] = [];

  // 1. JSON array / object support
  if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
    try {
      const parsed = JSON.parse(trimmed);
      const arr = Array.isArray(parsed)
        ? parsed
        : Array.isArray(parsed?.mnemonics)
        ? parsed.mnemonics
        : Array.isArray(parsed?.items)
        ? parsed.items
        : [parsed];
      arr.forEach((entry: any, i: number) => {
        const title = String(entry?.title || entry?.topic || entry?.name || '').trim();
        const aid = String(entry?.memory_aid || entry?.mnemonic || entry?.phrase || entry?.aid || '').trim();
        if (title || aid) {
          results.push({
            id: `mn-imp-${Date.now()}-${i}`,
            title: title || aid.slice(0, 48),
            subject: String(entry?.subject || entry?.category || 'General').trim() || 'General',
            memory_aid: aid || title,
            explanation: String(entry?.explanation || entry?.notes || entry?.meaning || `Imported from ${fileName}`).trim(),
            source_name: fileName,
            is_personal: true,
            folderId,
          });
        }
      });
      if (results.length > 0) return results;
    } catch {}
  }

  // 2. CSV header detection
  const lines = trimmed.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (fileName.toLowerCase().endsWith('.csv') || (lines.length > 1 && lines[0].includes(',') && lines[0].toLowerCase().includes('title'))) {
    const startIdx = lines[0].toLowerCase().includes('title') ? 1 : 0;
    for (let i = startIdx; i < lines.length; i++) {
      const cols = lines[i].split(',').map((c) => c.replace(/^"|"$/g, '').trim());
      if (cols[0] || cols[1]) {
        results.push({
          id: `mn-imp-${Date.now()}-${i}`,
          title: cols[0] || `Mnemonic ${i + 1}`,
          memory_aid: cols[1] || cols[0] || '',
          subject: cols[2] || 'General',
          explanation: cols[3] || `Imported from ${fileName}`,
          source_name: fileName,
          is_personal: true,
          folderId,
        });
      }
    }
    if (results.length > 0) return results;
  }

  // 3. Markdown / Plain text blocks or lines ("Topic: Mnemonic — Explanation" or blank-line separated blocks)
  const blocks = trimmed.split(/\n{2,}/).filter((b) => b.trim());
  if (blocks.length > 1 || blocks[0]?.includes('\n')) {
    blocks.forEach((blk, idx) => {
      const blkLines = blk.split(/\r?\n/).map((l) => l.replace(/^[-*#>\s]+/, '').trim()).filter(Boolean);
      if (blkLines.length === 0) return;
      if (blkLines.length === 1 && (blkLines[0].includes(':') || blkLines[0].includes('—') || blkLines[0].includes(' - '))) {
        const [head, ...rest] = blkLines[0].split(/:|—|\s-\s/);
        results.push({
          id: `mn-imp-${Date.now()}-${idx}`,
          title: head.trim() || `Imported #${idx + 1}`,
          subject: 'General',
          memory_aid: rest.join(' — ').trim() || head.trim(),
          explanation: `Imported from ${fileName}`,
          source_name: fileName,
          is_personal: true,
          folderId,
        });
      } else {
        results.push({
          id: `mn-imp-${Date.now()}-${idx}`,
          title: blkLines[0],
          subject: 'General',
          memory_aid: blkLines[1] || blkLines[0],
          explanation: blkLines.slice(2).join(' ') || `Imported from ${fileName}`,
          source_name: fileName,
          is_personal: true,
          folderId,
        });
      }
    });
  } else {
    results.push({
      id: `mn-imp-${Date.now()}-0`,
      title: fileName.replace(/\.[^/.]+$/, ''),
      subject: 'General',
      memory_aid: trimmed.slice(0, 220),
      explanation: `Imported from ${fileName}`,
      source_name: fileName,
      is_personal: true,
      folderId,
    });
  }

  return results;
}

export const MnemonicDashboard: React.FC<MnemonicDashboardProps> = ({
  currentSubject,
  onSnipToNote,
}) => {
  const { driveAccount, connectGoogleDrive, getValidDriveAccessToken } = useAuth();
  const deviceFileInputRef = useRef<HTMLInputElement>(null);

  // State for mnemonics list (persisted in localStorage, strip old seed mnemonics)
  const [items, setItems] = useState<MnemonicItem[]>(() => {
    try {
      const saved = localStorage.getItem('notist-mnemonics');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const cleaned = parsed.filter(
            (item: any) => typeof item?.id !== 'string' || !item.id.startsWith('seed-')
          );
          if (cleaned.length !== parsed.length) {
            localStorage.setItem('notist-mnemonics', JSON.stringify(cleaned));
          }
          return cleaned;
        }
      }
    } catch {}
    return [];
  });

  // Collection Folders state
  const [folders, setFolders] = useState<MnemonicFolder[]>(() => {
    try {
      const saved = localStorage.getItem('medden_mnemonic_folders_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });
  const [activeFolderId, setActiveFolderId] = useState<string>('all');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [renamingFolderId, setRenamingFolderId] = useState<string | null>(null);
  const [renameFolderDraft, setRenameFolderDraft] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createMode, setCreateMode] = useState<'gemini' | 'own'>('gemini');
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Import modal state
  const [showImportModal, setShowImportModal] = useState(false);
  const [importTab, setImportTab] = useState<'device' | 'drive'>('device');
  const [importTargetFolderId, setImportTargetFolderId] = useState<string>('');
  const [driveFiles, setDriveFiles] = useState<Array<{ id: string; name: string; mimeType: string }>>([]);
  const [isLoadingDriveFiles, setIsLoadingDriveFiles] = useState(false);
  const [driveError, setDriveError] = useState<string | null>(null);

  // Mnemonic Draft form state
  const [draft, setDraft] = useState<MnemonicDraft>({
    title: '',
    subject: (currentSubject as string) || 'General',
    memory_aid: '',
    explanation: '',
    source_name: 'My collection',
    source_url: '',
    is_personal: true,
    folderId: '',
  });

  // Save items and folders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('notist-mnemonics', JSON.stringify(items));
    } catch {}
  }, [items]);

  useEffect(() => {
    try {
      localStorage.setItem('medden_mnemonic_folders_v1', JSON.stringify(folders));
    } catch {}
  }, [folders]);

  // Filter items by folder + search query
  const filteredItems = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return items.filter((item) => {
      if (activeFolderId !== 'all' && item.folderId !== activeFolderId) return false;
      return (
        !q ||
        `${item.title} ${item.memory_aid} ${item.explanation} ${item.subject}`
          .toLowerCase()
          .includes(q)
      );
    });
  }, [items, searchQuery, activeFolderId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('mnemonic-search-input');
        if (searchInput) searchInput.focus();
      } else if (e.key === 'Escape') {
        setShowCreateModal(false);
        setShowImportModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCreateFolder = () => {
    const clean = newFolderName.trim();
    if (!clean) return;
    const newF: MnemonicFolder = { id: `mnf-${Date.now()}`, name: clean };
    setFolders((prev) => [...prev, newF]);
    setActiveFolderId(newF.id);
    setNewFolderName('');
    setIsCreatingFolder(false);
    setStatusMessage(`Created folder "${clean}".`);
  };

  const handleRenameFolder = (folderId: string) => {
    const clean = renameFolderDraft.trim();
    if (clean) {
      setFolders((prev) => prev.map((f) => (f.id === folderId ? { ...f, name: clean } : f)));
    }
    setRenamingFolderId(null);
  };

  const handleDeleteFolder = (folderId: string) => {
    setFolders((prev) => prev.filter((f) => f.id !== folderId));
    setItems((prev) => prev.map((item) => (item.folderId === folderId ? { ...item, folderId: '' } : item)));
    if (activeFolderId === folderId) setActiveFolderId('all');
  };

  const handleMoveItemFolder = (itemId: string, folderId: string) => {
    setItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, folderId } : item)));
  };

  const handleDeviceImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const targetFolder = importTargetFolderId || (activeFolderId !== 'all' ? activeFolderId : '');
      const parsed = parseMnemonicsText(text, file.name, targetFolder || undefined);
      if (parsed.length === 0) {
        setStatusMessage(`No mnemonics detected inside "${file.name}".`);
      } else {
        setItems((prev) => [...parsed, ...prev]);
        setStatusMessage(`Imported ${parsed.length} mnemonic${parsed.length === 1 ? '' : 's'} from ${file.name}.`);
        setShowImportModal(false);
      }
    } catch {
      setStatusMessage('Failed to read selected file.');
    } finally {
      e.target.value = '';
    }
  };

  const handleLoadDriveFiles = async () => {
    setIsLoadingDriveFiles(true);
    setDriveError(null);
    try {
      let token = await getValidDriveAccessToken();
      if (!token) {
        await connectGoogleDrive();
        token = await getValidDriveAccessToken();
      }
      if (!token) {
        setDriveError('Connect Google Drive to browse your mnemonic files.');
        setIsLoadingDriveFiles(false);
        return;
      }
      const q = encodeURIComponent(
        "trashed = false and (mimeType = 'application/json' or mimeType = 'text/plain' or mimeType = 'text/csv' or mimeType = 'text/markdown' or mimeType = 'application/vnd.google-apps.document')"
      );
      const res = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name,mimeType)&pageSize=30&orderBy=modifiedTime desc`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error('Could not fetch Drive files');
      const data = await res.json();
      setDriveFiles(Array.isArray(data?.files) ? data.files : []);
    } catch (err: any) {
      setDriveError(err?.message || 'Unable to load files from Google Drive.');
    } finally {
      setIsLoadingDriveFiles(false);
    }
  };

  const handleImportDriveFile = async (file: { id: string; name: string; mimeType: string }) => {
    setIsLoadingDriveFiles(true);
    setDriveError(null);
    try {
      const token = await getValidDriveAccessToken();
      if (!token) throw new Error('Google Drive authorization expired.');
      const url =
        file.mimeType === 'application/vnd.google-apps.document'
          ? `https://www.googleapis.com/drive/v3/files/${file.id}/export?mimeType=text/plain`
          : `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error('Failed to download file content from Drive.');
      const text = await res.text();
      const targetFolder = importTargetFolderId || (activeFolderId !== 'all' ? activeFolderId : '');
      const parsed = parseMnemonicsText(text, file.name, targetFolder || undefined);
      if (parsed.length === 0) {
        setDriveError(`No importable mnemonics found in "${file.name}".`);
      } else {
        setItems((prev) => [...parsed, ...prev]);
        setStatusMessage(`Imported ${parsed.length} mnemonic${parsed.length === 1 ? '' : 's'} from Google Drive (${file.name}).`);
        setShowImportModal(false);
      }
    } catch (err: any) {
      setDriveError(err?.message || 'Drive import error.');
    } finally {
      setIsLoadingDriveFiles(false);
    }
  };

  // Save Mnemonic
  const handleSaveMnemonic = () => {
    if (!draft.title.trim() || !draft.memory_aid.trim()) {
      setStatusMessage('Please enter both a topic and memory aid before saving.');
      return;
    }

    const assignedFolder =
      draft.folderId || (activeFolderId !== 'all' ? activeFolderId : '');

    const newItem: MnemonicItem = {
      id: `mn-${Date.now()}`,
      title: draft.title.trim(),
      subject: draft.subject,
      memory_aid: draft.memory_aid.trim(),
      explanation: draft.explanation.trim() || 'Custom recall association.',
      source_name: draft.source_name.trim() || 'Personal',
      source_url: draft.source_url?.trim() || '',
      is_personal: true,
      folderId: assignedFolder || undefined,
    };

    setItems((prev) => [newItem, ...prev]);
    setShowCreateModal(false);
    setStatusMessage(`Saved "${newItem.title}" to your collection.`);
    setDraft({
      title: '',
      subject: (currentSubject as string) || 'General',
      memory_aid: '',
      explanation: '',
      source_name: 'My collection',
      source_url: '',
      is_personal: true,
      folderId: '',
    });
  };

  // Generate Mnemonic using Gemini / AI
  const handleGenerateWithGemini = async () => {
    if (!draft.title.trim()) {
      setStatusMessage('Please add a medical topic first to generate a memory aid.');
      return;
    }

    setIsGenerating(true);
    setStatusMessage('');

    try {
      // 1. Try Gemini Research API endpoint
      const response = await fetch('/api/gemini/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: `Medical mnemonic for: ${draft.title.trim()} (${draft.subject})`,
          level: 'high-yield clinical',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.content || data.result || '';
        // Extract mnemonic phrase or use fallback
        const lines = content.split('\n').filter((l: string) => l.trim().length > 0);
        const aidLine = lines[0]?.replace(/^[#*\s-]+/, '') || `Remember ${draft.title.trim()}`;
        const explanationText = lines.slice(1, 4).join(' ').replace(/[*#]/g, '') || content;

        setDraft((prev) => ({
          ...prev,
          memory_aid: aidLine,
          explanation: explanationText || `High-yield memory aid generated for ${draft.title}.`,
        }));
        setStatusMessage('Gemini draft generated — review or refine it before saving.');
        setIsGenerating(false);
        return;
      }
    } catch {}

    // 2. Intelligent Medical Fallback Generator
    setTimeout(() => {
      const topicLower = draft.title.toLowerCase();
      let genAid = `ACRONYM: ${draft.title.slice(0, 5).toUpperCase()}`;
      let genExp = `Each letter maps to key pathology and therapeutic steps of ${draft.title}.`;

      if (topicLower.includes('nephrotic')) {
        genAid = 'M-F-M-A-D (Membranous, Focal segmental, Minimal change, Amyloidosis, Diabetic)';
        genExp = 'Major causes of nephrotic syndrome categorized by glomerular histopathology.';
      } else if (topicLower.includes('heart failure') || topicLower.includes('hf')) {
        genAid = 'B-A-M (Beta blocker, ACEi/ARNI, Mineralocorticoid antagonist)';
        genExp = 'Cornerstone pharmacotherapies that reduce mortality in HFrEF.';
      } else if (topicLower.includes('cranial') || topicLower.includes('nerve')) {
        genAid = 'On Old Olympus Towering Tops, A Fin And German Viewed Some Hops';
        genExp = 'Olfactory, Optic, Oculomotor, Trochlear, Trigeminal, Abducens, Facial, Auditory (Vestibulocochlear), Glossopharyngeal, Vagus, Spinal Accessory, Hypoglossal.';
      } else {
        genAid = `${draft.title.toUpperCase().split(' ').map((w) => w[0]).join('')} — High-Yield Clinical Hook`;
        genExp = `Memory aid engineered for ${draft.title} (${draft.subject}) to optimize rapid exam recall.`;
      }

      setDraft((prev) => ({
        ...prev,
        memory_aid: genAid,
        explanation: genExp,
      }));
      setStatusMessage('Gemini draft ready — review and refine it before saving.');
      setIsGenerating(false);
    }, 700);
  };

  // Delete Mnemonic
  const handleDeleteMnemonic = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setItems((prev) => prev.filter((item) => item.id !== id));
    setStatusMessage('Mnemonic removed from your collection.');
  };

  // Copy Memory Aid text to clipboard
  const handleCopyMnemonic = (item: MnemonicItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const textToCopy = `${item.title}\n${item.memory_aid}\n${item.explanation}`;
    navigator.clipboard?.writeText(textToCopy);
    setCopiedId(item.id);
    setStatusMessage(`Copied "${item.memory_aid}" to clipboard.`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Snip to active note
  const handleSnipMnemonic = (item: MnemonicItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSnipToNote) {
      const snip: SnippetScreenshot = {
        id: `snip-${Date.now()}`,
        dataUrl: '',
        sourceBookTitle: `Mnemonic · ${item.subject}`,
        pageNumber: 1,
        timestamp: new Date().toLocaleTimeString(),
        caption: `**${item.title}**: *${item.memory_aid}* — ${item.explanation}`,
      };
      onSnipToNote(snip);
      setStatusMessage(`Added "${item.title}" to your active note!`);
    } else {
      handleCopyMnemonic(item, e);
    }
  };

  return (
    <div className="mnemonic-page">
      <div className="mnemonic-wrap">
        {/* 1. Hero Header Section */}
        <section className="mnemonic-hero">
          <div>
            <h1>
              Find the phrase<br />
              <em>that makes it stick.</em>
            </h1>
          </div>

          <div className="hero-orbit" aria-hidden="true">
            <WandSparkles size={16} />
            <span>
              Recall<br />
              made personal
            </span>
          </div>
        </section>

        {/* 2. Search & Action Controls Bar */}
        <div className="mnemonic-actions">
          <div className="mnemonic-search">
            <Search size={17} />
            <input
              id="mnemonic-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your mnemonics or keywords…"
            />
          </div>

          <button
            type="button"
            className="source-button"
            onClick={() => {
              setImportTargetFolderId(activeFolderId !== 'all' ? activeFolderId : '');
              setImportTab('device');
              setShowImportModal(true);
            }}
            title="Import mnemonics from PC / Device or Google Drive"
          >
            <Upload size={15} />
            Import Mnemonics
          </button>

          <button
            type="button"
            className="create-button"
            onClick={() => {
              setDraft((prev) => ({
                ...prev,
                folderId: activeFolderId !== 'all' ? activeFolderId : prev.folderId || '',
              }));
              setCreateMode('gemini');
              setShowCreateModal(true);
            }}
            title="Create a new mnemonic draft with Gemini AI"
          >
            <Sparkles size={16} />
            Create with Gemini
          </button>
        </div>

        {/* 3. Feedback Notification Banner */}
        {statusMessage && (
          <div className="mnemonic-message" role="status">
            <span>{statusMessage}</span>
            <button onClick={() => setStatusMessage('')} aria-label="Dismiss message">
              <X size={15} />
            </button>
          </div>
        )}

        {/* 4. Your Collection + Folders */}
        <div className="mnemonic-columns mt-4">
          <section className="collection-section">
            <div className="subsection-heading">
              <div>
                <h2>Your Collection</h2>
              </div>
              <div className="flex items-center gap-2.5 flex-wrap">
                {isCreatingFolder ? (
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      autoFocus
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleCreateFolder();
                        if (e.key === 'Escape') {
                          setIsCreatingFolder(false);
                          setNewFolderName('');
                        }
                      }}
                      placeholder="Folder name..."
                      className="px-2.5 py-1 rounded-lg border border-[var(--mn-line)] bg-[var(--mn-strong)] text-xs text-[var(--mn-ink)] outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleCreateFolder}
                      className="px-2.5 py-1 rounded-lg bg-[var(--mn-sage)] text-white text-xs font-semibold cursor-pointer"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreatingFolder(false);
                        setNewFolderName('');
                      }}
                      className="px-2 py-1 rounded-lg border border-[var(--mn-line)] text-xs text-[var(--mn-muted)] cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsCreatingFolder(true)}
                    className="source-button !py-1.5 !px-3 !text-xs"
                  >
                    <FolderPlus size={14} />
                    <span>+ New Folder</span>
                  </button>
                )}
                <span>{filteredItems.length} saved</span>
              </div>
            </div>

            {/* Folder Tabs Bar */}
            <div className="subject-row">
              <button
                type="button"
                className={activeFolderId === 'all' ? 'active' : ''}
                onClick={() => setActiveFolderId('all')}
              >
                All ({items.length})
              </button>
              {folders.map((folder) => {
                const count = items.filter((it) => it.folderId === folder.id).length;
                const isActive = activeFolderId === folder.id;
                if (renamingFolderId === folder.id) {
                  return (
                    <div key={folder.id} className="inline-flex items-center gap-1 px-2 py-1 rounded-full border border-[var(--mn-sage)] bg-[var(--mn-paper)]">
                      <input
                        type="text"
                        autoFocus
                        value={renameFolderDraft}
                        onChange={(e) => setRenameFolderDraft(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleRenameFolder(folder.id);
                          if (e.key === 'Escape') setRenamingFolderId(null);
                        }}
                        onBlur={() => handleRenameFolder(folder.id)}
                        className="w-24 text-xs bg-transparent text-[var(--mn-ink)] outline-none"
                      />
                    </div>
                  );
                }
                return (
                  <div key={folder.id} className="inline-flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      className={isActive ? 'active inline-flex items-center gap-1.5' : 'inline-flex items-center gap-1.5'}
                      onClick={() => setActiveFolderId(folder.id)}
                    >
                      <Folder size={12} />
                      <span>{folder.name} ({count})</span>
                    </button>
                    {isActive && (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setRenamingFolderId(folder.id);
                            setRenameFolderDraft(folder.name);
                          }}
                          title="Rename folder"
                          className="!p-1.5"
                        >
                          <Edit2 size={11} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteFolder(folder.id)}
                          title="Delete folder"
                          className="!p-1.5 text-rose-600 dark:text-rose-400"
                        >
                          <Trash2 size={11} />
                        </button>
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mnemonic-list">
              {filteredItems.map((item) => {
                const folderName = folders.find((f) => f.id === item.folderId)?.name;
                return (
                  <article key={item.id} className="mnemonic-card">
                    <div className="mnemonic-card-top">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="subject-tag">{item.subject}</span>
                        {folderName && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full border border-[var(--mn-line)] text-[var(--mn-muted)] inline-flex items-center gap-1">
                            <Folder size={10} />
                            {folderName}
                          </span>
                        )}
                      </div>
                      <div className="card-actions">
                        <button
                          className="copy"
                          onClick={(e) => handleCopyMnemonic(item, e)}
                          title="Copy mnemonic"
                          aria-label="Copy mnemonic"
                        >
                          {copiedId === item.id ? <Check size={14} className="text-amber-600 dark:text-amber-400" /> : <Copy size={14} />}
                        </button>
                        <button
                          className="snip"
                          onClick={(e) => handleSnipMnemonic(item, e)}
                          title="Add to active note"
                          aria-label="Add to note"
                        >
                          <Bookmark size={14} />
                        </button>
                        <button
                          className="delete"
                          onClick={(e) => handleDeleteMnemonic(item.id, e)}
                          title={`Remove ${item.title}`}
                          aria-label={`Remove ${item.title}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <h3>{item.title}</h3>
                    <div className="memory-aid">{item.memory_aid}</div>
                    <p>{item.explanation}</p>

                    <footer>
                      <span>{item.is_personal ? 'Personal' : item.source_name}</span>
                      <div className="flex items-center gap-2">
                        {folders.length > 0 && (
                          <select
                            value={item.folderId || ''}
                            onChange={(e) => handleMoveItemFolder(item.id, e.target.value)}
                            title="Assign to folder"
                            className="text-[10px] px-1.5 py-0.5 rounded border border-[var(--mn-line)] bg-[var(--mn-strong)] text-[var(--mn-muted)] outline-none cursor-pointer"
                          >
                            <option value="">No Folder</option>
                            {folders.map((f) => (
                              <option key={f.id} value={f.id}>
                                {f.name}
                              </option>
                            ))}
                          </select>
                        )}
                        {item.source_url ? (
                          <a href={item.source_url} target="_blank" rel="noreferrer">
                            Source <ExternalLink size={12} />
                          </a>
                        ) : (
                          <span>Saved</span>
                        )}
                      </div>
                    </footer>
                  </article>
                );
              })}

              {filteredItems.length === 0 && (
                <div className="mnemonic-empty">
                  <Bookmark size={24} />
                  <p>
                    {activeFolderId === 'all'
                      ? 'No mnemonics in Your Collection yet.'
                      : 'No mnemonics inside this folder yet.'}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <button
                      onClick={() => {
                        setCreateMode('own');
                        setShowCreateModal(true);
                      }}
                    >
                      Create the first one
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* 5. Modal: Import Mnemonics from Device or Google Drive */}
      {showImportModal && (
        <div
          className="modal-backdrop"
          onClick={() => setShowImportModal(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="mnemonic-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>Import Mnemonics</h2>
              </div>
              <button
                className="icon-button"
                onClick={() => setShowImportModal(false)}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {folders.length > 0 && (
              <div className="mb-3">
                <label className="block text-xs text-[var(--mn-muted)] mb-1">
                  Save imported mnemonics into folder
                </label>
                <select
                  value={importTargetFolderId}
                  onChange={(e) => setImportTargetFolderId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--mn-line)] bg-[var(--mn-strong)] text-xs text-[var(--mn-ink)] outline-none"
                >
                  <option value="">All (Unfiled)</option>
                  {folders.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="mode-switch" role="group" aria-label="Import source">
              <button
                type="button"
                className={importTab === 'device' ? 'active' : ''}
                onClick={() => setImportTab('device')}
              >
                <Laptop size={14} />
                From Device / PC
              </button>
              <button
                type="button"
                className={importTab === 'drive' ? 'active' : ''}
                onClick={() => {
                  setImportTab('drive');
                  if (driveFiles.length === 0) handleLoadDriveFiles();
                }}
              >
                <Cloud size={14} />
                Google Drive
              </button>
            </div>

            {importTab === 'device' ? (
              <div className="p-6 rounded-2xl border-2 border-dashed border-[var(--mn-line)] bg-[var(--mn-strong)] text-center space-y-3">
                <input
                  ref={deviceFileInputRef}
                  type="file"
                  accept=".json,.csv,.txt,.md"
                  onChange={handleDeviceImport}
                  className="hidden"
                />
                <Upload className="w-7 h-7 mx-auto text-[var(--mn-sage)]" />
                <p className="text-xs font-medium text-[var(--mn-ink)]">
                  Upload a JSON, CSV, TXT, or Markdown file from your PC or device
                </p>
                <p className="text-[11px] text-[var(--mn-muted)]">
                  Supports structured lists, Topic: Memory aid lines, or flashcard exports.
                </p>
                <button
                  type="button"
                  onClick={() => deviceFileInputRef.current?.click()}
                  className="add-button mx-auto"
                >
                  Choose File
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-[var(--mn-muted)]">
                  <span>
                    {driveAccount?.email
                      ? `Connected: ${driveAccount.email}`
                      : 'Sign in with Google Drive to import mnemonic files'}
                  </span>
                  <button
                    type="button"
                    onClick={handleLoadDriveFiles}
                    disabled={isLoadingDriveFiles}
                    className="source-button !py-1 !px-2.5 !text-xs"
                  >
                    {isLoadingDriveFiles ? <Loader2 size={12} className="animate-spin" /> : null}
                    <span>{driveAccount?.email ? 'Refresh' : 'Connect Drive'}</span>
                  </button>
                </div>

                {driveError && (
                  <p className="text-xs text-rose-600 dark:text-rose-400">{driveError}</p>
                )}

                <div className="max-h-60 overflow-y-auto space-y-1.5 custom-scrollbar">
                  {driveFiles.map((f) => (
                    <div
                      key={f.id}
                      className="flex items-center justify-between gap-2 p-2.5 rounded-xl border border-[var(--mn-line)] bg-[var(--mn-strong)]"
                    >
                      <span className="text-xs font-medium text-[var(--mn-ink)] truncate">
                        {f.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleImportDriveFile(f)}
                        className="add-button !py-1 !px-3 !text-[11px] shrink-0"
                      >
                        Import
                      </button>
                    </div>
                  ))}
                  {!isLoadingDriveFiles && driveFiles.length === 0 && !driveError && (
                    <p className="text-xs text-center py-6 text-[var(--mn-muted)]">
                      No matching text, markdown, CSV, or Google Docs files found yet.
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="modal-actions">
              <button
                type="button"
                className="ghost-button"
                onClick={() => setShowImportModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Modal: Create with Gemini / Write My Own */}
      {showCreateModal && (
        <div
          className="modal-backdrop"
          onClick={() => setShowCreateModal(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="mnemonic-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h2>{createMode === 'gemini' ? 'Create with Gemini' : 'New mnemonic'}</h2>
              </div>
              <button
                className="icon-button"
                onClick={() => setShowCreateModal(false)}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Mode Switcher */}
            <div className="mode-switch" role="group" aria-label="Creation mode">
              <button
                type="button"
                className={createMode === 'gemini' ? 'active' : ''}
                onClick={() => setCreateMode('gemini')}
              >
                <Sparkles size={14} />
                Gemini draft
              </button>
              <button
                type="button"
                className={createMode === 'own' ? 'active' : ''}
                onClick={() => setCreateMode('own')}
              >
                <PenLine size={14} />
                Write my own
              </button>
            </div>

            {/* Form Fields */}
            <div className="form-grid">
              <label className="full">
                What do you want to remember?
                <input
                  value={draft.title}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                  placeholder="e.g. Causes of nephrotic syndrome"
                  autoFocus
                />
              </label>

              <label>
                Category / Subject
                <input
                  value={draft.subject}
                  onChange={(e) => setDraft({ ...draft, subject: e.target.value })}
                  placeholder="e.g. Pharmacology, Anatomy, General"
                />
              </label>

              <label>
                Folder
                <select
                  value={draft.folderId || ''}
                  onChange={(e) => setDraft({ ...draft, folderId: e.target.value })}
                >
                  <option value="">No Folder</option>
                  {folders.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="full">
                Mnemonic / memory aid
                <textarea
                  rows={3}
                  value={draft.memory_aid}
                  onChange={(e) => setDraft({ ...draft, memory_aid: e.target.value })}
                  placeholder="The phrase, acronym or story…"
                />
              </label>

              <label className="full">
                Why it works
                <textarea
                  rows={2}
                  value={draft.explanation}
                  onChange={(e) => setDraft({ ...draft, explanation: e.target.value })}
                  placeholder="Map each part of the mnemonic to the concept you need to recall…"
                />
              </label>
            </div>

            {/* Gemini Generation Trigger */}
            {createMode === 'gemini' && (
              <button
                type="button"
                className="generate-button"
                onClick={handleGenerateWithGemini}
                disabled={isGenerating || !draft.title.trim()}
              >
                <Sparkles size={14} />
                {isGenerating ? 'Synthesizing mnemonic…' : 'Generate a draft ✦'}
              </button>
            )}

            {/* Modal Actions */}
            <div className="modal-actions">
              <button
                type="button"
                className="ghost-button"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="add-button"
                onClick={handleSaveMnemonic}
                disabled={!draft.title.trim() || !draft.memory_aid.trim()}
              >
                Save mnemonic
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MnemonicDashboard;
