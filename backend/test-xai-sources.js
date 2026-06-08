// Find real working xAI news sources
const cheerio = require('cheerio');

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
};

async function probe(url, label) {
  try {
    const res = await fetch(url, { headers: HEADERS, signal: AbortSignal.timeout(12000), redirect: 'follow' });
    const body = await res.text();
    console.log(`[${res.status}] ${label || url}`);
    if (res.status === 200 && body.length > 100) {
      const preview = body.substring(0, 400).replace(/\s+/g, ' ');
      console.log('  Preview:', preview);
      
      // Check if it looks like RSS/Atom
      if (body.includes('<item>') || body.includes('<entry>') || body.includes('<rss')) {
        const titles = body.match(/<title[^>]*>([^<]+)<\/title>/g);
        console.log('  RSS titles found:', titles ? titles.slice(0, 5) : 'none');
      }
      return body;
    }
  } catch(e) {
    console.log(`[ERR] ${label || url} — ${e.message}`);
  }
  return null;
}

async function main() {
  // Option 1: News aggregators that cover xAI
  console.log('\n=== xAI News via Aggregators ===');
  await probe('https://newsapi.org/v2/everything?q=xAI+grok+site:x.ai&sortBy=publishedAt', 'NewsAPI');
  
  // Option 2: Google News RSS for xAI
  await probe('https://news.google.com/rss/search?q=site:x.ai+news&hl=en-US&gl=US&ceid=US:en', 'Google News RSS (site:x.ai)');
  await probe('https://news.google.com/rss/search?q=xAI+grok+AI+announcement&hl=en-US&gl=US&ceid=US:en', 'Google News RSS (xAI grok)');
  
  // Option 3: Try with Referer header that mimics a browser navigation
  const headers2 = { 
    ...HEADERS,
    'Referer': 'https://www.google.com/',
    'sec-ch-ua': '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'document',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-site': 'cross-site',
    'sec-fetch-user': '?1',
    'upgrade-insecure-requests': '1',
  };
  
  console.log('\n=== Testing with full browser headers ===');
  try {
    const res = await fetch('https://x.ai/news', { headers: headers2, signal: AbortSignal.timeout(15000) });
    console.log('[' + res.status + '] x.ai/news with full browser headers');
    if (res.status === 200) {
      const body = await res.text();
      console.log('  Got HTML! Length:', body.length);
    }
  } catch(e) { console.log('  Error:', e.message); }
  
  // Option 4: Try via a proxy-like approach  
  console.log('\n=== Alternative news endpoints ===');
  await probe('https://feeds.feedburner.com/xai', 'FeedBurner xAI');
  await probe('https://hnrss.org/frontpage?q=xAI+grok', 'HackerNews xAI');
  await probe('https://hnrss.org/frontpage?q=x.ai', 'HackerNews x.ai');
}

main().catch(console.error);
