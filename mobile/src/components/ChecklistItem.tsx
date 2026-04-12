import { StyleSheet, View } from 'react-native';
import React, { FC, useCallback, useEffect } from 'react';
import Checkbox from 'expo-checkbox';
import { ThemedText } from './ThemedText';
import { IEntry } from '@/db/schema';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useEntries } from '@/store/entries';
import { useTheme } from '@/hooks/useTheme';
import { toast } from '@/utils/toast';
import SwipeableList, { SwipeActionButton } from './ui/SwipeableList';
import Button from '@/components/reuseables/Button';

type ChecklistItemProps = {
  item: IEntry;
  onEdit: (item: IEntry) => void;
};

const ChecklistItem: FC<ChecklistItemProps> = ({ item, onEdit }) => {
  const { primary, icon } = useTheme();
  const { updateEntryStatus, deleteEntry } = useEntries();

  const progress = useSharedValue(item.completed ? 1 : 0);
  const checkboxScale = useSharedValue(item.completed ? 1.05 : 0.9);

  useEffect(() => {
    const isDone = item.completed;

    progress.value = withTiming(isDone ? 1 : 0, { duration: 220 });

    checkboxScale.value = withSpring(isDone ? 1.05 : 0.9, {
      damping: 14,
      stiffness: 220,
    });
  }, [item.completed]);

  const toggleCheckbox = useCallback(() => {
    updateEntryStatus(item.id, !item.completed).catch(e =>
      console.error('Error updating entry status:', e),
    );
  }, [item.id, item.completed, updateEntryStatus]);

  const handleEdit = useCallback(() => {
    onEdit(item);
  }, [item, onEdit]);

  const onDelete = useCallback(() => {
    deleteEntry(item.id);
    toast('Deleted');
  }, [deleteEntry, item.id]);

  const strikeStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: progress.value }],
    opacity: 0.6,
  }));

  const checkboxStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkboxScale.value }],
  }));

  return (
    <SwipeableList
      onPress={handleEdit}
      renderRightActions={() => (
        <SwipeActionButton
          style={{ backgroundColor: '#ef4444' }}
          icon="trash-outline"
          onPress={onDelete}
        />
      )}
      renderLeftActions={() => (
        <SwipeActionButton
          style={{ backgroundColor: primary }}
          icon="pencil"
          onPress={handleEdit}
        />
      )}
    >
      <View style={styles.content}>
        <Button onPress={toggleCheckbox}>
          <Animated.View style={checkboxStyle}>
            <Checkbox
              style={styles.checkbox}
              color={item.completed ? primary : undefined}
              value={item.completed}
              onValueChange={toggleCheckbox}
              hitSlop={25}
            />
          </Animated.View>
        </Button>

        <View style={styles.textWrapper}>
          <ThemedText style={{ opacity: item.completed ? 0.45 : 1 }} darkColor={icon}>
            {item.title}
          </ThemedText>

          <Animated.View style={[styles.strikeLine, strikeStyle]} />
        </View>
      </View>
    </SwipeableList>
  );
};

export default React.memo(ChecklistItem);

const styles = StyleSheet.create({
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkbox: {
    borderRadius: 100,
    width: 25,
    height: 25,
  },
  textWrapper: {
    position: 'relative',
  },
  strikeLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '35%',
    height: 2,
    backgroundColor: 'black',
    transformOrigin: 'left',
    opacity: 0.45,
  },
});
