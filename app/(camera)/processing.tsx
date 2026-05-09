import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';

const STEPS = [
  'Detecting food items',
  'Estimating portions',
  'Calculating macros',
];

export default function ProcessingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [currentStep, setCurrentStep] = React.useState(0);

  useEffect(() => {
    // Simulate processing steps
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < STEPS.length - 1) {
          return prev + 1;
        } else {
          // Move to meal breakdown after all steps
          setTimeout(() => {
            router.push({
              pathname: '/(camera)/meal-breakdown',
              params: { imageUri: params.imageUri },
            } as any);
          }, 500);
          return prev;
        }
      });
    }, 800);

    return () => clearInterval(interval);
  }, [params.imageUri]);

  return (
    <ScreenContainer className="items-center justify-center">
      <View className="gap-8 items-center">
        {/* Animated circle */}
        <View className="w-40 h-40 rounded-full border-4 border-primary items-center justify-center">
          <View className="w-32 h-32 rounded-full border-4 border-primary opacity-50" />
        </View>

        {/* Status text */}
        <View className="gap-4 items-center">
          <Text className="text-2xl font-bold text-foreground">
            Analyzing Meal...
          </Text>
          <Text className="text-base text-primary">
            {STEPS[currentStep]}
          </Text>
        </View>

        {/* Progress indicator */}
        <View className="w-48 h-2 bg-surface rounded-full overflow-hidden">
          <View
            className="h-full bg-primary"
            style={{
              width: `${((currentStep + 1) / STEPS.length) * 100}%`,
            }}
          />
        </View>

        {/* Step list */}
        <View className="gap-2">
          {STEPS.map((step, index) => (
            <View key={index} className="flex-row items-center gap-2">
              <View
                className={`w-5 h-5 rounded-full items-center justify-center ${
                  index <= currentStep ? 'bg-primary' : 'bg-surface'
                }`}
              >
                {index <= currentStep && (
                  <Text className="text-background text-xs font-bold">✓</Text>
                )}
              </View>
              <Text
                className={`text-sm ${
                  index <= currentStep ? 'text-foreground' : 'text-muted'
                }`}
              >
                {step}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScreenContainer>
  );
}
