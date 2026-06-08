// Routes: Analytics
import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase';
import { requireAuth } from '../middleware/auth';

export const analyticsRouter = Router();

// GET /api/analytics/summary — daily series for the last 30 days (admin dashboard)
analyticsRouter.get('/summary', requireAuth, async (_req: Request, res: Response) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    const { data, error } = await supabase
      .from('analytics')
      .select('date, views, upvotes, downvotes, comments')
      .gte('date', thirtyDaysAgo)
      .order('date');

    if (error) throw error;

    // Aggregate rows by date (there can be multiple rows per day, one per post)
    const aggregated = (data || []).reduce(
      (acc: Record<string, { views: number; upvotes: number; downvotes: number; comments: number }>, row) => {
        if (!acc[row.date]) acc[row.date] = { views: 0, upvotes: 0, downvotes: 0, comments: 0 };
        acc[row.date].views     += row.views     || 0;
        acc[row.date].upvotes   += row.upvotes   || 0;
        acc[row.date].downvotes += row.downvotes || 0;
        acc[row.date].comments  += row.comments  || 0;
        return acc;
      },
      {}
    );

    const series = Object.entries(aggregated)
      .map(([date, vals]) => ({ date, ...vals }))
      .sort((a, b) => a.date.localeCompare(b.date));

    res.json(series);
  } catch (err) {
    console.error('GET /analytics/summary error:', err);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// GET /api/analytics/totals — overall totals (reads from posts table directly — always accurate)
analyticsRouter.get('/totals', requireAuth, async (_req: Request, res: Response) => {
  try {
    // Get total views from posts (most accurate source)
    const { data: postsData, error: postsError } = await supabase
      .from('posts')
      .select('view_count, upvotes, downvotes')
      .eq('status', 'published');

    if (postsError) throw postsError;

    const posts = postsData || [];
    const totalViews    = posts.reduce((sum, p) => sum + (p.view_count || 0), 0);
    const totalUpvotes  = posts.reduce((sum, p) => sum + (p.upvotes   || 0), 0);
    const totalDownvotes = posts.reduce((sum, p) => sum + (p.downvotes || 0), 0);

    // Get total comments
    const { count: totalComments } = await supabase
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'approved');

    res.json({
      totalViews,
      totalUpvotes,
      totalDownvotes,
      totalComments: totalComments || 0,
      publishedPosts: posts.length,
    });
  } catch (err) {
    console.error('GET /analytics/totals error:', err);
    res.status(500).json({ error: 'Failed to fetch totals' });
  }
});

// GET /api/analytics/top-posts — top 10 posts by view_count (always from posts table)
analyticsRouter.get('/top-posts', requireAuth, async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('id, title, slug, type, category, view_count, upvotes, downvotes, published_at')
      .eq('status', 'published')
      .order('view_count', { ascending: false })
      .limit(10);

    if (error) throw error;

    res.json(data || []);
  } catch (err) {
    console.error('GET /analytics/top-posts error:', err);
    res.status(500).json({ error: 'Failed to fetch top posts' });
  }
});
