// Sürüm v3: Tarayıcının eski index.html kopyasını zorla silip yenisini almasını sağlar
const CACHE_NAME = 'bvg-radar-v3';

self.addEventListener('install', (event) => {
  self.skipWaiting(); // Yeni sürümü beklemeden anında devreye al
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        './',
        './index.html',
        './manifest.json'
      ]).catch(err => console.log("Önbellek uyarısı:", err));
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        // v3 dışındaki tüm eski önbellekleri hafızadan sil
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Önce internete sor (Network First), internet yoksa önbellekten aç
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
