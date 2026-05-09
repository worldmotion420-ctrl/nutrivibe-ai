import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { offlineCache, CachedMeal, DailyNutrition } from '../offline-cache';

// Mock AsyncStorage
vi.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    multiRemove: vi.fn(),
  },
}));

describe('OfflineCacheService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Meal Operations', () => {
    it('should save a meal to cache', async () => {
      const meal: CachedMeal = {
        id: 'meal_1',
        name: 'Chicken Rice',
        items: ['Chicken', 'Rice'],
        calories: 450,
        protein: 45,
        carbs: 50,
        fat: 10,
        fiber: 5,
        timestamp: Date.now(),
        synced: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      vi.mocked(AsyncStorage.getItem).mockResolvedValueOnce(null);
      vi.mocked(AsyncStorage.setItem).mockResolvedValueOnce(undefined);

      await offlineCache.saveMeal(meal);

      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });

    it('should retrieve meals from cache', async () => {
      const meals: CachedMeal[] = [
        {
          id: 'meal_1',
          name: 'Breakfast',
          items: ['Eggs', 'Toast'],
          calories: 350,
          protein: 20,
          carbs: 40,
          fat: 15,
          fiber: 2,
          timestamp: Date.now(),
          synced: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      vi.mocked(AsyncStorage.getItem).mockResolvedValueOnce(JSON.stringify(meals));

      const result = await offlineCache.getMeals();

      expect(result).toEqual(meals);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('nutrivibe_meals');
    });

    it('should get meals by date', async () => {
      const today = new Date();
      const dayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const timestamp = dayStart.getTime();

      const meals: CachedMeal[] = [
        {
          id: 'meal_1',
          name: 'Breakfast',
          items: ['Eggs'],
          calories: 350,
          protein: 20,
          carbs: 40,
          fat: 15,
          fiber: 2,
          timestamp,
          synced: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      vi.mocked(AsyncStorage.getItem).mockResolvedValueOnce(JSON.stringify(meals));

      const result = await offlineCache.getMealsByDate(dayStart.toISOString().split('T')[0]);

      expect(result.length).toBe(1);
      expect(result[0].id).toBe('meal_1');
    });

    it('should delete a meal from cache', async () => {
      const meals: CachedMeal[] = [
        {
          id: 'meal_1',
          name: 'Breakfast',
          items: ['Eggs'],
          calories: 350,
          protein: 20,
          carbs: 40,
          fat: 15,
          fiber: 2,
          timestamp: Date.now(),
          synced: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      vi.mocked(AsyncStorage.getItem).mockResolvedValueOnce(JSON.stringify(meals));
      vi.mocked(AsyncStorage.setItem).mockResolvedValueOnce(undefined);

      await offlineCache.deleteMeal('meal_1');

      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });

    it('should get unsynced meals', async () => {
      const meals: CachedMeal[] = [
        {
          id: 'meal_1',
          name: 'Breakfast',
          items: ['Eggs'],
          calories: 350,
          protein: 20,
          carbs: 40,
          fat: 15,
          fiber: 2,
          timestamp: Date.now(),
          synced: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'meal_2',
          name: 'Lunch',
          items: ['Chicken'],
          calories: 450,
          protein: 45,
          carbs: 50,
          fat: 10,
          fiber: 5,
          timestamp: Date.now(),
          synced: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      vi.mocked(AsyncStorage.getItem).mockResolvedValueOnce(JSON.stringify(meals));

      const result = await offlineCache.getUnsyncedMeals();

      expect(result.length).toBe(1);
      expect(result[0].synced).toBe(false);
    });

    it('should mark meal as synced', async () => {
      const meal: CachedMeal = {
        id: 'meal_1',
        name: 'Breakfast',
        items: ['Eggs'],
        calories: 350,
        protein: 20,
        carbs: 40,
        fat: 15,
        fiber: 2,
        timestamp: Date.now(),
        synced: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      vi.mocked(AsyncStorage.getItem).mockResolvedValueOnce(JSON.stringify([meal]));
      vi.mocked(AsyncStorage.setItem).mockResolvedValueOnce(undefined);

      await offlineCache.markMealSynced('meal_1');

      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });

  describe('Daily Nutrition Operations', () => {
    it('should save daily nutrition', async () => {
      const nutrition: DailyNutrition = {
        date: '2026-05-09',
        meals: [],
        totals: {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
          fiber: 0,
          water: 0,
        },
        goals: {
          calories: 2200,
          protein: 150,
          carbs: 250,
          fat: 80,
          fiber: 25,
          water: 2000,
        },
      };

      vi.mocked(AsyncStorage.getItem).mockResolvedValueOnce(null);
      vi.mocked(AsyncStorage.setItem).mockResolvedValueOnce(undefined);

      await offlineCache.saveDailyNutrition(nutrition);

      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });

    it('should get daily nutrition by date', async () => {
      const nutrition: DailyNutrition = {
        date: '2026-05-09',
        meals: [],
        totals: {
          calories: 1500,
          protein: 100,
          carbs: 150,
          fat: 50,
          fiber: 15,
          water: 1500,
        },
        goals: {
          calories: 2200,
          protein: 150,
          carbs: 250,
          fat: 80,
          fiber: 25,
          water: 2000,
        },
      };

      vi.mocked(AsyncStorage.getItem).mockResolvedValueOnce(JSON.stringify([nutrition]));

      const result = await offlineCache.getNutritionByDate('2026-05-09');

      expect(result).toEqual(nutrition);
    });

    it('should calculate daily nutrition from meals', async () => {
      const meals: CachedMeal[] = [
        {
          id: 'meal_1',
          name: 'Breakfast',
          items: ['Eggs'],
          calories: 350,
          protein: 20,
          carbs: 40,
          fat: 15,
          fiber: 2,
          timestamp: Date.now(),
          synced: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      vi.mocked(AsyncStorage.getItem).mockResolvedValueOnce(JSON.stringify(meals));
      vi.mocked(AsyncStorage.setItem).mockResolvedValueOnce(undefined);

      const result = await offlineCache.calculateDailyNutrition('2026-05-09');

      expect(result.totals.calories).toBe(350);
      expect(result.totals.protein).toBe(20);
    });
  });

  describe('Sync Queue Operations', () => {
    it('should add item to sync queue', async () => {
      vi.mocked(AsyncStorage.getItem).mockResolvedValueOnce(null);
      vi.mocked(AsyncStorage.setItem).mockResolvedValueOnce(undefined);

      await offlineCache.addToSyncQueue({
        type: 'meal',
        data: { id: 'meal_1', name: 'Breakfast' },
      });

      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });

    it('should get sync queue', async () => {
      const queue = [
        {
          id: 'sync_1',
          type: 'meal' as const,
          data: { id: 'meal_1' },
          timestamp: Date.now(),
          retries: 0,
        },
      ];

      vi.mocked(AsyncStorage.getItem).mockResolvedValueOnce(JSON.stringify(queue));

      const result = await offlineCache.getSyncQueue();

      expect(result.length).toBe(1);
      expect(result[0].type).toBe('meal');
    });

    it('should remove item from sync queue', async () => {
      const queue = [
        {
          id: 'sync_1',
          type: 'meal' as const,
          data: { id: 'meal_1' },
          timestamp: Date.now(),
          retries: 0,
        },
      ];

      vi.mocked(AsyncStorage.getItem).mockResolvedValueOnce(JSON.stringify(queue));
      vi.mocked(AsyncStorage.setItem).mockResolvedValueOnce(undefined);

      await offlineCache.removeFromSyncQueue('sync_1');

      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });

  describe('Cache Management', () => {
    it('should get cache size', async () => {
      const meals = JSON.stringify([{ id: 'meal_1' }]);
      const nutrition = JSON.stringify([{ date: '2026-05-09' }]);

      vi.mocked(AsyncStorage.getItem)
        .mockResolvedValueOnce(meals)
        .mockResolvedValueOnce(nutrition)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);

      const size = await offlineCache.getCacheSize();

      expect(size).toBeGreaterThan(0);
    });

    it('should clear all cache', async () => {
      vi.mocked(AsyncStorage.multiRemove).mockResolvedValueOnce(undefined);

      await offlineCache.clearAll();

      expect(AsyncStorage.multiRemove).toHaveBeenCalled();
    });

    it('should export cache data', async () => {
      const meals: CachedMeal[] = [
        {
          id: 'meal_1',
          name: 'Breakfast',
          items: ['Eggs'],
          calories: 350,
          protein: 20,
          carbs: 40,
          fat: 15,
          fiber: 2,
          timestamp: Date.now(),
          synced: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      vi.mocked(AsyncStorage.getItem)
        .mockResolvedValueOnce(JSON.stringify(meals))
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce('0');

      const data = await offlineCache.exportCacheData();

      expect(data.meals).toBeDefined();
      expect(data.timestamp).toBeDefined();
    });
  });

  describe('Sync State', () => {
    it('should get last sync time', async () => {
      const timestamp = Date.now().toString();
      vi.mocked(AsyncStorage.getItem).mockResolvedValueOnce(timestamp);

      const result = await offlineCache.getLastSyncTime();

      expect(result).toBe(parseInt(timestamp, 10));
    });

    it('should update last sync time', async () => {
      vi.mocked(AsyncStorage.setItem).mockResolvedValueOnce(undefined);

      await offlineCache.updateLastSyncTime();

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'nutrivibe_last_sync',
        expect.any(String)
      );
    });

    it('should check if sync is needed', async () => {
      const oldTime = (Date.now() - 10 * 60 * 1000).toString(); // 10 minutes ago
      vi.mocked(AsyncStorage.getItem).mockResolvedValueOnce(oldTime);

      const result = await offlineCache.isSyncNeeded(5); // 5 minute interval

      expect(result).toBe(true);
    });
  });
});
