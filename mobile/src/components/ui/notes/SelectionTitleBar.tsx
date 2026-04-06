import { Pressable, StyleSheet, View } from 'react-native';
import React from 'react';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks/useTheme';

type SelectionTitleBarProps = {
  isSelecting: boolean;
  selectedCount: number;
  clearSelection: VoidFunction;
};

const SelectionTitleBar = ({
  isSelecting,
  selectedCount,
  clearSelection,
}: SelectionTitleBarProps) => {
  const { primary } = useTheme();
  return (
    <View style={styles.titleBar}>
      <ThemedText type="title">
        {selectedCount ? `${selectedCount} Selected` : ' 📒 Your notes'}
      </ThemedText>

      {isSelecting && (
        <Pressable onPress={clearSelection} hitSlop={12}>
          <ThemedText style={[styles.cancelText, { color: primary }]}>Cancel</ThemedText>
        </Pressable>
      )}
    </View>
  );
};

export default SelectionTitleBar;

const styles = StyleSheet.create({
  titleBar: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
