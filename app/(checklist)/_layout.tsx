import React from 'react';
import { Stack } from 'expo-router';
import { StackScreenDefaultOptions } from '@/constants/layout';

export default function ChecklistLayout() {
  return (
    <Stack
      initialRouteName="index"
      screenOptions={{ ...StackScreenDefaultOptions, headerShown: false }}
    >
      <Stack.Screen
        options={{
          presentation: 'card',
          headerShown: true,
          headerTitle: 'Entry',
        }}
        name="index"
      />
      <Stack.Screen name="success" />
    </Stack>
  );
}
