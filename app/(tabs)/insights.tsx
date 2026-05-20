import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { GlassCard } from '@/components/ui/glass-card';
import { CircularProgress } from '@/components/ui/circular-progress';
import { useMealStore } from '@/lib/stores/meal-store';
import { useAuthStore } from '@/lib/stores/auth-store';
import { hapticFeedback } from '@/lib/utils/haptics';

interface DailyMetrics {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealCount: number;
}

interface AnalyticsData {
  dailyMetrics: DailyMetrics[];
  averageCalories: number;
  averageProtein: number;
  averageCarbs: number;
  averageFat: number;
  proteinGoalDays: number;
  totalDays: number;
  mostLoggedMealType: string;
  qualityScore: number;
  recommendations: string[];
}

export default function InsightsScreen() {
  const { user } = useAuthStore();
  const { fetchMealHistory, isLoading } = useMealStore();
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadAnalytics();
    }
  }, [user?.id, timeRange]);

  const loadAnalytics = async () => {
    if (!user?.id) return;

    try {
      setError(null);

      // Calculate date range
      const days = timeRange === 'week' ? 7 : 30;
      const endDate = new Date().toISOString();
      const startDate = new Date(
        Date.now() - days * 24 * 60 * 60 * 1000
      ).toISOString();

      // Fetch meals
      const meals = await fetchMealHistory(user.id, startDate, endDate);

      // Calculate metrics
      const analyticsData = calculateAnalytics(meals, days);
      setAnalytics(analyticsData);
    } catch (err: any) {
      console.error('Failed to load analytics:', err);
      setError(err.message || 'Failed to load analytics');
    }
  };

  const calculateAnalytics = (meals: any[], days: number): AnalyticsData => {
    // Group meals by date
    const mealsByDate: { [key: string]: any[] } = {};

    meals.forEach((meal) => {
      const date = new Date(meal.logged_at).toISOString().split('T')[0];
      if (!mealsByDate[date]) {
        mealsByDate[date] = [];
      }
      mealsByDate[date].push(meal);
    });

    // Calculate daily metrics
    const dailyMetrics: DailyMetrics[] = [];
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let proteinGoalDays = 0;
    const mealTypeCounts: { [key: string]: number } = {};

    Object.entries(mealsByDate).forEach(([date, dayMeals]) => {
      const dayCalories = dayMeals.reduce(
        (sum, m) => sum + (m.total_calories || 0),
        0
      );
      const dayProtein = dayMeals.reduce(
        (sum, m) => sum + (m.protein_g || 0),
        0
      );
      const dayCarbs = dayMeals.reduce((sum, m) => sum + (m.carbs_g || 0), 0);
      const dayFat = dayMeals.reduce((sum, m) => sum + (m.fat_g || 0), 0);

      dailyMetrics.push({
        date,
        calories: dayCalories,
        protein: dayProtein,
        carbs: dayCarbs,
        fat: dayFat,
        mealCount: dayMeals.length,
      });

      totalCalories += dayCalories;
      totalProtein += dayProtein;
      totalCarbs += dayCarbs;
      totalFat += dayFat;

      // Check if protein goal met (assuming 150g target)
      if (dayProtein >= (user?.daily_protein_target || 150)) {
        proteinGoalDays++;
      }

      // Count meal types
      dayMeals.forEach((meal) => {
        const type = meal.meal_type || 'other';
        mealTypeCounts[type] = (mealTypeCounts[type] || 0) + 1;
      });
    });

    // Calculate averages
    const daysWithMeals = dailyMetrics.length || 1;
    const averageCalories = Math.round(totalCalories / daysWithMeals);
    const averageProtein = Math.round(totalProtein / daysWithMeals);
    const averageCarbs = Math.round(totalCarbs / daysWithMeals);
    const averageFat = Math.round(totalFat / daysWithMeals);

    // Find most logged meal type
    const mostLoggedMealType = Object.entries(mealTypeCounts).sort(
      ([, a], [, b]) => b - a
    )[0]?.[0] || 'N/A';

    // Calculate quality score (0-10)
    const calorieTarget = user?.daily_calorie_target || 2200;
    const proteinTarget = user?.daily_protein_target || 150;
    const carbTarget = 250;
    const fatTarget = 70;

    let qualityScore = 10;

    // Deduct points for imbalance
    if (averageCalories > calorieTarget * 1.2) qualityScore -= 2;
    if (averageCalories < calorieTarget * 0.8) qualityScore -= 1;
    if (averageProtein < proteinTarget * 0.8) qualityScore -= 2;
    if (averageCarbs > carbTarget * 1.3) qualityScore -= 1;
    if (averageFat > fatTarget * 1.3) qualityScore -= 1;

    qualityScore = Math.max(0, Math.min(10, qualityScore));

    // Generate recommendations
    const recommendations: string[] = [];

    if (averageProtein < proteinTarget * 0.9) {
      recommendations.push('💪 Increase protein intake for better muscle recovery');
    }
    if (averageCalories > calorieTarget * 1.1) {
      recommendations.push('📉 Try reducing portion sizes to hit your calorie target');
    }
    if (averageCarbs > carbTarget * 1.2) {
      recommendations.push('🥗 Add more vegetables to balance your macros');
    }
    if (daysWithMeals < days * 0.5) {
      recommendations.push('📱 Log more meals for better insights');
    }
    if (recommendations.length === 0) {
      recommendations.push('✨ Great job! Keep maintaining your balanced nutrition');
    }

    // Sort daily metrics by date (newest first)
    dailyMetrics.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return {
      dailyMetrics,
      averageCalories,
      averageProtein,
      averageCarbs,
      averageFat,
      proteinGoalDays,
      totalDays: days,
      mostLoggedMealType,
      qualityScore,
      recommendations,
    };
  };

  const getCalorieTrendBars = () => {
    if (!analytics?.dailyMetrics) return [];

    const calorieTarget = user?.daily_calorie_target || 2200;
    const days = timeRange === 'week' ? 7 : 30;
    const dayLabels =
      timeRange === 'week'
        ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        : Array.from({ length: days }, (_, i) => `${i + 1}`);

    // Create array for each day with 0 if no data
    const metricsMap: { [key: string]: DailyMetrics } = {};
    analytics.dailyMetrics.forEach((m) => {
      metricsMap[m.date] = m;
    });

    const today = new Date();
    const bars = dayLabels.map((label, index) => {
      if (timeRange === 'week') {
        const dayOffset = index - today.getDay();
        const date = new Date(today);
        date.setDate(date.getDate() + dayOffset);
        const dateStr = date.toISOString().split('T')[0];
        const metric = metricsMap[dateStr];
        return {
          label,
          height: metric
            ? Math.min((metric.calories / calorieTarget) * 100, 100)
            : 0,
          calories: metric?.calories || 0,
        };
      } else {
        // For month view, show last 30 days
        const date = new Date(today);
        date.setDate(date.getDate() - (days - 1 - index));
        const dateStr = date.toISOString().split('T')[0];
        const metric = metricsMap[dateStr];
        return {
          label: `${date.getDate()}`,
          height: metric
            ? Math.min((metric.calories / calorieTarget) * 100, 100)
            : 0,
          calories: metric?.calories || 0,
        };
      }
    });

    return bars;
  };

  const getMealTypeEmoji = (mealType: string) => {
    switch (mealType) {
      case 'breakfast':
        return '🌅';
      case 'lunch':
        return '🍽️';
      case 'dinner':
        return '🌙';
      case 'snack':
        return '🍿';
      default:
        return '🍽️';
    }
  };

  const getQualityScoreColor = (score: number) => {
    if (score >= 8) return '#22C55E'; // green
    if (score >= 6) return '#CCFF00'; // yellow
    return '#EF4444'; // red
  };

  if (isLoading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator size="large" color="#CCFF00" />
        <Text className="text-sm text-muted mt-2">Loading insights...</Text>
      </ScreenContainer>
    );
  }

  if (error) {
    return (
      <ScreenContainer className="p-6 items-center justify-center">
        <Text className="text-lg font-semibold text-error mb-2">Error</Text>
        <Text className="text-sm text-muted text-center">{error}</Text>
      </ScreenContainer>
    );
  }

  if (!analytics) {
    return (
      <ScreenContainer className="p-6 items-center justify-center">
        <Text className="text-lg font-semibold text-foreground mb-2">
          No Data
        </Text>
        <Text className="text-sm text-muted text-center">
          Log some meals to see your insights
        </Text>
      </ScreenContainer>
    );
  }

  const trendBars = getCalorieTrendBars();

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
              onPress={() => {
                setTimeRange(timeRange === 'week' ? 'month' : 'week');
                hapticFeedback.tap();
              }}
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
            <View className="h-32 bg-surface rounded-lg flex-row items-end justify-around px-2 py-4">
              {trendBars.map((bar, i) => (
                <View key={i} className="items-center gap-1 flex-1">
                  <View
                    className="w-full bg-primary rounded-t"
                    style={{
                      height: `${Math.max(bar.height, 5)}%`,
                    }}
                  />
                  <Text className="text-xs text-muted">{bar.label}</Text>
                </View>
              ))}
            </View>
            <Text className="text-xs text-muted text-center">
              Average: {analytics.averageCalories} kcal
            </Text>
          </GlassCard>

          {/* Protein Consistency */}
          <GlassCard className="gap-4">
            <Text className="text-lg font-semibold text-foreground">
              Protein Consistency
            </Text>
            <View className="items-center gap-4">
              <CircularProgress
                current={analytics.proteinGoalDays}
                target={analytics.totalDays}
                radius={60}
                strokeWidth={5}
                unit="days"
                color="#CCFF00"
              />
              <Text className="text-sm text-muted text-center">
                {analytics.proteinGoalDays} out of {analytics.totalDays} days met
                your protein target
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
                <Text
                  className="text-3xl font-bold"
                  style={{ color: getQualityScoreColor(analytics.qualityScore) }}
                >
                  {analytics.qualityScore.toFixed(1)}
                </Text>
                <Text className="text-xs text-muted">/10</Text>
              </View>
              <View className="flex-1 items-center">
                <Text className="text-2xl">
                  {analytics.qualityScore >= 8
                    ? '🌟'
                    : analytics.qualityScore >= 6
                      ? '👍'
                      : '⚠️'}
                </Text>
              </View>
            </View>
            <Text className="text-sm text-muted">
              {analytics.qualityScore >= 8
                ? 'Excellent nutrition balance!'
                : analytics.qualityScore >= 6
                  ? 'Good progress, keep it up!'
                  : 'Room for improvement'}
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
                  {analytics.averageCalories} kcal
                </Text>
              </View>
            </GlassCard>
            <GlassCard className="gap-2">
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">Avg Daily Protein</Text>
                <Text className="text-sm font-semibold text-primary">
                  {analytics.averageProtein}g
                </Text>
              </View>
            </GlassCard>
            <GlassCard className="gap-2">
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">Most Logged Meal</Text>
                <Text className="text-sm font-semibold text-primary">
                  {getMealTypeEmoji(analytics.mostLoggedMealType)}{' '}
                  {analytics.mostLoggedMealType}
                </Text>
              </View>
            </GlassCard>
          </View>

          {/* Recommendations */}
          {analytics.recommendations.map((rec, idx) => (
            <GlassCard
              key={idx}
              className="gap-2 border-l-4 border-l-primary"
            >
              <Text className="text-sm text-foreground">{rec}</Text>
            </GlassCard>
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
