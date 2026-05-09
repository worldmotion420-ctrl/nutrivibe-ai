import React, { useState } from 'react';
import { View, Text, ScrollView, Image, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';

const MOCK_PRODUCT = {
  name: 'Oats & Honey Granola',
  brand: 'Nature Valley',
  calories: 120,
  protein: 3,
  carbs: 20,
  fat: 2,
  servingSize: '30g',
  image: '🥣',
};

export default function BarcodeScannerScreen() {
  const router = useRouter();
  const [servings, setServings] = useState(1);
  const [scanned, setScanned] = useState(false);

  const handleAddServing = () => {
    // TODO: Add meal to database
    router.replace('/(tabs)');
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-2xl font-bold text-foreground">
              Scan Product
            </Text>
            <Text className="text-sm text-muted">
              Point at barcode or nutrition label
            </Text>
          </View>

          {!scanned ? (
            // Camera placeholder
            <GlassCard className="items-center justify-center py-24 border-2 border-dashed border-primary">
              <View className="gap-4 items-center">
                <Text className="text-4xl">📷</Text>
                <Text className="text-sm text-muted">Camera placeholder</Text>
              </View>
            </GlassCard>
          ) : (
            // Product info
            <>
              {/* Product Image */}
              <GlassCard className="items-center py-12">
                <Text className="text-6xl">{MOCK_PRODUCT.image}</Text>
              </GlassCard>

              {/* Product Details */}
              <GlassCard className="gap-3">
                <View>
                  <Text className="text-lg font-bold text-foreground">
                    {MOCK_PRODUCT.name}
                  </Text>
                  <Text className="text-sm text-muted">
                    {MOCK_PRODUCT.brand}
                  </Text>
                </View>
                <Text className="text-xs text-muted">
                  {MOCK_PRODUCT.servingSize} per serving
                </Text>
              </GlassCard>

              {/* Nutrition Facts */}
              <GlassCard className="gap-3">
                <Text className="text-sm font-semibold text-foreground">
                  Nutrition Facts
                </Text>
                <View className="gap-2">
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-muted">Calories</Text>
                    <Text className="text-sm font-semibold text-primary">
                      {MOCK_PRODUCT.calories}
                    </Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-muted">Protein</Text>
                    <Text className="text-sm font-semibold text-primary">
                      {MOCK_PRODUCT.protein}g
                    </Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-muted">Carbs</Text>
                    <Text className="text-sm font-semibold text-primary">
                      {MOCK_PRODUCT.carbs}g
                    </Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-muted">Fat</Text>
                    <Text className="text-sm font-semibold text-primary">
                      {MOCK_PRODUCT.fat}g
                    </Text>
                  </View>
                </View>
              </GlassCard>

              {/* Serving Size Selector */}
              <GlassCard className="gap-3">
                <Text className="text-sm font-semibold text-foreground">
                  Servings
                </Text>
                <View className="flex-row items-center justify-between">
                  <Pressable
                    onPress={() => setServings(Math.max(1, servings - 1))}
                    style={({ pressed }) => [pressed && { opacity: 0.7 }]}
                  >
                    <View className="w-10 h-10 rounded-full border border-primary items-center justify-center">
                      <Text className="text-primary font-bold">−</Text>
                    </View>
                  </Pressable>
                  <Text className="text-lg font-semibold text-foreground">
                    {servings}
                  </Text>
                  <Pressable
                    onPress={() => setServings(servings + 1)}
                    style={({ pressed }) => [pressed && { opacity: 0.7 }]}
                  >
                    <View className="w-10 h-10 rounded-full border border-primary items-center justify-center">
                      <Text className="text-primary font-bold">+</Text>
                    </View>
                  </Pressable>
                </View>
              </GlassCard>

              {/* CTA */}
              <Button
                variant="primary"
                size="lg"
                onPress={handleAddServing}
              >
                Add {servings} Serving{servings !== 1 ? 's' : ''}
              </Button>
            </>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
