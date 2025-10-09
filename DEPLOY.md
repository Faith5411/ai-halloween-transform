# 🚀 Deployment Guide - AI Halloween Transform

Complete guide to deploy your app to Vercel with Supabase authentication and Stripe payments.

---

## 📋 Prerequisites

Before deploying, ensure you have:

- ✅ Node.js 18+ installed
- ✅ A Vercel account (free at https://vercel.com)
- ✅ A Supabase project with reset JWT secret (see URGENT_SETUP.md)
- ✅ Stripe account with payment links configured
- ✅ Google Gemini API key
- ✅ All environment variables ready

---

## 🔧 Pre-Deployment Setup

### 1. Install Vercel CLI (Optional)

```bash
npm install -g vercel
```

### 2. Test Build Locally

```bash
cd "ai-haloween 2"
npm run build
npm run preview
```

Visit `http://localhost:4173` to test the production build.

### 3. Verify Environment Variables

Make sure your `.env` file has:

```env
VITE_SUPABASE_URL=https://twsnioiuggbyzfxajlwk.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_key
VITE_GEMINI_API_KEY=your_gemini_key
```

**IMPORTANT**: These are your LOCAL environment variables. You'll configure them separately in Vercel.

---

## 🌐 Deploy to Vercel (Web Dashboard)

### Step 1: Connect to Vercel

1. Go to https://vercel.com/new
2. Click **"Import Project"**
3. Select **"Import Git Repository"**
4. Choose your repository (or upload the folder)

### Step 2: Configure Project

- **Framework Preset**: Vite
- **Root Directory**: `./` (or `ai-haloween 2` if deploying from parent)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Step 3: Add Environment Variables

Click **"Environment Variables"** and add:

| Name | Value | Environment |
|------|-------|-------------|
| `VITE_SUPABASE_URL` | `https://twsnioiuggbyzfxajlwk.supabase.co` | Production |
| `VITE_SUPABASE_ANON_KEY` | Your NEW anon key | Production |
| `VITE_STRIPE_PUBLISHABLE_KEY` | `pk_live_...` | Production |
| `VITE_GEMINI_API_KEY` | Your Gemini key | Production |

**Important**: Use **Production** keys, not test keys!

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for build to complete (2-5 minutes)
3. Get your deployment URL (e.g., `https://your-app.vercel.app`)

---

## 🌐 Deploy via Vercel CLI

### Option A: Quick Deploy

```bash
cd "ai-haloween 2"
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N**
- Project name? `ai-halloween-transform`
- Directory? `./`
- Override settings? **N**

### Option B: Deploy with Environment Variables

```bash
vercel --prod \
  -e VITE_SUPABASE_URL=https://twsnioiuggbyzfxajlwk.supabase.co \
  -e VITE_SUPABASE_ANON_KEY=your_key \
  -e VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_key \
  -e VITE_GEMINI_API_KEY=your_key
```

---

## ⚙️ Post-Deployment Configuration

### 1. Update Supabase Redirect URLs

1. Go to: https://supabase.com/dashboard/project/twsnioiuggbyzfxajlwk/auth/url-configuration
2. Add your Vercel URL to **"Site URL"**:
   ```
   https://your-app.vercel.app
   ```
3. Add to **"Redirect URLs"**:
   ```
   https://your-app.vercel.app
   https://your-app.vercel.app/**
   https://twsnioiuggbyzfxajlwk.supabase.co/auth/v1/callback
   ```

### 2. Update Stripe Success/Cancel URLs (Optional)

If you want custom success/cancel pages:

1. Go to Stripe Dashboard → Payment Links
2. Edit each link
3. Update:
   - Success URL: `https://your-app.vercel.app/?payment=success`
   - Cancel URL: `https://your-app.vercel.app/?payment=canceled`

### 3. Configure Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Click **"Add Domain"**
3. Enter your domain (e.g., `aihalloween.com`)
4. Follow DNS configuration instructions
5. Wait for SSL certificate (automatic)

### 4. Update Environment Variables for Custom Domain

If using custom domain, update Supabase redirect URLs:
```
https://aihalloween.com
https://aihalloween.com/**
```

---

## 🔄 Continuous Deployment

Vercel automatically deploys when you push to Git:

1. **Push to main branch** → Deploys to production
2. **Push to other branches** → Creates preview deployment
3. **Pull requests** → Creates preview deployment

To disable auto-deploy:
- Vercel Dashboard → Settings → Git → Disable "Automatic Deployments"

---

## 🧪 Testing Your Deployment

### 1. Test Authentication

- Visit your deployed URL
- Click **"Sign In"**
- Try signing up with email/password
- Verify you receive confirmation email
- Test login/logout

### 2. Test Payment Flow

- Click **"Subscribe Now"** on Basic plan
- Verify redirect to Stripe checkout
- Use test card: `4242 4242 4242 4242`
- Complete test payment
- Verify redirect back to app

### 3. Test Image Transform

- Upload an image
- Select a costume
- Click **"Transform"**
- Verify transformation works

---

## 📊 Monitoring & Analytics

### Vercel Analytics (Free)

1. Go to Vercel Dashboard → Your Project → Analytics
2. View:
   - Page views
   - Top pages
   - Visitor locations
   - Performance metrics

### Supabase Logs

1. Go to: https://supabase.com/dashboard/project/twsnioiuggbyzfxajlwk/logs/explorer
2. Monitor:
   - Authentication events
   - Database queries
   - API requests
   - Errors

### Stripe Dashboard

1. Go to: https://dashboard.stripe.com
2. Monitor:
   - Payments
   - Subscriptions
   - Failed payments
   - Customer churn

---

## 🐛 Troubleshooting

### Build Fails

**Error: "Module not found"**
```bash
# Solution: Make sure all dependencies are in package.json
npm install
npm run build
```

**Error: "Environment variable undefined"**
```bash
# Solution: Check environment variables in Vercel Dashboard
# Settings → Environment Variables
```

### Authentication Not Working

**Users can't sign up/in**
- Check Supabase redirect URLs include your Vercel domain
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
- Check browser console for errors

### Payment Links Not Working

**Redirect fails after payment**
- Update success/cancel URLs in Stripe Payment Links
- Use your deployed domain, not localhost

### Images Not Transforming

**Gemini API errors**
- Verify `VITE_GEMINI_API_KEY` is set correctly
- Check Gemini API quotas/billing
- Check browser console for errors

---

## 🔄 Updating Your Deployment

### Method 1: Git Push (Automatic)

```bash
git add .
git commit -m "Update app"
git push origin main
```

Vercel automatically deploys!

### Method 2: Manual Redeploy

1. Vercel Dashboard → Your Project → Deployments
2. Click "⋮" on latest deployment
3. Click "Redeploy"

### Method 3: CLI

```bash
vercel --prod
```

---

## 🔒 Security Checklist

- [ ] Using LIVE keys (pk_live_, not pk_test_)
- [ ] Supabase JWT secret has been reset
- [ ] Environment variables set in Vercel (not hardcoded)
- [ ] `.env` file is in `.gitignore`
- [ ] Supabase Row Level Security (RLS) enabled
- [ ] Redirect URLs properly configured
- [ ] HTTPS enabled (automatic with Vercel)
- [ ] Rate limiting considered (use Supabase/Vercel features)

---

## 📈 Scaling Considerations

### If you get high traffic:

1. **Upgrade Supabase Plan**
   - Free tier: 50,000 monthly active users
   - Paid: Unlimited

2. **Upgrade Vercel Plan**
   - Hobby (free): 100GB bandwidth/month
   - Pro ($20/mo): 1TB bandwidth/month

3. **Optimize Images**
   - Use WebP format
   - Implement lazy loading
   - Use CDN for assets

4. **Add Caching**
   - Use Vercel Edge Cache
   - Cache Gemini responses (if allowed)

---

## 🎉 Launch Day Checklist

- [ ] Deploy to production
- [ ] Test all features on live site
- [ ] Verify payment processing works
- [ ] Check authentication flow
- [ ] Test on mobile devices
- [ ] Share link with beta testers
- [ ] Monitor analytics/logs
- [ ] Set up error alerting
- [ ] Announce on social media! 🎃

---

## 📞 Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Stripe Docs**: https://stripe.com/docs
- **Vite Docs**: https://vitejs.dev

---

## 🚀 Your Deployment URLs

After deployment, you'll have:

- **Production**: `https://your-app.vercel.app`
- **Preview**: `https://your-app-git-branch.vercel.app` (for each branch)
- **Custom Domain** (if configured): `https://yourdomain.com`

---

**Ready to launch? Let's go! 🎃👻**