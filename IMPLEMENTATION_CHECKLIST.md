## ✅ Implementation Checklist

### Phase 1: Database Migration (5 minutes)
- [ ] Open Supabase Dashboard
- [ ] Go to SQL Editor
- [ ] Copy SQL from `supabase/migrations/004_add_fetched_at.sql`
- [ ] Execute the migration
- [ ] Verify: Check that `posts` table now has `fetched_at` column

### Phase 2: Add RSS Feeds (10 minutes)
- [ ] Open Admin Panel in browser
- [ ] Open browser console (F12)
- [ ] Run: `JSON.parse(localStorage.getItem("leviai_admin_session")).access_token`
- [ ] Copy the token
- [ ] Open terminal and run:
  ```bash
  cd backend
  ADMIN_TOKEN="paste_token_here" node comprehensive-ai-feeds.js
  ```
- [ ] Wait for script to complete
- [ ] Verify: Script should show "Added: X" for each feed

### Phase 3: Rebuild & Restart Backend (2 minutes)
- [ ] Run:
  ```bash
  cd backend
  npm run build
  npm run dev
  ```
- [ ] Verify: Backend starts without errors
- [ ] Check logs for "RSS poll cycle" messages

### Phase 4: Test Everything (5 minutes)
- [ ] Open Admin Panel → RSS Feeds
- [ ] Verify: You see 59+ feeds listed
- [ ] Click "Fetch All Now" button
- [ ] Wait 1-2 minutes for fetching to complete
- [ ] Click "Recent (2h)" button
- [ ] Verify: Modal shows newly fetched articles grouped by source
- [ ] Check: Articles show correct timestamps

### Phase 5: Optional - Validate Feeds
- [ ] Run feed validator:
  ```bash
  cd backend
  node validate-feeds.js
  ```
- [ ] Review: Check which feeds are working
- [ ] Fix: Update any broken feed URLs if needed

## 🎯 Success Criteria

✅ Database has `fetched_at` column with indexes
✅ 59 RSS feeds added to database
✅ Backend compiles and runs without errors
✅ "Recent (2h)" shows articles fetched in past 2 hours
✅ Articles are grouped by source in the modal
✅ Feed fetching works when clicking "Fetch All Now"

## 🐛 Troubleshooting

**Problem: Migration fails**
- Solution: Check if column already exists, use `IF NOT EXISTS`

**Problem: Script can't add feeds (401 error)**
- Solution: Token expired, get a fresh token from browser

**Problem: "Recent (2h)" shows no articles**
- Solution: Click "Fetch All Now" first to populate articles

**Problem: Some feeds fail to fetch**
- Solution: Normal - some RSS URLs may have changed, run `validate-feeds.js`

**Problem: Backend won't start after build**
- Solution: Check for TypeScript errors, ensure all imports are correct

## 📊 Expected Results

After completion, you should have:
- ✅ 59 active RSS feeds
- ✅ Articles fetching every 1-3 hours automatically
- ✅ "Recent (2h)" showing 10-50+ articles (depending on timing)
- ✅ Complete coverage of AI news landscape
- ✅ No missing updates from major AI companies

## ⏱️ Total Time: ~25 minutes

Good luck! 🚀
