// Service: Web Scrapers for AI Companies without RSS
// Uses sitemap.xml + individual page title extraction for React SPAs
// This approach works regardless of how pages are rendered (SSR/SPA).

import * as cheerio from 'cheerio';
import { supabase } from '../lib/supabase';
import { generateUniqueSlug } from '../lib/slugify';
import { downloadAndUploadThumbnail } from './imageService';

interface ScrapedArticle {
  title: string;
  url: string;
  snippet: string;
  thumbnail?: string;
  pubDate?: Date;
}

const FETCH_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
};

const MAX_AGE_DAYS = 30; // Only fetch articles published in the last 30 days

async function fetchText(url: string, timeoutMs = 20000): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: FETCH_HEADERS,
      signal: AbortSignal.timeout(timeoutMs),
      redirect: 'follow',
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

/**
 * Parse a sitemap XML and return { url, lastmod? } entries
 * Handles both sitemap indexes and regular sitemaps
 */
async function parseSitemap(
  sitemapUrl: string,
  pathFilter: string
): Promise<Array<{ url: string; lastmod?: Date }>> {
  const xml = await fetchText(sitemapUrl, 15000);
  if (!xml) return [];

  const $ = cheerio.load(xml, { xmlMode: true });
  const entries: Array<{ url: string; lastmod?: Date }> = [];

  // Regular sitemap <url> entries
  $('url').each(function () {
    const loc = $(this).find('loc').text().trim();
    const lastmodStr = $(this).find('lastmod').text().trim();
    if (loc.includes(pathFilter)) {
      entries.push({
        url: loc,
        lastmod: lastmodStr ? new Date(lastmodStr) : undefined,
      });
    }
  });

  // Sitemap index — recursively fetch matching sub-sitemaps
  if (entries.length === 0) {
    const subSitemaps: string[] = [];
    $('sitemap loc').each(function () {
      const loc = $(this).text().trim();
      subSitemaps.push(loc);
    });

    for (const sub of subSitemaps.slice(0, 10)) {
      const subEntries = await parseSitemap(sub, pathFilter);
      entries.push(...subEntries);
      if (entries.length > 200) break;
    }
  }

  return entries;
}

/**
 * Filter sitemap entries to only recent ones, sorted newest first
 */
function filterRecent(
  entries: Array<{ url: string; lastmod?: Date }>,
  maxAgeDays: number = MAX_AGE_DAYS
): Array<{ url: string; lastmod?: Date }> {
  const cutoff = Date.now() - maxAgeDays * 24 * 60 * 60 * 1000;

  // If we have lastmod dates, filter by them
  const withDates = entries.filter(e => e.lastmod && e.lastmod.getTime() > cutoff);
  if (withDates.length > 0) {
    return withDates.sort((a, b) => (b.lastmod?.getTime() || 0) - (a.lastmod?.getTime() || 0));
  }

  // No dates available — return last 100 entries (likely newest = last in sitemap)
  return entries.slice(-100).reverse();
}

/**
 * Fetch the title, snippet and thumbnail from an article page
 */
async function scrapeArticlePage(
  url: string
): Promise<{ title: string; snippet: string; thumbnail?: string } | null> {
  const html = await fetchText(url, 15000);
  if (!html) return null;

  const $ = cheerio.load(html);

  // Title: try OG tag first, then <h1>, then <title>
  const title =
    $('meta[property="og:title"]').attr('content')?.trim() ||
    $('h1').first().text().trim() ||
    $('title').text().replace(/\s*[\|\-–—].*$/, '').trim();

  if (!title || title.length < 8) return null;

  // Snippet: OG description
  const snippet =
    $('meta[property="og:description"]').attr('content')?.trim() ||
    $('meta[name="description"]').attr('content')?.trim() ||
    '';

  // Thumbnail: OG image
  const thumbnail =
    $('meta[property="og:image"]').attr('content')?.trim() ||
    $('meta[name="twitter:image"]').attr('content')?.trim();

  return { title, snippet: snippet.substring(0, 300), thumbnail };
}

/**
 * Save discovered articles to DB with deduplication
 */
async function saveArticles(
  articles: ScrapedArticle[],
  sourceName: string,
  feedId: string | null,
  category: string,
  autoApprove: boolean = false
): Promise<number> {
  let saved = 0;

  for (const article of articles.slice(0, 100)) {
    try {
      // Dedupe by URL
      const { data: byUrl } = await supabase
        .from('posts').select('id').eq('source_url', article.url).maybeSingle();
      if (byUrl) continue;

      // Dedupe by title
      const sig = article.title.toLowerCase()
        .replace(/[^a-z0-9 ]/g, ' ').split(' ')
        .filter(w => w.length > 3).slice(0, 5).join(' ');
      if (sig.length > 10) {
        const { data: byTitle } = await supabase
          .from('posts').select('id').ilike('title', `%${sig}%`).maybeSingle();
        if (byTitle) continue;
      }

      const slug = await generateUniqueSlug(article.title);
      let thumbnail = article.thumbnail;
      if (thumbnail) {
        try { thumbnail = await downloadAndUploadThumbnail(thumbnail, slug); } catch { /* keep */ }
      }

      // Respect feed's auto_approve setting — only publish directly if explicitly enabled
      const status = autoApprove ? 'published' : 'pending';
      const now = new Date().toISOString();
      const published_at = autoApprove ? now : undefined;

      await supabase.from('posts').insert({
        type: 'rss',
        title: article.title,
        slug,
        snippet: article.snippet || `Latest from ${sourceName}`,
        source_url: article.url,
        source_name: sourceName,
        thumbnail,
        category,
        status,
        feed_id: feedId,
        published_at,
        created_at: article.pubDate?.toISOString() || now,
        fetched_at: now,
      });
      saved++;
    } catch (err) {
      console.error(`  ⚠️  Save error (${sourceName}):`, (err as Error).message);
    }
  }
  return saved;
}

/**
 * Main sitemap-based scraper
 * 1. Fetch sitemap
 * 2. Filter to recent URLs
 * 3. For each new URL, scrape title/description/image
 * 4. Save to DB
 */
async function sitemapScraper(
  config: {
    sitemapUrl: string;
    pathFilter: string;
    sourceName: string;
    feedId: string | null;
    category: string;
    maxAgeDays?: number;
    autoApprove?: boolean;
  }
): Promise<number> {
  const entries = await parseSitemap(config.sitemapUrl, config.pathFilter);
  if (entries.length === 0) {
    console.log(`  ⚠️  ${config.sourceName}: No sitemap entries found`);
    return 0;
  }

  const recent = filterRecent(entries, config.maxAgeDays);
  const toProcess = recent.slice(0, 100); // max 100 per cycle

  const articles: ScrapedArticle[] = [];

  for (const entry of toProcess) {
    // Quick check — skip if already in DB (avoid fetching the page)
    const { data: exists } = await supabase
      .from('posts').select('id').eq('source_url', entry.url).maybeSingle();
    if (exists) continue;

    const meta = await scrapeArticlePage(entry.url);
    if (!meta) continue;

    articles.push({
      title: meta.title,
      url: entry.url,
      snippet: meta.snippet,
      thumbnail: meta.thumbnail,
      pubDate: entry.lastmod,
    });
  }

  const saved = await saveArticles(articles, config.sourceName, config.feedId, config.category, config.autoApprove);
  return saved;
}

// ─── Company Scrapers ─────────────────────────────────────────────────────────

export async function scrapeAnthropicNews(feedId?: string, autoApprove?: boolean): Promise<number> {
  const count = await sitemapScraper({
    sitemapUrl: 'https://www.anthropic.com/sitemap.xml',
    pathFilter: '/news/',
    sourceName: 'Anthropic',
    feedId: feedId || null,
    category: 'Product Launch',
    maxAgeDays: 30,
    autoApprove,
  });
  console.log(`  ✅ Anthropic (sitemap): +${count} articles`);
  return count;
}

export async function scrapeOpenAINews(feedId?: string, autoApprove?: boolean): Promise<number> {
  // OpenAI has a sitemap index — try research and product sub-sitemaps
  let total = 0;

  for (const sub of ['research', 'product', 'release', 'publication']) {
    const count = await sitemapScraper({
      sitemapUrl: `https://openai.com/sitemap.xml/${sub}/`,
      pathFilter: `/${sub}/`,
      sourceName: 'OpenAI',
      feedId: feedId || null,
      category: 'Product Launch',
      maxAgeDays: 30,
      autoApprove,
    });
    total += count;
  }

  console.log(`  ✅ OpenAI (sitemap): +${total} articles`);
  return total;
}

export async function scrapeDeepMindNews(feedId?: string, autoApprove?: boolean): Promise<number> {
  const count = await sitemapScraper({
    sitemapUrl: 'https://deepmind.google/sitemap.xml',
    pathFilter: '/discover/blog/',
    sourceName: 'Google DeepMind',
    feedId: feedId || null,
    category: 'Research',
    maxAgeDays: 30,
    autoApprove,
  });
  console.log(`  ✅ Google DeepMind (sitemap): +${count} articles`);
  return count;
}

export async function scrapeMetaAINews(feedId?: string, autoApprove?: boolean): Promise<number> {
  // Meta AI blog uses engineering.fb.com which has an RSS feed now
  // The scraper is kept as backup but RSS handles this feed
  const count = await sitemapScraper({
    sitemapUrl: 'https://ai.meta.com/sitemap.xml',
    pathFilter: '/blog/',
    sourceName: 'Meta AI',
    feedId: feedId || null,
    category: 'Research',
    maxAgeDays: 30,
    autoApprove,
  });
  console.log(`  ✅ Meta AI (sitemap): +${count} articles`);
  return count;
}

export async function scrapeMistralNews(feedId?: string, autoApprove?: boolean): Promise<number> {
  const count = await sitemapScraper({
    sitemapUrl: 'https://mistral.ai/sitemap.xml',
    pathFilter: '/news/',
    sourceName: 'Mistral AI',
    feedId: feedId || null,
    category: 'Product Launch',
    maxAgeDays: 30, // slightly longer for Mistral which posts less frequently
    autoApprove,
  });
  console.log(`  ✅ Mistral AI (sitemap): +${count} articles`);
  return count;
}

export async function scrapeCohereNews(feedId?: string, autoApprove?: boolean): Promise<number> {
  const count = await sitemapScraper({
    sitemapUrl: 'https://cohere.com/sitemap.xml',
    pathFilter: '/blog/',
    sourceName: 'Cohere',
    feedId: feedId || null,
    category: 'Product Launch',
    maxAgeDays: 30,
    autoApprove,
  });
  console.log(`  ✅ Cohere (sitemap): +${count} articles`);
  return count;
}

export async function scrapeXAINews(feedId?: string, autoApprove?: boolean): Promise<number> {
  // x.ai/news blocks all server-side HTTP requests with 403 (Cloudflare protection).
  // Solution: Use Google News RSS (site:x.ai/news) to get recent articles, and
  // fall back to Google News redirect links (which resolve in user browser) or
  // decode direct base64 links if possible.
  const url = 'https://news.google.com/rss/search?q=site:x.ai/news&hl=en-US&gl=US&ceid=US:en';
  
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    'Accept': 'application/rss+xml, application/xml, text/xml, */*',
    'Accept-Language': 'en-US,en;q=0.9',
  };

  try {
    const res = await fetch(url, { headers, signal: AbortSignal.timeout(15000) });
    if (!res.ok) {
      console.log(`  ⚠️  xAI (Grok): Google News RSS returned status ${res.status}`);
      return 0;
    }
    const xml = await res.text();
    const $ = cheerio.load(xml, { xmlMode: true });

    const articles: ScrapedArticle[] = [];
    const cutoff = Date.now() - MAX_AGE_DAYS * 24 * 60 * 60 * 1000;

    $('item').each(function () {
      const rawTitle = $(this).find('title').text().trim();
      // Clean title: remove " - xAI" or " - x.ai" suffix
      const title = rawTitle.replace(/\s*[-—–]\s*x\.?ai\s*$/i, '').trim();

      const link = $(this).find('link').text().trim() || $(this).find('guid').text().trim();
      const pubDateStr = $(this).find('pubDate').text().trim();
      const pubDate = pubDateStr ? new Date(pubDateStr) : new Date();

      // Skip if older than MAX_AGE_DAYS
      if (pubDate && pubDate.getTime() < cutoff) return;

      // Clean snippet from RSS description
      let snippet = $(this).find('description').text()
        .replace(/<[^>]+>/g, '') // Strip HTML tags
        .replace(/&nbsp;/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      if (snippet.endsWith(' xAI')) {
        snippet = snippet.substring(0, snippet.length - 4).trim();
      }

      // Try decoding the Google News redirect URL to direct x.ai URL if classic format
      let decodedUrl = link;
      try {
        const match = link.match(/\/articles\/([A-Za-z0-9+/=-]+)/);
        if (match) {
          const b64 = match[1];
          const buf = Buffer.from(b64, 'base64');
          const str = buf.toString('utf8');
          const httpIndex = str.indexOf('http');
          if (httpIndex !== -1) {
            const urlPart = str.substring(httpIndex);
            const urlMatch = urlPart.match(/https?:\/\/[^\s\u0000-\u001F\u007F-\u009F"']+/);
            if (urlMatch) {
              decodedUrl = urlMatch[0];
            }
          }
        }
      } catch {
        // Keep original link
      }

      // A beautiful dark abstract tech image for premium look
      const thumbnail = 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80';

      articles.push({
        title,
        url: decodedUrl,
        snippet: snippet.substring(0, 300),
        thumbnail,
        pubDate,
      });
    });

    if (articles.length === 0) {
      console.log('  ⚠️  xAI (Grok): No recent articles found in RSS feed');
      return 0;
    }

    const saved = await saveArticles(articles, 'xAI (Grok)', feedId || null, 'Product Launch', autoApprove);
    console.log(`  ✅ xAI (Grok) (RSS feed scraper): +${saved} articles`);
    return saved;
  } catch (err) {
    console.log('  ⚠️  xAI (Grok) scraper error:', (err as Error).message);
    return 0;
  }
}

export async function scrapeStabilityAINews(feedId?: string, autoApprove?: boolean): Promise<number> {
  // Try sitemap first, fall back to page scraping
  let count = await sitemapScraper({
    sitemapUrl: 'https://stability.ai/sitemap.xml',
    pathFilter: '/news',
    sourceName: 'Stability AI',
    feedId: feedId || null,
    category: 'Product Launch',
    maxAgeDays: 30,
    autoApprove,
  });

  if (count === 0) {
    // Fallback: direct page scrape
    const html = await fetchText('https://stability.ai/news-updates');
    if (html) {
      const $ = cheerio.load(html);
      const articles: ScrapedArticle[] = [];
      const origin = 'https://stability.ai';
      const seen = new Set<string>();

      $('a[href]').each(function () {
        const href = $(this).attr('href') || '';
        if (!href.includes('/news/') && !href.includes('/blog/')) return;
        const full = href.startsWith('http') ? href : origin + (href.startsWith('/') ? '' : '/') + href;
        if (seen.has(full)) return;
        seen.add(full);
        const title = $(this).text().replace(/\s+/g, ' ').trim();
        if (title.length >= 15) articles.push({ title, url: full, snippet: '' });
      });

      count = await saveArticles(articles, 'Stability AI', feedId || null, 'Product Launch', autoApprove);
    }
  }

  console.log(`  ✅ Stability AI: +${count} articles`);
  return count;
}

/**
 * Main router — returns 0 if no matching scraper (RSS poller handles it)
 * autoApprove: when true, articles go directly to 'published'; otherwise stay 'pending'
 */
export async function runWebScraper(feedName: string, feedId?: string, autoApprove?: boolean): Promise<number> {
  const n = feedName.toLowerCase();
  if (n.includes('anthropic'))  return scrapeAnthropicNews(feedId, autoApprove);
  if (n.includes('openai'))     return scrapeOpenAINews(feedId, autoApprove);
  if (n.includes('deepmind'))   return scrapeDeepMindNews(feedId, autoApprove);
  if (n.includes('meta ai'))    return scrapeMetaAINews(feedId, autoApprove);
  if (n.includes('mistral'))    return scrapeMistralNews(feedId, autoApprove);
  if (n.includes('cohere'))     return scrapeCohereNews(feedId, autoApprove);
  if (n.includes('stability'))  return scrapeStabilityAINews(feedId, autoApprove);
  if (n.includes('xai') || n.includes('grok') || n.includes('x.ai')) return scrapeXAINews(feedId, autoApprove);
  return 0;
}
