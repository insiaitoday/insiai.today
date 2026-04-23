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
import { startCronJobs } from './services/cronJobs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// ── Security middleware ──────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    const targetOrigin = [
      process.env.FRONTEND_URL,
      process.env.ADMIN_URL,
      'http://localhost:3000',
      'http://localhost:3001'
    ];
    if (targetOrigin.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ── Body parsing ─────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

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

// ── Health check ─────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'leviai-backend',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
  });
});

// ── 404 handler ──────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ── Global error handler ─────────────────────────────────────
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ── Start server + cron jobs ──────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 LeviAI Backend running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  startCronJobs();
});

export default app;
