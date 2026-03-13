import { useEffect } from 'react';
import { setAppIcon } from '@howincodes/expo-dynamic-app-icon';
import { APP_THEMES } from '@/constants/themes';

export function useAppIcon(iconId: number) {
  useEffect(() => {
    const theme = APP_THEMES.find(t => t.id === iconId);
    if (!theme) return;
    setAppIcon(theme.iconKey);
  }, [iconId]);
}
