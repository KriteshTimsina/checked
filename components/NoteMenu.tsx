import * as Print from 'expo-print';
import { isAvailableAsync, shareAsync } from 'expo-sharing';
import React, { useCallback, useState } from 'react';
import { Modal, Pressable, StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from './ThemedText';
import { toast } from '@/utils/toast';
import { useNotes } from '@/store/notes';
import { useRouter } from 'expo-router';
import { haptics } from '@/utils/haptics';
import { generateNoteHTML } from '@/utils/htmlTempelates';
import { debounce } from 'lodash';

interface NoteMenuProps {
  noteId: number;
}

export function NoteMenu({ noteId }: NoteMenuProps) {
  const [menuVisible, setMenuVisible] = useState(false);
  const { deleteNote, getNotes, getNote } = useNotes();
  const router = useRouter();

  const handleDelete = async () => {
    const success = await deleteNote(noteId);

    if (success) {
      haptics.success();
      await getNotes();
      closeMenu();
      router.back();
      toast('Note deleted');
    } else {
      haptics.error();
      toast('Failed deleting note.');
    }
  };

  const printToFile = async () => {
    const isSharingAvailable = await isAvailableAsync();

    if (isSharingAvailable) {
      const note = await getNote(noteId);
      if (!note) return toast('Failed');
      const html = generateNoteHTML(note);
      const { uri } = await Print.printToFileAsync({ html });
      closeMenu();
      await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    }
  };

  const openMenu = useCallback(
    //debounced openMenu because it is called on onPressIn instead of onPress
    debounce(() => setMenuVisible(true), 100),
    [],
  );
  const closeMenu = () => setMenuVisible(false);

  return (
    <>
      <TouchableOpacity onPressIn={openMenu} hitSlop={8} style={styles.menuButton}>
        <Ionicons name="ellipsis-vertical" size={24} color={Colors.dark.icon} />
      </TouchableOpacity>

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
            <Pressable
              style={styles.menuItem}
              onPress={() => {
                toast('Coming soon...');
                closeMenu();
              }}
            >
              <Ionicons name="time-outline" size={20} style={styles.menuIcon} />
              <ThemedText style={styles.menuText}>Set Reminder</ThemedText>
            </Pressable>
            <Pressable style={styles.menuItem} onPress={handleDelete}>
              <Ionicons name="trash-outline" size={20} color={'red'} />
              <ThemedText style={[styles.menuText, styles.deleteText]}>Delete Note</ThemedText>
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
});
