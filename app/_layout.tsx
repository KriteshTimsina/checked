import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Suspense, useEffect } from 'react';
import { SQLiteProvider } from 'expo-sqlite';

import { useFontLoading } from '@/hooks/useFontLoading';
import { useDatabaseInit } from '@/hooks/useDatabaseInit';
import { DATABASE_NAME } from '@/constants/constants';
import { Loading } from '@/components/Loading';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { globals } from '@/styles/globals';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// ✅ Now reads from MMKV store, not system
import { useColorScheme } from '@/hooks/useColorScheme';
import { getColors } from '@/constants/colors';
import { usePreferences } from '@/hooks/usePreferences';

SplashScreen.preventAutoHideAsync();

function AppNavigator() {
  const colorScheme = useColorScheme();
  const themeId = usePreferences(s => s.themeId);
  const colors = getColors(themeId, colorScheme);

  // React Navigation theme — background syncs with user's preference
  const appTheme =
    colorScheme === 'dark'
      ? { ...DarkTheme, colors: { ...DarkTheme.colors, background: colors.background } }
      : { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: colors.background } };

  return (
    <ThemeProvider value={appTheme}>
      {/* StatusBar style flips automatically with colorScheme */}
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(checklist)" />
        <Stack.Screen name="(notes)" />
        <Stack.Screen
          name="settings"
          options={{
            headerBackVisible: true,
            headerShown: true,
            headerTitle: 'Settings',
          }}
        />
        <Stack.Screen name="onboarding" />
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const { success: dbSuccess } = useDatabaseInit();
  const fontsLoaded = useFontLoading();

  useEffect(() => {
    if (fontsLoaded && dbSuccess) {
      SplashScreen.hideAsync();
    }
  }, [dbSuccess, fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <Suspense fallback={<Loading />}>
      <SQLiteProvider databaseName={DATABASE_NAME} useSuspense>
        <SafeAreaProvider style={globals.flex}>
          <GestureHandlerRootView style={globals.flex}>
            {/*
              AppNavigator is separate so useColorScheme/usePreferences hooks
              work inside a proper component body (not the root layout function)
            */}
            <AppNavigator />
          </GestureHandlerRootView>
        </SafeAreaProvider>
      </SQLiteProvider>
    </Suspense>
  );
}
