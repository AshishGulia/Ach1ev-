import { RealtimeChannel } from '@supabase/supabase-js';
import { getSupabaseClient } from '../lib/supabaseClient';
import {
  MedicalBook,
  Notebook,
  NotePage,
  OptionSlab,
  RosterEvent,
  StudyTask,
  SubjectCourse,
  UserProfile,
} from '../types';

export interface WorkspaceSnapshot {
  profile: UserProfile | null;
  driveMeta?: {
    connected: boolean;
    email?: string;
    folderId?: string;
  };
  notebooks: Notebook[];
  trashedNotebooks: Array<{
    id: string;
    title: string;
    subject: string;
    deletedAt: string;
  }>;
  books: MedicalBook[];
  tasks: StudyTask[];
  rosterEvents: RosterEvent[];
  optionSlabs: OptionSlab[];
}

export async function fetchWorkspaceSnapshot(userId: string): Promise<WorkspaceSnapshot | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const [
    profileRes,
    notebooksRes,
    pagesRes,
    booksRes,
    tasksRes,
    rosterRes,
    slabsRes,
  ] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
    supabase.from('notebooks').select('*').eq('user_id', userId).order('updated_at', { ascending: false }),
    supabase.from('note_pages').select('*').eq('user_id', userId).order('page_order', { ascending: true }),
    supabase.from('medical_books').select('*').eq('user_id', userId).order('updated_at', { ascending: false }),
    supabase.from('study_tasks').select('*').eq('user_id', userId),
    supabase.from('roster_events').select('*').eq('user_id', userId),
    supabase.from('workspace_slabs').select('*').eq('user_id', userId).order('sort_order', { ascending: true }),
  ]);

  const errors = [
    profileRes.error,
    notebooksRes.error,
    pagesRes.error,
    booksRes.error,
    tasksRes.error,
    rosterRes.error,
    slabsRes.error,
  ].filter(Boolean);

  if (errors.length > 0) {
    throw new Error(errors[0]?.message || 'Failed to fetch workspace from Supabase.');
  }

  // Group pages by notebook_id
  const pagesByNb = new Map<string, NotePage[]>();
  for (const row of pagesRes.data || []) {
    const page: NotePage = {
      id: row.id,
      title: row.title || 'Untitled Page',
      contentHtml: row.content_html || '',
      summary: row.summary || undefined,
      inkStrokes: Array.isArray(row.ink_strokes) ? row.ink_strokes : [],
      screenshots: Array.isArray(row.screenshots) ? row.screenshots : [],
      attachments: Array.isArray(row.attachments) ? row.attachments : [],
      date: row.page_date || new Date().toISOString().split('T')[0],
      updatedAt: row.updated_at || new Date().toISOString(),
    };
    const arr = pagesByNb.get(row.notebook_id) || [];
    arr.push(page);
    pagesByNb.set(row.notebook_id, arr);
  }

  const notebooks: Notebook[] = [];
  const trashedNotebooks: WorkspaceSnapshot['trashedNotebooks'] = [];

  for (const row of notebooksRes.data || []) {
    if (row.is_trashed) {
      trashedNotebooks.push({
        id: row.id,
        title: row.title,
        subject: row.subject,
        deletedAt: (row.trashed_at || row.updated_at || new Date().toISOString()).split('T')[0],
      });
      continue;
    }

    const pages = pagesByNb.get(row.id) || [];
    notebooks.push({
      id: row.id,
      title: row.title,
      subject: (row.subject as SubjectCourse) || 'Pharmacology',
      coverTheme: row.cover_theme || 'astronomy',
      coverCustomUrl: row.cover_custom_url || undefined,
      coverTitle: row.cover_title || row.title,
      coverSubtitle: row.cover_subtitle || '',
      coverColor: row.cover_color || '#1e3a8a',
      paperType: row.paper_type || 'ruled-thin',
      paperColor: row.paper_color || 'beige',
      customPaperHex: row.custom_paper_hex || undefined,
      pages:
        pages.length > 0
          ? pages
          : [
              {
                id: `${row.id}-p1`,
                title: row.title,
                contentHtml: '',
                inkStrokes: [],
                screenshots: [],
                date: new Date().toISOString().split('T')[0],
                updatedAt: row.updated_at || new Date().toISOString(),
              },
            ],
      activePageIndex: row.active_page_index || 0,
      createdAt: row.created_at || new Date().toISOString(),
      updatedAt: row.updated_at || new Date().toISOString(),
    });
  }

  const books: MedicalBook[] = (booksRes.data || []).map((b: any) => ({
    id: b.id,
    title: b.title,
    subject: (b.subject as SubjectCourse) || 'Pharmacology',
    author: b.author || 'Medical Author',
    edition: b.edition || '1st Edition',
    coverColor: b.cover_color || '#1e3a8a',
    pdfFileUrl: b.pdf_url || undefined,
    driveFileId: b.drive_file_id || undefined,
    driveFolderId: b.drive_folder_id || undefined,
    fileSizeBytes: b.file_size_bytes ? Number(b.file_size_bytes) : undefined,
    mimeType: b.mime_type || undefined,
    storageProvider: b.storage_provider || 'embedded',
    isUserUploaded: Boolean(b.is_user_uploaded),
    bookmarks: Array.isArray(b.bookmarks) ? b.bookmarks : [],
    pages: Array.isArray(b.pages_json) ? b.pages_json : [],
    updatedAt: b.updated_at,
  }));

  const tasks: StudyTask[] = (tasksRes.data || []).map((t: any) => ({
    id: t.id,
    title: t.title,
    subject: (t.subject as SubjectCourse) || 'Pharmacology',
    dueTime: t.due_time || undefined,
    completed: Boolean(t.completed),
    highYield: Boolean(t.high_yield),
    tag: t.tag || undefined,
    priority: t.priority || 'routine',
  }));

  const rosterEvents: RosterEvent[] = (rosterRes.data || []).map((e: any) => ({
    id: e.id,
    title: e.title,
    subject: e.subject,
    type: e.event_type || 'lecture',
    date: e.event_date,
    dayOfWeek: e.day_of_week || 'Monday',
    startTime: e.start_time || '09:00',
    endTime: e.end_time || '10:00',
    venue: e.venue || 'Lecture Hall',
    instructor: e.instructor || undefined,
    notes: e.notes || undefined,
  }));

  const optionSlabs: OptionSlab[] = (slabsRes.data || []).map((s: any) => ({
    id: s.id,
    title: s.title,
    subtitle: s.subtitle || '',
    subject: (s.subject as SubjectCourse) || 'Pharmacology',
    iconName: s.icon_name || 'BookOpen',
    badge: s.badge || undefined,
    accentColor: s.accent_color || 'emerald',
    enabled: s.enabled !== false,
    linkAction: s.link_action || 'open-book',
    metaText: s.meta_text || undefined,
    fileAttachmentUrl: s.file_attachment_url || undefined,
    fileAttachmentName: s.file_attachment_name || undefined,
    fileAttachmentSize: s.file_attachment_size || undefined,
    customNotes: s.custom_notes || undefined,
    size: s.size_mode || 'normal',
    order: s.sort_order ?? 0,
  }));

  const p = profileRes.data;
  const profile: UserProfile | null = p
    ? {
        name: p.full_name || 'Medical Scholar',
        institution: p.institution || 'Academic Medical Center',
        currentYear: p.current_year || 'Clinical Year · Phase II',
        specialityGoal: p.speciality_goal || 'Internal Medicine',
        activeSubject: (p.active_subject as SubjectCourse) || 'Pharmacology',
        email: p.email || undefined,
      }
    : null;

  return {
    profile,
    driveMeta: p
      ? {
          connected: Boolean(p.google_drive_connected),
          email: p.google_drive_email || undefined,
          folderId: p.google_drive_folder_id || undefined,
        }
      : undefined,
    notebooks,
    trashedNotebooks,
    books,
    tasks,
    rosterEvents,
    optionSlabs,
  };
}

export async function pushProfileToCloud(
  userId: string,
  profile: UserProfile,
  driveMeta?: { connected?: boolean; email?: string; folderId?: string }
): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;

  const payload: any = {
    id: userId,
    full_name: profile.name,
    institution: profile.institution,
    current_year: profile.currentYear,
    speciality_goal: profile.specialityGoal,
    active_subject: profile.activeSubject,
  };
  if (profile.email) payload.email = profile.email;
  if (driveMeta) {
    if (typeof driveMeta.connected === 'boolean') {
      payload.google_drive_connected = driveMeta.connected;
    }
    if (driveMeta.email !== undefined) payload.google_drive_email = driveMeta.email;
    if (driveMeta.folderId !== undefined) payload.google_drive_folder_id = driveMeta.folderId;
  }

  const { error } = await supabase.from('profiles').upsert(payload, { onConflict: 'id' });
  if (error) throw new Error(error.message);
}

export async function pushNotebooksToCloud(userId: string, notebooks: Notebook[]): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase || notebooks.length === 0) return;

  const nbRows = notebooks.map((nb) => ({
    user_id: userId,
    id: nb.id,
    title: nb.title,
    subject: nb.subject,
    cover_theme: nb.coverTheme,
    cover_custom_url: nb.coverCustomUrl || null,
    cover_title: nb.coverTitle,
    cover_subtitle: nb.coverSubtitle,
    cover_color: nb.coverColor,
    paper_type: nb.paperType,
    paper_color: nb.paperColor,
    custom_paper_hex: nb.customPaperHex || null,
    active_page_index: nb.activePageIndex || 0,
    is_trashed: false,
  }));

  const { error: nbErr } = await supabase
    .from('notebooks')
    .upsert(nbRows, { onConflict: 'user_id,id' });
  if (nbErr) throw new Error(nbErr.message);

  const pageRows: any[] = [];
  for (const nb of notebooks) {
    (nb.pages || []).forEach((pg, index) => {
      pageRows.push({
        user_id: userId,
        id: pg.id,
        notebook_id: nb.id,
        page_order: index,
        title: pg.title,
        content_html: pg.contentHtml || '',
        summary: pg.summary || null,
        ink_strokes: pg.inkStrokes || [],
        screenshots: pg.screenshots || [],
        attachments: pg.attachments || [],
        page_date: pg.date || new Date().toISOString().split('T')[0],
      });
    });
  }

  if (pageRows.length > 0) {
    const { error: pgErr } = await supabase
      .from('note_pages')
      .upsert(pageRows, { onConflict: 'user_id,id' });
    if (pgErr) throw new Error(pgErr.message);
  }
}

export async function markNotebookTrashedInCloud(
  userId: string,
  notebookId: string,
  trashed: boolean
): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  const { error } = await supabase
    .from('notebooks')
    .update({
      is_trashed: trashed,
      trashed_at: trashed ? new Date().toISOString() : null,
    })
    .eq('user_id', userId)
    .eq('id', notebookId);
  if (error) throw new Error(error.message);
}

export async function deleteNotebookPermanentlyInCloud(
  userId: string,
  notebookId: string
): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  const { error } = await supabase
    .from('notebooks')
    .delete()
    .eq('user_id', userId)
    .eq('id', notebookId);
  if (error) throw new Error(error.message);
}

export async function emptyTrashedNotebooksInCloud(userId: string): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  const { error } = await supabase
    .from('notebooks')
    .delete()
    .eq('user_id', userId)
    .eq('is_trashed', true);
  if (error) throw new Error(error.message);
}

export async function pushBooksToCloud(userId: string, books: MedicalBook[]): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase || books.length === 0) return;

  // Store lightweight book metadata & external Google Drive `pdf_url` links ONLY (never raw heavy PDF bytes)
  const rows = books.map((b) => ({
    user_id: userId,
    id: b.id,
    title: b.title,
    subject: b.subject,
    author: b.author,
    edition: b.edition,
    cover_color: b.coverColor,
    pdf_url: b.pdfFileUrl && !b.pdfFileUrl.startsWith('blob:') ? b.pdfFileUrl : null,
    drive_file_id: b.driveFileId || null,
    drive_folder_id: b.driveFolderId || null,
    file_size_bytes: b.fileSizeBytes ?? null,
    mime_type: b.mimeType || 'application/pdf',
    storage_provider: b.storageProvider || (b.driveFileId ? 'google_drive' : 'embedded'),
    is_user_uploaded: Boolean(b.isUserUploaded),
    bookmarks: b.bookmarks || [],
    pages_json: b.pages || [],
  }));

  const { error } = await supabase
    .from('medical_books')
    .upsert(rows, { onConflict: 'user_id,id' });
  if (error) throw new Error(error.message);
}

export async function pushTasksToCloud(userId: string, tasks: StudyTask[]): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase || tasks.length === 0) return;

  const rows = tasks.map((t) => ({
    user_id: userId,
    id: t.id,
    title: t.title,
    subject: t.subject,
    due_time: t.dueTime || null,
    completed: Boolean(t.completed),
    high_yield: Boolean(t.highYield),
    tag: t.tag || null,
    priority: t.priority || 'routine',
  }));

  const { error } = await supabase
    .from('study_tasks')
    .upsert(rows, { onConflict: 'user_id,id' });
  if (error) throw new Error(error.message);
}

export async function pushRosterToCloud(userId: string, events: RosterEvent[]): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase || events.length === 0) return;

  const rows = events.map((e) => ({
    user_id: userId,
    id: e.id,
    title: e.title,
    subject: e.subject,
    event_type: e.type,
    event_date: e.date,
    day_of_week: e.dayOfWeek,
    start_time: e.startTime,
    end_time: e.endTime,
    venue: e.venue,
    instructor: e.instructor || null,
    notes: e.notes || null,
  }));

  const { error } = await supabase
    .from('roster_events')
    .upsert(rows, { onConflict: 'user_id,id' });
  if (error) throw new Error(error.message);
}

export async function pushSlabsToCloud(userId: string, slabs: OptionSlab[]): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase || slabs.length === 0) return;

  const rows = slabs.map((s, idx) => ({
    user_id: userId,
    id: s.id,
    title: s.title,
    subtitle: s.subtitle,
    subject: s.subject,
    icon_name: s.iconName,
    badge: s.badge || null,
    accent_color: s.accentColor,
    enabled: s.enabled,
    link_action: s.linkAction,
    meta_text: s.metaText || null,
    file_attachment_url:
      s.fileAttachmentUrl && !s.fileAttachmentUrl.startsWith('blob:') ? s.fileAttachmentUrl : null,
    file_attachment_name: s.fileAttachmentName || null,
    file_attachment_size: s.fileAttachmentSize || null,
    custom_notes: s.customNotes || null,
    size_mode: s.size || 'normal',
    sort_order: s.order ?? idx,
  }));

  const { error } = await supabase
    .from('workspace_slabs')
    .upsert(rows, { onConflict: 'user_id,id' });
  if (error) throw new Error(error.message);
}

export function subscribeToRealtimeWorkspace(
  userId: string,
  onRemoteChange: (table: string) => void
): () => void {
  const supabase = getSupabaseClient();
  if (!supabase) return () => {};

  const tables = [
    'notebooks',
    'note_pages',
    'medical_books',
    'study_tasks',
    'roster_events',
    'workspace_slabs',
    'profiles',
  ];

  let channel: RealtimeChannel = supabase.channel(`medden-sync-${userId}`);
  for (const table of tables) {
    const filterCol = table === 'profiles' ? 'id' : 'user_id';
    channel = channel.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table,
        filter: `${filterCol}=eq.${userId}`,
      },
      () => onRemoteChange(table)
    );
  }

  channel.subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
