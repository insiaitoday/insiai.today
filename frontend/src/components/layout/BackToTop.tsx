'use client';

import { useEffect, useState, useRef } from 'react';

export function BackToTop() {
  const [show, setShow] = useState(false);
  const rafRef = useRef<number | null>(null);
  const showRef = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) return; // throttle: one RAF per scroll burst
      rafRef.current = requestAnimationFrame(() => {
        const shouldShow = window.scrollY > 400;
        if (shouldShow !== showRef.current) {
          showRef.current = shouldShow;
          setShow(shouldShow);
        }
        rafRef.current = null;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (!show) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      className="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-110"
      style={{ background: 'linear-gradient(135deg, #0A66C2, #7C3AED)' }}
    >
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </button>
  );
}
