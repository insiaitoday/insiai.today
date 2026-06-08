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

  // ── Compact variant ─────────────────────────────────────────────────────────
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

  // ── Featured hero variant ───────────────────────────────────────────────────
  if (variant === 'featured') {
    return (
      <Link
        href={postUrl}
        className="block group relative overflow-hidden rounded-2xl shadow-xl"
        style={{ animationDelay: `${index * 0.05}s` }}
      >
        {/* Image / placeholder */}
        <div className="aspect-[21/9] sm:aspect-[3/1] md:aspect-[21/8] w-full bg-background-elevated relative z-0">
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
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
              <svg className="w-20 h-20 text-text-muted opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
          )}
        </div>

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent pointer-events-none" />

        {/* Top-left: type label */}
        <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
          {isArticle ? (
            <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-accent text-white shadow-lg">
              ✍️ Original Article
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-primary text-white shadow-lg animate-pulse-slow">
              📡 Latest News
            </span>
          )}
          {mounted && isNew && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500 text-white shadow">
              NEW
            </span>
          )}
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 z-10">
          {/* Category + source */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className={`badge border text-xs ${catClass}`}>{post.category}</span>
            {!isArticle && post.source_name && (
              <span className="text-white/60 text-xs">{post.source_name}</span>
            )}
          </div>

          {/* Title */}
          <h2 className="text-white font-bold text-lg sm:text-xl md:text-2xl leading-snug line-clamp-2 group-hover:text-primary/90 transition-colors mb-2">
            {post.title}
          </h2>

          {/* Snippet — show on md+ */}
          {post.snippet && (
            <p className="hidden md:block text-white/60 text-sm line-clamp-1 mb-3">
              {truncate(post.snippet, 140)}
            </p>
          )}

          {/* Meta row */}
          <div className="flex items-center gap-3 text-white/50 text-xs flex-wrap">
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {timeAgo(post.published_at || post.created_at)}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
              {formatNumber((post.upvotes || 0) - (post.downvotes || 0))} votes
            </span>
            {post.comment_count ? (
              <>
                <span>•</span>
                <span>💬 {post.comment_count}</span>
              </>
            ) : null}
          </div>
        </div>

        {/* Right arrow CTA */}
        <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm group-hover:bg-primary group-hover:border-primary transition-all duration-300 z-10">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </Link>
    );
  }

  // ── Default card ─────────────────────────────────────────────────────────────
  return (
    <article
      className={`card overflow-hidden${index < 8 ? ' animate-slide-up' : ''}`}
      style={index < 8 ? { animationDelay: `${index * 0.04}s` } : undefined}
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

            {isArticle ? (
              <span className="badge bg-accent/20 border border-accent/30 text-accent text-[10px] sm:text-xs">
                ✍️ Original
              </span>
            ) : post.source_name ? (
              <span className={`text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full ${sourceClass}`}>
                {post.source_name}
              </span>
            ) : null}

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
                Read Article →
              </Link>
            ) : (
              <>
                <Link href={postUrl} className="btn-ghost text-xs px-3 py-1.5">
                  Full Story
                </Link>
                {post.source_url && (
                  <a
                    href={post.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-text-muted hover:text-primary transition-colors"
                  >
                    Source
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </>
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
          <div className="hidden sm:block w-28 md:w-40 shrink-0">
            <Link href={postUrl} className="block h-full" tabIndex={-1} aria-hidden>
              <div className="h-full min-h-[110px] bg-[#F5F6F8] overflow-hidden rounded-r-xl relative flex items-center justify-center">
                <Image
                  src={post.thumbnail}
                  alt=""
                  width={160}
                  height={120}
                  className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
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
