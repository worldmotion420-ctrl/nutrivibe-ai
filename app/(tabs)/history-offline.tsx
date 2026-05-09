import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenContainer } from '@/components/screen-container';
import { GlassCardPremium } from '@/components/ui/glass-card-premium';
import { OfflineIndicator, SyncStatus } from '@/components/ui/offline-indicator';
import { offlineCache, CachedMeal } from '@/lib/services/offline-cache';
import { useSyncState } from '@/lib/services/sync-manager';
import { spacing, typography, colors, radius } from '@/lib/design-system';

export default function HistoryOfflineScreen() {
  const [meals, setMeals] = useState<CachedMeal[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [loading, setLoading] = useState(true);
  const syncState = useSyncState();

  useEffect(() => {
    loadMeals();
  }, [selectedDate]);

  const loadMeals = async () => {
    setLoading(true);
    try {
      const dayMeals = await offlineCache.getMealsByDate(selectedDate);
      setMeals(dayMeals);
    } catch (error) {
      console.error('Error loading meals:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getTotalCalories = () => {
    return meals.reduce((sum, meal) => sum + meal.calories, 0);
  };

  const getPreviousDate = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() - 1);
    return date.toISOString().split('T')[0];
  };

  const getNextDate = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
  };

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
            Meal History
          </Text>
          <Text
            style={{
              fontSize: typography.size.md,
              fontWeight: '400',
              color: colors.muted,
              marginTop: spacing.sm,
            }}
          >
            {formatDate(selectedDate)}
          </Text>
        </LinearGradient>

        {/* Date Navigation */}
        <View
          style={{
            paddingHorizontal: spacing.gutter,
            paddingVertical: spacing.lg,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Pressable
            onPress={() => setSelectedDate(getPreviousDate())}
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
          >
            <Text
              style={{
                fontSize: typography.size.lg,
                fontWeight: '600',
                color: colors.primary,
              }}
            >
              ← Previous
            </Text>
          </Pressable>

          <Text
            style={{
              fontSize: typography.size.md,
              fontWeight: '600',
              color: colors.foreground,
            }}
          >
            {getTotalCalories()} kcal
          </Text>

          <Pressable
            onPress={() => setSelectedDate(getNextDate())}
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
          >
            <Text
              style={{
                fontSize: typography.size.lg,
                fontWeight: '600',
                color: colors.primary,
              }}
            >
              Next →
            </Text>
          </Pressable>
        </View>

        {/* Meals List */}
        <View style={{ paddingHorizontal: spacing.gutter, paddingVertical: spacing.lg }}>
          {loading ? (
            <GlassCardPremium padding={spacing.lg} shadow="md">
              <Text
                style={{
                  fontSize: typography.size.md,
                  fontWeight: '400',
                  color: colors.muted,
                  textAlign: 'center',
                }}
              >
                Loading meals...
              </Text>
            </GlassCardPremium>
          ) : meals.length === 0 ? (
            <GlassCardPremium padding={spacing.xl} shadow="md">
              <View style={{ alignItems: 'center', gap: spacing.md }}>
                <Text style={{ fontSize: 40 }}>🍽️</Text>
                <Text
                  style={{
                    fontSize: typography.size.md,
                    fontWeight: '600',
                    color: colors.foreground,
                    textAlign: 'center',
                  }}
                >
                  No meals logged
                </Text>
                <Text
                  style={{
                    fontSize: typography.size.sm,
                    fontWeight: '400',
                    color: colors.muted,
                    textAlign: 'center',
                  }}
                >
                  Start logging meals to see them here
                </Text>
              </View>
            </GlassCardPremium>
          ) : (
            <View style={{ gap: spacing.md }}>
              {meals.map((meal, idx) => (
                <Pressable
                  key={meal.id}
                  style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.98 : 1 }] }]}
                >
                  <GlassCardPremium padding={spacing.lg} shadow="md">
                    <View
                      style={{
                        flexDirection: 'row',
                        gap: spacing.lg,
                        alignItems: 'center',
                      }}
                    >
                      {/* Timeline dot */}
                      <View style={{ alignItems: 'center', gap: spacing.sm }}>
                        <View
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            backgroundColor: colors.primary,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <Text style={{ fontSize: 20 }}>🍽️</Text>
                        </View>
                        {idx < meals.length - 1 && (
                          <View
                            style={{
                              width: 2,
                              height: 40,
                              backgroundColor: colors.border,
                            }}
                          />
                        )}
                      </View>

                      {/* Meal info */}
                      <View style={{ flex: 1 }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: spacing.sm,
                          }}
                        >
                          <View>
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
                                fontSize: typography.size.xs,
                                fontWeight: '400',
                                color: colors.muted,
                                marginTop: spacing.xs,
                              }}
                            >
                              {formatTime(meal.timestamp)}
                            </Text>
                          </View>
                          <View style={{ alignItems: 'flex-end' }}>
                            <Text
                              style={{
                                fontSize: typography.size.lg,
                                fontWeight: '700',
                                color: colors.primary,
                              }}
                            >
                              {meal.calories}
                            </Text>
                            <Text
                              style={{
                                fontSize: typography.size.xs,
                                fontWeight: '400',
                                color: colors.muted,
                              }}
                            >
                              kcal
                            </Text>
                          </View>
                        </View>

                        {/* Items */}
                        <View
                          style={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            gap: spacing.sm,
                          }}
                        >
                          {meal.items.slice(0, 3).map((item, iidx) => (
                            <View
                              key={iidx}
                              style={{
                                backgroundColor: colors.surface,
                                paddingHorizontal: spacing.md,
                                paddingVertical: spacing.xs,
                                borderRadius: radius.full,
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: typography.size.xs,
                                  fontWeight: '500',
                                  color: colors.muted,
                                }}
                              >
                                {item}
                              </Text>
                            </View>
                          ))}
                          {meal.items.length > 3 && (
                            <View
                              style={{
                                backgroundColor: colors.surface,
                                paddingHorizontal: spacing.md,
                                paddingVertical: spacing.xs,
                                borderRadius: radius.full,
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: typography.size.xs,
                                  fontWeight: '500',
                                  color: colors.muted,
                                }}
                              >
                                +{meal.items.length - 3}
                              </Text>
                            </View>
                          )}
                        </View>

                        {/* Sync status */}
                        {!meal.synced && (
                          <View
                            style={{
                              marginTop: spacing.md,
                              paddingTop: spacing.md,
                              borderTopWidth: 1,
                              borderTopColor: colors.border,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: typography.size.xs,
                                fontWeight: '500',
                                color: colors.warning,
                              }}
                            >
                              ⏳ Pending sync
                            </Text>
                          </View>
                        )}
                      </View>

                      {/* Action */}
                      <Text
                        style={{
                          fontSize: typography.size.lg,
                          color: colors.muted,
                        }}
                      >
                        ⋮
                      </Text>
                    </View>
                  </GlassCardPremium>
                </Pressable>
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
