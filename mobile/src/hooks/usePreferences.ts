import { MMKV } from 'react-native-mmkv';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const storage = new MMKV();

const mmkvStorage = {
  getItem: (key: string) => storage.getString(key) ?? null,
  setItem: (key: string, value: string) => storage.set(key, value),
  removeItem: (key: string) => storage.delete(key),
};

export type Tab = 'index' | 'notes';
export type ColorSchemeType = 'light' | 'dark';
export type Weekday =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

export const DEFAULT_DAILY_REMINDER_TIME = '09:00';
export const DEFAULT_WEEKLY_REMINDER_DAY: Weekday = 'Sunday';
export const DEFAULT_WEEKLY_REMINDER_TIME = '18:00';

export type ItemReminder = {
  id: number;
  type: 'checklist' | 'note';
  title: string;
  dateTime: string;
  notificationId: string;
};

type PreferencesState = {
  hasCompletedOnboarding: boolean;
  completeOnboarding: () => void;

  themeId: number;
  setThemeId: (id: number) => void;

  iconId: number;
  setIconId: (id: number) => void;

  colorScheme: ColorSchemeType;
  setColorScheme: (scheme: ColorSchemeType) => void;
  toggleColorScheme: () => void;

  primaryTab: Tab;
  setPrimaryTab: (tab: Tab) => void;

  hapticsEnabled: boolean;
  toggleHaptics: (enabled: boolean) => void;

  notificationsEnabled: boolean;
  setNotificationsEnabled: (enabled: boolean) => void;

  dailyReminderEnabled: boolean;
  setDailyReminderEnabled: (enabled: boolean) => void;
  dailyReminderTime: string;
  setDailyReminderTime: (time: string) => void;
  dailyReminderNotificationId: string | null;
  setDailyReminderNotificationId: (id: string | null) => void;

  weeklyReminderEnabled: boolean;
  setWeeklyReminderEnabled: (enabled: boolean) => void;
  weeklyReminderDay: Weekday;
  setWeeklyReminderDay: (day: Weekday) => void;
  weeklyReminderTime: string;
  setWeeklyReminderTime: (time: string) => void;
  weeklyReminderNotificationId: string | null;
  setWeeklyReminderNotificationId: (id: string | null) => void;

  checklistReminders: Record<number, ItemReminder>;
  setChecklistReminder: (projectId: number, reminder: ItemReminder | null) => void;

  noteReminders: Record<number, ItemReminder>;
  setNoteReminder: (noteId: number, reminder: ItemReminder | null) => void;
};

export const usePreferences = create<PreferencesState>()(
  persist(
    (set, get) => ({
      hasCompletedOnboarding: false,
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),

      themeId: 0,
      setThemeId: id => set({ themeId: id }),

      iconId: 0,
      setIconId: id => set({ iconId: id }),

      colorScheme: 'light',
      setColorScheme: scheme => set({ colorScheme: scheme }),
      toggleColorScheme: () =>
        set(state => ({ colorScheme: state.colorScheme === 'light' ? 'dark' : 'light' })),

      primaryTab: 'index',
      setPrimaryTab: tab => set({ primaryTab: tab }),

      hapticsEnabled: true,
      toggleHaptics: enabled => set({ hapticsEnabled: enabled }),

      notificationsEnabled: false,
      setNotificationsEnabled: enabled => set({ notificationsEnabled: enabled }),

      dailyReminderEnabled: false,
      setDailyReminderEnabled: enabled => set({ dailyReminderEnabled: enabled }),
      dailyReminderTime: DEFAULT_DAILY_REMINDER_TIME,
      setDailyReminderTime: time => set({ dailyReminderTime: time }),
      dailyReminderNotificationId: null,
      setDailyReminderNotificationId: id => set({ dailyReminderNotificationId: id }),

      weeklyReminderEnabled: false,
      setWeeklyReminderEnabled: enabled => set({ weeklyReminderEnabled: enabled }),
      weeklyReminderDay: DEFAULT_WEEKLY_REMINDER_DAY,
      setWeeklyReminderDay: day => set({ weeklyReminderDay: day }),
      weeklyReminderTime: DEFAULT_WEEKLY_REMINDER_TIME,
      setWeeklyReminderTime: time => set({ weeklyReminderTime: time }),
      weeklyReminderNotificationId: null,
      setWeeklyReminderNotificationId: id => set({ weeklyReminderNotificationId: id }),

      checklistReminders: {},
      setChecklistReminder: (projectId, reminder) =>
        set(state => {
          const next = { ...state.checklistReminders };
          if (reminder) {
            next[projectId] = reminder;
          } else {
            delete next[projectId];
          }
          return { checklistReminders: next };
        }),

      noteReminders: {},
      setNoteReminder: (noteId, reminder) =>
        set(state => {
          const next = { ...state.noteReminders };
          if (reminder) {
            next[noteId] = reminder;
          } else {
            delete next[noteId];
          }
          return { noteReminders: next };
        }),
    }),
    {
      name: 'preferences',
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
