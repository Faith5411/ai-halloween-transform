#!/bin/bash

echo "════════════════════════════════════════════════════════════════════"
echo "🎃 AI Halloween App - Deployment Verification 🎃"
echo "════════════════════════════════════════════════════════════════════"
echo ""

# Configuration
DOMAIN="https://ai-halloween-transfermation.com"
VERCEL_URL="https://ai-halloween-cz7kcle0o-jeremys-projects-c33a2120.vercel.app"
SUPABASE_URL="https://twsnioiuggbyzfxajlwk.supabase.co"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "📍 Testing deployment status..."
echo ""

# 1. Check if Vercel deployment is accessible
echo "1️⃣  Checking Vercel deployment..."
if curl -s -o /dev/null -w "%{http_code}" "$VERCEL_URL" | grep -q "200"; then
    echo -e "${GREEN}✅ Vercel deployment is LIVE${NC}"
    echo "   URL: $VERCEL_URL"
else
    echo -e "${RED}❌ Vercel deployment not accessible${NC}"
fi
echo ""

# 2. Check if custom domain is accessible
echo "2️⃣  Checking custom domain..."
if curl -s -o /dev/null -w "%{http_code}" "$DOMAIN" | grep -q "200"; then
    echo -e "${GREEN}✅ Custom domain is LIVE${NC}"
    echo "   URL: $DOMAIN"
else
    echo -e "${RED}❌ Custom domain not accessible${NC}"
    echo "   Note: DNS may take up to 48 hours to propagate"
fi
echo ""

# 3. Check Supabase connectivity
echo "3️⃣  Checking Supabase connection..."
SUPABASE_CHECK=$(curl -s "$SUPABASE_URL/rest/v1/" -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3c25pb2l1Z2dieXpmeGFqbHdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5OTc2NzQsImV4cCI6MjA3NTU3MzY3NH0.YucpUB6CwU6FZ0uRC0mr1oPtQUWQcFWB2unePNSCJCY")

if [[ ! $SUPABASE_CHECK == *"error"* ]] && [[ -n $SUPABASE_CHECK ]]; then
    echo -e "${GREEN}✅ Supabase is reachable${NC}"
else
    echo -e "${RED}❌ Supabase connection issue${NC}"
fi
echo ""

# 4. Check if build artifacts exist
echo "4️⃣  Checking build artifacts..."
if [ -d "dist" ] && [ -f "dist/index.html" ]; then
    echo -e "${GREEN}✅ Build artifacts present${NC}"
    echo "   Build directory: dist/"
    echo "   Entry point: dist/index.html"
else
    echo -e "${RED}❌ Build artifacts missing${NC}"
    echo "   Run: npm run build"
fi
echo ""

# 5. Summary
echo "════════════════════════════════════════════════════════════════════"
echo "📊 DEPLOYMENT STATUS SUMMARY"
echo "════════════════════════════════════════════════════════════════════"
echo ""
echo "🌐 URLs:"
echo "   • Production: $VERCEL_URL"
echo "   • Domain: $DOMAIN"
echo "   • Backend: $SUPABASE_URL"
echo ""
echo -e "${YELLOW}⚠️  CRITICAL: CONFIGURE SUPABASE AUTH TO ENABLE LOGIN${NC}"
echo ""
echo "Complete these steps NOW:"
echo ""
echo "Step 1: Configure Auth URLs (2 minutes)"
echo "   → https://supabase.com/dashboard/project/twsnioiuggbyzfxajlwk/auth/url-configuration"
echo "   Set Site URL: $DOMAIN"
echo "   Add Redirect URLs:"
echo "      - $DOMAIN"
echo "      - $DOMAIN/auth/callback"
echo "      - $DOMAIN/**"
echo ""
echo "Step 2: Configure Email Provider (1 minute)"
echo "   → https://supabase.com/dashboard/project/twsnioiuggbyzfxajlwk/auth/providers"
echo "   ✓ Enable Email provider"
echo "   ✓ DISABLE 'Confirm email' (critical!)"
echo ""
echo "Step 3: Setup Database"
echo "   → https://supabase.com/dashboard/project/twsnioiuggbyzfxajlwk/sql"
echo "   Run the SQL from: quick-auth-fix.sql"
echo ""
echo "════════════════════════════════════════════════════════════════════"
echo ""
echo "After completing steps 1-3, test login at:"
echo "🔗 $DOMAIN"
echo ""
echo "════════════════════════════════════════════════════════════════════"
