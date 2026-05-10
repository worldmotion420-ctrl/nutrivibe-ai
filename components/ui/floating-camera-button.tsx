import React, { useRef } from 'react';
import { Pressable, View, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { MaterialIcons } from '@expo/vector-icons';

interface FloatingCameraButtonProps {
  onPress?: () => void;
}

export function FloatingCameraButton({ onPress }: FloatingCameraButtonProps) {
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = async () => {
    // Haptic feedback
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Scale animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    if (onPress) {
      onPress();
    } else {
      router.push('/(camera)/lens-groq' as any);
    }
  };

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }],
        position: 'absolute',
        bottom: 80,
        right: 20,
      }}
    >
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          {
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: '#CCFF00',
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#CCFF00',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.6,
            shadowRadius: 12,
            elevation: 8,
            opacity: pressed ? 0.8 : 1,
          },
        ]}
      >
        <MaterialIcons name="camera-alt" size={28} color="#000" />
      </Pressable>
    </Animated.View>
  );
}
