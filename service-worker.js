// 캐시를 쌓지 않고 항상 최신 상태를 유지하면서 PWA 설치 조건만 만족시키는 서비스 워커
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
