#!/bin/bash
# Complete Contact System Startup Guide
# Run this after applying the database migration

echo "🚀 INSI AI Today - Contact System Startup"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}📋 Pre-flight Checklist:${NC}"
echo ""

# Check if migration has been applied
echo "1. ✅ Database Migration"
echo "   → Run this SQL in Supabase Dashboard:"
echo "   → File: supabase/migrations/006_contact_messages.sql"
echo ""

# Check backend
echo "2. ✅ Backend Configuration"
echo "   → API URL: http://localhost:3002"
echo "   → Contact Route: /api/contact"
echo ""

# Check frontend
echo "3. ✅ Frontend Configuration"
echo "   → Contact Page: http://localhost:3000/contact"
echo "   → API URL: http://localhost:3002"
echo ""

# Check admin
echo "4. ✅ Admin Configuration"
echo "   → Admin Dashboard: http://localhost:3001/contact"
echo "   → Menu Item: Contact Messages (📧)"
echo ""

echo -e "${BLUE}🎯 To Start All Services:${NC}"
echo ""

# Backend
echo -e "${GREEN}Terminal 1 - Backend:${NC}"
echo "cd backend"
echo "npm run dev"
echo ""

# Frontend
echo -e "${GREEN}Terminal 2 - Frontend:${NC}"
echo "cd frontend"
echo "npm run dev"
echo ""

# Admin
echo -e "${GREEN}Terminal 3 - Admin:${NC}"
echo "cd admin"
echo "npm run dev"
echo ""

echo -e "${BLUE}📝 Testing Workflow:${NC}"
echo ""
echo "1. Open http://localhost:3000/contact"
echo "2. Fill out and submit the contact form"
echo "3. Open http://localhost:3001/contact (admin)"
echo "4. Verify message appears in admin dashboard"
echo "5. Test status updates and filtering"
echo ""

echo -e "${YELLOW}⚡ Quick Test Commands:${NC}"
echo ""
echo "# Test contact API directly"
echo "curl -X POST http://localhost:3002/api/contact \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"name\":\"Test User\",\"email\":\"test@example.com\",\"subject\":\"Test\",\"message\":\"Hello\"}'"
echo ""

echo -e "${GREEN}✨ All systems ready!${NC}"
echo ""
