# 🚀 Vercel MCP Server - Ready to Deploy!

Your AI Halloween Transform app now has a **Vercel MCP Server** that lets you deploy and manage it through natural conversations with Claude Desktop!

---

## 🎉 What's Built

A complete Model Context Protocol (MCP) server with **12 powerful tools** that gives Claude the ability to:

- ✅ **Deploy to Vercel** (production or preview)
- ✅ **Manage environment variables** (create, update, delete)
- ✅ **Monitor deployments** (status, logs, metrics)
- ✅ **Debug build failures** (view logs, identify issues)
- ✅ **Configure domains** (view and manage)
- ✅ **List and inspect projects** (all details)

---

## ⚡ Quick Start

### Step 1: Configure Claude Desktop (30 seconds)

Run this one command:

```bash
cd "ai-haloween 2/vercel-mcp-server" && ./configure-claude.sh
```

This will automatically:
- Detect your operating system
- Create the config file in the right location
- Add your Vercel token securely
- Back up any existing configuration

**Or configure manually:** See [SETUP_COMPLETE.md](vercel-mcp-server/SETUP_COMPLETE.md)

### Step 2: Restart Claude Desktop

**Completely quit and reopen Claude for Desktop.**

### Step 3: Test It

In Claude, ask:

```
Show me all my Vercel projects
```

If you see your projects, **you're ready!** 🎉

---

## 🎃 Deploy Your AI Halloween App

Now you can deploy with simple conversations:

### First-Time Deployment

```
I need to deploy my ai-halloween project to Vercel. Can you help me:
1. Check if the project exists
2. Set up these environment variables for all environments:
   - VITE_SUPABASE_URL: https://twsnioiuggbyzfxajlwk.supabase.co
   - VITE_SUPABASE_ANON_KEY: [your-key]
   - VITE_STRIPE_PUBLISHABLE_KEY: [your-key]
   - VITE_GEMINI_API_KEY: [your-key]
3. Deploy to preview first for testing
```

### Subsequent Deployments

```
Deploy ai-halloween to production
```

### Check Status

```
What's the status of my ai-halloween deployment?
```

### Debug Issues

```
My deployment failed. Show me the logs and help me fix it.
```

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| **[README.md](vercel-mcp-server/README.md)** | Complete server documentation |
| **[USAGE.md](vercel-mcp-server/USAGE.md)** | Real-world usage examples |
| **[SETUP_COMPLETE.md](vercel-mcp-server/SETUP_COMPLETE.md)** | Setup completion guide |
| **[VERCEL_DEPLOYMENT_GUIDE.md](VERCEL_DEPLOYMENT_GUIDE.md)** | Full deployment guide for AI Halloween |
| **[VERCEL_MCP_READY.md](VERCEL_MCP_READY.md)** | Comprehensive overview |

---

## 🔧 Available Tools

Claude can now use these tools to manage your Vercel projects:

1. **`list_projects`** - List all Vercel projects
2. **`get_project`** - Get project details
3. **`list_deployments`** - View deployment history
4. **`get_deployment`** - Check deployment status
5. **`create_deployment`** - Deploy to production/preview
6. **`cancel_deployment`** - Stop running deployments
7. **`get_deployment_logs`** - Debug build issues
8. **`list_env_variables`** - View environment variables
9. **`create_env_variable`** - Add new variables
10. **`update_env_variable`** - Update existing variables
11. **`delete_env_variable`** - Remove variables
12. **`get_project_domains`** - View domain configuration

---

## 💡 Example Conversations

### Deploy to Production

**You:**
```
Deploy ai-halloween to production
```

**Claude:**
- Creates a production deployment
- Returns the deployment URL
- Monitors the build progress
- Alerts you when it's ready

### Debug Failed Build

**You:**
```
My deployment failed. What went wrong?
```

**Claude:**
- Retrieves the deployment logs
- Identifies the error
- Suggests fixes
- Can help implement the fix

### Update Environment Variables

**You:**
```
I rotated my Stripe key. Update VITE_STRIPE_PUBLISHABLE_KEY 
to pk_live_new_key_here for all environments and redeploy.
```

**Claude:**
- Updates the environment variable
- Triggers a new deployment
- Confirms when complete

---

## 🔒 Security

Your **Vercel token** is stored only in Claude Desktop's configuration:

- ✅ Not committed to Git
- ✅ Not visible in your codebase
- ✅ Only accessible by Claude Desktop
- ✅ Full account access - keep secure!

**Token:** `GCPbSqXjktG1IR4a2forcN0C`

### Best Practices

1. Rotate your token every 90 days
2. Use encrypted env vars in Vercel for secrets
3. Monitor token usage in Vercel dashboard
4. Revoke immediately if compromised

**If compromised:**
1. Go to https://vercel.com/account/tokens
2. Delete the token
3. Create a new one
4. Update `claude_desktop_config.json`
5. Restart Claude Desktop

---

## 🐛 Troubleshooting

### Tools Not Showing

1. **Completely quit** Claude Desktop (not minimize)
2. Verify config file exists at:
   - Linux: `~/.config/Claude/claude_desktop_config.json`
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
3. Check server path is correct
4. Restart Claude Desktop again

### API Errors

**Error:** "VERCEL_TOKEN environment variable is required"

**Fix:** Check your `claude_desktop_config.json` has the token in the `env` section

**Error:** "Vercel API error (401)"

**Fix:** Your token is invalid or expired. Create a new one at https://vercel.com/account/tokens

### View Logs

```bash
# macOS
tail -f ~/Library/Logs/Claude/mcp*.log

# Linux
tail -f ~/.config/Claude/logs/mcp*.log
```

---

## 📦 Project Structure

```
ai-haloween 2/
├── vercel-mcp-server/           # MCP server
│   ├── src/
│   │   └── index.ts             # Server implementation
│   ├── dist/
│   │   └── index.js             # Built server (configured in Claude)
│   ├── README.md                # Full documentation
│   ├── USAGE.md                 # Usage examples
│   ├── SETUP_COMPLETE.md        # Setup guide
│   ├── configure-claude.sh      # Auto-configuration script
│   └── setup.sh                 # Initial setup script
├── VERCEL_DEPLOYMENT_GUIDE.md   # Deployment guide
├── VERCEL_MCP_READY.md          # Complete overview
└── README_VERCEL_MCP.md         # This file
```

---

## 🎯 Deployment Checklist

Before deploying to production:

### Prerequisites
- [ ] GitHub repository connected to Vercel
- [ ] Supabase project running (twsnioiuggbyzfxajlwk)
- [ ] Supabase anon key ready
- [ ] Stripe publishable key ready
- [ ] Gemini API key ready

### Via Claude Desktop
- [ ] Configure Claude Desktop (run `configure-claude.sh`)
- [ ] Restart Claude Desktop
- [ ] Test connection: `Show me all my Vercel projects`
- [ ] Add environment variables via Claude
- [ ] Deploy to preview: `Deploy ai-halloween to preview`
- [ ] Test preview deployment thoroughly
- [ ] Deploy to production: `Deploy ai-halloween to production`
- [ ] Configure Supabase Auth URLs with production domain
- [ ] Set up Stripe webhooks
- [ ] Monitor deployment: `What's the status of ai-halloween?`

### Post-Deployment
- [ ] Test sign-in/sign-up
- [ ] Verify gallery works
- [ ] Test photo upload and transformation
- [ ] Verify payment flow
- [ ] Check analytics tracking
- [ ] Monitor error logs

---

## 🚀 What's Next?

### Immediate Actions

1. **Run the setup script:**
   ```bash
   cd "ai-haloween 2/vercel-mcp-server"
   ./configure-claude.sh
   ```

2. **Restart Claude Desktop**

3. **Test the connection:**
   ```
   Show me all my Vercel projects
   ```

4. **Deploy your app:**
   ```
   Deploy ai-halloween to preview
   ```

### Advanced Features

Once comfortable with basic deployment:

- Set up automated deployments on push
- Configure custom domains
- Monitor deployment performance
- Set up environment-specific configs
- Implement blue-green deployments
- Create deployment automation workflows

---

## 🎊 Success Criteria

You'll know everything is working when:

1. ✅ Claude Desktop shows the 🔧 tools icon
2. ✅ You can list your Vercel projects
3. ✅ You can trigger deployments via conversation
4. ✅ You can view deployment logs
5. ✅ You can manage environment variables
6. ✅ Your AI Halloween app is live on Vercel!

---

## 📞 Resources

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Vercel API Docs:** https://vercel.com/docs/rest-api
- **MCP Specification:** https://modelcontextprotocol.io
- **Supabase Dashboard:** https://supabase.com/dashboard/project/twsnioiuggbyzfxajlwk
- **Stripe Dashboard:** https://dashboard.stripe.com

---

## 🎃 Ready to Deploy?

Your Vercel MCP server is built and ready. Just:

1. Configure Claude Desktop → `./configure-claude.sh`
2. Restart Claude Desktop
3. Start deploying with conversations!

**Questions?** Ask Claude! The MCP server enables intelligent deployment management through natural language.

---

**Built with ❤️ for the AI Halloween Transform project**

*Happy deploying! 🚀🎃*