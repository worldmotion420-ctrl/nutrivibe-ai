import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { Button } from '@/components/ui/button';

const PERMISSIONS = [
  {
    id: 'camera',
    title: 'Camera Access',
    description: 'Allow the app to capture meals',
    icon: '📷',
  },
  {
    id: 'health',
    title: 'Health Access',
    description: 'Sync with Apple Health',
    icon: '❤️',
  },
  {
    id: 'notifications',
    title: 'Notifications',
    description: 'Reminders & insights',
    icon: '🔔',
  },
];

export default function PermissionsScreen() {
  const router = useRouter();
  const [permissions, setPermissions] = useState<Record<string, boolean>>({
    camera: true,
    health: true,
    notifications: true,
  });

  const handlePermissionToggle = (id: string) => {
    setPermissions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleContinue = () => {
    // TODO: Request actual permissions
    router.replace('/(tabs)');
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">
              Enable AI Tracking
            </Text>
            <Text className="text-base text-muted">
              Allow the following to get better results.
            </Text>
          </View>

          {/* Permissions */}
          <View className="gap-3 flex-1">
            {PERMISSIONS.map((perm) => (
              <View
                key={perm.id}
                className="flex-row items-center justify-between p-4 rounded-2xl bg-surface border border-border"
              >
                <View className="flex-1 gap-1 flex-row items-center">
                  <Text className="text-2xl mr-3">{perm.icon}</Text>
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-foreground">
                      {perm.title}
                    </Text>
                    <Text className="text-xs text-muted">{perm.description}</Text>
                  </View>
                </View>
                <View
                  className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                    permissions[perm.id]
                      ? 'bg-primary border-primary'
                      : 'border-border'
                  }`}
                >
                  {permissions[perm.id] && (
                    <Text className="text-background text-xs font-bold">✓</Text>
                  )}
                </View>
              </View>
            ))}
          </View>

          {/* CTA */}
          <Button
            variant="primary"
            size="lg"
            onPress={handleContinue}
          >
            All Set
          </Button>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
