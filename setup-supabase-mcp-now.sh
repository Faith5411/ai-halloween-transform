#!/bin/bash

echo "╔══════════════════════════════════════════════════════════════════════════════╗"
echo "║                                                                              ║"
echo "║                  🔧 SETTING UP SUPABASE MCP NOW 🔧                           ║"
echo "║                                                                              ║"
echo "╚══════════════════════════════════════════════════════════════════════════════╝"
echo ""

ACCESS_TOKEN="sbp_a05579b2d1b3a795a3fe90279bfb180e055859cf"

echo "✅ Access Token received!"
echo ""
echo "Now I need your database password..."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 HOW TO GET DATABASE PASSWORD:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Open this link in your browser:"
echo "   https://supabase.com/dashboard/project/twsnioiuggbyzfxajlwk/settings/database"
echo ""
echo "2. Scroll to 'Database Password' section"
echo ""
echo "3. If you don't know the password, click 'Reset database password'"
echo ""
echo "4. Copy the password and paste it here"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
read -s -p "Enter your database password: " DB_PASSWORD
echo ""
echo ""

if [ -z "$DB_PASSWORD" ]; then
    echo "❌ No password entered. Exiting..."
    exit 1
fi

echo "✅ Password received!"
echo ""

# Create connection string
DB_URL="postgresql://postgres.twsnioiuggbyzfxajlwk:${DB_PASSWORD}@aws-0-us-west-1.pooler.supabase.com:6543/postgres"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📝 UPDATING CLAUDE CONFIG..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

CONFIG_FILE="$HOME/.config/Claude/claude_desktop_config.json"
BACKUP_FILE="$HOME/.config/Claude/claude_desktop_config.json.backup"

# Backup existing config
if [ -f "$CONFIG_FILE" ]; then
    cp "$CONFIG_FILE" "$BACKUP_FILE"
    echo "✅ Backed up existing config to: $BACKUP_FILE"
fi

# Create config directory if needed
mkdir -p "$HOME/.config/Claude"

# Create new config
cat > "$CONFIG_FILE" << EOFCONFIG
{
  "mcpServers": {
    "vercel": {
      "command": "node",
      "args": [
        "/home/jdog/ai-haloween 2/vercel-mcp-server/dist/index.js"
      ],
      "env": {
        "VERCEL_TOKEN": "GCPbSqXjktG1IR4a2forcN0C"
      }
    },
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-supabase"
      ],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "${ACCESS_TOKEN}",
        "SUPABASE_DB_URL": "${DB_URL}"
      }
    },
    "stripe": {
      "command": "node",
      "args": [
        "/home/jdog/ai-haloween 2/stripe-mcp-server/dist/index.js"
      ],
      "env": {
        "STRIPE_SECRET_KEY": "YOUR_STRIPE_SECRET_KEY"
      }
    }
  }
}
EOFCONFIG

echo "✅ Config file updated!"
echo "   Location: $CONFIG_FILE"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎯 NEXT STEPS:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. CLOSE Claude Desktop completely (Cmd+Q or Ctrl+Q)"
echo ""
echo "2. REOPEN Claude Desktop"
echo ""
echo "3. Wait 10 seconds for MCP servers to connect"
echo ""
echo "4. Go back to the chat and say:"
echo "   'list my supabase projects'"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ CONFIGURATION COMPLETE!"
echo ""
echo "Once Claude Desktop restarts, I'll be able to:"
echo "  • Configure Supabase Auth URLs automatically"
echo "  • Enable/disable email confirmation"
echo "  • Setup database tables"
echo "  • Run SQL migrations"
echo "  • Manage all Supabase settings"
echo ""
echo "🎃 No more manual configuration needed! 🎃"
echo ""

