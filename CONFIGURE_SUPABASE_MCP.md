# 🔧 Configure Supabase MCP - Complete Guide

This guide will help you configure the Supabase MCP so I can manage your Supabase settings directly.

---

## 🎯 What You Need

To configure Supabase MCP, you need:

1. **Supabase Access Token** (NOT the anon key - different thing!)
2. **Database Connection String** (includes password)

---

## 📋 Step 1: Get Your Supabase Access Token

### Option A: Create New Access Token (Recommended)

1. **Go to Supabase Account Settings:**
   https://supabase.com/dashboard/account/tokens

2. **Click "Generate new token"**

3. **Give it a name:** (e.g., "MCP Access Token")

4. **Set permissions:**
   - All projects access (or select specific project)
   - Read/Write permissions

5. **Click "Generate token"**

6. **COPY THE TOKEN IMMEDIATELY** - You won't see it again!
   - It looks like: `sbp_1234567890abcdef...` (starts with `sbp_`)

7. **Save it somewhere safe** (you'll need it in Step 3)

---

## 📋 Step 2: Get Your Database Connection String

### Method 1: Via Supabase Dashboard

1. **Go to Database Settings:**
   https://supabase.com/dashboard/project/twsnioiuggbyzfxajlwk/settings/database

2. **Scroll to "Connection string"**

3. **Select "URI" tab**

4. **Copy the connection string** - it looks like:
   ```
   postgresql://postgres.twsnioiuggbyzfxajlwk:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres
   ```

5. **Replace `[YOUR-PASSWORD]` with your actual database password**

### Method 2: Get/Reset Database Password

If you don't know your database password:

1. **Go to Database Settings:**
   https://supabase.com/dashboard/project/twsnioiuggbyzfxajlwk/settings/database

2. **Click "Reset database password"**

3. **Copy the new password** (save it!)

4. **Build your connection string:**
   ```
   postgresql://postgres.twsnioiuggbyzfxajlwk:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres
   ```

---

## 📋 Step 3: Configure MCP in Claude Desktop

### For Claude Desktop (macOS/Linux):

1. **Open the config file:**
   ```bash
   nano ~/.config/Claude/claude_desktop_config.json
   ```

2. **Add or update the Supabase MCP configuration:**
   ```json
   {
     "mcpServers": {
       "supabase": {
         "command": "npx",
         "args": [
           "-y",
           "@modelcontextprotocol/server-supabase"
         ],
         "env": {
           "SUPABASE_ACCESS_TOKEN": "YOUR_ACCESS_TOKEN_HERE",
           "SUPABASE_PROJECT_URL": "https://twsnioiuggbyzfxajlwk.supabase.co",
           "SUPABASE_DB_URL": "postgresql://postgres.twsnioiuggbyzfxajlwk:YOUR_PASSWORD@aws-0-us-west-1.pooler.supabase.com:6543/postgres"
         }
       }
     }
   }
   ```

3. **Replace the placeholders:**
   - `YOUR_ACCESS_TOKEN_HERE` → Your access token from Step 1 (starts with `sbp_`)
   - `YOUR_PASSWORD` → Your database password from Step 2

4. **Save the file:**
   - Press `Ctrl+X`, then `Y`, then `Enter`

### For Claude Desktop (Windows):

1. **Open the config file:**
   ```
   %APPDATA%\Claude\claude_desktop_config.json
   ```
   (Paste this in File Explorer or use Notepad)

2. **Follow the same JSON configuration as above**

---

## 📋 Step 4: Alternative Method Using Connection String Only

If you prefer a simpler setup with just the connection string:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-supabase",
        "postgresql://postgres.twsnioiuggbyzfxajlwk:YOUR_PASSWORD@aws-0-us-west-1.pooler.supabase.com:6543/postgres"
      ]
    }
  }
}
```

**Note:** This method only allows database operations, not full Supabase management API access.

---

## 📋 Step 5: Restart Claude Desktop

After saving the configuration:

1. **Quit Claude Desktop completely**
   - macOS: `Cmd+Q`
   - Windows: Right-click taskbar icon → Exit

2. **Reopen Claude Desktop**

3. **Wait for MCP servers to connect** (takes 5-10 seconds)

---

## 🧪 Step 6: Test the Configuration

Once Claude Desktop restarts, tell me:

```
"List my Supabase projects"
```

or

```
"Show me the tables in my Supabase database"
```

If I can execute these commands successfully, the MCP is configured! ✅

---

## 🔐 Security Notes

**IMPORTANT:**

- ✅ Never share your access token publicly
- ✅ Never commit config files with tokens to Git
- ✅ Access tokens have full account access - keep them safe!
- ✅ You can revoke tokens anytime in Supabase dashboard
- ✅ Database password is different from access token

---

## 🐛 Troubleshooting

### Error: "MCP not found" or "Connection failed"

1. Check that `npx` is available:
   ```bash
   npx --version
   ```

2. Manually install the MCP server:
   ```bash
   npm install -g @modelcontextprotocol/server-supabase
   ```

3. Update config to use global install:
   ```json
   {
     "command": "mcp-server-supabase",
     "args": ["postgresql://..."]
   }
   ```

### Error: "Invalid credentials"

- Double-check your access token (should start with `sbp_`)
- Verify database password is correct
- Make sure you replaced ALL placeholders in the config

### Error: "Permission denied"

- Check that your access token has correct permissions
- Regenerate token with full permissions if needed

### MCP server not appearing

- Ensure JSON syntax is correct (no trailing commas, proper quotes)
- Check Claude Desktop logs:
  - macOS: `~/Library/Logs/Claude/`
  - Windows: `%APPDATA%\Claude\logs\`

---

## 📊 What I Can Do Once MCP is Configured

With Supabase MCP configured, I can:

✅ Configure Auth URLs and providers
✅ Enable/disable email confirmation
✅ Create and modify database tables
✅ Run SQL migrations
✅ Set up RLS policies
✅ Manage database users and permissions
✅ View and modify project settings
✅ Check logs and metrics

**No more manual dashboard steps!** 🎉

---

## 🚀 Quick Copy-Paste Template

Here's the complete config you need (just fill in YOUR_ACCESS_TOKEN and YOUR_PASSWORD):

```json
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
        "SUPABASE_ACCESS_TOKEN": "YOUR_ACCESS_TOKEN_HERE",
        "SUPABASE_PROJECT_URL": "https://twsnioiuggbyzfxajlwk.supabase.co",
        "SUPABASE_DB_URL": "postgresql://postgres.twsnioiuggbyzfxajlwk:YOUR_PASSWORD@aws-0-us-west-1.pooler.supabase.com:6543/postgres"
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
```

---

## 📝 Summary

1. Get Supabase Access Token from: https://supabase.com/dashboard/account/tokens
2. Get Database Password from: https://supabase.com/dashboard/project/twsnioiuggbyzfxajlwk/settings/database
3. Edit config: `~/.config/Claude/claude_desktop_config.json`
4. Add Supabase MCP configuration with your credentials
5. Restart Claude Desktop
6. Test by asking me to list your projects

**Then I can configure everything for you automatically!** 🎃