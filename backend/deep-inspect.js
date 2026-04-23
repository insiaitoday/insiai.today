/**
 * deep-inspect.js — deeply inspect Cohere and Mistral for article links
 */
require('dotenv').config();
const cheerio = require('cheerio');

async function deepInspect(url, name, searchPatterns) {
  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 25000);
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,*/*',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      signal: controller.signal,
      redirect: 'follow'
    });
    clearTimeout(t);
    const html = await res.text();
    const $ = cheerio.load(html);
    const origin = new URL(url).origin;

    console.log('\n=== ' + name + ' (HTTP ' + res.status + ', ' + Math.round(html.length/1024) + 'KB) ===');

    // Search for all links matching any of the patterns
    const matchedLinks = {};
    searchPatterns.forEach(p => { matchedLinks[p] = []; });

    $('a[href]').each(function() {
      const href = $(this).attr('href') || '';
      const text = $(this).text().replace(/\s+/g, ' ').trim();
      searchPatterns.forEach(p => {
        if (href.includes(p) && href.length > p.length + 1) {
          const full = href.startsWith('http') ? href : origin + (href.startsWith('/') ? '' : '/') + href;
          matchedLinks[p].push({ href: full, text: text.substring(0, 80) });
        }
      });
    });

    searchPatterns.forEach(p => {
      console.log('Pattern "' + p + '": ' + matchedLinks[p].length + ' links');
      matchedLinks[p].slice(0, 5).forEach(l => {
        console.log('  → ' + l.href.substring(0, 70) + (l.text ? ' | "' + l.text + '"' : ''));
      });
    });

    // Also scan all href patterns in the page
    const allHrefs = new Set();
    $('a[href]').each(function() {
      const href = $(this).attr('href') || '';
      if (href.startsWith('/') && href.length > 2) allHrefs.add(href.split('/')[1]);
    });
    console.log('All path roots: ' + [...allHrefs].slice(0, 20).join(', '));

    // Look for any JSON data embedded in script tags (Next.js hydration data)
    const scriptTags = $('script[type="application/json"], script#__NEXT_DATA__').length;
    console.log('Script data tags: ' + scriptTags);

    // Try finding article-looking elements
    const articleEls = $('article, [data-testid*="article"], [data-testid*="post"], [class*="ArticleCard"], [class*="BlogPost"], [class*="PostCard"]');
    console.log('Article elements found: ' + articleEls.length);

    // Check for JSON in __NEXT_DATA__
    const nextData = $('#__NEXT_DATA__').html();
    if (nextData) {
      try {
        const parsed = JSON.parse(nextData);
        // Look for blog/news items in pageProps
        const str = JSON.stringify(parsed.props?.pageProps || {});
        const slugMatches = str.match(/"slug":"([^"]{5,60})"/g) || [];
        const titleMatches = str.match(/"title":"([^"]{10,100})"/g) || [];
        console.log('JSON slugs found: ' + slugMatches.length + ' | titles: ' + titleMatches.length);
        titleMatches.slice(0, 5).forEach(t => console.log('  JSON title: ' + t));
      } catch {}
    }

  } catch (e) {
    console.log('ERROR ' + name + ':', e.message);
  }
}

(async () => {
  await deepInspect('https://cohere.com/blog', 'Cohere Blog', ['/blog/', '/blog', 'cohere.com/blog']);
  await deepInspect('https://mistral.ai/news/', 'Mistral News', ['/news/', 'mistral.ai/news']);
})();
