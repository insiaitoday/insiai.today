'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { requireSession } from '@/lib/auth';
import { adminApi } from '@/lib/api';
import { AdminSidebar } from '@/components/shell/AdminSidebar';
import { AdminTopBar } from '@/components/shell/AdminTopBar';
import type { Post } from '@/types';
import toast from 'react-hot-toast';

function formatNumber(n: number) { return n >= 1000 ? `${(n/1000).toFixed(1)}k` : String(n); }
function timeAgo(d: string) { const s = Math.floor((Date.now()-new Date(d).getTime())/1000); if(s<3600)return`${Math.floor(s/60)}m ago`; if(s<86400)return`${Math.floor(s/3600)}h ago`; return`${Math.floor(s/86400)}d ago`; }

export default function PublishedPage() {
  const [posts,   setPosts]   = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [type,    setType]    = useState('');
  const [search,  setSearch]  = useState('');
  const [timeFilter, setTimeFilter] = useState('');
  const [page,    setPage]    = useState(1);
  const [total,   setTotal]   = useState(0);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const LIMIT = 20;

  const load = async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { status: 'published', sort: 'new', page, limit: LIMIT };
      if (type) params.type = type;
      if (timeFilter) {
        const d = new Date();
        if (timeFilter === '24h') d.setHours(d.getHours() - 24);
        if (timeFilter === '7d') d.setDate(d.getDate() - 7);
        if (timeFilter === '30d') d.setDate(d.getDate() - 30);
        params.since = d.toISOString();
      }
      const { posts: data, pagination } = await adminApi.posts.list(params);
      setPosts(data);
      setTotal(pagination.total);
    } catch { toast.error('Failed to load posts'); }
    finally { setLoading(false); setSelected(new Set()); }
  };

  useEffect(() => { requireSession().then((s) => { if(s) load(); }); }, [type, page, timeFilter]);

  const deletePost = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    try {
      await adminApi.posts.delete(id);
      setPosts((p) => p.filter((x) => x.id !== id));
      toast.success('Post deleted');
    } catch { toast.error('Delete failed'); }
  };

  const bulkDelete = async () => {
    if (selected.size === 0) return;
    if (!confirm(`Delete ${selected.size} selected post(s)?`)) return;
    setLoading(true);
    let successCount = 0;
    try {
      await Promise.all(
        Array.from(selected).map(async (id) => {
          await adminApi.posts.delete(id);
          successCount++;
        })
      );
      toast.success(`Deleted ${successCount} posts`);
    } catch {
      toast.error(`Deleted ${successCount} posts before an error occurred`);
    } finally {
      setSelected(new Set());
      load();
    }
  };

  const toggleFeature = async (id: string) => {
    try {
      const updated = await adminApi.posts.feature(id);
      setPosts((p) => p.map((x) => x.id === id ? updated : x));
      toast.success(updated.featured ? '⭐ Featured!' : 'Unfeatured');
    } catch { toast.error('Failed'); }
  };

  const filtered = search
    ? posts.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
    : posts;

  const toggleSelect = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const toggleAll = () => {
    if (selected.size === filtered.length && filtered.length > 0) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map(p => p.id)));
    }
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 lg:ml-56 p-3 lg:p-6 w-full max-w-[100vw] lg:max-w-none overflow-y-auto">
        <AdminTopBar
          title="Published Posts"
          subtitle={`${total} total posts`}
          actions={<Link href="/articles/new" className="admin-btn-primary text-xs">✍️ New Article</Link>}
        />

        {/* Filters */}
        <div className="flex gap-3 mb-5 flex-wrap items-center">
          <input
            type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search posts…" className="admin-input text-xs max-w-xs"
          />
          <select 
            value={timeFilter} 
            onChange={(e) => { setTimeFilter(e.target.value); setPage(1); }}
            className="admin-input text-xs w-auto"
          >
            <option value="">All Time</option>
            <option value="24h">Past 24 Hours</option>
            <option value="7d">Past 7 Days</option>
            <option value="30d">Past 30 Days</option>
          </select>
          <div className="flex gap-1">
            {['', 'rss', 'article'].map((t) => (
              <button
                key={t}
                onClick={() => { setType(t); setPage(1); }}
                className={`admin-btn text-xs ${type === t ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
              >
                {t === '' ? 'All' : t === 'rss' ? '📰 RSS' : '✍️ Articles'}
              </button>
            ))}
          </div>

          {selected.size > 0 && (
            <button onClick={bulkDelete} className="admin-btn-danger text-xs ml-auto font-medium">
              🗑️ Delete Selected ({selected.size})
            </button>
          )}
        </div>

        {/* Table */}
        <div className="admin-card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-background-elevated">
                <th className="text-left px-4 py-3 text-xs text-text-secondary font-medium w-10">
                  <input 
                    type="checkbox" 
                    checked={filtered.length > 0 && selected.size === filtered.length}
                    onChange={toggleAll}
                    className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                  />
                </th>
                <th className="text-left px-4 py-3 text-xs text-text-secondary font-medium">Post</th>
                <th className="text-left px-4 py-3 text-xs text-text-secondary font-medium hidden md:table-cell">Category</th>
                <th className="text-left px-4 py-3 text-xs text-text-secondary font-medium hidden lg:table-cell">Type</th>
                <th className="text-right px-4 py-3 text-xs text-text-secondary font-medium">Views</th>
                <th className="text-right px-4 py-3 text-xs text-text-secondary font-medium">Votes</th>
                <th className="text-right px-4 py-3 text-xs text-text-secondary font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array(5).fill(null).map((_, i) => (
                    <tr key={i} className="table-row"><td colSpan={7} className="px-4 py-3"><div className="skeleton-line w-full" /></td></tr>
                  ))
                : filtered.map((post) => (
                    <tr key={post.id} className={`table-row ${selected.has(post.id) ? 'bg-primary/5' : ''}`}>
                      <td className="px-4 py-3">
                        <input 
                          type="checkbox" 
                          checked={selected.has(post.id)}
                          onChange={() => toggleSelect(post.id)}
                          className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-start gap-1">
                          {post.featured && <span title="Featured" className="text-warning">⭐</span>}
                          <div>
                            <p className="text-xs font-medium line-clamp-1 max-w-xs">{post.title}</p>
                            <p className="text-[10px] text-text-muted">{timeAgo(post.published_at || post.created_at)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="admin-badge bg-background-elevated text-text-secondary border border-border text-[10px]">{post.category}</span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className={`admin-badge text-[10px] ${post.type === 'article' ? 'bg-accent/15 text-accent border border-accent/20' : 'bg-primary/15 text-primary border border-primary/20'}`}>
                          {post.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-xs text-text-secondary">{formatNumber(post.view_count)}</td>
                      <td className="px-4 py-3 text-right text-xs">
                        <span className="text-success">▲{post.upvotes}</span>
                        <span className="text-text-muted mx-1">/</span>
                        <span className="text-danger">▼{post.downvotes}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 justify-end flex-wrap">
                          <button onClick={() => toggleFeature(post.id)} className="admin-btn-ghost text-[10px] py-0.5 px-2" title="Toggle featured">
                            {post.featured ? '★' : '☆'}
                          </button>
                          <Link href={`/articles/${post.id}/edit`} className="admin-btn-ghost text-[10px] py-0.5 px-2">Edit</Link>
                          <a href={post.type === 'article' ? `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/articles/${post.slug}` : `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/news/${post.slug}`} target="_blank" rel="noopener noreferrer" className="admin-btn-ghost text-[10px] py-0.5 px-2">View</a>
                          <button onClick={() => deletePost(post.id)} className="admin-btn-danger text-[10px] py-0.5 px-2">Del</button>
                        </div>
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {total > LIMIT && (
          <div className="flex justify-center gap-2 mt-6">
            {page > 1 && <button onClick={() => setPage(p => p-1)} className="admin-btn-ghost text-xs">← Previous</button>}
            <span className="admin-btn-ghost text-xs cursor-default">Page {page} of {Math.ceil(total/LIMIT)}</span>
            {page < Math.ceil(total/LIMIT) && <button onClick={() => setPage(p => p+1)} className="admin-btn-primary text-xs">Next →</button>}
          </div>
        )}
      </main>
    </div>
  );
}
