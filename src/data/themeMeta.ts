import { DesignId } from '../types';

export type ThemeId = DesignId;

const svgUri = (svg: string): string => `url("data:image/svg+xml,${encodeURIComponent(svg.trim())}")`;

/** Whitish-cream Calacatta marble with subtle warm gold veins — used STRICTLY for Theme 1 Light Leisure */
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

/* Non-repetitive organic abstract compositions tailored for Themes 2-10 (Light & Dark) */
const forestLightWall = svgUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="flBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#edf5ea"/>
      <stop offset="48%" stop-color="#ddecd7"/>
      <stop offset="100%" stop-color="#cde2c9"/>
    </linearGradient>
    <radialGradient id="flSun" cx="78%" cy="16%" r="52%">
      <stop offset="0%" stop-color="#fffce6" stop-opacity="0.92"/>
      <stop offset="52%" stop-color="#dcefd1" stop-opacity="0.38"/>
      <stop offset="100%" stop-color="#cde2c9" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="flRib1" x1="0%" y1="0%" x2="100%" y2="40%">
      <stop offset="0%" stop-color="#6ca376" stop-opacity="0.34"/>
      <stop offset="55%" stop-color="#4e895a" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#8ec191" stop-opacity="0.08"/>
    </linearGradient>
    <linearGradient id="flRib2" x1="100%" y1="0%" x2="15%" y2="100%">
      <stop offset="0%" stop-color="#b8d9a5" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#3c734b" stop-opacity="0.16"/>
    </linearGradient>
    <filter id="flBlur" x="-15%" y="-15%" width="130%" height="130%"><feGaussianBlur stdDeviation="28"/></filter>
  </defs>
  <rect width="1600" height="1000" fill="url(#flBg)"/>
  <rect width="1600" height="1000" fill="url(#flSun)"/>
  <path d="M-80 280 C240 120 490 360 870 210 C1190 85 1380 260 1680 110 L1680 -60 L-80 -60 Z" fill="url(#flRib2)" filter="url(#flBlur)"/>
  <path d="M-60 720 C220 520 510 830 890 610 C1180 440 1390 620 1680 480 L1680 1080 L-60 1080 Z" fill="url(#flRib1)"/>
  <path d="M180 1040 C420 790 760 880 1060 660 C1280 498 1450 560 1660 410 L1660 1040 Z" fill="#3a714a" opacity="0.15"/>
  <ellipse cx="260" cy="640" rx="280" ry="180" transform="rotate(-18 260 640)" fill="#89bd8f" opacity="0.26" filter="url(#flBlur)"/>
  <ellipse cx="1220" cy="280" rx="340" ry="150" transform="rotate(14 1220 280)" fill="#d6e9be" opacity="0.52" filter="url(#flBlur)"/>
</svg>`);

const forestDarkWall = svgUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="fdBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#07130c"/>
      <stop offset="52%" stop-color="#0a1c12"/>
      <stop offset="100%" stop-color="#040b07"/>
    </linearGradient>
    <radialGradient id="fdGlow" cx="24%" cy="22%" r="48%">
      <stop offset="0%" stop-color="#357d51" stop-opacity="0.48"/>
      <stop offset="100%" stop-color="#07130c" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="fdWave" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#1b4d31" stop-opacity="0.55"/>
      <stop offset="60%" stop-color="#2d7a4c" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="#60b87f" stop-opacity="0.12"/>
    </linearGradient>
    <filter id="fdBlur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="34"/></filter>
  </defs>
  <rect width="1600" height="1000" fill="url(#fdBg)"/>
  <rect width="1600" height="1000" fill="url(#fdGlow)"/>
  <path d="M-80 860 C260 610 580 790 920 520 C1210 290 1420 430 1690 220 L1690 1060 L-80 1060 Z" fill="url(#fdWave)"/>
  <path d="M420 -80 C680 180 940 90 1240 310 C1420 440 1560 360 1690 470 L1690 -80 Z" fill="#18472c" opacity="0.48" filter="url(#fdBlur)"/>
  <ellipse cx="1180" cy="740" rx="360" ry="200" transform="rotate(-12 1180 740)" fill="#3b8252" opacity="0.22" filter="url(#fdBlur)"/>
  <ellipse cx="480" cy="340" rx="260" ry="140" transform="rotate(24 480 340)" fill="#78c28d" opacity="0.12" filter="url(#fdBlur)"/>
</svg>`);

const beachLightWall = svgUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="blBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#e3f1f6"/>
      <stop offset="48%" stop-color="#f5efe3"/>
      <stop offset="100%" stop-color="#e9dbc3"/>
    </linearGradient>
    <radialGradient id="blSun" cx="80%" cy="22%" r="45%">
      <stop offset="0%" stop-color="#fff8dc" stop-opacity="0.96"/>
      <stop offset="55%" stop-color="#e6f2f6" stop-opacity="0.32"/>
      <stop offset="100%" stop-color="#f5efe3" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="blSurf" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#5ca8bd" stop-opacity="0.36"/>
      <stop offset="55%" stop-color="#87c4d3" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="#c9a87c" stop-opacity="0.22"/>
    </linearGradient>
    <filter id="blBlur" x="-15%" y="-15%" width="130%" height="130%"><feGaussianBlur stdDeviation="26"/></filter>
  </defs>
  <rect width="1600" height="1000" fill="url(#blBg)"/>
  <rect width="1600" height="1000" fill="url(#blSun)"/>
  <path d="M-100 540 C260 390 560 660 980 450 C1260 310 1440 460 1700 320 L1700 1060 L-100 1060 Z" fill="url(#blSurf)"/>
  <path d="M-80 760 C340 610 680 860 1120 680 C1380 570 1520 660 1700 590 L1700 1060 L-80 1060 Z" fill="#dfc9a6" opacity="0.48" filter="url(#blBlur)"/>
  <ellipse cx="320" cy="220" rx="340" ry="170" transform="rotate(-14 320 220)" fill="#94cbdb" opacity="0.32" filter="url(#blBlur)"/>
  <path d="M-40 410 Q420 300 840 430 T1660 370" fill="none" stroke="#ffffff" stroke-width="38" opacity="0.28" filter="url(#blBlur)"/>
</svg>`);

const beachDarkWall = svgUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="bdBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#05111e"/>
      <stop offset="55%" stop-color="#091d2f"/>
      <stop offset="100%" stop-color="#040d17"/>
    </linearGradient>
    <radialGradient id="bdMoon" cx="76%" cy="20%" r="44%">
      <stop offset="0%" stop-color="#489ab8" stop-opacity="0.44"/>
      <stop offset="100%" stop-color="#05111e" stop-opacity="0"/>
    </radialGradient>
    <filter id="bdBlur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="32"/></filter>
  </defs>
  <rect width="1600" height="1000" fill="url(#bdBg)"/>
  <rect width="1600" height="1000" fill="url(#bdMoon)"/>
  <path d="M-80 620 C280 430 640 730 1040 500 C1320 340 1480 480 1700 360 L1700 1060 L-80 1060 Z" fill="#134b66" opacity="0.46"/>
  <path d="M-60 820 C360 680 760 900 1180 720 C1420 620 1560 720 1700 660 L1700 1060 L-60 1060 Z" fill="#0d3145" opacity="0.65" filter="url(#bdBlur)"/>
  <ellipse cx="360" cy="280" rx="300" ry="160" transform="rotate(19 360 280)" fill="#2a799c" opacity="0.24" filter="url(#bdBlur)"/>
  <ellipse cx="1140" cy="790" rx="340" ry="150" transform="rotate(-11 1140 790)" fill="#62b9d4" opacity="0.14" filter="url(#bdBlur)"/>
</svg>`);

const rainLightWall = svgUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="rlBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#e5ecf4"/>
      <stop offset="52%" stop-color="#dbe4ef"/>
      <stop offset="100%" stop-color="#ced8e6"/>
    </linearGradient>
    <radialGradient id="rlChai" cx="82%" cy="68%" r="42%">
      <stop offset="0%" stop-color="#f2cba0" stop-opacity="0.52"/>
      <stop offset="55%" stop-color="#e2d1be" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#ced8e6" stop-opacity="0"/>
    </radialGradient>
    <filter id="rlBlur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="30"/></filter>
  </defs>
  <rect width="1600" height="1000" fill="url(#rlBg)"/>
  <rect width="1600" height="1000" fill="url(#rlChai)"/>
  <path d="M-80 180 C340 40 620 340 1020 150 C1300 20 1490 190 1700 80 L1700 -80 L-80 -80 Z" fill="#a8bed6" opacity="0.45" filter="url(#rlBlur)"/>
  <path d="M-80 860 C280 560 720 820 1120 560 C1380 390 1540 500 1700 410 L1700 1060 L-80 1060 Z" fill="#90a8c2" opacity="0.34"/>
  <ellipse cx="420" cy="460" rx="340" ry="170" transform="rotate(-24 420 460)" fill="#ffffff" opacity="0.45" filter="url(#rlBlur)"/>
  <ellipse cx="1160" cy="290" rx="280" ry="140" transform="rotate(16 1160 290)" fill="#8ca6c4" opacity="0.3" filter="url(#rlBlur)"/>
</svg>`);

const rainDarkWall = svgUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="rdBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#09101a"/>
      <stop offset="56%" stop-color="#0e1726"/>
      <stop offset="100%" stop-color="#060b13"/>
    </linearGradient>
    <radialGradient id="rdLantern" cx="79%" cy="32%" r="38%">
      <stop offset="0%" stop-color="#d48942" stop-opacity="0.32"/>
      <stop offset="60%" stop-color="#5d422d" stop-opacity="0.14"/>
      <stop offset="100%" stop-color="#0e1726" stop-opacity="0"/>
    </radialGradient>
    <filter id="rdBlur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="34"/></filter>
  </defs>
  <rect width="1600" height="1000" fill="url(#rdBg)"/>
  <rect width="1600" height="1000" fill="url(#rdLantern)"/>
  <path d="M-80 740 C300 480 680 760 1080 510 C1340 350 1500 460 1700 340 L1700 1060 L-80 1060 Z" fill="#182840" opacity="0.62"/>
  <ellipse cx="340" cy="240" rx="340" ry="180" transform="rotate(-19 340 240)" fill="#243a59" opacity="0.46" filter="url(#rdBlur)"/>
  <ellipse cx="980" cy="790" rx="380" ry="170" transform="rotate(12 980 790)" fill="#1d304a" opacity="0.48" filter="url(#rdBlur)"/>
  <ellipse cx="1220" cy="280" rx="180" ry="130" fill="#d9934c" opacity="0.14" filter="url(#rdBlur)"/>
</svg>`);

const alpineLightWall = svgUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="alBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f2f4f6"/>
      <stop offset="55%" stop-color="#e7ebef"/>
      <stop offset="100%" stop-color="#dce2e8"/>
    </linearGradient>
    <filter id="alBlur" x="-15%" y="-15%" width="130%" height="130%"><feGaussianBlur stdDeviation="24"/></filter>
  </defs>
  <rect width="1600" height="1000" fill="url(#alBg)"/>
  <polygon points="-100,1000 720,160 1120,480 420,1060" fill="#c7d0da" opacity="0.48"/>
  <polygon points="760,0 1680,0 1680,740 1040,340" fill="#d3dbe3" opacity="0.56"/>
  <path d="M-80 820 C340 620 740 790 1220 510 C1420 390 1560 440 1680 390 L1680 1040 L-80 1040 Z" fill="#b7c2ce" opacity="0.38" filter="url(#alBlur)"/>
  <ellipse cx="1160" cy="240" rx="260" ry="150" transform="rotate(-16 1160 240)" fill="#dfa696" opacity="0.34" filter="url(#alBlur)"/>
  <ellipse cx="260" cy="260" rx="280" ry="140" transform="rotate(22 260 260)" fill="#ffffff" opacity="0.58" filter="url(#alBlur)"/>
</svg>`);

const alpineDarkWall = svgUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="adBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0c1016"/>
      <stop offset="55%" stop-color="#11161f"/>
      <stop offset="100%" stop-color="#090c11"/>
    </linearGradient>
    <filter id="adBlur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="30"/></filter>
  </defs>
  <rect width="1600" height="1000" fill="url(#adBg)"/>
  <polygon points="-80,1000 680,190 1060,490 360,1060" fill="#1b2431" opacity="0.68"/>
  <polygon points="840,0 1680,0 1680,690 1120,310" fill="#171f2b" opacity="0.72"/>
  <ellipse cx="1140" cy="250" rx="280" ry="150" transform="rotate(-14 1140 250)" fill="#8a3d2b" opacity="0.28" filter="url(#adBlur)"/>
  <ellipse cx="460" cy="720" rx="360" ry="170" transform="rotate(12 460 720)" fill="#222d3d" opacity="0.55" filter="url(#adBlur)"/>
</svg>`);

const conservatoryLightWall = svgUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="clBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ecf5f1"/>
      <stop offset="52%" stop-color="#deece7"/>
      <stop offset="100%" stop-color="#cfe4dc"/>
    </linearGradient>
    <filter id="clBlur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="28"/></filter>
  </defs>
  <rect width="1600" height="1000" fill="url(#clBg)"/>
  <path d="M-80 680 C260 410 620 720 1020 440 C1300 245 1480 390 1700 240 L1700 1060 L-80 1060 Z" fill="#9bcbb9" opacity="0.38"/>
  <path d="M-80 260 C340 420 680 120 1120 290 C1380 390 1540 220 1700 310 L1700 -80 L-80 -80 Z" fill="#b8dfd1" opacity="0.48" filter="url(#clBlur)"/>
  <ellipse cx="360" cy="260" rx="310" ry="180" transform="rotate(18 360 260)" fill="#ffffff" opacity="0.52" filter="url(#clBlur)"/>
  <ellipse cx="1180" cy="760" rx="360" ry="170" transform="rotate(-15 1180 760)" fill="#77b39f" opacity="0.28" filter="url(#clBlur)"/>
</svg>`);

const conservatoryDarkWall = svgUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="cdBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#061412"/>
      <stop offset="55%" stop-color="#0a1e1a"/>
      <stop offset="100%" stop-color="#040e0c"/>
    </linearGradient>
    <filter id="cdBlur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="34"/></filter>
  </defs>
  <rect width="1600" height="1000" fill="url(#cdBg)"/>
  <path d="M-80 700 C300 450 640 750 1060 470 C1320 295 1490 420 1700 280 L1700 1060 L-80 1060 Z" fill="#14493f" opacity="0.55"/>
  <ellipse cx="380" cy="240" rx="340" ry="180" transform="rotate(14 380 240)" fill="#1c5c4f" opacity="0.45" filter="url(#cdBlur)"/>
  <ellipse cx="1220" cy="300" rx="320" ry="160" transform="rotate(-22 1220 300)" fill="#2d806e" opacity="0.28" filter="url(#cdBlur)"/>
  <ellipse cx="760" cy="840" rx="420" ry="160" fill="#113d34" opacity="0.52" filter="url(#cdBlur)"/>
</svg>`);

const observatoryLightWall = svgUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="olBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f3f0e8"/>
      <stop offset="52%" stop-color="#ebe9f2"/>
      <stop offset="100%" stop-color="#dfdce9"/>
    </linearGradient>
    <filter id="olBlur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="28"/></filter>
  </defs>
  <rect width="1600" height="1000" fill="url(#olBg)"/>
  <path d="M-100 360 C280 140 620 460 1040 210 C1320 45 1490 220 1700 120 L1700 -80 L-100 -80 Z" fill="#d9cab0" opacity="0.46" filter="url(#olBlur)"/>
  <path d="M-80 840 C360 580 740 840 1160 560 C1400 400 1550 510 1700 430 L1700 1060 L-80 1060 Z" fill="#b4b7d6" opacity="0.38"/>
  <ellipse cx="1140" cy="240" rx="280" ry="160" transform="rotate(-16 1140 240)" fill="#e8d2a9" opacity="0.5" filter="url(#olBlur)"/>
  <ellipse cx="380" cy="640" rx="340" ry="180" transform="rotate(18 380 640)" fill="#a5a9d1" opacity="0.32" filter="url(#olBlur)"/>
</svg>`);

const observatoryDarkWall = svgUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="odBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#070a15"/>
      <stop offset="55%" stop-color="#0d1126"/>
      <stop offset="100%" stop-color="#050710"/>
    </linearGradient>
    <radialGradient id="odBrass" cx="76%" cy="24%" r="42%">
      <stop offset="0%" stop-color="#c9a04e" stop-opacity="0.34"/>
      <stop offset="55%" stop-color="#4e4675" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#0d1126" stop-opacity="0"/>
    </radialGradient>
    <filter id="odBlur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="34"/></filter>
  </defs>
  <rect width="1600" height="1000" fill="url(#odBg)"/>
  <rect width="1600" height="1000" fill="url(#odBrass)"/>
  <path d="M-100 760 C280 480 680 780 1080 480 C1340 285 1500 410 1700 260 L1700 1060 L-100 1060 Z" fill="#232554" opacity="0.52"/>
  <ellipse cx="360" cy="300" rx="340" ry="180" transform="rotate(-18 360 300)" fill="#2a2d66" opacity="0.48" filter="url(#odBlur)"/>
  <ellipse cx="1060" cy="760" rx="380" ry="160" transform="rotate(14 1060 760)" fill="#18274f" opacity="0.55" filter="url(#odBlur)"/>
  <ellipse cx="1220" cy="240" rx="220" ry="130" transform="rotate(24 1220 240)" fill="#cfa757" opacity="0.16" filter="url(#odBlur)"/>
</svg>`);

const rosewoodLightWall = svgUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="rwlBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f7eef0"/>
      <stop offset="52%" stop-color="#f2e4e8"/>
      <stop offset="100%" stop-color="#e9d8dc"/>
    </linearGradient>
    <filter id="rwlBlur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="28"/></filter>
  </defs>
  <rect width="1600" height="1000" fill="url(#rwlBg)"/>
  <path d="M-80 680 C280 450 640 760 1060 490 C1340 310 1500 440 1700 320 L1700 1060 L-80 1060 Z" fill="#d9b2bd" opacity="0.42"/>
  <ellipse cx="320" cy="240" rx="330" ry="180" transform="rotate(-14 320 240)" fill="#e8c3cc" opacity="0.52" filter="url(#rwlBlur)"/>
  <ellipse cx="1200" cy="240" rx="300" ry="160" transform="rotate(18 1200 240)" fill="#edd3c2" opacity="0.56" filter="url(#rwlBlur)"/>
  <ellipse cx="820" cy="780" rx="380" ry="170" fill="#c995a3" opacity="0.24" filter="url(#rwlBlur)"/>
</svg>`);

const rosewoodDarkWall = svgUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="rwdBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#13070b"/>
      <stop offset="55%" stop-color="#1b0a10"/>
      <stop offset="100%" stop-color="#0d0508"/>
    </linearGradient>
    <filter id="rwdBlur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="34"/></filter>
  </defs>
  <rect width="1600" height="1000" fill="url(#rwdBg)"/>
  <path d="M-80 740 C280 460 660 760 1080 480 C1340 305 1500 420 1700 290 L1700 1060 L-80 1060 Z" fill="#4f192b" opacity="0.54"/>
  <ellipse cx="340" cy="260" rx="340" ry="180" transform="rotate(-16 340 260)" fill="#5c1e33" opacity="0.46" filter="url(#rwdBlur)"/>
  <ellipse cx="1180" cy="260" rx="280" ry="160" transform="rotate(20 1180 260)" fill="#7a3e2c" opacity="0.26" filter="url(#rwdBlur)"/>
  <ellipse cx="960" cy="800" rx="380" ry="170" fill="#3a1220" opacity="0.62" filter="url(#rwdBlur)"/>
</svg>`);

const broadsheetLightWall = svgUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="brlBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f6f1e6"/>
      <stop offset="55%" stop-color="#ede5d4"/>
      <stop offset="100%" stop-color="#e3d8c2"/>
    </linearGradient>
    <filter id="brlBlur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="28"/></filter>
  </defs>
  <rect width="1600" height="1000" fill="url(#brlBg)"/>
  <path d="M-80 640 C320 430 700 720 1140 460 C1380 320 1520 420 1700 320 L1700 1060 L-80 1060 Z" fill="#d8cab0" opacity="0.46"/>
  <ellipse cx="420" cy="240" rx="360" ry="170" transform="rotate(-12 420 240)" fill="#e6dbc3" opacity="0.62" filter="url(#brlBlur)"/>
  <ellipse cx="1180" cy="720" rx="380" ry="180" transform="rotate(14 1180 720)" fill="#cbb998" opacity="0.38" filter="url(#brlBlur)"/>
  <ellipse cx="1240" cy="220" rx="240" ry="130" fill="#ffffff" opacity="0.42" filter="url(#brlBlur)"/>
</svg>`);

const broadsheetDarkWall = svgUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="brdBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#11100c"/>
      <stop offset="55%" stop-color="#17150f"/>
      <stop offset="100%" stop-color="#0b0a07"/>
    </linearGradient>
    <filter id="brdBlur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="34"/></filter>
  </defs>
  <rect width="1600" height="1000" fill="url(#brdBg)"/>
  <path d="M-80 720 C320 470 700 750 1120 480 C1380 315 1520 430 1700 310 L1700 1060 L-80 1060 Z" fill="#2e291c" opacity="0.56"/>
  <ellipse cx="380" cy="250" rx="340" ry="170" transform="rotate(-14 380 250)" fill="#362f20" opacity="0.52" filter="url(#brdBlur)"/>
  <ellipse cx="1180" cy="270" rx="280" ry="150" transform="rotate(18 1180 270)" fill="#5c4728" opacity="0.28" filter="url(#brdBlur)"/>
  <ellipse cx="920" cy="800" rx="400" ry="160" fill="#262218" opacity="0.58" filter="url(#brdBlur)"/>
</svg>`);

const micaLightWall = svgUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="mlBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#eef4fb"/>
      <stop offset="52%" stop-color="#e3edf8"/>
      <stop offset="100%" stop-color="#d5e4f5"/>
    </linearGradient>
    <linearGradient id="mlAurora" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#6fa8e8" stop-opacity="0.34"/>
      <stop offset="50%" stop-color="#8ac8e8" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="#a8bae8" stop-opacity="0.3"/>
    </linearGradient>
    <filter id="mlBlur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="28"/></filter>
  </defs>
  <rect width="1600" height="1000" fill="url(#mlBg)"/>
  <path d="M-80 680 C280 400 660 720 1060 420 C1340 210 1500 360 1700 200 L1700 1060 L-80 1060 Z" fill="url(#mlAurora)"/>
  <ellipse cx="320" cy="220" rx="340" ry="180" transform="rotate(-16 320 220)" fill="#b3d4f5" opacity="0.56" filter="url(#mlBlur)"/>
  <ellipse cx="1220" cy="260" rx="300" ry="160" transform="rotate(14 1220 260)" fill="#ffffff" opacity="0.58" filter="url(#mlBlur)"/>
  <ellipse cx="980" cy="780" rx="380" ry="170" fill="#9bc2eb" opacity="0.36" filter="url(#mlBlur)"/>
</svg>`);

const micaDarkWall = svgUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="mdBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#070f1a"/>
      <stop offset="55%" stop-color="#0b1729"/>
      <stop offset="100%" stop-color="#050b14"/>
    </linearGradient>
    <linearGradient id="mdAurora" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#194a82" stop-opacity="0.55"/>
      <stop offset="55%" stop-color="#2c6db5" stop-opacity="0.32"/>
      <stop offset="100%" stop-color="#3c91c9" stop-opacity="0.18"/>
    </linearGradient>
    <filter id="mdBlur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="34"/></filter>
  </defs>
  <rect width="1600" height="1000" fill="url(#mdBg)"/>
  <path d="M-80 720 C280 430 660 740 1060 440 C1340 230 1500 370 1700 220 L1700 1060 L-80 1060 Z" fill="url(#mdAurora)"/>
  <ellipse cx="340" cy="240" rx="340" ry="180" transform="rotate(-18 340 240)" fill="#183f6e" opacity="0.52" filter="url(#mdBlur)"/>
  <ellipse cx="1200" cy="250" rx="300" ry="160" transform="rotate(16 1200 250)" fill="#2a68ad" opacity="0.28" filter="url(#mdBlur)"/>
  <ellipse cx="960" cy="800" rx="380" ry="170" fill="#123157" opacity="0.58" filter="url(#mdBlur)"/>
</svg>`);

export const THEME_META_MAP: Record<ThemeId, ThemeMeta> = {
  '1': {
    id: '1',
    name: 'Heritage Atelier Study',
    tagline: 'Original Walnut & Brass Linen Study · Espresso Night · Calacatta Marble Leisure',
    lightBg: '#f6f2ea',
    lightSurface: '#fdfbf7',
    lightRaised: '#efe4d4',
    lightHeader: '#f8f4eb',
    lightBorder: '#e2d7c5',
    lightInk: '#1c140e',
    lightMuted: '#6b5340',
    lightAccent: '#a47c43',
    lightAccentSoft: 'rgba(164, 124, 67, 0.14)',
    darkBg: '#080402',
    darkSurface: '#110804',
    darkRaised: '#1b0d06',
    darkHeader: '#0c0603',
    darkBorder: '#2e180c',
    darkInk: '#efe4d4',
    darkMuted: '#b79a79',
    darkAccent: '#d4a373',
    darkAccentSoft: 'rgba(212, 163, 115, 0.16)',
    shapeName: 'Soft Pill',
    buttonRadius: '11px',
    sidebar: {
      light: {
        railBg: 'linear-gradient(180deg, #faf6ee 0%, #f1e8da 55%, #e8dcc9 100%)',
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
        activeBtnBg: 'linear-gradient(155deg, #272422 0%, #181615 100%)',
        activeBtnBorder: 'rgba(218, 185, 128, 0.24)',
        activeBtnText: '#f5efe6',
        idleBtnBg: 'transparent',
        idleBtnText: '#d9cbb7',
        activeIconColor: '#e6c585',
        idleIconColor: '#cfb99f',
        toggleBtnBg: 'rgba(26, 13, 6, 0.92)',
        toggleBtnText: '#cfb99f',
        toggleBtnBorder: '#321b0e',
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
    darkBg: '#08120c',
    darkSurface: 'rgba(13, 28, 19, 0.86)',
    darkRaised: 'rgba(22, 44, 30, 0.88)',
    darkHeader: 'rgba(10, 22, 15, 0.86)',
    darkBorder: '#23422e',
    darkInk: '#e3f0e6',
    darkMuted: '#98bca2',
    darkAccent: '#58b37c',
    darkAccentSoft: 'rgba(88, 179, 124, 0.16)',
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
        railBg: 'linear-gradient(180deg, rgba(13,29,20,0.88) 0%, rgba(9,20,14,0.9) 58%, rgba(6,13,9,0.94) 100%)',
        railBorder: '#1f3e2a',
        railText: '#e3f0e6',
        brandSectionBg: 'linear-gradient(155deg, rgba(26,58,38,0.68) 0%, rgba(12,30,19,0.78) 100%)',
        navSectionBg: 'linear-gradient(180deg, rgba(19,44,29,0.56) 0%, rgba(11,26,17,0.68) 100%)',
        thoughtSectionBg: 'linear-gradient(155deg, rgba(24,54,36,0.72) 0%, rgba(11,28,18,0.82) 100%)',
        footerSectionBg: 'linear-gradient(180deg, rgba(18,40,26,0.75) 0%, rgba(9,21,14,0.88) 100%)',
        sectionBorder: 'rgba(88,179,124,0.22)',
        activeBtnBg: 'linear-gradient(145deg, #2b6442 0%, #1c442d 100%)',
        activeBtnBorder: '#479466',
        activeBtnText: '#ffffff',
        idleBtnBg: 'rgba(18,40,27,0.52)',
        idleBtnText: '#cfe5d5',
        activeIconColor: '#a7f3d0',
        idleIconColor: '#6ec490',
        toggleBtnBg: 'linear-gradient(180deg, rgba(26,56,37,0.9) 0%, rgba(14,32,21,0.94) 100%)',
        toggleBtnText: '#c5e2cd',
        toggleBtnBorder: '#2b593c',
        mutedLabelColor: '#7eb290',
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
        activeBtnBg: 'linear-gradient(145deg, #216680 0%, #154659 100%)',
        activeBtnBorder: '#3b92b0',
        activeBtnText: '#ffffff',
        idleBtnBg: 'rgba(16,38,58,0.54)',
        idleBtnText: '#cbe1ef',
        activeIconColor: '#bae6fd',
        idleIconColor: '#6bbdd8',
        toggleBtnBg: 'linear-gradient(180deg, rgba(22,50,74,0.9) 0%, rgba(12,30,46,0.94) 100%)',
        toggleBtnText: '#cbe1ef',
        toggleBtnBorder: '#285678',
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
        activeBtnBg: 'linear-gradient(145deg, #3c597d 0%, #273c57 100%)',
        activeBtnBorder: '#5d83b3',
        activeBtnText: '#ffffff',
        idleBtnBg: 'rgba(22,34,52,0.56)',
        idleBtnText: '#cfddf0',
        activeIconColor: '#fde68a',
        idleIconColor: '#8ab0de',
        toggleBtnBg: 'linear-gradient(180deg, rgba(28,43,64,0.9) 0%, rgba(16,25,39,0.94) 100%)',
        toggleBtnText: '#cfddf0',
        toggleBtnBorder: '#3a5478',
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
    name: 'Swiss Alpine Atelier',
    tagline: 'Glacier Slate & Terracotta · Precision Drafting Wallpaper · Micro-Rectilinear Buttons',
    lightBg: '#eef0f2',
    lightSurface: 'rgba(250, 250, 251, 0.88)',
    lightRaised: 'rgba(232, 235, 239, 0.9)',
    lightHeader: 'rgba(246, 247, 249, 0.86)',
    lightBorder: '#c6ccd4',
    lightInk: '#171b21',
    lightMuted: '#535d69',
    lightAccent: '#a84732',
    lightAccentSoft: 'rgba(168, 71, 50, 0.13)',
    darkBg: '#0d1015',
    darkSurface: 'rgba(19, 24, 31, 0.88)',
    darkRaised: 'rgba(29, 36, 46, 0.9)',
    darkHeader: 'rgba(15, 19, 25, 0.88)',
    darkBorder: '#2e3847',
    darkInk: '#eef1f5',
    darkMuted: '#9aa5b5',
    darkAccent: '#df7860',
    darkAccentSoft: 'rgba(223, 120, 96, 0.16)',
    shapeName: 'Swiss Precision (3px)',
    buttonRadius: '3px',
    lightWallpaperUri: alpineLightWall,
    darkWallpaperUri: alpineDarkWall,
    sidebar: {
      light: {
        railBg: 'linear-gradient(180deg, rgba(242,244,247,0.9) 0%, rgba(232,235,240,0.9) 58%, rgba(221,226,232,0.94) 100%)',
        railBorder: '#c4cad2',
        railText: '#171b21',
        brandSectionBg: 'linear-gradient(155deg, rgba(252,253,254,0.88) 0%, rgba(230,234,239,0.8) 100%)',
        navSectionBg: 'linear-gradient(180deg, rgba(240,242,245,0.74) 0%, rgba(226,230,236,0.7) 100%)',
        thoughtSectionBg: 'linear-gradient(155deg, rgba(244,238,236,0.84) 0%, rgba(226,229,235,0.78) 100%)',
        footerSectionBg: 'linear-gradient(180deg, rgba(230,234,240,0.86) 0%, rgba(217,222,230,0.92) 100%)',
        sectionBorder: 'rgba(110,120,136,0.24)',
        activeBtnBg: 'linear-gradient(145deg, #a6432e 0%, #833221 100%)',
        activeBtnBorder: '#bf563f',
        activeBtnText: '#ffffff',
        idleBtnBg: 'rgba(255,255,255,0.4)',
        idleBtnText: '#2c343f',
        activeIconColor: '#fde2d8',
        idleIconColor: '#667180',
        toggleBtnBg: 'linear-gradient(180deg, rgba(240,243,247,0.94) 0%, rgba(223,228,234,0.94) 100%)',
        toggleBtnText: '#2e3743',
        toggleBtnBorder: '#b8c0cb',
        mutedLabelColor: '#677280',
        thoughtColor: '#1f2630',
        authorColor: '#993d29',
        trashTextColor: '#8e242a',
        trashIconColor: '#a62a31',
      },
      dark: {
        railBg: 'linear-gradient(180deg, rgba(20,25,33,0.9) 0%, rgba(14,18,24,0.92) 58%, rgba(9,12,17,0.95) 100%)',
        railBorder: '#2c3645',
        railText: '#eef1f5',
        brandSectionBg: 'linear-gradient(155deg, rgba(35,43,56,0.72) 0%, rgba(19,24,31,0.84) 100%)',
        navSectionBg: 'linear-gradient(180deg, rgba(27,34,44,0.6) 0%, rgba(16,20,27,0.72) 100%)',
        thoughtSectionBg: 'linear-gradient(155deg, rgba(44,32,32,0.72) 0%, rgba(20,25,33,0.84) 100%)',
        footerSectionBg: 'linear-gradient(180deg, rgba(24,30,39,0.78) 0%, rgba(13,16,22,0.9) 100%)',
        sectionBorder: 'rgba(223,120,96,0.22)',
        activeBtnBg: 'linear-gradient(145deg, #ab4934 0%, #833322 100%)',
        activeBtnBorder: '#cf644c',
        activeBtnText: '#ffffff',
        idleBtnBg: 'rgba(26,32,42,0.56)',
        idleBtnText: '#d4dce6',
        activeIconColor: '#ffd9d0',
        idleIconColor: '#98a6b8',
        toggleBtnBg: 'linear-gradient(180deg, rgba(33,40,51,0.9) 0%, rgba(20,25,33,0.94) 100%)',
        toggleBtnText: '#d4dce6',
        toggleBtnBorder: '#3c485a',
        mutedLabelColor: '#8f9cac',
        thoughtColor: '#e8edf4',
        authorColor: '#df856f',
        trashTextColor: '#f08285',
        trashIconColor: '#eb6c70',
      },
    },
  },
  '6': {
    id: '6',
    name: 'Botanical Conservatory',
    tagline: 'Eucalyptus Glasshouse · Blurred Atrium Wallpaper · Conservatory Arch Buttons',
    lightBg: '#eaf3ef',
    lightSurface: 'rgba(247, 252, 250, 0.86)',
    lightRaised: 'rgba(225, 239, 234, 0.88)',
    lightHeader: 'rgba(241, 249, 246, 0.84)',
    lightBorder: '#b7d2c8',
    lightInk: '#132824',
    lightMuted: '#42665e',
    lightAccent: '#1f6f62',
    lightAccentSoft: 'rgba(31, 111, 98, 0.14)',
    darkBg: '#071412',
    darkSurface: 'rgba(11, 28, 25, 0.86)',
    darkRaised: 'rgba(18, 44, 39, 0.88)',
    darkHeader: 'rgba(8, 21, 19, 0.86)',
    darkBorder: '#204840',
    darkInk: '#e3f3ef',
    darkMuted: '#92c2b7',
    darkAccent: '#48b8a4',
    darkAccentSoft: 'rgba(72, 184, 164, 0.16)',
    shapeName: 'Conservatory Arch',
    buttonRadius: '14px 14px 4px 4px',
    lightWallpaperUri: conservatoryLightWall,
    darkWallpaperUri: conservatoryDarkWall,
    sidebar: {
      light: {
        railBg: 'linear-gradient(180deg, rgba(235,246,242,0.88) 0%, rgba(220,236,230,0.88) 58%, rgba(205,226,219,0.92) 100%)',
        railBorder: '#b6d1c7',
        railText: '#132824',
        brandSectionBg: 'linear-gradient(155deg, rgba(246,252,250,0.86) 0%, rgba(215,235,228,0.78) 100%)',
        navSectionBg: 'linear-gradient(180deg, rgba(233,245,240,0.72) 0%, rgba(213,232,225,0.68) 100%)',
        thoughtSectionBg: 'linear-gradient(155deg, rgba(222,240,234,0.84) 0%, rgba(198,224,215,0.76) 100%)',
        footerSectionBg: 'linear-gradient(180deg, rgba(215,234,227,0.84) 0%, rgba(196,221,212,0.9) 100%)',
        sectionBorder: 'rgba(38,122,108,0.22)',
        activeBtnBg: 'linear-gradient(145deg, #1f6b5f 0%, #154e45 100%)',
        activeBtnBorder: '#2c8a7b',
        activeBtnText: '#ffffff',
        idleBtnBg: 'rgba(255,255,255,0.34)',
        idleBtnText: '#1f423b',
        activeIconColor: '#a7f3d0',
        idleIconColor: '#256e62',
        toggleBtnBg: 'linear-gradient(180deg, rgba(231,244,239,0.92) 0%, rgba(208,228,221,0.92) 100%)',
        toggleBtnText: '#1f4740',
        toggleBtnBorder: '#a3c4b8',
        mutedLabelColor: '#48736a',
        thoughtColor: '#17322d',
        authorColor: '#1d6b5e',
        trashTextColor: '#8e242a',
        trashIconColor: '#a62a31',
      },
      dark: {
        railBg: 'linear-gradient(180deg, rgba(12,30,27,0.88) 0%, rgba(8,21,19,0.9) 58%, rgba(5,14,12,0.94) 100%)',
        railBorder: '#1f463e',
        railText: '#e3f3ef',
        brandSectionBg: 'linear-gradient(155deg, rgba(21,55,49,0.72) 0%, rgba(10,28,25,0.82) 100%)',
        navSectionBg: 'linear-gradient(180deg, rgba(16,42,37,0.58) 0%, rgba(9,24,21,0.7) 100%)',
        thoughtSectionBg: 'linear-gradient(155deg, rgba(22,56,49,0.72) 0%, rgba(11,29,25,0.84) 100%)',
        footerSectionBg: 'linear-gradient(180deg, rgba(16,39,35,0.76) 0%, rgba(7,19,17,0.9) 100%)',
        sectionBorder: 'rgba(72,184,164,0.22)',
        activeBtnBg: 'linear-gradient(145deg, #217062 0%, #154d43 100%)',
        activeBtnBorder: '#3b9f8d',
        activeBtnText: '#ffffff',
        idleBtnBg: 'rgba(15,38,34,0.54)',
        idleBtnText: '#c8e5de',
        activeIconColor: '#99f6e4',
        idleIconColor: '#66c2b0',
        toggleBtnBg: 'linear-gradient(180deg, rgba(22,52,46,0.9) 0%, rgba(11,30,26,0.94) 100%)',
        toggleBtnText: '#c8e5de',
        toggleBtnBorder: '#295b51',
        mutedLabelColor: '#75b5a8',
        thoughtColor: '#dff2ee',
        authorColor: '#6ad1be',
        trashTextColor: '#f08285',
        trashIconColor: '#eb6c70',
      },
    },
  },
  '7': {
    id: '7',
    name: 'Nocturne Observatory',
    tagline: 'Midnight Indigo & Brass · Blurred Celestial Wallpaper · Counter-Chamfer Buttons',
    lightBg: '#efeef3',
    lightSurface: 'rgba(249, 248, 252, 0.87)',
    lightRaised: 'rgba(232, 229, 240, 0.88)',
    lightHeader: 'rgba(245, 243, 250, 0.85)',
    lightBorder: '#c8c3d6',
    lightInk: '#1b1a2e',
    lightMuted: '#535170',
    lightAccent: '#4b4a8a',
    lightAccentSoft: 'rgba(75, 74, 138, 0.14)',
    darkBg: '#080b16',
    darkSurface: 'rgba(14, 18, 34, 0.87)',
    darkRaised: 'rgba(23, 29, 52, 0.89)',
    darkHeader: 'rgba(10, 14, 27, 0.87)',
    darkBorder: '#2a3357',
    darkInk: '#eaeaf6',
    darkMuted: '#a2a7cb',
    darkAccent: '#c9a65b',
    darkAccentSoft: 'rgba(201, 166, 91, 0.17)',
    shapeName: 'Counter-Chamfer',
    buttonRadius: '4px 15px 4px 15px',
    lightWallpaperUri: observatoryLightWall,
    darkWallpaperUri: observatoryDarkWall,
    sidebar: {
      light: {
        railBg: 'linear-gradient(180deg, rgba(242,240,248,0.89) 0%, rgba(231,228,240,0.89) 58%, rgba(219,215,232,0.93) 100%)',
        railBorder: '#c4bed6',
        railText: '#1b1a2e',
        brandSectionBg: 'linear-gradient(155deg, rgba(250,249,253,0.88) 0%, rgba(228,224,240,0.8) 100%)',
        navSectionBg: 'linear-gradient(180deg, rgba(239,236,247,0.74) 0%, rgba(224,220,236,0.7) 100%)',
        thoughtSectionBg: 'linear-gradient(155deg, rgba(243,238,228,0.84) 0%, rgba(226,222,238,0.78) 100%)',
        footerSectionBg: 'linear-gradient(180deg, rgba(229,225,238,0.84) 0%, rgba(215,210,228,0.9) 100%)',
        sectionBorder: 'rgba(84,78,136,0.22)',
        activeBtnBg: 'linear-gradient(145deg, #43437d 0%, #2f2f5c 100%)',
        activeBtnBorder: '#5d5da1',
        activeBtnText: '#ffffff',
        idleBtnBg: 'rgba(255,255,255,0.36)',
        idleBtnText: '#2c2b4a',
        activeIconColor: '#fde68a',
        idleIconColor: '#4e4d8c',
        toggleBtnBg: 'linear-gradient(180deg, rgba(238,235,247,0.92) 0%, rgba(220,216,234,0.92) 100%)',
        toggleBtnText: '#313054',
        toggleBtnBorder: '#b5afd0',
        mutedLabelColor: '#605d85',
        thoughtColor: '#22213b',
        authorColor: '#8d6a29',
        trashTextColor: '#8e242a',
        trashIconColor: '#a62a31',
      },
      dark: {
        railBg: 'linear-gradient(180deg, rgba(15,19,37,0.89) 0%, rgba(10,13,26,0.91) 58%, rgba(6,8,18,0.95) 100%)',
        railBorder: '#283154',
        railText: '#eaeaf6',
        brandSectionBg: 'linear-gradient(155deg, rgba(30,36,68,0.72) 0%, rgba(14,18,35,0.84) 100%)',
        navSectionBg: 'linear-gradient(180deg, rgba(22,27,52,0.58) 0%, rgba(12,16,32,0.7) 100%)',
        thoughtSectionBg: 'linear-gradient(155deg, rgba(42,37,26,0.68) 0%, rgba(17,22,42,0.84) 100%)',
        footerSectionBg: 'linear-gradient(180deg, rgba(21,26,48,0.76) 0%, rgba(10,13,25,0.9) 100%)',
        sectionBorder: 'rgba(201,166,91,0.22)',
        activeBtnBg: 'linear-gradient(145deg, #4b498a 0%, #323163 100%)',
        activeBtnBorder: '#c9a65b',
        activeBtnText: '#ffffff',
        idleBtnBg: 'rgba(21,26,49,0.56)',
        idleBtnText: '#d6d7ed',
        activeIconColor: '#fde68a',
        idleIconColor: '#a4a7d6',
        toggleBtnBg: 'linear-gradient(180deg, rgba(28,34,62,0.9) 0%, rgba(16,20,38,0.94) 100%)',
        toggleBtnText: '#d6d7ed',
        toggleBtnBorder: '#3a4573',
        mutedLabelColor: '#9194bf',
        thoughtColor: '#e8e8f5',
        authorColor: '#e0bc6b',
        trashTextColor: '#f08285',
        trashIconColor: '#eb6c70',
      },
    },
  },
  '8': {
    id: '8',
    name: 'Rosewood Scriptorium',
    tagline: 'Burgundy Rosewood & Cream · Blurred Scriptorium Wallpaper · Bookplate Buttons',
    lightBg: '#f5ecee',
    lightSurface: 'rgba(253, 248, 249, 0.87)',
    lightRaised: 'rgba(239, 224, 228, 0.88)',
    lightHeader: 'rgba(250, 242, 244, 0.85)',
    lightBorder: '#d7bcc3',
    lightInk: '#2b131b',
    lightMuted: '#6d4451',
    lightAccent: '#7d2f45',
    lightAccentSoft: 'rgba(125, 47, 69, 0.14)',
    darkBg: '#14080c',
    darkSurface: 'rgba(28, 12, 18, 0.87)',
    darkRaised: 'rgba(43, 19, 28, 0.89)',
    darkHeader: 'rgba(21, 9, 14, 0.87)',
    darkBorder: '#4c2231',
    darkInk: '#f4e6ea',
    darkMuted: '#c79aa7',
    darkAccent: '#d67e96',
    darkAccentSoft: 'rgba(214, 126, 150, 0.16)',
    shapeName: 'Bookplate Flag',
    buttonRadius: '4px 15px 15px 4px',
    lightWallpaperUri: rosewoodLightWall,
    darkWallpaperUri: rosewoodDarkWall,
    sidebar: {
      light: {
        railBg: 'linear-gradient(180deg, rgba(249,241,243,0.89) 0%, rgba(240,226,230,0.89) 58%, rgba(230,212,218,0.93) 100%)',
        railBorder: '#d5b9c0',
        railText: '#2b131b',
        brandSectionBg: 'linear-gradient(155deg, rgba(254,249,250,0.88) 0%, rgba(240,222,227,0.8) 100%)',
        navSectionBg: 'linear-gradient(180deg, rgba(246,235,238,0.74) 0%, rgba(234,218,223,0.7) 100%)',
        thoughtSectionBg: 'linear-gradient(155deg, rgba(243,229,233,0.84) 0%, rgba(228,210,216,0.78) 100%)',
        footerSectionBg: 'linear-gradient(180deg, rgba(238,222,226,0.84) 0%, rgba(225,205,211,0.9) 100%)',
        sectionBorder: 'rgba(125,47,69,0.22)',
        activeBtnBg: 'linear-gradient(145deg, #7a2d44 0%, #571f30 100%)',
        activeBtnBorder: '#9b3e5a',
        activeBtnText: '#ffffff',
        idleBtnBg: 'rgba(255,255,255,0.34)',
        idleBtnText: '#4a2430',
        activeIconColor: '#fde68a',
        idleIconColor: '#82344b',
        toggleBtnBg: 'linear-gradient(180deg, rgba(247,236,239,0.92) 0%, rgba(232,214,220,0.92) 100%)',
        toggleBtnText: '#4e2431',
        toggleBtnBorder: '#c9a8b2',
        mutedLabelColor: '#7d4d5b',
        thoughtColor: '#361822',
        authorColor: '#822c44',
        trashTextColor: '#8e1c24',
        trashIconColor: '#a6222c',
      },
      dark: {
        railBg: 'linear-gradient(180deg, rgba(31,13,20,0.89) 0%, rgba(21,9,14,0.91) 58%, rgba(13,5,8,0.95) 100%)',
        railBorder: '#4c2130',
        railText: '#f4e6ea',
        brandSectionBg: 'linear-gradient(155deg, rgba(58,23,36,0.72) 0%, rgba(28,11,17,0.84) 100%)',
        navSectionBg: 'linear-gradient(180deg, rgba(43,17,27,0.58) 0%, rgba(24,10,15,0.7) 100%)',
        thoughtSectionBg: 'linear-gradient(155deg, rgba(54,23,33,0.72) 0%, rgba(25,11,16,0.84) 100%)',
        footerSectionBg: 'linear-gradient(180deg, rgba(39,15,24,0.76) 0%, rgba(19,8,12,0.9) 100%)',
        sectionBorder: 'rgba(214,126,150,0.22)',
        activeBtnBg: 'linear-gradient(145deg, #87324b 0%, #5e2033 100%)',
        activeBtnBorder: '#b55470',
        activeBtnText: '#ffffff',
        idleBtnBg: 'rgba(42,17,26,0.56)',
        idleBtnText: '#ebd4dc',
        activeIconColor: '#fde68a',
        idleIconColor: '#d48da1',
        toggleBtnBg: 'linear-gradient(180deg, rgba(54,23,34,0.9) 0%, rgba(30,13,19,0.94) 100%)',
        toggleBtnText: '#ebd4dc',
        toggleBtnBorder: '#663042',
        mutedLabelColor: '#b57b8c',
        thoughtColor: '#f2e2e7',
        authorColor: '#e08ca4',
        trashTextColor: '#f58b8e',
        trashIconColor: '#ee7276',
      },
    },
  },
  '9': {
    id: '9',
    name: 'Archival Broadsheet',
    tagline: 'Newsprint Vellum & Ink · Blurred Press Wallpaper · Tactile Press-Stamp Buttons',
    lightBg: '#f3ede0',
    lightSurface: 'rgba(251, 248, 240, 0.88)',
    lightRaised: 'rgba(235, 227, 210, 0.9)',
    lightHeader: 'rgba(247, 243, 233, 0.86)',
    lightBorder: '#cfc4ac',
    lightInk: '#1b1915',
    lightMuted: '#5e5648',
    lightAccent: '#75532a',
    lightAccentSoft: 'rgba(117, 83, 42, 0.14)',
    darkBg: '#100f0b',
    darkSurface: 'rgba(23, 21, 16, 0.88)',
    darkRaised: 'rgba(35, 32, 24, 0.9)',
    darkHeader: 'rgba(18, 16, 12, 0.88)',
    darkBorder: '#3d372a',
    darkInk: '#efeae0',
    darkMuted: '#b0a792',
    darkAccent: '#cfa86b',
    darkAccentSoft: 'rgba(207, 168, 107, 0.16)',
    shapeName: 'Press Stamp',
    buttonRadius: '6px',
    lightWallpaperUri: broadsheetLightWall,
    darkWallpaperUri: broadsheetDarkWall,
    sidebar: {
      light: {
        railBg: 'linear-gradient(180deg, rgba(246,241,230,0.9) 0%, rgba(235,227,212,0.9) 58%, rgba(224,214,196,0.94) 100%)',
        railBorder: '#cbc0a8',
        railText: '#1b1915',
        brandSectionBg: 'linear-gradient(155deg, rgba(252,249,241,0.88) 0%, rgba(233,225,209,0.8) 100%)',
        navSectionBg: 'linear-gradient(180deg, rgba(244,238,225,0.74) 0%, rgba(230,222,206,0.7) 100%)',
        thoughtSectionBg: 'linear-gradient(155deg, rgba(240,233,219,0.84) 0%, rgba(226,217,199,0.78) 100%)',
        footerSectionBg: 'linear-gradient(180deg, rgba(234,226,209,0.86) 0%, rgba(221,211,191,0.92) 100%)',
        sectionBorder: 'rgba(117,83,42,0.22)',
        activeBtnBg: 'linear-gradient(145deg, #544636 0%, #3a3025 100%)',
        activeBtnBorder: '#705e48',
        activeBtnText: '#ffffff',
        idleBtnBg: 'rgba(255,255,255,0.34)',
        idleBtnText: '#383229',
        activeIconColor: '#f3d299',
        idleIconColor: '#695944',
        toggleBtnBg: 'linear-gradient(180deg, rgba(243,237,224,0.92) 0%, rgba(226,218,202,0.92) 100%)',
        toggleBtnText: '#3b342b',
        toggleBtnBorder: '#beb299',
        mutedLabelColor: '#6e6454',
        thoughtColor: '#26221b',
        authorColor: '#75532a',
        trashTextColor: '#8e242a',
        trashIconColor: '#a62a31',
      },
      dark: {
        railBg: 'linear-gradient(180deg, rgba(24,22,17,0.9) 0%, rgba(17,15,11,0.92) 58%, rgba(11,10,7,0.95) 100%)',
        railBorder: '#3b3528',
        railText: '#efeae0',
        brandSectionBg: 'linear-gradient(155deg, rgba(44,40,30,0.72) 0%, rgba(22,20,15,0.84) 100%)',
        navSectionBg: 'linear-gradient(180deg, rgba(33,30,23,0.58) 0%, rgba(19,17,13,0.7) 100%)',
        thoughtSectionBg: 'linear-gradient(155deg, rgba(41,36,26,0.72) 0%, rgba(21,19,14,0.84) 100%)',
        footerSectionBg: 'linear-gradient(180deg, rgba(30,27,20,0.78) 0%, rgba(15,13,10,0.9) 100%)',
        sectionBorder: 'rgba(207,168,107,0.22)',
        activeBtnBg: 'linear-gradient(145deg, #69563c 0%, #483b28 100%)',
        activeBtnBorder: '#917853',
        activeBtnText: '#ffffff',
        idleBtnBg: 'rgba(32,29,22,0.56)',
        idleBtnText: '#dfd8ca',
        activeIconColor: '#fde68a',
        idleIconColor: '#bfa67a',
        toggleBtnBg: 'linear-gradient(180deg, rgba(40,36,27,0.9) 0%, rgba(23,21,16,0.94) 100%)',
        toggleBtnText: '#dfd8ca',
        toggleBtnBorder: '#504736',
        mutedLabelColor: '#a39782',
        thoughtColor: '#ece6da',
        authorColor: '#d1ac70',
        trashTextColor: '#f08285',
        trashIconColor: '#eb6c70',
      },
    },
  },
  '10': {
    id: '10',
    name: 'Fluent Mica Studio',
    tagline: 'Fjord Azure & Mist Glass · Blurred Aurora Wallpaper · Soft Squircle Buttons',
    lightBg: '#eaf1f8',
    lightSurface: 'rgba(246, 250, 255, 0.84)',
    lightRaised: 'rgba(226, 236, 248, 0.88)',
    lightHeader: 'rgba(241, 247, 253, 0.82)',
    lightBorder: '#b8cbe0',
    lightInk: '#132236',
    lightMuted: '#465f7e',
    lightAccent: '#2563a8',
    lightAccentSoft: 'rgba(37, 99, 168, 0.14)',
    darkBg: '#070f19',
    darkSurface: 'rgba(12, 23, 38, 0.84)',
    darkRaised: 'rgba(20, 37, 59, 0.88)',
    darkHeader: 'rgba(9, 18, 30, 0.85)',
    darkBorder: '#233f63',
    darkInk: '#e4eef9',
    darkMuted: '#92b0d4',
    darkAccent: '#5ea1e6',
    darkAccentSoft: 'rgba(94, 161, 230, 0.16)',
    shapeName: 'Fluent Squircle',
    buttonRadius: '10px',
    lightWallpaperUri: micaLightWall,
    darkWallpaperUri: micaDarkWall,
    sidebar: {
      light: {
        railBg: 'linear-gradient(180deg, rgba(236,243,251,0.88) 0%, rgba(224,234,246,0.88) 58%, rgba(210,224,241,0.92) 100%)',
        railBorder: '#b8cbe0',
        railText: '#132236',
        brandSectionBg: 'linear-gradient(155deg, rgba(246,250,255,0.86) 0%, rgba(218,232,248,0.78) 100%)',
        navSectionBg: 'linear-gradient(180deg, rgba(233,242,251,0.72) 0%, rgba(216,229,245,0.68) 100%)',
        thoughtSectionBg: 'linear-gradient(155deg, rgba(225,237,250,0.84) 0%, rgba(206,223,242,0.76) 100%)',
        footerSectionBg: 'linear-gradient(180deg, rgba(218,231,247,0.84) 0%, rgba(202,218,238,0.9) 100%)',
        sectionBorder: 'rgba(37,99,168,0.22)',
        activeBtnBg: 'linear-gradient(145deg, #25609e 0%, #194575 100%)',
        activeBtnBorder: '#3b7ec4',
        activeBtnText: '#ffffff',
        idleBtnBg: 'rgba(255,255,255,0.38)',
        idleBtnText: '#223a56',
        activeIconColor: '#bae6fd',
        idleIconColor: '#2d639c',
        toggleBtnBg: 'linear-gradient(180deg, rgba(232,241,251,0.92) 0%, rgba(212,226,242,0.92) 100%)',
        toggleBtnText: '#244163',
        toggleBtnBorder: '#a8c0db',
        mutedLabelColor: '#4c6d91',
        thoughtColor: '#192d45',
        authorColor: '#235c99',
        trashTextColor: '#8e242a',
        trashIconColor: '#a62a31',
      },
      dark: {
        railBg: 'linear-gradient(180deg, rgba(13,24,40,0.88) 0%, rgba(9,17,29,0.9) 58%, rgba(6,11,20,0.94) 100%)',
        railBorder: '#213c60',
        railText: '#e4eef9',
        brandSectionBg: 'linear-gradient(155deg, rgba(24,47,76,0.72) 0%, rgba(11,22,38,0.84) 100%)',
        navSectionBg: 'linear-gradient(180deg, rgba(18,36,59,0.58) 0%, rgba(10,20,34,0.7) 100%)',
        thoughtSectionBg: 'linear-gradient(155deg, rgba(24,45,74,0.72) 0%, rgba(11,23,39,0.84) 100%)',
        footerSectionBg: 'linear-gradient(180deg, rgba(17,33,54,0.76) 0%, rgba(8,16,28,0.9) 100%)',
        sectionBorder: 'rgba(94,161,230,0.22)',
        activeBtnBg: 'linear-gradient(145deg, #2762a3 0%, #194473 100%)',
        activeBtnBorder: '#478cd4',
        activeBtnText: '#ffffff',
        idleBtnBg: 'rgba(17,34,56,0.56)',
        idleBtnText: '#cce0f5',
        activeIconColor: '#bae6fd',
        idleIconColor: '#75b2ed',
        toggleBtnBg: 'linear-gradient(180deg, rgba(24,46,74,0.9) 0%, rgba(13,26,44,0.94) 100%)',
        toggleBtnText: '#cce0f5',
        toggleBtnBorder: '#305482',
        mutedLabelColor: '#7ca2cc',
        thoughtColor: '#dfebf7',
        authorColor: '#72b4f2',
        trashTextColor: '#f08285',
        trashIconColor: '#eb6c70',
      },
    },
  },
};

export function getThemeMeta(designId?: string | null): ThemeMeta {
  const key = (designId || '1') as ThemeId;
  return THEME_META_MAP[key] || THEME_META_MAP['1'];
}
