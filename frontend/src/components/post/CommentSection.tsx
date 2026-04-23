'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { timeAgo } from '@/lib/utils';
import type { Comment } from '@/types';
import toast from 'react-hot-toast';
import { ShareButtons } from './ShareButtons';
import { VoteButtons } from './VoteButtons';

interface CommentSectionProps {
  postId: string;
  onCommentSubmitted?: () => void;
}

export function CommentSection({ postId, onCommentSubmitted }: CommentSectionProps) {
  const [comments,  setComments]  = useState<Comment[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [name,      setName]      = useState('');
  const [email,     setEmail]     = useState('');
  const [content,   setContent]   = useState('');
  const [parentId,  setParentId]  = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const [replyTo,   setReplyTo]   = useState<string | null>(null);

  useEffect(() => {
    api.comments.list(postId)
      .then(setComments)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !content) return;
    setSubmitting(true);

    try {
      await api.comments.create(postId, { author_name: name, author_email: email, content, parent_id: parentId });
      toast.success('Comment submitted! It will appear after moderation.');
      setContent('');
      setReplyTo(null);
      setParentId(undefined);
      if (onCommentSubmitted) {
        onCommentSubmitted();
      }
    } catch (err: unknown) {
      toast.error((err as Error)?.message || 'Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const totalComments = comments.reduce((sum, c) => sum + 1 + (c.replies?.length || 0), 0);

  return (
    <section className="mt-4" id="comments">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        Comments
        {totalComments > 0 && (
          <span className="text-sm font-normal text-text-muted">({totalComments})</span>
        )}
      </h2>

      {/* Comment form */}
      <form onSubmit={handleSubmit} className="card p-5 mb-6">
        <h3 className="font-semibold text-sm mb-3 text-text-secondary">
          {replyTo ? '↩ Replying to a comment' : 'Leave a comment'}
          {replyTo && (
            <button
              type="button"
              onClick={() => { setReplyTo(null); setParentId(undefined); }}
              className="ml-2 text-xs text-primary hover:underline"
            >
              Cancel reply
            </button>
          )}
        </h3>

        <div className="grid sm:grid-cols-2 gap-3 mb-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name *"
            className="input text-sm"
            required
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com * (not published)"
            className="input text-sm"
            required
          />
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your thoughts…"
          rows={4}
          className="input text-sm resize-none w-full mb-3"
          required
          maxLength={2000}
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-muted">{content.length}/2000</span>
          <button type="submit" disabled={submitting} className="btn-primary text-sm">
            {submitting ? 'Posting…' : 'Post Comment'}
          </button>
        </div>
      </form>

      {/* Comments list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="card p-4">
              <div className="flex gap-3">
                <div className="skeleton w-9 h-9 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-3 w-32 rounded" />
                  <div className="skeleton h-3 w-full rounded" />
                  <div className="skeleton h-3 w-3/4 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-10 text-text-muted">
          <svg className="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p>No comments yet — be the first!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={(id) => { setReplyTo(id); setParentId(id); document.querySelector('textarea')?.focus(); }}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function CommentItem({ comment, onReply, depth = 0 }: { comment: Comment; onReply: (id: string) => void; depth?: number }) {
  const initials = comment.author_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  const commentUrl = typeof window !== 'undefined' ? `${window.location.href}#comment-${comment.id}` : '';

  return (
    <div id={`comment-${comment.id}`} className={`${depth > 0 ? 'ml-8 border-l-2 border-border pl-4' : 'card p-4'}`}>
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 border border-border flex items-center justify-center shrink-0 text-xs font-bold text-primary">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-semibold text-sm text-text-primary">{comment.author_name}</span>
            <span className="text-xs text-text-muted">{timeAgo(comment.created_at)}</span>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed mb-2">{comment.content}</p>

          {/* Comment actions */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => onReply(comment.id)}
              className="text-xs text-text-muted hover:text-primary transition-colors"
            >
              ↩ Reply
            </button>
            {commentUrl && (
              <div className="flex items-center gap-1">
                <ShareButtons
                  title={`Comment by ${comment.author_name}`}
                  url={commentUrl}
                  text={`"${comment.content.slice(0, 100)}${comment.content.length > 100 ? '...' : ''}"`}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Nested replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} onReply={onReply} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
