import * as Print from 'expo-print';

import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useEntries } from '@/store/entries';
import { generateChecklistHTML } from '@/utils/htmlTempelates';
import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { isAvailableAsync, shareAsync } from 'expo-sharing';
import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';

interface MenuProps {
  title: string;
}

export function ChecklistMenu({ title }: MenuProps) {
  const [menuVisible, setMenuVisible] = useState(false);
  const { entries } = useEntries();

  const printToFile = async () => {
    const isSharingAvailable = await isAvailableAsync();

    if (isSharingAvailable) {
      const html = generateChecklistHTML(title, entries);
      const { uri } = await Print.printToFileAsync({ html });
      closeMenu();
      await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    }
  };

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  return (
    <>
      <Pressable hitSlop={8} onPress={openMenu} style={styles.menuButton}>
        <Ionicons name="ellipsis-vertical" size={24} color={Colors.dark.icon} />
      </Pressable>

      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeMenu}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
          <ThemedView style={styles.menuContent}>
            <Pressable style={styles.menuItem} onPress={printToFile}>
              <AntDesign name="pdffile1" size={20} style={styles.menuIcon} />
              <ThemedText style={styles.menuText}>Share as PDF</ThemedText>
            </Pressable>
          </ThemedView>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  menuButton: {
    marginRight: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  menuContent: {
    position: 'absolute',
    top: 50,
    right: 20,
    borderRadius: 8,
    padding: 4,
    minWidth: 200,
    shadowColor: '#71717B',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: Colors.dark.background,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 4,
    gap: 8,
  },
  menuIcon: {
    color: Colors.dark.tabIconDefault,
  },
  menuText: {
    color: Colors.dark.tabIconDefault,
  },
  deleteText: {
    color: 'red',
  },
  alertContent: {
    margin: 20,
    backgroundColor: Colors.dark.background,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  spacer: {
    height: 8,
  },
  printer: {
    textAlign: 'center',
  },
});
