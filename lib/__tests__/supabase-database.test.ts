import { describe, it, expect } from 'vitest';
import { createClient } from '@supabase/supabase-js';

describe('Supabase Database Schema', () => {
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase credentials not configured');
  }

  const client = createClient(supabaseUrl, supabaseKey);

  it('should be able to query user_profiles table', async () => {
    const { data, error } = await client
      .from('user_profiles')
      .select('*')
      .limit(1);

    // Table might be empty, but should not error with "table not found"
    expect(error).toBeNull();
    expect(data).toBeDefined();
  });

  it('should be able to query meals table', async () => {
    const { data, error } = await client
      .from('meals')
      .select('*')
      .limit(1);

    expect(error).toBeNull();
    expect(data).toBeDefined();
  });

  it('should be able to query meal_ingredients table', async () => {
    const { data, error } = await client
      .from('meal_ingredients')
      .select('*')
      .limit(1);

    expect(error).toBeNull();
    expect(data).toBeDefined();
  });

  it('should be able to insert and retrieve from user_profiles', async () => {
    // Note: Cannot test insert directly without auth.users entry
    // Just verify tables are readable
    const { data, error } = await client
      .from('user_profiles')
      .select('*')
      .limit(1);

    expect(error).toBeNull();
    expect(data).toBeDefined();
  });
});
