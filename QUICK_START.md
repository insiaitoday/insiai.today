# Quick Start Guide - Adding Comprehensive AI Feeds

## Step 1: Run Database Migration

Open Supabase SQL Editor and run:

```sql
-- Add fetched_at column for accurate "Recent" filtering
ALTER TABLE posts ADD COLUMN IF NOT EXISTS fetched_at TIMESTAMPTZ;
UPDATE posts SET fetched_at = created_at WHERE fetched_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_posts_fetched_at ON posts(fetched_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_status_fetched_at ON posts(status, fetched_at DESC);
```

## Step 2: Add RSS Feeds

### Method A: Using the Script (Fastest)

```bash
cd backend

# Get your admin token from browser console (F12):
# JSON.parse(localStorage.getItem("leviai_admin_session")).access_token

# Run the script
ADMIN_TOKEN="your_token_here" node comprehensive-ai-feeds.js
```

### Method B: Using SQL (Alternative)

Copy lines 1-67 from `supabase/seed.sql` and run in Supabase SQL Editor.

## Step 3: Restart Backend

```bash
cd backend
npm run build
npm run dev
```

## Step 4: Verify

1. Open Admin Panel → RSS Feeds
2. You should see 59+ feeds listed
3. Click "Fetch All Now" to test
4. Click "Recent (2h)" to see newly fetched articles

## What You Get

✅ **26 Tier 1 feeds** (checked hourly):
   - All major AI companies (OpenAI, Anthropic, Google, Meta, Microsoft, etc.)
   - Top tech news (TechCrunch, The Verge, Wired, MIT Tech Review)
   - Research papers (ArXiv AI, ML, NLP, Computer Vision)

✅ **28 Tier 2 feeds** (checked every 2 hours):
   - AI infrastructure (NVIDIA, AWS, Azure, LangChain)
   - News & analysis sites
   - Data science communities
   - AI startups (Runway, Midjourney, ElevenLabs, etc.)

✅ **5 Tier 3 feeds** (checked every 3 hours):
   - Reddit communities
   - Hacker News AI
   - AI Weekly newsletter

## Troubleshooting

**Feeds not fetching?**
- Check backend logs for errors
- Verify cron jobs are running
- Test individual feeds with "Fetch" button

**"Recent (2h)" showing old articles?**
- Make sure you ran the database migration
- Restart the backend server

**Some feeds failing?**
- Run `node validate-feeds.js` to test feeds
- Some RSS URLs may have changed - check company blogs

## Next Steps

- Enable auto-approve for trusted sources
- Adjust fetch frequencies based on your needs
- Monitor the "Recent (2h)" feature to ensure feeds are working
- Review and approve pending articles regularly

