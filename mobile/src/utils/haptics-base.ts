import * as Haptics from 'expo-haptics';

export const triggerHaptics = {
  impact: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' = 'light') => {
    const map = {
      light: Haptics.ImpactFeedbackStyle.Light,
      medium: Haptics.ImpactFeedbackStyle.Medium,
      heavy: Haptics.ImpactFeedbackStyle.Heavy,
      rigid: Haptics.ImpactFeedbackStyle.Rigid,
      soft: Haptics.ImpactFeedbackStyle.Soft,
    } as const;
    Haptics.impactAsync(map[style]);
  },

  notification: (type: 'success' | 'error' | 'warning' = 'success') => {
    const map = {
      success: Haptics.NotificationFeedbackType.Success,
      error: Haptics.NotificationFeedbackType.Error,
      warning: Haptics.NotificationFeedbackType.Warning,
    } as const;
    Haptics.notificationAsync(map[type]);
  },
};
