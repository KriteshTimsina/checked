import React, { useState } from 'react';
import { View, Modal, Pressable, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import { useNoteStore } from './note-store';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from './ThemedText';
import { toast } from '@/utils/toast';
import { useNotes } from '@/store/notes';
import { useRouter } from 'expo-router';

interface NoteMenuProps {
  noteId: number;
}

export function NoteMenu({ noteId }: NoteMenuProps) {
  const [menuVisible, setMenuVisible] = useState(false);
  //   const [showDatePicker, setShowDatePicker] = useState(false);
  const { deleteNote, getNotes } = useNotes();
  const router = useRouter();

  const handleDelete = async () => {
    const response = await deleteNote(noteId);

    if (response) {
      await getNotes();
      closeMenu();
      router.back();
      return toast('Note deleted');
    }
    toast('Failed deleting note.');
  };

  //todo
  //   const handleSetReminder = (date: Date) => {
  //     // setReminder(noteId, date);
  //     setShowDatePicker(false);
  //     setMenuVisible(false);
  //   };

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
          <ThemedView>
            <Pressable style={styles.menuContent}>
              <Pressable
                style={styles.menuItem}
                onPress={() => {
                  toast('Coming soon...');
                  closeMenu();
                  //   setShowDatePicker(true);
                  //   setMenuVisible(false);
                }}
              >
                <Ionicons name="time-outline" size={20} style={styles.menuIcon} />
                <ThemedText style={styles.menuText}>Set Reminder</ThemedText>
              </Pressable>
              <Pressable style={styles.menuItem} onPress={handleDelete}>
                <Ionicons name="trash-outline" size={20} color={'red'} />
                <ThemedText style={[styles.menuText, styles.deleteText]}>Delete Note</ThemedText>
              </Pressable>
            </Pressable>
          </ThemedView>
        </Pressable>
      </Modal>

      {/* Date Picker */}
      {/* {showDatePicker && (
        <DateTimePicker
          value={new Date()}
          mode="datetime"
          display="default"
          onChange={(event, date) => {
            if (event.type === 'set' && date) {
              handleSetReminder(date);
            }
            setShowDatePicker(false);
          }}
        />
      )} */}
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
  alertTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 12,
  },
  alertMessage: {
    fontSize: 16,
    color: Colors.dark.text,
    marginBottom: 20,
  },
  alertButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  alertButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: Colors.dark.shade,
  },
  deleteButton: {
    backgroundColor: 'red',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  deleteButtonText: {
    color: 'white',
  },
});
