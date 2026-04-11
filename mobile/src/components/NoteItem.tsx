import { StyleSheet, View } from 'react-native';
import React, { memo, useCallback } from 'react';

import { ThemedText } from './ThemedText';
import { INote } from '@/db/schema';
import dayjs from 'dayjs';
import { useTheme } from '@/hooks/useTheme';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import Button from '@/components/reuseables/Button';

type NoteItemProps = {
  item: INote;
  isSelecting: boolean;
  isSelected: boolean;
  onPress: (id: number) => void;
  onLongPress: (id: number) => void;
};

const NoteItem = ({ item, isSelecting, isSelected, onPress, onLongPress }: NoteItemProps) => {
  const { primarySoft, primary, textMuted, icon } = useTheme();
  const scale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.96, { damping: 20, stiffness: 300 });
  }, []);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 20, stiffness: 300 });
  }, []);

  const handlePress = useCallback(() => onPress(item.id), [item.id, onPress]);
  const handleLongPress = useCallback(() => onLongPress(item.id), [item.id, onLongPress]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.wrapper, animatedStyle]}>
      <Button
        onPress={handlePress}
        onLongPress={handleLongPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        delayLongPress={350}
        style={({ pressed }) => [
          styles.card,
          {
            backgroundColor: primarySoft,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          },
          isSelected && { borderColor: primary, borderWidth: 1.5 },
        ]}
      >
        {isSelecting && (
          <View
            style={[
              styles.checkbox,
              {
                backgroundColor: isSelected ? primary : primarySoft,
                borderColor: isSelected ? primary : textMuted,
              },
            ]}
          >
            {isSelected && <Ionicons name="checkmark" size={11} color="#fff" />}
          </View>
        )}
        <View style={styles.cardHeader}>
          <ThemedText
            numberOfLines={1}
            type="defaultSemiBold"
            style={styles.title}
            darkColor={icon}
          >
            {item.title}
          </ThemedText>
          {item.pinned && <AntDesign name="pushpin" color={primary} size={16} />}
        </View>

        <ThemedText style={[styles.description, { color: textMuted }]} numberOfLines={6}>
          {item.content ?? 'No description...'}
        </ThemedText>

        <ThemedText style={[styles.date, { color: textMuted }]}>
          {item?.updatedAt
            ? dayjs(item?.updatedAt).format('MMM DD, hh:mm A')
            : dayjs(item?.createdAt).format('MMM DD')}
        </ThemedText>
      </Button>
    </Animated.View>
  );
};

export default memo(NoteItem);

const styles = StyleSheet.create({
  wrapper: {
    width: '48%',
    marginHorizontal: 5,
  },
  card: {
    padding: 10,
    borderRadius: 6,
    height: 120,
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
  checkbox: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
});
