#!/bin/bash

echo "🔍 Testing Supabase Email Provider Status..."
echo ""

SUPABASE_URL="https://twsnioiuggbyzfxajlwk.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3c25pb2l1Z2dieXpmeGFqbHdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5OTc2NzQsImV4cCI6MjA3NTU3MzY3NH0.YucpUB6CwU6FZ0uRC0mr1oPtQUWQcFWB2unePNSCJCY"

RANDOM_EMAIL="test${RANDOM}@example.com"
PASSWORD="Test123456!"

echo "Testing signup with email: $RANDOM_EMAIL"
echo ""

RESPONSE=$(curl -s "$SUPABASE_URL/auth/v1/signup" \
  -X POST \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$RANDOM_EMAIL\",\"password\":\"$PASSWORD\"}")

echo "Response:"
echo "$RESPONSE" | jq . 2>/dev/null || echo "$RESPONSE"
echo ""

if [[ $RESPONSE == *"provider is not enabled"* ]]; then
    echo "❌ EMAIL PROVIDER IS STILL DISABLED"
    echo ""
    echo "🔧 FIX IT NOW:"
    echo "1. Go to: https://supabase.com/dashboard/project/twsnioiuggbyzfxajlwk/auth/providers"
    echo "2. Find 'Email' in the list"
    echo "3. Toggle it ON (should turn green)"
    echo "4. Turn OFF 'Confirm email'"
    echo "5. Click 'Save'"
    echo "6. Wait 10 seconds and run this script again"
elif [[ $RESPONSE == *"access_token"* ]] || [[ $RESPONSE == *"user"* ]] || [[ $RESPONSE == *"confirmation_sent_at"* ]]; then
    echo "✅ EMAIL PROVIDER IS ENABLED AND WORKING!"
    echo ""
    echo "Your auth is configured correctly. Users can now sign up!"
elif [[ $RESPONSE == *"Email rate limit exceeded"* ]]; then
    echo "✅ EMAIL PROVIDER IS ENABLED!"
    echo ""
    echo "⚠️  Rate limit reached (this is normal after multiple test signups)"
    echo "Your auth is working correctly!"
elif [[ $RESPONSE == *"invalid_redirect_url"* ]]; then
    echo "⚠️  EMAIL PROVIDER IS ENABLED, BUT..."
    echo ""
    echo "You need to configure Auth URLs:"
    echo "1. Go to: https://supabase.com/dashboard/project/twsnioiuggbyzfxajlwk/auth/url-configuration"
    echo "2. Set Site URL: https://ai-halloween-transfermation.com"
    echo "3. Add Redirect URLs (see QUICK_FIX_AUTH.md)"
else
    echo "⚠️  Unexpected response. Check error message above."
fi

echo ""
