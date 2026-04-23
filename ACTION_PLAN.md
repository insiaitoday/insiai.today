# 🚀 Action Plan - What to Do Next

## ⏱️ Quick Setup (15 minutes)

### Step 1: Database Migration (2 minutes)
```sql
-- Open Supabase Dashboard → SQL Editor
-- Copy and paste this:

ALTER TABLE posts ADD COLUMN IF NOT EXISTS fetched_at TIMESTAMPTZ;
UPDATE posts SET fetched_at = created_at WHERE fetched_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_posts_fetched_at ON posts(fetched_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_status_fetched_at ON posts(status, fetched_at DESC);
```
✅ Click "Run" button

---

### Step 2: Get Admin Token (1 minute)
```javascript
// Open Admin Panel in browser
// Press F12 to open console
// Run this command:

JSON.parse(localStorage.getItem("leviai_admin_session")).access_token

// Copy the token (without quotes)
```
✅ Save token for next step

---

### Step 3: Add RSS Feeds (5 minutes)
```bash
cd backend

# Replace YOUR_TOKEN_HERE with the token from Step 2
ADMIN_TOKEN="YOUR_TOKEN_HERE" node comprehensive-ai-feeds.js

# Wait for completion
# Should show: "✅ Added: [feed name]" for each feed
```
✅ Verify: Should add 59 feeds

---

### Step 4: Rebuild & Restart (5 minutes)
```bash
# Build backend
cd backend
npm run build

# Start backend
npm run dev

# In another terminal, build admin panel
cd admin
npm run build
npm run dev
```
✅ Both should start without errors

---

### Step 5: Test Everything (2 minutes)
1. Open Admin Panel → RSS Feeds
2. Verify you see 59+ feeds listed
3. Click "🔄 Fetch All Now" button
4. Wait 1-2 minutes
5. Click "📊 Recent (2h)" button
6. Should see newly fetched articles grouped by source

✅ If you see articles, everything works!

---

## 🔧 Daily Usage

### Fix Broken Feed URLs
```
1. Look for red "error" badges
2. Click "✏️ Edit" button
3. Update RSS URL
4. Click "✅ Save Changes"
5. Click "🔄 Fetch" to test
```

### Test Individual Feed
```bash
cd backend
node test-single-feed.js "https://example.com/feed.xml"
```

### View Recent Articles
```
1. Go to Admin Panel → RSS Feeds
2. Click "📊 Recent (2h)"
3. See all articles fetched in past 2 hours
```

---

## 📚 Documentation Quick Reference

| Need to... | Read this file |
|------------|----------------|
| Setup quickly | QUICK_START.md |
| Fix broken feeds | FIXING_BROKEN_FEEDS.md |
| Find RSS URLs | RSS_FEED_FINDER_GUIDE.md |
| Understand everything | COMPLETE_SUMMARY.md |
| See visual examples | VISUAL_GUIDE.md |

---

## ✅ Success Checklist

- [ ] Database migration completed
- [ ] 59 RSS feeds added
- [ ] Backend builds without errors
- [ ] Admin panel builds without errors
- [ ] Can see feeds in admin panel
- [ ] "Fetch All Now" works
- [ ] "Recent (2h)" shows articles
- [ ] Edit button works on feeds
- [ ] Can update feed URLs

---

## 🎯 Expected Results

After setup, you should have:
- ✅ 59 active RSS feeds
- ✅ Articles fetching automatically every 1-3 hours
- ✅ "Recent (2h)" showing 10-50+ articles
- ✅ Edit capability for all feeds
- ✅ Complete AI news coverage

---

## 🐛 Common Issues

### Issue: "Token expired" error
**Fix:** Get fresh token from browser console (Step 2)

### Issue: "Recent (2h)" shows nothing
**Fix:** Click "Fetch All Now" first, wait 2 minutes, try again

### Issue: Some feeds show "error"
**Fix:** Click "✏️ Edit", update URL, save, test with "🔄 Fetch"

### Issue: Backend won't start
**Fix:** Check for TypeScript errors, run `npm run build` again

---

## 💡 Pro Tips

1. **Check feeds weekly** - Look for red "error" badges
2. **Use edit feature** - Fix broken URLs immediately
3. **Test before adding** - Use `test-single-feed.js` script
4. **Monitor "Recent (2h)"** - Verify feeds are working
5. **Adjust frequencies** - Important feeds = 60 min, others = 120-180 min

---

## 🎉 You're Done!

Your AI news aggregator is now:
- ✅ Production ready
- ✅ Fully featured
- ✅ Easy to maintain
- ✅ Comprehensive coverage

**Start with Step 1 above and you'll be running in 15 minutes!** 🚀

---

**Questions?** Check COMPLETE_SUMMARY.md for full details.
