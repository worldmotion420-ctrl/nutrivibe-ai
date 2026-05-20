import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { ScreenContainer } from '@/components/screen-container';
import { GlassCard } from '@/components/ui/glass-card';
import { SkeletonMealCard } from '@/components/ui/skeleton-loader';
import { useMealStore } from '@/lib/stores/meal-store';
import { useAuthStore } from '@/lib/stores/auth-store';
import { hapticFeedback } from '@/lib/utils/haptics';

interface MealGroup {
  date: string;
  meals: any[];
}

export default function HistoryScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { fetchMealHistory, isLoading, deleteMeal } = useMealStore();
  const [filter, setFilter] = useState('all');
  const [mealGroups, setMealGroups] = useState<MealGroup[]>([]);
  const [error, setError] = useState<string | null>(null);

  const filters = ['All', 'Meals', 'Snacks'];

  // Fetch meal history on mount and when user changes
  useEffect(() => {
    if (user?.id) {
      loadMealHistory();
    }
  }, [user?.id]);

  const loadMealHistory = async () => {
    if (!user?.id) return;

    try {
      setError(null);
      
      // Fetch last 30 days of meals
      const endDate = new Date().toISOString();
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

      const meals = await fetchMealHistory(user.id, startDate, endDate);

      // Group meals by date
      const grouped = groupMealsByDate(meals);
      setMealGroups(grouped);
    } catch (err: any) {
      console.error('Failed to load meal history:', err);
      setError(err.message || 'Failed to load meal history');
    }
  };

  const groupMealsByDate = (meals: any[]): MealGroup[] => {
    const groups: { [key: string]: any[] } = {};

    meals.forEach((meal) => {
      const date = new Date(meal.logged_at);
      const dateStr = date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });

      if (!groups[dateStr]) {
        groups[dateStr] = [];
      }
      groups[dateStr].push(meal);
    });

    // Sort by date (newest first)
    return Object.entries(groups)
      .sort(([dateA], [dateB]) => {
        const a = new Date(dateA);
        const b = new Date(dateB);
        return b.getTime() - a.getTime();
      })
      .map(([date, mealList]) => ({
        date,
        meals: mealList.sort((a, b) => 
          new Date(b.logged_at).getTime() - new Date(a.logged_at).getTime()
        ),
      }));
  };

  const getFilteredMeals = (meals: any[]) => {
    if (filter === 'all') return meals;
    if (filter === 'meals') {
      return meals.filter((m) => ['breakfast', 'lunch', 'dinner'].includes(m.meal_type));
    }
    if (filter === 'snacks') {
      return meals.filter((m) => m.meal_type === 'snack');
    }
    return meals;
  };

  const handleDeleteMeal = async (mealId: string) => {
    Alert.alert('Delete Meal', 'Are you sure you want to delete this meal?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Delete',
        onPress: async () => {
          try {
            await hapticFeedback.impact();
            await deleteMeal(mealId);
            await hapticFeedback.success();
            Alert.alert('Success', 'Meal deleted');
            await loadMealHistory();
          } catch (err: any) {
            await hapticFeedback.error();
            Alert.alert('Error', err.message || 'Failed to delete meal');
          }
        },
        style: 'destructive',
      },
    ]);
  };

  const getMealTypeEmoji = (mealType: string) => {
    switch (mealType) {
      case 'breakfast':
        return '🌅';
      case 'lunch':
        return '🍽️';
      case 'dinner':
        return '🌙';
      case 'snack':
        return '🍿';
      default:
        return '🍽️';
    }
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-2xl font-bold text-foreground">
              Meal History
            </Text>
            <Text className="text-sm text-muted">
              Track your meals over time
            </Text>
          </View>

          {/* Filter Tabs */}
          <View className="flex-row gap-2">
            {filters.map((f) => (
              <Pressable
                key={f}
                onPress={() => {
                  setFilter(f.toLowerCase());
                  hapticFeedback.tap();
                }}
                style={({ pressed }) => [pressed && { opacity: 0.7 }]}
              >
                <View
                  className={`px-4 py-2 rounded-full ${
                    filter === f.toLowerCase()
                      ? 'bg-primary'
                      : 'bg-surface border border-border'
                  }`}
                >
                  <Text
                    className={`text-sm font-semibold ${
                      filter === f.toLowerCase()
                        ? 'text-background'
                        : 'text-foreground'
                    }`}
                  >
                    {f}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>

          {/* Loading State */}
          {isLoading && mealGroups.length === 0 && (
            <View className="gap-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <SkeletonMealCard key={i} />
              ))}
            </View>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <View className="p-4 rounded-lg bg-error/10 border border-error">
              <Text className="text-sm text-error">{error}</Text>
              <Pressable
                onPress={loadMealHistory}
                className="mt-2 p-2 rounded bg-error/20"
              >
                <Text className="text-sm font-semibold text-error">Retry</Text>
              </Pressable>
            </View>
          )}

          {/* Empty State */}
          {!isLoading && mealGroups.length === 0 && !error && (
            <View className="items-center justify-center py-12 gap-3">
              <Text className="text-4xl">🍽️</Text>
              <Text className="text-lg font-semibold text-foreground">No meals logged yet</Text>
              <Text className="text-sm text-muted text-center">
                Start tracking by taking a photo of your meal or scanning a barcode
              </Text>
            </View>
          )}

          {/* Meals Timeline */}
          {!isLoading &&
            mealGroups.map((day) => {
              const filteredMeals = getFilteredMeals(day.meals);
              if (filteredMeals.length === 0) return null;

              return (
                <View key={day.date} className="gap-3">
                  <Text className="text-sm font-semibold text-muted">
                    {day.date}
                  </Text>
                  {filteredMeals.map((meal) => (
                  <View key={meal.id} className="flex-row gap-2">
                    <Pressable
                      onPress={() => router.push(`/(camera)/meal-edit?mealId=${meal.id}`)}
                      style={({ pressed }) => [pressed && { opacity: 0.7 }]}
                      className="flex-1"
                    >
                      <GlassCard className="gap-2">
                        <View className="flex-row items-center justify-between">
                          <View className="flex-1 gap-1">
                            <View className="flex-row items-center gap-2">
                              <Text className="text-lg">
                                {getMealTypeEmoji(meal.meal_type)}
                              </Text>
                              <Text className="font-semibold text-foreground flex-1">
                                {meal.meal_name}
                              </Text>
                            </View>
                            <Text className="text-xs text-muted">
                              {formatTime(meal.logged_at)}
                            </Text>
                          </View>
                          <View className="items-end gap-1">
                            <Text className="font-semibold text-primary">
                              {Math.round(meal.total_calories)} kcal
                            </Text>
                            <Text className="text-xs text-muted">
                              {Math.round(meal.protein_g)}g protein
                            </Text>
                          </View>
                        </View>

                        {/* Ingredients Preview */}
                        {meal.ingredients && meal.ingredients.length > 0 && (
                          <View className="pt-2 border-t border-border/50">
                            <Text className="text-xs text-muted mb-1">
                              {meal.ingredients.length} ingredient{meal.ingredients.length !== 1 ? 's' : ''}:
                            </Text>
                            <Text className="text-xs text-foreground">
                              {meal.ingredients
                                .map((ing: any) => ing.ingredient_name)
                                .join(', ')}
                            </Text>
                          </View>
                        )}

                        {/* Delete Hint */}
                        <Text className="text-xs text-muted text-center pt-1">
                          Long press to delete
                        </Text>
                      </GlassCard>
                    </Pressable>
                    <Pressable
                      onPress={() => handleDeleteMeal(meal.id)}
                      style={({ pressed }) => [pressed && { opacity: 0.7 }]}
                      className="p-3 rounded-xl bg-error/10 border border-error items-center justify-center"
                    >
                      <Text className="text-lg">🗑️</Text>
                    </Pressable>                  </View>
                ))}
                </View>
              );
            })}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}