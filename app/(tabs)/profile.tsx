import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/stores/auth-store';

const MENU_ITEMS = [
  { label: 'Goals', icon: '🎯', value: 'Lose Weight' },
  { label: 'Connected Apps', icon: '🔗', value: 'Apple Health' },
  { label: 'AI Preferences', icon: '⚙️', value: '' },
  { label: 'Subscription', icon: '⭐', value: 'Free' },
  { label: 'Settings', icon: '🔧', value: '' },
  { label: 'Help & Support', icon: '❓', value: '' },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuthStore();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/(auth)/welcome' as any);
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-6">
          {/* User Profile Header */}
          <GlassCard className="gap-4">
            <View className="flex-row items-center gap-4">
              <View className="w-16 h-16 rounded-full bg-primary items-center justify-center">
                <Text className="text-3xl">👤</Text>
              </View>
              <View className="flex-1">
                <Text className="text-xl font-bold text-foreground">
                  {user?.full_name || 'User'}
                </Text>
                <Text className="text-sm text-muted">{user?.email}</Text>
              </View>
              <Pressable
                style={({ pressed }) => [pressed && { opacity: 0.7 }]}
              >
                <Text className="text-2xl">›</Text>
              </Pressable>
            </View>
          </GlassCard>

          {/* Menu Items */}
          <View className="gap-2">
            {MENU_ITEMS.map((item, idx) => (
              <Pressable
                key={idx}
                style={({ pressed }) => [pressed && { opacity: 0.7 }]}
              >
                <GlassCard className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3 flex-1">
                    <Text className="text-2xl">{item.icon}</Text>
                    <Text className="text-base font-semibold text-foreground">
                      {item.label}
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    {item.value && (
                      <Text className="text-sm text-muted">{item.value}</Text>
                    )}
                    <Text className="text-muted">›</Text>
                  </View>
                </GlassCard>
              </Pressable>
            ))}
          </View>

          {/* Upgrade to Pro */}
          <GlassCard className="gap-3 border-2 border-primary">
            <View className="flex-row items-center justify-between">
              <View className="gap-1">
                <Text className="text-lg font-bold text-foreground">
                  Upgrade to Pro
                </Text>
                <Text className="text-xs text-muted">
                  Unlock unlimited meals & advanced insights
                </Text>
              </View>
              <Text className="text-2xl">⭐</Text>
            </View>
            <Button
              variant="primary"
              size="sm"
              onPress={() => router.push('/(tabs)/premium' as any)}
            >
              View Plans
            </Button>
          </GlassCard>

          {/* Sign Out */}
          <Button
            variant="secondary"
            size="lg"
            onPress={handleSignOut}
          >
            Sign Out
          </Button>

          {/* Footer */}
          <View className="items-center gap-2">
            <Text className="text-xs text-muted">
              NutriVibe AI v1.0.0
            </Text>
            <View className="flex-row gap-4">
              <Pressable>
                <Text className="text-xs text-primary">Privacy Policy</Text>
              </Pressable>
              <Text className="text-xs text-muted">•</Text>
              <Pressable>
                <Text className="text-xs text-primary">Terms of Service</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
