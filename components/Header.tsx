import { Colors } from '@/constants/Colors';
import { FC } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

const INITIAL_TITLE = 'Hello! 👋';

type HeaderProps = {
  title?: string;
  headerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export const Header: FC<HeaderProps> = ({ title = INITIAL_TITLE, headerStyle, textStyle }) => {
  const { top } = useSafeAreaInsets();
  return (
    <ThemedView style={[{ paddingTop: top }, headerStyle]}>
      <ThemedText type="title" style={[styles.title, textStyle]}>
        {title}
      </ThemedText>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  title: {},
});
