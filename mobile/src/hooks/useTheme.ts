import { useMemo } from 'react';
import { usePreferences } from '@/hooks/usePreferences';
import { getColors, AppColors } from '@/constants/colors';

/**
 * useTheme — single hook to get all colors for the current theme + color scheme.
 *
 * Usage:
 *   const { primary, background, text, colorScheme, theme } = useTheme();
 *
 * This re-renders only when themeId or colorScheme changes in the preferences store.
 */
export const useTheme = (): AppColors => {
  const themeId = usePreferences(s => s.themeId);
  const colorScheme = usePreferences(s => s.colorScheme);

  return useMemo(() => getColors(themeId, colorScheme), [themeId, colorScheme]);
};
