import React, { useEffect, useState } from 'react';
import { View, Text, Animated, Pressable } from 'react-native';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onDismiss?: () => void;
}

const getToastStyle = (type: ToastType) => {
  switch (type) {
    case 'success':
      return { bg: 'bg-success/10', border: 'border-success', icon: '✓', color: 'text-success' };
    case 'error':
      return { bg: 'bg-error/10', border: 'border-error', icon: '✕', color: 'text-error' };
    case 'warning':
      return { bg: 'bg-warning/10', border: 'border-warning', icon: '!', color: 'text-warning' };
    case 'info':
    default:
      return { bg: 'bg-primary/10', border: 'border-primary', icon: 'ℹ', color: 'text-primary' };
  }
};

export function Toast({ message, type = 'info', duration = 3000, onDismiss }: ToastProps) {
  const [visible, setVisible] = useState(true);
  const slideAnim = new Animated.Value(0);
  const style = getToastStyle(type);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();

    const timer = setTimeout(() => {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        setVisible(false);
        onDismiss?.();
      });
    }, duration);

    return () => clearTimeout(timer);
  }, [slideAnim, duration, onDismiss]);

  if (!visible) return null;

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 0],
  });

  return (
    <Animated.View
      style={{
        transform: [{ translateY }],
      }}
      className="absolute top-0 left-0 right-0 z-50 px-4 pt-4"
    >
      <View className={`flex-row items-center gap-3 p-4 rounded-lg border ${style.bg} ${style.border}`}>
        <Text className={`text-lg font-bold ${style.color}`}>{style.icon}</Text>
        <Text className={`flex-1 text-sm font-medium ${style.color}`}>{message}</Text>
        <Pressable
          onPress={() => {
            setVisible(false);
            onDismiss?.();
          }}
        >
          <Text className={`text-lg ${style.color}`}>×</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

// Toast context for global access
import { createContext, useContext, ReactNode } from 'react';

interface ToastContextType {
  show: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: ToastType; duration: number }>>([]);

  const show = (message: string, type: ToastType = 'info', duration: number = 3000) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  };

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ show }}>
      <View className="flex-1">
        {children}
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onDismiss={() => dismiss(toast.id)}
          />
        ))}
      </View>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
