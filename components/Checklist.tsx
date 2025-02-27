import { Pressable, StyleSheet } from 'react-native';
import React, { FC } from 'react';
import { Colors } from '@/constants/Colors';
import Checkbox from 'expo-checkbox';
import { ThemedText } from './ThemedText';
import { IEntry } from '@/db/schema';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useEntries } from '@/store/entries';
import debounce from 'lodash/debounce';

type ChecklistProps = {
  item: IEntry;
  openEditDialog: (item: IEntry) => void;
};

const AnimatedButton = Animated.createAnimatedComponent(Pressable);

const Checklist: FC<ChecklistProps> = ({ item, openEditDialog }) => {
  const colorScheme = useColorScheme();
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
      android_ripple={{ color: Colors.light.icon }}
      style={[
        styles.container,
        { backgroundColor: colorScheme === 'dark' ? Colors.dark.shade : Colors.light.shade },
      ]}
    >
      <Checkbox
        style={styles.checkbox}
        color={Colors.highlight}
        value={item.completed}
        onValueChange={toggleCheckbox}
      />
      <ThemedText
        style={{
          textDecorationLine: item.completed ? 'line-through' : 'none',
        }}
      >
        {item.title}
      </ThemedText>
    </AnimatedButton>
  );
};
export default Checklist;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    borderRadius: 10,
    minHeight: 60,
    paddingHorizontal: 10,
  },
  checkbox: { borderRadius: 100, width: 25, height: 25 },
});
