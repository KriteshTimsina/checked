import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Pressable,
  Dimensions,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useTheme } from '@/hooks/useTheme'; // ✅ our hook, not @react-navigation
import dayjs from 'dayjs';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useNotes } from '@/store/notes';
import { INote } from '@/db/schema';
import { toast } from '@/utils/toast';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { EmbeddedRecording } from '@/components/EmbeddedRecording';
import { haptics } from '@/utils/haptics';

export interface Recording {
  id: string;
  uri: string;
  duration: number;
}

export type NoteInput = Pick<INote, 'title' | 'content'>;

const initialState = { title: '', content: null };
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
const contentHeight = Dimensions.get('window').height - 200;

export default function Note() {
  const [content, setContent] = useState('');
  const [recordings, setRecordings] = useState<
    { id: string; position: number; recording: Recording }[]
  >([]);
  const [isRecording, setIsRecording] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [showHeaderTitle, setShowHeaderTitle] = useState(false);
  const [note, setNote] = useState<Partial<INote>>(initialState);

  const { noteId } = useLocalSearchParams<{ noteId: string }>();
  const { getNote, createNote, updateNote } = useNotes();
  const navigation = useNavigation();
  const titleOpacity = useSharedValue(1);

  // ✅ replaces: Colors.*, useTheme from @react-navigation
  const { primary, text, textMuted, icon } = useTheme();

  useEffect(() => {
    if (noteId) fetchNote();
  }, [noteId, getNote]);

  const fetchNote = async () => {
    const fetched = await getNote(Number(noteId));
    if (fetched) {
      setNote(fetched);
      setContent(fetched.content || '');
    }
  };

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollY = e.nativeEvent.contentOffset.y;
    titleOpacity.value = 1 - scrollY / 100;
    setShowHeaderTitle(scrollY > 50);
    navigation.setOptions({ headerTitle: scrollY > 50 ? note.title : '' });
  };

  const onSaveNote = useCallback(async () => {
    if (!note?.title?.trim()) return;
    try {
      const saveOperation = note?.id
        ? () => updateNote(Number(noteId), { title: note.title, content } as NoteInput)
        : () => createNote({ title: note.title, content } as NoteInput);
      const saved = await saveOperation();
      if (saved) {
        haptics.success();
        toast('Saved');
      }
    } catch (error) {
      haptics.error();
      console.error(error, 'Error saving note');
      toast('Error saving note');
    }
  }, [note, content, createNote, updateNote, noteId]);

  const onChangeText = (key: keyof NoteInput, value: string) => {
    setNote(prev => ({ ...prev, [key]: value }));
  };

  const handlePlay = (uri: string) => {
    setCurrentlyPlaying(prev => (prev === uri ? null : uri));
  };

  const insertRecording = (recording: Recording) => {
    const marker = `\u200B[RECORDING_${recording.id}]\u200B`;
    const newContent = content.slice(0, cursorPosition) + marker + content.slice(cursorPosition);
    setContent(newContent);
    setRecordings(prev => [...prev, { id: recording.id, position: cursorPosition, recording }]);
  };

  const handleDelete = (id: string) => {
    const marker = `\u200B[RECORDING_${id}]\u200B`;
    setContent(prev => prev.replace(marker, ''));
    setRecordings(prev => prev.filter(r => r.id !== id));
  };

  const updateTextPortion = (start: number, end: number, newText: string) => {
    setContent(content.slice(0, start) + newText + content.slice(end));
  };

  const renderContent = () => {
    let lastIndex = 0;
    const elements: React.ReactNode[] = [];
    const sorted = [...recordings].sort((a, b) => a.position - b.position);

    sorted.forEach(({ id, position, recording }) => {
      const marker = `\u200B[RECORDING_${id}]\u200B`;
      if (position > lastIndex) {
        elements.push(
          <TextInput
            key={`text-${lastIndex}-${position}`}
            style={[styles.contentInput, { color: text }]}
            multiline
            value={content.slice(lastIndex, position).replace(/\u200B/g, '')}
            onChangeText={t => updateTextPortion(lastIndex, position, t)}
            onSelectionChange={e => setCursorPosition(e.nativeEvent.selection.start + lastIndex)}
            scrollEnabled={false}
            placeholder="Your note here..."
            placeholderTextColor={icon}
            autoCorrect={false}
            autoCapitalize="none"
          />,
        );
      }
      elements.push(
        <EmbeddedRecording
          key={`recording-${id}`}
          recording={recording}
          onPlay={handlePlay}
          onDelete={handleDelete}
          isPlaying={currentlyPlaying === recording.uri}
        />,
      );
      lastIndex = position + marker.length;
    });

    elements.push(
      <TextInput
        key={`text-${lastIndex}-end`}
        style={[styles.contentInput, { color: text }]}
        scrollEnabled={false}
        multiline
        value={content.slice(lastIndex).replace(/\u200B/g, '')}
        onChangeText={t => updateTextPortion(lastIndex, content.length, t)}
        onSelectionChange={e => setCursorPosition(e.nativeEvent.selection.start + lastIndex)}
        placeholder="Your note here..."
        placeholderTextColor={icon}
        autoCorrect={false}
        autoCapitalize="none"
      />,
    );

    return elements;
  };

  const titleStyles = useAnimatedStyle(() => ({ opacity: titleOpacity.value }));

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        {!showHeaderTitle && (
          <AnimatedTextInput
            autoFocus={!noteId}
            placeholder="Your title here"
            placeholderTextColor={icon}
            style={[styles.title, titleStyles, { color: text }]}
            value={note.title}
            onChangeText={t => onChangeText('title', t)}
          />
        )}

        {noteId && (
          <ThemedText style={[styles.date, { color: textMuted }]}>
            {note?.updatedAt
              ? dayjs(note.updatedAt).format('DD MMMM YYYY h:mm A')
              : note?.createdAt
                ? dayjs(note.createdAt).format('DD MMMM YYYY H:mm A')
                : ''}
          </ThemedText>
        )}

        <View>{renderContent()}</View>
      </ScrollView>

      <View style={styles.fab}>
        {note?.title && (
          <AnimatedPressable
            entering={FadeInDown.delay(200)}
            onPress={onSaveNote}
            style={[styles.fabButton, { backgroundColor: primary, shadowColor: primary }]}
          >
            <Ionicons name="checkmark" size={24} color="#fff" />
          </AnimatedPressable>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    padding: 20,
  },
  scrollContainer: {
    flex: 1,
    height: contentHeight,
  },
  contentContainer: {
    gap: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  contentInput: {
    fontSize: 18,
  },
  date: {
    fontSize: 12,
  },
  fab: {
    position: 'absolute',
    bottom: '10%',
    right: '10%',
    gap: 10,
  },
  fabButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});
