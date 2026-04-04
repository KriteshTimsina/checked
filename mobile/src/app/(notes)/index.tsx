import React, { useRef, useState } from 'react';
import {
  Dimensions,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  TextInput,
  TextInputKeyPressEventData,
  TextInputSubmitEditingEventData,
  View,
} from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { globals } from '@/styles/globals';
import { INote } from '@/db/schema';
import { useTheme } from '@/hooks/useTheme';
import dayjs from 'dayjs';

export type NoteInput = Pick<INote, 'title' | 'content'>;

const HEIGHT = Dimensions.get('window').height;

const Note = () => {
  const [note, setNote] = useState<NoteInput>({ title: '', content: '' });
  const { text, primary, textMuted } = useTheme();
  const contentRef = useRef<TextInput>(null);
  const titleRef = useRef<TextInput>(null);

  const onChange = (key: keyof NoteInput, value: string) => {
    setNote(prev => ({ ...prev, [key]: value }));
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
          autoFocus
          cursorColor={primary}
          selectionColor={primary}
          value={note.title}
          onChangeText={t => onChange('title', t)}
          style={[styles.title, { color: text }]}
          onSubmitEditing={handleFocusDescription}
          numberOfLines={1}
        />
        {/* {noteId && (note?.updatedAt || note?.createdAt) && (
                  <ThemedText style={[styles.date, { color: textMuted }]}>
                    {dayjs(note.updatedAt ?? note.createdAt).format('DD MMMM YYYY h:mm A')}
                  </ThemedText>
                )} */}

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
    minHeight: HEIGHT,
    // marginTop: 20,
  },
});
