import Link from 'next/link';
import { api } from '@/lib/api';
import { AdUnit } from '@/components/ads/AdUnit';
import { NewsletterForm } from '@/components/newsletter/NewsletterForm';
import { formatDate } from '@/lib/utils';

async function getTrendingPosts() {
  try {
    const { posts } = await api.posts.list({ sort: 'top', limit: 5, status: 'published' });
    return posts;
  } catch { return []; }
}

async function getBreakingNews() {
  try {
    const { posts } = await api.posts.list({
      sort: 'new', limit: 4, status: 'published', category: 'Breaking News',
    });
    return posts;
  } catch { return []; }
}

export async function Sidebar() {
  const [trending, breaking] = await Promise.all([
    getTrendingPosts(),
    getBreakingNews(),
  ]);

  return (
    <aside className="space-y-5">

      {/* Breaking News */}
      {breaking.length > 0 && (
        <div className="card p-5" style={{ borderLeft: '3px solid #DC2626' }}>
          <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-danger animate-pulse" />
            <span style={{ color: '#DC2626' }}>Breaking News</span>
          </h3>
          <div className="divide-y divide-border/50">
            {breaking.map((post) => (
              <Link
                key={post.id}
                href={post.type === 'article' ? `/articles/${post.slug}` : `/news/${post.slug}`}
                className="block py-2.5 first:pt-0 last:pb-0 group"
              >
                <p className="text-xs text-text-secondary line-clamp-2 group-hover:text-primary transition-colors font-medium leading-snug">
                  {post.title}
                </p>
                <span className="text-[10px] text-text-muted mt-0.5 block">
                  {formatDate(post.published_at || post.created_at)}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Newsletter CTA */}
      <div className="card p-5" style={{ background: 'linear-gradient(135deg, rgba(10,102,194,0.03) 0%, rgba(124,58,237,0.04) 100%)' }}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0A66C2, #7C3AED)' }}>
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="font-bold text-sm">Daily AI Digest</h3>
        </div>
        <p className="text-text-secondary text-xs mb-3 leading-relaxed">
          Top AI stories straight to your inbox. No spam, ever.
        </p>
        <NewsletterForm variant="sidebar" />
      </div>

      {/* Trending posts */}
      <div className="card p-5">
        <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          Trending Now
        </h3>
        {trending.length > 0 ? (
          <div className="divide-y divide-border/50">
            {trending.map((post, i) => (
              <div key={post.id} className="flex gap-2 py-2.5 first:pt-0 last:pb-0 group">
                <span className="text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  style={{
                    background: i === 0 ? '#FEF3C7' : i === 1 ? '#F3F4F6' : '#FDE8D4',
                    color: i === 0 ? '#D97706' : i === 1 ? '#6B7280' : '#9A5228',
                  }}
                >
                  {i + 1}
                </span>
                <Link
                  href={post.type === 'article' ? `/articles/${post.slug}` : `/news/${post.slug}`}
                  className="flex-1 text-xs text-text-secondary line-clamp-2 group-hover:text-primary transition-colors leading-snug"
                >
                  {post.title}
                </Link>
                <span className="text-xs font-bold text-success shrink-0">
                  {((post.upvotes || 0) - (post.downvotes || 0)) > 0 ? '+' : ''}{(post.upvotes || 0) - (post.downvotes || 0)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-text-muted text-xs">No trending posts yet</p>
        )}
      </div>

      {/* Browse Categories */}
      <div className="card p-5">
        <h3 className="font-bold text-sm mb-3">Browse Categories</h3>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Breaking News',    href: '/?category=Breaking+News',    cls: 'cat-breaking' },
            { label: 'Product Launches', href: '/?category=Product+Launches', cls: 'cat-product' },
            { label: 'Research Papers',  href: '/?category=Research+Papers',  cls: 'cat-research' },
            { label: 'Funding',          href: '/?category=Funding',          cls: 'cat-funding' },
            { label: 'Tools',            href: '/?category=Tools',            cls: 'cat-tools' },
            { label: 'Tutorials',        href: '/?category=Tutorials',        cls: 'cat-tutorials' },
          ].map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className={`badge border text-xs hover:opacity-80 transition-opacity ${c.cls}`}
            >
              {c.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Sidebar ad */}
      <AdUnit slot="sidebar" />
    </aside>
  );
}
