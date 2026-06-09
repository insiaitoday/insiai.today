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
          '/_next/',    // Next.js internal assets
        ],
      },
      // ── Google ────────────────────────────────────────────────
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
      // ── Bing ─────────────────────────────────────────────────
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/', '/admin/'],
        crawlDelay: 1,
      },
      // ── Block AI training scrapers ────────────────────────────
      { userAgent: 'GPTBot',        disallow: ['/'] },
      { userAgent: 'ChatGPT-User',  disallow: ['/'] },
      { userAgent: 'CCBot',         disallow: ['/'] },
      { userAgent: 'anthropic-ai',  disallow: ['/'] },
      { userAgent: 'Google-Extended', disallow: ['/'] },
      { userAgent: 'PerplexityBot', disallow: ['/'] },
    ],
    // Sitemap location — must be absolute URL, same domain as GSC property
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
