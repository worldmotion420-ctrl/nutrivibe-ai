# NutriVibe AI - Groq AI Integration Guide

## Overview

NutriVibe AI integrates **Groq's Vision API** for real-time food recognition, nutrition analysis, and AI-powered meal insights. The system can detect multiple foods in a single image, estimate portion sizes, calculate macronutrients, and provide personalized recommendations.

## Architecture

### Components

1. **Groq AI Service** (`lib/services/groq-ai.ts`)
   - Vision API integration for food detection
   - Nutrition analysis and health scoring
   - Meal correction based on user feedback
   - AI recommendations engine

2. **Food Detection Store** (`lib/stores/food-detection-store.ts`)
   - Manages detection state and results
   - Handles confidence threshold filtering
   - Tracks selected foods and UI state

3. **Camera Lens Screen** (`app/(camera)/lens-groq.tsx`)
   - Real-time camera feed with scanning frame
   - Image capture and processing
   - Loading states and error handling

4. **Processing Screen** (`app/(camera)/processing-groq.tsx`)
   - Displays detection results with confidence scores
   - Shows nutrition breakdown and macros
   - Displays health score and AI recommendations
   - Provides correction options

## Setup

### 1. Configure Groq API Key

Set your Groq API key as an environment variable:

```bash
export EXPO_PUBLIC_GROQ_API_KEY="your-groq-api-key"
```

Or add to `.env.local`:

```
EXPO_PUBLIC_GROQ_API_KEY=your-groq-api-key
```

### 2. Initialize Groq AI Service

```typescript
import { groqAI } from '@/lib/services/groq-ai';

// Set API key programmatically
groqAI.setApiKey('your-groq-api-key');

// Check if configured
if (groqAI.isConfigured()) {
  console.log('✓ Groq AI is ready');
}
```

## Usage

### Detect Foods in Image

```typescript
import { groqAI } from '@/lib/services/groq-ai';

// Capture image as base64
const imageBase64 = await captureImageAsBase64();

// Detect foods
const result = await groqAI.detectFoodsInImage(imageBase64);

if (result.success) {
  console.log(`Detected ${result.foods.length} foods`);
  console.log(`Total calories: ${result.totalCalories}`);
  console.log(`Confidence: ${(result.confidence * 100).toFixed(1)}%`);

  result.foods.forEach((food) => {
    console.log(`- ${food.name}: ${food.calories}kcal (${(food.confidence * 100).toFixed(1)}% confidence)`);
  });
} else {
  console.error('Detection failed:', result.error);
}
```

### Analyze Nutrition

```typescript
import { groqAI } from '@/lib/services/groq-ai';

const foods = [
  {
    name: 'Grilled Chicken',
    confidence: 0.95,
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    fiber: 0,
  },
  {
    name: 'Brown Rice',
    confidence: 0.92,
    calories: 206,
    protein: 4.3,
    carbs: 45,
    fat: 0.3,
    fiber: 0.4,
  },
];

const analysis = await groqAI.analyzeNutrition(foods);

console.log(`Total calories: ${analysis.totalCalories}`);
console.log(`Protein: ${analysis.protein}g`);
console.log(`Health score: ${analysis.healthScore}/100`);
console.log('Recommendations:');
analysis.recommendations.forEach((rec) => console.log(`- ${rec}`));
```

### Get Meal Recommendations

```typescript
const recommendations = await groqAI.getMealRecommendations(foods);

recommendations.forEach((rec) => {
  console.log(`✓ ${rec}`);
});
```

### Correct Meal with User Feedback

```typescript
const originalFoods = [
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

const correction = await groqAI.correctMeal(
  originalFoods,
  'This is actually chicken breast, not regular chicken. And add the vegetables on the side.'
);

console.log('Original foods:', correction.originalFoods);
console.log('Corrected foods:', correction.correctedFoods);
console.log('Explanation:', correction.explanation);
```

### Use Food Detection Store

```typescript
import { useFoodDetectionStore } from '@/lib/stores/food-detection-store';

function MyComponent() {
  const {
    isDetecting,
    detectedFoods,
    totalCalories,
    confidence,
    error,
    setDetectionResult,
    setConfidenceThreshold,
    getFilteredFoods,
  } = useFoodDetectionStore();

  // Set confidence threshold (only show foods with 70%+ confidence)
  setConfidenceThreshold(0.7);

  // Get filtered foods
  const highConfidenceFoods = getFilteredFoods();

  return (
    <View>
      <Text>Detecting: {isDetecting ? 'Yes' : 'No'}</Text>
      <Text>Foods: {detectedFoods.length}</Text>
      <Text>Calories: {totalCalories}</Text>
      <Text>Confidence: {(confidence * 100).toFixed(1)}%</Text>
      {error && <Text>Error: {error}</Text>}
    </View>
  );
}
```

## API Response Format

### Food Detection Result

```typescript
{
  success: boolean;
  foods: [
    {
      name: string;
      confidence: number; // 0-1
      calories: number;
      protein: number; // grams
      carbs: number; // grams
      fat: number; // grams
      fiber: number; // grams
      servingSize: string;
      servingUnit: string;
      boundingBox?: {
        x: number;
        y: number;
        width: number;
        height: number;
      };
    }
  ];
  totalCalories: number;
  confidence: number; // Overall confidence 0-1
  processingTime: number; // milliseconds
  error?: string;
}
```

### Nutrition Analysis Result

```typescript
{
  totalCalories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  water: number;
  micronutrients: {
    iron: string;
    calcium: string;
    vitaminC: string;
  };
  healthScore: number; // 0-100
  recommendations: string[];
}
```

## Confidence Scoring

The system provides confidence scores at two levels:

1. **Per-Food Confidence**: How confident the AI is about identifying each food item (0-1)
2. **Overall Confidence**: How confident the AI is about the entire meal detection (0-1)

### Recommended Thresholds

- **High Confidence** (≥0.85): Use for automatic meal logging
- **Medium Confidence** (0.70-0.84): Show for user review
- **Low Confidence** (<0.70): Require manual correction

```typescript
const { setConfidenceThreshold, getFilteredFoods } = useFoodDetectionStore();

// Only show high-confidence foods
setConfidenceThreshold(0.85);
const highConfidenceFoods = getFilteredFoods();

// Show medium and high confidence foods
setConfidenceThreshold(0.70);
const mediumConfidenceFoods = getFilteredFoods();
```

## Error Handling

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `API key not configured` | Missing Groq API key | Set `EXPO_PUBLIC_GROQ_API_KEY` environment variable |
| `Failed to detect foods` | API error | Check API key validity and Groq service status |
| `Invalid response format` | Unexpected API response | Retry or contact support |
| `Network error` | Connection issue | Check internet connection and retry |

### Error Handling Example

```typescript
const result = await groqAI.detectFoodsInImage(imageBase64);

if (!result.success) {
  if (result.error?.includes('API key')) {
    console.error('Configure Groq API key');
  } else if (result.error?.includes('Network')) {
    console.error('Check internet connection');
  } else {
    console.error('Detection failed:', result.error);
  }
}
```

## Performance Optimization

### Image Compression

Compress images before sending to Groq API to reduce latency:

```typescript
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

const compressed = await manipulateAsync(imageUri, [{ resize: { width: 800, height: 600 } }], {
  compress: 0.7,
  format: SaveFormat.JPEG,
});

const base64 = await FileSystem.readAsStringAsync(compressed.uri, {
  encoding: FileSystem.EncodingType.Base64,
});

const result = await groqAI.detectFoodsInImage(base64);
```

### Batch Processing

Process multiple images in parallel:

```typescript
const imageUris = [...];
const results = await Promise.all(
  imageUris.map((uri) => groqAI.detectFoodsInImage(uri))
);
```

### Caching

Cache detection results to avoid re-processing:

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

const cacheKey = `detection_${imageHash}`;
let result = await AsyncStorage.getItem(cacheKey);

if (!result) {
  result = await groqAI.detectFoodsInImage(imageBase64);
  await AsyncStorage.setItem(cacheKey, JSON.stringify(result));
}
```

## Testing

### Unit Tests

All Groq AI functionality is covered by unit tests:

```bash
pnpm test lib/services/__tests__/groq-ai.test.ts
```

Tests include:
- Food detection with various image types
- Confidence scoring accuracy
- Nutrition analysis calculations
- Error handling and edge cases
- API response parsing
- Performance metrics

### Manual Testing

Test with real food images:

```typescript
import { useFoodDetectionStore } from '@/lib/stores/food-detection-store';
import { groqAI } from '@/lib/services/groq-ai';

// Set API key
groqAI.setApiKey('your-test-key');

// Test detection
const result = await groqAI.detectFoodsInImage(testImageBase64);
console.log('Detection result:', result);

// Test nutrition analysis
const analysis = await groqAI.analyzeNutrition(result.foods);
console.log('Nutrition analysis:', analysis);
```

## Best Practices

### DO ✅

- Always check `groqAI.isConfigured()` before making API calls
- Use confidence thresholds to filter low-quality detections
- Cache results to avoid re-processing identical images
- Handle errors gracefully and provide user feedback
- Compress images before sending to API
- Test with various food types and lighting conditions
- Monitor API usage and costs

### DON'T ❌

- Don't expose API key in client-side code (use environment variables)
- Don't send uncompressed high-resolution images
- Don't ignore confidence scores
- Don't retry failed requests indefinitely
- Don't cache results indefinitely
- Don't assume detection is 100% accurate
- Don't send non-food images to the API

## Troubleshooting

### Detection Returns No Foods

1. Check image quality (lighting, focus, angle)
2. Verify API key is valid
3. Check confidence threshold setting
4. Try with a different food image

### Low Confidence Scores

1. Improve lighting conditions
2. Center food in frame
3. Reduce image complexity (fewer items)
4. Ensure food is clearly visible

### API Errors

1. Verify API key: `groqAI.isConfigured()`
2. Check internet connection
3. Review Groq API status
4. Check request format and image encoding

### Performance Issues

1. Compress images before sending
2. Reduce image resolution
3. Implement request caching
4. Use batch processing for multiple images

## Future Enhancements

- [ ] Real-time bounding box visualization
- [ ] Multi-language support for food names
- [ ] Allergen detection and warnings
- [ ] Recipe suggestions based on detected foods
- [ ] Nutritional database integration
- [ ] Custom food database support
- [ ] Meal history and trending analysis
- [ ] Integration with fitness trackers

## Support

For issues or questions:
1. Check this guide's troubleshooting section
2. Review unit tests for usage examples
3. Check Groq API documentation
4. Contact Groq support

---

**Built with Groq's Vision API for accurate, fast food recognition**
