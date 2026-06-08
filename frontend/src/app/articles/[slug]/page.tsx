import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { SmartImage } from '@/components/post/SmartImage';
import { api } from '@/lib/api';
import { VoteButtons } from '@/components/post/VoteButtons';
import { ShareButtons } from '@/components/post/ShareButtons';
import { CommentSection } from '@/components/post/CommentSection';
import { RelatedPosts } from '@/components/post/RelatedPosts';
import { AdUnit } from '@/components/ads/AdUnit';
import { ViewTracker } from '@/components/post/ViewTracker';
import { getCategoryClass, formatDate, formatNumber, readingTime } from '@/lib/utils';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://insiai.today';
  try {
    const post    = await api.posts.get(slug);
    const postUrl = `${siteUrl}/articles/${slug}`;
    const ogImage = post.og_image || post.thumbnail;
    return {
      title: post.meta_title || post.title,
      description: post.meta_description || post.snippet || '',
      authors: [{ name: 'INSI AI Today Editorial Team', url: siteUrl }],
      alternates: { canonical: postUrl },
      openGraph: {
        title: post.title,
        description: post.snippet || '',
        url: postUrl,
        type: 'article',
        siteName: 'INSI AI Today',
        images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: post.title }] : [{ url: `${siteUrl}/og-default.png`, width: 1200, height: 630, alt: post.title }],
        publishedTime: post.published_at,
        modifiedTime: post.updated_at || post.published_at,
        authors: ['INSI AI Today Editorial Team'],
        tags: post.tags,
        section: post.category,
      },
      twitter: {
        card: 'summary_large_image',
        site: '@insiai_today',
        title: post.title,
        description: post.snippet || '',
        images: ogImage ? [ogImage] : [`${siteUrl}/og-default.png`],
      },
    };
  } catch {
    return { title: 'Article Not Found | INSI AI Today' };
  }
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const siteUrl  = process.env.NEXT_PUBLIC_SITE_URL || 'https://insiai.today';

  let post: import('@/types').Post;
  let related: import('@/types').Post[] = [];

  try {
    [post, related] = await Promise.all([
      api.posts.get(slug),
      // Pass post.id after fetch — backend /related/:id expects a UUID
      api.posts.get(slug).then(p => api.posts.related(p.id)).catch(() => [] as import('@/types').Post[]),
    ]);
  } catch {
    notFound();
  }

  if (post.status !== 'published' || post.type !== 'article') notFound();

  const postUrl = `${siteUrl}/articles/${slug}`;
  const mins    = post.content ? readingTime(post.content) : 0;

  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.snippet,
      image: post.thumbnail ? [post.thumbnail] : [`${siteUrl}/og-default.png`],
      datePublished: post.published_at,
      dateModified: post.updated_at || post.published_at,
      author: {
        '@type': 'Organization',
        name: 'INSI AI Today Editorial Team',
        url: siteUrl,
      },
      publisher: {
        '@type': 'Organization',
        name: 'INSI AI Today',
        url: siteUrl,
        logo: {
          '@type': 'ImageObject',
          url: `${siteUrl}/logo.png`,
          width: 200,
          height: 60,
        },
      },
      mainEntityOfPage: { '@type': 'WebPage', '@id': postUrl },
      url: postUrl,
      articleSection: post.category,
      keywords: post.tags?.join(', '),
      wordCount: post.content?.split(/\s+/).length,
      isAccessibleForFree: true,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
        { '@type': 'ListItem', position: 2, name: 'Articles', item: `${siteUrl}/articles` },
        { '@type': 'ListItem', position: 3, name: post.title, item: postUrl },
      ],
    },
  ];

  return (
    <>
      <ViewTracker slug={slug} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <article className="animate-fade-in">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-text-muted mb-6 flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link href="/articles" className="hover:text-primary transition-colors">Articles</Link>
            <span>/</span>
            <span className="text-text-secondary truncate max-w-[180px] sm:max-w-xs">{post.title}</span>
          </nav>

          {/* Badges */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className={`badge border text-xs ${getCategoryClass(post.category)}`}>{post.category}</span>
            <span className="badge bg-accent/20 border border-accent/30 text-accent text-xs">Original Article</span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 leading-snug">
            {post.title}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-text-muted mb-6 pb-4 border-b border-border">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
                <span className="text-white text-xs font-bold">I</span>
              </div>
              <span className="font-medium text-text-secondary">INSI AI Today</span>
            </div>
            <span>{formatDate(post.published_at || post.created_at)}</span>
            {mins > 0 && <span>{mins} min read</span>}
            <span>{formatNumber(post.view_count)} views</span>
            <VoteButtons postId={post.id} upvotes={post.upvotes} downvotes={post.downvotes} orientation="horizontal" />
          </div>

          {/* Featured image */}
          {post.thumbnail && (
            <SmartImage src={post.thumbnail} alt={post.title} />
          )}

          {/* Snippet / intro */}
          {post.snippet && (
            <p className="text-base sm:text-lg text-text-secondary leading-relaxed mb-8 font-light border-l-4 border-primary pl-4">
              {post.snippet}
            </p>
          )}

          {/* Article body */}
          {post.content ? (
            <div
              className="article-content mb-8"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          ) : (
            <div className="text-text-muted text-center py-10">Article content coming soon…</div>
          )}

          {/* In-content ad */}
          <div className="flex justify-center my-8">
            <AdUnit slot="in-content" />
          </div>

          {/* Share */}
          <div className="py-4 border-t border-b border-border mb-6">
            <ShareButtons title={post.title} url={postUrl} />
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/search?q=${encodeURIComponent(tag)}`}
                  className="badge border border-border text-text-muted text-xs hover:text-primary hover:border-primary transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}

          {/* Author box */}
          <div className="card p-4 sm:p-5 mb-8 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
              <span className="text-white text-xl font-bold">I</span>
            </div>
            <div>
              <p className="font-semibold">INSI AI Today Editorial</p>
              <p className="text-text-secondary text-sm">
                Expert AI news coverage and original research insights. Follow us for daily updates.
              </p>
            </div>
          </div>

          <RelatedPosts posts={related} />
          <CommentSection postId={post.id} />
        </article>
      </div>
    </>
  );
}
