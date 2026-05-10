import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useOnboardingStore } from '@/lib/stores/onboarding-store';

export default function MetricsSetupScreen() {
  const router = useRouter();
  const { setMetrics: setOnboardingMetrics } = useOnboardingStore();
  const [metrics, setMetrics] = useState({
    age: '28',
    height: '175',
    weight: '70',
    activityLevel: 'moderate',
  });

  const handleContinue = async () => {
    try {
      setOnboardingMetrics({
        age: parseInt(metrics.age),
        height_cm: parseInt(metrics.height),
        weight_kg: parseFloat(metrics.weight),
        activity_level: metrics.activityLevel,
      });
      router.push('/(auth)/permissions' as any);
    } catch (error) {
      console.error('Failed to set metrics:', error);
    }
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">
              Tell us about you
            </Text>
            <Text className="text-base text-muted">
              This helps AI personalize your targets.
            </Text>
          </View>

          {/* Form */}
          <View className="gap-4 flex-1">
            <Input
              label="Age"
              placeholder="28"
              value={metrics.age}
              onChangeText={(text) => setMetrics({ ...metrics, age: text })}
              keyboardType="number-pad"
            />

            <Input
              label="Height (cm)"
              placeholder="175"
              value={metrics.height}
              onChangeText={(text) => setMetrics({ ...metrics, height: text })}
              keyboardType="number-pad"
            />

            <Input
              label="Weight (kg)"
              placeholder="70"
              value={metrics.weight}
              onChangeText={(text) => setMetrics({ ...metrics, weight: text })}
              keyboardType="decimal-pad"
            />

            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">
                Activity Level
              </Text>
              <View className="gap-2">
                {['sedentary', 'light', 'moderate', 'active', 'very_active'].map(
                  (level) => (
                    <Pressable
                      key={level}
                      onPress={() =>
                        setMetrics({ ...metrics, activityLevel: level })
                      }
                      style={({ pressed }) => [pressed && { opacity: 0.7 }]}
                    >
                      <View
                        className={`p-3 rounded-lg border ${
                          metrics.activityLevel === level
                            ? 'bg-primary border-primary'
                            : 'bg-surface border-border'
                        }`}
                      >
                        <Text
                          className={`font-medium capitalize ${
                            metrics.activityLevel === level
                              ? 'text-background'
                              : 'text-foreground'
                          }`}
                        >
                          {level.replace('_', ' ')}
                        </Text>
                      </View>
                    </Pressable>
                  )
                )}
              </View>
            </View>
          </View>

          {/* CTA */}
          <Button
            variant="primary"
            size="lg"
            onPress={handleContinue}
          >
            Continue
          </Button>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}


