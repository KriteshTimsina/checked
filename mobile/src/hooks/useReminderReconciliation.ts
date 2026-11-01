import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

import {
  configureNotificationHandler,
  reconcileAppRemindersAsync,
} from '@/utils/notifications';

/**
 * Configures local notification handling and reconciles app-wide daily and weekly reminders
 * when the app launches and when it returns to the foreground.
 */
export function useReminderReconciliation(): void {
  const appState = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    configureNotificationHandler();
    void reconcileAppRemindersAsync();

    const appStateSubscription = AppState.addEventListener('change', nextState => {
      if (appState.current === 'background' && nextState === 'active') {
        void reconcileAppRemindersAsync();
      }
      appState.current = nextState;
    });

    const responseSubscription = Notifications.addNotificationResponseReceivedListener(
      response => {
        const data = response.notification.request.content.data;
        if (data?.reminderType === 'checklist' && data?.projectId) {
          router.push({
            pathname: '/(todos)',
            params: {
              projectId: String(data.projectId),
              title: String(data.title ?? 'Checklist'),
            },
          });
        } else if (data?.reminderType === 'note' && data?.noteId) {
          router.push({
            pathname: '/(notes)',
            params: {
              noteId: String(data.noteId),
            },
          });
        }
      },
    );

    return () => {
      appStateSubscription.remove();
      responseSubscription.remove();
    };
  }, []);
}
