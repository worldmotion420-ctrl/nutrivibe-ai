import React from 'react';
import { View, type ViewProps } from 'react-native';
import { cn } from '@/lib/utils';

interface GlassCardProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
  blur?: boolean;
}

export function GlassCard({
  children,
  className,
  blur = true,
  ...props
}: GlassCardProps) {
  return (
    <View
      className={cn(
        'rounded-3xl p-4 border border-border',
        'bg-surface',
        blur && 'shadow-glow',
        className
      )}
      {...props}
    >
      {children}
    </View>
  );
}
