import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { getSupabaseClient, getSupabaseConfig, isSupabaseConfigured } from '../lib/supabaseClient';
import { CloudSyncStatus, GoogleDriveAccount } from '../types';
import {
  connectPersonalGoogleDrive,
  disconnectPersonalGoogleDrive,
  GoogleSessionUser,
  prefetchGoogleOAuth,
  readStoredDriveSession,
  readStoredGoogleUser,
  seedDriveTokenFromProvider,
  signInWithGoogleIdentity,
  toDriveAccountStatus,
  writeStoredGoogleUser,
} from '../services/googleDriveService';

export type SocialProviderId = 'google' | 'apple' | 'azure';

export interface SocialProviderStatus {
  google?: boolean;
  apple?: boolean;
  azure?: boolean;
  email?: boolean;
}

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  googleUser: GoogleSessionUser | null;
  isLoading: boolean;
  supabaseReady: boolean;
  isGuestMode: boolean;
  isAuthModalOpen: boolean;
  authRedirectError: string | null;
  clearAuthRedirectError: () => void;
  enabledProviders: SocialProviderStatus | null;
  syncStatus: CloudSyncStatus;
  setSyncStatus: React.Dispatch<React.SetStateAction<CloudSyncStatus>>;
  lastSyncedAt: string | null;
  setLastSyncedAt: React.Dispatch<React.SetStateAction<string | null>>;
  driveAccount: GoogleDriveAccount;
  driveError: string | null;
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signUpWithEmail: (params: {
    email: string;
    password: string;
    fullName: string;
    institution?: string;
  }) => Promise<{ error: string | null; needsConfirmation?: boolean }>;
  signInWithSocial: (provider: SocialProviderId, includeDriveScope?: boolean) => Promise<{ error: string | null }>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  enterGuestMode: () => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  connectGoogleDrive: () => Promise<GoogleDriveAccount>;
  disconnectGoogleDrive: () => Promise<void>;
  getValidDriveAccessToken: () => Promise<string>;
  refreshAuthClient: () => void;
}

const LS_GUEST_MODE = 'medden_guest_mode';

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [googleUser, setGoogleUser] = useState<GoogleSessionUser | null>(() => readStoredGoogleUser());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [supabaseReady, setSupabaseReady] = useState<boolean>(() => isSupabaseConfigured());
  const [isGuestMode, setIsGuestMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(LS_GUEST_MODE) === 'true';
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authRedirectError, setAuthRedirectError] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const hashStr = window.location.hash.startsWith('#')
        ? window.location.hash.slice(1)
        : window.location.hash;
      const hashParams = new URLSearchParams(hashStr);
      const err =
        searchParams.get('error_description') ||
        hashParams.get('error_description') ||
        searchParams.get('error') ||
        hashParams.get('error');
      if (err) {
        window.history.replaceState({}, document.title, window.location.pathname);
        return decodeURIComponent(err.replace(/\+/g, ' '));
      }
    } catch {}
    return null;
  });
  const [enabledProviders, setEnabledProviders] = useState<SocialProviderStatus | null>(null);
  const enabledProvidersRef = useRef<SocialProviderStatus | null>(null);
  const [syncStatus, setSyncStatus] = useState<CloudSyncStatus>('local-only');
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [driveAccount, setDriveAccount] = useState<GoogleDriveAccount>({ connected: false });
  const [driveError, setDriveError] = useState<string | null>(null);
  const [clientRevision, setClientRevision] = useState<number>(0);

  const activeUserKey = user?.id || 'local';

  // Prefetch GIS & Google Client ID on mount so "Continue with Google" opens popup synchronously without blocker issues
  useEffect(() => {
    void prefetchGoogleOAuth();
  }, []);

  const fetchEnabledProviders = useCallback(async (): Promise<SocialProviderStatus | null> => {
    const cfg = getSupabaseConfig();
    if (!cfg.url || !cfg.anonKey) {
      enabledProvidersRef.current = null;
      setEnabledProviders(null);
      return null;
    }
    try {
      const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
      const timer = ctrl ? window.setTimeout(() => ctrl.abort(), 3000) : null;
      const resp = await fetch(`${cfg.url.replace(/\/+$/, '')}/auth/v1/settings`, {
        headers: { apikey: cfg.anonKey },
        signal: ctrl?.signal,
      });
      if (timer) window.clearTimeout(timer);
      if (resp.ok) {
        const data = await resp.json();
        const ext = (data?.external || {}) as SocialProviderStatus;
        enabledProvidersRef.current = ext;
        setEnabledProviders(ext);
        return ext;
      }
    } catch {
      // Offline or blocked; leave cached value null so fallback logic handles it cleanly
    }
    return enabledProvidersRef.current;
  }, []);

  useEffect(() => {
    void fetchEnabledProviders();
  }, [clientRevision, fetchEnabledProviders]);

  // Restore any valid personal Google Drive OAuth token stored for this user
  const syncDriveStateFromStorage = useCallback((uid: string) => {
    const rec = readStoredDriveSession(uid);
    setDriveAccount(toDriveAccountStatus(rec));
  }, []);

  useEffect(() => {
    syncDriveStateFromStorage(activeUserKey);
  }, [activeUserKey, syncDriveStateFromStorage]);

  useEffect(() => {
    const ready = isSupabaseConfigured();
    setSupabaseReady(ready);
    const supabase = getSupabaseClient();

    if (!supabase) {
      setSession(null);
      setUser(null);
      setSyncStatus('local-only');
      setIsLoading(false);
      return;
    }

    let mounted = true;
    setIsLoading(true);

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!mounted) return;
        const sess = data.session ?? null;
        setSession(sess);
        setUser(sess?.user ?? null);
        if (sess?.user) {
          setIsGuestMode(false);
          localStorage.removeItem(LS_GUEST_MODE);
          setSyncStatus('connecting');
          if (sess.provider_token && sess.user.app_metadata?.provider === 'google') {
            seedDriveTokenFromProvider(sess.user.id, sess.provider_token, sess.user.email)
              .then((rec) => {
                if (mounted) setDriveAccount(toDriveAccountStatus(rec));
              })
              .catch(() => {
                // Google SSO may have been signed in without drive.file scope — safe to ignore
              });
          }
        } else {
          setSyncStatus('local-only');
        }
        setIsLoading(false);
      })
      .catch(() => {
        if (mounted) setIsLoading(false);
      });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return;
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      if (nextSession?.user) {
        setIsGuestMode(false);
        localStorage.removeItem(LS_GUEST_MODE);
        setIsAuthModalOpen(false);
        setSyncStatus('connecting');
        if (nextSession.provider_token && nextSession.user.app_metadata?.provider === 'google') {
          seedDriveTokenFromProvider(
            nextSession.user.id,
            nextSession.provider_token,
            nextSession.user.email
          )
            .then((rec) => {
              if (mounted) setDriveAccount(toDriveAccountStatus(rec));
            })
            .catch(() => {});
        }
      } else {
        setSyncStatus('local-only');
      }
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [clientRevision]);

  const signInWithEmail = async (email: string, password: string) => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return { error: 'Supabase environment variables are not configured yet.' };
    }
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) return { error: error.message };
    setIsGuestMode(false);
    localStorage.removeItem(LS_GUEST_MODE);
    setIsAuthModalOpen(false);
    return { error: null };
  };

  const signUpWithEmail = async ({
    email,
    password,
    fullName,
    institution,
  }: {
    email: string;
    password: string;
    fullName: string;
    institution?: string;
  }) => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return { error: 'Supabase environment variables are not configured yet.' };
    }
    const redirectTo = typeof window !== 'undefined' ? window.location.origin : undefined;
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: redirectTo,
        data: {
          full_name: fullName.trim(),
          institution: institution?.trim() || 'Academic Medical Center',
        },
      },
    });
    if (error) return { error: error.message };
    const needsConfirmation = !data.session;
    if (!needsConfirmation) {
      setIsGuestMode(false);
      localStorage.removeItem(LS_GUEST_MODE);
      setIsAuthModalOpen(false);
    }
    return { error: null, needsConfirmation };
  };

  useEffect(() => {
    // If this window was opened as an OAuth popup and returned with a Supabase session, close cleanly after syncing storage
    if (typeof window === 'undefined' || !window.opener) return;
    const hasSession = Boolean(session?.user);
    if (hasSession) {
      try {
        window.opener.postMessage({ type: 'ach1ev-oauth-complete' }, window.location.origin);
      } catch {}
      window.close();
    }
  }, [session]);

  const signInWithSocial = async (provider: SocialProviderId, includeDriveScope = true) => {
    setAuthRedirectError(null);
    const supabase = getSupabaseClient();
    const cachedProviders = enabledProvidersRef.current;

    // For Google: when Supabase Google provider is not explicitly enabled (default), invoke GIS
    // immediately without awaiting a network settings call so the user click gesture stays synchronous!
    if (provider === 'google' && (!supabase || !cachedProviders || cachedProviders.google !== true)) {
      if (supabase && !cachedProviders) {
        void fetchEnabledProviders();
      }
      try {
        const res = await signInWithGoogleIdentity(activeUserKey, includeDriveScope);
        setGoogleUser(res.profile);
        if (res.driveAccount.connected) {
          setDriveAccount(res.driveAccount);
        }
        setIsGuestMode(false);
        localStorage.removeItem(LS_GUEST_MODE);
        setIsAuthModalOpen(false);
        return { error: null };
      } catch (err: any) {
        return { error: err?.message || 'Could not complete Google sign-in.' };
      }
    }

    const providers = cachedProviders ?? (supabase ? await fetchEnabledProviders() : null);

    if (provider === 'google') {
      if (supabase && providers?.google === true) {
        const redirectTo = typeof window !== 'undefined' ? window.location.origin : undefined;
        const inIframe = typeof window !== 'undefined' && window.self !== window.top;
        const options: any = {
          redirectTo,
          skipBrowserRedirect: inIframe,
          queryParams: includeDriveScope
            ? { access_type: 'offline', prompt: 'select_account consent' }
            : { prompt: 'select_account' },
        };
        if (includeDriveScope) {
          options.scopes = 'https://www.googleapis.com/auth/drive.file';
        }
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options,
        });
        if (error) return { error: error.message };
        if (inIframe && data?.url && typeof window !== 'undefined') {
          const popup = window.open(data.url, 'ach1ev_oauth_popup', 'width=520,height=640,scrollbars=yes');
          if (!popup) {
            return {
              error: `Popup was blocked inside preview iframe for ${window.location.origin}. Allow popups or open the live site directly.`,
            };
          }
          const onMsg = (ev: MessageEvent) => {
            if (ev.origin === window.location.origin && ev.data?.type === 'ach1ev-oauth-complete') {
              window.removeEventListener('message', onMsg);
              void supabase.auth.getSession().then(({ data: sData }) => {
                if (sData.session) {
                  setSession(sData.session);
                  setUser(sData.session.user);
                  setIsGuestMode(false);
                  localStorage.removeItem(LS_GUEST_MODE);
                  setIsAuthModalOpen(false);
                }
              });
            }
          };
          window.addEventListener('message', onMsg);
        }
        return { error: null };
      }
    }

    if (!supabase) {
      return { error: 'Supabase environment variables are not configured yet.' };
    }

    if (providers && providers[provider] === false) {
      const label = provider === 'apple' ? 'Apple' : 'Microsoft';
      return {
        error: `${label} Sign-In is not enabled in Supabase Authentication Providers yet. Please use Continue with Google or Email & Password below.`,
      };
    }

    const redirectTo = typeof window !== 'undefined' ? window.location.origin : undefined;
    const inIframe = typeof window !== 'undefined' && window.self !== window.top;
    const options: any = { redirectTo, skipBrowserRedirect: inIframe };
    if (provider === 'azure') {
      options.scopes = 'email profile openid';
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options,
    });
    if (error) return { error: error.message };
    if (inIframe && data?.url && typeof window !== 'undefined') {
      const popup = window.open(data.url, 'ach1ev_oauth_popup', 'width=520,height=640,scrollbars=yes');
      if (!popup) {
        return { error: 'Popup was blocked inside preview iframe. Allow popups for this site and try again.' };
      }
    }
    return { error: null };
  };

  const resetPassword = async (email: string) => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return { error: 'Supabase is not configured yet.' };
    }
    const redirectTo = typeof window !== 'undefined' ? window.location.origin : undefined;
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo });
    return { error: error ? error.message : null };
  };

  const signOut = async () => {
    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setSession(null);
    setUser(null);
    setGoogleUser(null);
    writeStoredGoogleUser(null);
    setIsGuestMode(false);
    localStorage.removeItem(LS_GUEST_MODE);
    setSyncStatus('local-only');
    setIsAuthModalOpen(true);
  };

  const enterGuestMode = () => {
    setIsGuestMode(true);
    localStorage.setItem(LS_GUEST_MODE, 'true');
    setIsAuthModalOpen(false);
  };

  const connectGoogleDrive = async () => {
    setDriveError(null);
    try {
      const rec = await connectPersonalGoogleDrive(activeUserKey);
      const acct = toDriveAccountStatus(rec);
      setDriveAccount(acct);
      return acct;
    } catch (err: any) {
      const msg = err?.message || 'Failed to connect personal Google Drive.';
      setDriveError(msg);
      throw new Error(msg);
    }
  };

  const disconnectGoogleDrive = async () => {
    await disconnectPersonalGoogleDrive(activeUserKey);
    setDriveAccount({ connected: false });
    setDriveError(null);
  };

  const getValidDriveAccessToken = async (): Promise<string> => {
    const existing = readStoredDriveSession(activeUserKey);
    if (existing?.accessToken && (!existing.expiresAt || existing.expiresAt > Date.now() + 30_000)) {
      return existing.accessToken;
    }
    const fresh = await connectPersonalGoogleDrive(activeUserKey);
    setDriveAccount(toDriveAccountStatus(fresh));
    return fresh.accessToken;
  };

  const refreshAuthClient = () => {
    setClientRevision((r) => r + 1);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        googleUser,
        isLoading,
        supabaseReady,
        isGuestMode,
        isAuthModalOpen,
        authRedirectError,
        clearAuthRedirectError: () => setAuthRedirectError(null),
        enabledProviders,
        syncStatus,
        setSyncStatus,
        lastSyncedAt,
        setLastSyncedAt,
        driveAccount,
        driveError,
        signInWithEmail,
        signUpWithEmail,
        signInWithSocial,
        resetPassword,
        signOut,
        enterGuestMode,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
        connectGoogleDrive,
        disconnectGoogleDrive,
        getValidDriveAccessToken,
        refreshAuthClient,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>.');
  }
  return ctx;
}
