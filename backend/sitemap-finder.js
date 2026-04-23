/**
 * sitemap-finder.js - Try to find article URLs via sitemap.xml for JS-heavy sites
 */
require('dotenv').config();
const cheerio = require('cheerio');

async function fetchText(url) {
  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 15000);
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 Googlebot/2.1' },
      signal: controller.signal,
      redirect: 'follow'
    });
    clearTimeout(t);
    if (!res.ok) return null;
    return await res.text();
  } catch { return null; }
}

async function trySitemap(origin, name, articlePath) {
  console.log('\n=== ' + name + ' ===');
  const sitemapUrls = [
    origin + '/sitemap.xml',
    origin + '/sitemap_index.xml',
    origin + '/sitemap-0.xml',
    origin + '/news-sitemap.xml',
    origin + '/blog-sitemap.xml',
  ];

  for (const sitemapUrl of sitemapUrls) {
    const text = await fetchText(sitemapUrl);
    if (!text) { console.log('  ❌ ' + sitemapUrl.replace(origin, '')); continue; }

    // Parse XML
    const $ = cheerio.load(text, { xmlMode: true });
    const allLocs = [];
    $('url loc, sitemap loc').each(function() {
      allLocs.push($(this).text().trim());
    });

    const articleLinks = allLocs.filter(u => u.includes(articlePath));
    console.log('  ✅ ' + sitemapUrl.replace(origin, '') + ': ' + allLocs.length + ' total URLs, ' + articleLinks.length + ' match "' + articlePath + '"');

    if (articleLinks.length > 0) {
      articleLinks.slice(0, 8).forEach(u => console.log('    → ' + u));
    }

    // If this is a sitemap index, list sub-sitemaps
    const subSitemaps = allLocs.filter(u => u.includes('sitemap'));
    if (subSitemaps.length > 0 && allLocs.length === subSitemaps.length) {
      console.log('  Sub-sitemaps:');
      subSitemaps.forEach(s => console.log('    ' + s));
    }

    if (allLocs.length > 0) break; // Stop at first working sitemap
  }
}

(async () => {
  await trySitemap('https://cohere.com', 'Cohere', '/blog/');
  await trySitemap('https://mistral.ai', 'Mistral AI', '/news/');
  await trySitemap('https://www.anthropic.com', 'Anthropic', '/news/');
  await trySitemap('https://openai.com', 'OpenAI', '/research/');
})();
