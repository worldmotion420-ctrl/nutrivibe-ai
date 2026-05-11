import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenContainer } from '@/components/screen-container';
import { PremiumButton } from '@/components/ui/button-premium';
import { GlassCardPremium } from '@/components/ui/glass-card-premium';
import { useFoodDetectionStore } from '@/lib/stores/food-detection-store';
import { useMealStore } from '@/lib/stores/meal-store';
import { useAuthStore } from '@/lib/stores/auth-store';
import { hapticFeedback } from '@/lib/utils/haptics';
import { useColors } from '@/hooks/use-colors';

interface FoodItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  portion: string;
  confidence: number;
}

export default function MealConfirmationScreen() {
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  
  const { detectionResult } = useFoodDetectionStore();
  const { addMeal } = useMealStore();
  const { user } = useAuthStore();
  
  const [foods, setFoods] = useState<FoodItem[]>(
    (detectionResult?.foods || []).map((food: any) => ({
      ...food,
      portion: food.portion || '1 serving',
    }))
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingPortion, setEditingPortion] = useState('');

  const totalCalories = foods.reduce((sum, f) => sum + f.calories, 0);
  const totalProtein = foods.reduce((sum, f) => sum + f.protein, 0);
  const totalCarbs = foods.reduce((sum, f) => sum + f.carbs, 0);
  const totalFat = foods.reduce((sum, f) => sum + f.fat, 0);
  const totalFiber = foods.reduce((sum, f) => sum + f.fiber, 0);

  const handleConfirmMeal = async () => {
    if (foods.length === 0) {
      Alert.alert('No Foods', 'Please add at least one food item');
      return;
    }

    if (!user?.id) {
      Alert.alert('Error', 'User not authenticated. Please sign in.');
      return;
    }

    try {
      setIsSubmitting(true);
      await hapticFeedback.heavy();

      const mealData = {
        user_id: user.id,
        meal_name: foods.map(f => f.name).join(', '),
        meal_type: 'breakfast' as const,
        logged_at: new Date().toISOString(),
        total_calories: totalCalories,
        protein_g: totalProtein,
        carbs_g: totalCarbs,
        fat_g: totalFat,
        fiber_g: totalFiber,
        water_ml: 0,
        ai_detected: true,
        voice_corrected: false,
        ingredients: foods.map((f, idx) => ({
          id: `${Date.now()}-${idx}`,
          ingredient_name: f.name,
          portion_size: f.portion || '1 serving',
          portion_grams: 100,
          calories: f.calories || 0,
          protein_g: f.protein || 0,
          carbs_g: f.carbs || 0,
          fat_g: f.fat || 0,
          fiber_g: f.fiber || 0,
          ai_detected: true,
          confidence_score: f.confidence || 0.8,
        })),
      };

      await addMeal(mealData);
      await hapticFeedback.success();

      Alert.alert('Success', 'Meal logged successfully!', [
        {
          text: 'OK',
          onPress: () => {
            router.push('/(tabs)' as any);
          },
        },
      ]);
    } catch (error: any) {
      console.error('Meal logging error:', error);
      await hapticFeedback.error();
      Alert.alert('Error', error.message || 'Failed to log meal. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveFood = async (index: number) => {
    setFoods(foods.filter((_, i) => i !== index));
    await hapticFeedback.tap();
  };

  const handleEditPortion = (index: number) => {
    setEditingIndex(index);
    setEditingPortion(foods[index].portion);
  };

  const handleSavePortion = () => {
    if (editingIndex !== null && editingPortion.trim()) {
      const updatedFoods = [...foods];
      updatedFoods[editingIndex].portion = editingPortion;
      setFoods(updatedFoods);
      setEditingIndex(null);
      setEditingPortion('');
      hapticFeedback.tap();
    }
  };

  const handleQuickAction = (index: number, action: string) => {
    const updatedFoods = [...foods];
    const food = updatedFoods[index];

    switch (action) {
      case 'more':
        food.calories = Math.round(food.calories * 1.2);
        food.protein = Math.round(food.protein * 1.2 * 10) / 10;
        food.carbs = Math.round(food.carbs * 1.2 * 10) / 10;
        food.fat = Math.round(food.fat * 1.2 * 10) / 10;
        break;
      case 'less':
        food.calories = Math.round(food.calories * 0.8);
        food.protein = Math.round(food.protein * 0.8 * 10) / 10;
        food.carbs = Math.round(food.carbs * 0.8 * 10) / 10;
        food.fat = Math.round(food.fat * 0.8 * 10) / 10;
        break;
    }

    setFoods(updatedFoods);
    hapticFeedback.tap();
  };

  return (
    <ScreenContainer
      className="flex-1 bg-background"
      edges={['top', 'left', 'right']}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="px-4 pt-6 pb-4">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-3xl font-bold text-foreground">
              Meal Breakdown
            </Text>
            <TouchableOpacity
              onPress={() => {
                hapticFeedback.tap();
                router.back();
              }}
              className="p-2"
            >
              <MaterialIcons name="close" size={24} color={colors.foreground} />
            </TouchableOpacity>
          </View>
          <Text className="text-sm text-muted">Review and adjust your meal</Text>
        </View>

        {/* Nutrition Summary */}
        <View className="px-4 mb-6">
          <GlassCardPremium className="p-6">
            <View className="flex-row justify-around mb-4">
              <View className="items-center">
                <Text className="text-3xl font-bold text-primary">
                  {totalCalories}
                </Text>
                <Text className="text-xs text-muted mt-1">Calories</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-foreground">
                  {totalProtein}g
                </Text>
                <Text className="text-xs text-muted mt-1">Protein</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-foreground">
                  {totalCarbs}g
                </Text>
                <Text className="text-xs text-muted mt-1">Carbs</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-foreground">
                  {totalFat}g
                </Text>
                <Text className="text-xs text-muted mt-1">Fat</Text>
              </View>
            </View>
            <View className="border-t border-border/30 pt-4">
              <Text className="text-xs text-muted">Fiber: {totalFiber}g</Text>
            </View>
          </GlassCardPremium>
        </View>

        {/* Food Items */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-semibold text-foreground mb-3">
            Detected Foods
          </Text>
          {foods.map((food, index) => (
            <GlassCardPremium key={index} className="mb-3 p-4">
              <View className="flex-row justify-between items-start mb-3">
                <View className="flex-1">
                  <Text className="text-base font-semibold text-foreground">
                    {food.name}
                  </Text>
                  <View className="flex-row items-center gap-2 mt-1">
                    <Text className="text-xs text-muted">
                      Confidence: {Math.round(food.confidence * 100)}%
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => handleRemoveFood(index)}
                  className="p-2"
                >
                  <MaterialIcons name="close" size={20} color={colors.error} />
                </TouchableOpacity>
              </View>

              {/* Nutrition Details */}
              <View className="bg-surface/50 rounded-lg p-3 mb-3">
                <View className="flex-row justify-between mb-2">
                  <Text className="text-xs text-muted">Calories</Text>
                  <Text className="text-sm font-semibold text-primary">
                    {food.calories}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-xs text-muted">
                    P: {food.protein}g | C: {food.carbs}g | F: {food.fat}g
                  </Text>
                </View>
              </View>

              {/* Portion Edit */}
              {editingIndex === index ? (
                <View className="flex-row gap-2 mb-3">
                  <TouchableOpacity
                    onPress={() => setEditingPortion(editingPortion.slice(0, -1))}
                    className="flex-1 bg-surface rounded-lg p-2"
                  >
                    <Text className="text-xs text-muted text-center">
                      {editingPortion || 'Enter portion'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleSavePortion}
                    className="bg-primary rounded-lg px-4 py-2"
                  >
                    <Text className="text-xs font-semibold text-background">Save</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => handleEditPortion(index)}
                  className="bg-surface/50 rounded-lg p-2 mb-3"
                >
                  <Text className="text-xs text-muted text-center">
                    Portion: {food.portion}
                  </Text>
                </TouchableOpacity>
              )}

              {/* Quick Actions */}
              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={() => handleQuickAction(index, 'less')}
                  className="flex-1 bg-surface rounded-lg py-2"
                >
                  <Text className="text-xs font-semibold text-foreground text-center">
                    Less
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleQuickAction(index, 'more')}
                  className="flex-1 bg-surface rounded-lg py-2"
                >
                  <Text className="text-xs font-semibold text-foreground text-center">
                    More
                  </Text>
                </TouchableOpacity>
              </View>
            </GlassCardPremium>
          ))}
        </View>
      </ScrollView>

      {/* Confirm Button */}
      <View
        className="absolute bottom-0 left-0 right-0 px-4 pb-4"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <PremiumButton
          onPress={handleConfirmMeal}
          disabled={isSubmitting || foods.length === 0}
          size="lg"
          fullWidth
          glow
        >
          {isSubmitting ? (
            <ActivityIndicator color={colors.background} size="small" />
          ) : (
            <Text className="text-base font-semibold text-background">
              Confirm & Log Meal
            </Text>
          )}
        </PremiumButton>
      </View>
    </ScreenContainer>
  );
}
