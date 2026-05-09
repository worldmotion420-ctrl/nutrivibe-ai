import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

interface CircularProgressProps {
  current: number;
  target: number;
  radius?: number;
  strokeWidth?: number;
  duration?: number;
  showLabel?: boolean;
  unit?: string;
  color?: string;
  backgroundColor?: string;
}

export function CircularProgress({
  current,
  target,
  radius = 80,
  strokeWidth = 8,
  duration = 1000,
  showLabel = true,
  unit = 'kcal',
  color = '#CCFF00',
  backgroundColor = '#2A3050',
}: CircularProgressProps) {
  const progress = useSharedValue(0);
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(current / target, 1);

  useEffect(() => {
    progress.value = withTiming(percentage, {
      duration,
      easing: Easing.inOut(Easing.ease),
    });
  }, [current, target, percentage, progress, duration]);

  const strokeDashoffset = circumference * (1 - percentage);

  return (
    <View className="items-center justify-center">
      <Svg
        width={radius * 2 + strokeWidth * 2}
        height={radius * 2 + strokeWidth * 2}
        viewBox={`0 0 ${radius * 2 + strokeWidth * 2} ${radius * 2 + strokeWidth * 2}`}
      >
        {/* Background circle */}
        <Circle
          cx={radius + strokeWidth}
          cy={radius + strokeWidth}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Progress circle */}
        <Circle
          cx={radius + strokeWidth}
          cy={radius + strokeWidth}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${radius + strokeWidth} ${radius + strokeWidth})`}
        />
      </Svg>

      {showLabel && (
        <View className="absolute items-center justify-center">
          <Text className="text-2xl font-bold text-primary">
            {Math.round(current)}
          </Text>
          <Text className="text-xs text-muted">
            / {target} {unit}
          </Text>
        </View>
      )}
    </View>
  );
}
