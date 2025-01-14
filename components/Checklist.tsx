import { Pressable, StyleSheet, Text } from 'react-native';
import React, { FC, useState } from 'react';
import { Colors } from '@/constants/Colors';
import Checkbox from 'expo-checkbox';
import { ThemedText } from './ThemedText';
import { IEntry } from '@/db/schema';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useEntries } from '@/store/entries';

type ChecklistProps = {
  item: IEntry;
};

const AnimatedButton = Animated.createAnimatedComponent(Pressable);

const Checklist: FC<ChecklistProps> = ({ item }) => {
  const [checked, setChecked] = useState(item.completed);
  const colorScheme = useColorScheme();
  const { updateEntryStatus } = useEntries();

  const toggleCheckbox = async () => {
    try {
      const newChecked = !checked;
      const isSuccess = await updateEntryStatus(item.id, newChecked);

      if (isSuccess) {
        setChecked(newChecked);
      }
    } catch (error) {
      console.error('Error updating entry status:', error);
    }
  };

  return (
    <AnimatedButton
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
        value={checked}
        onValueChange={toggleCheckbox}
      />
      <ThemedText
        style={{
          textDecorationLine: checked ? 'line-through' : 'none',
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
