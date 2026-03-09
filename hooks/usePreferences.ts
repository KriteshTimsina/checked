import { MMKV } from 'react-native-mmkv';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const storage = new MMKV();

// Zustand MMKV storage adapter
const mmkvStorage = {
  getItem: (key: string) => storage.getString(key) ?? null,
  setItem: (key: string, value: string) => storage.set(key, value),
  removeItem: (key: string) => storage.delete(key),
};

export type Tab = 'index' | 'notes';
export type ColorSchemeType = 'light' | 'dark';

type PreferencesState = {
  // Onboarding
  hasCompletedOnboarding: boolean;
  completeOnboarding: () => void;

  // Theme
  themeId: number;
  setThemeId: (id: number) => void;

  // Color scheme
  colorScheme: ColorSchemeType;
  setColorScheme: (scheme: ColorSchemeType) => void;
  toggleColorScheme: () => void;

  // Primary tab
  primaryTab: Tab;
  setPrimaryTab: (tab: Tab) => void;

  // Haptics
  hapticsEnabled: boolean;
  toggleHaptics: (enabled: boolean) => void;
};

export const usePreferences = create<PreferencesState>()(
  persist(
    (set, get) => ({
      // Onboarding
      hasCompletedOnboarding: false,
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),

      // Theme
      themeId: 0, // default: Sandy
      setThemeId: id => set({ themeId: id }),

      // Color scheme
      colorScheme: 'light',
      setColorScheme: scheme => set({ colorScheme: scheme }),
      toggleColorScheme: () =>
        set(state => ({ colorScheme: state.colorScheme === 'light' ? 'dark' : 'light' })),

      // Primary tab
      primaryTab: 'index',
      setPrimaryTab: tab => set({ primaryTab: tab }),

      // Haptics
      hapticsEnabled: true,
      toggleHaptics: enabled => set({ hapticsEnabled: enabled }),
    }),
    {
      name: 'preferences',
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
