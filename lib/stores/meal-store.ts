import { create } from 'zustand';
import { supabase } from './auth-store';

export interface Ingredient {
  id: string;
  ingredient_name: string;
  portion_size: string;
  portion_grams: number;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  ai_detected: boolean;
  confidence_score: number;
  bounding_box?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface Meal {
  id: string;
  user_id: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  meal_name: string;
  meal_description?: string;
  image_url?: string;
  total_calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  water_ml: number;
  confidence_score?: number;
  ai_detected: boolean;
  voice_corrected: boolean;
  correction_transcript?: string;
  ingredients: Ingredient[];
  created_at: string;
  logged_at: string;
  updated_at: string;
}

export interface DailySummary {
  date: string;
  total_calories: number;
  total_protein_g: number;
  total_carbs_g: number;
  total_fat_g: number;
  total_fiber_g: number;
  total_water_ml: number;
  meal_count: number;
  quality_score?: number;
  meals: Meal[];
}

interface MealState {
  meals: Meal[];
  dailySummary: DailySummary | null;
  selectedMeal: Meal | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchTodaysMeals: (userId: string) => Promise<void>;
  fetchMealHistory: (userId: string, startDate: string, endDate: string) => Promise<Meal[]>;
  addMeal: (meal: Omit<Meal, 'id' | 'created_at' | 'updated_at'>) => Promise<Meal>;
  updateMeal: (mealId: string, updates: Partial<Meal>) => Promise<void>;
  deleteMeal: (mealId: string) => Promise<void>;
  selectMeal: (meal: Meal | null) => void;
  calculateDailySummary: (meals: Meal[]) => DailySummary;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useMealStore = create<MealState>((set, get) => ({
  meals: [],
  dailySummary: null,
  selectedMeal: null,
  isLoading: false,
  error: null,

  fetchTodaysMeals: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('meals')
        .select('*, meal_ingredients(*)')
        .eq('user_id', userId)
        .gte('logged_at', `${today}T00:00:00`)
        .lte('logged_at', `${today}T23:59:59`)
        .order('logged_at', { ascending: false });

      if (error) throw error;

      const meals = (data || []).map((meal: any) => ({
        ...meal,
        ingredients: meal.meal_ingredients || [],
      }));

      const dailySummary = get().calculateDailySummary(meals);

      set({
        meals,
        dailySummary,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch meals',
        isLoading: false,
      });
    }
  },

  fetchMealHistory: async (userId: string, startDate: string, endDate: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('meals')
        .select('*, meal_ingredients(*)')
        .eq('user_id', userId)
        .gte('logged_at', startDate)
        .lte('logged_at', endDate)
        .order('logged_at', { ascending: false });

      if (error) throw error;

      const meals = (data || []).map((meal: any) => ({
        ...meal,
        ingredients: meal.meal_ingredients || [],
      }));

      set({ isLoading: false });
      return meals;
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch meal history',
        isLoading: false,
      });
      return [];
    }
  },

  addMeal: async (meal: Omit<Meal, 'id' | 'created_at' | 'updated_at'>) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('meals')
        .insert([meal])
        .select()
        .single();

      if (error) throw error;

      // Add ingredients if provided
      if (meal.ingredients && meal.ingredients.length > 0) {
        const ingredientsData = meal.ingredients.map((ing) => ({
          meal_id: data.id,
          ...ing,
        }));

        const { error: ingError } = await supabase
          .from('meal_ingredients')
          .insert(ingredientsData);

        if (ingError) throw ingError;
      }

      const newMeal = { ...data, ingredients: meal.ingredients || [] };

      set((state) => ({
        meals: [newMeal, ...state.meals],
        isLoading: false,
      }));

      return newMeal;
    } catch (error: any) {
      set({
        error: error.message || 'Failed to add meal',
        isLoading: false,
      });
      throw error;
    }
  },

  updateMeal: async (mealId: string, updates: Partial<Meal>) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('meals')
        .update(updates)
        .eq('id', mealId);

      if (error) throw error;

      set((state) => ({
        meals: state.meals.map((m) =>
          m.id === mealId ? { ...m, ...updates } : m
        ),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || 'Failed to update meal',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteMeal: async (mealId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('meals')
        .delete()
        .eq('id', mealId);

      if (error) throw error;

      set((state) => ({
        meals: state.meals.filter((m) => m.id !== mealId),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || 'Failed to delete meal',
        isLoading: false,
      });
      throw error;
    }
  },

  selectMeal: (meal: Meal | null) => set({ selectedMeal: meal }),

  calculateDailySummary: (meals: Meal[]): DailySummary => {
    const today = new Date().toISOString().split('T')[0];

    const summary = meals.reduce(
      (acc, meal) => ({
        total_calories: acc.total_calories + meal.total_calories,
        total_protein_g: acc.total_protein_g + meal.protein_g,
        total_carbs_g: acc.total_carbs_g + meal.carbs_g,
        total_fat_g: acc.total_fat_g + meal.fat_g,
        total_fiber_g: acc.total_fiber_g + meal.fiber_g,
        total_water_ml: acc.total_water_ml + meal.water_ml,
        meal_count: acc.meal_count + 1,
      }),
      {
        total_calories: 0,
        total_protein_g: 0,
        total_carbs_g: 0,
        total_fat_g: 0,
        total_fiber_g: 0,
        total_water_ml: 0,
        meal_count: 0,
      }
    );

    return {
      date: today,
      ...summary,
      meals,
    };
  },

  setLoading: (loading: boolean) => set({ isLoading: loading }),
  setError: (error: string | null) => set({ error }),
}));
