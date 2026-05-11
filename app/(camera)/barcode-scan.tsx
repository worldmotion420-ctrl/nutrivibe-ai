import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { BarCodeScanner } from 'expo-barcode-scanner';
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
  const cameraRef = useRef<BarCodeScanner>(null);

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scannedProduct, setScannedProduct] = useState<ScannedProduct | null>(null);

  React.useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = async ({ type, data }: any) => {
    setScanned(true);
    setIsProcessing(true);
    await hapticFeedback.heavy();

    try {
      // Simulate barcode lookup - in production, this would call a real API
      // like Open Food Facts API or a custom nutrition database
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

      const product = mockProducts[data] || {
        barcode: data,
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
      setScanned(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddProduct = async () => {
    if (!scannedProduct) return;

    try {
      setIsProcessing(true);
      await hapticFeedback.success();

      // Navigate to meal confirmation with the scanned product
      // In a real app, you'd add this to the meal store
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

  if (hasPermission === null) {
    return (
      <ScreenContainer className="flex-1 items-center justify-center">
        <Text className="text-foreground">Requesting camera permission...</Text>
      </ScreenContainer>
    );
  }

  if (hasPermission === false) {
    return (
      <ScreenContainer className="flex-1 items-center justify-center px-4">
        <Text className="text-foreground text-center mb-4">
          Camera permission is required to scan barcodes
        </Text>
        <PremiumButton onPress={() => router.back()} size="lg">
          <Text className="text-background font-semibold">Go Back</Text>
        </PremiumButton>
      </ScreenContainer>
    );
  }

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
                  setScanned(false);
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
                setScanned(false);
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
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={{ flex: 1 }}
        ref={cameraRef}
      />

      {/* Overlay */}
      <View className="absolute inset-0 flex items-center justify-center">
        <View className="w-64 h-64 border-2 border-primary rounded-2xl" />
        <Text className="absolute bottom-20 text-center text-white text-sm">
          Align barcode within the frame
        </Text>
      </View>

      {/* Header */}
      <View className="absolute top-0 left-0 right-0 px-4 pt-6 pb-4 bg-gradient-to-b from-black/50 to-transparent">
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-white">Scan Barcode</Text>
          <TouchableOpacity
            onPress={() => {
              hapticFeedback.tap();
              router.back();
            }}
            className="p-2"
          >
            <MaterialIcons name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Loading Indicator */}
      {isProcessing && (
        <View className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
          <Text className="text-white mt-4">Processing barcode...</Text>
        </View>
      )}

      {/* Scanned Indicator */}
      {scanned && !isProcessing && (
        <View className="absolute bottom-20 left-0 right-0 px-4">
          <View className="bg-success/20 border border-success rounded-lg p-3">
            <Text className="text-success font-semibold text-center">
              Barcode scanned! Processing...
            </Text>
          </View>
        </View>
      )}
    </ScreenContainer>
  );
}
