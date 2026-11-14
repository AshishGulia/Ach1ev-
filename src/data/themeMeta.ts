import { DesignId } from '../types';

export type ThemeId = DesignId;

const svgUri = (svg: string): string => `url("data:image/svg+xml,${encodeURIComponent(svg.trim())}")`;

const resolvePublicAsset = (relativePath: string): string => {
  const base =
    typeof import.meta !== 'undefined' && (import.meta as any).env?.BASE_URL
      ? (import.meta as any).env.BASE_URL
      : '/';
  const normalizedBase = base === './' ? './' : base.endsWith('/') ? base : `${base}/`;
  return `url("${normalizedBase}${relativePath.replace(/^\/+/, '')}")`;
};

export const THEME_ONE_MARBLE_URI = resolvePublicAsset('assets/themes/marble-gold-light.jpg?v=1');

/** Whitish-cream Calacatta marble with subtle warm gold veins — SVG fallback */
export const CALACATTA_MARBLE_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="520" height="520" viewBox="0 0 520 520">
  <defs>
    <radialGradient id="cmSoft" cx="35%" cy="30%" r="75%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.55"/>
      <stop offset="60%" stop-color="#f7efe2" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#ebd9bd" stop-opacity="0.2"/>
    </radialGradient>
  </defs>
  <rect width="520" height="520" fill="url(#cmSoft)"/>
  <path d="M-25 82 C90 118 190 42 308 82 C402 114 460 56 545 92" stroke="#c89e4b" stroke-width="1.45" fill="none" opacity="0.26"/>
  <path d="M35 -18 C126 104 232 184 330 286 C398 358 446 420 530 525" stroke="#d5b166" stroke-width="1.2" fill="none" opacity="0.22"/>
  <path d="M-18 342 C96 296 196 355 304 312 C406 272 460 320 538 282" stroke="#b98a35" stroke-width="1.05" fill="none" opacity="0.21"/>
  <path d="M188 532 C226 422 290 374 378 220 C425 136 472 82 516 -14" stroke="#dac084" stroke-width="0.9" fill="none" opacity="0.22"/>
  <path d="M16 198 C108 226 164 176 248 202 C310 222 365 186 438 198" stroke="#c49d52" stroke-width="0.75" fill="none" opacity="0.18"/>
  <path d="M72 436 C168 416 250 452 340 422 C412 398 464 426 518 408" stroke="#ceb072" stroke-width="0.8" fill="none" opacity="0.18"/>
</svg>`;

export const CALACATTA_MARBLE_DATA_URI = svgUri(CALACATTA_MARBLE_SVG);

export interface ThemeMeta {
  id: ThemeId;
  name: string;
  tagline: string;
  lightBg: string;
  lightSurface: string;
  lightRaised: string;
  lightHeader: string;
  lightBorder: string;
  lightInk: string;
  lightMuted: string;
  lightAccent: string;
  lightAccentSoft: string;
  darkBg: string;
  darkSurface: string;
  darkRaised: string;
  darkHeader: string;
  darkBorder: string;
  darkInk: string;
  darkMuted: string;
  darkAccent: string;
  darkAccentSoft: string;
  // Sober button shape descriptor
  shapeName: string;
  buttonRadius: string;
  // Light & Dark non-repetitive organic abstract SVGs (Theme 1 = none so Theme 1 stays pure study)
  lightWallpaperUri?: string;
  darkWallpaperUri?: string;
  // Sidebar theming (light & dark)
  sidebar: {
    light: {
      railBg: string;
      railBorder: string;
      railText: string;
      brandSectionBg: string;
      navSectionBg: string;
      thoughtSectionBg: string;
      footerSectionBg: string;
      sectionBorder: string;
      activeBtnBg: string;
      activeBtnBorder: string;
      activeBtnText: string;
      idleBtnBg: string;
      idleBtnText: string;
      activeIconColor: string;
      idleIconColor: string;
      toggleBtnBg: string;
      toggleBtnText: string;
      toggleBtnBorder: string;
      mutedLabelColor: string;
      thoughtColor: string;
      authorColor: string;
      trashTextColor: string;
      trashIconColor: string;
    };
    dark: {
      railBg: string;
      railBorder: string;
      railText: string;
      brandSectionBg: string;
      navSectionBg: string;
      thoughtSectionBg: string;
      footerSectionBg: string;
      sectionBorder: string;
      activeBtnBg: string;
      activeBtnBorder: string;
      activeBtnText: string;
      idleBtnBg: string;
      idleBtnText: string;
      activeIconColor: string;
      idleIconColor: string;
      toggleBtnBg: string;
      toggleBtnText: string;
      toggleBtnBorder: string;
      mutedLabelColor: string;
      thoughtColor: string;
      authorColor: string;
      trashTextColor: string;
      trashIconColor: string;
    };
  };
}

/* Sober, crisp, architectural non-repetitive abstract compositions for Themes 1–5 (Light & Dark) */
const espressoDarkWall = svgUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="edBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#070301"/>
      <stop offset="50%" stop-color="#110703"/>
      <stop offset="100%" stop-color="#050201"/>
    </linearGradient>
    <radialGradient id="edGlow1" cx="18%" cy="18%" r="54%">
      <stop offset="0%" stop-color="#6b3b1a" stop-opacity="0.44"/>
      <stop offset="55%" stop-color="#2b1307" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#070301" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="edGlow2" cx="84%" cy="78%" r="50%">
      <stop offset="0%" stop-color="#8c5527" stop-opacity="0.32"/>
      <stop offset="100%" stop-color="#070301" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="edArc" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#2b1408" stop-opacity="0.72"/>
      <stop offset="50%" stop-color="#4e2611" stop-opacity="0.36"/>
      <stop offset="100%" stop-color="#b88446" stop-opacity="0.16"/>
    </linearGradient>
    <filter id="edBlur" x="-15%" y="-15%" width="130%" height="130%"><feGaussianBlur stdDeviation="24"/></filter>
  </defs>
  <rect width="1600" height="1000" fill="url(#edBg)"/>
  <rect width="1600" height="1000" fill="url(#edGlow1)"/>
  <rect width="1600" height="1000" fill="url(#edGlow2)"/>
  <path d="M-80 820 C260 560 620 740 980 460 C1280 225 1470 350 1690 160 L1690 1060 L-80 1060 Z" fill="url(#edArc)"/>
  <path d="M-60 320 C340 160 680 390 1080 180 C1340 45 1510 150 1690 30" fill="none" stroke="#c89454" stroke-width="2" opacity="0.24"/>
  <path d="M120 960 C460 720 820 830 1240 530 C1420 400 1560 440 1690 360" fill="none" stroke="#9e6d36" stroke-width="1.4" opacity="0.20"/>
  <ellipse cx="1220" cy="240" rx="340" ry="180" transform="rotate(-14 1220 240)" fill="#3b1b0b" opacity="0.45" filter="url(#edBlur)"/>
</svg>`);

const forestLightWall = svgUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="flBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#e8f2e4"/>
      <stop offset="48%" stop-color="#d7e8d1"/>
      <stop offset="100%" stop-color="#c3dcc0"/>
    </linearGradient>
    <radialGradient id="flSun" cx="78%" cy="16%" r="52%">
      <stop offset="0%" stop-color="#fffde8" stop-opacity="0.95"/>
      <stop offset="52%" stop-color="#d6eccb" stop-opacity="0.42"/>
      <stop offset="100%" stop-color="#c3dcc0" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="flRib1" x1="0%" y1="0%" x2="100%" y2="40%">
      <stop offset="0%" stop-color="#5d9668" stop-opacity="0.42"/>
      <stop offset="55%" stop-color="#3f7a4c" stop-opacity="0.30"/>
      <stop offset="100%" stop-color="#8ec191" stop-opacity="0.14"/>
    </linearGradient>
    <linearGradient id="flRib2" x1="100%" y1="0%" x2="15%" y2="100%">
      <stop offset="0%" stop-color="#aad096" stop-opacity="0.58"/>
      <stop offset="100%" stop-color="#356843" stop-opacity="0.22"/>
    </linearGradient>
    <filter id="flBlur" x="-15%" y="-15%" width="130%" height="130%"><feGaussianBlur stdDeviation="22"/></filter>
  </defs>
  <rect width="1600" height="1000" fill="url(#flBg)"/>
  <rect width="1600" height="1000" fill="url(#flSun)"/>
  <path d="M-80 280 C240 110 490 360 870 205 C1190 78 1380 260 1680 105 L1680 -60 L-80 -60 Z" fill="url(#flRib2)" filter="url(#flBlur)"/>
  <path d="M-60 720 C220 510 510 830 890 605 C1180 435 1390 620 1680 475 L1680 1080 L-60 1080 Z" fill="url(#flRib1)"/>
  <path d="M180 1040 C420 790 760 880 1060 660 C1280 498 1450 560 1660 410 L1660 1040 Z" fill="#2f663f" opacity="0.22"/>
  <path d="M-60 490 C310 350 680 540 1080 350 C1340 228 1500 320 1680 230" fill="none" stroke="#ffffff" stroke-width="2.2" opacity="0.45"/>
  <ellipse cx="260" cy="640" rx="280" ry="180" transform="rotate(-18 260 640)" fill="#78b080" opacity="0.30" filter="url(#flBlur)"/>
  <ellipse cx="1220" cy="280" rx="340" ry="150" transform="rotate(14 1220 280)" fill="#d6e9be" opacity="0.58" filter="url(#flBlur)"/>
</svg>`);

const forestDarkWall = svgUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="fdBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#020403"/>
      <stop offset="52%" stop-color="#040906"/>
      <stop offset="100%" stop-color="#010202"/>
    </linearGradient>
    <radialGradient id="fdGlow" cx="24%" cy="22%" r="52%">
      <stop offset="0%" stop-color="#1e4d2f" stop-opacity="0.46"/>
      <stop offset="100%" stop-color="#020403" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="fdWave" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0d2919" stop-opacity="0.62"/>
      <stop offset="60%" stop-color="#19442a" stop-opacity="0.34"/>
      <stop offset="100%" stop-color="#377a50" stop-opacity="0.16"/>
    </linearGradient>
    <filter id="fdBlur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="28"/></filter>
  </defs>
  <rect width="1600" height="1000" fill="url(#fdBg)"/>
  <rect width="1600" height="1000" fill="url(#fdGlow)"/>
  <path d="M-80 860 C260 600 580 790 920 515 C1210 285 1420 430 1690 215 L1690 1060 L-80 1060 Z" fill="url(#fdWave)"/>
  <path d="M420 -80 C680 180 940 90 1240 310 C1420 440 1560 360 1690 470 L1690 -80 Z" fill="#0d2617" opacity="0.58" filter="url(#fdBlur)"/>
  <path d="M-40 620 C340 460 690 610 1120 390 C1380 258 1520 330 1690 250" fill="none" stroke="#5bb37d" stroke-width="1.6" opacity="0.22"/>
  <ellipse cx="1180" cy="740" rx="360" ry="200" transform="rotate(-12 1180 740)" fill="#1a4228" opacity="0.28" filter="url(#fdBlur)"/>
</svg>`);

const beachLightWall = svgUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="blBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ddeef5"/>
      <stop offset="48%" stop-color="#f3ece0"/>
      <stop offset="100%" stop-color="#e6d4b7"/>
    </linearGradient>
    <radialGradient id="blSun" cx="80%" cy="22%" r="46%">
      <stop offset="0%" stop-color="#fff8da" stop-opacity="0.96"/>
      <stop offset="55%" stop-color="#e3f0f5" stop-opacity="0.38"/>
      <stop offset="100%" stop-color="#f3ece0" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="blSurf" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#4b9eb5" stop-opacity="0.44"/>
      <stop offset="55%" stop-color="#7bbfcf" stop-opacity="0.36"/>
      <stop offset="100%" stop-color="#c49f70" stop-opacity="0.28"/>
    </linearGradient>
    <filter id="blBlur" x="-15%" y="-15%" width="130%" height="130%"><feGaussianBlur stdDeviation="22"/></filter>
  </defs>
  <rect width="1600" height="1000" fill="url(#blBg)"/>
  <rect width="1600" height="1000" fill="url(#blSun)"/>
  <path d="M-100 540 C260 385 560 660 980 445 C1260 305 1440 460 1700 315 L1700 1060 L-100 1060 Z" fill="url(#blSurf)"/>
  <path d="M-80 760 C340 605 680 860 1120 675 C1380 568 1520 660 1700 585 L1700 1060 L-80 1060 Z" fill="#d9be94" opacity="0.54" filter="url(#blBlur)"/>
  <path d="M-40 435 C380 315 760 515 1190 365 C1420 285 1560 345 1700 290" fill="none" stroke="#ffffff" stroke-width="3" opacity="0.58"/>
  <ellipse cx="320" cy="220" rx="340" ry="170" transform="rotate(-14 320 220)" fill="#8ac6d8" opacity="0.36" filter="url(#blBlur)"/>
</svg>`);

const beachDarkWall = svgUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="bdBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#05111e"/>
      <stop offset="55%" stop-color="#0a2135"/>
      <stop offset="100%" stop-color="#040d17"/>
    </linearGradient>
    <radialGradient id="bdMoon" cx="76%" cy="20%" r="48%">
      <stop offset="0%" stop-color="#56b2d4" stop-opacity="0.52"/>
      <stop offset="100%" stop-color="#05111e" stop-opacity="0"/>
    </radialGradient>
    <filter id="bdBlur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="26"/></filter>
  </defs>
  <rect width="1600" height="1000" fill="url(#bdBg)"/>
  <rect width="1600" height="1000" fill="url(#bdMoon)"/>
  <path d="M-80 620 C280 425 640 730 1040 495 C1320 335 1480 480 1700 355 L1700 1060 L-80 1060 Z" fill="#175978" opacity="0.56"/>
  <path d="M-60 820 C360 675 760 900 1180 715 C1420 615 1560 720 1700 655 L1700 1060 L-60 1060 Z" fill="#0f3a52" opacity="0.72" filter="url(#bdBlur)"/>
  <path d="M-40 500 C360 365 760 555 1190 385 C1420 295 1560 360 1700 300" fill="none" stroke="#6ecae8" stroke-width="2" opacity="0.28"/>
  <ellipse cx="360" cy="280" rx="300" ry="160" transform="rotate(19 360 280)" fill="#2e88ad" opacity="0.30" filter="url(#bdBlur)"/>
</svg>`);

const rainLightWall = svgUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="rlBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#e3ebf4"/>
      <stop offset="52%" stop-color="#d5e0ec"/>
      <stop offset="100%" stop-color="#c4d1e2"/>
    </linearGradient>
    <radialGradient id="rlChai" cx="82%" cy="68%" r="44%">
      <stop offset="0%" stop-color="#edc08e" stop-opacity="0.60"/>
      <stop offset="55%" stop-color="#dfcbb6" stop-opacity="0.24"/>
      <stop offset="100%" stop-color="#c4d1e2" stop-opacity="0"/>
    </radialGradient>
    <filter id="rlBlur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="24"/></filter>
  </defs>
  <rect width="1600" height="1000" fill="url(#rlBg)"/>
  <rect width="1600" height="1000" fill="url(#rlChai)"/>
  <path d="M-80 180 C340 40 620 340 1020 150 C1300 20 1490 190 1700 80 L1700 -80 L-80 -80 Z" fill="#9fb7d1" opacity="0.52" filter="url(#rlBlur)"/>
  <path d="M-80 860 C280 555 720 820 1120 555 C1380 385 1540 500 1700 405 L1700 1060 L-80 1060 Z" fill="#859fba" opacity="0.42"/>
  <path d="M-50 470 C360 350 760 510 1180 360 C1400 282 1540 340 1680 290" fill="none" stroke="#ffffff" stroke-width="2.4" opacity="0.46"/>
  <ellipse cx="420" cy="460" rx="340" ry="170" transform="rotate(-24 420 460)" fill="#ffffff" opacity="0.48" filter="url(#rlBlur)"/>
</svg>`);

const rainDarkWall = svgUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="rdBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#080f19"/>
      <stop offset="56%" stop-color="#0e1828"/>
      <stop offset="100%" stop-color="#050a12"/>
    </linearGradient>
    <radialGradient id="rdLantern" cx="79%" cy="32%" r="42%">
      <stop offset="0%" stop-color="#dd9046" stop-opacity="0.40"/>
      <stop offset="60%" stop-color="#6b4a2f" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#0e1828" stop-opacity="0"/>
    </radialGradient>
    <filter id="rdBlur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="28"/></filter>
  </defs>
  <rect width="1600" height="1000" fill="url(#rdBg)"/>
  <rect width="1600" height="1000" fill="url(#rdLantern)"/>
  <path d="M-80 740 C300 475 680 760 1080 505 C1340 345 1500 460 1700 335 L1700 1060 L-80 1060 Z" fill="#1c2f4c" opacity="0.72"/>
  <path d="M-40 520 C360 390 740 540 1160 380 C1400 288 1540 345 1680 280" fill="none" stroke="#8cb2e6" stroke-width="1.8" opacity="0.24"/>
  <ellipse cx="340" cy="240" rx="340" ry="180" transform="rotate(-19 340 240)" fill="#2a4366" opacity="0.52" filter="url(#rdBlur)"/>
  <ellipse cx="1220" cy="280" rx="190" ry="140" fill="#e0994f" opacity="0.18" filter="url(#rdBlur)"/>
</svg>`);

const pistachioLightWall = svgUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="plBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbfcf6"/>
      <stop offset="52%" stop-color="#f1f6e6"/>
      <stop offset="100%" stop-color="#e3eed2"/>
    </linearGradient>
    <linearGradient id="plSweep" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#c3dba2" stop-opacity="0.52"/>
      <stop offset="55%" stop-color="#d9eac0" stop-opacity="0.38"/>
      <stop offset="100%" stop-color="#f8fbf2" stop-opacity="0.25"/>
    </linearGradient>
    <filter id="plBlur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="24"/></filter>
  </defs>
  <rect width="1600" height="1000" fill="url(#plBg)"/>
  <path d="M-80 680 C280 425 640 730 1060 445 C1340 260 1500 410 1700 275 L1700 1060 L-80 1060 Z" fill="url(#plSweep)"/>
  <path d="M-60 360 C340 230 720 420 1150 250 C1400 152 1540 225 1680 170" fill="none" stroke="#8cb56a" stroke-width="2" opacity="0.30"/>
  <ellipse cx="320" cy="240" rx="340" ry="180" transform="rotate(-14 320 240)" fill="#e7f1d4" opacity="0.80" filter="url(#plBlur)"/>
  <ellipse cx="1200" cy="240" rx="300" ry="160" transform="rotate(18 1200 240)" fill="#ffffff" opacity="0.72" filter="url(#plBlur)"/>
  <ellipse cx="860" cy="780" rx="380" ry="170" fill="#cbe0ac" opacity="0.40" filter="url(#plBlur)"/>
</svg>`);

const obsidianDarkWall = svgUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="obBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#030304"/>
      <stop offset="55%" stop-color="#08090b"/>
      <stop offset="100%" stop-color="#020203"/>
    </linearGradient>
    <linearGradient id="obArc" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#17191c" stop-opacity="0.78"/>
      <stop offset="60%" stop-color="#222624" stop-opacity="0.46"/>
      <stop offset="100%" stop-color="#363d34" stop-opacity="0.22"/>
    </linearGradient>
    <filter id="obBlur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="28"/></filter>
  </defs>
  <rect width="1600" height="1000" fill="url(#obBg)"/>
  <path d="M-80 740 C300 475 680 760 1080 485 C1340 310 1500 430 1700 295 L1700 1060 L-80 1060 Z" fill="url(#obArc)"/>
  <path d="M-40 460 C380 320 760 510 1190 340 C1420 248 1560 315 1680 260" fill="none" stroke="#b9c9a3" stroke-width="1.5" opacity="0.20"/>
  <ellipse cx="340" cy="260" rx="340" ry="180" transform="rotate(-16 340 260)" fill="#202226" opacity="0.58" filter="url(#obBlur)"/>
  <ellipse cx="1180" cy="260" rx="280" ry="160" transform="rotate(20 1180 260)" fill="#2b302a" opacity="0.40" filter="url(#obBlur)"/>
</svg>`);

export const THEME_META_MAP: Record<ThemeId, ThemeMeta> = {
  '1': {
    id: '1',
    name: 'Heritage Atelier Study',
    tagline: 'Original Walnut & Brass Linen Study · Espresso Night · Calacatta Marble Leisure',
    lightBg: '#f6f2ea',
    lightSurface: 'rgba(253, 251, 247, 0.84)',
    lightRaised: 'rgba(239, 228, 212, 0.88)',
    lightHeader: 'rgba(248, 244, 235, 0.82)',
    lightBorder: '#e2d7c5',
    lightInk: '#1c140e',
    lightMuted: '#6b5340',
    lightAccent: '#a47c43',
    lightAccentSoft: 'rgba(164, 124, 67, 0.14)',
    darkBg: '#080402',
    darkSurface: 'rgba(17, 8, 4, 0.88)',
    darkRaised: 'rgba(27, 13, 6, 0.9)',
    darkHeader: 'rgba(12, 6, 3, 0.88)',
    darkBorder: '#2e180c',
    darkInk: '#efe4d4',
    darkMuted: '#b79a79',
    darkAccent: '#d4a373',
    darkAccentSoft: 'rgba(212, 163, 115, 0.16)',
    shapeName: 'Soft Pill',
    buttonRadius: '11px',
    lightWallpaperUri: THEME_ONE_MARBLE_URI,
    darkWallpaperUri: espressoDarkWall,
    sidebar: {
      light: {
        railBg: 'linear-gradient(180deg, rgba(250,246,238,0.84) 0%, rgba(241,232,218,0.82) 55%, rgba(232,220,201,0.86) 100%)',
        railBorder: '#dcd0bd',
        railText: '#2a1f18',
        brandSectionBg: 'linear-gradient(155deg, rgba(255,251,243,0.9) 0%, rgba(238,224,202,0.82) 100%)',
        navSectionBg: 'linear-gradient(180deg, rgba(248,241,229,0.75) 0%, rgba(238,227,210,0.68) 100%)',
        thoughtSectionBg: 'linear-gradient(160deg, rgba(246,236,220,0.86) 0%, rgba(232,216,192,0.78) 100%)',
        footerSectionBg: 'linear-gradient(180deg, rgba(239,228,211,0.84) 0%, rgba(227,212,190,0.92) 100%)',
        sectionBorder: 'rgba(176,144,104,0.28)',
        activeBtnBg: 'linear-gradient(155deg, #6f4225 0%, #522e18 100%)',
        activeBtnBorder: '#7f4c2a',
        activeBtnText: '#ffffff',
        idleBtnBg: 'transparent',
        idleBtnText: '#4c3b31',
        activeIconColor: '#ffd899',
        idleIconColor: '#6c4830',
        toggleBtnBg: 'linear-gradient(180deg, rgba(242,232,216,0.92) 0%, rgba(227,214,193,0.92) 100%)',
        toggleBtnText: '#554236',
        toggleBtnBorder: '#d6c7b0',
        mutedLabelColor: '#8a6851',
        thoughtColor: '#35251c',
        authorColor: '#85532d',
        trashTextColor: '#6e1418',
        trashIconColor: '#7f1d1d',
      },
      dark: {
        railBg: 'linear-gradient(180deg, #120904 0%, #0b0502 58%, #070301 100%)',
        railBorder: '#2a160b',
        railText: '#efe4d4',
        brandSectionBg: 'transparent',
        navSectionBg: 'rgba(19, 9, 4, 0.62)',
        thoughtSectionBg: 'transparent',
        footerSectionBg: 'linear-gradient(180deg, #120904 0%, #090402 100%)',
        sectionBorder: '#2a160b',
        activeBtnBg: 'linear-gradient(155deg, #9c623d 0%, #7d4b2c 52%, #5e351c 100%)',
        activeBtnBorder: '#cf8e63',
        activeBtnText: '#ffffff',
        idleBtnBg: 'linear-gradient(180deg, rgba(48, 28, 16, 0.72) 0%, rgba(26, 14, 7, 0.88) 100%)',
        idleBtnText: '#f4e2cb',
        activeIconColor: '#ffecc9',
        idleIconColor: '#dbb88e',
        toggleBtnBg: 'linear-gradient(180deg, #3c2415 0%, #29170c 58%, #1a0e06 100%)',
        toggleBtnText: '#faebd6',
        toggleBtnBorder: '#5c3821',
        mutedLabelColor: '#b7946e',
        thoughtColor: '#ede0cc',
        authorColor: '#d4a373',
        trashTextColor: '#e27477',
        trashIconColor: '#e0585c',
      },
    },
  },
  '2': {
    id: '2',
    name: 'Forest Sanctuary',
    tagline: 'Moss Pine Woodland · Blurred Canopy Wallpaper · Leaf-Contour Buttons',
    lightBg: '#ebf2e7',
    lightSurface: 'rgba(247, 251, 244, 0.86)',
    lightRaised: 'rgba(227, 237, 222, 0.88)',
    lightHeader: 'rgba(242, 248, 238, 0.84)',
    lightBorder: '#bfd1ba',
    lightInk: '#17261b',
    lightMuted: '#46614d',
    lightAccent: '#2f6b43',
    lightAccentSoft: 'rgba(47, 107, 67, 0.14)',
    darkBg: '#030604',
    darkSurface: 'rgba(6, 11, 8, 0.92)',
    darkRaised: 'rgba(11, 19, 14, 0.94)',
    darkHeader: 'rgba(4, 8, 6, 0.92)',
    darkBorder: '#17261c',
    darkInk: '#e3f0e6',
    darkMuted: '#93b39c',
    darkAccent: '#63c287',
    darkAccentSoft: 'rgba(99, 194, 135, 0.16)',
    shapeName: 'Leaf Contour',
    buttonRadius: '15px 4px 15px 4px',
    lightWallpaperUri: forestLightWall,
    darkWallpaperUri: forestDarkWall,
    sidebar: {
      light: {
        railBg: 'linear-gradient(180deg, rgba(235,244,230,0.88) 0%, rgba(220,234,215,0.88) 58%, rgba(206,223,200,0.92) 100%)',
        railBorder: '#bdd0b8',
        railText: '#17261b',
        brandSectionBg: 'linear-gradient(155deg, rgba(244,250,240,0.86) 0%, rgba(215,232,209,0.78) 100%)',
        navSectionBg: 'linear-gradient(180deg, rgba(232,243,227,0.72) 0%, rgba(214,230,208,0.68) 100%)',
        thoughtSectionBg: 'linear-gradient(155deg, rgba(223,238,217,0.85) 0%, rgba(198,220,192,0.76) 100%)',
        footerSectionBg: 'linear-gradient(180deg, rgba(216,232,211,0.82) 0%, rgba(195,217,188,0.88) 100%)',
        sectionBorder: 'rgba(72,122,84,0.24)',
        activeBtnBg: 'linear-gradient(145deg, #326443 0%, #234930 100%)',
        activeBtnBorder: '#3f7c54',
        activeBtnText: '#ffffff',
        idleBtnBg: 'rgba(255,255,255,0.34)',
        idleBtnText: '#233b29',
        activeIconColor: '#bbf7d0',
        idleIconColor: '#366645',
        toggleBtnBg: 'linear-gradient(180deg, rgba(230,242,224,0.92) 0%, rgba(208,226,201,0.92) 100%)',
        toggleBtnText: '#27442f',
        toggleBtnBorder: '#a9c4a2',
        mutedLabelColor: '#4c7056',
        thoughtColor: '#1d3222',
        authorColor: '#2f6942',
        trashTextColor: '#8c2228',
        trashIconColor: '#a3282f',
      },
      dark: {
        railBg: 'linear-gradient(180deg, rgba(5,10,7,0.94) 0%, rgba(3,6,4,0.96) 58%, rgba(1,3,2,0.98) 100%)',
        railBorder: '#132017',
        railText: '#e3f0e6',
        brandSectionBg: 'linear-gradient(155deg, rgba(10,18,13,0.76) 0%, rgba(4,8,5,0.88) 100%)',
        navSectionBg: 'linear-gradient(180deg, rgba(8,14,10,0.62) 0%, rgba(4,7,5,0.78) 100%)',
        thoughtSectionBg: 'linear-gradient(155deg, rgba(10,18,13,0.76) 0%, rgba(4,8,5,0.88) 100%)',
        footerSectionBg: 'linear-gradient(180deg, rgba(7,12,9,0.8) 0%, rgba(3,5,4,0.94) 100%)',
        sectionBorder: 'rgba(99,194,135,0.16)',
        activeBtnBg: 'linear-gradient(155deg, #439162 0%, #316e49 52%, #235235 100%)',
        activeBtnBorder: '#6fd195',
        activeBtnText: '#ffffff',
        idleBtnBg: 'linear-gradient(180deg, rgba(19, 28, 22, 0.74) 0%, rgba(10, 16, 12, 0.88) 100%)',
        idleBtnText: '#d4e8da',
        activeIconColor: '#dcfce7',
        idleIconColor: '#84b896',
        toggleBtnBg: 'linear-gradient(180deg, #16211a 0%, #0e1611 58%, #080d0a 100%)',
        toggleBtnText: '#dff0e4',
        toggleBtnBorder: '#243a2b',
        mutedLabelColor: '#769c82',
        thoughtColor: '#dff0e4',
        authorColor: '#74d198',
        trashTextColor: '#f08285',
        trashIconColor: '#eb6c70',
      },
    },
  },
  '3': {
    id: '3',
    name: 'Coastal Beach Balcony',
    tagline: 'Sea Glass & Sand Dune · Blurred Surf Backdrop · Worn Pebble Buttons',
    lightBg: '#f4efe6',
    lightSurface: 'rgba(252, 249, 243, 0.86)',
    lightRaised: 'rgba(235, 227, 212, 0.88)',
    lightHeader: 'rgba(248, 244, 236, 0.84)',
    lightBorder: '#cdc3b0',
    lightInk: '#152736',
    lightMuted: '#4c6578',
    lightAccent: '#1c637a',
    lightAccentSoft: 'rgba(28, 99, 122, 0.14)',
    darkBg: '#07121d',
    darkSurface: 'rgba(12, 27, 41, 0.86)',
    darkRaised: 'rgba(19, 41, 61, 0.88)',
    darkHeader: 'rgba(9, 21, 33, 0.86)',
    darkBorder: '#1f415d',
    darkInk: '#e6eff5',
    darkMuted: '#98bdd2',
    darkAccent: '#4fb0cc',
    darkAccentSoft: 'rgba(79, 176, 204, 0.16)',
    shapeName: 'Coastal Pebble',
    buttonRadius: '13px 19px 11px 17px',
    lightWallpaperUri: beachLightWall,
    darkWallpaperUri: beachDarkWall,
    sidebar: {
      light: {
        railBg: 'linear-gradient(180deg, rgba(246,241,231,0.88) 0%, rgba(235,228,214,0.88) 58%, rgba(224,214,196,0.92) 100%)',
        railBorder: '#cfc2ad',
        railText: '#152736',
        brandSectionBg: 'linear-gradient(155deg, rgba(252,248,240,0.88) 0%, rgba(228,238,242,0.78) 100%)',
        navSectionBg: 'linear-gradient(180deg, rgba(242,237,226,0.74) 0%, rgba(224,230,226,0.68) 100%)',
        thoughtSectionBg: 'linear-gradient(155deg, rgba(233,241,244,0.84) 0%, rgba(227,217,199,0.78) 100%)',
        footerSectionBg: 'linear-gradient(180deg, rgba(232,223,207,0.84) 0%, rgba(218,207,188,0.9) 100%)',
        sectionBorder: 'rgba(42,108,130,0.22)',
        activeBtnBg: 'linear-gradient(145deg, #1d5c73 0%, #134152 100%)',
        activeBtnBorder: '#2a7791',
        activeBtnText: '#ffffff',
        idleBtnBg: 'rgba(255,255,255,0.34)',
        idleBtnText: '#234054',
        activeIconColor: '#bae6fd',
        idleIconColor: '#24667d',
        toggleBtnBg: 'linear-gradient(180deg, rgba(242,238,229,0.92) 0%, rgba(224,218,204,0.92) 100%)',
        toggleBtnText: '#1d4457',
        toggleBtnBorder: '#bfb49f',
        mutedLabelColor: '#486d80',
        thoughtColor: '#193040',
        authorColor: '#1d647a',
        trashTextColor: '#8e242a',
        trashIconColor: '#a62a31',
      },
      dark: {
        railBg: 'linear-gradient(180deg, rgba(12,26,41,0.88) 0%, rgba(8,19,31,0.9) 58%, rgba(5,12,21,0.94) 100%)',
        railBorder: '#1d3c56',
        railText: '#e6eff5',
        brandSectionBg: 'linear-gradient(155deg, rgba(22,52,77,0.72) 0%, rgba(10,27,42,0.82) 100%)',
        navSectionBg: 'linear-gradient(180deg, rgba(16,40,60,0.58) 0%, rgba(9,23,36,0.7) 100%)',
        thoughtSectionBg: 'linear-gradient(155deg, rgba(21,49,73,0.72) 0%, rgba(10,26,40,0.84) 100%)',
        footerSectionBg: 'linear-gradient(180deg, rgba(15,36,54,0.76) 0%, rgba(7,18,29,0.9) 100%)',
        sectionBorder: 'rgba(79,176,204,0.22)',
        activeBtnBg: 'linear-gradient(155deg, #3c8fbd 0%, #2b6f96 52%, #1d5270 100%)',
        activeBtnBorder: '#6cc5f0',
        activeBtnText: '#ffffff',
        idleBtnBg: 'linear-gradient(180deg, rgba(22, 55, 75, 0.68) 0%, rgba(11, 29, 41, 0.84) 100%)',
        idleBtnText: '#d3ecf8',
        activeIconColor: '#e0f7ff',
        idleIconColor: '#8fd4ed',
        toggleBtnBg: 'linear-gradient(180deg, #173b52 0%, #102b3c 58%, #0a1c28 100%)',
        toggleBtnText: '#e0f3fc',
        toggleBtnBorder: '#275c7d',
        mutedLabelColor: '#76abc4',
        thoughtColor: '#deecf5',
        authorColor: '#73c7e0',
        trashTextColor: '#f08285',
        trashIconColor: '#eb6c70',
      },
    },
  },
  '4': {
    id: '4',
    name: 'Cozy Rainy Monsoon',
    tagline: 'Rain Slate & Warm Chai · Rain Watermarks & Frosted Balcony · Teardrop Buttons',
    lightBg: '#e7edf3',
    lightSurface: 'rgba(244, 248, 252, 0.84)',
    lightRaised: 'rgba(223, 232, 241, 0.88)',
    lightHeader: 'rgba(238, 244, 250, 0.82)',
    lightBorder: '#bac8d8',
    lightInk: '#182230',
    lightMuted: '#4b5e76',
    lightAccent: '#365578',
    lightAccentSoft: 'rgba(54, 85, 120, 0.14)',
    darkBg: '#090f18',
    darkSurface: 'rgba(15, 23, 36, 0.84)',
    darkRaised: 'rgba(23, 35, 54, 0.88)',
    darkHeader: 'rgba(11, 18, 29, 0.85)',
    darkBorder: '#2c3f5b',
    darkInk: '#e6edf6',
    darkMuted: '#99aec9',
    darkAccent: '#7ea5d6',
    darkAccentSoft: 'rgba(126, 165, 214, 0.16)',
    shapeName: 'Monsoon Teardrop',
    buttonRadius: '15px 15px 15px 4px',
    lightWallpaperUri: rainLightWall,
    darkWallpaperUri: rainDarkWall,
    sidebar: {
      light: {
        railBg: 'linear-gradient(180deg, rgba(234,240,247,0.88) 0%, rgba(221,230,241,0.88) 58%, rgba(208,220,234,0.92) 100%)',
        railBorder: '#b6c5d6',
        railText: '#182230',
        brandSectionBg: 'linear-gradient(155deg, rgba(244,248,253,0.86) 0%, rgba(217,228,240,0.78) 100%)',
        navSectionBg: 'linear-gradient(180deg, rgba(232,239,247,0.72) 0%, rgba(214,225,238,0.68) 100%)',
        thoughtSectionBg: 'linear-gradient(155deg, rgba(228,236,246,0.84) 0%, rgba(209,221,235,0.76) 100%)',
        footerSectionBg: 'linear-gradient(180deg, rgba(218,228,240,0.84) 0%, rgba(201,214,230,0.9) 100%)',
        sectionBorder: 'rgba(72,102,138,0.24)',
        activeBtnBg: 'linear-gradient(145deg, #354e6d 0%, #24364d 100%)',
        activeBtnBorder: '#4d6f96',
        activeBtnText: '#ffffff',
        idleBtnBg: 'rgba(255,255,255,0.38)',
        idleBtnText: '#2c3d52',
        activeIconColor: '#fde68a',
        idleIconColor: '#456082',
        toggleBtnBg: 'linear-gradient(180deg, rgba(233,240,248,0.92) 0%, rgba(213,223,235,0.92) 100%)',
        toggleBtnText: '#2f4157',
        toggleBtnBorder: '#aebfd2',
        mutedLabelColor: '#566b85',
        thoughtColor: '#1f2b3c',
        authorColor: '#8d5b2d',
        trashTextColor: '#8e242a',
        trashIconColor: '#a62a31',
      },
      dark: {
        railBg: 'linear-gradient(180deg, rgba(16,24,38,0.88) 0%, rgba(11,17,28,0.9) 58%, rgba(7,12,20,0.94) 100%)',
        railBorder: '#2a3d58',
        railText: '#e6edf6',
        brandSectionBg: 'linear-gradient(155deg, rgba(30,45,68,0.72) 0%, rgba(14,23,36,0.82) 100%)',
        navSectionBg: 'linear-gradient(180deg, rgba(23,35,54,0.58) 0%, rgba(12,20,32,0.7) 100%)',
        thoughtSectionBg: 'linear-gradient(155deg, rgba(34,47,68,0.72) 0%, rgba(15,24,36,0.84) 100%)',
        footerSectionBg: 'linear-gradient(180deg, rgba(21,32,49,0.76) 0%, rgba(10,16,26,0.9) 100%)',
        sectionBorder: 'rgba(126,165,214,0.22)',
        activeBtnBg: 'linear-gradient(155deg, #4e73ab 0%, #3a5887 52%, #2a4166 100%)',
        activeBtnBorder: '#86aee6',
        activeBtnText: '#ffffff',
        idleBtnBg: 'linear-gradient(180deg, rgba(30, 45, 69, 0.68) 0%, rgba(15, 24, 38, 0.84) 100%)',
        idleBtnText: '#d6e3f8',
        activeIconColor: '#e6f0ff',
        idleIconColor: '#9ec0eb',
        toggleBtnBg: 'linear-gradient(180deg, #20314b 0%, #152134 58%, #0f1826 100%)',
        toggleBtnText: '#e3ecfc',
        toggleBtnBorder: '#344f78',
        mutedLabelColor: '#849ebe',
        thoughtColor: '#e2eaf5',
        authorColor: '#eab676',
        trashTextColor: '#f08285',
        trashIconColor: '#eb6c70',
      },
    },
  },
  '5': {
    id: '5',
    name: 'Pistachio & Obsidian',
    tagline: 'Creamish Pista Soft Glass (Light) & Obsidian Black (Dark) · Cream-Pista Dark Buttons',
    lightBg: '#f5f8ee',
    lightSurface: 'rgba(248, 251, 242, 0.74)',
    lightRaised: 'rgba(238, 245, 226, 0.74)',
    lightHeader: 'rgba(248, 251, 242, 0.74)',
    lightBorder: 'rgba(196, 214, 168, 0.8)',
    lightInk: '#1e2b18',
    lightMuted: '#566b4c',
    lightAccent: '#578440',
    lightAccentSoft: 'rgba(87, 132, 64, 0.14)',
    darkBg: '#040405',
    darkSurface: 'rgba(11, 11, 13, 0.9)',
    darkRaised: 'rgba(19, 19, 23, 0.92)',
    darkHeader: 'rgba(8, 8, 10, 0.9)',
    darkBorder: '#27282e',
    darkInk: '#eef4ea',
    darkMuted: '#9aa498',
    darkAccent: '#e5eed6',
    darkAccentSoft: 'rgba(229, 238, 214, 0.14)',
    shapeName: 'Pistachio Tab',
    buttonRadius: '8px 14px 8px 14px',
    lightWallpaperUri: pistachioLightWall,
    darkWallpaperUri: obsidianDarkWall,
    sidebar: {
      light: {
        railBg: 'linear-gradient(180deg, rgba(249,252,244,0.76) 0%, rgba(240,247,230,0.74) 58%, rgba(231,241,216,0.78) 100%)',
        railBorder: 'rgba(196, 214, 168, 0.8)',
        railText: '#1e2b18',
        brandSectionBg: 'linear-gradient(155deg, rgba(252,253,249,0.76) 0%, rgba(239,246,227,0.72) 100%)',
        navSectionBg: 'linear-gradient(180deg, rgba(248,251,242,0.72) 0%, rgba(236,244,223,0.7) 100%)',
        thoughtSectionBg: 'linear-gradient(155deg, rgba(245,250,236,0.74) 0%, rgba(233,242,218,0.72) 100%)',
        footerSectionBg: 'linear-gradient(180deg, rgba(240,247,230,0.74) 0%, rgba(229,239,213,0.78) 100%)',
        sectionBorder: 'rgba(87,132,64,0.2)',
        activeBtnBg: 'linear-gradient(145deg, #54833d 0%, #3d632b 100%)',
        activeBtnBorder: '#689c4f',
        activeBtnText: '#ffffff',
        idleBtnBg: 'rgba(255,255,255,0.44)',
        idleBtnText: '#25371e',
        activeIconColor: '#edf7e0',
        idleIconColor: '#527d3b',
        toggleBtnBg: 'linear-gradient(180deg, rgba(245,249,236,0.76) 0%, rgba(231,240,214,0.72) 100%)',
        toggleBtnText: '#25371e',
        toggleBtnBorder: '#c5d6ac',
        mutedLabelColor: '#5f7653',
        thoughtColor: '#21331a',
        authorColor: '#487632',
        trashTextColor: '#8e242a',
        trashIconColor: '#a62a31',
      },
      dark: {
        railBg: 'linear-gradient(180deg, rgba(10,10,12,0.94) 0%, rgba(6,6,8,0.96) 58%, rgba(2,2,3,0.98) 100%)',
        railBorder: '#24252a',
        railText: '#eef4ea',
        brandSectionBg: 'linear-gradient(155deg, rgba(22,22,26,0.76) 0%, rgba(10,10,12,0.88) 100%)',
        navSectionBg: 'linear-gradient(180deg, rgba(16,16,19,0.64) 0%, rgba(8,8,10,0.78) 100%)',
        thoughtSectionBg: 'linear-gradient(155deg, rgba(20,21,24,0.76) 0%, rgba(10,10,12,0.88) 100%)',
        footerSectionBg: 'linear-gradient(180deg, rgba(15,15,18,0.82) 0%, rgba(6,6,8,0.94) 100%)',
        sectionBorder: 'rgba(229,238,214,0.16)',
        activeBtnBg: 'linear-gradient(155deg, rgba(250, 252, 245, 0.88) 0%, rgba(237, 244, 224, 0.82) 52%, rgba(220, 232, 200, 0.76) 100%)',
        activeBtnBorder: 'rgba(255, 255, 255, 0.9)',
        activeBtnText: '#070a06',
        idleBtnBg: 'linear-gradient(180deg, rgba(221, 230, 207, 0.72) 0%, rgba(196, 211, 174, 0.66) 100%)',
        idleBtnText: '#0f160d',
        activeIconColor: '#0c140a',
        idleIconColor: '#182414',
        toggleBtnBg: 'linear-gradient(180deg, rgba(221, 230, 207, 0.74) 0%, rgba(201, 214, 182, 0.7) 58%, rgba(182, 198, 160, 0.66) 100%)',
        toggleBtnText: '#0f160d',
        toggleBtnBorder: 'rgba(221, 230, 207, 0.76)',
        mutedLabelColor: '#98a196',
        thoughtColor: '#e9efe6',
        authorColor: '#dce8c8',
        trashTextColor: '#5e0b15',
        trashIconColor: '#6f0f1b',
      },
    },
  },
};

export function getThemeMeta(designId?: string | null): ThemeMeta {
  const key = (designId || '1') as ThemeId;
  return THEME_META_MAP[key] || THEME_META_MAP['1'];
}
