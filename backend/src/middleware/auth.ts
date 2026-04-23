import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_ANON_KEY || 'placeholder'
);

/**
 * Middleware: Verifies Supabase JWT from Authorization: Bearer <token> header.
 * Attaches the user object to req.user on success.
 */
export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized — missing or invalid token' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      res.status(401).json({ error: 'Unauthorized — invalid token' });
      return;
    }

    // Attach user to request for downstream use
    (req as Request & { user: typeof data.user }).user = data.user;
    next();
  } catch {
    res.status(401).json({ error: 'Unauthorized — token verification failed' });
  }
}
