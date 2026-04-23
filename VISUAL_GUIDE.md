# Visual Guide - Using the RSS Feed Manager

## 🎯 Admin Panel Overview

```
┌─────────────────────────────────────────────────────────────┐
│  RSS Feed Manager                    [📊 Recent (2h)]       │
│  59 active feeds                     [🔄 Fetch All Now]     │
│                                      [+ Add Feed]            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Feed Name          Tier    Last Fetched    Status  Actions  │
│  ─────────────────────────────────────────────────────────  │
│  OpenAI Blog        ⭐ T1   2m ago          success  [⏸][🔄][✏️][Del] │
│  Anthropic Blog     ⭐ T1   5m ago          success  [⏸][🔄][✏️][Del] │
│  TechCrunch AI      ⭐ T1   10m ago         success  [⏸][🔄][✏️][Del] │
│  Broken Feed        🔷 T2   1h ago          error    [▶][🔄][✏️][Del] │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 Edit Feed Modal

```
┌─────────────────────────────────────────────────────────────┐
│  Edit RSS Feed                                          [×]  │
│  Update feed URL and settings                                │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Feed Name *                    RSS URL *                    │
│  ┌─────────────────────┐       ┌─────────────────────┐     │
│  │ OpenAI Blog         │       │ https://openai.com/ │     │
│  └─────────────────────┘       │ blog/rss            │     │
│                                 └─────────────────────┘     │
│                                                               │
│  Priority Tier                  Fetch Frequency (minutes)    │
│  ┌─────────────────────┐       ┌─────────────────────┐     │
│  │ ⭐ Tier 1 (Premium) ▼│       │ 60                  │     │
│  └─────────────────────┘       └─────────────────────┘     │
│                                                               │
│  ☑ Auto-approve articles from this feed                     │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ 💡 Tips for finding RSS feeds:                        │  │
│  │ • Try adding /rss, /feed, or /feed.xml to blog URLs  │  │
│  │ • Check the website footer or header for RSS icons   │  │
│  │ • Use browser extensions like "RSS Feed Finder"      │  │
│  │ • Test the URL in a browser first to verify it works │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  [✅ Save Changes]  [Cancel]                                 │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## 📊 Recent Articles Modal

```
┌─────────────────────────────────────────────────────────────┐
│  All Recent Articles (Past 2 Hours)                    [×]  │
│  From all RSS feeds                                          │
├─────────────────────────────────────────────────────────────┤
│  Total: 47 articles                                          │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ OpenAI Blog                              12 articles    ││
│  ├─────────────────────────────────────────────────────────┤│
│  │ │ GPT-5 Announced with Multimodal Capabilities         ││
│  │ │ [published] 5m ago                                   ││
│  │ │                                                       ││
│  │ │ New API Pricing for GPT-4 Turbo                      ││
│  │ │ [pending] 15m ago                                    ││
│  └─────────────────────────────────────────────────────────┘│
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ TechCrunch AI                            8 articles     ││
│  ├─────────────────────────────────────────────────────────┤│
│  │ │ AI Startup Raises $100M Series B                     ││
│  │ │ [pending] 20m ago                                    ││
│  └─────────────────────────────────────────────────────────┘│
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Workflow Examples

### Example 1: Fixing a Broken Feed

```
Step 1: Identify the Problem
┌────────────────────────────────────┐
│ Mistral AI    ⭐ T1   1h ago  error│
└────────────────────────────────────┘
                ↓
Step 2: Click Edit Button
┌────────────────────────────────────┐
│ [✏️ Edit]                          │
└────────────────────────────────────┘
                ↓
Step 3: Test Current URL in Browser
https://mistral.ai/news/feed/
→ 404 Not Found ❌
                ↓
Step 4: Find Correct URL
Try: https://mistral.ai/news/rss
→ Shows XML ✅
                ↓
Step 5: Update in Modal
┌────────────────────────────────────┐
│ RSS URL *                          │
│ ┌────────────────────────────────┐ │
│ │ https://mistral.ai/news/rss    │ │
│ └────────────────────────────────┘ │
│ [✅ Save Changes]                  │
└────────────────────────────────────┘
                ↓
Step 6: Test the Feed
┌────────────────────────────────────┐
│ [🔄 Fetch]                         │
└────────────────────────────────────┘
                ↓
Step 7: Verify Success
┌────────────────────────────────────┐
│ Mistral AI   ⭐ T1   now   success │
└────────────────────────────────────┘
```

### Example 2: Adding a New Feed

```
Step 1: Click Add Feed
┌────────────────────────────────────┐
│ [+ Add Feed]                       │
└────────────────────────────────────┘
                ↓
Step 2: Fill Form
┌────────────────────────────────────┐
│ Feed Name: Perplexity AI Blog      │
│ RSS URL: https://blog.perplexity...│
│ Priority Tier: ⭐ Tier 1           │
│ ☐ Auto-approve                     │
└────────────────────────────────────┘
                ↓
Step 3: Save
┌────────────────────────────────────┐
│ [✅ Add Feed]                      │
└────────────────────────────────────┘
                ↓
Step 4: Test
┌────────────────────────────────────┐
│ Perplexity AI  ⭐ T1  now  pending │
│ [🔄 Fetch]                         │
└────────────────────────────────────┘
```

### Example 3: Checking Recent Articles

```
Step 1: Fetch All Feeds
┌────────────────────────────────────┐
│ [🔄 Fetch All Now]                 │
└────────────────────────────────────┘
                ↓
Wait 1-2 minutes...
                ↓
Step 2: View Recent
┌────────────────────────────────────┐
│ [📊 Recent (2h)]                   │
└────────────────────────────────────┘
                ↓
Step 3: Review Articles
┌────────────────────────────────────┐
│ Total: 47 articles                 │
│                                    │
│ OpenAI Blog - 12 articles          │
│ TechCrunch AI - 8 articles         │
│ The Verge AI - 6 articles          │
│ ...                                │
└────────────────────────────────────┘
```

## 🎨 Status Indicators

```
✅ success  = Green badge  = Feed working correctly
❌ error    = Red badge    = Feed URL broken or inaccessible
⏸ pending  = Gray badge   = Feed not yet fetched
```

## 🔑 Button Legend

```
⏸ Disable  = Temporarily stop fetching this feed
▶ Enable   = Resume fetching this feed
🔄 Fetch   = Manually fetch this feed now
✏️ Edit    = Update feed URL and settings
Del        = Delete this feed permanently
```

## 📱 Keyboard Shortcuts (Future Enhancement)

```
Ctrl + F     = Focus search (filter feeds)
Ctrl + N     = Add new feed
Ctrl + R     = Fetch all feeds
Ctrl + E     = Edit selected feed
Esc          = Close modal
```

## 💡 Pro Tips

1. **Check Status Colors**
   - Green = All good ✅
   - Red = Needs attention ❌
   - Gray = Not yet tested ⏸

2. **Use Recent (2h) After Fetching**
   - Click "Fetch All Now"
   - Wait 1-2 minutes
   - Click "Recent (2h)" to see results

3. **Test Before Saving**
   - Open RSS URL in browser
   - Should see XML content
   - If 404, find correct URL first

4. **Adjust Fetch Frequency**
   - Breaking news: 60 minutes
   - Regular updates: 120 minutes
   - Community content: 180 minutes

5. **Group by Priority**
   - Tier 1: Must-have sources
   - Tier 2: Nice-to-have sources
   - Tier 3: Optional sources

---

**Happy Feed Managing! 🚀**
