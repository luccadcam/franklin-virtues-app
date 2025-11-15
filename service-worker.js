const CACHE_NAME = 'franklin-cache-v1';
const OFFLINE_URL = 'index.html';
const assetsToCache = [
  './',
  './index.html',
  './franklin_logo.png',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(assetsToCache);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Online-first for navigation, cache-first for other assets
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(OFFLINE_URL))
    );
    return;
  }
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request).then(r=>{
      return caches.open(CACHE_NAME).then(cache=>{ cache.put(event.request, r.clone()); return r;});
    }))
  );
});
