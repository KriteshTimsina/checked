import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextStyle,
  ViewStyle,
  ActivityIndicator,
  PressableProps,
} from 'react-native';
import { HapticButton } from '@/components/layout';
import { useTheme } from '@/hooks/useTheme';

interface ButtonProps extends PressableProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  backgroundColor?: string;
}

const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'large',
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  containerStyle,
  titleStyle,
  onPress,
  backgroundColor,
  ...restProps
}) => {
  const { primary, surface } = useTheme();

  const getVariantStyles = (): ViewStyle => {
    if (disabled) return styles.disabledButton;

    const primaryButton = {
      backgroundColor: primary,
    };

    switch (variant) {
      case 'primary':
        return primaryButton;
      case 'secondary':
        return { backgroundColor: surface };
      case 'outline':
        return { backgroundColor: 'transparent', borderWidth: 1, borderColor: primary };
      default:
        return primaryButton;
    }
  };

  const getSizeStyles = (): ViewStyle => {
    switch (size) {
      case 'small':
        return styles.smallButton;
      case 'medium':
        return styles.mediumButton;
      case 'large':
        return styles.largeButton;
      default:
        return styles.mediumButton;
    }
  };

  const getTextSizeStyles = (): TextStyle => {
    switch (size) {
      case 'small':
        return { fontSize: 13 };
      case 'medium':
        return { fontSize: 15 };
      case 'large':
        return { fontSize: 17 };
      default:
        return { fontSize: 15 };
    }
  };

  const getTextColor = (): string => {
    if (disabled) return '#FFFFFF';
    switch (variant) {
      case 'primary':
        return '#FFFFFF';
      case 'secondary':
        return '#000000';
      case 'outline':
        return primary;
      default:
        return '#FFFFFF';
    }
  };

  return (
    <HapticButton
      style={[
        styles.button,
        getVariantStyles(),
        getSizeStyles(),
        containerStyle,
        backgroundColor ? { backgroundColor } : undefined,
      ]}
      onPress={onPress}
      disabled={disabled || isLoading}
      {...restProps}
    >
      {isLoading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <View style={styles.contentContainer}>
          {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
          <Text
            style={[styles.buttonText, { color: getTextColor() }, getTextSizeStyles(), titleStyle]}
          >
            {title}
          </Text>
          {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
        </View>
      )}
    </HapticButton>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 100,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },

  secondaryButton: {
    backgroundColor: '#E1E1E1',
  },

  disabledButton: {
    backgroundColor: '#808080',
  },
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  mediumButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  largeButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0.3,
    color: '#fff',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});

export default Button;
