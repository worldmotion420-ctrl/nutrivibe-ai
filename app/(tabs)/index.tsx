import React, { useEffect } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { CircularProgress } from '@/components/ui/circular-progress';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { FloatingCameraButton } from '@/components/ui/floating-camera-button';
import { useMealStore } from '@/lib/stores/meal-store';
import { useAuthStore } from '@/lib/stores/auth-store';

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { meals, dailySummary, fetchTodaysMeals } = useMealStore();

  useEffect(() => {
    if (user?.id) {
      fetchTodaysMeals(user.id);
    }
  }, [user?.id]);

  const calorieTarget = user?.daily_calorie_target || 2200;
  const proteinTarget = user?.daily_protein_target || 100;
  const currentCalories = dailySummary?.total_calories || 0;
  const currentProtein = dailySummary?.total_protein_g || 0;

  const handleAddMeal = () => {
    router.push('/(camera)/capture' as any);
  };

  return (
    <ScreenContainer className="p-6">
      <View className="flex-1 relative">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          <View className="gap-6">
            {/* Header */}
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-2xl font-bold text-foreground">
                  Good Evening, {user?.full_name?.split(' ')[0] || 'Michael'}
                </Text>
                <Text className="text-sm text-muted">👋</Text>
              </View>
              <Pressable>
                <Text className="text-2xl">🔔</Text>
              </Pressable>
            </View>

            {/* Calorie Progress */}
            <GlassCard className="items-center py-8">
              <CircularProgress
                current={currentCalories}
                target={calorieTarget}
                radius={70}
                strokeWidth={6}
                unit="kcal"
              />
            </GlassCard>

            {/* Macro Breakdown */}
            <GlassCard className="gap-4">
              <Text className="text-lg font-semibold text-foreground">Today's Macros</Text>
              <View className="gap-3">
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm text-muted">Protein</Text>
                  <Text className="text-sm font-semibold text-primary">
                    {Math.round(currentProtein)}g / {proteinTarget}g
                  </Text>
                </View>
                <View className="h-2 bg-surface rounded-full overflow-hidden">
                  <View
                    className="h-full bg-primary"
                    style={{
                      width: `${Math.min((currentProtein / proteinTarget) * 100, 100)}%`,
                    }}
                  />
                </View>

                <View className="flex-row items-center justify-between">
                  <Text className="text-sm text-muted">Carbs</Text>
                  <Text className="text-sm font-semibold text-primary">
                    {Math.round(dailySummary?.total_carbs_g || 0)}g
                  </Text>
                </View>

                <View className="flex-row items-center justify-between">
                  <Text className="text-sm text-muted">Fat</Text>
                  <Text className="text-sm font-semibold text-primary">
                    {Math.round(dailySummary?.total_fat_g || 0)}g
                  </Text>
                </View>

                <View className="flex-row items-center justify-between">
                  <Text className="text-sm text-muted">Water</Text>
                  <Text className="text-sm font-semibold text-primary">
                    {(dailySummary?.total_water_ml || 0).toFixed(1)}L
                  </Text>
                </View>
              </View>
            </GlassCard>

            {/* AI Insight */}
            <GlassCard className="gap-2">
              <View className="flex-row items-center gap-2">
                <Text className="text-lg">✨</Text>
                <Text className="text-sm font-semibold text-foreground">AI Insight</Text>
              </View>
              <Text className="text-sm text-muted">
                You're low on protein today. Try adding more to dinner.
              </Text>
            </GlassCard>

            {/* Today's Meals */}
            <View className="gap-3">
              <Text className="text-lg font-semibold text-foreground">Today's Meals</Text>
              {meals.length > 0 ? (
                meals.map((meal) => (
                  <Pressable
                    key={meal.id}
                    onPress={() => {
                      // Navigate to meal detail
                    }}
                    style={({ pressed }) => [pressed && { opacity: 0.7 }]}
                  >
                    <GlassCard className="flex-row items-center justify-between">
                      <View className="flex-1 gap-1">
                        <Text className="font-semibold text-foreground capitalize">
                          {meal.meal_type}
                        </Text>
                        <Text className="text-sm text-muted">{meal.meal_name}</Text>
                      </View>
                      <Text className="font-semibold text-primary">
                        {meal.total_calories} kcal
                      </Text>
                    </GlassCard>
                  </Pressable>
                ))
              ) : (
                <GlassCard className="items-center py-6">
                  <Text className="text-muted">No meals logged yet</Text>
                </GlassCard>
              )}
            </View>

            {/* Quick Add Button */}
            <Button
              variant="primary"
              size="lg"
              onPress={handleAddMeal}
            >
              + Add Meal
            </Button>
          </View>
        </ScrollView>

        {/* Floating Camera Button - Outside ScrollView */}
        <FloatingCameraButton onPress={handleAddMeal} />
      </View>
    </ScreenContainer>
  );
}
