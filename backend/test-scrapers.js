/**
 * test-scrapers.js - Tests all company scrapers by fetching pages and counting article links
 */
require('dotenv').config();
const cheerio = require('cheerio');

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Cache-Control': 'no-cache',
};

async function testScrape(name, url, pathFragment) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);
    const res = await fetch(url, { headers: HEADERS, signal: controller.signal, redirect: 'follow' });
    clearTimeout(timeout);

    if (!res.ok) {
      console.log('❌ ' + name + ': HTTP ' + res.status);
      return { name, ok: false, count: 0 };
    }

    const html = await res.text();
    const $ = cheerio.load(html);
    const origin = new URL(url).origin;

    const links = new Set();
    const articles = [];

    // Pass 1: look for structured cards
    const cardContainers = $('article, [class*="card"], [class*="Card"], [class*="post"], [class*="Post"], [class*="news"], [class*="blog"]');
    cardContainers.each((_, el) => {
      const title = $(el).find('h2,h3,h4,[class*="title"],[class*="heading"]').first().text().trim();
      const link = $(el).find('a').first().attr('href') || '';
      if (title.length > 10 && link) articles.push({ title, link });
    });

    // Pass 2: link extraction
    $('a[href]').each((_, el) => {
      const href = $(el).attr('href') || '';
      if (href.includes(pathFragment) && href !== pathFragment && href.length > pathFragment.length + 2) {
        const text = $(el).text().trim();
        if (text.length >= 15 && text.length <= 250) {
          const full = href.startsWith('http') ? href : origin + (href.startsWith('/') ? '' : '/') + href;
          if (!links.has(full)) {
            links.add(full);
            if (articles.length < 5) articles.push({ title: text, link: full });
          }
        }
      }
    });

    const total = Math.max(links.size, articles.length);
    const icon = total > 0 ? '✅' : '⚠️';
    console.log(icon + ' ' + name + ': ' + total + ' articles found (cards: ' + cardContainers.length + ', links: ' + links.size + ')');

    articles.slice(0, 2).forEach(a => {
      console.log('   → "' + a.title.substring(0, 70) + '"');
    });

    return { name, ok: total > 0, count: total };
  } catch (e) {
    console.log('❌ ' + name + ': ' + e.message);
    return { name, ok: false, count: 0 };
  }
}

async function main() {
  console.log('🔍 Testing company scrapers...\n');
  const results = [];

  results.push(await testScrape('Anthropic', 'https://www.anthropic.com/news', '/news/'));
  results.push(await testScrape('Mistral AI', 'https://mistral.ai/news/', '/news/'));
  results.push(await testScrape('Cohere', 'https://cohere.com/blog', '/blog/'));
  results.push(await testScrape('Meta AI (new URL)', 'https://engineering.fb.com/', '/blog/'));
  results.push(await testScrape('Stability AI', 'https://stability.ai/news-updates', '/news'));
  results.push(await testScrape('Google DeepMind', 'https://deepmind.google/discover/blog/', '/discover/blog/'));

  console.log('\n📊 Summary:');
  results.forEach(r => {
    console.log((r.ok ? '✅' : '❌') + ' ' + r.name + ': ' + (r.ok ? r.count + ' articles' : 'FAILED'));
  });

  const working = results.filter(r => r.ok).length;
  console.log('\n' + working + '/' + results.length + ' scrapers producing results');
}

main().catch(console.error);
