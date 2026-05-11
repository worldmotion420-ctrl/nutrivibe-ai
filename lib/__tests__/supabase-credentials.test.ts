import { describe, it, expect } from 'vitest';
import { createClient } from '@supabase/supabase-js';

describe('Supabase Credentials Validation', () => {
  it('should have valid Supabase URL and Anon Key configured', () => {
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

    expect(supabaseUrl).toBeDefined();
    expect(supabaseKey).toBeDefined();
    expect(supabaseUrl).toMatch(/^https:\/\//);
    expect(supabaseKey?.length).toBeGreaterThan(0);
  });

  it('should initialize Supabase client successfully', () => {
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials not configured');
    }

    const client = createClient(supabaseUrl, supabaseKey);
    expect(client).toBeDefined();
    expect(client.auth).toBeDefined();
  });

  it('should be able to call Supabase auth methods', async () => {
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials not configured');
    }

    const client = createClient(supabaseUrl, supabaseKey);
    
    // Test that we can call getSession without errors
    const { data, error } = await client.auth.getSession();
    
    // It's OK if there's no session (user not logged in)
    // But the call should succeed without "invalid api key" error
    expect(error).toBeNull();
    expect(data).toBeDefined();
  });
});
