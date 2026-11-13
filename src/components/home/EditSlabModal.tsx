import React, { useState } from 'react';
import { OptionSlab, SubjectCourse } from '../../types';
import {
  X,
  Check,
  Upload,
  FileText,
  Paperclip,
  Sparkles,
  Trash2,
  Maximize2,
  Minimize2,
  Tag,
  Palette,
  ExternalLink,
} from 'lucide-react';

interface EditSlabModalProps {
  isOpen: boolean;
  onClose: () => void;
  slab: OptionSlab | null;
  onSaveSlab: (updatedSlab: OptionSlab) => void;
  onDeleteSlab?: (slabId: string) => void;
  onAskGeminiAboutSlab?: (topic: string) => void;
  currentSubject: SubjectCourse;
}

export const SOBER_ACCENT_COLORS = [
  { id: 'sky', name: 'Fjord Mist', hex: '#4a76a4', bg: 'bg-[#4a76a4]', text: 'text-[#4a76a4]', border: 'border-[#4a76a4]/40' },
  { id: 'indigo', name: 'Fjord Slate', hex: '#587a94', bg: 'bg-[#587a94]', text: 'text-[#587a94]', border: 'border-[#587a94]/40' },
  { id: 'amber', name: 'Warm Terracotta', hex: '#b57c52', bg: 'bg-[#b57c52]', text: 'text-[#b57c52]', border: 'border-[#b57c52]/40' },
  { id: 'emerald', name: 'Bear Caramel', hex: '#8f5f2c', bg: 'bg-[#8f5f2c]', text: 'text-[#8f5f2c]', border: 'border-[#8f5f2c]/40' },
  { id: 'rose', name: 'Heather Plum', hex: '#9c6c76', bg: 'bg-[#9c6c76]', text: 'text-[#9c6c76]', border: 'border-[#9c6c76]/40' },
  { id: 'slate', name: 'Mineral Graphite', hex: '#455667', bg: 'bg-[#455667]', text: 'text-[#455667]', border: 'border-[#455667]/40' },
];

export const EditSlabModal: React.FC<EditSlabModalProps> = ({
  isOpen,
  onClose,
  slab,
  onSaveSlab,
  onDeleteSlab,
  onAskGeminiAboutSlab,
  currentSubject,
}) => {
  if (!isOpen || !slab) return null;

  const [title, setTitle] = useState(slab.title);
  const [subtitle, setSubtitle] = useState(slab.subtitle);
  const [badge, setBadge] = useState(slab.badge || '');
  const [accentColor, setAccentColor] = useState(slab.accentColor || 'sky');
  const [size, setSize] = useState<'compact' | 'normal' | 'expanded'>(slab.size || 'normal');
  const [customNotes, setCustomNotes] = useState(slab.customNotes || '');
  const [fileName, setFileName] = useState(slab.fileAttachmentName || '');
  const [fileUrl, setFileUrl] = useState(slab.fileAttachmentUrl || '');
  const [fileSize, setFileSize] = useState(slab.fileAttachmentSize || '');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const fakeSize = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
      setFileSize(fakeSize);
      const url = URL.createObjectURL(file);
      setFileUrl(url);
    }
  };

  const handleRemoveFile = () => {
    setFileName('');
    setFileUrl('');
    setFileSize('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const updated: OptionSlab = {
      ...slab,
      title: title.trim(),
      subtitle: subtitle.trim(),
      badge: badge.trim() || undefined,
      accentColor,
      size,
      customNotes: customNotes.trim() || undefined,
      fileAttachmentName: fileName || undefined,
      fileAttachmentUrl: fileUrl || undefined,
      fileAttachmentSize: fileSize || undefined,
    };

    onSaveSlab(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-[#fcfbf8] dark:bg-[#160f0b] border border-stone-200/80 dark:border-[#382518] rounded-2xl shadow-2xl max-w-xl w-full max-h-[92vh] flex flex-col overflow-hidden relative text-stone-900 dark:text-[#efe4d4] transition-colors">
        {/* Header */}
        <div className="bg-stone-50 dark:bg-[#1e140e] px-5 py-3.5 border-b border-stone-200/80 dark:border-[#382518] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-[#8f5f2c] dark:text-amber-400 flex items-center justify-center border border-amber-500/20">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">Edit Study Slab & Module</h3>
              <p className="text-[11px] text-stone-500 dark:text-[#a69079] font-mono">
                {slab.subject || currentSubject} · Customize size, attachment & colors
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-[#2a1d14] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1 custom-scrollbar text-xs">
          {/* Title & Badge */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-semibold mb-1 text-stone-700 dark:text-[#d8c7b0]">
                Slab Title / Topic:
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Systemic Pharmacology"
                className="w-full bg-stone-100 dark:bg-[#140e0a] px-3 py-2 rounded-xl border border-stone-200 dark:border-[#382518] text-xs outline-none focus:border-amber-500 transition-colors"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-stone-700 dark:text-[#d8c7b0]">
                Badge / Tag:
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="e.g. High Yield"
                className="w-full bg-stone-100 dark:bg-[#140e0a] px-3 py-2 rounded-xl border border-stone-200 dark:border-[#382518] text-xs outline-none focus:border-amber-500 transition-colors"
              />
            </div>
          </div>

          {/* Subtitle / Description */}
          <div>
            <label className="block font-semibold mb-1 text-stone-700 dark:text-[#d8c7b0]">
              Module Summary & Subtitle:
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g. ANS, CVS, CNS, Endocrine & Autacoid therapeutics"
              className="w-full bg-stone-100 dark:bg-[#140e0a] px-3 py-2 rounded-xl border border-stone-200 dark:border-[#382518] text-xs outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          {/* Slab Size & Layout Dimension */}
          <div>
            <label className="block font-semibold mb-1.5 text-stone-700 dark:text-[#d8c7b0]">
              Tile Dimension & Size:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: 'compact', label: 'Compact Pill', desc: 'Minimal strip' },
                  { id: 'normal', label: 'Standard Slab', desc: 'Balanced card' },
                  { id: 'expanded', label: 'Expanded Deck', desc: 'With notes & attachment' },
                ] as const
              ).map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSize(s.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    size === s.id
                      ? 'bg-amber-500/10 border-[#8f5f2c] text-[#5c351c] dark:text-amber-300 shadow-xs'
                      : 'bg-stone-100/70 dark:bg-[#1e140e] border-stone-200/80 dark:border-[#382518] text-stone-600 dark:text-[#b89f85] hover:border-stone-400'
                  }`}
                >
                  <span className="block font-bold text-xs">{s.label}</span>
                  <span className="text-[10px] opacity-75">{s.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sober Color Accent Swatches */}
          <div>
            <label className="block font-semibold mb-1.5 text-stone-700 dark:text-[#d8c7b0]">
              Sober Eye-Comfort Accent Tint:
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {SOBER_ACCENT_COLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setAccentColor(c.id)}
                  className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                    accentColor === c.id
                      ? 'border-[#8f5f2c] bg-amber-500/10 shadow-xs'
                      : 'border-stone-200/80 dark:border-[#382518] bg-stone-100/50 dark:bg-[#1e140e] hover:bg-stone-200/60 dark:hover:bg-[#2b1d14]'
                  }`}
                >
                  <div
                    className="w-5 h-5 rounded-full border border-black/10 shadow-2xs"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span className="text-[10px] font-mono leading-none">{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* File Attachment Option */}
          <div className="p-3.5 rounded-xl bg-stone-100/70 dark:bg-[#1e140e] border border-stone-200/80 dark:border-[#382518] space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Paperclip className="w-3.5 h-3.5 text-stone-500" />
                <span className="font-semibold text-xs">Attached Study Document / PDF:</span>
              </div>
              {fileName && (
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="text-[11px] text-[#7f1d1d] dark:text-[#b0363b] hover:underline flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  <span>Remove File</span>
                </button>
              )}
            </div>

            {fileName ? (
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-[#261a12] border border-stone-200 dark:border-[#3d291c]">
                <div className="flex items-center gap-2 truncate">
                  <FileText className="w-4 h-4 text-[#8f5f2c] dark:text-amber-400 shrink-0" />
                  <div className="truncate">
                    <p className="font-semibold text-xs truncate">{fileName}</p>
                    <p className="text-[10px] text-stone-400 font-mono">{fileSize || 'PDF Document'}</p>
                  </div>
                </div>
                {fileUrl && (
                  <a
                    href={fileUrl}
                    download={fileName}
                    className="px-2 py-1 rounded bg-stone-100 dark:bg-[#312218] hover:bg-stone-200 text-stone-700 dark:text-[#efe4d4] text-[11px] font-medium flex items-center gap-1 shrink-0"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Download</span>
                  </a>
                )}
              </div>
            ) : (
              <label className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-dashed border-stone-300 dark:border-[#493020] hover:border-amber-600 bg-white/40 dark:bg-white/5 cursor-pointer transition-colors text-stone-600 dark:text-[#d8c7b0]">
                <Upload className="w-4 h-4 text-[#8f5f2c] dark:text-amber-400" />
                <span className="font-medium text-xs">Attach PDF, Lecture Slides or Lab Syllabus</span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Quick Notes & High-Yield Pearls */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-stone-700 dark:text-[#d8c7b0]">
                Custom High-Yield Study Notes:
              </label>
              {onAskGeminiAboutSlab && (
                <button
                  type="button"
                  onClick={() => onAskGeminiAboutSlab(title)}
                  className="text-[11px] font-semibold text-[#8f5f2c] dark:text-amber-400 hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Ask Gemini for Study Pearls</span>
                </button>
              )}
            </div>
            <textarea
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="Add key formulas, clinical trials, landmark guidelines, or reminders for this module..."
              rows={3}
              className="w-full bg-stone-100 dark:bg-[#140e0a] p-3 rounded-xl border border-stone-200 dark:border-[#382518] text-xs outline-none focus:border-amber-500 transition-colors custom-scrollbar"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-stone-200/80 dark:border-[#352317]">
            {onDeleteSlab ? (
              <button
                type="button"
                onClick={() => {
                  onDeleteSlab(slab.id);
                  onClose();
                }}
                className="px-3 py-1.5 rounded-xl text-[#7f1d1d] dark:text-[#b0363b] hover:bg-[#7f1d1d]/10 dark:hover:bg-[#6e171b]/25 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Slab</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-200/50 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-[#8f5f2c] hover:bg-[#754b20] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
