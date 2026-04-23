// Test a single RSS feed URL
// Usage: node test-single-feed.js "https://example.com/feed.xml"

const Parser = require('rss-parser');
const parser = new Parser({
  timeout: 10000,
  headers: { 'User-Agent': 'LeviAIToday/1.0 RSS Reader' }
});

async function testFeed(url) {
  console.log('🔍 Testing RSS Feed...\n');
  console.log(`URL: ${url}\n`);

  try {
    console.log('⏳ Fetching feed...');
    const feed = await parser.parseURL(url);

    console.log('✅ Feed is valid!\n');
    console.log('═'.repeat(60));
    console.log('📊 Feed Information:');
    console.log('═'.repeat(60));
    console.log(`Title:       ${feed.title || 'N/A'}`);
    console.log(`Description: ${feed.description?.substring(0, 100) || 'N/A'}...`);
    console.log(`Link:        ${feed.link || 'N/A'}`);
    console.log(`Items:       ${feed.items?.length || 0}`);
    console.log('═'.repeat(60));

    if (feed.items && feed.items.length > 0) {
      console.log('\n📰 Latest 5 Articles:\n');
      feed.items.slice(0, 5).forEach((item, i) => {
        const pubDate = item.pubDate ? new Date(item.pubDate).toISOString().split('T')[0] : 'N/A';
        console.log(`${i + 1}. ${item.title}`);
        console.log(`   Published: ${pubDate}`);
        console.log(`   Link: ${item.link}`);
        console.log('');
      });
    }

    console.log('✅ This feed is working correctly!');
    console.log('💡 You can use this URL in your RSS feed manager.\n');

  } catch (error) {
    console.log('❌ Feed test failed!\n');
    console.log('Error:', error.message);
    console.log('\n💡 Troubleshooting tips:');
    console.log('   1. Check if the URL is correct');
    console.log('   2. Try opening the URL in a browser');
    console.log('   3. Look for RSS icon on the website');
    console.log('   4. Try common patterns: /feed, /rss, /feed.xml');
    console.log('   5. Some sites may not have RSS feeds\n');
  }
}

const url = process.argv[2];

if (!url) {
  console.log('❌ Please provide a feed URL\n');
  console.log('Usage: node test-single-feed.js "https://example.com/feed.xml"\n');
  console.log('Examples:');
  console.log('  node test-single-feed.js "https://openai.com/blog/rss"');
  console.log('  node test-single-feed.js "https://techcrunch.com/tag/artificial-intelligence/feed/"\n');
  process.exit(1);
}

testFeed(url);
