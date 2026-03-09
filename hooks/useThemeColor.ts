import { getColors } from '@/constants/Colors';
import { usePreferences } from '@/hooks/usePreferences';
import { useMemo } from 'react';

/**
 * Drop-in replacement for Expo's useThemeColor.
 * Reads themeId + colorScheme from MMKV store so ThemedView/ThemedText
 * automatically react to theme and dark/light changes.
 *
 * Usage (same as before):
 *   const bg = useThemeColor({ light: '#fff', dark: '#000' }, 'background');
 */
export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof ReturnType<typeof getColors>,
) {
  const themeId = usePreferences(s => s.themeId);
  const colorScheme = usePreferences(s => s.colorScheme);

  return useMemo(() => {
    // If caller passes an explicit override for this color scheme, use it
    const colorFromProps = props[colorScheme];
    if (colorFromProps) return colorFromProps;

    // Otherwise pull from the computed theme palette
    const colors = getColors(themeId, colorScheme);
    return colors[colorName] as string;
  }, [themeId, colorScheme, props.light, props.dark, colorName]);
}
