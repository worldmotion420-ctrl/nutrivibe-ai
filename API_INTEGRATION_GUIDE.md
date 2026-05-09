# NutriVibe AI - API Integration Guide

## Overview

This document outlines the API integrations and backend logic for the NutriVibe AI mobile app.

## Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
# Supabase
EXPO_PUBLIC_SUPABASE_URL=https://lrjktlhjvvbehejgmizq.supabase.co
EXPO_PUBLIC_SUPABASE_ANON=sb_publishable_EslBgRQwN6ZdyKsk8HT6gw_2ZNjecVq

# Groq AI
GROQ_API_KEY=your_groq_api_key_here

# OpenAI (for Whisper)
OPENAI_API_KEY=your_openai_api_key_here

# Stripe (for Premium)
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
STRIPE_SECRET_KEY=your_stripe_secret_key_here
```

## 1. Supabase Integration

### Authentication

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON
);

// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123',
});

// Sign out
await supabase.auth.signOut();
```

### Database Operations

```typescript
// Get user profile
const { data, error } = await supabase
  .from('user_profiles')
  .select('*')
  .eq('id', userId)
  .single();

// Update user profile
const { data, error } = await supabase
  .from('user_profiles')
  .update({
    age: 28,
    weight_kg: 70,
    daily_calorie_target: 2200,
  })
  .eq('id', userId);

// Insert meal
const { data, error } = await supabase
  .from('meals')
  .insert({
    user_id: userId,
    meal_name: 'Chicken with Rice',
    meal_type: 'lunch',
    total_calories: 650,
    total_protein_g: 45,
    total_carbs_g: 60,
    total_fat_g: 15,
  });

// Get daily summary
const { data, error } = await supabase
  .from('daily_nutrition_summary')
  .select('*')
  .eq('user_id', userId)
  .eq('date', today)
  .single();
```

### File Storage

```typescript
// Upload meal image
const { data, error } = await supabase.storage
  .from('meal-images')
  .upload(`${userId}/${Date.now()}.jpg`, imageFile);

// Get public URL
const { data } = supabase.storage
  .from('meal-images')
  .getPublicUrl(`${userId}/image.jpg`);
```

## 2. Groq AI Integration

### Food Recognition

```typescript
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Analyze meal image
const message = await groq.messages.create({
  model: 'mixtral-8x7b-32768',
  max_tokens: 1024,
  messages: [
    {
      role: 'user',
      content: [
        {
          type: 'image',
          source: {
            type: 'base64',
            media_type: 'image/jpeg',
            data: base64ImageData,
          },
        },
        {
          type: 'text',
          text: `Analyze this meal image and provide:
1. Meal name
2. Ingredients with estimated portions
3. Estimated calories and macros (protein, carbs, fat)
4. Confidence score (0-1)
5. Any dietary information

Format as JSON.`,
        },
      ],
    },
  ],
});

// Parse response
const analysis = JSON.parse(message.content[0].text);
```

## 3. OpenAI Whisper Integration

### Speech-to-Text

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Transcribe audio
const transcription = await openai.audio.transcriptions.create({
  file: audioFile,
  model: 'whisper-1',
});

console.log(transcription.text);
```

## 4. Nutrition Calculation

### Macro Calculation

```typescript
interface NutritionData {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
}

function calculateMacroPercentages(nutrition: NutritionData) {
  const totalCalories = nutrition.calories;
  
  return {
    proteinPercent: (nutrition.protein_g * 4 / totalCalories) * 100,
    carbsPercent: (nutrition.carbs_g * 4 / totalCalories) * 100,
    fatPercent: (nutrition.fat_g * 9 / totalCalories) * 100,
  };
}
```

### Daily Summary

```typescript
async function updateDailySummary(userId: string, date: string) {
  // Get all meals for the day
  const { data: meals } = await supabase
    .from('meals')
    .select('*')
    .eq('user_id', userId)
    .gte('created_at', `${date}T00:00:00`)
    .lt('created_at', `${date}T23:59:59`);

  // Calculate totals
  const totals = meals.reduce((acc, meal) => ({
    calories: acc.calories + meal.total_calories,
    protein: acc.protein + meal.total_protein_g,
    carbs: acc.carbs + meal.total_carbs_g,
    fat: acc.fat + meal.total_fat_g,
    fiber: acc.fiber + meal.total_fiber_g,
  }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });

  // Update or insert summary
  await supabase
    .from('daily_nutrition_summary')
    .upsert({
      user_id: userId,
      date,
      total_calories: totals.calories,
      total_protein_g: totals.protein,
      total_carbs_g: totals.carbs,
      total_fat_g: totals.fat,
      total_fiber_g: totals.fiber,
      meal_count: meals.length,
    });
}
```

## 5. AI Insights Generation

```typescript
async function generateInsights(userId: string) {
  // Get last 7 days of data
  const { data: summaries } = await supabase
    .from('daily_nutrition_summary')
    .select('*')
    .eq('user_id', userId)
    .gte('date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
    .order('date', { ascending: false });

  // Get user profile
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();

  // Generate insights using Groq
  const message = await groq.messages.create({
    model: 'mixtral-8x7b-32768',
    max_tokens: 512,
    messages: [
      {
        role: 'user',
        content: `Based on this nutrition data for the past 7 days:
${JSON.stringify(summaries)}

And user profile:
${JSON.stringify(profile)}

Generate 3 actionable nutrition insights. Format as JSON array with title and description.`,
      },
    ],
  });

  const insights = JSON.parse(message.content[0].text);

  // Store insights
  for (const insight of insights) {
    await supabase
      .from('ai_insights')
      .insert({
        user_id: userId,
        insight_type: 'recommendation',
        title: insight.title,
        description: insight.description,
      });
  }
}
```

## 6. Real-time Updates

### Subscribe to Meal Changes

```typescript
supabase
  .from(`meals:user_id=eq.${userId}`)
  .on('*', (payload) => {
    console.log('Meal changed:', payload);
    // Update UI
  })
  .subscribe();
```

### Subscribe to Daily Summary

```typescript
supabase
  .from(`daily_nutrition_summary:user_id=eq.${userId}`)
  .on('*', (payload) => {
    console.log('Daily summary updated:', payload);
    // Update dashboard
  })
  .subscribe();
```

## 7. Push Notifications

### Schedule Reminder

```typescript
import * as Notifications from 'expo-notifications';

async function scheduleReminder(userId: string, time: string) {
  const [hours, minutes] = time.split(':').map(Number);
  
  const trigger = new Date();
  trigger.setHours(hours, minutes, 0);

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Time to log your meal',
      body: 'How was your meal?',
      data: { userId },
    },
    trigger: {
      hour: hours,
      minute: minutes,
      repeats: true,
    },
  });
}
```

## 8. Barcode Scanning

### Lookup Product

```typescript
async function lookupProduct(barcode: string) {
  // Use Open Food Facts API
  const response = await fetch(
    `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
  );
  
  const data = await response.json();
  
  return {
    name: data.product.product_name,
    brand: data.product.brands,
    calories: data.product.nutriments.energy_kcal,
    protein: data.product.nutriments.proteins,
    carbs: data.product.nutriments.carbohydrates,
    fat: data.product.nutriments.fat,
    servingSize: data.product.serving_size,
  };
}
```

## 9. Premium Subscription

### Stripe Integration

```typescript
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create checkout session
const session = await stripe.checkout.sessions.create({
  customer_email: userEmail,
  line_items: [
    {
      price: 'price_pro_monthly', // Your Stripe price ID
      quantity: 1,
    },
  ],
  mode: 'subscription',
  success_url: 'nutrivibe://premium/success',
  cancel_url: 'nutrivibe://premium/cancel',
});

// Verify subscription
const subscription = await stripe.subscriptions.retrieve(
  stripeSubscriptionId
);

if (subscription.status === 'active') {
  // Update user tier
  await supabase
    .from('user_profiles')
    .update({ subscription_tier: 'pro' })
    .eq('id', userId);
}
```

## Testing

### Mock Data

```typescript
const mockMeal = {
  meal_name: 'Grilled Chicken with Brown Rice',
  meal_type: 'lunch',
  total_calories: 650,
  total_protein_g: 45,
  total_carbs_g: 60,
  total_fat_g: 15,
  confidence_score: 0.95,
};

const mockInsight = {
  title: 'Great protein intake!',
  description: 'You met your protein target for 4 out of 7 days this week.',
};
```

## Error Handling

```typescript
try {
  const { data, error } = await supabase
    .from('meals')
    .insert(mealData);

  if (error) {
    console.error('Database error:', error);
    throw new Error(error.message);
  }

  return data;
} catch (err) {
  console.error('Failed to insert meal:', err);
  // Show user-friendly error
}
```

## Performance Optimization

- Cache user profile data locally with AsyncStorage
- Batch database queries where possible
- Compress images before upload
- Use pagination for meal history
- Debounce real-time updates

## Security

- Never expose API keys in client code
- Use environment variables for sensitive data
- Validate all user inputs
- Implement rate limiting
- Use HTTPS for all API calls
- Enable Row Level Security (RLS) on all tables
