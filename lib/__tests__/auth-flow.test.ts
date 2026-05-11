import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createClient } from '@supabase/supabase-js';

describe('Authentication and Meal Logging Flow', () => {
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase credentials not configured');
  }

  const client = createClient(supabaseUrl, supabaseKey);
  let testUserId: string | null = null;
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = 'TestPassword123!';

  beforeAll(async () => {
    // Sign out any existing session
    await client.auth.signOut();
  });

  afterAll(async () => {
    // Clean up: delete test user and their data
    if (testUserId) {
      // Delete meals first (due to foreign key constraints)
      await client
        .from('meals')
        .delete()
        .eq('user_id', testUserId);

      // Delete user profile
      await client
        .from('user_profiles')
        .delete()
        .eq('id', testUserId);

      // Delete auth user
      try {
        await client.auth.admin.deleteUser(testUserId);
      } catch (err) {
        console.error('Failed to delete auth user:', err);
      }
    }

    // Sign out
    await client.auth.signOut();
  });

  it('should sign up a new user and create a profile', async () => {
    const { data, error } = await client.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          full_name: 'Test User',
        },
      },
    });

    expect(error).toBeNull();
    expect(data.user).toBeDefined();
    expect(data.user?.email).toBe(testEmail);

    testUserId = data.user?.id || null;
    expect(testUserId).toBeTruthy();

    // Wait a moment for the trigger to create the profile
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Verify user profile was created by the trigger
    const { data: profileData, error: profileError } = await client
      .from('user_profiles')
      .select('*')
      .eq('id', testUserId)
      .single();

    expect(profileError).toBeNull();
    expect(profileData).toBeDefined();
    expect(profileData?.email).toBe(testEmail);
  });

  it('should sign in the user', async () => {
    const { data, error } = await client.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    });

    expect(error).toBeNull();
    expect(data.session).toBeDefined();
    expect(data.user?.email).toBe(testEmail);
  });

  it('should allow the user to log a meal', async () => {
    if (!testUserId) {
      throw new Error('Test user ID not set');
    }

    const mealData = {
      user_id: testUserId,
      meal_type: 'breakfast' as const,
      meal_name: 'Eggs and Toast',
      total_calories: 350,
      protein_g: 15,
      carbs_g: 35,
      fat_g: 12,
      fiber_g: 3,
      water_ml: 0,
      ai_detected: true,
      voice_corrected: false,
      logged_at: new Date().toISOString(),
    };

    const { data: mealInsertData, error: mealError } = await client
      .from('meals')
      .insert([mealData])
      .select()
      .single();

    expect(mealError).toBeNull();
    expect(mealInsertData).toBeDefined();
    expect(mealInsertData?.meal_name).toBe('Eggs and Toast');
    expect(mealInsertData?.total_calories).toBe(350);

    // Verify meal was inserted
    const mealId = mealInsertData?.id;

    // Add ingredients to the meal
    const ingredientsData = [
      {
        meal_id: mealId,
        ingredient_name: 'Eggs',
        portion_size: '2 large',
        portion_grams: 100,
        calories: 155,
        protein_g: 13,
        carbs_g: 1,
        fat_g: 11,
        fiber_g: 0,
        ai_detected: true,
        confidence_score: 0.95,
      },
      {
        meal_id: mealId,
        ingredient_name: 'Toast',
        portion_size: '2 slices',
        portion_grams: 60,
        calories: 195,
        protein_g: 6,
        carbs_g: 34,
        fat_g: 2,
        fiber_g: 3,
        ai_detected: true,
        confidence_score: 0.88,
      },
    ];

    const { error: ingredientError } = await client
      .from('meal_ingredients')
      .insert(ingredientsData);

    expect(ingredientError).toBeNull();

    // Verify ingredients were inserted
    const { data: ingredientsVerify, error: verifyError } = await client
      .from('meal_ingredients')
      .select('*')
      .eq('meal_id', mealId);

    expect(verifyError).toBeNull();
    expect(ingredientsVerify).toHaveLength(2);
  });

  it('should retrieve user meals', async () => {
    if (!testUserId) {
      throw new Error('Test user ID not set');
    }

    const { data: mealsData, error: mealsError } = await client
      .from('meals')
      .select('*, meal_ingredients(*)')
      .eq('user_id', testUserId);

    expect(mealsError).toBeNull();
    expect(mealsData).toBeDefined();
    expect(mealsData?.length).toBeGreaterThan(0);

    // Verify meal has ingredients
    const meal = mealsData?.[0];
    expect(meal?.meal_ingredients).toBeDefined();
    expect(meal?.meal_ingredients?.length).toBeGreaterThan(0);
  });
});
