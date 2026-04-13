import React from 'react';
import { router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { HapticButton } from '@/components/layout';

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
            <HapticButton onPress={() => router.back()} hitSlop={10}>
              <Ionicons name="chevron-back" size={24} color={icon} />
            </HapticButton>
          ),
        }}
      />
    </Stack>
  );
}
