// Test xAI scraper debug
const cheerio = require('cheerio');

const HEADERS_CHROME = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Cache-Control': 'no-cache',
};

const HEADERS_GOOGLEBOT = {
  'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
};

async function fetchWith(url, headers, timeoutMs = 20000) {
  try {
    const res = await fetch(url, {
      headers,
      signal: AbortSignal.timeout(timeoutMs),
      redirect: 'follow',
    });
    console.log(`  Status ${res.status} for ${url}`);
    if (!res.ok) return null;
    return await res.text();
  } catch (e) {
    console.error(`  Fetch error: ${e.message}`);
    return null;
  }
}

async function main() {
  console.log('\n=== Testing x.ai/news with Chrome UA ===');
  let html = await fetchWith('https://x.ai/news', HEADERS_CHROME);
  
  if (!html) {
    console.log('Chrome UA failed, trying Googlebot...');
    html = await fetchWith('https://x.ai/news', HEADERS_GOOGLEBOT);
  }
  
  if (!html) {
    console.log('Both UAs failed!');
    return;
  }
  
  console.log('HTML length:', html.length);
  console.log('Has __NEXT_DATA__:', html.includes('__NEXT_DATA__'));
  
  const $ = cheerio.load(html);
  
  // Find all news article links
  const newsLinks = [];
  $('a[href]').each(function() {
    const href = $(this).attr('href') || '';
    if (/^\/news\/[a-z0-9][a-z0-9-]*$/.test(href)) {
      newsLinks.push(href);
    }
  });
  
  console.log('\nNews links found:', newsLinks.length);
  newsLinks.forEach(l => console.log(' -', l));
  
  // Try to extract titles from the page
  console.log('\n=== Titles from the page ===');
  $('a[href]').each(function() {
    const href = $(this).attr('href') || '';
    if (!/^\/news\/[a-z0-9][a-z0-9-]*$/.test(href)) return;
    
    const title = $(this).find('h1, h2, h3').first().text().replace(/\s+/g, ' ').trim();
    const snippet = $(this).find('p').first().text().replace(/\s+/g, ' ').trim().substring(0, 100);
    const rawText = $(this).text();
    const dateMatch = rawText.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{1,2}, 20\d{2}/i);
    
    console.log(`\nURL: https://x.ai${href}`);
    console.log(`Title: "${title}"`);
    console.log(`Snippet: "${snippet}"`);
    console.log(`Date: ${dateMatch ? dateMatch[0] : 'none found'}`);
  });

  // Check sitemap
  console.log('\n=== Checking sitemap ===');
  const sitemapHtml = await fetchWith('https://x.ai/sitemap.xml', HEADERS_CHROME, 10000);
  if (sitemapHtml) {
    console.log('Sitemap length:', sitemapHtml.length);
    const newsUrls = sitemapHtml.match(/https:\/\/x\.ai\/news\/[a-z0-9-]+/g);
    console.log('Sitemap news URLs:', newsUrls ? newsUrls.length : 0);
    if (newsUrls) newsUrls.slice(0, 5).forEach(u => console.log(' -', u));
  }
}

main().catch(console.error);
