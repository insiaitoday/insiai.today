// Test Google News RSS feed for xAI thoroughly
const cheerio = require('cheerio');

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  'Accept': 'application/rss+xml, application/xml, text/xml, */*',
  'Accept-Language': 'en-US,en;q=0.9',
};

async function fetchRSS(url) {
  const res = await fetch(url, { headers: HEADERS, signal: AbortSignal.timeout(15000) });
  console.log(`Status: ${res.status} for ${url}`);
  return await res.text();
}

async function main() {
  // Best URL: site:x.ai news - this returns only articles from x.ai itself
  const url = 'https://news.google.com/rss/search?q=site:x.ai/news&hl=en-US&gl=US&ceid=US:en';
  
  const xml = await fetchRSS(url);
  console.log('XML length:', xml.length);
  
  const $ = cheerio.load(xml, { xmlMode: true });
  
  console.log('\n=== Channel Info ===');
  console.log('Title:', $('channel > title').first().text());
  console.log('Items:', $('item').length);
  
  console.log('\n=== All Items ===');
  $('item').each(function(i) {
    const title = $(this).find('title').text().trim();
    const link = $(this).find('link').text().trim() || $(this).find('guid').text().trim();
    const pubDate = $(this).find('pubDate').text().trim();
    const source = $(this).find('source').text().trim();
    const description = $(this).find('description').text().replace(/<[^>]+>/g, '').substring(0, 150).trim();
    
    console.log(`\n[${i+1}] ${title}`);
    console.log(`  Link: ${link}`);
    console.log(`  Date: ${pubDate}`);
    console.log(`  Source: ${source}`);
    console.log(`  Desc: ${description}`);
  });
  
  // Also test just filtering x.ai links  
  console.log('\n\n=== Only x.ai links ===');
  $('item').each(function(i) {
    const link = $(this).find('link').text().trim() || $(this).find('guid').text().trim();
    if (link.includes('x.ai')) {
      const title = $(this).find('title').text().trim();
      console.log(`  [x.ai] ${title} → ${link}`);
    }
  });
}

main().catch(console.error);
