# 🚀 AI Halloween Transform - Deployment Checklist

Complete checklist for deploying your app to Vercel using the MCP server with Claude Desktop.

---

## 📋 Pre-Deployment Checklist

### Local Environment

- [ ] Code is committed and pushed to GitHub
- [ ] All local tests pass
- [ ] Build succeeds locally: `npm run build`
- [ ] No console errors in development mode
- [ ] All dependencies are in `package.json`
- [ ] `vercel.json` is configured correctly

### Required Services & Accounts

- [ ] Vercel account created and active
- [ ] GitHub repository accessible
- [ ] Supabase project running (ID: twsnioiuggbyzfxajlwk)
- [ ] Stripe account set up (test mode ready)
- [ ] Google AI (Gemini) API key obtained

### API Keys & Credentials Ready

- [ ] `VITE_SUPABASE_URL`: https://twsnioiuggbyzfxajlwk.supabase.co
- [ ] `VITE_SUPABASE_ANON_KEY`: ________________________
- [ ] `VITE_STRIPE_PUBLISHABLE_KEY`: ________________________
- [ ] `VITE_GEMINI_API_KEY`: ________________________
- [ ] Vercel Token: GCPbSqXjktG1IR4a2forcN0C ✅

---

## 🔧 MCP Server Setup

### Build & Install

- [ ] Navigate to `ai-haloween 2/vercel-mcp-server`
- [ ] Run `npm install` (dependencies installed)
- [ ] Run `npm run build` (server compiled) ✅
- [ ] Verify `dist/index.js` exists ✅

### Configure Claude Desktop

Choose one method:

#### Option A: Automatic Configuration (Recommended)

- [ ] Run `./configure-claude.sh`
- [ ] Follow prompts to backup existing config (if any)
- [ ] Verify configuration was created successfully

#### Option B: Manual Configuration

- [ ] Create config directory:
  - Linux: `~/.config/Claude`
  - macOS: `~/Library/Application Support/Claude`
  - Windows: `%APPDATA%\Claude`
- [ ] Create/edit `claude_desktop_config.json`
- [ ] Add Vercel MCP server configuration:
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
      }
    }
  }
  ```
- [ ] Save file

### Activate MCP Server

- [ ] **Completely quit** Claude Desktop (not just close window)
- [ ] **Reopen** Claude Desktop
- [ ] Look for 🔧 tools icon in Claude
- [ ] Verify 12 Vercel tools are visible

### Test Connection

- [ ] Ask Claude: "Show me all my Vercel projects"
- [ ] Verify you see your project list
- [ ] Connection successful! ✅

---

## 🎃 Deployment Process

### Step 1: Verify Project Exists

- [ ] Ask Claude: "Get details for my ai-halloween project"
- [ ] Note project ID and current status
- [ ] Check latest deployment status

### Step 2: Configure Environment Variables

Ask Claude to add each variable:

- [ ] Add `VITE_SUPABASE_URL` for all environments
  ```
  Add environment variable VITE_SUPABASE_URL with value 
  https://twsnioiuggbyzfxajlwk.supabase.co to ai-halloween 
  for all environments
  ```

- [ ] Add `VITE_SUPABASE_ANON_KEY` for all environments
  ```
  Add encrypted environment variable VITE_SUPABASE_ANON_KEY 
  with value [your-key] to ai-halloween for all environments
  ```

- [ ] Add `VITE_STRIPE_PUBLISHABLE_KEY` for all environments
  ```
  Add encrypted environment variable VITE_STRIPE_PUBLISHABLE_KEY 
  with value [your-key] to ai-halloween for all environments
  ```

- [ ] Add `VITE_GEMINI_API_KEY` for all environments
  ```
  Add encrypted environment variable VITE_GEMINI_API_KEY 
  with value [your-key] to ai-halloween for all environments
  ```

- [ ] Verify all variables: "List all environment variables for ai-halloween"

### Step 3: Deploy to Preview

- [ ] Ask Claude: "Deploy ai-halloween to preview"
- [ ] Wait for deployment to complete
- [ ] Note preview URL: ________________________
- [ ] Check deployment status: "What's the status of the latest ai-halloween deployment?"

### Step 4: Test Preview Deployment

Visit preview URL and test:

- [ ] Landing page loads correctly
- [ ] Sign-in/sign-up works (Supabase auth)
- [ ] Gallery displays (if data exists)
- [ ] Costume selection works
- [ ] Photo upload functions
- [ ] Transformation generates
- [ ] Payment flow initiates (test mode)
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Cross-browser tested (Chrome, Firefox, Safari)

### Step 5: Deploy to Production

- [ ] Ask Claude: "Deploy ai-halloween to production"
- [ ] Monitor deployment: "What's the status of ai-halloween?"
- [ ] Wait for "ready" status
- [ ] Note production URL: ________________________

### Step 6: View Deployment Logs (if needed)

- [ ] If issues occur: "Show me the deployment logs for ai-halloween"
- [ ] Debug any errors with Claude's help
- [ ] Redeploy if necessary

---

## ⚙️ Post-Deployment Configuration

### Supabase Auth Configuration

- [ ] Go to [Supabase Auth Settings](https://supabase.com/dashboard/project/twsnioiuggbyzfxajlwk/auth/url-configuration)
- [ ] Update **Site URL** to production URL
- [ ] Add **Redirect URLs**:
  - `https://[your-domain].vercel.app`
  - `https://[your-domain].vercel.app/auth/callback`
  - `https://[your-domain].vercel.app/**`
- [ ] Click **Save**
- [ ] Test authentication on production

### Stripe Webhook Configuration

- [ ] Go to [Stripe Webhooks](https://dashboard.stripe.com/webhooks)
- [ ] Click **Add endpoint**
- [ ] Enter: `https://[your-domain].vercel.app/api/stripe-webhook`
- [ ] Select events:
  - `checkout.session.completed`
  - `payment_intent.succeeded`
  - `payment_intent.payment_failed`
- [ ] Copy **Webhook Signing Secret**
- [ ] Ask Claude: "Add environment variable STRIPE_WEBHOOK_SECRET with value [secret] to ai-halloween for production"
- [ ] Redeploy: "Deploy ai-halloween to production"

### Custom Domain (Optional)

- [ ] Ask Claude: "Add domain [your-domain.com] to ai-halloween"
- [ ] Or use Vercel Dashboard → Domains
- [ ] Configure DNS records as instructed
- [ ] Wait for SSL certificate (usually < 5 minutes)
- [ ] Verify domain is active

---

## ✅ Production Verification

### Functionality Tests

- [ ] Landing page loads at production URL
- [ ] User can sign up with email
- [ ] Email confirmation works
- [ ] User can sign in
- [ ] Gallery displays public submissions
- [ ] User can select costume
- [ ] User can upload photo
- [ ] Transformation generates successfully
- [ ] User can share to gallery
- [ ] Voting system works
- [ ] Payment flow completes (test card)
- [ ] User can access full gallery after payment
- [ ] Sign-out works

### Performance Tests

- [ ] Run Lighthouse audit (target score > 90)
- [ ] Check page load time (< 3 seconds)
- [ ] Test on 3G connection
- [ ] Verify images load properly
- [ ] Check API response times

### Security Tests

- [ ] RLS policies working (users can't access others' data)
- [ ] Auth required for protected routes
- [ ] Payment flow is secure (no client secrets exposed)
- [ ] No sensitive data in console logs
- [ ] HTTPS enforced
- [ ] CORS configured correctly

### Analytics & Monitoring

- [ ] Vercel Analytics enabled
- [ ] Check deployment metrics in Vercel Dashboard
- [ ] Monitor error rates (should be 0%)
- [ ] Set up error tracking (Sentry/LogRocket recommended)
- [ ] Configure uptime monitoring

---

## 🔒 Security Final Check

### Environment Variables

- [ ] All secrets use "encrypted" type in Vercel
- [ ] No `.env` files committed to Git
- [ ] `.gitignore` includes environment files
- [ ] No hardcoded API keys in code

### Authentication

- [ ] Email confirmation enabled in Supabase
- [ ] Rate limiting active on auth endpoints
- [ ] Password requirements enforced
- [ ] Session management working correctly

### Database

- [ ] RLS policies enabled on all tables
- [ ] Public read access only where appropriate
- [ ] User-specific data properly isolated
- [ ] Admin functions protected

### API Keys

- [ ] Using Stripe **publishable** key (not secret)
- [ ] Gemini API key has usage limits
- [ ] Supabase **anon** key used (not service role)
- [ ] All keys rotated if previously exposed

### Vercel Token

- [ ] Token stored only in Claude Desktop config
- [ ] Not committed to Git
- [ ] Access documented for team
- [ ] Rotation schedule set (every 90 days)

---

## 📊 Monitoring Setup

### Daily Checks (First Week)

- [ ] Review error logs: Ask Claude "Show me recent logs for ai-halloween"
- [ ] Check deployment status
- [ ] Monitor API quotas (Supabase, Stripe, Gemini)
- [ ] Review user activity
- [ ] Check payment processing

### Weekly Checks (Ongoing)

- [ ] Review deployment history: "Show me last week's deployments for ai-halloween"
- [ ] Check performance metrics
- [ ] Review Stripe transactions
- [ ] Monitor storage usage (Supabase)
- [ ] Check for security updates

### Set Up Alerts

- [ ] Vercel deployment failure notifications
- [ ] Supabase quota alerts
- [ ] Stripe payment failure alerts
- [ ] Error rate threshold alerts
- [ ] Uptime monitoring alerts

---

## 🐛 Rollback Plan (If Needed)

### If Production Has Issues

- [ ] Ask Claude: "Show me the last 5 deployments for ai-halloween"
- [ ] Identify last working deployment ID
- [ ] Ask Claude: "I need to rollback ai-halloween to deployment [ID]"
- [ ] Or use Vercel Dashboard → Deployments → Promote to Production
- [ ] Verify rollback successful
- [ ] Debug issue in separate branch

---

## 📝 Documentation

### Update Project Documentation

- [ ] Document production URL
- [ ] Update README with deployment info
- [ ] Document environment variables (without values!)
- [ ] Create troubleshooting guide
- [ ] Document common maintenance tasks

### Team Handoff (If Applicable)

- [ ] Share Vercel project access
- [ ] Share Supabase project access
- [ ] Document MCP server setup for team
- [ ] Create runbook for common issues
- [ ] Set up on-call rotation

---

## 🎉 Launch Checklist

### Pre-Launch (T-24 hours)

- [ ] All checklist items above completed
- [ ] Preview deployment tested thoroughly
- [ ] Production deployment tested thoroughly
- [ ] All stakeholders notified
- [ ] Support channels ready
- [ ] Backup plan documented

### Launch Day

- [ ] Final production deployment
- [ ] Monitor deployment logs for first hour
- [ ] Test all critical paths
- [ ] Announce launch
- [ ] Monitor error rates closely
- [ ] Be available for quick fixes

### Post-Launch (First 24 Hours)

- [ ] Check error logs every 2 hours
- [ ] Monitor user activity
- [ ] Verify payment processing
- [ ] Check API quota usage
- [ ] Gather user feedback
- [ ] Document any issues

---

## 🎯 Success Criteria

Your deployment is successful when:

- ✅ Production site is live and accessible
- ✅ All features work correctly
- ✅ Authentication flows properly
- ✅ Payments process successfully
- ✅ No critical errors in logs
- ✅ Performance meets targets
- ✅ Security checks pass
- ✅ Monitoring is active
- ✅ Team can deploy via Claude Desktop
- ✅ Users can use the app without issues

---

## 📞 Support Resources

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Vercel Status**: https://www.vercel-status.com
- **Supabase Dashboard**: https://supabase.com/dashboard/project/twsnioiuggbyzfxajlwk
- **Stripe Dashboard**: https://dashboard.stripe.com
- **Claude Desktop** (for deployments and debugging)

---

## ✨ You're Ready to Deploy!

Follow this checklist step-by-step and you'll have a successful deployment. Use Claude Desktop with the MCP server to make the process conversational and intuitive.

**Good luck! 🚀🎃**

---

**Date Started**: _______________
**Date Completed**: _______________
**Deployed By**: _______________
**Production URL**: _______________