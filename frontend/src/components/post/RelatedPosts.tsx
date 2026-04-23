import Link from 'next/link';
import Image from 'next/image';
import type { Post } from '@/types';
import { timeAgo, getCategoryClass, getPostUrl } from '@/lib/utils';

interface RelatedPostsProps {
  posts: Post[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="section-heading flex items-center gap-2">
        <span>📌</span> Related Posts
      </h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={getPostUrl(post)}
            className="card p-3 flex gap-3 group hover:scale-[1.01] transition-transform"
          >
            {post.thumbnail && (
              <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-background-elevated">
                <Image src={post.thumbnail} alt="" width={64} height={64} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" unoptimized />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <span className={`badge border text-[10px] mb-1 ${getCategoryClass(post.category)}`}>{post.category}</span>
              <p className="text-sm font-medium text-text-primary line-clamp-2 group-hover:text-primary transition-colors">
                {post.title}
              </p>
              <p className="text-xs text-text-muted mt-1">{timeAgo(post.published_at || post.created_at)}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
