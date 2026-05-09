import React from 'react';
import { View, Text, Animated, Easing } from 'react-native';
import { useSyncState } from '@/lib/services/sync-manager';
import { spacing, typography, colors, shadows } from '@/lib/design-system';

export function OfflineIndicator() {
  const syncState = useSyncState();
  const slideAnim = new Animated.Value(syncState.isOnline ? 100 : 0);

  React.useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: syncState.isOnline ? 100 : 0,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [syncState.isOnline]);

  if (syncState.isOnline) {
    return null;
  }

  return (
    <Animated.View
      style={{
        transform: [
          {
            translateY: slideAnim.interpolate({
              inputRange: [0, 100],
              outputRange: [-60, 0],
            }),
          },
        ],
      }}
    >
      <View
        style={{
          backgroundColor: colors.warning,
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.md,
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.md,
          ...shadows.md,
        }}
      >
        <Text style={{ fontSize: 16 }}>📡</Text>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: typography.size.sm,
              fontWeight: '600',
              color: colors.background,
            }}
          >
            You're Offline
          </Text>
          <Text
            style={{
              fontSize: typography.size.xs,
              fontWeight: '400',
              color: colors.background,
              opacity: 0.8,
            }}
          >
            Changes will sync when online
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

export function SyncStatus() {
  const syncState = useSyncState();

  if (syncState.pendingItems === 0) {
    return null;
  }

  return (
    <View
      style={{
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        ...shadows.glowMd,
      }}
    >
      <Text style={{ fontSize: 16 }}>🔄</Text>
      <Text
        style={{
          fontSize: typography.size.sm,
          fontWeight: '600',
          color: colors.background,
          flex: 1,
        }}
      >
        {syncState.isSyncing ? 'Syncing...' : `${syncState.pendingItems} pending`}
      </Text>
    </View>
  );
}
