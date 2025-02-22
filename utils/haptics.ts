import { usePreferencesStore } from '@/store/preferences';
import { triggerHaptics } from '@/utils/haptics-base';

export const haptics = {
  success: () => {
    if (usePreferencesStore.getState().preferences.hapticsEnabled) {
      return triggerHaptics.success();
    }
  },
  error: () => {
    if (usePreferencesStore.getState().preferences.hapticsEnabled) {
      return triggerHaptics.error();
    }
  },
};
