import React, { useState } from 'react';
import {
  SubjectCourse,
  StudyTask,
  Notebook,
  UserProfile,
} from '../../../types';
import { AchievBrand } from '../../common/AchievBrand';
import {
  Search,
  BookOpen,
  FileText,
  RotateCcw,
  ZoomIn,
  Layers,
  ChevronRight,
  Plus,
  Activity,
  Heart,
} from 'lucide-react';

interface Design6Props {
  userProfile: UserProfile;
  currentSubject: SubjectCourse;
  tasks: StudyTask[];
  notebooks: Notebook[];
  onOpenNotebook: (id: string) => void;
  onOpenStudio: (actionType?: string) => void;
  onOpenRosterModal: () => void;
}

export const Design6ClinicAnatomy: React.FC<Design6Props> = ({
  userProfile,
  notebooks,
  onOpenNotebook,
  onOpenStudio,
}) => {
  const [selectedOrgan, setSelectedOrgan] = useState<'Heart' | 'Lungs' | 'Liver' | 'Kidney'>('Heart');
  const [organTab, setOrganTab] = useState<'Anatomy' | 'Physiology' | 'Diseases A-Z'>('Anatomy');
  const [referenceFilter, setReferenceFilter] = useState<'All' | 'Articles' | 'Books' | 'Notes' | 'Videos'>('All');

  const organData = {
    Heart: {
      latin: 'Cor (Heart)',
      desc: 'A muscular organ that pumps blood throughout the body, maintaining circulation, oxygen delivery and nutrient supply.',
      overview: 'The heart is a hollow, muscular organ located in the middle mediastinum. It functions as a dual pump, with the right side sending deoxygenated blood to the lungs and the left side sending oxygenated blood to the systemic circulation.',
      keyFacts: [
        { label: 'Location', value: 'Middle mediastinum' },
        { label: 'Size', value: '~12 cm (adult)' },
        { label: 'Weight', value: '250–350 g (adult)' },
        { label: 'Chambers', value: '4 (right atrium, right ventricle, left atrium, left ventricle)' },
        { label: 'Valves', value: 'Tricuspid, pulmonic, mitral, aortic' },
        { label: 'Blood supply', value: 'Coronary arteries (right and left)' },
        { label: 'Innervation', value: 'Autonomic (sympathetic and parasympathetic)' },
      ],
      relations: [
        'Anterior: Sternum and costal cartilages',
        'Posterior: Esophagus, descending thoracic aorta',
        'Superior: Great vessels (aorta, pulmonary trunk, SVC)',
        'Inferior: Diaphragm',
        'Lateral: Lungs and pleura',
      ],
    },
    Lungs: {
      latin: 'Pulmones (Lungs)',
      desc: 'Primary organs of respiration responsible for gas exchange between blood and atmospheric air.',
      overview: 'Conical paired organs in the thoracic cavity separated by the mediastinum. Right lung has 3 lobes (superior, middle, inferior); left lung has 2 lobes and a cardiac notch.',
      keyFacts: [
        { label: 'Location', value: 'Pleural cavities of thorax' },
        { label: 'Lobes', value: 'Right (3 lobes, 10 segments), Left (2 lobes, 8-10 segments)' },
        { label: 'Weight', value: '~1,000–1,200 g combined' },
        { label: 'Blood supply', value: 'Bronchial arteries (nutrition), Pulmonary arteries (gas exchange)' },
        { label: 'Innervation', value: 'Pulmonary plexus (Vagus nerve & sympathetic trunk)' },
      ],
      relations: [
        'Anterior & Lateral: Ribs and intercostal spaces',
        'Inferior: Diaphragmatic dome',
        'Medial: Heart, great vessels, phrenic and vagus nerves',
      ],
    },
    Liver: {
      latin: 'Hepar (Liver)',
      desc: 'The largest internal organ and gland performing metabolism, detoxification, and bile production.',
      overview: 'Located in the right upper quadrant beneath the diaphragm. Divided into 4 lobes anatomically and 8 Couinaud functional segments based on vascular branching.',
      keyFacts: [
        { label: 'Location', value: 'Right hypochondrium & epigastrium' },
        { label: 'Weight', value: '1,400–1,600 g (adult)' },
        { label: 'Blood supply', value: 'Portal vein (75%), Hepatic artery (25%)' },
        { label: 'Venous drainage', value: 'Hepatic veins directly into IVC' },
        { label: 'Capsule', value: "Glisson's fibroelastic capsule" },
      ],
      relations: [
        'Superior: Diaphragm separating from lungs and pericardium',
        'Inferior: Gallbladder, stomach, duodenum, hepatic flexure of colon, right kidney',
      ],
    },
    Kidney: {
      latin: 'Ren (Kidney)',
      desc: 'Retroperitoneal organs filtering metabolic waste, maintaining fluid-electrolyte balance and blood pressure.',
      overview: 'Bean-shaped organs spanning T12 to L3 vertebrae. The right kidney lies slightly lower than the left due to the liver.',
      keyFacts: [
        { label: 'Location', value: 'Retroperitoneal, T12–L3' },
        { label: 'Size', value: '10–12 cm length × 5–6 cm width' },
        { label: 'Functional Unit', value: '~1 million nephrons per kidney' },
        { label: 'Blood supply', value: 'Renal arteries from abdominal aorta (20-25% of cardiac output)' },
      ],
      relations: [
        'Superior: Adrenal (suprarenal) glands',
        'Posterior: Psoas major, quadratus lumborum, diaphragm',
        'Anterior (Right): Liver, 2nd part of duodenum, ascending colon',
      ],
    },
  };

  const activeData = organData[selectedOrgan];

  return (
    <div className="space-y-4 font-sans text-stone-800 dark:text-stone-100 bg-[#fbfbf8] dark:bg-[#10141c] p-4 md:p-6 rounded-3xl border border-stone-200/80 dark:border-[#222b38] shadow-sm transition-colors">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-stone-200/80 dark:border-[#222b38]">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <AchievBrand variant="inline" showTagline={false} imgClassName="w-5 h-5" />
            <span className="text-xs px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-600 font-mono font-bold">
              Settle Ideas · Clinic Anatomy
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium text-slate-600 dark:text-zinc-400">
            <span className="hover:text-sky-600 cursor-pointer">Home</span>
            <span className="text-sky-600 font-bold border-b-2 border-sky-600 pb-0.5">Anatomy</span>
            <span className="hover:text-sky-600 cursor-pointer">Library</span>
            <span className="hover:text-sky-600 cursor-pointer">Cases</span>
            <span className="hover:text-sky-600 cursor-pointer">Tools</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search organs, conditions, drugs, or topics..."
              className="pl-8 pr-3 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#121622] w-64 text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-7 h-7 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-xs">
              DR
            </span>
            <span className="font-medium">Dr. {userProfile.name.split(' ')[0] || 'Rao'}</span>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="text-xs font-mono text-slate-400 flex items-center gap-1">
        <span>Human Anatomy</span>
        <span>›</span>
        <span>Cardiovascular System</span>
        <span>›</span>
        <span className="text-sky-600 font-bold">{selectedOrgan}</span>
      </div>

      {/* Main 3-Column Split Suite */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column (Span 4): Organ Clinical Profile */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-slate-50/70 dark:bg-[#111622] border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-600 shrink-0">
              <Heart className="w-6 h-6 fill-sky-500/30" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {selectedOrgan}
              </h2>
              <div className="text-xs font-mono text-slate-500 italic">
                {activeData.latin}
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
            {activeData.desc}
          </p>

          {/* Organ Sub-Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 text-xs font-medium pb-1">
            {(['Anatomy', 'Physiology', 'Diseases A-Z'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setOrganTab(tab)}
                className={`pb-1 px-1 transition-colors ${
                  organTab === tab
                    ? 'text-sky-600 font-bold border-b-2 border-sky-600'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Overview */}
          <div className="space-y-1">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-zinc-100">
              Overview
            </h3>
            <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
              {activeData.overview}
            </p>
          </div>

          {/* Key Facts Table */}
          <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-zinc-100 mb-2">
              Key Facts
            </h3>
            <div className="space-y-1.5 text-xs">
              {activeData.keyFacts.map((fact, idx) => (
                <div key={idx} className="flex justify-between py-0.5 border-b border-slate-100 dark:border-slate-800/60">
                  <span className="text-slate-500 font-medium">{fact.label}</span>
                  <span className="text-slate-900 dark:text-zinc-100 text-right max-w-[200px] font-mono text-[11px]">
                    {fact.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Anatomical Relations */}
          <div className="space-y-1 pt-2 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-zinc-100 mb-1">
              Anatomical Relations
            </h3>
            <ul className="text-xs text-slate-600 dark:text-zinc-400 space-y-1 pl-3 list-disc">
              {activeData.relations.map((rel, idx) => (
                <li key={idx}>{rel}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Center Column (Span 4): Interactive Anatomical Model with Pins */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-slate-50/70 dark:bg-[#111622] border border-slate-200 dark:border-slate-800 flex flex-col justify-between min-h-[580px]">
          {/* Anatomy viewport with clickable pins */}
          <div className="relative flex-1 flex items-center justify-center min-h-[460px]">
            {/* Visual silhouette representation */}
            <div className="relative w-48 h-96 flex items-center justify-center">
              <div className="w-36 h-92 bg-gradient-to-b from-sky-500/20 via-sky-600/30 to-slate-700/40 rounded-full blur-[1px] border border-sky-500/30" />
            </div>

            {/* Clickable Organ Callout Pins */}
            {/* Lungs Pin */}
            <button
              onClick={() => setSelectedOrgan('Lungs')}
              className={`absolute top-24 left-6 px-3 py-1 rounded-full text-xs font-bold shadow-md transition-all ${
                selectedOrgan === 'Lungs'
                  ? 'bg-sky-600 text-white ring-2 ring-sky-400 scale-105'
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-zinc-200 hover:bg-sky-50'
              }`}
            >
              Lungs
            </button>

            {/* Heart Pin */}
            <button
              onClick={() => setSelectedOrgan('Heart')}
              className={`absolute top-36 right-6 px-3 py-1 rounded-full text-xs font-bold shadow-md transition-all ${
                selectedOrgan === 'Heart'
                  ? 'bg-sky-600 text-white ring-2 ring-sky-400 scale-105'
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-zinc-200 hover:bg-sky-50'
              }`}
            >
              Heart
            </button>

            {/* Liver Pin */}
            <button
              onClick={() => setSelectedOrgan('Liver')}
              className={`absolute top-52 left-6 px-3 py-1 rounded-full text-xs font-bold shadow-md transition-all ${
                selectedOrgan === 'Liver'
                  ? 'bg-sky-600 text-white ring-2 ring-sky-400 scale-105'
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-zinc-200 hover:bg-sky-50'
              }`}
            >
              Liver
            </button>

            {/* Kidney Pin */}
            <button
              onClick={() => setSelectedOrgan('Kidney')}
              className={`absolute top-64 right-6 px-3 py-1 rounded-full text-xs font-bold shadow-md transition-all ${
                selectedOrgan === 'Kidney'
                  ? 'bg-sky-600 text-white ring-2 ring-sky-400 scale-105'
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-zinc-200 hover:bg-sky-50'
              }`}
            >
              Kidney
            </button>
          </div>

          {/* Bottom Controls Bar */}
          <div className="flex items-center justify-around p-2 bg-white dark:bg-[#161c2c] rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-zinc-400">
            <button className="flex items-center gap-1 hover:text-sky-600">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Rotate</span>
            </button>
            <button className="flex items-center gap-1 hover:text-sky-600">
              <ZoomIn className="w-3.5 h-3.5" />
              <span>Zoom</span>
            </button>
            <button
              onClick={() => setSelectedOrgan('Heart')}
              className="flex items-center gap-1 hover:text-sky-600"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            <button className="flex items-center gap-1 hover:text-sky-600">
              <Layers className="w-3.5 h-3.5" />
              <span>Layers</span>
            </button>
          </div>
        </div>

        {/* Right Column (Span 4): Learning & References */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-slate-50/70 dark:bg-[#111622] border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white text-sm">
              <BookOpen className="w-4 h-4 text-sky-600" />
              <span>Learning & References</span>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto text-[11px]">
            {(['All', 'Articles', 'Books', 'Notes', 'Videos'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setReferenceFilter(filter)}
                className={`px-2.5 py-1 rounded-full font-medium transition-colors ${
                  referenceFilter === filter
                    ? 'bg-sky-600 text-white font-bold'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-100'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Recommended for Organ */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-700 dark:text-zinc-300">
              Recommended for {selectedOrgan}
            </h4>
            {[
              { title: `Anatomy of the ${selectedOrgan}`, time: '10 min read' },
              { title: `Cardiac Physiology & Hemodynamics`, time: '12 min read' },
              { title: `Common ${selectedOrgan} Pathologies & Diseases`, time: '15 min read' },
            ].map((rec, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-white dark:bg-[#161c2c] border border-slate-200/80 dark:border-slate-800 hover:border-sky-500 cursor-pointer flex items-center justify-between transition-all group"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-zinc-100 group-hover:text-sky-600 transition-colors">
                    {rec.title}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    Article · {rec.time}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-sky-600 transition-all" />
              </div>
            ))}
          </div>

          {/* Top Textbooks */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <h4 className="text-sm font-bold text-slate-700 dark:text-zinc-300">
              Top Textbooks
            </h4>
            {[
              { name: "Gray's Anatomy", ed: '41st Edition', pub: 'Elsevier' },
              { name: 'Guyton and Hall Medical Physiology', ed: '14th Edition', pub: 'Elsevier' },
              { name: "Braunwald's Heart Disease", ed: '12th Edition', pub: 'Elsevier' },
            ].map((tb, idx) => (
              <div
                key={idx}
                className="p-2 rounded-xl bg-white dark:bg-[#161c2c] border border-slate-200/80 dark:border-slate-800 flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-zinc-100">
                    {tb.name}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {tb.ed} · {tb.pub}
                  </div>
                </div>
                <button
                  onClick={() => onOpenStudio('open-book')}
                  className="px-2.5 py-1 rounded bg-sky-500/10 text-sky-600 dark:text-sky-400 text-xs font-medium hover:bg-sky-500/20"
                >
                  View
                </button>
              </div>
            ))}
          </div>

          {/* My Notes */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-700 dark:text-zinc-300">
                My Notes
              </h4>
              <button
                onClick={() => onOpenStudio('make-note')}
                className="text-xs text-sky-600 font-bold flex items-center gap-1 hover:underline"
              >
                <Plus className="w-3 h-3" />
                <span>New Note</span>
              </button>
            </div>
            {[
              { title: `${selectedOrgan} — High yield points`, date: 'Last edited 2 days ago' },
              { title: `Cardiac cycle summary & murmurs`, date: 'Last edited 1 week ago' },
            ].map((note, idx) => (
              <div
                key={idx}
                onClick={() => notebooks[0] && onOpenNotebook(notebooks[0].id)}
                className="p-2 rounded-xl bg-white dark:bg-[#161c2c] border border-slate-200/80 dark:border-slate-800 hover:border-sky-500 cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-sky-600" />
                  <div>
                    <div className="text-xs font-medium text-slate-900 dark:text-zinc-100">
                      {note.title}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">{note.date}</div>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
