'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface VoteButtonsProps {
  postId: string;
  upvotes: number;
  downvotes: number;
  orientation?: 'vertical' | 'horizontal';
}

export function VoteButtons({ postId, upvotes: initUp, downvotes: initDown, orientation = 'vertical' }: VoteButtonsProps) {
  const router = useRouter();
  const [upvotes,   setUpvotes]   = useState(initUp || 0);
  const [downvotes, setDownvotes] = useState(initDown || 0);
  const [myVote,    setMyVote]    = useState<'up' | 'down' | null>(null);
  const [loading,   setLoading]   = useState(false);

  useEffect(() => {
    api.votes.myVote(postId).then(({ vote }) => setMyVote(vote)).catch(() => {});
  }, [postId]);

  const handleVote = useCallback(async (type: 'up' | 'down') => {
    if (loading) return;
    setLoading(true);

    const prevVote    = myVote;
    const prevUp      = upvotes;
    const prevDown    = downvotes;

    // Optimistic update
    if (prevVote === type) {
      // Remove vote
      setMyVote(null);
      if (type === 'up')   setUpvotes(v => Math.max(0, v - 1));
      else                 setDownvotes(v => Math.max(0, v - 1));
    } else {
      // Change or add vote
      if (prevVote === 'up')    setUpvotes(v => Math.max(0, v - 1));
      if (prevVote === 'down')  setDownvotes(v => Math.max(0, v - 1));
      setMyVote(type);
      if (type === 'up')   setUpvotes(v => v + 1);
      else                 setDownvotes(v => v + 1);
    }

    try {
      await api.votes.cast(postId, type);
      router.refresh();
    } catch {
      // Rollback on error
      setUpvotes(prevUp);
      setDownvotes(prevDown);
      setMyVote(prevVote);
      toast.error('Vote failed');
    } finally {
      setLoading(false);
    }
  }, [postId, myVote, upvotes, downvotes, loading, router]);

  const isVertical = orientation === 'vertical';
  const score      = upvotes - downvotes;

  return (
    <div className={`flex ${isVertical ? 'flex-col items-center' : 'items-center flex-row'} gap-1.5`}>
      {/* Upvote */}
      <button
        onClick={() => handleVote('up')}
        disabled={loading}
        aria-label="Upvote"
        title="Upvote"
        className={`group relative p-2 rounded-lg transition-all duration-200 ${
          myVote === 'up'
            ? 'bg-success/15 text-success scale-110'
            : 'text-text-muted hover:text-success hover:bg-success/10 hover:scale-110'
        } disabled:opacity-50`}
      >
        <svg
          className="w-5 h-5 transition-transform duration-200"
          fill={myVote === 'up' ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>

        {/* Animation effect on vote */}
        {myVote === 'up' && (
          <span className="absolute inset-0 rounded-lg bg-success/20 animate-ping" />
        )}
      </button>

      {/* Score */}
      <span className={`text-sm font-bold tabular-nums min-w-[2rem] text-center ${
        score > 0  ? 'text-success' :
        score < 0  ? 'text-danger'  : 'text-text-muted'
      }`}>
        {score > 0 ? '+' : ''}{score}
      </span>

      {/* Downvote */}
      <button
        onClick={() => handleVote('down')}
        disabled={loading}
        aria-label="Downvote"
        title="Downvote"
        className={`group relative p-2 rounded-lg transition-all duration-200 ${
          myVote === 'down'
            ? 'bg-danger/15 text-danger scale-110'
            : 'text-text-muted hover:text-danger hover:bg-danger/10 hover:scale-110'
        } disabled:opacity-50`}
      >
        <svg
          className="w-5 h-5 transition-transform duration-200"
          fill={myVote === 'down' ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>

        {/* Animation effect on vote */}
        {myVote === 'down' && (
          <span className="absolute inset-0 rounded-lg bg-danger/20 animate-ping" />
        )}
      </button>
    </div>
  );
}
