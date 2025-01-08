import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { View, Text } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@/components/Header";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    ClashGroteskBold: require("../assets/fonts/ClashGrotesk-Bold.otf"),
    ClashGroteskSemi: require("../assets/fonts/ClashGrotesk-Semibold.otf"),
    ClashGroteskMedium: require("../assets/fonts/ClashGrotesk-Medium.otf"),
    ClashGroteskRegular: require("../assets/fonts/ClashGrotesk-Regular.otf"),
    ClashGroteskLight: require("../assets/fonts/ClashGrotesk-Light.otf"),
    ClashGroteskExtralight: require("../assets/fonts/ClashGrotesk-Extralight.otf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
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
              header: () => (
                <Header
                  headerStyle={{
                    height: 100,
                  }}
                  textStyle={{ textAlign: "center" }}
                />
              ),
            }}
            name="project"
          />
        </Stack>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
