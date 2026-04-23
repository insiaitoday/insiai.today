// Script to add web scraper feeds to database
// Run with: node add-scraper-feeds.js

const feeds = [
  {
    name: 'Anthropic',
    url: 'https://www.anthropic.com/news',
    auto_approve: false,
    priority_tier: 1,
    fetch_frequency: 120,
    enabled: true,
  },
  {
    name: 'OpenAI',
    url: 'https://openai.com/news/',
    auto_approve: false,
    priority_tier: 1,
    fetch_frequency: 120,
    enabled: true,
  },
  {
    name: 'Google DeepMind',
    url: 'https://deepmind.google/discover/blog/',
    auto_approve: false,
    priority_tier: 1,
    fetch_frequency: 120,
    enabled: true,
  },
  {
    name: 'Meta AI',
    url: 'https://ai.meta.com/blog/',
    auto_approve: false,
    priority_tier: 1,
    fetch_frequency: 120,
    enabled: true,
  },
  {
    name: 'Cohere',
    url: 'https://cohere.com/blog',
    auto_approve: false,
    priority_tier: 2,
    fetch_frequency: 120,
    enabled: true,
  },
  {
    name: 'Stability AI',
    url: 'https://stability.ai/news',
    auto_approve: false,
    priority_tier: 2,
    fetch_frequency: 120,
    enabled: true,
  },
  {
    name: 'Adept',
    url: 'https://www.adept.ai/blog',
    auto_approve: false,
    priority_tier: 2,
    fetch_frequency: 120,
    enabled: true,
  },
  {
    name: 'Mistral AI',
    url: 'https://mistral.ai/news/',
    auto_approve: false,
    priority_tier: 1,
    fetch_frequency: 120,
    enabled: true,
  },
];

async function addFeeds() {
  const API_URL = process.env.API_URL || 'http://localhost:3002';
  const token = process.env.ADMIN_TOKEN; // You'll need to provide this

  if (!token) {
    console.error('❌ Please set ADMIN_TOKEN environment variable');
    console.log('Get your token from localStorage in the admin panel:');
    console.log('  localStorage.getItem("leviai_admin_session")');
    process.exit(1);
  }

  console.log('🚀 Adding web scraper feeds...\n');

  for (const feed of feeds) {
    try {
      const response = await fetch(`${API_URL}/api/rss/feeds`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(feed),
      });

      if (response.ok) {
        console.log(`✅ Added: ${feed.name}`);
      } else {
        const error = await response.json();
        if (error.error?.includes('already exists')) {
          console.log(`⚠️  Skipped: ${feed.name} (already exists)`);
        } else {
          console.log(`❌ Failed: ${feed.name} - ${error.error}`);
        }
      }
    } catch (err) {
      console.log(`❌ Error adding ${feed.name}:`, err.message);
    }
  }

  console.log('\n✅ Done! Check your admin panel RSS Feeds section.');
}

addFeeds();
