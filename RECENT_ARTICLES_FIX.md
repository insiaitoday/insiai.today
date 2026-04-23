# Recent Articles Display Fix

## Problem
The admin panel's "Recent (2h)" button wasn't showing the articles that were being fetched by the RSS poller in the backend terminal.

## Root Cause
1. **Backend API limitation**: The `/api/posts` endpoint only accepted a single status value (e.g., `status=published`), but the frontend was trying to pass multiple statuses as `status=pending,published`
2. **No grouping by source**: The modal didn't show which feed each article came from in a clear summary format

## Changes Made

### 1. Backend (`backend/src/routes/posts.ts`)
- Modified the status filter to support comma-separated values
- Now handles both single status (`status=published`) and multiple statuses (`status=pending,published`)
- Uses `.in()` query for multiple statuses instead of `.eq()`

### 2. Frontend (`admin/src/app/feeds/page.tsx`)
- Increased limit from 100 to 200 articles
- Added console logging to show a summary of fetched articles grouped by source
- Added grouping logic to organize articles by feed source

## How to Verify

1. **Restart the backend server** (if not already running):
   ```bash
   cd backend
   npm start
   ```

2. **Restart the admin panel** (if not already running):
   ```bash
   cd admin
   npm run dev
   ```

3. **Wait for RSS polling** or manually trigger it:
   - The RSS poller runs automatically every 2 hours
   - Or click "🔄 Fetch All Now" button in the admin panel

4. **Check the Recent Articles**:
   - Go to Admin Panel → Feeds page
   - Click "📊 Recent (2h)" button
   - You should now see all articles fetched in the past 2 hours
   - Articles are grouped by source (feed name)
   - Each group shows the count of articles

5. **Console Output**:
   - Open browser DevTools → Console
   - When you click "Recent (2h)", you'll see a summary like:
     ```
     📊 Recent articles (past 2h):
       ✅ NVIDIA AI Blog: +0 articles
       ✅ Hacker News AI: +0 articles
       ✅ Towards Data Science: +6 articles
       ...
     ✅ Total: 6 articles
     ```

## Expected Behavior

- **Backend terminal**: Shows RSS poll results with article counts per feed
- **Admin panel**: "Recent (2h)" button displays the same articles in a modal
- **Grouping**: Articles are organized by source feed with counts
- **Status filter**: Shows both pending and published articles from the past 2 hours

## Notes

- The `fetched_at` field is used to filter articles (not `created_at`)
- Articles older than 2 hours won't appear in the recent view
- The modal shows up to 200 most recent articles
- Both pending and published articles are included
