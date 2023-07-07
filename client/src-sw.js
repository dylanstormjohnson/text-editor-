const { offlineFallback, warmStrategyCache } = require("workbox-recipes");
const { CacheFirst, StaleWhileRevalidate } = require("workbox-strategies");
const { registerRoute } = require("workbox-routing");
const { CacheableResponsePlugin } = require("workbox-cacheable-response");
const { ExpirationPlugin } = require("workbox-expiration");
const { precacheAndRoute } = require("workbox-precaching/precacheAndRoute");

precacheAndRoute(self.__WB_MANIFEST);

const pageCache = new CacheFirst({
  cacheName: "page-cache",
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
});

warmStrategyCache({
  urls: ["/index.html", "/"],
  strategy: pageCache,
});

// registerRoute(({ request }) => request.mode === 'navigate', pageCache);

// registerRoute(
// // Match any requests with the file extension of common web assets
// ({ request }) =>
//   request.destination === "style" ||
//   request.destination === "script" ||
//   request.destination === "image" ||
//   request.destination === "font",
// assetsCache
//
//   new StaleWhileRevalidate({
//     cacheName: "static-resources",
//     plugins: [
//       new CacheableResponsePlugin({
//         statuses: [0, 200],
//       }),
//     ],
//   })
// );

// const assetsCache = new StaleWhileRevalidate({
//   cacheName: "static-resources",
//   plugins: [
//     new CacheableResponsePlugin({
//       statuses: [0, 200],
//     }),
//     new ExpirationPlugin({
//       maxAgeSeconds: 7 * 24 * 60 * 60, // Adjust the max age as per your requirements
//     }),
//   ],
// });

registerRoute(
  // Match any requests with the file extension of common web assets
  ({ request }) =>
    request.destination === "style" ||
    request.destination === "script" ||
    request.destination === "image" ||
    request.destination === "font",
  new StaleWhileRevalidate({
    chacheName: 'asset-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      })
    ]
  })
);

registerRoute(({ request }) => request.mode === "navigate", pageCache);

// TODO: Implement asset caching
// registerRoute();
