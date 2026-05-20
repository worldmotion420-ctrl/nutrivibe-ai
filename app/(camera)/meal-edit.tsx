import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Alert, TextInput, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { useMealStore } from '@/lib/stores/meal-store';
import { hapticFeedback } from '@/lib/utils/haptics';

interface EditedIngredient {
  id: string;
  ingredient_name: string;
  portion_size: string;
  portion_grams: number;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  multiplier: number; // For portion adjustment
}

export default function MealEditScreen() {
  const router = useRouter();
  const { mealId } = useLocalSearchParams<{ mealId: string }>();
  const { meals, updateMeal, isLoading } = useMealStore();

  const [mealName, setMealName] = useState('');
  const [ingredients, setIngredients] = useState<EditedIngredient[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mealId) {
      const meal = meals.find((m) => m.id === mealId);
      if (meal) {
        setMealName(meal.meal_name);
        setIngredients(
          meal.ingredients.map((ing) => ({
            ...ing,
            multiplier: 1,
          }))
        );
      }
    }
  }, [mealId, meals]);

  const updateIngredientMultiplier = (index: number, multiplier: number) => {
    const updated = [...ingredients];
    updated[index].multiplier = Math.max(0.1, multiplier);
    setIngredients(updated);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const calculateTotals = () => {
    return ingredients.reduce(
      (acc, ing) => ({
        calories: acc.calories + ing.calories * ing.multiplier,
        protein: acc.protein + ing.protein_g * ing.multiplier,
        carbs: acc.carbs + ing.carbs_g * ing.multiplier,
        fat: acc.fat + ing.fat_g * ing.multiplier,
        fiber: acc.fiber + ing.fiber_g * ing.multiplier,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
    );
  };

  const handleSave = async () => {
    if (!mealId) {
      Alert.alert('Error', 'Meal ID not found');
      return;
    }

    if (ingredients.length === 0) {
      Alert.alert('Error', 'Please add at least one ingredient');
      return;
    }

    try {
      setIsSaving(true);
      await hapticFeedback.impact();

      const totals = calculateTotals();

      // Update meal with new values
      await updateMeal(mealId, {
        meal_name: mealName,
        total_calories: totals.calories,
        protein_g: totals.protein,
        carbs_g: totals.carbs,
        fat_g: totals.fat,
        fiber_g: totals.fiber,
        ingredients: ingredients.map(({ multiplier, ...ing }) => ing) as any,
      });

      await hapticFeedback.success();
      Alert.alert('Success', 'Meal updated', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (err: any) {
      await hapticFeedback.error();
      setError(err.message || 'Failed to update meal');
      Alert.alert('Error', err.message || 'Failed to update meal');
    } finally {
      setIsSaving(false);
    }
  };

  const totals = calculateTotals();

  if (isLoading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator size="large" color="#CCFF00" />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-2xl font-bold text-foreground">
              Edit Meal
            </Text>
            <Text className="text-sm text-muted">
              Adjust portions and ingredients
            </Text>
          </View>

          {/* Error State */}
          {error && (
            <View className="p-4 rounded-lg bg-error/10 border border-error">
              <Text className="text-sm text-error">{error}</Text>
            </View>
          )}

          {/* Meal Name */}
          <GlassCard className="gap-2">
            <Text className="text-xs font-semibold text-muted">MEAL NAME</Text>
            <TextInput
              value={mealName}
              onChangeText={setMealName}
              placeholder="Enter meal name"
              placeholderTextColor="#687076"
              className="text-base text-foreground p-3 rounded-lg bg-surface border border-border"
            />
          </GlassCard>

          {/* Ingredients */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">
              Ingredients ({ingredients.length})
            </Text>

            {ingredients.map((ing, idx) => (
              <GlassCard key={ing.id} className="gap-3">
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="font-semibold text-foreground">
                      {ing.ingredient_name}
                    </Text>
                    <Text className="text-xs text-muted">
                      {ing.portion_size}
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => removeIngredient(idx)}
                    className="p-2"
                  >
                    <Text className="text-lg">✕</Text>
                  </Pressable>
                </View>

                {/* Portion Multiplier */}
                <View className="gap-2">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-sm text-muted">Portion Size</Text>
                    <View className="flex-row items-center gap-2">
                      <Pressable
                        onPress={() =>
                          updateIngredientMultiplier(
                            idx,
                            ing.multiplier - 0.25
                          )
                        }
                        className="w-8 h-8 rounded bg-surface items-center justify-center"
                      >
                        <Text className="text-lg">−</Text>
                      </Pressable>
                      <TextInput
                        value={ing.multiplier.toFixed(2)}
                        onChangeText={(val) => {
                          const num = parseFloat(val) || 1;
                          updateIngredientMultiplier(idx, num);
                        }}
                        keyboardType="decimal-pad"
                        className="w-12 text-center text-foreground p-2 rounded bg-surface border border-border"
                      />
                      <Pressable
                        onPress={() =>
                          updateIngredientMultiplier(
                            idx,
                            ing.multiplier + 0.25
                          )
                        }
                        className="w-8 h-8 rounded bg-surface items-center justify-center"
                      >
                        <Text className="text-lg">+</Text>
                      </Pressable>
                    </View>
                  </View>

                  {/* Nutrition for this ingredient */}
                  <View className="pt-2 border-t border-border/50 gap-1">
                    <View className="flex-row justify-between">
                      <Text className="text-xs text-muted">Calories</Text>
                      <Text className="text-xs font-semibold text-primary">
                        {Math.round(ing.calories * ing.multiplier)} kcal
                      </Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-xs text-muted">Protein</Text>
                      <Text className="text-xs font-semibold text-primary">
                        {(ing.protein_g * ing.multiplier).toFixed(1)}g
                      </Text>
                    </View>
                  </View>
                </View>
              </GlassCard>
            ))}
          </View>

          {/* Totals */}
          <GlassCard className="gap-3 border-l-4 border-l-primary">
            <Text className="text-sm font-semibold text-foreground">
              Updated Totals
            </Text>
            <View className="gap-2">
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">Calories</Text>
                <Text className="text-sm font-semibold text-primary">
                  {Math.round(totals.calories)} kcal
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">Protein</Text>
                <Text className="text-sm font-semibold text-primary">
                  {totals.protein.toFixed(1)}g
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">Carbs</Text>
                <Text className="text-sm font-semibold text-primary">
                  {totals.carbs.toFixed(1)}g
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">Fat</Text>
                <Text className="text-sm font-semibold text-primary">
                  {totals.fat.toFixed(1)}g
                </Text>
              </View>
            </View>
          </GlassCard>

          {/* Action Buttons */}
          <View className="gap-3">
            <Button
              variant="primary"
              size="lg"
              onPress={handleSave}
              disabled={isSaving || ingredients.length === 0}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onPress={() => router.back()}
              disabled={isSaving}
            >
              Cancel
            </Button>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
