import rateLimit from 'express-rate-limit';
import { Request } from 'express';

/**
 * General public API rate limiter — 500 req/15min per IP.
 * Authenticated admin requests (Bearer token present) are skipped entirely.
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  // Skip rate limiting for authenticated admin requests
  skip: (req: Request) => {
    return !!(req.headers.authorization?.startsWith('Bearer '));
  },
  message: { error: 'Too many requests — please try again later' },
});

/** Vote limiter — 30 votes per IP per 10 minutes */
export const voteLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 30,
  keyGenerator: (req) => req.ip + ':votes',
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Slow down — too many votes' },
});

/** Comment limiter — 5 comments per IP per hour */
export const commentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  keyGenerator: (req) => req.ip + ':comments',
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many comments — please wait before posting again' },
});

/** Newsletter limiter — 3 subscribes per IP per hour */
export const newsletterLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  keyGenerator: (req) => req.ip + ':newsletter',
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many subscription attempts' },
});

/** Contact limiter — 3 submissions per IP per hour */
export const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  keyGenerator: (req) => req.ip + ':contact',
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many contact submissions — please wait before trying again' },
});

/** Unsubscribe limiter — 5 per IP per hour */
export const unsubscribeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  keyGenerator: (req) => req.ip + ':unsub',
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many unsubscribe attempts' },
});
