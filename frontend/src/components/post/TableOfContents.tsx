'use client';

import { useEffect, useState } from 'react';

interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<HeadingItem[]>([]);
  const [active, setActive]     = useState('');

  useEffect(() => {
    // Parse headings from HTML content
    const parser = new DOMParser();
    const doc    = parser.parseFromString(content, 'text/html');
    const els    = Array.from(doc.querySelectorAll('h2, h3'));

    const items: HeadingItem[] = els.map((el, i) => {
      const id = el.id || `heading-${i}`;
      return { id, text: el.textContent || '', level: parseInt(el.tagName[1]) };
    });

    setHeadings(items);
  }, [content]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: '-20% 0% -70% 0%' }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <nav className="card p-4 sticky top-24">
      <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
        <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h10" />
        </svg>
        Table of Contents
      </h3>
      <ul className="space-y-1">
        {headings.map(({ id, text, level }) => (
          <li key={id} style={{ paddingLeft: `${(level - 2) * 12}px` }}>
            <a
              href={`#${id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className={`block text-xs py-1 px-2 rounded-md transition-all duration-200 ${
                active === id
                  ? 'text-primary bg-primary/10 font-semibold'
                  : 'text-text-muted hover:text-text-secondary hover:bg-background-elevated'
              }`}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
