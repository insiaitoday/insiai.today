import type { Metadata } from 'next';
import { Suspense } from 'react';
import { api } from '@/lib/api';
import { PostCard } from '@/components/feed/PostCard';
import { Sidebar } from '@/components/layout/Sidebar';
import { SortTabs } from '@/components/feed/SortTabs';
import { CategoryFilter } from '@/components/feed/CategoryFilter';
import { CompanyNewsSection } from '@/components/feed/CompanyNewsSection';
import { AdUnit } from '@/components/ads/AdUnit';
import type { Post } from '@/types';

export const dynamic = 'force-dynamic'; // Always fresh

export const metadata: Metadata = {
  title: 'INSI AI Today — Daily AI News, Research & Insights',
  description: 'Stay informed on artificial intelligence with INSI AI Today. We curate the most important AI news, research papers, product launches, and funding rounds from 30+ top sources — updated every 2 hours. Breaking news from OpenAI, Google, Anthropic, Meta AI, and more.',
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://insiai.today',
  },
};


interface HomePageProps {
  searchParams: Promise<{ sort?: string; category?: string; page?: string; company?: string }>;
}

const COMPANIES_MAP: Record<string, string> = {
  openai: 'OpenAI', google: 'Google AI', anthropic: 'Anthropic',
  meta: 'Meta AI', microsoft: 'Microsoft', nvidia: 'NVIDIA', mistral: 'Mistral',
  xai: 'xAI (Grok)',
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const params   = await searchParams;
  const sort     = params?.sort || 'new';
  const category = params?.category || '';
  const page     = parseInt(params?.page || '1');
  const company  = params?.company || '';

  let posts: Post[] = [];
  let totalPages = 1;
  let totalCount = 0;

  try {
    const queryParams: Record<string, string | number> = {
      sort, page, limit: 20, status: 'published',
    };
    if (category) queryParams.category = category;
    if (company)  queryParams.search = company;

    const data  = await api.posts.list(queryParams);
    posts       = data.posts;
    totalPages  = data.pagination.totalPages;
    totalCount  = data.pagination.total;
  } catch {
    // Show empty state on error
  }

  // ── Featured post logic ─────────────────────────────────────────────────────
  // On unfiltered "new" page 1 only: pick the newest explicitly featured post,
  // or fall back to the very latest post (news OR article) by published_at.
  const isUnfiltered = !company && !category && page === 1;

  let featured: Post | null = null;
  if (isUnfiltered && sort === 'new') {
    // Prefer explicitly flagged featured post first
    featured = posts.find((p) => p.featured) ?? posts[0] ?? null;
  }

  // Feed = everything except the featured hero card
  const feed = featured
    ? posts.filter((p) => p.id !== featured!.id)
    : posts;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className="mb-5 text-center animate-fade-in">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-slow" />
          Live AI News Feed
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
          <span className="gradient-text">AI News</span> That Matters
        </h1>
        <p className="text-text-secondary max-w-lg mx-auto text-xs sm:text-sm">
          Curated from 30+ top AI sources · Updated every 2 hours · Editorial insights
        </p>
      </div>

      {/* ── Top Companies Section ──────────────────────────────────────────── */}
      <Suspense fallback={<div className="company-section-skeleton" />}>
        <CompanyNewsSection activeCompany={company} />
      </Suspense>

      {/* ── Featured hero section ────────────────────────────────────────── */}
      {featured && isUnfiltered && (
        <div className="mb-5 animate-fade-in">
          <PostCard post={featured} variant="featured" />
        </div>
      )}

      {/* ── Main layout ───────────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row gap-6">

        {/* Feed column */}
        <div className="flex-1 min-w-0">

          {/* Sort + count row */}
          <div className="flex flex-wrap gap-2 mb-3 items-center justify-between">
            <Suspense fallback={<div className="h-9 w-40 skeleton rounded-lg" />}>
              <SortTabs activeSort={sort} />
            </Suspense>
            {totalCount > 0 && (
              <span className="text-xs text-text-muted">
                {totalCount} post{totalCount !== 1 ? 's' : ''}
                {company  ? ` · ${COMPANIES_MAP[company] ?? company}` : ''}
                {category ? ` · ${category}` : ''}
              </span>
            )}
          </div>

          {/* Category filter strip */}
          <Suspense fallback={<div className="h-8 skeleton rounded-full w-full mb-4" />}>
            <CategoryFilter activeCategory={category || 'All'} />
          </Suspense>

          <div className="mt-4" />

          {/* ── Feed ──────────────────────────────────────────────────────── */}
          {posts.length === 0 ? (
            <div className="card p-8 sm:p-12 text-center animate-fade-in">
              <svg className="w-12 h-12 mx-auto text-text-muted mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <h2 className="text-lg font-bold mb-2">No posts found</h2>
              <p className="text-text-secondary text-sm max-w-xs mx-auto">
                {company
                  ? `No news about ${COMPANIES_MAP[company] ?? company} yet.`
                  : category
                  ? `No posts in "${category}" yet.`
                  : 'Posts will appear as soon as the feed syncs.'}
              </p>
              {(company || category) && (
                <a href="/" className="btn-primary text-sm mt-5 inline-flex">
                  ← All News
                </a>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {feed.map((post, i) => (
                <PostCard key={post.id} post={post} index={i} />
              ))}

              {/* In-feed ad after 6th post */}
              {feed.length >= 6 && (
                <div className="flex justify-center py-2">
                  <AdUnit slot="in-content" />
                </div>
              )}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
              {page > 1 && (
                <a
                  href={`/?sort=${sort}${company ? `&company=${company}` : ''}${category ? `&category=${encodeURIComponent(category)}` : ''}&page=${page - 1}`}
                  className="btn-ghost px-4 py-2 text-sm"
                >
                  ← Prev
                </a>
              )}
              <span className="px-4 py-2 text-sm text-text-muted bg-background-surface border border-border rounded-lg">
                {page} / {totalPages}
              </span>
              {page < totalPages && (
                <a
                  href={`/?sort=${sort}${company ? `&company=${company}` : ''}${category ? `&category=${encodeURIComponent(category)}` : ''}&page=${page + 1}`}
                  className="btn-primary px-4 py-2 text-sm"
                >
                  Next →
                </a>
              )}
            </div>
          )}
        </div>

        {/* Sidebar — desktop right column */}
        <div className="w-full lg:w-72 lg:shrink-0">
          <Suspense fallback={
            <div className="space-y-4">
              {[1,2,3].map(i => <div key={i} className="skeleton h-36 rounded-xl"/>)}
            </div>
          }>
            <Sidebar />
          </Suspense>
        </div>

      </div>
    </div>
  );
}
