import Link from 'next/link';
import { api } from '@/lib/api';
import { AdUnit } from '@/components/ads/AdUnit';
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

      {/* WhatsApp Community CTA */}
      <div className="card p-5" style={{ background: 'linear-gradient(135deg, rgba(37,211,102,0.06) 0%, rgba(18,140,126,0.08) 100%)' }}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}>
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
          </div>
          <h3 className="font-bold text-sm">Join the World&apos;s Largest AI Community</h3>
        </div>
        <p className="text-text-secondary text-xs mb-3 leading-relaxed">
          Get real-time AI news, research drops, and exclusive insights — directly on WhatsApp.
        </p>
        <a
          href="https://chat.whatsapp.com/I9km0y6OJSxAW06X72PHbm"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2 rounded-lg text-white text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          Join Now — It&apos;s Free
        </a>
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
