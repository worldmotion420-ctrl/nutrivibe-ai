import React, { useRef, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { Button } from '@/components/ui/button';
import { MaterialIcons } from '@expo/vector-icons';

import { groqAI } from '@/lib/services/groq-ai';
import { hapticFeedback } from '@/lib/utils/haptics';
import { useFoodDetectionStore } from '@/lib/stores/food-detection-store';
import type { FoodDetectionResult } from '@/lib/services/groq-ai';

export default function CaptureScreen() {
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [isCapturing, setIsCapturing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { setDetectionResult } = useFoodDetectionStore();

  // Request camera permission
  React.useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  const handleCapture = async () => {
    if (!cameraRef.current || isCapturing || isProcessing) return;

    try {
      setIsCapturing(true);
      await hapticFeedback.impact();

      // Take photo
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: true,
      });

      if (!photo) {
        Alert.alert('Error', 'Failed to capture photo');
        setIsCapturing(false);
        return;
      }

      setIsProcessing(true);

      // Process with Groq AI
      const result = await groqAI.detectFoodsInImage(
        photo.base64 || ''
      );

      if (result.success && result.foods && result.foods.length > 0) {
        // Store detection result
        const detectionData: FoodDetectionResult = {
          success: true,
          foods: result.foods,
          totalCalories: result.totalCalories,
          confidence: result.confidence,
          processingTime: result.processingTime,
        };
        setDetectionResult(detectionData);

        // Navigate to meal breakdown
        await hapticFeedback.success();
        router.push('/(camera)/meal-breakdown' as any);
      } else {
        Alert.alert('No Food Detected', 'Please try again with a clearer image of food');
        await hapticFeedback.error();
      }
    } catch (error) {
      console.error('Capture error:', error);
      Alert.alert('Error', 'Failed to process image');
      await hapticFeedback.error();
    } finally {
      setIsCapturing(false);
      setIsProcessing(false);
    }
  };

  if (!permission?.granted) {
    return (
      <ScreenContainer className="items-center justify-center">
        <View className="gap-4 items-center">
          <MaterialIcons name="camera-alt" size={48} color="#CCFF00" />
          <Text className="text-lg font-semibold text-foreground">Camera Permission Required</Text>
          <Text className="text-sm text-muted text-center">
            We need camera access to scan your meals
          </Text>
          <Button
            variant="primary"
            size="lg"
            onPress={requestPermission}
          >
            Grant Permission
          </Button>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-0">
      <View className="flex-1 bg-background">
        {/* Camera View */}
        <CameraView
          ref={cameraRef}
          style={{ flex: 1 }}
          facing="back"
        >
          {/* Top Bar */}
          <View className="flex-row items-center justify-between p-4 bg-black/30">
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [pressed && { opacity: 0.7 }]}
            >
              <MaterialIcons name="close" size={28} color="#fff" />
            </Pressable>
            <Text className="text-white font-semibold">Scan Your Meal</Text>
            <View style={{ width: 28 }} />
          </View>

          {/* Center Guide */}
          <View className="flex-1 items-center justify-center">
            <View
              style={{
                width: 280,
                height: 280,
                borderRadius: 20,
                borderWidth: 2,
                borderColor: '#CCFF00',
                backgroundColor: 'transparent',
              }}
            />
            <Text className="text-white text-sm mt-4 text-center px-6">
              Position your meal inside the frame
            </Text>
          </View>

          {/* Bottom Controls */}
          <View className="flex-row items-center justify-center gap-4 p-6 bg-black/30">
            {/* Capture Button */}
            <Pressable
              onPress={handleCapture}
              disabled={isCapturing || isProcessing}
              style={({ pressed }) => [
                {
                  width: 70,
                  height: 70,
                  borderRadius: 35,
                  backgroundColor: isCapturing || isProcessing ? '#CCFF00' : '#CCFF00',
                  justifyContent: 'center',
                  alignItems: 'center',
                  opacity: isCapturing || isProcessing ? 0.6 : 1,
                },
                pressed && { transform: [{ scale: 0.95 }] },
              ]}
            >
              {isCapturing || isProcessing ? (
                <ActivityIndicator color="#000" size="large" />
              ) : (
                <View
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    borderWidth: 3,
                    borderColor: '#000',
                  }}
                />
              )}
            </Pressable>
          </View>
        </CameraView>

        {/* Processing Overlay */}
        {isProcessing && (
          <View className="absolute inset-0 bg-black/50 items-center justify-center">
            <View className="gap-4 items-center">
              <ActivityIndicator color="#CCFF00" size="large" />
              <Text className="text-white font-semibold">Analyzing meal...</Text>
            </View>
          </View>
        )}
      </View>
    </ScreenContainer>
  );
}
