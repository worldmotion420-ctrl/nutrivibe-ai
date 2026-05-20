import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useCameraPermissions } from 'expo-camera';
import * as Notifications from 'expo-notifications';
import { ScreenContainer } from '@/components/screen-container';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/stores/auth-store';
import { hapticFeedback } from '@/lib/utils/haptics';

interface Permission {
  id: string;
  title: string;
  description: string;
  icon: string;
  status: 'granted' | 'denied' | 'undetermined';
}

export default function PermissionsScreen() {
  const router = useRouter();
  const { user, updateProfile } = useAuthStore();
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [permissions, setPermissions] = useState<Permission[]>([
    {
      id: 'camera',
      title: 'Camera Access',
      description: 'Allow the app to capture meals',
      icon: '📷',
      status: 'undetermined',
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Reminders & insights',
      icon: '🔔',
      status: 'undetermined',
    },
  ]);
  const [isRequesting, setIsRequesting] = useState(false);

  // Check initial permission status
  useEffect(() => {
    checkPermissions();
  }, [cameraPermission]);

  const checkPermissions = async () => {
    try {
      // Check camera permission
      const cameraStatus = cameraPermission?.status || 'undetermined';

      // Check notification permission
      const notificationSettings =
        await Notifications.getPermissionsAsync();
      const notificationStatus = notificationSettings.granted
        ? 'granted'
        : notificationSettings.canAskAgain
          ? 'undetermined'
          : 'denied';

      setPermissions([
        {
          id: 'camera',
          title: 'Camera Access',
          description: 'Allow the app to capture meals',
          icon: '📷',
          status: cameraStatus as any,
        },
        {
          id: 'notifications',
          title: 'Notifications',
          description: 'Reminders & insights',
          icon: '🔔',
          status: notificationStatus as any,
        },
      ]);
    } catch (error) {
      console.error('Error checking permissions:', error);
    }
  };

  const handleRequestPermission = async (permissionId: string) => {
    try {
      setIsRequesting(true);
      await hapticFeedback.impact();

      if (permissionId === 'camera') {
        const result = await requestCameraPermission();
        if (result.granted) {
          await hapticFeedback.success();
          Alert.alert('Success', 'Camera permission granted');
        } else {
          await hapticFeedback.error();
          Alert.alert(
            'Permission Denied',
            'Camera permission is required to capture meals'
          );
        }
      } else if (permissionId === 'notifications') {
        const result = await Notifications.requestPermissionsAsync();
        if (result.granted) {
          await hapticFeedback.success();
          Alert.alert('Success', 'Notification permission granted');
        } else {
          await hapticFeedback.error();
          Alert.alert(
            'Permission Denied',
            'Notification permission is optional but recommended'
          );
        }
      }

      // Refresh permission status
      await checkPermissions();
    } catch (error) {
      console.error('Error requesting permission:', error);
      Alert.alert('Error', 'Failed to request permission');
    } finally {
      setIsRequesting(false);
    }
  };

  const handleContinue = async () => {
    try {
      // Save permission preferences to user profile
      if (user?.id) {
        const permissionsGranted = permissions
          .filter((p) => p.status === 'granted')
          .map((p) => p.id);

        await updateProfile({
          permissions_granted: permissionsGranted,
        } as any);
      }

      await hapticFeedback.success();
      router.replace('/(tabs)' as any);
    } catch (error) {
      console.error('Error saving permissions:', error);
      Alert.alert('Error', 'Failed to save permissions');
    }
  };

  const getPermissionIcon = (status: string) => {
    switch (status) {
      case 'granted':
        return '✅';
      case 'denied':
        return '❌';
      default:
        return '⚠️';
    }
  };

  const getPermissionStatusText = (status: string) => {
    switch (status) {
      case 'granted':
        return 'Granted';
      case 'denied':
        return 'Denied';
      default:
        return 'Not requested';
    }
  };

  const allPermissionsGranted = permissions.every(
    (p) => p.status === 'granted'
  );

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

          {/* Permissions List */}
          <View className="gap-3 flex-1">
            {permissions.map((perm) => (
              <Pressable
                key={perm.id}
                onPress={() => handleRequestPermission(perm.id)}
                disabled={isRequesting || perm.status === 'granted'}
                style={({ pressed }) => [pressed && { opacity: 0.7 }]}
              >
                <View
                  className={`flex-row items-center justify-between p-4 rounded-2xl border ${
                    perm.status === 'granted'
                      ? 'bg-primary/10 border-primary'
                      : 'bg-surface border-border'
                  }`}
                >
                  <View className="flex-1 gap-1 flex-row items-center">
                    <Text className="text-2xl mr-3">{perm.icon}</Text>
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-foreground">
                        {perm.title}
                      </Text>
                      <Text className="text-xs text-muted">
                        {perm.description}
                      </Text>
                    </View>
                  </View>
                  <View className="items-center gap-1">
                    <Text className="text-lg">
                      {getPermissionIcon(perm.status)}
                    </Text>
                    <Text className="text-xs text-muted">
                      {getPermissionStatusText(perm.status)}
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>

          {/* Info Box */}
          <View className="p-4 rounded-lg bg-primary/10 border border-primary">
            <Text className="text-sm text-foreground">
              💡 <Text className="font-semibold">Pro Tip:</Text> Granting
              permissions helps us provide better meal detection and timely
              reminders.
            </Text>
          </View>

          {/* CTA */}
          <View className="gap-2">
            <Button
              variant="primary"
              size="lg"
              onPress={handleContinue}
              disabled={isRequesting}
            >
              {allPermissionsGranted ? 'All Set' : 'Continue'}
            </Button>
            <Text className="text-xs text-muted text-center">
              You can change permissions later in Settings
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
