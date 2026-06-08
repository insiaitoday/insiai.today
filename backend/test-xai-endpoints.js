// Test all xAI endpoints for accessibility
const cheerio = require('cheerio');

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
};

async function probe(url) {
  try {
    const res = await fetch(url, { headers: HEADERS, signal: AbortSignal.timeout(12000), redirect: 'follow' });
    const body = await res.text();
    console.log(`[${res.status}] ${url} — ${body.length} bytes`);
    if (res.status === 200 && body.length > 100) {
      console.log('  Preview:', body.substring(0, 200).replace(/\s+/g, ' '));
    }
  } catch(e) {
    console.log(`[ERR] ${url} — ${e.message}`);
  }
}

async function main() {
  const urls = [
    'https://x.ai/sitemap.xml',
    'https://x.ai/sitemap_index.xml',
    'https://x.ai/news/sitemap.xml',
    'https://x.ai/rss.xml',
    'https://x.ai/feed.xml',
    'https://x.ai/news/rss',
    'https://x.ai/news/feed',
    'https://x.ai/news/feed.xml',
    'https://x.ai/blog/rss',
    'https://x.ai/atom.xml',
    // Try individual known article
    'https://x.ai/news/grok-build-0-1',
    // Try with different approach - API endpoint
    'https://x.ai/api/news',
    'https://x.ai/api/posts',
  ];
  
  for (const url of urls) {
    await probe(url);
    await new Promise(r => setTimeout(r, 300));
  }
}

main().catch(console.error);
