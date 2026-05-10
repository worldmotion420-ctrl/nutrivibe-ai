import { create } from 'zustand';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Polyfill for web platform
if (Platform.OS === 'web' && typeof window !== 'undefined') {
  // Web platform polyfill
  (global as any).window = global as any;
}

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  age: number | null;
  height_cm: number | null;
  weight_kg: number | null;
  activity_level: string;
  goal: string;
  daily_calorie_target: number;
  daily_protein_target: number;
  daily_carbs_target: number;
  daily_fat_target: number;
  subscription_tier: string;
}

interface AuthState {
  user: UserProfile | null;
  session: any | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  
  // Actions
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  restoreSession: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// Initialize Supabase client
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

let supabase: any = null;

if (supabaseUrl && supabaseKey) {
  // Use AsyncStorage only on native platforms, not on web
  const storage = Platform.OS !== 'web' && AsyncStorage ? AsyncStorage : undefined;
  
  supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      storage: storage as any,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,

  signUp: async (email: string, password: string, fullName: string) => {
    set({ isLoading: true, error: null });
    try {
      if (!supabase) throw new Error('Supabase not initialized');
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      // Fetch user profile
      if (data.user) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        set({
          user: profile,
          session: data.session,
          isAuthenticated: !!data.session,
          isLoading: false,
        });
      }
    } catch (error: any) {
      set({
        error: error.message || 'Sign up failed',
        isLoading: false,
      });
      throw error;
    }
  },

  signIn: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      if (!supabase) throw new Error('Supabase not initialized');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Fetch user profile
      if (data.user) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        set({
          user: profile,
          session: data.session,
          isAuthenticated: true,
          isLoading: false,
        });
      }
    } catch (error: any) {
      set({
        error: error.message || 'Sign in failed',
        isLoading: false,
      });
      throw error;
    }
  },

  signOut: async () => {
    set({ isLoading: true, error: null });
    try {
      if (!supabase) throw new Error('Supabase not initialized');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      set({
        user: null,
        session: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Sign out failed',
        isLoading: false,
      });
      throw error;
    }
  },

  restoreSession: async () => {
    set({ isLoading: true });
    try {
      if (!supabase) throw new Error('Supabase not initialized');
      const { data, error } = await supabase.auth.getSession();

      if (error) throw error;

      if (data.session) {
        // Fetch user profile
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', data.session.user.id)
          .single();

        set({
          user: profile,
          session: data.session,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({
          user: null,
          session: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error: any) {
      set({
        error: error.message || 'Session restore failed',
        isLoading: false,
      });
    }
  },

  updateProfile: async (updates: Partial<UserProfile>) => {
    set({ isLoading: true, error: null });
    try {
      if (!supabase) throw new Error('Supabase not initialized');
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.user) throw new Error('No user session');

      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', session.session.user.id)
        .select()
        .single();

      if (error) throw error;

      set({
        user: data,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Profile update failed',
        isLoading: false,
      });
      throw error;
    }
  },

  setLoading: (loading: boolean) => set({ isLoading: loading }),
  setError: (error: string | null) => set({ error }),
}));

export { supabase };
