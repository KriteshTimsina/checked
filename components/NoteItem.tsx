import { Alert, Pressable, StyleSheet, View } from 'react-native';
import React, { memo } from 'react';

import { ThemedText } from './ThemedText';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { INote } from '@/db/schema';

const NoteItem = ({ item }: { item: INote }) => {
  const router = useRouter();
  const onDeleteNote = (id: number) => {
    Alert.alert('Delete Note', 'Are you sure you want to delete this note?', [
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: async () => {},
        style: 'destructive',
      },
    ]);
  };

  const onViewNote = (id: number) => {
    router.push({
      pathname: '/(notes)',
      params: {
        noteId: id,
        title: item.title,
      },
    });
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: item?.theme ?? Colors.primary,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
      onPress={() => onViewNote(item.id)}
    >
      <View style={styles.cardHeader}>
        <ThemedText
          numberOfLines={1}
          type="defaultSemiBold"
          darkColor={Colors.light.text}
          lightColor={Colors.dark.text}
        >
          {item.title}
        </ThemedText>
        {item?.clip !== '' && <MaterialIcons name="multitrack-audio" size={20} />}
      </View>

      <ThemedText numberOfLines={6} darkColor={Colors.light.icon} lightColor={Colors.light.shade}>
        {item.content}
      </ThemedText>
    </Pressable>
  );
};

export default memo(NoteItem);

const styles = StyleSheet.create({
  card: {
    width: '48%',
    padding: 10,
    margin: 5,
    borderRadius: 6,
  },

  title: {
    width: '80%',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  description: {
    color: Colors.highlight,
  },
});
