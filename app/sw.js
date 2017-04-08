const CACHE = `xke-vote::${Date.now()}`;
const logger = console;

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

self.addEventListener('update', (event) => {
  console.log('[SW] Update event');
});

// application fetch network data
self.addEventListener('fetch', (event) => {
  // abandon non-GET requests

  const url = event.request.url;

    if (url.includes('api/')) {
        event.respondWith(
            caches.open(CACHE)
                .then((cache) => cache.match(event.request)
                    .then((response) =>
                        // make network request
                         fetch(event.request)
                            .then((newreq) => {
                                console.log(`network fetch: ${url}`);
                                if (newreq.ok) cache.put(event.request, newreq.clone());
                                return newreq;
                            }).catch(() =>  response)))
        );
    } else {
        event.respondWith(
            caches.open(CACHE)
                .then((cache) => cache.match(event.request)
                    .then((response) => {
                        if (response) {
                            // return cached file
                            console.log(`cache fetch: ${url}`);
                            return response;
                        }

                        // make network request
                      return fetch(event.request)
                            .then((newreq) => {
                              console.log(`network fetch: ${url}`);
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
      // icon: 'images/icon.png',
      // icon: require('assets/notification.png'),
      icon: '',
      // badge: 'images/badge.png',
    };
    event.waitUntil(self.registration.showNotification(title, options));
  } catch (err) {
    const title = 'Vote XKE';
    const options = {
      body: event.data.text(),
      // icon: 'images/icon.png',
      // icon: require('assets/notification.png'),
      // badge: 'images/badge.png',
    };
    event.waitUntil(self.registration.showNotification(title, options));
  }
});

self.addEventListener('notificationclick', event => {
  logger.log('[Service Worker] Notification click Received.');
  event.notification.close();
  event.waitUntil(clients.openWindow('http://localhost:3000'));
});

