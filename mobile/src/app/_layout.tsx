import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Suspense, useEffect, useState } from 'react';
import { SQLiteProvider } from 'expo-sqlite';

import { useFontLoading } from '@/hooks/useFontLoading';
import { useDatabaseInit } from '@/hooks/useDatabaseInit';
import { DATABASE_NAME } from '@/constants/constants';
import { Loading } from '@/components/Loading';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { globals } from '@/styles/globals';

import { useColorScheme } from '@/hooks/useColorScheme';
import { getColors } from '@/constants/colors';
import { usePreferences } from '@/hooks/usePreferences';
import { NoteMenu } from '@/components/ui/NotesMenu';
import { ChecklistMenu } from '@/components/ui/ChecklistMenu';
import { APP_THEMES } from '@/constants/themes';
import { setAppIcon } from '@howincodes/expo-dynamic-app-icon';
import Splash from '@/components/Splash';
import Toast from 'react-native-toast-message';
import { toastConfig } from '@/utils/toastConfig';

type NoteParams = {
  index: { noteId?: number };
};
type ChecklistParamList = {
  index: { title?: string };
  success: undefined;
};

SplashScreen.preventAutoHideAsync();

function AppNavigator() {
  const colorScheme = useColorScheme();
  const themeId = usePreferences(s => s.themeId);
  const colors = getColors(themeId, colorScheme);

  const appTheme =
    colorScheme === 'dark'
      ? { ...DarkTheme, colors: { ...DarkTheme.colors, background: colors.background } }
      : { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: colors.background } };

  return (
    <ThemeProvider value={appTheme}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="(checklist)"
          options={({ route }) => {
            const title = (route.params as ChecklistParamList['index'])?.title;

            return {
              headerShown: true,
              headerTitle: (route.params as ChecklistParamList['index'])?.title ?? 'Checklist',
              headerRight: () => title && <ChecklistMenu title={title} />,
            };
          }}
        />
        <Stack.Screen
          name="(notes)"
          options={({ route }) => {
            const noteId = (route.params as NoteParams['index'])?.noteId;
            return {
              headerShown: true,
              headerTitle: '',
              headerRight: () => noteId && <NoteMenu noteId={noteId} />,
              headerStyle: { backgroundColor: appTheme.colors.card },
            };
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
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
  const { iconId } = usePreferences();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const theme = APP_THEMES.find(t => t.id === iconId);
    if (!theme) return;
    setAppIcon(theme.iconKey);
  }, []);

  useEffect(() => {
    if (fontsLoaded && dbSuccess) {
      SplashScreen.hideAsync();
      const timer = setTimeout(() => setShowSplash(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [dbSuccess, fontsLoaded]);

  if (!fontsLoaded || showSplash) return <Splash />;

  return (
    <Suspense fallback={<Loading />}>
      <SQLiteProvider databaseName={DATABASE_NAME} useSuspense>
        <SafeAreaProvider style={globals.flex}>
          <GestureHandlerRootView style={globals.flex}>
            <AppNavigator />
          </GestureHandlerRootView>
        </SafeAreaProvider>
      </SQLiteProvider>
      <Toast position="bottom" bottomOffset={20} config={toastConfig} />
    </Suspense>
  );
}
