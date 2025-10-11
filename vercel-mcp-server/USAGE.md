# Vercel MCP Server - Usage Guide for AI Halloween Transform

This guide provides real-world examples for deploying and managing your AI Halloween Transform app on Vercel using the MCP server with Claude.

## Table of Contents

- [Initial Setup](#initial-setup)
- [First-Time Deployment](#first-time-deployment)
- [Managing Environment Variables](#managing-environment-variables)
- [Deployment Workflows](#deployment-workflows)
- [Troubleshooting Deployments](#troubleshooting-deployments)
- [Monitoring and Maintenance](#monitoring-and-maintenance)
- [Advanced Scenarios](#advanced-scenarios)

---

## Initial Setup

### Step 1: Verify Your Project

First, check if your AI Halloween project is already on Vercel:

**Ask Claude:**
```
Show me all my Vercel projects
```

**Claude will:**
- List all your projects
- Show their IDs and latest deployment status
- Help you identify your AI Halloween project

### Step 2: Check Current Status

**Ask Claude:**
```
Get details for my ai-halloween project
```

**You'll see:**
- Project configuration
- Build settings
- Latest deployments
- Environment setup status

---

## First-Time Deployment

### Scenario 1: Deploy to Preview First

Before going to production, test in preview:

**Ask Claude:**
```
Deploy my ai-halloween project to preview
```

**Claude will:**
1. Create a preview deployment
2. Return the preview URL (e.g., `ai-halloween-git-main-username.vercel.app`)
3. Show deployment status

**Wait and verify:**
```
What's the status of my latest ai-halloween deployment?
```

**Once ready:**
- Visit the preview URL
- Test all features
- Verify the gallery works
- Check costume transformations

### Scenario 2: Deploy to Production

After testing preview:

**Ask Claude:**
```
Deploy ai-halloween to production
```

**Claude will:**
1. Trigger production deployment
2. Return production URL (your custom domain or `ai-halloween.vercel.app`)
3. Confirm deployment started

**Monitor progress:**
```
Show me deployment logs for the latest ai-halloween build
```

---

## Managing Environment Variables

### Scenario 1: Set Up All Required Variables

Your AI Halloween app needs these environment variables:

**Ask Claude:**
```
Show me all environment variables for ai-halloween
```

**If variables are missing, add them one by one:**

```
Add environment variable VITE_SUPABASE_URL with value https://twsnioiuggbyzfxajlwk.supabase.co to ai-halloween for all environments
```

```
Add environment variable VITE_SUPABASE_ANON_KEY with value [your-anon-key] to ai-halloween for all environments
```

```
Add encrypted environment variable VITE_STRIPE_PUBLISHABLE_KEY with value [your-stripe-key] to ai-halloween for production and preview
```

```
Add encrypted environment variable VITE_GEMINI_API_KEY with value [your-gemini-key] to ai-halloween for all environments
```

### Scenario 2: Update an Existing Variable

**First, get the variable ID:**
```
List all environment variables for ai-halloween
```

**Look for the variable you want to update and note its ID (e.g., `env_abc123xyz`)**

**Then update it:**
```
Update environment variable env_abc123xyz for ai-halloween with new value [new-value]
```

### Scenario 3: Rotate API Keys

When rotating keys for security:

**Ask Claude:**
```
I need to rotate the Supabase anon key for ai-halloween. Can you help me update it?
```

**Claude will:**
1. List current env variables
2. Identify the VITE_SUPABASE_ANON_KEY
3. Ask for the new value
4. Update it for all environments

**After updating, redeploy:**
```
Deploy ai-halloween to production with the new environment variables
```

### Scenario 4: Environment-Specific Variables

Add a variable only for development:

```
Add environment variable DEBUG_MODE with value true to ai-halloween for development only
```

Add a variable for production only:

```
Add encrypted environment variable VITE_PROD_ANALYTICS_ID with value [analytics-id] to ai-halloween for production only
```

---

## Deployment Workflows

### Daily Development Workflow

**Morning check:**
```
Show me the status of all my Vercel projects
```

**After pushing to GitHub:**
```
What's the latest deployment for ai-halloween?
```

**If automatic deployment failed:**
```
Show me the logs for the failed ai-halloween deployment
```

### Pre-Launch Checklist

**1. Verify environment variables:**
```
List all environment variables for ai-halloween and verify they're set for production
```

**2. Check recent deployments:**
```
Show me the last 5 deployments for ai-halloween
```

**3. Review domain configuration:**
```
Show me all domains configured for ai-halloween
```

**4. Deploy to production:**
```
Deploy ai-halloween to production from the main branch
```

**5. Monitor deployment:**
```
Get deployment logs for the latest ai-halloween production deployment
```

### Hotfix Workflow

**When you need to deploy a critical fix:**

```
I just pushed a hotfix to the main branch. Deploy ai-halloween to production immediately and show me the deployment status every minute until it's ready.
```

**Claude will:**
1. Trigger production deployment
2. Monitor status
3. Alert you when ready
4. Show any errors if deployment fails

---

## Troubleshooting Deployments

### Scenario 1: Build Failed

**Ask Claude:**
```
My ai-halloween deployment failed. Show me what went wrong.
```

**Claude will:**
1. Find the failed deployment
2. Retrieve build logs
3. Identify the error (e.g., missing env var, build command issue)
4. Suggest fixes

**Common issues:**

**Missing environment variable:**
```
Error: VITE_SUPABASE_URL is not defined
```
**Fix:**
```
Add the missing VITE_SUPABASE_URL environment variable to ai-halloween
```

**Build command failed:**
```
Error: npm run build failed with exit code 1
```
**Fix:**
```
Show me the full build logs to see which step failed
```

### Scenario 2: Deployment Stuck

**If deployment is taking too long:**

```
My ai-halloween deployment has been building for 10 minutes. Is it stuck?
```

**Claude will:**
- Check deployment status
- Show current build step
- Suggest canceling if truly stuck

**To cancel:**
```
Cancel the current ai-halloween deployment
```

**Then retry:**
```
Deploy ai-halloween again
```

### Scenario 3: Production Issues After Deployment

**Check what changed:**
```
Compare the last two production deployments for ai-halloween
```

**Rollback if needed:**
```
What was the deployment ID for the previous working version of ai-halloween?
```

**Get the ID (e.g., `dpl_xyz789`), then:**
```
I need to rollback. Can you help me deploy the previous version (dpl_xyz789) to production?
```

---

## Monitoring and Maintenance

### Daily Health Check

**Ask Claude:**
```
Give me a health check for ai-halloween: show me the latest deployment status, any errors in the logs, and verify all environment variables are set.
```

**Claude will provide:**
- Current deployment status
- Recent error logs (if any)
- Environment variable status
- Domain configuration

### Weekly Review

**Ask Claude:**
```
Show me all deployments for ai-halloween from the past week. Highlight any that failed or had issues.
```

**You'll see:**
- Deployment frequency
- Success rate
- Any problematic deployments
- Performance trends

### Performance Monitoring

**Check deployment times:**
```
Show me the last 10 ai-halloween deployments with their build times
```

**Analyze logs for performance issues:**
```
Get the logs for deployment dpl_abc123 and look for any performance warnings
```

---

## Advanced Scenarios

### Scenario 1: Deploy Specific Branch

**Deploy a feature branch for testing:**

```
Deploy ai-halloween from the feature/new-gallery branch to preview
```

**Claude will:**
1. Create a preview deployment from that branch
2. Provide a unique URL for testing
3. Keep production unaffected

### Scenario 2: A/B Testing Setup

**Create preview deployments from different branches:**

```
Deploy ai-halloween from branch experiment-a to preview
```

```
Deploy ai-halloween from branch experiment-b to preview
```

**You'll get two different URLs to compare**

### Scenario 3: Emergency Maintenance Mode

**If you need to take the app down temporarily:**

```
I need to enable maintenance mode for ai-halloween. Update the VITE_MAINTENANCE_MODE environment variable to true for production, then redeploy.
```

**Claude will:**
1. Update the environment variable
2. Trigger a new deployment
3. Confirm when maintenance mode is active

**To restore:**
```
Disable maintenance mode for ai-halloween and redeploy to production
```

### Scenario 4: Multi-Environment Setup

**Set up different configs per environment:**

**Development:**
```
Add VITE_API_ENDPOINT with value http://localhost:3000 to ai-halloween for development only
```

**Preview:**
```
Add VITE_API_ENDPOINT with value https://api-preview.example.com to ai-halloween for preview only
```

**Production:**
```
Add VITE_API_ENDPOINT with value https://api.example.com to ai-halloween for production only
```

---

## Quick Reference

### Most Common Commands

**Deploy to production:**
```
Deploy ai-halloween to production
```

**Check status:**
```
What's the status of ai-halloween?
```

**View logs:**
```
Show me the latest logs for ai-halloween
```

**List environment variables:**
```
Show me all environment variables for ai-halloween
```

**Add environment variable:**
```
Add [VARIABLE_NAME] with value [VALUE] to ai-halloween for all environments
```

**Check deployments:**
```
Show me the last 5 deployments for ai-halloween
```

---

## Tips for Working with Claude

### Be Specific

❌ **Bad:** "Deploy my app"
✅ **Good:** "Deploy ai-halloween to production"

### Provide Context

❌ **Bad:** "Something's wrong"
✅ **Good:** "My ai-halloween deployment failed with a build error. Show me the logs."

### Ask for Explanations

```
Why did my ai-halloween deployment fail? Explain the error and suggest fixes.
```

### Request Step-by-Step Help

```
I'm new to Vercel. Walk me through deploying ai-halloween to production for the first time, including checking all the requirements.
```

### Combine Operations

```
List all environment variables for ai-halloween, verify they match my .env.example file, and deploy to production if everything looks good.
```

---

## Safety Practices

### Before Production Deploy

1. ✅ Test in preview first
2. ✅ Verify all environment variables
3. ✅ Check recent commit messages
4. ✅ Review domain configuration
5. ✅ Have rollback plan ready

### After Production Deploy

1. ✅ Monitor deployment logs
2. ✅ Test critical features (auth, payments, gallery)
3. ✅ Check error tracking
4. ✅ Verify environment variables loaded correctly
5. ✅ Test on multiple devices

### Security Checklist

1. ✅ Never share API tokens in logs
2. ✅ Use encrypted env vars for secrets
3. ✅ Rotate keys regularly
4. ✅ Review deployment logs for sensitive data
5. ✅ Keep Vercel token secure

---

## Getting Help

**Ask Claude to troubleshoot:**
```
I'm having trouble with ai-halloween. Can you check the project status, recent deployments, and help me figure out what's wrong?
```

**Request documentation:**
```
Show me the Vercel documentation for environment variables
```

**Learn more about a feature:**
```
Explain how Vercel preview deployments work
```

---

Happy deploying! 🚀🎃