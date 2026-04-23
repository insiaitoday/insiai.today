// Routes: Analytics
import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase';
import { requireAuth } from '../middleware/auth';

export const analyticsRouter = Router();

// GET /api/analytics/summary — high-level stats for admin dashboard
analyticsRouter.get('/summary', requireAuth, async (_req: Request, res: Response) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const { data } = await supabase
      .from('analytics')
      .select('date, views, upvotes, downvotes, comments')
      .gte('date', thirtyDaysAgo)
      .order('date');

    const aggregated = (data || []).reduce((acc: Record<string, Record<string, number>>, row) => {
      if (!acc[row.date]) acc[row.date] = { views: 0, upvotes: 0, downvotes: 0, comments: 0 };
      acc[row.date].views    += row.views;
      acc[row.date].upvotes  += row.upvotes;
      acc[row.date].downvotes += row.downvotes;
      acc[row.date].comments += row.comments;
      return acc;
    }, {});

    const series = Object.entries(aggregated).map(([date, vals]) => ({ date, ...vals }));
    res.json(series);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// GET /api/analytics/top-posts — top posts by views
analyticsRouter.get('/top-posts', requireAuth, async (_req: Request, res: Response) => {
  try {
    const { data } = await supabase
      .from('posts')
      .select('id, title, slug, type, category, view_count, upvotes, downvotes, published_at')
      .eq('status', 'published')
      .order('view_count', { ascending: false })
      .limit(10);

    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch top posts' });
  }
});
