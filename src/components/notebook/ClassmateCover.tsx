import React from 'react';
import { Notebook } from '../../types';
import {
  deriveConciseTitle,
  getThumbnailFont,
  getThumbnailIconItem,
} from '../../data/thumbnailMeta';

interface ClassmateCoverProps {
  notebook: Notebook;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
  isSelected?: boolean;
}

export const ClassmateCover: React.FC<ClassmateCoverProps> = ({
  notebook,
  size = 'sm',
  onClick,
  isSelected = false,
}) => {
  const widthClasses = {
    xs: 'w-20 h-28',
    sm: 'w-24 h-32',
    md: 'w-36 h-48',
    lg: 'w-48 h-64',
  }[size];

  const spineWidth = size === 'xs' || size === 'sm' ? 'w-4' : 'w-6';
  const ringCount = size === 'xs' || size === 'sm' ? 8 : 12;

  // Visual cover art rendering based on theme
  const renderCoverArtwork = () => {
    switch (notebook.coverTheme) {
      case 'astronomy':
        return (
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-950 overflow-hidden">
            {/* Stars and Galaxy glow */}
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-fuchsia-600/30 blur-xl" />
            <div className="absolute bottom-4 right-4 w-28 h-28 rounded-full bg-indigo-500/30 blur-xl" />
            {/* Star speckles */}
            <svg className="absolute inset-0 w-full h-full opacity-60" xmlns="http://www.w3.org/2000/svg">
              <circle cx="15%" cy="20%" r="1" fill="#fff" />
              <circle cx="45%" cy="12%" r="0.8" fill="#fff" opacity="0.8" />
              <circle cx="78%" cy="25%" r="1.5" fill="#fff" />
              <circle cx="28%" cy="55%" r="1" fill="#fff" />
              <circle cx="85%" cy="65%" r="0.8" fill="#fff" opacity="0.7" />
              <circle cx="62%" cy="82%" r="1.2" fill="#fff" />
            </svg>
          </div>
        );

      case 'wildlife':
        return (
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900 via-emerald-950 to-stone-950 overflow-hidden">
            <div className="absolute -top-6 left-6 w-32 h-32 rounded-full bg-emerald-500/20 blur-xl" />
            <div className="absolute bottom-2 -right-6 w-32 h-32 rounded-full bg-teal-600/25 blur-xl" />
            {/* Mountain graphic */}
            <svg className="absolute bottom-0 inset-x-0 w-full h-24 opacity-40" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polygon points="0,100 25,45 50,85 75,30 100,100" fill="#064e3b" />
              <polygon points="15,100 45,55 70,90 90,40 100,100" fill="#022c22" opacity="0.6" />
            </svg>
          </div>
        );

      case 'anatomy':
        return (
          <div className="absolute inset-0 bg-gradient-to-br from-amber-950 via-amber-900 to-stone-900 overflow-hidden">
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fde68a_1px,transparent_1px)] [background-size:12px_12px]" />
            <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 200 300">
              <circle cx="100" cy="90" r="45" stroke="#fef3c7" strokeWidth="1" fill="none" />
              <line x1="30" y1="90" x2="170" y2="90" stroke="#fef3c7" strokeWidth="0.8" />
              <rect x="55" y="45" width="90" height="90" stroke="#fef3c7" strokeWidth="0.8" fill="none" />
            </svg>
          </div>
        );

      case 'geometric':
        return (
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-950 via-teal-900 to-emerald-950 overflow-hidden">
            <svg className="absolute inset-0 w-full h-full opacity-45" viewBox="0 0 100 140" preserveAspectRatio="none">
              <polygon points="10,20 60,10 40,70" fill="#2dd4bf" opacity="0.4" />
              <polygon points="60,10 90,40 40,70" fill="#0d9488" opacity="0.6" />
              <polygon points="40,70 80,100 20,110" fill="#0f766e" opacity="0.7" />
            </svg>
          </div>
        );

      case 'dna':
        return (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-indigo-900 to-slate-950 overflow-hidden">
            <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 100 140">
              <path d="M 30,10 Q 50,35 70,60 T 30,110" stroke="#38bdf8" strokeWidth="2" fill="none" />
              <path d="M 70,10 Q 50,35 30,60 T 70,110" stroke="#818cf8" strokeWidth="2" fill="none" />
              <line x1="38" y1="20" x2="62" y2="20" stroke="#bae6fd" strokeWidth="1.5" />
              <line x1="45" y1="35" x2="55" y2="35" stroke="#c7d2fe" strokeWidth="1.5" />
              <line x1="33" y1="50" x2="67" y2="50" stroke="#bae6fd" strokeWidth="1.5" />
            </svg>
          </div>
        );

      default:
        return (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundColor: notebook.coverColor || '#1e293b',
              backgroundImage: notebook.coverCustomUrl ? `url(${notebook.coverCustomUrl})` : undefined,
            }}
          />
        );
    }
  };

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      className={`group relative ${widthClasses} shrink-0 cursor-pointer rounded-r-lg rounded-l-xs shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-xl overflow-hidden select-none border-t border-r border-b border-white/20 ${
        isSelected ? 'ring-2 ring-sky-500 shadow-sky-500/30' : ''
      }`}
      style={{
        boxShadow: '2px 4px 12px rgba(0, 0, 0, 0.4), inset -1px 0 4px rgba(0, 0, 0, 0.25)',
      }}
    >
      {/* Background artwork */}
      {renderCoverArtwork()}

      {/* Classmate-Style Spiral Wire Spine on Left */}
      <div className={`absolute left-0 top-0 bottom-0 ${spineWidth} bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900/60 z-20 flex flex-col justify-around py-1.5 border-r border-slate-700/60 shadow-xs`}>
        {Array.from({ length: ringCount }).map((_, idx) => (
          <div key={idx} className="flex items-center -ml-0.5">
            <div className="w-2.5 h-1.5 rounded-full bg-slate-300 border border-slate-400 shadow-inner -rotate-12" />
            <div className="w-1 h-1 rounded-full bg-slate-950 ml-0.5" />
          </div>
        ))}
      </div>

      {/* Centered Minimalist Cover Plaque: Custom Logo / Icon / A-Z Font Monogram */}
      {(() => {
        const thumb = notebook.thumbnail;
        const thumbFont = thumb ? getThumbnailFont(thumb.fontId) : null;
        const thumbIcon = thumb?.kind === 'icon' ? getThumbnailIconItem(thumb.iconName) : null;
        const ThumbIcon = thumbIcon?.Icon;
        const showConcise = thumb?.displayMode === 'concise';
        const labelText = showConcise
          ? (thumb?.conciseTitle || '').trim() || deriveConciseTitle(notebook.title)
          : notebook.subject;

        return (
          <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 z-10 flex flex-col items-center justify-center text-center pointer-events-none">
            <div
              className="w-full py-1.5 px-1 rounded-md backdrop-blur-md border border-white/15 shadow-md flex flex-col items-center"
              style={{
                backgroundColor: thumb?.bgColor ? `${thumb.bgColor}d8` : 'rgba(2, 6, 23, 0.75)',
              }}
            >
              {thumb ? (
                <div className="flex items-center justify-center mb-1">
                  {thumb.kind === 'icon' && ThumbIcon ? (
                    <ThumbIcon
                      className={thumb.displayMode === 'logo-only' ? 'w-6 h-6' : 'w-5 h-5'}
                      style={{ color: thumb.fgColor || '#FEF3C7' }}
                    />
                  ) : (
                    <span
                      data-font-sample="true"
                      style={
                        {
                          '--sample-font': thumbFont?.cssFamily || "'Cinzel', serif",
                          fontFamily: thumbFont?.cssFamily || "'Cinzel', serif",
                          color: thumb.fgColor || '#FEF3C7',
                          fontSize: size === 'xs' || size === 'sm' ? 20 : 24,
                          fontWeight: 800,
                          lineHeight: 1,
                        } as React.CSSProperties
                      }
                    >
                      {(thumb.letter || notebook.title[0] || 'N').slice(0, 1).toUpperCase()}
                    </span>
                  )}
                </div>
              ) : (
                <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-sky-400 to-indigo-500 text-white flex items-center justify-center shadow-xs mb-1">
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                    <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.73L12 15l5-2.73v3.72z" />
                  </svg>
                </div>
              )}

              {(!thumb || thumb.displayMode !== 'logo-only') && (
                <span
                  className="text-[8px] font-extrabold tracking-wider uppercase font-mono truncate max-w-[95%]"
                  style={{ color: thumb?.fgColor || '#ffffff' }}
                >
                  {labelText}
                </span>
              )}
            </div>
          </div>
        );
      })()}

      {/* Book Sheen reflection on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
    </div>
  );
};
