// Service: Anthropic News Scraper
// Scrapes https://www.anthropic.com/news since they don't have RSS

import * as cheerio from 'cheerio';
import { supabase } from '../lib/supabase';
import { generateUniqueSlug } from '../lib/slugify';
import { downloadAndUploadThumbnail } from './imageService';

const ANTHROPIC_NEWS_URL = 'https://www.anthropic.com/news';
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

interface ScrapedArticle {
  title: string;
  url: string;
  snippet: string;
  thumbnail?: string;
  pubDate?: Date;
}

/**
 * Scrape Anthropic news page and extract articles
 */
async function scrapeAnthropicNews(): Promise<ScrapedArticle[]> {
  try {
    const response = await fetch(ANTHROPIC_NEWS_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const articles: ScrapedArticle[] = [];

    // Anthropic uses article cards - adjust selectors based on their HTML structure
    $('article, .news-item, [class*="NewsCard"], [class*="news-card"]').each((_, element) => {
      const $el = $(element);

      // Try multiple selectors for title
      const title = $el.find('h2, h3, .title, [class*="title"]').first().text().trim() ||
                    $el.find('a').first().text().trim();

      // Try multiple selectors for link
      let url = $el.find('a').first().attr('href') || '';
      if (url && !url.startsWith('http')) {
        url = `https://www.anthropic.com${url}`;
      }

      // Try multiple selectors for description
      const snippet = $el.find('p, .description, [class*="description"]').first().text().trim().substring(0, 300);

      // Try to find image
      const thumbnail = $el.find('img').first().attr('src') || undefined;

      if (title && url) {
        articles.push({
          title,
          url,
          snippet,
          thumbnail: thumbnail && !thumbnail.startsWith('http') ? `https://www.anthropic.com${thumbnail}` : thumbnail,
        });
      }
    });

    return articles;
  } catch (err) {
    console.error('Failed to scrape Anthropic news:', err);
    return [];
  }
}

/**
 * Fetch and save new Anthropic articles
 */
export async function pollAnthropicNews(): Promise<number> {
  let newCount = 0;

  try {
    const articles = await scrapeAnthropicNews();

    for (const article of articles.slice(0, 100)) { // Max 100 per fetch
      // Check for duplicates
      const { data: existing } = await supabase
        .from('posts')
        .select('id')
        .eq('source_url', article.url)
        .maybeSingle();

      if (existing) continue;

      const slug = await generateUniqueSlug(article.title);

      // Upload thumbnail if available
      let thumbnail = article.thumbnail;
      if (thumbnail) {
        try {
          thumbnail = await downloadAndUploadThumbnail(thumbnail, slug);
        } catch {
          // Keep original URL if upload fails
        }
      }

      await supabase.from('posts').insert({
        type: 'rss',
        title: article.title,
        slug,
        snippet: article.snippet || 'Latest news from Anthropic',
        source_url: article.url,
        source_name: 'Anthropic',
        thumbnail,
        category: 'Product Launch', // Most Anthropic news is product-related
        status: 'pending',
        created_at: new Date().toISOString(),
      });

      newCount++;
    }

    console.log(`  ✅ Anthropic scraper: +${newCount} articles`);
  } catch (err) {
    console.error('❌ Failed to poll Anthropic news:', err);
  }

  return newCount;
}
