import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenContainer } from '@/components/screen-container';
import { GlassCardPremium } from '@/components/ui/glass-card-premium';
import { PremiumButton } from '@/components/ui/button-premium';
import { spacing, typography, colors, radius, shadows } from '@/lib/design-system';

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: 'Forever',
    features: [
      'Unlimited meal logging',
      'Basic nutrition tracking',
      'Daily dashboard',
      'Ads included',
    ],
    cta: 'Current Plan',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$9.99',
    period: '/month',
    features: [
      'Everything in Free',
      'AI-powered insights',
      'Advanced analytics',
      'Priority support',
      'Ad-free experience',
      'Custom goals',
    ],
    cta: 'Upgrade Now',
    highlighted: true,
  },
  {
    name: 'Premium+',
    price: '$19.99',
    period: '/month',
    features: [
      'Everything in Pro',
      'Apple Health sync',
      'Google Fit integration',
      'Meal planning',
      'Nutrition coaching',
      'Offline mode',
    ],
    cta: 'Upgrade Now',
    highlighted: false,
  },
];

export default function PremiumPremiumScreen() {
  const [selectedPlan, setSelectedPlan] = useState(1);

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
            Your AI System.
          </Text>
          <Text
            style={{
              fontSize: typography.size.lg,
              fontWeight: '400',
              color: colors.muted,
              marginTop: spacing.sm,
            }}
          >
            Unlock the complete experience.
          </Text>
        </LinearGradient>

        {/* Plans */}
        <View style={{ paddingHorizontal: spacing.gutter, paddingVertical: spacing.xl }}>
          <View style={{ gap: spacing.lg }}>
            {PLANS.map((plan, idx) => (
              <Pressable
                key={idx}
                onPress={() => setSelectedPlan(idx)}
                style={({ pressed }) => [
                  { transform: [{ scale: pressed ? 0.98 : 1 }] },
                ]}
              >
                <View
                  style={[
                    {
                      borderRadius: radius.xl,
                      overflow: 'hidden',
                    },
                    plan.highlighted && shadows.glowLg,
                  ]}
                >
                  <GlassCardPremium
                    padding={spacing.lg}
                    glow={selectedPlan === idx}
                    shadow={plan.highlighted ? 'lg' : 'md'}
                  >
                    <View style={{ gap: spacing.lg }}>
                      {/* Plan Header */}
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                        }}
                      >
                        <View>
                          <Text
                            style={{
                              fontSize: typography.size.lg,
                              fontWeight: '700',
                              color: colors.foreground,
                            }}
                          >
                            {plan.name}
                          </Text>
                          {plan.highlighted && (
                            <View
                              style={{
                                backgroundColor: colors.primary,
                                paddingHorizontal: spacing.md,
                                paddingVertical: spacing.xs,
                                borderRadius: radius.md,
                                marginTop: spacing.sm,
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: typography.size.xs,
                                  fontWeight: '600',
                                  color: colors.background,
                                }}
                              >
                                Most Popular
                              </Text>
                            </View>
                          )}
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                          <Text
                            style={{
                              fontSize: typography.size['2xl'],
                              fontWeight: '700',
                              color: colors.primary,
                            }}
                          >
                            {plan.price}
                          </Text>
                          <Text
                            style={{
                              fontSize: typography.size.xs,
                              fontWeight: '400',
                              color: colors.muted,
                            }}
                          >
                            {plan.period}
                          </Text>
                        </View>
                      </View>

                      {/* Features */}
                      <View style={{ gap: spacing.md }}>
                        {plan.features.map((feature, fidx) => (
                          <View
                            key={fidx}
                            style={{
                              flexDirection: 'row',
                              gap: spacing.md,
                              alignItems: 'center',
                            }}
                          >
                            <Text
                              style={{
                                fontSize: typography.size.md,
                                color: colors.primary,
                              }}
                            >
                              ✓
                            </Text>
                            <Text
                              style={{
                                fontSize: typography.size.sm,
                                fontWeight: '400',
                                color: colors.foreground,
                                flex: 1,
                              }}
                            >
                              {feature}
                            </Text>
                          </View>
                        ))}
                      </View>

                      {/* CTA */}
                      <PremiumButton
                        variant={plan.highlighted ? 'primary' : 'outline'}
                        size="md"
                        fullWidth
                        glow={plan.highlighted}
                      >
                        {plan.cta}
                      </PremiumButton>
                    </View>
                  </GlassCardPremium>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* FAQ */}
        <View style={{ paddingHorizontal: spacing.gutter, paddingVertical: spacing.xl }}>
          <Text
            style={{
              fontSize: typography.size.lg,
              fontWeight: '600',
              color: colors.foreground,
              marginBottom: spacing.lg,
            }}
          >
            Frequently Asked
          </Text>

          <View style={{ gap: spacing.md }}>
            <GlassCardPremium padding={spacing.lg} shadow="md">
              <View>
                <Text
                  style={{
                    fontSize: typography.size.md,
                    fontWeight: '600',
                    color: colors.foreground,
                    marginBottom: spacing.sm,
                  }}
                >
                  Can I cancel anytime?
                </Text>
                <Text
                  style={{
                    fontSize: typography.size.sm,
                    fontWeight: '400',
                    color: colors.muted,
                  }}
                >
                  Yes, cancel your subscription anytime with no penalties.
                </Text>
              </View>
            </GlassCardPremium>

            <GlassCardPremium padding={spacing.lg} shadow="md">
              <View>
                <Text
                  style={{
                    fontSize: typography.size.md,
                    fontWeight: '600',
                    color: colors.foreground,
                    marginBottom: spacing.sm,
                  }}
                >
                  Is there a free trial?
                </Text>
                <Text
                  style={{
                    fontSize: typography.size.sm,
                    fontWeight: '400',
                    color: colors.muted,
                  }}
                >
                  Yes, get 7 days free on any paid plan.
                </Text>
              </View>
            </GlassCardPremium>
          </View>
        </View>

        {/* Spacing */}
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </ScreenContainer>
  );
}
