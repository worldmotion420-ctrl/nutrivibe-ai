import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { GlassCard } from '@/components/ui/glass-card';

const MOCK_MEALS = [
  {
    date: 'Today',
    meals: [
      { name: 'Breakfast', time: '8:30 AM', calories: 450 },
      { name: 'Lunch', time: '1:15 PM', calories: 650 },
      { name: 'Snack', time: '4:00 PM', calories: 150 },
      { name: 'Dinner', time: '7:45 PM', calories: 520 },
    ],
  },
  {
    date: 'Yesterday',
    meals: [
      { name: 'Breakfast', time: '8:00 AM', calories: 420 },
      { name: 'Lunch', time: '12:30 PM', calories: 680 },
      { name: 'Dinner', time: '7:00 PM', calories: 580 },
    ],
  },
];

export default function HistoryScreen() {
  const [filter, setFilter] = useState('all');

  const filters = ['All', 'Meals', 'Snacks'];

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-2xl font-bold text-foreground">
              Meal History
            </Text>
            <Text className="text-sm text-muted">
              Track your meals over time
            </Text>
          </View>

          {/* Filter Tabs */}
          <View className="flex-row gap-2">
            {filters.map((f) => (
              <Pressable
                key={f}
                onPress={() => setFilter(f.toLowerCase())}
                style={({ pressed }) => [pressed && { opacity: 0.7 }]}
              >
                <View
                  className={`px-4 py-2 rounded-full ${
                    filter === f.toLowerCase()
                      ? 'bg-primary'
                      : 'bg-surface border border-border'
                  }`}
                >
                  <Text
                    className={`text-sm font-semibold ${
                      filter === f.toLowerCase()
                        ? 'text-background'
                        : 'text-foreground'
                    }`}
                  >
                    {f}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>

          {/* Meals Timeline */}
          {MOCK_MEALS.map((day) => (
            <View key={day.date} className="gap-3">
              <Text className="text-sm font-semibold text-muted">
                {day.date}
              </Text>
              {day.meals.map((meal, idx) => (
                <Pressable
                  key={idx}
                  style={({ pressed }) => [pressed && { opacity: 0.7 }]}
                >
                  <GlassCard className="flex-row items-center justify-between">
                    <View className="flex-1 gap-1">
                      <Text className="font-semibold text-foreground">
                        {meal.name}
                      </Text>
                      <Text className="text-xs text-muted">{meal.time}</Text>
                    </View>
                    <Text className="font-semibold text-primary">
                      {meal.calories} kcal
                    </Text>
                  </GlassCard>
                </Pressable>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
