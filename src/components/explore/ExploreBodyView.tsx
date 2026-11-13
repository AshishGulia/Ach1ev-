import React, { useState } from 'react';
import { SubjectCourse, SnippetScreenshot } from '../../types';
import {
  Activity,
  Heart,
  Brain,
  Bone,
  Wind,
  Droplets,
  Zap,
  Sparkles,
  Camera,
  Check,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

interface ExploreBodyViewProps {
  currentSubject: SubjectCourse;
  onSnipToNote: (snippet: SnippetScreenshot) => void;
  onOpenNotebookWithTopic?: (topic: string) => void;
}

interface OrganSystem {
  id: string;
  name: string;
  category: string;
  latinName: string;
  highYieldPearl: string;
  keyReceptors: string[];
  firstLineTherapeutics: string[];
  pathologyHighlights: string;
  diagramSvgPath?: string;
}

const ORGAN_SYSTEMS: OrganSystem[] = [
  {
    id: 'skeletal-bone',
    name: 'Skeletal System & Bone Matrix',
    latinName: 'Systema Skeletale',
    category: 'Osteology & Mineral Homeostasis',
    highYieldPearl: 'RANKL binds RANK on pre-osteoclasts; Denosumab monoclonal antibody acts as decoy to arrest bone resorption in osteoporosis.',
    keyReceptors: ['RANK / RANKL', 'PTH1 Receptor', 'LRP5/6 (Wnt)', 'Sclerostin (SOST)'],
    firstLineTherapeutics: ['Alendronate (PO)', 'Zoledronic Acid (IV)', 'Denosumab (SC)', 'Teriparatide (PTH 1-34)', 'Romosozumab'],
    pathologyHighlights: 'Trabecular microarchitectural thinning, DEXA T-score ≤ -2.5, elevated CTX-1 & P1NP markers, postmenopausal estrogen deficiency.',
  },
  {
    id: 'cardiovascular',
    name: 'Cardiovascular & Hemodynamics',
    latinName: 'Systema Cardiovasculare',
    category: 'Cardiology & Hemodynamics',
    highYieldPearl: 'Beta-1 adrenergic receptors in SA node & myocardium couple via Gs to increase cAMP, heart rate (chronotropy), and contractility (inotropy).',
    keyReceptors: ['Beta-1 Adrenergic', 'Alpha-1 Vascular', 'AT1 Receptor', 'L-type Ca2+ Channels'],
    firstLineTherapeutics: ['Metoprolol succinate', 'Lisinopril (ACE-I)', 'Amlodipine (DHP-CCB)', 'Furosemide', 'Sacubitril/Valsartan'],
    pathologyHighlights: 'Heart failure with reduced ejection fraction (HFrEF), eccentric hypertrophy, ventricular remodeling, refractory hypertension.',
  },
  {
    id: 'nervous-autonomic',
    name: 'Autonomic & Central Nervous System',
    latinName: 'Systema Nervosum',
    category: 'Neuropharmacology',
    highYieldPearl: 'Atropine blocks M3 on sphincter pupillae causing passive mydriasis; Phenylephrine stimulates Alpha-1 on dilator pupillae causing active mydriasis.',
    keyReceptors: ['Muscarinic M1-M5', 'Nicotinic Nn & Nm', 'GABA-A / GABA-B', 'Dopamine D2', '5-HT2A'],
    firstLineTherapeutics: ['Atropine', 'Pilocarpine', 'Neostigmine', 'Levodopa/Carbidopa', 'Fluoxetine (SSRI)'],
    pathologyHighlights: 'Organophosphate poisoning, Parkinsonian striatal dopamine depletion, acute angle-closure glaucoma.',
  },
  {
    id: 'renal-nephron',
    name: 'Renal Glomerular & Tubular Apparatus',
    latinName: 'Apparatus Urinarius',
    category: 'Nephrology & Acid-Base',
    highYieldPearl: 'SGLT2 inhibitors in proximal convoluted tubule block glucose/Na+ reabsorption, promoting osmotic diuresis and reducing CV death in CKD.',
    keyReceptors: ['Na+/K+/2Cl- Cotransporter', 'Na+/Cl- Symporter', 'V2 Vasopressin', 'Aldosterone MR'],
    firstLineTherapeutics: ['Empagliflozin (SGLT2i)', 'Hydrochlorothiazide', 'Spironolactone', 'Furosemide', 'Tolvaptan'],
    pathologyHighlights: 'Diabetic kidney disease, acute tubular necrosis, hyperkalemic metabolic acidosis, nephrotic proteinuria.',
  },
  {
    id: 'respiratory-pulmonary',
    name: 'Pulmonary Alveolar & Bronchial Tree',
    latinName: 'Systema Respiratorium',
    category: 'Pulmonology',
    highYieldPearl: 'Beta-2 agonists increase intracellular cAMP to activate PKA, dephosphorylating myosin light-chain kinase to mediate rapid bronchodilation.',
    keyReceptors: ['Beta-2 Adrenergic', 'Muscarinic M3', 'Cysteinyl Leukotriene CysLT1', 'Adenosine A2B'],
    firstLineTherapeutics: ['Salbutamol (SABA)', 'Fluticasone (ICS)', 'Tiotropium (LAMA)', 'Montelukast', 'Omalizumab (Anti-IgE)'],
    pathologyHighlights: 'Bronchial hyperresponsiveness in asthma, Charcot-Leyden crystals, goblet cell hyperplasia in chronic bronchitis.',
  },
  {
    id: 'gastrointestinal',
    name: 'Gastrointestinal & Hepatic Metabolism',
    latinName: 'Systema Digestorium',
    category: 'Gastroenterology',
    highYieldPearl: 'Proton pump inhibitors irreversibly form covalent disulfide bonds with H+/K+-ATPase on gastric parietal cells; take 30-60 min before meals.',
    keyReceptors: ['H+/K+ ATPase', 'Histamine H2', 'Gastrin CCK-B', '5-HT3 / 5-HT4', 'Mu-Opioid (GI)'],
    firstLineTherapeutics: ['Omeprazole', 'Ondansetron', 'Metoclopramide', 'Loperamide', 'Lactulose'],
    pathologyHighlights: 'Peptic ulcer disease, Helicobacter pylori gastritis, portal hypertension with esophageal varices.',
  },
];

export const ExploreBodyView: React.FC<ExploreBodyViewProps> = ({
  currentSubject,
  onSnipToNote,
  onOpenNotebookWithTopic,
}) => {
  const [selectedOrganId, setSelectedOrganId] = useState<string>('skeletal-bone');
  const [capturedFeedback, setCapturedFeedback] = useState<boolean>(false);

  const activeOrgan =
    ORGAN_SYSTEMS.find((o) => o.id === selectedOrganId) || ORGAN_SYSTEMS[0];

  const handleCaptureOrganSnippet = () => {
    // Generate clean medical diagram snippet
    const canvas = document.createElement('canvas');
    canvas.width = 680;
    canvas.height = 360;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Dark charcoal card background
      ctx.fillStyle = '#0f1118';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Header strip
      ctx.fillStyle = '#171b26';
      ctx.fillRect(0, 0, canvas.width, 40);
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText(`ANATOMICAL TARGET: ${activeOrgan.name.toUpperCase()}`, 16, 26);

      // Pearl box
      ctx.fillStyle = '#5c351c';
      ctx.fillRect(16, 56, canvas.width - 32, 54);
      ctx.fillStyle = '#fde68a';
      ctx.font = '12px sans-serif';
      ctx.fillText(`High-Yield Exam Pearl:`, 26, 75);
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px sans-serif';
      ctx.fillText(activeOrgan.highYieldPearl.slice(0, 80) + '...', 26, 96);

      // Receptors & Drugs list
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText('Target Receptors:', 20, 145);
      ctx.fillStyle = '#e2e8f0';
      ctx.font = '12px monospace';
      ctx.fillText(activeOrgan.keyReceptors.join(' · '), 20, 168);

      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText('First-Line Pharmacotherapy:', 20, 205);
      ctx.fillStyle = '#e2e8f0';
      ctx.font = '12px monospace';
      ctx.fillText(activeOrgan.firstLineTherapeutics.slice(0, 3).join(', '), 20, 228);

      // Schematic waveform / diagram
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(20, 310);
      ctx.lineTo(80, 310);
      ctx.lineTo(100, 260);
      ctx.lineTo(120, 340);
      ctx.lineTo(140, 280);
      ctx.lineTo(170, 310);
      ctx.lineTo(canvas.width - 20, 310);
      ctx.stroke();

      const dataUrl = canvas.toDataURL('image/png');
      const snippet: SnippetScreenshot = {
        id: `organ-snip-${Date.now()}`,
        dataUrl,
        sourceBookTitle: `Anatomical Explorer: ${activeOrgan.name}`,
        pageNumber: 1,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        caption: `${activeOrgan.name} (${activeOrgan.latinName})`,
      };

      onSnipToNote(snippet);
      setCapturedFeedback(true);
      setTimeout(() => setCapturedFeedback(false), 2200);
    }
  };

  return (
    <div className="themed-workspace-surface flex-1 overflow-y-auto bg-[#f8f7f3] dark:bg-[#110c09] text-stone-900 dark:text-[#efe4d4] p-6 md:p-10 transition-colors">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-stone-200 dark:border-[#382518]">
          <div>
            <div className="text-[10px] font-mono tracking-widest text-amber-700 dark:text-[#c49257] uppercase mb-1">
              CLINICAL ANATOMY & PATHOLOGY MAP
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 dark:text-[#efe4d4]">
              Explore Body & Organ Systems
            </h1>
            <p className="text-xs text-stone-500 dark:text-[#a69079] mt-1">
              Interactive anatomical systems with receptor pathways, clinical pathology, and instant snippet export to notebooks.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCaptureOrganSnippet}
              className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shadow-2xs ${
                capturedFeedback
                  ? 'themed-accent-btn bg-[#8f5f2c] text-white'
                  : 'themed-accent-btn bg-zinc-900 dark:bg-amber-600 text-white dark:text-[#110c09] hover:opacity-90'
              }`}
            >
              {capturedFeedback ? <Check className="w-3.5 h-3.5" /> : <Camera className="w-3.5 h-3.5" />}
              <span>{capturedFeedback ? 'Stamped in Notebook!' : 'Snip Diagram to Note'}</span>
            </button>
          </div>
        </div>

        {/* Main 2-Column Split: Interactive Anatomical System Grid + Detailed Clinical Target Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column (5 Cols): Organ Systems Selector Grid */}
          <div className="lg:col-span-5 space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 dark:text-[#a69079]">
              Select Anatomical System:
            </span>

            <div className="space-y-2">
              {ORGAN_SYSTEMS.map((organ) => {
                const isSelected = organ.id === selectedOrganId;
                return (
                  <div
                    key={organ.id}
                    onClick={() => setSelectedOrganId(organ.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'themed-glass-card border-amber-500/80 bg-white dark:bg-[#221811] shadow-sm ring-1 ring-amber-500/30'
                        : 'themed-glass-card border-stone-200 dark:border-[#382518] bg-white/70 dark:bg-[#18110c] hover:border-stone-300 dark:hover:border-[#533824]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-amber-600 text-white dark:text-[#110c09]'
                            : 'bg-stone-100 dark:bg-[#2a1d14] text-stone-600 dark:text-[#d8c7b0]'
                        }`}
                      >
                        {organ.id === 'skeletal-bone' && <Bone className="w-4 h-4" />}
                        {organ.id === 'cardiovascular' && <Heart className="w-4 h-4" />}
                        {organ.id === 'nervous-autonomic' && <Brain className="w-4 h-4" />}
                        {organ.id === 'renal-nephron' && <Droplets className="w-4 h-4" />}
                        {organ.id === 'respiratory-pulmonary' && <Wind className="w-4 h-4" />}
                        {organ.id === 'gastrointestinal' && <Activity className="w-4 h-4" />}
                      </div>

                      <div className="min-w-0">
                        <h4 className="text-xs font-semibold text-slate-900 dark:text-[#efe4d4] truncate">
                          {organ.name}
                        </h4>
                        <p className="text-[10px] font-mono text-stone-400 dark:text-[#a69079] italic truncate">
                          {organ.latinName}
                        </p>
                      </div>
                    </div>

                    <ArrowRight
                      className={`w-4 h-4 shrink-0 transition-transform ${
                        isSelected ? 'text-amber-500 translate-x-0.5' : 'text-stone-300 dark:text-[#6e5440]'
                      }`}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column (7 Cols): Deep Clinical Insights & Drug Receptors Card */}
          <div className="lg:col-span-7">
            <div className="themed-glass-card p-6 md:p-8 rounded-2xl bg-white dark:bg-[#18110c] border border-stone-200 dark:border-[#382518] shadow-sm space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-stone-100 dark:border-[#352317]">
                <div>
                  <div className="text-[10px] font-mono uppercase text-amber-700 dark:text-[#c49257] tracking-wider">
                    {activeOrgan.category}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-[#efe4d4] mt-0.5">
                    {activeOrgan.name}
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-[#a69079] italic">
                    {activeOrgan.latinName}
                  </p>
                </div>

                <div className="px-2.5 py-1 rounded bg-stone-100 dark:bg-[#231912] border border-transparent dark:border-[#382518] text-[10px] font-mono text-stone-600 dark:text-[#d8c7b0]">
                  {currentSubject} Target
                </div>
              </div>

              {/* High-Yield Medical Board Pearl */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-950 dark:text-amber-200 text-xs leading-relaxed">
                <span className="font-bold block mb-1">★ High-Yield Clinical Pearl:</span>
                <p>{activeOrgan.highYieldPearl}</p>
              </div>

              {/* Receptors & Mechanisms */}
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-[#efe4d4] uppercase tracking-wide mb-2">
                  Key Pharmacological Receptors:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeOrgan.keyReceptors.map((rec) => (
                    <span
                      key={rec}
                      className="px-2.5 py-1 rounded-md bg-stone-100 dark:bg-[#231912] text-slate-800 dark:text-[#efe4d4] border border-stone-200 dark:border-[#3d291c] font-mono text-xs"
                    >
                      {rec}
                    </span>
                  ))}
                </div>
              </div>

              {/* First-Line Therapeutics */}
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-[#efe4d4] uppercase tracking-wide mb-2">
                  First-Line Therapeutics & Pharmacotherapy:
                </h4>
                <div className="space-y-1.5 text-xs text-stone-600 dark:text-[#d8c7b0]">
                  {activeOrgan.firstLineTherapeutics.map((drug) => (
                    <div key={drug} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span>{drug}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pathology Highlights */}
              <div className="pt-4 border-t border-stone-100 dark:border-[#352317]">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-[#efe4d4] uppercase tracking-wide mb-1.5">
                  Pathology & Clinical Manifestations:
                </h4>
                <p className="text-xs text-stone-600 dark:text-[#a69079] leading-relaxed">
                  {activeOrgan.pathologyHighlights}
                </p>
              </div>

              {/* Bottom Quick Action */}
              <div className="pt-4 border-t border-stone-100 dark:border-[#352317] flex justify-between items-center text-xs">
                <span className="text-stone-400 dark:text-[#a69079] text-[11px]">
                  Ready to annotate in active note
                </span>
                <button
                  onClick={handleCaptureOrganSnippet}
                  className="text-amber-700 dark:text-amber-400 font-medium hover:underline flex items-center gap-1"
                >
                  <span>Insert to Active Note</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
