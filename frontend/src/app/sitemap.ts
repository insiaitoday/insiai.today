import type { MetadataRoute } from 'next';
import { api } from '@/lib/api';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://leviai.today';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: 'hourly', priority: 1 },
    { url: `${siteUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${siteUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${siteUrl}/privacy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${siteUrl}/terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ];

  try {
    const { posts } = await api.posts.list({ limit: 200, status: 'published' });

    const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${siteUrl}/${post.type === 'article' ? 'articles' : 'news'}/${post.slug}`,
      lastModified: new Date(post.updated_at || post.created_at),
      changeFrequency: post.type === 'article' ? ('weekly' as const) : ('daily' as const),
      priority: post.featured ? 0.9 : post.type === 'article' ? 0.8 : 0.7,
    }));

    return [...staticPages, ...postPages];
  } catch {
    return staticPages;
  }
}
