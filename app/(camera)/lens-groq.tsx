import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenContainer } from '@/components/screen-container';
import { GlassCardPremium } from '@/components/ui/glass-card-premium';
import { PremiumButton } from '@/components/ui/button-premium';
import { useFoodDetectionStore } from '@/lib/stores/food-detection-store';
import { groqAI } from '@/lib/services/groq-ai';
import { spacing, typography, colors } from '@/lib/design-system';
import { useRouter } from 'expo-router';
import * as FileSystem from 'expo-file-system/legacy';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';

export default function LensGroqScreen() {
  const router = useRouter();
  const cameraRef = useRef<CameraView | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  const {
    isDetecting,
    detectedFoods,
    totalCalories,
    confidence,
    error,
    setIsDetecting,
    setDetectionResult,
    clearDetection,
  } = useFoodDetectionStore();

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  if (!permission?.granted) {
    return (
      <ScreenContainer className="p-4 justify-center items-center">
        <Text style={{ fontSize: typography.size.lg, color: colors.foreground }}>
          Camera permission required
        </Text>
      </ScreenContainer>
    );
  }

  const captureAndDetect = async () => {
    if (!cameraRef.current || isCapturing) return;

    setIsCapturing(true);
    clearDetection();

    try {
      console.log('📸 Capturing image...');
      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
        quality: 0.8,
      });

      if (!photo.base64) {
        throw new Error('Failed to capture image');
      }

      console.log('🔍 Sending to Groq AI...');
      setIsDetecting(true);

      const result = await groqAI.detectFoodsInImage(photo.base64);
      setDetectionResult(result);

      if (result.success && result.foods.length > 0) {
        console.log(`✓ Detected ${result.foods.length} foods`);
        // Auto-navigate to processing screen
        setTimeout(() => {
          router.push('/(camera)/processing-groq');
        }, 500);
      } else {
        console.warn('No foods detected or low confidence');
      }
    } catch (err) {
      console.error('Capture error:', err);
      setIsDetecting(false);
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <ScreenContainer className="p-0 bg-background">
      {/* Camera View */}
      <View style={{ flex: 1, position: 'relative' }}>
        <CameraView
          ref={cameraRef}
          style={{ flex: 1 }}
          facing="back"
          onCameraReady={() => setIsCameraReady(true)}
        />

        {/* Overlay */}
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {/* Scanning Frame */}
          <View
            style={{
              width: 280,
              height: 280,
              borderWidth: 2,
              borderColor: colors.primary,
              borderRadius: 20,
              backgroundColor: 'transparent',
              shadowColor: colors.primary,
              shadowOpacity: 0.5,
              shadowRadius: 20,
              elevation: 10,
            }}
          />

          {/* Corner Accents */}
          {[
            { top: 40, left: 40 },
            { top: 40, right: 40 },
            { bottom: 40, left: 40 },
            { bottom: 40, right: 40 },
          ].map((pos, idx) => (
            <View
              key={idx}
              style={{
                position: 'absolute',
                width: 20,
                height: 20,
                borderColor: colors.primary,
                borderWidth: 2,
                ...pos,
              }}
            />
          ))}
        </View>

        {/* Status Bar */}
        <LinearGradient
          colors={[colors.background, 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.lg,
            zIndex: 10,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Pressable onPress={() => router.back()}>
              <Text style={{ fontSize: typography.size.xl, color: colors.primary }}>✕</Text>
            </Pressable>

            <Text
              style={{
                fontSize: typography.size.md,
                fontWeight: '600',
                color: colors.foreground,
              }}
            >
              Position Food
            </Text>

            <View style={{ width: 24 }} />
          </View>
        </LinearGradient>

        {/* Bottom Controls */}
        <LinearGradient
          colors={['transparent', colors.background]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.xl,
            zIndex: 10,
          }}
        >
          <View style={{ gap: spacing.lg }}>
            {/* Detection Info */}
            {isDetecting && (
              <View
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 12,
                  padding: spacing.md,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: spacing.md,
                }}
              >
                <ActivityIndicator color={colors.primary} />
                <Text
                  style={{
                    fontSize: typography.size.sm,
                    color: colors.foreground,
                    flex: 1,
                  }}
                >
                  Analyzing image...
                </Text>
              </View>
            )}

            {error && (
              <View
                style={{
                  backgroundColor: colors.error,
                  borderRadius: 12,
                  padding: spacing.md,
                }}
              >
                <Text
                  style={{
                    fontSize: typography.size.sm,
                    color: 'white',
                  }}
                >
                  {error}
                </Text>
              </View>
            )}

            {/* Capture Button */}
            <PremiumButton
              onPress={captureAndDetect}
              disabled={!isCameraReady || isCapturing || isDetecting}
              size="lg"
            >
              <View style={{ alignItems: 'center' }}>
                <Text
                  style={{
                    fontSize: typography.size.lg,
                    fontWeight: '700',
                    color: colors.background,
                  }}
                >
                  📸 Capture Meal
                </Text>
              </View>
            </PremiumButton>

            {/* Info Text */}
            <Text
              style={{
                fontSize: typography.size.xs,
                color: colors.muted,
                textAlign: 'center',
              }}
            >
              Center your food in the frame for best results
            </Text>
          </View>
        </LinearGradient>
      </View>
    </ScreenContainer>
  );
}
