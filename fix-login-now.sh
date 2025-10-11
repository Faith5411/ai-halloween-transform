#!/bin/bash

echo "🔧 DIAGNOSING LOGIN ISSUE..."
echo ""

DOMAIN="https://ai-halloween-transfermation.com"
SUPABASE_URL="https://twsnioiuggbyzfxajlwk.supabase.co"
ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3c25pb2l1Z2dieXpmeGFqbHdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5OTc2NzQsImV4cCI6MjA3NTU3MzY3NH0.YucpUB6CwU6FZ0uRC0mr1oPtQUWQcFWB2unePNSCJCY"

echo "1. Testing Supabase connection..."
RESPONSE=$(curl -s "$SUPABASE_URL/rest/v1/" \
  -H "apikey: $ANON_KEY" \
  -H "Authorization: Bearer $ANON_KEY")

if [[ $RESPONSE == *"error"* ]]; then
  echo "❌ Connection failed"
else
  echo "✅ Supabase is reachable"
fi

echo ""
echo "2. Testing auth endpoint..."
AUTH_RESPONSE=$(curl -s "$SUPABASE_URL/auth/v1/signup" \
  -X POST \
  -H "apikey: $ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123456"}')

echo "Response: $AUTH_RESPONSE"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔑 SUPABASE AUTH MUST BE CONFIGURED MANUALLY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Open this URL in your browser and follow steps:"
echo ""
echo "https://supabase.com/dashboard/project/twsnioiuggbyzfxajlwk/auth/url-configuration"
echo ""
echo "STEP 1: Set Site URL"
echo "   Change to: $DOMAIN"
echo ""
echo "STEP 2: Add Redirect URLs (click 'Add URL' for each)"
echo "   1. $DOMAIN"
echo "   2. $DOMAIN/**"
echo ""
echo "STEP 3: Click 'Save' at bottom"
echo ""
echo "STEP 4: Check Email Provider is enabled"
echo "   https://supabase.com/dashboard/project/twsnioiuggbyzfxajlwk/auth/providers"
echo "   Make sure Email toggle is GREEN"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "After saving, wait 10 seconds then test:"
echo "1. Visit: $DOMAIN"
echo "2. Click 'Sign Up'"
echo "3. Enter any email/password"
echo "4. Should work! ✅"
echo ""

