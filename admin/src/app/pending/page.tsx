'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { requireSession } from '@/lib/auth';
import { adminApi } from '@/lib/api';
import { AdminSidebar } from '@/components/shell/AdminSidebar';
import { AdminTopBar } from '@/components/shell/AdminTopBar';
import type { Post } from '@/types';
import { CATEGORIES } from '@/types';
import toast from 'react-hot-toast';

function timeAgo(d: string) {
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s/60)}m ago`;
  if (s < 86400) return `${Math.floor(s/3600)}h ago`;
  return `${Math.floor(s/86400)}d ago`;
}

type TimeFilter = 'all' | '1h' | '6h' | '24h';
type SortFilter = 'newest' | 'oldest' | 'source';
type CategoryFilter = 'all' | 'Breaking News' | 'Product Launch' | 'Research' | 'Funding' | 'Tools' | 'Tutorials' | 'General';

export default function PendingPage() {
  const [posts,    setPosts]    = useState<Post[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading,  setLoading]  = useState(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [filter,   setFilter]   = useState('');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('24h');
  const [sortFilter, setSortFilter] = useState<SortFilter>('newest');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [debouncedFilter, setDebouncedFilter] = useState('');
  // Commentary modal
  const [modalOpen,     setModalOpen]     = useState(false);
  const [activePost,    setActivePost]    = useState<Post | null>(null);
  const [commentary,    setCommentary]    = useState('');
  const [editTitle,     setEditTitle]     = useState('');
  const [editSnippet,   setEditSnippet]   = useState('');
  const [editCategory,  setEditCategory]  = useState('');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedFilter(filter);
      setPage(1); // Reset to page 1 on search
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [filter]);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      // Build query params with filters
      const params: Record<string, string | number> = {
        status: 'pending',
        limit,
        page,
        sort: sortFilter === 'newest' ? 'new' : sortFilter === 'oldest' ? 'old' : 'new',
      };

      // Add category filter if not 'all'
      if (categoryFilter !== 'all') {
        params.category = categoryFilter;
      }

      if (debouncedFilter) {
        params.search = debouncedFilter;
      }

      // Add time filter - use fetched_at for more accurate filtering
      if (timeFilter !== 'all') {
        const now = new Date();
        let since: Date;
        if (timeFilter === '1h') since = new Date(now.getTime() - 60 * 60 * 1000);
        else if (timeFilter === '6h') since = new Date(now.getTime() - 6 * 60 * 60 * 1000);
        else since = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        params.since = since.toISOString();
        params.filterBy = 'created_at'; // Filter by the real site's published time
      }

      const { posts: data, pagination } = await adminApi.posts.list(params);
      setPosts(data);
      setTotalCount(pagination.total);
    } catch { toast.error('Failed to load pending queue'); }
    finally { setLoading(false); }
  }, [page, limit, sortFilter, categoryFilter, timeFilter, debouncedFilter]);

  useEffect(() => { requireSession().then((s) => { if (s) loadPosts(); }); }, [loadPosts]);

  const totalPages = Math.ceil(totalCount / limit);

  const approve = async (id: string, extras?: Record<string, string>) => {
    try {
      await adminApi.posts.approve(id, extras);
      setPosts((p) => p.filter((post) => post.id !== id));
      toast.success('✅ Post approved and published!');
    } catch { toast.error('Failed to approve'); }
  };

  const skip = async (id: string) => {
    try {
      await adminApi.posts.skip(id);
      setPosts((p) => p.filter((post) => post.id !== id));
      toast.success('Skipped');
    } catch { toast.error('Failed to skip'); }
  };

  const deletePost = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await adminApi.posts.delete(id);
      setPosts((p) => p.filter((post) => post.id !== id));
      toast.success('Deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const bulkApprove = async () => {
    if (selected.length === 0) return;
    try {
      const { approved } = await adminApi.posts.bulkApprove(selected);
      setPosts((p) => p.filter((post) => !selected.includes(post.id)));
      setSelected([]);
      toast.success(`✅ ${approved} posts approved!`);
    } catch { toast.error('Bulk approve failed'); }
  };

  const bulkDelete = async () => {
    if (selected.length === 0) return;
    if (!window.confirm(`Skip & hide ${selected.length} posts? They won't re-appear on next fetch.`)) return;
    try {
      await adminApi.posts.bulkDelete(selected);
      setPosts((p) => p.filter((post) => !selected.includes(post.id)));
      setSelected([]);
      toast.success(`⏭ ${selected.length} posts skipped & hidden!`);
    } catch { toast.error('Bulk skip had some errors'); }
  };

  const openModal = (post: Post) => {
    setActivePost(post);
    setCommentary('');
    setEditTitle(post.title);
    setEditSnippet(post.snippet || '');
    setEditCategory(post.category);
    setModalOpen(true);
  };

  const handleModalApprove = async () => {
    if (!activePost) return;
    await approve(activePost.id, {
      admin_commentary: commentary,
      title: editTitle,
      snippet: editSnippet,
      category: editCategory,
    });
    setModalOpen(false);
  };

  // Sort by source if selected (client-side only, as backend doesn't support this text based sort easily)
  const sorted = sortFilter === 'source'
    ? [...posts].sort((a, b) => (a.source_name || '').localeCompare(b.source_name || ''))
    : posts;

  const toggle = (id: string) => setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);

  return (
    <div className="flex min-h-screen">
      <AdminSidebar pendingCount={posts.length} />

      <main className="flex-1 lg:ml-56 p-3 lg:p-6 w-full max-w-[100vw] lg:max-w-none overflow-y-auto">
        <AdminTopBar
          title="Pending Queue"
          subtitle={`${totalCount} total articles • Page ${page} of ${totalPages}`}
          actions={
            <div className="flex gap-2">
              {selected.length > 0 && (
                <>
                  <button onClick={bulkApprove} className="admin-btn-success text-xs">
                    ✅ Approve {selected.length} Selected
                  </button>
                  <button onClick={bulkDelete} className="admin-btn-danger text-xs">
                    ⏭ Skip {selected.length} Selected
                  </button>
                </>
              )}
              {totalCount > 50 && limit === 50 && (
                <button
                  onClick={() => { setLimit(500); setPage(1); }}
                  className="admin-btn-primary text-xs"
                  title="Load more articles for better search"
                >
                  📄 Load All ({totalCount})
                </button>
              )}
              {limit > 50 && (
                <button
                  onClick={() => { setLimit(50); setPage(1); }}
                  className="admin-btn-ghost text-xs"
                >
                  📄 Show 50 per page
                </button>
              )}
              <button
                onClick={async () => { toast.loading('Fetching feeds…'); await adminApi.feeds.fetchAll(); toast.dismiss(); toast.success('Done!'); loadPosts(); }}
                className="admin-btn-ghost text-xs"
              >
                🔄 Fetch Now
              </button>
            </div>
          }
        />

        {/* Filter bar */}
        <div className="flex gap-3 mb-4 flex-wrap">
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search by title, source, snippet, or category..."
            className="admin-input flex-1 max-w-xs text-xs"
          />

          {/* Category filter */}
          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value as CategoryFilter); setPage(1); }}
            className="admin-input text-xs"
          >
            <option value="all">All Categories</option>
            <option value="Breaking News">Breaking News</option>
            <option value="Product Launch">Product Launch</option>
            <option value="Research">Research</option>
            <option value="Funding">Funding</option>
            <option value="Tools">Tools</option>
            <option value="Tutorials">Tutorials</option>
            <option value="General">General</option>
          </select>

          {/* Time filter */}
          <select
            value={timeFilter}
            onChange={(e) => { setTimeFilter(e.target.value as TimeFilter); setPage(1); }}
            className="admin-input text-xs"
          >
            <option value="all">All Time</option>
            <option value="1h">Last Hour</option>
            <option value="6h">Last 6 Hours</option>
            <option value="24h">Last 24 Hours (Default)</option>
          </select>

          {/* Sort filter */}
          <select
            value={sortFilter}
            onChange={(e) => { setSortFilter(e.target.value as SortFilter); setPage(1); }}
            className="admin-input text-xs"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="source">By Source</option>
          </select>

          {sorted.length > 0 && (
            <button
              onClick={() => {
                if (selected.length > 0) {
                  setSelected([]);
                } else {
                  setSelected(sorted.map(p => p.id));
                }
              }}
              className="admin-btn-ghost text-xs"
            >
              {selected.length > 0 ? 'Clear Selection' : `Select All on Page (${sorted.length})`}
            </button>
          )}
        </div>

        {/* Search info */}
        {debouncedFilter && (
          <div className="mb-3 text-xs text-text-muted bg-background-elevated border border-border rounded p-2">
            💡 Found {totalCount} matching articles for "{debouncedFilter}".
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <div key={i} className="admin-card animate-pulse h-28" />)}
          </div>
        ) : posts.length === 0 ? (
          <div className="admin-card text-center py-16">
            <div className="text-4xl mb-3">🎉</div>
            <h2 className="font-bold text-lg mb-1">Queue is empty!</h2>
            <p className="text-text-secondary text-sm">All caught up. New posts arrive every 2 hours.</p>
          </div>
        ) : (
          <>
            <div className="mb-3 flex items-center justify-between">
              <div className="text-xs text-text-muted">
                Showing {sorted.length} of {posts.length} articles on this page
              </div>
              <div className="text-xs font-medium text-text-secondary">
                Total in queue: {totalCount}
              </div>
            </div>
            <div className="space-y-3">
              {sorted.map((post) => (
              <div
                key={post.id}
                className={`admin-card flex gap-4 transition-all ${selected.includes(post.id) ? 'border-primary/40 bg-primary/5' : ''}`}
              >
                {/* Select checkbox */}
                <input
                  type="checkbox"
                  checked={selected.includes(post.id)}
                  onChange={() => toggle(post.id)}
                  className="mt-1 accent-primary"
                />

                {/* Thumbnail */}
                {post.thumbnail && (
                  <div className="w-20 h-16 rounded-lg overflow-hidden shrink-0 bg-background-elevated">
                    <Image src={post.thumbnail} alt="" width={80} height={64} className="w-full h-full object-cover" unoptimized />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="admin-badge bg-primary/15 text-primary border border-primary/20 text-[10px]">{post.category}</span>
                    <span className="text-[10px] text-text-muted">{post.source_name}</span>
                    <span className="text-[10px] text-text-muted ml-auto">{timeAgo(post.created_at)}</span>
                  </div>
                  <p className="text-sm font-medium line-clamp-1 mb-1">{post.title}</p>
                  <p className="text-xs text-text-secondary line-clamp-2">{post.snippet}</p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-1.5 shrink-0">
                  <button onClick={() => openModal(post)} className="admin-btn-primary text-xs py-1 px-3">
                    ✏️ Edit & Approve
                  </button>
                  <button onClick={() => approve(post.id)} className="admin-btn-success text-xs py-1 px-3">
                    ✅ Quick Approve
                  </button>
                  <button onClick={() => skip(post.id)} className="admin-btn-ghost bg-background-elevated hover:bg-background-elevated/80 text-xs py-1 px-3">
                    ⏭ Skip
                  </button>
                  <button onClick={() => skip(post.id)} className="admin-btn-ghost bg-background-elevated hover:bg-background-elevated/80 text-xs py-1 px-3">
                    ⏭ Skip & Hide
                  </button>
                  {post.source_url && (
                    <a href={post.source_url} target="_blank" rel="noopener noreferrer" className="admin-btn-ghost text-xs py-1 px-3 text-center">
                      👁 Preview
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="admin-btn-ghost text-xs disabled:opacity-30"
              >
                ← Previous
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                        page === pageNum
                          ? 'bg-primary text-white'
                          : 'text-text-secondary hover:bg-background-elevated'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="admin-btn-ghost text-xs disabled:opacity-30"
              >
                Next →
              </button>
            </div>
          )}
          </>
        )}
      </main>

      {/* Edit & Commentary Modal */}
      {modalOpen && activePost && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}
        >
          <div className="admin-card w-full max-w-xl animate-fade-in space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold">Edit & Approve Post</h2>
              <button onClick={() => setModalOpen(false)} className="text-text-muted hover:text-white text-xl leading-none">×</button>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5">Title</label>
              <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="admin-input text-sm" />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5">Snippet</label>
              <textarea value={editSnippet} onChange={(e) => setEditSnippet(e.target.value)} rows={3} className="admin-input text-sm resize-none w-full" />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5">Category</label>
              <select value={editCategory} onChange={(e) => setEditCategory(e.target.value)} className="admin-input text-sm">
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5">Your Commentary <span className="text-text-muted">(optional — shown on site)</span></label>
              <textarea
                value={commentary}
                onChange={(e) => setCommentary(e.target.value)}
                placeholder="Add your editorial take on this article…"
                rows={4}
                className="admin-input text-sm resize-none w-full"
              />
            </div>

            <div className="flex gap-2">
              <button onClick={handleModalApprove} className="admin-btn-success flex-1 justify-center">✅ Approve & Publish</button>
              <button onClick={() => setModalOpen(false)} className="admin-btn-ghost">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
