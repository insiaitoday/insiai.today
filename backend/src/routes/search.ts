// Routes: Full-text search
import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase';
import { generalLimiter } from '../middleware/rateLimit';

export const searchRouter = Router();

// GET /api/search?q=text&page=1
searchRouter.get('/', generalLimiter, async (req: Request, res: Response) => {
  const { q, page = '1', limit = '12' } = req.query;

  if (!q || (q as string).trim().length < 2) {
    res.status(400).json({ error: 'Search query must be at least 2 characters' });
    return;
  }

  const pageNum  = Math.max(1, parseInt(page as string));
  const limitNum = Math.min(50, parseInt(limit as string));
  const offset   = (pageNum - 1) * limitNum;
  // Escape SQL LIKE wildcards to prevent pattern injection
  const query    = (q as string).trim().replace(/%/g, '\\%').replace(/_/g, '\\_');

  try {
    const { data, error, count } = await supabase
      .from('posts')
      .select('id, type, title, slug, snippet, thumbnail, source_name, category, upvotes, view_count, published_at, comments(count)', { count: 'exact' })
      .eq('status', 'published')
      .or(`title.ilike.%${query}%,snippet.ilike.%${query}%,content.ilike.%${query}%`)
      .order('published_at', { ascending: false })
      .range(offset, offset + limitNum - 1);

    if (error) throw error;

    const formattedResults = (data || []).map((post: any) => {
      const comment_count = post.comments?.[0]?.count || 0;
      delete post.comments;
      return { ...post, comment_count };
    });

    res.json({
      results: formattedResults,
      query,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limitNum),
      },
    });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: 'Search failed' });
  }
});
