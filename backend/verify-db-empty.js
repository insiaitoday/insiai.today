/**
 * verify-db-empty.js
 */
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  const { count: postCount } = await supabase.from('posts').select('*', { count: 'exact', head: true });
  const { count: commentCount } = await supabase.from('comments').select('*', { count: 'exact', head: true });
  const { count: voteCount } = await supabase.from('post_votes').select('*', { count: 'exact', head: true });
  const { count: analyticsCount } = await supabase.from('analytics').select('*', { count: 'exact', head: true });
  const { count: feedCount } = await supabase.from('rss_feeds').select('*', { count: 'exact', head: true });

  console.log('--- Database Verification ---');
  console.log(`Posts count:      ${postCount}`);
  console.log(`Comments count:   ${commentCount}`);
  console.log(`Votes count:      ${voteCount}`);
  console.log(`Analytics count:  ${analyticsCount}`);
  console.log(`Feeds count:      ${feedCount} (Should be preserved)`);
  
  if (postCount === 0 && commentCount === 0 && voteCount === 0 && analyticsCount === 0) {
    console.log('✅ Database is successfully cleared of news data!');
  } else {
    console.log('❌ Some news data still remains in the database.');
  }
}

main().catch(console.error);
