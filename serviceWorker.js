console.log("0.0.97");

var VERSION = 'v3';

var cacheFirstFiles = [
  // ADDME: Add paths and URLs to pull from cache first if it has been loaded before. Else fetch from network.
  // If loading from cache, fetch from network in the background to update the resource. Examples:
  "/index.html",
  "/sketch.js",
  "/tip.html",
  "/cu.html",
  "/tippingpoint.js",
  "/changeup.js",
  "/p5.js",
  "/manifest.json",
  "/gear.png",
  "/NEXT%20ART_Regular.otf",
  "/NEXT%20ART_SemiBold.otf",
  "/NEXT%20ART_Bold.otf",
  "https://vexscoring.app/tip.html"
];

var networkFirstFiles = [
  // ADDME: Add paths and URLs to pull from network first. Else fall back to cache if offline. Examples:
  // 'index.html',
  // 'build/build.js',
  // 'css/index.css'
];

// Below is the service worker code.

var cacheFiles = cacheFirstFiles.concat(networkFirstFiles);

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(VERSION).then(cache => {
      return cache.addAll(cacheFiles);
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim());
});

// self.addEventListener("fetch", function (event) {
//   event.respondWith(
//     caches.match(event.request).then(function (response) {
//       if (response) {
//         return response;
//       }
//       return fetch(event.request);
//     })
//   );
// });

self.addEventListener('fetch', event => {

  console.log("event : ", event);
  
  if (event.request.method !== 'GET') { return; }
  if (networkFirstFiles.indexOf(event.request.url) !== -1) {
    console.log("network first : ", event);
    event.respondWith(networkElseCache(event));
  } else if (cacheFirstFiles.indexOf(event.request.url) !== -1) {
    console.log("cache first : ", event);
    event.respondWith(cacheElseNetwork(event));
  } else {
    console.log("neither first ... ", event.request.url);
    event.respondWith(fetch(event.request));
  }
});




// If cache else network.
// For images and assets that are not critical to be fully up-to-date.
// developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/
// #cache-falling-back-to-network
function cacheElseNetwork (event) {
  return caches.match(event.request).then(response => {
    function fetchAndCache () {
       return fetch(event.request).then(response => {
        // Update cache.
        caches.open(VERSION).then(cache => cache.put(event.request, response.clone()));
        return response;
      });
    }

    // If not exist in cache, fetch.
    if (!response) { return fetchAndCache(); }

    // If exists in cache, return from cache while updating cache in background.
    fetchAndCache();
    return response;
  });
}

// If network else cache.
// For assets we prefer to be up-to-date (i.e., JavaScript file).
function networkElseCache (event) {
  return caches.match(event.request).then(match => {
    if (!match) { return fetch(event.request); }
    return fetch(event.request).then(response => {
      // Update cache.
      console.log("fetch");
      caches.open(VERSION).then(cache => cache.put(event.request, response.clone()));
      return response;
    }) || response;
  });
}

/*
const staticScoringApp = "vex-scoring-app-v1"
const assets = [
  "/",
  "/index.html",
  "/sketch.js",
  "/gear.png",
  "/NEXT%20ART_Regular.otf",
  "/NEXT%20ART_SemiBold.otf",
  "/NEXT%20ART_Bold.otf"
]

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticScoringApp).then(cache => {
      cache.addAll(assets)
    })
  )
})

self.addEventListener("fetch", fetchEvent => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then(res => {
      return res || fetch(fetchEvent.request)
    })
  )
})
*/
/*
var CACHE = 'cache-update-and-refresh';

// On install, cache some resource.
self.addEventListener('install', function (evt) {
    console.log('The service worker is being installed.');
    // Open a cache and use `addAll()` with an array of assets to add all of them
    // to the cache. Ask the service worker to keep installing until the
    // returning promise resolves.
    evt.waitUntil(caches.open(CACHE).then(function (cache) {
        cache.addAll([
            "/index.html",
            "/sketch.js",
            "/p5.js",
            "/manifest.json",
            "/gear.png",
            "/NEXT%20ART_Regular.otf",
            "/NEXT%20ART_SemiBold.otf",
            "/NEXT%20ART_Bold.otf"
        ]);
    }));
});

// On fetch, use cache but update the entry with the latest contents
// from the server.
self.addEventListener('fetch', function (evt) {
    console.log('The service worker is serving the asset.');
    // You can use `respondWith()` to answer ASAP...
    evt.respondWith(fromCache(evt.request));
    // ...and `waitUntil()` to prevent the worker to be killed until
    // the cache is updated.
    evt.waitUntil(
        update(evt.request)
            // Finally, send a message to the client to inform it about the
            // resource is up to date.
            .then(refresh)
    );
});

// Open the cache where the assets were stored and search for the requested
// resource. Notice that in case of no matching, the promise still resolves
// but it does with `undefined` as value.
function fromCache(request) {
    return caches.open(CACHE).then(function (cache) {
        return cache.match(request);
    });
}


// Update consists in opening the cache, performing a network request and
// storing the new response data.
function update(request) {
    return caches.open(CACHE).then(function (cache) {
        return fetch(request).then(function (response) {
            return cache.put(request, response.clone()).then(function () {
                return response;
            });
        });
    });
}

// Sends a message to the clients.
function refresh(response) {
    return self.clients.matchAll().then(function (clients) {
        clients.forEach(function (client) {
            // Encode which resource has been updated. By including the
            // [ETag](https://en.wikipedia.org/wiki/HTTP_ETag) the client can
            // check if the content has changed.
            var message = {
                type: 'refresh',
                url: response.url,
                // Notice not all servers return the ETag header. If this is not
                // provided you should use other cache headers or rely on your own
                // means to check if the content has changed.
                eTag: response.headers.get('ETag')
            };
            // Tell the client about the update.
            client.postMessage(JSON.stringify(message));
        });
    });
}
*/


