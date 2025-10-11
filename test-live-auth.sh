#!/bin/bash
echo "🔍 Testing LIVE site auth flow..."
echo ""

# Test 1: Check if Supabase is reachable from the site
echo "1️⃣ Testing Supabase connection..."
curl -s -w "\nStatus: %{http_code}\n" https://twsnioiuggbyzfxajlwk.supabase.co/auth/v1/health

# Test 2: Try actual signup
echo ""
echo "2️⃣ Testing sign-up with timestamp email..."
TIMESTAMP=$(date +%s)
EMAIL="livetest${TIMESTAMP}@gmail.com"
echo "Email: $EMAIL"
curl -s -X POST 'https://twsnioiuggbyzfxajlwk.supabase.co/auth/v1/signup' \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3c25pb2l1Z2dieXpmeGFqbHdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5OTc2NzQsImV4cCI6MjA3NTU3MzY3NH0.YucpUB6CwU6FZ0uRC0mr1oPtQUWQcFWB2unePNSCJCY" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"${EMAIL}\",\"password\":\"Test123456!\"}" | python3 -c "import sys, json; d=json.load(sys.stdin); print('\n✅ Got access_token!' if d.get('access_token') else '\n❌ No access_token'); print('email_verified:', d.get('user', {}).get('user_metadata', {}).get('email_verified'))"

echo ""
echo "3️⃣ Check auth settings..."
curl -s 'https://twsnioiuggbyzfxajlwk.supabase.co/auth/v1/settings' \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3c25pb2l1Z2dieXpmeGFqbHdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5OTc2NzQsImV4cCI6MjA3NTU3MzY3NH0.YucpUB6CwU6FZ0uRC0mr1oPtQUWQcFWB2unePNSCJCY" | python3 -c "import sys, json; d=json.load(sys.stdin); print('mailer_autoconfirm:', d.get('mailer_autoconfirm')); print('email enabled:', d.get('external', {}).get('email'))"

