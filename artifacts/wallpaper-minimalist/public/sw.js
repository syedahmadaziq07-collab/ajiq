const CACHE_NAME = "wallp-images-v1";
const SUPABASE_CDN = "dwovtevztmolttpohvym.supabase.co/storage";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (!event.request.url.includes(SUPABASE_CDN) || event.request.destination !== "image") return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetchAndCache = fetch(event.request).then((res) => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return res;
      });

      if (cached) {
        event.waitUntil(
          fetchAndCache.catch(() => {})
        );
        return cached;
      }

      return fetchAndCache.catch(() => new Response("", { status: 503 }));
    })
  );
});
