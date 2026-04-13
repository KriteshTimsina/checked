import { Pressable, PressableProps } from 'react-native';
import React, { FC } from 'react';
import { haptics } from '@/utils/haptics';

type ButtonProps = {
  onPress?: VoidFunction;
} & PressableProps;

const HapticButton: FC<ButtonProps> = ({ onPress, children, ...props }) => {
  const handlePress = () => {
    onPress?.();
    haptics.light();
  };
  return (
    <Pressable onPress={handlePress} {...props}>
      {children}
    </Pressable>
  );
};

export default HapticButton;
