import { api } from '@/lib/api';
import { TickerBar } from './TickerBar';

// Re-validate ticker data every 2 minutes so it stays fresh
// (We use no-store in api.ts so this will always be fresh)
async function getTickerPosts() {
  try {
    const { posts } = await api.posts.list({
      sort: 'new',
      limit: 25,
      status: 'published',
    });
    return posts.map((p) => ({
      id:           p.id,
      title:        p.title,
      source:       p.source_name || 'AI News',
      slug:         p.slug,
      type:         p.type,
      category:     p.category,
      published_at: p.published_at,
      created_at:   p.created_at,
    }));
  } catch {
    return [];
  }
}

export async function CompanyTicker() {
  const items = await getTickerPosts();
  return <TickerBar items={items} />;
}
