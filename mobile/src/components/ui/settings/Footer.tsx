import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks/useTheme';
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

export const Footer = memo(() => {
  const { textMuted, primary } = useTheme();
  return (
    <View style={[styles.footer]}>
      <ThemedText style={{ color: textMuted, fontSize: 13 }}>
        Created with love by{' '}
        <ThemedText type="link" style={{ color: primary, fontSize: 13 }}>
          Kritesh Timsina
        </ThemedText>
      </ThemedText>
    </View>
  );
});

Footer.displayName = 'Footer';

const styles = StyleSheet.create({
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});
