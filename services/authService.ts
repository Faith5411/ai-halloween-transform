import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let supabase: SupabaseClient | null = null;

// Initialize Supabase client
export const initSupabase = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('⚠️ Supabase not configured. Authentication will not work.');
    return null;
  }

  if (!supabase) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('✅ Supabase initialized');
  }

  return supabase;
};

// Get current user
export const getCurrentUser = async (): Promise<User | null> => {
  const client = initSupabase();
  if (!client) return null;

  const { data: { user } } = await client.auth.getUser();
  return user;
};

// Get current session
export const getCurrentSession = async (): Promise<Session | null> => {
  const client = initSupabase();
  if (!client) return null;

  const { data: { session } } = await client.auth.getSession();
  return session;
};

// Sign up with email and password
export const signUp = async (email: string, password: string, name?: string) => {
  const client = initSupabase();
  if (!client) throw new Error('Supabase not configured');

  const { data, error } = await client.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: name || email.split('@')[0],
      },
    },
  });

  if (error) throw error;
  return data;
};

// Sign in with email and password
export const signIn = async (email: string, password: string) => {
  const client = initSupabase();
  if (!client) throw new Error('Supabase not configured');

  const { data, error } = await client.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
};

// Sign in with Google OAuth
export const signInWithGoogle = async () => {
  const client = initSupabase();
  if (!client) throw new Error('Supabase not configured');

  const { data, error } = await client.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/`,
    },
  });

  if (error) throw error;
  return data;
};

// Sign out
export const signOut = async () => {
  const client = initSupabase();
  if (!client) throw new Error('Supabase not configured');

  const { error } = await client.auth.signOut();
  if (error) throw error;
};

// Listen to auth state changes
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  const client = initSupabase();
  if (!client) return () => {};

  const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });

  return () => subscription.unsubscribe();
};

// Update user profile
export const updateProfile = async (updates: { name?: string; avatar_url?: string }) => {
  const client = initSupabase();
  if (!client) throw new Error('Supabase not configured');

  const { data, error } = await client.auth.updateUser({
    data: updates,
  });

  if (error) throw error;
  return data;
};

// Get user's Stripe customer ID
export const getStripeCustomerId = async (userId: string): Promise<string | null> => {
  const client = initSupabase();
  if (!client) return null;

  const { data, error } = await client
    .from('users')
    .select('stripe_customer_id')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching Stripe customer ID:', error);
    return null;
  }

  return data?.stripe_customer_id || null;
};

// Set user's Stripe customer ID
export const setStripeCustomerId = async (userId: string, stripeCustomerId: string) => {
  const client = initSupabase();
  if (!client) throw new Error('Supabase not configured');

  const { error } = await client
    .from('users')
    .upsert({
      id: userId,
      stripe_customer_id: stripeCustomerId,
      updated_at: new Date().toISOString(),
    });

  if (error) throw error;
};

// Get user's subscription tier
export const getUserTier = async (userId: string): Promise<'basic' | 'pro' | 'magic'> => {
  const client = initSupabase();
  if (!client) return 'basic';

  const { data, error } = await client
    .from('users')
    .select('subscription_tier')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user tier:', error);
    return 'basic';
  }

  return data?.subscription_tier || 'basic';
};

// Update user's subscription tier
export const updateUserTier = async (userId: string, tier: 'basic' | 'pro' | 'magic') => {
  const client = initSupabase();
  if (!client) throw new Error('Supabase not configured');

  const { error } = await client
    .from('users')
    .upsert({
      id: userId,
      subscription_tier: tier,
      updated_at: new Date().toISOString(),
    });

  if (error) throw error;
};

// Reset password
export const resetPassword = async (email: string) => {
  const client = initSupabase();
  if (!client) throw new Error('Supabase not configured');

  const { error } = await client.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  if (error) throw error;
};

// Update password
export const updatePassword = async (newPassword: string) => {
  const client = initSupabase();
  if (!client) throw new Error('Supabase not configured');

  const { error } = await client.auth.updateUser({
    password: newPassword,
  });

  if (error) throw error;
};

export default {
  initSupabase,
  getCurrentUser,
  getCurrentSession,
  signUp,
  signIn,
  signInWithGoogle,
  signOut,
  onAuthStateChange,
  updateProfile,
  getStripeCustomerId,
  setStripeCustomerId,
  getUserTier,
  updateUserTier,
  resetPassword,
  updatePassword,
};
