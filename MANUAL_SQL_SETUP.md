# 🎃 Manual SQL Setup Guide - Gallery & Contest System

Since the Supabase MCP requires authentication credentials, here's how to manually set up your gallery and contest system using the Supabase Dashboard.

---

## ⏱️ Time Required: 5-10 minutes

---

## 📋 Step-by-Step Instructions

### Step 1: Open Supabase Dashboard

1. Go to: **https://supabase.com/dashboard**
2. Log in to your account
3. Select your project: **twsnioiuggbyzfxajlwk**
   - Or click this direct link: https://supabase.com/dashboard/project/twsnioiuggbyzfxajlwk

### Step 2: Open SQL Editor

1. In the left sidebar, click **"SQL Editor"**
2. Click the **"New query"** button (top right)
3. You should see an empty SQL editor

### Step 3: Copy the SQL Schema

1. Open the file `supabase-gallery-setup.sql` in your code editor
2. Select **ALL** the contents (Ctrl+A / Cmd+A)
3. Copy to clipboard (Ctrl+C / Cmd+C)

**Important:** Make sure you copy the ENTIRE file (400+ lines). The file includes:
- Storage bucket setup
- 4 table definitions
- Indexes
- Row-level security policies
- RPC functions
- Triggers
- Views
- Seed data

### Step 4: Paste and Execute

1. Return to the Supabase SQL Editor
2. Paste the SQL (Ctrl+V / Cmd+V)
3. Click **"Run"** button or press **Ctrl+Enter** / **Cmd+Enter**
4. Wait 3-5 seconds for execution

### Step 5: Verify Success

You should see one of these messages:
- ✅ **"Success. No rows returned"** - Perfect! This is expected.
- ✅ **"Success"** - Great! Setup complete.

If you see an error, check:
- Did you copy the entire SQL file?
- Is your Supabase project active?
- Do you have the correct permissions?

---

## ✅ Verification Steps

Run these queries in the SQL Editor to verify everything was created:

### Check Tables

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('gallery', 'gallery_votes', 'gallery_reports', 'weekly_contests');
```

**Expected Result:** 4 rows showing all 4 tables

### Check Storage Bucket

```sql
SELECT * FROM storage.buckets WHERE id = 'gallery';
```

**Expected Result:** 1 row with bucket details (public = true)

### Check RPC Functions

```sql
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN (
  'increment_gallery_votes',
  'decrement_gallery_votes',
  'increment_gallery_views',
  'get_current_contest_week',
  'get_weekly_top_entries'
);
```

**Expected Result:** 5 rows showing all 5 functions

### Check Initial Contest

```sql
SELECT * FROM weekly_contests ORDER BY created_at DESC LIMIT 1;
```

**Expected Result:** 1 row with the current week's contest

---

## 🎯 What Was Created

### Tables (4)
- ✅ `gallery` - Stores user transformations
- ✅ `gallery_votes` - Tracks votes (prevents duplicates)
- ✅ `gallery_reports` - Moderation system
- ✅ `weekly_contests` - Contest tracking

### Storage
- ✅ `gallery` bucket - Public image storage (10MB limit per file)

### RPC Functions (5)
- ✅ `increment_gallery_votes()` - Atomic vote increment
- ✅ `decrement_gallery_votes()` - Atomic vote decrement
- ✅ `increment_gallery_views()` - Track view counts
- ✅ `get_current_contest_week()` - Returns current week (YYYY-WW)
- ✅ `get_weekly_top_entries()` - Get contest leaderboard

### Security
- ✅ Row-level security policies (users can only modify their own data)
- ✅ Storage access policies (authenticated users can upload)
- ✅ Anti-cheat constraints (1 vote per user/IP per item)

### Database Views (3)
- ✅ `top_transformations` - All-time top items
- ✅ `current_contest_entries` - This week's contest
- ✅ `contest_winners` - Past winners

---

## 🧪 Test Your Setup

### Quick Test in SQL Editor

```sql
-- Test 1: Insert a test gallery item
INSERT INTO gallery (
  user_id,
  user_email,
  image_url,
  costume_name,
  is_public,
  moderation_status
) VALUES (
  '00000000-0000-0000-0000-000000000000', -- Replace with your user ID
  'test@example.com',
  'https://via.placeholder.com/400',
  'Test Vampire',
  true,
  'approved'
) RETURNING *;

-- Test 2: Check if it appears
SELECT * FROM gallery WHERE costume_name = 'Test Vampire';

-- Test 3: Clean up test data
DELETE FROM gallery WHERE costume_name = 'Test Vampire';
```

**Note:** Replace the `user_id` with your actual user ID from `auth.users` table.

---

## 🚀 Next Steps

Now that the database is set up:

### 1. Start Your App (2 min)

```bash
cd "ai-haloween 2"
npm run dev
```

### 2. Test the Flow (3 min)

1. Upload a photo
2. Select a costume
3. Click "Transform"
4. Hover over result → Click purple **"Share"** button
5. Preview modal opens
6. Click **"Share to Gallery"**
7. Success! 🎉

### 3. Verify in Dashboard (1 min)

1. Go to Supabase Dashboard
2. Database → Table Editor → `gallery`
3. Your transformation should appear!

### 4. View Landing Page

1. Add landing page to your app routing
2. See your transformation in the gallery
3. Try voting with the heart button
4. Can't vote twice? Anti-cheat is working! ✅

---

## 🐛 Troubleshooting

### Error: "relation already exists"

**Cause:** Tables already exist from a previous run.

**Solution:** This is fine! The SQL uses `IF NOT EXISTS` so it won't break anything. However, if you need to start fresh:

```sql
-- WARNING: This deletes ALL gallery data!
DROP TABLE IF EXISTS gallery_reports CASCADE;
DROP TABLE IF EXISTS gallery_votes CASCADE;
DROP TABLE IF EXISTS gallery CASCADE;
DROP TABLE IF EXISTS weekly_contests CASCADE;

-- Then re-run the full schema
```

### Error: "permission denied"

**Cause:** Your Supabase user doesn't have sufficient permissions.

**Solution:** 
- Make sure you're the project owner
- Contact support if you're a collaborator needing elevated permissions

### Error: "bucket already exists"

**Cause:** Storage bucket was created previously.

**Solution:** This is fine! The SQL uses `ON CONFLICT DO NOTHING` so it's safe to run multiple times.

### Can't find my user_id for testing

```sql
-- Find your user ID
SELECT id, email FROM auth.users ORDER BY created_at DESC LIMIT 5;
```

---

## 📊 Monitoring Your Gallery

### View All Submissions

```sql
SELECT 
  costume_name,
  votes_count,
  is_winner,
  created_at
FROM gallery
WHERE is_public = true
AND moderation_status = 'approved'
ORDER BY votes_count DESC
LIMIT 10;
```

### View Current Contest Standings

```sql
SELECT * FROM current_contest_entries LIMIT 10;
```

### View All-Time Winners

```sql
SELECT * FROM contest_winners;
```

### Gallery Statistics

```sql
SELECT
  COUNT(*) as total_submissions,
  SUM(votes_count) as total_votes,
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(*) FILTER (WHERE is_winner = true) as total_winners
FROM gallery
WHERE is_public = true
AND moderation_status = 'approved';
```

---

## 🎨 Customization Options

### Change Default Moderation Status

If you want to review all submissions before they go live:

```sql
ALTER TABLE gallery 
ALTER COLUMN moderation_status SET DEFAULT 'pending';
```

### Change Contest Prize Tier

```sql
UPDATE weekly_contests
SET prize_tier = 'pro'  -- or 'magic'
WHERE contest_week = (SELECT get_current_contest_week());
```

### Feature a Transformation

```sql
UPDATE gallery
SET is_featured = true
WHERE id = 'your-item-id-here';
```

---

## 🏆 Weekly Contest Management

### View Current Week's Top 10

```sql
SELECT * FROM get_weekly_top_entries(
  (SELECT get_current_contest_week()),
  10
);
```

### Select This Week's Winner (Run Every Monday)

```sql
-- Step 1: Find the winner (most votes)
SELECT * FROM get_weekly_top_entries(
  (SELECT get_current_contest_week()),
  1
);

-- Step 2: Mark as winner (replace 'winner-id')
UPDATE gallery 
SET 
  is_winner = true,
  winner_tier = 'basic'
WHERE id = 'winner-id-from-step-1';

-- Step 3: Update contest record
UPDATE weekly_contests
SET 
  winner_id = 'winner-id-from-step-1',
  winner_announced_at = NOW()
WHERE contest_week = (SELECT get_current_contest_week());
```

---

## ✅ Setup Complete!

Your gallery and contest system is now fully operational! 🎃

**What you can do now:**
- ✅ Users can share transformations
- ✅ Public can vote (no login required!)
- ✅ Weekly contests automatically track entries
- ✅ Winners get badges and prizes
- ✅ Real-time statistics
- ✅ Moderation system ready

**Next:**
- See `CONTEST_READY.md` for full feature list
- See `GALLERY_SETUP.md` for advanced setup
- See `LAUNCH_CHECKLIST.md` before going live

---

## 📚 Additional Resources

- **Supabase Dashboard:** https://supabase.com/dashboard/project/twsnioiuggbyzfxajlwk
- **SQL Editor:** https://supabase.com/dashboard/project/twsnioiuggbyzfxajlwk/sql
- **Storage:** https://supabase.com/dashboard/project/twsnioiuggbyzfxajlwk/storage/buckets
- **Database:** https://supabase.com/dashboard/project/twsnioiuggbyzfxajlwk/database/tables

---

**🎉 Congratulations! Your gallery and contest system is ready!** 🎃👻🧛