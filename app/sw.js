const SLOW_TIME = 3000;

addEventListener('install', function() {
  console.log('Installed service worker');
});

addEventListener('fetch', function(event) {
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
