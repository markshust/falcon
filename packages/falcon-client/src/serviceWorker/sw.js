/* global workbox */
/* global self */

workbox.core.setCacheNameDetails({ prefix: '@deity' });

workbox.skipWaiting();
workbox.clientsClaim();

self.__precacheManifest = [
  {
    url: 'app-shell',
    revision: 'e180d256ac5ad56dc31ef392cefb9bc4'
  }
].concat(self.__precacheManifest || []);

workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerRoute(
  ({ event }) => event.request.mode === 'navigate',
  ({ url }) => fetch(url.href).catch(() => caches.match('/app-shell'))
);

workbox.routing.registerRoute('/', workbox.strategies.networkFirst(), 'GET');
