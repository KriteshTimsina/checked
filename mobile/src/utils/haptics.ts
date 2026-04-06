import { triggerHaptics } from '@/utils/haptics-base';
import { usePreferences } from '@/hooks/usePreferences';

const isHapticsEnabled = () => usePreferences.getState().hapticsEnabled;

export const haptics = {
  success: () => {
    if (!isHapticsEnabled()) return;
    triggerHaptics.notification('success');
  },

  error: () => {
    if (!isHapticsEnabled()) return;
    triggerHaptics.notification('error');
  },

  warning: () => {
    if (!isHapticsEnabled()) return;
    triggerHaptics.notification('warning');
  },

  light: () => {
    if (!isHapticsEnabled()) return;
    triggerHaptics.impact('light');
  },

  medium: () => {
    if (!isHapticsEnabled()) return;
    triggerHaptics.impact('medium');
  },

  heavy: () => {
    if (!isHapticsEnabled()) return;
    triggerHaptics.impact('heavy');
  },

  rigid: () => {
    if (!isHapticsEnabled()) return;
    triggerHaptics.impact('rigid');
  },

  soft: () => {
    if (!isHapticsEnabled()) return;
    triggerHaptics.impact('soft');
  },
};
