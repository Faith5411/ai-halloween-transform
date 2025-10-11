#!/bin/bash

echo "🎃 Setting up Gallery System..."
echo ""

# Check if SUPABASE_DB_URL is set
if [ -z "$SUPABASE_DB_URL" ]; then
    echo "❌ Error: SUPABASE_DB_URL not set"
    echo ""
    echo "Please set your database URL:"
    echo "export SUPABASE_DB_URL='postgresql://postgres:[password]@db.twsnioiuggbyzfxajlwk.supabase.co:5432/postgres'"
    echo ""
    echo "Or get it from: https://supabase.com/dashboard/project/twsnioiuggbyzfxajlwk/settings/database"
    exit 1
fi

echo "✅ Found database URL"
echo "🚀 Running SQL schema..."
echo ""

psql "$SUPABASE_DB_URL" -f supabase-gallery-setup.sql

echo ""
echo "✅ Done! Refresh your app at http://localhost:5173"
