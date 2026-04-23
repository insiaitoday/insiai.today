# Fix Broken RSS Feeds - Quick Guide

## Problem
Many RSS feed URLs are returning 404 or 403 errors because:
1. Companies changed their RSS URLs
2. Companies removed RSS feeds entirely
3. Sites are blocking automated requests
4. URLs were incorrect from the start

## Solution - 3 Steps

### Step 1: Clean Up Broken Feeds (2 minutes)

```bash
cd backend

# Get your admin token from browser console (F12):
# JSON.parse(localStorage.getItem("leviai_admin_session")).access_token

# Delete all broken feeds
ADMIN_TOKEN="your_token" node cleanup-broken-feeds.js
```

This will remove ~35 broken feeds from your database.

---

### Step 2: Add Verified Working Feeds (3 minutes)

```bash
# Add only feeds that actually work
ADMIN_TOKEN="your_token" node verified-working-feeds.js
```

This adds ~30 verified working feeds including:
- ✅ TechCrunch AI, MIT Tech Review, Wired, Ars Technica
- ✅ ArXiv (AI, ML, NLP, Computer Vision)
- ✅ Hugging Face, Microsoft AI
- ✅ AWS ML, Google Cloud AI, NVIDIA
- ✅ Towards Data Science, KDNuggets, Analytics Vidhya
- ✅ OpenAI, Anthropic, DeepMind (via web scrapers)

---

### Step 3: Restart Backend (1 minute)

```bash
# Backend should already be running, just wait for next fetch cycle
# Or manually trigger: Go to Admin Panel → "Fetch All Now"
```

---

## What Changed?

### ❌ Removed (Broken/No RSS):
- Reddit feeds (403 blocked)
- InfoQ AI (404)
- Fast.ai (404)
- Weights & Biases (malformed XML)
- Scale AI (not RSS format)
- Many startup blogs (no RSS)
- Hacker News AI (timeout)
- Papers With Code (malformed XML)

### ✅ Kept (Working):
- Major tech news sites (TechCrunch, Wired, MIT Tech Review)
- ArXiv research papers (very reliable)
- Hugging Face blog
- Microsoft AI blog
- AWS, Google Cloud, NVIDIA blogs
- Data science communities (Towards Data Science, KDNuggets)

### 🔧 Using Web Scrapers (No RSS):
- OpenAI
- Anthropic
- Google DeepMind
- Meta AI
- Cohere
- Stability AI
- Mistral AI

---

## Expected Results

After cleanup and adding verified feeds:
- ✅ ~30 working RSS feeds
- ✅ ~7 web scraper sources
- ✅ No more error messages in logs
- ✅ Articles fetching successfully

---

## Testing

```bash
# Test a single feed
node test-single-feed.js "https://techcrunch.com/category/artificial-intelligence/feed/"

# Should show:
# ✅ Feed is valid!
# 📊 Feed Information: ...
# 📰 Latest 5 Articles: ...
```

---

## Why So Many Failures?

**Reality Check:**
1. **Most AI companies don't provide RSS** - OpenAI, Anthropic, DeepMind, etc. never had public RSS feeds
2. **Reddit blocks automated requests** - Returns 403 for RSS scrapers
3. **Startups don't prioritize RSS** - Newer companies (xAI, Perplexity, Inflection) don't offer RSS
4. **URLs change** - Companies redesign websites and break old RSS URLs

**Good News:**
- Major tech news sites (TechCrunch, Wired, etc.) have reliable RSS
- ArXiv is rock-solid for research papers
- We have web scrapers for companies without RSS
- 30 working feeds is plenty for comprehensive coverage

---

## Quick Commands

```bash
# Clean up broken feeds
ADMIN_TOKEN="token" node cleanup-broken-feeds.js

# Add verified working feeds
ADMIN_TOKEN="token" node verified-working-feeds.js

# Test a feed
node test-single-feed.js "URL"

# Check what's in database
# Go to Admin Panel → RSS Feeds
```

---

## Next Steps

1. Run cleanup script
2. Run verified feeds script
3. Go to Admin Panel
4. Click "Fetch All Now"
5. Click "Recent (2h)" to see results

You'll have a clean, working RSS feed system with no errors! 🎉
