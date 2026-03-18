// ChecklistItem.tsx — remove entering prop, use useEffect + useAnimatedStyle instead
import { Pressable, StyleSheet, View } from 'react-native';
import React, { FC, useCallback } from 'react';
import Checkbox from 'expo-checkbox';
import { ThemedText } from './ThemedText';
import { IEntry } from '@/db/schema';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useEntries } from '@/store/entries';
import { useTheme } from '@/hooks/useTheme';
import { useEffect } from 'react';

type ChecklistItemProps = {
  item: IEntry;
  onEdit: (item: IEntry) => void;
};

const ChecklistItem: FC<ChecklistItemProps> = ({ item, onEdit }) => {
  const { primary, primarySoft, icon } = useTheme();
  const { updateEntryStatus } = useEntries();

  // ✅ animate only on mount, never replays on re-render
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    opacity.value = withSpring(1, { damping: 20 });
    translateY.value = withSpring(0, { damping: 20 });
  }, []); // ✅ empty deps — runs once on mount only

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const toggleCheckbox = useCallback(async () => {
    try {
      await updateEntryStatus(item.id, !item.completed);
    } catch (error) {
      console.error('Error updating entry status:', error);
    }
  }, [item.id, item.completed, updateEntryStatus]);

  const handleEdit = useCallback(() => {
    onEdit(item);
  }, [item, onEdit]);

  return (
    <Animated.View style={[styles.container, { backgroundColor: primarySoft }, animatedStyle]}>
      <View
        style={[styles.accentBar, { backgroundColor: item.completed ? 'transparent' : primary }]}
      />
      <Pressable onPress={handleEdit} android_ripple={{ color: icon }} style={styles.content}>
        <Pressable onPress={toggleCheckbox} hitSlop={6}>
          <Checkbox
            style={styles.checkbox}
            color={item.completed ? primary : undefined}
            value={item.completed}
            onValueChange={toggleCheckbox}
          />
        </Pressable>
        <ThemedText
          style={{
            flex: 1,
            textDecorationLine: item.completed ? 'line-through' : 'none',
            opacity: item.completed ? 0.45 : 1,
          }}
          darkColor={icon}
        >
          {item.title}
        </ThemedText>
      </Pressable>
    </Animated.View>
  );
};

export default React.memo(ChecklistItem);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    overflow: 'hidden',
    minHeight: 60,
  },
  accentBar: {
    width: 4,
    alignSelf: 'stretch',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  checkbox: {
    borderRadius: 100,
    width: 25,
    height: 25,
  },
});
