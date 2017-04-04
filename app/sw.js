const SLOW_TIME = 3000;
const CACHE = `xke-vote::${Date.now()}`;

console.log('Files to cache :', global.serviceWorkerOption.assets);
const {
    assets,
} = global.serviceWorkerOption;

// install static assets
function installStaticFiles() {
  return caches.open(CACHE)
        .then((cache) =>
            // cache files
             cache.addAll(assets));
}

self.addEventListener('install', (event) => {
  console.log('[SW] Installed service worker');

    // cache core files
  event.waitUntil(
        installStaticFiles()
            .then(() => self.skipWaiting())
    );
});

// clear old caches
function clearOldCaches() {
  return caches.keys()
        .then((keylist) => Promise.all(
                keylist
                    .filter((key) => key !== CACHE)
                    .map((key) => caches.delete(key))
            ));
}

// After the install event.
self.addEventListener('activate', (event) => {
  console.log('[SW] Activate event');

    // delete old caches
  event.waitUntil(
        clearOldCaches()
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  if (url.indexOf('blocking') === -1) {
    return;
  }

  const promise = Promise.race([
    new Promise((resolve, reject) => setTimeout(
      () => reject(new Response('Request killed!')),
      SLOW_TIME
    )),
    fetch(event.request),
  ]);

  event.respondWith(promise);
});
