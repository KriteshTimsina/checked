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
import { StackScreenDefaultOptions } from '@/constants/layout';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import GearIcon from '@/components/GearIcon';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { success: dbSuccess } = useDatabaseInit();
  const fontsLoaded = useFontLoading();
  const colorScheme = useColorScheme();

  const appTheme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;

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
        <GestureHandlerRootView style={{ flex: 1 }}>
          <AppThemeProvider>
            <ThemeProvider value={appTheme}>
              <StatusBar style="auto" />

              <Stack
                screenOptions={{
                  ...StackScreenDefaultOptions,
                  headerShown: false,
                }}
              >
                <Stack.Screen options={{ headerShown: false }} name="(tabs)" />
                <Stack.Screen name="(checklist)" />
                <Stack.Screen name="(notes)" />
                {/* <Stack.Screen
                  name="index"
                  options={{
                    headerTitle: 'Hello 👋',
                    headerRight: () => <GearIcon />,
                  }}
                />
                <Stack.Screen
                  name="entries"
                  options={({ route }: any) => ({
                    headerTitleAlign: 'center',
                    headerTitle: route.params && route.params.title,
                  })}
                />
                <Stack.Screen
                  name="settings"
                  options={{
                    title: 'Settings',
                  }}
                />
                <Stack.Screen
                  name="success"
                  options={{
                    headerShown: false,
                  }}
                /> */}
              </Stack>
            </ThemeProvider>
          </AppThemeProvider>
        </GestureHandlerRootView>
      </SQLiteProvider>
    </Suspense>
  );
}
