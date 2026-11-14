import React from 'react';

export interface AchievBrandProps {
  variant?: 'lockup' | 'compact' | 'inline' | 'emblem';
  isDarkMode?: boolean;
  showTagline?: boolean;
  className?: string;
  imgClassName?: string;
  emblemClassName?: string;
  title?: string;
}

const resolveAssetUrl = (relativePath: string): string => {
  const base = (import.meta as any).env?.BASE_URL || '/';
  const normalizedBase = base === './' ? './' : base.endsWith('/') ? base : `${base}/`;
  return `${normalizedBase}${relativePath.replace(/^\/+/, '')}`;
};

export const ACHIEV_LOGO_URL = resolveAssetUrl('assets/brand/achiev-emblem.png?v=hd6');
export const ACHIEV_EMBLEM_URL = resolveAssetUrl('assets/brand/achiev-emblem.png?v=hd6');
export const ACHIEV_WORDMARK_URL = resolveAssetUrl('assets/brand/achiev-wordmark.png?v=hd6');
export const ACHIEV_LEATHER_HERO_URL = resolveAssetUrl('assets/brand/achiev-leather-hero.jpg?v=1');
export const ACHIEV_LEATHER_LOGIN_URL = resolveAssetUrl('assets/brand/achiev-leather-login.jpg?v=1');

export const AchievBrand: React.FC<AchievBrandProps> = ({
  variant = 'compact',
  showTagline = true,
  className = '',
  imgClassName = '',
  emblemClassName = '',
  title = 'Ach1ev — Settle Ideas',
}) => {
  const emblemMaskStyle = { ['--achiev-mask' as string]: `url(${ACHIEV_EMBLEM_URL})` } as React.CSSProperties;
  const wordmarkMaskStyle = { ['--achiev-mask' as string]: `url(${ACHIEV_WORDMARK_URL})` } as React.CSSProperties;

  const EmblemWithGlare = ({ sizeClass, alt = 'Ach1ev' }: { sizeClass: string; alt?: string }) => (
    <span className="achiev-emblem-wrap" style={emblemMaskStyle}>
      <img
        src={ACHIEV_EMBLEM_URL}
        alt={alt}
        title={title}
        draggable={false}
        className={`achiev-emblem-img achiev-brand-clean bg-transparent select-none ${sizeClass}`}
      />
      <span className="achiev-masked-glare" aria-hidden="true" />
    </span>
  );

  if (variant === 'emblem') {
    return <EmblemWithGlare sizeClass={imgClassName || 'w-7 h-7'} alt="Ach1ev" />;
  }

  if (variant === 'lockup') {
    return (
      <div
        className={`inline-flex items-center justify-center gap-3 sm:gap-4 bg-transparent select-none max-w-full ${className}`}
        title={title}
      >
        <EmblemWithGlare
          sizeClass={emblemClassName || 'w-14 h-14 sm:w-[70px] sm:h-[70px] shrink-0'}
          alt="Ach1ev emblem"
        />
        <span className="relative inline-block max-w-full" style={wordmarkMaskStyle}>
          <img
            src={ACHIEV_WORDMARK_URL}
            alt="Ach1ev — Settle Ideas"
            draggable={false}
            className={`bg-transparent select-none object-contain max-w-full achiev-brand-clean ${imgClassName || 'h-12 sm:h-[58px] w-auto'}`}
          />
          <span className="achiev-masked-glare" aria-hidden="true" />
        </span>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`inline-flex items-center gap-2 bg-transparent select-none ${className}`} title={title}>
        <EmblemWithGlare sizeClass={imgClassName || 'w-6 h-6'} alt="" />
        <span className="relative inline-block" style={wordmarkMaskStyle}>
          <img
            src={ACHIEV_WORDMARK_URL}
            alt={showTagline ? 'Ach1ev — Settle Ideas' : 'Ach1ev'}
            draggable={false}
            className="h-5 sm:h-6 w-auto object-contain select-none achiev-brand-clean"
          />
          <span className="achiev-masked-glare" aria-hidden="true" />
        </span>
      </div>
    );
  }

  // 'compact' sidebar header: extracted Champagne Gold emblem + extracted ACH1EV / SETTLE IDEAS wordmark
  return (
    <div className={`flex items-center gap-1.5 bg-transparent select-none min-w-0 w-full overflow-visible py-0.5 ${className}`} title={title}>
      <EmblemWithGlare sizeClass={imgClassName || 'w-[38px] h-[38px] shrink-0'} alt="Ach1ev emblem" />
      <div className="min-w-0 flex-1 flex items-center justify-start overflow-visible">
        <span className="relative inline-block max-w-full" style={wordmarkMaskStyle}>
          <img
            src={ACHIEV_WORDMARK_URL}
            alt="Ach1ev — Settle Ideas"
            draggable={false}
            className="h-[30px] max-w-full w-auto object-contain select-none achiev-brand-clean"
          />
          <span className="achiev-masked-glare" aria-hidden="true" />
        </span>
      </div>
    </div>
  );
};
