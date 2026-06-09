/**
 * sitemap.ts — Next.js App Router Sitemap
 *
 * Next.js automatically handles:
 *   - XML declaration: <?xml version="1.0" encoding="UTF-8"?>
 *   - <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"> root element
 *   - Content-Type: application/xml header
 *   - Serving at /sitemap.xml
 *
 * Do NOT manually construct XML here — return a MetadataRoute.Sitemap array
 * and Next.js serialises it to valid XML automatically.
 *
 * Google Search Console requirements met:
 *   ✓ Valid XML with proper declaration and urlset root
 *   ✓ lastmod uses real timestamps (DB dates for posts, deploy date for static)
 *   ✓ No future dates
 *   ✓ Absolute URLs using canonical domain from env
 *   ✓ All public routes included
 *   ✓ Accessible at /sitemap.xml
 */

import type { MetadataRoute } from 'next';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

/**
 * Canonical site URL — set NEXT_PUBLIC_SITE_URL in Vercel environment variables.
 * Must match exactly what is verified in Google Search Console.
 * Example: https://insiaitoday.com  OR  https://insiai.today
 */
const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://insiai.today'
).replace(/\/$/, ''); // strip trailing slash

/**
 * Backend API URL — used server-side only for fetching post slugs.
 * Falls back to the public API URL for Vercel serverless environment.
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

// ---------------------------------------------------------------------------
// Static page registry
// ---------------------------------------------------------------------------

/**
 * All static public pages.
 * `lastModified`: the date this page's *content* was last meaningfully changed.
 * Update the date here when you push a significant content update to the page.
 *
 * ⚠️  Do NOT use new Date() here — that tells Google the page changes every
 *      minute which wastes crawl budget and can cause ranking fluctuations.
 */
const STATIC_PAGES: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
  priority: number;
  lastModified: string; // ISO date string YYYY-MM-DD
}> = [
  { path: '/',         changeFrequency: 'hourly',  priority: 1.0, lastModified: '2026-06-09' },
  { path: '/articles', changeFrequency: 'hourly',  priority: 0.9, lastModified: '2026-06-09' },
  { path: '/search',   changeFrequency: 'weekly',  priority: 0.6, lastModified: '2026-06-09' },
  { path: '/about',    changeFrequency: 'monthly', priority: 0.7, lastModified: '2026-06-09' },
  { path: '/contact',  changeFrequency: 'monthly', priority: 0.6, lastModified: '2026-06-09' },
  { path: '/privacy',  changeFrequency: 'monthly', priority: 0.4, lastModified: '2026-06-09' },
  { path: '/terms',    changeFrequency: 'monthly', priority: 0.4, lastModified: '2026-06-09' },
];

/** All category slugs — must match your actual route params */
const CATEGORY_SLUGS = [
  'breaking-news',
  'product-launches',
  'research-papers',
  'funding',
  'tools',
  'tutorials',
] as const;

// ---------------------------------------------------------------------------
// Type for the raw post data we need from the API
// ---------------------------------------------------------------------------

interface PostSitemapEntry {
  slug: string;
  type?: string | null;
  category?: string | null;
  published_at?: string | null;
  updated_at?: string | null;
  created_at: string;
  featured?: boolean;
}

// ---------------------------------------------------------------------------
// Data fetcher — isolated so errors don't break the entire sitemap
// ---------------------------------------------------------------------------

async function fetchPublishedPosts(): Promise<PostSitemapEntry[]> {
  try {
    const url = `${API_URL}/api/posts?status=published&limit=5000&sort=new`;
    const res = await fetch(url, {
      // Revalidate every hour — balances freshness with server load.
      // Do NOT use cache: 'no-store' for sitemaps (would hit backend on every Google fetch)
      next: { revalidate: 3600 },
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      console.error(`[sitemap] API responded ${res.status} — falling back to static-only sitemap`);
      return [];
    }

    const data = await res.json();
    // API returns { posts: [...] } or plain array — handle both
    return Array.isArray(data) ? data : (data.posts ?? []);
  } catch (err) {
    console.error('[sitemap] Failed to fetch posts:', err);
    return [];
  }
}

// ---------------------------------------------------------------------------
// Sitemap generator — called by Next.js at build/revalidation time
// ---------------------------------------------------------------------------

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Static pages — hardcoded, never "now"
  const staticEntries: MetadataRoute.Sitemap = STATIC_PAGES.map(({ path, changeFrequency, priority, lastModified }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(lastModified),
    changeFrequency,
    priority,
  }));

  // 2. Fetch published posts from backend
  const posts = await fetchPublishedPosts();

  // 3. Derive per-category lastmod from the newest post in each category
  const categoryLatest: Record<string, Date> = {};
  for (const post of posts) {
    if (!post.category) continue;
    // Normalise category name → slug (matches CATEGORY_SLUGS format)
    const slug = post.category.toLowerCase().replace(/[\s_]+/g, '-');
    const postDate = new Date(post.updated_at || post.published_at || post.created_at);
    if (!categoryLatest[slug] || postDate > categoryLatest[slug]) {
      categoryLatest[slug] = postDate;
    }
  }

  // Fallback date: site launch date (never "today")
  const LAUNCH_DATE = new Date('2026-06-09');

  // 4. Category pages
  const categoryEntries: MetadataRoute.Sitemap = CATEGORY_SLUGS.map((slug) => ({
    url: `${SITE_URL}/category/${slug}`,
    lastModified: categoryLatest[slug] ?? LAUNCH_DATE,
    changeFrequency: 'hourly' as const,
    priority: 0.85,
  }));

  // 5. Individual post pages
  //    - Posts with type 'article' → /articles/[slug]
  //    - All other posts (news, rss, default) → /news/[slug]
  const postEntries: MetadataRoute.Sitemap = posts
    .filter((post) => Boolean(post.slug)) // skip any post missing a slug
    .map((post) => {
      const section = post.type === 'article' ? 'articles' : 'news';
      const lastModified = new Date(
        post.updated_at || post.published_at || post.created_at
      );

      return {
        url: `${SITE_URL}/${section}/${post.slug}`,
        lastModified,
        changeFrequency: post.type === 'article'
          ? ('weekly' as const)
          : ('daily' as const),
        priority: post.featured
          ? 0.95
          : post.type === 'article'
            ? 0.80
            : 0.70,
      };
    });

  // 6. Return combined sitemap — Next.js serialises to valid XML automatically
  return [...staticEntries, ...categoryEntries, ...postEntries];
}

// Revalidate the sitemap page itself every hour (ISR)
// This controls how often Next.js re-runs the sitemap() function
export const revalidate = 3600;
