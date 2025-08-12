import type { NextConfig } from "next";
import withPWAFactory from "@ducanh2912/next-pwa";

const withPWA = withPWAFactory({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
  fallbacks: {
    document: "/offline",
  },
  workboxOptions: {
    disableDevLogs: true,
  },
});

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "mellow-poodle-790.convex.cloud",
      },
    ],
  },
  headers: async () => {
    const isDev = process.env.NODE_ENV !== "production";
    const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

    const clerkHosts = [
      "https://*.clerk.com",
      "https://*.clerkstage.dev",
      "https://*.clerk.accounts.dev",
    ];
    const cfTurnstile = "https://challenges.cloudflare.com";

    const scriptParts = [
      "'self'",
      "'unsafe-inline'",
      ...(isDev ? ["'unsafe-eval'"] : []),
      ...(clerkEnabled ? clerkHosts : []),
      cfTurnstile,
    ];
    const connectParts = [
      "'self'",
      "https:",
      ...(isDev ? ["ws:", "wss:"] : []),
      ...(clerkEnabled ? clerkHosts : []),
    ];
    const frameParts = ["'self'", ...(clerkEnabled ? clerkHosts : []), cfTurnstile];
    const imgParts = ["'self'", "data:", "https:", ...(clerkEnabled ? clerkHosts : [])];
    const fontParts = ["'self'", "https:", "data:"];
    const workerParts = ["'self'", "blob:"];
    const childParts = ["'self'", "blob:"];
    const mediaParts = [
      "'self'",
      "blob:",
      "data:",
      "https://mellow-poodle-790.convex.cloud", // ✅ Allow Convex storage media
    ];

    const scriptSrc = scriptParts.join(" ");
    const connectSrc = connectParts.join(" ");
    const frameSrc = frameParts.join(" ");
    const imgSrc = imgParts.join(" ");
    const fontSrc = fontParts.join(" ");
    const workerSrc = workerParts.join(" ");
    const childSrc = childParts.join(" ");
    const mediaSrc = mediaParts.join(" ");

    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "geolocation=(), microphone=(), camera=()" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              `img-src ${imgSrc}`,
              `script-src ${scriptSrc}`,
              `script-src-elem ${scriptSrc}`,
              "style-src 'self' 'unsafe-inline'",
              `connect-src ${connectSrc}`,
              `frame-src ${frameSrc}`,
              `font-src ${fontSrc}`,
              `worker-src ${workerSrc}`,
              `child-src ${childSrc}`,
              `media-src ${mediaSrc}`,
            ].join("; "),
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default withPWA(nextConfig);
