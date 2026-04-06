import React from 'react';
import { router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import Button from '@/components/reuseables/Button';

export default function NotesLayout() {
  const { icon } = useTheme();
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          headerTitle: '',
          headerLeft: () => (
            <Button onPress={() => router.back()} hitSlop={10}>
              <Ionicons name="chevron-back" size={24} color={icon} />
            </Button>
          ),
        }}
      />
    </Stack>
  );
}
