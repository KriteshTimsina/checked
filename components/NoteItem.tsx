import { Alert, Pressable, StyleSheet, View } from 'react-native';
import React, { memo } from 'react';

import { ThemedText } from './ThemedText';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { INote } from '@/db/schema';
import dayjs from 'dayjs';

const NoteItem = ({ item }: { item: INote }) => {
  const router = useRouter();

  const onViewNote = (id: number) => {
    router.push({
      pathname: '/(notes)',
      params: {
        noteId: id,
      },
    });
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: Colors.primary,
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
      </View>

      <ThemedText
        style={styles.description}
        numberOfLines={6}
        darkColor={Colors.light.icon}
        lightColor={Colors.light.shade}
      >
        {item.content ?? 'No text'}
      </ThemedText>
      <ThemedText style={styles.date} darkColor={Colors.light.icon} lightColor={Colors.light.shade}>
        {item?.updatedAt
          ? dayjs(item?.updatedAt).format('MMM DD')
          : dayjs(item?.createdAt).format('MMM DD')}
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
    flex: 1,
  },
  date: {
    fontSize: 12,
  },
});
