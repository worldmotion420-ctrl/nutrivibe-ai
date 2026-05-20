import React, { useEffect } from 'react';
import { View, Animated } from 'react-native';

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  className?: string;
}

export function SkeletonLoader({
  width = '100%',
  height = 20,
  borderRadius = 8,
  className = '',
}: SkeletonProps) {
  const shimmerAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [shimmerAnim]);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        {
          width: typeof width === 'number' ? width : width,
          height: typeof height === 'number' ? height : height,
          borderRadius,
          opacity,
          backgroundColor: '#334155',
        } as any,
      ]}
      className={className}
    />
  );
}

interface SkeletonCardProps {
  lines?: number;
  className?: string;
}

export function SkeletonCard({ lines = 3, className = '' }: SkeletonCardProps) {
  return (
    <View className={`gap-3 p-4 rounded-xl bg-surface border border-border ${className}`}>
      {/* Header */}
      <View className="gap-2">
        <SkeletonLoader width="60%" height={16} />
        <SkeletonLoader width="40%" height={12} />
      </View>

      {/* Content lines */}
      <View className="gap-2">
        {Array.from({ length: lines }).map((_, i) => (
          <SkeletonLoader
            key={i}
            width={i === lines - 1 ? '70%' : '100%'}
            height={12}
          />
        ))}
      </View>
    </View>
  );
}

export function SkeletonMealCard() {
  return (
    <View className="gap-3 p-4 rounded-xl bg-surface border border-border">
      {/* Meal header */}
      <View className="flex-row items-center justify-between">
        <View className="flex-1 gap-2">
          <SkeletonLoader width="50%" height={16} />
          <SkeletonLoader width="30%" height={12} />
        </View>
        <SkeletonLoader width={40} height={40} borderRadius={8} />
      </View>

      {/* Nutrition info */}
      <View className="gap-2">
        <SkeletonLoader width="100%" height={12} />
        <SkeletonLoader width="85%" height={12} />
      </View>
    </View>
  );
}
