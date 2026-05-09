import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenContainer } from '@/components/screen-container';
import { GlassCardPremium } from '@/components/ui/glass-card-premium';
import { CircularProgress } from '@/components/ui/circular-progress';
import { OfflineIndicator, SyncStatus } from '@/components/ui/offline-indicator';
import { offlineCache, DailyNutrition } from '@/lib/services/offline-cache';
import { useSyncState } from '@/lib/services/sync-manager';
import { spacing, typography, colors } from '@/lib/design-system';

export default function DashboardOfflineScreen() {
  const [nutrition, setNutrition] = useState<DailyNutrition | null>(null);
  const [loading, setLoading] = useState(true);
  const syncState = useSyncState();

  useEffect(() => {
    loadTodayNutrition();
  }, []);

  const loadTodayNutrition = async () => {
    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      let data = await offlineCache.getNutritionByDate(today);

      if (!data) {
        data = await offlineCache.calculateDailyNutrition(today);
      }

      setNutrition(data);
    } catch (error) {
      console.error('Error loading nutrition:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !nutrition) {
    return (
      <ScreenContainer className="p-4">
        <Text
          style={{
            fontSize: typography.size.lg,
            fontWeight: '600',
            color: colors.muted,
            textAlign: 'center',
          }}
        >
          Loading...
        </Text>
      </ScreenContainer>
    );
  }

  const calorieProgress = (nutrition.totals.calories / nutrition.goals.calories) * 100;
  const proteinProgress = (nutrition.totals.protein / nutrition.goals.protein) * 100;
  const fiberProgress = (nutrition.totals.fiber / nutrition.goals.fiber) * 100;

  return (
    <ScreenContainer className="p-0">
      <OfflineIndicator />
      <SyncStatus />

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
            Good Morning
          </Text>
          <Text
            style={{
              fontSize: typography.size.md,
              fontWeight: '400',
              color: colors.muted,
              marginTop: spacing.sm,
            }}
          >
            {nutrition.meals.length} meals logged
          </Text>
        </LinearGradient>

        {/* Main Progress */}
        <View
          style={{
            paddingHorizontal: spacing.gutter,
            paddingVertical: spacing.xl,
            alignItems: 'center',
          }}
        >
          <CircularProgress
            current={nutrition.totals.calories}
            target={nutrition.goals.calories}
            radius={80}
            strokeWidth={8}
            unit="kcal"
            color={colors.primary}
            showLabel
          />
        </View>

        {/* Macro Breakdown */}
        <View style={{ paddingHorizontal: spacing.gutter, paddingVertical: spacing.lg }}>
          <Text
            style={{
              fontSize: typography.size.lg,
              fontWeight: '600',
              color: colors.foreground,
              marginBottom: spacing.lg,
            }}
          >
            Macros
          </Text>

          <View style={{ gap: spacing.md }}>
            {/* Protein */}
            <GlassCardPremium padding={spacing.lg} shadow="md">
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: spacing.md,
                }}
              >
                <Text
                  style={{
                    fontSize: typography.size.md,
                    fontWeight: '600',
                    color: colors.foreground,
                  }}
                >
                  Protein
                </Text>
                <Text
                  style={{
                    fontSize: typography.size.md,
                    fontWeight: '700',
                    color: colors.primary,
                  }}
                >
                  {nutrition.totals.protein}g
                </Text>
              </View>
              <View
                style={{
                  height: 8,
                  backgroundColor: colors.surface,
                  borderRadius: 4,
                  overflow: 'hidden',
                }}
              >
                <View
                  style={{
                    height: '100%',
                    width: `${Math.min(proteinProgress, 100)}%`,
                    backgroundColor: colors.primary,
                  }}
                />
              </View>
            </GlassCardPremium>

            {/* Carbs */}
            <GlassCardPremium padding={spacing.lg} shadow="md">
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: spacing.md,
                }}
              >
                <Text
                  style={{
                    fontSize: typography.size.md,
                    fontWeight: '600',
                    color: colors.foreground,
                  }}
                >
                  Carbs
                </Text>
                <Text
                  style={{
                    fontSize: typography.size.md,
                    fontWeight: '700',
                    color: colors.primary,
                  }}
                >
                  {nutrition.totals.carbs}g
                </Text>
              </View>
              <View
                style={{
                  height: 8,
                  backgroundColor: colors.surface,
                  borderRadius: 4,
                  overflow: 'hidden',
                }}
              >
                <View
                  style={{
                    height: '100%',
                    width: `${Math.min((nutrition.totals.carbs / nutrition.goals.carbs) * 100, 100)}%`,
                    backgroundColor: colors.primary,
                  }}
                />
              </View>
            </GlassCardPremium>

            {/* Fat */}
            <GlassCardPremium padding={spacing.lg} shadow="md">
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: spacing.md,
                }}
              >
                <Text
                  style={{
                    fontSize: typography.size.md,
                    fontWeight: '600',
                    color: colors.foreground,
                  }}
                >
                  Fat
                </Text>
                <Text
                  style={{
                    fontSize: typography.size.md,
                    fontWeight: '700',
                    color: colors.primary,
                  }}
                >
                  {nutrition.totals.fat}g
                </Text>
              </View>
              <View
                style={{
                  height: 8,
                  backgroundColor: colors.surface,
                  borderRadius: 4,
                  overflow: 'hidden',
                }}
              >
                <View
                  style={{
                    height: '100%',
                    width: `${Math.min((nutrition.totals.fat / nutrition.goals.fat) * 100, 100)}%`,
                    backgroundColor: colors.primary,
                  }}
                />
              </View>
            </GlassCardPremium>

            {/* Fiber */}
            <GlassCardPremium padding={spacing.lg} shadow="md">
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: spacing.md,
                }}
              >
                <Text
                  style={{
                    fontSize: typography.size.md,
                    fontWeight: '600',
                    color: colors.foreground,
                  }}
                >
                  Fiber
                </Text>
                <Text
                  style={{
                    fontSize: typography.size.md,
                    fontWeight: '700',
                    color: colors.primary,
                  }}
                >
                  {nutrition.totals.fiber}g
                </Text>
              </View>
              <View
                style={{
                  height: 8,
                  backgroundColor: colors.surface,
                  borderRadius: 4,
                  overflow: 'hidden',
                }}
              >
                <View
                  style={{
                    height: '100%',
                    width: `${Math.min(fiberProgress, 100)}%`,
                    backgroundColor: colors.primary,
                  }}
                />
              </View>
            </GlassCardPremium>
          </View>
        </View>

        {/* Recent Meals */}
        <View style={{ paddingHorizontal: spacing.gutter, paddingVertical: spacing.lg }}>
          <Text
            style={{
              fontSize: typography.size.lg,
              fontWeight: '600',
              color: colors.foreground,
              marginBottom: spacing.lg,
            }}
          >
            Today's Meals
          </Text>

          {nutrition.meals.length === 0 ? (
            <GlassCardPremium padding={spacing.lg} shadow="md">
              <Text
                style={{
                  fontSize: typography.size.md,
                  fontWeight: '400',
                  color: colors.muted,
                  textAlign: 'center',
                }}
              >
                No meals logged yet
              </Text>
            </GlassCardPremium>
          ) : (
            <View style={{ gap: spacing.md }}>
              {nutrition.meals.slice(0, 3).map((meal) => (
                <GlassCardPremium key={meal.id} padding={spacing.lg} shadow="md">
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: typography.size.md,
                          fontWeight: '600',
                          color: colors.foreground,
                        }}
                      >
                        {meal.name}
                      </Text>
                      <Text
                        style={{
                          fontSize: typography.size.sm,
                          fontWeight: '400',
                          color: colors.muted,
                          marginTop: spacing.xs,
                        }}
                      >
                        {meal.items.join(', ')}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontSize: typography.size.lg,
                        fontWeight: '700',
                        color: colors.primary,
                      }}
                    >
                      {meal.calories}
                    </Text>
                  </View>
                </GlassCardPremium>
              ))}
            </View>
          )}
        </View>

        {/* Spacing */}
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </ScreenContainer>
  );
}
