-- ============================================================
-- LeviAIToday — Performance Indexes
-- ============================================================

-- Posts: fast slug lookup (used on every page load)
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);

-- Posts: homepage feed queries (published, sorted by date/votes)
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_upvotes ON posts(upvotes DESC);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_type ON posts(type);
CREATE INDEX IF NOT EXISTS idx_posts_featured ON posts(featured) WHERE featured = true;

-- Posts: compound index for common homepage query
CREATE INDEX IF NOT EXISTS idx_posts_status_published ON posts(status, published_at DESC)
  WHERE status = 'published';

-- Posts: full-text search
CREATE INDEX IF NOT EXISTS idx_posts_search ON posts
  USING gin(to_tsvector('english', coalesce(title, '') || ' ' || coalesce(snippet, '') || ' ' || coalesce(content, '')));

-- Posts: tag search
CREATE INDEX IF NOT EXISTS idx_posts_tags ON posts USING gin(tags);

-- Comments: fast lookup by post
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_status ON comments(status);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);

-- Analytics: date range queries
CREATE INDEX IF NOT EXISTS idx_analytics_post_id ON analytics(post_id);
CREATE INDEX IF NOT EXISTS idx_analytics_date ON analytics(date DESC);

-- RSS feeds: enabled feeds only
CREATE INDEX IF NOT EXISTS idx_rss_feeds_enabled ON rss_feeds(enabled) WHERE enabled = true;
CREATE INDEX IF NOT EXISTS idx_rss_feeds_priority ON rss_feeds(priority_tier, last_fetched);

-- Post votes: dedup check
CREATE INDEX IF NOT EXISTS idx_post_votes_post_ip ON post_votes(post_id, ip_address);

-- Newsletter: email lookup
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);
