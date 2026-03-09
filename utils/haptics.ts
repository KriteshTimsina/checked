import { triggerHaptics } from '@/utils/haptics-base';
import { usePreferences, storage } from '@/hooks/usePreferences';

export const haptics = {
  success: () => {
    if (storage.getString('preferences.hapticsEnabled') === 'true') {
      return triggerHaptics.success();
    }
  },
  error: () => {
    if (storage.getString('preferences.hapticsEnabled') === 'true') {
      return triggerHaptics.error();
    }
  },
};
