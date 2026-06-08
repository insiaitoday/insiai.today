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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // ── Static pages ─────────────────────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/articles`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/search`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];

  // ── Category pages ────────────────────────────────────────────────────────────
  const categoryPages: MetadataRoute.Sitemap = CATEGORY_SLUGS.map((slug) => ({
    url: `${siteUrl}/category/${slug}`,
    lastModified: now,
    changeFrequency: 'hourly' as const,
    priority: 0.85,
  }));

  // ── Dynamic post pages ────────────────────────────────────────────────────────
  try {
    const { posts } = await api.posts.list({ limit: 1000, status: 'published' });

    const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${siteUrl}/${post.type === 'article' ? 'articles' : 'news'}/${post.slug}`,
      lastModified: new Date(post.updated_at || post.created_at),
      changeFrequency: post.type === 'article' ? ('weekly' as const) : ('daily' as const),
      priority: post.featured ? 0.95 : post.type === 'article' ? 0.8 : 0.7,
    }));

    return [...staticPages, ...categoryPages, ...postPages];
  } catch {
    // Return static + category pages if posts fetch fails
    return [...staticPages, ...categoryPages];
  }
}
