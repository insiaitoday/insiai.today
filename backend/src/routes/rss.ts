// Routes: RSS Feed Management
import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase';
import { requireAuth } from '../middleware/auth';
import { pollSingleFeed } from '../services/rssPoller';
import { startPoller, stopPoller, getPollerStatus } from '../services/cronJobs';

export const rssRouter = Router();

// GET /api/rss/feeds — all feeds
rssRouter.get('/feeds', async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('rss_feeds')
      .select('*')
      .order('priority_tier')
      .order('name');

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch RSS feeds' });
  }
});

// GET /api/rss/feeds/:id — single feed
rssRouter.get('/feeds/:id', requireAuth, async (req: Request, res: Response) => {
  const { id } = req.params;

  const { data, error } = await supabase.from('rss_feeds').select('*').eq('id', id).single();
  if (error) { res.status(404).json({ error: 'Feed not found' }); return; }
  res.json(data);
});

// POST /api/rss/feeds — add new feed (admin only)
rssRouter.post('/feeds', requireAuth, async (req: Request, res: Response) => {
  const { name, url, auto_approve = false, priority_tier = 2, fetch_frequency = 120 } = req.body;

  if (!name || !url) {
    res.status(400).json({ error: 'Name and URL are required' });
    return;
  }

  try {
    const { data, error } = await supabase
      .from('rss_feeds')
      .insert({ name, url, auto_approve, priority_tier, fetch_frequency })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err: unknown) {
    if ((err as { code?: string }).code === '23505') {
      res.status(409).json({ error: 'Feed URL already exists' });
      return;
    }
    res.status(500).json({ error: 'Failed to add feed' });
  }
});

// PATCH /api/rss/feeds/:id — update feed (admin only)
rssRouter.patch('/feeds/:id', requireAuth, async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from('rss_feeds')
      .update(req.body)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update feed' });
  }
});

// DELETE /api/rss/feeds/:id — remove feed (admin only)
rssRouter.delete('/feeds/:id', requireAuth, async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const { error } = await supabase.from('rss_feeds').delete().eq('id', id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete feed' });
  }
});

// GET /api/rss/feeds/:id/recent — get recently fetched articles from a feed (past 2 hours)
rssRouter.get('/feeds/:id/recent', requireAuth, async (req: Request, res: Response) => {
  const { id } = req.params;
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();

  try {
    const { data, error } = await supabase
      .from('posts')
      .select('id, title, created_at, status, source_name')
      .eq('source_id', id)
      .gte('created_at', twoHoursAgo)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ articles: data || [], count: data?.length || 0 });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch recent articles' });
  }
});

// POST /api/rss/feeds/:id/fetch — manually trigger fetch for one feed (admin only)
rssRouter.post('/feeds/:id/fetch', requireAuth, async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const { data: feed, error } = await supabase
      .from('rss_feeds')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !feed) { res.status(404).json({ error: 'Feed not found' }); return; }

    const count = await pollSingleFeed(feed);
    res.json({ success: true, newArticles: count });
  } catch (err) {
    console.error('Manual fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch feed' });
  }
});

// POST /api/rss/fetch-all — manually trigger fetch for all feeds (admin only)
rssRouter.post('/fetch-all', requireAuth, async (_req: Request, res: Response) => {
  try {
    const { data: feeds } = await supabase.from('rss_feeds').select('*').eq('enabled', true);
    if (!feeds) { res.json({ success: true, total: 0 }); return; }

    let total = 0;
    for (const feed of feeds) {
      const count = await pollSingleFeed(feed);
      total += count;
    }

    res.json({ success: true, total });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch all feeds' });
  }
});

// ── Auto-Poller Control (admin only) ──────────────────────────────────────────

// GET /api/rss/poller/status — get current poller state
rssRouter.get('/poller/status', requireAuth, (_req: Request, res: Response) => {
  res.json(getPollerStatus());
});

// POST /api/rss/poller/start — start the 2-hour auto-poller
rssRouter.post('/poller/start', requireAuth, async (_req: Request, res: Response) => {
  try {
    const result = await startPoller();
    res.json({ ...result, status: getPollerStatus() });
  } catch (err) {
    console.error('Poller start error:', err);
    res.status(500).json({ error: 'Failed to start poller' });
  }
});

// POST /api/rss/poller/stop — stop the auto-poller
rssRouter.post('/poller/stop', requireAuth, (_req: Request, res: Response) => {
  const result = stopPoller();
  res.json({ ...result, status: getPollerStatus() });
});

