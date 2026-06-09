// ============================================================
// Backend Entry Point — Express App + Cron Bootstrap
// ============================================================

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import { postsRouter } from './routes/posts';
import { votesRouter } from './routes/votes';
import { commentsRouter } from './routes/comments';
import { rssRouter } from './routes/rss';
import { adminRouter } from './routes/admin';
import { newsletterRouter } from './routes/newsletter';
import { analyticsRouter } from './routes/analytics';
import { searchRouter } from './routes/search';
import { uploadRouter } from './routes/upload';
import { whatsappRouter } from './routes/whatsapp';
import { contactRouter } from './routes/contact';
import { startCronJobs } from './services/cronJobs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// ── Security middleware ──────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// ── Allowed origins (hardcoded + env) ───────────────────────
const ALLOWED_ORIGINS: (string | RegExp)[] = [
  // Production — main domains
  'https://insiaitoday.com',
  'https://www.insiaitoday.com',
  'https://insiai.today',
  'https://www.insiai.today',
  'https://admin.insiai.today',
  // Vercel preview deployments (*.vercel.app)
  /^https:\/\/insiai[-a-z0-9]*\.vercel\.app$/,
  /^https:\/\/insiai-today[-a-z0-9]*\.vercel\.app$/,
  // Local development
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
];

function isOriginAllowed(origin: string): boolean {
  // Also check env-based URLs (set in Render dashboard)
  const envOrigins = [
    process.env.FRONTEND_URL,
    process.env.ADMIN_URL,
  ].filter(Boolean) as string[];

  for (const allowed of [...ALLOWED_ORIGINS, ...envOrigins]) {
    if (typeof allowed === 'string' && allowed === origin) return true;
    if (allowed instanceof RegExp && allowed.test(origin)) return true;
  }
  return false;
}

app.use(cors({
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Allow requests with no origin (server-to-server, mobile apps, curl)
    if (!origin) return callback(null, true);

    if (isOriginAllowed(origin)) {
      return callback(null, true);
    }

    // Do NOT throw — just deny cleanly (avoids flooding global error handler)
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ── Handle CORS pre-flight OPTIONS cleanly ───────────────────
app.options('*', cors());

// ── Body parsing ─────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Static files for uploads ─────────────────────────────────
app.use('/uploads', express.static('public/uploads'));

// ── Routes ───────────────────────────────────────────────────
app.use('/api/posts',      postsRouter);
app.use('/api/posts',      votesRouter);
app.use('/api/posts',      commentsRouter);
app.use('/api/rss',        rssRouter);
app.use('/api/admin',      adminRouter);
app.use('/api/newsletter', newsletterRouter);
app.use('/api/analytics',  analyticsRouter);
app.use('/api/search',     searchRouter);
app.use('/api/upload',     uploadRouter);
app.use('/api/whatsapp',   whatsappRouter);
app.use('/api/contact',    contactRouter);

// ── Health check ─────────────────────────────────────────────
app.get('/health', (_req: express.Request, res: express.Response) => {
  res.json({
    status: 'ok',
    service: 'insiai-backend',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
  });
});

// ── 404 handler ──────────────────────────────────────────────
app.use((_req: express.Request, res: express.Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// ── Global error handler ─────────────────────────────────────
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ── Start server + cron jobs ──────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 INSI Backend running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  startCronJobs();
});

export default app;
