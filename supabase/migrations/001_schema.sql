-- ============================================================
-- LeviAIToday — Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- POSTS TABLE (RSS articles + original articles)
-- ============================================================
CREATE TABLE IF NOT EXISTS posts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type          TEXT NOT NULL CHECK (type IN ('rss', 'article')),
  title         TEXT NOT NULL,
  slug          TEXT UNIQUE NOT NULL,
  snippet       TEXT,
  content       TEXT,
  source_url    TEXT,
  source_name   TEXT,
  thumbnail     TEXT,
  admin_commentary TEXT,
  category      TEXT DEFAULT 'General',
  tags          TEXT[] DEFAULT '{}',
  status        TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'published', 'skipped', 'draft', 'scheduled')),
  upvotes       INT DEFAULT 0,
  downvotes     INT DEFAULT 0,
  view_count    INT DEFAULT 0,
  featured      BOOLEAN DEFAULT false,
  meta_title    TEXT,
  meta_description TEXT,
  og_image      TEXT,
  scheduled_at  TIMESTAMPTZ,
  published_at  TIMESTAMPTZ,
  feed_id       UUID,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- RSS FEEDS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS rss_feeds (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  url             TEXT UNIQUE NOT NULL,
  enabled         BOOLEAN DEFAULT true,
  fetch_frequency INT DEFAULT 120,
  last_fetched    TIMESTAMPTZ,
  auto_approve    BOOLEAN DEFAULT false,
  priority_tier   INT DEFAULT 2 CHECK (priority_tier IN (1, 2, 3)),
  last_status     TEXT DEFAULT 'pending',
  article_count   INT DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Add FK after both tables exist
ALTER TABLE posts ADD CONSTRAINT fk_posts_feed
  FOREIGN KEY (feed_id) REFERENCES rss_feeds(id) ON DELETE SET NULL;

-- ============================================================
-- COMMENTS TABLE (nested replies)
-- ============================================================
CREATE TABLE IF NOT EXISTS comments (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id       UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  parent_id     UUID REFERENCES comments(id) ON DELETE CASCADE,
  author_name   TEXT NOT NULL,
  author_email  TEXT NOT NULL,
  content       TEXT NOT NULL,
  status        TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'spam')),
  upvotes       INT DEFAULT 0,
  ip_address    TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ADMIN USERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT UNIQUE NOT NULL,
  name          TEXT NOT NULL,
  role          TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  last_login    TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- NEWSLETTER SUBSCRIBERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT UNIQUE NOT NULL,
  frequency     TEXT DEFAULT 'weekly' CHECK (frequency IN ('daily', 'weekly')),
  confirmed     BOOLEAN DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ANALYTICS TABLE (daily aggregation per post)
-- ============================================================
CREATE TABLE IF NOT EXISTS analytics (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id       UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  date          DATE NOT NULL DEFAULT CURRENT_DATE,
  views         INT DEFAULT 0,
  upvotes       INT DEFAULT 0,
  downvotes     INT DEFAULT 0,
  comments      INT DEFAULT 0,
  UNIQUE(post_id, date)
);

-- ============================================================
-- VOTE DEDUPLICATION TABLE (prevent multiple votes)
-- ============================================================
CREATE TABLE IF NOT EXISTS post_votes (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id       UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  ip_address    TEXT NOT NULL,
  vote_type     TEXT NOT NULL CHECK (vote_type IN ('up', 'down')),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, ip_address)
);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
