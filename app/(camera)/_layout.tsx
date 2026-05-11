import { Stack } from 'expo-router';

export default function CameraLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="capture" />
      <Stack.Screen name="lens" />
      <Stack.Screen name="processing" />
      <Stack.Screen name="meal-breakdown" />
      <Stack.Screen name="voice-correction" />
      <Stack.Screen name="barcode-scan" />
      <Stack.Screen name="barcode-scanner" />
      <Stack.Screen name="meal-confirmation" />
    </Stack>
  );
}
