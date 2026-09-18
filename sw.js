const CACHE = "heic-converter-pwa-v1";

const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png"
];

const LIBS = [
  "https://cdn.jsdelivr.net/npm/heic-to@1.5.2/dist/iife/heic-to.js",
  "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"
];

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(APP_SHELL);

    // CDNが一時的に落ちていてもPWA本体のインストールは失敗させない。
    await Promise.allSettled(LIBS.map(async url => {
      const req = new Request(url, { mode: "cors", credentials: "omit" });
      const res = await fetch(req);
      if (!res.ok) throw new Error(`${url}: ${res.status}`);
      await cache.put(req, res.clone());
    }));

    await self.skipWaiting();
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;

  // 画面遷移はネット優先、失敗時にindex.htmlへフォールバック。
  if (req.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const res = await fetch(req);
        const cache = await caches.open(CACHE);
        cache.put("./index.html", res.clone()).catch(() => {});
        return res;
      } catch (_) {
        return (await caches.match("./index.html")) || Response.error();
      }
    })());
    return;
  }

  // ライブラリ・アイコン等はキャッシュ優先。
  event.respondWith((async () => {
    const cached = await caches.match(req);
    if (cached) return cached;

    try {
      const res = await fetch(req);
      if (res && res.ok) {
        const cache = await caches.open(CACHE);
        cache.put(req, res.clone()).catch(() => {});
      }
      return res;
    } catch (_) {
      return Response.error();
    }
  })());
});

self.addEventListener("message", event => {
  if (!event.data || event.data.type !== "CHECK_LIB_CACHE") return;

  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    const matches = await Promise.all(LIBS.map(url => cache.match(url)));
    const ok = matches.every(Boolean);

    if (event.source && event.source.postMessage) {
      event.source.postMessage({ type: "LIB_CACHE_STATUS", ok });
    }
  })());
});
