import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Suspense, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SQLiteProvider } from 'expo-sqlite';

import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Header } from '@/components/Header';

import { useFontLoading } from '@/hooks/useFontLoading';
import { useDatabaseInit } from '@/hooks/useDatabaseInit';
import { DATABASE_NAME } from '@/constants/constants';
import { Loading } from '@/components/Loading';

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
        <ThemeProvider value={appTheme}>
          <StatusBar style="auto" backgroundColor={Colors.primary} />
          <Stack>
            <Stack.Screen
              options={{
                title: 'Hello 👋',
                headerTitleStyle: {
                  fontFamily: 'ClashGroteskMedium',
                  fontWeight: '700',
                },
              }}
              name="index"
            />
            <Stack.Screen name="project" />
          </Stack>
        </ThemeProvider>
      </SQLiteProvider>
    </Suspense>
  );
}
