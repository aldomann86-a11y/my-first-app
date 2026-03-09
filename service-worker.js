/* ===================================================
   Hofhelfer KI – Service Worker
   Cache-first Strategie für Offline-Unterstützung
   =================================================== */

const CACHE_NAME = 'hofhelfer-v1';

// Alle App-Dateien, die beim Installieren gecacht werden
const PRECACHE_FILES = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json',
  './icon-192.svg',
  './icon-512.svg',
];

/* ---- Install: Dateien precachen ---- */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Precaching App-Dateien');
      return cache.addAll(PRECACHE_FILES);
    })
  );
  // Sofort aktivieren, ohne auf Tab-Schliessen zu warten
  self.skipWaiting();
});

/* ---- Activate: Alte Caches löschen ---- */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => {
            console.log('[SW] Alter Cache gelöscht:', key);
            return caches.delete(key);
          })
      )
    )
  );
  // Sofort alle Clients übernehmen
  self.clients.claim();
});

/* ---- Fetch: Cache-first mit Network-Fallback ---- */
self.addEventListener('fetch', event => {
  // Nur GET-Anfragen abfangen
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        // Aus Cache liefern
        return cachedResponse;
      }
      // Netzwerk-Fallback
      return fetch(event.request).then(networkResponse => {
        // Neue Antwort auch im Cache speichern
        const responseClone = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return networkResponse;
      });
    })
  );
});
