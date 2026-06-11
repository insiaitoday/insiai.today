import { Request } from 'express';

/**
 * Gets the actual client IP address, handling proxy headers robustly.
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    const ips = typeof forwarded === 'string' ? forwarded.split(',') : forwarded;
    if (Array.isArray(ips) && ips.length > 0) {
      const clientIp = ips[0].trim();
      if (clientIp) return clientIp;
    }
  }
  return req.ip || req.socket.remoteAddress || '0.0.0.0';
}
