import { Splash } from '@/components/layout';
import { useDatabaseInit } from '@/hooks/useDatabaseInit';
import { useFontLoading } from '@/hooks/useFontLoading';
import { usePreferences } from '@/hooks/usePreferences';
import { SplashScreen } from 'expo-router';
import { useEffect, useState } from 'react';
import { Appearance } from 'react-native';

SplashScreen.preventAutoHideAsync();

export default function AppBootstrap({ children }: { children: React.ReactNode }) {
  const { success: dbSuccess } = useDatabaseInit();
  const fontsLoaded = useFontLoading();
  const { colorScheme } = usePreferences();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    Appearance.setColorScheme(colorScheme ?? 'light');
  }, [colorScheme]);

  useEffect(() => {
    if (fontsLoaded && dbSuccess) {
      SplashScreen.hideAsync();
      const timer = setTimeout(() => setShowSplash(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [fontsLoaded, dbSuccess]);

  if (!fontsLoaded || !dbSuccess || showSplash) return <Splash />;

  return <>{children}</>;
}
