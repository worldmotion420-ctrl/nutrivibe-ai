import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenContainer } from '@/components/screen-container';
import { GlassCardPremium } from '@/components/ui/glass-card-premium';
import { PremiumButton } from '@/components/ui/button-premium';
import { CircularProgress } from '@/components/ui/circular-progress';
import { useFoodDetectionStore } from '@/lib/stores/food-detection-store';
import { groqAI, NutritionAnalysis } from '@/lib/services/groq-ai';
import { spacing, typography, colors } from '@/lib/design-system';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';

export default function ProcessingGroqScreen() {
  const router = useRouter();
  const { detectedFoods, totalCalories, confidence, processingTime } = useFoodDetectionStore();
  const [nutrition, setNutrition] = useState<NutritionAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyzeNutrition();
  }, []);

  const analyzeNutrition = async () => {
    try {
      console.log('📊 Analyzing nutrition...');
      const analysis = await groqAI.analyzeNutrition(detectedFoods);
      setNutrition(analysis);
    } catch (error) {
      console.error('Error analyzing nutrition:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !nutrition) {
    return (
      <ScreenContainer className="p-4 justify-center items-center">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text
          style={{
            marginTop: spacing.lg,
            fontSize: typography.size.lg,
            color: colors.foreground,
            fontWeight: '600',
          }}
        >
          Analyzing Meal...
        </Text>
      </ScreenContainer>
    );
  }

  const confidencePercentage = Math.round(confidence * 100);

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
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
          <Animated.View entering={FadeIn.duration(300)}>
            <Text
              style={{
                fontSize: typography.size['3xl'],
                fontWeight: '700',
                color: colors.foreground,
                letterSpacing: -0.3,
              }}
            >
              Meal Analysis
            </Text>
            <Text
              style={{
                fontSize: typography.size.md,
                fontWeight: '400',
                color: colors.muted,
                marginTop: spacing.sm,
              }}
            >
              {detectedFoods.length} items detected • {confidencePercentage}% confidence
            </Text>
          </Animated.View>
        </LinearGradient>

        {/* Main Calorie Display */}
        <Animated.View
          entering={SlideInUp.duration(400).delay(100)}
          style={{
            paddingHorizontal: spacing.gutter,
            paddingVertical: spacing.xl,
            alignItems: 'center',
          }}
        >
          <CircularProgress
            current={totalCalories}
            target={2200}
            radius={90}
            strokeWidth={10}
            unit="kcal"
            color={colors.primary}
            showLabel
          />
        </Animated.View>

        {/* Detected Foods */}
        <Animated.View
          entering={SlideInUp.duration(400).delay(200)}
          style={{
            paddingHorizontal: spacing.gutter,
            paddingVertical: spacing.lg,
          }}
        >
          <Text
            style={{
              fontSize: typography.size.lg,
              fontWeight: '600',
              color: colors.foreground,
              marginBottom: spacing.lg,
            }}
          >
            Detected Foods
          </Text>

          <View style={{ gap: spacing.md }}>
            {detectedFoods.map((food, index) => (
              <GlassCardPremium key={index} padding={spacing.lg} shadow="md">
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
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
                      {food.name}
                    </Text>
                    <Text
                      style={{
                        fontSize: typography.size.sm,
                        fontWeight: '400',
                        color: colors.muted,
                        marginTop: spacing.xs,
                      }}
                    >
                      {food.servingSize} {food.servingUnit}
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
                      {food.calories}
                    </Text>
                    <View
                      style={{
                        marginTop: spacing.xs,
                        paddingHorizontal: spacing.sm,
                        paddingVertical: 2,
                        backgroundColor: colors.surface,
                        borderRadius: 4,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: typography.size.xs,
                          fontWeight: '600',
                          color: colors.primary,
                        }}
                      >
                        {Math.round(food.confidence * 100)}%
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Macros */}
                <View
                  style={{
                    marginTop: spacing.md,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    gap: spacing.md,
                  }}
                >
                  {[
                    { label: 'P', value: food.protein, unit: 'g' },
                    { label: 'C', value: food.carbs, unit: 'g' },
                    { label: 'F', value: food.fat, unit: 'g' },
                  ].map((macro, idx) => (
                    <View key={idx} style={{ flex: 1, alignItems: 'center' }}>
                      <Text
                        style={{
                          fontSize: typography.size.xs,
                          fontWeight: '600',
                          color: colors.muted,
                        }}
                      >
                        {macro.label}
                      </Text>
                      <Text
                        style={{
                          fontSize: typography.size.md,
                          fontWeight: '700',
                          color: colors.foreground,
                          marginTop: spacing.xs,
                        }}
                      >
                        {macro.value}
                      </Text>
                    </View>
                  ))}
                </View>
              </GlassCardPremium>
            ))}
          </View>
        </Animated.View>

        {/* Nutrition Summary */}
        <Animated.View
          entering={SlideInUp.duration(400).delay(300)}
          style={{
            paddingHorizontal: spacing.gutter,
            paddingVertical: spacing.lg,
          }}
        >
          <Text
            style={{
              fontSize: typography.size.lg,
              fontWeight: '600',
              color: colors.foreground,
              marginBottom: spacing.lg,
            }}
          >
            Nutrition Summary
          </Text>

          <GlassCardPremium padding={spacing.lg} shadow="md">
            <View style={{ gap: spacing.md }}>
              {[
                { label: 'Protein', value: nutrition.protein, unit: 'g', target: 150 },
                { label: 'Carbs', value: nutrition.carbs, unit: 'g', target: 250 },
                { label: 'Fat', value: nutrition.fat, unit: 'g', target: 80 },
                { label: 'Fiber', value: nutrition.fiber, unit: 'g', target: 25 },
              ].map((item, idx) => (
                <View key={idx}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginBottom: spacing.sm,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: typography.size.sm,
                        fontWeight: '600',
                        color: colors.foreground,
                      }}
                    >
                      {item.label}
                    </Text>
                    <Text
                      style={{
                        fontSize: typography.size.sm,
                        fontWeight: '700',
                        color: colors.primary,
                      }}
                    >
                      {item.value}{item.unit}
                    </Text>
                  </View>
                  <View
                    style={{
                      height: 6,
                      backgroundColor: colors.surface,
                      borderRadius: 3,
                      overflow: 'hidden',
                    }}
                  >
                    <View
                      style={{
                        height: '100%',
                        width: `${Math.min((item.value / item.target) * 100, 100)}%`,
                        backgroundColor: colors.primary,
                      }}
                    />
                  </View>
                </View>
              ))}
            </View>
          </GlassCardPremium>
        </Animated.View>

        {/* Health Score */}
        <Animated.View
          entering={SlideInUp.duration(400).delay(400)}
          style={{
            paddingHorizontal: spacing.gutter,
            paddingVertical: spacing.lg,
          }}
        >
          <GlassCardPremium padding={spacing.lg} shadow="md">
            <View style={{ alignItems: 'center' }}>
              <Text
                style={{
                  fontSize: typography.size.sm,
                  fontWeight: '600',
                  color: colors.muted,
                  marginBottom: spacing.sm,
                }}
              >
                Meal Quality Score
              </Text>
              <Text
                style={{
                  fontSize: typography.size['3xl'],
                  fontWeight: '700',
                  color: colors.primary,
                }}
              >
                {nutrition.healthScore}/100
              </Text>
            </View>
          </GlassCardPremium>
        </Animated.View>

        {/* Recommendations */}
        <Animated.View
          entering={SlideInUp.duration(400).delay(500)}
          style={{
            paddingHorizontal: spacing.gutter,
            paddingVertical: spacing.lg,
          }}
        >
          <Text
            style={{
              fontSize: typography.size.lg,
              fontWeight: '600',
              color: colors.foreground,
              marginBottom: spacing.lg,
            }}
          >
            AI Recommendations
          </Text>

          <View style={{ gap: spacing.md }}>
            {nutrition.recommendations.map((rec, idx) => (
              <GlassCardPremium key={idx} padding={spacing.lg} shadow="md">
                <View style={{ flexDirection: 'row', gap: spacing.md }}>
                  <Text
                    style={{
                      fontSize: typography.size.lg,
                      color: colors.primary,
                    }}
                  >
                    ✓
                  </Text>
                  <Text
                    style={{
                      fontSize: typography.size.sm,
                      fontWeight: '500',
                      color: colors.foreground,
                      flex: 1,
                    }}
                  >
                    {rec}
                  </Text>
                </View>
              </GlassCardPremium>
            ))}
          </View>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View
          entering={SlideInUp.duration(400).delay(600)}
          style={{
            paddingHorizontal: spacing.gutter,
            paddingVertical: spacing.xl,
            gap: spacing.md,
          }}
        >
          <PremiumButton
            size="lg"
            onPress={() => router.push('/(camera)/voice-correction')}
          >
            <Text
              style={{
                fontSize: typography.size.md,
                fontWeight: '700',
                color: colors.background,
              }}
            >
              🎤 Correct with Voice
            </Text>
          </PremiumButton>

          <PremiumButton
            variant="outline"
            size="lg"
            onPress={() => router.push('/(camera)/meal-breakdown')}
          >
            <Text
              style={{
                fontSize: typography.size.md,
                fontWeight: '700',
                color: colors.primary,
              }}
            >
              ✏️ Edit Manually
            </Text>
          </PremiumButton>

          <PremiumButton
            variant="ghost"
            size="lg"
            onPress={() => router.back()}
          >
            <Text
              style={{
                fontSize: typography.size.md,
                fontWeight: '700',
                color: colors.primary,
              }}
            >
              ↻ Retake Photo
            </Text>
          </PremiumButton>
        </Animated.View>

        {/* Spacing */}
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </ScreenContainer>
  );
}
