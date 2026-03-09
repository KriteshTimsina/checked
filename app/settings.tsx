import React, { useCallback, useRef } from 'react';
import { Appearance, Pressable, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { reloadAppAsync } from 'expo';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { type Tab, usePreferences } from '@/hooks/usePreferences';
import { APP_THEMES, AppTheme } from '@/constants/themes';
import { useTheme } from '@/hooks/useTheme';
import { tabs } from '@/constants/data';
import { haptics } from '@/utils/haptics';

export default function Settings() {
  const primaryTabRef = useRef<BottomSheet>(null);
  const themeSheetRef = useRef<BottomSheet>(null);

  const colors = useTheme();

  const {
    setPrimaryTab,
    primaryTab,
    hapticsEnabled,
    toggleHaptics,
    themeId,
    setThemeId,
    colorScheme,
    toggleColorScheme,
    setColorScheme,
  } = usePreferences();

  const isDark = colorScheme === 'dark';

  // ── Handlers ────────────────────────────────────────────────────────────────

  const toggleTheme = (value: boolean) => {
    const newScheme = value ? 'dark' : 'light';
    setColorScheme(newScheme);
    Appearance.setColorScheme(newScheme);
  };

  const onSelectTheme = (theme: AppTheme) => {
    setThemeId(theme.id);
    themeSheetRef.current?.close();
  };

  const onTogglePrimaryTab = async (label: Tab) => {
    if (label === primaryTab) return;
    try {
      setPrimaryTab(label);
      haptics.success();
      await reloadAppAsync();
    } catch (error) {
      console.error('Failed to update primary tab:', error);
    }
  };

  const onToggleHaptics = (enabled: boolean) => toggleHaptics(enabled);

  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />,
    [],
  );

  // ── UI ──────────────────────────────────────────────────────────────────────

  return (
    <>
      <ThemedView style={[styles.root, { backgroundColor: colors.background }]}>
        <ThemedText type="subtitle" style={{ color: colors.text }}>
          Settings
        </ThemedText>

        <View style={styles.section}>
          {/* Select Theme */}
          <Pressable
            onPress={() => themeSheetRef.current?.expand()}
            style={[styles.settingItem, { backgroundColor: colors.shade }]}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="color-palette" color={colors.primary} size={24} />
              <ThemedText style={{ color: colors.text }}>Select Theme</ThemedText>
            </View>
            {/* Current theme swatch */}
            <View style={styles.themePreviewRow}>
              <ThemedText style={[styles.themePreviewLabel, { color: colors.subtext }]}>
                {APP_THEMES.find(t => t.id === themeId)?.name}
              </ThemedText>
              <View style={[styles.themeDot, { backgroundColor: colors.primary }]} />
            </View>
          </Pressable>

          {/* Dark mode */}
          <View style={[styles.settingItem, { backgroundColor: colors.shade }]}>
            <View style={styles.settingLeft}>
              <Ionicons name={isDark ? 'moon' : 'sunny-sharp'} color={colors.primary} size={24} />
              <ThemedText style={{ color: colors.text }}>Dark mode</ThemedText>
            </View>
            <Switch
              onValueChange={toggleTheme}
              value={isDark}
              thumbColor={colors.primary}
              trackColor={{ false: colors.border, true: colors.primary + '60' }}
            />
          </View>

          {/* Haptics */}
          <View style={[styles.settingItem, { backgroundColor: colors.shade }]}>
            <View style={styles.settingLeft}>
              <MaterialCommunityIcons name="volume-vibrate" color={colors.primary} size={24} />
              <ThemedText style={{ color: colors.text }}>Enable haptics</ThemedText>
            </View>
            <Switch
              onValueChange={onToggleHaptics}
              value={hapticsEnabled}
              thumbColor={colors.primary}
              trackColor={{ false: colors.border, true: colors.primary + '60' }}
            />
          </View>

          {/* Default tab */}
          <Pressable
            onPress={() => primaryTabRef.current?.expand()}
            style={[styles.settingItem, { backgroundColor: colors.shade }]}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="home" color={colors.primary} size={24} />
              <ThemedText style={{ color: colors.text }}>Default tab</ThemedText>
            </View>
            <Ionicons name="chevron-forward-sharp" size={20} color={colors.icon} />
          </Pressable>
        </View>

        <Footer colors={colors} />
      </ThemedView>

      {/* ── Theme selector sheet ─────────────────────────────────────────── */}
      <BottomSheet
        ref={themeSheetRef}
        index={-1}
        snapPoints={['42%']}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: colors.cardBackground }}
        handleIndicatorStyle={{ backgroundColor: colors.border }}
      >
        <BottomSheetView style={styles.sheetContainer}>
          <View style={styles.sheetHeader}>
            <Ionicons name="color-palette" color={colors.primary} size={22} />
            <ThemedText type="subtitle" style={{ color: colors.text }}>
              Choose Theme
            </ThemedText>
          </View>

          <View style={styles.themeGrid}>
            {APP_THEMES.map(theme => {
              const isSelected = theme.id === themeId;
              return (
                <TouchableOpacity
                  key={theme.id}
                  onPress={() => onSelectTheme(theme)}
                  activeOpacity={0.8}
                  style={[
                    styles.themeCard,
                    {
                      backgroundColor: theme.bg,
                      borderColor: isSelected ? theme.primary : 'transparent',
                      borderWidth: 2,
                      shadowColor: theme.primary,
                      shadowOpacity: isSelected ? 0.25 : 0,
                      elevation: isSelected ? 6 : 1,
                    },
                  ]}
                >
                  {/* Swatch strip */}
                  <View style={styles.swatchRow}>
                    <View style={[styles.swatchMain, { backgroundColor: theme.primary }]} />
                    <View style={[styles.swatchAccent, { backgroundColor: theme.accent }]} />
                    <View style={[styles.swatchCard, { backgroundColor: theme.cardBg }]} />
                  </View>

                  <ThemedText style={styles.themeCardEmoji}>{theme.emoji}</ThemedText>
                  <ThemedText style={[styles.themeCardName, { color: theme.primary }]}>
                    {theme.name}
                  </ThemedText>
                  <ThemedText style={styles.themeCardLabel}>{theme.label}</ThemedText>

                  {isSelected && (
                    <View style={[styles.selectedBadge, { backgroundColor: theme.primary }]}>
                      <ThemedText style={styles.selectedBadgeText}>✓</ThemedText>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </BottomSheetView>
      </BottomSheet>

      {/* ── Default tab sheet ────────────────────────────────────────────── */}
      <BottomSheet
        ref={primaryTabRef}
        index={-1}
        snapPoints={['30%']}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: colors.primary }}
        handleIndicatorStyle={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
      >
        <BottomSheetView style={styles.sheetContainer}>
          <View style={styles.sheetHeader}>
            <Ionicons name="home" color="black" size={22} />
            <ThemedText darkColor="#11181C" type="subtitle">
              Default Tab
            </ThemedText>
          </View>
          <ThemedText style={styles.sheetDescription}>This is where your app opens to.</ThemedText>
          <View style={styles.tabsRow}>
            {tabs.map(tab => {
              const isActive = primaryTab === tab.label;
              return (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => onTogglePrimaryTab(tab.label as Tab)}
                  key={tab.id}
                  style={[styles.tabOption, { backgroundColor: isActive ? '#151718' : '#687076' }]}
                >
                  {tab.label === 'index' ? (
                    <Ionicons color="white" size={25} name="checkbox" />
                  ) : (
                    <FontAwesome color="white" size={25} name="sticky-note" />
                  )}
                  <ThemedText style={{ color: '#fff' }}>{tab.title}</ThemedText>
                </TouchableOpacity>
              );
            })}
          </View>
        </BottomSheetView>
      </BottomSheet>
    </>
  );
}

// ── Footer ───────────────────────────────────────────────────────────────────
const Footer = ({ colors }: { colors: ReturnType<typeof useTheme> }) => (
  <View style={styles.footer}>
    <ThemedText style={{ color: colors.subtext }}>
      Created with love by{' '}
      <ThemedText type="link" style={{ color: colors.primary }}>
        Kritesh Timsina
      </ThemedText>
    </ThemedText>
  </View>
);

// ── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginVertical: 20,
    gap: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 60,
    alignItems: 'center',
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  themePreviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  themePreviewLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  themeDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 10,
  },
  // Sheet
  sheetContainer: {
    flex: 1,
    paddingHorizontal: 16,
    gap: 12,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  sheetDescription: {
    fontSize: 13,
    color: '#687076',
    marginBottom: 4,
  },
  // Theme grid
  themeGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  themeCard: {
    flex: 1,
    borderRadius: 16,
    padding: 10,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    position: 'relative',
  },
  swatchRow: {
    flexDirection: 'row',
    width: '100%',
    height: 6,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  swatchMain: { flex: 2 },
  swatchAccent: { flex: 1 },
  swatchCard: { flex: 1 },
  themeCardEmoji: { fontSize: 20, marginBottom: 4 },
  themeCardName: { fontSize: 12, fontWeight: '800', marginBottom: 2 },
  themeCardLabel: { fontSize: 9, color: '#AAA', fontWeight: '600', textAlign: 'center' },
  selectedBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedBadgeText: { color: '#fff', fontSize: 11, fontWeight: '900' },
  // Tabs
  tabsRow: { flexDirection: 'row', gap: 20 },
  tabOption: { flex: 1, padding: 10, borderRadius: 10, gap: 6, alignItems: 'center' },
});
