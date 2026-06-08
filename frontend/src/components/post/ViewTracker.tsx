'use client';

import { useEffect } from 'react';

interface ViewTrackerProps {
  slug: string;
}

/** Generate a UUID v4 without any external dependency */
function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/** Get or create a persistent session ID stored in localStorage */
function getOrCreateSessionId(): string {
  try {
    const key = 'insiai_session_id';
    let id = localStorage.getItem(key);
    if (!id) {
      id = generateUUID();
      localStorage.setItem(key, id);
    }
    return id;
  } catch {
    // localStorage not available (SSR / private browsing)
    return generateUUID();
  }
}

export function ViewTracker({ slug }: ViewTrackerProps) {
  useEffect(() => {
    // Track view after component mounts (user actually viewed the page)
    const trackView = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
        const sessionId = getOrCreateSessionId();

        // Generate a simple browser fingerprint from available signals
        const fingerprint = [
          navigator.language,
          screen.width,
          screen.height,
          navigator.platform || '',
          Intl.DateTimeFormat().resolvedOptions().timeZone,
        ].join('|');

        const response = await fetch(`${API_URL}/api/posts/${slug}/view`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            sessionId,
            fingerprint,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log(`[ViewTracker] Tracked view for "${slug}":`, data);
        } else {
          const err = await response.json().catch(() => ({}));
          console.warn(`[ViewTracker] View not counted for "${slug}":`, err);
        }
      } catch (error) {
        console.error('[ViewTracker] Failed to track view:', error);
      }
    };

    // Delay tracking by 3 seconds to ensure user is actually reading
    const timer = setTimeout(trackView, 3000);
    return () => clearTimeout(timer);
  }, [slug]);

  return null; // This component renders nothing
}
