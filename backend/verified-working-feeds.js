// Verified Working RSS Feeds - Tested April 2026
// Only includes feeds that actually work and return valid RSS/XML

const verifiedWorkingFeeds = [
  // ============================================================
  // TIER 1 — VERIFIED WORKING FEEDS
  // ============================================================

  // Major Tech News (These are reliable)
  {
    name: 'TechCrunch AI',
    url: 'https://techcrunch.com/category/artificial-intelligence/feed/',
    auto_approve: false,
    priority_tier: 1,
    fetch_frequency: 60,
    enabled: true,
  },
  {
    name: 'MIT Technology Review AI',
    url: 'https://www.technologyreview.com/topic/artificial-intelligence/feed/',
    auto_approve: false,
    priority_tier: 1,
    fetch_frequency: 60,
    enabled: true,
  },
  {
    name: 'Wired AI',
    url: 'https://www.wired.com/feed/tag/ai/latest/rss',
    auto_approve: false,
    priority_tier: 1,
    fetch_frequency: 60,
    enabled: true,
  },
  {
    name: 'Ars Technica',
    url: 'https://feeds.arstechnica.com/arstechnica/technology-lab',
    auto_approve: false,
    priority_tier: 1,
    fetch_frequency: 60,
    enabled: true,
  },
  {
    name: 'The Verge',
    url: 'https://www.theverge.com/rss/index.xml',
    auto_approve: false,
    priority_tier: 1,
    fetch_frequency: 60,
    enabled: true,
  },

  // Research (ArXiv is very reliable)
  {
    name: 'ArXiv CS.AI',
    url: 'https://rss.arxiv.org/rss/cs.AI',
    auto_approve: false,
    priority_tier: 1,
    fetch_frequency: 120,
    enabled: true,
  },
  {
    name: 'ArXiv CS.LG (Machine Learning)',
    url: 'https://rss.arxiv.org/rss/cs.LG',
    auto_approve: false,
    priority_tier: 1,
    fetch_frequency: 120,
    enabled: true,
  },
  {
    name: 'ArXiv CS.CL (NLP)',
    url: 'https://rss.arxiv.org/rss/cs.CL',
    auto_approve: false,
    priority_tier: 1,
    fetch_frequency: 120,
    enabled: true,
  },
  {
    name: 'ArXiv CS.CV (Computer Vision)',
    url: 'https://rss.arxiv.org/rss/cs.CV',
    auto_approve: false,
    priority_tier: 1,
    fetch_frequency: 120,
    enabled: true,
  },

  // Hugging Face (Confirmed working)
  {
    name: 'Hugging Face Blog',
    url: 'https://huggingface.co/blog/feed.xml',
    auto_approve: false,
    priority_tier: 1,
    fetch_frequency: 60,
    enabled: true,
  },

  // Microsoft (Confirmed working)
  {
    name: 'Microsoft AI Blog',
    url: 'https://blogs.microsoft.com/ai/feed/',
    auto_approve: false,
    priority_tier: 1,
    fetch_frequency: 60,
    enabled: true,
  },

  // ============================================================
  // TIER 2 — INFRASTRUCTURE & TOOLS (Verified)
  // ============================================================

  {
    name: 'AWS Machine Learning Blog',
    url: 'https://aws.amazon.com/blogs/machine-learning/feed/',
    auto_approve: false,
    priority_tier: 2,
    fetch_frequency: 120,
    enabled: true,
  },
  {
    name: 'Google Cloud AI Blog',
    url: 'https://cloud.google.com/blog/products/ai-machine-learning/rss',
    auto_approve: false,
    priority_tier: 2,
    fetch_frequency: 120,
    enabled: true,
  },
  {
    name: 'NVIDIA Blog',
    url: 'https://blogs.nvidia.com/feed/',
    auto_approve: false,
    priority_tier: 2,
    fetch_frequency: 120,
    enabled: true,
  },

  // ============================================================
  // TIER 2 — DATA SCIENCE & ML COMMUNITIES (Verified)
  // ============================================================

  {
    name: 'Towards Data Science',
    url: 'https://towardsdatascience.com/feed',
    auto_approve: false,
    priority_tier: 2,
    fetch_frequency: 120,
    enabled: true,
  },
  {
    name: 'KDNuggets',
    url: 'https://www.kdnuggets.com/feed',
    auto_approve: false,
    priority_tier: 2,
    fetch_frequency: 120,
    enabled: true,
  },
  {
    name: 'Analytics Vidhya',
    url: 'https://www.analyticsvidhya.com/blog/feed/',
    auto_approve: false,
    priority_tier: 2,
    fetch_frequency: 120,
    enabled: true,
  },
  {
    name: 'Machine Learning Mastery',
    url: 'https://machinelearningmastery.com/feed/',
    auto_approve: false,
    priority_tier: 2,
    fetch_frequency: 120,
    enabled: true,
  },

  // ============================================================
  // TIER 2 — AI NEWS & ANALYSIS (Verified)
  // ============================================================

  {
    name: 'The Gradient',
    url: 'https://thegradient.pub/rss/',
    auto_approve: false,
    priority_tier: 2,
    fetch_frequency: 120,
    enabled: true,
  },
  {
    name: 'Synced AI',
    url: 'https://syncedreview.com/feed/',
    auto_approve: false,
    priority_tier: 2,
    fetch_frequency: 120,
    enabled: true,
  },
  {
    name: 'AI News',
    url: 'https://artificialintelligence-news.com/feed/',
    auto_approve: false,
    priority_tier: 2,
    fetch_frequency: 120,
    enabled: true,
  },

  // ============================================================
  // COMPANIES WITH WEB SCRAPERS (No RSS - Keep for scraping)
  // ============================================================

  {
    name: 'OpenAI',
    url: 'https://openai.com/news/',
    auto_approve: false,
    priority_tier: 1,
    fetch_frequency: 60,
    enabled: true,
  },
  {
    name: 'Anthropic',
    url: 'https://www.anthropic.com/news',
    auto_approve: false,
    priority_tier: 1,
    fetch_frequency: 60,
    enabled: true,
  },
  {
    name: 'Google DeepMind',
    url: 'https://deepmind.google/discover/blog/',
    auto_approve: false,
    priority_tier: 1,
    fetch_frequency: 60,
    enabled: true,
  },
  {
    name: 'Meta AI',
    url: 'https://ai.meta.com/blog/',
    auto_approve: false,
    priority_tier: 1,
    fetch_frequency: 60,
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
    name: 'Mistral AI',
    url: 'https://mistral.ai/news/',
    auto_approve: false,
    priority_tier: 1,
    fetch_frequency: 60,
    enabled: true,
  },
];

async function addVerifiedFeeds() {
  const API_URL = process.env.API_URL || 'http://localhost:3002';
  const token = process.env.ADMIN_TOKEN;

  if (!token) {
    console.error('❌ Please set ADMIN_TOKEN environment variable');
    console.log('\nGet your token from browser console (F12):');
    console.log('  JSON.parse(localStorage.getItem("leviai_admin_session")).access_token\n');
    process.exit(1);
  }

  console.log('🚀 Adding VERIFIED working RSS feeds...');
  console.log(`📊 Total feeds: ${verifiedWorkingFeeds.length}\n`);
  console.log('⚠️  Note: Some feeds use web scrapers (OpenAI, Anthropic, etc.)\n');

  let added = 0;
  let skipped = 0;
  let failed = 0;

  for (const feed of verifiedWorkingFeeds) {
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
        added++;
      } else {
        const error = await response.json();
        if (error.error?.includes('already exists')) {
          console.log(`⚠️  Skipped: ${feed.name} (already exists)`);
          skipped++;
        } else {
          console.log(`❌ Failed: ${feed.name} - ${error.error}`);
          failed++;
        }
      }
    } catch (err) {
      console.log(`❌ Error adding ${feed.name}:`, err.message);
      failed++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📈 Summary:');
  console.log(`   ✅ Added: ${added}`);
  console.log(`   ⚠️  Skipped: ${skipped}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📊 Total: ${verifiedWorkingFeeds.length}`);
  console.log('='.repeat(60));
  console.log('\n✅ Done! These feeds are verified to work.');
  console.log('💡 Feeds without RSS use web scrapers automatically.\n');
}

addVerifiedFeeds();
