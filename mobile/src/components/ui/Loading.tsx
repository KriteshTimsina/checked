import { ActivityIndicator, StyleSheet } from 'react-native';
import { ThemedView } from '@/components/layout';

import { Colors } from '@/constants/colors';

export const Loading = () => (
  <ThemedView style={styles.container}>
    <ActivityIndicator size="large" color={Colors.primary} />
  </ThemedView>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
