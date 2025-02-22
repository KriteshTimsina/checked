import { triggerHaptics } from '@/utils/haptics-base';
import { storage } from '@/utils/mmkv';
import { create } from 'zustand';

export type Tab = 'index' | 'notes';

interface PreferenceProps {
  primaryTab: Tab;
  hapticsEnabled: boolean;
}

interface PreferenceStoreProps {
  preferences: PreferenceProps;
  setPrimaryTab: (tab: Tab) => void;
  toggleHaptics: (enabled: boolean) => void;
}

const getPrimaryTab = (): PreferenceProps => {
  const storedTab = storage.getString('preferences.primaryTab');
  const hapticsEnabled = storage.getBoolean('preferences.hapticsEnabled');
  return {
    primaryTab: (storedTab ?? 'index') as Tab,
    hapticsEnabled: hapticsEnabled ?? true,
  };
};

export const usePreferencesStore = create<PreferenceStoreProps>()(set => ({
  preferences: getPrimaryTab(),
  setPrimaryTab: tab => {
    storage.set('preferences.primaryTab', tab);
    set(({ preferences }) => ({
      preferences: {
        ...preferences,
        primaryTab: tab,
      },
    }));
  },
  toggleHaptics: enabled => {
    if (enabled) triggerHaptics.success();
    storage.set('preferences.hapticsEnabled', enabled);
    set(({ preferences }) => ({
      preferences: {
        ...preferences,
        hapticsEnabled: enabled,
      },
    }));
  },
}));

export const usePreferences = () => {
  const primaryTab = usePreferencesStore(state => state.preferences.primaryTab);
  const hapticsEnabled = usePreferencesStore(state => state.preferences.hapticsEnabled);
  const setPrimaryTab = usePreferencesStore(state => state.setPrimaryTab);
  const toggleHaptics = usePreferencesStore(state => state.toggleHaptics);

  return {
    primaryTab,
    setPrimaryTab,
    hapticsEnabled,
    toggleHaptics,
  };
};
