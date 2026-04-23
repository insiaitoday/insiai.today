// RSS Feed Validator - Test all feeds before adding
// Run with: node validate-feeds.js

const Parser = require('rss-parser');
const parser = new Parser({ timeout: 10000 });

const feedsToValidate = [
  { name: 'OpenAI Blog', url: 'https://openai.com/blog/rss' },
  { name: 'Anthropic Blog', url: 'https://www.anthropic.com/news/rss' },
  { name: 'Google DeepMind', url: 'https://deepmind.google/blog/rss.xml' },
  { name: 'Google AI Blog', url: 'https://blog.google/technology/ai/rss' },
  { name: 'Meta AI Research', url: 'https://ai.meta.com/blog/rss/' },
  { name: 'Microsoft AI Blog', url: 'https://blogs.microsoft.com/ai/feed/' },
  { name: 'Mistral AI', url: 'https://mistral.ai/news/feed/' },
  { name: 'Cohere AI Blog', url: 'https://cohere.com/blog/rss.xml' },
  { name: 'Hugging Face Blog', url: 'https://huggingface.co/blog/feed.xml' },
  { name: 'Stability AI News', url: 'https://stability.ai/news/rss' },
  { name: 'TechCrunch AI', url: 'https://techcrunch.com/tag/artificial-intelligence/feed/' },
  { name: 'The Verge AI', url: 'https://www.theverge.com/ai-artificial-intelligence/rss/index.xml' },
  { name: 'VentureBeat AI', url: 'https://venturebeat.com/category/ai/feed/' },
  { name: 'Wired AI', url: 'https://www.wired.com/feed/tag/ai/latest/rss' },
  { name: 'MIT Technology Review', url: 'https://www.technologyreview.com/topic/artificial-intelligence/feed/' },
  { name: 'ArXiv CS.AI', url: 'https://rss.arxiv.org/rss/cs.AI' },
  { name: 'ArXiv CS.LG', url: 'https://rss.arxiv.org/rss/cs.LG' },
  { name: 'NVIDIA AI Blog', url: 'https://blogs.nvidia.com/blog/category/deep-learning/feed/' },
  { name: 'AWS ML Blog', url: 'https://aws.amazon.com/blogs/machine-learning/feed/' },
  { name: 'LangChain Blog', url: 'https://blog.langchain.dev/rss/' },
];

async function validateFeed(feed) {
  try {
    const result = await parser.parseURL(feed.url);
    const itemCount = result.items?.length || 0;
    const latestItem = result.items?.[0];
    const latestDate = latestItem?.pubDate ? new Date(latestItem.pubDate).toISOString().split('T')[0] : 'N/A';

    return {
      success: true,
      name: feed.name,
      itemCount,
      latestDate,
      latestTitle: latestItem?.title?.substring(0, 60) || 'N/A',
    };
  } catch (error) {
    return {
      success: false,
      name: feed.name,
      error: error.message,
    };
  }
}

async function validateAllFeeds() {
  console.log('🔍 Validating RSS feeds...\n');
  console.log('This will test the top 20 feeds to ensure they are accessible.\n');

  const results = [];
  let successCount = 0;
  let failCount = 0;

  for (const feed of feedsToValidate) {
    process.stdout.write(`Testing ${feed.name}... `);
    const result = await validateFeed(feed);
    results.push(result);

    if (result.success) {
      console.log(`✅ OK (${result.itemCount} items, latest: ${result.latestDate})`);
      successCount++;
    } else {
      console.log(`❌ FAILED: ${result.error}`);
      failCount++;
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('📊 Validation Summary:');
  console.log(`   ✅ Working: ${successCount}/${feedsToValidate.length}`);
  console.log(`   ❌ Failed: ${failCount}/${feedsToValidate.length}`);
  console.log('='.repeat(80));

  if (failCount > 0) {
    console.log('\n⚠️  Failed feeds:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`   - ${r.name}: ${r.error}`);
    });
  }

  console.log('\n💡 Note: Some feeds may fail due to:');
  console.log('   - Network issues or rate limiting');
  console.log('   - Changed RSS URLs (check company blogs)');
  console.log('   - Temporary server downtime');
  console.log('\n✅ If most feeds are working, you can proceed with adding them!');
}

validateAllFeeds();
