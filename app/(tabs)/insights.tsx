import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { GlassCard } from '@/components/ui/glass-card';
import { CircularProgress } from '@/components/ui/circular-progress';

export default function InsightsScreen() {
  const [timeRange, setTimeRange] = useState('week');

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-6">
          {/* Header */}
          <View className="flex-row items-center justify-between">
            <View className="gap-2">
              <Text className="text-2xl font-bold text-foreground">
                Insights
              </Text>
              <Text className="text-sm text-muted">
                Your nutrition trends
              </Text>
            </View>
            <Pressable
              onPress={() =>
                setTimeRange(timeRange === 'week' ? 'month' : 'week')
              }
              style={({ pressed }) => [pressed && { opacity: 0.7 }]}
            >
              <View className="px-3 py-2 rounded-lg bg-surface border border-border">
                <Text className="text-xs font-semibold text-primary capitalize">
                  This {timeRange}
                </Text>
              </View>
            </Pressable>
          </View>

          {/* Calorie Trend */}
          <GlassCard className="gap-4">
            <Text className="text-lg font-semibold text-foreground">
              Calorie Trend
            </Text>
            <View className="h-32 bg-surface rounded-lg flex-row items-end justify-around px-4 py-4">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                <View key={day} className="items-center gap-1">
                  <View
                    className="w-6 bg-primary rounded-t"
                    style={{
                      height: `${Math.random() * 100 + 20}%`,
                    }}
                  />
                  <Text className="text-xs text-muted">{day}</Text>
                </View>
              ))}
            </View>
            <Text className="text-xs text-muted text-center">
              Average: 2,250 kcal
            </Text>
          </GlassCard>

          {/* Protein Consistency */}
          <GlassCard className="gap-4">
            <Text className="text-lg font-semibold text-foreground">
              Protein Consistency
            </Text>
            <View className="items-center gap-4">
              <CircularProgress
                current={4}
                target={7}
                radius={60}
                strokeWidth={5}
                unit="days"
                color="#CCFF00"
              />
              <Text className="text-sm text-muted text-center">
                4 out of 7 days met your protein target
              </Text>
            </View>
          </GlassCard>

          {/* Meal Quality Score */}
          <GlassCard className="gap-4">
            <Text className="text-lg font-semibold text-foreground">
              Meal Quality Score
            </Text>
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-3xl font-bold text-primary">7.6</Text>
                <Text className="text-xs text-muted">/10</Text>
              </View>
              <View className="flex-1 h-20 bg-surface rounded-lg" />
            </View>
            <Text className="text-sm text-muted">
              Great job! Keep it balanced.
            </Text>
          </GlassCard>

          {/* Key Metrics */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">
              Key Metrics
            </Text>
            <GlassCard className="gap-2">
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">Avg Daily Calories</Text>
                <Text className="text-sm font-semibold text-primary">
                  2,250 kcal
                </Text>
              </View>
            </GlassCard>
            <GlassCard className="gap-2">
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">Avg Daily Protein</Text>
                <Text className="text-sm font-semibold text-primary">
                  95g
                </Text>
              </View>
            </GlassCard>
            <GlassCard className="gap-2">
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">Most Logged Meal</Text>
                <Text className="text-sm font-semibold text-primary">
                  Lunch
                </Text>
              </View>
            </GlassCard>
          </View>

          {/* Recommendations */}
          <GlassCard className="gap-3 border-l-4 border-l-primary">
            <Text className="text-sm font-semibold text-foreground">
              💡 Recommendations
            </Text>
            <Text className="text-sm text-muted">
              Try adding more vegetables to your meals for better fiber intake.
            </Text>
          </GlassCard>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
