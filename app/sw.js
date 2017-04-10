const CACHE = `xke-vote::${Date.now()}`;
const logger = console;

logger.log('Files to cache :', global.serviceWorkerOption.assets);
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
  logger.log('[SW] Installed service worker');

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
  logger.log('[SW] Activate event');

  // delete old caches
  event.waitUntil(
    clearOldCaches()
      .then(() => self.clients.claim())
  );
});

self.addEventListener('update', (event) => {
  logger.log('[SW] Update event');
});

// application fetch network data
self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  if (url.includes('api/')) {
    event.respondWith(
            caches.open(CACHE)
                .then((cache) => cache.match(event.request)
                    .then((response) =>
                        // make network request
                         fetch(event.request)
                            .then((newreq) => {
                              logger.log(`network fetch: ${url}`);
                              if (newreq.ok) cache.put(event.request, newreq.clone());
                              return newreq;
                            }).catch(() => response)))
        );
  } else {
    event.respondWith(
            caches.open(CACHE)
                .then((cache) => cache.match(event.request)
                    .then((response) => {
                      if (response) {
                            // return cached file
                        logger.log(`cache fetch: ${url}`);
                        return response;
                      }

                      // make network request
                      return fetch(event.request)
                            .then((newreq) => {
                              logger.log(`network fetch: ${url}`);
                              if (newreq.ok) cache.put(event.request, newreq.clone());
                              return newreq;
                            }).catch(() => {
                                // User is landing on our page.
                              if (event.request.mode === 'navigate') {
                                return global.caches.match('./');
                              }

                              return null;
                            });
                    }))
        );
  }
});

/*
 * Notifications
 */

self.addEventListener('push', event => {
  logger.log('[Service Worker] Push Received.');
  logger.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

  try {
    // logger.log(event.data.json());
    const data = event.data.text();
    const title = 'Vote XKE';
    const options = {
      body: data,
      icon: 'icon-192x192.png',
      badge: 'static/icon-72x72.png',
    };
    event.waitUntil(self.registration.showNotification(title, options));
  } catch (err) {
    const title = 'Vote XKE';
    const options = {
      body: event.data.text(),
      icon: 'icon-192x192.png',
      badge: 'icon-72x72.png',
    };
    event.waitUntil(self.registration.showNotification(title, options));
  }
});

self.addEventListener('notificationclick', event => {
  logger.log('[Service Worker] Notification click Received.');
  event.notification.close();
  event.waitUntil(clients.openWindow('https://xke-vote-pwa.aws.xebiatechevent.info'));
});

