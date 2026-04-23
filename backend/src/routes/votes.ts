// Routes: Upvote / Downvote
import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase';
import { voteLimiter } from '../middleware/rateLimit';

export const votesRouter = Router();

// POST /api/posts/:id/vote  body: { type: 'up' | 'down' }
votesRouter.post('/:id/vote', voteLimiter, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { type } = req.body as { type: 'up' | 'down' };
  const ip = req.ip || '0.0.0.0';

  if (!['up', 'down'].includes(type)) {
    res.status(400).json({ error: 'Vote type must be "up" or "down"' });
    return;
  }

  try {
    // Check if already voted
    const { data: existing } = await supabase
      .from('post_votes')
      .select('id, vote_type')
      .eq('post_id', id)
      .eq('ip_address', ip)
      .maybeSingle();

    if (existing) {
      // Toggle: same type = remove vote, different = switch
      if (existing.vote_type === type) {
        // Remove vote
        await supabase.from('post_votes').delete().eq('id', existing.id);
        const col = type === 'up' ? 'upvotes' : 'downvotes';
        const { data: post } = await supabase.from('posts').select(col).eq('id', id).single();
        await supabase.from('posts').update({ [col]: Math.max(0, (post as Record<string, number>)[col] - 1) }).eq('id', id);
        res.json({ action: 'removed', type });
        return;
      } else {
        // Switch vote
        await supabase.from('post_votes').update({ vote_type: type }).eq('id', existing.id);
        const addCol    = type === 'up' ? 'upvotes'   : 'downvotes';
        const removeCol = type === 'up' ? 'downvotes' : 'upvotes';
        const { data: post } = await supabase.from('posts').select(`${addCol}, ${removeCol}`).eq('id', id).single();
        const p = post as Record<string, number>;
        await supabase.from('posts').update({
          [addCol]:    p[addCol] + 1,
          [removeCol]: Math.max(0, p[removeCol] - 1),
        }).eq('id', id);
        res.json({ action: 'switched', type });
        return;
      }
    }

    // New vote
    await supabase.from('post_votes').insert({ post_id: id, ip_address: ip, vote_type: type });
    const col = type === 'up' ? 'upvotes' : 'downvotes';
    const { data: post } = await supabase.from('posts').select(col).eq('id', id).single();
    await supabase.from('posts').update({ [col]: (post as Record<string, number>)[col] + 1 }).eq('id', id);

    res.json({ action: 'added', type });
  } catch (err) {
    console.error('Vote error:', err);
    res.status(500).json({ error: 'Failed to process vote' });
  }
});

// GET /api/posts/:id/my-vote — check if IP already voted
votesRouter.get('/:id/my-vote', async (req: Request, res: Response) => {
  const { id } = req.params;
  const ip = req.ip || '0.0.0.0';

  const { data } = await supabase
    .from('post_votes')
    .select('vote_type')
    .eq('post_id', id)
    .eq('ip_address', ip)
    .maybeSingle();

  res.json({ vote: data?.vote_type || null });
});
