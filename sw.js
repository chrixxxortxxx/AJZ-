// Offline fallback for the AJZ digital card.
// Pages: network first (so updates show immediately), cached copy when offline.
// Static assets: cache first.
const CACHE = 'ajz-card-v6';
const CORE = [
  './',
  'index.html',
  'manifest.webmanifest',
  'images/logo-ajz.png',
  'images/logo-ajz-wide.png',
  'images/work/01.jpg',
  'icons/favicon-32.png',
  'icons/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  // Live data (Google reviews) always goes to the network; never serve it from cache.
  if (new URL(req.url).pathname.startsWith('/api/')) return;

  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put('./', copy));
          return res;
        })
        .catch(() => caches.match('./').then((r) => r || caches.match('index.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        // Cache successful same-origin files and the QR library.
        const ok = res && res.ok && (new URL(req.url).origin === location.origin || req.url.includes('cdnjs.cloudflare.com'));
        if (ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      });
    })
  );
});
