# 🎃 AI Halloween Transform - Gallery & Contest Setup Guide

This guide will walk you through setting up the complete gallery and weekly contest system using Supabase.

## 📋 Prerequisites

- Supabase account with an active project
- Access to Supabase SQL Editor
- Your Supabase URL and anon key configured in `.env`

## ✅ Step 1: Run the SQL Schema

### Option A: Via Supabase Dashboard (Recommended)

1. **Open Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project: `twsnioiuggbyzfxajlwk`

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New query"

3. **Copy and Run the Schema**
   - Open `supabase-gallery-setup.sql` in your project
   - Copy the ENTIRE contents
   - Paste into the SQL Editor
   - Click "Run" or press Ctrl/Cmd + Enter

4. **Verify Success**
   - You should see: "Success. No rows returned"
   - This is normal! The schema creates tables, not data.

### Option B: Via Supabase CLI

```bash
# If you have Supabase CLI installed
supabase db push --db-url "your-connection-string"
```

## ✅ Step 2: Verify Database Setup

### Check Tables Were Created

Run this query in SQL Editor:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('gallery', 'gallery_votes', 'gallery_reports', 'weekly_contests');
```

You should see 4 tables returned:
- ✓ `gallery`
- ✓ `gallery_votes`
- ✓ `gallery_reports`
- ✓ `weekly_contests`

### Check Storage Bucket

1. Go to "Storage" in Supabase dashboard
2. You should see a bucket named `gallery`
3. The bucket should be marked as "Public"

### Check RPC Functions

Run this query:

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

You should see all 5 functions listed.

## ✅ Step 3: Enable Realtime (Optional but Recommended)

For live vote updates:

1. Go to "Database" → "Replication" in Supabase dashboard
2. Find the `gallery` table
3. Toggle "Enable Replication" ON
4. Do the same for `gallery_votes` table

This allows real-time updates when users vote!

## ✅ Step 4: Configure Storage CORS (If Needed)

If you get CORS errors when uploading images:

1. Go to "Storage" → "Policies" in Supabase dashboard
2. Ensure these policies exist on `gallery` bucket:
   - ✓ Public read access
   - ✓ Authenticated users can upload
   - ✓ Users can delete their own images

The SQL script already creates these, but verify they're active.

## ✅ Step 5: Test the System

### Test 1: Create a Contest Week

The schema auto-creates the current week, but verify:

```sql
SELECT * FROM weekly_contests ORDER BY created_at DESC LIMIT 1;
```

You should see one contest with the current week.

### Test 2: Test Gallery Insert (Manual)

```sql
-- Replace with your actual user ID from auth.users
INSERT INTO gallery (
  user_id,
  user_email,
  image_url,
  costume_name,
  prompt,
  is_public,
  moderation_status
) VALUES (
  'your-user-id-here',
  'test@example.com',
  'https://example.com/test-image.jpg',
  'Test Vampire',
  'A spooky vampire transformation',
  true,
  'approved'
);
```

### Test 3: Test Voting

```sql
-- Get a gallery item ID first
SELECT id FROM gallery LIMIT 1;

-- Then test voting (replace gallery-item-id)
SELECT increment_gallery_votes('gallery-item-id');

-- Verify vote count increased
SELECT votes_count FROM gallery WHERE id = 'gallery-item-id';
```

## ✅ Step 6: Integrate with Your App

### 1. Ensure Environment Variables Are Set

In your `.env`:

```env
VITE_SUPABASE_URL=https://twsnioiuggbyzfxajlwk.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 2. Import the Gallery Service

The gallery service is already created at `services/galleryService.ts`. It includes:

- ✅ `fetchGalleryItems()` - Get gallery items with filters
- ✅ `submitToGallery()` - Submit transformations
- ✅ `voteOnItem()` - Vote on transformations
- ✅ `checkUserVoted()` - Check if user voted
- ✅ `getGalleryStats()` - Get statistics
- ✅ `getCurrentContest()` - Get current contest info
- ✅ `getWeeklyTopEntries()` - Get top entries for contest

### 3. Add ShareToGallery Component to Your App

In your main app component (e.g., `App.tsx`), import and use:

```tsx
import ShareToGallery from './components/ShareToGallery';

// In your component:
const [showShareModal, setShowShareModal] = useState(false);

// After generating a transformation:
<button onClick={() => setShowShareModal(true)}>
  Share to Gallery
</button>

{showShareModal && (
  <ShareToGallery
    imageUrl={generatedImageUrl}
    costumeName={selectedCostume}
    prompt={userPrompt}
    isVideo={isVideo}
    thumbnailUrl={thumbnailUrl}
    onClose={() => setShowShareModal(false)}
    onSuccess={() => {
      alert('Shared successfully!');
    }}
  />
)}
```

### 4. Add Landing Page to Your Routes

In `App.tsx` or your router:

```tsx
import LandingPage from './components/LandingPage';

// Add a route or conditional render:
{showLanding ? (
  <LandingPage onGetStarted={() => setShowLanding(false)} />
) : (
  <YourMainApp />
)}
```

## ✅ Step 7: Set Up Weekly Contest Automation (Optional)

To automatically select winners every Monday:

### Option A: Supabase Edge Function (Recommended)

Create a scheduled Edge Function:

```typescript
// supabase/functions/select-weekly-winner/index.ts
import { createClient } from '@supabase/supabase-js'

Deno.serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // Get last week's contest
  const lastWeek = getLastWeek(); // Implement this
  
  // Get top entry
  const { data: topEntries } = await supabase
    .rpc('get_weekly_top_entries', { week: lastWeek, limit_count: 1 })
  
  if (topEntries && topEntries.length > 0) {
    const winner = topEntries[0];
    
    // Mark as winner
    await supabase
      .from('gallery')
      .update({ is_winner: true, winner_tier: 'basic' })
      .eq('id', winner.id)
    
    // Update contest
    await supabase
      .from('weekly_contests')
      .update({
        winner_id: winner.id,
        winner_announced_at: new Date().toISOString()
      })
      .eq('contest_week', lastWeek)
    
    // TODO: Send email to winner
    // TODO: Grant free membership via Stripe
  }
  
  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```

Schedule with Supabase Cron:
- Go to Edge Functions in dashboard
- Deploy the function
- Set up a cron job to run every Monday at 9 AM

### Option B: Manual Selection

Every Monday, run this query to find the winner:

```sql
-- Get last week's winner
SELECT * FROM get_weekly_top_entries('2024-52', 1);

-- Mark as winner (replace with actual ID)
UPDATE gallery 
SET is_winner = true, winner_tier = 'basic'
WHERE id = 'winner-id';

UPDATE weekly_contests
SET winner_id = 'winner-id',
    winner_announced_at = NOW()
WHERE contest_week = '2024-52';
```

## 🎯 Step 8: Testing the Full Flow

### End-to-End Test:

1. **Log into your app** with a test account
2. **Generate a transformation** (upload photo + select costume)
3. **Click "Share to Gallery"** button
4. **Verify submission**:
   - Check Supabase dashboard → Gallery table
   - Should see your new entry with `moderation_status = 'approved'`
5. **View landing page** and verify your transformation appears
6. **Vote on transformations** (try voting twice - should prevent duplicates)
7. **Check vote count** updates in real-time

## 🐛 Troubleshooting

### Problem: "Supabase not configured" error

**Solution**: Check your `.env` file has correct values:
```bash
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY
```

### Problem: Gallery items not appearing

**Solutions**:
1. Check `moderation_status` is set to `'approved'`
2. Check `is_public` is `true`
3. Run query: `SELECT * FROM gallery WHERE moderation_status = 'approved' AND is_public = true;`

### Problem: Can't vote (already voted)

**Solution**: This is by design! Each user/IP can only vote once per item.

To reset votes for testing:
```sql
DELETE FROM gallery_votes WHERE gallery_id = 'your-test-item-id';
```

### Problem: Images not uploading to storage

**Solutions**:
1. Verify storage bucket exists: Supabase Dashboard → Storage → `gallery`
2. Check bucket is public
3. Verify storage policies are active
4. Check file size (max 10MB by default)

### Problem: RPC functions not found

**Solution**: Re-run the SQL schema. The functions might not have been created.

```sql
-- Verify functions exist
SELECT routine_name FROM information_schema.routines 
WHERE routine_schema = 'public';
```

## 📊 Monitoring & Analytics

### View Gallery Stats

```sql
SELECT 
  COUNT(*) as total_items,
  SUM(votes_count) as total_votes,
  AVG(votes_count) as avg_votes_per_item,
  COUNT(DISTINCT user_id) as unique_users
FROM gallery
WHERE is_public = true AND moderation_status = 'approved';
```

### View Current Contest Standings

```sql
SELECT * FROM current_contest_entries LIMIT 10;
```

### View All Winners

```sql
SELECT * FROM contest_winners ORDER BY winner_announced_at DESC;
```

## 🎉 Success!

Your gallery and contest system is now fully operational! 

Key features now active:
- ✅ Public transformation gallery
- ✅ Voting system (one vote per user/IP per item)
- ✅ Weekly contests with automatic week tracking
- ✅ Winner tracking and badges
- ✅ Real-time vote updates
- ✅ Image upload to Supabase storage
- ✅ Moderation system (reports)
- ✅ Statistics and leaderboards

## 🚀 Next Steps

1. **Add moderation dashboard** - Review reported items
2. **Implement prize distribution** - Auto-grant free membership to winners via Stripe
3. **Email notifications** - Notify winners
4. **Social sharing** - Add share to Twitter/Facebook buttons
5. **Gallery filters** - Add search, category filters
6. **User profiles** - Show user's gallery page

Need help? Check the main app components:
- `components/LandingPage.tsx` - Gallery UI
- `components/ShareToGallery.tsx` - Share modal
- `services/galleryService.ts` - Database operations

Happy transforming! 🎃👻🧛