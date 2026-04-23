import { formatDistanceToNow, format } from 'date-fns';

export function timeAgo(date: string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function formatDate(date: string): string {
  return format(new Date(date), 'MMM d, yyyy');
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

export function getCategoryClass(category: string): string {
  const map: Record<string, string> = {
    'Breaking News':    'cat-breaking',
    'Product Launches': 'cat-product',
    'Research Papers':  'cat-research',
    'Funding':          'cat-funding',
    'Tools':            'cat-tools',
    'Tutorials':        'cat-tutorials',
    'General':          'cat-general',
  };
  return map[category] || 'cat-general';
}

export function getSourceClass(source: string): string {
  const s = source.toLowerCase();
  if (s.includes('openai'))   return 'source-openai';
  if (s.includes('google') || s.includes('deepmind')) return 'source-google';
  if (s.includes('hugging'))  return 'source-hugging';
  return 'source-default';
}

export function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return `${text.substring(0, maxLen).trim()}…`;
}

export function readingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / 200);
}

export function getPostUrl(post: { type: string; slug: string }): string {
  return post.type === 'article' ? `/articles/${post.slug}` : `/news/${post.slug}`;
}
