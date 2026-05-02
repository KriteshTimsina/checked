// components/notes/BlockToolbar.tsx
import React from 'react';
import { View, Pressable, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { BlockType } from '@/db/schema';
import { ThemedText } from '../ui';

type ToolbarAction = {
  type: BlockType | 'image' | 'audio';
  icon: React.ComponentProps<typeof Ionicons>['name'];
};

const ACTIONS: ToolbarAction[] = [
  { type: 'image', icon: 'image-outline' },
  { type: 'audio', icon: 'mic-outline' },
];

type BlockToolbarProps = {
  onAction: (type: BlockType) => void;
};

export default function Toolbar({ onAction }: BlockToolbarProps) {
  const { card, border, text } = useTheme();

  return (
    <View style={[styles.toolbar, { backgroundColor: card, borderTopColor: border }]}>
      {ACTIONS.map(action => (
        <Pressable
          key={action.type}
          onPress={() => onAction(action.type as BlockType)}
          style={({ pressed }) => [styles.toolbarBtn, pressed && { backgroundColor: border }]}
        >
          <Ionicons name={action.icon} size={22} color={text} />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 4,
  },
  toolbarBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
