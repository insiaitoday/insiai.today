# Contact Form System

## Overview
Complete contact form system with backend API, admin dashboard, and email notifications.

## Features
- ✅ Contact form on frontend with real-time validation
- ✅ Backend API to store messages in Supabase
- ✅ Admin dashboard to view and manage messages
- ✅ Status tracking (unread, read, replied, archived)
- ✅ Email integration for replies
- ✅ WhatsApp community link displayed

## Setup Instructions

### 1. Run Database Migration
```bash
# Apply the migration to your Supabase database
cd supabase
supabase db push

# Or manually run the SQL in Supabase SQL Editor:
# Copy content from: supabase/migrations/006_contact_messages.sql
```

### 2. Backend is Already Configured
The contact route is automatically included in `backend/src/index.ts`:
- POST `/api/contact` - Submit contact form
- GET `/api/contact` - Get all messages (admin only)
- PATCH `/api/contact/:id` - Update message status
- DELETE `/api/contact/:id` - Delete message

### 3. Access Admin Panel
Navigate to: `http://localhost:3001/contact`

## Usage

### Frontend Contact Form
- Users fill out: name, email, subject, message
- Form validates all fields
- Success/error messages displayed
- Form resets after successful submission

### Admin Dashboard
- View all contact messages
- Filter by status (unread, read, replied, archived)
- Update message status with dropdown
- Reply directly via email link
- Delete messages

## Database Schema

```sql
contact_messages
├── id (UUID, primary key)
├── name (TEXT)
├── email (TEXT)
├── subject (TEXT)
├── message (TEXT)
├── status (TEXT: unread|read|replied|archived)
├── created_at (TIMESTAMPTZ)
└── updated_at (TIMESTAMPTZ)
```

## API Endpoints

### Submit Contact Form
```bash
POST /api/contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Story tip or news submission",
  "message": "Your message here..."
}
```

### Get All Messages (Admin)
```bash
GET /api/contact
Authorization: Bearer <admin-token>
```

### Update Message Status (Admin)
```bash
PATCH /api/contact/:id
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "status": "read"
}
```

### Delete Message (Admin)
```bash
DELETE /api/contact/:id
Authorization: Bearer <admin-token>
```

## Files Modified/Created

### Backend
- `backend/src/routes/contact.ts` (new)
- `backend/src/index.ts` (updated)

### Frontend
- `frontend/src/app/contact/page.tsx` (updated)

### Admin
- `admin/src/app/contact/page.tsx` (new)
- `admin/src/components/shell/AdminSidebar.tsx` (updated)

### Database
- `supabase/migrations/006_contact_messages.sql` (new)

## Next Steps

1. **Run the migration** to create the database table
2. **Restart the backend** to load the new route
3. **Test the contact form** on the frontend
4. **Check admin panel** to view submitted messages

## Email Integration

Messages include a "Reply via Email" button that opens the default email client with:
- Pre-filled recipient email
- Subject line with "Re: [original subject]"
- Ready to send response

## Security

- All contact messages require authentication to view
- RLS policies ensure admin-only access
- Email validation on both frontend and backend
- SQL injection protection via Supabase client
- Rate limiting recommended for production
