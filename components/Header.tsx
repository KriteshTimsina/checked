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
  const { top, left } = useSafeAreaInsets();
  return (
    <ThemedView
      style={[
        { paddingTop: top * 1.5, paddingLeft: 20, paddingBottom: 10 },
        styles.header,
        headerStyle,
      ]}
    >
      <ThemedText type="title" darkColor={Colors.light.text} style={[styles.title, textStyle]}>
        {title}
      </ThemedText>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.primary,
  },
  title: {},
});
