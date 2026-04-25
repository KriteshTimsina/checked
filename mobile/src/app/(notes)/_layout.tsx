import React from 'react';
import { router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { HapticButton } from '@/components/layout';
import { Platform } from 'react-native';

export default function NotesLayout() {
  const { icon } = useTheme();
  const iconName = Platform.OS === 'android' ? 'arrow-back' : 'chevron-back';
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          headerTitle: '',
          headerLeft: () => (
            <HapticButton onPress={() => router.back()} hitSlop={10}>
              <Ionicons name={iconName} size={24} color={icon} />
            </HapticButton>
          ),
        }}
      />
    </Stack>
  );
}
