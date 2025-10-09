# 🚨 URGENT SECURITY & SETUP GUIDE 🚨

**READ THIS IMMEDIATELY!**

You exposed SECRET credentials in the chat. Follow these steps NOW to secure your app.

---

## ⚡ STEP 1: SECURE YOUR SUPABASE PROJECT (DO THIS FIRST!)

### Option A: Reset JWT Secret (Recommended for speed)

1. Go to: https://supabase.com/dashboard/project/twsnioiuggbyzfxajlwk/settings/api
2. Scroll to **"JWT Secret"**
3. Click **"Generate new JWT secret"** or **"Reset"**
4. Confirm the reset
5. **This will invalidate ALL current tokens and keys**
6. Copy the NEW anon key after reset

### Option B: Create New Project (Most Secure)

1. Go to: https://supabase.com/dashboard
2. Click **"New Project"**
3. Set up a fresh project
4. Copy the URL and anon key from the new project

---

## ✅ STEP 2: CREATE YOUR .env FILE

Create a file called `.env` in the root of your project (`ai-haloween 2/.env`):

```bash
# Supabase Configuration (AFTER you reset your keys)
VITE_SUPABASE_URL=https://twsnioiuggbyzfxajlwk.supabase.co
VITE_SUPABASE_ANON_KEY=your_NEW_anon_key_here

# Stripe Publishable Key (safe to use in frontend)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_KEY_HERE

# Google Gemini API
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

**Replace:**
- `your_NEW_anon_key_here` - Get from Supabase after reset
- `pk_live_YOUR_KEY_HERE` - Your Stripe publishable key (starts with pk_live_)
- `your_gemini_api_key_here` - Your Gemini API key

---

## 🔒 WHAT YOU EXPOSED & WHY IT'S DANGEROUS

### ✅ SAFE (Public Keys - OK to share):
- **Supabase URL**: `https://twsnioiuggbyzfxajlwk.supabase.co`
- **Anon Key** (eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...role":"anon"...) - Public, designed for frontend
- **Stripe Publishable Key** (pk_live_...) - Public, safe to use
- **Payment Links** - Designed to be shared

### ❌ DANGEROUS (Secret Keys - NEVER share):
- **Service Role Key** (eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...role":"service_role"...) - **YOU EXPOSED THIS!**
- **JWT Secret** (Pl/mHY1EZLDoAawrRhwn/...) - **YOU EXPOSED THIS!**
- **Stripe Secret Key** (sk_live_...) - **You exposed this earlier!**

### What Can Someone Do With These?
- ❌ Read/write/delete ALL data in your database
- ❌ Create fake authentication tokens
- ❌ Process unauthorized payments
- ❌ Access all customer data
- ❌ Impersonate any user

---

## 🛡️ STEP 3: SET UP SUPABASE DATABASE

After resetting your keys, set up your database tables:

### Create Users Table

Go to: https://supabase.com/dashboard/project/twsnioiuggbyzfxajlwk/editor

Run this SQL:

```sql
-- Create users table with subscription info
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  name TEXT,
  stripe_customer_id TEXT UNIQUE,
  subscription_tier TEXT DEFAULT 'basic' CHECK (subscription_tier IN ('basic', 'pro', 'magic')),
  subscription_status TEXT DEFAULT 'inactive',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can read own data"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own data"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id);

-- Auto-create user record on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

---

## 🚀 STEP 4: CONFIGURE GOOGLE OAUTH (OPTIONAL)

If you want "Sign in with Google":

1. Go to: https://supabase.com/dashboard/project/twsnioiuggbyzfxajlwk/auth/providers
2. Enable **Google** provider
3. Follow Supabase instructions to set up Google OAuth
4. Add authorized redirect URLs:
   - `https://twsnioiuggbyzfxajlwk.supabase.co/auth/v1/callback`
   - Your production domain (e.g., `https://yourdomain.com`)

---

## ✅ STEP 5: TEST YOUR SETUP

1. **Check .env file exists**:
   ```bash
   ls -la ai-haloween\ 2/.env
   ```

2. **Start the dev server**:
   ```bash
   cd ai-haloween\ 2
   npm run dev
   ```

3. **Test authentication**:
   - Click "Sign In" button
   - Try signing up with email/password
   - Verify you can log in/out

4. **Test payment links**:
   - Try clicking "Subscribe Now" on each tier
   - Verify redirect to Stripe checkout

---

## 📋 LAUNCH CHECKLIST

Before going live:

- [ ] Reset Supabase JWT secret (URGENT!)
- [ ] Create new Stripe secret key (you exposed the old one)
- [ ] Create `.env` file with correct keys
- [ ] Set up Supabase database tables (run SQL above)
- [ ] Test signup/login flow
- [ ] Test all three payment links
- [ ] Configure custom domain
- [ ] Set up production environment variables on Vercel
- [ ] Enable Stripe webhooks for subscription updates
- [ ] Test end-to-end payment flow
- [ ] Add privacy policy and terms of service

---

## 🔐 SECURITY BEST PRACTICES GOING FORWARD

### DO:
- ✅ Use `.env` files for secrets (already in .gitignore)
- ✅ Use VITE_ prefix for frontend variables
- ✅ Keep service role keys on backend only
- ✅ Use test mode during development
- ✅ Rotate keys regularly
- ✅ Enable Supabase RLS (Row Level Security)
- ✅ Monitor your dashboards for suspicious activity

### DON'T:
- ❌ Share secret keys in chat/email/Slack
- ❌ Commit `.env` to Git
- ❌ Use service role keys in frontend code
- ❌ Hardcode API keys
- ❌ Use live keys in development
- ❌ Ignore security warnings

---

## 🆘 WHAT TO DO IF YOU EXPOSE KEYS AGAIN

1. **Immediately revoke/rotate the exposed key**
2. **Check logs for unauthorized access**
3. **Update all apps using that key**
4. **Monitor for suspicious activity**
5. **Learn from the mistake**

---

## 📞 NEXT STEPS

1. **RIGHT NOW**: Reset your Supabase JWT secret
2. **In 5 minutes**: Create your `.env` file with NEW keys
3. **In 10 minutes**: Set up database tables
4. **In 15 minutes**: Test authentication
5. **In 30 minutes**: Deploy to Vercel with proper env vars

---

## 🎃 Your Payment Links (SAFE - Already Configured)

These are already set up in `constants-stripe.ts`:

- **Basic** ($4.99/month): https://buy.stripe.com/3cI14ne2y2Hs2X1ePL73G04
- **Pro** ($14.99/month): https://buy.stripe.com/28E14n4rYeqafJNbDz73G02
- **Magic** ($29.99/month): https://buy.stripe.com/9B67sL4rY3Lw0OT4b773G05

---

## 📚 Resources

- **Supabase Dashboard**: https://supabase.com/dashboard/project/twsnioiuggbyzfxajlwk
- **Stripe Dashboard**: https://dashboard.stripe.com
- **Supabase Docs**: https://supabase.com/docs
- **Stripe Docs**: https://stripe.com/docs

---

**🚨 STOP READING AND FIX YOUR SUPABASE PROJECT NOW! 🚨**

Go to: https://supabase.com/dashboard/project/twsnioiuggbyzfxajlwk/settings/api

Click: **"Generate new JWT secret"**

Then come back and finish the setup.