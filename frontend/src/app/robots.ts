/**
 * robots.ts — Next.js App Router robots.txt generator
 *
 * Served at /robots.txt automatically by Next.js.
 * Points crawlers to the sitemap and blocks non-public routes.
 *
 * ⚠️  The `sitemap` URL here must match your Google Search Console
 *      verified property exactly (same scheme + domain).
 */

import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || 'https://insiai.today'
  ).replace(/\/$/, ''); // strip trailing slash for consistency

  return {
    rules: [
      // ── General crawlers ──────────────────────────────────────
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',      // backend proxy routes
          '/admin/',    // admin portal (separate deployment)
          // NOTE: /_next/ intentionally NOT blocked — Next.js static
          // assets must be crawlable for Google to render pages correctly.
        ],
      },
      // ── Google (Googlebot) ────────────────────────────────────
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
      // ── Google AdSense crawlers ───────────────────────────────
      // Mediapartners-Google: scans page content for ad targeting & verification
      { userAgent: 'Mediapartners-Google',   allow: '/' },
      // Google-Display-Ads-Bot: verifies ad placements on live pages
      { userAgent: 'Google-Display-Ads-Bot', allow: '/' },
      // ── Bing ─────────────────────────────────────────────────
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/', '/admin/'],
        crawlDelay: 1,
      },
      // ── Block AI training scrapers ────────────────────────────
      { userAgent: 'GPTBot',          disallow: ['/'] },
      { userAgent: 'ChatGPT-User',    disallow: ['/'] },
      { userAgent: 'CCBot',           disallow: ['/'] },
      { userAgent: 'anthropic-ai',    disallow: ['/'] },
      { userAgent: 'Google-Extended', disallow: ['/'] },
      { userAgent: 'PerplexityBot',   disallow: ['/'] },
    ],
    // Sitemap location — must be absolute URL, same domain as GSC property
    sitemap: `${siteUrl}/sitemap.xml`,
    // NOTE: `host:` directive intentionally removed — it is not part of the
    // robots.txt standard and is ignored or flagged as invalid by Google.
  };
}
