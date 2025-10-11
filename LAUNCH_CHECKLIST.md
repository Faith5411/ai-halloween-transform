# 🎃 AI Halloween Transform - Launch Checklist

**Use this checklist to ensure everything is ready before launching your gallery and contest system.**

---

## 📋 Pre-Launch Setup

### Database & Schema
- [ ] Open Supabase dashboard: https://supabase.com/dashboard/project/twsnioiuggbyzfxajlwk
- [ ] Go to SQL Editor
- [ ] Copy entire contents of `supabase-gallery-setup.sql`
- [ ] Paste and run in SQL Editor
- [ ] Verify "Success. No rows returned" message
- [ ] Check tables created:
  ```sql
  SELECT table_name FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name IN ('gallery', 'gallery_votes', 'gallery_reports', 'weekly_contests');
  ```
- [ ] Verify 4 tables returned: gallery, gallery_votes, gallery_reports, weekly_contests

### Storage Setup
- [ ] Go to Supabase Dashboard → Storage
- [ ] Verify `gallery` bucket exists
- [ ] Check bucket is marked as "Public"
- [ ] Verify storage policies active:
  - [ ] Public read access
  - [ ] Authenticated users can upload
  - [ ] Users can delete own images

### RPC Functions
- [ ] Verify functions exist:
  ```sql
  SELECT routine_name FROM information_schema.routines 
  WHERE routine_schema = 'public' 
  AND routine_name IN (
    'increment_gallery_votes',
    'decrement_gallery_votes',
    'increment_gallery_views',
    'get_current_contest_week',
    'get_weekly_top_entries'
  );
  ```
- [ ] Should see all 5 functions listed

### Environment Variables
- [ ] Verify `.env` or `.env.local` has:
  - [ ] `VITE_SUPABASE_URL=https://twsnioiuggbyzfxajlwk.supabase.co`
  - [ ] `VITE_SUPABASE_ANON_KEY=your_anon_key_here`
  - [ ] `VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...`
  - [ ] `VITE_GEMINI_API_KEY=your_key_here`

---

## 🧪 Testing Checklist

### Test 1: Share Transformation
- [ ] Run `npm run dev`
- [ ] Upload a photo
- [ ] Select a costume (e.g., Vampire)
- [ ] Click "Transform"
- [ ] Wait for transformation to complete
- [ ] Hover over result image
- [ ] Purple "Share" button appears
- [ ] Click "Share to Gallery"
- [ ] Preview modal opens
- [ ] Review preview information
- [ ] Click "Share to Gallery" button
- [ ] Success message appears: "Shared Successfully! 🎉"

### Test 2: Verify Database Entry
- [ ] Go to Supabase Dashboard
- [ ] Database → Table Editor → `gallery`
- [ ] Find your submission
- [ ] Verify fields:
  - [ ] `image_url` is set
  - [ ] `costume_name` matches your selection
  - [ ] `is_public = true`
  - [ ] `moderation_status = 'approved'`
  - [ ] `contest_week` is auto-assigned (format: YYYY-WW)
  - [ ] `votes_count = 0` (initially)
  - [ ] `user_id` matches your auth user

### Test 3: Landing Page Display
- [ ] Add Landing Page to your app routing
- [ ] Navigate to landing page
- [ ] Verify hero section displays
- [ ] Contest banner shows
- [ ] Gallery section visible
- [ ] Your transformation appears in gallery
- [ ] Image loads correctly
- [ ] Costume name displays

### Test 4: Voting (Authenticated)
- [ ] Ensure you're logged in
- [ ] View gallery on landing page
- [ ] Find a transformation
- [ ] Click heart (❤️) button
- [ ] Vote count increases by 1
- [ ] Button changes to "voted" state (pink background)
- [ ] Try voting again
- [ ] Should be disabled/not allow duplicate vote
- [ ] Check Supabase `gallery_votes` table
- [ ] Verify vote record exists with your `user_id`

### Test 5: Voting (Anonymous)
- [ ] Open app in incognito/private browser
- [ ] Navigate to landing page (no login)
- [ ] View gallery
- [ ] Click heart on a transformation
- [ ] Vote count increases
- [ ] Check Supabase `gallery_votes` table
- [ ] Verify vote saved with `voter_ip` (not user_id)
- [ ] Try voting again from same browser
- [ ] Should be prevented (anti-cheat working)

### Test 6: Gallery Tabs
- [ ] Click "Trending" tab
- [ ] Items sorted by votes_count DESC
- [ ] Click "Recent" tab
- [ ] Items sorted by created_at DESC
- [ ] Click "Winners" tab
- [ ] Only items with `is_winner = true` show
- [ ] Winners display 🏆 badge

### Test 7: Statistics
- [ ] Landing page stats bar shows:
  - [ ] Total transformations count
  - [ ] Total unique costumes (100+)
  - [ ] Total winners count
  - [ ] Total users count
- [ ] Numbers are real (not hardcoded mock data)

### Test 8: Video Transformations
- [ ] Generate a video (Magic tier only)
- [ ] Click "Share to Gallery"
- [ ] Verify `is_video = true` in modal preview
- [ ] Share to gallery
- [ ] Check Supabase: `is_video` field = true
- [ ] View on gallery: "🎬 VIDEO" badge displays

### Test 9: Download Functionality
- [ ] Hover over a transformation result
- [ ] Green "Download" button appears
- [ ] Click download
- [ ] Image/video downloads correctly
- [ ] File has correct name and format

---

## 🔒 Security Checklist

### Authentication
- [ ] Login required to share (can't bypass)
- [ ] Login NOT required to vote (optional feature)
- [ ] Auth state persists across refreshes
- [ ] Logout works correctly
- [ ] Can't access other users' data

### Row-Level Security
- [ ] Test: Try to delete another user's gallery item
- [ ] Should fail (RLS prevents it)
- [ ] Test: Try to update another user's submission
- [ ] Should fail (RLS prevents it)
- [ ] Own submissions can be deleted

### Anti-Cheat Voting
- [ ] Can't vote twice on same item (same user)
- [ ] Can't vote twice on same item (same IP)
- [ ] Database constraints prevent duplicate votes
- [ ] Vote count is atomic (no race conditions)

### API Keys
- [ ] Gemini API key in `.env` (not hardcoded)
- [ ] Stripe keys in `.env` (not hardcoded)
- [ ] Supabase keys in `.env` (not hardcoded)
- [ ] `.env` in `.gitignore`
- [ ] No secrets committed to repo

---

## 🎯 Contest System

### Weekly Contest Setup
- [ ] Current contest week auto-created on first submission
- [ ] Verify in Supabase: `weekly_contests` table
- [ ] Contest week format is YYYY-WW (ISO 8601)
- [ ] All new submissions auto-assigned to current week

### Winner Selection (Manual)
- [ ] Decide: Manual or automated selection?
- [ ] If manual: Schedule Monday morning reminder
- [ ] Test winner selection query:
  ```sql
  SELECT * FROM get_weekly_top_entries('2024-52', 1);
  ```
- [ ] Test marking as winner:
  ```sql
  UPDATE gallery 
  SET is_winner = true, winner_tier = 'basic'
  WHERE id = 'test-id';
  ```

### Prize Distribution
- [ ] Document winner notification process
- [ ] Plan: How to grant free membership?
- [ ] Option 1: Manually create Stripe promo code
- [ ] Option 2: Stripe webhook automation (future)
- [ ] Option 3: Direct Stripe subscription update

---

## 🚀 Deployment Preparation

### Code Checks
- [ ] Run `npm run build`
- [ ] Build succeeds without errors
- [ ] No TypeScript errors: `npm run type-check` (if available)
- [ ] No console errors in dev mode
- [ ] All imports resolve correctly

### Supabase Configuration
- [ ] Add production URL to Supabase redirect URLs
- [ ] Supabase Dashboard → Auth → URL Configuration
- [ ] Add both:
  - [ ] Site URL: `https://your-domain.com`
  - [ ] Redirect URLs: `https://your-domain.com/**`

### Vercel Deployment
- [ ] Verify `vercel.json` exists and correct
- [ ] Set environment variables in Vercel:
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `VITE_SUPABASE_ANON_KEY`
  - [ ] `VITE_STRIPE_PUBLISHABLE_KEY`
  - [ ] `VITE_GEMINI_API_KEY`
- [ ] Deploy to production: `vercel --prod`
- [ ] Verify deployment succeeds
- [ ] Test production URL

### Post-Deployment Testing
- [ ] Visit production URL
- [ ] Test login flow
- [ ] Generate a transformation
- [ ] Share to gallery
- [ ] Vote on items
- [ ] All features work on production

---

## 📱 Mobile Testing (Optional)

### Android
- [ ] Run `npm run build`
- [ ] Run `./build-android.sh`
- [ ] Open Android Studio
- [ ] Build APK or AAB
- [ ] Install on test device
- [ ] Test all features on mobile
- [ ] Gallery responsive on mobile
- [ ] Voting works on mobile
- [ ] Images display correctly

### iOS (If configured)
- [ ] Build iOS app
- [ ] Test on iOS device/simulator
- [ ] All features functional
- [ ] UI looks correct on iOS

---

## 📊 Monitoring Setup

### Supabase Dashboard
- [ ] Bookmark: Table Editor (monitor submissions)
- [ ] Bookmark: Database → Logs (debug issues)
- [ ] Set up alerts for errors (if available)

### Analytics (Optional)
- [ ] Track gallery submissions
- [ ] Track vote counts
- [ ] Track user engagement
- [ ] Monitor contest participation

### Weekly Tasks
- [ ] Monday: Select contest winner
- [ ] Monday: Announce winner (email/social)
- [ ] Monday: Grant prize to winner
- [ ] Weekly: Review gallery for inappropriate content
- [ ] Weekly: Check system health

---

## 🎨 Content & Marketing

### Privacy Policy
- [ ] Update to mention gallery usage
- [ ] Mention public display of submissions
- [ ] User consent for public sharing
- [ ] Data retention policy
- [ ] Right to delete submissions

### Contest Terms
- [ ] Contest rules clearly stated
- [ ] Prize details clear ($4.99 value)
- [ ] Winner selection process explained
- [ ] Weekly schedule (Monday-Sunday)
- [ ] Winner announcement timing

### Social Media
- [ ] Prepare launch announcement
- [ ] Share example transformations
- [ ] Promote contest system
- [ ] Encourage user participation

---

## ✅ Final Pre-Launch Checklist

### Critical Items (Must Complete)
- [ ] SQL schema executed successfully
- [ ] All 4 tables exist in database
- [ ] Storage bucket created and public
- [ ] RPC functions working
- [ ] Tested full share-to-gallery flow
- [ ] Tested voting (authenticated)
- [ ] Tested voting (anonymous)
- [ ] Anti-cheat working (can't vote twice)
- [ ] Production environment variables set
- [ ] Supabase redirect URLs updated

### Recommended Items
- [ ] Tested on mobile devices
- [ ] Privacy policy updated
- [ ] Contest rules documented
- [ ] Winner selection process decided
- [ ] Prize distribution planned
- [ ] Marketing materials prepared
- [ ] Analytics/monitoring set up

### Optional Items
- [ ] Moderation dashboard created
- [ ] Automated winner selection (Edge Function)
- [ ] Email notifications for winners
- [ ] Social sharing buttons added
- [ ] User profile pages
- [ ] Gallery filters/search

---

## 🎉 Ready to Launch!

When all critical items are checked:

1. **Make it live!** 🚀
2. **Monitor the first few hours** 👀
3. **Be ready to help early users** 💬
4. **Celebrate! You built something amazing!** 🎉

---

## 📞 Troubleshooting Resources

- **Setup Issues:** See `GALLERY_SETUP.md`
- **Quick Start:** See `CONTEST_READY.md`
- **Full Status:** See `PROJECT_STATUS.md`
- **Stripe Issues:** See `STRIPE_SETUP.md`
- **Deploy Issues:** See `DEPLOY.md`
- **Android Issues:** See `ANDROID_LAUNCH.md`

---

## 🏆 Success Metrics

Track these after launch:
- Gallery submissions per day
- Total votes cast
- Contest participation rate
- User retention
- Winner engagement
- Social shares

---

**Good luck with your launch! 🎃👻🧛**

You've built a complete, production-ready app with gallery, contests, and community features. Time to share it with the world! 🌟