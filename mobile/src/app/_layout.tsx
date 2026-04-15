import 'react-native-reanimated';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Suspense } from 'react';
import { SQLiteProvider } from 'expo-sqlite';

import { DATABASE_NAME } from '@/constants/constants';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { globals } from '@/styles/globals';

import { useColorScheme } from '@/hooks/useColorScheme';
import { getColors } from '@/constants/colors';
import { usePreferences } from '@/hooks/usePreferences';
import { ChecklistMenu } from '@/components/todos';
import Toast from 'react-native-toast-message';
import { toastConfig } from '@/utils/toastConfig';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useInAppUpdates } from '@/hooks/useInAppUpdate';
import AppBootstrap from '@/providers/AppBootstrap';
import { Loading } from '@/components/ui';

type ChecklistParamList = {
  index: { title?: string };
  success: undefined;
};

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
          name="(todos)"
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
          options={{
            headerShown: false,
            headerStyle: { backgroundColor: appTheme.colors.card },
            headerTitle: '',
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            headerShown: true,
            headerTitle: '',
          }}
        />
        <Stack.Screen name="onboarding" />
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  useInAppUpdates();

  return (
    <Suspense fallback={<Loading />}>
      <SQLiteProvider databaseName={DATABASE_NAME} useSuspense>
        <AppBootstrap>
          <SafeAreaProvider style={globals.flex}>
            <GestureHandlerRootView style={globals.flex}>
              <BottomSheetModalProvider>
                <AppNavigator />
              </BottomSheetModalProvider>
            </GestureHandlerRootView>
          </SafeAreaProvider>
        </AppBootstrap>
      </SQLiteProvider>

      <Toast bottomOffset={20} topOffset={60} config={toastConfig} />
    </Suspense>
  );
}
