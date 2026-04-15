import React, { useRef } from 'react';
import { Alert, Appearance, ScrollView, StyleSheet, View } from 'react-native';
import { reloadAppAsync } from 'expo';
import { setAppIcon } from '@howincodes/expo-dynamic-app-icon';

import { ThemedText, type BottomSheetModal } from '@/components/ui';
import { storage, type Tab, usePreferences } from '@/hooks/usePreferences';
import { APP_THEMES, AppTheme } from '@/constants/themes';
import { useTheme } from '@/hooks/useTheme';
import { haptics } from '@/utils/haptics';

import { openStoreListing } from '@/utils/review';
import { TitledScreen } from '@/components/layout';
import {
  Footer,
  SettingItem,
  SettingSection,
  AppIconSheet,
  DefaultTabSheet,
  ThemeSheet,
} from '@/components/settings';
import { openWhatsNew } from '@/utils/settings';

export default function Settings() {
  const primaryTabRef = useRef<BottomSheetModal>(null);
  const themeSheetRef = useRef<BottomSheetModal>(null);
  const appIconSheetRef = useRef<BottomSheetModal>(null);

  const { primary } = useTheme();
  const {
    setPrimaryTab,
    primaryTab,
    hapticsEnabled,
    toggleHaptics,
    themeId,
    setThemeId,
    iconId,
    setIconId,
    colorScheme,
    setColorScheme,
  } = usePreferences();

  const isDark = colorScheme === 'dark';
  const currentTheme = APP_THEMES.find(t => t.id === themeId);
  const currentIcon = APP_THEMES.find(t => t.id === iconId) ?? currentTheme;

  const toggleDarkMode = (value: boolean) => {
    const scheme = value ? 'dark' : 'light';
    setColorScheme(scheme);
    Appearance.setColorScheme(scheme);
  };

  const onSelectTheme = (theme: AppTheme) => {
    setThemeId(theme.id);
    themeSheetRef.current?.dismiss();
  };

  const onSelectIcon = (theme: AppTheme) => {
    setIconId(theme.id);
    setAppIcon(theme.iconKey);
    haptics.success();
    appIconSheetRef.current?.dismiss();
  };

  const onSelectTab = async (label: Tab) => {
    if (label === primaryTab) return;
    try {
      setPrimaryTab(label);
      haptics.success();
      await reloadAppAsync();
    } catch (e) {
      console.error('Failed to update primary tab:', e);
    }
  };

  const onResetApp = () => {
    Alert.alert('Confirmation', 'Are you sure you want to reset the app?', [
      { text: 'Cancel', isPreferred: true, style: 'destructive' },
      {
        text: 'Proceed',
        onPress: () => {
          storage.clearAll();
          reloadAppAsync();
        },
      },
    ]);
  };

  const ThemePreview = (
    <View style={[styles.pill, { backgroundColor: primary + '20' }]}>
      <View style={[styles.pillDot, { backgroundColor: primary }]} />
      <ThemedText style={[styles.pillLabel, { color: primary }]}>{currentTheme?.name}</ThemedText>
    </View>
  );

  const IconPreview = (
    <View style={[styles.pill, { backgroundColor: primary + '20' }]}>
      <ThemedText style={styles.pillEmoji}>{currentIcon?.emoji}</ThemedText>
      <ThemedText style={[styles.pillLabel, { color: primary }]}>{currentIcon?.name}</ThemedText>
    </View>
  );

  return (
    <>
      <TitledScreen title="Settings" style={{ paddingTop: 12 }}>
        <ScrollView contentContainerStyle={styles.contentContainer} style={styles.container}>
          <View style={styles.sections}>
            <SettingSection title="Appearance">
              <SettingItem
                variant="info"
                icon="color-palette-outline"
                label="Theme"
                rightElement={ThemePreview}
                onPress={() => themeSheetRef.current?.present()}
              />
              <SettingItem
                variant="info"
                icon="apps-outline"
                label="App Icon"
                rightElement={IconPreview}
                onPress={() => appIconSheetRef.current?.present()}
              />
              <SettingItem
                variant="toggle"
                icon={isDark ? 'moon-outline' : 'sunny-outline'}
                label="Dark mode"
                value={isDark}
                onValueChange={toggleDarkMode}
              />
            </SettingSection>

            <SettingSection title="Preferences">
              <SettingItem
                variant="toggle"
                icon="phone-portrait-outline"
                label="Enable haptics"
                value={hapticsEnabled}
                onValueChange={toggleHaptics}
              />
              <SettingItem
                variant="navigate"
                icon="home-outline"
                label="Default tab"
                rightLabel={primaryTab === 'index' ? 'Tasks' : 'Notes'}
                onPress={() => primaryTabRef.current?.present()}
              />
            </SettingSection>

            <SettingSection>
              <SettingItem
                variant="navigate"
                icon="happy-outline"
                label="Rate Checked"
                onPress={openStoreListing}
              />
              <SettingItem
                variant="navigate"
                icon="gift-sharp"
                label="What's new"
                onPress={openWhatsNew}
              />

              <SettingItem
                variant="info"
                icon="refresh-outline"
                label="Reset App"
                onPress={onResetApp}
                rightElement={null}
              />
            </SettingSection>
          </View>
          <Footer />
        </ScrollView>
      </TitledScreen>

      <ThemeSheet sheetRef={themeSheetRef} themeId={themeId} onSelect={onSelectTheme} />

      <AppIconSheet sheetRef={appIconSheetRef} iconId={iconId ?? themeId} onSelect={onSelectIcon} />

      <DefaultTabSheet sheetRef={primaryTabRef} primaryTab={primaryTab} onSelect={onSelectTab} />
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingTop: 12,
  },
  contentContainer: {
    justifyContent: 'space-between',
    flex: 1,
  },
  container: {
    paddingHorizontal: 10,
    flex: 1,
  },
  sections: {
    marginTop: 24,
    gap: 24,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  pillDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  pillEmoji: {
    fontSize: 12,
  },
  pillLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
});
