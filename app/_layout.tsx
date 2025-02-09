import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Suspense, useEffect } from 'react';
import { SQLiteProvider } from 'expo-sqlite';

import { useColorScheme } from '@/hooks/useColorScheme';

import { useFontLoading } from '@/hooks/useFontLoading';
import { useDatabaseInit } from '@/hooks/useDatabaseInit';
import { DATABASE_NAME } from '@/constants/constants';
import { Loading } from '@/components/Loading';
import AppThemeProvider from '@/context/ThemeContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Colors } from '@/constants/Colors';
import { globals } from '@/styles/globals';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: Colors.dark.background,
  },
};
const CustomDefaultTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: Colors.light.background,
  },
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { success: dbSuccess } = useDatabaseInit();
  const fontsLoaded = useFontLoading();
  const colorScheme = useColorScheme();

  const appTheme = colorScheme === 'dark' ? CustomDarkTheme : CustomDefaultTheme;

  useEffect(() => {
    const initializeApp = async () => {
      if (fontsLoaded && dbSuccess) {
        await SplashScreen.hideAsync();
      }
    };

    initializeApp();
  }, [dbSuccess, fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Suspense fallback={<Loading />}>
      <SQLiteProvider
        databaseName={DATABASE_NAME}
        options={{ enableChangeListener: true }}
        useSuspense
      >
        <GestureHandlerRootView style={globals.flex}>
          <AppThemeProvider>
            <ThemeProvider value={appTheme}>
              <StatusBar style="auto" />

              <Stack
                screenOptions={{
                  headerShown: false,
                }}
              >
                <Stack.Screen options={{ headerShown: false }} name="(tabs)" />
                <Stack.Screen name="(checklist)" />
                <Stack.Screen name="(notes)" />
                <Stack.Screen options={{ headerBackVisible: true }} name="settings" />
              </Stack>
            </ThemeProvider>
          </AppThemeProvider>
        </GestureHandlerRootView>
      </SQLiteProvider>
    </Suspense>
  );
}
