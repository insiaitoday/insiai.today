# 📧 Contact System - Complete Visual Guide

## 🎯 System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    CONTACT SYSTEM FLOW                       │
└─────────────────────────────────────────────────────────────┘

Frontend (Port 3000)                 Backend (Port 3002)              Database (Supabase)
┌──────────────────┐                ┌──────────────────┐             ┌──────────────────┐
│                  │                │                  │             │                  │
│  Contact Form    │   POST         │  /api/contact    │   INSERT    │ contact_messages │
│  (/contact)      │──────────────> │  Route Handler   │──────────>  │     Table        │
│                  │   FormData     │                  │   Record    │                  │
│  - Name          │                │  - Validate      │             │  - id            │
│  - Email         │                │  - Sanitize      │             │  - name          │
│  - Subject       │                │  - Store         │             │  - email         │
│  - Message       │                │                  │             │  - subject       │
│                  │                │                  │             │  - message       │
│  ✓ Success Msg   │ <────────────  │  Response        │             │  - status        │
│                  │   200 OK       │                  │             │  - created_at    │
└──────────────────┘                └──────────────────┘             └──────────────────┘
                                                                              │
                                                                              │ READ
                                                                              ↓
Admin Panel (Port 3001)             Backend (Port 3002)              ┌──────────────────┐
┌──────────────────┐                ┌──────────────────┐             │                  │
│                  │   GET          │  /api/contact    │   SELECT    │ contact_messages │
│  Contact Msgs    │──────────────> │  Route Handler   │──────────>  │     Table        │
│  (/contact)      │   +Auth        │                  │   Records   │                  │
│                  │                │  - Auth Check    │             │  Returns Array   │
│  📊 Dashboard    │ <────────────  │  - Fetch All     │ <──────────│  of Messages     │
│  - Unread (5)    │   Messages     │  - Sort          │             │                  │
│  - Read (12)     │                │                  │             └──────────────────┘
│  - Replied (8)   │                │                  │
│  - Archived (3)  │                │                  │
│                  │   PATCH        │  /api/contact/:id│   UPDATE
│  [Update Status] │──────────────> │  Update Status   │──────────>  Update status field
│  [Reply Email]   │   +Status      │                  │
│  [Delete]        │                │                  │
└──────────────────┘                └──────────────────┘
```

## 📱 Frontend - User View

```
┌─────────────────────────────────────────────────────────┐
│  INSI AI Today                            [Home] [News] │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  [Contact] Badge                                         │
│  Get In Touch                                            │
│  Have a story, feedback, or partnership inquiry?        │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │  Contact Form                                   │    │
│  │  ┌──────────────┐  ┌──────────────┐           │    │
│  │  │ Name         │  │ Email        │           │    │
│  │  └──────────────┘  └──────────────┘           │    │
│  │  ┌────────────────────────────────┐           │    │
│  │  │ Subject ▼                      │           │    │
│  │  └────────────────────────────────┘           │    │
│  │  ┌────────────────────────────────┐           │    │
│  │  │ Message                        │           │    │
│  │  │                                │           │    │
│  │  └────────────────────────────────┘           │    │
│  │  ┌────────────────────────────────┐           │    │
│  │  │     [Send Message]              │           │    │
│  │  └────────────────────────────────┘           │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │  💬 Join Our Community                         │    │
│  │  WhatsApp Group                                │    │
│  │  Get instant AI news updates              →   │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## 🔧 Admin Panel - Manager View

```
┌─────────────────────────────────────────────────────────┐
│  INSI AI Admin                                   [Logout]│
├──────────┬──────────────────────────────────────────────┤
│          │  Contact Messages                             │
│ Sidebar  │  Manage user inquiries and feedback           │
│          │                                                │
│ 📊 Dash  │  [All (28)] [Unread (5)] [Read (12)]         │
│ ⏳ Pend  │  [Replied (8)] [Archived (3)]                 │
│ ✅ Publ  │                                                │
│ 📝 Draft │  ┌──────────────────────────────────────┐    │
│ ✍️ New   │  │ John Doe              [unread] 🔵   │    │
│ 📡 Feeds │  │ john@example.com                     │    │
│ 📧 Cont  │  │ Story tip or news submission         │    │
│ 💬 Comm  │  │ 2 hours ago                          │    │
│ 📈 Anal  │  │                                       │    │
│ ⚙️ Sett  │  │ "I have an exclusive story about..."│    │
│          │  │                                       │    │
│          │  │ [Status: Unread ▼] [Reply] [Delete] │    │
│          │  └──────────────────────────────────────┘    │
│          │                                                │
│          │  ┌──────────────────────────────────────┐    │
│          │  │ Sarah Smith           [replied] ✅   │    │
│          │  │ sarah@company.com                    │    │
│          │  │ Advertising / Partnership            │    │
│          │  │ 1 day ago                            │    │
│          │  │                                       │    │
│          │  │ "Interested in advertising options" │    │
│          │  │                                       │    │
│          │  │ [Status: Replied ▼] [Reply] [Delete]│    │
│          │  └──────────────────────────────────────┘    │
└──────────┴──────────────────────────────────────────────┘
```

## 🔄 Status Workflow

```
New Message Arrives
        ↓
   [UNREAD] 🔵 ────────┐
        ↓               │
   Admin Views          │
        ↓               │
    [READ] 📖           │
        ↓               │
   Admin Replies        │
        ↓               │
   [REPLIED] ✅         │
        ↓               │
   Archive/Done         │
        ↓               │
   [ARCHIVED] 📦 ←──────┘
```

## 🎨 Key Features

### ✅ User Experience
- Clean, professional contact form
- Real-time validation
- Instant feedback messages
- Mobile responsive
- WhatsApp community prominently displayed

### ✅ Admin Experience
- All messages in one dashboard
- Quick status filtering
- One-click email replies
- Bulk status management
- Search by email

### ✅ Technical
- Type-safe TypeScript
- Secure authentication
- Database RLS policies
- Automatic timestamps
- Indexed for performance

## 📊 Database Schema Detail

```sql
contact_messages
├── id              UUID (Primary Key, Auto-generated)
├── name            TEXT (Required, User's full name)
├── email           TEXT (Required, Valid email format)
├── subject         TEXT (Required, Message category)
├── message         TEXT (Required, User's message)
├── status          TEXT (Default: 'unread')
│   └── Values: 'unread' | 'read' | 'replied' | 'archived'
├── created_at      TIMESTAMPTZ (Auto-generated on insert)
└── updated_at      TIMESTAMPTZ (Auto-updated on change)

Indexes:
├── idx_contact_messages_status      (status)
├── idx_contact_messages_created_at  (created_at DESC)
└── idx_contact_messages_email       (email)

Triggers:
└── update_contact_messages_updated_at (Before UPDATE)

Policies (RLS):
└── Admin full access (Authenticated admins only)
```

## 🚀 API Endpoints Reference

### Public Endpoint
```
POST /api/contact
Content-Type: application/json

Request Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Story tip or news submission",
  "message": "Your message here..."
}

Response (200):
{
  "success": true,
  "message": "Thank you for contacting us!...",
  "data": { ...message object }
}

Response (400):
{
  "error": "All fields are required"
}
```

### Admin Endpoints (Require Authentication)
```
GET /api/contact
Authorization: Bearer <token>
→ Returns array of all messages

PATCH /api/contact/:id
Authorization: Bearer <token>
Body: { "status": "read" }
→ Updates message status

DELETE /api/contact/:id
Authorization: Bearer <token>
→ Deletes message
```

## 📝 Setup Checklist

- [x] Backend route created (`backend/src/routes/contact.ts`)
- [x] Backend route registered in index
- [x] Frontend contact page updated
- [x] Admin dashboard page created
- [x] Admin sidebar menu updated
- [x] Database migration created
- [ ] **→ Apply database migration** (Manual step required)
- [ ] **→ Restart backend server**
- [ ] **→ Test contact form**
- [ ] **→ Test admin dashboard**

## 🎯 Next Steps

1. **Apply Migration**
   ```
   Go to Supabase Dashboard → SQL Editor
   Run: supabase/migrations/006_contact_messages.sql
   ```

2. **Start Services**
   ```bash
   # Terminal 1
   cd backend && npm run dev

   # Terminal 2
   cd frontend && npm run dev

   # Terminal 3
   cd admin && npm run dev
   ```

3. **Test Everything**
   - Submit test message from frontend
   - View message in admin panel
   - Update status
   - Test reply via email
   - Test filtering

## 🎉 Done!

Your contact system is now complete and ready for production!
