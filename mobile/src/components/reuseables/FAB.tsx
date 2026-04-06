import { Platform, Pressable, StyleSheet, ViewStyle } from 'react-native';
import React, { FC } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { haptics } from '@/utils/haptics';
import Button from '@/components/reuseables/Button';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

type FABProps = {
  onPress: VoidFunction | null | undefined;
  icon: IoniconsName;
  size?: number;
  style?: ViewStyle;
};

const FAB: FC<FABProps> = ({ onPress, icon, size = 24, style }) => {
  const { primary } = useTheme();
  const insets = useSafeAreaInsets();

  const bottomOffset = Math.max(insets.bottom, Platform.OS === 'android' ? 16 : 0);

  const handlePress = () => {
    haptics.success();
    onPress?.();
  };

  return (
    <Button
      onPress={handlePress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: primary,
          bottom: bottomOffset + 16,
          right: insets.right + 16,
          ...style,
        },
        pressed && styles.pressed,
      ]}
    >
      <Ionicons name={icon} size={size} color="white" />
    </Button>
  );
};

export default FAB;

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    height: 56,
    width: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 999,
  },
  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.94 }],
  },
});
