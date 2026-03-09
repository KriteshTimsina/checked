import { Pressable, StyleSheet, View } from 'react-native';
import React, { memo } from 'react';

import { ThemedText } from './ThemedText';
import { useRouter } from 'expo-router';
import { INote } from '@/db/schema';
import dayjs from 'dayjs';
import { useTheme } from '@/hooks/useTheme';

const NoteItem = ({ item }: { item: INote }) => {
  const router = useRouter();
  const { primarySoft, text, textMuted, icon } = useTheme();

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
          backgroundColor: primarySoft,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
      onPress={() => onViewNote(item.id)}
    >
      <View style={styles.cardHeader}>
        <ThemedText numberOfLines={1} type="defaultSemiBold" style={styles.title} darkColor={icon}>
          {item.title}
        </ThemedText>
      </View>

      <ThemedText style={[styles.description, { color: textMuted }]} numberOfLines={6}>
        {item.content ?? 'No description...'}
      </ThemedText>

      <ThemedText style={[styles.date, { color: textMuted }]}>
        {item?.updatedAt
          ? dayjs(item?.updatedAt).format('MMM DD, hh:mm A')
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
    fontSize: 14,
  },
  date: {
    fontSize: 12,
  },
});
