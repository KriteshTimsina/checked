import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '@/hooks/useTheme';

const GearIcon = () => {
  const router = useRouter();
  const { primary } = useTheme();

  const handlePress = () => {
    router.push('/settings');
  };
  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [styles.icon, { transform: [{ scale: pressed ? 0.9 : 1 }] }]}
    >
      <Ionicons name="settings" size={26} color={primary} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  icon: {
    padding: 4,
    position: 'absolute',
    right: 20,
  },
});
export default GearIcon;
