import React, { useCallback, useRef } from 'react';
import { Appearance, StyleSheet, View } from 'react-native';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { reloadAppAsync } from 'expo';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { type Tab, usePreferences } from '@/hooks/usePreferences';
import { APP_THEMES, AppTheme } from '@/constants/themes';
import { useTheme } from '@/hooks/useTheme';
import { haptics } from '@/utils/haptics';

import { SettingItem, SettingSection } from '@/components/ui/settings/SettingsItem';
import { ThemeSheet } from '@/components/ui/settings/ThemeSheet';
import { DefaultTabSheet } from '@/components/ui/settings/DefaultTabSheet';

export default function Settings() {
  const primaryTabRef = useRef<BottomSheet>(null);
  const themeSheetRef = useRef<BottomSheet>(null);

  const { primary, text, textMuted, surface } = useTheme();
  const {
    setPrimaryTab,
    primaryTab,
    hapticsEnabled,
    toggleHaptics,
    themeId,
    setThemeId,
    colorScheme,
    setColorScheme,
  } = usePreferences();

  const isDark = colorScheme === 'dark';
  const currentThemeName = APP_THEMES.find(t => t.id === themeId)?.name ?? '';

  const toggleDarkMode = (value: boolean) => {
    const scheme = value ? 'dark' : 'light';
    setColorScheme(scheme);
    Appearance.setColorScheme(scheme);
  };

  const onSelectTheme = (theme: AppTheme) => {
    setThemeId(theme.id);
    themeSheetRef.current?.close();
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

  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />,
    [],
  );

  const ThemePreview = (
    <View style={[styles.themePill, { backgroundColor: primary + '20' }]}>
      <View style={[styles.themeDot, { backgroundColor: primary }]} />
      <ThemedText style={[styles.themePillLabel, { color: primary }]}>
        {currentThemeName}
      </ThemedText>
    </View>
  );

  return (
    <>
      <ThemedView style={[styles.root, { backgroundColor: surface }]}>
        <ThemedText type="subtitle" style={{ color: text }}>
          Settings
        </ThemedText>

        <View style={styles.sections}>
          <SettingSection title="Appearance">
            <SettingItem
              variant="info"
              icon="color-palette-outline"
              label="Theme"
              rightElement={ThemePreview}
              onPress={() => themeSheetRef.current?.expand()}
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
              rightLabel={primaryTab === 'index' ? 'Checklist' : 'Notes'}
              onPress={() => primaryTabRef.current?.expand()}
            />
          </SettingSection>
        </View>

        <Footer />
      </ThemedView>

      <ThemeSheet
        sheetRef={themeSheetRef}
        themeId={themeId}
        onSelect={onSelectTheme}
        renderBackdrop={renderBackdrop}
      />

      <DefaultTabSheet
        sheetRef={primaryTabRef}
        primaryTab={primaryTab}
        onSelect={onSelectTab}
        renderBackdrop={renderBackdrop}
      />
    </>
  );
}

const Footer = () => {
  const { textMuted, primary } = useTheme();
  return (
    <View style={styles.footer}>
      <ThemedText style={{ color: textMuted, fontSize: 13 }}>
        Created with love by{' '}
        <ThemedText type="link" style={{ color: primary, fontSize: 13 }}>
          Kritesh Timsina
        </ThemedText>
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 20,
    paddingTop: 12,
  },
  sections: {
    marginTop: 24,
    gap: 24,
  },
  themePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  themeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  themePillLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 12,
  },
});
