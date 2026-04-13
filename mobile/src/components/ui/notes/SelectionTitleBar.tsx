import { StyleSheet, View } from 'react-native';
import React from 'react';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks/useTheme';
import { HapticButton } from '@/components/layout';

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
        <HapticButton onPress={clearSelection} hitSlop={12}>
          <ThemedText style={[styles.cancelText, { color: primary }]}>Cancel</ThemedText>
        </HapticButton>
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
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
