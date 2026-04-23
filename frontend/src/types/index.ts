// Types shared across the frontend

export type PostType    = 'rss' | 'article';
export type PostStatus  = 'pending' | 'published' | 'skipped' | 'draft' | 'scheduled';
export type CommentStatus = 'pending' | 'approved' | 'spam';
export type SortOption  = 'hot' | 'new' | 'top';

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
  published_at?: string;
  created_at: string;
  updated_at: string;
  comment_count?: number;
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
  created_at: string;
  replies?: Comment[];
}

export interface RssFeed {
  id: string;
  name: string;
  url: string;
  enabled: boolean;
  fetch_frequency: number;
  last_fetched?: string;
  auto_approve: boolean;
  priority_tier: 1 | 2 | 3;
  last_status: string;
  article_count: number;
  created_at: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PostsResponse {
  posts: Post[];
  pagination: Pagination;
}

export interface SearchResponse {
  results: Post[];
  query: string;
  pagination: Pagination;
}

export const CATEGORIES = [
  'All',
  'Breaking News',
  'Product Launches',
  'Research Papers',
  'Funding',
  'Tools',
  'Tutorials',
  'General',
] as const;

export type Category = typeof CATEGORIES[number];
