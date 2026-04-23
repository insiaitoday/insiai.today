// Comprehensive AI RSS Feeds - All Major Sources (2026)
// Run with: node comprehensive-ai-feeds.js

const comprehensiveFeeds = [
  // ============================================================
  // TIER 1 — TOP AI COMPANIES & LABS (Highest Priority)
  // ============================================================
  {
    name: 'OpenAI Blog',
    url: 'https://openai.com/blog/rss',
    auto_approve: false,
    priority_tier: 1,
    fetch_frequency: 60, // Check every hour
    enabled: true,
  },
  {
    name: 'Anthropic Blog',
    url: 'https://www.anthropic.com/news/rss',
    auto_approve: false,
    priority_tier: 1,
    fetch_frequency: 60,
    enabled: true,
  },
  {
    name: 'Google DeepMind',
    url: 'https://deepmind.google/blog/rss.xml',
    auto_approve: false,
    priority_tier: 1,
    fetch_frequency: 60,
    enabled: true,
  },
  {
    name: 'Google AI Blog',
    url: 'https://blog.google/technology/ai/rss',
    auto_approve: false,
    priority_tier: 1,
    fetch_frequency: 60,
    enabled: true,
  },
  {
    name: 'Meta AI Research',
    url: 'https://ai.meta.com/blog/rss/',
    auto_approve: false,
    priority_tier: 1,
    fetch_frequency: 60,
    enabled: true,
  },
  {
    name: 'Microsoft AI Blog',
    url: 'https://blogs.microsoft.com/ai/feed/',
    auto_approve: false,
    priority_tier: 1,
    fetch_frequency: 60,
    enabled: true,
  },
  {
    name: 'Mistral AI',
    url: 'https://mistral.ai/news/feed/',
    auto_approve: false,
    priority_tier: 1,
    fetch_frequency: 60,
    enabled: true,
  },
  {
    name: 'Cohere AI Blog',
    url: 'https://cohere.com/blog/rss.xml',
    auto_approve: false,
    priority_tier: 1,
    fetch_frequency: 60,
    enabled: true,
  },
  {
    name: 'Hugging Face Blog',
    url: 'https://huggingface.co/blog/feed.xml',
    auto_approve: false,
    priority_tier: 1,
    fetch_frequency: 60,
    enabled: true,
  },
  {
    name: 'Stability AI News',
    url: 'https://stability.ai/news/rss',
    auto_approve: false,
    priority_tier: 1,
    fetch_frequency: 60,
    enabled: true,
  },
  {
    name: 'xAI (Grok)',
    url: 'https://x.ai/blog/rss',
    auto_approve: false,
    priority_tier: 1,
    fetch_frequency: 60,
    enabled: true,
  },
  {
    name: 'Perplexity AI Blog',
    url: 'https://blog.perplexity.ai/rss',
    auto_approve: false,
    priority_tier: 1,
    fetch_frequency: 60,
    enabled: true,
  },
  {
    name: 'Character.AI Blog',
    url: 'https://blog.character.ai/rss',
    auto_approve: false,
    priority_tier: 1,
    fetch_frequency: 120,
    enabled: true,
  },
  {
    name: 'Inflection AI',
    url: 'https://inflection.ai/blog/rss',
    auto_approve: false,
    priority_tier: 1,
    fetch_frequency: 120,
    enabled: true,
  },
  {
    name: 'Adept AI Blog',
    url: 'https://www.adept.ai/blog/rss',
    auto_approve: false,
    priority_tier: 1,
    fetch_frequency: 120,
    enabled: true,
  },

  // ============================================================
  // TIER 1 — MAJOR TECH NEWS OUTLETS (AI Coverage)
  // ============================================================
  {
    name: 'TechCrunch AI',
    url: 'https://techcrunch.com/tag/artificial-intelligence/feed/',
    auto_approve: false,
    priority_tier: 1,
    fetch_frequency: 60,
    enabled: true,
  },
  {
    name: 'The Verge AI',
    url: 'https://www.theverge.com/ai-artificial-intelligence/rss/index.xml',
    auto_approve: false,
    priority_tier: 1,
    fetch_frequency: 60,
    enabled: true,
  },
  {
    name: 'VentureBeat AI',
    url: 'https://venturebeat.com/category/ai/feed/',
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
    name: 'MIT Technology Review AI',
    url: 'https://www.technologyreview.com/topic/artificial-intelligence/feed/',
    auto_approve: false,
    priority_tier: 1,
    fetch_frequency: 60,
    enabled: true,
  },
  {
    name: 'Ars Technica AI',
    url: 'https://feeds.arstechnica.com/arstechnica/technology-lab',
    auto_approve: false,
    priority_tier: 1,
    fetch_frequency: 60,
    enabled: true,
  },

  // ============================================================
  // TIER 1 — RESEARCH & ACADEMIC
  // ============================================================
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

  // ============================================================
  // TIER 2 — AI INFRASTRUCTURE & TOOLS
  // ============================================================
  {
    name: 'NVIDIA AI Blog',
    url: 'https://blogs.nvidia.com/blog/category/deep-learning/feed/',
    auto_approve: false,
    priority_tier: 2,
    fetch_frequency: 120,
    enabled: true,
  },
  {
    name: 'AWS Machine Learning Blog',
    url: 'https://aws.amazon.com/blogs/machine-learning/feed/',
    auto_approve: false,
    priority_tier: 2,
    fetch_frequency: 120,
    enabled: true,
  },
  {
    name: 'Azure AI Blog',
    url: 'https://azure.microsoft.com/en-us/blog/topics/ai-machine-learning/feed/',
    auto_approve: false,
    priority_tier: 2,
    fetch_frequency: 120,
    enabled: true,
  },
  {
    name: 'LangChain Blog',
    url: 'https://blog.langchain.dev/rss/',
    auto_approve: false,
    priority_tier: 2,
    fetch_frequency: 120,
    enabled: true,
  },
  {
    name: 'Weights & Biases Blog',
    url: 'https://wandb.ai/fully-connected/feed',
    auto_approve: false,
    priority_tier: 2,
    fetch_frequency: 120,
    enabled: true,
  },
  {
    name: 'Scale AI Blog',
    url: 'https://scale.com/blog/rss',
    auto_approve: false,
    priority_tier: 2,
    fetch_frequency: 120,
    enabled: true,
  },
  {
    name: 'Replicate Blog',
    url: 'https://replicate.com/blog/rss.xml',
    auto_approve: false,
    priority_tier: 2,
    fetch_frequency: 120,
    enabled: true,
  },
  {
    name: 'Modal Labs Blog',
    url: 'https://modal.com/blog/rss.xml',
    auto_approve: false,
    priority_tier: 2,
    fetch_frequency: 120,
    enabled: true,
  },

  // ============================================================
  // TIER 2 — AI NEWS & ANALYSIS SITES
  // ============================================================
  {
    name: 'AI Business',
    url: 'https://aibusiness.com/rss.xml',
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
    name: 'The Gradient',
    url: 'https://thegradient.pub/rss/',
    auto_approve: false,
    priority_tier: 2,
    fetch_frequency: 120,
    enabled: true,
  },
  {
    name: 'Import AI Newsletter',
    url: 'https://jack-clark.net/feed/',
    auto_approve: false,
    priority_tier: 2,
    fetch_frequency: 120,
    enabled: true,
  },
  {
    name: 'The Batch (DeepLearning.AI)',
    url: 'https://www.deeplearning.ai/the-batch/feed/',
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
  {
    name: 'Machine Learning Mastery',
    url: 'https://machinelearningmastery.com/feed/',
    auto_approve: false,
    priority_tier: 2,
    fetch_frequency: 120,
    enabled: true,
  },

  // ============================================================
  // TIER 2 — DATA SCIENCE & ML COMMUNITIES
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
    name: 'Fast.ai Blog',
    url: 'https://www.fast.ai/atom.xml',
    auto_approve: false,
    priority_tier: 2,
    fetch_frequency: 120,
    enabled: true,
  },
  {
    name: 'Papers With Code',
    url: 'https://paperswithcode.com/latest/rss',
    auto_approve: false,
    priority_tier: 2,
    fetch_frequency: 120,
    enabled: true,
  },

  // ============================================================
  // TIER 3 — COMMUNITY & AGGREGATORS
  // ============================================================
  {
    name: 'Reddit r/MachineLearning',
    url: 'https://www.reddit.com/r/MachineLearning/.rss',
    auto_approve: false,
    priority_tier: 3,
    fetch_frequency: 180,
    enabled: true,
  },
  {
    name: 'Reddit r/artificial',
    url: 'https://www.reddit.com/r/artificial/.rss',
    auto_approve: false,
    priority_tier: 3,
    fetch_frequency: 180,
    enabled: true,
  },
  {
    name: 'Reddit r/LocalLLaMA',
    url: 'https://www.reddit.com/r/LocalLLaMA/.rss',
    auto_approve: false,
    priority_tier: 3,
    fetch_frequency: 180,
    enabled: true,
  },
  {
    name: 'Hacker News AI',
    url: 'https://hnrss.org/frontpage?q=AI+OR+machine+learning+OR+GPT+OR+LLM',
    auto_approve: false,
    priority_tier: 3,
    fetch_frequency: 180,
    enabled: true,
  },
  {
    name: 'AI Weekly Newsletter',
    url: 'https://aiweekly.co/feed/',
    auto_approve: false,
    priority_tier: 3,
    fetch_frequency: 180,
    enabled: true,
  },

  // ============================================================
  // TIER 2 — ADDITIONAL AI STARTUPS & COMPANIES
  // ============================================================
  {
    name: 'Runway ML Blog',
    url: 'https://runwayml.com/blog/rss',
    auto_approve: false,
    priority_tier: 2,
    fetch_frequency: 120,
    enabled: true,
  },
  {
    name: 'Midjourney News',
    url: 'https://www.midjourney.com/blog/rss',
    auto_approve: false,
    priority_tier: 2,
    fetch_frequency: 120,
    enabled: true,
  },
  {
    name: 'ElevenLabs Blog',
    url: 'https://elevenlabs.io/blog/rss',
    auto_approve: false,
    priority_tier: 2,
    fetch_frequency: 120,
    enabled: true,
  },
  {
    name: 'Together AI Blog',
    url: 'https://www.together.ai/blog/rss',
    auto_approve: false,
    priority_tier: 2,
    fetch_frequency: 120,
    enabled: true,
  },
  {
    name: 'Anyscale Blog',
    url: 'https://www.anyscale.com/blog/rss.xml',
    auto_approve: false,
    priority_tier: 2,
    fetch_frequency: 120,
    enabled: true,
  },
];

async function addFeeds() {
  const API_URL = process.env.API_URL || 'http://localhost:3002';
  const token = process.env.ADMIN_TOKEN;

  if (!token) {
    console.error('❌ Please set ADMIN_TOKEN environment variable');
    console.log('\nGet your token from localStorage in the admin panel:');
    console.log('  1. Open browser console (F12)');
    console.log('  2. Run: JSON.parse(localStorage.getItem("leviai_admin_session")).access_token');
    console.log('  3. Copy the token and run:');
    console.log('     ADMIN_TOKEN="your_token_here" node comprehensive-ai-feeds.js\n');
    process.exit(1);
  }

  console.log('🚀 Adding comprehensive AI RSS feeds...');
  console.log(`📊 Total feeds to add: ${comprehensiveFeeds.length}\n`);

  let added = 0;
  let skipped = 0;
  let failed = 0;

  for (const feed of comprehensiveFeeds) {
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
  console.log(`   📊 Total: ${comprehensiveFeeds.length}`);
  console.log('='.repeat(60));
  console.log('\n✅ Done! Check your admin panel RSS Feeds section.');
}

addFeeds();
