import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenContainer } from '@/components/screen-container';
import { GlassCardPremium } from '@/components/ui/glass-card-premium';
import { spacing, typography, colors, radius } from '@/lib/design-system';

const MEALS = [
  {
    time: '8:30 AM',
    name: 'Breakfast',
    items: ['Grilled Chicken', 'Brown Rice', 'Broccoli'],
    calories: 450,
    icon: '🍳',
  },
  {
    time: '1:15 PM',
    name: 'Lunch',
    items: ['Salmon', 'Sweet Potato', 'Olive Oil'],
    calories: 650,
    icon: '🍽️',
  },
  {
    time: '4:00 PM',
    name: 'Snack',
    items: ['Almonds', 'Apple'],
    calories: 200,
    icon: '🥜',
  },
  {
    time: '7:45 PM',
    name: 'Dinner',
    items: ['Turkey Breast', 'Quinoa', 'Vegetables'],
    calories: 550,
    icon: '🍲',
  },
];

const FILTERS = ['All', 'Meals', 'Snacks'];

export default function HistoryPremiumScreen() {
  const [selectedFilter, setSelectedFilter] = useState(0);

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
            Today
          </Text>
          <Text
            style={{
              fontSize: typography.size.md,
              fontWeight: '400',
              color: colors.muted,
              marginTop: spacing.sm,
            }}
          >
            Thursday, May 9, 2026
          </Text>
        </LinearGradient>

        {/* Filters */}
        <View
          style={{
            paddingHorizontal: spacing.gutter,
            paddingVertical: spacing.lg,
            flexDirection: 'row',
            gap: spacing.md,
          }}
        >
          {FILTERS.map((filter, idx) => (
            <Pressable
              key={idx}
              onPress={() => setSelectedFilter(idx)}
              style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.95 : 1 }] }]}
            >
              <View
                style={{
                  paddingHorizontal: spacing.lg,
                  paddingVertical: spacing.sm,
                  borderRadius: radius.full,
                  backgroundColor:
                    selectedFilter === idx ? colors.primary : colors.surface,
                  borderWidth: selectedFilter === idx ? 0 : 1,
                  borderColor: colors.border,
                }}
              >
                <Text
                  style={{
                    fontSize: typography.size.sm,
                    fontWeight: '600',
                    color:
                      selectedFilter === idx ? colors.background : colors.foreground,
                  }}
                >
                  {filter}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>

        {/* Meals Timeline */}
        <View style={{ paddingHorizontal: spacing.gutter, paddingVertical: spacing.lg }}>
          <View style={{ gap: spacing.md }}>
            {MEALS.map((meal, idx) => (
              <Pressable
                key={idx}
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
                        <Text style={{ fontSize: 20 }}>{meal.icon}</Text>
                      </View>
                      {idx < MEALS.length - 1 && (
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
                            {meal.time}
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

                      {/* Items */}
                      <View
                        style={{
                          flexDirection: 'row',
                          flexWrap: 'wrap',
                          gap: spacing.sm,
                        }}
                      >
                        {meal.items.map((item, iidx) => (
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
                      </View>
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
        </View>

        {/* Spacing */}
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </ScreenContainer>
  );
}
