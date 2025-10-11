#!/bin/bash

# AI Halloween Transform - Gallery Setup Script
# This script helps you set up the gallery and contest system in Supabase

set -e  # Exit on error

echo "🎃 AI Halloween Transform - Gallery & Contest Setup"
echo "=================================================="
echo ""

# Check if supabase-gallery-setup.sql exists
if [ ! -f "supabase-gallery-setup.sql" ]; then
    echo "❌ Error: supabase-gallery-setup.sql not found!"
    echo "Make sure you're running this script from the project root directory."
    exit 1
fi

echo "✅ Found supabase-gallery-setup.sql"
echo ""

# Check for Supabase CLI
if command -v supabase &> /dev/null; then
    echo "✅ Supabase CLI is installed"
    echo ""

    # Check if we have a connection string or project ref
    if [ -z "$SUPABASE_DB_URL" ] && [ -z "$SUPABASE_PROJECT_REF" ]; then
        echo "⚠️  No Supabase connection configured"
        echo ""
        echo "Option 1: Set your database connection string:"
        echo "export SUPABASE_DB_URL='postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres'"
        echo ""
        echo "Option 2: Link to your project:"
        echo "supabase link --project-ref twsnioiuggbyzfxajlwk"
        echo ""
        echo "Then run this script again."
        exit 1
    fi

    echo "🚀 Executing SQL schema..."
    echo ""

    if [ -n "$SUPABASE_DB_URL" ]; then
        # Use psql if available
        if command -v psql &> /dev/null; then
            psql "$SUPABASE_DB_URL" -f supabase-gallery-setup.sql
        else
            supabase db execute --db-url "$SUPABASE_DB_URL" < supabase-gallery-setup.sql
        fi
    else
        supabase db execute < supabase-gallery-setup.sql
    fi

    echo ""
    echo "✅ SQL schema executed successfully!"
    echo ""

else
    echo "⚠️  Supabase CLI not found"
    echo ""
    echo "📝 Manual Setup Instructions:"
    echo ""
    echo "1. Open https://supabase.com/dashboard/project/twsnioiuggbyzfxajlwk"
    echo "2. Click 'SQL Editor' in the left sidebar"
    echo "3. Click 'New query'"
    echo "4. Copy the contents of 'supabase-gallery-setup.sql'"
    echo "5. Paste into the SQL Editor"
    echo "6. Click 'Run' or press Ctrl/Cmd + Enter"
    echo ""
    echo "You should see: 'Success. No rows returned'"
    echo ""
    echo "Alternatively, install Supabase CLI:"
    echo "npm install -g supabase"
    echo ""
    exit 0
fi

# Verify setup
echo "🔍 Verifying setup..."
echo ""

VERIFY_SQL="
SELECT
    (SELECT COUNT(*) FROM information_schema.tables
     WHERE table_schema = 'public'
     AND table_name IN ('gallery', 'gallery_votes', 'gallery_reports', 'weekly_contests')) as tables_count,
    (SELECT COUNT(*) FROM information_schema.routines
     WHERE routine_schema = 'public'
     AND routine_name IN ('increment_gallery_votes', 'decrement_gallery_votes', 'increment_gallery_views', 'get_current_contest_week', 'get_weekly_top_entries')) as functions_count,
    (SELECT COUNT(*) FROM storage.buckets WHERE id = 'gallery') as bucket_count;
"

echo "Checking database objects..."
echo ""

if [ -n "$SUPABASE_DB_URL" ]; then
    if command -v psql &> /dev/null; then
        RESULT=$(psql "$SUPABASE_DB_URL" -t -c "$VERIFY_SQL")
        echo "Results: $RESULT"
    fi
else
    echo "Run verification manually in Supabase SQL Editor:"
    echo "$VERIFY_SQL"
fi

echo ""
echo "✅ Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Start your app: npm run dev"
echo "2. Generate a transformation"
echo "3. Click the purple 'Share' button"
echo "4. Share to gallery"
echo "5. View on landing page"
echo "6. Try voting!"
echo ""
echo "📚 Documentation:"
echo "- GALLERY_SETUP.md - Detailed setup guide"
echo "- CONTEST_READY.md - Quick start guide"
echo "- LAUNCH_CHECKLIST.md - Pre-launch checklist"
echo ""
echo "🎃 Happy transforming! 👻"
