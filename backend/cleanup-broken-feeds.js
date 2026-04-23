// Clean up broken RSS feeds from database
// This will disable all feeds that are returning errors

const brokenFeeds = [
  'InfoQ AI',
  'Reddit r/artificial',
  'Reddit r/MachineLearning',
  'Reddit r/LocalLLaMA',
  'Fast.ai Blog',
  'Weights & Biases Blog',
  'Scale AI Blog',
  'NVIDIA AI Blog',
  'Hacker News AI',
  'Anthropic Blog',
  'Meta AI Research',
  'Mistral AI',
  'Cohere AI Blog',
  'Stability AI News',
  'xAI (Grok)',
  'Perplexity AI Blog',
  'Inflection AI',
  'Adept AI Blog',
  'Meta AI Blog',
  'Open AI News',
  'OpenAI Blog',
  'The Verge AI',
  'VentureBeat AI',
  'Anthropic News',
  'Azure AI Blog',
  'Replicate Blog',
  'Modal Labs Blog',
  'The Batch (DeepLearning.AI)',
  'Papers With Code',
  'Runway ML Blog',
  'Midjourney News',
  'ElevenLabs Blog',
  'Together AI Blog',
  'Anyscale Blog',
  'Character.AI Blog',
  'O\'Reilly AI',
  'ZDNet AI',
];

async function cleanupBrokenFeeds() {
  const API_URL = process.env.API_URL || 'http://localhost:3002';
  const token = process.env.ADMIN_TOKEN;

  if (!token) {
    console.error('❌ Please set ADMIN_TOKEN environment variable');
    console.log('\nGet your token from browser console (F12):');
    console.log('  JSON.parse(localStorage.getItem("leviai_admin_session")).access_token\n');
    process.exit(1);
  }

  console.log('🧹 Cleaning up broken RSS feeds...\n');

  // First, get all feeds
  const response = await fetch(`${API_URL}/api/rss/feeds`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    console.error('❌ Failed to fetch feeds');
    process.exit(1);
  }

  const allFeeds = await response.json();
  console.log(`📊 Total feeds in database: ${allFeeds.length}\n`);

  let disabled = 0;
  let deleted = 0;
  let notFound = 0;

  for (const brokenName of brokenFeeds) {
    const feed = allFeeds.find(f => f.name === brokenName);

    if (!feed) {
      console.log(`⚠️  Not found: ${brokenName}`);
      notFound++;
      continue;
    }

    try {
      // Delete the broken feed
      const deleteResponse = await fetch(`${API_URL}/api/rss/feeds/${feed.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (deleteResponse.ok) {
        console.log(`🗑️  Deleted: ${brokenName}`);
        deleted++;
      } else {
        console.log(`❌ Failed to delete: ${brokenName}`);
      }
    } catch (err) {
      console.log(`❌ Error deleting ${brokenName}:`, err.message);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📈 Cleanup Summary:');
  console.log(`   🗑️  Deleted: ${deleted}`);
  console.log(`   ⚠️  Not found: ${notFound}`);
  console.log(`   📊 Total processed: ${brokenFeeds.length}`);
  console.log('='.repeat(60));
  console.log('\n✅ Cleanup complete!');
  console.log('💡 Now run: node verified-working-feeds.js to add working feeds\n');
}

cleanupBrokenFeeds();
