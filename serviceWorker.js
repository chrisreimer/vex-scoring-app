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

