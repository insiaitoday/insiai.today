// Routes: Admin-specific actions (approve, skip, feature, bulk)
import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase';
import { requireAuth } from '../middleware/auth';

export const adminRouter = Router();
adminRouter.use(requireAuth);

// POST /api/admin/posts/:id/approve — approve a pending RSS post
adminRouter.post('/posts/:id/approve', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { admin_commentary, category, title, snippet } = req.body;

  try {
    const updates: Record<string, unknown> = {
      status: 'published',
      published_at: new Date().toISOString(),
    };

    if (admin_commentary !== undefined) updates.admin_commentary = admin_commentary;
    if (category)  updates.category = category;
    if (title)     updates.title    = title;
    if (snippet)   updates.snippet  = snippet;

    const { data, error } = await supabase
      .from('posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to approve post' });
  }
});

// POST /api/admin/posts/:id/skip — skip (hide) a pending post
adminRouter.post('/posts/:id/skip', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from('posts')
      .update({ status: 'skipped' })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to skip post' });
  }
});

// POST /api/admin/posts/:id/feature — toggle featured
adminRouter.post('/posts/:id/feature', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const { data: post } = await supabase.from('posts').select('featured').eq('id', id).single();
    const { data, error } = await supabase
      .from('posts')
      .update({ featured: !post?.featured })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to toggle feature' });
  }
});

// POST /api/admin/posts/bulk-approve — approve multiple by IDs
adminRouter.post('/posts/bulk-approve', async (req: Request, res: Response) => {
  const { ids } = req.body as { ids: string[] };

  if (!Array.isArray(ids) || ids.length === 0) {
    res.status(400).json({ error: 'ids array is required' });
    return;
  }

  try {
    const { error } = await supabase
      .from('posts')
      .update({ status: 'published', published_at: new Date().toISOString() })
      .in('id', ids);

    if (error) throw error;
    res.json({ success: true, approved: ids.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to bulk approve' });
  }
});

// POST /api/admin/posts/bulk-approve-source — approve all from a feed source
adminRouter.post('/posts/bulk-approve-source', async (req: Request, res: Response) => {
  const { feed_id } = req.body;

  if (!feed_id) {
    res.status(400).json({ error: 'feed_id is required' });
    return;
  }

  try {
    const { data, error } = await supabase
      .from('posts')
      .update({ status: 'published', published_at: new Date().toISOString() })
      .eq('status', 'pending')
      .eq('feed_id', feed_id)
      .select('id');

    if (error) throw error;
    res.json({ success: true, approved: data?.length || 0 });
  } catch (err) {
    res.status(500).json({ error: 'Failed to bulk approve source' });
  }
});

// GET /api/admin/stats — dashboard stats
adminRouter.get('/stats', async (_req: Request, res: Response) => {
  try {
    const [posts, pending, comments, feeds, subscribers] = await Promise.all([
      supabase.from('posts').select('id', { count: 'exact', head: true }).eq('status', 'published'),
      supabase.from('posts').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('comments').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('rss_feeds').select('id', { count: 'exact', head: true }).eq('enabled', true),
      supabase.from('newsletter_subscribers').select('id', { count: 'exact', head: true }),
    ]);

    // Total views
    const { data: viewsData } = await supabase
      .from('posts')
      .select('view_count')
      .eq('status', 'published');

    const totalViews = (viewsData || []).reduce((sum, p) => sum + (p.view_count || 0), 0);

    res.json({
      publishedPosts: posts.count || 0,
      pendingPosts:   pending.count || 0,
      pendingComments: comments.count || 0,
      activeFeeds:    feeds.count || 0,
      subscribers:    subscribers.count || 0,
      totalViews,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});
