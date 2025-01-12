import { Appearance, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import React, { useRef, useState } from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Colors, updatePrimaryColor } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { colors } from '@/constants/data';
import { useTheme } from '@/context/ThemeContext';
import { useDb } from '@/db/useDb';
import { userPreferences } from '@/db/schema';

const settings = () => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { selectedTheme, onThemeSelect } = useTheme();
  const colorScheme = useColorScheme();
  const [darkMode, setDarkMode] = useState(colorScheme === 'dark');

  const openSheet = () => {
    bottomSheetRef.current?.expand();
  };
  const closeSheet = () => {
    bottomSheetRef.current?.close();
  };

  const toggleTheme = async (value: boolean) => {
    const newTheme = value ? 'dark' : 'light';
    setDarkMode(value);
    Appearance.setColorScheme(newTheme);
  };
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Pressable style={{ flex: 1 }} onPress={closeSheet}>
        <ThemedView style={{ flex: 1, padding: 20 }}>
          <ThemedText type="subtitle">Settings</ThemedText>

          <View style={{ marginVertical: 20, gap: 20 }}>
            <Pressable
              onPress={openSheet}
              style={[styles.settingItem, { backgroundColor: Colors[colorScheme!].shade }]}
            >
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <Ionicons name="color-palette" color={Colors.primary} size={24} />
                <ThemedText>Select Theme</ThemedText>
              </View>
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 100,
                  backgroundColor: selectedTheme.primary,
                }}
              />
            </Pressable>
            <View style={[styles.settingItem, { backgroundColor: Colors[colorScheme!].shade }]}>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <Ionicons name="sunny-sharp" color={Colors.primary} size={24} />
                <ThemedText>Dark mode</ThemedText>
              </View>
              <Switch onValueChange={toggleTheme} value={darkMode} thumbColor={Colors.primary} />
            </View>
            <View style={[styles.settingItem, { backgroundColor: Colors[colorScheme!].shade }]}>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <MaterialCommunityIcons name="volume-vibrate" color={Colors.primary} size={24} />
                <ThemedText>Enable haptics</ThemedText>
              </View>
              <Switch onValueChange={toggleTheme} value={darkMode} thumbColor={Colors.primary} />
            </View>
            <View style={[styles.settingItem, { backgroundColor: Colors[colorScheme!].shade }]}>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <Ionicons name="notifications-sharp" color={Colors.primary} size={24} />
                <ThemedText>Enable Notifications</ThemedText>
              </View>
              <Switch onValueChange={toggleTheme} value={darkMode} thumbColor={Colors.primary} />
            </View>
            <View style={[styles.settingItem, { backgroundColor: Colors[colorScheme!].shade }]}>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <MaterialIcons name="settings-backup-restore" color={Colors.primary} size={24} />
                <ThemedText>Reset preferences</ThemedText>
              </View>
              <Ionicons name="chevron-forward-sharp" size={25} color={Colors.light.icon} />
            </View>
          </View>
          <Footer />
        </ThemedView>
      </Pressable>

      <BottomSheet
        index={-1}
        enablePanDownToClose={true}
        backgroundStyle={{ backgroundColor: selectedTheme.primary, marginBottom: 20 }}
        ref={bottomSheetRef}
      >
        <BottomSheetView style={styles.contentContainer}>
          <View style={styles.contentContainer}>
            <Ionicons name="color-palette" size={30} />
            <ThemedText darkColor={Colors.light.text} type="subtitle">
              Select Theme
            </ThemedText>
            <View style={{ flexDirection: 'row', gap: 20 }}>
              {colors.map(color => {
                return (
                  <Pressable
                    onPress={() => onThemeSelect(color)}
                    key={color.id}
                    style={[
                      styles.color,
                      color.selected ? styles.selected : null,
                      { backgroundColor: color.primary },
                    ]}
                  >
                    {color.selected && <Ionicons size={20} name="checkmark-outline" />}
                  </Pressable>
                );
              })}
            </View>
            <Pressable
              onPress={() => {}}
              style={{
                backgroundColor: Colors.dark.background,
                borderRadius: 10,
                height: 40,
                justifyContent: 'center',
                marginTop: 20,
              }}
            >
              <ThemedText style={{ textAlign: 'center' }}>Apply</ThemedText>
            </Pressable>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

export default settings;

const Footer = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
      <ThemedText>
        Created with love by <ThemedText type="link">Kritesh Timsina</ThemedText>
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    height: 60,
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  contentContainer: {
    flex: 1,
    gap: 10,
    paddingHorizontal: 10,
    height: 200,
  },
  sheetTitle: {
    textAlign: 'center',
  },
  color: {
    width: 30,
    height: 30,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selected: {
    borderWidth: 1,
    borderColor: Colors.dark.tabIconDefault,
  },
});
