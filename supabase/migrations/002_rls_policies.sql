-- ============================================================
-- LeviAIToday — Row Level Security Policies
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE rss_feeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- POSTS policies
-- ============================================================

-- Anyone can read published posts
CREATE POLICY "posts_public_read" ON posts
  FOR SELECT USING (status = 'published');

-- Service role can do everything (backend uses service role key)
CREATE POLICY "posts_service_all" ON posts
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ============================================================
-- RSS FEEDS policies
-- ============================================================

-- Anyone can read enabled feeds (for display)
CREATE POLICY "rss_feeds_public_read" ON rss_feeds
  FOR SELECT USING (enabled = true);

-- Service role full access
CREATE POLICY "rss_feeds_service_all" ON rss_feeds
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ============================================================
-- COMMENTS policies
-- ============================================================

-- Anyone can read approved comments
CREATE POLICY "comments_public_read" ON comments
  FOR SELECT USING (status = 'approved');

-- Anyone can insert comments (rate limited at API level)
CREATE POLICY "comments_public_insert" ON comments
  FOR INSERT WITH CHECK (true);

-- Service role full access
CREATE POLICY "comments_service_all" ON comments
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ============================================================
-- NEWSLETTER SUBSCRIBERS policies
-- ============================================================

-- Anyone can insert a subscription
CREATE POLICY "newsletter_public_insert" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);

-- Service role full access
CREATE POLICY "newsletter_service_all" ON newsletter_subscribers
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ============================================================
-- ANALYTICS policies
-- ============================================================

-- Anyone can read analytics (public stats)
CREATE POLICY "analytics_public_read" ON analytics
  FOR SELECT USING (true);

-- Service role full access
CREATE POLICY "analytics_service_all" ON analytics
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ============================================================
-- POST VOTES policies
-- ============================================================

-- Anyone can insert a vote (dedup at DB level)
CREATE POLICY "votes_public_insert" ON post_votes
  FOR INSERT WITH CHECK (true);

-- Anyone can read their own vote
CREATE POLICY "votes_public_read" ON post_votes
  FOR SELECT USING (true);

-- Service role full access
CREATE POLICY "votes_service_all" ON post_votes
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
