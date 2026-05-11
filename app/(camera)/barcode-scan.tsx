import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  TextInput,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenContainer } from '@/components/screen-container';
import { PremiumButton } from '@/components/ui/button-premium';
import { GlassCardPremium } from '@/components/ui/glass-card-premium';
import { hapticFeedback } from '@/lib/utils/haptics';
import { useColors } from '@/hooks/use-colors';

interface ScannedProduct {
  barcode: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  servingSize: string;
  brand: string;
}

export default function BarcodeScanScreen() {
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const [isProcessing, setIsProcessing] = useState(false);
  const [scannedProduct, setScannedProduct] = useState<ScannedProduct | null>(null);
  const [barcodeInput, setBarcodeInput] = useState('');

  // Mock product database
  const mockProducts: { [key: string]: ScannedProduct } = {
    '5901234123457': {
      barcode: '5901234123457',
      name: 'Whole Wheat Bread',
      calories: 265,
      protein: 9,
      carbs: 49,
      fat: 3,
      fiber: 7,
      servingSize: '100g (2 slices)',
      brand: 'Nature\'s Best',
    },
    '8718215050220': {
      barcode: '8718215050220',
      name: 'Greek Yogurt',
      calories: 59,
      protein: 10,
      carbs: 3,
      fat: 0.4,
      fiber: 0,
      servingSize: '100g',
      brand: 'Fage',
    },
    '012000007962': {
      barcode: '012000007962',
      name: 'Coca-Cola',
      calories: 140,
      protein: 0,
      carbs: 39,
      fat: 0,
      fiber: 0,
      servingSize: '355ml (1 can)',
      brand: 'Coca-Cola',
    },
  };

  const handleScanBarcode = async () => {
    if (!barcodeInput.trim()) {
      Alert.alert('Error', 'Please enter a barcode');
      return;
    }

    setIsProcessing(true);
    await hapticFeedback.heavy();

    try {
      // Simulate barcode lookup
      const product = mockProducts[barcodeInput] || {
        barcode: barcodeInput,
        name: 'Unknown Product',
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
        servingSize: '1 serving',
        brand: 'Unknown',
      };

      setScannedProduct(product);
      await hapticFeedback.success();
    } catch (error) {
      console.error('Barcode scan error:', error);
      Alert.alert('Error', 'Failed to lookup product');
      await hapticFeedback.error();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddProduct = async () => {
    if (!scannedProduct) return;

    try {
      setIsProcessing(true);
      await hapticFeedback.success();

      Alert.alert('Success', `${scannedProduct.name} added to meal!`, [
        {
          text: 'OK',
          onPress: () => {
            router.back();
          },
        },
      ]);
    } catch (error) {
      console.error('Error adding product:', error);
      Alert.alert('Error', 'Failed to add product');
      await hapticFeedback.error();
    } finally {
      setIsProcessing(false);
    }
  };

  if (scannedProduct) {
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
                Product Details
              </Text>
              <TouchableOpacity
                onPress={() => {
                  hapticFeedback.tap();
                  setScannedProduct(null);
                  setBarcodeInput('');
                }}
                className="p-2"
              >
                <MaterialIcons name="close" size={24} color={colors.foreground} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Product Info */}
          <View className="px-4 mb-6">
            <GlassCardPremium className="p-6">
              <View className="mb-4">
                <Text className="text-2xl font-bold text-foreground mb-1">
                  {scannedProduct.name}
                </Text>
                <Text className="text-sm text-muted">{scannedProduct.brand}</Text>
                <Text className="text-xs text-muted mt-2">
                  Barcode: {scannedProduct.barcode}
                </Text>
              </View>

              <View className="bg-surface/50 rounded-lg p-3 mb-4">
                <Text className="text-xs text-muted mb-1">Serving Size</Text>
                <Text className="text-sm font-semibold text-foreground">
                  {scannedProduct.servingSize}
                </Text>
              </View>

              <View className="space-y-2">
                <View className="flex-row justify-between">
                  <Text className="text-sm text-muted">Calories</Text>
                  <Text className="text-lg font-bold text-primary">
                    {scannedProduct.calories}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-sm text-muted">Protein</Text>
                  <Text className="text-sm font-semibold text-foreground">
                    {scannedProduct.protein}g
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-sm text-muted">Carbs</Text>
                  <Text className="text-sm font-semibold text-foreground">
                    {scannedProduct.carbs}g
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-sm text-muted">Fat</Text>
                  <Text className="text-sm font-semibold text-foreground">
                    {scannedProduct.fat}g
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-sm text-muted">Fiber</Text>
                  <Text className="text-sm font-semibold text-foreground">
                    {scannedProduct.fiber}g
                  </Text>
                </View>
              </View>
            </GlassCardPremium>
          </View>

          {/* Action Buttons */}
          <View className="px-4 gap-3 mb-6">
            <PremiumButton
              onPress={handleAddProduct}
              disabled={isProcessing}
              size="lg"
              fullWidth
              glow
            >
              {isProcessing ? (
                <ActivityIndicator color={colors.background} size="small" />
              ) : (
                <Text className="text-base font-semibold text-background">
                  Add to Meal
                </Text>
              )}
            </PremiumButton>
            <TouchableOpacity
              onPress={() => {
                hapticFeedback.tap();
                setScannedProduct(null);
                setBarcodeInput('');
              }}
              className="py-3 rounded-lg border border-border"
            >
              <Text className="text-center font-semibold text-foreground">
                Scan Another
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="flex-1 bg-background" edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-4 pt-6 pb-4 flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-foreground">Scan Barcode</Text>
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

        {/* Info Card */}
        <View className="px-4 mb-6">
          <GlassCardPremium className="p-6">
            <View className="flex-row items-start gap-3 mb-4">
              <MaterialIcons name="info" size={24} color={colors.primary} />
              <View className="flex-1">
                <Text className="text-sm font-semibold text-foreground mb-1">
                  {Platform.OS === 'web' ? 'Testing Mode' : 'Camera Scanner'}
                </Text>
                <Text className="text-xs text-muted">
                  {Platform.OS === 'web'
                    ? 'Enter a barcode number to test. Try: 5901234123457, 8718215050220, or 012000007962'
                    : 'Point your camera at a barcode to scan it'}
                </Text>
              </View>
            </View>
          </GlassCardPremium>
        </View>

        {/* Barcode Input */}
        <View className="px-4 mb-6">
          <Text className="text-sm font-semibold text-foreground mb-2">
            Barcode Number
          </Text>
          <TextInput
            placeholder="Enter barcode (e.g., 5901234123457)"
            placeholderTextColor={colors.muted}
            value={barcodeInput}
            onChangeText={setBarcodeInput}
            editable={!isProcessing}
            className="px-4 py-3 rounded-lg bg-surface border border-border text-foreground"
            style={{ color: colors.foreground }}
          />
        </View>

        {/* Scan Button */}
        <View className="px-4 mb-6">
          <PremiumButton
            onPress={handleScanBarcode}
            disabled={isProcessing || !barcodeInput.trim()}
            size="lg"
            fullWidth
            glow
          >
            {isProcessing ? (
              <ActivityIndicator color={colors.background} size="small" />
            ) : (
              <View className="flex-row items-center justify-center gap-2">
                <MaterialIcons name="qr-code-2" size={20} color={colors.background} />
                <Text className="text-base font-semibold text-background">
                  Lookup Product
                </Text>
              </View>
            )}
          </PremiumButton>
        </View>

        {/* Sample Barcodes */}
        <View className="px-4">
          <Text className="text-sm font-semibold text-foreground mb-3">
            Sample Barcodes to Try
          </Text>
          <View className="gap-2">
            {[
              { code: '5901234123457', name: 'Whole Wheat Bread' },
              { code: '8718215050220', name: 'Greek Yogurt' },
              { code: '012000007962', name: 'Coca-Cola' },
            ].map((item) => (
              <TouchableOpacity
                key={item.code}
                onPress={() => {
                  setBarcodeInput(item.code);
                  hapticFeedback.tap();
                }}
                className="p-3 rounded-lg bg-surface border border-border/50"
              >
                <Text className="text-sm font-medium text-foreground">
                  {item.name}
                </Text>
                <Text className="text-xs text-muted mt-1">{item.code}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
