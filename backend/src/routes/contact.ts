// Routes: Contact form submissions
import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase';
import { requireAuth } from '../middleware/auth';
import { contactLimiter } from '../middleware/rateLimit';

export const contactRouter = Router();

// POST /api/contact — submit contact form (rate limited: 3/hr per IP)
contactRouter.post('/', contactLimiter, async (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body;

  // Validation
  if (!name || !email || !subject || !message) {
    res.status(400).json({ error: 'All fields are required' });
    return;
  }

  // Length limits
  if (name.length > 100 || subject.length > 200 || message.length > 5000) {
    res.status(400).json({ error: 'Input too long' });
    return;
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ error: 'Invalid email address' });
    return;
  }

  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .insert({
        name:    name.trim().slice(0, 100),
        email:   email.trim().toLowerCase().slice(0, 254),
        subject: subject.trim().slice(0, 200),
        message: message.trim().slice(0, 5000),
        status:  'unread',
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Contact form submission error:', error);
      res.status(500).json({ error: 'Failed to submit message' });
      return;
    }

    res.json({
      success: true,
      message: 'Thank you for contacting us! We will get back to you soon.',
    });
  } catch (err) {
    console.error('Contact form error:', err);
    res.status(500).json({ error: 'Failed to submit message' });
  }
});

// GET /api/contact — get all contact messages (admin only)
contactRouter.get('/', requireAuth, async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data || []);
  } catch (err) {
    console.error('Failed to fetch contact messages:', err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// PATCH /api/contact/:id — update message status (admin only)
contactRouter.patch('/:id', requireAuth, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['unread', 'read', 'replied', 'archived'].includes(status)) {
    res.status(400).json({ error: 'Invalid status' });
    return;
  }

  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error('Failed to update message status:', err);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// DELETE /api/contact/:id — delete a message (admin only)
contactRouter.delete('/:id', requireAuth, async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ success: true });
  } catch (err) {
    console.error('Failed to delete message:', err);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});
