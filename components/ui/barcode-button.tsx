import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useColors } from '@/hooks/use-colors';
import { hapticFeedback } from '@/lib/utils/haptics';

interface BarcodeButtonProps {
  onPress?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export function BarcodeButton({ onPress, size = 'md' }: BarcodeButtonProps) {
  const colors = useColors();

  const sizeConfig = {
    sm: { width: 44, height: 44, iconSize: 20 },
    md: { width: 56, height: 56, iconSize: 28 },
    lg: { width: 64, height: 64, iconSize: 32 },
  };

  const config = sizeConfig[size];

  const handlePress = async () => {
    await hapticFeedback.tap();
    onPress?.();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={{
        width: config.width,
        height: config.height,
      }}
      className="rounded-full bg-surface border border-primary/30 items-center justify-center active:opacity-80"
    >
      <View
        className="absolute inset-0 rounded-full bg-primary/10"
        style={{
          boxShadow: `0 0 20px ${colors.primary}40`,
        }}
      />
      <MaterialIcons
        name="barcode-reader"
        size={config.iconSize}
        color={colors.primary}
      />
    </TouchableOpacity>
  );
}
