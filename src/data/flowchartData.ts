export interface FlowchartNode {
  id: string;
  type: 'start' | 'decision' | 'action' | 'alert' | 'endpoint';
  label: string;
  detail?: string;
  branchYes?: string;
  branchNo?: string;
}

export interface MedicalFlowchartDoc {
  id: string;
  title: string;
  subject: string;
  category: string;
  lastUpdated: string;
  summary: string;
  nodes: FlowchartNode[];
}

export const INITIAL_FLOWCHART_DOCS: MedicalFlowchartDoc[] = [];

/* ========================================================================= */
/* CLASSIFICATION FLOWCHART & DECISION TREE WITH LEVELS SYSTEM              */
/* ========================================================================= */

export interface ClassificationItemNode {
  id: string;
  level: 1 | 2 | 3 | 4;
  title: string;
  badge?: string;
  description: string;
  keyPearl?: string;
  color?: string;
  children?: ClassificationItemNode[];
}

export interface ClassificationTreeDoc {
  id: string;
  title: string;
  subject: string;
  category: string;
  levelsGuide: {
    level: 1 | 2 | 3 | 4;
    label: string;
    description: string;
  }[];
  root: ClassificationItemNode;
}

export const CLASSIFICATION_TEMPLATES: ClassificationTreeDoc[] = [];
