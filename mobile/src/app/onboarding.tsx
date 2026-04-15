import React, { useRef, useState, useCallback } from 'react';
import { FlatList, StyleSheet, Dimensions, ViewToken } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { ThemedView } from '@/components/layout';
import { usePreferences } from '@/hooks/usePreferences';
import { OnboardingSlide, OnboardingFooter, onboardingSteps } from '@/components/onboarding';
import { AppTheme } from '@/constants/themes';

const { width: WIDTH } = Dimensions.get('window');

export default function Onboarding() {
  const { top, bottom } = useSafeAreaInsets();
  const { completeOnboarding, setThemeId } = usePreferences();

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedThemeId, setSelectedThemeId] = useState(0);

  const flatListRef = useRef<FlatList>(null);

  // Keep dots in sync when user swipes manually
  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index !== null) {
      setCurrentStep(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const goTo = useCallback((index: number) => {
    flatListRef.current?.scrollToIndex({ index, animated: true });
    setCurrentStep(index);
  }, []);

  const handleThemeSelect = useCallback((theme: AppTheme) => {
    setSelectedThemeId(theme.id);
  }, []);

  const handleCta = useCallback(() => {
    if (currentStep < onboardingSteps.length - 1) {
      goTo(currentStep + 1);
    } else {
      setThemeId(selectedThemeId); // ✅ persists to MMKV, useTheme() picks it up everywhere
      completeOnboarding();
      router.replace('/(tabs)');
    }
  }, [currentStep, goTo, selectedThemeId, setThemeId, completeOnboarding]);

  return (
    <ThemedView style={[styles.root, { paddingTop: top }]}>
      <FlatList
        ref={flatListRef}
        data={onboardingSteps}
        keyExtractor={item => String(item.id)}
        renderItem={({ item, index }) => (
          <OnboardingSlide
            step={item}
            index={index}
            selectedThemeId={selectedThemeId}
            onThemeSelect={handleThemeSelect}
          />
        )}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(_, index) => ({
          length: WIDTH,
          offset: WIDTH * index,
          index,
        })}
        style={styles.flatList}
      />

      <OnboardingFooter
        steps={onboardingSteps}
        currentStep={currentStep}
        onDotPress={goTo}
        onCta={handleCta}
        bottomInset={bottom}
        onboardingStepBackground={onboardingSteps[currentStep].bg}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  flatList: {
    flex: 1,
  },
});
