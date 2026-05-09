import React, { useState } from 'react';
import { View, Text, Pressable, Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenContainer } from '@/components/screen-container';
import { spacing, typography, colors, radius, shadows } from '@/lib/design-system';

export default function LensPremiumScreen() {
  const router = useRouter();
  const [isCapturing, setIsCapturing] = useState(false);
  const pulseAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(1);

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
      { iterations: -1 }
    ).start();
  }, []);

  const handleCapture = () => {
    setIsCapturing(true);

    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      router.push('/(camera)/processing' as any);
    }, 800);
  };

  return (
    <ScreenContainer className="p-0">
      <LinearGradient
        colors={[colors.background, colors.surface]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1, justifyContent: 'space-between', alignItems: 'center' }}
      >
        {/* Header */}
        <View
          style={{
            paddingHorizontal: spacing.gutter,
            paddingVertical: spacing.xl,
            width: '100%',
          }}
        >
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
          >
            <Text
              style={{
                fontSize: typography.size.xl,
                fontWeight: '600',
                color: colors.primary,
              }}
            >
              ← Back
            </Text>
          </Pressable>
        </View>

        {/* Camera Placeholder */}
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          <View
            style={{
              width: '80%',
              aspectRatio: 1,
              borderRadius: radius.xl,
              overflow: 'hidden',
              ...shadows.glowLg,
            }}
          >
            <LinearGradient
              colors={[colors.surfaceLight, colors.surface]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 2,
                borderColor: colors.primary,
              }}
            >
              <Text style={{ fontSize: 60 }}>📷</Text>
              <Text
                style={{
                  fontSize: typography.size.md,
                  fontWeight: '600',
                  color: colors.muted,
                  marginTop: spacing.md,
                }}
              >
                Camera Feed
              </Text>
            </LinearGradient>

            {/* Pulse overlay */}
            <Animated.View
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: radius.xl,
                borderWidth: 3,
                borderColor: colors.primary,
                opacity: pulseAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.3, 0],
                }),
                transform: [
                  {
                    scale: pulseAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1.2],
                    }),
                  },
                ],
              }}
            />
          </View>

          {/* Capture indicator */}
          <View
            style={{
              marginTop: spacing.xl,
              alignItems: 'center',
              gap: spacing.md,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: spacing.sm,
              }}
            >
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: colors.success,
                }}
              />
              <Text
                style={{
                  fontSize: typography.size.sm,
                  fontWeight: '500',
                  color: colors.muted,
                }}
              >
                Camera Ready
              </Text>
            </View>
          </View>
        </View>

        {/* Capture Button */}
        <View
          style={{
            paddingHorizontal: spacing.gutter,
            paddingVertical: spacing.xxxl,
            width: '100%',
            alignItems: 'center',
          }}
        >
          <Pressable
            onPress={handleCapture}
            disabled={isCapturing}
            style={({ pressed }) => [
              {
                transform: [
                  {
                    scale: pressed && !isCapturing ? scaleAnim : 1,
                  },
                ],
              },
            ]}
          >
            <Animated.View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: colors.primary,
                justifyContent: 'center',
                alignItems: 'center',
                ...shadows.glowLg,
                transform: [{ scale: scaleAnim }],
              }}
            >
              <Text style={{ fontSize: 40 }}>📸</Text>
            </Animated.View>
          </Pressable>

          <Text
            style={{
              fontSize: typography.size.sm,
              fontWeight: '500',
              color: colors.muted,
              marginTop: spacing.lg,
            }}
          >
            Tap to capture
          </Text>
        </View>
      </LinearGradient>
    </ScreenContainer>
  );
}
