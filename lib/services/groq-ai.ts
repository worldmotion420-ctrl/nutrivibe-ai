/**
 * Groq AI Service
 * Handles food recognition, nutrition analysis, and AI-powered meal insights
 * Uses Groq's vision API for real-time food detection
 */

// ============================================================================
// TYPES
// ============================================================================

export interface DetectedFood {
  name: string;
  confidence: number; // 0-1 (0-100%)
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  servingSize?: string;
  servingUnit?: string;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface FoodDetectionResult {
  success: boolean;
  foods: DetectedFood[];
  totalCalories: number;
  confidence: number; // Overall confidence of the detection
  processingTime: number;
  error?: string;
}

export interface NutritionAnalysis {
  totalCalories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  water: number;
  micronutrients: Record<string, string>;
  healthScore: number; // 0-100
  recommendations: string[];
}

export interface MealCorrection {
  originalFoods: DetectedFood[];
  correctedFoods: DetectedFood[];
  explanation: string;
}

// ============================================================================
// GROQ AI SERVICE
// ============================================================================

class GroqAIService {
  private apiKey: string;
  private baseUrl: string = 'https://api.groq.com/openai/v1';
  private model: string = 'llama-4-70b-vision'; // Llama 4 Scout vision model

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.EXPO_PUBLIC_GROQ_API_KEY || '';

    if (!this.apiKey) {
      console.warn('⚠️ Groq API key not configured. Set EXPO_PUBLIC_GROQ_API_KEY environment variable.');
    }
  }

  /**
   * Detect foods in an image using Groq vision API
   */
  async detectFoodsInImage(imageBase64: string): Promise<FoodDetectionResult> {
    const startTime = Date.now();

    try {
      if (!this.apiKey) {
        return {
          success: false,
          foods: [],
          totalCalories: 0,
          confidence: 0,
          processingTime: 0,
          error: 'Groq API key not configured',
        };
      }

      console.log('🔍 Detecting foods in image...');

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: `You are an expert nutritionist and food identification AI. Analyze this food image and provide:

1. List of all visible food items with:
   - Food name
   - Estimated portion size
   - Confidence level (0-1)
   - Estimated calories
   - Estimated macronutrients (protein, carbs, fat, fiber in grams)

2. Overall confidence in the detection (0-1)

Format your response as JSON:
{
  "foods": [
    {
      "name": "food name",
      "confidence": 0.95,
      "calories": 150,
      "protein": 20,
      "carbs": 10,
      "fat": 5,
      "fiber": 2,
      "servingSize": "100g",
      "servingUnit": "grams"
    }
  ],
  "overallConfidence": 0.92,
  "notes": "any relevant notes about the meal"
}

Be precise with calorie and macro estimates based on typical serving sizes.`,
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:image/jpeg;base64,${imageBase64}`,
                  },
                },
              ],
            },
          ],
          max_tokens: 1024,
          temperature: 0.3, // Lower temperature for more consistent results
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Groq API error:', error);
        return {
          success: false,
          foods: [],
          totalCalories: 0,
          confidence: 0,
          processingTime: Date.now() - startTime,
          error: error.error?.message || 'Failed to detect foods',
        };
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        return {
          success: false,
          foods: [],
          totalCalories: 0,
          confidence: 0,
          processingTime: Date.now() - startTime,
          error: 'No response from Groq API',
        };
      }

      // Parse JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.warn('Could not parse JSON from response:', content);
        return {
          success: false,
          foods: [],
          totalCalories: 0,
          confidence: 0,
          processingTime: Date.now() - startTime,
          error: 'Invalid response format',
        };
      }

      const result = JSON.parse(jsonMatch[0]);
      const foods: DetectedFood[] = result.foods || [];
      const totalCalories = foods.reduce((sum, food) => sum + (food.calories || 0), 0);
      const confidence = result.overallConfidence || 0;

      console.log(`✓ Detected ${foods.length} foods with ${(confidence * 100).toFixed(1)}% confidence`);

      return {
        success: true,
        foods,
        totalCalories,
        confidence,
        processingTime: Date.now() - startTime,
      };
    } catch (error) {
      console.error('Error detecting foods:', error);
      return {
        success: false,
        foods: [],
        totalCalories: 0,
        confidence: 0,
        processingTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Analyze nutrition of detected foods
   */
  async analyzeNutrition(foods: DetectedFood[]): Promise<NutritionAnalysis> {
    try {
      const totalCalories = foods.reduce((sum, food) => sum + (food.calories || 0), 0);
      const totalProtein = foods.reduce((sum, food) => sum + (food.protein || 0), 0);
      const totalCarbs = foods.reduce((sum, food) => sum + (food.carbs || 0), 0);
      const totalFat = foods.reduce((sum, food) => sum + (food.fat || 0), 0);
      const totalFiber = foods.reduce((sum, food) => sum + (food.fiber || 0), 0);

      // Calculate health score (0-100)
      const proteinScore = Math.min(totalProtein / 30 * 20, 20); // Max 20 points
      const fiberScore = Math.min(totalFiber / 25 * 20, 20); // Max 20 points
      const calorieScore = totalCalories <= 2200 ? 20 : Math.max(20 - (totalCalories - 2200) / 100, 0); // Max 20 points
      const macroBalance = Math.abs(totalCarbs / totalCalories * 100 - 50) < 10 ? 20 : 10; // Max 20 points
      const healthScore = Math.round(proteinScore + fiberScore + calorieScore + macroBalance);

      // Generate recommendations
      const recommendations: string[] = [];

      if (totalProtein < 50) {
        recommendations.push('Add more protein-rich foods to meet daily targets');
      }
      if (totalFiber < 20) {
        recommendations.push('Increase fiber intake with whole grains and vegetables');
      }
      if (totalCalories > 2500) {
        recommendations.push('Consider reducing portion sizes to manage calorie intake');
      }
      if (totalFat > 80) {
        recommendations.push('Reduce saturated fat intake for better heart health');
      }
      if (recommendations.length === 0) {
        recommendations.push('Great meal choice! Balanced nutrition.');
      }

      return {
        totalCalories,
        protein: totalProtein,
        carbs: totalCarbs,
        fat: totalFat,
        fiber: totalFiber,
        water: 0, // Would need to estimate from foods
        micronutrients: {
          iron: 'Moderate',
          calcium: 'Moderate',
          vitaminC: 'Moderate',
        },
        healthScore,
        recommendations,
      };
    } catch (error) {
      console.error('Error analyzing nutrition:', error);
      return {
        totalCalories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
        water: 0,
        micronutrients: {},
        healthScore: 0,
        recommendations: ['Unable to analyze nutrition'],
      };
    }
  }

  /**
   * Get AI-powered meal recommendations based on detected foods
   */
  async getMealRecommendations(foods: DetectedFood[]): Promise<string[]> {
    try {
      if (!this.apiKey) {
        return ['Configure Groq API key to get recommendations'];
      }

      const foodNames = foods.map((f) => f.name).join(', ');

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'mixtral-8x7b-32768', // Use faster model for text
          messages: [
            {
              role: 'user',
              content: `As a nutritionist, provide 3 specific recommendations to improve this meal: ${foodNames}. 
              
              Format as JSON array of strings:
              ["recommendation 1", "recommendation 2", "recommendation 3"]`,
            },
          ],
          max_tokens: 256,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        return ['Unable to get recommendations'];
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        return ['Unable to get recommendations'];
      }

      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        return ['Unable to get recommendations'];
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return ['Unable to get recommendations'];
    }
  }

  /**
   * Correct meal based on user feedback
   */
  async correctMeal(
    originalFoods: DetectedFood[],
    userCorrection: string
  ): Promise<MealCorrection> {
    try {
      if (!this.apiKey) {
        return {
          originalFoods,
          correctedFoods: originalFoods,
          explanation: 'Groq API key not configured',
        };
      }

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'mixtral-8x7b-32768',
          messages: [
            {
              role: 'user',
              content: `Original meal detected: ${JSON.stringify(originalFoods)}
              
              User correction: "${userCorrection}"
              
              Based on this correction, provide the corrected meal as JSON:
              {
                "correctedFoods": [
                  {
                    "name": "food name",
                    "confidence": 0.95,
                    "calories": 150,
                    "protein": 20,
                    "carbs": 10,
                    "fat": 5,
                    "fiber": 2,
                    "servingSize": "100g"
                  }
                ],
                "explanation": "explanation of changes"
              }`,
            },
          ],
          max_tokens: 512,
          temperature: 0.5,
        }),
      });

      if (!response.ok) {
        return {
          originalFoods,
          correctedFoods: originalFoods,
          explanation: 'Failed to correct meal',
        };
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        return {
          originalFoods,
          correctedFoods: originalFoods,
          explanation: 'No response from API',
        };
      }

      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return {
          originalFoods,
          correctedFoods: originalFoods,
          explanation: 'Invalid response format',
        };
      }

      const result = JSON.parse(jsonMatch[0]);

      return {
        originalFoods,
        correctedFoods: result.correctedFoods || originalFoods,
        explanation: result.explanation || 'Meal corrected',
      };
    } catch (error) {
      console.error('Error correcting meal:', error);
      return {
        originalFoods,
        correctedFoods: originalFoods,
        explanation: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Update API key
   */
  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
    console.log('✓ Groq API key updated');
  }

  /**
   * Check if API is configured
   */
  isConfigured(): boolean {
    return !!this.apiKey;
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

export const groqAI = new GroqAIService();

export default groqAI;
