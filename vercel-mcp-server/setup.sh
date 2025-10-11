#!/bin/bash

# Vercel MCP Server Setup Script
# This script will help you set up the Vercel MCP server for use with Claude Desktop

set -e

echo "================================================"
echo "  Vercel MCP Server Setup"
echo "================================================"
echo ""

# Check if Node.js is installed
echo "Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "Please install Node.js 18.0.0 or higher from https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18.0.0 or higher is required"
    echo "Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
fi

echo "✅ npm $(npm -v) detected"
echo ""

# Install dependencies
echo "Installing dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Build the project
echo "Building the project..."
npm run build
echo "✅ Build completed"
echo ""

# Get the absolute path to the dist/index.js
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVER_PATH="$SCRIPT_DIR/dist/index.js"

echo "================================================"
echo "  Setup Complete!"
echo "================================================"
echo ""
echo "Next steps:"
echo ""
echo "1. Get your Vercel API token:"
echo "   → Visit: https://vercel.com/account/tokens"
echo "   → Click 'Create Token'"
echo "   → Give it a name (e.g., 'MCP Server')"
echo "   → Select 'Full Account' scope"
echo "   → Copy the token immediately"
echo ""
echo "2. Configure Claude for Desktop:"
echo ""

# Detect OS and show appropriate config path
if [[ "$OSTYPE" == "darwin"* ]]; then
    CONFIG_PATH="$HOME/Library/Application Support/Claude/claude_desktop_config.json"
    echo "   Edit: $CONFIG_PATH"
    echo ""
    echo "   Or run: code ~/Library/Application\\ Support/Claude/claude_desktop_config.json"
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    CONFIG_PATH="$APPDATA/Claude/claude_desktop_config.json"
    echo "   Edit: $CONFIG_PATH"
    echo ""
    echo "   Or run: notepad %APPDATA%\\Claude\\claude_desktop_config.json"
else
    echo "   Edit: ~/.config/Claude/claude_desktop_config.json"
fi

echo ""
echo "3. Add this configuration:"
echo ""
echo "{"
echo "  \"mcpServers\": {"
echo "    \"vercel\": {"
echo "      \"command\": \"node\","
echo "      \"args\": ["
echo "        \"$SERVER_PATH\""
echo "      ],"
echo "      \"env\": {"
echo "        \"VERCEL_TOKEN\": \"your_vercel_token_here\""
echo "      }"
echo "    }"
echo "  }"
echo "}"
echo ""
echo "4. Replace 'your_vercel_token_here' with your actual Vercel token"
echo ""
echo "5. Restart Claude for Desktop completely (Quit and reopen)"
echo ""
echo "6. Look for the tools icon in Claude to verify the server is connected"
echo ""
echo "================================================"
echo "  Server Path (copy this):"
echo "  $SERVER_PATH"
echo "================================================"
echo ""
echo "For detailed usage instructions, see README.md"
echo ""
echo "Happy deploying! 🚀"
