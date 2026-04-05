import { Pressable, StyleSheet, View } from 'react-native';
import React, { FC, useCallback } from 'react';
import Checkbox from 'expo-checkbox';
import { ThemedText } from './ThemedText';
import { IEntry } from '@/db/schema';
import { useSharedValue, withSpring } from 'react-native-reanimated';
import { useEntries } from '@/store/entries';
import { useTheme } from '@/hooks/useTheme';
import { useEffect } from 'react';
import { toast } from '@/utils/toast';
import SwipeableList, { SwipeActionButton } from './ui/SwipeableList';

type ChecklistItemProps = {
  item: IEntry;
  onEdit: (item: IEntry) => void;
};

const ChecklistItem: FC<ChecklistItemProps> = ({ item, onEdit }) => {
  const { primary, icon } = useTheme();
  const { updateEntryStatus } = useEntries();
  const { deleteEntry } = useEntries();

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    opacity.value = withSpring(1, { damping: 20 });
    translateY.value = withSpring(0, { damping: 20 });
  }, []);

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

  const onDelete = () => {
    deleteEntry(item.id);
    toast('Deleted');
  };

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
        <Pressable onPress={toggleCheckbox}>
          <Checkbox
            style={styles.checkbox}
            color={item.completed ? primary : undefined}
            value={item.completed}
            onValueChange={toggleCheckbox}
            hitSlop={25}
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
});
