import { GoogleDriveAccount } from '../types';

export const DRIVE_APP_FOLDER_NAME = 'Ach1ev Clinical Library';
const GOOGLE_DRIVE_SCOPE =
  'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile';
const GOOGLE_IDENTITY_SCOPE =
  'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile';

const LS_GOOGLE_CLIENT_ID = 'medden_google_client_id';
const SS_RESOLVED_GOOGLE_CLIENT_ID = 'medden_resolved_google_client_id';
const LS_GOOGLE_USER = 'medden_google_user';
const SS_DRIVE_SESSION_PREFIX = 'medden_gdrive_session_';

export interface GoogleSessionUser {
  email: string;
  name?: string;
  picture?: string;
  accessToken?: string;
  expiresAt?: number;
}

interface DriveTokenRecord {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
  email?: string;
  displayName?: string;
  folderId?: string;
  folderName?: string;
}

export interface DriveUploadResult {
  driveFileId: string;
  driveFolderId: string;
  fileName: string;
  mimeType: string;
  fileSizeBytes: number;
  webViewLink: string;
  previewUrl: string;
  webContentLink?: string;
}

let cachedResolvedGoogleClientId: string | null = null;

export function getGoogleClientId(): string {
  const envId = (import.meta.env?.VITE_GOOGLE_CLIENT_ID as string | undefined)?.trim() || '';
  if (envId && !envId.includes('YOUR_GOOGLE')) return envId;
  if (typeof window !== 'undefined') {
    const localId = localStorage.getItem(LS_GOOGLE_CLIENT_ID)?.trim() || '';
    if (localId) return localId;
    const sessionId = sessionStorage.getItem(SS_RESOLVED_GOOGLE_CLIENT_ID)?.trim() || '';
    if (sessionId) return sessionId;
  }
  return cachedResolvedGoogleClientId || '';
}

export async function resolveGoogleClientId(): Promise<string> {
  const localOrEnv = getGoogleClientId();
  if (localOrEnv) {
    cachedResolvedGoogleClientId = localOrEnv;
    return localOrEnv;
  }
  try {
    const resp = await fetch('/api/auth/google/config');
    if (resp.ok) {
      const data = await resp.json();
      if (typeof data?.clientId === 'string' && data.clientId.trim()) {
        const resolved = data.clientId.trim();
        cachedResolvedGoogleClientId = resolved;
        if (typeof window !== 'undefined') {
          try {
            sessionStorage.setItem(SS_RESOLVED_GOOGLE_CLIENT_ID, resolved);
          } catch {}
        }
        return resolved;
      }
    }
  } catch {
    // Ignore runtime config fallback network errors
  }
  return '';
}

export async function prefetchGoogleOAuth(): Promise<void> {
  try {
    const id = await resolveGoogleClientId();
    if (id && typeof window !== 'undefined') {
      await loadGoogleIdentityServices();
    }
  } catch {
    // Ignore background prefetch errors
  }
}

if (typeof window !== 'undefined') {
  void prefetchGoogleOAuth();
}

export function readStoredGoogleUser(): GoogleSessionUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(LS_GOOGLE_USER);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GoogleSessionUser;
    if (!parsed?.email) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeStoredGoogleUser(profile: GoogleSessionUser | null): void {
  if (typeof window === 'undefined') return;
  if (!profile) {
    localStorage.removeItem(LS_GOOGLE_USER);
    return;
  }
  localStorage.setItem(LS_GOOGLE_USER, JSON.stringify(profile));
}

export function saveRuntimeGoogleClientId(clientId: string): void {
  if (typeof window === 'undefined') return;
  if (clientId.trim()) {
    localStorage.setItem(LS_GOOGLE_CLIENT_ID, clientId.trim());
  } else {
    localStorage.removeItem(LS_GOOGLE_CLIENT_ID);
  }
}

function getSessionKey(userId: string): string {
  return `${SS_DRIVE_SESSION_PREFIX}${userId || 'local'}`;
}

export function readStoredDriveSession(userId: string): DriveTokenRecord | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw =
      localStorage.getItem(getSessionKey(userId)) ||
      sessionStorage.getItem(getSessionKey(userId)) ||
      (userId && userId !== 'local'
        ? localStorage.getItem(getSessionKey('local')) || sessionStorage.getItem(getSessionKey('local'))
        : null);
    if (!raw) return null;
    const parsed: DriveTokenRecord = JSON.parse(raw);
    if (!parsed?.accessToken) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeStoredDriveSession(userId: string, record: DriveTokenRecord | null): void {
  if (typeof window === 'undefined') return;
  const key = getSessionKey(userId);
  if (!record) {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
    if (userId && userId !== 'local') {
      localStorage.removeItem(getSessionKey('local'));
      sessionStorage.removeItem(getSessionKey('local'));
    }
    return;
  }
  localStorage.setItem(key, JSON.stringify(record));
}

export function toDriveAccountStatus(record: DriveTokenRecord | null): GoogleDriveAccount {
  if (!record || !record.accessToken) {
    return { connected: false };
  }
  const stillValid = !record.expiresAt || record.expiresAt > Date.now() + 15_000;
  return {
    connected: stillValid,
    email: record.email,
    displayName: record.displayName,
    folderId: record.folderId,
    folderName: record.folderName || DRIVE_APP_FOLDER_NAME,
    expiresAt: record.expiresAt,
  };
}

let gisScriptPromise: Promise<void> | null = null;

export function loadGoogleIdentityServices(): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Google Identity Services requires a browser environment.'));
  }
  if ((window as any).google?.accounts?.oauth2?.initTokenClient) {
    return Promise.resolve();
  }
  if (gisScriptPromise) return gisScriptPromise;

  gisScriptPromise = new Promise<void>((resolve, reject) => {
    const finishSuccess = () => resolve();
    const finishError = (msg: string) => {
      gisScriptPromise = null;
      reject(new Error(msg));
    };

    const existing = document.querySelector('script[src="https://accounts.google.com/gsi/client"]') as HTMLScriptElement | null;
    if (existing) {
      const start = Date.now();
      const poll = window.setInterval(() => {
        if ((window as any).google?.accounts?.oauth2?.initTokenClient) {
          window.clearInterval(poll);
          finishSuccess();
        } else if (Date.now() - start > 7000) {
          window.clearInterval(poll);
          finishError('Google OAuth script timed out. Check network/ad-blocker and try again.');
        }
      }, 50);
      existing.addEventListener('load', () => {
        if ((window as any).google?.accounts?.oauth2?.initTokenClient) {
          window.clearInterval(poll);
          finishSuccess();
        }
      });
      existing.addEventListener('error', () => {
        window.clearInterval(poll);
        finishError('Failed to load Google OAuth script (accounts.google.com/gsi/client).');
      });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if ((window as any).google?.accounts?.oauth2?.initTokenClient) {
        finishSuccess();
      } else {
        finishError('Google OAuth script loaded, but oauth2 client was unavailable.');
      }
    };
    script.onerror = () => finishError('Could not load Google Identity Services client script.');
    document.head.appendChild(script);
  });

  return gisScriptPromise;
}

export async function fetchGoogleUserInfo(
  accessToken: string
): Promise<{ email?: string; name?: string; picture?: string }> {
  try {
    const resp = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!resp.ok) return {};
    const data = await resp.json();
    return { email: data.email, name: data.name, picture: data.picture };
  } catch {
    return {};
  }
}

function getCurrentOriginLabel(): string {
  return typeof window !== 'undefined' ? window.location.origin : 'https://ach1ev.com';
}

function formatGisPopupError(err: any, contextLabel: string): Error {
  const errType = String(err?.type || '').toLowerCase();
  const origin = getCurrentOriginLabel();
  if (errType === 'popup_failed_to_open') {
    return new Error(
      `Browser blocked the ${contextLabel} popup. Allow popups for ${origin} and click "Continue with Google" again.`
    );
  }
  if (errType === 'popup_closed') {
    return new Error(
      `${contextLabel} popup closed before completing sign-in. (If Google showed Error 400 origin_mismatch or Error 403 access_denied, ensure ${origin} is in Google Cloud Authorized JavaScript origins and OAuth Consent Screen is Published.)`
    );
  }
  return new Error(
    err?.message ||
      `${contextLabel} popup failed (${errType || 'unknown'}). Ensure ${origin} is listed under Authorized JavaScript origins in Google Cloud Console.`
  );
}

function requestGoogleTokenWithGIS(
  clientId: string,
  scope: string,
  prompt: 'consent' | 'select_account' | '' = 'select_account',
  contextLabel = 'Google sign-in'
): Promise<{ access_token: string; expires_in?: number; scope?: string }> {
  const startPopup = () =>
    new Promise<{ access_token: string; expires_in?: number; scope?: string }>((resolve, reject) => {
      const googleApi = (window as any).google;
      if (!googleApi?.accounts?.oauth2?.initTokenClient) {
        reject(new Error('Google OAuth2 Token Client unavailable in this browser.'));
        return;
      }

      try {
        const tokenClient = googleApi.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope,
          include_granted_scopes: true,
          callback: (resp: any) => {
            if (resp?.error) {
              const rawMsg = String(resp.error_description || resp.error || '');
              const origin = getCurrentOriginLabel();
              if (rawMsg.toLowerCase().includes('access_denied')) {
                reject(
                  new Error(
                    `Google OAuth access_denied: Authorization was denied or blocked for ${origin} (check OAuth Consent Screen publishing/test users or uncheck Drive access).`
                  )
                );
                return;
              }
              reject(new Error(rawMsg || `${contextLabel} was cancelled.`));
              return;
            }
            if (!resp?.access_token) {
              reject(new Error('Google did not return an access token.'));
              return;
            }
            resolve(resp);
          },
          error_callback: (err: any) => {
            reject(formatGisPopupError(err, contextLabel));
          },
        });

        tokenClient.requestAccessToken({ prompt });
      } catch (initErr: any) {
        reject(new Error(initErr?.message || `Could not start ${contextLabel}.`));
      }
    });

  if (typeof window !== 'undefined' && (window as any).google?.accounts?.oauth2?.initTokenClient) {
    return startPopup();
  }
  return loadGoogleIdentityServices().then(startPopup);
}

/**
 * Direct browser Google Sign-In via Google Identity Services.
 * Used cleanly whenever Supabase Google OAuth provider is disabled so clicking "Continue with Google"
 * works directly without navigating away to a raw JSON 400 error screen.
 */
export async function signInWithGoogleIdentity(
  userIdForDrive: string,
  includeDriveScope = true
): Promise<{
  profile: GoogleSessionUser;
  driveAccount: GoogleDriveAccount;
}> {
  const clientId = getGoogleClientId() || (await resolveGoogleClientId());
  if (!clientId) {
    throw new Error(
      `Google Client ID is not configured for ${getCurrentOriginLabel()}. Click "Configure Keys" below to paste your Google OAuth 2.0 Client ID (or enable Google in Supabase Auth Providers).`
    );
  }

  const scope = includeDriveScope ? GOOGLE_DRIVE_SCOPE : GOOGLE_IDENTITY_SCOPE;
  const tokenResult = await requestGoogleTokenWithGIS(clientId, scope, 'select_account');

  const expiresInMs = (Number(tokenResult.expires_in) || 3500) * 1000;
  const expiresAt = Date.now() + expiresInMs;
  const userInfo = await fetchGoogleUserInfo(tokenResult.access_token);
  if (!userInfo.email) {
    throw new Error('Google sign-in succeeded but email permission was not granted.');
  }

  const profile: GoogleSessionUser = {
    email: userInfo.email,
    name: userInfo.name,
    picture: userInfo.picture,
    accessToken: tokenResult.access_token,
    expiresAt,
  };
  writeStoredGoogleUser(profile);

  let driveAccount: GoogleDriveAccount = { connected: false };
  const grantedDriveScope =
    typeof tokenResult.scope === 'string'
      ? tokenResult.scope.includes('drive.file')
      : includeDriveScope;

  if (grantedDriveScope) {
    try {
      const folderId = await ensureAchievDriveFolder(tokenResult.access_token);
      const record: DriveTokenRecord = {
        accessToken: tokenResult.access_token,
        expiresAt,
        email: userInfo.email,
        displayName: userInfo.name,
        folderId,
        folderName: DRIVE_APP_FOLDER_NAME,
      };
      writeStoredDriveSession(userIdForDrive || 'local', record);
      driveAccount = toDriveAccountStatus(record);
    } catch {
      // Basic Google login remains valid even if Drive folder creation is skipped/declined
    }
  }

  return { profile, driveAccount };
}

/**
 * Connects a user's personal Google Drive via Google Identity Services OAuth2 Token Flow.
 * Requests `drive.file` scope so Ach1ev only accesses the folder and PDFs it creates.
 * Calls `requestAccessToken()` synchronously inside the user gesture whenever clientId & GIS are ready.
 */
export async function connectPersonalGoogleDrive(userId: string): Promise<DriveTokenRecord> {
  const clientId = getGoogleClientId() || (await resolveGoogleClientId());
  if (!clientId) {
    throw new Error(
      'Google OAuth Client ID is not configured. Set VITE_GOOGLE_CLIENT_ID in Vercel/env or enter it under Cloud & Drive settings.'
    );
  }

  const tokenResult = await requestGoogleTokenWithGIS(
    clientId,
    GOOGLE_DRIVE_SCOPE,
    'consent',
    'Google Drive'
  );

  const expiresInMs = (Number(tokenResult.expires_in) || 3500) * 1000;
  const userInfo = await fetchGoogleUserInfo(tokenResult.access_token);
  const folderId = await ensureAchievDriveFolder(tokenResult.access_token);

  const record: DriveTokenRecord = {
    accessToken: tokenResult.access_token,
    expiresAt: Date.now() + expiresInMs,
    email: userInfo.email,
    displayName: userInfo.name,
    folderId,
    folderName: DRIVE_APP_FOLDER_NAME,
  };

  writeStoredDriveSession(userId, record);
  return record;
}

/**
 * Seeds Drive access directly from a Supabase Google OAuth login (`provider_token`)
 * when the user authenticated with Google including the `drive.file` scope.
 */
export async function seedDriveTokenFromProvider(
  userId: string,
  providerToken: string,
  fallbackEmail?: string
): Promise<DriveTokenRecord> {
  const userInfo = await fetchGoogleUserInfo(providerToken);
  let folderId: string | undefined;
  try {
    folderId = await ensureAchievDriveFolder(providerToken);
  } catch {
    // User signed in via Google SSO without Drive scope — do not mark folder connected
    throw new Error('Google sign-in token lacks drive.file permission.');
  }

  const record: DriveTokenRecord = {
    accessToken: providerToken,
    expiresAt: Date.now() + 3400 * 1000,
    email: userInfo.email || fallbackEmail,
    displayName: userInfo.name,
    folderId,
    folderName: DRIVE_APP_FOLDER_NAME,
  };
  writeStoredDriveSession(userId, record);
  return record;
}

export async function disconnectPersonalGoogleDrive(userId: string): Promise<void> {
  const existing = readStoredDriveSession(userId);
  if (existing?.accessToken && typeof window !== 'undefined' && (window as any).google?.accounts?.oauth2?.revoke) {
    try {
      (window as any).google.accounts.oauth2.revoke(existing.accessToken, () => {});
    } catch {
      // Ignore revoke network errors
    }
  }
  writeStoredDriveSession(userId, null);
}

/**
 * Finds or creates the dedicated `Ach1ev Clinical Library` folder inside the user's personal Google Drive.
 */
export async function ensureAchievDriveFolder(accessToken: string): Promise<string> {
  const query = encodeURIComponent(
    `name='${DRIVE_APP_FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder' and trashed=false`
  );
  const searchResp = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}&spaces=drive&fields=files(id,name)&pageSize=5`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!searchResp.ok) {
    const errText = await searchResp.text();
    const err: any = new Error(
      searchResp.status === 401
        ? 'Google Drive session expired (401). Please click Connect Drive to re-authorize.'
        : `Google Drive folder lookup failed (${searchResp.status}): ${errText}`
    );
    err.status = searchResp.status;
    throw err;
  }

  const searchJson = await searchResp.json();
  if (Array.isArray(searchJson.files) && searchJson.files.length > 0 && searchJson.files[0]?.id) {
    return searchJson.files[0].id as string;
  }

  const createResp = await fetch('https://www.googleapis.com/drive/v3/files?fields=id,name', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: DRIVE_APP_FOLDER_NAME,
      mimeType: 'application/vnd.google-apps.folder',
      description: 'Dedicated textbooks, handouts & PDF vault for Ach1ev (Settle Ideas).',
    }),
  });

  if (!createResp.ok) {
    const errText = await createResp.text();
    const err: any = new Error(
      createResp.status === 401
        ? 'Google Drive session expired (401). Please click Connect Drive to re-authorize.'
        : `Could not create Google Drive folder (${createResp.status}): ${errText}`
    );
    err.status = createResp.status;
    throw err;
  }

  const created = await createResp.json();
  return created.id as string;
}

export const ensureMedDenDriveFolder = ensureAchievDriveFolder;

/**
 * Uploads a heavy PDF or academic document directly into the user's own connected Google Drive
 * using Google Drive Resumable Upload API, keeping Supabase Storage completely free of heavy blobs.
 */
export async function uploadPdfToPersonalDrive(
  file: File,
  accessToken: string,
  options?: {
    folderId?: string;
    makeAnyoneReader?: boolean;
    onProgress?: (percent: number) => void;
    userId?: string;
  }
): Promise<DriveUploadResult> {
  let folderId = options?.folderId || (await ensureAchievDriveFolder(accessToken));
  const mimeType = file.type || 'application/pdf';

  const startResumableInit = (targetFolderId: string) =>
    fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&fields=id,name,size,mimeType,webViewLink,webContentLink',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json; charset=UTF-8',
          'X-Upload-Content-Type': mimeType,
          'X-Upload-Content-Length': String(file.size),
        },
        body: JSON.stringify({
          name: file.name,
          mimeType,
          parents: [targetFolderId],
          description: 'Uploaded from Ach1ev — Settle Ideas Study Workspace',
        }),
      }
    );

  // 1. Initiate Resumable Upload Session (recover cleanly if cached folderId was trashed -> 404)
  let initResp = await startResumableInit(folderId);
  if (initResp.status === 404 && options?.folderId) {
    folderId = await ensureAchievDriveFolder(accessToken);
    initResp = await startResumableInit(folderId);
  }

  if (!initResp.ok) {
    const errText = await initResp.text();
    if (initResp.status === 401 && options?.userId) {
      writeStoredDriveSession(options.userId, null);
    }
    const err: any = new Error(
      initResp.status === 401
        ? 'Google Drive session expired (401). Please click Connect Drive to re-authorize.'
        : `Drive upload initialization failed (${initResp.status}): ${errText}`
    );
    err.status = initResp.status;
    throw err;
  }

  const uploadUrl = initResp.headers.get('Location');
  if (!uploadUrl) {
    throw new Error('Google Drive did not return a resumable upload Location URL.');
  }

  // 2. Stream binary file directly to Google Drive via XHR with progress tracking
  const uploadedMeta = await new Promise<any>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', uploadUrl, true);
    xhr.setRequestHeader('Content-Type', mimeType);

    xhr.upload.onprogress = (ev) => {
      if (ev.lengthComputable && options?.onProgress) {
        const pct = Math.min(99, Math.round((ev.loaded / ev.total) * 100));
        options.onProgress(pct);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          options?.onProgress?.(100);
          resolve(JSON.parse(xhr.responseText));
        } catch {
          reject(new Error('Invalid metadata JSON returned by Google Drive upload.'));
        }
      } else {
        reject(new Error(`Drive file upload failed (${xhr.status}): ${xhr.responseText}`));
      }
    };

    xhr.onerror = () => reject(new Error('Network error while uploading PDF to Google Drive.'));
    xhr.send(file);
  });

  const driveFileId = uploadedMeta.id as string;

  // 3. Optionally grant link-reader access for seamless iframe embedding across user's devices
  if (options?.makeAnyoneReader !== false) {
    try {
      await fetch(`https://www.googleapis.com/drive/v3/files/${driveFileId}/permissions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: 'reader',
          type: 'anyone',
        }),
      });
    } catch {
      // Domain policies may restrict anyone sharing; preview works for signed-in Drive owner regardless
    }
  }

  return {
    driveFileId,
    driveFolderId: folderId,
    fileName: uploadedMeta.name || file.name,
    mimeType: uploadedMeta.mimeType || mimeType,
    fileSizeBytes: Number(uploadedMeta.size || file.size),
    webViewLink: uploadedMeta.webViewLink || `https://drive.google.com/file/d/${driveFileId}/view`,
    previewUrl: `https://drive.google.com/file/d/${driveFileId}/preview`,
    webContentLink: uploadedMeta.webContentLink,
  };
}

/**
 * Normalizes any Google Drive `/view` URL or File ID into an embeddable `/preview` URL.
 */
export function getDrivePreviewUrl(driveFileIdOrUrl?: string): string | null {
  if (!driveFileIdOrUrl) return null;
  if (!driveFileIdOrUrl.startsWith('http') && !driveFileIdOrUrl.startsWith('blob:')) {
    return `https://drive.google.com/file/d/${driveFileIdOrUrl}/preview`;
  }
  const match = driveFileIdOrUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (match?.[1]) {
    return `https://drive.google.com/file/d/${match[1]}/preview`;
  }
  return driveFileIdOrUrl;
}
