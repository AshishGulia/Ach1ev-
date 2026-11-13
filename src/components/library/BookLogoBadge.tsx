import React from 'react';
import type { BookThumbnailConfig } from '../../types';
import {
  deriveConciseTitle,
  getDefaultThumbnail,
  getThumbnailFont,
  getThumbnailIconItem,
} from '../../data/thumbnailMeta';

interface BookLogoBadgeProps {
  title: string;
  thumbnail?: BookThumbnailConfig;
  fallbackBg?: string;
  fallbackInk?: string;
  compact?: boolean;
  /** On Shelf rows, show only visual monogram/icon in 'logo-only' mode or visual + short concise title in 'concise' mode */
  shelfMode?: boolean;
}

export const BookLogoBadge: React.FC<BookLogoBadgeProps> = ({
  title,
  thumbnail,
  fallbackBg = '#5C351C',
  fallbackInk = '#FEF3C7',
  compact = false,
  shelfMode = false,
}) => {
  const resolved: BookThumbnailConfig = thumbnail
    ? { ...getDefaultThumbnail(title, fallbackBg), ...thumbnail }
    : getDefaultThumbnail(title, fallbackBg);

  const font = getThumbnailFont(resolved.fontId);
  const iconItem = getThumbnailIconItem(resolved.iconName);
  const IconComp = iconItem.Icon;
  const fg = resolved.fgColor || fallbackInk;
  const displayMode = resolved.displayMode || 'logo-only';
  const conciseLabel = (resolved.conciseTitle || '').trim() || deriveConciseTitle(title);

  if (shelfMode) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 w-full min-h-0 px-0.5 select-none">
        {resolved.kind === 'icon' ? (
          <IconComp
            className={displayMode === 'logo-only' ? 'w-9 h-9 drop-shadow-sm' : 'w-6 h-6 drop-shadow-xs'}
            style={{ color: fg }}
          />
        ) : (
          <span
            data-font-sample="true"
            style={
              {
                '--sample-font': font.cssFamily,
                fontFamily: font.cssFamily,
                color: fg,
                fontSize: displayMode === 'logo-only' ? 32 : 22,
                lineHeight: 1,
                fontWeight: 800,
                textShadow: '0 1.5px 3px rgba(0,0,0,0.42)',
              } as React.CSSProperties
            }
          >
            {(resolved.letter || title[0] || 'B').slice(0, 1).toUpperCase()}
          </span>
        )}

        {displayMode === 'concise' && (
          <span
            style={{
              color: fg,
              fontSize: 9,
              fontWeight: 700,
              lineHeight: 1.15,
              marginTop: 5,
              textAlign: 'center',
              wordBreak: 'break-word',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textShadow: '0 1px 2px rgba(0,0,0,0.45)',
            }}
          >
            {conciseLabel}
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      className={`${
        compact ? 'w-9 h-11 rounded-md' : 'w-11 h-14 rounded-lg'
      } shrink-0 flex flex-col items-center justify-center border border-white/25 shadow-sm relative overflow-hidden select-none`}
      style={{
        background: `linear-gradient(145deg, ${resolved.bgColor || fallbackBg}, rgba(0,0,0,0.28))`,
        backgroundColor: resolved.bgColor || fallbackBg,
        borderLeft: '3.5px solid rgba(0,0,0,0.35)',
      }}
      title={title}
    >
      <div className="absolute inset-0.5 border border-white/15 rounded-xs pointer-events-none" />
      {resolved.kind === 'icon' ? (
        <IconComp className={compact ? 'w-4 h-4' : 'w-5 h-5'} style={{ color: fg }} />
      ) : (
        <span
          data-font-sample="true"
          style={
            {
              '--sample-font': font.cssFamily,
              fontFamily: font.cssFamily,
              color: fg,
              fontSize: compact ? 16 : 21,
              lineHeight: 1,
              fontWeight: 800,
            } as React.CSSProperties
          }
        >
          {(resolved.letter || title[0] || 'B').slice(0, 1).toUpperCase()}
        </span>
      )}
    </div>
  );
};
