/* Cộng đồng EFCARE · service worker: mở được khi mất mạng. Không chặn lời gọi máy chủ (POST sang máy chủ Cloudflare). */
const BAN = 'efc-v3.5';
const VO = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png', './icon-mask-512.png', './cai-dat.html'];
self.addEventListener('install', e => { e.waitUntil(caches.open(BAN).then(c => c.addAll(VO)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== BAN).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin) return;
  if (r.mode === 'navigate') {
    e.respondWith(fetch(r).then(res => { const c = res.clone(); caches.open(BAN).then(x => x.put(r, c)); return res; }).catch(() => caches.match(r, { ignoreSearch: true }).then(h => h || caches.match('./index.html'))));
    return;
  }
  e.respondWith(caches.match(r).then(hit => hit || fetch(r).then(res => { const c = res.clone(); caches.open(BAN).then(x => x.put(r, c)); return res; })));
});
