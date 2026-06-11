// ============================================================
// Routes: POST management (public reads + admin writes)
// ============================================================

import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase';
import { generateUniqueSlug } from '../lib/slugify';
import { requireAuth } from '../middleware/auth';
import { generalLimiter } from '../middleware/rateLimit';
import { getClientIp } from '../lib/ip';

export const postsRouter = Router();

// Import advanced view tracker
import { viewTracker } from '../services/viewTracker';

// GET /api/posts — paginated feed
postsRouter.get('/', generalLimiter, async (req: Request, res: Response) => {
  const {
    page = '1',
    limit = '12',
    sort = 'hot',
    category,
    type,
    status = 'published',
    featured,
    since,
    filterBy = 'created_at',
    search,
  } = req.query;

  const pageNum  = Math.max(1, parseInt(page as string));
  const limitNum = Math.min(500, parseInt(limit as string));
  const offset   = (pageNum - 1) * limitNum;

  try {
    let query = supabase
      .from('posts')
      .select('*, comments(count)', { count: 'exact' });

    // Handle status filter - support comma-separated values
    if (status) {
      const statuses = (status as string).split(',').map(s => s.trim());
      if (statuses.length === 1) {
        query = query.eq('status', statuses[0]);
      } else {
        query = query.in('status', statuses);
      }
    }

    if (category) query = query.eq('category', category);
    if (type)     query = query.eq('type', type);
    if (featured) query = query.eq('featured', true);
    if (since) {
      if (filterBy === 'fetched_at') {
        // Fallback to created_at if fetched_at is null but row was created recently
        query = query.or(`fetched_at.gte.${since},and(fetched_at.is.null,created_at.gte.${since})`);
      } else {
        query = query.gte('created_at', since as string);
      }
    }
    if (search) {
      const safeSearch = (search as string).replace(/,/g, ' ');
      query = query.or(`title.ilike.%${safeSearch}%,snippet.ilike.%${safeSearch}%,source_name.ilike.%${safeSearch}%`);
    }

    // Pending posts have null published_at — sort by created_at for those
    const statuses = (status as string).split(',').map(s => s.trim());
    const isPendingOnly = statuses.length === 1 && statuses[0] === 'pending';
    const dateCol = isPendingOnly ? 'created_at' : 'published_at';

    if (sort === 'new')  query = query.order(dateCol, { ascending: false, nullsFirst: false });
    if (sort === 'old')  query = query.order(dateCol, { ascending: true,  nullsFirst: false });
    if (sort === 'top')  query = query.order('upvotes', { ascending: false });
    if (sort === 'hot') {
      query = query.order('upvotes', { ascending: false }).order(dateCol, { ascending: false });
    }

    query = query.range(offset, offset + limitNum - 1);

    const { data, error, count } = await query;
    if (error) throw error;

    const formattedPosts = (data || []).map((post: any) => {
      const comment_count = post.comments?.[0]?.count || 0;
      delete post.comments;
      return { ...post, comment_count };
    });

    res.json({
      posts: formattedPosts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: count ?? 0,
        totalPages: Math.ceil((count ?? 0) / limitNum),
      },
    });
  } catch (err) {
    console.error('GET /posts error:', err);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// GET /api/posts/:slug — single post (NO automatic view increment)
postsRouter.get('/:slug', generalLimiter, async (req: Request, res: Response) => {
  const { slug } = req.params;

  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*, comments(count)')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    const comment_count = data.comments?.[0]?.count || 0;
    delete data.comments;

    res.json({ ...data, comment_count });
  } catch (err) {
    console.error('GET /posts/:slug error:', err);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// POST /api/posts/:slug/view — explicit view tracking with deduplication
postsRouter.post('/:slug/view', generalLimiter, async (req: Request, res: Response) => {
  const { slug } = req.params;
  const { sessionId: rawSessionId, userId, fingerprint } = req.body || {};

  // Auto-generate sessionId if the client didn't send one (backward compat)
  const sessionId: string = (typeof rawSessionId === 'string' && rawSessionId.trim())
    ? rawSessionId.trim()
    : `auto-${Date.now()}-${Math.random().toString(36).slice(2)}`;

  try {
    // Get the post
    const { data: post, error: fetchError } = await supabase
      .from('posts')
      .select('id, view_count')
      .eq('slug', slug)
      .single();

    if (fetchError || !post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    // Get client IP — normalise localhost variants to a single value
    const rawIp = getClientIp(req);

    // Treat all localhost IPs the same (::1 / 127.0.0.1 / ::ffff:127.0.0.1)
    const isLocalhost = rawIp === '::1' || rawIp.startsWith('127.') || rawIp.startsWith('::ffff:127.');
    // Use fingerprint as the dedup key for localhost; fall back to IP for production
    const ipAddress = isLocalhost
      ? (fingerprint ? `local:${fingerprint}` : `local:${sessionId}`)
      : rawIp;

    const userAgent = req.headers['user-agent'];

    // Check if this view should be counted using advanced tracker
    const shouldCount = viewTracker.shouldCountView(
      post.id,
      sessionId,
      ipAddress,
      userId,
      fingerprint
    );

    if (!shouldCount) {
      res.json({
        success: true,
        counted: false,
        view_count: post.view_count,
        message: 'View already counted recently',
      });
      return;
    }

    // Record the view in the in-memory tracker
    viewTracker.recordView(post.id, sessionId, ipAddress, userAgent, userId, fingerprint);

    // Atomically increment view count in database using RPC
    const { data: updatedPost, error: updateError } = await supabase
      .from('posts')
      .update({ view_count: (post.view_count || 0) + 1 })
      .eq('id', post.id)
      .select('view_count')
      .single();

    if (updateError) throw updateError;

    const newViewCount = updatedPost?.view_count ?? (post.view_count || 0) + 1;

    // Upsert into analytics table for daily tracking
    const today = new Date().toISOString().split('T')[0];

    const { data: existingAnalytics } = await supabase
      .from('analytics')
      .select('id, views')
      .eq('post_id', post.id)
      .eq('date', today)
      .maybeSingle();

    if (existingAnalytics) {
      await supabase
        .from('analytics')
        .update({ views: (existingAnalytics.views || 0) + 1 })
        .eq('id', existingAnalytics.id);
    } else {
      await supabase
        .from('analytics')
        .insert({
          post_id: post.id,
          date: today,
          views: 1,
          upvotes: 0,
          downvotes: 0,
          comments: 0,
        });
    }

    console.log(`✅ View counted — post: ${slug} | session: ${sessionId.slice(0, 8)}... | total: ${newViewCount}`);

    res.json({
      success: true,
      counted: true,
      view_count: newViewCount,
    });
  } catch (err) {
    console.error('POST /posts/:slug/view error:', err);
    res.status(500).json({ error: 'Failed to track view' });
  }
});

// POST /api/posts — create article (admin only)
postsRouter.post('/', requireAuth, async (req: Request, res: Response) => {
  const {
    type = 'article',
    title,
    content,
    snippet,
    source_url,
    source_name,
    thumbnail,
    admin_commentary,
    category = 'General',
    tags = [],
    status = 'draft',
    meta_title,
    meta_description,
    og_image,
    scheduled_at,
  } = req.body;

  if (!title) {
    res.status(400).json({ error: 'Title is required' });
    return;
  }

  try {
    const slug = await generateUniqueSlug(title);
    const published_at = status === 'published' ? new Date().toISOString() : undefined;

    const { data, error } = await supabase
      .from('posts')
      .insert({
        type, title, slug, content, snippet, source_url, source_name,
        thumbnail, admin_commentary, category, tags, status,
        meta_title, meta_description, og_image, scheduled_at, published_at,
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    console.error('POST /posts error:', err);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// PATCH /api/posts/:id — update post (admin only)
postsRouter.patch('/:id', requireAuth, async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  // Auto-set published_at when first publishing
  if (updates.status === 'published' && !updates.published_at) {
    updates.published_at = new Date().toISOString();
  }

  try {
    // Check if content has changed significantly (title or content changed)
    const { data: existingPost } = await supabase
      .from('posts')
      .select('title, content, status')
      .eq('id', id)
      .single();

    const contentChanged = existingPost && (
      (updates.title && updates.title !== existingPost.title) ||
      (updates.content && updates.content !== existingPost.content)
    );

    // If content changed significantly and post is being republished, reset view tracking cache
    if (contentChanged && updates.status === 'published') {
      console.log(`📝 Content updated for post ${id}, resetting in-memory view tracker`);
      viewTracker.resetPostViews(id);
      // NOTE: We do NOT reset view_count in DB — accumulated views are preserved
    }

    const { data, error } = await supabase
      .from('posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('PATCH /posts/:id error:', err);
    res.status(500).json({ error: 'Failed to update post' });
  }
});

// DELETE /api/posts/:id — soft-delete (set status='skipped') to preserve URL for dedup
// We never truly delete RSS posts so the duplicate-check always finds the source_url.
postsRouter.delete('/:id', requireAuth, async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Fetch type first — only hard-delete manually-written articles if needed
    const { data: post } = await supabase.from('posts').select('type').eq('id', id).single();

    if (post?.type === 'rss') {
      // Soft-delete: keep URL in DB so next fetch won't re-import it
      const { error } = await supabase
        .from('posts')
        .update({ status: 'skipped' })
        .eq('id', id);
      if (error) throw error;
    } else {
      // Manual articles can be truly deleted
      const { error } = await supabase.from('posts').delete().eq('id', id);
      if (error) throw error;
    }

    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /posts/:id error:', err);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

// POST /api/posts/bulk-delete — soft-delete multiple posts (admin only)
postsRouter.post('/bulk-delete', requireAuth, async (req: Request, res: Response) => {
  const { ids } = req.body as { ids: string[] };

  if (!Array.isArray(ids) || ids.length === 0) {
    res.status(400).json({ error: 'ids array is required' });
    return;
  }

  try {
    // Soft-delete all: set to 'skipped' so source_url dedup still works on next fetch
    const { error } = await supabase
      .from('posts')
      .update({ status: 'skipped' })
      .in('id', ids);

    if (error) throw error;
    res.json({ success: true, deleted: ids.length });
  } catch (err) {
    console.error('POST /posts/bulk-delete error:', err);
    res.status(500).json({ error: 'Failed to bulk delete posts' });
  }
});

// GET /api/posts/related/:id — related posts by category
postsRouter.get('/related/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const { data: post } = await supabase
      .from('posts')
      .select('category, tags')
      .eq('id', id)
      .single();

    if (!post) { res.json([]); return; }

    const { data } = await supabase
      .from('posts')
      .select('id, type, title, slug, snippet, thumbnail, source_name, category, upvotes, published_at')
      .eq('status', 'published')
      .eq('category', post.category)
      .neq('id', id)
      .order('published_at', { ascending: false })
      .limit(4);

    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch related posts' });
  }
});
