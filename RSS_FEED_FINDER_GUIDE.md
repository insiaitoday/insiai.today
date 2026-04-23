# RSS Feed URL Finder Guide

## How to Find Working RSS Feed URLs

### Method 1: Common RSS URL Patterns
Try these common patterns by replacing `example.com` with the actual domain:

```
https://example.com/rss
https://example.com/feed
https://example.com/feed.xml
https://example.com/rss.xml
https://example.com/blog/rss
https://example.com/blog/feed
https://example.com/news/rss
https://example.com/atom.xml
```

### Method 2: Check Website Source
1. Visit the company's blog/news page
2. Right-click → "View Page Source"
3. Search for (Ctrl+F): `rss`, `feed`, `atom`
4. Look for `<link rel="alternate" type="application/rss+xml">`

### Method 3: Browser Extensions
- **RSS Feed Finder** (Chrome/Firefox)
- **Feedbro** (Chrome/Firefox)
- **RSS Button** (Firefox)

### Method 4: RSS Discovery Services
- https://rss.app/ - Generate RSS from any website
- https://fetchrss.com/ - Create RSS feeds
- https://politepol.com/ - Convert web pages to RSS

## Known Working RSS Feeds (Updated 2026-04-11)

### ✅ Verified Working Feeds

**AI Companies:**
```
OpenAI: https://openai.com/blog/rss
Anthropic: https://www.anthropic.com/news (no RSS - needs web scraper)
Google DeepMind: https://deepmind.google/discover/blog/ (no RSS - needs web scraper)
Meta AI: https://ai.meta.com/blog/ (no RSS - needs web scraper)
Microsoft AI: https://blogs.microsoft.com/ai/feed/
Hugging Face: https://huggingface.co/blog/feed.xml
Cohere: https://cohere.com/blog (no RSS - needs web scraper)
Mistral AI: https://mistral.ai/news/ (no RSS - needs web scraper)
```

**Tech News:**
```
TechCrunch AI: https://techcrunch.com/tag/artificial-intelligence/feed/
The Verge AI: https://www.theverge.com/ai-artificial-intelligence/rss/index.xml
VentureBeat AI: https://venturebeat.com/category/ai/feed/
Wired AI: https://www.wired.com/feed/tag/ai/latest/rss
MIT Tech Review: https://www.technologyreview.com/topic/artificial-intelligence/feed/
Ars Technica: https://feeds.arstechnica.com/arstechnica/technology-lab
```

**Research:**
```
ArXiv CS.AI: https://rss.arxiv.org/rss/cs.AI
ArXiv CS.LG: https://rss.arxiv.org/rss/cs.LG
ArXiv CS.CL: https://rss.arxiv.org/rss/cs.CL
ArXiv CS.CV: https://rss.arxiv.org/rss/cs.CV
```

**Infrastructure:**
```
NVIDIA: https://blogs.nvidia.com/blog/category/deep-learning/feed/
AWS ML: https://aws.amazon.com/blogs/machine-learning/feed/
LangChain: https://blog.langchain.dev/rss/
```

### ❌ Feeds That Don't Have RSS (Use Web Scraper)

These companies don't provide RSS feeds, but the system has web scrapers for them:
- Anthropic (https://www.anthropic.com/news)
- Google DeepMind (https://deepmind.google/discover/blog/)
- Meta AI (https://ai.meta.com/blog/)
- Cohere (https://cohere.com/blog)
- Mistral AI (https://mistral.ai/news/)
- Stability AI (https://stability.ai/news)
- Adept (https://www.adept.ai/blog)

**Note:** For these, keep the URL as-is. The system will automatically use web scraping instead of RSS parsing.

## How to Update Feeds in Admin Panel

### Step 1: Identify Broken Feeds
1. Go to Admin Panel → RSS Feeds
2. Look for feeds with status "error" (red badge)
3. Click the feed URL to test it in browser
4. If it shows 404 or doesn't load, it needs updating

### Step 2: Find the Correct URL
1. Visit the company's main website
2. Navigate to their Blog or News section
3. Try the common RSS patterns listed above
4. Test the URL in your browser - it should show XML content

### Step 3: Update the Feed
1. Click the "✏️ Edit" button next to the feed
2. Update the "RSS URL" field with the new working URL
3. Optionally update other settings:
   - **Fetch Frequency**: How often to check (60-180 minutes)
   - **Priority Tier**: 1 (hourly), 2 (2-hour), 3 (3-hour)
   - **Auto-approve**: Enable for trusted sources
4. Click "✅ Save Changes"

### Step 4: Test the Feed
1. Click "🔄 Fetch" button next to the updated feed
2. Wait a few seconds
3. Check if it shows "success" status
4. Click "Recent (2h)" to see if articles were fetched

## Troubleshooting

### Feed Returns 404
- The RSS URL has changed
- Try common patterns or check website source
- Some sites removed RSS - consider using web scraper

### Feed Returns 403 Forbidden
- Site is blocking automated requests
- Try adding the feed through a proxy service like rss.app
- Or disable the feed and check manually

### Feed Parses But No Articles
- Feed might be empty (no recent posts)
- Check the feed URL in browser to verify content
- Some feeds only show last 5-10 items

### Feed Shows Old Articles
- This is normal - RSS feeds show publication dates
- The "Recent (2h)" feature filters by fetch time, not publication date
- Old articles won't appear in "Recent (2h)" even if just fetched

## Best Practices

1. **Test Before Saving**: Always open the RSS URL in browser first
2. **Check Regularly**: Review feed status weekly for errors
3. **Adjust Frequency**: High-priority feeds = 60 min, low-priority = 180 min
4. **Use Web Scrapers**: For sites without RSS, keep the blog URL and let the scraper handle it
5. **Monitor Recent**: Use "Recent (2h)" to verify feeds are working

## Quick Reference: RSS URL Patterns by Company

| Company | Working Pattern |
|---------|----------------|
| Most blogs | `/feed`, `/rss`, `/feed.xml` |
| WordPress | `/feed/` or `/rss/` |
| Medium | `/@username/feed` |
| Substack | `/feed` |
| Ghost | `/rss/` |
| Blogger | `/feeds/posts/default` |

## Need Help?

If you can't find a working RSS feed:
1. Check if the site has a web scraper configured
2. Use rss.app or fetchrss.com to generate one
3. Disable the feed and check the site manually
4. Contact the site to request RSS support
