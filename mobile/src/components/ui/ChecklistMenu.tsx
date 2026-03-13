import React from 'react';
import * as Print from 'expo-print';
import { isAvailableAsync, shareAsync } from 'expo-sharing';
import { AntDesign } from '@expo/vector-icons';

import { useEntries } from '@/store/entries';
import { useTheme } from '@/hooks/useTheme';
import { generateChecklistHTML } from '@/utils/htmlTempelates';
import { ContextMenu, MenuAction, useContextMenu } from '@/components/reuseables/ContextMenu';

interface ChecklistMenuProps {
  title: string;
}

export function ChecklistMenu({ title }: ChecklistMenuProps) {
  const { visible, open, close } = useContextMenu();
  const { entries } = useEntries();
  const { textMuted } = useTheme();

  const handleSharePDF = async () => {
    const isSharingAvailable = await isAvailableAsync();
    if (!isSharingAvailable) return;

    const html = generateChecklistHTML(title, entries);
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
  ];

  return <ContextMenu visible={visible} onOpen={open} onClose={close} actions={actions} />;
}
