import React from 'react';
import * as Print from 'expo-print';
import { isAvailableAsync, shareAsync } from 'expo-sharing';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useNotes } from '@/store/notes';
import { useTheme } from '@/hooks/useTheme';
import { haptics } from '@/utils/haptics';
import { toast } from '@/utils/toast';
import { generateNoteHTML } from '@/utils/htmlTempelates';
import { ContextMenu, MenuAction, useContextMenu } from '@/components/reuseables/ContextMenu';

interface NoteMenuProps {
  noteId: number;
}

export function NoteMenu({ noteId }: NoteMenuProps) {
  const { visible, open, close } = useContextMenu();
  const { deleteNote, getNotes, getNote } = useNotes();
  const { icon, textMuted } = useTheme();
  const router = useRouter();

  const handleDelete = async () => {
    const success = await deleteNote(noteId);
    if (success) {
      haptics.success();
      await getNotes();
      close();
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
    close();
    await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
  };

  const actions: MenuAction[] = [
    {
      id: 'pdf',
      label: 'Share as PDF',
      icon: <AntDesign name="pdffile1" size={18} color={textMuted} />,
      onPress: handleSharePDF,
    },
    {
      id: 'reminder',
      label: 'Set Reminder',
      icon: <Ionicons name="time-outline" size={18} color={textMuted} />,
      onPress: () => {
        toast('Coming soon...');
        close();
      },
      disabled: true,
    },
    {
      id: 'delete',
      label: 'Delete Note',
      icon: <Ionicons name="trash-outline" size={18} color="#EF4444" />,
      onPress: handleDelete,
      destructive: true,
    },
  ];

  return <ContextMenu visible={visible} onOpen={open} onClose={close} actions={actions} />;
}
