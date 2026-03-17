import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import React, { FC } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';

type ButtonProps = {
  onPress: () => void;
  type?: 'add' | 'save';
  sticky?: boolean;
};

const Button: FC<ButtonProps> = ({ onPress, type = 'add', sticky = true }) => {
  const { primary } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        sticky ? styles.sticky : styles.inline,
        { backgroundColor: primary },
        pressed && styles.pressed,
      ]}
    >
      <Ionicons name={type === 'add' ? 'add' : 'checkmark'} size={sticky ? 28 : 20} color="white" />
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({
  inline: {
    height: 35,
    width: 35,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sticky: {
    height: 56,
    width: 56,
    borderRadius: 18,
    position: 'absolute',
    bottom: 28,
    right: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.94 }],
  },
});
