import { View, Text } from 'react-native';
import React from 'react';
import { Link, useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { notes } from '../(tabs)/notes';

export default function Index() {
  const { noteId } = useLocalSearchParams<{ noteId: string }>();
  console.log(noteId);
  const filteredNote = notes.find(note => note.id === Number(noteId));
  return (
    <View>
      <ThemedText>
        Notes {noteId}WHAT {JSON.stringify(filteredNote, null, 2)}
      </ThemedText>
    </View>
  );
}
