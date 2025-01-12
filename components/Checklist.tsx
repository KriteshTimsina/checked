import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { FC, useRef, useState } from 'react';
import { Colors } from '@/constants/Colors';
import Checkbox, { CheckboxEvent } from 'expo-checkbox';
import { ThemedText } from './ThemedText';
import { entries, IEntry } from '@/db/schema';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useDb } from '@/db/useDb';
import { eq } from 'drizzle-orm';

type ChecklistProps = {
  item: IEntry;
};

const AnimatedButton = Animated.createAnimatedComponent(Pressable);

const Checklist: FC<ChecklistProps> = ({ item }) => {
  const checkedRef = useRef<CheckboxEvent | null>(null);
  const [checked, setChecked] = useState(item.completed);
  const colorScheme = useColorScheme();
  const db = useDb();

  const toggleCheckbox = async () => {
    await db
      .update(entries)
      .set({
        completed: !checked,
      })
      .where(eq(entries.id, item.id))
      .returning({
        completed: entries.completed,
      });
    setChecked(!checked);
    checkedRef.current?.value === checked ? true : false;
  };

  return (
    <AnimatedButton
      entering={FadeInDown.delay(200)}
      onPress={toggleCheckbox}
      android_ripple={{ color: Colors.light.icon }}
      ref={checkedRef}
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
