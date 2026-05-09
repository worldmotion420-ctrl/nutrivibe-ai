import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenContainer } from '@/components/screen-container';
import { GlassCardPremium } from '@/components/ui/glass-card-premium';
import { PremiumButton } from '@/components/ui/button-premium';
import { CircularProgress } from '@/components/ui/circular-progress';
import { spacing, typography, colors, radius, shadows } from '@/lib/design-system';

export default function DashboardPremiumScreen() {
  const router = useRouter();
  const [selectedMacro, setSelectedMacro] = useState<'protein' | 'carbs' | 'fat' | null>(null);
  const scaleAnim = new Animated.Value(0.9);

  React.useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 8,
    }).start();
  }, []);

  const macros = [
    { label: 'Protein', value: 100, target: 150, color: colors.primary, icon: '🥚' },
    { label: 'Carbs', value: 180, target: 250, color: '#FF6B6B', icon: '🍚' },
    { label: 'Fat', value: 65, target: 80, color: '#4ECDC4', icon: '🥑' },
  ];

  return (
    <ScreenContainer className="p-0">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <LinearGradient
          colors={[colors.background, colors.surface]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            paddingHorizontal: spacing.gutter,
            paddingVertical: spacing.xl,
          }}
        >
          <Text
            style={{
              fontSize: typography.size.md,
              fontWeight: '400',
              color: colors.muted,
              marginBottom: spacing.xs,
            }}
          >
            Good Evening, Michael 👋
          </Text>
          <Text
            style={{
              fontSize: typography.size['3xl'],
              fontWeight: '700',
              color: colors.foreground,
              letterSpacing: -0.3,
            }}
          >
            Today's Progress
          </Text>
        </LinearGradient>

        {/* Main Calorie Card */}
        <View style={{ paddingHorizontal: spacing.gutter, paddingVertical: spacing.xl }}>
          <Animated.View
            style={{
              transform: [{ scale: scaleAnim }],
            }}
          >
            <GlassCardPremium padding={spacing.xl} glow shadow="lg">
              <View style={{ alignItems: 'center', gap: spacing.lg }}>
                <CircularProgress
                  current={1450}
                  target={2200}
                  radius={80}
                  strokeWidth={8}
                  unit="kcal"
                  color={colors.primary}
                  showLabel
                />

                <View style={{ width: '100%', gap: spacing.md }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: typography.size.md,
                        fontWeight: '600',
                        color: colors.foreground,
                      }}
                    >
                      Remaining
                    </Text>
                    <Text
                      style={{
                        fontSize: typography.size.lg,
                        fontWeight: '700',
                        color: colors.primary,
                      }}
                    >
                      750 kcal
                    </Text>
                  </View>

                  {/* Progress bar */}
                  <View
                    style={{
                      height: 6,
                      backgroundColor: colors.surface,
                      borderRadius: radius.full,
                      overflow: 'hidden',
                    }}
                  >
                    <LinearGradient
                      colors={[colors.primary, colors.primaryDark]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={{
                        height: '100%',
                        width: '66%',
                        borderRadius: radius.full,
                      }}
                    />
                  </View>
                </View>
              </View>
            </GlassCardPremium>
          </Animated.View>
        </View>

        {/* Macro Breakdown */}
        <View style={{ paddingHorizontal: spacing.gutter, paddingVertical: spacing.xl }}>
          <Text
            style={{
              fontSize: typography.size.lg,
              fontWeight: '600',
              color: colors.foreground,
              marginBottom: spacing.lg,
            }}
          >
            Macro Breakdown
          </Text>

          <View style={{ gap: spacing.md }}>
            {macros.map((macro) => (
              <Pressable
                key={macro.label}
                onPress={() => setSelectedMacro(selectedMacro === macro.label.toLowerCase() as any ? null : macro.label.toLowerCase() as any)}
                style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.98 : 1 }] }]}
              >
                <GlassCardPremium
                  padding={spacing.lg}
                  glow={selectedMacro === macro.label.toLowerCase()}
                  shadow="md"
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                      <Text style={{ fontSize: 28 }}>{macro.icon}</Text>
                      <View>
                        <Text
                          style={{
                            fontSize: typography.size.md,
                            fontWeight: '600',
                            color: colors.foreground,
                          }}
                        >
                          {macro.label}
                        </Text>
                        <Text
                          style={{
                            fontSize: typography.size.sm,
                            fontWeight: '400',
                            color: colors.muted,
                          }}
                        >
                          {macro.value}g / {macro.target}g
                        </Text>
                      </View>
                    </View>

                    <View
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: radius.full,
                        backgroundColor: colors.surfaceLight,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderWidth: 2,
                        borderColor: macro.color,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: typography.size.md,
                          fontWeight: '700',
                          color: macro.color,
                        }}
                      >
                        {Math.round((macro.value / macro.target) * 100)}%
                      </Text>
                    </View>
                  </View>
                </GlassCardPremium>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={{ paddingHorizontal: spacing.gutter, paddingVertical: spacing.xl }}>
          <PremiumButton
            variant="primary"
            size="lg"
            fullWidth
            glow
            onPress={() => router.push('/(camera)/lens' as any)}
          >
            📸 Log Meal with Camera
          </PremiumButton>
        </View>

        {/* Spacing */}
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </ScreenContainer>
  );
}
