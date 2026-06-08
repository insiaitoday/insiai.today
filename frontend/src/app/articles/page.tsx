import type { Metadata } from 'next';
import { Suspense } from 'react';
import { api } from '@/lib/api';
import { PostCard } from '@/components/feed/PostCard';
import { Sidebar } from '@/components/layout/Sidebar';

export const dynamic = 'force-dynamic'; // Always fresh data — fixes approved posts not showing

export const metadata: Metadata = {
  title: 'Original Articles & AI Analysis — INSI AI Today',
  description: 'Read original long-form articles, analysis, and deep dives on artificial intelligence from the INSI AI Today editorial team. Expert perspectives on the trends shaping the AI industry.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://insiai.today'}/articles`,
  },
  openGraph: {
    title: 'Original AI Articles & Analysis — INSI AI Today',
    description: 'In-depth AI analysis and original editorial content from the INSI AI Today team.',
    images: [{ url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://insiai.today'}/og-default.png`, width: 1200, height: 630 }],
  },
};


interface ArticlesPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
  const params = await searchParams;
  const page   = parseInt(params?.page || '1');

  let posts: import('@/types').Post[] = [];
  let totalPages = 1;

  try {
    const data = await api.posts.list({ type: 'article', page, limit: 12, status: 'published', sort: 'new' });
    posts      = data.posts;
    totalPages = data.pagination.totalPages;
  } catch {
    // Show empty state on error
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          <span className="gradient-text">Original Articles</span>
        </h1>
        <p className="text-text-secondary max-w-2xl text-sm">
          In-depth analysis, tutorials, and insights from the INSI AI Today editorial team.
        </p>
      </div>

      <div className="flex gap-8">
        {/* Main feed */}
        <div className="flex-1 min-w-0">
          {posts.length === 0 ? (
            <div className="card p-12 text-center">
              <div className="text-5xl mb-4">
                <svg className="w-16 h-16 mx-auto text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold mb-2">No articles yet</h2>
              <p className="text-text-secondary text-sm">
                Original articles will appear here once published by the editorial team.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {posts.map((post, i) => (
                <PostCard key={post.id} post={post} index={i} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {page > 1 && (
                <a
                  href={`/articles?page=${page - 1}`}
                  className="btn-ghost px-4 py-2 text-sm"
                >
                  ← Previous
                </a>
              )}
              <span className="px-4 py-2 text-sm text-text-muted">
                Page {page} of {totalPages}
              </span>
              {page < totalPages && (
                <a
                  href={`/articles?page=${page + 1}`}
                  className="btn-primary px-4 py-2 text-sm"
                >
                  Next →
                </a>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="hidden lg:block w-72 shrink-0">
          <Suspense fallback={<div className="space-y-4">{[1,2,3].map(i=><div key={i} className="skeleton h-40 rounded-xl"/>)}</div>}>
            <Sidebar />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
