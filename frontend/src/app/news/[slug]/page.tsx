import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { api } from '@/lib/api';
import { VoteButtons } from '@/components/post/VoteButtons';
import { ShareButtons } from '@/components/post/ShareButtons';
import { CommentSection } from '@/components/post/CommentSection';
import { RelatedPosts } from '@/components/post/RelatedPosts';
import { AdUnit } from '@/components/ads/AdUnit';
import { ViewTracker } from '@/components/post/ViewTracker';
import { getCategoryClass, formatDate, formatNumber, readingTime } from '@/lib/utils';

export const dynamic = 'force-dynamic'; // Always fresh — fixes approved posts not showing

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://insiai.today';
  try {
    const post = await api.posts.get(slug);
    const postUrl = `${siteUrl}/news/${slug}`;
    const ogImage = post.og_image || post.thumbnail;
    return {
      title: post.meta_title || post.title,
      description: post.meta_description || post.snippet || '',
      authors: [{ name: post.source_name || 'INSI AI Today', url: post.source_url || siteUrl }],
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
        authors: [post.source_name || 'INSI AI Today'],
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
    return { title: 'Post Not Found | INSI AI Today' };
  }
}

export default async function NewsPostPage({ params }: PageProps) {
  const { slug } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://insiai.today';

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

  // Only serve rss-type posts at /news/[slug]; articles live at /articles/[slug]
  if (post.status !== 'published' || post.type !== 'rss') notFound();

  const postUrl = `${siteUrl}/news/${slug}`;
  const mins = post.content ? readingTime(post.content) : 0;
  // Only render full body if content is substantial (not just the snippet repeated)
  const hasFullContent = !!(post.content && post.content.trim().length > 100);

  // Schema.org NewsArticle — includes all fields required for Google News rich results
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: post.title,
      description: post.snippet,
      image: post.thumbnail ? [post.thumbnail] : [`${siteUrl}/og-default.png`],
      datePublished: post.published_at,
      dateModified: post.updated_at || post.published_at,
      author: {
        '@type': 'Organization',
        name: post.source_name || 'INSI AI Today',
        url: post.source_url || siteUrl,
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
        { '@type': 'ListItem', position: 2, name: post.category, item: `${siteUrl}/category/${post.category.toLowerCase().replace(/\s+/g, '-')}` },
        { '@type': 'ListItem', position: 3, name: post.title, item: postUrl },
      ],
    },
  ];

  return (
    <>
      {/* Client-side view tracker — sends sessionId from localStorage */}
      <ViewTracker slug={slug} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <article className="animate-fade-in">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-text-muted mb-6 flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link
              href={`/category/${post.category.toLowerCase().replace(/\s+/g, '-')}`}
              className="hover:text-primary transition-colors"
            >
              {post.category}
            </Link>
            <span>/</span>
            <span className="text-text-secondary truncate max-w-[180px] sm:max-w-xs">{post.title}</span>
          </nav>

          {/* Category badge */}
          <span className={`badge border text-xs mb-4 inline-block ${getCategoryClass(post.category)}`}>
            {post.category}
          </span>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 leading-snug">
            {post.title}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-text-muted mb-6 pb-4 border-b border-border">
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <span className="font-medium text-text-secondary">{post.source_name}</span>
            </div>
            <span>{formatDate(post.published_at || post.created_at)}</span>
            {mins > 0 && <span>{mins} min read</span>}
            <span>{formatNumber(post.view_count)} views</span>
            <VoteButtons postId={post.id} upvotes={post.upvotes} downvotes={post.downvotes} orientation="horizontal" />
          </div>

          {/* Thumbnail */}
          {post.thumbnail && (
            <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-6 bg-background-elevated">
              <Image
                src={post.thumbnail}
                alt={post.title}
                fill
                className="object-cover"
                priority
                unoptimized
              />
            </div>
          )}

          {/* Snippet / intro */}
          {post.snippet && (
            <p className="text-base sm:text-lg text-text-secondary leading-relaxed mb-8 font-light border-l-4 border-primary pl-4">
              {post.snippet}
            </p>
          )}

          {/* Admin Commentary */}
          {post.admin_commentary && (
            <div className="gradient-border p-5 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
                  <span className="text-white text-xs font-bold">I</span>
                </div>
                <span className="text-sm font-semibold text-primary">INSI Editor Commentary</span>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed italic">
                {post.admin_commentary}
              </p>
            </div>
          )}

          {/* Full imported article body */}
          {hasFullContent && (
            <div
              className="article-content mb-8"
              dangerouslySetInnerHTML={{ __html: post.content! }}
            />
          )}

          {/* In-content ad */}
          <div className="flex justify-center mb-6">
            <AdUnit slot="in-content" />
          </div>

          {/* Source CTA */}
          {post.source_url && (
            <div className="card p-5 mb-8 flex flex-col sm:flex-row items-center gap-4">
              <div className="flex-1">
                <p className="font-semibold mb-1">
                  {hasFullContent ? 'Original Source' : 'Read the Full Article'}
                </p>
                <p className="text-text-secondary text-sm">
                  {hasFullContent
                    ? `This analysis is based on reporting from ${post.source_name}.`
                    : `View the complete story on ${post.source_name}.`}
                </p>
              </div>
              <a
                href={post.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary shrink-0 w-full sm:w-auto text-center"
              >
                View on {post.source_name} →
              </a>
            </div>
          )}

          {/* Share row */}
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

          {/* Related posts */}
          <RelatedPosts posts={related} />

          {/* Vote & Share */}
          <div className="card p-4 sm:p-6 mb-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-text-secondary">What do you think?</span>
                <VoteButtons postId={post.id} upvotes={post.upvotes} downvotes={post.downvotes} orientation="horizontal" />
              </div>
              <ShareButtons title={post.title} url={postUrl} />
            </div>
          </div>

          {/* Comments */}
          <CommentSection postId={post.id} />
        </article>
      </div>
    </>
  );
}
