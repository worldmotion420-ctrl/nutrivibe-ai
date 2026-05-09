import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenContainer } from '@/components/screen-container';
import { GlassCardPremium } from '@/components/ui/glass-card-premium';
import { PremiumButton } from '@/components/ui/button-premium';
import { spacing, typography, colors, radius } from '@/lib/design-system';

const MENU_ITEMS = [
  { icon: '🎯', label: 'Goals', desc: 'Manage your nutrition goals' },
  { icon: '🔗', label: 'Connected Apps', desc: 'Apple Health, Google Fit' },
  { icon: '⚙️', label: 'Preferences', desc: 'Units, notifications, privacy' },
  { icon: '📋', label: 'Subscription', desc: 'View your plan & billing' },
  { icon: '❓', label: 'Help & Support', desc: 'FAQ, contact support' },
];

export default function ProfilePremiumScreen() {
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
            Profile
          </Text>
        </LinearGradient>

        {/* User Card */}
        <View style={{ paddingHorizontal: spacing.gutter, paddingVertical: spacing.xl }}>
          <GlassCardPremium padding={spacing.lg} shadow="md">
            <View style={{ flexDirection: 'row', gap: spacing.lg, alignItems: 'center' }}>
              <View
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  backgroundColor: colors.primary,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 28 }}>👤</Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: typography.size.lg,
                    fontWeight: '600',
                    color: colors.foreground,
                  }}
                >
                  Michael Smith
                </Text>
                <Text
                  style={{
                    fontSize: typography.size.sm,
                    fontWeight: '400',
                    color: colors.muted,
                    marginTop: spacing.xs,
                  }}
                >
                  michael@example.com
                </Text>
              </View>

              <Text style={{ fontSize: 24 }}>→</Text>
            </View>
          </GlassCardPremium>
        </View>

        {/* Menu Items */}
        <View style={{ paddingHorizontal: spacing.gutter, paddingVertical: spacing.xl }}>
          <View style={{ gap: spacing.md }}>
            {MENU_ITEMS.map((item, idx) => (
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
                      justifyContent: 'space-between',
                    }}
                  >
                    <View style={{ flexDirection: 'row', gap: spacing.lg, flex: 1 }}>
                      <Text style={{ fontSize: 24 }}>{item.icon}</Text>
                      <View>
                        <Text
                          style={{
                            fontSize: typography.size.md,
                            fontWeight: '600',
                            color: colors.foreground,
                          }}
                        >
                          {item.label}
                        </Text>
                        <Text
                          style={{
                            fontSize: typography.size.sm,
                            fontWeight: '400',
                            color: colors.muted,
                            marginTop: spacing.xs,
                          }}
                        >
                          {item.desc}
                        </Text>
                      </View>
                    </View>
                    <Text
                      style={{
                        fontSize: typography.size.lg,
                        color: colors.muted,
                      }}
                    >
                      →
                    </Text>
                  </View>
                </GlassCardPremium>
              </Pressable>
            ))}
          </View>
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
            Your Stats
          </Text>

          <View style={{ gap: spacing.md }}>
            <View style={{ flexDirection: 'row', gap: spacing.md }}>
              <GlassCardPremium padding={spacing.lg} shadow="md" style={{ flex: 1 }}>
                <View style={{ alignItems: 'center', gap: spacing.sm }}>
                  <Text style={{ fontSize: 28 }}>📅</Text>
                  <Text
                    style={{
                      fontSize: typography.size.md,
                      fontWeight: '700',
                      color: colors.foreground,
                    }}
                  >
                    127
                  </Text>
                  <Text
                    style={{
                      fontSize: typography.size.xs,
                      fontWeight: '400',
                      color: colors.muted,
                    }}
                  >
                    Days Tracked
                  </Text>
                </View>
              </GlassCardPremium>

              <GlassCardPremium padding={spacing.lg} shadow="md" style={{ flex: 1 }}>
                <View style={{ alignItems: 'center', gap: spacing.sm }}>
                  <Text style={{ fontSize: 28 }}>🍽️</Text>
                  <Text
                    style={{
                      fontSize: typography.size.md,
                      fontWeight: '700',
                      color: colors.foreground,
                    }}
                  >
                    1,247
                  </Text>
                  <Text
                    style={{
                      fontSize: typography.size.xs,
                      fontWeight: '400',
                      color: colors.muted,
                    }}
                  >
                    Meals Logged
                  </Text>
                </View>
              </GlassCardPremium>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={{ paddingHorizontal: spacing.gutter, paddingVertical: spacing.xl }}>
          <PremiumButton variant="ghost" size="lg" fullWidth>
            🔓 Sign Out
          </PremiumButton>
        </View>

        {/* Spacing */}
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </ScreenContainer>
  );
}
