# How to Add Web Scraper Feeds

## Option 1: Manual (Recommended - Easy)

Go to Admin Panel → RSS Feeds → Click "Add Feed" for each:

### Tier 1 (Premium Sources)
1. **Anthropic**
   - URL: `https://www.anthropic.com/news`
   - Priority: Tier 1

2. **OpenAI**
   - URL: `https://openai.com/news/`
   - Priority: Tier 1

3. **Google DeepMind**
   - URL: `https://deepmind.google/discover/blog/`
   - Priority: Tier 1

4. **Mistral AI**
   - URL: `https://mistral.ai/news/`
   - Priority: Tier 1

### Tier 2 (Standard Sources)
5. **Meta AI**
   - URL: `https://ai.meta.com/blog/`
   - Priority: Tier 2

6. **Cohere**
   - URL: `https://cohere.com/blog`
   - Priority: Tier 2

7. **Stability AI**
   - URL: `https://stability.ai/news`
   - Priority: Tier 2

8. **Adept**
   - URL: `https://www.adept.ai/blog`
   - Priority: Tier 2

---

## Option 2: Automated Script

### Step 1: Get your admin token
1. Open Admin Panel in browser
2. Open Developer Console (F12)
3. Run: `localStorage.getItem("leviai_admin_session")`
4. Copy the token (the part after "access_token":")

### Step 2: Run the script
```bash
cd backend
export ADMIN_TOKEN="your_token_here"
node add-scraper-feeds.js
```

---

## After Adding Feeds

1. Go to Admin Panel → RSS Feeds
2. You should see all 8 new feeds
3. Click "Fetch All Now" to test
4. Check Pending Queue for new articles
5. The scrapers will run automatically every 2 hours

---

## How It Works

- **Smart Detection**: System detects company name and uses web scraper
- **Fallback**: If scraper fails, tries RSS (if available)
- **No Duplicates**: Automatically checks for existing articles
- **Same Management**: Use same admin panel controls (Enable/Disable/Delete)

---

## Troubleshooting

**If a feed shows "error" status:**
- The website structure may have changed
- Check if the URL is still valid
- Disable the feed temporarily

**If no articles appear:**
- Click "Fetch" button manually
- Check backend logs for errors
- Some sites may block scrapers (use VPN if needed)
