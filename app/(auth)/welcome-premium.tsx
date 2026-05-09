import React, { useState } from 'react';
import { View, Text, ScrollView, Animated, Easing, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenContainer } from '@/components/screen-container';
import { PremiumButton } from '@/components/ui/button-premium';
import { GlassCardPremium } from '@/components/ui/glass-card-premium';
import { spacing, typography, colors, radius, shadows } from '@/lib/design-system';

const FEATURES = [
  { icon: '📸', title: 'AI Meal Recognition', desc: 'Snap photos instantly' },
  { icon: '📊', title: 'Nutrition Tracking', desc: 'Track macros in real-time' },
  { icon: '🎯', title: 'Smart Goals', desc: 'Personalized recommendations' },
];

export default function WelcomePremiumScreen() {
  const router = useRouter();
  const [activeFeature, setActiveFeature] = useState(0);
  const slideAnim = new Animated.Value(0);

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
      { iterations: -1 }
    ).start();
  }, []);

  return (
    <ScreenContainer className="p-0">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <LinearGradient
          colors={[colors.background, colors.surface]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            paddingHorizontal: spacing.gutter,
            paddingVertical: spacing.xxxl,
            alignItems: 'center',
          }}
        >
          <Animated.View
            style={{
              opacity: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1],
              }),
            }}
          >
            <Text
              style={{
                fontSize: typography.size['4xl'],
                fontWeight: '700',
                color: colors.foreground,
                textAlign: 'center',
                letterSpacing: -0.5,
                marginBottom: spacing.md,
              }}
            >
              Track meals in seconds.
            </Text>
            <Text
              style={{
                fontSize: typography.size.lg,
                fontWeight: '400',
                color: colors.muted,
                textAlign: 'center',
                lineHeight: typography.lineHeight.relaxed,
              }}
            >
              Snap food. AI analyzes. You stay on track.
            </Text>
          </Animated.View>
        </LinearGradient>

        {/* Features Carousel */}
        <View style={{ paddingHorizontal: spacing.gutter, paddingVertical: spacing.xxxl }}>
          <Text
            style={{
              fontSize: typography.size['2xl'],
              fontWeight: '700',
              color: colors.foreground,
              marginBottom: spacing.xl,
            }}
          >
            Powerful Features
          </Text>

          <View style={{ gap: spacing.md }}>
            {FEATURES.map((feature, idx) => (
              <Pressable
                key={idx}
                onPress={() => setActiveFeature(idx)}
                style={({ pressed }) => [
                  { transform: [{ scale: pressed ? 0.98 : 1 }] },
                ]}
              >
                <GlassCardPremium
                  padding={spacing.lg}
                  glow={activeFeature === idx}
                  shadow="md"
                >
                  <View style={{ flexDirection: 'row', gap: spacing.lg, alignItems: 'center' }}>
                    <Text style={{ fontSize: 40 }}>{feature.icon}</Text>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: typography.size.md,
                          fontWeight: '600',
                          color: colors.foreground,
                          marginBottom: spacing.xs,
                        }}
                      >
                        {feature.title}
                      </Text>
                      <Text
                        style={{
                          fontSize: typography.size.sm,
                          fontWeight: '400',
                          color: colors.muted,
                        }}
                      >
                        {feature.desc}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontSize: 20,
                        color: activeFeature === idx ? colors.primary : colors.muted,
                      }}
                    >
                      →
                    </Text>
                  </View>
                </GlassCardPremium>
              </Pressable>
            ))}
          </View>
        </View>

        {/* CTA Section */}
        <View
          style={{
            paddingHorizontal: spacing.gutter,
            paddingVertical: spacing.xxxl,
            gap: spacing.lg,
          }}
        >
          <PremiumButton
            variant="primary"
            size="lg"
            fullWidth
            glow
            onPress={() => router.push('/(auth)/sign-up' as any)}
          >
            Get Started Free
          </PremiumButton>

          <PremiumButton
            variant="outline"
            size="lg"
            fullWidth
            onPress={() => router.push('/(auth)/sign-in' as any)}
          >
            Sign In
          </PremiumButton>

          <Text
            style={{
              fontSize: typography.size.xs,
              fontWeight: '400',
              color: colors.muted,
              textAlign: 'center',
              marginTop: spacing.md,
            }}
          >
            No credit card required • 7-day free trial
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
