import { View, Text } from 'react-native';
import React from 'react';
import { ThemedText } from '@/components/ThemedText';
import { Link } from 'expo-router';

export default function Notes() {
  return (
    <View>
      <ThemedText>Notes</ThemedText>
      <Link href={'/(notes)'}>
        <ThemedText>Note Single</ThemedText>
      </Link>
    </View>
  );
}
