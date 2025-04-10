import React from 'react';
import { Text, type TextProps, StyleSheet } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextProps = TextProps & {
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

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
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
    color: '#0a7ea4',
    fontFamily: 'ClashGroteskMedium',
  },
});
