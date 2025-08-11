if (!self.define) {
  let e,
    n = {};
  const t = (t, r) => (
    (t = new URL(t + ".js", r).href),
    n[t] ||
      new Promise((n) => {
        if ("document" in self) {
          const e = document.createElement("script");
          ((e.src = t), (e.onload = n), document.head.appendChild(e));
        } else ((e = t), importScripts(t), n());
      }).then(() => {
        let e = n[t];
        if (!e) throw new Error(`Module ${t} didn’t register its module`);
        return e;
      })
  );
  self.define = (r, s) => {
    const a = e || ("document" in self ? document.currentScript.src : "") || location.href;
    if (n[a]) return;
    let c = {};
    const i = (e) => t(e, a),
      o = { module: { uri: a }, exports: c, require: i };
    n[a] = Promise.all(r.map((e) => o[e] || i(e))).then((e) => (s(...e), c));
  };
}
define(["./workbox-f1770938"], function (e) {
  "use strict";
  (importScripts("/fallback-ce627215c0e4a9af.js"),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        { url: "/_next/static/chunks/0e5ce63c-b05c8543eecd5f73.js", revision: "b05c8543eecd5f73" },
        { url: "/_next/static/chunks/134.92acb5e9e2e88224.js", revision: "92acb5e9e2e88224" },
        { url: "/_next/static/chunks/151-4b8022e9cdd4a33d.js", revision: "4b8022e9cdd4a33d" },
        { url: "/_next/static/chunks/4bd1b696-cf72ae8a39fa05aa.js", revision: "cf72ae8a39fa05aa" },
        { url: "/_next/static/chunks/522-979aa907867987cf.js", revision: "979aa907867987cf" },
        { url: "/_next/static/chunks/596-daed3810ce40435e.js", revision: "daed3810ce40435e" },
        { url: "/_next/static/chunks/634.4c11e4843e278cb0.js", revision: "4c11e4843e278cb0" },
        { url: "/_next/static/chunks/656-be7cbc8ee36f6c0b.js", revision: "be7cbc8ee36f6c0b" },
        { url: "/_next/static/chunks/881-12390faad8a7a6d3.js", revision: "12390faad8a7a6d3" },
        { url: "/_next/static/chunks/920.b62fceafb3ccb468.js", revision: "b62fceafb3ccb468" },
        { url: "/_next/static/chunks/a4634e51.df159e348e901d7f.js", revision: "df159e348e901d7f" },
        {
          url: "/_next/static/chunks/app/_not-found/page-4d9efe303e167626.js",
          revision: "4d9efe303e167626",
        },
        {
          url: "/_next/static/chunks/app/layout-84e745c54fa4d5e7.js",
          revision: "84e745c54fa4d5e7",
        },
        {
          url: "/_next/static/chunks/app/offline/page-20186a0eda6f8914.js",
          revision: "20186a0eda6f8914",
        },
        { url: "/_next/static/chunks/app/page-daf5cf56d7a985cc.js", revision: "daf5cf56d7a985cc" },
        {
          url: "/_next/static/chunks/app/sign-in/%5B%5B...sign-in%5D%5D/page-dfcac19c4ec2fe48.js",
          revision: "dfcac19c4ec2fe48",
        },
        { url: "/_next/static/chunks/f5cf3357.d36fb40b6aeda50d.js", revision: "d36fb40b6aeda50d" },
        { url: "/_next/static/chunks/fcfb803e-af9f64e8189c0a85.js", revision: "af9f64e8189c0a85" },
        { url: "/_next/static/chunks/framework-7c95b8e5103c9e90.js", revision: "7c95b8e5103c9e90" },
        { url: "/_next/static/chunks/main-9159ab78a7916d4c.js", revision: "9159ab78a7916d4c" },
        { url: "/_next/static/chunks/main-app-4e6275626772bc6a.js", revision: "4e6275626772bc6a" },
        {
          url: "/_next/static/chunks/pages/_app-0a0020ddd67f79cf.js",
          revision: "0a0020ddd67f79cf",
        },
        {
          url: "/_next/static/chunks/pages/_error-03529f2c21436739.js",
          revision: "03529f2c21436739",
        },
        {
          url: "/_next/static/chunks/polyfills-42372ed130431b0a.js",
          revision: "846118c33b2c0e922d7b3a7676f81f6f",
        },
        {
          url: "/_next/static/chunks/reactPlayerDash.f8507d4053e7efd8.js",
          revision: "f8507d4053e7efd8",
        },
        {
          url: "/_next/static/chunks/reactPlayerHls.539c21956ba0b78c.js",
          revision: "539c21956ba0b78c",
        },
        {
          url: "/_next/static/chunks/reactPlayerMux.7c8d135839e4d619.js",
          revision: "7c8d135839e4d619",
        },
        {
          url: "/_next/static/chunks/reactPlayerPreview.fdc5eaaedfd73ddc.js",
          revision: "fdc5eaaedfd73ddc",
        },
        {
          url: "/_next/static/chunks/reactPlayerSpotify.7bd1160929197b60.js",
          revision: "7bd1160929197b60",
        },
        {
          url: "/_next/static/chunks/reactPlayerTiktok.6f35e152b0e09f31.js",
          revision: "6f35e152b0e09f31",
        },
        {
          url: "/_next/static/chunks/reactPlayerTwitch.3dd2374d6c76399b.js",
          revision: "3dd2374d6c76399b",
        },
        {
          url: "/_next/static/chunks/reactPlayerVimeo.43e6bac090ec451b.js",
          revision: "43e6bac090ec451b",
        },
        {
          url: "/_next/static/chunks/reactPlayerWistia.1bf9d9def63039aa.js",
          revision: "1bf9d9def63039aa",
        },
        {
          url: "/_next/static/chunks/reactPlayerYouTube.22fe9be647671edc.js",
          revision: "22fe9be647671edc",
        },
        { url: "/_next/static/chunks/webpack-cfd23654148d0c1c.js", revision: "cfd23654148d0c1c" },
        { url: "/_next/static/css/dc2acab39472e2e3.css", revision: "dc2acab39472e2e3" },
        {
          url: "/_next/static/wU6aOwa9EQkCnefL2XSYU/_buildManifest.js",
          revision: "7fcf85c9495a4a4d620825e198bf9f66",
        },
        {
          url: "/_next/static/wU6aOwa9EQkCnefL2XSYU/_ssgManifest.js",
          revision: "b6652df95db52feb4daf4eca35380933",
        },
        { url: "/bg-dark.png", revision: "200685ec5fb11b7d9ce6fab124362b4d" },
        { url: "/bg-light.png", revision: "057aa4952555b7aa4a88fa1084bfa45d" },
        { url: "/dall-e.png", revision: "c75f8c5f25a7ca95177d6c89d79b2fbb" },
        { url: "/desktop-hero.png", revision: "a22b846aefcd2de817624e95873b2064" },
        { url: "/fallback-ce627215c0e4a9af.js", revision: "c993875f19fe74e088bb7137302474c8" },
        { url: "/gpt.png", revision: "625d8a08056d2f4216b96143b53519d0" },
        { url: "/manifest.json", revision: "ac58a90ec200cc552c5c0a7484d1d6c5" },
        { url: "/offline.html", revision: "abc0cc73e44d7b6bbe127133c1cf2bec" },
        { url: "/placeholder.png", revision: "f9f5074d5b1e698a9ac6cf1e9be7b709" },
        { url: "/poopenai.png", revision: "8efb3a8fc1a39a3f63c304b0feae4e8d" },
        { url: "/swe-worker-5c72df51bb1f6ee0.js", revision: "76fdd3369f623a3edcf74ce2200bfdd0" },
        { url: "/whatsapp.png", revision: "368b8210dba1fbac15b7d1a9f66ef42d" },
      ],
      { ignoreURLParametersMatching: [/^utm_/, /^fbclid$/] },
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      "/",
      new e.NetworkFirst({
        cacheName: "start-url",
        plugins: [
          {
            cacheWillUpdate: function (e) {
              var n = e.response;
              return _async_to_generator(function () {
                return _ts_generator(this, function (e) {
                  return [
                    2,
                    n && "opaqueredirect" === n.type
                      ? new Response(n.body, { status: 200, statusText: "OK", headers: n.headers })
                      : n,
                  ];
                });
              })();
            },
          },
          {
            handlerDidError: function (e) {
              var n = e.request;
              return _async_to_generator(function () {
                return _ts_generator(this, function (e) {
                  return [2, "undefined" != typeof self ? self.fallback(n) : Response.error()];
                });
              })();
            },
          },
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: "google-fonts-webfonts",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 }),
          {
            handlerDidError: function (e) {
              var n = e.request;
              return _async_to_generator(function () {
                return _ts_generator(this, function (e) {
                  return [2, "undefined" != typeof self ? self.fallback(n) : Response.error()];
                });
              })();
            },
          },
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: "google-fonts-stylesheets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
          {
            handlerDidError: function (e) {
              var n = e.request;
              return _async_to_generator(function () {
                return _ts_generator(this, function (e) {
                  return [2, "undefined" != typeof self ? self.fallback(n) : Response.error()];
                });
              })();
            },
          },
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-font-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
          {
            handlerDidError: function (e) {
              var n = e.request;
              return _async_to_generator(function () {
                return _ts_generator(this, function (e) {
                  return [2, "undefined" != typeof self ? self.fallback(n) : Response.error()];
                });
              })();
            },
          },
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-image-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 2592e3 }),
          {
            handlerDidError: function (e) {
              var n = e.request;
              return _async_to_generator(function () {
                return _ts_generator(this, function (e) {
                  return [2, "undefined" != typeof self ? self.fallback(n) : Response.error()];
                });
              })();
            },
          },
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\/_next\/static.+\.js$/i,
      new e.CacheFirst({
        cacheName: "next-static-js-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
          {
            handlerDidError: function (e) {
              var n = e.request;
              return _async_to_generator(function () {
                return _ts_generator(this, function (e) {
                  return [2, "undefined" != typeof self ? self.fallback(n) : Response.error()];
                });
              })();
            },
          },
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-image",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
          {
            handlerDidError: function (e) {
              var n = e.request;
              return _async_to_generator(function () {
                return _ts_generator(this, function (e) {
                  return [2, "undefined" != typeof self ? self.fallback(n) : Response.error()];
                });
              })();
            },
          },
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: "static-audio-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
          {
            handlerDidError: function (e) {
              var n = e.request;
              return _async_to_generator(function () {
                return _ts_generator(this, function (e) {
                  return [2, "undefined" != typeof self ? self.fallback(n) : Response.error()];
                });
              })();
            },
          },
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:mp4|webm)$/i,
      new e.CacheFirst({
        cacheName: "static-video-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
          {
            handlerDidError: function (e) {
              var n = e.request;
              return _async_to_generator(function () {
                return _ts_generator(this, function (e) {
                  return [2, "undefined" != typeof self ? self.fallback(n) : Response.error()];
                });
              })();
            },
          },
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-js-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 48, maxAgeSeconds: 86400 }),
          {
            handlerDidError: function (e) {
              var n = e.request;
              return _async_to_generator(function () {
                return _ts_generator(this, function (e) {
                  return [2, "undefined" != typeof self ? self.fallback(n) : Response.error()];
                });
              })();
            },
          },
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-style-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
          {
            handlerDidError: function (e) {
              var n = e.request;
              return _async_to_generator(function () {
                return _ts_generator(this, function (e) {
                  return [2, "undefined" != typeof self ? self.fallback(n) : Response.error()];
                });
              })();
            },
          },
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-data",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
          {
            handlerDidError: function (e) {
              var n = e.request;
              return _async_to_generator(function () {
                return _ts_generator(this, function (e) {
                  return [2, "undefined" != typeof self ? self.fallback(n) : Response.error()];
                });
              })();
            },
          },
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: "static-data-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
          {
            handlerDidError: function (e) {
              var n = e.request;
              return _async_to_generator(function () {
                return _ts_generator(this, function (e) {
                  return [2, "undefined" != typeof self ? self.fallback(n) : Response.error()];
                });
              })();
            },
          },
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      function (e) {
        var n = e.sameOrigin,
          t = e.url.pathname;
        return !(!n || t.startsWith("/api/auth/callback") || !t.startsWith("/api/"));
      },
      new e.NetworkFirst({
        cacheName: "apis",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 }),
          {
            handlerDidError: function (e) {
              var n = e.request;
              return _async_to_generator(function () {
                return _ts_generator(this, function (e) {
                  return [2, "undefined" != typeof self ? self.fallback(n) : Response.error()];
                });
              })();
            },
          },
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      function (e) {
        var n = e.request,
          t = e.url.pathname,
          r = e.sameOrigin;
        return (
          "1" === n.headers.get("RSC") &&
          "1" === n.headers.get("Next-Router-Prefetch") &&
          r &&
          !t.startsWith("/api/")
        );
      },
      new e.NetworkFirst({
        cacheName: "pages-rsc-prefetch",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
          {
            handlerDidError: function (e) {
              var n = e.request;
              return _async_to_generator(function () {
                return _ts_generator(this, function (e) {
                  return [2, "undefined" != typeof self ? self.fallback(n) : Response.error()];
                });
              })();
            },
          },
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      function (e) {
        var n = e.request,
          t = e.url.pathname,
          r = e.sameOrigin;
        return "1" === n.headers.get("RSC") && r && !t.startsWith("/api/");
      },
      new e.NetworkFirst({
        cacheName: "pages-rsc",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
          {
            handlerDidError: function (e) {
              var n = e.request;
              return _async_to_generator(function () {
                return _ts_generator(this, function (e) {
                  return [2, "undefined" != typeof self ? self.fallback(n) : Response.error()];
                });
              })();
            },
          },
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      function (e) {
        var n = e.url.pathname;
        return e.sameOrigin && !n.startsWith("/api/");
      },
      new e.NetworkFirst({
        cacheName: "pages",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
          {
            handlerDidError: function (e) {
              var n = e.request;
              return _async_to_generator(function () {
                return _ts_generator(this, function (e) {
                  return [2, "undefined" != typeof self ? self.fallback(n) : Response.error()];
                });
              })();
            },
          },
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      function (e) {
        return !e.sameOrigin;
      },
      new e.NetworkFirst({
        cacheName: "cross-origin",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 }),
          {
            handlerDidError: function (e) {
              var n = e.request;
              return _async_to_generator(function () {
                return _ts_generator(this, function (e) {
                  return [2, "undefined" != typeof self ? self.fallback(n) : Response.error()];
                });
              })();
            },
          },
        ],
      }),
      "GET",
    ),
    (self.__WB_DISABLE_DEV_LOGS = !0));
});
