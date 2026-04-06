import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks/useTheme';
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const Footer = memo(() => {
  const { textMuted, primary } = useTheme();
  const { bottom } = useSafeAreaInsets();
  return (
    <View style={[styles.footer, { bottom: bottom + 40 }]}>
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
    paddingVertical: 12,
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});
