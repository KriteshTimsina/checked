import { TextInput, Dimensions, StyleSheet, Pressable } from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { globals } from '@/styles/globals';
import { Colors } from '@/constants/Colors';
import { useNotes } from '@/store/notes';
import { INote } from '@/db/schema';
import { toast } from '@/utils/toast';
import { Ionicons } from '@expo/vector-icons';

const contentHeight = Dimensions.get('screen').height / 2;

export type NoteInput = Pick<INote, 'title' | 'content'>;

const initialState = {
  title: '',
  content: null,
};

export default function Index() {
  const { noteId } = useLocalSearchParams<{ noteId: string }>();
  const { getNote, createNote } = useNotes();
  const [note, setNote] = useState<Partial<INote>>(initialState);
  const navigation = useNavigation();

  useEffect(() => {
    if (noteId) {
      fetchNote();
    }
  }, [noteId, getNote]);

  useLayoutEffect(() => {
    if (navigation && note?.title?.trim() !== '') {
      navigation.setOptions({
        headerRight: () => (
          <Pressable onPress={onSaveNote}>
            <Ionicons name="checkmark" color="white" size={28} />
          </Pressable>
        ),
      });
    }
  }, [navigation, note]);

  const fetchNote = async () => {
    const note = await getNote(Number(noteId));
    if (note) setNote(note);
  };

  const onSaveNote = async () => {
    try {
      if (note?.title?.trim() === '') {
        return;
      }
      const created = await createNote(note as NoteInput);
      if (created) {
        toast('Saved');
      }
    } catch (error) {
      console.error(error, 'Error saving note');
      toast('Error saving note');
    }
  };

  const onChangeText = (key: keyof NoteInput, text: string) => {
    setNote(prev => ({ ...prev, [key]: text }));
  };

  return (
    <ThemedView style={[globals.container, { paddingTop: 0 }]}>
      <TextInput
        autoFocus
        placeholder="Your title here"
        placeholderTextColor={Colors.dark.icon}
        onChangeText={text => onChangeText('title', text)}
        style={styles.title}
        value={note?.title}
      />
      <TextInput
        placeholder="Your content here"
        placeholderTextColor={Colors.dark.icon}
        onChangeText={text => onChangeText('content', text)}
        multiline
        style={styles.content}
        value={note?.content ?? ''}
      />

      {/* <View style={styles.recordings}>
          {recordedUri && (
            <Recording
              onStartPlay={onStartPlay}
              onStopPlay={onStopPlay}
              isPlaying={isPlaying}
              duration={duration}
              playTime={playTime}
              records={recordedUri}
            />
          )}
        </View> */}

      {/* {isKeyboardVisible && (
        <NoteControls
          isRecording={isRecording}
          onStopRecord={onStopRecord}
          onStartRecord={onStartRecord}
          saveNote={saveNote}
        />
      )} */}

      {/* <Portal>
        <Modal
          visible={themeModalVisible}
          onDismiss={closeThemeModal}
          contentContainerStyle={styles.modalContainer}
        >
          <Text>Choose color background</Text>
          <View style={styles.colors}>
            {backgrounds.map(background => {
              return (
                <TouchableOpacity
                  onPress={() => onChangeTheme(background)}
                  key={background}
                  style={[styles.colorContainer, { backgroundColor: background }]}
                />
              );
            })}
          </View>
        </Modal>
      </Portal> */}
    </ThemedView>
  );
}

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
});
