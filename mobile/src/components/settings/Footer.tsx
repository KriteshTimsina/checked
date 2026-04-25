import { ThemedText } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { memo } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { version } from '../../../package.json';

export const Footer = memo(() => {
  const { textMuted } = useTheme();
  return (
    <View style={[styles.footer]}>
      <ThemedText style={{ color: textMuted, fontSize: 12 }}>Version {version}</ThemedText>
    </View>
  );
});

Footer.displayName = 'Footer';

const styles = StyleSheet.create({
  footer: {
    paddingVertical: Platform.OS === 'ios' ? 10 : 25,
    alignItems: 'center',
  },
});
