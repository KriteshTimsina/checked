import React, { useCallback } from 'react';
import { Modal, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks/useTheme';

// ── Types ────────────────────────────────────────────────────────────────────

export type MenuAction = {
  id: string;
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
  destructive?: boolean;
  disabled?: boolean;
};

type ContextMenuProps = {
  visible: boolean;
  onOpen: () => void;
  onClose: () => void;
  actions: MenuAction[];
  topOffset?: number;
};

// ── Component ────────────────────────────────────────────────────────────────

export function ContextMenu({
  visible,
  onOpen,
  onClose,
  actions,
  topOffset = 50,
}: ContextMenuProps) {
  const { card, text, textMuted, border, isDark } = useTheme();

  return (
    <>
      <TouchableOpacity onPress={onOpen} hitSlop={8} style={styles.trigger}>
        <Ionicons name="ellipsis-vertical" size={22} color={text} />
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onClose}
        statusBarTranslucent
      >
        <Pressable style={styles.overlay} onPress={onClose}>
          <View
            style={[
              styles.menu,
              {
                top: topOffset,
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
        </Pressable>
      </Modal>
    </>
  );
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useContextMenu() {
  const [visible, setVisible] = React.useState(false);
  return {
    visible,
    open: () => setVisible(true),
    close: () => setVisible(false),
  };
}

// ── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  trigger: {
    padding: 2,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
  },
  menu: {
    position: 'absolute',
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
