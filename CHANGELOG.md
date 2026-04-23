# Changelog

## [2.0.0] - 2026-04-10

### Major UI Redesign
- Transformed from dark theme to clean, professional white design
- Removed all emojis and unnecessary symbols for professional aesthetic
- Updated color palette to match TechCrunch/LinkedIn/ChatGPT style
- Improved typography and spacing for better readability

### Navigation Improvements
- Consolidated categories into single "News" section
- Simplified sorting to "Latest" and "Top" options
- Removed "Hot" sorting option
- Cleaned up header navigation

### Bug Fixes
- Fixed article page loading issues
- Created missing `/articles` listing page
- Fixed external links to redirect to exact article pages
- Improved source URL handling

### Content Management
- Removed static/hardcoded data
- Made application fully dynamic
- All content now comes from database/API
- Production-ready state

### Admin Panel
- Cleaned up login page
- Removed emoji usage
- Professional styling maintained

### Performance
- Optimized component rendering
- Improved build process
- Better error handling

## [1.0.0] - Initial Release
- RSS automation with 30+ sources
- Admin panel for content management
- User engagement (votes, comments)
- SEO optimization
- Newsletter subscription
- AdSense integration ready

## [2.0.1] - 2026-04-10

### UX Improvements
- **Simplified Like System**: Changed from complex upvote/downvote to Instagram-style heart like
  - Removed downvote button
  - Single heart icon for liking
  - Red color when liked
  - Smooth animations (scale + ping effect)
  - More intuitive for users
  - Mobile-friendly larger touch target

### Technical Changes
- Updated `VoteButtons.tsx` component
- Added ping animation to CSS
- Simplified vote logic (like/unlike only)
- Improved user feedback with animations

