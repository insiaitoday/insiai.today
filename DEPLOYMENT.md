# Deployment Guide

## Production Checklist

### 1. Environment Variables
Ensure all production environment variables are set:

**Backend**
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key
- `FRONTEND_URL` - Production frontend URL
- `ADMIN_URL` - Production admin URL
- `PORT` - Backend port (default: 3002)

**Frontend**
- `NEXT_PUBLIC_API_URL` - Backend API URL
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
- `NEXT_PUBLIC_SITE_URL` - Production site URL
- `NEXT_PUBLIC_SITE_NAME` - Site name

**Admin**
- `NEXT_PUBLIC_API_URL` - Backend API URL
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
- `NEXT_PUBLIC_FRONTEND_URL` - Frontend URL

### 2. Database Setup
1. Run all migrations in `supabase/migrations/` in order
2. Run `supabase/seed.sql` to populate RSS feeds
3. Create Storage bucket `post-thumbnails` (public access)
4. Create admin user in Supabase Auth

### 3. Build & Deploy

**Backend**
```bash
cd backend
npm install
npm run build
npm start
```

**Frontend**
```bash
cd frontend
npm install
npm run build
npm start
```

**Admin**
```bash
cd admin
npm install
npm run build
npm start
```

### 4. Post-Deployment
- Test RSS cron job execution
- Verify admin login
- Check all API endpoints
- Test article creation and publishing
- Verify external links redirect correctly
- Test comment submission and moderation
- Check newsletter subscription

### 5. Monitoring
- Monitor backend logs for RSS fetch errors
- Check Supabase dashboard for database performance
- Monitor API response times
- Track error rates

## Recommended Hosting

- **Frontend/Admin**: Vercel, Netlify, or any Node.js host
- **Backend**: Railway, Render, DigitalOcean, AWS EC2
- **Database**: Supabase (managed PostgreSQL)
- **Storage**: Supabase Storage or AWS S3

## Performance Tips

1. Enable caching for static assets
2. Use CDN for images
3. Enable gzip compression
4. Set up database indexes (already in migrations)
5. Monitor and optimize slow queries
6. Use Redis for caching if needed

## Security

1. Never commit `.env` files
2. Use strong admin passwords
3. Enable RLS policies in Supabase
4. Set up rate limiting (already configured)
5. Use HTTPS in production
6. Regularly update dependencies
