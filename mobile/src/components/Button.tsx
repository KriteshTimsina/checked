import { Pressable, StyleSheet, ButtonProps as B, StyleProp, ViewStyle } from 'react-native';
import React, { FC } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';

type ButtonProps = {
  onPress: VoidFunction | null | undefined;
  type?: 'add' | 'save';
  style?: ViewStyle;
};

const Button: FC<ButtonProps> = ({ onPress, type = 'add', style }) => {
  const { primary } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: primary, ...style },
        pressed && styles.pressed,
      ]}
    >
      <Ionicons name={type === 'add' ? 'add' : 'checkmark'} size={24} color="white" />
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    height: 56,
    width: 56,
    borderRadius: 50,
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
