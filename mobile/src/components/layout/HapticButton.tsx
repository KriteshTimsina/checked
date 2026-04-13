import { GestureResponderEvent, Pressable, PressableProps } from 'react-native';
import React, { FC } from 'react';
import { haptics } from '@/utils/haptics';

const HapticButton: FC<PressableProps> = ({ onPress, children, ...props }) => {
  const handlePress = (event: GestureResponderEvent) => {
    onPress?.(event);
    haptics.light();
  };
  return (
    <Pressable onPress={handlePress} {...props}>
      {children}
    </Pressable>
  );
};

export default HapticButton;
