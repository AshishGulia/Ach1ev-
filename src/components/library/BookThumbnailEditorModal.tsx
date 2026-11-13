import React, { useEffect, useMemo, useState } from 'react';
import { Check, Palette, Search, Sparkles, Type, X } from 'lucide-react';
import type { BookThumbnailConfig } from '../../types';
import {
  ALPHABET_LIST,
  deriveConciseTitle,
  getDefaultThumbnail,
  getThumbnailFont,
  getThumbnailIconItem,
  THUMBNAIL_COOL_ICONS,
  THUMBNAIL_DESIGNER_FONTS,
} from '../../data/thumbnailMeta';
import { RoundColorColumnsPicker, UNIFIED_COLOR_COLUMNS } from '../common/RoundColorColumnsPicker';

interface BookThumbnailEditorModalProps {
  isOpen: boolean;
  itemTitle: string;
  initialConfig?: BookThumbnailConfig;
  defaultBgHex?: string;
  onClose: () => void;
  onSave: (config: BookThumbnailConfig) => void;
}

export const BookThumbnailEditorModal: React.FC<BookThumbnailEditorModalProps> = ({
  isOpen,
  itemTitle,
  initialConfig,
  defaultBgHex = '#5C351C',
  onClose,
  onSave,
}) => {
  const [config, setConfig] = useState<BookThumbnailConfig>(() => ({
    ...getDefaultThumbnail(itemTitle, defaultBgHex),
    ...initialConfig,
  }));
  const [iconQuery, setIconQuery] = useState('');
  const [colorTarget, setColorTarget] = useState<'fg' | 'bg'>('fg');

  useEffect(() => {
    if (isOpen) {
      setConfig({
        ...getDefaultThumbnail(itemTitle, defaultBgHex),
        ...initialConfig,
      });
      setIconQuery('');
    }
  }, [isOpen, itemTitle, defaultBgHex, initialConfig]);

  const filteredIcons = useMemo(() => {
    const q = iconQuery.trim().toLowerCase();
    if (!q) return THUMBNAIL_COOL_ICONS;
    return THUMBNAIL_COOL_ICONS.filter(
      (i) => i.label.toLowerCase().includes(q) || i.category.toLowerCase().includes(q) || i.name.toLowerCase().includes(q)
    );
  }, [iconQuery]);

  if (!isOpen) return null;

  const activeFont = getThumbnailFont(config.fontId);
  const activeIconItem = getThumbnailIconItem(config.iconName);
  const ActiveIcon = activeIconItem.Icon;
  const fgColor = config.fgColor || '#FEF3C7';
  const bgColor = config.bgColor || defaultBgHex;
  const currentSwatchHex = colorTarget === 'fg' ? fgColor : bgColor;

  const applySwatchColor = (hex: string) => {
    setConfig((prev) =>
      colorTarget === 'fg' ? { ...prev, fgColor: hex } : { ...prev, bgColor: hex }
    );
  };

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl max-h-[92vh] bg-[#fbf9f5] dark:bg-[#18110c] border border-stone-300 dark:border-[#3b271a] rounded-2xl shadow-2xl overflow-hidden flex flex-col text-stone-900 dark:text-[#efe4d4]"
      >
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-stone-200 dark:border-[#352317] bg-stone-100/80 dark:bg-[#140e0a] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-amber-600/20 text-amber-800 dark:text-amber-300 flex items-center justify-center shrink-0">
              <Palette className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold truncate">Edit Book / Note Cover Thumbnail</h3>
              <p className="text-[11px] text-stone-500 dark:text-[#a69079] truncate">
                {itemTitle || 'Selected Volume'} · Choose A–Z Alphabet or 100 Icons, Designer Fonts &amp; Color Columns
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 dark:hover:text-[#efe4d4] hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 grid grid-cols-1 md:grid-cols-12 gap-5 custom-scrollbar">
          {/* Left Column: Live Shelf Preview + Display Mode + MS Word Color Columns */}
          <div className="md:col-span-5 space-y-4">
            {/* Live Cover Preview */}
            <div className="p-4 rounded-xl border border-stone-200 dark:border-[#352317] bg-stone-100/70 dark:bg-[#120c08] flex flex-col items-center gap-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500 dark:text-[#a69079]">
                Shelf &amp; Library Preview
              </span>

              <div
                style={{
                  width: 96,
                  height: 132,
                  borderRadius: '3px 8px 8px 3px',
                  background: `linear-gradient(145deg, ${bgColor} 0%, rgba(0,0,0,0.34) 100%)`,
                  backgroundColor: bgColor,
                  borderLeft: '7px solid rgba(0,0,0,0.42)',
                  boxShadow:
                    '6px 10px 18px rgba(0,0,0,0.45), inset -3px 0 0 rgba(255,255,255,0.34), inset 0 1px 0 rgba(255,255,255,0.22)',
                  padding: '10px 8px 9px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: '5px 5px 5px 9px',
                    border: '1px solid rgba(254, 240, 138, 0.34)',
                    borderRadius: 2,
                    pointerEvents: 'none',
                  }}
                />
                <div className="w-full flex items-center justify-center flex-1 min-h-0">
                  {config.kind === 'icon' ? (
                    <ActiveIcon
                      className={config.displayMode === 'logo-only' ? 'w-11 h-11 drop-shadow-md' : 'w-8 h-8 drop-shadow-sm'}
                      style={{ color: fgColor }}
                    />
                  ) : (
                    <span
                      data-font-sample="true"
                      style={
                        {
                          '--sample-font': activeFont.cssFamily,
                          fontFamily: activeFont.cssFamily,
                          color: fgColor,
                        fontSize: config.displayMode === 'logo-only' ? 42 : 30,
                        fontWeight: 800,
                          lineHeight: 1,
                          textShadow: '0 2px 4px rgba(0,0,0,0.45)',
                        } as React.CSSProperties
                      }
                    >
                      {(config.letter || 'B').slice(0, 1).toUpperCase()}
                    </span>
                  )}
                </div>

                {config.displayMode === 'concise' && (
                  <span
                    style={{
                      color: fgColor,
                      fontSize: 10,
                      fontWeight: 700,
                      textAlign: 'center',
                      lineHeight: 1.15,
                      textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                    }}
                    className="line-clamp-2 w-full"
                  >
                    {(config.conciseTitle || '').trim() || deriveConciseTitle(itemTitle)}
                  </span>
                )}

                <div
                  style={{
                    height: 2,
                    width: '68%',
                    background: 'rgba(254, 240, 138, 0.55)',
                    borderRadius: 1,
                    marginTop: 4,
                  }}
                />
              </div>

              {/* Shelf Display Mode Selector: Logo Only vs Concise Name */}
              <div className="w-full space-y-1.5">
                <label className="text-[10.5px] font-bold uppercase tracking-wider text-stone-600 dark:text-[#d8c7b0] block">
                  Shelf Appearance Mode
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setConfig((p) => ({ ...p, displayMode: 'logo-only' }))}
                    className={`px-2.5 py-2 rounded-xl border text-[11px] font-semibold transition cursor-pointer ${
                      config.displayMode === 'logo-only'
                        ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 border-amber-500 shadow-xs'
                        : 'bg-white dark:bg-[#1a120d] border-stone-200 dark:border-[#382518] text-stone-700 dark:text-[#d8c7b0]'
                    }`}
                  >
                    Logo Only (Quick View)
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfig((p) => ({ ...p, displayMode: 'concise' }))}
                    className={`px-2.5 py-2 rounded-xl border text-[11px] font-semibold transition cursor-pointer ${
                      config.displayMode === 'concise'
                        ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 border-amber-500 shadow-xs'
                        : 'bg-white dark:bg-[#1a120d] border-stone-200 dark:border-[#382518] text-stone-700 dark:text-[#d8c7b0]'
                    }`}
                  >
                    Concise Name
                  </button>
                </div>

                {config.displayMode === 'concise' && (
                  <div className="pt-1">
                    <input
                      type="text"
                      maxLength={22}
                      value={config.conciseTitle ?? ''}
                      onChange={(e) => setConfig((p) => ({ ...p, conciseTitle: e.target.value }))}
                      placeholder={deriveConciseTitle(itemTitle)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 dark:border-[#382518] bg-white dark:bg-[#140e0a] text-xs outline-none focus:border-amber-500"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Round Color Columns Picker (Applies to Logo Ink OR Cover Surface) */}
            <div className="p-3.5 rounded-xl border border-stone-200 dark:border-[#352317] bg-white dark:bg-[#140e0a] space-y-2.5">
              <div className="flex items-center justify-between gap-1.5">
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-stone-600 dark:text-[#d8c7b0]">
                  Choose Colour
                </span>
                <div className="flex rounded-lg p-0.5 bg-stone-100 dark:bg-[#221710] border border-stone-200 dark:border-[#382518] text-[10px]">
                  <button
                    type="button"
                    onClick={() => setColorTarget('fg')}
                    className={`px-2 py-0.5 rounded-md font-semibold cursor-pointer transition ${
                      colorTarget === 'fg'
                        ? 'bg-amber-600 text-white shadow-2xs'
                        : 'text-stone-600 dark:text-[#b6a28d]'
                    }`}
                  >
                    Logo Ink
                  </button>
                  <button
                    type="button"
                    onClick={() => setColorTarget('bg')}
                    className={`px-2 py-0.5 rounded-md font-semibold cursor-pointer transition ${
                      colorTarget === 'bg'
                        ? 'bg-amber-600 text-white shadow-2xs'
                        : 'text-stone-600 dark:text-[#b6a28d]'
                    }`}
                  >
                    Cover Tint
                  </button>
                </div>
              </div>

              <RoundColorColumnsPicker
                columns={UNIFIED_COLOR_COLUMNS}
                selectedColor={currentSwatchHex}
                onSelectColor={applySwatchColor}
                showStandardRow
                swatchSizeClass="w-5 h-5"
              />
            </div>
          </div>

          {/* Right Column: A-Z Alphabets + 10 Designer Fonts OR Icons (100 Cool Icons) */}
          <div className="md:col-span-7 flex flex-col gap-3">
            {/* Kind Switcher Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setConfig((p) => ({ ...p, kind: 'letter' }))}
                className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                  config.kind === 'letter'
                    ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 border-amber-500 shadow-sm'
                    : 'bg-white dark:bg-[#140e0a] border-stone-200 dark:border-[#382518] text-stone-700 dark:text-[#d8c7b0]'
                }`}
              >
                <Type className="w-4 h-4" />
                <span>A – Z Alphabets &amp; 10 Fonts</span>
              </button>

              <button
                type="button"
                onClick={() => setConfig((p) => ({ ...p, kind: 'icon' }))}
                className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                  config.kind === 'icon'
                    ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 border-amber-500 shadow-sm'
                    : 'bg-white dark:bg-[#140e0a] border-stone-200 dark:border-[#382518] text-stone-700 dark:text-[#d8c7b0]'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Icons (100 Cool Icons)</span>
              </button>
            </div>

            {config.kind === 'letter' ? (
              <div className="space-y-3.5">
                {/* A to Z Alphabet Grid */}
                <div className="p-3 rounded-xl border border-stone-200 dark:border-[#352317] bg-white dark:bg-[#140e0a]">
                  <span className="text-[10.5px] font-bold uppercase tracking-wider text-stone-600 dark:text-[#d8c7b0] block mb-2">
                    Select Monogram Letter (A – Z)
                  </span>
                  <div className="grid grid-cols-9 gap-1.5">
                    {ALPHABET_LIST.map((ch) => {
                      const active = (config.letter || 'B').toUpperCase() === ch;
                      return (
                        <button
                          key={ch}
                          type="button"
                          data-font-sample="true"
                          onClick={() => setConfig((p) => ({ ...p, kind: 'letter', letter: ch }))}
                          className={`h-8 rounded-lg border text-sm font-bold transition cursor-pointer ${
                            active
                              ? 'bg-amber-600 text-white border-amber-400 shadow-sm scale-105'
                              : 'bg-stone-50 dark:bg-[#1c140e] border-stone-200 dark:border-[#352317] hover:border-amber-500'
                          }`}
                          style={
                            {
                              '--sample-font': activeFont.cssFamily,
                              fontFamily: activeFont.cssFamily,
                            } as React.CSSProperties
                          }
                        >
                          {ch}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 10 Designer Font Styles */}
                <div className="p-3 rounded-xl border border-stone-200 dark:border-[#352317] bg-white dark:bg-[#140e0a]">
                  <span className="text-[10.5px] font-bold uppercase tracking-wider text-stone-600 dark:text-[#d8c7b0] block mb-2">
                    10 Designer Typography Styles
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                    {THUMBNAIL_DESIGNER_FONTS.map((f) => {
                      const active = (config.fontId || 'cinzel') === f.id;
                      return (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => setConfig((p) => ({ ...p, fontId: f.id }))}
                          className={`flex items-center justify-between gap-2 p-2 rounded-xl border text-left transition cursor-pointer ${
                            active
                              ? 'border-amber-500 bg-amber-500/12 ring-1 ring-amber-500/40'
                              : 'border-stone-200 dark:border-[#352317] hover:bg-stone-50 dark:hover:bg-[#1f160f]'
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="text-xs font-bold truncate">{f.name}</div>
                            <div className="text-[9.5px] font-mono text-stone-500 dark:text-[#a69079]">
                              {f.styleTag}
                            </div>
                          </div>
                          <span
                            data-font-sample="true"
                            className="text-xl font-bold px-2 shrink-0"
                            style={
                              {
                                '--sample-font': f.cssFamily,
                                fontFamily: f.cssFamily,
                              } as React.CSSProperties
                            }
                          >
                            {config.letter || 'A'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              /* 100 Cool Icons Browser */
              <div className="p-3 rounded-xl border border-stone-200 dark:border-[#352317] bg-white dark:bg-[#140e0a] flex flex-col gap-2.5 flex-1">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-[10.5px] font-bold uppercase tracking-wider text-stone-600 dark:text-[#d8c7b0]">
                    100 Curated Cool Icons ({filteredIcons.length})
                  </span>
                  <div className="relative flex-1 max-w-[210px]">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-stone-400" />
                    <input
                      type="text"
                      value={iconQuery}
                      onChange={(e) => setIconQuery(e.target.value)}
                      placeholder="Search heart, brain, moon..."
                      className="w-full pl-8 pr-2.5 py-1 rounded-lg border border-stone-200 dark:border-[#382518] bg-stone-50 dark:bg-[#120c08] text-[11px] outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-5 sm:grid-cols-8 gap-1.5 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                  {filteredIcons.map((item) => {
                    const IconC = item.Icon;
                    const active = config.iconName === item.name;
                    return (
                      <button
                        key={item.name}
                        type="button"
                        title={`${item.label} (${item.category})`}
                        onClick={() => setConfig((p) => ({ ...p, kind: 'icon', iconName: item.name }))}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl border transition cursor-pointer ${
                          active
                            ? 'bg-amber-600 text-white border-amber-400 shadow-sm scale-105'
                            : 'bg-stone-50 dark:bg-[#1c140e] border-stone-200 dark:border-[#352317] hover:border-amber-500 text-stone-700 dark:text-[#e6d7c1]'
                        }`}
                      >
                        <IconC
                          className="w-4 h-4"
                          style={active ? undefined : { color: fgColor }}
                        />
                        <span className="text-[8.5px] mt-1 truncate max-w-full opacity-80">
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-stone-200 dark:border-[#352317] bg-stone-50 dark:bg-[#140e0a] flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setConfig(getDefaultThumbnail(itemTitle, defaultBgHex))}
            className="text-xs font-medium text-stone-500 hover:text-stone-900 dark:text-[#a69079] dark:hover:text-[#efe4d4] cursor-pointer"
          >
            Reset to Default
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl border border-stone-300 dark:border-[#382518] text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onSave(config);
                onClose();
              }}
              className="px-4 py-1.5 rounded-xl bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer hover:opacity-90"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Thumbnail</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
