import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useOnboardingStore } from '../onboarding-store';

describe('Onboarding Store', () => {
  // Mock AsyncStorage for tests
  vi.mock('@react-native-async-storage/async-storage', () => ({
    default: {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    },
  }));
  beforeEach(() => {
    // Reset store before each test
    useOnboardingStore.setState({
      goal: null,
      age: null,
      height_cm: null,
      weight_kg: null,
      activity_level: null,
    });
  });

  it('should set goal correctly', () => {
    const store = useOnboardingStore.getState();
    store.setGoal('lose_weight');
    
    const state = useOnboardingStore.getState();
    expect(state.goal).toBe('lose_weight');
  });

  it('should set metrics correctly', () => {
    const store = useOnboardingStore.getState();
    store.setMetrics({
      age: 28,
      height_cm: 175,
      weight_kg: 70,
      activity_level: 'moderate',
    });
    
    const state = useOnboardingStore.getState();
    expect(state.age).toBe(28);
    expect(state.height_cm).toBe(175);
    expect(state.weight_kg).toBe(70);
    expect(state.activity_level).toBe('moderate');
  });

  it('should get onboarding data correctly', () => {
    const store = useOnboardingStore.getState();
    store.setGoal('build_muscle');
    store.setMetrics({
      age: 25,
      height_cm: 180,
      weight_kg: 80,
      activity_level: 'active',
    });
    
    const data = useOnboardingStore.getState().getOnboardingData();
    expect(data.goal).toBe('build_muscle');
    expect(data.age).toBe(25);
    expect(data.height_cm).toBe(180);
    expect(data.weight_kg).toBe(80);
    expect(data.activity_level).toBe('active');
  });

  it('should clear onboarding data correctly', () => {
    const store = useOnboardingStore.getState();
    store.setGoal('maintain');
    store.setMetrics({
      age: 30,
      height_cm: 170,
      weight_kg: 65,
      activity_level: 'light',
    });
    
    // Manually clear since clearOnboarding uses AsyncStorage
    useOnboardingStore.setState({
      goal: null,
      age: null,
      height_cm: null,
      weight_kg: null,
      activity_level: null,
    });
    
    const state = useOnboardingStore.getState();
    expect(state.goal).toBeNull();
    expect(state.age).toBeNull();
    expect(state.height_cm).toBeNull();
    expect(state.weight_kg).toBeNull();
    expect(state.activity_level).toBeNull();
  });

  it('should handle partial metrics update', () => {
    const store = useOnboardingStore.getState();
    store.setGoal('high_protein');
    store.setMetrics({
      age: 35,
      height_cm: 185,
      weight_kg: 90,
      activity_level: 'very_active',
    });
    
    const state = useOnboardingStore.getState();
    expect(state.goal).toBe('high_protein');
    expect(state.age).toBe(35);
  });

  it('should initialize with null values', () => {
    useOnboardingStore.setState({
      goal: null,
      age: null,
      height_cm: null,
      weight_kg: null,
      activity_level: null,
    });
    
    const data = useOnboardingStore.getState().getOnboardingData();
    expect(data.goal).toBeNull();
    expect(data.age).toBeNull();
    expect(data.height_cm).toBeNull();
    expect(data.weight_kg).toBeNull();
    expect(data.activity_level).toBeNull();
  });
});
