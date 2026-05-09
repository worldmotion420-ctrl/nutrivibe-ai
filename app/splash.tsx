import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useAuthStore } from '@/lib/stores/auth-store';

export default function SplashScreen() {
  const router = useRouter();
  const { isAuthenticated, restoreSession } = useAuthStore();

  useEffect(() => {
    const initializeApp = async () => {
      // Restore session from storage
      await restoreSession();

      // Simulate splash screen duration
      setTimeout(() => {
        if (isAuthenticated) {
          router.replace('/(tabs)');
        } else {
          router.replace('/(auth)/welcome' as any);
        }
      }, 2000);
    };

    initializeApp();
  }, []);

  return (
    <ScreenContainer className="items-center justify-center">
      <View className="items-center gap-4">
        {/* Logo */}
        <View className="w-24 h-24 rounded-full border-4 border-primary items-center justify-center">
          <Text className="text-4xl">🍃</Text>
        </View>

        {/* App Name */}
        <View className="items-center gap-2">
          <Text className="text-4xl font-bold text-foreground">
            NutriVibe
          </Text>
          <Text className="text-lg text-primary font-semibold">AI</Text>
        </View>

        {/* Tagline */}
        <Text className="text-center text-muted text-base mt-4">
          Nutrition tracking that thinks for you.
        </Text>

        {/* Loading indicator */}
        <View className="mt-8">
          <Text className="text-primary text-sm">Loading...</Text>
        </View>
      </View>
    </ScreenContainer>
  );
}
