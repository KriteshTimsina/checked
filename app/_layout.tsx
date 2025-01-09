import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { Suspense, useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Header } from '@/components/Header';
import { ActivityIndicator } from 'react-native';
import { openDatabaseAsync, openDatabaseSync, SQLiteProvider } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '@/drizzle/migrations';

const DATABASE_NAME = 'checklists';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const expoDb = openDatabaseSync(DATABASE_NAME);
  const db = drizzle(expoDb);
  const { success, error } = useMigrations(db, migrations);
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    ClashGroteskBold: require('../assets/fonts/ClashGrotesk-Bold.otf'),
    ClashGroteskSemi: require('../assets/fonts/ClashGrotesk-Semibold.otf'),
    ClashGroteskMedium: require('../assets/fonts/ClashGrotesk-Medium.otf'),
    ClashGroteskRegular: require('../assets/fonts/ClashGrotesk-Regular.otf'),
    ClashGroteskLight: require('../assets/fonts/ClashGrotesk-Light.otf'),
    ClashGroteskExtralight: require('../assets/fonts/ClashGrotesk-Extralight.otf'),
  });

  useEffect(() => {
    if (loaded && success) {
      SplashScreen.hideAsync();
    }
  }, [loaded, success]);

  if (!loaded) {
    return null;
  }

  return (
    <Suspense fallback={<ActivityIndicator />}>
      <SQLiteProvider
        databaseName={DATABASE_NAME}
        options={{ enableChangeListener: true }}
        useSuspense
      >
        <SafeAreaProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <StatusBar style="auto" backgroundColor={Colors.primary} />
            <Stack>
              <Stack.Screen
                options={{
                  headerShown: true,
                  header: () => <Header />,
                }}
                name="index"
              />
              <Stack.Screen
                options={{
                  headerShown: true,
                }}
                name="project"
              />
            </Stack>
          </ThemeProvider>
        </SafeAreaProvider>
      </SQLiteProvider>
    </Suspense>
  );
}
