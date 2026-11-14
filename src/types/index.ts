export type SubjectCourse =
  | 'Pharmacology'
  | 'Anatomy'
  | 'Pathology'
  | 'Physiology'
  | 'Microbiology'
  | 'Biochemistry'
  | 'Internal Medicine'
  | 'Pediatrics'
  | 'Surgery'
  | 'Forensic Medicine';

export interface OptionSlab {
  id: string;
  title: string;
  subtitle: string;
  subject: SubjectCourse;
  iconName: string;
  badge?: string;
  accentColor: string; // e.g. 'emerald', 'sky', 'indigo', 'rose', 'amber', 'slate'
  enabled: boolean;
  linkAction: string; // e.g. 'open-book', 'open-cal', 'open-practical', 'open-conferences', 'open-custom'
  metaText?: string;
  fileAttachmentUrl?: string;
  fileAttachmentName?: string;
  fileAttachmentSize?: string;
  customNotes?: string;
  size?: 'compact' | 'normal' | 'expanded';
  order?: number;
}

export type PaperType =
  | 'ruled-thin'
  | 'box-ruled'
  | 'split-blank-ruled'
  | 'blank'
  | 'dot-grid';

export type PaperColor =
  | 'white'
  | 'beige'
  | 'dark'
  | 'sepia'
  | 'mint'
  | 'ice-blue';

export interface InkStroke {
  points: { x: number; y: number }[];
  color: string;
  width: number;
  tool: 'pen' | 'highlighter' | 'fountain' | 'eraser';
  opacity?: number;
}

export interface SnippetScreenshot {
  id: string;
  dataUrl: string;
  sourceBookTitle: string;
  pageNumber: number;
  timestamp: string;
  caption?: string;
}

export interface NoteAttachment {
  id: string;
  name: string;
  type: 'photo' | 'document-link' | 'web-link' | 'audio' | 'video' | 'link' | 'doc';
  url?: string;
  thumbnailUrl?: string;
  caption?: string;
  targetBook?: string;
  targetChapter?: string;
  targetPage?: number | string;
  targetLine?: string;
  addedAt: string;
  duration?: string;
  size?: string;
}

export interface NotePage {
  id: string;
  title: string;
  contentHtml: string;
  inkStrokes: InkStroke[];
  screenshots: SnippetScreenshot[];
  attachments?: NoteAttachment[];
  summary?: string;
  date: string;
  updatedAt: string;
}

export interface BookThumbnailConfig {
  displayMode: 'logo-only' | 'concise';
  kind: 'letter' | 'icon';
  letter?: string;
  fontId?: string;
  iconName?: string;
  fgColor?: string;
  bgColor?: string;
  conciseTitle?: string;
}

export interface Notebook {
  id: string;
  title: string;
  subject: SubjectCourse;
  coverTheme: 'astronomy' | 'wildlife' | 'anatomy' | 'geometric' | 'dna' | 'botany' | 'custom';
  coverCustomUrl?: string;
  thumbnail?: BookThumbnailConfig;
  coverTitle: string;
  coverSubtitle: string;
  coverColor: string;
  paperType: PaperType;
  paperColor: PaperColor;
  customPaperHex?: string;
  pages: NotePage[];
  activePageIndex: number;
  createdAt: string;
  updatedAt: string;
}

export interface BookPage {
  pageNumber: number;
  title: string;
  contentHtml: string;
  keyTopic: string;
  summaryPearl: string;
}

export interface MedicalBook {
  id: string;
  title: string;
  subject: SubjectCourse;
  author: string;
  edition: string;
  coverColor: string;
  thumbnail?: BookThumbnailConfig;
  pages: BookPage[];
  isUserUploaded?: boolean;
  pdfFileUrl?: string;
  driveFileId?: string;
  driveFolderId?: string;
  fileSizeBytes?: number;
  mimeType?: string;
  storageProvider?: 'google_drive' | 'embedded' | 'local';
  bookmarks: number[];
  updatedAt?: string;
}

export type CloudSyncStatus = 'local-only' | 'connecting' | 'synced' | 'syncing' | 'error';

export interface GoogleDriveAccount {
  connected: boolean;
  email?: string;
  displayName?: string;
  folderId?: string;
  folderName?: string;
  expiresAt?: number;
}

export interface StudyTask {
  id: string;
  title: string;
  subject: SubjectCourse;
  dueTime?: string;
  completed: boolean;
  highYield: boolean;
  tag?: string;
  priority?: 'critical' | 'high' | 'routine';
}

export interface ClinicalReminder {
  id: string;
  title: string;
  dueTime: string;
  dueDate?: string;
  category: 'Ward Rounds' | 'Drug Review' | 'Study Goal' | 'Wellness & Rest' | 'Exam Trap' | 'General';
  priority: 'critical' | 'high' | 'routine' | 'wellness';
  notificationEnabled: boolean;
  notificationType: 'sound' | 'banner' | 'both';
  alertTiming: 'at-time' | '10m-before' | '30m-before' | '1h-before';
  recurrence: 'none' | 'daily' | 'every-4h' | 'weekly';
  notes?: string;
  completed?: boolean;
}

export interface RosterEvent {
  id: string;
  title: string;
  subject: string;
  type: 'lecture' | 'practical' | 'posting' | 'seminar' | 'exam';
  date: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  venue: string;
  instructor?: string;
  notes?: string;
}

export interface BreakTimerConfig {
  intervalMinutes: number; // e.g. 20
  breakDurationSeconds: number; // e.g. 20
  soundEnabled: boolean;
  autoStartNext: boolean;
}

export interface UserProfile {
  name: string;
  username?: string;
  phone?: string;
  institution: string;
  currentYear: string;
  specialityGoal: string;
  activeSubject: SubjectCourse;
  email?: string;
  avatarUrl?: string;
  authProvider?: string;
}

export type DesignId = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10';

export interface DesignMeta {
  id: DesignId;
  name: string;
  subtitle: string;
  description: string;
  badge: string;
}

export type AppLanguage = string;

export interface LanguageOption {
  code: AppLanguage;
  label: string;
  nativeLabel: string;
  flag: string;
  greeting: string;
  region?: 'indian' | 'world' | 'custom';
  isCustom?: boolean;
}

export type AlmirahStyle =
  | 'victorian-teak'
  | 'modern-glass-steel'
  | 'royal-mahogany'
  | 'scandinavian-oak'
  | 'industrial-iron';

export interface DeveloperSuggestion {
  id: string;
  segment: string;
  title: string;
  suggestion: string;
  studentName: string;
  createdAt: string;
  status: 'under-review' | 'in-progress' | 'built';
  priority: 'low' | 'medium' | 'high' | 'critical';
  developerReply?: string;
  developerRepliedAt?: string;
  beforeImage?: string;
  afterImage?: string;
  chatScreenshot?: string;
  chatMediaType?: 'image' | 'video';
}

export interface PostMbbsOpportunity {
  id: string;
  title: string;
  category: 'clinical-residency' | 'non-clinical' | 'global-exam' | 'consulting-tech' | 'civil-services';
  country: string;
  stipendSalary: string;
  organization: string;
  link: string;
  contactEmail?: string;
  verified: boolean;
  description: string;
  tags: string[];
  addedBy?: string;
  isPublic?: boolean;
}

export interface SubscriptionTier {
  id: 'free' | 'resident-pro' | 'chief-resident' | 'fellow-master' | 'starter' | 'scholar-pro' | 'master-ultimate' | string;
  name: string;
  priceMonthly: number;
  priceAnnual: number;
  badge: string;
  description: string;
  features: string[];
  highlight?: boolean;
}

export interface SidebarSettings {
  showMySpace: boolean;
  showRead: boolean;
  showCreateNote: boolean;
  showCalendar: boolean;
  showLibrary: boolean;
  showMnemonics?: boolean;
  showCommunity: boolean;
  showLeisure?: boolean;
  showExploreBody?: boolean;
  showTalkToDev: boolean;
}

export type HomeThemeLayout = 'atelier-beige' | 'windows-disk' | 'ios-finder';

export type DashboardPreset =
  | 'cyber-tech'
  | 'nordic-noir'
  | 'haute-horlogerie'
  | 'geneva-quartz'
  | 'kyoto-sumi'
  | 'nordic'
  | 'fluent'
  | 'clinical-desk'
  | 'bento';

