@echo off
REM Complete Contact System Startup Guide for Windows
REM Run this after applying the database migration

color 0A
echo.
echo ====================================================
echo    INSI AI Today - Contact System Startup
echo ====================================================
echo.

color 0E
echo [PRE-FLIGHT CHECKLIST]
echo.

echo 1. DATABASE MIGRATION
echo    - Go to: https://supabase.com/dashboard
echo    - Open SQL Editor
echo    - Run: supabase/migrations/006_contact_messages.sql
echo.

echo 2. BACKEND CONFIGURATION
echo    - API URL: http://localhost:3002
echo    - Contact Route: /api/contact
echo    - Status: Ready
echo.

echo 3. FRONTEND CONFIGURATION
echo    - Contact Page: http://localhost:3000/contact
echo    - API URL: http://localhost:3002
echo    - Status: Ready
echo.

echo 4. ADMIN CONFIGURATION
echo    - Admin Dashboard: http://localhost:3001/contact
echo    - Menu Item: Contact Messages (icon)
echo    - Status: Ready
echo.

color 0B
echo [START ALL SERVICES]
echo.
echo Open 3 separate terminal windows and run:
echo.

color 0F
echo Terminal 1 - Backend:
echo    cd backend
echo    npm run dev
echo.

echo Terminal 2 - Frontend:
echo    cd frontend
echo    npm run dev
echo.

echo Terminal 3 - Admin:
echo    cd admin
echo    npm run dev
echo.

color 0E
echo [TESTING WORKFLOW]
echo.
echo 1. Open http://localhost:3000/contact
echo 2. Fill out and submit the contact form
echo 3. Open http://localhost:3001/contact (admin login required)
echo 4. Verify message appears in admin dashboard
echo 5. Test status updates and filtering
echo.

color 0A
echo [ALL SYSTEMS READY!]
echo.

color 0F
pause
