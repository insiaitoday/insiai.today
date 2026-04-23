# Testing Checklist

## Pre-Deployment Testing

### Frontend Tests

#### Homepage (/)
- [ ] Page loads without errors
- [ ] Clean white theme is applied
- [ ] No emojis visible anywhere
- [ ] "Latest" and "Top" tabs work correctly
- [ ] Default sort is "Latest"
- [ ] Category filters work
- [ ] Post cards display correctly
- [ ] Sidebar shows trending posts
- [ ] Newsletter form works
- [ ] Pagination works

#### Articles Page (/articles)
- [ ] Page loads and shows article listing
- [ ] Only articles (type='article') are shown
- [ ] Pagination works
- [ ] Empty state shows if no articles
- [ ] Links to article detail pages work

#### Article Detail (/articles/[slug])
- [ ] Page loads correctly
- [ ] Content renders properly
- [ ] Table of contents works (if present)
- [ ] Comments section loads
- [ ] Vote buttons work
- [ ] Share buttons work
- [ ] Related posts show

#### News Detail (/news/[slug])
- [ ] Page loads correctly
- [ ] External link button works
- [ ] Redirects to correct source URL
- [ ] Opens in new tab
- [ ] Comments section loads
- [ ] Vote buttons work

#### Navigation
- [ ] Header is clean white with no emojis
- [ ] "Latest" link works
- [ ] "Top" link works
- [ ] "Articles" link works
- [ ] "About" link works
- [ ] Search works
- [ ] Mobile menu works

#### Other Pages
- [ ] /about - Loads, no emojis, clean design
- [ ] /contact - Form works, no emojis
- [ ] /privacy - Loads correctly
- [ ] /terms - Loads correctly
- [ ] /search - Search functionality works

### Admin Panel Tests

#### Login (/login)
- [ ] Page loads with clean design
- [ ] No emojis in UI
- [ ] Password toggle works (Show/Hide text)
- [ ] Login works with correct credentials
- [ ] Error handling works

#### Dashboard
- [ ] All admin features work
- [ ] Post management works
- [ ] Article creation works
- [ ] RSS feed management works
- [ ] Comment moderation works

### Backend Tests

#### API Endpoints
- [ ] GET /api/posts - Returns posts
- [ ] GET /api/posts/:slug - Returns single post
- [ ] GET /api/posts/related/:id - Returns related posts
- [ ] POST /api/posts/:id/vote - Voting works
- [ ] GET /api/posts/:id/comments - Returns comments
- [ ] POST /api/posts/:id/comments - Creates comment
- [ ] POST /api/newsletter/subscribe - Subscription works

#### RSS Cron
- [ ] Cron job runs every 2 hours
- [ ] Fetches posts from RSS feeds
- [ ] Creates posts in database
- [ ] Handles errors gracefully

### Visual Checks

#### Design Consistency
- [ ] All pages use white background
- [ ] Primary color is LinkedIn blue (#0A66C2)
- [ ] No dark theme remnants
- [ ] Typography is consistent
- [ ] Spacing is professional
- [ ] Borders are subtle
- [ ] Shadows are minimal
- [ ] No emojis anywhere

#### Responsive Design
- [ ] Mobile view works (< 640px)
- [ ] Tablet view works (640px - 1024px)
- [ ] Desktop view works (> 1024px)
- [ ] Navigation adapts correctly
- [ ] Cards stack properly on mobile

### Performance Checks
- [ ] Pages load quickly
- [ ] Images load properly
- [ ] No console errors
- [ ] No 404 errors
- [ ] API responses are fast

### SEO Checks
- [ ] Meta tags are present
- [ ] OG tags work
- [ ] Sitemap.xml generates
- [ ] Robots.txt is correct
- [ ] Schema.org markup present

## Production Deployment Tests

After deploying to production:

### Smoke Tests
- [ ] Homepage loads
- [ ] Can view a news post
- [ ] Can view an article
- [ ] Can submit a comment
- [ ] Can vote on a post
- [ ] Can subscribe to newsletter
- [ ] Admin login works
- [ ] RSS cron is running

### Integration Tests
- [ ] External links work
- [ ] All internal links work
- [ ] Forms submit correctly
- [ ] Database queries work
- [ ] File uploads work (admin)

### Security Tests
- [ ] HTTPS is enabled
- [ ] Admin requires authentication
- [ ] Rate limiting works
- [ ] No sensitive data exposed
- [ ] CORS is configured correctly

## Issues to Watch For

### Common Problems
- Environment variables not set
- Database connection issues
- CORS errors
- Missing dependencies
- Port conflicts
- File permission issues

### Quick Fixes
1. Check all .env files are configured
2. Verify database migrations ran
3. Check backend is running
4. Clear browser cache
5. Check console for errors
6. Verify API URL is correct

## Success Criteria

The application is ready for production when:
- ✓ All frontend tests pass
- ✓ All admin tests pass
- ✓ All backend tests pass
- ✓ No emojis visible
- ✓ Professional white theme throughout
- ✓ All links work correctly
- ✓ Build completes without errors
- ✓ No console errors
- ✓ Performance is acceptable
