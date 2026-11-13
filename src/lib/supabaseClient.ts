import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface SupabaseRuntimeConfig {
  url: string;
  anonKey: string;
  source: 'env' | 'local' | 'none';
}

const LS_SUPABASE_URL = 'medden_supabase_url';
const LS_SUPABASE_KEY = 'medden_supabase_anon_key';

export function getSupabaseConfig(): SupabaseRuntimeConfig {
  const envUrl = (import.meta.env?.VITE_SUPABASE_URL as string | undefined)?.trim() || '';
  const envKey = (import.meta.env?.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim() || '';

  if (envUrl && envKey && !envUrl.includes('YOUR_SUPABASE')) {
    return { url: envUrl, anonKey: envKey, source: 'env' };
  }

  if (typeof window !== 'undefined') {
    const localUrl = localStorage.getItem(LS_SUPABASE_URL)?.trim() || '';
    const localKey = localStorage.getItem(LS_SUPABASE_KEY)?.trim() || '';
    if (localUrl && localKey) {
      return { url: localUrl, anonKey: localKey, source: 'local' };
    }
  }

  return { url: '', anonKey: '', source: 'none' };
}

let cachedClient: SupabaseClient | null = null;
let cachedSignature = '';

export function isSupabaseConfigured(): boolean {
  const cfg = getSupabaseConfig();
  return Boolean(cfg.url && cfg.anonKey);
}

export function getSupabaseClient(): SupabaseClient | null {
  const cfg = getSupabaseConfig();
  if (!cfg.url || !cfg.anonKey) {
    return null;
  }

  const sig = `${cfg.url}|${cfg.anonKey}`;
  if (cachedClient && cachedSignature === sig) {
    return cachedClient;
  }

  cachedClient = createClient(cfg.url, cfg.anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'medden-supabase-auth',
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  });
  cachedSignature = sig;
  return cachedClient;
}

export function saveRuntimeSupabaseConfig(url: string, anonKey: string): void {
  if (typeof window === 'undefined') return;
  if (url.trim() && anonKey.trim()) {
    localStorage.setItem(LS_SUPABASE_URL, url.trim());
    localStorage.setItem(LS_SUPABASE_KEY, anonKey.trim());
  } else {
    localStorage.removeItem(LS_SUPABASE_URL);
    localStorage.removeItem(LS_SUPABASE_KEY);
  }
  cachedClient = null;
  cachedSignature = '';
}
