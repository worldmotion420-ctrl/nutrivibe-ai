import React, { useRef, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function CameraLensScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  const handleCapture = async () => {
    if (!cameraRef.current || isCapturing) return;

    setIsCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: true,
      });

      // Navigate to processing screen with image
      router.push({
        pathname: '/(camera)/processing',
        params: { imageUri: photo.uri, imageBase64: photo.base64 },
      } as any);
    } catch (error) {
      console.error('Failed to capture photo:', error);
    } finally {
      setIsCapturing(false);
    }
  };

  if (!permission) {
    return (
      <ScreenContainer className="items-center justify-center">
        <Text className="text-foreground">Loading...</Text>
      </ScreenContainer>
    );
  }

  if (!permission.granted) {
    return (
      <ScreenContainer className="items-center justify-center gap-4">
        <Text className="text-foreground text-lg font-semibold">
          Camera Permission Required
        </Text>
        <Pressable
          onPress={requestPermission}
          style={({ pressed }) => [pressed && { opacity: 0.7 }]}
        >
          <View className="bg-primary px-6 py-3 rounded-full">
            <Text className="text-background font-semibold">Grant Permission</Text>
          </View>
        </Pressable>
      </ScreenContainer>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <CameraView
        ref={cameraRef}
        style={{ flex: 1 }}
        facing="back"
      >
        {/* Circular overlay */}
        <View className="flex-1 items-center justify-center">
          <View className="w-64 h-64 rounded-full border-4 border-primary opacity-50" />
          
          {/* Status text */}
          <View className="absolute bottom-32 items-center gap-2">
            <Text className="text-primary text-sm font-semibold">
              Analyzing Ingredients...
            </Text>
          </View>

          {/* Bottom controls */}
          <View className="absolute bottom-8 left-0 right-0 flex-row items-center justify-between px-6">
            <Pressable>
              <Text className="text-3xl">🖼️</Text>
            </Pressable>

            <Pressable
              onPress={handleCapture}
              disabled={isCapturing}
              style={({ pressed }) => [pressed && { transform: [{ scale: 0.95 }] }]}
            >
              <View className="w-16 h-16 rounded-full bg-white items-center justify-center border-4 border-primary">
                <View className="w-12 h-12 rounded-full bg-primary" />
              </View>
            </Pressable>

            <Pressable onPress={() => router.back()}>
              <Text className="text-3xl">⚙️</Text>
            </Pressable>
          </View>
        </View>
      </CameraView>
    </View>
  );
}
