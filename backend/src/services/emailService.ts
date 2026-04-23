// Service: Email notifications and newsletter via Resend
import dotenv from 'dotenv';
dotenv.config();

// Resend is optional — gracefully no-op if key not set
let resendClient: { emails: { send: (opts: Record<string, unknown>) => Promise<unknown> } } | null = null;

async function getResend() {
  if (resendClient) return resendClient;
  const key = process.env.RESEND_API_KEY;
  if (!key || key.startsWith('re_YOUR')) {
    console.warn('⚠️  Resend API key not configured — email features disabled');
    return null;
  }
  const { Resend } = await import('resend');
  resendClient = new Resend(key) as unknown as typeof resendClient;
  return resendClient;
}

const FROM = process.env.RESEND_FROM_EMAIL || 'newsletter@leviai.today';

export async function sendAdminNotification(subject: string, html: string): Promise<void> {
  const resend = await getResend();
  if (!resend) return;

  try {
    await resend.emails.send({
      from: FROM,
      to: [process.env.ADMIN_EMAIL || 'admin@leviai.today'],
      subject,
      html,
    });
  } catch (err) {
    console.error('Failed to send admin notification:', err);
  }
}

export async function sendNewsletterDigest(subscribers: string[], subject: string, html: string): Promise<void> {
  const resend = await getResend();
  if (!resend) {
    console.log('📧 Newsletter would have been sent to', subscribers.length, 'subscribers (Resend not configured)');
    return;
  }

  // Send in batches of 50
  const BATCH = 50;
  for (let i = 0; i < subscribers.length; i += BATCH) {
    const batch = subscribers.slice(i, i + BATCH);
    await resend.emails.send({
      from: FROM,
      to: batch,
      subject,
      html,
    });
    await new Promise((r) => setTimeout(r, 200)); // rate limit
  }
}
