-- ============================================================
-- Migration: Add fetched_at column to posts table
-- This tracks when articles were actually fetched/added to the database
-- separate from their original publication date (created_at)
-- ============================================================

-- Add fetched_at column
ALTER TABLE posts ADD COLUMN IF NOT EXISTS fetched_at TIMESTAMPTZ;

-- Set fetched_at to created_at for existing records (best approximation)
UPDATE posts SET fetched_at = created_at WHERE fetched_at IS NULL;

-- Create index for efficient filtering by fetched_at
CREATE INDEX IF NOT EXISTS idx_posts_fetched_at ON posts(fetched_at DESC);

-- Create composite index for common query pattern (status + fetched_at)
CREATE INDEX IF NOT EXISTS idx_posts_status_fetched_at ON posts(status, fetched_at DESC);
