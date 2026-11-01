import { setAppIcon } from '@howincodes/expo-dynamic-app-icon';
import { reloadAppAsync } from 'expo';
import React, { useRef } from 'react';
import { Alert, Linking, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText, type BottomSheetModal } from '@/components/ui';
import { APP_THEMES, AppTheme } from '@/constants/themes';
import {
  storage,
  usePreferences,
  type Tab,
  type Weekday,
} from '@/hooks/usePreferences';
import { useTheme } from '@/hooks/useTheme';
import { haptics } from '@/utils/haptics';
import {
  cancelAllAppReminders,
  cancelDailyReminder,
  cancelWeeklyReminder,
  formatReminderTime,
  requestNotificationPermissionsAsync,
  scheduleDailyReminder,
  scheduleWeeklyReminder,
} from '@/utils/notifications';

import { TitledScreen } from '@/components/layout';
import {
  AppIconSheet,
  DefaultTabSheet,
  Footer,
  SettingItem,
  SettingSection,
  ThemeSheet,
  TimePickerSheet,
  WeekdaySheet,
} from '@/components/settings';
import { openStoreListing } from '@/utils/review';
import { openWhatsNew } from '@/utils/settings';
import { toast } from '@/utils/toast';

export default function Settings() {
  const primaryTabRef = useRef<BottomSheetModal | null>(null);
  const themeSheetRef = useRef<BottomSheetModal | null>(null);
  const appIconSheetRef = useRef<BottomSheetModal | null>(null);
  const dailyTimeSheetRef = useRef<BottomSheetModal | null>(null);
  const weeklyDaySheetRef = useRef<BottomSheetModal | null>(null);
  const weeklyTimeSheetRef = useRef<BottomSheetModal | null>(null);

  const { primary, textMuted } = useTheme();
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
    notificationsEnabled,
    setNotificationsEnabled,
    dailyReminderEnabled,
    setDailyReminderEnabled,
    dailyReminderTime,
    setDailyReminderTime,
    weeklyReminderEnabled,
    setWeeklyReminderEnabled,
    weeklyReminderDay,
    setWeeklyReminderDay,
    weeklyReminderTime,
    setWeeklyReminderTime,
  } = usePreferences();

  const isDark = colorScheme === 'dark';
  const currentTheme = APP_THEMES.find(t => t.id === themeId);
  const currentIcon = APP_THEMES.find(t => t.id === iconId) ?? currentTheme;

  const toggleDarkMode = (value: boolean) => {
    const scheme = value ? 'dark' : 'light';
    setColorScheme(scheme);
  };
  const onSelectTheme = (theme: AppTheme) => {
    setThemeId(theme.id);
    themeSheetRef.current?.dismiss();
  };

  const onSelectIcon = async (theme: AppTheme) => {
    if (theme.id === iconId) {
      appIconSheetRef.current?.dismiss();
      return;
    }

    try {
      await setAppIcon(theme.iconKey);
      setIconId(theme.id);
      haptics.success();
    } catch (error) {
      console.error('Failed to change app icon:', error);
      Alert.alert('Unable to change icon', 'Please try again.');
    } finally {
      appIconSheetRef.current?.dismiss();
    }
  };

  // const onSelectTab = async (label: Tab) => {
  //   if (label === primaryTab) return;
  //   try {
  //     setPrimaryTab(label);
  //     haptics.success();
  //     await reloadAppAsync();
  //   } catch (e) {
  //     console.error('Failed to update primary tab:', e);
  //   }
  // };

  const onSelectTab = (label: Tab) => {
    if (label === primaryTab) return;

    setPrimaryTab(label);
    haptics.success();
    toast('Default tab changed successfully');
  };

  const showPermissionDeniedAlert = () => {
    Alert.alert(
      'Notification Permission Required',
      'Reminders cannot be scheduled because notification permissions are disabled. You can enable notifications for Checked in your device settings.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Open Settings',
          onPress: () => {
            Linking.openSettings();
          },
        },
      ],
    );
  };

  const onToggleMasterNotifications = async (enabled: boolean) => {
    if (!enabled) {
      try {
        await cancelAllAppReminders();
        setNotificationsEnabled(false);
        haptics.selection();
        toast('Reminders cancelled');
      } catch (error) {
        console.error('Failed to disable reminders:', error);
        toast('Could not cancel reminders');
      }
      return;
    }

    const granted = await requestNotificationPermissionsAsync();
    if (!granted) {
      setNotificationsEnabled(false);
      showPermissionDeniedAlert();
      return;
    }

    try {
      setNotificationsEnabled(true);
      if (dailyReminderEnabled) {
        await scheduleDailyReminder(dailyReminderTime);
      }
      if (weeklyReminderEnabled) {
        await scheduleWeeklyReminder(weeklyReminderDay, weeklyReminderTime);
      }
      haptics.success();
      toast('Reminders enabled');
    } catch (error) {
      console.error('Failed to enable reminders:', error);
      toast('Failed to schedule reminders');
    }
  };

  const onToggleDailyReminder = async (enabled: boolean) => {
    if (!enabled) {
      try {
        await cancelDailyReminder();
        setDailyReminderEnabled(false);
        haptics.selection();
        toast('Daily reminder cancelled');
      } catch (error) {
        console.error('Failed to cancel daily reminder:', error);
        toast('Could not cancel daily reminder');
      }
      return;
    }

    const granted = await requestNotificationPermissionsAsync();
    if (!granted) {
      setDailyReminderEnabled(false);
      showPermissionDeniedAlert();
      return;
    }

    try {
      if (!notificationsEnabled) {
        setNotificationsEnabled(true);
      }
      await scheduleDailyReminder(dailyReminderTime);
      setDailyReminderEnabled(true);
      haptics.success();
      toast(`Daily reminder scheduled for ${formatReminderTime(dailyReminderTime)}`);
    } catch (error) {
      console.error('Failed to schedule daily reminder:', error);
      toast('Could not schedule daily reminder');
    }
  };

  const onSelectDailyTime = async (time: string) => {
    if (time === dailyReminderTime) return;
    setDailyReminderTime(time);

    if (notificationsEnabled && dailyReminderEnabled) {
      try {
        await scheduleDailyReminder(time);
        toast(`Daily reminder updated to ${formatReminderTime(time)}`);
      } catch (error) {
        console.error('Failed to update daily reminder:', error);
        toast('Could not update daily reminder');
      }
    } else {
      toast(`Daily reminder time set to ${formatReminderTime(time)}`);
    }
  };

  const onToggleWeeklyReminder = async (enabled: boolean) => {
    if (!enabled) {
      try {
        await cancelWeeklyReminder();
        setWeeklyReminderEnabled(false);
        haptics.selection();
        toast('Weekly reminder cancelled');
      } catch (error) {
        console.error('Failed to cancel weekly reminder:', error);
        toast('Could not cancel weekly reminder');
      }
      return;
    }

    const granted = await requestNotificationPermissionsAsync();
    if (!granted) {
      setWeeklyReminderEnabled(false);
      showPermissionDeniedAlert();
      return;
    }

    try {
      if (!notificationsEnabled) {
        setNotificationsEnabled(true);
      }
      await scheduleWeeklyReminder(weeklyReminderDay, weeklyReminderTime);
      setWeeklyReminderEnabled(true);
      haptics.success();
      toast(
        `Weekly reminder scheduled for ${weeklyReminderDay} at ${formatReminderTime(weeklyReminderTime)}`,
      );
    } catch (error) {
      console.error('Failed to schedule weekly reminder:', error);
      toast('Could not schedule weekly reminder');
    }
  };

  const onSelectWeeklyDay = async (day: Weekday) => {
    weeklyDaySheetRef.current?.dismiss();
    if (day === weeklyReminderDay) return;

    setWeeklyReminderDay(day);
    haptics.selection();

    if (notificationsEnabled && weeklyReminderEnabled) {
      try {
        await scheduleWeeklyReminder(day, weeklyReminderTime);
        toast(`Weekly reminder updated to ${day} at ${formatReminderTime(weeklyReminderTime)}`);
      } catch (error) {
        console.error('Failed to update weekly reminder day:', error);
        toast('Could not update weekly reminder');
      }
    } else {
      toast(`Weekly reminder day set to ${day}`);
    }
  };

  const onSelectWeeklyTime = async (time: string) => {
    if (time === weeklyReminderTime) return;
    setWeeklyReminderTime(time);

    if (notificationsEnabled && weeklyReminderEnabled) {
      try {
        await scheduleWeeklyReminder(weeklyReminderDay, time);
        toast(`Weekly reminder updated to ${weeklyReminderDay} at ${formatReminderTime(time)}`);
      } catch (error) {
        console.error('Failed to update weekly reminder time:', error);
        toast('Could not update weekly reminder');
      }
    } else {
      toast(`Weekly reminder time set to ${formatReminderTime(time)}`);
    }
  };

  const onResetApp = () => {
    Alert.alert('Confirmation', 'Are you sure you want to reset the app?', [
      { text: 'Cancel', isPreferred: true, style: 'destructive' },
      {
        text: 'Proceed',
        onPress: async () => {
          await cancelAllAppReminders();
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
        <ScrollView
          showsVerticalScrollIndicator
          contentContainerStyle={styles.contentContainer}
          style={styles.container}
        >
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

            <SettingSection title="Notifications">
              <SettingItem
                variant="toggle"
                icon="notifications-outline"
                label="Enable reminders"
                subtitle="Receive daily and weekly reminders to review your lists and notes."
                value={notificationsEnabled}
                onValueChange={onToggleMasterNotifications}
              />
              <SettingItem
                variant="toggle"
                icon="sunny-outline"
                label="Daily reminder"
                subtitle={`Every day at ${formatReminderTime(dailyReminderTime)}`}
                value={notificationsEnabled && dailyReminderEnabled}
                onValueChange={onToggleDailyReminder}
              />
              <SettingItem
                variant="navigate"
                icon="time-outline"
                label="Daily reminder time"
                rightLabel={formatReminderTime(dailyReminderTime)}
                onPress={() => dailyTimeSheetRef.current?.present()}
              />
              <SettingItem
                variant="toggle"
                icon="calendar-outline"
                label="Weekly reminder"
                subtitle={`${weeklyReminderDay} at ${formatReminderTime(weeklyReminderTime)}`}
                value={notificationsEnabled && weeklyReminderEnabled}
                onValueChange={onToggleWeeklyReminder}
              />
              <SettingItem
                variant="navigate"
                icon="today-outline"
                label="Weekly reminder day"
                rightLabel={weeklyReminderDay}
                onPress={() => weeklyDaySheetRef.current?.present()}
              />
              <SettingItem
                variant="navigate"
                icon="alarm-outline"
                label="Weekly reminder time"
                rightLabel={formatReminderTime(weeklyReminderTime)}
                onPress={() => weeklyTimeSheetRef.current?.present()}
              />
              <ThemedText style={[styles.helperText, { color: textMuted }]}>
                Reminders are scheduled locally on this device. No account or internet connection
                is required.
              </ThemedText>
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
        </ScrollView>
        <Footer />
      </TitledScreen>

      <ThemeSheet sheetRef={themeSheetRef} themeId={themeId} onSelect={onSelectTheme} />

      <AppIconSheet sheetRef={appIconSheetRef} iconId={iconId ?? themeId} onSelect={onSelectIcon} />

      <DefaultTabSheet sheetRef={primaryTabRef} primaryTab={primaryTab} onSelect={onSelectTab} />

      <TimePickerSheet
        sheetRef={dailyTimeSheetRef}
        title="Daily Reminder Time"
        time={dailyReminderTime}
        onSelect={onSelectDailyTime}
      />

      <WeekdaySheet
        sheetRef={weeklyDaySheetRef}
        selectedDay={weeklyReminderDay}
        onSelect={onSelectWeeklyDay}
      />

      <TimePickerSheet
        sheetRef={weeklyTimeSheetRef}
        title="Weekly Reminder Time"
        time={weeklyReminderTime}
        onSelect={onSelectWeeklyTime}
      />
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  contentContainer: {
    justifyContent: 'space-between',
    paddingBottom: 10,
  },
  container: {
    paddingHorizontal: 10,
    flex: 1,
  },
  sections: {
    marginTop: 24,
    gap: 24,
  },
  helperText: {
    fontSize: 12,
    lineHeight: 17,
    paddingHorizontal: 6,
    marginTop: 2,
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
