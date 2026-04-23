# Comprehensive AI RSS Feeds Setup Guide

## Overview
This project now includes **70+ RSS feeds** covering all major AI news sources, companies, research labs, and communities.

## Feed Categories

### Tier 1 (60-minute fetch frequency) - 26 feeds
**Top AI Companies & Labs:**
- OpenAI, Anthropic, Google DeepMind, Google AI, Meta AI, Microsoft AI
- Mistral AI, Cohere, Hugging Face, Stability AI, xAI, Perplexity
- Character.AI, Inflection AI, Adept AI

**Major Tech News:**
- TechCrunch AI, The Verge AI, VentureBeat AI, Wired AI
- MIT Technology Review, Ars Technica

**Research:**
- ArXiv (CS.AI, CS.LG, CS.CL, CS.CV)

### Tier 2 (120-minute fetch frequency) - 28 feeds
**Infrastructure & Tools:**
- NVIDIA, AWS ML, Azure AI, LangChain, Weights & Biases
- Scale AI, Replicate, Modal Labs

**News & Analysis:**
- AI Business, Synced AI, The Gradient, Import AI
- The Batch, AI News, ML Mastery

**Communities:**
- Towards Data Science, KDNuggets, Analytics Vidhya
- Fast.ai, Papers With Code

**Startups:**
- Runway ML, Midjourney, ElevenLabs, Together AI, Anyscale

### Tier 3 (180-minute fetch frequency) - 5 feeds
**Community Aggregators:**
- Reddit (r/MachineLearning, r/artificial, r/LocalLLaMA)
- Hacker News AI, AI Weekly

## How to Add Feeds

### Option 1: Using the Script (Recommended)

1. **Get your admin token:**
   ```bash
   # Open browser console (F12) in admin panel
   # Run this command:
   JSON.parse(localStorage.getItem("leviai_admin_session")).access_token
   ```

2. **Run the script:**
   ```bash
   cd backend
   ADMIN_TOKEN="your_token_here" node comprehensive-ai-feeds.js
   ```

### Option 2: Using Supabase SQL Editor

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy the contents of `supabase/seed.sql` (lines 1-67)
4. Run the SQL query

### Option 3: Manual Addition via Admin Panel

1. Go to Admin Panel → RSS Feeds
2. Click "Add Feed"
3. Fill in the details from the list above

## Feed Configuration

### Fetch Frequencies
- **Tier 1:** 60 minutes (hourly) - Breaking news & major companies
- **Tier 2:** 120 minutes (2 hours) - Regular updates
- **Tier 3:** 180 minutes (3 hours) - Community content

### Auto-Approve
All feeds are set to `auto_approve: false` by default for quality control.
You can enable auto-approve for trusted sources in the admin panel.

## Coverage

This comprehensive feed list ensures you get:
- ✅ All major AI company announcements (OpenAI, Anthropic, Google, Meta, etc.)
- ✅ Breaking AI news from top tech publications
- ✅ Latest research papers from ArXiv
- ✅ AI infrastructure & tooling updates
- ✅ Community discussions and trends
- ✅ Startup launches and funding news
- ✅ Technical tutorials and guides

## Monitoring

The "Recent (2h)" button in the admin panel now shows all articles fetched in the past 2 hours, making it easy to verify that feeds are working correctly.

## Next Steps

1. Run the database migration for `fetched_at` column:
   ```sql
   -- Run in Supabase SQL Editor
   ALTER TABLE posts ADD COLUMN IF NOT EXISTS fetched_at TIMESTAMPTZ;
   UPDATE posts SET fetched_at = created_at WHERE fetched_at IS NULL;
   CREATE INDEX IF NOT EXISTS idx_posts_fetched_at ON posts(fetched_at DESC);
   CREATE INDEX IF NOT EXISTS idx_posts_status_fetched_at ON posts(status, fetched_at DESC);
   ```

2. Add the comprehensive feeds using one of the methods above

3. Restart your backend server:
   ```bash
   cd backend
   npm run dev
   ```

4. Test the "Recent (2h)" feature in the admin panel

## Notes

- Some RSS feed URLs may change over time - check company blogs if a feed stops working
- Reddit feeds can be noisy - consider adjusting their priority or disabling if needed
- ArXiv feeds publish daily at specific times (usually evening EST)
- Tier 1 feeds are checked hourly to catch breaking news quickly
