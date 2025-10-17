-- ============================================
-- ADD BEFORE IMAGE TO GALLERY TABLE
-- ============================================
-- This migration adds a before_image_url column to store the original photo
-- before transformation, allowing users to see the before/after comparison
-- ============================================

-- Add before_image_url column to gallery table
ALTER TABLE public.gallery
ADD COLUMN IF NOT EXISTS before_image_url TEXT;

-- Add comment for documentation
COMMENT ON COLUMN public.gallery.before_image_url IS 'URL of the original image before transformation for before/after comparison';