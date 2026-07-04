self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (e) => {
  // Simple pass-through fetch handler to satisfy PWA criteria
  e.respondWith(fetch(e.request).catch(() => new Response('Offline')));
});
