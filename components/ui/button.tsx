import React from 'react';
import { Pressable, Text, type PressableProps, View } from 'react-native';
import { cn } from '@/lib/utils';

interface ButtonProps extends PressableProps {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  textClassName?: string;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  isLoading = false,
  disabled = false,
  className,
  textClassName,
  style,
  ...props
}: ButtonProps) {
  const baseClasses = 'rounded-full items-center justify-center font-semibold';
  
  const variantClasses = {
    primary: 'bg-primary',
    secondary: 'bg-surface border border-border',
    tertiary: 'bg-transparent',
    ghost: 'bg-transparent',
  };

  const sizeClasses = {
    sm: 'px-4 py-2',
    md: 'px-6 py-3',
    lg: 'px-8 py-4',
  };

  const textVariantClasses = {
    primary: 'text-background',
    secondary: 'text-foreground',
    tertiary: 'text-primary',
    ghost: 'text-foreground',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const buttonClasses = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    disabled && 'opacity-50',
    className
  );

  const textClasses = cn(
    textVariantClasses[variant],
    textSizeClasses[size],
    textClassName
  );

  return (
    <Pressable
      disabled={disabled || isLoading}
      style={({ pressed }) => ([
        pressed && !disabled && { transform: [{ scale: 0.97 }] },
        style,
      ] as any)}
      {...props}
    >
      <View className={buttonClasses}>
        {isLoading ? (
          <Text className={textClasses}>Loading...</Text>
        ) : (
          <Text className={textClasses}>{children}</Text>
        )}
      </View>
    </Pressable>
  );
}
