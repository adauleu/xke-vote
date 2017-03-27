const SLOW_TIME = 3000;

// configuration
function getConfiguration () {
    return {
      version: Date.now(),
      CACHE: version + '::XKE-PWA',
      offlineURL: '/offline/',
      installFilesEssential: [
        '/',
        '/manifest.json',
        '/css/styles.css',
        // TODO cache app_<hash> and vendor_<hash>
        // '/js/main.js',
        // '/js/offlinepage.js',
        // '/images/logo/logo152.png'
      ].concat(offlineURL),
      installFilesDesirable: [
        '/favicon.ico',
        '/index.html'
      ]
    }
}

function installStaticFiles () {
    const CONF = getConfiguration();
    return caches.open(CONF.CACHE)
      .then(cache => {
          cache.addAll(CONF.installFilesEssential);
          cache.addAll(CONF.installFilesDesirable);
          
          return cache;
      })
}

self.addEventListener('install', function (event) {
    console.log('Installed service worker');
    event.waitUntil(
      installStaticFiles()
        .then( () => self.skipWaiting())
    )
});

self.addEventListener('fetch', function (event) {
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
