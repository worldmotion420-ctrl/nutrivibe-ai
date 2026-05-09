import React, { useEffect } from 'react';
import { View, Text, Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { spacing, typography, colors, animations } from '@/lib/design-system';

export default function SplashPremiumScreen() {
  const router = useRouter();
  const scaleAnim = new Animated.Value(0.8);
  const opacityAnim = new Animated.Value(0);
  const glowAnim = new Animated.Value(0);

  useEffect(() => {
    // Staggered animations
    Animated.sequence([
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        { iterations: -1 }
      ),
    ]).start();

    // Navigate after 3 seconds
    const timer = setTimeout(() => {
      router.replace('/(auth)/welcome' as any);
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <LinearGradient
      colors={[colors.background, colors.surfaceLight]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    >
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        }}
      >
        {/* Glow background */}
        <Animated.View
          style={{
            position: 'absolute',
            width: 200,
            height: 200,
            borderRadius: 100,
            backgroundColor: colors.primary,
            opacity: glowAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.1, 0.3],
            }),
            filter: [{ blur: 40 }],
          }}
        />

        {/* Logo container */}
        <View
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: spacing.xl,
          }}
        >
          <Text style={{ fontSize: 60 }}>🍃</Text>
        </View>
      </Animated.View>

      {/* Text */}
      <Animated.View
        style={{
          opacity: opacityAnim,
          marginTop: spacing.xl,
        }}
      >
        <Text
          style={{
            fontSize: typography.size['3xl'],
            fontWeight: '700',
            color: colors.foreground,
            textAlign: 'center',
            letterSpacing: -0.5,
          }}
        >
          NutriVibe AI
        </Text>
        <Text
          style={{
            fontSize: typography.size.md,
            fontWeight: '400',
            color: colors.muted,
            textAlign: 'center',
            marginTop: spacing.sm,
            letterSpacing: 0.3,
          }}
        >
          Nutrition tracking that thinks like you
        </Text>
      </Animated.View>
    </LinearGradient>
  );
}
