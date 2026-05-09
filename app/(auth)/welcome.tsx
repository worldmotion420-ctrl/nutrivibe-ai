import React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { Button } from '@/components/ui/button';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 p-6 gap-8">
          {/* Header */}
          <View className="items-center gap-2 mt-8">
            <View className="w-20 h-20 rounded-full border-4 border-primary items-center justify-center">
              <Text className="text-4xl">🍃</Text>
            </View>
            <Text className="text-3xl font-bold text-foreground">
              Track meals in seconds.
            </Text>
            <Text className="text-base text-muted text-center">
              Snap food. AI handles the rest.
            </Text>
          </View>

          {/* Feature preview */}
          <View className="flex-1 gap-4">
            <View className="bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-sm text-primary font-semibold mb-2">📸 AI Camera</Text>
              <Text className="text-sm text-muted">
                Point at your meal and let AI identify everything instantly.
              </Text>
            </View>

            <View className="bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-sm text-primary font-semibold mb-2">📊 Smart Tracking</Text>
              <Text className="text-sm text-muted">
                Automatic nutrition calculation with voice corrections.
              </Text>
            </View>

            <View className="bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-sm text-primary font-semibold mb-2">💡 AI Insights</Text>
              <Text className="text-sm text-muted">
                Personalized recommendations to reach your nutrition goals.
              </Text>
            </View>
          </View>

          {/* CTA Buttons */}
          <View className="gap-3">
            <Button
              variant="primary"
              size="lg"
              onPress={() => router.push('/(auth)/goal-selection' as any)}
            >
              Get Started
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onPress={() => router.push('/(auth)/sign-in' as any)}
            >
              Sign In
            </Button>
          </View>

          {/* Skip button */}
          <View className="items-center">
            <Button
              variant="ghost"
              size="sm"
              onPress={() => router.push('/(auth)/goal-selection' as any)}
            >
              Skip
            </Button>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
