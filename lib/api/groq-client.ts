import axios from 'axios';

interface FoodDetectionResult {
  items: Array<{
    name: string;
    confidence: number;
    portion_estimate: string;
    calories_estimate: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
    fiber_g: number;
    bounding_box?: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  }>;
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
  total_fiber: number;
  confidence_score: number;
}

interface VoiceCorrectionResult {
  corrected_items: Array<{
    name: string;
    portion_estimate: string;
    calories_estimate: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
    fiber_g: number;
  }>;
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
  total_fiber: number;
  confidence_score: number;
}

const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY || '';
const GROQ_API_URL = 'https://api.groq.com/openai/v1';

const groqClient = axios.create({
  baseURL: GROQ_API_URL,
  headers: {
    'Authorization': `Bearer ${GROQ_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

export const groqApi = {
  /**
   * Analyze food image and detect food items
   */
  async detectFood(imageBase64: string): Promise<FoodDetectionResult> {
    try {
      const response = await groqClient.post('/chat/completions', {
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analyze this food image and provide detailed nutrition information. 
                Return a JSON object with:
                {
                  "items": [
                    {
                      "name": "food item name",
                      "confidence": 0.95,
                      "portion_estimate": "100g",
                      "calories_estimate": 150,
                      "protein_g": 10,
                      "carbs_g": 20,
                      "fat_g": 5,
                      "fiber_g": 2,
                      "bounding_box": {"x": 0.1, "y": 0.2, "width": 0.3, "height": 0.4}
                    }
                  ],
                  "total_calories": 150,
                  "total_protein": 10,
                  "total_carbs": 20,
                  "total_fat": 5,
                  "total_fiber": 2,
                  "confidence_score": 0.92
                }`,
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
      });

      const content = response.data.choices[0].message.content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        throw new Error('Failed to parse nutrition data');
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error: any) {
      console.error('Groq food detection error:', error);
      throw new Error(error.message || 'Failed to detect food');
    }
  },

  /**
   * Correct meal information based on voice input
   */
  async correctMealWithVoice(
    transcription: string,
    currentMealData: any
  ): Promise<VoiceCorrectionResult> {
    try {
      const response = await groqClient.post('/chat/completions', {
        model: 'gpt-4',
        messages: [
          {
            role: 'user',
            content: `Based on this voice correction: "${transcription}"
            
Current meal data: ${JSON.stringify(currentMealData)}

Update the meal information and return corrected nutrition data as JSON:
{
  "corrected_items": [
    {
      "name": "corrected food item",
      "portion_estimate": "100g",
      "calories_estimate": 150,
      "protein_g": 10,
      "carbs_g": 20,
      "fat_g": 5,
      "fiber_g": 2
    }
  ],
  "total_calories": 150,
  "total_protein": 10,
  "total_carbs": 20,
  "total_fat": 5,
  "total_fiber": 2,
  "confidence_score": 0.95
}`,
          },
        ],
        max_tokens: 512,
      });

      const content = response.data.choices[0].message.content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        throw new Error('Failed to parse corrected nutrition data');
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error: any) {
      console.error('Groq voice correction error:', error);
      throw new Error(error.message || 'Failed to correct meal');
    }
  },

  /**
   * Generate AI insights based on nutrition data
   */
  async generateInsight(
    mealData: any,
    userProfile: any,
    dailySummary: any
  ): Promise<string> {
    try {
      const response = await groqClient.post('/chat/completions', {
        model: 'gpt-4',
        messages: [
          {
            role: 'user',
            content: `Generate a brief, personalized nutrition insight based on:
            
User Profile: ${JSON.stringify(userProfile)}
Today's Summary: ${JSON.stringify(dailySummary)}
Current Meal: ${JSON.stringify(mealData)}

Provide a single, actionable insight in 1-2 sentences.`,
          },
        ],
        max_tokens: 256,
      });

      return response.data.choices[0].message.content;
    } catch (error: any) {
      console.error('Groq insight generation error:', error);
      throw new Error(error.message || 'Failed to generate insight');
    }
  },

  /**
   * Analyze nutrition trends
   */
  async analyzeTrends(mealHistory: any[], userProfile: any): Promise<string> {
    try {
      const response = await groqClient.post('/chat/completions', {
        model: 'gpt-4',
        messages: [
          {
            role: 'user',
            content: `Analyze these nutrition trends and provide recommendations:
            
User Goal: ${userProfile.goal}
User Targets: Protein ${userProfile.daily_protein_target}g, Calories ${userProfile.daily_calorie_target}
Recent Meals: ${JSON.stringify(mealHistory.slice(0, 7))}

Provide 2-3 specific, actionable recommendations to help reach goals.`,
          },
        ],
        max_tokens: 512,
      });

      return response.data.choices[0].message.content;
    } catch (error: any) {
      console.error('Groq trend analysis error:', error);
      throw new Error(error.message || 'Failed to analyze trends');
    }
  },
};

export default groqApi;
