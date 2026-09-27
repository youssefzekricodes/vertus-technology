import type { NextConfig } from "next";

const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
];

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  poweredByHeader: false,
  // French is the default language again (at the root); /fr/* links from the
  // Arabic-first period keep working.
  async redirects() {
    return [
      { source: "/fr", destination: "/", permanent: true },
      { source: "/fr/:path*", destination: "/:path*", permanent: true },
    ];
  },
  async headers() {
    // Public images/icons are not content-hashed: cache 30 days, then
    // revalidate in the background (instant repeat visits, still updatable).
    const assetCache = [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=604800" }];
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/projects/:file*", headers: assetCache },
      { source: "/about/:file*", headers: assetCache },
      { source: "/:icon(favicon.ico|icon.svg|logo-mark.svg|icon-48.png|icon-96.png|icon-192.png|icon-512.png|apple-touch-icon.png)", headers: assetCache },
    ];
  },
};

export default nextConfig;
