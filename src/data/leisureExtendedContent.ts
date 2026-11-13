// Extended rich content data for all leisure categories:
// Psychology, Sociology, History, World Map, Magazines, Art, Fashion, Motorsport, Gaming, World News & India News.

export interface PsychologyBias {
  id: string;
  name: string;
  category: 'Cognitive' | 'Perceptual' | 'Decision';
  tagline: string;
  dailyExample: string;
  clinicalRelevance: string;
  defenseStrategy: string;
}

export const PSYCHOLOGY_BIASES: PsychologyBias[] = [
  {
    id: 'bias-1',
    name: 'Confirmation Bias',
    category: 'Cognitive',
    tagline: 'Fixating on evidence confirming our pre-existing beliefs while ignoring contradictions',
    dailyExample: 'Scrolling news feeds that mirror your political opinions and dismissing alternative perspectives as biased.',
    clinicalRelevance: 'Diagnostic anchoring: Early fixation on a common diagnosis (e.g. viral flu) while ignoring red flags for early sepsis or PE.',
    defenseStrategy: 'Actively ask: "What single finding, if present, would prove my current hypothesis completely wrong?"',
  },
  {
    id: 'bias-2',
    name: 'The Dunning-Kruger Effect',
    category: 'Cognitive',
    tagline: 'Novices overestimate their competence, while genuine experts underestimate theirs',
    dailyExample: 'Reading two blog articles on stock trading and feeling ready to manage personal retirement options.',
    clinicalRelevance: 'Medical students after Year 2 often feel they know clinical medicine, until facing complex multi-morbid ward patients in residency.',
    defenseStrategy: 'Cultivate intellectual humility: Regard every milestone of knowledge as the beginning of a larger unexplored ocean.',
  },
  {
    id: 'bias-3',
    name: 'The Availability Heuristic',
    category: 'Decision',
    tagline: 'Overestimating event probabilities based on how vividly a recent example comes to memory',
    dailyExample: 'Refusing to swim in the ocean for months after watching a sensational shark documentary.',
    clinicalRelevance: 'Over-ordering emergency CT angiography after diagnosing a rare aortic dissection the previous night.',
    defenseStrategy: 'Rely on validated pre-test probability clinical calculators (Well\'s score, PERC rule) rather than emotional recall.',
  },
  {
    id: 'bias-4',
    name: 'The Halo Effect & Horn Effect',
    category: 'Perceptual',
    tagline: 'Allowing an initial positive or negative impression of one trait to color entire character evaluation',
    dailyExample: 'Assuming a well-dressed, articulate stranger is inherently honest, punctual, and highly competent.',
    clinicalRelevance: 'Assuming a polite, well-spoken patient has low substance-risk, or downplaying symptoms in unkempt patients.',
    defenseStrategy: 'Decouple presentation from pathology: Systematically evaluate objective biomarkers, vitals, and documented history.',
  },
  {
    id: 'bias-5',
    name: 'The Negativity Bias',
    category: 'Perceptual',
    tagline: 'The brain weighs negative stimuli and critical feedback far more heavily than positive feedback',
    dailyExample: 'Receiving 9 commendations and 1 mild criticism, and obsessing over the 1 criticism for three sleepless nights.',
    clinicalRelevance: 'Evolutionarily wired for survival in savannahs; in modern study environments it triggers burnout and imposter syndrome.',
    defenseStrategy: 'Maintain a physical "wins log" and consciously pause for 20 seconds to savor positive clinical feedback.',
  },
];

export interface BodyLanguageCue {
  cue: string;
  indicator: string;
  subconsciousMeaning: string;
  bedsideApplication: string;
}

export const BODY_LANGUAGE_CUES: BodyLanguageCue[] = [
  {
    cue: 'Duchenne vs Polite Smile',
    indicator: 'Orbicularis oculi contraction creating crow\'s feet around lateral eye corners',
    subconsciousMeaning: 'Involuntary genuine warmth activates both zygomatic major and orbicularis oculi; fake smiles only pull mouth corners.',
    bedsideApplication: 'Patients detect authentic empathetic micro-expressions in sub-second intervals; builds instant bedside rapport.',
  },
  {
    cue: 'Pupil Dilation (Mydriasis)',
    indicator: 'Bilateral pupil expansion under unchanged ambient lighting',
    subconsciousMeaning: 'Sympathetic nervous system activation signifying high mental interest, cognitive load, or intense attraction.',
    bedsideApplication: 'Useful in detecting concealed cognitive stress or heightened emotional stakes in patient consultations.',
  },
  {
    cue: 'Shoulder Elevation & Neck Turtle',
    indicator: 'Shoulders raised towards ears with chin lowered toward clavicle',
    subconsciousMeaning: 'Primal mammalian protective reflex safeguarding carotid arteries against perceived threat or intimidation.',
    bedsideApplication: 'Seen in anxious patients receiving difficult test results; indicates need to pause, lower vocal tone, and reassure.',
  },
  {
    cue: 'Torso Shielding & Foot Direction',
    indicator: 'Crossed arms across chest with feet angled toward the exit door',
    subconsciousMeaning: 'Subconscious barricade against psychological discomfort; feet point where the person genuinely wishes to go.',
    bedsideApplication: 'If a family member angles their feet away during ward rounds, they harbor unspoken doubts or urgent questions.',
  },
];

export interface HistoryEvent {
  year: string;
  title: string;
  era: string;
  summary: string;
  impactOnHumanity: string;
  image: string;
}

export const HISTORY_EVENTS: HistoryEvent[] = [
  {
    year: '1543 CE',
    title: 'Andreas Vesalius: De Humani Corporis Fabrica',
    era: 'Renaissance Revolution',
    summary: 'Vesalius shattered 1,300 years of Galenic dogma based on animal dissection by directly dissecting human cadavers in Padua and publishing 700 breathtaking woodcut illustrations.',
    impactOnHumanity: 'Replaced unquestioned philosophical authority with empirical anatomical observation, laying the foundation of modern scientific medicine.',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
  },
  {
    year: '1865 CE',
    title: 'Joseph Lister & Carbolic Antiseptic Surgery',
    era: 'Bacteriological Era',
    summary: 'Inspired by Pasteur’s germ theory, Lister sprayed diluted carbolic acid (phenol) onto surgical incisions, instruments, and dressings at Glasgow Royal Infirmary.',
    impactOnHumanity: 'Post-operative hospital gangrene mortality plunged from 45% to 12%, transforming surgery from a death sentence into a lifesaving science.',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80',
  },
  {
    year: '1928 CE',
    title: 'Alexander Fleming Discovers Penicillin',
    era: 'Golden Antibiotic Dawn',
    summary: 'Returning from vacation to his cluttered St. Mary’s laboratory, Fleming noticed a Penicillium notatum fungal spore had dissolved a halo of Staphylococcus colonies in a petri dish.',
    impactOnHumanity: 'Ended millennia where minor scrapes, strep throat, or childbirth fever were fatal. Extended average human life expectancy by over 20 years.',
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=600&q=80',
  },
  {
    year: '600 BCE',
    title: 'Sushruta Samhita: Ancient Indian Surgical Mastery',
    era: 'Vedic Antiquity',
    summary: 'Sushruta documented over 120 surgical instruments, rhinoplasty forehead flap reconstructions, cataract couching, and perineal lithotomy along the riverbanks of Kashi (Varanasi).',
    impactOnHumanity: 'Established the earliest documented principles of surgical asepsis, instrument tempering, and reconstructive plastic surgery in world history.',
    image: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=600&q=80',
  },
];

export interface WorldPlace {
  id: string;
  name: string;
  country: string;
  coordinates: string;
  theme: 'Natural Wonder' | 'Ancient Sanctuary' | 'Glacial Wilderness' | 'Cultural Capital';
  description: string;
  mindfulnessInsight: string;
  image: string;
}

export const WORLD_PLACES: WorldPlace[] = [
  {
    id: 'salar-de-uyuni',
    name: 'Salar de Uyuni Salt Flats',
    country: 'Bolivia',
    coordinates: '20.1338° S, 67.4891° W',
    theme: 'Natural Wonder',
    description: 'The world\'s largest salt flat spanning over 10,000 sq km at 3,656m altitude. After rainfall, a paper-thin layer of water transforms the crust into an infinite mirror reflecting clouds and celestial stars.',
    mindfulnessInsight: 'Dissolves horizon and perspective. Reminds us of the clarity that emerges when mental turbulence is completely stilled.',
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'kyoto-sagano',
    name: 'Arashiyama Bamboo Sanctuary',
    country: 'Japan',
    coordinates: '35.0167° N, 135.6713° E',
    theme: 'Ancient Sanctuary',
    description: 'A secluded pathway flanked by soaring moso bamboo culms. The Japanese Ministry of the Environment designated the sound of the wind rustling through these trunks as one of the "100 Soundscapes of Japan".',
    mindfulnessInsight: 'Bamboo bends with the strongest storm gale without snapping. The ultimate metaphor for psychological resilience in medical training.',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'oeschinensee',
    name: 'Oeschinensee Glacial Lake',
    country: 'Switzerland',
    coordinates: '46.4988° N, 7.7288° E',
    theme: 'Glacial Wilderness',
    description: 'A pristine turquoise alpine lake fed by glacial cascades from the Blüemlisalp massif at 1,578m. Framed by limestone spires and fragrant Swiss stone pine forests.',
    mindfulnessInsight: 'Pure cold glacial waters stimulate parasympathetic calm. Deep slow breaths reduce sympathetic tachycardia.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'varanasi-ghats',
    name: 'Ganges River Ghats of Kashi',
    country: 'India',
    coordinates: '25.3176° N, 82.9739° E',
    theme: 'Cultural Capital',
    description: 'One of the oldest continuously inhabited civilizational cities on Earth. The morning sun illuminating stone steps, ringing temple bells, and timeless Vedic chants along the holy river.',
    mindfulnessInsight: 'Confronts mortality and impermanence directly, giving healthcare professionals deep peace and profound reverence for life.',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=600&q=80',
  },
];

export interface MagazineArticle {
  id: string;
  publication: string;
  pubLogo: string;
  badgeColor: string;
  title: string;
  readTime: string;
  author: string;
  takeaway: string;
  excerpt: string;
}

export const MAGAZINE_ARTICLES: MagazineArticle[] = [
  {
    id: 'lancet-1',
    publication: 'The Lancet Medicine',
    pubLogo: '🩺',
    badgeColor: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200',
    title: 'Base-Editing CRISPR for Refractory Dyslipidemia: Phase 2 Human Outcomes',
    readTime: '4 min read',
    author: 'Lancet Genomic Medicine Working Group',
    takeaway: 'A single intravenous infusion of adenine base editors permanently knocked down hepatic PCSK9, dropping LDL-C by 55% for over two years without off-target double-stranded DNA breaks.',
    excerpt: 'Precision gene writing has crossed from mouse models into human clinical reality. By chemically converting adenine to guanine rather than severing DNA helices, chromosomal translocations are circumvented...',
  },
  {
    id: 'natgeo-1',
    publication: 'National Geographic',
    pubLogo: '🐅',
    badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200',
    title: 'The Bathypelagic Twilight: How Deep Mariana Organisms Thrive at 1,000 Atmospheres',
    readTime: '5 min read',
    author: 'Deep Sea Ecological Expedition',
    takeaway: 'Snailfish at 8,000 meters possess piezolyte chemical chaperones (TMAO) that stabilize cellular proteins against extreme hydrostatic pressure that would coagulate human albumin.',
    excerpt: 'Descending into the hadal trenches reveals creatures whose cell membranes are enriched with polyunsaturated fatty acids, maintaining liquid fluidity in temperatures approaching zero degrees Celsius...',
  },
  {
    id: 'arch-1',
    publication: 'Architectural Digest',
    pubLogo: '🏛️',
    badgeColor: 'bg-stone-200 text-stone-800 dark:bg-stone-800 dark:text-stone-200',
    title: 'Biophilic Light & Acoustic Wood: Designing Hospitals that Accelerate Post-Op Healing',
    readTime: '3 min read',
    author: 'Nordic Healthcare Design Collective',
    takeaway: 'Patients with direct natural morning light exposure require 22% less opioid analgesia and experience 1.8-day shorter post-operative ICU stays compared to windowless recovery wards.',
    excerpt: 'Architecture is non-pharmacological medicine. Incorporating living vertical moss walls, circadian rhythmic LED light spectrums, and non-reflective Finnish birch acoustic paneling lowers cortisol...',
  },
  {
    id: 'atlantic-1',
    publication: 'The Atlantic',
    pubLogo: '✒️',
    badgeColor: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-200',
    title: 'The Paradox of Longevity: Why Biological Age and Experiential Time Diverge',
    readTime: '6 min read',
    author: 'Cognitive Philosophy Forum',
    takeaway: 'Extending cellular telomeres means little if cognitive bandwidth is consumed by chronic hyper-connectivity. Time perception is dictated by the density of novel neural memories formed.',
    excerpt: 'When routines become automatic, months evaporate in retrospect. The subjective antidote to a fast-slipping life is intentional cognitive novelty: learning a new motor skill, exploring unfamiliar landscapes...',
  },
];

export interface ArtPiece {
  id: string;
  title: string;
  artist: string;
  year: string;
  medium: string;
  anatomicalBreakdown: string;
  artisticSecret: string;
  image: string;
}

export const ART_PIECES: ArtPiece[] = [
  {
    id: 'davinci-anatomy',
    title: 'Studies of the Heart & Aortic Valve Vortices',
    artist: 'Leonardo da Vinci',
    year: '1511-1513 CE',
    medium: 'Pen and brown ink with wash over black chalk',
    anatomicalBreakdown: 'Leonardo correctly deduced that blood vortex eddies forming inside the Sinuses of Valsalva push the delicate tricuspid aortic valve leaflets shut, preventing regurgitation without muscular contraction.',
    artisticSecret: 'It took modern cardiology until the 1960s with 4D phase-contrast MRI to experimentally confirm the exact fluid dynamics Leonardo sketched with goose quill five centuries earlier.',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'rembrandt-tulp',
    title: 'The Anatomy Lesson of Dr. Nicolaes Tulp',
    artist: 'Rembrandt van Rijn',
    year: '1632 CE',
    medium: 'Oil on canvas (Royal Picture Gallery Mauritshuis)',
    anatomicalBreakdown: 'Dr. Tulp dissects the left forearm flexor tendons with forceps while demonstrating flexor digitorum action with his own left hand. The students gaze not at the cadaver, but at the demonstrator.',
    artisticSecret: 'Rembrandt deliberately painted the flexor muscle origin slightly too far lateral (closer to lateral epicondyle) to emphasize visual composition and dramatic tension over dry technical precision.',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'monet-optics',
    title: 'Water Lilies & Cataract Photonics',
    artist: 'Claude Monet',
    year: '1914-1926 CE',
    medium: 'Oil on canvas (Musée de l\'Orangerie)',
    anatomicalBreakdown: 'As nuclear sclerotic cataracts clouded Monet\'s natural crystalline lens, amber filtering blocked blue wavelengths, skewing his palette to muddy reds. After surgical aphakia in 1923, he saw ultraviolet wavelengths.',
    artisticSecret: 'Post-cataract surgery, Monet could perceive near-UV spectrum rays invisible to normal trichromatic eyes, painting his famous Giverny lilies in electrifying cobalt, lilac, and cyan hues.',
    image: 'https://images.unsplash.com/photo-1578925518470-4def7a0f08bb?auto=format&fit=crop&w=600&q=80',
  },
];

export interface FashionMilestone {
  title: string;
  badge: string;
  innovation: string;
  materialScience: string;
  dailyApplication: string;
}

export const FASHION_MILESTONES: FashionMilestone[] = [
  {
    title: 'Ergonomic 4-Way Stretch Scrub Couture',
    badge: 'Clinical Ergonomics',
    innovation: 'High-tenacity mechanical stretch polyester blended with 2% elastane and tailored athletic jogger cuffs.',
    materialScience: 'Silvadur™ silver-ion antimicrobial nano-coating bonded to synthetic yarn prevents bacterial colonization and odor breakdown across 24-hour shifts.',
    dailyApplication: 'Allows full 90-degree chest compressions in CPR and deep squatting during lumbar punctures without waist slip or restriction.',
  },
  {
    title: 'Coco Chanel: Liberation via Jersey Knit (1920s)',
    badge: 'Couture Milestone',
    innovation: 'Repurposed industrial men\'s underwear jersey into fluid, unrestricted drop-waist womenswear.',
    materialScience: 'Discarded whalebone corsets and rigid crinolines in favor of natural drape, breathability, and functional pocket utility.',
    dailyApplication: 'The direct philosophical ancestor of modern functional uniforms, athleisure, and breathable medical workwear.',
  },
  {
    title: 'Biomimetic Phase-Change Microcapsules (PCM)',
    badge: 'Smart Textiles',
    innovation: 'Paraffin wax nanocapsules embedded into surgical scrub inner linings that absorb and release thermal latent heat.',
    materialScience: 'When the operating theater warms or physical stress peaks, the wax melts at 28°C absorbing excess body heat; cools down when standing motionless.',
    dailyApplication: 'Maintains homeostatic micro-climates for operating surgeons wearing three layers of sterile gowns under 100,000-lumen OR spotlights.',
  },
];

export interface MotorsportFact {
  step: string;
  duration: string;
  crewRole: string;
  neuromuscularInsight: string;
}

export const F1_PITSTOP_STEPS: MotorsportFact[] = [
  {
    step: '1. Deceleration & Precision Box Stop',
    duration: '0.00s',
    crewRole: 'Driver & Front Jack Man',
    neuromuscularInsight: 'Driver brakes from 80 km/h pit speed to a dead halt within 2cm tolerance. Front jack slides under front nose cone in 0.08 seconds.',
  },
  {
    step: '2. Pneumatic Wheel Gun Torque Release',
    duration: '0.25s',
    crewRole: '4 Wheel-Gun Operators',
    neuromuscularInsight: 'Pneumatic guns spinning at 10,000 RPM deliver 3,000 Nm torque to loosen the single center-lock nut in a single instantaneous burst.',
  },
  {
    step: '3. Tire Off & Tire On Synchronization',
    duration: '0.85s',
    crewRole: '8 Tire Removers & Fitters',
    neuromuscularInsight: 'Hot 100°C slick tires weighing 11 kg are yanked and replaced in a seamless single continuous arc; zero lateral wobble.',
  },
  {
    step: '4. Center Nut Lock & Electronic Green Light',
    duration: '1.80s (Record: 1.80s McLaren)',
    crewRole: '4 Gunners & Lollipop Operator',
    neuromuscularInsight: 'Gunners press thumb buttons confirming torque seating. Telemetry releases the overhead traffic light within 0.04s. Flawless team synchrony.',
  },
];

export interface GamingFact {
  title: string;
  genre: string;
  scientificStudy: string;
  clinicalTransfer: string;
}

export const GAMING_FACTS: GamingFact[] = [
  {
    title: 'Laparoscopic Surgical Speed & Error Reductions',
    genre: 'Precision Action & Rhythm',
    scientificStudy: 'Dr. James Rosser et al. (Archives of Surgery): Surgeons playing video games >3 hours/week made 37% fewer errors and completed endoscopic suturing 27% faster than non-gamers.',
    clinicalTransfer: 'Strengthens bilateral hand dissociation, visual-spatial working memory, and dual-axis camera rotation mental models.',
  },
  {
    title: 'Branching RPG Moral Decisions & Clinical Ethics',
    genre: 'Narrative RPG (Baldur\'s Gate 3, Planescape)',
    scientificStudy: 'Complex multi-tier decision trees force players to weigh competing ethical priorities (deontology vs utilitarian triage) with irreversible consequences.',
    clinicalTransfer: 'Sharpens bedside triage instincts: choosing the least harmful alternative under incomplete data and emotional uncertainty.',
  },
  {
    title: 'Haptic VR Simulation & Neurosurgical Clipping',
    genre: 'Medical VR Simulators',
    scientificStudy: 'Trainees practicing with force-feedback haptic stylus on 3D patient-specific CT angiogram reconstructions demonstrate 40% higher precision on real aneurysms.',
    clinicalTransfer: 'Builds muscle-memory tactile resistance thresholds before ever entering a real human intracranial operating theater.',
  },
];

export interface NewsItem {
  id: string;
  source: string;
  category: 'World Medical' | 'Space & Deep Science' | 'India Health' | 'ICMR / AIIMS';
  title: string;
  timestamp: string;
  bulletSummary: string[];
  relevanceForStudents: string;
}

export const WORLD_NEWS_FEED: NewsItem[] = [
  {
    id: 'wn-1',
    source: 'WHO Global Health Alert',
    category: 'World Medical',
    title: 'WHO Endorses R21/Matrix-M Recombinant Malaria Vaccine for Pan-African Pediatric Rollout',
    timestamp: 'Today · 3 hrs ago',
    bulletSummary: [
      'Clinical Phase 3 trials across 4 African nations show 75% efficacy when administered prior to peak transmission season.',
      'Cost-effective scalable manufacturing ensures over 100 million doses annually at under $4 per shot.',
      'Significantly lowers severe cerebral malaria ICU admissions in children under five years of age.',
    ],
    relevanceForStudents: 'High-yield for Microbiology & Community Medicine: Understand Circumsporozoite protein (CSP) targeting and Matrix-M saponin adjuvant mechanism.',
  },
  {
    id: 'wn-2',
    source: 'Nature Biotechnology',
    category: 'World Medical',
    title: 'First In-Vivo Epigenetic Editing Drug Enters Phase 1 Trials for Amyloid Polyneuropathy',
    timestamp: 'Yesterday · 14 hrs ago',
    bulletSummary: [
      'Zinc-finger epigenetic repressors silence mutant Transthyretin (TTR) without cutting DNA double helices.',
      'Circumvents permanent gene sequence alteration while achieving durable 90% serum TTR suppression.',
      'Potential game-changer for cardiac amyloidosis and familial polyneuropathy management.',
    ],
    relevanceForStudents: 'Cardiology & Genetics: Differentiate TTR stabilization (Tafamidis) vs RNAi silencing (Patisiran) vs Epigenetic repression.',
  },
  {
    id: 'wn-3',
    source: 'NASA & European Space Agency',
    category: 'Space & Deep Science',
    title: 'James Webb Space Telescope Detects Carbon-Bearing Molecules in Habitable-Zone Exoplanet K2-18b',
    timestamp: '2 days ago',
    bulletSummary: [
      'Atmospheric transmission spectroscopy reveals methane (CH4) and carbon dioxide (CO2) with a scarcity of ammonia.',
      'Points toward a potential Hycean world: a water-ocean enveloped under a hydrogen-rich atmosphere.',
      'Tentative detection of dimethyl sulfide (DMS), an organic molecule produced almost exclusively by phytoplankton on Earth.',
    ],
    relevanceForStudents: 'Astrobio & Spectrophotometry: Classic demonstration of absorption spectrometry principles taught in medical biochemistry.',
  },
];

export const INDIA_NEWS_FEED: NewsItem[] = [
  {
    id: 'in-1',
    source: 'AIIMS New Delhi Press Dispatch',
    category: 'ICMR / AIIMS',
    title: 'AIIMS New Delhi Completes First Indigenous Robotic Telesurgery Over 5G Fiber Network',
    timestamp: 'Today · 2 hrs ago',
    bulletSummary: [
      'A master surgeon at AIIMS New Delhi manipulated a 4-arm robotic console to perform a partial nephrectomy at a regional outreach center 45 km away.',
      'Latency remained under 8 milliseconds using a dedicated 5G private optical network slice.',
      'Paves the way for expert surgical intervention in remote rural and military frontier hospitals.',
    ],
    relevanceForStudents: 'Surgery & Telemedicine: High-yield for upcoming exams on minimally invasive surgery and telemedicine guidelines.',
  },
  {
    id: 'in-2',
    source: 'ICMR Epidemiology Bulletin',
    category: 'India Health',
    title: 'ICMR Releases Revised 2026 Antimicrobial Stewardship Guidelines for Tier-1 Hospitals',
    timestamp: 'Yesterday · 8 hrs ago',
    bulletSummary: [
      'Restricts empirical carbapenem and colistin prescriptions without documented cultures within 48 hours.',
      'Mandates rapid procalcitonin-guided antibiotic de-escalation protocols in intensive care units.',
      'Introduces national surveillance dashboard for Carbapenem-Resistant Enterobacteriaceae (CRE) tracking.',
    ],
    relevanceForStudents: 'Pharmacology & Medicine: Understand reserve group antibiotics, AWaRe classification (Access, Watch, Reserve), and colistin nephrotoxicity.',
  },
  {
    id: 'in-3',
    source: 'Department of Biotechnology, Govt of India',
    category: 'India Health',
    title: 'Indigenous CAR-T Cell Therapy NexCAR19 Surpasses 1,000th Leukemia Patient Milestone',
    timestamp: '3 days ago',
    bulletSummary: [
      'Manufactured domestically at one-tenth the international cost (~$40,000 vs $400,000 in North America).',
      'Demonstrates 72% overall response rate in relapsed B-cell acute lymphoblastic leukemia (B-ALL) and lymphoma.',
      'Significantly lower incidence of severe grade 3/4 Cytokine Release Syndrome (CRS) due to humanized scFv design.',
    ],
    relevanceForStudents: 'Hematology & Oncology: Understand CD19 targeting, Tocilizumab for CRS management, and chimeric antigen receptor biology.',
  },
];
