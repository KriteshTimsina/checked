import React from 'react';
import { Stack } from 'expo-router';

export default function NotesLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="note" />
    </Stack>
  );
}
