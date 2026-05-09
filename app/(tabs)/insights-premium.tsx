import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenContainer } from '@/components/screen-container';
import { GlassCardPremium } from '@/components/ui/glass-card-premium';
import { spacing, typography, colors, radius } from '@/lib/design-system';

const CHART_DATA = [
  { day: 'Mon', value: 1800, max: 2200 },
  { day: 'Tue', value: 1950, max: 2200 },
  { day: 'Wed', value: 2100, max: 2200 },
  { day: 'Thu', value: 2050, max: 2200 },
  { day: 'Fri', value: 2200, max: 2200 },
  { day: 'Sat', value: 2150, max: 2200 },
  { day: 'Sun', value: 1900, max: 2200 },
];

export default function InsightsPremiumScreen() {
  const [selectedDay, setSelectedDay] = useState(4);
  const maxValue = Math.max(...CHART_DATA.map((d) => d.max));

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
              fontSize: typography.size['3xl'],
              fontWeight: '700',
              color: colors.foreground,
              letterSpacing: -0.3,
            }}
          >
            Insights
          </Text>
          <Text
            style={{
              fontSize: typography.size.md,
              fontWeight: '400',
              color: colors.muted,
              marginTop: spacing.sm,
            }}
          >
            This Week
          </Text>
        </LinearGradient>

        {/* Calorie Trend */}
        <View style={{ paddingHorizontal: spacing.gutter, paddingVertical: spacing.xl }}>
          <Text
            style={{
              fontSize: typography.size.lg,
              fontWeight: '600',
              color: colors.foreground,
              marginBottom: spacing.lg,
            }}
          >
            Calories Trend
          </Text>

          <GlassCardPremium padding={spacing.xl} shadow="md">
            <View style={{ height: 200, justifyContent: 'flex-end', gap: spacing.md }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: spacing.md }}>
                {CHART_DATA.map((data, idx) => {
                  const heightPercent = (data.value / maxValue) * 100;
                  const isSelected = idx === selectedDay;

                  return (
                    <Pressable
                      key={idx}
                      onPress={() => setSelectedDay(idx)}
                      style={{ flex: 1, alignItems: 'center', gap: spacing.sm }}
                    >
                      <View
                        style={{
                          width: '100%',
                          height: `${heightPercent}%`,
                          backgroundColor: isSelected ? colors.primary : colors.surface,
                          borderRadius: radius.md,
                          opacity: isSelected ? 1 : 0.5,
                        }}
                      />
                      <Text
                        style={{
                          fontSize: typography.size.xs,
                          fontWeight: '500',
                          color: isSelected ? colors.primary : colors.muted,
                        }}
                      >
                        {data.day}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </GlassCardPremium>
        </View>

        {/* Stats */}
        <View style={{ paddingHorizontal: spacing.gutter, paddingVertical: spacing.xl }}>
          <Text
            style={{
              fontSize: typography.size.lg,
              fontWeight: '600',
              color: colors.foreground,
              marginBottom: spacing.lg,
            }}
          >
            Weekly Stats
          </Text>

          <View style={{ gap: spacing.md }}>
            <GlassCardPremium padding={spacing.lg} shadow="md">
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View>
                  <Text
                    style={{
                      fontSize: typography.size.sm,
                      fontWeight: '500',
                      color: colors.muted,
                      marginBottom: spacing.xs,
                    }}
                  >
                    Average Intake
                  </Text>
                  <Text
                    style={{
                      fontSize: typography.size['2xl'],
                      fontWeight: '700',
                      color: colors.foreground,
                    }}
                  >
                    2,043 kcal
                  </Text>
                </View>
                <View style={{ justifyContent: 'center' }}>
                  <Text style={{ fontSize: 40 }}>📊</Text>
                </View>
              </View>
            </GlassCardPremium>

            <GlassCardPremium padding={spacing.lg} shadow="md">
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View>
                  <Text
                    style={{
                      fontSize: typography.size.sm,
                      fontWeight: '500',
                      color: colors.muted,
                      marginBottom: spacing.xs,
                    }}
                  >
                    Protein Consistency
                  </Text>
                  <Text
                    style={{
                      fontSize: typography.size['2xl'],
                      fontWeight: '700',
                      color: colors.primary,
                    }}
                  >
                    Good
                  </Text>
                </View>
                <View
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    backgroundColor: colors.surface,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 3,
                    borderColor: colors.primary,
                  }}
                >
                  <Text
                    style={{
                      fontSize: typography.size.lg,
                      fontWeight: '700',
                      color: colors.primary,
                    }}
                  >
                    4/7
                  </Text>
                </View>
              </View>
            </GlassCardPremium>

            <GlassCardPremium padding={spacing.lg} shadow="md">
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View>
                  <Text
                    style={{
                      fontSize: typography.size.sm,
                      fontWeight: '500',
                      color: colors.muted,
                      marginBottom: spacing.xs,
                    }}
                  >
                    Meal Quality Score
                  </Text>
                  <Text
                    style={{
                      fontSize: typography.size['2xl'],
                      fontWeight: '700',
                      color: colors.foreground,
                    }}
                  >
                    7.6 / 10
                  </Text>
                </View>
                <View style={{ justifyContent: 'center' }}>
                  <Text style={{ fontSize: 40 }}>⭐</Text>
                </View>
              </View>
            </GlassCardPremium>
          </View>
        </View>

        {/* AI Recommendation */}
        <View style={{ paddingHorizontal: spacing.gutter, paddingVertical: spacing.xl }}>
          <GlassCardPremium padding={spacing.lg} glow shadow="lg">
            <View style={{ gap: spacing.md }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                <Text style={{ fontSize: 24 }}>🤖</Text>
                <Text
                  style={{
                    fontSize: typography.size.md,
                    fontWeight: '600',
                    color: colors.primary,
                  }}
                >
                  AI Insight
                </Text>
              </View>
              <Text
                style={{
                  fontSize: typography.size.md,
                  fontWeight: '400',
                  color: colors.foreground,
                  lineHeight: typography.lineHeight.relaxed,
                }}
              >
                You're on protein today. Try adding more to dinner.
              </Text>
            </View>
          </GlassCardPremium>
        </View>

        {/* Spacing */}
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </ScreenContainer>
  );
}
