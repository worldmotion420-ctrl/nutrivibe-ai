import { Stack } from 'expo-router';

export default function CameraLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="lens" />
      <Stack.Screen name="processing" />
      <Stack.Screen name="meal-breakdown" />
      <Stack.Screen name="voice-correction" />
      <Stack.Screen name="barcode-scanner" />
    </Stack>
  );
}
