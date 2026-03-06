import { StyleSheet, Text, Button } from 'react-native';
import React from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePreferences } from '@/store/preferences';
import { useRouter } from 'expo-router';

const Onboarding = () => {
  const { completeOnboarding } = usePreferences();
  const router = useRouter();

  const onOnboardingComplete = () => {
    completeOnboarding();
    router.replace('/');
  };
  return (
    <ThemedView style={{ flex: 1, padding: 20 }}>
      <ThemedText>Onboarding</ThemedText>
      <Button title="Get Started" onPress={onOnboardingComplete} />
    </ThemedView>
  );
};

export default Onboarding;

const styles = StyleSheet.create({});
