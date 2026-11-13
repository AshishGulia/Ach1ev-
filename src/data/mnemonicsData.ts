export interface MnemonicItem {
  id: string;
  acronym: string;
  title: string;
  subject: string;
  category: 'Pharm' | 'Endo' | 'Renal' | 'Cardio' | 'General';
  breakdown: { letter: string; meaning: string }[];
  summaryPearl: string;
}

export const CLINICAL_MNEMONICS: MnemonicItem[] = [];
