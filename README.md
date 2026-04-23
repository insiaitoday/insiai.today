# LeviAI Today

A full-stack AI news aggregation platform with RSS automation, admin panel, user engagement, and AdSense-ready SEO.

## Project Structure

```
d:\LeviAi\
├── frontend/    # Next.js 14 — User-facing website (port 3000)
├── admin/       # Next.js 14 — Admin dashboard (port 3001)
├── backend/     # Node.js Express — REST API + RSS cron (port 3002)
└── supabase/    # SQL migrations + seed data
```

## Quick Start

### 1. Setup Supabase
1. Create a project at https://supabase.com
2. Run `supabase/migrations/001_schema.sql` in the SQL Editor
3. Run `supabase/migrations/002_rls_policies.sql`
4. Run `supabase/migrations/003_indexes.sql`
5. Run `supabase/seed.sql` to seed 30+ RSS feeds
6. Create a Storage bucket named `post-thumbnails` (set to public)

### 2. Configure Environment Variables

**backend/.env**
```
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
FRONTEND_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001
```

**frontend/.env.local**
```
NEXT_PUBLIC_API_URL=http://localhost:3002
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

**admin/.env.local**
```
NEXT_PUBLIC_API_URL=http://localhost:3002
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Install & Run

```bash
# Backend
cd backend && npm install && npm run dev

# Frontend (new terminal)
cd frontend && npm install && npm run dev

# Admin (new terminal)  
cd admin && npm install && npm run dev
```

### 4. Create Admin User
In Supabase → Authentication → Users → Add user:
- Email: `admin@leviai.today`
- Password: `Admin@123` (change after first login!)

## URLs

| Service  | URL |
|----------|-----|
| Website  | http://localhost:3000 |
| Admin    | http://localhost:3001 |
| Backend  | http://localhost:3002 |
| API health | http://localhost:3002/health |

## Key Features

- **RSS Auto-fetch** — Every 2 hours from 30+ sources
- **Pending Queue** — Review, edit, add commentary, approve/skip
- **Original Articles** — TipTap rich editor with SEO fields
- **Comments** — Nested replies, email required, moderation
- **Votes** — IP-based upvote/downvote without login
- **Analytics** — Views, votes, top posts charts
- **SEO** — SSR, sitemap.xml, Schema.org, OG tags
- **Newsletter** — Email subscription collection
- **AdSense-ready** — Placeholder units with IDs

## AdSense Setup (After Approval)
1. Get Publisher ID from Google AdSense
2. In `admin/settings` → enter Publisher ID
3. In `frontend/src/app/layout.tsx` → uncomment the AdSense script tag
4. In `frontend/src/components/ads/AdUnit.tsx` → uncomment the `<ins>` tags

## Adding a New RSS Feed
Go to Admin → RSS Feeds → Add Feed button
