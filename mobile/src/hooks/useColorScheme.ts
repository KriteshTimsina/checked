import { usePreferences } from '@/hooks/usePreferences';

/**
 * Drop-in replacement for Expo's useColorScheme.
 * Reads from MMKV preferences store so it stays in sync with
 * the user's manual dark/light selection in Settings.
 *
 * Returns 'light' | 'dark' — same shape as the original hook.
 */
export function useColorScheme(): 'light' | 'dark' {
  return usePreferences(s => s.colorScheme);
}
