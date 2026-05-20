import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, Pressable, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/stores/auth-store';
import { hapticFeedback } from '@/lib/utils/haptics';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, updateProfile } = useAuthStore();

  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [dailyCalories, setDailyCalories] = useState('');
  const [dailyProtein, setDailyProtein] = useState('');
  const [dailyCarbs, setDailyCarbs] = useState('');
  const [dailyFat, setDailyFat] = useState('');
  const [activityLevel, setActivityLevel] = useState('moderate');
  const [goal, setGoal] = useState('weight_loss');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const activityLevels = [
    { value: 'sedentary', label: 'Sedentary (little exercise)' },
    { value: 'light', label: 'Light (1-3 days/week)' },
    { value: 'moderate', label: 'Moderate (3-5 days/week)' },
    { value: 'active', label: 'Active (6-7 days/week)' },
    { value: 'very_active', label: 'Very Active (2x per day)' },
  ];

  const goals = [
    { value: 'weight_loss', label: 'Weight Loss' },
    { value: 'weight_gain', label: 'Weight Gain' },
    { value: 'muscle_gain', label: 'Muscle Gain' },
    { value: 'maintenance', label: 'Maintenance' },
  ];

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || '');
      setAge(user.age?.toString() || '');
      setHeight(user.height_cm?.toString() || '');
      setWeight(user.weight_kg?.toString() || '');
      setDailyCalories(user.daily_calorie_target?.toString() || '2200');
      setDailyProtein(user.daily_protein_target?.toString() || '150');
      setDailyCarbs(user.daily_carbs_target?.toString() || '200');
      setDailyFat(user.daily_fat_target?.toString() || '65');
      setActivityLevel(user.activity_level || 'moderate');
      setGoal(user.goal || 'weight_loss');
      setIsLoading(false);
    }
  }, [user]);

  const calculateMacros = () => {
    const calories = parseInt(dailyCalories) || 2200;
    // Standard macro split: 40% carbs, 30% protein, 30% fat
    const protein = Math.round((calories * 0.3) / 4);
    const carbs = Math.round((calories * 0.4) / 4);
    const fat = Math.round((calories * 0.3) / 9);

    setDailyProtein(protein.toString());
    setDailyCarbs(carbs.toString());
    setDailyFat(fat.toString());
  };

  const handleSave = async () => {
    if (!fullName.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    if (!age || !height || !weight) {
      Alert.alert('Error', 'Please fill in all personal metrics');
      return;
    }

    try {
      setIsSaving(true);
      await hapticFeedback.impact();

      await updateProfile({
        full_name: fullName,
        age: parseInt(age),
        height_cm: parseInt(height),
        weight_kg: parseFloat(weight),
        daily_calorie_target: parseInt(dailyCalories),
        daily_protein_target: parseInt(dailyProtein),
        daily_carbs_target: parseInt(dailyCarbs),
        daily_fat_target: parseInt(dailyFat),
        activity_level: activityLevel,
        goal,
      });

      await hapticFeedback.success();
      Alert.alert('Success', 'Profile updated', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      await hapticFeedback.error();
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator size="large" color="#CCFF00" />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-2xl font-bold text-foreground">
              Edit Profile
            </Text>
            <Text className="text-sm text-muted">
              Update your personal information and nutrition targets
            </Text>
          </View>

          {/* Personal Information */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">
              Personal Information
            </Text>

            <GlassCard className="gap-2">
              <Text className="text-xs font-semibold text-muted">FULL NAME</Text>
              <TextInput
                value={fullName}
                onChangeText={setFullName}
                placeholder="Enter your name"
                placeholderTextColor="#687076"
                className="text-base text-foreground p-3 rounded-lg bg-surface border border-border"
              />
            </GlassCard>

            <View className="flex-row gap-3">
              <GlassCard className="flex-1 gap-2">
                <Text className="text-xs font-semibold text-muted">AGE</Text>
                <TextInput
                  value={age}
                  onChangeText={setAge}
                  placeholder="25"
                  placeholderTextColor="#687076"
                  keyboardType="number-pad"
                  className="text-base text-foreground p-3 rounded-lg bg-surface border border-border"
                />
              </GlassCard>

              <GlassCard className="flex-1 gap-2">
                <Text className="text-xs font-semibold text-muted">HEIGHT (cm)</Text>
                <TextInput
                  value={height}
                  onChangeText={setHeight}
                  placeholder="180"
                  placeholderTextColor="#687076"
                  keyboardType="number-pad"
                  className="text-base text-foreground p-3 rounded-lg bg-surface border border-border"
                />
              </GlassCard>

              <GlassCard className="flex-1 gap-2">
                <Text className="text-xs font-semibold text-muted">WEIGHT (kg)</Text>
                <TextInput
                  value={weight}
                  onChangeText={setWeight}
                  placeholder="75"
                  placeholderTextColor="#687076"
                  keyboardType="decimal-pad"
                  className="text-base text-foreground p-3 rounded-lg bg-surface border border-border"
                />
              </GlassCard>
            </View>
          </View>

          {/* Activity & Goals */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">
              Activity & Goals
            </Text>

            <GlassCard className="gap-2">
              <Text className="text-xs font-semibold text-muted">ACTIVITY LEVEL</Text>
              <View className="gap-2">
                {activityLevels.map((level) => (
                  <Pressable
                    key={level.value}
                    onPress={() => setActivityLevel(level.value)}
                    className={`p-3 rounded-lg border ${
                      activityLevel === level.value
                        ? 'bg-primary/20 border-primary'
                        : 'bg-surface border-border'
                    }`}
                  >
                    <Text
                      className={`text-sm ${
                        activityLevel === level.value
                          ? 'text-primary font-semibold'
                          : 'text-foreground'
                      }`}
                    >
                      {level.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </GlassCard>

            <GlassCard className="gap-2">
              <Text className="text-xs font-semibold text-muted">GOAL</Text>
              <View className="gap-2">
                {goals.map((g) => (
                  <Pressable
                    key={g.value}
                    onPress={() => setGoal(g.value)}
                    className={`p-3 rounded-lg border ${
                      goal === g.value
                        ? 'bg-primary/20 border-primary'
                        : 'bg-surface border-border'
                    }`}
                  >
                    <Text
                      className={`text-sm ${
                        goal === g.value
                          ? 'text-primary font-semibold'
                          : 'text-foreground'
                      }`}
                    >
                      {g.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </GlassCard>
          </View>

          {/* Nutrition Targets */}
          <View className="gap-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-semibold text-foreground">
                Daily Nutrition Targets
              </Text>
              <Pressable
                onPress={calculateMacros}
                className="px-3 py-1 rounded-full bg-primary/20 border border-primary"
              >
                <Text className="text-xs font-semibold text-primary">
                  Auto Calculate
                </Text>
              </Pressable>
            </View>

            <GlassCard className="gap-2">
              <Text className="text-xs font-semibold text-muted">
                DAILY CALORIES
              </Text>
              <TextInput
                value={dailyCalories}
                onChangeText={setDailyCalories}
                placeholder="2200"
                placeholderTextColor="#687076"
                keyboardType="number-pad"
                className="text-base text-foreground p-3 rounded-lg bg-surface border border-border"
              />
            </GlassCard>

            <View className="flex-row gap-3">
              <GlassCard className="flex-1 gap-2">
                <Text className="text-xs font-semibold text-muted">PROTEIN (g)</Text>
                <TextInput
                  value={dailyProtein}
                  onChangeText={setDailyProtein}
                  placeholder="150"
                  placeholderTextColor="#687076"
                  keyboardType="number-pad"
                  className="text-base text-foreground p-3 rounded-lg bg-surface border border-border"
                />
              </GlassCard>

              <GlassCard className="flex-1 gap-2">
                <Text className="text-xs font-semibold text-muted">CARBS (g)</Text>
                <TextInput
                  value={dailyCarbs}
                  onChangeText={setDailyCarbs}
                  placeholder="200"
                  placeholderTextColor="#687076"
                  keyboardType="number-pad"
                  className="text-base text-foreground p-3 rounded-lg bg-surface border border-border"
                />
              </GlassCard>

              <GlassCard className="flex-1 gap-2">
                <Text className="text-xs font-semibold text-muted">FAT (g)</Text>
                <TextInput
                  value={dailyFat}
                  onChangeText={setDailyFat}
                  placeholder="65"
                  placeholderTextColor="#687076"
                  keyboardType="number-pad"
                  className="text-base text-foreground p-3 rounded-lg bg-surface border border-border"
                />
              </GlassCard>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="gap-3">
            <Button
              variant="primary"
              size="lg"
              onPress={handleSave}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onPress={() => router.back()}
              disabled={isSaving}
            >
              Cancel
            </Button>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
