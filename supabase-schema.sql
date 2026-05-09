-- NutriVibe AI - Supabase Database Schema

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgvector";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  age INTEGER,
  height_cm INTEGER,
  weight_kg DECIMAL(5, 2),
  activity_level TEXT DEFAULT 'moderate', -- sedentary, light, moderate, active, very_active
  goal TEXT DEFAULT 'maintain', -- lose_weight, build_muscle, maintain, improve_energy, high_protein, custom
  daily_calorie_target INTEGER DEFAULT 2200,
  daily_protein_target INTEGER DEFAULT 100,
  daily_carbs_target INTEGER DEFAULT 250,
  daily_fat_target INTEGER DEFAULT 75,
  daily_water_target DECIMAL(5, 2) DEFAULT 2.0,
  daily_fiber_target INTEGER DEFAULT 25,
  subscription_tier TEXT DEFAULT 'free', -- free, pro
  subscription_start_date TIMESTAMP,
  subscription_end_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Meals table
CREATE TABLE IF NOT EXISTS public.meals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  meal_type TEXT NOT NULL, -- breakfast, lunch, dinner, snack
  meal_name TEXT NOT NULL,
  meal_description TEXT,
  image_url TEXT,
  image_storage_path TEXT,
  total_calories INTEGER NOT NULL,
  protein_g DECIMAL(6, 2) NOT NULL,
  carbs_g DECIMAL(6, 2) NOT NULL,
  fat_g DECIMAL(6, 2) NOT NULL,
  fiber_g DECIMAL(6, 2) DEFAULT 0,
  water_ml DECIMAL(7, 2) DEFAULT 0,
  confidence_score DECIMAL(3, 2), -- 0-1 confidence from AI
  ai_detected BOOLEAN DEFAULT FALSE,
  voice_corrected BOOLEAN DEFAULT FALSE,
  correction_transcript TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  logged_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Meal ingredients table
CREATE TABLE IF NOT EXISTS public.meal_ingredients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meal_id UUID NOT NULL REFERENCES public.meals(id) ON DELETE CASCADE,
  ingredient_name TEXT NOT NULL,
  portion_size TEXT,
  portion_grams DECIMAL(7, 2),
  calories INTEGER,
  protein_g DECIMAL(6, 2),
  carbs_g DECIMAL(6, 2),
  fat_g DECIMAL(6, 2),
  fiber_g DECIMAL(6, 2),
  ai_detected BOOLEAN DEFAULT FALSE,
  confidence_score DECIMAL(3, 2),
  bounding_box JSONB, -- {x, y, width, height} for visualization
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Daily nutrition summary
CREATE TABLE IF NOT EXISTS public.daily_summaries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  total_calories INTEGER DEFAULT 0,
  total_protein_g DECIMAL(7, 2) DEFAULT 0,
  total_carbs_g DECIMAL(7, 2) DEFAULT 0,
  total_fat_g DECIMAL(7, 2) DEFAULT 0,
  total_fiber_g DECIMAL(7, 2) DEFAULT 0,
  total_water_ml DECIMAL(8, 2) DEFAULT 0,
  meal_count INTEGER DEFAULT 0,
  steps INTEGER DEFAULT 0,
  quality_score DECIMAL(3, 1),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, date)
);

-- Nutrition insights/recommendations
CREATE TABLE IF NOT EXISTS public.ai_insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  insight_type TEXT NOT NULL, -- recommendation, warning, achievement, trend
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT DEFAULT 'normal', -- low, normal, high
  data JSONB, -- Additional data for the insight
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP
);

-- Barcode/product scan history
CREATE TABLE IF NOT EXISTS public.product_scans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  barcode TEXT NOT NULL,
  product_name TEXT NOT NULL,
  brand TEXT,
  calories_per_serving INTEGER,
  protein_g DECIMAL(6, 2),
  carbs_g DECIMAL(6, 2),
  fat_g DECIMAL(6, 2),
  fiber_g DECIMAL(6, 2),
  serving_size TEXT,
  product_image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_scanned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subscription/payment records
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE,
  plan_type TEXT NOT NULL, -- free, pro
  status TEXT DEFAULT 'active', -- active, canceled, expired
  start_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  end_date TIMESTAMP,
  renewal_date TIMESTAMP,
  auto_renew BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Connected health apps
CREATE TABLE IF NOT EXISTS public.connected_apps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  app_name TEXT NOT NULL, -- apple_health, google_fit, fitbit, etc.
  is_connected BOOLEAN DEFAULT FALSE,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMP,
  last_sync_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, app_name)
);

-- User preferences
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE UNIQUE,
  notifications_enabled BOOLEAN DEFAULT TRUE,
  reminder_time TIME DEFAULT '09:00:00',
  theme TEXT DEFAULT 'dark', -- light, dark, auto
  language TEXT DEFAULT 'en',
  dietary_restrictions JSONB DEFAULT '[]', -- vegetarian, vegan, gluten_free, etc.
  allergens JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_meals_user_id ON public.meals(user_id);
CREATE INDEX IF NOT EXISTS idx_meals_logged_at ON public.meals(logged_at);
CREATE INDEX IF NOT EXISTS idx_meals_user_logged ON public.meals(user_id, logged_at);
CREATE INDEX IF NOT EXISTS idx_daily_summaries_user_date ON public.daily_summaries(user_id, date);
CREATE INDEX IF NOT EXISTS idx_ai_insights_user_id ON public.ai_insights(user_id);
CREATE INDEX IF NOT EXISTS idx_product_scans_user_id ON public.product_scans(user_id);
CREATE INDEX IF NOT EXISTS idx_product_scans_barcode ON public.product_scans(barcode);
CREATE INDEX IF NOT EXISTS idx_connected_apps_user_id ON public.connected_apps(user_id);

-- Create RLS (Row Level Security) policies
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connected_apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view their own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Meals policies
CREATE POLICY "Users can view their own meals" ON public.meals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own meals" ON public.meals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own meals" ON public.meals
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own meals" ON public.meals
  FOR DELETE USING (auth.uid() = user_id);

-- Meal ingredients policies
CREATE POLICY "Users can view ingredients of their meals" ON public.meal_ingredients
  FOR SELECT USING (
    meal_id IN (SELECT id FROM public.meals WHERE user_id = auth.uid())
  );

-- Daily summaries policies
CREATE POLICY "Users can view their own daily summaries" ON public.daily_summaries
  FOR SELECT USING (auth.uid() = user_id);

-- AI insights policies
CREATE POLICY "Users can view their own insights" ON public.ai_insights
  FOR SELECT USING (auth.uid() = user_id);

-- Product scans policies
CREATE POLICY "Users can view their own product scans" ON public.product_scans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own product scans" ON public.product_scans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Subscriptions policies
CREATE POLICY "Users can view their own subscriptions" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Connected apps policies
CREATE POLICY "Users can view their own connected apps" ON public.connected_apps
  FOR SELECT USING (auth.uid() = user_id);

-- User preferences policies
CREATE POLICY "Users can view their own preferences" ON public.user_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" ON public.user_preferences
  FOR UPDATE USING (auth.uid() = user_id);

-- Create storage bucket for meal images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('meal-images', 'meal-images', true)
ON CONFLICT DO NOTHING;

-- Storage policies for meal images
CREATE POLICY "Users can upload meal images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'meal-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own meal images" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'meal-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meals_updated_at BEFORE UPDATE ON public.meals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_summaries_updated_at BEFORE UPDATE ON public.daily_summaries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_connected_apps_updated_at BEFORE UPDATE ON public.connected_apps
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  
  INSERT INTO public.user_preferences (user_id)
  VALUES (new.id);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

