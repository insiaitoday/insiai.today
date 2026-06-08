'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';

export function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();
  const rafRef = useRef<number | null>(null);

  // Only show on news/article pages
  const isArticlePage = pathname.startsWith('/news/') || pathname.startsWith('/articles/');

  useEffect(() => {
    if (!isArticlePage) { setProgress(0); setVisible(false); return; }

    const update = () => {
      if (rafRef.current) return; // throttle with RAF
      rafRef.current = requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (docHeight <= 0) { setVisible(false); rafRef.current = null; return; }
        const pct = Math.min(100, (scrollTop / docHeight) * 100);
        setProgress(pct);
        setVisible(scrollTop > 80);
        rafRef.current = null;
      });
    };

    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', update);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isArticlePage]);

  if (!isArticlePage || !visible) return null;

  return (
    <div
      className="fixed top-0 left-0 z-[100] h-0.5 transition-none pointer-events-none"
      style={{
        width: `${progress}%`,
        background: 'linear-gradient(90deg, #0A66C2, #7C3AED)',
      }}
    />
  );
}
