import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { Button } from '@/components/ui/button';
import { useOnboardingStore } from '@/lib/stores/onboarding-store';

const GOALS = [
  { id: 'lose_weight', label: 'Lose Weight', icon: '⬇️' },
  { id: 'build_muscle', label: 'Build Muscle', icon: '💪' },
  { id: 'maintain', label: 'Maintain', icon: '⚖️' },
  { id: 'improve_energy', label: 'Improve Energy', icon: '⚡' },
  { id: 'high_protein', label: 'High Protein', icon: '🥚' },
  { id: 'custom', label: 'Custom', icon: '⚙️' },
];

export default function GoalSelectionScreen() {
  const router = useRouter();
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const { setGoal } = useOnboardingStore();

  const handleContinue = async () => {
    if (!selectedGoal) return;

    try {
      setGoal(selectedGoal);
      router.push('/(auth)/metrics-setup' as any);
    } catch (error) {
      console.error('Failed to set goal:', error);
    }
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">
              What's your goal?
            </Text>
            <Text className="text-base text-muted">
              Choose one to personalize your experience.
            </Text>
          </View>

          {/* Goal Grid */}
          <View className="gap-3 flex-1">
            {GOALS.map((goal) => (
              <Pressable
                key={goal.id}
                onPress={() => setSelectedGoal(goal.id)}
                style={({ pressed }) => [
                  pressed && { opacity: 0.7 },
                ]}
              >
                <View
                  className={`p-4 rounded-2xl border-2 flex-row items-center gap-3 ${
                    selectedGoal === goal.id
                      ? 'bg-primary border-primary'
                      : 'bg-surface border-border'
                  }`}
                >
                  <Text className="text-2xl">{goal.icon}</Text>
                  <Text
                    className={`text-lg font-semibold ${
                      selectedGoal === goal.id
                        ? 'text-background'
                        : 'text-foreground'
                    }`}
                  >
                    {goal.label}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>

          {/* CTA */}
          <Button
            variant="primary"
            size="lg"
            disabled={!selectedGoal}
            onPress={handleContinue}
          >
            Continue
          </Button>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
