'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Post } from '@/types';
import { timeAgo, getCategoryClass, getSourceClass, formatNumber, getPostUrl, truncate } from '@/lib/utils';
import { VoteButtons } from '@/components/post/VoteButtons';
import { CommentSection } from '@/components/post/CommentSection';

interface PostCardProps {
  post: Post;
  variant?: 'default' | 'compact' | 'featured';
  index?: number;
}

export function PostCard({ post, variant = 'default', index = 0 }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  // Delay isNew check to client-only to avoid hydration mismatch
  const [isNew, setIsNew] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const date = post.published_at || post.created_at;
    try {
      const ms = Date.now() - new Date(date).getTime();
      setIsNew(ms < 6 * 60 * 60 * 1000);
    } catch {
      setIsNew(false);
    }
  }, [post.published_at, post.created_at]);

  const postUrl     = getPostUrl(post);
  const catClass    = getCategoryClass(post.category);
  const sourceClass = getSourceClass(post.source_name || '');
  const isArticle   = post.type === 'article';

  if (variant === 'compact') {
    return (
      <Link href={postUrl} className="flex gap-3 py-3 group">
        {post.thumbnail && (
          <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-background-elevated">
            <Image
              src={post.thumbnail}
              alt=""
              width={64}
              height={64}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              unoptimized
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text-primary line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className={`badge border text-[10px] ${catClass}`}>{post.category}</span>
            <span className="text-text-muted text-xs">{timeAgo(post.published_at || post.created_at)}</span>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'featured') {
    return (
      <Link href={postUrl} className="block group relative overflow-hidden rounded-2xl" style={{ animationDelay: `${index * 0.05}s` }}>
        <div className="aspect-video w-full bg-background-elevated relative">
          {post.thumbnail ? (
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              unoptimized
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
              <svg className="w-16 h-16 text-text-muted opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className={`badge border text-xs ${catClass}`}>{post.category}</span>
            {isArticle && <span className="badge bg-accent/20 border border-accent/30 text-accent text-xs">Original</span>}
            {/* isNew only shown after mount to avoid hydration */}
            {mounted && isNew && (
              <span className="badge text-xs font-bold" style={{ background: '#EF4444', color: '#fff' }}>NEW</span>
            )}
          </div>
          <h2 className="text-white font-bold text-xl md:text-2xl leading-snug line-clamp-2 group-hover:text-primary/90 transition-colors">
            {post.title}
          </h2>
          <div className="flex items-center gap-3 mt-2 text-white/60 text-xs flex-wrap">
            <span>{formatNumber((post.upvotes || 0) - (post.downvotes || 0))} votes</span>
            <span>•</span>
            <span>{timeAgo(post.published_at || post.created_at)}</span>
            {post.source_name && <><span>•</span><span>{post.source_name}</span></>}
          </div>
        </div>
      </Link>
    );
  }

  // ── Default card ─────────────────────────────────────────────
  return (
    <article
      className="card animate-slide-up overflow-hidden"
      style={{ animationDelay: `${index * 0.04}s` }}
    >
      <div className="flex">
        {/* Vote sidebar */}
        <div className="flex flex-col items-center justify-start gap-1 p-3 pr-0 shrink-0">
          <VoteButtons postId={post.id} upvotes={post.upvotes} downvotes={post.downvotes} />
        </div>

        {/* Main content */}
        <div className="flex-1 p-3 sm:p-4 min-w-0">

          {/* Meta row */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className={`badge border text-[10px] sm:text-xs ${catClass}`}>{post.category}</span>

            {isArticle
              ? <span className="badge bg-accent/20 border border-accent/30 text-accent text-[10px] sm:text-xs">Original</span>
              : post.source_name && (
                  <span className={`text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full ${sourceClass}`}>
                    {post.source_name}
                  </span>
                )
            }

            {/* Only shown client-side to prevent hydration mismatch */}
            {mounted && isNew && (
              <span
                className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                style={{ background: '#FEE2E2', color: '#DC2626', letterSpacing: '0.05em' }}
              >
                NEW
              </span>
            )}

            <span className="text-text-muted text-[10px] sm:text-xs ml-auto">
              {timeAgo(post.published_at || post.created_at)}
            </span>
          </div>

          {/* Title */}
          <Link href={postUrl}>
            <h2 className="font-semibold text-sm sm:text-base text-text-primary hover:text-primary transition-colors line-clamp-2 mb-1.5 cursor-pointer leading-snug">
              {post.title}
            </h2>
          </Link>

          {/* Snippet */}
          {post.snippet && (
            <p className="text-text-secondary text-xs sm:text-sm line-clamp-2 mb-3 leading-relaxed">
              {truncate(post.snippet, 180)}
            </p>
          )}

          {/* Action row */}
          <div className="flex items-center gap-2 sm:gap-3 pt-2 border-t border-border/50 flex-wrap">
            {isArticle ? (
              <Link href={postUrl} className="btn-primary text-xs px-3 py-1.5">
                Read →
              </Link>
            ) : (
              <a
                href={post.source_url || postUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost text-xs px-3 py-1.5 flex items-center gap-1"
              >
                Read Source
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}

            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-1.5 text-xs text-text-muted hover:text-primary transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="hidden sm:inline">
                {showComments ? 'Hide' : post.comment_count ? `Comments (${post.comment_count})` : 'Comments'}
              </span>
              <span className="sm:hidden flex items-center gap-1">
                💬 {post.comment_count ? post.comment_count : ''}
              </span>
            </button>

            <span className="text-[10px] sm:text-xs text-text-muted ml-auto flex items-center gap-1">
              <svg className="w-3 h-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {formatNumber(post.view_count || 0)}
            </span>
          </div>
        </div>

        {/* Thumbnail */}
        {post.thumbnail && (
          <div className="hidden sm:block w-24 md:w-36 shrink-0">
            <Link href={postUrl} className="block h-full" tabIndex={-1} aria-hidden>
              <div className="h-full min-h-[100px] bg-background-elevated overflow-hidden rounded-r-xl relative">
                <Image
                  src={post.thumbnail}
                  alt=""
                  width={144}
                  height={108}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  unoptimized
                />
              </div>
            </Link>
          </div>
        )}
      </div>

      {/* Expandable Comment Section */}
      {showComments && (
        <div className="border-t border-border/50 bg-background-surface/30 px-3 sm:px-4 pt-1 pb-4">
          <CommentSection postId={post.id} onCommentSubmitted={() => setShowComments(false)} />
        </div>
      )}
    </article>
  );
}
