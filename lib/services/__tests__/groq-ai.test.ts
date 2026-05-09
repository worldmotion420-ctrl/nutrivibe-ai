import { describe, it, expect, beforeEach, vi } from 'vitest';
import { groqAI, DetectedFood, FoodDetectionResult } from '../groq-ai';

// Mock fetch
global.fetch = vi.fn();

describe('GroqAIService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Food Detection', () => {
    it('should detect foods in image', async () => {
      groqAI.setApiKey('test-key');
      const mockResponse = {
        ok: true,
        json: async () => ({
          choices: [
            {
              message: {
                content: JSON.stringify({
                  foods: [
                    {
                      name: 'Grilled Chicken',
                      confidence: 0.95,
                      calories: 165,
                      protein: 31,
                      carbs: 0,
                      fat: 3.6,
                      fiber: 0,
                      servingSize: '100g',
                      servingUnit: 'grams',
                    },
                  ],
                  overallConfidence: 0.95,
                }),
              },
            },
          ],
        }),
      };

      vi.mocked(fetch).mockResolvedValueOnce(mockResponse as any);

      const result = await groqAI.detectFoodsInImage('base64imagedata');

      expect(result.success).toBe(true);
      expect(result.foods.length).toBeGreaterThan(0);
      expect(result.foods[0].name).toBe('Grilled Chicken');
      expect(result.confidence).toBe(0.95);
    });

    it('should handle API errors gracefully', async () => {
      groqAI.setApiKey('test-key');
      const mockResponse = {
        ok: false,
        json: async () => ({
          error: { message: 'API Error' },
        }),
      };

      vi.mocked(fetch).mockResolvedValueOnce(mockResponse as any);

      const result = await groqAI.detectFoodsInImage('base64imagedata');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle missing API key', async () => {
      const originalKey = process.env.EXPO_PUBLIC_GROQ_API_KEY;
      delete process.env.EXPO_PUBLIC_GROQ_API_KEY;
      groqAI.setApiKey('');

      const result = await groqAI.detectFoodsInImage('base64imagedata');

      expect(result.success).toBe(false);
      expect(result.error).toContain('API key');

      if (originalKey) process.env.EXPO_PUBLIC_GROQ_API_KEY = originalKey;
    });

    it('should calculate total calories from detected foods', async () => {
      groqAI.setApiKey('test-key');
      const mockResponse = {
        ok: true,
        json: async () => ({
          choices: [
            {
              message: {
                content: JSON.stringify({
                  foods: [
                    { name: 'Chicken', calories: 165, confidence: 0.95, protein: 31, carbs: 0, fat: 3.6, fiber: 0 },
                    { name: 'Rice', calories: 206, confidence: 0.92, protein: 4.3, carbs: 45, fat: 0.3, fiber: 0.4 },
                  ],
                  overallConfidence: 0.93,
                }),
              },
            },
          ],
        }),
      };

      vi.mocked(fetch).mockResolvedValueOnce(mockResponse as any);

      const result = await groqAI.detectFoodsInImage('base64imagedata');

      expect(result.totalCalories).toBe(371);
    });
  });

  describe('Nutrition Analysis', () => {
    it('should analyze nutrition correctly', async () => {
      const foods: DetectedFood[] = [
        {
          name: 'Chicken',
          confidence: 0.95,
          calories: 165,
          protein: 31,
          carbs: 0,
          fat: 3.6,
          fiber: 0,
        },
        {
          name: 'Rice',
          confidence: 0.92,
          calories: 206,
          protein: 4.3,
          carbs: 45,
          fat: 0.3,
          fiber: 0.4,
        },
      ];

      const analysis = await groqAI.analyzeNutrition(foods);

      expect(analysis.totalCalories).toBe(371);
      expect(analysis.protein).toBe(35.3);
      expect(analysis.carbs).toBe(45);
      expect(analysis.healthScore).toBeGreaterThan(0);
      expect(analysis.recommendations.length).toBeGreaterThan(0);
    });

    it('should generate health recommendations', async () => {
      const foods: DetectedFood[] = [
        {
          name: 'Salad',
          confidence: 0.9,
          calories: 150,
          protein: 5,
          carbs: 20,
          fat: 5,
          fiber: 5,
        },
      ];

      const analysis = await groqAI.analyzeNutrition(foods);

      expect(analysis.recommendations).toBeDefined();
      expect(Array.isArray(analysis.recommendations)).toBe(true);
    });

    it('should calculate health score', async () => {
      const foods: DetectedFood[] = [
        {
          name: 'Balanced Meal',
          confidence: 0.95,
          calories: 500,
          protein: 50,
          carbs: 60,
          fat: 15,
          fiber: 8,
        },
      ];

      const analysis = await groqAI.analyzeNutrition(foods);

      expect(analysis.healthScore).toBeGreaterThan(0);
      expect(analysis.healthScore).toBeLessThanOrEqual(100);
    });
  });

  describe('Meal Correction', () => {
    it('should correct meal based on user feedback', async () => {
      groqAI.setApiKey('test-key');
      const originalFoods: DetectedFood[] = [
        {
          name: 'Chicken',
          confidence: 0.8,
          calories: 165,
          protein: 31,
          carbs: 0,
          fat: 3.6,
          fiber: 0,
        },
      ];

      const mockResponse = {
        ok: true,
        json: async () => ({
          choices: [
            {
              message: {
                content: JSON.stringify({
                  correctedFoods: [
                    {
                      name: 'Grilled Chicken Breast',
                      confidence: 0.95,
                      calories: 165,
                      protein: 31,
                      carbs: 0,
                      fat: 3.6,
                      fiber: 0,
                    },
                  ],
                  explanation: 'Corrected to more specific chicken type',
                }),
              },
            },
          ],
        }),
      };

      vi.mocked(fetch).mockResolvedValueOnce(mockResponse as any);

      const result = await groqAI.correctMeal(originalFoods, 'This is chicken breast, not regular chicken');

      expect(result.correctedFoods).toBeDefined();
      expect(result.explanation).toBeDefined();
    });
  });

  describe('Configuration', () => {
    it('should check if API is configured', () => {
      groqAI.setApiKey('test-key');
      expect(groqAI.isConfigured()).toBe(true);

      groqAI.setApiKey('');
      expect(groqAI.isConfigured()).toBe(false);
    });

    it('should update API key', () => {
      groqAI.setApiKey('new-key');
      expect(groqAI.isConfigured()).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      groqAI.setApiKey('test-key');
      vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));

      const result = await groqAI.detectFoodsInImage('base64imagedata');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle invalid JSON response', async () => {
      groqAI.setApiKey('test-key');
      const mockResponse = {
        ok: true,
        json: async () => ({
          choices: [
            {
              message: {
                content: 'Invalid JSON response',
              },
            },
          ],
        }),
      };

      vi.mocked(fetch).mockResolvedValueOnce(mockResponse as any);

      const result = await groqAI.detectFoodsInImage('base64imagedata');

      expect(result.success).toBe(false);
    });
  });

  describe('Performance', () => {
    it('should track processing time', async () => {
      groqAI.setApiKey('test-key');
      const mockResponse = {
        ok: true,
        json: async () => ({
          choices: [
            {
              message: {
                content: JSON.stringify({
                  foods: [],
                  overallConfidence: 0.9,
                }),
              },
            },
          ],
        }),
      };

      vi.mocked(fetch).mockResolvedValueOnce(mockResponse as any);

      const result = await groqAI.detectFoodsInImage('base64imagedata');

      expect(result.processingTime).toBeGreaterThanOrEqual(0);
    });
  });
});
