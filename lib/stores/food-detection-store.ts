/**
 * Food Detection Store
 * Manages real-time food detection state and results
 */

import { create } from 'zustand';
import { DetectedFood, FoodDetectionResult } from '@/lib/services/groq-ai';

// ============================================================================
// TYPES
// ============================================================================

export interface FoodDetectionState {
  // Detection state
  isDetecting: boolean;
  detectionResult: FoodDetectionResult | null;
  detectedFoods: DetectedFood[];
  totalCalories: number;
  confidence: number;

  // Processing state
  processingTime: number;
  error: string | null;

  // UI state
  showBoundingBoxes: boolean;
  selectedFoodIndex: number | null;
  confidenceThreshold: number; // 0-1

  // Actions
  setIsDetecting: (isDetecting: boolean) => void;
  setDetectionResult: (result: FoodDetectionResult) => void;
  setDetectedFoods: (foods: DetectedFood[]) => void;
  setError: (error: string | null) => void;
  setShowBoundingBoxes: (show: boolean) => void;
  setSelectedFoodIndex: (index: number | null) => void;
  setConfidenceThreshold: (threshold: number) => void;
  addFood: (food: DetectedFood) => void;
  removeFood: (index: number) => void;
  updateFood: (index: number, food: DetectedFood) => void;
  clearDetection: () => void;

  // Filtered foods based on confidence threshold
  getFilteredFoods: () => DetectedFood[];
}

// ============================================================================
// STORE
// ============================================================================

export const useFoodDetectionStore = create<FoodDetectionState>((set, get) => ({
  // Initial state
  isDetecting: false,
  detectionResult: null,
  detectedFoods: [],
  totalCalories: 0,
  confidence: 0,
  processingTime: 0,
  error: null,
  showBoundingBoxes: true,
  selectedFoodIndex: null,
  confidenceThreshold: 0.5, // Only show foods with 50%+ confidence by default

  // Actions
  setIsDetecting: (isDetecting) => set({ isDetecting }),

  setDetectionResult: (result) =>
    set({
      detectionResult: result,
      detectedFoods: result.foods,
      totalCalories: result.totalCalories,
      confidence: result.confidence,
      processingTime: result.processingTime,
      error: result.error || null,
    }),

  setDetectedFoods: (foods) => {
    const totalCalories = foods.reduce((sum, food) => sum + (food.calories || 0), 0);
    set({ detectedFoods: foods, totalCalories });
  },

  setError: (error) => set({ error }),

  setShowBoundingBoxes: (show) => set({ showBoundingBoxes: show }),

  setSelectedFoodIndex: (index) => set({ selectedFoodIndex: index }),

  setConfidenceThreshold: (threshold) => set({ confidenceThreshold: threshold }),

  addFood: (food) => {
    const foods = [...get().detectedFoods, food];
    const totalCalories = foods.reduce((sum, f) => sum + (f.calories || 0), 0);
    set({ detectedFoods: foods, totalCalories });
  },

  removeFood: (index) => {
    const foods = get().detectedFoods.filter((_, i) => i !== index);
    const totalCalories = foods.reduce((sum, f) => sum + (f.calories || 0), 0);
    set({ detectedFoods: foods, totalCalories });
  },

  updateFood: (index, food) => {
    const foods = [...get().detectedFoods];
    foods[index] = food;
    const totalCalories = foods.reduce((sum, f) => sum + (f.calories || 0), 0);
    set({ detectedFoods: foods, totalCalories });
  },

  clearDetection: () =>
    set({
      detectionResult: null,
      detectedFoods: [],
      totalCalories: 0,
      confidence: 0,
      processingTime: 0,
      error: null,
      selectedFoodIndex: null,
    }),

  getFilteredFoods: () => {
    const state = get();
    return state.detectedFoods.filter((food) => food.confidence >= state.confidenceThreshold);
  },
}));

export default useFoodDetectionStore;
