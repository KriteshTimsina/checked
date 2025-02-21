import { storage } from '@/utils/mmkv';
import { create } from 'zustand';

export type Tab = 'index' | 'notes';

interface PreferenceProps {
  primaryTab: Tab;
}

interface PreferenceStoreProps {
  preferences: PreferenceProps;
  setPrimaryTab: (tab: Tab) => void;
}

const getPrimaryTab = (): Tab => {
  const storedTab = storage.getString('preferences.primaryTab');
  return (storedTab || 'index') as Tab;
};

export const usePreferencesStore = create<PreferenceStoreProps>()(set => ({
  preferences: {
    primaryTab: getPrimaryTab(),
  },
  setPrimaryTab: tab => {
    storage.set('preferences.primaryTab', tab);
    set({
      preferences: {
        primaryTab: tab,
      },
    });
  },
}));

export const usePreferences = () => {
  const primaryTab = usePreferencesStore(state => state.preferences.primaryTab);
  const setPrimaryTab = usePreferencesStore(state => state.setPrimaryTab);

  return {
    primaryTab,
    setPrimaryTab,
  };
};
