import React from 'react';
import { router, Stack } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import { getColors } from '@/constants/colors';
import { usePreferences } from '@/hooks/usePreferences';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';

export default function NotesLayout() {
  const { icon } = useTheme();
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          headerTitle: '',
          headerStyle: {
            backgroundColor: 'white',
          },
          headerLeft: () => (
            <Pressable onPress={() => router.back()} hitSlop={10}>
              <Ionicons name="chevron-back" size={24} color={icon} />
            </Pressable>
          ),
        }}
      />
    </Stack>
  );
}
