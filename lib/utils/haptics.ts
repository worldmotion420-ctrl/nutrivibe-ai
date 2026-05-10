import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/**
 * Haptics utility module for consistent haptic feedback across the app
 */
export const hapticFeedback = {
  /**
   * Light tap feedback for button presses
   */
  tap: async () => {
    if (Platform.OS !== 'web') {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (error) {
        console.error('Haptic feedback error:', error);
      }
    }
  },

  /**
   * Medium impact feedback for important actions
   */
  impact: async () => {
    if (Platform.OS !== 'web') {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch (error) {
        console.error('Haptic feedback error:', error);
      }
    }
  },

  /**
   * Heavy impact feedback for critical actions
   */
  heavy: async () => {
    if (Platform.OS !== 'web') {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      } catch (error) {
        console.error('Haptic feedback error:', error);
      }
    }
  },

  /**
   * Success notification feedback
   */
  success: async () => {
    if (Platform.OS !== 'web') {
      try {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch (error) {
        console.error('Haptic feedback error:', error);
      }
    }
  },

  /**
   * Warning notification feedback
   */
  warning: async () => {
    if (Platform.OS !== 'web') {
      try {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      } catch (error) {
        console.error('Haptic feedback error:', error);
      }
    }
  },

  /**
   * Error notification feedback
   */
  error: async () => {
    if (Platform.OS !== 'web') {
      try {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } catch (error) {
        console.error('Haptic feedback error:', error);
      }
    }
  },

  /**
   * Selection feedback for picker/toggle changes
   */
  selection: async () => {
    if (Platform.OS !== 'web') {
      try {
        await Haptics.selectionAsync();
      } catch (error) {
        console.error('Haptic feedback error:', error);
      }
    }
  },
};
