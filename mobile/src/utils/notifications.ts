import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import {
  DEFAULT_DAILY_REMINDER_TIME,
  DEFAULT_WEEKLY_REMINDER_DAY,
  DEFAULT_WEEKLY_REMINDER_TIME,
  usePreferences,
  type Weekday,
} from '@/hooks/usePreferences';

export const REMINDERS_CHANNEL_ID = 'reminders';

export const DAILY_REMINDER_CONTENT = {
  title: 'A quick check-in',
  body: 'Take a moment to review your lists and notes.',
} as const;

export const WEEKLY_REMINDER_CONTENT = {
  title: 'Weekly reset',
  body: 'Plan the week ahead with Checked.',
} as const;

export const WEEKDAYS: Weekday[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export type ReminderTime = {
  hour: number;
  minute: number;
};

export type ReminderTimeInput = string | ReminderTime;
export type WeekdayInput = Weekday | Lowercase<Weekday> | number;

const WEEKDAY_TO_EXPO_NUMBER: Record<Lowercase<Weekday>, number> = {
  sunday: 1,
  monday: 2,
  tuesday: 3,
  wednesday: 4,
  thursday: 5,
  friday: 6,
  saturday: 7,
};

let handlerConfigured = false;
let reconciliationInFlight: Promise<void> | null = null;

/**
 * Configures how notifications are presented when the app is in the foreground.
 */
export function configureNotificationHandler(): void {
  if (handlerConfigured) return;
  handlerConfigured = true;

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

/**
 * Formats hour and minute into 24-hour "HH:mm" string.
 */
export function toTimeString(hour: number, minute: number): string {
  const safeHour = Math.max(0, Math.min(23, Math.floor(hour)));
  const safeMinute = Math.max(0, Math.min(59, Math.floor(minute)));
  return `${String(safeHour).padStart(2, '0')}:${String(safeMinute).padStart(2, '0')}`;
}

/**
 * Parses a "HH:mm" string or { hour, minute } object into validated { hour, minute }.
 */
export function parseReminderTime(
  input: ReminderTimeInput,
  fallback: string = DEFAULT_DAILY_REMINDER_TIME,
): ReminderTime {
  if (typeof input === 'object' && input !== null) {
    const { hour, minute } = input;
    if (
      Number.isInteger(hour) &&
      hour >= 0 &&
      hour <= 23 &&
      Number.isInteger(minute) &&
      minute >= 0 &&
      minute <= 59
    ) {
      return { hour, minute };
    }
  }

  if (typeof input === 'string') {
    const match = /^(\d{1,2}):(\d{2})$/.exec(input.trim());
    if (match) {
      const hour = Number(match[1]);
      const minute = Number(match[2]);
      if (hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59) {
        return { hour, minute };
      }
    }
  }

  const fallbackMatch = /^(\d{1,2}):(\d{2})$/.exec(fallback);
  return {
    hour: fallbackMatch ? Number(fallbackMatch[1]) : 9,
    minute: fallbackMatch ? Number(fallbackMatch[2]) : 0,
  };
}

/**
 * Formats a time ("HH:mm" or { hour, minute }) for display in 12-hour format (e.g., "9:00 AM").
 */
export function formatReminderTime(input: ReminderTimeInput): string {
  const { hour, minute } = parseReminderTime(input);
  const period = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${String(minute).padStart(2, '0')} ${period}`;
}

/**
 * Converts a Weekday name or number (1-7) into Expo's weekday number (1 = Sunday ... 7 = Saturday).
 */
export function weekdayToExpoNumber(day: WeekdayInput): number {
  if (typeof day === 'number') {
    if (Number.isInteger(day) && day >= 1 && day <= 7) {
      return day;
    }
    return WEEKDAY_TO_EXPO_NUMBER.sunday;
  }

  const normalized = String(day).trim().toLowerCase() as Lowercase<Weekday>;
  return WEEKDAY_TO_EXPO_NUMBER[normalized] ?? WEEKDAY_TO_EXPO_NUMBER.sunday;
}

/**
 * Normalizes a WeekdayInput into the canonical capitalized Weekday string.
 */
export function normalizeWeekday(day: WeekdayInput): Weekday {
  const expoNum = weekdayToExpoNumber(day);
  const map: Record<number, Weekday> = {
    1: 'Sunday',
    2: 'Monday',
    3: 'Tuesday',
    4: 'Wednesday',
    5: 'Thursday',
    6: 'Friday',
    7: 'Saturday',
  };
  return map[expoNum] ?? DEFAULT_WEEKLY_REMINDER_DAY;
}

/**
 * Ensures the Android notification channel `reminders` exists.
 */
export async function ensureRemindersChannelAsync(): Promise<void> {
  if (Platform.OS !== 'android') return;

  await Notifications.setNotificationChannelAsync(REMINDERS_CHANNEL_ID, {
    name: 'Reminders',
    description: 'Daily and weekly reminders to review your lists and notes',
    importance: Notifications.AndroidImportance.HIGH,
    sound: 'default',
    enableVibrate: true,
  });
}

function isPermissionGranted(settings: Notifications.NotificationPermissionsStatus): boolean {
  return (
    settings.granted ||
    settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL ||
    settings.ios?.status === Notifications.IosAuthorizationStatus.EPHEMERAL
  );
}

/**
 * Checks whether notification permissions are currently granted without prompting the user.
 */
export async function hasNotificationPermissionAsync(): Promise<boolean> {
  try {
    const settings = await Notifications.getPermissionsAsync();
    return isPermissionGranted(settings);
  } catch {
    return false;
  }
}

/**
 * Requests notification permissions from the OS if not already granted.
 * Should only be called in response to an explicit user action.
 */
export async function requestNotificationPermissionsAsync(): Promise<boolean> {
  try {
    await ensureRemindersChannelAsync();
    const existing = await Notifications.getPermissionsAsync();
    if (isPermissionGranted(existing)) {
      return true;
    }

    const requested = await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: false,
        allowSound: true,
      },
    });
    return isPermissionGranted(requested);
  } catch {
    return false;
  }
}

async function safeCancelNotificationByIdAsync(id: string | null | undefined): Promise<void> {
  if (!id) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(id);
  } catch {
    // Handle missing or stale identifiers gracefully
  }
}

async function cancelNotificationsByTypeAsync(
  reminderType: 'daily' | 'weekly',
  knownId?: string | null,
): Promise<void> {
  await safeCancelNotificationByIdAsync(knownId);

  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    const matching = scheduled.filter(
      item =>
        item.identifier !== knownId && item.content?.data?.reminderType === reminderType,
    );
    await Promise.all(
      matching.map(item => safeCancelNotificationByIdAsync(item.identifier)),
    );
  } catch {
    // Ignore errors when querying scheduled notifications
  }
}

/**
 * Schedules the repeating daily reminder at the specified time in the device's local timezone.
 * Cancels any existing daily reminder before scheduling its replacement.
 */
export async function scheduleDailyReminder(time: ReminderTimeInput): Promise<string> {
  const { hour, minute } = parseReminderTime(time, DEFAULT_DAILY_REMINDER_TIME);
  const prefs = usePreferences.getState();

  await cancelNotificationsByTypeAsync('daily', prefs.dailyReminderNotificationId);
  await ensureRemindersChannelAsync();

  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      title: DAILY_REMINDER_CONTENT.title,
      body: DAILY_REMINDER_CONTENT.body,
      sound: 'default',
      data: {
        reminderType: 'daily',
      },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
      channelId: REMINDERS_CHANNEL_ID,
    },
  });

  usePreferences.getState().setDailyReminderNotificationId(identifier);
  return identifier;
}

/**
 * Schedules the repeating weekly reminder on the specified weekday and time in the device's local timezone.
 * Cancels any existing weekly reminder before scheduling its replacement.
 */
export async function scheduleWeeklyReminder(
  day: WeekdayInput,
  time: ReminderTimeInput,
): Promise<string> {
  const weekday = weekdayToExpoNumber(day);
  const { hour, minute } = parseReminderTime(time, DEFAULT_WEEKLY_REMINDER_TIME);
  const prefs = usePreferences.getState();

  await cancelNotificationsByTypeAsync('weekly', prefs.weeklyReminderNotificationId);
  await ensureRemindersChannelAsync();

  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      title: WEEKLY_REMINDER_CONTENT.title,
      body: WEEKLY_REMINDER_CONTENT.body,
      sound: 'default',
      data: {
        reminderType: 'weekly',
      },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
      weekday,
      hour,
      minute,
      channelId: REMINDERS_CHANNEL_ID,
    },
  });

  usePreferences.getState().setWeeklyReminderNotificationId(identifier);
  return identifier;
}

/**
 * Cancels the scheduled daily reminder and clears its stored identifier.
 */
export async function cancelDailyReminder(): Promise<void> {
  const { dailyReminderNotificationId, setDailyReminderNotificationId } =
    usePreferences.getState();
  await cancelNotificationsByTypeAsync('daily', dailyReminderNotificationId);
  setDailyReminderNotificationId(null);
}

/**
 * Cancels the scheduled weekly reminder and clears its stored identifier.
 */
export async function cancelWeeklyReminder(): Promise<void> {
  const { weeklyReminderNotificationId, setWeeklyReminderNotificationId } =
    usePreferences.getState();
  await cancelNotificationsByTypeAsync('weekly', weeklyReminderNotificationId);
  setWeeklyReminderNotificationId(null);
}

/**
 * Cancels both app-wide daily and weekly reminders without touching unrelated notifications.
 */
export async function cancelAllAppReminders(): Promise<void> {
  await Promise.all([cancelDailyReminder(), cancelWeeklyReminder()]);
}

/**
 * Cancels a scheduled reminder for a specific checklist.
 */
export async function cancelChecklistReminder(projectId: number): Promise<void> {
  const { checklistReminders, setChecklistReminder } = usePreferences.getState();
  const existing = checklistReminders[projectId];
  if (existing?.notificationId) {
    await safeCancelNotificationByIdAsync(existing.notificationId);
  }

  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    const matching = scheduled.filter(
      item =>
        item.identifier !== existing?.notificationId &&
        item.content?.data?.reminderType === 'checklist' &&
        Number(item.content?.data?.projectId) === projectId,
    );
    await Promise.all(
      matching.map(item => safeCancelNotificationByIdAsync(item.identifier)),
    );
  } catch {
    // Ignore errors when querying scheduled notifications
  }

  setChecklistReminder(projectId, null);
}

/**
 * Schedules a one-time local reminder for a specific checklist at the given Date.
 */
export async function scheduleChecklistReminder(
  projectId: number,
  title: string,
  date: Date,
): Promise<string> {
  if (Number.isNaN(date.getTime()) || date.getTime() <= Date.now()) {
    throw new Error('Reminder time must be in the future.');
  }

  await cancelChecklistReminder(projectId);
  await ensureRemindersChannelAsync();

  const cleanTitle = title.trim() || 'Checklist';
  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Checklist Reminder',
      body: `Review checklist: ${cleanTitle}`,
      sound: 'default',
      data: {
        reminderType: 'checklist',
        projectId,
        title: cleanTitle,
      },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date,
      channelId: REMINDERS_CHANNEL_ID,
    },
  });

  usePreferences.getState().setChecklistReminder(projectId, {
    id: projectId,
    type: 'checklist',
    title: cleanTitle,
    dateTime: date.toISOString(),
    notificationId: identifier,
  });

  return identifier;
}

/**
 * Cancels a scheduled reminder for a specific note.
 */
export async function cancelNoteReminder(noteId: number): Promise<void> {
  const { noteReminders, setNoteReminder } = usePreferences.getState();
  const existing = noteReminders[noteId];
  if (existing?.notificationId) {
    await safeCancelNotificationByIdAsync(existing.notificationId);
  }

  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    const matching = scheduled.filter(
      item =>
        item.identifier !== existing?.notificationId &&
        item.content?.data?.reminderType === 'note' &&
        Number(item.content?.data?.noteId) === noteId,
    );
    await Promise.all(
      matching.map(item => safeCancelNotificationByIdAsync(item.identifier)),
    );
  } catch {
    // Ignore errors when querying scheduled notifications
  }

  setNoteReminder(noteId, null);
}

/**
 * Schedules a one-time local reminder for a specific note at the given Date.
 */
export async function scheduleNoteReminder(
  noteId: number,
  title: string,
  date: Date,
): Promise<string> {
  if (Number.isNaN(date.getTime()) || date.getTime() <= Date.now()) {
    throw new Error('Reminder time must be in the future.');
  }

  await cancelNoteReminder(noteId);
  await ensureRemindersChannelAsync();

  const cleanTitle = title.trim() || 'Untitled note';
  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Note Reminder',
      body: cleanTitle,
      sound: 'default',
      data: {
        reminderType: 'note',
        noteId,
        title: cleanTitle,
      },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date,
      channelId: REMINDERS_CHANNEL_ID,
    },
  });

  usePreferences.getState().setNoteReminder(noteId, {
    id: noteId,
    type: 'note',
    title: cleanTitle,
    dateTime: date.toISOString(),
    notificationId: identifier,
  });

  return identifier;
}

function doesTriggerMatchDaily(
  request: Notifications.NotificationRequest,
  expectedHour: number,
  expectedMinute: number,
): boolean {
  const trigger = request.trigger as Record<string, unknown> | null;
  if (!trigger) return false;

  if (trigger.type === 'daily') {
    return trigger.hour === expectedHour && trigger.minute === expectedMinute;
  }

  if (trigger.type === 'calendar') {
    const dc = trigger.dateComponents as Record<string, unknown> | undefined;
    if (!dc) return true;
    return (
      dc.hour === expectedHour &&
      dc.minute === expectedMinute &&
      dc.weekday === undefined
    );
  }

  return true;
}

function doesTriggerMatchWeekly(
  request: Notifications.NotificationRequest,
  expectedWeekday: number,
  expectedHour: number,
  expectedMinute: number,
): boolean {
  const trigger = request.trigger as Record<string, unknown> | null;
  if (!trigger) return false;

  if (trigger.type === 'weekly') {
    return (
      trigger.weekday === expectedWeekday &&
      trigger.hour === expectedHour &&
      trigger.minute === expectedMinute
    );
  }

  if (trigger.type === 'calendar') {
    const dc = trigger.dateComponents as Record<string, unknown> | undefined;
    if (!dc) return true;
    return (
      dc.weekday === expectedWeekday &&
      dc.hour === expectedHour &&
      dc.minute === expectedMinute
    );
  }

  return true;
}

/**
 * Reconciles currently scheduled OS notifications with persisted MMKV reminder preferences.
 * Never triggers an OS permission prompt and never cancels unrelated notifications.
 */
export async function reconcileAppRemindersAsync(): Promise<void> {
  if (reconciliationInFlight) {
    return reconciliationInFlight;
  }

  reconciliationInFlight = (async () => {
    try {
      await ensureRemindersChannelAsync();

      const hasPermission = await hasNotificationPermissionAsync();
      const prefs = usePreferences.getState();

      // Clean up any expired checklist or note reminders
      const now = Date.now();
      for (const [idStr, reminder] of Object.entries(prefs.checklistReminders ?? {})) {
        const targetTime = new Date(reminder.dateTime).getTime();
        if (Number.isNaN(targetTime) || targetTime <= now) {
          prefs.setChecklistReminder(Number(idStr), null);
        }
      }
      for (const [idStr, reminder] of Object.entries(prefs.noteReminders ?? {})) {
        const targetTime = new Date(reminder.dateTime).getTime();
        if (Number.isNaN(targetTime) || targetTime <= now) {
          prefs.setNoteReminder(Number(idStr), null);
        }
      }

      if (!prefs.notificationsEnabled || !hasPermission) {
        await cancelAllAppReminders();
        return;
      }

      const scheduled = await Notifications.getAllScheduledNotificationsAsync();

      // 1. Reconcile Daily Reminder
      const dailyCandidates = scheduled.filter(
        item =>
          item.identifier === prefs.dailyReminderNotificationId ||
          item.content?.data?.reminderType === 'daily',
      );

      if (prefs.dailyReminderEnabled) {
        const { hour, minute } = parseReminderTime(
          prefs.dailyReminderTime,
          DEFAULT_DAILY_REMINDER_TIME,
        );
        const primaryDaily = prefs.dailyReminderNotificationId
          ? dailyCandidates.find(
              item => item.identifier === prefs.dailyReminderNotificationId,
            )
          : undefined;

        const duplicates = dailyCandidates.filter(
          item => item.identifier !== primaryDaily?.identifier,
        );
        await Promise.all(
          duplicates.map(item => safeCancelNotificationByIdAsync(item.identifier)),
        );

        if (!primaryDaily || !doesTriggerMatchDaily(primaryDaily, hour, minute)) {
          await scheduleDailyReminder(prefs.dailyReminderTime);
        }
      } else {
        if (dailyCandidates.length > 0 || prefs.dailyReminderNotificationId !== null) {
          await cancelDailyReminder();
        }
      }

      // 2. Reconcile Weekly Reminder
      const latestPrefs = usePreferences.getState();
      const weeklyCandidates = scheduled.filter(
        item =>
          item.identifier === latestPrefs.weeklyReminderNotificationId ||
          item.content?.data?.reminderType === 'weekly',
      );

      if (latestPrefs.weeklyReminderEnabled) {
        const expectedWeekday = weekdayToExpoNumber(latestPrefs.weeklyReminderDay);
        const { hour, minute } = parseReminderTime(
          latestPrefs.weeklyReminderTime,
          DEFAULT_WEEKLY_REMINDER_TIME,
        );
        const primaryWeekly = latestPrefs.weeklyReminderNotificationId
          ? weeklyCandidates.find(
              item => item.identifier === latestPrefs.weeklyReminderNotificationId,
            )
          : undefined;

        const duplicates = weeklyCandidates.filter(
          item => item.identifier !== primaryWeekly?.identifier,
        );
        await Promise.all(
          duplicates.map(item => safeCancelNotificationByIdAsync(item.identifier)),
        );

        if (
          !primaryWeekly ||
          !doesTriggerMatchWeekly(primaryWeekly, expectedWeekday, hour, minute)
        ) {
          await scheduleWeeklyReminder(
            latestPrefs.weeklyReminderDay,
            latestPrefs.weeklyReminderTime,
          );
        }
      } else {
        if (
          weeklyCandidates.length > 0 ||
          latestPrefs.weeklyReminderNotificationId !== null
        ) {
          await cancelWeeklyReminder();
        }
      }
    } catch (error) {
      console.warn('Failed to reconcile app reminders:', error);
    } finally {
      reconciliationInFlight = null;
    }
  })();

  return reconciliationInFlight;
}
