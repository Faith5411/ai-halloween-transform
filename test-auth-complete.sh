#!/bin/bash

echo "════════════════════════════════════════════════════════════════════"
echo "🎃 AI Halloween App - Complete Auth Test 🎃"
echo "════════════════════════════════════════════════════════════════════"
echo ""

# Configuration
DOMAIN="https://ai-halloween-transfermation.com"
SUPABASE_URL="https://twsnioiuggbyzfxajlwk.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3c25pb2l1Z2dieXpmeGFqbHdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5OTc2NzQsImV4cCI6MjA3NTU3MzY3NH0.YucpUB6CwU6FZ0uRC0mr1oPtQUWQcFWB2unePNSCJCY"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test results
PASS=0
FAIL=0

test_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ PASS${NC}"
        ((PASS++))
    else
        echo -e "${RED}❌ FAIL${NC}"
        ((FAIL++))
    fi
}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌐 PART 1: DEPLOYMENT TESTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 1: Domain accessibility
echo -n "1️⃣  Domain is accessible... "
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$DOMAIN")
if [ "$HTTP_CODE" = "200" ]; then
    test_status 0
else
    echo -e "${RED}❌ FAIL (HTTP $HTTP_CODE)${NC}"
    ((FAIL++))
fi

# Test 2: HTML loads
echo -n "2️⃣  HTML page loads... "
HTML_CONTENT=$(curl -s "$DOMAIN")
if [[ $HTML_CONTENT == *"<title>AI Halloween Transform</title>"* ]]; then
    test_status 0
else
    test_status 1
fi

# Test 3: React app root exists
echo -n "3️⃣  React root element exists... "
if [[ $HTML_CONTENT == *'<div id="root">'* ]]; then
    test_status 0
else
    test_status 1
fi

# Test 4: JavaScript bundle loads
echo -n "4️⃣  JavaScript bundle included... "
if [[ $HTML_CONTENT == *"/assets/index-"*".js"* ]]; then
    test_status 0
else
    test_status 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔌 PART 2: BACKEND CONNECTIVITY TESTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 5: Supabase REST API
echo -n "5️⃣  Supabase REST API reachable... "
SUPABASE_RESPONSE=$(curl -s "$SUPABASE_URL/rest/v1/" \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY")

if [[ ! $SUPABASE_RESPONSE == *"error"* ]] && [[ -n $SUPABASE_RESPONSE ]]; then
    test_status 0
else
    test_status 1
fi

# Test 6: Supabase Auth endpoint
echo -n "6️⃣  Supabase Auth endpoint accessible... "
AUTH_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$SUPABASE_URL/auth/v1/health")
if [ "$AUTH_RESPONSE" = "200" ]; then
    test_status 0
else
    echo -e "${RED}❌ FAIL (HTTP $AUTH_RESPONSE)${NC}"
    ((FAIL++))
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔐 PART 3: AUTH CONFIGURATION TESTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 7: Test signup with random email
RANDOM_NUM=$RANDOM
TEST_EMAIL="test${RANDOM_NUM}@example.com"
TEST_PASSWORD="Test123456!"

echo -n "7️⃣  Auth signup endpoint responds... "
SIGNUP_RESPONSE=$(curl -s "$SUPABASE_URL/auth/v1/signup" \
  -X POST \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\"}")

if [[ $SIGNUP_RESPONSE == *"access_token"* ]] || [[ $SIGNUP_RESPONSE == *"user"* ]] || [[ $SIGNUP_RESPONSE == *"confirmation_sent_at"* ]]; then
    test_status 0
    echo -e "   ${BLUE}ℹ️  Response: ${SIGNUP_RESPONSE:0:100}...${NC}"
elif [[ $SIGNUP_RESPONSE == *"Email rate limit exceeded"* ]]; then
    echo -e "${YELLOW}⚠️  SKIP (Rate limited - this is normal)${NC}"
elif [[ $SIGNUP_RESPONSE == *"invalid_redirect_url"* ]]; then
    echo -e "${RED}❌ FAIL - Invalid redirect URL configured${NC}"
    ((FAIL++))
    echo -e "   ${YELLOW}⚠️  ACTION REQUIRED: Configure Auth URLs in Supabase${NC}"
else
    test_status 1
    echo -e "   ${BLUE}ℹ️  Response: $SIGNUP_RESPONSE${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 TEST RESULTS SUMMARY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "Tests Passed: ${GREEN}$PASS${NC}"
echo -e "Tests Failed: ${RED}$FAIL${NC}"
TOTAL=$((PASS + FAIL))
if [ $TOTAL -gt 0 ]; then
    PERCENTAGE=$((PASS * 100 / TOTAL))
    echo -e "Success Rate: ${BLUE}${PERCENTAGE}%${NC}"
fi
echo ""

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}✅ ALL TESTS PASSED!${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "🎉 Your app is fully deployed and functional!"
    echo ""
    echo "⚠️  NEXT STEP: Configure Supabase Auth (if not done already)"
    echo ""
    echo "Complete these manual steps to enable login:"
    echo "1. Auth URLs: https://supabase.com/dashboard/project/twsnioiuggbyzfxajlwk/auth/url-configuration"
    echo "2. Email Provider: https://supabase.com/dashboard/project/twsnioiuggbyzfxajlwk/auth/providers"
    echo "3. Database SQL: https://supabase.com/dashboard/project/twsnioiuggbyzfxajlwk/sql"
    echo ""
    echo "📖 Full instructions: QUICK_FIX_AUTH.md"
else
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${RED}⚠️  SOME TESTS FAILED${NC}"
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "Common issues and solutions:"
    echo ""
    echo "• Domain not accessible:"
    echo "  → Check DNS settings"
    echo "  → Wait for DNS propagation (up to 48h)"
    echo ""
    echo "• Supabase not reachable:"
    echo "  → Verify Supabase project is active"
    echo "  → Check API keys are correct"
    echo ""
    echo "• Auth endpoint issues:"
    echo "  → Configure Auth URLs: https://supabase.com/dashboard/project/twsnioiuggbyzfxajlwk/auth/url-configuration"
    echo "  → Set Site URL to: $DOMAIN"
    echo "  → Add redirect URLs (see QUICK_FIX_AUTH.md)"
    echo ""
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔗 QUICK LINKS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🌐 Your App: $DOMAIN"
echo "🔧 Supabase Dashboard: https://supabase.com/dashboard/project/twsnioiuggbyzfxajlwk"
echo "🚀 Vercel Dashboard: https://vercel.com/jeremys-projects-c33a2120/ai-halloween"
echo ""
echo "📖 Documentation:"
echo "   • QUICK_FIX_AUTH.md - Enable login in 3 minutes"
echo "   • DEPLOYMENT_SUCCESS.md - Complete deployment guide"
echo ""
echo "════════════════════════════════════════════════════════════════════"
