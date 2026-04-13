import React, { memo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { AppTheme } from '@/constants/themes';
import { OnboardingStepProps } from '@/constants/onboardingSteps';
import WelcomeIllustration from './WelcomeIllustration';
import NotesIllustration from './NotesIllustration';
import ThemeSelector from './ThemeSelector';

const { width: WIDTH } = Dimensions.get('window');

type Props = {
  step: OnboardingStepProps;
  index: number;
  selectedThemeId?: number;
  onThemeSelect?: (theme: AppTheme) => void;
};

const ILLUSTRATIONS: Record<number, (color: string) => React.ReactNode> = {
  0: color => <WelcomeIllustration color={color} />,
  1: color => <NotesIllustration color={color} />,
};

const OnboardingSlide = memo(({ step, index, selectedThemeId = 0, onThemeSelect }: Props) => {
  const isThemeStep = index === 2;

  return (
    <View style={[styles.slide, { backgroundColor: step.bg }]}>
      <View
        style={[
          styles.pill,
          { backgroundColor: step.color + '18', borderColor: step.color + '30' },
        ]}
      >
        <Text style={styles.pillEmoji}>{step.emoji}</Text>
        <Text style={[styles.pillText, { color: step.color }]}>{step.tag.toUpperCase()}</Text>
      </View>

      <Text style={styles.title}>
        {step.title}
        {'\n'}
        <Text style={{ color: step.color }}>{step.titleAccent}</Text>
      </Text>

      <Text style={styles.subtitle}>{step.subtitle}</Text>

      <View style={[styles.illustrationArea, isThemeStep && styles.illustrationAreaTheme]}>
        {isThemeStep ? (
          <ThemeSelector
            selectedThemeId={selectedThemeId}
            onSelect={onThemeSelect ?? (() => {})}
            accentColor={step.color}
          />
        ) : (
          ILLUSTRATIONS[index]?.(step.color)
        )}
      </View>
    </View>
  );
});

OnboardingSlide.displayName = 'OnboardingSlide';

export default OnboardingSlide;

const styles = StyleSheet.create({
  slide: {
    width: WIDTH,
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 16,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 100,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingVertical: 5,
    gap: 6,
    marginBottom: 16,
  },
  pillEmoji: {
    fontSize: 13,
  },
  pillText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    lineHeight: 42,
    color: '#1A1A1A',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: '#888',
    lineHeight: 24,
    fontWeight: '600',
    marginBottom: 24,
  },
  illustrationArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustrationAreaTheme: {
    justifyContent: 'flex-start',
  },
});
