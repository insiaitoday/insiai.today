/**
 * clear-news-data.js
 * 
 * Clears all news data (posts, comments, votes, and analytics) from the database
 * while preserving schemas, tables, and other data (feeds, subscribers, contacts).
 * 
 * Run with: node clear-news-data.js
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  console.log('🚀 Starting database cleanup for news data...');

  // 1. Delete comments
  console.log('🧹 Clearing table: comments...');
  const { error: commentsErr } = await supabase
    .from('comments')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Deletes all rows

  if (commentsErr) {
    console.error('❌ Failed to clear comments:', commentsErr.message);
  } else {
    console.log('✅ comments cleared.');
  }

  // 2. Delete post votes
  console.log('🧹 Clearing table: post_votes...');
  const { error: votesErr } = await supabase
    .from('post_votes')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');

  if (votesErr) {
    console.error('❌ Failed to clear post_votes:', votesErr.message);
  } else {
    console.log('✅ post_votes cleared.');
  }

  // 3. Delete analytics
  console.log('🧹 Clearing table: analytics...');
  const { error: analyticsErr } = await supabase
    .from('analytics')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');

  if (analyticsErr) {
    console.error('❌ Failed to clear analytics:', analyticsErr.message);
  } else {
    console.log('✅ analytics cleared.');
  }

  // 4. Delete posts
  console.log('🧹 Clearing table: posts...');
  const { error: postsErr } = await supabase
    .from('posts')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');

  if (postsErr) {
    console.error('❌ Failed to clear posts:', postsErr.message);
  } else {
    console.log('✅ posts cleared.');
  }

  console.log('\n🎉 Database cleanup complete! Only news-related tables were cleared.');
}

main().catch(err => {
  console.error('Fatal error during cleanup:', err);
  process.exit(1);
});
