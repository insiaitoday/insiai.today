// ============================================================
// Shared TypeScript Types — Backend
// ============================================================

export type PostType = 'rss' | 'article';
export type PostStatus = 'pending' | 'published' | 'skipped' | 'draft' | 'scheduled';
export type CommentStatus = 'pending' | 'approved' | 'spam';
export type VoteType = 'up' | 'down';
export type PriorityTier = 1 | 2 | 3;

export interface Post {
  id: string;
  type: PostType;
  title: string;
  slug: string;
  snippet?: string;
  content?: string;
  source_url?: string;
  source_name?: string;
  thumbnail?: string;
  admin_commentary?: string;
  category: string;
  tags: string[];
  status: PostStatus;
  upvotes: number;
  downvotes: number;
  view_count: number;
  featured: boolean;
  meta_title?: string;
  meta_description?: string;
  og_image?: string;
  scheduled_at?: string;
  published_at?: string;
  feed_id?: string;
  fetched_at?: string;
  created_at: string;
  updated_at: string;
}

export interface RssFeed {
  id: string;
  name: string;
  url: string;
  enabled: boolean;
  fetch_frequency: number;
  last_fetched?: string;
  auto_approve: boolean;
  priority_tier: PriorityTier;
  last_status: string;
  article_count: number;
  created_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  parent_id?: string;
  author_name: string;
  author_email: string;
  content: string;
  status: CommentStatus;
  upvotes: number;
  ip_address?: string;
  created_at: string;
  replies?: Comment[];
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  frequency: 'daily' | 'weekly';
  confirmed: boolean;
  created_at: string;
}

export interface Analytics {
  id: string;
  post_id: string;
  date: string;
  views: number;
  upvotes: number;
  downvotes: number;
  comments: number;
}

export interface ParsedRssItem {
  title: string;
  link: string;
  snippet: string;
  thumbnail?: string;
  publishedAt?: string;
  sourceName: string;
  feedId: string;
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
}
