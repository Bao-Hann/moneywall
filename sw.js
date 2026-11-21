const CACHE = 'vung-tai-chinh-v3-excel-opening';
const STATIC = ['./', './index.html', './css/styles.css', './js/app.js', './js/ui.js', './js/db.js', './js/finance-engine.js', './js/charts.js', './js/seed-data.js', './js/excel-import.js', './js/excel-ui.js', './vendor/xlsx.full.min.js', './manifest.webmanifest', './icon.svg'];
const CHART_URL = 'https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js';
self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(STATIC);
    try { const response = await fetch(CHART_URL, { mode: 'cors' }); if (response.ok) await cache.put(CHART_URL, response); } catch { /* The application still works without charts. */ }
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => { for (const name of await caches.keys()) if (name.startsWith('vung-tai-chinh-') && name !== CACHE) await caches.delete(name); await self.clients.claim(); })());
});
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin && event.request.url !== CHART_URL) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    if (event.request.url === CHART_URL) {
      const saved = await cache.match(event.request);
      if (saved) return saved;
      try { const response = await fetch(event.request); if (response.ok) await cache.put(event.request, response.clone()); return response; } catch { return Response.error(); }
    }
    try {
      const response = await fetch(event.request);
      if (response.ok) await cache.put(event.request, response.clone());
      return response;
    } catch {
      return await cache.match(event.request) || (event.request.mode === 'navigate' ? await cache.match('./index.html') : null) || new Response('Tài nguyên chưa có khi ngoại tuyến.', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
    }
  })());
});
