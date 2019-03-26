var CACHE_NAME = 'iris-cache-v1';
var urlsToCache = [
  'index.html',
  'assets/scripts/app.js',
  'assets/scripts/vendor.js',
  'assets/js/ipfs.min.js',
  'assets/images/cover.jpg',
  'assets/fonts/Lato-900/Lato-900.woff2',
  'assets/fonts/Lato-700/Lato-700.woff2',
  'assets/fonts/Lato-300/Lato-300.woff2',
  'assets/fonts/Lato-regular/Lato-regular.woff2',
  'fonts/fontawesome-webfont.woff2?v=4.7.0',
  'fonts/glyphicons-halflings-regular.woff2',
  'assets/images/favicon.ico'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }

        return fetch(event.request).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});
