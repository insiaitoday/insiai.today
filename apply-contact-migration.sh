#!/bin/bash
# Apply Contact Messages Migration

echo "🚀 Applying contact_messages migration..."

# Check if Supabase CLI is available
if command -v supabase &> /dev/null; then
    echo "📦 Using Supabase CLI..."
    cd supabase
    supabase db push
else
    echo "⚠️  Supabase CLI not found."
    echo ""
    echo "Please apply the migration manually:"
    echo "1. Go to your Supabase dashboard: https://supabase.com/dashboard"
    echo "2. Navigate to SQL Editor"
    echo "3. Copy and paste the content from: supabase/migrations/006_contact_messages.sql"
    echo "4. Click 'Run'"
    echo ""
    echo "Or install Supabase CLI:"
    echo "npm install -g supabase"
fi

echo ""
echo "✅ Migration ready to apply!"
echo ""
echo "After migration, restart your backend server:"
echo "cd backend && npm run dev"
