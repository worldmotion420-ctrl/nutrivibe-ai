-- ============================================
-- NutriVibe AI - Supabase Database Schema
-- ============================================
-- Copy and paste this entire SQL code into your Supabase SQL Editor
-- and run it to create all required tables and security policies.

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  age INTEGER,
  height_cm INTEGER,
  weight_kg DECIMAL(5, 2),
  activity_level TEXT DEFAULT 'moderate',
  goal TEXT DEFAULT 'weight_loss',
  daily_calorie_target INTEGER DEFAULT 2000,
  daily_protein_target INTEGER DEFAULT 150,
  daily_carbs_target INTEGER DEFAULT 200,
  daily_fat_target INTEGER DEFAULT 65,
  subscription_tier TEXT DEFAULT 'free',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create meals table
CREATE TABLE IF NOT EXISTS meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  meal_name TEXT NOT NULL,
  meal_description TEXT,
  image_url TEXT,
  total_calories DECIMAL(8, 2) DEFAULT 0,
  protein_g DECIMAL(8, 2) DEFAULT 0,
  carbs_g DECIMAL(8, 2) DEFAULT 0,
  fat_g DECIMAL(8, 2) DEFAULT 0,
  fiber_g DECIMAL(8, 2) DEFAULT 0,
  water_ml INTEGER DEFAULT 0,
  confidence_score DECIMAL(3, 2),
  ai_detected BOOLEAN DEFAULT FALSE,
  voice_corrected BOOLEAN DEFAULT FALSE,
  correction_transcript TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create meal_ingredients table
CREATE TABLE IF NOT EXISTS meal_ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_id UUID NOT NULL REFERENCES meals(id) ON DELETE CASCADE,
  ingredient_name TEXT NOT NULL,
  portion_size TEXT NOT NULL,
  portion_grams DECIMAL(8, 2) DEFAULT 100,
  calories DECIMAL(8, 2) DEFAULT 0,
  protein_g DECIMAL(8, 2) DEFAULT 0,
  carbs_g DECIMAL(8, 2) DEFAULT 0,
  fat_g DECIMAL(8, 2) DEFAULT 0,
  fiber_g DECIMAL(8, 2) DEFAULT 0,
  ai_detected BOOLEAN DEFAULT FALSE,
  confidence_score DECIMAL(3, 2) DEFAULT 0.8,
  bounding_box JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_meals_user_id ON meals(user_id);
CREATE INDEX IF NOT EXISTS idx_meals_logged_at ON meals(logged_at);
CREATE INDEX IF NOT EXISTS idx_meal_ingredients_meal_id ON meal_ingredients(meal_id);

-- Enable Row Level Security (RLS)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_ingredients ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_profiles
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for meals
CREATE POLICY "Users can view their own meals" ON meals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own meals" ON meals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own meals" ON meals
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own meals" ON meals
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for meal_ingredients
CREATE POLICY "Users can view ingredients of their meals" ON meal_ingredients
  FOR SELECT USING (
    meal_id IN (
      SELECT id FROM meals WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert ingredients for their meals" ON meal_ingredients
  FOR INSERT WITH CHECK (
    meal_id IN (
      SELECT id FROM meals WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update ingredients of their meals" ON meal_ingredients
  FOR UPDATE USING (
    meal_id IN (
      SELECT id FROM meals WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete ingredients of their meals" ON meal_ingredients
  FOR DELETE USING (
    meal_id IN (
      SELECT id FROM meals WHERE user_id = auth.uid()
    )
  );

-- Create a trigger to automatically create user_profiles when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
