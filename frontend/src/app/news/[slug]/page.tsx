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
import { getCategoryClass, formatDate, formatNumber } from '@/lib/utils';

export const dynamic = 'force-dynamic'; // Always fresh — fixes approved posts not showing

interface PageProps {
  params: Promise<{ slug: string }>;
}


export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await api.posts.get(slug);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://leviai.today';
    return {
      title: post.meta_title || post.title,
      description: post.meta_description || post.snippet || '',
      openGraph: {
        title: post.title,
        description: post.snippet || '',
        url: `${siteUrl}/news/${slug}`,
        type: 'article',
        images: post.og_image || post.thumbnail ? [{ url: (post.og_image || post.thumbnail)! }] : [],
        publishedTime: post.published_at,
        tags: post.tags,
      },
      twitter: { card: 'summary_large_image', title: post.title, description: post.snippet || '' },
    };
  } catch {
    return { title: 'Post Not Found' };
  }
}

export default async function NewsPostPage({ params }: PageProps) {
  const { slug } = await params;
  const siteUrl  = process.env.NEXT_PUBLIC_SITE_URL || 'https://leviai.today';

  let post: import('@/types').Post;
  let related: import('@/types').Post[] = [];

  try {
    [post, related] = await Promise.all([
      api.posts.get(slug),
      api.posts.related(slug).catch(() => [] as import('@/types').Post[]),
    ]);
  } catch {
    notFound();
  }

  if (post.status !== 'published') notFound();

  const postUrl = `${siteUrl}/news/${slug}`;

  // Schema.org NewsArticle
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: post.title,
    description: post.snippet,
    image: post.thumbnail,
    datePublished: post.published_at,
    publisher: { '@type': 'Organization', name: 'LeviAI Today', url: siteUrl },
    url: postUrl,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-8">
          {/* Main content */}
          <article className="flex-1 min-w-0 animate-fade-in">

            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs text-text-muted mb-6">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <span>/</span>
              <Link href={`/category/${post.category.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-primary transition-colors">
                {post.category}
              </Link>
              <span>/</span>
              <span className="text-text-secondary truncate max-w-[200px]">{post.title}</span>
            </nav>

            {/* Category badge */}
            <span className={`badge border text-xs mb-4 inline-block ${getCategoryClass(post.category)}`}>
              {post.category}
            </span>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold mb-4 leading-snug">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted mb-6 pb-4 border-b border-border">
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                <span className="font-medium text-text-secondary">{post.source_name}</span>
              </div>
              <span>{formatDate(post.published_at || post.created_at)}</span>
              <span>{formatNumber(post.view_count)} views</span>
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

            {/* Snippet / Summary */}
            {post.snippet && (
              <div className="card p-5 mb-6 bg-background-elevated border-border">
                <h2 className="text-sm font-semibold text-text-muted mb-2 uppercase tracking-wider">Summary</h2>
                <p className="text-text-secondary leading-relaxed">{post.snippet}</p>
              </div>
            )}

            {/* Admin Commentary */}
            {post.admin_commentary && (
              <div className="gradient-border p-5 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <span className="text-white text-xs font-bold">L</span>
                  </div>
                  <span className="text-sm font-semibold text-primary">LeviAI Editor Commentary</span>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed italic">
                  {post.admin_commentary}
                </p>
              </div>
            )}

            {/* In-content ad */}
            <div className="flex justify-center mb-6">
              <AdUnit slot="in-content" />
            </div>

            {/* Read Full Article CTA */}
            {post.source_url && (
              <div className="card p-5 mb-8 flex flex-col sm:flex-row items-center gap-4">
                <div className="flex-1">
                  <p className="font-semibold mb-1">Read the Full Article</p>
                  <p className="text-text-secondary text-sm">View the complete story on {post.source_name}.</p>
                </div>
                <a
                  href={post.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary shrink-0"
                >
                  Read on {post.source_name} →
                </a>
              </div>
            )}

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

            {/* Related */}
            <RelatedPosts posts={related} />

            {/* Engagement Section - Vote & Share */}
            <div className="card p-6 mb-6">
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
      </div>
    </>
  );
}
