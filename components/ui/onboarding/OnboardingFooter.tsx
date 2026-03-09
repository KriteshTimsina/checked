import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { OnboardingStepProps } from '@/constants/onboardingSteps';

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
    const isLast = currentStep === steps.length - 1;

    return (
      <View
        style={[
          styles.container,
          { paddingBottom: bottomInset + 16, backgroundColor: onboardingStepBackground },
        ]}
      >
        <View style={styles.dots}>
          {steps.map((_, i) => (
            <TouchableOpacity
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
            </TouchableOpacity>
          ))}
        </View>

        {/* CTA button */}
        <TouchableOpacity
          style={[styles.cta, { backgroundColor: current.color, shadowColor: current.color }]}
          onPress={onCta}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaText}>{current.cta}</Text>
        </TouchableOpacity>
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
