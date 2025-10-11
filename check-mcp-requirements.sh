#!/bin/bash

echo "╔══════════════════════════════════════════════════════════════════════════════╗"
echo "║                                                                              ║"
echo "║              🔍 CHECKING MCP CONFIGURATION REQUIREMENTS 🔍                   ║"
echo "║                                                                              ║"
echo "╚══════════════════════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "Checking what you already have configured..."
echo ""

# Check Vercel
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. VERCEL MCP"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ -f "vercel-mcp-server/dist/index.js" ]; then
    echo -e "${GREEN}✅ Vercel MCP server installed${NC}"
    echo "   Token: GCPbSqXjktG1IR4a2forcN0C"
    echo "   Status: READY TO USE"
else
    echo -e "${RED}❌ Vercel MCP not found${NC}"
fi
echo ""

# Check Supabase
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2. SUPABASE MCP"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${YELLOW}⚠️  Supabase MCP needs configuration${NC}"
echo ""
echo "What you have:"
echo "  ✓ Supabase URL: https://twsnioiuggbyzfxajlwk.supabase.co"
echo "  ✓ Supabase Anon Key: eyJhbGci... (for frontend)"
echo ""
echo "What you NEED for MCP:"
echo "  ❌ Supabase Access Token (from dashboard)"
echo "  ❌ Database Password (for connection string)"
echo ""
echo "Get these from:"
echo "  • Access Token: https://supabase.com/dashboard/account/tokens"
echo "  • DB Password: https://supabase.com/dashboard/project/twsnioiuggbyzfxajlwk/settings/database"
echo ""

# Check Stripe
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3. STRIPE MCP"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ -f "stripe-mcp-server/dist/index.js" ]; then
    echo -e "${GREEN}✅ Stripe MCP server installed${NC}"
    echo ""
    echo "What you have:"
    echo "  ✓ Stripe Publishable Key: (configured in Vercel)"
    echo ""
    echo "What you NEED for MCP:"
    echo "  ❌ Stripe Secret Key (starts with sk_)"
    echo ""
    echo "Get from: https://dashboard.stripe.com/apikeys"
else
    echo -e "${RED}❌ Stripe MCP not found${NC}"
fi
echo ""

# Check Claude config
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4. CLAUDE DESKTOP CONFIG"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

CONFIG_FILE="$HOME/.config/Claude/claude_desktop_config.json"
if [ -f "$CONFIG_FILE" ]; then
    echo -e "${GREEN}✅ Config file exists${NC}"
    echo "   Location: $CONFIG_FILE"
    echo ""
    if grep -q "supabase" "$CONFIG_FILE" 2>/dev/null; then
        echo -e "${GREEN}✅ Supabase MCP already configured in Claude${NC}"
    else
        echo -e "${YELLOW}⚠️  Supabase MCP not yet added to config${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Config file not found${NC}"
    echo "   Will be created at: $CONFIG_FILE"
fi
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 SUMMARY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "TO CONFIGURE SUPABASE MCP:"
echo ""
echo "1. Get Supabase Access Token:"
echo "   → https://supabase.com/dashboard/account/tokens"
echo "   → Click 'Generate new token'"
echo "   → Copy the token (starts with sbp_)"
echo ""
echo "2. Get Database Password:"
echo "   → https://supabase.com/dashboard/project/twsnioiuggbyzfxajlwk/settings/database"
echo "   → Reset password if needed"
echo "   → Save it somewhere safe"
echo ""
echo "3. Edit Claude config:"
echo "   → nano ~/.config/Claude/claude_desktop_config.json"
echo "   → Add Supabase MCP configuration"
echo "   → See CONFIGURE_SUPABASE_MCP.md for full template"
echo ""
echo "4. Restart Claude Desktop"
echo ""
echo "5. Test by asking me: 'List my Supabase projects'"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📖 Full guide: CONFIGURE_SUPABASE_MCP.md"
echo ""

