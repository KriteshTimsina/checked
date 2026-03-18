import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  TextInput,
  StyleSheet,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
  View,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useTheme } from '@/hooks/useTheme';
import dayjs from 'dayjs';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useNotes } from '@/store/notes';
import { INote } from '@/db/schema';
import { toast } from '@/utils/toast';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { haptics } from '@/utils/haptics';
import Button from '@/components/Button';
import { NoteMenu } from '@/components/ui/NotesMenu';

export type NoteInput = Pick<INote, 'title' | 'content'>;

const initialState: Partial<INote> = { title: '', content: '' };
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export default function Note() {
  const [note, setNote] = useState<Partial<INote>>(initialState);
  const [showHeaderTitle, setShowHeaderTitle] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const { noteId } = useLocalSearchParams<{ noteId: string }>();
  const { getNote, createNote, updateNote } = useNotes();
  const navigation = useNavigation();
  const titleOpacity = useSharedValue(1);
  const { text, textMuted, icon } = useTheme();

  const onSaveNoteRef = useRef<() => Promise<void>>();

  useEffect(() => {
    if (noteId) fetchNote();
  }, [noteId]);

  const fetchNote = async () => {
    const fetched = await getNote(Number(noteId));
    if (fetched) setNote(fetched);
  };

  const onSaveNote = useCallback(async () => {
    if (!note?.title?.trim()) return toast('Title cannot be empty.');
    try {
      const payload: NoteInput = { title: note.title!, content: note.content ?? '' };
      if (note?.id) {
        const updated = await updateNote(note.id, payload);
        if (updated) {
          haptics.success();
          toast('Saved');
        }
      } else {
        const created = await createNote(payload);
        if (created) {
          setNote(prev => ({ ...prev, id: created.id }));
          haptics.success();
          toast('Saved');
        }
      }
    } catch {
      haptics.error();
      toast('Error saving note');
    }
  }, [note, createNote, updateNote]);

  useEffect(() => {
    onSaveNoteRef.current = onSaveNote;
  }, [onSaveNote]);

  // ✅ isFocused and noteId both as deps so header always reflects latest state
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerRight}>
          {noteId && <NoteMenu noteId={Number(noteId)} />}
          {isFocused && (
            <Button style={styles.button} type="save" onPress={() => onSaveNoteRef.current?.()} />
          )}
        </View>
      ),
    });
  }, [isFocused, noteId]);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollY = e.nativeEvent.contentOffset.y;
    titleOpacity.value = 1 - scrollY / 100;
    setShowHeaderTitle(scrollY > 50);
    navigation.setOptions({ headerTitle: scrollY > 50 ? note.title : '' });
  };

  const onChange = (key: keyof NoteInput, value: string) => {
    setNote(prev => ({ ...prev, [key]: value }));
  };

  const titleStyles = useAnimatedStyle(() => ({ opacity: titleOpacity.value }));

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.contentContainer}
      >
        {!showHeaderTitle && (
          <AnimatedTextInput
            autoFocus={!noteId}
            placeholder="Title"
            placeholderTextColor={icon}
            style={[styles.title, titleStyles, { color: text }]}
            value={note.title}
            onChangeText={v => onChange('title', v)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        )}

        {noteId && (note?.updatedAt || note?.createdAt) && (
          <ThemedText style={[styles.date, { color: textMuted }]}>
            {dayjs(note.updatedAt ?? note.createdAt).format('DD MMMM YYYY h:mm A')}
          </ThemedText>
        )}

        <TextInput
          placeholder="Start writing..."
          placeholderTextColor={icon}
          style={[styles.content, { color: text }]}
          value={note.content ?? ''}
          onChangeText={v => onChange('content', v)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          multiline
          scrollEnabled={false}
          autoCorrect={false}
          autoCapitalize="none"
          textAlignVertical="top"
        />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  contentContainer: {
    gap: 8,
    paddingBottom: 120,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
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
    minHeight: 500,
  },
  button: {
    height: 35,
    width: 35,
  },
});
