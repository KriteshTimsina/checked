import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import {
  DEFAULT_DAILY_REMINDER_TIME,
  DEFAULT_WEEKLY_REMINDER_DAY,
  DEFAULT_WEEKLY_REMINDER_TIME,
  usePreferences,
  type Weekday,
} from '@/hooks/usePreferences';
import {
  cancelAllAppReminders,
  cancelChecklistReminder,
  cancelDailyReminder,
  cancelNoteReminder,
  cancelWeeklyReminder,
  DAILY_REMINDER_CONTENT,
  ensureRemindersChannelAsync,
  formatReminderTime,
  hasNotificationPermissionAsync,
  parseReminderTime,
  reconcileAppRemindersAsync,
  REMINDERS_CHANNEL_ID,
  requestNotificationPermissionsAsync,
  scheduleChecklistReminder,
  scheduleDailyReminder,
  scheduleNoteReminder,
  scheduleWeeklyReminder,
  WEEKDAYS,
  WEEKLY_REMINDER_CONTENT,
  weekdayToExpoNumber,
} from '@/utils/notifications';

jest.mock('react-native-mmkv', () => {
  const store = new Map<string, string>();
  return {
    MMKV: jest.fn().mockImplementation(() => ({
      getString: (key: string) => store.get(key),
      set: (key: string, value: string) => {
        store.set(key, value);
      },
      delete: (key: string) => {
        store.delete(key);
      },
      clearAll: () => {
        store.clear();
      },
    })),
  };
});

jest.mock('expo-notifications', () => ({
  SchedulableTriggerInputTypes: {
    CALENDAR: 'calendar',
    DAILY: 'daily',
    WEEKLY: 'weekly',
    MONTHLY: 'monthly',
    YEARLY: 'yearly',
    DATE: 'date',
    TIME_INTERVAL: 'timeInterval',
  },
  AndroidImportance: {
    HIGH: 4,
  },
  IosAuthorizationStatus: {
    PROVISIONAL: 3,
    EPHEMERAL: 4,
  },
  setNotificationHandler: jest.fn(),
  setNotificationChannelAsync: jest.fn().mockResolvedValue(null),
  getPermissionsAsync: jest.fn(),
  requestPermissionsAsync: jest.fn(),
  scheduleNotificationAsync: jest.fn(),
  cancelScheduledNotificationAsync: jest.fn().mockResolvedValue(undefined),
  getAllScheduledNotificationsAsync: jest.fn().mockResolvedValue([]),
  addNotificationResponseReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
}));

const mockedNotifications = jest.mocked(Notifications);

function resetPreferencesState() {
  usePreferences.setState({
    notificationsEnabled: false,
    dailyReminderEnabled: false,
    dailyReminderTime: DEFAULT_DAILY_REMINDER_TIME,
    dailyReminderNotificationId: null,
    weeklyReminderEnabled: false,
    weeklyReminderDay: DEFAULT_WEEKLY_REMINDER_DAY,
    weeklyReminderTime: DEFAULT_WEEKLY_REMINDER_TIME,
    weeklyReminderNotificationId: null,
    checklistReminders: {},
    noteReminders: {},
  });
}

describe('App-wide Daily and Weekly Notifications', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetPreferencesState();
    mockedNotifications.getAllScheduledNotificationsAsync.mockResolvedValue([]);
  });

  describe('Default preferences', () => {
    it('initializes with required sensible defaults', () => {
      const state = usePreferences.getState();
      expect(state.notificationsEnabled).toBe(false);
      expect(state.dailyReminderEnabled).toBe(false);
      expect(state.dailyReminderTime).toBe('09:00');
      expect(state.dailyReminderNotificationId).toBeNull();
      expect(state.weeklyReminderEnabled).toBe(false);
      expect(state.weeklyReminderDay).toBe('Sunday');
      expect(state.weeklyReminderTime).toBe('18:00');
      expect(state.weeklyReminderNotificationId).toBeNull();
    });

    it('formats default times accurately in 12-hour format', () => {
      expect(formatReminderTime('09:00')).toBe('9:00 AM');
      expect(formatReminderTime('18:00')).toBe('6:00 PM');
      expect(formatReminderTime('00:15')).toBe('12:15 AM');
      expect(formatReminderTime('12:30')).toBe('12:30 PM');
      expect(parseReminderTime('invalid', '09:00')).toEqual({ hour: 9, minute: 0 });
    });
  });

  describe('Permissions', () => {
    it('requests permission on first-time toggle when not yet granted', async () => {
      mockedNotifications.getPermissionsAsync.mockResolvedValueOnce({
        granted: false,
        canAskAgain: true,
        expires: 'never',
        status: 'undetermined' as Notifications.PermissionStatus,
      });
      mockedNotifications.requestPermissionsAsync.mockResolvedValueOnce({
        granted: true,
        canAskAgain: true,
        expires: 'never',
        status: 'granted' as Notifications.PermissionStatus,
      });

      const granted = await requestNotificationPermissionsAsync();
      expect(granted).toBe(true);
      expect(mockedNotifications.getPermissionsAsync).toHaveBeenCalledTimes(1);
      expect(mockedNotifications.requestPermissionsAsync).toHaveBeenCalledTimes(1);
    });

    it('does not re-request OS permission when already granted', async () => {
      mockedNotifications.getPermissionsAsync.mockResolvedValueOnce({
        granted: true,
        canAskAgain: true,
        expires: 'never',
        status: 'granted' as Notifications.PermissionStatus,
      });

      const granted = await requestNotificationPermissionsAsync();
      expect(granted).toBe(true);
      expect(mockedNotifications.requestPermissionsAsync).not.toHaveBeenCalled();
    });

    it('handles permission denial gracefully', async () => {
      mockedNotifications.getPermissionsAsync.mockResolvedValueOnce({
        granted: false,
        canAskAgain: false,
        expires: 'never',
        status: 'denied' as Notifications.PermissionStatus,
      });
      mockedNotifications.requestPermissionsAsync.mockResolvedValueOnce({
        granted: false,
        canAskAgain: false,
        expires: 'never',
        status: 'denied' as Notifications.PermissionStatus,
      });

      const granted = await requestNotificationPermissionsAsync();
      expect(granted).toBe(false);
    });
  });

  describe('Android notification channel', () => {
    it('creates the reminders channel on Android', async () => {
      const originalOS = Platform.OS;
      Object.defineProperty(Platform, 'OS', { value: 'android', configurable: true });

      await ensureRemindersChannelAsync();

      expect(mockedNotifications.setNotificationChannelAsync).toHaveBeenCalledWith(
        REMINDERS_CHANNEL_ID,
        expect.objectContaining({
          name: 'Reminders',
          importance: Notifications.AndroidImportance.HIGH,
        }),
      );

      Object.defineProperty(Platform, 'OS', { value: originalOS, configurable: true });
    });
  });

  describe('Daily reminders', () => {
    it('schedules a daily reminder with exact required content and stores its identifier', async () => {
      mockedNotifications.scheduleNotificationAsync.mockResolvedValueOnce('daily-id-1');

      const id = await scheduleDailyReminder('09:00');

      expect(id).toBe('daily-id-1');
      expect(usePreferences.getState().dailyReminderNotificationId).toBe('daily-id-1');
      expect(mockedNotifications.scheduleNotificationAsync).toHaveBeenCalledWith({
        content: {
          title: DAILY_REMINDER_CONTENT.title,
          body: DAILY_REMINDER_CONTENT.body,
          sound: 'default',
          data: { reminderType: 'daily' },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: 9,
          minute: 0,
          channelId: REMINDERS_CHANNEL_ID,
        },
      });
    });

    it('cancels the previous daily schedule before replacing it when time changes', async () => {
      usePreferences.getState().setDailyReminderNotificationId('daily-id-old');
      mockedNotifications.scheduleNotificationAsync.mockResolvedValueOnce('daily-id-new');

      const newId = await scheduleDailyReminder('14:45');

      expect(mockedNotifications.cancelScheduledNotificationAsync).toHaveBeenCalledWith(
        'daily-id-old',
      );
      expect(newId).toBe('daily-id-new');
      expect(usePreferences.getState().dailyReminderNotificationId).toBe('daily-id-new');
      expect(mockedNotifications.scheduleNotificationAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour: 14,
            minute: 45,
            channelId: REMINDERS_CHANNEL_ID,
          },
        }),
      );
    });

    it('cancels daily reminder and clears stored identifier when disabled', async () => {
      usePreferences.getState().setDailyReminderNotificationId('daily-id-1');

      await cancelDailyReminder();

      expect(mockedNotifications.cancelScheduledNotificationAsync).toHaveBeenCalledWith(
        'daily-id-1',
      );
      expect(usePreferences.getState().dailyReminderNotificationId).toBeNull();
    });
  });

  describe('Weekly reminders', () => {
    const expectedWeekdayNumbers: Record<Weekday, number> = {
      Sunday: 1,
      Monday: 2,
      Tuesday: 3,
      Wednesday: 4,
      Thursday: 5,
      Friday: 6,
      Saturday: 7,
    };

    it.each(WEEKDAYS)('schedules weekly reminder accurately for %s', async day => {
      mockedNotifications.scheduleNotificationAsync.mockResolvedValueOnce(`weekly-${day}`);

      const id = await scheduleWeeklyReminder(day, '18:00');

      expect(id).toBe(`weekly-${day}`);
      expect(weekdayToExpoNumber(day)).toBe(expectedWeekdayNumbers[day]);
      expect(mockedNotifications.scheduleNotificationAsync).toHaveBeenLastCalledWith({
        content: {
          title: WEEKLY_REMINDER_CONTENT.title,
          body: WEEKLY_REMINDER_CONTENT.body,
          sound: 'default',
          data: { reminderType: 'weekly' },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
          weekday: expectedWeekdayNumbers[day],
          hour: 18,
          minute: 0,
          channelId: REMINDERS_CHANNEL_ID,
        },
      });
    });

    it('replaces previous weekly reminder when weekday or time changes', async () => {
      usePreferences.getState().setWeeklyReminderNotificationId('weekly-old');
      mockedNotifications.scheduleNotificationAsync.mockResolvedValueOnce('weekly-new');

      const newId = await scheduleWeeklyReminder('Wednesday', '20:15');

      expect(mockedNotifications.cancelScheduledNotificationAsync).toHaveBeenCalledWith(
        'weekly-old',
      );
      expect(newId).toBe('weekly-new');
      expect(usePreferences.getState().weeklyReminderNotificationId).toBe('weekly-new');
    });

    it('cancels weekly reminder and clears stored identifier', async () => {
      usePreferences.getState().setWeeklyReminderNotificationId('weekly-1');

      await cancelWeeklyReminder();

      expect(mockedNotifications.cancelScheduledNotificationAsync).toHaveBeenCalledWith(
        'weekly-1',
      );
      expect(usePreferences.getState().weeklyReminderNotificationId).toBeNull();
    });
  });

  describe('Master toggle behavior', () => {
    it('cancels both reminders and clears notification IDs while preserving user time/weekday preferences', async () => {
      usePreferences.setState({
        notificationsEnabled: true,
        dailyReminderEnabled: true,
        dailyReminderTime: '08:30',
        dailyReminderNotificationId: 'daily-123',
        weeklyReminderEnabled: true,
        weeklyReminderDay: 'Friday',
        weeklyReminderTime: '19:45',
        weeklyReminderNotificationId: 'weekly-456',
      });

      await cancelAllAppReminders();
      usePreferences.getState().setNotificationsEnabled(false);

      const state = usePreferences.getState();
      expect(state.notificationsEnabled).toBe(false);
      expect(state.dailyReminderNotificationId).toBeNull();
      expect(state.weeklyReminderNotificationId).toBeNull();
      // Preserves user's preferred times, weekday, and individual reminder flags
      expect(state.dailyReminderTime).toBe('08:30');
      expect(state.weeklyReminderDay).toBe('Friday');
      expect(state.weeklyReminderTime).toBe('19:45');
      expect(state.dailyReminderEnabled).toBe(true);
      expect(state.weeklyReminderEnabled).toBe(true);
    });
  });

  describe('Reconciliation and persistence', () => {
    it('reschedules missing enabled reminders when permission is granted without prompting OS permission', async () => {
      mockedNotifications.getPermissionsAsync.mockResolvedValue({
        granted: true,
        canAskAgain: true,
        expires: 'never',
        status: 'granted' as Notifications.PermissionStatus,
      });
      mockedNotifications.getAllScheduledNotificationsAsync.mockResolvedValue([]);
      mockedNotifications.scheduleNotificationAsync
        .mockResolvedValueOnce('reconciled-daily')
        .mockResolvedValueOnce('reconciled-weekly');

      usePreferences.setState({
        notificationsEnabled: true,
        dailyReminderEnabled: true,
        dailyReminderTime: '09:00',
        dailyReminderNotificationId: 'stale-daily-id',
        weeklyReminderEnabled: true,
        weeklyReminderDay: 'Sunday',
        weeklyReminderTime: '18:00',
        weeklyReminderNotificationId: 'stale-weekly-id',
      });

      await reconcileAppRemindersAsync();

      expect(mockedNotifications.requestPermissionsAsync).not.toHaveBeenCalled();
      expect(usePreferences.getState().dailyReminderNotificationId).toBe('reconciled-daily');
      expect(usePreferences.getState().weeklyReminderNotificationId).toBe('reconciled-weekly');
    });

    it('does not create duplicate notifications when valid scheduled notifications already exist', async () => {
      mockedNotifications.getPermissionsAsync.mockResolvedValue({
        granted: true,
        canAskAgain: true,
        expires: 'never',
        status: 'granted' as Notifications.PermissionStatus,
      });
      mockedNotifications.getAllScheduledNotificationsAsync.mockResolvedValue([
        {
          identifier: 'existing-daily',
          content: {
            title: DAILY_REMINDER_CONTENT.title,
            body: DAILY_REMINDER_CONTENT.body,
            data: { reminderType: 'daily' },
            subtitle: null,
            categoryIdentifier: null,
            sound: 'default',
          },
          trigger: {
            type: 'daily',
            hour: 9,
            minute: 0,
          },
        } as unknown as Notifications.NotificationRequest,
      ]);

      usePreferences.setState({
        notificationsEnabled: true,
        dailyReminderEnabled: true,
        dailyReminderTime: '09:00',
        dailyReminderNotificationId: 'existing-daily',
        weeklyReminderEnabled: false,
      });

      await reconcileAppRemindersAsync();

      expect(mockedNotifications.scheduleNotificationAsync).not.toHaveBeenCalled();
      expect(usePreferences.getState().dailyReminderNotificationId).toBe('existing-daily');
    });

    it('does not cancel unrelated notifications belonging to other features', async () => {
      mockedNotifications.getPermissionsAsync.mockResolvedValue({
        granted: true,
        canAskAgain: true,
        expires: 'never',
        status: 'granted' as Notifications.PermissionStatus,
      });
      mockedNotifications.getAllScheduledNotificationsAsync.mockResolvedValue([
        {
          identifier: 'unrelated-task-notification',
          content: {
            title: 'Task due',
            body: 'Passport',
            data: { checklistId: 42 },
            subtitle: null,
            categoryIdentifier: null,
            sound: 'default',
          },
          trigger: {
            type: 'timeInterval',
            repeats: false,
            seconds: 60,
          },
        } as unknown as Notifications.NotificationRequest,
      ]);

      usePreferences.setState({
        notificationsEnabled: false,
        dailyReminderEnabled: false,
        weeklyReminderEnabled: false,
      });

      await reconcileAppRemindersAsync();
      await cancelAllAppReminders();

      expect(mockedNotifications.cancelScheduledNotificationAsync).not.toHaveBeenCalledWith(
        'unrelated-task-notification',
      );
    });

    it('cleans up scheduled app reminders if OS permission is revoked in device settings', async () => {
      mockedNotifications.getPermissionsAsync.mockResolvedValue({
        granted: false,
        canAskAgain: false,
        expires: 'never',
        status: 'denied' as Notifications.PermissionStatus,
      });

      usePreferences.setState({
        notificationsEnabled: true,
        dailyReminderEnabled: true,
        dailyReminderNotificationId: 'active-daily',
        weeklyReminderEnabled: true,
        weeklyReminderNotificationId: 'active-weekly',
      });

      const hasPermission = await hasNotificationPermissionAsync();
      expect(hasPermission).toBe(false);

      await reconcileAppRemindersAsync();

      expect(mockedNotifications.requestPermissionsAsync).not.toHaveBeenCalled();
      expect(usePreferences.getState().dailyReminderNotificationId).toBeNull();
      expect(usePreferences.getState().weeklyReminderNotificationId).toBeNull();
    });
  });

  describe('Checklist and Note reminders', () => {
    it('schedules and cancels a checklist reminder', async () => {
      mockedNotifications.scheduleNotificationAsync.mockResolvedValueOnce('checklist-notif-1');
      const futureDate = new Date(Date.now() + 60 * 60 * 1000);

      const id = await scheduleChecklistReminder(7, 'Travel Packing', futureDate);
      expect(id).toBe('checklist-notif-1');
      expect(usePreferences.getState().checklistReminders[7]?.notificationId).toBe(
        'checklist-notif-1',
      );

      await cancelChecklistReminder(7);
      expect(mockedNotifications.cancelScheduledNotificationAsync).toHaveBeenCalledWith(
        'checklist-notif-1',
      );
      expect(usePreferences.getState().checklistReminders[7]).toBeUndefined();
    });

    it('schedules and cancels a note reminder', async () => {
      mockedNotifications.scheduleNotificationAsync.mockResolvedValueOnce('note-notif-1');
      const futureDate = new Date(Date.now() + 60 * 60 * 1000);

      const id = await scheduleNoteReminder(12, 'Grocery Ideas', futureDate);
      expect(id).toBe('note-notif-1');
      expect(usePreferences.getState().noteReminders[12]?.notificationId).toBe('note-notif-1');

      await cancelNoteReminder(12);
      expect(mockedNotifications.cancelScheduledNotificationAsync).toHaveBeenCalledWith(
        'note-notif-1',
      );
      expect(usePreferences.getState().noteReminders[12]).toBeUndefined();
    });
  });
});
