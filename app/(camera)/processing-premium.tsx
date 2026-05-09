import React, { useEffect, useState } from 'react';
import { View, Text, Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenContainer } from '@/components/screen-container';
import { spacing, typography, colors, radius } from '@/lib/design-system';

const STEPS = [
  { label: 'Detecting food items', emoji: '🔍' },
  { label: 'Estimating portions', emoji: '📏' },
  { label: 'Calculating macros', emoji: '🧮' },
];

export default function ProcessingPremiumScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const rotateAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);
  const progressAnim = new Animated.Value(0);

  useEffect(() => {
    // Rotate animation for loading spinner
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Scale animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
      { iterations: -1 }
    ).start();

    // Progress animation
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 3000,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();

    // Step progression
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < STEPS.length - 1) return prev + 1;
        return prev;
      });
    }, 1000);

    // Navigate after all steps complete
    const navigateTimer = setTimeout(() => {
      router.push('/(camera)/meal-breakdown' as any);
    }, 4000);

    return () => {
      clearInterval(stepInterval);
      clearTimeout(navigateTimer);
    };
  }, [router]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <ScreenContainer className="p-0">
      <LinearGradient
        colors={[colors.background, colors.surface]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: spacing.gutter,
        }}
      >
        {/* Animated Circle */}
        <View
          style={{
            width: 200,
            height: 200,
            borderRadius: 100,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: spacing.xxxl,
          }}
        >
          {/* Outer ring */}
          <Animated.View
            style={{
              position: 'absolute',
              width: 200,
              height: 200,
              borderRadius: 100,
              borderWidth: 3,
              borderColor: colors.primary,
              opacity: 0.3,
              transform: [{ rotate: rotateInterpolate }],
            }}
          />

          {/* Middle ring */}
          <Animated.View
            style={{
              position: 'absolute',
              width: 140,
              height: 140,
              borderRadius: 70,
              borderWidth: 2,
              borderColor: colors.primary,
              opacity: 0.5,
              transform: [
                {
                  rotate: rotateAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '-360deg'],
                  }),
                },
              ],
            }}
          />

          {/* Center content */}
          <Animated.View
            style={{
              transform: [{ scale: scaleAnim }],
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 60 }}>{STEPS[currentStep].emoji}</Text>
          </Animated.View>
        </View>

        {/* Status Text */}
        <View style={{ alignItems: 'center', gap: spacing.md, marginBottom: spacing.xxxl }}>
          <Text
            style={{
              fontSize: typography.size.lg,
              fontWeight: '600',
              color: colors.foreground,
            }}
          >
            Analyzing Ingredients...
          </Text>
          <Text
            style={{
              fontSize: typography.size.md,
              fontWeight: '400',
              color: colors.muted,
              textAlign: 'center',
            }}
          >
            {STEPS[currentStep].label}
          </Text>
        </View>

        {/* Progress Bar */}
        <View
          style={{
            width: '100%',
            height: 4,
            backgroundColor: colors.surface,
            borderRadius: radius.full,
            overflow: 'hidden',
            marginBottom: spacing.xl,
          }}
        >
          <Animated.View
            style={{
              height: '100%',
              backgroundColor: colors.primary,
              borderRadius: radius.full,
              width: progressWidth,
            }}
          />
        </View>

        {/* Steps Indicator */}
        <View style={{ flexDirection: 'row', gap: spacing.md }}>
          {STEPS.map((_, idx) => (
            <View
              key={idx}
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor:
                  idx <= currentStep ? colors.primary : colors.border,
                opacity: idx <= currentStep ? 1 : 0.3,
              }}
            />
          ))}
        </View>
      </LinearGradient>
    </ScreenContainer>
  );
}
