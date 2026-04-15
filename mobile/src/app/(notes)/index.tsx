import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  TextInput,
  TextInputKeyPressEventData,
  View,
} from 'react-native';
import { ThemedView } from '@/components/layout';
import { ThemedText } from '@/components/ui';
import { globals } from '@/styles/globals';
import { INote } from '@/db/schema';
import { useTheme } from '@/hooks/useTheme';
import dayjs from 'dayjs';
import useAppState from '@/hooks/useAppState';
import { haptics } from '@/utils/haptics';
import { toast } from '@/utils/toast';
import { useNotes } from '@/store/notes';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { debounce } from 'lodash';
import { NotesMenu } from '@/components/notes';
import { getRandomPlaceholder } from '@/utils/note';

export type NoteInput = Pick<INote, 'title' | 'content'>;
const HEIGHT = Dimensions.get('window').height - 200;

const Note = () => {
  const [note, setNote] = useState<Partial<INote>>({ title: '', content: '' });
  const { noteId } = useLocalSearchParams<{ noteId: string }>();
  const { text, primary, textMuted } = useTheme();
  const contentRef = useRef<TextInput>(null);
  const titleRef = useRef<TextInput>(null);
  const appState = useAppState();
  const { getNote, updateNote } = useNotes();
  const navigation = useNavigation();

  const noteRef = useRef(note);

  const placeholder = useMemo(() => getRandomPlaceholder(), []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerRight}>
          {noteId && <NotesMenu pinned={note.pinned ?? false} noteId={Number(noteId)} />}
        </View>
      ),
    });
  }, [noteId, note.pinned]);

  useEffect(() => {
    noteRef.current = note;
  }, [note]);

  useEffect(() => {
    if (noteId) fetchNote();
  }, [noteId]);

  const fetchNote = async () => {
    const fetched = await getNote(Number(noteId));
    if (fetched) setNote(fetched);
  };

  const onSaveNoteRef = useCallback(async () => {
    const currentNote = noteRef.current;
    if (!currentNote) return;

    try {
      const payload: NoteInput = {
        title: currentNote.title?.trim() || 'Untitled note',
        content: currentNote.content?.trim() ?? '',
      };

      if (currentNote.id) {
        await updateNote(currentNote.id, payload);
        haptics.success();
      }
    } catch (e: any) {
      haptics.error();
      console.log(e);
      toast('Failed saving note');
    } finally {
    }
  }, [updateNote]);

  const debouncedSave = useRef(
    debounce(() => {
      onSaveNoteRef();
    }, 1500),
  ).current;

  useEffect(() => {
    if (appState === 'background') {
      onSaveNoteRef();
    }
  }, [appState]);

  useEffect(() => {
    return () => {
      onSaveNoteRef();
    };
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      onSaveNoteRef();
    });
    return () => unsubscribe();
  }, [navigation]);

  const onChange = (key: keyof NoteInput, value: string) => {
    setNote(prev => ({ ...prev, [key]: value }));
    debouncedSave();
  };

  const handleFocusTitle = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    if (note.content === '' && e.nativeEvent.key === 'Backspace') {
      titleRef.current?.focus();
    }
  };
  const handleFocusDescription = () => contentRef.current?.focus();

  return (
    <ScrollView
      style={globals.flex}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <ThemedView style={styles.container}>
        <TextInput
          ref={titleRef}
          autoFocus={!note.title}
          cursorColor={primary}
          selectionColor={primary}
          value={note.title}
          onChangeText={t => onChange('title', t)}
          style={[styles.title, { color: text }]}
          onSubmitEditing={handleFocusDescription}
          numberOfLines={1}
          placeholder={placeholder}
        />
        {note?.updatedAt && (
          <ThemedText style={[styles.date, { color: textMuted }]}>
            {dayjs(note.updatedAt).format('DD MMMM YYYY h:mm A')}
          </ThemedText>
        )}
        <TextInput
          ref={contentRef}
          cursorColor={primary}
          selectionColor={primary}
          value={note.content ?? ''}
          onChangeText={t => onChange('content', t)}
          style={[styles.content, { color: text }]}
          multiline
          onKeyPress={handleFocusTitle}
        />
      </ThemedView>
    </ScrollView>
  );
};

export default Note;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 12,
  },
  content: {
    fontSize: 17,
    lineHeight: 26,
    textAlignVertical: 'top',
    minHeight: HEIGHT,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
