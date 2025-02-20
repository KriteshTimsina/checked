import React from 'react';
import { Stack } from 'expo-router';
import { ChecklistMenu } from '@/components/ChecklistMenu';

type ChecklistParamList = {
  index: { title?: string };
  success: undefined;
};

export default function ChecklistLayout() {
  return (
    <Stack initialRouteName="index" screenOptions={{ headerShown: false }}>
      <Stack.Screen
        options={({ route }) => {
          const title = (route.params as ChecklistParamList['index'])?.title;

          return {
            headerShown: true,
            headerTitle: (route.params as ChecklistParamList['index'])?.title ?? 'Checklist',
            headerRight: () => title && <ChecklistMenu title={title} />,
          };
        }}
        name="index"
      />
      <Stack.Screen name="success" />
    </Stack>
  );
}
