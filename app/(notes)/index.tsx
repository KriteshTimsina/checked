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
import { Colors } from '@/constants/Colors';
import { ThemedText } from '@/components/ThemedText';
import dayjs from 'dayjs';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useNotes } from '@/store/notes';
import { INote } from '@/db/schema';
import { toast } from '@/utils/toast';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { EmbeddedRecording } from '@/components/EmbeddedRecording';
import { ThemedView } from '@/components/ThemedView';

export interface Recording {
  id: string;
  uri: string;
  duration: number;
}

export type NoteInput = Pick<INote, 'title' | 'content'>;

const initialState = {
  title: '',
  content: null,
};

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
  const { noteId } = useLocalSearchParams<{ noteId: string }>();
  const { getNote, createNote, updateNote } = useNotes();
  const [note, setNote] = useState<Partial<INote>>(initialState);
  const titleOpacity = useSharedValue(1);
  const [showHeaderTitle, setShowHeaderTitle] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    if (noteId) {
      fetchNote();
    }
  }, [noteId, getNote]);

  const fetchNote = async () => {
    const note = await getNote(Number(noteId));
    if (note) {
      setNote(note);
      setContent(note.content || '');
    }
  };

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollY = e.nativeEvent.contentOffset.y;
    titleOpacity.value = 1 - scrollY / 100;
    setShowHeaderTitle(scrollY > 50);

    navigation.setOptions({
      headerTitle: scrollY > 50 ? note.title : '',
    });
  };

  const onSaveNote = useCallback(async () => {
    if (!note?.title?.trim()) return;

    try {
      const saveOperation = note?.id
        ? () => updateNote(Number(noteId), { title: note.title, content } as NoteInput)
        : () => createNote({ title: note.title, content } as NoteInput);

      const saved = await saveOperation();
      if (saved) {
        toast('Saved');
      }
    } catch (error) {
      console.error(error, 'Error saving note');
      toast('Error saving note');
    }
  }, [note, content, createNote, updateNote, noteId]);

  const onChangeText = (key: keyof NoteInput, text: string) => {
    setNote(prev => ({ ...prev, [key]: text }));
  };

  const handlePlay = (uri: string) => {
    if (currentlyPlaying === uri) {
      setCurrentlyPlaying(null);
    } else {
      setCurrentlyPlaying(uri);
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    setTimeout(() => {
      const newRecording: Recording = {
        id: Date.now().toString(),
        uri: `recording-${Date.now()}`,
        duration: 2,
      };
      insertRecording(newRecording);
      setIsRecording(false);
    }, 2000);
  };

  const insertRecording = (recording: Recording) => {
    const recordingMarker = `\u200B[RECORDING_${recording.id}]\u200B`; // Using zero-width spaces
    const newContent =
      content.slice(0, cursorPosition) + recordingMarker + content.slice(cursorPosition);

    setContent(newContent);
    setRecordings([
      ...recordings,
      {
        id: recording.id,
        position: cursorPosition,
        recording,
      },
    ]);
  };

  const handleDelete = (id: string) => {
    const recordingToDelete = recordings.find(r => r.id === id);
    if (recordingToDelete) {
      const marker = `\u200B[RECORDING_${id}]\u200B`;
      const newContent = content.replace(marker, '');
      setContent(newContent);
      setRecordings(recordings.filter(r => r.id !== id));
    }
  };

  const renderContent = () => {
    let lastIndex = 0;
    const elements = [];
    const sortedRecordings = [...recordings].sort((a, b) => a.position - b.position);

    sortedRecordings.forEach(({ id, position, recording }) => {
      const marker = `\u200B[RECORDING_${id}]\u200B`;
      if (position > lastIndex) {
        elements.push(
          <TextInput
            key={`text-${lastIndex}-${position}`}
            style={styles.content}
            multiline
            value={content.slice(lastIndex, position).replace(/\u200B/g, '')} // Remove zero-width spaces
            onChangeText={text => updateTextPortion(lastIndex, position, text)}
            onSelectionChange={event => {
              setCursorPosition(event.nativeEvent.selection.start + lastIndex);
            }}
            scrollEnabled={false}
            placeholder="Your note here..."
            placeholderTextColor={Colors.dark.icon}
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

    // Add remaining text
    elements.push(
      <TextInput
        key={`text-${lastIndex}-end`}
        style={styles.content}
        scrollEnabled={false}
        multiline
        value={content.slice(lastIndex).replace(/\u200B/g, '')} // Remove zero-width spaces
        onChangeText={text => updateTextPortion(lastIndex, content.length, text)}
        onSelectionChange={event => {
          setCursorPosition(event.nativeEvent.selection.start + lastIndex);
        }}
        placeholder="Your note here..."
        placeholderTextColor={Colors.dark.icon}
        autoCorrect={false}
        autoCapitalize="none"
      />,
    );

    return elements;
  };

  const updateTextPortion = (start: number, end: number, newText: string) => {
    const newContent = content.slice(0, start) + newText + content.slice(end);
    setContent(newContent);
  };
  const titleStyles = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
  }));
  return (
    <ThemedView style={styles.container}>
      <ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        style={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        {!showHeaderTitle && (
          <AnimatedTextInput
            placeholder="Your title here"
            placeholderTextColor={Colors.dark.icon}
            style={[styles.title, titleStyles]}
            value={note.title}
            onChangeText={text => onChangeText('title', text)}
          />
        )}
        {noteId && (
          <ThemedText
            style={styles.date}
            darkColor={Colors.light.icon}
            lightColor={Colors.light.shade}
          >
            {note?.updatedAt
              ? dayjs(note?.updatedAt).format('DD MMMM YYYY h:mm A')
              : note?.createdAt
              ? dayjs(note?.createdAt).format('DD MMMM YYYY H:mm A')
              : ''}
          </ThemedText>
        )}
        <View style={{ flexGrow: 1 }}>{renderContent()}</View>
      </ScrollView>
      <View style={styles.recordingButton}>
        {note?.title && (
          <AnimatedPressable
            entering={FadeInDown.delay(200)}
            onPress={onSaveNote}
            style={styles.recordButton}
          >
            <Ionicons name={'checkmark'} size={24} color="white" />
          </AnimatedPressable>
        )}
        <AnimatedPressable
          entering={FadeInDown.delay(100)}
          onPress={isRecording ? () => {} : startRecording}
          style={[styles.recordButton, isRecording && styles.recordingActive]}
        >
          <Ionicons name={isRecording ? 'stop' : 'mic'} size={24} color="white" />
        </AnimatedPressable>
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

  recordingButton: {
    position: 'absolute',
    bottom: '10%',
    right: '10%',
    gap: 10,
  },
  recordButton: {
    backgroundColor: Colors.primary,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingActive: {
    backgroundColor: Colors.primary,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    fontSize: 18,
    color: Colors.dark.icon,
  },
  date: {
    fontSize: 12,
    marginBottom: 10,
  },
});
