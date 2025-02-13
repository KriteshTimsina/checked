import React from 'react';
import { Stack } from 'expo-router';
import { NoteMenu } from '@/components/NoteMenu';

type NoteParams = {
  index: { noteId?: number };
};

export default function NotesLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={({ route }) => {
          const noteId = (route.params as NoteParams['index'])?.noteId;
          return {
            headerShown: true,
            headerTitle: '',
            headerRight: () => noteId && <NoteMenu noteId={noteId} />,
          };
        }}
      />
    </Stack>
  );
}
