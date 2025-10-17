import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

let supabase: SupabaseClient | null = null;

// Initialize Supabase client
const getSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('⚠️ Supabase not configured. Gallery features will not work.');
    return null;
  }

  if (!supabase) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  }

  return supabase;
};

// Gallery Item Type
export interface GalleryItem {
  id: string;
  user_id: string;
  user_email: string | null;
  image_url: string;
  before_image_url: string | null;
  thumbnail_url: string | null;
  costume_name: string | null;
  prompt: string | null;
  is_video: boolean;
  votes_count: number;
  views_count: number;
  is_public: boolean;
  is_featured: boolean;
  contest_week: string;
  is_winner: boolean;
  winner_tier: string | null;
  moderation_status: 'pending' | 'approved' | 'rejected';
  reported_count: number;
  created_at: string;
  updated_at: string;
}

// Contest Type
export interface WeeklyContest {
  id: string;
  contest_week: string;
  start_date: string;
  end_date: string;
  winner_id: string | null;
  winner_announced_at: string | null;
  total_entries: number;
  total_votes: number;
  prize_tier: string;
  prize_claimed: boolean;
  created_at: string;
}

// Fetch gallery items with filtering
export const fetchGalleryItems = async (
  filter: 'trending' | 'recent' | 'winners' | 'contest' = 'trending',
  limit: number = 20,
  offset: number = 0
): Promise<GalleryItem[]> => {
  const client = getSupabaseClient();
  if (!client) return [];

  let query = client
    .from('gallery')
    .select('*')
    .eq('is_public', true)
    .eq('moderation_status', 'approved');

  // Apply filters
  if (filter === 'trending') {
    query = query
      .order('votes_count', { ascending: false })
      .order('created_at', { ascending: false });
  } else if (filter === 'recent') {
    query = query.order('created_at', { ascending: false });
  } else if (filter === 'winners') {
    query = query
      .eq('is_winner', true)
      .order('created_at', { ascending: false });
  } else if (filter === 'contest') {
    const contestWeek = await getCurrentContestWeek();
    query = query
      .eq('contest_week', contestWeek)
      .order('votes_count', { ascending: false });
  }

  query = query.range(offset, offset + limit - 1);

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching gallery items:', error);
    return [];
  }

  return data || [];
};

// Submit transformation to gallery
export const submitToGallery = async (
  userId: string,
  userEmail: string,
  imageUrl: string,
  costumeName: string,
  prompt?: string,
  isVideo: boolean = false,
  thumbnailUrl?: string,
  beforeImageUrl?: string
): Promise<{ success: boolean; error?: string; itemId?: string }> => {
  const client = getSupabaseClient();
  if (!client) return { success: false, error: 'Supabase not configured' };

  const { data, error } = await client
    .from('gallery')
    .insert({
      user_id: userId,
      user_email: userEmail,
      image_url: imageUrl,
      before_image_url: beforeImageUrl,
      thumbnail_url: thumbnailUrl,
      costume_name: costumeName,
      prompt: prompt,
      is_video: isVideo,
      is_public: true,
      moderation_status: 'approved', // Auto-approve for now, add moderation later
    })
    .select()
    .single();

  if (error) {
    console.error('Error submitting to gallery:', error);
    return { success: false, error: error.message };
  }

  return { success: true, itemId: data.id };
};

// Vote on a gallery item
export const voteOnItem = async (
  galleryId: string,
  userId?: string,
  voterIp?: string
): Promise<{ success: boolean; error?: string }> => {
  const client = getSupabaseClient();
  if (!client) return { success: false, error: 'Supabase not configured' };

  // Check if user already voted
  const hasVoted = await checkUserVoted(galleryId, userId, voterIp);
  if (hasVoted) {
    return { success: false, error: 'Already voted' };
  }

  // Insert vote
  const { error: voteError } = await client.from('gallery_votes').insert({
    gallery_id: galleryId,
    user_id: userId || null,
    voter_ip: voterIp || null,
  });

  if (voteError) {
    console.error('Error voting:', voteError);
    return { success: false, error: voteError.message };
  }

  // Increment vote count using RPC function
  const { error: incrementError } = await client.rpc(
    'increment_gallery_votes',
    {
      gallery_item_id: galleryId,
    }
  );

  if (incrementError) {
    console.error('Error incrementing vote count:', incrementError);
  }

  return { success: true };
};

// Check if user has voted
export const checkUserVoted = async (
  galleryId: string,
  userId?: string,
  voterIp?: string
): Promise<boolean> => {
  const client = getSupabaseClient();
  if (!client) return false;

  let query = client
    .from('gallery_votes')
    .select('id')
    .eq('gallery_id', galleryId);

  if (userId) {
    query = query.eq('user_id', userId);
  } else if (voterIp) {
    query = query.eq('voter_ip', voterIp);
  } else {
    return false;
  }

  const { data, error } = await query.single();

  if (error && error.code !== 'PGRST116') {
    // PGRST116 = no rows returned
    console.error('Error checking vote:', error);
  }

  return !!data;
};

// Remove vote from a gallery item
export const removeVote = async (
  galleryId: string,
  userId?: string,
  voterIp?: string
): Promise<{ success: boolean; error?: string }> => {
  const client = getSupabaseClient();
  if (!client) return { success: false, error: 'Supabase not configured' };

  let query = client.from('gallery_votes').delete().eq('gallery_id', galleryId);

  if (userId) {
    query = query.eq('user_id', userId);
  } else if (voterIp) {
    query = query.eq('voter_ip', voterIp);
  } else {
    return { success: false, error: 'No user or IP provided' };
  }

  const { error: deleteError } = await query;

  if (deleteError) {
    console.error('Error removing vote:', deleteError);
    return { success: false, error: deleteError.message };
  }

  // Decrement vote count using RPC function
  const { error: decrementError } = await client.rpc(
    'decrement_gallery_votes',
    {
      gallery_item_id: galleryId,
    }
  );

  if (decrementError) {
    console.error('Error decrementing vote count:', decrementError);
  }

  return { success: true };
};

// Increment view count
export const incrementViews = async (galleryId: string): Promise<void> => {
  const client = getSupabaseClient();
  if (!client) return;

  await client.rpc('increment_gallery_views', {
    gallery_item_id: galleryId,
  });
};

// Get current contest week
export const getCurrentContestWeek = async (): Promise<string> => {
  const client = getSupabaseClient();
  if (!client) return '';

  const { data, error } = await client.rpc('get_current_contest_week');

  if (error) {
    console.error('Error getting contest week:', error);
    return '';
  }

  return data || '';
};

// Get current contest details
export const getCurrentContest = async (): Promise<WeeklyContest | null> => {
  const client = getSupabaseClient();
  if (!client) return null;

  const contestWeek = await getCurrentContestWeek();

  const { data, error } = await client
    .from('weekly_contests')
    .select('*')
    .eq('contest_week', contestWeek)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching contest:', error);
    return null;
  }

  return data || null;
};

// Get weekly top entries
export const getWeeklyTopEntries = async (
  week?: string,
  limit: number = 10
): Promise<GalleryItem[]> => {
  const client = getSupabaseClient();
  if (!client) return [];

  const contestWeek = week || (await getCurrentContestWeek());

  const { data, error } = await client.rpc('get_weekly_top_entries', {
    week: contestWeek,
    limit_count: limit,
  });

  if (error) {
    console.error('Error fetching top entries:', error);
    return [];
  }

  return data || [];
};

// Get user's gallery submissions
export const getUserGalleryItems = async (
  userId: string
): Promise<GalleryItem[]> => {
  const client = getSupabaseClient();
  if (!client) return [];

  const { data, error } = await client
    .from('gallery')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user gallery items:', error);
    return [];
  }

  return data || [];
};

// Delete gallery item
export const deleteGalleryItem = async (
  itemId: string,
  userId: string
): Promise<boolean> => {
  const client = getSupabaseClient();
  if (!client) return false;

  const { error } = await client
    .from('gallery')
    .delete()
    .eq('id', itemId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error deleting gallery item:', error);
    return false;
  }

  return true;
};

// Report gallery item
export const reportGalleryItem = async (
  galleryId: string,
  reporterId: string,
  reason: string,
  details?: string
): Promise<{ success: boolean; error?: string }> => {
  const client = getSupabaseClient();
  if (!client) return { success: false, error: 'Supabase not configured' };

  const { error } = await client.from('gallery_reports').insert({
    gallery_id: galleryId,
    reporter_id: reporterId,
    reason: reason,
    details: details,
    status: 'pending',
  });

  if (error) {
    console.error('Error reporting item:', error);
    return { success: false, error: error.message };
  }

  // Increment reported count
  const { data: currentItem } = await client
    .from('gallery')
    .select('reported_count')
    .eq('id', galleryId)
    .maybeSingle();

  if (currentItem) {
    await client
      .from('gallery')
      .update({ reported_count: currentItem.reported_count + 1 })
      .eq('id', galleryId);
  }

  return { success: true };
};

// Upload image to Supabase storage
export const uploadImageToGallery = async (
  userId: string,
  file: File | Blob,
  fileName: string
): Promise<{ success: boolean; url?: string; error?: string }> => {
  const client = getSupabaseClient();
  if (!client) return { success: false, error: 'Supabase not configured' };

  const filePath = `${userId}/${Date.now()}-${fileName}`;

  const { data, error } = await client.storage
    .from('gallery')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Error uploading image:', error);
    return { success: false, error: error.message };
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = client.storage.from('gallery').getPublicUrl(data.path);

  return { success: true, url: publicUrl };
};

// Get contest winners (all time)
export const getContestWinners = async (
  limit: number = 10
): Promise<GalleryItem[]> => {
  const client = getSupabaseClient();
  if (!client) return [];

  const { data, error } = await client
    .from('gallery')
    .select('*')
    .eq('is_winner', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching winners:', error);
    return [];
  }

  return data || [];
};

// Get gallery stats
export const getGalleryStats = async (): Promise<{
  totalTransformations: number;
  totalVotes: number;
  totalWinners: number;
  totalUsers: number;
}> => {
  const client = getSupabaseClient();
  if (!client)
    return {
      totalTransformations: 0,
      totalVotes: 0,
      totalWinners: 0,
      totalUsers: 0,
    };

  // Get total transformations
  const { count: transformations } = await client
    .from('gallery')
    .select('*', { count: 'exact', head: true })
    .eq('is_public', true)
    .eq('moderation_status', 'approved');

  // Get total votes
  const { count: votes } = await client
    .from('gallery_votes')
    .select('*', { count: 'exact', head: true });

  // Get total winners
  const { count: winners } = await client
    .from('gallery')
    .select('*', { count: 'exact', head: true })
    .eq('is_winner', true);

  // Get unique users
  const { data: users } = await client
    .from('gallery')
    .select('user_id')
    .eq('is_public', true)
    .eq('moderation_status', 'approved');

  const uniqueUsers = new Set(users?.map(u => u.user_id) || []).size;

  return {
    totalTransformations: transformations || 0,
    totalVotes: votes || 0,
    totalWinners: winners || 0,
    totalUsers: uniqueUsers,
  };
};

export default {
  fetchGalleryItems,
  submitToGallery,
  voteOnItem,
  checkUserVoted,
  removeVote,
  incrementViews,
  getCurrentContestWeek,
  getCurrentContest,
  getWeeklyTopEntries,
  getUserGalleryItems,
  deleteGalleryItem,
  reportGalleryItem,
  uploadImageToGallery,
  getContestWinners,
  getGalleryStats,
};
