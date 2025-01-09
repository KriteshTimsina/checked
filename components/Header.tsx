import { Colors } from '@/constants/Colors';
import { FC } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from './ThemedText';

const INITIAL_TITLE = 'Hello! 👋';

type HeaderProps = {
  title?: string;
  headerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export const Header: FC<HeaderProps> = ({ title = INITIAL_TITLE, headerStyle, textStyle }) => {
  return (
    <SafeAreaView>
      <View style={[styles.header, headerStyle]}>
        <ThemedText type="title" style={[styles.title, textStyle]}>
          {title}
        </ThemedText>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    borderBottomEndRadius: 30,
    borderBottomStartRadius: 30,
  },
  title: {
    color: Colors.light.text,
    padding: 10,
    paddingHorizontal: 20,
  },
});
