#!/bin/bash

# Automatic Claude Desktop Configuration for Vercel MCP Server
# This script will configure Claude Desktop to use the Vercel MCP server

set -e

echo "================================================"
echo "  Vercel MCP Server - Claude Desktop Setup"
echo "================================================"
echo ""

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVER_PATH="$SCRIPT_DIR/dist/index.js"
VERCEL_TOKEN="GCPbSqXjktG1IR4a2forcN0C"

# Check if server is built
if [ ! -f "$SERVER_PATH" ]; then
    echo "❌ Server not built yet!"
    echo "Run: npm install && npm run build"
    exit 1
fi

echo "✅ Server found at: $SERVER_PATH"
echo ""

# Detect OS and set config path
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    CONFIG_DIR="$HOME/Library/Application Support/Claude"
    CONFIG_FILE="$CONFIG_DIR/claude_desktop_config.json"
    OS_NAME="macOS"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    CONFIG_DIR="$HOME/.config/Claude"
    CONFIG_FILE="$CONFIG_DIR/claude_desktop_config.json"
    OS_NAME="Linux"
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    # Windows
    CONFIG_DIR="$APPDATA/Claude"
    CONFIG_FILE="$CONFIG_DIR/claude_desktop_config.json"
    OS_NAME="Windows"
else
    echo "❌ Unsupported operating system: $OSTYPE"
    echo "Please configure manually. See SETUP_COMPLETE.md"
    exit 1
fi

echo "Detected OS: $OS_NAME"
echo "Config location: $CONFIG_FILE"
echo ""

# Create config directory if it doesn't exist
if [ ! -d "$CONFIG_DIR" ]; then
    echo "Creating config directory..."
    mkdir -p "$CONFIG_DIR"
    echo "✅ Directory created"
fi

# Prepare the MCP server configuration
MCP_CONFIG=$(cat <<EOF
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
)

# Check if config file exists
if [ -f "$CONFIG_FILE" ]; then
    echo "⚠️  Config file already exists"
    echo ""
    echo "Options:"
    echo "1) Backup existing and create new config (RECOMMENDED)"
    echo "2) Show existing config and manual merge instructions"
    echo "3) Cancel"
    echo ""
    read -p "Choose option (1-3): " choice

    case $choice in
        1)
            # Backup existing config
            BACKUP_FILE="$CONFIG_FILE.backup.$(date +%Y%m%d_%H%M%S)"
            cp "$CONFIG_FILE" "$BACKUP_FILE"
            echo "✅ Backed up existing config to: $BACKUP_FILE"

            # Write new config
            echo "$MCP_CONFIG" > "$CONFIG_FILE"
            echo "✅ New config written"
            echo ""
            echo "⚠️  Your old config has been backed up."
            echo "If you had other MCP servers configured, you'll need to merge them manually."
            echo "Backup location: $BACKUP_FILE"
            ;;
        2)
            echo ""
            echo "Your existing config:"
            echo "-----------------------------------"
            cat "$CONFIG_FILE"
            echo "-----------------------------------"
            echo ""
            echo "To add Vercel MCP server, merge this configuration:"
            echo "-----------------------------------"
            echo "$MCP_CONFIG"
            echo "-----------------------------------"
            echo ""
            echo "Add the 'vercel' section under 'mcpServers' in your existing config."
            exit 0
            ;;
        3)
            echo "Cancelled."
            exit 0
            ;;
        *)
            echo "Invalid option. Cancelled."
            exit 1
            ;;
    esac
else
    # No existing config, create new one
    echo "Creating new configuration file..."
    echo "$MCP_CONFIG" > "$CONFIG_FILE"
    echo "✅ Configuration created"
fi

echo ""
echo "================================================"
echo "  ✅ Configuration Complete!"
echo "================================================"
echo ""
echo "Next steps:"
echo ""
echo "1. RESTART Claude for Desktop (completely quit and reopen)"
echo ""
echo "2. Look for the 🔧 tools icon in Claude Desktop"
echo ""
echo "3. Test with this command:"
echo "   'Show me all my Vercel projects'"
echo ""
echo "4. If you see your projects, you're ready to deploy!"
echo ""
echo "================================================"
echo "  Quick Commands to Try"
echo "================================================"
echo ""
echo "• List projects:"
echo "  Show me all my Vercel projects"
echo ""
echo "• Deploy to production:"
echo "  Deploy ai-halloween to production"
echo ""
echo "• Check deployment status:"
echo "  What's the status of ai-halloween?"
echo ""
echo "• View logs:"
echo "  Show me the deployment logs for ai-halloween"
echo ""
echo "================================================"
echo ""
echo "For troubleshooting, see SETUP_COMPLETE.md"
echo ""
echo "Happy deploying! 🚀🎃"
