import React from 'react';
import { Stack } from 'expo-router';

type NotesParamList = {
  index: { title?: string };
  success: undefined;
};

export default function NotesLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={({ route }) => ({
          presentation: 'card',
          headerShown: true,
          headerTitle: (route.params as NotesParamList['index'])?.title ?? 'Note',
        })}
      />
    </Stack>
  );
}
