export interface LeisureCategory {
  id: string;
  title: string;
  tagline: string;
  image: string;
  badge: string;
  color: string;
  iconName?: string;
  quickDescription: string;
  isCustom?: boolean;
}

export const INITIAL_LEISURE_CATEGORIES: LeisureCategory[] = [
  {
    id: 'language',
    title: 'Language Learning (Quick Medical Spanish & Roots)',
    tagline: 'High-yield conversational phrases, clinical questions & Latin/Greek roots',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80',
    badge: 'Skill Byte',
    color: '#0284c7',
    quickDescription: 'Emergency triage Spanish & anatomical root decoders',
  },
  {
    id: 'vocab',
    title: 'Visual Fun Vocab Test',
    tagline: 'Rich evocative vocabulary, rare words & etymology challenges with imagery',
    image: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80',
    badge: 'Word Game',
    color: '#9333ea',
    quickDescription: 'Picture-word association & diagnostic lexical mastery',
  },
  {
    id: 'coding',
    title: 'Short Programmers & Logic',
    tagline: 'Bite-sized Python algorithms, medical logic gates & data loops',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
    badge: 'Tech Skill',
    color: '#8f5f2c',
    quickDescription: 'Clinical score calculators & boolean triage circuits',
  },
  {
    id: 'science',
    title: 'Science & Cosmos',
    tagline: 'Deep space discoveries, quantum biology & mind wonders',
    image: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=600&q=80',
    badge: 'Mind Wonder',
    color: '#3b82f6',
    quickDescription: 'Glymphatic deep flush & quantum scent electron tunneling',
  },
  {
    id: 'travel',
    title: 'Travel & Escapes',
    tagline: 'Peaceful scenic walks: Amalfi Coast, Kyoto bamboo, Swiss Alps',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
    badge: 'Virtual Walk',
    color: '#0ea5e9',
    quickDescription: 'Amalfi Path of the Gods & Sagano bamboo wind rustle',
  },
  {
    id: 'tech',
    title: 'Future Tech & AI',
    tagline: 'Surgical robotics, bionic prosthetics & Neuralink medicine',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80',
    badge: 'Innovations',
    color: '#8b5cf6',
    quickDescription: 'Single-port robotic surgery & AI gigapixel histology screeners',
  },
  {
    id: 'games',
    title: '2-Min Brain Games',
    tagline: 'Medical word scramble, rapid diagnosis blitz & mini puzzles',
    image: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=600&q=80',
    badge: 'Mini-Game',
    color: '#ec4899',
    quickDescription: 'Playable medical anagram unscrambler with diagnostic clues',
  },
  {
    id: 'yoga',
    title: 'Desk Yoga & Posture',
    tagline: 'Seated spinal twist, eagle arms & 4-7-8 Pranayama breath',
    image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80',
    badge: '2-Min Reset',
    color: '#b57c52',
    quickDescription: '4-7-8 parasympathetic breath & thoracic spine reset',
  },
  {
    id: 'exercises',
    title: 'Quick Study Exercises',
    tagline: 'Doctor spinal decompression, carpal tunnel & 20-20-20 eye gym',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
    badge: 'Study Break',
    color: '#f59e0b',
    quickDescription: 'Median nerve glides, seated spinal twist & neck releases',
  },
  {
    id: 'food',
    title: 'Brain Fuel & Snacks',
    tagline: 'Antioxidant bowls, matcha l-theanine & ward smoothie fuel',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=600&q=80',
    badge: 'Nutrition',
    color: '#d97706',
    quickDescription: 'Matcha L-theanine sustained calm & dark cocoa flavonoids',
  },
  {
    id: 'nature',
    title: '10 Peace Ambient Soundscapes',
    tagline: 'Rain, Alpine Pines, Beach Waves, Fireplace, Tibetan Bowls, Quiet Library, Crickets, Cafe, Waterfall & Chimes',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80',
    badge: '10 Peace Sounds',
    color: '#4a76a4',
    quickDescription: 'Analog Web Audio synthesizer with 10 calming soundscapes & custom timer durations',
  },
];

export const EXPLORE_MORE_INTERESTS: LeisureCategory[] = [
  {
    id: 'chess',
    title: 'Speed Chess Tactics',
    tagline: 'Grandmaster mating nets, tactical puzzles & rapid spatial calculation',
    image: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=600&q=80',
    badge: 'Mental Strategy',
    color: '#475569',
    quickDescription: 'Tactical pawn forks, pins and queen sacrifice puzzles',
  },
  {
    id: 'coffee',
    title: 'Specialty Coffee & Brewing Science',
    tagline: 'Pour-over extraction dynamics, water TDS & roast profile chemistry',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    badge: 'Artisan',
    color: '#78350f',
    quickDescription: 'V60 bloom ratios, Aeropress recipes and bean origin profiles',
  },
  {
    id: 'stoicism',
    title: 'Stoic Ward Philosophy',
    tagline: 'Marcus Aurelius, Epictetus & managing uncontrollable hospital stressors',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    badge: 'Mindset',
    color: '#334155',
    quickDescription: 'Dichotomy of control & equanimity in high-stakes clinical rounds',
  },
  {
    id: 'astronomy',
    title: 'Astrophotography & Telescopes',
    tagline: 'Nebulae, planetary orbits, James Webb deep field infrared spectroscopy',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
    badge: 'Stargazing',
    color: '#1e1b4b',
    quickDescription: 'Orion nebula hydrogen-alpha flares and lunar craters',
  },
  {
    id: 'origami',
    title: 'Origami & Surgical Dexterity',
    tagline: 'Fine motor precision, geometric folds & procedural finger stamina',
    image: 'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?auto=format&fit=crop&w=600&q=80',
    badge: 'Dexterity',
    color: '#e11d48',
    quickDescription: 'Traditional cranes, tessellations and microsurgical folding exercises',
  },
  {
    id: 'bonsai',
    title: 'Indoor Bonsai & Micro-Gardening',
    tagline: 'Pruning aesthetics, root wiring, soil moisture & mindful patience',
    image: 'https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=600&q=80',
    badge: 'Botanical',
    color: '#936e44',
    quickDescription: 'Juniper wiring techniques & indoor ficus microcarpa care',
  },
  {
    id: 'calligraphy',
    title: 'Calligraphy & Fountain Pen Ink',
    tagline: 'Nib flex mechanics, copperplate flourishes & ink shading chromatography',
    image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=600&q=80',
    badge: 'Craftsmanship',
    color: '#b45309',
    quickDescription: 'Spencerian script drills & Japanese pigment ink explorations',
  },
  {
    id: 'cooking',
    title: 'Culinary Knife Skills & Flavor Balancing',
    tagline: 'Julienne cuts, Maillard reactions, umami pairing & 15-minute healthy meals',
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80',
    badge: 'Culinary',
    color: '#c2410c',
    quickDescription: 'Japanese Santoku techniques & high-protein stir-fry balancing',
  },
];

// Alias for backwards compatibility
export const LEISURE_CATEGORIES = INITIAL_LEISURE_CATEGORIES;

export interface ScrambleWord {
  word: string;
  clue: string;
}

export const SCRAMBLE_WORDS: ScrambleWord[] = [
  { word: 'SYNAPSE', clue: 'Microscopic junction where neurotransmitters pass chemical signals' },
  { word: 'ANEURYSM', clue: 'Localized ballooning or dilation of an arterial vessel wall' },
  { word: 'NEPHRON', clue: 'Functional microscopic filtering unit of the human kidney' },
  { word: 'MYOCARDIUM', clue: 'Muscular middle tissue layer of the heart wall' },
  { word: 'CEREBELLUM', clue: 'Brain structure responsible for motor coordination and balance' },
  { word: 'HEPATOCYTE', clue: 'Primary parenchymal tissue cell of the liver' },
];

export interface VocabQuestion {
  id: string;
  word: string;
  phonetic: string;
  options: string[];
  correctIndex: number;
  etymology: string;
  image: string;
  exampleSentence: string;
}

export const FUN_VOCAB_QUESTIONS: VocabQuestion[] = [
  {
    id: 'voc-1',
    word: 'Petrichor',
    phonetic: '/ˈpɛtrɪkɔːr/',
    options: [
      'The pleasant, earthy scent produced when rain falls on dry soil or stone',
      'The faint ringing sound heard after prolonged exposure to loud alarms',
      'A microscopic crystalloid precipitate found in synovial fluid',
      'An irrational fear of heights during surgical theater rotations',
    ],
    correctIndex: 0,
    etymology: 'From Greek petra ("stone") + ichor ("the ethereal fluid flowing in the veins of gods")',
    image: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80',
    exampleSentence: 'Stepping out of the 12-hour hospital shift into the rain, the petrichor instantly refreshed her tired senses.',
  },
  {
    id: 'voc-2',
    word: 'Clinomania',
    phonetic: '/ˌklaɪnoʊˈmeɪniə/',
    options: [
      'An excessive, obsessive urge to stay in bed and not get up',
      'The tendency to over-prescribe broad-spectrum antibiotics',
      'A clinical habit of pacing up and down ward corridors',
      'A heightened fear of clinical stethoscopes in pediatric wards',
    ],
    correctIndex: 0,
    etymology: 'From Greek klīnē ("bed") + mania ("madness / craving")',
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80',
    exampleSentence: 'After three consecutive night shifts in the trauma bay, severe clinomania was completely justified.',
  },
  {
    id: 'voc-3',
    word: 'Apricity',
    phonetic: '/əˈprɪsɪti/',
    options: [
      'The warm sensation of winter sunlight shining on skin on a cold day',
      'A sudden spike in blood pressure caused by white-coat syndrome',
      'The sharp citrus aroma of freshly peeled grapefruits in the cafeteria',
      'An anatomical indentation between the thoracic ribs',
    ],
    correctIndex: 0,
    etymology: 'From Latin aprīcitās ("sun warmth / exposed to the sun")',
    image: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=600&q=80',
    exampleSentence: 'Taking a 5-minute coffee break on the hospital terrace, the doctor basked in the gentle apricity.',
  },
  {
    id: 'voc-4',
    word: 'Sonder',
    phonetic: '/ˈsɒndər/',
    options: [
      'The realization that every random passerby lives a life as vivid and complex as your own',
      'A deep surgical incision along Langer lines to minimize scarring',
      'The echoing resonance heard when percussing a consolidated lung',
      'A specialized ultrasound probe used for bedside cardiac exams',
    ],
    correctIndex: 0,
    etymology: 'Coined by John Koenig in The Dictionary of Obscure Sorrows',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80',
    exampleSentence: 'Watching patients and families in the waiting pavilion, she was overwhelmed by a quiet sense of sonder.',
  },
];

export interface LanguagePhrase {
  id: string;
  category: 'ER Spanish' | 'Latin/Greek Roots' | 'French for Medics';
  foreign: string;
  phonetic: string;
  english: string;
  usageContext: string;
}

export const LANGUAGE_SHORT_PROGRAM: LanguagePhrase[] = [
  {
    id: 'sp-1',
    category: 'ER Spanish',
    foreign: '¿Dónde le duele exactamente?',
    phonetic: 'DOHN-deh leh DWEH-leh ek-sahk-tah-MEN-teh',
    english: 'Where does it hurt exactly?',
    usageContext: 'Crucial for immediate acute pain localization in triage without waiting for an interpreter.',
  },
  {
    id: 'sp-2',
    category: 'ER Spanish',
    foreign: 'Respire profundo por la boca y no se mueva.',
    phonetic: 'reh-SPEE-reh proh-FOON-doh por lah BOH-kah ee noh seh MWEH-vah',
    english: 'Breathe deeply through your mouth and do not move.',
    usageContext: 'Chest auscultation and bedside ultrasound instruction.',
  },
  {
    id: 'sp-3',
    category: 'ER Spanish',
    foreign: '¿Tiene alergia a algún medicamento como la penicilina?',
    phonetic: 'TYEH-neh ah-LEHR-hyah ah ahl-GOON meh-dee-kah-MEN-toh...',
    english: 'Are you allergic to any medication, such as penicillin?',
    usageContext: 'Prevents severe anaphylactic reactions before administering IV antibiotics.',
  },
  {
    id: 'root-1',
    category: 'Latin/Greek Roots',
    foreign: 'Hemato- / -emia',
    phonetic: 'Greek: haima (blood)',
    english: 'Blood / In the blood',
    usageContext: 'Hematoma (blood collection), Anemia (lack of blood), Uremia (urine waste in blood).',
  },
  {
    id: 'root-2',
    category: 'Latin/Greek Roots',
    foreign: 'Nephr- / Ren-',
    phonetic: 'Greek: nephros / Latin: renes',
    english: 'Kidney functional anatomy',
    usageContext: 'Nephrolithiasis (kidney stones), Renal artery stenosis, Nephrotic syndrome.',
  },
  {
    id: 'root-3',
    category: 'Latin/Greek Roots',
    foreign: '-itis vs -oma vs -ectomy',
    phonetic: 'Greek suffixes',
    english: 'Inflammation vs Tumor/Mass vs Surgical Excision',
    usageContext: 'Appendicitis (inflammation) -> Adenoma (glandular mass) -> Appendectomy (removal).',
  },
];

export interface LogicChallenge {
  id: string;
  title: string;
  snippet: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export type LeisureCategoryGroup =
  | 'wellness'
  | 'trivia'
  | 'languages'
  | 'logic'
  | 'psychology'
  | 'sociology'
  | 'history'
  | 'worldmap'
  | 'magazines'
  | 'art'
  | 'fashion'
  | 'motorsport'
  | 'gaming'
  | 'news';

export interface CategoryGroupItem {
  id: LeisureCategoryGroup;
  title: string;
  badge: string;
  description: string;
  image: string;
  subOptions: {
    id: string;
    label: string;
    icon: string;
    tagline: string;
  }[];
}

export const LEISURE_GROUPS: CategoryGroupItem[] = [
  {
    id: 'wellness',
    title: '🌿 Ocular Health & Breathing',
    badge: 'Decompression',
    description: 'Vagal nerve box breathing, 10 peace ambient soundscapes with duration timer & desk stretches',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80',
    subOptions: [
      { id: 'breathing', label: 'Box Breathing 4-4-4-4', icon: '🫁', tagline: 'Diaphragmatic vagal brake to lower heart rate' },
      { id: 'nature', label: '10 Peace Sounds & Timer', icon: '🌧️', tagline: '10 ambient soundscapes with custom duration timer' },
      { id: 'stretches', label: 'Median Nerve & Neck Stretch', icon: '🧘', tagline: 'Cervical spine & carpal tunnel decompression' },
      { id: 'travel', label: 'Virtual Nature Retreats', icon: '🌲', tagline: 'Kyoto bamboo groves & Swiss alpine lakes' },
    ],
  },
  {
    id: 'trivia',
    title: '☕ Word Scramble & Medical Trivia',
    badge: 'Cognitive Fun',
    description: 'Clinical anagram unscrambler, visual Greek/Latin vocabulary & coffee science',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
    subOptions: [
      { id: 'scramble', label: 'Medical Word Anagram Blitz', icon: '🎮', tagline: '2-minute rapid clinical term anagram solver' },
      { id: 'vocab', label: 'Visual Medical Vocab', icon: '✨', tagline: 'Evocative anatomical etymology challenge' },
      { id: 'coffee', label: 'Coffee Chemistry', icon: '☕', tagline: 'Caffeine extraction thermodynamics' },
    ],
  },
  {
    id: 'languages',
    title: '🗣️ Clinical Languages & Anatomical Roots',
    badge: 'Language Bytes',
    description: 'Emergency Room bedside Spanish phrases & classical etymology roots',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
    subOptions: [
      { id: 'er-spanish', label: 'ER Bedside Spanish Bytes', icon: '🇪🇸', tagline: 'Acute triage, vital signs & bedside pain scales' },
      { id: 'latin-roots', label: 'Latin & Greek Anatomical Roots', icon: '🏛️', tagline: 'Deconstruct complex clinical diagnostic terms' },
    ],
  },
  {
    id: 'logic',
    title: '💡 Focus Reset & Logic Programmers',
    badge: 'Logic & Code',
    description: 'Python medical logic test cases, Grandmaster chess tactical principles & Stoic philosophy',
    image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=600&q=80',
    subOptions: [
      { id: 'coding', label: 'Diagnostic Logic Programmers', icon: '💻', tagline: 'Algorithmic decision tree logic in Python' },
      { id: 'chess', label: 'Chess Tactical Principles', icon: '♟️', tagline: 'Tactical forks and decoy maneuvers for sharp thinking' },
      { id: 'stoicism', label: 'Stoic Mindset Reset', icon: '🏛️', tagline: 'Marcus Aurelius principles for ward resilience' },
    ],
  },
  {
    id: 'psychology',
    title: '🧠 Psychology & Human Behaviour',
    badge: 'Human Mind',
    description: 'Cognitive biases in daily life, body language micro-cues, decision fatigue & sleep architecture',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
    subOptions: [
      { id: 'daily-biases', label: 'Everyday Cognitive Biases', icon: '🔍', tagline: 'Halo effect, confirmation bias & anchoring in daily choices' },
      { id: 'body-language', label: 'Micro-Cues & Body Language', icon: '👀', tagline: 'Pupil dilation, shoulder posture & authentic vs polite smiles' },
      { id: 'decision-fatigue', label: 'Decision Fatigue & Willpower', icon: '⚡', tagline: 'Why willpower diminishes and how to protect mental bandwidth' },
      { id: 'sleep-cycles', label: 'Sleep & Glymphatic Reset', icon: '🌙', tagline: 'REM memory consolidation and neurotoxin brain flushing' },
    ],
  },
  {
    id: 'sociology',
    title: '👥 Sociology & Social Dynamics',
    badge: 'Social Systems',
    description: 'Crowd dynamics, institutional hierarchies, status games & bedside medical sociology',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80',
    subOptions: [
      { id: 'crowd-dynamics', label: 'Crowd Dynamics & Herding', icon: '👥', tagline: 'Bystander apathy, information cascades & social contagion' },
      { id: 'status-games', label: 'Status Symbols & Capital', icon: '🏆', tagline: 'Bourdieu’s cultural capital & subconscious social signaling' },
      { id: 'bedside-sociology', label: 'Hospital Ward Sociology', icon: '🏥', tagline: 'Goffman’s total institutions & empathetic bedside dynamics' },
    ],
  },
  {
    id: 'history',
    title: '🏛️ World History & Turning Points',
    badge: 'Civilization',
    description: 'Epochal historical pivots, landmark surgeries in ancient times & civilizational breakthroughs',
    image: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=600&q=80',
    subOptions: [
      { id: 'turning-points', label: 'Pivots of Human Civilization', icon: '📜', tagline: 'Library of Alexandria, Gutenberg press & the Silk Road' },
      { id: 'medical-history', label: 'Surgical & Medical Revolutions', icon: '⚕️', tagline: 'Vesalius anatomy, Lister carbolic antiseptic & Fleming penicillin' },
      { id: 'ancient-science', label: 'Ancient Civilizations & Science', icon: '🏺', tagline: 'Indus Valley drainage, Roman aqueducts & Sushruta Samhita' },
    ],
  },
  {
    id: 'worldmap',
    title: '🌍 World Map & Breathtaking Places',
    badge: 'Global Odyssey',
    description: 'Interactive geography, breathtaking natural wonders & majestic cultural sanctuaries',
    image: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80',
    subOptions: [
      { id: 'map-explorer', label: 'Global Map Atlas Coordinates', icon: '🗺️', tagline: 'Interactive landmark pins across seven continents' },
      { id: 'hidden-gems', label: 'Breathtaking Natural Wonders', icon: '🏔️', tagline: 'Salar de Uyuni salt mirrors, Svalbard & Zhangjiajie peaks' },
      { id: 'cultural-capitals', label: 'Sanctuaries & Historic Cities', icon: '🕌', tagline: 'Kyoto temple paths, Florence duomos & Varanasi river ghats' },
    ],
  },
  {
    id: 'magazines',
    title: '📖 Curated Magazines & Longform Reads',
    badge: 'Reading Lounge',
    description: 'The Lancet clinical digest, National Geographic expeditions, Architectural Digest aesthetics',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    subOptions: [
      { id: 'lancet-digest', label: 'The Lancet Clinical Digest', icon: '🩺', tagline: 'Frontier clinical trials and global health epidemiology' },
      { id: 'natgeo', label: 'National Geographic Explorer', icon: '🐅', tagline: 'Mariana Trench bathypelagic biology & Andean ecosystems' },
      { id: 'arch-digest', label: 'Architectural Digest Healing Spaces', icon: '🏛️', tagline: 'Biophilic light design and modern hospital architecture' },
      { id: 'atlantic-essays', label: 'The Atlantic Philosophy & Ideas', icon: '✒️', tagline: 'Deep essays on human longevity, ethics & conscious mind' },
    ],
  },
  {
    id: 'art',
    title: '🎨 Masterpiece Art & Anatomical Heritage',
    badge: 'Aesthetic Mind',
    description: 'Da Vinci anatomical dissections, Rembrandt chiaroscuro, Impressionist optics & Japanese Ukiyo-e',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80',
    subOptions: [
      { id: 'davinci-art', label: 'Leonardo da Vinci Anatomy', icon: '🖋️', tagline: 'Vitruvian proportions, cardiac vortex sketches & dissection codices' },
      { id: 'rembrandt-anatomy', label: 'The Anatomy Lesson of Dr. Tulp', icon: '🎨', tagline: 'Rembrandt’s 1632 masterpiece analyzing forearm tendon flexors' },
      { id: 'impressionism-optics', label: 'Impressionist Color & Retinal Optics', icon: '🌅', tagline: 'Monet, Seurat pointillism & visual cortex photon processing' },
    ],
  },
  {
    id: 'fashion',
    title: '✨ High Fashion, Textiles & Scrub Couture',
    badge: 'Couture & Design',
    description: 'Ergonomic surgical scrub tailoring, antimicrobial weaves, haute couture history & textile science',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=600&q=80',
    subOptions: [
      { id: 'scrub-couture', label: 'Ergonomic Modern Scrub Couture', icon: '🥼', tagline: 'Antimicrobial silver-thread weaves and 4-way surgical stretch cuts' },
      { id: 'haute-couture', label: 'Iconic Haute Couture Milestones', icon: '👗', tagline: 'Chanel tweed comfort revolution, Dior silhouette & architectural tailoring' },
      { id: 'smart-fabrics', label: 'Biomimetic Smart Textiles', icon: '🧵', tagline: 'Phase-change temperature regulation & moisture capillary mechanics' },
    ],
  },
  {
    id: 'motorsport',
    title: '🏎️ Formula 1 & Precision Motorsport',
    badge: 'High Performance',
    description: '1.8-second F1 pitstop biomechanics, aerodynamic telemetry, cockpit G-force physiology & Le Mans',
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&q=80',
    subOptions: [
      { id: 'f1-pitstop', label: '1.8-Second F1 Pitstop Mechanics', icon: '⏱️', tagline: '20-crew synchronized zero-error psychology and neuromuscular reflexes' },
      { id: 'f1-aerodynamics', label: 'Venturi Aerodynamics & Telemetry', icon: '💨', tagline: 'Ground effect suction, DRS wings & carbon-composite survival cells' },
      { id: 'endurance-physiology', label: '24 Hours of Le Mans Physiology', icon: '🏁', tagline: 'High G-force neck strain, core thermal regulation & circadian shifts' },
    ],
  },
  {
    id: 'gaming',
    title: '🎮 Strategic Gaming & Neuro-Reflexes',
    badge: 'Interactive Logic',
    description: 'Laparoscopic surgeon hand-eye reflex links, history of immersive RPGs & virtual reality anatomy',
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=600&q=80',
    subOptions: [
      { id: 'neuro-laparoscopy', label: 'Gamer Reflexes & Laparoscopy', icon: '🕹️', tagline: 'Clinical studies: gamer surgeons make 37% fewer errors in endoscopy' },
      { id: 'rpg-masterpieces', label: 'Milestones of Immersive RPGs', icon: '🗡️', tagline: 'Branching narrative decision trees in Chrono Trigger & Baldur’s Gate' },
      { id: 'vr-medical-sim', label: 'Virtual Reality Medical Simulation', icon: '🥽', tagline: 'Haptic force feedback in simulated neurosurgery and trauma triage' },
    ],
  },
  {
    id: 'news',
    title: '📰 World News & India News Pulse',
    badge: 'Daily Pulse',
    description: 'Separate curated dispatches: global medical breakthroughs & Indian healthcare and science pulse',
    image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=600&q=80',
    subOptions: [
      { id: 'world-news', label: '🌐 World News & Global Science', icon: '🌐', tagline: 'WHO medical alerts, mRNA vaccine pipelines & European Space missions' },
      { id: 'india-news', label: '🇮🇳 India News & AIIMS/ICMR Pulse', icon: '🇮🇳', tagline: 'AIIMS surgical trials, ICMR health guidelines & Indian biotech advances' },
    ],
  },
];

export const LOGIC_PROGRAMMERS: LogicChallenge[] = [
  {
    id: 'code-1',
    title: 'Python GFR & Renal Dosing Logic',
    snippet: `def calculate_creatinine_clearance(age, weight_kg, serum_cr, is_female):
    cr_cl = ((140 - age) * weight_kg) / (72 * serum_cr)
    if is_female:
        cr_cl *= 0.85
    return cr_cl

# Patient: 60yo female, 72kg, Cr: 1.0 mg/dL
result = calculate_creatinine_clearance(60, 72, 1.0, True)`,
    question: 'What calculation factor adjusts for lower average muscle mass in female patients in Cockcroft-Gault?',
    options: ['0.85 (15% reduction)', '0.50 (50% reduction)', '1.15 (15% increase)', '0.90 (10% reduction)'],
    correctIndex: 0,
    explanation: 'The Cockcroft-Gault formula multiplies by 0.85 for female patients because women typically have ~15% less muscle mass per kg than men, producing less endogenous creatinine.',
  },
  {
    id: 'code-2',
    title: 'Anion Gap Decision Logic',
    snippet: `def evaluate_acidosis(na, cl, hco3):
    anion_gap = na - (cl + hco3)
    if anion_gap > 12:
        return "HIGH_AG_ACIDOSIS (MUDPILES)"
    return "NORMAL_AG_ACIDOSIS (HARDASS)"`,
    question: 'If Na=140, Cl=100, HCO3=15, what will the function return?',
    options: ['HIGH_AG_ACIDOSIS (MUDPILES) [AG = 25]', 'NORMAL_AG_ACIDOSIS [AG = 10]', 'Normal Acid-Base Balance', 'Metabolic Alkalosis'],
    correctIndex: 0,
    explanation: 'Anion Gap = 140 - (100 + 15) = 140 - 115 = 25. Since 25 > 12, it is a High Anion Gap Metabolic Acidosis (MUDPILES).',
  },
];
