import type { MetadataRoute } from 'next';
import { api } from '@/lib/api';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://insiai.today';

// All category slugs used by the platform
const CATEGORY_SLUGS = [
  'breaking-news',
  'product-launches',
  'research-papers',
  'funding',
  'tools',
  'tutorials',
];

// Real dates when each static page was last meaningfully updated.
// ⚠️  Update these manually whenever you change the page content.
const STATIC_PAGE_DATES: Record<string, string> = {
  '/':         '2026-06-09',
  '/articles': '2026-06-09',
  '/search':   '2026-06-09',
  '/about':    '2026-06-09',
  '/contact':  '2026-06-09',
  '/privacy':  '2026-06-09',
  '/terms':    '2026-06-09',
};

function staticDate(path: string): Date {
  return new Date(STATIC_PAGE_DATES[path] ?? '2026-06-09');
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ── Static pages — use real hardcoded dates, NOT new Date() ──────────────────
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: staticDate('/'),
      changeFrequency: 'hourly',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/articles`,
      lastModified: staticDate('/articles'),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/search`,
      lastModified: staticDate('/search'),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: staticDate('/about'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: staticDate('/contact'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: staticDate('/privacy'),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: staticDate('/terms'),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];

  // ── Dynamic post pages + derive category lastmod from actual post dates ────────
  try {
    const { posts } = await api.posts.list({ limit: 1000, status: 'published' });

    // Find the most recent post date per category slug for accurate category lastmod
    const categoryLastmod: Record<string, Date> = {};
    for (const post of posts) {
      if (!post.category) continue;
      const slug = post.category.toLowerCase().replace(/\s+/g, '-');
      const postDate = new Date(post.updated_at || post.created_at);
      if (!categoryLastmod[slug] || postDate > categoryLastmod[slug]) {
        categoryLastmod[slug] = postDate;
      }
    }

    const categoryPages: MetadataRoute.Sitemap = CATEGORY_SLUGS.map((slug) => ({
      url: `${siteUrl}/category/${slug}`,
      // Use newest post date for this category; fallback to site launch date
      lastModified: categoryLastmod[slug] ?? staticDate('/'),
      changeFrequency: 'hourly' as const,
      priority: 0.85,
    }));

    const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${siteUrl}/${post.type === 'article' ? 'articles' : 'news'}/${post.slug}`,
      lastModified: new Date(post.updated_at || post.created_at),
      changeFrequency: post.type === 'article' ? ('weekly' as const) : ('daily' as const),
      priority: post.featured ? 0.95 : post.type === 'article' ? 0.8 : 0.7,
    }));

    return [...staticPages, ...categoryPages, ...postPages];
  } catch {
    // Fallback: static + category pages with hardcoded dates (no `now`)
    const categoryPages: MetadataRoute.Sitemap = CATEGORY_SLUGS.map((slug) => ({
      url: `${siteUrl}/category/${slug}`,
      lastModified: staticDate('/'),
      changeFrequency: 'hourly' as const,
      priority: 0.85,
    }));

    return [...staticPages, ...categoryPages];
  }
}
