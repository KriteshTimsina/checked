import React from 'react';
import { Modal, Pressable as RNPressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks/useTheme';
import { Pressable } from 'react-native-gesture-handler';
import { MenuAction } from '@/components/reuseables/ContextMenu';

type SelectionMenuProps = {
  visible: boolean;
  onClose: () => void;
  selectedCount: number;
  totalCount: number;
  onPin: () => void;
  onDelete: () => void;
};

export function SelectionMenu({
  visible,
  onClose,
  selectedCount,
  onPin,
  onDelete,
}: SelectionMenuProps) {
  const { card, text, textMuted, border, isDark, primary } = useTheme();

  const actions: MenuAction[] = [
    {
      id: 'pin',
      label: 'Pin',
      icon: <Ionicons name="pin-outline" size={18} color={primary} />,
      onPress: () => {
        onPin();
        onClose();
      },
      disabled: true,
    },
    {
      id: 'delete',
      label: `Delete${selectedCount > 0 ? ` (${selectedCount})` : ''}`,
      icon: <Ionicons name="trash-outline" size={18} color="#EF4444" />,
      onPress: () => {
        onDelete();
        onClose();
      },
      destructive: true,
      disabled: selectedCount === 0,
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <RNPressable style={styles.overlay} onPress={onClose}>
        <View
          pointerEvents="box-none"
          style={[
            styles.menu,
            {
              backgroundColor: card,
              borderColor: border,
              shadowColor: isDark ? '#000' : '#71717B',
            },
          ]}
        >
          {actions.map((action, index) => (
            <React.Fragment key={action.id}>
              {index > 0 && <View style={[styles.divider, { backgroundColor: border }]} />}
              <Pressable
                style={({ pressed }) => [
                  styles.item,
                  pressed && { backgroundColor: border + '60' },
                  action.disabled && styles.itemDisabled,
                ]}
                onPress={() => {
                  if (!action.disabled) action.onPress();
                }}
                android_ripple={{ color: border }}
              >
                <View style={styles.itemIcon}>{action.icon}</View>
                <ThemedText
                  style={[
                    styles.itemLabel,
                    { color: action.destructive ? '#EF4444' : text },
                    action.disabled && { color: textMuted },
                  ]}
                >
                  {action.label}
                </ThemedText>
              </Pressable>
            </React.Fragment>
          ))}
        </View>
      </RNPressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  menu: {
    position: 'absolute',
    bottom: 90, // ← sits just above the FAB
    right: 16,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    minWidth: 210,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: 12,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 12,
  },
  itemIcon: {
    width: 20,
    alignItems: 'center',
  },
  itemLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  itemDisabled: {
    opacity: 0.4,
  },
});
