// ============================================================
// Routes: POST management (public reads + admin writes)
// ============================================================

import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase';
import { generateUniqueSlug } from '../lib/slugify';
import { requireAuth } from '../middleware/auth';
import { generalLimiter } from '../middleware/rateLimit';

export const postsRouter = Router();

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
  const limitNum = Math.min(50, parseInt(limit as string));
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

    // Sorting
    if (sort === 'new')  query = query.order('created_at', { ascending: false });
    if (sort === 'old')  query = query.order('created_at', { ascending: true });
    if (sort === 'top')  query = query.order('upvotes', { ascending: false });
    if (sort === 'hot') {
      // Hot = upvotes weighted by recency (last 48hrs bonus)
      query = query.order('upvotes', { ascending: false }).order('published_at', { ascending: false });
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

// GET /api/posts/:slug — single post + view count increment
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

    // Increment view count (fire and forget)
    supabase
      .from('posts')
      .update({ view_count: data.view_count + 1 })
      .eq('id', data.id)
      .then(() => {});

    const comment_count = data.comments?.[0]?.count || 0;
    delete data.comments;

    res.json({ ...data, comment_count });
  } catch (err) {
    console.error('GET /posts/:slug error:', err);
    res.status(500).json({ error: 'Failed to fetch post' });
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
