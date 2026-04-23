'use client';

import Link from 'next/link';
import { useRef, useEffect, useState } from 'react';

interface TickerItem {
  id: string;
  title: string;
  source: string;
  slug: string;
  type: string;
  category: string;
  published_at?: string;
  created_at: string;
}

interface TickerBarProps {
  items: TickerItem[];
}

const SOURCE_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  openai:     { bg: '#ECFDF5', text: '#059669', dot: '#059669' },
  google:     { bg: '#EFF6FF', text: '#0A66C2', dot: '#0A66C2' },
  deepmind:   { bg: '#EEF2FF', text: '#6366F1', dot: '#6366F1' },
  anthropic:  { bg: '#FFF7ED', text: '#EA580C', dot: '#EA580C' },
  meta:       { bg: '#EFF6FF', text: '#1877F2', dot: '#1877F2' },
  microsoft:  { bg: '#EFF6FF', text: '#00A4EF', dot: '#00A4EF' },
  nvidia:     { bg: '#ECFDF5', text: '#76B900', dot: '#76B900' },
  huggingface:{ bg: '#FEF3C7', text: '#D97706', dot: '#D97706' },
  mistral:    { bg: '#EDE9FE', text: '#7C3AED', dot: '#7C3AED' },
  default:    { bg: '#F3F4F6', text: '#6B7280', dot: '#9CA3AF' },
};

function getSourceStyle(name: string) {
  const lower = (name || '').toLowerCase();
  for (const key of Object.keys(SOURCE_COLORS)) {
    if (lower.includes(key)) return SOURCE_COLORS[key];
  }
  return SOURCE_COLORS.default;
}

const COMPANY_ICONS: Record<string, string> = {
  openai:     '🤖',
  google:     '🔍',
  deepmind:   '🧠',
  anthropic:  '⚡',
  meta:       '🌐',
  microsoft:  '💎',
  nvidia:     '🚀',
  huggingface:'🤗',
  mistral:    '🌀',
  default:    '📡',
};

function getIcon(name: string) {
  const lower = (name || '').toLowerCase();
  for (const key of Object.keys(COMPANY_ICONS)) {
    if (lower.includes(key)) return COMPANY_ICONS[key];
  }
  return COMPANY_ICONS.default;
}

// Featured companies for the "company pill" left side
const TOP_COMPANIES = [
  { name: 'OpenAI',      key: 'openai',     icon: '🤖' },
  { name: 'Google',      key: 'google',     icon: '🔍' },
  { name: 'Anthropic',   key: 'anthropic',  icon: '⚡' },
  { name: 'Meta AI',     key: 'meta',       icon: '🌐' },
  { name: 'Microsoft',   key: 'microsoft',  icon: '💎' },
  { name: 'Mistral',     key: 'mistral',    icon: '🌀' },
];

export function TickerBar({ items }: TickerBarProps) {
  const [paused, setPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  // Duplicate items for seamless loop
  const displayItems = [...items, ...items];

  if (items.length === 0) return null;

  return (
    <div className="ticker-wrapper bg-gradient-to-r from-background-surface via-background-elevated to-background-surface border-b border-border shadow-sm relative z-40">


      {/* Scrolling ticker */}
      <div
        className="ticker-scroll-area"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Fade edges */}
        <div className="ticker-fade-left" />
        <div className="ticker-fade-right" />

        <div
          ref={trackRef}
          className="ticker-track"
          style={{ animationPlayState: paused ? 'paused' : 'running' }}
        >
          {displayItems.map((item, i) => {
            const style = getSourceStyle(item.source);
            const icon  = getIcon(item.source);
            const url = item.type === 'article' ? `/articles/${item.slug}` : `/news/${item.slug}`;
            return (
              <Link
                key={`${item.id}-${i}`}
                href={url}
                className="ticker-item group"
              >
                <span
                  className="ticker-source-tag border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-transform group-hover:scale-105"
                  style={{ background: style.bg, color: style.text }}
                >
                  {icon} {item.source}
                </span>
                <span className="ticker-item-title">{item.title}</span>
                <span className="ticker-separator">›</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
