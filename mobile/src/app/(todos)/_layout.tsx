import React from 'react';
import { Stack } from 'expo-router';

export default function ChecklistLayout() {
  return (
    <Stack initialRouteName="index" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="success" />
    </Stack>
  );
}
