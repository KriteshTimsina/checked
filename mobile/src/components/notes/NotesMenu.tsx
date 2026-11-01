import React, { useRef } from 'react';
import { Alert, Linking } from 'react-native';
import * as Print from 'expo-print';
import { isAvailableAsync, shareAsync } from 'expo-sharing';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import dayjs from 'dayjs';

import { ItemReminderSheet } from '@/components/settings';
import { usePreferences } from '@/hooks/usePreferences';
import { useNotes } from '@/store/notes';
import { useTheme } from '@/hooks/useTheme';
import { haptics } from '@/utils/haptics';
import {
  cancelNoteReminder,
  requestNotificationPermissionsAsync,
  scheduleNoteReminder,
} from '@/utils/notifications';
import { toast } from '@/utils/toast';
import { generateNoteHTML } from '@/utils/htmlTempelates';
import { type BottomSheetModal, ContextMenu, MenuAction, useContextMenu } from '@/components/ui';

interface NoteMenuProps {
  noteId: number;
  noteTitle?: string;
  pinned: boolean | null;
  setPinned: React.Dispatch<React.SetStateAction<boolean | null>>;
}

export default function NoteMenu({ noteId, noteTitle, pinned, setPinned }: NoteMenuProps) {
  const { visible, open, close } = useContextMenu();
  const reminderSheetRef = useRef<BottomSheetModal | null>(null);
  const { deleteNote, getNote, togglePin } = useNotes();
  const { textMuted, primary } = useTheme();
  const router = useRouter();
  const existingReminder = usePreferences(s => s.noteReminders?.[noteId]);

  const handleDelete = async () => {
    const success = await deleteNote(noteId);
    if (success) {
      haptics.success();
      router.back();
      toast('Note deleted');
    } else {
      haptics.error();
      toast('Failed deleting note.');
    }
  };

  const handleSharePDF = async () => {
    const isSharingAvailable = await isAvailableAsync();
    if (!isSharingAvailable) return toast('Sharing not available');

    const note = await getNote(noteId);
    if (!note) return toast('Failed to load note');

    const html = generateNoteHTML(note);
    const { uri } = await Print.printToFileAsync({ html });
    await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
  };

  const handlePinNote = async () => {
    const success = await togglePin(noteId);
    if (success) {
      haptics.medium();
      setPinned(prev => !prev);
      toast(pinned ? 'Note unpinned' : 'Note pinned');
    } else {
      haptics.error();
    }
  };

  const handleOpenReminderSheet = () => {
    close();
    setTimeout(() => {
      reminderSheetRef.current?.present();
    }, 150);
  };

  const handleScheduleReminder = async (date: Date) => {
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
      const note = await getNote(noteId);
      const titleToUse = noteTitle?.trim() || note?.title?.trim() || 'Untitled note';
      await scheduleNoteReminder(noteId, titleToUse, date);
      toast(`Reminder set for ${dayjs(date).format('MMM D, h:mm A')}`);
    } catch {
      toast('Could not schedule note reminder');
    }
  };

  const handleRemoveReminder = async () => {
    try {
      await cancelNoteReminder(noteId);
      toast('Note reminder cancelled');
    } catch {
      toast('Could not cancel note reminder');
    }
  };

  const actions: MenuAction[] = [
    {
      id: 'pin',
      label: pinned ? 'Unpin Note' : 'Pin Note',
      icon: <AntDesign name="pushpin" size={18} color={textMuted} />,
      onPress: handlePinNote,
      disabled: pinned === null,
    },
    {
      id: 'pdf',
      label: 'Share as PDF',
      icon: <AntDesign name="pdffile1" size={18} color={textMuted} />,
      onPress: handleSharePDF,
    },
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
    {
      id: 'delete',
      label: 'Delete Note',
      icon: <Ionicons name="trash-outline" size={18} color="#EF4444" />,
      onPress: handleDelete,
      destructive: true,
    },
  ];

  return (
    <>
      <ContextMenu visible={visible} onOpen={open} onClose={close} actions={actions} />
      <ItemReminderSheet
        sheetRef={reminderSheetRef}
        title="Note Reminder"
        existingDateTime={existingReminder?.dateTime ?? null}
        onSchedule={handleScheduleReminder}
        onRemove={handleRemoveReminder}
      />
    </>
  );
}
