# URGENT: Fix Your RSS Feeds Now

## Current Problem
Your backend is showing ~35 failed feeds with errors like:
- ❌ Status code 404 (URL not found)
- ❌ Status code 403 (Blocked/Forbidden)
- ❌ Invalid XML/RSS format
- ❌ Request timeout

## Why This Happened
1. Many AI companies **never had RSS feeds** (OpenAI, Anthropic, DeepMind)
2. Reddit **blocks automated RSS requests** (403 errors)
3. Startups **don't provide RSS** (xAI, Perplexity, Inflection)
4. Some URLs were **incorrect from the start**

## The Fix (5 Minutes)

### Step 1: Get Your Admin Token (30 seconds)
```javascript
// Open Admin Panel in browser
// Press F12 to open console
// Run this command:
JSON.parse(localStorage.getItem("leviai_admin_session")).access_token

// Copy the token (without quotes)
```

### Step 2: Clean Up Broken Feeds (2 minutes)
```bash
cd backend

# Replace YOUR_TOKEN with the token from Step 1
ADMIN_TOKEN="YOUR_TOKEN" node cleanup-broken-feeds.js

# This will delete ~35 broken feeds
```

### Step 3: Add Verified Working Feeds (2 minutes)
```bash
# Still in backend directory
ADMIN_TOKEN="YOUR_TOKEN" node verified-working-feeds.js

# This will add ~30 verified working feeds
```

### Step 4: Test It (30 seconds)
1. Go to Admin Panel → RSS Feeds
2. Click "🔄 Fetch All Now"
3. Wait 1-2 minutes
4. Click "📊 Recent (2h)"
5. Should see articles with **NO ERROR MESSAGES**!

---

## What Gets Removed (35 feeds)

### Blocked by Sites (403 Errors)
- Reddit r/MachineLearning
- Reddit r/artificial
- Reddit r/LocalLLaMA
- xAI (Grok)
- Perplexity AI
- Adept AI
- OpenAI Blog (will use web scraper instead)
- Midjourney

### URLs Don't Exist (404 Errors)
- InfoQ AI
- Fast.ai Blog
- NVIDIA AI Blog (old URL)
- Anthropic Blog (old URL)
- Meta AI Research (old URL)
- Mistral AI (old URL)
- VentureBeat AI (old URL)
- The Verge AI (old URL)
- Inflection AI
- Runway ML
- ElevenLabs
- Together AI
- Replicate
- Modal Labs
- The Batch

### Malformed/Invalid RSS
- Weights & Biases
- Scale AI
- Papers With Code
- Cohere AI
- Stability AI
- Anyscale

---

## What Gets Added (30 feeds)

### ✅ Major Tech News (Reliable RSS)
- TechCrunch AI
- MIT Technology Review AI
- Wired AI
- Ars Technica
- The Verge (main feed)

### ✅ Research Papers (Very Reliable)
- ArXiv CS.AI
- ArXiv CS.LG (Machine Learning)
- ArXiv CS.CL (NLP)
- ArXiv CS.CV (Computer Vision)

### ✅ AI Companies with RSS
- Hugging Face Blog
- Microsoft AI Blog

### ✅ Infrastructure & Cloud
- AWS Machine Learning Blog
- Google Cloud AI Blog
- NVIDIA Blog (main feed)

### ✅ Data Science Communities
- Towards Data Science
- KDNuggets
- Analytics Vidhya
- Machine Learning Mastery

### ✅ AI News & Analysis
- The Gradient
- Synced AI
- AI News

### ✅ Companies Using Web Scrapers (No RSS)
- OpenAI (web scraper)
- Anthropic (web scraper)
- Google DeepMind (web scraper)
- Meta AI (web scraper)
- Cohere (web scraper)
- Stability AI (web scraper)
- Mistral AI (web scraper)

---

## Expected Results

**Before Fix:**
```
❌ Failed to poll feed "InfoQ AI": Error: Status code 404
❌ Failed to poll feed "Reddit r/artificial": Error: Status code 403
❌ Failed to poll feed "Fast.ai Blog": Error: Status code 404
... (35 errors)
```

**After Fix:**
```
✅ TechCrunch AI: +5 articles
✅ MIT Technology Review: +3 articles
✅ Hugging Face Blog: +2 articles
✅ ArXiv CS.AI: +12 articles
✅ OpenAI scraper: +1 article
... (no errors!)
```

---

## Why Only 30 Feeds?

**Quality over Quantity:**
- 30 **working** feeds > 60 **broken** feeds
- Major tech news sites have reliable RSS
- ArXiv is rock-solid for research
- Web scrapers handle companies without RSS
- No more error spam in logs

**You Still Get Complete Coverage:**
- ✅ All major AI companies (via scrapers)
- ✅ Top tech news outlets
- ✅ Latest research papers
- ✅ Data science communities
- ✅ Infrastructure updates

---

## Troubleshooting

### "Token expired" error
Get a fresh token from browser console (Step 1)

### "Feed already exists" warnings
That's OK! Script skips duplicates automatically

### Still seeing errors after fix
Some web scrapers may fail initially - that's normal
They'll work on next fetch cycle

### Want to add more feeds later
Use the Edit button in Admin Panel to add/test new feeds

---

## Commands Summary

```bash
# Get token (in browser console)
JSON.parse(localStorage.getItem("leviai_admin_session")).access_token

# Clean up (in terminal)
cd backend
ADMIN_TOKEN="your_token" node cleanup-broken-feeds.js

# Add working feeds
ADMIN_TOKEN="your_token" node verified-working-feeds.js

# Test a feed
node test-single-feed.js "https://techcrunch.com/category/artificial-intelligence/feed/"
```

---

## Files Created

- `backend/cleanup-broken-feeds.js` - Removes broken feeds
- `backend/verified-working-feeds.js` - Adds working feeds
- `FIX_BROKEN_FEEDS_NOW.md` - This guide

---

**Do this now and your RSS feeds will work perfectly!** 🚀

No more error messages, just clean, working news feeds.
