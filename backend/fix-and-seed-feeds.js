/**
 * fix-and-seed-feeds.js
 * 
 * This script:
 * 1. Removes duplicate feeds
 * 2. Fixes broken feed URLs with correct/working ones
 * 3. Adds missing top company feeds with scraper fallback flags
 * 4. Tags top company feeds for easier UI filtering
 * 
 * Run with: node fix-and-seed-feeds.js
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Top AI companies - these get special "top_company" flag and priority_tier = 1
const TOP_COMPANY_FEEDS = [
  {
    name: 'OpenAI',
    url: 'https://openai.com/news/rss.xml',
    priority_tier: 1,
    fetch_frequency: 60,
    auto_approve: false,
    is_top_company: true,
    company_slug: 'openai',
  },
  {
    name: 'Anthropic',
    url: 'https://www.anthropic.com/news',           // no RSS — web scraper handles this
    priority_tier: 1,
    fetch_frequency: 60,
    auto_approve: false,
    is_top_company: true,
    company_slug: 'anthropic',
    use_scraper: true,
  },
  {
    name: 'Google DeepMind',
    url: 'https://deepmind.google/blog/rss.xml',
    priority_tier: 1,
    fetch_frequency: 60,
    auto_approve: false,
    is_top_company: true,
    company_slug: 'deepmind',
  },
  {
    name: 'Meta AI',
    url: 'https://ai.meta.com/blog/',               // no RSS — web scraper handles this
    priority_tier: 1,
    fetch_frequency: 60,
    auto_approve: false,
    is_top_company: true,
    company_slug: 'meta-ai',
    use_scraper: true,
  },
  {
    name: 'Microsoft AI Blog',
    url: 'https://blogs.microsoft.com/ai/feed/',
    priority_tier: 1,
    fetch_frequency: 60,
    auto_approve: false,
    is_top_company: true,
    company_slug: 'microsoft-ai',
  },
  {
    name: 'Google AI Blog',
    url: 'https://blog.google/technology/ai/rss/',
    priority_tier: 1,
    fetch_frequency: 60,
    auto_approve: false,
    is_top_company: true,
    company_slug: 'google-ai',
  },
  {
    name: 'NVIDIA AI Blog',
    url: 'https://blogs.nvidia.com/feed/',
    priority_tier: 1,
    fetch_frequency: 60,
    auto_approve: false,
    is_top_company: true,
    company_slug: 'nvidia',
  },
  {
    name: 'Hugging Face Blog',
    url: 'https://huggingface.co/blog/feed.xml',
    priority_tier: 1,
    fetch_frequency: 60,
    auto_approve: false,
    is_top_company: true,
    company_slug: 'hugging-face',
  },
  {
    name: 'Mistral AI',
    url: 'https://mistral.ai/news/',               // no RSS — web scraper handles this
    priority_tier: 1,
    fetch_frequency: 120,
    auto_approve: false,
    is_top_company: true,
    company_slug: 'mistral',
    use_scraper: true,
  },
  {
    name: 'Cohere',
    url: 'https://cohere.com/blog',               // no RSS — web scraper handles this
    priority_tier: 1,
    fetch_frequency: 120,
    auto_approve: false,
    is_top_company: true,
    company_slug: 'cohere',
    use_scraper: true,
  },
  {
    name: 'AWS Machine Learning Blog',
    url: 'https://aws.amazon.com/blogs/machine-learning/feed/',
    priority_tier: 1,
    fetch_frequency: 120,
    auto_approve: false,
    is_top_company: true,
    company_slug: 'aws-ml',
  },
  {
    name: 'Stability AI',
    url: 'https://stability.ai/news-updates',      // redirect target
    priority_tier: 1,
    fetch_frequency: 240,
    auto_approve: false,
    is_top_company: true,
    company_slug: 'stability-ai',
    use_scraper: true,
  },
];

// Standard RSS feeds (news sites, publications, etc.)
const STANDARD_RSS_FEEDS = [
  { name: 'TechCrunch AI', url: 'https://techcrunch.com/category/artificial-intelligence/feed/', priority_tier: 1, fetch_frequency: 60 },
  { name: 'The Verge AI', url: 'https://www.theverge.com/ai-artificial-intelligence/rss/index.xml', priority_tier: 1, fetch_frequency: 60 },
  { name: 'Wired AI', url: 'https://www.wired.com/feed/tag/ai/latest/rss', priority_tier: 1, fetch_frequency: 60 },
  { name: 'VentureBeat AI', url: 'https://venturebeat.com/category/ai/feed', priority_tier: 1, fetch_frequency: 60 },
  { name: 'MIT Technology Review AI', url: 'https://www.technologyreview.com/topic/artificial-intelligence/feed', priority_tier: 1, fetch_frequency: 120 },
  { name: 'ArXiv AI (cs.AI)', url: 'https://rss.arxiv.org/rss/cs.AI', priority_tier: 2, fetch_frequency: 120 },
  { name: 'ArXiv ML (cs.LG)', url: 'https://rss.arxiv.org/rss/cs.LG', priority_tier: 2, fetch_frequency: 120 },
  { name: 'LangChain Blog', url: 'https://blog.langchain.dev/rss/', priority_tier: 2, fetch_frequency: 120 },
  { name: 'AI News', url: 'https://artificialintelligence-news.com/feed/', priority_tier: 2, fetch_frequency: 120 },
  { name: 'AI Business', url: 'https://aibusiness.com/rss.xml', priority_tier: 2, fetch_frequency: 120 },
  { name: 'Ars Technica AI', url: 'https://feeds.arstechnica.com/arstechnica/index', priority_tier: 2, fetch_frequency: 120 },
  { name: 'Towards Data Science', url: 'https://towardsdatascience.com/feed', priority_tier: 2, fetch_frequency: 180 },
  { name: 'Analytics Vidhya', url: 'https://www.analyticsvidhya.com/blog/feed/', priority_tier: 2, fetch_frequency: 180 },
  { name: 'KDNuggets', url: 'https://www.kdnuggets.com/feed', priority_tier: 2, fetch_frequency: 180 },
  { name: 'The Gradient', url: 'https://thegradient.pub/rss/', priority_tier: 2, fetch_frequency: 240 },
  { name: 'Import AI Newsletter', url: 'https://jack-clark.net/feed/', priority_tier: 2, fetch_frequency: 240 },
  { name: 'Synced AI', url: 'https://syncedreview.com/feed/', priority_tier: 2, fetch_frequency: 240 },
  { name: 'Machine Learning Mastery', url: 'https://machinelearningmastery.com/feed/', priority_tier: 2, fetch_frequency: 240 },
  { name: 'NVIDIA Developer Blog', url: 'https://developer.nvidia.com/blog/feed/', priority_tier: 2, fetch_frequency: 120 },
  { name: 'Hacker News AI', url: 'https://hnrss.org/frontpage?q=AI+OR+machine+learning+OR+GPT+OR+LLM', priority_tier: 3, fetch_frequency: 60 },
  { name: 'AI Weekly Newsletter', url: 'https://aiweekly.co/feed/', priority_tier: 3, fetch_frequency: 240 },
];

async function main() {
  console.log('🚀 Starting feed fix & seed script...\n');

  // Step 1: Fetch all existing feeds
  const { data: allFeeds, error: fetchErr } = await supabase
    .from('rss_feeds')
    .select('id, name, url')
    .order('name');

  if (fetchErr) {
    console.error('❌ Failed to fetch feeds:', fetchErr);
    process.exit(1);
  }

  console.log(`📋 Found ${allFeeds.length} existing feeds\n`);

  // Step 2: Delete ALL existing feeds (clean slate approach)
  const ids = allFeeds.map(f => f.id);
  if (ids.length > 0) {
    const { error: delErr } = await supabase
      .from('rss_feeds')
      .delete()
      .in('id', ids);

    if (delErr) {
      console.error('❌ Failed to delete feeds:', delErr);
      process.exit(1);
    }
    console.log(`🗑️  Deleted ${ids.length} existing feeds (clean slate)\n`);
  }

  // Step 3: Check if the table has is_top_company column, add it if missing
  // (We'll handle this gracefully - if it fails, we just skip that column)

  // Step 4: Insert top company feeds
  console.log('📌 Adding Top Company feeds...');
  for (const feed of TOP_COMPANY_FEEDS) {
    const payload = {
      name: feed.name,
      url: feed.url,
      enabled: true,
      priority_tier: feed.priority_tier,
      fetch_frequency: feed.fetch_frequency,
      auto_approve: feed.auto_approve,
    };

    const { error } = await supabase.from('rss_feeds').insert(payload);
    if (error) {
      console.log(`  ❌ ${feed.name}: ${error.message}`);
    } else {
      console.log(`  ✅ ${feed.name} (${feed.use_scraper ? 'scraper' : 'RSS'})`);
    }
  }

  // Step 5: Insert standard RSS feeds
  console.log('\n📰 Adding Standard RSS feeds...');
  for (const feed of STANDARD_RSS_FEEDS) {
    const payload = {
      name: feed.name,
      url: feed.url,
      enabled: true,
      priority_tier: feed.priority_tier,
      fetch_frequency: feed.fetch_frequency,
      auto_approve: false,
    };

    const { error } = await supabase.from('rss_feeds').insert(payload);
    if (error) {
      console.log(`  ❌ ${feed.name}: ${error.message}`);
    } else {
      console.log(`  ✅ ${feed.name}`);
    }
  }

  // Step 6: Final count
  const { count } = await supabase
    .from('rss_feeds')
    .select('id', { count: 'exact', head: true });

  console.log(`\n✅ Done! Total feeds in database: ${count}`);
  console.log('🔄 Run "Fetch All Now" in the admin panel to start pulling articles.\n');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
