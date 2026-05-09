import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/lib/stores/auth-store';

export default function SignInScreen() {
  const router = useRouter();
  const { signIn, isLoading, error } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  const handleSignIn = async () => {
    setFormError('');
    if (!email || !password) {
      setFormError('Please fill in all fields');
      return;
    }

    try {
      await signIn(email, password);
      router.replace('/(tabs)');
    } catch (err: any) {
      setFormError(err.message || 'Sign in failed');
    }
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-6 justify-center">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">
              Welcome Back
            </Text>
            <Text className="text-base text-muted">
              Sign in to your NutriVibe account
            </Text>
          </View>

          {/* Form */}
          <View className="gap-4">
            {(formError || error) && (
              <View className="p-3 rounded-lg bg-error/10 border border-error">
                <Text className="text-sm text-error">
                  {formError || error}
                </Text>
              </View>
            )}

            <Input
              label="Email"
              placeholder="you@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Input
              label="Password"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {/* CTA */}
          <View className="gap-3">
            <Button
              variant="primary"
              size="lg"
              isLoading={isLoading}
              onPress={handleSignIn}
            >
              Sign In
            </Button>

            <Button
              variant="secondary"
              size="lg"
              onPress={() => router.push('/(auth)/sign-up' as any)}
            >
              Create Account
            </Button>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
