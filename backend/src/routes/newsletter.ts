// Routes: Newsletter subscriptions
import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase';
import { newsletterLimiter, unsubscribeLimiter } from '../middleware/rateLimit';

export const newsletterRouter = Router();

// POST /api/newsletter/subscribe
newsletterRouter.post('/subscribe', newsletterLimiter, async (req: Request, res: Response) => {
  const { email, frequency = 'weekly' } = req.body;

  if (!email) { res.status(400).json({ error: 'Email is required' }); return; }

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(email)) { res.status(400).json({ error: 'Invalid email' }); return; }

  if (!['daily', 'weekly'].includes(frequency)) {
    res.status(400).json({ error: 'Invalid frequency' }); return;
  }

  try {
    await supabase
      .from('newsletter_subscribers')
      .upsert({ email: email.toLowerCase().trim(), frequency }, { onConflict: 'email' });

    res.json({ success: true, message: 'Successfully subscribed to INSI AI Today newsletter!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to subscribe' });
  }
});

// POST /api/newsletter/unsubscribe (rate limited)
newsletterRouter.post('/unsubscribe', unsubscribeLimiter, async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) { res.status(400).json({ error: 'Email is required' }); return; }

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(email)) { res.status(400).json({ error: 'Invalid email' }); return; }

  try {
    await supabase.from('newsletter_subscribers').delete().eq('email', email.toLowerCase().trim());
    res.json({ success: true, message: 'Unsubscribed successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to unsubscribe' });
  }
});
