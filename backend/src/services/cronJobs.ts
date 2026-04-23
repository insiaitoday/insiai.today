// Service: Cron Jobs
import cron from 'node-cron';
import { pollAllFeeds } from './rssPoller';
import { supabase } from '../lib/supabase';

export function startCronJobs(): void {
  // ── RSS Fetch — every 2 hours ────────────────────────────
  cron.schedule('0 */2 * * *', async () => {
    console.log(`[CRON] ${new Date().toISOString()} — Running RSS poll`);
    await pollAllFeeds();
  });

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
  console.log('   • RSS poll: every 2 hours');
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

    // Get today's comment counts
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
        post_id:    post.id,
        date:       today,
        views:      post.view_count,
        upvotes:    post.upvotes,
        downvotes:  post.downvotes,
        comments:   commentCounts[post.id] || 0,
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
        status: 'published',
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
