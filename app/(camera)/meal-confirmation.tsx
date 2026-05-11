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
  
  const [foods, setFoods] = useState<FoodItem[]>(
    (detectionResult?.foods || []).map((food: any) => ({
      ...food,
      portion: food.portion || '1 serving',
    }))
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingPortion, setEditingPortion] = useState('');

  const totalCalories = foods.reduce((sum, food) => sum + food.calories, 0);
  const totalProtein = foods.reduce((sum, food) => sum + food.protein, 0);
  const totalCarbs = foods.reduce((sum, food) => sum + food.carbs, 0);
  const totalFat = foods.reduce((sum, food) => sum + food.fat, 0);
  const totalFiber = foods.reduce((sum, food) => sum + food.fiber, 0);

  const handleEditPortion = (index: number, currentPortion: string) => {
    setEditingIndex(index);
    setEditingPortion(currentPortion);
  };

  const handleSavePortion = (index: number) => {
    const updatedFoods = [...foods];
    updatedFoods[index].portion = editingPortion;
    setFoods(updatedFoods);
    setEditingIndex(null);
    hapticFeedback.tap();
  };

  const handleRemoveFood = (index: number) => {
    const updatedFoods = foods.filter((_, i) => i !== index);
    setFoods(updatedFoods);
    hapticFeedback.tap();
  };

  const handleConfirmMeal = async () => {
    if (foods.length === 0) {
      Alert.alert('No Foods', 'Please add at least one food item');
      return;
    }

    try {
      setIsSubmitting(true);
      await hapticFeedback.heavy();

      // Add meal to store
      const mealData = {
        meal_name: foods.map(f => f.name).join(', '),
        meal_type: 'meal',
        logged_at: new Date().toISOString(),
        calories: totalCalories,
        protein: totalProtein,
        carbs: totalCarbs,
        fat: totalFat,
        fiber: totalFiber,
        water_ml: 0,
        foods_detected: foods.map(f => f.name).join(', '),
        confidence_score: foods.reduce((sum, f) => sum + f.confidence, 0) / foods.length,
        user_id: '',
        image_url: '',
        ai_notes: 'Meal detected via AI camera',
      };

      await addMeal(mealData as any);
      await hapticFeedback.success();

      Alert.alert('Success', 'Meal logged successfully!', [
        {
          text: 'OK',
          onPress: () => {
            router.push('/(tabs)' as any);
          },
        },
      ]);
    } catch (error) {
      console.error('Error confirming meal:', error);
      Alert.alert('Error', 'Failed to log meal. Please try again.');
      await hapticFeedback.error();
    } finally {
      setIsSubmitting(false);
    }
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
              Confirm Meal
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
          <Text className="text-sm text-muted">
            Review and adjust your meal details
          </Text>
        </View>

        {/* Nutrition Summary */}
        <View className="px-4 mb-6">
          <GlassCardPremium className="p-4">
            <Text className="text-lg font-semibold text-foreground mb-4">
              Total Nutrition
            </Text>
            <View className="space-y-3">
              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-muted">Calories</Text>
                <Text className="text-lg font-bold text-primary">
                  {Math.round(totalCalories)} kcal
                </Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-muted">Protein</Text>
                <Text className="text-sm font-semibold text-foreground">
                  {Math.round(totalProtein)}g
                </Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-muted">Carbs</Text>
                <Text className="text-sm font-semibold text-foreground">
                  {Math.round(totalCarbs)}g
                </Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-muted">Fat</Text>
                <Text className="text-sm font-semibold text-foreground">
                  {Math.round(totalFat)}g
                </Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-muted">Fiber</Text>
                <Text className="text-sm font-semibold text-foreground">
                  {Math.round(totalFiber)}g
                </Text>
              </View>
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
                  <View className="flex-row items-center mt-1">
                    <View className="bg-primary/20 rounded-full px-2 py-1 mr-2">
                      <Text className="text-xs font-semibold text-primary">
                        {Math.round(food.confidence * 100)}% confident
                      </Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    hapticFeedback.tap();
                    handleRemoveFood(index);
                  }}
                  className="p-2"
                >
                  <MaterialIcons name="close" size={20} color={colors.error} />
                </TouchableOpacity>
              </View>

              {/* Portion Editor */}
              {editingIndex === index ? (
                <View className="mb-3 flex-row items-center">
                  <Text className="text-sm text-muted mr-2">Portion:</Text>
                  <View className="flex-1 bg-surface rounded-lg px-3 py-2 mr-2">
                    <Text
                      className="text-foreground"
                      onPress={() => {
                        // This would open a portion picker in a real app
                        handleSavePortion(index);
                      }}
                    >
                      {editingPortion}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleSavePortion(index)}
                    className="p-2"
                  >
                    <MaterialIcons name="check" size={20} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    hapticFeedback.tap();
                    handleEditPortion(index, food.portion);
                  }}
                  className="mb-3 flex-row items-center justify-between bg-surface/50 rounded-lg px-3 py-2"
                >
                  <Text className="text-sm text-muted">Portion</Text>
                  <Text className="text-sm font-semibold text-foreground">
                    {food.portion}
                  </Text>
                </TouchableOpacity>
              )}

              {/* Nutrition Details */}
              <View className="space-y-2">
                <View className="flex-row justify-between">
                  <Text className="text-xs text-muted">Calories</Text>
                  <Text className="text-xs font-semibold text-foreground">
                    {Math.round(food.calories)} kcal
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-xs text-muted">Protein</Text>
                  <Text className="text-xs font-semibold text-foreground">
                    {Math.round(food.protein)}g
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-xs text-muted">Carbs</Text>
                  <Text className="text-xs font-semibold text-foreground">
                    {Math.round(food.carbs)}g
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-xs text-muted">Fat</Text>
                  <Text className="text-xs font-semibold text-foreground">
                    {Math.round(food.fat)}g
                  </Text>
                </View>
              </View>
            </GlassCardPremium>
          ))}
        </View>

        {/* Quick Actions */}
        <View className="px-4 mb-6">
          <Text className="text-sm font-semibold text-muted mb-2">
            Quick Actions
          </Text>
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => {
                hapticFeedback.tap();
                // Add more rice action
              }}
              className="flex-1 bg-surface rounded-lg px-3 py-2"
            >
              <Text className="text-xs font-semibold text-foreground text-center">
                + More Rice
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                hapticFeedback.tap();
                // Add sauce action
              }}
              className="flex-1 bg-surface rounded-lg px-3 py-2"
            >
              <Text className="text-xs font-semibold text-foreground text-center">
                + Add Sauce
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                hapticFeedback.tap();
                // Less oil action
              }}
              className="flex-1 bg-surface rounded-lg px-3 py-2"
            >
              <Text className="text-xs font-semibold text-foreground text-center">
                - Less Oil
              </Text>
            </TouchableOpacity>
          </View>
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
