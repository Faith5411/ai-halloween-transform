#!/bin/bash

echo "🔍 Checking Supabase Auth Configuration..."
echo ""

# We need to update auth settings via Supabase Dashboard
# But let's test if the database connection works

SUPABASE_URL="https://twsnioiuggbyzfxajlwk.supabase.co"
ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3c25pb2l1Z2dieXpmeGFqbHdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5OTc2NzQsImV4cCI6MjA3NTU3MzY3NH0.YucpUB6CwU6FZ0uRC0mr1oPtQUWQcFWB2unePNSCJCY"

echo "Testing Supabase connection..."
RESPONSE=$(curl -s "$SUPABASE_URL/rest/v1/gallery?limit=1" \
  -H "apikey: $ANON_KEY" \
  -H "Authorization: Bearer $ANON_KEY")

if [[ $RESPONSE == *"error"* ]]; then
  echo "❌ Error: $RESPONSE"
else
  echo "✅ Supabase database is accessible!"
  echo "Response: $RESPONSE"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔧 TO FIX AUTH - YOU MUST UPDATE IN SUPABASE DASHBOARD:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Open: https://supabase.com/dashboard/project/twsnioiuggbyzfxajlwk/auth/url-configuration"
echo ""
echo "2. Set Site URL to:"
echo "   https://ai-halloween-transfermation.com"
echo ""
echo "3. Add Redirect URLs:"
echo "   - https://ai-halloween-transfermation.com"
echo "   - https://ai-halloween-transfermation.com/**"
echo ""
echo "4. Enable Email Auth if not already:"
echo "   Go to: https://supabase.com/dashboard/project/twsnioiuggbyzfxajlwk/auth/providers"
echo "   Make sure Email provider is enabled"
echo ""
echo "5. Click SAVE"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

