import React, { useRef } from 'react';
import { Alert, Linking } from 'react-native';
import * as Print from 'expo-print';
import { isAvailableAsync, shareAsync } from 'expo-sharing';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';

import { ItemReminderSheet } from '@/components/settings';
import { usePreferences } from '@/hooks/usePreferences';
import { useEntries } from '@/store/entries';
import { useTheme } from '@/hooks/useTheme';
import { generateChecklistHTML } from '@/utils/htmlTempelates';
import {
  cancelChecklistReminder,
  requestNotificationPermissionsAsync,
  scheduleChecklistReminder,
} from '@/utils/notifications';
import { toast } from '@/utils/toast';
import { type BottomSheetModal, ContextMenu, MenuAction, useContextMenu } from '@/components/ui';

interface ChecklistMenuProps {
  title: string;
  projectId?: number;
}

export default function ChecklistMenu({ title, projectId }: ChecklistMenuProps) {
  const { visible, open, close } = useContextMenu();
  const reminderSheetRef = useRef<BottomSheetModal | null>(null);
  const { entries } = useEntries();
  const { textMuted, primary } = useTheme();
  const existingReminder = usePreferences(s =>
    projectId !== undefined ? s.checklistReminders?.[projectId] : undefined,
  );

  const handleSharePDF = async () => {
    const isSharingAvailable = await isAvailableAsync();
    if (!isSharingAvailable) return;

    const html = generateChecklistHTML(title, entries);
    const { uri } = await Print.printToFileAsync({ html });
    close();
    await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
  };

  const handleOpenReminderSheet = () => {
    close();
    setTimeout(() => {
      reminderSheetRef.current?.present();
    }, 150);
  };

  const handleScheduleReminder = async (date: Date) => {
    if (projectId === undefined) return;
    const granted = await requestNotificationPermissionsAsync();
    if (!granted) {
      Alert.alert(
        'Notification Permission Required',
        'Please enable notification permissions in your device settings to schedule reminders.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ],
      );
      return;
    }

    try {
      await scheduleChecklistReminder(projectId, title, date);
      toast(`Reminder set for ${dayjs(date).format('MMM D, h:mm A')}`);
    } catch {
      toast('Could not schedule checklist reminder');
    }
  };

  const handleRemoveReminder = async () => {
    if (projectId === undefined) return;
    try {
      await cancelChecklistReminder(projectId);
      toast('Checklist reminder cancelled');
    } catch {
      toast('Could not cancel checklist reminder');
    }
  };

  const actions: MenuAction[] = [
    ...(projectId !== undefined
      ? [
          {
            id: 'reminder',
            label: existingReminder ? 'Edit Reminder' : 'Set Reminder',
            icon: (
              <Ionicons
                name={existingReminder ? 'notifications' : 'time-outline'}
                size={18}
                color={existingReminder ? primary : textMuted}
              />
            ),
            onPress: handleOpenReminderSheet,
          },
        ]
      : []),
    {
      id: 'pdf',
      label: 'Share as PDF',
      icon: <AntDesign name="pdffile1" size={18} color={textMuted} />,
      onPress: handleSharePDF,
    },
  ];

  return (
    <>
      <ContextMenu visible={visible} onOpen={open} onClose={close} actions={actions} />
      {projectId !== undefined && (
        <ItemReminderSheet
          sheetRef={reminderSheetRef}
          title="Checklist Reminder"
          existingDateTime={existingReminder?.dateTime ?? null}
          onSchedule={handleScheduleReminder}
          onRemove={handleRemoveReminder}
        />
      )}
    </>
  );
}
