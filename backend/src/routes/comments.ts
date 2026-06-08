// Routes: Comments (nested replies)
import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase';
import { requireAuth } from '../middleware/auth';
import { commentLimiter } from '../middleware/rateLimit';

export const commentsRouter = Router();

// GET /api/posts/:id/comments — all approved comments with replies
commentsRouter.get('/:id/comments', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', id)
      .eq('status', 'approved')
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Build nested tree
    const roots: typeof data = [];
    const map: Record<string, typeof data[0] & { replies: typeof data }> = {};

    (data || []).forEach((c) => {
      map[c.id] = { ...c, replies: [] };
    });

    (data || []).forEach((c) => {
      if (c.parent_id && map[c.parent_id]) {
        map[c.parent_id].replies.push(map[c.id]);
      } else {
        roots.push(map[c.id]);
      }
    });

    res.json(roots);
  } catch (err) {
    console.error('GET comments error:', err);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// POST /api/posts/:id/comments — submit a comment
commentsRouter.post('/:id/comments', commentLimiter, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { author_name, author_email, content, parent_id } = req.body;
  const ip = req.ip || '0.0.0.0';

  if (!author_name || !author_email || !content) {
    res.status(400).json({ error: 'Name, email and content are required' });
    return;
  }

  if (content.length > 2000) {
    res.status(400).json({ error: 'Comment too long (max 2000 chars)' });
    return;
  }

  // Basic email validation
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(author_email)) {
    res.status(400).json({ error: 'Invalid email address' });
    return;
  }

  try {
    const { data, error } = await supabase
      .from('comments')
      .insert({
        post_id: id,
        parent_id: parent_id || null,
        author_name: author_name.trim(),
        author_email: author_email.trim().toLowerCase(),
        content: content.trim(),
        status: 'pending',
        ip_address: ip,
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      ...data,
      message: 'Comment submitted — it will appear after moderation',
    });
  } catch (err) {
    console.error('POST comment error:', err);
    res.status(500).json({ error: 'Failed to submit comment' });
  }
});

// GET /api/posts/comments/all — all comments for admin (admin only)
commentsRouter.get('/comments/all', requireAuth, async (req: Request, res: Response) => {
  const { status, page = '1', limit = '30' } = req.query;
  const pageNum  = parseInt(page as string);
  const limitNum = parseInt(limit as string);

  try {
    let query = supabase
      .from('comments')
      .select('*, posts(title, slug)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((pageNum - 1) * limitNum, pageNum * limitNum - 1);

    if (status) query = query.eq('status', status);

    const { data, error, count } = await query;
    if (error) throw error;

    res.json({ comments: data, total: count });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// PATCH /api/posts/comments/:commentId — moderate comment (admin only)
commentsRouter.patch('/comments/:commentId', requireAuth, async (req: Request, res: Response) => {
  const { commentId } = req.params;
  const { status } = req.body;

  // Validate status to prevent invalid DB values
  if (!['approved', 'pending', 'spam'].includes(status)) {
    res.status(400).json({ error: 'Invalid status. Must be: approved, pending, or spam' });
    return;
  }

  try {
    const { data, error } = await supabase
      .from('comments')
      .update({ status })
      .eq('id', commentId)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update comment' });
  }
});

// DELETE /api/posts/comments/:commentId — delete (admin only)
commentsRouter.delete('/comments/:commentId', requireAuth, async (req: Request, res: Response) => {
  const { commentId } = req.params;

  try {
    const { error } = await supabase.from('comments').delete().eq('id', commentId);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});
