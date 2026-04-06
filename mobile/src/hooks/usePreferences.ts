import { MMKV } from 'react-native-mmkv';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const storage = new MMKV();

const mmkvStorage = {
  getItem: (key: string) => storage.getString(key) ?? null,
  setItem: (key: string, value: string) => storage.set(key, value),
  removeItem: (key: string) => storage.delete(key),
};

export type Tab = 'index' | 'notes';
export type ColorSchemeType = 'light' | 'dark';

type PreferencesState = {
  hasCompletedOnboarding: boolean;
  completeOnboarding: () => void;

  themeId: number;
  setThemeId: (id: number) => void;

  iconId: number;
  setIconId: (id: number) => void;

  colorScheme: ColorSchemeType;
  setColorScheme: (scheme: ColorSchemeType) => void;
  toggleColorScheme: () => void;

  primaryTab: Tab;
  setPrimaryTab: (tab: Tab) => void;

  hapticsEnabled: boolean;
  toggleHaptics: (enabled: boolean) => void;
};

export const usePreferences = create<PreferencesState>()(
  persist(
    (set, get) => ({
      hasCompletedOnboarding: false,
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),

      themeId: 0,
      setThemeId: id => set({ themeId: id }),

      iconId: 0,
      setIconId: id => set({ iconId: id }),

      colorScheme: 'light',
      setColorScheme: scheme => set({ colorScheme: scheme }),
      toggleColorScheme: () =>
        set(state => ({ colorScheme: state.colorScheme === 'light' ? 'dark' : 'light' })),

      primaryTab: 'index',
      setPrimaryTab: tab => set({ primaryTab: tab }),

      hapticsEnabled: true,
      toggleHaptics: enabled => set({ hapticsEnabled: enabled }),
    }),
    {
      name: 'preferences',
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
