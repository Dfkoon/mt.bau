import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { clientsClaim } from 'workbox-core';
import { NavigationRoute, registerRoute } from 'workbox-routing';
import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';

self.skipWaiting();
clientsClaim();
cleanupOutdatedCaches();

// Precache all built assets (JS, CSS, HTML, fonts, icons)
precacheAndRoute(self.__WB_MANIFEST || []);

// ── Runtime Caching ──────────────────────────────────────────

// 1. Google Fonts — cache-first (rarely changes)
registerRoute(
    ({ url }) => url.origin === 'https://fonts.googleapis.com' ||
                 url.origin === 'https://fonts.gstatic.com',
    new CacheFirst({
        cacheName: 'google-fonts',
        plugins: [
            new CacheableResponsePlugin({ statuses: [0, 200] }),
            new ExpirationPlugin({ maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 })
        ]
    })
);

// 2. Firebase Firestore & API calls — network-first, fall back to cache
registerRoute(
    ({ url }) => url.hostname.includes('firestore.googleapis.com') ||
                 url.hostname.includes('firebase.googleapis.com'),
    new NetworkFirst({
        cacheName: 'firebase-api',
        networkTimeoutSeconds: 8,
        plugins: [
            new CacheableResponsePlugin({ statuses: [0, 200] }),
            new ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 })
        ]
    })
);

// 3. Images — stale-while-revalidate
registerRoute(
    ({ request }) => request.destination === 'image',
    new StaleWhileRevalidate({
        cacheName: 'images',
        plugins: [
            new CacheableResponsePlugin({ statuses: [0, 200] }),
            new ExpirationPlugin({ maxEntries: 80, maxAgeSeconds: 60 * 60 * 24 * 30 })
        ]
    })
);

// ── Offline fallback for navigation requests ─────────────────
// When user navigates and is offline, show the cached offline page.
const OFFLINE_URL = `${self.location.pathname.replace(/sw\.js.*$/, '')}offline.html`.replace('//', '/');

// Listen for fetch events — if navigation fails, serve offline page
self.addEventListener('fetch', (event) => {
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request).catch(() => {
                // Try to return cached offline page
                return caches.match('/mt.bau/offline.html')
                    || caches.match('/mt.bau/index.html')
                    || new Response(
                        `<!DOCTYPE html><html dir="rtl" lang="ar">
                        <head><meta charset="UTF-8"><title>غير متصل</title>
                        <meta name="viewport" content="width=device-width,initial-scale=1">
                        <style>
                            *{margin:0;padding:0;box-sizing:border-box}
                            body{min-height:100vh;display:grid;place-items:center;
                                 background:#020b18;color:#f1f5f9;
                                 font-family:'Segoe UI',sans-serif;text-align:center;padding:24px}
                            h1{font-size:28px;margin-bottom:12px;color:#fbbf24}
                            p{color:#94a3b8;line-height:1.7;margin-bottom:24px}
                            button{padding:12px 28px;background:#fbbf24;color:#1a1a2e;
                                   border:none;border-radius:50px;font-size:15px;
                                   font-weight:700;cursor:pointer}
                        </style></head>
                        <body>
                            <div>
                                <div style="font-size:64px;margin-bottom:16px">📡</div>
                                <h1>لا يوجد اتصال</h1>
                                <p>انقطع الاتصال بالإنترنت.<br>تحقق من شبكتك وحاول مجدداً.</p>
                                <button onclick="location.reload()">🔄 إعادة المحاولة</button>
                            </div>
                        </body></html>`,
                        { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
                    );
            })
        );
    }
});
