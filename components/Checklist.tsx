import { Pressable, StyleSheet, View } from 'react-native';
import React, { FC } from 'react';
import Checkbox from 'expo-checkbox';
import { ThemedText } from './ThemedText';
import { IEntry } from '@/db/schema';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useEntries } from '@/store/entries';
import { useTheme } from '@/hooks/useTheme';
import debounce from 'lodash/debounce';

type ChecklistProps = {
  item: IEntry;
  openEditDialog: (item: IEntry) => void;
};

const AnimatedButton = Animated.createAnimatedComponent(Pressable);

const Checklist: FC<ChecklistProps> = ({ item, openEditDialog }) => {
  const { primary, primarySoft, icon } = useTheme();
  const { updateEntryStatus } = useEntries();

  const toggleCheckbox = debounce(async () => {
    try {
      await updateEntryStatus(item.id, !item.completed);
    } catch (error) {
      console.error('Error updating entry status:', error);
    }
  }, 100);

  return (
    <AnimatedButton
      onLongPress={() => openEditDialog(item)}
      entering={FadeInDown.delay(200)}
      onPress={toggleCheckbox}
      android_ripple={{ color: icon }}
      style={[styles.container, { backgroundColor: primarySoft }]}
    >
      {/* Left accent bar — matches ChecklistItem */}
      <View
        style={[styles.accentBar, { backgroundColor: item.completed ? 'transparent' : primary }]}
      />

      <View style={styles.content}>
        <Checkbox
          style={styles.checkbox}
          color={item.completed ? primary : undefined}
          value={item.completed}
          onValueChange={toggleCheckbox}
        />
        <ThemedText
          style={{
            flex: 1,
            textDecorationLine: item.completed ? 'line-through' : 'none',
            opacity: item.completed ? 0.45 : 1,
          }}
        >
          {item.title}
        </ThemedText>
      </View>
    </AnimatedButton>
  );
};

export default Checklist;

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
