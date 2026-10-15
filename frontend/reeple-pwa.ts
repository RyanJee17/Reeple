import { createHash } from 'node:crypto';
import type { Plugin } from 'vite';

// No external PWA service or runtime dependency. Precache the built local app.
export function reeplePwa(): Plugin {
  return {
    name: 'reeple-pwa', apply: 'build',
    generateBundle(_options, bundle) {
      const paths = Object.keys(bundle).filter(path => !path.endsWith('.map'));
      const digest = createHash('sha256');
      for (const name of paths.sort()) { const item = bundle[name]; digest.update(name); digest.update(item.type === 'chunk' ? item.code : item.source); }
      const version = digest.digest('hex').slice(0, 14);
      const urls = [...new Set(['/', '/index.html', '/manifest.webmanifest', '/icon-192.png', '/icon-512.png', ...paths.map(p => '/' + p)])];
      this.emitFile({ type: 'asset', fileName: 'sw.js', source: `
const CACHE = 'reeple-app-${version}';
const FILES = ${JSON.stringify(urls)};
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES))));
self.addEventListener('message', event => { if (event.data === 'ACTIVATE_UPDATE') self.skipWaiting(); });
self.addEventListener('activate', event => event.waitUntil(Promise.all([caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('reeple-app-') && k !== CACHE).map(k => caches.delete(k)))), self.clients.claim()])));
self.addEventListener('fetch', event => {
  const request = event.request, url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin || url.pathname.startsWith('/api/') || url.pathname === '/api') return;
  if (request.mode === 'navigate') {
    event.respondWith(caches.open(CACHE).then(cache => cache.match('/index.html')).then(cached => cached || fetch(request)));
  } else if (FILES.includes(url.pathname)) {
    event.respondWith(caches.open(CACHE).then(cache => cache.match(request)).then(cached => cached || fetch(request)));
  }
});` });
    },
  };
}
