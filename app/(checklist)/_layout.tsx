import React from 'react';
import { Stack } from 'expo-router';

type ChecklistParamList = {
  index: { title?: string };
  success: undefined;
};

export default function ChecklistLayout() {
  return (
    <Stack initialRouteName="index" screenOptions={{ headerShown: false }}>
      <Stack.Screen
        options={({ route }) => ({
          headerShown: true,
          headerTitle: (route.params as ChecklistParamList['index'])?.title ?? 'Checklist',
        })}
        name="index"
      />
      <Stack.Screen name="success" />
    </Stack>
  );
}
