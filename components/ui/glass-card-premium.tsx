import React from 'react';
import { View, ViewProps } from 'react-native';
import { BlurView } from 'expo-blur';
import { spacing, shadows, radius, colors } from '@/lib/design-system';

interface GlassCardPremiumProps extends ViewProps {
  children: React.ReactNode;
  intensity?: number;
  glow?: boolean;
  shadow?: 'sm' | 'md' | 'lg';
  padding?: number;
  borderColor?: string;
  borderWidth?: number;
}

export function GlassCardPremium({
  children,
  intensity = 80,
  glow = false,
  shadow = 'md',
  padding = spacing.lg,
  borderColor = colors.border,
  borderWidth = 1,
  style,
  ...props
}: GlassCardPremiumProps) {
  const shadowStyle = shadow ? shadows[shadow as keyof typeof shadows] : {};
  const glowStyle = glow ? shadows.glowMd : {};

  return (
    <View
      style={[
        {
          borderRadius: radius.lg,
          overflow: 'hidden',
          ...shadowStyle,
          ...glowStyle,
        },
        style,
      ]}
      {...props}
    >
      <BlurView intensity={intensity} style={{ flex: 1 }}>
        <View
          style={{
            padding,
            borderRadius: radius.lg,
            borderWidth,
            borderColor,
            backgroundColor: colors.glass,
          }}
        >
          {children}
        </View>
      </BlurView>
    </View>
  );
}
