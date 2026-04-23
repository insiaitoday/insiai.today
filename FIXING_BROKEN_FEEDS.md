# Quick Reference: How to Fix Broken RSS Feeds

## Step-by-Step Process

### 1. Identify Broken Feeds
```bash
# In Admin Panel:
# - Go to RSS Feeds page
# - Look for red "error" badges
# - Note the feed names that are failing
```

### 2. Test the Current URL
```bash
# Open the feed URL in your browser
# If you see XML content = working
# If you see 404/error = broken
```

### 3. Find the Correct RSS URL

**Option A: Try Common Patterns**
```
Original: https://example.com/blog
Try:
  - https://example.com/blog/rss
  - https://example.com/blog/feed
  - https://example.com/blog/feed.xml
  - https://example.com/rss
  - https://example.com/feed
```

**Option B: Check Website Source**
```
1. Visit the blog/news page
2. Right-click → View Page Source
3. Search for: "rss" or "feed" or "atom"
4. Look for: <link rel="alternate" type="application/rss+xml" href="...">
```

**Option C: Use Test Script**
```bash
cd backend
node test-single-feed.js "https://example.com/feed.xml"
```

### 4. Update in Admin Panel
```
1. Click "✏️ Edit" button next to the broken feed
2. Update the "RSS URL" field
3. Click "✅ Save Changes"
4. Click "🔄 Fetch" to test
5. Check if status changes to green "success"
```

## Common Issues & Solutions

### Issue: Feed URL Changed
**Solution:** Find new URL using methods above

### Issue: Site Removed RSS
**Solution:** 
- Keep the blog URL (not RSS URL)
- System will use web scraper instead
- Or disable the feed

### Issue: Feed Blocked (403 Error)
**Solution:**
- Use RSS proxy service (rss.app, fetchrss.com)
- Or disable the feed

### Issue: Feed Empty (No Articles)
**Solution:**
- Normal if site hasn't posted recently
- Keep the feed, it will work when they post

## Quick Test Commands

```bash
# Test a single feed
cd backend
node test-single-feed.js "https://openai.com/blog/rss"

# Validate multiple feeds
node validate-feeds.js

# Add all comprehensive feeds
ADMIN_TOKEN="your_token" node comprehensive-ai-feeds.js
```

## Known Working Feeds (April 2026)

### ✅ Confirmed Working
```
OpenAI:           https://openai.com/blog/rss
Microsoft AI:     https://blogs.microsoft.com/ai/feed/
Hugging Face:     https://huggingface.co/blog/feed.xml
TechCrunch AI:    https://techcrunch.com/tag/artificial-intelligence/feed/
The Verge AI:     https://www.theverge.com/ai-artificial-intelligence/rss/index.xml
VentureBeat AI:   https://venturebeat.com/category/ai/feed/
Wired AI:         https://www.wired.com/feed/tag/ai/latest/rss
MIT Tech Review:  https://www.technologyreview.com/topic/artificial-intelligence/feed/
ArXiv CS.AI:      https://rss.arxiv.org/rss/cs.AI
NVIDIA:           https://blogs.nvidia.com/blog/category/deep-learning/feed/
AWS ML:           https://aws.amazon.com/blogs/machine-learning/feed/
LangChain:        https://blog.langchain.dev/rss/
```

### ⚠️ No RSS (Use Web Scraper)
```
Anthropic:        https://www.anthropic.com/news
Google DeepMind:  https://deepmind.google/discover/blog/
Meta AI:          https://ai.meta.com/blog/
Cohere:           https://cohere.com/blog
Mistral AI:       https://mistral.ai/news/
```

## Pro Tips

1. **Always test in browser first** - Open the RSS URL to verify it returns XML
2. **Check fetch frequency** - Set to 60 min for important feeds, 180 min for less critical
3. **Use web scrapers** - For sites without RSS, keep the blog URL (not /rss)
4. **Monitor regularly** - Check feed status weekly
5. **Batch updates** - Fix multiple feeds at once during maintenance

## Need Help?

See full documentation:
- `RSS_FEED_FINDER_GUIDE.md` - Complete guide
- `FEEDS_SETUP_GUIDE.md` - Feed configuration
- `IMPLEMENTATION_CHECKLIST.md` - Setup steps
