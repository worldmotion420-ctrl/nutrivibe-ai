import React, { useState } from 'react';
import { View, Text, ScrollView, Image, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { CircularProgress } from '@/components/ui/circular-progress';

const MOCK_MEAL = {
  name: 'Chicken Rice Bowl',
  confidence: 0.93,
  calories: 650,
  protein: 48,
  carbs: 62,
  fat: 18,
  fiber: 3,
  ingredients: [
    { name: 'Chicken', confidence: 0.92, portion: '150g' },
    { name: 'Rice', confidence: 0.88, portion: '200g' },
    { name: 'Broccoli', confidence: 0.97, portion: '100g' },
  ],
};

export default function MealBreakdownScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [mealData] = useState(MOCK_MEAL);

  const handleConfirm = () => {
    router.push('/(camera)/voice-correction' as any);
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-6">
          {/* Meal Image */}
          {params.imageUri && (
            <GlassCard className="overflow-hidden">
              <Image
                source={{ uri: params.imageUri as string }}
                style={{ width: '100%', height: 200 }}
                resizeMode="cover"
              />
            </GlassCard>
          )}

          {/* Nutrition Summary */}
          <GlassCard className="gap-4">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-3xl font-bold text-foreground">
                  {mealData.calories}
                </Text>
                <Text className="text-xs text-muted">kcal</Text>
              </View>
              <View className="flex-1 ml-4 gap-2">
                <View className="flex-row justify-between">
                  <Text className="text-xs text-muted">Protein</Text>
                  <Text className="text-xs font-semibold text-primary">
                    {mealData.protein}g
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-xs text-muted">Carbs</Text>
                  <Text className="text-xs font-semibold text-primary">
                    {mealData.carbs}g
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-xs text-muted">Fat</Text>
                  <Text className="text-xs font-semibold text-primary">
                    {mealData.fat}g
                  </Text>
                </View>
              </View>
            </View>
          </GlassCard>

          {/* Confidence Score */}
          <GlassCard className="gap-2">
            <Text className="text-sm font-semibold text-foreground">
              ✓ Confidence: High ({Math.round(mealData.confidence * 100)}%)
            </Text>
          </GlassCard>

          {/* Detected Ingredients */}
          <View className="gap-2">
            <Text className="text-lg font-semibold text-foreground">
              Detected Items
            </Text>
            {mealData.ingredients.map((ing, idx) => (
              <GlassCard key={idx} className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="font-semibold text-foreground">
                    • {ing.name}
                  </Text>
                  <Text className="text-xs text-muted">{ing.portion}</Text>
                </View>
                <Text className="text-xs text-primary">
                  {Math.round(ing.confidence * 100)}%
                </Text>
              </GlassCard>
            ))}
          </View>

          {/* Quick Edit Actions */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-muted">Quick Edits</Text>
            <View className="flex-row gap-2 flex-wrap">
              {['Add Sauce', 'More Rice', 'Less Oil', 'Wrong Food?'].map((action) => (
                <Pressable
                  key={action}
                  style={({ pressed }) => [pressed && { opacity: 0.7 }]}
                >
                  <View className="px-3 py-2 rounded-full border border-primary">
                    <Text className="text-xs text-primary font-semibold">
                      {action}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Action Buttons */}
          <View className="gap-3 flex-row">
            <Button
              variant="secondary"
              size="lg"
              className="flex-1"
              onPress={() => router.back()}
            >
              Edit
            </Button>
            <Button
              variant="primary"
              size="lg"
              className="flex-1"
              onPress={handleConfirm}
            >
              Confirm
            </Button>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
