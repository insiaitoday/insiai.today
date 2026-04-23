-- ============================================================
-- LeviAIToday — Comprehensive AI RSS Feeds (70+ Sources)
-- Updated: 2026-04-11
-- ============================================================

INSERT INTO rss_feeds (name, url, enabled, auto_approve, priority_tier, fetch_frequency) VALUES

-- ============================================================
-- TIER 1 — TOP AI COMPANIES & LABS (Check every hour)
-- ============================================================
('OpenAI Blog',           'https://openai.com/blog/rss',                                                    true, false, 1, 60),
('Anthropic Blog',        'https://www.anthropic.com/news/rss',                                             true, false, 1, 60),
('Google DeepMind',       'https://deepmind.google/blog/rss.xml',                                           true, false, 1, 60),
('Google AI Blog',        'https://blog.google/technology/ai/rss',                                          true, false, 1, 60),
('Meta AI Research',      'https://ai.meta.com/blog/rss/',                                                  true, false, 1, 60),
('Microsoft AI Blog',     'https://blogs.microsoft.com/ai/feed/',                                           true, false, 1, 60),
('Mistral AI',            'https://mistral.ai/news/feed/',                                                  true, false, 1, 60),
('Cohere AI Blog',        'https://cohere.com/blog/rss.xml',                                                true, false, 1, 60),
('Hugging Face Blog',     'https://huggingface.co/blog/feed.xml',                                           true, false, 1, 60),
('Stability AI News',     'https://stability.ai/news/rss',                                                  true, false, 1, 60),
('xAI (Grok)',            'https://x.ai/blog/rss',                                                          true, false, 1, 60),
('Perplexity AI Blog',    'https://blog.perplexity.ai/rss',                                                 true, false, 1, 60),
('Character.AI Blog',     'https://blog.character.ai/rss',                                                  true, false, 1, 120),
('Inflection AI',         'https://inflection.ai/blog/rss',                                                 true, false, 1, 120),
('Adept AI Blog',         'https://www.adept.ai/blog/rss',                                                  true, false, 1, 120),

-- TIER 1 — MAJOR TECH NEWS OUTLETS (AI Coverage)
('TechCrunch AI',         'https://techcrunch.com/tag/artificial-intelligence/feed/',                      true, false, 1, 60),
('The Verge AI',          'https://www.theverge.com/ai-artificial-intelligence/rss/index.xml',             true, false, 1, 60),
('VentureBeat AI',        'https://venturebeat.com/category/ai/feed/',                                      true, false, 1, 60),
('Wired AI',              'https://www.wired.com/feed/tag/ai/latest/rss',                                   true, false, 1, 60),
('MIT Technology Review', 'https://www.technologyreview.com/topic/artificial-intelligence/feed/',           true, false, 1, 60),
('Ars Technica AI',       'https://feeds.arstechnica.com/arstechnica/technology-lab',                      true, false, 1, 60),

-- TIER 1 — RESEARCH & ACADEMIC
('ArXiv CS.AI',           'https://rss.arxiv.org/rss/cs.AI',                                               true, false, 1, 120),
('ArXiv CS.LG',           'https://rss.arxiv.org/rss/cs.LG',                                               true, false, 1, 120),
('ArXiv CS.CL',           'https://rss.arxiv.org/rss/cs.CL',                                               true, false, 1, 120),
('ArXiv CS.CV',           'https://rss.arxiv.org/rss/cs.CV',                                               true, false, 1, 120),

-- ============================================================
-- TIER 2 — AI INFRASTRUCTURE & TOOLS
-- ============================================================
('NVIDIA AI Blog',        'https://blogs.nvidia.com/blog/category/deep-learning/feed/',                    true, false, 2, 120),
('AWS ML Blog',           'https://aws.amazon.com/blogs/machine-learning/feed/',                           true, false, 2, 120),
('Azure AI Blog',         'https://azure.microsoft.com/en-us/blog/topics/ai-machine-learning/feed/',      true, false, 2, 120),
('LangChain Blog',        'https://blog.langchain.dev/rss/',                                                true, false, 2, 120),
('Weights & Biases',      'https://wandb.ai/fully-connected/feed',                                          true, false, 2, 120),
('Scale AI Blog',         'https://scale.com/blog/rss',                                                     true, false, 2, 120),
('Replicate Blog',        'https://replicate.com/blog/rss.xml',                                             true, false, 2, 120),
('Modal Labs Blog',       'https://modal.com/blog/rss.xml',                                                 true, false, 2, 120),

-- TIER 2 — AI NEWS & ANALYSIS
('AI Business',           'https://aibusiness.com/rss.xml',                                                 true, false, 2, 120),
('Synced AI',             'https://syncedreview.com/feed/',                                                 true, false, 2, 120),
('The Gradient',          'https://thegradient.pub/rss/',                                                   true, false, 2, 120),
('Import AI Newsletter',  'https://jack-clark.net/feed/',                                                   true, false, 2, 120),
('The Batch',             'https://www.deeplearning.ai/the-batch/feed/',                                    true, false, 2, 120),
('AI News',               'https://artificialintelligence-news.com/feed/',                                  true, false, 2, 120),
('ML Mastery',            'https://machinelearningmastery.com/feed/',                                       true, false, 2, 120),

-- TIER 2 — DATA SCIENCE & ML COMMUNITIES
('Towards Data Science',  'https://towardsdatascience.com/feed',                                            true, false, 2, 120),
('KDNuggets',             'https://www.kdnuggets.com/feed',                                                 true, false, 2, 120),
('Analytics Vidhya',      'https://www.analyticsvidhya.com/blog/feed/',                                     true, false, 2, 120),
('Fast.ai Blog',          'https://www.fast.ai/atom.xml',                                                   true, false, 2, 120),
('Papers With Code',      'https://paperswithcode.com/latest/rss',                                          true, false, 2, 120),

-- TIER 2 — AI STARTUPS & COMPANIES
('Runway ML Blog',        'https://runwayml.com/blog/rss',                                                  true, false, 2, 120),
('Midjourney News',       'https://www.midjourney.com/blog/rss',                                            true, false, 2, 120),
('ElevenLabs Blog',       'https://elevenlabs.io/blog/rss',                                                 true, false, 2, 120),
('Together AI Blog',      'https://www.together.ai/blog/rss',                                               true, false, 2, 120),
('Anyscale Blog',         'https://www.anyscale.com/blog/rss.xml',                                          true, false, 2, 120),

-- ============================================================
-- TIER 3 — COMMUNITY & AGGREGATORS
-- ============================================================
('Reddit ML',             'https://www.reddit.com/r/MachineLearning/.rss',                                 true, false, 3, 180),
('Reddit AI',             'https://www.reddit.com/r/artificial/.rss',                                       true, false, 3, 180),
('Reddit LocalLLaMA',     'https://www.reddit.com/r/LocalLLaMA/.rss',                                      true, false, 3, 180),
('Hacker News AI',        'https://hnrss.org/frontpage?q=AI+OR+machine+learning+OR+GPT+OR+LLM',           true, false, 3, 180),
('AI Weekly',             'https://aiweekly.co/feed/',                                                      true, false, 3, 180)

ON CONFLICT (url) DO NOTHING;

-- ============================================================
-- Sample published posts for initial display
-- ============================================================
INSERT INTO posts (type, title, slug, snippet, source_url, source_name, thumbnail, category, status, upvotes, view_count, published_at) VALUES
(
  'rss',
  'GPT-5 Rumored to Launch with Multimodal Reasoning Capabilities',
  'gpt-5-rumored-launch-multimodal-reasoning',
  'Sources close to OpenAI suggest the highly anticipated GPT-5 model will feature enhanced multimodal reasoning, capable of processing images, audio, and video simultaneously with unprecedented accuracy.',
  'https://openai.com/blog',
  'OpenAI Blog',
  'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80',
  'Product Launches',
  'published',
  142,
  2840,
  NOW() - INTERVAL '2 hours'
),
(
  'rss',
  'Google DeepMind Releases Gemini Ultra 2.0 Benchmark Results',
  'google-deepmind-gemini-ultra-2-benchmark',
  'DeepMind has published comprehensive benchmark results for Gemini Ultra 2.0, showing significant improvements over previous versions in mathematical reasoning and code generation tasks.',
  'https://deepmind.google/blog',
  'DeepMind Blog',
  'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80',
  'Research Papers',
  'published',
  98,
  1920,
  NOW() - INTERVAL '4 hours'
),
(
  'rss',
  'Hugging Face Raises $235M Series D at $4.5B Valuation',
  'hugging-face-raises-235m-series-d',
  'AI startup Hugging Face has secured $235 million in Series D funding at a valuation of $4.5 billion, with participation from Google, Amazon, Nvidia, and Salesforce.',
  'https://techcrunch.com',
  'TechCrunch',
  'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80',
  'Funding',
  'published',
  215,
  4100,
  NOW() - INTERVAL '6 hours'
),
(
  'rss',
  'Anthropic Introduces Constitutional AI 2.0 for Safer LLMs',
  'anthropic-constitutional-ai-2-safer-llms',
  'Anthropic has published research on Constitutional AI 2.0, a new training methodology designed to make large language models more reliable, safe, and aligned with human values.',
  'https://www.anthropic.com/blog',
  'Anthropic Blog',
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80',
  'Research Papers',
  'published',
  87,
  1650,
  NOW() - INTERVAL '8 hours'
),
(
  'article',
  'The Complete Guide to Building AI Applications in 2025',
  'complete-guide-building-ai-applications-2025',
  'A comprehensive walkthrough of the modern AI development stack — from choosing the right foundation model to deploying production-ready applications with proper monitoring and safety guardrails.',
  NULL,
  'LeviAI Today',
  'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800&q=80',
  'Tutorials',
  'published',
  324,
  6200,
  NOW() - INTERVAL '1 day'
)
ON CONFLICT (slug) DO NOTHING;
