import { Pressable, StyleSheet } from 'react-native';
import React, { FC } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useTheme } from '@/hooks/useTheme';

type ButtonProps = {
  onPress: () => void;
  type?: 'add' | 'save';
};

const Button: FC<ButtonProps> = ({ onPress, type = 'add' }) => {
  const { primary } = useTheme(); // You can replace this with useTheme() if you want it to be dynamic
  return (
    <Pressable onPress={onPress} style={[styles.button, { backgroundColor: primary }]}>
      <Ionicons name={type === 'add' ? 'add' : 'checkmark'} size={35} color="white" />
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    height: 50,
    width: 50,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: '10%',
    right: '10%',
  },
});
