import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import React from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { globals } from '@/styles/globals';

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
