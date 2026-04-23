// Service: RSS Feed Poller
// Fetches, parses, deduplicates, and saves RSS articles to pending queue

import Parser from 'rss-parser';
import { supabase } from '../lib/supabase';
import { generateUniqueSlug } from '../lib/slugify';
import { downloadAndUploadThumbnail } from './imageService';
import { runWebScraper } from './webScrapers';
import type { RssFeed } from '../types';

const parser = new Parser({
  timeout: 15000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept': 'application/rss+xml, application/xml, text/xml, */*',
  },
  customFields: {
    item: [
      ['media:content', 'mediaContent'],
      ['media:thumbnail', 'mediaThumbnail'],
      ['enclosure', 'enclosure'],
    ],
  },
});

const KEYWORD_CATEGORIES: { category: string; keywords: string[] }[] = [
  { category: 'Breaking News',    keywords: ['breaking', 'urgent', 'just in', 'exclusive'] },
  { category: 'Product Launches', keywords: ['launch', 'release', 'announce', 'new model', 'introducing', 'available'] },
  { category: 'Research Papers',  keywords: ['research', 'paper', 'study', 'arxiv', 'benchmark', 'dataset'] },
  { category: 'Funding',          keywords: ['funding', 'raised', 'series', 'investment', 'valuation', 'million', 'billion'] },
  { category: 'Tools',            keywords: ['tool', 'api', 'sdk', 'plugin', 'integration', 'open source', 'github'] },
  { category: 'Tutorials',        keywords: ['tutorial', 'how to', 'guide', 'learn', 'course', 'beginner'] },
];

function detectCategory(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase();
  for (const { category, keywords } of KEYWORD_CATEGORIES) {
    if (keywords.some((k) => text.includes(k))) return category;
  }
  return 'General';
}

function extractThumbnail(item: Record<string, unknown>): string | undefined {
  // media:content
  const media = item.mediaContent as { $?: { url?: string } } | undefined;
  if (media?.$?.url) return media.$.url;

  // media:thumbnail
  const thumb = item.mediaThumbnail as { $?: { url?: string } } | undefined;
  if (thumb?.$?.url) return thumb.$.url;

  // enclosure (podcasts/media)
  const enc = item.enclosure as { url?: string; type?: string } | undefined;
  if (enc?.url && enc?.type?.startsWith('image')) return enc.url;

  // Extract first image from content:encoded or content
  const content = (item['content:encoded'] || item.content || '') as string;
  const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (imgMatch) return imgMatch[1];

  return undefined;
}

/**
 * Check if an article is a duplicate by URL or very similar title
 */
async function isDuplicate(link: string, title: string): Promise<boolean> {
  // Check by exact URL
  const { data: byUrl } = await supabase
    .from('posts')
    .select('id')
    .eq('source_url', link)
    .maybeSingle();

  if (byUrl) return true;

  // Check by similar title (first 6 significant words)
  const titleKey = title.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 3)
    .slice(0, 5)
    .join(' ');

  if (titleKey.length > 10) {
    const { data: byTitle } = await supabase
      .from('posts')
      .select('id')
      .ilike('title', `%${titleKey}%`)
      .maybeSingle();

    if (byTitle) return true;
  }

  return false;
}

// Max age: skip articles older than 30 days
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

/**
 * Poll a single RSS feed and save new articles to the pending queue.
 * Returns the number of new articles saved.
 */
export async function pollSingleFeed(feed: RssFeed): Promise<number> {
  let newCount = 0;

  try {
    // Try web scraper first for companies without RSS
    const scraperCount = await runWebScraper(feed.name, feed.id);
    if (scraperCount > 0) {
      await supabase.from('rss_feeds').update({
        last_fetched: new Date().toISOString(),
        last_status: 'success',
      }).eq('id', feed.id);
      return scraperCount;
    }

    // For scraper-only companies that returned 0 new (but scraped OK), still mark success
    // Detect by checking if the URL is not an RSS URL (no .xml, /feed, /rss patterns)
    const isRssUrl = /\.(xml|rss|atom)|\/feed[\/\?]?|\/rss[\/\?]?/i.test(feed.url);
    if (!isRssUrl && scraperCount === 0) {
      // Scraper ran but no new articles (likely duplicates) — mark as success
      await supabase.from('rss_feeds').update({
        last_fetched: new Date().toISOString(),
        last_status: 'success',
      }).eq('id', feed.id);
      return 0;
    }

    // Fall back to RSS parsing
    const feedData = await parser.parseURL(feed.url);
    const items = feedData.items?.slice(0, 100) || []; // fetch up to 100 items

    for (const item of items) {
      const title = item.title?.trim();
      const link  = item.link?.trim();

      if (!title || !link) continue;

      // Skip old articles
      const pubDate = item.pubDate ? new Date(item.pubDate) : null;
      if (pubDate && Date.now() - pubDate.getTime() > MAX_AGE_MS) continue;

      // Check for duplicates
      if (await isDuplicate(link, title)) continue;

      const snippet  = item.contentSnippet?.substring(0, 300) || item.summary?.substring(0, 300) || '';
      const category = detectCategory(title, snippet);
      const slug     = await generateUniqueSlug(title);

      // Extract & upload thumbnail
      let thumbnail = extractThumbnail(item as unknown as Record<string, unknown>);
      if (thumbnail) {
        try {
          thumbnail = await downloadAndUploadThumbnail(thumbnail, slug);
        } catch {
          // Keep original URL if upload fails
        }
      }

      const status = feed.auto_approve ? 'published' : 'pending';
      const published_at = feed.auto_approve ? new Date().toISOString() : undefined;
      const now = new Date().toISOString();

      await supabase.from('posts').insert({
        type: 'rss',
        title,
        slug,
        snippet,
        source_url: link,
        source_name: feed.name,
        thumbnail,
        category,
        status,
        feed_id: feed.id,
        published_at,
        fetched_at: now,
        created_at: pubDate?.toISOString() || now,
      });

      newCount++;
    }

    // Update feed metadata
    await supabase.from('rss_feeds').update({
      last_fetched: new Date().toISOString(),
      last_status: 'success',
    }).eq('id', feed.id);

  } catch (err) {
    const errMsg = (err as Error).message || 'Unknown error';
    console.error(`  ❌ Failed to poll feed "${feed.name}":`, errMsg);
    await supabase.from('rss_feeds').update({
      last_fetched: new Date().toISOString(),
      last_status: 'error',
    }).eq('id', feed.id);
  }

  return newCount;
}

/**
 * Poll all enabled RSS feeds.
 */
export async function pollAllFeeds(): Promise<void> {
  console.log('🔄 Starting RSS poll cycle...');

  const { data: feeds, error } = await supabase
    .from('rss_feeds')
    .select('*')
    .eq('enabled', true)
    .order('priority_tier')
    .order('name');

  if (error || !feeds) {
    console.error('Failed to fetch feeds:', error);
    return;
  }

  let totalNew = 0;
  for (const feed of feeds) {
    const count = await pollSingleFeed(feed as RssFeed);
    if (count > 0) {
      console.log(`  ✅ ${feed.name}: +${count} new articles`);
    }
    totalNew += count;
  }

  console.log(`✅ RSS poll complete — ${totalNew} new articles added`);

  // Notify admin if pending queue is large
  const { count: pendingCount } = await supabase
    .from('posts')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'pending');

  if ((pendingCount || 0) >= 20) {
    console.log(`📬 Pending queue has ${pendingCount} articles — admin review needed`);
  }
}
