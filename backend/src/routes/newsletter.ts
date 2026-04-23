// Routes: Newsletter subscriptions
import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase';
import { newsletterLimiter } from '../middleware/rateLimit';

export const newsletterRouter = Router();

// POST /api/newsletter/subscribe
newsletterRouter.post('/subscribe', newsletterLimiter, async (req: Request, res: Response) => {
  const { email, frequency = 'weekly' } = req.body;

  if (!email) { res.status(400).json({ error: 'Email is required' }); return; }

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(email)) { res.status(400).json({ error: 'Invalid email' }); return; }

  try {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .upsert({ email: email.toLowerCase(), frequency }, { onConflict: 'email' })
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, message: 'Successfully subscribed to LeviAI Today newsletter!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to subscribe' });
  }
});

// POST /api/newsletter/unsubscribe
newsletterRouter.post('/unsubscribe', async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) { res.status(400).json({ error: 'Email is required' }); return; }

  try {
    await supabase.from('newsletter_subscribers').delete().eq('email', email.toLowerCase());
    res.json({ success: true, message: 'Unsubscribed successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to unsubscribe' });
  }
});
