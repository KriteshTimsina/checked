import { StyleSheet, FlatList } from 'react-native';
import React from 'react';
import EmptyProject from '@/components/EmptyProject';
import { ThemedView } from '@/components/ThemedView';
import { globals } from '@/styles/globals';
import Button from '@/components/Button';
import NoteItem from '@/components/NoteItem';

export interface INotes {
  id: number;
  title: string;
  content: string;
  isPinned: boolean;
  duration: string;
  clip: string | null;
  theme?: string;
}

export const notes = [
  {
    id: 1,
    title: 'How to be rich',
    content: 'This is the content of note 1.',
    isPinned: true,
    duration: '5 minutes',
    clip: null,
  },
  {
    id: 2,
    title: 'Note 2',
    content: 'This is the content of note 2.',
    isPinned: false,
    duration: '10 minutes',
    clip: null,
  },
];

export default function Notes() {
  return (
    <ThemedView style={globals.container}>
      <FlatList
        ListEmptyComponent={<EmptyProject type="notes" />}
        showsVerticalScrollIndicator={false}
        data={notes}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <NoteItem item={item} />}
        numColumns={2}
      />
      <Button onPress={() => {}} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({});
