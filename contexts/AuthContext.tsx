import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import {
  getCurrentUser,
  signIn,
  signUp,
  signOut,
  signInWithGoogle,
  onAuthStateChange,
  updateProfile,
  getUserTier,
  updateUserTier,
} from '../services/authService';
import type { Tier } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  tier: Tier;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: { name?: string; avatar_url?: string }) => Promise<void>;
  refreshTier: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [tier, setTier] = useState<Tier>('basic');

  // Load user tier
  const loadUserTier = async (userId: string) => {
    try {
      const userTier = await getUserTier(userId);
      setTier(userTier);
    } catch (error) {
      console.error('Error loading user tier:', error);
      setTier('basic');
    }
  };

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        if (currentUser) {
          await loadUserTier(currentUser.id);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (newUser) => {
      setUser(newUser);
      if (newUser) {
        await loadUserTier(newUser.id);
      } else {
        setTier('basic');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignIn = async (email: string, password: string) => {
    try {
      const { user: newUser } = await signIn(email, password);
      if (newUser) {
        await loadUserTier(newUser.id);
      }
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const handleSignUp = async (email: string, password: string, name?: string) => {
    try {
      await signUp(email, password, name);
      // User will be set via onAuthStateChange
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const handleSignInWithGoogle = async () => {
    try {
      await signInWithGoogle();
      // User will be set via onAuthStateChange after redirect
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
      setTier('basic');
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const handleUpdateProfile = async (updates: { name?: string; avatar_url?: string }) => {
    try {
      await updateProfile(updates);
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  const refreshTier = async () => {
    if (user) {
      await loadUserTier(user.id);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    tier,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signInWithGoogle: handleSignInWithGoogle,
    signOut: handleSignOut,
    updateProfile: handleUpdateProfile,
    refreshTier,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
