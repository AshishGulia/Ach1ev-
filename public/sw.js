const CACHE_NAME = 'ach1ev-app-shell-v4';
const STATIC_ASSETS = [
  '/manifest.webmanifest',
  '/assets/brand/achiev-logo.png?v=hd4',
  '/assets/brand/achiev-wordmark.png?v=hd4',
  '/assets/brand/achiev-emblem.png?v=hd4',
  '/assets/brand/achiev-icon-192.png',
  '/assets/brand/achiev-icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)).catch(() => undefined)
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  // Never cache cross-origin auth/cloud sync or /api endpoints
  if (url.origin !== self.location.origin || url.pathname.startsWith('/api/')) {
    return;
  }

  // Always bypass browser HTTP cache for HTML navigations so new deployments load immediately
  if (request.mode === 'navigate' || url.pathname === '/' || url.pathname.endsWith('.html')) {
    event.respondWith(
      fetch(new Request(request, { cache: 'no-store' }))
        .then((resp) => {
          if (resp && resp.ok) {
            const clone = resp.clone();
            caches.open(CACHE_NAME).then((c) => c.put(request, clone)).catch(() => {});
          }
          return resp;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match('/')))
    );
    return;
  }

  // Cache-first with background refresh for brand assets & static icons
  if (url.pathname.startsWith('/assets/brand/') || url.pathname.endsWith('/manifest.webmanifest')) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const fetched = fetch(request)
          .then((resp) => {
            if (resp && resp.ok) {
              const clone = resp.clone();
              caches.open(CACHE_NAME).then((c) => c.put(request, clone)).catch(() => {});
            }
            return resp;
          })
          .catch(() => cached);
        return cached || fetched;
      })
    );
  }
});
