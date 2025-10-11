#!/bin/bash

# 🚨 RAPID DEPLOYMENT SCRIPT - AI HALLOWEEN TRANSFORM 🚨
# Goal: Get app live in under 1 hour
# Usage: ./DEPLOY_NOW.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
VERCEL_TOKEN="GCPbSqXjktG1IR4a2forcN0C"
SUPABASE_URL="https://twsnioiuggbyzfxajlwk.supabase.co"
PROJECT_NAME="ai-halloween"

echo -e "${PURPLE}"
echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║                                                                  ║"
echo "║        🎃 AI HALLOWEEN TRANSFORM - RAPID DEPLOYMENT 🎃          ║"
echo "║                                                                  ║"
echo "║             Get your app live in under 60 minutes!              ║"
echo "║                                                                  ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""

# Timer
START_TIME=$(date +%s)

# Step counter
STEP=0
total_steps() {
    STEP=$((STEP + 1))
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}STEP $STEP:${NC} $1"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

info() {
    echo -e "${CYAN}ℹ️  $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    error "Error: package.json not found!"
    error "Please run this script from the 'ai-haloween 2' directory"
    exit 1
fi

success "Found project directory"
echo ""

# ============================================================================
total_steps "CHECKING PREREQUISITES"
# ============================================================================

info "Checking Node.js..."
if ! command -v node &> /dev/null; then
    error "Node.js is not installed!"
    error "Install from: https://nodejs.org"
    exit 1
fi
success "Node.js $(node -v) found"

info "Checking npm..."
if ! command -v npm &> /dev/null; then
    error "npm is not installed!"
    exit 1
fi
success "npm $(npm -v) found"

info "Checking Git..."
if ! command -v git &> /dev/null; then
    warning "Git not found - you may need it to push to GitHub"
else
    success "Git found"
fi

echo ""

# ============================================================================
total_steps "COLLECTING REQUIRED API KEYS"
# ============================================================================

echo -e "${YELLOW}We need your API keys to deploy. If you don't have them, press Ctrl+C and get them first.${NC}"
echo ""

# Supabase Anon Key
if [ -z "$VITE_SUPABASE_ANON_KEY" ]; then
    echo -e "${CYAN}Supabase Anon Key:${NC}"
    echo "Get it from: https://supabase.com/dashboard/project/twsnioiuggbyzfxajlwk/settings/api"
    read -p "Enter your Supabase Anon Key: " VITE_SUPABASE_ANON_KEY
fi

# Stripe Key
if [ -z "$VITE_STRIPE_PUBLISHABLE_KEY" ]; then
    echo ""
    echo -e "${CYAN}Stripe Publishable Key:${NC}"
    echo "Get it from: https://dashboard.stripe.com/apikeys"
    read -p "Enter your Stripe Publishable Key: " VITE_STRIPE_PUBLISHABLE_KEY
fi

# Gemini Key
if [ -z "$VITE_GEMINI_API_KEY" ]; then
    echo ""
    echo -e "${CYAN}Google AI (Gemini) API Key:${NC}"
    echo "Get it from: https://makersuite.google.com/app/apikey"
    read -p "Enter your Gemini API Key: " VITE_GEMINI_API_KEY
fi

echo ""
success "All API keys collected!"
echo ""

# ============================================================================
total_steps "SETTING UP SUPABASE DATABASE"
# ============================================================================

info "Running Supabase gallery setup..."
if [ -f "setup-gallery-now.sh" ]; then
    chmod +x setup-gallery-now.sh
    echo ""
    echo -e "${YELLOW}Note: This will prompt for your Supabase credentials${NC}"
    echo ""
    ./setup-gallery-now.sh || warning "Gallery setup may need manual completion"
else
    warning "setup-gallery-now.sh not found - you'll need to run SQL manually"
    info "Copy supabase-gallery-setup.sql to Supabase SQL Editor"
fi

echo ""

# ============================================================================
total_steps "CONFIGURING VERCEL MCP SERVER"
# ============================================================================

info "Building Vercel MCP server..."
cd vercel-mcp-server

if [ ! -d "node_modules" ]; then
    info "Installing dependencies..."
    npm install
fi

info "Building server..."
npm run build

success "MCP server built!"

# Configure Claude Desktop
info "Setting up Claude Desktop configuration..."

# Detect OS
if [[ "$OSTYPE" == "darwin"* ]]; then
    CONFIG_DIR="$HOME/Library/Application Support/Claude"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    CONFIG_DIR="$HOME/.config/Claude"
else
    CONFIG_DIR="$HOME/.config/Claude"
fi

mkdir -p "$CONFIG_DIR"
CONFIG_FILE="$CONFIG_DIR/claude_desktop_config.json"
SERVER_PATH="$(pwd)/dist/index.js"

# Create config
cat > "$CONFIG_FILE" << EOF
{
  "mcpServers": {
    "vercel": {
      "command": "node",
      "args": [
        "$SERVER_PATH"
      ],
      "env": {
        "VERCEL_TOKEN": "$VERCEL_TOKEN"
      }
    }
  }
}
EOF

success "Claude Desktop configured!"
info "Config saved to: $CONFIG_FILE"

cd ..

echo ""

# ============================================================================
total_steps "PREPARING DEPLOYMENT INSTRUCTIONS"
# ============================================================================

# Create a temporary instruction file
cat > DEPLOY_INSTRUCTIONS.txt << EOF
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║                    🚀 DEPLOYMENT READY - NEXT STEPS 🚀                      ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝

PREREQUISITES COMPLETE! ✅

Now complete these final steps in Claude Desktop:

1. RESTART CLAUDE DESKTOP
   - Completely quit Claude Desktop (not just close)
   - Reopen Claude Desktop
   - Look for the 🔧 tools icon

2. VERIFY CONNECTION
   In Claude, ask:
   "Show me all my Vercel projects"

   ✅ If you see your projects, the MCP server is working!

3. DEPLOY TO PREVIEW (Test First)
   In Claude, say:
   "I need to deploy ai-halloween to preview. Please add these environment variables first:

   VITE_SUPABASE_URL=$SUPABASE_URL
   VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
   VITE_STRIPE_PUBLISHABLE_KEY=$VITE_STRIPE_PUBLISHABLE_KEY
   VITE_GEMINI_API_KEY=$VITE_GEMINI_API_KEY

   Then deploy to preview for testing."

4. TEST PREVIEW
   - Visit the preview URL Claude provides
   - Test sign up/sign in
   - Test photo upload
   - Test transformation
   - Test gallery
   - Test payment flow (use test card: 4242 4242 4242 4242)

5. DEPLOY TO PRODUCTION
   Once preview works, tell Claude:
   "Deploy ai-halloween to production"

6. POST-DEPLOYMENT SETUP
   - Update Supabase Auth URLs: https://supabase.com/dashboard/project/twsnioiuggbyzfxajlwk/auth/url-configuration
   - Add production URL to allowed URLs
   - Set up Stripe webhooks: https://dashboard.stripe.com/webhooks
   - Add webhook endpoint: https://[your-domain]/api/stripe-webhook

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 QUICK REFERENCE:

Your API Keys (saved):
- Supabase URL: $SUPABASE_URL
- Supabase Anon Key: ${VITE_SUPABASE_ANON_KEY:0:20}...
- Stripe Key: ${VITE_STRIPE_PUBLISHABLE_KEY:0:20}...
- Gemini Key: ${VITE_GEMINI_API_KEY:0:20}...

Vercel Token: $VERCEL_TOKEN
Claude Config: $CONFIG_FILE
MCP Server: $SERVER_PATH

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 HELPFUL COMMANDS FOR CLAUDE:

Check project status:
"What's the status of ai-halloween?"

View deployment logs:
"Show me the deployment logs for ai-halloween"

List environment variables:
"List all environment variables for ai-halloween"

Check domains:
"Show me all domains for ai-halloween"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⏰ TIMELINE:

- Today: Web deployment (you are here!)
- Days 4-7: Android build & submission
- Days 8-10: iOS build & submission
- Day 20: HALLOWEEN! 🎃

See 20_DAY_LAUNCH_PLAN.md for complete timeline.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🆘 TROUBLESHOOTING:

If Claude doesn't show tools:
1. Verify config file exists: $CONFIG_FILE
2. Completely restart Claude Desktop
3. Check logs: ~/Library/Logs/Claude/mcp*.log (macOS)
              ~/.config/Claude/logs/mcp*.log (Linux)

If deployment fails:
"My deployment failed. Show me the logs and help me debug."

If you need help:
"Help me troubleshoot ai-halloween deployment issues"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎉 YOU'RE READY TO DEPLOY!

Next: Restart Claude Desktop and follow the steps above.

Good luck! 🚀🎃

EOF

success "Deployment instructions created!"
echo ""

# ============================================================================
total_steps "DEPLOYMENT PREPARATION COMPLETE!"
# ============================================================================

END_TIME=$(date +%s)
ELAPSED=$((END_TIME - START_TIME))
MINUTES=$((ELAPSED / 60))
SECONDS=$((ELAPSED % 60))

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                                  ║${NC}"
echo -e "${GREEN}║                    ✅ SETUP COMPLETE! ✅                         ║${NC}"
echo -e "${GREEN}║                                                                  ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════════════╝${NC}"
echo ""

success "Completed in ${MINUTES}m ${SECONDS}s"
echo ""

echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}NEXT STEPS:${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "1. ${PURPLE}RESTART CLAUDE DESKTOP${NC} (quit and reopen)"
echo ""
echo -e "2. ${PURPLE}VERIFY CONNECTION${NC}"
echo "   Ask Claude: \"Show me all my Vercel projects\""
echo ""
echo -e "3. ${PURPLE}DEPLOY${NC}"
echo "   Follow instructions in: ${CYAN}DEPLOY_INSTRUCTIONS.txt${NC}"
echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

info "Full instructions saved to: DEPLOY_INSTRUCTIONS.txt"
echo ""
echo -e "${GREEN}Ready to view instructions?${NC}"
read -p "Press ENTER to display them now (or Ctrl+C to exit): "

clear
cat DEPLOY_INSTRUCTIONS.txt

echo ""
echo ""
echo -e "${PURPLE}═══════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}                    GO DEPLOY! TIME IS TICKING! ⏰🎃               ${NC}"
echo -e "${PURPLE}═══════════════════════════════════════════════════════════════════${NC}"
echo ""
