const CACHE_N = 'pwa-cache-v001';

const cacheUrls = [
    "./",
    "./index.html",
    "./game.js",
    "./assets/lego.png",
    "./assets/items.png",
    "./assets/bomb.png",
    "./assets/map_tiles.png",
    "./assets/json_map.json",
    "https://cdn.jsdelivr.net/npm/phaser@3.88.2/dist/phaser.js"
];

self.addEventListener("install", (ev) => {
    self.skipWaiting();
    ev.waitUntil(
        caches.open(CACHE_N).then((cache) => {
            return cache.addAll(cacheUrls);
        })
    );
});

self.addEventListener("activate", (ev) => {
    ev.waitUntil(clients.claim());
    ev.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_N)
                    .map((name) => caches.delete(name))
            );
        })
    );
});

self.addEventListener("fetch", (e) => {
    e.respondWith(
        (async () => {
            const r = await caches.match(e.request);
            if (r) {
                return r;
            }
            const resp = await fetch(e.request);
            const cache = await caches.open(CACHE_N);
            cache.put(e.request, resp.clone());
            return resp;
        })()
    );
});
