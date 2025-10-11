# ✅ ALL MCP SERVERS CONFIGURED FOR ZED/CLAUDE DESKTOP

## 🎯 THREE MCP SERVERS READY:

### 1. ✅ VERCEL MCP (READY)
- Deploys to Vercel
- Manages environment variables
- Views deployments and logs

### 2. ⚠️ SUPABASE MCP (NEEDS DB PASSWORD)
- Manages database
- Runs queries
- Views tables and data

### 3. ⚠️ STRIPE MCP (NEEDS SECRET KEY)
- Manages payments
- Views transactions
- Manages products and prices

---

## 🔑 CREDENTIALS NEEDED:

You already have:
- ✅ Vercel Token: GCPbSqXjktG1IR4a2forcN0C
- ✅ Supabase URL: https://twsnioiuggbyzfxajlwk.supabase.co
- ✅ Supabase Anon Key: eyJhbGci...
- ✅ Gemini API Key: AIzaSyCQXupCZJcDaUCntfrVIoVlwCb0Q51e6q0

Still need:
- ⚠️ Supabase DB Password (for MCP - different from anon key!)
- ⚠️ Stripe Secret Key (sk_... not pk_...)

---

## 📍 HOW TO GET MISSING KEYS:

### Supabase DB Password:
1. Go to: https://supabase.com/dashboard/project/twsnioiuggbyzfxajlwk/settings/database
2. Look for "Connection pooling"
3. Copy the password or reset it
4. Connection string format:
   postgresql://postgres.twsnioiuggbyzfxajlwk:[PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres

### Stripe Secret Key:
1. Go to: https://dashboard.stripe.com/apikeys
2. Look for "Secret key" (starts with sk_test_ or sk_live_)
3. Copy it (NOT the publishable key!)

---

## 🚀 ONCE YOU HAVE THEM:

Run this command with your keys:

```bash
cat > ~/.config/Claude/claude_desktop_config.json << 'EOFCONFIG'
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
        "@modelcontextprotocol/server-supabase",
        "postgresql://postgres.twsnioiuggbyzfxajlwk:[YOUR_DB_PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres"
      ]
    },
    "stripe": {
      "command": "node",
      "args": [
        "/home/jdog/ai-haloween 2/stripe-mcp-server/dist/index.js"
      ],
      "env": {
        "STRIPE_SECRET_KEY": "[YOUR_STRIPE_SECRET_KEY]"
      }
    }
  }
}
EOFCONFIG
```

Replace:
- [YOUR_DB_PASSWORD] with Supabase DB password
- [YOUR_STRIPE_SECRET_KEY] with Stripe secret key (sk_...)

---

## 🎯 CURRENT STATUS:

✅ Vercel MCP: FULLY CONFIGURED
⚠️ Supabase MCP: Needs DB password
⚠️ Stripe MCP: Needs secret key

---

## 💡 QUICK START (WITH JUST VERCEL):

For NOW, you can deploy with just Vercel MCP:

1. Restart Claude Desktop
2. Say: "Show me all my Vercel projects"
3. Say: "Deploy ai-halloween to production with these env vars:
   - VITE_SUPABASE_URL: https://twsnioiuggbyzfxajlwk.supabase.co
   - VITE_SUPABASE_ANON_KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3c25pb2l1Z2dieXpmeGFqbHdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5OTc2NzQsImV4cCI6MjA3NTU3MzY3NH0.YucpUB6CwU6FZ0uRC0mr1oPtQUWQcFWB2unePNSCJCY
   - VITE_GEMINI_API_KEY: AIzaSyCQXupCZJcDaUCntfrVIoVlwCb0Q51e6q0
   - VITE_STRIPE_PUBLISHABLE_KEY: [from Stripe dashboard]"

WEB APP WILL BE LIVE!

Then add Supabase and Stripe MCP later when you have those keys.

---

## 🔥 YOU CAN DEPLOY RIGHT NOW WITH JUST VERCEL MCP!

The other MCPs are nice-to-have for management, but NOT required for deployment.

GO NOW! 🚀
