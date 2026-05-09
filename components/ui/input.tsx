import React from 'react';
import { TextInput, View, Text, type TextInputProps } from 'react-native';
import { cn } from '@/lib/utils';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerClassName?: string;
  inputClassName?: string;
}

export function Input({
  label,
  error,
  containerClassName,
  inputClassName,
  ...props
}: InputProps) {
  return (
    <View className={cn('gap-2', containerClassName)}>
      {label && (
        <Text className="text-sm font-semibold text-foreground">{label}</Text>
      )}
      <TextInput
        className={cn(
          'rounded-xl bg-surface px-4 py-3 text-foreground border border-border',
          'text-base',
          error && 'border-error',
          inputClassName
        )}
        placeholderTextColor="#A0A0A0"
        {...props}
      />
      {error && (
        <Text className="text-xs text-error">{error}</Text>
      )}
    </View>
  );
}
