import { StyleProp, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import React from 'react';
import ThemedView from './ThemedView';
import { globals } from '@/styles/globals';
import ThemedText from '../ui/ThemedText';

const TitledScreen = ({
  title,
  titleStyles,
  children,
  style,
}: {
  title: string | React.ReactNode;
  titleStyles?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}) => {
  return (
    <ThemedView style={[globals.flex, style]}>
      {typeof title === 'string' ? (
        <ThemedText style={[styles.title, titleStyles]} type="title">
          {title}
        </ThemedText>
      ) : (
        title
      )}
      {children}
    </ThemedView>
  );
};

export default TitledScreen;

const styles = StyleSheet.create({
  title: {
    paddingHorizontal: 10,
  },
});
