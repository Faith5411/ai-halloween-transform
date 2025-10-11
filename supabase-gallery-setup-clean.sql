-- ============================================
-- AI HALLOWEEN TRANSFORM - GALLERY SETUP (CLEAN VERSION)
-- ============================================
-- Safe to run multiple times - checks for existing objects
-- ============================================

-- Enable UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. DROP EXISTING OBJECTS (if you want to start fresh)
-- ============================================
-- Uncomment these if you want to completely reset:

-- DROP VIEW IF EXISTS contest_winners CASCADE;
-- DROP VIEW IF EXISTS current_contest_entries CASCADE;
-- DROP VIEW IF EXISTS top_transformations CASCADE;
-- DROP TABLE IF EXISTS public.weekly_contests CASCADE;
-- DROP TABLE IF EXISTS public.gallery_reports CASCADE;
-- DROP TABLE IF EXISTS public.gallery_votes CASCADE;
-- DROP TABLE IF EXISTS public.gallery CASCADE;

-- ============================================
-- 2. STORAGE SETUP
-- ============================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'gallery',
  'gallery',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4'];

-- ============================================
-- 3. GALLERY TABLE
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
  contest_week TEXT,
  is_winner BOOLEAN DEFAULT false,
  winner_tier TEXT,
  moderation_status TEXT DEFAULT 'pending' CHECK (moderation_status IN ('pending', 'approved', 'rejected')),
  reported_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_gallery_public ON public.gallery(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_gallery_contest_week ON public.gallery(contest_week);
CREATE INDEX IF NOT EXISTS idx_gallery_votes ON public.gallery(votes_count DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_created ON public.gallery(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_user ON public.gallery(user_id);
CREATE INDEX IF NOT EXISTS idx_gallery_winner ON public.gallery(is_winner) WHERE is_winner = true;

-- ============================================
-- 4. VOTES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.gallery_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gallery_id UUID REFERENCES public.gallery(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  voter_ip TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add constraints if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'gallery_votes_gallery_id_user_id_key') THEN
    ALTER TABLE public.gallery_votes ADD CONSTRAINT gallery_votes_gallery_id_user_id_key UNIQUE(gallery_id, user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'gallery_votes_gallery_id_voter_ip_key') THEN
    ALTER TABLE public.gallery_votes ADD CONSTRAINT gallery_votes_gallery_id_voter_ip_key UNIQUE(gallery_id, voter_ip);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_votes_gallery ON public.gallery_votes(gallery_id);
CREATE INDEX IF NOT EXISTS idx_votes_user ON public.gallery_votes(user_id);

-- ============================================
-- 5. REPORTS TABLE
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
-- 6. WEEKLY CONTESTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.weekly_contests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contest_week TEXT UNIQUE NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  winner_id UUID REFERENCES public.gallery(id) ON DELETE SET NULL,
  winner_announced_at TIMESTAMP WITH TIME ZONE,
  total_entries INT DEFAULT 0,
  total_votes INT DEFAULT 0,
  prize_tier TEXT DEFAULT 'basic',
  prize_claimed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contests_week ON public.weekly_contests(contest_week);
CREATE INDEX IF NOT EXISTS idx_contests_dates ON public.weekly_contests(start_date, end_date);

-- ============================================
-- 7. ENABLE RLS
-- ============================================

ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_contests ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 8. DROP OLD POLICIES (if they exist)
-- ============================================

DROP POLICY IF EXISTS "Public gallery items viewable by everyone" ON public.gallery;
DROP POLICY IF EXISTS "Users can insert own gallery items" ON public.gallery;
DROP POLICY IF EXISTS "Users can update own gallery items" ON public.gallery;
DROP POLICY IF EXISTS "Users can delete own gallery items" ON public.gallery;
DROP POLICY IF EXISTS "Anyone can view votes" ON public.gallery_votes;
DROP POLICY IF EXISTS "Authenticated users can vote" ON public.gallery_votes;
DROP POLICY IF EXISTS "Users can delete own votes" ON public.gallery_votes;
DROP POLICY IF EXISTS "Authenticated users can report" ON public.gallery_reports;
DROP POLICY IF EXISTS "Everyone can view contests" ON public.weekly_contests;

-- Storage policies
DROP POLICY IF EXISTS "Gallery images publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload to gallery" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own gallery images" ON storage.objects;

-- ============================================
-- 9. CREATE POLICIES
-- ============================================

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

CREATE POLICY "Anyone can view votes"
  ON public.gallery_votes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can vote"
  ON public.gallery_votes FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can delete own votes"
  ON public.gallery_votes FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can report"
  ON public.gallery_reports FOR INSERT
  WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Everyone can view contests"
  ON public.weekly_contests FOR SELECT
  USING (true);

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
-- 10. FUNCTIONS
-- ============================================

CREATE OR REPLACE FUNCTION increment_gallery_votes(gallery_item_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.gallery
  SET votes_count = votes_count + 1,
      updated_at = NOW()
  WHERE id = gallery_item_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrement_gallery_votes(gallery_item_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.gallery
  SET votes_count = GREATEST(votes_count - 1, 0),
      updated_at = NOW()
  WHERE id = gallery_item_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_gallery_views(gallery_item_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.gallery
  SET views_count = views_count + 1
  WHERE id = gallery_item_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_current_contest_week()
RETURNS TEXT AS $$
BEGIN
  RETURN TO_CHAR(NOW(), 'IYYY-IW');
END;
$$ LANGUAGE plpgsql;

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

CREATE OR REPLACE FUNCTION set_contest_week()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.contest_week IS NULL THEN
    NEW.contest_week := get_current_contest_week();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 11. TRIGGERS
-- ============================================

DROP TRIGGER IF EXISTS set_gallery_contest_week ON public.gallery;
CREATE TRIGGER set_gallery_contest_week
  BEFORE INSERT ON public.gallery
  FOR EACH ROW
  EXECUTE FUNCTION set_contest_week();

DROP TRIGGER IF EXISTS update_gallery_timestamp ON public.gallery;
CREATE TRIGGER update_gallery_timestamp
  BEFORE UPDATE ON public.gallery
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 12. SEED DATA
-- ============================================

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
-- DONE! ✅
-- ============================================
