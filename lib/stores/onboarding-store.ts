import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

interface OnboardingState {
  goal: string | null;
  age: number | null;
  height_cm: number | null;
  weight_kg: number | null;
  activity_level: string | null;
  
  // Actions
  setGoal: (goal: string) => void;
  setMetrics: (metrics: { age: number; height_cm: number; weight_kg: number; activity_level: string }) => void;
  getOnboardingData: () => any;
  clearOnboarding: () => void;
  loadFromStorage: () => Promise<void>;
  saveToStorage: () => Promise<void>;
}

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  goal: null,
  age: null,
  height_cm: null,
  weight_kg: null,
  activity_level: null,

  setGoal: (goal: string) => {
    set({ goal });
    get().saveToStorage();
  },

  setMetrics: (metrics: { age: number; height_cm: number; weight_kg: number; activity_level: string }) => {
    set(metrics);
    get().saveToStorage();
  },

  getOnboardingData: () => {
    const state = get();
    return {
      goal: state.goal,
      age: state.age,
      height_cm: state.height_cm,
      weight_kg: state.weight_kg,
      activity_level: state.activity_level,
    };
  },

  clearOnboarding: () => {
    set({
      goal: null,
      age: null,
      height_cm: null,
      weight_kg: null,
      activity_level: null,
    });
    if (Platform.OS !== 'web') {
      AsyncStorage.removeItem('onboarding_data');
    }
  },

  loadFromStorage: async () => {
    if (Platform.OS === 'web') return;
    try {
      const data = await AsyncStorage.getItem('onboarding_data');
      if (data) {
        const parsed = JSON.parse(data);
        set(parsed);
      }
    } catch (error) {
      console.error('Failed to load onboarding data:', error);
    }
  },

  saveToStorage: async () => {
    if (Platform.OS === 'web') return;
    try {
      const state = get();
      const data = {
        goal: state.goal,
        age: state.age,
        height_cm: state.height_cm,
        weight_kg: state.weight_kg,
        activity_level: state.activity_level,
      };
      await AsyncStorage.setItem('onboarding_data', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save onboarding data:', error);
    }
  },
}));
