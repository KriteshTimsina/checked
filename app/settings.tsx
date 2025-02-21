import React, { useRef, useState } from 'react';
import { Appearance, Pressable, StyleSheet, Switch, View } from 'react-native';

import { FontAwesome, Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useTheme } from '@/context/ThemeContext';

import { Colors } from '@/constants/Colors';
import { tabs } from '@/constants/data';
import { SafeAreaView } from 'react-native-safe-area-context';
import { globals } from '@/styles/globals';
import { type Tab, usePreferences } from '@/store/preferences';
import { DevSettings } from 'react-native';

export default function Settings() {
  const primaryTabRef = useRef<BottomSheet>(null);
  const { selectedTheme } = useTheme();
  const colorScheme = useColorScheme();
  const [darkMode, setDarkMode] = useState(colorScheme === 'dark');
  const { setPrimaryTab, primaryTab } = usePreferences();

  const openSheet = () => {
    primaryTabRef.current?.expand();
  };
  const closeSheet = () => {
    primaryTabRef.current?.close();
  };

  const toggleTheme = async (value: boolean) => {
    const newTheme = value ? 'dark' : 'light';
    setDarkMode(value);
    Appearance.setColorScheme(newTheme);
  };

  const togglePrimaryTab = (label: Tab) => {
    setPrimaryTab(label);
    DevSettings.reload();
  };
  return (
    <SafeAreaView style={globals.flex}>
      <Pressable style={globals.flex} onPress={closeSheet}>
        <ThemedView style={{ flex: 1, padding: 20 }}>
          <ThemedText type="subtitle">Settings</ThemedText>

          <View style={{ marginVertical: 20, gap: 20 }}>
            <Pressable
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
            {/* <View style={[styles.settingItem, { backgroundColor: Colors[colorScheme!].shade }]}>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <MaterialCommunityIcons name="volume-vibrate" color={Colors.primary} size={24} />
                <ThemedText>Enable haptics</ThemedText>
              </View>
              <Switch onValueChange={() => {}} value={darkMode} thumbColor={Colors.primary} />
            </View> */}
            {/* <View style={[styles.settingItem, { backgroundColor: Colors[colorScheme!].shade }]}>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <Ionicons name="notifications-sharp" color={Colors.primary} size={24} />
                <ThemedText>Enable Notifications</ThemedText>
              </View>
              <Switch onValueChange={() => {}} value={darkMode} thumbColor={Colors.primary} />
            </View> */}
            {/* <View style={[styles.settingItem, { backgroundColor: Colors[colorScheme!].shade }]}>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <MaterialIcons name="settings-backup-restore" color={Colors.primary} size={24} />
                <ThemedText>Reset preferences</ThemedText>
              </View>
              <Ionicons name="chevron-forward-sharp" size={25} color={Colors.light.icon} />
            </View> */}
            <Pressable
              onPress={openSheet}
              style={[styles.settingItem, { backgroundColor: Colors[colorScheme!].shade }]}
            >
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <Ionicons name="home" color={Colors.primary} size={24} />
                <ThemedText>Default tab</ThemedText>
              </View>
              <Ionicons name="chevron-forward-sharp" size={20} color={Colors.light.icon} />
            </Pressable>
          </View>
          <Footer />
        </ThemedView>
      </Pressable>

      {/* <BottomSheet
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
                  ></Pressable>
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
              <ThemedText style={{ textAlign: 'center', color: Colors.dark.text }}>
                Apply
              </ThemedText>
            </Pressable>
          </View>
        </BottomSheetView>
      </BottomSheet> */}
      <BottomSheet
        index={-1}
        enablePanDownToClose={true}
        backgroundStyle={{ backgroundColor: selectedTheme.primary, marginBottom: 20 }}
        ref={primaryTabRef}
        snapPoints={['30%']}
      >
        <BottomSheetView style={styles.contentContainer}>
          <View style={styles.contentContainer}>
            <View>
              <Ionicons name="home" color={'black'} size={24} />
              <ThemedText darkColor={Colors.light.text} type="subtitle">
                Default Tab
              </ThemedText>
              <ThemedText style={styles.description}>This is where your app opens to.</ThemedText>
            </View>
            <View style={styles.tabs}>
              {tabs.map(tab => {
                const backgroundColor =
                  primaryTab === tab.label ? Colors.dark.background : Colors.light.icon;
                return (
                  <Pressable
                    onPress={() => togglePrimaryTab(tab.label as Tab)}
                    key={tab.id}
                    style={[styles.tab, { backgroundColor }]}
                  >
                    {tab.title === 'Checklist' ? (
                      <Ionicons color="white" size={25} name="checkbox" />
                    ) : (
                      <FontAwesome color="white" size={25} name="sticky-note" />
                    )}
                    <ThemedText>{tab.title}</ThemedText>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </SafeAreaView>
  );
}

const Footer = () => {
  return (
    <View style={styles.footer}>
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
  footer: { flex: 1, justifyContent: 'flex-end', alignItems: 'center' },
  description: {
    fontSize: 12,
    color: Colors.light.icon,
  },
  tabs: {
    flexDirection: 'row',
    gap: 20,
  },
  tab: { flex: 1, padding: 10, borderRadius: 10 },
});
