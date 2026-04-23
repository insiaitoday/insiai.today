# How to Restart Servers to Apply Changes

## Quick Restart Steps

### Option 1: Restart Both Servers

1. **Stop all Node processes**:
   - Press `Ctrl+C` in each terminal running the servers
   - Or kill all node processes:
     ```bash
     taskkill /F /IM node.exe
     ```

2. **Start Backend**:
   ```bash
   cd D:/LeviAi/backend
   npm start
   ```

3. **Start Admin Panel** (in a new terminal):
   ```bash
   cd D:/LeviAi/admin
   npm run dev
   ```

### Option 2: Restart Only Backend (if admin is already running in dev mode)

The admin panel in dev mode will auto-reload when you save files, so you only need to restart the backend:

```bash
# Stop backend (Ctrl+C in backend terminal)
cd D:/LeviAi/backend
npm start
```

## Verify Changes Are Working

1. Open admin panel: http://localhost:3001 (or your configured port)
2. Go to **Feeds** page
3. Click **"📊 Recent (2h)"** button
4. You should now see:
   - All articles fetched in the past 2 hours
   - Articles grouped by source feed
   - Count of articles per feed
   - Both pending and published articles

## Check Console Logs

Open browser DevTools (F12) → Console tab to see the summary:
```
📊 Recent articles (past 2h):
  ✅ NVIDIA AI Blog: +0 articles
  ✅ Towards Data Science: +6 articles
  ✅ Hacker News AI: +0 articles
✅ Total: 6 articles
```

This matches what you see in the backend terminal during RSS polling!
