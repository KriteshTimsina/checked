import React from 'react';
import { Text, type TextProps, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTheme } from '@/hooks/useTheme';
import Animated from 'react-native-reanimated';

type AnimatedTextProps = React.ComponentProps<typeof Animated.Text>;

export type ThemedTextProps = TextProps &
  AnimatedTextProps & {
    lightColor?: string;
    darkColor?: string;
    type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
    children: React.ReactNode;
  };

export function ThemedText({
  children,
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const { primary } = useTheme();

  return (
    <Text
      style={[
        { color },
        type === 'default' && styles.default,
        type === 'title' && styles.title,
        type === 'defaultSemiBold' && styles.defaultSemiBold,
        type === 'subtitle' && styles.subtitle,
        // link uses dynamic primary instead of hardcoded blue
        type === 'link' && [styles.link, { color: primary }],
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'ClashGroteskMedium',
  },
  defaultSemiBold: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
    fontFamily: 'ClashGroteskMedium',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 32,
    fontFamily: 'ClashGroteskMedium',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'ClashGroteskMedium',
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    fontFamily: 'ClashGroteskMedium',
    // color applied dynamically via primary above
  },
});
