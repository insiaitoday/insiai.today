import type { Metadata } from 'next';
import { Suspense } from 'react';
import { api } from '@/lib/api';
import { PostCard } from '@/components/feed/PostCard';
import { SortTabs } from '@/components/feed/SortTabs';
import { Sidebar } from '@/components/layout/Sidebar';
import { getCategoryClass } from '@/lib/utils';
import { CATEGORIES } from '@/types';

export const dynamic = 'force-dynamic'; // Always fresh data


interface PageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ sort?: string; page?: string }>;
}

function formatCategoryName(slug: string): string {
  return slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  'Breaking News': 'Follow breaking AI news as it happens. Real-time coverage of the most important artificial intelligence developments, announcements, and events from around the world.',
  'Product Launches': 'Discover the latest AI product launches, model releases, and tool announcements. From ChatGPT updates to new AI APIs — we cover every major release.',
  'Research Papers': 'Explore the cutting edge of AI research. We curate the most significant machine learning papers, academic breakthroughs, and scientific findings from top AI labs and universities.',
  'Funding': 'Stay informed on AI startup funding, venture capital investments, acquisitions, and industry financial news. Track where the money is flowing in artificial intelligence.',
  'Tools': 'Find the best AI tools, developer APIs, open-source libraries, and productivity software. Practical resources for builders, developers, and AI enthusiasts.',
  'Tutorials': 'Learn AI with step-by-step tutorials, guides, and educational content. From beginner-friendly introductions to advanced machine learning techniques.',
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const name = formatCategoryName(category);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://insiai.today';
  const description = CATEGORY_DESCRIPTIONS[name] || `Browse the latest ${name.toLowerCase()} AI news, curated from 30+ top sources. Updated every 2 hours with the most important stories.`;
  const catUrl = `${siteUrl}/category/${category}`;
  return {
    title: `${name} — AI News & Updates`,
    description,
    alternates: { canonical: catUrl },
    openGraph: {
      title: `${name} — AI News | INSI AI Today`,
      description,
      url: catUrl,
      siteName: 'INSI AI Today',
      images: [{ url: `${siteUrl}/og-default.png`, width: 1200, height: 630, alt: `${name} — INSI AI Today` }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@insiai_today',
      title: `${name} — AI News | INSI AI Today`,
      description,
      images: [`${siteUrl}/og-default.png`],
    },
  };
}


export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { category } = await params;
  const sp    = await searchParams;
  const sort  = sp?.sort || 'new';
  const page  = parseInt(sp?.page || '1');
  const name  = formatCategoryName(category);
  const catClass = getCategoryClass(name);

  let posts: import('@/types').Post[] = [];
  let totalPages = 1;

  try {
    const data = await api.posts.list({ sort, page, limit: 12, category: name, status: 'published' });
    posts      = data.posts;
    totalPages = data.pagination.totalPages;
  } catch {}

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Category header */}
      <div className="mb-8">
        <span className={`badge border text-sm mb-3 inline-block ${catClass}`}>{name}</span>
        <h1 className="text-3xl font-bold mb-2">{name}</h1>
        <p className="text-text-secondary">Latest {name.toLowerCase()} news and updates from the world of AI.</p>
      </div>

      <div className="flex gap-8">
        <div className="flex-1 min-w-0">
          <div className="mb-4">
            <Suspense fallback={null}><SortTabs activeSort={sort} /></Suspense>
          </div>

          {posts.length === 0 ? (
            <div className="card p-12 text-center">
              <div className="text-4xl mb-3">📂</div>
              <h2 className="text-xl font-bold mb-2">No posts in {name}</h2>
              <p className="text-text-secondary text-sm">Check back soon — posts are added every 2 hours.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {posts.map((post, i) => <PostCard key={post.id} post={post} index={i} />)}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {page > 1 && <a href={`/category/${category}?sort=${sort}&page=${page - 1}`} className="btn-ghost px-4 py-2 text-sm">← Previous</a>}
              <span className="px-4 py-2 text-sm text-text-muted">Page {page} of {totalPages}</span>
              {page < totalPages && <a href={`/category/${category}?sort=${sort}&page=${page + 1}`} className="btn-primary px-4 py-2 text-sm">Next →</a>}
            </div>
          )}
        </div>

        <div className="hidden lg:block w-72 shrink-0">
          <Suspense fallback={null}><Sidebar /></Suspense>
        </div>
      </div>
    </div>
  );
}
