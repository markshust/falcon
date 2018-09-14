/* global workbox, self, importScripts */

importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.5.0/workbox-sw.js');

workbox.core.setCacheNameDetails({ prefix: '@deity' });

workbox.skipWaiting();
workbox.clientsClaim();

workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute([], {});

workbox.routing.registerRoute(
  ({ event }) => event.request.mode === 'navigate',
  ({ url }) => fetch(url.href).catch(() => caches.match('/app-shell'))
);

workbox.routing.registerRoute('/', workbox.strategies.networkFirst(), 'GET');
