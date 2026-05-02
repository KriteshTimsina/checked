// components/notes/blocks/ImageBlock.tsx
import React from 'react';
import { Image, StyleSheet, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';

type ImageBlockProps = {
  uri: string;
  onDelete: () => void;
};

export default function ImageBlock({ uri, onDelete }: ImageBlockProps) {
  const { border } = useTheme();

  return (
    <View style={[styles.container, { borderColor: border }]}>
      <Image source={{ uri }} style={styles.image} resizeMode="cover" />
      <Pressable onPress={onDelete} style={styles.deleteBtn}>
        <Ionicons name="close-circle" size={22} color="white" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    marginVertical: 4,
  },
  image: {
    width: '100%',
    height: 200,
  },
  deleteBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
});
