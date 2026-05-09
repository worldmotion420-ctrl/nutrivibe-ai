/**
 * Offline Caching Service
 * Manages local data persistence using AsyncStorage
 * Enables offline access to meal history and nutrition data
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================================================
// TYPES
// ============================================================================

export interface CachedMeal {
  id: string;
  name: string;
  items: string[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  timestamp: number;
  imageUri?: string;
  confidence?: number;
  synced: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DailyNutrition {
  date: string;
  meals: CachedMeal[];
  totals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    water: number;
  };
  goals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    water: number;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  age: number;
  height: number;
  weight: number;
  activityLevel: string;
  goals: string[];
  preferences: Record<string, any>;
  lastSyncedAt: number;
}

export interface SyncQueue {
  id: string;
  type: 'meal' | 'profile' | 'delete';
  data: any;
  timestamp: number;
  retries: number;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const CACHE_KEYS = {
  MEALS: 'nutrivibe_meals',
  DAILY_NUTRITION: 'nutrivibe_daily_nutrition',
  USER_PROFILE: 'nutrivibe_user_profile',
  SYNC_QUEUE: 'nutrivibe_sync_queue',
  LAST_SYNC: 'nutrivibe_last_sync',
  CACHE_VERSION: 'nutrivibe_cache_version',
} as const;

const CURRENT_CACHE_VERSION = '1.0.0';
const SYNC_RETRY_LIMIT = 3;
const CACHE_EXPIRY_DAYS = 30;

// ============================================================================
// CACHE SERVICE
// ============================================================================

class OfflineCacheService {
  /**
   * Initialize cache - check version and clear if needed
   */
  async initialize(): Promise<void> {
    try {
      const version = await AsyncStorage.getItem(CACHE_KEYS.CACHE_VERSION);

      if (version !== CURRENT_CACHE_VERSION) {
        await this.clearAll();
        await AsyncStorage.setItem(CACHE_KEYS.CACHE_VERSION, CURRENT_CACHE_VERSION);
        console.log('✓ Cache initialized');
      }
    } catch (error) {
      console.error('Cache initialization error:', error);
    }
  }

  // ========================================================================
  // MEAL OPERATIONS
  // ========================================================================

  /**
   * Save meal to cache
   */
  async saveMeal(meal: CachedMeal): Promise<void> {
    try {
      const meals = await this.getMeals();
      const existingIndex = meals.findIndex((m) => m.id === meal.id);

      if (existingIndex >= 0) {
        meals[existingIndex] = meal;
      } else {
        meals.push(meal);
      }

      // Keep only last 30 days
      const thirtyDaysAgo = Date.now() - CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
      const filtered = meals.filter((m) => m.timestamp > thirtyDaysAgo);

      await AsyncStorage.setItem(CACHE_KEYS.MEALS, JSON.stringify(filtered));
      console.log(`✓ Meal saved: ${meal.name}`);
    } catch (error) {
      console.error('Error saving meal:', error);
    }
  }

  /**
   * Get all cached meals
   */
  async getMeals(): Promise<CachedMeal[]> {
    try {
      const data = await AsyncStorage.getItem(CACHE_KEYS.MEALS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting meals:', error);
      return [];
    }
  }

  /**
   * Get meals for specific date
   */
  async getMealsByDate(date: string): Promise<CachedMeal[]> {
    try {
      const meals = await this.getMeals();
      const dayStart = new Date(date).getTime();
      const dayEnd = dayStart + 24 * 60 * 60 * 1000;

      return meals.filter((m) => m.timestamp >= dayStart && m.timestamp < dayEnd);
    } catch (error) {
      console.error('Error getting meals by date:', error);
      return [];
    }
  }

  /**
   * Delete meal from cache
   */
  async deleteMeal(mealId: string): Promise<void> {
    try {
      const meals = await this.getMeals();
      const filtered = meals.filter((m) => m.id !== mealId);
      await AsyncStorage.setItem(CACHE_KEYS.MEALS, JSON.stringify(filtered));
      console.log(`✓ Meal deleted: ${mealId}`);
    } catch (error) {
      console.error('Error deleting meal:', error);
    }
  }

  /**
   * Get unsynced meals
   */
  async getUnsyncedMeals(): Promise<CachedMeal[]> {
    try {
      const meals = await this.getMeals();
      return meals.filter((m) => !m.synced);
    } catch (error) {
      console.error('Error getting unsynced meals:', error);
      return [];
    }
  }

  /**
   * Mark meal as synced
   */
  async markMealSynced(mealId: string): Promise<void> {
    try {
      const meals = await this.getMeals();
      const meal = meals.find((m) => m.id === mealId);

      if (meal) {
        meal.synced = true;
        meal.updatedAt = new Date().toISOString();
        await this.saveMeal(meal);
      }
    } catch (error) {
      console.error('Error marking meal synced:', error);
    }
  }

  // ========================================================================
  // DAILY NUTRITION OPERATIONS
  // ========================================================================

  /**
   * Save daily nutrition summary
   */
  async saveDailyNutrition(nutrition: DailyNutrition): Promise<void> {
    try {
      const dailyData = await this.getDailyNutrition();
      const existingIndex = dailyData.findIndex((d) => d.date === nutrition.date);

      if (existingIndex >= 0) {
        dailyData[existingIndex] = nutrition;
      } else {
        dailyData.push(nutrition);
      }

      // Keep only last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - CACHE_EXPIRY_DAYS);
      const filtered = dailyData.filter((d) => new Date(d.date) > thirtyDaysAgo);

      await AsyncStorage.setItem(CACHE_KEYS.DAILY_NUTRITION, JSON.stringify(filtered));
      console.log(`✓ Daily nutrition saved: ${nutrition.date}`);
    } catch (error) {
      console.error('Error saving daily nutrition:', error);
    }
  }

  /**
   * Get all daily nutrition summaries
   */
  async getDailyNutrition(): Promise<DailyNutrition[]> {
    try {
      const data = await AsyncStorage.getItem(CACHE_KEYS.DAILY_NUTRITION);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting daily nutrition:', error);
      return [];
    }
  }

  /**
   * Get nutrition for specific date
   */
  async getNutritionByDate(date: string): Promise<DailyNutrition | null> {
    try {
      const dailyData = await this.getDailyNutrition();
      return dailyData.find((d) => d.date === date) || null;
    } catch (error) {
      console.error('Error getting nutrition by date:', error);
      return null;
    }
  }

  /**
   * Calculate daily nutrition from meals
   */
  async calculateDailyNutrition(date: string): Promise<DailyNutrition> {
    try {
      const meals = await this.getMealsByDate(date);

      const totals = {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
        water: 0,
      };

      meals.forEach((meal) => {
        totals.calories += meal.calories;
        totals.protein += meal.protein;
        totals.carbs += meal.carbs;
        totals.fat += meal.fat;
        totals.fiber += meal.fiber;
      });

      // Get user goals
      const profile = await this.getUserProfile();
      const goals = {
        calories: 2200,
        protein: 150,
        carbs: 250,
        fat: 80,
        fiber: 25,
        water: 2000,
      };

      const nutrition: DailyNutrition = {
        date,
        meals,
        totals,
        goals,
      };

      await this.saveDailyNutrition(nutrition);
      return nutrition;
    } catch (error) {
      console.error('Error calculating daily nutrition:', error);
      return {
        date,
        meals: [],
        totals: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, water: 0 },
        goals: { calories: 2200, protein: 150, carbs: 250, fat: 80, fiber: 25, water: 2000 },
      };
    }
  }

  // ========================================================================
  // USER PROFILE OPERATIONS
  // ========================================================================

  /**
   * Save user profile
   */
  async saveUserProfile(profile: UserProfile): Promise<void> {
    try {
      await AsyncStorage.setItem(CACHE_KEYS.USER_PROFILE, JSON.stringify(profile));
      console.log(`✓ User profile saved: ${profile.name}`);
    } catch (error) {
      console.error('Error saving user profile:', error);
    }
  }

  /**
   * Get cached user profile
   */
  async getUserProfile(): Promise<UserProfile | null> {
    try {
      const data = await AsyncStorage.getItem(CACHE_KEYS.USER_PROFILE);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  // ========================================================================
  // SYNC QUEUE OPERATIONS
  // ========================================================================

  /**
   * Add item to sync queue
   */
  async addToSyncQueue(item: Omit<SyncQueue, 'id' | 'timestamp' | 'retries'>): Promise<void> {
    try {
      const queue = await this.getSyncQueue();

      const syncItem: SyncQueue = {
        id: `${Date.now()}_${Math.random()}`,
        timestamp: Date.now(),
        retries: 0,
        ...item,
      };

      queue.push(syncItem);
      await AsyncStorage.setItem(CACHE_KEYS.SYNC_QUEUE, JSON.stringify(queue));
      console.log(`✓ Added to sync queue: ${item.type}`);
    } catch (error) {
      console.error('Error adding to sync queue:', error);
    }
  }

  /**
   * Get sync queue
   */
  async getSyncQueue(): Promise<SyncQueue[]> {
    try {
      const data = await AsyncStorage.getItem(CACHE_KEYS.SYNC_QUEUE);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting sync queue:', error);
      return [];
    }
  }

  /**
   * Remove item from sync queue
   */
  async removeFromSyncQueue(itemId: string): Promise<void> {
    try {
      const queue = await this.getSyncQueue();
      const filtered = queue.filter((item) => item.id !== itemId);
      await AsyncStorage.setItem(CACHE_KEYS.SYNC_QUEUE, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error removing from sync queue:', error);
    }
  }

  /**
   * Update sync queue item retries
   */
  async incrementSyncRetries(itemId: string): Promise<void> {
    try {
      const queue = await this.getSyncQueue();
      const item = queue.find((i) => i.id === itemId);

      if (item) {
        item.retries += 1;

        if (item.retries > SYNC_RETRY_LIMIT) {
          await this.removeFromSyncQueue(itemId);
          console.warn(`Sync failed after ${SYNC_RETRY_LIMIT} retries: ${itemId}`);
        } else {
          await AsyncStorage.setItem(CACHE_KEYS.SYNC_QUEUE, JSON.stringify(queue));
        }
      }
    } catch (error) {
      console.error('Error incrementing sync retries:', error);
    }
  }

  // ========================================================================
  // SYNC OPERATIONS
  // ========================================================================

  /**
   * Get last sync timestamp
   */
  async getLastSyncTime(): Promise<number> {
    try {
      const data = await AsyncStorage.getItem(CACHE_KEYS.LAST_SYNC);
      return data ? parseInt(data, 10) : 0;
    } catch (error) {
      console.error('Error getting last sync time:', error);
      return 0;
    }
  }

  /**
   * Update last sync timestamp
   */
  async updateLastSyncTime(): Promise<void> {
    try {
      await AsyncStorage.setItem(CACHE_KEYS.LAST_SYNC, Date.now().toString());
    } catch (error) {
      console.error('Error updating last sync time:', error);
    }
  }

  /**
   * Check if sync is needed
   */
  async isSyncNeeded(intervalMinutes: number = 5): Promise<boolean> {
    try {
      const lastSync = await this.getLastSyncTime();
      const now = Date.now();
      const intervalMs = intervalMinutes * 60 * 1000;

      return now - lastSync > intervalMs;
    } catch (error) {
      console.error('Error checking if sync needed:', error);
      return false;
    }
  }

  // ========================================================================
  // UTILITY OPERATIONS
  // ========================================================================

  /**
   * Get cache size in bytes
   */
  async getCacheSize(): Promise<number> {
    try {
      const meals = await AsyncStorage.getItem(CACHE_KEYS.MEALS);
      const nutrition = await AsyncStorage.getItem(CACHE_KEYS.DAILY_NUTRITION);
      const profile = await AsyncStorage.getItem(CACHE_KEYS.USER_PROFILE);
      const queue = await AsyncStorage.getItem(CACHE_KEYS.SYNC_QUEUE);

      const size =
        (meals?.length || 0) +
        (nutrition?.length || 0) +
        (profile?.length || 0) +
        (queue?.length || 0);

      return size;
    } catch (error) {
      console.error('Error getting cache size:', error);
      return 0;
    }
  }

  /**
   * Clear specific cache type
   */
  async clearCacheType(type: keyof typeof CACHE_KEYS): Promise<void> {
    try {
      await AsyncStorage.removeItem(CACHE_KEYS[type]);
      console.log(`✓ Cleared cache: ${type}`);
    } catch (error) {
      console.error(`Error clearing cache ${type}:`, error);
    }
  }

  /**
   * Clear all cache
   */
  async clearAll(): Promise<void> {
    try {
      const keys = Object.values(CACHE_KEYS);
      await AsyncStorage.multiRemove(keys);
      console.log('✓ All cache cleared');
    } catch (error) {
      console.error('Error clearing all cache:', error);
    }
  }

  /**
   * Export cache data (for debugging)
   */
  async exportCacheData(): Promise<Record<string, any>> {
    try {
      const meals = await this.getMeals();
      const nutrition = await this.getDailyNutrition();
      const profile = await this.getUserProfile();
      const queue = await this.getSyncQueue();
      const lastSync = await this.getLastSyncTime();

      return {
        meals,
        nutrition,
        profile,
        queue,
        lastSync,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error exporting cache data:', error);
      return {};
    }
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

export const offlineCache = new OfflineCacheService();

export default offlineCache;
