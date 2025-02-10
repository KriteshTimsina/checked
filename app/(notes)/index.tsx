import { TextInput, Dimensions, StyleSheet, Pressable, View } from 'react-native';
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Stack, useLocalSearchParams, useNavigation } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { globals } from '@/styles/globals';
import { Colors } from '@/constants/Colors';
import { useNotes } from '@/store/notes';
import { INote } from '@/db/schema';
import { toast } from '@/utils/toast';
import { Ionicons } from '@expo/vector-icons';
import Button from '@/components/Button';
import { ThemedText } from '@/components/ThemedText';
import dayjs from 'dayjs';
import BottomSheet from '@/components/BottomSheet';
import GorhomBottomSheet from '@gorhom/bottom-sheet';

const contentHeight = Dimensions.get('screen').height / 2;

export type NoteInput = Pick<INote, 'title' | 'content'>;

const initialState = {
  title: '',
  content: null,
};

export default function Index() {
  const { noteId } = useLocalSearchParams<{ noteId: string }>();
  const { getNote, createNote, updateNote } = useNotes();
  const [note, setNote] = useState<Partial<INote>>(initialState);
  const bottomSheetRef = useRef<GorhomBottomSheet>(null);

  useEffect(() => {
    if (noteId) {
      fetchNote();
    }
  }, [noteId, getNote]);

  const fetchNote = async () => {
    const note = await getNote(Number(noteId));
    if (note) setNote(note);
  };

  const onSaveNote = useCallback(async () => {
    if (!note?.title?.trim()) return;

    try {
      const saveOperation = note?.id
        ? () => updateNote(Number(noteId), note as NoteInput)
        : () => createNote(note as NoteInput);

      const saved = await saveOperation();

      if (saved) {
        toast('Saved');
      }
    } catch (error) {
      console.error(error, 'Error saving note');
      toast('Error saving note');
    }
  }, [note, createNote, updateNote]);

  const onChangeText = (key: keyof NoteInput, text: string) => {
    setNote(prev => ({ ...prev, [key]: text }));
  };

  return (
    <ThemedView style={globals.container}>
      <TextInput
        autoFocus={noteId === undefined}
        placeholder="Your title here"
        placeholderTextColor={Colors.dark.icon}
        onChangeText={text => onChangeText('title', text)}
        style={styles.title}
        value={note?.title}
      />
      <ThemedText style={styles.date} darkColor={Colors.light.icon} lightColor={Colors.light.shade}>
        {note?.updatedAt
          ? dayjs(note?.updatedAt).format('DD MMMM YYYY h:mm A')
          : note?.createdAt
          ? dayjs(note?.createdAt).format('DD MMMM YYYY H:mm A')
          : ''}
      </ThemedText>
      <TextInput
        placeholder="Your content here"
        placeholderTextColor={Colors.dark.icon}
        onChangeText={text => onChangeText('content', text)}
        multiline
        style={styles.content}
        value={note?.content ?? ''}
      />

      {/* {note?.title !== '' && <Button type="save" onPress={onSaveNote} />} */}

      <NoteControls onSaveNote={onSaveNote} onOpen={() => bottomSheetRef.current?.expand()} />

      <BottomSheet snapPoints={['100%']} bottomSheetRef={bottomSheetRef} title="Recordings">
        <ThemedText>TEST</ThemedText>
      </BottomSheet>
    </ThemedView>
  );
}

const NoteControls = ({ onOpen, onSaveNote }: { onOpen: () => void; onSaveNote: () => void }) => {
  return (
    <View style={styles.controls}>
      <Pressable
        onLongPress={() => toast('Start Recording')}
        style={({ pressed }) => [styles.button, { transform: [{ scale: pressed ? 0.9 : 1 }] }]}
        onPress={onOpen}
      >
        <Ionicons name="mic" size={24} color="white" />
      </Pressable>
      <Pressable
        onLongPress={() => toast('View Recordings')}
        style={({ pressed }) => [styles.button, { transform: [{ scale: pressed ? 0.9 : 1 }] }]}
        onPress={onSaveNote}
      >
        <Ionicons name="list" size={24} color="white" />
      </Pressable>
      <Pressable
        onLongPress={() => toast('Add to Favourite')}
        style={({ pressed }) => [styles.button, { transform: [{ scale: pressed ? 0.9 : 1 }] }]}
        onPress={onSaveNote}
      >
        <Ionicons name="heart-outline" size={24} color="white" />
      </Pressable>
      <Pressable
        onLongPress={() => toast('Save Note')}
        style={({ pressed }) => [styles.button, { transform: [{ scale: pressed ? 0.9 : 1 }] }]}
        onPress={onSaveNote}
      >
        <Ionicons name="checkmark" size={24} color="white" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    fontSize: 18,
    flex: 1,
    textAlignVertical: 'top',
    minHeight: contentHeight,
    color: Colors.dark.icon,
  },
  recordings: {
    gap: 10,
  },
  page: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
  },
  button: {
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controls: {
    position: 'absolute',
    bottom: '3%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    gap: 5,
    backgroundColor: Colors.dark.shade,
    borderRadius: 100,
    width: '100%',
    alignItems: 'center',
    marginHorizontal: 'auto',
    alignSelf: 'center',
  },
});
