// Service: Cron Jobs
// NOTE: RSS auto-polling has been intentionally removed.
// Admins can manually fetch feeds from the Feed Manager panel,
// or activate the 2-hour auto-poller via the dedicated poller API.
import cron from 'node-cron';
import { pollAllFeeds } from './rssPoller';
import { supabase } from '../lib/supabase';

// ── RSS Auto-Poller State ──────────────────────────────────────────────────────
// This is in-memory state — the poller runs only while the server is up
// and only when the admin explicitly starts it from the Feed Manager panel.

interface PollerState {
  running: boolean;
  startedAt: string | null;
  lastPollAt: string | null;
  nextPollAt: string | null;
  intervalMs: number;       // default: 2 hours
  timer: NodeJS.Timeout | null;
  totalRuns: number;
}

const POLL_INTERVAL_MS = 2 * 60 * 60 * 1000; // 2 hours

const pollerState: PollerState = {
  running:    false,
  startedAt:  null,
  lastPollAt: null,
  nextPollAt: null,
  intervalMs: POLL_INTERVAL_MS,
  timer:      null,
  totalRuns:  0,
};

function scheduleNextPoll(): void {
  if (pollerState.timer) clearTimeout(pollerState.timer);

  const nextAt = new Date(Date.now() + pollerState.intervalMs);
  pollerState.nextPollAt = nextAt.toISOString();

  pollerState.timer = setTimeout(async () => {
    if (!pollerState.running) return;

    console.log(`[POLLER] ${new Date().toISOString()} — Running scheduled RSS poll`);
    pollerState.lastPollAt = new Date().toISOString();
    pollerState.totalRuns++;

    try {
      await pollAllFeeds();
    } catch (err) {
      console.error('[POLLER] Poll error:', err);
    }

    // Schedule next if still running
    if (pollerState.running) scheduleNextPoll();
  }, pollerState.intervalMs);
}

/** Start the 2-hour auto-poller. Immediately runs a poll, then schedules the next. */
export async function startPoller(): Promise<{ ok: boolean; message: string }> {
  if (pollerState.running) {
    return { ok: false, message: 'Poller is already running' };
  }

  pollerState.running   = true;
  pollerState.startedAt = new Date().toISOString();
  pollerState.totalRuns = 0;

  console.log('[POLLER] Started — running immediate poll then every 2 hours');

  // Run immediately on start
  pollerState.lastPollAt = new Date().toISOString();
  pollerState.totalRuns++;
  try {
    await pollAllFeeds();
  } catch (err) {
    console.error('[POLLER] Initial poll error:', err);
  }

  scheduleNextPoll();
  return { ok: true, message: 'Poller started — running every 2 hours' };
}

/** Stop the 2-hour auto-poller. */
export function stopPoller(): { ok: boolean; message: string } {
  if (!pollerState.running) {
    return { ok: false, message: 'Poller is not running' };
  }

  if (pollerState.timer) {
    clearTimeout(pollerState.timer);
    pollerState.timer = null;
  }

  pollerState.running    = false;
  pollerState.nextPollAt = null;

  console.log('[POLLER] Stopped by admin');
  return { ok: true, message: 'Poller stopped' };
}

/** Get current poller status. */
export function getPollerStatus() {
  return {
    running:    pollerState.running,
    startedAt:  pollerState.startedAt,
    lastPollAt: pollerState.lastPollAt,
    nextPollAt: pollerState.nextPollAt,
    intervalMs: pollerState.intervalMs,
    totalRuns:  pollerState.totalRuns,
  };
}

// ── Other Cron Jobs (analytics + scheduled posts) ─────────────────────────────

export function startCronJobs(): void {
  // ── Daily Analytics Aggregation — every day at midnight ──
  cron.schedule('0 0 * * *', async () => {
    console.log(`[CRON] ${new Date().toISOString()} — Aggregating daily analytics`);
    await aggregateDailyAnalytics();
  });

  // ── Auto-publish scheduled posts — every 5 minutes ───────
  cron.schedule('*/5 * * * *', async () => {
    await publishScheduledPosts();
  });

  console.log('⏰ Cron jobs started:');
  console.log('   • RSS poll: MANUAL only (use Feed Manager or Poller API)');
  console.log('   • Analytics: daily at midnight');
  console.log('   • Scheduled posts: every 5 minutes');
}

async function aggregateDailyAnalytics(): Promise<void> {
  const today = new Date().toISOString().split('T')[0];

  try {
    const { data: posts } = await supabase
      .from('posts')
      .select('id, upvotes, downvotes, view_count')
      .eq('status', 'published');

    if (!posts) return;

    const { data: comments } = await supabase
      .from('comments')
      .select('post_id')
      .eq('status', 'approved')
      .gte('created_at', `${today}T00:00:00Z`);

    const commentCounts: Record<string, number> = {};
    (comments || []).forEach((c) => {
      commentCounts[c.post_id] = (commentCounts[c.post_id] || 0) + 1;
    });

    for (const post of posts) {
      await supabase.from('analytics').upsert({
        post_id:   post.id,
        date:      today,
        views:     post.view_count,
        upvotes:   post.upvotes,
        downvotes: post.downvotes,
        comments:  commentCounts[post.id] || 0,
      }, { onConflict: 'post_id,date' });
    }

    console.log(`[CRON] Aggregated analytics for ${posts.length} posts`);
  } catch (err) {
    console.error('[CRON] Analytics aggregation failed:', err);
  }
}

async function publishScheduledPosts(): Promise<void> {
  try {
    const { data: posts } = await supabase
      .from('posts')
      .select('id')
      .eq('status', 'scheduled')
      .lte('scheduled_at', new Date().toISOString());

    if (!posts || posts.length === 0) return;

    for (const post of posts) {
      await supabase.from('posts').update({
        status:       'published',
        published_at: new Date().toISOString(),
      }).eq('id', post.id);
    }

    if (posts.length > 0) {
      console.log(`[CRON] Auto-published ${posts.length} scheduled posts`);
    }
  } catch (err) {
    console.error('[CRON] Scheduled post publish failed:', err);
  }
}
