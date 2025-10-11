# AI Halloween Transform - Vercel Deployment Guide

Complete guide for deploying your AI Halloween Transform app to Vercel, including both manual deployment and using the Vercel MCP server with Claude.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Method 1: Deploy via Vercel Dashboard](#method-1-deploy-via-vercel-dashboard)
- [Method 2: Deploy via Vercel CLI](#method-2-deploy-via-vercel-cli)
- [Method 3: Deploy via Vercel MCP Server](#method-3-deploy-via-vercel-mcp-server-recommended)
- [Environment Variables Setup](#environment-variables-setup)
- [Post-Deployment Configuration](#post-deployment-configuration)
- [Troubleshooting](#troubleshooting)
- [Security Checklist](#security-checklist)

---

## Prerequisites

### Required Accounts and Services

1. **Vercel Account** - [Sign up at vercel.com](https://vercel.com/signup)
2. **GitHub Account** - For connecting your repository
3. **Supabase Project** - Already set up (project ID: `twsnioiuggbyzfxajlwk`)
4. **Stripe Account** - For payment processing
5. **Google AI (Gemini) API Key** - For costume transformations

### Required API Keys and Tokens

Before deployment, gather these credentials:

- [ ] Supabase URL: `https://twsnioiuggbyzfxajlwk.supabase.co`
- [ ] Supabase Anon Key: From [Supabase Dashboard → Settings → API](https://supabase.com/dashboard/project/twsnioiuggbyzfxajlwk/settings/api)
- [ ] Stripe Publishable Key: From [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
- [ ] Gemini API Key: From [Google AI Studio](https://makersuite.google.com/app/apikey)
- [ ] Vercel Token (for MCP): From [Vercel Account Settings](https://vercel.com/account/tokens)

### Local Requirements

- Node.js 18.0.0 or higher
- Git installed and configured
- Code pushed to GitHub repository

---

## Method 1: Deploy via Vercel Dashboard

### Step 1: Connect Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Click **"Import"** next to your `ai-halloween` repository
4. If not visible, click **"Import Git Repository"** and authorize GitHub access

### Step 2: Configure Project

**Framework Preset:** Vite
**Root Directory:** `./` (leave default)
**Build Command:** `npm run build`
**Output Directory:** `dist`
**Install Command:** `npm install`

### Step 3: Add Environment Variables

Click **"Environment Variables"** and add each of these:

```
VITE_SUPABASE_URL=https://twsnioiuggbyzfxajlwk.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

**Important:** Select all three environments (Production, Preview, Development) for each variable.

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait 2-5 minutes for build to complete
3. You'll see "Congratulations!" when done
4. Note your deployment URL (e.g., `ai-halloween.vercel.app`)

### Step 5: Verify Deployment

Visit your deployment URL and test:
- [ ] Landing page loads correctly
- [ ] Sign in works (Supabase auth)
- [ ] Gallery displays (if data exists)
- [ ] Costume selection works
- [ ] Photo upload works
- [ ] Payment flow initiates (don't complete payment in test mode)

---

## Method 2: Deploy via Vercel CLI

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

Follow the prompts to authenticate.

### Step 3: Set Environment Variables Locally

Create a `.env.production` file (DO NOT commit this):

```bash
cat > .env.production << 'EOF'
VITE_SUPABASE_URL=https://twsnioiuggbyzfxajlwk.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
VITE_GEMINI_API_KEY=your_gemini_api_key_here
EOF
```

### Step 4: Link Project

From your project directory:

```bash
cd "ai-haloween 2"
vercel link
```

Select or create your project when prompted.

### Step 5: Add Environment Variables

```bash
# Add each environment variable
vercel env add VITE_SUPABASE_URL production
# Paste value when prompted

vercel env add VITE_SUPABASE_ANON_KEY production
# Paste value when prompted

vercel env add VITE_STRIPE_PUBLISHABLE_KEY production
# Paste value when prompted

vercel env add VITE_GEMINI_API_KEY production
# Paste value when prompted
```

Repeat for `preview` and `development` environments.

### Step 6: Deploy

**Preview deployment:**
```bash
vercel
```

**Production deployment:**
```bash
vercel --prod
```

### Step 7: Monitor Deployment

The CLI will show real-time build logs. Wait for:
```
✅ Production: https://ai-halloween.vercel.app [copied to clipboard]
```

---

## Method 3: Deploy via Vercel MCP Server (Recommended)

This method lets you deploy directly through conversations with Claude!

### Step 1: Install Vercel MCP Server

```bash
cd "ai-haloween 2/vercel-mcp-server"
chmod +x setup.sh
./setup.sh
```

Follow the on-screen instructions to:
1. Install dependencies
2. Build the server
3. Get your Vercel API token
4. Configure Claude for Desktop

### Step 2: Configure Claude for Desktop

Edit your Claude Desktop config:

**macOS:**
```bash
code ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

**Windows:**
```cmd
notepad %APPDATA%\Claude\claude_desktop_config.json
```

Add this configuration:

```json
{
  "mcpServers": {
    "vercel": {
      "command": "node",
      "args": [
        "/ABSOLUTE/PATH/TO/ai-haloween 2/vercel-mcp-server/dist/index.js"
      ],
      "env": {
        "VERCEL_TOKEN": "your_vercel_token_from_vercel_dashboard"
      }
    }
  }
}
```

**Get your Vercel token:**
1. Visit https://vercel.com/account/tokens
2. Click "Create Token"
3. Name it "MCP Server"
4. Select "Full Account" scope
5. Copy the token immediately

### Step 3: Restart Claude for Desktop

Completely quit and reopen Claude for Desktop.

### Step 4: Verify Connection

In Claude, look for the tools icon (🔧). You should see Vercel tools available.

### Step 5: Deploy via Claude

Simply ask Claude:

**For first-time deployment:**
```
I need to deploy my ai-halloween project to Vercel. Can you help me set up all the environment variables and create a production deployment?
```

**For subsequent deployments:**
```
Deploy ai-halloween to production
```

**To check status:**
```
What's the status of my ai-halloween deployment?
```

**To view logs:**
```
Show me the deployment logs for ai-halloween
```

### Step 6: Configure Environment Variables via Claude

**List existing variables:**
```
Show me all environment variables for ai-halloween
```

**Add missing variables:**
```
Add environment variable VITE_SUPABASE_URL with value https://twsnioiuggbyzfxajlwk.supabase.co to ai-halloween for all environments
```

Repeat for each required variable:
- `VITE_SUPABASE_ANON_KEY`
- `VITE_STRIPE_PUBLISHABLE_KEY`
- `VITE_GEMINI_API_KEY`

**Verify all are set:**
```
List all environment variables for ai-halloween and verify they match the required variables
```

---

## Environment Variables Setup

### Required Variables

| Variable | Purpose | Where to Get | Environments |
|----------|---------|--------------|--------------|
| `VITE_SUPABASE_URL` | Supabase API endpoint | [Supabase Dashboard](https://supabase.com/dashboard/project/twsnioiuggbyzfxajlwk/settings/api) | All |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | [Supabase Dashboard](https://supabase.com/dashboard/project/twsnioiuggbyzfxajlwk/settings/api) | All |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe public key | [Stripe Dashboard](https://dashboard.stripe.com/apikeys) | All |
| `VITE_GEMINI_API_KEY` | Google AI API key | [Google AI Studio](https://makersuite.google.com/app/apikey) | All |

### Optional Variables

| Variable | Purpose | Default | Environments |
|----------|---------|---------|--------------|
| `VITE_DEBUG_MODE` | Enable debug logging | `false` | Development |
| `VITE_MAINTENANCE_MODE` | Show maintenance page | `false` | All |
| `VITE_MAX_FREE_TRANSFORMATIONS` | Free transform limit | `3` | All |

### Security Notes

- **Never commit `.env` files** to Git
- Use **encrypted** type for sensitive variables in Vercel
- Rotate keys every 90 days
- Use different Stripe keys for test and production
- Monitor Supabase and Stripe dashboards for unusual activity

---

## Post-Deployment Configuration

### 1. Configure Supabase Auth URLs

After deployment, update Supabase with your production URL:

1. Go to [Supabase Dashboard → Authentication → URL Configuration](https://supabase.com/dashboard/project/twsnioiuggbyzfxajlwk/auth/url-configuration)

2. Update **Site URL:**
   ```
   https://your-domain.vercel.app
   ```

3. Add **Redirect URLs:**
   ```
   https://your-domain.vercel.app
   https://your-domain.vercel.app/auth/callback
   https://your-domain.vercel.app/**
   ```

4. Click **Save**

### 2. Configure Stripe Webhooks

Set up Stripe webhooks for payment processing:

1. Go to [Stripe Dashboard → Developers → Webhooks](https://dashboard.stripe.com/webhooks)

2. Click **Add endpoint**

3. Enter endpoint URL:
   ```
   https://your-domain.vercel.app/api/stripe-webhook
   ```

4. Select events to listen for:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`

5. Copy the **Webhook Signing Secret**

6. Add to Vercel environment variables:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_xxx...
   ```

7. Redeploy for changes to take effect

### 3. Configure Custom Domain (Optional)

**Via Vercel Dashboard:**
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. Wait for SSL certificate to provision (usually < 5 minutes)

**Via Claude (with MCP):**
```
Add the domain ai-halloween.com to my ai-halloween project
```

### 4. Set Up Analytics (Optional)

Vercel automatically provides analytics. Enable them:
1. Go to Project Settings → Analytics
2. Click **Enable**
3. View real-time metrics in the Analytics tab

---

## Troubleshooting

### Build Failures

#### Error: "Cannot find module"

**Cause:** Missing dependencies

**Fix:**
```bash
# Ensure package-lock.json is committed
git add package-lock.json
git commit -m "Add package-lock.json"
git push
```

Or via Claude:
```
My ai-halloween build is failing with a missing module error. Show me the deployment logs.
```

#### Error: "Environment variable not defined"

**Cause:** Missing environment variable

**Fix via Dashboard:**
1. Project Settings → Environment Variables
2. Add the missing variable
3. Redeploy

**Fix via Claude:**
```
Add the missing VITE_SUPABASE_URL environment variable to ai-halloween
```

#### Error: "Build exceeded maximum duration"

**Cause:** Build taking too long (> 45 minutes on free plan)

**Fix:**
- Check for infinite loops in build scripts
- Optimize dependencies
- Consider upgrading Vercel plan

### Runtime Errors

#### "Failed to fetch" or CORS errors

**Cause:** Supabase URL not configured or incorrect

**Fix:**
1. Verify `VITE_SUPABASE_URL` is set correctly
2. Check Supabase project is not paused
3. Verify Supabase Auth URLs include Vercel domain

#### Stripe payments not working

**Cause:** Webhook not configured or keys incorrect

**Fix:**
1. Verify `VITE_STRIPE_PUBLISHABLE_KEY` is correct
2. Test with Stripe test mode first
3. Check webhook endpoint is receiving events
4. Verify webhook secret is set correctly

#### Images not loading

**Cause:** Supabase Storage bucket not public

**Fix:**
1. Go to [Supabase Dashboard → Storage](https://supabase.com/dashboard/project/twsnioiuggbyzfxajlwk/storage/buckets)
2. Make `gallery` bucket public
3. Set appropriate RLS policies

### Deployment Issues

#### Deployment stuck in "Building" state

**Via CLI:**
```bash
vercel inspect [deployment-url]
```

**Via Claude:**
```
My ai-halloween deployment has been building for 10 minutes. Is it stuck? Can you cancel it and try again?
```

#### Preview deployment not updating

**Cause:** Vercel hasn't detected changes

**Fix:**
```bash
# Force a new commit
git commit --allow-empty -m "Trigger rebuild"
git push
```

Or via Claude:
```
Create a new preview deployment for ai-halloween
```

---

## Security Checklist

Before going live, verify:

### Authentication & Authorization
- [ ] Supabase RLS policies are enabled on all tables
- [ ] Auth URLs configured with production domain
- [ ] Email confirmation enabled in Supabase
- [ ] Rate limiting enabled on auth endpoints

### API Keys & Secrets
- [ ] All environment variables use encrypted type
- [ ] No secrets committed to Git repository
- [ ] Stripe webhook secret is set and working
- [ ] Gemini API key has usage limits configured

### Content Security
- [ ] Gallery content moderation is active
- [ ] Report functionality works
- [ ] NSFW filter is enabled for uploads
- [ ] Rate limiting on image generation

### Payment Security
- [ ] Using Stripe publishable key (not secret key)
- [ ] Webhook signature verification working
- [ ] Test mode for initial deployment
- [ ] Refund policy implemented

### Monitoring
- [ ] Error tracking enabled (Sentry/LogRocket)
- [ ] Vercel Analytics enabled
- [ ] Uptime monitoring configured
- [ ] Log review process established

---

## Production Deployment Checklist

Use this checklist before deploying to production:

### Pre-Deployment
- [ ] All tests passing locally
- [ ] Build succeeds locally (`npm run build`)
- [ ] Environment variables documented
- [ ] Database migrations applied (Supabase)
- [ ] Preview deployment tested thoroughly
- [ ] Performance tested (Lighthouse score > 90)
- [ ] Mobile responsiveness verified
- [ ] Cross-browser testing complete

### During Deployment
- [ ] Environment variables set in Vercel
- [ ] Supabase Auth URLs updated
- [ ] Stripe webhooks configured
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] DNS propagation complete

### Post-Deployment
- [ ] Production URL loads correctly
- [ ] Sign in/sign up works
- [ ] Gallery loads and displays data
- [ ] Photo upload and transformation works
- [ ] Payment flow completes successfully
- [ ] Share to gallery works
- [ ] Voting system functions
- [ ] No console errors
- [ ] All API calls succeed
- [ ] Analytics tracking works

### Monitoring (First 24 Hours)
- [ ] Check error logs hourly
- [ ] Monitor API usage and quotas
- [ ] Verify Stripe test payments work
- [ ] Check Supabase connection pool
- [ ] Monitor Vercel bandwidth usage
- [ ] Review user feedback
- [ ] Test on multiple devices

---

## Rollback Procedure

If you need to rollback a deployment:

### Via Vercel Dashboard
1. Go to Deployments tab
2. Find the last working deployment
3. Click the three dots menu
4. Click "Promote to Production"

### Via Vercel CLI
```bash
vercel rollback
```

### Via Claude (MCP)
```
I need to rollback ai-halloween to the previous deployment. Show me the last 5 deployments and help me rollback to the previous working version.
```

---

## Additional Resources

- **Vercel Documentation:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **Stripe Docs:** https://stripe.com/docs
- **Project README:** [README.md](README.md)
- **Vercel MCP Usage:** [vercel-mcp-server/USAGE.md](vercel-mcp-server/USAGE.md)

---

## Support

Need help? Try these resources:

1. **Check deployment logs** (via Dashboard, CLI, or Claude)
2. **Review Supabase logs** at https://supabase.com/dashboard/project/twsnioiuggbyzfxajlwk/logs
3. **Test locally** with production environment variables
4. **Ask Claude** (if using MCP server) for debugging help
5. **Consult documentation** links above

---

**Ready to deploy? Choose your method above and follow the steps carefully!** 🚀🎃