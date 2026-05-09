import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';

export default function VoiceCorrectionScreen() {
  const router = useRouter();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState(
    'This is almond milk and sugar free syrup.'
  );

  const handleStartListening = () => {
    setIsListening(true);
    // TODO: Integrate Whisper API for speech-to-text
    setTimeout(() => {
      setIsListening(false);
    }, 3000);
  };

  const handleApplyChanges = () => {
    // TODO: Send to Groq for meal correction
    router.replace('/(tabs)');
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-2xl font-bold text-foreground">
              {isListening ? 'Listening...' : 'Voice Correction'}
            </Text>
            <Text className="text-sm text-muted">
              Describe any changes to the meal
            </Text>
          </View>

          {/* Waveform Visualization */}
          <GlassCard className="items-center py-12">
            {isListening ? (
              <View className="flex-row items-center justify-center gap-1 h-16">
                {[...Array(8)].map((_, i) => (
                  <View
                    key={i}
                    className="w-1 bg-primary rounded-full"
                    style={{
                      height: `${Math.random() * 60 + 20}%`,
                    }}
                  />
                ))}
              </View>
            ) : (
              <View className="items-center gap-4">
                <Pressable
                  onPress={handleStartListening}
                  style={({ pressed }) => [
                    pressed && { transform: [{ scale: 0.95 }] },
                  ]}
                >
                  <View className="w-20 h-20 rounded-full bg-primary items-center justify-center">
                    <Text className="text-3xl">🎤</Text>
                  </View>
                </Pressable>
                <Text className="text-sm text-muted">Tap to record</Text>
              </View>
            )}
          </GlassCard>

          {/* Transcript */}
          {transcript && (
            <GlassCard className="gap-2">
              <Text className="text-xs font-semibold text-muted">TRANSCRIPT</Text>
              <Text className="text-base text-foreground">{transcript}</Text>
            </GlassCard>
          )}

          {/* AI Update */}
          <GlassCard className="gap-2 border-l-4 border-l-primary">
            <View className="flex-row items-center gap-2">
              <Text className="text-lg">✓</Text>
              <Text className="text-sm font-semibold text-foreground">
                AI Update
              </Text>
            </View>
            <Text className="text-sm text-muted">
              Calories adjusted, ingredients updated
            </Text>
          </GlassCard>

          {/* Updated Nutrition */}
          <GlassCard className="gap-3">
            <Text className="text-sm font-semibold text-foreground">
              Updated Nutrition
            </Text>
            <View className="gap-2">
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">Calories</Text>
                <Text className="text-sm font-semibold text-primary">
                  620 kcal
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">Protein</Text>
                <Text className="text-sm font-semibold text-primary">
                  45g
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">Carbs</Text>
                <Text className="text-sm font-semibold text-primary">
                  60g
                </Text>
              </View>
            </View>
          </GlassCard>

          {/* Action Buttons */}
          <View className="gap-3">
            <Button
              variant="primary"
              size="lg"
              onPress={handleApplyChanges}
            >
              Apply Changes
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onPress={() => router.back()}
            >
              Cancel
            </Button>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
