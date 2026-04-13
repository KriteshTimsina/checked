import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { type OnboardingStepProps } from '@/components/onboarding';
import { Button } from '@/components/ui';
import { HapticButton } from '@/components/layout';

type Props = {
  steps: OnboardingStepProps[];
  currentStep: number;
  onDotPress: (index: number) => void;
  onCta: () => void;
  bottomInset: number;
  onboardingStepBackground: string;
};

const OnboardingFooter = memo(
  ({ steps, currentStep, onDotPress, onCta, bottomInset, onboardingStepBackground }: Props) => {
    const current = steps[currentStep];

    return (
      <View
        style={[
          styles.container,
          { paddingBottom: bottomInset + 16, backgroundColor: onboardingStepBackground },
        ]}
      >
        <View style={styles.dots}>
          {steps.map((_, i) => (
            <HapticButton
              key={i}
              onPress={() => onDotPress(i)}
              hitSlop={{ top: 10, bottom: 10, left: 6, right: 6 }}
            >
              <View
                style={[
                  styles.dot,
                  {
                    width: i === currentStep ? 24 : 8,
                    backgroundColor: i === currentStep ? current.color : '#E0E0E0',
                    shadowColor: current.color,
                    shadowOpacity: i === currentStep ? 0.5 : 0,
                    shadowRadius: 4,
                    elevation: i === currentStep ? 3 : 0,
                  },
                ]}
              />
            </HapticButton>
          ))}
        </View>

        <Button backgroundColor={current.color} title={current.cta} onPress={onCta} />
      </View>
    );
  },
);

OnboardingFooter.displayName = 'OnboardingFooter';

export default OnboardingFooter;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 28,
    gap: 16,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 100,
  },
  cta: {
    borderRadius: 100,
    paddingVertical: 16,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  ctaText: {
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0.3,
    color: '#fff',
  },
  signinText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#BBB',
    fontWeight: '600',
    paddingBottom: 4,
  },
});
