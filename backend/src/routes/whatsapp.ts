// Routes: WhatsApp Subscription Management
import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase';
import { requireAuth } from '../middleware/auth';
import { generalLimiter } from '../middleware/rateLimit';
import { getClientIp } from '../lib/ip';

export const whatsappRouter = Router();

// POST /api/whatsapp/subscribe — public endpoint to collect phone numbers
whatsappRouter.post('/subscribe', generalLimiter, async (req: Request, res: Response) => {
  const { phone_number, country_code, name, interests, language = 'en' } = req.body;

  if (!phone_number || !country_code) {
    res.status(400).json({ error: 'Phone number and country code are required' });
    return;
  }

  try {
    // Format to E.164 (international format)
    const full_number = `${country_code}${phone_number.replace(/\D/g, '')}`;

    // Check if already subscribed
    const { data: existing } = await supabase
      .from('whatsapp_subscribers')
      .select('id, status')
      .eq('full_number', full_number)
      .maybeSingle();

    if (existing) {
      if (existing.status === 'unsubscribed') {
        // Reactivate subscription
        await supabase
          .from('whatsapp_subscribers')
          .update({ status: 'pending', updated_at: new Date().toISOString() })
          .eq('id', existing.id);
        res.json({ success: true, message: 'Subscription reactivated!' });
      } else {
        res.status(409).json({ error: 'This number is already subscribed' });
      }
      return;
    }

    // Get IP and user agent
    const ip_address = getClientIp(req);
    const user_agent = req.headers['user-agent'] || 'unknown';

    // Insert new subscriber
    const { data, error } = await supabase
      .from('whatsapp_subscribers')
      .insert({
        phone_number,
        country_code,
        full_number,
        name,
        interests: interests || [],
        language,
        status: 'pending',
        verified: false,
        ip_address,
        user_agent,
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed! You will be added to our WhatsApp group soon.',
      data: {
        id: data.id,
        phone_number: full_number,
        status: data.status,
      },
    });
  } catch (err) {
    console.error('WhatsApp subscribe error:', err);
    res.status(500).json({ error: 'Failed to subscribe' });
  }
});

// POST /api/whatsapp/unsubscribe — public endpoint to unsubscribe
whatsappRouter.post('/unsubscribe', generalLimiter, async (req: Request, res: Response) => {
  const { phone_number, country_code } = req.body;

  if (!phone_number || !country_code) {
    res.status(400).json({ error: 'Phone number and country code are required' });
    return;
  }

  try {
    const full_number = `${country_code}${phone_number.replace(/\D/g, '')}`;

    const { error } = await supabase
      .from('whatsapp_subscribers')
      .update({ status: 'unsubscribed', updated_at: new Date().toISOString() })
      .eq('full_number', full_number);

    if (error) throw error;

    res.json({ success: true, message: 'Successfully unsubscribed' });
  } catch (err) {
    console.error('WhatsApp unsubscribe error:', err);
    res.status(500).json({ error: 'Failed to unsubscribe' });
  }
});

// GET /api/whatsapp/subscribers — admin only, list all subscribers
whatsappRouter.get('/subscribers', requireAuth, async (req: Request, res: Response) => {
  const { status, page = '1', limit = '50', search } = req.query;

  const pageNum = Math.max(1, parseInt(page as string));
  const limitNum = Math.min(100, parseInt(limit as string));
  const offset = (pageNum - 1) * limitNum;

  try {
    let query = supabase
      .from('whatsapp_subscribers')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (status) query = query.eq('status', status);
    if (search) {
      const searchTerm = search as string;
      query = query.or(`full_number.ilike.%${searchTerm}%,name.ilike.%${searchTerm}%`);
    }

    query = query.range(offset, offset + limitNum - 1);

    const { data, error, count } = await query;
    if (error) throw error;

    res.json({
      subscribers: data,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: count ?? 0,
        totalPages: Math.ceil((count ?? 0) / limitNum),
      },
    });
  } catch (err) {
    console.error('Get subscribers error:', err);
    res.status(500).json({ error: 'Failed to fetch subscribers' });
  }
});

// PATCH /api/whatsapp/subscribers/:id — admin only, update subscriber status
whatsappRouter.patch('/subscribers/:id', requireAuth, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, verified } = req.body;

  try {
    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (status) updates.status = status;
    if (verified !== undefined) updates.verified = verified;

    const { data, error } = await supabase
      .from('whatsapp_subscribers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Update subscriber error:', err);
    res.status(500).json({ error: 'Failed to update subscriber' });
  }
});

// DELETE /api/whatsapp/subscribers/:id — admin only, delete subscriber
whatsappRouter.delete('/subscribers/:id', requireAuth, async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from('whatsapp_subscribers')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    console.error('Delete subscriber error:', err);
    res.status(500).json({ error: 'Failed to delete subscriber' });
  }
});

// GET /api/whatsapp/stats — admin only, get subscription stats
whatsappRouter.get('/stats', requireAuth, async (_req: Request, res: Response) => {
  try {
    const [total, pending, verified, active, unsubscribed] = await Promise.all([
      supabase.from('whatsapp_subscribers').select('id', { count: 'exact', head: true }),
      supabase.from('whatsapp_subscribers').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('whatsapp_subscribers').select('id', { count: 'exact', head: true }).eq('verified', true),
      supabase.from('whatsapp_subscribers').select('id', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('whatsapp_subscribers').select('id', { count: 'exact', head: true }).eq('status', 'unsubscribed'),
    ]);

    res.json({
      total: total.count || 0,
      pending: pending.count || 0,
      verified: verified.count || 0,
      active: active.count || 0,
      unsubscribed: unsubscribed.count || 0,
    });
  } catch (err) {
    console.error('Get stats error:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// POST /api/whatsapp/export — admin only, export subscribers as CSV
whatsappRouter.post('/export', requireAuth, async (req: Request, res: Response) => {
  const { status } = req.body;

  try {
    let query = supabase
      .from('whatsapp_subscribers')
      .select('full_number, name, country_code, status, verified, interests, created_at')
      .order('created_at', { ascending: false });

    if (status) query = query.eq('status', status);

    const { data, error } = await query;
    if (error) throw error;

    // Format as CSV
    const csv = [
      'Phone Number,Name,Country Code,Status,Verified,Interests,Joined Date',
      ...(data || []).map(s =>
        `${s.full_number},"${s.name || ''}",${s.country_code},${s.status},${s.verified},"${(s.interests || []).join(', ')}",${s.created_at}`
      ),
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="whatsapp-subscribers-${new Date().toISOString().split('T')[0]}.csv"`);
    res.send(csv);
  } catch (err) {
    console.error('Export error:', err);
    res.status(500).json({ error: 'Failed to export subscribers' });
  }
});
