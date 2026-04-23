/**
 * inspect-cohere.js — inspect Cohere's blog structure to find correct selectors
 */
require('dotenv').config();
const cheerio = require('cheerio');

async function inspect(url, name) {
  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 20000);
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36' },
      signal: controller.signal,
      redirect: 'follow'
    });
    clearTimeout(t);
    const html = await res.text();
    const $ = cheerio.load(html);
    const origin = new URL(url).origin;

    console.log('=== ' + name + ' HTTP ' + res.status + ' ===');
    console.log('Title: ' + $('title').text().trim());
    console.log('Page length: ' + html.length + ' chars');

    // Links
    const seen = new Set();
    let count = 0;
    $('a[href]').each(function() {
      const href = $(this).attr('href') || '';
      const text = $(this).text().replace(/\s+/g, ' ').trim();
      const full = href.startsWith('http') ? href : origin + (href.startsWith('/') ? '' : '/') + href;
      if (!seen.has(full) && count < 20) {
        seen.add(full);
        if (text.length > 10) {
          console.log('  LINK [' + href.substring(0, 60) + '] "' + text.substring(0, 60) + '"');
          count++;
        }
      }
    });

    // Check for common blog path prefixes in the links
    const blogPaths = {};
    $('a[href]').each(function() {
      const href = $(this).attr('href') || '';
      const match = href.match(/^\/([a-z-]+)\//);
      if (match) {
        const seg = match[1];
        blogPaths[seg] = (blogPaths[seg] || 0) + 1;
      }
    });
    console.log('Common path segments:', Object.entries(blogPaths).sort((a,b) => b[1]-a[1]).slice(0,10).map(e => e[0]+'('+e[1]+')').join(', '));

  } catch (e) {
    console.log('ERROR ' + name + ':', e.message);
  }
}

(async () => {
  await inspect('https://cohere.com/blog', 'Cohere blog');
  await inspect('https://mistral.ai/news/', 'Mistral news');
})();
