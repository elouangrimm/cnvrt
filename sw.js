const CACHE_VERSION = 'cnvrt-v1';
const CDN_CACHE = 'cnvrt-cdn-v1';

const APP_SHELL = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/features.js',
    '/manifest.json'
];

const CDN_URLS = [
    'https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.11.0/dist/ffmpeg.min.js',
    'https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js',
    'https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.wasm',
    'https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.worker.js',
    'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.16.105/build/pdf.min.js',
    'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.16.105/build/pdf.worker.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.5.1/mammoth.browser.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js',
    'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js',
    'https://cdn.jsdelivr.net/npm/pako@2.1.0/dist/pako.min.js',
    'https://cdn.jsdelivr.net/npm/@gera2ld/tarjs@1.1.1/dist/tar.iife.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/heic2any/0.0.3/heic2any.min.js',
    'https://cdn.jsdelivr.net/npm/psd.js@3.2.0/dist/psd.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/opentype.js/1.3.4/opentype.min.js'
];

// Install — cache app shell
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_VERSION)
            .then(cache => cache.addAll(APP_SHELL))
            .catch(err => console.warn('SW install cache failed:', err))
    );
    self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(k => k !== CACHE_VERSION && k !== CDN_CACHE)
                    .map(k => caches.delete(k))
            )
        )
    );
    self.clients.claim();
});

// Fetch strategy
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Skip non-GET requests
    if (event.request.method !== 'GET') return;

    // CDN resources — cache first, network fallback
    if (url.origin !== self.location.origin) {
        event.respondWith(
            caches.match(event.request).then(cached => {
                if (cached) return cached;
                return fetch(event.request).then(response => {
                    if (response.ok) {
                        const clone = response.clone();
                        caches.open(CDN_CACHE).then(cache => cache.put(event.request, clone));
                    }
                    return response;
                });
            }).catch(() => caches.match(event.request))
        );
        return;
    }

    // App shell — network first, cache fallback (preserves COOP/COEP headers)
    event.respondWith(
        fetch(event.request).then(response => {
            if (response.ok) {
                const clone = response.clone();
                caches.open(CACHE_VERSION).then(cache => cache.put(event.request, clone));
            }
            return response;
        }).catch(() => caches.match(event.request))
    );
});

// Message handler for offline mode
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'ENABLE_OFFLINE') {
        event.waitUntil(
            caches.open(CDN_CACHE).then(cache =>
                Promise.allSettled(
                    CDN_URLS.map(url =>
                        cache.match(url).then(cached => {
                            if (!cached) return cache.add(url);
                        })
                    )
                )
            ).then(() => {
                // Notify all clients that caching is complete
                self.clients.matchAll().then(clients => {
                    clients.forEach(client => client.postMessage({ type: 'OFFLINE_READY' }));
                });
            })
        );
    }

    if (event.data && event.data.type === 'CACHE_STATUS') {
        caches.open(CDN_CACHE).then(cache =>
            cache.keys().then(keys => {
                event.source.postMessage({
                    type: 'CACHE_STATUS_RESULT',
                    cached: keys.length,
                    total: CDN_URLS.length
                });
            })
        );
    }
});
