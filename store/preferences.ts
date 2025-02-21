import { create } from 'zustand';

interface PreferenceState {
  activeTab: string;
  switchTab: (tab: string) => void;
}

export const usePreferences = create<PreferenceState>()(set => ({
  activeTab: 'checklist',
  switchTab: (tab: string) => {
    // storage.set('pref.tab', tab);
  },
}));
