'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { requireSession } from '@/lib/auth';
import { adminApi } from '@/lib/api';
import { AdminSidebar } from '@/components/shell/AdminSidebar';
import { AdminTopBar } from '@/components/shell/AdminTopBar';
import type { Post } from '@/types';
import toast from 'react-hot-toast';

function timeAgo(d: string) {
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export default function DraftsPage() {
  const [posts,   setPosts]   = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const { posts: data } = await adminApi.posts.list({ status: 'draft', sort: 'new', page: 1, limit: 50 });
      setPosts(data);
    } catch {
      toast.error('Failed to load drafts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { requireSession().then((s) => { if (s) load(); }); }, []);

  const deletePost = async (id: string) => {
    if (!confirm('Delete this draft permanently?')) return;
    try {
      await adminApi.posts.delete(id);
      setPosts((p) => p.filter((x) => x.id !== id));
      toast.success('Draft deleted');
    } catch { toast.error('Delete failed'); }
  };

  const publishDraft = async (id: string) => {
    try {
      await adminApi.posts.update(id, { status: 'published', published_at: new Date().toISOString() } as Partial<Post>);
      setPosts((p) => p.filter((x) => x.id !== id));
      toast.success('🎉 Published!');
    } catch { toast.error('Publish failed'); }
  };

  const filtered = search
    ? posts.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
    : posts;

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 lg:ml-56 p-3 lg:p-6 w-full max-w-[100vw] lg:max-w-none overflow-y-auto">
        <AdminTopBar
          title="Drafts"
          subtitle={`${posts.length} saved draft${posts.length !== 1 ? 's' : ''}`}
          actions={<Link href="/articles/new" className="admin-btn-primary text-xs">✍️ New Article</Link>}
        />

        {/* Search */}
        <div className="mb-5">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search drafts…"
            className="admin-input text-xs max-w-xs"
          />
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <div key={i} className="admin-card animate-pulse h-20" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="admin-card text-center py-16">
            <div className="text-4xl mb-3">📝</div>
            <h2 className="font-bold text-lg mb-1">No drafts yet</h2>
            <p className="text-text-secondary text-sm mb-4">Write a new article and save it as a draft to see it here.</p>
            <Link href="/articles/new" className="admin-btn-primary text-sm">✍️ Write New Article</Link>
          </div>
        ) : (
          <div className="admin-card p-0 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-background-elevated">
                  <th className="text-left px-4 py-3 text-xs text-text-secondary font-medium">Title</th>
                  <th className="text-left px-4 py-3 text-xs text-text-secondary font-medium hidden md:table-cell">Category</th>
                  <th className="text-left px-4 py-3 text-xs text-text-secondary font-medium hidden md:table-cell">Last Modified</th>
                  <th className="text-right px-4 py-3 text-xs text-text-secondary font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((post) => (
                  <tr key={post.id} className="table-row">
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-xs font-medium line-clamp-1 max-w-xs">{post.title}</p>
                        {post.snippet && (
                          <p className="text-[10px] text-text-muted line-clamp-1 max-w-xs mt-0.5">{post.snippet}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="admin-badge bg-background-elevated text-text-secondary border border-border text-[10px]">
                        {post.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-xs text-text-muted">
                      {timeAgo(post.updated_at || post.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <Link
                          href={`/articles/${post.id}/edit`}
                          className="admin-btn-ghost text-[10px] py-0.5 px-2"
                        >
                          ✏️ Edit
                        </Link>
                        <button
                          onClick={() => publishDraft(post.id)}
                          className="admin-btn-success text-[10px] py-0.5 px-2"
                        >
                          🚀 Publish
                        </button>
                        <button
                          onClick={() => deletePost(post.id)}
                          className="admin-btn-danger text-[10px] py-0.5 px-2"
                        >
                          🗑 Del
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
