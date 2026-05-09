import React, { useState } from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { spacing, typography, shadows, colors, radius } from '@/lib/design-system';

interface PremiumButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  glow?: boolean;
  icon?: React.ReactNode;
}

export function PremiumButton({
  variant = 'primary',
  size = 'md',
  children,
  onPress,
  disabled = false,
  loading = false,
  fullWidth = false,
  glow = false,
  icon,
}: PremiumButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const sizeConfig = {
    sm: { padding: spacing.sm, height: 36, fontSize: typography.size.sm },
    md: { padding: spacing.md, height: 44, fontSize: typography.size.base },
    lg: { padding: spacing.lg, height: 52, fontSize: typography.size.md },
  };

  const variantConfig = {
    primary: { bg: colors.primary, text: colors.background, border: 'transparent' },
    secondary: { bg: colors.surface, text: colors.foreground, border: colors.border },
    ghost: { bg: 'transparent', text: colors.primary, border: 'transparent' },
    outline: { bg: 'transparent', text: colors.primary, border: colors.primary },
  };

  const config = sizeConfig[size];
  const vConfig = variantConfig[variant];

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      disabled={disabled || loading}
      style={({ pressed }) => [
        { opacity: disabled ? 0.5 : 1, transform: [{ scale: pressed ? 0.95 : 1 }] },
      ]}
    >
      <View
        style={[
          {
            borderRadius: radius.lg,
            overflow: 'hidden',
            width: fullWidth ? '100%' : 'auto',
          },
          glow && shadows.glowMd,
        ]}
      >
        {variant === 'primary' && (
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        )}

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: spacing.sm,
            paddingVertical: config.padding,
            paddingHorizontal: config.padding * 1.5,
            minHeight: config.height,
            borderRadius: radius.lg,
            borderWidth: variant === 'outline' ? 2 : variant === 'secondary' ? 1 : 0,
            borderColor: vConfig.border,
            backgroundColor: variant === 'primary' ? 'transparent' : vConfig.bg,
          }}
        >
          {icon && <View>{icon}</View>}
          <Text
            style={{
              fontSize: config.fontSize,
              fontWeight: '600',
              color: vConfig.text,
              letterSpacing: 0.2,
            }}
          >
            {loading ? '⏳' : children}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
