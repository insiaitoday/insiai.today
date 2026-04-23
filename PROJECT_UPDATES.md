# Project Updates Summary - April 11, 2026

## 🎯 Completed Tasks

### 1. Fixed "Recent (2h)" Feature in Admin Panel
**Problem:** The "Recent (2h)" button was showing articles based on their original publication date (`created_at`), not when they were actually fetched. This meant old articles wouldn't appear even if just fetched.

**Solution:**
- Added `fetched_at` timestamp field to track when articles are added to the database
- Updated RSS poller to set `fetched_at` on insert
- Modified admin panel to filter by `fetched_at` instead of `created_at`
- Updated backend API to support `filterBy` parameter

**Files Modified:**
- `backend/src/types/index.ts` - Added fetched_at field
- `backend/src/services/rssPoller.ts` - Set fetched_at timestamp
- `backend/src/routes/posts.ts` - Added filterBy parameter support
- `admin/src/app/feeds/page.tsx` - Filter by fetched_at
- `supabase/migrations/004_add_fetched_at.sql` - Database migration

### 2. Comprehensive AI RSS Feeds (59 Feeds)
**Problem:** Limited RSS feed coverage missing many important AI news sources.

**Solution:** Added comprehensive coverage of all major AI news sources:

**Tier 1 (26 feeds - checked hourly):**
- Top AI Companies: OpenAI, Anthropic, Google DeepMind, Meta AI, Microsoft AI, Mistral, Cohere, Hugging Face, Stability AI, xAI, Perplexity, Character.AI, Inflection, Adept
- Major Tech News: TechCrunch AI, The Verge AI, VentureBeat AI, Wired AI, MIT Tech Review, Ars Technica
- Research: ArXiv (CS.AI, CS.LG, CS.CL, CS.CV)

**Tier 2 (28 feeds - checked every 2 hours):**
- Infrastructure: NVIDIA, AWS ML, Azure AI, LangChain, Weights & Biases, Scale AI, Replicate, Modal
- News & Analysis: AI Business, Synced AI, The Gradient, Import AI, The Batch, AI News, ML Mastery
- Communities: Towards Data Science, KDNuggets, Analytics Vidhya, Fast.ai, Papers With Code
- Startups: Runway ML, Midjourney, ElevenLabs, Together AI, Anyscale

**Tier 3 (5 feeds - checked every 3 hours):**
- Community: Reddit (ML, AI, LocalLLaMA), Hacker News AI, AI Weekly

**Files Created:**
- `backend/comprehensive-ai-feeds.js` - Script to add all feeds
- `backend/validate-feeds.js` - Script to test feed validity
- `FEEDS_SETUP_GUIDE.md` - Detailed documentation
- `QUICK_START.md` - Quick setup instructions

**Files Updated:**
- `supabase/seed.sql` - Updated with all 59 feeds

## 📋 Next Steps for You

### 1. Run Database Migration (Required)
```sql
-- Copy and run in Supabase SQL Editor
ALTER TABLE posts ADD COLUMN IF NOT EXISTS fetched_at TIMESTAMPTZ;
UPDATE posts SET fetched_at = created_at WHERE fetched_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_posts_fetched_at ON posts(fetched_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_status_fetched_at ON posts(status, fetched_at DESC);
```

### 2. Add RSS Feeds
```bash
cd backend

# Get admin token from browser console (F12):
# JSON.parse(localStorage.getItem("leviai_admin_session")).access_token

# Run the script
ADMIN_TOKEN="your_token_here" node comprehensive-ai-feeds.js
```

### 3. Restart Backend
```bash
cd backend
npm run build
npm run dev
```

### 4. Test Everything
1. Open Admin Panel → RSS Feeds
2. Verify 59+ feeds are listed
3. Click "Fetch All Now"
4. Click "Recent (2h)" to see newly fetched articles

## 🎉 Benefits

✅ **Complete AI News Coverage** - Never miss important AI announcements
✅ **Accurate Recent Filtering** - See exactly what was fetched in the past 2 hours
✅ **Optimized Fetch Frequencies** - Hourly checks for breaking news, less frequent for community content
✅ **Easy Management** - All feeds organized by priority tier
✅ **Scalable Architecture** - Ready to handle high volume of articles

## 📚 Documentation

- `QUICK_START.md` - Fast setup guide
- `FEEDS_SETUP_GUIDE.md` - Comprehensive feed documentation
- `supabase/migrations/004_add_fetched_at.sql` - Database migration
- `backend/comprehensive-ai-feeds.js` - Feed addition script
- `backend/validate-feeds.js` - Feed validation script

## 🔧 Technical Details

**Database Changes:**
- New `fetched_at` column in `posts` table
- Two new indexes for performance
- Backward compatible (existing posts get `fetched_at = created_at`)

**API Changes:**
- New `filterBy` query parameter in `/api/posts`
- Supports filtering by `fetched_at` or `created_at`
- Backward compatible (defaults to `created_at`)

**Frontend Changes:**
- Admin panel now passes `filterBy: 'fetched_at'` for Recent feature
- No breaking changes to existing functionality

## ⚡ Performance

- Tier 1 feeds: 60-minute intervals (26 feeds = ~26 requests/hour)
- Tier 2 feeds: 120-minute intervals (28 feeds = ~14 requests/hour)
- Tier 3 feeds: 180-minute intervals (5 feeds = ~1.7 requests/hour)
- Total: ~42 feed fetches per hour (well within limits)

## 🎯 Result

Your AI news aggregator now has:
- ✅ Complete coverage of all major AI companies
- ✅ All top tech news outlets covering AI
- ✅ Latest research papers from ArXiv
- ✅ AI infrastructure and tooling updates
- ✅ Community discussions and trends
- ✅ Accurate "Recent" filtering showing truly fresh content

You're now set up to capture every important AI news update as it happens!
