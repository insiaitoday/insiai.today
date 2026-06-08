'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { PostCard } from '@/components/feed/PostCard';
import type { Post } from '@/types';

function SearchContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const [results,   setResults]   = useState<Post[]>([]);
  const [loading,   setLoading]   = useState(false);
  const [total,     setTotal]     = useState(0);
  const [searched,  setSearched]  = useState(false);

  useEffect(() => {
    if (!q || q.length < 2) return;
    setLoading(true);
    api.search.query(q)
      .then((data) => { setResults(data.results); setTotal(data.pagination.total); setSearched(true); })
      .catch(() => { setSearched(true); })
      .finally(() => setLoading(false));
  }, [q]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8 flex items-center gap-3.5 border-b border-border/60 pb-6">
        <div className="p-2 rounded-xl bg-background-elevated border border-border shadow-sm">
          <img
            src="/logo.png"
            alt="INSI AI Today"
            className="h-8 w-auto object-contain"
          />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight text-text-primary">
            {q ? <>Search results for <span className="gradient-text">"{q}"</span></> : 'Search'}
          </h1>
          {searched && <p className="text-text-muted text-sm mt-0.5">{total} result{total !== 1 ? 's' : ''} found</p>}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3,4].map(i => (
          <div key={i} className="card p-4 flex gap-4">
            <div className="flex-1 space-y-2">
              <div className="skeleton h-4 w-3/4 rounded" />
              <div className="skeleton h-3 w-full rounded" />
              <div className="skeleton h-3 w-1/2 rounded" />
            </div>
            <div className="skeleton w-28 h-20 rounded-lg" />
          </div>
        ))}</div>
      ) : results.length > 0 ? (
        <div className="space-y-3">
          {results.map((post, i) => <PostCard key={post.id} post={post} index={i} />)}
        </div>
      ) : searched ? (
        <div className="card p-12 text-center">
          <div className="text-5xl mb-3">🔍</div>
          <h2 className="text-xl font-bold mb-2">No results found</h2>
          <p className="text-text-secondary text-sm">Try different keywords or browse by category.</p>
        </div>
      ) : null}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto px-4 py-10 text-text-muted">Loading search…</div>}>
      <SearchContent />
    </Suspense>
  );
}
