'use client';

import { useEffect, useState } from 'react';
import { requireSession } from '@/lib/auth';
import { adminApi } from '@/lib/api';
import { AdminSidebar } from '@/components/shell/AdminSidebar';
import { AdminTopBar } from '@/components/shell/AdminTopBar';
import type { Comment } from '@/types';
import toast from 'react-hot-toast';

function timeAgo(d: string) { const s=Math.floor((Date.now()-new Date(d).getTime())/1000); if(s<60)return`${s}s ago`; if(s<3600)return`${Math.floor(s/60)}m ago`; return`${Math.floor(s/86400)}d ago`; }

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [status,   setStatus]   = useState('pending');
  const [total,    setTotal]    = useState(0);

  const load = async (s = status) => {
    setLoading(true);
    try {
      const { comments: data, total: t } = await adminApi.comments.list({ status: s, limit: '50', page: '1' });
      setComments(data);
      setTotal(t || 0);
    } catch { toast.error('Failed to load comments'); }
    finally { setLoading(false); }
  };

  useEffect(() => { requireSession().then((s) => { if(s) load(); }); }, [status]);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await adminApi.comments.update(id, newStatus);
      setComments((c) => c.filter((x) => x.id !== id));
      toast.success(`Comment ${newStatus}`);
    } catch { toast.error('Failed'); }
  };

  const deleteComment = async (id: string) => {
    if (!confirm('Delete this comment permanently?')) return;
    try {
      await adminApi.comments.delete(id);
      setComments((c) => c.filter((x) => x.id !== id));
      toast.success('Deleted');
    } catch { toast.error('Failed'); }
  };

  const tabs = ['pending', 'approved', 'spam'];

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 lg:ml-56 p-3 lg:p-6 w-full max-w-[100vw] lg:max-w-none overflow-y-auto">
        <AdminTopBar title="Comment Moderation" subtitle={`${total} ${status} comments`} />

        {/* Status tabs */}
        <div className="flex gap-1 p-1 bg-background-surface rounded-xl w-fit mb-5 border border-border">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setStatus(t)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${status === t ? 'bg-primary text-white' : 'text-text-secondary hover:text-white'}`}
            >
              {t === 'pending' ? '⏳ ' : t === 'approved' ? '✅ ' : '🚫 '}{t}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">{Array(5).fill(null).map((_,i) => <div key={i} className="admin-card animate-pulse h-20" />)}</div>
        ) : comments.length === 0 ? (
          <div className="admin-card text-center py-16">
            <div className="text-4xl mb-3">{status==='pending'?'🎉':'💬'}</div>
            <h2 className="font-bold mb-1">No {status} comments</h2>
            <p className="text-text-secondary text-sm">{status==='pending'?'All caught up!':'Nothing to show here.'}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {comments.map((c) => (
              <div key={c.id} className="admin-card">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Meta */}
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-sm font-semibold">{c.author_name}</span>
                      <span className="text-xs text-text-muted">{c.author_email}</span>
                      <span className="text-xs text-text-muted">•</span>
                      <span className="text-xs text-text-muted">{timeAgo(c.created_at)}</span>
                      {c.posts && (
                        <>
                          <span className="text-xs text-text-muted">on</span>
                          <a href={`/news/${c.posts.slug}`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline truncate max-w-[150px]">
                            {c.posts.title}
                          </a>
                        </>
                      )}
                      {c.parent_id && <span className="admin-badge bg-accent/15 text-accent border border-accent/20 text-[10px]">Reply</span>}
                    </div>
                    {/* Content */}
                    <p className="text-sm text-text-secondary leading-relaxed">{c.content}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-1.5 shrink-0">
                    {status !== 'approved' && (
                      <button onClick={() => updateStatus(c.id, 'approved')} className="admin-btn-success text-xs py-1 px-3">✅ Approve</button>
                    )}
                    {status !== 'spam' && (
                      <button onClick={() => updateStatus(c.id, 'spam')} className="admin-btn-warning text-xs py-1 px-3">🚫 Spam</button>
                    )}
                    <button onClick={() => deleteComment(c.id)} className="admin-btn-danger text-xs py-1 px-3">🗑 Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
