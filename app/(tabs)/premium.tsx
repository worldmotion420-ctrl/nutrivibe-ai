import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    features: [
      '3 meals per day',
      'Basic nutrition tracking',
      'Basic insights',
    ],
    cta: 'Current Plan',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$9.99',
    period: '/month',
    features: [
      'Unlimited meals',
      'Advanced AI analysis',
      'Detailed insights & trends',
      'Export reports',
      'Priority support',
      'Apple Health sync',
    ],
    cta: 'Start Free Trial',
    highlighted: true,
  },
  {
    name: 'Annual',
    price: '$79.99',
    period: '/year',
    features: [
      'All Pro features',
      'Save 33%',
      'Lifetime updates',
    ],
    cta: 'Subscribe Now',
    highlighted: false,
  },
];

export default function PremiumScreen() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState('pro');

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-6">
          {/* Header */}
          <View className="gap-2 items-center">
            <Text className="text-3xl font-bold text-foreground">
              Your AI nutrition system.
            </Text>
            <Text className="text-base text-muted text-center">
              Unlock the complete experience.
            </Text>
          </View>

          {/* Plans */}
          <View className="gap-4">
            {PLANS.map((plan) => (
              <Pressable
                key={plan.name}
                onPress={() => setSelectedPlan(plan.name.toLowerCase())}
                style={({ pressed }) => [pressed && { opacity: 0.7 }]}
              >
                <GlassCard
                  className={`gap-4 ${
                    plan.highlighted ? 'border-2 border-primary' : ''
                  }`}
                >
                  {/* Plan Header */}
                  <View className="flex-row items-center justify-between">
                    <View className="gap-1">
                      <Text className="text-lg font-bold text-foreground">
                        {plan.name}
                      </Text>
                      <View className="flex-row items-baseline gap-1">
                        <Text className="text-2xl font-bold text-primary">
                          {plan.price}
                        </Text>
                        <Text className="text-sm text-muted">
                          {plan.period}
                        </Text>
                      </View>
                    </View>
                    <View
                      className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                        selectedPlan === plan.name.toLowerCase()
                          ? 'bg-primary border-primary'
                          : 'border-border'
                      }`}
                    >
                      {selectedPlan === plan.name.toLowerCase() && (
                        <Text className="text-background text-xs font-bold">
                          ✓
                        </Text>
                      )}
                    </View>
                  </View>

                  {/* Features */}
                  <View className="gap-2">
                    {plan.features.map((feature, idx) => (
                      <View
                        key={idx}
                        className="flex-row items-center gap-2"
                      >
                        <Text className="text-primary">✓</Text>
                        <Text className="text-sm text-foreground">
                          {feature}
                        </Text>
                      </View>
                    ))}
                  </View>

                  {/* CTA */}
                  <Button
                    variant={plan.highlighted ? 'primary' : 'secondary'}
                    size="md"
                    className="w-full"
                  >
                    {plan.cta}
                  </Button>
                </GlassCard>
              </Pressable>
            ))}
          </View>

          {/* FAQ */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">
              FAQ
            </Text>
            <GlassCard className="gap-2">
              <Text className="font-semibold text-foreground">
                Can I cancel anytime?
              </Text>
              <Text className="text-sm text-muted">
                Yes, cancel your subscription anytime. No questions asked.
              </Text>
            </GlassCard>
            <GlassCard className="gap-2">
              <Text className="font-semibold text-foreground">
                What's included in Pro?
              </Text>
              <Text className="text-sm text-muted">
                Unlimited meal logging, advanced AI analysis, detailed insights, and more.
              </Text>
            </GlassCard>
          </View>

          {/* Fine Print */}
          <Text className="text-xs text-muted text-center">
            7-day free trial. Subscription renews automatically. Cancel anytime.
          </Text>

          {/* Back Button */}
          <Button
            variant="secondary"
            size="lg"
            onPress={() => router.back()}
          >
            Back
          </Button>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
