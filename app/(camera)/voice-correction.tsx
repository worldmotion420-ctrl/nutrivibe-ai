import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Audio } from 'expo-av';
import { ScreenContainer } from '@/components/screen-container';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { useFoodDetectionStore } from '@/lib/stores/food-detection-store';
import { useMealStore } from '@/lib/stores/meal-store';
import { useAuthStore } from '@/lib/stores/auth-store';
import { hapticFeedback } from '@/lib/utils/haptics';
import { groqAI } from '@/lib/services/groq-ai';

interface CorrectedMeal {
  foods: any[];
  totalCalories: number;
  protein: number;
  carbs: number;
  fat: number;
  explanation: string;
}

export default function VoiceCorrectionScreen() {
  const router = useRouter();
  const { detectionResult } = useFoodDetectionStore();
  const { addMeal } = useMealStore();
  const { user } = useAuthStore();

  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [correctedMeal, setCorrectedMeal] = useState<CorrectedMeal | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initialize audio
  useEffect(() => {
    const initAudio = async () => {
      try {
        await Audio.requestPermissionsAsync();
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
      } catch (error) {
        console.error('Failed to initialize audio:', error);
      }
    };

    initAudio();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = async () => {
    try {
      await hapticFeedback.impact();
      setIsRecording(true);
      setRecordingTime(0);
      setTranscript('');

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      await recording.startAsync();
      recordingRef.current = recording;

      // Auto-stop after 30 seconds
      timerRef.current = setInterval(() => {
        setRecordingTime((t) => {
          if (t >= 30) {
            stopRecording();
            return 30;
          }
          return t + 1;
        });
      }, 1000);
    } catch (error) {
      console.error('Failed to start recording:', error);
      Alert.alert('Error', 'Failed to start recording');
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    try {
      if (!recordingRef.current) return;

      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);

      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      recordingRef.current = null;

      if (!uri) {
        Alert.alert('Error', 'Failed to get recording');
        return;
      }

      // Process audio with Whisper
      await processAudioWithWhisper(uri);
    } catch (error) {
      console.error('Failed to stop recording:', error);
      Alert.alert('Error', 'Failed to stop recording');
    }
  };

  const processAudioWithWhisper = async (audioUri: string) => {
    try {
      setIsProcessing(true);
      await hapticFeedback.impact();

      // Read audio file as base64
      const response = await fetch(audioUri);
      const blob = await response.blob();
      const reader = new FileReader();

      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(',')[1];

        // Call Whisper API via Groq (Groq supports Whisper models)
        try {
          // For now, we'll use a simple fetch to OpenAI Whisper or Groq's speech endpoint
          // This is a placeholder - in production, use proper Whisper integration
          const transcriptText = await transcribeAudio(base64Audio);
          setTranscript(transcriptText);

          // Correct meal with Groq
          if (transcriptText && detectionResult?.foods) {
            await correctMealWithGroq(transcriptText, detectionResult.foods);
          }
        } catch (error) {
          console.error('Whisper processing error:', error);
          Alert.alert('Error', 'Failed to process audio. Please try again.');
        }
      };

      reader.readAsDataURL(blob);
    } catch (error) {
      console.error('Audio processing error:', error);
      Alert.alert('Error', 'Failed to process audio');
    } finally {
      setIsProcessing(false);
    }
  };

  const transcribeAudio = async (base64Audio: string): Promise<string> => {
    // Placeholder for Whisper API call
    // In production, integrate with OpenAI Whisper or Groq's speech endpoint
    // For now, return a mock transcript
    return 'Add more oil, less salt, and extra protein';
  };

  const correctMealWithGroq = async (userCorrection: string, foods: any[]) => {
    try {
      // Call Groq to correct the meal based on user input
      const correctedData = await groqAI.correctMeal(foods, userCorrection);

      if (correctedData) {
        setCorrectedMeal({
          foods: correctedData.correctedFoods || foods,
          totalCalories: correctedData.correctedFoods?.reduce(
            (sum: number, f: any) => sum + (f.calories || 0),
            0
          ) || 0,
          protein: correctedData.correctedFoods?.reduce(
            (sum: number, f: any) => sum + (f.protein || 0),
            0
          ) || 0,
          carbs: correctedData.correctedFoods?.reduce(
            (sum: number, f: any) => sum + (f.carbs || 0),
            0
          ) || 0,
          fat: correctedData.correctedFoods?.reduce(
            (sum: number, f: any) => sum + (f.fat || 0),
            0
          ) || 0,
          explanation: correctedData.explanation || 'Meal corrected based on your feedback',
        });
      }
    } catch (error) {
      console.error('Groq correction error:', error);
      // Use original data if correction fails
      setCorrectedMeal({
        foods,
        totalCalories: foods.reduce((sum, f) => sum + (f.calories || 0), 0),
        protein: foods.reduce((sum, f) => sum + (f.protein || 0), 0),
        carbs: foods.reduce((sum, f) => sum + (f.carbs || 0), 0),
        fat: foods.reduce((sum, f) => sum + (f.fat || 0), 0),
        explanation: 'Using original detection (correction unavailable)',
      });
    }
  };

  const handleApplyChanges = async () => {
    if (!user?.id || !detectionResult?.foods) {
      Alert.alert('Error', 'Missing user or meal data');
      return;
    }

    try {
      await hapticFeedback.heavy();

      const mealData = {
        user_id: user.id,
        meal_name: (correctedMeal?.foods || detectionResult.foods)
          .map((f: any) => f.name)
          .join(', '),
        meal_type: 'breakfast' as const,
        logged_at: new Date().toISOString(),
        total_calories: correctedMeal?.totalCalories || 0,
        protein_g: correctedMeal?.protein || 0,
        carbs_g: correctedMeal?.carbs || 0,
        fat_g: correctedMeal?.fat || 0,
        fiber_g: 0,
        water_ml: 0,
        ai_detected: true,
        voice_corrected: !!transcript,
        correction_transcript: transcript,
        ingredients: (correctedMeal?.foods || detectionResult.foods).map(
          (f: any, idx: number) => ({
            id: `${Date.now()}-${idx}`,
            ingredient_name: f.name,
            portion_size: f.servingSize || '1 serving',
            portion_grams: 100,
            calories: f.calories || 0,
            protein_g: f.protein || 0,
            carbs_g: f.carbs || 0,
            fat_g: f.fat || 0,
            fiber_g: f.fiber || 0,
            ai_detected: true,
            confidence_score: f.confidence || 0.8,
          })
        ),
      };

      await addMeal(mealData);
      await hapticFeedback.success();

      Alert.alert('Success', 'Meal logged with voice correction!', [
        {
          text: 'OK',
          onPress: () => {
            router.replace('/(tabs)' as any);
          },
        },
      ]);
    } catch (error: any) {
      console.error('Meal logging error:', error);
      await hapticFeedback.error();
      Alert.alert('Error', error.message || 'Failed to log meal');
    }
  };

  const handleSkipCorrection = () => {
    Alert.alert('Skip Voice Correction', 'Log meal without voice correction?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Skip',
        onPress: () => router.back(),
      },
    ]);
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-2xl font-bold text-foreground">
              {isRecording ? 'Listening...' : 'Voice Correction'}
            </Text>
            <Text className="text-sm text-muted">
              {isRecording
                ? `Recording... ${recordingTime}s`
                : 'Describe any changes to the meal'}
            </Text>
          </View>

          {/* Waveform Visualization */}
          <GlassCard className="items-center py-12">
            {isRecording ? (
              <View className="flex-row items-center justify-center gap-1 h-16">
                {[...Array(8)].map((_, i) => (
                  <View
                    key={i}
                    className="w-1 bg-primary rounded-full animate-pulse"
                    style={{
                      height: `${Math.random() * 60 + 20}%`,
                    }}
                  />
                ))}
              </View>
            ) : (
              <View className="items-center gap-4">
                <Pressable
                  onPress={isRecording ? stopRecording : startRecording}
                  disabled={isProcessing}
                  style={({ pressed }) => [
                    pressed && { transform: [{ scale: 0.95 }] },
                  ]}
                >
                  <View
                    className={`w-20 h-20 rounded-full items-center justify-center ${
                      isProcessing ? 'bg-primary/50' : 'bg-primary'
                    }`}
                  >
                    {isProcessing ? (
                      <ActivityIndicator size="large" color="#000" />
                    ) : (
                      <Text className="text-3xl">🎤</Text>
                    )}
                  </View>
                </Pressable>
                <Text className="text-sm text-muted">
                  {isProcessing ? 'Processing...' : 'Tap to record'}
                </Text>
              </View>
            )}
          </GlassCard>

          {/* Transcript */}
          {transcript && (
            <GlassCard className="gap-2">
              <Text className="text-xs font-semibold text-muted">YOUR CORRECTION</Text>
              <Text className="text-base text-foreground">{transcript}</Text>
            </GlassCard>
          )}

          {/* Corrected Meal Info */}
          {correctedMeal && (
            <GlassCard className="gap-2 border-l-4 border-l-primary">
              <View className="flex-row items-center gap-2">
                <Text className="text-lg">✓</Text>
                <Text className="text-sm font-semibold text-foreground">
                  Meal Corrected
                </Text>
              </View>
              <Text className="text-sm text-muted">{correctedMeal.explanation}</Text>
            </GlassCard>
          )}

          {/* Updated Nutrition */}
          {correctedMeal && (
            <GlassCard className="gap-3">
              <Text className="text-sm font-semibold text-foreground">
                Updated Nutrition
              </Text>
              <View className="gap-2">
                <View className="flex-row justify-between">
                  <Text className="text-sm text-muted">Calories</Text>
                  <Text className="text-sm font-semibold text-primary">
                    {Math.round(correctedMeal.totalCalories)} kcal
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-sm text-muted">Protein</Text>
                  <Text className="text-sm font-semibold text-primary">
                    {Math.round(correctedMeal.protein)}g
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-sm text-muted">Carbs</Text>
                  <Text className="text-sm font-semibold text-primary">
                    {Math.round(correctedMeal.carbs)}g
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-sm text-muted">Fat</Text>
                  <Text className="text-sm font-semibold text-primary">
                    {Math.round(correctedMeal.fat)}g
                  </Text>
                </View>
              </View>
            </GlassCard>
          )}

          {/* Action Buttons */}
          <View className="gap-3">
            {correctedMeal || transcript ? (
              <>
                <Button
                  variant="primary"
                  size="lg"
                  onPress={handleApplyChanges}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Apply Changes'}
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onPress={handleSkipCorrection}
                >
                  Skip & Log Anyway
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="primary"
                  size="lg"
                  onPress={startRecording}
                  disabled={isRecording || isProcessing}
                >
                  {isRecording ? 'Recording...' : 'Start Recording'}
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onPress={handleSkipCorrection}
                >
                  Skip Voice Correction
                </Button>
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
