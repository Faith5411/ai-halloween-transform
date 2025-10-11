-- ============================================
-- AI HALLOWEEN TRANSFORM - GALLERY & VOTING SYSTEM
-- ============================================
-- This creates a complete gallery with weekly contests
-- Users share transformations, public votes, weekly winners get free membership
-- ============================================

-- ============================================
-- 1. STORAGE SETUP
-- ============================================

-- Create storage bucket for gallery images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'gallery',
  'gallery',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4']
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 2. GALLERY TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user_email TEXT,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  costume_name TEXT,
  prompt TEXT,
  is_video BOOLEAN DEFAULT false,
  votes_count INT DEFAULT 0,
  views_count INT DEFAULT 0,
  is_public BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  contest_week TEXT, -- Format: 'YYYY-WW' (e.g., '2024-42')
  is_winner BOOLEAN DEFAULT false,
  winner_tier TEXT, -- 'basic', 'pro', 'magic' - prize tier
  moderation_status TEXT DEFAULT 'pending' CHECK (moderation_status IN ('pending', 'approved', 'rejected')),
  reported_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_gallery_public ON public.gallery(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_gallery_contest_week ON public.gallery(contest_week);
CREATE INDEX IF NOT EXISTS idx_gallery_votes ON public.gallery(votes_count DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_created ON public.gallery(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_user ON public.gallery(user_id);
CREATE INDEX IF NOT EXISTS idx_gallery_winner ON public.gallery(is_winner) WHERE is_winner = true;

-- ============================================
-- 3. VOTES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.gallery_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gallery_id UUID REFERENCES public.gallery(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  voter_ip TEXT, -- For anonymous voting
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(gallery_id, user_id), -- Logged in users: one vote per item
  UNIQUE(gallery_id, voter_ip) -- Anonymous: one vote per IP per item
);

CREATE INDEX IF NOT EXISTS idx_votes_gallery ON public.gallery_votes(gallery_id);
CREATE INDEX IF NOT EXISTS idx_votes_user ON public.gallery_votes(user_id);

-- ============================================
-- 4. REPORTS TABLE (Moderation)
-- ============================================

CREATE TABLE IF NOT EXISTS public.gallery_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gallery_id UUID REFERENCES public.gallery(id) ON DELETE CASCADE NOT NULL,
  reporter_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reason TEXT NOT NULL,
  details TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'actioned')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reports_gallery ON public.gallery_reports(gallery_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON public.gallery_reports(status);

-- ============================================
-- 5. WEEKLY CONTESTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.weekly_contests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contest_week TEXT UNIQUE NOT NULL, -- 'YYYY-WW'
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  winner_id UUID REFERENCES public.gallery(id) ON DELETE SET NULL,
  winner_announced_at TIMESTAMP WITH TIME ZONE,
  total_entries INT DEFAULT 0,
  total_votes INT DEFAULT 0,
  prize_tier TEXT DEFAULT 'basic', -- What they won
  prize_claimed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contests_week ON public.weekly_contests(contest_week);
CREATE INDEX IF NOT EXISTS idx_contests_dates ON public.weekly_contests(start_date, end_date);

-- ============================================
-- 6. ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_contests ENABLE ROW LEVEL SECURITY;

-- Gallery Policies
CREATE POLICY "Public gallery items viewable by everyone"
  ON public.gallery FOR SELECT
  USING (is_public = true AND moderation_status = 'approved');

CREATE POLICY "Users can insert own gallery items"
  ON public.gallery FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own gallery items"
  ON public.gallery FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own gallery items"
  ON public.gallery FOR DELETE
  USING (auth.uid() = user_id);

-- Votes Policies
CREATE POLICY "Anyone can view votes"
  ON public.gallery_votes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can vote"
  ON public.gallery_votes FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can delete own votes"
  ON public.gallery_votes FOR DELETE
  USING (auth.uid() = user_id);

-- Reports Policies
CREATE POLICY "Authenticated users can report"
  ON public.gallery_reports FOR INSERT
  WITH CHECK (auth.uid() = reporter_id);

-- Contests Policies
CREATE POLICY "Everyone can view contests"
  ON public.weekly_contests FOR SELECT
  USING (true);

-- ============================================
-- 7. STORAGE POLICIES
-- ============================================

CREATE POLICY "Gallery images publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'gallery');

CREATE POLICY "Authenticated users can upload to gallery"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'gallery' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own gallery images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'gallery' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================
-- 8. FUNCTIONS
-- ============================================

-- Function to increment vote count
CREATE OR REPLACE FUNCTION increment_gallery_votes(gallery_item_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.gallery
  SET votes_count = votes_count + 1,
      updated_at = NOW()
  WHERE id = gallery_item_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to decrement vote count
CREATE OR REPLACE FUNCTION decrement_gallery_votes(gallery_item_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.gallery
  SET votes_count = GREATEST(votes_count - 1, 0),
      updated_at = NOW()
  WHERE id = gallery_item_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_gallery_views(gallery_item_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.gallery
  SET views_count = views_count + 1
  WHERE id = gallery_item_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get current contest week
CREATE OR REPLACE FUNCTION get_current_contest_week()
RETURNS TEXT AS $$
BEGIN
  RETURN TO_CHAR(NOW(), 'IYYY-IW');
END;
$$ LANGUAGE plpgsql;

-- Function to get top items for a contest week
CREATE OR REPLACE FUNCTION get_weekly_top_entries(week TEXT, limit_count INT DEFAULT 10)
RETURNS TABLE (
  id UUID,
  user_email TEXT,
  image_url TEXT,
  costume_name TEXT,
  votes_count INT,
  views_count INT,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    g.id,
    g.user_email,
    g.image_url,
    g.costume_name,
    g.votes_count,
    g.views_count,
    g.created_at
  FROM public.gallery g
  WHERE g.contest_week = week
    AND g.is_public = true
    AND g.moderation_status = 'approved'
  ORDER BY g.votes_count DESC, g.created_at ASC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 9. TRIGGERS
-- ============================================

-- Auto-set contest week on insert
CREATE OR REPLACE FUNCTION set_contest_week()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.contest_week IS NULL THEN
    NEW.contest_week := get_current_contest_week();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_gallery_contest_week
  BEFORE INSERT ON public.gallery
  FOR EACH ROW
  EXECUTE FUNCTION set_contest_week();

-- Auto-update timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_gallery_timestamp
  BEFORE UPDATE ON public.gallery
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 10. VIEWS FOR EASY QUERYING
-- ============================================

-- Top transformations (all time)
CREATE OR REPLACE VIEW top_transformations AS
SELECT
  g.*,
  COALESCE(u.email, g.user_email) as creator_email
FROM public.gallery g
LEFT JOIN auth.users u ON g.user_id = u.id
WHERE g.is_public = true
  AND g.moderation_status = 'approved'
ORDER BY g.votes_count DESC, g.created_at DESC
LIMIT 100;

-- This week's contest entries
CREATE OR REPLACE VIEW current_contest_entries AS
SELECT
  g.*,
  COALESCE(u.email, g.user_email) as creator_email,
  ROW_NUMBER() OVER (ORDER BY g.votes_count DESC, g.created_at ASC) as rank
FROM public.gallery g
LEFT JOIN auth.users u ON g.user_id = u.id
WHERE g.contest_week = get_current_contest_week()
  AND g.is_public = true
  AND g.moderation_status = 'approved'
ORDER BY g.votes_count DESC, g.created_at ASC;

-- Winners gallery
CREATE OR REPLACE VIEW contest_winners AS
SELECT
  g.*,
  wc.contest_week,
  wc.winner_announced_at,
  wc.prize_tier
FROM public.gallery g
JOIN public.weekly_contests wc ON g.id = wc.winner_id
WHERE g.is_winner = true
ORDER BY wc.winner_announced_at DESC;

-- ============================================
-- 11. SEED DATA
-- ============================================

-- Create first contest week (example)
INSERT INTO public.weekly_contests (
  contest_week,
  start_date,
  end_date,
  prize_tier
) VALUES (
  get_current_contest_week(),
  DATE_TRUNC('week', NOW()),
  DATE_TRUNC('week', NOW()) + INTERVAL '7 days',
  'basic'
) ON CONFLICT (contest_week) DO NOTHING;

-- ============================================
-- 12. HELPFUL COMMENTS
-- ============================================

COMMENT ON TABLE public.gallery IS 'User-submitted transformations for public gallery and contests';
COMMENT ON TABLE public.gallery_votes IS 'Votes on gallery items - one vote per user/IP per item';
COMMENT ON TABLE public.weekly_contests IS 'Weekly transformation contests with prizes';
COMMENT ON COLUMN public.gallery.contest_week IS 'ISO week format YYYY-WW for grouping contest entries';
COMMENT ON COLUMN public.gallery.is_winner IS 'True if this transformation won a weekly contest';
COMMENT ON COLUMN public.gallery.winner_tier IS 'Prize tier awarded: basic/pro/magic membership';

-- ============================================
-- SETUP COMPLETE!
-- ============================================
-- Run this SQL in Supabase SQL Editor
-- Then implement the frontend gallery component
-- ============================================
