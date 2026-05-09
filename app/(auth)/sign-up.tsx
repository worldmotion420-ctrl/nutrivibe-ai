import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/lib/stores/auth-store';

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp, isLoading, error } = useAuthStore();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');

  const handleSignUp = async () => {
    setFormError('');

    if (!fullName || !email || !password || !confirmPassword) {
      setFormError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return;
    }

    try {
      await signUp(email, password, fullName);
      router.replace('/(auth)/goal-selection' as any);
    } catch (err: any) {
      setFormError(err.message || 'Sign up failed');
    }
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-6 justify-center">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">
              Create Account
            </Text>
            <Text className="text-base text-muted">
              Join NutriVibe AI today
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
              label="Full Name"
              placeholder="John Doe"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />

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

            <Input
              label="Confirm Password"
              placeholder="••••••••"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>

          {/* CTA */}
          <View className="gap-3">
            <Button
              variant="primary"
              size="lg"
              isLoading={isLoading}
              onPress={handleSignUp}
            >
              Create Account
            </Button>

            <Button
              variant="secondary"
              size="lg"
              onPress={() => router.push('/(auth)/sign-in' as any)}
            >
              Already have an account?
            </Button>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
