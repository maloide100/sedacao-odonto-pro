self.addEventListener("install", event => {
    event.waitUntil(
        caches.open("cache").then(cache => {
            return cache.addAll([
                "/",
                "/index.html",
                "/app.js",
                "/manifest.json"
            ]);
        })
    );
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(r => r || fetch(event.request))
    );
});